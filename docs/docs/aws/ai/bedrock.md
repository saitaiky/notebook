---
title: Amazon Bedrock
description: Amazon Bedrock in depth — runtime APIs, Knowledge Bases, Guardrails, Prompt Management/Flows/Agents, AgentCore, reranking, model customization, inference options, and cost controls.
keywords:
  - aws
  - amazon web services
  - bedrock
  - amazon bedrock
  - guardrails
  - bedrock agents
  - bedrock flows
  - agentcore
  - generative ai
sidebar_position: 1
---

## Model access and foundation model families

Bedrock is a managed gateway to foundation models from multiple providers (Anthropic's Claude, Amazon's own Titan/Nova, Meta's Llama, Mistral, Cohere, AI21's Jamba, and others) behind a single API, so switching models is a configuration change rather than a rewrite. Access to each model must be explicitly requested/enabled per account and region before it can be invoked, and pricing/quotas vary per model family — a design that matters because it means capacity planning and cost estimation have to happen per-model, not just per-account.

:::info Why this matters on the exam
Questions often test whether you know that Bedrock itself does not train models from scratch — it hosts and serves existing foundation models, and any customization happens through prompting, RAG, or fine-tuning/continued pre-training on top of a base model.
:::

## Runtime APIs: InvokeModel, streaming, and Converse

Once a model is enabled, Bedrock exposes three different ways to actually call it, and picking the right one is mostly about whether the interaction is single-turn, needs progressive output, or has to work identically across multiple model providers:

- **`InvokeModel`**: A synchronous, single-turn call — send a request body, get back the complete response once generation finishes. This is the simplest option and the right default when the caller doesn't need partial output as it's generated.
- **`InvokeModelWithResponseStream`**: Streams tokens back as they're generated instead of waiting for the full response. This doesn't reduce the model's total generation time, but it dramatically improves *perceived* latency in a chat UI, since the user starts seeing text within the first token instead of waiting for the entire answer — the metric this optimizes is time-to-first-token, not total token count or overall latency.
- **`Converse` / `ConverseStream`**: A unified, model-agnostic interface that normalizes request/response format across every Bedrock model family, and natively supports multi-turn conversation history, tool use, and structured output via a JSON schema. Using `Converse` instead of `InvokeModel` means switching model providers doesn't require rewriting request-parsing logic for a different response shape.

Every request built for these APIs is structured around three message roles: a **system** message carrying persistent instructions, persona, and tone constraints that apply for the whole conversation; a **user** message containing the actual question or request; and an **assistant** message holding the model's own prior responses, which is what allows multi-turn context to be threaded through subsequent calls.

