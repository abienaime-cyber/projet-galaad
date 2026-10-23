---
version: 1
slug: "app-boutique"
primary_target: "app/(boutique)"
related_targets: ["app/page.tsx","components"]
---

# Boutique (accueil, costumes, chemises, fiche produit)

Mode : Persuade pour l'accueil, Operate pour les pages de catégorie et la fiche. Public : client Galaad qui vient d'enregistrer ses mensurations, ou visiteur qui découvre. Tâche : voir les costumes (et chemises) qui existent dans sa taille, sans passer par le sur-mesure. Succès : en un clic après les mensurations, le client voit les meilleurs costumes à sa taille, la taille affichée sur chaque article.

Contraintes : aucune photo produit, donc des illustrations SVG honnêtes teintes à la couleur du produit ; aucun avis, aucun chiffre de vente inventé ; taille toujours « estimée » avec son niveau de confiance ; pas de bouton panier tant que le panier (partie B) n'existe pas.

Historique : direction choisie par l'utilisateur le 23/10/2026 (« Apple Store, version boutique »), après rejet de l'atelier puis du compte trop formulaire.

## Direction contract

THESIS: La boutique comme apple.com/fr/shop : de grandes tuiles produit, chaque vêtement en grand, et votre taille écrite sur chaque tuile. Refuse la grille e-commerce dense à filtres latéraux.

OWN-WORLD: Celui de DESIGN.md : blanc, tuiles #f5f5f7 à 28 px, encre #1d1d1f, gris #6e6e73, un seul bleu d'action #0071e3, boutons pilule, contrôle segmenté iOS. Vêtements dessinés en aplat de leur couleur, ombre portée douce au sol.

STORY: Le client enregistre ses mensurations, arrive sur « Costumes. À votre taille. », voit sa taille estimée et les costumes disponibles dans cette taille, ouvre une fiche et lit le bandeau « Votre taille ».

FIRST VIEWPORT: Catégorie : titre de 56 px « Costumes. » suivi en gris de « À votre taille. », à droite le contrôle segmenté Pour moi / Tout voir ; dessous une ligne « Votre taille estimée : 50 » ; puis grille de tuiles (3 colonnes dès 1024 px) avec vêtement centré, nom, prix, pastille de taille. Accueil : grand titre centré, deux pilules d'action, puis deux grandes tuiles Costumes / Chemises.

FORM: Grille de tuiles produit de l'Apple Store, structure verrouillée par l'utilisateur sur maquette (choix 1 de 3). seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
