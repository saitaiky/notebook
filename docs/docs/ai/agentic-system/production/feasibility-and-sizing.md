---
title: Feasibility and Use-Case Sizing
description: "Turning a business requirement into a sized, scoped, feasibility-tested architecture: call-volume and token-budget modeling, the four-AI-properties feasibility check, the three feasibility verdicts, and ROI mapping."
sidebar_position: 2
keywords:
  - ai
  - agentic system
  - feasibility
  - use case sizing
  - roi
  - cost modeling
  - scoping
---

The [production-readiness bar](/ai/agentic-system/production) tells you what a system must achieve to be viable. Sizing tells you whether a *specific* business problem can meet that bar, and what constraints the design has to carry to get there. Feasibility resolves to one of three states — feasible as scoped, feasible with constraints, or not feasible — and naming the right one is what makes a scoping document actually useful instead of just optimistic.

## Sizing a Use Case

Sizing means producing a cost model before a line of code is written. It doesn't need to be precise, but it needs to be accurate enough to validate the architecture against a budget and surface token-distribution assumptions before they get formalized into a commitment.

1. **Estimate call volume.** How many requests per day or month? This number comes from the business requirement, not developer intuition — a workflow that handles 1,000 conversations a day produces roughly 1,000 calls a day, plus any multi-turn continuations. Get it from the business owner; a sample dataset will not give an accurate figure.
2. **Set the token budget per request.** Input tokens (system prompt, retrieved context, user message) plus output tokens (expected response length). Model the *distribution*, not just the average — if document lengths vary widely, the model needs to account for the typical case and the extremes, not just the mean. A long, stable system prompt is a caching candidate (see [Cost, Latency, and Reliability](/ai/agentic-system/production/cost-latency-reliability)); caching has its own write cost on first use and a TTL, so the model needs to account for both rather than assuming every call reads from a warm cache.
3. **Project the monthly cost.** Multiply call volume by the input-token count at the input rate, do the same for output tokens at the output rate, and add the two. Input and output tokens are typically priced at different rates, and a cached-input rate (where applicable) differs from the standard input rate. Compare the total to the cost ceiling. If it exceeds the ceiling, the architecture needs to change before any code is written — an asynchronous batch-processing mode is worth modeling as an alternative for workloads where the SLA can tolerate it, since batch pricing is usually discounted relative to synchronous calls.
4. **Run sensitivity analysis.** What happens to cost if call volume doubles? If the token distribution shifts toward the tail? Sensitivity analysis shows how fragile the cost model is, and which assumptions need to be checked with the business owner before the design is locked in.

## Scoping a Use Case

Turning a business requirement into a scoped architecture runs through four steps, and skipping any one of them produces a commitment that won't survive the next conversation with the business owner.

1. **Business requirement to capability list.** Name each capability the system needs separately — "process insurance claims" is a goal, not a capability list. The capabilities might be extracting structured fields, looking up coverage, routing by claim type and value, and drafting a notification. Naming them separately is what lets each one get assigned to the right owner.
2. **Capability list to architecture sketch.** For each capability: does the model own it, does an existing system own it, or does it need a human in the loop? This is a decomposition decision, applied to a specific use case rather than in the abstract.
3. **Architecture sketch to boundary conditions.** State the conditions under which the design works and the conditions under which it doesn't. Feasibility is a verdict *plus* the constraints that make the verdict true — an architecture that handles documents up to 20 pages but fails on longer ones has a boundary condition that must be written down, not discovered later.
4. **Boundary conditions to scope in the statement of work.** The boundary conditions belong in the SOW, so the development team and the business owner share the same understanding of what the system handles and what's explicitly out of scope.

## Technical Feasibility: The Four AI Properties as a Checklist

A feasibility assessment that only asks "can the model do this" is a capability check, not a feasibility assessment. Running each capability through four model properties surfaces where the design needs a compensating control, and what that control should be.

