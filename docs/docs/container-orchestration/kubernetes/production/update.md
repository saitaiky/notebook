---
title: Update 
---


After you have install and run your first application. You will need to prepare for the Day-2 operations include triage, ongoing maintenance of deployed assets, rolling out upgrades, and troubleshooting.

Day-2 has been very hard to do. It's the worst part of the job because we're always dealing with limiting tools that don't do declarative deployments and don't have rolling updates built in. 

:::info History of Day-2 operations
Amazon was one of the first companies to really get Day-2 Operations right with their auto scaling groups, but I'm not going to talk about our history.
:::

Deployment strategies in K8s are important, if we donn't have this feature, we would just be taking down images and taking down our applications every time we did updates. **This is a key features of any orchestrator**.


## Update Deployment Strategies

| **Strategy / Pattern**              | **Official / Pattern** | **How It Works**                                             | **Key Trade-off**                     |
|-------------------------------------|------------------------|--------------------------------------------------------------|---------------------------------------|
| **Rolling Update**                  | Official               | Gradual update via pod replacement with controlled surge and unavailability. | Minimises downtime; can be slower.    |
| **Recreate**                        | Official               | Stops all pods then restarts the application with new pods.  | Simpler & faster update; incurs downtime. |
| **Canary Deployment**               | Pattern                | Routes a small fraction of traffic to a new version; scales up if successful. | Reduced risk; requires extra tooling (traffic routing). |
| **Ramped Slow Rollout / Best-Effort** | Pattern/Descriptive    | Variants of controlled rolling updates using parameters like maxUnavailable. | Adjusts speed vs. availability trade-offs. |


### Official Deployment Strategies

Kubernetes deployments support **two built-in update strategies**:

1. **Rolling Update (default)**
   - **What it does:** Gradually replaces old pods with new ones to ensure a smooth transition.
   - **How it works:**  
     - You update the pod template (for example, by changing the container image with `kubectl set image`), and Kubernetes automatically performs a rolling update.
     - It uses two key parameters:
       - **MaxSurge:** Specifies the maximum number of extra pods that can be created above the desired number during the update.  
         - For example, with 10 pods and a 25% surge, 25% of 10 is 2.5, which is rounded **up** to 3 pods.
       - **MaxUnavailable:** Indicates the maximum number of pods that can be unavailable during the update.  
         - For 10 pods at 25%, 25% of 10 is 2.5, rounded **down** to 2 pods.
   - **Trade-offs:** Minimises downtime while updating gradually, though the update can be slower compared to strategies that replace all pods at once.
2. **Recreate**
   - **What it does:** Terminates all existing pods before creating new ones.
   - **How it works:**  
     - This strategy stops all old pods first and then starts new pods.
   - **Trade-offs:** The downtime is usually more noticeable, but the update process can be simpler and faster since all pods are replaced at once.


### Deployment Patterns Beyond the Built-in Strategies

While Kubernetes only provides the two strategies above in its Deployment API, many **deployment patterns** have emerged in the community and practice. These include:

1. **Canary Deployment**
   - **Description:**  
     - A small subset of users is routed to a new version of the application. If the new version performs well, it is rolled out more broadly.
   - **Implementation Note:**  
     - This isn’t a built-in feature of the Kubernetes Deployment object. Instead, you achieve canary deployments through additional configuration or tools (e.g. using multiple deployments with different labels and a service mesh to route traffic).
   - **In your description:**  
     - You mentioned two versions of the Canary strategy. Essentially, they describe the same underlying principle, though in practice both refer to progressively shifting traffic towards the new version.
2. **Other Descriptive Patterns**
   - **Ramped Slow Rollout:**  
     - This seems to refer to a controlled, gradual roll-out of the new version—much like the default rolling update but perhaps with tighter control over how quickly pods are switched.
     - **Note:** This is not an official Kubernetes term. It may simply be a descriptive way to refer to a rolling update with a more conservative pace.
   - **Best-Effort Controlled Rollout:**  
     - This is similar to specifying a `maxUnavailable` parameter that allows a certain percentage of pods to be down at once, thus enabling a faster update if the system can handle it.
     - **Note:** Again, this term isn’t part of the Kubernetes API specification but captures a variant of the rolling update strategy's tuning.


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