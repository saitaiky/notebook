---
title: "Authentication Patterns for AI Bridging Agents: A Practical Guide to Token Exchange"
description: "Real-world guidance on connecting enterprise platforms to external APIs through AI agents, covering service credentials, token exchange, and federated identity approaches."
tags: [authentication, oauth, obo, token-exchange, ai-agents, enterprise-integration, bridging-agents]
---

# Authentication Patterns for AI Bridging Agents: A Practical Guide to Token Exchange

Building an AI agent that sits between an enterprise platform and a third-party API service forces you to think clearly about authentication. You're not just authenticating a user; you're orchestrating credentials across two completely separate authentication contexts. This post shares what I learned integrating an enterprise AI platform with an external API service, focusing on what works today and what aspirations are worth planning for.

<!-- truncate -->

## The problem: bridging two authentication worlds

Imagine this architecture:

```
User
 ↓ (authenticates to Enterprise Platform)
Enterprise Platform
 ↓ (AI agent needs to call Third-Party Service)
Third-Party Service
```

The user authenticates to your Enterprise Platform and expects the AI agent to work seamlessly. But the Third-Party Service has its own authentication model, possibly its own entitlements system, and no prior relationship with your Platform.

You now have two questions:
1. **How does the Platform prove to the Third-Party that it's authorized to make this call?**
2. **Should the Third-Party know who the user is, or just that the Platform is making a request?**

## The two-hop architecture: two independent authentication legs

The key insight is that authentication has **two independent legs**:

**Leg 1 (User → Enterprise Platform):**
- The user authenticates to the Platform (e.g., Azure AD)
- The Platform receives a token from its IdP, scoped to the Platform's app registration
- The Platform validates this token and knows who the user is

**Leg 2 (Platform → Third-Party Service):**
- The Platform needs to call the Third-Party Service
- This requires separate authentication with the Third-Party
- The Third-Party doesn't care about Leg 1; it only cares about Leg 2

The critical point: **these legs are completely independent**. You can build Leg 1 and have it working perfectly without any changes from the Third-Party. Leg 2 is purely a Platform ↔ Third-Party problem.

```
User ─┐
      ├─ (Leg 1) ─ Enterprise Platform
                   └─ (Leg 2) ─ Third-Party Service
```

### Why this matters

Many teams make this mistake: they wait for the Third-Party to make changes before they can get Leg 1 working. **Don't do that.** Build Leg 1 first, verify it works, then tackle Leg 2 with the Third-Party.

## Approach A: Service credentials (works today)

The simplest, most reliable approach: the Platform holds a service credential (client_id + client_secret) for the Third-Party API.

```
Platform's credential store: 
  - client_id: "platform-app-12345"
  - client_secret: "supersecret-key-xyz"

When Platform needs to call Third-Party:
  1. Retrieve the stored credential
  2. Call Third-Party with: client_credentials grant
  3. Third-Party validates and returns an access token
  4. Platform calls Third-Party APIs with the token
```

### Pros

- **Third-Party needs no changes** — this works today, with any existing Third-Party API
- **Proof-of-concept fast** — integrate and test within hours
- **Straightforward debugging** — when something breaks, there are fewer moving parts
- **Works for service-to-service** — doesn't require special IdP support

### Cons

- **No user identity forwarding** — the Third-Party sees "Platform service account" as the caller, not the actual user
- **Entitlements are account-wide** — if your Platform's credential has access to "Detection tier" features, all users get that level
- **Audit trail is murky** — hard to track which user caused which Third-Party API call
- **Credential rotation management** — periodic rotation required, adds operational work
- **Scaling entitlements is hard** — to give different users different levels of Third-Party access, you need multiple Platform service accounts

### When to use Approach A

**Start here.** This is the right choice for:
- Any proof-of-concept
- When you need to unblock work immediately
- When Third-Party entitlements are service-wide (not per-user)
- When audit/compliance doesn't require per-user request tracking
- When the Third-Party doesn't support federated identity

## Approach B: Token exchange endpoint (not built yet)

During integration, I asked the Third-Party: "Do you have a `/token` endpoint that accepts an Azure AD OBO token and exchanges it for a Third-Party token?"

Answer: **404**. The endpoint doesn't exist — not even partially built.

This would be a hybrid approach:
1. Platform holds the user's Azure AD token
2. Platform calls Third-Party's `/token/exchange` endpoint with the Azure AD token
3. Third-Party's backend validates the Azure AD token with Azure AD, then returns a Platform-scoped token
4. Platform uses that token to call Third-Party APIs

**Pros:** User identity flows through; Third-Party can enforce per-user entitlements.

**Status:** Not built, and not on the Third-Party's roadmap for the near term. Including it here for completeness — this might be an option with other vendors.

## Approach C: Second OBO hop / federated identity (aspirational, but has tricky nuances)

The most sophisticated approach: the Platform performs a *second* OBO exchange, converting the user's enterprise token into a token scoped to the Third-Party's Azure AD app registration.

```
User
  ↓
Azure AD (Enterprise tenant)
  ↓ (issues token for Platform app)
Platform
  ↓ (exchanges for token scoped to Third-Party app — second OBO)
Azure AD (same cloud, but Third-Party app registration)
  ↓ (issues token scoped to Third-Party)
Third-Party API
  ↓ (validates the token natively, sees user identity)
```

