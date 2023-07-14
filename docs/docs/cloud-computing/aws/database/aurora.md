---
title: Aurora
description: Aurora
keywords:
  - Aurora
sidebar_position: 4
---

## Global Database

With [Global Database](https://aws.amazon.com/rds/aurora/global-database/), a single Aurora database can span multiple AWS regions to enable fast local reads and quick disaster recovery between regions. 

The difference between **Aurora Global DB** and **Cross-region Read Replicas** is that Global DB is **physical replication(hardware)** where Read replicas are **logical replication**.

With an Aurora global database, you can choose from two different approaches to failover:
- Managed planned failover
- Unplanned failover

## Failover

In the event of an outage that impacts an entire Availability Zone (AZ) and renders the primary instance of an Amazon Aurora cluster unavailable, the appropriate action to bring the database online depends on the cluster's configuration.

- Automatic
  - If the cluster includes reader instances in other AZs, Aurora's failover mechanism is utilized, promoting one of the reader instances to become the new primary instance. 
- Manual
  - However, if the cluster only contains a single DB instance or all reader instances are in the affected AZ, manual creation of new DB instances in another AZ is necessary to restore the database's availability.

