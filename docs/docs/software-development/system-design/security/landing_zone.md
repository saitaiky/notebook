---
title: AWS Landing Zones 
---

## 1) Concept & Why

### 1.1 Definition (plain English)

A **landing zone** is a **pre‑governed, multi‑account AWS foundation**: identity, networking, guardrails, logging, and cost controls — delivered as code so teams can build **quickly and safely**.

### 1.2 When to invest

* Multiple teams/environments, regulated data, or SaaS multi‑tenancy.
* Early **GenAI** adoption where prompts/outputs must stay private.

### 1.3 GenAI add‑ons (beyond a generic landing zone)

* **Private model access** (Interface VPC Endpoints/PrivateLink to Bedrock).
* **Model governance** (IAM/SCP allow/deny lists by model/region).
* **Safety** (Bedrock Guardrails at app tier; log moderation hits).
* **Token & cost telemetry** (latency, token count, per‑tenant showback).

---

## 2) Reference Architecture

### 2.1 Organization & accounts

```
AWS Organization (root)
├─ OU-Prod       → prod-app, prod-data
├─ OU-NonProd    → dev, stage
├─ OU-Sandbox    → time‑boxed experiments
└─ Shared        → Security | Logging | Networking | Tooling
```

**Why multi‑account?** Blast‑radius control, clearer budgets, cleaner IAM, easier compliance.

### 2.2 Identity & access

* **IAM Identity Center** → permission sets (Builder/Deployer/ReadOnly).
* **SCPs** at OU level: region allowlist, mandatory tags, deny public access.
* **Least privilege**: narrow roles for CI/CD and ops; separate duties.

### 2.3 Networking

* Central **Networking** account: **Transit Gateway/peering**, shared **VPC Endpoints**.
* **PrivateLink** to Bedrock/S3/STS/ECR; **no Internet/NAT** for inference.
* Optional **VPC Lattice** to publish internal services across accounts.

### 2.4 Small architecture sketch — Bedrock via PrivateLink inside a landing zone

```
AWS Organization (root)
├─ OU-Prod           ────────────────────────────────────────────────────────────────┐
│   └─ Account: prod-app                                                             │
│       VPC (10.0.0.0/16)                                                            │
│         ├─ Subnets (App)                                                           │
│         │    └─ ECS/Lambda/EC2 (GenAI app/agent)                                   │
│         │         │                                                                │
│         │         └─ IAM role (from Identity Center permission set)                │
│         │               └─ Policies: bedrock:InvokeModel, kms:Decrypt, logs:Put*   │
│         │                                                                            
│         ├─ Interface VPC Endpoint: com.amazonaws.eu-west-2.bedrock                 │
│         │    (PrivateLink)                                                         │
│         │         └─ Endpoint SG restricts to app subnets                          │
│         │                                                                            
│         └─ Route 53 Resolver + TGW to shared services                              │
│                                                                                     │
├─ OU-Shared ────────────────────────────────────────────────────────────────────────┤
│   ├─ Account: Networking                                                           │
│   │    ├─ Transit Gateway / Peering                                                │
│   │    └─ Shared Interface Endpoints (S3, STS, ECR, optional Bedrock)              │
│   ├─ Account: Logging                                                              │
│   │    └─ Central CloudTrail, VPC Flow Logs, CloudWatch Log groups                 │
│   └─ Account: Security                                                             │
│        └─ GuardDuty, Security Hub, Config Aggregator                               │
│                                                                                     │
└─ Guardrails (applied at OU via SCPs)                                                │
    • Region allowlist  • Mandatory tags  • Block public S3/IGW for workloads        │
    • Model allow/deny lists (via IAM + SCP conditions)                               │
                                                                                     │
Bedrock service (eu-west-2) <─── PrivateLink ───> Endpoint in prod-app VPC           │
                                                                                     │
Logs/metrics → Logging account; Costs → CUR + Budgets (per-tag/OU showback)          │
```

---

## 3) Security, Observability, FinOps

### 3.1 Security baseline

* **Prevention**: SCPs (deny regions, block public S3/SGs), service policies.
* **Detection**: GuardDuty, Config/Conformance Packs, Security Hub, Detective.
* **Response**: Central incident playbooks; delegated admin.
* **Encryption & secrets**: KMS for data at rest; Secrets Manager for credentials.

### 3.2 Observability & audit

* Org‑level **CloudTrail**, **VPC Flow Logs**, **CloudWatch Logs** to **Logging** account.
* App telemetry: latency, error rate, **token counts**, model/version, safety flags.
* Traceability: correlate prompt → model → output → user/action.

### 3.3 FinOps

* **Standard tags** (`env`, `app`, `owner`, `cost-center`, `tenant`).
* **CUR**, Budgets, Cost Anomaly Detection, per‑BU dashboards.
* Bedrock **Application Inference Profiles** for clean showback.

### 3.4 Policy‑as‑code (samples)

