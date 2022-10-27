---
title: YAML
---

## YAML refresher

- It's technically a superset of JSON, designed for humans
- JSON was good for machines, but not for humans
- Spaces set the structure. One space off and game over
- Remember spaces not tabs, Ever!
    - Tabs have been outlawed since they are treated differently by different editors and tools. And since indentation is so critical to proper interpretation of YAML, this issue is just too tricky to even attempt. source: [YAML FAQ](http://yaml.org/faq.html)
- **Two spaces is standard**, but four spaces works too
- You don't have to learn all YAML features, but key concepts you need:
    - Key/Value Pairs
    - Array/Lists
    - Dictionary/Maps

Each file can contain one or more manifests. The manifest describes one resource object per manifest.

```yaml
apiVersion:  # find with `kubectl api-versions`
kind:        # find with `kubectl api-resources`
metadata:
spec:        # find with `kubectl describe pod`
---
apiVersion:
kind:
metadata:
spec:
```

:::dangerAlways look at the YAML information before you apply it to your system
Because `kubectl apply` is the new `curl | sh`, so essentially, treat the YAML like it's a Superuser, because it can..
- starts bitcoin miners on the whole cluster
- It could hide resources in a non-default namespace so that you didn't see them.
- it could hide things in the system namespace so you wouldn't really pay attention to that if you're just using a default. 
- It could do things like bind mount host file systems as root.
- It could insert SSH keys into the root account of the physical server.
- It has root on the host machine.It could encrypt data and cause you to have a ransomware situation.
:::

The API version in your YAML file has two parts to it. The first part is what group it is in. And then the second part is the version of that.

APIGROUP: API group is blank, which means it's using the root of the API. It's not an extension.

```bash
$ kubectl api-resources

NAME                              SHORTNAMES   APIVERSION                             NAMESPACED   KIND
pods                              po           v1                                     true         Pod
podtemplates                                   v1                                     true         PodTemplate
replicationcontrollers            rc           v1                                     true         ReplicationController
...
```

```bash
$ kubectl api-versions 

# Show all API groups
# Multiple versions at the same time is for backwards compatibility.
# e.g. below you can use both storage.k8s.io/v1 or storage.k8s.io/v1beta1 for storage API
admissionregistration.k8s.io/v1
apiextensions.k8s.io/v1
apiregistration.k8s.io/v1
apps/v1
authentication.k8s.io/v1
...
storage.k8s.io/v1
storage.k8s.io/v1beta1
v1   <== because we're at the root, our pod was going to be a v1.
```

## Ways to build a YAML

### From scratch

1. Dive into the `spec` of that `kind`
    -   `kubectl explain <kind>.spec`
    -   `kubectl explain <kind> --recursive`
2. Browse the docs [API Reference](https://kubernetes.io/docs/reference/kubernetes-api/) for your cluster version to supplement

**Features that provided by using decalarative way**

YAML is going to be always a complete superset of what the CLI can do for us.
- Advanced (and even not-so-advanced) features require us to write YAML:
    - pods with multiple containers
    - resource limits
    - healthchecks
    - many other resource options
- Other resource types don't have their own commands(YET)!
    - DaemonSets
    - StatefulSets


### Other options

There are 2 different options if you don't want to build a YAML from scratch.

1. Output YAML from existing resources, then dump its YAML with `kubectl get -o yaml` ...
2. We have the docs, with good starter YAML
    -   [StatefulSet](https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/#creating-a-statefulset), [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/#create-a-daemonset), [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap), [and a ton more on GitHub](https://github.com/kubernetes/website/tree/master/content/en/examples)



## Dry run 

|                  | sends data to server/cluster | perform change on server/cluster | validation by the server/cluster |
|:----------------:|:----------------------------:|:--------------------------------:|----------------------------------|
| --dry-run=client |              no              |                no                |                no                |
| --dry-run=server |              yes             |                no                |                yes               |
| --dry-run=none   |              yes             |                yes               |                yes               |


### Client dry run

Client dry run is a client-only thing, which means it doesn't apply in the real world, necessarily, against your cluster's spec and API that might be different than your client.

```bash
# Generate the YAML for a Deployment without creating it
kubectl create deployment web --image nginx -o yaml --dry-run

# Generate the YAML for a Namespace without creating it
kubectl create namespace awesome-app -o yaml --dry-run
```


### Server dry run

Server-side dry run will do all the work, but not persist to etcd. All validation and mutation hooks will be executed and only skip the database writing step. It's doing everything else against this configuration, and then it takes the result and spits it back at us.

```bash
# server-side dry run verify the YAML much more extensively
kubectl apply -f web.yaml --dry-run=server -o yaml
```

```bash
$ kubectl version --short 
Client Version: v1.25.0
Kustomize Version: v4.5.7
Server Version: v1.24.0
```


## YAML linting and validation
The CI tools, I recommend you start testing in your automated infrastructure. Maybe you're not fully automated yet, but some day, you're going to be testing your software, and you probably should test your YAML as well. This is part of your code. In essence, it's the configuration and description of your application, but it's just as important to test before the things gone through to your CI system.
- YAML linter: pip install yamllint github.com/adrienverge/yamllint
- Kuberentes validator: kubeval github.com/instrumenta/kubeval

## kubectl diff

> Basically, it is like a `git diff`

APIServer dry-run is convenient because it lets you see how the object would be processed, but it can be hard to identify exactly what changed if the object is big. `kubectl diff` does exactly what you want by showing the differences between the current "live" object and the new "dry-run" object. It makes it very convenient to focus on only the changes that are made to the object, how the server has merged these and how the mutating webhooks affects the output.

```bash
$ kubectl delete -f just-a-pod.yaml
```


## Update YAML partially

We could use `kubectl edit deployment worker`, but we could also use `kubectl patch` with the exact YAML shown before

```bash
$ kubectl patch deployment worker -p "
spec:
  template:
    spec:
      containers:
      - name: worker
        image: dockercoins/worker:v0.1
  strategy:
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1
  minReadySeconds: 10
"
$ kubectl rollout status deployment worker
$ kubectl get deploy -o json worker |
      jq "{name:.metadata.name} + .spec.strategy.rollingUpdate"
```      