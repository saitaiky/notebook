---
title: Elastic Block Store
description: EBS
keywords:
  - EBS
  - Elastic Block Store
sidebar_label: EBS
sidebar_position: 1
---

## EBS encryption is a region-specific setting

Encryption by default *is a Region-specific setting*. If you enable it for a Region, you cannot disable it for individual volumes or snapshots in that Region

You can configure your AWS account to enforce the encryption of *the **new** EBS volumes and snapshot copies that you create*. Encryption by default is a Region-specific setting. If you enable it for a Region, you cannot disable it for individual volumes or snapshots in that Region.

## IOPS

IOPS SSD (io1 or io2) is the only EBS volume to support **Multi-Attach** functionality. Amazon EBS Multi-Attach enables you to attach a single Provisioned IOPS SSD volume to multiple EC2 instances that are in the same Availability Zone.

### Calulation

| EBS type        | io2         | Io2 Block Express | io1         | gp3         | gp2                        |
|-----------------|-------------|-------------------|-------------|-------------|----------------------------|
| Max IOPS/GB     | 500 IOPS/GB | Unknown           | 50 IOPS/GB  | 3,000 IOPS  | IOPS                       |
| Max IOPS/Volume | 64,000 IOPS | Unknown           | 64,000 IOPS | 16,000 IOPS | 16,000 IOPS (Min:100 IOPS) |

> Source: [Amazon EBS volume types](https://aws.amazon.com/ebs/volume-types/),  [Amazon EBS volume types - document](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html)

**Example 1: Max IOPS of io1 EBS volume?**

The maximum ratio of provisioned **IOPS SSD (io1) volumes** to requested volume size (in GiB) is 50:1. So, for a 200 GiB volume size, max IOPS possible is 200*50 = 10000 IOPS.

**Example 2:  Which gp2 volume size will their test environment hit the max IOPS?**

16000 IOPS /3 IOPS = 5.3 TiB / 5,334 GiB   

:::caution When Max IOPS/Volume has reached, adding extra volumne(GB) won't increase the IOPS
Even if you add extra volumne(GB) to this EBS, it won't add more IOPS. Because the max IOPS/volumn of gp2 is 16.000 IOPS. 
:::

The performance of gp2 volumes is tied to volume size, which determines the baseline performance level of the volume and how quickly it accumulates I/O credits; larger volumes have higher baseline performance levels and accumulate I/O credits



### in GP2 volume

The IOPS of EBS volume *cannot be directly increased on **a gp2 volume** without increasing its size, which is not possible due to the question's constraints.
### in IO1 volumne

Unlike gp2, which uses a bucket and credit model to calculate performance, an io1 volume allows you to specify a consistent IOPS rate when you create the volume, and Amazon EBS delivers the provisioned performance 99.9 percent of the time.

## EBS volumes are AZ locked
When you create an EBS volume, it is automatically replicated within its Availability Zone to prevent data loss due to the failure of any single hardware component. *You can attach an EBS volume to an EC2 instance in the **same Availability Zone** *.

## DeleteOnTermination

By default, the root volume of an EC2 instance for an EBS-backed AMI is deleted when the instance terminates.
You can set `DeleteOnTermination` to `False` to change this default behavior **to ensure that the volume persists** even after the instance terminates?

If you want to disable this flag while the instance is still running, you can set `DeleteOnTermination` attribute to `False` using the **command line**

## Update DeleteOnTermination

How to update 'DeleteOnTermination' attribute set to True for an EC2 instance’ root EBS volume?

1. Set the DeleteOnTermination attribute to False using the command line
2. When an instance terminates, the value of the DeleteOnTermination attribute for each attached EBS volume determines whether to preserve or delete the volume. By default, the DeleteOnTermination attribute is set to True for the root volume and is set to False for all other volume types.

## Using a single SSH key pair for all EC2 instances in all AWS Regions

1. Generate a public SSH key (.pub) file from the private SSH key (.pem) file.
2. Set the AWS Region you wish to import to.
3. Import the public SSH key into the new Region.

[https://aws.amazon.com/premiumsupport/knowledge-center/ec2-ssh-key-pair-regions/](https://aws.amazon.com/premiumsupport/knowledge-center/ec2-ssh-key-pair-regions/)


