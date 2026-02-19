---
title: "An Engineer's Guide to Classical AI"
description: "A practical, engineer-friendly notebook on classical AI problem solving — agents and rationality, constraint satisfaction (Sudoku), search and optimisation, adversarial game playing (minimax), and probabilistic models for NLP."
keywords:
  [
    classical ai,
    artificial intelligence,
    search algorithms,
    planning,
    reasoning,
    intelligent agents,
    rational agents,
    state space search,
    constraint satisfaction problem,
    csp,
    sudoku solver,
    constraint propagation,
    backtracking search,
    optimisation,
    local search,
    hill climbing,
    simulated annealing,
    adversarial search,
    minimax,
    alpha beta pruning,
    game playing ai,
    part of speech tagging,
    probabilistic models,
    bayesian networks,
    hidden markov models,
    hmm,
    inference
  ]
---

:::warning As of July 2024
It might take me a bit to get everything written down, but I'll carve out some time for this section (there's just so much new tech these days!). In the meantime, I've set up a [showcase section](/ai/showcase/) where you can check out all the source code and demos of the techniques I'll be covering. Stay tuned and happy learning!
:::

## Overview

Understanding the fundamental techniques of AI, such as search, planning, and reasoning, is crucial for developing intelligent systems capable of solving complex problems. These methods allow AI agents to navigate environments, make decisions, and find solutions efficiently. For instance, building an AI to solve Sudoku introduces the basics of logical constraints and backtracking, essential for structured problem-solving. This foundational knowledge helps create systems that can handle various real-world tasks, from scheduling to automated reasoning.

Additionally, techniques like uninformed and informed search, optimization methods, and game theory play a significant role in more advanced applications, such as developing AI chess players or competitive game agents. These methods enable AI to optimize decisions, anticipate opponents' moves, and perform well in strategic scenarios. Furthermore, probabilistic models and natural language processing equip AI with the ability to understand and generate human language, making these techniques indispensable for applications in communication, translation, and more. By mastering these core AI techniques, we pave the way for creating smarter, more efficient, and versatile AI systems that can revolutionize various industries.

## Table of content


