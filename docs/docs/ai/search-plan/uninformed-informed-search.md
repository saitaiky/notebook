---
title: "Uninformed and Informed Search"
description: "A practical guide to BFS, DFS, graph vs tree search, uniform-cost search, greedy best-first search, A*, and heuristic quality in classical AI."
keywords:
  - uninformed search
  - informed search
  - breadth first search
  - bfs
  - depth first search
  - dfs
  - uniform cost search
  - greedy best first search
  - a star
  - heuristics
  - admissibility
  - consistency
sidebar_position: 2
---

# Uninformed and Informed Search

This chapter fills the gap between problem representation and advanced search. Once a state representation and problem formulation are clear, the next question is how to move through the state space systematically.

This is where the classical search algorithms live. They are still some of the cleanest ways to understand the trade-offs between completeness, optimality, time, memory, and heuristic guidance.

Throughout this chapter, the standard search notation is used: $b$ for branching factor, $d$ for the depth of the shallowest goal, $m$ for the maximum depth of the tree, $C^*$ for the optimal path cost, and $\varepsilon$ for the smallest positive step cost.

## Uninformed and Informed Search

### Tree Search vs. Graph Search

Before comparing algorithms, one structural distinction matters first.

- **Tree search** treats every newly generated path as a fresh branch, even if it reaches a state that has been seen before.
- **Graph search** keeps track of visited states and avoids expanding duplicates unnecessarily.

The difference is not cosmetic. In any domain with cycles or many repeated paths, graph search can cut huge amounts of wasted work. Tree search is easier to explain. Graph search is usually the more useful practical default.

The difference is easy to see with a tiny cyclic graph: `A -> B -> C -> A`. A tree-search implementation can keep regenerating `A` from `C`, then `B` from `A`, and so on. A graph-search implementation marks visited states and avoids reopening the same cycle repeatedly.

That one design choice changes complexity in real systems. In routing and planning domains, duplicate-state suppression is often the line between "finishes quickly" and "never finishes within budget."

This side-by-side diagram shows the difference in expansion behavior.

![Tree search versus graph search on a cyclic graph](/img/ai/search-plan/Tree_Search_vs._Graph_Search.png)

Tree search keeps generating duplicate states as new branches, while graph search suppresses them with a visited set.

### Breadth-First Search

Breadth-first search expands the shallowest frontier nodes first.

That means it explores the search space level by level. If every action has the same cost, BFS finds the shallowest solution and is complete. The price is memory: it has to keep the entire current frontier.

BFS is the clearest baseline for understanding systematic search, but it becomes expensive quickly as the branching factor grows.

Operationally, BFS uses a FIFO queue. In a tree with branching factor $b$ and shallowest solution depth $d$, both time and space are on the order of $O(b^d)$. That symmetric cost profile is the key lesson: BFS is easy to reason about because it spends memory to buy completeness and shortest-path behavior under unit step costs.

### Depth-First Search

Depth-first search expands one branch as far as possible before backtracking.

Its main advantage is memory efficiency. It only needs to store the active path plus a limited amount of bookkeeping. The trade-off is that vanilla DFS can get trapped in deep irrelevant branches, and without safeguards it may fail in infinite-depth spaces.

This is why DFS is often useful as a control-flow pattern for backtracking and CSP solving, but not always the best general shortest-path strategy.

DFS is usually implemented with a stack, either explicitly or through recursion. Its space cost is only $O(bm)$, which is dramatically smaller than BFS in large trees, but its time in the worst case is still $O(b^m)$. That is the recurring DFS pattern: strong memory behavior, weak guarantee behavior unless the problem structure itself keeps the search disciplined.

### Uniform-Cost Search

Once action costs are not all equal, shallowest-first is no longer the same as cheapest-first. Uniform-cost search fixes that by always expanding the node with the smallest path cost so far.

If $g(n)$ is the path cost from the start to node $n$, uniform-cost search always chooses the frontier node with minimum $g(n)$.

That makes it optimal for nonnegative step costs and conceptually turns search into cost-ordered expansion rather than depth-ordered expansion.

In implementation terms, UCS uses a priority queue keyed by $g(n)$. Its complexity is often written in cost-based form rather than depth-based form, because the search radius now depends on how many nodes lie below the optimal cost threshold. A common bound is exponential in $C^*/\varepsilon$, which is a reminder that small edge costs can make the frontier explode even when the graph is not very deep.

### Greedy Best-First Search

