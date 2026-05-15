---
title: "Feature Engineering"
description: "A practical guide to feature engineering for machine learning, including transformations, encoding, selection, leakage prevention, and production-ready feature pipelines."
keywords:
  - feature engineering
  - feature selection
  - data preprocessing
  - encoding
  - normalization
  - feature pipelines
  - data leakage
  - mlops
sidebar_position: 4
---

# Feature Engineering

Feature engineering is where raw data becomes model-ready representation. In many tabular ML projects, this step creates more lift than switching algorithms.

A strong feature pipeline does three things at once:

- improves signal-to-noise ratio,
- preserves evaluation integrity,
- stays reproducible in production.

## Representation Before Algorithm

I treat feature design as a modeling decision, not a preprocessing chore.

Useful transformations include:

- scaling and normalization for magnitude-sensitive models,
- log or power transforms for heavy-tailed variables,
- interaction features for nonlinear effects,
- aggregation features for entity-level behavior.

When feature design reflects domain mechanism, simpler models often become competitive with complex ones.

## Categorical Encoding Strategies

Encoding method should match cardinality and model behavior.

- one-hot encoding: strong default for low-cardinality categories,
- target encoding: useful for high cardinality but requires leakage-safe cross-fold fitting,
- hashing: good for very large sparse vocabularies with controlled memory usage.

High-cardinality features can dominate memory and overfit quickly if encoded carelessly.

## Missing Data and Robust Imputation

Missingness is information in many datasets.

A practical strategy:

1. add missingness indicator features,
2. impute with median/mode or model-based methods,
3. evaluate sensitivity by subgroup.

I avoid fitting imputers on full data before splitting, because that leaks test distribution statistics.

## Feature Selection and Dimensional Control

More features are not always better. Redundant or noisy features increase variance and operational complexity.

Selection methods:

- filter methods (correlation, mutual information),
- wrapper methods (recursive feature elimination),
- embedded methods (L1 regularization, tree importance).

I prioritize stability across validation folds over one-shot importance rankings.

## Leakage-Safe Pipelines

Feature engineering must be inside the validation pipeline, not precomputed globally.

A safe scikit-learn pattern:

```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression

numeric_pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
])

categorical_pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore")),
])

preprocess = ColumnTransformer([
    ("num", numeric_pipe, numeric_cols),
    ("cat", categorical_pipe, categorical_cols),
])

model = Pipeline([
    ("preprocess", preprocess),
    ("clf", LogisticRegression(max_iter=200)),
])
```

This keeps transformations fit only on training folds during cross-validation.

## Production Alignment and Feature Drift

A model can be accurate offline and fail online if feature semantics drift.

I monitor:

- distribution shift in key features,
- upstream schema changes,
- delayed label feedback for performance decay.

Feature contracts and versioned feature definitions reduce brittle handoffs between data and serving teams.

## What This Means in Practice

Feature engineering is where modeling assumptions become concrete. Good feature pipelines improve accuracy, robustness, and maintainability at the same time.

## What to Read Next

Continue to [Reinforcement Learning](/ai/ml/reinforcement-learning) for environments where performance depends on sequential actions and delayed reward, or revisit [Supervised Learning](/ai/ml/supervised-learning) to benchmark how feature changes alter model behavior.
