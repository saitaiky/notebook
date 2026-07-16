---
title: Other services
sidebar_label: Other services
description: AWS Global Accelerator providing static IPs and multi-region routing without changing DNS, simplifying global application distribution and failover management.
keywords:
  - aws
  - amazon web services
  - networking
  - others
  - other services aws
  - other services guide
  - networking on aws
  - other services tutorial
---

## AWS Global Accelerator

There are few use cases that can leverage the features provided by AWS Global Accelerator.
- Associate the static IP addresses provided by AWS Global Accelerator to regional AWS resources or endpoints, such as **Network Load Balancers, Application Load Balancers, EC2 Instances, and Elastic IP addresses**. The IP addresses are anycast from AWS edge locations so they provide onboarding to the AWS global network close to your users.
- Easily move endpoints between Availability Zones or AWS Regions without needing to update your DNS configuration or change client-facing applications.
- Dial traffic up or down for a specific AWS Region by configuring a traffic dial percentage for your endpoint groups. This is especially useful for testing performance and releasing updates.
- Control the proportion of traffic directed to each endpoint within an endpoint group by assigning weights across the endpoints.
- For other use cases, check [AWS Global Accelerator](https://aws.amazon.com/global-accelerator/?blogs-global-accelerator.sort-by=item.additionalFields.createdDate&blogs-global-accelerator.sort-order=desc&aws-global-accelerator-wn.sort-by=item.additionalFields.postDateTime&aws-global-accelerator-wn.sort-order=desc)

### Multi-Region applications

**You can use AWS Global Accelerator** *to bring down the number of IP addresses allowed by the firewall and easily manage the entire network infrastructure with a situation that it is too many ALBs in multiple AWS Regions*.

![AGA-Multi-Region-Usecase](/img/aws/networking/others/AGA-Multi-Region-Usecase.png)

Source: [AWS Global Accelerator](https://aws.amazon.com/global-accelerator/?blogs-global-accelerator.sort-by=item.additionalFields.createdDate&blogs-global-accelerator.sort-order=desc&aws-global-accelerator-wn.sort-by=item.additionalFields.postDateTime&aws-global-accelerator-wn.sort-order=desc)

With Global Accelerator, you are provided **two global static customer-facing IPs** to simplify traffic management. On the back end, add or remove your AWS application origins, such as Network Load Balancers, Application Load Balancers, Elastic IPs, and EC2 Instances, **without making user-facing changes**. 

### Global Accelerator vs ALB/NLB vs Route 53

These three all sit in front of your application, but they solve different layers of the same problem, which makes them an easy exam distractor set:

- **ALB/NLB** load-balance traffic *within a single Region* across targets (EC2, containers, IPs, Lambda). They don't give you a global entry point on their own.
- **Route 53** performs DNS-based routing (latency, weighted, geolocation, failover). Because it's DNS, changes need the client to re-resolve the name, and TTL/DNS-caching on the client side means failover isn't instant.
- **Global Accelerator** front-ends one or more Regional ALBs/NLBs/EC2/EIPs behind **two static anycast IP addresses**. Traffic enters the AWS global network at the edge location closest to the user and is routed over AWS's backbone to the nearest healthy endpoint group, so failover is at the network layer (near-instant, no DNS TTL to wait out) instead of DNS layer.

:::tip Exam trap: static IP + fast failover → Global Accelerator, not Route 53
If a requirement specifically needs **static IP addresses** that never change (useful for firewall allow-lists) combined with **fast, DNS-independent failover** across Regions, that's the signature of **Global Accelerator**. Route 53 failover routing is DNS-based and is a distractor when the question emphasizes static IPs or sub-second failover.
:::