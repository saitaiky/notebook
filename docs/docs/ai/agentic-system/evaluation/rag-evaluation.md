---
title: RAG Evaluation
description: 'Source: Langchain - Rag from scratch.'
draft: true
keywords:
  - ai
  - agentic system
  - rag evaluation
  - rag
  - evaluation
  - source
  - langchain
  - scratch
---

> Reference: 
> - [LangChain Evaluation Concepts & Heuristics](https://docs.smith.langchain.com/evaluation/concepts#heuristic)


![rag-from-scratch](/img/software-development/interview/rag-from-scratch.png)
Source: [Langchain - Rag from scratch](https://github.com/langchain-ai/rag-from-scratch/blob/main/rag_from_scratch_1_to_4.ipynb)

# Evaluating RAG Systems: A Comprehensive Guide

In Retrieval-Augmented Generation (RAG) systems, effective performance hinges on two distinct yet interdependent components. The retriever fetches relevant context from a large document corpus, while the generator produces a final response based on that retrieved context. To ensure high-quality outputs, it is crucial to evaluate both components. **Retriever evaluation** focuses on the accuracy and relevance of the retrieved information, whereas **end-to-end RAG quality** (previously referred to as “Generator Evaluation”) assesses the coherence, factual correctness, and overall quality of the final output. Below is a detailed breakdown of how each can be evaluated, with metrics and methods used in practice.

## Retriever Evaluation (未肯定岩唔岩)

### Focus

The main purpose of the retriever in a RAG system is to efficiently locate and provide contextually relevant information. Its quality directly impacts the system’s ability to produce accurate and meaningful responses. Therefore, evaluating the retriever centers on determining how effectively it identifies the right documents or passages that answer the user’s query.

### Key Metrics

1. **Relevance**  
   - **Definition**: Measures how well the retrieved documents match the user’s query in terms of content and context.  
   - **Example**: For the query “What are the symptoms of diabetes?”, a highly relevant retrieval would include documents that list symptoms like increased thirst, frequent urination, and fatigue.

2. **Recall**  
   - **Definition**: Quantifies the ability of the retriever to fetch all potentially relevant documents. A high recall means few relevant documents are missed.  
   - **Example**: If there are 10 relevant documents in the corpus about “What is climate change?” and the retriever returns 8 in the top results, the recall is 80%.

3. **Precision**  
   - **Definition**: Evaluates the proportion of truly relevant documents among those retrieved, indicating how well the retriever avoids false positives.  
   - **Example**: If the system returns 5 documents on “machine learning algorithms” but only 3 truly match, precision is 60%.

4. **Factual Accuracy**  
   - **Definition**: Ensures the content of the retrieved documents is factually correct and current.  
   - **Example**: If the user asks for the population of New York City, the retriever should locate documents reflecting the latest census data.

### Methods for Evaluation

- **Human Evaluation:**  
  Subject-matter experts review documents for accuracy and contextual relevance, capturing nuances that automated metrics might miss.

- **Automated Metrics:**  
  Tools compute precision, recall, and F1-scores to quantify both the coverage and quality of retrieval.

- **Ranking Metrics:**  
  Mean Reciprocal Rank (MRR) measures the position of the first relevant document. A consistently high rank indicates strong retrieval performance.

- **LLM-as-Judge for Retrieval Evaluation:**  
  A language model can be prompted to assess “retrieval relevance” by comparing the retrieved documents with the original query, providing a more human-like judgment of retrieval quality.

## End-to-End RAG Quality

> Reference:
> - Google: [Optimizing RAG retrieval: Test, tune, succeed](https://cloud.google.com/blog/products/ai-machine-learning/optimizing-rag-retrieval)
> - LangSmith: [Evaluate a RAG application](https://docs.smith.langchain.com/evaluation/tutorials/rag#evaluators)

### Focus

After the retriever identifies relevant context, the system produces the final response. While often described as “Generator Evaluation,” this step effectively **measures the overall RAG pipeline**—because the user-facing output depends on both the retrieved context and the generation process. If retrieval is incomplete or off-target, it can undermine the generator’s accuracy, and if the generator hallucinates facts, it can negate the benefits of perfect retrieval. As such, we evaluate the *combined* performance of retrieval plus generation.

:::info
This isn’t *purely* measuring the generator in isolation. Instead, we examine the final answer’s correctness, coherence, and faithfulness to the retrieved documents—factors that result from the synergy of both retrieval and generation.
:::

### Key Metrics

![Reference](/img/software-development/interview/reference-output.png)
Source: [LangSmith - Conceptual Guide](https://docs.smith.langchain.com/evaluation/concepts)

When evaluating RAG applications, you can have evaluators that require reference outputs and those that don't:

1.  Require reference output: Compare the RAG chain's generated answer or retrievals against a reference answer (or retrievals) to assess its correctness.
2.  Don't require reference output: Perform self-consistency checks using prompts that don't require a reference answer (represented by orange, green, and red in the above figure).

Below is a table to hightlight 5 metrics that we can use in RAG

| Evaluator             | Detail                                                        | Needs Reference Output | LLM-as-Judge?                                           | Pairwise Relevant | Target       |
|-----------------------|---------------------------------------------------------------|------------------------|---------------------------------------------------------|-------------------|-------------|
| Document Relevance    | Are documents relevant to the question?                       | No                     | Yes – [prompt](https://smith.langchain.com/hub/langchain-ai/rag-document-relevance) | No                | Retriever    |
| Answer Faithfulness   | Is the answer grounded in the documents?                      | No                     | Yes – [prompt](https://smith.langchain.com/hub/langchain-ai/rag-answer-hallucination)   | No                | Generator (depends on retrieved docs) |
| Answer Helpfulness    | Does the answer help address the question?                    | No                     | Yes – [prompt](https://smith.langchain.com/hub/langchain-ai/rag-answer-helpfulness)       | No                | Generator    |
| Answer Correctness    | Is the answer consistent with a reference answer?             | Yes                    | Yes – [prompt](https://smith.langchain.com/hub/langchain-ai/rag-answer-vs-reference)       | No                | Generator    |
| Pairwise Comparison   | How do multiple answer versions compare?                      | No                     | Yes – [prompt](https://smith.langchain.com/hub/langchain-ai/pairwise-evaluation-rag)       | Yes               | Generator    |

:::info Doesn't Faithfulness works for both?
In some cases, you might argue that faithfulness depends on both retrieval and generation. However, most frameworks treat it as a generator-focused metric (did the model stick to the retrieved info?), acknowledging that suboptimal retrieval can also cause unfaithful final outputs.
:::

-  Correctness: Response vs reference answer
    - `Goal`: Measure "*how similar/correct is the RAG chain answer, relative to a ground-truth answer*"
    - `Mode`: Requires a ground truth (reference) answer supplied through a dataset
    - `Evaluator`: Use LLM-as-judge to assess answer correctness.
-  Relevance: Response vs input
    - `Goal`: Measure "*how well does the generated response address the initial user input*"
    - `Mode`: Does not require reference answer, because it will compare the answer to the input question
    - `Evaluator`: Use LLM-as-judge to assess answer relevance, helpfulness, etc.
-  Groundedness/Faithfulness: Retrieved docs vs Response
    - `Goal`: Measure "*to what extent does the generated response agree with the retrieved context*"
    - `Mode`: Does not require reference answer, because it will compare the answer to the retrieved context
    - `Evaluator`: Use LLM-as-judge to assess faithfulness, hallucinations, etc.
-  Retrieval relevance: Retrieved docs vs input
    - `Goal`: Measure "*how relevant are my retrieved results for this query*"
    - `Mode`: Does not require reference answer, because it will compare the question to the retrieved context
    - `Evaluator`: Use LLM-as-judge to assess relevance

### Methods for Evaluation

- **Human Evaluation:** Experts assess whether the final answer is relevant, coherent, accurate, and faithful.
- **[Heuristic](https://docs.smith.langchain.com/evaluation/concepts#heuristic):** Heuristic evaluators are deterministic, rule-based functions. These are good for simple checks like making sure that a chatbot's response isn't empty, that a snippet of generated code can be compiled, or that a classification is exactly correct.
- **LLM-as-Judge (Model-Based Metrics):** A secondary language model is used to assign scores or labels (e.g., “correct,” “incorrect,” “relevant,” “irrelevant”) to the final output. It can also compare multiple versions of an answer for pairwise evaluations.
- **[Pairwise​](https://docs.smith.langchain.com/evaluation/concepts#pairwise)**:
  Pairwise evaluators allow you to compare the outputs of two versions of an application. Think [LMSYS Chatbot Arena](https://chat.lmsys.org/) - this is the same concept, but applied to AI applications more generally, not just models! This can use either a heuristic ("which response is longer"), an LLM (with a specific pairwise prompt), or human (asking them to manually annotate examples).
  - **When should you use pairwise evaluation?**
    Pairwise evaluation is helpful when it is difficult to directly score an LLM output, but easier to compare two outputs. This can be the case for tasks like summarization - it may be hard to give a summary an absolute score, but easy to choose which of two summaries is more informative.


## Bridging the Evaluations for End-to-End Performance

![Improve](/img/software-development/interview/improve-rag.png)
Source: [Langchain - Rag from scratch](https://hamel.dev/blog/posts/evals/#problem-how-to-systematically-improve-the-ai)

While the retriever and the final answer (generator) can be evaluated separately, the real value emerges when both work in tandem. Even perfect retrieval can be undone by a generator that hallucinates, and a capable generator can sometimes compensate for imperfect retrieval. You can improve the performance by the following approaches: 

- **Prompt Engineering / Prompt Refinement**:  
  - Adjust your prompts by giving more explicit instructions, better examples, or stricter formatting requirements.  
  - This can help reduce hallucination and lead to more consistent outputs.
- **Better Retrieval Setup**:  
  - If test results show that retrieval is subpar, you can try new embeddings, vector databases, or chunking strategies.  
  - Tweak your top-k retrieval or filtering to ensure only highly relevant documents are returned.
- **Fine-Tuning or Instruction Tuning**:  
  - For more domain-specific tasks, you might fine-tune the base model on curated examples.  
  - This step can be especially effective if your domain language is specialized, or if you need a particular format/style consistently.

### 呢段有保留
Many teams use an “evaluation harness” that simulates the complete user query flow, measuring not only recall and precision for retrieval but also the accuracy, coherence, and faithfulness of the final answer. Metrics like average F1 for the answers and MRR for the retrieved documents can pinpoint where bottlenecks lie—be it in the retrieval threshold or the generator’s tendency to deviate from the source material.

## Conclusion

Evaluating RAG systems calls for a two-pronged strategy: ensure the retriever effectively finds the right context, and then measure the combined, end-to-end result (generator + retrieval). Classic metrics like recall, precision, and ranking scores are crucial for the retriever, whereas final answer coherence, correctness, and groundedness matter for the end-to-end RAG quality. By using a mix of **human judgment**, **automated metrics** (e.g., BLEU, ROUGE, BERTScore), and **LLM-as-Judge approaches** (e.g., correctness vs. reference), teams can gain comprehensive insights into their system’s performance. This holistic approach ensures iterative refinements—whether to the retrieval logic or the generation prompt—delivering trustworthy, coherent, and user-relevant results every time.
