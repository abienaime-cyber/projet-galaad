# Graph Report - projet-galaad  (2026-10-24)

## Corpus Check
- 89 files · ~184,318 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .example 1, .ico 1)

## Summary
- 507 nodes · 1164 edges · 21 communities (14 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4e39478f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TypeScript Compiler Config
- Package Manifest & Lint
- Next.js Tooling & Agent Rules
- catalog-page.tsx
- 20261023140000_commerce.sql
- commerce.ts
- measurements-form.tsx
- app/layout.tsx
- Geist Font Loading
- validation.ts
- Product
- Components
- Espace compte (connexion, inscription, mensurations)
- [slug]/actions.ts
- Boutique (accueil, costumes, chemises, fiche produit)
- next
- rls.test.sql
- oversell.sh

## God Nodes (most connected - your core abstractions)
1. `next` - 46 edges
2. `react` - 29 edges
3. `createClient()` - 24 edges
4. `price()` - 22 edges
5. `requireUser()` - 21 edges
6. `MeasurementsForm()` - 16 edges
7. `compilerOptions` - 16 edges
8. `Spinner()` - 13 edges
9. `Chevron()` - 12 edges
10. `primaryButton` - 12 edges

## Surprising Connections (you probably didn't know these)
- `sitemap()` --calls--> `getProducts()`  [EXTRACTED]
  app/sitemap.ts → lib/catalog.ts
- `AuthForm()` --calls--> `Field()`  [EXTRACTED]
  app/(auth)/auth-form.tsx → components/field.tsx
- `AuthForm()` --calls--> `Spinner()`  [EXTRACTED]
  app/(auth)/auth-form.tsx → components/spinner.tsx
- `Catalog()` --calls--> `SegmentedNav()`  [EXTRACTED]
  app/(boutique)/catalog-page.tsx → components/segmented-nav.tsx
- `Catalog()` --calls--> `recommendSize()`  [EXTRACTED]
  app/(boutique)/catalog-page.tsx → lib/sizing.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Next.js App Bootstrap Stack** — readme_create_next_app, readme_nextjs, readme_next_font, readme_geist_font, app_page [INFERRED 0.75]

## Communities (21 total, 7 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "Package Manifest & Lint"
Cohesion: 0.05
Nodes (39): eslintConfig, dependencies, @anthropic-ai/sdk, next, react, react-dom, @supabase/ssr, @supabase/supabase-js (+31 more)

### Community 2 - "Next.js Tooling & Agent Rules"
Cohesion: 0.20
Nodes (10): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Agent Rules, pnpm allowBuilds config, sharp, unrs-resolver, create-next-app, Development Server (dev script) (+2 more)

### Community 4 - "catalog-page.tsx"
Cohesion: 0.07
Nodes (62): Catalog(), NOUN, Props, SizePrompt(), addReview(), AdviceState, askAdvisor(), Outfit (+54 more)

### Community 5 - "20261023140000_commerce.sql"
Cohesion: 0.10
Nodes (40): addresses_one_default_idx, addresses_user_id_idx, measurements_updated_at, on_auth_user_created, product_variants_check_size, products_updated_at, public.addresses, public.check_variant_size() (+32 more)

### Community 6 - "commerce.ts"
Cohesion: 0.12
Nodes (28): AuthState, CONFIRMATION_SENT(), field(), signIn(), signOut(), signUp(), GET(), Charts (+20 more)

### Community 7 - "measurements-form.tsx"
Cohesion: 0.09
Nodes (35): deleteMeasurements(), MeasurementsState, requireUser(), saveMeasurements(), cm(), DeleteZone(), MeasurementsForm(), Reading() (+27 more)

### Community 8 - "app/layout.tsx"
Cohesion: 0.10
Nodes (19): metadata, TermsPage(), metadata, PrivacyPage(), bodoni, jost, metadata, RootLayout() (+11 more)

### Community 11 - "validation.ts"
Cohesion: 0.06
Nodes (48): Size, STATE_HINT, ADDRESS_FIELDS, CheckoutState, placeOrder(), Address, CheckoutForm(), Checkout() (+40 more)

### Community 12 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 13 - "Components"
Cohesion: 0.07
Nodes (27): Buttons, Colors, Components, Design System: Carrure, Disclosure, Do:, Do's and Don'ts, Don't: (+19 more)

### Community 15 - "[slug]/actions.ts"
Cohesion: 0.10
Nodes (31): CopyState, generateCopy(), publishCopy(), AdminPage(), CATEGORY, Dashboard(), metadata, pct (+23 more)

### Community 17 - "next"
Cohesion: 0.11
Nodes (22): AuthForm(), AuthShell(), POINTS, TABS, metadata, SignInPage(), metadata, SignUpPage() (+14 more)

### Community 18 - "rls.test.sql"
Cohesion: 0.50
Nodes (3): t_item, t_total, t_variant

## Knowledge Gaps
- **12 isolated node(s):** `react-dom`, `@tailwindcss/turbopack`, `@types/node`, `@types/react`, `@types/react-dom` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 178 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Package Manifest & Lint`, `catalog-page.tsx`, `commerce.ts`, `measurements-form.tsx`, `app/layout.tsx`, `validation.ts`, `[slug]/actions.ts`?**
  _High betweenness centrality (0.194) - this node is a cross-community bridge._
- **What connects `react-dom`, `@tailwindcss/turbopack`, `@types/node` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `react` connect `next` to `Package Manifest & Lint`, `catalog-page.tsx`, `commerce.ts`, `measurements-form.tsx`, `app/layout.tsx`, `validation.ts`, `[slug]/actions.ts`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Should `Package Manifest & Lint` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Why does `Development Server (dev script)` connect `Next.js Tooling & Agent Rules` to `catalog-page.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `catalog-page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06954954954954955 - nodes in this community are weakly interconnected._