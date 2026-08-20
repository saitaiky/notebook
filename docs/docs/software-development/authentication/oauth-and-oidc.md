---
title: OAuth 2.0 and OpenID Connect
description: 'How OAuth delegates API access, how OpenID Connect authenticates users, and how to implement the authorization-code flow safely.'
keywords:
  - oauth 2.0
  - openid connect
  - oidc
  - pkce
  - authorization code
  - access token
  - id token
---

OAuth 2.0 is an authorization framework: it lets a client obtain limited access to a protected API. OpenID Connect (OIDC)
adds an identity layer so a client can authenticate a user and receive an ID Token.

The practical distinction is:

- **Access token:** presented to a resource server to authorize an API call.
- **ID Token:** validated by the OIDC client as a statement about an authentication event and user.

An API should not accept an ID Token as a substitute for its access token.

## Roles

| Role | Responsibility |
| --- | --- |
| Resource owner | Grants access to protected resources, often an end user |
| Client | Requests authorization and calls the protected API |
| Authorization server / OpenID Provider | Authenticates the user, obtains authorization, and issues tokens |
| Resource server | Hosts the API and validates access tokens |
| User agent | Usually the browser used for redirect-based interaction |

Authentication and authorization are separate decisions. Knowing who a user is does not prove they may perform a
particular action.

## Authorization Code flow with PKCE

For interactive browser and native-app scenarios, the modern baseline is the Authorization Code flow with PKCE:

1. The client creates a high-entropy code verifier and its S256 code challenge.
2. The client sends the user agent to the authorization endpoint with the client ID, exact registered redirect URI,
   requested scope, challenge, and transaction protections.
3. The authorization server authenticates the user and obtains authorization where required.
4. The browser returns to the client with a short-lived authorization code—not an access token.
5. The client sends the code and verifier to the token endpoint over a direct HTTPS connection.
6. The authorization server validates the code, redirect URI, client binding, and PKCE proof, then returns tokens.
7. For OIDC, the client validates the ID Token before creating an application session.

PKCE binds the code exchange to the client instance that began the flow. Public clients must use it; current security
guidance also recommends it for confidential clients. Do not use the implicit grant as the default.

## Validate the right token at the right boundary

An OIDC client validating an ID Token should check at least:

- signature against trusted issuer keys;
- issuer and audience;
- expiration and other time constraints;
- nonce when used;
- any flow-specific requirements.

A resource server validating an access token should check the token mechanism required by its authorization server,
including issuer, audience/resource, expiry, and scopes or claims. Token shape is not universal: access tokens may be JWTs
or opaque references.

## Security checklist

- Register redirect URIs exactly; do not allow open redirectors.
- Use TLS end to end.
- Use Authorization Code with PKCE and S256.
- Use a transaction-bound CSRF defence according to the protocol and provider: PKCE, OIDC nonce, or one-time state as
  applicable.
- Keep client secrets out of browser and native application bundles.
- Request the least scope and shortest useful token lifetime.
- Rotate refresh tokens where supported and handle reuse detection.
- Do not log authorization codes, tokens, client secrets, or sensitive claims.
- Prefer maintained protocol libraries over constructing flows manually.

## Choose the protocol

| Requirement | Starting point |
| --- | --- |
| A client needs delegated access to an API | OAuth 2.0 |
| An application needs user sign-in and identity claims | OIDC using OAuth 2.0 |
| One service calls another as itself | Client Credentials or workload identity, subject to platform policy |
| One service must preserve a user's delegated context | A documented token-exchange or on-behalf-of pattern |

Continue with [service credentials and delegation](/software-development/authentication/service-credentials-and-delegation/),
[on-behalf-of token exchange](/software-development/authentication/obo-token-exchange/), and the
[OAuth architecture review](/software-development/system-design/security/authentication/oauth/).

## Primary references

- [OAuth 2.0 Security Best Current Practice, RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html)
- [OAuth 2.0 Authorization Framework, RFC 6749](https://www.rfc-editor.org/rfc/rfc6749.html)
- [Proof Key for Code Exchange, RFC 7636](https://www.rfc-editor.org/rfc/rfc7636.html)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
