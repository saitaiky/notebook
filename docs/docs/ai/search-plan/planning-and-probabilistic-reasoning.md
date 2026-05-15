---
title: "Planning and Probabilistic Reasoning"
description: "A practical guide to planning, logic, Bayes nets, inference, and hidden Markov models in classical AI."
keywords:
  - planning
  - propositional logic
  - first order logic
  - classical planning
  - situation calculus
  - probability
  - bayes nets
  - hidden markov models
  - inference
sidebar_position: 3
---

# Planning and Probabilistic Reasoning

This chapter covers two parts of classical AI that are often taught separately but belong together in practice. Planning is about representing actions, goals, and world structure. Probabilistic reasoning is about coping with uncertainty when that structure is incomplete or noisy.

Together, they show how AI moves beyond pure search into representation and belief.

## Planning, Logic, and Reasoning

### Introduction to Planning

Search algorithms like A* work over a concrete state space. Planning operates at a more abstract level. A planning system uses logical representations of actions and goals to construct a sequence of steps that achieves an objective.

The important difference is flexibility. A problem-solving agent often plans once and executes. A planning agent can interleave planning and execution, observe the world, and revise the plan when conditions change.

Planning can be framed with three questions:

1. What facts describe the world right now?
2. What actions can legally change those facts?
3. Which fact pattern counts as success?

That framing is useful in real systems. A warehouse robot planner, for example, can replan when an aisle is blocked because the action model is explicit. If only raw paths are modeled and action preconditions are omitted, dynamic replanning becomes brittle.

### Propositional Logic

Propositional logic is the base layer of symbolic reasoning. It works with statements that can be true or false.

- Symbols represent propositions, such as "it is raining".
- Logical operators combine them, such as AND, OR, NOT, implication, and equivalence.

This gives me a formal way to express knowledge and test whether a set of statements is consistent, satisfiable, or valid.

The useful distinctions are simple but important:

- A sentence is **valid** if it is true in every model.
- A sentence is **satisfiable** if it is true in at least one model.
- A sentence is **unsatisfiable** if it is false in every model.

Those distinctions are what let logic become an engineering tool instead of just a notation system.

A tiny truth-table mindset helps in practice. Suppose the encoding is:

- $R$: it is raining
- $W$: the ground is wet
- rule: $R \rightarrow W$

If $R$ is also known to be true, then any consistent model should set $W$ to true. If $\neg W$ is added at the same time, the set becomes inconsistent. This is exactly how logical contradiction checking catches bad rule combinations in planning domains.

### First-Order Logic

Propositional logic is limited because it cannot naturally talk about objects and relations. First-order logic adds that expressive power.

- It can refer to objects, such as a person or a place.
- It can describe relations, such as one person being the sibling of another.
- It can use quantifiers such as "for all" and "there exists".

That makes it much more suitable for representing real-world domains compactly. In practice, the jump from propositions to quantified relations is what allows me to express statements like "for every package, there exists a delivery location" without writing one rule per object instance.

The representation difference is huge:

- Propositional style: `DeliverTo_P1_London`, `DeliverTo_P2_Leeds`, ...
- First-order style: $\forall p\; Package(p) \rightarrow \exists l\; DeliverTo(p, l)$

With first-order logic, one rule scales across objects. Without it, knowledge bases explode into instance-specific facts.

### Classical Planning

Classical planning describes a problem in terms of:

1. an initial state,
2. a goal state,
3. a set of actions with preconditions and effects.

The planner then searches for a sequence of actions that transforms the initial state into one that satisfies the goal. This can be done by progressing forward from the start or regressing backward from the goal. Regression is often attractive because it only considers actions that could help satisfy the target conditions.

That is a major difference from ordinary state-space search. The planner reasons over structured action descriptions rather than blindly expanding all reachable states.

This becomes concrete with a mini block-stacking domain.

