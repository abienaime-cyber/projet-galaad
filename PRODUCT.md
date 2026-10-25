# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Deux profils, à servir ensemble :

- celui qui boit son matcha latte au coffee shop, le trouve cher, et n'a jamais préparé de matcha chez lui ; il craint de mal s'équiper ou de rater sa tasse ;
- l'amateur qui en prépare déjà, connaît les grades et veut compléter son matériel sans racheter ce qu'il a.

Le site doit rendre le premier autonome sans ennuyer le second.

Second public : l'administrateur de la boutique, qui suit les ventes et rédige les fiches produit.

## Product Purpose

Contrebande vend des kits pour préparer le matcha chez soi : fouet en bambou (chasen), cuillère (chashaku), tamis, bol, bouilloire, et le matcha lui-même, en trois grades. Le client remplit un profil de goût (tasses par semaine, pur ou latte, doux ou intense, ustensiles déjà possédés, prix de son matcha habituel en coffee shop). Le site calcule le kit, le matcha et le format qui lui conviennent, la durée d'une boîte à son rythme et le prix de revient de sa tasse.

Succès : le client achète le bon kit du premier coup, ne rachète pas ce qu'il a déjà, et sait ce que lui coûte une tasse faite maison.

Contexte : projet étudiant de groupe (deux développeurs, avec Ilian), rendu le lundi 26 octobre 2026 à 23h59, évalué sur l'UI/UX, la qualité de la base, le travail d'équipe, la pertinence des fonctions IA, la complexité et la créativité.

## Positioning

La recommandation est calculée par un algorithme déterministe (`lib/reco.ts`) et affichée avec un score, ses raisons et un niveau de confiance (« choix net », « choix serré »). L'IA ne décide jamais : elle explique le calcul et propose des rituels pris dans le catalogue réel.

## Operating Context

- Parcours client : inscription, profil de goût, boutique avec filtre « Pour moi », fiche produit avec le bloc « Pour vous » (score, raisons, durée d'une boîte, prix de la tasse), panier, commande, historique, retours avec motif, avis.
- Parcours admin : tableau de bord (CA, panier moyen, top produits, taux de retour pour casse, part des clients avec un profil de goût, formats les plus vendus, nouveaux clients) et génération de fiches produit par IA, relues avant publication.
- Paiement simulé.

## Capabilities and Constraints

- Next.js 16 (App Router, Cache Components), Tailwind v4, Supabase (Postgres, Auth, RLS), déploiement Vercel.
- 3D en Three.js, animations en GSAP (ScrollTrigger, SplitText). Les objets sont modélisés en code ; les vignettes de la boutique sont des rendus de ces modèles (`scripts/renders`).
- Clé IA uniquement côté serveur. Aucune clé secrète dans le code.
- Catégories : kits, matcha (30 g, 100 g, 20 g pour la petite série), ustensiles.

## Brand Commitments

- Nom : Contrebande. Accroche : le matcha du coffee shop, sorti en douce, chez vous.
- Direction artistique imposée par l'utilisateur le 25/10/2026, d'après des références d'un site de matcha au thème « cartel » : noir, gris acier bleuté, vert matcha acide, titres condensés en capitales, petites mentions techniques, étiquettes numérotées sur les objets, sections épinglées au défilement. On reprend l'esprit, jamais le nom, le logo ni les textes de la référence.
- Voix : vouvoiement, direct et sobre, le ton d'un bon caviste. Un brin de malice dans les titres (« Pièces saisies », « Le Coffre »), jamais dans les informations.
- Interface en français.
- Aucune promesse de santé ni de bienfait. Aucun avis, client ou chiffre de vente inventé dans l'interface.

## Evidence on Hand

- 17 produits fictifs avec descriptions et prix choisis pour la démo (`supabase/seed.sql`).
- Visuels : modèles 3D faits en code, rendus en PNG. Ce sont des illustrations, pas des photos des articles.
- Faits de préparation sourcés : doses et température de la maison Ippodo (Kyoto) : 2 g de matcha, 60 ml d'eau à 80 °C, 15 secondes de fouet pour un matcha pur ; 3 g, 100 ml d'eau et 100 ml de lait pour un latte.
- Faits de fabrication sourcés (AFP, 26 juin 2025) : le matcha vient de feuilles appelées tencha, cultivées à l'ombre les dernières semaines avant la récolte ; il faut jusqu'à une heure pour produire 40 g de matcha.
- Prix d'un matcha en coffee shop : non vérifié de façon fiable. Le site demande au client le prix qu'il paie, sans en afficher un par défaut comme un fait.

## Product Principles

- Le bon kit d'abord : chaque écran produit répond à « est-ce que ça me va, et qu'est-ce que j'ai déjà ? ».
- Honnêteté du calcul : score, raisons, choix net ou serré, alternative quand deux articles se valent.
- Les chiffres affichés sont calculés (durée, prix de la tasse, économie) à partir des prix réels du catalogue et des réponses du client.
- L'IA explique et suggère, elle ne décide pas.

## Accessibility & Inclusion

Formulaires utilisables au clavier et au lecteur d'écran, unités toujours affichées (g, ml, °C, €), messages d'erreur explicites en français. Mouvement réduit respecté : les sections animées au défilement s'affichent à plat.
