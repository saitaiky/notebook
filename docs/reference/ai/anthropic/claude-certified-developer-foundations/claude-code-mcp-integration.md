# Claude Code, MCP & Integration

Course-derived study notes, paraphrased for private certification preparation.

## 1. Permission modes

Claude Code normally moves through exploration, planning, and implementation. Its permission mode changes which actions
can proceed without a prompt:

| Mode                | Intended use                                               |
| ------------------- | ---------------------------------------------------------- |
| Default             | Reads proceed; edits and shell actions normally ask        |
| Accept edits        | Routine in-worktree edits proceed; riskier actions ask     |
| Plan                | Read and research only; no implementation                  |
| Automatic approvals | Classifier-gated approvals with some high-risk blocks      |
| Don't ask           | Only allowlisted/read-only actions; everything else denied |
| Bypass permissions  | Nearly all checks removed; disposable isolation only       |

Choose the mode from the worst plausible consequence, reversibility, and environment—not convenience. Sensitive code
still needs human review before merge. Never use bypass mode on a production host or with production credentials.

Settings form a precedence hierarchy:

- user settings in the home configuration;
- committed project settings;
- ignored local project overrides; and
- centrally managed enterprise settings that users cannot override.

When rules conflict, deny wins over ask, and ask wins over allow. This makes a narrow deny an enforceable backstop.

## 2. Durable project context

`CLAUDE.md` loads as always-on project guidance. Keep it concise and limited to conventions every task needs. An
initializer can produce a draft, but the team must review it; generated guidance is not automatically correct.

Use `.claude/rules/*.md` for focused rules. Path-specific frontmatter determines scope; merely putting a rule in a
subdirectory does not make it path-specific. A rule without path metadata may load unconditionally.

### Hooks are enforcement

Hooks execute deterministic code at lifecycle points:

- `PreToolUse`: approve, ask, or block before a tool runs;
- `PostToolUse`: format, test, log, or inspect after execution;
- `UserPromptSubmit`: validate or inject controlled context;
- stop, notification, and session lifecycle events.

A prompt instruction is probabilistic guidance. A pre-tool hook that denies a protected path is an enforced control. Use
exit/status semantics exactly as current documentation defines, and log both allowed and denied privileged actions.

### Subagents

Subagents have isolated context. Built-in exploration/planning agents may omit normal project context; general-purpose
or custom agents can load different sources. Required skills and project rules must be declared explicitly rather than
assumed to inherit.

## 3. Packaging reusable behavior

A Skill is an on-demand procedure selected from its description; `CLAUDE.md` is always-on repository context; current
conversation context is temporary. A portable Skill has a clear trigger description, avoids unjustified local-path
assumptions, and declares runtime or subagent dependencies.

Plugins bundle several extension types—skills, hooks, subagents, commands, or MCP configuration—into an installable
unit. Use relative paths, test from a clean installation, and respect enterprise marketplace allowlists. Manual-only
commands should disable automatic model invocation where supported.

Runtime matters:

- local Claude Code uses the developer's filesystem and permission system;
- API code-execution environments use managed containers;
- Agent SDK applications opt into configuration sources explicitly; and
- managed-agent platforms attach skills/configuration to a service resource with their own state and compliance limits.

## 4. MCP mental model

The Model Context Protocol lets a server expose:

- **tools** for model-requested actions;
- **resources** for read-only direct or templated data; and
- **prompts** for vetted reusable interaction templates.

Transport and configuration scope are independent decisions:

| Transport | Typical placement                        |
| --------- | ---------------------------------------- |
| stdio     | Local subprocess and developer tooling   |
| HTTP      | Remote, shared, authenticated production |
| SSE       | Legacy remote integrations               |

An MCP connection can be local, project-scoped, or enterprise-managed regardless of transport. HTTP is generally the
modern remote/shared choice; stdio is natural for a local child process.

Tool definitions consume context. Connect only required servers and use deferred discovery where supported. For repeated
large definitions, keep the prefix byte-for-byte stable and apply prompt caching within the supported TTL/breakpoint
rules.

## 5. Retrieval and MCP resources

Resources are appropriate for stable read-only data. A maintained semantic index suits a stable corpus and predictable
lookup; an agentic search loop suits changing sources and multi-step research. Keep source authorization and tenant
filters outside the model. Retrieval relevance does not confer permission.

## 6. Credentials and enterprise authentication

Never commit a secret in `.mcp.json`, source, or project instructions. Reference an environment variable or secret
manager. If a key is committed, removing it from the latest revision is insufficient: rotate/revoke it because
repository history and existing clones retain it.

Use OAuth when a remote service must act as the signed-in user. Register redirect URIs per environment and handle token
refresh and authorization failures. Use API keys or workload/service identity for unattended automation, injected by the
runtime's secret store. Apply least privilege, separation between environments, rotation, and an inventory of every
consumer.

For regulated deployments, address centrally managed configuration, audit evidence, regional processing, retention, and
platform-specific compliance eligibility during design. A `PostToolUse` audit hook can record access; a `PreToolUse`
hook should stop a forbidden action before it occurs.

## 7. Modernization pattern

When introducing Claude Code or MCP into an existing enterprise codebase:

1. explore in plan/read-only mode;
2. document universal conventions concisely;
3. move path-specific policy into scoped rules;
4. enforce protected actions with hooks;
5. package reusable procedures as Skills/plugins;
6. inject secrets at runtime; and
7. test installation, permissions, and audit output in a clean environment.

## Exam focus

Expect to distinguish permission modes, settings scopes, prompt guidance from hook enforcement, always-on context from
on-demand skills, tool/resource/prompt MCP primitives, stdio from HTTP, local/project/managed scope, user OAuth from
service identity, and secret removal from actual credential rotation.
