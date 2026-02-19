---
title: "RNNs, LSTMs, Attention, Word2Vec, GANs & Modern Text-to-Image"
description: "Learn the core building blocks of deep learning, from RNNs/LSTMs and word embeddings to attention-based Seq2Seq models, autoencoders, GANs/DCGANs, and how today’s text-to-image systems connect language and pixels."
keywords: [deep learning foundations, neural networks, gradient descent, training neural networks, convolutional neural networks, CNN, dog breed classifier, transfer learning, weight initialization, autoencoders, sequence models, recurrent neural network, RNN, LSTM, vanishing gradient problem, word embeddings, Word2Vec, CBOW, skip-gram, sequence-to-sequence, Seq2Seq, encoder-decoder, attention mechanism, bidirectional RNN, generative models, generative adversarial networks, GAN, minimax loss, DCGAN, deep convolutional GAN, semi-supervised learning, CLIP, text-to-image, diffusion models, reinforcement learning, Markov decision processes, MDP, Q-learning, policy gradients, actor-critic]
---

:::warning As of July 2024
It might take me a bit to get everything written down, but I'll carve out some time for this section (there's just so much new tech these days!). In the meantime, I've set up a [showcase section](/ai/showcase/) where you can check out all the source code and demos of the techniques I'll be covering. Stay tuned and happy learning!
:::

## Overview

Deep learning is a transformative subset of machine learning that enables models to learn rich representations and make decisions from vast amounts of data, powering many of today’s most capable AI systems. In this section, you’ll start with the foundations of neural networks—how models learn through gradient descent and practical training techniques—and build up to deeper architectures (DNNs) that underpin tasks such as sentiment analysis and general classification. You’ll then see why Convolutional Neural Networks (CNNs) are particularly effective for image recognition, as demonstrated through projects like the dog breed classifier, and how techniques such as weight initialisation, autoencoders, and transfer learning improve stability, efficiency, and real-world performance. 

From images, the focus shifts to language and sequential data, where Recurrent Neural Networks (RNNs) and Long Short-Term Memory networks (LSTMs) become essential for modelling context over time; generating TV scripts illustrates how these models produce coherent sequences and how hyper-parameter tuning, embeddings like Word2Vec, and sentiment detection strengthen results. You’ll also explore generative modelling more broadly through Generative Adversarial Networks (GANs), including deep convolution GANs and semi-supervised learning, to understand how neural networks can synthesise realistic new data such as human faces. 

Finally, the material connects deep learning to reinforcement learning, where agents learn optimal behaviour through interaction with an environment; training a quadcopter to fly introduces Markov Decision Processes, value-based methods like Q-learning and Monte Carlo approaches, and policy-based strategies including policy gradients and actor–critic methods. Mastering these techniques equips you with a coherent toolkit for building advanced AI systems that tackle complex real-world problems across vision, language, generation, and autonomous decision-making.

## Table of content

