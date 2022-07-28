---
title: IAM
description: IAM
keywords:
  - IAM
sidebar_position: 3
---


## Identity vs Resource-based AWS IAM Policies

> Source: [Identity vs Resource-based AWS IAM Policies](https://sonalake.com/latest/identity-vs-resource-based-aws-iam-policies/)

### Identity-based Policies

Identity-based policies grant permissions to an identity. An identity-based policy dictates whether an identity to which this policy is attached is allowed to make API calls to particular AWS resources or not. For example, the following policy would allow a user to invoke any Get or List request on any S3 resource.

![](/img/aws/management/identity-based-policies.png)

### Resource-based Policies

Resource-based policies grant permissions to the principal (可以係user / [service - 如果係service 既話就叫service-based principal) that is specified in the policy. They specify who or what can invoke an API from a resource to which the policy is attached.

For example, the policy below specifies that S3 events on the bucket arn:aws:s3:::test-bucket-cezary can be handled by the Lambda (lambda-s3) in account id 1234567890 in eu-west-1 region.


![](/img/aws/management/resource-based-policy.png)

In this case, the principal is "a caller" who can invoke a particular action on the specific resource arn:aws:s3:::test-bucket-cezary.