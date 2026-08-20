---
title: Kernel, Userspace, and System Calls
description: 'How Linux separates applications from privileged kernel operations, and how system calls connect the two.'
sidebar_position: 6
keywords:
  - linux kernel
  - userspace
  - system calls
  - kernel mode
  - file descriptors
---

An application normally executes in **userspace**, with its own virtual address space and restricted privileges. The Linux
kernel executes privileged code, schedules tasks, manages memory, implements filesystems and networking, and mediates
access to devices. A distribution combines the Linux kernel with userspace libraries, tools, an init system, a package
manager, and applications.

## The boundary

CPU privilege levels enforce the boundary. Application code cannot directly program a device, map arbitrary physical
memory, or inspect another process. It asks the kernel to perform an operation through a **system call**.

Examples include:

| Application intent | Typical system calls |
| --- | --- |
| Open and read a file | <code>openat</code>, <code>read</code>, <code>close</code> |
| Start another program | <code>fork</code> or <code>clone</code>, then <code>execve</code> |
| Allocate memory | <code>mmap</code>, <code>brk</code> |
| Use the network | <code>socket</code>, <code>connect</code>, <code>accept</code>, <code>send</code>, <code>recv</code> |
| Wait for work | <code>epoll_wait</code>, <code>futex</code> |

Language runtimes and standard libraries usually wrap these calls. A Python file object or Node.js socket is convenient,
but the resource eventually becomes a kernel-managed file descriptor.

## File descriptors as a unifying model

A file descriptor is a small process-local integer referring to an open kernel object. Regular files, pipes, sockets,
terminals, and some devices use this interface. By convention, descriptors 0, 1, and 2 are standard input, standard
output, and standard error.

This model explains why shell redirection and pipes compose:

~~~bash
producer 2>errors.log | consumer
~~~

The shell connects file descriptors before executing either program. The programs do not need special knowledge of each
other.

## Inspect the boundary

Useful questions and tools:

- Which kernel and architecture are running? <code>uname -a</code>
- Which system calls does a process make? <code>strace -f -p PID</code>
- Which files and sockets are open? <code>lsof -p PID</code> or <code>ls -l /proc/PID/fd</code>
- Which limits apply? <code>cat /proc/PID/limits</code>
- Which kernel interfaces are exposed? <code>/proc</code> describes process and kernel state; <code>/sys</code> exposes
  devices and kernel objects.

Use tracing carefully on production systems: it can expose sensitive arguments and can add overhead to a busy process.

## Why architects should care

Managed platforms hide host administration, but they do not remove these constraints. Connection pools consume file
descriptors, containers contain processes, graceful shutdown is signal handling, and out-of-memory termination is a
kernel or cgroup decision. Understanding this boundary makes runtime failures less mysterious.

Continue with [processes and signals](/linux/process/), [memory](/linux/memory/), and
[namespaces and cgroups](/linux/namespace/).

## References

- [Linux man-pages project](https://www.kernel.org/pub/linux/docs/man-pages/)
- [The proc filesystem](https://www.kernel.org/doc/html/latest/filesystems/proc.html)
- [Rules for accessing sysfs](https://www.kernel.org/doc/html/latest/admin-guide/sysfs-rules.html)
