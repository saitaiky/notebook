# Enterprise Integration & Production

Private study notes for Module 2 of the Claude Certified Architect — Professional Prep Course (approximately 158
minutes). These notes follow the lesson's order and preserve its decision frameworks in paraphrased form; they are not a
verbatim transcript.

## Learning outcomes

By the end of the lesson, an architect should be able to:

- define evaluation criteria before production implementation;
- size a proof of concept for cost, latency, reliability, and scale;
- decide whether a use case is feasible, feasible only with constraints, or not feasible as described;
- integrate Claude with enterprise identity, authorization, data handling, and observability controls; and
- design statistically credible production experiments and monitoring.

## 1. Evals are acceptance criteria

An evaluation suite is not a final quality check. It is the executable form of the requirement. Define it before
production code so that every change to the model, prompt, context, retrieval layer, or tool path has an objective gate.

The working sequence is:

1. Define the exact task and a measurable pass condition.
2. Build a representative golden dataset, including edge cases and important categories rather than only average
   traffic.
3. Select the cheapest reliable grader for every criterion.
4. Run the suite and inspect both the aggregate result and category-level failures.
5. Keep the dataset current as real traffic and requirements change.

### The grading ladder

| Grader                 | Best for                                                                            | Main limitation                                                   |
| ---------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Deterministic code     | Schema, exact values, required fields, length, latency, cost, authoritative lookups | Cannot judge ambiguous qualities well                             |
| Calibrated model judge | Tone, reasoning, relevance, faithfulness, complaint handling                        | The judge prompt is another engineered component and can be wrong |
| Human review           | Novel, disputed, or high-stakes judgments; calibrating model judges                 | Slow and expensive                                                |

Use the lowest rung that can make the judgment reliably. A model judge should return a constrained verdict and a reason,
be calibrated against human labels, and ideally use a model distinct from the system under test. Multi-turn systems need
conversation-level cases rather than treating every message as an isolated example.

### Failure pattern: the suite measures the old problem

A high pass rate is false confidence if the golden set no longer reflects production. Evaluation data can drift just as
retrieval data can. Refresh the suite when traffic, policies, tools, or failure modes change, and investigate category
regressions that an overall average can conceal.

## 2. From proof of concept to production

A proof of concept demonstrates that a behavior can work. Production design must also demonstrate that the behavior
creates business value at the expected volume, within cost and latency limits, and remains dependable when dependencies
fail.

### Cost

Model cost with production distributions, not a single average:

- expected request volume;
- input and output token distributions, including the long tail;
- model tier and any fallback tiers;
- stable prompt prefixes that can benefit from prompt caching;
- cache write/read behavior and time-to-live; and
- human-review and surrounding infrastructure cost.

Translate per-call cost into a monthly range and perform sensitivity analysis for both traffic growth and tail requests.
Batch processing can reduce cost for asynchronous work, but only when its SLA and compliance posture permit it.

Prompt caching is especially valuable when a long, stable prefix is repeated. Do not treat live state as a stable cached
prefix without a consistency and TTL design.

### Latency

Design against p95 or another agreed tail percentile, not the median. Decompose the trace into model inference,
retrieval, tools, network hops, screening, and review. A fast median can coexist with an unacceptable user experience in
the tail.

### Reliability controls

| Control                   | Placement                       | Purpose                                                                     |
| ------------------------- | ------------------------------- | --------------------------------------------------------------------------- |
| Exponential-backoff retry | Close to an API/dependency call | Recover from transient timeouts, rate limits, and eligible server errors    |
| Fallback chain            | Orchestration layer             | Preserve a reduced service when the preferred model or route is unavailable |
| Circuit breaker           | Service/dependency boundary     | Stop repeatedly calling an unhealthy dependency                             |
| Version pinning           | Deployment configuration        | Prevent an unplanned model change from silently altering behavior           |
| Runbook                   | Operational handoff             | Make response and escalation repeatable                                     |

Architecture-specific risks still need specific controls:

- Agents need turn, tool-call, context, and spend budgets plus explicit stopping evaluation.
- RAG systems need retrieval-quality and freshness monitoring.
- Document pipelines need confidence thresholds and exception routing.
- Orchestrator-worker systems need a trace ID, retry policy, and reconciliation between dispatched and returned work.

## 3. Sizing and feasibility

### Sizing sequence

1. Derive call volume from the business workflow.
2. Estimate input/output distributions and context strategy.
3. Calculate monthly input and output costs separately.
4. Apply caching, tiering, or batch assumptions only where they are valid.
5. Test sensitivity to volume and long-tail growth.

For example, a service with 50,000 monthly requests, a 5,000-token stable system prefix, 300 variable input tokens, a
400-token output, an $800 budget, and a three-second p95 target is likely to depend heavily on prompt caching. That
dependency should be recorded as a load-bearing assumption, not hidden inside a spreadsheet.

### Scoping translation

Translate the engagement in four steps:

1. Business requirement → required capabilities.
2. Capabilities → ownership architecture (Claude, code, system of record, human).
3. Architecture → boundary conditions and proof obligations.
4. Boundary conditions → a scope of work with explicit exclusions and gates.

### Four-property feasibility test

| Property                 | Question                                         | Typical architectural response                              |
| ------------------------ | ------------------------------------------------ | ----------------------------------------------------------- |
| Probabilistic generation | Does the result require an exact value or rule?  | Deterministic verifier, authoritative tool, code-based eval |
| Knowledge boundary       | Is knowledge rare, private, or current?          | RAG for governed/stable knowledge; tools for live state     |
| Finite working memory    | Does the material fit the usable context budget? | Chunking, progressive loading, staged pipeline              |
| Steerability             | Can desired behavior be specified and verified?  | Clear schema, examples, rule checks, calibrated evaluator   |

