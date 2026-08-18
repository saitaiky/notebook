# Practice Exam: Accelerators & IP Contribution

Private, independently written knowledge check for Module 5. It tests the accompanying
[study notes](accelerators-ip-contribution.md) without copying course checkpoints.

## Instructions

- Suggested time: 60 minutes; first attempt closed-notes.
- Part A: 30 multiple-choice questions × 1 point.
- Part B: 5 scenarios × 4 points.
- Maximum: 50 points.

| Score    | Interpretation                             |
| -------- | ------------------------------------------ |
| 45–50    | Strong reuse/deployment command            |
| 38–44    | Good; review missed lifecycle decisions    |
| 30–37    | Developing; repeat weak sections           |
| Below 30 | Revisit the chapter before another attempt |

## Part A: Multiple choice

1. What makes a working solution an accelerator? A. It ran once B. Reusable core is packaged and customer-specific parts
   are configurable/documented C. It uses the largest model D. It has many files
2. What should an agent template normally parameterize? A. Loop semantics only B. Customer prompts, paths, scopes,
   thresholds, and model policy C. Every language keyword D. Test output
3. What should a reusable MCP server expose as configuration? A. Literal customer secrets B. Credentials by reference
   and allowed scopes/paths C. One developer's home directory D. Hidden defaults only
4. What must travel with a portable eval suite? A. Dataset and graders/rubric plus baseline meaning B. Browser cookies
   C. Only final score D. Production key
5. Why package while the build is fresh? A. Git is faster B. General versus customer-specific intent is costly to
   reconstruct later C. Models expire instantly D. Documentation becomes illegal
6. Which evidence supports regulated reuse? A. A demo only B. Data touched, identity used, permissions, and audit log C.
   Model prose D. A moving alias
7. When is packaging overhead not justified? A. A genuine one-off with no future reuse B. Any regulated asset C. Any MCP
   server D. Any shared template
8. A large application is proposed for a repository that accepts focused examples. Main problem? A. Model tier B.
   Contribution-channel mismatch C. Context size D. Retry policy
9. What does a maintainer need first? A. Clever code B. Focused, reproducible, testable behavior C. A sales deck D. A
   private environment
10. Which item is part of contribution readiness? A. Runnable example and test B. Unstated assumptions C. Customer data
    D. Embedded credential
11. When must licensing/right-to-contribute be checked? A. After merge B. Before technical acceptance/publication C.
    Only after an incident D. Never for customer work
12. Rights cannot be cleared for engagement code. Correct action? A. Publish anonymously B. Escalate and do not
    contribute it C. Remove comments only D. Change model
13. Which is a functional requirement? A. “Make support better” B. “Draft a cited reply and require approval before
    sending” C. “Use our favorite cloud” D. “Be modern”
14. Which is an infrastructure requirement? A. Summarize calls B. Process transcript data only in approved EU regions C.
    Use empathetic tone D. Cite the policy
15. Why document requirements before platform selection? A. To justify familiarity B. To make the platform decision
    traceable to checkable needs C. To avoid tests D. To hide cost
16. In which lifecycle phase are platform and trust boundaries chosen? A. Design B. Operate C. Iterate D. Build only
17. In which phase are evals and integration tests executed? A. Requirements B. Test C. Contribution D. Procurement only
18. What is a phase gate? A. Moving automatically B. Evidence-based decision to advance C. Model alias D. Cache
19. Which gate should precede production promotion? A. Candidate clears eval against pinned baseline B. README exists C.
    One happy path D. Alias moved
20. What usually anchors deployment-platform choice? A. Developer preference B. Customer cloud, identity, procurement,
    and compliance posture C. Logo color D. Prompt length
21. What does the platform determine beyond model access? A. Identity, billing, data path, regional controls, and
    feature timing B. Only output tone C. Only temperature D. Git branch
22. Why pin a full model version? A. Increase randomness B. Prevent upstream movement from becoming a silent production
    change C. Remove evals D. Avoid rollback
23. What should be versioned with the model? A. Prompt, tools/schema, eval, and asset B. User password C. Browser
    session D. Only README title
24. Best rollout for a new model version? A. Replace all traffic instantly B. Limited traffic, compare to baseline, then
    promote or revert C. Follow alias silently D. Delete prior version
25. How should latency be compared? A. From a developer laptop only B. From the customer's region with actual payloads
    C. By model name D. By token price
26. What is total cost? A. Token price only B. Tokens plus platform fees, egress, integration, and operations C. Latency
    only D. Free when cached
27. For regulated workloads, compliance is often: A. A minor weighted preference B. A pass/fail constraint C. Inferred
    from model family D. Replaced by prompts
28. What is a trust boundary? A. A file name B. A seam where data, instructions, identity, or secrets cross environments
    C. A model alias D. A grader
29. A component passed its unit tests. Is its outgoing seam therefore trusted? A. Yes B. No; the seam needs explicit
    validation, scope, and audit C. Only on AWS D. Only with caching
