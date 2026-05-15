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

This chapter is where classical AI starts to feel like engineering rather than taxonomy. Once the goal stops being any valid solution and becomes the best solution under limited time, the search problem changes shape.

The first half covers optimization with local search. The second half covers adversarial game playing, where the environment actively tries to make my decisions fail.

## Search and Optimization

### From Finding a Solution to Finding the Best Solution

In constraint satisfaction, the goal is often to find any state that satisfies all constraints. In optimization problems, that is not enough. The focus shifts to an objective function that needs to be maximized or minimized.

That shift changes what "done" means. In CSP, the first valid assignment can be enough. In optimization, every valid assignment is just a candidate until it is compared against alternatives.

The objective can be framed as a scoring function over complete states:

$$
  ext{score}(s) \rightarrow \max \text{ or } \min
$$

Then the algorithm question becomes: how can better-scoring states be searched efficiently under a time budget?

### The Challenge of Optimization Problems

The Traveling Salesman Problem is the classic example. Given a set of cities and distances, the goal is the shortest tour that visits each city exactly once and returns to the start.

The issue is combinatorial explosion. The number of tours grows factorially, which means a straightforward exhaustive search becomes unusable very quickly. For $n$ cities, the search space grows on the order of $n!$, which becomes hopeless almost immediately.

That is why optimization problems force a different way of thinking about search. The question stops being "can the space be enumerated?" and becomes "how can the space be navigated without enumerating it?"

### Local Search: Hill Climbing

Hill climbing works on one complete candidate solution at a time.

1. Start from a random complete state.
2. Evaluate it with the objective function.
3. Look at neighboring states.
4. Move to the best neighbor.
5. Repeat until no neighbor is better.

This is computationally attractive, but it is greedy. Hill climbing can get stuck at a local maximum that is good relative to nearby states but far from globally optimal.

Hill climbing can be read as "gradient-like search without guarantees." If each move only considers immediate local improvements, the algorithm cannot cross a temporary valley to reach a better peak. That is the core failure mode.

<!-- NOTEBOOKLM_DIAGRAM: concept=HillClimbingLocalMaxima; type=image; goal=show search landscape with local and global maxima and a hill-climbing path trapped in a local peak; complexity=basic -->

### Escaping Local Maxima: Simulated Annealing

Simulated annealing fixes the worst weakness of hill climbing by sometimes accepting a worse move.

Early in the search, when the temperature is high, the algorithm is willing to explore broadly and escape local maxima. As the temperature cools, it behaves more conservatively and converges toward a good solution. The core idea is that the algorithm should become less tolerant of bad moves over time.

More formally, if a move makes the objective worse by $\Delta E$, the algorithm can still accept it with probability $e^{-\Delta E / T}$, where $T$ is the temperature. High temperature makes exploration likely. Low temperature makes the algorithm behave more like hill climbing.

That balance between exploration and exploitation is the real lesson. The algorithm works because it is neither purely random nor purely greedy.

Annealing schedules are easiest to reason about through one concrete loop:

1. Set an initial temperature $T_0$ high enough that some bad moves are accepted.
2. Propose a neighboring state each iteration.
3. Always accept if the move improves score.
4. Otherwise accept with probability $e^{-\Delta E/T}$.
5. Cool the temperature, for example $T \leftarrow \alpha T$ with $\alpha \in [0.90, 0.99]$.

Two practical tuning signals matter:

- If acceptance of worse moves drops to almost zero too early, cooling is too fast.
- If the algorithm keeps wandering late in the run, cooling is too slow.

In production-style optimization, annealing works best as a budgeted search method: set iteration count and cooling schedule so each run fits a predictable time envelope.

:::info Further Study: Genetic Algorithms

Genetic algorithms take a population-based approach. Instead of refining one state, they evolve many candidate states through selection, crossover, and mutation.

:::

## Adversarial Search for Game Playing

### Introduction to Game Trees

For deterministic, turn-based games like Tic-Tac-Toe, chess, or Isolation, the problem can be modeled as a game tree.

- **Nodes** represent game states.
- **Edges** represent legal moves.
- **The root** is the current state.
- **Leaf nodes** represent terminal outcomes such as win, loss, or draw.

