---
title: EKS
sidebar_position: 5
---

The kubectl command-line tool uses configuration information in kubeconfig files to communicate with the API server of a cluster. You can choose either of these two procedures to create or update a kubeconfig file for your Amazon EKS cluster:

- Creating it automatically with the AWS CLI update-kubeconfig command.
- Creating it manually using the AWS CLI or the aws-iam-authenticator.

Amazon EKS uses the aws eks get-token command, available in version 1.16.156 or later of the AWS CLI or the AWS IAM Authenticator for Kubernetes with kubectl for cluster authentication.

You can use kubeconfig files to organize information about clusters, users, namespaces, and authentication mechanisms. The `kubectl` command-line tool uses kubeconfig files to find the information it needs to choose a cluster and communicate with the API server of a cluster.

By default, `kubectl` looks for a file named `config` in the `$HOME/.kube` directory. You can specify other kubeconfig files by setting the `KUBECONFIG` environment variable or by setting the [`--kubeconfig`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl/) flag.