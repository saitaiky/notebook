---
title: Common ports
---

There are 65,535 possible port numbers, although not all are in common use. Some of the most commonly used ports, along with their associated networking protocol, are:

- Ports 20 and 21: File Transfer Protocol (FTP). FTP is for transferring files between a client and a server.
- Port 22: Secure Shell (SSH). SSH is one of many [tunneling](https://www.cloudflare.com/learning/network-layer/what-is-tunneling/) protocols that create secure network connections.
- [Port 25](https://www.cloudflare.com/learning/email-security/smtp-port-25-587/): Historically, [Simple Mail Transfer Protocol (SMTP)](https://www.cloudflare.com/learning/email-security/what-is-smtp/). SMTP is used for [email](https://www.cloudflare.com/learning/email-security/what-is-email/).
- Port 53: [Domain Name System (DNS)](https://www.cloudflare.com/learning/dns/what-is-dns/). DNS is an essential process for the modern Internet; it matches human-readable [domain names](https://www.cloudflare.com/learning/dns/glossary/what-is-a-domain-name/) to machine-readable IP addresses, enabling users to load websites and applications without memorizing a long list of IP addresses.
- Port 80: Hypertext Transfer Protocol (HTTP). HTTP is the protocol that makes the World Wide Web possible.
- Port 123: [Network Time Protocol (NTP)](https://blog.cloudflare.com/secure-time/). NTP allows computer clocks to sync with each other, a process that is essential for [encryption](https://www.cloudflare.com/learning/ssl/what-is-encryption/).
- Port 179: [Border Gateway Protocol (BGP)](https://www.cloudflare.com/learning/security/glossary/what-is-bgp/). BGP is essential for establishing efficient routes between the large networks that make up the Internet (these large networks are called [autonomous systems](https://www.cloudflare.com/learning/network-layer/what-is-an-autonomous-system/)). Autonomous systems use BGP to broadcast which IP addresses they control.
- Port 443: [HTTP Secure (HTTPS)](https://www.cloudflare.com/learning/ssl/what-is-https/). HTTPS is the secure and encrypted version of HTTP. All HTTPS web traffic goes to port 443. Network services that use HTTPS for encryption, such as [DNS over HTTPS](https://www.cloudflare.com/learning/dns/dns-over-tls/), also connect at this port.
- Port 500: Internet Security Association and Key Management Protocol (ISAKMP), which is part of the process of setting up secure [IPsec](https://www.cloudflare.com/learning/network-layer/what-is-ipsec/) connections.
- Port 587: Modern, secure SMTP that uses encryption.
- Port 3389: [Remote Desktop Protocol](https://www.cloudflare.com/learning/access-management/what-is-the-remote-desktop-protocol/) (RDP). RDP enables users to remotely connect to their desktop computers from another device.