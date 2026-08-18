# Claude Platform & Solution Design

Private study notes for Module 1 of the Claude Certified Architect — Professional Prep Course.

- Course duration: 238 minutes
- Module structure: 34 screens, 12 sections, and 11 checkpoints
- Source reviewed: 18 August 2026
- Source page: Anthropic Academy on Skilljar

These notes preserve the module's teaching sequence and technical substance in paraphrased form. Product availability,
pricing, model names, and compliance coverage can change; verify deployment decisions against current Anthropic and
cloud-provider documentation.

## The four decisions that shape a Claude solution

Architecture begins before implementation. The module organizes solution design around four questions:

1. **What work should Claude own?** Separate language and reasoning work from deterministic system responsibilities and
   human judgment.
2. **What shape should the work take?** Decide whether Claude participates in a bounded call, a coded workflow, or an
   autonomous agent.
3. **Which reference architecture fits?** Start with a proven system shape and adapt it to the workload instead of
   inventing every connection from scratch.
4. **Where does the solution meet Claude?** Choose the entry point, build-time interface, model, context strategy, and
   delivery route under the partner's operational and governance constraints.

The order matters. Selecting a model or product surface before decomposing the work often creates an expensive pivot
later.

## How Claude behaves

The module treats model behavior like an engineering material: its properties are neither defects nor guarantees, but
forces the architecture must accommodate.

| Property              | Useful capability                                                                                     | Architectural limitation                                                                                                  | Typical mitigation                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Next-token prediction | Strong performance on familiar language patterns such as explanation, reformatting, and summarization | Fluent output can still contain incorrect names, dates, citations, or statistics                                          | Ground factual claims in authoritative sources, expose uncertainty, and use generator-verifier loops                        |
| Knowledge             | Reliable coverage of common, recent, and consistently represented topics                              | Rare, private, disputed, or fast-changing information may be stale or incomplete                                          | Bring the source of truth into the request with retrieval, web access, tools, or MCP                                        |
| Working memory        | Can reason over material inside the active context window                                             | Material outside the window is unavailable; oversized inputs fail, while generations can also stop at the context ceiling | Count tokens, reserve output headroom, load context progressively, chunk inputs, and compact long histories                 |
| Steerability          | Responds well to concrete roles, formats, limits, and verifiable instructions                         | Ambiguous intent, long logical chains, and precise computation can drift                                                  | Use explicit system prompts, structured outputs, deterministic computation, and restate the goal as well as the instruction |

These properties lead to four design consequences:

- **Non-determinism requires evaluation.** A handful of successful demonstrations does not establish repeatable
  behavior.
- **Context is a finite resource.** Context selection, ordering, and omission affect quality, cost, and latency.
- **Confidence is not validity.** Fluent delivery does not remove the need for verification or human review.
- **Knowledge has boundaries.** Private, live, and authoritative facts should come from systems that own them, not from
  model memory.

A production architecture that assumes the model is deterministic can drift silently. The module illustrates this with a
reconciliation system whose repeated inputs produced different classifications after launch. The failure was not that
Claude varied; it was that the design had no evaluation or verification around a known probabilistic component.

## Platform map and solution primitives

### Keep the three platform layers separate

Every deployment makes a decision at each of these layers. They are related, but they are not substitutes.

| Layer                | Decision                                             | Examples                                                                    |
| -------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------- |
| Entry point          | What a person or application directly interacts with | Claude.ai, Claude Desktop, Claude Code, or a custom application             |
| Build-time interface | What engineers program against                       | Direct API, language SDKs, MCP, or the Claude Agent SDK                     |
| Delivery route       | Where inference traffic terminates and is billed     | Anthropic first-party API, AWS Bedrock, GCP Vertex AI, or Microsoft Foundry |

The user and task determine the entry point. Engineering needs determine the build-time interface. Cloud commitments,
procurement, identity, residency, and compliance determine the delivery route. Collapsing the layers can lead to choices
such as placing a developer terminal tool in front of branch staff simply because all of the options ultimately use
Claude.

