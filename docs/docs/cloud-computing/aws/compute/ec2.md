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


## Types of EC2

### Spot Instance

You can use Spot Instances to purchase extra computing power at a discounted price to supplement On-Demand Instances. They are a more affordable option than On-Demand EC2 pricing. Flexible and fault-tolerant applications and high-performance workloads use them. Spot Instances are also ideal for flexible workloads, such as data analysis, batch jobs, background processing, and optional tasks. For more information, see [Amazon EC2 Spot Instances](https://aws.amazon.com/ec2/spot-instances/).

AWS Spot Instances help reduce On-Demand Instance costs on EC2. You can use Spot Instances **to supplement On-Demand Instances**. Spot Instances shouldn’t handle all workloads because of potential service disruptions.

:::info Spot Instance interruption
Amazon EC2 terminates, stops, or hibernates your Spot Instance when Amazon EC2 needs the capacity back. Amazon EC2 provides a Spot Instance interruption notice, which gives the instance a two-minute warning before it is interrupted.
:::
#### Spot Fleet
The Spot Fleet selects the Spot Instance pools that meet your needs and launches Spot Instances to meet the target capacity for the fleet. By default, Spot Fleets are set to maintain target capacity by launching replacement instances after Spot Instances in the fleet are terminated.
### Reserved EC2 Instance

Reserved Instances provide you with significant savings on your Amazon EC2 costs compared to On-Demand Instance pricing. Reserved Instances are not physical instances, but rather **a billing discount** applied to the use of On-Demand Instances in your account. 

When you purchase a Reserved Instance, you determine the scope of the Reserved Instance. The scope is either regional or zonal.

- **Regional**: When you purchase a Reserved Instance for a Region, it's referred to as a regional Reserved Instance. **It does not reserve capacity.**
- **Zonal**: When you purchase a Reserved Instance for a specific Availability Zone, it's referred to as a zonal Reserved Instance. **It reserves capacity.**

By creating Capacity Reservations, you ensure that you always have access to EC2 capacity when you need it, for as long as you need it. You can also sepecify the duratin for how long you want it to be

[Link](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html)

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


## EC2 life cycle

### Hibernate

When you EC2 Instance Hibernate to hibernate an instance, AWS signals the operating system to perform hibernation (suspend-to-disk). Hibernation saves the contents from the instance memory (RAM) to your Amazon EBS root volume. AWS then persists the instance's Amazon EBS root volume and any attached Amazon EBS data volumes.

When you start your instance:
- The Amazon EBS root volume is restored to its previous state
- The RAM contents are reloaded
- The processes that were previously running on the instance are resumed
- Previously attached data volumes are reattached and the instance retains its instance ID

Overview of EC2 hibernation: 
![hibernate](/img/aws/compute/hibernate.png)
Source: [Let’s talk about EC2 Placement Groups and Hibernate](https://enlear.academy/lets-talk-about-ec2-placement-groups-and-hibernate-a6e4bed854c?gi=90ed20ac88d9)