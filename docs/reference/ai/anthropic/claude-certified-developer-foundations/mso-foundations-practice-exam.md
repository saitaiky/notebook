# Practice Exam: MSO Foundations

Private, independently written knowledge check for Module 1. It tests the accompanying [study notes](mso-foundations.md)
without copying course checkpoints.

## Instructions

- Suggested time: 60 minutes; first attempt closed-notes.
- Part A: 30 multiple-choice questions × 1 point.
- Part B: 5 scenarios × 4 points.
- Maximum: 50 points. Record reasoning before opening the keys.

| Score    | Interpretation                             |
| -------- | ------------------------------------------ |
| 45–50    | Strong command of the foundations          |
| 38–44    | Good; review missed decision rules         |
| 30–37    | Developing; repeat weak sections           |
| Below 30 | Revisit the chapter before another attempt |

## Part A: Multiple choice

1. Which content counts toward a request's context budget? A. Only the latest user message B. Input plus system,
   history, tools/results, and generated output C. Output only D. Only billable text blocks
2. An input alone exceeds the model's context window. What normally happens? A. Old turns are silently removed B. The
   request is rejected before generation C. Output is streamed anyway D. Temperature is reduced
3. Input fits, but generation reaches the remaining context ceiling. What should the application expect? A. Guaranteed
   complete prose B. A partial response with a stop condition C. Automatic second request D. Free extra tokens
4. What is the safest test for a generative response? A. Exact paragraph equality B. Required properties and schema C.
   Word-for-word snapshot D. Fixed punctuation
5. Lower temperature primarily does what? A. Guarantees determinism B. Concentrates sampling and usually improves
   repeatability C. Expands context D. Selects a larger model
6. Why can two temperature-zero calls still differ? A. The API ignores all inputs B. Repeatability is not a contractual
   guarantee C. Tokens are words D. SDKs add randomness
7. What is the recommended starting point for model choice? A. Always the largest tier B. The balanced tier, then move
   based on evals C. The cheapest tier without testing D. Random routing
8. When should a team move to a more capable tier? A. When its name is newer B. When an eval shows the current tier
   misses the bar and the error matters C. For every production call D. When output is streamed
9. What relationship is correct? A. Model tier and reasoning effort are the same control B. Reasoning effort is separate
   from model selection C. Smaller models become larger models with effort D. Reasoning removes token cost
10. Which task most plausibly benefits from extra reasoning? A. Extracting one supplied ID B. Planning a dependent
    multi-file refactor C. Returning a stored date D. Routing by one fixed keyword
11. Why avoid extended reasoning on simple extraction? A. It disables JSON B. It can add cost and latency without a
    measured quality gain C. It changes HTTP D. It forbids tools
12. What is zero-shot prompting? A. No instructions B. Instructions without examples C. One example D. Model training
13. A model understands the task but invents a different JSON layout. What is the smallest useful addition? A. A
    relevant example or explicit schema B. Ten pages of background C. Higher temperature D. A batch
14. Few-shot examples are best described as: A. Permanent fine-tuning B. Request context demonstrating behavior C. Free
    metadata D. A replacement for evaluation
15. Why use the fewest examples that pass the eval? A. Examples weaken all models B. Examples consume context and input
    cost C. APIs allow only one D. They prevent streaming
16. What does an official SDK add over raw REST? A. A different underlying model B. Transport/authentication,
    serialization, parsing, and retry conveniences C. Unlimited context D. Deterministic output
17. When is raw HTTP reasonable? A. Never B. When complete transport control or unsupported integration needs justify
    owning the mechanics C. Only for batches D. To avoid authentication
18. A synchronous call normally: A. Returns before completion B. Blocks the caller until completion/error C. Runs 1,000
    calls in parallel D. Ignores timeouts
19. An async client is most useful for: A. Overlapping independent I/O-bound calls B. Making dependent calls
    simultaneous C. Eliminating rate limits D. Making results ordered
20. What must still constrain async concurrency? A. Nothing B. Rate limits, timeouts, cancellation, and resource bounds
    C. Only temperature D. Markdown
21. Streaming primarily improves: A. Model intelligence B. Perceived latency/time to first token C. Context capacity D.
    Batch discounts
22. When is a streamed assistant turn safe to commit to history? A. After the first delta B. After confirmed message
    completion and stop metadata C. When the socket pauses D. Before block start
23. A stream disconnects midway. What is the safest default? A. Store the fragment as complete B. Retry from the last
    complete conversation state C. Execute partial JSON D. Guess the missing stop reason
24. What transport carries Messages streaming events? A. FTP B. Server-sent events C. SMTP D. Git
25. Which workload best fits Message Batches? A. Interactive tool loop B. Overnight classification of independent rows
    C. Live autocomplete D. A dependent three-step chat
26. Why assign a `custom_id` to each batch request? A. To raise temperature B. Results may return out of submission
    order C. To expand context D. To encrypt prompts
27. What is the defining trade-off of Message Batches? A. Lower latency for higher cost B. Asynchronous completion for
    cost-efficient non-urgent scale C. Determinism for no output D. Unlimited tools
