---
title: "Reinforcement Learning"
description: "A practical guide to reinforcement learning foundations, from MDPs and Bellman equations to deep RL stability patterns and modern actor-critic methods."
keywords:
  - reinforcement learning
  - markov decision process
  - mdp
  - bellman equation
  - q learning
  - dqn
  - policy gradients
  - actor critic
  - ppo
  - sac
sidebar_position: 5
---

# Reinforcement Learning

Reinforcement learning is the part of machine learning where the system learns by acting, observing consequences, and accumulating reward. That makes it fundamentally different from ordinary supervised learning. There is no fixed correct answer for every input. There is a sequence of decisions, delayed consequences, and an objective defined over time.

This is what makes RL powerful and what makes it unstable.

## The RL Setting

An RL agent interacts with an environment in a loop.

1. Observe the current state.
2. Take an action.
3. Receive a reward.
4. Transition to a new state.

The goal is to learn a policy that maximizes long-run reward rather than immediate reward alone.

That objective creates two core difficulties:

- the data distribution changes as the policy changes,
- useful reward can be delayed by many steps.

Both make RL optimization noisier than ordinary supervised training.

## Markov Decision Processes

The formal model is a Markov Decision Process, or MDP. It consists of:

- a state space $S$,
- an action space $A$,
- a transition model $P(s' \mid s, a)$,
- a reward function $R(s, a, s')$.

The Markov property says the future depends on the present state and action, not on the entire past history. That assumption is what makes the recursion of RL mathematically manageable.

## Return, Discounting, and Value Functions

The return from time step $t$ is the discounted sum of future rewards:

$$
G_t = \sum_{k=0}^{\infty} \gamma^k R_{t+k+1}
$$

The discount factor $\gamma \in [0,1)$ controls how much future reward matters.

- Small $\gamma$ makes the agent short-sighted.
- Large $\gamma$ makes the agent care more about long-term outcomes.

The state-value function under policy $\pi$ is:

$$
V^{\pi}(s) = \mathbb{E}_{\pi}[G_t \mid S_t = s]
$$

The action-value function is:

$$
Q^{\pi}(s,a) = \mathbb{E}_{\pi}[G_t \mid S_t = s, A_t = a]
$$

These are the core objects of RL. They tell me how good a state is and how good an action is inside a state.

## Bellman Equations

The Bellman expectation equation for the state-value function is:

$$
V^{\pi}(s) = \sum_a \pi(a \mid s) \sum_{s',r} P(s', r \mid s, a) \left[r + \gamma V^{\pi}(s')\right]
$$

For the action-value function:

$$
Q^{\pi}(s,a) = \sum_{s',r} P(s', r \mid s, a) \left[r + \gamma \sum_{a'} \pi(a' \mid s') Q^{\pi}(s', a')\right]
$$

The importance of these equations is conceptual as much as mathematical. They define value recursively. A state is good if it leads to reward now and good states later.

In implementation terms, Bellman recursions are what make bootstrapping possible. Instead of waiting for full trajectories every time, I can update with partial rollouts and estimated continuation value.

## Exploration vs Exploitation

An agent must choose between:

- exploiting actions that already look good,
- exploring actions that could become better after learning.

If exploration is too weak, learning converges to local behavior. If exploration is too aggressive, convergence becomes unstable or very slow.

Common practical patterns:

- epsilon-greedy exploration for value-based methods,
- entropy regularization for policy methods,
- scheduled reduction of exploration noise as value estimates improve.

This balance is one of the first things I tune when RL training plateaus.

## Temporal-Difference Learning and Q-Learning

Exact dynamic programming assumes full knowledge of the environment. In practice, I often do not have that. Temporal-difference learning updates estimates from sampled experience.

The TD update for state values is:

$$
V(S_t) \leftarrow V(S_t) + \alpha \left[R_{t+1} + \gamma V(S_{t+1}) - V(S_t)\right]
$$

Q-learning applies the same idea to action values:

$$
Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha \left[R_{t+1} + \gamma \max_a Q(S_{t+1}, a) - Q(S_t, A_t)\right]
$$

That is one of the most important update rules in RL. It learns toward a bootstrapped target built from reward plus the best estimated continuation value.

In practice, tabular Q-learning is a conceptual baseline and a debugging tool. It helps verify reward shaping and transition logic before moving to deep function approximation.

## From Tabular RL to Deep RL

Tabular methods break once the state space becomes large or continuous. A quadcopter does not have a neat small table of states. It has position, velocity, orientation, and control variables spread over a high-dimensional continuous space.

Deep RL replaces the lookup table with a neural approximator.

### Deep Q-Networks

Deep Q-Networks, or DQNs, approximate $Q(s,a)$ with a neural network. That enables value-based learning in large state spaces, but it also creates instability because the targets move as the network changes.

The two classic stabilizers are:

1. **Experience replay**, which breaks temporal correlation by sampling random mini-batches from stored transitions.
2. **Target networks**, which provide slower-moving targets for the Q updates.

Without those two tricks, naive deep Q-learning is often unusable.

Additional stabilizers that often help:

- reward clipping or normalization,
- gradient clipping,
- double Q-learning to reduce overestimation,
- dueling heads to separate value and advantage signals.

### Policy Gradients and Actor-Critic Methods

Value-based methods are not always the right fit, especially in continuous control. Policy-gradient methods optimize the policy directly.

That is attractive because the object I actually care about is the policy itself, not necessarily a value table or Q approximation.

Actor-critic methods combine both views.

- The **actor** learns the policy.
- The **critic** estimates value and provides a learning signal.

Modern algorithms such as PPO and SAC live in this design space because they are more stable and practical for continuous control than vanilla DQN.

I usually think of these methods by control setting:

- PPO for robust on-policy optimization with practical defaults,
- SAC for sample-efficient continuous control with entropy-regularized objectives,
- deterministic actor-critic variants when low-variance control signals are required.

## Model-Free vs Model-Based RL

Most production RL work today is model-free, where the agent learns value or policy directly from experience. Model-based RL adds a learned or known transition model and can improve sample efficiency through planning.

The trade-off is model error. A poor learned dynamics model can introduce compounding bias.

I prefer this rule of thumb:

- start model-free for simpler implementation and fewer moving parts,
- use model-based methods when data is expensive and dynamics are learnable.

## Offline RL and Safety Constraints

In many real systems, I cannot freely explore online. Offline RL learns from logged interaction data.

That setup introduces distribution-shift risk: the learned policy may choose actions not well represented in the logged dataset. Conservative objectives and policy-constraint methods are common safeguards.

Safety-sensitive environments also need explicit constraints for action bounds, risk exposure, and rollout fallbacks. Reward maximization alone is not a sufficient safety strategy.

## Common Failure Modes

When RL experiments fail, the root cause is often one of these:

- reward hacking from misspecified objective signals,
- sparse rewards with weak exploration,
- non-stationary training due to unstable targets,
- poor state representation that hides critical dynamics,
- invalid simulator assumptions that do not transfer.

Debugging starts with environment instrumentation and reward decomposition before architecture changes.

## What This Means in Practice

The practical lesson of RL is that reward design, state representation, exploration strategy, and training stability matter at least as much as the headline algorithm. A fragile reward function can teach the wrong behavior. A poor state representation can make the task unsolvable. An unstable update setup can turn a correct idea into noise.

This is why RL often feels harder than ordinary supervised ML. The data distribution changes because the policy changes, and the consequences of actions arrive over time rather than in one labeled row.

## What to Read Next

Return to [Machine Learning Overview](/ai/ml) for the full map of the section, or revisit [Feature Engineering](/ai/ml/feature-engineering) to strengthen state representation quality before deeper RL experimentation.