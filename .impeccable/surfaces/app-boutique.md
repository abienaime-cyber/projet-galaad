---
version: 1
slug: "app-boutique"
primary_target: "app/(boutique)"
related_targets: ["app/page.tsx","components"]
---

# Boutique (accueil, costumes, chemises, fiche produit)

Mode : Persuade pour l'accueil, Operate pour les pages de catégorie et la fiche. Public : client Carrure qui vient d'enregistrer ses mensurations, ou visiteur qui découvre. Tâche : voir les costumes (et chemises) qui existent dans sa taille. Succès : en un clic après les mensurations, le client voit les costumes à sa taille, la taille affichée sur chaque photo.

Contraintes : photos Pexels portées, détourées et posées sur un même gris de studio (#f1f0ed) ; aucun avis, aucun chiffre de vente inventé ; taille toujours « estimée » avec son niveau de confiance ; jamais « sur mesure » : on parle de « taille calculée ».

Historique : Apple Store (23/10/2026), rejeté (« ça fait cheap ») ; maison italienne sombre (24/10/2026), rejetée (« j'aime pas le design ») ; l'utilisateur demande de reprendre un site très connu et choisit Mr Porter (24/10/2026). Le site Mr Porter a refusé l'accès (403) : la mise en page suit la connaissance générale du site, sans copie de son nom, logo, textes ni photos.

## Direction contract

THESIS: Le grand magasin de luxe en ligne, façon Mr Porter : page blanche, la marchandise sur gris de studio, la taille du client posée sur chaque photo. Refuse la vitrine sombre et la grille de tuiles Apple.
OWN-WORLD: Fond blanc, texte noir #121212, gris de studio #f1f0ed sous chaque photo, un seul accent laiton foncé #85642c pour la taille. Marque CARRURE en Bodoni espacé, titres Bodoni à graisse de texte, tout le reste en Jost : noms d'articles et navigation en capitales espacées 12 px. Bandeau noir en tête, pied de page noir, bouton noir plein, angles droits, filets 1 px.
STORY: Le visiteur voit trois tenues côte à côte sur le même gris et « Le costume à votre taille », donne ses mesures, retrouve sur l'accueil puis dans la catégorie les costumes en stock dans sa taille, sa taille en laiton sur chaque photo, ouvre une fiche et lit « Votre taille ».
FIRST VIEWPORT: Accueil : bandeau noir, en-tête centré (marque puis rubriques), trois photos détourées sur gris (une sur mobile), titre Bodoni centré dessous. Catégorie : fil d'Ariane, titre centré, ligne de taille et onglets entre deux filets, grille 2 / 3 / 4 colonnes.
FORM: Reprise d'un site connu demandée par l'utilisateur (sortie « canon ») : Mr Porter. seed: none (unavailable)
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
