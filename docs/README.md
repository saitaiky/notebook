# Notebook Docs Workspace

This repository is a Docusaurus-based personal knowledge site.

If you are a new agent working in this repo, start with these assumptions:

## What This Repo Contains

- `docs/**` holds evergreen documentation pages.
- `blog/**` holds dated posts.
- `.github/copilot-instructions.md` is the main source of truth for writing and editing rules.
- `.github/instructions/**` adds scoped rules for specific content areas.

## How To Work Here

- Prefer minimal edits over broad rewrites.
- Preserve stable slugs and internal links unless a migration is explicitly requested.
- Write in a personal knowledge-site voice: default to first-person singular when the author is describing work or judgment.
- Keep pages readable as chapters, not cheatsheets.
- Avoid thin subsections with only 1-2 short sentences.
- If several sibling subsections are parallel and brief, merge them into a list, comparison block, or stronger parent section.
- Do not refer to pages as `Module 1`, `Module 2`, and similar labels unless the UI visibly uses that numbering.
- In multi-post series, prefer link-based wording such as "the previous post" or "the next post" with the real post title.

## Code Example Rules

- Do not call examples `lab snippets` in published docs.
- Introduce code with a short lead-in that explains what the example demonstrates and why it matters.
- Make code examples understandable without requiring the reader to cross-check an external notebook.

## Visual And Structural Rules

- Use admonitions when a concept, warning, or default deserves emphasis.
- Use Mermaid diagrams when a flow, system interaction, routing path, or lifecycle is materially easier to understand visually than in prose.
- Do not create a parent section that contains only one subsection unless there is a strong structural reason.

## Practical Workflow

1. Read `.github/copilot-instructions.md` before making content changes.
2. Check for any scoped instruction file that applies to the file you are editing.
3. Edit the smallest useful surface area.
4. If frontmatter, links, headings, or content structure change, run `yarn run build` from this folder.

## Useful Commands

```bash
yarn install
yarn run start
yarn run build
```

## Current Content Pattern To Preserve

- The AI / RAG series under `docs/ai/llm/rag/**` has been rewritten toward a chapter-style format.
- Those pages now prefer `Key Takeaways`, `Conclusion`, and link-based series transitions over numbered module labels.
- Retrieval, generation, and production chapters use descriptive code-example lead-ins and selective Mermaid diagrams.

