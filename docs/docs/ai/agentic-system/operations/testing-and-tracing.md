---
slug: /ai/agentic-system/testing-and-tracing
title: Testing and Tracing
description: "The test levels and tracing layer that sit underneath an eval: how four test levels each catch a failure the others miss, why the integration seam is where silent failures hide, and how a trace localizes a failed eval to a single step."
keywords:
  - ai
  - agentic system
  - testing
  - tracing
  - integration test
  - observability
  - failure localization
---

An [eval](/ai/agentic-system/evaluation) tells me *what good looks like* as a number. It does not tell me *where* a failure happened, and it does not stop a passing eval from hiding a break somewhere in the workflow. A graded target needs a test and tracing layer underneath it: tests that isolate each failure type, and traces that show which step produced the bad result.

This page is the systems-level complement to the general [software testing overview](/software-development/devops/testing) — the same test pyramid, but applied to a model-backed feature where the "unit under test" includes a non-deterministic model call and the handoffs between retrieval, prompting, and parsing.

## Four Test Levels, Each Catching What the Others Miss

A test is only useful if I know which failure it identifies. Four levels divide the work, and most silent production breaks live at one particular level.

| Level | What it isolates | What it cannot catch |
| --- | --- | --- |
| **Unit** | One function — a parser, a tool wrapper — on its own. | Anything about how components fit together. |
| **Functional** | One model call returning the expected shape for an input: the right fields, the right type, a parseable response. | Failures in the system *around* that single call. |
| **Integration** | The seam where two components hand off, such as retrieval into the model call. | Whole-flow behavior that only emerges end to end. |
| **End-to-end** | The full flow as a user runs it, input to output. | *Where* the break is — it sees only the final result. |

The level worth dwelling on is **integration**, because that is where most silent failures hide. Each side of a handoff can pass its own tests while the contract between them is broken. A unit test cannot catch it, because each unit works in isolation. A functional test cannot catch it, because the call works on a well-formed input. Only a test that drives the handoff with real data surfaces the mismatch — which is exactly the failure the integration level exists to catch.

## Tracing: Finding the Step That Failed

Tests tell me a failure exists; they do not tell me which step caused it. That is what a trace adds. A trace records each step of a run — the prompt, the tool calls, the intermediate outputs, and the timing — so that when a case fails, I can see which step produced the bad result. Without a trace, a failed eval says something is wrong but not where, which is the difference between a five-minute fix and a day spent reconstructing the workflow by hand.

A trace reads like a timeline of the run, and the failing step is usually obvious once the intermediate output is visible:

```text
[trace run_id=8f21c] case: "Where is my refund?"
  step 1  retrieve(query)      ok   42ms   -> 3 chunks
  step 2  build_prompt(chunks) ok    1ms   -> prompt 1,240 tok
  step 3  model.call(prompt)   ok  980ms   -> answer "..."
  step 4  parse(answer)        FAIL  2ms   -> KeyError: amount
  final score: 0  (failure localized to step 4, the parser)
```

The trace turns *"the case failed"* into *"step four: the parser raised a `KeyError` on a field the model did not return."* That is also what makes a change reviewable: I can show the step that moved rather than just the score that dropped.

## The Seam Postmortem: Two Green Units, One Red Flow

The integration level earns its place through a failure that only it can see. Consider a retrieval-into-generation flow where the parser unit test passes and the model-call functional test passes — each returns the expected shape in isolation — but the end-to-end run fails:

```text
PASS  test_parser_unit             parser returns date objects
PASS  test_extract_shape_functional model call returns {primary_date, issue}
FAIL  test_full_flow_e2e
  step 1  retrieve(q)        ok -> [{"content": "..."}, ...]   (list of dicts)
  step 2  build_prompt(ctx)  ok -> ctx inserted as a raw list
  step 3  model.call(prompt) ok -> answer ignores the context
  step 4  assert answer...   FAIL -> model answered from memory
  cause: retrieve() returns a list of chunk dicts; build_prompt()
         expected a plain string, so the model received malformed context.
```

Each side was correct on its own. The retrieval function returns a list of chunk dictionaries; the prompt builder was written expecting a plain string. The context arrives malformed, and the model quietly answers from its own memory instead of the retrieved policy. The **format contract between the two steps was never defined**, and nothing exercised the seam — so the break only appears when the two run together on real retrieved data.

:::tip

The fix is two-part: align the handoff (`context = "\n".join(c["content"] for c in chunks)`) **and** add an integration test that drives `retrieve() -> build_prompt()` together on real chunks, so the contract is enforced before a user hits it. See [RAG Production Operations](/ai/llm/rag/rag-production-operations) for failure localization across a full retrieval pipeline, and [Agent-to-Agent Communication](/ai/agentic-system/agent-to-agent#evaluation--testing) for the multi-level version where a routing seam between sub-agents is the thing that breaks.

:::

## Routing Between Strategies Is a Seam You Still Have to Test

You do not have to pick one strategy for everything. A cheap classification step can send single-fact lookups to a fetch-once retrieval path and multi-part questions to a search-across-rounds path, so you spend on iteration only when the query needs it:

```python
def route(query):
    kind = classify(query)          # cheap call: "lookup" or "multi_step"
    if kind == "lookup":
        return fetch_once(query)     # static retrieval, one pass
    return agentic_search(query)     # search across rounds
```

Defaulting everything to iterative search inflates cost and latency on questions a single fetch would answer; defaulting everything to a static index gives shallow answers on questions that needed several passes. The router earns its cost whenever traffic is mixed; where every query is the same shape, skip it and hardcode the path.

This routing choice appears here, under testing and tracing, for a reason that is easy to miss: **the router is not a test, it is a new seam**. The `classify() -> path` handoff is exactly the kind of integration boundary the section above warns about — a cheap default that silently sends a multi-step question down the fetch-once path produces a confident, shallow answer that no unit test flags. So a mixed-strategy design *adds* an integration test (does each query class reach the path it should?) and a trace field (which path ran) rather than removing test surface. Choosing a cheap default is good economics; it does not reduce what you must exercise and observe.

## What Belongs Where

- **Did a single function behave?** Unit test.
- **Did one model call return the right shape?** Functional test.
- **Did two components agree on their contract?** Integration test — and this is where to look first when every piece passes but the whole flow is wrong.
- **Did the user-visible flow work end to end?** End-to-end test, with a trace so a failure localizes to a step instead of a guess.

Once a failure is localized, the question shifts from *where* to *what the system does about it* — whether the failure is recoverable by retrying or terminal and must fail fast. That decision is covered in [Rate Limits and Failure Handling](/ai/agentic-system/rate-limit#retriable-vs-terminal-failures).
