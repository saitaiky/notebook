---
applyTo: "docs/ai/search-plan/*.md"
---

# Search-Plan Depth And Length Budget

Use this standard only for the search-plan series under `docs/ai/search-plan/*.md`.

This is a scoped rule for this chapter set, not a global docs rule.

## Goal

Expand chapter depth enough to support strong conceptual understanding while keeping pages readable and structurally focused.

## Length Budget Rule

- Use the current page length as the baseline.
- Expansion may increase each page by up to 40 percent.
- Treat the value as a hard cap, not a target.
- If a page needs more than the cap for coherence, ask for approval before exceeding it.

Baseline and cap values (measured on 2026-05-15 using `wc -w`):

| Page | Baseline words | Max words (+40%) |
| --- | ---: | ---: |
| `docs/ai/search-plan/index.md` | 1133 | 1590 |
| `docs/ai/search-plan/foundations-csp.md` | 1885 | 2640 |
| `docs/ai/search-plan/uninformed-informed-search.md` | 2064 | 2890 |
| `docs/ai/search-plan/search-optimization-game-playing.md` | 1969 | 2760 |
| `docs/ai/search-plan/planning-and-probabilistic-reasoning.md` | 2054 | 2880 |

Series-level budget:

- Baseline total: 9105 words.
- Max total (+40%): 12750 words.

## Expansion Priority Rule

When adding depth, prioritize difficult sections first:

- mechanism clarity,
- worked example or trace,
- practical implication for implementation.

Avoid filler paragraphs added only to increase length.

## Readability Rule

- Prefer short paragraphs and concrete examples.
- Prefer comparison tables when tradeoffs are easier to scan in table form.
- Keep heading structure clean and avoid thin subsections.

## Diagram Coordination Rule

For visuals in this scope, follow the visual-mode decision process in `diagram-ux.instructions.md` before adding NotebookLM placeholders or manual image insertions.
