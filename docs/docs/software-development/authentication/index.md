---
title: "Authentication & Identity"
description: "Foundational concepts and patterns for authentication, identity providers, OAuth, and token-based authorization."
---

# Authentication & Identity

This section covers core concepts in modern authentication and identity management, from foundational OAuth flows to enterprise federated identity patterns.

## Topics

- **[Identity Providers (IdP)](./idp-basics.md)** — What they are, how they work, and why enterprises use them
- **[OAuth 2.0 & OpenID Connect](./oauth-and-oidc.md)** — Authorization vs authentication, and when to use each
- **[On-Behalf-Of (OBO) Flow](./obo-token-exchange.md)** — Delegated token exchange for service-to-service calls
- **[Service Credentials & Token Exchange](./service-credentials-and-delegation.md)** — When to use direct credentials vs delegated tokens

## Use Cases

These patterns are essential for:
- Building AI agents that bridge enterprise platforms with external APIs
- Implementing secure service-to-service communication
- Federating identity across multiple systems
- Enforcing entitlements in multi-tenant architectures

If you're building a bridging agent that sits between an enterprise platform and a third-party service, start with the **[On-Behalf-Of (OBO) Flow](./obo-token-exchange.md)** and then read the **practical case study** in the blog.
