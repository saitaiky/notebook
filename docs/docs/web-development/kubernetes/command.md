---
title: command
---

Build a one-off pod that runs bash and remove it when we exit bash. 
`--` tells the run command to stop looking at options and that anything after that double dashes is the command to run when I execute this container. 

```
kubectl run tmp-shell --rm -it --image bretfisher/netshoot -- bash
```