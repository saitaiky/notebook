---
title: Overview
sidebar_position: 1
---

## Why Orchestration?

Orchestration is probably best described using an example. Let’s say that you have an application that has high traffic along with high-availability requirements. Due to these requirements, you typically want to deploy across at least 3+ machines, so that in the event a host fails, your application will still be accessible from at least two others. Obviously, this is just an example and your use-case will likely have its own requirements, but you get the idea.

Deploying your application without Orchestration is typically very time consuming and error prone, because you would have to manually SSH into each machine, start up your application, and then continually keep tabs on things to make sure it is running as you expect.

But, with Orchestration tooling, you can typically off-load much of this manual work and let automation do the heavy lifting. One cool feature of Orchestration with Docker Swarm, is that you can deploy an application across many hosts with only a single command (once Swarm mode is enabled). Plus, if one of the supporting nodes dies in your Docker Swarm, other nodes will automatically pick up load, and your application will continue to hum along as usual.

### Not every solution needs orchestration 

Orchestration is definitely increasing in popularity, but it's not the only way to run containers. We have lots of options:
- `docker runs`
- `docker compose`
- There're also other platform offerings and services. You can run containers on single nodes in AWS without orchestration. By using the features of that platform to create a similar like abstraction as orchestration, where they maybe use **auto scaling groups**, **Elastic Load Balancing**, and a lot of other things that we've all used for over a decade to manage our application deployments. They have such a refined system that they just don't see a lot of benefits out of completely changing all that to orchestration.
### Do we need orchestration?

One of the simple formulas I use for whether or not to use orchestration, is 

>  Servers + Change Rate = Benefit of orchestration

- Servers: The number of servers that I'm going to need for particular environment
- Change Rate: The change rate of my applications, or the environment itself
- When you're starting out, you may only need a single server, or just a few servers
- if you're not changing your applications very often (e.g. you're only changing them once a month or less), then orchestration, and the effort involved in deploying it, managing it, securing it, may be unnecessary at your state.   Especially if you're a **solo developer or just a very small team**.

That's where things like Elastic Beanstalk, or Heroku, the application deployment platform, that's where a lot of those start to shine as alternatives to doing your own orchestration. 

## What is Orchestration 

> TL;DR - Orchestration makes many servers act like one. It's designed to automate change and monitor the state of things and ensure everything is the state you expect it to be. (eg; health state)

Some of the modern infrastructure tools like **Puppet** or **Terraform** as limited types of orchestrators because they're allowed to make decisions about where things go in infrastructure.

Container orchestration changed the game and brought a whole new set of tools because of two specific things, 

-  Distributed computing -  We are definitely in an age where breaking up your apps into small pieces and allowing a bigger team of people to go faster with their development. And then that's all broken up on various parts of different servers. That's what we call distributed computing today. That required us to come up with new ways to manage lots of machines.
- Docker
  - It allowed us to package up our apps and distribute them around different computers using common HTTP protocols.
  - Then it had a common runtime that allowed us to run many different copies of the same thing on a single OS, which means we could now put more work on a machine than we previously would have. 

## Major container orchestration projects

- Kubernetes, aka K8s
- Docker Swarm (and Swarm classic)
- Apache Mesos/Marathon
- Cloud Foundry
- Amazon ECS (not OSS, AWS-only)
- HashiCorp Nomad
- Many of these tools run on top of Docker Engine

If you want to go for **multicloud**, then you may not want to use Cloud specific offerings like ECS So, that was sort of a legacy solution that Amazon still supports and it's still a neat option, but only if you're specific to AWS and that's the only place you ever plan to deploy containers. 

In real world senario, it is usally something like - I need something that's hybrid. Meaning that I can run it in my data center or in multicloud. It can't just run in one location only. That comes down to usually **Swarm** or **Kubernetes** because those're two solutions that are the most popular container orchestrators. They run on every cloud, and in data centers, and even small environments possibly like IoT.