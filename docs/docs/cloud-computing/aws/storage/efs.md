---
title: Elastic File System
description: EFS
keywords:
  - EFS
  - Elastic File System
sidebar_label: EFS
sidebar_position: 2
---

:::infoIs EFS a NTFS?
No, EFS (Elastic File System) in AWS is not an NTFS (New Technology File System). NTFS is a file system used primarily in Windows operating systems, whereas EFS is a managed cloud-based file storage service provided by AWS.

EFS provides its own file system that is accessible from multiple EC2 instances and on-premises servers, supporting various operating systems like Linux and Windows. The specific file system used by EFS is not publicly disclosed, but it is designed to be compatible with different operating systems and applications, making it suitable for a wide range of workloads.
:::

## Encryptions
Amazon EFS supports two forms of encryption for file systems, encryption of data in transit and encryption at rest. 
- You can enable encryption of data in transit when **you mount the file system**.
- You can only enable encryption of data at rest when **creating an Amazon EFS file system**. 

## Performance

### Performance modes

Amazon EFS offers two performance modes, General Purpose and Max I/O:

- General Purpose mode
- **Max I/O mode** is designed for highly parallelized workloads that can tolerate higher latencies than the General Purpose mode. 

:::infoWhen to use which?
If the `PercentIOLimit` percentage returned in CloudWatch was at or near 100 percent for a significant amount of time during the test, your application should use the Max I/O performance mode. Otherwise, it should use the default General Purpose mode.
:::
### Throughput modes

A file system's throughput mode determines the throughput available to your file system. Amazon EFS offers three throughput modes: Elastic, Provisioned, and Bursting. 

- **Elastic Throughput** (recommended) – Use the default Elastic Throughput when you have spiky or unpredictable workloads and performance requirements that are difficult to forecast.
- **Provisioned Throughput mode** is available for applications with high throughput to storage (MiB/s per TiB) ratios, or with requirements greater than those allowed by the **Bursting Throughput mode**. 
- With **Bursting Throughput mode**, a file system's throughput scales *as the amount of data* stored in the standard storage class grows.

## EFS access points vs EFS mount targets

> TL;DR - EFS Access Points allow for **granular access control to specific directories** within an EFS file system, while EFS Mount Targets provide access to the** entire file system within a subnet**

EFS Access Points and EFS Mount Targets in AWS are both used to facilitate access to Amazon EFS (Elastic File System) from EC2 instances, but they serve different purposes and have distinct use cases:

- **Scope of Access**: Mount targets provide access to the entire EFS file system within a specific subnet, while access points allow customized access to specific directories within the file system.
- **Access Control**: Mount targets do not offer fine-grained access control, whereas access points enable you to apply unique permissions for different applications or users.
- **Number and Association**: You typically have at least one mount target per subnet for accessing an EFS file system, but you can create multiple access points per file system, each with its distinct permissions.


## The EFS mount helper

The EFS mount helper is a tool or utility that simplifies the process of mounting an Amazon EFS (Elastic File System) file system onto an Amazon EC2 instance. The mount helper is pre-installed on **Amazon Linux-based EC2 instances**, and it's also available for **other Linux distributions**.

Using the EFS mount helper, you have the following options for mounting your Amazon EFS file system:
- You can mount with **IAM authorization**
- **Auto-mounting when an EC2 instance reboots** 
- Mounting on supported EC2 instances 
- Mounting with Amazon **EFS access points** 
- Mounting with an on-premise Linux client 
- Mounting a file system **when a new EC2 instance launches**

## Some metrics

- Use `ClientConnections` to track the number of Amazon EC2 instances that are connected to a file system
- You can see your burst credit balance by monitoring the `BurstCreditBalance` metric for your file system.