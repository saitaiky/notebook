---
title: llama
draft: true
unlisted: true
---

```
├── Makefile
├── README.md
├── app.py
├── cdk.json
├── fastapi_model_serving
│   └── fastapi_model_serving_stack.py
├── model_endpoint
│   ├── docker
│   │   ├── Dockerfile
│   └── runtime
│       ├── chatgpt_api
│       │   ├── chatgpt_wrapper_api.py
│       │   └── requirements.txt
│       └── serving_api
│           ├── custom_lambda_utils
│           │   └── model_artifacts
│           ├── requirements.txt
│           └── serving_api.py
├── package.json
├── requirements-dev.txt
├── requirements.txt
├── scripts
│   └── setup.sh
```