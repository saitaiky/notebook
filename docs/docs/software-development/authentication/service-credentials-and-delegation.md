---
title: "Service Credentials & Delegation"
description: "Direct service credentials, when to use them, trade-offs, and how they compare to delegated token exchange."
---

# Service Credentials & Delegation

## What are service credentials?

A **service credential** (also called a service account credential or API key) is a static pair of identifiers that one service uses to authenticate to another:

```
client_id: app-12345
client_secret: supersecret-key
```

Example: Your Platform holds a credential pair for the Third-Party API. When you need to call the Third-Party, you present this credential.

## Service credential flow

```
1. Platform holds: client_id:client_secret for Third-Party
2. Platform needs to call Third-Party API
3. Platform sends: Authorization: Basic base64(client_id:client_secret)
4. Third-Party validates the credential
5. Third-Party processes the request
```

Or, in an OAuth context:

```
POST /token HTTP/1.1
Host: third-party.com

grant_type=client_credentials
&client_id=app-12345
&client_secret=supersecret-key
```

Response:
```json
{
  "access_token": "token_...",
  "token_type": "Bearer"
}
```

Platform then calls APIs with the token.

## Pros and cons

| Aspect | Service Credential | On-Behalf-Of (OBO) |
|--------|-------------------|-----------------|
| **Setup complexity** | Low — just exchange a static secret | Medium — requires both services to trust same IdP |
| **Entitlement enforcement** | Third-Party controls what credential can do (fixed per credential) | User identity flows through; Third-Party enforces per-user entitlements |
| **Per-user auditability** | Hard — all requests under one service account | Easy — each request carries the authenticated user's identity |
| **Secret rotation** | Must rotate credentials periodically | IdP handles token expiry; no long-lived secrets |
| **Cost/licensing** | Third-Party may charge per service account | Third-Party charges per user or per request; may be more expensive at scale |
| **User identity on Third-Party side** | No — just "Platform service account" | Yes — Third-Party sees who the user is |

## When to use service credentials

**Good fit:**
- Third-Party doesn't support OBO or federated identity
- You have a simple machine-to-machine workflow with no per-user entitlements
- Third-Party charges per service account anyway
- Quick proof-of-concept before building OBO

**Poor fit:**
- You need to track which user made which request
- Third-Party enforces per-user quotas or licensing
- You need to respect per-user access controls

## When to use OBO

**Good fit:**
- User identity matters for auditability
- Third-Party enforces per-user entitlements
- Both services trust the same IdP (e.g., both Azure AD)
- You want to scale to many users without creating N service accounts

**Poor fit:**
- Third-Party doesn't support OIDC or token exchange
- You don't have a shared IdP
- You need immediate results (setting up federation takes time)

## Hybrid approach

Many teams start with service credentials for a proof-of-concept:

1. **Phase 1 (PoC):** Use service credential, prove the integration works
2. **Phase 2 (Production):** Plan OBO migration, set up federation
3. **Phase 3 (Scaling):** Switch to OBO for per-user entitlements and auditability

This is practical: you can unblock work immediately while planning the more robust long-term solution.

## Service credential security best practices

If you use service credentials:

1. **Never hardcode secrets** — use environment variables, secrets vaults, or key management services
2. **Rotate regularly** — most providers recommend every 90 days
3. **Audit usage** — log every API call made with the credential
4. **Limit scope** — if possible, request read-only access or API-specific credentials
5. **Monitor for leaks** — watch logs for unexpected authentication failures (may indicate a leaked secret)

## Next: real-world decisions

See the blog post on [Authentication Patterns for AI Bridging Agents](/blog/2024/08/04/auth-bridging-agents) for a case study comparing these approaches in a production scenario.
