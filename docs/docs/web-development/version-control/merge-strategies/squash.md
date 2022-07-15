---
title: "Squash"
metaTitle: "Git undo changes and remote controls"
metaDescription: "We will discuss topics related to git revert, reset, rebase, stash, fetch, pull, push and merge."

sidebar_position: 2
---

There are 2 comamands that you can use to produce a "squashed" commit. But they serve different purposes. They are 
- `git merge --squash` for Squash commits
- `git rebase --interactive` for Squash and Merge

## Squash commits

There are 2 ways to use `rebase` to squash commits, which are
- `git rebase -i HEAD~<n>`
- `git rebase -i <after-this-commit-sha1>`

```bash
# i flag indicates that this will be an interactive rebase with the ‘<n>’ designating the number of commits that you wish to rebase.
git rebase -i HEAD~3 
```

### rebase interface
After running the `git rebase -i` command, an interface with options to perform the various actions for each commits in a rebase action.

![rebase-animation](/img/web-development/version-control/rebase-animation.gif)

Source: [A Beginner’s Guide to Squashing Commits with Git Rebase](https://medium.com/@slamflipstrom/a-beginners-guide-to-squashing-commits-with-git-rebase-8185cf6e62ec)

## Squash and merge

> TL-DR; retains the changes but omits the individual commits from history

`git merge --squash branchname` will produce a squashed commit on the destination branch, without marking any merge relationship. It *does not produce a commit* right away. You need an additional `git commit -m "squash branch"`

This is useful if you want to **throw away the source branch completely**. 

### Use case
As you work on a feature branch, you often create small, self-contained commits. These small commits help describe the process of building a feature, but can clutter your Git history after the feature is finished. As you finish features, you can combine these commits and ensure a cleaner merge history in your Git repository by using the squash and merge strategy.

You can`squash` all feature branch's commits into a single commit before performing a `fast-forward` merge or `rebase`. This keeps the mainline branch history linear and clean. It isolates the entire feature in a single commit. But it loses insight and details on how the feature branch developed throughout. So... trade-offs.

### Example

```
$ git checkout stable

          X               stable
         /
a---b---c---d---e---f---g tmp

```

to:

```
$ git merge --squash tmp
$ git commit -m "squash tmp"

# In the following graph, G is c--d--e--f--g squashed together

          X-------------G stable
         /
a---b---c---d---e---f---g tmp

```

and then deleting `tmp` branch.


### Animated diagram

![what is git rebase](/img/web-development/version-control/squash.gif)
Source: [atlassian: Pull Request Merge Strategies](https://blog.developer.atlassian.com/pull-request-merge-strategies-the-great-debate/)

### Static diagram

![Squash](/img/web-development/version-control/squash-and-merge.png)
Source: [What is the difference between merge --squash and rebase?](https://stackoverflow.com/questions/2427238/what-is-the-difference-between-merge-squash-and-rebase)
