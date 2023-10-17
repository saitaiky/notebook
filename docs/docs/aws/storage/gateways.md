---
title: Storage Gateway
description: Gateways
---

![AWS-Storage-Gateway](/img/aws/storage/AWS-Storage-Gateway.png)

![different-gateways](/img/aws/storage/gateways/File-Gateway-vs-Volume-Gateway-vs-Tape-Gateway-1024x640.png)

Source: [](https://tutorialsdojo.com/aws-storage-gateway/)

**AWS Storage Gateway** is **a hybrid cloud storage service** that gives you on-premises access to virtually unlimited cloud storage. The service provides three different types of gateways – Tape Gateway, File Gateway, and Volume Gateway – that seamlessly connect on-premises applications to cloud storage, caching data locally for low-latency access. With cached volumes, the AWS Volume Gateway stores the full volume in its Amazon S3 service bucket, and just the recently accessed data is retained in the gateway’s local cache for low-latency access.

## File gateway

Some approaches that you can use
-  Set up a new file gateway that connects to your on-premises data center using AWS Storage Gateway. Upload the files to the file gateway and use lifecycle policies to move the data into Glacier for archiving.

## Volume gateway

![aws-volume-gateway-stored-&-cache-mode](/img/aws/storage/gateways/aws-volume-gateway-stored-&-cache-mode.jpg)

There are 2 option for Volume Gateway: 
- In the **Cached Volume Gateway mode**, your **primary data is stored in S3**, while retaining your frequently accessed data locally in the cache for low latency access.
- In the **Stored Volume Gateway mode**, your **primary data is stored locally** and your entire dataset is available for low latency access on premises while also asynchronously getting backed up to Amazon S3. 

### Expanding the Size of a Volume

As your application needs to grow, you might want to expand your volume instead of adding more volumes to your gateway. In this case, you can do one of the following:

- Create a snapshot of the volume that you want to expand and then use the snapshot to create a new volume of a larger size.
- Use the cached volume you want to expand to clone a new volume of a larger size.

Reference: [Expanding the Size of a Volume](https://docs.aws.amazon.com/storagegateway/latest/vgw/volume-size-increase.html)

### Managing local disks

The number and size of disks that you want to allocate for your gateway is up to you. Depending on the storage solution you deploy (see [Plan your Storage Gateway deployment](https://docs.aws.amazon.com/storagegateway/latest/vgw/WhatIsStorageGateway.html#planning-gateway-deployment)), the gateway requires the following additional storage:

-   Volume Gateways ([ref](https://docs.aws.amazon.com/storagegateway/latest/vgw/ManagingLocalStorage-common.html)):
    -   Stored gateways require **at least one disk** to use as an upload buffer.
    -   Cached gateways require **at least two disks**. One to use as a cache, and one to use as an upload buffe

:::infoManging the local disks (Exam)
- For upload buffer disk
    - **Short answer**: [Can be **in-place** replacement] Shut down the gateway, remove upload buffer disk, allocate a new disk
    - **Long answer**: For disks that are allocated as upload buffer for an existing gateway, you need to first **shut down the gateway before removing the disk**. After the gateway is shut down, you can remove the upload buffer disk. Then, you can allocate a new disk with the reduced upload buffer size.
- For cache disk
    - **Short answer**: [Can only **migrate** to new one] Create a new gateway with updated cache disk size
    - **Long answer**: Don't remove disks that are allocated as cache disks for an existing gateway — doing this can break your gateway's functionality. You can't decrease the size of a cache disk after it's allocated to an existing gateway. Instead, you must **create a new gateway with the cache space** that you need. Then, you can **migrate your data to the new gateway**.

Reference:[Managing local disks for your Storage Gateway](https://docs.aws.amazon.com/storagegateway/latest/vgw/ManagingLocalStorage-common.html)
:::
### Cached volumes architecture

> TL;DR - You store volume data in AWS, with a small portion of recently accessed data in the cache on-premises.

![aws-storage-gateway-cached-diagram](/img/aws/storage/gateways/aws-storage-gateway-cached-diagram.png)

Source: [How Volume Gateway works (architecture)](https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html)

In cached mode, **the majority of data is stored in the on-premises cache**, which acts as a buffer between the local applications and the cloud storage. Only frequently accessed data is cached locally, while less frequently accessed data resides in the cloud. This configuration allows for low-latency access to frequently used data while reducing the on-premises storage requirements. Cached mode is best suited for scenarios where you need to optimize storage space locally and still have quick access to frequently accessed data.

### Stored volumes architecture

> TL;DR - You store the entire set of volume data on-premises while maintaining an periodic asynchronous copy(snapshots) in the S3 bucket.

![aws-storage-gateway-stored-diagram](/img/aws/storage/gateways/aws-storage-gateway-stored-diagram.png)

Source: [How Volume Gateway works (architecture)](https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html)

In stored mode, **all data is stored in the cloud**, and only a minimal cache is maintained on-premises. This means that all data is available in the cloud, making it more durable and reducing the need for on-premises storage. Stored mode is ideal for scenarios where you need to keep a complete copy of your data in the cloud and prioritize durability and availability over local access performance.


## Recover

- For file gateway - If your gateway or virtual machine malfunctions, you can recover data that has been uploaded to AWS and stored on a volume in Amazon S3.
- volumes gateway
    - For cached volumes gateways, you recover data from a recovery snapshot. 
    - For stored volumes gateways, you can recover data from your most recent uploaded Amazon EBS snapshot of the volume in Amazon S3. 
- For tape gateways, you recover one or more tapes from a recovery point to a new tape gateway.

## Exam

Encryption
- By default, Storage Gateway uses Amazon S3-Managed Encryption Keys (**SSE-S3**) to server-side encrypt all data it stores in Amazon S3. You can change to use **SSE-KMS**
