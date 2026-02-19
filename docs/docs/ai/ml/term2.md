---
title: "Deep Learning, CNNs & Reinforcement Learning"
description: "A practical guide to advanced ML topics including deep learning foundations, convolutional neural networks and transfer learning, reinforcement learning with Markov decision processes, and deep RL approaches such as Deep Q-Networks — with a forward look at transformers and modern RL."
keywords:
  [
    advanced machine learning,
    deep learning,
    neural networks,
    overfitting,
    regularisation,
    deep learning frameworks,
    convolutional neural networks,
    cnn,
    filters,
    feature maps,
    pooling,
    transfer learning,
    reinforcement learning,
    markov decision process,
    mdp,
    value function,
    policy,
    exploration exploitation,
    q learning,
    deep q network,
    dqn,
    policy gradient,
    actor critic,
    transformers,
    modern reinforcement learning,
    generative ai
  ]
---

Welcome to the second part of our practical guide. Having mastered the foundations of classical machine learning, we're now ready to tackle the more complex and powerful models that have defined the modern era of AI. We'll explore two major areas:

1. **Deep Learning:** We'll see how stacking simple neural units into deep architectures, particularly **Convolutional Neural Networks (CNNs)**, allows us to achieve state-of-the-art results on unstructured data like images. Our guiding project will be building a **Dog Breed Classifier**.  
2. **Reinforcement Learning:** We'll dive into the third major paradigm of machine learning, where an "agent" learns to make optimal decisions through trial and error. Our goal will be to train an agent to solve a complex control problem: **teaching a quadcopter to fly**.

## **Part 4: From Neural Networks to Deep Learning**

In Term 1, we introduced the Perceptron, a simple linear classifier. We saw that by combining multiple perceptrons, we could create a **multi-layer perceptron (MLP)**, or a basic neural network, capable of learning non-linear decision boundaries.

The core idea of **Deep Learning** is simple: what happens if we make these networks *deeper* by adding more hidden layers?

Adding layers allows the network to learn a **hierarchy of features**.

* **Layer 1** might learn to detect simple patterns like edges and corners.  
* **Layer 2** might combine these edges to detect more complex shapes like eyes and noses.  
* **Layer 3** could combine those shapes to recognize entire faces.

This ability to learn complex, hierarchical representations of data is what gives deep neural networks their power.

### **The Building Blocks Revisited**

A modern deep learning model consists of several key components:

* **Activation Functions:** We need non-linear activation functions to allow our network to learn non-linear patterns. While sigmoid was historically popular, the **Rectified Linear Unit (ReLU)** is the standard choice today. It's simply ![][image1]. It's computationally cheaper and helps mitigate the vanishing gradient problem.  
  Please put the Sigmoid activation function formula here  
* **Loss Function:** For classification, the go-to loss function is **Cross-Entropy Loss**. It measures the difference between the predicted probability distribution and the true distribution. A low cross-entropy means the model is confident and correct.  
  Please put the Cross-Entropy Loss formula here  
* **Optimization:** We still use **Gradient Descent**, but typically an advanced variant like **Adam**, which adapts the learning rate for each parameter, leading to faster convergence.

### **A Practical Challenge: Overfitting in Deep Networks**

Deep networks, with their millions of parameters, are extremely prone to overfitting. We need robust regularization techniques to combat this.

* **L1/L2 Regularization:** The same techniques we saw in linear models apply here, adding a penalty for large weights.  
* **Dropout:** This is a simple but powerful technique specific to neural networks. During each training step, a random fraction of neurons (e.g., 50%) are "dropped out" or temporarily deactivated. This forces the network to learn redundant representations and prevents any single neuron from becoming too specialized. It's like forcing a team to work together without relying too much on any single star player.  
* **Early Stopping:** We monitor the model's performance on a validation set during training and stop the training process when the validation performance stops improving, even if the training performance is still getting better.

### **A Note on Implementation: The Rise of Frameworks**

While it's important to understand the mechanics of backpropagation and gradient descent, in practice, no one builds these systems from scratch anymore. Libraries like **TensorFlow** and **PyTorch** handle all the heavy lifting of automatic differentiation and GPU computation.

These frameworks represent a neural network as a **computation graph**. You define the architecture of your network, and the framework takes care of calculating the gradients and updating the weights.

