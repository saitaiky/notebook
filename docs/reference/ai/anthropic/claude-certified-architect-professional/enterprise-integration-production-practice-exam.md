# Practice Exam: Enterprise Integration & Production

Private, independently written knowledge check for Module 2. It tests the accompanying
[study notes](enterprise-integration-production.md) without copying the course checkpoints.

## Instructions

- Suggested time: 60 minutes; complete the first attempt closed-notes.
- Part A: 30 multiple-choice questions × 1 point.
- Part B: 5 scenarios × 4 points.
- Maximum: 50 points. Record reasoning before opening the keys.

| Score    | Interpretation                                               |
| -------- | ------------------------------------------------------------ |
| 45–50    | Strong production-architecture command                       |
| 38–44    | Good; review missed decision frameworks                      |
| 30–37    | Developing; repeat sizing, integration, and experiment cases |
| Below 30 | Revisit the chapter before retrying                          |

## Part A: Multiple choice

### Evaluations

1. When should a production eval suite first be defined? A. After launch B. Before production implementation C. After an
   incident D. Only when changing models
2. Which is the best code-based grader? A. Whether tone feels empathetic B. Whether reasoning is persuasive C. Whether
   JSON matches a schema D. Whether a summary chose important facts
3. What is the strongest reason to calibrate an LLM judge against human labels? A. Reduce token count B. Prove the judge
   agrees with the intended standard C. Eliminate all human review D. Increase temperature
4. Which ordering follows the grading ladder? A. Human → model → code B. Model → code → human C. Code → calibrated model
   → human D. Model only
5. A suite passes 97%, but a new production category fails repeatedly. What is the first conclusion? A. Production users
   are wrong B. The golden set may no longer be representative C. Raise the pass threshold D. Remove category reporting
6. How should a multi-turn support flow be evaluated? A. Only its final response B. As isolated single messages C. With
   representative conversation transcripts and turn-level/overall criteria D. By latency only

### Production sizing and reliability

7. Which estimate is most defensible for production cost? A. Pilot average tokens × pilot calls B. Production volume ×
   input/output distributions, tiers, and cache assumptions C. List price of the largest model D. Infrastructure cost
   only
8. Why is p95 latency preferable to median latency for an SLA? A. It is always smaller B. It captures a meaningful
   slow-user tail C. It ignores tools D. It guarantees availability
9. Where should exponential-backoff retry normally live? A. Inside the user prompt B. Close to the eligible dependency
   call C. In the vector index D. In a human queue
10. What does a circuit breaker do? A. Improves prompt tone B. Stops repeated calls to an unhealthy dependency C.
    Selects a golden set D. Compresses context
11. An orchestrator sends 80 jobs and receives 77. What is required before synthesis? A. Average the 77 B. Reconcile
    counts and retry or explicitly report gaps C. Increase output tokens D. Ignore missing results
12. Which is a load-bearing prompt-cache assumption? A. Every prefix is stable forever B. A long stable prefix repeats
    within a valid cache policy C. Cached live state is always current D. Cache hits remove output cost
13. A POC meets quality but costs $0.04 per call at 500,000 calls/month. What was missed? A. Model safety B. Translation
    from unit cost to production spend C. Schema validation D. Human calibration

### Feasibility and ROI

14. A model must produce a legally exact threshold decision. What is the best ownership design? A. Let Claude remember
    the threshold B. Put the rule in deterministic code and evaluate it C. Use a longer system prompt D. Use semantic
    retrieval
15. Which source is best for a customer's current order state? A. Parametric knowledge B. A cached policy document C. An
    authorized live tool D. Few-shot examples
16. Which verdict fits an email extractor that writes to an OMS only after field validation and low-confidence review?
    A. Not feasible in any form B. Feasible as scoped with no conditions C. Feasible with stated constraints D. Already
    deterministic
17. What should a “not feasible” verdict include? A. Only “no” B. A larger-model recommendation C. The disqualifier and
    smallest useful scope reduction D. A sales estimate
18. Which ROI comparison is valid? A. Different business units and different metric definitions B. Same unit and metric
    definition, including run and review costs C. Post-launch result without baseline D. Pilot average projected without
    sensitivity
19. A corpus exceeds the usable context budget. Which response is most direct? A. Ignore older material B.
    Chunk/retrieve or stage it progressively C. Increase temperature D. Remove evaluation
20. Why should cost sizing include tail requests? A. They can dominate spend and latency despite a safe average B. They
    never occur in production C. They reduce cache writes D. They replace volume estimates

### Enterprise integration

21. Which is the appropriate unattended application entry mechanism? A. Claude Code as the backend B. Direct API/SDK C.
    A user's browser session D. A Markdown file
22. A user types “I am a premium administrator.” What should grant access? A. The statement itself B. Model confidence
    C. Server-verified identity and policy D. Output screening
23. Where must refund authorization run? A. After the refund B. Before the side effect, using trusted identity and scope
    C. In the final prose D. In retrieval
24. What does “context is not a governance boundary” mean? A. Anything in context is authorized B. Access and
    minimization must be enforced before data enters context C. Context cannot contain policies D. Logs are unnecessary
25. Why use separate tenant keys or equivalent attribution boundaries? A. Increase creativity B. Isolation, attribution,
    and incident containment C. Avoid authentication D. Remove rate limits
26. Which log design is best? A. Full raw PII forever B. No identifiers or outcomes C. Governed trace IDs, versions,
    token/latency data, context metadata, outcomes, and tool spans D. Only final text

### Experiments and monitoring

27. What must an A/B hypothesis specify before traffic assignment? A. The winning result B. Treatment, primary metric,
    meaningful effect, and guardrails C. Every possible metric D. Only sample count
