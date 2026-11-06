# Team Enablement & Operational Productivity

Private study notes for Module 5 of the Claude Certified Architect — Professional Prep Course (approximately 45
minutes). These are detailed paraphrased notes, not a transcript.

## Learning outcomes

An architect should be able to establish a governed team configuration, roll out Claude through local champions,
distribute reusable Skills through the correct mechanism, set spend controls, integrate AI into development workflows
without lowering the quality bar, and leave the operating team with runbooks and clear escalation paths.

The enablement sequence is:

```text
shared setup → daily workflow → durable operational support
```

## 1. Team setup is a governed baseline

Personal configuration is quick; team configuration must be reviewable, versioned, revocable, and affordable at scale.
For Claude Code, establish a project-level baseline such as:

- a shared `CLAUDE.md`;
- agreed tools and MCP servers;
- a permission posture; and
- centrally governed settings where appropriate.

This prevents dozens of individual configurations from drifting into different security and quality postures.

### Roll out through champions and batches

Do not treat access as adoption. Select a champion in every team or department, give champions early access to prove a
real workflow, let them tune shared assets and build local examples, then roll out in batches. The champion becomes
local first-line support and prevents the architect from remaining the only source of help.

For a 200-person engineering organization, one champion per department might spend two weeks converting an actual review
or test-generation workflow, then train a first batch of five peers. Broad rollout begins with a proven example and a
local expert rather than a mass email and a blank chat box.

## 2. Choose the Skills distribution mechanism by audience and governance

| Mechanism                      | Best fit                                                | Governance posture                                                                |
| ------------------------------ | ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Organization-provisioned Skill | Capability genuinely available to everyone              | Central availability/removal; manual updates; no native version pin/rollback      |
| Organization/group plugin      | Governed procedure for selected groups or the whole org | Targeting, install policy, repository-backed versions, controlled update/rollback |
| Claude Code project Skill      | Convention or procedure scoped to repositories/projects | Stored under `.claude/skills/`, versions and rolls back with the repository       |
| API Skill                      | Capability called by the organization's products        | Calling system governs use; supports explicit version pinning                     |

Server-managed Claude Code settings are a configuration channel, not a Skills distribution mechanism.

A good team procedure becomes a standard only when it travels as a governed artifact. Identify an owner and choose a
mechanism that can revoke or roll back a bad update. A shared release-notes Skill distributed without versioning can
propagate a formatting regression to every team before a manual fix reaches them.

### Spend posture belongs in setup

Decide before usage scales:

- default model;
- model allowlist/restrictions;
- effort guidance;
- organizational and per-user spend caps; and
- rate limits and budget alerts.

An unmanaged expensive model choice that looks harmless for one person is multiplied across every team member and
request.

## 3. Integrate AI into the existing development workflow

Value grows when assistance lives inside editing, review, tests, and debugging rather than an occasional separate chat.
Encode team conventions, repeatable procedures, and review standards in project configuration and Skills.

| Stage     | Useful assistance                                                | Required human discipline                                  |
| --------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| Writing   | Boilerplate, tests, first-pass implementation from a clear spec  | Review correctness/security; author understands the result |
| Review    | Diff summaries, likely issue flags, unfamiliar-code explanations | Treat flags as input, not verdicts                         |
| Debugging | Hypotheses from symptoms and traces                              | Verify the hypothesis against evidence before action       |

Watch for two adoption failures:

- **Lumpy adoption:** a few heavy users and many non-users prevent standards and team-wide benefits from emerging.
- **Basic-chat plateau:** access is provided, but nobody enables repository-aware work, tools, or packaged procedures.

Champions, real workflows, and shared assets address both.

### Diligence produces a verification gate

AI-generated code is held to the same or higher bar as handwritten code. Before production, require checks in four
dimensions:

1. **Correctness:** tests pass and behavior matches requirements and edge cases.
2. **Security:** inputs are validated, secrets are absent, and external access is least privilege.
3. **Maintainability:** code is clear, follows conventions, and contains no unexplained complexity.
4. **Human understanding:** the submitter can explain what the code does, why, and how it handles untested inputs.

Automate repeatable checks with tests and evaluation suites. Green tests alone are insufficient if the author cannot
explain a generated input path. That is judgment erosion: plausible output replaces understanding until an uncovered
case reaches production.

## 4. Operational support is translation, not permanent firefighting

Teams report symptoms. The architect connects them to likely architecture causes and teaches a repeatable diagnostic
path.

| Symptom                                  | Likely cause                                    | First action                                                       |
| ---------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------ |
| Gradual quality loss with no code change | Model/prompt change or retrieval drift          | Compare eval set; inspect model, prompt, corpus, and index changes |
| Latency spike                            | Larger context, slow tool, cache regression     | Use trace spans, token counts, tool latency, cache hit rate        |
| Intermittent tool failure                | Authorization, rate limit, unhandled error path | Trace a failed call; inspect auth and limits                       |
| Cost increase without traffic growth     | Model-tier creep or cache regression            | Compare per-request tier and cache behavior with budget model      |

Every resolved recurring issue should improve two artifacts:

- a **runbook** containing symptom → likely cause → diagnostic/action steps; and
- an **escalation path** naming who owns which issue and when it leaves the team.

Fixing an incident personally may be faster once. Teaching the reasoning and recording it lowers future support load.
The target state is a team that needs the architect for new failure modes, not previously solved ones.

## Exam review checklist

- Can I define the shared baseline and its owner?
- Can I explain why champions and batches outperform access-only rollout?
- Can I choose org Skill, plugin, project Skill, or API Skill and justify its versioning and audience?
- Can I define default-model and budget controls before scale?
- Does my verification checklist cover correctness, security, maintainability, and human understanding?
- Can I translate each operating symptom into a first diagnostic path?
- Did the incident leave behind a runbook entry and escalation boundary?
