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

- [Bikeshare users Prediction](./bike-prediction): In this project, we build an end-to-end demand forecasting workflow from hourly usage data, including feature engineering for seasonality, normalization, and train/validation splits for time-indexed data. The project shows how sequence-aware preprocessing and careful error tracking improve forecast reliability in real operational settings.
- [Image Classification](./image-classification): This project focuses on building a visual classification pipeline using convolutional feature extraction and transfer learning from pre-trained models. We compare baseline and fine-tuned approaches to see how frozen versus trainable layers affect accuracy, generalization, and training cost.
- [Style Transfer with LSTM](./style-transfer-lstm): In this project, we experiment with sequence modeling to capture style patterns and generate outputs that preserve structure while shifting expression. The project highlights representation choices, token-level learning behavior, and how model capacity changes stylistic consistency.
- [TV Script Generation](./script-generation): This project implements a recurrent text-generation workflow, from tokenization and vocabulary mapping to sequence batching and iterative decoding. We use it to understand how RNN/LSTM models learn local context, where they fail, and how tuning sequence length and sampling strategy changes output quality.
- [Language Translation](./language-translation): In this project, we build an encoder-decoder sequence-to-sequence model and evaluate how attention improves translation quality on longer inputs. The project demonstrates practical trade-offs in preprocessing, padding/masking, and inference-time decoding decisions.
- [Face Generation](./face-generation): This project trains a generator-discriminator pair to synthesize realistic faces and examines the stability challenges of adversarial optimization. We use it to learn how architectural choices, normalization, and training balance affect visual fidelity and mode coverage.

## Key knowledge to learn

- Neural network foundations, training dynamics, and practical optimization in [Deep Learning Overview](/ai/dl).
- Sequence modeling with RNNs/LSTMs in [Part 1: Sequence Models](/ai/dl#part-1-sequence-models---recurrent-neural-networks-rnns).
- Embeddings, Seq2Seq, and attention in [Part 2: Word Embeddings](/ai/dl#part-2-representing-words-as-vectors) and [Part 3: Sequence-to-Sequence Models](/ai/dl#part-3-sequence-to-sequence-seq2seq-models).
- Generative models in [Part 4: Generative Models](/ai/dl#part-4-generative-models).
- Modern text-to-image context in [Part 5: The Modern Era](/ai/dl#part-5-the-modern-era---bridging-text-and-pixels).

## Suggested learning flow

1. Start with [Image Classification](./image-classification) and [Deep Learning Overview](/ai/dl) to ground core training concepts.
2. Move to [TV Script Generation](./script-generation) and [Language Translation](./language-translation), then review the RNN/LSTM and Seq2Seq note sections.
3. Finish with [Face Generation](./face-generation), then read the generative-model sections to connect GAN mechanics with implementation decisions.
