---
title: "Foundations and Constraint Satisfaction"
description: "A practical introduction to classical AI foundations, covering agents, environments, rationality, and constraint satisfaction through Sudoku."
keywords:
  - classical ai foundations
  - agents and environments
  - peas framework
  - bounded optimality
  - constraint satisfaction problem
  - sudoku solver
  - constraint propagation
  - backtracking search
sidebar_position: 1
---

# Foundations and Constraint Satisfaction

This chapter covers the conceptual base of the whole series. If an agent, a state representation, and bounded rational behavior are not clear, the later algorithms will feel like unrelated tricks instead of design tools.

It then moves into constraint satisfaction through Sudoku, because Sudoku is one of the cleanest examples of how logic, inference, and search reinforce each other.

## Foundations of Artificial Intelligence

### What is Intelligence?

For AI to be a productive field, my notion of intelligence has to be a property that emerges from the system itself, not just from my subjective reaction to it. While Artificial General Intelligence aims to replicate human-like thinking, the more practical approach is to define intelligence within the context of a specific task. This is often called narrow AI.

An agent that can successfully play chess is intelligent at chess, but that says nothing about its ability to drive a car or compose music. The practical goal is to design systems that exhibit rational, goal-oriented behavior for well-defined problems, where rational means selecting actions that are expected to maximize a performance measure.

This becomes clearer with task-level metrics:

- In medical triage, intelligence might mean maximizing recall on high-risk cases while keeping false alarms manageable.
- In route planning, intelligence might mean minimizing expected travel time under changing traffic.
- In a trading simulator, intelligence might mean maximizing risk-adjusted return rather than raw return.

The same system can score highly on one metric and fail badly on another. That is why the phrase "intelligent system" is incomplete unless the task, objective, and constraints are also defined.

### Agents, Environments, and State

AI is fundamentally about building agents, which are systems that interact with an environment.

- **Agent**: the system making decisions, such as a robot controller or a game-playing program.
- **Environment**: the world the agent operates in, whether that is a chessboard, a warehouse, or a software system.
- **Sensors**: the way the agent perceives the environment, such as cameras, microphones, or API responses.
- **Effectors**: the way the agent acts on the environment, such as wheels, robotic arms, or outgoing API calls.
- **State**: a description of the environment at a point in time.

A good state representation contains only the information necessary for the task. For Tic-Tac-Toe, a compact board representation is enough. For a logistics robot, the state might include position, battery level, and whether it is carrying a package. Including irrelevant data only increases complexity and memory cost without improving behavior.

The basic loop is perception, cognition, and action. A thermostat perceives the temperature, reasons about whether it is below the setpoint, and activates the furnace.

At a more formal level, an agent can be viewed as implementing a mapping from percept history to action. The representation does not need to be philosophically complete. It just needs to preserve enough information that the agent can choose well.

### The PEAS Framework: Classifying AI Problems

The PEAS framework helps classify AI problems by performance measure, environment, actuators, and sensors. The environment properties are especially important because they often determine which classes of algorithms are viable.

- **Fully vs. partially observable**: can the agent see the whole state?
  Fully observable games like chess expose all relevant information. Partially observable systems like poker or autonomous driving require uncertainty handling.
- **Deterministic vs. stochastic**: is the outcome of an action predictable?
  Chess is deterministic. Backgammon and many robotic tasks are stochastic because randomness or noise affects results.
- **Discrete vs. continuous**: is the state space finite or effectively infinite?
  Board games are discrete. Real-world movement and control are often continuous.
- **Benign vs. adversarial**: is another agent actively working against the system?
  GPS routing is benign. Chess, Go, and Isolation are adversarial.

These distinctions matter because the right algorithm for a fully observable, deterministic board game is rarely the right one for a stochastic, partially observable environment.

![PEAS framework mapping environment properties to AI algorithm families](/img/ai/search-plan/The_PEAS_Framework_for_AI.png)

### Rationality and Bounded Optimality

A practical intelligent agent is one that exhibits rational behavior: it takes actions that maximize expected utility given what it knows and what it can perceive.

The catch is that perfectly optimal action selection is often computationally intractable. That leads to bounded optimality. Instead of demanding the perfect move, the system should be designed to achieve strong behavior under real limits of time, memory, and compute. A chess AI should respond within a useful time budget, not after searching forever.

This is where heuristics become indispensable. A heuristic is not magic; it is an informed shortcut that helps focus computation where it is most useful.

That trade-off is not a flaw in AI. It is the engineering reality of AI. The useful question is rarely whether the agent is globally optimal. The useful question is whether it makes consistently strong decisions under the constraints that actually exist.

Bounded optimality can be understood as choosing the best policy under a resource budget, not in a vacuum. For example:

- A chess agent with 100 ms per move cannot use the same search depth as one with 5 seconds.
- A drone planner with strict battery limits may choose a "good enough" route that is safer and faster to compute.
- A recommender system with a 50 ms SLA may use an approximate ranker online and reserve heavier re-ranking for offline updates.

The implementation implication is simple: design the objective and the compute budget together. If one is optimized without the other, the system usually fails in production.

## Constraint Satisfaction Problems (CSPs)

### Introduction to CSPs

Many logical puzzles can be framed as constraint satisfaction problems. A CSP is defined by a set of variables, a domain of possible values for each variable, and a set of constraints that every valid solution must satisfy.

1. **Variables** are the components the solver needs to resolve, such as the 81 boxes in Sudoku.
2. **Domains** are the possible values for each variable, such as digits 1 through 9.
3. **Constraints** are the rules that define a valid solution, such as no repeated digit in a row, column, or 3x3 square.

