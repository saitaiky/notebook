---
title: "Prompting, Hallucinations, and Evaluation"
description: "A chapter-style guide to the generation side of RAG, covering transformers, sampling, prompting, context management, hallucination control, and evaluation."
keywords:
- rag generation
- prompt engineering
- llm sampling
- hallucination control
- ragas evaluation
- context window management
- citation grounding
- agentic rag
sidebar_position: 4
---

# Generation Systems for RAG: Prompting, Hallucinations, and Evaluation

By the time a RAG system reaches the generation step, a lot of work has already happened. The retriever has searched the knowledge base, ranked chunks, and chosen the context that seems most relevant.
But retrieval only creates the conditions for a good answer. It does not guarantee one.
The LLM still has to read the retrieved material, decide what matters, ignore distractions, structure a response, and stay grounded while doing it. That is why the generation layer deserves its own chapter. Once retrieval is working, this is the next place where product quality is won or lost.
The big lesson of this module is simple: a good retriever can hand the model useful evidence, but the model still needs to _use_ that evidence well.

## Why the Generation Layer Deserves Separate Attention

It is tempting to think that once a retriever is strong, the rest of the system is almost solved. In practice, that is not true.
Even with good retrieval, the generation side can still fail in several ways:
- the model may ignore part of the evidence,
- it may over-focus on irrelevant retrieved text,
- it may answer fluently but not faithfully,
- it may cite poorly or not at all,
- it may produce long, expensive, unstable outputs because the prompt structure is weak.

That means generation is not just "call the LLM." It is the problem of making the model behave consistently and use context the way the application needs.

## What Matters About Transformers in Practice

I do not need to implement a transformer to build a RAG system, but I do need to understand a few properties of transformer-based LLMs because they explain so much real behavior.
At a practical level, the model starts by turning input tokens into vectors, then adding positional information so token order is represented explicitly. That gives each token an initial numeric representation that is aware of both identity and position.
Then each layer repeats a two-part pattern: attention first, feedforward second. Attention lets each token mix information from other tokens that matter for the current step. Feedforward then transforms that mixed signal in a larger parameter block. In many model families, feedforward sublayers carry a large share of the total parameters, which is one reason generation is compute-expensive.
This layered refinement repeats many times, not once. Early layers mostly build local and syntactic relationships, while later layers represent more abstract or long-range patterns. For RAG, that layered behavior is exactly why context quality matters so much: weak retrieved context is repeatedly propagated through the stack, while high-signal evidence is repeatedly reinforced.

<!-- NOTEBOOKLM_DIAGRAM: concept=transformer-attention-and-generation; type=image; goal=show a prompt being tokenized, each token receiving embedding plus positional vectors, passing through the repeated attention-then-feedforward pattern over multiple layers, then producing a next-token probability distribution; complexity=advanced -->

- **LLMs process tokens, not whole answers.** The model does not first figure out the perfect response and then write it down. It processes tokenized input, builds contextual representations through attention and feedforward layers, and generates the output token by token. That matters because each new token is influenced by the prompt, the retrieved context, and the tokens generated earlier in the same completion.
- **Attention is why retrieved context can help.** The attention mechanism lets each token consider other tokens in the prompt. That is why retrieved documents can actually influence the answer instead of just sitting in the prompt as dead text. When the model works well, it can connect the user's question to the relevant pieces of retrieved evidence and generate a response that reflects those relationships.
- **Generation is still probabilistic.** This is one of the most important reminders in all of RAG. The model is not deterministically reading facts out of the context like a database lookup. It is generating a sequence of probable next tokens. That is why grounded systems can still hallucinate, drift, or choose strange phrasings even when the right evidence is present.
- **Long prompts are expensive.** Transformers are computationally expensive, and prompt length matters. The more tokens I include, the more work the model must do. That affects latency and cost directly. So prompt design is not just about quality. It is also about computational discipline.

## Decoding and Sampling Controls

A large language model does not select the next token in a purely fixed way unless I force it to. By default, generation involves probabilistic choice.
This randomness is not necessarily bad. It is part of why LLMs can sound flexible and natural. But in RAG, especially for factual question answering, I usually want to control it carefully.
The useful mental model here is that decoding settings are not "creative writing knobs" only. They are reliability settings. They change how boldly or conservatively the model moves through the space of possible next tokens.
If retrieval already gave me strong evidence, I usually want the model to stay fairly close to that grounded path. If the task is open-ended ideation, I may tolerate or even prefer more variation. So these settings should be chosen in relation to the job the model is doing, not just by habit.