### Seven primitives

Patterns and reference architectures are assemblies of a small vocabulary of parts.

| Primitive         | Job                    | Meaning                                                                             |
| ----------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| Tools             | Act                    | Let Claude call a function to retrieve data or take an action                       |
| MCP               | Connect                | Expose reusable tools, prompts, and resources to multiple compatible clients        |
| Subagents         | Isolate or parallelize | Give a bounded subtask its own context, instructions, and tool boundary             |
| Hooks             | Guarantee              | Run deterministic code on lifecycle events so a rule cannot be skipped by the model |
| Skills            | Package a procedure    | Version reusable instructions and optional scripts as a governed unit               |
| Agent teams       | Coordinate peers       | Give multiple agents ownership of different parts of a shared goal                  |
| Dynamic workflows | Compose at runtime     | Assemble workflow steps during execution rather than fixing every step in advance   |

Use the fewest primitives that satisfy the requirement. Every added primitive increases tokens, latency, observability
work, and governance surface area.

## Decompose before selecting an architecture

Every capability should have an explicit owner.

| Owner            | Appropriate responsibility                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| Claude           | Language interpretation, summarization, planning, drafting, classification, and tool-mediated action        |
| Existing systems | Live state, deterministic rules, calculations, transactions, and records the partner already makes reliable |
| Humans           | Judgment, approval, exceptions, accountability, and high-stakes or irreversible decisions                   |

Decomposition creates a delegation map. Ask three questions before assigning work to Claude:

- Can an incorrect result be reversed?
- What is the cost or consequence of being wrong?
- Who remains accountable for the decision?

For a claims assistant, Claude can read an unstructured claim and draft an email. A rules engine should determine
priority; a policy system should provide current coverage; the email service should send the message; and a human should
approve high-value or exceptional outcomes. The better framing is not merely “Where can Claude help?” but “Where do
Claude's properties make it a better owner than the reliable system or person already responsible?”

### Failure pattern: deterministic drift

The course's example replaces a precise claim-routing threshold with a prompt. Clean numeric examples work during
development, but ambiguous wording around the threshold is interpreted inconsistently in production. Because the
decision is inside a model call, normal SQL-rule monitoring does not expose it. The audit finds the problem months
later.

The lesson is simple: deterministic business rules belong in deterministic code. Claude may extract a normalized value
from language, but code should apply the threshold, log the result, and expose a testable control.

### Checkpoint takeaways

For a field-service assistant, suitable assignments are:

- **Claude:** summarize case notes, extract a part number from an image, and draft a customer email.
- **Existing systems:** return inventory, calculate billable time, and check a warranty against the current record.
- **Humans:** approve large refunds and decide whether to escalate safety events.

For a shipping-exception workflow, Claude reads the carrier note and drafts the notification. The policy engine
determines eligibility, the customer system returns contract tier, and the transaction service issues the refund under
the approved rules.

## Select the pattern by autonomy and predictability

| Pattern            | Control flow                                                   | Best fit                                                       | Main cost                                                                        |
| ------------------ | -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Augmented LLM call | One bounded model invocation; surrounding code owns the wiring | Well-defined, verifiable tasks that do not need branching      | Model variability is concentrated in one opaque step                             |
| Workflow           | Named steps and branches are orchestrated in code              | Enumerable processes where error cost and observability matter | Latency and cost accumulate with each step                                       |
| Agent              | Claude chooses its own sequence of tool calls toward a goal    | Work whose path genuinely cannot be enumerated in advance      | Open-ended runtime, growing context, audit difficulty, and broader autonomy risk |

Agents should have narrow tool permissions, turn or cost budgets, stopping criteria, and human gates before
consequential actions. An agent is not the safe default when the team has not yet decided how to structure the work. If
traces reveal only a small number of repeatable paths, encode them as a router and coded chains.

