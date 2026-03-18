---
title: "Foundations and Supervised Learning"
description: "A practical guide to machine learning foundations, model evaluation, validation, and core supervised learning algorithms for regression and classification."
keywords:
  - machine learning foundations
  - model evaluation
  - cross validation
  - bias variance tradeoff
  - supervised learning
  - regression
  - classification
  - logistic regression
  - support vector machines
  - decision trees
  - ensemble learning
sidebar_position: 1
---

# Foundations and Supervised Learning

This chapter is the foundation for the rest of the machine learning section. Before I worry about deep models, clustering, or reinforcement learning, I need a disciplined way to answer a simpler question: what does it mean for a model to be good?

That question leads naturally into supervised learning, because once I can evaluate a model honestly, I can compare the core algorithm families that learn from labeled examples.

## Model Evaluation and Validation

### Training, Testing, and the Generalization Problem

At its core, machine learning is about learning a mapping from inputs to outputs that still works on unseen data. That last part matters more than almost anything else. A model that performs brilliantly on the data it has already seen but fails on new inputs is not useful. It is memorizing, not generalizing.

The standard workflow is straightforward:

1. Split the data into training and testing partitions.
2. Train the model on the training set.
3. Use the test set only at the end for the final unbiased evaluation.

:::danger The Golden Rule

The test set must not influence model selection or tuning. If I use it during development, I am no longer measuring generalization. I am tuning to the answers.

:::

In practice, that usually looks like this:

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42,
)
```

The `random_state` matters because reproducibility matters. If I cannot reproduce the same split, I cannot reliably compare changes.

### Bias, Variance, and Model Complexity

The most important modeling trade-off is the bias-variance trade-off.

- **High bias** means the model is too simple. It underfits. It misses the underlying structure in the data and performs poorly even on the training set.
- **High variance** means the model is too sensitive to the training data. It overfits. It performs well on the training set but poorly on new data.

This is why model selection is not about finding the most complex algorithm. It is about finding the model complexity that is strong enough to capture the signal without memorizing the noise.

### Metrics for Regression and Classification

The right evaluation metric depends on the type of problem.

For regression, the common metrics are:

$$
\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|
$$

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

$$
R^2 = 1 - \frac{\sum_i (y_i - \hat{y}_i)^2}{\sum_i (y_i - \bar{y})^2}
$$

MAE is intuitive because it stays in the original units. MSE is useful because it penalizes large errors more strongly. $R^2$ is useful because it tells me how much variance the model explains relative to predicting the mean every time.

For classification, accuracy alone is often too crude, especially with imbalanced classes. The confusion matrix gives the more useful breakdown.

- `TP`: true positives
- `TN`: true negatives
- `FP`: false positives
- `FN`: false negatives

From that I get the metrics that actually matter:

$$
\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}
$$

$$
\text{Precision} = \frac{TP}{TP + FP}
$$

$$
\text{Recall} = \frac{TP}{TP + FN}
$$

$$
F_1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}
$$

If false positives are expensive, precision matters more. If false negatives are expensive, recall matters more. The metric should reflect the real failure cost, not the most convenient number.

### Validation, Cross-Validation, and Grid Search

To choose a model without contaminating the test set, I need a validation process. The standard approach is cross-validation.

In $k$-fold cross-validation, I split the training data into $k$ folds, train on $k-1$ of them, validate on the remaining fold, and repeat until every fold has served as validation once. The final score is the average across folds.

That gives a more stable estimate of model quality than a single lucky split.

Grid search automates hyperparameter selection on top of that process.

```python
from sklearn.model_selection import GridSearchCV
from sklearn.tree import DecisionTreeRegressor

param_grid = {
    "max_depth": [2, 4, 6, 8, 10],
    "min_samples_leaf": [1, 2, 4, 6],
}

grid_search = GridSearchCV(
    estimator=DecisionTreeRegressor(random_state=42),
    param_grid=param_grid,
    cv=5,
    scoring="r2",
    n_jobs=-1,
)