Greedy best-first search uses a heuristic estimate of remaining distance to the goal and expands whichever node looks closest.

If $h(n)$ is the heuristic estimate from node $n$ to a goal, greedy best-first uses:

$$
f(n) = h(n)
$$

Here, $n$ is the current node, $h(n)$ is the heuristic estimate of remaining cost to a goal, and $f(n)$ is the score used to rank the frontier.

That often makes it much faster than uninformed search, but it gives up reliability. A heuristic can pull the search toward what looks promising locally while ignoring the true cost already paid.

That is why greedy search is often fast but not guaranteed to be optimal.

It is still useful because it isolates the role of the heuristic cleanly. If the goal is to see whether a heuristic gives useful directional information at all, greedy best-first search is often the fastest way to check. The failure mode is also instructive: a heuristic that looks sharp locally can still lead to a terrible global route.

### A* Search

A* combines actual path cost and heuristic guidance:

$$
f(n) = g(n) + h(n)
$$

In A*, $g(n)$ is the path cost already paid to reach node $n$, $h(n)$ is the estimated remaining cost, and $f(n)$ is the estimated total solution cost through that node.

This is the central idea of informed search. The search should care both about how much cost has already been paid and how much cost is still expected.

If the heuristic is well behaved, A* is complete and optimal while exploring dramatically fewer nodes than uninformed search.

In practical AI education, A* is one of the most important algorithms because it makes the role of heuristics explicit without turning the search into a black box.

Like UCS, A* uses a priority queue, but the priority is now the estimated total solution cost. If $h(n)=0$ everywhere, A* reduces to UCS. If $g(n)$ is ignored, the behavior moves toward greedy best-first search. That makes A* a useful bridge algorithm because it lets me see uninformed cost search and heuristic search as two ends of one design pattern.

A small numerical trace shows the mechanics clearly. Suppose the frontier has:

- node A: $g=4$, $h=6$, so $f=10$
- node B: $g=7$, $h=2$, so $f=9$
- node C: $g=3$, $h=8$, so $f=11$

A* expands B first because it has the smallest $f$. After expanding B, it inserts B's children and repeats this ordering step. The key point is that A* can prefer a node with higher accumulated cost if its remaining-cost estimate is much better.

When debugging A*, logging `(node, g, h, f)` at each expansion is often useful. If expansions look surprising, the issue is often not in the queue logic but in heuristic quality or inconsistent edge costs.

### A Comparison Table

The algorithms are easier to compare once they are lined up by what they optimize and what they sacrifice.

| Strategy | Frontier priority | Complete? | Optimal? | Typical weakness |
| --- | --- | --- | --- | --- |
| BFS | Smallest depth | Yes, for finite branching factor | Yes, when step costs are equal | Frontier memory blows up quickly |
| DFS | Deepest unexplored path | No, not in infinite-depth spaces | No | Can disappear down irrelevant branches |
| Uniform-cost search | Smallest $g(n)$ | Yes, with nonnegative step costs | Yes | Can expand many cheap partial paths |
| Greedy best-first | Smallest $h(n)$ | Not guaranteed in general | No | Heuristic can be shortsighted |
| A* | Smallest $g(n)+h(n)$ | Yes, with admissible conditions and proper graph handling | Yes, with admissible heuristic | Memory usage can still be large |

This table is the shortest way to remember the family resemblance. BFS and UCS care about guarantees first. DFS cares about memory first. Greedy cares about directional speed first. A* tries to balance guarantees with guidance.

### What Makes a Heuristic Good?

A heuristic should approximate remaining cost well enough to reduce wasted exploration, but cheaply enough that using it does not cost more than it saves.

Good heuristics usually have three properties:

1. they are fast to compute,
2. they correlate with true remaining cost,
3. they preserve the guarantees that matter, especially optimality.

The practical goal is not to invent a perfect heuristic. The practical goal is to design one that makes the search smaller without making the system fragile.

One useful mental model is heuristic dominance. If two admissible heuristics satisfy $h_2(n) \geq h_1(n)$ for every node while still never overestimating, then $h_2$ is usually preferable because it is more informative. In practice, many good heuristics come from problem relaxations: constraints are removed, the easier problem is solved, and that cheaper optimal cost becomes a lower bound for the real one.

A concrete example is grid pathfinding with four-direction movement and unit step cost:

- `h1(n) = 0` is admissible but useless.
- `h2(n) = ManhattanDistance(n, goal)` is admissible and usually much better.