### Workflow sub-patterns

| Shape               | Mechanism                                                                          | Example fit                                                                 |
| ------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Chaining            | Each stage consumes the previous stage's output                                    | Extract obligations, classify risk, then draft a legal memo                 |
| Routing             | A classifier selects a downstream path                                             | Send billing, technical, and escalation tickets to different handlers       |
| Parallelization     | Independent calls run concurrently and are aggregated                              | Review many contracts or files at the same time                             |
| Evaluator-optimizer | A generator revises against evaluator feedback until a quality gate or retry limit | Validate structured extraction or grade a drafted response against a rubric |

Choose using the tightest constraint among predictability, error cost, observability, latency, and per-request cost.
Start with the simplest pattern that meets the requirement and increase autonomy only when evidence shows the simpler
shape is insufficient.

Before considering fine-tuning, improve the prompt, add grounding or tools, and consider a stronger workflow such as
evaluator-optimizer. Fine-tuning earns its place mainly when high volume, strict latency, or a persistent formatting
need justifies a smaller specialized model and the route actually supports it.

### Multi-agent orchestration

In a multi-agent design, the orchestrator owns the overall goal, decomposition, delegation, and synthesis. Subagents own
scoped units of work in separate contexts. The architect must define:

- how work is split;
- the result schema each subagent returns;
- validation, retry, and gap-handling at every subagent boundary;
- conflict-resolution rules during synthesis;
- checkpoints for resuming orchestrator state;
- a shared trace identifier across the entire run; and
- human gates before irreversible or high-stakes actions.

Subagent failures are usually recoverable; an orchestrator losing the goal or synthesis state may invalidate the whole
run. Make subagent work idempotent and retryable, then protect and checkpoint the orchestrator.

The fan-out failure case sends 50 contract sections to subagents but receives only 48 results. Without a coverage
invariant, the orchestrator produces a polished summary over incomplete work. The synthesis rule should require
`returned units == dispatched units`; otherwise it must retry or report the gap.

In the orchestration checkpoint, the defective components are the synthesis step that sums only returned results, the
irreversible auto-archive action without a human gate, and the missing retry or gap flag for a failed subagent.

## Apply reference architectures deliberately

Reference architectures are reusable shapes, not diagrams to copy unchanged.

| Architecture             | Healthy design                                                                                                           | Common failure                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Agent                    | Goal-oriented tool use with constrained permissions, budgets, stopping rules, and review                                 | Unbounded state-changing tools and no human checkpoint              |
| RAG                      | Stable knowledge is chunked, indexed, retrieved, and passed into context                                                 | Treating a snapshot index as the source of live transactional state |
| Document processing      | OCR, schema-based extraction, validation, evaluator pass, and an exception route                                         | Sending low-confidence extractions through the normal path          |
| Customer-service routing | Intent classification routes knowledge questions, live-state queries, and high-consequence actions to different backends | Using retrieval for order status or omitting human escalation       |
| Coding agent             | Agentic exploration is followed by deterministic edit, test, and review steps                                            | Allowing unreviewed edits or commits and measuring no regressions   |

Combine architectures only when distinct parts of the system have different failure modes that deserve separate
controls. Combining patterns because the problem is still unclear is deferred design, not architecture composition.

### Stable knowledge versus live state

RAG is suited to manuals, policies, regulations, and other material that remains valid between index refreshes. Live
values such as an order status, account balance, appointment slot, or inventory count must come from the owning system
via a tool call.

Embedding similarity measures semantic closeness, not truth or recency. A vector index can retrieve two historically
correct but now stale order snapshots and produce a confident answer that reflects neither current state. Better
chunking or more frequent refreshes do not repair the category error.

In the architecture-critique checkpoint, the misapplied components are retrieval over an order-status index, an
autonomous loop with refund/cancel/update tools and no review gate, and the missing human escalation path.

