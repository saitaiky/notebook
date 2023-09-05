---
title: Storage Gateway
description: Gateways
---


![volume-gateway-diagram](/img/aws/storage/volume-gateway-diagram.png)

Source: [AWS - Volume Gateway](https://aws.amazon.com/storagegateway/volume/)

**AWS Storage Gateway** is **a hybrid cloud storage service** that gives you on-premises access to virtually unlimited cloud storage. The service provides three different types of gateways – Tape Gateway, File Gateway, and Volume Gateway – that seamlessly connect on-premises applications to cloud storage, caching data locally for low-latency access. With cached volumes, the AWS Volume Gateway stores the full volume in its Amazon S3 service bucket, and just the recently accessed data is retained in the gateway’s local cache for low-latency access.

## Volume gateway

> TL;DR - cached mode optimizes local storage while providing quick access to frequently used data, while stored mode prioritizes cloud storage durability and availability by keeping a complete copy of all data in the cloud. The choice between the two modes depends on your specific storage requirements and performance needs.

There are 2 modes in Storage Gateway: 
- In the **Cached Volume Gateway mode**, your primary data is stored in Amazon S3, while retaining your frequently accessed data locally in the cache for low latency access.
- In the **Stored Volume Gateway mode**, your primary data is stored locally and your entire dataset is available for low latency access on premises while also asynchronously getting backed up to Amazon S3. 
### Cached volumes architecture

![aws-storage-gateway-cached-diagram](/img/aws/storage/gateways/aws-storage-gateway-cached-diagram.png)

Source: [How Volume Gateway works (architecture)](https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html)

In cached mode, the majority of data is stored in the on-premises cache, which acts as a buffer between the local applications and the cloud storage. Only frequently accessed data is cached locally, while less frequently accessed data resides in the cloud. This configuration allows for low-latency access to frequently used data while reducing the on-premises storage requirements. Cached mode is best suited for scenarios where you need to optimize storage space locally and still have quick access to frequently accessed data.

:::infoChange the disk size (exam)

- For upload buffer disk
    - Short answer: Shout down the gateway, remove upload buffer disk, allocate a new disk
    - Long answer: For disks that are allocated as upload buffer for an existing gateway, you need to first **shut down the gateway before removing the disk**. After the gateway is shut down, you can remove the upload buffer disk. Then, you can allocate a new disk with the reduced upload buffer size.
- For cache disk
    - Short answer: Create a new gateway with updated cache disk size
    - Long answer: Don't remove disks that are allocated as cache disks for an existing gateway — doing this can break your gateway's functionality. You can't decrease the size of a cache disk after it's allocated to an existing gateway. Instead, you must **create a new gateway with the cache space** that you need. Then, you can **migrate your data to the new gateway**.
:::


### Stored volumes architecture

![aws-storage-gateway-stored-diagram](/img/aws/storage/gateways/aws-storage-gateway-stored-diagram.png)

Source: [How Volume Gateway works (architecture)](https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html)

In stored mode, all data is stored in the cloud, and only a minimal cache is maintained on-premises. This means that all data is available in the cloud, making it more durable and reducing the need for on-premises storage. Stored mode is ideal for scenarios where you need to keep a complete copy of your data in the cloud and prioritize durability and availability over local access performance.


## Recover

- For file gateway - If your gateway or virtual machine malfunctions, you can recover data that has been uploaded to AWS and stored on a volume in Amazon S3.
- volumes gateway
    - For cached volumes gateways, you recover data from a recovery snapshot. 
    - For stored volumes gateways, you can recover data from your most recent uploaded Amazon EBS snapshot of the volume in Amazon S3. 
- For tape gateways, you recover one or more tapes from a recovery point to a new tape gateway.

## Exam

Encryption
- By default, Storage Gateway uses Amazon S3-Managed Encryption Keys (**SSE-S3**) to server-side encrypt all data it stores in Amazon S3. You can change to use **SSE-KMS**