### Greedy Decoding: Maximum Predictability, Limited Flexibility

The most extreme option is greedy decoding, where the model always chooses the most probable next token.
The upside is determinism. The same prompt yields the same response.
The downside is that the output can become stiff, repetitive, and sometimes brittle. If the model falls into an awkward repetitive path, greedy decoding does not give it much room to escape.
That is why greedy decoding can be useful for debugging or narrow deterministic tasks, but it is not always the best everyday setting.

### Temperature: The Main Dial for Randomness

Temperature changes the sharpness of the token probability distribution.
- Lower temperature makes the distribution more spiky and conservative.
- Higher temperature flattens it and gives lower-probability tokens a better chance.

In practical terms:
- lower temperature usually helps when I want factual, stable, low-variance output,
- higher temperature can be useful when I want exploratory or creative language.

For RAG question answering, code generation, and grounded explanations, I usually lean toward lower temperature because I want the model to stay close to the highest-likelihood grounded continuation.

<!-- NOTEBOOKLM_DIAGRAM: concept=temperature-distribution-shaping; type=image; goal=show how low temperature sharpens the next-token probability distribution into a spike while high temperature flattens it, changing how likely lower-probability tokens are to be chosen; complexity=intermediate -->

### Top-k and Top-p: Trimming the Nonsense Tail

Even after choosing a temperature, the model's token distribution often has a long tail of weak, low-sense options.
Top-k sampling says: only consider the top `k` candidate tokens.
Top-p sampling says: consider as many top tokens as needed to reach cumulative probability `p`.
Top-p is often more adaptive because the allowed token pool changes depending on how confident the model already is.
That makes it easier to keep outputs flexible when the model is uncertain and more constrained when it is confident.

<!-- NOTEBOOKLM_DIAGRAM: concept=top-k-vs-top-p-sampling; type=image; goal=contrast top-k (fixed number of candidate tokens) with top-p (cumulative-probability cutoff) on the same probability distribution, showing how the allowed token pool differs; complexity=intermediate -->

### A concrete sampling example

Suppose the next-token probabilities start like this:
- token A: 0.40
- token B: 0.25
- token C: 0.15
- token D: 0.10
- token E: 0.05
- all remaining tokens share the last 0.05

With top-k using `k = 3`, only A, B, and C are eligible. D and beyond are removed entirely.
With top-p using `p = 0.85`, I include tokens in descending order until cumulative probability crosses 0.85. Here that means A + B + C + D = 0.90, so D is included too. In this case top-p allows one extra candidate compared with top-k.
That is the key behavioral difference: top-k fixes candidate count, while top-p fixes probability mass. Top-p expands or contracts the candidate set based on model confidence at that step.

### Repetition Penalties and Logit Biasing

Some generation issues are not about the whole probability curve. They are about specific token behaviors.
- **Repetition penalties** reduce the chance that the model keeps reusing the same word or phrase over and over. That can help outputs sound less stuck and less mechanical.
- **Logit biasing** lets me push specific tokens up or down in likelihood. That is useful in narrow situations such as:
  - discouraging profanity,
  - nudging a classifier toward a fixed label set,
  - biasing formatting tokens.

These are not everyday tools for all RAG systems, but they are useful reminders that not every generation issue requires prompt changes alone.

## Choosing an LLM for RAG Workloads

Model selection is one of the most important choices in the generation layer, but it should be treated as an engineering choice rather than a branding choice.

### Quantitative factors that matter

The main measurable factors are:
- model quality on relevant tasks,
- latency and time-to-first-token,
- context window size,
- cost,
- operational stability.

Larger models are often more capable, but they are also slower and more expensive. Newer models are often stronger, but they may also be costlier or less stable in deployment.

### Benchmarks help, but only if they are relevant

A benchmark is useful only if it resembles the work my system actually does.
If my RAG system does not generate code, then code-heavy leaderboards tell me less than they tell a coding assistant team.
This is why generic leaderboards are only a starting point. The better question is: how does the model behave on _my_ prompts, _my_ contexts, and _my_ evaluation set?

### Benchmarks saturate over time

Another important lesson is that benchmarks age quickly. Once most strong models score near the top, the benchmark stops being useful for differentiation.
So choosing a model is never a permanent decision. It is a current best-fit decision that will likely be revisited as the model landscape changes.

<!-- NOTEBOOKLM_DIAGRAM: concept=benchmark-saturation-over-time; type=image; goal=show a line chart where model scores on a benchmark rise from low to near-maximum over a few years, illustrating saturation and the need to introduce harder benchmarks; complexity=beginner -->

