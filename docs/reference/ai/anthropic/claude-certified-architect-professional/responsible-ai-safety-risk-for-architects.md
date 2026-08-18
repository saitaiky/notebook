# Responsible AI, Safety & Risk for Architects

Private study notes for Module 3 of the Claude Certified Architect — Professional Prep Course (approximately 114
minutes). The chapter follows the lesson's order in paraphrased study form and is not a verbatim transcript.

## Learning outcomes

An architect should be able to draw the full safety stack, identify where harm can enter, select and place controls,
choose their failure behavior, instrument fairness and transparency, route decisions to people by stakes, and turn every
compliance obligation into an owned and evidenced control.

## 1. Safety is a stack of responsibilities

Claude's trained behavior reduces broad categories of harm, but it has not seen an application's domain policy, private
data rules, tenant model, or approval thresholds. The architect must state what every layer owns.

| Layer                       | What it can do                                                     | What it cannot substitute for                               |
| --------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| Trained behavior            | Broad safety and refusal behavior; owned by Anthropic              | Deployment-specific policy and authorization                |
| System instructions         | Set role, tone, workflow, and desired constraints                  | Deterministic enforcement against adversarial input         |
| Runtime screening           | Inspect incoming and outgoing content                              | Authorize side effects or enforce source-system permissions |
| Deterministic authorization | Decide whether this caller may perform this action in this context | Judge answer quality or fairness                            |

A request to view records from another business unit may be perfectly normal in the abstract. If the application never
supplies and enforces the unit boundary, the model has no rule to apply. Do not attribute tenant isolation, refund
limits, approved scripts, or sign-off rules to trained safety.

## 2. Risk assessment follows the whole data and action path

Walk user input, retrieved data, tool output, model output, side effects, and logs. Record each risk with its component,
likelihood, impact, mitigation, owner, and evidence.

Common categories include:

- direct prompt injection from the user;
- indirect injection embedded in retrieved documents or tool responses;
- token- or spend-budget exhaustion;
- misuse of tools and side-effecting actions; and
- sensitive-data exposure in context, outputs, or logs.

For a support RAG assistant with a refund tool, treat retrieved content as untrusted, screen it separately, place
deterministic authorization immediately before the refund, cap tokens and tool calls, and redact unnecessary personal
data before both inference and logging.

Skills, plugins, and other reusable packages are also supply-chain inputs. Audit their requested network, shell,
filesystem, and credential access; prefer trusted publishers and signed/versioned distribution; apply least privilege
and sandboxing; deny standing credentials; and re-audit after remediation. Platform availability is not the same as a
security review.

## 3. Guardrail placement and failure direction

A guarded path has three distinct control points:

```text
request → input screen → model → output screen → tool authorization → side effect/response
```

The exact order can vary with the workflow, but authorization must precede the side effect. Log the result of every
gate.

### Match check type to the question

| Control                                                 | Typical check                                                   |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| Jailbreak or prompt-injection intent                    | Model-based semantic classifier, often chained with crisp rules |
| Banned term or known identifier                         | Deterministic blocklist/regex                                   |
| Toxicity or nuanced policy compliance in generated text | Model-based output judge                                        |
| JSON/schema/forbidden fields                            | Deterministic output validator                                  |
| Refund or record-write permission                       | Deterministic identity + scope + allowlist authorization        |

Screen retrieved documents and tool output separately because an input filter on the user's message cannot see indirect
injection introduced later.

### Fail open versus fail closed

Specify how an operator-owned guardrail behaves when the guardrail itself is unavailable. Fail open preserves
availability but passes unscreened traffic. Fail closed blocks traffic until the control recovers. High-impact or
irreversible paths generally fail closed and emit an operational event. This design choice applies to the controls the
application operates; it does not redefine the provider's built-in safety behavior.

### Failure pattern: one output filter

An output classifier cannot undo a refund that already ran. If the workflow accepts unscreened input, allows the model
to invoke an unguarded financial tool, and checks only the final text, the only irreversible event occurred before the
only control. Input screening, output screening, and action authorization answer different questions.

## 4. Fairness and transparency are architecture properties

Unequal outcomes can enter at four controllable points:

1. the retrieval corpus over- or under-represents groups;
2. prompt framing encodes an assumption;
3. few-shot examples reproduce a skew; or
4. downstream routing sends comparable people down different paths.

