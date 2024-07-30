---
title: Parameter efficient fine-tuning
sidebar_position: 2
draft: true
---

## Parameter Efficient Fine-tuning (PEFT)

### Overview

Training Large Language Models (LLMs) is computationally intensive and memory-demanding. Full fine-tuning requires substantial resources to store model weights, optimizer states, gradients, forward activations, and temporary memory. In contrast, Parameter Efficient Fine-tuning (PEFT) methods significantly reduce the memory requirements by only updating a small subset of parameters or adding new, lightweight components.

### Full Fine-tuning vs. PEFT

#### Full Fine-tuning

- **Memory Intensive**: Requires updating all model weights and storing large amounts of additional data.
- **Resource Requirements**: Needs extensive computational resources, often impractical for consumer hardware.
- **Output**: Produces a new version of the model for each task, leading to high storage demands if fine-tuning for multiple tasks.

#### Parameter Efficient Fine-tuning (PEFT)

- **Selective Updates**: Only a subset of the model's parameters are updated.
- **Additive Components**: New parameters or layers are added, and only these new components are fine-tuned.
- **Memory Efficiency**: Drastically reduces the number of trained parameters, often to 15-20% of the original model, making it feasible to train on a single GPU.
- **Reduced Catastrophic Forgetting**: By keeping most of the original weights frozen, PEFT is less prone to forgetting previously learned tasks.

### Methods of PEFT

1. **Selective Methods**: Fine-tune only specific components, layers, or parameter types of the original model.
   - **Performance**: Mixed results with trade-offs between parameter efficiency and compute efficiency.
   - **Focus**: Not covered in detail in this course due to varied effectiveness.

2. **Reparameterization Methods**: Create low-rank transformations of the original network weights to reduce the number of parameters to train.
   - **Example**: Low-Rank Adaptation (LoRA).
   - **Benefits**: Maintains model quality with reduced memory requirements.

3. **Additive Methods**: Keep original weights frozen and introduce new trainable components.
   - **Adapter Methods**: Add new layers to the model architecture, typically inside encoder or decoder components.
   - **Soft Prompt Methods**: Manipulate the input by adding trainable parameters to the prompt embeddings or retraining embedding weights.

### Example: Low-Rank Adaptation (LoRA)

- **Description**: LoRA adds low-rank matrices to the original model weights and fine-tunes these new components.
- **Benefits**: Reduces memory requirements while maintaining high performance.
- **Next Steps**: The next video in the course will cover LoRA in detail.

### Practical Applications

- **Task-specific Fine-tuning**: PEFT allows for efficient adaptation of the original LLM to multiple tasks by training only a small number of parameters.
- **Swappable Components**: The PEFT weights can be easily swapped in for inference, making it flexible and cost-effective for various applications.

### Summary

PEFT methods offer a practical solution to the challenges of full fine-tuning by reducing the number of parameters that need to be updated. This approach makes it feasible to fine-tune large models on limited hardware, prevents catastrophic forgetting, and allows for efficient adaptation to multiple tasks.

By understanding and applying PEFT techniques like LoRA, adapter methods, and soft prompt methods, developers can optimize the performance of LLMs while managing computational and memory constraints effectively.

## Parameter Efficient Fine-tuning Technique 1: LoRA

### Introduction to LoRA

Low-rank Adaptation (LoRA) is a parameter-efficient fine-tuning technique that belongs to the re-parameterization category. It focuses on reducing the number of parameters that need to be trained during fine-tuning, making the process more efficient and less resource-intensive.

### How LoRA Works

#### Transformer Architecture
In the transformer architecture, input prompts are converted into tokens, which are then transformed into embedding vectors. These vectors pass through self-attention and feedforward neural networks, where the weights are learned during pre-training.

#### LoRA Mechanism
- **Freezing Original Weights**: LoRA freezes all original model parameters.
- **Injecting Rank Decomposition Matrices**: It introduces a pair of smaller matrices (rank decomposition matrices) alongside the original weights. These matrices are designed so that their product matches the dimensions of the original weights.
- **Training**: Only these smaller matrices are trained using supervised learning, significantly reducing the number of parameters.

### Practical Example

In the transformer architecture:
- Original weight matrix dimensions: 512 by 64 (32,768 trainable parameters).
- LoRA approach with rank 8:
  - Matrix A dimensions: 8 by 64 (512 parameters).
  - Matrix B dimensions: 512 by 8 (4,096 parameters).
  - Total parameters: 4,608 (an 86% reduction).

### Advantages of LoRA

- **Reduced Memory Requirements**: Can be performed on a single GPU, avoiding the need for distributed clusters.
- **Efficiency**: Allows training for multiple tasks by swapping out small matrices for each task without modifying the original large model weights.
- **Prevents Catastrophic Forgetting**: Since the original model weights remain mostly unchanged.

