# MSO Foundations

Course-derived study notes, paraphrased for private certification preparation.

## Learning objectives

By the end of this module, you should be able to explain how tokens, context, sampling, model selection, prompting
examples, reasoning controls, SDKs, streaming, concurrency, and message batches affect a Claude application.

## 1. Tokens and the context window

A token is the model's unit of text processing and the basis of input/output accounting. Token boundaries are produced
by the selected model's tokenizer; they do not map reliably to words or characters. Budget tokens for the complete
request, not just the newest user message:

- system instructions;
- conversation history;
- tool definitions, tool calls, and tool results;
- retrieved documents or images represented in the request; and
- the model's generated output.

The context window is a fixed maximum for input plus generated output. If the input itself is too large, the API rejects
the request before generation. If the input fits but generation reaches the remaining ceiling, the response can be
partial and report a context-window stop condition. The application—not the model—must decide how to prune, summarize,
retrieve, or start a new session.

### Design implications

1. Reserve output space when admitting input.
2. Count or estimate tokens before expensive requests.
3. Keep only task-relevant history and tool results.
4. Detect incomplete output from structured response metadata, not prose.
5. Never assume the API silently discards old history.

## 2. Sampling and repeatability

Generation samples from a probability distribution over possible next tokens. Lower temperature generally concentrates
that distribution and makes responses more repeatable; it does not make the model deterministic. Model/service changes,
numerical effects, and competing high-probability tokens can still alter wording or decisions.

Tests should therefore assert properties—valid schema, required facts, allowed actions, rubric score—not an exact
paragraph. Newer model generations may constrain or ignore some legacy sampling combinations, so confirm supported
parameters for the exact model.

## 3. Model tiers and task fit

Claude models trade capability, latency, and cost. The course's durable rule is:

- start with the balanced production tier for the workload;
- move upward only when an evaluation proves the current tier misses the quality bar; and
- move downward only when an evaluation proves the cheaper/faster tier still meets it.

Use a fast tier for high-volume work that fits its capability envelope. Use a more capable tier for demanding reasoning,
coding, or agentic work where errors are expensive. Do not pay for the largest model by reflex. Model selection and
reasoning mode are separate decisions: a capable model can answer without extended reasoning, and a smaller model does
not become a larger one merely because reasoning is enabled.

## 4. Reasoning controls

Adaptive thinking lets the model decide when extra internal reasoning is useful; effort controls how much work it should
spend. This replaces older designs that treated a fixed thinking-token budget as the primary control.

Use more reasoning for multi-step planning, difficult debugging, constrained synthesis, or dependent decisions. Avoid it
for lookup, extraction, routing, and simple classification when evaluations show no gain. Reasoning consumes output
budget and increases cost/latency, so it must earn its place on an eval.

## 5. Zero-shot, one-shot, and few-shot prompting

- **Zero-shot:** instructions only. Start here when the task and output contract are clear.
- **One-shot:** one example resolves an important ambiguity.
- **Few-shot:** several examples demonstrate a pattern or edge cases.

Examples are request context, not training. They consume tokens on every uncached request. Add the smallest number that
fixes a measured failure. A stronger model and more examples are interacting levers; evaluate both rather than assuming
examples always compensate for model fit.

## 6. Raw HTTP and SDKs

The SDK and raw REST request reach the same Messages API. Raw HTTP offers complete transport visibility but makes the
application own headers, authentication, serialization, parsing, retries, and streaming details. Official SDKs handle
those mechanics consistently and should normally be the production default.

Synchronous clients block until a response completes. Async clients let an application overlap independent calls, but
concurrency still needs limits, timeouts, cancellation, rate-limit handling, and result correlation.

## 7. Streaming

Streaming uses server-sent events to deliver response blocks incrementally. It improves perceived latency because users
see output before the complete message exists. It does not inherently reduce total generation time or cost.

The consumer must assemble deltas, wait for the terminal message event, examine the stop reason, and only then commit
the assistant turn to durable history. A network read loop ending is not evidence of a complete message.

## 8. Async concurrency versus Message Batches

These solve different problems:

| Mechanism       | Best for                           | Main trade-off                                      |
| --------------- | ---------------------------------- | --------------------------------------------------- |
| Async client    | Interactive independent calls      | Application owns concurrency and rate-limit control |
| Streaming       | Fast first-token user experience   | More complex event assembly                         |
| Message Batches | Large non-urgent offline workloads | Results are asynchronous and may take many hours    |

A batch can contain many requests, return results in arbitrary order, and complete later. Give every request a unique
`custom_id` and join results by that identifier rather than position. Do not use Message Batches inside an interactive
agent loop that needs the next tool result immediately.

## 9. Decision checklist

- Does the whole request fit with output headroom?
- Is the model tier the cheapest one that passes the eval?
- Does extra reasoning improve a measured outcome?
- Is each example fixing a real ambiguity?
- Does the test assert behavior rather than exact prose?
- Is the workload interactive, concurrent, streamed, or offline-batch?
- Does every asynchronous result have a stable correlation ID?

## Exam focus

Expect questions that distinguish context admission from mid-generation exhaustion, repeatability from determinism,
model choice from reasoning effort, SDK convenience from API capability, streaming from completion, and interactive
concurrency from offline batching.
