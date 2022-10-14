---
title: Deployment
sidebar_position: 2
---
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

# You can also delete mutiple multiple objects at the same time. They don't have to be related objects.
$ kubectl delete service/httpenv service/httpenv-my-np service/httpenv-my-lb deployment/httpenv
```


:::info `kubectl run`
- In the future `kubectl` is a command like docker run for one-off tasks
- It's not recommended for production
- Use for **simple dev/test** or **troubleshooting pods**
:::
