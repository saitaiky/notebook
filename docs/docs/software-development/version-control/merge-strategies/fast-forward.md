---
title: "Fast-forward"
metaTitle: "Git undo changes and remote controls"
metaDescription: "We will discuss topics related to git revert, reset, rebase, stash, fetch, pull, push and merge."

sidebar_position: 3
---

![what is git rebase](/img/software-development/version-control/fast-forward.gif)
Source: [atlassian: Pull Request Merge Strategies](https://blog.developer.atlassian.com/pull-request-merge-strategies-the-great-debate/)

A fast-forward merge can only happen if in `master` there are no more recent commits than the commits of the feature branch. In this case `master`'s `HEAD` can easily be moved to the latest commit of the feature branch. And the merge can complete without an explicit merge commit: it literally just fast-forwards the branch label to the new commit.

Differently than `rebase`, a `fast-forward` merge **will not change the commit ids (`sha-1`)**, but it will still lose the context of those commits as part of an earlier feature branch.