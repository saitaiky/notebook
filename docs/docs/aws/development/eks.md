---
title: EKS
sidebar_position: 5
description: Kubernetes service on AWS providing kubeconfig authentication, AWS IAM integration, and kubectl CLI for managing containerized applications.
keywords:
  - aws
  - amazon web services
  - development
  - eks
  - eks aws
  - eks guide
  - development on aws
  - eks tutorial
---

The kubectl command-line tool uses configuration information in kubeconfig files to communicate with the API server of a cluster. You can choose either of these two procedures to create or update a kubeconfig file for your Amazon EKS cluster:

- Creating it automatically with the AWS CLI update-kubeconfig command.
- Creating it manually using the AWS CLI or the aws-iam-authenticator.

Amazon EKS uses the aws eks get-token command, available in version 1.16.156 or later of the AWS CLI or the AWS IAM Authenticator for Kubernetes with kubectl for cluster authentication.

You can use kubeconfig files to organize information about clusters, users, namespaces, and authentication mechanisms. The `kubectl` command-line tool uses kubeconfig files to find the information it needs to choose a cluster and communicate with the API server of a cluster.

By default, `kubectl` looks for a file named `config` in the `$HOME/.kube` directory. You can specify other kubeconfig files by setting the `KUBECONFIG` environment variable or by setting the [`--kubeconfig`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl/) flag.
## IAM access to the cluster: aws-auth ConfigMap vs EKS access entries

EKS clusters need a mapping between **IAM principals** (users/roles) and **Kubernetes RBAC permissions**, since Kubernetes itself has no concept of IAM.

- The original mechanism is the **`aws-auth` ConfigMap**, a Kubernetes object you edit directly (via `kubectl`) to map IAM role/user ARNs to Kubernetes usernames and groups. It's fully manual, has no built-in audit trail of who changed it, and — because it lives *inside* the cluster — you need working `kubectl` access to the cluster before you can fix a broken mapping, which creates a chicken-and-egg problem if you lock yourself out.
- **EKS access entries** (the newer, AWS-recommended approach) let you manage the same IAM-to-RBAC mapping through the **EKS API** (console, CLI, IaC) instead of editing a ConfigMap by hand. Because it's an AWS API-level construct, changes are tracked in **CloudTrail**, access can be granted/revoked without ever needing `kubectl` access first, and AWS provides built-in **access policies** (e.g., cluster admin, view-only) you can attach directly to an access entry.

:::tip Exam trap: "can't recover cluster access after a bad aws-auth edit" → access entries avoid this
If a scenario describes a team locking themselves out of a cluster by misconfiguring the `aws-auth` ConfigMap, or needing an **auditable, IAM-native way to grant Kubernetes access without touching in-cluster config**, the answer is **EKS access entries**, not manually editing `aws-auth`.
:::

## Related foundations

Kubernetes schedules containers, while Linux [namespaces and cgroups](/linux/namespace/) provide the underlying process
isolation and resource controls. [POSIX users](/linux/posix-user/) explain host identity; [AWS IAM](/aws/management/iam/)
and Kubernetes RBAC form separate authorization layers that EKS must map deliberately. Compare [ECS](/aws/compute/ecs-ecr/)
when the workload needs managed container orchestration but not the Kubernetes API or ecosystem.
