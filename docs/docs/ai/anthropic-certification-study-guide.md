---
title: "Anthropic Certification Study Guide"
description: "A module-by-module reading map from Anthropic's Claude Certified Developer Foundations and Claude Certified Architect Professional prep courses to the corresponding notes on this site."
sidebar_position: 2
keywords:
  - anthropic certification
  - claude certified developer
  - claude certified architect
  - certification study guide
  - claude code
  - agentic systems
---

This guide maps the official Anthropic certification-preparation modules to the corresponding pages on this site. It is a **reading route**, not a replacement for the official courses or an exam blueprint: Anthropic's modules define the certification scope, while these pages provide deeper explanations, implementation context, and cross-links to related engineering topics.

Product names, model identifiers, limits, beta features, and platform behavior change quickly. Use the conceptual pages here to understand the decisions, then verify product-specific facts against Anthropic's current documentation before applying them or sitting the exam.

## How to Use This Guide

Use [Anthropic Certification Questions and Answers](/ai/anthropic-certification-study-questions) to review commonly misunderstood concepts. Each entry gives a direct answer and links to the deeper topic page.

For each module:

1. Complete the linked official course module.
2. Read the **primary pages** listed here and reproduce their main decision rules from memory.
3. Use the supplementary pages to close gaps or connect the module to production architecture.
4. Return to the official module for product-specific names, current limits, and exam wording.

The underlying course captures and practice material used to curate these notes remain under the private `reference/` archive and are not published by Docusaurus.

## Claude Certified Developer — Foundations

