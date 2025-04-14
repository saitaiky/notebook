---
title: Introduction
sidebar_position: 1
---

There are 2 tasks: Text summarization and text translation

## Introduction to Language Models

Language models, including tools like ChatGPT, are becoming ubiquitous in today's digital landscape. Understanding the mechanisms of Large Language Models (LLMs) is crucial for navigating and leveraging these technologies effectively.

### What is a Corpus?

A corpus is a collection of texts that a language model is trained on. It determines the model's vocabulary and the words it can generate. For example, if a model named “T&C” was trained on terms and conditions agreements, it will only understand and generate words found in such documents. If you input a word that the model has never encountered during its training, it won't be able to predict or generate related content.

### Applications of Language Models

Language models are integral to various technologies that many people interact with daily. These include customer service chatbots, predictive text on phones, and virtual personal assistants like Siri or Alexa. Each of these applications uses a language model to process and generate human language. They work by turning language into numbers (using probabilities) and then back into language.

### Predictive Text and Probabilities

A common application of language models is predictive text, which is used in modern email programs and messaging apps. These systems predict the next word in a sentence by calculating the probability of various possible words following a given sequence of words. This process is based on the data (corpus) they were trained on.


## The simplest language models (N-gram)

One of the simplest types of language models is the N-gram model. This model predicts the next word in a sequence based on the previous 'N-1' words. For example, in a bigram model (where N=2), the model looks at the previous word to predict the next one.

:::info What is unigram?
A unigram in the context of Large Language Models (LLMs) is a single word treated as the smallest unit for analysis. Unigrams are used in evaluating and processing text, where each word is considered independently of its neighbors. This helps in calculating simple metrics like word frequency or in tasks like ROUGE-1 scoring, which measures the overlap of single words between generated and reference texts.
:::

### Introduction to N-gram Models

<iframe width="560" height="315" src="https://www.youtube.com/embed/E_mN90TYnlg?si=M8qrz_hjZAG3VVIv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

N-gram models are a foundational concept in understanding how language models predict the next word in a sequence. These models assign probabilities to possible next words based on the preceding words in the sequence.

### Bigram and Trigram Models

A bigram model predicts the next word based on the immediately preceding word. For example, if you're writing an email that starts with "Thanks for the update...", the model might predict the next word to be "on" or "about" rather than something nonsensical like "truck." When prompted with a word, the bigram model uses the last word as context to predict the next word. This is based on the Markov assumption, which states that the probability of a future word depends only on the current word. 

A trigram model, on the other hand, uses two preceding words as context to predict the next word. This often results in more coherent predictions than a bigram model because it has more context to base its predictions on. When prompted with a two-word sequence, the trigram model uses those two words to predict the next word, resulting in more context-aware predictions.

### Higher-order N-gram Models and Context Window Size

N-gram models can use any number of preceding words (n-1) to predict the next word. For example, an 8-gram model uses seven preceding words as context. Using a very large n can lead to more accurate predictions but also requires more specific context that exactly matches sequences in the training corpus. This makes the model both powerful and limited, as it can produce very context-specific predictions but might struggle with less frequent sequences. The size of the context window (the n in n-gram) depends on the task. Text autocorrect requires a smaller context window since it only needs to correct a word based on immediate context, whereas plagiarism detection requires a larger context window to determine if a sequence of words matches a source text.

### Generating Probabilities in N-gram Models

The probabilities in N-gram models are generated based on the frequency of word sequences in the corpus. For example, if "Thanks for the update" is frequently followed by "on" or "about" in the training corpus, those words will have higher probabilities as the next word.


## Calculating Word Probabilities and Limitations of N-gram Models

### Understanding Word Probabilities

N-gram models predict the next word based on the probability derived from word counts in a given corpus. Let's take "Mastering the Art of French Cooking" as an example. The first step in creating an n-gram model is to count the frequency of each word in the corpus. Common words like "the" often appear most frequently. A unigram model would predict "the" most often because it appears most frequently in the text. For a bigram model, we need to consider pairs of words.

For instance, in the sentence "The cat is on the mat," the bigrams are "The cat," "cat is," "is on," "on the," and "the mat." This helps in understanding and generating text by considering the immediate word context but lacks the broader context that more advanced models like transformers use.

### Limitations of N-gram Models

N-gram models are effective for predicting the next word based on immediate context but have significant limitations. They can't link words or concepts separated by many words, and they don't understand who is performing an action or when something will happen. 

For example, in the sentence "She baked a cake, and it was delicious,"  a bigram model would struggle to connect “it” to prior information, identify who is making the cake, or identify when the cake will be made. A bigram model would consider word pairs like "She baked," "baked a," "a cake," and "cake, and." However, this model would struggle to link "it" back to "cake" or understand who "she" refers to. 

Due to these limitations, n-gram models have been largely replaced by more complex models, such as neural networks, for many tasks. However, counting words and understanding their probabilities remain fundamental to all language models.


## Creativity and Temperature in Large Language Models

### Understanding LLMs' Creativity

Large language models, such as the Pythia 12B model, can produce novel and unexpected text sequences despite being built from finite training data. This ability makes them appear creative and human-like in generating content. Consider the haiku: "Late nights fueled by code, / A technical ballet unfolds, / Heart and work in one ode." This could be generated by a human or a language model, demonstrating the model's capability to create coherent and creative content.

### How LLMs Generate Text and Adjusting Probability with Temperature

