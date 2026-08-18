# Practice Exam: Production Engineering, Evals & Security

Private, independently written knowledge check for Module 4. It tests the accompanying
[study notes](production-engineering-evals-security.md) without copying course checkpoints.

## Instructions

- Suggested time: 60 minutes; first attempt closed-notes.
- Part A: 30 multiple-choice questions × 1 point.
- Part B: 5 scenarios × 4 points.
- Maximum: 50 points.

| Score    | Interpretation                             |
| -------- | ------------------------------------------ |
| 45–50    | Strong production engineering command      |
| 38–44    | Good; review missed controls               |
| 30–37    | Developing; repeat weak sections           |
| Below 30 | Revisit the chapter before another attempt |

## Part A: Multiple choice

1. When should success criteria be defined? A. After launch B. Before implementation hardens C. After the first incident
   D. Only during procurement
2. Best grader for required JSON fields and ranges? A. Code B. Uncalibrated judge C. Visual review D. Temperature
3. Best grader for nuanced empathy and faithfulness? A. Exact string B. Calibrated model judge/human rubric C. Regex
   only D. HTTP status
4. Why calibrate an LLM judge? A. Remove the dataset B. Verify agreement with human-labeled standards C. Make it
   deterministic D. Eliminate all cost
5. Which dataset is strongest? A. Twelve happy paths B. Representative, edge, adversarial, and multi-condition cases C.
   One production success D. Generated labels without review
6. Why change one variable per eval run? A. Lower tokens B. Preserve causal attribution C. Disable tools D. Increase
   context
7. A retriever returns dictionaries while the prompt builder expects text. Which test catches it best? A. Unit tests on
   each component B. Integration test at the seam C. Model snapshot D. UI screenshot
8. Which test proves the whole user flow but localizes poorly? A. Unit B. End-to-end C. Code grader D. Token count
9. What makes traces valuable? A. They guarantee quality B. They show which step, version, and timing produced failure
   C. They replace tests D. They authorize tools
10. A one-fact query against a stable corpus should normally use: A. Multi-agent research B. Fetch once C. No source D.
    Recursive writes
11. Which failure is normally retriable? A. Invalid schema B. Rate limit/overload C. Forbidden permission D. Missing
    resource
12. Which failure is normally terminal until the request/config changes? A. Transient overload B. Invalid request C.
    Network reset D. Server timeout
13. Correct retry design? A. Immediate infinite loop B. Honor retry-after or capped exponential backoff with jitter and
    a budget C. Retry every error D. Nested unbounded SDK/app retries
14. A tool reports an internal error. What should the model receive? A. Empty result B. Matching error-marked tool
    result C. Nothing D. A new tool ID
15. An HTTP-200 response has a refusal stop reason. Best behavior? A. Retry as overload B. Treat as refusal, log, and
    use policy fallback C. Execute anyway D. Increase temperature
16. When should a cheaper model replace the current tier? A. Price alone B. Eval proves quality bar still holds C. New
    alias exists D. Output is short
17. Mixed simple and difficult traffic may justify: A. Largest model for all B. Cheap/balanced default plus evaluated
    override C. Random model D. No eval
18. Which per-call metrics are foundational? A. Tokens/cost, latency, and error/retry outcome B. Only monthly invoice C.
    Only final prose D. Browser size
19. What does streaming improve most directly? A. Total intelligence B. Perceived latency/time-to-first-token C. Token
    price D. Context capacity
20. Prompt caching is useful when: A. Prefix changes each request B. Long identical prefix recurs within TTL C. Content
    is tiny and unique D. Live state sits before breakpoint
21. Which job fits Message Batches? A. Immediate tool decision B. Non-urgent independent backfill C. Interactive
    approval D. Partial JSON execution
22. When does orchestrator-worker earn its extra cost? A. Any task B. Broad task with independent parallel parts C.
    Tightly dependent reasoning D. One lookup
23. What must a multi-agent budget cap? A. Only planner prompt B. Workers, calls/tokens, time, and aggregate spend C.
    Only output style D. Nothing
24. Why is trusted-user status insufficient against prompt injection? A. Models distrust all users B. Hostile
    instructions can arrive in fetched content C. OAuth fails D. Logs are prompts
25. Are XML delimiters a hard security boundary? A. Yes B. No; they are helpful but probabilistic text guidance C. Only
    in PDFs D. Only with caching
26. Which control still limits damage if the model is successfully steered? A. More emphatic prompt B. Least-privilege
    identity and pre-action authorization C. Larger context D. Alias pinning
27. Where must a protected write be blocked? A. After execution B. In a pre-action hook/service authorization layer C.
    In final prose D. In a summary
28. Why protect permission configuration? A. It changes formatting B. Anyone who can widen it can act with the agent's
    authority C. It reduces latency D. It is an eval
