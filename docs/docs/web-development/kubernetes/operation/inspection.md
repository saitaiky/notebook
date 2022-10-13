
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




