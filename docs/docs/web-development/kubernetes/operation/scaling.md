
## Scaling Pods

When we typed the scale command, we were technically updating the Deployment spec. In Kubernetes, everything has a spec. 
- This spec for the Deployment changed the ReplicaSet to a set of two replicas. 
- Then that ReplicaSet controller decided to change it to two pods, and there would be one pod for each replica. 
- Then the control plane makes a decision about which nodes, in this case you've only got one node, but which nodes would get assigned those pods. 
- Then if you had a multi-node setup, the kubelet agent would then get assigned that pod and would take that for execution to create the container on his local Docker Engine. 


The below 2 commands are the same. Over the years, this has changed. So, **it's not so obvious which parts you can abbreviate or put in a slash for a space**. But, I think once you get used to your own way of doing things, that'll just work for you.
> Those are the same command: deploy = deployment = deployments

```
$ kubectl scale deploy/my-apache --replicas 2
$ kubectl scale deployment my-apache --replicas 2
```




`--follow`: wait for anything new to show up in the logs of that pod
`--tail, 1`: just means return the last line only.
```
$ kubectl logs deployment/my-apache --follow --tail 1
```
