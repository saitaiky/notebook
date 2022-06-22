---
title: Core concepts
sidebar_position: 0
---

A **Cluster** is a set of nodes grouped together, this way even if one node fails you have your application still accessible from the other Nodes. Moreover having multiple nodes helps in sharing load as well.

**Kubectl (Cube control)** is the command line tool that you will use to talk to the Kubernetes API. The main way we talk to Kubernetes is through its API. There are lots of tools they can talk to the API.

## Master and worker/node

### Worker/Node
Node is a machine, laptop, physical or virtual one which Kubernetes is installed and Node is a worker machine and that is where containers will be launched by Kubernetes and doing any work assigned to them by the master node. 

### Master
The Master is another node with Kubernetes installed in it and is configured as a Master. The Master watches over the Nodes in the cluster and is responsible for the actual orchestration of containers on the worker Nodes.

- All the information gathered are stored in a key value store on the master. The key value store is based on the popular ETCD framework.  
- The control manager 
- Scheduler
- etc

### How do they communicate?
![Master vs Worker](/img/web-development/kubernetes/master-vs-worker.png)
Source: [Kubernetes-CKAD](https://bhavyasree.github.io/kubernetes-CKAD/01.kubernetes-architecture/)
- The master server has the Kube API server and that is what makes it a master. 
- The worker nodes have to Kubelet agent that is responsible for interacting with a master to provide health information of the worker node and carry out actions requested by the Master on the worker nodes. 

## Components

![Comsponents of K8s](/img/web-development/kubernetes/components-of-kubernetes.svg)
Source: [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/)
When you install Kubernetes on a system you're actually installing the following components
### The API server
The API server acts as the front end for Kubernetes, the users, management devices, command line interfaces all talk to the API server to interact with Kubernetes cluster. 

### ETCD key store
ETCD is a distributed reliable key-value store used by Kubernetes to store all data used to manage the cluster. When you have multiple Nodes and multiple Masters in your cluster, ETCD stores all that information on all the nodes in the cluster in a distributed manner. ETCD is responsible for implementing locks within the cluster to ensure that there are no conflicts between the Masters.

### Scheduler
The scheduler is responsible for distributing work or containers across multiple nodes it looks for newly created containers and assigns them to nodes.

### Controller

The controllers are the brain behind orchestration. They are responsible for noticing and responding when nodes, containers or end points goes down. It's basically a loop that's seeing the whole system and figuring out how to make everything that's currently happening the same as what you've asked it to do.

Many types of Controllers inc. **Deployment**, **ReplicaSet**, **StatefulSet**, **DaemonSet**, **Job**, **CronJob**, etc.
### Container runtime 

The container runtime is the underlying software that is used to run containers. It can be Docker, but there are other options as well.

### Kubelet

Kubelet is the agent that runs on each node in the cluster. The agent is responsible for making sure that the containers are running on the nodes as expected.

:::info Why docker doesn't need a seperate agent?
Since **Docker** had **Swarm** built in, it didn't really need the separate agent. That was all built into the **Docker Engine**. With Kubernetes running on top of that, it needs its own engine API that talks to the local Docker, or the local runtime, whichever that may be. Then it talks back up to the **control plane**(Its synonym is **master**), which is in charge of running the Kubernetes cluster.
::: 

### Control Plane / Master

Control Plane is a set of containers that manage the cluster

- Includes API server, scheduler, controller manager, etcd, and more
- Sometimes called the "master"

## POD

However, K8s does not deploy containers directly on the worker notes. The containers are encapsulated into a commonalties object known as pods. 

![pods-relationship](/img/web-development/kubernetes/121-12many-pods.png)
Source: [Instance-per-Pod Webhook: IaaS-level isolation for Kubernetes Pods](https://medium.com/nttlabs/instance-per-pod-bcbfb3ae2985)

- A pod is a single instance of an application. 
- A pod is the smallest object that you can create in K8s.
- Usually, POD and container is **a 1:1 relationship**
    - It can be in the same node
    - It can be in a different node to expand the clusters physical capacity.
- Sometimes, POD and different type of containers can be **a 1 to many relationship** (Usually, they're helper containers for the main container)
    - Since they are part of the same pod, the two containers can also communicate with each other directly by referring to each other as localhost, since they share the same network space.
    - easily share the same storage space as well.


## Others
### service

The service just means you're giving it a persistent endpoint in the cluster so that everything else can access that set of pods at a specific DNS name and port. 


### namespace

The namespace is really just a filter on your view at the command line. That's really all it is. It's not a security feature. If you're familiar with some of the internals of Docker, you hear about namespaces in Docker. **This is in no way the same thing in kubernetes**. This is simply a way for you to filter your views when you're using the kubectrl command line.

A good example might be when using Docker Desktop, it defaults to the default namespace and filters out all of the system containers running Kubernetes in the background.


## Further Reading 

- [Kubernetes Documentation - Components](https://kubernetes.io/docs/concepts/overview/components/#master-components)
- [Kubernetes Documentation -Pods](https://kubernetes.io/docs/concepts/workloads/pods/)
- [Kubernetes Documentation -Service](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Kubernetes Documentation -Name Space](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)