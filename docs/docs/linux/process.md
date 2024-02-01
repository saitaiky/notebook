---
title: Zombie Process
---

## What is a Zombie process?

In the world of Linux, a zombie process refers to any process that is essentially removed from the system as ‘defunct’, but still somehow resides in the processor’s memory as a ‘zombie’.

Also sometimes referred to as a process in a ‘terminated state,’ a Zombie process is usually cleaned from the memory system through a parent process. But when the parent process isn’t notified of the change, the child process (zombie) doesn’t get the signal to leave the memory.

## How Linux handle process

### fork(), wait() & SIGCHILD

A process created in Unix system must use the kernel function `fork()` , and the address space is cloned from parent process. In Unix system, the parent process is responsible for reap the child process status and memory stack. Then, the parent process calls `wait()` waiting the child process to terminate and reply a `SIGCHLD` signal, once parent process receive this signal it starts to reap the child process. 

So, there is a problem that if the parent process decide not to wait the termination of the child, no one is responsible for the reap and there is one zombie process in system.

### Normal scenario

Parent process calls `wait()` waiting the child process return a `SIGCHLD` signal and begin reap.

![normal-scenario](/img/linux/normal-scenario.png)
Source: [Operating System — How does zombie process happen and how to prevent it](https://medium.com/@lsc830621/operating-system-how-does-zombie-process-happen-and-how-to-prevent-it-c05a3a48a4bc)

### Zombie process scenario

Parent process keep doing its own thing instead calling `wait()` , so it would not know when the child process terminate. And the reap would never happen causing an zombie process left in the system.

![zombie-scenario](/img/linux/zombie-scenario.png)
Source: [Operating System — How does zombie process happen and how to prevent it](https://medium.com/@lsc830621/operating-system-how-does-zombie-process-happen-and-how-to-prevent-it-c05a3a48a4bc)

:::infoWhy does this happened?
These functions usually happen very quickly, so there is no time for zombie processes to accumulate on your system. However, for a zombie process to be removed entirely from the system, the parent process must be appropriately programmed to call on `wait()`. If you’re unsure how to identify zombie processes in your system, conduct a routine zombie test using predetermined patterns and methods.
:::

:::infoWhy are zombie process bad?
Although zombies do not use up your system's precious resources like a rogue app does, it can pose a significant threat by retaining all PIDs (Process IDs). Since a Linux system has a [finite amount of PIDs](https://www.techrepublic.com/article/how-to-find-and-kill-zombie-processes-on-your-linux-data-center-servers/), when numerous PIDs are zombied, no other process can easily be launched. 
:::

## How to kill the zombie process

Bear in mind that zombie processes are already dead. This means that you cannot kill a zombie function with the same command (SIGKILL signal) to kill normal processes.  

The steps necessary to clean up an accumulation of zombie processes can be difficult and complicated. Below are two scenarios that can simplify this process and help you to remove a zombie process:

### If the parent process is still active

The zombie process exists while the parent process is still active and stuck on a particular task somewhere in the system, and hasn't received the execution signal.

In such cases, there are two things you can do:

1. Use the strace command on the parent process to debug and troubleshoot the issue. A strace command [stores all system calls](https://linuxconfig.org/how-to-trace-system-calls-made-by-a-process-with-strace-on-linux) and signals made by a process.

2. Additionally, you can also kill the zombie process by sending the `SIGCHLD` signal to the parent process to make the parent process exit cleanly with its zombie process. If you choose this option, it is preferred to use the 'kill' command in tandem with the default signal -15 (`SIGTERM`) instead of using a -9 (`SIGKILL`) signal.

### If the parent process is no longer active

However, oftentimes the parent process is ‘inactive’. It may be possible that the process isn’t programmed correctly, which may cause it to ignore the SIGCHLD signals.

In such a case, it makes sense for you to remove the parent process so that **an init process** will be the latest parent to the zombie processes. (In Unix , when the parent process terminate , the init process (created by Unix Kernel) would take care all of its child process. )

:::infoWhat is an init process?
An init process -- short for initialization -- is the first process that is issued when a system reboots. An init process will then [periodically execute the regular protocol](https://www.geeksforgeeks.org/init-command-in-linux-with-examples/): giving the wait() system call to clean up its zombie children.
:::

**One thing to remember is that if a parent process is inactive, you cannot remove the zombie process without rebooting your system.** So if you only have a few zombie processes and they aren't multiplying, you can deal with them at the next system reboot. However, zombie processes may be quick to accumulate, usually a signal that there might be an issue with your system.

If a parent process continues to create zombies, repair them straight away. This is important so the parents can properly call wait() to do away with its zombie children. File a bug report if a program on your system keeps creating zombies.

### CLI Example


1. Find zombie processes as root user
    ```bash
    ps aux | egrep "Z|defunct" | grep -v 'grep'
    ```

2. Get parent PID for child PID called 1313
    ```bash 
    $ps -o ppid=1313
    ```

3. Parent process

    **Approach 1: When parent process is still active**: return PID 4104, kill zombie process which has a parent PID 4104
    ```bash 
    $kill -s SIGCHLD 4104
    ```

    **Approach 2: If parent process is not active / above command failed**, try the following command to kill its parent process:
    ```bash 
    $kill -9 4104
    ```

## Reference 

- [Zombie Process in Linux – How to work with defunct/zombie processes in Linux?](https://www.linuxfordevices.com/tutorials/linux/defunct-zombie-process)
- [Killing zombie processes on Linux using kill command](https://www.cyberciti.biz/tips/killing-zombie-process.html)