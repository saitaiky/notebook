---
applyTo: "docs/**/*.md"
---

# Diagram UX Standard

Use this standard for documentation pages under `docs/**`.

Repo-wide rules in `.github/copilot-instructions.md` still apply. This file adds a stronger UX preference for diagrams in technical content.

## Mermaid-First Rule

- Prefer Mermaid diagrams whenever a concept can be explained more clearly with a visual flow than with prose alone.
- For technical pages, add at least one Mermaid diagram when the page contains any of the following:
  - multi-step workflows with 3 or more stages,
  - branching or routing decisions,
  - interactions between 3 or more components,
  - lifecycle/state transitions,
  - layered architecture.
- Replace plain-text flow blocks (ASCII arrows or pseudo-diagrams) with Mermaid when feasible.

## Visual Mode Decision Rule

- Before adding new visuals while updating content, ask the user which visual mode to use for that update:
  - NotebookLM placeholders,
  - manual image insertion,
  - or no visual additions.
- Do not assume NotebookLM placeholders by default.

## NotebookLM Placeholder Rule

- Use HTML comment placeholders only when the user explicitly selects NotebookLM placeholder mode.
- Use one-line placeholders with concise metadata so image generation prompts are consistent.
- Recommended format:

```markdown
<!-- NOTEBOOKLM_DIAGRAM: concept=<name>; type=image; goal=<what the visual must explain>; complexity=<basic|intermediate|advanced> -->
```

- Place NotebookLM placeholders only where visuals materially improve understanding of difficult concepts.

## Diagram Quality Rules

- Keep one diagram focused on one core concept.
- Add a short lead-in sentence before each diagram.
- Add a short interpretation after each diagram that explains what to notice.
- Prefer readable node labels and avoid oversized graphs.

## Practical Constraints

- Do not force diagrams where a short paragraph or table is objectively clearer.
- Keep existing links and page structure stable when inserting diagrams.
- Ensure Mermaid syntax is valid for Docusaurus rendering.

## Verification

- Run `yarn build` after adding or modifying Mermaid diagrams.
