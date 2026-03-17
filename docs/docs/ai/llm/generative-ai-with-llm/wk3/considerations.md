---
title: Other considerations
description: 'When working with large language models (LLMs), understanding the compute requirements is as crucial as knowing the appropriate model size for your task''s complex.'
sidebar_position: 6
keywords:
  - ai
  - llm
  - llm course notes
  - considerations
  - when
  - working
  - large
  - language
---

## Introduction to Compute Requirements for Model Deployment

When working with large language models (LLMs), understanding the compute requirements is as crucial as knowing the appropriate model size for your task's complexity. The type of hardware you use significantly impacts your ability to run and train these models effectively.

You may have used 70 million parameter models that ran on CPUs. While these models are functional, they are not the most performant. For tasks that demand more efficiency and power, it's advisable to use more robust hardware, such as GPUs, which can handle larger and more complex models.

As an example, a single V100 GPU, which is available on cloud platforms like AWS, comes with 16 gigabytes of memory. This allows it to run a 7 billion parameter model for inference. However, when it comes to training, the memory requirements are much higher due to the need to store gradients and optimizers. In this scenario, the V100 GPU can only support the training of a 1 billion parameter model.

| AWS Instance  | GPUs   | GPU Memory  | Max inference size<br/>(# of params) | Max inference size<br/>(# of tokens) |
|---------------|--------|-------------|-------------------------------------|-------------------------------------|
| p3.2xlarge    | 1 V100 | 16GB        | 7B                                  | 1B                                  |
| p3.8xlarge    | 4 V100 | 64GB        | 7B                                  | 1B                                  |
| p3.16xlarge   | 8 V100 | 128GB       | 7B                                  | 1B                                  |
| p3dn.24xlarge | 8 V100 | 256GB       | 14B                                 | 2B                                  |
| p4d.24xlarge  | 8 A100 | 320GB HBM2  | 18B                                 | 2.5B                                |
| p4de.24xlarge | 8 A100 | 640GB HBM2e | 32B                                 | 5B                                  |

If the memory and compute power of a single V100 GPU are insufficient for your needs, and you wish to work with even larger models, you would need to consider more advanced hardware configurations. 

