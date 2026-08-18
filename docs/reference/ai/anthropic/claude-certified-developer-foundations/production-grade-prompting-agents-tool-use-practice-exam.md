# Practice Exam: Production-Grade Prompting, Agents & Tool Use

Private, independently written knowledge check for Module 2. It tests the accompanying
[study notes](production-grade-prompting-agents-tool-use.md) without copying course checkpoints.

## Instructions

- Suggested time: 60 minutes; first attempt closed-notes.
- Part A: 30 multiple-choice questions × 1 point.
- Part B: 5 scenarios × 4 points.
- Maximum: 50 points.

| Score    | Interpretation                             |
| -------- | ------------------------------------------ |
| 45–50    | Strong production prompting/agent command  |
| 38–44    | Good; review missed protocol decisions     |
| 30–37    | Developing; repeat weak sections           |
| Below 30 | Revisit the chapter before another attempt |

## Part A: Multiple choice

1. Output facts are correct but field names vary. Best first fix? A. Longer biography B. Structured output contract C.
   Higher temperature D. More tools
2. Tone drifts across a long conversation. Best home for the stable role? A. Tool result B. System instruction C. Batch
   ID D. Image metadata
3. What do XML-style tags provide? A. Cryptographic isolation B. Semantic organization of instructions and data C.
   Authorization D. Infinite context
4. Why can an overlong prompt reduce reliability? A. Tokens become invalid B. Important constraints can be diluted or
   conflict while cost rises C. SDKs reject prose D. It disables tools
5. A known edge format fails while normal cases pass. Smallest intervention? A. One explicit constraint/example for the
   edge B. Rewrite the product C. Add five agents D. Remove the schema
6. What should determine use of extra reasoning? A. Every request uses it B. Measured gain on difficult multi-step cases
   C. User message length alone D. Streaming availability
7. In a reasoning-enabled tool loop, signed thinking blocks should be: A. Removed B. Returned unchanged C. Rewritten as
   user text D. Stored as tool schemas
8. What most often causes a wrong-tool choice? A. Too little output budget B. Overlapping tool descriptions C. SSE D.
   Async clients
9. Two tools overlap heavily. Best fix? A. Add exclusions to both or merge behind a clear discriminator B. Rename both
   `tool` C. Hide schemas D. Increase temperature
10. Which fields should be required in a tool schema? A. Every conceivable field B. Only inputs essential to execute
    safely/correctly C. None D. Output prose
11. After a `tool_use`, the next request must include: A. A matching `tool_result` in the next user turn B. A new system
    prompt C. Only final text D. A batch
12. What history must be preserved before returning a tool result? A. Only the tool name B. The complete assistant
    content array and matching ID C. Only thinking D. No assistant turn
13. A tool fails. Safest result? A. Empty success B. Matching result explicitly marked as an error C. Delete the call D.
    Change its ID
14. When may independent tool calls run in parallel? A. When neither needs the other's result B. Always C. Never D. Only
    in batches
15. Two tool calls have a data dependency. What ordering is correct? A. Parallel B. Sequential C. Random D. Batch-only
16. A streamed `input_json_delta` arrives. When can the tool execute? A. On its first byte B. After the containing block
    is complete and JSON parses C. After message start D. Before validation
17. A stream disconnects after partial tool arguments. Best response? A. Run them B. Discard provisional turn and retry
    from last complete state C. Guess missing JSON D. Commit the fragment
18. Which event establishes a complete assistant message? A. First delta B. Message stop C. TCP read pause D. Block
    start
19. What does compaction preserve? A. Every detail B. A reduced summary, losing details not represented C. Nothing D.
    Tool permissions
20. Which context strategy loses the whole current session state? A. Clearing/new session B. Cache read C. Token count
    D. Output schema
21. What invalidates a prompt-cache hit before a breakpoint? A. Exact repetition B. Any prefix change C. More reads D.
    Stable tool schemas
22. Which content is the best cache candidate? A. Live account balance B. Long stable system prompt/tool schema C.
    Current timestamp D. Unique user input
23. Where can RAG fail? A. Only embeddings B. Chunking, matching, or prompt assembly C. Only HTTP D. Only generation
24. Simple lookup in a stable corpus usually needs: A. Agentic multi-round search B. Indexed fetch once C. Five
    subagents D. A write tool
25. When is an agent preferable to a workflow? A. Exact steps are known B. Goal/tools are known but the path is not C.
    Variance must be zero D. No budget exists
26. What must every production agent have? A. Unlimited iterations B. Stop, iteration/time/tool/spend limits C. Bypass
    permissions D. A single huge prompt
27. Where should human approval sit for an irreversible write? A. After execution B. Immediately before the side effect
    C. In the model's memory D. Only in documentation
28. Which memory persists across sessions? A. Current context only B. Authorized external storage C. Streaming buffer D.
    Temperature
