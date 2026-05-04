import json
import math
import os
from pathlib import Path
from typing import Any
import base64
import io

from PIL import Image, ImageOps


FEATURE_NAMES = [
    "meanR",
    "meanG",
    "meanB",
    "stdR",
    "stdG",
    "stdB",
    "brightness",
    "textureFreq",
    "entropy",
    "localContrast",
    "topBrightness",
    "topStd",
    "midBrightness",
    "midStd",
    "bottomBrightness",
    "bottomStd",
]

DEFAULT_MODEL_PATH = Path(__file__).parent / "ml_models" / "skin_type_model.json"

CNN_SIZE = 12
CNN_FILTERS = [
    {
        "name": "edge_texture",
        "weights": [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]],
        "bias": 0.0,
    },
    {
        "name": "vertical_contrast",
        "weights": [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]],
        "bias": 0.0,
    },
    {
        "name": "horizontal_contrast",
        "weights": [[-1, -2, -1], [0, 0, 0], [1, 2, 1]],
        "bias": 0.0,
    },
    {
        "name": "shine_blob",
        "weights": [[0.5, 1, 0.5], [1, 2, 1], [0.5, 1, 0.5]],
        "bias": -2.0,
    },
]


def get_model_path() -> Path:
    configured_path = os.getenv("SKIN_MODEL_PATH")
    return Path(configured_path) if configured_path else DEFAULT_MODEL_PATH


def extract_model_features(pixel_stats: dict[str, Any]) -> list[float]:
    zones = pixel_stats.get("zones") or {}
    top = zones.get("top") or {}
    mid = zones.get("mid") or {}
    bottom = zones.get("bottom") or {}
    return [
        _scale(pixel_stats.get("meanR"), 255),
        _scale(pixel_stats.get("meanG"), 255),
        _scale(pixel_stats.get("meanB"), 255),
        _scale(pixel_stats.get("stdR"), 128),
        _scale(pixel_stats.get("stdG"), 128),
        _scale(pixel_stats.get("stdB"), 128),
        _number(pixel_stats.get("brightness")),
        _number(pixel_stats.get("textureFreq")),
        _number(pixel_stats.get("entropy")),
        _number(pixel_stats.get("localContrast")),
        _number(top.get("brightness")),
        _scale(top.get("std"), 80),
        _number(mid.get("brightness")),
        _scale(mid.get("std"), 80),
        _number(bottom.get("brightness")),
        _scale(bottom.get("std"), 80),
    ]


def predict_skin_model(pixel_stats: dict[str, Any], image_data_url: str | None = None) -> dict[str, Any]:
    model_path = get_model_path()
    if not model_path.exists():
        return {
            "modelStatus": "fallback",
            "available": False,
            "reason": f"Model file not found at {model_path}",
        }

    try:
        with model_path.open("r", encoding="utf-8") as model_file:
            model = json.load(model_file)
        features = extract_cnn_model_features(pixel_stats, image_data_url)
        labels = model["labels"]
        weights = model["weights"]
        logits = [
            weights[label][0] + sum(weight * value for weight, value in zip(weights[label][1:], features))
            for label in labels
        ]
        probabilities = _softmax(logits)
        ranked = sorted(zip(labels, probabilities), key=lambda item: item[1], reverse=True)
        prediction = ranked[0][0]
        confidence = round(ranked[0][1] * 100)
        return {
            "modelStatus": "active",
            "available": True,
            "algorithm": model.get("algorithm", "lightweight-cnn-softmax"),
            "version": model.get("version", "unknown"),
            "mode": "shadow",
            "architecture": model.get(
                "architecture",
                "12x12 image grid -> 3x3 convolution filters -> global average pooling -> softmax head",
            ),
            "trainedAt": model.get("trainedAt"),
            "trainingRows": model.get("trainingRows"),
            "validationAccuracy": model.get("validationAccuracy"),
            "predictedSkinType": prediction,
            "confidence": confidence,
            "probabilities": {label: round(probability, 4) for label, probability in ranked},
            "topFeatureSignals": _top_feature_signals(model, prediction, features),
        }
    except Exception as exc:
        return {
            "modelStatus": "fallback",
            "available": False,
            "reason": f"Model prediction failed: {exc}",
        }


