---
title: "OAuth 2.0 & OpenID Connect (OIDC)"
description: "The difference between authorization and authentication, and how OAuth and OIDC solve different problems."
---

# OAuth 2.0 & OpenID Connect (OIDC)

## The confusion: OAuth vs authentication

**OAuth 2.0** is *not* an authentication protocol — it's an **authorization protocol**. It lets you delegate access to your resources without sharing your password.

**OpenID Connect (OIDC)** is a layer *on top of* OAuth 2.0 that adds **authentication**.

### What's the difference?

**Authorization:** "Can this person access this resource?" (e.g., can they read your files?)

**Authentication:** "Who is this person?" (e.g., is this really Jane Smith?)

## OAuth 2.0 authorization flow

Typical scenario: you want to let an app access your Google Drive without sharing your Google password.

```
1. You click "Connect with Google" in the third-party app
2. You are redirected to Google's login page
3. You authenticate to Google (username + password)
4. Google asks: "App XYZ wants access to your Drive. Allow?"
5. You click "Allow"
6. Google redirects you back to App XYZ with an access token
7. App XYZ uses that token to call Google Drive APIs on your behalf
```

The third-party app never sees your Google password. It only gets a token that lets it access your files.

### Key OAuth terms

| Term | Meaning |
|------|---------|
| **Resource owner** | You (the person whose data is being accessed) |
| **Client** | The third-party app requesting access |
| **Authorization server** | The IdP (e.g., Google) that issues tokens |
| **Resource server** | The API hosting your data (often the same company as the auth server) |
| **Access token** | A credential the client uses to call APIs on your behalf |
| **Scope** | Permission limits (e.g., `drive.readonly` means read-only access to Drive) |
| **Redirect URI** | Where the auth server sends you back after you approve |

## OpenID Connect (OIDC) — adding authentication

OIDC extends OAuth 2.0 to also answer "who are you?" by adding:

1. **An ID token** — a signed JWT containing identity claims (name, email, profile picture, etc.)
2. **UserInfo endpoint** — an API to fetch the authenticated user's profile
3. **Standardized claims** — a common set of identity attributes all OIDC providers understand

Example OIDC login flow:
```
1. App redirects you to Google's OIDC authorization endpoint
2. You authenticate and consent
3. Google returns an authorization code
4. App exchanges the code for an access token AND an ID token
5. App validates the ID token's signature and reads your identity
6. App is now certain you are who you claim to be
```

The **access token** is used to call APIs (`scope: drive.readonly`).
The **ID token** proves your identity (`scope: openid`).

## When to use OAuth 2.0 vs OIDC

| Scenario | Use |
|----------|-----|
| "I want this app to access my photos on Flickr" | OAuth 2.0 (authorization only) |
| "I want to log into an app using my Google account" | OIDC (authentication + authorization) |
| "I want this service to call another API on my behalf" | OAuth 2.0 + On-Behalf-Of (see next section) |

## Common confusion

People often say "OAuth login" but technically mean "OIDC login". OIDC is OAuth 2.0 + authentication layer.

Most modern IdPs (Google, Microsoft Azure AD, Okta) support both:
- **OAuth 2.0 scopes** for authorization (e.g., `Mail.Read`, `Files.ReadWrite`)
- **OIDC scopes** for authentication (e.g., `openid`, `profile`, `email`)

## Next: delegated authorization

If you need *this service* to call *another service* on behalf of the authenticated user, that's a different problem. See [On-Behalf-Of (OBO) Flow](./obo-token-exchange.md).
