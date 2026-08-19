---
title: RAG & Vector Stores
description: Retrieval-Augmented Generation on AWS in depth — chunking strategies, embedding models, vector store choices (OpenSearch, Aurora pgvector, DynamoDB, MemoryDB, S3 Vector Buckets), query optimization, and RAG evaluation metrics.
keywords:
  - aws
  - amazon web services
  - rag
  - retrieval augmented generation
  - vector database
  - opensearch
  - pgvector
  - embeddings
  - chunking
sidebar_position: 2
---

Retrieval-Augmented Generation grounds a model's answers in your own data by retrieving relevant text at query time and injecting it into the prompt, instead of relying only on what the model memorized during training. For the underlying theory — why ANN indexing exists, how HNSW works, and chunking/reranking mechanics — see [Production Retrieval Systems](/ai/llm/rag/production-retrieval-systems) and [From Keywords to Hybrid Search](/ai/llm/rag/retrieval-engineering) in the general AI track. The quality of a RAG system is decided less by which foundation model you pick and more by three upstream choices: how documents are chunked, how those chunks are embedded, and where the resulting vectors are stored and searched. This page works through those choices in the order they matter, then covers how to measure whether the resulting system is actually good.

## Chunking strategies

Before anything can be embedded, source documents have to be split into chunks small enough to embed and retrieve individually, and the splitting strategy directly controls retrieval quality — a chunk that mixes two unrelated topics dilutes the embedding for both, while a chunk that's too small loses the surrounding context the model needs to answer correctly.

- **Fixed-size chunking**: Splits text every N tokens/characters regardless of content boundaries. It's the simplest and cheapest strategy, but it routinely cuts a sentence or a table row in half, which can leave a chunk that's technically "about" the query but missing the detail that would actually answer it.
- **Hierarchical chunking**: Produces two tiers of chunks — small **child chunks** that are what actually gets embedded and matched against the query, and larger **parent chunks** that provide surrounding context. When a child chunk matches, its parent (not just the child) is passed to the model, so the generation step gets full context even though the precise, narrow child chunk is what drove the match.
- **Semantic chunking**: Uses embedding similarity to find natural topic boundaries in the text, producing variable-length chunks that stay coherent around a single idea instead of splitting at an arbitrary character count. This is more expensive to compute at ingestion time but tends to produce cleaner retrieval because each chunk is topically self-contained.
- **Overlap-aware chunking**: Adds a small window of shared text between consecutive chunks (fixed-size or semantic) so that a sentence spanning a chunk boundary still appears whole in at least one chunk, preventing information from being silently lost at the seam.

:::tip Exam wording cue
"Chunks lose surrounding context needed for generation" almost always points to **hierarchical chunking** (parent chunk provides context) rather than simply increasing chunk size, which reintroduces the original problem of mixing topics.
:::

Bedrock Knowledge Bases implement all of these chunking strategies as ingestion-time configuration, so switching strategies is a configuration change rather than a pipeline rewrite — worth knowing because it means "chunking isn't working well" is rarely a reason to abandon Knowledge Bases for a custom pipeline.

## Embedding models and dimensionality trade-offs

An embedding model converts a chunk of text into a fixed-length vector of numbers positioned so that semantically similar text ends up close together in vector space; retrieval is then just a nearest-neighbor search in that space.

- **Amazon Titan Text Embeddings (V1/V2)**: Bedrock's native embedding models, configurable to output vectors at multiple dimensionalities (commonly 256, 512, or 1024 dimensions) from the same model.
- **Cohere Embed Multilingual**: Maps over 100 languages into a single shared vector space, which enables **cross-lingual retrieval** — a query written in one language can match source documents written in a different language, without a separate translation step.

The dimensionality choice is a direct trade-off: higher-dimensional vectors (1024D) capture more semantic nuance and generally produce more precise matches, but cost more to store and are slower to search at scale; lower-dimensional vectors (256D) are cheaper and faster but lose some of that nuance. Critically, increasing dimensionality is not a fix for poor chunking or a missing reranking step — a well-chunked corpus with 256D embeddings will often outperform a poorly-chunked corpus with 1024D embeddings, because dimensionality only affects how much detail is captured per chunk, not whether the chunk boundaries make sense in the first place.

## Choosing a vector store

Bedrock Knowledge Bases can persist embeddings into several different backing stores, and each one targets a different operational profile rather than a strict "better/worse" ranking:

| Vector store | Best fit | Key characteristic |
|---|---|---|
| **OpenSearch Serverless / Service** | Large-scale search with hybrid keyword + semantic ranking | k-NN (approximate nearest neighbor) vector search combined with BM25 keyword search in a single query; full control over sharding, replicas, and ANN tuning |
| **Aurora PostgreSQL + pgvector** | Teams already running relational workloads that also need vector search | Native ACID transactions and ordinary SQL `WHERE` filtering alongside vector similarity; Aurora Serverless v2 scales compute down to near-zero when idle |
| **Amazon DynamoDB** | Simple RAG use cases already using DynamoDB for the application | Lower operational overhead than standing up a search cluster, at the cost of less sophisticated ranking/filtering |
| **Amazon MemoryDB for Redis** | Low-latency conversational memory (not bulk document retrieval) | In-memory vector storage suited to session/chat-history lookups where microsecond latency matters more than corpus size |
| **Amazon S3 Vector Buckets** | Intermittent or low-volume vector workloads | Pay-per-request pricing with no cluster to size or manage, eliminating idle-capacity cost entirely |

