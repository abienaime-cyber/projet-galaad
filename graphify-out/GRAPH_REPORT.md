# Graph Report - projet-galaad  (2026-10-23)

## Corpus Check
- Corpus is ~1,170 words - fits in a single context window. You may not need a graph.

## Summary
- 83 nodes · 82 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 81,342 input · 0 output

## Community Hubs (Navigation)
- TypeScript Compiler Config
- Package Manifest & Lint
- Next.js Tooling & Agent Rules
- Root Layout & Next Config
- Dev Dependencies
- Home Page & Logos
- npm Scripts
- Runtime Dependencies
- Boilerplate Footer Icons
- Geist Font Loading

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `scripts` - 5 edges
3. `next` - 4 edges
4. `Next.js` - 4 edges
5. `Home()` - 3 edges
6. `Next.js Agent Rules` - 3 edges
7. `Next.js Breaking Changes Warning` - 3 edges
8. `eslint` - 2 edges
9. `eslint-config-next` - 2 edges
10. `node_modules/next/dist/docs` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --references--> `Next.js Wordmark Logo`  [EXTRACTED]
  app/page.tsx → public/next.svg
- `Home()` --references--> `Vercel Triangle Logo (white)`  [EXTRACTED]
  app/page.tsx → public/vercel.svg
- `generate-agent-files.js (next dev)` --conceptually_related_to--> `Development Server (dev script)`  [INFERRED]
  AGENTS.md → README.md
- `sharp` --conceptually_related_to--> `Next.js`  [INFERRED]
  pnpm-workspace.yaml → README.md
- `File Icon (document with lines, gray 16x16)` --conceptually_related_to--> `Globe Icon (world/web, gray 16x16)`  [INFERRED]
  public/file.svg → public/globe.svg

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Next.js App Bootstrap Stack** — readme_create_next_app, readme_nextjs, readme_next_font, readme_geist_font, app_page [INFERRED 0.75]
- **Create Next App boilerplate footer icon set (unused in current page)** — public_file_fileicon, public_globe_globeicon, public_window_windowicon [INFERRED 0.75]

## Communities (10 total, 1 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "Package Manifest & Lint"
Cohesion: 0.12
Nodes (15): eslintConfig, name, packageManager, private, version, eslint, eslint-config-next, react (+7 more)

### Community 2 - "Next.js Tooling & Agent Rules"
Cohesion: 0.25
Nodes (8): node_modules/next/dist/docs, Next.js Agent Rules, pnpm allowBuilds config, sharp, unrs-resolver, create-next-app, Next.js, Vercel Platform

### Community 3 - "Root Layout & Next Config"
Cohesion: 0.22
Nodes (5): geistMono, geistSans, metadata, nextConfig, next

### Community 4 - "Dev Dependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+1 more)

### Community 5 - "Home Page & Logos"
Cohesion: 0.40
Nodes (5): generate-agent-files.js (next dev), Home(), Next.js Wordmark Logo, Vercel Triangle Logo (white), Development Server (dev script)

### Community 6 - "npm Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 7 - "Runtime Dependencies"
Cohesion: 0.50
Nodes (4): dependencies, next, react, react-dom

### Community 8 - "Boilerplate Footer Icons"
Cohesion: 0.67
Nodes (3): File Icon (document with lines, gray 16x16), Globe Icon (world/web, gray 16x16), Browser Window Icon (gray 16x16)

## Knowledge Gaps
- **15 isolated node(s):** `react`, `react-dom`, `@tailwindcss/turbopack`, `@types/node`, `@types/react` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 58 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Root Layout & Next Config` to `Package Manifest & Lint`, `Home Page & Logos`?**
  _High betweenness centrality (0.282) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@tailwindcss/turbopack` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `generate-agent-files.js (next dev)` connect `Home Page & Logos` to `Next.js Tooling & Agent Rules`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Should `Package Manifest & Lint` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._