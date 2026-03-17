---
title: RAG Lab Snippet Map
description: Cross-reference map from each RAG note to concrete code snippets in the corresponding lab notebooks.
keywords:
    - rag labs
    - notebook snippet map
    - rag study guide
    - weaviate examples
    - bm25 example
    - tracing rag pipeline
    - prompt engineering labs
sidebar_position: 6
---

# RAG Lab Snippet Map

This page maps each module note to concrete notebook code in `docs/ai/llm/rag/labs`.

## RAG Foundations in Practice

Source notebook: `rag-1/C1M1_Assignment.ipynb`

```python
# Retriever output + query are merged into a grounded prompt
context = "\n\n".join(retrieved_chunks)
prompt = f"Question: {query}\n\nContext:\n{context}\n\nAnswer using only the context."
```

## Retrieval Engineering: Keywords to Hybrid Search

Source notebooks:
- `rag-2/3-Implement Retrival/C1M2_Assignment.ipynb`
- `rag-2/2-Retrieval metrics/C1M2_Ungraded_Lab_2.ipynb`

```python
BM25_RETRIEVER = bm25s.BM25(corpus=corpus)
BM25_RETRIEVER.index(TOKENIZED_DATA)
results, scores = BM25_RETRIEVER.retrieve(tokenized_query, corpus=corpus, k=top_k)
```

```python
def precision(tp, tn, fp, fn):
    return tp / (tp + fp) if (tp + fp) else 0.0

def recall(tp, tn, fp, fn):
    return tp / (tp + fn) if (tp + fn) else 0.0
```

## Production Retrieval Systems

Source notebooks:
- `rag-3/2-Chunking/C1M3_Ungraded_Lab_2.ipynb`
- `rag-3/1-Weaviate API/C1M3_Ungraded_Lab_1.ipynb`
- `rag-3/3-RAG Systems with a Vector Database/C1M3_Assignment.ipynb`

```python
def get_chunks_fixed_size_with_overlap(text, chunk_size, overlap_fraction):
    words = text.split()
    overlap = int(chunk_size * overlap_fraction)
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunks.append(" ".join(words[max(i - overlap, 0): i + chunk_size]))
    return chunks
```

```python
client = weaviate.connect_to_embedded(
    persistence_data_path="/home/jovyan/data/collections/m3/ungraded_lab_2"
)
collection = client.collections.get("Faq")
```

## Generation Systems for RAG

Source notebooks:
- `rag-4/1-Exploring LLM Capabilities/C1M4_Ungraded_Lab_1.ipynb`
- `rag-4/2-Prompt Engineering/C1M4_Ungraded_Lab_2.ipynb`
- `rag-4/3-Developing a RAG-based Chatbot/C1M4_Assignment.ipynb`

```python
messages = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": user_prompt},
]
response = llm_client.chat.completions.create(model=model_name, messages=messages)
```

## RAG in Production

Source notebooks:
- `rag-5/1-Tracing A RAG System/C1M5_Ungraded_Lab_1.ipynb`
- `rag-5/2-Chatbot/C1M5_Assignment.ipynb`

```python
tracer_provider_phoenix = register(
    project_name=phoenix_project_name,
    endpoint="http://127.0.0.1:6006/v1/traces",
)
tracer = tracer_provider_phoenix.get_tracer(__name__)
```

```python
with tracer.start_as_current_span("query_weaviate", openinference_span_kind="retriever") as span:
    chunks = client.collections.get("Faq")
```
