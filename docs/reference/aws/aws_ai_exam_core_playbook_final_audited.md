# AWS Certified Generative AI Developer Professional — Core Exam Playbook

_Final-audited rebuild on 2026-06-24. This version was rechecked again for source-answer integrity, ZIP integrity, ledger table integrity, and known source option/explanation conflicts._

## Source-of-truth policy

- Use these three files as the project study source: this Core Playbook, the Extended Trap Atlas, and the Question Ledger.
- Treat official AWS documentation as the final authority whenever an AWS service capability is new, ambiguous, or evolving.
- Use as active corpus: regenerated Vladimir Raykov Udemy HTML files, Stephane Maarek Udemy files, and the five section-based Tutorials Dojo files.
- Do **not** use the older Tutorials Dojo review-mode files as preferred sources: `review-mode-set-1`, `review-mode-set-2`, `review-mode-bonus-set-3`.
- The Testing/Validation Tutorials Dojo section did not expose source answer markers. Its 9 answers are included as `INFERRED_NOT_SOURCE_CONFIRMED` in the ledger rather than silently treated as source-confirmed.

## Corpus snapshot

| Metric | Count |
| --- | ---: |
| Active questions parsed | 482 |
| Source-confirmed answer keys present | 473 |
| Inferred answers where source key was missing | 9 |
| Source option/explanation mismatch retained with warning | 1 |
| Unresolved answer keys | 0 |
| Answer-count mismatches after final audit | 0 |
| Duplicate question groups | 3 |

| Source file | Questions | Source-confirmed | Inferred/not source-confirmed | Source type |
| --- | ---: | ---: | ---: | --- |
| Vladimir Raykov-1.md | 85 | 85 | 0 | Udemy HTML-regenerated |
| Vladimir Raykov-2.md | 78 | 78 | 0 | Udemy HTML-regenerated |
| Vladimir Raykov-3.md | 75 | 75 | 0 | Udemy HTML-regenerated |
| Vladimir Raykov-4.md | 75 | 75 | 0 | Udemy HTML-regenerated |
| Stephane Maarek-1.md | 25 | 25 | 0 | Udemy best-effort |
| Stephane Maarek-2.md | 75 | 75 | 0 | Udemy best-effort |
| ai-safety-security-and-governance.md | 15 | 15 | 0 | Tutorials Dojo section-based |
| foundation-model-integration-data-management-and-compliance.md | 15 | 15 | 0 | Tutorials Dojo section-based |
| implementation-and-integration.md | 15 | 15 | 0 | Tutorials Dojo section-based |
| operational-efficiency-and-optimization-for-generative-ai-applications.md | 15 | 15 | 0 | Tutorials Dojo section-based |
| testing-validation-and-troubleshooting.md | 9 | 0 | 9 | Tutorials Dojo section-based (source answers missing) |

## Known source-level warning

There is one retained source-answer warning:

| Source | Q | Issue | Study correction |
| --- | ---: | --- | --- |
| Vladimir Raykov-3.md | 1 | The source answer label is A, but option A says `ColumnValues "review_text" != NULL`; the explanation says the intended rule is `ColumnLength "review_text" > 0`. | Keep answer label A for the exam file, but study the concept as: use AWS Glue Data Quality in the ETL job with an empty-string-aware rule such as `ColumnLength "review_text" > 0`, so the ETL job fails before training. |

Why this matters: `ColumnValues ... != NULL` only checks nullness. AWS Glue DQDL distinguishes `NULL`, `EMPTY`, and `WHITESPACES_ONLY`; `IsComplete` checks non-null values only. For empty strings in CSV-style text columns, use an empty-aware rule rather than relying only on non-null completeness.

## Domain coverage

| Domain | Question count |
| --- | ---: |
| Foundation Model Integration, Data Management, and Compliance | 158 |
| Implementation and Integration | 127 |
| AI Safety, Security, and Governance | 77 |
| Testing, Validation, and Troubleshooting | 57 |
| Operational Efficiency and Optimization | 43 |
| Operational Efficiency and Optimization for Generative AI Applications | 15 |
| Uncategorised | 5 |

## Live-answering contract

Use this format for each practice question:

```markdown
Question <number if known>
Select count: <1 / 2 / 3 / unknown>
Answer: <letters only>
Confidence: <High / Medium / Low>

Reasoning:
- Requirement lock: <hard constraints that decide the answer>
- Why selected option(s) fit: <service capability + requirement mapping>
- Why tempting wrong options are wrong: <boundary, missing constraint, or over-engineering>

Exam trap:
<one concise trap/reminder>

Verification note:
<only if the question involves evolving AWS capabilities, ambiguous wording, or a source-answer issue>
```

## Answer discipline rules

1. Obey the Select/Choose count before trusting the answer key.
2. Reason from the hard requirement first: latency, data residency, no retraining, no code redeploy, no public internet, real-time vs batch, human approval, or least operational overhead.
3. Treat `INFERRED_NOT_SOURCE_CONFIRMED` rows as useful but lower-trust than `SOURCE_CONFIRMED` rows.
4. Do not shortcut from service names. A service can be valid generally but wrong for the hard constraint.
5. Prefer managed/native capabilities when the question says least operational overhead.
6. Flag internal inconsistency if selected option text, explanation, and AWS capability disagree.
7. For `SOURCE_OPTION_EXPLANATION_MISMATCH`, use the corrected concept in the ledger note, not the raw option wording.

## First-pass verification mode

Verify before finalising if the question involves:

