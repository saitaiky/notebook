---
title: 3 ways to manage K8s workload
sidebar_position: 2
---

## Generators
Generators you can think of like templates. They essentially create the spec to apply to the Kubernetes cluster based on your command line options.


You think of commands like `run`, and `expose`, and `create`. They often will have generators behind them that give the template necessary with all the fields while leaving some of **the more advanced settings up to defaults** that you're not necessarily specifying at the command line. 

These generators are different for each type of thing you're creating. Whether it's a `service`, or `deployment`, or `a job`, or `a cron job`. Those generators can actually change over time as each version of Kubernetes comes out.

```bash
# --dry-run -o yaml: show me the yaml generated after this dry run
$ kubectl create deployment sample --image nginx --dry-run=client -o yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: sample
  name: sample
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sample
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: sample
    spec:
      containers:
      - image: nginx
        name: nginx
        resources: {}
status: {}
```


Job creates a set of pods that will run once.
In this case, since we don't have the multiple levels of a Deployment with ReplicaSet nested inside it, we don't need the multiple levels of spec.
```bash
$ kubectl create job sample --image nginx --dry-run=client -o yaml

apiVersion: batch/v1
kind: Job
metadata:
  creationTimestamp: null
  name: sample
spec:
  template:
    metadata:
      creationTimestamp: null
    spec:
      containers:
      - image: nginx
        name: sample
        resources: {}
      restartPolicy: Never
status: {}
```

