# AWS SAP Core Exam Playbook

Use this short playbook in live AWS Certified Solutions Architect Professional question sessions. It is distilled from the 14 uploaded past-paper markdown files, but it is **not** an answer key.

## Source coverage

| Source family | Questions |
|---|---|
| Neal Davis | 210 |
| Stephane Maarek | 180 |
| Tutorials Dojo review mode | 375 |

Total parsed questions: **765**.

Detected answer-count mismatches/suspicious extracted keys: **184**. Treat this as a warning signal, not as a precise error count: many source files include checkmarks or extracted answer labels that conflict with the question’s `Select` count.

---

## 1. Live-answer protocol

When answering a question:

1. Read the full context first.
2. Identify the exact `Select` count.
3. Return exactly that many options.
4. Decide the dominant requirement: cost, operational overhead, security, availability, RTO/RPO, latency, private connectivity, migration speed, or service limit.
5. Eliminate answers that violate hard service boundaries.
6. Use this playbook as background only; solve the current question from first principles.
7. If extracted answer/checkmarks conflict with the scenario or `Select` count, flag **Answer-key inconsistency**.

Preferred live response format:

```markdown
**Answer:** [A, C]

**Reasoning:**
- A: ...
- C: ...

**Why the others are wrong:**
- B: ...
- D: ...

**Answer-key inconsistency?:** Yes/No
```

---

## 2. Fast elimination order

Use this order before comparing “similar-looking” options:

| Step | Question to ask | Typical elimination |
|---|---|---|
| 1 | Does it violate a hard service limit? | Lambda >15 minutes, gateway endpoint for Kinesis, ALB TCP listener |
| 2 | Is it the wrong service category? | Shield for SQLi, Macie for packet capture, Config for API logs |
| 3 | Does it violate explicit wording? | NAT/public internet when private connectivity is required |
| 4 | Is it too operationally heavy? | Cron scripts when lifecycle/managed service exists |
| 5 | Does it meet `Select` count? | Do not return more answers because old checkmarks show more |

---

## 3. High-signal requirement map

| If the question says... | Usually choose... | Avoid... |
|---|---|---|
| Least operational overhead | Managed/serverless/native feature | Custom scripts, cron, self-managed EC2 |
| Most cost-effective | Native scaling, lifecycle, right-sized standby | Always-on overprovisioning, unnecessary DX, DAX without need |
| Private access to S3/DynamoDB | Gateway VPC endpoint | NAT Gateway as default |
| Private access to Kinesis/Secrets Manager/ECR | Interface VPC endpoint | Gateway endpoint |
| Dedicated predictable connectivity | Direct Connect | Site-to-Site VPN only |
| Dedicated and encrypted connectivity | Direct Connect + VPN | Direct Connect alone |
| Many VPCs/accounts | Transit Gateway | Full mesh VPC peering |
| Multi-account governance | Organizations + SCP/Control Tower | IAM-only governance |
| Multi-account/multi-Region stack rollout | CloudFormation StackSets | Nested stacks, change sets, CLI loop |
| Approved self-service infra | Service Catalog + launch constraints | CloudFormation full access |
| Third-party cross-account access | IAM role + External ID | Shared access keys |
| Static global public IPs | Global Accelerator | Route 53/ALB IPs |
| Static regional TCP IPs | NLB + EIP per AZ | ALB |
| S3 private content via CloudFront | OAI/OAC + bucket policy | Public bucket |
| Many restricted CloudFront files | Signed cookies | Signed URL per file |
| SQLi/XSS/geo web filtering | AWS WAF | Shield/NACL/SG |
| L3/L4 DDoS advanced visibility | Shield Advanced | WAF only |
| S3 PII discovery | Macie | Inspector/GuardDuty |
| Vulnerability/CVE scanning | Inspector | Macie/GuardDuty |
| API audit trail | CloudTrail | Config/CloudWatch dashboard |
| Compliance state/remediation | AWS Config | CloudTrail alone |
| Preserve terminated EC2 logs | CloudWatch Logs agent | Local-only logs |
| Packet payload inspection | VPC Traffic Mirroring | VPC Flow Logs |
| Spiky durable writes | SQS buffer | ElastiCache |
| Delay one SQS message | Message timer | Delay queue |
| Delay all queue messages | Delay queue | Message timer |
| Failed messages | DLQ | Visibility timeout |
| Multi-step workflow | Step Functions | Ad hoc Lambda/SQS spaghetti |
| Long-running processing | ECS/Fargate/Batch/EC2 | Lambda directly |
| Shared Linux filesystem | EFS | EBS per instance |
| Shared Windows filesystem | FSx for Windows | EFS |
| Online file sync/migration | DataSync | Storage Gateway unless live hybrid access |
| Hybrid SMB/NFS backed by S3 | S3 File Gateway | DataSync |
| Huge data + low bandwidth + deadline | Snowball | Slow network upload |
| RDS HA | Multi-AZ | Read replica only |
| RDS/Aurora read scale | Read replicas/Aurora replicas | Multi-AZ |
| Aurora autoscale | Read replicas | Writer instance autoscaling |
| DynamoDB item expiry | TTL | Lambda cleanup |
| DynamoDB multi-Region active-active | Global tables | DIY Lambda replication |
| DynamoDB microsecond read cache | DAX | ElastiCache |
| Query S3 from Redshift | Redshift Spectrum | Load old data repeatedly |
| Serverless ETL/schema discovery | Glue crawler/classifier + Glue ETL | Many chained Lambdas |
| EMR one-time HDFS processing | On-Demand master/core + Spot task | Spot master/core |