LLMs generate text based on probabilities and mathematical calculations rather than magic. They predict the next word in a sequence by storing probabilities for all possible following words. Temperature is a setting that adjusts the randomness of an LLM's output. A high temperature (e.g., 2) produces more random and diverse outputs where all words have nearly equal likelihood, while a low temperature (e.g., 0) produces deterministic outputs where the most likely word is always chosen, eliminating randomness. 

For example, with a high temperature setting, the prompt "My new AI-powered app will..." might produce varied and creative but incoherent responses like "sing clouds and laugh." With a low temperature setting, the prompt yields predictable and identical responses each time, such as "improve productivity."

### Optimizing Temperature for Different Tasks

The appropriate temperature setting depends on the task at hand. Low temperature is ideal for tasks requiring predictability and reliability, such as writing cover letters. Medium temperature balances predictability and creativity, making it suitable for tasks like poetry or creative writing. High temperature is suitable for highly creative tasks where novelty is more important than coherence, but can lead to nonsensical outputs.


## Training Large Language Models (LLMs)

### Epochs and Loss

Training a large language model involves exposing it to a large corpus of text multiple times. Each complete pass through the training data is called an **epoch**. For example, an LLM exposed to 800 GB of English text for one epoch might still generate random and incoherent outputs. Initially, the predictions made by the model are random because the neural network has not yet learned any meaningful patterns. During each epoch, the model compares its predictions to the original data. The difference between the predicted and actual values is called the **loss**. The goal of training is to reduce this loss over time.

### Reducing Loss Over Epochs and Overfitting

As the model is exposed to more data and adjusts its predictions, the loss decreases, indicating that the model is learning and improving. For example, after 1,000 epochs, the output might be more coherent but still not perfect. After 120,000 epochs, the model's output becomes more fluent and relevant. 

However, training a model until the loss is zero can lead to overfitting, where the model replicates the training data exactly and cannot generate novel text or adapt to new data. Overfitting occurs when a model is too closely fitted to the training data. This state can be avoided by stopping training when the model performs well without overfitting, monitoring training closely, and balancing the number of epochs to avoid overfitting while ensuring the model learns adequately.


## Preprocessing and Tokenization of Text

### Preprocessing

Preprocessing is the initial step in preparing raw text for training a language model. It involves cleaning and standardizing the text to ensure consistency and readability by the model. This process typically includes removing typos, abbreviations, inconsistent capitalization, and excess punctuation. For instance, when training a bigram model on the Terms and Conditions (T&C) of Big Tech companies, an original sentence like "We’ve updated our Terms of Use, Data Policy, and Cookies Policy to reflect the new name." might be preprocessed to "we have updated our terms of use data policy and cookies policy to reflect the new name."

**Key Improvements**:

1. **Standardized Abbreviations:** "We’ve" is expanded to "we have" for clarity.
2. **Typo and Abbreviation Handling:** Demonstrates typical preprocessing steps more clearly.
3. **Consistent Language:** Uses "we have" instead of "we've" to better show preprocessing standardization.

### Capitalization and Punctuation

Capitalization affects the vocabulary size of the model. By making all letters lowercase, we reduce the vocabulary size, which means the model will see more examples of each word, making predictions more reliable. While removing capitalization can simplify the dataset, it's sometimes necessary to retain it, especially in contexts where capitalization holds significance, such as identifying spam emails. Punctuation provides valuable information about sentence structure and meaning. Different strategies can be applied to handle punctuation during preprocessing. Using special characters like

 `<s>` and `</s>` to mark the start and end of sentences can help retain the information without ambiguity. For example, "Ms. Zhang is here." might be preprocessed with special characters as "`<s> ms zhang is here </s>`"

### Tokenization

Tokenization is the process of breaking down text into smaller units called tokens, making it easier for the model to train on. The initial step often involves splitting the text by spaces (whitespace tokenization). For example, the sentence "my ai did my homework." becomes tokens ["my", "ai", "did", "my", "homework", "."].

### Advanced Tokenization: Stems and Affixes

To capture more linguistic information, text can be further broken down into stems (roots of words) and affixes (prefixes and suffixes). For example, in the sentence "I tested the model," the tokens might be ["I", "test", "ed", "the", "model", "."] where "test" is the stem of "tested" and "ed" is an affix indicating past tense.

### Byte-Pair Encoding (BPE)

<iframe width="560" height="315" src="https://www.youtube.com/embed/HEikzVL-lZU?si=iF5JCtT2I74srZGr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

An alternative and more generalizable approach to tokenization is Byte-Pair Encoding (BPE), which builds tokens from characters based on their frequency in the corpus. The steps in BPE include identifying the most common characters in the corpus, finding the most common letter pairs, and updating the vocabulary until the desired vocabulary size or iteration count is reached. Stopping criteria for BPE can include specifying the vocabulary size or setting a fixed number of iterations. Tokenization is crucial for creating a manageable and effective vocabulary for training large language models. Large models are typically trained on hundreds of billions of tokens, making robust and efficient tokenization essential.

## Summary

Language models, particularly large ones like LLMs, are central to many AI applications we interact with daily. From understanding the basics of what a corpus is and how language models like N-grams predict text based on probabilities derived from word sequences, to exploring the creativity of LLMs and how their output can be controlled with settings like temperature, we see the varied and complex functionalities of these models. Training these models involves numerous epochs, with the goal of reducing loss and avoiding overfitting to ensure the model can generate coherent and novel text. Preprocessing and tokenization are critical steps in preparing the text corpus for training, ensuring that the data is clean and structured for the model to effectively learn from. Understanding these processes provides a solid foundation for delving deeper into the capabilities and applications of large language models.