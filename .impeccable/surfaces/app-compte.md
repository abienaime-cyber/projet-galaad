---
version: 1
slug: "app-compte"
primary_target: "app/compte"
related_targets: ["app/connexion"]
---

# Espace compte (connexion, inscription, mensurations)

Mode : Operate. Public : client Galaad, sur téléphone ou ordinateur, souvent mètre ruban en main. Tâche : créer un compte, puis saisir taille, poids, âge et, s'il les connaît, tour de poitrine, tour de taille et coupe préférée. Succès : profil enregistré en moins d'une minute, et le client comprend ce que ses chiffres donnent comme taille.

Contraintes : vouvoiement sobre, unités toujours affichées, valeurs estimées toujours signalées comme telles, rien d'inventé.

## Direction contract

THESIS: L'atelier de coupe. Le compte est la fiche de mesures du client, et le mètre ruban montre où il tombe entre deux tailles. Refuse le formulaire gris centré dans une carte.

OWN-WORLD: Fond papier patron blanc froid ; coquille et actions primaires en bleu drap marine ; jaune du mètre ruban réservé aux seules mesures et tailles du client ; rouge des dizaines du mètre pour les repères et les erreurs. Archivo : largeur normale pour l'interface, étroite et grasse pour les chiffres. Valeur estimée soulignée en pointillé de fil à bâtir, valeur mesurée en trait plein.

STORY: Le client comprend que ses chiffres servent à calculer une taille, voit le calcul réagir à chaque saisie, enregistre, et sait si c'est mesuré ou estimé.

FIRST VIEWPORT: Barre Galaad marine en haut. Mensurations : formulaire à gauche (champs avec unités, coupe préférée en choix segmenté, bouton Enregistrer marine). À droite, sous le formulaire en mobile : le mètre jaune horizontal avec repères en cm, bandes de tailles chemise et costume, curseur du client. Connexion : un seul panneau, onglets Se connecter / Créer un compte.

FORM: Atelier de coupe, IMPECCABLE'S PICK, rang 1 de ma liste. Emprunts : jaune réservé aux données du client (carte d'orientation) ; hiérarchie par contraste d'échelle des chiffres (spécimen typo) ; suppression isolée (console) ; états physiques bâti/couture (manuel à intercalaires). seed:c3e4010b112e3f75

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
