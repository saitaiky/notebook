---
title: IAM
description: IAM
keywords:
  - IAM
sidebar_position: 3
---


You can copy an AMI across AWS Regions
You can share an AMI with another AWS account
Copying an AMI backed by an encrypted snapshot cannot result in an unencrypted target snapshot

| Scenario | Description                | Supported |
| -------- | -------------------------- | --------- |
| 1        | Unencrypted-to-unencrypted | Yes       |
| 2        | Encrypted-to-encrypted     | Yes       |
| 3        | Unencrypted-to-encrypted   | Yes       |
| 4        | Encrypted-to-unencrypted   | No        |

> Source: [AWS - Encryption and copying
](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/CopyingAMIs.html)