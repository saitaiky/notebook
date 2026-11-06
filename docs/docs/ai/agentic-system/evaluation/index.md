---
title: Evaluation
description: 'When applying evaluation, consider the following approaches:.'
keywords:
  - ai
  - agentic system
  - evaluation
  - when
  - applying
  - consider
  - following
  - approaches
---


When applying evaluation, consider the following approaches:

1. **Offline Evaluation**  
   Suitable for prompts requiring a known reference answer (e.g., correctness checks).
2. **Online Evaluation**  
   Used for prompts without a strict reference, letting you assess the system in real-time scenarios.
3. **Pairwise Evaluation**  
   Compares answers from different RAG chains or configurations based on user-defined criteria such as format or style.

:::info Pointwise vs Pairwise Evaluation
![Pointwise vs Pairwise Evaluation](/img/software-development/interview/pointwise-vs-pairwise.avif)
Source: [Arxiv - Large Language Models for Information Retrieval](https://arxiv.org/abs/2308.07107)

Pointwise methods measure relevance between a query and a single document. Subcategories include relevance generation and query generation, both effective in zero-shot document reranking.
:::

## Evals as Acceptance Criteria, Not a QA Afterthought

The standard instinct is to build a system, see if it looks right, and test later. That ordering has a real cost: if a behavior has no eval, there is no reliable way to know whether that behavior is present, which means every subsequent change to the system is unverifiable.

Writing the eval suite before production code forces three things that are otherwise easy to defer:

- Stating what success means in measurable terms, instead of a vague intuition.
- Exposing design assumptions early, when they are still cheap to change.
- Providing a gate that can say whether a model swap, a prompt revision, or a new retrieval strategy actually improved the system, rather than just felt different.

An eval suite belongs at the start of the build, not at the end as a QA step.

### The Eval Workflow: From Task Definition to Result

A well-constructed eval workflow runs through five sequential stages, and each stage produces an artifact the next stage consumes.

```mermaid
flowchart LR
  A[Define the task] --> B[Build the golden dataset]
  B --> C[Run automated checks]
  C --> D[Score with a judge]
  D --> E[Interpret and act]
```

| Stage | What happens | Output |
| --- | --- | --- |
| Define the task | State the behavior being evaluated in specific, measurable terms, and write the prompt used to test it. A vague definition produces a vague eval. | A task specification with a test prompt and pass criteria |
| Build the golden dataset | Assemble the inputs the system will actually encounter, including edge cases and counterexamples. If the dataset is not representative, the scores are not meaningful. | A labeled dataset with expected outputs |
| Run automated checks | Pass each prompt through the system and compare the output against the expected result. Reserve this stage for behaviors that are unambiguous: format compliance, schema validation, factual lookups against authoritative data. | A pass/fail record per item |
| Score with a judge | For behaviors that need interpretation — tone, reasoning quality, edge-case appropriateness — a model-based judge assesses outputs at scale. | A score per item, with reasoning |
| Interpret and act | Aggregate scores show where the system stands and whether a change moved it in the right direction. A change that raises the mean score while quietly degrading edge cases has not made the system better. | An overall score plus a per-category breakdown |

### Code-Based, Model-Based, and Human-Review Evals

Not every behavior can be checked the same way. Some behaviors have a single correct answer — valid JSON or not. Others depend on whether the output matches an expected tone or style. Picking the right grading tool for a given behavior matters for both accuracy and cost.

| Eval type | How it works | When to use it | Cost | Limitation |
| --- | --- | --- | --- | --- |
| Code-based | A function checks the output programmatically: schema validation, regex match, JSON parse, length check, assertion against authoritative data. | Any unambiguous behavior — format compliance, schema correctness, lookup accuracy, length constraints | Very low — milliseconds per check, no API call | Cannot assess anything that requires interpretation |
| Model-based (LLM-as-judge) | A judge model receives the original prompt, the system output, and a scoring rubric, then returns a score and reasoning. | Response quality, instruction following, reasoning accuracy, safety, handling of ambiguous inputs | Medium to high — one API call per item, at the judge model's rate | Judges can be inconsistent on borderline cases; forcing the judge to produce reasoning alongside the score is what makes that inconsistency detectable |
| Human review | A person scores the output against a rubric, structured or open-ended. | High-stakes or novel behaviors where neither a function nor a judge model can be trusted yet; also useful for calibrating a judge | High — the most expensive, least scalable option | Slow, not viable at scale beyond a sampled subset, and introduces its own inconsistency |

### The Grading Ladder

The grading method follows a deliberate ladder — reach for the cheapest reliable method first, and climb only when the behavior demands it.

1. **Code-based grading, wherever the behavior allows it.** Deterministic checks run in milliseconds, cost almost nothing, and never drift.
2. **LLM-as-judge, when the behavior needs interpretation.** Make it rigorous with detailed rubrics, constrained verdicts (a small fixed set of labels rather than a free-form score), calibration against human-labeled examples, and grading with a *different* model than the one being evaluated, to avoid self-preference.
3. **Human grading, as the last resort.** Reserve it for high-stakes or novel behaviors where neither code nor a calibrated judge is trustworthy yet.

:::warning[Judge calibration is the step teams skip]
An LLM judge is itself a system that can be wrong. Before trusting its verdicts, run it against a set of human-labeled outputs and confirm its agreement with human judgment is high enough to rely on. An uncalibrated judge produces confident scores that may not be good at all — which is worse than no automated grade, because it *looks* trustworthy.
:::

Favor volume over perfection: many cheap, automatically-gradable cases catch more regressions than a handful of painstakingly hand-graded ones, and the cheap set can run on every single change.

### Turning a Business Requirement into a Measurable Threshold

A requirement like "summarize claims accurately" doesn't tell you what to measure. Turning it into an eval criterion means:

- **Naming the behavior specifically.** "Summarize claims accurately" becomes "extract the filer's name, claim number, incident date, and claimed amount from each document."
- **Setting the threshold from the business requirement, not the prototype.** If the thresholds are 100% accuracy on structured fields, under 2% hallucination rate, and 99.5% schema compliance, those numbers should come from what the business actually needs — not from whatever the first prototype happened to achieve.
- **Naming the failure modes.** A fake claim number, a missing incident date, a value pulled from the wrong claim — each failure mode becomes its own category in the eval dataset.
- **Including adversarial inputs.** Documents with missing fields, handwritten sections, and unusual formatting all belong in the golden dataset. A golden dataset built only from clean inputs produces eval scores that don't predict production performance.

### Evals as the Gating Mechanism for Every Change

Every change to a production system — a model swap, a prompt revision, a context-strategy change, a retrieval-configuration update — should run through the eval suite before it reaches production. It is the only reliable way to know whether a change actually improved the system, and it backs the same discipline as the [delta-threshold release gates](/ai/agentic-system/prompting-vs-agentic-prompting#delta-thresholds-what-actually-makes-a-rubric-score-a-release-gate) covered elsewhere in this catalog.

A single-turn eval set won't reveal how a system holds up across a conversation. **Multi-turn evals** are a separate category that scores a whole conversation rather than one prompt-response pair — checking whether the system keeps prior context straight across turns, answers a follow-up without inventing details, and holds output quality as the conversation runs longer. Because the unit being scored is the whole conversation, multi-turn evals need their own golden dataset: full transcripts with known-good responses at each turn, covering the follow-ups, topic shifts, and lengths production will actually see.

:::danger[An eval suite is only as good as its last update]
A team revised a summarization prompt but didn't update the eval suite to match. The suite kept passing — because its golden dataset still reflected the *old* prompt's expected outputs, not the new behavior. Two days after the swap reached production, multi-clause sentences were being truncated in summaries that the stale eval had no way to catch. An eval suite that isn't updated alongside the system it measures provides false confidence, which is worse than no suite at all.
:::

Cost · Complexity · Risk

**Cost:** Every model-based eval is an API call, but under-evaluating is the bigger risk — a production-breaking change that slips through an undersized suite costs far more than the extra API calls a bigger one would need.

**Complexity:** Eval infrastructure is a parallel system to maintain: the golden dataset has to stay current, judge prompts need engineering and testing, and pass thresholds need revisiting as requirements change.

**Risk:** The highest-risk moment for a regression is exactly when an eval suite exists but is out of date — it creates the appearance of a safety net that isn't actually catching anything.

### Choosing a Grader by the Shape of the Output

The grading ladder above says *reach for the cheapest reliable method*, but the choice is not really about cost first — it is about what the output's structure can support. Comparing how one output scores under each method makes the right pick obvious.

Imagine a feature that should return the three capital cities of a region as a JSON array, and a run returns the right three cities in a different order than the reference string. An **exact match scores it zero**, because the characters do not line up — even though the answer is correct. A **code grader that parses the JSON and checks membership** scores it well, because all three cities are present and the structure is valid. Now change the feature so it should return a one-paragraph rationale: the code grader can only confirm it is a non-empty string (nearly worthless here), exact match is hopeless because no two good rationales are worded the same, and **only a judge** can say whether the rationale is faithful and complete.

So the rule *one correct form takes a match, a structural rule takes a code check, open-ended quality takes a judge* unpacks to three different questions about the output:

- **Is there exactly one acceptable string?** Then the output has a single correct *form*, and an exact match is enough — a classifier label, a known return value. Anything that can be validly reworded or reordered breaks it.
- **Is correctness a rule a function can evaluate?** Then the output has a checkable *structure* — valid JSON, a number in range, a required field present — and a code grader catches the whole class of format failures a string match would miss.
- **Does "good" require interpretation?** Then quality is open-ended — faithful, complete, on-tone — and no code rule expresses it, so a judge is the only method that scales.

There is a cost-and-frequency dimension the ladder understates. An exact match and a code check run locally and cost effectively nothing per case, so thousands of them can run on every commit. A judge is a second model call per case, so a thousand-case judge eval is a thousand extra API calls every run — reasonable for a scheduled quality pass, wasteful as a tight inner loop. Many teams grade format and structure with code on every change and reserve the judge for a slower, periodic pass.

### Calibrating a Judge So Its Scores Are Defensible

An LLM judge is itself a system that can be wrong, and the two steps that make it trustworthy are both easy to skip.

The first is **asking for reasoning before the score**. A judge told only to return a number drifts toward a safe middle value — usually around six — regardless of the output's actual quality, because a bare number has nothing to anchor it and hedging is the low-risk move. Requiring strengths, weaknesses, and a short reasoning field *first*, then the score, forces the number to attach to something specific. This is the same chain-of-thought-then-score design that G-Eval ([Liu et al., 2023](https://arxiv.org/abs/2303.16634)) uses: generating evaluation steps before filling in the score raised correlation with human judgment on summarization to a Spearman of 0.514, well above prior reference-based metrics.

The second is **measuring agreement against human labels before you rely on the judge**. Start from a set of cases a human has already labeled, run the judge on the same cases, and measure how often it agrees. A judge that disagrees with human labels half the time produces a number that looks rigorous and means nothing. When MT-Bench and Chatbot Arena ([Zheng et al., 2023](https://arxiv.org/abs/2306.05685)) validated this, a strong judge reached over 80% agreement with human preferences — about the same level humans reach with each other — which is the bar that turns a judge from a guess into evidence. Report agreement with an explicit metric rather than an eyeballed percentage: for categorical verdicts, Cohen's kappa (two raters) or Krippendorff's alpha (chance-corrected, handles missing labels) states how much of the agreement survives after correcting for what chance alone would produce.

:::warning[Judges carry biases a calibration run can surface]

The same validation work also documents judge failure modes to watch for: **position bias** (favoring the first option in a pairwise comparison), **verbosity bias** (scoring longer answers higher), and **self-enhancement bias** (a model preferring outputs from its own family). If a calibration run disagrees with humans in a consistent direction, suspect one of these before trusting the scores — and prefer a judge from a *different* model family than the one being evaluated.

:::

If agreement is low, the fix is the rubric, not the model: tighten what each score band means, add a worked example of a good and a bad answer, and re-measure. That rubric-iteration history is worth keeping in the design document, because a judge's score is only as auditable as the rubric that produced it.

### The Eval Iteration Loop

Once the eval and a calibrated judge exist, improving a feature becomes a loop: set a goal, write an initial prompt, run the eval, read where it failed, apply one change, and run again. The discipline that makes the loop informative is **changing one component at a time**. Rewriting the prompt, adding two examples, and switching the model in one pass and watching the score move teaches nothing about which change caused it. Move one lever, re-run, and keep the change only if the score goes up.

The per-case breakdown matters as much as the average, because a steady average can hide a change that fixed three cases and broke three others. The aggregate conceals that; the per-case view shows it immediately. And a low score is information to act on, not just a verdict — the *category* of failure points at the layer to fix:

- A formatting failure points at the prompt's output instructions.
- A factual failure on retrieved content points at the retrieval step.
- A failure that appears only on long input points at context handling.

The eval tells you a case failed; the per-case output tells you which layer owns the fix, which is what turns the next iteration into a targeted change rather than a guess.

:::info[What a "partial eval" means]

A partial eval is an eval deliberately left incomplete so you have to finish the specification yourself: some `expected_behavior` rows in the dataset are blank, and the judge's score-band definitions (what 1–3, 4–7, 8–10 each mean) are left to be filled in. Completing it is the exercise — it checks whether you can state the exact output each input should produce and what each score band rewards, which is the same precision the real eval depends on.

:::

### Validation Confirms Shape, Not Correctness

The most expensive eval gap is the one that looks covered. A team shipped a feature that extracted structured fields from customer messages, checked it against roughly a dozen example messages by hand, agreed the outputs looked right, and deployed. It even had input validation: it confirmed each message was non-empty text, checked that a date field came back populated, and rejected malformed or impossible dates. For two weeks it worked.

Then a customer wrote *"I placed my order on March 3 but did not receive it until April 12."* The feature extracted **April 12** as the order date. Every validation check passed, because both dates are well-formed and the field came back populated — and downstream logic updated a batch of records with the wrong date.

```mermaid
flowchart TB
  I["Input: two dates in one sentence<br/>'ordered March 3 ... received April 12'"] --> E[Extract order date]
  E --> V{Validation checks}
  V -->|non-empty text? yes| P[pass]
  V -->|date populated? yes| P
  V -->|well-formed, possible date? yes| P
  P --> W["Returns April 12<br/>(wrong value, right shape)"]
  W --> D[Downstream updates the wrong record]
  style W fill:#f8d7da,stroke:#b02a37
  style D fill:#f8d7da,stroke:#b02a37
```

The diagram shows why the checks could not catch it: every gate asks whether the value has the right *shape*, and none asks whether it is the right *value*. Validation confirms a value is well-formed; it cannot confirm the value is correct. The root cause was a missing graded case — the feature had never been measured against a message containing two dates, because nobody had written that expected behavior down. The eval does not fix the extraction (a prompt change naming which date to extract does that); it **detects** the failure, documents the expected behavior as a checkable case, and guards against the same regression on every future change. The two-date message becomes case one in that set.

:::tip

To find inputs like this before a customer does, ask the model to enumerate edge cases that could break the current implementation — two dates in one sentence, no date at all, a relative date like "next Tuesday" — then turn the plausible ones into graded cases with a human-checked expected output. It is the same case-generation move as [coverage over perfection](#the-grading-ladder), applied before launch rather than after.

:::

## 4 Different application-specific techniques

### 1. Agents
- **Definition & Role**  
  - Agents are LLM-driven systems that can take actions and use external tools based on user requests or conversation context.  
  - They often employ a planning-and-execution loop, determining when to consult APIs, perform calculations, or retrieve specific documents.
- **Evaluation Challenges**  
  - **Multi-Step Reasoning**: Agents must plan tasks effectively; improper step-by-step reasoning can lead to incorrect or suboptimal results.  
  - **Tool Integration**: An agent’s effectiveness depends on how accurately it invokes external tools.  
  - **Error Compounding**: A minor mistake early in the chain of thought can derail subsequent steps, making it tricky to evaluate correctness at each stage.
- **Evaluation Methods**  
  - **Step-by-Step Trace Analysis**: Examining the chain of thought and verifying each action (e.g., which APIs are called, which documents are retrieved) reveals where logic might fail.  
  - **Scenario Testing**: Setting up test scenarios (like booking a flight or summarizing search results) to see if the agent follows correct reasoning steps and returns the right final answer.  
  - **Human or Heuristic Checks**: Human judges or rule-based checks ensure the agent’s output is consistent with each intermediate action (e.g., confirming the correctness of tool usage).

### 2. Retrieval-Augmented Generation (RAG)
- **Core Idea**  
  - RAG systems retrieve relevant documents from a large corpus, then feed those documents to an LLM to produce a context-grounded answer.  
  - The goal is to reduce hallucination by anchoring responses in specific references.
- **Evaluation Focus**  
  - **Retriever Performance**: Ensuring the system fetches the right context. Common metrics include relevance, recall, precision, and Mean Reciprocal Rank (MRR).  
  - **Faithfulness & Accuracy**: Checking if the generated output truly reflects the retrieved info instead of introducing fabricated content.  
  - **End-to-End Quality**: Although retriever and generator can be evaluated separately, it’s often best to assess the final user-facing answer for correctness and completeness.
- **Methods & Best Practices**  
  - **Reference Answers**: For fact-based queries, compare the system’s output to a known gold-standard.  
  - **Document Relevance Checks**: Evaluate how well the retrieved documents match the original question.  
  - **LLM-as-Judge**: Employ a secondary model to grade correctness, groundedness, or relevance of the final answer.

### 3. Summarization
- **Purpose**  
  - Summaries distill lengthy text—articles, reports, transcripts—into a concise form.  
  - The challenge is ensuring the summary is both complete (capturing essential points) and accurate (no fabricated details).
- **Common Pitfalls**  
  - **Omission of Key Details**: Summaries can accidentally skip crucial information.  
  - **Hallucinations**: The model might invent facts not in the source text, undermining trust.  
  - **Length Constraints**: Some tasks require extremely short summaries, which risk omitting context or nuance.
- **Evaluation Strategies**  
  - **Reference-Based Metrics**: BLEU, ROUGE, and BERTScore measure overlap with a human-written summary. These provide a baseline but may miss subjective quality issues.  
  - **Expert Review**: Domain experts check fidelity, comprehensiveness, and clarity.  
  - **Quality Dimensions**: Focus on coverage (did it include main points?) and faithfulness (did it avoid factual errors or additions?).

### 4. Classification & Tagging
- **Application Scope**  
  - Encompasses tasks like labeling text with categories (e.g., sentiment analysis) or assigning tags (e.g., topics, entities, or user-defined attributes).  
  - May also involve multi-label classification, where each item can belong to multiple categories.
- **Key Considerations**  
  - **Label Consistency**: The system should maintain consistent use of labels across examples.  
  - **Granularity**: Labels can be too broad or too narrow, depending on user needs.  
  - **Edge Cases**: Overlapping categories or ambiguous content can lead to confusion and mislabeling.
- **Evaluation Metrics**  
  - **Precision, Recall, F1-score**: Traditional classification metrics help gauge the system’s correctness.  
  - **Confusion Matrix Analysis**: Identifies which categories are commonly misclassified.  
  - **Human Validation**: Humans can review borderline cases for more nuanced interpretation, especially in subjective categories like sentiment or style.




## What is reference-free?

When the documentation says “reference-free,” it means **you don’t have a single canonical or gold-standard answer** to compare against. In other words, there isn’t a labeled dataset that says “The correct answer must be X.” Instead, you might rely on:

- **Human or LLM-based judgment** to rate the quality of answers (e.g., is the response helpful, coherent, or relevant?).  
- **Task- or domain-specific heuristics** (e.g., checking if code compiles, or if an explanation covers certain keywords).

For instance, if you’re building a **creative writing LLM** or an **open-ended chatbot**, you often don’t have a “right answer” for each query—thus, you’re doing “reference-free” evaluation, focusing on subjective measures like clarity, helpfulness, or style rather than comparing to a single correct solution.


## TO-DO jotted

In the [documentation](https://docs.smith.langchain.com/evaluation/concepts#retrieval-augmented-generation-rag), “Offline evaluation” is described as a strategy for assessing prompts or outputs in a **non-live environment**, typically using a labeled dataset or reference answers. While RAG systems often use offline evaluation for checking retrieval accuracy or final answer correctness, **offline evaluation can be applied to any LLM application** — not just RAG. For example:

- **Agentic LLM applications**: You might have a multi-step reasoning agent that works with external tools. You could still perform offline tests on a set of known questions and reference answers or states to verify correctness.
- **Translation or Summarization tasks**: You can gather reference texts or ground-truth summaries and compare model outputs using automated metrics (ROUGE, BLEU, etc.) offline.
- **Open-ended conversation**: Even if there’s no single correct answer, you can still do a reference-free offline evaluation by rating quality or style using a known dataset of “good” conversation examples.

So, **offline evaluation** is not limited to only the RAG portion. It can be used to evaluate any part of an LLM-driven system where you want to test outputs or behaviors against a dataset or reference standard — or simply in a controlled setting outside live user interactions.
