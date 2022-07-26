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