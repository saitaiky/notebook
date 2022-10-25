---
title: Configuration
---

## Kubeconfig File

In order to start interacting with your Kubernetes cluster, you will use a different binary called `kubectl`. You will need to [install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) on your local machine.

A *kubeconfig file* is a file which has information like the Kubernetes API address and the path to our TLS certificates used to authenticate. It's used to configure access to Kubernetes when used in conjunction with the kubectl CLI tool (or other clients). 

For more details on how kubeconfig and kubectl work together, see the [Kubernetes documentation](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).

When you deployed Kubernetes, a kubeconfig is automatically generated for your RKE cluster. This file is created and saved as `kube_config_cluster.yml`.

By default, kubectl checks `~/.kube/config` for a kubeconfig file, but you can use any directory you want using the `--kubeconfig` flag. For example:

```bash
$ kubectl --kubeconfig /custom/path/kube.config get pods
```