## Building the Augmented Prompt

Prompt engineering sounds abstract until I look at what is actually sent to the model.
In most production systems, the prompt is not a single ad hoc string. It is a structured template built from several components.
The common layout is:
- system prompt,
- optional conversation history,
- retrieved context,
- the user's current question.

That structure matters because the model does not "know" which text is supposed to be instruction, which is supposed to be evidence, and which is supposed to be the user's actual request unless I signal those roles clearly.
When prompt construction is weak, generation quality becomes hard to debug. A bad answer might come from weak retrieval, but it might also come from the fact that the prompt buried the user's question under too much context, failed to mark the source material clearly, or mixed old chat history with the current task in a confusing way.

<!-- NOTEBOOKLM_DIAGRAM: concept=augmented-prompt-template-layers; type=image; goal=show the layered structure of an augmented prompt (system prompt, conversation history, retrieved context, current user question) stacked in order and assembled into the final model input; complexity=beginner -->

### Prompt template

A prompt template is the repeatable skeleton I use to assemble these pieces. The point of a template is not style for its own sake. The point is experimental control.
If I want to know whether a new grounding instruction helped, or whether moving retrieved context above or below the latest user question improved outcomes, I need a stable template so I can change one variable at a time.

### An example of a messages-based augmented prompt

The important thing in this pattern is not the syntax alone. It is the separation of stable instructions, prior conversation state, and retrieved evidence so the model sees each role clearly.

```python
messages = [
    {"role": "system", "content": system_prompt},
    *chat_history,
    {
        "role": "user",
        "content": f"Question: {query}\n\nRetrieved context:\n{retrieved_context}",
    },
]
```

Using a stable template matters because it makes behavior easier to debug, compare, and evaluate. If the prompt structure changes constantly, it becomes much harder to attribute improvements or regressions.

### The system prompt: high-level behavioral control

The system prompt is where I put stable instructions about how the model should behave.
This might include:
- tone and style,
- formatting expectations,
- citation rules,
- refusal rules,
- instructions to stay grounded in retrieved content.

In a RAG setting, the system prompt is one of the first places I can express the application's safety and grounding policy.
For example, I can tell the model:
- answer using retrieved sources when available,
- do not invent unsupported facts,
- say when evidence is insufficient,
- cite relevant source snippets.

The system prompt does not guarantee compliance, but it strongly shapes the behavior of the generation step.

## Advanced Prompting Techniques: Useful, but Not Free

Once a basic prompt template works, I can add more advanced techniques. But each one increases prompt complexity, token cost, or both.
That means advanced prompting should be earned by evidence, not added by default.
Another way to say this is that advanced prompting should solve a concrete failure mode. If I do not know what it is fixing, it is probably just making the prompt longer.

### In-Context Learning and Few-Shot Examples

One powerful technique is giving the model examples of what a good answer looks like.
If I include one example, that is one-shot prompting.
If I include several, that becomes few-shot prompting.
This can be useful for teaching:
- response format,
- preferred tone,
- citation style,
- how to handle certain kinds of questions.

In a RAG setting, I can even retrieve example question-answer pairs from a dataset of successful past interactions. That turns examples themselves into a kind of retrieved context.
This can work well, but it also lengthens prompts quickly. So I only want to keep it if evaluation says it is worth the cost.

### Reasoning-Oriented Prompting

Another family of techniques encourages the model to reason more explicitly.
This may mean asking it to:
- think step by step,
- outline a plan first,
- separate reasoning from the final answer,
- use a scratchpad-style structure internally.

### An example of sampling controls

This kind of helper is useful when I want response style to be configurable in one place instead of scattering temperature and sampling decisions across the codebase.

```python
kwargs = generate_params_dict(
    query,
    temperature=0.5,
    top_p=0.5,
)
response = llm.generate(**kwargs)
```

### An example of explicit reasoning instructions

This pattern is useful when the task benefits from a more deliberate answer structure and I want the prompting logic to make that structure obvious.

```python
reasoning_prompt = """
Answer using only retrieved context.
First, reason step by step in short bullets.
Then provide a concise final answer.
"""
messages = [
    {"role": "system", "content": reasoning_prompt},
    {"role": "user", "content": query_with_context},
]
```

This can improve quality on harder tasks, especially when the model needs to combine multiple facts or reason carefully across documents.
But it also increases token usage and sometimes introduces verbose internal structure that is not necessary for simpler prompts.

