---
title: Inspection
sidebar_position: 1
---

## Checking resources

### Introspection vs. documentation

**Why do we need to check the document via command line?**
Commands like `kubectl api-resources` and `kubectl explain` perform *introspection*(they communicate with the API server and obtain the exact type definitions)

Now the big difference is that the generic documentation on the website is just going to give you the official resource types and the API information for a standard Kubernetes cluster. We talked about that different distributions, and different plugins, will extend and change that resource list. It'll give you new features and new stuff to look at.

```
$ kubectl api-resources

NAME                              SHORTNAMES   APIVERSION                             NAMESPACED   KIND
bindings                                       v1                                     true         Binding
componentstatuses                 cs           v1                                     false        ComponentStatus
configmaps                        cm           v1                                     true         ConfigMap
endpoints                         ep           v1                                     true         Endpoints
events                            ev           v1                                     true         Event
limitranges                       limits       v1                                     true         LimitRange
namespaces                        ns           v1                                     false        Namespace
nodes                             no           v1                                     false        Node
persistentvolumeclaims            pvc          v1                                     true         PersistentVolumeClaim
persistentvolumes                 pv           v1                                     false        PersistentVolume
pods                              po           v1                                     true         Pod
podtemplates                                   v1                                     true         PodTemplate
....
```


## Inspection

### Labels

Labels are key-value pairs which are attached to pods, replication controller and services. Labels are intended to be used to specify identifying attributes of objects that are meaningful and relevant to users, but do not directly imply semantics to the core system. Labels can be used to organize and to select subsets of objects. Each object can have a set of key/value labels defined. Each Key must be unique for a given object.

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

```bash
# -w like the watch command in linux, will let it sit there and refresh every few seconds.
# $ kubectl get <resources>
$ kubectl get pods -w

$ kubectl get pods --show-labels   
NAME                         READY   STATUS    RESTARTS   AGE     LABELS
littletomcat-79d56f5694-mxd52   1/1     Running   0          70m   app=littletomcat,pod-template-hash=79d56f5694
littletomcat-79d56f5694-th56d   1/1     Running   0          67m   app=littletomcat,pod-template-hash=79d56f5694
```

### Selector (Label selector)

:::infoSelector vs Label selector
**Labels don't provide uniqueness**. In general, we can say many objects can carry the same labels. Labels selector are core grouping primitive in Kubernetes. They are used by the users to select a set of objects.
:::

Selectors are the glue that connect resources to each other. When you create a deployment, a deployment needs to create a ReplicaSet. It uses a selector to find the labels of the things it needs to manage. The same is true of that ReplicaSet finding its pods.

Services uses selector to find pods.
Deployment uses selector to find ReplicaSet.
ReplicaSet uses selector to find pods.


If any pod has `app=rng` selector, it will consider that a part of the pool of pods to round robin these connections to. Other resources, like deployments that create ReplicaSets, they use that same selector to determine which ReplicaSets they manage or they own. So, a service is always looking for pods to send connections to. 


```bash
$ kubectl describe  svc  rng     

Name:              rng
Namespace:         default
Labels:            app=rng
Annotations:       <none>
Selector:          app=rng  <========= Label Selector 
Type:              ClusterIP
IP Family Policy:  SingleStack
IP Families:       IPv4
IP:                10.102.198.230
IPs:               10.102.198.230
Port:              <unset>  80/TCP
TargetPort:        80/TCP
Endpoints:         10.1.0.76:80
Session Affinity:  None
Events:            <none>
```

```
$ kubectl get pods --selector=app=littletomcat -o wide
NAME                   READY   STATUS    RESTARTS   AGE    IP          NODE             NOMINATED NODE   READINESS GATES
rng-576d96c88c-2fzpx   1/1     Running   0          7h     10.1.0.76   docker-desktop   <none>           <none>
rng-zfngj              1/1     Running   0          109m   10.1.0.88   docker-desktop   <none>           <none>
```
### describe

