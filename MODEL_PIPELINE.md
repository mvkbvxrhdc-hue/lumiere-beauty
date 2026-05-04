# Skin Analysis Model Pipeline

This MVP now keeps the original explainable rule-based demo and adds a trained model channel.

## Current Runtime Flow

1. The frontend still performs the original rich demo analysis so the UI remains unchanged.
2. The frontend syncs `pixelStats` to the backend.
3. The backend runs the original rule-based analysis.
4. The backend loads `app/ml_models/skin_type_model.json` and runs a shadow-mode CNN-style skin diagnosis model.
5. The API returns both outputs:
   - `skinType`, `detailedMetrics`, `concerns`, routines, and recommendations from the original demo engine.
   - `modelAnalysis` from the trained model.

If the model file is missing or invalid, the API returns `modelAnalysis.modelStatus = "fallback"` and the original demo analysis still works.

## Training

The training script is pure Python and does not require heavy ML dependencies:

```bash
python train_skin_model.py
```

It reads:

```text
data/skin_model_training_seed.csv
```

and writes:

```text
app/ml_models/skin_type_model.json
```

## How To Improve The Model Later

Replace or expand `data/skin_model_training_seed.csv` with real labelled examples collected from:

- user-uploaded skin images
- dermatologist-labelled skin type
- labelled concerns such as acne, redness, dryness, pigmentation, pores
- lighting and image-quality metadata

The current model is designed as a lightweight MVP CNN pipeline: a 12x12 image grid is passed through fixed 3x3 convolution filters, pooled into image features, and classified with a trained softmax head. A future upgrade would replace this lightweight CNN with a larger transfer-learning model trained on a dermatologist-labelled image dataset.

## Product Recommendation Shadow Model

Product cards are still displayed using the original demo recommendation engine. In parallel, the frontend sends the visible product picks to the backend:

```text
POST /api/v1/recommendations/shadow-score
```

The backend runs a shadow-mode neural collaborative filtering recommender and stores each recommendation impression in:

```text
recommendation_events
```

The visible UI is not changed by this model yet. This makes the recommendation layer safer for an MVP: the demo remains stable, while the system collects `rule_score`, `model_score`, visible rank, product metadata, user profile, and analysis metrics for later neural ranking evaluation.

Train the current lightweight product model with:

```bash
python train_product_recommender.py
```

It reads:

```text
data/product_recommender_training_seed.csv
```

and writes:

```text
app/ml_models/product_recommender_model.json
```