Return one of three honest verdicts:

- **Feasible as scoped:** the design meets the requirements without a new load-bearing constraint.
- **Feasible with constraints:** name the constraint, its mitigation, and the failure if it does not hold.
- **Not feasible as described:** name the disqualifier and the smallest scope change that could make the case testable.

A report summarizer with a 24-hour SLA is usually feasible. A high-volume email extractor that writes to a system of
record may be feasible with deterministic field validation and a low-confidence human gate. A sub-two-second trading
system dependent on current market data is not defensible until the live-data route and end-to-end latency are proven.

### ROI must compare the same business process

Assess efficiency, workflow transformation, productivity, solution run cost, and performance/SLA. Measure a baseline and
post-deployment result in the same business unit and with the same metric definition. Include human-review cost,
subtract run cost, include build cost in payback, and show sensitivity. Guessed baselines, assumed full automation, and
averages without distributions produce misleading ROI.

## 4. Enterprise integration

### Choose the entry mechanism deliberately

- Use the direct API or an SDK for application inference.
- Use the Agent SDK when the application needs a managed, multi-turn agent loop.
- Use MCP for standardized tool exposure across compatible clients.
- Use Claude Code for developer workflows, not as an unattended application backend.

### Apply constraints in this order

1. Compliance and permitted delivery route.
2. Identity and server-side authentication.
3. Authorization and policy enforcement.
4. Data minimization, PII handling, and retention.
5. Observability, audit, and attribution.

Verify identity outside the model and inject it as trusted application context. Never grant a capability because a user
message claims a role. Authorization must inherit the source system's rules and run before side effects. Use separate
tenant boundaries and, where appropriate, separate API keys for isolation and cost attribution.

Context is not a governance boundary. Retrieve only necessary fields, redact PII before the model and before logs, and
give tools the least privilege needed for the task. A clinical assistant that sends names, dates of birth, identifiers,
and insurance details when it needs only a claim category has failed minimization even if the model behaves perfectly.

### Minimum observability record

Capture enough to reconstruct behavior without creating an uncontrolled data copy:

- request: model/version, prompt version, input tokens, request/trace ID;
- response: output tokens, latency, stop reason, result status;
- context: user/role/tenant/session, retrieval and cache metadata;
- outcome: accepted, rejected, escalated, or failed; and
- dependency/tool spans with authorization and error results.

Govern the log itself with minimization, access controls, retention, and regional requirements.

### Compliance is configuration-specific

Regulated work must use the exact route and configuration covered by the applicable agreement or authorization. Examples
include a BAA-covered eligible configuration for protected health data, an authorized route at the required FedRAMP
impact level, or explicit regional processing and storage for residency. An approved cloud name alone is not proof.

## 5. A/B testing and production observability

Write a falsifiable hypothesis before assigning traffic. It should name the treatment, one primary metric, the minimum
meaningful effect, and secondary constraints such as latency, safety, or cost.

Use stable random assignment by user or session. Calculate sample size from the baseline, minimum detectable effect, and
confidence level; variable LLM outcomes often require more observations than expected. Statistical significance is not
the same as business importance, and a primary-metric gain is invalid if a predeclared guardrail metric becomes
unacceptable.

Use live A/B tests when risk is bounded and traffic is adequate. Prefer shadow testing when harmful outputs are high
impact, traffic is scarce, or regulatory constraints make uncontrolled exposure unacceptable. Balance important input
and seasonal characteristics between groups.

The observability system should provide:

- request-level traces;
- aggregate p50/p95 latency, cost, success, and error metrics;
- anomaly and drift alerts;
- change attribution across prompt, model, data, retrieval, and orchestration;
- a failure taxonomy (prompt, hallucination, model mismatch, orchestrator-worker, dependency); and
- a mapping from technical measures to business KPIs.

A result based on 50 sessions per group, an uncontrolled input mix, and a metric chosen after results were visible is
not credible even when it shows an apparent gain.

## 6. Worked synthesis: consulting RAG assistant

Consider 12,000 documents of 5–80 pages, 800 requests per day, a $3,000 monthly budget, p95 under eight seconds, SSO,
document permissions, and confidential material.

A defensible design would:

- use RAG because the whole corpus cannot be placed in every request;
- evaluate citation structure with code and draft relevance/faithfulness with a calibrated judge on redacted historical
  examples;
- model approximately 24,000 monthly requests with input/output tails and caching for stable prefixes;
- treat retrieval coverage and freshness as load-bearing reliability concerns;
- verify identity server-side and authorize document retrieval against the source system;
- minimize names and sensitive metadata in prompts and logs;
- use a bounded fallback tier and trace every retrieval and generation step; and
- test a predeclared improvement (for example, 70% to 75% task success) without allowing p95 latency or cost to breach
  its guardrail.

The correct feasibility verdict is usually **feasible with constraints** because retrieval quality, authorization, and
production distributions must hold.

## Exam review checklist

- Can I select code, model, or human grading and justify the ladder?
- Can I expose a cost model's load-bearing cache and tail assumptions?
- Can I distinguish feasibility from feasibility-with-constraints?
- Can I place identity, authorization, redaction, and logging outside the model?
- Can I design an A/B test before seeing results?
- Can I trace a production symptom to a measurable architecture component?
