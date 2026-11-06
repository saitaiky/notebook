# Practice Exam: Claude Platform & Solution Design

This is a private, independently written knowledge check for Module 1 of the Claude Certified Architect — Professional
Prep Course. It tests the concepts in the accompanying [study notes](claude-platform-solution-design.md) without copying
the course's checkpoint questions.

## Instructions

- Suggested time: 60 minutes
- Complete the exam without notes on the first attempt.
- Part A contains 30 multiple-choice questions worth 1 point each.
- Part B contains 5 architecture scenarios worth 4 points each.
- Maximum score: 50 points.
- Record your reasoning before revealing the answer key.

### Score interpretation

| Score    | Interpretation                                                           |
| -------- | ------------------------------------------------------------------------ |
| 45–50    | Strong command; ready to move to mixed-module practice                   |
| 38–44    | Good understanding; review the missed decision frameworks                |
| 30–37    | Developing; repeat the module's failure cases and architecture exercises |
| Below 30 | Revisit the study chapter before attempting the exam again               |

## Part A: Multiple choice

### Model behavior and decomposition

1. A claims platform must route every claim above a fixed monetary threshold to a senior adjuster. Where should the
   threshold decision live?

   A. In Claude's system prompt B. In an evaluator model C. In deterministic application or rules-engine code D. In a
   vector database

2. A demo produces the desired classification five times with identical input. What is the best architectural
   conclusion?

   A. The behavior is deterministic enough for production B. Repeated demonstrations do not replace a representative
   evaluation C. Temperature should be set to zero and no further testing is required D. The task should immediately be
   moved to Opus

3. Which model property makes token budgeting, compaction, and progressive loading necessary?

   A. Steerability B. Parametric knowledge C. Finite working memory D. Tool use

4. Claude confidently answers a question about a private policy that changed yesterday. Which architectural problem is
   most directly involved?

   A. A routing failure B. A knowledge-boundary failure C. A sparse-index failure D. A cache-expiry failure

5. Which assignment best follows the decomposition framework?

   A. Claude approves a large refund, while a human drafts the email B. Claude calculates an account balance from
   remembered transactions C. Claude drafts a response, the transaction system executes it, and a human approves
   exceptional cases D. Claude owns the policy rule so the application needs fewer integrations

6. Which three questions best determine whether Claude should own a decision?

   A. Model size, cloud provider, and prompt length B. Reversibility, stakes, and accountability C. Embedding model,
   chunk size, and top-k D. Latency, language, and user-interface color

### Platform layers and primitives

7. A user works directly in Claude Code while the engineering team integrates reusable tools through MCP and routes
   inference through AWS Bedrock. Which mapping is correct?

   A. Entry point: MCP; interface: Bedrock; route: Claude Code B. Entry point: Claude Code; interface: MCP; route:
   Bedrock C. Entry point: Bedrock; interface: Claude Code; route: MCP D. All three are entry points

8. Which primitive provides a deterministic lifecycle control that the model cannot choose to skip?

   A. Skill B. Subagent C. Hook D. Prompt cache

9. When does MCP most clearly earn its architectural overhead?

   A. One internal application has two local functions B. The same tool surface must be reused by several
   Claude-compatible clients C. A team wants a shorter system prompt D. The model requires a larger context window

10. What is the main purpose of a Skill in this module's primitive vocabulary?

A. Store live transactional state B. Package a repeatable, versioned procedure C. Replace all API calls with retrieval
D. Guarantee deterministic model output

### Pattern selection and orchestration

11. A task consists of one bounded, verifiable transformation with no branching. Which pattern is the best starting
    point?

    A. Agent team B. Open-ended agent C. Augmented LLM call D. Dynamic multi-agent workflow

12. A process has four known paths selected by an intent classifier. Which design is most defensible?

    A. A router followed by four coded chains B. An autonomous agent with unrestricted tools C. A single monolithic
    prompt that describes every possible path D. One subagent per user, with no orchestrator

