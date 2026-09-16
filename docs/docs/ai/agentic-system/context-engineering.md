---
title: Context Engineering
description: 'Modern agents interleave LLM calls with tool use, scratchpads, and persistence. While foundation models keep improving, their outputs are limited by a finite cont.'
keywords:
  - ai
  - agentic system
  - context engineering
  - context
  - engineering
  - modern
  - agents
  - interleave
---

## Why Context Engineering Matters

Modern agents interleave LLM calls with tool use, scratchpads, and persistence. While foundation models keep improving, their outputs are limited by a **finite context window** — think of it as the RAM for an LLM “CPU.”

* If context is managed poorly, agents suffer:
    * **[Context poisoning](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html?ref=blog.langchain.com#context-poisoning)** → when a hallucination or bad data slips into context and contaminates reasoning.
    * **[Context distraction](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html?ref=blog.langchain.com#context-distraction)** → when too much context overwhelms the model and lowers accuracy.
    * **[Context confusion](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html?ref=blog.langchain.com#context-confusion)** → when irrelevant or superfluous details bias the response.
    * **[Context clash](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html?ref=blog.langchain.com#context-clash)** → when different parts of the context contradict each other, reducing consistency.

👉 Context engineering is the **discipline of filling the context window intelligently** — ensuring the right data, in the right format, with the right tools, at the right time.

This is becoming the **#1 job of AI engineers** because bigger models and longer context lengths don’t solve the deeper issue: *which information matters most right now, and how should it be delivered?*

## The Four Core Strategies of Context Engineering

LangChain’s framework highlights four complementary strategies:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/4GiqzUHD5AA?si=hDfyKwFfMz2h9IMM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

* **Write Context**  
    * ![supervisor-diagram](/img/ai/agentic-system/write-context.png)  
    * Store knowledge *outside* the context window for later reuse.  
    * Examples: scratchpads for intermediate reasoning; memories (short-term or long-term) for persistence.  
* **Select Context**  
    * Choose the most relevant subset to bring back into the window.  
    * Approaches: embeddings, retrieval rules, knowledge graphs, policies.  
    * Challenge: *wrong selection feels like hallucination*, even if the model is accurate.  
* **Compress Context**  
    * ![supervisor-diagram](/img/ai/agentic-system/compress-context.png)  
    * Fit more signal into fewer tokens.  
    * Techniques: summarisation, clustering, higher-level abstraction.  
    * Benefits: reduces cost, latency, and distraction while retaining essentials.  
* **Isolate Context**  
    * Separate streams so they don’t interfere.  
    * Examples: keep execution logs apart from system instructions; route different tasks through different subgraphs; isolate tool access as well as text.  

:::info Prompt vs Context Engineering
Prompt engineering is just one piece of this puzzle — focused on clever wording inside a single prompt.  
**Context engineering is broader:** it designs the *entire dynamic system* that decides which information, examples, tools, and formats get delivered to the model at runtime.
:::

## Combining Context Strategies in Practice

The Write/Select/Compress/Isolate framework above answers *what* to do with context. A second, complementary question is *how much of the window to fill and when* — and that question is easiest to reason about along a spectrum from loading everything up front to loading almost nothing until it's needed.

* **Monolithic** — load the full task context into a single prompt: the whole document, the whole conversation history, the whole retrieved corpus. It's simple, and it's the right call for a bounded task with a predictable input size or a stable prefix worth caching. It breaks down the moment context accumulates turn over turn, because cost and latency scale linearly with input length and a long-enough conversation eventually hits the window's hard limit.
* **Progressive** — carry forward only what the next step needs: the latest tool result, the last few turns, the current subtask. This is the right default for most production workloads, but it comes with two costs. First, the exact input the model saw three steps ago is no longer reconstructable, which makes debugging harder. Second, because the "recent state" tail mutates every turn, it undermines prompt caching — caching depends on a stable, byte-identical prefix, and a tail that changes every turn can never form one.
* **Retrieval** — fetch a relevant slice from an external store at query time, the same retrieval mechanism covered throughout this catalog's RAG pages. It earns its place when the corpus is too large to preload and only a fraction of it is relevant to any single step.
* **Compaction** — periodically summarize or compress the context that has already accumulated, keeping the decisions and identifiers that matter while dropping the verbatim detail that got them there. It earns its place once a session would otherwise hit the context limit mid-task, though measuring how faithful a summary is to the original transcript remains a genuinely hard, mostly unsolved evaluation problem.

:::tip Answering the caching question directly
If progressive context makes caching harder because the tail keeps changing, the fix isn't to abandon caching — it's to stop asking one strategy to do both jobs. Keep a small, genuinely stable **monolithic prefix** (system prompt, task setup, anything that doesn't change call to call) ahead of the cache boundary so it can be cached once and reused, then layer the **progressive** tail after that boundary for the parts that do change every turn. And if the progressive window is at risk of *losing* something important as it slides forward, that's precisely what **compaction** is for: summarizing the part about to fall out of the window into a compact note that rides forward with the rest of the context, instead of letting it disappear outright.
:::

These four strategies are presented separately here for learning clarity, but production systems almost always combine them — trying to run a real agent on only one of the four tends to fail in a predictable way, because each strategy is answering a different question:

* What does the model need at the **start** of the task? → drives the monolithic baseline.
* What does it need from the **most recent steps**? → drives the progressive window.
* What might it need to **fetch on demand**? → drives the retrieval layer.
* What **earlier material can be compressed** without losing decision-relevant detail? → drives the compaction policy.

### Worked Example: A Long-Running Coding Agent

| Phase | What's happening | Strategy in play |
| --- | --- | --- |
| Session start | The task description and the few files the user explicitly referenced load once | Monolithic prefix — small, stable, and cacheable |
| Active work | Each tool call (read file, run tests, edit) appends to the working context | Progressive — the latest additions are what the next step needs |
| Discovery | The agent realizes it needs a file it didn't load initially and searches the codebase | Retrieval — the corpus is too large to preload, so only a relevant slice is fetched on demand |
| Context filling | After many turns, early exploration is crowding the window, but the conclusions still matter | Compaction — summarizes "what was tried and what was learned," dropping the verbatim tool output |

No single strategy could carry this workload alone. Monolithic alone hits the context limit as soon as the session runs long. Progressive alone has no way to surface code the agent never loaded in the first place. Retrieval alone loses the thread of what has already been tried. Compaction alone has nothing to compact until the other three have built up a trajectory worth summarizing.

Mapped back onto the Write/Select/Compress/Isolate framework earlier in this page: **Select** is roughly the progressive-plus-retrieval decision of what enters the window right now; **Compress** is the compaction policy; **Write** is what persists state outside the window so it can be reloaded later; and the monolithic baseline is simply the starting point that exists before any of the other three mechanisms need to act.

## Memory in Context Engineering

Among the four strategies, **memory is the backbone**. Without it, every LLM call starts from zero. With poorly designed memory, agents bloat, drift, or leak. With well-designed memory, agents become adaptive, personal, and persistent.

:::warning Failure Modes and Mitigations
Beyond generic context issues, persistent memory introduces its own design challenges:

* **Over-insertion vs over-updating** → if memory always creates new entries, it bloats; if it always overwrites, important history is lost. Use schema validation and evaluation tooling (e.g. LangSmith) to tune behaviour.  
* **Leakage across tasks** → without namespace isolation, one thread’s memory can bleed into another. Scope memories tightly and enforce retrieval policies.  
* **Cold vs hot confusion** → real-time (hot) memories may conflict with background-distilled summaries. A clear strategy for merging prevents clutter or contradictions.  

These pitfalls are less about token limits and more about **how memories are written, organised, and recalled** in persistent systems.
:::

### Memory Types (What is Stored)

| Memory Type | What is Stored | Human Example              | Agent Example       |
| ----------- | -------------- | -------------------------- | ------------------- |
| Semantic    | Facts          | Things I learned in school | User profile, preferences, known facts |
| Episodic    | Experiences    | Things I did               | Past trips, previous tool-call traces |
| Procedural  | Instructions   | Instincts or motor skills  | Agent system prompt, planning policies |

### Memory Scope (Where it is Stored)

* **Short-Term (Thread-Scoped)**  
  * Lives only for the duration of a conversation or task.  
  * Tracks **active state**: conversation history, scratchpads, retrieved docs, or temporary constraints.  
* **Long-Term (Cross-Thread)**  
  * Persists across sessions in a memory **store** organised as `(namespace, key, value)`.  
  * Stores **durable knowledge and patterns** for reuse.  

### Memory Matrix: Scope × Type

| Scope → / Type ↓ | Semantic (Facts) | Episodic (Experiences) | Procedural (Rules) |
| ---------------- | ---------------- | ----------------------- | ------------------ |
| **Short-Term**   | “This trip’s budget is £1,000.” | “Earlier in this chat, the user liked when the itinerary included evening walks.” | “Format today’s answers as bullet points.” |
| **Long-Term**    | “User is vegetarian and lives in London.” | “Last summer, the user booked a Kraków trip and liked the food market tour.” | “Always include transport options in itineraries.” |

## Memory Lifecycle

Defining memory types and scope explains *what* and *where* information is stored.  
But in practice, building effective agents also requires managing the *lifecycle* of memory:  
- **Writing and updating** memories during or after interactions.  
- **Storing and retrieving** them in a structured way for later use.  

This section covers how memories are created, updated, stored, and recalled — turning abstract concepts like “semantic” or “episodic” memory into concrete design choices that affect cost, latency, and user trust.

### Writing and Updating Memories

![hot_path_vs_background](/img/ai/agentic-system/hot_path_vs_background.png)

* **In the hot path** — immediate writes during runtime (e.g., saving a new preference mid-chat).  
  * Pros: instant relevance, transparency.  
  * Cons: adds latency, increases agent multitasking.  
* **In the background** — batch jobs that summarise or merge profiles (e.g., nightly consolidation).  
  * Pros: cleaner consolidation, no latency overhead.  
  * Cons: freshness lag, scheduling complexity.  

👉 Best practice: use **hot path for critical facts**, background for large-scale summarisation.


### Storing and Retrieving Memories

Designing memory is not just about *what* to store, but also *how* to organise and retrieve it efficiently. In LangGraph, every memory entry follows the schema:

```
(namespace, key, value)
```

* **Namespace** – like a folder (e.g., `user_id`, `trip_id`, `application_context`).
* **Key** – like a filename (e.g., `"profile"`, `"trip-Apr2025"`).
* **Value** – a JSON object holding facts, examples, or instructions.

This structure enables hierarchical organisation: for instance, one namespace might contain all memories for a single user, while another groups organisation-wide knowledge.

#### Profiles vs Collections

Two common ways to structure long-term semantic memory:

* **Profiles** → a single JSON doc that is updated continuously (e.g., `"profile"` with dietary restrictions, budget, home city).
  *Pro:* easy to query in one go.
  *Con:* harder to update safely — risk of overwriting fields incorrectly.
* **Collections** → many smaller memory objects (each preference or fact stored separately).
  *Pro:* easier to extend with new items.
  *Con:* harder to query comprehensively; requires aggregation/search.

#### Search and Retrieval

Agents rarely need the *entire* memory store. Instead, they retrieve selectively:

* **Filter by metadata** (namespace, labels, keys) → efficient and precise, but brittle if schemas change.
* **Semantic search** (vector embeddings) → finds relevant items by meaning, not just by key.
* **Hybrid retrieval** → combine metadata filters (“user=123, type=trip”) with semantic similarity (“budget-friendly European itineraries”).

Cross-namespace search is also supported, allowing an agent to pull data across users or contexts if designed to.

#### Retrieval Workflow

1. **Write** — save new facts, experiences, or rules as `(namespace, key, value)`.
2. **Select** — filter and rank candidates using metadata and embeddings.
3. **Compress** — summarise long docs into concise `{goals, constraints, outcomes}`.
4. **Isolate** — route semantic → constraints, episodic → examples, procedural → instructions.

**Example:**
User asks: *“Plan 3 days in Kraków with food and history focus.”*
The retrieval pipeline might fetch:

* Semantic → `"diet": "no pork"`, `"budget": "mid"`.
* Episodic → examples of past 3-day cultural itineraries.
* Procedural → “Offer pacing options if >10km walking/day.”

#### Pitfalls and Evaluation

* **Over-insertion vs over-updating** → some models keep adding duplicates, others overwrite aggressively. Schema validation and evaluation help balance this.
* **Quality of recall** is as important as storage. Tools like LangSmith let you audit *what was retrieved and injected into context*, so debugging isn’t limited to model outputs alone.

## Diagram: Memory-Centric Context Flow

```mermaid
flowchart TD
  subgraph ShortTerm["Short term Memory (thread)"]
    H[Message History];
    W[Scratchpad and Plans];
  end

  subgraph LongTerm["Long term Memory (store)"]
    P[Semantic Facts and Profile];
    E[Episodic Examples];
    I[Procedural Instructions];
    LT[Store];
  end

  U[User Input];
  C[Compressor];
  S[Selector];
  LLM[LLM Call];

  U --> S;
  H --> C;
  C --> S;
  W --> S;
  P --> S;
  E --> S;
  I --> S;

  S -->|Curated Context| LLM;
  LLM -->|Write hot path| H;
  LLM -->|Write background| LT;
````

## Practical Guidance for Builders

### Implementation Checklist

* **Design schema first** — define semantic, episodic, procedural slots.
* **Choose write strategy** — hot path for critical facts, background for profiles/exemplars.
* **Add guardrails** — schema constraints, moderation, rollback/versioning.
* **Select precisely** — retrieval quality is as important as model choice.
* **Compress smartly** — summarise into goals, constraints, outcomes.
* **Isolate channels** — separate instructions, memory recall, and scratchpads.
* **Observe context assembly** — trace what was retrieved and injected (LangSmith helps here).
* **Measure performance** — track “memory hit rate” and “user trust,” not just accuracy.

### Key Lessons

* **Context engineering is as critical as model tuning.** Bigger windows don’t fix bad selection.
* **Memory is the backbone.** Short-term = smooth conversation; long-term = durable knowledge.
* **Retrieval quality = user trust.** Wrong recalls feel like hallucinations.
* **Tools and formatting are context too.** A well-structured JSON can matter more than an extra 1k tokens.
* **Design for confidence, not just accuracy.** Schema, isolation, reversibility, and transparency are adoption drivers.

✅ **The real differentiator in agents isn’t smarter models, but smarter context engineering.**

## References

* [Arxiv – Cognitive Architectures for Language Agents (CoALA)](https://arxiv.org/pdf/2309.02427)
* [LangChain Blog – Context Engineering](https://blog.langchain.com/context-engineering-for-agents/)
* [LangChain Blog – Rise of Context Engineering](https://blog.langchain.com/the-rise-of-context-engineering/)
