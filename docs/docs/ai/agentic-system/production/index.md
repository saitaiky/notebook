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
