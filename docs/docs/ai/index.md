---
title: "AI Overview"
description: "A curriculum map for the AI section, showing how classical AI, machine learning, deep learning, and LLM topics fit together and where to start."
sidebar_position: 1
---

Artificial intelligence is broad enough that a flat list of topics stops being useful quickly. The practical way to organize it is by problem type and by the kind of representation each part of the field depends on.

That is how this section is structured. Instead of treating AI as one giant bag of methods, I separate it into four linked tracks: classical AI, machine learning, deep learning, and LLMs.

## Start With This Mental Model

- **Classical AI** asks how to represent problems, search decision spaces, plan with actions, and reason under uncertainty.
- **Machine Learning** asks how to learn from data, whether the task is prediction, clustering, or sequential decision-making.
- **Deep Learning** asks how neural architectures learn representations directly from raw, high-dimensional inputs.
- **LLMs** focus on transformer-based language systems and the practical engineering around building, adapting, and deploying them.

These tracks overlap, but they are not interchangeable. A routing problem and a document-classification problem both sit under AI, but they require very different ideas.

## Before You Dive In

If you want a quick background check before starting, use [AI Prerequisites](/ai/prerequisites). It covers the minimum math, coding, and notation background that makes the rest of the material easier to follow.

## The Four Tracks

### Classical AI

The [Classical AI](/ai/search-plan) track is where I put search, planning, constraint satisfaction, game playing, and probabilistic reasoning. This is the part of AI that teaches me how to think about state, actions, heuristics, combinatorics, and explicit uncertainty.

This track is the right entry point if I care about:

- state-space search,
- scheduling and planning,
- game-playing agents,
- Bayes nets and HMMs,
- reasoning under structured constraints.

Start here: [Foundations and Constraint Satisfaction](/ai/search-plan/foundations-csp)

### Machine Learning

The [Machine Learning](/ai/ml) track covers supervised learning, unsupervised learning, and reinforcement learning. This is where the core question is how systems improve from data rather than from hand-written rules.

This track is the right entry point if I care about:

- honest model evaluation,
- classification and regression,
- clustering and dimensionality reduction,
- RL as sequential decision-making learned from reward.

Start here: [Machine Learning Foundations](/ai/ml/foundations)

### Deep Learning

The [Deep Learning](/ai/dl) track focuses on neural architectures and representation learning. This is where CNNs, sequence models, generative models, and modern multimodal systems become the center of the story.

I treat deep learning as its own section because once the questions become architectural and representational, it reads better as a separate branch than as one chapter inside ML.

This track is the right entry point if I care about:

- neural-network fundamentals,
- CNNs and transfer learning,
- sequence models,
- embeddings,
- GANs and diffusion-era ideas.

Start here: [Foundations and CNNs](/ai/dl/foundations-and-cnns)

### LLMs

The [LLM](/ai/llm) track is where I keep transformer-heavy language-model material. That includes transformer basics, pretraining and scaling, fine-tuning, RLHF-related topics, RAG, and application architecture.

I keep this separate from the generic DL section because the engineering questions around LLM systems are now large enough to deserve their own path.

This track is the right entry point if I care about:

- transformers in language modeling,
- foundation vs fine-tuned models,
- prompt and adaptation strategies,
- RAG systems,
- production LLM application design.

Start here: [Introduction to LLMs](/ai/llm)

## How The Tracks Connect

The best way to read these sections is not to think of them as mutually exclusive categories.

- Classical AI gives me the language of state, search, planning, and uncertainty.
- Machine learning gives me the language of fitting from data and evaluating that fit honestly.
- Deep learning gives me the language of learned representations and architecture design.
- LLMs give me the modern transformer-centered branch built on top of deep learning.

That means there is a natural progression for many readers:

1. [AI Prerequisites](/ai/prerequisites)
2. [Classical AI](/ai/search-plan) or [Machine Learning](/ai/ml), depending on whether the problem is structured search or learning from data
3. [Deep Learning](/ai/dl)
4. [LLMs](/ai/llm)

## What This Means in Practice

The point of this section is not to force one canonical order on every reader. The point is to make the boundaries clear enough that you can choose the right track for the problem you care about.



