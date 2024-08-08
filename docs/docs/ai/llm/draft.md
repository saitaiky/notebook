---
title: Draft
draft: true
---



## Context window

The context window limit of 512 tokens is a common restriction for many transformer-based models, including the `google/flan-t5-base`, due to computational and memory efficiency considerations. Here are some key reasons:

### Reasons for the 512 Token Limit

1. **Computational Efficiency**: Transformer models scale quadratically with the sequence length in terms of memory and computation. Increasing the context window significantly increases the resource requirements, making it computationally expensive.

2. **Training Data**: The models are often trained on datasets where the maximum context window is 512 tokens. This choice balances the need for sufficiently long contexts with practical limits on computational resources.

3. **Memory Constraints**: Longer sequences require more memory to process, which can be prohibitive on standard hardware. A 512-token limit is a compromise that allows the model to be used on a wide range of hardware, including GPUs with limited memory.

4. **Standardization**: Many models use 512 tokens as a standard maximum sequence length. This standardization helps with compatibility and benchmarking across different models and tasks.

### Handling Long Sequences

For tasks requiring longer contexts, you can consider several strategies:

1. **Truncation**: As mentioned earlier, truncate the input to fit within the 512-token limit. Ensure that the most critical information is retained.

2. **Sliding Window**: For very long texts, apply a sliding window approach where you process overlapping chunks of the text. This can help the model capture dependencies across longer sequences.

3. **Longer Context Models**: Use models designed for longer contexts, such as `Longformer`, `BigBird`, or `GPT-3`, which support longer sequence lengths by employing efficient attention mechanisms.

4. **Hierarchical Models**: Use hierarchical approaches where you first summarize or encode parts of the text and then process the summaries or encodings.


## How to choose max_steps and num_train_epochs

Choosing between using `max_steps` and `num_train_epochs` depends on your specific training requirements and constraints. Here are some scenarios where you might prefer one over the other:

- **Use `max_steps`** (**Sai**: total number of training steps )when you need precise control over the number of training steps, have a fixed computational budget, or are comparing training efforts across different datasets.
- **Use `num_train_epochs`** when you want to ensure the model sees the entire dataset multiple times, prefer predictable training durations, or follow standard training practices.

**Sai**: the model will only train for one step, regardless of the values set for num_train_epochs and the size of your dataset. The max_steps parameter takes precedence over num_train_epochs. 
In many practical scenarios, you might start with `num_train_epochs` to get a sense of how the model performs over a few epochs and then switch to `max_steps` for fine-tuning or resource-constrained training.

- If you want consistent training across different dataset sizes (e.g., when comparing different models or datasets): Use max_steps.
- If you want to ensure full passes through the dataset (e.g., for thorough learning or when following traditional epoch-based training): Use num_train_epochs.

```python
output_dir = f'./peft-Q&A-training-{str(int(time.time()))}'

peft_training_args = Seq2SeqTrainingArguments(
    output_dir=output_dir,
    auto_find_batch_size=True,
    learning_rate=1e-3, # Higher learning rate than full fine-tuning.
    num_train_epochs=10,
    logging_steps=5,
    max_steps=10,
    predict_with_generate=True,
    generation_max_length=50,
)
    
peft_trainer = Seq2SeqTrainer(
    model=peft_model,
    args=peft_training_args,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["validation"],
)
```

## Evaluation Metrics

For numerical reasoning tasks, standard NLP metrics like BLEU or ROUGE might not fully capture the model's performance. Here are more suitable metrics:

- **Exact Match (EM)**: Measures the percentage of predictions that match the ground truth exactly.
- **Numerical Accuracy**: Checks if the numerical values in the predictions are correct, even if the rest of the text is slightly different.
- **F1 Score**: Useful for partial matches, especially when the task involves multiple steps or components.


## Conversation Level and Turn Level

**Conversation Level** and **Turn Level** refer to the structure and granularity of the dataset:

1. **Conversation Level**:
    - This refers to the entire dialogue or interaction between the user and the system. At this level, the dataset includes the full context of the conversation, with multiple turns or exchanges between the participants.
    - For example, a conversation might include several questions and answers related to financial data, and this entire sequence is considered at the conversation level.

2. **Turn Level**:
    - This refers to individual exchanges within a conversation. Each question-answer pair within the conversation is a separate turn.
    - For example, in a conversation where a user asks a series of questions about financial statements, each question and the corresponding answer form one turn.

Understanding these levels is crucial for tasks like dialogue management and context tracking in conversational AI systems.

## Retriever and Generator

In the context of this repository, **Retriever** and **Generator** are components used for different stages of processing the conversational financial question answering task:

1. **Retriever**:
    - The retriever is responsible for identifying and fetching relevant pieces of information or documents that might contain the answer to a given question.
    - In a financial QA system, the retriever would search through a large corpus of financial documents to find the most relevant sections that might contain the answer to the user's question.

2. **Generator**:
    - The generator is responsible for generating the final answer based on the retrieved information.
    - After the retriever fetches relevant documents, the generator processes this information to produce a coherent and accurate answer to the user's question.
    - This often involves using advanced language models that can understand context and generate human-like responses.




## Q&A

### Multi-Hop Questions

**Multi-hop questions** are questions that require multiple steps or "hops" to arrive at the answer. Instead of a single direct answer, you need to combine information from different parts of the data. For example, to answer "What was the profit increase from Q1 to Q2?", you would:
1. Identify profits for Q1 and Q2.
2. Calculate the increase.

In financial contexts, this might involve interpreting various segments of financial reports and performing calculations.

### Construction of Conversations

**Conversation Types:**
1. **Simple Conversations:** 
    - These are derived from single multi-hop questions.
    - Example: A single multi-hop question is split into a sequence of simpler, related questions forming a conversation.
    - Original question: "What is the year-over-year growth in revenue from 2019 to 2020?"
    - Conversation:
      - Q1: "What was the revenue in 2019?"
      - Q2: "What was the revenue in 2020?"
      - Q3: "How much did the revenue grow from 2019 to 2020?"

2. **Hybrid Conversations:**
    - These integrate two multi-hop questions related to the same financial report.
    - Example: Combining questions about revenue growth and profit margin within one conversation.

**Question Composition:**
- **Expert Annotators:** Human experts create natural language questions from these structured conversation skeletons. This process involves:
  - Converting technical or structured data into fluid, conversational language.
  - Ensuring the questions are coherent and follow a natural dialogue flow.
