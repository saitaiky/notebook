# Practice Exam: Responsible AI, Safety & Risk for Architects

Private, independently written knowledge check for Module 3, based on the accompanying
[study notes](responsible-ai-safety-risk-for-architects.md).

## Instructions

- Suggested time: 60 minutes, closed-notes first attempt.
- Part A: 30 multiple-choice questions × 1 point.
- Part B: 5 scenarios × 4 points. Maximum: 50.

| Score    | Interpretation                                      |
| -------- | --------------------------------------------------- |
| 45–50    | Strong safety-stack design command                  |
| 38–44    | Good; review missed placements and evidence choices |
| 30–37    | Developing; repeat failure-path scenarios           |
| Below 30 | Revisit the study chapter                           |

## Part A: Multiple choice

### Safety ownership and risks

1. Who owns a deployment's tenant-isolation rule? A. Claude's training B. The application architect/operator C. The end
   user D. The retrieval corpus
2. What is the main blind spot of system instructions? A. They cannot describe tone B. They are not deterministic
   authorization/enforcement C. They cannot contain examples D. They always fail closed
3. A user requests a cross-department record without an application policy boundary. Why may Claude comply? A. The
   request is too short B. Broad safety training never received the domain authorization rule C. Output filtering grants
   access D. Retrieval overrides policy
4. Which is an indirect prompt-injection path? A. A hostile instruction embedded in a retrieved document B. A user
   typing a jailbreak C. A rate limit D. A human approval
5. What belongs in a risk register entry? A. Category only B. Component, likelihood/impact, mitigation, owner, and
   evidence C. Model name only D. Final prompt only
6. How should an externally sourced Skill with shell and credential access be treated? A. Trusted because it is
   installable B. Audited, least-privileged, sandboxed, and version-governed C. Put in the system prompt D. Given
   standing credentials

### Guardrails

7. Which control best detects nuanced jailbreak intent? A. Exact schema validator B. Model-based input classifier,
   possibly chained with rules C. Tool authorization D. Cache TTL
8. Which control best enforces a refund limit? A. Toxicity judge B. Deterministic authorization before the tool C.
   Output prose D. Trained refusal
9. Why is output screening insufficient for a side-effecting action? A. Output is always safe B. The action may execute
   before the text is screened C. Tools cannot be logged D. Input is deterministic
10. What must be screened separately from the user's message? A. Only the system prompt B. Retrieved/tool-supplied
    content C. The SLA D. Human comments
11. When should an operator guardrail generally fail closed? A. When a wrong pass can cause high-impact harm B. For
    every low-risk typo C. Only in demos D. Never
12. A banned identifier must not appear in output. Best primary check? A. Deterministic pattern/field validator B.
    Human-only review C. Parametric knowledge D. A larger model
13. Which sequence protects a refund flow? A. Model → refund → output screen B. Input screen → model → deterministic
    authorization → refund → screened response C. Refund → model D. Output screen only

### Fairness and transparency

14. Which is not one of the four common fairness injection points? A. Retrieval corpus B. Prompt framing C. Few-shot
    examples D. TLS cipher choice
15. Overall accuracy is stable but one subgroup degrades. What failed? A. Context length B. Subgroup instrumentation and
    fairness monitoring C. Cache write D. Retry count
16. What is required to reconstruct a decision? A. Final output only B. Inputs, retrieved context, output, routing, and
    a linking ID C. Aggregate latency D. Model marketing name
17. Which audience primarily needs an actionable explanation of an adverse result? A. Affected user B. Build server C.
    Cache D. Load balancer
18. Why must a decision log be governed? A. Logs cannot be searched B. It may contain sensitive inputs/context and has
    retention/access obligations C. It replaces authorization D. It removes all bias
19. A model passed provider fairness tests, but the app's corpus is skewed. Who owns the app-level gap? A. Nobody B. The
    deployment team controlling corpus and instrumentation C. Only the regulator D. The model judge

### Human review

20. Which variables set review routing? A. Volume, model size, UI B. Confidence, reversibility, cost of error C. Tokens,
    temperature, cache D. Region, SDK, embedding
21. What primarily determines stakes? A. Confidence alone B. Cost of error and reversibility C. Queue length D. Model
    tier
22. When is pre-action review strongest? A. Irreversible, high-impact action B. Low-cost reversible draft C. Aggregate
    monitoring D. Cache refresh
23. What does sampled review provide? A. A gate for every individual action B. Population monitoring without protecting
    every case C. Deterministic authorization D. Zero operating cost
24. Why does routing everything often reduce safety? A. It improves calibration B. Consent fatigue and volume turn
    review into rubber-stamping C. It removes latency D. Reviewers see more context
25. What must a reviewer interface show? A. Output and approve button only B. Relevant inputs, proposed output, and flag
    reason C. Cost dashboard only D. Source code only

### Compliance

26. What completes the control mapping? A. Obligation → route B. Obligation → control → owner → evidence C. Policy →
    prompt D. Contract → model
27. A deployment uses a permitted cloud route. Is compliance complete? A. Yes B. No; each obligation still needs
    operating control and evidence C. Only if latency is low D. Only if no logs exist
