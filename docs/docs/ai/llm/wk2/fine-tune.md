---
title: Fine-tuning 
sidebar_position: 1
draft: true
---


## Fine-tuning LLMs with Instruction

### Introduction

Welcome back to the course! This week, we will dive into instruction tuning of large language models (LLMs) and learn how to carry out fine-tuning efficiently. We'll be guided by our instructors, Mike and Shelby.

### Instruction Fine-tuning

#### Base Model Training

- The base model, initially pretrained, encodes a vast amount of general information.
- It understands many things but doesn't necessarily know how to respond to specific prompts or questions.

#### Importance of Instruction Fine-tuning

- **Predicting vs. Following Instructions**: Base models trained on general internet text learn to predict the next word but not to follow specific instructions.
- **Fine-tuning for Instructions**: Fine-tuning a pretrained model with a smaller dataset focused on following instructions can significantly improve its ability to respond appropriately to tasks.

#### Challenges: Catastrophic Forgetting

- **Catastrophic Forgetting**: When fine-tuning on new data, the model may forget previously learned information.
- **Mitigation Techniques**: 
  - Use a broad range of instruction types during fine-tuning.
  - This approach helps the model retain a wider scope of its original knowledge while learning new tasks.

### Types of Fine-tuning

#### Instruction Fine-tuning

- Focuses on teaching the model how to follow instructions effectively.

#### Specialized Fine-tuning

- Tailored for specific applications or tasks.
- Example: Developers fine-tuning a model for a specialized application.

### Parameter Efficient Fine-tuning (PEFT)

#### Overview

- Fine-tuning every parameter in a large model can be resource-intensive and impractical.
- PEFT allows for efficient fine-tuning without the need to adjust all parameters.

#### Benefits

- **Memory Efficiency**: Reduces the memory footprint required for fine-tuning.
- **Performance**: Achieves similar performance to full fine-tuning with less computational resources.

#### Techniques

1. **Freezing Original Weights**: Keeps the original model weights unchanged.
2. **Adding Adaptive Layers**: Incorporates additional layers that adapt during training.

#### Low Rank Adaptation (LoRA)

- **LoRA**: Uses low-rank matrices for adaptation, reducing the computational load while maintaining performance.
- **Advantages**: 
  - Minimal compute and memory requirements.
  - Excellent performance results.

### Practical Application

- **Prompting vs. Fine-tuning**: 
  - Prompting may suffice for some applications but can reach performance limits.
  - Fine-tuning, especially with techniques like LoRA, can unlock higher performance levels.
  
- **Cost Considerations**:
  - Full fine-tuning can be cost-prohibitive.
  - PEFT and similar methods make fine-tuning more accessible and cost-effective.

### Summary

This week, we will explore the nuances of instruction tuning and parameter efficient fine-tuning. Understanding these techniques allows developers to optimize LLMs for specific tasks while managing computational and memory constraints effectively.

Let's move on to the next video, where Mike will kick off with instruction fine-tuning.




## Fine-tuning Large Language Models (LLMs) with Instructions

### Overview

In this lesson, we'll explore methods to improve the performance of an existing large language model (LLM) for specific use cases. The focus will be on fine-tuning with instruction prompts and the metrics used to evaluate the performance improvements.

### Introduction to Fine-tuning

- **Fine-tuning**: The process of adapting a pre-trained LLM to specific tasks or domains using a labeled dataset. This process updates the model's weights to improve its ability to perform specific tasks.

### Instruction Fine-tuning

- **Instruction Fine-tuning**: A supervised learning process where the model is trained on a dataset of prompt-completion pairs. These pairs include instructions on how the model should respond to specific prompts.
- **Example**: If the task is sentiment analysis, the instruction might be "classify this review," and the completion would be "sentiment: positive" or "sentiment: negative."

### Process of Instruction Fine-tuning

1. **Prepare Training Data**:
   - Use existing datasets and convert them into instruction prompt datasets using prompt template libraries.
   - Example datasets: Amazon product reviews.
   - Example prompt templates: "predict the associated rating," "generate a star review," "give a short sentence describing the following product review."

2. **Data Splits**:
   - Divide the dataset into training, validation, and test splits.

3. **Training**:
   - Select prompts from the training dataset and pass them to the LLM to generate completions.
   - Compare the LLM completions with the specified responses in the training data.
   - Use cross-entropy loss to calculate the difference between the predicted and actual token distributions.
   - Update the model weights using backpropagation over several epochs to improve performance.

