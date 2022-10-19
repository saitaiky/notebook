---
title: ClusterIP
sidebar_position: 1
---

## How to talk to services

### Approach 1: Pod to Pod

Create a pod to send curl requests in its bash to above 5 pods. Because the service name that we created becomes part of the DNS name, so we can connect it directly via `curl [Service Name]:8888` 

```bash
$ kubectl run tmp-shell --rm -it --image bretfisher/netshoot -- bash
bash-5.1# curl httpenv:8888
```

###  Approach 2: Node to Pod (Only work in Linux)

- Approach 2:`curl [ip of service]:8888` **Only work on Linux:** 
    - The way that Kubernetes works is that all nodes and containers, by default, can talk to each other out-of-the-box. The node that you're on, **assuming that you're running Kubernetes on that local machine**, has access to all of these private IP addresses. 
    - The reason that doesn't work from Docker Desktop is because you're sitting on **Mac or Windows** when you're typing those commands, and they are not on the same cluster of Kubernetes as that Linux VM running your Kubernetes for you.

```bash
$ kubectl get service
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
httpenv      ClusterIP   10.108.189.10   <none>        8888/TCP   35m
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP    2d18h

$ curl 10.96.0.1:8888
```

## Pod to Pod example
### Preparations

What's interesting here is that we are telling it to expose a deployment, but it's not really routing traffic to a deployment. A deployment is just a concept. It's an abstraction. It's the pods that need to receive traffic. 

So, really what's happening is in IP tables, on our nodes, we're creating rules via the `kube-proxy` agent. It's going to direct traffic by default to the pods in **a round robin rotating** on Port `8888` through different pod to get the containers.

It's using the deployment as a selector for deciding which pods need to be inside this service. 

```bash
# Create 5 pods to listen to requests.
# httpenv docker image: Tiny HTTP server showing the environment variables on TCP 8888
$ kubectl create deployment httpenv --image=bretfisher/httpenv
$ kubectl scale deployment/httpenv --replicas=5

# Create service 
$ kubectl expose deployment/httpenv --port 8888
```

### Access SH pod

When we create a service, **the control plane** set of set a bunch of commands down to the **kube-proxy**. The **kube-proxy** then added iptable rules to that **node** for the clusterIP. When we sent curl request from pod A to ser, technically went through kube-proxy, hit the clusterIP, and then round robin, one at a time, to each one of these pods on the backend.

The kube-proxy is acting like the load balancer. The single IP for the clusterIP is then essentially natting to backend pods. This is known as **a userspace proxy mode** for kube-proxy.

```bash
$ kubectl attach --namespace=shpod -ti shpod 

# Store pod IP as environment variable     
$ IP=$(kubectl get svc httpenv -o go-template --template '{{ .spec.clusterIP }}')

# Get the hostname of pods (round robin rotating)
$ curl -s http://$IP:8888/ | jq .HOSTNAME
"httpenv-787dd467b4-jlwfv"
[0.0.0.0] (shpod:default) k8s@shpod ~
$ curl -s http://$IP:8888/ | jq .HOSTNAME
"httpenv-787dd467b4-6jm2x"
[0.0.0.0] (shpod:default) k8s@shpod ~
$ curl -s http://$IP:8888/ | jq .HOSTNAME
"httpenv-787dd467b4-d924j"
```

## Headless service

- What exactly is a headless service?
    - Headless service is used for discovering individual pods(especially IPs) which allows another service to interact directly with the Pods instead of a proxy.
- What does it accomplish?
    - The requirement is not to make single IP like in the case of other service types. We need all the pod's IP sitting behind the service.
    - Each connection to the service is forwarded to one randomly selected backing pod. But what if the client needs to connect to all of those pods? What if the backing pods themselves need to each connect to all the other backing pods. 

> Reference: "Kubernetes in Action" by Marco Luksa

### How to create

Luckily, Kubernetes allows clients to discover pod IPs through DNS lookups. Usually, when you perform a DNS lookup for a service, the DNS server returns a single IP — the service’s cluster IP. But if you tell Kubernetes you don’t need a cluster IP for your service (you do this by setting the `clusterIP` field to `None` in the service YAML specification or `--cluster-ip=None`), the DNS server will return the pod IPs instead of the single service IP. 

Instead of returning a single DNS A record, the DNS server will return multiple `A` records for the service, each pointing to the IP of an individual pod backing the service at that moment. Clients can therefore do a simple DNS `A` record lookup and get the IPs of all the pods that are part of the service. The client can then use that information to connect to one, many, or all of them.

### Use cases

- Create Stateful service - e.g. Deploying RabbitMQ or Kafka (or any message broker service) to Kubernetes requires a stateful set for RabbitMQ cluster nodes.
- We want to decide how to balance the requests client-side
- This is common in large companies around the world where if you look up their A record for a particular DNS address like Google.com, you would get back multiple A addresses for that.