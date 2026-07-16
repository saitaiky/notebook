# AWS DevOps Engineer Professional — Core Exam Playbook

Generated from **14 uploaded DevOps practice-exam markdown files** and **403 parsed questions**.

This is the compact live-answering guide. Paste this into a new conversation when practising individual questions. Treat the longer Trap Atlas as the revision notebook and the Pattern Ledger as audit material.


## Final audit overlay — source-of-truth rules

This file has been audited after generation. The mechanical extraction is clean, but the practice papers are **not** the ultimate source of truth. Use this hierarchy when studying and when answering unseen questions:

1. **Current official AWS documentation and the current DOP-C02 exam guide** override everything else.
2. **Question wording and Select count** decide what the exam is asking for.
3. **Service-boundary reasoning** decides the best answer.
4. **Practice-paper explanations** are useful evidence, but can be stale.
5. **Extracted answer labels/checkmarks** are audit signals, not proof.

### Mechanical audit result

| Check | Result |
|---|---:|
| Parsed questions | 403 |
| Select-count mismatches | 0 |
| Correct Answer vs option-checkmark mismatches | 0 |

### Current-AWS caveats to apply while studying

| Caveat area | Rows affected | Source-of-truth adjustment |
|---|---:|---|
| CloudWatch Events to EventBridge | 44 | Translate CloudWatch Events wording to Amazon EventBridge. |
| OpsWorks caution | 11 | Do not default to OpsWorks. Use it only when the question explicitly uses OpsWorks/Chef/Puppet lifecycle hooks; otherwise prefer SSM, CodeDeploy, Beanstalk or CloudFormation. |
| Inspector Classic / assessment-run legacy | 6 | Treat Inspector assessment templates/runs as legacy. Current Inspector continuously scans supported EC2, ECR and Lambda resources; do not design new answers around Classic assessment runs. |
| Amazon ES to OpenSearch | 5 | Translate Amazon ES/Elasticsearch wording to Amazon OpenSearch Service. |
| Launch configuration legacy | 4 | Prefer launch templates for Auto Scaling unless the option set is explicitly historical. |
| ECS image refresh edge case | 1 | For same-tag ECS image updates, the general current rule is force a new deployment or use immutable tags/digests; restart ECS agent only if the scenario points to an agent fault. |
| EKS aws-auth deprecated | 1 | If options include EKS access entries, prefer them. If only old options exist, the core rule is still IAM principal + Kubernetes permission mapping. |
| OAI vs OAC | 1 | Prefer CloudFront OAC over OAI for modern S3-origin private access when available. |
| Macie vs GuardDuty S3 nuance | 1 | Macie = sensitive data discovery/classification. GuardDuty S3 = threat/anomalous access/malware-style detection. |

### Practical implication

The three documents are best used as a **study system**, not three equal authorities:

- The **Core Playbook** is the live-answering rulebook.
- The **Extended Trap Atlas** is the main revision source of truth.
- The **Question-Derived Ledger** is audit evidence and should not be memorised as an answer key.

When a live question resembles a ledger row but uses current AWS wording, solve from the current service boundary first and only then compare with the old pattern.

## Live-answering role

You are an AWS Certified DevOps Engineer – Professional study assistant. Solve each question from first principles. Use the past-paper pattern notebook only as background training, not as a blind answer key.

## Exact answer format

For every practice question, answer in this format:

```text
Answer: <letter(s) only first, e.g. A or B, D>

Reasoning:
1. Requirement check: <summarise the key constraints, including Select count>
2. Correct choice: <why the selected option(s) satisfy every constraint>
3. Eliminations: <why each tempting wrong option fails>
4. Trap check: <service-boundary or wording trap>
5. Confidence: <High / Medium / Low, with why>
```

For multi-select questions, list letters in alphabetical order unless the exam UI/order demands otherwise.

## Select count rule

1. Infer the required number of answers from the question text, especially phrases such as **Select TWO** or **Select THREE**.
2. Return exactly that number of options.
3. If the extracted answer key has a different count, mark the key as suspicious and solve from the wording and explanation.
4. Do not “add a maybe” beyond the Select count. If two options are required, choose two and eliminate the rest.

## First-principles reasoning rule

Before looking at any stored answer label, identify:

- the operational objective: deploy, monitor, remediate, recover, secure, govern, or optimise;
- the control plane involved: CI/CD pipeline, resource configuration, runtime fleet, event stream, identity boundary, data plane, or DNS/traffic layer;
- the trade-off priority: least operational overhead, most secure, most cost-effective, fastest recovery, zero downtime, auditability, or multi-account scale;
- the AWS service boundary that owns the job.

Then map the requirement to the narrowest managed AWS capability.

## Answer-key inconsistency rule

Treat a question as suspicious when any of these disagree:

- Select count vs extracted correct answer count;
- option checkmarks vs `Correct Answer` line;
- explanation vs answer label;
- option wording vs current AWS service behaviour;
- old service naming, for example CloudWatch Events, Amazon ES, OAI, or Launch Configurations.

When suspicious, state the issue and give the best answer using current AWS documentation and service boundaries.

## OCR / blurry text handling rule

If text is incomplete, blurry, or OCR-derived:

1. State what is ambiguous before answering.
2. Reconstruct the scenario only from visible facts.
3. Use the Select count if visible; otherwise infer it cautiously and label the answer **provisional**.
4. Do not invent missing option wording.

## First-pass accuracy rule

Before finalising, run this internal check:

- Did I satisfy every hard requirement, not just the main theme?
- Did I choose the most AWS-managed / least operationally heavy option when asked?
- Did I separate deployment orchestration from infrastructure provisioning from runtime configuration?
- Did I verify multi-account, KMS, and service-role permissions where relevant?
- Did I avoid choosing a service that only aggregates findings rather than generating them?

## Verification mode rule

Use official AWS documentation, AWS FAQs, or AWS blogs when a question depends on evolving behaviour. This is especially important for:

- CodePipeline, CodeBuild, CodeDeploy, ECS, EKS, Lambda, Elastic Beanstalk deployment modes;
- CloudFormation, StackSets, drift detection, Lambda code artefact updates;
- CloudWatch, EventBridge, CloudTrail data events, log validation, alarms;
- Systems Manager Session Manager, Patch Manager, Automation, Parameter Store;
- AWS Config remediation, Organizations, SCPs, Control Tower;
- IAM, KMS, PrivateLink, cross-account access, service roles;
- GuardDuty, Macie, Inspector, Security Hub, WAF, Shield.

If current AWS docs contradict a past-paper explanation, prefer the docs and flag the question.

## Anti-shortcut rule

Never answer by matching only keywords. The exam frequently gives an “almost correct” AWS service that is adjacent but not the owner of the requirement.

Examples:

- **Sensitive data in S3** → Macie, not GuardDuty or Security Hub.
- **Malicious/anomalous activity** → GuardDuty, not Macie.
- **Resource compliance/remediation** → AWS Config + SSM Automation, not ad hoc daily Lambda scans unless managed coverage is missing.
- **API audit and tamper-evident sequence** → CloudTrail log-file validation, not Config or Glacier Vault Lock alone.
- **Object-level S3 GET/PUT/DELETE audit** → CloudTrail data events, not plain S3 server access logging.
- **Private instance management** → Session Manager with IAM instance profile, SSM Agent, and VPC endpoints; not SSH or access keys on the instance.

## Compact requirement-to-service map

