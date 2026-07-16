---
title: Storage Gateway
description: Hybrid cloud storage gateway providing file, volume, and tape gateway options for on-premises access with caching and backup to S3.
keywords:
  - aws
  - amazon web services
  - storage
  - gateways
  - storage gateway aws
  - storage gateway guide
  - storage on aws
  - storage gateway tutorial
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

## FSx File Gateway vs S3 File Gateway

Storage Gateway actually has **two different file-oriented gateway types**, and the exam trap is picking the wrong one based on the *file protocol and backing store* your on-premises application needs:

- **Amazon S3 File Gateway** (the "File gateway" described above) presents a **NFS/SMB share backed by S3 objects**. Use it when you want files stored as S3 objects (so you can also use S3 features like Lifecycle rules, Glacier archiving, or process them directly with other AWS services), and your access pattern is largely single-writer or infrequently-conflicting file access.
- **Amazon FSx File Gateway** presents a **local cache in front of an actual Amazon FSx for Windows File Server** filesystem. Use it when your on-premises workload needs genuine **Windows file system semantics** — SMB, Active Directory-integrated permissions, Distributed File System (DFS) namespaces, and Volume Shadow Copy Service (VSS) for previous-versions/backups — which plain S3-backed file shares can't fully replicate.

:::tip Exam trap: "needs AD-integrated Windows file shares" → FSx File Gateway, not S3 File Gateway
If the scenario mentions **Windows-native ACLs, DFS namespaces, or VSS snapshots**, that's FSx File Gateway. If it just needs a generic NFS/SMB share with S3 as the backing store (and possibly lifecycle/archival features), that's S3 File Gateway.
:::

## AWS DataSync vs Snowball Family

When the question is about **migrating or continuously syncing large datasets** between on-premises and AWS (rather than providing ongoing hybrid access like Storage Gateway does), two other services come up:

- **AWS DataSync** moves data **online**, over the network (optionally accelerated, and can run over a VPN or Direct Connect for privacy). It's built for **repeated, incremental transfers** — initial migration plus ongoing sync, or scheduled replication between on-premises NFS/SMB/HDFS and S3/EFS/FSx. Use it when you have decent bandwidth and want automation, scheduling, and incremental (delta-only) transfers going forward.
- **AWS Snowball / Snowball Edge / Snowmobile** move data **offline**, by physically shipping a device to you that you fill locally and ship back. Use these when bandwidth is too limited or too costly to move a large one-time dataset (**terabytes to exabytes**) over the network in a reasonable time, or when the transfer is a single one-off migration rather than an ongoing sync.

:::tip Exam trap: repeated/incremental transfer over network → DataSync; one-time massive bulk transfer with poor bandwidth → Snowball
A classic distractor pair: "migrate 200 TB once, and our internet link would take months" → **Snowball Edge**. "Continuously replicate an on-premises NFS share to S3 every night" → **DataSync**. Storage Gateway itself is neither of these — it's for ongoing, low-latency **hybrid access** where on-premises apps keep reading/writing through the gateway, not a one-time or scheduled bulk transfer tool.
:::
- Use the cached volume you want to expand to clone a new volume of a larger size.

Reference: [Expanding the Size of a Volume](https://docs.aws.amazon.com/storagegateway/latest/vgw/volume-size-increase.html)

### Managing local disks

The number and size of disks that you want to allocate for your gateway is up to you. Depending on the storage solution you deploy (see [Plan your Storage Gateway deployment](https://docs.aws.amazon.com/storagegateway/latest/vgw/WhatIsStorageGateway.html#planning-gateway-deployment)), the gateway requires the following additional storage:

-   Volume Gateways ([ref](https://docs.aws.amazon.com/storagegateway/latest/vgw/ManagingLocalStorage-common.html)):
    -   Stored gateways require **at least one disk** to use as an upload buffer.
    -   Cached gateways require **at least two disks**. One to use as a cache, and one to use as an upload buffe

:::info Manging the local disks (Exam)
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
