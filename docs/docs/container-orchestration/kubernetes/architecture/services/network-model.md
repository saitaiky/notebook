---
title: Network model
sidebar_position: 2
---

> TL;DR - Our cluster (nodes and pods) is one big flat IP network. You can have routing, but you can't have translation. 

-   In detail:
    -   all nodes must be able to reach each other, without NAT
    -   all pods must be able to reach each other, without NAT
    -   pods and nodes must be able to reach each other, without NAT
    -   each pod is aware of its IP address (no NAT)
    -   pod IP addresses are assigned by the network implementation
-   Kubernetes doesn't mandate any particular implementation


## The good

-   Everything can reach everything
-   No address translation
-   No port translation
-   No new protocol
-   The network implementation can decide how to allocate addresses
-   IP addresses don't have to be "portable" from a node to another
    (For example, We can use a subnet per node and use a simple routed topology)

## The less good 

-   verything can reach everything
    -   if you want security, you need to add network policies
    -   the network implementation you use needs to support them
-   Network implementations can be done by by **a 3rd party**(e.g. Flannel, or Calico, or Kubenet) or **cloud service providers**(e.g. AWS)
-   Pods have level 3 (IP) connectivity, but *services* are level 4 (TCP or UDP) 
    - (Services map to a single UDP or TCP port; no port ranges or arbitrary IP packets)
-   `kube-proxy` is on the data path when connecting to a pod or container,\
    and it's not particularly fast (relies on userland proxying or iptables)


## Don't worry about kube-proxy

> Go with your cloud hosting defaults until you have really hard requirements.

- Don't worry about the warning about `kube-proxy` performance
- Unless you:
    - routinely saturate 10G network interfaces
    - count packet rates in millions per second
    - run high-traffic VOIP or gaming platforms
    - do weird things that involve millions of simultaneous connections\
        (in which case you're already familiar with kernel tuning)
- If necessary, there are alternatives to `kube-proxy`; e.g. [`kube-router`](https://www.kube-router.io/)

:::cautionDon't customise it that much
One of the challenges with Kubernetes is everything seems to be so customizable that if you kept customizing everything, eventually, you would end up with a solution that only you could support.  

So, I always encourage you to stick with the defaults as much as possible to rein in your requirements and limit the scope of those so that your solution is looking more and more like all the other solutions out there, so that you don't have a crazy, wild configuration that no one else knows how it works.
:::


## Container Network Interface (CNI)

> TL;DR - Networking in K8s is not a K8s thing, instead CNI defines the specification for networking then the network plugin implement this.

A CNI is a specification to configure network interfaces in Linux containers, which concerned with connecting(add) and disconnecting(delete) containers to networks.

The reason to have CNI is because networking can be highly environment specific. Different projects seek to solve the networking challenges - with potential overlap. Thus, it makes sense to have standard for a common interface

### Under the hood

Most Kubernetes clusters use CNI "plugins" to implement networking. When a pod is created, Kubernetes delegates the network setup to these plugins (it can be a single plugin, or a combination of plugins, each doing one task). For example, one CNI can do the routing to send traffic to the current POD, the other can do the network security policy to prevent traffic from certain regions. 

Typically, CNI plugins will:
- allocate an IP address (by calling an IPAM(IP address management) plugin)
- add a network interface into the pod's network namespace
- configure the interface as well as required routes, etc.

### 3 factors to choose a CNI 

- The "pod-to-pod network" or "pod network":
    - provides communication between pods and nodes
    - is generally implemented with CNI plugins
- The "pod-to-service network":
    - provides internal communication and load balancing
    - is generally implemented with kube-proxy (or maybe kube-router)
- Network policies (That feature is not available in every CNI):
    - provide firewalling and isolation
    - can be bundled with the "pod network" or provided by another component
