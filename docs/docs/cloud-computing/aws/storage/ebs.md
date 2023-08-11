---
title: Elastic Block Store
description: EBS
keywords:
  - EBS
  - Elastic Block Store
sidebar_label: EBS
sidebar_position: 1
---

## Amazon EC2 with or without EBS

**Using EC2 with EBS**

When using EC2 with **EBS**, the EC2 instance runs on top of the EBS volume, providing persistent storage and allowing separation of compute and storage resources. This offers flexibility, as EBS volumes can be easily attached, detached, and resized, optimizing storage capacity while minimizing costs. They are suitable for various use cases, such as database storage, file storage, and backup.

**Using EC2 without EBS**

EC2 without EBS relies on **instance store**, which provides ephemeral storage that is deleted when the instance is stopped or terminated. The benefits include lower cost (since instance store volumes are included in the EC2 instance cost) and high I/O performance for workloads with low latency requirements. However, there is no persistence, making it challenging to store and retrieve data between instances, and capacity is limited compared to EBS volumes.


**Conclusion**

Ultimately, the choice between EC2 with or without EBS depends on specific needs. Consider factors like cost, performance, scalability, durability, and ease of use. Testing both options is recommended to determine the best fit for your workload.

### Instance store volume vs EBS volume

![ebs-vs-instance-store](/img/aws/storage/ebs/ebs-vs-instance-store.webp)

