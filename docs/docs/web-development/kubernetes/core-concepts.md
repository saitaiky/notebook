---
title: Core concepts
---

### Node
Node is a machine, physical or virtual one which Kubernetes is installed and Node is a worker machine and that is where containers will be launched by Kubernetes, It was also known as minion's in the past.

### Cluster
A Cluster is a set of nodes grouped together, this way even if one node fails you have your application still accessible from the other Nodes. Moreover having multiple nodes helps in sharing load as well.

### Master
The Master is another node with Kubernetes installed in it and is configured as a Master. The Master watches over the Nodes in the cluster and is responsible for the actual orchestration of containers on the worker Nodes.

- All the information gathered are stored in a key value store on the master. The key value store is based on the popular ETCD framework.  
- The control manager 
- Scheduler
- etc



The master server has the Kube API server and that is what makes it a master. Similarly the worker nodes have to Kubelet agent that is responsible for interacting with a master to provide health information of the worker node and carry out actions requested by the Master on the worker nodes. 



## Component
When you install Kubernetes on a system you're actually installing the following components - search 6 Haxacon on the internet 

### The API server
The API server acts as the front end for Kubernetes, the users, management devices, command line interfaces all talk to the API server to interact with Kubernetes cluster. 

### ETCD key store
Next is the ETCD key store. ETCD is a distributed reliable key-value store used by Kubernetes to store all data used to manage the cluster. Think of it this way. When you have multiple Nodes and multiple Masters in your cluster, ETCD stores all that information on all the nodes in the cluster in a distributed manner. ETCD is responsible for implementing locks within the cluster to ensure that there are no conflicts between the Masters.

### Scheduler
The scheduler is responsible for distributing work or containers across multiple nodes it looks for newly created containers and assigns them to nodes.

### Controller

The controllers are the brain behind orchestration. They are responsible for noticing and responding when nodes, containers or end points goes down.

### Container runtime 

The container runtime is the underlying software that is used to run containers. It can be Docker, but there are other options as well.

### Kubelet

Kubelet is the agent that runs on each node in the cluster. The agent is responsible for making sure that the containers are running on the nodes as expected.


