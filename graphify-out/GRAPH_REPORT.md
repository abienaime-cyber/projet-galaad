# Graph Report - projet-galaad  (2026-10-25)

## Corpus Check
- 94 files · ~175,310 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .example 1, .ico 1)

## Summary
- 563 nodes · 1290 edges · 24 communities (17 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `abf88cbb`
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
1. `next` - 47 edges
2. `react` - 31 edges
3. `createClient()` - 24 edges
4. `price()` - 22 edges
5. `requireUser()` - 21 edges
6. `MeasurementsForm()` - 16 edges
7. `compilerOptions` - 16 edges
8. `Spinner()` - 15 edges
9. `primaryButton` - 13 edges
10. `Chevron()` - 12 edges

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

## Communities (24 total, 7 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "Package Manifest & Lint"
Cohesion: 0.04
Nodes (44): eslintConfig, dependencies, @anthropic-ai/sdk, @mediapipe/tasks-vision, motion, next, @phosphor-icons/react, react (+36 more)

### Community 2 - "Next.js Tooling & Agent Rules"
Cohesion: 0.20
Nodes (10): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Agent Rules, pnpm allowBuilds config, sharp, unrs-resolver, create-next-app, Development Server (dev script) (+2 more)

### Community 3 - "generate.py"
Cohesion: 0.13
Nodes (12): check(), cutout(), fit(), glen(), hexc(), lum(), noise(), render() (+4 more)

### Community 4 - "catalog-page.tsx"
Cohesion: 0.08
Nodes (48): Catalog(), CatalogPage(), NOUN, Props, SizePrompt(), metadata, ShirtsPage(), metadata (+40 more)

### Community 5 - "20261023140000_commerce.sql"
Cohesion: 0.10
Nodes (40): addresses_one_default_idx, addresses_user_id_idx, measurements_updated_at, on_auth_user_created, product_variants_check_size, products_updated_at, public.addresses, public.check_variant_size() (+32 more)

### Community 6 - "commerce.ts"
Cohesion: 0.10
Nodes (35): AuthState, CONFIRMATION_SENT(), field(), signIn(), signOut(), signUp(), GET(), Charts (+27 more)

### Community 7 - "measurements-form.tsx"
Cohesion: 0.09
Nodes (37): deleteMeasurements(), MeasurementsState, requireUser(), saveMeasurements(), cm(), DeleteZone(), MeasurementsForm(), Reading() (+29 more)

### Community 8 - "app/layout.tsx"
Cohesion: 0.08
Nodes (23): metadata, TermsPage(), metadata, PrivacyPage(), cormorant, metadata, montserrat, RootLayout() (+15 more)

### Community 11 - "commerce.ts"
Cohesion: 0.13
Nodes (24): Checkout(), CheckoutPage(), metadata, Item, metadata, Order(), OrderPage(), metadata (+16 more)

### Community 12 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 13 - "Carrure : système de design"
Cohesion: 0.22
Nodes (8): Carrure : système de design, Composants (spécifications du MASTER), Couleurs, Direction, Mouvement, Photos, Typographie, Vérifications faites (checklist pré-livraison du MASTER)

### Community 15 - "[slug]/actions.ts"
Cohesion: 0.09
Nodes (33): CopyState, generateCopy(), publishCopy(), AdminPage(), CATEGORY, Dashboard(), metadata, pct (+25 more)

### Community 17 - "produit/[slug]/page.tsx"
Cohesion: 0.08
Nodes (36): AdviceState, ReviewState, AddToCart(), Size, STATE_HINT, Advisor(), Disclosure(), generateMetadata() (+28 more)

### Community 18 - "rls.test.sql"
Cohesion: 0.50
Nodes (3): t_item, t_total, t_variant

### Community 22 - "validation.ts"
Cohesion: 0.09
Nodes (29): addReview(), Outfit, ADDRESS_FIELDS, CheckoutState, requestReturn(), ReturnState, ReturnForm(), AdviceInput (+21 more)

### Community 23 - "Design System Master File"
Cohesion: 0.12
Nodes (16): Additional Forbidden Patterns, Anti-Patterns (Do NOT Use), Buttons, Cards, Color Palette, Component Specs, Design System Master File, Global Rules (+8 more)

## Knowledge Gaps
- **12 isolated node(s):** `react-dom`, `@tailwindcss/turbopack`, `@types/node`, `@types/react`, `@types/react-dom` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 201 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `app/layout.tsx` to `Package Manifest & Lint`, `catalog-page.tsx`, `commerce.ts`, `measurements-form.tsx`, `commerce.ts`, `[slug]/actions.ts`, `produit/[slug]/page.tsx`, `validation.ts`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **What connects `react-dom`, `@tailwindcss/turbopack`, `@types/node` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `react` connect `[slug]/actions.ts` to `Package Manifest & Lint`, `catalog-page.tsx`, `commerce.ts`, `measurements-form.tsx`, `app/layout.tsx`, `commerce.ts`, `produit/[slug]/page.tsx`, `validation.ts`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `Package Manifest & Lint` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._
- **Should `generate.py` be split into smaller, more focused modules?**
  _Cohesion score 0.12561576354679804 - nodes in this community are weakly interconnected._
- **Should `catalog-page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07957393483709273 - nodes in this community are weakly interconnected._