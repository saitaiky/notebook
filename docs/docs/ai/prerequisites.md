---
title: "AI Prerequisites"
description: "A compact guide to the math, coding, and notation background that makes the AI sections easier to study in order."
keywords:
  - ai prerequisites
  - machine learning prerequisites
  - deep learning prerequisites
  - probability
  - linear algebra
  - calculus
  - python
sidebar_position: 2
---

# AI Prerequisites

I do not want this site to feel like it requires a formal degree before you can start, but I also do not want to pretend that every topic has zero background assumptions. The practical middle ground is to make those assumptions explicit.

This page is the compact bridge. It tells you what background makes each AI section easier to study and what you can safely learn on the way.

## The Short Version

You do not need all of the following at expert level before starting.

- For [Classical AI](/ai/search-plan), you mainly need comfort with problem decomposition, recursion, trees, graphs, and basic probability.
- For [Machine Learning](/ai/ml), you should be comfortable reading equations, interpreting plots, and writing basic Python for data work.
- For [Deep Learning](/ai/dl), you should add basic linear algebra, gradient-based optimization intuition, and familiarity with tensors or arrays.
- For [LLMs](/ai/llm), you should already be comfortable with the deep-learning basics plus sequence modeling vocabulary.

If you are missing part of that background, that is not a blocker. It just tells you where the friction is likely to appear.

## Math That Actually Matters

### Linear Algebra

You do not need abstract proof-heavy linear algebra to get started, but you should be comfortable with:

- vectors and matrices,
- matrix multiplication,
- dot products,
- shapes and dimensions,
- what it means to transform one representation into another.

This becomes important as soon as neural networks, embeddings, attention, or PCA show up.

### Probability and Statistics

You should understand:

- conditional probability,
- independence,
- Bayes' rule,
- expectation and averages,
- distributions at a basic level,
- the difference between training and evaluation metrics.

This matters in both [Machine Learning](/ai/ml) and [Classical AI](/ai/search-plan), especially once Bayes nets, HMMs, confusion matrices, and model validation appear.

### Calculus and Optimization Intuition

You do not need to manually derive every gradient, but you should understand:

- what a derivative represents,
- why optimization is about moving parameters to reduce loss,
- what gradient descent is doing conceptually,
- why learning rate matters.

That is enough background to read the [Deep Learning](/ai/dl) and [LLM](/ai/llm) sections without the equations feeling arbitrary.

## Engineering Background That Helps

### Python and Basic Numerical Computing

For the ML, DL, and LLM material, it helps to be comfortable with:

- Python syntax,
- lists, dictionaries, loops, and functions,
- reading code that uses arrays or tensors,
- basic notebook-style experimentation.

You do not need to be a data-science specialist. You do need to be comfortable reading short code snippets and translating them into an execution flow.

### Trees, Graphs, and Recursion

For [Classical AI](/ai/search-plan), this matters more than calculus.

You should be comfortable with:

- tree traversal,
- graph search,
- recursion and backtracking,
- state transitions,
- time and space trade-offs.

That background makes BFS, DFS, A*, minimax, and CSP search feel natural rather than mysterious.

## Notation You Will See Often

Across the AI notes, a few symbols appear repeatedly.

- $x$: input or feature vector
- $y$: target or label
- $\hat{y}$: model prediction
- $w, b$: weights and bias
- $P(A \mid B)$: conditional probability
- $V(s), Q(s,a)$: value functions in reinforcement learning
- $g(n), h(n), f(n)$: path cost, heuristic, and total evaluation in informed search

If the notation is new, the important thing is not memorizing symbols in isolation. The important thing is learning what role each one plays in a system.

## Suggested Entry Paths

If your background is mostly software engineering, start with [Foundations and Constraint Satisfaction](/ai/search-plan/foundations-csp) or [Foundations and Supervised Learning](/ai/ml/foundations-and-supervised-learning).

If your background is already ML-adjacent, you can move straight into [Deep Learning Overview](/ai/dl) and then use this page only when you hit unfamiliar math.

If your main interest is LLMs, I still recommend reading at least the [Deep Learning](/ai/dl) overview first so the transformer material has a stronger foundation.

## What This Means in Practice

The goal is not to front-load months of study before touching AI. The goal is to know where the hidden assumptions are so you can fill gaps deliberately instead of absorbing them by accident.