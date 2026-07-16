# AWS AI Developer Exam — Extended Trap Atlas

_Quality-audited rebuild on 2026-06-24. Use this as a service-boundary revision map, not as a substitute for the question ledger._

## Quality note

- The atlas is intentionally thematic. It captures repeated AWS exam traps and service boundaries across the corpus.
- The question ledger is the traceability file for question number, source, answer label, and answer status.
- The 9 Testing/Validation Tutorials Dojo questions had no source answer markers, so their answers are inferred and flagged in the ledger.

## Inferred answers for source-missing Testing/Validation section

| Q | Inferred answer | Why |
| ---: | --- | --- |
| 1 | D | SageMaker multi-variant endpoints are the native A/B mechanism for routing live traffic across variants behind one endpoint and shifting all traffic to the winner. |
| 2 | D | Bedrock/RAG evaluation plus LLM-as-judge and targeted human review best matches hallucination, retrieval accuracy, and reduced manual review. |
| 3 | B | Model Monitor with data capture, a baseline, monitoring schedule, and CloudWatch violations is the managed data-drift answer. |
| 4 | A | Lex custom slot value synonyms map phrases like 'thrill-seeking' to existing enum values without Lambda or database changes. |
| 5 | B | For XGBoost overfitting, decreasing max_depth limits tree complexity and improves generalisation. |
| 6 | A | Amazon Managed Grafana can correlate CloudWatch metrics and X-Ray traces in shared dashboards with alerting and stakeholder access. |
| 7 | C | If the new production traffic is representative but Model Monitor still violates, the stale baseline should be recalculated from the new training/current data. |
| 8 | D | Parallel Bedrock model evaluation jobs with similarity/hallucination thresholds provide the CI/CD quality gate for multilingual consistency. |
| 9 | D | Shadow testing mirrors real production traffic to a new model without affecting current production responses. |

## How to use this atlas

For each question, identify the hard constraint first, then map it to the service boundary below. The wrong answers are usually plausible AWS services that fail one requirement: latency, data residency, answer-count, operational overhead, governance, or integration model.

## Corpus signal map

| Repeated service/pattern | Corpus mentions |
| --- | --- |
| Event-driven/serverless | 150 |
| Bedrock Knowledge Bases | 113 |
| IAM/Organizations/security | 105 |
| OpenSearch/vector search | 101 |
| Amazon Comprehend/Medical | 87 |
| Bedrock Guardrails | 44 |
| Bedrock Runtime/API | 42 |
| Bedrock Evaluation | 41 |
| SageMaker endpoints/deployment | 39 |
| Bedrock Agents | 33 |
| SageMaker training/data | 32 |
| Bedrock Prompt Management | 30 |
| SageMaker Clarify/Model Monitor | 30 |
| Textract/Rekognition | 18 |
| Amazon Transcribe/Translate/Polly/Lex | 17 |
| Amazon Q Business/Developer | 14 |
| AgentCore | 14 |
| Bedrock Prompt Flows/Flows | 13 |
| SageMaker Autopilot/JumpStart/Canvas | 10 |
| Edge/hybrid | 6 |



## 1. Enterprise retrieval and RAG boundaries

| Boundary | Correct mental model | Common trap |
| --- | --- | --- |
| Q Business vs Kendra vs Bedrock KB vs OpenSearch | Q Business = ready enterprise assistant with connectors/ACLs/citations. Kendra = managed enterprise search. Bedrock KB = managed RAG building block. OpenSearch = vector/search infrastructure you manage/tune. | Do not pick OpenSearch/Kendra just because the word semantic search appears; check whether the requirement is ready assistant, managed RAG, or custom vector control. |
| RAG vs fine-tuning | Use RAG/KB when private facts change or must be cited. Fine-tuning changes style/behavior/domain patterns but does not keep daily facts fresh. | “Without retraining” almost always eliminates fine-tuning. |
| Hybrid search and chunking | Exact identifiers, part numbers, and values often require hybrid BM25 + vector search and better chunking/overlap. | Increasing Top-K alone adds noise/cost and may not fix ranking. |
| Metadata filtering | Explicit attributes such as date, owner, jurisdiction, product, or classification should be stored as metadata and filtered before generation. | Do not bury metadata only inside embeddings and expect the model to infer filters reliably. |


