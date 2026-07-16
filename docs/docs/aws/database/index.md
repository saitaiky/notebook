---
title: Database
description: Overview of AWS database services including RDS, Aurora, DynamoDB, ElastiCache, Redshift with operation, security, reliability, and cost considerations.
keywords:
  - aws
  - amazon web services
  - database
  - index
  - database aws
  - database guide
  - database on aws
  - database tutorial
---

## Database types

- **RDBMS (= SQL/ OLTP)**: RDS.Aurora - great for joins
- **NoSQL database**: 
    - DynamoDB (~]SON)
    - ElastiCache (key / value pairs).
    - Neptune (graphs) - no joins, no SQL
- **Object Store**: S3 (for big objects) / Glacier (for backups / archives)
- **Data Warehouse** (= SOL Analytics / BI): Redshift (OLAP - Online analytics processing), Athena
- **Search**: ElasticSearch (SON) - free text, unstructured searches
- **Graphs**: Neptune - displays relationships between data

## DBs
### RDS
- **Operations**: small downtime when failover happens, when maintenance
happens, scaling in read replicas / ec2 instance / restore EBS implies
manual intervention, application changes
- **Security**: AWS responsible for OS security, we are responsible for setting
up KMS, security groups, lAM policies, authorizing users in DB. using SSL
- **Reliability**: Multi AZ feature, failover in case of failures
- **Performance**: depends on EC2 instance type, EBS volume type, ability to
add Read Replicas. Doesn't auto-scale
- **Cost**: Pay per hour based on provisioned EC2 and EBS

### Aurora
- **Operations**: less operations, auto scaling storage
- **Security**: AVVS responsible for OS security, we are responsible for setting
up KMS, security groups, lAM policies, authorizing users in DB, using SSL.
- **Reliability**: Multi AZ, highly available, possibly more than RDS,Aurora
Serverless option.
- **Performance**: 5x performance (according to AVVS) due to architectural
optimizations. Up to 15 Read Replicas (only 5 for RDS)
- **Cost**: Pay per hour based on EC2 and storage usage. Possibly lower
costs compared to Enterprise grade databases such as Oracle

### ElastiCache
- **Operations**: same as RDS
- Security. AWS responsible for OS security, we are responsible for setting
up KMS, security groups, AM policies, users (Redis Auth), using SSL
- **Reliability**: Clustering, Multi AZ
- **Performance**: Sub-millisecond performance, in memory, read replicas for
sharding, very popular cache option
- **Cost**: Pay per hour based on EC2 and storage usage

### DynamoDB
- **Operations**: no operations needed, auto scaling capability serverless
- **Security**: full security through AM policies, KMS encryption, SSL in flight
- **Reliability**: Multi AZ, Backups
- **Performance**: single digit millisecond performance, AX for caching
reads, performance doesn't degrade if your application scales
- **Cost**: Pay per provisioned capacity and storage usage (no need to guess
in advance any capacity - can use auto scaling)

### Aurora
- **Operations**: no operations needed
- **Security**: AM. Bucket Policies, ACL. Encryption (Server/Client), SSL
- **Reliability**: 99.999999999% durability / 99.99% availability, Multi AZ, CRR
- **Performance**: scales to thousands of read / writes per second, transfer
acceleration / multi-part for big files
- **Cost**: pay per storage usage. network cost, requests number

### Redshift
- **Operations**: similar to RDS
- **Security**: IAM.VPC, KMS, SSL (similar to RDS)
- **Reliability**: highly available, auto healing features
- **Performance**: 10x performance vs other data warehousing, compression
- **Cost**: pay per node provisioned, I/IQ' of the cost vs other warehouses
- **Remember**: Redshift = Analytics / BI / Data Warehouse

### ElasticSearch
- **Operations**: similar to RDS
- **Security**: Cognito, IAM,VPC, KMS. SSL
- **Reliability**: Multi-AZ. clustering
- **Performance**: based on ElasticSearch project (open source), petabyte scale
- **Cost**: pay per node provisioned (similar to RDS)
- **Remember**: ElasticSearch = Search / Indexing

## Tools

### AWS DMS

AWS Database Migration Service (AWS DMS) is a cloud service that makes it possible to migrate relational databases, data warehouses, NoSQL databases, and other types of data stores. You can use AWS DMS to migrate your data into the AWS Cloud or between combinations of cloud and on-premises setups.

:::info DMS + AWS Macie
One combination that you could use is to set S3 as a Target of AWS DMS, then once the data is fully copied to S3, create **a Macie** classification job to analyze the S3 objects. Reference: [Using Amazon S3 as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.S3.html)

![amazon-macie-s3-dms](/img/aws/database/amazon-macie-s3-dms.png)
:::

## AWS Schema Conversion Tool(SCT)

AWS offers two schema conversion solutions to make heterogeneous database migrations predictable, fast, secure, and simple. Customers have the choice to: 

1. Log in to the AWS Database Migration Service (AWS DMS) console to initiate the [AWS DMS Schema Conversion (DMS SC)](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_SchemaConversion.html) workflow for a fully managed experience 
2. Download the [AWS Schema Conversion Tool (AWS SCT)](https://docs.aws.amazon.com/SchemaConversionTool/latest/userguide/CHAP_Welcome.html) software to their local drive.

The target engines can be Oracle, SQL Server, PostgreSQL, and MySQL.

![SOAF14-AWS-Schema-Conversion-Tool-SCT](/img/aws/database/SOAF14-AWS-Schema-Conversion-Tool-SCT.png)
## Disaster recovery strategies (RTO/RPO)

When an exam question describes a disaster recovery requirement, it's almost always steering you toward one of four standard strategies, ordered from **cheapest/slowest recovery** to **most expensive/fastest recovery**:

- **Backup and restore**: Store backups (e.g., RDS snapshots, S3) in a DR region and restore infrastructure/data only when disaster strikes. Cheapest option, but **highest RTO and RPO** (hours) since everything is provisioned from scratch during the incident.
- **Pilot light**: Keep a minimal version of the core stack (e.g., a small/stopped DB replica) always running in the DR region; scale the rest up only during failover. Lower RTO than backup/restore because the data layer is already warm.
- **Warm standby**: Run a **scaled-down but fully functional** copy of the full stack in the DR region at all times, then scale it up to full capacity during failover. Faster RTO than pilot light since application servers are already running, just under-provisioned.
- **Multi-site active-active**: Run the **full production stack at full scale in two or more Regions simultaneously**, serving live traffic from both. Gives the **lowest possible RTO/RPO** (near-zero), at the **highest cost**, since you're paying for full duplicate capacity all the time.

:::tip How to map RTO/RPO wording to a strategy on the exam
- "Cost is the primary concern, some downtime acceptable" → **backup and restore**.
- "Need a middle ground, data layer should already exist in DR region" → **pilot light**.
- "Need faster recovery, willing to pay for always-on (but smaller) DR infrastructure" → **warm standby**.
- "Near-zero downtime and near-zero data loss, cost is not the primary constraint" → **multi-site active-active** (e.g., DynamoDB global tables, Aurora Global Database).
:::