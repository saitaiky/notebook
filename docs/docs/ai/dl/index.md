---
title: Home
---

:::infoAs of July 2024
It might take a while to write everything down, but I'll do my best to create notes that make these concepts easy to understand. In the meantime, I've already created a [showcase section](/ai/showcase/) with all the source code to demo the techniques I'll be covering. Stay tuned!
:::

## Overview

### Introduction to Deep Learning

Deep learning is a transformative subset of machine learning, enabling models to learn and make decisions from vast amounts of data. By understanding deep learning techniques, you can build advanced AI systems capable of handling complex tasks such as image recognition, natural language processing, and more.

#### Neural Networks and Image Recognition

Starting with neural networks, you'll learn about gradient descent and training methods essential for tasks like sentiment analysis and building deep neural networks (DNNs). Projects like the dog breed classifier use Convolutional Neural Networks (CNNs), which are powerful for image recognition tasks. Techniques such as weight initialization, autoencoders, and transfer learning enhance the performance and efficiency of these models, making them crucial for practical applications.

#### Natural Language Processing and Generative Models

In natural language processing, Recurrent Neural Networks (RNNs) and Long Short-Term Memory networks (LSTMs) are pivotal. Generating TV scripts demonstrates how these models handle sequential data, with LSTMs providing enhanced capability to retain past inputs. Hyper-parameter tuning and embedding techniques, like Word2Vec, improve the model's ability to detect sentiment and generate coherent text. Additionally, Generative Adversarial Networks (GANs) are introduced for creating realistic data, such as generating faces, showcasing the power of deep convolution GANs and semi-supervised learning.

#### Reinforcement Learning

Deep learning also integrates with reinforcement learning to train agents for decision-making tasks. Training a quadcopter to fly involves Markov Decision Processes, policy gradients, and actor-critic methods, utilizing algorithms like Q-learning and Monte Carlo methods. These techniques allow agents to learn optimal behaviors through interaction with their environment, essential for applications in robotics and autonomous systems.

Mastering these deep learning techniques equips you with the skills to develop sophisticated AI systems capable of solving complex real-world problems, making them invaluable in advancing technology across various fields.

## Table of content

- Neural Network
    - Gradient Descents
    - Training neural networks
    - Sentiment analysis
    - Deep Neural Network (DNN)
- Dog breed classifer
    - Convolutional Neural Networks (CNN)
    - Weight initialization
    - Autoencoders
    - Transfer learning
- Generate TV scripts
    - Recurrent Neural Network (RNN)
    - Long Short-Term memory network (LSTM): A special type of RNNs with more complex cell blocks that allow it to retain more past inputs
    - RNN VS LSTM
    - Hyper-parameters tuning
    - Embedding (Word2Vec model)
    - Sentiment detection
- Generate Faces
    - Generative Adversarial network (GANs)
    - Deep Convolution GAN
    - Semi-supervised learning
- Train a Quadcopter to fly (Reinforcement Learning)
    - `Problem` - RL framework: Markov Decision Processes
    - `Solution` - RL framework: Policies, value function and Bellman Equations
    - Dynamic progremming
    - Monte Carlo Methods
    - Temporal - Sarsa, Q-Learning, Expected Sarsa algorithms
    - Work with Continuous spaces
    - Deep Q-learning
    - Policy gradients
    - Actor-critic methods