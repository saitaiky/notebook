---
slug: /ai/agentic-system/claude-code-configuration
title: Claude Code Configuration and Permissions
description: "How permission modes, layered settings files, and allow/deny rules decide what a coding agent is allowed to do — and why that is a risk decision, not a speed decision."
keywords:
  - ai
  - agentic system
  - claude code
  - permission modes
  - settings
  - allow deny rules
  - managed settings
  - governance
---

A coding agent that can edit files and run shell commands needs a layer that decides, for every action, whether it may proceed without a human in the loop. In Claude Code that layer is the **permission system**: a selected mode that sets the default posture, plus allow/deny rules and settings files that layer on top of it. This page covers that permission layer — what the agent is *allowed* to do. A separate concern, what the agent *knows* and how it behaves, lives in [Durable Project Context](/ai/agentic-system/durable-project-context), and the two are designed to work together.

:::note[Verify product specifics against current docs]

Mode names, the exact commands auto-approved by each mode, and the availability of newer modes change as the product evolves, and some modes are research previews gated by plan or admin settings. Treat the specifics below as the shape of the system, and confirm the current behavior against Anthropic's Claude Code documentation before relying on any single mode for a safety argument.

:::

## Permission Mode Is a Risk Decision, Not a Speed Decision

The temptation is to read permission modes as a convenience dial — fewer prompts when the work is trusted, more prompts when it isn't. That framing is backwards. The right mode is the one that matches the **risk profile of the work and the environment**, and only after that constraint is satisfied does reducing prompts become a legitimate goal. A bypass mode on a developer workstation against a live codebase is not "faster," it is a decision to remove every checkpoint between the agent and your files.

The modes form a spectrum from prompt-before-everything to prompt-for-nothing. Each one is defined by two things that matter more than its name: what it auto-approves without asking, and what it still gates behind a confirmation.

<!-- NOTEBOOKLM_DIAGRAM: concept=claude-code-permission-mode-risk-spectrum; type=image; goal=show the six permission modes arranged on a risk ladder from most-gated (plan/default) to least-gated (bypassPermissions), with the environment each one suits; complexity=basic -->

| Mode | Auto-approves | Still gates | Appropriate environment |
| --- | --- | --- | --- |
| `default` | Reads only | Every file edit and shell command | The baseline for any new project or unfamiliar codebase — safe but slow on trusted work |
| `acceptEdits` | Reads, file edits, and common filesystem commands inside the working directory | All other shell commands; writes outside the working directory; writes to protected paths | Trusted local work where edits are routine but shell execution still needs a human eye |
| `plan` | Reads only; proposes a plan and makes no edits | Every edit and command until you approve the plan | Exploration and planning on sensitive or unfamiliar code; wrong for tasks that must produce output |
| `auto` | Everything, but a separate classifier reviews each action first and blocks escalations | Production deploys and migrations, mass deletes, credential exfiltration, force-push to main | Reduces prompts without removing all judgment, but is a research preview — not a substitute for reviewing sensitive operations |
| `dontAsk` | Only tools pre-approved in an allow rule, plus read-only commands; auto-denies everything else | Every tool call not on the allow list is denied outright, with no confirmation queue | Locked-down CI and scripts — it restricts well, but is not a way to reduce friction on interactive work |
| `bypassPermissions` | All tool calls; no confirmation prompts and no safety checks | Nothing in normal operation; only catastrophic deletes such as `rm -rf /` still prompt | Only inside a disposable container or VM — never on a developer workstation against a live codebase |

The two ends of the table are the ones worth memorizing. `plan` and `default` keep a human in front of every change, which is what you want on code you don't yet trust. `bypassPermissions` removes the checkpoints entirely, which is only acceptable where the blast radius is contained by the environment itself — a throwaway sandbox — rather than by the agent's own judgment.

## Where Settings Live and Who They Apply To

A permission mode sets the posture, but the durable rules that constrain the agent live in settings files, and those files exist at four levels. Each level determines the scope of the rules it carries, and higher-authority levels are the ones a security story can actually depend on.

| Level | File | Scope | What belongs here |
| --- | --- | --- | --- |
| User | `~/.claude/settings.json` | Every project on the machine | Personal preferences that should follow you everywhere, such as a default mode for exploration |
| Project | `.claude/settings.json` (committed) | Everyone who clones the repository | Team-wide conventions, allow rules for the tools the project uses, deny rules for paths that must not be touched |
| Local project | `.claude/settings.local.json` (git-ignored) | One project, one developer | Personal overrides that should not be committed to the whole team |
| Enterprise | `managed-settings.json` (set by administrators) | Organization-wide; cannot be overridden by users or project files | Security controls such as denying edits to environment files or blocking specific shell commands across all projects |

## Allow and Deny Rules, and Why Deny Always Wins