4. **Evaluation**:
   - Measure the model's performance using validation and test datasets.
   - Calculate validation accuracy and test accuracy to assess improvements.

### Metrics for Evaluating Fine-tuned Models

- **Validation Accuracy**: Performance on the validation dataset during training.
- **Test Accuracy**: Final performance evaluation on the holdout test dataset.

### Benefits of Instruction Fine-tuning

- **Task Specialization**: Improves the model's ability to perform specific tasks.
- **Efficiency**: More efficient use of the model's capacity compared to general pre-training.

### Practical Example

1. **Sentiment Analysis**:
   - **Instruction**: "Classify this review."
   - **Desired Completion**: "sentiment: positive" or "sentiment: negative."
   - **Data Preparation**: Use prompt template libraries to format Amazon reviews for sentiment analysis.

2. **Training and Evaluation**:
   - Compare the model's output with the training labels.
   - Use cross-entropy loss to update the model.
   - Evaluate using validation and test accuracy.

### Summary

Fine-tuning with instruction prompts is a common and effective way to adapt LLMs for specific tasks. It involves preparing a dataset of prompt-completion pairs, training the model with these examples, and evaluating its performance using standard metrics like validation and test accuracy.

By understanding and applying instruction fine-tuning, you can significantly improve the performance of large language models for your specific use cases.

## Multi-task Instruction Fine-tuning

### Overview

Multi-task fine-tuning extends the concept of single-task fine-tuning by training a model on a diverse set of tasks simultaneously. This approach enhances the model's ability to generalize and perform well across multiple tasks, helping to avoid catastrophic forgetting.

### Key Concepts

#### Multi-task Fine-tuning

- **Definition**: Training an LLM on a dataset containing examples for multiple tasks (e.g., summarization, review rating, code translation, entity recognition).
- **Benefits**: Improves the model's performance on a variety of tasks, making it more versatile.
- **Drawbacks**: Requires a large amount of data (50-100,000 examples) for effective training.

#### Example Models

- **FLAN (Fine-tuned Language Net)**: A family of models fine-tuned on multiple tasks.
  - **FLAN-T5**: Fine-tuned version of the T5 model, trained on 473 datasets across 146 task categories.
  - **FLAN-PALM**: Fine-tuned version of the PALM model.

### Practical Example: Summarization with FLAN-T5

1. **Dataset Example**: SAMSum
   - **Description**: A dataset with 16,000 messenger-like conversations with summaries created by linguists.
   - **Use Case**: Train language models to summarize dialogue.

2. **Prompt Template**:
   - Instructions: "Briefly summarize that dialogue," "What is a summary of this dialogue?", etc.
   - Purpose: Helps the model generalize and perform better by providing varied ways of asking for a summary.

3. **Application Example**:
   - **Scenario**: Building an app for a customer service team to summarize chat dialogues.
   - **Additional Fine-tuning**: Using the DialogSum dataset, which includes over 13,000 support chat dialogues and summaries.

### Evaluation

- **Pre-Fine-tuning**: The model's initial performance on a new task (e.g., summarizing support chats) may be suboptimal.
- **Post-Fine-tuning**: Fine-tuning with domain-specific data (e.g., DialogSum) improves the model's performance, making the summaries more accurate and relevant.

### Steps for Multi-task Instruction Fine-tuning

1. **Data Preparation**:
   - Use prompt template libraries to convert existing datasets into instruction prompt datasets.
   - Example: Convert Amazon reviews into prompts for classification, text generation, and summarization.

2. **Training Process**:
   - Divide the dataset into training, validation, and test splits.
   - Train the model on the mixed dataset over several epochs, updating weights based on calculated losses.

3. **Evaluation**:
   - Use validation and test datasets to measure performance improvements.
   - Calculate metrics like validation accuracy and test accuracy to quantify the model's improvement.

### Practical Considerations

- **Custom Data**: Fine-tuning with your company's internal data can yield the best results, as it tailors the model to the specific language and requirements of your applications.
- **Evaluation Metrics**: In the next section, you'll learn about metrics and benchmarks to evaluate the quality of the model's completions and compare the fine-tuned version with the original base model.

### Summary

Multi-task instruction fine-tuning allows an LLM to learn and perform multiple tasks simultaneously, making it a versatile and powerful tool. Although it requires substantial data, the resulting models, like FLAN-T5, demonstrate strong performance across a wide range of tasks. Fine-tuning with domain-specific datasets further enhances the model's capabilities for particular applications.

By understanding and applying multi-task instruction fine-tuning, you can develop robust LLMs that are well-suited for diverse and complex tasks in various domains.


