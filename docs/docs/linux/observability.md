---
title: Linux Observability and Troubleshooting
description: 'An evidence-first Linux troubleshooting workflow using service state, logs, processes, resources, sockets, and kernel signals.'
sidebar_position: 15
keywords:
  - linux troubleshooting
  - observability
  - journalctl
  - proc filesystem
  - performance
---

Linux troubleshooting is a process of narrowing uncertainty. Begin with a timestamped symptom and identify the first
failing boundary before changing configuration.

## First five minutes

~~~bash
date --iso-8601=seconds
uptime
systemctl --failed
journalctl -p warning..alert --since '-15 minutes'
df -h
df -i
free -h
ss -s
~~~

This establishes time, load, failed units, recent high-priority logs, block and inode capacity, memory, and socket
pressure. It does not establish root cause.

## Follow the symptom

| Symptom | Evidence to collect |
| --- | --- |
| Service unavailable | <code>systemctl status</code>, unit logs, listening sockets, route and DNS checks |
| Slow response | CPU/run queue, memory pressure, disk latency, dependency latency, application traces |
| Process disappeared | exit status, service restart count, kernel OOM logs, deployment events |
| Cannot write a file | identity, mode/ACL, mount flags, free blocks, free inodes, filesystem errors |
| Connection refused | destination address, route, listener, container namespace, firewall |
| Connection timeout | DNS, route, security policy, packet capture, remote health |

## Process and kernel views

<code>/proc</code> exposes process and kernel state. Useful files include:

- <code>/proc/PID/status</code> for identity, state, and memory summary;
- <code>/proc/PID/fd</code> for open descriptors;
- <code>/proc/PID/limits</code> for resource limits;
- <code>/proc/meminfo</code>, <code>/proc/loadavg</code>, and <code>/proc/pressure</code> for host pressure.

Prefer stable tools and libraries over parsing every pseudo-file directly. For deeper investigation, use
<code>pidstat</code>, <code>iostat</code>, <code>strace</code>, <code>perf</code>, or eBPF tooling according to the
question and production risk.

## Preserve causality

- Record commands and timestamps.
- Capture evidence before restarting a failing process when safe.
- Change one variable at a time.
- Separate mitigation from root-cause analysis.
- Convert a useful diagnostic into monitoring, an alert, a runbook, or a safer default.

Connect host evidence to [monitoring concepts](/software-development/others/monitoring/) and
[CloudWatch](/aws/management/cloudwatch/). The managed-service dashboard is one view; Linux state is another.

## References

- [The proc filesystem](https://www.kernel.org/doc/html/latest/filesystems/proc.html)
- [Linux PSI documentation](https://www.kernel.org/doc/html/latest/accounting/psi.html)