A typical workflow involves:

1. Defining **placeholders** for your input data and labels.  
2. Defining **variables** for your weights and biases.  
3. Defining the operations (matrix multiplications, activations) that combine them.  
4. Defining your loss function and an optimizer.  
5. Running a **session**, feeding in batches of data to train the network.

## **Part 5: Convolutional Neural Networks (CNNs)**

A fully-connected deep network (MLP) can be used for image classification, but it's wildly inefficient. A 224x224 pixel image has over 50,000 pixels. A first hidden layer with 1000 neurons would require 50 million weights\! This is computationally expensive and prone to overfitting.

MLPs also ignore a critical piece of information: **spatial structure**. Pixels are not independent; nearby pixels are related. A cat's ear looks the same whether it's in the top-left or bottom-right of an image. MLPs have to learn this from scratch in every location, whereas a **Convolutional Neural Network (CNN)** is designed to exploit this structure.

### **The Core Idea: Filters and Feature Maps**

Instead of connecting every input pixel to every neuron, a CNN uses **filters** (also called kernels). A filter is a small matrix of weights (e.g., 5x5) that slides over the input image.

At each position, the filter performs a dot product with the patch of the image it's covering. This produces a single number in an output **feature map**. The feature map shows where in the image the feature that the filter is looking for (e.g., a vertical edge, a specific color) is present.

This process has two key advantages:

1. **Parameter Sharing:** The same filter is used across the entire image. Instead of learning a separate detector for a cat's ear in every possible position, it learns a single "cat ear" filter and applies it everywhere. This dramatically reduces the number of parameters.  
2. **Translation Invariance:** The feature map will detect the "cat ear" regardless of where it appears in the image.

Please put the formulas for calculating CNN output size with VALID and SAME padding here

### **Building a CNN: The Layers**

A typical CNN architecture consists of a sequence of layers:

1. **Convolutional Layer (Conv):** Applies a set of filters to the input, creating a stack of feature maps. Each filter learns to detect a different feature.  
2. **Activation Layer (ReLU):** Applies the ReLU activation function to introduce non-linearity.  
3. **Pooling Layer (Pool):** Downsamples the feature maps, making them smaller. The most common type is **Max Pooling**, which takes the maximum value in a small window (e.g., 2x2). This makes the representation more robust to small translations and further reduces the number of parameters.  
4. **Fully-Connected Layer (FC):** After several Conv-ReLU-Pool sequences, the final feature maps are flattened into a 1D vector and fed into one or more standard fully-connected layers, just like in an MLP, to perform the final classification.

### **The Power of Transfer Learning**

Training a large CNN from scratch requires a massive amount of data (like the 1.2 million images in ImageNet) and computational power. In practice, it's rare to train a CNN from scratch. Instead, we use **Transfer Learning**.

The core idea is that the features learned by a network trained on a general task (like ImageNet classification) are useful for other, more specific tasks. The early layers of a CNN learn generic features like edges and textures, which are applicable to almost any image problem.

The common strategy is:

1. Take a powerful, pre-trained network (like VGG16, ResNet, or Inception).  
2. Freeze the weights of the convolutional layers. We will use them as a fixed feature extractor.  
3. Remove the original final classification layer.  
4. Add our own new classification layer on top, with the correct number of outputs for our specific task (e.g., 120 for our dog breed classifier).  
5. Train *only* the new classification layer on our smaller, specific dataset.

This allows us to achieve very high performance on custom tasks with much less data and computation.

## **Part 6: Reinforcement Learning Foundations**

We now shift gears to the third major paradigm of machine learning. In supervised learning, we have explicit labels. In unsupervised learning, we have no labels. In **Reinforcement Learning (RL)**, we have sparse, time-delayed labels in the form of **rewards**.

The setting is an **agent** interacting with an **environment**.

* At each time step, the agent observes the environment's **state**.  
* It takes an **action**.  
* The environment transitions to a new state and gives the agent a **reward**.

The agent's goal is not to predict a label, but to learn a **policy**—a mapping from states to actions—that maximizes its **cumulative future reward**. This is the core of RL: learning optimal behavior through trial and error.

### **The Formal Framework: Markov Decision Processes (MDPs)**

An RL problem is formally described as a **Markov Decision Process (MDP)**. An MDP is defined by:

