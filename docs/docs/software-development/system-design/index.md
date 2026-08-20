---
title: 'System Design'
description:
  'Vendor-neutral system design covering architecture, APIs, data, messaging, scaling, reliability, and security.'
sidebar_label: Overview
sidebar_position: 0
keywords:
  - system design
  - software architecture
  - distributed systems
  - reliability
  - scalability
---

System design translates requirements into boundaries, data flows, failure behaviour, and operational responsibilities.
This section owns the vendor-neutral mechanisms. Follow the linked AWS pages when you want to see how a managed service
implements a particular choice.

## Design path

- **Architecture:** compare
  [architectural styles](/software-development/system-design/architectural-style/architectures/),
  [microservices and monoliths](/software-development/system-design/architectural-style/microservice-vs-monolith/), and
  [backend-for-frontend](/software-development/system-design/architectural-style/bff/).
- **Interfaces:** start with the [API overview](/software-development/system-design/api/overview/) and
  [API-first design](/software-development/system-design/api/api-first-mindset/).
- **Data:** study [CAP](/software-development/system-design/data/cap-theorem/),
  [SQL versus NoSQL](/software-development/system-design/data/nosql-vs-sql/),
  [caching](/software-development/system-design/data/cache/), and
  [replication and sharding](/software-development/system-design/data/horizontal-scaling/replication/).
- **Communication:** compare [synchronous and asynchronous work](/software-development/system-design/sync-async/) and
  [queue delivery semantics](/software-development/system-design/sync-async/queue/overview/).
- **Scale and resilience:** connect
  [availability](/software-development/system-design/models-patterns-strategy/scaling/availability/),
  [reliability](/software-development/system-design/models-patterns-strategy/scaling/reliability/), and
  [load balancing](/software-development/system-design/models-patterns-strategy/scaling/load-balancing/).
- **Security:** distinguish [authentication](/software-development/system-design/security/authentication/),
  [authorization](/software-development/system-design/security/authorization/), and
  [encryption](/software-development/system-design/security/encryption/).

## Map the design to AWS

| Design concern                 | AWS section                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Runtime and horizontal scaling | [Compute](/aws/compute/ec2/) and [Elastic Load Balancing](/aws/networking/elb/)                       |
| Durable and distributed data   | [Databases](/aws/database/) and [Storage](/aws/storage/s3/)                                           |
| Queues, events, and workflows  | [Integration and messaging](/aws/integration-messaging/sqs/)                                          |
| Network boundaries             | [VPC](/aws/networking/vpc/) and [private-access patterns](/aws/networking/private-access-comparison/) |
| Identity and policy            | [IAM](/aws/management/iam/) and [AWS security](/aws/security/assume-role/)                            |
| Observability and operations   | [CloudWatch](/aws/management/cloudwatch/) and [monitoring](/aws/management/monitor/)                  |
