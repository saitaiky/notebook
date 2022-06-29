---
title: command
---

Build a one-off pod that runs bash and remove it when we exit bash. 
`--` tells the run command to stop looking at options and that anything after that double dashes is the command to run when I execute this container. 

```
kubectl run tmp-shell --rm -it --image bretfisher/netshoot -- bash
```



The cool thing about Kubernetes is it comes unopinionated. it comes with a whole slew of options for how you might create and deploy containers.

The thing there is, though, how are you supposed to use it? What's the best way that I would recommend to use 
it? 




Generators you can think of like templates. They essentially create the spec to apply to the Kubernetes cluster based on your command line options.


You think of commands like `run`, and `expose`, and `create`. They often will have generators behind them that give the template necessary with all the fields while leaving some of **the more advanced settings up to defaults** that you're not necessarily specifying at the command line. 

These generators are different for each type of thing you're creating. Whether it's a `service`, or `deployment`, or `a job`, or `a cron job`. Those generators can actually change over time as each version of Kubernetes comes out.

```bash
# --dry-run -o yaml: show me the yaml generated after this dry run
kubectl create deployment sample --image nginx --dry-run=client -o yaml

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
kubectl create job sample --image nginx --dry-run=client -o yaml

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
kubectl expose deployment/test --port 80 --dry-run -o yaml

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

### Imperative

Imperative is easier when you already know the **state** of the object or the resource, and you're just getting started with using the tools.

It's easier for us in our human minds to type these things at the CLI.It's unfortunately not easy to automate. That's one of the biggest drawbacks to this type of work is that it's really hard to get an automated script, or tool, to automatically handle the, 
- is this an update that you want? 
- is this a create? 
- is this a delete? 

Like you know, what am I supposed to do here? It's **hard for us to automate that type of work**. It's easy in our heads. Easy for us to type at the CLI. Hard for us to automate.

:::info TL;DR
Imperative commands: `run, expose, scale, edit, create deployment`
- Best for dev/learning/personal projects
- Easy to learn, hardest to manage over time

Imperative objects: `create -f file.yml, replace -f file.yml, delete...`
- Good for prod of small environments, single file per command
- Store your changes in git-based yaml files
- Hard to automate
- Think it is a middle ground as you get your feet wet in the YAML specifications that you're going to need to use 
when you get to the full, declarative object.
:::
### Decalarative

Declarative objects: `apply -f file.yml` or `dir\`, `diff`

The reasons we don't get started using decalarative method is that, we don't always need. It it adds a little bit of complexity because you have to create this file, and all of the stuff in, it before you can even do it. Using the standard imperative commands makes sense. But, as you start to think about production, and automation, and doing this repetitive update process over and over. At that time, you will need a more declarative approach.
 

### Don't mix the three approaches

The most important rule is don't mix the approaches (**Imperative Commands**, **Imperative Objects** and **Declarative Objects**). If you create something with run, it's going to be harder later to use the apply to manage that resource. There are little tricks of the trade you can get around with some of these commands to try to edit objects later without screwing them up. But really, if you're going to be doing production, you probably shouldn't start with those run commands on your production server. You should probably think long term and stick with the YAML.