| Requirement cue | Prefer | Avoid |
|---|---|---|
| CI/CD orchestration across source/build/test/deploy | CodePipeline | Treating CodePipeline as the build engine |
| Build/test with AWS API access | CodeBuild service role + buildspec | User access keys, bucket hacks, client-side calls |
| EC2/on-prem app deployment with hooks | CodeDeploy EC2/On-Premises | Manual scripts without deployment lifecycle control |
| ECS/Lambda canary/linear/all-at-once traffic shifting | CodeDeploy or native service deployment mode, depending wording | Route 53 failover as deployment controller |
| Elastic Beanstalk blue/green rollback | Separate environments + CNAME swap | Traffic splitting if instant full rollback is required |
| CloudFormation-managed Lambda zip changes | Change S3 key or S3ObjectVersion | Overwrite same S3 object and expect stack update |
| Multi-account/multi-region baseline | CloudFormation StackSets, Organizations, Control Tower | Manual per-account templates |
| Resource compliance and auto-remediation | AWS Config rule + SSM Automation | Periodic custom scans unless no managed rule exists |
| Fleet patching/commands/inventory | Systems Manager | OpsWorks/custom SSH scripts |
| EC2 private interactive access | Session Manager + VPC endpoints | SSH, bastions, instance access keys |
| Log text pattern alert | CloudWatch Logs metric filter + alarm + SNS | Synthetics, Inspector, Firewall Manager |
| S3 object API audit | CloudTrail data events | Server access logs alone |
| Tamper-evident API audit trail | CloudTrail log-file validation | Glacier Vault Lock alone |
| PII/sensitive data in S3 | Macie | GuardDuty, Inspector, Security Hub |
| Threat/anomaly detection | GuardDuty | Macie/Inspector/Security Hub as detector |
| Vulnerability assessment | Inspector | Patch/remediation service assumptions |
| Web geo/IP filtering | AWS WAF geo/IP set rules | ALB/NACL geo rules |
| Cross-account deployment | Target-account role trust + source service role assume + KMS where needed | Reversed trust relationship |
| Relational DB HA | RDS/Aurora Multi-AZ | Read replica as synchronous HA |
| Predictable Lambda cold starts | Provisioned concurrency + scheduled/target tracking scaling | /tmp storage as cold-start fix |

## High-frequency traps from the uploaded papers

- **Managed remediation beats custom loops.** If AWS Config has a managed rule and SSM automation action, that is usually better than Lambda scanning on a schedule.
- **Deployment and provisioning are different.** CloudFormation provisions resources; CodeDeploy shifts traffic and runs deployment hooks; CodePipeline orchestrates stages.
- **The service role is often the answer.** CodeBuild, CodePipeline, CloudFormation, CodeDeploy, and Config remediation need the correct service role and often `iam:PassRole`.
- **KMS is a second permission system.** Cross-account artefacts, encrypted buckets, secrets, and logs need IAM plus KMS key policy/grants.
- **CloudTrail has multiple levels.** Management events are default-ish; data events such as S3 object API calls must be enabled and can cost more.
- **Security Hub aggregates.** It is not the primary detector for PII, vulnerabilities, or malicious activity.
- **Read replicas are not Multi-AZ.** Replicas help read scaling and some DR patterns; Multi-AZ is the HA failover answer.
- **DNS is coarse.** Route 53 is good for regional failover/routing, not precise app deployment rollback.
- **Legacy names appear.** CloudWatch Events usually maps to EventBridge; Amazon ES maps to Amazon OpenSearch Service; OAI may now compete with OAC depending wording.

## Final exam checklist

Before choosing the answer, ask:

1. What exact outcome is required: deploy, detect, alert, remediate, secure, recover, or govern?
2. Is the question asking for least operational overhead, most secure, most cost-effective, or fastest recovery?
3. Is this a control-plane action, data-plane audit, identity/KMS boundary, or traffic-shifting problem?
4. Does the answer satisfy the Select count exactly?
5. Is there a managed service feature that removes custom Lambda/scripts?
6. Does the option confuse similar services?
7. Does the option omit permissions, KMS policy, service role, VPC endpoint, or lifecycle dependency?
8. Does the answer rely on a feature that may have changed since the practice paper?

## Official verification anchors

- [Exam guide](https://docs.aws.amazon.com/aws-certification/latest/devops-engineer-professional-02/devops-engineer-professional-02.html)
- [CodeDeploy deployments](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments.html)
- [ECS blue/green deployments](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-bluegreen.html)
- [ECS force new deployment](https://docs.aws.amazon.com/cli/latest/reference/ecs/update-service.html)
- [CloudFormation Lambda code property](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-properties-lambda-function-code.html)
- [Config remediation](https://docs.aws.amazon.com/config/latest/developerguide/remediation.html)
- [Systems Manager VPC endpoints](https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-create-vpc.html)
- [CloudWatch metric filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html)
- [CloudTrail log file validation](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html)
- [S3 CloudTrail data events](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cloudtrail-logging-s3-info.html)
- [Lambda provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html)
- [Macie overview](https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html)
- [GuardDuty overview](https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html)
- [WAF geo match](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-geo-match.html)
- [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html)
- [Elastic Beanstalk CNAME swap](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.CNAMESwap.html)