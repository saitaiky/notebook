---
title: Cloudformation
description: Cloudformation
keywords:
  - Cloudformation
sidebar_position: 2
---


## User Data in EC2 for CloudFormation

- We can have user data at EC2 instance launch through the console
- We can also include it in CloudFormation
- The important thing to pass is the entire script through the function
Fn::Base64
- Good to know: user data script log is in `/var/log/cloud-init-output.log` inside the EC2 instances that are created by CloudFormation

```yaml

#  the vertical pipe here means that this whole thing is one giant string with new lines.
UserData:
  Fn::Base64: !Sub |
     ACCESS_KEY=${AccessKey}
     SECRET_KEY=${SecretKey}
```


## cfn-init

`cfn-init` is a component of AWS CloudFormation that allows you to configure and initialize Amazon EC2 instances as part of the stack creation process. It is used to install packages, run commands, and configure settings on EC2 instances. cfn-init reads the configuration metadata defined in the CloudFormation template and performs the specified actions on the instances. 

First, it reads how the instance should be initialized from the CloudFormation stack and executes it. 
Second, it signals CloudFormation whether it’s finished or there was an error, so it fits into the lifecycle of the stack. CloudFormation waits until the initialization is complete, and it also rolls back if there was an error.

## cfn-signal and wait conditions

How to resolve a situation where wait condition didn't receive the required number of signals from an Amazon EC2 Instance?

- Ensure that the AMI you're using has the AWS CloudFormation **helper scripts** installed. If the AMI doesn't include the helper scripts, you can also download them to your instance.
- Verify that the **cfn-init & cfn-signal** command was successfully run on the instance. You can view logs, such as /var/log/cloud-init.log or /var/log/cfn-init.log, to help you debug the instance launch.
- You can retrieve the logs by logging in to your instance, but you **must disable rollback on failure** or else by default AWS CloudFormation deletes the instance after your stack fails to create.
- Verify that the instance has a connection to the Internet. If the instance is in a VPC, the instance should be able to connect to the Internet through a NAT device if it's is in a private subnet or through an Internet gateway if it's in a public subnet.
  - For example, run: curl -I https://aws.amazon.com


## Nested Stack

A nested stack is a way to encapsulate and manage reusable components within a CloudFormation template. It allows you to create separate CloudFormation templates for individual components and then reference them as a resource within a main CloudFormation template. 

This modular approach simplifies template management, promotes reusability, and improves the organization and readability of complex infrastructure deployments. The nested stack acts as a standalone unit with its own set of resources, parameters, and outputs, enabling you to independently create, update, or delete the nested stack while working within the main stack.

:::caution
- To update a nested stack, always update the parent (root stack)
:::

![cfn-console-nested-stacks](https://docs.aws.amazon.com/images/AWSCloudFormation/latest/UserGuide/images/cfn-console-nested-stacks.png)
Resource: [Working with nested stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-nested-stacks.html)

```ymal
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  myStackWithParams:
    Type: AWS::CloudFormation::Stack
    Properties:
      TemplateURL: https://s3.amazonaws.com/cloudformation-templates-us-east-2/EC2ChooseAMI.template
      Parameters:
        InstanceType: t1.micro
        KeyName: mykey
```


## ChangeSet

![update-stack-changesets-diagram](https://docs.aws.amazon.com/images/AWSCloudFormation/latest/UserGuide/images/update-stack-changesets-diagram.png)
[Updating stacks using change sets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html)


## DeletionPolicy

You can put a DeletionPolicy on any resource to control what happens when the CloudFormation template is deleted
- DeletionPolicy=Retain:
  - Specify on resources to preserve / backup in case of CloudFormation deletes 
  - To keep a resource, specify Retain (works for any resource / nested stack)
- DeletionPolicy=Snapshot:
  - EBS Volume, ElastiCache Cluster, ElastiCache ReplicationGroup 
  - RDS DBInstance, RDS DBCluster, Redshift Cluster
- DeletePolicy=Delete (default behavior):
  - Note: for AWS::RDS::DBCluster resources, the default policy is Snapshot
  - Note: to delete an S3 bucket, you need to first empty the bucket of its content


## Rolling back an update

testing 

- Behavoir:
  - A stack goes into the UPDATE_ROLLBACK_FAILED state when CloudFormation can't roll back all changes during an update
  - A resource can't return to its original state, causing the rollback to fail
  - Example: roll back to an old database instance that was deleted outside CloudFormation

- Solutions
  - Fix the errors manually outside of CloudFormation and then
  - Skip the resources that can't rollback successfully (CloudFormation will mark the failed resources as UPDATE_COMPLETE)

:::infoNotes
- You can't update a stack in this state
- For nested stacks, rolling back the parent stack will attempt to roll back all the child stacks as well
:::