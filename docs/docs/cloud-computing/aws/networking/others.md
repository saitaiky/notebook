---
title: Others
description: AWS Networking & Content Delivery
keywords:
  - AWS Global Accelerator
---

## AWS Global Accelerator

[Traffic management with AWS Global Accelerator](https://aws.amazon.com/blogs/networking-and-content-delivery/traffic-management-with-aws-global-accelerator/)

## ENI vs ENA vs EFA

ENI, ENA and EFA are all intended to improve the **EC2 network performance** as a device to attach to an EC2 instance.

**Elastics Network Interface (ENI)**: Traditional Virtual network card

**Elastic Network Adoptor (ENA)**: Using a single root I/O virtualization (SR-IOV) to provide high performance. Use ENA when the ENI's **package per second** is not sufficient.

:::info What is SR-IOV?
SR-IOV is a method of device virtualization that provides higher I/O performance and lower CPU utilization when compared to **traditional virtualized network interfaces**. Enhanced networking provides higher bandwidth, higher packet per second (PPS) performance, and consistently lower inter-instance latencies. There is no additional charge for using enhanced networking.
:::

**Elustie Fabric Adapter (EFA)**: Elastic Fabric Adapter (EFA) is a network interface for Amazon EC2 instances that enables customers to run applications requiring high levels of inter-node communications at scale on AWS. Its custom-built operating system (OS) bypass hardware interface enhances the performance of inter-instance communications, which is critical to scaling these applications. Therefore this option is correct. It **Includes all the funtionality provided by ENI and ENA**, but it is the faster and better choice.

![AWS: Elastic Fabric Adapter](/img/aws/networking/Product-Page-Diagram_Elastic-Fabric-Adapter_How-it-Works.png)
Source: [AWS: Elastic Fabric Adapter](https://aws.amazon.com/hpc/efa/)