---
title: "Anthropic Certification Questions and Answers"
description: "Answers to commonly misunderstood concepts in Anthropic's Claude Certified Developer and Architect courses, with links to deeper technical notes."
sidebar_position: 3
keywords:
  - anthropic certification questions
  - claude certified developer
  - claude certified architect
  - claude code
  - study questions
---

This page explains concepts that are easy to misunderstand while preparing for Anthropic's Claude Certified Developer and Architect certifications. It is not a full course summary. Instead, each question isolates an important distinction, gives a direct answer, and links to a deeper technical explanation.

Product-specific behavior changes over time. The direct answers below preserve the decision rule, while the linked pages provide the fuller explanation and identify details that should be checked against current Anthropic documentation.

## Team Enablement and Operational Support

### Do API Skills Give Claude Access to External APIs?

No. In Anthropic's terminology, an **API Skill** is a reusable procedure selected by an application and executed in the Messages API code-execution environment. It does not grant arbitrary network access, supply credentials, or expose an external API by itself. The calling application must separately provide an authorized tool or integration and constrain what that tool can do.

Revisit: [Team Enablement and Operational Support — What an API Skill does and does not mean](/ai/agentic-system/production/team-enablement-and-operational-support#distribute-reusable-procedures-by-audience-and-control).

### How Should Teams Review AI-Generated Code?

Use a four-part verification gate: **correctness, security, maintainability, and human understanding**. Each dimension needs an explicit check, repeatable evidence, and a condition that blocks the change. Automate objective evidence such as tests, type checks, linting, dependency scans, and security scans, but do not merge code that the submitter cannot explain merely because automated checks are green.

Revisit: [Team Enablement and Operational Support — Diligence as a Verification Gate](/ai/agentic-system/production/team-enablement-and-operational-support#diligence-as-a-verification-gate).

### How Does Symptom-to-Cause Analysis Improve Operational Support?

An incident arrives as an observation — latency rose, output quality fell, or a tool failed — not as a proven cause. The durable support skill is to map that symptom to competing architecture hypotheses and run the cheapest checks that distinguish them. Fixing one incident yourself is firefighting; recording the symptom, hypotheses, discriminating checks, mitigation, cause, and verification in a runbook lets the team solve the next occurrence without depending on the original architect.

Revisit: [Team Enablement and Operational Support — Turn Operational Symptoms Into Team Knowledge](/ai/agentic-system/production/team-enablement-and-operational-support#turn-operational-symptoms-into-team-knowledge).

## Claude Code Configuration and Durable Context

### Which Claude Code Permission-Mode Distinctions Matter for Certification?

The distinction that matters is not memorizing a convenience setting; it is choosing a mode from the risk of the environment and the worst plausible action. Know what each mode auto-approves, what it still gates, why `bypassPermissions` belongs only in disposable isolation, and why a deny rule remains the hard boundary when a mode is permissive.

Revisit: [Claude Code Configuration and Permissions — Permission Mode Is a Risk Decision](/ai/agentic-system/claude-code-configuration#permission-mode-is-a-risk-decision-not-a-speed-decision).

### How Do CLAUDE.md, Rules, Hooks, and Subagents Differ?

They solve different problems, which is why they are separate mechanisms rather than one file. **CLAUDE.md** carries concise always-on project guidance. **Rules files** load narrower guidance for matching paths. **Hooks** run deterministic checks or side effects at fixed lifecycle points. **Subagents** isolate delegated work in a separate context. Putting all four concerns into CLAUDE.md increases context cost and turns enforceable controls into instructions the model may follow only probabilistically.

Revisit: [Durable Project Context — The Four Mechanisms at a Glance](/ai/agentic-system/durable-project-context#the-four-mechanisms-at-a-glance).

### What Is an Explicit Workflow Entry Point?

It means giving a saved procedure a name that a user invokes deliberately, similar to a terminal alias or an editor task. In current Claude Code, a skill can be invoked as `/skill-name`; setting `disable-model-invocation: true` makes it manual-only so the model cannot select it automatically. Plugin commands are namespaced, such as `/payments:run-tests`, to avoid collisions between plugins.

Revisit: [Durable Project Context — Giving a Workflow an Explicit Entry Point](/ai/agentic-system/durable-project-context#giving-a-workflow-an-explicit-entry-point).

### What Does the Three-Layer Configuration Exercise Test?

The exercise tests whether a developer can locate one defect at each layer rather than treating every problem as a prompt problem:

- Configuration layer: `bypassPermissions` removes the human gates on a production workstation.
- Packaging layer: an absolute path such as `/Users/priya/...` works only on the author's machine; use a project-relative path.
- Authentication layer: an inline key in `.mcp.json` enters repository history; rotate it and replace it with a runtime secret reference.

Revisit: [Claude Code Configuration and Permissions — A Worked Diagnostic](/ai/agentic-system/claude-code-configuration#a-worked-diagnostic-three-bugs-across-three-layers).

## Production Controls, Caching, and Development Tools

### How Do Guardrails Reduce AI System Risk?

A **risk** is the threat or failure mode; a **guardrail** is a runtime control that prevents, detects, contains, or safely routes that risk. The mapping is concrete: input screening counters direct prompt injection, retrieved-content and tool-output screening counter indirect injection, token and iteration caps contain budget exhaustion, action authorization limits tool abuse, and redaction or data-loss-prevention controls reduce data exposure. Guardrails lower risk, but no single guardrail eliminates it, so production systems use layered controls and define what happens when each control fails.

Revisit: [Safeguarding Agentic Systems — The Recurring Risk Categories](/ai/agentic-system/safeguarding#the-recurring-risk-categories) and [Guardrails in Practice](/ai/agentic-system/safeguarding#guardrails-in-practice-catalog--visuals).

### Where Is Prompt Caching Configured When Using Langfuse or AgentCore?

The **model request** owns provider prompt caching. On Anthropic's direct API, the request marks `cache_control` breakpoints; on Amazon Bedrock, the request uses the caching mechanism supported by that model/runtime. Langfuse can manage prompts and trace cache behavior, but it does not turn an arbitrary prefix into a provider cache by itself. AgentCore can host or orchestrate an agent, but it does not remove the need to configure caching through the underlying model invocation. In either case, verify that the framework or runtime passes the provider's cache fields through unchanged.

Revisit: [Caching — Messages API Cache Mechanics in Practice](/ai/agentic-system/caching#messages-api-cache-mechanics-in-practice) and [Amazon Bedrock — Prompt Caching](/aws/ai/bedrock#prompt-caching).

### How Can VS Code Enforce Checks on AI-Generated Changes?

There is no single editor-wide equivalent that every VS Code coding agent exposes as Claude Code's `PreToolUse` hook. Use the strongest deterministic checkpoint available at the layer you control:

- an agent lifecycle hook when the coding-agent host supports one;
- formatters, linters, or validation tasks for editor-time feedback;
- Git pre-commit hooks for checks before a commit;
- secret scanners such as Gitleaks or TruffleHog in pre-commit and CI; and
- protected branches and required CI checks before merge.

The reusable principle is **instruction versus enforcement**: telling an agent not to write a credential is guidance; mechanically rejecting a matching change before commit or merge is a control. For a credential already committed, prevention is too late — revoke or rotate it because removing it from the latest file does not remove it from history or existing clones.

Revisit: [Durable Project Context — Hooks](/ai/agentic-system/durable-project-context#hooks-deterministic-enforcement-at-fixed-points) and [Enterprise Integration — Managing the Secret After Authentication](/ai/agentic-system/production/enterprise-integration#managing-the-secret-after-authentication).

### How Do Claude Code and VS Code Retrieve Workspace Context?

Do not assume the two products retrieve workspace context the same way. Claude Code commonly performs **agentic search**: it decides what it needs, searches or reads files and symbols on demand, and iterates as the task develops. That is different from classical RAG, where files are chunked and embedded into an index before the question arrives.

GitHub Copilot in VS Code can use workspace indexing and other retrieval mechanisms to locate relevant code, but the exact implementation depends on the Copilot feature, repository size, settings, and current product version. The safe mental model is therefore not “every IDE assistant is an embedding RAG.” Ask whether the product builds an index ahead of time, searches live at request time, or combines both. Either way, retrieved code is context supplied to the model; retrieval quality and repository permissions still determine what the model can see.

Revisit: [Context Engineering — Memory Lifecycle](/ai/agentic-system/context-engineering#memory-lifecycle) and [RAG Foundations](/ai/llm/rag/rag-foundations).

## Authentication, Secrets, and Regulated Workloads

### Which Authentication Pattern Fits Each Service Type?

Choose the authentication pattern from the identity the service must represent. Use OAuth when a remote service acts on behalf of a signed-in user, a service credential when an unattended workload acts as its own system identity, and filesystem permissions for local resources. In multi-service systems, keep the user-to-platform identity leg separate from the platform-to-third-party leg so each boundary can be authorized and audited independently.

Revisit: [Authentication Patterns for AI Bridging Agents](/blog/2024/08/04/auth-bridging-agents) and [Enterprise Integration — Authentication Patterns by Service Type](/ai/agentic-system/production/enterprise-integration#authentication-patterns-by-service-type).

### How Should Regulated AI Workloads Handle Residency, Retention, and Audit Logging?

Treat these as separate but connected controls. **Data residency** determines where data may be processed and stored. **Retention** defines which prompts, outputs, traces, and decision records may be kept and for how long. **Audit logging** records enough identity, authorization, action, and decision evidence to reconstruct an incident or regulated outcome. The architecture must satisfy all three; meeting a residency requirement does not automatically provide an acceptable retention policy or an auditable decision trail.

Revisit: [Enterprise Integration](/ai/agentic-system/production/enterprise-integration) and [Fairness, Oversight, and Compliance](/ai/agentic-system/fairness-oversight-and-compliance).

### How Should Credentials Be Referenced from Committed Configuration?

A credential must not travel with the configuration that references it. Keep a variable reference in the committed file and inject the value at runtime from an environment variable or secret store. If a value is committed, deleting or overwriting it does not make it secret again; revoke or rotate it, inspect its consumers, and treat repository history and existing clones as exposed copies.

Revisit: [Enterprise Integration — Managing the Secret After Authentication](/ai/agentic-system/production/enterprise-integration#managing-the-secret-after-authentication).

## Production Engineering, Evals, and Security

These questions come from the production-hardening material: evals and judges, testing and tracing, failure handling, model selection, cost and orchestration, and security. The recurring theme is that development hides the failures production reveals, so each answer is about a decision made on paper before the failure shows up live.

### When Do I Use Exact Match, a Code Check, or an LLM Judge to Grade an Output?

The confusing case that motivates this: a feature should return the three capital cities of a region as a JSON array, a run returns the right three cities in a different order than the reference string, and an exact string match scores it **zero** even though the answer is correct. That is not a bug in the eval — it is the wrong grader. Exact match only works when there is exactly one acceptable string; any valid reordering or paraphrase breaks it. The fix for the JSON case is a **code grader** that parses the array and checks membership, because correctness there is a structural rule a function can evaluate. And when the output is an open-ended paragraph where no two good answers are worded the same, neither exact match nor a code check can judge quality, so an **LLM judge** is the only method that scales. The rule in one line: one correct form takes a match, a structural rule takes a code check, open-ended quality takes a judge. There is also a cost dimension — exact match and code checks run locally for almost nothing (so they can run on every commit), while a judge is a second model call per case (so it is reserved for a slower scheduled pass).

Revisit: [Evaluation — Choosing a Grader by the Shape of the Output](/ai/agentic-system/evaluation#choosing-a-grader-by-the-shape-of-the-output).

### Why Does an LLM Judge Need Calibration, and Why Does It Drift to a "Safe 6"?

The setup: you add an LLM-as-judge to your eval, it returns scores, and the scores look authoritative — but you have not checked whether they mean anything. Two failures hide here. First, a judge told to return **only a number** drifts toward a safe middle value (around six) regardless of actual quality, because a bare number has nothing to anchor it and hedging is the low-risk move; requiring strengths, weaknesses, and reasoning *before* the score forces the number to attach to specific evidence. Second, an uncalibrated judge can simply disagree with humans — so before relying on it, run it on human-labeled cases and measure agreement (report it with Cohen's kappa or Krippendorff's alpha, not an eyeballed percentage). A judge that agrees with humans half the time produces a rigorous-looking number worth nothing. Research backs both moves: G-Eval raises correlation by generating reasoning steps before scoring, and the MT-Bench work shows a strong judge reaching >80% agreement with humans — about the human-to-human level — which is the bar that turns a judge into evidence. If agreement is low, fix the rubric (tighten each band, add good/bad examples) and re-measure.

Revisit: [Evaluation — Calibrating a Judge So Its Scores Are Defensible](/ai/agentic-system/evaluation#calibrating-a-judge-so-its-scores-are-defensible).

### Should I Build a Small Eval Set or a Large One?

The instinct is to hand-craft a few perfect cases. The lesson is the opposite: build a **small labeled seed first**, then expand it — have the model generate additional cases from the seed and spot-check them — because coverage catches regressions that a perfect rubric on three cases never will. Twenty cases that include irregular and edge inputs catch a break that three carefully chosen cases never exercise. Coverage comes from volume, so a larger set with slightly noisier automated grading usually reveals more than a tiny hand-graded one.

Revisit: [Evaluation — The Grading Ladder](/ai/agentic-system/evaluation#the-grading-ladder) and [Validation Confirms Shape, Not Correctness](/ai/agentic-system/evaluation#validation-confirms-shape-not-correctness).

### What Does a "Partial Eval" Mean?

This came up from an exercise labeled "complete a partial eval." A partial eval is one **deliberately left incomplete** so you finish the specification yourself: some `expected_behavior` rows in the dataset are blank, and the judge's score-band definitions (what 1–3, 4–7, 8–10 each mean) are left to fill in. Completing it is the point — it checks whether you can state the exact output each input should produce and what each score band rewards, which is the same precision a real eval depends on.

Revisit: [Evaluation — The Eval Iteration Loop](/ai/agentic-system/evaluation#the-eval-iteration-loop).

### Why Did a Feature That Passed Every Validation Check Still Extract the Wrong Value?

The scenario: a feature extracted structured fields from customer messages, passed a dozen manual checks and input validation (non-empty text, a populated date field, a well-formed date), and shipped. Then a customer wrote *"I placed my order on March 3 but did not receive it until April 12"* and it extracted **April 12** as the order date — every validation check passed, because both dates are well-formed. The point that was easy to miss: **validation confirms a value has the right shape; it cannot confirm it is the right value.** The real cause was a missing graded case — the feature had never been measured against a two-date message, because nobody wrote that expected behavior down. The eval does not fix the extraction (a prompt change does); it detects the failure and guards against the regression forever after.

Revisit: [Evaluation — Validation Confirms Shape, Not Correctness](/ai/agentic-system/evaluation#validation-confirms-shape-not-correctness).

### In Testing, "You Don't Have to Pick One Strategy" — Which Strategy, and Why Is Routing Under Testing?

The sentence that confused me sits in the testing material and refers to the **retrieval strategy**: fetch-once (a single pass, good for a single-fact lookup in a stable corpus) versus agentic search (several rounds, good for multi-part questions). A cheap classifier routes each query to the right path so you pay for iteration only when the query needs it. Why does this appear under testing and tracing rather than retrieval? Because the router is not a test — it is a **new seam**. The `classify → path` handoff is exactly the integration boundary where silent failures hide: a cheap default that sends a multi-step question down the fetch-once path returns a confident, shallow answer that no unit test flags. So a mixed-strategy design *adds* an integration test (did each query class reach the right path?) and a trace field (which path ran); it does not reduce what you must test.

Revisit: [Testing and Tracing — Routing Between Strategies Is a Seam You Still Have to Test](/ai/agentic-system/testing-and-tracing#routing-between-strategies-is-a-seam-you-still-have-to-test).

### Isn't Returning `is_error` on a Failed Tool Call Something Every Framework Does Automatically?

I assumed a failed tool call would obviously be reported back to the model. It is **not automatic**. A handler that catches the exception and returns an empty result leaves the model treating that empty data as valid and reasoning confidently on top of a false premise — which produces a wrong answer that is much harder to catch than a visible failure. You have to set `is_error: true` explicitly on the tool result so the model knows the tool failed and can change approach, ask for clarification, or stop. A related edge case: a refusal arrives as a `200` with `stop_reason: "refusal"`, so the retriable classifier never sees it — treat it as terminal and raise it.

Revisit: [Rate Limits and Failure Handling — Surfacing Tool Errors to the Model](/ai/agentic-system/rate-limit#surfacing-tool-errors-to-the-model).

### How Do I Decide Whether a Failure Is Retriable or Terminal?

Production throws failures development never shows — rate limits, timeouts, transient drops, malformed responses. The single organizing question is: **would waiting and trying the identical request again plausibly work?** If yes, it is retriable (transient cause: `429` rate limit, `529` overloaded, `5xx` server errors); if no, it is terminal (cause is in the request: `400` bad request, `401` auth, `403` permissions). The `retry-after` header, when present on a `429`/`529`, tells you exactly how long to wait, which is more precise than guessing with backoff — so honor it first and fall back to exponential backoff only when it is absent. Classifying correctly is what preserves the retry budget; when unsure, default to terminal, because a failure wrongly marked terminal fails loudly and gets fixed, while one wrongly marked retriable hammers the service.

Revisit: [Rate Limits and Failure Handling — Retriable vs Terminal Failures](/ai/agentic-system/rate-limit#retriable-vs-terminal-failures).

### What Is the Mental Process for Choosing a Claude Model Tier?

Faced with Opus, Sonnet, and Haiku, the mistake is reaching for the strongest model by default — the most common and most expensive model-selection error, because it pays top-tier cost and latency on every request. The process instead is a default plus two eval-gated moves: **start at the balanced default (Sonnet)**, step **up to Opus only when an eval shows the default missing the bar on the hardest cases and a wrong answer is costly**, and step **down to Haiku only when an eval shows the quality drop is acceptable** on the bulk of traffic. In every direction the eval is the instrument, so a model change is promoted on a measured score, not a hunch. For mixed traffic, route: a default model with an override that sends specific request types to a larger or smaller model based on a cheap signal.

Revisit: [Model Selection in Production](/ai/agentic-system/model-selection#the-mental-process-default-then-move-on-evidence).

### How Does Streaming Work When the Response Includes a Tool Call?

This is the part of the cost/latency material I did not follow. With a normal (non-streaming) call the full response arrives as one object and the `tool_use` block is directly accessible. With streaming, the response arrives as a sequence of **server-sent events**, and a `tool_use` block's input accumulates across several delta events before it is complete. If you act on a partial block you get malformed tool inputs and a silent downstream failure. The handling: accumulate the `input_json` deltas keyed by block index, and only parse and run the tool once the block closes. This is not Claude-specific — any LLM API that streams tool/function calls as incremental deltas needs the same accumulate-then-act pattern. If the stream breaks mid-response, treat it as a transient failure and retry the whole request rather than passing the partial output on.

Revisit: [Cost, Latency, and Reliability — Streaming with Tool Use](/ai/agentic-system/production/cost-latency-reliability#streaming-with-tool-use).

### What Makes a Prompt Prefix Worth Caching, and Is Caching the Same on GPT and Bedrock?

Two linked confusions. First, the economics: a cache **write** costs more than a normal input token (roughly 1.25x for a 5-minute TTL, 2x for 1-hour), while a cache **read** costs about 0.1x — so caching only pays when **reads outnumber writes**. That is why you cache stable content. Second, "how do I define a stable prefix when my input is 1 MB of JSON that changes every request?" You do not cache the JSON — it never repeats. You cache the parts that *do* repeat (the long system prompt and the tool schema) by placing the breakpoint **after them but before the variable JSON**. Three general rules decide if caching helps: the prefix must be identical (any change before the breakpoint invalidates it), it must recur within the TTL window, and it must clear a minimum token length. These rules are general — GPT and Bedrock both cache too, but the knobs (automatic vs explicit, TTLs, minimums, pricing) are provider-specific, so the three properties are the portable model and the numbers are a per-provider lookup.

Revisit: [Caching — The Economics](/ai/agentic-system/caching#the-economics-why-reads-must-outnumber-writes) and [What Makes a Prefix Worth Caching](/ai/agentic-system/caching#what-makes-a-prefix-worth-caching-general-rules).

### When Is Multi-Agent Orchestration Worth the Cost?

The scenario: a task ran slowly, so it was split across parallel sub-agents expecting a speedup — latency dropped a little, but the bill came back several times higher while quality barely moved. The reason is that each sub-agent spends its own tokens in its own context, so cost **multiplies** rather than adds (Anthropic reports roughly 15x the tokens of a normal chat for its own multi-agent research system). Hold it as a **hiring decision**: five researchers finish a broad survey faster than one, but you pay five salaries, and you only hire the team when the work genuinely splits into parts that run without waiting on each other. On tightly coupled work like coding, each step depends on the last, so the sub-agents mostly wait — you pay the multiplier for nothing. And orchestration *multiplies the failure handling* too: each sub-agent is an independent call needing its own retry, backoff, and fallback, so more agents mean more failure points, not just more tokens.

Revisit: [Agent-to-Agent — The Cost of Orchestration](/ai/agentic-system/agent-to-agent#the-cost-of-orchestration-a-token-multiplier-not-a-free-speedup).

### Why Set a Reliability Floor Before Optimizing Cost, and Why Does Cutting Cost Reduce Reliability?

The confusion: lowering cost should not by itself make an endpoint less reliable — so why does the material tie them together? Two mechanisms. A cheaper model can miss harder cases, raising the error rate, which burns the retry budget; and cutting the retry count to save money directly lowers reliability. So cost and reliability pull in opposite directions, and cost is the louder pressure (a high bill shows on a dashboard daily; reliability problems look like dismissible noise until they become an incident). The fix is an ordering rule: **set the reliability floor first** (for example, complete within 4 seconds, up to 3 retries), then optimize cost *beneath* it — a cheaper model is fine only if it still fits the latency ceiling and does not burn the retry budget. It is the same three-way discipline as caching and model selection: you do not chase one dimension in isolation, and a pinned eval baseline makes the floor enforceable on every change.

Revisit: [Cost, Latency, and Reliability — Setting the Reliability Floor Before Optimizing Cost](/ai/agentic-system/production/cost-latency-reliability#setting-the-reliability-floor-before-optimizing-cost).

### How Do I Secure an Agent That Reads Untrusted Content, and Where Were the "3 Manual Demo Runs"?

The security lesson: for an agent that fetches untrusted web content and writes to a protected path, the reliable boundary is not careful prompt wording — it is what the agent is *allowed to do*. The minimal configuration is four controls: a `PreToolUse` hook that denies writes outside the permitted path, a deny rule for sensitive paths, a secret read from the environment (never committed), and an audit-log line on every privileged action. Least privilege is load-bearing because it holds even when the model's training and classifiers fail to stop an injection. The cumulative exercise that confused me asked about "three manual demo runs" — those are **only in the answer prose**, describing what the team did *instead of* writing an eval; there is no eval in the code, and that absence is the first of the three planted defects (the other two being the instant-retry loop and the unguarded write path).

Revisit: [Safeguarding — The Minimal Secure Agent Configuration](/ai/agentic-system/safeguarding#the-minimal-secure-agent-configuration) and [Worked Example: Three Defects Across Three Layers](/ai/agentic-system/safeguarding#worked-example-three-defects-across-three-layers).

## Accelerators and IP Contribution

These questions come from the module on packaging assets for reuse, contributing them back to shared infrastructure, turning a business problem into requirements, and choosing where a Claude workload runs. The recurring theme is the difference between a thing you build *once* and a thing a team or a customer can *reuse and deploy safely*.

### What Are Reusable Assets (Agent Template, MCP Server, Eval Suite), and Does One Eval Suite Fit All Agents?

The setup: the module says to package an "agent template", an "MCP server", and an "eval suite" for reuse, and it was unclear what each is and how they are reused. An **agent template** is the whole runnable agent definition — prompts, the graph or loop, tool wiring, and thresholds — not just the agentic graph; it becomes reusable because a new engagement *sets values* (prompts, paths, scopes, credentials by reference, thresholds) rather than editing code. An **MCP server** matters because it is the reusable *connection* to a customer system, so its scopes, credentials-by-reference, and per-customer paths are what you parameterize. An **eval suite is not** one universal accuracy metric that fits every agent — each solution gets its own rubric and dataset pinned to a baseline score; what is reusable is the harness and the discipline, while thresholds and dataset paths change per customer. The common pattern across all three is: parameterize what changes per customer, document the assumptions, and bundle an audit trail.

Revisit: [Team Enablement — Packaging an Asset for Reuse](/ai/agentic-system/production/team-enablement-and-operational-support#packaging-an-asset-for-reuse).

### Is "Contributing Back" Just Uploading to the Claude Cookbook? Isn't My Asset Already the Reusable Thing?

The confusion: the module talks about "contributing back" and I could not tell whether that meant uploading my reusable pattern to the Claude Cookbook, or whether the Cookbook *was* the reusable thing. They are two different things. Your **private reusable asset** is what you build customer solutions from. **Contributing back** is the separate, optional act of donating a *focused* pattern to shared external infrastructure through a documented channel. The "channel" is the destination repository: the **Claude Cookbook** is a GitHub repo of focused, end-to-end reference implementations, and **MCP servers/tools** each live in their own repo. Sending a whole multi-component application to the Cookbook is a channel mismatch and stalls. "Readiness" is the test pack and docs that let a maintainer verify it, and four things make verification possible: the code does one thing, an example runs it, a test proves it, and a short note states the assumptions.

Revisit: [Team Enablement — Contributing Back: Match the Contribution to the Channel](/ai/agentic-system/production/team-enablement-and-operational-support#contributing-back-match-the-contribution-to-the-channel).

### How Do I Turn a Business Problem into Functional Requirements, and When Do I Stop?

The scenario: a business problem like "help support agents answer faster" is not yet something you can build, and it was unclear how to break it down, how detailed to get, and what "checkable and tied to a specific business-process constraint" means. A **functional requirement** names what the system must do, stated precisely enough to verify — "classify each ticket into one of four queues", "never auto-send without human approval". The test for where to **stop** decomposing is exactly checkability: stop when each statement is specific enough to become a line in an eval and a review criterion; anything more detailed is design, not requirements. AI agents add functional dimensions that web and mobile apps rarely have — tone, the tools the agent may call, the skills it loads, the guardrails it must honor — but these are captured the same checkable way. A rough role split: the BA or lead owns *what must be true and verifiable*; the AI engineer owns *how* it is built.

Revisit: [Feasibility and Use-Case Sizing — From a Business Problem to Functional and Infrastructure Requirements](/ai/agentic-system/production/feasibility-and-sizing#from-a-business-problem-to-functional-and-infrastructure-requirements).

### Does It Actually Matter to Classify Requirements as Functional vs Infrastructure?

Yes, because the two kinds flow to different places: **functional requirements become evals**, and **infrastructure requirements (latency, scale, residency, identity) decide the deployment platform**. Misfiling one hides a constraint until contract review. The EU-bank example makes it concrete: "a human approves before it is stored" is a *functional* requirement (checkable, tied to a business-process constraint); "transcript data is processed in the EU" is an *infrastructure* requirement (checkable, tied to a regulatory constraint); "fast and accurate" is neither, because it is not checkable against any threshold.

Revisit: [Feasibility and Use-Case Sizing — From a Business Problem to Functional and Infrastructure Requirements](/ai/agentic-system/production/feasibility-and-sizing#from-a-business-problem-to-functional-and-infrastructure-requirements).

### When I Use Claude "on AWS", Is AWS Running the Model or Is Anthropic?

The surprise: I assumed that calling Claude through AWS meant AWS operated the inference, but there are two different AWS paths with different answers. **Claude Platform on AWS** is accessed *through* your AWS account using Anthropic's model IDs, but **inference is Anthropic-operated and runs outside the AWS boundary** — the data leaves AWS for inference. **Claude in Amazon Bedrock** runs **inside your configured AWS Region**, so data stays in the AWS boundary. For a residency-constrained customer, that difference is pass-or-fail. This mirrors how other providers work too: accessing a model through a cloud marketplace does not always mean inference runs inside that cloud's boundary — confirm per platform.

Revisit: [Deployment Platform Selection — Where Inference Actually Runs](/ai/agentic-system/production/deployment-platforms#where-inference-actually-runs-the-boundary-that-matters).

### Claude in Amazon Bedrock vs Claude Platform on AWS — What's the Difference, and Is InvokeModel/Converse Legacy?

Because AWS is the platform I use most, this is the distinction worth pinning down. **Claude Platform on AWS**: Anthropic model IDs and lifecycle, inference Anthropic-operated *outside* the AWS boundary. **Claude in Amazon Bedrock**: data stays *inside* the AWS boundary, accessed via the **Messages API** at `/anthropic/v1/messages` with "broad feature parity" — meaning it exposes nearly the same request features as the first-party API (system prompts, tool use, prompt caching, streaming), minus a current not-supported list. That Messages API is the newer, Anthropic-native path; **`InvokeModel`** (a single, stateless, model-specific call) and **`Converse`** (AWS's unified, model-agnostic, multi-turn/tool-use API) are the older Bedrock-native path. Your recollection is close: `Converse` is the unified conversational API, while `InvokeModel` is the single stateless one. Each provider also has its own native format — OpenAI uses Chat Completions / Responses — so "the native way to call it" differs per provider, and Bedrock additionally wraps models in `InvokeModel`/`Converse`.

Revisit: [Deployment Platform Selection — Claude in Amazon Bedrock vs Claude Platform on AWS](/ai/agentic-system/production/deployment-platforms#claude-in-amazon-bedrock-vs-claude-platform-on-aws) and [Amazon Bedrock — Runtime APIs](/aws/ai/bedrock#runtime-apis-invokemodel-streaming-and-converse).

### Is Microsoft Foundry Residency "Per Model" About the LLM or a Pricing Tier?

It is about the **LLM model**, not a hyperscaler pricing tier. Microsoft Foundry hosts Claude in two forms — **Azure-hosted** (inference runs end-to-end on Azure infrastructure, using Azure identity via Entra, so data stays in the Azure boundary) and **Anthropic-hosted** (inference runs on Anthropic-operated infrastructure). Which form applies depends on the **specific Claude model** you select, so whether a given deployment satisfies EU-only residency must be confirmed model-by-model with Microsoft. Each cloud brings its own identity system: AWS IAM, Google Cloud IAM, and Azure Entra.

Revisit: [Deployment Platform Selection — Identity and Data Residency Are Answered by the Platform](/ai/agentic-system/production/deployment-platforms#identity-and-data-residency-are-answered-by-the-platform).

### Do I Still Need to Pin the Model Date, and What Is Pinning Actually For?

The question: with newer models, do we still append a date to the model ID, and does this differ by provider? For **Claude 4.6 and later, the model ID alone pins** a snapshot; for earlier Claude models, the ID **plus a date suffix** is required. Other providers (OpenAI and others) have their own snapshot conventions, so the rule generalizes: pin the **most specific identifier the provider offers**, never a moving alias like "Opus" or "Sonnet". The purpose is exactly stable behavior — a pinned snapshot means an upstream model update is a deliberate choice you adopt, not a silent change to your agent's output.

Revisit: [Deployment Platform Selection — Pin the Version](/ai/agentic-system/production/deployment-platforms#pin-the-version-so-an-upstream-change-is-not-a-silent-change).

### "Retaining the Prior Version Gives a Rollback Target" — Why, If the Provider Still Serves the Old Model?

The confusion: if the old model is still callable, why does retaining a prior version matter? Because "rollback target" is not about the old model disappearing — it is about retaining *your* **known-good pinned configuration** (the prior model ID plus the matching prompt and asset versions) so you can redeploy it deliberately. The risk being managed is the **new** version silently changing behavior; the retained prior pin is what lets you revert cleanly. In short, it is about whether you can still find and redeploy the exact config, not about model availability.

Revisit: [Deployment Platform Selection — Pin the Version](/ai/agentic-system/production/deployment-platforms#pin-the-version-so-an-upstream-change-is-not-a-silent-change).

### What's the Cost Difference Between Global and Regional Endpoints?

The context: latency should be measured from the customer's actual region, and in Bedrock the choice between global and regional endpoints is also the primary residency control and "can affect cost". A **global endpoint** may route a request across Regions, which often improves availability and throughput and can carry different pricing; a **regional endpoint** pins processing to one Region, which is the residency control and may price differently. The practical rule is to measure both latency and total cost **from the customer's actual region against both endpoint options** before committing, since the headline token price is not the whole cost (data egress and platform fees vary too).

Revisit: [Deployment Platform Selection — Comparing Platforms on Latency, Compliance, and Cost](/ai/agentic-system/production/deployment-platforms#comparing-platforms-on-latency-compliance-and-cost).

### Did We Mention "Data Residency" Anywhere on the Site?

Yes. **Data residency** — the rule that a customer's data must be processed in a specific country or region — appears in [Enterprise Integration](/ai/agentic-system/production/enterprise-integration) (as a compliance-first constraint) and in the AWS [Responsible AI and Security](/aws/ai/responsible-ai-and-security) notes, and it is now the central residency control in [Deployment Platform Selection](/ai/agentic-system/production/deployment-platforms#identity-and-data-residency-are-answered-by-the-platform). For regulated finance and healthcare customers it is treated as pass-or-fail, which is why it often ends the platform debate before latency or cost is weighed.

Revisit: [Deployment Platform Selection — Comparing Platforms on Latency, Compliance, and Cost](/ai/agentic-system/production/deployment-platforms#comparing-platforms-on-latency-compliance-and-cost).

### Should I Avoid Creating Too Many Agents, and What Is a "Component" or "Deployment Unit"?

The worry: every component adds a trust boundary you cannot see inside, so should you minimize agents? A **component** (or deployment unit) is any independently running piece that holds an identity and does work — the API orchestrator, a Claude Code task, an MCP server, a microservice, a function, a container. More components do mean more **seams** to secure, but the lesson is not "use fewer agents": it is **scope each component to least privilege and treat every seam as a trust boundary**. The application is only as contained as its most over-privileged component, so a single broadly-scoped seam is the weak point even when everything else is tight.

Revisit: [Safeguarding — Trust Boundaries Across a Multi-Component Application](/ai/agentic-system/safeguarding#trust-boundaries-across-a-multi-component-application).

### Why Does the Module Keep Using MCP Servers — Isn't That Outdated Given Tools and A2A?

The module illustrates external reach with an MCP server, which made it seem like MCP is the only way an agent reaches the outside world. It is not — a direct **tool call** or an **agent-to-agent** hop reaches external systems too. MCP is just the module's **representative** external-reach component for teaching the boundary principle; the same trust-boundary and least-privilege rules apply to tools and A2A equally. So yes, you can use A2A or tools; MCP is the stand-in, not a requirement, and the part is not outdated.

Revisit: [Safeguarding — Trust Boundaries Across a Multi-Component Application](/ai/agentic-system/safeguarding#trust-boundaries-across-a-multi-component-application).

### Do These Packaging/Versioning/Boundary Layers Matter to the AI SDLC, or Only If I'm Building Reusable Access?

The doubt: the layers felt like they only matter when building reusable access for a company — if you don't build that, do they matter? **Packaging** matters most when an asset is reused, so a true one-off throwaway can skip it. But **versioning and trust boundaries matter in any production deployment**, reusable or not: an unpinned model still changes behavior silently, and an unguarded seam is still an injection path. The cumulative exercise plants one defect per layer — a hardcoded path (packaging), a moving model alias with no rollback (versioning), and fetched content passed as instructions (boundary) — precisely because real deployments fail across all three at once, not one at a time.

Revisit: [Deployment Platform Selection — A Worked Example: Three Defects in a Deployable Asset](/ai/agentic-system/production/deployment-platforms#a-worked-example-three-defects-in-a-deployable-asset).
