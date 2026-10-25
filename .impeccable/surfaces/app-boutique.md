---
version: 1
slug: "app-boutique"
primary_target: "app/(boutique)"
related_targets: ["app/page.tsx","components"]
---

# Boutique (accueil, boutique, fiche produit)

Mode : Persuade pour l'accueil, Operate pour la boutique et la fiche. Public : buveur de matcha latte en coffee shop qui veut le faire chez lui, ou amateur qui complète son matériel. Tâche : comprendre l'offre (un kit pour faire son matcha chez soi, au prix de la poudre), voir comment on prépare, trouver le kit qui lui va, l'ajouter au panier. Succès : depuis l'accueil, un clic mène au kit et à son prix ; après le profil de goût, la boutique « Pour moi » montre le bon kit en tête, avec son score et ses raisons.

Contraintes : aucune promesse de santé, aucun prix de coffee shop affiché comme un fait (le client donne le sien), faits de préparation sourcés (Ippodo), faits de fabrication sourcés (AFP). Visuels : modèles 3D faits en code, jamais présentés comme des photos.

Historique : après Carrure (costumes), l'utilisateur change de produit le 25/10/2026 et impose une direction artistique d'après des captures d'un site de matcha au thème « cartel », avec trois vidéos de mouvements : protocole de préparation épinglé (tamiser, verser, fouetter), panneau vert qui recouvre la page en remontant, chaîne de production où la feuille devient poudre puis boîte.

## Direction contract

THESIS: Le matcha comme marchandise de contrebande : on entre dans un dossier saisi, on inspecte les pièces étiquetées, on suit le protocole. Refuse la boutique de thé zen (bambou, beige, calligraphie) et la grille de cartes blanches.

OWN-WORLD: Noir #0b0c0d, acier bleuté #d5dbe2 à #aab4be en dégradé, blanc #f4f6f8, un seul vert matcha acide #a3e048. Titres Barlow Condensed 800 en capitales serrées, texte Barlow, mentions techniques (doses, prix, numéros d'étiquette) en Fragment Mono. Étiquettes grises numérotées posées sur les objets 3D, filets 1 px, croix de repère aux angles des grilles, colonne de carrés de progression à droite. Angles droits.

STORY: Le visiteur voit la plaque d'acier gravée CONTREBANDE et le prix du kit, inspecte les pièces saisies, suit le protocole au défilement, règle le prix de son matcha habituel et lit ce qu'il économise, voit la feuille devenir poudre puis boîte, ouvre le coffre et choisit son kit.

FIRST VIEWPORT: Fond noir. Rangée d'horloges en mono (Kyoto, Paris, chez vous). Au centre, plaque d'acier brossé en 3D qui suit le pointeur, gravée CONTREBANDE et 抹茶. Dessous, titre condensé « Le matcha du coffee shop, chez vous » et la ligne de prix mono calculée (kit dès 49 €, tasse à 1,07 €). Bouton vert « Voir le Kit Essentiel » et lien « Faire mon profil de goût ». « (défiler) » en mono à gauche et à droite.

FORM: Direction épinglée par l'utilisateur (captures et vidéos fournies), sans tirage. Geste signature : le protocole de préparation 3D piloté par le défilement (GSAP ScrollTrigger), réversible image par image. seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
