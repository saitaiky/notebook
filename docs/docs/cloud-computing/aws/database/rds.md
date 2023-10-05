---
title: RDS
description: RDS
keywords:
  - RDS
sidebar_position: 1
---

Amazon RDS (Relational Database Service) is a managed database service offered by AWS that simplifies the process of setting up, operating, and scaling relational databases in the cloud. It allows you to choose from various database engines such as **MySQL, PostgreSQL, MariaDB, Oracle**, and **Microsoft SQL Server**, and provides automated tasks like hardware provisioning, patching, backup, recovery, and scaling. 

Important points to remember:
- You can only enable encryption for an Amazon RDS DB instance when you create it
- You can’t disable encryption on an encrypted DB instance
- *You can’t have an encrypted Read Replica of an unencrypted DB instance or an unencrypted Read Replica of an encrypted DB instance*
- You *can’t restore an unencrypted backup or snapshot to an encrypted DB instance*.
- To copy an encrypted snapshot from one region to another, you must specify the KMS key identifier of the destination region.

## Behaviour

### Replication

- These 2 are the most important points to remember for SysOps exam
  - Multi-AZ follows **synchronous replication** and spans at least two Availability Zones within a single region. 
  - Read replicas follow **asynchronous replication** and can be within an Availability Zone, Cross-AZ, or Cross-Region

![read replica table](/img/aws/database/rds/read-replica-table.png)

