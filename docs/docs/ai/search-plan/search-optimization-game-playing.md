---
title: "Search, Optimization, and Game Playing"
description: "A practical guide to local search, optimization, minimax, alpha-beta pruning, and advanced game-playing techniques in classical AI."
keywords:
  - local search
  - optimization
  - hill climbing
  - simulated annealing
  - minimax
  - alpha beta pruning
  - iterative deepening
  - expectimax
sidebar_position: 2
---

# Search, Optimization, and Game Playing

This chapter is where classical AI starts to feel like engineering rather than taxonomy. Once I stop asking for any valid solution and start asking for the best solution under limited time, the search problem changes shape.

The first half covers optimization with local search. The second half covers adversarial game playing, where the environment actively tries to make my decisions fail.

## Search and Optimization

### From Finding a Solution to Finding the Best Solution

In constraint satisfaction, the goal is often to find any state that satisfies all constraints. In optimization problems, that is not enough. I now care about an objective function that I want to maximize or minimize.

### The Challenge of Optimization Problems

The Traveling Salesman Problem is the classic example. Given a set of cities and distances, I want the shortest tour that visits each city exactly once and returns to the start.

The issue is combinatorial explosion. The number of tours grows factorially, which means a straightforward exhaustive search becomes unusable very quickly. For $n$ cities, the search space grows on the order of $n!$, which becomes hopeless almost immediately.

That is why optimization problems force me to think differently about search. The question stops being "can I enumerate the space?" and becomes "how can I navigate the space without enumerating it?"

### Local Search: Hill Climbing

Hill climbing works on one complete candidate solution at a time.

1. Start from a random complete state.
2. Evaluate it with the objective function.
3. Look at neighboring states.
4. Move to the best neighbor.
5. Repeat until no neighbor is better.

This is computationally attractive, but it is greedy. Hill climbing can get stuck at a local maximum that is good relative to nearby states but far from globally optimal.

### Escaping Local Maxima: Simulated Annealing

Simulated annealing fixes the worst weakness of hill climbing by sometimes accepting a worse move.

Early in the search, when the temperature is high, the algorithm is willing to explore broadly and escape local maxima. As the temperature cools, it behaves more conservatively and converges toward a good solution. The core idea is that the algorithm should become less tolerant of bad moves over time.

More formally, if a move makes the objective worse by $\Delta E$, the algorithm can still accept it with probability $e^{-\Delta E / T}$, where $T$ is the temperature. High temperature makes exploration likely. Low temperature makes the algorithm behave more like hill climbing.

That balance between exploration and exploitation is the real lesson. The algorithm works because it is neither purely random nor purely greedy.

:::info Further Study: Genetic Algorithms

Genetic algorithms take a population-based approach. Instead of refining one state, they evolve many candidate states through selection, crossover, and mutation.

:::

## Adversarial Search for Game Playing

### Introduction to Game Trees

For deterministic, turn-based games like Tic-Tac-Toe, chess, or Isolation, I can model the problem as a game tree.

- **Nodes** represent game states.
- **Edges** represent legal moves.
- **The root** is the current state.
- **Leaf nodes** represent terminal outcomes such as win, loss, or draw.

This representation matters because it lets me reason not only about what I want to do next, but also about how an opponent will respond.

### The Minimax Algorithm

Minimax assumes a perfect opponent.

- I am the **MAX** player, trying to maximize utility.
- My opponent is the **MIN** player, trying to minimize it.

The algorithm searches the tree, scores outcomes, and propagates those values upward.

- At MAX nodes, I keep the highest child value.
- At MIN nodes, I keep the lowest child value.

The result is a move that is optimal under the assumption that the opponent is also playing optimally. In the idealized full-tree version, terminal utilities such as $+1$, $0$, and $-1$ propagate upward until the root receives its minimax value.

### The Problem of Scale and the Need for Heuristics

Real game trees explode in size. In a game like Isolation, the branching factor and maximum depth make full search intractable. Even a seemingly modest board can produce an astronomical number of possible states.

