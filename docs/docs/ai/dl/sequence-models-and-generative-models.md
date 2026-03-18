---
title: "Sequence Models and Generative Models"
description: "A practical guide to RNNs, LSTMs, word embeddings, attention-based Seq2Seq models, GANs, and modern text-to-image systems."
keywords:
  - recurrent neural network
  - rnn
  - lstm
  - word2vec
  - seq2seq
  - attention mechanism
  - gan
  - dcgan
  - diffusion models
sidebar_position: 2
---

# Sequence Models and Generative Models

This chapter covers the deep-learning territory where order, memory, and synthesis matter. Static classification is no longer enough. I now care about sequences, latent structure, and models that can generate plausible new outputs rather than only labeling existing inputs.

There are two big questions underneath the whole chapter.

1. How do I model data where order changes the meaning?
2. How do I build a model that learns not only to recognize data, but to produce new samples from the same underlying distribution?

The first question leads to recurrent models, embeddings, encoder-decoder systems, and attention. The second leads to autoencoders, adversarial training, and diffusion-era generation. They look like separate topics at first, but they are really connected by one theme: the model needs a structured internal representation that can carry information forward, compress it, or sample from it.

## Sequence Models and Recurrent Neural Networks

Feed-forward networks such as MLPs and CNNs treat each input independently. Many real problems do not work that way.

- Text depends on word order.
- Time-series prediction depends on previous values.
- Music depends on temporal progression.

For those problems, I need a model with memory. That is the role of a Recurrent Neural Network.

### The Core Idea: A Loop for Memory

An RNN feeds its hidden state from one time step into the next. At time step $t$, the hidden state is updated from the current input $x_t$ and the previous hidden state $h_{t-1}$:

$$
h_t = \phi(W_{xh}x_t + W_{hh}h_{t-1} + b_h)
$$

where $\phi$ is usually a nonlinear activation such as $\tanh$.

That recurrence is what gives the model temporal context.

The most useful intuition is that the hidden state is a running summary of everything the model has decided to remember so far. When the network reads a sentence token by token, each update decides how much of the past to keep and how much to overwrite with the new token.

If I read the phrase "the movie was not good," the hidden state after "not" should change the interpretation of "good" that comes after it. That is the promise of recurrence: later predictions can depend on earlier context instead of treating each token in isolation.

### The Vanishing Gradient Problem

Simple RNNs are hard to train on long sequences. During backpropagation through time, the gradient has to pass through many repeated steps. If those gradients are consistently smaller than $1$, the signal shrinks exponentially.

The result is the vanishing gradient problem. In practice, the model struggles to learn long-range dependencies.

That is easier to see with a toy calculation. If the backward signal is multiplied by $0.9$ at each step, then after $10$ time steps the signal is roughly $0.9^{10} \approx 0.35$. After $50$ steps it is about $0.005$. At that point, early tokens barely influence the update at all.

This is why simple RNNs often learn short local patterns but struggle with long dependencies such as subject-verb agreement across many words or delayed effects in time series.

### Solution: Long Short-Term Memory

LSTMs introduce a dedicated cell state and gates that regulate what gets forgotten, written, and exposed.

The main equations are:

$$
f_t = \sigma(W_f [h_{t-1}, x_t] + b_f)
$$

$$
i_t = \sigma(W_i [h_{t-1}, x_t] + b_i)
$$

$$
\tilde{c}_t = \tanh(W_c [h_{t-1}, x_t] + b_c)
$$

$$
c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t
$$

$$
o_t = \sigma(W_o [h_{t-1}, x_t] + b_o)
$$

$$
h_t = o_t \odot \tanh(c_t)
$$

This structure lets the model keep important information over long horizons and discard irrelevant details more deliberately than a simple RNN.

The gates are easier to understand conceptually than algebraically.

- The **forget gate** decides what old memory to keep.
- The **input gate** decides what new information to write.
- The **output gate** decides what part of the memory becomes visible to the next layer or time step.

The important structural change is the cell state $c_t$. Unlike a plain RNN hidden state, it can carry information forward through more additive updates, which makes it much less fragile under repeated multiplication during backpropagation.

### RNN vs. LSTM vs. GRU

LSTMs are not the only answer. GRUs simplify the gating structure and often perform competitively with fewer parameters.

| Model | Strength | Weakness | Good default use |
| --- | --- | --- | --- |
| Simple RNN | Small and conceptually clean | Weak on long dependencies | Very short sequences or teaching the recurrence idea |
| LSTM | Strong memory handling, robust on longer sequences | More parameters and more complexity | Sequences where long context matters |
| GRU | Simpler than LSTM and often fast to train | Slightly less expressive control than LSTM | Practical compromise when I want recurrent memory without a heavy cell |

If I just want the concept of recurrence, a simple RNN is fine. If long dependencies matter, LSTM is the classical safe choice. If I want a lighter recurrent model, GRU is often the first thing I would try.

