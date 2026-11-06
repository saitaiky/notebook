# Practice Exam: Team Enablement & Operational Productivity

Private, independently written Module 5 knowledge check based on the accompanying
[study notes](team-enablement-operational-productivity.md).

## Instructions

- Suggested time: 60 minutes, closed-notes first attempt.
- Part A: 30 multiple-choice questions × 1 point.
- Part B: 5 scenarios × 4 points. Maximum: 50.

| Score    | Interpretation                                        |
| -------- | ----------------------------------------------------- |
| 45–50    | Strong team-enablement command                        |
| 38–44    | Good; review missed governance choices                |
| 30–37    | Developing; repeat distribution and support scenarios |
| Below 30 | Revisit the chapter                                   |

## Part A: Multiple choice

### Team baseline and rollout

1. What distinguishes team setup from personal setup? A. A larger model B. A shared, reviewable, governable baseline C.
   More chat windows D. No permissions
2. Which belongs in a Claude Code project baseline? A. Personal undocumented settings B. Shared `CLAUDE.md`, tools/MCP,
   and permission posture C. Production PII D. User passwords
3. Why roll out through champions? A. To centralize every question on the architect B. To prove a real local workflow
   and create first-line support C. To avoid shared assets D. To mandate daily prompts
4. What is the preferred broad rollout sequence? A. Mass email → wait B. Champion → proven workflow → first batch →
   broader adoption C. Buy model → production D. Everyone configures independently
5. What is lumpy adoption? A. Everyone follows one workflow B. A few heavy users and many non-users prevent
   standardization C. Spend is flat D. Tools are versioned
6. What does “access is not adoption” mean? A. Access should be revoked B. Teams need workflow integration, examples,
   and enablement beyond login C. Chat is prohibited D. Only architects can use Claude

### Skills distribution and spend

7. A capability should be available to every member and needs no native version rollback. Best mechanism? A.
   Org-provisioned Skill B. Project Skill C. API Skill D. Personal prompt
8. A governed compliance procedure needs group targeting and repository-backed rollback. Best mechanism? A. Email B.
   Organization-managed plugin C. Org Skill manual upload D. Chat history
9. A coding convention belongs to one repository family. Best mechanism? A. Claude Code project Skill B. API Skill C.
   Organization-wide Skill D. User memory
10. A capability is called programmatically by several products. Best mechanism? A. Project Skill B. API Skill C. Mass
    email D. CLAUDE.md alone
11. How does a project Skill roll back? A. It cannot B. With the repository version carrying `.claude/skills/` C.
    Through model training D. Through a user prompt
12. What is server-managed Claude Code configuration? A. A Skills distribution mechanism B. A separate settings channel
    C. An API Skill D. An eval suite
13. What makes a shared asset dangerous at scale? A. Clear ownership B. No version, owner, revocation, or rollback path
    C. Group targeting D. Least privilege
14. Which belongs in spend posture? A. Model default/allowlist, effort guidance, caps, and alerts B. Only monthly
    invoice review C. Prompt color D. User avatar
15. Why set model restrictions before rollout? A. One expensive default multiplies across users and requests B. Models
    cannot be changed C. It eliminates security review D. It increases drift

### Developer workflows and diligence

16. Where should AI assistance be integrated? A. Only a separate occasional chat B. Existing editor, review, test, and
    debug loops C. Production without review D. Compliance logs
17. What is Claude's code-review output? A. Final verdict B. Input to human judgment C. Automatic authorization D. Proof
    of correctness
18. A debugging hypothesis is generated from a trace. What next? A. Deploy immediately B. Verify it against evidence C.
    Increase temperature D. Delete the trace
19. Which four dimensions belong in the verification checklist? A. Speed, cost, color, length B. Correctness, security,
    maintainability, human understanding C. Model, route, region, cache D. Input, output, prompt, UI
20. Tests pass, but the author cannot explain an input path. What should happen? A. Merge B. Hold until understanding
    and rationale are demonstrated C. Delete tests D. Ask users to test production
21. Why automate checklist checks where possible? A. To remove human accountability B. To create repeatable gates on
    every change C. To skip security D. To increase prompts
22. What is judgment erosion? A. Reviewers become more careful B. Plausible/green output replaces actual understanding
    C. Models get cheaper D. Skills roll back
23. AI-generated code should be held to what standard? A. Lower because it is faster B. The same correctness, security,
    and maintainability bar as other code C. Tests only D. Model confidence

### Operational support

24. What is the architect's durable support role? A. Fix every incident forever B. Translate symptoms to causes and
    teach a reusable diagnostic path C. Own all first-line tickets D. Replace telemetry
25. Gradual quality loss with no code change points first to what? A. UI color B. Model/prompt change or retrieval drift
    C. A successful cache D. More users only
26. Latency spikes. What should be inspected first? A. Trace spans, token/context growth, tool latency, cache behavior
    B. Outcome document C. Org chart D. Demo limits
27. Cost rises with stable traffic. What are likely causes? A. Model-tier creep or cache regression B. Better
    documentation C. Fewer tokens D. A runbook
