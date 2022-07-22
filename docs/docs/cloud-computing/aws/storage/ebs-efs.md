---
title: Elastic Block Store & Elastic File System
description: EBS
keywords:
  - EBS
  - Elastic Block Store
  - EFS
  - Elastic File System
sidebar_label: EBS & EFS
sidebar_position: 1
---

## EBS



### IOPS

IOPS SSD (io1 or io2) is the only EBS volume to support **Multi-Attach** functionality. Amazon EBS Multi-Attach enables you to attach a single Provisioned IOPS SSD volume to multiple EC2 instances that are in the same Availability Zone.
#### in GP2 volume

The IOPS of EBS volume *cannot be directly increased on **a gp2 volume** without increasing its size, which is not possible due to the question's constraints.
#### in IO1 volumne

Unlike gp2, which uses a bucket and credit model to calculate performance, an io1 volume allows you to specify a consistent IOPS rate when you create the volume, and Amazon EBS delivers the provisioned performance 99.9 percent of the time.

### EBS volumes are AZ locked
When you create an EBS volume, it is automatically replicated within its Availability Zone to prevent data loss due to the failure of any single hardware component. *You can attach an EBS volume to an EC2 instance in the **same Availability Zone** *.

### Update DeleteOnTermination

How to update 'DeleteOnTermination' attribute set to True for an EC2 instance’ root EBS volume?

1. Set the DeleteOnTermination attribute to False using the command line
2. When an instance terminates, the value of the DeleteOnTermination attribute for each attached EBS volume determines whether to preserve or delete the volume. By default, the DeleteOnTermination attribute is set to True for the root volume and is set to False for all other volume types.

### Using a single SSH key pair for all EC2 instances in all AWS Regions

1. Generate a public SSH key (.pub) file from the private SSH key (.pem) file.
2. Set the AWS Region you wish to import to.
3. Import the public SSH key into the new Region.

[https://aws.amazon.com/premiumsupport/knowledge-center/ec2-ssh-key-pair-regions/](https://aws.amazon.com/premiumsupport/knowledge-center/ec2-ssh-key-pair-regions/)


### DeleteOnTermination

By default, the root volume of an EC2 instance for an EBS-backed AMI is deleted when the instance terminates.
You can set `DeleteOnTermination` to `False` to change this default behavior **to ensure that the volume persists** even after the instance terminates?

If you want to disable this flag while the instance is still running, you can set `DeleteOnTermination` attribute to `False` using the **command line**


## EFS

### 2 Modes

There are 2 modes that you can use in EFS.

- **Provisioned Throughput mode** is available for applications with high throughput to storage (MiB/s per TiB) ratios, or with requirements greater than those allowed by the **Bursting Throughput mode**. 
- With **Bursting Throughput mode**, a file system's throughput scales *as the amount of data* stored in the standard storage class grows.