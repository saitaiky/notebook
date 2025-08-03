---
title: Cache
sidebar_position: 4
---

Language models are powerful, but they can also be expensive and slow when called repeatedly with similar inputs. LangChain offers elegant caching mechanisms that help mitigate latency and cost, especially when prototyping or running high-throughput applications.

In this post, we’ll walk through why caching matters, how to implement it using LangChain, and show some real-world examples of how caching improves both response time and CPU usage.

## Why Use Caching in LLM Apps?

Without caching:
- Repeated prompts are sent to the LLM, incurring costs.
- Every call takes up valuable computation time.

With caching:
- Previously computed results are returned instantly.
- You save money and reduce model latency.

According to the offical document [How to cache chat model responses](https://python.langchain.com/docs/how_to/chat_model_caching/) and [Lanchina: Redis](https://python.langchain.com/docs/integrations/providers/redis/), there are various backends for caching that LangChain supports:
- In-memory (for quick prototyping)
- SQLite (lightweight persistent cache)
- Redis (fast and scalable networked cache)

Caching provides a lot of value, but each benefit often comes with its own considerations or implementation challenges. Here are some example pairings of utilities and related challenges:

| Utility                       | Related Challenge                                                        |
|------------------------------|---------------------------------------------------------------------------|
| **Latency reduction**        | **Cache invalidation**: Ensuring responses remain fresh over time         |
| **Cost savings**             | **Memory/storage management**: Storing many responses can consume space   |
| **Improved UX**              | **Deterministic hashing**: Slight prompt changes may bypass cache         |
| **Reproducibility**          | **Security**: Sensitive inputs should not be leaked via persistent caches |

Note: These are not strict one-to-one relationships, but rather illustrative pairings that highlight trade-offs to consider when implementing caching.


## Setting Up Caching in LangChain

```python
from langchain.llms import OpenAI
from langchain.globals import set_llm_cache
from langchain.cache import InMemoryCache

# Enable in-memory caching
set_llm_cache(InMemoryCache())

llm = OpenAI(temperature=0)

# First call – hits the LLM and stores in cache
response1 = llm.invoke("What is the capital of France?")
# Second call – retrieves from cache
response2 = llm.invoke("What is the capital of France?")
```

You can swap in other cache types:

```python
from langchain.cache import SQLiteCache, RedisCache

# SQLite
set_llm_cache(SQLiteCache(database_path=".langchain.db"))

# Redis
set_llm_cache(RedisCache(redis_url="redis://localhost:6379/0"))
```

## Measuring Performance: CPU & Wait Time

Let’s simulate an example to compare performance with and without caching:

```python
import time
from langchain.llms import OpenAI
from langchain.globals import set_llm_cache
from langchain.cache import InMemoryCache

llm = OpenAI(temperature=0)

# Without cache
start = time.time()
llm.invoke("List 5 famous painters")
no_cache_time = time.time() - start

# With cache
set_llm_cache(InMemoryCache())
llm.invoke("List 5 famous painters")  # First call caches it
start = time.time()
llm.invoke("List 5 famous painters")  # Cached call
cache_time = time.time() - start

print(f"Without cache: {no_cache_time:.2f} sec")
print(f"With cache: {cache_time:.5f} sec")
```

**Example Output:**
```python
# The exact numbers: (1.4207510948181152, 5.5789947509765625e-05)
Without cache: 1.42 sec
With cache: 0.00005 sec
```

Caching can improve response times by **orders of magnitude**.

## 💡 Best Practices

- Use **in-memory caching** for quick prototyping.
- Use **SQLite or Redis** for persistent or distributed setups.
- Hash prompts deterministically to ensure cache hits.
- Monitor and expire stale cache entries in production.

## Final Thoughts

Caching is one of the simplest yet most effective optimisations you can make in your LangChain-powered LLM applications. It makes your app faster, cheaper, and more responsive.

In production systems or user-facing apps, combining caching with rate limits, streaming responses, and smart batching leads to even greater efficiency.

