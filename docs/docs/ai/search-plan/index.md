---
title: "An Engineer's Guide to Classical AI"
description: "A practical landing page for classical AI topics, covering foundations, uninformed and informed search, optimization, game playing, planning, and probabilistic reasoning through focused chapter pages."
keywords:
  - classical ai
  - artificial intelligence
  - search algorithms
  - a star
  - planning
  - reasoning
  - intelligent agents
  - constraint satisfaction problem
  - game playing ai
  - bayesian networks
  - hidden markov models
---

:::warning As of July 2024

It might take me a bit to get everything written down, but I'll carve out some time for this section. In the meantime, I've set up a [showcase section](/ai/showcase/) where you can check out source code and demos related to the techniques covered here.

:::

## Overview

Understanding the fundamental techniques of AI, such as search, planning, and reasoning, is crucial for developing intelligent systems capable of solving complex problems. These methods allow AI agents to navigate environments, make decisions, and find solutions efficiently. Building an AI to solve Sudoku introduces logical constraints and backtracking. Building a chess-playing agent introduces optimization, adversarial search, and time-bounded decision-making. Probabilistic models add the machinery needed to reason under uncertainty and work with language-like sequential data.

This section is my attempt to make classical AI feel less like a museum of old algorithms and more like a practical toolkit. A lot of the techniques here predate the current wave of large models, but they still teach the parts of intelligence that depend on representation, search-space design, uncertainty handling, and disciplined decision-making under constraints.

## Why This Still Matters

Modern AI discussions often jump straight to transformers, embeddings, and inference infrastructure. That is useful, but it hides a simpler truth: many difficult engineering problems are still search problems, constraint problems, planning problems, or uncertainty problems wearing modern clothes.

If I am building a scheduler, a routing system, a game-playing agent, a symbolic planner, or a recognizer that has to infer hidden structure from partial observations, I am back in the world of classical AI very quickly. The names may change, but the underlying questions do not.

- What counts as a good state representation?
- Which parts of the problem are hard because of combinatorics, and which are hard because of uncertainty?
- Where can exact reasoning work, and where do I need heuristics or approximation?
- How do I make strong decisions under time limits rather than perfect decisions with infinite compute?

That is the thread connecting the whole section.

## What You Will Learn

The series starts with the basic language of intelligent systems: agents, environments, state, rational behavior, and bounded optimality. Those ideas matter because every later algorithm quietly assumes that I have already decided what the agent perceives, what it can do, and what outcome I actually want to optimize.

From there, the material moves into constraint satisfaction through Sudoku. That part is deliberately concrete. It shows how variables, domains, and constraints turn a puzzle into a reusable formal problem, and how inference rules such as elimination, only-choice, and minimum-remaining-values heuristics work together with backtracking search.

The next chapter fills the classical search gap directly. That is where breadth-first search, depth-first search, uniform-cost search, greedy best-first search, and A* belong, along with the heuristic concepts that make informed search work. This is the chapter that connects basic state representation to everything that follows.

After that, the series shifts from finding any valid solution to finding strong solutions under pressure. That is where local search, hill climbing, simulated annealing, minimax, alpha-beta pruning, iterative deepening, and evaluation functions come in. This is the part that explains why game-playing AI is really about managing an exploding decision tree with just enough structure to make the search tractable.

The final chapter moves into symbolic planning and probabilistic reasoning. It covers logical representations, progression and regression planning, situation calculus, Bayes nets, exact and approximate inference, and hidden Markov models. This is where the series stops treating intelligence as pure search and starts treating it as structured belief over actions, states, and hidden causes.

## How The Series Is Organized

I split the material into four focused chapter pages so each one can go deeper without turning the landing page into an overgrown notebook export.

1. [Foundations and Constraint Satisfaction](./foundations-csp) establishes the vocabulary of agents and formal problem representations, then uses Sudoku to show how inference and search combine.
2. [Uninformed and Informed Search](./uninformed-informed-search) covers BFS, DFS, uniform-cost search, greedy best-first search, A*, and the heuristic properties that make informed search reliable.
3. [Search, Optimization, and Game Playing](./search-optimization-game-playing) covers objective-driven search, adversarial reasoning, pruning, evaluation, and time management.
4. [Planning and Probabilistic Reasoning](./planning-and-probabilistic-reasoning) covers symbolic action models, logical reasoning, Bayes nets, and sequence models such as HMMs.

## Why These Topics Belong Together

Classical AI is often taught as a bag of disconnected algorithms, but the stronger way to see it is as a progression of problem types.

- Foundations explain what an agent is, what counts as a state, and why rationality is always constrained by time and compute.
- Constraint satisfaction shows what happens when the world is structured enough that logic and search can work together tightly.
- General search shows how uninformed and informed exploration differ, and why heuristic quality matters.
- Search and game playing then show how heuristics, optimization, and adversaries change the nature of the decision problem further.
- Planning and probabilistic reasoning show how the system evolves once representation, logic, and uncertainty become first-class concerns.

That progression is the reason I kept this section as one series even after splitting it across several files.

## What Kind Of Reader This Is For

This section is for readers who want more than a vocabulary list. I wrote it for the person who wants to understand why a heuristic helps, why a search tree explodes, why a logical representation is sometimes more powerful than a raw state graph, and why probability is not just statistics but a concrete way to model belief in a system.

If you are coming from software engineering, this material gives you a framework for thinking about structured decision problems. If you are coming from modern ML, it gives you the older but still essential ideas that explain planning, combinatorial search, and explicit uncertainty in a way neural-first workflows often skip.

## Start Here

If you are new to this topic, begin with [Foundations and Constraint Satisfaction](./foundations-csp). If you already know the basics of agents and state, continue with [Uninformed and Informed Search](./uninformed-informed-search). If your main interest is symbolic AI or uncertainty, you can still jump straight to [Planning and Probabilistic Reasoning](./planning-and-probabilistic-reasoning), but the search chapter now provides the cleaner bridge.