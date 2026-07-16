---
title: AI & Machine Learning
description: Overview of AWS AI/ML services including Bedrock, SageMaker, Q Business, Kendra, Comprehend, Textract, Transcribe, Polly, and Lake Formation with guidance on choosing between them.
keywords:
  - aws
  - amazon web services
  - ai
  - machine learning
  - bedrock
  - sagemaker
  - amazon q
  - kendra
  - comprehend
  - textract
---

## Retrieval and knowledge services: Q Business vs Kendra vs Bedrock Knowledge Bases vs OpenSearch

These four services all answer some version of "let users search or ask questions over my documents," but they sit at different levels of the stack, and the exam leans hard on knowing which one to reach for.

- **Amazon Q Business**: A fully managed, ready-to-use generative AI assistant. Point it at data sources (S3, SharePoint, Confluence, Salesforce, and 40+ connectors) and it handles ingestion, retrieval, and answer generation with citations, with almost no infrastructure to design. Best when the requirement is "give employees a chat assistant over our content" with minimal custom logic.
- **Amazon Kendra**: A managed enterprise search service that returns ranked, relevant results (and can feed those results into your own LLM prompt as the retrieval step of a custom RAG pipeline). Kendra does not generate answers itself unless paired with Amazon Q Business or a model you call yourself. Choose Kendra when you need high-quality semantic search as a building block inside a larger custom application.
- **Bedrock Knowledge Bases**: The RAG layer built into Bedrock. It chunks and embeds your documents, stores vectors (in OpenSearch Serverless, Aurora, Pinecone, Redis, or MongoDB), and exposes a `Retrieve` / `RetrieveAndGenerate` API that Bedrock agents and prompts can call directly. Choose this when you are already building on Bedrock and want retrieval wired directly into a model/agent workflow without standing up your own vector-store integration code.
- **Amazon OpenSearch Service**: The general-purpose search and vector-database engine underneath many of these options. Choose OpenSearch directly only when you need full control over the index, scoring, or vector search parameters, or when you're building a RAG pipeline entirely outside Bedrock/Kendra/Q.

:::tip Exam wording cues
- "Ready-made assistant over enterprise content, minimal setup" → **Q Business**.
- "Enterprise search that plugs into my own application" → **Kendra**.
- "RAG retrieval wired directly into a Bedrock agent or prompt" → **Bedrock Knowledge Bases**.
- "Full control of the vector index / custom RAG pipeline" → **OpenSearch Service**.
:::

One advanced Q Business distinction is **trusted identity propagation**: instead of the application flattening every request down to one service identity, Q Business can preserve the end user's identity when accessing downstream enterprise content, so source-system ACLs still apply. That is where exam terms like `CreateTokenWithIAM`, `sts:identity_context`, and CloudTrail `OnBehalfOf` show up — they are signals that the question is about identity-aware enterprise retrieval rather than generic search.

Q Business connectors don't just move content — they preserve source-system permissions (ACLs) alongside it, so a connector-synced document from SharePoint or Confluence still only surfaces in answers to users who had access to it in the source system. This is what makes Q Business "identity-aware search," not just bulk ingestion, and it's the same mechanism the trusted identity propagation behavior above depends on.

## Perception and language services: Comprehend, Textract, Transcribe, Polly

Beyond generative AI, AWS offers a set of narrow, purpose-built AI services that handle a single perception or language task well, without needing you to train or manage a model.

