---
title: Enhanced Networking with EC2
---

# ENI vs ENA vs EFA

> TL;DR
- Use ENI for general-purpose networking needs.
- Use ENA for most workloads that benefit from improved network performance, including web servers, databases, and standard networking tasks.
- Use EFA for specialized HPC workloads that demand ultra-low latency and high bandwidth, enabling direct access to the network fabric.

ENI, ENA and EFA are all intended to improve the **EC2 network performance** as a device to attach to an EC2 instance. In short

## Elastics Network Interface (ENI)

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


## Elastic Network Adoptor (ENA)

Using a single root I/O virtualization (SR-IOV) to provide high performance. Use ENA when the ENI's **package per second** is not sufficient.

:::info What is SR-IOV?
SR-IOV is a method of device virtualization that provides higher I/O performance and lower CPU utilization when compared to **traditional virtualized network interfaces**. Enhanced networking provides higher bandwidth, higher packet per second (PPS) performance, and consistently lower inter-instance latencies. There is no additional charge for using enhanced networking.
:::


## Elustie Fabric Adapter (EFA)

![AWS: Elastic Fabric Adapter](/img/aws/networking/others/Product-Page-Diagram_Elastic-Fabric-Adapter_How-it-Works.png)
Source: [AWS: Elastic Fabric Adapter](https://aws.amazon.com/hpc/efa/)

Elastic Fabric Adapter (EFA) is a network interface for Amazon EC2 instances that enables customers to run applications requiring high levels of inter-node communications at scale on AWS. Its *custom-built operating system (OS) **bypass hardware interface** * enhances the performance of inter-instance communications, which is critical to scaling these applications. Therefore this option is correct. It **Includes all the funtionality provided by ENI and ENA**, but it is the faster and better choice.

**OS-bypass** is an access model that allows HPC and machine learning applications to communicate directly with the network interface hardware to provide low-latency, reliable transport functionality.

![OS-bypass](/img/aws/networking/others/OS-bypass.png)
Source: [AWS ENI vs EN vs EFA
](https://varunmanik1.medium.com/aws-eni-vs-en-vs-efa-22250513590f)

> The Libfabric API bypasses the operating system kernel and communicates directly with the EFA device to put packets on the network.

Traditionally, HPC applications use the **Message Passing Interface (MPI)** to interface with the system's network transport. In the AWS Cloud, this has meant that applications interface with MPI, which then uses the operating system's TCP/IP stack and the ENA device driver to enable network communication between instances.

With an EFA, HPC applications use MPI or NCCL to interface with the *Libfabric* API.

