# Graph Report - projet-galaad  (2026-10-23)

## Corpus Check
- 37 files · ~10,639 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 229 nodes · 382 edges · 15 communities (11 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `06e50a91`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TypeScript Compiler Config
- Package Manifest & Lint
- Next.js Tooling & Agent Rules
- next
- Dev Dependencies
- 20261023120000_accounts_and_catalog.sql
- mensurations/page.tsx
- measurements-form.tsx
- Boilerplate Footer Icons
- Geist Font Loading
- Product
- Espace compte (connexion, inscription, mensurations)
- layout.tsx

## God Nodes (most connected - your core abstractions)
1. `MeasurementsForm()` - 16 edges
2. `next` - 16 edges
3. `compilerOptions` - 16 edges
4. `createClient()` - 13 edges
5. `Product` - 11 edges
6. `react` - 10 edges
7. `AuthForm()` - 7 edges
8. `parseMeasurements()` - 7 edges
9. `recommendSize()` - 7 edges
10. `MeasurementsSection()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --references--> `Next.js Wordmark Logo`  [EXTRACTED]
  app/page.tsx → public/next.svg
- `Home()` --references--> `Vercel Triangle Logo (white)`  [EXTRACTED]
  app/page.tsx → public/vercel.svg
- `requireUser()` --calls--> `createClient()`  [EXTRACTED]
  app/compte/mensurations/actions.ts → lib/supabase/server.ts
- `MeasurementsForm()` --calls--> `Field()`  [EXTRACTED]
  app/compte/mensurations/measurements-form.tsx → components/field.tsx
- `MeasurementsForm()` --calls--> `Spinner()`  [EXTRACTED]
  app/compte/mensurations/measurements-form.tsx → components/spinner.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Create Next App boilerplate footer icon set (unused in current page)** — public_file_fileicon, public_globe_globeicon, public_window_windowicon [INFERRED 0.75]
- **Next.js App Bootstrap Stack** — readme_create_next_app, readme_nextjs, readme_next_font, readme_geist_font, app_page [INFERRED 0.75]

## Communities (15 total, 4 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "Package Manifest & Lint"
Cohesion: 0.07
Nodes (26): eslintConfig, dependencies, next, react, react-dom, @supabase/ssr, @supabase/supabase-js, name (+18 more)

### Community 2 - "Next.js Tooling & Agent Rules"
Cohesion: 0.15
Nodes (13): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Agent Rules, Home(), pnpm allowBuilds config, sharp, unrs-resolver, Next.js Wordmark Logo (+5 more)

### Community 3 - "next"
Cohesion: 0.16
Nodes (15): AuthForm(), AuthShell(), POINTS, TABS, metadata, SignInPage(), metadata, SignUpPage() (+7 more)

### Community 4 - "Dev Dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 5 - "20261023120000_accounts_and_catalog.sql"
Cohesion: 0.15
Nodes (17): addresses_one_default_idx, addresses_user_id_idx, measurements_updated_at, on_auth_user_created, product_variants_check_size, products_updated_at, public.addresses, public.check_variant_size() (+9 more)

### Community 6 - "mensurations/page.tsx"
Cohesion: 0.15
Nodes (21): AuthState, field(), signIn(), signOut(), signUp(), GET(), Charts, ChartRow (+13 more)

### Community 7 - "measurements-form.tsx"
Cohesion: 0.08
Nodes (42): deleteMeasurements(), MeasurementsState, requireUser(), saveMeasurements(), cm(), CONFIDENCE, DeleteZone(), MeasurementsForm() (+34 more)

### Community 8 - "Boilerplate Footer Icons"
Cohesion: 0.67
Nodes (3): File Icon (document with lines, gray 16x16), Globe Icon (world/web, gray 16x16), Browser Window Icon (gray 16x16)

### Community 12 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 15 - "layout.tsx"
Cohesion: 0.33
Nodes (6): inter, metadata, RootLayout(), AccountLinks(), SiteHeader(), getCurrentUser()

## Knowledge Gaps
- **14 isolated node(s):** `react-dom`, `@tailwindcss/turbopack`, `@types/node`, `@types/react`, `@types/react-dom` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 99 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Package Manifest & Lint`, `Next.js Tooling & Agent Rules`, `mensurations/page.tsx`, `measurements-form.tsx`, `layout.tsx`?**
  _High betweenness centrality (0.208) - this node is a cross-community bridge._
- **What connects `react-dom`, `@tailwindcss/turbopack`, `@types/node` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `react` connect `next` to `Package Manifest & Lint`, `layout.tsx`, `mensurations/page.tsx`, `measurements-form.tsx`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Should `Package Manifest & Lint` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `mensurations/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14532019704433496 - nodes in this community are weakly interconnected._
- **Should `measurements-form.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08078431372549019 - nodes in this community are weakly interconnected._