## Design the RAG pipeline around data and queries

### Chunking

| Approach                | Use when                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------- |
| Fixed-size with overlap | Text is homogeneous and has few meaningful structural boundaries                      |
| Semantic                | Prose should be split at topic or meaning boundaries so each passage remains coherent |
| Hierarchical            | Contracts, policies, and manuals have sections whose structure carries meaning        |

### Indexing

| Strategy                      | Best at                                                                |
| ----------------------------- | ---------------------------------------------------------------------- |
| Dense embeddings              | Paraphrases, concepts, intent, and semantically similar wording        |
| Sparse retrieval such as BM25 | Exact names, codes, identifiers, and citations                         |
| Hybrid                        | Mixed production queries that require both semantic and exact matching |

Hybrid retrieval produces two rankings. Reciprocal rank fusion is a defensible, low-tuning default for combining them
because it rewards items that rank highly in either or both lists.

The core tradeoff is retrieval quality versus latency and maintenance. Retrieval must be evaluated with labeled queries;
a fluent final answer does not reveal whether the correct chunk was retrieved.

For the course exercise's mixed corpus:

- Use hierarchical chunks for sectioned contracts and the methodology handbook.
- Use semantic chunks for long-form project write-ups.
- Use a hybrid dense-plus-sparse index because queries range from exact clause lookup to conceptual synthesis.

## Choose model and context as production controls

### Separate four kinds of information

- **Context window:** the active attention space for the current request.
- **Retrieval:** external knowledge selected at query time and inserted into the context window.
- **Persistent application state:** live records owned by the application or a system of record and accessed through
  tools.
- **Summaries or memory layers:** continuity stored by the application and passed into later requests; the model has no
  automatic cross-call memory.

### Model selection and evaluation

The course recommends starting with Sonnet for the typical balance of quality, speed, and cost. Move to Opus only when
an evaluation shows Sonnet misses the quality bar. Move to Haiku only when an evaluation shows the lower-cost model
stays within the task's tolerance.

Treat a model swap as a release. Before testing the change, define:

1. a representative, stratified test set with known-good targets;
2. a consistent grading function or rubric; and
3. a rollback threshold chosen before results are visible.

The module's downgrade example finds that Haiku performs acceptably on most document types but falls below the preset
threshold on two. Rather than accept an unsafe full migration, the architecture routes difficult document types to
Sonnet and the rest to Haiku.

### Context strategies

| Strategy    | Strength                                                         | Failure mode                                                                      |
| ----------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Monolithic  | Simple and useful for bounded tasks or stable cacheable prefixes | Input cost grows, attention becomes diluted, and long sessions hit a hard ceiling |
| Progressive | Carries only what the next step needs                            | Earlier detail may be lost and exact prior inputs become harder to reconstruct    |
| Retrieval   | Loads a relevant slice of a large or changing corpus             | Recall and chunking failures can keep the needed source out of context            |
| Compaction  | Summarizes an accumulated history at phase boundaries            | A summary can drop identifiers, decisions, numbers, or rare edge cases            |

Production workloads commonly layer all four. A coding agent can begin with a small monolithic task prefix, carry recent
tool results progressively, retrieve files on demand, and compact old exploration once only its conclusions matter.
Context sizing and context strategy remain separate decisions: the window is a ceiling, not a utilization target.

### Extended thinking

Extended thinking adds a billed reasoning pass and latency to a request. The course recommends evaluating the prompt
without it first, then enabling it only when measured accuracy justifies the tradeoff. Control mechanisms differ by
model generation, so current model documentation is authoritative.

The cost-overrun case defaults every step to Opus and even enables thinking on a simple classifier. Building per-step
evals later allows routing the classifier to Haiku, intermediate summaries to Sonnet, and only the quality-sensitive
final step to Opus. The lesson is that omitting a model-tier decision is itself a costly decision.

## Treat prompting as architecture

