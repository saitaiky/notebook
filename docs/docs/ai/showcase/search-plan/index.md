---
title: "AI Search, Planning, and Reasoning Showcase Index"
description: "Project index for classical AI showcases, mapped to search, planning, adversarial reasoning, and probabilistic modeling notes."
keywords:
  - "classical ai showcase"
  - "search and planning"
  - "constraint satisfaction"
  - "sudoku solver"
  - "adversarial search"
  - "minimax"
  - "alpha beta pruning"
  - "probabilistic models"
sidebar_position: 0
---

This section focuses on classical AI projects where the core challenge is structured reasoning, search strategy, and decision-making under constraints.

## Projects in this section

- [A Sign Language Recognizer](./a-sign-language-recognizer): In this project, I build a recognition pipeline for sign-language sequences using probabilistic models to infer the most likely word sequence from observed features. The project demonstrates practical sequence modeling, likelihood-based scoring, and evaluation under ambiguity.
- [An Adversarial Search Agent](./an-adversarial-search-agent): This project implements a competitive game-playing agent using adversarial search, heuristic evaluation, and time-aware decision logic. I use it to study how minimax-style search quality depends on evaluation functions, pruning behavior, and computational budget.
- [A planning search](./a-planning-search): In this project, I benchmark planning/search strategies and heuristic variants across problem instances to compare solution quality and runtime cost. The project shows how heuristic design and search-space structure affect scalability in classical AI planning tasks.

## Key knowledge to learn

- Read [AI Prerequisites](/ai/prerequisites) if you want a quick check on the math, Python, and notation background behind the search notes.
- Use [AI Overview](/ai) to place classical AI relative to machine learning, deep learning, and LLM-focused material.
- Foundations of agents, environments, and rational behavior in [Classical AI Overview](/ai/search-plan).
- Constraint modeling and search strategy in [Foundations and Constraint Satisfaction](/ai/search-plan/foundations-csp#constraint-satisfaction-problems-csps).
- State-space search fundamentals in [Uninformed and Informed Search](/ai/search-plan/uninformed-informed-search).
- Optimization and local search in [Search, Optimization, and Game Playing](/ai/search-plan/search-optimization-game-playing#search-and-optimization).
- Adversarial reasoning in [Adversarial search for game playing](/ai/search-plan/search-optimization-game-playing#adversarial-search-for-game-playing) and [Advanced game-playing techniques](/ai/search-plan/search-optimization-game-playing#advanced-game-playing-techniques).
- Probabilistic inference context in [Planning and Probabilistic Reasoning](/ai/search-plan/planning-and-probabilistic-reasoning#probabilistic-models).

## Suggested learning flow

1. Start with [AI Overview](/ai), and use [AI Prerequisites](/ai/prerequisites) if you want the quick readiness check first.
2. Work through [A planning search](./a-planning-search), then read [Foundations and Constraint Satisfaction](/ai/search-plan/foundations-csp), [Uninformed and Informed Search](/ai/search-plan/uninformed-informed-search), and [Search, Optimization, and Game Playing](/ai/search-plan/search-optimization-game-playing).
3. Continue with [An Adversarial Search Agent](./an-adversarial-search-agent), then review minimax, alpha-beta pruning, and time-bounded game-playing sections.
4. Use [A Sign Language Recognizer](./a-sign-language-recognizer) to connect sequence recognition work with [Planning and Probabilistic Reasoning](/ai/search-plan/planning-and-probabilistic-reasoning).
