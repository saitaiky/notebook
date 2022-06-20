---
title: Services
sidebar_position: 2
---

This section is to take your set of deployments, your pods, and creating a persistent endpoint that can talk to them. Then we will talk about how to expose them internally, in the cluster, or also externally to outside sources.

When you create pods in Kubernetes, they don't automatically get a DNS name for external connectivity with an IP address, tight. You would want to do that with creating a service on top of that existing pod.

kubectl expose creates a service for existing pods
- A service is a stable address for pod(s)
- CoreDNS service allows us to resolve services by name

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