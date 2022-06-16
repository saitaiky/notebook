---
title: Kubernetes
--- 

It's the next orchestrator I think you should learn after Swarm. 

If you wonder what Kubernetes is doing, or how it's related to Docker, Kubernetes essentially is **a set of APIs** that run on apps in containers to manage a set of servers and then execute your containers **on Docker, by default**. It can run other container runtimes that aren't **Docker**, like **containerd**.


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