If the average branching factor is $b$ and the search depth is $d$, a naive minimax search explores on the order of $O(b^d)$ nodes. That exponential cost is the real enemy.

That is why heuristics become essential. I need a way to estimate the value of non-terminal states without searching all the way to the end.

### Depth-Limited Search and Evaluation Functions

Depth-limited search cuts the tree at a fixed horizon. Once I stop the search early, I need an evaluation function to estimate how promising the current state is.

A practical evaluation function should be:

1. fast to compute,
2. correlated with actual winning chances.

In Isolation, a simple heuristic like

$$
	ext{score} = \#\text{my\_moves} - \#\text{opponent\_moves}
$$

can already be surprisingly effective, because mobility is strongly related to eventual success. More aggressive variants can weight the opponent more heavily, such as $\#\text{my\_moves} - 2 \cdot \#\text{opponent\_moves}$.

### Optimizing with Alpha-Beta Pruning

Alpha-beta pruning returns the same decision as minimax while exploring fewer branches.

- **Alpha** tracks the best score MAX can already guarantee.
- **Beta** tracks the best score MIN can already force.

As soon as a branch becomes incapable of improving the final decision, I can stop exploring it. The pruning condition is simply $\alpha \geq \beta$.

With good move ordering, alpha-beta pruning can dramatically increase the effective search depth I can reach in the same time budget. In the best case, it reduces the effective complexity from roughly $O(b^d)$ to about $O(b^{d/2})$, which is the difference between a toy search and a usable game-playing system.

## Advanced Game-Playing Techniques

### Iterative Deepening

Iterative deepening solves a practical time-management problem. Instead of searching once to a fixed depth, I search repeatedly at depth 1, then 2, then 3, and so on until time runs out.

This makes the agent anytime-capable: if the clock stops the search, I still have the best move from the deepest completed iteration. The apparent redundancy is usually acceptable because the deepest frontier dominates the runtime anyway.

### The Horizon Effect and Quiescence Search

Depth limits create the horizon effect. A move may look strong inside the search horizon but lead to disaster just beyond it.

Quiescence search reduces this by extending the search in unstable positions, such as tactical exchanges in chess, until the state becomes quiet enough that the evaluation function is more trustworthy.

### Advanced Evaluation Functions

Stronger game-playing systems rely on richer evaluation functions.

- Weighted features can prioritize certain kinds of mobility or territory.
- Positional heuristics can reward control of strong locations.
- Partition detection can recognize when the board has effectively split into separate regions.

The trade-off is always the same: a more accurate heuristic usually costs more time, which may reduce search depth.

### Multiplayer and Probabilistic Games

Classical minimax is for two-player deterministic games. Once that assumption breaks, the tree changes.

- **MAXN** generalizes game trees to multiple players by using a utility vector rather than one scalar value.
- **Expectimax** handles chance by replacing some nodes with expected-value calculations rather than adversarial choices.

These extensions matter because not every strategic problem is a clean two-player duel. Once randomness enters the tree, I am no longer propagating minima at every opponent-like branch. I am sometimes propagating expectations.

## What This Means to Me as a Builder

The practical lesson of this chapter is that search quality comes from disciplined approximation.

I do not beat large decision spaces by brute force. I beat them by representing the problem well, using heuristics intelligently, and spending computation where it matters most.

## Key Takeaways

1. Optimization problems require objective-driven search, not just a goal test.
2. Hill climbing is fast and simple, but vulnerable to local maxima.
3. Simulated annealing works because it balances exploration and convergence.
4. Minimax models adversarial reasoning by assuming an optimal opponent.
5. Evaluation functions are essential once full game-tree search becomes impossible.
6. Alpha-beta pruning is one of the highest-value optimizations in adversarial search.
7. Iterative deepening, quiescence search, and richer heuristics make game-playing AI practical under time limits.

## What to Read Next

Continue to [Planning and Probabilistic Reasoning](/ai/search-plan/planning-and-probabilistic-reasoning), where the focus shifts from search and adversaries to symbolic reasoning, planning, and uncertainty.