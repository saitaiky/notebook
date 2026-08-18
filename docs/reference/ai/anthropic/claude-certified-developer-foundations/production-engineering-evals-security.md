# Production Engineering, Evals & Security

Course-derived study notes, paraphrased for private certification preparation.

## 1. Define the production standard before implementation

A production design should state four things before code hardens around assumptions:

1. concrete, gradable success criteria;
2. failure classes and user-visible behavior;
3. cost and latency budgets plus a reliability floor; and
4. trust boundaries, untrusted inputs, and the narrowest allowed actions.

An evaluation turns “done” into a score on a fixed dataset. Each case has an input, expected behavior, and grader.
Change one prompt/model/tool variable at a time so a score change has a plausible cause.

### Match the grader to the output

- exact/string match for one canonical answer;
- code grader for JSON validity, types, required fields, ranges, or deterministic rules;
- calibrated model judge for open-ended quality;
- human review for ambiguous, novel, or high-impact cases.

An LLM judge is useful only after calibration against human-labeled cases. Measure agreement and investigate systematic
disagreement. Use cheap deterministic graders frequently and reserve expensive/noisier judgment for the properties that
need it. Build representative, edge, adversarial, and multi-condition cases; a dozen happy-path examples are not an
eval.

## 2. Testing and tracing

| Test level  | What it isolates                                   |
| ----------- | -------------------------------------------------- |
| Unit        | One deterministic function                         |
| Functional  | One model call's behavior/shape                    |
| Integration | A seam, such as retrieval output entering a prompt |
| End-to-end  | The whole user workflow                            |

Passing components can still fail at their handoff. Integration tests catch shape, encoding, ordering, identity, and
schema mismatches that unit tests miss. End-to-end tests prove the flow but localize defects poorly.

Trace every step with correlation IDs, inputs/outputs or governed metadata, tool calls, timing, model/prompt versions,
and outcome. A trace identifies which stage produced the bad result. Route a simple fact lookup through one retrieval
step; use iterative agentic search only for genuinely multi-step questions.

## 3. Failure classification

Ask whether sending the same valid request later could succeed:

- rate limits, overload, many server errors, and transient transport failures are retriable;
- invalid requests, authentication/authorization failures, and missing resources are usually terminal;
- repeated timeouts can reveal a request/design problem even though an isolated timeout is retriable.

Honor `Retry-After` when present. Otherwise use capped exponential backoff with jitter and a fixed attempt/time budget.
Avoid stacking broad SDK retries with broad application retries, which multiplies attempts invisibly.

A tool failure must return a matching error-marked tool result so the model can recover or choose a fallback. An empty
result looks like valid empty data. A policy refusal can arrive as a successful HTTP response with a refusal stop
reason; do not retry it as infrastructure failure. Every terminal or exhausted-retry path needs named user behavior and
fallback.

## 4. Model selection

Start with the balanced tier. Step up when the eval proves hard cases miss the quality bar and wrong answers are costly.
Step down when the cheaper tier preserves the bar. Mixed traffic may justify a cheap default plus an override selected
from a simple task signal. Uniform traffic should generally avoid router complexity.

Measure the true cost of errors as well as token price. A stronger model may sometimes finish in fewer tokens; a cheaper
model can be more expensive if it causes review or remediation.

## 5. Cost, latency, and orchestration

Instrument every model call from the start:

- input and output tokens/cost;
- first-token and total latency where relevant;
- error type and retry count; and
- step/request type for attribution.

Common levers are model tier, prompt/context length, number of tool calls, streaming for perceived latency, batching for
non-urgent volume, and caching for repeated stable prefixes.

Prompt caching only helps when the prefix is identical, long enough, reused within the TTL, and read more often than it
is written. Automatic caching is a sensible starting point where supported; explicit breakpoints offer control. Keep
live state after the cached prefix to avoid stale content.

Message Batches trade latency for lower cost on independent offline jobs. Streaming improves time-to-first-token but
requires complete delta assembly, especially for tool inputs.

### Multi-agent orchestration

An orchestrator-worker pattern pays for one planner plus multiple independent contexts. It can dramatically multiply
tokens. Use it for broad work that decomposes into independent parallel parts; avoid it for tightly coupled sequential
reasoning. Cap worker count, per-worker calls/tokens, total wall time, and aggregate spend. Reconcile all worker results
before synthesis and report gaps rather than silently ignoring them.

## 6. Prompt injection and action security

The model receives trusted instructions and untrusted content in one token stream. A webpage, email, document, database
row, image, or nested tool output can contain instructions aimed at the agent. Delimiters and “treat as data” wording
help but remain soft, probabilistic defenses.

The reliable boundary is what a steered agent is allowed to do:

1. validate and label untrusted inputs;
2. give each component a least-privilege identity;
3. keep secrets in a managed store or environment reference;
4. protect the configuration that can widen permissions;
5. enforce path/action policy in a pre-action hook or service authorization layer;
6. log every privileged allow and deny; and
7. require human approval before irreversible high-impact actions.

A jailbreak targets the model's safety constraints; prompt injection targets the application's instructions. Their
targets differ, but both require layered input defenses and a hard action boundary. Trusting the person who supplied a
URL does not make the retrieved page trustworthy.

## 7. Regulated review

Security and procurement will ask where data is processed, who can access it, how actions are logged, how configuration
is centrally controlled, and which platform commitments apply. Treat residency, zero-data-retention eligibility,
healthcare agreements, audit retention, and managed policy as design inputs. Verify current eligibility for every model,
feature, region, and execution layer; never infer it from another service.

## Production checklist

- Eval and threshold defined before promotion.
- Judge calibrated against humans.
- Integration seams tested and traced.
- Every failure classified and given retry/fallback behavior.
- Cost, latency, and errors attributable per call.
- Multi-agent fan-out justified by independent decomposition.
- Untrusted content cannot directly authorize an action.
- Least privilege and pre-action enforcement limit blast radius.

## Exam focus

Expect cases that ask for the correct grader, test level, error category, retry policy, model-routing decision, cost
lever, agent topology, or security control. The strongest answers put deterministic enforcement at the action boundary
rather than relying on a more forceful prompt.