Source: [AWS — Difference between EBS and Instance Store](https://medium.com/awesome-cloud/aws-difference-between-ebs-and-instance-store-f030c4407387)

[Some Amazon EC2 instance types](https://aws.amazon.com/ec2/instance-types/) come with a form of directly attached, block-device storage known as an [instance store](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html). Use the instance store for temporary storage. Data that's stored in instance store volumes isn't persistent through instance stops, terminations, or hardware failures.

For data that you want to retain longer, or if you want to encrypt the data, use [Amazon EBS volumes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html) instead. EBS volume is network attached drive which results in slow performance but data is persistent meaning even if you reboot the instance data will be there. It has the following features:

- EBS volumes preserve their data through instance stops and terminations.
- You can back up EBS volumes with EBS snapshots.
- You can remove EBS volumes from one instance, and reattach them to another.
- EBS volumes support full-volume encryption.

To prevent unintentional changes or data loss, it's a best practice to [frequently create snapshots](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes.html#backup-benefit). You can use [AWS Backup](https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html) to automate snapshot creation.

### Resizing

- Instance volume vs Instance store volume
  - If the root device for your instance is an EBS volume, you can change the size of the instance simply by changing its instance type, which is known as resizing it. 
  - If the root device for your instance is an instance store volume, you must migrate your application to a new instance with the instance type that you need.
- After you increase the size of an EBS volume, you must use **the file-system specific commands to extend the file system to the larger size**. Here are the steps to extend a Linux file system. Reference: [AWS document](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/recognize-expanded-volume-linux.html)
  1. Identify the resized EBS volume using the `lsblk` command to check the available block devices.
  2. Run `sudo resize2fs /dev/xvdf1` to resize the file system to utilize the newly resized EBS volume space. ( `/dev/xvdf1` is the path of the device you want to extend the file system on)
  3. Verify the changes by using the `df -h` command to check the updated file system size.

## Behavior

### EBS encryption is a region-specific setting

Encryption by default *is a Region-specific setting*. If you enable it for a Region, you cannot disable it for individual volumes or snapshots in that Region

You can configure your AWS account to enforce the encryption of *the **new** EBS volumes and snapshot copies that you create*. Encryption by default is a Region-specific setting. If you enable it for a Region, you cannot disable it for individual volumes or snapshots in that Region.

### EBS volumes are AZ locked
When you create an EBS volume, it is automatically replicated within its Availability Zone to prevent data loss due to the failure of any single hardware component. *You can attach an EBS volume to an EC2 instance in the **same Availability Zone** *.

### How to recover `error` state

You can't recover a volume in an `error` state, you can restore the lost data from your backup. It’s a best practice to keep backups of your EC2 resources, including EBS volumes. You can use **Amazon Data Lifecycle Manager, AWS Backup, or regular EBS snapshots** for maintaining regular backups of your critical volumes to avoid data loss.

## IOPS

IOPS SSD (io1 or io2) is the only EBS volume to support **Multi-Attach** functionality. Amazon EBS Multi-Attach enables you to attach a single Provisioned IOPS SSD volume to multiple EC2 instances that are in the same Availability Zone.

### Calulation

| EBS type        | io2         | Io2 Block Express | io1         | gp3         | gp2                        |
|-----------------|-------------|-------------------|-------------|-------------|----------------------------|
| Max IOPS/GB     | 500 IOPS/GB | Unknown           | 50 IOPS/GB  | 3,000 IOPS  | 3 IOPS                     |
| Max IOPS/Volume | 64,000 IOPS | Unknown           | 64,000 IOPS | 16,000 IOPS | 16,000 IOPS (Min:100 IOPS) |

> Source: [Amazon EBS volume types](https://aws.amazon.com/ebs/volume-types/),  [Amazon EBS volume types - document](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html)

**Example 1(exam)**: Max IOPS of io1 EBS volume?

The maximum ratio of provisioned **IOPS SSD (io1) volumes** to requested volume size (in GiB) is **50:1**. So, for a 200 GiB volume size, max IOPS possible is 200*50 = 10000 IOPS.

**Example 2**:  Which gp2 volume size will hit the max IOPS?

16000 IOPS /3 IOPS = 5.3 TiB / 5,334 GiB   

:::caution When Max IOPS/Volume has reached, adding extra volumne(GB) won't increase the IOPS
Even if you add extra volumne(GB) to this EBS, it won't add more IOPS. Because the max IOPS/volumn of gp2 is 16.000 IOPS. 
:::

The performance of gp2 volumes is tied to volume size, which determines the baseline performance level of the volume and how quickly it accumulates I/O credits; larger volumes have higher baseline performance levels and accumulate I/O credits


### Comparsion

Amazon Elastic Block Store (EBS) provides different types of block storage volumes optimized for various performance and cost requirements. Here are the use cases and reasons for each EBS volume type:

- **General Purpose (gp2/gp3) EBS:**
   - **Use Case:** Suitable for a wide range of workloads, including boot volumes, small to medium-sized databases, and development/testing environments.
   - **Reasons:** gp2 volumes offer a balance between performance and cost, providing baseline performance with the ability to burst when needed. They are a cost-effective choice for applications with moderate I/O requirements.
- **Provisioned IOPS (io1/io2) EBS:**
   - **Use Case:** Ideal for I/O-intensive applications such as large databases, high-performance workloads, and applications requiring consistent and predictable performance.
   - **Reasons:** io1/io2 volumes offer high IOPS (Input/Output Operations Per Second) performance with configurable levels of provisioned IOPS, making them suitable for applications demanding low-latency and high-throughput storage.
- **Throughput Optimized (st1) EBS:**
   - **Use Case:** Best suited for large, sequential workloads such as data warehouses, log processing, and big data applications.
   - **Reasons:** st1 volumes provide high throughput and are optimized for sequential read and write operations, making them cost-effective for data-intensive applications that require efficient data streaming.
- **Cold HDD (sc1) EBS:**
   - **Use Case:** Designed for infrequently accessed, throughput-intensive workloads, including large data sets, backups, and data archives.
   - **Reasons:** sc1 volumes offer the lowest cost per gigabyte of all EBS types, making them suitable for scenarios where cost is a primary consideration and occasional access to data is acceptable.

### Specify IOPS in GP/IO EBS

#### You can only update the IOPS via size in GP EBS

The IOPS of EBS volume cannot be directly increased on **a gp2 volume** without increasing its size, which is not possible due to the question's constraints.
#### You can directly update the IOPS via size in IO EBS

Unlike gp2, which uses a bucket and credit model to calculate performance, an io1 volume allows you to specify a consistent IOPS rate when you create the volume, and Amazon EBS delivers the provisioned performance 99.9 percent of the time.


## Configuration
### DeleteOnTermination

By default, the root volume of an EC2 instance for an EBS-backed AMI is deleted when the instance terminates.
You can set `DeleteOnTermination` to `False` to change this default behavior **to ensure that the volume persists** even after the instance terminates?

If you want to disable this flag while the instance is still running, you can set `DeleteOnTermination` attribute to `False` using the **command line**

:::cautionData on a non-root EBS volume is preserved even if the instance is shutdown or terminated
By default, when you attach a non-root EBS volume to an instance, its `DeleteOnTermination` attribute is set to false. Therefore, the default is to preserve these volumes. After the instance terminates, you can take a snapshot of the preserved volume or attach it to another instance. You must delete a volume to avoid incurring further charges.
:::

:::cautionAmazon EBS volumes deleted with the EC2 `TerminateInstances` API call will continue to show for some time on AWS Config console
**Context** - You can delete Amazon EBS volumes by:
- Stopping the Amazon EC2 instance, detaching the Amazon EBS volume, and then running the [DeleteVolume](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteVolume.html) API call to remove the EBS volume from the  the list of resources in AWS Config.
- Setting the [DeleteOnTermination](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html#preserving-volumes-on-termination) attribute to true, and then running the [TerminateInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_TerminateInstances.html) API call.

If you use the second approach, it does not publish the `DeleteVolume` API call.  This is because AWS Config uses the `DeleteVolume` API call as a trigger with the rule, and the resource changes aren't recorded for the EBS volume. The EBS volume still shows as compliant or noncompliant in  AWS Config console until the baseline check every 6 hours. 
:::

### Update DeleteOnTermination

How to update 'DeleteOnTermination' attribute set to True for an EC2 instance’ root EBS volume?

1. Set the DeleteOnTermination attribute to False using the command line
2. When an instance terminates, the value of the DeleteOnTermination attribute for each attached EBS volume determines whether to preserve or delete the volume. By default, the DeleteOnTermination attribute is set to True for the root volume and is set to False for all other volume types.

### Raid 0 & Raid 1

![raid0_raid1](/img/aws/storage/ebs/raid0_raid1.png)

Source: [EC2 Storage — EBS, EFS, and Instance Store fundamentals](https://medium.com/geekculture/ebs-efs-and-instance-store-aws-solutions-architect-associate-87dc0ac6d1ae)

With Amazon EBS, you can use any of the standard RAID configurations that you can use with a traditional bare metal server, as long as that particular RAID configuration is supported by the operating system for your instance. This is because all RAID is accomplished at the software level.

- For greater I/O performance than you can achieve with a single volume, RAID 0 can stripe multiple volumes together.
- For on-instance redundancy, RAID 1 can mirror two volumes together. So for the given use-case, to increase the performance, you should use RAID 0.

### Decrease latency for newly created EBS from a snapshot

There is a significant increase in latency when you first access each block of data on a new EBS volume that was created from a snapshot. You can avoid this performance lag by using one of the following options:

- Access each block before putting the volume into production. This process is called initialization (formerly known as **pre-warming**).
- **Enable fast snapshot** to restore on a snapshot to ensure that the EBS volumes created from it are fully-initialized at creation and instantly deliver all of their provisioned performance.

