---
title: Services
sidebar_position: 2
---

This section is to take your set of deployments, your pods, and creating a persistent endpoint that can talk to them. Then we will talk about how to expose them internally, in the cluster, or also externally to outside sources.

When you create pods in Kubernetes, they don't automatically get a DNS name for external connectivity with an IP address, tight. You would want to do that with creating a **service** on top of that existing pod.

`kubectl expose` creates a service for existing pods
- A **service** is a stable address for pod(s)
- CoreDNS service allows us to resolve **services** by name

## Different type of servies

There are four types of Kubernetes services — `ClusterIP`, `NodePort`, `LoadBalancer` and `ExternalName`. The type property in the Service's spec determines how the service is exposed to the network.

There are different types of services

### ClusterIP (out-of-the-box service)

![ClusterIP](/img/web-development/kubernetes/clusterIP.webp)

Source: [Kubernetes – Service Publishing](https://theithollow.com/2019/02/05/kubernetes-service-publishing/)

- ClusterIP is the default and most common service type
- It provices a single, cluster-internal virtual IP address/ Thus, it's only reachable from **within cluster** (nodes and pods)
- Pods can reach **service** on apps port number

:::info Use Case
Inter service communication within the cluster. For example, communication between the front-end and back-end components of your app.
:::

### NodePort (out-of-the-box service)

![Node Port](/img/web-development/kubernetes/nodePort.webp)

Source: [Kubernetes – Service Publishing](https://theithollow.com/2019/02/05/kubernetes-service-publishing/)
> If we access the IP Address of one of our nodes (`10.10.50.51:30001`or`10.10.50.52:30001`) with the port we specified, we can see our nginx page.

It is **an open port on every worker node in the cluster** that has a pod for that service. When traffic is received on that open port, it directs it to a specific port on the ClusterIP for the service it is representing. 

In a single-node cluster this is very straight forward. In a multi-node cluster the internal routing can get more complicated. In that case you might want to introduce **an external load balancer** so you can spread traffic out across all the nodes and be able to handle failures a bit easier.

- NodePort service is an extension of ClusterIP service. When creating a NodePort Service,  A ClusterIP Service is automatically created
- It is designed for something outside the cluster to talk to your service through the IP addresses on the nodes
- High port allocated on each node (Port range: 30000-32767)
    - By requesting `<NodeIP>:<NodePort>` to access from outside the cluster
- Any incoming packet matching one of the configured NodePorts will get destination NAT’ed to one of the healthy Endpoints and source NAT’ed (via masquerade/overload) to the address of the incoming interface.
- The reply packet coming from the Pod will get reverse NAT’ed using the connection tracking entry set up by the incoming packet.

:::info Use Cases
- When you want to enable external connectivity to your service.
- Using a NodePort gives you the freedom to set up your own load balancing solution, to configure environments that are not fully supported by Kubernetes, or even to expose one or more nodes’ IPs directly.
- Prefer to place a load balancer above your nodes to avoid node failure.
:::

### LoadBalancer (Mostly used in cloud)

- LoadBalancer service is an extension of NodePort service. When createing an external load balancer, NodePort and ClusterIP Service are automatically created.
- It exposes the Service externally using **a cloud provider’s load balancer to access the cluster**
- Only available when infra provider gives you a LB (AWS ELB, etc)
- The actual creation of the load balancer happens asynchronously.
- Each cloud provider (AWS, Azure, GCP, etc) has its own native load balancer implementation. The cloud provider will create a load balancer, which then automatically routes requests to your Kubernetes Service.

:::info Use Case
When you are using a cloud provider to host your Kubernetes cluster.
:::

### ExternalName (Use less often)
- Not related inbound traffic but stuff in your cluster needing to **talk to outside services**.
- Adds CNAME DNS record to CoreDNS only
- Not used for Pods, but for giving pods a DNS name to use for something outside Kubernetes
- example of using external name is doing migration. Migrating service from outside of K8s cluster that you can't control the DNS remmotely to internal K8s cluster. you could use ExternalName as a substitute to control the DNS inside your Kubernetes workflow.

:::info Use Cases
- This is commonly used to create a service within Kubernetes to represent **an external datastore** like a database that runs externally to Kubernetes.
- You can use that ExternalName service (as a local service) when Pods from one namespace to talk to a service in another namespace.
:::

### Ingress

Kubernetes Ingress (Final way to that traffic can get inside your cluster. Sai: take later)

You can also use Ingress to expose your Service. Ingress is not a Service type, but it acts as the entry point for your cluster. It lets you consolidate your routing rules into a single resource as it can expose multiple services under the same IP address.



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


## DNS

DNS is **optional as a service**, or an add on, inside your Kubernetes cluster. But, everyone puts one in there. Starting with 1.11, internal DNS is provided by CoreDNS. When you create a service, you get the hostname that matches the service. But, that hostname is part of a larger name, the **FQDN (fully qualified domain name)**. We didn't get that in Docker or Swarm.

:::danger
You **can't** technically create the same pod, or the same service, or the same Deployment, with the same names, **in the same namespace**.
:::

### Service in different namespace

We can use hostname to access Services but this only works for Services in the same Namespace. e.g. `curl <hostname>`

If we have different name space, we can use the **FQDN**. e.g. `curl <hostname>.<namespace>.svc.cluster.local`
- svc: service
- cluster.local: default service DNS name given to your cluster when you create it or spin it up.

### Namespace in K8s

Namespaces in K8s is really just an organizational parameter, and it doesn't, out-of-the-box, control networking segmentation or anything like that. Usually, what you're going to be dealing with is the **default namespace**. 

As you get larger, you will possibly make **multiple namespaces** for different applications that possibly had the same name. Or maybe you want to deploy the same thing multiple times, with the same service names, pod names, deployment names, and you wouldn't want them to clash, so you would create different namespaces for those.






## Further reading 

- [Kubernetes Documentation - Service](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Kubernetes DNS-Based Service Discovery](https://github.com/kubernetes/dns/blob/master/docs/specification.md)
- [Core DNS for Kubernetes](https://www.coredns.io/plugins/kubernetes/)

