---
title: Workload resources
sidebar_position: 2
---

## Deployment, ReplicaSet, Pod

![Comsponents of K8s](/img/web-development/kubernetes/ops/deployment-replicas-pod.jpeg)

Source: [Manning - 6 Scaling applications across multiple Pods with controllers](https://livebook.manning.com/book/learn-kubernetes-in-a-month-of-lunches/chapter-6/7)

When doing a deployment, we need to use deployment, replicas and pod. All three of these resources are really abstractions. They're layers of different functionality split up for different purposes and to allow us to have more flexibility in how we use Kubernetes.

This seems like a lot of extra stuff in the way of just creating a container. Again, Kubernetes is designed for you to create **real production systems**. It's not really designed for simplistic, single container docker runs like stuff. We already have Docker to do that. Kubernetes wasn't there to solve that problem because it had already been solved. It's trying to solve more complex problems.


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

### Steps 

When we typed`kubectl create deployment`:

1. it created a Deployment. 
    - A **Deployment controller** manages **ReplicaSet** configuration. 
    - It does things like rolling updates, or Blue/Green Deploys 
2. A Deployment was created, it will create a **ReplicaSet controller** of one. (That itself is another controller.) 
    - The **ReplicaSet controller** ensure the specified number of Pod “replicas” are running at any one time.
    -  If you created a **Replication Controller** for a Pod and specified **3 replicas**, it will create **3 Pods** and will continuously monitor them. If one Pod dies then the Replication Controller will replace it to maintain a total count of 3. 

![Kubernetes vs Docker Swarm - Overview Docker Swarm](/img/web-development/kubernetes/kubernetes_replication_controller.gif)
Source: [Learn the Kubernetes Key Concepts in 10 Minutes](https://omerio.com/2015/12/18/learn-the-kubernetes-key-concepts-in-10-minutes/)

### Commands 

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

## CronJob

You can use a [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) to run [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/) on a time-based schedule. These automated jobs run like [Cron](https://en.wikipedia.org/wiki/Cron) tasks on a Linux or UNIX system.

Cron jobs are useful for creating periodic and recurring tasks, like running backups or sending emails. Cron jobs can also schedule individual tasks for a specific time, such as if you want to schedule a job for a low activity period.

Cron jobs have limitations and idiosyncrasies. For example, in certain circumstances, a single cron job can create multiple jobs. Therefore, jobs should be idempotent.

For more limitations, see [CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs).

### Command

Cron jobs require a config file. Here is a manifest for a CronJob that runs a simple demonstration task every minute:
```
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "* * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox:1.28
            imagePullPolicy: IfNotPresent
            command:
            - /bin/sh
            - -c
            - date; echo Hello from the Kubernetes cluster
          restartPolicy: OnFailure

```


Run the example CronJob by using this command:
```kubectl create -f https://k8s.io/examples/application/job/cronjob.yaml```