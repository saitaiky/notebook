---
title: Linux Package Management
description: 'How Linux repositories, signed metadata, dependencies, low-level package databases, and high-level package managers work.'
sidebar_position: 14
keywords:
  - linux package manager
  - apt
  - dnf
  - rpm
  - dpkg
  - software supply chain
---

A distribution package is an installable unit containing files, metadata, dependencies, and lifecycle scripts. A package
manager resolves compatible versions from configured repositories, verifies repository metadata and packages according
to the distribution's trust model, changes the local package database, and runs required lifecycle actions.

## High-level and low-level tools

| Distribution family | High-level tool | Low-level package tool |
| --- | --- | --- |
| Debian and Ubuntu | <code>apt</code> or <code>apt-get</code> | <code>dpkg</code> |
| Fedora and current Red Hat family | <code>dnf</code> | <code>rpm</code> |
| Arch Linux | <code>pacman</code> | Integrated |

Use the high-level tool for normal installation because it resolves dependencies and uses configured repositories. Use
the low-level tool when inspecting package ownership or performing a deliberate local-package operation.

For interactive Debian-family administration:

~~~bash
sudo apt update
apt search NAME
apt show PACKAGE
sudo apt install PACKAGE
apt list --upgradable
~~~

Use <code>apt-get</code> rather than <code>apt</code> in scripts when its stable scripting interface is required.

## Repositories and trust

Repository configuration declares where package metadata comes from and which distribution suites and components apply.
On Debian-family systems this can include <code>/etc/apt/sources.list</code>,
<code>/etc/apt/sources.list.d/&#42;.list</code>, and deb822 <code>&#42;.sources</code> files.

A successful signature check establishes that metadata came from a trusted signing key and was not modified. It does not
prove that every package is appropriate for your system. Third-party repositories expand the software supply chain and
can replace shared dependencies, so add them deliberately and scope their priority where supported.

## Production practices

- Stay on one coherent distribution release unless a tested pinning strategy says otherwise.
- Apply security updates through a controlled, observable process.
- Test kernel, runtime, database-client, and shared-library updates against the workload.
- Record the intended package set in image definitions or configuration management.
- Keep a rollback or replacement strategy; package downgrade is not always safe.
- Rebuild immutable hosts or images instead of accumulating undocumented manual changes.

## System packages versus project dependencies

System package managers own the host's shared software. Language dependency managers such as npm, pip, Poetry, Bundler,
Maven, and Gradle own application dependencies. Keep those boundaries explicit:

- do not use a project installer to overwrite distribution-owned libraries;
- use project isolation or containers where appropriate;
- commit lockfiles for reproducible application dependency resolution;
- patch both the base image/system packages and application dependencies.

Continue with [lockfiles](/software-development/others/lockfile/),
[Python environments](/software-development/programming/python/pyenv-poetry/), and
[delivery and operations](/software-development/devops/).

## References

- [Debian package-management reference](https://www.debian.org/doc/manuals/debian-reference/ch02.en.html)
- [DNF documentation](https://dnf.readthedocs.io/)
- [Arch Linux pacman guide](https://wiki.archlinux.org/title/Pacman)