- Amazon Bedrock AgentCore Runtime, Identity, Gateway, Memory, Browser, Code Interpreter, or MCP behavior.
- Amazon Q Business trusted identity propagation, `CreateTokenWithIAM`, `sts:identity_context`, or CloudTrail `OnBehalfOf`.
- Bedrock Guardrails request parameters, tracing, contextual grounding, prompt attack filters, or cross-Region guardrail profiles.
- Bedrock Prompt Management, Prompt Flows, Data Automation, Inline Agents, model import, or inference profiles.
- SageMaker endpoint limits, async/serverless/realtime limits, deployment guardrails, Model Monitor, Clarify, and AMT warm start/early stopping.
- Any row marked `INFERRED_NOT_SOURCE_CONFIRMED` or any possible source-answer mismatch.

## Official verification anchors

| Topic | Official AWS documentation |
| --- | --- |
| SageMaker production variants / A-B testing | https://docs.aws.amazon.com/sagemaker/latest/dg/model-ab-testing.html |
| SageMaker shadow testing | https://docs.aws.amazon.com/sagemaker/latest/dg/model-shadow-deployment.html |
| SageMaker Model Monitor | https://docs.aws.amazon.com/sagemaker/latest/dg/model-monitor.html |
| SageMaker Model Monitor baseline | https://docs.aws.amazon.com/sagemaker/latest/dg/model-monitor-create-baseline.html |
| SageMaker XGBoost hyperparameters | https://docs.aws.amazon.com/sagemaker/latest/dg/xgboost_hyperparameters.html |
| Amazon Lex custom slot value synonyms | https://docs.aws.amazon.com/lexv2/latest/dg/guidelines.html |
| Amazon Managed Grafana with CloudWatch | https://docs.aws.amazon.com/grafana/latest/userguide/using-amazon-cloudwatch-in-AMG.html |
| Amazon Managed Grafana with X-Ray | https://docs.aws.amazon.com/grafana/latest/userguide/x-ray-data-source.html |
| Bedrock model evaluation jobs | https://docs.aws.amazon.com/bedrock/latest/userguide/model-evaluation-jobs-management-create.html |
| Bedrock RAG evaluation metrics | https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-evaluation-metrics.html |
| Bedrock LLM-as-judge evaluation | https://docs.aws.amazon.com/bedrock/latest/userguide/evaluation-judge.html |
| Bedrock Knowledge Bases | https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html |
| Bedrock Guardrails | https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html |
| Bedrock Prompt Management | https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-management.html |
| Bedrock Data Automation | https://docs.aws.amazon.com/bedrock/latest/userguide/bda.html |
| AgentCore Gateway | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html |
| AgentCore Identity | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-getting-started.html |
| AgentCore Runtime | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html |
| SageMaker async inference | https://docs.aws.amazon.com/sagemaker/latest/dg/async-inference.html |
| SageMaker serverless endpoints | https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html |
| SageMaker Clarify feature attribution drift | https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-model-monitor-feature-attribution-drift.html |
| Amazon Comprehend toxicity detection | https://docs.aws.amazon.com/comprehend/latest/dg/trust-safety.html |
| Amazon Transcribe custom vocabulary | https://docs.aws.amazon.com/transcribe/latest/dg/custom-vocabulary.html |
| AWS AppConfig feature flags | https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-configuration-and-profile-feature-flags.html |

## High-yield service boundaries

| Service/pattern | Use when | Exam trap |
| --- | --- | --- |
| Amazon Q Business | Ready enterprise assistant over connectors, ACLs, identity-aware enterprise search with generated answers/citations. | Do not choose Bedrock KB if the requirement is ready-to-use employee assistant with connectors and minimal app build. |
| Amazon Kendra | Managed enterprise semantic/search ranking and S3/connectors; returns search results/answers. | Do not treat Kendra as a vector database you manage or as full Q Business conversational app. |
| Bedrock Knowledge Bases | Managed RAG: ingest, chunk, embed, retrieve, and ground model responses in private data. | Do not choose fine-tuning for frequently changing factual knowledge. |
| OpenSearch vector search | Custom/high-control vector retrieval, hybrid BM25 + vector search, sharding/index sizing. | Higher ops than KB/Kendra; choose only when custom vector infra/control is required. |
| Bedrock Agents | Plans and invokes tools/action groups/APIs to complete multi-step tasks. | Not for simple static retrieval only. |
| Prompt Flows | Visual/low-code sequential GenAI workflows. | Not autonomous dynamic tool planning. |
| Prompt Management | Version, test, share, and alias prompts outside app code. | Not multi-step orchestration. |
| Guardrails | Prevent/filter/trace GenAI safety issues at inference. | Not a replacement for IAM/network/data-layer security. |
| SageMaker async endpoint | Large payload/long-running near-real-time inference; queues requests and can scale to zero. | Not for immediate sub-second user response. |
| SageMaker serverless endpoint | Low-ops real-time endpoint for intermittent traffic and cold-start tolerance. | Memory/model size and concurrency limits matter. |
| SageMaker multi-variant endpoint | A/B test multiple variants behind one endpoint with traffic weights. | Shadow testing mirrors traffic but does not affect live predictions. |
| SageMaker shadow testing | Mirror live traffic to a candidate model without returning candidate responses to users. | Use when the requirement says real traffic but no production impact. |
| Model Monitor baseline | Compare captured endpoint/batch data against baseline constraints/statistics and publish violations. | Refresh the baseline after a valid representative retrain; do not just silence thresholds. |
