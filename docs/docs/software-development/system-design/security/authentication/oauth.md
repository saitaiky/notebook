---
title: OAuth Architecture Review
description: 'A threat-boundary and production-readiness checklist for architects reviewing OAuth 2.0 and OpenID Connect integrations.'
keywords:
  - oauth architecture
  - oidc security
  - token validation
  - trust boundary
  - threat modelling
---

Start with [OAuth 2.0 and OpenID Connect foundations](/software-development/authentication/oauth-and-oidc/). This page
uses that protocol model to review a production architecture; it does not duplicate the introductory flow.

## Draw the trust boundaries

Identify these components explicitly:

- user agent;
- client frontend and backend;
- authorization server or OpenID Provider;
- token endpoint;
- resource servers;
- session store and token cache;
- external identity providers;
- logs, analytics, and support tooling that might receive sensitive values.

For each token, record its issuer, intended audience, holder, storage location, transport, lifetime, validation rules, and
revocation or expiry behaviour. "It is a JWT" is a representation detail, not a trust decision.

## Review the client type

Public clients cannot keep a static secret because users control the execution environment. Browser applications, mobile
apps, and installed applications therefore need PKCE and platform-appropriate redirect handling. Confidential clients can
authenticate at the token endpoint, but a shared secret is not proof that every incoming browser redirect is legitimate.

Where practical, prefer asymmetric client authentication or sender-constrained tokens to reduce the impact of a leaked
shared credential or bearer token.

## Review the redirect flow

Check that:

- redirect URIs use exact matching and cannot forward to an arbitrary destination;
- Authorization Code with PKCE S256 is used;
- the client verifies transaction binding with PKCE and, where applicable, state or OIDC nonce;
- authorization codes are short-lived and single use;
- tokens are returned from the token endpoint, not exposed in redirect URLs;
- issuer identification prevents authorization-server mix-up when more than one issuer is supported.

The browser-mediated authorization request and response are commonly described as the front channel. The client-to-token
endpoint exchange is a direct back-channel request. JavaScript executing inside the browser remains exposed to the browser
security model and should not be treated as a confidential backend merely because it calls an HTTPS endpoint.

## Review token handling

Resource servers should validate tokens for themselves, not accept a token merely because another service accepted it.
Verify issuer, audience/resource, expiry, signature or introspection result, and the authorization claims used by the API.
Do not use an OIDC ID Token to authorize an API.

For refresh tokens, consider rotation, replay detection, revocation, logout semantics, and compromise recovery. For access
tokens, consider whether bearer semantics are sufficient or whether mTLS or DPoP sender-constraining is justified.

## Review authorization

OAuth scopes are only one input to authorization. Confirm:

- how application roles and resource ownership are evaluated;
- whether tenant boundaries are enforced independently of user-supplied identifiers;
- where policy decisions are made and logged;
- whether delegated and application-only access are distinguishable;
- how privileged consent and service credentials are governed.

## Failure and operations

Design for key rotation, issuer outage, clock skew, token endpoint throttling, stale metadata, revoked sessions, and partial
dependency failure. Monitor failed validation by reason without logging tokens. A break-glass procedure should not bypass
tenant boundaries or turn a transient identity outage into permanent broad access.

## Primary references

- [OAuth 2.0 Security Best Current Practice, RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [OAuth 2.0 Authorization Server Issuer Identification, RFC 9207](https://www.rfc-editor.org/rfc/rfc9207.html)
- [OAuth 2.0 Demonstrating Proof of Possession, RFC 9449](https://www.rfc-editor.org/rfc/rfc9449.html)
