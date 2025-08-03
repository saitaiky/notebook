---
title: "Async in Python: Power and Pitfalls"
---

Asynchronous programming is one of the key capabilities behind high-performance Python web applications. Frameworks like **FastAPI** and servers like **Uvicorn** promise concurrency, non-blocking execution, and scalable request handling. But there’s a flip side: using `async` indiscriminately can **degrade** performance and add unnecessary complexity.

This post explores both sides:

- How async enables scalable I/O-bound web applications  
- When `async/await` becomes an expensive burden for simple logic


## 1. What Async Is Really Good At

In a typical synchronous web application, each incoming request is handled by a dedicated thread (or process). When that handler performs an I/O operation—such as querying a database, calling a third-party API or reading from disk—the thread must **wait** until that operation completes. During that wait, the thread is idle and cannot serve any other request, which limits the total number of concurrent users your server can handle.

By contrast, **async** code uses an **event loop**. Rather than blocking on I/O, the loop schedules other tasks while waiting:

```mermaid
flowchart LR
  A[Incoming Request] --> B{I/O needed?}
  B -- Yes --> C[Schedule I/O]
  C --> D[Continue other tasks]
  B -- No --> E[Execute CPU work]
  D --> F[Resume when I/O completes]
  E --> G[Return response]
  F --> G
````


### ASGI: The Foundation of Async Web Frameworks

* **ASGI (Asynchronous Server Gateway Interface)** is the modern Python standard that supports both sync and async functions in web frameworks.
* It replaced WSGI, unlocking non-blocking I/O and enabling features like WebSockets and HTTP/2.
* Popular ASGI frameworks include **FastAPI**, **Starlette**, and **Quart**.

### Uvicorn: A Lightweight ASGI Server

* **Uvicorn** is built on `uvloop` (an ultra-fast event loop) and `httptools` (a fast HTTP parser).
* It provides an efficient runtime to serve ASGI apps, minimising latency and maximizing throughput.
* Using Uvicorn, a single process can handle thousands of concurrent connections without spawning new threads for each.


If you have used other languages, you may find the similar stack looks like this:

| Stack   | Runtime     | Framework |
|-------- |-------------|-----------|
| Python  | **Uvicorn** | FastAPI   |
| Node.js | Node.js     | Express   |
| PHP     | Apache/PHP-FPM | Laravel  |

## 2. When Async Becomes a Burden

Async is powerful, but it incurs **runtime costs** that are invisible in sync code. Every `async def` function:

1. **Allocates a coroutine object**
2. **Schedules it on the event loop**
3. **Suspends and resumes** at each `await` point
4. **Maintains state** for local variables and exception handling

For functions that complete in microseconds and perform no I/O, these costs can vastly outweigh any benefit.

### Case Study: A Simple Text Parser

```python
def get_claude_chunk_text(chunk) -> str:
    if isinstance(chunk.content, list):
        return ''.join(
            part.get('text', '') for part in chunk.content
            if isinstance(part, dict) and 'text' in part
        )
    return ''
```

* **What it does**: Combines text fragments from a list of dictionaries.
* **Execution time**: Typically under 50 µs.
* **I/O involvement**: None—pure CPU and memory operations.

If you convert it to `async`, you introduce unnecessary overhead:

```python
async def get_claude_chunk_text(chunk) -> str:
    ...
```

#### Overhead Breakdown

* **Coroutine creation**:  \~0.5–1 µs
* **Event loop scheduling**:  \~1–2 µs per await
* **Context switch**: Save and restore stack frames

In aggregate, these add up to **hundreds of microseconds**, turning a 50 µs function into a 200–300 µs call.


## 3. Benchmark: Sync vs Async on Fast Logic

```python
import asyncio
import time

def sync_process(data):
    return ''.join(item for item in data if item.isalpha())

async def async_process(data):
    return ''.join(item for item in data if item.isalpha())

async def benchmark(iterations=100_000):
    data = "Hello, World! 123"
    
    # Synchronous loop
    start = time.time()
    for _ in range(iterations):
        sync_process(data)
    sync_time = time.time() - start
    
    # Asynchronous loop
    start = time.time()
    for _ in range(iterations):
        await async_process(data)
    async_time = time.time() - start

    print(f"Sync time:  {sync_time:.4f}s")
    print(f"Async time: {async_time:.4f}s")
    print(f"Overhead:   {(async_time / sync_time - 1) * 100:.1f}%")

asyncio.run(benchmark())
```

**Sample output**:

```
Sync time:  0.0312s
Async time: 0.1432s
Overhead:   359.0%
```

A **3–5× slowdown** for a simple in-memory operation illustrates why unnecessary async is counterproductive.


## 4. Guidelines for Using Async in Python Web Apps

| Function Type          | Async?     | Rationale                                                                     |
| ---------------------- | ---------- | ----------------------------------------------------------------------------- |
| Quick CPU logic        | ❌ No       | Adds overhead without waiting on I/O                                          |
| Database queries       | ✅ Yes      | I/O-bound; yields control while waiting for the database                      |
| HTTP requests          | ✅ Yes      | Network I/O can block for milliseconds to seconds                             |
| File system operations | ✅ Yes      | Disk I/O can be slow, especially on networked filesystems                     |
| Long-running CPU tasks | ⚠️ Offload | Use `await asyncio.to_thread()` to run in a thread pool without blocking loop |

```python
# Offload heavy CPU-bound work to a thread
result = await asyncio.to_thread(expensive_computation, data)
```

* **Profile first**: Measure real performance before adding async.
* **Group I/O calls**: Batch requests where possible to reduce context switches.
* **Limit concurrency**: Use semaphores or pools to avoid overwhelming external services.


## 5. Conclusion: Async with Intention

Async is a **scalability enabler**, not a silver bullet:

* In **I/O-heavy** paths—database, HTTP, file operations—`async/await` unlocks high concurrency.
* In **fast, CPU-bound** paths—string parsing, simple calculations—stick to synchronous code for optimal speed.
* When in doubt, **benchmark** and **profile**: let data guide your decision.

> **Key takeaway**: Use async **where it benefits** and avoid it **where it burdens**.


## Further Reading

* [Uvicorn on GitHub](https://github.com/encode/uvicorn)
* [FastAPI Documentation](https://fastapi.tiangolo.com/)
* [AsyncIO in Python](https://docs.python.org/3/library/asyncio.html)
* [ASGI Specification](https://asgi.readthedocs.io/)

