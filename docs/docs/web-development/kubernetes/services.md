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
    - High port allocated on each node (Port range: 30000-32767)
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


## Create a ClusterIP service

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

## Create a NodePort

Let's create a NodePort to allow access from some external service. `8888:30839/TCP` - The port on the left is the port inside cluster. The port on the right is the port on your node.

```bash
$ kubectl expose deployment/httpenv --port 8888 --name httpenv-my-np --type NodePort

$ kubectl get services
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
httpenv         ClusterIP   10.108.189.10   <none>        8888/TCP         3h
httpenv-my-np   NodePort    10.97.13.195    <none>        8888:30839/TCP   9s
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP          2d21h
```
After you've run above command...
- If you're on **Linux**, this NodePort is accessible on localhost now. 
- If you're on Docker Desktop, it will provide a convenience layer with something called vpnkit that's just built into Docker Desktop where it will connect this to the localhost on your **Windows or Mac** machine. 

:::info A NodePort service also creates a ClusterIP

These three service types are additive, each one creates the ones above it: 
- ClusterIP
- NodePort (include ClusterIP)
- LoadBalancer (include ClusterIP + NodePort)

**Logic flow**: The load balancer is accepting my packet, then passing it to the NodePort, and then the NodePort is passing it to the cluster IP. There's always going to be that
:::

## Create a Loadbalancer

The load balancer **wasn't built in by default**, and the only way you could use it was through an external service, usually in a **cloud service** - like with AWS, they use ALB or ELB. You would need to add that plugin in your Kubernetes so the kube API would work with those external load balancers.

If you're on Docker Desktop, it provides **a built-in LoadBalancer** that publishes the `--port` on localhost. Each load balancer technically like a third-party plugin or service that's a remote API, the load balancers will all have varying features and supported stuff. 

### Comamnds
:::note
If you're on kubeadm, minikube, or microk8s
- No built-in LB
- You can still run the command, it'll just stay at "pending" (but its NodePort works)
:::

```bash
$ kubectl expose deployment/httpenv --port 8888 --name httpenv-my-lb --type LoadBalancer
$ kubectl get services
NAME            TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
httpenv         ClusterIP      10.108.189.10   <none>        8888/TCP         3h23m
httpenv-my-lb   LoadBalancer   10.97.192.241   localhost     8888:32425/TCP   32s
httpenv-my-np   NodePort       10.97.13.195    <none>        8888:30839/TCP   23m
kubernetes      ClusterIP      10.96.0.1       <none>        443/TCP          2d21h

$ curl localhost:8888
```

### 8888:32425/TCP

`8888:32425/TCP `

With Docker Desktop, all we did is we told it the port `8888` that was a part of the Deployment, and the load balancer service plugin from Docker will then publish it on port `8888`. The right handside of the port is 

`32425` is the NodePort for a load balancer (If you're using Docker Desktop, it's the **built-in LoadBalancer**), eventhough that's not really the port the load balancer is using on my localhost.

## Further reading 

[Kubernetes Documentation - Service](https://kubernetes.io/docs/concepts/services-networking/service/)