Start with the official [Claude Certified Developer — Foundations Prep Course](https://anthropic-partners.skilljar.com/path/claude-certified-developer-foundations). This path is implementation-focused: model/API foundations, prompts and tools, Claude Code and MCP, production engineering, and reusable delivery assets.

| Official module | Read on this site | Coverage note |
| --- | --- | --- |
| [MSO Foundations](https://anthropic-partners.skilljar.com/path/claude-certified-developer-foundations/mso-foundations) — 57 min | **[Transformer Prompt Engineering and Configuration](/ai/llm/generative-ai-with-llm/wk1/transformer-promptengineering-config)**; **[Cost, Latency, and Reliability](/ai/agentic-system/production/cost-latency-reliability)**; [Caching](/ai/agentic-system/caching); [Rate Limit](/ai/agentic-system/rate-limit) | Covers model configuration, token/cost behavior, caching, rate limits, async concurrency, and batch processing. Use the official module for current SDK syntax and streaming details. |
| [Production-Grade Prompting, Agents & Tool Use](https://anthropic-partners.skilljar.com/path/claude-certified-developer-foundations/production-grade-prompting-agents-tool-use) — 209 min | **[Prompting vs Agentic Prompting](/ai/agentic-system/prompting-vs-agentic-prompting)**; **[Context Engineering](/ai/agentic-system/context-engineering)**; **[Model Context Protocol](/ai/agentic-system/model-context-protocol)**; [RAG Foundations](/ai/llm/rag/rag-foundations); [Evaluation](/ai/agentic-system/evaluation) | Covers governed prompts, context selection, tools, retrieval, agent loops, and the evaluation needed to trust them. |
| [Claude Code, MCP & Integration](https://anthropic-partners.skilljar.com/path/claude-certified-developer-foundations/claude-code-mcp-integration) — 142 min | **[Claude Code Configuration and Permissions](/ai/agentic-system/claude-code-configuration)**; **[Durable Project Context](/ai/agentic-system/durable-project-context)**; **[Model Context Protocol](/ai/agentic-system/model-context-protocol)**; [Enterprise Integration](/ai/agentic-system/production/enterprise-integration); [Team Enablement and Operational Support](/ai/agentic-system/production/team-enablement-and-operational-support) | Covers permission modes, settings precedence, CLAUDE.md, rules, hooks, subagents, MCP transport/scope, authentication, secrets, and shared skills. |
| [Production Engineering, Evals & Security](https://anthropic-partners.skilljar.com/path/claude-certified-developer-foundations/production-engineering-evals-security) — 211 min | **[Evaluation](/ai/agentic-system/evaluation)**; **[Testing and Tracing](/ai/agentic-system/testing-and-tracing)**; **[Rate Limits and Failure Handling](/ai/agentic-system/rate-limit)**; **[Model Selection in Production](/ai/agentic-system/model-selection)**; **[Safeguarding Agentic Systems](/ai/agentic-system/safeguarding)**; [Cost, Latency, and Reliability](/ai/agentic-system/production/cost-latency-reliability); [Experimentation and Observability at Scale](/ai/agentic-system/production/experimentation-and-observability) | Covers graded evals and calibrated judges, test levels and tracing, retriable-vs-terminal failure handling, model-tier selection, cost/caching/orchestration budgets, the reliability floor, and the secure-agent boundary. The flagged points are answered on the [certification Q&A page](/ai/anthropic-certification-study-questions#production-engineering-evals-and-security). |
| [Accelerators & IP Contribution](https://anthropic-partners.skilljar.com/path/claude-certified-developer-foundations/accelerators-ip-contribution) — 155 min | **[Team Enablement and Operational Support](/ai/agentic-system/production/team-enablement-and-operational-support)** (packaging for reuse, contribution channels); **[Deployment Platform Selection](/ai/agentic-system/production/deployment-platforms)**; **[Feasibility and Use-Case Sizing](/ai/agentic-system/production/feasibility-and-sizing)** (functional vs infrastructure requirements); [Safeguarding](/ai/agentic-system/safeguarding#trust-boundaries-across-a-multi-component-application) (multi-component trust boundaries) | Covers packaging assets for reuse, matching a contribution to its channel, turning a business problem into checkable requirements, choosing a deployment platform (first-party / AWS / Bedrock / Vertex / Foundry), version pinning, and whole-application least privilege. The flagged points are answered on the [certification Q&A page](/ai/anthropic-certification-study-questions#accelerators-and-ip-contribution). Use the official module for current IP/licensing rules and managed-platform packaging mechanics. |

## Claude Certified Architect — Professional

Start with the official [Claude Certified Architect — Professional Prep Course](https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional). This path is architecture-focused: translating an ambiguous requirement into a defensible design, moving it into production, governing risk, winning stakeholder agreement, and leaving the operating team self-sufficient.

| Official module | Read on this site | Coverage note |
| --- | --- | --- |
| [Claude Platform & Solution Design](https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional/claude-platform-solution-design) — 238 min | **[Feasibility and Use-Case Sizing](/ai/agentic-system/production/feasibility-and-sizing)**; **[Prompting vs Agentic Prompting](/ai/agentic-system/prompting-vs-agentic-prompting)**; [Model Context Protocol](/ai/agentic-system/model-context-protocol); [Agent-to-Agent Communication](/ai/agentic-system/agent-to-agent); [Discovery Interviews](/software-development/interview/customer-interview/discovery) | Covers requirement decomposition, model/task fit, sizing, architecture boundaries, protocol selection, and discovery questions. |
| [Enterprise Integration & Production](https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional/enterprise-integration-production) — 158 min | **[Production Readiness](/ai/agentic-system/production)**; **[Enterprise Integration](/ai/agentic-system/production/enterprise-integration)**; **[Cost, Latency, and Reliability](/ai/agentic-system/production/cost-latency-reliability)**; [Experimentation and Observability at Scale](/ai/agentic-system/production/experimentation-and-observability); [Evaluation](/ai/agentic-system/evaluation) | Covers POC-to-production constraints, identity, authorization, secret handling, cost/latency modeling, reliability controls, SLAs, and observability. |
| [Responsible AI, Safety & Risk for Architects](https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional/responsible-ai-safety-risk-for-architects) — 114 min | **[Safeguarding Agentic Systems](/ai/agentic-system/safeguarding)**; **[Fairness, Oversight, and Compliance](/ai/agentic-system/fairness-oversight-and-compliance)**; [Enterprise Integration](/ai/agentic-system/production/enterprise-integration); [Experimentation and Observability at Scale](/ai/agentic-system/production/experimentation-and-observability) | Covers the safety stack, fail-open/closed decisions, human-review routing, fairness entry points, decision evidence, regulated constraints, and live control verification. |
| [Stakeholder Engagement, Lifecycle & GTM](https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional/stakeholder-engagement-lifecycle-gtm) — 178 min | **[Discovery Interviews](/software-development/interview/customer-interview/discovery)**; **[Demo Interviews](/software-development/interview/customer-interview/demo)**; **[Handling Customer Objections](/software-development/interview/customer-interview/handle-objection)**; [Feasibility and Use-Case Sizing](/ai/agentic-system/production/feasibility-and-sizing); [Experimentation and Observability at Scale](/ai/agentic-system/production/experimentation-and-observability) | Covers requirements translation, scenario-specific demos, trade-off communication, reversal cost, business metrics, feedback-loop governance, and outcome evidence. |
| [Team Enablement & Operational Productivity](https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional/developer-productivity-enablement) — 45 min | **[Team Enablement and Operational Support](/ai/agentic-system/production/team-enablement-and-operational-support)**; **[Claude Code Configuration and Permissions](/ai/agentic-system/claude-code-configuration)**; [Durable Project Context](/ai/agentic-system/durable-project-context); [Skill Supply-Chain Security](/ai/agentic-system/safeguarding#skill-supply-chain-security) | Covers governed rollout, reusable-skill distribution, AI-assisted development diligence, deterministic controls, symptom-to-cause support, runbooks, and escalation ownership. |

## Choosing Between the Two Paths

Choose **Developer Foundations** when your immediate goal is to build and operate Claude integrations directly: prompts, tools, Claude Code, MCP, evals, security controls, and reusable implementation assets.

Choose **Architect Professional** when your goal is to make and defend system-level decisions: feasibility, platform and integration choices, production constraints, responsible AI, stakeholder alignment, and team adoption. The paths overlap intentionally. Developer Foundations asks how a mechanism works in implementation; Architect Professional asks when that mechanism belongs in a defensible enterprise design and how to govern it across its lifecycle.