- Build an AI agent to solve Sudoku *(see: [Agents, environments, and state](#12-agents-environments-and-state), [Rational behaviour](#14-rationality-and-bounded-optimality), [Sudoku as a CSP](#22-case-study-solving-sudoku), [Constraint propagation](#23-strategy-1-constraint-propagation), [Backtracking search (DFS)](#24-strategy-2-search-depth-first-search))*
    - Define core concepts from AI including “agents”, “environments”, and “states” *(see: [Part 1.2](#12-agents-environments-and-state))*
    - Learn the concept of “rational” behaviour for AI agents *(see: [Part 1.4](#14-rationality-and-bounded-optimality))*
    - learn
        - represent problems in terms of logical constraints *(see: [Part 2.1](#21-introduction-to-csps) and [Part 2.2](#22-case-study-solving-sudoku))*
        - constraint propagation to limit the potential solution space *(see: [Part 2.3](#23-strategy-1-constraint-propagation))*
        - Incorporate backtracking search to find a solution when the set of constraints is incomplete *(see: [Part 2.4](#24-strategy-2-search-depth-first-search))*
- Forward Planning Agent (AI Chess player) *(see: [Part 6: Planning, logic, and reasoning](#part-6-planning-logic-and-reasoning) and [Part 3: Optimisation](#part-3-optimization-with-local-search))*
    - Classical search *(note: a dedicated “uninformed vs informed search” section is not yet written in this notebook; the closest existing search section is [Part 2.4](#24-strategy-2-search-depth-first-search), and the planning-focused content starts at [Part 6.4](#64-classical-planning).)*
        - Uninformed Search *(planned)*
        - Informed Search *(planned)*
    - Optimization Problems *(see: [Part 3](#part-3-optimization-with-local-search))*
        - Hill Climbing *(see: [Part 3.3](#33-local-search-hill-climbing))*
        - Simulated Annealing *(see: [Part 3.4](#34-overcoming-local-maxima-simulated-annealing))*
        - Genetic Algorithms *(planned)*
        - Late Acceptance Hill Climbing, Basin Hopping, & Differential Evolution *(planned)*
- Adversarial Game Playing Agent *(see: [Part 4](#part-4-adversarial-search-for-game-playing) and [Part 5](#part-5-advanced-game-playing-techniques))*
    - Multi-Agent Domains *(see: [Part 5.4](#54-multiplayer-and-probabilistic-games))*
        - minimax search technique *(see: [Part 4.2](#42-the-minimax-algorithm))*
        - state space search *(see: [Part 4.1](#41-introduction-to-game-trees) and [Part 4.4](#44-depth-limited-search-and-evaluation-functions))*
    - Optimizing Minimax Search *(see: [Part 4.5](#45-optimizing-with-alpha-beta-pruning))*
    - Extending Minimax Search *(see: [Part 5.1](#51-iterative-deepening) and [Part 5.2](#52-the-horizon-effect-and-quiescence-search))*
- Part of Speech Tagging *(see: [Part 7](#part-7-probabilistic-models))*
    - Discrete distributions, joint probabilities, and conditional probabilities *(see: [Part 7.1](#71-introduction-to-probability))*
    - Bayes Networks (Inference in Bayes Nets) *(see: [Part 7.2](#72-bayes-nets) and [Part 7.3](#73-inference-in-bayes-nets))*
    - Hidden Markov Models *(see: [Part 7.4](#74-hidden-markov-models-hmms))*
    - Dynamic Time Warping *(planned)*
    - Probabilistic graphical models *(partly covered via Bayes nets + HMMs; more planned)*

This guide synthesizes key concepts in classical Artificial Intelligence, designed for practitioners. It follows a logical progression from foundational principles to advanced algorithms in search, constraint satisfaction, game playing, and probabilistic modeling, using the Udacity AI Nanodree syllabus as a structural backbone and incorporating detailed practical notes.


## **Part 1: Foundations of Artificial Intelligence**

### **1.1 What is Intelligence?**

For AI to be a productive field, our notion of intelligence must be a property that emerges from the system itself, not just our perception of it. While Artificial General Intelligence (AGI) aims to replicate human-like thinking, a more practical approach is to define intelligence **within the context of a specific task**. This is often called narrow AI. An agent that can successfully play chess is intelligent at chess, but this says nothing about its ability to drive a car or compose music. Our focus is on designing systems that exhibit rational, goal-oriented behavior for well-defined problems, where "rational" means selecting actions that are expected to maximize a performance measure.

### **1.2 Agents, Environments, and State**

AI is fundamentally about building **agents**—systems that interact with an **environment**.

* **Agent**: The system making decisions (e.g., the Roomba robot or just its control software). This is the entity we are building.  
* **Environment**: The world the agent operates in. This can be anything from a simulated chessboard to the physical world of a factory floor.  
* **Sensors**: How the agent perceives the environment (e.g., a camera, bumper sensor, microphone, API endpoint). These are the inputs to the agent.  
* **Effectors**: How the agent acts on the environment (e.g., wheels, vacuum motor, robotic arm, API call). These are the outputs of the agent.  
* **State**: A description of the environment at a point in time. A good state representation includes only the information **necessary** for the agent's task. For a Tic-Tac-Toe agent, the state can be represented by a 9-element array. For a logistics robot, the state might be a JSON object containing `{ "location": \[x, y\], "battery\_level": 0.85, "carrying\_package": true }`. Including irrelevant data, like the factory's wall color, would needlessly complicate the problem and increase memory usage.

The agent's life cycle is a continuous loop: **Perception** \-\> **Cognition** \-\> **Action**. For example, a smart thermostat perceives the room temperature is below the setpoint (Perception), decides it needs to activate the furnace (Cognition), and sends the signal to turn it on (Action).

### **1.3 The PEAS Framework: Classifying AI Problems**

We can classify AI problems using the PEAS (Performance, Environment, Actuators, Sensors) framework, which helps us understand the problem's constraints. The properties of the environment are particularly important for algorithm choice.

* **Fully vs. Partially Observable**: Can the agent see the entire state?  
  * *Fully*: Chess, Tic-Tac-Toe. All information needed to make the optimal move is available. The current state representation contains everything the agent needs to know.  
  * *Partially*: Poker (opponent's cards are hidden), a self-driving car (a car might be around a blind corner). The agent must handle uncertainty, maintain an internal belief about the world's state, and make decisions with incomplete information.  
* **Deterministic vs. Stochastic**: Is the outcome of an action certain?  
  * *Deterministic*: A chess move has a guaranteed result. The next state is perfectly predictable given the current state and the action.  
  * *Stochastic*: Rolling dice in Backgammon introduces randomness. An agent can't know the exact outcome of its action, so it must plan for probabilities. A robot arm trying to grasp an object might succeed or fail with some probability.  
* **Discrete vs. Continuous**: Are the states finite?  
  * *Discrete*: Tic-Tac-Toe has a finite, though large, number of board states.  
  * *Continuous*: A self-driving car's position and velocity are real numbers from an infinite range, requiring different algorithmic approaches like discretization or continuous-space planners.  
* **Benign vs. Adversarial**: Is another agent actively working against you?  
  * *Benign*: A GPS route-finder isn't competing against an anti-GPS agent. The environment may be complex (e.g., traffic), but it's not hostile.  
  * *Adversarial*: Chess, Go, Isolation. An opponent tries to make you lose, forcing the agent to consider the opponent's potential actions. This is the core of game-playing AI.

### **1.4 Rationality and Bounded Optimality**

A practical definition of an intelligent agent is one that exhibits **rational behavior**: it takes actions to maximize its expected utility or outcome. It makes the "best" decision it can based on its knowledge and perceptions.

However, finding the *perfectly* optimal action is often computationally intractable. This leads to **Bounded Optimality**: we design an agent to meet a desired performance level given real-world constraints like time and memory. A chess AI should respond within a reasonable time, not after calculating for a million years. The goal shifts from finding the perfect move to finding a very good move within the given constraints. This is achieved using **heuristics**—rules or functions that guide the search for a solution more efficiently than brute force, essentially providing an "educated guess" to focus the agent's computational effort.

## **Part 2: Constraint Satisfaction Problems (CSPs)**

### **2.1 Introduction to CSPs**

Many logical puzzles can be framed as CSPs. A CSP is defined by a set of variables, a domain of possible values for each variable, and a set of constraints that a valid solution must satisfy. This provides a powerful, general-purpose framework for problem-solving.

1. **Variables**: The components you need to solve for (e.g., the 81 boxes in Sudoku, or regions on a map to be colored).  
2. **Domains**: The set of possible values for each variable (e.g., digits 1-9 for Sudoku, `{red, green, blue}` for map coloring).  
3. **Constraints**: The rules that valid solutions must adhere to (e.g., no repeated digits in a row, column, or 3x3 square; adjacent map regions cannot have the same color). These constraints can be unary (involving one variable), binary (two variables), or higher-order.

### **2.2 Case Study: Solving Sudoku**

We can build an agent to solve any Sudoku puzzle using two core techniques. The board is represented as a dictionary mapping each box (e.g., 'A1') to its possible values (e.g., '123456789' for empty, '5' for solved). This structure is ideal for tracking the domain of each variable.

### **2.3 Strategy 1: Constraint Propagation**

This involves using local constraints to iteratively reduce the domain of possible values for variables, thus simplifying the problem without having to search. This is a form of logical inference that prunes the search space before the search begins.

1. **Elimination**: If a box is solved (e.g., 'A1' \= '5'), eliminate '5' as a possibility from all its **peers**—the 20 other boxes that are in the same row, column, and 3x3 unit. Each time a value is eliminated, it can trigger further deductions across the board.  
2. **Only Choice**: If, within a unit (a row, column, or 3x3 square), a digit can only be placed in one box, then that box *must* be assigned that value, even if that box had other possibilities. This powerful rule often unlocks the next step in a solution.

By repeatedly applying these two simple rules in a cycle until no more changes can be made, many Sudoku puzzles can be solved without any guessing at all.

### **2.4 Strategy 2: Search (Depth-First Search)**

When constraint propagation stalls, the agent must search. This means making a guess and exploring its consequences.

1. **Choose**: Pick an unsolved box. A powerful heuristic is to choose the box with the **Minimum Remaining Values (MRV)**—the one with the fewest possibilities. This minimizes the branching factor of the search tree. Choosing a box with 2 possibilities over one with 5 means you are more likely to quickly discover a contradiction if the guess is wrong, allowing the algorithm to "fail fast" and backtrack sooner.  
2. **Try**: Assign one of the possible values to that box.  
3. **Recurse**: Treat this as a new puzzle and try to solve it using constraint propagation and further search.  
4. **Backtrack**: If a choice leads to a contradiction (a box with zero possibilities), it was wrong. Undo the guess and return to the last choice point to try the next value.

This combination of constraint propagation (to reduce the problem) and search (to explore possibilities) is a powerful pattern in AI.

:::info Further Study: Bidirectional Search

For path-finding problems where the start and goal states are known (like finding a route on a map), **Bidirectional Search** can be a significant optimization. Instead of searching only forward from the start, this algorithm simultaneously searches forward from the start and backward from the goal. The search stops when the two search frontiers intersect. This can be much faster than a unidirectional search, as it effectively halves the search depth.

:::

## **Part 3: Optimization with Local Search**

### **3.1 From Finding a Solution to Finding the Best Solution**

In the previous section on CSPs, our goal was to find *any* solution that satisfied all the constraints. However, many important problems in AI require us to find the *best* solution, or the **optimal** one. Instead of just a goal test, we now have an **objective function** that we want to maximize or minimize.

### **3.2 The Challenge of Optimization Problems**

A classic example is the **Traveling Salesman Problem (TSP)**. Given a list of cities and the distances between them, what is the shortest possible route that visits each city exactly once and returns to the origin city?

This is an NP-hard problem. The number of possible routes is factorial, meaning the state space is enormous and grows incredibly quickly. For just 20 cities, there are over ![][image1] possible tours. A systematic search like DFS is completely intractable. We need a different approach.

### **3.3 Local Search: Hill Climbing**

Instead of exploring paths from a start state, local search algorithms operate on a single complete state and try to iteratively improve it.

**Hill Climbing** is the simplest local search algorithm. It works as follows:

1. Start with a random complete state (e.g., a random tour of all cities).  
2. Evaluate its quality using the objective function (e.g., calculate the total tour length).  
3. Consider all its "neighbors" (e.g., all tours that can be created by swapping two cities in the current tour).  
4. Move to the best neighbor.  
5. Repeat steps 2-4 until no neighbor is better than the current state.

The problem with Hill Climbing is that it's a "greedy" algorithm. It will always find a peak, but it has no way of knowing if it's a small foothill (a **local maximum**) or the highest point in the entire landscape (the **global maximum**). It will get stuck on the first peak it finds.

### **3.4 Overcoming Local Maxima: Simulated Annealing**

How can we allow an algorithm to escape a local maximum? By sometimes making a "bad" move. **Simulated Annealing** is an algorithm that does just this. It borrows its core idea from metallurgy, where annealing involves heating a material and then slowly cooling it to make it stronger.

The algorithm is similar to Hill Climbing, but with a crucial twist:

1. Start with a random state and a high "temperature" (![][image2]).  
2. At each step, pick a random neighbor.  
3. If the neighbor is better, move to it.  
4. If the neighbor is worse, we might still move to it. The decision is probabilistic. We accept the worse move with a probability of ![][image3], where ![][image4] is how much worse the new state is.

The key is the **temperature** ![][image2]:

* When ![][image2] is high (at the beginning), the algorithm is very likely to accept worse moves, allowing it to explore the entire search space broadly and jump out of local maxima.  
* As ![][image2] gradually decreases according to a "cooling schedule" (e.g., ![][image5]), the algorithm becomes more "greedy," less likely to accept bad moves, and eventually converges on a good solution as it "cools."

This use of controlled randomness is a powerful technique for finding good solutions to complex optimization problems where systematic search would fail.

:::info Further Study: Genetic Algorithms

Another powerful optimization technique inspired by nature is the **Genetic Algorithm**. Instead of a single state, it maintains a "population" of states. In each generation, the "fittest" states (those with the best objective function scores) are selected to "reproduce." They create the next generation of states by combining their features (crossover) and introducing random changes (mutation). Over many generations, the population evolves toward highly optimal solutions.

:::

## **Part 4: Adversarial Search for Game Playing**

### **4.1 Introduction to Game Trees**

For adversarial, turn-based, deterministic games like Tic-Tac-Toe or Isolation, we can model the game as a **game tree**.

* **Nodes**: Represent the state of the game (i.e., the board configuration).  
* **Edges**: Represent valid moves that transition from one state to another.  
* **Root**: The initial state of the game.  
* **Leaf Nodes**: Terminal states where the game has ended (a win, loss, or draw), each having a final utility value.

### **4.2 The Minimax Algorithm**

The goal is to find the optimal move from the current state. Minimax assumes you are playing against a perfect, rational opponent who is also trying to win.

* You are the **MAX** player, trying to maximize your score.  
* Your opponent is the **MIN** player, trying to minimize your score.

The algorithm performs a full depth-first traversal of the game tree down to the terminal states. It then propagates the utility values (e.g., \+1 for a win, \-1 for a loss, 0 for a draw) back up the tree.

* At **MAX nodes**, the value is the maximum of its children's values. The agent will choose the move that leads to the best possible outcome for itself.  
* At **MIN nodes**, the value is the minimum of its children's values. The agent assumes the opponent will choose the move that is worst for the agent.

The agent then chooses the move that leads to the child node with the highest minimax value at the top level.

### **4.3 The Problem of Scale & The Need for Heuristics**

For any non-trivial game, the game tree is enormous. For a 5x5 Isolation board, the number of possible game states is astronomical (\~![][image6]), making it impossible to search to the end. To put that in perspective, this is more than the estimated number of grains of sand on all the world's beaches.

* **Branching Factor (B)**: The average number of legal moves from any given state. For Isolation, this is around 8\.  
* **Depth (D)**: The maximum number of moves in a game. For 5x5 Isolation, this is 25\.

The total number of nodes to search is roughly ![][image7], which is computationally intractable. We simply cannot explore the entire tree.

### **4.4 Depth-Limited Search & Evaluation Functions**

Since we can't search to the end, we must stop at a certain depth. This is called **Depth-Limited Search**. Given a modern CPU, we might be able to search 9-10 levels deep in a game like Isolation within a 2-second time limit.

But how do we evaluate the "goodness" of a game state if it's not a terminal state? We need an **Evaluation Function** (a heuristic). This function scores a non-terminal board state, estimating how likely it is to lead to a win. A good evaluation function should be:

1. Fast to compute.  
2. Strongly correlated with the actual chances of winning.

A good evaluation function for Isolation could be:

score \= (\# my\_moves) \- (\# opponent\_moves)

This heuristic favors states where we have more options and our opponent has fewer. More aggressive variants could weight the opponent's moves more heavily, e.g., \#my\_moves \- 2 \* \#opponent\_moves. The key is that the function must be fast to compute and provide a reasonably accurate measure of the game's state.

### **4.5 Optimizing with Alpha-Beta Pruning**

Minimax explores the entire game tree to the given depth, but much of this work is redundant. Alpha-Beta Pruning is an optimization that returns the same result as Minimax, but by pruning away branches that cannot possibly influence the final decision.

It works by keeping track of two values as it traverses the tree:

* **Alpha (![][image8])**: The best score (highest value) found so far for the **MAX** player along the path to the root. This is the minimum score that MAX is guaranteed.  
* **Beta (![][image9])**: The best score (lowest value) found so far for the **MIN** player along the path to the root. This is the maximum score that MIN will allow.

**Pruning Rule:** The search on a branch can be stopped as soon as ![][image10].

* At a MIN node, if you find a value that is less than or equal to alpha, you can stop exploring that node's other children. The MAX player at the level above would never choose this path, because they already have a better option (alpha) available elsewhere.  
* At a MAX node, if you find a value that is greater than or equal to beta, you can prune. The MIN player above would never let you take this path because they have an option elsewhere that leads to a better (lower) score for them.

With optimal move ordering, Alpha-Beta Pruning can reduce the effective branching factor from B to ![][image11], effectively allowing you to search twice as deep in the same amount of time. Even with random ordering, it provides a significant speedup.

## **Part 5: Advanced Game Playing Techniques**

### **5.1 Iterative Deepening**

A key challenge in game playing is managing the time limit for each move. How deep should we search? If we set a fixed depth, we might finish too early and waste valuable computation time, or we might search too deep and run out of time before finding a good move.

**Iterative Deepening** is the practical solution. Instead of a single deep search, we perform a series of depth-limited searches, increasing the depth each time.

1. **Depth 1 Search**: Find the best move looking only one step ahead. Save this move.  
2. **Depth 2 Search**: Repeat the search from scratch, looking two steps ahead. Save the new best move.  
3. **Depth 3 Search**: Repeat again, looking three steps ahead.  
4. ...and so on, until the time limit is about to expire.

When the time is up, the agent simply returns the best move found from the *most recently completed search*. This makes the agent "anytime"—it can be interrupted and still provide a valid move. Surprisingly, the "wasted" work of the earlier searches is minimal because the time is dominated by the last, deepest level of search due to the exponential growth of the tree.

### **5.2 The Horizon Effect & Quiescence Search**

A major weakness of depth-limited search is the **Horizon Effect**. An agent might make a move that looks good within its search depth (its "horizon"), but this move leads to a disaster just beyond that horizon. For example, a chess AI might happily capture a pawn, seeing only a \+1 gain, not realizing that two moves past its search depth, this capture opens a line for its queen to be captured.

**Quiescence Search** is a technique to mitigate this. The idea is to not stop searching at a fixed depth if the situation is "unstable" or "noisy," such as during a sequence of captures in chess. A quiescent search would continue exploring these "hot" sequences until the board reaches a more stable, or "quiescent," state where the evaluation function is more reliable. This helps the agent avoid making moves that are only superficially good.

### **5.3 Advanced Evaluation Functions**

The simple heuristic of my\_moves \- opponent\_moves is a good start, but more sophisticated evaluation functions can lead to much stronger play. A good function often involves feature engineering and weighting, but this comes with a trade-off: a more complex function is slower, reducing the search depth possible within the time limit.

* **Weighted Features**: Instead of treating all moves equally, we can assign different weights. An aggressive strategy might heavily penalize the opponent's moves: my\_moves \- 2 \* opponent\_moves.  
* **Positional Heuristics**: In many games, certain board positions are inherently more valuable. In chess, controlling the center of the board is a huge advantage. An evaluation function can add a bonus for occupying these key squares.  
* **Partition Detection**: In a game like Isolation, a key event is when the board gets partitioned, splitting the players into separate regions. A smart evaluation function can detect this, calculate who has more space in their partition, and return a winning or losing score, effectively ending that branch of the search early.

### **5.4 Multiplayer & Probabilistic Games**

* **MAXN**: For games with more than two players, Minimax doesn't work. Instead, we use **MAXN**, where each node in the game tree is a vector of scores, one for each player. At each level, the current player chooses the move that maximizes their own score in that vector, assuming all other players will do the same on their turns.  
* **Expectimax**: For games with an element of chance (like rolling dice), we introduce "chance nodes" into the game tree. Instead of a MIN or MAX player, these nodes calculate the *expected value* of the outcomes below them by taking a weighted average based on the probability of each outcome. The MAX player then chooses the move that leads to the highest expected utility.

## **Part 6: Planning, Logic, and Reasoning**

### **6.1 Introduction to Planning**

While search algorithms like A\* find a path from a start to a goal, they operate on a concrete state space. **Planning** is a more abstract form of problem-solving. A planning agent uses logical representations of actions and goals to devise a sequence of actions, often without needing a detailed map of every possible state.

The key difference is that a problem-solving agent (like a GPS) finds a complete plan and then executes it, assuming the world doesn't change. A planning agent can operate in more complex environments by interleaving planning and execution, reacting to unforeseen circumstances. It can generate a partial plan, execute it, observe the outcome, and then re-plan as necessary.

### **6.2 Propositional Logic**

Propositional logic is the foundation of symbolic reasoning. It deals with **propositions**—statements that can be either True or False.

* **Symbols**: We use symbols (e.g., ![][image12]) to represent propositions. (![][image13] could mean "It is raining.")  
* **Operators**: We combine symbols using logical operators:  
  * ![][image14] (AND): ![][image15] is true if both ![][image13] and ![][image16] are true.  
  * ![][image17] (OR): ![][image18] is true if at least one of ![][image13] or ![][image16] is true.  
  * ![][image19] (NOT): ![][image20] is true if ![][image13] is false.  
  * ![][image21] (Implies): ![][image22] is true if ![][image13] is false or ![][image16] is true. (If P happens, Q must also happen).  
  * ![][image23] (Equivalence): ![][image24] is true if ![][image13] and ![][image16] are both true or both false.

A **model** is an assignment of truth values to all symbols. A sentence is **valid** if it's true in every possible model, **satisfiable** if it's true in at least one model, and **unsatisfiable** if it's false in all models.

### **6.3 First-Order Logic**

Propositional logic is limited because it can't talk about objects, their properties, or relations between them. **First-Order Logic (FOL)** extends it to handle this, giving us much greater expressive power.

* **Objects, Relations, Functions**: The world in FOL consists of objects (e.g., 'KingJohn', 'RichardTheLionheart'), relations between them which are true or false (e.g., Brother(KingJohn, Richard)), and functions that map objects to other objects (e.g., LeftLegOf(KingJohn)).  
* **Quantifiers**: FOL introduces quantifiers to express properties of groups of objects:  
  * **Universal Quantifier (![][image25])**: "For all...". ![][image26] means "For all x, if x is a king, then x is a person."  
  * **Existential Quantifier (![][image27])**: "There exists...". ![][image28] means "There exists an x such that x is a crown AND x is on King John's head."

FOL is far more expressive than propositional logic, allowing us to represent complex knowledge about the world concisely.

### **6.4 Classical Planning**

Classical planning uses a formal language (often a variant of FOL) to describe problems. A planning problem is defined by:

1. **Initial State**: A logical description of the starting conditions.  
2. **Goal**: A logical description of the desired state.  
3. **Actions (or Operators)**: A set of action schemas, each defined by:  
   * **Preconditions**: A set of logical conditions that must be true before the action can be executed.  
   * **Effects**: A set of logical conditions that become true (or false) after the action is executed.

A planning algorithm then searches for a sequence of actions that transforms the initial state into a state that satisfies the goal. This can be done forwards from the start (**progression search**) or backwards from the goal (**regression search**). Regression is often more efficient because it only considers actions that could help achieve the goal, avoiding an aimless exploration of the state space.

### **6.5 Situation Calculus**

Situation calculus is a specific formulation of first-order logic for representing change. Instead of states, it talks about **situations**. A situation is a sequence of actions starting from an initial situation ![][image29].

A new situation ![][image30] is the result of performing an action ![][image31] in a situation ![][image32], written as ![][image33].

It uses special axioms to define how the world works:

* **Possibility Axioms**: These define when an action is possible. ![][image34] is true if action ![][image31] can be performed in situation ![][image32].  
  * Example: ![][image35] means "It is possible to fly plane ![][image36] from ![][image37] to ![][image38] in situation ![][image32] if the plane is at ![][image37] in situation ![][image32]."  
* **Successor-State Axioms**: These define how properties (called *fluents*) change. For each fluent, an axiom specifies exactly when it will be true in the next situation. It states that a fluent remains true if it was already true and the last action didn't make it false, or if the last action explicitly made it true. This elegantly solves the **frame problem**—the challenge of specifying everything that *doesn't* change after an action.

Situation calculus provides a powerful, formal way to reason about actions and their effects, though it can be computationally intensive.

## **Part 7: Probabilistic Models**

### **7.1 Introduction to Probability**

Probabilistic models allow agents to handle the uncertainty inherent in the real world by representing their belief state as a distribution over all possible states.

* **Complementary Probability**: ![][image39].  
* **Independence**: Two events A and B are independent if ![][image40]. Knowing one doesn't give you information about the other.  
* **Rule of Total Probability**: If you have a set of mutually exclusive and exhaustive events ![][image41], you can find the probability of another event A by summing over the cases:![][image42]  
* **Bayes' Rule**: This is the cornerstone of probabilistic reasoning, allowing us to update our beliefs based on new evidence. It mathematically formalizes the process of learning.![][image43]  
  * ![][image44] is the **posterior**: the probability of a hypothesis A after seeing evidence B.  
  * ![][image45] is the **prior**: our initial belief in the hypothesis A.  
  * ![][image46] is the **likelihood**: how likely we are to see evidence B if the hypothesis A is true.  
  * ![][image47] is the **marginal likelihood**: the total probability of the evidence, which acts as a normalization constant.

### **7.2 Bayes' Nets**

Bayes' Nets are directed acyclic graphs that provide a compact, intuitive, and efficient representation of a joint probability distribution.

* **Nodes**: Represent random variables.  
* **Arcs (Arrows)**: Represent probabilistic dependencies. An arrow from A to B means A has a direct influence on B. A is a "parent" of B.

The structure encodes **conditional independence** assumptions. A variable is independent of its non-descendants, given its parents. This allows us to represent a massive joint distribution with a small number of parameters. For example, a system with 20 binary variables would require over a million values for the full joint table, but if each variable has at most two parents in a Bayes' Net, it might only require a few hundred. Building nets in the **causal direction** (from causes to effects) generally results in the most compact and intuitive structure.

### **7.3 Inference in Bayes' Nets**

Inference is the process of computing the posterior distribution for a set of query variables, given some evidence variables that have been observed.

* **Inference by Enumeration**: The most basic method. It involves summing out the hidden variables from the full joint distribution. This is often too slow as its runtime is exponential in the number of hidden variables.  
* **Variable Elimination**: A more efficient exact inference algorithm. It works by interleaving the operations of joining factors (multiplying probability tables) and summing out variables, which avoids the costly step of creating the full joint distribution.  
* **Approximate Inference (Sampling)**: For very large networks, even variable elimination is too slow. We can use sampling methods to approximate the posterior distribution.  
  * **Rejection Sampling**: Generate samples from the network's prior distribution, then reject any samples that don't match the evidence. Very inefficient if the evidence is rare.  
  * **Likelihood Weighting**: Fix the evidence variables to their observed values and generate samples for the other variables. Each sample is weighted by the likelihood of the evidence given its parents. More efficient than rejection sampling.  
  * **Gibbs Sampling (MCMC)**: Start with a random state (consistent with the evidence). Iteratively, pick a non-evidence variable and resample its value conditioned on its **Markov blanket** (its parents, children, and children's other parents). Over time, the distribution of visited states will converge to the true posterior.

### **7.4 Hidden Markov Models (HMMs)**

HMMs are a type of Bayes' Net used for modeling sequential data, like speech, handwriting, or gestures. They assume the state at time ![][image48] only depends on the state at time ![][image49] (the Markov property).

* **Hidden States (![][image50])**: The underlying, unobservable states of the system (e.g., the phoneme being spoken).  
* **Observations (![][image51])**: The observed data at each time step (e.g., the audio signal).  
* **Transition Probabilities**: ![][image52], the probability of moving from one state to another.  
* **Emission/Output Probabilities**: ![][image53], the probability of seeing an observation given the current hidden state.

**The Viterbi Algorithm** is a dynamic programming algorithm used to find the most likely sequence of hidden states given a sequence of observations. It builds a trellis (a grid of states over time) and, for each state at each time step, it calculates the highest probability path that could lead to that state, effectively finding the best path through the trellis without having to enumerate all possible paths.

:::info Further Study: Dynamic Time Warping (DTW)

While HMMs are a probabilistic approach to sequential data, **Dynamic Time Warping (DTW)** is another powerful technique, often used in speech recognition. DTW is a deterministic algorithm that measures the similarity between two temporal sequences that may vary in speed. It works by finding an optimal non-linear "warping" of the time axis to align the two sequences, minimizing the distance between them. It's particularly useful when the underlying patterns are similar but out of phase.

:::

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAXCAYAAABu8J3cAAABhElEQVR4Xu2VPS8EURSGV6LRiIjGZrOzxVRaf0Ot1Gh8hCBaf8AiGo2IVqEWhSgUCioSofdRiCVY2bCJ8Nw4I8eZe1dilkL2Td7cOc85c++7N5NsLvefVSwWB6Iomrccto2v8KrtNVWFQqGbQ2YIcmCDUD8kz/T7bP9XxEF79iDqN1Nv6TolBmZLpdKo5Ynoz+FHXMPDtu8UCLLrwtAbYr3TvU/R2MB1NygeszNO8FO8o+oTvK9nnCRI2XLYi+z/ZHsphYLEcdzpepY7xg12aSZBFjWjfpXHdgnUOEwoCOwoFASvaSZBltRML17RM769vqhBEMdTL/u4C8ItLRt2rmveqek6paxBoo8P+RZXcDXhBOkXto7vEx6UbDwe4N8GaZrcpqSf8HHfgSGeWRJk0sd9B4Z4ZrlN+dCmPLzqO1CCnFmeWRJk2nJuaTAUxH2IlmdSPp/vkV+4YHtOEnJE1WVfuB+LzTbxDb7EF7Je47qe49+1Q8Icsh7jZ3CbnmmppZb+Su92MpomaP4FvAAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAt0lEQVR4XmNgGCFAXl5+MxD/JxYja/wvJycXhmQWWAxFERAoKChowMVkZGSEgJzNyAqAgAmq8QKaOAPQgkdgBlByK5BiRJYEmlwA0gik/ZHFtbS02IDifWAO0IR8ZEkQAEq+R3cmCAANElBUVBRHF4cDbP4jBjBDNZ5Bl8ALgE4vh2r0RpfDC4AaPpPjTPL8Bw1u0v0H1DAbpBEY7AnochgAqDAIiL/JQ+LuLRSD/PmLZCePgoECAD3RQx1na4DKAAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAAYCAYAAABEHYUrAAACXklEQVR4Xu2WOYhUQRCG1wUVRVDQ8ZjrzSXKBCaTCioIChqYikdgoJtuYCYaCCJmG5s6KB6YamCiIngEgmyimYIsLIqw67We3890S1HOzOq6b0flfVB099/V1VX93vSboaEUSZJkQ71eX+v1P6FYLC6rVqvrvD5wKPYzNuN1S6VSuYzPt3K5fJ+2jV3FnkjzvgK/G7Ef4k8R4zbtZIhzk/Zxr/WpUOmwXZuWSqW8n7d0SwztntcE+pXYJ/6Y0V/ooMz4TuynDpt9DO1L7J2fj/Akdtpi6V8M7Y/EI7y+W1qt1mL1KXTEzoWn2jTjCTufGiSyns12qJ/P55crkUKhsNr7CebuYo/U12+Rftv7RHRwXovYA1tQ2HjajV9hb6wWUZLYeew0NskFtNH7RHhyp7wmONxj81nsMMHe97Hj0ZGNV5HUXru4VqutVDK5XG6F1YVNkrWjRr8Q+4KYh+3Ygu8E85e8njps/NprAn1KSVmN4nZ3eyIkfshrSZ/fvWIQa7PXZ4WFe7DrLN7m52ZD30DWtpUs7QFi7Dc2qqSazeaS6I/2AO2hjcHalg7GagLffV4LLOp2YH1hwQktSsLFQvCzFXO1/wpJ5/pXjH72LPh+6TL3FfvERbXJxT1nx4KLbw36B2wae4vNcFDPvd9PJKFQusNR0+2Z9PjWLTQc+lOvzZlwquPq6zvGCR0NxQ+cRqOxlFyqXp8TSec3qmKvUeQZTnGk1zdxEMzrLUuwk3/LU0wdit3aq1jmDnrtnye8xkecNs4rvctq/wv6h6RrXEXLbnmHjIyMjIyMjN/mO6OjtbJU9qWPAAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAYAAACbU/80AAABjklEQVR4Xu2UvUrEUBCFwy4q2tiHkGxCqrQpBAs7QbCy0crKF7BYLEQrG2ELhcVGENFen8AX0FKxFRsfQEXwB13P4Nwwmb03xka2yAcDmTlnJpObzXpewygTRdFbEASTuv4v4OabiAHiQWsu2F8rdO8Q0pxl2bjWK2hz340WCNR7vy7Q6XTWYdpBbPOwO+1xAW+Xe5a0RqRpOoH517peQm7IwyhvC4sTeB/1E8ZxjFIUc9rCdV/qJSCuIXomx7a7vMSt9LkQCxdgxpVIW0mSTIu8jG42NVvdgnn/97jpTBiG87g+qtnreWhYhvlA11Hr0xDol1qTQN/gBU755A45r/cbqtqUBzl1Avqz9mCRFSy2anL8HuakXgDjAuJE1w0YcsxLXGjNYFuSTkXm0N9lXqAbbdhuYMjzfIy0qtdEr8V6AmicRZzpugaec15iyIvaFmuLWiN8359yLV882V/CMuPVVvd+vgz6UxvgBPa16OGbDPXwOoGj3qN+XD8hPhFf2sNB2gfiRd+7oaFhJPgGQ4yu3C1Pu2wAAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAAAYCAYAAAD3eW90AAAFfklEQVR4Xu2aWWhdRRjHb624oShqXHKTOzeLRgKKooJPPvikFI2tog9KXYpSRdGioEYEH8StKKXVB2mt1loVKlRsXDCISjUo1BIJSF2w4oqYVkqw1TZN/P/v+eb2O1/m3M3mhlvmBx9n5j/f7HMmc+Yml4tEIpFIJBKJNAXn3GbYdK1m87c66NOtsN9hk8Vi8UmbXolCofCSjMs48p5k00lnZ+fFSP9F/B6x6c1Az18N9qnN3zAsEIN0ndVoWsPgnWO1Vgf92Qj7TcVfhe3SPhnMk3G7kZHe3t6jGe/q6nLaCdoGPWYIr4H9qX1mm+7u7rNR5/6Ojo5jvYb4BTLHq7Qv4jtg92utYVDhyShss5GPkIpHjc439SertTIy8UdaDS/S5VqzwGev5NXac1rDpBZkHBcaP2rXaG02QV3b2tvbjzPaJraD82/05Zjjbq01DAp7B495WsPA3isDPKD1/v7+o6A/q7VWBv1bYRcIkcn/3uoa8UnlxaRcSY27mPg8zzj+LLZrP8m7W2shUN7dVtOg3IusFgJ1TQW0Ge0XfYvVGgYduMdqqOCvUMU8U2DbP93qrQr6uC/Uz6yB14R8MDaXUsM4LRWfHRJPncVCeUMg3zL4vW51An0h7COrh8DudK7VpA0HrI4677DaIaXWzrc6Wf3M0jUhH0zMLaKXzjH+sJ+xc1Us34MyH4LvJq0hvsj9jx0G7bpQ2vCMTZtt5kvFW23CXIM2rc+wVzAJ62Qy17rk0Lza5rdIP2dMcpauQfpO64P415KXR41cPp8/ReKLjF/V8jXwHUTf3pIwF9Zn1qce2D7WjzPhiTZtVkEnHpDOL7BphxtZk5ylG0ovYVEO/jgwn4r4h5K3fN2A8JAuix9ENZafAv6DsBHY5zatXhqpnyDPyqx8GIebkPYPng/atDJwmMgq4HAD/ZwM9bWewXfJLrkbdhcWzmLJe5n2wYAPQNsOG8od/BKvqXwP/JfAvoG9a9PqReqftHo1+vr6TqjUbqbxo8/qZRrpeLNAu56ux2x+C3yGQ32l5gJfWNXAInoqVJ5Fyn/N6lm4ZGGVzlioYynsbetTK8h7idS/3KZVQ/q31uqein2XqwZWHDxv8asDb+f7sNs5OKwI9qv2QQPOgLaH5x/YG9R4bwJtCGnrvB/i++Q5Af1qrzcTaeuMAZExuM9ogybOvqfySr7U3aBo7/k46jzf5quES349SB3eucD8GaxenLxQlc5bKP8Yl5wpeaGsL5j39/T0dGpfaGMuuSheBdur01IgcTUrRuE32zSCtJ+L5pZeh/Epfh4boNL+lecwGnWar9wlh9IvJXwnbInP02xQ95R/CSS+QPdJtNLVDNuqtNSuh/ANNp/ozLdexacwhiu0TxZS5rDVibzgb1q9GtKeGe30tLW1HW/6tQF1PS5hOy7T9JfwCPr1qE73E73HJQPI1UrjuSvrDoirufwWm4ZMw8bQmC/w3O4vEwm0T2C3id9X+Dy/imHeHFd6i5oB+4qB+RbPLeyDHzAPd2zoP2iNSH//dsn4BS9FUe4L4vcdn4gvsz5Z+EnNAuVdYbUQ8DvgkjndBRt3yVyzzdQfM76TqPdaH+cOCW1jYNHxT3Vq7rnj+XhDsBB/aCsk9yU7ddpBzzS2ISqc+m0rMrfYOWQcL9dZmOsnEF6j9FHYi9rPhxvGLIxRrNYBVPyyxHkInu/TkfaB8s1aXCt9ODL36Lnhz0uIj4vO3b2I54TEH8a8L2YY8vVMh52ZM7/T1gy3PSdnJcLtE/Ex/urOOH915wKDbYV9XM6YKzWG2yh/7P2DC9Il/+Iyon0ic09RPnI4h0V1hnLJWXQb5jivNB4Jfszn8x0u+RN76P5VJxKJRCKRSCRSE/8BRlcV4KUyRIoAAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAXCAYAAABu8J3cAAABtElEQVR4Xu2UO0sDQRSFE7FQFBU0LOwmO9kQsLGz9xdYW4tpfKAo2FhYCoJW1jYWIhIsrewEGwtR8dHZaCMi+ADRKMRzzQy5XmdSuIuF5MBhZ765O/fs7iSp1H9VPp9fVkpV4ftisdjFeBvYg15b4vckLjRYxKWVxlEU9VNTtnbExu8Itm3miQsNruAPNq+GYThsxplMppPGCLHAQ1qFgnkUTkhuRE8NP8EvcEmuc1GzIAh6LXwXfpOcFrbgCt2oPSlrSOAX8B6bn8EHvMYIfFOxz8FFPTzP65D8m1xB6ODRmuTE8AZ7OMvlcgNg+5wZof6xUCh0S/5DriBgx64g8LqZUxOE2DBzHNohMwY/TenDjHvKhlvVIAhxVxDD0xifo+EoriV4DaxF19HnH6M1OoMYv9Z3sShOEFU7xF9zWS85vFPfxSJdNOXgDYMkKtoUv/1pG7c1dPHY0kFmbNzW0MVjizbFYZq18GdbQx3kUvLY0kHmJMdbGnEFwdqg5LHk+36ffsJVuUbSIcfZfMUW7tfCZmX4Dr6Br/X1Fq7wumw2267DHOJ6omr/BWle01RTTf2VPgGF9aGes5D/XwAAAABJRU5ErkJggg==>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAAYCAYAAABEHYUrAAADF0lEQVR4Xu2Xu2sUURSHo/GJ+CzcZndnX7qwnWyhphEVH4UgqJWIYiEEUREiIvgPiEZQYxEQLSxSqIWNoGBhECVYiAgiGAgiwcJHNCAmcTX6O+MZufvbM5M1s9kI5oNDdr5z7z3nzmNn09Iyw7+D53mXED/T6fS9TCZzEZ+vyjHiNI9tOtlsdiu7uMjmLJfL5VaT2+Ue/xVo3MMZ7cYilwuFwhLOMzjz7YhT7OOA2mtCNnsL0UduN+Ka6yYEDV/QW2e/HOMMpnH8DjHKYwPy+XwK+bfsA5B7L2s6MYz4iPgaONQr8Ty428g9ZA/Xjxhkj96fwO9lbzFbi/ZyQkDuO2KcvSDzUGgBexeMuSLj8LHVyPkbtjz62Rziu9kL1jo1aMEB9gHIbbKKw7UhxlxngTHjYY3oFbHWtsbPCvE+yL1GdLH/A5KDUQso/pVH3HQljiv1PKs6d4i9oLmq+th4mZ0AN4DoZB+AeTuseT5odIMWe8A5FyyyXMd9dr24ZDK50HUMnvulMg61jnMO7oaue8T1qHcX7hG5Xi/qqimhm0Wioo1EPnMotE+beha4YrG4OHRhB4zp1JOyKpVK5eW1gXrbtPYQPi+j8X5PGj8Q3xA9eCvMd8eFofPWszdvIQs09ErG4W974HC8sZ652rA8k1vkuZTQzb5AjCUSiUU8Jw7a58EqiVfGyno3a42TBdlZ6NxP7AUv4otrsuhmz7Bv1UZGOOGCK7FHxvFrCQsemKhR3LortMYJzgnwTzVfe9tNEl3vPHvzijFhY7DZdZZ3Qb5Lx9S8X4WwteMg6+HCHGMvCfk1E1oMk95IvlwuzzVy/jc0e5eozeBk7dT8Y87FQddsY+8jSRR+bnj5mVdh7yJzS6XSPPZK8G4eNvx1zd2hXGxkXXZVYMAHLd6HGJHPOAFreRyjczoMP+rptzCFOMmdk1cXz4uL/Oclddg3BNzKJ7H4F/bTBXp5iZ6Osm8YeibnsJ8OpuyqBuB2344i/eybDXq4L72wbzgodBa3zyH2zcL7/V9ZD/spQ35ksGsW2OhhdjP8D/wC/a8Z1473prgAAAAASUVORK5CYII=>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAZCAYAAAAFbs/PAAAAoklEQVR4XmNgGAVDH8jLy88G4v9AfABEy8nJ1aGrgQOggl9AfAFNDKTZEcr+jSxxAyQJF0CIgzT8grJ3o0s8hwsgxP+B5BQUFMyBdDRYEMhxgAq6o6lnAPrhEdQwhO1AzmpszgEBoPg1qAZJuCDQ5AY8Gi5ilQMJysjIqKKJ3QPitTANQLoPLglULAQU+Au1HhT+M5A03geJAV0SD9cwCqgNAFdLOGaUPV/IAAAAAElFTkSuQmCC>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAYCAYAAADOMhxqAAAA8UlEQVR4XtWQPQrCQBCF11osJSj5KxZyCUEUW+8i2FgIgp3Yag7hKfxrPIMW3kGxisY3cbNsJhv7PBiyfPNm92WEqI+iKGoFQbBBTXmvpDAMdzCu6ey6rsQ55R4tmGe+7/dMRgOoucm00LhaGA0sOadG7DhO08IpUoPzvCGklG1E6yuW5OeSkP0AQ0dFoEpQT+7LhMbQdhMN4qIF57SdI2ckDOxRL851fi7wD+rBOeW/cEZS/7ItQJhHgLcCFFnMifVlwDPqLYxd0wLI7Hle17D+lN+C711FSDGw4j6tqg1ZpfIPOK8UzCfO/govjDmrmb6bzzzuTnhi3wAAAABJRU5ErkJggg==>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAYCAYAAAC4CK7hAAACK0lEQVR4Xu2WvWtTURiHIx20HQo6CA35uCFxES0dChkKVrSi0P9AKV2cHFwFQSwUxC4di6DQ3VCQgiA4SD/AQRxcnIoFRbpYECdBa3zeeBJOfrkJNzcfUrgPvJx7f+8570dOzuGmUgkJCXVyudy9IAgel0qlcfUdC2hgJp/Pv7PndDo9xnOVhqZ0Xs8Q+D22l8lkRtXXKzRxmqI3RXtIvp++1lcI/hL7gU2oLy7266tGY9vov1XvOyR5ZokKhcKk+rohm82mifNAdWsOu6l6DbbrGvYCu6u+uJBs2ZLyC95QXxRY+8ZGDvdJYsxip9BeW50617qedsku2zvP9/3t5HmtMTkmxLhjMSlgQX2dqNfhdqBhOi/F4bxoDsYzvu4WVNzzke+LC008srh266ivHXm3I6I9xQ5VtIIPmsR/+h/zsUtlxlvq7wYaWCfGL8bz6usEa65wxi6pbv8cq61FYLzuzatB0s+uydZtjAgxXrH+e7FYPKu+KLB2RzWDelea6uKl0q5Q9I+ukW6v0RHWfMD27WCqsxs61PatyUeipQ6TrZhQXxjuNvmCveX1hPrjEJbf5am27LKJHPRzon3CNuqBGFd9fxgkeK5aL/C3nCPv18D7DLEr2GrCbvtza9hthePITbDr8Undx/u+aQRb9NcMA/Lu2ujOWa026tgcxCfQQLHCVRsKJJ6Paro2DHZiS7WhwLaXo5quVWjiKvNmVT928Ml0QbWEhP/AXzxanVXpcIeBAAAAAElFTkSuQmCC>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAYAAACbU/80AAABVElEQVR4Xu2UO07EQBBEV8AFSMj8kwNyToAEEZBwAE5AAhLkXABxpI2IiLkC0molINiARfyqTFsal8c7gwaI/KQOXF3d0+3fZJJAWZZXRVF8poT2/BHJDVLg9gzV/41xe9UI9APEo/OSLRHPpr2a9gLrutZGE7N9O4DqYGNFLo6YYjvkSXWSPEBo+zzPN3kAfGeaI0kDxBTCc22+NU9uwVxd11uaa7DJd1VvCW1P0OOdfbIsqxlVVW3j+sI2v1V/AxsjOTWTd8shXbEeczyKfcQeA9fHiDfEvfo7tEOoTmK2d57/ueaIDbdUvYOZOkPo9RAY4Ma83u/c17uHzxSzPUHdh9a6+Hr34EtoximvgwUOVrdQnUC/Yx536UhzPdxJYweAb8fqLl2dnxy0Bzv8xM0N4tyF4OHwHBbf//nm83OCj4PaDHGqdUFiB/gzVv2QRkZ+ky8MJaB5uJZyBgAAAABJRU5ErkJggg==>

[image12]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAYCAYAAAB5j+RNAAAB80lEQVR4Xu2WO0sDURCFoxY+QCzsNo9NQjBoJ6i1giBYiNgo2AlqKWJh4R+wVOxEhDQWItiLvWBjIQiCNkIEGx+Ij8p4Jpkbbo7u3iSmknwwJDvnzNzZm81NIpEmTRpKi+/7a4jdRCIxzuIPksnkFswviILGB+LRzsFzyHW1gB4p7XWAXh1IteL9nuYG2f8DMwjnUynpWxzwhLVqQN251KfT6Z5ftJxonud1sVaBDnfGeSFocBeouZC6WCzWyZpBe79wvgzuYE53Z4I1aVzPcNjxEanBs7XEmo2zN8SrIAPyxzr4NGthOBdVnL4gA3JjOtg2a2GgZlLrcqwxQWuXMQbEM+IJ8anXl9FotJf9LlB3q/X9rBFtZm0WipjnDbHAWr2ELmgBz774Ap9LiNfVNKqFGoYL9zkNdYB+eVdP6DviicfjQ6yV0eFuOB+GHC/4KFY4b8CCU9q3ePrj9R5xZAbGgdyn+nxlpQXEDTHhuVtmLQxtXJCzjDUD9Afx4CYG0H9WcrJLuF7UNUeppIRf2tJXv/TNlN/RN8QX+4KAdwaRdx0V0Df1Rt4x1J2+v7A92Wy2275uCNIUC65zPgzsnCcbYa4x/KqtNwzXrv2G+RNhRZ49f0YOZjQ+5Xw12MOx1hAymUw756pF/jrh4x3mfJN/zTfEOrNn103MmgAAAABJRU5ErkJggg==>

[image13]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAYCAYAAAAlBadpAAAAvElEQVR4XmNgGOFAQUFhgry8/Ecg/g/F34H4HbIYUM0qdH0oAKYQXVxRUVEeasAudDk4gGo+ji4OArgMBgOgqRFQ093R5WRkZDjxagZKXMMlCRRfDzU4AF0ODHCZDBRzhGqciC4HBzDNQPwBiN8D8Q8o/7K0tLQwuno4gPkXiJPQ5QgCoKabIM3o4kQBmJPRxYkCUM130MUJAqCmapBmoL/T0eVwAqCGyUD8WR4SsqB0/BWI/6GrGwVDGgAAbZhHbx0gjS0AAAAASUVORK5CYII=>

[image14]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAXCAYAAADQpsWBAAAArElEQVR4XmNgGAW4gbGxMauysrIYujheoKCgcEleXv4jujheANTwAoiPAJks6HJYgZyc3AIVFRVRIJMJqPEsujxWAFT4D4n9AVkOKwD6JRNokwuMDwwMWaDGqchqMABQwX9ixOAAKGkIxFXo4kDbA4C2x6GLgwFQwy90MRjAapuUlBQX0MSN6OIwANTUIiMjo4oueBVFAAsAqvmMLvAURQALALpkF7rYKCAHAAAeFB4PohilHAAAAABJRU5ErkJggg==>

[image15]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAYCAYAAAC1Ft6mAAACVUlEQVR4Xu2WPUgcURSFFYMagmkCbrE/b/9gwxJSWdhYCEKaFGJlkIBEg12wNqSzFYwBG8FS0UZsJSlDqlSKKEnAwiYJJJEQtFFz7u59cj27M7ODICzMB4+duee89+6duft2OzoSEhLCcM6NYazkcrlXrDWQz+cXYT7BuNRxivHLxuDZ5Hm3QCf2/oPxpVgs5iSAPJ5pPm/Z3IBPnuOFQsHpIjushZHNZgc41irYb0r2xBt5yhrWfaT5zLJ2DS3oE8eFoGKDgPddHL8F8yZ0vwnWPJH5oNpxrfoJa5lM5m7kAoT657HeQ9ai0LnfOG6BfhCaD8T9IAPiW1rsKGvNgG/StwrmnbIeBvw/ZK9KpdLHmkXaX3z4OjxmrYY+lYaCEBvWYqK/hIpdB9cfMLfX6mEE5cFE+rzB1U+V3xhner+bTqcfsD8IvJkq5sybkJxUe+Y+EMx9LnviAWywxoQW5L8/GC9Yi4tr0mKI/eRYM5y2PU6xIdYsyDev+R6xVgPCYWC1MSiXyz3S2xxHn6ew/irHGXjeSx6pVOoeaxZ4jjXfO6zV0GpvXJALaa1W1kfLvRRfs5PW438TMdZYu0INXzkeF6zxnWMeJDsCfZrjRJcWtC03uF5w9e6RNq69Dc3187VZFoivdZEZ1uKANZZLpVI/xy2yD8cYeN6ID+17H5/7Jr6uxSxZ/xWu/kv+19VPNPnf9g/jgn2t0mKycyg6y3EGD3dQk5fx0V9Xq9Vu7wn8/WkX7APTQ2bM6m2HeWPntri2xRR0if+WZdbbkc6w4zwh4Zb5D/Cvxec6BCLoAAAAAElFTkSuQmCC>

[image16]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAZCAYAAADuWXTMAAABKklEQVR4XmNgGAVwICcnN0NeXv4/EL+D0j8UFBQs0NWhAKAmH5BiIJ2GLK6oqKgHFa9HFocDoMQCkAIZGRlOdDkQAMqtB8mji4M0+kKdF4UuBwNANS5Q29tQJKAaMU1FA1B1F5EF9kNN9EVShwGkpaVlQOqAAXcJLkiCra1QzQ0wMUYSNH8EqZOVlVUGCygrK4tBNX9HU4sBsFnCDBU8jSyIDoBO1YCqm4ciARX8hyKIBrDZCpMA+wXEBtrAAVW4G4inQuX3YNUIA1ANq4H4FZLYByC+CTIcyGVEUo4JgIregAwB2n4KSP8DsYFxHwKTl5KS4kJWjxcADbkFNMARxoe6gDgAVHwf6p0vUFcYo6vBCYA2N0I1g/AxdHmCAJiaTNTV1XnRxYcwAABeBWWcAd9LZQAAAABJRU5ErkJggg==>

[image17]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAXCAYAAADQpsWBAAAAr0lEQVR4XmNgGAUIoAAE6GLoQF5eXhFd4D+KABYAVPMLRQBoUYOMjIwqiiASkJKS4gJqWosuDjLpG7oYDAANvYUuBgZATXtVVFTY0cVBACj3BF0MBhiBklfQBYFiy+Tk5ATRxeEAqOA1FrG/6GIoQFFRURyoaB6MD7QhX1ZW1hZZDVaAHPzERAUYAEPKA2hDKpC2AGoqQZfHCUA2APEfdHG8AGhLJVDTUnTxUUANAABwGx300Er/3gAAAABJRU5ErkJggg==>

[image18]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAYCAYAAAC1Ft6mAAACYUlEQVR4Xu2WzUsbURTFE5QWK+3CUgL5miQEAkGKS10ItlC6cSGuLOJG0e7EveRPEFq7rFsV3YigG+m2dNWVEioqKIiFLlqllIhg9dzkPnmezEdqRQnMDy6ZuefMe/fOvHmTSCQkJMQPx3EGER/T6fQka3VkMpl3MJ8gLjQqiJ92Dp5lvu4OiGLuY8ROLpdLSwJ1vNF63rO5DlM857PZrKODbLBmgP6Sc0yxWHyQz+cfct4NjDcmc+KJ9LOWSqU6tZ4p1q6hDX3hvODVrAHaOecYeLY45wZ8wzrfMGuGoHrkUQ5p169ZSyaTbUED4Lo+6GOct4H+nXNu6Fx7nLeB/s2vHjGUvQzIr2izA6zZeF0vQJvDcnvGeQa+HzJOoVB4zJqNLH/x4XV4zloVvSt1BSH3QpsJfAnhK8HXxXnBbWw3vOpgAn3G4NR2lV+IUz3fTCQST9nvBfxnnMOLPYF4xXkGnhGZEzdliTXGtyHz/iBGWftXMMZ6LBZrp5z7xISjyx67WC9rNqg3o/Xus1YFwnajkzYCxtoxx7IEcV6ydS/g+yR18A1h4DnUeltZq6Ld3mZDR9Zx3RL0AktuXOpw22kN5puIWGDtCjXscv6mYJvvwHjz8Xj8EX7XWPehRRtalRMczzi11VOJ6NPQWr9eu8oG4rQO8pa1/wFjnksxnA8C15SkHmzxT/BbtvKL2sys7b8CwgfEb6e2o8n/tj+Iv+y7KRirB3HA+UbAze3W4iU+m2P562Q8nt+fZkEaMsdoJobzQVtvOqwnJkv51jawe8Nq6AKbTp71ZiTqt52HhNwxl4TYxgscsce/AAAAAElFTkSuQmCC>

[image19]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAXCAYAAADQpsWBAAAAMUlEQVR4XmNgGAWjAAPIy8v/JwYrKChIoOvFC4CasuijCaghnWRNQJuSSNY0CgYUAABb/RMFyESofgAAAABJRU5ErkJggg==>

[image20]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAA7klEQVR4Xu2UTQrCMBSEewC3QaGxaWkO4XncCK56CfEGIgjqYQQX3kPcKPiD+APqvDaF+qBaUnVjPxiEmeZN+ig6TsXfo5RaQhfobrSH1tAx9Xzfb/FzpZBSahrseV6fZ/AXlAkhajyzBgNHeUPxdpF50zHPrElXx30C/sysNeKZNabwyn3i1WWsCIKgbob2eAZvTpnWWvAgvsU7YS2Np4PJ2YHJz9AG2kE38vARDfnzhcGAbk5hfBnul+bnhSjr8ELXdaVZ3STrfwQMbvNCFE2pMAzDZtb/Gl9bJwclB2irkv9M+j1BK/5cRUVFIR4nU1uHlZ7ODwAAAABJRU5ErkJggg==>

[image21]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAXCAYAAADpwXTaAAAAfUlEQVR4XmNgGAWjgHIgLy//AV2MbAA0zFJWVtYPXZxsADTwhKKiojq6OBwAFSwmER+Vk5NrRzeHbKCkpMQPNPQPEFejy5EDWIAGfQTieSiiQIEuEvFaBQWFVSiGkAOABm0HYk90cZIBMNC1gS7KQBcnCwBd9ANdbBQMVwAA6IwocltPGusAAAAASUVORK5CYII=>

[image22]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAYCAYAAABJA/VsAAACIklEQVR4Xu2Wu0tjURDGg4KLiI0uBPI6CQSCsbG1kbWyU0uxEW0EW+0sBLESFMVq2XLTRBCxFUFE0E6LhRVF/wAVfCCi4GP3m2QSrl8eNzfZGDfeHwzkzjdn7sw9OQ+Px8XF5X8hGo1+McbMhcPh77Au1nNA0BIG3ML+qD3Arqw+xKzyuI8A6vqmNS7gsTEejzfh97b4/H5/O8fnkGmQ/ZFIxGjjm6zVEtR0DnvCz4Y82u98veSgTe+zXyj0QWoFarm2q0dr3mV/FszikM5mH2uBQKD5XzaNPPfscwLGT2o9HaxZsa3ZFPk7wL+uH2SQtXJBvj32lYptM4ptXKEA+Hq14WXWKiEYDPaXkxO1zGs9o6wxhXrKkgmA3Zj0ennU518l7YKeVI4fsJ8OLIHiTzhPMbSmwo0oiOnW2CPWUmTWM2yMtfdACkMNSTluWGMcNH2msfnXPYTjUhJVC7x7C3bg8/m+ssY4aFri5DjLT6mJ7ECOWZNec07sgvMUQ+oUY78V6IcSg1OnjbUsmuiU/dUEF56eci47qHNR6vV6vS36LHtPwugxiJwDoodCoc63Iy0gYFqCEDzOWjWp5CNj7CvsCTaBTTagvik0OiO9wCI8JgWEFdidSe/Ucs++l2QcVw3kfexzCiZpQxu81B5k4pIcV9eg6WHM9I7lec2q1yWY5RGd+Wed9Q2OqTtisVirNi32wnrdgqutD6dCjP0uLp+Av4Ps0Qwhj6hYAAAAAElFTkSuQmCC>

[image23]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAXCAYAAADpwXTaAAAAzklEQVR4XmNgGAWjgHggLy//G10MBoBy20VFRXnQxbECoOJSIC5CF0cGQPl/6GIYQEZGhhOo8AO6ODpQUFDwB6rrQheHA6CkFxD/AOLFROJtQHwB3RxGoOBxOTm5DegShABQnyIQ/wO61AAsoKKiwg4UuA00rA1NLUEgLS0tDNT7H4g9USSAhsUABT8AcReReA5QzyMUQ5CBuro6L1DRa3RxdAA0xAaobha6OAYAeReo0BJdHBkA5f+ji+EE8njSETCwNwGTkBC6+CgYbgAAYs4280MwQHwAAAAASUVORK5CYII=>

[image24]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAYCAYAAABJA/VsAAACYElEQVR4Xu2XTUhUYRSG/UFFI8JERubvmxkGhqaNcFez05XLWkabyE0QuapdghuFCAqjldt0oygyO3ET4aJli6AfqG0QkRoiCZr2HufMcHvn/nzXWVjTfeDg3Pe835lz7jff3LGjIyYm5l+hWCz2GWNmc7ncAmKU803ANI8FPxAnGj8R224NnhVe9zeAvsa0xye47C6Xy714/VK0VCo1xP4m6gOyns/njQ6+ybnzBD19RRziZZdH7p3XLE3o0K9ZF/xuyHmBXnbC+tGet1hvgF28obs5wbl0Ot1/lqHhX81ms4OsC8hVkJti3Qasva/9XOGcm9CeTcDHAfq63pDrnPOjUChcwpovrLtBfps1G0KHUUJ9fgZo4zrwM84FgTXHrHnQBd93FoOA/7H2c5tzjN9MDeoGxK6pnZcDvX5r9S2olEqli7puMUIccR0/tLb/IAo8FfW+59wp9fOMmORcFFDnkYm4c3VM7SbfY52JMPRn9XqfeyQ+2hQKAzVeID6wboOpfbrmWGciDC0+eZx5Y1vIBvwyGtZ6cvZs48RxnB6u5YXWDuwV+TfiwVPnMucaaKFPrLdCWGNKJ3y7LAYB/1OpnUgkLui1HIslxL5c44hdkzweh1f/XOkChodigvkO51oB9Ubwxhusu5GG8aeT9TCw7hhxiLiLL9m0ag/wfjMyCyLPa05B4jliz9TOkvzO3pdi7GsFDL6ZTCYHWBfQoIP3m2bdFtSu6oDfdAbZuGX2tTUY+iZu5CvX9Zo735Zgl2/pzh/prlfZ03a4fhRJ/OJ825LJZJL4N7jEekzMf8BvY5jduMRQ7yEAAAAASUVORK5CYII=>

[image25]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAXCAYAAADduLXGAAAApklEQVR4XmNgGDSAGV0AC2AEk/Ly8i/RJDAAUM1zGOMJmhwGgCuWkZFRBXJK0OThACQnJyenhSzwH0keBWDIAXXOBwniwMtQFIMAUPAAFrHdQIoJXRwk8ReL2D90MTAAOiVUQUHBA4nvDMQxyGpQANCkn0js78hyGACo4BwS+yqyHAYAWisIVDQF6JwJysrKYujyGAAWZOjiWAFQYS0QN6OLjwJ0AABRDChpgYe1CAAAAABJRU5ErkJggg==>

[image26]: <data:image/png;base64,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>

[image27]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAXCAYAAADduLXGAAAAUUlEQVR4XmNgGDxATk7OGh9GUaygoOCOCwMV70BRjA/Iy8vPQRfDCQarYqDAPCBejAPfQVGMD2CYjA8MVsVAgf9o+B8Q/wHiX0D8HUXxKIACALOyJwnBKCLfAAAAAElFTkSuQmCC>

[image28]: <data:image/png;base64,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>

[image29]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAYCAYAAAD6S912AAABNUlEQVR4Xu2UrU4DQRSFW5IGQ0BtgtnfbHiBTVCkCktNJe9AEGAICgnB0xRBgoZHqEXVoRCo+pKgKXwXdmH2FFp2a/slJzP3zJ2T2d9GY0lBkiRbURT1giDYK7wwDI/cnn+RZVmLjRPUT9N0PY7jNvN3dIpetX8utplT7fzmoxP1Z0LQjW1U3zDfTq/+TPJT/Bmo3lyKQHSpa7Ug6MIJ/RS34Ur7KkHAgYby+jxpXy0I3y1CXZ/6Gj2iB9cvwWJXPQP/1g1kfob2bc7Lv8H8+ac7x/f9Dpd1qL7BhmMJ1NNOP33MIbpX38B/cx+MBmj9bZo8z1sT/y6Uz00DrObqNl3PzBHDCuNLHj620b6cUuNX71SgW1dGA7SuDAED/kDbedmknpQa6mD3FZ3b6fjFrer6ksX4ADNcYKIgHx+lAAAAAElFTkSuQmCC>

[image30]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAYCAYAAAD3Va0xAAABBElEQVR4Xu2TvQrCMBSFRXATwaGT/af4Al3FyVUXn0Nx0EV8A3FXXARnfRNHF2d3Bdf6c64kJb1ttK7SDy5JT07ODSEtlf6GIAgM0zQbXE/h+37Tdd2VbdtdqTmOM1bmEeopv1OEYViB4YFao2vN87w2bUDNUDfpIw1NBureBMLQytJRU5pjvf7xNDBsdAbS6bRivkAduSdGdNUGKfOITqWuJ5BB1JGvqeiaxcAwV8Lehc5L7ssFNg55GJ7Bift+AqEdGcbXtMDc5xoBfZs7yLKsHo4/4jqBkEnuIBgPqD3XCej33Bcu78EwjCrTd47yW3wF5jOGMsarCL3QSC+dewsKMngBK/ZRsoGVVv0AAAAASUVORK5CYII=>

[image31]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAZCAYAAAAIcL+IAAAAmElEQVR4XmNgGAUDBxQUFC7Jy8u/AOJvQOwExHfR1TAABf/LycnVIfH/gsSQ1YAEP6ILQk3GUPgfiJ9jEfsCFwBaFwISBLovHUkdWCFQrBIuAFS4A90KJSUlOZCYsbExK1wQKDAFXSGQvwQmBqSXggXFxcW5kRUqKiq6Qd0HU4gwBGi9M0wSiLOhCv6B+DIyMkJwhaMAFwAAKBAyZ7tKZFgAAAAASUVORK5CYII=>

[image32]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAYCAYAAAAoG9cuAAAAf0lEQVR4XmNgGAVkAQUFhUR5efllcnJyNuhyYACU/A9UpABiA6lKIL8KXcE+ID6BxAdp6ERWAxL8BJIAWjNfWVlZFkUSBoAKNEGKkPB7dDVwICMjowJU8BykEEUCqvMLuhgyHywAdIsgEn8PEK9GVsMAVOACFPyH5J5iFAWjAADIPyUGZQ+3SgAAAABJRU5ErkJggg==>

[image33]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAAAYCAYAAADH9X5VAAAFnUlEQVR4Xu1aWYgcVRRt47jhvgxDZunXs+CYEQUdENzXqAgu4AaCRDDBHxUNUaJRA36oRGM07kRMosHgh4qCQlDQDyUqiPghgSghaDQYwSg6jjGLntN17+T27Vc13TNjdX/UgUu9d+7ylrpdb5kplQoUKFCgbTE0NNTZ29vb4/kC08fIyMjBmNvjPJ8HKpXK+Z5rGAMDAyciwEvlcvlK5UIIi0x5D+RfrRfYD750zNvJnm8UnFvP5QW0vRLvfZ7nMzE6OnoQHPdBVuFrclR/f/95TA7IA5A/1I4cJuYO65sH0O6v0h+VnZDdWseA13qfPIE+jGlfvK4RwG8vHrM8nydkTud4PhUcLJLhnBgPuZ9l6I+d6qTMBLg0Sn8+8Trh93k+T6D9V2LzA+59z1nQD0n/rufzRlPvF8Zr0ozJ8ysk5eWQb7xNXjBJ86HXgXtcdM96XV5A28/H5jHGWUymzxMhWW2u9XwdZLKjHbc8ynuYjVafJ0zSfOB1+KXeJ7o/vS4voO2VkXmcFeEmgPm8PkufN9CXJyC7PF8HmWzKcq+zaPXgspKGHHV4CTd4HQHdIshPkOe8rq+v71zwn8L3c/qj/C15JOJJ3L/h+TSeC8hxswv9fNQfxfMtG4d2do6wL+wKcnCAXEEBd6n1QZzvQ2S5dehA7MWQp3BQKXtlo+BYIEs9b4G+zLZjSEXY/2mfEAR/0du1GmlJE2RZgDxseQI+h8h4bhbbs1g3Sy7Hvk7tUb6JepZ5DEX5PdaZEORwJD4MsVZIezWT65MG5YXcoIvtQpHbrQ91mpAxoL1TQnKqqm6SUd7S3d19gjPLBPpwNdth30vy5aMggYe9LeHHlQp0/E4NpoLGNnu7RjA8PHwk/F9LkVc5kWhvdUg2ji9DVvkYMZik+R0xvsDzqyAnqK6ursO9PQHdX5Axx/HX/4uUOc7bnL5m0sSmmjSW83Y+aYjJlh/qYHOx5xXS9uUs43ko6/jaHO3t0sArFGljRLmQ7E0z+wTp93wm0MAlsUlpNTK+NBtlYur2WzLpa7lUqMBug45NfSFbffIoJMb/ljQh4wVpO5AHuTR6/WSI9RP1HzxnQZ0mahQhZacckq9CauBWIC1pCOFrNsH4HA8Jv44/BC/G9zuxq0rZrfvCPxPhZiRp4FfxvAL+L7i+rfA2aTDztd7yEmeD5SxEP3G5WwNsAK9Cf+/yPAHHe7IGmwXZRyxrRnyMGCY5cpOv66/wE3sWD+hma5lX+Kjv8HFY58vznLdLSZrrLIfyRquXOBdazuAALcDmolibWUB/FtPe710kzpmWsxCfUz1fBZRfBncCUIDfW26zzbBJmo+9Lm1Chedtq+e3yjPqg8eBth7cvivWnn4VLIcXd43lUN5p9RLnVssROlbEvFc5xJoX3AUmXy5s5lpO4ROWQH2+ctAvgAxYvdhQ3+H5KnTgnZ2dRzj+zWD+dNAuQJ/mSJ+/juiqY4GcrnU+5djLJeAxtUX5MnBL1M5/qtXX1iGfaZ1fZ23P2oF/w3NAh7RxNisoj1tlSK4BPrIcUU6O/tsth/rfkNMcV9cPC+oGBwf7WEb/KtYez39qrUulnp6e47Pi0WlbKTmC/SbB+LcHDnCNt201pG8/hmQTtw2yA/1crXqenkJym8kEeQfPJ1UndytbZIzU3606Ge9c1UHGoD9G9YTEHjf+Fxh7fQGcQ/aL8jMTS/0R/yG19ac82N2iMTzAv27aGY8tGVwNoNsUUjbT8AkmRnVfhucu1qE7w9sj3iPBnTYLtCH4Aj3XDOC/TO+dpgvE2s27Ic8XaDPgRb0d3AmnGYTIMjMVyBd1WglcIEdM9WXBb0llOv9AZYBY27Gn6fV8gTaFXFPUbJIbAe+iPDcVYC+ztJJyuVmgjcF/fmvmTwQzCSTMjZ4rUKBAgfzxH49LOgIn0bvBAAAAAElFTkSuQmCC>

[image34]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAAYCAYAAACC2BGSAAAD00lEQVR4Xu2YSWgUURCGR6MYUVGEGMTM9ExmZFRUjPGi4nIwHryIKyKIRxUFxZMYMB68uIGCgngQBQ/mJiKIGwguQcxdXHANccGQBBJXjP4186qt+dMzzGDSSWA+KKbfX/XqVb/u9/olkUiZMmVKwPO86fgZzXoYxOPxWayNOGpraydjEttYDwuM3VpTUzOPdR8EtMN+wP44+wn7Aus22knuFyZSA2thIzVUV1dPYD0HnTDWq6qqJjrfB/aFAcZ9CdvPetgkEonVqKOX9RzyTaIA/avzz2bfYJOvpqFAasGynsG6T6FJxMb6XHz4Pc2+wQRjnoX1sD5UoJZW2APWfQpNovo8ehMxqZXQLsBewRqtT0HM4Vgs9g52ETEL8btRfdFodBm0h9Aewzbj+oXt68Y8YjUGORYh5rz8sq9UUMMm2BXkW8M+AfeyRWpi3ccV3C8gmUxOc77XVkfCnTYee8Z8acseqpq00+n0JNPuRL9d7vo47LLxbeXxpY3lM9NqFvi/I98ld30G9o1zFAv69clDlWvkXInJvMkxQsH84nTW4azLaAdtLG5svNPl7OaDwZvtIPbatevMJMr2sIP8HC/tMVZT4OuB/SJNarphtWLAhB1Cvz5tSx5ZHTZG4RpzcAXkDzAgriUoFm/jcpcnM7maEwVd1aesaA7YG55MJWgMAfFrxYfx0lZ3+RZbrRjQ57r0Rd5rBc+DEf/hV7KeQW+Y9SDyxSL5AufLvLlmK/CNlrscX3wfJrvpX7b8k6jxVsPY21krFjn/2TpgvzlGEb/donIIKiwfiOsMinVnKZmMbdJOpVLj1AdtlRujS9qe2Qrw9Kei/ZlzunaF1VQPiJWPW7+aSkEeuixjyYOVM5f9QsExggrLhy6nCN0gtBM2B647yb9O/UFjcU53M0kT4uuw2wHaPb1WXT54mJgGP5Bw/fiB9KtNKeTzk8lHg31BIPYtrMNIFS7HHhOT83XF5B+Adl99/AXkAl1Mk9UE5LllY+PuHIvYvZg0D+196tP70jYjPtmGtI3rox6dRBToGwJzedljwUdYG+y9l/1bupvjgkDcbi0S1oObmEP+O/JR0RgU2Gx8ctMNpn8v/FNs/1j2bJlZ/gz0J9rPnRbWu/YnG4cc56A9hSWsrmAJR73s/wukr9R4imMU+B/BWlgf1uiGz3qpIMex+vr6sayXitQyEHlCB4W3x/McgYpF3jTWSgVv9NKByDMkyJP/n7cRfRvxEFawXipe9tgTePAfEch+BnvGejFgv0yxVioY+y6sjvURh/vrZBTrYYAJXMJamTLDj78J2mYS5S98eQAAAABJRU5ErkJggg==>

[image35]: <data:image/png;base64,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>

[image36]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAXCAYAAAAyet74AAAAyklEQVR4XmNgGAVUA4qKiupycnLTFRQUBEB8INsYiDfIysqaIqtjBCq4JC8v7wTE/4H4IRAHgSSA9G+ghgVgVUDOaiDFBBTwBSkE0kowE4AGdIDEYAproPQJuCAUAPlr0MVAgiDTpqOLoSgUFxfnhgpKwsRUVFTYoZrz4QqBnHZ0K4Bij4Bi35DFwL6DmvgBZDrQExuB7FcoiqAKQYpmAZnMQJPClJSU+NHVMIAEQQqVlZVl0eVQAFDRJHT3YQVQa8EY6DZzdPlBAABrVTkENt844wAAAABJRU5ErkJggg==>

[image37]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAYCAYAAAAs7gcTAAAAq0lEQVR4XmNgGAV0BwoKChPl5ORSkfgd8vLyNchqGBQVFcWBEpdAbKDiXKCCX0D8H8QH0meBuAeuGCYBAqKiojwgPtAAfaABFiA2kI5AVmwEYwNNLkPWDFTIAWNjAKDCT8iK8QKQQiBejC4OBkBrBEAKZGVllWHuBTpFCyYP5F9FVjwTpEBGRoYTSJ+DmqwIkgN5EqhxBVwxEDBCFYBMdAXZgMSvQ1Y4CsgGAJdwLWZxMIktAAAAAElFTkSuQmCC>

[image38]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAYCAYAAADDLGwtAAAAwUlEQVR4XmNgGAVUBfLy8rPk5ORS0cUVFBTM4Rygol9AihlI/wdiRyTxFJAYjDMPpAjKBin0QlL4BllhLZTuhgsiFII0rkcWgwm+QBKCOcUQSQyuMAjGB3qsDN0GBkVFRXF0QSD/I7oYTOI/UIMeiC0rK6sD4gNN3YCuDh4UUDwJqlALRRHQBClkPlDBTgxrgYKCUFOmQYUYQXxgjHigKJSRkZEGSnwHsZWUlPihiiJRFMEAUNISiNcATW9DlxsEAADu/Dm55QKMkAAAAABJRU5ErkJggg==>

[image39]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKEAAAAYCAYAAACSlJ0LAAAFQElEQVR4Xu2aSYhcRRzGxyRuiKioDM5W00PD6IDrCIoRJAe3uGAIqKCo5KA55RziQcQouOCOCCZqFBGDqKccBA86bmgOihAURMFgAiHGqFkmTox+33tVpubrqrd0v359eT8oevr7/6vqe1XV9bYZGmpoaGhoqBhjzGrV6mBycvJ81RqqYWJi4mrVyoL5uUa1voAF+HYVhrNAH3Po4/aAvn1sbOxC1Rt6A+N6CB8nqB4Di+161NmhOrTnEbtX9Q6Q9CyS/0D515bDKPt8DTlbtR5BbCViH6peJVNTU2dYD49rjDA2PDx8muqDAj7PpCfV6wQ/2F/sPLo5PYCy134mGnLu0XoE/j8pu4O5NlUn0H9HuUD1ILGGWq2WoR5abKH8qkEfC9bbNo0R+LsOsYOq10m73T7XTnwyhnWMSxGsly9Ux1w+xxg8L/d1aJzsUt6R/1bWMaOPs2KxDmKGSagTfN+A8o2vVQ3aX4XyNPvmJGvcwThOy6OqD4LQWA0CeLiLPniq1Bh+uBdbnz/5ukl3rVW+lsMS5P+Zd8yIHTN59w0wemfMMCb31FAnNv9KX6sa12eofx/EtqN8qvogyPNaF/DwfcwH9I2M4Yf9gejB/BjI34uPZXnHjNhTKEdUXwQSdsQagf4+Y1hwt4kezK8K9LfV3XTkHaT7Eak+CPK81kWWDy+21NPWxPJDcG44R/wb9Y5m1UXsvKx4QswwtBXUeQ0h+spQfoUsRft73JeYP5+8eF0U8VoH1sdnAX0zY+Pj45f7Oub4K+i/+loW/jGajE3MkRf/f+BQ9pv0umDefv9udHT0bM2H4YdjjUL/x2svWnAqeFnrOhDfh48l3vekjpfSQV6cTE9Pn468NyPlDRzXFvh6DX+/irIJ5RVtI48iXvsNH2dZH9yhOJ980pHsVijvaj4x6XXbnOohkPcI+rjZfedpnW2PjIyc4+f52L5bqie4UxnKGo3F4GSxjupliC1CtHsZymbR6C+zP8bh6xTV66aIV8fMzMxJ3JGKFIzXrNaPYTKuB2PY8duiegjkzsv3J+1xr/B1H9v+DaonIPhDWcN2tyhVR8lYhDwY3nH5JdldNdeHce50qteN9Z/p1cHnm1hgtxYpGK9btH6MMh4czEcfr6uumHSB6/wcsvXXab7DxsPH0I1hrOj1ZesooUVo0ruoGwP6e+wPlwZjGnMU8dNut09G3hNliraRB30U8dJPrIefVc8C+fOYk49V98GPYQR5X6rearUusn1u0piDceapnmAr/6h6FiZ9ftfTQEcW4aJt3gH9UevzJo05evVTFdbnwLxgg7iP/WN879ZYFqjzLcpO1X1ix8XLCnvcX2vMYesuU52BBxmE8Qc0lkfMUDe4tzIoL2qMYEAfsgP7mMYIYqur9NML9jgG5gV97+mmf4zt/bF6vNZGbLdJ3yl3wBsSe9wLGiO8ue1oG8ILKH+Z9M6J74kPohxblJQDGy1zsRzDHL+DS+7K0eYzEj9iY7+Z9N1nh09on5vI2566MOmThV0oO23h3/s1r1+Y4+/7+UkvfHd8WPOyMLpQUu0l2x7Hn9d+ByTO63UX5/XhUSzaK/wcbh6mH69W0eg2E3gONQg4eLOzsyeq3lAOjiMWzLWq9wraXejbfzvRtGp1g0FbDh9/q95QHuxgl5jAmaYX+ASgr+sEjW+E8XdUrxOeDoZCF7wNXYHx3MXFqHq3oL3dWU81KgGdzEVvvfsM+v4I5VLVG3rD/rB7hjeU3dz0dgU6WqtaHWCwrlKtoRpMxtuPomBd3KFaQ0NDQ4PjP4+bCQwruoGgAAAAAElFTkSuQmCC>

[image40]: <data:image/png;base64,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>

[image41]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAYCAYAAAD6S912AAABK0lEQVR4XmNgGAVUBQoKCrvk5eX/E4PR9eIF+DTJyspK4ZLDBZihBl5El4ABkgwEKi4BaQC6xA9ZHBgcBUhqSDLwI7oGIN9LTk4uDsYHGm6OLI8XwMIPiC2B2BFoUBm6BaQAWPjdBxrUBqSnAPETsg0EGlIO0gz0kgeyOFDsLowtLS0tDKQYYXygngXA8LaF8VEAUONndNcYGxuzAsW8kNT8RJYH8quR+SgA6l2c3lNRUREFyu9DF8cKtLS02KAGnkaXgwGoZSwgNtBwdiD/PBDfRFMGAcBwmwDSgJ7+oHIBUMvg3gWyv0BpVB8BFa8CCv4B4n9QTegYJP4biL8D1Rqg6e0ERsoMZDGKAIbrKAFA13GAXA9iKyoq2qHLkwWABv4A4vPo4qOAMgAAoMxlz0wayFQAAAAASUVORK5CYII=>

[image42]: <data:image/png;base64,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>

[image43]: <data:image/png;base64,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>

[image44]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAYCAYAAABOQSt5AAADdUlEQVR4Xu2Xy0tUURzHLQyKqIiigRln7uhMWEGhzCYyoogSXEQiVBs3buofKMQgCIJWQS9o0SJaVRIELXqbhj0gDHoRBLaOFplWUpk2fX/5O3L6zjl3xrkzu/nAj+v9/l7n/O7LqaurUaOqBEHQxVo5ZDKZNaxFIZ1Or2OtamAIV1Kp1FbWQ1iAnDyLAvTbrEUB9UYaGho2su4EUzuNhAlZnNoP2JitIaaf8wT4OuC7x3oYyPnkGwQGeoc1A3I+wqasdX6DfdajWWevIy8fi8WWsu7FFGO9sbEx0CYFG3bFh4GNbvD1EeC/y5oNrm5C8w+zD9or9XXaOta/G9qkrYWiRZ6xLrgWj/M+2EtbK4bWGeVaBtewbZB3VnMXOnwdWn/Y4cvLEFkvAAs4IME4trMPBZZoAx6ExG+2tTBwtY8hfj+OVyU3m80u5xjo91mzgX+G12GA/kLXtN3hG4E9Zr0ABL0LaXBDG+wl3RnvA/HTcpSBSC6ObY6YB6zZSB5sjHW5IOp7yz7BXGjWC9AiBYHQdugQzpD+7za0tTCQ/xobXyl/47hPax7kOOgDrBmamppWSB7yTyaTyQzu1LU4b4V9UH0n59iUtF4zCNg47Avsp56/SSQSqzgemzheUmEQj8dXI/65OcffLVr7vB0nQHvImgG+U5KH/HbZtNouaBdFx0txG+fYFF2vuW1gPezzgZzLRQsriJuxz+VTJrnYxCNbF6APsmaQOr6eWM81HVIL+wzqX8z6HAh472vgA5u4VEoO4roRNwn7SpYPHM86tCHWDJozwbqAR2WP+MM+v+Jvbm5exvoc2qDopmww2d5Scnwxvp6+QcjjpRs9wj4B6+lXfzf7DK5+/6GLGmU9DMR3FisM/6C81FgX5jsIbPCCxOdyuUXsA/Va7w87bFz95oDzqASkHW/wYoQVNgtn3TDfQYTE96hvnH028He58sVxLpj9H12+EPK7Qp7j0IkyUhgbztka3twxrSu/Ab4H9KJUXX7DSE/5Qv3CRbhp+YescDmXdU3L2qSfZXL+G3Ydtt7OcYGYp4Hnv+bIoPAt2BPWoxB47oioyPA8j1VlkAasRaEag8Bd24a6U6xXFDQ4Id9w1sulGoMIZh/PetYrDhoN492wifVyqPQgUG8A1sp61cBdcYi1csDviRRrUcAQtrBWo4afv+kEQdPja87aAAAAAElFTkSuQmCC>

[image45]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAYCAYAAABurXSEAAACXklEQVR4Xu2Wz0tUURTHbRlBEgUD8+vNjLNqEYEbQTeuBFdJUG3atKlVa5sgEGzfoKCuRFxoQgouWrgRkUiEoB8QBvMPuGj6oZFCNX6Pnvu48/XdO290Bgn8wOHN+57vPffMnXvfm46Oc/5TgiC4zVqz5HK5e6y1DTQ8l81m+1j3cAFjaiyiRgH6B9YjwTd8AfMPKaTxG1G1NXgWeJyA3CByK6z7wJjtqKYF1Cojplh3YhpkPZ/PB9r4seai/D6wmtdd8xh8uWNosbesC1ET4b6EeG9rjdA6Fa5lg9xsEGebyCGQQrgOcC6dTl90NC3+HlvzgVV+Bv9dXOdlbLFYvMweoVAodPJckcD02WWEvqQN3iI90u8C/j9yleZlLK697DH4vlRI1Eqq3q8Nl0kfjPK7wPiPaPKKfMb1jtZ8yD6D5p+wXodpGvEd8Q2xp/efUqnUVfaj4EjcppPJ5DX4N809Pt/U2uO2z0abnmE9JKf7GfGAcy6kYNym4ftr3ycSiUsyFiu+Zus2wdFjd4P1ECS/xG3AgAmn44yB7z58vxA/KWqIKvsNOuYd6yFaoGEDNljp4ThjXJ5Gc2p+kfUQNVRY9wH/kG9SAfnVTCbTxboQs+kS64cg8VQMvpPswjcptsWELx+nafO0scUxxE5w9KSQ/xmyh/7VmRqghbttDa/8hNb9itgN6BCqLv9pZE55Uu1jwZZtjzmottYyUPg14g3rpwULMYm6r1hvGe1YkXbUrAMTjOLnfcn6SdFX/HPWWw4mWcdevsF6s+h52GK9bWC1H7HWLFjlx6ydcxYcAIMr1IYsc3cqAAAAAElFTkSuQmCC>

[image46]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAYCAYAAABOQSt5AAADZklEQVR4Xu2XuWtUURTGr0bFBRVRGMgsN4mDkYCijoWojYiKEVEJiFja6H9gTFxBBVFc0FbESrRwKUwhWEVNk0IIiKJYWEqMazAuMX5n5t7k5pt735vMvHTzg8Mw31nfmbeNUnXqTCta6w7WqqVQKMxmrVqamppWsjZtYAl3crncZtarBbWO4mMm61Fghl7k7ffo/ZlMZhXrXrC1q0j4Chsz9hM25GqIucd5Anzt8D1hXWhsbFwG/6BT96+p+Qk2YnUcwBI3D/U61RQW0dLSstjMeIF9gvhSqdQC1oPYwVhvbm7WplHZAfviGcS8DcX5eqLPMTWFRSD/j6nTwz4B82+Hb5j1IKZYH+uCb2B874K9dDUfvlyL9bW1tc1xtC5V4SIQuw92WWrgzPrAfov4cYmkWS8Dv8IBCcbnDvahwDzfwZj4Da7mwwz5kHUhULdbVb6IYq6vjgt8/bBnrJeBoFehQtAfmIPeS7o33gUL2G1y17AP+mvxIWYT6cdVBYuQ+5a9EcYtwv7QrJcRKgRtizmQa6S3++IZXfolxrLZ7HIx3NhW4PtB0+89Qho8OSdU/CIaEPfRfgnN7xLnL2ILwb7APuuJu/pAOp1eyvFYzJlKCtu6+NW3wbaK6dIS5WkyiJAZnIOYkypmEcgdUk6M7eOElBHnHz9tYIfYFwI5t2MLq1JzxD5iXQgNj0WcUhGLQM462E3SvLVczCxzWR8HAW/iijAY9lZcDprukRhcEuvZJzjDTzorkHdaRS9C8r6RjcbNI/7W1taFrI/jDFQxGLYzLgf+gaiYUN+oRSD+EmynR78vtXAZZ9hn8fWahBnoHetR6NLzO7Jw6EAFnFFXjP8i+2IWMcKaAP2cqbeLfZbQLEXg7JYAND/MvjiiCufz+UVmsMeujtfu+dD6TE/vK7FvEfbtFnbD1S1yXxE/Ps+zT4CvwzsvxOuw77r0hJD/FcOwfxwXhWlccDXz3v9Lm2uWTDTpKS9Ms9w8F16ELv1HkTmLTzM5myaii37pJz75D/NDe44D2gsdeGuuGRTugT1nvVZ4EUmAOceS/HtfhjRgrVaSXoS8uWLO36wnChqcxeB3Wa+FpBeBGUdVxKWYGGjUi5vZatarJclFYLansLWsTxsY/ghr1SJPFtaqBUvYyFqdOmH+A9h+PDjygZlnAAAAAElFTkSuQmCC>

[image47]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAYCAYAAACFms+HAAACf0lEQVR4Xu2Wz4tNYRjHx48UCxJF99e597pZ3IUUC8VGQt0SshE7FvwJMitlIws0f4CsxAaLIVZKmg2lpvyIlJXNGKRphvz6PO77jvd8e885us5Naj71NN3v832f53nfc+acMzKywH9OkiSHVBuEVqu1R7WhwdBXG43GDtUHodvtLqPeR9WjNJvNi2YmfriYJaZDDc91XWeQ65G7p7pRqVTWkp8K6n51Nd8Rc15n06vDdWgHicehlosvpDqXLzE9NmDMr+B5meXL6mkafdepHsUVmVDdiDXg92niSajFiK31+JzdIqIfJ2ZDLQqnedgK8Hev5mq12vJYc+ffFmoxzMftcFN1I1bXk6WnwPQ0y4h+ww15QPSoP4SB97m1mzWH/txtarvmDLepnuopsnaOttM1viR6L+ZX8DwyX71e32DRbrc38vuI6/cayxJd4yH/hU3dVT2FH5z4QLxPfv/XT1ar1TXqZyNnLK+64usywG5il0XS37Q9baawLNI1nqR/Rd6oPo+/v4ljmsuCNVf+dHC8t1Q3/KZU95C7k5c3w4tcQwRO7nLRGgbebx5uka2aM4LBo6dObjy3R9HOYzDUqaI15CfzPEV9yT0jplWfxxV4pXoeSf/tltnUyBuMK3bB5c9rzkNurhl56f2C5KgVwHBCc0VkDWV0Op2VbrDxUOczYAXahOt5LswpzpN6BJs4RnxK+k8Q+y6ZIb6nTAVYYU5uS6jxuFuF/pn45gYPwzTrOYp1abguhq1RrRQofJt4qHoZuCfdW9VLY1inYnUZfr3qpUGDszS4pvrfkPTf1vdVLx2aPOATdJPqA7KYejMqDg1O/aRqg8DQR1Vb4F/yE/IZ6jyKmWE/AAAAAElFTkSuQmCC>

[image48]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAYCAYAAAA20uedAAAAh0lEQVR4XmNgGMxAXl7+m4KCwil0cTAASv4HShagizMoKirqgySBTCa4oJycnA1Q0AuId4MkgXxfEB8sCWQUAXEJSAKI30L5RXDdUEUgXbkogiAgIyOjC7WPEV0OpGsNVBITQO17hy4OBlDJEiT+ERRJoL0qUPZPuARUoAeq+weQy4IiOTwAALDpJKA1L+E/AAAAAElFTkSuQmCC>

[image49]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAYCAYAAACIhL/AAAABAklEQVR4Xu2SPQoCMRSEVUQLD7DN/kKqBbHQ0hMIeglrQcRjeBQrW1srK++ggoJa+lPpBKLsDmTdJqnywcC+Ny+82ZBKxeFw/Iii6My9HBi4x3G85b5JsHMHvb9iP4ccQMAp922AvavCgEmSdNRAjT0baAOGYdiHMYDWcgD1UNY8ZxptQDRn0Fy9gauqZzxnGm3AL+r2Jty3RWFA3/fbyqyyx6Rp2giCoFdG+OEun9dRGBDGUmsSnue1sHxURvI983kd/wLK93fjvk3KBJxn6k3Wt8HfgHiHQn2/2LeBvBSZQwjRZE+aC3WLT5R19k2CnQ/oBB2gPXSELtCYZx0Oh8MAH+15WkKBoTDLAAAAAElFTkSuQmCC>

[image50]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAYCAYAAAD+vg1LAAABPElEQVR4Xu1TsUoDQRQ8CVgogXQnB3d7Vx3cT6QRKxFMSj/BMkWwDv6EjU0K/YrUIiSpI9gpFiYoomACifNkN7wbi+AGrTIwsDvzdvbdu7sg2OBfYYw5AT/BheKz8qfk3enzK5Fl2YE9+KD1MAx3oc2jKNrR+q/gumJN772Qpum1De/I3oZWqMwLW65r8AMX1bjAGwicSTBC6+ythSRJbmzH9+x5A2EXCG67cbDPkC+GtR9A0CnYlbV7iXIJ1znAO0TNkPUSULSPolslLV+i0kqANwCPWV8CP0aOgifWjf3j0P2e1tFE4S61T3Wl/aAoim2Il2LKumQG38Ete/iRPYF4rMkMRzBewDH4Cr5rH/uJ1cWX9RvOnDk/juMjs2q+PkBoH2ywvjbcGGTeeZ5X2fcGgs/BHthkb4O/xRddpmLVZrHXeQAAAABJRU5ErkJggg==>

[image51]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAYCAYAAAD6S912AAABJElEQVR4XmNgGAVUBQoKCrvk5eX/E4PR9eIF+DTJyspK4ZLDBZihBl5El4ABkgwEKi4BaQC6xA9ZHBgcBUhqSDLwI7oGIN9LTk4uDsYHGm6OLI8XwMIPiC2B2BFoUBm6BaQAWPjdBxrUBqSnAPETsg0EGlIO0gz0kgeyOFDsLowtLS0tDKQYYXwVFRV2GBsDADV+RneNsbExK1DMC0nNT2R5dPUoAOpdnAqArhEFyu+D8YE+EgTy/yGrgQMtLS02qIGn0eVgAGoZC4yNjNGUgpPCBJAEevqDygVANaJ79y/IlchiIMWrgBJ/gPgfuq1QDBL/DcTfgWoNkPWC5JH5FAGg4QIgy9DFyQZAw5qA3p0OZW9HlycHsAAN+gTEB9AlRgFlAACYBGkQxLTTKQAAAABJRU5ErkJggg==>

[image52]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGEAAAAYCAYAAADqK5OqAAAEF0lEQVR4Xu2ZSWgUQRSGE42CiiiKjCSZVDYYiOIlIEEEEUUhiDsoetODQo4eXHJSo16VKIgHRVA0Xrx58KCoiIjijuKCeHE5xKhZ3GIS/5epksqfrq5yMj3kMB8U6f7fq3qv6vV0V3dKSooUKZIASqkNrCVEGQvjlLLKyspZLCYGCnChqqpqMetJgFgHWBuvINevmUxmOuuRVFdXH0WHb2hDuv1A67I1+FzifgJszbBdZd0giVjjShuwbO/I1mv3jUI5igB9K9ovGq/Tsv8m22u7f1JILNZiMQmyXlNTo0SPWuwo/yhcY4uG8Rey7kI5imDAWCt0rPe2nkqlpkEbLC8vn2rrSYM7xGHEvc+6E538HdaFqEXE+T60R7bmAn6fpT8K2WRpXbW1tVW2nw/lKYLgyHXUBVAodOxS1keBxdmsF2kl2/CAmeKamL2oceCKaNBj9Mk5/j7L5TkSUgTk1KFjHZRznfdEcisYiD+A1sb6KOD0nBfZAP2yXvC1pEf6u9ALI03G2872EFRAEUCpFes78p7JDoUEF9tJ5PGH9VGYpCP0paJjIsdIb47yjwP+J3Sca2wLRYUVQfz6dd5L2FZokMeioLUyRVDZ3cwXtJ/6/GlFRcVs9sfk9gcNbIErYqOJw7ZQVGAREOuujvWWbYUGazXXO2fzPEDbxjYX6HPWO7BFOp2eLwuislvfISzSPPaxkd0Ma0JIEeBzCuPv1nPy5uiKFcAEjP+CxSi8ecDhpdeJwCTPhPaRXxJ8u+XYekB3sZ+Na2xfEWBvQTsnx+YBLQVhPwNsq1TgDs8GfU6j7zJXnozXTy9KvBOBCe4J6dPY2DgJfoO25ouHsdfA/ph1QcUUAYuyHPZ7lvTvAW1pI4DtIdo61kOJG9uAd5eU108n+ob1OCRx78Al0UlWZ9/QJWY728yimRZhjywCJpqB7RPrSr8py33Z1q1f5HDD+UXbHkpUjgxiN8X6wdiqk9zBNh9xA8O2RU+whW14QZthJs82waULiorQ0NAw2dwa5di2CdB36Vgf2CbExQohpD982iP9tKFHZXdC8rDsU3Tb8CEDYwEaSZNvON0q+4YsO63e+vr6OZb9uI4rMcVHvk+NWCAZ1z63UVYRcOG80jHMOMMvgpav+f4ldjnuQZ+9xo7NwmpFzwOV/W7mbLav9nfmaoBPP9bpCOt5AYNfQbvN+liQhcFCPWHdoBy3o1zAWA/Q1rP+PwQWweszJvIdAAW4ibZJjqN2NXkuwnDu8nwI/uRM+OYPe2vcRZUXEKQNQTpYzxX5oKeyn7jPs03IcxEOoV1XOfxDSmVvT3Ir70TrQiFvsI/gK1LeQKBb2J0sYD0J8lmEpEGuH2UTwnpi4Newk7UkKPT/A3JFvjzX1dWlWS9SpAjzF32BfbYDhJYFAAAAAElFTkSuQmCC>

[image53]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAYCAYAAABUfcv3AAADrUlEQVR4Xu2YSWgUQRSGx7ghHhREoiSZmsTgYRQFxw3xoghKcEVB0YNiDgpeBUVPgngT1JijiAdxuXjzoGBAcT24RVxAoidvRo0JRo3L/6ar5OWf6uqe0FGE+eAx3f/bqmp6qrsnl6tR47/GGLOZtSxpaWmZzVrWYA4z8VHH+qiBhhfy+fxy1rMEPX6xNhpU1adQKJxAwidJsvYF1qs1xFzmPAG+NviusS7At0zVDBoWfi3naySGNQd8H6neD+V7S75+ncsUi8UJiPnJehBXnPXm5mYjum+BfPEMYvpCcbb2VNY1oXxH3PhFwxwWsx4H4u/AjrMei218l3XBNyicH4I91poPX64Gvq+sMaF8B2LeSxy+hKVK68X+mNdxKRibpl8ZNNtmm65mX2Nj4yTf5HmQMZQHAXuoRZyfUcd/flpxcG8f+LkXba8BOcfns5HuvVIHuatYrwCBz+MGB/2KXaSNpHvjNYjZbwexjvQedZx4R07TS7ALJyZjbmd/WpD7EvN9wHoFrqFHXyE6ipwkvc0Xzxh7g5FvXgx1duF8CJ87OTZEml4C4jrtXG6wrxpMtA0l97TNxOQO9QE2aM+7GxoapnE8Jn4kTWFXF4t2rBDdvbvS5DFpc9Bni+vJvmpwWxfrw3BBsN3siwM55xIL53LjbN17WuS8NA+3nOOjqalpLuJ6TPQoJV/WHI7R1NfXT2bNgfktSeyJgFeJQQQGdTYpB80PSgw+12gdWpc67oR/hjr31ozTHfKrQEyfHKubRC/HaUI18SUsCvnL2CbhIMItCusa+PtTxAzz87kjThdKpdJ4Qw+tSXPC+DfA/4R1B/xbQ/llbJPXrIdA/KakwkmDx5VxHwPcK8cuNi7Hpzl8vkK0n0qtDvYl9RISLww4D0sAAvewL4lQYfn52YENe34T8BQ/39jXJK1LrFwJWnNwrNW22x772Id9c4r1VeQJcboD/m7je7iH2AH7bKI7qGymA6bKdzRpjqumRNoC2Hep5QZOJvoQbBC5Fyk3djLah+MdJnqNkzcF+QL6W1tbpyv/aRPNTeYlMfJI9M75bUxsL0H8Bc/LQCag+FXYbdZHSmgyIV+1YONfj0V5yrpiTJb9vGTVAHVWwl7Y4zcefyZ9BCzaTdn85RhX/QH2o9d12CnWMwUNjmIQl1gfCaj1DfaIdSHLhZOXfhP93XSefaDOpHh3zgQ0uoUNfx7rWZLlwoX4a4vmcI8VowX2pYWsZQ16zMJNZiLrNWr8O34DbsVxgAL3sG8AAAAASUVORK5CYII=>

