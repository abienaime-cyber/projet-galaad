# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Deux profils d'hommes, à servir ensemble :

- celui qui achète un costume ou des chemises pour une occasion (entretien, mariage, bureau), ne connaît pas sa taille exacte et craint de se tromper ;
- l'amateur de mode qui connaît coupes et tissus et veut une taille précise et du choix.

Le site doit rassurer le premier sans ennuyer le second.

Second public : l'administrateur de la boutique, qui suit les ventes et rédige les fiches produit.

## Product Purpose

Carrure est une boutique en ligne de chemises et de costumes. Le client saisit sa taille, son poids et son âge (et, s'il les connaît, son tour de poitrine, son tour de taille et sa coupe préférée). Le site calcule sa taille pour chaque produit et peut n'afficher que les articles disponibles dans cette taille.

Succès : le client commande la bonne taille du premier coup, et le taux de retour pour mauvaise taille baisse.

Contexte : projet étudiant de groupe (deux développeurs), rendu le lundi 26 octobre 2026 à 23h59, évalué sur l'UI/UX, la qualité de la base, le travail d'équipe, la pertinence des fonctions IA, la complexité et la créativité.

## Positioning

La taille est calculée par un algorithme déterministe et affichée comme une estimation avec un niveau de confiance. L'IA ne décide jamais de la taille : elle explique le calcul et propose des tenues prises dans le catalogue réel.

## Operating Context

- Parcours client : inscription, profil de mensurations, catalogue avec filtre « Pour moi », fiche produit avec bandeau « Votre taille », panier, commande, historique, retours avec motif, avis.
- Parcours admin : tableau de bord (CA, panier moyen, top produits, taux de retour pour mauvaise taille, tailles les plus vendues, nouveaux clients) et génération de fiches produit par IA, relues avant publication.
- Paiement simulé.

## Capabilities and Constraints

- Next.js 16 (App Router, Cache Components), Tailwind v4, Supabase (Postgres, Auth, RLS), déploiement Vercel.
- Clé IA uniquement côté serveur. Aucune clé secrète dans le code.
- Catégories : chemises (S à 3XL) et costumes (tailles françaises 44 à 58).
- Les formules d'estimation des mensurations sont une heuristique maison, non validée scientifiquement : l'interface dit toujours « taille estimée ».

## Brand Commitments

- Nom : Carrure.
- Voix : vouvoiement, sobre, le ton d'un tailleur. Poli, précis, sans familiarité ni superlatifs.
- Interface en français.
- Look : maison de costumes italienne, version sombre, choisie par l'utilisateur le 24/10/2026 après rejet du look Apple Store (« ça fait cheap »). Fond noir chaud, texte ivoire, un seul accent laiton, titres en Bodoni, petites capitales espacées, boutons rectangulaires. Photos portées, cadrées sous le menton, sur fond sombre.
- Discours : « taille calculée », jamais « sur mesure » ni « demi-mesure » : le site vend des tailles standard.

## Evidence on Hand

- 30 produits fictifs avec descriptions (`supabase/seed.sql`).
- Photos produit : photos Pexels (licence Pexels, attribution non requise) choisies pour la démo, sans lien avec la marque. Aucun avis réel, aucun client réel, aucun chiffre de vente réel. Ne rien inventer de tel dans l'interface.

## Product Principles

- La taille d'abord : chaque écran produit répond à « est-ce que ça m'ira ? ».
- Honnêteté sur l'incertitude : estimation, niveau de confiance, taille voisine quand le client est à la limite.
- Les mensurations sont des données personnelles : on n'en demande que le nécessaire, et on explique à quoi elles servent.
- L'IA explique et suggère, elle ne décide pas.

## Accessibility & Inclusion

Formulaires utilisables au clavier et au lecteur d'écran, unités toujours affichées (cm, kg), messages d'erreur explicites en français.