* A set of states, ![][image2].  
* A set of actions, ![][image3].  
* A reward function, ![][image4], which defines the reward for taking action ![][image5] in state ![][image6] and ending up in state ![][image7].  
* A transition probability function, ![][image8], which defines the probability of transitioning to state ![][image7] from state ![][image6] after taking action ![][image5].

The **Markov Property** is a key assumption: the future is independent of the past, given the present. The transition to the next state ![][image7] depends only on the current state ![][image6] and action ![][image5], not on the entire history of states and actions that came before.

### **The Goal: Maximizing Future Reward**

The agent wants to maximize the **return**, which is the sum of discounted future rewards.

Please put the Discounted Return formula here

The **discount factor**, ![][image9] (gamma), is a value between 0 and 1\. It determines how much the agent cares about future rewards versus immediate rewards.

* ![][image9] close to 0: The agent is "myopic" and only cares about immediate rewards.  
* ![][image9] close to 1: The agent is "farsighted" and values future rewards highly.

### **The Solution: Value Functions & Policies**

How does the agent learn the best policy? It does so by learning **value functions**.

* **State-Value Function, ![][image10]:** The expected return when starting in state ![][image6] and following policy ![][image11] thereafter. It answers: "How good is it to be in this state?"  
  Please put the State-Value Function (Bellman Expectation Equation) formula here  
* **Action-Value Function, ![][image12]:** The expected return when starting in state ![][image6], taking action ![][image5], and then following policy ![][image11] thereafter. It answers: "How good is it to take this action in this state?"  
  Please put the Action-Value Function (Bellman Expectation Equation) formula here

The ultimate goal is to find the **optimal policy**, ![][image13], which has the highest possible value function. If we have the optimal action-value function, ![][image14], then the optimal policy is simple: in any given state, just choose the action with the highest Q-value. This is known as acting **greedily** with respect to the Q-function.

## **Part 7: From Tables to Functions \- Deep RL**

The classical methods for solving MDPs, like **Dynamic Programming** and table-based methods, assume we can store the value function in a lookup table (one entry for every state or state-action pair). This works for simple problems like tic-tac-toe, but fails for problems with large or continuous state spaces, like our quadcopter. The state of a quadcopter includes its position, velocity, and orientation—an infinite number of possible states.

This is where deep learning and RL join forces. Instead of a lookup table, we use a **deep neural network** to approximate the value function. This is **Deep Reinforcement Learning**.

### **Value-Based Methods: Deep Q-Networks (DQN)**

The seminal algorithm here is the **Deep Q-Network (DQN)**, developed by DeepMind to play Atari games. The idea is to train a neural network to take the raw screen pixels as input (the state) and output the Q-value for each possible action (e.g., up, down, left, right).

Please put the Temporal Difference (TD) update rule formula here

Please put the Q-Learning update rule formula here

Training a Q-network with standard RL methods is unstable. DQN introduced two key innovations to stabilize the training:

1. **Experience Replay:** The standard method learns from consecutive experiences, which are highly correlated. This violates the I.I.D. assumption of most optimization algorithms. Experience Replay stores the agent's experiences—(state, action, reward, next\_state) tuples—in a large replay buffer. During training, it samples random mini-batches from this buffer. This breaks the temporal correlations and smooths out the training process.  
2. **Fixed Q-Targets:** The Q-learning update uses the same network to both select the best action and to evaluate the value of that action. This can lead to a moving target problem where the policy chases its own tail. DQN uses two networks: a main network that is constantly being updated, and a "target network" whose weights are a delayed copy of the main network's weights. The target network is used to provide a stable target for the Q-value updates.

### **Policy-Based Methods & The Road Ahead**

DQN is a **value-based** method. It first learns a value function and then derives a policy from it. Another family of methods, called **policy-based** methods, directly learns the policy without needing a value function. These methods, like **Policy Gradients**, are often better suited for continuous action spaces, like the precise motor controls needed for a quadcopter.

The state-of-the-art often involves **Actor-Critic** methods, which combine the best of both worlds: they use one network (the "actor") to learn the policy, and another network (the "critic") to learn a value function that helps the actor learn faster.

## **Part 8: The Road Ahead \- From DQN to Transformers and Beyond**

