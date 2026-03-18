---
title: "An Engineer's Guide to Machine Learning"
description: "A practical overview of machine learning topics, from evaluation and supervised learning to unsupervised methods and reinforcement learning, with deep learning linked as its own section."
keywords:
  - machine learning
  - supervised learning
  - unsupervised learning
  - deep learning
  - reinforcement learning
  - model evaluation
  - cross validation
---

:::warning As of July 2024
It might take me a bit to get everything written down, but I'll carve out some time for this section (there's just so much new tech these days!). In the meantime, I've set up a [showcase section](/ai/showcase/) where you can check out all the source code and demos of the techniques I'll be covering. Stay tuned and happy learning!
:::

## Overview

Machine learning is a practical discipline for building systems that improve from data rather than from fixed hand-written rules. That sentence is broad enough to sound vague, so the only useful way to make it concrete is to walk through the problem types one by one.

This section is organized around those problem types rather than around course terms. I care less about when a topic was taught and more about what engineering problem it solves.

## What This Section Covers

The first part focuses on model evaluation and supervised learning. This is where I learn how to split data properly, reason about bias and variance, choose the right metric, tune hyperparameters without contaminating the test set, and compare the main supervised algorithm families. That includes linear models, logistic regression, Naive Bayes, SVMs, decision trees, and ensemble methods.

The second part focuses on unsupervised learning and feature engineering. This is the part I reach for when I do not have labels but still need structure: customer segmentation, feature scaling, clustering, dimensionality reduction, and internal validation.

The third part covers reinforcement learning, where the model is no longer predicting a label for a static row of data. Instead, an agent learns through sequential interaction, reward, and delayed consequences.

Deep learning now lives in its own dedicated [Deep Learning](/ai/dl) section. I still treat it as part of the larger ML story, but it has enough architectural and representational depth that it reads better as a separate branch.

## Why I Grouped It This Way

The old term-based split was not doing the material any favors. Model evaluation, supervised learning, and unsupervised learning belong together as classical ML foundations. Reinforcement learning is still part of machine learning, but it solves a different kind of problem than ordinary prediction. Deep learning remains connected, but it now has its own dedicated section rather than being squeezed into this one.

Organizing the section by topic makes it easier to answer practical questions such as:

- How do I evaluate a classifier honestly?
- When should I use clustering instead of classification?
- When does deep learning become worth the extra complexity?
- Why is reinforcement learning harder to stabilize than ordinary supervised learning?

Those are better organizing questions than term numbers.

## Chapter Guide

1. [Foundations and Supervised Learning](/ai/ml/foundations-and-supervised-learning) covers evaluation, validation, regression, classification, trees, SVMs, and ensembles.
2. [Unsupervised Learning and Feature Engineering](/ai/ml/unsupervised-learning-and-feature-engineering) covers scaling, clustering, PCA, and cluster validation.
3. [Reinforcement Learning](/ai/ml/reinforcement-learning) covers MDPs, Bellman equations, Q-learning, DQN, policy gradients, and actor-critic methods.

Related section:
[Deep Learning](/ai/dl) covers neural networks, CNNs, sequence models, and generative models in more depth.

## What You Will Get Out of It

If you work through this section in order, you end up with a mental model for three different kinds of ML work plus a clear handoff into deep learning.

- The supervised-learning mindset: learn from labeled examples and validate honestly.
- The unsupervised-learning mindset: discover structure when labels do not exist.
- The reinforcement-learning mindset: optimize behavior over time under delayed feedback.

That is a much better foundation than treating machine learning as one giant bag of algorithms, and it keeps the deep-learning material where it has enough room to breathe.

## Start Here

If you are new to this section, begin with [Foundations and Supervised Learning](/ai/ml/foundations-and-supervised-learning). If you already know standard regression and classification workflows, skip ahead to [Unsupervised Learning and Feature Engineering](/ai/ml/unsupervised-learning-and-feature-engineering), [Reinforcement Learning](/ai/ml/reinforcement-learning), or the dedicated [Deep Learning](/ai/dl) section depending on what you want to build.
