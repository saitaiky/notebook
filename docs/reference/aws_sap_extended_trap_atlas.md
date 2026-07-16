# AWS SAP Extended Trap Atlas

This is the detailed revision atlas extracted from the uploaded AWS SAP past-paper markdown files. Use it to study the traps behind questions, not to memorise answer letters.

## Coverage and reliability notes

| Source family | Questions |
|---|---|
| Neal Davis | 210 |
| Stephane Maarek | 180 |
| Tutorials Dojo review mode | 375 |

Total parsed questions: **765**.

The source files repeatedly state that the extracted answer label/checkmark is best-effort. In this parsed run, **184 questions** had a detected mismatch between the inferred `Select` count and the number of extracted correct-answer letters. This is not a perfect error count, but it is strong evidence that answer labels must be treated as low trust.

---

# 1. Exam-level mental model

AWS SAP questions are rarely asking “which service exists?” They usually ask:

1. Which service best fits the **dominant requirement**?
2. Which option violates a hidden **service boundary**?
3. Which option meets the requirement with **least cost / least operational overhead**?
4. Which architecture gives the required **RTO/RPO / latency / security posture**?
5. Which answer is a tempting but incomplete pattern?

## 1.1 Dominant requirement hierarchy

When multiple requirements appear, prioritise in this order unless the question wording says otherwise:

1. **Hard correctness**: service can/cannot do it.
2. **Security/compliance constraint**: private connectivity, encryption, IAM boundary, auditability.
3. **Availability/RTO/RPO constraint**.
4. **Performance/latency/scalability constraint**.
5. **Operational overhead**.
6. **Cost**.

If an answer is cheaper but violates RTO/RPO or security, it is wrong. If an answer is more secure but massively over-engineered and the question says “least operational overhead”, compare managed-native alternatives first.

## 1.2 Common distractor language

| Distractor wording | Why it is dangerous |
|---|---|
| “Use a Lambda function to periodically scan...” | Often unnecessary if Config, lifecycle policies, EventBridge, or native replication exists. |
| “Use Direct Connect...” | Often overkill unless dedicated predictable private connectivity is explicit. |
| “Use CloudTrail to detect compliance...” | CloudTrail audits API calls; Config evaluates resource state/compliance. |
| “Use Security Hub to remediate...” | Security Hub aggregates findings; remediation needs Config, EventBridge, Lambda, SSM, etc. |
| “Use a gateway endpoint for...” | Gateway endpoints only support S3 and DynamoDB. |
| “Use a public VIF to access...” | Public VIF accesses AWS public service endpoints, not VPC private endpoints. |
| “Use Multi-AZ for read scaling...” | Multi-AZ is failover/HA; read replicas are read scaling. |
| “Use Lambda for long-running jobs...” | Lambda has a 15-minute maximum runtime. |
| “Use Route 53 for static IPs...” | Route 53 routes names, not fixed ALB IPs. |
| “Use WAF for network-layer DDoS...” | WAF is L7; Shield Advanced handles enhanced DDoS visibility/response. |

---

# 2. Identity, IAM, Organizations, and governance

## 2.1 IAM policy taxonomy

| Policy/control | Scope | Grants access? | Key trap |
|---|---|---:|---|
| IAM identity policy | User/group/role | Yes | Cannot centrally govern all accounts alone |
| Resource policy | Resource | Yes | Must name principals/resources correctly |
| Trust policy | Role | No | Defines who can assume role, not permissions after assumption |
| Permission boundary | IAM entity | No | Maximum permission boundary only |
| SCP | AWS Organizations entity | No | Guardrail only; member accounts only |
| Session policy | STS session | No, limits | Further restricts assumed-role session |
| KMS key policy | KMS key | Yes/required | IAM alone may be insufficient |

## 2.2 SCP rules

High-frequency rules:

- SCPs are guardrails. They do not grant permissions.
- Effective permission = IAM/resource permission **and** not blocked by SCP/permission boundary/session policy.
- SCPs do not affect the management account.
- SCPs require AWS Organizations **all features** mode.
- Deny in SCP overrides allows in IAM.
- Use root/OU attachment for broad guardrails.
- Do not use SCP as a fine-grained per-resource grant mechanism.

Common exam decisions:

| Scenario | Exam-aligned answer |
|---|---|
| Deny member accounts from buying/modifying RIs | SCP denying `ec2:PurchaseReservedInstancesOffering` and `ec2:ModifyReservedInstances` attached to OUs |
| Prevent use of non-approved Regions/services | SCP deny/allow-list at OU/root |
| Ensure accounts cannot disable CloudTrail/Config | SCP deny destructive APIs |
| Allow only owners of resources to terminate them | IAM role/resource-level permissions/tags, not SCP alone |

