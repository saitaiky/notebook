---
title: Others
description: Others
keywords:
  - Others
---


## AWS Managed Microsoft AD vs AD Connector vs Simple AD

- You should use AD Connector if you only need to allow your on-premises users to log in to AWS applications with their Active Directory credentials.
- Simple AD is the least expensive option and your best choice if you have 5,000 or fewer users and don't need the more advanced Microsoft Active Directory features such as trust relationships with other domains.
- AWS Managed Microsoft AD would also allow you to run directory-aware workloads in the AWS Cloud. AWS Managed Microsoft AD is your best choice if you have more than 5,000 users and need a trust relationship set up between an AWS hosted directory and your on-premises directories.

## AWS Directory Service

AWS Directory Service for Microsoft Active Directory (Standard Edition or Enterprise Edition) is an actual Microsoft Active Directory in the AWS Cloud. It automatically creates an AWS security group in your VPC with network rules for traffic in and out of AWS managed domain controllers. The default inbound rules allow traffic from any source (0.0.0.0/0) to ports required by Active Directory. These rules do not introduce security vulnerabilities, as traffic to the domain controllers is limited to traffic from your VPC, other peered VPCs, or networks connected using AWS Direct Connect, AWS Transit Gateway or Virtual Private Network.

In addition, the ENIs the security group is attached to, do not and cannot have Elastic IPs attached to them, limiting inbound traffic to local VPC and VPC routed traffic.


## CloudHSM (Hardware Security Module))

AWS CloudHSM (Hardware Security Module) is a cloud-based service that provides secure hardware for generating and storing cryptographic keys and performing cryptographic operations in a tamper-resistant environment.

:::infoKMS vs HSM
If you need to secure your encryption keys in a service backed by FIPS-validated HSMs, but you do not need to manage the HSM, you should use KMS.
:::

## Others

- Aws neptune (Fully Managed Graph Database)
- Security
  - AWS GuardDuty is a threat detection service that monitors malicious activity and unauthorized behavior to protect your AWS account.
