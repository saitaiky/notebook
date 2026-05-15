---
title: "An Engineer's Guide to Machine Learning"
description: "A practical machine learning roadmap split into foundations, supervised learning, unsupervised learning, feature engineering, and reinforcement learning."
keywords:
  - machine learning
  - machine learning foundations
  - supervised learning
  - unsupervised learning
  - feature engineering
  - deep learning
  - reinforcement learning
---

:::warning As of July 2024
It might take me a bit to get everything written down, but I'll carve out some time for this section (there's just so much new tech these days!). In the meantime, I've set up a [showcase section](/ai/showcase/) where you can check out all the source code and demos of the techniques I'll be covering. Stay tuned and happy learning!
:::

## Overview

Machine learning is a practical discipline for building systems that improve from data rather than from fixed hand-written rules. That sentence is broad enough to sound vague, so the only useful way to make it concrete is to walk through the problem types one by one.

This section is organized around those problem types rather than around course terms. I care less about when a topic was taught and more about what engineering problem it solves.

## What This Section Covers

I split this section into five focused pages so each topic can go deeper without becoming a long mixed chapter.

The first page is foundations: problem framing, leakage-safe data splits, validation strategy, metric selection, and error analysis. This is the part that protects me from false confidence.

Then I move into supervised learning and unsupervised learning as separate workflows, because they solve different problem types and require different validation habits.

Feature engineering now has its own page, since representation design, encoding strategy, and pipeline safety are often the biggest practical performance levers in classical ML.

The final page is reinforcement learning, where learning happens through interaction and delayed reward instead of fixed labels.

Deep learning now lives in its own dedicated [Deep Learning](/ai/dl) section. I still treat it as part of the larger ML story, but it has enough architectural and representational depth that it reads better as a separate branch.

## Why I Grouped It This Way

The old two-in-one pages were convenient, but they hid important boundaries. Foundations and supervised learning were coupled even though one is mostly about evaluation discipline and the other is about algorithm families. Unsupervised learning and feature engineering were coupled even though one is about structure discovery and the other is about representation construction.

The split is intentionally task-first and production-oriented. It makes it easier to answer practical questions such as:

- How do I set up an evaluation pipeline I can trust?
- Which supervised model family should I benchmark first?
- When does clustering reveal useful structure and when is it noise?
- Which feature transformations are safe and high leverage?
- Why does RL training break even when the code looks correct?

Those are better organizing questions than term numbers or algorithm popularity.

## Chapter Guide

1. [Machine Learning Foundations](/ai/ml/foundations): problem framing, leakage control, validation, and failure analysis.
2. [Supervised Learning](/ai/ml/supervised-learning): regression/classification models, ensembles, calibration, and threshold design.
3. [Unsupervised Learning](/ai/ml/unsupervised-learning): clustering, latent structure, dimensionality reduction, and internal validation.
4. [Feature Engineering](/ai/ml/feature-engineering): transformations, encoding, selection, and production-safe pipelines.
5. [Reinforcement Learning](/ai/ml/reinforcement-learning): MDPs, Bellman equations, value and policy learning, and stability patterns.

Related section:
[Deep Learning](/ai/dl) covers neural networks, CNNs, sequence models, and generative models in more depth.

## What You Will Get Out of It

If you work through this section in order, you get a practical model-building workflow that starts with evaluation discipline, then moves through prediction, structure discovery, representation design, and sequential decision-making.

- A foundations mindset: define the right objective and verify results honestly.
- A supervised-learning mindset: model labeled outcomes and tune to business costs.
- An unsupervised-learning mindset: discover useful structure without labels.
- A feature-engineering mindset: improve representation before chasing model complexity.
- A reinforcement-learning mindset: optimize behavior over time under delayed feedback.

That is a stronger foundation than treating ML as one bag of algorithms, and it keeps deep learning in its dedicated [Deep Learning](/ai/dl) branch where architectural detail has enough room.

## Start Here

If you are new to this section, begin with [Machine Learning Foundations](/ai/ml/foundations). If you already have strong evaluation habits, jump to [Supervised Learning](/ai/ml/supervised-learning), [Unsupervised Learning](/ai/ml/unsupervised-learning), [Feature Engineering](/ai/ml/feature-engineering), or [Reinforcement Learning](/ai/ml/reinforcement-learning) based on the problem you want to solve.
