---
title: Organizations
description: Organizations
keywords:
  - Organizations
sidebar_position: 3
---

## Account migration

To migrate accounts from one organization to another, you must have root or IAM access to both the member and master accounts. 

Here are the steps to follow: 

1. Remove the member account from the old organization 
2. Send an invite to the new organization 
3. Accept the invite to the new organization from the member account


## Service Control Policies (SCP) 

> TL;DR - SCPs are used to set **a boundary of permissions** for AWS accounts.

SCPs are similar to AWS Identity and Access Management (IAM) permission policies and use almost the same syntax. However, an SCP never grants permissions. Instead, SCPs are JSON policies that specify the maximum permissions for the affected accounts.

![hibernate](/img/aws/management/organizations/organizational-units-900x572.png)

Source: [Getting a grip on your AWS permission policies](https://oblcc.com/blog/getting-a-grip-on-your-aws-permission-policies/)

![SOAF29-AWS-Organizations-Service-Control-Policies](/img/aws/management/organizations/SOAF29-AWS-Organizations-Service-Control-Policies.png)

- If a user or role has an IAM permission policy that grants access to an action that is either not allowed or explicitly denied by the applicable SCPs, the user or role can't perform that action
- SCPs affect all users and roles in attached accounts, including the root user
- SCPs do not affect service-linked role

### Enforcing Encryption of Data at Rest

You can define service control policies (SCPs) inside AWS Organizations to enforce EFS encryption for all AWS accounts in your organization.


```json
{
  "Version”: "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditior0",
      "Effect": "Allow",
      "Action": "elasticfilesystem:CreateFileSystem",
      "Condition": {
        "Bool": {
          "elasticfilesystem:Encrypted": "true"
        }
      },
      "Resource": "*"
    }
}
```



### A policy to assign a specific role

An IAM *permissions policy* attached to the IAM user that allows the user to pass only those approved roles. You usually add `iam:GetRole` to `iam:PassRole` so the user can get the details of the role to be passed. In this example, the user can pass only roles that exist in the specified account with names beginning with `EC2-roles-for-XYZ-`:

```json
{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Action": [
            "iam:GetRole",
            "iam:PassRole"
        ],
        "Resource": "arn:aws:iam::account-id:role/EC2-roles-for-XYZ-*"
    }]
}
```