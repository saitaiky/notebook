---
title: 'Cross-Cutting Architecture Concepts'
description:
  'Operational and architectural concepts that span design, delivery, security, resilience, and platform work.'
sidebar_label: Overview
sidebar_position: 0
keywords:
  - software architecture
  - monitoring
  - disaster recovery
  - software quality
  - platform engineering
---

Some concerns do not belong to one lifecycle phase. They constrain architecture, implementation, delivery, and
operations at the same time. This section keeps those cross-cutting concepts together while linking them back to their
deeper system-design, Linux, and AWS counterparts.

## Operational concerns

- [Monitoring](/software-development/others/monitoring/) and [quality](/software-development/others/quality/) define the
  feedback needed to operate a system.
- [Disaster recovery](/software-development/others/disaster-recovery/) connects recovery objectives to architecture and
  cost.
- [Storage concepts](/software-development/others/storage/) and
  [stateful versus stateless design](/software-development/others/stateful-vs-stateless/) influence scaling and failure
  recovery.
- [IAM concepts](/software-development/others/iam/) provide a bridge to the dedicated
  [authentication and identity section](/software-development/authentication/).
- [Lockfiles](/software-development/others/lockfile/) explain reproducible dependency resolution across package
  managers.

## Apply the concerns

Use [Linux](/linux/) for process, filesystem, user, and permission mechanics. Use AWS pages for managed implementations:
[CloudWatch](/aws/management/cloudwatch/) for observability,
[AWS database recovery patterns](/aws/database/#disaster-recovery-strategies-rtorpo) for recovery,
[AWS storage](/aws/storage/s3/) for persistence, and [IAM](/aws/management/iam/) for cloud authorization.
