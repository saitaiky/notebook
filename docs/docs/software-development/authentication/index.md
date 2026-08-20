---
title: "Authentication & Identity"
description: "Foundational concepts and patterns for authentication, identity providers, OAuth, and token-based authorization."
sidebar_position: 0
---

# Authentication & Identity

This section covers core concepts in modern authentication and identity management, from foundational OAuth flows to enterprise federated identity patterns.

## Topics

- **[Identity Providers (IdP)](/software-development/authentication/idp-basics/)** — What they are, how they work, and why enterprises use them
- **[OAuth 2.0 & OpenID Connect](/software-development/authentication/oauth-and-oidc/)** — Authorization vs authentication, and when to use each
- **[On-Behalf-Of (OBO) Flow](/software-development/authentication/obo-token-exchange/)** — Delegated token exchange for service-to-service calls
- **[Service Credentials & Token Exchange](/software-development/authentication/service-credentials-and-delegation/)** — When to use direct credentials vs delegated tokens

## Use Cases

These patterns are essential for:
- Building AI agents that bridge enterprise platforms with external APIs
- Implementing secure service-to-service communication
- Federating identity across multiple systems
- Enforcing entitlements in multi-tenant architectures

If you're building a bridging agent that sits between an enterprise platform and a third-party service, start with the
**[On-Behalf-Of (OBO) Flow](/software-development/authentication/obo-token-exchange/)** and then read the
**[practical case study](/blog/2024/08/04/auth-bridging-agents/)**.

## Linux and AWS implementations

Linux represents local identity as [POSIX users and groups](/linux/posix-user/) and enforces file-level authority through
[UID, GID, and permission bits](/linux/uid-gid-stickbit/). AWS applies related least-privilege ideas through
[IAM policies and roles](/aws/management/iam/), [role assumption](/aws/security/assume-role/), and
[Cognito](/aws/management/cognito/) for application identity. Keep the distinction clear: an operating-system account,
an AWS principal, and an end-user identity are separate security boundaries even when one is mapped to another.
