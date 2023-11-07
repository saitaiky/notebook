---
title: Large Language Models
---

## Introduction to LLMs

Large Language Models (LLMs) are deep learning algorithms capable of processing and generating text that resembles natural language. They are a subset of language models, distinguished by their size, which is attributed to their extensive training data and a vast number of learnable parameters. Larger LLMs tend to produce more accurate and sophisticated responses.

However, the quality of data used for training LLMs is crucial. Models trained on peer-reviewed content, such as research papers and novels, typically outperform those trained on unreviewed data like social media posts. LLMs require diverse data to perform various natural language processing (NLP) tasks. Fine-tuning allows a foundation language model to specialize in specific domains.

### Foundation Language Models vs. Fine-Tuned Language Models

Foundation language models, like MT-NLG and GPT-3, are versatile and perform a wide range of NLP tasks. They excel in general performance but may not be ideal for specific tasks. Fine-tuned language models, derived from foundation LLMs, are customized for specialized purposes and offer improved task-specific performance. Fine-tuning is commonly achieved through parameter-efficient techniques like p-tuning and adapters, making it a cost-effective and practical approach.

## Evolution of Large Language Models

The evolution of large language models (LLMs) has brought about a paradigm shift in natural language processing (NLP). Historically, AI systems focused on data analysis rather than generation, but the advent of LLMs shifted this balance. This change can be observed by comparing three NLP regimes:

- **Pre-transformers NLP**: This era relied on rule-based models and simple neural networks like RNNs and LSTMs. While suitable for basic tasks, they struggled with complex and novel data.
- **Transformers NLP**: Transformers, introduced in 2017, improved NLP by better generalization, enhanced context understanding, and more efficient data processing. However, limitations in data and resources hindered their capabilities.
- **LLM NLP**: OpenAI's GPT-3 in 2020 marked the LLM era. These models, trained on extensive data, produced highly accurate NLP responses, democratizing NLP for non-technical users.

The transition was driven by technological advancements like neural networks, **attention mechanisms**, and transformers, along with unsupervised and self-supervised learning. These concepts are fundamental in comprehending the workings of LLMs and building new ones.

### Neural Networks

![simple_neural_network_vs_deep_learning](/img/ai/news/simple_neural_network_vs_deep_learning.webp)