## Representing Words as Vectors

Neural networks do not process words directly. They process numbers.

### One-Hot Encoding

One-hot encoding represents a word as a vector with one entry set to $1$ and the rest set to $0$.

The problem is not just sparsity. It also treats every pair of words as equally unrelated. In one-hot space, `cat` and `dog` are no closer than `cat` and `democracy`.

### Word Embeddings: Word2Vec

Word embeddings replace sparse symbolic identity with dense learned vectors. The key idea is that words used in similar contexts should land near each other in vector space.

Word2Vec learns embeddings through proxy tasks such as:

- **CBOW**, which predicts a word from its context,
- **Skip-Gram**, which predicts surrounding words from one center word.

That is why vector arithmetic like

$$
\text{King} - \text{Man} + \text{Woman} \approx \text{Queen}
$$

can emerge from the learned geometry.

That is why embeddings matter. They turn symbolic identity into geometry. Similar words land near each other. Directions in the vector space can encode relationships. Once that happens, the rest of the network can reason over similarity instead of starting from disconnected one-hot IDs.

Embedding size is a trade-off. Smaller embeddings are cheap but may not hold enough semantic structure. Larger embeddings can represent richer nuance but cost more memory and computation. Older pipelines often used dimensions such as $100$ or $300$. Modern pretrained models often use much larger contextual embeddings.

Static embeddings are also not the whole story anymore.

- **Word2Vec** is simple and efficient.
- **GloVe** combines local co-occurrence learning with global corpus statistics.
- **FastText** adds subword structure, which helps with morphology and rare words.

Modern language systems go further with contextual embeddings, where the representation of a word changes with the sentence around it. I keep the transformer-specific depth in the LLM section, but conceptually this is the bridge: embeddings stopped being fixed dictionary lookups and became context-sensitive representations.

## Sequence-to-Sequence Models

For tasks like translation, summarization, and chat, both input and output are sequences. That is where sequence-to-sequence models become useful.

### The Encoder-Decoder Architecture

The basic Seq2Seq pattern uses two networks.

1. The **encoder** reads the input sequence and compresses it into a context representation.
2. The **decoder** generates the output sequence one step at a time from that representation.

The workflow is easiest to understand in translation.

1. The encoder reads the source sentence and builds internal states.
2. The decoder starts from that encoded context.
3. At each step, it predicts the next output token conditioned on what it has already produced and what it knows about the input.

This pattern matters because input and output can have different lengths, different local structures, and different alignment points. A classifier cannot handle that cleanly. An encoder-decoder model can.

### The Bottleneck Problem and the Attention Mechanism

Compressing an entire sentence into one fixed vector is a bottleneck, especially for long sequences. Attention removes that bottleneck by letting the decoder look back at all encoder states.

For decoder step $t$ and encoder position $s$, the alignment score can be written as:

$$
e_{t,s} = a(s_{t-1}, h_s)
$$

which becomes normalized attention weights:

$$
\alpha_{t,s} = \frac{\exp(e_{t,s})}{\sum_j \exp(e_{t,j})}
$$

The decoder context vector is then:

$$
c_t = \sum_s \alpha_{t,s} h_s
$$

This allows the model to focus on the most relevant parts of the input when producing each output token.

That is the real intuition. Instead of forcing one fixed vector to remember everything, the decoder builds a fresh context vector for each output step. When translating a verb, it can attend to the source verb. When generating a noun phrase, it can shift attention to the source words that matter for that phrase.

This is why attention became such an important bridge technology. It fixed a concrete architectural weakness in encoder-decoder systems before becoming the central idea behind transformer-style self-attention.

### Bidirectional RNNs for Better Context

The meaning of a token often depends on what comes after it as well as what comes before it. A bidirectional encoder processes the sequence in both directions and concatenates the resulting representations. That gives the decoder richer context for each position.

This is why bidirectional encoders became common in sequence labeling and translation encoders. They can read the full input first. Decoders are different because they usually generate left to right and should not see future output tokens directly.

## Generative Models

Generative models are trained to produce plausible new samples, not just classify existing ones.

The main design question changes here. I am no longer only asking where the decision boundary sits. I am asking what the data distribution looks like and how to sample from it without collapsing into noise or memorization.

### Autoencoders: Learning to Reconstruct

An autoencoder has two parts:

1. an encoder that compresses the input into a latent representation,
2. a decoder that reconstructs the original input from that representation.

The training objective is reconstruction quality. Conceptually, autoencoders matter because they show how a model can learn a compact latent space that captures the underlying structure of the data.

That latent space is the real point. If the bottleneck is well chosen, the model is forced to preserve the information that matters most while discarding incidental detail. For continuous data, reconstruction is often optimized with mean squared error. For discrete data, cross-entropy-style losses are often more natural.

Autoencoders are useful for compression, denoising, anomaly detection, and representation learning. They are often the cleanest introduction to the idea that a neural network can learn a compact internal code before it becomes a generator.