| Property | The feasibility question | Where design compensates |
| --- | --- | --- |
| Next-token prediction | Does this task need probabilistic generation, or precision on specific values? Classification, summarization, and drafting are probabilistic tasks the model is good at; extracting authoritative values (account numbers, dates, amounts) needs verification against the source of truth. | Generator-verifier loops; code-based evals on extracted values; tool calls for quantitative data. See [How LLMs Actually Generate Text](/ai/llm/rag/rag-foundations#how-llms-actually-generate-text) for why this property exists in the first place. |
| Knowledge | Does the task depend on information that's rare, contested, recent, or domain-specific enough that it may not be represented in training data? If yes, the design has to bring that knowledge into the context window rather than rely on the model to supply it. | Retrieval for stable knowledge; tool calls for live state; explicit uncertainty flags on contested claims. See [Retrieval vs. Tool Calls](/ai/llm/rag/rag-foundations#retrieval-vs-tool-calls-stable-knowledge-and-live-state). |
| Working memory | Do the inputs fit comfortably in the context window, or does the task involve inputs that, in aggregate, exceed it? Long documents, multi-document tasks, and long conversations all hit this. | Chunking, progressive context loading, summarization across turns, a pipeline architecture for inputs that exceed the limit — see [Combining Context Strategies in Practice](/ai/agentic-system/context-engineering#combining-context-strategies-in-practice). |
| Steerability | Are the instructions specific, concrete, and verifiable? Abstract instructions, long reasoning chains, and precise numerical or logical computation are all places the model can drift from intent. | System prompts with explicit output schemas, structured outputs, code execution for numerical precision, evaluator-optimizer loops — see [System Prompts as Governed Assets](/ai/agentic-system/prompting-vs-agentic-prompting#system-prompts-as-governed-assets). |

A common sizing mistake is treating a single long document as the working-memory constraint when the real constraint is corpus scale — a single 80-page document may fit a large context window comfortably, while a 12,000-document corpus never will, regardless of window size. The two are different constraints with different mitigations, and conflating them produces the wrong architecture.

## The Three Feasibility Verdicts

| Verdict | What it means | What to document |
| --- | --- | --- |
| Feasible as scoped | Every capability clears all four properties, the cost model is within the ceiling, and latency p95 is within the SLA — no capability needs a compensating control that changes the architecture. | State the assumptions explicitly. A feasible-as-scoped verdict becomes feasible-with-constraints the moment an assumption changes. |
| Feasible with constraints | The design works under specific, enforceable conditions — a document-length ceiling, a scheduled index refresh, a human-review gate above a confidence threshold. | Document each constraint and its failure mode explicitly. The build team needs to know what they're designing *for*, not just what they're building. |
| Not feasible | At least one capability hits a property limitation that can't be compensated for within the scope and budget, or the cost model exceeds the ceiling by a margin no tier, caching, or architecture change can close. | State which constraint is disqualifying and why. Where a scope reduction would flip the verdict, name it and hand the business owner that choice explicitly. |

## Business Value and ROI Mapping

A feasibility verdict says a system *can* be built within budget and constraints. It says nothing about whether building it is *worth* doing — that's what ROI mapping answers, in the language the business owner already uses: hours saved, error rates reduced, cycle time shortened, revenue protected.

The business case maps onto five pillars, and naming which pillar a claim advances keeps the conversation grounded: **efficiency** (the same work, faster or cheaper), **transformation** (work that wasn't feasible before becoming possible), **productivity** (more output from the same people), **solution cost** (the system's own run cost), and **performance SLAs** (the service levels the deployment must hold).

The mapping compares two states in a unit the business already tracks — a baseline (how the work is done today) and a projected state (how it's done once the system is in the workflow) — and the value is the difference between the two, minus the run cost from the sizing model above.

1. **Name the baseline in a business unit**, pulled from the business owner's own operational data — analyst hours per claim, average days to resolution — not from intuition. Every later number is compared against this one, so a guessed baseline undermines the whole case.
2. **Predict the post-deployment state in the same unit.** Where the feasibility verdict requires a human-review gate, the projection has to include that cost — a review gate reduces labor, it doesn't eliminate it, and projecting full automation when the design specifies human review overstates the value.
3. **Subtract the run cost from the sizing model**, treating the projected monthly cost as the recurring cost of the new state. This keeps the ROI case and the sizing model consistent — a change to token budget or model tier updates both together instead of drifting apart.
4. **State the payback period and its sensitivity** — how long it takes the accumulated gain to cover build and run cost, and how that period moves if the volume or gain-per-task assumptions are wrong. A payback period quoted without sensitivity invites a decision based on one optimistic scenario, which tends to fail once real volumes arrive.

| Common error | Why it happens |
| --- | --- |
| The baseline is estimated rather than measured | Without clean operational data, the baseline gets filled in from intuition, which makes the apparent gain misleading — and the error stays hidden until finance asks for the baseline's source during business-case review. |
| The projection assumes full automation when the design requires human review | A feasibility verdict with a review gate reduces labor, not eliminates it; modeling it as eliminated shows up in the first operational period, when analyst hours don't fall as far as promised. |
| The run cost is taken from an average rather than the sizing distribution | Reusing an average token cost instead of the full distribution understates recurring cost and overstates net value — this bites hardest on workloads with heavy-tailed inputs, where a small fraction of large requests drives most of the cost. |

Cost · Complexity · Risk

**Cost:** Sizing on average token counts understates cost when a subset of requests is much larger than the rest. Getting this wrong means renegotiating the architecture after the deal is already signed.

**Complexity:** A feasibility assessment that skips one of the four properties risks missing a constraint that changes the design. Working memory is the most commonly overlooked, because it rarely surfaces on small, clean inputs during development — only in production, at real scale.

**Risk:** An undocumented feasible-with-constraints verdict quietly becomes an infeasible system the moment its constraints are violated in production. The constraints carry the same weight as the architecture they qualify.
