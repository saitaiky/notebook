---
title: Linux Networking for Application Engineers
description: 'A layer-by-layer workflow for diagnosing DNS, routing, listening sockets, TCP connections, and firewall failures on Linux.'
sidebar_position: 9
keywords:
  - linux networking
  - dns
  - routing
  - sockets
  - tcp
  - troubleshooting
---

Most "network problems" are failures at one of several boundaries: name resolution, routing, packet filtering, a listening
socket, transport establishment, TLS, or the application protocol. Diagnose those boundaries in order.

## A request path

1. DNS resolves a name to an address.
2. The routing table chooses an interface and next hop.
3. Local and network policy permit the traffic.
4. A server process has a socket bound to the expected address and port.
5. TCP or UDP carries the exchange.
6. TLS and the application protocol complete above the transport.

## Questions and commands

| Question | Commands |
| --- | --- |
| What address does the name resolve to? | <code>getent hosts NAME</code>, <code>dig NAME</code> |
| Which route will Linux use? | <code>ip route get ADDRESS</code> |
| Which interfaces and addresses exist? | <code>ip address</code>, <code>ip link</code> |
| Is a process listening? | <code>ss -lntup</code> |
| What connections exist? | <code>ss -ntp</code> |
| Can I reach the TCP service? | <code>nc -vz HOST PORT</code> |
| Does HTTP/TLS work? | <code>curl -v https://HOST/</code> |
| What packets cross the interface? | <code>tcpdump -ni INTERFACE</code> |

Prefer <code>ss</code> and <code>ip</code> on modern systems. A successful ping does not prove that a TCP port, TLS
handshake, or application request will succeed; ICMP may also be filtered independently.

## Binding mistakes

A process listening on <code>127.0.0.1</code> accepts only local IPv4 connections. Listening on
<code>0.0.0.0</code> makes it reachable on all local IPv4 addresses, subject to firewall and network policy. In
containers, also distinguish the container network namespace from the host and verify published ports or service routing.

## Cloud mapping

Linux tools show the host's view. AWS adds route tables, security groups, network ACLs, load balancers, private DNS, and
service-specific policy. Work from both ends:

- [VPC networking](/aws/networking/vpc/) supplies addresses and routes.
- [Private-access patterns](/aws/networking/private-access-comparison/) determine how traffic reaches services.
- [Elastic Load Balancing](/aws/networking/elb/) adds listener, target, and health-check boundaries.
- [ECS](/aws/compute/ecs-ecr/) and [EKS](/aws/development/eks/) add container and orchestration networking.

The fastest diagnosis identifies the first boundary that fails instead of changing several firewalls at once.

## References

- [Linux network device documentation](https://www.kernel.org/doc/html/latest/networking/index.html)
- [socket(7) Linux manual page](https://man7.org/linux/man-pages/man7/socket.7.html)