13. When is an agent justified over a workflow?

    A. When the team has not yet decided what the steps are B. When the path genuinely cannot be enumerated in advance
    C. Whenever the model can call at least one tool D. Whenever flexibility sounds useful for future requirements

14. A contract review runs independent analysis over 20 sections at the same time. Which workflow sub-pattern is being
    used?

    A. Routing B. Chaining C. Parallelization D. Evaluator-optimizer

15. A draft is repeatedly graded against a rubric and revised until it passes or reaches a retry limit. Which
    sub-pattern is this?

    A. Evaluator-optimizer B. Retrieval C. Routing D. Compaction

16. An orchestrator dispatches 50 units and receives 48 results. What must happen before synthesis?

    A. Increase the model temperature B. Treat 48 as complete because only returned results are valid C. Reconcile
    dispatched and returned counts, then retry or report gaps D. Ask the model to write a more confident summary

17. Which multi-agent failure is generally hardest to recover from?

    A. One subagent returns malformed output B. Two subagents disagree C. The orchestrator loses the goal and synthesis
    state D. A subagent requires a retry

### Reference architectures and RAG

18. A support assistant needs a customer's current order status. Which mechanism should provide the value?

    A. Dense retrieval over historical order snapshots B. A tool call to the order system of record C. The model's
    parametric knowledge D. A larger context window

19. Why can a high embedding-similarity score still produce an incorrect live-state answer?

    A. Similarity measures semantic closeness, not truth or recency B. Dense indexes cannot store numbers C. The model
    ignores all retrieved content D. Sparse retrieval is always authoritative

20. Which chunking method best fits a section-numbered contract where section hierarchy carries meaning?

    A. Random sampling B. Fixed-size chunks without overlap C. Hierarchical chunking D. One chunk per character

21. A corpus receives conceptual questions and exact part-number lookups. Which indexing strategy best matches the query
    mix?

    A. Dense only B. Sparse only C. Hybrid dense and sparse retrieval D. No index; preload the entire corpus

22. What is reciprocal rank fusion used for?

    A. Combining ranked results from multiple retrieval methods B. Choosing between Sonnet and Opus C. Compressing
    conversation history D. Enforcing a human approval gate

### Model, context, and prompting strategy

23. What is the recommended initial model-selection posture from the module?

    A. Start with Opus everywhere and optimize after launch B. Start with Haiku regardless of task complexity C. Start
    with Sonnet, then move only when an eval justifies it D. Rotate models randomly to measure variance

24. What must be set before comparing a production workload across model tiers?

    A. The result-dependent acceptance threshold B. A representative eval, grading method, and rollback threshold C. A
    requirement that the cheaper model always wins D. A monolithic prompt containing the entire production history

25. Which context strategy is generally the best default for a long-running agent?

    A. Progressively load recent and required information, retrieve on demand, and compact at deliberate boundaries B.
    Put every possible document into every request C. Rely on the model to remember prior API calls automatically D. Use
    retrieval as persistent transactional state

26. When should extended thinking be enabled?

    A. On every classifier because it cannot reduce quality B. Only after an eval shows that its accuracy gain earns the
    extra cost and latency C. Only when the context window is full D. Whenever prompt caching is disabled

27. A prompt cache never hits because each request begins with a different customer document. What is the best
    correction?

    A. Place dynamic content first and shorten the cache lifetime B. Put the stable instructions first, mark the cache
    boundary, and append dynamic content afterward C. Convert the document into a tool result after generation D.
    Replace caching with an agent team

28. A classification task has clear category definitions and performs reliably from instructions alone. Which prompting
    technique should be tried first?

    A. Zero-shot B. Few-shot with 50 examples C. An evaluator-optimizer loop D. Explicit reasoning plus extended
    thinking

### Entry points, routes, and governance

29. A law firm requires every privileged-data request to pass through its own SSO, gateway, and audit infrastructure.
    Which design best meets that load-bearing constraint?

    A. Consumer Claude.ai accounts with shared Projects B. Claude Code on every lawyer's laptop C. A firm-owned
    application using the API or SDK behind the approved gateway D. A public MCP server with no identity controls

