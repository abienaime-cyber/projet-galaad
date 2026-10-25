---
version: 1
slug: "app-compte"
primary_target: "app/compte"
related_targets: ["app/(auth)","components"]
---

# Espace compte (connexion, inscription, profil de goût, commandes)

Mode : Operate. Public : client Contrebande, souvent sur téléphone. Tâche : créer un compte, puis remplir le profil de goût (tasses par semaine, pur ou latte, doux ou intense, ustensiles déjà possédés, prix de son matcha en coffee shop). Succès : profil rempli en moins d'une minute, et le client lit aussitôt ce que le calcul en tire : prix de sa tasse, durée d'une boîte, économie.

Contraintes : vouvoiement, unités toujours affichées, aucun chiffre inventé, les données de goût expliquées et effaçables.

## Direction contract

THESIS: Le profil de goût comme une fiche de déclaration en douane : des cases nettes, des réponses courtes, et le verdict calculé imprimé à côté. Refuse le formulaire d'administration gris.

OWN-WORLD: Même monde que la boutique : acier bleuté #d5dbe2, noir #0b0c0d, vert #a3e048 pour l'action et l'état choisi. Cases à cocher et choix en tuiles carrées à filet 1 px, la tuile choisie passe au noir. Libellés en Barlow, valeurs en Fragment Mono, titres Barlow Condensed.

STORY: Le client répond, voit le relevé à droite se mettre à jour (tasses par boîte, prix de la tasse, économie mensuelle), enregistre, arrive sur la boutique « Pour moi ».

FIRST VIEWPORT: Titre condensé « Profil de goût », une ligne d'explication. Formulaire en colonne à gauche, relevé noir collant à droite (sous le formulaire sur mobile). Connexion : carte acier centrée, onglets Se connecter / Créer un compte, bouton vert.

FORM: Extension de la direction épinglée de la boutique. Geste signature : le relevé qui se recalcule pendant la saisie. seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
