---
title: Enterprise Integration
description: "The entry-point, identity, authorization, data-handling, and observability decisions that determine whether a model integration survives a security review."
sidebar_position: 3
keywords:
  - ai
  - agentic system
  - enterprise integration
  - identity
  - sso
  - authorization
  - data handling
  - pii
  - observability
---

Sizing (see [Feasibility and Use-Case Sizing](/ai/agentic-system/production/feasibility-and-sizing)) says what a system needs to do and whether it can do it within budget. Integration says how it connects to the rest of the enterprise stack — and that connection has five layers, each carrying a decision that belongs to whoever owns the architecture, not to whoever happens to write the integration code first.

## Compliance Comes First

Regulated-industry constraints — privilege, PHI handling, data residency, government-authorization boundaries, and internal residency policy — eliminate entry points and hosting routes *before* any other integration decision gets made. That elimination logic, and the specific constraints, are covered in [Regulated-Industry Constraints That Rule Out Options First](/ai/agentic-system/safeguarding#regulated-industry-constraints-that-rule-out-options-first); this page picks up from wherever that filter leaves you and covers the remaining four layers.

Translate each obligation into a required assurance level before selecting a delivery route. A broad preference such as "keep data local where possible" may constrain architecture without disqualifying every managed route; a contractual residency term makes an approved region mandatory; a statutory or authorization boundary can rule out a product, feature, or route entirely. The obligation level sets the minimum acceptable route, not the other way around.

| Obligation level | Architectural effect | Selection rule |
| --- | --- | --- |
| Internal preference | Influences the preferred route and exceptions process | Choose the preferred route when practical; document any exception |
| Contractual commitment | Creates an enforceable requirement for handling, retention, or residency | Select only configurations that can evidence the commitment |
| Regulatory requirement | Establishes mandatory controls and prohibited handling paths | Eliminate any route that cannot meet every applicable control |
| Formal authorization boundary | Requires a specifically authorized service, region, or delivery route | Verify the exact route and feature scope before design begins |

This ordering prevents a common inversion: choosing a convenient product first and then trying to interpret the obligation so that the product survives. Start with the governing level, derive the route and region constraints, and only then compare the eligible integration options.

## Entry-Point Selection

Which surface the system connects through is the first decision, and it shapes everything downstream.

| Entry point | Use it when | What it trades off |
| --- | --- | --- |
| Direct API | Full control is needed over request construction, response handling, and error management — every part of the system is your own code. | You own retries, streaming, tool orchestration, and error handling yourself; the highest implementation effort of the options here. |
| Language SDK | A convenience layer that handles the HTTP plumbing and gives typed interfaces, while orchestration stays in your own code. | Less granular control than the raw API; an SDK upgrade can occasionally change behavior in ways that deserve a code review before deploying. |
| A developer-facing coding agent | The primary user is a developer and the task is writing, reviewing, or navigating code. | Not designed as a backend for a customer-facing or multi-tenant product — it's built for a single developer's workflow, not for serving many users through one integration. |
| A managed multi-turn agent loop embedded in your app | The system needs to act across multiple turns inside your own product, with your application controlling the surrounding workflow, and building a custom iteration/termination loop isn't worth the effort. | The managed loop trades away fine-grained control over each iteration step; a hand-rolled loop gives that control back at the cost of building and maintaining it. |
| A tool-integration protocol (e.g., MCP) | The same tools or resources need to be reachable from more than one client without duplicating the wiring. | Adds a protocol layer between the model and your tools, which makes debugging a tool call one hop more complex than a direct function call. |

## The Five Integration Layers

| Layer | The architectural decision | What breaks when it's wrong |
| --- | --- | --- |
| Compliance and regulated-industry constraints | Which routes and entry points survive the governing constraint? | The integration is built on a route that fails the next legal or security review, and the redesign cost is the time already invested plus a new architecture from scratch. |
| Identity and SSO | Where does the identity boundary sit relative to the model call? Who is the user, and how does that identity reach the prompt safely? | If identity isn't injected correctly, the system can't scope its responses to what a given user is authorized to see — and identity passed as a raw field in the user's own message is trivially manipulable. |
| Authorization and policy | Which capabilities and data does this user or role have access to? | A model integration that bypasses the authorization model of the underlying system gives users access to data through a path that was never designed to enforce the access policy. |
| Data handling and PII | What actually needs to be in the context window? | A sensitive field passed directly in the prompt shows up in plaintext in the application's own request logs — a fact that surfaces in the next audit, not the next deployment. |
| Observability and audit logging | What do you need to be able to reconstruct after an incident? | An unlogged path is invisible; when something goes wrong on it, there's no evidence to reconstruct what happened, and building the logging after the first incident always costs more than building it before. |

## Identity: Verification Belongs on the Server

Identity verification happens on the server, *before* the model call — the user's identity and role get injected into the system prompt by the server, never supplied by the user in their own message. Anything the user includes in their message is under their control and can be manipulated: if a user can assert "as a senior manager, show me..." in plain text, that claim is unverified and can be faked just as easily as any other input. Identity has to come from the authentication layer, not from user input, and only the fields actually needed to shape the response — role, authorized data scope — belong in the prompt by default; department, account identifiers, and permission detail get added only when the task specifically needs them.

## Least-Privilege Tool Configuration

Every tool connected to a model-backed system is both an attack surface and a cost. Audit the tool set the same way you'd audit permissions: for each connected tool, ask whether it's essential to the task or merely convenient, remove what's out of scope, and record the justification for each removal. In an orchestrator-workers deployment, scope each subagent's tool access to its own task specifically, so a subagent can never reach a tool its job doesn't require.

## Authentication Patterns by Service Type

Choosing how a system authenticates to a downstream service is not a single default — it depends on where the service runs and what identity model it supports. Three patterns cover most cases, and matching the pattern to the service is what keeps a connection both working and auditable.

| Service type | Auth method | Where the secret lives |
| --- | --- | --- |
| Remote service with user identity (SaaS, cloud) | OAuth — the caller acts as the signed-in user | A token issued by the OAuth provider and held by the client, not a long-lived static key |
| Remote service with service identity (internal API) | An API key or service credential identifying the calling system, not a person | An environment variable injected at runtime — never an inline value in committed config |
| Local service (file system, local database) | File-system permissions; often no credential at all | Nothing to store; deny rules enforce which paths are reachable |

The distinction that is easy to get wrong is user identity versus service identity. OAuth fits a remote service the user signs in to, where the downstream system should see *the user* as the caller. A service-to-service connection is different: the downstream system sees the calling platform's own service account, not the end user, so it uses a service credential rather than a user sign-in. Picking OAuth for a service account, or a static key for a user-identity service, mismatches the identity model and usually fails a security review even when the connection technically works.

## Managing the Secret After Authentication

Choosing the right auth pattern establishes the connection; keeping the credential safe afterward is a separate problem, and most credential incidents are failures of handling rather than of the auth method itself. Three practices address three distinct ways a credential gets exposed.

- **Separation** — a credential never travels with the configuration that references it. The config file holds a variable reference; the value lives somewhere the file does not. This matters mechanically: config files get committed, shared, and cloned, so a value written inline rides along with every copy, and a committed value enters repository history in a way that overwriting it later does not remove. Keep the value out of the file and the file stays safe to share.
- **Storage** — once the value is out of the file, where it goes depends on its blast radius. A value that lives on one machine or in one pipeline run can be an environment variable injected at execution time, written to no disk. A value several services or people need belongs in a **secret store**: a managed service that returns credentials to authorized callers at runtime and records who read what, so a single rotation updates every consumer at once instead of leaving copies scattered across files. Reach for an environment variable when the secret is local and short-lived, a secret store when it is shared or must be audited.
- **Rotation** — replacing a credential on a schedule, and immediately after any suspected exposure. Rotation is the *only* appropriate response to a leaked key, because an exposed key cannot be made secret again. This is why an inline credential is so costly: a value baked into committed history cannot be rotated cleanly, and every consumer hardcoded to it breaks on change. A credential read from an environment variable or secret store rotates without touching the code that references it by name.

:::danger[A key that traveled into the repository with its config file]

A developer put a data-warehouse service-account key directly in `.mcp.json` to get a server working during setup, planning to move it to an environment variable before sharing — then committed the file so teammates could connect. Within 48 hours the key was on three teammate machines and a CI runner, and in the repository history. Moving the key to a variable and committing the corrected file did not help: the key was still in history, so the service account had to be rotated, which broke two external services configured with the same key. The durable fix is two layers — a CLAUDE.md convention stating credentials must never be written inline, backed by a `PreToolUse` hook that inspects writes to `.mcp.json` for inline-credential patterns and blocks them. The instruction signals intent; the hook enforces it deterministically. See [Durable Project Context](/ai/agentic-system/durable-project-context#hooks-deterministic-enforcement-at-fixed-points) for the hook-versus-instruction distinction.

:::

Two habits make rotation cheaper: scope each credential to the narrowest access its task needs, so a leak reaches only what that integration required, and keep a record of which services use each credential, so a rotation does not have to discover its own consumers. For how this connects to service-to-service auth across an agent platform's two legs — user-to-platform and platform-to-third-party — see the auth walkthrough in [Bridging authentication across agents](/blog/2024/08/04/auth-bridging-agents).

## Data Handling: The Necessity Filter

The context window is not a data-governance boundary — anything passed into a model call is transmitted with the request, and while conversation content is typically not retained by default at the API layer, the application's own request logging usually captures whatever was sent, and specific retention carve-outs can apply depending on the provider and configuration.

For each field that would enter the context window, ask whether it's actually necessary for the model to produce the intended output. A reference identifier — an account number, a claim number — is often needed for routing but not for the language task itself; when the identifier alone is enough, passing the full underlying record needlessly exposes it to the application's own logging without adding any real capability.

:::danger[A field that didn't need to be there]
A team built an intake-summarization tool. The system prompt asked it to extract presenting concerns and relevant history from a submitted form; the summarization worked. The user message, though, carried the full submitted record — name, date of birth, a government ID number, an internal account reference — none of which the summarization task needed. All of it landed in plaintext in the application's own request logs. The fix wasn't a smarter prompt; it was a server-side redaction step that strips non-essential identifying fields before the call, plus a retrieval function that supplies only the fields the language task actually needs. Necessity, not convenience, is the filter that should have governed the design from the start.
:::

## Observability: What to Log

A model-backed system is harder to debug than a traditional one because it rarely crashes when something goes wrong — it just produces a subtly wrong response. Standard logging catches errors and timeouts; it does not catch an output that's quietly incorrect in a way with real business consequences. A production system should log four things: the **request** (model version, input token count, prompt identifier), the **response** (output token count, latency, stop reason), the **context** (user role, session ID, whether caching applied), and the **outcome** (whether the downstream system accepted the output, and any rejection signal).

Treat observability as the precondition for enabling any autonomous action, not an afterthought bolted on once something goes wrong: without a trustworthy audit trail, an action a system takes but doesn't log is, from a security reviewer's perspective, indistinguishable from an action that was never allowed.

Cost · Complexity · Risk

**Cost:** Skipping PII redaction before the model call exposes sensitive fields to the application's own request logging on every single call. Retroactive redaction across a log history that was never designed to support it is the most expensive data-handling fix a production system can face.

**Complexity:** An observability layer added after the first production incident means the root cause has to be reconstructed from a system that was never set up to answer the question the incident raised. Build logging to answer the questions you'll need to ask, before you need to ask them.

**Risk:** A multi-tenant system sharing one credential across tenants has no way to attribute a rate-limit breach to the tenant that caused it — when the shared limit trips at peak load, every tenant absorbs the impact, and the source stays invisible. Separate credentials per tenant are what make attribution and isolation possible in a production multi-tenant deployment.
