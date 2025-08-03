---
title: Async in Python vs in Javascript
---

Because I come from a javascript background. When using async in Python I like to think about what is the equivalent in Javascript world. To begin with, first you need to understand when you call an `async def` function in Python, it returns a **coroutine object**. This coroutine object has some conceptual similarities with a JavaScript **Promise**, but there are important differences worth exploring.

## Similarities

1. **Representing Future Work**:
   Both Python coroutine objects and JavaScript Promises represent tasks or operations that might not have completed yet, acting as placeholders for eventual results.
2. **Non-blocking Execution**:
   They both enable asynchronous, non-blocking programming. This means the main thread can continue executing other tasks while waiting for operations (like network requests or file I/O) to complete.
3. **Using the `await` Keyword**:
   * **Python**: Within an `async def` function, you use `await` to pause execution until another coroutine completes.
   * **JavaScript**: Within an `async` function, `await` pauses execution until a Promise resolves or rejects.
4. **Chaining Operations**:
   Both allow you to chain asynchronous tasks sequentially, providing clear and readable code.

## Key Differences

### 1. Execution Start

* **Python Coroutine**: Calling an `async def` function creates a coroutine object but does not start its execution immediately. You must explicitly schedule it using an event loop (e.g., `asyncio.run()` or `asyncio.create_task()`).
* **JavaScript Promise**: When a function returning a Promise is called, the asynchronous operation typically starts immediately or is scheduled promptly by the runtime environment.

### 2. Nature of the Object

* **Python Coroutine**: Internally implemented as generator-based objects, which can pause at each `await` expression, yielding control back to the event loop.
* **JavaScript Promise**: An object with defined states (pending, fulfilled, rejected), providing built-in methods like `.then()`, `.catch()`, and `.finally()` to manage outcomes.

### 3. Interaction with Event Loops

* **Python**: Explicitly uses an event loop (e.g., via the `asyncio` library), making it clear when and how coroutines run.
* **JavaScript**: Integrates implicitly with the runtime's built-in event loop (e.g., in browsers or Node.js), often without explicit developer interaction.

## Clarifying Example with Code

### Python Example

```python
import asyncio

async def greet():
    await asyncio.sleep(1)
    print("Hello from Python!")

coroutine_obj = greet()  # Coroutine object created, but not yet running
asyncio.run(coroutine_obj)  # Starts execution explicitly
```

### JavaScript Example

```javascript
async function greet() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Hello from JavaScript!");
}

greet();  // Immediately starts executing
```

## Clear Analogy

| Aspect                  | Python Coroutine                    | JavaScript Promise                       |
| ----------------------- | ----------------------------------- | ---------------------------------------- |
| **Conceptual Analogy**  | Recipe card (set of instructions)   | Placing an order at a restaurant         |
| **Execution Start**     | Starts only when explicitly invoked | Starts immediately upon calling          |
| **Result Availability** | Available after explicit execution  | Available as soon as operation completes |

This analogy clarifies:

* Python coroutine objects are "lazy"—execution must be explicitly triggered.
* JavaScript Promises initiate their tasks immediately.

## Importance for Developers

Understanding these nuances helps developers effectively design and debug asynchronous applications, ensuring they properly schedule and handle asynchronous tasks according to their respective language mechanisms.

This distinction is particularly valuable when working with frameworks such as FastAPI (Python) or asynchronous JavaScript frameworks, as proper management of asynchronous tasks directly impacts application performance and reliability.
