---
title: "On-Behalf-Of (OBO) Flow & Token Exchange"
description: "How services perform delegated token exchange to call downstream APIs on behalf of an authenticated user."
---

# On-Behalf-Of (OBO) Flow & Token Exchange

## The problem: service-to-service on behalf of a user

Imagine this architecture:

```
User
  ↓ (authenticate & call API)
Enterprise Platform
  ↓ (needs to call third-party service on user's behalf)
Third-Party Service
```

The user authenticates to the Enterprise Platform. The Platform now needs to call a Third-Party Service, and it wants to:
1. Prove it has permission from the user to do so
2. Tell the Third-Party Service *who* the user is
3. NOT pass the user's raw credentials to the third party

**On-Behalf-Of (OBO)** is a token exchange flow that solves this.

## How OBO works

```
1. User authenticates to Enterprise Platform
   → Platform receives: token_A (scoped to Platform's app ID)

2. Platform says to its IdP: "Exchange this token for one scoped to Third-Party Service"
   Request: "I have token_A (from User). Can I have token_B scoped to Third-Party?"

3. IdP validates:
   - Is token_A authentic and not expired?
   - Is Platform allowed to exchange tokens?
   - Does Platform have permission to act on behalf of this user?

4. IdP returns: token_B (same user identity, scoped to Third-Party Service app ID)

5. Platform calls Third-Party Service with token_B
   → Third-Party validates token_B and sees the user's identity inside
```

## Key insight: two independent authentication legs

This is often called **two-hop OBO**:

**Leg 1 (User → Platform):**
- User authenticates to the Platform
- Platform receives token_A with audience = Platform's app ID

**Leg 2 (Platform → Third-Party):**
- Platform exchanges token_A for token_B
- Platform calls Third-Party with token_B (audience = Third-Party's app ID)

These two legs are **completely independent**. Getting Leg 1 to work requires nothing from the Third-Party.

## OAuth 2.0 JWT Bearer Token Exchange (RFC 8693)

The formal name for OBO is **JWT Bearer Token Exchange**. The exchange looks like:

```
POST /token HTTP/1.1
Host: login.microsoftonline.com

grant_type=urn:ietf:params:oauth:grant-type:token-exchange
&client_id=platform-app-id
&client_secret=platform-secret
&assertion=token_A
&requested_token_use=on_behalf_of
&requested_audience=third-party-app-id
```

Response:
```json
{
  "access_token": "token_B_...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

The Platform then uses `token_B` to call Third-Party APIs:
```
Authorization: Bearer token_B
```

## Token contents matter

When the IdP creates token_B, it carries:

```json
{
  "iss": "https://login.microsoftonline.com/tenant-id",
  "sub": "user-object-id",
  "oid": "user-object-id",
  "upn": "user@company.com",
  "tid": "tenant-id",
  "aud": "third-party-app-id",
  "scope": "api://third-party-app-id/.default"
}
```

Notice:
- **Same user identity** (sub, oid, upn) — the Third-Party knows who the user is
- **Different audience** (aud) — the token is scoped to Third-Party, not the Platform
- **Same tenant** (tid) — both Platform and Third-Party trust the same IdP

## Entitlement enforcement

OBO does **not** automatically enforce user entitlements. Each service is responsible:

- **Platform** can decide: "This user is in group 'advanced-users', so they can use this feature"
- **Third-Party** can decide: "Users need subscription tier 'Professional' to use this API" or "This API call counts against the customer's quota"

The token carries the user's identity and claims, but the Third-Party still controls what that user can *do*.

## When OBO is NOT the answer

**Scenario:** You have a service account (not a user) that needs to call another API. Example:

```
Scheduled Job → Third-Party Monitoring API
```

There's no user here, so OBO doesn't apply. Instead, use **service-to-service authentication** (see [Service Credentials & Delegation](./service-credentials-and-delegation.md)).

## Next: practical application

For a real-world example of OBO in a bridging agent architecture, see the blog post on [Authentication Patterns for AI Bridging Agents](/blog/2024/08/04/auth-bridging-agents).