29. Why might summarized memory be unsafe for exact commitments? A. It costs no tokens B. Omitted details are lost C. It
    is always encrypted D. It creates tools
30. Why are batches inappropriate inside a synchronous agent loop? A. They return too quickly B. The next step depends
    on an immediate result while batches complete asynchronously C. They cannot contain text D. They force high
    temperature

## Part B: Scenarios

31. **Prompt debug.** A claims extractor returns valid prose but downstream code requires five typed fields; adding six
    paragraphs did not help. Specify the minimal repair and evaluation.
32. **Tool protocol.** Claude requests two independent reads and then a write that depends on both. Describe execution,
    history blocks, IDs, failure representation, and approval.
33. **Interrupted stream.** A client appends each delta directly to conversation history and executes tool JSON as it
    arrives. Redesign it.
34. **Context growth.** A research agent's tool results consume the window after 20 steps. Choose pruning/compaction,
    caching, retrieval, and budget controls, naming what information may be lost.
35. **Architecture choice.** Compare a fixed three-step refund review with open-ended market research. Assign workflow
    or agent, retrieval style, memory, and stop controls.

## Answer sheet

`1 __ 2 __ 3 __ 4 __ 5 __ 6 __ 7 __ 8 __ 9 __ 10 __`

`11 __ 12 __ 13 __ 14 __ 15 __ 16 __ 17 __ 18 __ 19 __ 20 __`

`21 __ 22 __ 23 __ 24 __ 25 __ 26 __ 27 __ 28 __ 29 __ 30 __`

<details>
<summary>Part A answer key and rationales</summary>

| Q   | A   | Rationale                                                     |
| --- | --- | ------------------------------------------------------------- |
| 1   | B   | Enforce the downstream shape directly.                        |
| 2   | B   | Stable role/scope belongs in the system layer.                |
| 3   | B   | Tags organize; they do not authorize or isolate.              |
| 4   | B   | More tokens can bury or contradict the operative rule.        |
| 5   | A   | Add only the missing edge constraint.                         |
| 6   | B   | Reasoning is justified by evaluated benefit.                  |
| 7   | B   | Signed protocol blocks must return unchanged.                 |
| 8   | B   | Ambiguous responsibility produces ambiguous selection.        |
| 9   | A   | Make selection criteria mutually distinguishable.             |
| 10  | B   | Excess required fields increase invalid calls.                |
| 11  | A   | The tool-use/result adjacency and ID are protocol invariants. |
| 12  | B   | Full assistant state is required for a valid continuation.    |
| 13  | B   | Explicit error state enables correct recovery.                |
| 14  | A   | Independence permits concurrency.                             |
| 15  | B   | Dependencies require ordered execution.                       |
| 16  | B   | Partial JSON is neither complete nor safe.                    |
| 17  | B   | Resume from known-good conversation state.                    |
| 18  | B   | Message stop is the completion signal.                        |
| 19  | B   | Summary fidelity is intentionally lossy.                      |
| 20  | A   | A new session discards session context.                       |
| 21  | B   | Cache matching depends on an identical prefix.                |
| 22  | B   | Stable repeated prefixes create useful cache reads.           |
| 23  | B   | All three retrieval stages can be the defect.                 |
| 24  | B   | One fetch is cheaper and simpler for a fact lookup.           |
| 25  | B   | Agents choose a path dynamically toward a goal.               |
| 26  | B   | Hard budgets bound runaway behavior.                          |
| 27  | B   | Approval must precede the consequential action.               |
| 28  | B   | External memory is durable beyond one context.                |
| 29  | B   | Summaries cannot preserve facts they omit.                    |
| 30  | B   | An interactive dependency cannot wait for offline completion. |

</details>

<details>
<summary>Part B scoring rubrics</summary>

Award one point for each element.

31. Exact schema/structured output; required types and missing-data behavior; representative plus edge eval cases; code
    grader for parse/schema instead of exact prose.
32. Run independent reads in parallel and dependent write afterward; preserve full assistant blocks/matching IDs; return
    explicit error results; authorize and obtain human approval immediately before the write.
33. Buffer deltas by block; parse/validate only after block completion; commit history only at message stop; discard and
    retry an interrupted provisional turn.
34. Trim irrelevant results and compact with declared loss; cache only identical stable prefix; retrieve source detail
    on demand; cap steps/tokens/time/spend and preserve critical facts outside lossy summary.
35. Fixed review is a workflow with deterministic gates/fetches; research is an agent with iterative search; choose
    session/external memory by duration; define tool, iteration, time, spend, and human-action limits.

</details>

## Review log

| Attempt | Date | Score | Weak topics | Next action |
| ------- | ---- | ----: | ----------- | ----------- |
| 1       |      |       |             |             |