This representation matters because it supports reasoning not only about the next move, but also about how an opponent will respond.

A quick Tic-Tac-Toe example makes this concrete. From one mid-game board, each legal move creates a child node. Then each opponent response creates another level. Even this tiny game creates a branching structure where immediate-looking good moves can be punished two turns later.

That is exactly why the tree abstraction matters: it forces me to evaluate plans as contingent sequences, not one-step reactions.

### The Minimax Algorithm

Minimax assumes a perfect opponent.

- The **MAX** player tries to maximize utility.
- My opponent is the **MIN** player, trying to minimize it.

The algorithm searches the tree, scores outcomes, and propagates those values upward.

- At MAX nodes, the highest child value is kept.
- At MIN nodes, the lowest child value is kept.

The result is a move that is optimal under the assumption that the opponent is also playing optimally. In the idealized full-tree version, terminal utilities such as $+1$, $0$, and $-1$ propagate upward until the root receives its minimax value.

Propagation can be understood as alternating operators:

- MAX layers apply `max(...)` over child values.
- MIN layers apply `min(...)` over child values.

For example, if a MAX node has child values `[-1, 0, +1]`, it returns `+1`. If the parent MIN node then sees child values `[+1, 0]`, it returns `0`. Repeating this from leaves to root gives the decision value for the current move.

Here is a compact minimax propagation view.

<!-- NOTEBOOKLM_DIAGRAM: concept=MinimaxValuePropagation; type=image; goal=show a compact minimax tree with MAX/MIN alternating layers and bottom-up score propagation; complexity=intermediate -->

Read bottom-up: each MIN node keeps its smaller child value, then MAX chooses the larger of those two propagated values.

### The Problem of Scale and the Need for Heuristics

Real game trees explode in size. In a game like Isolation, the branching factor and maximum depth make full search intractable. Even a seemingly modest board can produce an astronomical number of possible states.

If the average branching factor is $b$ and the search depth is $d$, a naive minimax search explores on the order of $O(b^d)$ nodes. That exponential cost is the real enemy.

That is why heuristics become essential. A way is needed to estimate the value of non-terminal states without searching all the way to the end.

### Depth-Limited Search and Evaluation Functions

Depth-limited search cuts the tree at a fixed horizon. Once the search stops early, an evaluation function is needed to estimate how promising the current state is.

A practical evaluation function should be:

1. fast to compute,
2. correlated with actual winning chances.

In Isolation, a simple heuristic like

$$
  	ext{score} = \#\text{my\_moves} - \#\text{opponent\_moves}
$$

can already be surprisingly effective, because mobility is strongly related to eventual success. More aggressive variants can weight the opponent more heavily, such as $\#\text{my\_moves} - 2 \cdot \#\text{opponent\_moves}$.

The practical trade-off is evaluation cost versus search depth. If evaluation complexity doubles while the move-time budget stays the same, reachable depth may shrink and tactical sharpness may be lost. In practice, both need to be tuned together.

### Optimizing with Alpha-Beta Pruning

Alpha-beta pruning returns the same decision as minimax while exploring fewer branches.

- **Alpha** tracks the best score MAX can already guarantee.
- **Beta** tracks the best score MIN can already force.

As soon as a branch becomes incapable of improving the final decision, exploration can stop. The pruning condition is simply $\alpha \geq \beta$.

With good move ordering, alpha-beta pruning can dramatically increase the effective search depth reachable in the same time budget. In the best case, it reduces the effective complexity from roughly $O(b^d)$ to about $O(b^{d/2})$, which is the difference between a toy search and a usable game-playing system.

Move ordering should be treated as part of alpha-beta, not as a separate optional improvement. If good candidate moves are searched earlier, cutoffs happen sooner and more often. That means better pruning and deeper effective lookahead.

This simplified tree highlights where pruning happens.

<!-- NOTEBOOKLM_DIAGRAM: concept=AlphaBetaPruningBounds; type=image; goal=show alpha-beta bounds and a pruned subtree where alpha is greater than or equal to beta; complexity=intermediate -->

The intuition is that once a branch cannot improve the already known bound, deeper exploration is unnecessary.