## 2.3 Cross-account access

Correct pattern:

1. Resource account creates a role.
2. Trust policy allows source account/principal.
3. Permission policy grants required actions.
4. Source principal assumes role via STS.

Third-party pattern:

- Add **External ID** to role trust policy.
- Never share access keys.
- Avoid long-term IAM users for third parties.

CloudFront/S3 cross-account trap:

- OAI/OAC controls CloudFront read access to S3.
- It does not grant a build pipeline write access.
- For dev account pipeline uploading to prod bucket, create cross-account role in production with write permission and allow pipeline to assume it.

## 2.4 Organizations, Control Tower, Security Hub, Config

| Requirement | Prefer |
|---|---|
| Create centrally governed multi-account environment | Control Tower |
| Apply preventive/detective guardrails | Control Tower guardrails / SCPs / Config |
| Aggregate security findings | Security Hub |
| Evaluate resource compliance and auto-remediate | AWS Config rules + remediation |
| Monitor Organizations API actions | CloudTrail + EventBridge/SNS |
| Deploy resources across OUs/Regions | CloudFormation StackSets |

Traps:

- Control Tower is not a general-purpose deployment engine for arbitrary application stacks; use StackSets.
- Security Hub is not a substitute for Config remediation.
- CloudTrail tells you an API call happened; Config tells you the resource is non-compliant.

## 2.5 IAM Identity Center and Directory Service

Use IAM Identity Center when:

- many AWS accounts;
- workforce users;
- corporate IdP/AD integration;
- permission sets;
- SaaS/cloud app SSO.

AD Connector vs AWS Managed Microsoft AD vs AD FS:

| Need | Usually choose |
|---|---|
| Redirect auth to existing self-managed AD without storing data | AD Connector |
| Managed AD in AWS + trust with on-prem AD | AWS Managed Microsoft AD |
| Broad SSO across AWS accounts/apps with low overhead | IAM Identity Center |
| Manual SAML federation and custom portal | AD FS only if specifically required |

Trap: IAM Identity Center with AD often needs a trust/connector pattern that lets it read/synchronise user/group metadata, not just one-way authentication.

## 2.6 Service Catalog

Use Service Catalog when:

- central platform publishes approved templates;
- end users need self-service;
- least privilege matters;
- infrastructure must be distributed to accounts/OUs.

Key detail:

- Launch constraints allow a product to launch with a role, so end users need only Service Catalog access, not broad CloudFormation/service permissions.

---

# 3. CloudFormation, deployment, and release strategy

## 3.1 CloudFormation concepts

| Concept | Purpose | Not for |
|---|---|---|
| Template | Resource blueprint | Multi-account orchestration by itself |
| Stack | Deployed resource unit | Cross-account/Region fanout |
| Change set | Preview update impact | Deploying to many Regions |
| Nested stack | Modularise complex stacks | Multi-account deployment |
| StackSet | Deploy stacks across accounts/Regions | Single-stack modularity |

## 3.2 StackSets traps

Correct cues:

- “multiple AWS accounts”
- “multiple Regions”
- “under AWS Organizations”
- “automatic provisioning when accounts are added”
- “central account deploys standard resources”

Wrong alternatives:

- CLI loop = more overhead.
- Nested stacks = not cross-account/Region rollout.
- Change sets = update preview only.
- Control Tower alone = account governance, not arbitrary workload deployment.

## 3.3 AWS CDK trap

If the question says developers want programming-language features such as loops/classes and dislike CloudFormation DSL, the answer is usually **AWS CDK**, not Terraform unless AWS-native options are not available.

## 3.4 Deployment strategies

| Strategy | Use when | Risk/trap |
|---|---|---|
| All-at-once | Fastest, downtime acceptable | High risk |
| Rolling | Gradual update | Reduced capacity/mixed versions |
| Rolling with additional batch | Maintain capacity during rolling | More resources temporarily |
| Immutable | Safest EC2/Beanstalk style | Extra temporary capacity |
| Blue/green | Low-risk traffic shift | More infrastructure |
| Canary/linear | Gradual Lambda/API/ECS release | Needs traffic shifting/monitoring |

Exam traps:

- “No reduced capacity” usually rules out basic rolling.
- “Automatic rollback” points to CodeDeploy/Elastic Beanstalk health checks.
- Serverless gradual deployment points to SAM + CodeDeploy deployment preferences.
- ECS blue/green usually uses CodeDeploy + ALB listeners/target groups.

