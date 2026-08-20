---
title: Services and systemd
description: 'How systemd units start, supervise, restart, secure, and expose the logs of long-running Linux services.'
sidebar_position: 12
keywords:
  - systemd
  - linux services
  - systemctl
  - journalctl
  - service supervision
---

On many current Linux distributions, systemd is both the init system and a service manager. It expresses machine state as
units and their dependencies rather than as one linear startup script. Service units describe long-running processes;
socket, timer, mount, path, and target units describe other activation and coordination points.

## Inspect before changing

~~~bash
systemctl status example.service
systemctl show example.service
systemctl cat example.service
systemctl list-dependencies example.service
journalctl -u example.service --since today
~~~

<code>status</code> is a summary. <code>show</code> exposes machine-readable properties, while <code>cat</code> shows
the effective unit and drop-ins. Logs should be read together with the exit status and restart history.

## A minimal service

~~~ini
[Unit]
Description=Example API
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=example
Group=example
WorkingDirectory=/opt/example
ExecStart=/opt/example/bin/server
Restart=on-failure
RestartSec=5s
TimeoutStopSec=30s

[Install]
WantedBy=multi-user.target
~~~

After editing a unit, run <code>systemctl daemon-reload</code>. Enabling a unit configures activation for future boots;
starting it changes current runtime state. <code>systemctl enable --now example.service</code> requests both.

## Shutdown is an application feature

systemd normally sends SIGTERM, waits for <code>TimeoutStopSec</code>, and can then force termination. The application
must stop accepting work, finish or safely abandon in-flight operations, release leases, and exit before the deadline.
The same contract appears in container orchestrators.

## Reliability and security

Use restart policies for transient failures, not to conceal a deterministic crash loop. Add resource and security
controls deliberately:

- <code>MemoryMax</code> and <code>CPUQuota</code> create cgroup limits.
- <code>NoNewPrivileges</code>, <code>PrivateTmp</code>, filesystem protections, and Linux capabilities can reduce the
  service's authority.
- Credentials should come from an appropriate secret mechanism, not from world-readable unit files or command arguments.

Run <code>systemd-analyze security example.service</code> as a review aid, then assess each recommendation against the
service's actual requirements.

Continue with [boot](/linux/loading-sequence/), [processes](/linux/process/), and
[observability](/linux/observability/). On AWS, [Systems Manager](/aws/management/ssm/) and container services move parts
of this operating responsibility into managed control planes.

## References

- [systemd service documentation](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html)
- [systemd execution environment](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html)
