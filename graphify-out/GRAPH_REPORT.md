# Graph Report - projet-galaad  (2026-10-26)

## Corpus Check
- 102 files · ~226,546 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .example 1, .ico 1)

## Summary
- 608 nodes · 1448 edges · 39 communities (30 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3f49d5bd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TypeScript Compiler Config
- package.json
- Next.js Tooling & Agent Rules
- app/page.tsx
- taste-form.tsx
- 20261023140000_commerce.sql
- next
- compte/layout.tsx
- [slug]/actions.ts
- Geist Font Loading
- field.tsx
- Product
- Design System: Contrebande
- Espace compte (connexion, inscription, mensurations)
- admin/page.tsx
- Boutique (accueil, costumes, chemises, fiche produit)
- produit/[slug]/page.tsx
- rls.test.sql
- oversell.sh
- CREDITS.md
- Design System Master File
- boutique/page.tsx
- validation.ts
- reco.ts
- shop.ts
- admin/actions.ts
- [id]/page.tsx
- reco.test.ts
- dependencies
- catalog.ts
- devDependencies
- return-form.tsx
- scripts
- shop.test.ts
- eslint.config.mjs

## God Nodes (most connected - your core abstractions)
1. `next` - 53 edges
2. `react` - 40 edges
3. `price()` - 28 edges
4. `requireUser()` - 24 edges
5. `createClient()` - 22 edges
6. `ProductView()` - 17 edges
7. `compilerOptions` - 16 edges
8. `askAdvisor()` - 15 edges
9. `HomePage()` - 15 edges
10. `getProducts()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Do:` --references--> `pinStart()`  [INFERRED]
  DESIGN.md → components/gsap.tsx
- `Named Rules` --references--> `matcha()`  [INFERRED]
  DESIGN.md → lib/reco.test.ts
- `sitemap()` --calls--> `getProducts()`  [EXTRACTED]
  app/sitemap.ts → lib/catalog.ts
- `AuthForm()` --calls--> `Field()`  [EXTRACTED]
  app/(auth)/auth-form.tsx → components/field.tsx
- `AuthForm()` --calls--> `Spinner()`  [EXTRACTED]
  app/(auth)/auth-form.tsx → components/spinner.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Next.js App Bootstrap Stack** — readme_create_next_app, readme_nextjs, readme_next_font, readme_geist_font, app_page [INFERRED 0.75]

## Communities (39 total, 9 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (16): name, packageManager, private, version, @anthropic-ai/sdk, gsap, @gsap/react, react-dom (+8 more)

### Community 2 - "Next.js Tooling & Agent Rules"
Cohesion: 0.20
Nodes (10): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Agent Rules, pnpm allowBuilds config, sharp, unrs-resolver, create-next-app, Development Server (dev script) (+2 more)

### Community 3 - "app/page.tsx"
Cohesion: 0.09
Nodes (38): NotFound(), HomePage(), PIECES, ghostButton, MOTION_OK, PINNED_HEIGHT, pinStart(), RevealGroup() (+30 more)

### Community 4 - "taste-form.tsx"
Cohesion: 0.18
Nodes (20): saveTaste(), TasteState, Choices(), Question(), Readout(), TasteForm(), Drink, Experience (+12 more)

### Community 5 - "20261023140000_commerce.sql"
Cohesion: 0.10
Nodes (43): addresses_one_default_idx, addresses_user_id_idx, kit_items_check, kit_items_item_id_idx, on_auth_user_created, product_variants_product_id_idx, products_active_category_idx, products_updated_at (+35 more)

### Community 6 - "next"
Cohesion: 0.05
Nodes (50): CONFIRMATION_SENT(), field(), signIn(), signOut(), signUp(), GET(), metadata, TermsPage() (+42 more)

### Community 7 - "compte/layout.tsx"
Cohesion: 0.17
Nodes (14): AuthState, AuthForm(), AuthShell(), POINTS, TABS, metadata, SignInPage(), metadata (+6 more)

### Community 8 - "[slug]/actions.ts"
Cohesion: 0.14
Nodes (18): addReview(), detailsOf(), ReviewState, Ritual, ReviewForm(), secondaryButton, AdviceInput, AdviceSchema (+10 more)

### Community 11 - "field.tsx"
Cohesion: 0.15
Nodes (21): placeOrder(), Address, CheckoutForm(), Checkout(), CheckoutPage(), metadata, addToCart(), removeLine() (+13 more)

### Community 12 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 13 - "Design System: Contrebande"
Cohesion: 0.07
Nodes (26): Buttons, Cards / Containers, Chips, Colors, Components, Design System: USUCHA, Do:, Do's and Don'ts (+18 more)

### Community 15 - "admin/page.tsx"
Cohesion: 0.23
Nodes (11): AdminPage(), CATEGORY, Dashboard(), metadata, pct, Table(), AdminProductsPage(), metadata (+3 more)

### Community 17 - "produit/[slug]/page.tsx"
Cohesion: 0.13
Nodes (28): AdviceState, askAdvisor(), Advisor(), Details(), generateMetadata(), InKits(), kickerOf(), KitContents() (+20 more)

### Community 18 - "rls.test.sql"
Cohesion: 0.50
Nodes (3): t_item, t_total, t_variant

### Community 23 - "Design System Master File"
Cohesion: 0.12
Nodes (16): Additional Forbidden Patterns, Anti-Patterns (Do NOT Use), Buttons, Cards, Color Palette, Component Specs, Design System Master File, Global Rules (+8 more)

### Community 25 - "boutique/page.tsx"
Cohesion: 0.20
Nodes (16): Catalog(), Grid(), metadata, ProfilePrompt(), Search, ShopPage(), Verdict(), ProductTile() (+8 more)

### Community 26 - "validation.ts"
Cohesion: 0.17
Nodes (10): ADDRESS_FIELDS, CheckoutState, CATALOG_TAG, addressSchema, cartLineSchema, FieldErrors, productCopySchema, quantity (+2 more)

### Community 27 - "reco.ts"
Cohesion: 0.19
Nodes (14): BestPick, clamp(), confidenceOf(), DRINK_LABEL, essentials(), GRADE_FIT, matchKit(), matchMatcha() (+6 more)

### Community 28 - "shop.ts"
Cohesion: 0.20
Nodes (13): Confidence, cupsPerTin(), monthlySavingsCents(), paybackCups(), weeksOfUse(), CATEGORIES, CONFIDENCE_LABEL, euros (+5 more)

### Community 29 - "admin/actions.ts"
Cohesion: 0.33
Nodes (10): CopyState, generateCopy(), publishCopy(), CopyEditor(), AdminProductPage(), Editor(), metadata, requireAdmin() (+2 more)

### Community 30 - "[id]/page.tsx"
Cohesion: 0.21
Nodes (11): Item, metadata, Order(), OrderPage(), metadata, Orders(), OrdersPage(), ORDER_STATUS (+3 more)

### Community 31 - "reco.test.ts"
Cohesion: 0.15
Nodes (7): RecoProduct, ceremonie, latte, quotidien, form(), valid, vitest

### Community 32 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, @anthropic-ai/sdk, gsap, @gsap/react, next, @phosphor-icons/react, react, react-dom (+4 more)

### Community 33 - "catalog.ts"
Cohesion: 0.20
Nodes (10): bySortOrder(), CATEGORY_ORDER, ItemVariant, ProductRow, ProfileRow, Shopper, toProduct(), VariantRow (+2 more)

### Community 34 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+3 more)

### Community 35 - "return-form.tsx"
Cohesion: 0.43
Nodes (5): requestReturn(), ReturnState, ReturnForm(), inputClass, returnSchema

### Community 36 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 37 - "shop.test.ts"
Cohesion: 0.40
Nodes (3): TasteProfile, CatalogProduct, profile

### Community 38 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

## Knowledge Gaps
- **13 isolated node(s):** `react-dom`, `@tailwindcss/turbopack`, `@types/node`, `@types/react`, `@types/react-dom` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 209 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `catalog.ts`, `package.json`, `return-form.tsx`, `taste-form.tsx`, `app/page.tsx`, `compte/layout.tsx`, `[slug]/actions.ts`, `field.tsx`, `admin/page.tsx`, `produit/[slug]/page.tsx`, `boutique/page.tsx`, `validation.ts`, `admin/actions.ts`, `[id]/page.tsx`?**
  _High betweenness centrality (0.204) - this node is a cross-community bridge._
- **What connects `react-dom`, `@tailwindcss/turbopack`, `@types/node` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `react` connect `app/page.tsx` to `package.json`, `return-form.tsx`, `taste-form.tsx`, `next`, `compte/layout.tsx`, `[slug]/actions.ts`, `field.tsx`, `admin/page.tsx`, `produit/[slug]/page.tsx`, `boutique/page.tsx`, `admin/actions.ts`, `[id]/page.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08888888888888889 - nodes in this community are weakly interconnected._
- **Should `20261023140000_commerce.sql` be split into smaller, more focused modules?**
  _Cohesion score 0.09608843537414966 - nodes in this community are weakly interconnected._