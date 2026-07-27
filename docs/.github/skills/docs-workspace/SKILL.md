---
name: docs-workspace
description: "Use when working in this Docusaurus notebook repo on docs or blog content structure, publication boundaries, archive placement, or deciding whether notes belong in docs/**, blog/**, or reference/**."
---

# Docs Workspace Skill

Use this skill when the task is not only about writing content, but also about deciding whether material should be public or private in this repository.

## Publication Boundary

- `docs/**` and `blog/**` are published by the site build.
- `reference/**` is the preferred private archive area for raw source material.
- Raw imports, study dumps, transcripts, and drafting inputs should live under `reference/**` unless the user explicitly wants them published.
- `unlisted: true` is not enough for private source material because the generated route can still exist on the deployed site.

## Default Workflow

1. Keep raw source material in `reference/**`.
2. Curate polished, reader-facing content into `docs/**` or `blog/**`.
3. When a file no longer belongs on the public site, move it out of the docs tree instead of only hiding it in frontmatter.
4. After moving published material, check for old path references and run `yarn build`.

## Practical Rule

If a note exists mainly to help write a future page or blog post, treat it as source material, not site content.