Allow and deny rules layer on top of whatever mode is in effect, and the precedence between them is the single most important fact in this whole system: **a deny rule always beats an allow rule**, regardless of the mode. That ordering is what makes governance possible. Without it, a permissive mode or a stray allow rule could quietly re-enable something a policy was meant to forbid; with it, a deny rule is a hard floor that the rest of the configuration cannot climb under.

The most durable control follows directly from combining precedence with the settings hierarchy. An **enterprise-level deny rule cannot be removed by any individual developer and applies even when a bypass mode is set** — it is the one control that survives both a careless local override and a deliberately permissive mode. A deny rule on the path that must not be touched, set at the enterprise or project level, covers exactly the gap that choosing a mode alone leaves open.

The diagram below shows how a single tool call is resolved: the deny set is checked first and short-circuits everything, the allow set and mode decide the rest, and the enterprise layer sits above the project and user layers so it cannot be undercut.

```mermaid
flowchart TD
    A["Agent proposes a tool call"] --> B{"Matches any deny rule?<br/>(enterprise → project → user)"}
    B -->|Yes| D["Blocked — no prompt, no override"]
    B -->|No| C{"Matches an allow rule,<br/>or permitted by the active mode?"}
    C -->|Yes| E["Proceeds without a prompt"]
    C -->|No| F["Prompts for confirmation<br/>(or denies, under dontAsk)"]
```

Read the diagram top-down: the deny check is deliberately first, so no combination of mode and allow rule can talk its way past it. Everything below the deny gate is where convenience lives; the deny gate itself is where the non-negotiable security boundary lives.

## A Worked Diagnostic: Three Bugs Across Three Layers

Integration problems rarely announce which layer they came from. A useful exercise — and a common exam shape — is a set of configuration files with one planted defect in each layer: the Claude Code configuration layer, the skill or packaging layer, and the MCP or authentication layer. The skill being tested is reading each file against the question "what does this do, or fail to do, at runtime?"

Consider three files handed over as a shared project setup.

The permission configuration sets the default mode and one deny rule:

```json
// .claude/settings.json
{
  "permissions": {
    "defaultMode": "bypassPermissions",
    "deny": ["Read(.env.production)"]
  }
}
```

A skill bundles a validation step that runs a local script:

```markdown
<!-- .claude/skills/migration-validate/SKILL.md -->
---
name: migration-validate
description: Validates migration scripts before they run against production.
---
## Steps
1. Run: /Users/priya/scripts/validate-migration.sh
2. Report validation results.
```

And the MCP configuration connects to a data warehouse:

```json
// .mcp.json
{
  "mcpServers": {
    "data-warehouse": {
      "type": "http",
      "url": "https://warehouse.internal/mcp",
      "headers": { "Authorization": "Bearer sk-prod-warehouse-abc123" }
    }
  }
}
```

Each file carries exactly one layer-specific defect:

- **Configuration layer** — `defaultMode` is `bypassPermissions` on what is meant to be a shared production workstation, which removes every confirmation prompt including destructive ones. The deny rule for `.env.production` is correct; only the mode is wrong. The fix is a mode that matches the risk, such as `acceptEdits`, which auto-approves routine edits while still gating destructive shell commands.
- **Packaging layer** — the skill's step 1 hardcodes `/Users/priya/scripts/validate-migration.sh`, an absolute path that exists only on the author's machine and resolves nowhere after a teammate clones the project. The fix is a project-relative reference such as `$CLAUDE_PROJECT_DIR/scripts/validate-migration.sh`, so the path resolves from the project root on any machine.
- **Authentication layer** — the API key `sk-prod-warehouse-abc123` is committed inline in the `.mcp.json` Authorization header. Once committed it enters repository history, where overwriting the file in a later commit does not remove it, so the key must be treated as compromised and rotated. The fix is an environment-variable reference such as `${WAREHOUSE_MCP_TOKEN}`, with the value kept out of the committed file entirely — the credential-handling pattern covered in [Enterprise Integration](/ai/agentic-system/production/enterprise-integration#managing-the-secret-after-authentication).

The through-line is that no single layer tells you the system is misconfigured; each file looks locally plausible, and only reading all three against their runtime behavior surfaces the three independent failures.

## How This Connects to the Rest of the Stack

The permission layer decides what an agent may do; it does not decide what the agent knows or enforce a guard the moment the model tries to cross a line. Those are adjacent jobs covered elsewhere: [Durable Project Context](/ai/agentic-system/durable-project-context) covers CLAUDE.md, rules files, hooks, and subagents — including hooks, which enforce a constraint deterministically at the moment of a tool call rather than relying on a mode to prompt. [Safeguarding Agentic Systems](/ai/agentic-system/safeguarding) covers the request-path and skill supply-chain controls that sit around this configuration, and [Enterprise Integration](/ai/agentic-system/production/enterprise-integration) covers the credential handling that the worked diagnostic above points to.