```bash
$ kubectl expose deployment/test --port 80 --dry-run -o yaml

apiVersion: v1
kind: Service
metadata:
  creationTimestamp: null
  labels:
    app: test
  name: test
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: test
status:
  loadBalancer: {}
```
[kubectl Usage Conventions](https://kubernetes.io/docs/reference/kubectl/conventions/)



## Imperative VS Decalarative

For a detailed article to explain these 2 concepts, please check the post that I written in this [section](/web-development/programming/paradigm-of-programming/).

### Imperative (Object & command)

> TL;DR - `kubectl create` is imperative because you tell K8s to build a resource and won't record the snapshot of the last building state.

Imperative is easier when you already know the **state** of the object or the resource, and you're just getting started with using the tools.

It's easier for us in our human minds to type these things at the CLI and K8s provides imperative commands and imperative object when use imperative appoarch to interact with K8s. That's one of the biggest drawbacks to this type of work is that it's really hard to get an automated script, or tool, to automatically handle the 
- is this an update that you want? 
- is this a create? 
- is this a delete? 

Like you know, what am I supposed to do here? It's **hard for us to automate that type of work**. It's easy in our heads. Easy for us to type at the CLI. Hard for us to automate. 

:::info TL;DR
**Imperative commands**: `run, expose, scale, edit, create deployment`
- Best for dev/learning/personal projects
- Easy to learn, hardest to manage over time

**Imperative objects**: `create -f file.yml, replace -f file.yml, delete...`
- Good for prod of small environments, single file per command
- Store your changes in git-based yaml files
- Hard to automate
- Think it is a middle ground as you get your feet wet in the YAML specifications that you're going to need to use 
when you get to the full, declarative object.
:::

### Decalarative

**Declarative objects**: `apply -f file.yml` or `dir\`, `diff`

> TL;DR - `kubectl apply` is declarative because you tell K8s how to build a resource and record the snapshot of the last building state in `.metadata.annotations.kubectl.kubernetes.io/last-applied-configuration`. The next time when you update the YAML, K8s will compare the difference between both previous and current version and only apply the difference.

The reasons we don't get started using decalarative method is that, we don't always need. It it adds a little bit of complexity because you have to create this file, and all of the stuff in, it before you can even do it. Using the standard imperative commands makes sense. But, as you start to think about production, and automation, and doing this repetitive update process over and over. At that time, you will need a more declarative approach.
 
### Don't mix the three approaches

The most important rule is don't mix the approaches (**Imperative Commands**, **Imperative Objects** and **Declarative Objects**). If you create something with run, it's going to be harder later to use the apply to manage that resource. There are little tricks of the trade you can get around with some of these commands to try to edit objects later without screwing them up. But really, if you're going to be doing production, you probably shouldn't start with those run commands on your production server. You should probably think long term and stick with the YAML.

:::caution Don't mix `apply` and `create`
When you go into production, or anywhere on a cluster server, you want to stick with the same process. 
- If you're using apply, you should start with apply and stick with the YAML that you're using. 
- If you're using create commands, then later on you're going to use edit commands to change things.
:::

## Decalarative (YAML)

This is a example section to show how to use `apply` to create or update resources.

```bash
# create/update resources in a file
$kubectl apply -f myfile.yaml

# create/update a whole directory of yaml
$kubectl apply -f myyaml/

# create/update from a URL
$kubectl apply -f https://bret.run/pod.yml

# Be careful, lets look at it first (browser or curl)
$curl -L https://bret.run/pod
# Win PoSH? start https://bret.run/pod.yml
```

When you use a YAML file to create and update the resources. What's happening in the background is the standard for us humans is to write the YAML and then it's going to convert that into JSON. You technically could write the JSON, but the standard with Kubernetes for **humans** to write is YAML. (JSON is better for computer)

Each file contains one or more manifests 
You can have many different resources in a single file and then do the opposite of that where you have a single file per resource. 

Each manifest describes an API object (deployment, job, secret)
We're calling these manifests. **The full description of a resource is a manifest**, and that manifest has requirements.

### manifest in YAML

Each manifest needs four parts (root key:values in the file) 
```bash
apiVersion:
  # Use `kubectl api-versions` to get a list of the API versions the cluster supports
kind:
  # Use `kubectl api-resources` to get a list of resources the cluster supports
  # Notice some resources have multiple API's version (old vs. new)
metadata:
  # only name is required
spec
  # Where all the action is at!
```

The point I want to make here is that the `kind`, plus the `API version`, are used together to decide which resource you're going to get and which API  version you're going to be able to use for that resource.



### Building the YAML Stack

If you use the **API online documentation** to check the configuration of the objects and the keys in the YAML file, it requires you to dig around to figure out what you're looking for.  

#### Getting YAML config details via CLI (server)

```bash
# All the keys support in the YAML file
$ kubectl explain services --recursive

# Getting config details of different services
$ kubectl explain services.spec
$ kubectl explain services.spec.type

$ kubectl explain deployment.spec.template.spec.volumes.nfs.server
KIND:     Deployment
VERSION:  apps/v1

FIELD:    server <string>

DESCRIPTION:
     server is the hostname or IP address of the NFS server. More info:
     https://kubernetes.io/docs/concepts/storage/volumes#nfs
```


#### Beware of the version between server and client is not the same

I find that it's easier to work from the **command line** to check the YAML config, but the command line also doesn't deal with the versions. If you've got a different version of a client then your server version, you'll want to definitely look at the API docs because your client might be on an older or newer version than what your server can support. There's no real way, at the command line that I'm aware of, to get the different versions of the information. It's always just the version of your client.

#### Build your own template

You can always go use other people's / documentation YAML file. Then you'll want to sort of see if you can go from pure vanilla file by using above commands to check the YAML config details. Then you'll end up with your own little private repository of knowledge. 

That'll be what you use in your company. You might even have standards for how you create deployments and standards for how you create services. Maybe they'll have special labels or annotations on them. They'll maybe have a special template features. Anyway. There's lots you could do there, but most teams end up with their own defaults in a repo of sorts that they pull from rather than completely typing from scratch.

## Server dry run, diff
• dry-run a create (client side only) - It doesn't really know on your cluster, right. It hasn't talked to the server to figure that out. 

> kubectl apply -f app.yml --dry-run 

dry-run a create/update on server. It will then go talk to the server and give me a proper response.
> kubectl apply -f app.yml --server-dry-run

Hopefully with that, you can create your own workflow for creating YAMLs from scratch, Managing the specs in those YAMLs, and then using the apply command over and over to make your changes. That's a much more DevOps friendly infrastructure as code type of way of doing it.