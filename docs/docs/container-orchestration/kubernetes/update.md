---
title: Update 
---


After you have install and run your first application. You will need to prepare for the Day-2 operations include triage, ongoing maintenance of deployed assets, rolling out upgrades, and troubleshooting.

Day-2 has been very hard to do. It's the worst part of the job because we're always dealing with limiting tools that don't do declarative deployments and don't have rolling updates built in. 

:::infoHistory of Day-2 operations
Amazon was one of the first companies to really get Day-2 Operations right with their auto scaling groups, but I'm not going to talk about our history.
:::

Deployment strategies in K8s are important, if we donn't have this feature, we would just be taking down images and taking down our applications every time we did updates. **This is a key features of any orchestrator**.


## Update Deployment Strategies
Kubernetes offers Deployment strategies that allow you to update in a variety of ways depending on the needs of the system. The three most common are:

- **Rolling update strategy**
    - When: Minimizes downtime at the cost of update speed
    - What: The default deployment strategy in Kubernetes
    - How: To perform a rolling update, simply update the image of your pods using kubectl set image. This will automatically trigger a rolling update. A rolling update replaces the existing version of pods with a new version, updating pods slowly one by one, without cluster downtime. 
        - **MaxSurge** specifies the maximum number of pods the Deployment is allowed to create at one time. You can specify this as a whole number (e.g. 5), or as a percentage of the total required number of pods 
            - Rounded up: if we have 10pods with 25% MaxSurge, K8s will **rounded up** to the next whole number which is 3pods). 
            - If you do not set MaxSurge, the implicit, default value is 25%.
        - **MaxUnavailable** specifies the maximum number of pods that are allowed to be unavailable during the rollout. 
            - Rounded down: if we have 10pods with 25% MaxSurge, K8s will **rounded down** to the next whole number which is 2pods). 
            - Like MaxSurge, you can define it as an absolute number or a percentage. 
