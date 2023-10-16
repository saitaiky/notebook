---
title: IAM
description: IAM
keywords:
  - IAM
sidebar_position: 1
---

AWS Identity and Access Management (IAM) is a service that enables you to securely manage access to AWS resources. It allows you to create and control users, groups, and roles and define their permissions to interact with various AWS services. IAM helps you implement the principle of least privilege, ensuring that users and services have only the necessary permissions for their tasks. It's a fundamental tool for enhancing security and managing access to your AWS resources, making it a critical component of any AWS environment.

## IAM Access Analyzer

Access Analyzer identifies resources shared with external principals by using logic-based reasoning to analyze the resource-based policies in your AWS environment. For each instance of a resource shared outside of your account, Access Analyzer generates a finding.

AWS IAM Access Analyzer provides the following capabilities:

- Access Analyzer helps identify resources in your organization and accounts that are shared with an external entity.
- Access Analyzer validates IAM policies against policy grammar and best practices.
- Access Analyzer generates IAM policies based on access activity in your AWS CloudTrail logs.

![2020-iam-2-List-of-findings-featured-1](/img/aws/management/iam/2020-iam-2-List-of-findings-featured-1.png)

Source: [New – Use AWS IAM Access Analyzer in AWS Organizations](https://aws.amazon.com/blogs/aws/new-use-aws-iam-access-analyzer-in-aws-organizations/)
## Access control policy

In AWS, an access control policy is a set of rules that define what actions are allowed or denied on AWS resources. These policies are primarily used with AWS Identity and Access Management (IAM) to manage permissions for users, groups, and roles. Access control policies help ensure security and compliance by governing who can access specific resources and what actions they can perform.

AWS access control policies are written in JSON (JavaScript Object Notation) format and consist of statements. Each statement defines a specific permission effect (allow or deny) for certain actions on particular AWS resources.

### Example 1

In this example policy, when attached to the IAM group "Developers," will grant read-only access to the S3 bucket "example-bucket" for all members of that group.:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::example-bucket/*",
            "Condition": {
                "StringEquals": {
                    "aws:PrincipalTag/GroupName": "Developers"
                }
            }
        }
    ]
}
```


### Example 2

In this example, the following Amazon S3 bucket policy allows members of any account in the `o-xxxxxxxxxxx` organization to add an object into the `policy-ninja-dev` bucket by using **`aws:PrincipalOrgID`**. Reference: [AWS global condition context keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html)

Also, to grant permission to everyone(referred as anonymous access), you set the wildcard ("*") as the Principal value. For example, if you configure your bucket as a website, you want all the objects in the bucket to be publicly accessible. The following are equivalent.

- `"Principal":"*"`
- `"Principal":{"AWS":"*"}`


```json
 {
  "Version": "2012-10-17",
  "Statement": {
    "Sid": "AllowPutObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:PutObject",
    "Resource": "arn:aws:s3:::policy-ninja-dev/*",
    "Condition": {"StringEquals":
      {"aws:PrincipalOrgID":"o-xxxxxxxxxxx"}
    }
  }
}
```

### Multiple conditions Logical `AND`

Access is allowed for Amazon DynamoDB `GetItem` operation during the period starting from April 1 to December 31, 2023 (UTC) and provided that the request originates from the `vpc-111aaa22` Amazon VPC.

```json
{
"Version": "2012-10-17",
"Statement": {
    "Effect": "Allow",
    "Action": "dynamodb:GetItem",
    "Resource": "*",
    "Condition": {
    "DateGreaterThan": {
     "aws:CurrentTime": "2023-04-01T00:00:00Z"
    },
    "DateLessThan": {
      "aws:CurrentTime": "2023-12-31T23:59:59Z"
    }
    },
    "StringEquals": {
      "aws:SourceVpc": "vpc-111aaa22"
    }
  }
}
```

## Managing access to IAM roles

Let's dive into how you can control access to IAM roles by understanding the policy types that you can apply to an IAM role.

There are three circumstances where policies are used for an IAM role:

- Trust policy
  - The [trust policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#term_trust-policy) defines which principals can assume the role, and under which conditions. A trust policy is a specific type of [*resource-based policy*](https://docs.aws.amazon.com/codepipeline/latest/userguide/security_iam_resource-based-policy-examples.html) for IAM roles. The IAM service supports **only one type of resource-based policy** called a **role trust policy**, which is attached to an IAM role.
- Identity-based policies ([inline and managed](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html))
  - These policies define the permissions that the user of the role is able to perform (or is [denied from performing](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html#AccessPolicyLanguage_Interplay)), and on which resources.
  - Inline policies are useful if you want to maintain a strict one-to-one relationship between a policy and the principal entity that it’s applied to. 
  - Managed policies is good for a group of users
- Permissions boundary
  - A [permissions boundary](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) is an advanced feature for using a managed policy to set the maximum permissions for a role. A principal's permissions boundary allows it to perform only the actions that are allowed by both its identity-based permissions policies and its permissions boundaries. You can use permissions boundaries to [delegate permissions management tasks, such as IAM role creation, to non-administrators](https://aws.amazon.com/blogs/security/how-to-let-builders-create-iam-resources-while-improving-security-and-agility-for-your-organization/) so that they can create roles in self-service.

## IAM role vs IAM user

![role-vs-user](/img/aws/management/iam/role-vs-user.png)

Source: [A foolproof guide to AWS IAM Roles](https://www.archerimagine.com/articles/aws/aws-iam-roles.html)

IAM roles are used for three main purposes: 
- One AWS service using another service, like EC2 instance accessing S3, 
- Non-AWS users needing temporary access to AWS resources in a hybrid environment,
- Developers needing cross-account access to resources. 

IAM roles act like "**hats**" granting permissions when worn and reverting to the original state when removed. An example can be - An EC2 instances should use IAM roles instead of storing IAM user credentials. A role can be attached during instance creation but not after. Only one IAM role can be attached to an EC2 instance at a time.

To simplify, use IAM roles for resources and temporary access by physical users, while IAM users are for permanent user accounts. IAM roles and IAM users serve different purposes in managing access and permissions in AWS.

## Identity vs Resource-based AWS IAM Policies

> Reference: [Identity vs Resource-based AWS IAM Policies](https://sonalake.com/latest/identity-vs-resource-based-aws-iam-policies/)


IAM Roles and Resource Based Policies are two different approaches for granting access to AWS resources across different accounts.

IAM Roles involve assigning permissions to a role in one account that can be assumed by a user or service in another account. By assuming the role, the user or service inherits the permissions associated with that role, but they relinquish their original permissions. This means they can perform actions allowed by the role but cannot use their own permissions.

Resource Based Policies, on the other hand, are attached directly to the AWS resource itself, such as an S3 bucket. These policies define the permissions for specific principals, allowing them to access the resource without assuming a role. The principal retains their original permissions and can access the resource using the resource-based policy.

When there is a need for a user in Account A to scan a DynamoDB table in Account A and write to an S3 bucket in Account B, **using a resource-based policy is preferred**. This avoids the need to assume a role and allows the user to perform both actions without giving up their original permissions.

Resource-based policies are supported by various AWS services and resources, including Amazon S3 buckets, SNS topics, SQS topics, Lambda functions, and more. *Their support of Resource-based policies continues to expand over time*.


### Identity-based Policies

Identity-based policies grant permissions to an identity. An identity-based policy dictates whether an identity to which this policy is attached is allowed to make API calls to particular AWS resources or not. For example, the following policy would allow a user to invoke any Get or List request on any S3 resource.

![](/img/aws/management/iam/identity-based-policies.png)

### Resource-based Policies

Resource-based policies grant permissions to the principal (可以係user / [service - 如果係service 既話就叫service-based principal) that is specified in the policy. They specify who or what can invoke an API from a resource to which the policy is attached.

For example, the policy below specifies that S3 events on the bucket arn:aws:s3:::test-bucket-cezary can be handled by the Lambda (lambda-s3) in account id 1234567890 in eu-west-1 region.


![](/img/aws/management/iam/resource-based-policy.png)

In this case, the principal is "a caller" who can invoke a particular action on the specific resource arn:aws:s3:::test-bucket-cezary.

### Identity vs Resource-based policy in eventBridge

When using Amazon EventBridge, there are two types of targets: 
- those that support **resource-based policies** (such as Lambda, SNS, SQS, CloudWatch Logs, API Gateway)
- those that require **an IAM role** (e.g., Kinesis data streams or Systems Manager Run Command). 

For resource-based policy targets, you should modify the target resource to allow the EventBridge rule the necessary permissions. For IAM role targets, the IAM role is attached to the EventBridge rule and grants permissions to perform actions like writing to Kinesis. 

As of July 2023, SNS, SQS, Lambda utilize resource-based policies while Kinesis data streams use IAM roles.

## Trusted Entity from Trust policy

> TL;DR - Think of aws "trusted relations" or "trusted entities" as which aws service principal can implement (assume role) the permissions you giving.

![AWS-IAMRole-Trust](/img/aws/management/iam/AWS-IAMRole-Trust.png)

Source: [Tutorialsdojo](https://tutorialsdojo.com/)

A Trusted Entity is an object from outside of your AWS Account which is allowed to gain access to a resource within your account – in our case that resource will be an IAM role, which will in turn grant them permissions within the account.

Depending on the duties of the user(s) you’ll be granting access to, you may want to have multiple IAM roles with specific and granular access configured for each. The first step in creating a new IAM Role is to select what type of trusted entity will be using the role – either an **AWS Service, another AWS Account, a web identity, or SAML federation**.

### Same permission for both groups, modify one group to have specific permission

Consider a scenario where a sizable team consists of developers and testers. In the Development account, there are two IAM groups: Developers and Testers. Both groups have the necessary permissions to operate within the development account and access its resources. Occasionally, a developer needs to make updates to the active S3 Bucket located in the production account. 

How will you configure the permissions for developers to access the production environment?

**Answer:** To enable developers to update the live S3 buckets in the production account while restricting access for testers, follow these steps:

1. Create a Role in the production account, designating the Development account as a trusted entity.
2. Define a permissions policy for the Role that grants trusted users the necessary access to update the bucket.
3. Modify the IAM group policy in the Development account to deny access to the newly created Role specifically for testers.
4. Developers can utilize the newly created Role to access the live S3 buckets within the production environment, leveraging the defined permissions.

### Assign IAM Roles to EC2 if they start with "RDS-"

To configure many AWS services, you must pass an IAM role to the service. This allows the service to later assume the role and perform actions on your behalf. You only have to pass the role to the service once during set-up, and not every time that the service assumes the role.

To pass a role (and its permissions) to an AWS service, a user must have permission to pass the role to the service. This helps administrators ensure that only approved users can configure a service with a role that grants permissions. To allow a user to pass a role to an AWS service, you must grant the `PassRole` permission to the user's IAM user, role, or group.

The given policy applies to roles only starting with `RDS-`, so the overall policy allows you to assign IAM Roles to EC2 if they start with "RDS-".

```json
{
    "Version": "2012-10-17",
    "Id": "Secret Policy",
    "Statement": [
        {
            "Sid": "Passrole",
            "Effect": "Allow",
            "Action": [
                "iam:PassRole"
            ],
            "Resource": "arn:aws:iam:::role/RDS-*"
        }
    ]
}
```