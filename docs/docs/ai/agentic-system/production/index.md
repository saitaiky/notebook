---
title: Production Readiness
description: "The four decisions that take a model-backed prototype to a production deployment: cost, latency, and reliability; feasibility and sizing; enterprise integration; and structured experimentation."
keywords:
  - ai
  - agentic system
  - production readiness
  - poc to production
  - feasibility
  - enterprise integration
  - experimentation
---

Production readiness rests on two independent bars. **Output quality** is validated through evals — covered in [Evaluation](/ai/agentic-system/evaluation) — and answers "does the system produce the right answer?" **System reliability** is validated through the controls that surround a model call: retries, fallbacks, circuit breakers, and the failure modes specific to a given architecture. It answers "does the system keep working when the world around it doesn't cooperate?" A system that clears the first bar and not the second is a demo with good manners; a system that clears the second and not the first is a fast, reliable way to be confidently wrong. Both bars have to clear before a prototype is a production commitment.

This section covers the four decisions that determine whether a design clears both bars, roughly in the order they come up when moving a working prototype toward a production commitment:

- **[Cost, Latency, and Reliability](/ai/agentic-system/production/cost-latency-reliability)** — why a proof of concept misleads on all three, how to model cost and latency before committing to an architecture, and which reliability control belongs at which layer of the call stack.
- **[Feasibility and Use-Case Sizing](/ai/agentic-system/production/feasibility-and-sizing)** — turning a business requirement into a sized, scoped, feasibility-tested architecture, and mapping a feasible design to a business case a budget holder can defend.
- **[Enterprise Integration](/ai/agentic-system/production/enterprise-integration)** — the entry-point, identity, authorization, data-handling, and observability decisions that determine whether an integration survives a security review.
- **[Experimentation and Observability at Scale](/ai/agentic-system/production/experimentation-and-observability)** — running a structured experiment on a live system, reading the result without overclaiming, and instrumenting the system so a metric change can be attributed to a cause.

Each page assumes the eval suite from [Evaluation](/ai/agentic-system/evaluation) already exists — sizing, integration, and experimentation all lean on it as the mechanism that tells you whether a change helped.

## The Production-Hardening Design Document

Development hides the failures that production reveals. In development a feature returns the right answer the handful of times I try it, every call succeeds because traffic never hits a limit, the corpus fits in the window, and the only content the agent reads is content I wrote. Production meets an input shape nobody tested, a rate limit at peak, a corpus too large to load, and a fetched page carrying an instruction aimed at the agent. The failure is almost never a bug in the code that ran — it is a decision that was never made: success was never written down as a graded set, the retriable case was never given a path, the budget was never instrumented, the action boundary was never enforced.

The cheapest place to make those decisions is on paper, before the failure shows up live. I treat a short design document — usually a single markdown page — as the artifact that records four decisions, each stated concretely enough that someone could check the built system against it:

| Decision | What it names | Which control it drives | Owner page |
| --- | --- | --- | --- |
| **Success criteria** | The output the feature must produce, specific enough to grade ("a two-sentence summary that lists every action item and its owner", not "summarize the thread"). | The graded cases your eval runs against. | [Evaluation](/ai/agentic-system/evaluation) |
| **Failure handling** | The failures production will throw, each marked retriable or terminal, and what the user gets when recovery is impossible. | The retry/backoff and terminal-failure paths. | [Rate Limits and Failure Handling](/ai/agentic-system/rate-limit) |
| **Cost and latency budget** | The per-request budget, the monthly ceiling, the latency target, and the reliability floor the design cannot trade away. | The budget you instrument against and the floor you refuse to optimize below. | [Cost, Latency, and Reliability](/ai/agentic-system/production/cost-latency-reliability) |
| **Trust boundary** | Which inputs are untrusted and the smallest set of actions and access the feature needs. | The input you treat as data and the action you gate with a hook. | [Safeguarding](/ai/agentic-system/safeguarding) |

Writing those four decisions down once, before building, is what keeps the production layers consistent with each other instead of each one quietly solving a different problem. If the build includes an agentic coding tool, this is also the document to hand it before it writes anything: a tool given explicit success criteria and constraints makes fewer assumptions and produces code that can be checked against something already agreed on.

:::tip

Order the document by how expensive each decision is to reverse later, not by how urgent it feels. Cost pressure is loud and arrives daily; a missing reliability floor or an unenforced trust boundary is silent until it becomes an incident. Setting the quiet constraints first is what stops the loud one from winning by default.

:::
