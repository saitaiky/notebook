---
title: 'DeamonSet'
---

Like other workload objects, a DaemonSet manages groups of replicated Pods. However, DaemonSets attempt to adhere to a one-Pod-per-node model, either across the entire cluster or a subset of nodes. As you add nodes to a node pool, DaemonSets automatically add Pods to the new nodes as needed.

Other points:
- In a multi-node setup, masters usually have [taints](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/) preventing pods from running there.
- (To schedule a pod on this node anyway, the pod will require appropriate [tolerations](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/).)

:::infoReplicaSet vs DaemonSet
- The "mission" of a replica set is "Make sure that there is the right number of pods matching this spec!"
- The "mission" of a daemon set is "Make sure that there is a pod matching this spec on each node!"
:::

## Quickest way to create a DaemonSet

```bash
# We don't have a command line for the DaemonSet. 
# The quickest way to have the yml is to copy from deployment resource
$ kubectl get deploy/rng -o yaml >rng.yml

# We could tell Kubernetes to ignore these errors and try anyway
# The --force flag's actual name is --validate=false
$ kubectl apply -f rng.yml --validate=false
```

## Usage patterns

DaemonSets are useful for deploying ongoing background tasks that you need to run on all or certain nodes, and which do not require user intervention. Examples of such tasks include storage daemons like `ceph`, log collection daemons like `fluent-bit`, and node monitoring daemons like `collectd`.

For example, you could have DaemonSets for each type of daemon run on all of your nodes. Alternatively, you could run multiple DaemonSets for a single type of daemon, but have them use different configurations for different hardware types and resource needs.


