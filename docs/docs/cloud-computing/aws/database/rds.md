---
title: RDS
description: RDS
keywords:
  - RDS
sidebar_position: 1
---


## Feature

### Ensure all connections to RDS are encrypted

In the **DB parameter groups** - You can allow only SSL connections to your RDS for PostgreSQL database instance by enabling the rds.force_ssl parameter ("0" by default) through the parameter groups page on the RDS Console or through the CLI.

Source: [Amazon RDS for PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html#PostgreSQL.Concepts.General.SSL)

###  Enhanced Monitoring

Enhanced Monitoring for RDS provides the following **OS level metrics** which are free memory, active memory, swap free, processes running, file system used. It is useful when you want to see how **different processes or threads** on a DB instance use the CPU.

:::infoNormal CloudWatch metrics vs Enhanced Monitoring
- **[Basic level]** CloudWatch gathers metrics about CPU utilization from the hypervisor for a DB instance 
- **[OS level]** Enhanced Monitoring gathers its metrics from an agent on the instance.
:::
## Scalability

### Read scalability

![read replica](/img/aws/database/read-replica.png)

Source: [Working with read replicas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html)

- Any updates made to the primary DB instance are **asynchronously** copied to the read replica. So both these options are incorrect.
- Writing to tables on a read replica can break the replication
- If the value for the `max_allowed_packet` parameter for a read replica is less than the `max_allowed_packet` parameter for the source DB instance, replica errors occur. 

## Availability 

### Maintaince downtime

Upgrades to the **database engine level** require **downtime**. Even if your RDS DB instance uses a Multi-AZ deployment, both *the primary and standby DB instances are upgraded at the same time*. This causes downtime until the upgrade is complete, and the duration of the downtime varies based on the size of your DB instance.

Source: [How do I minimize downtime during required Amazon RDS maintenance?](https://aws.amazon.com/premiumsupport/knowledge-center/rds-required-maintenance/)
### Handle failover

![Amazon RDS Multi-AZ Deployments](/img/aws/database/multi-az-deployments.png)

Source: [Amazon RDS Multi-AZ Deployments](https://www.amazonaws.cn/en/rds/features/multi-az/)

When you provision an RDS Multi-AZ DB Instance, Amazon RDS automatically creates a primary DB Instance and synchronously replicates the data to a standby instance in a different Availability Zone (AZ). It provides enhanced availability and durability for RDS database (DB) instances, making them a natural fit for production database workloads.

- Amazon RDS *automatically initiates a failover* to the standby, in case the primary database fails for any reason  
- RDS applies OS updates by performing maintenance on the standby, then promoting the standby to primary, and finally performing maintenance on the old primary, whic

## Security

Amazon RDS Read Replicas - If the master database is encrypted, the read replicas are encrypted.