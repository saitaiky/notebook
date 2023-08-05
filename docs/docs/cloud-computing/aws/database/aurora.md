---
title: Aurora
description: Aurora
keywords:
  - Aurora
sidebar_position: 4
---

Amazon Aurora is a fully managed relational database engine developed by AWS. It offers high performance, availability, and scalability, while being compatible with MySQL and PostgreSQL. Aurora's architecture is designed for cloud-native capabilities and provides features like automatic backups, replication, and seamless scaling to meet the demands of modern applications.

## Notes for networking

To connect to an Amazon Aurora DB cluster **directly from outside the VPC**, the instances in the cluster must meet the following requirements:
- The Aurora DB instance must have a public IP address
- The Aurora DB instance must be running in a publicly accessible subnet and create the Aurora DB instance from this subnet group
- Enable the VPC attributes `DNS hostnames` and `DNS resolution`

![ip&public-access.png](/img/aws/database/aurora/ip&public-access.png)

![vpc-settings](/img/aws/database/aurora/vpc-settings.png)

## Global Database

With [Global Database](https://aws.amazon.com/rds/aurora/global-database/), a single Aurora database can span multiple AWS regions to enable fast local reads and quick disaster recovery between regions. 

The difference between **Aurora Global DB** and **Cross-region Read Replicas** is that Global DB is **physical replication(hardware)** where Read replicas are **logical replication**.

With an Aurora global database, you can choose from two different approaches to failover:
- Managed planned failover
- Unplanned failover

## Logging for MySQL-compatible DB cluster

By design, Aurora Serverless connects to a proxy fleet of DB instances that scales automatically. Because there isn't a direct DB instance to access and host the log files, you can't view the logs directly from the Amazon Relational Database Service (Amazon RDS) console. However, you can view and download logs that are sent to the CloudWatch console.

Further reading: [How can I enable logs on an Aurora Serverless cluster so I can view and download the logs?](https://aws.amazon.com/premiumsupport/knowledge-center/aurora-serverless-logs-enable-view/)
## Failover

In the event of an outage that impacts an entire Availability Zone (AZ) and renders the primary instance of an Amazon Aurora cluster unavailable, the appropriate action to bring the database online depends on the cluster's configuration.

- Automatic
  - If the cluster includes reader instances in other AZs, Aurora's failover mechanism is utilized, promoting one of the reader instances to become the new primary instance. 
- Manual
  - However, if the cluster only contains a single DB instance or all reader instances are in the affected AZ, manual creation of new DB instances in another AZ is necessary to restore the database's availability.

## Features

### Aurora Reader Endpoint

![reader-endpoin](/img/aws/database/aurora/reader-endpoint.webp)

Source: [AWS Aurora — Why is it better?](https://crishantha.medium.com/aws-aurora-why-is-it-better-6faae33a0ed0)

The reader endpoint in Aurora DB clusters enables load-balancing for read-only connections, distributing read operations among Aurora Replicas. This reduces the primary instance's workload and allows the cluster to handle simultaneous SELECT queries, scaling capacity based on the number of Aurora Replicas. 

Each Aurora DB cluster **has one reader endpoint**, which load-balances connections among the Aurora Replicas for read-only statements like SELECT queries.