---
title: Node, Pod, Control Plane
sidebar_position: 3
---

## The nodes

The nodes executing our containers run a collection of services:
- a container Engine (typically Docker)
- kubelet (the "node agent")
- kube-proxy (a necessary but not sufficient network component)
- Nodes were formerly called "minions" (You might see that word in older articles or documentation)

## The control plane

The Kubernetes logic (its "brains") is a collection of services:
- the API server (our point of entry to everything!)
- core services like the scheduler and controller manager
- etcd (a highly available key/value store; the "database" of Kubernetes)

Together, these services form the control plane of our cluster
- The control plane is also called the "master"

### Running the control plane on special nodes

- It is common to reserve a dedicated node for the control plane (Except for single-node development clusters, like when using minikube)
- This node is then called a "master" **(Yes, this is ambiguous: is the "master" a node, or the whole control plane?)**
- Normal applications are restricted from running on this node (By using a mechanism called "taints")
- When high availability is required, each service of the control plane must be resilient
- The control plane is then replicated on multiple nodes (This is sometimes called a "multi-master" setup)

:::infoControl plane can be one or more master nodes
When we talk about the masters, I like to refer to it as the control plane because it may be one or more master nodes, and control plane refers to all those services that are in control of the cluster.
:::

### Running the control plane outside containers

- The services of the control plane can run in or out of containers
- For instance: since etcd is a critical service, some people deploy it directly on a dedicated cluster (without containers)
- In some hosted Kubernetes offerings (e.g. AKS, GKE, EKS), the control plane is invisible (We only "see" a Kubernetes API endpoint. **You manage your nodes, they manage the control plane.**)
- In that case, there is no "master node". For this reason, it is more accurate to say "control plane" rather than "master."

:::cautionDo we need to run Docker at all?
- By default, Kubernetes uses the Docker Engine to run containers or leverage other pluggable runtimes through the Container Runtime Interface
- `containerd`: maintained by Docker, IBM, and community - Used by Docker Engine, microK8s, k3s, GKE, and standalone; has `ctr` CLI
- `CRI-O`: maintained by Red Hat, SUSE, and community; based on containerd - Used by OpenShift and Kubic, version matched to Kubernetes
:::

## POD

![physical-network](/img/container-orchestration/kubernetes/architecture/pod.png)

Source: Weaveworks

A pod is an abstract concept around one or more containers. It's really an idea. It's not a physical thing. You're not deploying a physical binary that's called a pod. 

The idea of a pod is - it's the lowest deployable unit in Kubernetes. We can never actually touch containers directly. We can only deploy, update and delete pods.

- Pods are a new abstraction!
- A *pod* can have multiple containers working together (But you usually only have on container per pod)
- Pod is our smallest deployable unit; Kubernetes can't mange containers directly
- IP addresses are associated with *pods*, not with individual containers
- Containers in a pod share `localhost`, and can share volumes
- Multiple containers in a pod are deployed together
- In reality, Docker doesn't know a pod, only containers/namespaces/volumes
