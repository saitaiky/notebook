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

![hibernate](/img/aws/management/organizations/organizational-units-900x572.png)

Source: [Getting a grip on your AWS permission policies](https://oblcc.com/blog/getting-a-grip-on-your-aws-permission-policies/)

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


### Assign IAM Roles to EC2 if they start with "RDS-"

To configure many AWS services, you must pass an IAM role to the service. This allows the service to later assume the role and perform actions on your behalf. You only have to pass the role to the service once during set-up, and not every time that the service assumes the role.

To pass a role (and its permissions) to an AWS service, a user must have permission to pass the role to the service. This helps administrators ensure that only approved users can configure a service with a role that grants permissions. To allow a user to pass a role to an AWS service, you must grant the PassRole permission to the user's IAM user, role, or group.

```json
{
    "Version": "2012-10-17",
    "Id": "Secret Policy",
    "Statement": [
        {
            "Sid": "EC2",
            "Effect": "Allow",
            "Action": "ec2:*",
            "Resource": "*"
        },
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