### Variational Autoencoders

Plain autoencoders learn a latent code, but that latent space is not guaranteed to be smooth or sample-friendly. Variational Autoencoders fix that by regularizing the latent space so nearby points correspond to meaningful nearby samples.

The practical effect is that VAEs are usually better behaved as generative models than naive autoencoders. They often produce blurrier outputs than GANs, but they make latent-space reasoning and interpolation much cleaner.

### Generative Adversarial Networks

GANs set up a game between two networks.

1. The **generator** maps noise vectors to fake samples.
2. The **discriminator** tries to distinguish real samples from generated ones.

The classic minimax objective is:

$$
\min_G \max_D \; \mathbb{E}_{x \sim p_{data}}[\log D(x)] + \mathbb{E}_{z \sim p_z}[\log(1 - D(G(z)))]
$$

The generator improves by fooling the discriminator. The discriminator improves by spotting the generator's mistakes. That adversarial setup is what makes GAN training powerful and notoriously unstable.

The instability comes from the fact that both players are changing at the same time. If the discriminator becomes too strong, the generator stops receiving useful learning signal. If the generator finds a narrow trick that fools the discriminator, it can collapse onto a small set of repeated outputs, which is the classic mode-collapse failure.

That is why GAN training often needs more care than ordinary supervised learning. Loss curves can oscillate, visual quality can improve while coverage gets worse, and stability tricks such as normalization, architectural constraints, or Wasserstein-style objectives become part of the engineering practice.

### Deep Convolutional GANs

DCGANs adapt the GAN idea to images by using convolutional structure.

- The discriminator behaves like an image classifier.
- The generator uses transposed convolutions or similar upsampling operations to turn a latent vector into an image.

This architectural bias matters for the same reason CNNs matter: images have spatial structure.

DCGANs were important because they showed that generative modeling for images improves once the architecture respects image geometry. They also provided a repeatable recipe: convolutional discriminator, convolutional or transposed-convolutional generator, normalization, and carefully chosen activations. That recipe made GANs far more usable than earlier fully connected versions.

## Bridging Text and Pixels

Modern generative AI connects language models to image generators through a shared semantic space.

### The Bridge: A Shared Embedding Space

Models such as CLIP are trained on image-text pairs so that corresponding images and captions map close together in a learned embedding space. That shared geometry becomes the bridge between language understanding and image synthesis.

### The Modern Text-to-Image Pipeline

The high-level workflow is:

1. encode the prompt into a semantic context vector,
2. condition an image generator on that context,
3. iteratively refine an image toward the requested concept.

The semantic context vector is not magic. In modern systems it often comes from a text encoder that maps the prompt into an embedding space aligned with images. The image generator then uses that conditioning signal, often through attention-like mechanisms, to keep the generated image tied to the requested concept.

This is the point where sequence modeling, embeddings, and generation come back together. Language supplies the condition. The generative model supplies the pixels. The shared representation supplies the bridge.

:::tip GANs vs. Diffusion Models

GANs generate in one forward pass. Diffusion models begin with noise and repeatedly denoise it, with each step conditioned on the text representation. They are slower, but they usually produce more stable and higher-quality outputs, which is why they dominate current text-to-image systems.

:::

### Choosing a Generative Family

| Family | Strength | Weakness | Good default use |
| --- | --- | --- | --- |
| Autoencoder | Learns compact latent structure | Not automatically a strong sampler | Compression, anomaly detection, representation learning |
| VAE | Smooth latent space and stable training | Outputs can look soft or blurry | Latent modeling, interpolation, controllable generation |
| GAN | Sharp samples and strong visual fidelity | Training instability and mode collapse | High-fidelity image generation when stability is manageable |
| Diffusion | Stable modern generation and strong conditioning | Slow iterative sampling | Text-to-image and high-quality controllable generation |

The practical rule is that diffusion is the modern default for high-quality controllable image generation, GANs remain historically important for understanding adversarial generation and sharp sampling, and VAEs remain useful when I care about latent-space structure as much as raw fidelity.

## What This Means in Practice

The practical lesson is that deep learning becomes much more interesting once the task depends on memory, alignment, latent structure, or synthesis. Sequence models let me reason over time. Embeddings let me encode similarity rather than symbolic identity. Generative models let me learn not only decision boundaries but data distributions.

The more durable lesson is that these ideas build on each other. Recurrent models teach me what memory costs. Attention teaches me how to route information dynamically. Autoencoders teach me how to compress structure. GANs and diffusion models teach me that generation quality depends as much on training dynamics and representation design as on the headline objective.

Once those pieces are in place, modern multimodal systems stop looking like magic. They look like layered design decisions about representation, conditioning, memory, and sampling.

## What to Read Next

Return to [Deep Learning Overview](/ai/dl) if you want the section map again, or revisit [Foundations and CNNs](/ai/dl/foundations-and-cnns) if you want the image and representation-learning side before sequence modeling.