---
title: 'Data and Databases'
description:
  'Data modelling, relational and NoSQL databases, query efficiency, concurrency, and distributed storage choices.'
sidebar_label: Overview
sidebar_position: 0
keywords:
  - database
  - data modelling
  - sql
  - nosql
  - distributed data
---

Database decisions begin with access patterns, consistency, scale, and ownership—not with a product name. This section
builds those foundations before mapping them to AWS database and storage services.

## Foundations and implementation

- [Data modelling](/software-development/database/data-modeling/) and
  [normalisation](/software-development/database/normalization/) explain how structure follows relationships and update
  behaviour.
- [SQL time efficiency](/software-development/database/sql-time-efficiency/) and
  [concurrent PostgreSQL access](/software-development/database/concurrently-withpsycopg/) connect schema choices to
  runtime behaviour.
- [Big data](/software-development/database/big-data/) introduces workloads that outgrow a single transactional
  database.
- [DynamoDB notes](/software-development/database/dynamoDB/) cover NoSQL access patterns from a general development
  perspective.
- [Knowledge graphs](/software-development/database/knowledge-graph/) model connected entities where relationships are
  first-class.

For distributed application patterns, continue with [CAP](/software-development/system-design/data/cap-theorem/),
[replication and sharding](/software-development/system-design/data/horizontal-scaling/replication/), and
[microservice data management](/software-development/system-design/data/data-management/).

## Apply the choices on AWS

| Requirement                        | AWS starting point                                                       |
| ---------------------------------- | ------------------------------------------------------------------------ |
| Managed relational transactions    | [RDS and Aurora](/aws/database/rds/)                                     |
| Key-value/document access at scale | [DynamoDB](/aws/database/dynamoDB/)                                      |
| In-memory caching                  | [ElastiCache](/aws/database/elastic-cache/)                              |
| Analytical warehouse               | [Redshift](/aws/database/redshift/) and [Athena](/aws/analytics/athena/) |
| Durable objects or shared files    | [S3](/aws/storage/s3/) and [EFS](/aws/storage/efs/)                      |
