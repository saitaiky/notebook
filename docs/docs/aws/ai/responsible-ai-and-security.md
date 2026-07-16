---
title: Responsible AI & Security
description: Securing and governing AI workloads on AWS — IAM for Bedrock/SageMaker, SCPs vs permissions boundaries, network isolation, PII/PHI protection, data governance, encryption, bias/fairness, cost optimization, and data residency.
keywords:
  - aws
  - amazon web services
  - responsible ai
  - bedrock security
  - sagemaker security
  - pii detection
  - lake formation
  - ai governance
sidebar_position: 6
---

Generative AI workloads introduce a governance surface that ordinary application security doesn't fully cover: model access itself needs to be restricted, prompts and responses can carry sensitive data that never touches a traditional database, and "why did the model produce this" needs its own audit trail separate from "who called this API." This page works through IAM/network controls, PII handling, data governance, and cost/fairness concerns specific to Bedrock and SageMaker workloads.

## IAM for Bedrock and SageMaker

Model invocation is authorized the same way as any other AWS API call, but a few Bedrock- and SageMaker-specific details show up repeatedly in practice:

- **Model-scoped invocation permissions**: `bedrock:InvokeModel` and `bedrock:InvokeModelWithResponseStream` can be scoped to specific model ARNs in an IAM policy, so a role can be restricted to only the approved model family/version rather than "any model in the account."
- **Mandatory guardrail enforcement**: The `bedrock:GuardrailIdentifier` IAM condition key can require that any `InvokeModel` call specify an approved guardrail ID, turning guardrail usage from a convention into an enforced policy — a call without a guardrail attached is simply denied.
- **SageMaker presigned notebook URLs**: `sagemaker:CreatePresignedNotebookInstanceUrl` generates a temporary, public URL to a notebook instance. Restricting *who* can call that API is necessary but not sufficient on its own — the resulting presigned URL is accessed over the public internet, so it bypasses VPC security groups entirely. Locking this down properly means combining IAM conditions (restricting source IP or requiring specific VPC endpoints) with the API-level permission, not relying on network controls alone.
- **Hybrid/on-premises access**: When an on-premises server needs temporary AWS credentials to call Bedrock or reach private AWS APIs without storing long-lived access keys locally, **IAM Roles Anywhere** is the fit. It uses X.509 certificates plus a trust anchor to exchange the on-premises workload's certificate for temporary IAM credentials, and is commonly paired with Direct Connect plus an interface VPC endpoint when the requirement is private connectivity into Bedrock from a datacenter environment.

### Service Control Policies vs. Permissions Boundaries

Both of these are frequently confused because they sound like the same kind of guardrail, but they operate at different scopes and neither one *grants* anything by itself:

- **Service Control Policies (SCPs)** set the maximum permissions available to every account (or every identity) within an AWS Organizations OU — they're a ceiling, not a grant. An SCP can restrict `bedrock:InvokeModel` to specific Regions or specific models account-wide, but an SCP allowing an action does nothing on its own; the account still needs an IAM policy that actually grants it.
- **Permissions boundaries** cap what a *specific IAM identity* (a user or role) can do, independent of SCPs, and are typically used to limit what a delegated administrator can grant to the roles they create.

:::danger Exam trap
Neither SCPs nor permissions boundaries grant access — both are restrictions layered on top of whatever an identity-based (or resource-based) policy already grants. For an action to succeed, the IAM policy, the SCP, and any permissions boundary must **all** allow it; any one of them denying or simply not covering the action blocks the call.
:::

If the exam scenario says an on-premises server must authenticate to AWS programmatically with certificate-based trust and temporary credentials, that wording points to **IAM Roles Anywhere**, not directory-integration services like AD Connector.

## Network isolation: VPC endpoints and SageMaker network isolation

Keeping Bedrock and SageMaker traffic off the public internet involves two related but distinct controls, and using only one of them leaves a gap:

