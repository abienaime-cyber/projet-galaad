# Graph Report - projet-galaad  (2026-10-24)

## Corpus Check
- 92 files · ~125,919 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .example 1, .ico 1)

## Summary
- 532 nodes · 1218 edges · 24 communities (17 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f20e3887`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TypeScript Compiler Config
- Package Manifest & Lint
- Next.js Tooling & Agent Rules
- generate.py
- catalog-page.tsx
- 20261023140000_commerce.sql
- commerce.ts
- measurements-form.tsx
- app/layout.tsx
- Geist Font Loading
- commerce.ts
- Product
- Carrure : système de design
- Espace compte (connexion, inscription, mensurations)
- [slug]/actions.ts
- Boutique (accueil, costumes, chemises, fiche produit)
- produit/[slug]/page.tsx
- rls.test.sql
- oversell.sh
- validation.ts
- Design System Master File

## God Nodes (most connected - your core abstractions)
1. `next` - 46 edges
2. `react` - 29 edges
3. `createClient()` - 24 edges
4. `price()` - 22 edges
5. `requireUser()` - 21 edges
6. `MeasurementsForm()` - 16 edges
7. `compilerOptions` - 16 edges
8. `primaryButton` - 13 edges
9. `Spinner()` - 13 edges
10. `Chevron()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `getProduct()`  [EXTRACTED]
  app/(boutique)/produit/[slug]/page.tsx → lib/catalog.ts
- `AuthShell()` --calls--> `SegmentedNav()`  [EXTRACTED]
  app/(auth)/auth-shell.tsx → components/segmented-nav.tsx
- `Catalog()` --calls--> `SegmentedNav()`  [EXTRACTED]
  app/(boutique)/catalog-page.tsx → components/segmented-nav.tsx
- `askAdvisor()` --calls--> `price()`  [EXTRACTED]
  app/(boutique)/produit/[slug]/actions.ts → lib/shop.ts
- `askAdvisor()` --calls--> `createClient()`  [EXTRACTED]
  app/(boutique)/produit/[slug]/actions.ts → lib/supabase/server.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Next.js App Bootstrap Stack** — readme_create_next_app, readme_nextjs, readme_next_font, readme_geist_font, app_page [INFERRED 0.75]

## Communities (24 total, 7 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "Package Manifest & Lint"
Cohesion: 0.05
Nodes (41): eslintConfig, dependencies, @anthropic-ai/sdk, next, @phosphor-icons/react, react, react-dom, @supabase/ssr (+33 more)

### Community 2 - "Next.js Tooling & Agent Rules"
Cohesion: 0.20
Nodes (10): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Agent Rules, pnpm allowBuilds config, sharp, unrs-resolver, create-next-app, Development Server (dev script) (+2 more)

### Community 3 - "generate.py"
Cohesion: 0.16
Nodes (10): check(), fit(), glen(), hexc(), lum(), noise(), render(), solid() (+2 more)

### Community 4 - "catalog-page.tsx"
Cohesion: 0.07
Nodes (53): Catalog(), CatalogPage(), NOUN, Props, SizePrompt(), metadata, ShirtsPage(), metadata (+45 more)

### Community 5 - "20261023140000_commerce.sql"
Cohesion: 0.10
Nodes (40): addresses_one_default_idx, addresses_user_id_idx, measurements_updated_at, on_auth_user_created, product_variants_check_size, products_updated_at, public.addresses, public.check_variant_size() (+32 more)

### Community 6 - "commerce.ts"
Cohesion: 0.17
Nodes (19): CONFIRMATION_SENT(), field(), signIn(), signOut(), signUp(), GET(), Charts, fr() (+11 more)

### Community 7 - "measurements-form.tsx"
Cohesion: 0.09
Nodes (32): deleteMeasurements(), MeasurementsState, requireUser(), saveMeasurements(), cm(), DeleteZone(), MeasurementsForm(), Reading() (+24 more)

### Community 8 - "app/layout.tsx"
Cohesion: 0.07
Nodes (27): metadata, TermsPage(), AccountLayout(), AdminLink(), metadata, PrivacyPage(), cormorant, metadata (+19 more)

### Community 11 - "commerce.ts"
Cohesion: 0.12
Nodes (34): Checkout(), CheckoutPage(), metadata, Item, metadata, Order(), OrderPage(), ReturnForm() (+26 more)

### Community 12 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 13 - "Carrure : système de design"
Cohesion: 0.25
Nodes (7): Carrure : système de design, Composants (spécifications du MASTER), Couleurs, Direction, Photos, Typographie, Vérifications faites (checklist pré-livraison du MASTER)

### Community 15 - "[slug]/actions.ts"
Cohesion: 0.09
Nodes (32): CopyState, generateCopy(), publishCopy(), AdminPage(), CATEGORY, Dashboard(), metadata, pct (+24 more)

### Community 17 - "produit/[slug]/page.tsx"
Cohesion: 0.08
Nodes (37): AuthState, AuthForm(), AuthShell(), POINTS, TABS, metadata, SignInPage(), metadata (+29 more)

### Community 18 - "rls.test.sql"
Cohesion: 0.50
Nodes (3): t_item, t_total, t_variant

### Community 22 - "validation.ts"
Cohesion: 0.16
Nodes (13): ADDRESS_FIELDS, CheckoutState, requestReturn(), ReturnState, CATALOG_TAG, addressSchema, cartLineSchema, FieldErrors (+5 more)

### Community 23 - "Design System Master File"
Cohesion: 0.12
Nodes (16): Additional Forbidden Patterns, Anti-Patterns (Do NOT Use), Buttons, Cards, Color Palette, Component Specs, Design System Master File, Global Rules (+8 more)

## Knowledge Gaps
- **12 isolated node(s):** `react-dom`, `@tailwindcss/turbopack`, `@types/node`, `@types/react`, `@types/react-dom` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 187 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `app/layout.tsx` to `Package Manifest & Lint`, `catalog-page.tsx`, `commerce.ts`, `measurements-form.tsx`, `commerce.ts`, `[slug]/actions.ts`, `produit/[slug]/page.tsx`, `validation.ts`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **What connects `react-dom`, `@tailwindcss/turbopack`, `@types/node` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `react` connect `produit/[slug]/page.tsx` to `Package Manifest & Lint`, `catalog-page.tsx`, `commerce.ts`, `measurements-form.tsx`, `app/layout.tsx`, `commerce.ts`, `[slug]/actions.ts`, `validation.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `Package Manifest & Lint` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Why does `Development Server (dev script)` connect `Next.js Tooling & Agent Rules` to `catalog-page.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `catalog-page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07259615384615385 - nodes in this community are weakly interconnected._