Source: [Working with read replicas](https://aws.amazon.com/rds/features/read-replicas/)

### Backup without outages

Amazon RDS creates a storage volume snapshot of your DB instance, backing up the entire DB instance and not just individual databases. 

- **Single-AZ DB**: Creating this DB snapshot on a Single-AZ DB instance results in a brief I/O suspension that can last from a few seconds to a few minutes, depending on the size and class of your DB instance. 
- **Multi-AZ DB**: **Multi-AZ DB instances are not affected by this I/O suspension(outages)** since the backup is taken on standby.
## Feature

### Encryption in flight

In the **DB parameter groups** - You can allow only SSL connections to your RDS for PostgreSQL database instance by enabling the `rds.force_ssl` parameter ("0" by default) through the parameter groups page on the RDS Console or through the CLI.

Source: [Amazon RDS for PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html#PostgreSQL.Concepts.General.SSL)

:::infoFor application doesn't accept certificate chains
A root certificate that works for all regions can be downloaded from the AWS website. It is the trusted root entity and should work in most cases but might fail if your application doesn’t accept certificate chains. If your application doesn’t accept certificate chains, download the AWS Region–specific certificate from AWS. Ref: [Using SSL/TLS to encrypt a connection to a DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html)
:::

### Encryption at rest

You can only enable encryption for an Amazon RDS DB instance when you create it, not after the DB instance is created. However, because **you can encrypt a copy of an unencrypted DB snapshot**, you can effectively add encryption to an unencrypted DB instance. That is, you can create a snapshot of your DB instance and then create an encrypted copy of that snapshot. You can then restore a DB instance from the encrypted snapshot, and thus you have an encrypted copy of your original DB instance.

### TDE for Oracle

Oracle Transparent Data Encryption (TDE), a feature of the Oracle Advanced Security option available in Oracle Enterprise Edition. This feature automatically encrypts data before it is written to storage and automatically decrypts data when the data is read from storage.

In order to enable Transparent Data Encryption for your RDS, you need to 
1. Creating an **option group** and add Transparent Data Encryption (TDE) option
2. Associating the option group to the DB instance
3. Creating database encryption key (DEK) on the database and enable encryption on the database

![option-group-to-enable-transparent-data-encryption](/img/aws/database/rds/option-group-to-enable-transparent-data-encryption.png)

![transparent-data-encryption-in-aws-rds-option-grou](/img/aws/database/rds/transparent-data-encryption-in-aws-rds-option-grou.png)

:::infoWhat is option group?
Some DB engines offer additional features that make it easier to manage data and databases, and to provide additional security for your database. Amazon RDS uses **option groups** to enable and configure these features. An *option group* can specify features, called options, that are available for a particular Amazon RDS DB instance. 
:::


### RDS Proxy

> TL;DR - RDS Proxy as a connection pool for handling overwhelmed connections / unpredictable surges in database traffic.
 
Amazon RDS Proxy enhances database efficiency and scalability for applications, including modern serverless ones, **by pooling and sharing connections to the database**. This helps prevent memory and compute exhaustion caused by **frequent opening and closing of connections**. 

RDS Proxy reduces failover times, integrates with AWS Secrets Manager and IAM for secure access, and efficiently manages variable workloads, allowing multiple application connections to share resources and regulating connection openings. Enabling RDS Proxy requires no code changes or additional infrastructure management, making it a seamless solution for optimizing database performance and application availability.

### Enhanced Monitoring

Enhanced Monitoring for RDS provides the following **OS level metrics** which are free memory, active memory, swap free, processes running, file system used. It is useful when you want to see how **different processes or threads** on a DB instance use the CPU.

:::infoNormal CloudWatch metrics vs Enhanced Monitoring
A hypervisor creates and runs virtual machines (VMs). Using a hypervisor, an instance can support multiple guest VMs by virtually sharing memory and CPU. **CloudWatch** gathers metrics about CPU utilization from the **hypervisor** for a DB instance. In contrast, **Enhanced Monitoring** gathers its metrics from an agent on the DB instance.

You might find differences between the CloudWatch and Enhanced Monitoring measurements, because the hypervisor layer performs a small amount of work. The differences can be greater if your DB instances use smaller instance classes. In this scenario, more virtual machines (VMs) are probably managed by the hypervisor layer on a single physical instance.

Reference: 
- [Overview of Enhanced Monitoring](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.overview.html)
- [Hypervisor](/tech-concepts/glossary/others/#hypervisor)
:::
## Scalability

### Read scalability

![read replica](/img/aws/database/rds/read-replica.png)

Source: [Working with read replicas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html)

Important points:

- Any updates made to the primary DB instance are **asynchronously** copied to the read replica. So both these options are incorrect.
- Writing to tables on a read replica can break the replication
- If the value for the `max_allowed_packet` parameter for a read replica is less than the `max_allowed_packet` parameter for the source DB instance, replica errors occur. 

## Availability 

### Maintaince downtime

Upgrades to the **database engine level** require **downtime**. Even if your RDS DB instance uses a Multi-AZ deployment, both *the primary and standby DB instances are upgraded at the same time*. This causes downtime until the upgrade is complete, and the duration of the downtime varies based on the size of your DB instance.

Source: [How do I minimize downtime during required Amazon RDS maintenance?](https://aws.amazon.com/premiumsupport/knowledge-center/rds-required-maintenance/)
### Handle failover

![Amazon RDS Multi-AZ Deployments](/img/aws/database/rds/multi-az-deployments.png)

Source: [Amazon RDS Multi-AZ Deployments](https://www.amazonaws.cn/en/rds/features/multi-az/)

When you provision an RDS Multi-AZ DB Instance, Amazon RDS automatically creates a primary DB Instance and synchronously replicates the data to a standby instance in a different Availability Zone (AZ). It provides enhanced availability and durability for RDS database (DB) instances, making them a natural fit for production database workloads.

- Amazon RDS *automatically initiates a failover* to the standby, in case the primary database fails for any reason  
- RDS applies OS updates by performing maintenance on the standby, then promoting the standby to primary, and finally performing maintenance on the old primary, whic

## Security

Amazon RDS Read Replicas - If the master database is encrypted, the read replicas are encrypted.

## Troubleshooting

### Error when Backup retention set to 0

RDS retains backups of a DB Instance for a limited, user-specified period of time called the retention period, which by default is 7 days but can be set to up to 35 days. 

There are several reasons why you may need to set the backup retention period to 0. For example, you can **disable automatic backups immediately** by setting the retention period to 0. If you set the value to 0 and receive a message saying that the retention period must be between 1 and 35, check to make sure **you haven’t setup a read replica for the instance**. **Read replicas require backups for managing read replica logs**, thus, you can’t set the retention period of 0.