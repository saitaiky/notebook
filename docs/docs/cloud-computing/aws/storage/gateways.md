---
title: Gateways
description: Gateways
---


## Storage gatway

> TL;DR - cached mode optimizes local storage while providing quick access to frequently used data, while stored mode prioritizes cloud storage durability and availability by keeping a complete copy of all data in the cloud. The choice between the two modes depends on your specific storage requirements and performance needs.

### Cached volumes architecture

![aws-storage-gateway-cached-diagram](/img/aws/storage/gateways/aws-storage-gateway-cached-diagram.png)

Source: [How Volume Gateway works (architecture)](https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html)

In cached mode, the majority of data is stored in the on-premises cache, which acts as a buffer between the local applications and the cloud storage. Only frequently accessed data is cached locally, while less frequently accessed data resides in the cloud. This configuration allows for low-latency access to frequently used data while reducing the on-premises storage requirements. Cached mode is best suited for scenarios where you need to optimize storage space locally and still have quick access to frequently accessed data.

:::infoChange the disk size (exam)

- For upload buffer disk
    - Short answer: Shout down gateway, remove upload buffer disk, allocate a new disk
    - Long answer: For disks that are allocated as upload buffer for an existing gateway, you need to first **shut down the gateway before removing the disk**. After the gateway is shut down, you can remove the upload buffer disk. Then, you can allocate a new disk with the reduced upload buffer size.
- For cache disk
    - Short answer: Create new gateway with updated disk size
    - Long answer: Don't remove disks that are allocated as cache disks for an existing gateway — doing this can break your gateway's functionality. You can't decrease the size of a cache disk after it's allocated to an existing gateway. Instead, you must **create a new gateway with the cache space** that you need. Then, you can **migrate your data to the new gateway**.
:::


### Stored volumes architecture

![aws-storage-gateway-stored-diagram](/img/aws/storage/gateways/aws-storage-gateway-stored-diagram.png)

Source: [How Volume Gateway works (architecture)](https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html)

In stored mode, all data is stored in the cloud, and only a minimal cache is maintained on-premises. This means that all data is available in the cloud, making it more durable and reducing the need for on-premises storage. Stored mode is ideal for scenarios where you need to keep a complete copy of your data in the cloud and prioritize durability and availability over local access performance.