## 2. Agents, tools, MCP, Prompt Flows, Prompt Management

| Boundary | Correct mental model | Common trap |
| --- | --- | --- |
| Agents/action groups | Use agents when the model must reason, decide tool/API order, call APIs, and combine results. | Knowledge Bases retrieve; they do not execute business actions. |
| AgentCore Gateway/MCP | Gateway/MCP standardizes tool discovery, schema, and execution across tools. Lambda fits lightweight/stateless tools; ECS/Fargate fits heavy/persistent tools. | Do not add a custom registry/router when the protocol/service provides discovery. |
| Inline agents | Use `InvokeInlineAgent` when action groups/KBs/instructions are determined at request time. Session ID and encryption/session initialization must remain stable within a conversation. | Traditional prepared agents are poor fit for many runtime combinations. |
| Prompt Flows | Use for visual, sequential, low-code prompt workflows where outputs feed later steps. | Prompt Flows are not the same as autonomous agent reasoning unless tool/Lambda nodes enforce steps. |
| Prompt Management | Use for versioning, testing, sharing, and aliasing prompts so app code does not redeploy for prompt changes. | S3/Parameter Store can store text but lacks prompt-native lifecycle/version/alias controls. |


## 3. Safety, governance, identity, and data protection

| Boundary | Correct mental model | Common trap |
| --- | --- | --- |
| Guardrails | Use for content filters, denied topics, PII masking, contextual grounding, prompt attack mitigation, and inference-time policy enforcement. | CloudTrail logs API calls; it does not give detailed guardrail intervention traces. |
| SCP + permissions boundaries | SCPs set account/OU maximum permissions. Permissions boundaries cap IAM identities. Bedrock model access is identity/SCP-based; many FM resources do not support resource policies. | SCPs do not grant access; they only restrict. |
| PII/PHI choices | Comprehend detects/redacts general PII; Comprehend Medical detects PHI and clinical entities; Macie discovers sensitive data in S3. | Macie is not the right inference-time redaction tool. |
| Network isolation vs VPC endpoints | Network isolation blocks container network egress. VPC endpoints/PrivateLink keep service traffic private. NAT/IGW provide internet path. | A VPC alone is not the strongest anti-exfiltration answer. |
| Notebook presigned URLs | Restrict `CreatePresignedNotebookInstanceUrl`/notebook access with IAM conditions such as `aws:SourceIp`, `aws:SourceVpc`, or `aws:SourceVpce`. | Security groups alone do not stop users generating presigned notebook URLs via public API paths. |
| IAM Roles Anywhere | Use X.509 certificates and trust anchors for on-premises servers to obtain temporary AWS credentials. | AD Connector is for directory integration, not headless programmatic STS credentials. |


## 4. SageMaker inference and deployment choices

| Boundary | Correct mental model | Common trap |
| --- | --- | --- |
| Real-time endpoint | Persistent low-latency endpoint for online inference and sustained traffic. | Real-time limits are wrong for very long-running jobs. |
| Async endpoint | Queues requests; good for large payloads and long processing, near-real-time, scale-to-zero economics. | Not for immediate sub-second response. |
| Serverless endpoint | Minimal infrastructure management for intermittent real-time workloads that tolerate cold starts and fit memory/concurrency limits. | Do not use async for immediate fraud-decision APIs when serverless real-time fits. |
| Batch Transform | Offline/batch inference when no persistent endpoint is needed. | Batch is wrong for synchronous customer-facing chat/fraud flows. |
| Multi-variant endpoint | Use `ProductionVariant`/weights for A/B live traffic behind one endpoint without client changes. | Separate endpoints/API Gateway add overhead and client-routing complexity. |
| Shadow testing | Mirrors production traffic to a candidate model without affecting live predictions. | It validates under real traffic but does not perform controlled rollout. |
| Blue/green canary | Safe rollout and automatic rollback for production model updates. | Offline validation alone cannot catch live latency/failure spikes. |


