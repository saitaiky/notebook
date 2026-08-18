# Practice Exam: Claude Code, MCP & Integration

Private, independently written knowledge check for Module 3. It tests the accompanying
[study notes](claude-code-mcp-integration.md) without copying course checkpoints.

## Instructions

- Suggested time: 60 minutes; first attempt closed-notes.
- Part A: 30 multiple-choice questions × 1 point.
- Part B: 5 scenarios × 4 points.
- Maximum: 50 points.

| Score    | Interpretation                             |
| -------- | ------------------------------------------ |
| 45–50    | Strong Claude Code/MCP integration command |
| 38–44    | Good; review missed boundaries             |
| 30–37    | Developing; repeat weak sections           |
| Below 30 | Revisit the chapter before another attempt |

## Part A: Multiple choice

1. Which mode is intended for research without edits? A. Plan B. Bypass C. Accept edits D. Default write
2. Which mode best fits non-interactive CI that must deny anything not explicitly allowed? A. Bypass B. Don't ask C.
   Accept edits D. Automatic approvals
3. Where is bypass-permissions acceptable? A. Production workstation B. Disposable isolated environment with no valuable
   credentials C. Shared server D. Customer database
4. How should permission mode be selected? A. Fewest prompts B. Worst plausible consequence and reversibility C. Model
   size D. File count
5. If an allow and deny both match, which wins? A. Allow B. Deny C. Random D. Newest setting
6. Which setting is normally committed for the whole project? A. User home setting B. Project `.claude/settings.json` C.
   Local ignored override D. Shell history
7. What distinguishes managed settings? A. They are optional suggestions B. Enterprise administrators can make them
   non-overridable C. They contain prompts only D. They disable audit
8. What belongs in `CLAUDE.md`? A. Every historical decision B. Concise conventions needed on nearly every task C.
   Secrets D. One user's temporary preference
9. What actually scopes a rule to paths? A. Its subdirectory alone B. Path metadata/frontmatter C. Filename length D. A
   tool result
10. Which mechanism can block a dangerous tool before execution? A. PostToolUse B. PreToolUse hook C. README D. Stop
    event after execution
11. Why is a hook stronger than a prompt rule for enforcement? A. It is longer B. Deterministic code runs at the action
    boundary C. It changes models D. It adds context
12. Which hook is suited to formatting files after an edit? A. PreToolUse B. PostToolUse C. UserPromptSubmit D.
    SessionEnd
13. What should be assumed about subagent context? A. All context/skills inherit automatically B. Dependencies must be
    explicit because context is isolated C. No tools exist D. Managed settings disappear
14. What best describes a Skill? A. Always-on repository constitution B. Reusable on-demand procedure C. Secret store D.
    Model alias
15. What best describes a plugin? A. One output token B. Installable bundle of extension components C. Context summary
    D. Cloud region
16. What improves plugin portability? A. Absolute paths to one laptop B. Relative paths and clean-install testing C.
    Embedded secrets D. Unscoped permissions
17. Which MCP primitive performs model-requested actions? A. Tool B. Resource C. Prompt D. Cache
18. Which MCP primitive exposes read-only data/templates? A. Tool only B. Resource C. Hook D. Agent memory
19. Which MCP primitive provides a vetted reusable interaction template? A. Prompt B. Resource C. Secret D. Token
20. Which transport fits a local child process? A. stdio B. SMTP C. Batch D. Git
21. Which transport is the modern shared remote default? A. HTTP B. Local file C. Clipboard D. SSE-only legacy
22. Are transport and configuration scope the same decision? A. Yes B. No; local/project/managed scope is independent C.
    Only for HTTP D. Only for prompts
23. Why avoid connecting every MCP server? A. Servers cannot coexist B. Tool definitions consume context and expand
    attack surface C. HTTP forbids it D. Resources expire
24. Which credential pattern is correct? A. Literal key in `.mcp.json` B. Environment/secret-manager reference C. Key in
    `CLAUDE.md` D. Key in a prompt example
25. A key was committed and then deleted in the next commit. What remains required? A. Nothing B. Revoke/rotate it C.
    Rename the file D. Add a comment
26. Which authentication fits a service acting as a signed-in human? A. User OAuth B. Shared hardcoded key C. No
    identity D. Prompt claim
27. Which identity fits unattended CI? A. A browser cookie B. Scoped service/workload credential injected at runtime C.
    User prose D. Public URL
28. What does retrieval relevance prove? A. Authorization B. Semantic fit only; authorization is separate C. Ownership
    D. Data residency
29. Which design helps a regulated review? A. Prompt-only access policy B. Managed configuration, pre-action controls,
    and auditable access C. Bypass mode D. Embedded keys