The concepts you've learned in this guide—from the bias-variance trade-off to backpropagation and value functions—are the timeless foundations of machine learning. However, the field moves incredibly fast. The state-of-the-art landscape today looks quite different than it did when these foundational concepts were first established.

### **The Transformer Revolution**

While CNNs are still dominant in many vision tasks, a new architecture called the **Transformer** has taken over the world of Natural Language Processing (NLP) and is making significant inroads into computer vision. Originally designed for machine translation, the Transformer's core innovation is the **self-attention mechanism**, which allows it to weigh the importance of all other words in a sequence when processing a given word. This ability to capture long-range dependencies is what powers models like GPT-4 and modern language translation.

### **Beyond DQN: Modern Reinforcement Learning**

For our quadcopter project, DQN is a great starting point, but modern robotics and control problems are often solved with more advanced algorithms. As mentioned, **Actor-Critic** methods like **Proximal Policy Optimization (PPO)** and **Soft Actor-Critic (SAC)** are now the standard. These methods offer better stability and sample efficiency, particularly in environments with continuous action spaces.

### **The Generative AI Explosion**

While the RL section focused on training an agent to make optimal decisions, another major application of deep learning is **generative modeling**—creating new data. While this guide touched on the foundational ideas, the modern generative landscape is dominated by two types of models:

* **Large Language Models (LLMs):** Transformer-based models trained on vast amounts of text, capable of generating coherent and contextually relevant prose.  
* **Diffusion Models:** A new class of generative model that has surpassed GANs in quality for image generation. They work by starting with pure noise and gradually refining it into an image, guided by a text prompt. This is the technology behind tools like DALL-E 2 and Stable Diffusion.

