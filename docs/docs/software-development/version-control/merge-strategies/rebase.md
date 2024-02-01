---
title: "Rebase"
metaTitle: "Git undo changes and remote controls"
metaDescription: "We will discuss topics related to git revert, reset, rebase, stash, fetch, pull, push and merge."

sidebar_position: 1
---

> TL;DR - `rebase` moves the entire feature branch to begin on the tip of the master branch which means that you try to use another branch as the new **base** for your work.

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
- If you’re not entirely comfortable with `git rebase`, you can always perform the rebase in a temporary branch. That way, if you accidentally mess up your feature’s history, you can check out the original branch and try again. For example:
    ```
    git checkout feature
    git checkout -b temporary-branch
    git rebase -i main
    # [Clean up the history]
    git checkout main
    git merge temporary-branch
    ```
:::

### Differences between rebase and merge?

- `merge`
    - It **preserves** history! becuase it does not touch your source branch (`tmp` here)
    - It produces a new generated commit (the so called merge-commit). 
    This new commit will have two parents - the latest commit from your string of commits and the latest commit of the other branch you're merging.
- `rebase`
    - It **rewrites** history!
    - It only moves existing commits, which is a **bad Thing** after you've pushed it.
    - You can choose to squash all commits or contrary to merge --squash, you can choose **to replay some, and squashing others**.
    - It allows you to go on the same source branch (still `tmp`) with:
        - a new base
        - a cleaner history
        
## Use case

> TL;DR - `merge` is best used when the target branch is supposed to be shared whereas `rebase` is best used when the target branch is private

:::danger
Use `merge` but not `rebase` **whenever you've already pushed**, because the remote is presumed to be shared with active collaborators. If they pull what you pushed, then you rebase, it can be difficult to reconcile what they do (on the non-rebased commit) with what you're doing (on the rebased commit).

If you're the only one pushing and pulling to the remote, you can do whatever.
:::

To choose which one to use, it depends on what is most important - a tidy history or a true representation of the sequence of development

If a tidy history is the most important, then you would rebase first and then merge your changes, so it is clear exactly what the new code is. **If you have already pushed your branch, don't rebase unless you can deal with the consequences.**

Check this [blog post - Git team workflows: merge or rebase?](https://www.atlassian.com/git/articles/git-team-workflows-merge-or-rebase) for more comparsion.

### When to use `merge`?
Let's say you have created a branch for the purpose of developing a single feature. When you want to bring those changes back to master, you probably want merge (you don't care about maintaining all of the interim commits).

Typically, you do this by clicking the "Merge" button on Pull/Merge Requests, e.g. on GitHub.

### When to use `rebase`?
A second scenario would be if you started doing some development and then another developer made an unrelated change. You probably want to pull and then rebase to base your changes from the current version from the repository.

Typically, you do this in feature branches whenever there's a change in the main branch.

## [Pros](https://stackoverflow.com/questions/804115/when-do-you-use-git-rebase-instead-of-git-merge#:~:text=Use%20rebase%20whenever%20you%20want,change%20in%20the%20main%20branch.)

- **Cleaner Project History:** By reapplying changes on top of the main branch, rebase creates a linear and more readable history.
- **Simplifies Potential Merge Conflicts:** Rebasing allows you to resolve conflicts from a series of commits incrementally which can simplify the conflict resolution process.
- **Up-to-Date History:** Running rebase frequently keeps your feature branch up-to-date with the main branch, facilitating a smoother final merge.

:::infoThe Paradox of Merging in Git: When Rivers of Code Defy Logic
Merging creates a loop which **destroys the mental model that Git was designed** by which causes troubles in any visualization of the Git history.

Imagine there's a river (e.g. the "Nile"). Water is flowing in one direction (direction of time in Git history). Now and then, imagine there's a branch to that river and suppose most of those branches `merge` back into the river. That's what the flow of a river might look like naturally. It makes sense.

But then imagine there's a small branch of that river. Then, for some reason, the river merges into the branch and the branch continues from there. The river has now technically disappeared, it's now in the branch. But then, somehow magically, that branch is merged back into the river. Which river you ask? I don't know. The river should actually be in the branch now, but somehow it still continues to exist and I can merge the branch back into the river. So, the river is in the river. Kind of doesn't make sense.

This is exactly what happens when you merge the base branch into a `feature` branch and then when the `feature` branch is done, you merge that back into the base branch again. The mental model is broken. And because of that, you end up with a branch visualization that's not very helpful.
:::


## Cons

> TL;DR - One can indeed apply some commits to master without creating a merge commit. This procedure completely loses the context of where those commits come from, unfortunately.

- **Rewrites History**: Rebase changes the commit hashes, effectively rewriting history. This can be problematic for shared branches where others may base their work on the existing commits.
- **Potential for Complications and Data Loss**: If not done carefully, rebasing can lead to complications and possible data loss, especially for users who are not familiar with the process.
- **Poor Traceability**: If a feature branch has been rebased, it's sometimes hard to trace back to the original changes and discussions attached to the previous commits.
