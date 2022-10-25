---
title: Services
---

## Problem statement

To start off with, when you've created these pods so far, there's nothing stopping the pods from talking to each other. But, what we really want is a stable DNS address for those pods that we need to talk to. 

Maybe you're having an API and you want to put a web interface in front of that that talks to the API, so it needs a reliable DNS name to find that API set of pods. It doesn't matter it's one pod, maybe it's five replicas of a pod.

## Solution
This section is to take your set of deployments, your pods, and creating a persistent endpoint that can talk to them. Then we will talk about how to expose them internally, in the cluster, or also externally to outside sources.

When you create pods in Kubernetes, they don't automatically get a DNS name for external connectivity with an IP address, tight. You would want to do that with creating a **service** on top of that existing pod.

`kubectl expose` creates a service for existing pods
- A **service** is a stable address for pod(s)
- CoreDNS service allows us to resolve **services** by name

### Kube-proxy

**The API**, of course, is providing the endpoint for us to configure this. Obviously, these rules are stored in etcd, but it's `kube-proxy` out-of-the-box that's going to control this using largely **IP tables**, which is a Linux subsystem that is a part of the kernel for controlling routing of packets and firewall stuff.

The vast majority of us nowadays can largely ignore IP tables, especially in containers, because that's what Docker and Kubernetes are designed to do. They're allowing those of us that just need to use this to deploy apps to not have to be experts in the underlying technology in the kernel on how packets move around. 

### Advantages of services
-   We resolve the IP address of the service using DNS
-   There are multiple service types; some of them allow external traffic (e.g. `LoadBalancer` and `NodePort`)
-   Services provide load balancing (for both internal and external traffic)
-   Service addresses are independent from pods' addresses (when a pod fails, the service seamlessly sends traffic to its replacement)

### Services are OSI layer 4 constructs 

> What does that mean? That means that we can't just give a full IP address with everything complete access. 