An enterprise prompt is a governed asset, not an ad hoc sentence. It should define role and scope, fixed constraints,
and an explicit output contract. A reusable template holds this stable scaffolding around parameterized request data so
a user cannot accidentally remove the safety rules.

Prompt description should make three things explicit:

- what is inside and outside the task's scope;
- the exact output shape; and
- constraints that must always hold.

Where the prompt is silent, the model makes assumptions. That underspecification becomes repeated non-determinism at
production volume.

### Technique selection

| Technique                     | Use when                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------- |
| Zero-shot                     | The task is clear, bounded, and reliably handled from instructions alone      |
| Few-shot                      | Examples communicate the desired format or judgment more clearly than prose   |
| Explicit structured reasoning | Interacting conditions or multi-step logic make skipped steps a material risk |

Start with the lightest technique that meets the quality bar. Examples and reasoning scaffolds increase maintenance,
tokens, and latency. Prompts must be re-evaluated when the model changes because the prompt-model pair is the deployed
artifact. Use neutral wording and balanced examples to avoid introducing bias.

### Caching, modular prompts, and Skills

Prompt caching depends on a stable prefix. Put fixed instructions first, set the cache boundary, and place
request-specific content after it. Choose a time-to-live that matches call frequency and content stability. For a small
or rarely reused prefix, cache-write overhead may exceed the savings.

A prompt library provides fragments and templates that engineers compose inside a team or codebase. A Skill is a
versioned procedure containing instructions and, when needed, scripts. Prefer a Skill when the procedure should run
consistently, cross team or product boundaries, and support approval, rollback, and governance.

For the reusable support-reply exercise:

- Place role, tone, citation rules, output contract, and refund/timeline guardrails in the stable prefix; put the ticket
  and manual passage after the cache boundary.
- Represent prohibited promises in the output contract and validation layer, not only as prose in the role description.
- Package the procedure as a versioned Skill because it runs repeatedly across an organization and needs central
  control.

## Select entry point, interface, and route under governance

Make the decisions in this sequence: choose the entry point for the work and user, the build-time interface for the
engineering team, and the delivery route for the partner's cloud and compliance posture.

### Entry points

| Entry point                   | Suitable audience and work                                                                  | Main tradeoff                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Claude.ai and Claude for Work | Knowledge workers doing research, drafting, analysis, and review                            | Fast adoption and a ready-made interface versus limited embedding and customization |
| Claude Code                   | Engineers exploring and modifying codebases through terminal, IDE, desktop, or web surfaces | Powerful engineering agent, but mismatched to non-engineering workflows             |
| Claude Cowork                 | Non-developers automating local file and application work                                   | Useful computer actions require tight permissions and supervision                   |
| Claude in Chrome              | Work centered in browser applications                                                       | Browser reach expands the action and review surface                                 |
| Claude for Excel              | Spreadsheet-centered analysis and operations                                                | Deep workbook context but a specialized user surface                                |
| Custom application            | A partner-owned user experience built on the API or SDK                                     | Maximum integration and governance with maximum build responsibility                |

### Build-time interfaces

- Use an **SDK** by default for typed, language-native access with less boilerplate.
- Drop to the **direct API** when raw HTTP or a newly released capability is needed.
- Use **MCP** when the same tools or resources must be reusable across multiple Claude-compatible clients; it is not
  automatically valuable for one application.
- Use the **Claude Agent SDK** when a managed multi-turn agent loop must run inside the partner's own application. It is
  distinct from the ordinary Anthropic SDK, which wraps the API but does not own the loop.

### Claude Code shaping and governing layers

Shaping layers define what the agent knows and how it works: `CLAUDE.md`, Skills, subagents, and MCP servers. Governing
layers define what it may touch and what must happen around actions: hooks, permission modes, approval flows,
sandboxing, filesystem boundaries, network restrictions, and constrained commands.

