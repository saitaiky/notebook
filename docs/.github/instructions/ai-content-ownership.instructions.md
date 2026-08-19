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

## Cross-Link Requirement

- If a topic has real coverage in both trees, each side must link to the other (e.g., a short "See also" line), not silently duplicate the explanation.
- As of the 2026-08-19 audit, `docs/ai/**` and `docs/aws/ai/**` had **zero internal cross-links** despite four high-overlap topic areas below — new edits to those topics should add the missing links rather than compound the duplication.

## Topic Ownership Table

Keep this table current. When a topic's coverage changes meaningfully (new page, new section, page split/merge), update the relevant row in the same change.

| Topic | `docs/ai/**` owner (theory) | `docs/aws/ai/**` owner (AWS application) | Overlap risk |
| --- | --- | --- | --- |
| RAG fundamentals, chunking, embeddings, vector stores | `llm/rag/*.md`, `agentic-system/chunking.md`, `agentic-system/embedding-model.md`, `agentic-system/indexing.md`, `agentic-system/vectorstore-settings.md` | `rag-and-vector-stores.md`, `bedrock.md` (Knowledge Bases) | High |
| Fine-tuning, PEFT, LoRA, prompt tuning | `llm/generative-ai-with-llm/wk2/fine-tune.md`, `wk2/peft.mdx`, `llm/foundations/rag-vs-retrain-vs-finetune.md` | `bedrock.md` (model customization), `rag-and-vector-stores.md#rag-vs-fine-tuning` | Moderate |
| Prompt engineering (zero/few-shot, CoT) | `llm/generative-ai-with-llm/wk1/transformer-promptengineering-config.md`, `wk3/reasoning.md`, `agentic-system/prompting-vs-agentic-prompting.md` | `prompt-engineering.md` | Low-moderate |
| Agents, tool use, multi-agent orchestration, MCP | `agentic-system/index.md`, `agentic-system/model-context-protocol.md`, `agentic-system/agent-to-agent.md` | `evaluation-and-agents.md`, `bedrock.md` (Bedrock Agents) | High |
| Model/agent evaluation, hallucination, LLM-as-judge | `agentic-system/evaluation/*.md`, `llm/rag/generation-systems-for-rag.md` | `evaluation-and-agents.md`, `rag-and-vector-stores.md` | High |
| Guardrails, safety, PII, defense-in-depth | `agentic-system/safeguarding.md` | `responsible-ai-and-security.md`, `bedrock.md#guardrails` | High |
| Context engineering, context window management | `agentic-system/context-engineering.md`, `llm/foundations/practical-questions.md` | `bedrock.md` (prompt caching only) | Low |
| Vector DB indexing algorithms (HNSW/IVF/LSH) | `agentic-system/indexing.md`, `agentic-system/vectorstore-settings.md` | `rag-and-vector-stores.md` (OpenSearch HNSW tuning) | Low-moderate |
| Classical search/CSP, DL foundations, ML fundamentals | `search-plan/**`, `dl/**`, `ml/**` | (no AWS-specific counterpart) | None |

## Curating From `reference/**`

The repo-wide rule in `.github/copilot-instructions.md` ("Curating Content From `reference/**`") already requires searching existing published content before curating any `reference/**` material into `docs/**` or `blog/**`. This section only adds the AI-specific routing decision on top of that:

- Most AI exam-derived concepts belong in `docs/aws/ai/**` (they are AWS-service-specific by nature); only add to `docs/ai/**` if the concept is genuinely vendor-neutral and not yet covered there.
- Use the topic ownership table above as the first stop before deciding where a curated concept goes.