- **VPC endpoints (AWS PrivateLink)**: Interface VPC endpoints for Bedrock, SageMaker, and Glue let traffic reach these services without transiting the public internet, with an endpoint policy restricting which principals/actions are allowed through the endpoint and security groups controlling which resources can reach it.
- **SageMaker network isolation**: Setting `EnableNetworkIsolation=true` on a training or processing job blocks the job's container from making *any* outbound network call, except the one needed to pull its own container image from ECR. This is a meaningfully stronger control than a VPC endpoint alone, because a VPC endpoint controls how traffic reaches AWS services — it doesn't stop a compromised or malicious training script from trying to exfiltrate data to an arbitrary external endpoint. Network isolation is what actually closes that egress path.

:::warning Exam trap
A VPC endpoint by itself is not the strongest anti-exfiltration control available — it privatizes *legitimate* traffic to AWS services, but a training container can still attempt outbound calls elsewhere unless network isolation is also enabled. For scenarios explicitly worried about data exfiltration from a training job, the answer usually needs both controls together, not just a VPC endpoint.
:::

## PII and PHI: detection, redaction, and the wrong tool for the job

Several services touch sensitive data in an AI pipeline, and the exam leans heavily on knowing which one applies at which stage:

- **Amazon Comprehend**: Detects general PII (emails, phone numbers, credit card numbers, SSNs, addresses) in text, suitable for pre-screening user input or redacting PII before it reaches a model or a log.
- **Amazon Comprehend Medical**: A separate, specialized service for detecting PHI (Protected Health Information) — clinical entities, diagnoses, medications, dosages — that Comprehend's general PII detection is not tuned to catch reliably.
- **Amazon Macie**: Discovers sensitive data (PII, PHI, financial information) already sitting in S3, using ML-based pattern matching across buckets. This is bulk, at-rest **discovery**, not inference-time redaction — Macie tells you sensitive data exists somewhere in a bucket, it doesn't intercept and redact a live prompt before it reaches a model.
- **Bedrock Guardrails' PII filter**: Redacts or blocks sensitive data in prompts and responses at inference time, which is the actual mechanism for "don't let PII reach the model" or "don't let PII appear in the response," as distinct from Macie's after-the-fact bucket scanning.
- **AWS Glue Sensitive Data Detection transform**: Applies similar redaction logic during an ETL job, useful for cleaning a dataset in the pipeline before it's used for training or Knowledge Base ingestion, rather than at the point of a live model call.

:::danger Exam trap
Macie is for S3 discovery, not real-time redaction — a requirement to prevent PII from reaching a model in the first place needs Comprehend (to detect it) or Guardrails' PII filter (to redact/block it) at inference time, not Macie.
:::

## Data governance: Lake Formation, the Data Catalog, and audit logging

Once data is flowing into training jobs and Knowledge Bases, governing *who can see what* and *what happened when* becomes its own discipline:

