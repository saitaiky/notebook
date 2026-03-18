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

- Read [AI Prerequisites](/ai/prerequisites) if you want a quick check on the math, Python, and notation background assumed by the notes.
- Use [AI Overview](/ai) to see how machine learning fits with classical AI, deep learning, and LLM-specific material.
- High-level roadmap in [ML Overview](/ai/ml).
- Evaluation, bias-variance, cross-validation, and core supervised algorithms in [Foundations and Supervised Learning](/ai/ml/foundations-and-supervised-learning).
- Clustering, scaling, PCA, and segmentation workflows in [Unsupervised Learning and Feature Engineering](/ai/ml/unsupervised-learning-and-feature-engineering).
- Deep learning and vision-model foundations in [Foundations and CNNs](/ai/dl/foundations-and-cnns).
- Sequential decision-making foundations in [Reinforcement Learning](/ai/ml/reinforcement-learning).

## Suggested learning flow

1. Start with [AI Overview](/ai), and use [AI Prerequisites](/ai/prerequisites) if you want a quick readiness pass before the project material.
2. Work through [House Price Prediction](./boston-housing) and [Donor Prediction](./finding-donors), then study [Foundations and Supervised Learning](/ai/ml/foundations-and-supervised-learning).
3. Continue with [Customer Segments](./customer-segments), then review [Unsupervised Learning and Feature Engineering](/ai/ml/unsupervised-learning-and-feature-engineering).
4. Finish with [Teach A Quadcopter How To Fly](./teach-a-quadcopter-how-to-fly), then consolidate with [Reinforcement Learning](/ai/ml/reinforcement-learning).
5. Use [Dog Breed Classifier](./dog-breed-classifier) as the handoff into [Foundations and CNNs](/ai/dl/foundations-and-cnns) if you want to continue into the deep-learning track.
