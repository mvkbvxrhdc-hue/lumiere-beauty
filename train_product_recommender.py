import csv
import json
import math
from datetime import datetime, timezone
from pathlib import Path

from app.product_recommendation_model import FEATURE_NAMES, PRODUCT_EMBEDDING_SIZE, USER_EMBEDDING_SIZE, hash_embedding


DATA_PATH = Path("data/product_recommender_training_seed.csv")
MODEL_PATH = Path("app/ml_models/product_recommender_model.json")


def main() -> None:
    rows = load_rows(DATA_PATH)
    hidden_weights, output_weights = train_neural_cf(rows)
    accuracy = evaluate(rows, hidden_weights, output_weights)
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    MODEL_PATH.write_text(
        json.dumps(
            {
                "algorithm": "neural-collaborative-filtering-mlp",
                "version": "product-ncf-shadow-v1",
                "architecture": "user skin-profile embedding + product embedding + content features -> hidden neural layer -> suitability score",
                "trainedAt": datetime.now(timezone.utc).isoformat(),
                "trainingRows": len(rows),
                "trainingAccuracy": accuracy,
                "featureNames": FEATURE_NAMES
                + [f"userEmbedding{index + 1}" for index in range(USER_EMBEDDING_SIZE)]
                + [f"productEmbedding{index + 1}" for index in range(PRODUCT_EMBEDDING_SIZE)],
                "userEmbeddings": build_embedding_map(rows, "userSegment", USER_EMBEDDING_SIZE),
                "productEmbeddings": build_embedding_map(rows, "productId", PRODUCT_EMBEDDING_SIZE),
                "hiddenWeights": hidden_weights,
                "outputWeights": output_weights,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Saved product recommender model to {MODEL_PATH}")
    print(f"Training accuracy: {accuracy}")


def load_rows(path: Path) -> list[dict[str, object]]:
    with path.open("r", encoding="utf-8", newline="") as csv_file:
        reader = csv.DictReader(csv_file)
        return [
            {
                "label": float(row["label"]),
                "userSegment": row.get("userSegment") or "combination:uneven-tone",
                "productId": row.get("productId") or "p1",
                "features": [float(row[name]) for name in FEATURE_NAMES]
                + hash_embedding(row.get("userSegment") or "combination:uneven-tone", USER_EMBEDDING_SIZE)
                + hash_embedding(row.get("productId") or "p1", PRODUCT_EMBEDDING_SIZE),
            }
            for row in reader
        ]


def train_neural_cf(
    rows: list[dict[str, object]],
    hidden_units: int = 6,
    epochs: int = 1200,
    learning_rate: float = 0.08,
) -> tuple[list[list[float]], list[float]]:
    input_size = len(rows[0]["features"])
    hidden_weights = [
        [0.01 * ((unit + 1) * (index + 2) % 7 - 3) for index in range(input_size + 1)]
        for unit in range(hidden_units)
    ]
    output_weights = [0.0] + [0.05 * (-1 if index % 2 else 1) for index in range(hidden_units)]
    for _ in range(epochs):
        for row in rows:
            features = [1.0] + row["features"]
            hidden_raw = [sum(weight * value for weight, value in zip(unit_weights, features)) for unit_weights in hidden_weights]
            hidden = [math.tanh(value) for value in hidden_raw]
            prediction = sigmoid(output_weights[0] + sum(weight * value for weight, value in zip(output_weights[1:], hidden)))
            error = prediction - row["label"]
            for index, value in enumerate(hidden):
                output_weights[index + 1] -= learning_rate * error * value
            output_weights[0] -= learning_rate * error
            for unit_index, unit_weights in enumerate(hidden_weights):
                hidden_error = error * output_weights[unit_index + 1] * (1 - hidden[unit_index] ** 2)
                for index, value in enumerate(features):
                    unit_weights[index] -= learning_rate * hidden_error * value
    return (
        [[round(value, 6) for value in unit_weights] for unit_weights in hidden_weights],
        [round(value, 6) for value in output_weights],
    )


def evaluate(rows: list[dict[str, object]], hidden_weights: list[list[float]], output_weights: list[float]) -> float:
    correct = 0
    for row in rows:
        features = [1.0] + row["features"]
        hidden = [math.tanh(sum(weight * value for weight, value in zip(unit_weights, features))) for unit_weights in hidden_weights]
        prediction = sigmoid(output_weights[0] + sum(weight * value for weight, value in zip(output_weights[1:], hidden)))
        if (prediction >= 0.5) == bool(row["label"]):
            correct += 1
    return round(correct / len(rows), 3)


def build_embedding_map(rows: list[dict[str, object]], key: str, size: int) -> dict[str, list[float]]:
    return {str(row[key]): hash_embedding(str(row[key]), size) for row in rows}


def sigmoid(value: float) -> float:
    return 1 / (1 + math.exp(-value))


if __name__ == "__main__":
    main()
