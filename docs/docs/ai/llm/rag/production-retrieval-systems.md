---
title: Production Retrieval Systems: Vector DB, ANN, Chunking, and Reranking
description: Production retrieval design for RAG at scale with vector databases, ANN indexing, chunking strategy, query parsing, and reranking.
keywords:
    - vector database
    - ann indexing
    - hnsw
    - rag chunking
    - reranking
    - weaviate
    - query parsing
    - retrieval latency
sidebar_position: 3
---

# Production Retrieval Systems: Vector DB, ANN, Chunking, and Reranking

Once retrieval works on a small corpus, the next challenge is scale.

At millions or billions of chunks, naive similarity search becomes too slow. This note is about the production stack that keeps retrieval both fast and useful.

## Why Vector Databases Become Necessary

You can prototype retrieval in a relational database. At scale, this usually breaks on latency.

The expensive step is semantic search over high-dimensional vectors. Vector databases are optimized for:

- Fast nearest-neighbor retrieval
- Vector indexing and storage
- Metadata-aware filtering
- High-throughput query serving

## Exact k-NN vs ANN

Exact k-nearest neighbors checks every vector. Complexity grows linearly with corpus size.

That is fine for thousands of vectors, painful for billions.

Approximate nearest neighbors (ANN) trades small recall loss for huge speed gains.

## HNSW in Practice

Hierarchical Navigable Small World (HNSW) is a common ANN index in production.

Mental model:

- Build a proximity graph of vectors
- Search starts in sparse upper layers for big jumps
- Search descends to dense lower layer for refinement

Why teams use it:

- Low latency at large scale
- Good quality-speed tradeoff
- Mature support across vector databases

## What Production Ingestion Really Includes

A robust ingestion path usually includes:

1. Document parsing and normalization
2. Chunking
3. Metadata propagation
4. Embedding generation
5. Sparse index setup (optional but useful)
6. ANN index build

Only then do retrieval metrics become meaningful.

## Chunking Is a First-Class Design Decision

Chunking often has more impact than model swaps.

If chunks are too large:

- Embeddings blur multiple topics
- Retrieval becomes less specific
- Prompt token cost spikes

If chunks are too small:

- Context is fragmented
- Recall may look fine while answer quality drops

A practical baseline is fixed-size chunks with overlap, then iteration with real eval data.

### Lab snippet: recursive character chunking

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100,
    separators=["\n\n", "\n", " ", ""],
)
chunks = splitter.split_text(document_text)
```

## Retrieval in a Vector DB (Weaviate Example)

### Lab snippet: near-text query

```python
response = collection.query.near_text(
    query=search_string,
    filters=where_filter,
    limit=top_k,
)
for obj in response.objects:
    print(obj.properties["content"])
```

This pattern is common across providers: query embedding, ANN lookup, optional filters, top-k output.

## Query Parsing Before Retrieval

Raw user queries often mix:

- Intent
- Constraints
- Domain entities
- Ambiguous language

Query parsing improves retrieval by converting the raw prompt into retriever-friendly form.

Common operations:

- Entity extraction
- Abbreviation expansion
- Constraint extraction
- Intent-focused rewriting

This usually improves both precision and recall.

## Reranking: Quality Layer After Fast Recall

Stage-1 ANN retrieval is optimized for speed, not perfect ranking.

Reranking solves this by scoring only top-N candidates with a stronger model.

Typical options:

- Cross-encoder reranker: strong relevance, higher cost
- ColBERT-style reranker: better token-level matching with moderate cost

Pattern used in production:

1. Fast retrieval returns candidate set
2. Reranker reorders candidates
3. Final top-k enters generation prompt

### Lab snippet: retrieval with rerank hook

```python
response = collection.query.near_text(
    query=user_query,
    limit=top_k,
    rerank=reranker,
)
```

## Practical Trade-off Framework

When tuning production retrieval, monitor these together:

- Recall and precision
- End-to-end latency
- Prompt token cost
- Downstream answer quality

A change that improves retrieval metrics but hurts answer faithfulness or latency may still be a net loss.

## What to Read Next

At this point, retrieval is production-capable: ANN for speed, chunking for context control, parsing for cleaner intent, and reranking for quality.

Next comes generation quality itself: model behavior, prompting strategy, hallucination control, and LLM evaluation.