---
title: Others
description: AWS Networking & Content Delivery
keywords:
  - AWS Global Accelerator
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