:::warning Exam trap
The system message is not a security boundary — it's an instruction, not an enforcement mechanism, so it doesn't reliably stop a user from overriding it with adversarial input. Preventing prompt injection is a job for [Guardrails' prompt-attack filter](#guardrails), not for how the system message is worded.
:::

## Knowledge Bases: managed RAG

Bedrock Knowledge Bases are the managed retrieval-augmented-generation layer built into Bedrock: point it at a data source (S3, Confluence, SharePoint, Redshift, or the Glue Data Catalog), and it handles chunking, embedding, vector storage, and retrieval without requiring a hand-built ingestion pipeline. Retrieval happens through a `Retrieve` API (returns raw matching chunks) or a `RetrieveAndGenerate` API (returns a final, grounded answer with citations back to the source chunks), both of which Bedrock Agents and Prompt Flows can call directly as a step in a larger workflow.

The details that actually determine retrieval quality — chunking strategy, embedding model choice, and which vector store backs the index — are substantial enough to warrant their own page; see [RAG & Vector Stores](./rag-and-vector-stores.md) for chunking strategies (fixed-size, hierarchical, semantic), embedding model trade-offs, and a full comparison of the supported vector stores (OpenSearch, Aurora pgvector, DynamoDB, MemoryDB, S3 Vector Buckets).

Knowledge Bases also support structured **metadata filtering** — tagging chunks with explicit attributes like department, date, jurisdiction, or classification level, so a query can be scoped to only the documents a given user or context is allowed to see, before semantic ranking even runs. This is a meaningfully different mechanism from just hoping the embedding captures that metadata implicitly: explicit metadata fields are filterable and reliable, while metadata baked only into the embedded text is not.

## Reranker models

A retrieval step tuned for speed (a large Top-K similarity search) and a retrieval step tuned for precision (a small number of truly relevant chunks) are in tension, and reranking is how Bedrock resolves that tension without forcing a single retrieval pass to do both jobs. The pattern is: retrieve a broad candidate set cheaply, then pass those candidates through a dedicated reranking model — configured via `rerankingConfiguration` on the `Retrieve`/`RetrieveAndGenerate` API, backed by models like Amazon Rerank 1.0 or a Cohere reranker — which reorders the candidates by true relevance before only the top few are sent to the model for generation.

:::tip Exam wording cue
"Retrieval returns technically-matching but low-quality results" points to adding or tuning a **reranker**, not to increasing Top-K — a larger Top-K just gives the reranker (or, without one, the model itself) more noise to sort through.
:::

## Guardrails

Guardrails let you enforce content policy independently of the underlying model, applying the same filtering rules regardless of which foundation model sits behind a given prompt, and can be applied to both the input (prompt) and the output (response):

- **Denied topics**: Block a defined set of topics (e.g., investment advice, medical diagnoses, prescription guidance) from being discussed at all, regardless of how the question is phrased.
- **Content filters**: Detect and block unsafe categories — hate speech, violence, sexual content, harassment — with a per-category strictness threshold rather than a single global setting.
- **Word/phrase filters**: Block a centrally managed list of specific words or phrases, useful for profanity or company-specific banned terms.
- **Sensitive information (PII) filters**: Detect and either redact or fully block sensitive data — emails, phone numbers, credit card numbers, SSNs, and custom regex patterns — in both the prompt going in and the response coming out.
- **Prompt attack filters**: Detect adversarial input patterns that attempt to override the system prompt or otherwise manipulate the model's instructed behavior, which is the actual mechanism for stopping prompt injection (as opposed to just wording the system message more firmly).
- **Contextual grounding checks**: Two related filters used together for RAG workloads — a `GROUNDING` filter verifies the generated response is actually supported by the retrieved source content, and a `RELEVANCE` filter verifies the response addresses the query at all — each with its own configurable threshold (commonly 0.7).

Guardrails are versioned, so a new rule set can be tested before being promoted to the version an application actually calls, and tracing can be turned on with `{"trace": "enabled"}` in the guardrail configuration to capture exactly which rule fired and why for a given request — the `InvocationsIntervened` CloudWatch metric (broken down by policy type) is the aggregate signal for how often each rule is triggering in production.

Guardrails do not have to block content immediately. Setting an intervention action to **`NONE`** puts the policy into a detect-only mode: Bedrock still evaluates the prompt/response and returns the guardrail assessment, but the application decides what to do with that assessment afterward. This pattern is useful when a team wants to audit how often a policy would trigger in production before turning on hard blocking, or when a Lambda/API layer needs to branch into a custom remediation flow instead of letting the guardrail stop the request outright.

Guardrails can also be shared across accounts: a resource-based policy on the guardrail grants a cross-account IAM role the `bedrock:ApplyGuardrail` permission, and enforcement can be made mandatory account-wide via the `bedrock:GuardrailIdentifier` IAM condition key, which blocks any `InvokeModel` call that doesn't specify an approved guardrail.

:::danger Exam trap
CloudTrail logs *that* `InvokeModel` was called (who, when, with which guardrail ID) — it does not capture *which specific rule* inside a guardrail intervened or why. For that level of detail, guardrail tracing (and the `InvocationsIntervened` metric) is the mechanism, not CloudTrail.
:::

## Prompt Management, Flows, and Agents

These three features build on top of raw model invocation, each adding a different layer of structure, and the exam frequently tests the boundaries between them:

- **Prompt Management**: Stores, versions, and shares reusable prompt templates (with `{{variable}}` placeholders) across an account, so a prompt can be edited, tested, and promoted through immutable numbered versions and dynamic aliases (e.g., `DRAFT` vs `PROD`) without redeploying application code. This is lifecycle/versioning only — it is not a workflow engine, and it does not sanitize or filter prompt content (that's Guardrails' job).
- **Prompt Flows**: A visual, low-code builder for chaining prompts, conditional branches, Lambda invocations, and Knowledge Base lookups into a single **sequential** workflow, where each step's output can feed the next step's input. Flows are the right tool when the sequence of steps is known in advance and mostly linear or branching.
- **Bedrock Agents**: Autonomous, multi-step task execution, where the model itself decides at runtime which tools to call and in what order to satisfy an open-ended request — a fundamentally different execution model from a Flow's predetermined sequence.

Prompt Management is easiest to understand as a release lifecycle for prompt text. A team typically iterates on a **`DRAFT`** prompt in the console, tests it with different placeholder values, then calls **`CreatePromptVersion`** to freeze an immutable numbered snapshot once the wording is approved. The application itself should then invoke a stable alias such as **`PROD`** rather than hard-coding a numbered version, because the alias can be moved to a newly approved prompt version without redeploying application code. That same version or alias identifier is also what lets a team correlate a bad output later with the exact prompt revision that generated it.

Prompt Flows become more valuable once the node types are concrete instead of abstract. A **Condition** node branches based on an earlier model result, a **Lambda** node performs deterministic business logic, an **Iterator** node repeats the same processing pattern over a collection of items, and a **Collector** node aggregates the repeated outputs back into one result. For example, a support workflow might use: input tickets -> Iterator node to process each ticket -> prompt node to summarize each one -> Collector node to gather the summaries -> final prompt node to write one executive digest. That is exactly the kind of known, inspectable sequence where a Flow is the right tool and an Agent would be unnecessary overhead.

:::tip Choosing between Flows and Agents
Use **Prompt Flows** when the sequence of steps is known in advance and mostly linear/branching. Use **Agents** when the model itself needs to decide, at runtime, which tools to call and how many times, to satisfy an open-ended request.
:::

### Bedrock Agents in depth

An agent's available tools are defined as **action groups** — an API specification (schema, parameters, descriptions) the agent can invoke — plus, optionally, one or more Knowledge Bases the agent can query for context while reasoning. Two APIs drive agent invocation: `InvokeAgent` for a single agent with a fixed configuration, and `InvokeInlineAgent` for cases where the action groups, Knowledge Bases, and instructions are determined at runtime rather than pre-configured; both support streaming responses, and both require the session ID and encryption configuration to remain stable for the duration of a multi-turn conversation.

Setting `enableTrace=true` on an invocation returns the agent's full orchestration trace: the chain-of-thought rationale behind each step, which tools were called and with what arguments, and which Knowledge Base chunks were retrieved — this is the primary debugging tool when an agent's behavior needs to be understood or audited, since the final response alone doesn't show *why* the agent chose a particular sequence of actions.

By default, an action group's Lambda function executes automatically once the agent decides to call it. Setting an action group to **custom control mode** (`RETURN_CONTROL`) changes this: instead of executing automatically, the agent pauses and returns the proposed invocation back to the calling application, which can inspect or modify it before resuming the agent with the result — useful when an action needs a human approval step or application-side validation before it's allowed to run.

Agents can also maintain **memory** across sessions — storing turn-by-turn conversation history, summarizing older turns to keep the active context compact, and expiring idle sessions after a timeout — identified by a `memoryId` that ties a sequence of separate invocations back into one continuous conversation.

For workflows spanning multiple distinct domains of expertise, native **multi-agent collaboration** lets a supervisor agent maintain the overall conversation and delegate specific sub-tasks to registered collaborator agents (for example, a travel-booking supervisor delegating to separate flight, hotel, and summary agents), with the supervisor responsible for stitching the collaborators' results back into one coherent response.

:::danger Exam trap
Agents are for autonomous, multi-step reasoning over an open-ended request — they are not the right tool for a single real-time lookup (use `InvokeModel`/`Converse` directly) or for a fixed, known sequence of steps (use Prompt Flows instead, which is cheaper and easier to audit for a linear pipeline).
:::

## AgentCore

Amazon Bedrock AgentCore is a set of managed building blocks for running production-grade AI agents at scale, decoupled from any single model provider or agent framework — it exists because a Bedrock Agent's action groups cover tool invocation, but production agent deployments also need durable session state, secure credential handling, and enterprise identity integration that a single action group doesn't provide on its own.

- **Runtime**: Hosts the agent as a container (packaged for ARM64, listening on port 8080 with `/invocations` and `/ping` endpoints) and validates the caller's JWT, delivering a **Workload Access Token** to the agent via the invocation payload header so the agent can securely call downstream APIs on the user's behalf. Session-level metrics are captured by default, but detailed spans and logs require explicit enablement.
- **Gateway**: Standardizes tool discovery, schema, and execution across a fleet of tools, so agents don't each need custom integration code per tool — the agent instead discovers available tools through a consistent protocol.
- **Identity**: Manages OAuth/SAML federation and token exchange, enabling trusted identity propagation so a downstream API call made by the agent carries the original user's identity rather than a generic service identity.
- **Memory**: Stores user preferences and conversation history with per-session summarization, similar in purpose to a Bedrock Agent's memory feature but designed to operate across agents built on different underlying frameworks.
- **Browser**: A managed, sandboxed headless browser tool an agent can drive to navigate web pages, click, and extract content — useful when a task genuinely requires interacting with a live website rather than retrieving static indexed content.
- **Code Interpreter**: A managed, sandboxed code-execution environment an agent can use to run generated code (e.g., data analysis, calculations, file transformations) and read back the result — the built-in alternative to wiring up a custom Lambda tool every time an agent needs to compute something rather than just retrieve or generate text.

An AgentCore-packaged agent exposes an **Agent Card** at `/.well-known/agent-card.json` for discovery, and communicates over **JSON-RPC 2.0**, which lets a caller (or another agent) find and invoke it using a standard protocol rather than a bespoke API contract.

:::tip Exam wording cue
If a scenario describes needing durable multi-turn agent memory, secure downstream credential handling, or agents built across different frameworks that still need to interoperate, that combination of requirements points to **AgentCore** rather than a single Bedrock Agent's built-in action groups.
:::

## Bedrock Data Automation (BDA)

Bedrock Data Automation extracts structured insights from unstructured multi-modal content — documents, images, audio, and video — using pre-built or custom output configurations (called **blueprints**) that define the exact schema to extract, returning structured JSON instead of requiring you to hand-write extraction prompts for each content type. Processing is asynchronous, typically triggered by an S3 event when new content lands, and BDA is positioned as a managed preprocessing layer that feeds directly into Knowledge Base ingestion — a managed alternative to hand-chaining Textract + Transcribe + custom prompts yourself.

The core mental model is: **project -> blueprint -> asynchronous extraction job -> structured JSON output**. The project packages the extraction configuration, while the blueprint defines the fields the output must contain, such as invoice number, customer name, total amount, or a short summary paragraph. The same pattern works across modalities: a document-oriented job can extract forms and tables, an audio job can turn a recording into transcript-derived fields, and a video job can combine visual and spoken content into one structured record. In all of those cases, the key shift is the same: the output is not a free-form model answer, it is a schema-shaped artifact meant for downstream systems.

A common ingestion pattern is: S3 object-created event -> Lambda or Step Functions -> asynchronous BDA invocation -> structured JSON written for downstream use -> Knowledge Base or search-index ingestion. That pattern matters because BDA is most valuable when the extraction step is part of a larger pipeline rather than a one-off interactive request. If the requirement is "a new contract lands in S3 and should be normalized into structured fields before retrieval or search," BDA is the managed preprocessing layer that fits.

:::tip When BDA is and is not the right tool
Use **BDA** when the input is multi-modal or semi-structured and the real requirement is to turn it into repeatable structured output for a downstream pipeline. Do **not** reach for BDA when the source is already clean text and a simple retrieval or prompt step is enough — in that case, the extra preprocessing layer adds cost and latency without solving a real problem.
:::

## Model customization: fine-tuning, distillation, and LoRA

Beyond prompting and RAG, Bedrock supports changing a model's actual behavior through several customization mechanisms, each suited to a different constraint:

- **Fine-tuning**: Adjusts a model's weights using labeled training examples to teach a new *style*, *behavior*, or *output format* that should persist across every future request. It is the right tool for consistent tone/format requirements, not for keeping the model current on facts that change — see [RAG vs. fine-tuning](./rag-and-vector-stores.md#rag-vs-fine-tuning) for the full trade-off.
- **Model distillation**: Uses a large, capable "teacher" model to generate (or judge) training examples, which are then used to train a smaller "student" model to approximate the teacher's behavior on a specific task. This lets production inference run on a cheaper, faster model while retaining most of the teacher's quality for that narrower task — and it can be built directly from a model's own historical production invocation logs rather than requiring a separately curated dataset.
- **LoRA (Low-Rank Adaptation)**: A lightweight fine-tuning technique that trains a small set of additional "adapter" weights rather than updating the full base model. Multiple LoRA adapters can be stored separately and swapped in dynamically against the same base model, which is far cheaper than maintaining several fully fine-tuned copies of a model for different customers or use cases.
- **Custom Model Import**: Lets you bring a model you've already fine-tuned outside Bedrock and serve it through Bedrock's managed infrastructure, including AgentCore-managed execution roles for handling its runtime permissions.

:::danger Exam trap
"Without retraining" in a question is almost always a signal that the intended answer is RAG, not fine-tuning or distillation — any technique that changes model weights requires a training job to pick up new information, while RAG only requires updating the retrieval corpus.
:::

## Inference options: on-demand, batch, provisioned throughput, and cross-Region profiles

- **On-demand inference**: Pay-per-token/request, no commitment, synchronous responses — the default choice for interactive applications.
- **Batch inference**: Submit a large volume of prompts as a single asynchronous job (via `CreateModelInvocationJob`, reading a JSONL file from S3 and writing results back to S3) at a discounted price, trading latency for cost when responses aren't needed immediately.
- **Asynchronous invocation**: `StartAsyncInvoke` kicks off a single long-running generation (e.g., a long video or extended document) and returns immediately; the caller polls `GetAsyncInvoke` for status and receives the final output via S3 once complete — a middle ground between a single on-demand call and a full batch job.
- **Provisioned Throughput**: Reserves dedicated model capacity for a fixed hourly cost, guaranteeing consistent throughput and latency for predictable, high-volume workloads — and it's required for some fine-tuned/custom models that aren't available under on-demand pricing at all.
- **Cross-Region inference profiles**: System-defined profiles (e.g., a `us.anthropic.claude-...` profile) that automatically route on-demand requests across multiple Regions to increase available throughput and improve resilience during regional capacity constraints, without you writing multi-Region failover logic yourself.
- **Intelligent Prompt Routing**: Automatically analyzes each incoming prompt and routes simpler queries to a lighter/cheaper model while escalating more complex queries to a stronger model, so the cost-per-request scales with how hard the request actually is rather than paying the top-tier model's price for every call.

These options are easy to confuse because all three of Provisioned Throughput, Cross-Region inference profiles, and Intelligent Prompt Routing can be pitched as "optimization," but they optimize for different things. **Provisioned Throughput** buys reserved capacity for a known workload shape; the value is predictable throughput and lower throttling risk, not better answers. **Cross-Region inference profiles** preserve the on-demand model but widen the capacity pool by letting Bedrock route a request to one of several Regions behind a system-defined profile such as a `us.anthropic...` profile. That improves resilience and available throughput when one Region is constrained, but it also means the request may be served outside the caller's home Region. **Intelligent Prompt Routing** solves a different problem entirely: a mixed workload where simple prompts do not justify paying the strongest model's price every time.

Intelligent Prompt Routing is best thought of as a managed version of model cascading. Instead of a team maintaining its own router plus custom thresholds in application code, Bedrock evaluates the incoming prompt and decides whether a lighter/cheaper model is sufficient or whether the request should be escalated to a stronger model. The important exam boundary is that this is a **cost-and-latency control**, not a quality upgrade in itself: it reduces over-spending on easy requests, but it does not make a hard prompt intrinsically more accurate than sending that same hard prompt directly to the stronger model.

| Option | Optimizes for | Best fit | Common trap |
| --- | --- | --- | --- |
| **Provisioned Throughput** | Reserved capacity and predictable throughput | Sustained, high-volume traffic or custom/fine-tuned models that require it | Buying it for "better reasoning" instead of guaranteed capacity |
| **Cross-Region inference profiles** | On-demand resilience and higher aggregate capacity | Capacity constraints are possible and cross-Region serving is acceptable | Treating it as compatible with strict data-residency requirements |
| **Intelligent Prompt Routing** | Cost/performance mix across simple and complex prompts | Traffic contains a mix of cheap-to-answer and expensive-to-answer requests | Treating it as a direct accuracy feature rather than a routing/cost feature |

:::danger Exam trap
Provisioned Throughput buys **guaranteed capacity**, not better reasoning or lower per-request cost — it's typically more expensive at low volume and only pays off once sustained throughput requirements would otherwise hit on-demand throttling. Similarly, cross-Region inference profiles improve throughput and resilience by routing across Regions — they are not a data-residency control, since a strict residency requirement means requests must *not* leave a given Region.
:::

## Prompt caching

Prompt caching lets you mark a portion of a prompt (e.g., a long system prompt or a repeated document/context block) as cacheable, so repeated invocations that reuse that same prefix are billed and processed faster than resending the full context on every call. This matters most for RAG or agent workloads that resend large, mostly-unchanged context on every conversational turn — it provides no benefit for one-off requests over genuinely unique content, since there's no repeated prefix to cache in the first place.
