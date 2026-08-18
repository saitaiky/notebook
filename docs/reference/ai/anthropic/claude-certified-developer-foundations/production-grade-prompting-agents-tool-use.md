# Production-Grade Prompting, Agents & Tool Use

Course-derived study notes, paraphrased for private certification preparation.

## 1. Diagnose the prompt failure before adding text

Production prompting is a debugging discipline. Add the smallest structure that addresses the observed failure:

| Failure                                          | First intervention                             |
| ------------------------------------------------ | ---------------------------------------------- |
| Wrong output shape                               | Exact output contract or structured output     |
| Tone, role, or scope drifts across turns         | Stable system instruction                      |
| Task is understood but the format is improvised  | One representative example                     |
| A known edge case fails                          | Explicit constraint or an example of that edge |
| Instructions and source material become confused | Clear delimiters/XML-style semantic sections   |

Longer prompts are not automatically stronger. Repeated, conflicting, or buried instructions can increase cost and
latency while reducing compliance. XML tags are useful because they label roles such as `<instructions>`, `<document>`,
and `<examples>`; they are organization, not a security boundary.

Structured outputs enforce an output schema. Strict tool schemas validate tool arguments. Schema use can add a first-use
compilation or token cost, but it is preferable when downstream code requires machine-valid structure.

## 2. Extended reasoning

Use adaptive thinking and effort for tasks whose difficulty genuinely requires multi-step work. Do not enable expensive
reasoning universally. Measure the gain on difficult cases and include its extra output tokens in the budget.

When a reasoning-enabled response enters a tool loop, preserve every returned thinking or redacted-thinking block
unchanged in the next request. Signed blocks are protocol state: stripping, editing, or summarizing them can invalidate
the continuation.

## 3. Tool definitions that produce the right choice

Claude chooses a tool; the application executes it. A reliable tool definition includes:

- a specific, distinct name;
- a description of when to use it and when not to use it;
- a JSON schema with meaningful field descriptions;
- only genuinely required fields; and
- explicit exclusions where similar tools overlap.

Wrong-tool failures usually indicate ambiguous descriptions, not a need for a longer user prompt. Add mutually exclusive
criteria to both tools, or merge them behind a clear `type` parameter when their responsibilities are inseparable.

## 4. The tool-use protocol

A response can contain text, reasoning, and one or more `tool_use` blocks. For every tool request:

1. preserve the complete assistant content array;
2. execute the named tool under application-controlled authorization;
3. return a `tool_result` in the immediately following user turn;
4. use the exact matching tool-use ID; and
5. mark errors explicitly instead of returning an empty success-shaped result.

Independent tool calls may run in parallel. Calls with data dependencies must run sequentially. If policy requires one
call at a time, use the supported parallel-tool control rather than relying on wording alone.

## 5. Streaming safely

The stream lifecycle includes message start, block start, block deltas, block stop, message-level metadata, and message
stop. Text and tool-input JSON can arrive in fragments. Accumulate fragments by block index and do not parse or execute
a tool call until its block is complete. Commit the assistant turn only after message completion.

If a stream breaks, discard the provisional turn and retry from the last complete conversation state. Never append a
half-message and ask the model to continue from corrupted history.

## 6. Context engineering

The context window is finite and is not silently truncated. Manage it deliberately:

- **Pruning/rewinding:** remove turns and lose later work.
- **Compaction:** preserve a summary but lose details not represented in it.
- **Clearing:** begin a new session and lose session state.
- **Subagent handoff:** isolate work in a separate context and return a summary, losing the full path.

Prompt caching reuses an identical stable prefix. Place stable system instructions and large tool schemas before the
cache breakpoint; keep rapidly changing state afterward. Cache economics require repeated reads within the supported TTL
and a prefix above the model's minimum size. Exact-prefix changes cause misses.

Use a token-count endpoint or equivalent preflight calculation for requests close to the limit.

## 7. Retrieval design

RAG quality can fail at chunking, semantic matching, or prompt assembly. Choose the least complex retrieval path that
fits the question:

- stable corpus plus a simple lookup: index and fetch once;
- changing sources or multi-step research: let an agent search, inspect, and refine iteratively.

Agentic search can be more current and flexible, but it consumes more calls, tokens, and latency. An agent is not a fix
for poor source access or missing authorization.

## 8. Workflow versus agent

A workflow follows enumerated steps with lower variance, easier guardrails, and standard observability. An agent
receives a goal and tools when the path cannot be known in advance. Prefer a workflow when the steps are predictable.

Common execution layers:

- **Raw Messages loop:** maximum control; the application owns protocol, state, budgets, and safety.
- **Agent SDK:** manages the loop and tool registration in the application's process; configuration sources must be
  enabled deliberately.
- **Managed agent service:** offloads loop/state/sandbox management, with platform-specific availability and compliance
  constraints that must be verified.

Every agent needs hard limits: maximum iterations, wall time, tool calls, spend, and explicit stop conditions. Require a
human checkpoint immediately before an irreversible or externally consequential action.

## 9. Memory choices

| Memory form       | Strength                                 | Cost/risk                                   |
| ----------------- | ---------------------------------------- | ------------------------------------------- |
| In-context        | Simple, full-fidelity within one session | Consumes context and vanishes with session  |
| External store    | Cross-session/shared durability          | Retrieval, permissions, and staleness logic |
| Summarized memory | Lower token load                         | Details omitted from summary are lost       |
| Stateless         | Isolation for independent jobs           | No continuity                               |

Use Skills for reusable on-demand procedures, project instructions for always-on repository conventions, and current
context for temporary task state. Subagents may not inherit skills or configuration automatically; make dependencies
explicit.

## 10. Multimodal inputs and batches

Images consume visual tokens after service-side scaling. Use inline base64 for one-off assets, a public URL for stable
public content, or a reusable file reference where the platform supports it. PDFs are document blocks and can be sent by
supported URL, encoded bytes, or file reference, optionally with context.

Message Batches are for large independent jobs, not synchronous tool loops. Respect current request-count/size limits,
poll completion, and correlate results by `custom_id` because order is not guaranteed.

## Production invariants

- Tool descriptions are mutually distinguishable.
- Every `tool_use` has one matching immediate `tool_result`.
- Signed reasoning blocks return unchanged.
- Partial streamed JSON is never executed.
- Only complete assistant messages enter durable history.
- Context growth has a declared compaction/pruning strategy.
- Write actions have a just-in-time human or policy gate.
- Every agent has iteration, time, and spend budgets.

## Exam focus

Expect debugging questions where several tempting prompt changes are offered but only one addresses the actual failure.
Protocol questions commonly test block preservation, tool-result ordering, interrupted streams, overlapping tool
schemas, workflow-versus-agent selection, context strategy, memory scope, and batch/result correlation.
