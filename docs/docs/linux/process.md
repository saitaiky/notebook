---
title: Linux Processes and Signals
description: 'Process creation, states, signals, child reaping, zombies, graceful shutdown, and practical Linux process diagnosis.'
sidebar_position: 7
keywords:
  - linux process
  - signals
  - fork exec wait
  - zombie process
  - graceful shutdown
---

A Linux process is a running program with an address space, threads, credentials, file descriptors, signal state, and
kernel scheduling state. A process ID identifies it within a PID namespace; a parent process ID records the process that
created it.

## Creation and termination

On Unix-like systems, a common lifecycle is:

1. A process creates a child with <code>fork</code> or a related clone operation.
2. The child may replace its program image with <code>execve</code>.
3. Parent and child execute independently.
4. The child exits and leaves an exit status.
5. The parent calls <code>wait</code> or <code>waitpid</code> to collect that status.

After a successful exec, the PID remains the same; the program image changes.

## Process states

The one-letter state shown by <code>ps</code> is a useful clue:

| State | Meaning |
| --- | --- |
| R | Running or runnable |
| S | Interruptible sleep, usually waiting for an event |
| D | Uninterruptible sleep, often waiting in the kernel for I/O |
| T | Stopped or being traced |
| Z | Zombie: exited, but not yet reaped by its parent |

A zombie consumes very little memory or CPU, but retains a process-table entry. Many zombies indicate that a parent is
not collecting children correctly.

## Signals and graceful shutdown

Signals are asynchronous notifications. SIGTERM asks a process to terminate and can be handled. SIGINT commonly
represents an interactive interrupt. SIGHUP is often used for session loss or configuration reload. SIGKILL cannot be
caught or delayed and prevents application cleanup.

Use the least forceful appropriate signal:

~~~bash
kill -TERM PID
kill -KILL PID
~~~

Do not jump to SIGKILL simply because it is effective. A service may need to finish requests, flush state, release a
lease, or remove temporary resources. The supervisor or orchestrator will enforce a deadline if the process does not exit.

## Zombie processes

A zombie cannot be killed again because it has already exited. Correct the parent:

- allow the parent to handle SIGCHLD and call a wait function;
- restart or repair a faulty long-running parent;
- ensure a container's PID 1 reaps orphaned children;
- use an init process when an application launches unmanaged child processes.

If the parent exits, an init/subreaper process adopts and should reap the orphan. Repeatedly killing parents is a
mitigation, not a code-level fix.

## Inspect a process

~~~bash
ps -eo pid,ppid,state,lstart,etime,comm,args
pstree -ap
cat /proc/PID/status
ls -l /proc/PID/fd
cat /proc/PID/limits
systemctl status SERVICE
journalctl -u SERVICE
~~~

Ask whether the process is runnable, blocked, repeatedly restarting, waiting on a child, limited by a cgroup, or holding
unexpected files and sockets.

## Cloud and container connection

A container still contains Linux processes. PID namespaces change which PIDs are visible; cgroups account for and limit
resources. ECS task shutdown, Kubernetes pod termination, and systemd service stopping all depend on an application
responding correctly to signals.

Continue with [kernel and userspace](/linux/kernel-userspace-system-calls/),
[namespaces and cgroups](/linux/namespace/), [systemd services](/linux/services-systemd/), and
[ECS](/aws/compute/ecs-ecr/).

## References

- [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html)
- [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html)
- [wait(2)](https://man7.org/linux/man-pages/man2/wait.2.html)
- [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html)