This would mean:
- **True user identity forwarding** — Third-Party API sees exactly who is making the request
- **Native token validation** — Third-Party validates the token directly with Azure AD (no custom exchange endpoint needed)
- **Per-user entitlements** — Third-Party can enforce access controls per user

### The catch: SSO portal ≠ API token validation

Here's the critical nuance I discovered: **seeing an SSO login page at the Third-Party's portal does NOT mean their API validates machine-to-machine OBO tokens.**

These are two different capabilities:

| Capability | What it means | How to verify |
|------------|------------------|-----------|
| **SSO login page** | "Sign in with Azure AD" button works for interactive human login | Try logging into the Third-Party portal with Azure AD |
| **API token validation** | The API accepts Bearer tokens from Azure AD via OBO | Ask: "Can your API validate a Bearer token from an Azure AD OBO exchange?" |

The Third-Party might have the first and not the second. Most vendors who've invested in modern identity don't yet validate machine-to-machine forwarded OBO tokens.

### When Approach C becomes worth pursuing

Only pursue this if:
1. **Third-Party confirms** they validate machine-to-machine OBO tokens (not just interactive SSO)
2. **You need per-user entitlements** — different users need different access levels
3. **You're at scale** — managing N service accounts per entitlement tier becomes unwieldy
4. **Compliance/audit requires it** — you must track individual users' API calls

For most PoCs and initial rollouts, **start with Approach A** and revisit this later.

## Practical checklist: questions to ask the Third-Party

Before you start integration, ask these questions:

**Authentication:**
- [ ] Do you support OAuth 2.0 client credentials flow?
- [ ] Do you have an API token endpoint we can call?
- [ ] What's the standard way to authenticate API requests? (Bearer token, API key, custom header, etc.)

**Identity forwarding (if you want per-user entitlements):**
- [ ] Do you accept Azure AD tokens?
- [ ] Can your API validate Bearer tokens from Azure AD?
- [ ] If not, do you have a `/token/exchange` endpoint for token conversion?

**Entitlements:**
- [ ] How do you enforce entitlements? (per account, per user, per subscription tier, etc.)
- [ ] If we need multiple users to have different access levels, how would that work?
- [ ] Are there quotas or rate limits? Are they per credential, per user, or per account?

**MCP (if using Model Context Protocol):**
- [ ] Does your MCP server support HTTP+SSE transport?
- [ ] What content-type headers should MCP clients send? (should be `Accept: application/json, text/event-stream`)

**Support & Debugging:**
- [ ] Do you provide request/response logging or API audit trails?
- [ ] What does an authentication error look like? (status code, error message format)

## MCP transport detail worth noting

If you're using the Model Context Protocol (MCP) to communicate with the Third-Party, remember:

**MCP uses HTTP+SSE (Server-Sent Events), not plain JSON RPC over HTTP.**

Many developers assume MCP is a simple request-response JSON API. It's not. Clients must send:
```
Accept: application/json, text/event-stream
```

This is easy to miss if you're building a minimal HTTP client. If your MCP requests aren't working, check the Accept header first.

## Entitlement model reality

Here's something to verify with the Third-Party early: **entitlements are usually determined by the credential/account tier, not by the request.**

Example: the Third-Party offers a "Detection API" at different tiers:
- Starter tier: 100 requests/day
- Professional tier: 10,000 requests/day, access to advanced features
- Enterprise tier: unlimited, custom features

When your Platform's service account (Approach A) calls the API, the Third-Party checks: "What tier is this account?" The tier is *fixed* per credential. If your account is Starter tier, every request you make is Starter tier, even if you ask nicely.

**This means:** if you need different users to have different tiers of access, you either:
1. Create multiple Platform service accounts, each with a different tier (Approach A variant)
2. Pursue federated identity so the Third-Party can enforce per-user tiers (Approach C)

## Roadmap: start with Approach A, plan for Approach C

Here's my recommended phasing:

**Phase 1 (Now):** Use Approach A (service credentials)
- Prove the integration works
- Understand entitlements and quotas in practice
- Build the Platform's Leg 1 (user auth to Platform) independently

**Phase 2 (Months ahead):** Plan with the Third-Party
- Ask whether they support API-level OBO token validation
- If yes, design the token exchange
- If no, accept that Approach A is the long-term solution or wait for improvements

**Phase 3 (Later):** Migrate to Approach C if justified
- By this point, you'll know whether per-user entitlements matter
- You'll have real usage data to inform the cost/benefit decision
- Third-Party support will likely be better

## Common mistakes to avoid

1. **Waiting for Third-Party changes before building Leg 1** — build user auth independently first
2. **Assuming SSO login = API token support** — verify explicitly
3. **Hardcoding service credentials** — use a secrets vault from day one
4. **Trusting one person's understanding** — ask the Third-Party multiple times, in writing, about OBO support
5. **Over-engineering the token exchange** — start simple, iterate based on real requirements

## Conclusion

Building a bridging agent that connects an enterprise platform to an external API is manageable once you separate the problem into two independent authentication legs. Start with service credentials (Approach A), prove the integration works, and then revisit federated identity (Approach C) only if your entitlement model requires it.

The key is clear communication with the Third-Party about what they actually support — not what you assume they support.
