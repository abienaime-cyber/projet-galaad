# Graph Report - projet-galaad  (2026-10-25)

## Corpus Check
- 107 files · ~192,226 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 3, .woff2 2, .example 1)

## Summary
- 698 nodes · 1712 edges · 34 communities (27 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e4c5a3c9`
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
- models.ts
- app/layout.tsx
- Geist Font Loading
- commerce.ts
- Product
- Design System: Contrebande
- Espace compte (connexion, inscription, mensurations)
- [slug]/actions.ts
- Boutique (accueil, costumes, chemises, fiche produit)
- produit/[slug]/page.tsx
- rls.test.sql
- oversell.sh
- materials.ts
- Design System Master File
- render.mjs
- dependencies
- devDependencies
- scripts
- eslint.config.mjs
- boutique/page.tsx
- reco.ts
- shop.ts
- reco.test.ts
- ai.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 51 edges
2. `react` - 39 edges
3. `price()` - 28 edges
4. `requireUser()` - 24 edges
5. `createClient()` - 22 edges
6. `useScene()` - 19 edges
7. `ProductView()` - 17 edges
8. `HomePage()` - 17 edges
9. `compilerOptions` - 16 edges
10. `askAdvisor()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Do:` --references--> `pinStart()`  [INFERRED]
  DESIGN.md → components/gsap.tsx
- `Vault()` --indirect_call--> `addToCart()`  [INFERRED]
  components/home/vault.tsx → app/panier/actions.ts
- `AuthForm()` --calls--> `Field()`  [EXTRACTED]
  app/(auth)/auth-form.tsx → components/field.tsx
- `AuthForm()` --calls--> `Spinner()`  [EXTRACTED]
  app/(auth)/auth-form.tsx → components/spinner.tsx
- `Catalog()` --calls--> `SegmentedNav()`  [EXTRACTED]
  app/(boutique)/boutique/page.tsx → components/segmented-nav.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Next.js App Bootstrap Stack** — readme_create_next_app, readme_nextjs, readme_next_font, readme_geist_font, app_page [INFERRED 0.75]

## Communities (34 total, 7 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "package.json"
Cohesion: 0.13
Nodes (14): name, packageManager, private, version, gsap, @gsap/react, react-dom, tailwindcss (+6 more)

### Community 2 - "Next.js Tooling & Agent Rules"
Cohesion: 0.20
Nodes (10): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Agent Rules, pnpm allowBuilds config, sharp, unrs-resolver, create-next-app, Development Server (dev script) (+2 more)

### Community 3 - "app/page.tsx"
Cohesion: 0.09
Nodes (41): EXHIBITS, firstInStock(), HomePage(), two(), VAULT, MOTION_OK, PINNED_HEIGHT, pinStart() (+33 more)

### Community 4 - "taste-form.tsx"
Cohesion: 0.18
Nodes (20): saveTaste(), TasteState, Choices(), Question(), Readout(), TasteForm(), Drink, Experience (+12 more)

### Community 5 - "20261023140000_commerce.sql"
Cohesion: 0.10
Nodes (43): addresses_one_default_idx, addresses_user_id_idx, kit_items_check, kit_items_item_id_idx, on_auth_user_created, product_variants_product_id_idx, products_active_category_idx, products_updated_at (+35 more)

### Community 6 - "next"
Cohesion: 0.06
Nodes (51): AuthState, CONFIRMATION_SENT(), field(), signIn(), signOut(), signUp(), AuthForm(), AuthShell() (+43 more)

### Community 7 - "models.ts"
Cohesion: 0.11
Nodes (47): arrange(), BOWL, BOWL_COLORS, buildModel(), CASE, chasen(), chashaku(), chawan() (+39 more)

### Community 8 - "app/layout.tsx"
Cohesion: 0.09
Nodes (22): metadata, TermsPage(), metadata, PrivacyPage(), barlow, condensed, metadata, mono (+14 more)

### Community 11 - "commerce.ts"
Cohesion: 0.06
Nodes (55): Props, ADDRESS_FIELDS, CheckoutState, placeOrder(), Address, CheckoutForm(), Checkout(), CheckoutPage() (+47 more)

### Community 12 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 13 - "Design System: Contrebande"
Cohesion: 0.08
Nodes (25): Buttons, Cards / Containers, Chips, Colors, Components, Design System: Contrebande, Do:, Do's and Don'ts (+17 more)

### Community 15 - "[slug]/actions.ts"
Cohesion: 0.14
Nodes (23): CopyState, generateCopy(), publishCopy(), AdminPage(), CATEGORY, Dashboard(), metadata, pct (+15 more)

### Community 17 - "produit/[slug]/page.tsx"
Cohesion: 0.12
Nodes (28): addReview(), AdviceState, askAdvisor(), detailsOf(), ReviewState, Ritual, Advisor(), Details() (+20 more)

### Community 18 - "rls.test.sql"
Cohesion: 0.50
Nodes (3): t_item, t_total, t_variant

### Community 22 - "materials.ts"
Cohesion: 0.24
Nodes (18): bamboo(), blackMetal(), cache, canvasTexture(), ceramic(), foam(), FONTS, froth() (+10 more)

### Community 23 - "Design System Master File"
Cohesion: 0.12
Nodes (16): Additional Forbidden Patterns, Anti-Patterns (Do NOT Use), Buttons, Cards, Color Palette, Component Specs, Design System Master File, Global Rules (+8 more)

### Community 24 - "render.mjs"
Cohesion: 0.18
Nodes (9): vite, { chromium }, [out, ...shots], root, { chromium }, out, root, SCENES (+1 more)

### Community 25 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @anthropic-ai/sdk, gsap, @gsap/react, next, @phosphor-icons/react, react, react-dom (+5 more)

### Community 26 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+4 more)

### Community 27 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 28 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 29 - "boutique/page.tsx"
Cohesion: 0.20
Nodes (17): Catalog(), Grid(), metadata, ProfilePrompt(), Search, ShopPage(), Verdict(), RevealGroup() (+9 more)

### Community 30 - "reco.ts"
Cohesion: 0.16
Nodes (18): BestPick, Category, clamp(), Confidence, confidenceOf(), DOSE_G, DRINK_LABEL, essentials() (+10 more)

### Community 31 - "shop.ts"
Cohesion: 0.18
Nodes (14): cupsPerTin(), monthlySavingsCents(), paybackCups(), TasteProfile, weeksOfUse(), CatalogProduct, CONFIDENCE_LABEL, euros (+6 more)

### Community 32 - "reco.test.ts"
Cohesion: 0.14
Nodes (7): RecoProduct, ceremonie, latte, quotidien, form(), valid, vitest

### Community 33 - "ai.ts"
Cohesion: 0.20
Nodes (10): AdviceInput, AdviceSchema, adviseMatcha(), AiError, AiErrorKind, ask(), CopyInput, CopySchema (+2 more)

## Knowledge Gaps
- **13 isolated node(s):** `react-dom`, `@tailwindcss/turbopack`, `@types/node`, `@types/react`, `@types/react-dom` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 235 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `app/page.tsx`, `taste-form.tsx`, `app/layout.tsx`, `commerce.ts`, `[slug]/actions.ts`, `produit/[slug]/page.tsx`, `boutique/page.tsx`?**
  _High betweenness centrality (0.193) - this node is a cross-community bridge._
- **What connects `react-dom`, `@tailwindcss/turbopack`, `@types/node` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `react` connect `app/page.tsx` to `package.json`, `taste-form.tsx`, `next`, `app/layout.tsx`, `commerce.ts`, `[slug]/actions.ts`, `produit/[slug]/page.tsx`, `boutique/page.tsx`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Why does `pinStart()` connect `app/page.tsx` to `Design System: Contrebande`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08531073446327683 - nodes in this community are weakly interconnected._