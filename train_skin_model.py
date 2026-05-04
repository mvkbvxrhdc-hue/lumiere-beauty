import csv
import json
import math
from datetime import datetime, timezone
from pathlib import Path

from app.ml_skin_model import CNN_FILTERS, FEATURE_NAMES, extract_cnn_model_features


DATA_PATH = Path("data/skin_model_training_seed.csv")
MODEL_PATH = Path("app/ml_models/skin_type_model.json")
LABELS = ["Dry", "Normal", "Oily", "Sensitive", "Combination"]


def main() -> None:
    rows = load_rows(DATA_PATH)
    train_rows = [row for index, row in enumerate(rows) if index % 5 != 0]
    validation_rows = [row for index, row in enumerate(rows) if index % 5 == 0]
    weights = train_softmax(train_rows)
    validation_accuracy = evaluate(validation_rows, weights)
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    MODEL_PATH.write_text(
        json.dumps(
            {
                "algorithm": "lightweight-cnn-softmax",
                "version": "skin-cnn-shadow-v1",
                "architecture": "12x12 image grid -> fixed 3x3 convolution filters -> global average pooling -> softmax classification head",
                "trainedAt": datetime.now(timezone.utc).isoformat(),
                "trainingRows": len(train_rows),
                "validationRows": len(validation_rows),
                "validationAccuracy": validation_accuracy,
                "featureNames": [f"{item['name']}_{stat}" for item in CNN_FILTERS for stat in ("avg", "max")] + FEATURE_NAMES,
                "cnnFilters": CNN_FILTERS,
                "labels": LABELS,
                "weights": weights,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Saved model to {MODEL_PATH}")
    print(f"Validation accuracy: {validation_accuracy}")


def load_rows(path: Path) -> list[dict[str, object]]:
    with path.open("r", encoding="utf-8", newline="") as csv_file:
        reader = csv.DictReader(csv_file)
        rows = []
        for row in reader:
            rows.append(
                {
                    "label": row["label"],
                    "features": extract_cnn_model_features(row_to_pixel_stats(row)),
                }
            )
    return rows


def row_to_pixel_stats(row: dict[str, str]) -> dict[str, object]:
    return {
        "meanR": float(row["meanR"]) * 255,
        "meanG": float(row["meanG"]) * 255,
        "meanB": float(row["meanB"]) * 255,
        "stdR": float(row["stdR"]) * 128,
        "stdG": float(row["stdG"]) * 128,
        "stdB": float(row["stdB"]) * 128,
        "brightness": float(row["brightness"]),
        "textureFreq": float(row["textureFreq"]),
        "entropy": float(row["entropy"]),
        "localContrast": float(row["localContrast"]),
        "zones": {
            "top": {"brightness": float(row["topBrightness"]), "std": float(row["topStd"]) * 80},
            "mid": {"brightness": float(row["midBrightness"]), "std": float(row["midStd"]) * 80},
            "bottom": {"brightness": float(row["bottomBrightness"]), "std": float(row["bottomStd"]) * 80},
        },
    }


def train_softmax(rows: list[dict[str, object]], epochs: int = 1200, learning_rate: float = 0.18) -> dict[str, list[float]]:
    feature_count = len(rows[0]["features"])
    weights = {label: [0.0] * (feature_count + 1) for label in LABELS}
    for _ in range(epochs):
        for row in rows:
            features = [1.0] + row["features"]
            probabilities = predict_probabilities(features, weights)
            for label in LABELS:
                target = 1.0 if row["label"] == label else 0.0
                error = probabilities[label] - target
                for index, value in enumerate(features):
                    weights[label][index] -= learning_rate * error * value
    return {label: [round(value, 6) for value in values] for label, values in weights.items()}


def predict_probabilities(features: list[float], weights: dict[str, list[float]]) -> dict[str, float]:
    logits = {
        label: sum(weight * value for weight, value in zip(label_weights, features))
        for label, label_weights in weights.items()
    }
    max_logit = max(logits.values())
    exps = {label: math.exp(logit - max_logit) for label, logit in logits.items()}
    total = sum(exps.values())
    return {label: value / total for label, value in exps.items()}


def evaluate(rows: list[dict[str, object]], weights: dict[str, list[float]]) -> float:
    if not rows:
        return 0.0
    correct = 0
    for row in rows:
        probabilities = predict_probabilities([1.0] + row["features"], weights)
        predicted = max(probabilities, key=probabilities.get)
        if predicted == row["label"]:
            correct += 1
    return round(correct / len(rows), 3)


if __name__ == "__main__":
    main()
