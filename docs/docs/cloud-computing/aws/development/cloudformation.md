---
title: Cloudformation
description: Cloudformation
keywords:
  - Cloudformation
sidebar_position: 2
---

## EC2 interaction
### User Data in EC2

> Check [user data scripts](cloud-computing/aws/compute/ec2/#user-data-scripts) for more information.

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


## EC2 Helper scripts

![cfn-init&cfn-signal](/img/aws/development/cf/cfn-init&cfn-signal.jpg)

Source: [CloudFormation – 3 – User data, cfn](http://miro.borodziuk.eu/index.php/2021/03/28/cloudformation-cfn/)
### cfn-init

- `cfn-init` is a helper script that is executed on an EC2 instance as part of the instance's user data during stack creation or update.
- It is used to handle the instance configuration and perform tasks such as installing packages, setting up configurations, and running custom scripts.
- `cfn-init` processes the metadata defined in the CloudFormation template under the "`AWS::CloudFormation::Init`" key and performs the specified tasks accordingly. The metadata can include packages to install, files to create, services to enable, and commands to execute during instance initialization.

### cfn-signal

- `cfn-signal` is a helper script to signal the status of an AWS CloudFormation stack resource.
- It is commonly used in conjunction with AWS CloudFormation Auto Scaling groups and Amazon EC2 instances.
- During the stack creation or update process, `cfn-signal` is typically called from within user data scripts running on EC2 instances to notify AWS CloudFormation about the successful initialization of the instance. This signals that the instance is ready and healthy to proceed with the stack creation or update process.
### Wait conditions

Wait Conditions, as the name suggests, is a tool used to control the order of creation of the AWS resources in a CloudFormation stack. It can pause the creation of a stack and wait for a signal to ensure that specific resources and configurations were properly launched before resuming the stack creation process.

For example, you might want to download and configure applications on an Amazon EC2 instance before considering the creation of that Amazon EC2 instance complete.

Q: How to resolve a situation where wait condition didn't receive the required number of signals from an Amazon EC2 Instance?

Answer:
- Ensure that the AMI you're using has the AWS CloudFormation **helper scripts** installed. If the AMI doesn't include the helper scripts, you can also download them to your instance.
- Verify that the **cfn-init & cfn-signal** command was successfully run on the instance. You can view logs, such as `/var/log/cloud-init.log` or `/var/log/cfn-init.log`, to help you debug the instance launch.
- You can retrieve the logs by logging in to your instance, but you **must disable rollback on failure** or else by default AWS CloudFormation deletes the instance after your stack fails to create.
- Verify that the instance has a connection to the Internet. If the instance is in a VPC, the instance should be able to connect to the Internet through a NAT device if it's is in a private subnet or through an Internet gateway if it's in a public subnet.
  - For example, run: curl -I https://aws.amazon.com

## Configuration


### DeletionPolicy

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

```yml
NewVolume:
  Type: AWS::EC2::Volume
  Properties:
    Size: 100
    Encrypted: true
    AvailabilityZone: !GetAtt Ec2Instance.AvailabilityZone
    Tags:
      - Key: MyTag
        Value: TagValue
  DeletionPolicy: Snapshot
```

### OnFailure for CreateStack call

You can use the OnFailure property of the CloudFormation CreateStack call for this use-case. The OnFailure property determines what action will be taken if stack creation fails. This must be one of `DO_NOTHING`, `ROLLBACK`, or `DELETE`. You can specify either OnFailure or DisableRollback, but not both.

Using the OnFailure property, you can prevent the termination of the EC2 instances created by the CloudFormation stack. Below is the example

```
https://cloudformation.us-east-1.amazonaws.com/
 ?Action=CreateStack
 &StackName=MyStack
 &TemplateBody=[Template Document]
 &NotificationARNs.member.1=arn:aws:sns:us-east-1:1234567890:my-topic
 &Parameters.member.1.ParameterKey=AvailabilityZone
 &Parameters.member.1.ParameterValue=us-east-1a
 &Version=2010-05-15
 &SignatureVersion=2
 &Timestamp=2010-07-27T22%3A26%3A28.000Z
 &AWSAccessKeyId=[AWS Access KeyID]
 &Signature=[Signature]
 &OnFailure=DO_NOTHING
```


## Features
### ChangeSet

![update-stack-changesets-diagram](https://docs.aws.amazon.com/images/AWSCloudFormation/latest/UserGuide/images/update-stack-changesets-diagram.png)
Reference: [Updating stacks using change sets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html)

Change sets allow you to preview how proposed changes to a stack might impact your existing resources, for example, whether your changes will delete or replace any critical resources, AWS CloudFormation makes the changes to your stack only when you decide to execute the change set, allowing you to decide whether to proceed with your proposed changes or explore other changes by creating another change set. You can create and manage change sets using the AWS CloudFormation console, AWS CLI, or AWS CloudFormation API.

:::caution
After you execute a change, AWS CloudFormation removes all change sets that are associated with the stack because they aren't applicable to the updated stack.
:::

### Stack Policy

> TL;DR - Think Stack Policy as a temperate protection to the resources that going to be affected by a stack update.

Stack policies help protect critical stack resources from unintentional updates that could cause resources to be interrupted or even replaced. A stack policy is a JSON document that describes what update actions can be performed on designated resources. Specify a stack policy whenever you create a stack that has critical resources.

- When you create a stack, all update actions are allowed on all resources. By default, anyone with stack update permissions can update all of the resources in the stack. You can prevent stack resources from being unintentionally updated or deleted during a stack update by using a stack policy. 
- After you set a stack policy, all of the resources in the stack are protected by default. To allow updates on specific resources, you specify an explicit `Allow` statement for those resources in your stack policy; otherwise, no changes are made to protected resources.


The following example stack policy prevents updates to the ProductionDatabase resource:

```json
{
  "Statement" : [
    {
      "Effect" : "Allow",
      "Action" : "Update:*",
      "Principal": "*",
      "Resource" : "*"
    },
    {
      "Effect" : "Deny",
      "Action" : "Update:*",
      "Principal": "*",
      "Resource" : "LogicalResourceId/ProductionDatabase"
    }
  ]
}
```

This policy allows updates to all resources except for the MyDatabase, which is denied by default.

```json
{
  "Statement" : [
    {
      "Effect" : "Allow",
      "Action" : "Update:*",
      "Principal": "*",
      "NotResource" : "LogicalResourceId/MyDatabase"
    }
  ]
}
```

> Further reading: [Prevent updates to stack resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/protect-stack-resources.html)

### Termination protection

![termination-protection](/img/aws/development/cf/termination-protection.png)

You cannot delete stacks that have termination protection enabled. If you attempt to delete a stack with termination protection enabled, the deletion fails and the stack(including its status) remains unchanged. 
  - Solution: Disable termination protection on the stack, then perform the delete operation again.

This includes nested stacks whose root stacks have termination protection enabled. 
  - Solution:  Disable termination protection on the root stack, then perform the delete operation again. It is strongly recommended that you do not delete nested stacks directly, but only delete them as part of deleting the root stack and all its resources.

## Stack
### StackSets with AWS Organizations

![StackSetsArchitecture](/img/aws/development/cf/StackSetsArchitecture.png)
> TL;DR - You can imagine template is just **a class** and stackset is **a instance of a class** which has configured the attributes as same as programming. 

AWS Accounts in multiple regions can now be managed effortlessly with StackSets. Previously, account grouping was mainly for billing, but with **AWS Organizations**, you gain centralized control over multiple accounts for various needs like billing, access control, compliance, security, and resource sharing. 

- StackSets allow you to easily orchestrate any AWS CloudFormation service across accounts and regions. 
- You can deploy IAM roles, EC2 instances, or Lambda functions across your organization's accounts and regions. StackSets simplify cross-account permissions configuration and automate resource creation and deletion when joining or removing accounts from your Organization. 
- Enable data sharing, use the StackSets console, and leverage the service-managed permission model for seamless deployment across your organization.

How to use AWS CloudFormation StackSets for Multiple Accounts in an AWS Organization:
![Deployment options](/img/aws/development/cf/stackset.png)

Reference: [Use AWS CloudFormation StackSets for Multiple Accounts in an AWS Organization](https://aws.amazon.com/blogs/aws/new-use-aws-cloudformation-stacksets-for-multiple-accounts-in-an-aws-organization/)

### Nested Stack

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


## Behavoirs
### Roll back an update

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

### Self-managed permissions or Service-managed permissions to create Stack sets  

> TL:DR - If you require custom access controls or want to align permissions with your existing IAM setup, self-managed permissions provide more flexibility. On the other hand, if you prefer a simpler setup and want AWS to handle the IAM roles for you, service-managed permissions offer convenience and consistency.

Stack sets can be created using either **self-managed permissions** or **service-managed permissions**. 

With service-managed permissions, you can deploy stack instances to accounts managed by AWS Organizations. Using this permissions model, you don't have to create the necessary IAM roles; StackSets creates the IAM roles on your behalf. 
- **An administrator account** is the AWS account in which you create stack sets. The administrator account is either the organization's management account or a delegated administrator account. **A target account** is an account into which you create, update, or delete one or more stacks in your stack set. 
- Before you can use a stack set to create stacks in a target account, you must set up **a trust relationship** between the administrator and target accounts.


## Trouble shooting

### Template contains custom named IAM resources

If your template contains **custom named IAM resources**, **don't create multiple stacks reusing the same template**. IAM resources must be globally unique within your account. If you use the same template to create multiple stacks in different Regions, your stacks might share the same IAM resources, instead of each having a unique one. 

Shared resources among stacks can have unintended consequences from which you can't recover. For example, if you delete or update shared IAM resources in one stack, you will unintentionally modify the resources of other stacks.

### Import an existing resource into a stack using the AWS Management Console

![stack-actions-import](/img/aws/development/cf/stack-actions-import.png)

If you created an AWS resource outside of AWS CloudFormation management, you can bring this existing resource *which managed manually* into AWS CloudFormation management using `resource import`. You can manage your resources using AWS CloudFormation regardless of where they were created without having to delete and re-create them as part of a stack.

For a list of AWS resources that support import operations, see [Resources that support import operations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resource-import-supported-resources.html).

:::infoDrift detection
Performing a drift detection operation on a stack determines whether the stack has drifted from its expected template configuration, and returns detailed information about the drift status of each resource in the stack that supports drift detection. It is not useful for importing resources into CloudFormation.
:::

## Template study

### Important functions

- `!ImportValue` - returns the value of the `Export` field in the output section by another stack. You typically use this function to create cross-stack references
- `!Ref` - Returns the value of the specified parameter or resource.
- `!GetAtt`- Returns the value of an attribute from a resource in the template.
- `!Sub` - Substitutes variables in an input string with values that you specify.

### Export and ImportValue

![DOPF19-CloudFormation-Cross-stack-reference](/img/aws/development/cf/DOPF19-CloudFormation-Cross-stack-reference.png)

Source: [tutorialsdojo](https://tutorialsdojo.com/aws-cloudformation/)

### S3

- The template above creates a bucket as a website. The AccessControl property is set to the canned ACL PublicRead (public read permissions are required for buckets set up for website hosting). 
- Because this bucket resource has a DeletionPolicy attribute set to Retain, AWS CloudFormation will not delete this bucket when it deletes the stack. 
- When run from AWS CLI, URL of the website hosted on S3 will be displayed as output. The Output section uses `Fn::GetAtt` to retrieve the WebsiteURL attribute and DomainName attribute of the S3Bucket resource.

:::infoOutputs section
- The optional `Outputs` section declares output values that you can
  - [import into other stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html)(to [create cross-stack references](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/walkthrough-crossstackref.html)) by using Export
  - return in response in CLI (to describe stack calls)
  - [view on the AWS CloudFormation console](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-view-stack-data-resources.html)
:::

```
AWSTemplateFormatVersion: 2010-09-09
Resources:
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: PublicRead
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: error.html
    DeletionPolicy: Retain
  BucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      PolicyDocument:
        Id: MyPolicy
        Version: 2012-10-17
        Statement:
          - Sid: PublicReadForGetBucketObjects
            Effect: Allow
            Principal: '*'
            Action: 's3:GetObject'
            Resource: !Join
              - ''
              - - 'arn:aws:s3:::'
                - !Ref S3Bucket
                - /*
      Bucket: !Ref S3Bucket
Outputs:
  WebsiteURL:
    Value: !GetAtt
      - S3Bucket
      - WebsiteURL
    Description: URL for website hosted on S3
  S3BucketSecureURL:
    Value: !Join
      - ''
      - - 'https://'
        - !GetAtt
          - S3Bucket
          - DomainName
    Description: Name of S3 bucket to hold website content
```