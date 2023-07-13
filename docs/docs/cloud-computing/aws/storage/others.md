---
title: Others
description: AWS Snowball, Storage Gateway
keywords:
  - AWS Snowball 
  - AWS Storage Gateway
---


## Hybrid infrastructure  

### AWS Storage Gateway

![volume-gateway-diagram](/img/aws/networking/others/volume-gateway-diagram.png)

Source: [AWS - Volume Gateway](https://aws.amazon.com/storagegateway/volume/)

**AWS Storage Gateway** is a hybrid cloud storage service that gives you on-premises access to virtually unlimited cloud storage. The service provides three different types of gateways – Tape Gateway, File Gateway, and Volume Gateway – that seamlessly connect on-premises applications to cloud storage, caching data locally for low-latency access. With cached volumes, the AWS Volume Gateway stores the full volume in its Amazon S3 service bucket, and just the recently accessed data is retained in the gateway’s local cache for low-latency access.

There are 2 modes in Storage Gateway: 
- In the **Cached Volume Gateway mode**, your primary data is stored in Amazon S3, while retaining your frequently accessed data locally in the cache for low latency access.
- In the **Stored Volume Gateway mode**, your primary data is stored locally and your entire dataset is available for low latency access on premises while also asynchronously getting backed up to Amazon S3. 

