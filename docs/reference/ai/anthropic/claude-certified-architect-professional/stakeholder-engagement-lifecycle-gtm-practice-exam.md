# Practice Exam: Stakeholder Engagement, Lifecycle & GTM

Private, independently written Module 4 knowledge check based on the accompanying
[study notes](stakeholder-engagement-lifecycle-gtm.md).

## Instructions

- Suggested time: 60 minutes, closed-notes first attempt.
- Part A: 30 multiple-choice questions × 1 point.
- Part B: 5 scenarios × 4 points. Maximum: 50.

| Score    | Interpretation                                        |
| -------- | ----------------------------------------------------- |
| 45–50    | Strong lifecycle and stakeholder command              |
| 38–44    | Good; revisit missed translation/governance decisions |
| 30–37    | Developing; repeat the worked handoff case            |
| Below 30 | Revisit the chapter before retrying                   |

## Part A: Multiple choice

### Discovery

1. What is the output of good discovery? A. A model choice B. A traceable set of requirements, assumptions, constraints,
   and open questions C. A polished demo D. A final invoice
2. A sponsor says “make it seamless.” What should happen next? A. Record “seamless” as final requirement B. Ask what
   breaks the experience and translate answers into measurable constraints C. Choose the fastest model D. Start
   sketching
3. Which is one of the four discovery categories? A. What must it prove? B. Which UI color? C. Which vendor logo? D.
   Which answer sounds best?
4. How does a requirement differ from an assumption? A. Requirements are always technical B. A requirement traces to
   stakeholder evidence; an assumption is explicitly unconfirmed C. Assumptions need no owner D. There is no difference
5. “Transcripts retained for 60 days” appears without a supporting statement. What is it? A. SLA B. Undocumented
   assumption C. Rejected alternative D. Evidence artifact
6. Why is an early plausible design sketch dangerous? A. It is too expensive to draw B. It can end questioning before
   hidden constraints emerge C. It cannot show tools D. It always violates residency

### Tradeoffs and communication

7. Which element is most often omitted from a tradeoff presentation? A. Gain B. Reversal cost C. Option name D. Model
   name
8. A stakeholder approves $0.04/call but later rejects the monthly bill. What was missing? A. Unit price B.
   Production-volume translation, caching assumption, and reversal implications C. Prompt text D. Latency median
9. What is the architect's role in a tradeoff meeting? A. Make the decision secretly B. Present an actionable package
   and recommendation with residual risks C. Avoid disadvantages D. Provide only raw technical details
10. In regulated work, what additional tradeoff question is essential? A. Which demo theme? B. What happens to
    compliance posture? C. Which developer prefers it? D. Is the prompt short?
11. What distinguishes a scenario-specific demo? A. It lists all features B. It uses the buyer's workflow, data shape,
    approvals, and edge cases C. It hides limitations D. It uses production PII
12. Why state demo limitations in advance? A. To avoid all questions B. Clear scope boundaries signal discipline and
    prevent surprise C. To make the model less capable D. To replace discovery

### Feedback loops and SLAs

13. What is missing from observability when no one acts on gradual drift? A. More metrics B. A decision layer mapping
    signal to trigger, owner, action, and review C. A larger model D. A new UI
14. Which order describes the feedback loop? A. Act → ignore → alert B. Signals → triage → decide → act → review C.
    Monitor → launch D. Review → delete
15. What three things must an SLA define? A. Model, prompt, route B. Measure, breach threshold, required response C.
    Cost, logo, owner D. Input, output, cache
16. Where should a quality threshold come from? A. A round number B. Eval acceptance criteria C. Competitor marketing D.
    First production incident
17. A residency confirmation is required quarterly even with green metrics. How is it triggered? A. Error threshold only
    B. Calendar-based governance row C. User complaint D. Model refusal
18. Why forecast cost before launch? A. Pilot volume often understates production by an order of magnitude or more B.
    Production is always cheaper C. It removes caching D. It replaces ROI

### Documentation and handoff

19. What is the documentation completeness test? A. It has a diagram B. A competent outsider can make a safe change
    after reading it C. It is over 100 pages D. It names the model
20. Why record rejected alternatives? A. To increase document length B. They explain constraints and prevent a successor
    from repeating a harmful path C. Auditors require every idea D. To hide assumptions
21. Which artifact most directly proves a control is operating? A. Design assertion B. Evidence artifact C. Demo script
    D. Preference
22. A successor changes an in-region strategy to a global endpoint. What likely was missing? A. Model benchmark B.
    Load-bearing rationale and rejected alternative C. A faster cache D. A sales plan
23. Which reader primarily needs control owner and evidence? A. Compliance reviewer B. End customer only C. Model D.
    Load balancer
24. How should assumptions appear in documentation? A. Embedded as facts B. Explicitly labeled, owned, and resolved by
    criteria/date C. Removed D. Stored only in email

### Entry points and outcomes

25. What prevents route ownership from drifting in a multi-platform app? A. A larger context B.
    Entry-point-responsibility map C. One shared password D. An output filter
26. An AWS-regulated path has a residency rule. What is the key configuration discipline? A. Accept global default B.
    Explicitly set and verify the required region/data path C. Use Claude Code D. Skip logs
27. Why is a cloud platform name insufficient proof of residency? A. Platforms have no regions B. Hosting forms,
    endpoints, logs, and defaults can follow different paths C. Models ignore regions D. It proves latency only
