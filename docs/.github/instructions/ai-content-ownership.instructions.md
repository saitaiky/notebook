---
applyTo: "docs/{ai,aws/ai}/**/*.{md,mdx}"
---

# AI Content Ownership And Duplication Guard

Use this standard whenever creating or substantially editing a page under `docs/ai/**` (general AI/ML/DL/LLM theory) or `docs/aws/ai/**` (AWS AI service application). It exists because both trees can independently accumulate an explanation of the same concept, and a lot of new AI content originates from raw exam/course material in `reference/**` that has not yet been checked against either tree.

Repo-wide rules in `.github/copilot-instructions.md` still apply, including the general "search existing content before adding new pages" rule — this file only adds the AI-specific pieces that rule can't know on its own: which two trees to check, and a concrete ownership map to check them against.

## The Two-Tree Model

- `docs/ai/**` owns **general, vendor-neutral theory**: why a mechanism exists, how it works conceptually, trade-offs, algorithms. Audience: understanding the idea itself.
- `docs/aws/ai/**` owns **AWS-specific application**: which AWS service implements the idea, exact API/parameter names, service boundaries, and exam-style traps. Audience: applying the idea on AWS.
- Neither tree should re-teach the other's angle in depth. `docs/aws/ai/**` may give a one-paragraph refresher before pivoting to the AWS-specific mechanics; `docs/ai/**` should not describe AWS service names/APIs in depth.
- When the repo-wide pre-write search turns up a match, use the table below to decide which tree owns it before extending a page or adding a cross-link.

## The `llm/**` vs. `agentic-system/**` Split (Inside `docs/ai/**`)

`docs/ai/**` is not one homogeneous tree — it has an internal split that the table below makes explicit instead of leaving it to a per-topic judgement call. This split is separate from, and sits inside, the two-tree model above: both `llm/**` and `agentic-system/**` are still on the `docs/ai/**` (vendor-neutral theory) side of the AWS boundary.

- `docs/ai/llm/**` owns the **concept/theory angle**: how a mechanism works, why it exists, course- or study-note-style explanations. Audience: understanding the idea itself, independent of any system it's deployed in.
- `docs/ai/agentic-system/**` owns the **production/integration angle**: how that same idea gets configured, wired, and operated once it's part of a real system with tools, retrieval, routing, caching, and cost constraints. Audience: building and operating with it.
- The full narrative version of this split lives in [`agentic-system/index.md`](/ai/agentic-system) under "Relationship To The LLM Section" — this file's job is to turn that narrative into a checkable per-topic table so a new page's home isn't re-derived from scratch each time.
- Decision rule: if new content teaches or explains a concept, default to `llm/**`. If it's about configuring, operating, or trading off that concept inside a running system, default to `agentic-system/**`. If it's genuinely both, split it — a short conceptual explanation in `llm/**` plus a deeper operational treatment in `agentic-system/**` — and cross-link the two rather than picking one arbitrarily.
- This split has no direct AWS-side equivalent: `docs/aws/ai/**` pages may cite either `llm/**` or `agentic-system/**` depending on which angle is closer to the AWS-specific mechanics being described.

## Cross-Link Requirement

- If a topic has real coverage in both trees, each side must link to the other (e.g., a short "See also" line), not silently duplicate the explanation.
- As of the 2026-08-19 audit, `docs/ai/**` and `docs/aws/ai/**` had **zero internal cross-links** despite four high-overlap topic areas below — new edits to those topics should add the missing links rather than compound the duplication.

## Topic Ownership Table

Keep this table current. When a topic's coverage changes meaningfully (new page, new section, page split/merge), update the relevant row in the same change. The `docs/ai/**` column from earlier revisions of this file is now split into `llm/**` and `agentic-system/**` so the owner of each angle is explicit instead of inferred from a combined list of paths.