- Initial state: `On(A,Table)`, `On(B,Table)`, `Clear(A)`, `Clear(B)`, `HandEmpty`
- Goal: `On(A,B)`
- Action `Stack(x,y)`:
  - Preconditions: `Holding(x)`, `Clear(y)`
  - Effects: `On(x,y)`, `Clear(x)`, `HandEmpty`, `not Clear(y)`, `not Holding(x)`

Progression planning starts from the initial state and applies legal actions forward. Regression planning starts from the goal and asks which actions could make that goal true. In small domains, either works. In goal-sparse domains, regression often prunes faster.

The comparison is easiest with the same goal `On(A,B)`:

- Progression: explore from all immediately legal actions, then filter paths that eventually satisfy the goal.
- Regression: start from `On(A,B)`, then derive which predecessor conditions must hold (for example `Holding(A)` and `Clear(B)`), and continue backward.

This backward framing is usually easier when goals are specific and action effects are well modeled.

This diagram contrasts the two planning directions.

<!-- NOTEBOOKLM_DIAGRAM: concept=ProgressionVsRegressionPlanning; type=image; goal=contrast progression planning from initial state with regression planning from goal conditions in one side-by-side flow; complexity=basic -->

Progression explores reachable futures; regression narrows required preconditions backward from the goal.

### Situation Calculus

Situation calculus is a logical framework for reasoning about change. Instead of talking about a world state as one snapshot, it talks about situations generated by sequences of actions.

Two ideas matter most:

- **Possibility axioms** specify when an action can be taken.
- **Successor-state axioms** specify how fluents change after actions.

Situation calculus is usually written with terms like $S_0$ for the initial situation and $Result(a, s)$ for the new situation created by performing action $a$ in situation $s$. Possibility is often written as $Poss(a, s)$.

This helps solve the frame problem, which is the challenge of describing what changes without having to restate everything that stays the same.

The frame problem appears when naive action models force me to restate every unaffected fact after each action. In a nontrivial domain, that becomes unmaintainable.

Situation calculus addresses this with successor-state axioms that specify what changes and implicitly preserve what does not. For example:

$$
At(robot, y, Result(Move(x, y), s)) \leftrightarrow True
$$

This reads as: after applying action $Move(x, y)$ in situation $s$, the fluent $At(robot, y)$ is true. Here, $x$ is the origin location, $y$ is the destination, and $Result(a, s)$ denotes the new situation produced by action $a$.

and pair it with axioms that preserve unrelated fluents unless an action explicitly affects them. The benefit is not just mathematical elegance; it is maintainability when the action set grows.

<!-- NOTEBOOKLM_DIAGRAM: concept=SituationCalculusFrameProblem; type=image; goal=contrast naive frame-axiom explosion with successor-state-axiom style update over fluents; complexity=intermediate -->

## Probabilistic Models

### Introduction to Probability

Probabilistic reasoning gives the agent a way to represent uncertainty as beliefs over possible states.

Some core ideas matter repeatedly:

- complementary probability,
- independence,
- the rule of total probability,
- Bayes' rule.

The most important of these in practice is Bayes' rule, because it formalizes belief updates: prior belief combined with evidence produces a posterior belief.

Some of the standard identities are worth keeping explicit:

$$
P(\neg A) = 1 - P(A)
$$

$$
P(A, B) = P(A)P(B) \quad \text{when $A$ and $B$ are independent}
$$

$$
P(A) = \sum_i P(A \mid B_i)P(B_i)
$$

$$
P(A \mid B) = \frac{P(B \mid A)P(A)}{P(B)}
$$

In these identities, $A$ and $B$ are events, $\neg A$ is the complement of $A$, and the set $\{B_i\}$ represents a partition of alternative cases used in the rule of total probability.

That last equation is the one that turns evidence into learning.

The easiest way to internalize Bayes' rule is a diagnosis example. Suppose:

- $P(Disease)=0.01$
- $P(Test+\mid Disease)=0.95$
- $P(Test+\mid \neg Disease)=0.05$

Then