28. Which is a business outcome metric? A. Requests/month B. Average inference latency C. Time from dictation to
    authorized clinical note D. Token count
29. What makes a before/after claim auditable? A. Same metric definition plus an operating measurement control B. A
    screenshot of the after value C. A faster model D. More requests
30. At week four there is not enough post-launch data for a CFO claim. What should the architect do? A. Estimate the
    after value B. Name owner/control and schedule the outcome milestone C. Use latency as business value D. Remove the
    baseline

## Part B: Architecture scenarios

31. **Discovery.** A bank says an assistant must be “fast, safe, and easy.” Produce four translation-table rows or
    targeted questions covering capability, prohibition, cost/latency, and proof.
32. **Tradeoff.** Present full-context versus RAG to an executive using gain, sacrifice, reversal cost, and compliance
    posture.
33. **Feedback loop.** Quality drifts for three weeks without an error spike. Define the governance row and an SLA
    response.
34. **Handoff.** Specify the minimum living artifacts for a regulated system whose original architect is leaving.
35. **Healthcare expansion.** Choose routes and define a CFO-ready outcome document for clinician-authorized notes
    across an AWS regulated path and a direct-API non-regulated path.

## Answer sheet

`1 __ 2 __ 3 __ 4 __ 5 __ 6 __ 7 __ 8 __ 9 __ 10 __`

`11 __ 12 __ 13 __ 14 __ 15 __ 16 __ 17 __ 18 __ 19 __ 20 __`

`21 __ 22 __ 23 __ 24 __ 25 __ 26 __ 27 __ 28 __ 29 __ 30 __`

<details>
<summary>Part A answer key and rationales</summary>

| Q   | Answer | Rationale                                                              |
| --- | ------ | ---------------------------------------------------------------------- |
| 1   | B      | Discovery creates traceable design inputs.                             |
| 2   | B      | A preference must be translated into bounded tests.                    |
| 3   | A      | Proof obligations are first-class requirements.                        |
| 4   | B      | Traceability separates known requirements from unconfirmed beliefs.    |
| 5   | B      | Nobody requested or confirmed the retention rule.                      |
| 6   | B      | Plausibility can create false confidence and stop elicitation.         |
| 7   | B      | Reversal cost changes a technical comparison into a business decision. |
| 8   | B      | The sponsor needs total impact and cost of changing course.            |
| 9   | B      | Stakeholders need a defensible decision package.                       |
| 10  | B      | A technically attractive choice can still be impermissible.            |
| 11  | B      | Recognition of the buyer's actual environment creates confidence.      |
| 12  | B      | Honest boundaries communicate control, especially in regulated work.   |
| 13  | B      | Metrics without decision rules are monitoring, not feedback.           |
| 14  | B      | Review closes the loop and improves the rule.                          |
| 15  | B      | An SLA must say what is promised and what happens on failure.          |
| 16  | B      | The acceptance standard makes the number defensible.                   |
| 17  | B      | Some governance obligations are scheduled, not incident-driven.        |
| 18  | A      | Pilot economics rarely represent scaled consumption.                   |
| 19  | B      | Safe independent change is the practical test.                         |
| 20  | B      | The rejected path explains why the current choice is load-bearing.     |
| 21  | B      | Reviewers accept current proof, not assertion.                         |
| 22  | B      | The diagram alone did not preserve the residency reasoning.            |
| 23  | A      | Audit readers require accountability and proof.                        |
| 24  | B      | Visible assumptions can be managed rather than mistaken for facts.     |
| 25  | B      | It assigns task ownership and boundary behavior.                       |
| 26  | B      | Region defaults must never silently decide a regulated route.          |
| 27  | B      | The exact configuration and data flow determine compliance.            |
| 28  | C      | It measures the business workflow outcome.                             |
| 29  | A      | Comparable definitions and a control support the claim.                |
| 30  | B      | A future evidence gate is better than a fabricated result.             |

</details>

<details>
<summary>Part B scoring rubrics</summary>

31. One point each for: capability/ownership question; prohibited action/human gate question; measurable
    p95/volume/spend boundary; audit/outcome evidence with assumptions explicitly marked.

32. Full context gains initial simplicity/whole-document visibility; gives up token cost and latency while caching may
    help stable content; reversal requires introducing retrieval and changing dependent interfaces/evals; compare data
    handling, evidence, and route constraints rather than assuming either is compliant.

33. Signal is sustained eval decline; trend threshold triggers architect diagnosis with owner; trace
    prompt/model/data/retrieval and decide iteration vs re-architecture; SLA defines quality measure, breach rule,
    stakeholder escalation, response time, and review of whether the action restored performance.

34. Architecture and entry-point map; dated decision log with rejected options, tradeoffs, assumptions, and owners;
    control register with current evidence links; runbook/test results plus audit-ready status and escalation paths.

35. Explicitly regional Bedrock/AWS route for regulated data and direct API only for scoped non-regulated work;
    entry-point map with auth/log/failure boundaries; same before/after time-to-authorized-note metric; timestamped
    clinician approval log, measurement owner, scope boundary, and sufficient measurement window.

</details>

## Review log

| Attempt | Date | Part A /30 | Part B /20 | Total /50 | Topics to revisit |
| ------- | ---- | ---------: | ---------: | --------: | ----------------- |
| 1       |      |            |            |           |                   |
| 2       |      |            |            |           |                   |
