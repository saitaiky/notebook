---
applyTo: "blog/**/*.md"
---

# Blog Content And SEO Standard

Use this standard for all blog content updates.

## Required Frontmatter

Every blog post should include:

- `title`: clear and human-readable title.
- `slug`: stable, lowercase kebab-case URL path.
- `description`: concise summary (about 140-160 chars ideal).
- `tags`: 3-8 specific topic tags.
- `keywords`: 5-12 SEO keywords/phrases.
- `image`: social preview image (absolute URL or stable static path).

Recommended when available:

- `authors`: author id(s) configured in Docusaurus blog settings.
- `draft`: only for non-public drafts.

## Tag Quality Rules

- Use specific terms, not generic placeholders.
- Keep tags lowercase and readable.
- Avoid typos and duplicates.
- Reuse existing tag vocabulary where practical for archive consistency.

## SEO Rules (Docusaurus)

- Prefer frontmatter (`description`, `keywords`, `image`) over manual `<head>` metadata in Markdown posts.
- Ensure each post has meaningful publish context (date from filename or frontmatter) and content summary.
- Include at least one relevant image for social cards.
- Maintain human-readable links and stable slugs.

## Content Update Rules

- Keep intro paragraph aligned with `description` intent.
- Keep one clear `##` hierarchy; avoid heading jumps.
- Keep `<!-- truncate -->` in long posts for blog list previews.
- Preserve existing links unless they are broken; fix broken links in the same change.

## Pre-merge Checklist

- Frontmatter fields present and valid.
- `tags` and `keywords` are specific and searchable.
- No markdown lint issues introduced.
- Site still builds successfully (`yarn build`).