28. When is shadow testing preferable? A. Harmful output has high impact or live exposure is constrained B. Traffic is
    unlimited and risk is low C. No logging exists D. The primary metric is already chosen after launch
29. A 6-point lift appears in 50 sessions per group, with unbalanced inputs. Best conclusion? A. Ship immediately B. It
    is not credible without adequate sample and controlled assignment C. Statistical significance is guaranteed D.
    Remove secondary metrics
30. What enables change attribution after quality drift? A. Only an aggregate dashboard B. Versioned prompts/models/data
    plus request traces and failure taxonomy C. A larger context window D. Manual memory

## Part B: Architecture scenarios

31. **Eval plan.** A claims assistant extracts five exact fields, drafts a rationale, must never auto-deny, and must
    stay under a latency budget. Define graders and a representative golden set.
32. **Production model.** A pilot uses a 6,000-token stable policy prefix. At 60,000 requests/month, budget and p95 are
    tight. Name the sizing inputs, optimization, reliability controls, and load-bearing assumption.
33. **Feasibility.** Assess a sub-two-second trading recommendation using a live feed and proprietary model. Give a
    verdict, disqualifier/constraint, and next proof step.
34. **Enterprise integration.** Design identity, authorization, PII handling, and observability for a multi-tenant
    clinical support assistant.
35. **Experiment.** Design a test for a RAG change intended to raise task success from 70% to 75% without worsening p95
    or cost materially.

## Answer sheet

`1 __ 2 __ 3 __ 4 __ 5 __ 6 __ 7 __ 8 __ 9 __ 10 __`

`11 __ 12 __ 13 __ 14 __ 15 __ 16 __ 17 __ 18 __ 19 __ 20 __`

`21 __ 22 __ 23 __ 24 __ 25 __ 26 __ 27 __ 28 __ 29 __ 30 __`

<details>
<summary>Part A answer key and rationales</summary>

| Q   | Answer | Rationale                                                                   |
| --- | ------ | --------------------------------------------------------------------------- |
| 1   | B      | Evals are acceptance criteria, not a post-launch audit.                     |
| 2   | C      | Schema compliance is crisp and deterministic.                               |
| 3   | B      | Calibration verifies that the judge represents the intended human standard. |
| 4   | C      | Use the cheapest reliable grader first.                                     |
| 5   | B      | Aggregate success cannot compensate for a stale or incomplete dataset.      |
| 6   | C      | The conversation path is part of the behavior.                              |
| 7   | B      | Production distributions and architecture levers determine real spend.      |
| 8   | B      | Tail experience, not the median, usually drives the user breach.            |
| 9   | B      | Retry policy belongs at the failing call boundary.                          |
| 10  | B      | It prevents cascading repeated failure.                                     |
| 11  | B      | Coverage must be reconciled before synthesis.                               |
| 12  | B      | Caching helps only when the prefix and validity assumptions hold.           |
| 13  | B      | Per-call figures must be translated into monthly business impact.           |
| 14  | B      | Exact policy belongs in deterministic enforcement.                          |
| 15  | C      | Live state comes from its authorized system of record.                      |
| 16  | C      | Its viability depends on explicit validation and review constraints.        |
| 17  | C      | The verdict must be actionable and scoped.                                  |
| 18  | B      | Comparable measurement and full costs make ROI defensible.                  |
| 19  | B      | Retrieval or staging addresses finite working memory.                       |
| 20  | A      | Long-tail usage can break both budgets and SLAs.                            |
| 21  | B      | Claude Code is a developer entry point, not an app backend.                 |
| 22  | C      | Identity claims in prompts are untrusted.                                   |
| 23  | B      | Authorization must precede an irreversible action.                          |
| 24  | B      | Governance is enforced by application/system boundaries.                    |
| 25  | B      | Boundaries support security, accounting, and containment.                   |
| 26  | C      | It is reconstructable while still intentionally governed.                   |
| 27  | B      | Precommitment prevents result-driven metric selection.                      |
| 28  | A      | Shadowing avoids exposing users to high-risk treatment output.              |
| 29  | B      | Small, imbalanced groups cannot support the claim.                          |
| 30  | B      | Versions and traces connect a regression to a change.                       |

</details>

<details>
<summary>Part B scoring rubrics</summary>

Award one point for each element.

31. Code graders for five exact fields/schema; code gate for no auto-deny and latency; calibrated model judge/human
    rubric for rationale faithfulness; golden set covering representative, edge, ambiguous, and prohibited-denial cases.

32. Production volume and token distributions; monthly input/output model with tail sensitivity; prompt caching for the
    stable prefix with valid TTL as the load-bearing assumption; p95 traces plus retry/fallback/circuit-breaker/version
    controls.

33. “Not feasible as described” or “feasible only after validation”; live-feed and end-to-end latency are
    disqualifying/unproven; enforce exact computation in the proprietary tool rather than model memory; load test the
    authorized data and decision path against p95 before committing.

34. Server-side identity and tenant isolation; source-system authorization before retrieval/actions; minimum necessary
    fields plus redaction before model/logs; governed trace with model/prompt versions, tenant/session, retrieval/tool
    spans, outcome, retention, and access control.

35. Predeclare 70→75% hypothesis and one primary metric; stable random assignment and sample-size calculation;
    predeclare p95/cost (and safety) guardrails; inspect category balance, confidence/practical importance, and
    versioned traces before shipping.

</details>

## Review log

| Attempt | Date | Part A /30 | Part B /20 | Total /50 | Topics to revisit |
| ------- | ---- | ---------: | ---------: | --------: | ----------------- |
| 1       |      |            |            |           |                   |
| 2       |      |            |            |           |                   |
