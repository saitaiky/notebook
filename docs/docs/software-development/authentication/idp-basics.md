---
title: "Identity Providers (IdP)"
description: "Understanding identity providers, their role in centralized authentication, and how they fit into modern applications."
---

# Identity Providers (IdP)

An Identity Provider is a system that authenticates users and issues credentials that prove their identity to other applications.

## What does an IdP do?

An IdP handles three core functions:

1. **Authentication** — verifies who you are (username, password, MFA, etc.)
2. **Credential issuance** — creates a token or assertion that represents your authenticated identity
3. **Identity information** — provides attributes about you (name, email, roles, groups, etc.)

The application or service you're trying to access then trusts the IdP's credential and makes authorization decisions based on it.

## Common examples

- **Azure Active Directory (Azure AD)** — Microsoft's enterprise identity provider, widely used for employee and B2B authentication
- **Okta** — standalone enterprise IdP popular in SaaS companies
- **Google Accounts** — consumer/federation IdP for applications that support "Sign in with Google"
- **GitHub** — developer-focused IdP used for third-party app authorization
- **SAML-based identity federations** — common in enterprises for federated single sign-on (SSO)

## Key concepts

### Tokens and Claims

When you authenticate with an IdP, you receive a token (e.g., a JWT) that contains **claims** — statements about your identity:

```json
{
  "iss": "https://login.microsoftonline.com/tenant-id",
  "sub": "user-object-id",
  "oid": "user-object-id",
  "upn": "user@company.com",
  "roles": ["admin", "developer"],
  "tid": "tenant-id",
  "aud": "app-id"
}
```

The application validates the token's signature (to ensure the IdP really issued it) and then trusts the claims inside.

### Audience (aud)

The **audience** claim specifies which application(s) a token is intended for. A token issued for application A should not be accepted by application B. This prevents token misuse.

Example:
- Azure AD issues a token with `aud = "app-id-of-my-service"`.
- If you try to use that token to call a different service expecting `aud = "different-app-id"`, that service rejects it.

### Tenant

Many enterprise IdPs are **multi-tenant** — they serve multiple organizations independently. Each organization has:
- A separate tenant ID (`tid`)
- Separate user directories
- Separate security policies

Example: Azure AD serves thousands of companies. Company A's Azure AD tenant is completely isolated from Company B's.

## Why enterprises use IdPs

1. **Centralized control** — one place to manage who has access to what
2. **Single sign-on (SSO)** — authenticate once, then access all connected applications
3. **Compliance** — enforce MFA, password policies, and audit trails
4. **Entitlement management** — groups, roles, and permissions managed in one place
5. **Federated identity** — allow employees and partners from multiple organizations to access systems

## IdP vs authentication within your app

**Building your own auth (not recommended):**
- You manage user storage, password hashing, MFA setup
- Higher security risk; easy to make mistakes
- Hard to support SSO and federated identity

**Using an IdP:**
- The IdP handles the hard problems (secure storage, MFA, threat detection)
- Your app receives a validated token and trusts the claims
- SSO and federation are built in

## Next steps

- **For authorization patterns:** see [OAuth 2.0 & OpenID Connect](./oauth-and-oidc.md)
- **For service-to-service calls:** see [On-Behalf-Of (OBO) Flow](./obo-token-exchange.md)