Instrument these points rather than assuming provider-level model evaluations cover the application. Aggregate accuracy
can look healthy while one subgroup is harmed.

### Decision logging

To reconstruct a decision, retain a governed record of:

- the inputs and derived features that mattered;
- retrieved context;
- model output;
- each routing step and its reason; and
- a decision/session identifier tying the trace together.

Different readers need different views of the same record:

- An affected person needs a clear, actionable explanation.
- A regulator needs comparable-case evidence and a reconstructable decision.
- The build team needs the full prompt, context, output, and routing trace.

The log itself can contain sensitive data. Apply minimization, access controls, retention limits, and regional handling,
and put those controls in the compliance register. A per-decision output with no inputs, an unlogged routing branch, an
uncaptured retrieval result, or a dashboard with no subgroup breakdown is a transparency gap.

## 5. Route human review by stakes

Human attention is a finite safety budget. Use three variables:

- **Reversibility:** how easily can a wrong decision be undone?
- **Cost of error:** what harm occurs if it remains wrong?
- **Confidence:** how likely is this particular result to be wrong, assuming the signal is calibrated?

Cost and reversibility set the stakes; confidence helps decide how much of that volume should be reviewed. Route
low-confidence decisions to a person when they are also high-cost or hard to reverse. Extremely consequential decisions
may require review even at apparently high confidence.

| Placement           | Appropriate use                       | Tradeoff                                     |
| ------------------- | ------------------------------------- | -------------------------------------------- |
| Pre-action approval | Irreversible/high-impact action       | Safest, but adds latency and staffing needs  |
| Post-action audit   | Reversible, lower-impact action       | Preserves throughput; error already occurred |
| Sampled review      | Population monitoring and calibration | Does not protect every individual decision   |

Show the reviewer the relevant inputs, the proposed result, and why it was flagged. Routing every item creates consent
fatigue; a large queue with an approve button but no context turns review into rubber-stamping. For agentic workflows,
gate high-value checkpoints such as plans, exceptions, and irreversible actions rather than every low-risk step.

## 6. Compliance: obligation → control → owner → evidence

A permitted entry point is a prerequisite, not proof of compliance. Regulations and policies state required outcomes;
the deployment supplies the concrete control and proof that it operates.

| Obligation                                   | Example control                                                     | Evidence                                                     | Owner example  |
| -------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ | -------------- |
| Protected health data under HIPAA            | Eligible HIPAA-ready configuration covered by a signed BAA          | Signed BAA, enabled setting, eligible-feature record         | Security lead  |
| Government workload at required impact level | Documented authorized delivery route                                | Authorization record and proof workload uses only that route | Platform owner |
| Regional processing/storage                  | Explicit region configuration for every copy, including logs/caches | Configuration plus current data-flow record                  | Data owner     |
| Reconstructable decisions                    | Queryable, retained decision log                                    | A successful sample reconstruction                           | Architect      |

Do not conflate exclusion from model training with zero retention. Data may not be used for training while still being
retained for logging, safety monitoring, legal, or configured audit purposes.

Evidence must remain live. A residency control that was correct at design time can silently fail when a logging
destination changes. Give each control an owner, define its evidence artifact, and revalidate it on a cadence.

## 7. Worked synthesis: public benefits assistant

For an assistant that recommends approval, denial, or referral under a government authorization regime:

1. Put program eligibility rules in the application layer; trained behavior owns only broad harm boundaries.
2. Place input and output screening plus deterministic tool/action authorization; specify fail-closed behavior for an
   unscreened denial path.
3. Inspect corpus, framing, examples, and routing for skew; capture a decision-level log that supports applicants,
   regulators, and engineers.
4. Send a low-confidence, difficult-to-reverse denial to pre-action human approval with inputs and flag reason.
5. Map each authorization and transparency obligation to its control, owner, and inspectable evidence.

Strong architecture answers name exact placement, check type, failure direction, review rule, and evidence. Merely
saying "add guardrails," "use a human," or "be compliant" is not an implementable design.

## Exam review checklist

- Can I draw the owner and blind spot of every safety layer?
- Can I identify direct and indirect injection paths?
- Can I place input, output, and action controls and choose deterministic versus model-based checks?
- Can I justify fail-open or fail-closed behavior?
- Can I name all four fairness injection points and reconstruct one decision?
- Can I route review using stakes rather than volume?
- Can I provide an owner and evidence artifact for every compliance control?