---

# 4. Networking and connectivity

## 4.1 Security Groups vs NACLs

| Feature | Security group | NACL |
|---|---|---|
| Scope | ENI/resource | Subnet |
| State | Stateful | Stateless |
| Rules | Allow only | Allow + deny |
| Evaluation | All rules | Ordered |
| Common exam use | Least-privilege app/db access | Explicit subnet boundary and ephemeral return ports |

## 4.2 Common SG/NACL patterns

### ALB → EC2 private instances

- ALB SG inbound: 80/443 from users.
- ALB SG outbound: app port to EC2 SG.
- EC2 SG inbound: app port from ALB SG.
- EC2 SG does not need inbound ephemeral response rule.

### EC2 app → RDS/Aurora

- App SG outbound: DB port to DB SG.
- DB SG inbound: DB port from App SG.
- DB SG outbound is not required for response if SG stateful.

### NACL with ALB response traffic

NACLs are stateless. If a subnet NACL sees response traffic to an ALB/client source port, you may need ephemeral port ranges outbound/inbound depending direction. This differs from SGs.

## 4.3 VPC endpoints

| Service | Endpoint type |
|---|---|
| S3 | Gateway |
| DynamoDB | Gateway |
| Kinesis Data Streams | Interface |
| Secrets Manager | Interface |
| ECR API / ECR Docker | Interface |
| CloudWatch Logs | Interface |
| Systems Manager | Interface endpoints for SSM/EC2 messages/SSM messages |
| Private custom service | Endpoint service + NLB + interface endpoint |

Important endpoint policy traps:

- Endpoint policy can restrict which principals/actions/resources can use the endpoint.
- Bucket policies can require access through a specific VPC endpoint or S3 access point.
- NAT Gateway is not private access; it sends traffic to public service endpoints.

## 4.4 PrivateLink and NLB

PrivateLink service pattern:

1. Provider creates NLB.
2. Provider creates endpoint service.
3. Consumer creates interface endpoint.
4. Traffic reaches provider through private IPs.

Trap:

- Targets behind the NLB often see source IPs from NLB nodes, not original clients. Configure target SG/NACL accordingly.
- Do not use client SG as source for target SG across PrivateLink in the way you would inside one VPC.

## 4.5 Direct Connect, VPN, TGW, DXGW

| Scenario | Use |
|---|---|
| Quick encrypted connectivity, modest bandwidth | Site-to-Site VPN |
| Dedicated predictable performance | Direct Connect |
| Dedicated + encrypted | Direct Connect + VPN |
| Many VPCs + on-prem hub | Transit Gateway |
| DX to many Regions | Direct Connect Gateway |
| Highest DX resilience | Multiple DX connections across locations/carriers |

Traps:

- Direct Connect alone does not encrypt traffic.
- Public VIF reaches AWS public service IPs, not VPC private endpoints.
- Private VIF connects to a VPC/VGW/DXGW.
- Transit VIF connects DX to Transit Gateway.
- LAG increases bandwidth/connection aggregation but may not eliminate provider/location failure.

## 4.6 VPC peering

Rules:

- No transitive routing.
- No overlapping CIDRs.
- Use most-specific routes where overlapping destination CIDRs exist across peering connections.
- For many VPCs/accounts, prefer Transit Gateway.

## 4.7 DNS

Route 53 Private Hosted Zone:

- Associate PHZ with VPCs that need to resolve records.
- Cross-account association requires authorisation/association workflow.
- Resolver inbound/outbound endpoints integrate on-prem and VPC DNS.

Hosted zone trap:

- Creating NS records in another private hosted zone is not enough to resolve central PHZ records; VPCs must be associated or Resolver forwarding must be configured.

## 4.8 Traffic analysis

| Need | Tool |
|---|---|
| API-level who/what/when | CloudTrail |
| Flow metadata | VPC Flow Logs |
| Packet payload inspection | Traffic Mirroring |
| Web request logging/filtering | WAF logging |
| Load balancer request details | ALB/NLB access logs, depending LB type/support |

Trap:

- Promiscuous mode on EC2 cannot sniff traffic for other instances like a traditional LAN; use Traffic Mirroring.

---

# 5. Edge, load balancing, CloudFront, and Route 53

## 5.1 ALB vs NLB