The journey into machine learning is a continuous one. With the solid foundation you've built here, you are now well-equipped to explore these cutting-edge topics and apply them to the engineering challenges of tomorrow.

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAYCAYAAAAh8HdUAAAA2ElEQVR4XmNgGJpASUlJTUFBYaacnJwvTExeXr4EWQ0cGBsbswIl/wHxbBUVFT5FRUU7IPs/ENcA8Wd09WAAUgA03QabOBBXoYszABUvAEmii4MASBzkCnRxmGk4NaGLgQFMExD3osvhBEDF3UgawRjo5Bno6jAAUFEeukZg0N9CV4cTAA1wgWlElwMDoEQwuhgIAMUXY9UkKyvrB3RCAbo4CAA1lGLVBBQ8C8Tr0MVBACj+F2tgwNwtKirKgya+Vh5P0nkCpJiA9AeoAe9BNCiFoKsdBQMCAJvoROf9khJcAAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAXCAYAAADUUxW8AAAAuUlEQVR4XmNgGL5AQUHBXV5e/hq6OFEAqPE/CKOLEwRATUvJ1cwE1PSJLM1ADW+AFAvJmmVkZHSBAbUKxAZq/EOSZmTFQPY1ojUDFTbLycn5wPhA9gaQZikpKRFkdVgBUOEPNH431N+OyOIYAJvzgDY7QzW3osvBAVBymaysrCm6OFBMCqp5M7ocGCgpKckBJX+ji8MAVPMTFEFgdAQABX9CJUF4H7I8iA/E35HkzwC9YYysZhQMegAAwAM63RuuETkAAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAYCAYAAABtGnqsAAADyUlEQVR4Xu2XS2hTQRSGUy2+RQRja2gzaRINBBV14wN0UURULAUFERFfoILPnQ+kC3HjwheoCIoiFrt3oatudaEIbmzpRiuiolKqWEistvqf5sz19GRyexsTaCQfHDrzzznnzpk7mTsNhapU+a+Ix+OLtFZJRKPRdF1d3UzbN8ZsleNlBQ/7rbVKg2qAfRH9bbC70qcgcLwI+8ZJyDKwPthPq8WAjiMw9imZTIa1XmlQjQ0NDUukhpKfQd8pNV/sYjn0TtIbGxsTUse23w39s9QqESxUq6tuopDuhBfwiUNv5rFXSqedWS+1SgR1vIDd0DoBvRd2Tet5YCF20IJgV63XY9Bv8dg9q2E3Rsb1diYwfnWg5i1+4x5w6irkyLtv1Bj692GDUnMBn6OwO01NTUv1WFAQvx+FXEGzRo+Nk1pslNOwq7g1RK2I/P3SSaNrd+JaJDxoGbRfsF6pE9CGYA+0bolEIjMoXyqVmk195HqIRVyn/fygqxHlQJyhPtrD1EeuQ9p3LOgDQbWgOYn6aL/GHOcpNye8Nqu1Pgp26uMvz0vYD9LwhZ2qfQn2P691C8ayyHVB9Ml/k/TxA7HTKAY774DV0G4hDc3JwjUQFIecG6ltc+MFzdF+Ljh2n9Y9Ynz+wZqljn43TziPsZJyPrLLQScqMbmrlD422rUWFDGftnQ6PUWP+8G1epshDzj0uCZGQaQnEon5eoyT7tW6RbwUa8+1jx8c89GhDUgtKNi9N+V8+EwNBMdc0rqHTerQB1jPO7xJxyKd07oGfitgg678hUDeVZx/1FnH2hmpBcSbv/l7JQs8H/LFgh/XugcnfFpAdz6Ix9q1TvDYY9unj4DOg4Woh+2RmoUOd+2Pj0CSNDqT0V4ojw8UdxJ/aoW7B/2XRHHsMwI9F9qw9POD61mj9REwcJYf0OIYo0CvENXugGVt30I/d+iZEH/tCPTfwo4IN5nb+UHgOe2idowPfft8/O2yfrQzeOy71SQY327yj4IsbLnU/LDP1eJ1eiis3+T+7/0KG5I+uCwv5sl9gGXslYRAUTFn4tDIpE9xHNkwXFu1j8m9uC65kyTYZdNN7gpFOR6Rhr/vqY/8B6UvtDfkKzWJyb1sykOWGc+dFL4bKE7rJYGLmav1oCB+MxZwpdaLoVxFIm83ajym9ZKAxCfwgHdaDwpie7RWDHQuItdtrZeCcr0YD/rpyJ92UHA8rEVsm9aLwaijp1Qgb2eML99lpZi3hJgFWiuWcDg8S2v/islddzq0Xi5q6GqhxUoGi3dYa1WqTBz+AAHwPQcVZMY8AAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAZCAYAAAAIcL+IAAAAmElEQVR4XmNgGAUDBxQUFC7Jy8u/AOJvQOwExHfR1TAABf/LycnVIfH/gsSQ1YAEP6ILQk3GUPgfiJ9jEfsCFwBaFwISBLovHUkdWCFQrBIuAFS4A90KJSUlOZCYsbExK1wQKDAFXSGQvwQmBqSXggXFxcW5kRUqKiq6Qd0HU4gwBGi9M0wSiLOhCv6B+DIyMkJwhaMAFwAAKBAyZ7tKZFgAAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAYCAYAAAAoG9cuAAAAf0lEQVR4XmNgGAVkAQUFhUR5efllcnJyNuhyYACU/A9UpABiA6lKIL8KXcE+ID6BxAdp6ERWAxL8BJIAWjNfWVlZFkUSBoAKNEGKkPB7dDVwICMjowJU8BykEEUCqvMLuhgyHywAdIsgEn8PEK9GVsMAVOACFPyH5J5iFAWjAADIPyUGZQ+3SgAAAABJRU5ErkJggg==>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAvUlEQVR4XmNgGMyARV5e3hBdkCAAajoDxP/RxQkCkCYgXosuThBAbWNCF8cL5OTkfIEaf6OLEwRATacVFBQ80MVRAFBBIlDhMqAtNjAxgoECUgDUqABiA6lKIL8KTQkmACraB8QnkPggQzqR1WAFQIWfQIqBTpyvrKwsiy6PEwA1aULjCobfo6vBC2RkZFSAmp6DNKPLYQCoDV/QxZD5WAHUb4JI/D1AvBpZDVYA1OQCVPgPyX/F6GpGwaAGAFB7MQwAiDjEAAAAAElFTkSuQmCC>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAAAYCAYAAAC/SnD0AAADkUlEQVR4Xu2XS2hTQRSGVRRRUREXgabppGmguHETUMEHFgShuvABou58gC5EFwraCoKiC3cWN1oEFbVFRd0JShFBit34BlEQXBV31ie+8PGf5tz05O/ce5OYxgr54JA7/zlzZubce2duJkyoU+e/xDm3nrU40un0JtbAZBZqBeazkbUxAwXrbWpqWsJ6FIhfjX6/WYd2hLVagTllMP4T1r2gwicQ/F4WofYF9tZqiLnC/QT42uG7zXoc6PdovBVNwFq6YKdZDyUoEOvNzc1OCzeqOL74UtCxtnr0f1o0oaw16ULusy74Cop2J+yx1UqFcwWMk6JdcKW8prIJykLwu5J9jY2N00KKJvGLrFYK6LcKNsC6MB6KlslkZvNavSDoeVgg9BtaoDWke+MtiGmHXbQnE9r9DQ0N021cQFTRkGML/D3lHjoW9N2AHN2tra0z2WeRtWWz2VmsFyFBviJAa9OCdZEuxRgVb4H/I2y7XONpTeJ6kGOYsKLpHNJyjZ8OtDspJJJEIjFD19gmbZc/6KTdy7GCjtfBehGaQOwdbAj2VdvPksnkXI5HwsPiZz0Ah8cy68f1T9g3G+PDeYoG7Y4zr7PkxfjHbUwcupZLQVueIs2z0MYFqO886wXk1dGko06zMCRhVNHg26c5B1Kp1FL2h+H8RfsgufBqnW1paUmxPw70fchzRXsbaxaX/+zy7rvDwPkyKoEPWUBcHy1awdjvw/mLNo9yDXFMFL7x0X7NmgW+z7AHrBfwJY0DT9qBUvroXtKjY+xiP+M8RQvAvpiF/00p41p07KK9SzTc+FtWs2if66wX0IBXrEeB+LVhk4f+g33S9u2NjKOi6dw+sWbb8kmEAuyxmkXi4V9spEmi4cYvx/VE396l4/oPGzgOaoId7IuDJx+gA2427XWw7zYmDOcpGhY8x7T7YFc5RgyHzwKrB6j/DLWH547f7lwuN2UkeiTGjhuIJ13+k0BOSjl+5R3+VRQUgybOsY6TaarmHp4cbshljgnDUdGQf4XMK8gF22v9gsvflEHfExOg65O5PNX2XWkj/zkKLXyesF4VkPgmrJ/1v4GLVirysYoC7Ge9EpDnFOZxjfWqUe07UmnRop6ycqn2mkaBAY6W8/rFUUnR5IBBvz7WKwFP2SHkOsZ61cEg97AJz2e9EiopmuyhrFUC1pDA+C9YHzPwtO1krRLC/sjXAjxlu1mrU6f2/AFNejA40kTazAAAAABJRU5ErkJggg==>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAYCAYAAAAs7gcTAAAAq0lEQVR4XmNgGAV0BTIyMtLy8vLL5OTkctHlZGVlbeEcoKJjQPwfCb9BUguSvwFmAE3KA3LeGhsbs0IlJEEalJWVZUF8BQWFhVpaWmwwXf9hJsAAUIEDUPwAiA0yCE0aE0CdkyUlJSWCLocBYO5HF8cKgArfA3ENujhWAFT4BF0MJyDaCUDABFT8Cl0QKwCGfR1QcTe6OFYAVPhORUWFD10cKwAq/o0uNogAACNgJZj+OOLVAAAAAElFTkSuQmCC>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAYCAYAAABTPxXiAAACiUlEQVR4Xu2XT0hUURTGZ1RMDAkXNjnMzHvzRwcmcFFIC0EKgmgRlptaheLSoGVhQVQbN7VwH2KRKzdu2tQyWtQmCKJtCIGJZCvFv31nPPdx5+PdefMHRiF/cJj3vu/c+845vjfzjMVO+M/J5XKDrLnwPK8fH22sHyko6oC1KKLWxJGwIUlWrHMStD3L3zN6JpO5QWvLAf2uvd4Ab7VQKPSxHkWpVOrE2n3WK8BF5+Xivu9fZs8gvn2ONRehjav3TLXzdo6NNIa836zXCtZ+QrxgPQDFT+gUH7EnwF+WolkXsOYW/C7ETfZsdEjnWK+Ddh5kBel0Oq9NvGMvmUx2Q//FugHejn4uoUif7DLYP1m1gBqRPTDMq6wHaBN/Q/Rt1gyJROI0/DU5Rv0Lnt5WDPTX1fYxIOce4lU2mx1iT4D3A9f5zHqANlExLZxPIR7bmg28JUxmRI5lQjh/yzmCd/jFEOoJ+tc+KBaLPXIuty8aGeU85MxwjRU4mnAvqAPd+znrBnhbKHzWOpf863aOgJw7VWviJnD8vZGvwzBkXxQwybrBXBvxEj+EZ9g3YI9LUU1smgR90D9yTqNoExOsG8yErfjCOQLqGo5q4oMkYBKZqokNoE08ZZ1B3gXEtuv62OO2yyuDB/OJTmHFC7kfm0H3fcO6oF7w1Y4H2nMViiYeurwyMK/ohn/YaxbsuYjYYj2fz5+FvhmzXvBw/hMxbaUFQP+G+Mq6TYd2GWejWTBB3zVB3AEPdHgS+0gd4xyD5MC/xnrLkAJQcC/rdSAvq6GDaBlo4D6KWGG9VrD2PWKO9ZaDInbNr3KdtHnWvwBHTiO3xLFqQImnUqkBFl3IDy/eHE6xfsJx4x8Ktr9sIji70wAAAABJRU5ErkJggg==>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAXCAYAAAA/ZK6/AAAAlUlEQVR4XmNgGAWDCigoKHDIy8s7AWl3IO0JxF5Q7AkSAyphhCuWk5PbCZT4TwBnw0wuAHJWwzQD2S+hhsQA2Y4wcThQVFQ0g7GBivKABmSC2EDFp4EUE1whNgCyGhsbKwCanoauAWi7PLIaFAD1WBcyH+i8lchq4ABouhbUdBaYGNQA3M6ChjUcKCsryzIgGTAKSAEAYSsqmVld+qEAAAAASUVORK5CYII=>

