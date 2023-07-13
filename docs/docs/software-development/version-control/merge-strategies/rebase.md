---
title: "Rebase"
metaTitle: "Git undo changes and remote controls"
metaDescription: "We will discuss topics related to git revert, reset, rebase, stash, fetch, pull, push and merge."

sidebar_position: 1
---

> TL;DR - `rebase` moves the entire feature branch to begin on the tip of the master branch, effectively incorporating all of the new commits in master.

## Overview

![what is git rebase](/img/software-development/version-control/rebase.png)
Source: [atlassian: Pull Request Merge Strategies](https://blog.developer.atlassian.com/pull-request-merge-strategies-the-great-debate/)


One of the uses of rebase is precisely to replay commits--one by one--on top of a specific branch. Note that this operation **rewrites all the ids (`sha-1`) of those commits**.

This happens because when `git` computes the unique id of a commit it takes into account the parent commit. If the parent commit changes, the `sha-1` of the replayed commit changes too.

```bash
# The below 2 commands move all of the commits in master onto the tip of branchname.
git checkout branchname
git rebase master
# Merging does exactly what above 2 commands do, but it creates a new merge commit. 
git merge master branchname

# Cancel rebase
git rebase --abort
```

:::caution Tips
- If at some point during the `git rebase` you got panic (due to the CONFLICT error), just do `git rebase --abort` and you’re back to normal. You can then calm down and gather your breath to see what you want to do next.
- When resolving a conflict, the conflicted files may seem to miss some of your latest changes. This is normal because the files is at a specific commit where the conflict first occured. You may need to resolve different conflicts in the same file multiple times.
:::

:::danger
Use `merge` but not `rebase` **whenever you've already pushed**.
:::

### Example

```bash
git checkout tmp
git rebase -i stable

   stable
      X----------------G tmp
     /
a---b
```

### Differences between rebase and merge?

- `merge --squash`
    - It **preserves** history! becuase it does not touch your source branch (`tmp` here)
    - It produces a new generated commit (the so called merge-commit). 
    This new commit will have two parents - the latest commit from your string of commits and the latest commit of the other branch you're merging.
- `rebase`
    - It **rewrites** history!
    - It only moves existing commits, which is a **bad Thing** after you've pushed it.
    - You can choose to squash all commits or contrary to merge --squash, you can choose **to replay some, and squashing others**.
    - It allows you to go on on the same source branch (still `tmp`) with:
        - a new base
        - a cleaner history
## Use case

:::info TL;DR - 
To choose which one to use, it depends on what is most important - a tidy history or a true representation of the sequence of development

If a tidy history is the most important, then you would rebase first and then merge your changes, so it is clear exactly what the new code is. **If you have already pushed your branch, don't rebase unless you can deal with the consequences.**

Check this [blog post - Git team workflows: merge or rebase?](https://www.atlassian.com/git/articles/git-team-workflows-merge-or-rebase) for more comparsion.
:::


### In which situations should we use a `merge`?
Let's say you have created a branch for the purpose of developing a single feature. When you want to bring those changes back to master, you probably want merge (you don't care about maintaining all of the interim commits).

Typically, you do this by clicking the "Merge" button on Pull/Merge Requests, e.g. on GitHub.

### In which situations should we use a `rebase`?
A second scenario would be if you started doing some development and then another developer made an unrelated change. You probably want to pull and then rebase to base your changes from the current version from the repository.

Typically, you do this in feature branches whenever there's a change in the main branch.

## Rebase Pro & Con

### [Pros](https://stackoverflow.com/questions/804115/when-do-you-use-git-rebase-instead-of-git-merge#:~:text=Use%20rebase%20whenever%20you%20want,change%20in%20the%20main%20branch.)

1. The git history will include many **unnecessary merge commits**. If multiple merges were needed in a feature branch, then the feature branch might even hold more merge commits than actual commits!

2. This creates a loop which **destroys the mental model that Git was designed** by which causes troubles in any visualization of the Git history.

    Imagine there's a river (e.g. the "Nile"). Water is flowing in one direction (direction of time in Git history). Now and then, imagine there's a branch to that river and suppose most of those branches `merge` back into the river. That's what the flow of a river might look like naturally. It makes sense.

    But then imagine there's a small branch of that river. Then, for some reason, the river merges into the branch and the branch continues from there. The river has now technically disappeared, it's now in the branch. But then, somehow magically, that branch is merged back into the river. Which river you ask? I don't know. The river should actually be in the branch now, but somehow it still continues to exist and I can merge the branch back into the river. So, the river is in the river. Kind of doesn't make sense.

    This is exactly what happens when you merge the base branch into a `feature` branch and then when the `feature` branch is done, you merge that back into the base branch again. The mental model is broken. And because of that, you end up with a branch visualization that's not very helpful.

### Cons

> TL;DR - One can indeed apply some commits to master without creating a merge commit. This procedure completely loses the context of where those commits come from, unfortunately.

- Squashing the feature down to a handful of commits can hide context, unless you keep around the historical branch with the entire development history.
- Rebasing doesn't play well with pull requests, because you can't see what minor changes someone made if they rebased (incidentally, the consensus inside the Bitbucket development team is to never rebase during a pull request).
- Rebasing can be dangerous! Rewriting history of shared branches is prone to team work breakage. This can be mitigated by doing the rebase/squash on a copy of the feature branch, but rebase carries the implication that competence and carefulness must be employed.
- It's more work: Using rebase to keep your feature branch updated requires that you resolve similar conflicts again and again. Yes, you can reuse recorded resolutions (rerere) sometimes, but merges win here: Just solve the conflicts one time, and you're set.
