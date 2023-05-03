---
title: Helm
--- 

## What is Helm

Helm known as the *[package manager for Kubernetes](https://helm.sh/)*, focused on automating the Kubernetes applications lifecycle in a simple and consistent way.

The objective of Helm as package manager is to make an easy and automated management (install, update, or uninstall) of packages for Kubernetes applications, and deploy them with just a few commands.

### Why Helm?
Deploying your applications manually seems complex without using Helm. You will have to define every single YAML configuration, from configuring your [workloads](https://sysdig.com/learn-cloud-native/kubernetes-101/components-of-kubernetes/) to how (and what) you want them to be deployed.

And it's not only that. After defining and debugging the YAML, think about *what will happen after updating the application?* You will have to manually remove all created resources and re-deploy them for the new version, which can be slightly mitigated if you create additional files for automation, but that costs additional effort.

Helm is the simplification of this. With Helm, you can simply download your preferred Helm chart, deploy it in the cluster, and update or delete it with low effort. Helm means several benefits for your application:

-   Offers Helm charts and repositories where you get everything necessary for deployment and its configurations.
-   [Official Helm charts](https://helm.sh/docs/topics/charts/) are up to date and maintained with new releases.
-   Allows you to jump between your preferred versions of the Helm chart.
-   Everything with just a single [CLI command](https://helm.sh/docs/helm/).


## Chats

Helm uses a packaging format called charts. A chart is a collection of files that describe a related set of Kubernetes resources. A single chart might be used to deploy something simple, like a memcached pod, or something complex, like a full web app stack with HTTP servers, databases, caches, and so on.

Charts are created as files laid out in a particular directory tree. They can be packaged into versioned archives to be deployed.

### The Chart File Structure

A chart is organized as a collection of files inside of a directory. The directory name is the name of the chart (without versioning information). Thus, a chart describing WordPress would be stored in a `wordpress/` directory.

Inside of this directory, Helm will expect a structure that matches this:

```
wordpress/
  Chart.yaml          # A YAML file containing information about the chart
  LICENSE             # OPTIONAL: A plain text file containing the license for the chart
  README.md           # OPTIONAL: A human-readable README file
  values.yaml         # The default configuration values for this chart
  values.schema.json  # OPTIONAL: A JSON Schema for imposing a structure on the values.yaml file
  charts/             # A directory containing any charts upon which this chart depends.
  crds/               # Custom Resource Definitions
  templates/          # A directory of templates that, when combined with values,
                      # will generate valid Kubernetes manifest files.
  templates/NOTES.txt # OPTIONAL: A plain text file containing short usage notes
```

Helm reserves use of the `charts/`, `crds/`, and `templates/` directories, and of the listed file names. Other files will be left as they are.

### Helm chart repository

Helm charts are the applications for your [Kubernetes cluster](https://sysdig.com/learn-cloud-native/kubernetes-101/what-is-a-kubernetes-cluster/), but Helm has to get those from somewhere. The Helm chart repository is this "*somewhere*," a remote location that contains and offers these chart packages.

The [ArtifactHub CNCF sandbox project](https://artifacthub.io/) is the Helm's official repository (previously known as the [official Helm repository](https://github.com/helm/charts) on Github, deprecated and discontinued since Nov. 13, 2020). Helm also allows the use of your own hosted repositories, such as the [Falco chart repository](https://falcosecurity.github.io/charts/) or the [Sysdig Helm Charts repository](https://charts.sysdig.com/).