## 5. Evaluation, testing, monitoring, and troubleshooting

| Boundary | Correct mental model | Common trap |
| --- | --- | --- |
| Golden dataset/regression tests | Use curated prompts/questions with expected answers/labels to detect prompt/RAG/model regressions before deploy. | A CloudWatch alarm after deploy is not a CI/CD quality gate. |
| RAG evaluation | Evaluate retrieval separately from generation; use F1/precision/recall/faithfulness/hallucination metrics depending on the target. | Do not score generated text when the requirement is retrieval quality unless generation is the explicit target. |
| Model Monitor baseline | Create a training/current baseline, capture production data, schedule monitoring, publish violations to CloudWatch. Refresh baseline after valid retraining/distribution changes. | Persistent false violations after a representative new dataset usually mean stale baseline. |
| Clarify/ModelExplainabilityMonitor | Use SHAP/attribution monitoring for feature importance drift; use Clarify for bias/explainability. | ModelQualityMonitor watches metrics like accuracy/recall, not feature attribution itself. |
| A/B vs shadow vs canary | A/B compares live variants. Shadow observes candidate output without user impact. Canary shifts a small percentage for safe rollout. | Pick based on whether live predictions can be affected. |


## 6. Data preparation, ML quality, and classical AI services

| Boundary | Correct mental model | Common trap |
| --- | --- | --- |
| Class imbalance | Fraud/rare-event false negatives with high overall accuracy indicate imbalance; use SMOTE/oversampling/class weights and evaluate recall/FN. | Accuracy can be misleading on rare classes. |
| Overfitting/generalization | Training loss down + validation poor = overfitting; use augmentation, regularization, smaller trees/depth, early stopping. | More epochs/deeper trees usually worsen overfitting. |
| Glue Data Quality | Use for automated data-quality checks before training/RAG ingestion, especially missing/empty/invalid fields. | CloudWatch alarms alone are reactive and can race with pipeline execution. |
| FSx for Lustre + S3 | Use for high-throughput parallel reads from large S3 datasets during SageMaker training. | S3 Transfer Acceleration is not the fix for same-region sequential training bottlenecks. |
| Transcribe/Translate/Comprehend | Transcribe = audio to text; custom vocabulary = domain term recognition; Translate = translation; Comprehend topic detection = unsupervised topic clusters. | Lex is for conversational intents/slots, not broad transcription or summarization. |


## 7. Operational efficiency and cost

| Boundary | Correct mental model | Common trap |
| --- | --- | --- |
| Context pruning | Remove irrelevant input before expensive model calls to reduce token cost and latency. | Limiting `max_tokens` only reduces output tokens; it does not fix huge input cost. |
| Prompt caching | Use when the same large prefix/context is reused across many requests within the cache window. | It does not help one-off unique documents much. |
| Model routing | Use AppConfig/feature flags or prompt/model routing to choose cheaper/faster models for simple requests and stronger models for complex ones. | Hardcoded env vars or CloudFormation parameter updates are not instant runtime controls. |
| Provisioned Throughput | Use for predictable reserved Bedrock capacity/throughput. | It does not inherently improve per-request reasoning quality, reduce input tokens, or increase memory per execution. |
| Cross-Region inference profiles | Use for on-demand Bedrock capacity/resilience across Regions. | Not a strict data-residency solution because requests may be routed across Regions. |


## 8. Edge, hybrid, and event-driven architecture