- **Amazon Comprehend**: Natural language processing for text — entity recognition, key phrase extraction, sentiment analysis, PII detection/redaction, and topic modeling. Comprehend Medical adds clinical entity extraction (medications, diagnoses, dosages) for healthcare text.
- **Amazon Textract**: Extracts text, forms, and tables from scanned documents and images, going beyond plain OCR by understanding document structure (e.g., mapping a form's labels to their values).
- **Amazon Transcribe**: Speech-to-text, with support for speaker diarization, custom vocabularies, and PII redaction in transcripts. Transcribe Medical is tuned for clinical dictation.
- **Amazon Polly**: Text-to-speech, including custom lexicons for pronunciation and SSML for controlling pacing, emphasis, and pauses.

:::tip Pipeline pattern
A common exam scenario chains these together: **Textract** pulls text out of scanned PDFs → **Comprehend** extracts entities/sentiment or redacts PII → the cleaned text feeds a **Bedrock** prompt or a search index. Recognizing this pipeline shape is often enough to answer "which services would you use" questions.
:::

Two specific mechanics show up often enough to be worth naming. **Amazon Lex custom slot value synonyms** let you map phrases like "thrill-seeking" to an existing enum value without touching Lambda or a database — the fix for "the bot doesn't recognize this phrasing" is usually a synonym, not new fulfillment code. **Amazon Transcribe custom vocabulary** improves recognition of domain-specific terms (product names, acronyms, jargon) without retraining a model, which is the detail that separates a plain speech-to-text answer from one that also handles unusual vocabulary correctly.

## Data preparation for AI: Lake Formation and Glue Data Quality

Before any of the above services are useful, the underlying data usually needs to be governed and cleaned — this is where Lake Formation and Glue Data Quality come in.

- **AWS Lake Formation**: Centralizes fine-grained permissions (row, column, and cell-level security) across a data lake, so the same S3-backed tables can be safely shared with Athena, Redshift Spectrum, EMR, and Bedrock/SageMaker training jobs without duplicating access-control logic in each service.
- **AWS Glue Data Quality**: Runs rule-based checks (completeness, uniqueness, referential integrity, custom rules) against data in a Glue Data Catalog, and can automatically recommend rules from a data profile. This matters for AI workloads because model quality is bounded by training/retrieval data quality — Data Quality rules are the mechanism for catching bad data before it reaches a model or knowledge base.

:::info Where this fits
Lake Formation governs **who can see what**; Glue Data Quality governs **whether the data is trustworthy**. Both typically sit upstream of SageMaker training jobs or Bedrock Knowledge Base ingestion.
:::

## Other AI services worth knowing

Several more narrow, purpose-built AI services round out the AWS AI/ML portfolio and show up often enough on the exam to be worth a quick mental model of what each one is actually for, even without a dedicated deep-dive page:

- **Amazon Q Developer**: An AI coding assistant integrated into IDEs and the AWS console — code completion, code review/security scanning, and natural-language-to-infrastructure guidance, distinct from Amazon Q Business's role as an end-user document/knowledge assistant.
- **Amazon Rekognition**: Computer vision for images and video — object/scene detection, facial analysis and comparison, text-in-image extraction, and content moderation, useful anywhere a pipeline needs to understand visual content rather than text.
- **Amazon Translate**: Neural machine translation between languages, commonly chained after Transcribe (speech-to-text) or before Polly (text-to-speech) to build multilingual voice or document pipelines.
- **Amazon Lex**: Builds conversational chatbot interfaces (voice and text) with intent recognition and slot filling, and can be wired to Lambda for fulfillment logic — a narrower, more deterministic alternative to a Bedrock Agent when the conversation flow is a small, well-defined set of intents rather than open-ended reasoning.
- **Amazon Personalize**: Managed recommendation engine (similar to what powers product recommendations or content feeds), trained on user-item interaction history rather than on unstructured text or documents.
- **Amazon Forecast**: Time-series forecasting (demand planning, inventory, capacity), using the same managed-ML-without-training-code philosophy as Personalize, but for numerical time-series data instead of interaction data.

## Where to go deeper

This page is a service-selection map; the mechanics of each service live on their own pages. For generative AI specifically: [Amazon Bedrock](./bedrock.md) covers runtime APIs, Guardrails, Agents, and AgentCore; [RAG & Vector Stores](./rag-and-vector-stores.md) covers chunking, embeddings, and vector-store selection; [Prompt Engineering](./prompt-engineering.md) covers prompting technique; and [Model Evaluation & Agentic Techniques](./evaluation-and-agents.md) covers evaluation methodology and multi-agent orchestration. For classical ML, see [Amazon SageMaker](./sagemaker.md). For securing and governing any of the above, see [Responsible AI & Security](./responsible-ai-and-security.md), and for wiring these services into a larger system, see [Event-Driven AI Architectures](./event-driven-architectures.md).
