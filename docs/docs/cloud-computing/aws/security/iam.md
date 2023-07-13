---
title: IAM
description: IAM
keywords:
  - IAM
sidebar_position: 3
---


## Identity vs Resource-based AWS IAM Policies

> Reference: [Identity vs Resource-based AWS IAM Policies](https://sonalake.com/latest/identity-vs-resource-based-aws-iam-policies/)


IAM Roles and Resource Based Policies are two different approaches for granting access to AWS resources across different accounts.

IAM Roles involve assigning permissions to a role in one account that can be assumed by a user or service in another account. By assuming the role, the user or service inherits the permissions associated with that role, but they relinquish their original permissions. This means they can perform actions allowed by the role but cannot use their own permissions.

Resource Based Policies, on the other hand, are attached directly to the AWS resource itself, such as an S3 bucket. These policies define the permissions for specific principals, allowing them to access the resource without assuming a role. The principal retains their original permissions and can access the resource using the resource-based policy.

When there is a need for a user in Account A to scan a DynamoDB table in Account A and write to an S3 bucket in Account B, **using a resource-based policy is preferred**. This avoids the need to assume a role and allows the user to perform both actions without giving up their original permissions.

Resource-based policies are supported by various AWS services and resources, including Amazon S3 buckets, SNS topics, SQS topics, Lambda functions, and more. *Their support of Resource-based policies continues to expand over time*.


### Identity-based Policies

Identity-based policies grant permissions to an identity. An identity-based policy dictates whether an identity to which this policy is attached is allowed to make API calls to particular AWS resources or not. For example, the following policy would allow a user to invoke any Get or List request on any S3 resource.

![](/img/aws/management/identity-based-policies.png)

### Resource-based Policies

Resource-based policies grant permissions to the principal (可以係user / [service - 如果係service 既話就叫service-based principal) that is specified in the policy. They specify who or what can invoke an API from a resource to which the policy is attached.

For example, the policy below specifies that S3 events on the bucket arn:aws:s3:::test-bucket-cezary can be handled by the Lambda (lambda-s3) in account id 1234567890 in eu-west-1 region.


![](/img/aws/management/resource-based-policy.png)

In this case, the principal is "a caller" who can invoke a particular action on the specific resource arn:aws:s3:::test-bucket-cezary.

### Identity vs Resource-based policy in eventBridge

When using Amazon EventBridge, there are two types of targets: 
- those that support **resource-based policies** (such as Lambda, SNS, SQS, CloudWatch Logs, API Gateway)
- those that require **an IAM role** (e.g., Kinesis data streams or Systems Manager Run Command). 

For resource-based policy targets, you should modify the target resource to allow the EventBridge rule the necessary permissions. For IAM role targets, the IAM role is attached to the EventBridge rule and grants permissions to perform actions like writing to Kinesis. 

As of July 2023, SNS, SQS, Lambda utilize resource-based policies while Kinesis data streams use IAM roles.