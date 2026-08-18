# Accelerators & IP Contribution

Course-derived study notes, paraphrased for private certification preparation.

## 1. A working build is not yet reusable

An accelerator packages a working solution so another engagement configures it instead of rebuilding it. Separate the
reusable core from customer-specific values while the design knowledge is fresh.

| Asset          | Reusable core                      | What must be configurable/documented                   |
| -------------- | ---------------------------------- | ------------------------------------------------------ |
| Agent template | Prompt, tools, and loop structure  | Domain values, paths, scopes, thresholds, model policy |
| MCP server     | Tool implementations and schemas   | Credentials by reference, allowed systems/paths/scopes |
| Eval suite     | Dataset, graders, and judge rubric | Dataset paths, thresholds, baseline, score meaning     |

Documentation must state environmental assumptions, inputs, handled failures, and the eval definition. Regulated reuse
also needs an audit story: data touched, identity used, permissions, and logs produced. Loose scripts with values buried
throughout are not an accelerator even when they run.

Packaging adds overhead. Skip it for a true one-off, but do not label a hardcoded delivery “reusable.”

## 2. Contribution readiness

Move a private asset into shared infrastructure through the channel designed for its shape. A focused, end-to-end
reference pattern may fit a Cookbook-style repository; a server or tool belongs in its own project's contribution flow.
A large multi-component application is a poor match for a repository that reviews focused examples.

A maintainer can accept what they can verify:

1. focused code with one clear purpose;
2. a runnable example;
3. a test that proves behavior;
4. a short statement of assumptions and limitations; and
5. installation/version information sufficient to reproduce the result.

Rights, licensing, confidentiality, and attribution are gates before technical review. Code created during a customer
engagement cannot be contributed merely because it is useful. Confirm authority, remove customer-specific material, and
attribute dependencies. If rights cannot be cleared, escalate to the owner and do not publish.

## 3. Requirements and lifecycle

A business goal is not a requirement. Turn it into checkable behavior, for example: classify into a defined set of
queues, cite an approved source, and require human approval before storage or sending.

Infrastructure requirements constrain where/how it runs:

- latency measured where the user runs;
- normal and peak scale;
- processing/data residency and governing regulation;
- acting identity, access scope, and auditability; and
- reliability, retention, and integration constraints.

Document these before choosing a platform so the decision can be defended rather than rationalized after the fact.

### Claude application lifecycle

1. **Requirements:** functional and infrastructure needs.
2. **Design:** platform, model, architecture, and trust boundaries.
3. **Build:** prompts, tools, agents, and integrations.
4. **Test:** evals plus unit, integration, and end-to-end checks.
5. **Deploy:** pin versions and gate promotion on the eval.
6. **Operate:** measure cost/latency/errors and enforce controls.
7. **Iterate:** feed production evidence back into requirements.

Gates stop a phase from advancing without its evidence—for example, no build before residency-compatible design and no
promotion before the candidate beats the pinned baseline.

## 4. Deployment and versioning

Platform selection usually begins with the customer's existing cloud, identity, procurement, and compliance posture.
Possible surfaces include Anthropic's first-party API, AWS offerings, Google Vertex AI, and other platforms embedding
Claude. Names, feature parity, hosting boundaries, model availability, and retirement schedules change; verify current
official documentation for the exact service and model.

A deployment platform determines identity, billing, data path, regional controls, feature timing, and operational
integration. Do not assume two services with similar names share the same processing boundary.

Pin the exact model snapshot/ID supported by the platform instead of following a moving convenience alias. Version the
prompt, tools, schema, eval, and accelerator alongside it. Keep the prior known-good version for rollback. Promote a new
version to limited traffic, compare it with the pinned baseline, then promote or revert from measured results.

## 5. Compare platforms on the deciding dimensions

| Dimension  | How to evaluate                                                    |
| ---------- | ------------------------------------------------------------------ |
| Latency    | Measure actual payloads from the customer's deployment region      |
| Compliance | Check residency, certifications, audit model, and contract fit     |
| Cost       | Include tokens, platform fees, egress, integration, and operations |

The first-party API may expose new capabilities earlier; an in-region cloud deployment may reduce round-trip time or fit
an existing certification. Per-token price alone is not total cost. For regulated workloads, compliance is often a
pass/fail constraint that narrows the comparison before optimization.

## 6. Multi-component trust boundaries

A workflow might enter through an API, delegate work to a coding/agent runtime, and reach a customer system through an
MCP server. Every seam where data, instructions, identity, or secrets cross is a trust boundary.

Map before connecting:

- what each component does;
- which identity it uses;
- what data enters and exits;
- whether incoming content is trusted;
- which action and path scopes it has; and
- what audit record proves enforcement.

Content fetched by one component remains untrusted when passed to the next. Treat it as data, validate it, and prevent
it from authorizing actions. Scope each component independently to least privilege. The whole system is only as
contained as its most privileged seam. Passing component-level tests does not test the boundary between components.

If a seam cannot be secured or its residency/identity path cannot be explained, escalate rather than shipping around it.

## Release checklist

- Customer-specific values are parameters, not hidden edits.
- Defaults, assumptions, inputs, failure modes, eval, and audit behavior are documented.
- Contribution channel matches the asset shape.
- Runnable example and test let a maintainer verify it.
- Rights and attribution are cleared before publication.
- Functional/infrastructure requirements trace to platform choice.
- Exact versions are pinned, evaluated, canaried, and reversible.
- Latency, compliance, and total cost are measured in the real environment.
- Every cross-component seam has an explicit control and log.

## Exam focus

Expect to identify hardcoded “reusable” assets, unreviewable contributions, missing rights checks, business goals that
are not requirements, lifecycle gates, moving aliases, platform comparisons based only on familiarity, and component
seams that were never treated as trust boundaries.
