---
title: "Deep Learning Showcase Index"
description: "Project index for deep learning showcases, with direct links to demos and the core concepts to study next."
keywords:
  - "deep learning showcase"
  - "cnn"
  - "rnn"
  - "lstm"
  - "word2vec"
  - "gan"
  - "seq2seq"
  - "transfer learning"
sidebar_position: 0
---

This section groups practical deep learning projects and maps each one to the knowledge areas in the learning notes.

## Projects in this section

- [Bikeshare users Prediction](./bike-prediction): In this project, I build an end-to-end demand forecasting workflow from hourly usage data, including feature engineering for seasonality, normalization, and train/validation splits for time-indexed data. The project shows how sequence-aware preprocessing and careful error tracking improve forecast reliability in real operational settings.
- [Image Classification](./image-classification): This project focuses on building a visual classification pipeline using convolutional feature extraction and transfer learning from pre-trained models. I compare baseline and fine-tuned approaches to see how frozen versus trainable layers affect accuracy, generalization, and training cost.
- [Style Transfer with LSTM](./style-transfer-lstm): In this project, I experiment with sequence modeling to capture style patterns and generate outputs that preserve structure while shifting expression. The project highlights representation choices, token-level learning behavior, and how model capacity changes stylistic consistency.
- [TV Script Generation](./script-generation): This project implements a recurrent text-generation workflow, from tokenization and vocabulary mapping to sequence batching and iterative decoding. I use it to understand how RNN/LSTM models learn local context, where they fail, and how tuning sequence length and sampling strategy changes output quality.
- [Language Translation](./language-translation): In this project, I build an encoder-decoder sequence-to-sequence model and evaluate how attention improves translation quality on longer inputs. The project demonstrates practical trade-offs in preprocessing, padding/masking, and inference-time decoding decisions.
- [Face Generation](./face-generation): This project trains a generator-discriminator pair to synthesize realistic faces and examines the stability challenges of adversarial optimization. I use it to learn how architectural choices, normalization, and training balance affect visual fidelity and mode coverage.

## Key knowledge to learn

- Read [AI Prerequisites](/ai/prerequisites) if you want a quick check on the math, Python, and notation assumed by the notes.
- Use [AI Overview](/ai) to see where deep learning sits relative to classical ML and the separate LLM track.
- High-level roadmap in [Deep Learning Overview](/ai/dl).
- Neural network foundations, activation choices, optimization, regularization, CNNs, and transfer learning in [Foundations and CNNs](/ai/dl/foundations-and-cnns).
- Sequence modeling with RNNs, LSTMs, GRUs, and encoder-decoder workflows in [Sequence Models and Generative Models](/ai/dl/sequence-models-and-generative-models).
- Embeddings, attention, autoencoders, VAEs, GANs, and modern text-to-image context in [Sequence Models and Generative Models](/ai/dl/sequence-models-and-generative-models).
- Transformer-heavy language-model material in [LLM Overview](/ai/llm) if you want the modern language-model branch rather than the broader DL track.

## Suggested learning flow

1. Start with [AI Overview](/ai), and use [AI Prerequisites](/ai/prerequisites) if you want the background check first.
2. Ground the basics with [Image Classification](./image-classification) and [Foundations and CNNs](/ai/dl/foundations-and-cnns).
3. Move to [TV Script Generation](./script-generation), [Style Transfer with LSTM](./style-transfer-lstm), and [Language Translation](./language-translation), then review [Sequence Models and Generative Models](/ai/dl/sequence-models-and-generative-models).
4. Finish with [Face Generation](./face-generation), then return to [Sequence Models and Generative Models](/ai/dl/sequence-models-and-generative-models) to connect GAN mechanics with implementation decisions.
5. If your real target is transformer-era language systems, hand off from this section to [LLM Overview](/ai/llm) rather than treating the DL notes as the end of the path.
