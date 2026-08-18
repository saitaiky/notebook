# Stakeholder Engagement, Lifecycle & GTM

Private study notes for Module 4 of the Claude Certified Architect — Professional Prep Course (approximately 178
minutes). The material is reorganized only for study clarity and paraphrased rather than reproduced as a transcript.

## Learning outcomes

An architect should be able to conduct structured discovery, translate business preferences into testable constraints,
present actionable tradeoffs, operate a signal-to-action feedback loop, document a design so it survives handoff, choose
deployment routes in a multi-platform system, and prove business outcomes.

The lifecycle is:

```text
discovery → design → handoff → monitoring → iteration
```

## 1. Discovery is structured elicitation

Discovery is not an early design meeting. Use three moves:

1. **Listen** to the business outcome and the meaning behind vague words.
2. **Translate** statements into requirements, assumptions, constraints, and unresolved questions.
3. **Write down** each item before the conversation moves on.

Words such as _seamless_, _fast_, _easy_, or _safe_ are pointers to requirements, not requirements themselves. Ask what
would make the experience fail, what the user must never notice, what must happen behind the scenes, and what must still
be true when something goes wrong. "Seamless" may resolve into a p95 latency budget, no duplicate data entry, an
internal-safe failure state, and a human exception path.

### Four discovery categories

- What must the system do? Define business capabilities and ownership.
- What must it not do? Define prohibited actions and mandatory escalation.
- What must it cost? Capture volume, latency, and spend boundaries.
- What must it prove? Capture audit, safety, and outcome evidence.

The output is a translation table:

| Stakeholder statement             | Implied constraint                                          | Required architecture decision                     | Assumption to confirm                     |
| --------------------------------- | ----------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------- |
| "It should feel seamless"         | Agreed responsiveness and continuity budget                 | Design to p95 target and graceful failure          | Confirm what users perceive as disruption |
| "It reads the form and routes it" | Routing may be a fixed business rule                        | Claude extracts; rules engine routes               | Confirm rule and owner                    |
| "Clinicians review it anyway"     | Licensed authorization may be mandatory before record entry | Build a pre-action human gate                      | Confirm authority and timing              |
| "Be careful with healthcare data" | Formal privacy and proof obligations may apply              | Make handling evidence and audit trail first-class | Confirm scope with compliance             |

A requirement traces to evidence from the stakeholder. An assumption is clearly labeled, owned, and scheduled for
confirmation. A silent assumption—such as a 60-day transcript retention period nobody requested—is especially dangerous.

### Failure pattern: the call becomes a design session

A plausible sketch can stop discovery because it signals false certainty. A clinical-note assistant may appear to be a
simple augmented call until questions reveal a licensed authorization gate, protected data, and state-specific
retention. Finish the four-category question set before proposing the design, and investigate every phrase such as "just
a quick review."

## 2. Present tradeoffs as decisions stakeholders can defend

The architect does not hide the decision inside a technical verdict. Present the considered options, decision criteria,
recommendation, residual risks, and four business-facing elements:

1. What do we gain?
2. What do we give up?
3. What will reversal cost after the system depends on the choice?
4. In regulated work, what happens to the compliance posture?

Reversal cost is often load-bearing. A full-context design can simplify the first build but raise monthly cost and
latency. The relevant explanation is not only four cents per interaction; it is the monthly production range, caching
assumption, and cost of introducing retrieval after the rest of the application depends on full context.

Lead with the business outcome, state limitations honestly, and give the sponsor the reasoning they will need to justify
the choice to peers. Technical accuracy that does not answer "what happens to the business if this is wrong?" is not a
complete stakeholder presentation.

### Scenario-specific demonstrations (partner-track context)

The lesson marks some GTM content as partner-track material rather than Architect exam content, but the communication
pattern remains useful. A capabilities demo shows what a system can do; a scenario-specific demo proves fit with the
buyer's workflow, data shape, approvals, and edge cases.

Before building it, choose:

- a scenario the buyer immediately recognizes;
- one or two limitations to state as intentional boundaries;
- a narrative aligned with the sales team's prior discovery; and
- anonymized but structurally realistic data.

For joint specialist scoping, arrive with documented constraints, a proposed pattern or small candidate set with
tradeoffs, and a short list of questions that actually requires the specialist team.

## 3. Feedback loops turn telemetry into decisions

Observability supplies signals. A feedback loop decides which signals matter, who acts, and whether the response worked:

```text
signals → triage → decide → act → review
```

A dashboard without this layer can show seven weeks of gradual quality decline without producing a stakeholder
conversation. Build a pre-launch governance table that includes slow drift, hard breaches, and scheduled obligations.

| Signal            | Trigger                               | Owner/action                                                        | Scheduled governance              |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------- | --------------------------------- |
| Eval quality      | Threshold or sustained trend          | Diagnose prompt, model, data, or retrieval; iterate or re-architect | Periodic output audit if required |
| p95 latency       | User-experience budget breached       | Trace bottleneck; tune or revisit requirement                       | Usually event-driven              |
| Cost/interaction  | Discovery budget crossed              | Find driver; bring explicit tradeoff to sponsor                     | Budget review cadence             |
| Residency posture | Calendar date or configuration change | Confirm every data copy and record evidence                         | Mandatory scheduled confirmation  |