$$
P(Disease \mid Test+) = \frac{0.95 \cdot 0.01}{0.95 \cdot 0.01 + 0.05 \cdot 0.99} \approx 0.161
$$

So a positive test does not imply 95% disease probability. It implies about 16.1% under this base rate. This is exactly why priors matter.

<!-- NOTEBOOKLM_DIAGRAM: concept=BayesRulePriorLikelihoodPosterior; type=image; goal=visualize prior, likelihood, evidence, and posterior with the medical-test numeric example; complexity=intermediate -->

### Bayes Nets

Bayes nets are directed acyclic graphs that compactly represent a joint probability distribution.

- **Nodes** are random variables.
- **Edges** indicate direct probabilistic dependency.

Their real value is that the graph structure encodes conditional independence assumptions. That makes large distributions tractable enough to reason about without enumerating every possible combination directly.

The key factorization is that the full joint distribution becomes a product of local conditional distributions:

$$
P(X_1, \ldots, X_n) = \prod_i P(X_i \mid Parents(X_i))
$$

Here, $X_1, \ldots, X_n$ are the random variables in the network, and $Parents(X_i)$ means the direct parent nodes of variable $X_i$ in the Bayes net graph.

That is the mathematical reason Bayes nets are so useful.

A classic example is `Cloudy -> Rain`, `Cloudy -> Sprinkler`, and both `Rain` and `Sprinkler` pointing to `WetGrass`. This graph says wet grass depends directly on rain and sprinkler, while rain and sprinkler become conditionally independent once conditioning on cloudy happens.

The practical win is parameter reduction. Instead of one full joint table over all variables, local conditional probability tables (CPTs) are specified per node.

That structure can be used for direct queries such as $P(Rain \mid WetGrass)$. Instead of enumerating every variable assignment in the full joint space, only the local factors touched by the query and its evidence are combined.

<!-- NOTEBOOKLM_DIAGRAM: concept=BayesNetWithCPTs; type=image; goal=show Cloudy-Rain-Sprinkler-WetGrass network and one example CPT for WetGrass conditioned on Rain/Sprinkler; complexity=intermediate -->

### Inference in Bayes Nets

Inference means computing what should now be believed about some query variables after observing evidence.

Three broad strategies matter:

1. **Enumeration**, which is conceptually simple but often too slow.
2. **Variable elimination**, which is a more efficient exact method.
3. **Approximate inference**, including sampling methods such as rejection sampling, likelihood weighting, and Gibbs sampling.

The practical point is that probabilistic reasoning is rarely about storing numbers alone. It is about choosing an inference method that matches the size and structure of the problem.

Gibbs sampling is especially important because it updates one non-evidence variable at a time using that variable's Markov blanket, which means its parents, its children, and the other parents of those children. That local conditional structure is what makes large approximate inference feasible.

Method choice usually follows problem scale:

- Enumeration: good for tiny networks and teaching, poor for large graphs.
- Variable elimination: strong exact baseline for moderate-size graphs.
- Sampling (for example Gibbs): useful when exact inference is too expensive or anytime estimates are needed.

A practical workflow is to start with variable elimination for correctness, then move to sampling only when latency or memory constraints force approximation.

Variable elimination is easier to trust with a tiny query. Suppose the query is $P(Rain \mid WetGrass=True)$ in the Cloudy-Sprinkler-Rain-WetGrass network. The workflow is:

1. Write the product of local factors.
2. Sum out hidden variables in an elimination order, for example `Cloudy` then `Sprinkler`.
3. Normalize the resulting factor over `Rain`.

That workflow makes two benefits obvious: exactness and reusable intermediate factors. It is often the best first implementation before moving to approximate methods.

Use this method-selection flow as a practical default.

<!-- NOTEBOOKLM_DIAGRAM: concept=BayesInferenceMethodSelectionFlow; type=image; goal=show practical method selection path among enumeration, variable elimination, and sampling based on graph size, exactness need, and latency; complexity=basic -->