### Reasoning Models Change the Prompting Strategy

Some newer models are explicitly designed as reasoning models. These models often generate internal reasoning tokens before producing the final user-visible answer.
That can make them better at complex tasks such as:
- coding,
- mathematics,
- multi-step planning,
- deeper evidence synthesis.

But they are also usually slower and more expensive.
Another practical difference is that some old prompt tricks become less useful. For reasoning models, telling them to "think step by step" may add less value because that behavior is already built into the model.
So the right approach is not to pile on more prompt complexity blindly. It is to prompt in the style the model family actually responds well to.

## Context Window Management Is Not Optional

Every improvement to prompting seems to want more tokens.
Retrieved chunks add tokens.
Few-shot examples add tokens.
Long chat histories add tokens.
Reasoning traces may add tokens.
That means context management is a core generation concern, not a side issue.
In single-turn systems, the main question is simple: does every piece of prompt content justify its cost? If a prompt component does not improve performance, it should probably be removed.
In multi-turn systems, the problem becomes harder. Long chat histories can carry stale context that no longer helps the current question. Retrieved chunks from old turns may become irrelevant noise. So practical rules are:
- keep only history relevant to the current turn,
- do not keep stale retrieved chunks around by default,
- summarize older history if necessary,
- avoid carrying internal reasoning artifacts into future turns unless they are truly needed.

If I ignore this, the system becomes slower, more expensive, and often less stable.

## Hallucinations and Grounding

RAG reduces hallucinations, but it does not eliminate them.
This is important because some people implicitly expect retrieval to solve the problem completely. It does not.
The model is still a text generator. If it sees incomplete evidence, ambiguous evidence, weakly relevant evidence, or misleading context, it can still produce claims that are unsupported or wrong.

### A Concrete Hallucination Example

Imagine a customer asks whether an online store offers student discounts.
The retriever finds documents about two real discounts:
- senior discounts,
- new-customer discounts.

The model is also prompted to be helpful.
That combination can produce a plausible but false answer like:
"Yes, student discounts are available with a valid student ID, similar to the 10 percent discount offered to seniors and new customers."
The answer sounds coherent. It even sounds helpful. But it is invented.
That is exactly what makes hallucinations dangerous.

### Why There Is No Perfect Hallucination Fix

This is the uncomfortable truth: there is no perfect general solution that guarantees zero hallucinations.
What I can do instead is reduce the risk, detect unsupported claims more reliably, and design the system so unsupported answers are less likely and less harmful.

### A Useful Hallucination Taxonomy

In practice, it helps to distinguish a few different failure types instead of treating every bad answer as the same problem.
- **Fabrication** means the model invents a fact that is not supported by the retrieved context at all.
- **Distortion** means the model starts from real evidence but changes an important detail such as a number, condition, or date.
- **Omission** means the model leaves out a qualifying detail that makes the answer materially misleading.

These failure types matter because they often point to different root causes. Fabrication often reflects weak grounding or an over-helpful prompt. Distortion often appears when the retrieved evidence is partially relevant but the model compresses it badly. Omission often happens when the context window is crowded and the model drops constraints that looked secondary but were actually decisive.

<!-- NOTEBOOKLM_DIAGRAM: concept=hallucination-taxonomy; type=image; goal=show the three hallucination failure types (fabrication, distortion, omission) side by side with a short example of each and the typical root cause; complexity=intermediate -->

### Practical Hallucination Controls

The best practical controls usually include:
- instructing the model to ground factual claims in retrieved evidence,
- asking it to cite or attribute claims,
- explicitly allowing refusal when evidence is insufficient,
- penalizing unsupported claims in evaluation,
- adding post-generation verification when stakes are high.

Self-consistency is interesting as a secondary defense: I can generate multiple responses and look for consistency across them, and if hallucinated facts vary, inconsistency may expose the problem. But it is expensive and not always reliable, so I do not think of it as the main production defense.
Grounding and citation are usually stronger defaults. The better baseline is to tell the model clearly that factual claims should be based on retrieved information and to encourage or require citation behavior. That increases the chance that the answer remains tied to the evidence and makes human inspection easier. The catch is that citations can themselves be hallucinated, which is why external attribution systems or citation evaluation may still matter.

### Evaluating Citation Quality and Faithfulness

Once I care about grounding, I need metrics that focus on grounding.
Two important ideas are:
- faithfulness: are claims supported by retrieved evidence?
- citation quality: do cited sources actually match the claims?

