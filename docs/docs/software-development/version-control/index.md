---
title: 'Version Control'
description:
  'A guided path through everyday Git, synchronisation, undo operations, and merge strategies for collaborative software
  delivery.'
sidebar_label: Overview
sidebar_position: 0
keywords:
  - git
  - version control
  - branching
  - merge strategy
  - software delivery
---

Version control is the handoff between individual programming work and team delivery. These notes move from safe daily
operations to the branch and merge decisions that shape review history, release flow, and recovery.

## Learning sequence

1. Begin with [Git basics](/software-development/version-control/basic/) and the
   [daily workflow](/software-development/version-control/daily/).
2. Learn how to [synchronise local and remote history](/software-development/version-control/basic/syncing/) before
   choosing a merge strategy.
3. Practise [undo and recovery](/software-development/version-control/basic/undo/) so mistakes remain reversible.
4. Compare [merge strategies](/software-development/version-control/merge-strategies/):
   [fast-forward](/software-development/version-control/merge-strategies/fast-forward/),
   [rebase](/software-development/version-control/merge-strategies/rebase/), and
   [squash](/software-development/version-control/merge-strategies/squash/).

The right strategy depends on what the history must communicate. Preserve meaningful intermediate commits when they help
review or rollback; compress noise when the branch history is only an implementation scratchpad.

## Continue into delivery

[GitOps](/software-development/devops/gitops/) treats version-controlled declarations as the desired state of a system.
[DevOps](/software-development/devops/) places that idea in the wider feedback loop, while
[AWS CI/CD](/aws/development/cicd/), [CDK](/aws/development/cdk/), and
[CloudFormation](/aws/development/cloudformation/) show AWS-specific implementation options.
