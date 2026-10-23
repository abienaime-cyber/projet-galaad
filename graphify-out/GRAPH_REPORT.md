# Graph Report - projet-galaad  (2026-10-23)

## Corpus Check
- 51 files · ~19,756 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 321 nodes · 597 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cb84d553`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TypeScript Compiler Config
- Package Manifest & Lint
- Next.js Tooling & Agent Rules
- react
- catalog-page.tsx
- 20261023120000_accounts_and_catalog.sql
- mensurations/page.tsx
- measurements-form.tsx
- Boilerplate Footer Icons
- Geist Font Loading
- Product
- Components
- Espace compte (connexion, inscription, mensurations)
- next
- Boutique (accueil, costumes, chemises, fiche produit)

## God Nodes (most connected - your core abstractions)
1. `next` - 23 edges
2. `MeasurementsForm()` - 16 edges
3. `compilerOptions` - 16 edges
4. `createClient()` - 15 edges
5. `react` - 13 edges
6. `recommendSize()` - 11 edges
7. `Product` - 11 edges
8. `Catalog()` - 10 edges
9. `Garment()` - 10 edges
10. `Components` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --references--> `Next.js Wordmark Logo`  [EXTRACTED]
  app/page.tsx → public/next.svg
- `Home()` --references--> `Vercel Triangle Logo (white)`  [EXTRACTED]
  app/page.tsx → public/vercel.svg
- `AuthForm()` --calls--> `Field()`  [EXTRACTED]
  app/(auth)/auth-form.tsx → components/field.tsx
- `AuthForm()` --calls--> `Spinner()`  [EXTRACTED]
  app/(auth)/auth-form.tsx → components/spinner.tsx
- `AuthShell()` --calls--> `SegmentedNav()`  [EXTRACTED]
  app/(auth)/auth-shell.tsx → components/segmented-nav.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Create Next App boilerplate footer icon set (unused in current page)** — public_file_fileicon, public_globe_globeicon, public_window_windowicon [INFERRED 0.75]
- **Next.js App Bootstrap Stack** — readme_create_next_app, readme_nextjs, readme_next_font, readme_geist_font, app_page [INFERRED 0.75]

## Communities (17 total, 5 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "Package Manifest & Lint"
Cohesion: 0.05
Nodes (36): eslintConfig, dependencies, next, react, react-dom, @supabase/ssr, @supabase/supabase-js, devDependencies (+28 more)

### Community 2 - "Next.js Tooling & Agent Rules"
Cohesion: 0.20
Nodes (10): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Agent Rules, pnpm allowBuilds config, sharp, unrs-resolver, create-next-app, Development Server (dev script) (+2 more)

### Community 3 - "react"
Cohesion: 0.27
Nodes (9): AuthForm(), AuthShell(), POINTS, TABS, metadata, SignInPage(), metadata, SignUpPage() (+1 more)

### Community 4 - "catalog-page.tsx"
Cohesion: 0.08
Nodes (47): Catalog(), NOUN, Props, SizePrompt(), generateMetadata(), ProductPage(), ProductView(), YourSize() (+39 more)

### Community 5 - "20261023120000_accounts_and_catalog.sql"
Cohesion: 0.15
Nodes (17): addresses_one_default_idx, addresses_user_id_idx, measurements_updated_at, on_auth_user_created, product_variants_check_size, products_updated_at, public.addresses, public.check_variant_size() (+9 more)

### Community 6 - "mensurations/page.tsx"
Cohesion: 0.14
Nodes (24): AuthState, field(), signIn(), signOut(), signUp(), GET(), Charts, fr() (+16 more)

### Community 7 - "measurements-form.tsx"
Cohesion: 0.08
Nodes (41): deleteMeasurements(), MeasurementsState, requireUser(), saveMeasurements(), cm(), DeleteZone(), MeasurementsForm(), Reading() (+33 more)

### Community 8 - "Boilerplate Footer Icons"
Cohesion: 0.67
Nodes (3): File Icon (document with lines, gray 16x16), Globe Icon (world/web, gray 16x16), Browser Window Icon (gray 16x16)

### Community 12 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 13 - "Components"
Cohesion: 0.07
Nodes (28): Boutique, Buttons, Cards / Containers, Colors, Components, Contrôle segmenté, Design System: Galaad, Do: (+20 more)

### Community 15 - "next"
Cohesion: 0.12
Nodes (13): CatalogPage(), metadata, ShirtsPage(), metadata, SuitsPage(), inter, metadata, RootLayout() (+5 more)

## Knowledge Gaps
- **14 isolated node(s):** `react-dom`, `@tailwindcss/turbopack`, `@types/node`, `@types/react`, `@types/react-dom` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 141 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Package Manifest & Lint`, `react`, `catalog-page.tsx`, `mensurations/page.tsx`, `measurements-form.tsx`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **What connects `react-dom`, `@tailwindcss/turbopack`, `@types/node` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Package Manifest & Lint`, `catalog-page.tsx`, `mensurations/page.tsx`, `measurements-form.tsx`, `next`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `Package Manifest & Lint` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Why does `Development Server (dev script)` connect `Next.js Tooling & Agent Rules` to `catalog-page.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `catalog-page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07894736842105263 - nodes in this community are weakly interconnected._