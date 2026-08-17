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

## Blog Preview Rule

- For every blog post in `blog/**/*.md`, include exactly one `<!-- truncate -->` marker.
- Place the marker after the short intro (usually after the first 1-4 paragraphs) so homepage previews stay concise.
- Keep the marker when editing existing posts; add it if a post is missing one.

---

## Knowledge Graph

The homepage at `/` includes a full-width interactive knowledge graph that maps hyperlink relationships across all published pages.

### How It Works

The graph is built at **Docusaurus build time**, not in the browser. The custom blog plugin (`src/plugins/custom-blog-plugin/index.js`) calls `buildGraph()` in its `contentLoaded` hook. That function:

1. Globs all `docs/**/*.md` and `blog/**/*.md` files (excluding `.wip` and `unlisted: true`).
2. Extracts markdown links via regex `/\[([^\[\]]+)\]\(([^)]+)\)/g`.
3. Derives canonical Docusaurus routes from file paths (e.g. `blog/2024-08-04-auth.md` → `/blog/2024/08/04/auth/`).
4. Builds a directed `graphology` graph, aggregates edge weights, and runs seeded Louvain community detection (`seedrandom('knowledge-graph-v1')` for reproducible colours).
5. Serialises the result as `home-page-knowledge-graph.json` and injects it into the homepage route module only.

### Key Files

| File | Purpose |
|---|---|
| `src/plugins/knowledge-graph/buildGraph.js` | Core build utility — scans, parses, derives routes, builds graph |
| `src/plugins/knowledge-graph/buildGraph.test.js` | Unit tests for routing and normalisation logic (`node --test` / `yarn test:graph`) |
| `src/plugins/custom-blog-plugin/index.js` | Docusaurus plugin that calls `buildGraph()` and injects the JSON into the route |
| `src/components/KnowledgeGraph/index.tsx` | SSR-safe wrapper — uses Docusaurus `BrowserOnly` to skip server-side rendering |
| `src/components/KnowledgeGraph/KnowledgeGraphClient.tsx` | Client-side renderer using `react-force-graph-3d` (Three.js/WebGL) |
| `src/components/KnowledgeGraph/styles.module.scss` | Canvas styles and responsive height breakpoints |
| `src/components/Home/index.js` | Homepage component — receives `knowledgeGraph` prop, renders `<KnowledgeGraph>` |

### Graph Stats (as of last build)

- **400 nodes**, **155 links**, **317 communities** (Louvain with seeded RNG)

### Rendering: 3D (react-force-graph-3d)

The graph renders as a full 3D WebGL scene via `react-force-graph-3d`, `three`, and `three-spritetext`. Node spheres are colour-coded by Louvain community; text labels are rendered as `SpriteText` billboards and only attached to hovered/highlighted nodes (via `nodeThreeObject` + `nodeThreeObjectExtend`) to keep the scene light with 400 nodes.

### Interactivity

- **Hover a node**: connected neighbours get a text-sprite label and their community colour; all other nodes fade to grey. Animated particles flow along highlighted edges.
- **Hover a link**: both endpoint nodes highlight the same way.
- **Drag / orbit / zoom**: default Three.js trackball controls (rotate by dragging, zoom with scroll, pan with right-click drag).
- **Click a node**: navigates to that page.
- The camera auto-fits to the graph after the force simulation stabilises (`warmupTicks: 60`, `cooldownTime: 5000 ms`).

### Dependency Management Warning

This repo uses **yarn 3.2.4** with a lockfile that pins Docusaurus to **3.4.0**. The new graph packages (`graphology`, `graphology-communities-louvain`, `react-force-graph-2d`, `gray-matter`, `fast-glob`, `seedrandom`) were added with `yarn add` to keep the lockfile consistent.

**Never run bare `npm install`** — it will update the lockfile and upgrade Docusaurus to `3.x.latest`, which breaks the build. If you need to add packages, use `yarn add <package>` with the proxy/VPN off. If node_modules gets into a broken mixed state, restore with:

```bash
git checkout -- yarn.lock
rm -rf node_modules
yarn install
```

---

## Knowledge Graph — Tunable Parameters

All parameters that a coding agent might need to adjust are listed here. Changes to the graph source code require restarting the dev server (`yarn start`) to take effect; embedding changes only call the API for pages whose content hash changed since the last run.

### Environment (`.env.local` — never committed)

| Variable | Example value | Purpose |
|---|---|---|
| `EMBEDDING_ENDPOINT` | `https://genai-sharedservice-emea.pwcinternal.com` | Base URL of the OpenAI-compatible embeddings API |
| `EMBEDDING_API_KEY` | `sk-...` | Bearer token — rotate after sharing in chat or logs |
| `EMBEDDING_MODEL` | `azure.text-embedding-3-large` | Model name/deployment sent in the request body |

### Embedding behaviour (`src/plugins/knowledge-graph/embeddings.js`)

| Parameter | Location | Current value | Effect |
|---|---|---|---|
| `BATCH` | line ~69 | `20` | Pages per API request. Reduce to `5`–`10` if the gateway returns 503s. |
| Input text | line ~63 | `title + body[:1800]` | Content embedded per page. Increase slice to capture more body; decrease to lower token cost. |

### Semantic edge generation (`src/plugins/knowledge-graph/buildGraph.js`)

| Parameter | Call site | Current value | Effect |
|---|---|---|---|
| `topK` | `buildSemanticEdges(..., { topK: 8 })` | `8` | Max semantic edges **per node**. Higher → denser graph, hub pages become very connected. |
| `threshold` | `buildSemanticEdges(..., { threshold: 0.68 })` | `0.68` | Minimum cosine similarity (0–1) to create a semantic edge. Lower → more edges, potentially noisier. Higher → fewer, tighter connections only. |

With `text-embedding-3-large`, typical similarity ranges:
- `> 0.80` — very tight (almost duplicate content)
- `0.70–0.80` — closely related topics
- `0.60–0.70` — broadly similar domain
- `< 0.60` — probably coincidental overlap

### UI filter buttons (`src/components/KnowledgeGraph/KnowledgeGraphClient.tsx`)

| Parameter | Location | Current value | Effect |
|---|---|---|---|
| `SECTION_MIN_PAGES` | top of component | `8` | A section needs ≥ this many pages to get its own filter button. Sections below the threshold still appear in the **All** view. |

### Cache

- File: `.embedding-cache.json` in site root (gitignored by default)
- Key: `SHA-256(title + body[:1800])`
- Hit: no API call. Miss: re-embeds only changed pages.
- Delete the file to force a full re-embed of all pages.