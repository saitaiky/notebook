---
title: Linux Memory
description: 'Virtual memory, resident memory, page cache, swapping, cgroup limits, and a practical Linux memory-pressure workflow.'
sidebar_position: 8
keywords:
  - linux memory
  - virtual memory
  - page cache
  - swap
  - oom killer
  - cgroups
---

Linux gives each process a virtual address space. Virtual addresses are mapped to physical pages as needed, allowing
isolation, shared libraries, memory-mapped files, copy-on-write, and the use of storage as swap. A large virtual size is
therefore not the same as a large resident footprint.

## The measurements

| Measurement | Meaning |
| --- | --- |
| Virtual memory | Address ranges reserved or mapped by a process |
| RSS | Pages currently resident in physical memory |
| Anonymous memory | Heap, stacks, and other memory not backed by a regular file |
| Page cache | File data cached by the kernel and reclaimable when applications need memory |
| Swap | Anonymous pages moved to configured storage |
| Available memory | Kernel estimate of memory that can be supplied without heavy swapping |

Treat the <code>free</code> column alone with caution: Linux deliberately uses otherwise idle RAM for caches.

## Diagnose pressure

~~~bash
free -h
vmstat 1
cat /proc/meminfo
ps -eo pid,comm,rss,vsz,%mem --sort=-rss | head
journalctl -k -g 'oom|Out of memory|Killed process'
~~~

Ask:

1. Is available memory falling persistently?
2. Is swap activity sustained rather than occasional?
3. Is one process growing, or is aggregate demand the problem?
4. Is the host constrained, or only a service/container cgroup?
5. Did the kernel or a cgroup terminate a process?

For a systemd service, <code>systemctl show SERVICE -p MemoryCurrent -p MemoryMax</code> can expose the unit's cgroup
usage and limit. In a container platform, inspect both the container limit and the node.

## Out-of-memory termination

When reclaim and swapping cannot satisfy an allocation, Linux may invoke the OOM killer. Under cgroup v2, a workload can
reach its own memory limit while the host still has free memory. This distinction explains the common observation
"the container was OOM-killed, but the machine was not out of RAM."

Do not fix every OOM by increasing the limit. Check for leaks, unbounded queues, oversized caches, unsafe concurrency,
and memory requested during startup. Limits are also an isolation control: removing them can move the failure from one
service to the entire host.

## Architecture connection

Memory pressure changes latency before it causes termination. Reclaim, swap I/O, garbage collection, and cache eviction
can all lengthen response time. Capacity planning therefore needs latency and working-set measurements, not only peak RSS.

On AWS, connect this model to [EC2 sizing](/aws/compute/ec2/), [ECS](/aws/compute/ecs-ecr/), and
[EKS](/aws/development/eks/). Continue with [observability](/linux/observability/) for a wider diagnostic workflow.

## Reference

- [Linux kernel memory-management documentation](https://www.kernel.org/doc/html/latest/admin-guide/mm/index.html)
- [Control group v2 memory controller](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html)
