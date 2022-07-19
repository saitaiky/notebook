---
title: Others
description: AWS Networking & Content Delivery
keywords:
  - AWS Global Accelerator
---

## AWS Global Accelerator

There are few use cases that can leverage the features provided by AWS Global Accelerator.
- Improving latency and availability for **single region applications**
- Simplified and resilient traffic routing for **multi-Region applications**
- Accelerated and simplified **storage for multi-Region applications**
- For other use cases, check [AWS Global Accelerator](https://aws.amazon.com/global-accelerator/?blogs-global-accelerator.sort-by=item.additionalFields.createdDate&blogs-global-accelerator.sort-order=desc&aws-global-accelerator-wn.sort-by=item.additionalFields.postDateTime&aws-global-accelerator-wn.sort-order=desc)
### Multi-Region applications

**You can use AWS Global Accelerator** *to bring down the number of IP addresses allowed by the firewall and easily manage the entire network infrastructure with a situation that it is too many ALBs in multiple AWS Regions*.

![AGA-Multi-Region-Usecase](/img/aws/networking/others/AGA-Multi-Region-Usecase.png)

Source: [AWS Global Accelerator](https://aws.amazon.com/global-accelerator/?blogs-global-accelerator.sort-by=item.additionalFields.createdDate&blogs-global-accelerator.sort-order=desc&aws-global-accelerator-wn.sort-by=item.additionalFields.postDateTime&aws-global-accelerator-wn.sort-order=desc)

With Global Accelerator, you are provided **two global static customer-facing IPs** to simplify traffic management. On the back end, add or remove your AWS application origins, such as Network Load Balancers, Application Load Balancers, Elastic IPs, and EC2 Instances, **without making user-facing changes**. 
## ENI vs ENA vs EFA

> TL;DR - You should consider addElastic Network Interface > Elastic Network Adapter > Elastic Network Adapter

ENI, ENA and EFA are all intended to improve the **EC2 network performance** as a device to attach to an EC2 instance. In short

### Elastics Network Interface (ENI)

An elastic network interface is a logical networking component in a VPC that represents a **traditional virtual network card**. It can include the following attributes:
- A primary private IPv4 address from the IPv4 address range of your VPC
- One or more secondary private IPv4 addresses from the IPv4 address range of your VPC
- One Elastic IP address (IPv4) per private IPv4 address
- One public IPv4 address
- One or more IPv6 addresses
- One or more security groups
- A MAC address
- A source/destination check flag
- A description


### Elastic Network Adoptor (ENA)

Using a single root I/O virtualization (SR-IOV) to provide high performance. Use ENA when the ENI's **package per second** is not sufficient.

:::info What is SR-IOV?
SR-IOV is a method of device virtualization that provides higher I/O performance and lower CPU utilization when compared to **traditional virtualized network interfaces**. Enhanced networking provides higher bandwidth, higher packet per second (PPS) performance, and consistently lower inter-instance latencies. There is no additional charge for using enhanced networking.
:::


### Elustie Fabric Adapter (EFA)

Elastic Fabric Adapter (EFA) is a network interface for Amazon EC2 instances that enables customers to run applications requiring high levels of inter-node communications at scale on AWS. Its *custom-built operating system (OS) **bypass hardware interface** * enhances the performance of inter-instance communications, which is critical to scaling these applications. Therefore this option is correct. It **Includes all the funtionality provided by ENI and ENA**, but it is the faster and better choice.

OS-bypass is an access model that allows HPC and machine learning applications to communicate directly with the network interface hardware to provide low-latency, reliable transport functionality.

![OS-bypass](/img/aws/networking/others/OS-bypass.png)
Source: [AWS ENI vs EN vs EFA
](https://varunmanik1.medium.com/aws-eni-vs-en-vs-efa-22250513590f)

> The Libfabric API bypasses the operating system kernel and communicates directly with the EFA device to put packets on the network.

![AWS: Elastic Fabric Adapter](/img/aws/networking/others/Product-Page-Diagram_Elastic-Fabric-Adapter_How-it-Works.png)
Source: [AWS: Elastic Fabric Adapter](https://aws.amazon.com/hpc/efa/)