29. A secret was committed. Correct response? A. Delete current line only B. Rotate/revoke and move to managed injection
    C. Base64 encode it D. Cache it
30. What should regulated scoping verify? A. Model name only B. Data processing region, access/audit, managed policy,
    and exact service eligibility C. Prompt length only D. User trust

## Part B: Scenarios

31. **Eval design.** A support agent must return valid typed JSON, cite supplied policy, and sound empathetic. Select
    graders, dataset categories, calibration, and release threshold.
32. **Failure path.** A tool loop encounters a rate limit, then a tool-specific 404, and sometimes a policy refusal.
    Define distinct handling and user behavior.
33. **Cost incident.** A research flow's bill triples. Design per-call instrumentation, diagnosis order, and two
    architecture levers; state when multi-agent fan-out remains justified.
34. **Injection defense.** An internal employee asks an agent to summarize a webpage containing a hidden write command.
    Define the trust model and four layered controls.
35. **Production gate.** A candidate cheaper model scores better overall but worse on rare high-impact cases. Decide how
    to evaluate, route/promote, observe, and roll back.

## Answer sheet

`1 __ 2 __ 3 __ 4 __ 5 __ 6 __ 7 __ 8 __ 9 __ 10 __`

`11 __ 12 __ 13 __ 14 __ 15 __ 16 __ 17 __ 18 __ 19 __ 20 __`

`21 __ 22 __ 23 __ 24 __ 25 __ 26 __ 27 __ 28 __ 29 __ 30 __`

<details>
<summary>Part A answer key and rationales</summary>

| Q   | A   | Rationale                                                             |
| --- | --- | --------------------------------------------------------------------- |
| 1   | B   | Acceptance criteria belong before implementation choices harden.      |
| 2   | A   | Deterministic structure is code-gradable.                             |
| 3   | B   | Open quality requires calibrated judgment.                            |
| 4   | B   | Calibration checks alignment with the intended human standard.        |
| 5   | B   | Coverage must include the distribution and its dangerous edges.       |
| 6   | B   | One change keeps score movement interpretable.                        |
| 7   | B   | The defect exists at the handoff.                                     |
| 8   | B   | E2E covers the flow while hiding localization.                        |
| 9   | B   | Traces connect outcome to a particular step and version.              |
| 10  | B   | One retrieval is the simplest sufficient route.                       |
| 11  | B   | Waiting can resolve throttling/overload.                              |
| 12  | B   | The same invalid request will fail again.                             |
| 13  | B   | Bounded backoff avoids amplifying outages.                            |
| 14  | B   | Explicit error results preserve protocol and meaning.                 |
| 15  | B   | Refusal is policy behavior, not a transient server failure.           |
| 16  | B   | Quality evidence—not unit price—licenses the downgrade.               |
| 17  | B   | Routing can reserve capability for difficult cases.                   |
| 18  | A   | Per-call attribution explains spend and reliability.                  |
| 19  | B   | Streaming changes delivery timing, not capability.                    |
| 20  | B   | Reuse within TTL makes cache reads economical.                        |
| 21  | B   | Batches fit delayed independent work.                                 |
| 22  | B   | Independent decomposition can repay fan-out.                          |
| 23  | B   | Aggregate budgets bound multiplicative behavior.                      |
| 24  | B   | The page, not the employee, carries the hostile instruction.          |
| 25  | B   | Delimiters remain part of the same model context.                     |
| 26  | B   | Hard authority boundaries contain a steered model.                    |
| 27  | B   | Enforcement must precede the side effect.                             |
| 28  | B   | Permission configuration controls blast radius.                       |
| 29  | B   | History preserves exposure; revocation is necessary.                  |
| 30  | B   | Regulated review depends on exact processing and control commitments. |

</details>

<details>
<summary>Part B scoring rubrics</summary>

Award one point for each element.

31. Code grader for typed schema; grounded-citation/code or source check; calibrated judge/human rubric for empathy;
    representative/edge/adversarial cases and per-category threshold, not aggregate only.
32. Rate limit gets retry-after/backoff/jitter/budget; tool 404 is explicit error result and terminal/fallback unless
    resource may change; refusal is logged policy outcome without retry; named safe user message/fallback for each.
33. Log tokens/cost, latency, retries/errors per step/request type; sort trace to find dominant step; trim context/tool
    calls or route/cache/batch; retain fan-out only for independent parallel decomposition with total budget.
34. Treat retrieved page as untrusted despite internal user; delimit/label as data; least-privilege identity/secret
    isolation; pre-write authorization/hook plus audit and human approval for consequential writes.
35. Keep high-impact cases as separate release gate; reject blanket downgrade or route only safe evaluated segment;
    canary with per-category metrics/traces; pin versions and retain immediate rollback.

</details>

## Review log

| Attempt | Date | Score | Weak topics | Next action |
| ------- | ---- | ----: | ----------- | ----------- |
| 1       |      |       |             |             |
