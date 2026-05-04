import json
import math
import os
from pathlib import Path
from typing import Any


FEATURE_NAMES = [
    "ruleScore",
    "skinTypeMatch",
    "rating",
    "inStock",
    "priceValue",
    "hydrationMatch",
    "oilControlMatch",
    "acnePoreMatch",
    "pigmentationMatch",
    "textureMatch",
    "agingMatch",
    "sensitivityMatch",
    "spfMatch",
]
USER_EMBEDDING_SIZE = 4
PRODUCT_EMBEDDING_SIZE = 4

DEFAULT_MODEL_PATH = Path(__file__).parent / "ml_models" / "product_recommender_model.json"


def get_model_path() -> Path:
    configured_path = os.getenv("PRODUCT_RECOMMENDER_MODEL_PATH")
    return Path(configured_path) if configured_path else DEFAULT_MODEL_PATH


def score_shadow_recommendations(analysis: dict[str, Any], items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    model_path = get_model_path()
    if not model_path.exists():
        return [
            {
                "product_id": item["product"]["id"],
                "visible_rank": item["visible_rank"],
                "rule_score": item["rule_score"],
                "model_score": None,
                "model_status": "fallback",
                "confidence": None,
                "top_feature_signals": [],
            }
            for item in items
        ]

    try:
        with model_path.open("r", encoding="utf-8") as model_file:
            model = json.load(model_file)
        hidden_weights = model["hiddenWeights"]
        output_weights = model["outputWeights"]
        scored_items = []
        for item in items:
            features = extract_neural_features(model, analysis, item["product"], item["rule_score"])
            hidden = [
                math.tanh(weights[0] + sum(weight * value for weight, value in zip(weights[1:], features)))
                for weights in hidden_weights
            ]
            logit = output_weights[0] + sum(weight * value for weight, value in zip(output_weights[1:], hidden))
            probability = 1 / (1 + math.exp(-logit))
            scored_items.append(
                {
                    "product_id": item["product"]["id"],
                    "visible_rank": item["visible_rank"],
                    "rule_score": item["rule_score"],
                    "model_score": round(probability * 100, 2),
                    "model_status": "active",
                    "algorithm": model.get("algorithm", "neural-collaborative-filtering-mlp"),
                    "confidence": round(abs(probability - 0.5) * 2, 4),
                    "top_feature_signals": _top_feature_signals(output_weights, hidden, features),
                }
            )
        return scored_items
    except Exception as exc:
        return [
            {
                "product_id": item["product"]["id"],
                "visible_rank": item["visible_rank"],
                "rule_score": item["rule_score"],
                "model_score": None,
                "model_status": "fallback",
                "confidence": None,
                "top_feature_signals": [{"reason": f"Model scoring failed: {exc}"}],
            }
            for item in items
        ]


def extract_neural_features(model: dict[str, Any], analysis: dict[str, Any], product: dict[str, Any], rule_score: float) -> list[float]:
    content_features = extract_features(analysis, product, rule_score)
    user_segment = build_user_segment(analysis)
    product_id = str(product.get("id") or "unknown")
    user_embedding = model.get("userEmbeddings", {}).get(user_segment) or hash_embedding(user_segment, USER_EMBEDDING_SIZE)
    product_embedding = model.get("productEmbeddings", {}).get(product_id) or hash_embedding(product_id, PRODUCT_EMBEDDING_SIZE)
    return content_features + user_embedding + product_embedding


def build_user_segment(analysis: dict[str, Any]) -> str:
    skin_type = str(analysis.get("skinType") or "unknown").lower()
    concerns = [str(item).lower().replace(" ", "-") for item in analysis.get("concerns") or []]
    primary = concerns[0] if concerns else "maintenance"
    return f"{skin_type}:{primary}"


def hash_embedding(value: str, size: int) -> list[float]:
    seed = sum((index + 1) * ord(char) for index, char in enumerate(value))
    return [
        round((((seed * (index + 3) * 37) % 200) - 100) / 100, 4)
        for index in range(size)
    ]


def extract_features(analysis: dict[str, Any], product: dict[str, Any], rule_score: float) -> list[float]:
    metrics = analysis.get("detailedMetrics") or {}
    concerns = " ".join(analysis.get("concerns") or []).lower()
    skin_type = str(analysis.get("skinType") or "").lower()
    category = str(product.get("category") or "").lower()
    text = " ".join(
        [
            str(product.get("name") or ""),
            str(product.get("description") or ""),
            " ".join(product.get("highlights") or []),
        ]
    ).lower()
    skin_types = [str(value).lower() for value in product.get("skin_types") or product.get("skinTypes") or []]
    rating = float(product.get("rating") or 0)
    price = float(product.get("price") or 0)

    return [
        min(rule_score, 100) / 100,
        1.0 if "all skin types" in skin_types or any(skin_type and skin_type in value for value in skin_types) else 0.0,
        max(0, min(rating / 5, 1)),
        1.0 if product.get("in_stock", True) else 0.0,
        max(0, 1 - min(price, 120) / 120),
        _condition(metrics.get("moisture", 100) < 50, _has_any(text, ["hydrat", "hyaluronic", "moisture", "plump"])),
        _condition(metrics.get("oiliness", 0) > 58 or "oily" in skin_type, _has_any(text, ["oil", "sebum", "niacinamide", "clay", "purif"])),
        _condition(metrics.get("poreClogging", 0) > 52 or "acne" in concerns, _has_any(text, ["bha", "aha", "salicyl", "blemish", "pore", "clay"])),
        _condition(
            metrics.get("hyperpigmentation", 0) > 45 or "dark" in concerns or "uneven" in concerns,
            _has_any(text, ["vitamin c", "bright", "dark spot", "tone"]),
        ),
        _condition(metrics.get("roughness", 0) > 50 or metrics.get("texture", 100) < 55, _has_any(text, ["exfoliat", "smooth", "texture", "toner"])),
        _condition(metrics.get("fineLines", 0) > 45 or metrics.get("elasticity", 100) < 55, _has_any(text, ["retinol", "peptide", "collagen", "firm", "anti-aging"])),
        _condition(metrics.get("redness", 0) > 50 or "sensitive" in skin_type, _has_any(text, ["gentle", "sooth", "calm", "fragrance-free"])),
        1.0 if category == "sunscreen" or _has_any(text, ["spf", "sunscreen"]) else 0.0,
    ]


def _has_any(text: str, keywords: list[str]) -> bool:
    return any(keyword in text for keyword in keywords)


def _condition(condition: bool, match: bool) -> float:
    return 1.0 if condition and match else 0.0


def _top_feature_signals(output_weights: list[float], hidden: list[float], features: list[float]) -> list[dict[str, Any]]:
    hidden_signals = [
        {
            "feature": f"hidden_neuron_{index + 1}",
            "value": round(value, 4),
            "contribution": round(weight * value, 4),
        }
        for index, (value, weight) in enumerate(zip(hidden, output_weights[1:]))
    ]
    feature_names = FEATURE_NAMES + [
        *(f"userEmbedding{index + 1}" for index in range(USER_EMBEDDING_SIZE)),
        *(f"productEmbedding{index + 1}" for index in range(PRODUCT_EMBEDDING_SIZE)),
    ]
    signals = [
        {
            "feature": feature_name,
            "value": round(value, 4),
            "contribution": 0,
        }
        for feature_name, value in zip(feature_names, features)
        if value
    ]
    return sorted(hidden_signals, key=lambda item: abs(item["contribution"]), reverse=True)[:3] + signals[:2]
