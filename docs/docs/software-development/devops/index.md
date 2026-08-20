---
title: Delivery and Operations
description: 'A practical DevOps operating model connecting continuous delivery, observability, ownership, platform engineering, Linux, and AWS.'
sidebar_label: Overview
sidebar_position: 0
keywords:
  - devops
  - continuous delivery
  - observability
  - platform engineering
  - software operations
---

DevOps is an operating model for shortening the path from a code change to safe production learning. It joins development,
security, quality, and operations around one delivery system and shared outcomes. Tools enable that system; installing a
CI server or creating a "DevOps team" does not create the feedback loop by itself.

## The delivery loop

1. **Define:** make the user outcome, risk, acceptance evidence, and operational constraints visible.
2. **Build:** keep changes small, reviewable, reproducible, and testable.
3. **Verify:** automate fast checks and add deeper tests according to the failure risk.
4. **Package:** produce an immutable, identifiable artifact with provenance.
5. **Deploy:** promote the same artifact through environments using reviewed configuration.
6. **Observe:** measure user impact, system behaviour, cost, and security signals.
7. **Learn:** feed incidents, support requests, and product results into the next change.

A healthy loop makes a bad change easy to detect, stop, and recover from. Deployment frequency alone is not the goal.

## Shift left and shift right

**Shift left** moves useful feedback earlier: threat modelling, contract tests, dependency checks, policy validation, and
deployment previews. The aim is to make a class of failure cheaper to discover.

**Shift right** learns from realistic execution: canaries, feature flags, synthetic checks, production telemetry,
resilience exercises, and incident review. Some behaviours emerge only from real traffic, scale, dependencies, and
operator interaction.

These approaches complement each other. Production is not the first test environment, and pre-production cannot model
every production condition.

## Engineering practices

### Small, reversible changes

Prefer incremental changes with an explicit rollback or roll-forward route. Separate deployment from release with feature
flags when that lowers risk. Treat database migrations and message-schema changes as compatibility programmes, not one
atomic deployment.

### Continuous integration

Every change should be integrated frequently and receive fast, trustworthy feedback. Unreliable tests train engineers to
ignore the pipeline. Optimise for signal quality and time to useful failure, not the largest possible test count.

### Continuous delivery

Build once, identify the artifact, and promote it. Environment-specific values belong in configuration and secret
systems, not in separately rebuilt binaries. Protect production with appropriate approvals and policy while keeping the
mechanism repeatable.

### Observability and ownership

Instrument the user journey and dependency boundaries, not only host utilisation. Teams that change a service need enough
runtime access, telemetry, and on-call support to understand its behaviour. Ownership also requires sustainable escalation
and platform support; it should not mean every product team independently rebuilds infrastructure.

### Blameless learning with accountability

Incident review should explain how system conditions and decisions combined, then produce concrete improvements.
"Blameless" removes fear-based storytelling; it does not remove responsibility for following through on corrective work.

## Platform engineering

A platform team creates paved roads: reusable deployment, identity, telemetry, networking, security, and service templates
that reduce cognitive load. Treat the platform as a product:

- understand developer workflows;
- publish supported contracts;
- provide safe defaults and escape hatches;
- measure adoption and lead time;
- avoid hiding failure modes that service owners still need to operate.

## Architecture questions

- How quickly can a normal change reach production?
- What evidence blocks promotion?
- Can the deployed artifact be traced to source, dependencies, and configuration?
- How is a failed release detected, contained, and recovered?
- Who owns the service, pipeline, platform, and incident decision?
- Which controls are automated, and which require human judgement?
- How are operational findings converted into engineering work?

## Continue through the notebook

- [Testing](/software-development/devops/testing/) defines evidence at different layers.
- [GitOps](/software-development/devops/gitops/) applies declarative reconciliation to delivery.
- [Version control](/software-development/version-control/) covers the collaboration boundary.
- [Linux](/linux/) explains the runtime beneath build agents and workloads.
- [AWS CI/CD](/aws/development/cicd/) maps the model to AWS services.
- [CloudWatch](/aws/management/cloudwatch/) and [monitoring](/software-development/others/monitoring/) continue the
  operational feedback loop.

## Further reading

- [DORA research and capabilities](https://dora.dev/)
- [Continuous Delivery](https://continuousdelivery.com/)
- [Google SRE resources](https://sre.google/resources/)
