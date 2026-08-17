---
applyTo: "blog/**/*.md"
---

# Blog Content And SEO Standard

Use this standard for all blog content updates.

Repo-wide rules in `.github/copilot-instructions.md` still apply. This file should be read as adding blog-specific requirements, not replacing global repository guidance.

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
- Include exactly one `<!-- truncate -->` marker in every blog post, placed after a concise intro so blog/home previews do not show the full article.
- Preserve existing links unless they are broken; fix broken links in the same change.

## Audience And Voice Rules

Use these defaults unless the user explicitly requests a different audience or tone.

### Audience

- For technical posts: software engineers and technical practitioners.
- For non-technical posts: general readers seeking practical reflection and clearer understanding.
- Match depth, examples, and vocabulary to the topic domain.

### Tone

- Professional, practical, and clear.
- Confident but not hype-driven.
- Helpful and direct; avoid marketing language.
- Use plain English and define niche jargon on first use.
- For non-technical topics, allow a warmer and more reflective voice while staying structured and evidence-aware.

### Style

- Start with the problem and why it matters in practice.
- Prefer short paragraphs and concrete examples.
- Favor actionable guidance, trade-offs, and decision criteria.
- Use active voice and specific wording; avoid vague filler.
- Keep claims grounded; avoid overpromising outcomes.

### Non-Technical Topic Style (Psychology-Inspired)

Apply this style for non-technical domains such as psychology, life, culture, education, and related reflective topics.

- Use explanatory and human-centered writing with practical relevance.
- Allow first-person motivation/context briefly when it improves reader connection.
- Balance concept explanation with lived examples and actionable takeaways.
- Keep a calm, thoughtful tone; avoid sales-like or overly promotional phrasing.
- Preserve nuance: avoid absolute claims when discussing human behavior.
- Separate evidence-backed points from personal opinion clearly.
- Prefer educational clarity over dense academic jargon.

### Readability And Structure

- Include a concise intro that states audience value.
- Use lists for steps, comparisons, and checklists.
- End with practical takeaways or next-step guidance when appropriate.

## Pre-merge Checklist

- Frontmatter fields present and valid.
- `tags` and `keywords` are specific and searchable.
- No markdown lint issues introduced.
- Site still builds successfully (`yarn build`).
