---
title: "Machine Learning Foundations"
description: "A practical foundation for machine learning: problem framing, honest evaluation, validation strategy, and failure analysis before algorithm selection."
keywords:
  - machine learning foundations
  - model evaluation
  - train test split
  - cross validation
  - bias variance
  - data leakage
  - baseline models
sidebar_position: 1
---

# Machine Learning Foundations

This page is about the part of machine learning that usually decides project quality before I pick any fancy algorithm. If the problem framing is wrong, the data split is leaky, or the metric does not match business cost, I can still get a high score and ship a bad system.

Foundations are not a warm-up chapter. They are the control system for every chapter that follows.

## Problem Framing Before Modeling

A model only learns the problem I define. If the target and constraints are ambiguous, training becomes a guessing game.

I always lock these first:

- prediction type: regression, classification, ranking, or recommendation,
- decision horizon: one-shot prediction vs repeated prediction over time,
- failure cost: what happens if the model is wrong in each direction,
- operational constraints: latency, explainability, data freshness, and retraining cadence.

This prevents common mistakes like optimizing ROC-AUC when the product actually needs high precision at a strict review budget.

## Data Splits and Leakage Control

A split is not only about percentages. It is about simulation fidelity.

The split strategy should mirror production:

- random split for i.i.d. tabular tasks,
- group split when entities repeat (user, account, patient),
- time-based split when future data must never leak into the past.

A safe baseline pattern is:

1. keep a final holdout test set untouched,
2. run model selection on the training partition with cross-validation,
3. evaluate once on test after all tuning decisions are fixed.

:::danger Leakage Rule

If any information from validation or test influences feature engineering, threshold setting, or hyperparameter choices, evaluation is optimistic and no longer trustworthy.

:::

## Metrics That Match Real Cost

No metric is universally correct. The right metric depends on the asymmetry of error cost.

For regression:

$$
\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|
$$

$$
\text{RMSE} = \sqrt{\frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2}
$$

For classification, accuracy is only a starting point. Precision, recall, and calibration usually matter more:

$$
\text{Precision} = \frac{TP}{TP + FP}, \quad \text{Recall} = \frac{TP}{TP + FN}
$$

I choose metrics by asking: which error type is expensive, and how expensive.

## Validation and Model Selection

Cross-validation is how I reduce the risk of a lucky split.

In $k$-fold cross-validation, each fold acts as validation once, and performance is averaged. This gives a more stable estimate than a single train/validation split.

Hyperparameter search sits on top of this process. Grid search is exhaustive over a small space; random search explores broader spaces faster; Bayesian methods are useful when training is expensive.

A practical process:

1. establish a baseline model,
2. define a constrained search space,
3. compare by mean and variance across folds,
4. inspect failure slices, not only aggregate score.

## Bias, Variance, and Learning Curves

Most model failures are a bias or variance problem in disguise.

- high bias: both training and validation performance are poor,
- high variance: training is strong but validation drops.

Learning curves make this visible quickly and help choose the next intervention:

- add capacity or better features for high bias,
- add regularization, simplify model, or gather more data for high variance.

## Baselines and Error Analysis

A baseline is required, not optional. If a complex model barely beats a simple baseline, complexity is probably not justified.

Useful baseline types:

- mean/median predictor for regression,
- majority class predictor for classification,
- regularized linear/logistic model for fast interpretable reference.

After baseline comparison, I inspect failure segments:

- data slices with systematic underperformance,
- threshold-sensitive regions,
- outlier populations and long-tail behavior.

This often reveals that data quality or feature representation is the bottleneck, not algorithm family.

## Reproducibility and Experiment Hygiene

Foundations include operational discipline:

- fixed seeds where appropriate,
- versioned datasets and feature definitions,
- tracked experiment configs and metrics,
- clear separation between research and production inference code paths.

Without this, improvements are hard to trust and harder to maintain.

## What This Means in Practice

A strong ML project starts with trustworthy evaluation and clear decision criteria. Once that foundation is stable, algorithm-level choices in supervised or unsupervised learning become much easier to reason about.

## What to Read Next

Continue to [Supervised Learning](/ai/ml/supervised-learning) for regression and classification model families, or move to [Unsupervised Learning](/ai/ml/unsupervised-learning) if your task has no labels.
