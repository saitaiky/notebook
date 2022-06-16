---
title: Why Kubernetes?
---


What is Orchestration
Orchestration is designed to automate change and monitor the state of things and ensure everything is the state you expect it to be. (eg; health state)





Not every solution needs orchestration 

Orchestration is definitely increasing in popularity, but it's not the only way to run containers. 
- We've talked about using `Docker runs` here.
- We've talked about `docker compose`. 
- We've talked about other platform offerings and services. You can run containers on single nodes in AWS without orchestration. By using the features of that platform to create a similar like abstraction as orchestration, where they maybe use **auto scaling groups**, **Elastic Load Balancing**, and a lot of other things that we've all used for over a decade to manage our application deployments. They have such a refined system that they just don't see a lot of benefits out of completely changing all that to orchestration.


## Formula to decide should we use orchestration

> Servers + Change Rate = Benefit of orchestration

One of the simple formulas I use for whether or not to use orchestration, are 
- Servers: The number of servers that I'm going to need for particular environment
- Change Rate: The change rate of my applications, or the environment itself

- When you're starting out, you may only need a single server, or just a few servers
- if you're not changing your applications very often (eg: you're only changing them once a month or less), then orchestration, and the effort involved in deploying it, managing it, securing it, may be unnecessary at your state.   Especially if you're a **solo developer or just a very small team**.


That's where things like Elastic Beanstalk, or

Heroku, the application deployment platform, that's where

a lot of those start to shine as alternatives

to doing your own orchestration.



### Options to do orchestration

- Swarm
- Kubernetes
- ECS on AWS (Cloud) 
- Foundry, or Mesos and Marathon (Cloud)

if you want to go for **multicloud**, then you may not want to use Cloud specific offerings like ECS So, that was sort of a legacy solution that Amazon still supports and it's still a neat option, but only if you're specific to AWS and that's the only place you ever plan to deploy containers. 

In real world senario, it is usally something like - I need something that's hybrid. Meaning that I can run it in my data center or in multicloud. It can't just run in one location only. That comes down to usually **Swarm** or **Kubernetes** because those're two solutions that are the most popular container orchestrators. They run on every cloud, and in data centers, and even small environments possibly like IoT.

### Which distribution to use?

vendor product
The ideal case is that you can take your workloads and your YAML files that design your infrastructure, and you can move those from one Kubernetes vendor to another and they should work out-of-the-box for most things. 

Wen you get a vendor solution,they will provide custom features like authentication solutions, Web administration, and  networking. Just to name a few.





Use raw GitHub upstream version of Kubernetes only for learning how K8s works

Because one of the things about Kubernetes that's a little different from Swarm is that it needs a lot of things added to it to really make it easy to use out-of-the-box. 

https://kubernetes.io/partners/#conformance



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










