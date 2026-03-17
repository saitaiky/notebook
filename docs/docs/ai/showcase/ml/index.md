---
title: "Machine Learning Showcase Index"
description: "Project index for machine learning showcases, linked to evaluation, modeling, and reinforcement learning study notes."
keywords:
  - "machine learning showcase"
  - "model evaluation"
  - "supervised learning"
  - "unsupervised learning"
  - "cross validation"
  - "feature engineering"
  - "reinforcement learning"
  - "deep learning"
sidebar_position: 0
---

This section summarizes the machine learning projects and points to the exact note sections for theory and implementation patterns.

## Projects in this section

- [House Price Prediction](./boston-housing): In this project, I implement a full regression workflow: feature inspection, model training, hyperparameter tuning, and metric-based validation. It shows how bias-variance trade-offs and cross-validation strategy directly influence prediction quality for tabular business data.
- [Donor Prediction](./finding-donors): This project builds a binary classification pipeline to identify likely donors and evaluates models with precision, recall, and F-score instead of accuracy alone. The project emphasizes threshold choices and class-imbalance handling to align model behavior with real campaign goals.
- [Customer Segments](./customer-segments): In this project, I apply unsupervised learning to discover customer groups through scaling, dimensionality reduction, and clustering. The workflow demonstrates how latent structure can guide segmentation strategy even when labels are unavailable.
- [Dog Breed Classifier](./dog-breed-classifier): This project uses CNN-based transfer learning to classify dog breeds from images and compares pre-trained backbones for practical performance. It demonstrates how to build a usable vision model with limited data by leveraging learned representations.
- [Teach A Quadcopter How To Fly](./teach-a-quadcopter-how-to-fly): In this project, I train an RL agent with a reward-driven objective to control a simulated quadcopter. The project clarifies how state design, reward shaping, and exploration policy determine whether the learned controller is stable or fragile.
- [SMD Defect Detection](./smd-defect-detection): This capstone-style project applies machine learning to industrial defect detection, combining model development with data-quality constraints and evaluation criteria from manufacturing contexts. It highlights the gap between notebook accuracy and deployment-readiness in real inspection pipelines.

## Key knowledge to learn

- High-level roadmap in [ML Overview](/ai/ml).
- Evaluation, bias-variance, cross-validation, and hyperparameter tuning in [Core Concepts, Models & Evaluation](/ai/ml/term1).
- Supervised and unsupervised algorithm families in [Term 1](/ai/ml/term1), including dedicated sections on classification, clustering, and dimensionality reduction.
- Deep learning and reinforcement learning foundations in [Deep Learning, CNNs & Reinforcement Learning](/ai/ml/term2).

## Suggested learning flow

1. Start with [House Price Prediction](./boston-housing) and [Donor Prediction](./finding-donors), then study model evaluation and supervised learning in [Term 1](/ai/ml/term1).
2. Continue with [Customer Segments](./customer-segments), then review clustering and dimensionality reduction sections in [Term 1](/ai/ml/term1).
3. Finish with [Dog Breed Classifier](./dog-breed-classifier) and [Teach A Quadcopter How To Fly](./teach-a-quadcopter-how-to-fly), then consolidate with [Term 2](/ai/ml/term2).
