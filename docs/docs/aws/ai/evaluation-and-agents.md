---
title: Model Evaluation & Agentic Techniques
description: Evaluating foundation models with golden datasets and LLM-as-judge, safe rollout patterns, and multi-agent orchestration techniques (Agent Squad, MCP, ReAct) on AWS.
keywords:
  - aws
  - amazon web services
  - model evaluation
  - agentcore
  - agent squad
  - mcp
  - react pattern
  - llm as judge
sidebar_position: 5
---

## Model evaluation

:::note Theory background
For the general evaluation framework — retriever vs. generator metrics, offline/online/pairwise approaches, and hallucination taxonomy — see the [general AI evaluation notes](/ai/agentic-system/evaluation).
:::

Bedrock's built-in **Model Evaluation** jobs let you compare foundation models (or versions of a fine-tuned model) against each other before committing to one in production. Automated jobs score responses against concrete metrics — **faithfulness** (is the answer supported by the source), **answer relevance** (does it address the question), **context relevance** (did retrieval find the right material), **similarity**, and **hallucination** — while **LLM-as-judge** evaluation uses a separate, capable model (Claude or Mistral Large, for example) to score generated content against a rubric, which scales far better than manual review across large test sets. **Human evaluation** workflows complement both: reviewers rate outputs against defined criteria (accuracy, tone, brand voice, harmfulness) using a private workforce, which is still necessary for judgment calls an automated metric can't reliably capture.

For agentic systems specifically, Bedrock evaluation can also score whether an agent chose and used tools correctly. A custom evaluation dataset can map each input to the expected tool invocation, and the evaluation job can measure **tool selection accuracy** (did the agent choose the right tool at all) and **tool parameter accuracy** (did it call that tool with the right arguments). That distinction matters because an agent can fail long before the final answer is judged: the root cause may be wrong orchestration, not weak language generation.

A **golden dataset** — a curated, labeled set of representative prompt/expected-response pairs — is what makes evaluation meaningful over time: it gives you a fixed benchmark to re-run every time a model, prompt, or fine-tune changes, so you can tell whether an update actually improved quality instead of just producing different output. The strongest version of this pattern wires the golden dataset directly into CI/CD: a build stage (CodeBuild, for example) runs the candidate model against the dataset and computes precision/recall/F1 or a similarity threshold, failing the pipeline if quality regresses — a **preventive** gate before deployment, rather than a CloudWatch alarm that only reacts after a regression is already live.

:::tip Exam wording cue
"How do you objectively compare Model A vs Model B for this use case" almost always points to running both against the same golden dataset with Bedrock Model Evaluation, rather than eyeballing a handful of example outputs. And when a judge model is used to score outputs, it needs to be at least as capable as the model being evaluated — a weaker judge produces unreliable scores.
:::

## Safe rollout patterns: canary, shadow, and A/B testing

These three patterns answer "how do I change the model/prompt in production without risking a bad outcome for all users at once," and SageMaker's multi-variant endpoints (see [SageMaker: safe rollout on real-time endpoints](./sagemaker.md#safe-rollout-on-real-time-endpoints-variants-ab-testing-and-shadow-testing)) implement all three directly on a hosted model:

- **Canary deployment**: Route a small percentage of live traffic (commonly 5–10%) to the new model/prompt version, monitor error rates and quality metrics, and gradually increase traffic if it performs well, with automatic rollback if it doesn't — the same pattern used for regular application deployments, applied to model changes.
- **Shadow deployment**: Send a copy of live traffic to the new model in parallel with the current production model, but don't return the new model's response to users — only log and compare it. This validates behavior with zero user-facing risk, at the cost of double inference spend.
- **A/B testing**: Split traffic between two variants and compare a business or quality metric (e.g., task success rate, user satisfaction, revenue impact) — and ideally a fairness metric alongside it (see [Bias and fairness](./responsible-ai-and-security.md#bias-and-fairness)) — to decide which performs better, typically run longer than a canary and used for a decision rather than a gradual rollout.

:::warning Exam trap
Shadow deployments never affect what the user sees — if a question describes evaluating a new model's real output against production traffic without any user-facing risk, that's shadow, not canary or A/B testing, both of which do expose real users to the candidate.
:::

## Agentic orchestration patterns

:::note Theory background
For the protocol internals behind MCP — JSON-RPC 2.0 transport, tool discovery, bidirectional communication, and security patterns — see [Model Context Protocol Architecture](/ai/agentic-system/model-context-protocol). For agent-to-agent communication patterns and supervisor/sub-agent delegation beyond what Bedrock natively provides, see [Agent-to-Agent Patterns](/ai/agentic-system/agent-to-agent). For the ReAct reasoning pattern itself — the Thought/Action/Observation cycle — see [Help LLM to reasoning](/ai/llm/generative-ai-with-llm/wk3/reasoning#react-framework).
:::

Beyond a single Bedrock Agent's built-in action groups (covered in [Bedrock Agents in depth](./bedrock.md#bedrock-agents-in-depth)) and [AgentCore](./bedrock.md#agentcore) (Bedrock's managed runtime/gateway/identity/memory building blocks for production agent deployments), several higher-level patterns and frameworks show up for coordinating more complex, multi-agent systems:

- **Agent Squad** (formerly Multi-Agent Orchestrator): An open-source framework built around an **orchestrator** agent that classifies each incoming query and routes it to the **specialist agent** best suited to handle it — a billing agent, a technical-support agent, a general Q&A agent — each with its own scoped system prompt and dedicated tools, with the orchestrator maintaining conversation continuity as it hands requests between specialists.
- **Multi-agent supervisor + collaborator pattern**: The same conceptual shape implemented natively as a Bedrock Agents feature — a supervisor agent holds the overall conversation and delegates specific sub-tasks to registered collaborator agents (for example, separate flight, hotel, and summary agents behind a travel-booking supervisor), then stitches their results back into one coherent response.
- **MCP (Model Context Protocol)**: A standardized, JSON-RPC 2.0–based protocol for tool discovery, schema definition, and execution, so an agent doesn't need bespoke integration code for every tool it calls. MCP servers can be deployed as lightweight, stateless Lambda functions for fast, ephemeral tool calls, or as long-running ECS Fargate containers when a tool needs to hold state or keep a model loaded in memory between calls — the choice comes down to whether the tool itself is stateless or stateful.
- **ReAct (Reasoning + Acting)**: A structured prompting pattern where the model alternates explicit **Thought** (reasoning about what to do next), **Action** (invoking a tool), and **Observation** (reading the tool's result) steps, repeating until it has enough information to produce a final **Answer**. This is often implemented with Step Functions orchestrating Lambda-backed tool calls in a loop, and its value is transparency — each intermediate reasoning step is visible and debuggable, rather than the model jumping straight from a question to an unexplained final answer.

:::info When multi-agent shows up on the exam
Look for scenarios describing several distinct domains of expertise (billing, tech support, HR policy) needing to be handled by one conversational front end — that's the signal for a supervisor/orchestrator multi-agent pattern (Agent Squad or native Bedrock multi-agent collaboration) rather than a single large prompt trying to cover every domain.
:::

## Efficiency techniques: routing, caching, reranking, pruning, and distillation

Production RAG and agent systems commonly combine several optimization techniques to control cost and latency without sacrificing quality. **Routing** sends simple queries to a smaller/cheaper model and escalates only complex queries to a larger one (Bedrock's Intelligent Prompt Routing automates this — see [Bedrock inference options](./bedrock.md#inference-options-on-demand-batch-provisioned-throughput-and-cross-region-profiles)); **caching** reuses previous responses or cached prompt prefixes (see [Bedrock prompt caching](./bedrock.md#prompt-caching)) to avoid redundant inference calls; **reranking** and **context pruning** improve what actually reaches the model from a retrieval step (see [RAG & Vector Stores: query-time optimization](./rag-and-vector-stores.md#query-time-optimization-expansion-reranking-and-caching)); and **distillation** trains a smaller "student" model to mimic a larger "teacher" model's outputs (see [Bedrock model customization](./bedrock.md#model-customization-fine-tuning-distillation-and-lora)), so inference can run cheaper and faster while retaining most of the teacher's quality on the target task.

When the exam emphasizes "change routing behavior without redeploying application code," the missing piece is usually **AWS AppConfig feature flags** rather than a hard-coded environment variable. AppConfig lets the application switch routing logic at runtime — for example, turning on a model cascade or changing which traffic cohort gets a cheaper model first — without a code push.

## Fine-tuning vs RAG

Fine-tuning changes a model's weights to teach a persistent style or behavior; RAG leaves the weights alone and injects current information at inference time instead. The full trade-off — and the "without retraining" exam trap that almost always points to RAG — is covered in [RAG & Vector Stores: RAG vs. fine-tuning](./rag-and-vector-stores.md#rag-vs-fine-tuning).