- You can assign IP addresses to services, but they are still layer 4(i.e. a service is not an IP address; it's an IP address + TCP/UDP protocol + port). 
- This is caused by the current implementation of `kube-proxy`(it relies on mechanisms that don't support layer 3). 
- As a result: you have to indicate the port number for your service(with some exceptions, like ExternalName or headless services, covered later)


## Different type of servies

There are four types of Kubernetes services — `ClusterIP`, `NodePort`, `LoadBalancer` and `ExternalName`. The type property in the Service's spec determines how the service is exposed to the network.

:::info`kube-proxy` behind the sene
Under the hood, a lot of this is controlled by kube-proxy. The API, of course, is providing the endpoint for us to configure this. Obviously, these rules are stored in etcd, but it's kube-proxy out-of-the-box that's going to control this using largely IP tables, which is a Linux subsystem that is a part of the kernel for controlling routing of packets and firewall stuff.

The vast majority of us nowadays can largely ignore IP tables, especially in containers, because that's what Docker and Kubernetes are designed to do. They're allowing those of us that just need to use this to deploy apps to not have to be experts in the underlying technology in the kernel on how packets move around.
:::

:::infoRelationship between LoadBalancer, NodePort and ClusterIP

These three service types are additive, each one creates the ones above it: 
- ClusterIP
- NodePort (include ClusterIP) -  When creating a NodePort Service, A ClusterIP Service is automatically created
- LoadBalancer (include ClusterIP + NodePort) - When creating an external load balancer, NodePort and ClusterIP Service are automatically created.

**Logic flow**: The load balancer is accepting my packet, then passing it to the NodePort, and then the NodePort is passing it to the cluster IP. There's always going to be that
:::

### ClusterIP (Default)

![ClusterIP](/img/container-orchestration/kubernetes/clusterIP.webp)

Source: [Kubernetes – Service Publishing](https://theithollow.com/2019/02/05/kubernetes-service-publishing/)

- ClusterIP is the default when using `expose` if you don't specify a type of service. It provides a single, **cluster-internal** virtual IP address.
- Our code can connect to the service using the **original port number** e.g. Port 80 for web (Perfect for internal communication, within the cluster)
- **Downside**:  It's only reachable from **within cluster** (nodes and pods)

:::info Use Case
Inter service communication within the cluster. For example, communication between the front-end and back-end components of your app.
:::

:::cautionAccess ClusterIP service in the cluster
To access a service with only clusterIP enable, you need to access the service in a pod with the same cluster.
:::

### NodePort

![Node Port](/img/container-orchestration/kubernetes/nodePort.webp)

Source: [Kubernetes – Service Publishing](https://theithollow.com/2019/02/05/kubernetes-service-publishing/)
> If we access the IP Address of one of our nodes (`10.10.50.51:30001`or`10.10.50.52:30001`) with the port we specified, we can see our nginx page.

- It is designed for **something outside the cluster to talk to your service** through the IP addresses on the nodes with high port allocated on each node (Port range: 30000-32767)
    - By requesting `<NodeIP>:<NodePort>` to access from outside the cluster
- That port is made available *on all our nodes* and anybody can connect to it (we can connect to any node on that port to reach the service)
- **Downside**: Our code needs to be changed to connect to that new port number

:::info Use Cases
- When you want to enable external connectivity to your service.
- Using a NodePort gives you the freedom to set up your own load balancing solution, to configure environments that are not fully supported by Kubernetes, or even to expose one or more nodes’ IPs directly.
- Prefer to place a load balancer above your nodes to avoid node failure.
:::

:::cautionA multi-node cluster
In a single-node cluster this is very straight forward. In a multi-node cluster the internal routing can get more complicated. In that case you might want to introduce **an external load balancer** so you can spread traffic out across all the nodes and be able to handle failures a bit easier.
:::

:::cautionAccess via localhost / IP address
- If you're on **Docker Desktop**, you can use **localhost** to access the cluster.
- If you're using something like **Minikube**, which won't support the localhost name, then you'll have to just get the **IP address** of your Kubernetes machine.
:::

### LoadBalancer (Mostly used in cloud)

- It exposes the Service externally using **a cloud provider’s load balancer** to access the cluster only if the underlying infrastructure provides some kind of "load balancer as a service" (e.g. ELB on AWS, GLB on GCE ...)
- The actual creation of the load balancer happens asynchronously.
- Each cloud provider (AWS, Azure, GCP, etc) has its own native load balancer implementation. The cloud provider will create a load balancer, which then automatically routes requests to your Kubernetes Service.

:::info Use Case
When you are using a cloud provider to host your Kubernetes cluster.
:::

### ExternalName (Rarely use)

> TL-DR; - You can use that ExternalName service (as a local service) when Pods from one namespace to talk to a service in another namespace.

It's usually for when the name remotely might change outside of your cluster, but you don't want to have to redeploy your services just because that external service might change. So, you create this special DNS entry(**ExternalName**) inside your Kubernetes cluster, and then you can change that on the fly. Kind of like a **CNAME**. It won't require you to re-provision your deployments and your container pods just because some name on the internet changed.

- Not related inbound traffic but stuff in your cluster needing to **talk to outside services**.
- Adds CNAME DNS record to CoreDNS only
- Not used for Pods, but for giving pods a DNS name to use for something outside Kubernetes

:::info Use Cases
- Case 1: example of using external name is doing migration. Migrating service from outside of K8s cluster that you can't control the DNS remotely to internal K8s cluster. you could use ExternalName as a substitute to control the DNS inside your Kubernetes workflow.

- Case 2: It is commonly used to create a service within Kubernetes to represent **an external datastore** like a database that runs externally to Kubernetes.
:::

### Ingress

Kubernetes Ingress (Final way to that traffic can get inside your cluster. Sai: take later)

You can also use Ingress to expose your Service. Ingress is not a Service type, but it acts as the entry point for your cluster. It lets you consolidate your routing rules into a single resource as it can expose multiple services under the same IP address.

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

DNS is **optional as a service**, or an add on, inside your Kubernetes cluster. But, everyone puts one in there. Starting with 1.11, internal DNS is provided by [CoreDNS](https://coredns.io/). When you create a service, you get the hostname that matches the service. But, that hostname is part of a larger name, the **FQDN (fully qualified domain name)**. We didn't get that in Docker or Swarm.

:::danger
You **can't** technically create the same pod, or the same service, or the same Deployment, with the same names, **in the same namespace**.
:::

### How Services calls DNS name?

How does each service find out the address of the other ones?
-   We do not hard-code IP addresses in the code
-   We do not hard-code FQDNs in the code, either
-   We just connect to a service name, and container-magic does the rest
    (And by container-magic, we mean "a crafty, dynamic, embedded DNS server")

You might wonder in Kubernetes how these things are communicating with each other. 

When you were in Docker containers back with Docker networks, we had not necessarily service names, but they were container names on bridge networks.

Then if you use Docker Compose or Swarm, those were services. They all operated on the names of the services, similar to the name of the container in regular old Docker run.

In Kubernetes, we have services that again, present us with nice, friendly DNS hostnames. Those are stored in **CoreDNS** and it's delivering up the results like a DNS server should.

### Service in different namespace

We can use hostname to access Services but this only works for Services in the same Namespace. e.g. `curl <hostname>`

If we have different name space, we can use the **FQDN**. e.g. `curl <hostname>.<namespace>.svc.cluster.local`
- svc: service
- cluster.local: default service DNS name given to your cluster when you create it or spin it up.

### Namespace in K8s

Namespaces in K8s is really just an organizational parameter, and it doesn't, out-of-the-box, control networking segmentation or anything like that. Usually, what you're going to be dealing with is the **default namespace**. 

As you get larger, you will possibly make **multiple namespaces** for different applications that possibly had the same name. Or maybe you want to deploy the same thing multiple times, with the same service names, pod names, deployment names, and you wouldn't want them to clash, so you would create different namespaces for those.

## Endpoints

![ClusterIP](/img/container-orchestration/kubernetes/architecture/endpoints.png)

Source: [Services and Endpoints](https://storage.googleapis.com/static.ianlewis.org/prod/img/753/endpoints.png)

Pods expose themselves through endpoints to a service. The list of pods is the same as the list of endpoints. 

```bash
# In below case, we have 3 endpoints which means 3 pods behind the httpenv service
$ kubectl get endpoints httpenv -o wide
NAME      ENDPOINTS                                      AGE
httpenv   10.1.0.45:8888,10.1.0.46:8888,10.1.0.47:8888   116m
```


## Further reading 

- [Kubernetes Documentation - Service](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Kubernetes DNS-Based Service Discovery](https://github.com/kubernetes/dns/blob/master/docs/specification.md)
- [Core DNS for Kubernetes](https://www.coredns.io/plugins/kubernetes/)

