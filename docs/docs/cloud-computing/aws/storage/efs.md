---
title: Elastic File System
description: EFS
keywords:
  - EFS
  - Elastic File System
sidebar_label: EFS
sidebar_position: 2
---

## 2 Modes

There are 2 modes that you can use in EFS.

- **Provisioned Throughput mode** is available for applications with high throughput to storage (MiB/s per TiB) ratios, or with requirements greater than those allowed by the **Bursting Throughput mode**. 
- With **Bursting Throughput mode**, a file system's throughput scales *as the amount of data* stored in the standard storage class grows.

## EFS access points vs EFS mount targets

- **Scope of Access**: Mount targets provide access to the entire EFS file system within a specific subnet, while access points allow customized access to specific directories within the file system.
- **Access Control**: Mount targets do not offer fine-grained access control, whereas access points enable you to apply unique permissions for different applications or users.
- **Number and Association**: You typically have at least one mount target per subnet for accessing an EFS file system, but you can create multiple access points per file system, each with its distinct permissions.