30. A healthcare organization already has an approved AWS configuration and a BAA that explicitly covers its Bedrock
    workload. What should dominate the delivery route decision?

    A. Whichever route has the shortest code sample B. The existing approved and covered configuration, after confirming
    the exact feature and model remain in scope C. The first-party API because it receives features sooner D. Claude
    Code because it uses the same underlying model

## Part B: Architecture scenarios

Answer each scenario in a short paragraph or architecture outline. Award yourself one point for each rubric element
satisfied.

### Scenario 1: Claims triage

An insurer receives free-text claims. The proposed system must extract the claim amount, determine whether it exceeds a
policy threshold, look up current coverage, draft a message, and send it. Claims above the threshold require senior
approval.

Design the ownership split and control flow. State whether you would use an augmented call, workflow, or agent.

### Scenario 2: Multi-agent document review

A vendor-risk team sends 300 policies to parallel subagents. The first prototype produces a fluent consolidated report,
but operations cannot tell whether every policy was reviewed or reconstruct a complete run.

Name four controls you would add.

### Scenario 3: Customer-service knowledge and live state

A retailer wants one assistant to answer product-manual questions, report current order status, and approve high-value
refunds.

Choose the mechanism and owner for each responsibility, including the human checkpoint.

### Scenario 4: Cost reduction without hidden regression

A pipeline uses Opus for classification, summarization, and final response composition. Cost and latency exceed budget.
The team proposes changing every step to Haiku immediately.

Describe a safer model-selection and rollout plan.

### Scenario 5: Privileged contract review

A law firm stores contracts in a document-management system, has an approved private LLM gateway, and requires a senior
associate to approve all redlines. Contracts average 35 pages and follow a standard playbook.

Propose the entry point, workflow shape, grounding strategy, model/context posture, and human gate.

## Answer sheet

| Question | Answer | Question | Answer | Question | Answer |
| -------- | ------ | -------- | ------ | -------- | ------ |
| 1        |        | 11       |        | 21       |        |
| 2        |        | 12       |        | 22       |        |
| 3        |        | 13       |        | 23       |        |
| 4        |        | 14       |        | 24       |        |
| 5        |        | 15       |        | 25       |        |
| 6        |        | 16       |        | 26       |        |
| 7        |        | 17       |        | 27       |        |
| 8        |        | 18       |        | 28       |        |
| 9        |        | 19       |        | 29       |        |
| 10       |        | 20       |        | 30       |        |

<details>
<summary>Reveal Part A answer key and rationales</summary>

