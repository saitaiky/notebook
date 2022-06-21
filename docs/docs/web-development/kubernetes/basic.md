---
title: Basic
sidebar_position: 1
---

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

## Create deployment
```
$ kubectl create deployment my-nginx --image nginx
$ kubectl get pods

NAME                        READY   STATUS    RESTARTS   AGE
my-nginx-7cddc5685c-psdcd   1/1     Running   0          24s
```
:::info Why do we have that weird name - `my-nginx-7cddc5685c-psdcd` ?
This has to do with the way that the kubectl run command works. `kubectl run` uses deploument controller
- That **Deployment controller** creates a **ReplicaSet** controller.
- That **ReplicateSet** controller then creates the pods.
:::

We just did a single command `kubectl create deployment`, but it actually created multiple objects for us. In Kubernetes, we have more levels of abstraction and control than we did previously in Swarm or in Docker itself. 

When we typed`kubectl create deployment`:

1. it created a Deployment. 
    - A **Deployment controller** manages **ReplicaSet** configuration. 
    - It does things like rolling updates, or Blue/Green Deploys 
2. A Deployment was created, it will create a **ReplicaSet controller** of one. (That itself is another controller.) 
    - The **ReplicaSet controller** ensure the specified number of Pod “replicas” are running at any one time.
    -  If you created a **Replication Controller** for a Pod and specified **3 replicas**, it will create **3 Pods** and will continuously monitor them. If one Pod dies then the Replication Controller will replace it to maintain a total count of 3. 

![Kubernetes vs Docker Swarm - Overview Docker Swarm](/img/web-development/kubernetes/kubernetes_replication_controller.gif)
Source: [Learn the Kubernetes Key Concepts in 10 Minutes](https://omerio.com/2015/12/18/learn-the-kubernetes-key-concepts-in-10-minutes/)

```bash

# If you detele everything in the system, you will only see cluster IP there, which is the Kubernetes server itself.
$ kubectl get all 
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   35m

$ kubectl get pods
$ kubectl get pods --all-namespaces
$ kubectl get pods --show-labels

$ kubectl delete deployment my-nginx
```









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






## Inspection

### logs & Selector

Labels and Selectors
Labels are key/value pairs that are attached to objects, such as pods. Labels are intended to be used to specify identifying attributes of objects that are meaningful and relevant to users, but do not directly imply semantics to the core system. Labels can be used to organize and to select subsets of objects. Each object can have a set of key/value labels defined. Each Key must be unique for a given object.

```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

Example labels:
- `"release" : "stable"`, `"release" : "canary"`
- `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
- `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
- `"partition" : "customerA"`, `"partition" : "customerB"`
- `"track" : "daily"`, `"track" : "weekly"`

Show the logs combined for multiple pods based on a label that they all share.

By default, it can only pull up to **five pods** at a time when it uses the **selector type** of pulling in the logs. You can always increase that, but the reality is it's taxing on the system to pull from all the different nodes these log files. 

> In production, you're going to want a third-party logging system that would collect all these logs and store them over time for quicker retrieval. like [stern](https://github.com/wercker/stern) 

```bash
# -w like the watch command in linux, will let it sit there and refresh every few seconds.
$ kubectl get pods -w

$ kubectl get pods --show-labels   
NAME                         READY   STATUS    RESTARTS   AGE     LABELS
my-apache-6f45bc5bd9-68s5j   1/1     Running   0          7m38s   app=my-apache,pod-template-hash=6f45bc5bd9

# -l: lable
$ kubectl logs -l  app=my-apache
```



### describe

Print a detailed description of the selected resources, including related resources such as events or controllers. You may select a single object by name, all objects of that type, provide a name prefix, or label selector. For example: `kubectl describe TYPE/NAME_PREFIX`

`describe` also product the event status at the bottom of the log. This can be pretty handy for a quick troubleshooting technique **without having to go turn on some events or debugging logs**.

```bash
$ kubectl describe pod/my-apache-6f45bc5bd9-68s5j
```