These matter more in RAG than in many ordinary chat systems because grounding is supposed to be part of the system's value proposition.
If the model produces elegant answers but fails on faithfulness, the RAG pipeline is not really doing its job.
There is also a practical design distinction between **inline citations generated directly by the model** and **post-hoc attribution systems** that map answer sentences back to supporting chunks after generation. Systems in the second category are useful when I want tighter sentence-to-source alignment than the model will reliably provide on its own.
Benchmarks such as ALCE are useful here because they evaluate answer quality and citation quality together. That is closer to the real user promise of a RAG system than a generic answer-quality metric by itself.

<!-- NOTEBOOKLM_DIAGRAM: concept=faithfulness-citation-attribution; type=image; goal=show a generated answer being decomposed into individual claims, with each claim mapped back to a supporting retrieved chunk or flagged as unsupported, illustrating faithfulness and citation-quality scoring; complexity=intermediate -->

## Evaluating LLM Performance in RAG

The evaluation logic for the generator should stay aligned with the generator's role.
The retriever's job is to find relevant context.
The LLM's job is to turn that context into a high-quality answer.
If the retriever is weak, no amount of prompt tuning will fully save the system. So generator evaluation should always be interpreted together with retrieval evaluation, not as a substitute for it.

### Why Generator Evaluation Often Uses LLMs as Judges

Many generation qualities are hard to score with simple code.
For example:
- Is the answer actually relevant to the question?
- Does it rely on the retrieved documents appropriately?
- Does it ignore irrelevant retrieved content?
- Are the citations sensible?

These are nuanced judgments, which is why LLM-as-a-judge approaches are so common here.
Libraries like Ragas are useful because they package repeatable metrics for this kind of evaluation.
One caveat is that LLM judges are not neutral by default. A judge model can prefer outputs that sound like its own training style or its own model family. So I treat LLM-as-a-judge scores as useful signals, not as unquestionable truth. The more important the decision, the more I want human review or at least multiple judge configurations.

### Useful Generation-Side Metrics

Some of the most useful metrics include:
- response relevancy,
- faithfulness,
- citation correctness,
- robustness to irrelevant context.

I also still care about real user feedback, because offline metrics are not the same thing as actual satisfaction.
Ragas-style metrics are useful here because they make the metric definitions more explicit. response_relevancy is trying to answer whether the response actually addresses the user's question rather than merely sounding good. faithfulness is closer to a claim-grounding check: are the answer's statements supported by the retrieved context? Those two metrics often fail independently, which is exactly why I want both. An answer can be relevant but unsupported, or supported but not responsive enough to the user's real question.

### Naming the Individual Judge Prompts

Beyond the two headline metrics above, it helps to name the specific judge calls I am actually running, since "LLM-as-judge" by itself hides five different questions with different failure modes:

| Evaluator | Question it answers | Needs a reference answer? | Target |
| --- | --- | --- | --- |
| Document relevance | Are the retrieved documents relevant to the question? | No | Retriever |
| Answer faithfulness | Is the answer grounded in the retrieved documents? | No | Generator (depends on retrieval) |
| Answer helpfulness | Does the answer actually help address the question? | No | Generator |
| Answer correctness | Is the answer consistent with a known-good reference answer? | Yes | Generator |
| Pairwise comparison | Which of two answer versions is better? | No | Generator |

The first four are pointwise: each judge call scores one answer in isolation. Pairwise comparison is a different evaluator shape entirely — instead of asking "is this answer good," it asks "which of these two answers is better," which is often an easier judgment for an LLM (or a human) to make reliably than an absolute score, especially for open-ended tasks like summarization where a single number is hard to justify but a side-by-side preference is not.

There is also a cheaper evaluator category worth naming: **heuristic evaluators**, which are deterministic, rule-based checks rather than model judgments — confirming a response isn't empty, that generated code actually compiles, or that a classification label exactly matches an allowed set. I run these first, before spending an LLM call on judgment, because they catch a class of failure that a judge model shouldn't need to be asked about at all.

## Agentic RAG on the Generation Side

As RAG systems mature, generation often becomes more modular.
Instead of one single monolithic model call, an agentic workflow may split the job into components such as:
- a router,
- a query rewriter,
- an evaluator,
- a generator,
- a citation checker.

This is useful because different tasks have different needs. A routing task may be handled well by a small cheap model, while final answer synthesis may deserve a stronger one.
The easiest way to understand this kind of system is as a routing workflow rather than as one giant prompt. The diagram below shows a simple agentic generation path where the system chooses whether to retrieve, checks whether the evidence is enough, and only then drafts and verifies the answer.