Use deterministic hooks when a guarantee cannot depend on model judgment. Use environment-enforced containment when
approval prompts alone are not a sufficient backstop. The course describes permission modes ranging from normal
per-action approval and read-only planning through locked-down automation and container-only permission bypass; verify
their current names and behavior before deployment.

### Delivery routes

The model's basic behavior transfers across routes; billing, authentication, regions, model identifiers, procurement,
and feature timing do not.

| Route                 | Usually fits when                                                                    |
| --------------------- | ------------------------------------------------------------------------------------ |
| Anthropic first-party | The partner has no binding cloud commitment or needs newly released features quickly |
| AWS Bedrock           | AWS procurement, IAM, networking, and audit are already the enterprise standard      |
| GCP Vertex AI         | The partner operates in GCP and wants billing and controls in the existing project   |
| Microsoft Foundry     | Azure and Entra ID are the partner's established procurement and identity route      |

Cloud-mediated routes may receive features later than the first-party API. Verify regional availability, hosting form,
and compliance coverage for the exact model and configuration.

### Governance can eliminate options first

Attorney-client privilege, HIPAA, GDPR or data-residency policy, FedRAMP, and internal vendor rules can determine the
viable surface before cost or ergonomics are considered. A BAA or authorization for one route does not automatically
cover another route or every preview feature. In regulated work, name the governing constraint explicitly and confirm
current scope with the provider.

The failed bank architecture puts Claude Code on branch laptops, exposes every integration through MCP despite having
only one client, and assigns compliance to subagents. A better design is an SSO-authenticated web application behind the
bank's server boundary, deterministic compliance code, and audited tools. The original design selected technologies
before naming the users, reuse needs, and required guarantees.

The course checkpoint's recommended choices are:

- A bank already committed to AWS uses Bedrock for the integrated assistant.
- A law firm requiring its own privileged-data audit trail uses an API or SDK behind the firm's gateway.
- Non-technical warehouse staff use a suitable ready-made interface with shared context rather than a developer tool.
- A healthcare network uses the exact BAA-covered route it has already approved.
- A GCP-based system with a strict latency target chooses the route that keeps the request path within the approved
  cloud environment, subject to measurement.

## Cumulative architecture: contract review

The final case concerns a law firm reviewing 35-page contracts against a standard playbook. Privilege rules exclude
consumer tools, the firm already has SSO, an approved LLM gateway, and iManage, and senior associates must remain final
reviewers.

A defensible architecture is:

- a thin internal application built on the API or SDK, behind SSO and the approved gateway;
- a parallel workflow that reviews contract sections independently;
- an evaluator step that validates a strict flagged-clause schema;
- Claude for extraction, playbook-based classification, and draft redlines;
- iManage for document retrieval and a versioned playbook as the authoritative source, retrieved per clause;
- Sonnet as the initial model with progressive context;
- extended thinking only on clause types where an eval demonstrates value; and
- senior-associate approval for every output, with low-confidence clauses made prominent.

The rejected alternatives each fail one load-bearing decision: using a consumer surface despite the privilege
constraint, loading the whole playbook into every request, or using an open-ended Opus agent for a process whose steps
are known and reviewable.

## Exam review checklist

- Decompose work into Claude, system, and human ownership before selecting tools.
- Map next-token prediction, knowledge, working memory, and steerability to their architectural controls.
- Distinguish entry points, build-time interfaces, and delivery routes.
- Explain why an augmented call, workflow, or agent fits using the tightest constraint.
- Validate multi-agent coverage and place human gates before irreversible actions.
- Use RAG for stable knowledge and tools for live state.
- Choose chunking by document structure and indexing by query behavior.
- Start model selection with Sonnet and gate every change with a preset eval threshold.
- Layer monolithic, progressive, retrieval, and compaction strategies deliberately.
- Treat system prompts, caching, templates, and Skills as governed assets.
- Let governance eliminate invalid routes before optimizing cost or convenience.
- State the deciding tradeoff whenever recommending an architecture.