28. Which is evidence for regional residency? A. A design assertion B. Current configuration and data-flow record
    covering logs/caches C. The model's answer D. A marketing page alone
29. “Not used for training” necessarily means zero retention. True? A. Yes B. No; training use and retention are
    distinct claims C. Only for tools D. Only for prompts
30. Why revalidate evidence artifacts? A. Controls and configurations can drift after design B. To increase creativity
    C. To remove owners D. To avoid logs

## Part B: Architecture scenarios

31. **Refund agent.** Place controls for a support agent that retrieves policy and can issue refunds. State check types
    and failure direction.
32. **Fairness incident.** A credit-support system shows unequal approval recommendations. Define the four investigation
    points and decision record.
33. **Review budget.** A benefits assistant produces 5,000 recommendations/day. Design a routing rule and reviewer view
    without routing everything.
34. **Compliance register.** Turn a health-data agreement requirement and a regional-storage requirement into complete
    register rows.
35. **Public benefits deployment.** Assemble trained/application boundaries, runtime controls, fairness evidence, review
    routing, and compliance proof for a low-confidence denial near an eligibility threshold.

## Answer sheet

`1 __ 2 __ 3 __ 4 __ 5 __ 6 __ 7 __ 8 __ 9 __ 10 __`

`11 __ 12 __ 13 __ 14 __ 15 __ 16 __ 17 __ 18 __ 19 __ 20 __`

`21 __ 22 __ 23 __ 24 __ 25 __ 26 __ 27 __ 28 __ 29 __ 30 __`

<details>
<summary>Part A answer key and rationales</summary>

| Q   | Answer | Rationale                                                                  |
| --- | ------ | -------------------------------------------------------------------------- |
| 1   | B      | Domain authorization is application-owned.                                 |
| 2   | B      | Instructions express policy but do not provide an unskippable gate.        |
| 3   | B      | The model cannot enforce a rule it was never given.                        |
| 4   | A      | The hostile instruction arrives through a downstream source.               |
| 5   | B      | A risk must be actionable, owned, and provable.                            |
| 6   | B      | Reusable assets are supply-chain code/instructions with real capabilities. |
| 7   | B      | Ambiguous intent needs semantic judgment.                                  |
| 8   | B      | Permission for a side effect must be deterministic and pre-action.         |
| 9   | B      | Text screening cannot reverse an already executed action.                  |
| 10  | B      | Later sources create a separate injection path.                            |
| 11  | A      | High-impact paths should not silently pass unscreened traffic.             |
| 12  | A      | A crisp forbidden value is deterministic.                                  |
| 13  | B      | Distinct controls protect distinct path stages.                            |
| 14  | D      | Network ciphers matter to security, not this fairness-injection model.     |
| 15  | B      | Aggregates can conceal concentrated harm.                                  |
| 16  | B      | Reconstruction needs the full decision path.                               |
| 17  | A      | Affected people need an explanation they can use.                          |
| 18  | B      | Transparency data is itself sensitive governed data.                       |
| 19  | B      | The deployment introduced and controls the corpus.                         |
| 20  | B      | These variables combine likelihood and consequence.                        |
| 21  | B      | Stakes exist independently of the confidence estimate.                     |
| 22  | A      | The gate prevents irreversible harm before it occurs.                      |
| 23  | B      | Sampling measures the population but is not an individual safeguard.       |
| 24  | B      | Excess volume destroys meaningful attention.                               |
| 25  | B      | Context and flag reason make judgment possible.                            |
| 26  | B      | Control, accountability, and proof are all required.                       |
| 27  | B      | Route eligibility is only the pre-filter.                                  |
| 28  | B      | Inspectable current proof covers all copies.                               |
| 29  | B      | Other legitimate retention purposes may still exist.                       |
| 30  | A      | Evidence becomes stale when systems change.                                |

</details>

<details>
<summary>Part B scoring rubrics</summary>

31. Input semantic/rule screening including retrieved-content screening; output semantic/deterministic checks;
    deterministic identity/scope/limit authorization before refund; fail closed and log control failures on the
    financial path.

32. Inspect corpus, prompt framing, examples, and downstream routing; break outcomes down by comparable groups; retain
    inputs/derived features and retrieved context; retain output/routing/reasons under one governed decision ID.

33. Define calibrated confidence plus cost/reversibility rule; pre-action gate hard-to-reverse/high-cost low-confidence
    cases; sample lower-risk population; show inputs, output, and flag reason with queue-capacity monitoring.

34. Health row: eligible configuration under signed BAA, security owner, agreement and enabled-setting evidence.
    Residency row: explicit region for processing, storage, logs, caches, data owner, current configuration/data-flow
    evidence and revalidation cadence.

35. Keep eligibility policy in the app layer; input/output screening and deterministic action authorization fail closed;
    instrument four fairness points and reconstructable decisions; route the denial to contextual pre-action review; map
    government/agency obligations to named controls, owners, and live evidence.

</details>

## Review log

| Attempt | Date | Part A /30 | Part B /20 | Total /50 | Topics to revisit |
| ------- | ---- | ---------: | ---------: | --------: | ----------------- |
| 1       |      |            |            |           |                   |
| 2       |      |            |            |           |                   |