28. What does a runbook contain? A. Marketing claims B. Known symptom → cause → action paths C. Only contacts D. Model
    weights
29. What does an escalation path define? A. Who handles what and when the issue leaves the team B. Prompt length C.
    Cache TTL only D. Exam score
30. What is the target operating state? A. Team calls architect for every repeat incident B. Team resolves known issues
    and escalates genuinely new ones C. No monitoring D. Architect removes all tools

## Part B: Architecture scenarios

31. **Rollout.** Design a 200-person, four-department Claude Code rollout with a shared baseline and adoption
    milestones.
32. **Distribution.** Select and justify mechanisms for: an all-company simple Skill, an engineering-only governed
    procedure, a project convention, and a product-called capability.
33. **Spend.** Define a team spend posture that prevents silent model-tier and usage growth.
34. **Verification.** Write a pre-production checklist for AI-generated code and name which parts should become
    automated gates.
35. **Support.** Quality is drifting, p95 is rising, and intermittent tool 429s appear. Give the diagnostic sequence and
    durable handoff artifacts.

## Answer sheet

`1 __ 2 __ 3 __ 4 __ 5 __ 6 __ 7 __ 8 __ 9 __ 10 __`

`11 __ 12 __ 13 __ 14 __ 15 __ 16 __ 17 __ 18 __ 19 __ 20 __`

`21 __ 22 __ 23 __ 24 __ 25 __ 26 __ 27 __ 28 __ 29 __ 30 __`

<details>
<summary>Part A answer key and rationales</summary>

| Q   | Answer | Rationale                                                            |
| --- | ------ | -------------------------------------------------------------------- |
| 1   | B      | Team setup must be consistent and governable.                        |
| 2   | B      | These establish instructions, capability, and permission boundaries. |
| 3   | B      | Local proof and support turn access into adoption.                   |
| 4   | B      | The staged pattern absorbs early friction before scale.              |
| 5   | B      | Uneven use prevents a team practice from forming.                    |
| 6   | B      | Enablement must connect the tool to real work.                       |
| 7   | A      | Org provisioning is the simple everyone-gets-it mechanism.           |
| 8   | B      | Plugins provide scoped governed distribution and rollback.           |
| 9   | A      | Project Skills version with the repository.                          |
| 10  | B      | API Skills serve machine-to-machine reuse.                           |
| 11  | B      | The artifact follows source control.                                 |
| 12  | B      | Settings and Skills are distinct channels.                           |
| 13  | B      | A bad update can otherwise propagate without containment.            |
| 14  | A      | Spend governance includes selection, effort, caps, and signals.      |
| 15  | A      | Team scale multiplies unmanaged defaults.                            |
| 16  | B      | Embedded assistance removes real workflow friction.                  |
| 17  | B      | Human reviewers remain accountable for the decision.                 |
| 18  | B      | Hypotheses become actions only after evidence supports them.         |
| 19  | B      | All four dimensions prevent shallow approval.                        |
| 20  | B      | Human understanding is an explicit release gate.                     |
| 21  | B      | Automation makes standards repeatable, not optional.                 |
| 22  | B      | Apparent plausibility replaces responsible judgment.                 |
| 23  | B      | Origin does not lower the production standard.                       |
| 24  | B      | Durable support reduces future dependency.                           |
| 25  | B      | These are the first architecture changes/drifts to compare.          |
| 26  | A      | The trace localizes the slow component.                              |
| 27  | A      | Both increase unit cost without more requests.                       |
| 28  | B      | It captures recurring diagnostics.                                   |
| 29  | A      | Ownership boundaries make response predictable.                      |
| 30  | B      | Known problems should no longer require the architect.               |

</details>

<details>
<summary>Part B scoring rubrics</summary>

31. Versioned shared `CLAUDE.md`/tools/permissions; one champion per department; two-week real-workflow proof and local
    examples; batch training/adoption measures before broad rollout with local first-line support.

32. Org-provisioned Skill for simple all-company availability; group-assigned plugin for governed engineering procedure;
    project Skill for repo-scoped convention; API Skill with version pinning for programmatic product use.

33. Default fit-for-purpose model and explicit allowlist; effort guidance and per-user/org rate/spend caps;
    usage/cost/cache/model-tier telemetry and alerts; named owner and review process for exceptions/changes.

34. Correctness requirements and edge-case tests; secrets/input validation and least-privilege security;
    clarity/conventions/complexity maintainability review; author explanation of behavior and untested inputs, with
    tests, linters, scanners, evals, and policy checks automated where deterministic.

35. Compare evals and model/prompt/corpus/index changes; trace p95 across context, tools, and cache; trace one 429 and
    inspect limits/retry; update runbook with all symptom-cause-action paths and define owners/escalation so the team
    handles repeats.

</details>

## Review log

| Attempt | Date | Part A /30 | Part B /20 | Total /50 | Topics to revisit |
| ------- | ---- | ---------: | ---------: | --------: | ----------------- |
| 1       |      |            |            |           |                   |
| 2       |      |            |            |           |                   |