| Topic | `llm/**` owner (concept/theory) | `agentic-system/**` owner (production/integration) | `docs/aws/ai/**` owner (AWS application) | Overlap risk |
| --- | --- | --- | --- | --- |
| RAG fundamentals, chunking, embeddings, vector stores | `llm/rag/rag-foundations.md`, `llm/rag/retrieval-engineering.md` | `agentic-system/rag-implementation.md`, `agentic-system/chunking.md`, `agentic-system/embedding-model.md`, `agentic-system/indexing.md`, `agentic-system/vectorstore-settings.md` | `rag-and-vector-stores.md`, `bedrock.md` (Knowledge Bases) | High |
| Fine-tuning, PEFT, LoRA, prompt tuning | `llm/generative-ai-with-llm/wk2/fine-tune.md`, `wk2/peft.mdx`, `llm/foundations/rag-vs-retrain-vs-finetune.md` | — | `bedrock.md` (model customization), `rag-and-vector-stores.md#rag-vs-fine-tuning` | Moderate |
| Prompt engineering (zero/few-shot, CoT) | `llm/generative-ai-with-llm/wk1/transformer-promptengineering-config.md`, `wk3/reasoning.md` | `agentic-system/prompting-vs-agentic-prompting.md` (system-prompt governance, guardrail wording, technique selection for agents) | `prompt-engineering.md` | Low-moderate |
| Agents, tool use, multi-agent orchestration, MCP | — | `agentic-system/index.md`, `agentic-system/model-context-protocol.md`, `agentic-system/agent-to-agent.md` | `evaluation-and-agents.md`, `bedrock.md` (Bedrock Agents) | High |
| Model/agent evaluation, hallucination, LLM-as-judge | `llm/rag/generation-systems-for-rag.md` | `agentic-system/evaluation/*.md` (incl. delta-threshold release gates) | `evaluation-and-agents.md`, `rag-and-vector-stores.md` | High |
| Guardrails, safety, PII, defense-in-depth | — | `agentic-system/safeguarding.md` (incl. regulated-industry constraints) | `responsible-ai-and-security.md`, `bedrock.md#guardrails` | High |
| Context engineering, context window management | `llm/foundations/practical-questions.md` | `agentic-system/context-engineering.md` | `bedrock.md` (prompt caching only) | Low |
| Vector DB indexing algorithms (HNSW/IVF/LSH) | — | `agentic-system/indexing.md`, `agentic-system/vectorstore-settings.md` | `rag-and-vector-stores.md` (OpenSearch HNSW tuning) | Low-moderate |
| Prompt/prefix caching, node caching, semantic caching, checkpoints | — | `agentic-system/caching.md` | `bedrock.md` (prompt caching) | Low-moderate |
| POC-to-production cost/latency modeling, reliability controls (retry/circuit-breaker/fallback placement), failure modes by architecture | — | `agentic-system/production/cost-latency-reliability.md` | (no AWS-specific counterpart yet) | Low |
| Use-case feasibility, sizing, ROI/business-value mapping | — | `agentic-system/production/feasibility-and-sizing.md` | (no AWS-specific counterpart yet) | Low |
| Enterprise integration layers (entry point, identity/SSO, authorization, data-handling/PII, observability instrumentation) | — | `agentic-system/production/enterprise-integration.md` | `responsible-ai-and-security.md` (partial: IAM/PII service selection) | Moderate |
| Structured A/B testing, shadow testing, observability-at-scale, failure-mode taxonomy | — | `agentic-system/production/experimentation-and-observability.md` | (no AWS-specific counterpart yet) | Low |
| Classical search/CSP, DL foundations, ML fundamentals | `search-plan/**`, `dl/**`, `ml/**` (no `agentic-system/**` counterpart) | — | (no AWS-specific counterpart) | None |

## Curating From `reference/**`

The repo-wide rule in `.github/copilot-instructions.md` ("Curating Content From `reference/**`") already requires searching existing published content before curating any `reference/**` material into `docs/**` or `blog/**`. This section only adds the AI-specific routing decision on top of that:

- Most AI exam-derived concepts belong in `docs/aws/ai/**` (they are AWS-service-specific by nature); only add to `docs/ai/**` if the concept is genuinely vendor-neutral and not yet covered there.
- Once a concept is confirmed vendor-neutral, apply the `llm/**` vs. `agentic-system/**` decision rule above before picking a file — don't default to whichever tree the source material (course vs. production war-story) happens to resemble.
- Use the topic ownership table above as the first stop before deciding where a curated concept goes.