[image12]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAAYCAYAAAChg0BHAAADZ0lEQVR4Xu2YO2hTURjH09a3qCBoJCS5eRQiARGMiLpU0VVwEFzUxcHRpVsnwdpNRCsIgriISAdFQXwuDg4qDlLEKqJIQdTSWhRaqa3+v/Q7yck/5z6SYuqQHxzuPf/vcb/z5T4Ti7Vp89+QzWa3stYiliSTyfUsRgJFe+l0+pLneYPd3d1r2d4MyLUN4y7rrQLH/l4oFNaw7ksmkzmHoD9oxFGZoylxSYIx7fC9Lb482E8olUpLYfvNeqvxq4/p1MW8ZIOgtjlrPlIsFpeZpmF7q+pdD/xn4VNivdWghjOo5QXrNehif7BuQJKT4oPtPluHNqNb347H4/HVQfZWo7V0sF4GxtGwYnFJbNKGDVlyB5pzX3aC4mEbht891hcL1DOLcZp1WWSPLvIx2xj1GzdzxD7AHXqLsVU9axEbmrGfdZtUKpWH31mMXtywl7M9Crlcbh3i+3GsY2yz0QdD/f0L4owupJNtNlj4QfHD9obRMJ+19n/JTdLMbYIaJaC4q8j7xMzD/F0g5iHGF9lHrs3Yn/LLA3230yai00DI5aDNOMy2ELrC8tt27PeH+TPwv8wxQesyl3yNmM/nN2rQVI3BQVDyIBCTDYkzT7EJNPwIG6Og8ddZM/czF66ayr8axnM22OhpJ35X2BaGvLy5DmwD+7jmLw+JYR8/4D+oMQXSJdcuW7Nx1qRBlfcHF6ZI1qMSElt5xKHpJ/RYY7ZDEPCd5vxyA2XNRl8k6+0QJ40BxazQYuRmdFHtj5yBDeAXn9G33ZjVEMw/YJy33EQ7jifMBlszwDbM+dGMT0bDdtS2CTjuTo6pIAaMIYyvliav4CMYkzG/F5SISH4U0OPQX2PcNHP5BuIi5cNO63MW79GTAft96j+h829V74rPBb98ZWAcEwcU/QzbOdlHhw8ZeyKRWGX7NwJyfcS4w7oA/b0WL+MNpC720ZrqFmWArdfkgO8eqdXM2VeAPoO1DbDuC5K+RdBeM/fmz5CmwK+7w6+wqHiul6QmabgWb/7ale7+lG16gR9ZyDEnTyXWo4L4d6w1A/L0oY5XrAeCgFPaDBlP2d4oeKdJeY6/AaKAuM+xBd63DLIe1iKB74XtDf0ZEgLOrgMo5hrrYeCbI81aM0hT5fuF9UUj7IPtX4EPypVydrLepk0wfwHNnRrDzOPhSwAAAABJRU5ErkJggg==>