| Requirement | Use |
|---|---|
| HTTP/HTTPS path/host routing | ALB |
| WAF integration | ALB/CloudFront/API Gateway |
| Sticky sessions for HTTP apps | ALB |
| TCP/UDP/TLS listeners | NLB |
| Static IP per AZ | NLB |
| PrivateLink endpoint service | NLB |
| Extreme low latency L4 | NLB |

Traps:

- ALB health checks are HTTP/HTTPS, not TCP.
- ALB should not health-check a DB-dependent page if DB load can kill healthy web instances.
- NLB does not have ALB-style path/host rules.

## 5.2 Global Accelerator vs Route 53 vs CloudFront

| Need | Choose |
|---|---|
| Static anycast IPs + nearest healthy endpoint | Global Accelerator |
| DNS routing policies | Route 53 |
| HTTP caching/edge content | CloudFront |
| TCP/UDP acceleration without HTTP cache | Global Accelerator |
| S3/static website acceleration/cache | CloudFront |

Traps:

- Route 53 can direct by latency/geolocation but does not provide fixed IPs.
- CloudFront IP ranges are not fixed per app and are not ideal allow-list targets.
- Global Accelerator can front ALBs/NLBs/EC2 EIPs and gives static IPs.

## 5.3 CloudFront + S3

Key patterns:

| Requirement | Pattern |
|---|---|
| Prevent direct S3 access | OAI/OAC + bucket policy |
| Serve S3 website endpoint features | S3 website endpoint as custom origin; OAI/OAC limitations apply |
| Restrict multiple files to members | Signed cookies |
| Restrict one file | Signed URL |
| Force HTTPS viewer access | Viewer protocol policy redirect HTTP to HTTPS |
| New S3 bucket returns 307 | Use regional S3 endpoint until propagation completes |
| SSE-KMS S3 origin | KMS key policy must allow the access path/principal |

S3 origin endpoint trap:

- S3 REST endpoint supports OAI/OAC origin access control.
- S3 website endpoint is treated as a custom HTTP origin and does not support OAI/OAC in the same way.
- Website endpoints require public-readable objects unless controlled through other origin restriction patterns.

## 5.4 Custom origin restriction

For CloudFront → ALB/custom origin:

- Add a secret custom header from CloudFront.
- Validate it at origin using ALB listener rule, app logic, or WAF.
- Security groups alone cannot restrict to “only this CloudFront distribution” unless using managed prefix lists/IP ranges, which are broader and may change.

## 5.5 Route 53 routing policy map

| Routing policy | Use |
|---|---|
| Simple | One basic target |
| Weighted | Controlled percentage/canary |
| Latency | Lowest latency AWS Region |
| Failover | Active/passive with health checks |
| Geolocation | Country/continent-based |
| Geoproximity | Bias traffic by geographic distance |
| Multivalue answer | DNS-level multiple healthy records |

Traps:

- Latency routing is not the same as geolocation.
- Failover requires health checks or evaluated target health.
- Alias records are used for AWS targets and can be zone-apex friendly.

---

# 6. Security, encryption, and compliance

## 6.1 S3 security

| Requirement | Pattern |
|---|---|
| Enforce encryption at rest | Default encryption + bucket policy deny missing SSE header |
| Enforce TLS | Bucket policy deny `aws:SecureTransport=false` |
| Deny public access | S3 Block Public Access |
| Discover PII | Macie |
| Object-level audit/IPs | S3 server access logs or CloudTrail data events |
| Make requester pay | Requester Pays |
| Prevent deletion/modification | Object Lock |
| Restrict access via approved network | S3 Access Point + VPC origin + bucket policy condition |
| Private access from VPC | Gateway endpoint |

Traps:

- ACLs are rarely the best answer.
- `aws:SecureTransport` handles transit, not at-rest.
- CloudTrail management events do not capture object-level S3 access.
- S3 lifecycle can expire data; no Lambda needed for simple retention.

## 6.2 KMS

Common permission requirements:

| Operation | Permission |
|---|---|
| Generate data key for client-side encryption | `kms:GenerateDataKey` |
| Decrypt object/data key | `kms:Decrypt` |
| Encrypt directly | `kms:Encrypt` |
| Re-encrypt | `kms:ReEncrypt*` |
| Describe key | `kms:DescribeKey` |

Traps:

- Key policy and IAM must both permit usage depending configuration.
- `kms:GetPublicKey` is for asymmetric keys, not envelope encryption data keys.
- For cross-account encrypted resources, both resource policy and KMS key policy must allow the external principal.

## 6.3 Secrets and config

