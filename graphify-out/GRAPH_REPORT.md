# Graph Report - projet-galaad  (2026-10-23)

## Corpus Check
- 77 files · ~164,092 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .example 1, .ico 1)

## Summary
- 466 nodes · 1036 edges · 21 communities (15 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `48bfd320`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TypeScript Compiler Config
- Package Manifest & Lint
- Next.js Tooling & Agent Rules
- produit/[slug]/page.tsx
- catalog-page.tsx
- 20261023140000_commerce.sql
- mensurations/page.tsx
- measurements-form.tsx
- Boilerplate Footer Icons
- Geist Font Loading
- validation.ts
- Product
- Components
- Espace compte (connexion, inscription, mensurations)
- [slug]/actions.ts
- Boutique (accueil, costumes, chemises, fiche produit)
- SegmentedNav
- rls.test.sql
- oversell.sh

## God Nodes (most connected - your core abstractions)
1. `next` - 39 edges
2. `react` - 27 edges
3. `price()` - 22 edges
4. `createClient()` - 22 edges
5. `requireUser()` - 21 edges
6. `MeasurementsForm()` - 16 edges
7. `compilerOptions` - 16 edges
8. `Spinner()` - 13 edges
9. `primaryButton` - 12 edges
10. `requireAdmin()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --references--> `Next.js Wordmark Logo`  [EXTRACTED]
  app/page.tsx → public/next.svg
- `Home()` --references--> `Vercel Triangle Logo (white)`  [EXTRACTED]
  app/page.tsx → public/vercel.svg
- `AuthShell()` --calls--> `SegmentedNav()`  [EXTRACTED]
  app/(auth)/auth-shell.tsx → components/segmented-nav.tsx
- `Catalog()` --calls--> `SegmentedNav()`  [EXTRACTED]
  app/(boutique)/catalog-page.tsx → components/segmented-nav.tsx
- `Catalog()` --calls--> `getShopper()`  [EXTRACTED]
  app/(boutique)/catalog-page.tsx → lib/catalog.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Create Next App boilerplate footer icon set (unused in current page)** — public_file_fileicon, public_globe_globeicon, public_window_windowicon [INFERRED 0.75]
- **Next.js App Bootstrap Stack** — readme_create_next_app, readme_nextjs, readme_next_font, readme_geist_font, app_page [INFERRED 0.75]

## Communities (21 total, 6 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "Package Manifest & Lint"
Cohesion: 0.05
Nodes (41): eslintConfig, dependencies, @anthropic-ai/sdk, next, react, react-dom, @supabase/ssr, @supabase/supabase-js (+33 more)

### Community 2 - "Next.js Tooling & Agent Rules"
Cohesion: 0.20
Nodes (10): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Agent Rules, pnpm allowBuilds config, sharp, unrs-resolver, create-next-app, Development Server (dev script) (+2 more)

### Community 3 - "produit/[slug]/page.tsx"
Cohesion: 0.09
Nodes (37): AuthState, AuthForm(), AuthShell(), POINTS, TABS, metadata, SignInPage(), metadata (+29 more)

### Community 4 - "catalog-page.tsx"
Cohesion: 0.06
Nodes (49): Catalog(), CatalogPage(), NOUN, Props, SizePrompt(), metadata, ShirtsPage(), metadata (+41 more)

### Community 5 - "20261023140000_commerce.sql"
Cohesion: 0.11
Nodes (37): addresses_one_default_idx, addresses_user_id_idx, measurements_updated_at, on_auth_user_created, product_variants_check_size, products_updated_at, public.addresses, public.check_variant_size() (+29 more)

### Community 6 - "mensurations/page.tsx"
Cohesion: 0.10
Nodes (28): field(), signIn(), signOut(), signUp(), GET(), fr(), MeasurementsPage(), MeasurementsSection() (+20 more)

### Community 7 - "measurements-form.tsx"
Cohesion: 0.11
Nodes (28): deleteMeasurements(), MeasurementsState, requireUser(), saveMeasurements(), Charts, cm(), DeleteZone(), MeasurementsForm() (+20 more)

### Community 8 - "Boilerplate Footer Icons"
Cohesion: 0.67
Nodes (3): File Icon (document with lines, gray 16x16), Globe Icon (world/web, gray 16x16), Browser Window Icon (gray 16x16)

### Community 11 - "validation.ts"
Cohesion: 0.07
Nodes (46): AdminPage(), CATEGORY, Dashboard(), metadata, pct, Table(), addReview(), ADDRESS_FIELDS (+38 more)

### Community 12 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 13 - "Components"
Cohesion: 0.07
Nodes (28): Boutique, Buttons, Cards / Containers, Colors, Components, Contrôle segmenté, Design System: Carrure, Do: (+20 more)

### Community 15 - "[slug]/actions.ts"
Cohesion: 0.13
Nodes (23): CopyState, generateCopy(), publishCopy(), AdminProductsPage(), metadata, Products(), CopyEditor(), AdminProductPage() (+15 more)

### Community 17 - "SegmentedNav"
Cohesion: 0.48
Nodes (4): AccountLayout(), AccountNav(), TABS, SegmentedNav()

### Community 18 - "rls.test.sql"
Cohesion: 0.50
Nodes (3): t_item, t_total, t_variant

## Knowledge Gaps
- **14 isolated node(s):** `react-dom`, `@tailwindcss/turbopack`, `@types/node`, `@types/react`, `@types/react-dom` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 172 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `mensurations/page.tsx` to `Package Manifest & Lint`, `produit/[slug]/page.tsx`, `catalog-page.tsx`, `measurements-form.tsx`, `validation.ts`, `[slug]/actions.ts`, `SegmentedNav`?**
  _High betweenness centrality (0.159) - this node is a cross-community bridge._
- **What connects `react-dom`, `@tailwindcss/turbopack`, `@types/node` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `react` connect `produit/[slug]/page.tsx` to `Package Manifest & Lint`, `catalog-page.tsx`, `mensurations/page.tsx`, `measurements-form.tsx`, `validation.ts`, `[slug]/actions.ts`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Should `Package Manifest & Lint` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Why does `Development Server (dev script)` connect `Next.js Tooling & Agent Rules` to `catalog-page.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `produit/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08897959183673469 - nodes in this community are weakly interconnected._