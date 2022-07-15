---
title: Others
description: Others
keywords:
  - Others
---


## AWS Managed Microsoft AD vs AD Connector vs Simple AD

- You should use AD Connector if you only need to allow your on-premises users to log in to AWS applications with their Active Directory credentials.
- Simple AD is the least expensive option and your best choice if you have 5,000 or fewer users and don't need the more advanced Microsoft Active Directory features such as trust relationships with other domains.
- AWS Managed Microsoft AD would also allow you to run directory-aware workloads in the AWS Cloud. AWS Managed Microsoft AD is your best choice if you have more than 5,000 users and need a trust relationship set up between an AWS hosted directory and your on-premises directories.