- **AWS Lake Formation**: Replaces the native Glue permissions model with fine-grained, centrally managed access control — including column-level, row-level, and cell-level **Data Filters** — so the same underlying S3-backed tables can be shared across Athena, Redshift Spectrum, SageMaker training, and Bedrock Knowledge Base ingestion with one consistent permission model, rather than duplicating access rules in every consuming service. A common pattern is a Data Filter that hides specific columns (like a payment card number or a diagnosis code) from a given role while leaving the rest of the row visible.
- **AWS Glue Data Catalog**: The centralized metadata registry — table definitions, tagging, classification, lineage pointers — that Lake Formation's permissions actually apply to.
- **CloudTrail**: Logs *that* an API call happened — who called `InvokeModel`, when, from where — which answers "who did what" for compliance audits, but does not capture the internal details of *why* a guardrail intervened on a specific request.
- **Model Invocation Logging**: A separate, opt-in Bedrock feature that writes raw prompts and responses to CloudWatch Logs or S3, which is what actually gives you the content of a model interaction for observability or compliance retention (e.g., under an S3 Object Lock compliance-mode retention policy) — CloudTrail's API-call record doesn't include the invocation payload itself.
- **Guardrail tracing**: As covered in [Bedrock Guardrails](./bedrock.md#guardrails), this is the mechanism for *which specific rule* fired inside a guardrail and why, which neither CloudTrail nor Model Invocation Logging captures on its own.

:::info Three different logs answer three different questions
CloudTrail answers "who called this and when." Model Invocation Logging answers "what was actually sent and returned." Guardrail tracing answers "which safety rule intervened and why." A compliance requirement that mentions all three usually needs all three logging mechanisms enabled together, not just one.
:::

## Encryption and key management

S3 data backing a Knowledge Base, training dataset, or model artifact should be encrypted at rest with **SSE-KMS**, and using a **customer-managed key (CMK)** rather than an AWS-managed key matters for more than just key rotation control: CMK usage generates a CloudTrail audit trail of every encrypt/decrypt call, which an AWS-managed key does not provide at the same level of detail. **AWS Secrets Manager** (with Lambda-based rotation) is the standard place to store and automatically rotate API tokens and database credentials used by an AI pipeline, rather than embedding them in application config.

## Bias and fairness

Beyond SageMaker Clarify's automated bias metrics (covered in [SageMaker](./sagemaker.md#sagemaker-clarify-bias-and-explainability)), fairness in a generative AI context typically needs an explicit evaluation step rather than an automatic guarantee: **demographic parity** (equal outcome rates across groups) and **equalized odds** (equal false-positive and true-positive rates across groups) are the two fairness metrics most commonly checked, and an A/B test comparing a candidate model against production should track these fairness metrics alongside the primary business metric — not just overall accuracy, which can look fine in aggregate while masking a disparity for a specific subgroup.

## Cost optimization for AI workloads

Several of the techniques covered elsewhere on this site double as cost controls, and it's worth naming them together since cost-optimization questions tend to combine them:

- **Intelligent model routing/cascading**: Sending simple requests to a smaller, cheaper model and only escalating to a larger model when needed (see [Bedrock inference options](./bedrock.md#inference-options-on-demand-batch-provisioned-throughput-and-cross-region-profiles)).
- **Prompt caching**: Reusing a cached prompt prefix across repeated calls instead of reprocessing the same large context every time.
- **Managed Spot Training**: Training on discounted spare capacity for jobs that can tolerate interruption and resumption.
- **Serverless inference (Bedrock and SageMaker)**: Paying per invocation with no idle-capacity cost, appropriate for intermittent traffic.
- **Provisioned Throughput**: The opposite trade-off — a fixed hourly cost that buys predictable capacity, which only pays off at sustained volume (see the exam trap in the Bedrock inference-options section: this is a capacity/predictability lever, not a quality or cost-per-request lever).

## Data residency vs. low latency

These four AWS infrastructure options are easy to mix up because they all involve pushing compute closer to somewhere, but only one of them is actually a data-residency control:

- **AWS Outposts**: Extends AWS infrastructure fully on-premises, so data genuinely never leaves the customer's own facility — the only option in this list that satisfies a strict data-never-leaves-this-location requirement.
- **Local Zones**: Provide metro-area low latency by placing compute closer to a specific city, but the underlying Region is still an actual AWS Region, not the customer's premises.
- **AWS Wavelength**: Embeds compute inside telecom providers' 5G networks for ultra-low-latency mobile/edge use cases.
- **Cross-Region inference profiles**: Explicitly route requests across multiple Regions to increase throughput and resilience (see [Bedrock inference options](./bedrock.md#inference-options-on-demand-batch-provisioned-throughput-and-cross-region-profiles)) — the opposite of data residency, since the whole point is that a request *may* be served from a different Region than the one it originated in.

:::danger Exam trap
Low latency and data residency are different requirements. Local Zones and Wavelength solve for latency; only Outposts keeps data on-premises. Cross-Region inference profiles are explicitly the wrong answer whenever a question requires data to stay within a specific Region or country.
:::
