# Docs Workspace Instructions

This repository hosts a Docusaurus-based personal knowledge site. Use these rules when creating or updating content.

## Scope

- Primary content roots:
  - `docs/**` for evergreen documentation pages
  - `blog/**` for dated posts and updates
- For blog SEO and metadata standards, follow:
  - `.github/instructions/blog-content-seo.instructions.md`

## Editing Principles

- Prefer minimal edits over broad rewrites.
- Preserve existing permalink stability (`slug`) unless migration is explicitly requested.
- Keep markdown structure semantic (`#`, `##`, tables, lists) for readability and indexing.
- Ensure links are valid and keep existing internal URLs stable.

## Verification

Run from this folder when possible:

- `yarn install`
- `yarn start`
- `yarn build`

If frontmatter or links are changed, prefer running at least `yarn build` to catch content errors.