[image13]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAZCAYAAADTyxWqAAAA9ElEQVR4XmNgGAV0A/Ly8i/RxUgGcnJy/SAaaNh/KN2DqoIEADRMC2jAHyD+B8Q/FIAAXQ3RQEpKSgRoyAeoYS9ERUV50NUQDYAO2QSikby5GlUFAwMLUPAzSAEenIOsAcj/g8yHA6jiKUBbK0BsYLiUA9kTgXgViA0UK0LXgxUAFf4AUswgtqKiojjIAKj4ZCUlJTkUxYQA0AAzGBvoijygYZkgNtCw00CKCa6QVADyIjY2yUBGRoYT3TAVFRV2ZDVEA6Dmq0B8EYkPipRoZDVEA5BmYPjZIfOB+COyGqIAMNDN0cMIyD8PxNeQxUbBKCATAAAANELKNXuhkQAAAABJRU5ErkJggg==>

[image14]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAYCAYAAABOQSt5AAADgUlEQVR4Xu2Yz29MURTH2yJ+E6FGpp150+lE2Vh0hAWC8Ac0Ilj4EbGyYWEhFZFYiLDShIRG/Igg0rD2oxo2IkQTVmrhR0JEIygVkible2bObU+/ffN+zGJmM5/k5s39nnPPPffc997cmbq6GjWqSiaT6WCtEmDeHaxFpqWlxUun0+c9zzuby+XmsT0uiDOQTCYXsV4JsI4s5n/JeiCo3hkM+ofBu6SPgiTQ/4H2l30F+O+BbSPrFsQ6CZ+jrFcS5NmFdoF1PxqkAGj9bBDUNur6WFwe/d9o7bLTuI6kUqmkHaMU4rJYDSLloQv9xboDCz8oPrhusjq0QbS3VrNgF+7LbrBeDZDnNS/oEYHxY1i1sJglWqwe6eORWYHPo2jtcieIrampaSGP07hTWa8G2Wx2fsl1YoHrdYEP2cao3zer4Q7ZjUKss5pDX1L+ExuQw1743YD/WrZFBWO3IUZ3W1vbXLZZJB/flz8MI5psA9ssSLZD/HC9xbZSwP90WCE0ZkY+49KJ/hFyCSSRSMzWDSq8sGWjtH+TfQWdr5N1t8uByQqo+D0Nsp1tpcCYx0GxYetDe2r6Ev+U9QlD87/u+rLbGme19XOo7eoEsbW1dbEG+jPB4EPUglng/0Ea6w7YfkpMFOwyckmxPQyM7eec0N/HmkXW6pniO6boAp+zwYIKLlO/S2wLAv7v0N6z7oBtucZ17Tv7BOHGkSZzBhVCvvJfsO6CjZ0P/PCbMArY6bthsYXm5uYc/D7HnUPzmvAuEE0eY6tZdMwd1sUw5BLAzs9Qxwdo59TeGzdBB+J1lRqr8wyzZvso0Ew5v1jNIv6wrzFS4fCGeTfgc/2kd0Hd2Lz+L2Q19qANGk2O1QNoQ+jWG/fI4Ht7KS/OoYtYYPpS8MIZxfpIw5llldUdar9I/cJ8uHbn8/lp497jPnbeScDhqzihis+84kFJBmx1dhyjZ1n/qGhik76aEXuzm0fbIfaBtgXtk9/OOrziMy95v9L+I839CrmOfdWyHggCv/HMjymveGfExisewU+wHhU5IGFRh1kvh3Tx1/Rt1gPx9O2LNqwVzrNPFOQ5j70LhqC7IS5l5YEEjmshpD1hexwwvg/x9rMehvx2wdhe1ssBG3nMK/fOxG+IlWFn96ggiS+NjY1zWA8Cp8TprJWD/qfymvWqgV3ZyVolwLwHWKtRozT/Ab1aGLlvCASdAAAAAElFTkSuQmCC>