| Requirement | Service |
|---|---|
| Secret rotation | Secrets Manager |
| Simple secure parameter/config | SSM Parameter Store SecureString |
| Private rotation Lambda | Secrets Manager interface VPC endpoint + DB access |

Trap: If a rotation Lambda in a private subnet times out, the missing path is usually to Secrets Manager, not to Lambda.

## 6.4 WAF, Shield, Firewall Manager, Network Firewall

| Service | Best for | Not for |
|---|---|---|
| AWS WAF | L7 HTTP(S) filtering, SQLi, XSS, geo/IP match | L3/L4 DDoS by itself |
| Shield Standard | Automatic baseline DDoS | Advanced visibility/cost protection |
| Shield Advanced | Enhanced DDoS, DRT, cost protection | SQLi/XSS rules |
| Firewall Manager | Central policy management across accounts | Single-resource config history |
| Network Firewall | Stateful network inspection | Web app SQLi replacement |
| Security Groups/NACLs | Network allow/deny | L7 payload inspection |

## 6.5 Security services map

| Requirement | Service |
|---|---|
| Threat detection from logs/events | GuardDuty |
| Vulnerability scanning | Inspector |
| Central findings view | Security Hub |
| S3 sensitive data | Macie |
| Resource compliance state/remediation | Config |
| API audit trail | CloudTrail |
| Investigation graph/forensics | Detective |

Common wrong pairings:

- Macie ≠ IP tracking.
- Inspector ≠ PII discovery.
- GuardDuty ≠ compliance enforcement.
- Security Hub ≠ automatic remediation by itself.
- Config ≠ packet capture.

## 6.6 CloudHSM

Quorum/M-of-N setup:

- Each Crypto Officer creates a signing key outside HSM.
- Register public key with `registerMofnPubKey`.
- Set quorum minimum with `setMValue`.
- `getToken` is used when performing quorum-protected actions after setup.

Trap: IAM policies do not configure CloudHSM quorum.

---

# 7. Compute, containers, and serverless

## 7.1 Lambda

Use Lambda for short event-driven tasks.

Limits/traps:

- Max runtime = 900 seconds.
- Use reserved concurrency to cap a function.
- Use provisioned concurrency to reduce cold starts.
- Use DLQ/on-failure destinations for asynchronous failure handling.
- Do not use Lambda directly for 40-minute transcoding, multi-hour processing, or large OS-level workloads.

Patterns:

| Scenario | Pattern |
|---|---|
| S3 upload triggers quick transform | S3 event → Lambda |
| Long video processing | S3 event → Lambda → ECS/Fargate RunTask |
| API backend | API Gateway → Lambda |
| Scheduled task | EventBridge rule → Lambda |
| Queue processing | SQS → Lambda event source mapping |

## 7.2 ECS/Fargate

Use ECS/Fargate when:

- containerised workload;
- no server management desired;
- variable workload;
- runtime exceeds Lambda;
- event-driven batch/container tasks.

Traps:

- Use ECS task role for app AWS permissions.
- Use execution role for pulling images and writing logs.
- Private subnet Fargate pulling from ECR needs NAT or VPC endpoints.
- Fargate removes EC2 host management; ECS on EC2 gives more control/certain instance types.

## 7.3 Auto Scaling

ASG traps:

- EC2 termination protection does not stop ASG termination.
- To debug unhealthy instances, suspend Terminate/ReplaceUnhealthy.
- Memory scaling for EC2 requires custom CloudWatch metrics; ECS service has CPU/memory metrics.
- Use ALB RequestCountPerTarget or target response time for web scaling when CPU is not representative.
- Use queue depth/backlog-per-instance for worker fleets.

## 7.4 HPC

Tightly coupled HPC:

- Cluster placement group.
- Same AZ.
- EFA-capable instances.
- Avoid burstable instances.

Availability vs performance trap: Multi-AZ is good for resilience but bad for tightly coupled low-latency HPC communication.

## 7.5 AppStream vs WorkSpaces

| Requirement | Use |
|---|---|
| Stream individual desktop applications to users | AppStream 2.0 |
| Full persistent managed desktop | WorkSpaces |

Trap: If the scenario says “desktop application delivery” and not “full desktop”, AppStream is often lower overhead/cost.

---

# 8. Application integration and orchestration

## 8.1 SQS feature traps

| Feature | Correct use | Wrong use |
|---|---|---|
| Message timer | Delay selected messages | Delay all queue messages |
| Delay queue | Delay all new messages | Delay selected messages only |
| Visibility timeout | Prevent duplicate processing after receive | Initial delivery delay |
| DLQ | Store failed messages after max receives | Scheduling/delay |
| FIFO | Strict order/deduplication | Maximum simple throughput |
| Standard | High throughput | Strict order |