### SLA design

An SLA names the measure, the breach threshold, and the required response. Trace the threshold to a real source:

- latency → user-experience requirement;
- availability → business criticality; or
- quality → evaluation acceptance criteria.

Forecast production consumption before launch. Pilot traffic often understates live volume by one or two orders of
magnitude. Explain caching, tiering, and budget alerts before the first invoice.

Regulated checkpoints may fire on a schedule even when all metrics are green. If the feedback loop contains no calendar
trigger and owner, the obligation will surface only when an auditor asks.

## 4. Documentation must survive the architect

One living design record serves three readers:

- The inheriting engineer needs decisions, rejected alternatives, and rationale.
- The compliance reviewer needs obligations, controls, owners, and evidence.
- The returning architect needs dates, labeled assumptions, owned open items, and resolution criteria without a separate
  briefing.

The completeness test is: **Can a competent architect who was not in the room make a safe change after reading this?**

At minimum, record:

| Field                             | Purpose                                              |
| --------------------------------- | ---------------------------------------------------- |
| Decision and date                 | What was chosen and when                             |
| Rejected alternatives             | Prevents a successor from repeating a disproven path |
| Tradeoff and reversal implication | Explains which property was load-bearing             |
| Owner                             | Keeps a control or open question alive               |
| Evidence artifact                 | Proves the control operates                          |
| Audit-ready status                | Shows whether proof remains current                  |

An architecture diagram shows _what_. It rarely shows _why_. If an in-region context strategy was chosen to satisfy
residency, that rationale and the rejected global route must be explicit. Otherwise a reasonable performance
optimization can silently reverse a compliance-critical choice.

Useful artifacts include the architecture diagram, decision and assumption logs, control register with evidence links,
runbook, and test summary. Separate design intention from operating evidence while making both easy to navigate.

## 5. Entry-point responsibility and business outcomes

Revisit route choice with the complete production picture: latency, feature availability, cost, procurement, compliance,
region configuration, authentication, logging, and failure modes. Current platform capabilities change, so verify them
against official documentation at implementation time.

General decision posture:

- Direct Anthropic API: usually the shortest feature path and a strong default when procurement/residency does not
  require another route.
- AWS Bedrock: fits AWS procurement and explicit regional execution.
- Google Vertex AI: fits GCP procurement and explicit regional execution.
- Microsoft Foundry/Azure route: verify the exact hosting form and data path; the platform name alone does not prove
  residency.

Cloud-mediated routes can differ in identifiers, availability, and feature timing. A global endpoint default can violate
a regional promise. For every multi-route application, create an entry-point-responsibility map: which route owns which
task, why, how it authenticates and logs, and what its fallback is.

### Outcome document

Technical health metrics show that a system runs; they do not show what it changed. A sponsor-ready outcome document
contains:

1. use case and scope boundary;
2. business metric before deployment;
3. the same metric after deployment using the same definition;
4. the control that makes the comparison auditable;
5. the ongoing measurement owner; and
6. reuse potential for the pattern (partner-track emphasis).

Request count, average latency, and error rate cannot answer a CFO asking whether claim-processing time improved.
Capture the baseline during discovery, preserve an auditable measurement control, and wait for sufficient post-launch
data before claiming an outcome.

## 6. Worked synthesis: multi-platform clinical documentation

For a two-state healthcare network where nurses dictate notes, licensed clinicians approve every note, AWS is the
regulated route, the direct API handles non-regulated work, and the CFO wants evidence:

1. Translate the privacy/audit obligation into a requirement for a traceable record of every generated and
   clinician-authorized note.
2. Reject trimming the required audit trail merely for latency; explain the compliance exposure and redesign cost of
   restoring it later.
3. Put the periodic output audit in the governance table with a calendar trigger, compliance owner, and
   stakeholder-review action.
4. Record explicit regional Bedrock execution as a load-bearing decision and the global endpoint as a rejected
   alternative.
5. Use Bedrock for the regulated path with explicit region configuration and the direct API only for tasks outside the
   residency scope.
6. Compare time from dictation to clinician-authorized note before and after, supported by a timestamped authorization
   log.
7. Gate expansion on a complete outcome document; at week four, schedule the measurement milestone instead of inventing
   an after result.

## Exam review checklist

- Can I turn a vague stakeholder adjective into testable requirements?
- Can every requirement trace to a statement, with assumptions visibly labeled?
- Can I present gain, sacrifice, reversal cost, and compliance posture?
- Can I distinguish monitoring from a signal-to-owner-to-action loop?
- Can a successor safely change the system from the documentation alone?
- Can I map tasks to entry points and prevent regional defaults?
- Can I prove business value with a consistent before/after metric and control?
