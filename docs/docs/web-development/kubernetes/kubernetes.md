---
title: Kubernetes
--- 
## Overview

> TL;DR - Kubernetes is a tool to deploy application in the form of containers on a set of machines that are configured as worker nodes in a cluster.

So, lots of people think Kubernetes is the next orchestrator people should learn after Swarm (Including me). This article will show you what K8s is and try to compare K8s to Swarm side by side.

Kubernetes essentially is **a set of APIs** that run on apps in containers to manage a set of servers and then execute your containers **on Docker, by default**. It can run other container runtimes that aren't **Docker**, like **containerd**.

- Container Orchestration = Make many servers act like one
- Released by Google in 2014, maintained by large community
- Provides API/CLI to manage containers across servers
    - It gives you a set of those APIs/CLI tools to deploy and maintain the same server infrastructure that you would have similar to Swarm.
    - Kube control is the tool that you use like Docker command when using Docker. Kube control is the official name of Kubernetes tool. (You may heard other unofficial names like kube cuddle, or koob control)
- Many clouds provide it for you
- Many vendors make a "distribution" of it
    - Similar to the concept of Linux distributions. In the Linux world, there's the same Linux kernel running on all these different distributions, whether it's Ubuntu, or CentOS, or Amazon Linux. All these different distributions package up their own set of tools that a lot of us prefer one or the other. That's the same way with Kubernetes now.
    - All of those are providing a upstream version of the pure, open source Kubernetes. Then they layer on top of it all their own extra stuff to your benefit.
- Provide a set of those APIs and command line tools to deploy and maintain the same server infrastructure
## Not every solution needs orchestration 

Orchestration is definitely increasing in popularity, but it's not the only way to run containers. We have lots of options:
- `docker runs`
- `docker compose`
- There're also other platform offerings and services. You can run containers on single nodes in AWS without orchestration. By using the features of that platform to create a similar like abstraction as orchestration, where they maybe use **auto scaling groups**, **Elastic Load Balancing**, and a lot of other things that we've all used for over a decade to manage our application deployments. They have such a refined system that they just don't see a lot of benefits out of completely changing all that to orchestration.
## Do we need orchestration?

One of the simple formulas I use for whether or not to use orchestration, is 

>  Servers + Change Rate = Benefit of orchestration

- Servers: The number of servers that I'm going to need for particular environment
- Change Rate: The change rate of my applications, or the environment itself
- When you're starting out, you may only need a single server, or just a few servers
- if you're not changing your applications very often (e.g. you're only changing them once a month or less), then orchestration, and the effort involved in deploying it, managing it, securing it, may be unnecessary at your state.   Especially if you're a **solo developer or just a very small team**.

That's where things like Elastic Beanstalk, or Heroku, the application deployment platform, that's where a lot of those start to shine as alternatives to doing your own orchestration. 
### Options to do orchestration

- Swarm
- Kubernetes
- ECS on AWS (Cloud) 
- Foundry, or Mesos and Marathon (Cloud)

If you want to go for **multicloud**, then you may not want to use Cloud specific offerings like ECS So, that was sort of a legacy solution that Amazon still supports and it's still a neat option, but only if you're specific to AWS and that's the only place you ever plan to deploy containers. 

In real world senario, it is usally something like - I need something that's hybrid. Meaning that I can run it in my data center or in multicloud. It can't just run in one location only. That comes down to usually **Swarm** or **Kubernetes** because those're two solutions that are the most popular container orchestrators. They run on every cloud, and in data centers, and even small environments possibly like IoT.

## K8s distribution

Kubernetes is an open source platform. You might think, then, that it's a vendor-agnostic platform, meaning that you can easily move from one Kubernetes implementation to another. The ideal case is that you can take your workloads and your YAML files that design your infrastructure, and you can move those from one Kubernetes vendor to another and they should work out-of-the-box for most things. 

But you'd be wrong. The reality is that many Kubernetes solutions – in particular, those that are tied to a specific public cloud – are much less vendor-agnostic than you might think.

Fortunately, this doesn't mean that you can't take advantage of the public cloud as a Kubernetes hosting solution if you want to avoid lock-in. You can, but you have to design your Kubernetes strategy in a way that frees you from being locked into a particular cloud provider's Kubernetes service while still enabling you to enjoy the advantages of cloud-based Kubernetes.
### Vendor product

When you get a vendor solution,they will provide custom features like authentication solutions, web administration and networking etc. Here are the list of the popular kubernetes distributions. You may check the full list on this [page](https://kubernetes.io/partners/#conformance)

- Rancher
- Red Hat OpenShift
- Mirantis
- VMWare Tanzu
- Docker Kubernetes Service (DKS)
- Amazon Elastic Kubernetes Service (EKS)
- Elastisys Compliant Kubernetes

:::caution
Use raw GitHub upstream version of Kubernetes only for **learning how K8s works**.  Because one of the things about Kubernetes that's  different from Swarm is that it needs a lot of things added to it to really make it easy to use out-of-the-box. 
:::


## Swarm vs K8s 

They're both container orchestrators that run on top of a container runtime ([check this for more explanation about container runtime](http://localhost:3000/web-development/docker/intro/why-docker/)).


- Swarm: Easier to deploy/manage
- Kubernetes: More features and flexibility



### Advantages of Swarm

- Comes with Docker, single vendor container platform. Which means that the container runtime, and the orchestrator, are built by the same company.
- Easiest orchestrator to deploy/manage yourself
- 80/20 rule - It has 20% of the features of Kubernetes, and that solves 80% of the use cases for running containers and orchestration. (the number is just a feeling, not a scientific comparison)
- Runs anywhere Docker does:
    - local, cloud, datacenter
    - ARM (which means Embedded, IoT, Raspberry Pi), Windows, 32-bit
- Secure by default
    -  it ensures mutual TLS authentication. It encrypts the control plane and it encrypts the database to protect your secrets 
- Easier to troubleshoot by using same Docker's deamon logs, same Docker's log command

In general, Swarm is the tool that I recommend when people start out and they're starting small. Maybe they're a single person, or just one, two, or three people in their team, and they need to see if a small, simple orchestrator is going to work for them. I always recommend Swarm first, unless you know absolutely you have to use Kubernetes. Once you think you've hit some limits in Swarm and you think that you can't quite get what you need out of it, that's when it's time to look at Kubernetes.
### Advantages of K8s

- Clouds will deploy/manage Kubernetes for you, you just need to run your apps on there using Kubernetes deployment files
- Infrastructure vendors are making their own distributions
- "Kubernetes first" vendor support -  For example, with **Jenkins**,from the company CloudBees. They give you Kubernetes tooling and samples on how to run it if you buy their enterprise solution, though it doesn't mean you can't run **Jenkins** on Swarm.
- "No one ever got fired for buying IBM" (A terms that we use to describe the era when people couldn't decide on which vender to work with, they choose IBM)
- Picking solutions isn't 100% rational
- Trendy, will benefit your career
- CIO/CTO Checkboxs