Because `h2(n) >= h1(n)` for every node and both remain admissible, `h2` dominates `h1`. In practice, A* with Manhattan distance expands far fewer nodes than A* with a near-trivial heuristic.

Another practical heuristic pattern is relaxation. If the true problem has obstacles and extra constraints, some constraints can be ignored, the easier version can be solved, and that value can be used as a lower bound. That lower bound is often admissible by construction.

![A* heuristic dominance comparison showing stronger heuristics reducing node expansions](/img/ai/search-plan/Heuristic_Dominance_in_A__Search.png)

### Admissibility and Consistency

A heuristic is **admissible** if it never overestimates the true remaining cost:

$$
h(n) \leq h^*(n)
$$

Here, $h(n)$ is the heuristic estimate and $h^*(n)$ is the true optimal remaining cost from node $n$ to a goal.

where $h^*(n)$ is the true optimal remaining cost.

This matters because admissibility is what protects A*'s optimality in tree search.

A heuristic is **consistent** if for every edge from $n$ to $n'$ with step cost $c(n,n')$,

$$
h(n) \leq c(n,n') + h(n')
$$

In the consistency condition, $c(n,n')$ is the step cost of moving from node $n$ to successor $n'$.

Consistency is stronger than admissibility. It gives the search a triangle-inequality-like structure, which is especially useful in graph search because it prevents the estimated total cost from decreasing unexpectedly along a path.

Consistency can be tested locally on each edge. If an edge $n \rightarrow n'$ has cost $2$, and $h(n)=7$, then consistency requires:

$$
7 \leq 2 + h(n')
$$

So $h(n')$ must be at least $5$. If $h(n')=3$, the inequality fails, meaning the heuristic is inconsistent on that edge.

Why this matters in practice: with consistent heuristics, once a node is expanded in graph-search A*, it does not need to be reopened later. That significantly simplifies implementation and improves performance predictability.

### Choosing the Right Search Strategy

There is no single search algorithm that dominates in every setting.

- Use **BFS** when step costs are uniform and shallow solutions matter.
- Use **DFS** when memory is tight or recursion/backtracking is the main pattern.
- Use **uniform-cost search** when real path cost matters and actions have unequal costs.
- Use **greedy best-first search** when speed matters more than guarantees.
- Use **A*** when the best trade-off between heuristic guidance and optimality is needed.

This is the practical lesson of the chapter: search is not one algorithm. It is a family of strategies shaped by the structure of the state space and the guarantees that matter.

One compact decision rule is this: start by asking whether costs matter, whether memory is the real bottleneck, and whether a trustworthy heuristic exists. Those three questions usually narrow the choice faster than memorizing textbook slogans.

A useful second-pass rule after the first algorithm choice is:

1. If memory fails first, move toward iterative deepening or tighter duplicate-state control.
2. If runtime fails first, improve heuristic quality before changing the entire algorithm family.
3. If solution quality fails first, move from greedy behavior toward UCS/A* style guarantees.

This keeps search selection iterative and evidence-driven. A perfect initial choice is not required; what matters is a fast feedback loop between observed bottleneck and algorithm adjustment.

The following decision flow is a practical default for first algorithm selection.

![Search strategy decision flow for BFS, DFS, UCS, greedy best-first search, and A*](/img/ai/search-plan/AI_Search_Algorithm_Decision_Flow.png)

Use this as a starting point, then iterate based on observed bottlenecks (runtime, memory, or solution quality).

## What This Means to Me as a Builder

Search algorithms matter because they make trade-offs explicit. They force a decision about whether optimality, memory, speed, or simplicity matters most, and they make the role of heuristics visible rather than magical.

Once these algorithms are clear, later topics such as minimax, planning, and probabilistic inference become easier to place. They stop looking like isolated techniques and start looking like variations on structured exploration.

## Key Takeaways

1. Tree search and graph search differ because repeated states matter.
2. BFS and DFS are the cleanest uninformed baselines.
3. Uniform-cost search generalizes BFS when action costs differ.
4. Greedy best-first search uses heuristics for speed, not reliability.
5. A* combines real cost and estimated remaining cost in one evaluation function.
6. Admissibility and consistency are what make heuristic quality mathematically important rather than just intuitively useful.

## What to Read Next

Continue to [Search, Optimization, and Game Playing](/ai/search-plan/search-optimization-game-playing), where the focus shifts from general state-space search to optimization, adversarial reasoning, and time-bounded decision-making.