**Deny unapproved regions (SCP)**

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyUnsupportedRegions",
    "Effect": "Deny",
    "Action": "*",
    "Resource": "*",
    "Condition": {"StringNotEquals": {"aws:RequestedRegion": ["eu-west-2","eu-west-1"]}}
  }]
}
```

**Require tags (SCP pattern)**

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "RequireStandardTags",
    "Effect": "Deny",
    "Action": ["ec2:RunInstances","s3:CreateBucket","bedrock:InvokeModel"],
    "Resource": "*",
    "Condition": {"Null": {"aws:RequestTag/app": "true"}}
  }]
}
```

**Restrict Bedrock model (IAM)**

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowOnlyApprovedModels",
    "Effect": "Deny",
    "Action": ["bedrock:InvokeModel","bedrock:InvokeModelWithResponseStream"],
    "Resource": ["arn:aws:bedrock:eu-west-2::foundation-model/anthropic.claude-3-haiku-20240307"]
  }]
}
```

---

## 4) Delivery & Operations

### 4.1 CI/CD & account vending

* **IaC everywhere** (Control Tower/LZA + StackSets/CDK/Terraform).
* Golden templates: VPC, endpoints, logging, Bedrock policy packs.
* Automated **account vending** applies baselines on creation.

### 4.2 First 30/60/90 plan

* **0–30**: Organizations, Control Tower, OUs, logging, SSO; PrivateLink for Bedrock.
* **30–60**: Security Hub/GuardDuty/Config, CUR dashboards, sample Chat+RAG pipeline.
* **60–90**: LZA‑style conformance packs, model allowlists, VPC Lattice, per‑tenant cost.

### 4.3 Pitfalls → fixes

* Internet hairpinning → **Interface Endpoints**, block public egress.
* Unattributed spend → mandatory tags + showback.
* IAM sprawl → permission sets + templates.
* Snowflake networks → shared blueprint + PR reviews.
* Security stalls POCs → pre‑approved archetypes + self‑service within guardrails.

### 4.4 Checklist

* Control Tower + OUs + delegated admins
* Central logging (CloudTrail, VPC Flow, CloudWatch)
* Identity Center groups/permission sets
* PrivateLink (Bedrock + core services)
* SCPs (regions/tags/public access)
* Security Hub/GuardDuty/Config
* CUR + budgets + anomaly detection
* Golden VPC + policy packs (StackSets)
* Account vending workflow
* App guardrails + token/cost telemetry

### 4.5 What Control Tower adds vs DIY

* **Out‑of‑the‑box landing zone**: opinionated setup of Organizations, OUs, SSO (Identity Center), centralized logging, and baseline controls without writing glue code.
* **Guardrails catalog**: prebuilt preventive (SCP) and detective (AWS Config) controls you can enable per OU with a few clicks; unified **compliance dashboard**.
* **Account Factory**: standardized **account vending** via Service Catalog; new accounts are created and **auto‑enrolled** with baselines/guardrails.
* **Drift detection & remediation**: detects when enrolled accounts deviate from guardrails/baselines and can trigger remediation.
* **Lifecycle orchestration**: consistent rollout of new controls/regions across OUs and accounts at scale.
* **First‑party integration path**: works cleanly with **Landing Zone Accelerator (LZA)** and **AFT** (Account Factory for Terraform) for IaC‑driven vending.

> You *can* build most of this with raw Organizations + StackSets + Config + custom pipelines; **Control Tower** packages and operates it as a managed, upgradeable baseline so you spend time on product/GenAI features instead of governance plumbing.

### 4.6 With vs Without Control Tower (mini)

| Capability                                                         | **With Control Tower**                                             | **Without Control Tower (DIY)**                                                     |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| **Baseline setup** (OUs, SSO, central logging, initial guardrails) | Opinionated, packaged setup via CT                                 | Assemble Organizations, Identity Center, CloudTrail, S3, Config, StackSets yourself |
| **Guardrails mgmt** (preventive/detective)                         | Catalog of SCPs & Config rules; enable per OU with status view     | Author/maintain SCPs & Config rules; build dashboards/alerts                        |
| **Account vending**                                                | Account Factory with auto-enrollment to baselines                  | Build Service Catalog/Automation/Lambda pipelines using `CreateAccount`             |
| **Drift detection & remediation**                                  | Built-in drift checks for enrolled accounts with remediation hooks | Roll your own with Config, StackSets drift, custom Lambdas                          |
| **Compliance view**                                                | Central landing zone compliance dashboard                          | Aggregate Security Hub/Config yourself; maintain reporting                          |
| **Lifecycle orchestration**                                        | Push new controls/region policies across OUs consistently          | Pipeline your own rollouts and handle exceptions manually                           |
| **Extensibility**                                                  | First-party integration with LZA & AFT                             | Possible, but you must integrate and operate                                        |
| **Ops ownership**                                                  | AWS manages the landing zone framework                             | You own design, code, upgrades, break-fixes                                         |