- [Neural Network](#introduction-to-deep-learning)
    - [Gradient Descents](#neural-networks-and-image-recognition)
    - [Training neural networks](#neural-networks-and-image-recognition)
    - [Sentiment analysis](#neural-networks-and-image-recognition)
    - [Deep Neural Network (DNN)](#neural-networks-and-image-recognition)
- [Dog breed classifer](#neural-networks-and-image-recognition)
    - [Convolutional Neural Networks (CNN)](#neural-networks-and-image-recognition)
    - [Weight initialization](#neural-networks-and-image-recognition)
    - [Autoencoders](#autoencoders-learning-to-reconstruct)
    - [Transfer learning](#neural-networks-and-image-recognition)
- [Generate TV scripts](#part-1-sequence-models---recurrent-neural-networks-rnns)
    - [Recurrent Neural Network (RNN)](#the-core-idea-a-loop-for-memory)
    - [Long Short-Term memory network (LSTM): A special type of RNNs with more complex cell blocks that allow it to retain more past inputs](#solution-long-short-term-memory-lstm)
    - [RNN VS LSTM](#solution-long-short-term-memory-lstm)
    - [Hyper-parameters tuning](#natural-language-processing-and-generative-models)
    - [Embedding (Word2Vec model)](#word-embeddings-word2vec)
    - [Sentiment detection](#natural-language-processing-and-generative-models)
- [Generate Faces](#part-4-generative-models)
    - [Generative Adversarial network (GANs)](#generative-adversarial-networks-gans)
    - [Deep Convolution GAN](#deep-convolutional-gans-dcgans)
    - [Semi-supervised learning](#generative-adversarial-networks-gans)
- [Train a Quadcopter to fly (Reinforcement Learning)](#reinforcement-learning)
    - [`Problem` - RL framework: Markov Decision Processes](#reinforcement-learning)
    - [`Solution` - RL framework: Policies, value function and Bellman Equations](#reinforcement-learning)
    - [Dynamic progremming](#reinforcement-learning)
    - [Monte Carlo Methods](#reinforcement-learning)
    - [Temporal - Sarsa, Q-Learning, Expected Sarsa algorithms](#reinforcement-learning)
    - [Work with Continuous spaces](#reinforcement-learning)
    - [Deep Q-learning](#reinforcement-learning)
    - [Policy gradients](#reinforcement-learning)
    - [Actor-critic methods](#reinforcement-learning)

# **A Practical Guide to Deep Learning Foundations**

Welcome to this specialized guide on deep learning foundations. While our main machine learning guide covers the broad strokes, this document dives deeper into two critical areas for modern deep learning practitioners: processing sequential data with **Recurrent Neural Networks (RNNs)** and creating realistic new data with **Generative Adversarial Networks (GANs)**.

Our guiding projects for this material will be generating TV scripts, translating languages, and creating new, realistic faces from scratch.

## **Part 1: Sequence Models \- Recurrent Neural Networks (RNNs)**

So far, we've mostly worked with feed-forward networks (like MLPs and CNNs). In these architectures, information flows in one direction, from input to output. There is no sense of time or order; if you shuffle the input features, the network will produce the same result.

But many real-world problems involve **sequences**, where order is critical:

* **Text:** The meaning of a sentence depends on the order of the words.  
* **Time-Series Data:** Predicting tomorrow's stock price requires knowing the prices from the days before.  
* **Music:** A melody is a sequence of notes.

For these problems, we need a network with a sense of memory. This is the job of a **Recurrent Neural Network (RNN)**.

### **The Core Idea: A Loop for Memory**

The defining feature of an RNN is a loop. The hidden state from one time step is fed back into the network as an input for the next time step. You can think of this as "unrolling" the network through time, where each copy passes a message to the next.

At each time step ![][image1], the new hidden state ![][image2] is calculated based on the current input ![][image3] and the previous hidden state ![][image4].

Please put the basic RNN hidden state formula here

### **The Vanishing Gradient Problem**

Simple RNNs have a major flaw. When training, the error signal has to travel backward through every step in the sequence. If the activation functions have gradients smaller than 1, this error signal can shrink exponentially. This is the **vanishing gradient problem**. The practical consequence is that the network struggles to learn **long-term dependencies**.

### **Solution: Long Short-Term Memory (LSTM)**

The **Long Short-Term Memory (LSTM)** cell is a more complex RNN unit designed to solve the vanishing gradient problem. It uses an internal "cell state" and three "gates" to regulate the flow of information.

1. **Forget Gate:** Decides what information to throw away from the previous cell state.  
2. **Input Gate:** Decides which new information to store in the cell state.  
3. **Output Gate:** Decides what to output as the new hidden state.

Please put the formulas for the LSTM gates (Forget, Input, Output) and cell state update here

This gating mechanism allows the network to explicitly remember important information for long periods and forget irrelevant details.

## **Part 2: Representing Words as Vectors**

Neural networks don't understand words; they understand numbers. How do we turn text into a format that an RNN can process?

### **One-Hot Encoding**

A simple approach is to create a giant, sparse vector for each word. If our vocabulary has 50,000 words, each word is a 50,000-dimensional vector of all zeros except for a single '1'.

* **Drawback:** This is inefficient and captures no notion of similarity. The vectors for "cat" and "dog" are just as far apart as the vectors for "cat" and "democracy."

### **Word Embeddings: Word2Vec**

A much more powerful approach is to represent each word as a dense, lower-dimensional vector (e.g., 300 dimensions). This is a **word embedding**. The key idea is that words with similar meanings should have similar vectors.

**Word2Vec** is a popular model for learning these embeddings. It's a shallow neural network trained on a proxy task, like predicting a word from its context (**CBOW**) or predicting the context from a word (**Skip-Gram**). A fascinating property of these embeddings is that they capture semantic relationships. For example, the vector relationship vector('King') \- vector('Man') \+ vector('Woman') results in a vector that is very close to vector('Queen').

## **Part 3: Sequence-to-Sequence (Seq2Seq) Models**

What about tasks like machine translation or chatbots, where the output is also a sequence? For this, we need a **Sequence-to-Sequence (Seq2Seq)** model.

### **The Encoder-Decoder Architecture**

The core idea is to use two RNNs: an **encoder** and a **decoder**.

1. **Encoder:** Reads the input sequence (e.g., an English sentence) and compresses it into a single fixed-size "context vector." This vector is the final hidden state of the encoder.  
2. **Decoder:** Takes the context vector and generates the output sequence (e.g., the French translation) one element at a time.

### **The Bottleneck Problem & The Attention Mechanism**

A simple encoder-decoder model has a bottleneck: it must cram the meaning of an entire sequence into one fixed-size vector. The **attention mechanism** solves this by allowing the decoder to "look back" at all the encoder's hidden states at every step of the output generation. It calculates a set of attention weights that determine how much focus to place on each input word when generating the current output word.

Please put the formula for calculating Attention scores and the context vector here

### **Bidirectional RNNs for Better Context**

The meaning of a word often depends on the words that come after it. A **Bidirectional RNN** uses two separate RNNs in the encoder: one that processes the sequence from left to right, and another that processes it from right to left. The hidden states from both are concatenated, giving the model a richer representation of each word.

## **Part 4: Generative Models**

Now, we'll shift focus to **generative models**, which are designed to create new data that looks like the data they were trained on.

### **Autoencoders: Learning to Reconstruct**

An **autoencoder** learns a compressed representation of data. It has two parts:

1. **Encoder:** Compresses the input data (e.g., an image) into a smaller, dense representation called the **latent space**.  
2. **Decoder:** Tries to reconstruct the original input from the compressed representation.

The network is trained to minimize the **reconstruction error**. It's a foundational concept for understanding how a network can generate data.

### **Generative Adversarial Networks (GANs)**

GANs consist of two neural networks locked in a competitive game:

1. **The Generator (G):** Creates fake data (e.g., images) from a random noise vector.  
2. **The Discriminator (D):** A detective that tries to distinguish real images from fake ones.

The two are trained in an alternating fashion: the Discriminator learns to get better at spotting fakes, while the Generator learns to get better at fooling the Discriminator. This adversarial process is defined by the **minimax loss function**.

Please put the GAN minimax loss function here

### **Deep Convolutional GANs (DCGANs)**

A DCGAN is a specific architecture that uses convolutional networks for image generation:

* **The Discriminator:** A standard CNN for image classification.  
* **The Generator:** Uses **transposed convolutional layers** (or deconvolutions) to upsample a low-resolution noise vector into a high-resolution image.

## **Part 5: The Modern Era \- Bridging Text and Pixels**

The concepts we've discussed are the building blocks for today's incredible generative AI. The latest revolution connects language models to image generators through a **shared "meaning" space**.

### **The Bridge: A Shared Embedding Space**

Models like OpenAI's **CLIP** are trained on hundreds of millions of (image, text caption) pairs. The model learns to map an image and its corresponding text to vectors that are very close together in a high-dimensional meaning space. A picture of a cat and the words "a picture of a cat" end up in the same neighborhood. This shared space is the critical bridge.

### **The Modern Text-to-Image Pipeline**

When you use a modern tool like DALL-E or Midjourney:

1. **Text to Meaning Vector:** Your prompt is passed through a text encoder to create a **context vector** that represents the semantic meaning of your request.  
2. **Meaning Vector to Pixels:** This context vector is fed to an image generator, typically a **Diffusion Model**.

:::tip GANs vs. Diffusion Models

While GANs generate images in a single shot, **Diffusion Models** start with pure random noise and are trained to gradually **denoise** it over many steps, with each step guided by the context vector. This step-by-step refinement process is slower but generally produces much higher-quality and more diverse images, which is why it has become the dominant architecture.

:::

In essence, the text encoder acts as a navigator, providing a target destination in the "meaning space." The Diffusion Model is the vehicle that starts from a random location (noise) and carefully drives towards that destination, forming an image as it goes.

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAYCAYAAAA20uedAAAAh0lEQVR4XmNgGMxAXl7+m4KCwil0cTAASv4HShagizMoKirqgySBTCa4oJycnA1Q0AuId4MkgXxfEB8sCWQUAXEJSAKI30L5RXDdUEUgXbkogiAgIyOjC7WPEV0OpGsNVBITQO17hy4OBlDJEiT+ERRJoL0qUPZPuARUoAeq+weQy4IiOTwAALDpJKA1L+E/AAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAYCAYAAAAcYhYyAAAA+klEQVR4XmNgGNaAUUZGRhVdkGggLy//Doj/gzC6HEkAaMBlahgCcslFdHGSAMgQBQUFf3RxogHQgCCYV0AGAfEqID8aXR1eAPIG1Dt/gFgTKgbiL0NXixNANaAEKpD/F10MLwAplpOTC8MidhBZDATExcW50cUYZGVl/bDYyAgSA4aNOZo42HB0MZDgaXQJIH82uhgIgAJdHlsygIbHVXQxoIZbUPZLJHVwjKweJhmMRczL2NiYFUhvQRZHVgcGysrKYtgkgGKLoAadQxPHUEsSAEUA0IuX0MVJAkADDgFxOIgNjPpydHmigJKSkhzQOw+AeCm63ChABQC8KU4fPeHioQAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAYCAYAAAAcYhYyAAAA9ElEQVR4XmNgGAWjgESgoKAwUU5OLhWJ3yEvL1+DrAYnUFRUFAdquARiAw3JBWr8BcT/QXwgfRaIe1B1YAEwDSAgKirKA+IDDdYHGmwBYgPpCGT1WAFQoRGMDXRJGbKhQAM4YGwYEBcX50YXQwFAAz4hG4INEJIHKwDixejiMAB0mT9Q/iK6oABIo6ysrDIsPIBe0oLJA/lXkdggC+AYJg4yZCZIQEZGhhNIn4MqUATJgQIXaOAKuGIG3F5hhJkM1OAKchESvw5dMS5DiAZAC/xg6YlsADTgEBCHg9hAV5ajyxMFlJSU5IDeeQDES9HlRgEqAADjzkBbEh0iJgAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAYCAYAAACfpi8JAAABXElEQVR4Xu2Tv0rDUBjF20EQxeLUQMg/kkhwzuA7OCgo6NBZX6HgQ/gCbkI7OPcFdBUEFRcnV0HFTQelPV+5yu3h1uQiCQr5waG55373uye5t61Wwz+h7XneGpu1EobhCzQW8VztIMTtXwkiX+Sa/dqRIFEUbbNfKwix83UsEgY6w7jHdZUjR6KO5gNaV56Mh1xbKWrTmYuK8Sd7lSMbBkGwZ/DOdU9wHGeZvbKg57HrukvsT/F9f8vw5m3xcFc2yJ8GZK8IvNAB1vVk7dwgmLzk5hifsCfIRQ5/8RcvCjKG7tjDpvfq+VGr+5ZeX5YyQXYN3mae5wv4Hem+XmeLrDfesSRJuqbm8E5VmCvyZ2px9ofw3uYJX3VRr5f1WZat6J41cqnR+IZ9GyRImqYd9q1AiAtoX57xJfo8XwYJgh6r7FsRx3GARg/QgOeKwJoj6BV6gp6hd65paPiJCZ43baEQLhrBAAAAAElFTkSuQmCC>