---
title: DynamoDB
description: DynamoDB
keywords:
  - DynamoDB
sidebar_position: 3
---

## DynamoDB global tables

DynamoDB global tables provide cross-region **active-active** capabilities with high performance, but you lose some of the data access flexibility that comes with SQL-based databases. Due to the **active-active** configuration of DynamoDB global tables, there is no concept of failover because the application writes to the table in its region, and then the data is replicated to keep the other regions' table in sync. 

## Multiregion architecture

> Source : [AWS Database Blog: Active-Active vs Active-Passive](https://aws.amazon.com/blogs/database/how-to-use-amazon-dynamodb-global-tables-to-power-multiregion-architectures/)

The two most commonly used multiregion architecture configurations are active-passive and active-active. An active-passive architecture configuration typically comprises at least two regions. However, not all regions serve traffic simultaneously, and therefore the name "active-passive." When the configuration includes two regions, one region actively serves traffic while the second region is passive, ready to support a failover in case the active region experiences issues.

An active-active configuration comprises at least two regions. However, unlike an active-passive configuration where one region is actively serving traffic while the other is passive, in an active-active configuration, all regions are actively running the same kind of service and serving traffic simultaneously. The main purpose of an active-active configuration is to achieve load balancing between regions, often using latency-based routing that routes service traffic to the region that provides the fastest experience.