30. The application's containment is limited by: A. Its smallest prompt B. Its most privileged weak seam C. Its README
    D. Its fastest model

## Part B: Scenarios

31. **Package for reuse.** A code-review agent hardcodes repository path, model alias, domain prompt, write scope, and
    threshold. Convert it into an accelerator and name bundled evidence.
32. **Contribution decision.** A team wants to publish customer-derived code as a broad application in a focused-example
    repository. Define channel, technical readiness, and rights steps.
33. **Requirements to platform.** An EU bank needs reviewed call summaries, EU processing, corporate identity, p95 under
    four seconds, and audit retention. Separate functional/infrastructure requirements and define lifecycle gates.
34. **Version release.** A deployment follows a moving alias and has no prior version. Design pinning, eval, canary,
    observability, and rollback.
35. **Boundary map.** An API invokes an agent runtime that fetches webpages and sends results to an MCP server with
    customer-database access. Map three boundaries and controls.

## Answer sheet

`1 __ 2 __ 3 __ 4 __ 5 __ 6 __ 7 __ 8 __ 9 __ 10 __`

`11 __ 12 __ 13 __ 14 __ 15 __ 16 __ 17 __ 18 __ 19 __ 20 __`

`21 __ 22 __ 23 __ 24 __ 25 __ 26 __ 27 __ 28 __ 29 __ 30 __`

<details>
<summary>Part A answer key and rationales</summary>

| Q   | A   | Rationale                                                             |
| --- | --- | --------------------------------------------------------------------- |
| 1   | B   | Reuse requires configuration and documented assumptions.              |
| 2   | B   | Engagement-specific values belong outside the reusable loop.          |
| 3   | B   | Installing teams set authority without editing code or exposing keys. |
| 4   | A   | The suite must reproduce grading and baseline interpretation.         |
| 5   | B   | Design intent decays after the delivery team moves on.                |
| 6   | B   | Reviewers need the data/identity/action evidence.                     |
| 7   | A   | A true one-off cannot repay packaging cost.                           |
| 8   | B   | Contributions must match the receiving project's review shape.        |
| 9   | B   | Verifiability is the maintainer's acceptance basis.                   |
| 10  | A   | Examples and tests let maintainers reproduce behavior.                |
| 11  | B   | Authority and attribution are gates before technical review.          |
| 12  | B   | Unclear rights prohibit publication.                                  |
| 13  | B   | It states checkable system behavior.                                  |
| 14  | B   | Residency constrains the infrastructure.                              |
| 15  | B   | Recorded needs make the decision defensible.                          |
| 16  | A   | Architecture placement and boundaries are design decisions.           |
| 17  | B   | Evals and test layers belong in testing.                              |
| 18  | B   | A gate requires artifacts/evidence before advancement.                |
| 19  | A   | Promotion is conditional on the evaluated baseline.                   |
| 20  | B   | Existing operational/compliance commitments usually dominate.         |
| 21  | A   | The execution platform defines these operational boundaries.          |
| 22  | B   | Pinning turns model changes into deliberate releases.                 |
| 23  | A   | The whole behavioral artifact must be traceable.                      |
| 24  | B   | Canary evidence supports promotion or rollback.                       |
| 25  | B   | Real regional measurements expose actual round-trip behavior.         |
| 26  | B   | Total cost includes platform and integration effects.                 |
| 27  | B   | A failed compliance constraint eliminates the option.                 |
| 28  | B   | Boundaries occur at cross-environment seams.                          |
| 29  | B   | Component correctness does not secure its handoff.                    |
| 30  | B   | One overprivileged seam sets the blast radius.                        |

</details>

<details>
<summary>Part B scoring rubrics</summary>

Award one point for each element.

31. Parameterize path/prompt/model policy/scope/threshold; document defaults and assumptions/failures; pin versions and
    use secret references; bundle eval, audit description/log behavior, and clean setup example.
32. Select the channel matching a focused pattern or the application's own project; narrow code and provide runnable
    example/test/assumptions; remove customer specifics; confirm rights/license/attribution and stop if uncleared.
33. Functional: summarize and require human review before storage; infrastructure: EU region, corporate identity, p95,
    retention/audit; design gate proves platform meets them; deploy gate requires pinned candidate passing eval plus
    security/compliance evidence.
34. Resolve and pin exact supported ID plus prompt/schema/eval versions; compare candidate against pinned baseline;
    canary limited traffic with per-version quality/latency/cost/errors; keep known-good version and explicit rollback.
35. Validate/authenticate external API entry; treat fetched webpage output as untrusted data at the agent-to-next-call
    seam; give MCP a least-privilege database identity with pre-action authorization; audit every crossing and require
    human escalation for unsecured/consequential actions.

</details>

## Review log

| Attempt | Date | Score | Weak topics | Next action |
| ------- | ---- | ----: | ----------- | ----------- |
| 1       |      |       |             |             |
