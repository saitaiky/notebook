---
title: Linux Boot Sequence
description: 'The modern Linux boot path from UEFI or BIOS through the bootloader, kernel, initramfs, systemd, and service targets.'
sidebar_position: 11
keywords:
  - linux boot
  - uefi
  - bootloader
  - initramfs
  - systemd
---

Boot is a chain of trust and responsibility. Each stage establishes enough hardware and software state to load the next
one. Modern machines commonly use UEFI and GPT; legacy BIOS and MBR systems still exist, so diagnose the machine that is
actually in front of you.

## 1. Firmware

UEFI or legacy BIOS performs early hardware initialization and chooses a boot entry. UEFI can read an EFI System
Partition and launch an EFI executable directly. With Secure Boot, firmware verifies signatures according to the
configured trust policy.

Useful evidence includes firmware boot settings, the selected disk, Secure Boot state, and UEFI boot variables exposed by
<code>efibootmgr</code> when available.

## 2. Bootloader or unified kernel image

A bootloader such as GRUB selects a kernel and supplies the kernel command line. Some systems instead boot a unified
kernel image containing the kernel, initramfs, command line, and metadata in one signed EFI executable.

If this stage fails, investigate the firmware entry, EFI System Partition, bootloader configuration, disk identifiers,
and signatures—not systemd services, which have not started yet.

## 3. Kernel initialization

The kernel:

- decompresses and initializes itself;
- discovers CPUs, memory, and built-in drivers;
- parses the kernel command line;
- initializes core subsystems;
- mounts the initramfs as an early root filesystem;
- starts the first userspace program.

The kernel ring buffer is available through <code>dmesg</code> and the journal when boot progresses far enough.

## 4. initramfs and the real root filesystem

The initramfs contains early userspace tools and drivers required before the real root filesystem is available. It may
assemble RAID, unlock encrypted storage, activate LVM, load storage modules, and discover the root device.

It then mounts the real root filesystem and switches into it. A failure here often means a missing driver, changed disk
identifier, damaged filesystem, incorrect kernel command line, or unavailable encrypted-storage configuration.

## 5. PID 1 and systemd

The kernel starts PID 1, commonly systemd. systemd resolves unit dependencies and moves the machine toward a target such
as <code>multi-user.target</code> or <code>graphical.target</code>. Units may run in parallel when their dependencies
allow it; this is not the old linear runlevel model.

~~~bash
systemd-analyze
systemd-analyze critical-chain
systemctl --failed
journalctl -b
journalctl -b -1
~~~

The last command inspects the previous boot when persistent journal storage is enabled.

## Diagnose by stage

| Last visible stage | Likely evidence |
| --- | --- |
| Firmware cannot find a boot entry | Firmware UI, UEFI variables, EFI System Partition |
| Bootloader appears but kernel does not start | Bootloader configuration, kernel path, signatures, kernel command line |
| Kernel starts but cannot mount root | Kernel log, initramfs shell, storage drivers, root UUID |
| Emergency mode after switching root | Filesystem checks, mount units, <code>/etc/fstab</code>, failed units |
| Login appears but application is unavailable | Service status, service journal, sockets, dependencies |

Keep a known-good kernel and a recovery route for production hosts. Test changes to bootloader, initramfs, disk layout,
and encryption as recovery procedures, not only as deployment procedures.

Continue with [systemd services](/linux/services-systemd/), [filesystems](/linux/file-system/), and
[observability](/linux/observability/).

## References

- [Linux kernel parameters](https://www.kernel.org/doc/html/latest/admin-guide/kernel-parameters.html)
- [systemd bootup documentation](https://www.freedesktop.org/software/systemd/man/latest/bootup.html)
- [systemd-analyze](https://www.freedesktop.org/software/systemd/man/latest/systemd-analyze.html)
