---
title: "Sequence Models and Language Representation"
description: "A practical guide to RNNs, LSTMs, GRUs, word embeddings, encoder-decoder models, and attention for sequence and language representation learning."
keywords:
  - recurrent neural network
  - rnn
  - lstm
  - gru
  - word2vec
  - seq2seq
  - attention mechanism
  - language representation
sidebar_position: 2
---

# Sequence Models and Language Representation

This chapter covers the deep-learning territory where order, memory, and alignment matter. Static classification is no longer enough. The task now depends on sequence structure, contextual representation, and models that can preserve information across time rather than treating each input in isolation.

There are two questions underneath the whole chapter.

1. How can data be modeled when order changes the meaning?
2. How can a representation be built that carries context forward instead of discarding it at every step?

Those questions lead to recurrent models, embeddings, encoder-decoder systems, and attention. They look like separate topics at first, but they are connected by one theme: the model needs an internal state or representation that can preserve, compress, and reweight information across a sequence.

## Sequence Models and Recurrent Neural Networks

Feed-forward networks such as MLPs and CNNs treat each input independently. Many real problems do not work that way.

- Text depends on word order.
- Time-series prediction depends on previous values.
- Music depends on temporal progression.

For those problems, a model with memory is needed. That is the role of a Recurrent Neural Network.

### The Core Idea: A Loop for Memory

An RNN feeds its hidden state from one time step into the next. At time step $t$, the hidden state is updated from the current input $x_t$ and the previous hidden state $h_{t-1}$:

$$
h_t = \phi(W_{xh}x_t + W_{hh}h_{t-1} + b_h)
$$

Here, $x_t$ is the input at time step $t$, $h_{t-1}$ is the previous hidden state, $W_{xh}$ and $W_{hh}$ are learned weight matrices, and $b_h$ is a bias vector.

where $\phi$ is usually a nonlinear activation such as $\tanh$.

That recurrence is what gives the model temporal context.

The most useful intuition is that the hidden state is a running summary of everything the model has decided to remember so far. When the network reads a sentence token by token, each update decides how much of the past to keep and how much to overwrite with the new token.

If the phrase is "the movie was not good," the hidden state after "not" should change the interpretation of "good" that comes after it. That is the promise of recurrence: later predictions can depend on earlier context instead of treating each token in isolation.

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

In these equations, $f_t$ is the forget gate, $i_t$ is the input gate, $o_t$ is the output gate, $\tilde{c}_t$ is the candidate cell update, $c_t$ is the cell state, $\sigma$ is the sigmoid gate function, and $\odot$ means elementwise multiplication. The bracketed term $[h_{t-1}, x_t]$ means the previous hidden state and current input are concatenated before the linear transform.

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
| GRU | Simpler than LSTM and often fast to train | Slightly less expressive control than LSTM | Practical compromise when recurrent memory is needed without a heavy cell |

If the goal is only the concept of recurrence, a simple RNN is fine. If long dependencies matter, LSTM is the classical safe choice. If a lighter recurrent model is wanted, GRU is often the first practical compromise.

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

Each word here stands for its learned embedding vector, not for a literal symbolic token. The point of the expression is that semantic relations can become directions in the embedding space.

can emerge from the learned geometry.

That is why embeddings matter. They turn symbolic identity into geometry. Similar words land near each other. Directions in the vector space can encode relationships. Once that happens, the rest of the network can reason over similarity instead of starting from disconnected one-hot IDs.

Embedding size is a trade-off. Smaller embeddings are cheap but may not hold enough semantic structure. Larger embeddings can represent richer nuance but cost more memory and computation. Older pipelines often used dimensions such as $100$ or $300$. Modern pretrained models often use much larger contextual embeddings.

Static embeddings are also not the whole story anymore.

- **Word2Vec** is simple and efficient.
- **GloVe** combines local co-occurrence learning with global corpus statistics.
- **FastText** adds subword structure, which helps with morphology and rare words.

Modern language systems go further with contextual embeddings, where the representation of a word changes with the sentence around it. The transformer-specific depth lives in the LLM section, but conceptually this is the bridge: embeddings stopped being fixed dictionary lookups and became context-sensitive representations.

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

Here, $s_{t-1}$ is the decoder state from the previous output step, $h_s$ is the encoder representation at source position $s$, $e_{t,s}$ is the unnormalized alignment score, $\alpha_{t,s}$ is the normalized attention weight, and $c_t$ is the context vector built for decoder step $t$.

This allows the model to focus on the most relevant parts of the input when producing each output token.

That is the real intuition. Instead of forcing one fixed vector to remember everything, the decoder builds a fresh context vector for each output step. When translating a verb, it can attend to the source verb. When generating a noun phrase, it can shift attention to the source words that matter for that phrase.

This is why attention became such an important bridge technology. It fixed a concrete architectural weakness in encoder-decoder systems before becoming the central idea behind transformer-style self-attention.

### Bidirectional RNNs for Better Context

The meaning of a token often depends on what comes after it as well as what comes before it. A bidirectional encoder processes the sequence in both directions and concatenates the resulting representations. That gives the decoder richer context for each position.

This is why bidirectional encoders became common in sequence labeling and translation encoders. They can read the full input first. Decoders are different because they usually generate left to right and should not see future output tokens directly.

## What This Means in Practice

The practical lesson is that sequence modeling is really a problem of representation under order. Recurrent models make memory explicit, embeddings make symbolic identity geometric, and encoder-decoder systems plus attention make alignment tractable when input and output sequences do not line up cleanly.

These ideas matter beyond older RNN-era architectures. They define the conceptual bridge into modern language systems by explaining why context must be preserved, why word identity must become representation, and why attention became such a central design move.

## What to Read Next

Continue to [Multimodal Representation and Generation](/ai/dl/multimodal-representation-and-generation) if you want to move from sequence memory into latent spaces, image synthesis, and vision-to-language systems.