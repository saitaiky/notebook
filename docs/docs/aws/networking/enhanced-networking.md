---
title: Enhanced Networking
---

EC2 instances can be enhanced and customized by attaching ENIs, and their networking capabilities can be further improved using ENAs and EFAs. These network interfaces play a crucial role in optimizing connectivity, performance, and high availability for EC2 instances based on their specific use cases.

# ENI vs ENA vs EFA

> TL;DR
- Use ENI for general-purpose networking needs.
- Use ENA for most workloads that benefit from improved network performance, including web servers, databases, and standard networking tasks.
- Use EFA for specialized HPC workloads that demand ultra-low latency and high bandwidth, enabling direct access to the network fabric.

ENI, ENA and EFA are all intended to improve the **EC2 network performance** as a device to attach to an EC2 instance. In short

## Elastics Network Interface (ENI)

:::info What is a network card?
A network card is a hardware component in a laptop that enables it to connect to and communicate with computer networks, such as Wi-Fi or Ethernet. It serves as the interface between the laptop's internal electronics and external networks, facilitating data transmission and internet connectivity.
:::

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


## Elastic Network Adaptor (ENA)

Amazon EC2 provides enhanced networking capabilities through the Elastic Network Adapter (ENA). To use enhanced networking, you must install the required ENA module and enable ENA support.

Enhanced networking uses single root I/O virtualization (SR-IOV) to provide high-performance networking capabilities on [supported instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/enhanced-networking.html#supported_instances). SR-IOV is a method of device virtualization that provides higher I/O performance and lower CPU utilization when compared to traditional virtualized network interfaces. Enhanced networking provides higher bandwidth, higher packet per second (PPS) performance, and consistently lower inter-instance latencies. There is no additional charge for using enhanced networking.

Use ENA when the ENI's **package per second** is not sufficient. For example:
- If your packets-per-second rate reaches its ceiling, consider moving to enhanced networking. If your rate reaches its ceiling, you've likely reached the upper thresholds of the virtual network interface driver.
- If your throughput is near or exceeding 20K packets per second (PPS) on the **VIF driver**, it's a best practice to use enhanced networking.

:::infoWhat is SR-IOV?
SR-IOV is a method of device virtualization that provides higher I/O performance and lower CPU utilization when compared to **traditional virtualized network interfaces**. Enhanced networking provides higher bandwidth, higher packet per second (PPS) performance, and consistently lower inter-instance latencies. There is no additional charge for using enhanced networking.
:::

:::infoWhat is enhanced networking?
Enhanced networking uses single root I/O virtualization (SR-IOV) to provide high-performance networking capabilities on supported instance types. SR-IOV is a method of device virtualization that provides higher I/O performance and lower CPU utilization when compared to traditional virtualized network interfaces. Enhanced networking provides higher bandwidth, higher packet per second (PPS) performance, and consistently lower inter-instance latencies. There is no additional charge for using enhanced networking.
:::

:::infoEnable Elastic Network Adapter
From your local computer, enable the enhanced networking attribute using one of the following commands:

`aws ec2 modify-instance-attribute --instance-id instance_id --ena-support`
:::

## Elastic Fabric Adapter (EFA)

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

