# AGENT.md

This file gives a coding agent enough project context to work in this repository without the user having to restate the basics each time.

## Project Summary

- This repository is a Docusaurus site for a personal knowledge base.
- The main source content lives in `docs/`.
- The blog lives in `blog/` and is enabled through a custom plugin.
- Built output lives in `build/` and should not be edited directly.
- Static assets live in `static/` and `public/`.

## Key Content Roots

- `docs/**`: evergreen documentation pages.
- `blog/**`: dated blog posts.

### docs/ Content Map

```
docs/
├── ai/
│   ├── index.md, prerequisites.md
│   ├── agentic-system/    # RAG, chunking, embedding, prompting, evaluation, patterns
│   ├── dl/                # CNN foundations, sequence models, generative models
│   ├── llm/
│   │   ├── foundations/
│   │   ├── rag/
│   │   └── generative-ai-with-llm/
│   │       ├── wk1/  "Project lifecycle and pre-training"
│   │       │   ├── transformer-promptengineering-config.md   (pos 1)
│   │       │   ├── pretrain-scaling.md                       (pos 2)
│   │       │   └── extra-resources.md
│   │       ├── wk2/  "Fine-tuning and evaluating"
│   │       │   ├── fine-tune.md                              (pos 1)
│   │       │   ├── peft.mdx                                  (pos 2)
│   │       │   └── extra-resources.md
│   │       └── wk3/  "Reinforcement Learning"
│   │           ├── rl-from-human-feedback.md                 (pos 1)
│   │           ├── ppo.md                                    (pos 2)
│   │           ├── llm-powered-application.md                (pos 3)
│   │           ├── reasoning.md                              (pos 4)
│   │           ├── application-architectures.md              (pos 5)
│   │           └── considerations.md                         (pos 6)
│   ├── ml/                # Supervised, unsupervised, reinforcement learning
│   ├── search-plan/       # CSP, search algorithms, planning, probabilistic reasoning
│   └── showcase/          # DL, ML, search-plan demos
├── aws/                   # Compute, database, storage, networking, security, analytics, ...
├── container-orchestration/ # Docker, Kubernetes, Terraform, serverless vs k8s
├── crypto/                # Behaviour, coin types, development, ecosystem, oracle, security
├── linux/                 # Bash, file system, process, namespace, package manager, security, ...
├── other/                 # Psychology, economics, languages, food culture, DIY, ...
└── software-development/  # SDLC, databases, devops, programming, system design, interviews, ...
```

## Working Rules

- Prefer minimal edits over broad rewrites.
- Preserve existing slugs and internal URLs unless migration is explicitly requested.
- Keep markdown structure semantic and readable.
- Do not create a heading layer that only contains one short subsection.
- Use first-person singular voice for personal narratives unless the user asks otherwise.
- Use Docusaurus admonitions when warnings, caveats, or important defaults need emphasis.
- Use Mermaid diagrams when a flow or architecture is materially easier to understand visually.

## Scoped Writing Rules

- For `blog/**/*.md`, also follow `.github/instructions/blog-content-seo.instructions.md`.
- For `docs/other/**/*.md`, also follow `.github/instructions/other-content-style.instructions.md`.
- Repo-wide instructions are in `.github/copilot-instructions.md` and should be treated as the main source of truth.

## Docusaurus Details

- Docs are served from the site root because `routeBasePath` is set to `/`.
- Blog content is mounted separately through `src/plugins/custom-blog-plugin`.
- Mermaid is enabled.
- KaTeX math support is enabled through `remark-math` and `rehype-katex`.
- Custom styles are loaded from `src/css/custom.scss`.

## Common Commands

Run from the repository root:

```bash
yarn start
yarn build
yarn typecheck
yarn format
./spell_check.sh
```

## Validation Defaults

- If markdown structure, frontmatter, links, or sidebar behavior changed, prefer running `yarn build`.
- If TypeScript or component code changed, run `yarn typecheck`.
- If wording-heavy content changed, consider `./spell_check.sh` when relevant.

## Homepage "Recent Updates" System

The homepage is not a standard Docusaurus page. It is registered through a route override inside `src/plugins/custom-blog-plugin/index.js`, which wraps the standard `@docusaurus/plugin-content-blog`. During the `contentLoaded` lifecycle phase it:

1. Calls `collectRecentUpdates(siteDir, 8)` from `src/plugins/recent-updates-plugin/index.js`.
2. Collects the 5 most recent visible blog posts.
3. Registers the route `/` pointing to `src/components/Home/index.js`, injecting both datasets as module props.

`collectRecentUpdates` works by:
- Running `git log` over the `docs/` directory with ISO dates and changed file names.
- Walking each commit, deduplicating files so each file appears only once (most-recent commit wins).
- For each `.md`/`.mdx` file: reading its frontmatter to extract `title` and `slug`, inferring a display title from the file path if frontmatter `title` is absent, computing the URL permalink from `slug` or the relative file path, and inferring a breadcrumb section label from the first two path segments.
- Returning up to `limit` (8) entries sorted by most recent commit date.

The result is that **the homepage shows the 8 most-recently git-committed docs pages and the 5 latest blog posts** — all driven by git history, not by a metadata field inside each file.

### Key files

| File | Role |
|---|---|
| `src/plugins/custom-blog-plugin/index.js` | Wraps standard blog plugin; overrides `contentLoaded` to inject homepage data |
| `src/plugins/recent-updates-plugin/index.js` | Reads `git log`, extracts file metadata, returns recent-doc list |
| `src/components/Home/index.js` | Renders the homepage using injected props |

## Editing Boundaries

- Do not edit generated files under `.docusaurus/` or built files under `build/` unless explicitly requested.
- Prefer editing source content in `docs/`, `blog/`, `src/`, `static/`, and config files in the repo root.
- Keep style consistent with the existing page or section instead of introducing a new voice or structure without reason.
- If you add or rename a docs file, the "Recent Updates" section will reflect it automatically on the next build once the change is committed to git.