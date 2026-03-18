# Docs Workspace Instructions

This repository hosts a Docusaurus-based personal knowledge site. Use these rules when creating or updating content.

## Scope

- Primary content roots:
  - `docs/**` for evergreen documentation pages
  - `blog/**` for dated posts and updates
- For blog SEO and metadata standards, follow:
  - `.github/instructions/blog-content-seo.instructions.md`
- Treat this file as the source of truth for repo-wide writing rules.
- Scoped instruction files under `.github/instructions/**` should add only section-specific constraints, not restate general repository rules unless a stricter scoped exception is necessary.

## Editing Principles

- Prefer minimal edits over broad rewrites.
- Preserve existing permalink stability (`slug`) unless migration is explicitly requested.
- Keep markdown structure semantic (`#`, `##`, tables, lists) for readability and indexing.
- Ensure links are valid and keep existing internal URLs stable.

## Heading And Section Structure

- Do not create a section that contains only one subsection.
- A parent heading should usually introduce either:
  - direct body content followed by multiple sibling subsections, or
  - at least two subsections that justify the extra layer.
- If a section would contain only one child subsection, prefer one of these instead:
  - merge the child content into the parent section body,
  - remove the parent wrapper and promote the child heading,
  - split the section into at least two genuinely distinct subsections if the content supports it.
- Use extra heading depth only when it improves scanning and information architecture, not just to decorate the page.
- Avoid numeric prefixes in headings and subsection titles, such as "Part 1", "1.1", or "2.4", unless the numbering is explicitly requested or the UI visibly exposes that numbered structure.
- Prefer descriptive heading text without numbering by default.
- If numbering might improve cross-reference or teaching flow, ask before introducing it rather than assuming it is wanted.

## Subsection Depth And Substance

- Avoid creating subsections that contain only 1-2 short sentences.
- If content under a heading is too short to stand on its own, prefer one of these:
  - merge it into the parent section body,
  - convert multiple thin subsections into a single list or comparison block,
  - expand the subsection with concrete explanation (mechanism, example, implication, and practical takeaway).
- Use a dedicated subsection only when it materially improves comprehension, navigation, or future extensibility.
- If the idea can be communicated clearly in a compact paragraph without losing scanability, prefer the paragraph over a new heading.

## Review Checklist

- Does each heading earn its own section, or should the content be merged into the parent body?
- Does any subsection contain only 1-2 short sentences?
- Should parallel sibling subsections become a list, comparison block, or table instead?
- Does each kept subsection explain mechanism, example, and practical implication when the topic is technical?
- Would removing one layer of headings make the page read more like a chapter and less like a cheatsheet?

## Code Example Presentation

- Do not label code examples as "lab snippets" in published docs.
- Introduce code with a short lead-in that explains what the example demonstrates and why it matters.
- If a code example needs a heading, prefer descriptive labels such as "Example", "A minimal implementation", or a concept-specific title.
- Code examples should be understandable without requiring the reader to cross-check an external notebook before reading the surrounding explanation.

## Author Voice (Personal Site)

- This is a personal knowledge site, so default to first-person singular voice for project narratives and reflective explanations (use "I" instead of "we" when describing work completed by the site owner).
- Avoid platform or institutional tone unless the user explicitly requests it.
- In published multi-post series, avoid referring to chapters as "Module 1", "Module 2", and similar labels unless the UI visibly exposes that numbering.
- When referring to adjacent entries in a series, prefer link-based wording such as "the previous post" or "the next post" with the actual page title.

## Admonition Usage (AI/Agent Docs)

- Use Docusaurus admonitions when information should stand out from surrounding prose, especially in AI and agent-system documentation.
- Prefer these defaults:
  - `:::info` for important concept clarifications and system behavior notes.
  - `:::tip` for actionable defaults and practical implementation shortcuts.
  - `:::warning` for risky actions, caveats, or common misconfiguration pitfalls.
  - `:::danger` for destructive, security-sensitive, or privacy-sensitive operations.
  - `:::note` for useful non-critical side context.
- Add admonitions when any of the following apply:
  - a reader could make a harmful or expensive mistake,
  - a strongly recommended default should be emphasized,
  - a concept is frequently misunderstood,
  - security/compliance constraints must be explicit.
- Keep admonitions readable and formatter-safe by including blank lines inside the directive blocks.
- Use admonitions selectively; overuse reduces visual emphasis.

## Mermaid Diagram Usage

- Use Mermaid diagrams when a concept is materially easier to understand visually than through prose alone.
- Prefer adding a diagram when one or more of the following is true:
  - the topic describes a multi-step flow with 3 or more stages,
  - the topic includes branching, looping, routing, or decision points,
  - the topic explains interactions between 3 or more system components,
  - the topic compares layered architecture, hierarchy, lifecycle, or state transitions,
  - the reader would otherwise need to mentally reconstruct a process from several dense paragraphs.
- Do not add a Mermaid diagram when a short paragraph or small list already explains the idea clearly.
- When a diagram is appropriate, keep it focused on one concept only; avoid oversized diagrams that try to explain the whole page.
- Pair each diagram with a short lead-in sentence and a short interpretation after the diagram so the reader knows what to look at.
- For AI, agentic-system, and RAG content, diagrams are especially useful for:
  - retrieval and generation pipelines,
  - agentic workflows,
  - routing and evaluation loops,
  - indexing and reranking flows,
  - trust boundaries and production architecture.
- If a diagram is warranted and Mermaid support is available, prefer using the Mermaid workflow/skill rather than hand-waving the structure in prose.

## Frontmatter Safety

- Always write valid YAML frontmatter wrapped by `---` delimiters.
- Quote string values for `title` and `description` with double quotes.
- Quote any frontmatter string that includes special characters such as `:`, `#`, `[`, `]`, `{`, `}`.
- Use spaces only for YAML indentation (never tabs).
- Keep list indentation consistent.

## Verification

Run from this folder when possible:

- `yarn install`
- `yarn start`
- `yarn build`

If frontmatter or links are changed, prefer running at least `yarn build` to catch content errors.