- **Recreation Strategy**: Causes downtime but updates quickly.
- **Canary Strategy**: Quickly updates for a select few users with a full rollout later.
- **[Ramped slow rollout](https://spot.io/resources/kubernetes-autoscaling/5-kubernetes-deployment-strategies-roll-out-like-the-pros/#a3)**: rolls out replicas of the new version, while in parallel, shutting down old replicas. 
- **[Best-effort controlled rollout](https://spot.io/resources/kubernetes-autoscaling/5-kubernetes-deployment-strategies-roll-out-like-the-pros/#a4s)**: pecifies a "max unavailable" parameter which indicates what percentage of existing pods can be unavailable during the upgrade, enabling the rollout to happen much more quickly.
- **[Canary deployment](https://spot.io/resources/kubernetes-autoscaling/5-kubernetes-deployment-strategies-roll-out-like-the-pros/#a5)**: uses a progressive delivery approach, with one version of the application serving most users, and another, newer version serving a small pool of test users. The test deployment is rolled out to more users if it is successful.

## Rolling Deployment 

With rolling updates, when a Deployment is updated, it happens progressively. The Deployment controls multiple ReplicaSets. Each ReplicaSet is a group of identical Pods (with the same image, arguments, parameters ...). During the rolling update, we have at least two ReplicaSets:
- the "new" set (corresponding to the "target" version)
- at least one "old" set

Example of checking the existing deployment specification.
```bash
$ kubectl get deploy -o json | jq ".items[] | {name:.metadata.name} + .spec.strategy.rollingUpdate"

{
  "name": "httpenv",
  "maxSurge": "25%",
  "maxUnavailable": "25%"
}
{
  "name": "redis",
  "maxSurge": "25%",
  "maxUnavailable": "25%"
}
```

Let's try to update a docker image with a non-existed release tag. 
```bash
# The --record flag adds an annotation to the YAML resource, which can be changed at any time
# This flag will add this command to the deploy annotation, then you can check in the Change-Cause column
# Check `kubectl rollout history deployment worker` command below!
$ kubectl set image deploy worker worker=dockercoins/worker:v0.3 --record

# To see the Deployment rollout status, run
$ kubectl rollout status deploy worker
error: deployment "worker" exceeded its progress deadline

# It will fails to recreate pods but the pods failed to pull image
$ kubectl describe deploy worker
Name:                   worker
Namespace:              default
CreationTimestamp:      Thu, 27 Oct 2022 15:51:08 +0100
Labels:                 app=worker
Annotations:            deployment.kubernetes.io/revision: 2
Selector:               app=worker
Replicas:               10 desired | 5 updated | 13 total | 8 available | 5 unavailable
```

## Rollback

### Undo

> **Undo can't be used more than once** which is fine because we usually only need to rollback once when we find something's not working properly. There is no stack of history to undo, instead, it's simply undoing to the last one before that.

```bash
$ kubectl rollout undo deploy worker
deployment.apps/worker rolled back


$ kubectl rollout status deploy worker
Waiting for deployment "worker" rollout to finish: 8 of 10 updated replicas are available...
Waiting for deployment "worker" rollout to finish: 9 of 10 updated replicas are available...
deployment "worker" successfully rolled out
```

Kubernetes gave a signal to these pods(Python/Node.js apps) to say, `hey, please, could you shut down?` And they're not shutting down right away. Then, Kubernetes is just waits for 30 seconds, if the pods don't exit properly, it will send a kill signal and terminate them. 

By default, a 30-second grace period for apps to shut down. You can change that,  if you have apps that need to do a long shutdown process, like web servers that need to wait for TCP connections to finish. Because you maybe have long polling or web sockets. Well, you can totally handle all that with the wait.


### Revert to an older version

```bash
# kubectl rollout undo can work with a revision number
$ kubectl rollout undo deployment worker --to-revision=1
```
## Listing rollout versions

- Kubernetes stores the revision in the ReplicaSet.metatada.annotation.
- By default Kubernetes stores the last 10 ReplicaSets and lets you roll back to any of them. But you can change how many ReplicaSets should be retained by changing the spec.revisionHistoryLimit in your Deployment

### Check via deployment

Kubernetes maintains a history (the length of which can also be controlled) for rollouts. You can see the state of a rollout, as well as its history, through the `kubectl rollout` command.

```bash
# Revision 1 is the version that you defined when you created a manifest .metadata.annotations.deployment.kubernetes.io/revision
# Revision 5 is the previous replicaSet(worker-57df9f98d8) which previous successful deployment (8 pods)
# Revision 6 is the latest replicaSet(worker-56bb54db98) which failed due to the non-existed docker image release (5 pods)
$ kubectl rollout history deployment worker
deployment.apps/worker 
REVISION  CHANGE-CAUSE
1         <none>
5         <none>
6         kubectl set image deploy worker worker=dockercoins/worker:v0.3 --record=true
```


```bash
# A deployment's revision history is stored in the replica sets it controls. 
$ kubectl describe replicasets -l app=worker | grep -A3 Annotations 
Annotations:    deployment.kubernetes.io/desired-replicas: 10
                deployment.kubernetes.io/max-replicas: 13
                deployment.kubernetes.io/revision: 6
                deployment.kubernetes.io/revision-history: 2,4
--
Annotations:    deployment.kubernetes.io/desired-replicas: 10
                deployment.kubernetes.io/max-replicas: 13
                deployment.kubernetes.io/revision: 5
                deployment.kubernetes.io/revision-history: 1,3
```



### Check via a pod


Previous replicaSet  - revision 5

```bash
kubectl get replicaset worker-57df9f98d8 -o yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  annotations:
    deployment.kubernetes.io/desired-replicas: "10"
    deployment.kubernetes.io/max-replicas: "13"
    deployment.kubernetes.io/revision: "5"
    deployment.kubernetes.io/revision-history: 1,3
  creationTimestamp: "2022-10-27T14:51:08Z"
  generation: 6
  labels:
    app: worker
    pod-template-hash: 57df9f98d8
    ...
```

Latest failed replicaSet - revision 6
```bash
$ kubectl get replicaset worker-56bb54db98 -o yaml

apiVersion: apps/v1
kind: ReplicaSet
metadata:
  annotations:
    deployment.kubernetes.io/desired-replicas: "10"
    deployment.kubernetes.io/max-replicas: "13"
    deployment.kubernetes.io/revision: "6"
    deployment.kubernetes.io/revision-history: 2,4
    kubernetes.io/change-cause: kubectl set image deploy worker worker=dockercoins/worker:v0.3
      --record=true
  creationTimestamp: "2022-10-27T15:32:37Z"
  generation: 8
  labels:
    app: worker
    pod-template-hash: 56bb54db98
    ...
```