---
title: RAG Retrieval Engineering: From Keywords to Hybrid Search
description: Retrieval engineering guide for RAG systems covering metadata filters, BM25, semantic embeddings, hybrid search, fusion, and evaluation metrics.
keywords:
    - rag retrieval
    - bm25
    - semantic search
    - hybrid search
    - reciprocal rank fusion
    - precision at k
    - recall at k
    - llm retrieval metrics
sidebar_position: 2
---

# RAG Retrieval Engineering: From Keywords to Hybrid Search

If the previous note explained why RAG works, this one focuses on where it fails or succeeds in practice: retrieval quality.

A generator can only be as good as the context it receives. If retrieval misses relevant evidence or returns noisy chunks, the final answer degrades no matter how strong the LLM is.

This post breaks retrieval down into the parts you can actually tune in production.

## The Retriever's Job (Harder Than It Sounds)

A retriever must do three things under tight latency budgets:

- Find relevant documents
- Exclude irrelevant documents
- Return a ranking that gives the LLM the best chance to answer correctly

That is hard because user queries are conversational and ambiguous, while source documents are long, inconsistent, and often poorly structured.

## The Three Building Blocks

Modern production systems usually combine three techniques:

1. Metadata filtering: enforce hard constraints
2. Keyword search: reward exact term overlap
3. Semantic search: reward meaning overlap

This combination is usually called hybrid retrieval.

## Metadata Filtering: Precision Through Constraints

Metadata filtering is not a full retrieval strategy on its own. It is a guardrail.

Typical examples:

- Tenant or team isolation
- Region or language constraints
- Product, document type, or access level constraints

Why it matters:

- Fast and deterministic
- Easy to explain and debug
- Prevents clearly invalid candidates from reaching ranking

Limitation: it cannot rank relevance by itself. It only narrows the search space.

## Keyword Search: Still Essential

Keyword search remains a strong baseline because exact token match often maps directly to user intent, especially in technical domains.

### TF-IDF in one sentence

TF-IDF rewards terms that are frequent in a document but rare across the corpus.

### Why BM25 usually wins

BM25 improves on TF-IDF by handling two practical issues better:

- Term frequency saturation: repeated terms give diminishing returns
- Length normalization: long docs are not over-penalized

In real corpora with mixed document lengths, BM25 is usually the better default.

### Lab snippet: sparse retrieval with BM25

```python
BM25_RETRIEVER = bm25s.BM25(corpus=corpus)
BM25_RETRIEVER.index(TOKENIZED_DATA)
results, scores = BM25_RETRIEVER.retrieve(tokenized_query, corpus=corpus, k=top_k)
```

## Semantic Search: Matching Meaning, Not Just Words

Semantic retrieval maps both query and documents into vector space via embeddings, then ranks by vector similarity.

Advantages over keyword-only retrieval:

- Handles paraphrases and synonyms
- More robust to user wording differences
- Better recall on conceptual queries

Common similarity choices:

- Cosine similarity (most common)
- Dot product
- Euclidean distance

### Lab snippet: query embedding + top-k

```python
query_embedding = model.encode(query_clean, convert_to_tensor=True)
cosine_scores = [cosine_similarity(query_embedding, x) for x in embeddings]
top_indices = np.argsort(cosine_scores)[::-1][:top_k]
```

## Hybrid Search: Best of Both Worlds

Keyword and semantic retrieval fail in different ways. Hybrid search leverages both.

Typical pipeline:

1. Run keyword search
2. Run semantic search
3. Apply metadata filters
4. Fuse rankings
5. Return top-k

### Rank fusion (RRF)

Reciprocal Rank Fusion (RRF) combines ranked lists by rank position instead of raw scores.

Why teams like it:

- Simple and stable
- Works across heterogeneous scoring scales
- Lets either method "rescue" a relevant document

## How to Evaluate Retrieval (Before Blaming the LLM)

Good retrieval evaluation starts with ground truth relevance labels for representative queries.

Core metrics:

- Precision@k: fraction of retrieved items that are relevant
- Recall@k: fraction of all relevant items that were retrieved
- MAP@k: rewards ranking relevant items high
- MRR: measures how quickly the first relevant item appears

### Lab snippet: precision and recall helpers

```python
def precision(tp, tn, fp, fn):
    return tp / (tp + fp) if (tp + fp) > 0 else 0.0

def recall(tp, tn, fp, fn):
    return tp / (tp + fn) if (tp + fn) > 0 else 0.0
```

## Practical Tuning Order

When improving retrieval, this order is usually efficient:

1. Fix metadata constraints and obvious indexing issues
2. Tune BM25 and tokenizer behavior
3. Tune embedding model and vector search settings
4. Tune fusion and top-k
5. Re-evaluate with the same test set

This keeps changes measurable and avoids accidental regressions.

## Quick Study Note: TF-IDF vs BM25

If your corpus includes both short notes and long documents, BM25 is usually safer because it handles length effects more gracefully than plain TF-IDF.

## What to Read Next

This note gives you retrieval fundamentals. The next one moves into production-scale execution: vector databases, ANN indexing, chunking, query parsing, and reranking.