---
title: Namespace
---

## What is namespace?

> [Wiki](https://en.wikipedia.org/wiki/Linux_namespaces) - “Namespaces are a feature of the Linux kernel that partitions kernel resources such that **one set of processes sees one set of resource**s while **another set of processes sees a different set of resources.**”

In other words, the key feature of namespaces is that they isolate processes from each other. On a server where you are running many different services, isolating each service and its associated processes from other services means that there is a smaller blast radius for changes, as well as a smaller footprint for security‑related concerns. Namespace refers to the type of namespace and also the specified space of names.

Mostly though, isolating services meets the architectural style of microservices as described by [Martin Fowler](https://martinfowler.com/articles/microservices.html).

![Linux-Kernel-Illustration](/img/linux/linux-kernel-illustration.webp)
Source: [What are kernel namespaces?](https://www.educative.io/answers/what-are-kernel-namespaces)

### Analogy
Consider my apartment building. It's technically two distinct buildings with their own entrances. However, the parking garage, gym, pool, and common rooms are shared. The buildings have their own names, City Place and City Place 2. They have their own street addresses, floors, and elevators. Yet, they are attached to the same physical complex.

The physical complex is the same idea as a computer. Two namespaces (or more) can reside on the same physical computer, and much like the apartment building, namespaces can either share access to certain resources or have exclusive access.

### Namespaces in container world

To understand namespaces easily, it is worth saying Linux namespaces are the basis of container technologies like **Docker** or **Kubernetes**.

One container shouldn’t be able to gain control over another’s resources, because if that container is then compromised it could compromise the entire system. This method of attack is similar to how the CPU bug Meltdown works; different threads of a processor should be isolated from each other. Similarly, processes running on different virtual systems (containers) should be isolated from other containers.

Namespaces achieve this isolation at a kernel level. Similar to how the application chroot works, which jails a process in a different root directory, namespaces separate other aspects of the system. There are seven namespaces available:

- **Mount (mnt)** Very similar to chroot, the Mount namespace virtually partitions the file system. Processes running in separate mount namespaces cannot access files outside of their mount point. Because this is done at a kernel level, it’s much more secure than changing the root directory with chroot.
- **Process (pid)** In Linux, the first processes spawn as children of PID 1, which forms the root of the process tree. The process namespace cuts off a branch of the PID tree, and doesn’t allow access further up the branch. Processes in child namespaces will actually have multiple PIDs—the first one representing the global PID used by the main system, and the second PID representing the PID within the child process tree, which will restart from 1.
- **Interprocess Communication (ipc)** This namespace controls whether or not processes can talk directly to one another.
- **Network (net)** This namespace manages which network devices a process can see. However, this doesn’t automatically set up anything for you—you’ll still need to create virtual network devices, and manage the connection between global network interfaces and child network interfaces. Containerization software like Docker already has this figured out, and can manage networking for you.
User. This namespace allows process to have “virtual root” inside their own namespace, without having actual root access to the parent system. It also partitions off UID and GID information, so child namespaces can have their own user configurations.
- **UNIX Time Sharing (UTS)** This namespace controls hostname and domain information, and allows processes to think they’re running on differently named servers.
- **Cgroup** is another kernel feature very similar to namespaces. Cgroups allow the system to define resource limits (CPU, memory, disk space, network traffic, etc.) to a group of processes. This is a useful feature for containerized apps, but it doesn’t do any kind of “information isolation” like namespaces would. The [cgroup namespace](http://man7.org/linux/man-pages/man7/cgroup_namespaces.7.html) is a separate thing, and only controls which cgroups a process can see, and does not assign it to a specific cgroup.

By default, any process you run uses the global namespaces, and most process on your system do as well unless otherwise specified.


## Difference between cgroups and namespaces

- cgroup: Control Groups provide a mechanism for aggregating/partitioning sets of tasks, and all their future children, into hierarchical groups with specialized behaviour.
- namespace: wraps a global system resource in an abstraction that makes it appear to the processes within the namespace that they have their own isolated instance of the global resource.

In short:

- Cgroups = limits how much resources you can use;
- namespaces = limits what you can see (and therefore use)

**Cgroups involve resource metering and limiting:**

- memory
- CPU
- block I/O
- network


**Namespaces provide processes with their own view of the system**

- pid
- net
- mnt
- uts
- ipc