| Boundary | Correct mental model | Common trap |
| --- | --- | --- |
| Outposts vs Local Zones vs Wavelength | Outposts = AWS infrastructure on-prem for strict local processing; Local Zones = metro low latency; Wavelength = 5G/mobile edge. | Low latency does not automatically satisfy local data residency. |
| API Gateway + EventBridge | Best for webhooks needing immediate acknowledgement while GenAI processing continues asynchronously. | Async Lambda via proxy integration can produce status/response-shape traps. |
| SQS buffering | Use SQS between bursty event sources and Bedrock/Lambda processing to absorb spikes and control downstream rate. | SNS/direct Lambda fanout lacks durable rate control for throttling protection. |
| Step Functions human approval | Use callback/task-token pattern to pause workflow for human review and resume with audit trail. | Polling DynamoDB with EventBridge is custom orchestration overhead. |


## Verification checklist for suspicious questions

- Is the Select/Choose count explicit and does the key match it?
- Does the explanation describe a different option than the selected letter?
- Is the service capability current/evolving, especially AgentCore, Q Business identity propagation, Bedrock Guardrails, Prompt Management, BDA, or SageMaker endpoint limits?
- Is the correct answer relying on “least operational overhead”? If yes, eliminate custom code unless the managed service cannot meet the hard constraint.
- Is the question asking for prevention or detection? Preventive controls usually beat CloudWatch/Config-style detective controls.

## Official docs to check first

| Topic | Official AWS documentation |
| --- | --- |
| Bedrock Knowledge Bases | https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html |
| Bedrock Guardrails | https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html |
| Bedrock prompt attack filtering | https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-prompt-attack.html |
| Bedrock Prompt Management | https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-management.html |
| Bedrock inference profiles | https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-use.html |
| Bedrock Data Automation | https://docs.aws.amazon.com/bedrock/latest/userguide/bda.html |
| AgentCore Gateway | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html |
| AgentCore Identity | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-getting-started.html |
| AgentCore Runtime | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html |
| AgentCore Memory | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html |
| SageMaker inference options | https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model-options.html |
| SageMaker asynchronous inference | https://docs.aws.amazon.com/sagemaker/latest/dg/async-inference.html |
| SageMaker serverless endpoints | https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html |
| SageMaker Model Monitor | https://docs.aws.amazon.com/sagemaker/latest/dg/model-monitor.html |
| SageMaker Clarify feature attribution drift | https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-model-monitor-feature-attribution-drift.html |
| SageMaker AMT warm start | https://docs.aws.amazon.com/sagemaker/latest/dg/automatic-model-tuning-warm-start.html |
| SageMaker AMT early stopping | https://docs.aws.amazon.com/sagemaker/latest/dg/automatic-model-tuning-early-stopping.html |
| OpenSearch vector search | https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vector-search.html |
| Amazon Comprehend toxicity detection | https://docs.aws.amazon.com/comprehend/latest/dg/trust-safety.html |
| Amazon Transcribe custom vocabulary | https://docs.aws.amazon.com/transcribe/latest/dg/custom-vocabulary.html |
| AWS AppConfig feature flags | https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-configuration-and-profile-feature-flags.html |

## Glue Data Quality empty-string trap

| Pattern | Use | Trap |
| --- | --- | --- |
| Glue Data Quality in an ETL gate | Block a bad dataset synchronously before it reaches SageMaker training. | Do not confuse non-null checks with empty-string checks. `IsComplete` checks non-null completeness. AWS Glue DQDL distinguishes `NULL`, `EMPTY`, and `WHITESPACES_ONLY`; for text columns that may contain empty strings, use an empty-aware rule such as `ColumnLength > 0` or explicit `EMPTY` handling. |

Ledger warning: `Vladimir Raykov-3.md Q1` keeps the source answer label A, but the raw option text says `ColumnValues "review_text" != NULL` while the explanation says the intended rule is `ColumnLength "review_text" > 0`. Study the explanation/corrected concept, not the raw option wording.