This framing is useful because it turns a puzzle into a general-purpose problem representation rather than a one-off trick. Constraints can be unary, binary, or higher-order. That matters because the structure of the constraints often determines how much inference can be done before search starts.

### Case Study: Solving Sudoku

Sudoku is one of the best teaching examples for CSPs because the variable, domain, and constraint structure is so clear. The board can be represented as a mapping from each box, such as `A1`, to its current possible values. A solved box has one value. An unsolved box carries a set of possibilities.

That representation matters because it allows the system to alternate between deduction and search instead of jumping straight to brute force. Each cell participates in row, column, and subgrid constraints, and each solved cell immediately reduces the legal values of its peers. The board is not just a grid of digits. It is a dynamic domain table.

The board is often kept in a domain-map form such as:

- solved cell: `A1 = {7}`
- unsolved cell: `A2 = {1,3,5}`

This makes each inference step explicit and debuggable. If a domain accidentally becomes empty, it becomes much easier to see where a contradiction was introduced.

### Strategy 1: Constraint Propagation

Constraint propagation uses local rules to iteratively shrink the domain of possible values, reducing the need for search.

1. **Elimination** removes a solved value from all peer cells in the same row, column, and square.
2. **Only choice** assigns a value when a digit can only fit in one location within a unit.

By repeatedly applying these rules until nothing changes, many Sudoku puzzles can be solved without guessing at all. The deeper point is that propagation is a form of inference over domains. Every reduction in a domain removes whole subtrees from the eventual search space.

A micro-trace makes this tangible. Suppose row `A` currently has solved values `{7, 9, 4, 6}` and cell `A5` has domain `{1,2,4}`.

1. Elimination removes `4` from `A5`, so domain becomes `{1,2}`.
2. Later in the same row, if every other unsolved cell cannot take `2`, then `A5` becomes the only-choice location for `2`.
3. Assigning `A5=2` then triggers new eliminations in its column and subgrid.

That chain reaction is why propagation quality heavily influences search runtime.

### Strategy 2: Search (Depth-First Search)

When constraint propagation stalls, the system has to search.

1. **Choose** an unsolved box, ideally the one with the fewest remaining values.
2. **Try** one possible value.
3. **Recurse** by treating that tentative assignment as a new puzzle state.
4. **Backtrack** if the choice creates a contradiction.

The choice rule in step 1 is the Minimum Remaining Values heuristic. If one box has 2 values and another has 5, choosing the smaller domain first tends to expose contradictions faster and reduce wasted search. In other words, MRV is a branching-factor control mechanism.

The important lesson is that constraint propagation and search are not competing techniques. They are complementary. Propagation reduces the branching factor. Search resolves the remaining ambiguity.

This control flow is easier to internalize as a solver loop.

![CSP solver loop for Sudoku with propagation, contradiction checks, MRV branching, and backtracking](/img/ai/search-plan/AI_Logic_Puzzle_Solver_Loop.png)

The key thing to notice is where failure happens: contradiction checks are early, so bad branches are pruned before deep recursion.

At this point, the search loop is effectively a disciplined backtracking program:

```text
solve(board):
  board <- propagate(board)
  if contradiction(board): return failure
  if solved(board): return board

  v <- select_unassigned_variable_with_MRV(board)
  for value in domain(v):
    child <- assign(board, v, value)
    result <- solve(child)
    if result != failure: return result

  return failure
```

A small walkthrough makes the control flow clearer. Suppose MRV picks cell `C7` with domain `{2, 9}`:

1. Try `C7 = 2`, run propagation, and detect a contradiction because another cell in the same row now has an empty domain.
2. Backtrack immediately to `C7 = 9`.
3. Run propagation again, reduce several peer domains, then continue recursively.

That "fail fast" behavior is the reason MRV + propagation is so effective: bad branches terminate early before the tree grows.

![Sudoku backtracking example using the MRV heuristic](/img/ai/search-plan/Sudoku_Solving_With_MRV_Heuristic.png)

In practice, the pattern looks like this:

1. Apply inference until the puzzle stops changing.
2. Select the most constrained unresolved variable.
3. Branch on one value at a time.
4. Abort a branch immediately when any domain becomes empty.

That is already the core architecture of many practical CSP solvers.

In implementation, three debugging checks are worth keeping on at all times:

1. **Domain non-emptiness**: every unsolved variable must keep at least one value.
2. **Constraint sanity**: no unit (row/column/subgrid) contains duplicate solved values.
3. **Monotonic propagation**: domains should only shrink unless backtracking restores a prior snapshot.

These checks catch most solver bugs quickly and make recursive search failures easier to localize.

:::info Further Study: Bidirectional Search

For path-finding problems with a known start and goal, bidirectional search can reduce the effective search depth by exploring from both ends until the frontiers meet.

:::

## What This Means to Me as a Builder

The practical takeaway from this chapter is that AI starts with representation before it starts with algorithms.

If the state, constraints, or performance measure are defined poorly, even a clever search strategy will struggle. If the problem is defined well, simple inference and disciplined search can solve more than expected.

## Key Takeaways

1. Intelligence in engineering terms is task-specific, not mystical.
2. Agents, environments, sensors, effectors, and state are the basic vocabulary of AI system design.
3. The PEAS framing helps explain why some algorithms fit one environment but fail in another.
4. Bounded optimality matters because perfect decisions are often too expensive.
5. Constraint satisfaction gives a reusable way to model structured reasoning problems.
6. Sudoku works because inference and search reinforce each other.

## What to Read Next

Continue to [Uninformed and Informed Search](/ai/search-plan/uninformed-informed-search), where the focus shifts from structured constraints to systematic state-space exploration and heuristic guidance.