---
title: command
---

Build a one-off pod that runs bash and remove it when we exit bash. 
`--` tells the run command to stop looking at options and that anything after that double dashes is the command to run when I execute this container. 

```
kubectl run tmp-shell --rm -it --image bretfisher/netshoot -- bash
```



The cool thing about Kubernetes is it comes unopinionated. it comes with a whole slew of options for how you might create and deploy containers.

The thing there is, though, how are you supposed to use it? What's the best way that I would recommend to use 
it? 




Generators you can think of like templates. They essentially create the spec to apply to the Kubernetes cluster based on your command line options.


You think of commands like `run`, and `expose`, and `create`. They often will have generators behind them that give the template necessary with all the fields while leaving some of **the more advanced settings up to defaults** that you're not necessarily specifying at the command line. 

These generators are different for each type of thing you're creating. Whether it's a service, or deployment, or a job, or a cron job. Those generators can actually change over time as each version of Kubernetes comes out.