Source: [What Deep Learning Is And Isn’t](https://thedatascientist.com/what-deep-learning-is-and-isnt/)

Large language models (LLMs) initially used simpler neural network (NN) architectures, particularly recurrent neural networks (RNNs) and long short-term memory networks (LSTMs). RNNs and LSTMs excelled at considering context, position, and word relationships in data, making them effective for sentiment analysis and text classification. These neural networks possessed the remarkable ability to learn autonomously, generating their rules from data rather than relying on predefined rules, a concept known as representation learning.

The biggest advantage that neural networks like RNNs and LSTMs had over traditional, rule-based
systems was that they were capable of learning on their own with little to no human involvement.
They analyze data to create their own rules, rather than learn the rules first and apply them to data
later. This is also known as representation learning and is inspired by human learning processes.

:::infoHow it works
Representations, or features, are hidden patterns that neural networks can extract from data. To
exemplify this, let’s imagine we’re training an NN-based model on a dataset containing the following
tokens:
```
“cat,” “cats,” dog,” “dogs”
```
After analyzing these tokens, the model may identify a representation that one could formulate as:
```
Plural nouns have the suffix “-s.”
```

The model will then extract this representation and apply it to new or edge-case scenarios whose data
distribution follows that of training data. For example, the assumption can be made that the model
will correctly classify tokens like “chairs” or “table” as plural or singular even if it had not encountered
them before. Once it encounters irregular nouns that don’t follow the extracted representation, the
model will update its parameters to reflect new representations, such as:

```
Plural nouns are followed by plural verbs.
```

This approach enables NN-based models to generalize better than rule-based systems and
successfully perform a wider range of tasks.
:::

The capacity to extract representations depends on the neural network's size, with more neurons and layers enabling more complex representations. However, deep neural networks became practical only after hardware improvements, notably the introduction of GPUs in 1999. These GPUs facilitated parallel processing and powered deep learning, leading to transformative NNs like transformers.

### Transformers

RNNs and LSTMs are advantageous for natural language processing (NLP) tasks, such as sentiment analysis and text classification, as they consider word context and relationships. However, they are limited when handling longer data sequences and broader context. Their sequential processing results in slower inference, which poses challenges when processing lengthy text. They can always determine word order due to sequential processing, ensuring accurate output.

The introduction of transformers in 2017 revolutionized NLP. Transformers employ **attention mechanisms**, rendering RNNs and convolutions unnecessary for sequential data. These mechanisms allow models to selectively focus on specific tokens, enhancing context understanding. Transformers process data in parallel, significantly accelerating NLP tasks.

:::infoHow Attention mechanism works
To demonstrate this, let’s imagine the desired model is a transformer-based model to predict the next
words for the following input sentence:

```
Mary had a little lamb.
```

Attention mechanisms – or, rather, self-attention layers that are based on attention mechanisms –
would first calculate attention weights for each word in our input. Attention weights represent the
importance of each token, so the more weight a token is assigned, the more important it's deemed.
For example, the attention mechanism might give more weight to the word "lamb" than the word "a,"
as it’s likely to have more influence on the final output.
The model would then use these weights to dynamically emphasize or downplay each word as it
generates output. If one assumes that the most weight was assigned to the word “lamb,” the model
may produce a continuation such as:

```
"whose fleece was white as snow"
```

To determine how important each token is, self-attention layers examine its relationships with other
tokens in a sequence:

1. If a token has many relevant relationships with other tokens with respect to the task being
performed, then that token is deemed as important and, potentially, more important than other
tokens in the same sequence.
2. If a token doesn’t have many relationships with other tokens, or if they are irrelevant to a specific
task, that token is considered less important or completely unimportant. This means the model
will virtually ignore it when generating the output.
:::

Yet, transformers face a challenge due to non-sequential data processing. Changes in word order can distort meaning or lead to nonsensical variations. Transformers use positional encodings to overcome this issue, retaining position information. 

## Transformer Language models

![transformer-architecture](/img/ai/news/transformer-architecture.png)

Source: [attention is all you need](https://arxiv.org/abs/1706.03762)

### BERT

Google's BERT (Bidirectional Encoder Representations from Transformers) is a pioneering transformer-based language model. It's bidirectional and more accurate than unidirectional models, as it considers both sides of masked tokens.

To illustrate this, let’s imagine that a model is given the following input sentence:

```
"I [have] a mask."
```

BERT’s task is to predict the masked word “have.” It does so by analyzing the tokens on both of its
sides, namely "I,", "a," and “mask.” This is what makes it bidirectional, as well as more accurate than
previous language models that could only consider the context on the left of the masked token. In this
case, unidirectional models would only consider the word “I” when predicting the masked word,
which provides little context. The chances of a unidirectional model generating the right predictions
are smaller.

BERT was the first model to show how bidirectionality can model performance NLP tasks. It benefited various applications, including Google's search engine's enhanced query understanding. It demonstrated the potential of transformer-based models for NLP tasks, marking a significant shift in the field.

### Others

1.  **GPT-3** (Generative Pre-trained Transformer 3): GPT-3, developed by OpenAI, is one of the most famous large language models. It's known for its impressive text generation capabilities and can be fine-tuned for various NLP tasks.

2.  **RoBERTa** (A Robustly Optimized BERT Pretraining Approach): RoBERTa is a variant of BERT developed by Facebook AI. It optimizes pretraining tasks and data to improve performance on a wide range of NLP benchmarks.

3. **ALBERT** (A Lite BERT): ALBERT, by Google Research and Toyota Technological Institute at Chicago, focuses on model efficiency and reducing the number of parameters while maintaining performance.

These large language models have played a significant role in advancing natural language processing tasks, making them more accurate, context-aware, and versatile across a wide range of applications.

### Unsupervised and Self-Supervised Learning

Unsupervised and self-supervised learning have been pivotal in the development of advanced natural language models like BERT. *BERT's significance lies not only in its bidirectional nature but also in its unsupervised learning approach*, which involves pattern recognition from unlabeled data, making it a pure form of AI. Both unsupervised and self-supervised learning models benefit from feedback loops, although self-supervised learning relies on supervisory signals generated automatically from data, eliminating the need for human annotation. This minimizes data labeling and human feedback, making model training more efficient.

**Benefits of GPT Vs Bert**

- How the model works
    - GPT, a generative model, excels at generating coherent sentences from scratch, making it suitable for language generation tasks such as text completion, summarization, and question answering. 
    - On the other hand, BERT is a discriminative model that classifies sentences or tokens into categories like sentiment analysis, named entity recognition, and text classification. It considers both left and right contexts for word meaning, making it effective for tasks like sentiment analysis and question answering.
- Architecturally, GPT uses a unidirectional transformer, considering only the left context when predicting, while BERT employs a bidirectional transformer, accounting for both left and right contexts. Both GPT and BERT are influential models in NLP, with their choice depending on the specific task at hand. Often, a combination of both models is used to achieve optimal results in NLP applications.

## How Enterprises Can Benefit From Using Large Language Models

### Challenges of LLMs

Enterprises venturing into the use of large language models (LLMs) should be cautious of several common pitfalls, which apply irrespective of whether they customize, fine-tune, or build LLMs from the ground up. These include:

- **Vulnerability to Adversarial Examples**: LLMs can be tricked by specially crafted inputs, posing security concerns, especially in sensitive industries like healthcare or finance.
- Lack of Interpretability: Some LLMs may lack interpretability, making it challenging to understand their decision-making processes. This can be problematic in high-stakes scenarios and industries requiring transparency.
- **Generic Responses**: LLMs may provide generic, uncustomized answers, sometimes reproducing trained text data. This raises ethical and legal issues, necessitating techniques like Reinforcement Learning from Human Feedback for improvement.
- **Ethical Considerations**: The ethical use of LLMs in decision-making tasks, like candidate selection, without human supervision, should be questioned. Furthermore, their use for tasks typically performed by human white-collar workers requires assessment.
- **Generation of Inappropriate Content**: LLMs, often trained on extensive Internet texts, may produce toxic, biased, and inappropriate content. Enterprises should be cautious of this potential issue.

Building proprietary LLMs from scratch introduces additional challenges, including the need for sufficient computing resources, datasets, expertise, and financial backing for development, implementation, and maintenance.

### Ways of building LLMs

Building large language models from scratch is often impractical, especially for enterprises not specialized in AI or NLP. Customizing existing base models is a more viable approach. This process involves three main steps:

1. **Selecting a Foundation Model (PLM)**: Choosing an appropriate base model involves considering factors like model size, training tasks, datasets, and LLM providers.
2. **Fine-Tuning**: Base models can be fine-tuned for specific use cases, such as sentiment analysis or legal terminology, by training them on relevant data.
3. **Optimization**: Further enhancements can be achieved through techniques like Reinforcement Learning from Human Feedback (RLHF), which fine-tunes the model based on human feedback.

Alternatively, parameter-efficient methods like adapters and p-tuning can be used to customize base models. Customization is particularly effective when the base model aligns with the selected downstream tasks, leveraging the knowledge gained during training for improved performance.

### How to Evaluate LLMs

LLMs employ deep learning techniques to process and generate natural language, making them versatile for tasks like language translation, text summarization, and question-answering. Evaluating LLM performance involves considering several key factors:

1. **Training Data**: The quality and diversity of the training data are vital. It should represent the target language and domain to allow effective pattern learning and generalization. Annotation with relevant labels is often required for supervised learning, a common approach in LLMs.
2. **Model Size**: Larger models generally perform better, but they demand more computational resources. Researchers must strike a balance between model size and performance, tailored to the specific task and available resources. Larger models may also be more susceptible to overfitting.
3. **Inference Speed**: Real-world LLM applications require efficient inference processing. Faster inference times enhance data processing capabilities. Techniques like pruning, quantization, and distillation help reduce model size and improve inference speed.

To assess LLM performance, researchers often rely on standardized benchmarks, which provide datasets and evaluation metrics for specific language-related tasks. These benchmarks, such as GLUE, SuperGLUE, and CoQA, facilitate fair comparisons between different LLM models and methods, highlighting their strengths and weaknesses.

## Example applications

- **Content generation** - Marketing content and copy, paraphrasing, email composition
- **Summarization** - Legal summarization, news summarization
- **Translation** - Language translation, code translation
- **Classification** - Toxicity classification, sentiment analysis, fraud analytics
- **Chatbot support** - EQA and ODQA chatbots, AI companions
- **Tools and technologies** - Character generation

It’s worth noting that large language models can be applied to other content categories besides text.
They’re currently widely used for speech-, image-, and video-related tasks, such as image generation
or video classification. 

> Future reading: 
    - [How LLMs are Unlocking New Opportunities for Enterprises](https://resources.nvidia.com/en-us-large-language-model-ebooks/llm-ebook-part2)
    - [An Overview of Attention Is All You Need](https://dantegates.github.io/2018/07/06/an-overview-of-attention-is-all-you-need.html)