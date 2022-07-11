---
title: EC2
description: EC2
keywords:
  - EC2
sidebar_position: 1
---

## Spot Instance Interruption behaviors 

You can specify that Amazon EC2 should do one of the following when it interrupts a Spot Instance:

- Stop the Spot Instance
- Hibernate the Spot Instance
- Terminate the Spot Instance (default behavoir)


## Zonal Reserved EC2 Instance

The ability to create and manage **Capacity Reservations** independently from the billing discounts offered by Savings Plans or regional Reserved Instances.

When you purchase a Reserved Instance, you determine the scope of the Reserved Instance. The scope is either regional or zonal.

- Regional: When you purchase a Reserved Instance for a Region, it's referred to as a regional Reserved Instance. **It does not reserve capacity.**
- Zonal: When you purchase a Reserved Instance for a specific Availability Zone, it's referred to as a zonal Reserved Instance. **It reserves capacity.**

By creating Capacity Reservations, you ensure that you always have access to EC2 capacity when you need it, for as long as you need it. [Link](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html)

## Placement Groups

**A Spread placement group** is a group of instances that are each placed on distinct racks, with each rack having its own network and power source.

Spread placement groups are recommended for applications that have a small number of critical instances that should be kept separate from each other. Launching instances in a spread placement group reduces the risk of simultaneous failures that might occur when instances share the same racks.

A spread placement group can span multiple Availability Zones in the same Region. You can have **a maximum of 7 running instances per Availability Zone per group**. Therefore, to deploy 15 EC2 instances in a single Spread placement group, the company needs to use 3 AZs.

![placementgroups](/img/aws/compute/placementgroups.jpeg)
Source: [AWS - Placement Groups](https://tridentsys.net/aws-placement-groups/)

### Cluster
- Same rack and same availability zone
- Great network, low latency (10Gbps bandwidth between instances)
- Cons: if rack fails then all the EC2 instances will fail at the same time

Usage: Big data job that needs to complete fast, Application with low latency and high throughput.

### Spread
- All EC2 instance will be located on different hardware
- Span across multiple AZ
- Reduced risk of simultaneous failure
- Limit of **7 instances** per AZ per placement group

Usage: Application that needs maximize HA , Critical Applications that needs to be isolated from failure from each other

### Partition
- Up to 7 partitions per AZ with **100s** of EC2 instances
- The instances of 1 partition do not share racks with instances of other partitions
- A partition failure can affect many EC2 instances from same partition but it won't affect other EC2 instances on other partitions
- EC2 instances can get access to the partition information using metadata

Usage: This strategy is typically used by large distributed and replicated workloads, such as Hadoop, Cassandra, and Kafka. 
