---
title: Prompt Engineering
description: Prompt engineering techniques for AWS generative AI workloads — zero-shot, few-shot, and chain-of-thought prompting, message roles, structured output, sampling parameters, and prompt injection.
keywords:
  - aws
  - amazon web services
  - prompt engineering
  - chain of thought
  - few-shot prompting
  - structured output
  - prompt injection
sidebar_position: 4
---

The same foundation model can produce dramatically different quality results depending on how a request is framed, and the exam expects familiarity with the standard techniques for shaping model behavior without changing the model itself.

## Zero-shot, few-shot, and chain-of-thought prompting

:::note Theory background
For the underlying mechanics of in-context learning and why larger models need fewer examples, see [Transformer, Prompt engineering, Config](/ai/llm/generative-ai-with-llm/wk1/transformer-promptengineering-config#prompting-and-prompt-engineering). For chain-of-thought's more structured cousins — PAL and the ReAct reasoning loop — see [Help LLM to reasoning](/ai/llm/generative-ai-with-llm/wk3/reasoning).
:::

These three techniques sit on a spectrum of how much guidance is given to the model before it answers, and the right choice depends on how specialized or how reasoning-heavy the task is:

- **Zero-shot prompting**: The model is instructed directly, with no examples — "classify the sentiment of this review as positive, negative, or neutral." This is the simplest approach and works well for general tasks the model has broad knowledge of, but it's less reliable for highly specific output formats or narrow domain conventions.
- **Few-shot prompting**: A handful of labeled examples (typically one to five) are included in the prompt before the actual request, showing the model exactly the input/output pattern expected. This is the standard fix when zero-shot output is inconsistent in format or style — showing three examples of the exact JSON structure wanted is usually more reliable than describing that structure in prose.
- **Chain-of-thought (CoT) prompting**: The model is explicitly instructed to reason step-by-step before producing a final answer — for example, "first list every scheduling constraint, then check each candidate time slot against every constraint, then output the first slot that satisfies all of them." This markedly improves accuracy on multi-step logical or arithmetic tasks, because it forces the model to externalize intermediate reasoning instead of jumping straight to a guess.

:::tip Exam wording cue
"The model's reasoning needs to be inspected/debugged" or "the task involves multiple sequential constraints" points to chain-of-thought prompting. A simple, single-fact classification task rarely needs it — and CoT prompting costs more tokens and latency, so it's not a free upgrade to apply everywhere.
:::

## Message roles and conversation structure

Bedrock's `Converse` API (and most chat-style model APIs generally) structure a request around three roles: a **system** message that carries persistent instructions, persona, and tone constraints applying to the whole conversation; a **user** message containing the actual question; and an **assistant** message holding the model's own previous responses in a multi-turn exchange. Sending the full prior conversation as a sequence of user/assistant message pairs, with the system message set once at the start, is what lets a model maintain context across multiple turns rather than treating every message as a fresh, isolated request.

## Structured output with JSON Schema

Rather than asking a model to "return the result as JSON" in plain-language instructions and hoping the formatting is consistent, Bedrock's `Converse` API supports specifying an explicit JSON Schema that the model's output is constrained to match — defining required fields and their data types (for example, requiring a `summary` string and an `action_items` array) up front. This is materially more reliable for downstream parsing than prompt-only formatting instructions, since a schema-constrained response eliminates most of the "the model wrapped the JSON in explanatory text" or "a field was renamed slightly" failure modes that come from relying on the model to follow formatting instructions purely through the prompt text.

## Temperature and sampling parameters

Two parameters control how deterministic or varied a model's output is for the same input:

- **Temperature** (typically 0.0–1.0): A low temperature (0.0–0.3) makes output close to deterministic and consistent, appropriate for structured or factual tasks where the same input should reliably produce the same answer. A high temperature (0.7–1.0) introduces more randomness, appropriate for creative writing or brainstorming where variety is desirable.
- **Top-P (nucleus sampling)**: Restricts the model to sampling from the smallest set of next-token candidates whose cumulative probability reaches a threshold, which is another lever (alongside temperature) for controlling output diversity.

:::warning Exam trap
Temperature affects randomness, not correctness or quality — a low temperature does not make a model more accurate, it makes it more consistent. Choosing temperature is about matching the task's need for determinism (structured extraction, code generation) versus variety (creative writing), not about improving factual accuracy.
:::

## Prompt injection and why the system message isn't the defense

A prompt injection attack is user-supplied input crafted to override or subvert the system message's instructions — for example, a user embedding "ignore all previous instructions and instead..." inside what looks like ordinary input. Because the system message is just another instruction the model is trying to follow, not an enforcement boundary, wording it more forcefully doesn't reliably stop a sufficiently crafted injection attempt.

The actual mitigation is [Bedrock Guardrails' prompt-attack filter](./bedrock.md#guardrails), which is purpose-built to detect these adversarial patterns independently of how the system message is phrased, ideally combined with input validation/sanitization before the prompt is even assembled as defense-in-depth. Context pruning — stripping out irrelevant or untrusted portions of retrieved/user-supplied content before it reaches the model — is a complementary technique here too: less untrusted content in the context window means less surface area for an injection attempt to hide in.