### Performance Comparison

Using the ROUGE metric for dialogue summarization with the FLAN-T5 model:
- **Base Model ROUGE-1 Score**: Fairly low.
- **Full Fine-tuning ROUGE-1 Score**: Improved by 0.19.
- **LoRA Fine-tuning ROUGE-1 Score**: Improved by 0.17, slightly lower than full fine-tuning but with significantly fewer parameters trained and reduced compute resources.

### Choosing the Rank of LoRA Matrices

- **Research Findings**: A plateau in performance improvement for ranks greater than 16.
- **Optimal Range**: Ranks between 4-32 offer a good trade-off between reducing trainable parameters and maintaining performance.
- **Ongoing Research**: Optimizing the rank choice is still an active area of study.

### Conclusion

LoRA is a powerful fine-tuning method that achieves high performance with significantly reduced computational resources. It is not only useful for training LLMs but also applicable to models in other domains. By understanding and applying LoRA, developers can efficiently fine-tune large models on limited hardware, making sophisticated AI accessible and practical for various applications.

Next, the course will explore another parameter-efficient technique called prompt tuning, which focuses on training the input text rather than modifying the LLM itself.

## PEFT Techniques 2: Soft Prompts

### Introduction to Prompt Tuning

Prompt tuning is a parameter-efficient fine-tuning method within the realm of Parameter Efficient Fine Tuning (PEFT). Unlike other techniques that modify the model weights, prompt tuning leaves the weights unchanged and instead introduces trainable tokens, known as soft prompts, to optimize performance.

### Difference Between Prompt Tuning and Prompt Engineering

- **Prompt Engineering**: Involves manually crafting the language of prompts to achieve better model completions. This can include trying different words, phrases, or providing examples for one-shot or few-shot inference.
- **Prompt Tuning**: Adds additional trainable tokens to the prompt, which are optimized through supervised learning to improve model performance without manually tweaking the prompt language.

### How Prompt Tuning Works

1. **Soft Prompts**: These are additional trainable tokens prepended to the embedding vectors representing the input text.
   - Length: Typically between 20 to 100 virtual tokens.
   - Nature: Soft prompts are not fixed discrete words but can take any value within the continuous multidimensional embedding space.
2. **Training**: During training, the soft prompt vectors are updated to optimize the model's response to the prompt, while the underlying model weights remain frozen.
3. **Inference**: For inference, the trained soft prompts are prepended to the input prompt, guiding the model to perform the specific task.

### Advantages of Prompt Tuning

- **Parameter Efficiency**: Only a small number of parameters (soft prompts) are trained, making it computationally efficient.
- **Flexibility**: Different sets of soft prompts can be trained for different tasks and swapped out as needed, using the same base model for multiple tasks.
- **Storage Efficiency**: Soft prompts require minimal storage space, enabling efficient task switching without the need for multiple large models.

### Performance Comparison

In the paper "Exploring the Method" by Brian Lester and collaborators at Google, prompt tuning was compared to other methods:

- **Full Fine-tuning**: Performed best on smaller models but is resource-intensive.
- **Prompt Tuning**: Comparable to full fine-tuning for larger models (around 10 billion parameters) and significantly better than prompt engineering alone.
- **Prompt Engineering**: Less effective than both full fine-tuning and prompt tuning, especially for larger models.

### Interpretability of Soft Prompts

- Soft prompts can take any value within the embedding space and do not correspond to known tokens or words.
- Analysis shows that the nearest neighbor tokens to the soft prompts form tight semantic clusters, indicating that they learn word-like representations related to the task.

### Practical Applications

- **Task-specific Fine-tuning**: Train soft prompts for different tasks and swap them as needed.
- **Combining Techniques**: LoRA can be combined with quantization techniques (QLoRA) to further reduce memory footprint and compute requirements.

### Conclusion

Prompt tuning is a powerful and efficient fine-tuning method that leverages trainable tokens to optimize model performance for specific tasks. It provides a flexible and resource-efficient alternative to full fine-tuning, particularly beneficial for large models and diverse applications.

By understanding and applying both LoRA and prompt tuning, developers can efficiently fine-tune models while managing computational and memory constraints effectively, optimizing performance for a wide range of natural language tasks.

### Further Reading
- [Exploring the Method Paper by Brian Lester](https://arxiv.org/abs/2104.08691)
- [Google Research on Prompt Tuning](https://ai.googleblog.com/2021/04/parsimonious-prompts-better-few-shot.html)
- [Hugging Face Documentation on PEFT](https://huggingface.co/docs/transformers/main/en/main_classes/model#transformers.PEFT)