FIFO throughput trap:

- Default FIFO API throughput is lower than Standard.
- Batch up to 10 messages per operation to raise effective message throughput.
- If strict order is not required, Standard is usually more scalable/cost-effective.

## 8.2 SQS vs Kinesis

| Requirement | Use |
|---|---|
| Decouple work items / one consumer processes each | SQS |
| Multiple consumers process same ordered stream | Kinesis Data Streams |
| Stream analytics/windowing | Kinesis/Flink |
| Managed delivery to S3/Redshift/OpenSearch | Firehose |
| Backpressure for DB writes | SQS |

Trap: Do not choose Kinesis just because there are many events if the use case is a queue/work distribution problem.

## 8.3 EventBridge

Use for:

- AWS service event rules;
- SaaS events;
- scheduled jobs;
- routing events to targets;
- event-driven remediation.

Trap: If S3 can directly notify Lambda/SQS/EventBridge, avoid CloudTrail+EventBridge unless audit events are specifically required.

## 8.4 Step Functions

Use for workflows with:

- multiple steps;
- retries/catch;
- branching;
- wait states;
- human approval/task token;
- service integrations.

Trap: Step Functions is orchestration, not high-throughput event streaming.

---

# 9. Storage and data transfer

## 9.1 S3 lifecycle and storage class traps

| Requirement | Storage class/pattern |
|---|---|
| Frequent first months, rare after | Lifecycle to IA/Glacier |
| Unknown access | Intelligent-Tiering |
| Infrequent quick access | Standard-IA |
| Archive, retrieval acceptable in minutes/hours | Glacier Flexible Retrieval |
| Deep long-term archive | Glacier Deep Archive |
| Retain/delete after period | Lifecycle expiration |

Trap: If the requirement says retrieval within a short time frame, Deep Archive may be wrong.

## 9.2 EBS/EFS/FSx

| Requirement | Choose |
|---|---|
| Block storage for one EC2 | EBS |
| Shared Linux NFS | EFS |
| Shared SMB/Windows | FSx for Windows |
| High-performance POSIX/HPC integrated with S3 | FSx for Lustre |
| Temporary local scratch | Instance store |

Traps:

- EBS is not a general shared filesystem.
- EFS One Zone may not meet Multi-AZ durability requirements.
- FSx Single-AZ to Multi-AZ requires migration to a new filesystem.
- EFS Max I/O trades higher metadata latency for scale; Provisioned Throughput controls throughput.

## 9.3 Storage Gateway vs DataSync

| Scenario | Use |
|---|---|
| On-prem users/apps need file share backed by S3 | S3 File Gateway |
| On-prem SMB access to FSx | FSx File Gateway |
| One-time or repeated data movement | DataSync |
| Hybrid cache/live interface | Storage Gateway |

## 9.4 Snow family and transfer

Decision rules:

- Calculate bandwidth/time roughly.
- If 25 TB over 1 Gbps is feasible and faster than shipping, use internet + Transfer Acceleration if long-distance.
- If 40 TB over 12 Mbps must complete in 3 months, use Snowball for non-critical bulk data and online replication/MGN for critical workloads.
- Transfer Family is for SFTP/FTPS/FTP endpoints, not generic acceleration.

---

# 10. Databases, analytics, and data processing

## 10.1 RDS/Aurora

| Requirement | Correct concept |
|---|---|
| HA in same Region | Multi-AZ |
| Read scale | Read replicas / Aurora replicas |
| Cross-Region DR | Cross-Region read replica / Aurora Global Database |
| Low-latency global reads/writes | Aurora Global Database or DynamoDB global tables depending data model |
| Automatic read replica scaling | Aurora Auto Scaling |
| Writer scaling | Change instance class/serverless v2; not replica autoscaling |

Traps:

- Multi-AZ standby is not normally used for reads.
- Read replicas are asynchronous.
- Aurora storage auto-scales by design.
- Oracle RAC is not supported by RDS; self-manage on EC2 if RAC is mandatory.

## 10.2 DynamoDB

| Feature | Use |
|---|---|
| TTL | Expire items |
| Streams | Change capture |
| Global tables | Multi-Region active-active |
| DAX | Microsecond read cache |
| On-demand | Unpredictable traffic |
| Auto Scaling | Provisioned capacity adjustment |
| Conditional writes | Optimistic concurrency/idempotency |