30. A large stable tool schema repeats every turn. What can reduce repeated processing? A. Exact-prefix prompt caching
    when supported B. Higher temperature C. More servers D. Moving it after live state

## Part B: Scenarios

31. **Permission design.** Define development, plan/review, CI, and disposable-sandbox modes for a migration repository;
    include the human gate for sensitive changes.
32. **Context cleanup.** A project has an 800-line `CLAUDE.md` mixing universal rules, path-specific policy, history,
    and formatter commands. Redesign its context and enforcement layers.
33. **Portable package.** Turn a local procedure plus two hooks and an MCP server into a distributable plugin. Name four
    portability/installation checks.
34. **MCP security.** Design a remote server that reads a customer's ticket system as the signed-in user. Cover
    transport, primitive, OAuth, scopes, secret handling, and auditing.
35. **Credential incident.** An API key appears in a committed `.mcp.json`. Give the immediate response and durable
    prevention controls.

## Answer sheet

`1 __ 2 __ 3 __ 4 __ 5 __ 6 __ 7 __ 8 __ 9 __ 10 __`

`11 __ 12 __ 13 __ 14 __ 15 __ 16 __ 17 __ 18 __ 19 __ 20 __`

`21 __ 22 __ 23 __ 24 __ 25 __ 26 __ 27 __ 28 __ 29 __ 30 __`

<details>
<summary>Part A answer key and rationales</summary>

| Q   | A   | Rationale                                                               |
| --- | --- | ----------------------------------------------------------------------- |
| 1   | A   | Plan mode is read/research only.                                        |
| 2   | B   | Don't-ask denies actions outside the allowlist without queuing prompts. |
| 3   | B   | Bypass requires disposable isolation and no valuable authority.         |
| 4   | B   | Risk and reversibility determine the gate.                              |
| 5   | B   | Deny is the precedence backstop.                                        |
| 6   | B   | Committed project settings apply to the repository team.                |
| 7   | B   | Managed policy is centrally controlled.                                 |
| 8   | B   | Always-on context must remain concise and universal.                    |
| 9   | B   | Path metadata, not directory placement, controls loading.               |
| 10  | B   | PreToolUse runs before the protected action.                            |
| 11  | B   | Code enforcement does not depend on model compliance.                   |
| 12  | B   | PostToolUse runs after an edit/action.                                  |
| 13  | B   | Isolated agents need explicit sources and skills.                       |
| 14  | B   | Skills are reusable and selected on demand.                             |
| 15  | B   | A plugin packages multiple extension assets.                            |
| 16  | B   | Portable paths and clean installs expose hidden assumptions.            |
| 17  | A   | Tools are callable actions.                                             |
| 18  | B   | Resources expose read-only data.                                        |
| 19  | A   | MCP prompts are reusable interaction templates.                         |
| 20  | A   | stdio naturally connects a local subprocess.                            |
| 21  | A   | HTTP is the current remote/shared transport choice.                     |
| 22  | B   | Transport does not determine config ownership.                          |
| 23  | B   | Each schema costs context and authority surface.                        |
| 24  | B   | Config references a runtime-injected secret.                            |
| 25  | B   | Git history and clones preserve the exposed credential.                 |
| 26  | A   | OAuth represents delegated user identity.                               |
| 27  | B   | Automation needs a scoped non-human identity.                           |
| 28  | B   | Relevance cannot grant access.                                          |
| 29  | B   | Central policy, enforcement, and evidence are reviewable controls.      |
| 30  | A   | Exact stable prefixes can be cached.                                    |

</details>

<details>
<summary>Part B scoring rubrics</summary>

Award one point for each element.

31. Default/accept-edits for bounded development; plan for read-only design; don't-ask with explicit allowlist for CI;
    bypass only in disposable isolation; human review before merge/irreversible changes.
32. Concise universal `CLAUDE.md`; scoped path rules; move history/reference elsewhere; deterministic
    formatter/protected path behavior in Post/PreToolUse hooks.
33. Clear Skill trigger; relative paths and declared runtimes; explicit subagent/config dependencies;
    marketplace/managed policy compatibility and clean-install test without local secrets.
34. Remote HTTP; resources for read data and tools only for actions; OAuth with registered redirects/scopes;
    secret/token storage outside config plus least privilege and access audit.
35. Revoke/rotate immediately; identify consumers and review history/logs; replace literal with secret reference; add
    scanning, deny hook/policy, least privilege, and rotation ownership.

</details>

## Review log

| Attempt | Date | Score | Weak topics | Next action |
| ------- | ---- | ----: | ----------- | ----------- |
| 1       |      |       |             |             |