grid_search.fit(X_train, y_train)
best_model = grid_search.best_estimator_
final_score = best_model.score(X_test, y_test)
```

That workflow is one of the highest-leverage habits in practical ML. It separates honest evaluation from tuning.

## Supervised Learning Algorithms

Supervised learning assumes I have labeled examples. The job is to learn a function from features $x$ to labels $y$.

### Linear Models and Regularization

Linear regression is the simplest place to start. It models the prediction as a weighted sum of the inputs:

$$
\hat{y} = w^T x + b
$$

That simplicity matters because linear models are interpretable, fast, and often surprisingly strong baselines.

Polynomial regression extends the same idea by expanding the features. The model is still linear in the parameters, but it can express curved relationships through transformed inputs such as $x^2$ or $x^3$.

The danger is overfitting. Regularization controls that risk by penalizing large weights.

For L1 regularization:

$$
\mathcal{L}_{\text{L1}} = \mathcal{L} + \lambda \sum_j |w_j|
$$

For L2 regularization:

$$
\mathcal{L}_{\text{L2}} = \mathcal{L} + \lambda \sum_j w_j^2
$$

L1 tends to produce sparse models by driving some weights to zero. L2 tends to shrink weights smoothly. Both are ways of buying generalization with controlled simplicity.

### Logistic Regression and the Perceptron

For binary classification, the linear score becomes the input to a nonlinear decision rule.

The perceptron predicts based on the sign of a score:

$$
f(x) = \text{sign}(w^T x + b)
$$

Logistic regression instead turns the score into a probability with the sigmoid:

$$
\sigma(z) = \frac{1}{1 + e^{-z}}
$$

This gives:

$$
P(y=1 \mid x) = \sigma(w^T x + b)
$$

That probabilistic framing is what makes logistic regression such a strong default model for many tabular classification tasks.

### Naive Bayes

Naive Bayes is a probabilistic classifier built on Bayes' rule:

$$
P(y \mid x) = \frac{P(x \mid y)P(y)}{P(x)}
$$

Its simplifying assumption is that the features are conditionally independent given the class. That assumption is often false, but the model can still work well in practice because the resulting parameter estimation is simple, fast, and data-efficient.

### Support Vector Machines

Support Vector Machines search for a separating hyperplane with maximum margin. The important idea is not merely classification, but robust classification. A larger margin usually means better generalization.

The hyperparameter $C$ controls the trade-off between margin width and training errors.

- Large $C$ pushes harder to classify all training points correctly.
- Small $C$ allows some training mistakes in exchange for a wider margin.

The kernel trick extends SVMs beyond linear separation by implicitly mapping inputs into higher-dimensional spaces.

### Decision Trees and Information Gain

Decision trees split the data with a sequence of feature-based questions. The split criterion often relies on entropy:

$$
H(S) = - \sum_i p_i \log_2 p_i
$$

Information gain measures how much entropy is reduced by a split:

$$
\text{IG}(S, A) = H(S) - \sum_{v \in Values(A)} \frac{|S_v|}{|S|} H(S_v)
$$

This is why trees are easy to explain. Every internal node corresponds to a concrete decision rule, and every leaf corresponds to a prediction.

The downside is that unconstrained trees overfit aggressively. Hyperparameters such as `max_depth` and `min_samples_leaf` are not optional details. They are structural controls on model complexity.

### Ensemble Methods

Ensemble methods improve performance by combining multiple weaker models.

Bagging, as used in random forests, reduces variance. It trains many trees on bootstrap samples and aggregates their predictions.

Boosting reduces bias by training weak learners sequentially, each one paying more attention to the previous model's mistakes. In AdaBoost, the sample weights are updated after each round so the hard examples matter more in the next learner.

The general pattern is simple: one tree is unstable, many diverse trees are much harder to fool.

## What This Means in Practice

The main lesson of this chapter is that good supervised learning is less about algorithm shopping than about disciplined evaluation.

If I cannot split data correctly, choose metrics that reflect the real cost of failure, and tune without contaminating the test set, then even a sophisticated model will mislead me. Once that foundation is in place, the classical model families become much easier to reason about: linear models for simplicity, SVMs for strong boundaries, trees for interpretability, and ensembles for raw tabular performance.

## What to Read Next

Continue to [Unsupervised Learning and Feature Engineering](/ai/ml/unsupervised-learning-and-feature-engineering) if you want to work without labels, or jump to [Foundations and CNNs](/ai/dl/foundations-and-cnns) if your main interest is neural models.