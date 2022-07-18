---
title: Organizations
description: Organizations
keywords:
  - Organizations
sidebar_position: 2
---

## Account migration

To migrate accounts from one organization to another, you must have root or IAM access to both the member and master accounts. 

Here are the steps to follow: 

1. Remove the member account from the old organization 
2. Send an invite to the new organization 
3. Accept the invite to the new organization from the member account


## Service Control Policies (SCP) related


![hibernate](/img/aws/management/organizations/organizational-units-900x572.png)

Source: [Getting a grip on your AWS permission policies](https://oblcc.com/blog/getting-a-grip-on-your-aws-permission-policies/)

-   If a user or role has an IAM permission policy that grants access to an action that is either not allowed or explicitly denied by the applicable SCPs, the user or role can't perform that action
-   SCPs affect all users and roles in attached accounts, including the root user
-   SCPs do not affect service-linked role