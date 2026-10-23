# Graph Report - projet-galaad  (2026-10-23)

## Corpus Check
- 14 files · ~4,910 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 129 nodes · 148 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `01a3a625`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TypeScript Compiler Config
- Package Manifest & Lint
- Next.js Tooling & Agent Rules
- Root Layout & Next Config
- Dev Dependencies
- 20261023120000_accounts_and_catalog.sql
- npm Scripts
- sizing.ts
- Boilerplate Footer Icons
- Geist Font Loading

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `scripts` - 6 edges
3. `public.profiles` - 6 edges
4. `recommendSize()` - 5 edges
5. `public.addresses` - 5 edges
6. `estimateChest()` - 4 edges
7. `estimateWaist()` - 4 edges
8. `next` - 4 edges
9. `public.measurements` - 4 edges
10. `Next.js` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --references--> `Next.js Wordmark Logo`  [EXTRACTED]
  app/page.tsx → public/next.svg
- `Home()` --references--> `Vercel Triangle Logo (white)`  [EXTRACTED]
  app/page.tsx → public/vercel.svg
- `sharp` --conceptually_related_to--> `Next.js`  [INFERRED]
  pnpm-workspace.yaml → README.md
- `generate-agent-files.js (next dev)` --conceptually_related_to--> `Development Server (dev script)`  [INFERRED]
  AGENTS.md → README.md
- `Next.js Wordmark Logo` --conceptually_related_to--> `Vercel Triangle Logo (white)`  [INFERRED]
  public/next.svg → public/vercel.svg

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Create Next App boilerplate footer icon set (unused in current page)** — public_file_fileicon, public_globe_globeicon, public_window_windowicon [INFERRED 0.75]
- **Next.js App Bootstrap Stack** — readme_create_next_app, readme_nextjs, readme_next_font, readme_geist_font, app_page [INFERRED 0.75]

## Communities (12 total, 3 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "Package Manifest & Lint"
Cohesion: 0.10
Nodes (19): eslintConfig, dependencies, next, react, react-dom, name, packageManager, private (+11 more)

### Community 2 - "Next.js Tooling & Agent Rules"
Cohesion: 0.25
Nodes (8): node_modules/next/dist/docs, Next.js Agent Rules, pnpm allowBuilds config, sharp, unrs-resolver, create-next-app, Next.js, Vercel Platform

### Community 3 - "Root Layout & Next Config"
Cohesion: 0.14
Nodes (10): generate-agent-files.js (next dev), geistMono, geistSans, metadata, Home(), nextConfig, Next.js Wordmark Logo, Vercel Triangle Logo (white) (+2 more)

### Community 4 - "Dev Dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 5 - "20261023120000_accounts_and_catalog.sql"
Cohesion: 0.15
Nodes (17): addresses_one_default_idx, addresses_user_id_idx, measurements_updated_at, on_auth_user_created, product_variants_check_size, products_updated_at, public.addresses, public.check_variant_size() (+9 more)

### Community 6 - "npm Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 7 - "sizing.ts"
Cohesion: 0.15
Nodes (18): Category, Confidence, distanceToRange(), estimateChest(), estimateWaist(), Fit, Measurements, PREFERENCE_EASE (+10 more)

### Community 8 - "Boilerplate Footer Icons"
Cohesion: 0.67
Nodes (3): File Icon (document with lines, gray 16x16), Globe Icon (world/web, gray 16x16), Browser Window Icon (gray 16x16)

## Knowledge Gaps
- **15 isolated node(s):** `react`, `react-dom`, `@tailwindcss/turbopack`, `@types/node`, `@types/react` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 75 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Root Layout & Next Config` to `Package Manifest & Lint`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@tailwindcss/turbopack` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `sizing.ts` to `Package Manifest & Lint`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Should `Package Manifest & Lint` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Root Layout & Next Config` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `sizing.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14736842105263157 - nodes in this community are weakly interconnected._