Print a detailed description of the selected resources, including related resources such as events or controllers. You may select a single object by name, all objects of that type, provide a name prefix, or label selector. For example: `kubectl describe TYPE/NAME_PREFIX`

`describe` also product the event status at the bottom of the log. This can be pretty handy for a quick troubleshooting technique **without having to go turn on some events or debugging logs**.

```bash
$ kubectl describe node docker-desktop

Name:               docker-desktop
Roles:              control-plane
Labels:             beta.kubernetes.io/arch=arm64
                    beta.kubernetes.io/os=linux
                    kubernetes.io/arch=arm64
                    kubernetes.io/hostname=docker-desktop
                    kubernetes.io/os=linux
                    node-role.kubernetes.io/control-plane=
                    node.kubernetes.io/exclude-from-external-load-balancers=
Annotations:        kubeadm.alpha.kubernetes.io/cri-socket: unix:///var/run/cri-dockerd.sock
                    node.alpha.kubernetes.io/ttl: 0
                    volumes.kubernetes.io/controller-managed-attach-detach: true
CreationTimestamp:  Sat, 18 Jun 2020 16:11:04 +0100
Taints:             <none>
Unschedulable:      false
Lease:
  HolderIdentity:  docker-desktop
  AcquireTime:     <unset>
  RenewTime:       Fri, 14 Oct 2020 17:20:46 +0100
```



## Label Selector operations

### Logging

Show the logs combined for multiple pods based on a label that they all share.

By default, it can only pull up to **five pods** at a time when it uses the **selector type** of pulling in the logs. You can always increase that, but the reality is it's taxing on the system to pull from all the different nodes these log files. 

> In production, you're going to want a third-party logging system that would collect all these logs and store them over time for quicker retrieval. like [stern](https://github.com/wercker/stern) 

```bash
# --tail 5: last 5 lines
# -l: lable
# --follow: Streaming the logs
$ kubectl logs --tail 5 -l  app=my-apache --follow
```

:::info Why can't we stream the logs of many pods?
Pulling logs is a rather strenuous thing, especially if your apps are dumping logs en masse. 

- If thousands of containers are running, this can put some stress on the API server.
- If you're ever running a proxy or a web server, and you're capturing every connection into logs, that's a large amount of logs streaming over the network. It's pulling this from the API.

We don't want to overwhelm the API. It's the most precious thing in your cluster. So, you want to protect that, and there's a natural limit here. You can change that limit, but there's probably a better way.
:::

### Add and remove labels

Add label to all pods that serve in `rng` service.

```bash
# Add active=yes to all pods that have app=rng:
$ kubectl label pods -l app=rng enabled=yes

# Edit rng service (It will open your laptop default editor) 
# kubectl edit is not a declarative approach 
$ kubectl edit service rng
```

Add label selector `enabled: "yes"` to the rng service YMAL file
```ymal
apiVersion: v1
kind: Service
metadata:
  annotations:
  .....
spec:
....
  selector:
    app: rng 
    enabled: "yes"
```


```bash
# Delete enabled label from pods which created by Deployment>ReplicaSet
# the label(pod-template-hash) was generated by ReplicaSet
kubectl label pod -l app=rng,pod-template-hash enabled-
```

### Labels for debugging

> TL;DR - Label is very useful to troubleshoot intermittent and elusive bugs

- When a pod is misbehaving, we can delete it, then another one will be recreated.
- But we can also change its labels.
    1. It will be removed from the load balancer (it won't receive traffic anymore)
    2. Another pod will be recreated immediately
- But the problematic pod is still here, and we can inspect and debug it
- We can even re-add it to the rotation if necessary

### Labels for deployment

- We can add pods matching a service's selector to receive requests and serve traffic (Sneak in and out for testing)
- Examples:
    - one-shot pod with all debug flags enabled, to collect logs
    - pods created automatically, but added to rotation in a second step (by setting their label accordingly)
- This gives us building blocks for canary and blue/green deployments

## Tools for monitoring

> [Official k8s dashboard](https://github.com/kubernetes/dashboard)