---

## 4. Service-boundary traps to memorise

### IAM and Organizations

- SCPs do not grant permissions; they only set maximum permissions.
- SCPs apply to member accounts, not the management account.
- IAM/resource policies still grant actual access.
- Trust policy = who can assume a role.
- Permission policy = what the assumed role can do.
- Use External ID for third-party role assumption.
- Organizations all-features mode is required for SCPs.

### Networking

- Gateway endpoints are only for S3 and DynamoDB.
- Interface endpoints use PrivateLink and ENIs.
- NAT Gateway is outbound internet, not private service access.
- NAT Gateway belongs in a public subnet.
- Direct Connect is not encrypted by default.
- Public VIF reaches public AWS service endpoints, not private VPC endpoints.
- VPC peering is not transitive.
- NACLs are stateless; SGs are stateful.
- SG response traffic is automatically allowed; NACL response traffic needs ephemeral ports.

### Edge and load balancing

- ALB is Layer 7 HTTP/HTTPS; NLB is Layer 4 TCP/UDP/TLS.
- ALB supports WAF; NLB is common for PrivateLink and static TCP IPs.
- Global Accelerator gives static anycast IPs and routes to nearest healthy endpoint.
- Route 53 does DNS routing; it does not provide fixed ALB IPs.
- CloudFront signed URL = one object; signed cookie = many objects.
- S3 website endpoint and S3 REST endpoint behave differently for CloudFront/OAI/OAC.

### Security

- WAF protects against L7 web attacks like SQLi/XSS.
- Shield Advanced handles enhanced DDoS protection and L3/L4 visibility.
- Macie discovers sensitive data in S3.
- Inspector scans vulnerabilities/CVEs.
- GuardDuty detects threats.
- Security Hub aggregates findings.
- Config tracks resource configuration/compliance.
- CloudTrail records API activity.

### Compute/integration

- Lambda max runtime is 15 minutes.
- Fargate/ECS is a good pattern for event-triggered container jobs beyond Lambda limits.
- ECS task role is for app permissions; container instance role is for host/agent permissions.
- Reserved concurrency caps one Lambda’s impact; provisioned concurrency reduces cold starts.
- SQS visibility timeout is after receipt, not initial delay.
- FIFO queue gives ordering; Standard queue gives higher throughput/best-effort ordering.

### Storage/database

- EBS is normally single-instance block storage in one AZ.
- EFS is shared Linux NFS.
- FSx for Windows is shared SMB.
- Instance store is ephemeral.
- S3 lifecycle handles transition and expiry; no Lambda needed for simple expiry.
- RDS Multi-AZ is HA/failover, not read scale.
- Aurora Auto Scaling scales read replicas, not writer.
- DAX is DynamoDB read cache, not write buffer.
- Redshift Spectrum queries S3 without loading data.

---

## 5. Answer-key inconsistency rule

If the source/extracted answer shows more or fewer answers than the question asks for:

```text
Answer-key inconsistency?: Yes.
The extracted key/checkmarks conflict with the Select count or the explanation. I selected exactly the requested number based on the scenario and AWS service boundaries.
```

Examples of suspicious patterns seen in the uploaded papers:

- `Select TWO` but extracted key/checkmarks show four or five answers.
- Explanation says one option is correct but the checkmark appears on a wrong option.
- Correct Answer line includes both the real answer and a distractor.
- Extracted “Correct Answer” conflicts with explanation text.

---

## 6. Final checklist before answering

1. Did I return exactly the `Select` count?
2. Did I choose based on the scenario, not old answer labels?
3. Did I eliminate services that cannot technically do the job?
4. Did I respect cost/operational-overhead wording?
5. Did I distinguish HA vs read scale vs DR?
6. Did I distinguish API audit vs config compliance vs metrics/logs?
7. Did I avoid custom scripts where AWS has a native feature?
8. Can I explain each rejected option in one sentence?
