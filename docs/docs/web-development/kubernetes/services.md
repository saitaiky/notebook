---
title: Services
sidebar_position: 2
---

This section is to take your set of deployments, your pods, and creating a persistent endpoint that can talk to them. Then we will talk about how to expose them internally, in the cluster, or also externally to outside sources.

When you create pods in Kubernetes, they don't automatically get a DNS name for external connectivity with an IP address, tight. You would want to do that with creating a service on top of that existing pod.

`kubectl expose` creates a service for existing pods
- A **service** is a stable address for pod(s)
- CoreDNS service allows us to resolve **services** by name

## Different type of servies

There are different types of services
- ClusterIP (default & out-of-the-box service)
    - Single, internal virtual IP
    - Only reachable from **within cluster** (nodes and pods)
    - Pods can reach **service** on apps port number
- NodePort (out-of-the-box service)
    - is designed for something outside the cluster to talk to your service through the IP addresses on the nodes
    - High port allocated on each node (Won't be small port like port 80)
    - Port is open on every node’s IP <== Sai: not quite understand
    - Anyone can connect (if they can reach node)
    - Other pods need to be updated to this port
- LoadBalancer (Mostly used in cloud)
    - Controls a LB endpoint **external to the cluster**
    - Only available when infra provider gives you a LB (AWS ELB, etc)
    - Creates NodePort+ClusterIP services, tells LB to send to NodePort  <== Sai: not quite understand
- ExternalName (Use less often)
    - Not related inbound traffic but stuff in your cluster needing to **talk to outside services**.
    - Adds CNAME DNS record to CoreDNS only
    - Not used for Pods, but for giving pods a DNS name to use for something outside Kubernetes
    - example of using external name is doing migration. Migrating service from outside of K8s cluster that you can't control the DNS remmotely to internal K8s cluster. you could use ExternalName as a substitute to control the DNS inside your Kubernetes workflow.
- Kubernetes Ingress (Final way to that traffic can get inside your cluster. Sai: Talk later)


## Create a ClusterIP type of service

```bash
# Create 5 pods to listen to requests
$ kubectl create deployment httpenv --image=bretfisher/httpenv
$ kubectl scale deployment/httpenv --replicas=5

# Create service 
$ kubectl expose deployment/httpenv --port 8888
```

Sending curl to the services
- Approach 1: `curl [Service Name]:8888` 
    - Because the service name that we created becomes part of the DNS name. So we can connect it directly via
- Approach 2:`curl [ip of service]:8888` **Only work on Linux:** 
    - The way that Kubernetes works is that all nodes and containers, by default, can talk to each other out-of-the-box. The node that you're on, **assuming that you're running Kubernetes on that local machine**, has access to all of these private IP addresses. 
    - The reason that doesn't work from Docker Desktop is because you're sitting on **Mac or Windows** when you're typing those commands, and they are not on the same cluster of Kubernetes as that Linux VM running your Kubernetes for you.

```bash
# Approach 1: Create a pod to send curl requests in its bash to above 5 pods
$ kubectl run tmp-shell --rm -it --image bretfisher/netshoot -- bash
bash-5.1# curl httpenv:8888

# Approach 2 (Only work in Linux): 
$ kubectl get service
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
httpenv      ClusterIP   10.108.189.10   <none>        8888/TCP   35m
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP    2d18h

$ curl 10.96.0.1:8888
```



## Further reading 

[Kubernetes Documentation - Service](https://kubernetes.io/docs/concepts/services-networking/service/)