For OpenSearch specifically, retrieval quality and speed are governed by the **HNSW (Hierarchical Navigable Small World)** ANN algorithm's tuning parameters: `ef_construction` controls how thorough the index build is (higher = better recall, slower indexing), and `ef_search` controls how thorough each query's search is (higher = better recall, slower queries). OpenSearch can also combine k-NN and BM25 scores in a single **hybrid search** query — using a normalization step (e.g., min-max) and a combination function (e.g., arithmetic mean) to blend the two rankings — which matters because pure vector search alone tends to miss exact-match lookups like part numbers, invoice IDs, or product SKUs that a keyword search would catch instantly.

:::danger Exam trap
Don't default to OpenSearch just because a requirement mentions "semantic search." If the requirement is a ready-made enterprise assistant, that's Amazon Q Business; if it's managed retrieval wired directly into a Bedrock agent/prompt with no custom vector-store integration, that's Bedrock Knowledge Bases. Reach for OpenSearch directly only when you need hybrid search, custom ANN tuning, or index control that the managed options don't expose.
:::

## Query-time optimization: expansion, reranking, and caching

Even with good chunking and the right vector store, a single raw similarity search is often not the final answer — production RAG pipelines typically add one or more of the following steps between the user's query and the prompt sent to the model:

- **Query expansion**: Before retrieval, a lightweight model reformulates the user's query with related terms or rephrasings, widening the set of chunks that can match. This increases recall (fewer relevant chunks missed) but also raises the risk of noisy, tangential matches, which is why expansion is normally paired with reranking rather than used alone.
- **Reranking**: Retrieval first pulls a broad candidate set (a large Top-K) using a fast, cheap method, and then a separate, more precise reranking model reorders just those candidates by true relevance to the query before the top few are sent to the model. Bedrock exposes this as a `rerankingConfiguration` on the `Retrieve`/`RetrieveAndGenerate` API, backed by models like Amazon Rerank 1.0 or Cohere's reranker. This two-stage design exists because increasing Top-K alone just adds more noisy context to the prompt — it doesn't improve which chunks are actually most relevant, which is exactly what reranking is for.
- **Semantic caching**: Embeddings of previous user queries are cached (in ElastiCache or a vector store), so a new query that's semantically similar to one already answered can be served from cache instead of re-running retrieval and generation. This is a cost/latency win for repeated question patterns (FAQ-style traffic) but provides no benefit for genuinely novel, one-off queries.
- **Context pruning**: Before the final prompt is assembled, irrelevant or redundant retrieved chunks are dropped, which reduces token usage and — just as importantly — reduces the chance the model gets distracted by tangential context and produces a less focused answer.

## Measuring RAG quality

Because a RAG pipeline has two distinct stages, evaluating it well means measuring retrieval and generation separately rather than judging the whole pipeline by a single end-to-end score:

- **Retrieval quality**: **Precision** (what fraction of retrieved chunks are actually relevant) and **recall** (what fraction of all relevant chunks were retrieved), often combined into an **F1** score. Poor precision usually means chunking or reranking needs work; poor recall usually means chunking, embedding choice, or Top-K needs work.
- **Generation quality**: **Faithfulness** (is the generated answer actually supported by the retrieved chunks, or does it go beyond them), **hallucination** (does the answer state things not present in any retrieved source), **answer relevance** (does the answer actually address what was asked), and **context relevance** (did the retrieved chunks semantically match the query in the first place).

Bedrock's Model Evaluation jobs can compute these generation-quality metrics automatically (see [model evaluation](./evaluation-and-agents.md#model-evaluation) for the broader evaluation workflow), and Bedrock Guardrails' **contextual grounding check** applies a similar idea live in production: a `GROUNDING` filter verifies the response is supported by the retrieved source, and a separate `RELEVANCE` filter verifies the response actually addresses the query, each with its own configurable threshold (e.g., 0.7).

:::warning Exam trap
A RAG system with low faithfulness/high hallucination is a retrieval-and-grounding problem, not necessarily a "the model is bad" problem. The fix path is usually: check chunking, check whether the reranker is deployed, and check the contextual grounding threshold — not swapping to a larger, more expensive foundation model.
:::

## RAG vs. fine-tuning

RAG and fine-tuning both adapt a foundation model to a specific domain, but they intervene at different points: fine-tuning permanently changes the model's weights using labeled training examples, while RAG leaves the weights untouched and instead injects relevant, current information into the prompt at inference time.

That difference in mechanism is also what decides which one to reach for. Fine-tuning is the right tool for teaching a new *behavior*, *style*, or *output format* that should persist across every future request — it's not a good way to keep the model current on facts that change often, since every factual update would require another training run. RAG is the right tool exactly for that changing-facts case: pricing, inventory levels, current policies, or any other proprietary/frequently updated information stays current because it's retrieved fresh at query time rather than baked into weights.

:::danger Common exam trap
If a scenario emphasizes needing accurate answers "without retraining" or mentions frequently changing source data (pricing, inventory, policy documents), the answer is RAG, not fine-tuning — fine-tuning cannot economically keep pace with data that changes on a daily or weekly basis.
:::
