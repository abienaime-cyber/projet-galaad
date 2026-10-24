# Graph Report - projet-galaad  (2026-10-24)

## Corpus Check
- 89 files · ~236,102 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .example 1, .ico 1)

## Summary
- 500 nodes · 1145 edges · 22 communities (15 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fe74cb66`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TypeScript Compiler Config
- Package Manifest & Lint
- Next.js Tooling & Agent Rules
- [slug]/actions.ts
- catalog-page.tsx
- 20261023140000_commerce.sql
- mensurations/page.tsx
- measurements-form.tsx
- app/layout.tsx
- Geist Font Loading
- commerce.ts
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
8. `Chevron()` - 14 edges
9. `Spinner()` - 13 edges
10. `primaryButton` - 12 edges

## Surprising Connections (you probably didn't know these)
- `signIn()` --calls--> `safeNextPath()`  [EXTRACTED]
  app/(auth)/actions.ts → lib/auth.ts
- `signIn()` --calls--> `createClient()`  [EXTRACTED]
  app/(auth)/actions.ts → lib/supabase/server.ts
- `signUp()` --calls--> `createClient()`  [EXTRACTED]
  app/(auth)/actions.ts → lib/supabase/server.ts
- `signOut()` --calls--> `createClient()`  [EXTRACTED]
  app/(auth)/actions.ts → lib/supabase/server.ts
- `Catalog()` --calls--> `SegmentedNav()`  [EXTRACTED]
  app/(boutique)/catalog-page.tsx → components/segmented-nav.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Next.js App Bootstrap Stack** — readme_create_next_app, readme_nextjs, readme_next_font, readme_geist_font, app_page [INFERRED 0.75]

## Communities (22 total, 7 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "Package Manifest & Lint"
Cohesion: 0.05
Nodes (39): eslintConfig, dependencies, @anthropic-ai/sdk, next, react, react-dom, @supabase/ssr, @supabase/supabase-js (+31 more)

### Community 2 - "Next.js Tooling & Agent Rules"
Cohesion: 0.20
Nodes (10): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Agent Rules, pnpm allowBuilds config, sharp, unrs-resolver, create-next-app, Development Server (dev script) (+2 more)

### Community 3 - "[slug]/actions.ts"
Cohesion: 0.15
Nodes (16): addReview(), Outfit, ReviewState, ReviewForm(), ADDRESS_FIELDS, requestReturn(), ReturnState, ReturnForm() (+8 more)

### Community 4 - "catalog-page.tsx"
Cohesion: 0.07
Nodes (48): Catalog(), CatalogPage(), NOUN, Props, SizePrompt(), metadata, ShirtsPage(), metadata (+40 more)

### Community 5 - "20261023140000_commerce.sql"
Cohesion: 0.10
Nodes (40): addresses_one_default_idx, addresses_user_id_idx, measurements_updated_at, on_auth_user_created, product_variants_check_size, products_updated_at, public.addresses, public.check_variant_size() (+32 more)

### Community 6 - "mensurations/page.tsx"
Cohesion: 0.19
Nodes (12): signOut(), Charts, fr(), MeasurementsPage(), MeasurementsSection(), metadata, toSizeRows(), isSupabaseConfigured (+4 more)

### Community 7 - "measurements-form.tsx"
Cohesion: 0.09
Nodes (39): deleteMeasurements(), MeasurementsState, requireUser(), saveMeasurements(), cm(), DeleteZone(), MeasurementsForm(), Reading() (+31 more)

### Community 8 - "app/layout.tsx"
Cohesion: 0.10
Nodes (18): metadata, TermsPage(), metadata, PrivacyPage(), bodoni, jost, metadata, RootLayout() (+10 more)

### Community 11 - "commerce.ts"
Cohesion: 0.11
Nodes (35): GET(), Checkout(), CheckoutPage(), metadata, Item, metadata, Order(), OrderPage() (+27 more)

### Community 12 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 13 - "Components"
Cohesion: 0.08
Nodes (25): Buttons, Collection Tile, Colors, Components, Design System: Carrure, Do:, Do's and Don'ts, Don't: (+17 more)

### Community 15 - "[slug]/actions.ts"
Cohesion: 0.09
Nodes (34): CopyState, generateCopy(), publishCopy(), AdminPage(), CATEGORY, Dashboard(), metadata, pct (+26 more)

### Community 17 - "next"
Cohesion: 0.07
Nodes (38): AuthState, CONFIRMATION_SENT(), field(), signIn(), signUp(), AuthForm(), AuthShell(), POINTS (+30 more)

### Community 18 - "rls.test.sql"
Cohesion: 0.50
Nodes (3): t_item, t_total, t_variant

## Knowledge Gaps
- **12 isolated node(s):** `react-dom`, `@tailwindcss/turbopack`, `@types/node`, `@types/react`, `@types/react-dom` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 176 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Package Manifest & Lint`, `[slug]/actions.ts`, `catalog-page.tsx`, `mensurations/page.tsx`, `measurements-form.tsx`, `app/layout.tsx`, `commerce.ts`, `[slug]/actions.ts`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **What connects `react-dom`, `@tailwindcss/turbopack`, `@types/node` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `react` connect `next` to `Package Manifest & Lint`, `[slug]/actions.ts`, `catalog-page.tsx`, `mensurations/page.tsx`, `measurements-form.tsx`, `app/layout.tsx`, `commerce.ts`, `[slug]/actions.ts`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Should `Package Manifest & Lint` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Why does `Development Server (dev script)` connect `Next.js Tooling & Agent Rules` to `catalog-page.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `catalog-page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07188778492109878 - nodes in this community are weakly interconnected._