The common workflow is exact-first for correctness, then approximate only when cost constraints force it.

### Hidden Markov Models (HMMs)

Hidden Markov Models are designed for sequential data such as speech, handwriting, and tagging problems.

- Hidden states represent the underlying process that cannot be observed directly.
- Observations are the visible outputs that can be observed.
- Transition probabilities describe movement between hidden states.
- Emission probabilities describe how likely each observation is from a given state.

The Markov assumption says the current hidden state depends only on the previous one, not on the full history:

$$
P(X_t \mid X_{1:t-1}) = P(X_t \mid X_{t-1})
$$

In this Markov assumption, $X_t$ is the hidden state at time step $t$, and $X_{1:t-1}$ means the full history of hidden states before time $t$.

The Viterbi algorithm is the classic dynamic-programming method for recovering the most likely hidden-state sequence from a sequence of observations. Instead of enumerating every possible state path, it keeps only the highest-probability path into each state at each time step and reconstructs the best sequence by backtracking through those choices.

The operational structure of an HMM is:

- transition model $P(X_t\mid X_{t-1})$,
- emission model $P(E_t\mid X_t)$,
- initial state prior $P(X_0)$.

Viterbi then computes:

$$
\delta_t(j) = \max_i \left[\delta_{t-1}(i) \cdot a_{ij}\right] \cdot b_j(e_t)
$$

Here, $\delta_t(j)$ is the score of the best path ending in hidden state $j$ at time $t$, $a_{ij}$ is the transition probability from state $i$ to state $j$, and $b_j(e_t)$ is the probability of observing $e_t$ from state $j$.

where $a_{ij}$ is transition probability and $b_j(e_t)$ is emission likelihood. Argmax backpointers are kept so the best full state sequence can be reconstructed after processing all observations.

This is the key insight: dynamic programming turns an exponential path search into a tractable table fill with backtracking.

A compact two-step example helps. Assume hidden states `{Sunny, Rainy}` and observations `{Umbrella, NoUmbrella}`.

1. At time $t=1$, compute initial scores for each state from prior and first emission.
2. At time $t=2$, for each current state, take the max over previous-state score times transition and emission.
3. Record which previous state achieved that max (the backpointer).
4. At sequence end, choose the best final state and backtrack pointers.

Even in this tiny case, Viterbi avoids evaluating every full state sequence explicitly. That is why it scales to longer observation streams.

<!-- NOTEBOOKLM_DIAGRAM: concept=HMMViterbiTrellis; type=image; goal=show HMM trellis with observation sequence, delta updates, and backpointer path reconstruction; complexity=advanced -->

:::info Further Study: Dynamic Time Warping

Dynamic Time Warping is another useful sequential-data technique. It aligns two temporal sequences that may vary in speed by finding a low-cost warping between them.

:::

## What This Means to Me as a Builder

The practical lesson here is that intelligence is not only about choosing actions well. It is also about representing the world well enough that actions, constraints, and uncertainty can be reasoned about explicitly.

Planning gives me structured control over actions and goals. Probability gives me structured control over uncertainty and evidence.

## Key Takeaways

1. Planning works at a more abstract level than ordinary state-space search.
2. Propositional logic is useful but limited by its inability to talk naturally about objects and relations.
3. First-order logic expands expressive power through objects, relations, and quantifiers.
4. Classical planning relies on initial state, goal, and action descriptions with preconditions and effects.
5. Situation calculus is one of the most important logical tools for reasoning about change.
6. Probabilistic models represent uncertainty as belief over possible states rather than as one fixed truth.
7. Bayes nets and HMMs are powerful because they combine compact structure with usable inference procedures.

## What to Read Next

Return to the [search-plan landing page](/ai/search-plan) if you want the whole chapter map again, or revisit [Search, Optimization, and Game Playing](/ai/search-plan/search-optimization-game-playing) if you want to compare symbolic reasoning with heuristic search.