```mermaid
flowchart TD
    A[User question] --> B[Router model]
    B -->|Needs retrieval| C[Retriever]
    B -->|No retrieval needed| F[Generator]
    C --> D[Evidence evaluator]
    D -->|Evidence insufficient| C
    D -->|Evidence sufficient| F[Generator]
    F --> G[Citation or verification step]
    G --> H[Final answer]
```

What matters in this workflow is not the exact boxes. It is the design principle: different model calls can specialize in different responsibilities instead of forcing one model invocation to do everything.
Useful workflow patterns include:
- **sequential workflows**, where one step prepares the next, such as rewrite -> retrieve -> answer -> verify,
- **conditional workflows**, where a router decides whether retrieval is needed at all or which retriever/model path to use,
- **iterative workflows**, where an evaluator decides whether the current evidence is weak and another retrieval round is needed,
- **parallel workflows with later synthesis**, where multiple retrievers or specialized generators run at once and a later step merges the result.

That pattern distinction matters because it clarifies what kind of problem the orchestration is solving. Conditional workflows are often about cost and latency control. Iterative workflows are often about recall and evidence sufficiency. Parallel workflows are often about breadth and robustness.
These patterns can improve quality, but they also add latency, orchestration complexity, and more places where evaluation is needed.
So agentic RAG should usually be added after the simpler pipeline is well understood.

<!-- NOTEBOOKLM_DIAGRAM: concept=agentic-workflow-patterns; type=image; goal=show the four agentic workflow patterns (sequential, conditional, iterative, parallel-with-synthesis) as four small flow diagrams side by side to contrast their control flow; complexity=advanced -->

## RAG and Fine-Tuning Solve Different Problems

People sometimes frame RAG and fine-tuning as alternatives, but that is a misleading comparison.
They help in different ways:
- **RAG is best for knowledge injection.** If I need the model to use new, private, or changing information, retrieval is the cleanest answer.
- **Fine-tuning is best for behavior and specialization.** If I want the model to become more specialized in a domain, adopt a particular style, or perform a narrow task more consistently, fine-tuning is often the better fit.

That is why they are often combined.
For example, I may use RAG to inject current evidence and use a fine-tuned model to make better use of that evidence in a specific task setting.

<!-- NOTEBOOKLM_DIAGRAM: concept=rag-vs-finetuning; type=image; goal=show a two-axis comparison where RAG maps to knowledge injection (what the model can access) and fine-tuning maps to behavior/domain adaptation (how the model responds), with the overlap where both are combined; complexity=intermediate -->

### A practical decision rule

When I am unsure which approach to reach for, the quickest decision rule is this:
- if the problem is missing or changing knowledge, start with RAG,
- if the problem is unstable behavior, weak formatting, or poor task specialization, think about fine-tuning,
- if both problems are present, the right answer may be a combination rather than a choice between them.

## What This Means to Me as a Builder

The practical lesson from the generation side is this:
the generation layer is where evidence becomes behavior.
Retrieval decides what the model sees.
Prompting, sampling, context management, and evaluation decide how well the model uses what it sees.
If I want a trustworthy RAG system, I cannot stop at retrieval quality alone. I also need to make the model grounded, stable, and measurable.

## Key Takeaways

By the end of this module, I should be able to explain the following clearly:
- Transformer-based LLMs can use retrieved context because attention lets tokens influence one another across the prompt.
- Generation is still probabilistic, which is why grounding does not eliminate hallucinations automatically.
- Temperature, top-p, and related sampling settings shape how conservative or exploratory the model behaves.
- A strong prompt template combines system instructions, retrieved context, and user input in a consistent way.
- Hallucination control is mostly about grounding, citation, refusal behavior, and evaluation rather than a single perfect trick.
- Generator evaluation should focus on relevance, faithfulness, citation behavior, and robustness to noisy context.
- RAG and fine-tuning are complementary: one injects knowledge, the other shapes behavior.

:::note See also on AWS
For how faithfulness and hallucination are measured with managed tooling — Bedrock Model Evaluation jobs and Guardrails' contextual grounding check — see [Model Evaluation & Agentic Techniques](/aws/ai/evaluation-and-agents) and [RAG & Vector Stores: measuring RAG quality](/aws/ai/rag-and-vector-stores#measuring-rag-quality).
:::

## What to Read Next

Next comes the production layer: once retrieval and generation both work, the hard problem becomes operating the whole system safely and predictably under real traffic.
