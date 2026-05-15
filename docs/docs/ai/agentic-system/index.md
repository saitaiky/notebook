---
title: "Agentic Systems"
description: "A practical catalog for building agentic and generative AI systems, covering protocols, retrieval implementation, evaluation, orchestration patterns, and operational controls."
keywords:
  - ai
  - agentic system
  - agents
  - orchestration
  - retrieval systems
  - model context protocol
  - agent-to-agent
  - production ai
---

This section is the engineering side of my AI notes. I use it to organize the decisions that show up when a model stops being an isolated demo and becomes part of a real system with tools, retrieval, routing, safety controls, evaluation loops, and operational constraints.

That means this section is not primarily a theory-first course track. The point here is not to re-teach the full model background behind language models or deep learning. The point is to answer questions such as: how should context be routed, how should retrieval be configured, when does an agent protocol help, how should tool boundaries be exposed, and what usually breaks once a system is under real traffic and cost constraints.

:::info Scope

If the goal is to study transformer concepts, language-model background, or course-style explanations, the better entry point is [LLM Overview](/ai/llm). If the goal is representation learning, sequence models, or multimodal generation mechanisms, the better entry point is [Deep Learning Overview](/ai/dl).

:::

## What Belongs Here

I treat this section as a catalog of implementation layers that sit around or on top of models.

- **Protocols and interfaces**: how systems expose capabilities and communicate across process boundaries.
- **Retrieval system design**: how chunking, embeddings, indexing, and vector-store choices affect downstream behavior.
- **Agentic patterns**: how supervisors, planners, prompt scaffolds, and multi-step flows change execution.
- **Operations and controls**: how caching, rate limiting, safeguarding, and evaluation keep a system usable in production.

These topics overlap with LLM ideas in vocabulary, but not in job. The same word may appear in both sections while serving different purposes. For example, retrieval can appear in both places, but here the emphasis is on implementation trade-offs rather than on introductory explanation.

## How To Read This Section

There are a few practical entry paths depending on the kind of problem being solved.

If the immediate problem is **system integration**, start with [Model Context Protocol (MCP) Architecture](/ai/agentic-system/model-context-protocol) and [Agent-to-Agent Communication Architectures](/ai/agentic-system/agent-to-agent). Those pages explain the interface layer for tool access, composition, delegation, and multi-agent execution.

If the immediate problem is **retrieval quality**, start with [RAG Implementation](/ai/agentic-system/rag-implementation), then move through [Chunking](/ai/agentic-system/chunking), [Embedding Model](/ai/agentic-system/embedding-model), [Indexing](/ai/agentic-system/indexing), and [Vectorstore Settings](/ai/agentic-system/vectorstore-settings). That path is closer to a retrieval-systems handbook than a conceptual primer.

If the immediate problem is **runtime behavior**, use [Caching](/ai/agentic-system/caching), [Rate Limit](/ai/agentic-system/rate-limit), and [Safeguarding](/ai/agentic-system/safeguarding) as the operational starting points. These pages belong to the part of the stack where cost, latency, abuse, and failure modes become visible.

If the immediate problem is **workflow design**, use [Prompting vs Agentic Prompting](/ai/agentic-system/prompting-vs-agentic-prompting), [Context Engineering](/ai/agentic-system/context-engineering), and the material under the `patterns` and `evaluation` subfolders to think through orchestration and measurement rather than raw model capability.

## Section Map

The current material naturally groups into four clusters.

### Protocols and Architecture

This cluster covers how capabilities are exposed and composed across services or agents.

- [Model Context Protocol (MCP) Architecture](/ai/agentic-system/model-context-protocol)
- [Agent-to-Agent Communication Architectures](/ai/agentic-system/agent-to-agent)
- [LangGraph vs Other Products](/ai/agentic-system/langraph-vs-other-products)

### Retrieval Systems

This cluster covers the implementation choices that determine whether retrieval is cheap, stable, and useful in practice.

- [RAG Implementation](/ai/agentic-system/rag-implementation)
- [Chunking](/ai/agentic-system/chunking)
- [Embedding Model](/ai/agentic-system/embedding-model)
- [Indexing](/ai/agentic-system/indexing)
- [Vectorstore Settings](/ai/agentic-system/vectorstore-settings)

### Workflow and Prompt Design

This cluster covers how tasks are structured once a single prompt is no longer enough.

- [Prompting vs Agentic Prompting](/ai/agentic-system/prompting-vs-agentic-prompting)
- [Context Engineering](/ai/agentic-system/context-engineering)
- Content under `patterns/`

### Operations, Safety, and Evaluation

This cluster covers the pages that matter when the system is already working but not yet dependable.

- [Caching](/ai/agentic-system/caching)
- [Rate Limit](/ai/agentic-system/rate-limit)
- [Safeguarding](/ai/agentic-system/safeguarding)
- Content under `evaluation/`

## Relationship To The LLM Section

The easiest way to think about the split is this.

The [LLM Overview](/ai/llm) section is where I keep study notes about how language models work, how the ideas evolved, and how course material fits together. This section is where I keep the engineering notes for using those models inside systems.

That distinction matters because it keeps both sections readable. If I mix conceptual study notes and production design notes in the same place, pages become confused about whether they are teaching fundamentals or making implementation decisions. I would rather keep the two layers close and cross-linked than force them into one folder.

## What To Read Next

If you want the model-side background first, go to [LLM Overview](/ai/llm). If you want the broader AI curriculum around search, machine learning, and deep learning, go back to [AI Overview](/ai). If you already know the model basics and want a concrete systems entry point, start with [RAG Implementation](/ai/agentic-system/rag-implementation) or [Model Context Protocol (MCP) Architecture](/ai/agentic-system/model-context-protocol).
