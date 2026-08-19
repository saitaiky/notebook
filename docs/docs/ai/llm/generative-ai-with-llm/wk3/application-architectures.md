---
title: Build a LLM application
description: 'The section is to bring together the various components and considerations necessary to build effective LLM-powered applications. The discussion emphasizes that c.'
sidebar_position: 5
keywords:
  - ai
  - llm
  - llm course notes
  - build llm application
  - build
  - application
  - section
  - bring
---

The section is to bring together the various components and considerations necessary to build effective LLM-powered applications. The discussion emphasizes that creating end-to-end solutions involves more than just deploying large language models (LLMs); it requires a comprehensive infrastructure and strategic integration of multiple elements.

## Key Components for LLM-Powered Applications

- **Infrastructure Layer**:
   - **Purpose**: Provides the essential compute, storage, and network resources required to serve LLMs and host application components.
   - **Options**: Can be implemented using on-premises infrastructure or through cloud services that offer on-demand and pay-as-you-go models.
   - **Considerations**: Choose infrastructure based on your specific inference needs, such as whether real-time or near-real-time interaction with the model is required.
- **Large Language Models**:
   - **Model Deployment**: Includes both foundation models and those adapted for specific tasks. These models are deployed on the infrastructure layer to facilitate inference.
   - **External Data Retrieval**: May involve retrieving information from external sources, particularly in retrieval-augmented generation (RAG) scenarios.
   - **Model Output Handling**: Depending on the application, it might be necessary to capture and store outputs, such as storing user completions during a session to supplement the LLM’s fixed context window size.
- **Tools and Frameworks**:
   - **Implementation Aids**: Tools like LangChain provide built-in libraries to implement techniques like PAL, ReAct, or chain-of-thought prompting.
   - **Model Hubs**: These allow for centralized management and sharing of models across applications, streamlining the development process.
- **User Interface and Security**:
   - **User Interface (UI)**: This is the layer where users or other systems interact with the application, typically through a website, REST API, or other interfaces.
   - **Security Components**: Essential for safeguarding the application and ensuring secure interactions with users and external systems.

## High-Level Architecture Stack

![chain-of-thoughts](/img/ai/llm/key-components.jpeg)

Source: [DeepLearning.AI - Learn the fundamentals of generative AI for real-world applications](https://www.deeplearning.ai/courses/generative-ai-with-llms/)

- **Comprehensive View**: The architecture stack highlights that the LLM is just one component in a broader system. The stack includes infrastructure, models, tools, and the user interface, all of which must be carefully integrated to create a robust generative AI application.
- **User Interaction**: Whether the users are human or other systems, they will interact with the entire architecture stack, making it crucial to consider how all components work together.
- **Model Alignment with Human Preferences**: Techniques like Reinforcement Learning with Human Feedback (RLHF) are crucial for aligning models with human values such as helpfulness, harmlessness, and honesty. Existing RL reward models and human alignment datasets can accelerate this process.
- **Model Optimization for Inference**: Strategies like distillation, quantization, and pruning help reduce the size of models, minimizing the hardware resources needed for production deployment.
- **Improving Model Performance in Deployment**: Techniques such as structured prompts and connecting to external data sources enhance the model's effectiveness in real-world applications.

## AWS Jumpstart

SageMaker JumpStart is the AWS service that acts as a model hub for LLM-powered applications — deploying, fine-tuning, and managing foundation models from a catalog that includes Hugging Face models and AWS-native models. For the full service detail (infrastructure, LoRA fine-tuning, cost management, programmatic access), see [Amazon SageMaker: no-code and low-code tooling](/aws/ai/sagemaker#no-code-and-low-code-tooling-sagemaker-canvas-and-jumpstart).