28. Fifty thousand independent jobs must finish overnight. Best mechanism? A. One giant context B. Message Batches with
    stable IDs C. One synchronous loop without retries D. Streaming to a browser
29. Ten independent user requests must remain interactive. Best starting mechanism? A. Async calls with bounded
    concurrency B. An offline batch C. One prompt concatenating all users D. A fixed thinking budget
30. What should a near-limit application do before sending? A. Assume silent truncation B. Count/estimate tokens and
    reserve output headroom C. Remove stop handling D. Increase temperature

## Part B: Scenarios

31. **Context incident.** A support chat sends its complete lifetime history and occasionally returns half an answer.
    Diagnose the two context risks and define an admission/retention policy.
32. **Model decision.** A high-volume classifier passes on the balanced tier. A faster tier is cheaper but untested.
    Give the promotion decision and evidence required.
33. **Prompt intervention.** An extractor gets the facts right but changes field names across calls. Choose the smallest
    prompt/API intervention and define a robust test.
34. **Streaming client.** Design the state transitions for a UI that streams text and stores conversation history.
35. **Workload routing.** Place (a) live chat replies, (b) 200 independent concurrent enrichments, and (c) a nightly
    million-row classification into sync/streaming, async, or batch mechanisms with one constraint each.

## Answer sheet

`1 __ 2 __ 3 __ 4 __ 5 __ 6 __ 7 __ 8 __ 9 __ 10 __`

`11 __ 12 __ 13 __ 14 __ 15 __ 16 __ 17 __ 18 __ 19 __ 20 __`

`21 __ 22 __ 23 __ 24 __ 25 __ 26 __ 27 __ 28 __ 29 __ 30 __`

<details>
<summary>Part A answer key and rationales</summary>

| Q   | A   | Rationale                                                           |
| --- | --- | ------------------------------------------------------------------- |
| 1   | B   | The complete request and generated output share the context budget. |
| 2   | B   | Oversized input is rejected rather than silently rewritten.         |
| 3   | B   | Output can stop when no context headroom remains.                   |
| 4   | B   | Behavioral properties tolerate legitimate generative variation.     |
| 5   | B   | Lower temperature narrows sampling; it does not guarantee identity. |
| 6   | B   | Generative services are not contractually deterministic.            |
| 7   | B   | Start balanced and let evaluations justify movement.                |
| 8   | B   | A measured quality gap and consequence justify higher cost.         |
| 9   | B   | Capability tier and reasoning allocation are independent levers.    |
| 10  | B   | Dependent planning is the complex case.                             |
| 11  | B   | Extra reasoning must earn its cost and latency.                     |
| 12  | B   | Zero-shot means no demonstrations, not no instructions.             |
| 13  | A   | Add the missing output constraint/example.                          |
| 14  | B   | Examples are contextual demonstrations, not training.               |
| 15  | B   | Every example consumes request budget unless validly cached.        |
| 16  | B   | SDKs package transport mechanics around the same API.               |
| 17  | B   | Raw HTTP trades convenience for explicit control.                   |
| 18  | B   | Synchronous execution blocks pending completion.                    |
| 19  | A   | Async overlaps independent waiting work.                            |
| 20  | B   | Concurrency still requires operational limits.                      |
| 21  | B   | Streaming changes when output becomes visible.                      |
| 22  | B   | Only a terminal message event establishes completion.               |
| 23  | B   | Retry from known-good history, not a provisional fragment.          |
| 24  | B   | Messages streaming uses SSE.                                        |
| 25  | B   | Independent, non-urgent volume fits batches.                        |
| 26  | B   | IDs correlate arbitrarily ordered results.                          |
| 27  | B   | Batches exchange immediacy for efficient scale.                     |
| 28  | B   | This is the canonical offline-batch workload.                       |
| 29  | A   | Bounded async preserves interactivity across independent calls.     |
| 30  | B   | Preflight counting prevents admission without output space.         |

</details>

<details>
<summary>Part B scoring rubrics</summary>

Award one point for each element.

31. Counts full input and reserves output; detects both preflight rejection and mid-generation stop; defines compaction,
    retrieval, pruning, or new-session policy; stores only complete turns and exposes recovery behavior.
32. Do not move solely on price; run a representative eval on the faster tier; require the same quality threshold with
    edge cases; include latency/cost/error impact in the decision.
33. Use structured output/schema or one canonical example; specify exact fields/types; test parsing/schema properties;
    avoid exact prose snapshots and retest edge inputs.
34. Provisional UI buffer; assemble deltas and metadata; commit only after message stop; on interruption discard/retry
    from last complete state and show a recoverable user status.
35. Stream live chat for time-to-first-token; bounded async for independent interactive enrichments; Message Batches
    with `custom_id` for nightly rows; mention rate limits, completion correlation, and timeout/retry policy.

</details>

## Review log

| Attempt | Date | Score | Weak topics | Next action |
| ------- | ---- | ----: | ----------- | ----------- |
| 1       |      |       |             |             |
