---
title: Cmmands
sidebar_position: 5
---

Build a one-off pod that runs bash and remove it when we exit bash. 
`--` tells the run command to stop looking at options and that anything after that double dashes is the command to run when I execute this container. 

```
kubectl run tmp-shell --rm -it --image bretfisher/netshoot -- bash
```

The cool thing about Kubernetes is it comes **unopinionated**. it comes with a whole slew of options for how you might create and deploy containers. The thing there is, though, how are you supposed to use it? What's the best way that I would recommend to use 
it? 
