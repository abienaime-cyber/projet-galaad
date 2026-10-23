<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Règles de travail

### Graphify d'abord

Avant de chercher dans le code :

1. Lis `graphify-out/GRAPH_REPORT.md` pour la vue d'ensemble.
2. Pour une question précise, lance `graphify query "<question>"`.
3. N'ouvre un fichier source que si le graphe ne suffit pas, et seulement le fichier concerné.
4. Si `graphify-out/` n'existe pas, dis-le à l'utilisateur au lieu de relire tout le code.
5. Après une modification importante du code, mets le graphe à jour avec `/graphify . --update`.

### Code-simplifier après chaque modification

1. Après chaque fonctionnalité ou modification de code, lance l'agent `code-simplifier` sur le code écrit ou modifié.
2. Le code reste clair, court et lisible. Pas d'abstraction inutile, pas de commentaire qui répète le code.
3. Le comportement reste strictement identique.
4. Après chaque simplification, relance les tests et le linter (`pnpm lint`). Si quelque chose casse, annule la simplification et dis-le à l'utilisateur.
5. En cas de doute sur le maintien du comportement, ne simplifie pas et pose la question.
6. Résume en 2 lignes ce qui a été simplifié.
