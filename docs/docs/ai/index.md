---
title: Overview
sidebar_position: 1
---

![Deep_Learning_Icons_R5_PNG](/img/ai/Deep_Learning_Icons_R5_PNG.webp)

Source: [What’s the Difference Between Artificial Intelligence, Machine Learning and Deep Learning?](https://blogs.nvidia.com/blog/2016/07/29/whats-difference-artificial-intelligence-machine-learning-deep-learning-ai/)

AI can be categorized into different approaches, with one common classification being the trio of Artificial Intelligence (AI), Machine Learning (ML), and Deep Learning. 
- AI serves as the overarching concept, encompassing various activities aimed at replicating human intelligence. 
- Machine Learning, a subset of AI, involves applying complex algorithms and statistics to existing data for decision-making and predictions. 
- Deep Learning, a critical subfield of ML, uses large datasets and Neural Networks to simulate human-like behavior, including reinforcement learning.

## AI (Search, Plan, Reasoning)

> General speaking, if you exclude machine learning and deep learning, AI itself mainly focuses on topics like CSP and searching to mimick of human intelligence by computers

Artificial Intelligence (AI) plays a crucial role in automation, logistics, and operations research by leveraging various techniques to optimize and streamline complex processes. Here's a brief overview of how AI employs search, optimization, planning, and probabilistic graphical models in these domains:

- Search Algorithms: AI uses search algorithms to navigate large solution spaces efficiently. These algorithms, such as A* or breadth-first search, are instrumental in finding optimal paths and solutions in logistics and operations, like route planning for transportation, inventory management, or facility layout optimization.
- Optimization Techniques: AI applies optimization methods to enhance resource allocation and decision-making. Linear programming, integer programming, and metaheuristic algorithms (e.g., genetic algorithms or simulated annealing) are used for solving complex optimization problems. These techniques are valuable for scheduling tasks, resource allocation, and load balancing.
- Planning and Scheduling: AI-based planning systems employ various techniques like classical planning, heuristic search, and automated planners. They assist in creating schedules, allocating resources, and managing workflows efficiently. This is vital in industries like manufacturing, where production schedules need to be optimized.
- Probabilistic Graphical Models: Probabilistic graphical models, such as Bayesian networks and Markov decision processes, help in modeling uncertainty and making decisions under probabilistic conditions. These models are crucial in supply chain management for demand forecasting, risk assessment, and quality control.

## Machine learning

Machine learning is a subfield of artificial intelligence (AI) that focuses on the development of algorithms and models that enable computers to learn and make predictions or decisions without being explicitly programmed. It is a technology that has gained significant attention and importance in recent years due to its wide range of applications in various domains. 

### Types of learning

- Supervised Learning:
    - Supervised learning is a type of machine learning where the algorithm learns from labeled data, which means the training data includes input-output pairs.
    - The key algorithms used in supervised learning include decision trees, linear regression, support vector machines, k-nearest neighbors, and deep neural networks.
    - Supervised learning algorithms are trained to make predictions or classify new, unseen data based on patterns learned from the labeled training data.
- Unsupervised Learning:
    - Unsupervised learning is another category of machine learning, but in this case, the algorithm learns from unlabeled data, finding patterns, structures, or groupings within the data.
    - Algorithms for unsupervised learning include k-means clustering, hierarchical clustering, principal component analysis (PCA), and autoencoders.
    - These algorithms help uncover underlying structures and relationships in data without explicit labels, making them useful for tasks like data compression, dimensionality reduction, and data exploration.
- Reinforcement Learning:
    - Reinforcement learning (RL) is a distinct machine learning paradigm that focuses on an agent interacting with an environment to maximize a reward signal.
    - RL algorithms, such as Q-learning, policy gradients, and deep reinforcement learning, enable agents to learn optimal strategies or policies for sequential decision-making tasks.
    - In RL, algorithms learn from trial and error, aiming to find the best actions to take in various states to maximize cumulative rewards.

### Model Training

Training a machine learning model involves presenting it with a dataset and allowing it to adjust its internal parameters to minimize errors or maximize rewards. The trained model can then make predictions or decisions on new, unseen data.

### Key Algorithms

- Linear Regression
- Decision Trees
- Support Vector Machines (SVM)
- k-Nearest Neighbors (k-NN)
- Neural Networks
- K-Means Clustering
- Principal Component Analysis (PCA)
- Reinforcement Learning Algorithms (e.g., Q-Learning)

## Deep learning

Deep Learning (DL) is a subfield of machine learning (ML) that focuses on training artificial neural networks (ANNs) with multiple layers, also known as deep neural networks (DNNs). Deep Learning encompasses a variety of neural network architectures and techniques, including DNN, RNN, CNN, Generative Adversarial Networks (GANs), and Reinforcement Learning (RL). Here's a brief overview of their relationships:

- Deep Neural Networks (DNNs):
    - DNNs are a type of artificial neural network with multiple hidden layers between the input and output layers.
    - These networks are the foundation of deep learning and are used for tasks like image and speech recognition, natural language processing, and more.
- Recurrent Neural Networks (RNNs):
    - RNNs are a type of deep neural network architecture designed for sequential data, such as time series or natural language.
    - They use recurrent connections to process sequences, making them suitable for tasks like language modeling, speech recognition, and machine translation.
- Convolutional Neural Networks (CNNs):
    - CNNs are specialized deep neural networks tailored for processing grid-like data, such as images and videos.
    - They use convolutional layers to automatically learn features from input data, making them ideal for image classification, object detection, and image generation.
- Generative Adversarial Networks (GANs):
    - GANs are a class of deep learning models consisting of two neural networks: a generator and a discriminator.
    - They are used for generating synthetic data, image-to-image translation, and creating deepfake content by training the generator to produce data that is indistinguishable from real data.
- Reinforcement Learning (RL):
    - RL is a machine learning paradigm that focuses on agents learning to make decisions by interacting with an environment.
    - Deep Reinforcement Learning (DRL) combines deep learning techniques with RL algorithms, allowing agents to handle complex tasks, such as game playing, robotics, and autonomous control.

In summary, Deep Learning serves as the overarching field that encompasses these various neural network architectures and techniques. DNNs, RNNs, CNNs, GANs, and RL are specific branches of deep learning, each tailored for different types of data and tasks. Researchers and practitioners choose the appropriate subfield and architecture based on the requirements of the problem they aim to solve.



