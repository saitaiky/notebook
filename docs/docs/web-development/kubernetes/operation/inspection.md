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