## Advanced Game-Playing Techniques

### Iterative Deepening

Iterative deepening solves a practical time-management problem. Instead of searching once to a fixed depth, the search runs repeatedly at depth 1, then 2, then 3, and so on until time runs out.

This makes the agent anytime-capable: if the clock stops the search, the best move from the deepest completed iteration is still available. The apparent redundancy is usually acceptable because the deepest frontier dominates the runtime anyway.

There is also a second benefit: iterative deepening improves move ordering for deeper searches. The best move from depth $k$ is often a strong candidate at depth $k+1$, which helps alpha-beta pruning cut earlier.

In practical engines, the time-control pattern is usually:

1. Start depth-1 search.
2. Reuse best move ordering from prior depth.
3. Stop when remaining time crosses a safety threshold.
4. Return the principal variation from the deepest fully completed depth.

That pattern is one of the reasons game agents can stay robust under strict per-move clocks.

The process is often visualized as an anytime depth ladder.

<!-- NOTEBOOKLM_DIAGRAM: concept=IterativeDeepeningAnytimeLadder; type=image; goal=show depth-by-depth iterative deepening timeline with time cutoff and best-move return from deepest completed depth; complexity=basic -->

The key property is graceful degradation: even if deeper search is interrupted, a valid best-so-far move is always available.

### The Horizon Effect and Quiescence Search

Depth limits create the horizon effect. A move may look strong inside the search horizon but lead to disaster just beyond it.

Quiescence search reduces this by extending the search in unstable positions, such as tactical exchanges in chess, until the state becomes quiet enough that the evaluation function is more trustworthy.

A standard failure case is a "fake safe" move: at depth $d$, my evaluation looks favorable because the opponent's forcing tactic appears at depth $d+1$. The depth limit hides the tactical blow.

Quiescence search handles this by extending only noisy positions, for example checks, captures, or forced tactical swings. It does not expand the whole tree uniformly; it extends where static evaluation is likely to lie.

<!-- NOTEBOOKLM_DIAGRAM: concept=HorizonEffectAndQuiescence; type=image; goal=contrast depth-limited cutoff error versus quiescence extension on a tactical sequence; complexity=intermediate -->

### Advanced Evaluation Functions

Stronger game-playing systems rely on richer evaluation functions.

- Weighted features can prioritize certain kinds of mobility or territory.
- Positional heuristics can reward control of strong locations.
- Partition detection can recognize when the board has effectively split into separate regions.

The trade-off is always the same: a more accurate heuristic usually costs more time, which may reduce search depth.

In practice, evaluation features are often designed in layers:

1. Core tactical features: legal move count, immediate threats, king safety-like constraints.
2. Positional features: center control, connectivity, region dominance.
3. Context features: game phase (opening/midgame/endgame) and risk weighting.

Then feature weights are calibrated against two metrics at once: win rate and nodes searched per second. A sophisticated evaluator that reduces search depth too aggressively can perform worse than a simpler one.

### Multiplayer and Probabilistic Games

Classical minimax is for two-player deterministic games. Once that assumption breaks, the tree changes.

- **MAXN** generalizes game trees to multiple players by using a utility vector rather than one scalar value.
- **Expectimax** handles chance by replacing some nodes with expected-value calculations rather than adversarial choices.

These extensions matter because not every strategic problem is a clean two-player duel. Once randomness enters the tree, the algorithm is no longer propagating minima at every opponent-like branch. It is sometimes propagating expectations.

A quick mental model helps:

- In minimax, opponent nodes use worst-case choice (`min`).
- In expectimax, chance nodes use weighted average (`\sum p_i v_i`).

If a move is being evaluated in a dice game and the next event is a die roll, the correct update is expectation over outcomes, not adversarial minimum. This single change can completely alter which move is preferred.

For multiplayer games, MAXN extends this idea by keeping a utility vector (one component per player). The implementation trade-off is that pruning becomes harder and evaluation design must reflect multiple competing objectives.

## What This Means to Me as a Builder

The practical lesson of this chapter is that search quality comes from disciplined approximation.

Large decision spaces are not beaten by brute force. They are handled by representing the problem well, using heuristics intelligently, and spending computation where it matters most.

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