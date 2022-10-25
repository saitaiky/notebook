---
title: Basic
sidebar_position: 1
---

## What is orchestration

> TL;DR - Making many servers act like one

Some of the modern infrastructure tools like **Puppet** or **Terraform** as limited types of orchestrators because they're allowed to make decisions about where things go in infrastructure.

Container orchestration changed the game and brought a whole new set of tools because of two specific things, 

-  Distributed computing -  We are definitely in an age where breaking up your apps into small pieces and allowing a bigger team of people to go faster with their development. And then that's all broken up on various parts of different servers. That's what we call distributed computing today. That required us to come up with new ways to manage lots of machines.
- Docker
  - It allowed us to package up our apps and distribute them around different computers using common HTTP protocols.
  - Then it had a common runtime that allowed us to run many different copies of the same thing on a single OS, which means we could now put more work on a machine than we previously would have. 


### Major container orchestration projects

- Kubernetes, aka K8s
- Docker Swarm (and Swarm classic)
- Apache Mesos/Marathon
- Cloud Foundry
- Amazon ECS (not OSS, AWS-only)
- HashiCorp Nomad
- Many of these tools run on top of Docker Engine


## TODO

### 1. Understand that in the future
depending on your style of working, whether it's imperative or declarative, we'll get into that later, that that will indicate whether or not you need to use a certain command over

### 2. Two ways to deploy Pods (containers): Via commands, or via YAML

### 3. 
```
$ kubectl run (changing to be only for pod creation)
$ kubectl create (create some resources via CLI or YAML) 
$ kubectl apply (create/update anything via YAML)
```
:::info 1.18 Changes to `kubectl run`
`kubectl run nginx --image nginx` created a Deployment named nginx before 1.18 (which creates a ReplicaSet, which creates a Pod)

`kubectl run nginx --image nginx` creates a Pod named nginx in 1.18+
The future plan of `kubectl run` is to act more like a docker run command.

Creating a Deployment in 1.18: `kubectl create deployment nginx --image nginx`
:::
