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