def merge_model_analysis(rule_result: dict[str, Any], pixel_stats: dict[str, Any], image_data_url: str | None = None) -> dict[str, Any]:
    model_analysis = predict_skin_model(pixel_stats, image_data_url)
    merged = dict(rule_result)
    merged["analysisEngine"] = "hybrid-rule-demo-plus-trained-model"
    merged["modelAnalysis"] = model_analysis
    if model_analysis.get("available"):
        merged["modelSkinType"] = model_analysis["predictedSkinType"]
        merged["modelConfidence"] = model_analysis["confidence"]
    return merged


def extract_cnn_model_features(pixel_stats: dict[str, Any], image_data_url: str | None = None) -> list[float]:
    grid = image_data_url_to_cnn_grid(image_data_url) if image_data_url else pixel_stats_to_cnn_grid(pixel_stats)
    conv_features = apply_cnn_feature_extractor(grid)
    return conv_features + extract_model_features(pixel_stats)


def image_data_url_to_cnn_grid(image_data_url: str) -> list[list[float]]:
    if "," in image_data_url and image_data_url.strip().lower().startswith("data:"):
        _, encoded = image_data_url.split(",", 1)
    else:
        encoded = image_data_url
    image = Image.open(io.BytesIO(base64.b64decode(encoded, validate=True)))
    image = ImageOps.exif_transpose(image).convert("L")
    image = ImageOps.fit(image, (CNN_SIZE, CNN_SIZE), method=Image.Resampling.LANCZOS)
    pixels = list(image.getdata())
    return [
        [pixels[y * CNN_SIZE + x] / 255 for x in range(CNN_SIZE)]
        for y in range(CNN_SIZE)
    ]


def pixel_stats_to_cnn_grid(pixel_stats: dict[str, Any]) -> list[list[float]]:
    zones = pixel_stats.get("zones") or {}
    zone_values = [
        _number((zones.get("top") or {}).get("brightness")) or _number(pixel_stats.get("brightness")),
        _number((zones.get("mid") or {}).get("brightness")) or _number(pixel_stats.get("brightness")),
        _number((zones.get("bottom") or {}).get("brightness")) or _number(pixel_stats.get("brightness")),
    ]
    texture = _number(pixel_stats.get("textureFreq"))
    contrast = _number(pixel_stats.get("localContrast"))
    grid: list[list[float]] = []
    for y in range(CNN_SIZE):
        zone = zone_values[min(2, y // 4)]
        row = []
        for x in range(CNN_SIZE):
            checker = 0.04 if (x + y) % 2 == 0 else -0.04
            center_boost = max(0, 1 - (abs(x - 5.5) + abs(y - 5.5)) / 12) * contrast * 0.08
            row.append(max(0, min(1, zone + checker * texture + center_boost)))
        grid.append(row)
    return grid


def apply_cnn_feature_extractor(grid: list[list[float]]) -> list[float]:
    features: list[float] = []
    for cnn_filter in CNN_FILTERS:
        activations: list[float] = []
        kernel = cnn_filter["weights"]
        bias = float(cnn_filter["bias"])
        for y in range(CNN_SIZE - 2):
            for x in range(CNN_SIZE - 2):
                value = bias
                for ky in range(3):
                    for kx in range(3):
                        value += grid[y + ky][x + kx] * kernel[ky][kx]
                activations.append(max(0, value))
        avg_activation = sum(activations) / len(activations)
        max_activation = max(activations)
        features.extend([avg_activation, max_activation])
    return features


def _number(value: Any) -> float:
    return float(value) if isinstance(value, (int, float)) else 0.0


def _scale(value: Any, divisor: float) -> float:
    return _number(value) / divisor


def _softmax(logits: list[float]) -> list[float]:
    max_logit = max(logits)
    exps = [math.exp(logit - max_logit) for logit in logits]
    total = sum(exps)
    return [value / total for value in exps]


def _top_feature_signals(model: dict[str, Any], label: str, features: list[float]) -> list[dict[str, Any]]:
    weights = model["weights"][label][1:]
    feature_names = [f"{item['name']}_{stat}" for item in CNN_FILTERS for stat in ("avg", "max")] + FEATURE_NAMES
    contributions = [
        {
            "feature": feature_name,
            "value": round(value, 4),
            "contribution": round(weight * value, 4),
        }
        for feature_name, value, weight in zip(feature_names, features, weights)
    ]
    return sorted(contributions, key=lambda item: abs(item["contribution"]), reverse=True)[:5]