| Q   | Answer | Rationale                                                                                                                             |
| --- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | C      | A threshold that must behave identically belongs in deterministic code. Claude may extract the amount, but code applies the rule.     |
| 2   | B      | A few successful runs do not characterize a probabilistic output distribution; use a representative eval.                             |
| 3   | C      | Progressive loading, compaction, and token budgets manage the hard limit of active working memory.                                    |
| 4   | B      | Private and newly changed policy lies outside reliable parametric knowledge and must be supplied from an authoritative source.        |
| 5   | C      | Language drafting fits Claude, execution fits the owning system, and high-stakes exceptions retain human accountability.              |
| 6   | B      | Reversibility, stakes, and accountability define whether delegation is proportionate.                                                 |
| 7   | B      | Claude Code is the user-facing entry point, MCP is the build-time sharing interface, and Bedrock is the delivery route.               |
| 8   | C      | Hooks execute deterministic lifecycle logic outside the model's discretion.                                                           |
| 9   | B      | MCP earns its overhead when one reusable integration must serve multiple compatible clients.                                          |
| 10  | B      | A Skill packages a repeatable procedure, instructions, and optional scripts as a versioned unit.                                      |
| 11  | C      | One bounded, verifiable task with no branching should begin as an augmented call.                                                     |
| 12  | A      | Known paths belong in observable code: a router plus four chains is simpler and more auditable than an agent.                         |
| 13  | B      | Agent autonomy is justified when the trajectory itself cannot be predetermined, not when design work is unfinished.                   |
| 14  | C      | Independent section reviews can execute concurrently and be aggregated.                                                               |
| 15  | A      | A generator plus rubric-based evaluator and bounded revision loop is evaluator-optimizer.                                             |
| 16  | C      | Coverage must be an explicit invariant; missing units are retried or reported before synthesis.                                       |
| 17  | C      | Losing the component that owns the overall goal and synthesis can strand all partial work.                                            |
| 18  | B      | Current order status is live state owned by the transaction system, so it requires a direct lookup.                                   |
| 19  | A      | Similarity ranks semantic relevance; it does not establish which snapshot is current or authoritative.                                |
| 20  | C      | Hierarchical chunking preserves the document structure needed to interpret clauses in context.                                        |
| 21  | C      | Dense retrieval handles semantic phrasing while sparse retrieval recovers exact identifiers.                                          |
| 22  | A      | Reciprocal rank fusion merges multiple ranked retrieval lists without extensive tuning.                                               |
| 23  | C      | Sonnet is the starting posture; movement up or down is justified by task-specific evaluation.                                         |
| 24  | B      | The eval, grader, and preset rollback threshold make the comparison defensible and prevent post-hoc acceptance criteria.              |
| 25  | A      | Long-running work usually combines a small initial context, progressive recent state, on-demand retrieval, and deliberate compaction. |
| 26  | B      | Thinking tokens add cost and latency, so measured task quality must justify them.                                                     |
| 27  | B      | Cache reuse depends on a stable prefix; variable request data must follow the cacheable block.                                        |
| 28  | A      | Begin with the lightest technique that meets the requirement; a clear classification task should start zero-shot.                     |
| 29  | C      | The firm's audit and identity constraint requires a firm-controlled application path and gateway.                                     |
| 30  | B      | Confirmed BAA and governance coverage eliminate uncovered routes before convenience or feature timing is considered.                  |

</details>

<details>
<summary>Reveal Part B scoring rubrics</summary>

### Scenario 1 rubric

- Claude extracts and normalizes the free-text amount and drafts the message.
- Deterministic code applies the threshold; the coverage system supplies current policy data; the messaging system
  sends.
- A senior human approves threshold-crossing or exceptional claims before action.
- Uses an observable workflow with explicit steps and logs rather than an open-ended agent.

### Scenario 2 rubric

- Reconcile dispatched units against returned valid results before synthesis.
- Validate every subagent result and retry or flag timeouts, malformed data, and empty output.
- Propagate a shared trace identifier and preserve per-unit provenance.
- Checkpoint orchestrator state and define conflict resolution or human escalation.

### Scenario 3 rubric

- Product-manual questions use RAG over a stable, evaluated knowledge corpus.
- Current order status comes from a tool call to the transactional system.
- Claude may explain or draft the refund request, but the refund service owns the transaction.
- High-value refunds pause at a human approval gate before execution.

### Scenario 4 rubric

- Build a representative per-step eval with known-good targets and a consistent grader.
- Set quality and rollback thresholds before comparing models.
- Evaluate each pipeline step separately; move only steps that remain within tolerance, potentially using Haiku for
  classification and Sonnet for harder work.
- Roll out gradually, monitor cost, latency, and quality, and preserve an immediate rollback path.

### Scenario 5 rubric

- Use a firm-owned application on the API or SDK behind SSO and the approved gateway, rather than a consumer entry
  point.
- Use a parallel section-review workflow with schema validation or an evaluator stage, not an unbounded agent.
- Retrieve the current versioned playbook per clause and fetch documents from the document-management system.
- Start with Sonnet and progressive context, justify thinking or another tier with evals, and require senior-associate
  approval for every final redline.

</details>

## Review log

| Attempt | Date | Part A / 30 | Part B / 20 | Total / 50 | Topics to revisit |
| ------- | ---- | ----------: | ----------: | ---------: | ----------------- |
| 1       |      |             |             |            |                   |
| 2       |      |             |             |            |                   |
| 3       |      |             |             |            |                   |
