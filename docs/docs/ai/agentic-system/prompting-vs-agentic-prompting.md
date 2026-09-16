---
title: From “Basic Prompting to “Prompting for Agents”
description: 'Classic prompting aims for deterministic structure and outputs. Agent prompting aims for useful autonomy under constraints (tools, loops, budgets, verification)..'
keywords:
  - ai
  - agentic system
  - basic prompting prompting
  - basic
  - prompting
  - agents
  - classic
  - aims
---

# From “Basic Prompting to “Prompting for Agents” 

> TL;DR
    * **Classic prompting** aims for *deterministic structure and outputs*.
    * **Agent prompting** aims for *useful autonomy under constraints* (tools, loops, budgets, verification).
    * Ship with: **(policy prompt**, **(good tools**, **(observability + guardrails**, **(small but real evals that gate releases**.


## Prompting 101

### Five Basic Prompt Structure Elements

![basic-5](/img/ai/agentic-system/pormpt-vs-agentic/basic-5.jpg)

1. **1-2 sentences to establish a persona and high-level task description** – briefly explain the AI's identity and primary goal.
2. **Dynamic/Searchable Content** – ​​include dynamic data to be processed, such as user preferences and location information.
3. **Detailed Task Instructions** – specify the steps and rules for executing the task.
4. **Examples/n-shot (optional)** – provide input and output examples to guide the model.
5. **Repeat Key Instructions** – for particularly long prompts, reiterate the most important instructions at the end.
For further studying, check:

When handling more complex tasks, the prompt structure can be expanded to 10 elements:

### Expanding to a More Detailed 10-Point Structure

![advanced-10](/img/ai/agentic-system/pormpt-vs-agentic/advanced-10.jpg)

1. **Task context** – A more detailed description of the role and background
2. **Tone context** – Explicitly define the tone, style, and personality of the response
3. **Background information, documents, and images** – All static reference materials
4. **Detailed task description and rules** – Complete execution steps, judgment criteria, and processing rules
5. **Examples** – Input and output examples for multiple different scenarios
6. **Conversation history** – Reference previous conversations if necessary
7. **Immediate task description or request** – The specific task to be handled in the current round
8. **Step-by-step prompt** – Include prompts such as "Think step by step" or "Take a deep breath"
9. **Output formatting** – Detail the structure, format, and style of the response
10. **Prefilled response** – Prefill a portion of the response to guide the model (Editor's note: This is a feature available only in the Claude API that allows you to prefill Assistant responses. The OpenAI API (This feature is not available)

This extended version is particularly suitable for handling complex tasks that require multiple considerations. Each element has its own specific purpose and can be selected based on actual needs.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/ysPbXH0LpIE?si=5OaDKv13kln1wpAU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

:::info
![extended-thinking](/img/ai/agentic-system/pormpt-vs-agentic/extended-thinking.jpg)
**Extended thinking** is great for *development-time introspection* (see how the model reasons) but costs tokens and hurts reproducibility. Use it to refine prompts; don’t rely on it in steady state.
:::

#### Extended thinking is a cost/latency lever, not a quality switch

Most providers let a model spend an extra, separately billed block of reasoning tokens before it writes the final answer. It's tempting to treat that as a mode worth flipping on because "it can't hurt," but every one of those reasoning tokens adds to the bill and to latency, whether or not it changes the final answer.

The discipline that keeps this honest is to **run the eval without it first**. If accuracy is still short of the bar after the prompt itself has been improved, that's the point to try enabling extended thinking — and the case for turning it on should come from a measured accuracy gap, not an assumption. Without that measurement, the extra cost is being paid with no proof it moved anything.

Some newer setups replace a hand-tuned reasoning-token budget with an **adaptive-effort** control: instead of guessing a token count, the request dials how much reasoning effort to apply and leaves the model to decide how to spend it. That keeps the cost/latency knob explicit without turning it into a manual budgeting exercise, but the same eval-first discipline still applies — effort is a dial being paid for, not a free quality upgrade.

The same discipline scales up one level, to the model tier itself. Defaulting to the strongest available model because it's the safe-sounding choice is itself a decision — usually the most expensive one — made without evidence that a smaller or cheaper model would have been good enough. The delta-threshold discussion under [Evaluations that actually gate releases](#evaluations-that-actually-gate-releases) below covers the mechanism that makes a model (or reasoning-effort) change defensible instead of a guess.

### When to use an agent (and when not)

![should-i-build-an-agent](/img/ai/agentic-system/pormpt-vs-agentic/prompt-engineering-vs-context-engineering.jpeg)

Use agents when the task is **complex + valuable**, requires **tool use**, and the **path is uncertain**. By “**path**” I mean the **sequence of intermediate decisions and actions** needed to get from a goal to a finished result: which tool to call first, what to search for, how to react to partial answers or errors, whether to branch, when to stop, and how to verify.

When the **path is uncertain**, you *can’t* reliably specify that sequence up-front because it depends on information you don’t yet have (or on non-deterministic environments). That’s why it matters: **agents** (models using tools in a loop) are designed to *discover and adapt the path at runtime*. If the path is fixed and predictable, a single prompt or a scripted workflow is cheaper, faster, and more reliable.

![should-i-build-an-agent](/img/ai/agentic-system/pormpt-vs-agentic/should-i-build-an-agent.jpg)

![should-i-build-an-agent-examples](/img/ai/agentic-system/pormpt-vs-agentic/should-i-examples.jpg)

## System Prompts as Governed Assets

At enterprise scale, a prompt is not a sentence someone typed once. It's a versioned asset with three parts that need to survive contact with real usage:

- **Role and scope** — what this prompt owns, and just as importantly, what's explicitly out of bounds for it.
- **Fixed constraints** — the rules that must hold on every single call, not just the ones a demo happened to exercise.
- **An explicit output contract** — the exact shape the response has to take, so downstream code (or a person) can rely on it without re-parsing free text.

A **template** packages this discipline so it survives reuse: the role, tone rules, constraints, and output contract stay fixed as scaffolding, and only a narrow set of slots vary per request. The point of keeping the scaffolding fixed is that filling in a slot can't accidentally delete a safety rule — whoever uses the template supplies the variable content and inherits the guardrails for free, rather than re-authoring them (correctly or not) every time.

### Underspecified Guardrails: The Failure Mode That Looks Like a Control

A guardrail is **underspecified** when it sounds sensible but doesn't define exactly what the model must or must not do. All of the following read like real rules, right up until I ask what they actually mean:

- "Do not reveal sensitive information."
- "Do not make assumptions."
- "Avoid hallucinations."
- "Be professional."
- "Only provide accurate answers."

Every load-bearing word in that list — *sensitive*, *assumption*, *professional*, *accurate* — is open to interpretation. The model can satisfy its own reading of that word while still producing exactly the output the rule was meant to prevent, and technically no rule was broken.

Compare a weak guardrail with an operational one:

| | Weak | Stronger |
| --- | --- | --- |
| Avoiding assumptions | "Do not make assumptions." | "Only state facts explicitly supported by the supplied sources. Do not infer missing facts, dates, figures, causes, or decisions. If the required information is not present, state: 'The supplied sources do not contain enough information to answer this question.'" |
| Protecting sensitive data | "Do not reveal sensitive information." | "Do not include passwords, access tokens, customer identifiers, personal contact details, financial account details, or confidential project names in the output. If the requested answer requires any of these fields, omit the value and state that it has been withheld." |

The stronger versions aren't longer for the sake of it — each one names a **scope**, a **prohibited behaviour**, a **required behaviour**, and a **fallback** for when the rule is triggered. Naming all four is also what makes the guardrail testable: a test case can check whether the model followed the stronger version. There's no equivalent test for "be professional."

This is why a vague guardrail is more dangerous than a missing one. A missing guardrail is visibly absent — anyone reviewing the prompt can see there's no rule about a given risk. A vague one creates **the appearance of a control without the substance**: it reads like a safeguard, so review attention moves past it, while the model quietly routes around an ambiguous constraint using its own interpretation instead of breaking it outright.

A quick test catches most of these before they ship: ask whether two reasonable people could read the instruction differently. If "sensitive," "professional," or "accurate" could plausibly mean different things to two people on the same team, the model has exactly that same room to interpret it inconsistently across requests — which reintroduces the non-determinism a governed prompt was supposed to remove in the first place.

### Picking a Prompting Technique for the Task

Once the guardrails are solid, the remaining lever is how much technique to wrap around the instruction itself — and the right amount is set by task complexity, not habit.

| Technique | Fits when | Cost of over-using it |
| --- | --- | --- |
| Zero-shot | The task is well-specified and the model already handles it reliably from instructions alone | — |
| Few-shot | The desired format or judgement is easier to demonstrate than to describe | Extra tokens; stale examples silently steer the model as the task evolves |
| Chain-of-thought | Multi-step or interacting logic makes a skipped step a real risk | Extra tokens and latency for no gain on tasks that didn't need reasoning scaffolding |

The mechanics behind each of these — worked chain-of-thought examples, PAL, and the ReAct pattern — are covered in depth in [Chain of Thought Prompting](/ai/llm/generative-ai-with-llm/wk3/reasoning) and [Transformer, Prompt engineering, Config](/ai/llm/generative-ai-with-llm/wk1/transformer-promptengineering-config); the point to take from this table is simpler: add the lightest technique that clears the accuracy bar, and re-check that choice whenever the underlying model changes, since a prompt tuned for one model is a starting point for another, not a finished artifact.

### Packaging Reusable Prompts: Library or Skill

Once a prompt is worth reusing, the last design choice is how a team packages it.

| Consideration | Lean toward a prompt library | Lean toward a Skill |
| --- | --- | --- |
| Repeatability | An assembled, often-tweaked prompt per use | A stable procedure run the same way every time |
| Distribution | Shared within one codebase or team | Distributed across teams or products that need the same procedure |
| Governance | Lightweight; engineers own the fragments | Needs versioning, approval, and rollback — Skills carry that |

A **prompt library** is a shared set of fragments and templates that engineers assemble in their own code — fine when one team owns it and expects to keep tweaking it. A **Skill** is a more formal, versioned, self-contained package — instructions plus any scripts it needs — that travels as one governed unit with approval and rollback built in. The signal to move from one to the other isn't size; it's whether the same procedure now needs to run identically somewhere the original team doesn't control.

## Agent prompting 

### 7 principles you can ship

1. **Think like your agent** — simulate the tool environment; if a new grad couldn’t succeed with your tool names/descriptions, neither will the agent.
2. **Give crisp heuristics, not scripts** — budgets, stop criteria, preferred sources, and “good-enough” rules.
3. **Tool selection is design** — fewer, orthogonal tools with excellent names + descriptions beat many near-duplicates.
4. **Guide the thinking** — *plan first*, then interleave tool calls with reflection and verification.
5. **Expect side-effects** — “always find best source” → infinite search; add time/tool/token budgets and timeouts.
6. **Manage context** — compaction, external scratch files, and sub-agents to avoid context bloat.
7. **Let the model be the model** — start minimal; only add constraints where failures are observed.

For further studying, check:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XSZP9GhhuAc?si=4hytUTvZsOOx4f-B" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


### Memory & context strategy

* **Short-term** (scratchpad): ephemeral thoughts + recent results.
* **Long-term** (external file/DB): decisions, artefacts, and facts with **provenance**; reload on resume.
* **Compaction**: summarise near 90–95% of context window; keep identifiers and decisions verbatim.
* **Sub-agents:** delegate heavy search/synthesis; compress results back to a lead agent.


### Tooling that doesn’t sabotage you

![tool-design](/img/ai/agentic-system/pormpt-vs-agentic/tool-design.jpg)

When designing tools, use simple, accurate names that distinguish them from others. Avoid creating six similar search tools, making it difficult for the model to distinguish which to use. Consider merging tools if they are similar.

Tool descriptions should be detailed and well-formatted, including information about what the tool returns and how to use it. Avoid overly similar tool names or descriptions.

Tools that perform a single action are most effective, with no more than one level of nested parameters (e.g., three separate tools are better than one tool with multiple action parameters). Of course, be sure to test your tools to ensure that the agent can use them properly.


### Evaluations that actually gate releases

![tool-design](/img/ai/agentic-system/pormpt-vs-agentic/evals.png)

Start small but real; automate later.

**Three layers**

1. **Answer accuracy:** LLM-as-judge with a rubric (accept ranges, verify citations).
2. **Tool-use accuracy:** programmatically assert *which* tools must be called *how many times*.
3. **T-Bench (Final-state assertions):** database/file/system state matches the requested change.

**Release gates (suggested)**

* Budgets respected (tool_calls/tokens/time/context).
* 0 schema violations; 0 destructive calls without confirmation.
* Rubric score ≥ threshold on a “golden” task pack; canary tasks pass.
* Incident playbook tested (abort/rollback).

#### Delta thresholds: what actually makes a rubric score a release gate

"Rubric score ≥ threshold" only works as a gate if that threshold was agreed **before** anyone saw the new results. A **delta threshold** is the maximum acceptable difference between a new system's evaluation score and a known baseline, fixed in advance of the run.

A concrete case makes this land: baseline accuracy is 92%, the new prompt (or model, or reasoning-effort setting) scores 90% — a delta of -2 points. If the threshold agreed beforehand was "no worse than -1 point," this release fails the gate, full stop, regardless of how much better the new version felt in a quick demo.

The order of operations is what makes this a standard rather than an excuse. Agreeing the threshold *before* running the evaluation means the number decides the outcome. Agreeing it *after* seeing the results means the results are deciding the number — which is moving the goalposts, not gating a release.

A delta threshold isn't limited to accuracy. Hallucination rate, safety-violation rate, cost, and latency can each carry their own threshold, and passing one does not buy back a failure on another: a faster, cheaper version that also hallucinates more has not passed the gate just because its cost number looks great.

:::tip
Not choosing a model (or a prompt, or a reasoning-effort setting) is equivalent to choosing the most expensive one by default. Building the eval set feels like extra work upfront, but it's the only thing that makes that choice defensible instead of a guess dressed up as judgement.
:::

For the broader evaluation methodology behind these gates — offline vs. online vs. pairwise evaluation, and the per-application-type techniques for agents, RAG, summarization, and classification — see [Evaluation](/ai/agentic-system/evaluation).


# Agent prompting: what’s unique (and why it matters)

**Agent prompting is principle-driven, not step-scripted.** Instead of long, linear recipes, you encode *heuristics* and *policies* that let the model plan, act, and adapt safely.

* **Path** = the sequence of intermediate decisions/actions from goal → result. Use agents when the **path is uncertain** (needs discovery, branching, verification, or deals with non-deterministic environments).
* **Heuristics over scripts:** budgets (tool calls/tokens/time), “good-enough” stop rules, preferred source order (internal → trusted APIs → web), and irreversibility rules (dry-run + confirm).
* **Thinking guidance:** plan first; interleave tool calls with reflection/verification before finalising.
* **Context strategy:** compaction near window limits, small external scratch files, or sub-agents; keep the lead agent’s context lean.
* **Minimal few-shot:** use examples sparingly; too many over-constrain behaviour.
* **Operational guardrails:** schema-validated outputs, corroboration for web facts (e.g., two independent sources or one primary), and deny-by-default for destructive tools.

**Quick litmus tests (to avoid over-engineering):**

* **Recipe test:** if a 5–7 step recipe works >95% of the time, don’t use an agent.
* **Budget test:** if a fixed, small number of tool calls doesn’t hurt quality, don’t use an agent.
* **Oracle test:** if banning lookups/verification craters quality, do use an agent.

## Agent prompt design: structure & the key differences (vs classic prompting)

### Recommended structure (production-oriented)

1. **Role & high-level task** — what the agent is accountable for.
2. **Principles & heuristics** — tool-selection policy, budgets, stop criteria, irreversibility controls.
3. **Thinking guidance** — *plan first* (sources, budget, success criteria), then act; reflect between tool calls.
4. **Boundaries & error handling** — what to do on tool failures, conflicts, or missing data; verification rules.
5. **Context strategy** — when to compact, what to persist externally, when to delegate to sub-agents.
6. **Output contract** — strict JSON/XML schema (validate downstream).


### Key differences: classic prompting vs agent prompting

| Dimension         | Classic prompting (ICL)                                     | Agent prompting (policy)                                   |
| ----------------- | ----------------------------------------------------------- | ---------------------------------------------------------- |
| **Spec style**    | Step-by-step recipe                                         | Principles & heuristics (budgets, stop rules, tool policy) |
| **Examples**      | Few-shot common                                             | Minimal; avoid over-constraining                           |
| **Control**       | Order of operations, output schema                          | Plan-act-reflect loop, verification before final           |
| **State**         | Stateless, one-shot                                         | Accumulating state; compaction, scratch files, sub-agents  |
| **Primary risks** | Hallucination, format drift                                 | Infinite search, tool thrash, context bloat                |
| **When to use**   | Deterministic tasks (classification, extraction, rewriting) | Uncertain path, tool use, high value/complexity            |

**Shipping tip:** If you pick an agent, *treat it like a service*: add budgets, success criteria, verification, schema validation, tracing, and release-gating evals (answer accuracy, tool-use accuracy, final-state assertions).



## Conclusion

Treat agents as **services**: policy-driven behaviour, high-quality tools, measured with budgets and final-state assertions. Keep prompts lean, tools sharp, and evals real. Add constraints only where failures appear. That’s how you get reliable autonomy in production.