[This paper](https://arxiv.org/abs/2210.11416) introduces FLAN (Fine-tuned LAnguage Net), an instruction finetuning method, and presents the results of its application. The study demonstrates that by fine-tuning the 540B PaLM model on 1836 tasks while incorporating Chain-of-Thought Reasoning data, FLAN achieves improvements in generalization, human usability, and zero-shot reasoning over the base model. The paper also provides detailed information on how each these aspects was evaluated.

![MODEL 相](https://d3c33hcgiwev3.cloudfront.net/imageAssetProxy.v1/mu9BmR3dSRuEBq2t64mL0A_f9f43fc146bb42779a56c467bd929df1_image.png?expiry=1722124800000&hmac=zWux7a2lyaF6RiAGBz5mIF3525m07fOw2HbqA91dG90) 

Here is the image from the lecture slides that illustrates the fine-tuning tasks and datasets employed in training FLAN. The task selection expands on previous works by incorporating dialogue and program synthesis tasks from Muffin and integrating them with new Chain of Thought Reasoning tasks. It also includes subsets of other task collections, such as T0 and Natural Instructions v2. Some tasks were held-out during training, and they were later used to evaluate the model's performance on unseen tasks.


## Model Evaluation

### Importance of Benchmarks

While metrics like ROUGE and BLEU provide useful insights into specific aspects of LLM performance, they are not sufficient for a comprehensive evaluation. To measure and compare LLMs more holistically, researchers use benchmarks that evaluate a model's capabilities across various tasks and scenarios. 

### Key Benchmarks for LLMs

1. **GLUE (General Language Understanding Evaluation)**
   - **Introduced**: 2018
   - **Purpose**: Encourage the development of models that can generalize across multiple natural language understanding tasks.
   - **Tasks**: Includes sentiment analysis, question-answering, and other natural language tasks.
   - **Usage**: Measure and compare model performance across different tasks.
   - **Leaderboards**: Allow comparison of different models' performance.

2. **SuperGLUE**
   - **Introduced**: 2019
   - **Purpose**: Address limitations of GLUE with more challenging tasks.
   - **Tasks**: Includes multi-sentence reasoning, reading comprehension, and other advanced language understanding tasks.
   - **Leaderboards**: Provide a resource for tracking the progress of LLMs.

3. **MMLU (Massive Multitask Language Understanding)**
   - **Purpose**: Evaluate models on extensive world knowledge and problem-solving abilities.
   - **Tasks**: Includes elementary mathematics, US history, computer science, law, and more.
   - **Design**: Tailored for modern LLMs, pushing them beyond basic language understanding.

4. **BIG-bench**
   - **Purpose**: Test LLMs on a wide range of tasks.
   - **Tasks**: Covers linguistics, childhood development, math, common sense reasoning, biology, physics, social bias, software development, and more.
   - **Sizes**: Comes in three different sizes to keep costs achievable.

5. **HELM (Holistic Evaluation of Language Models)**
   - **Purpose**: Improve transparency and provide guidance on model performance for specific tasks.
   - **Approach**: Uses a multimetric approach, measuring seven metrics across 16 core scenarios.
   - **Metrics**: Includes fairness, bias, and toxicity, in addition to traditional accuracy measures.
   - **Evolution**: Continuously updated with new scenarios, metrics, and models.

### Selecting the Right Evaluation Dataset

Selecting the appropriate evaluation dataset is crucial for accurately assessing an LLM's performance. Datasets should:
- Isolate specific model skills, such as reasoning or common sense knowledge.
- Focus on potential risks, like disinformation or copyright infringement.
- Ensure that the model has not seen the evaluation data during training for accurate performance assessment.

### Practical Application

When evaluating your model, consider the following steps:
1. **Choose a Benchmark**: Select a benchmark that aligns with the specific skills or tasks relevant to your model.
2. **Use Multiple Metrics**: Employ a variety of metrics to get a comprehensive evaluation of your model's performance.
3. **Review Leaderboards**: Compare your model's performance with other models using benchmark leaderboards.

### Conclusion

Evaluating LLMs requires a multifaceted approach that goes beyond simple metrics like ROUGE and BLEU. By using comprehensive benchmarks such as GLUE, SuperGLUE, MMLU, BIG-bench, and HELM, you can obtain a holistic view of your model's capabilities and performance. These benchmarks provide valuable insights into areas where your model excels and where it may need further improvement.

For more detailed information, you can refer to the official papers and resources related to each benchmark, such as the GLUE and SuperGLUE leaderboards, and the HELM results page.


