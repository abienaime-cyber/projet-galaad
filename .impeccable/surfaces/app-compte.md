---
version: 1
slug: "app-compte"
primary_target: "app/compte"
related_targets: ["app/(auth)","components"]
---

# Espace compte (connexion, inscription, mensurations)

Mode : Operate. Public : client Galaad, sur téléphone ou ordinateur, souvent mètre ruban en main. Tâche : créer un compte, puis saisir taille, poids, âge et, s'il les connaît, tour de poitrine, tour de taille et coupe préférée. Succès : profil enregistré en moins d'une minute, et le client comprend ce que ses chiffres donnent comme taille.

Contraintes : vouvoiement sobre, unités toujours affichées, valeurs estimées toujours signalées comme telles, rien d'inventé.

Historique : le monde « atelier de coupe » (marine, mètre jaune, angles carrés) a été rejeté par l'utilisateur le 23/10/2026 ; il réclame le look Apple Store. Direction épinglée par l'utilisateur, sans tirage.

## Direction contract

THESIS: Le compte comme une page de l'Apple Store : blanc, calme, une seule couleur d'action, et la taille lue sur un curseur iOS. Refuse le formulaire d'administration gris et toute matière « atelier ».

OWN-WORLD: Fond blanc, tuiles #f5f5f7 très arrondies (28 px), texte #1d1d1f et #6e6e73, filets #d2d2d7, un seul bleu d'action #0071e3 (liens #0066cc), rouge #e30000 pour les erreurs. SF Pro sur les appareils Apple, Inter ailleurs. Boutons pilule, champs à libellé flottant arrondis à 12 px, choix en tuiles à bordure bleue comme le choix de capacité d'un iPhone, onglets en contrôle segmenté iOS.

STORY: Le client saisit ses chiffres, voit le curseur glisser vers sa taille et la pastille de taille s'allumer, enregistre, et lit si la valeur est mesurée ou estimée.

FIRST VIEWPORT: Barre de navigation claire translucide de 48 px, mot Galaad à gauche. Mensurations : grand titre de 48 px, intro grise de 21 px ; formulaire à gauche ; à droite une tuile #f5f5f7 collante avec la jauge (piste iOS, partie remplie bleue, pouce blanc ombré, pastilles de tailles chemise au-dessus et costume au-dessous) et les lectures en grands chiffres. Connexion : colonne centrée de 460 px, contrôle segmenté, titre centré, champs flottants, bouton pilule bleu ; tuile grise « Votre taille, article par article » en dessous.

FORM: Canon de la catégorie, Apple Store (apple.com/fr/shop), choisi explicitement par l'utilisateur. Geste signature : le curseur iOS dont le pouce suit un ressort critique. seed: none (direction épinglée par l'utilisateur)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