Traps:

- DAX does not buffer writes.
- TTL deletion is eventual, not immediate.
- Global tables are not a hot partition fix.
- DynamoDB is wrong if SQL joins/relational constraints are core and no refactor is allowed.

## 10.3 ElastiCache

Redis vs Memcached:

| Redis | Memcached |
|---|---|
| Replication/HA | Simple cache |
| Persistence options | No persistence |
| Rich data structures | Simple key/value |
| Session store | Simple caching |

Trap: Cache is not durable queue/storage. Do not use it to avoid data loss from failed writes.

## 10.4 Redshift, Athena, Glue, EMR

| Requirement | Service |
|---|---|
| Data warehouse | Redshift |
| Query S3 via Redshift | Redshift Spectrum |
| Serverless ad hoc SQL over S3 | Athena |
| Serverless ETL/schema discovery | Glue |
| Hadoop/Spark managed cluster | EMR |

EMR Spot trap:

- Master node Spot interruption kills cluster.
- Core node Spot interruption can cause HDFS data loss.
- Task nodes are safe(er) for Spot because they do not store HDFS.

Glue trap:

- If transformation rules will evolve and schema discovery matters, Glue crawler/classifier + ETL is more extensible than a chain of Lambda functions.

## 10.5 DMS/SCT

DMS is migration/replication; SCT converts schema/code where engines differ.

Redshift target traps:

- Redshift and replication instance must be same account/Region.
- DMS stages data through S3.
- Redshift SG must allow replication instance.
- Custom DNS endpoint can fail for Redshift target.
- CLI/API use may require manually created IAM roles.

---

# 11. Migration and modernisation

## 11.1 Migration tool map

| Need | Tool |
|---|---|
| Server discovery/dependency | Application Discovery Service / Migration Hub |
| Low-downtime server rehost | Application Migration Service (MGN) |
| VM image import/export | VM Import/Export |
| Database migration/replication | DMS |
| Schema conversion | SCT |
| File/data sync | DataSync |
| Bulk offline data | Snowball |
| SFTP interface | Transfer Family |

Traps:

- Agentless discovery gives vCenter-level metadata; agent-based gives deeper physical/server info.
- MGN is for lift-and-shift servers, not schema conversion.
- DMS does not convert app logic; SCT helps schema conversion.
- Snowball data imported to S3 may then require VM Import/Export or further processing.

## 11.2 7 Rs

| Strategy | When |
|---|---|
| Rehost | Fast lift-and-shift |
| Replatform | Managed-service optimisation without major rewrite |
| Refactor | Significant architecture change |
| Repurchase | Move to SaaS |
| Retire | Remove unused |
| Retain | Keep for now |
| Relocate | Move platform wholesale |

Trap: If question says minimal change and quick migration, refactor is usually wrong.

---

# 12. Disaster recovery and resilience

## 12.1 RTO/RPO map

| Pattern | Cost | RTO | RPO | Notes |
|---|---:|---:|---:|---|
| Backup/restore | Low | Hours+ | Hours+ | Restore on disaster |
| Pilot light | Low-medium | Tens of minutes | Minutes-hours | Core data components live |
| Warm standby | Medium | Minutes | Minutes | Scaled-down full stack |
| Active-active | High | Near-zero | Near-zero | Full multi-Region operations |

Traps:

- RTO of 5 minutes usually requires pre-provisioned app and data path, not snapshots alone.
- RPO of near zero requires continuous replication/synchronous where supported.
- Multi-AZ is not multi-Region DR.
- Route 53 failover can switch DNS but cannot create missing backend capacity.

## 12.2 Data-tier DR

| Service | DR pattern |
|---|---|
| RDS | Cross-Region read replica, backups, snapshots |
| Aurora | Global Database / cross-Region replicas |
| DynamoDB | Global tables |
| S3 | CRR / RTC |
| EFS | Backup/replication depending requirement |
| FSx | Backup/restore or DataSync to new FSx |

---

# 13. Monitoring and operations

## 13.1 Tool distinctions

| Tool | Answers |
|---|---|
| CloudWatch Metrics | Numeric telemetry/alarms |
| CloudWatch Logs | Log collection/query/retention |
| CloudTrail | API activity/audit |
| AWS Config | Resource configuration/compliance |
| X-Ray | Distributed tracing |
| Systems Manager | Ops actions, patching, session, automation |
| EventBridge | Event routing/scheduled triggers |

Common traps:

- CloudWatch dashboard is not an alerting/remediation architecture by itself.
- Config can trigger remediation; CloudTrail alone cannot enforce state.
- X-Ray traces request paths; it is not a log shipping agent.

## 13.2 Systems Manager

Use SSM for:

- Session Manager instead of SSH/bastion.
- Patch Manager with patch baselines and patch groups.
- Run Command for ad hoc commands.
- Automation runbooks for repeatable ops.
- Parameter Store for config.
- Maintenance Windows for scheduled maintenance.

Patch trap:

- Patch groups should tag by environment and OS. If production should wait, separate production patch group/baseline from dev/test.

---

# 14. Cost optimisation

## 14.1 Purchase models

| Workload | Model |
|---|---|
| Predictable baseline | Savings Plans / RIs |
| Variable | On-Demand |
| Fault-tolerant/batch | Spot |
| One-time short job | Avoid RI |
| Critical master/core EMR with HDFS | On-Demand |

## 14.2 Billing tools

| Need | Use |
|---|---|
| Alert when cost/usage/RI coverage threshold crossed | AWS Budgets |
| Explore spend trends | Cost Explorer |
| Detailed billing dataset | CUR |
| Org-level billing data | CUR from management account |
| Visualise CUR | QuickSight/Athena |

Traps:

- RI coverage: how much usage is covered by RIs.
- RI utilisation: how much purchased RI time is used.
- Use Budgets for RI coverage alerts, not Cost Explorer alone.
- CUR is not created by OpsWorks or per-OU in Cost Explorer.

## 14.3 Common cost traps

- Direct Connect for a single latency issue when moving DB to AWS or caching fixes it.
- DAX when normal DynamoDB latency is acceptable.
- ElastiCache when durable queueing is needed.
- Always-on EC2 worker polling when event-driven Fargate/Lambda is possible.
- Loading historical data into Redshift when Spectrum can query S3.
- Overusing Multi-AZ/Multi-Region when RTO/RPO allow cheaper patterns.

---

# 15. High-value scenario patterns

## 15.1 Private subnet cannot access AWS service

1. Identify target service.
2. If S3/DynamoDB → gateway endpoint.
3. If Kinesis/Secrets/ECR/CloudWatch/SSM → interface endpoints.
4. If not private-only and quickest acceptable → NAT Gateway in public subnet.
5. Avoid public internet when security requires approved private networks.

## 15.2 Static IPs

- Global + static IP + nearest endpoint: Global Accelerator.
- Regional TCP/custom port + static IP: NLB with EIPs per AZ.
- ALB does not provide stable IPs.
- Route 53 does not solve fixed IP allow-listing.

## 15.3 Database overloaded

- Reads: read replicas/Aurora replicas and/or ElastiCache.
- Writes: scale writer/capacity, decouple with SQS if writes can be asynchronous.
- Health checks should avoid DB dependency if DB overload can kill app instances.

## 15.4 Logs lost due ASG termination

- Stream app logs to CloudWatch Logs.
- Use X-Ray for request tracing.
- Enable DB slow query logs/Performance Insights for query bottlenecks.
- To manually inspect instance, suspend ASG termination/replacement.

## 15.5 Long-running upload-triggered processing

- S3 upload event.
- If <15 mins: Lambda.
- If >15 mins: Lambda/EventBridge triggers ECS/Fargate/Batch.
- Avoid always-on polling EC2 if event-driven task is feasible.

## 15.6 S3 data lake restricted to approved network

- Gateway VPC endpoint for S3.
- S3 Access Point with VPC/network origin control where appropriate.
- Bucket policy condition on specific access point ARN or VPC endpoint.
- Do not use NAT Gateway if public exposure is disallowed.

## 15.7 Multi-account central logging

- CloudWatch Logs subscription filters can stream to Kinesis/Firehose in central account.
- Org-level CloudTrail can centralise API logs.
- S3 bucket policies/KMS key policies must allow writing from member accounts/services.

## 15.8 Multi-account cost reporting

- Create CUR from management account.
- Store in S3.
- Analyse via Athena/QuickSight.
- Use Cost Categories/tags/OUs for allocation.

---

# 16. What this atlas deliberately does not do

This atlas does not try to store every answer letter from the 765 questions. That would be brittle because extracted answer labels can be noisy. Instead, it stores:

- reusable service boundaries;
- scenario-to-pattern mappings;
- high-frequency distractors;
- answer-key inconsistency rules;
- mental models that generalise to unseen questions.

For live practice, the correct behaviour is still: **read the scenario, obey the Select count, reason from first principles, then use this atlas only to check traps**.
