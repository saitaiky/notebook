---
title: Commands
sidebar_position: 5
---


## One off Pod

Build a one-off pod that runs bash and remove it when we exit bash. 
`--` tells the run command to stop looking at options and that anything after that double dashes is the command to run when I execute this container. 

```
kubectl run tmp-shell --rm -it --image bretfisher/netshoot -- bash
```

The cool thing about Kubernetes is it comes **unopinionated**. it comes with a whole slew of options for how you might create and deploy containers. The thing there is, though, how are you supposed to use it? What's the best way that I would recommend to use 
it? 


## helm

### Handle UPGRADE FAILED

To fix the error `Kubernetes Helm Error: UPGRADE FAILED: another operation (install/upgrade/rollback) is in progress.`, you will need to roll back the deployment. This error is caused by a helm deployment that never completes successfully. It most commonly occurs when there is an interruption during the upgrade/install process. 

To fix this one may need to, first rollback to another version, then reinstall or helm upgrade again.

```
helm ls --namespace <namespace>

# Check the history of the previous deployment to see  if there are any deployment stuck:
helm history <release> --namespace <namespace>

# To escape from this state, use the rollback command:
helm rollback <release> <revision> --namespace <namespace>
```