---
name: Galaad
description: Chemises et costumes pour homme, taille calculée pour chaque article, dans le look de l'Apple Store.
colors:
  canvas: "#ffffff"
  tile: "#f5f5f7"
  fill: "#e8e8ed"
  separator: "#d2d2d7"
  control: "#86868b"
  label: "#1d1d1f"
  label-2: "#6e6e73"
  accent: "#0071e3"
  accent-hover: "#0077ed"
  link: "#0066cc"
  danger: "#e30000"
  danger-tint: "#fff2f4"
  ok: "#1d7a35"
  nav-glass: "rgb(250 250 252 / 0.8)"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "56px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "48px"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "40px"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "21px"
    fontWeight: 600
    letterSpacing: "-0.02em"
  figure:
    fontFamily: "-apple-system, BlinkMacSystemFont, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  intro:
    fontFamily: "-apple-system, BlinkMacSystemFont, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "-0.022em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: "-0.022em"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "-0.022em"
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "-0.022em"
  micro:
    fontFamily: "-apple-system, BlinkMacSystemFont, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "-0.022em"
    fontFeature: "tnum"
rounded:
  segment: "8px"
  segmented: "10px"
  field: "12px"
  notice: "18px"
  tile: "28px"
  pill: "9999px"
spacing:
  field-gap: "12px"
  gutter: "16px"
  gutter-sm: "22px"
  tile-pad-mobile: "24px"
  section: "40px"
  tile-pad: "40px"
  stack-lg: "48px"
  column-gap: "56px"
  page-top: "64px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.canvas}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-primary-form:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    height: "48px"
    width: "100%"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.canvas}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "40px"
  button-danger-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.danger}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "40px"
  button-danger-outline-hover:
    backgroundColor: "{colors.danger-tint}"
  button-text:
    textColor: "{colors.link}"
    typography: "{typography.label}"
    height: "44px"
  field:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.label}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "18px 16px 0"
    height: "56px"
  field-error:
    backgroundColor: "{colors.danger-tint}"
    textColor: "{colors.label}"
    rounded: "{rounded.field}"
  option-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.label}"
    rounded: "{rounded.field}"
    padding: "8px 12px"
    height: "56px"
  segmented-control:
    backgroundColor: "{colors.fill}"
    rounded: "{rounded.segmented}"
    padding: "3px"
  segment-active:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.label}"
    typography: "{typography.label}"
    rounded: "{rounded.segment}"
    padding: "0 20px"
    height: "36px"
  segment-idle:
    textColor: "{colors.label-2}"
    typography: "{typography.label}"
  tile:
    backgroundColor: "{colors.tile}"
    rounded: "{rounded.tile}"
    padding: "{spacing.tile-pad}"
  tile-notice:
    backgroundColor: "{colors.tile}"
    rounded: "{rounded.notice}"
    padding: "24px"
  alert-danger:
    backgroundColor: "{colors.danger-tint}"
    textColor: "{colors.danger}"
    typography: "{typography.label}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
  nav-bar:
    backgroundColor: "{colors.nav-glass}"
    textColor: "{colors.label}"
    height: "48px"
  nav-link:
    textColor: "{colors.label}"
    typography: "{typography.caption}"
    height: "44px"
    padding: "0 8px"
  size-pill-chosen:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.canvas}"
    typography: "{typography.micro}"
    rounded: "{rounded.pill}"
    height: "32px"
  size-pill-idle:
    textColor: "{colors.label-2}"
    typography: "{typography.micro}"
---

# Design System: Galaad

## Overview

**Creative North Star: "La page de l'Apple Store"**

Le compte Galaad se lit comme une page de l'Apple Store (apple.com/fr/shop) : fond blanc, grandes tuiles gris clair très arrondies, texte quasi noir et gris, un seul bleu pour tout ce qui agit. La page est calme et aérée ; la densité vient des chiffres, pas des cadres. Le look est épinglé par l'utilisateur.

Le geste signature est la jauge en curseur iOS : une piste grise, une partie remplie en bleu jusqu'au tour de poitrine, un pouce blanc ombré qui suit un ressort à amortissement critique, et les pastilles de tailles chemise et costume qui s'allument au passage. Les commandes empruntent le vocabulaire iOS : contrôle segmenté, champs à libellé flottant, tuiles de choix à bordure bleue comme le choix de capacité d'un iPhone, boutons pilule.

Le monde « atelier de coupe » (marine, mètre jaune, angles carrés) a été rejeté par l'utilisateur le 23/10/2026. Rien n'en subsiste.

**Key Characteristics:**
- Blanc et tuiles #f5f5f7 à 28 px de rayon, sans ombre.
- Un seul bleu d'action ; liens dans un bleu plus sombre.
- SF Pro sur les appareils Apple, Inter ailleurs, interlettrage négatif.
- Boutons pilule, champs et tuiles de choix à 12 px.
- Grands chiffres tabulaires en graisse 600 ; valeur estimée soulignée en pointillé.
- Mouvement court (150 ms) et ressort critique pour le repère de la jauge.

## Colors

Une palette de gris froids d'Apple, une seule couleur d'action, et un rouge réservé aux erreurs et à la suppression.

### Primary
- **Bleu Apple** (accent) : bouton principal, anneau de focus, curseur de saisie, sélection de texte (à 22 %), bordure de la tuile de choix retenue, pastille de taille retenue, partie remplie de la jauge (à 45 % quand le tour de poitrine est estimé).
- **Bleu Apple survolé** (accent-hover) : fond du bouton principal au survol, rien d'autre.
- **Bleu lien** (link) : liens et boutons texte (« Se déconnecter », « Annuler »), soulignés au survol.

### Neutral
- **Blanc** (canvas) : fond de page, fond des champs et des tuiles de choix, segment actif, pouce de la jauge.
- **Gris tuile** (tile) : grandes tuiles de contenu (lecture du mètre, encart d'explication, message de confirmation), état pressé d'une tuile de choix.
- **Gris remplissage** (fill) : piste de la jauge, rail du contrôle segmenté.
- **Filet** (separator) : filets horizontaux entre blocs (au-dessus des lectures, au-dessus de la zone de suppression), bordure de la barre en contraste renforcé.
- **Gris commande** (control) : bordure des champs et des tuiles de choix au repos, pointillé des valeurs estimées. Couleur de trait, pas de texte.
- **Encre** (label) : texte principal et titres.
- **Gris secondaire** (label-2) : intro, aides, libellés de lecture, libellé flottant, unités, segment inactif.
- **Verre de barre** (nav-glass) : fond translucide de la barre de navigation, opaque si la transparence est réduite.

### Statut
- **Rouge erreur** (danger) : texte et bordure d'erreur, bouton de suppression confirmée.
- **Rose erreur** (danger-tint) : fond d'un champ en erreur, des alertes et du survol du bouton de suppression.
- **Vert stock** (ok) : mention « En stock dans votre taille. » sur la fiche produit, seulement.

### Named Rules
**The Seul Bleu Rule.** Le bleu #0071e3 est la seule couleur d'action. Pas de deuxième accent, pas de bleu décoratif : s'il est bleu, il agit ou il marque la sélection.

**The Estimation Visible Rule.** Une valeur estimée porte toujours un soulignement pointillé gris commande de 2 px et le mot « estimé » ; une valeur mesurée n'en porte pas. Sur la jauge, le remplissage passe à 45 % d'opacité quand le tour de poitrine est estimé.

## Typography

**Display Font:** SF Pro via -apple-system / BlinkMacSystemFont (avec Inter, chargé par next/font, puis Helvetica Neue, Arial)
**Body Font:** la même pile

**Character:** une seule famille, celle d'Apple, en deux graisses (400 et 600, 500 pour les segments actifs, les tuiles de choix et les titres de la jauge). L'interlettrage est négatif partout et se resserre sur les grands corps.

### Hierarchy
- **Display** (600, 56 px, 1, chiffres tabulaires) : taille recommandée (« M », « 50 ») dans la lecture du mètre.
- **Headline** (600, 48 px dès 768 px, 40 px en dessous, 1,08, -0,03em, équilibré) : titre de page. Le titre centré de connexion reste à 40 px.
- **Title** (600, 28 px, 1,15, -0,02em) : titre d'une tuile (« Lecture du mètre », « Votre taille, article par article »).
- **Title-sm** (600, 21 px, -0,02em) : titres de groupe de champs, de la zone de suppression, du message de confirmation.
- **Figure** (600, 32 px dès 640 px, 28 px en dessous, 1, -0,03em, tabulaire) : mesures lues (« 99,5 cm »).
- **Intro** (400, 21 px dès 768 px, 19 px en dessous, 1,375) : chapeau gris sous le titre de page, 40rem au plus.
- **Body** (400, 17 px, 1,47, -0,022em) : texte courant, saisie, libellé de bouton principal.
- **Label** (400, 14 px) : aides de groupe, libellés de lecture, alertes, segments, boutons secondaires.
- **Caption** (400, 12 px) : liens de la barre, aides et erreurs sous un champ, mention « estimé » / « mesuré ».
- **Micro** (600, 11 px, tabulaire) : pastilles de tailles de la jauge ; 400 pour les graduations, 500 pour les titres « Chemises » / « Costumes ».

### Named Rules
**The Chiffres Tabulaires Rule.** Tout chiffre lu (mesure, taille, graduation) est en chiffres tabulaires ; les lectures sont en 600 à -0,03em.

**The Unité Toujours Rule.** Une valeur s'affiche avec son unité (cm, kg, ans), dans le champ comme dans la lecture.

## Layout

Un seul conteneur de 980 px centré, avec une gouttière de 16 px puis 22 px dès 640 px, partagé par la barre, la connexion et les mensurations. Haut de page à 40 px, 64 px dès 768 px.

- **Barre** : 48 px de haut, collante, mot Galaad à gauche, liens du compte à droite.
- **Connexion / inscription** : colonne centrée de 460 px (contrôle segmenté, titre centré, champs empilés à 16 px, bouton pleine largeur), puis une tuile pleine largeur du conteneur 64 px plus bas, en trois colonnes dès 640 px.
- **Mensurations** : formulaire à gauche, tuile de lecture à droite dès 1024 px (colonnes 1fr / 1,1fr, écart 56 px) ; empilés à 48 px en dessous. La tuile de lecture colle à 68 px du haut (barre + 20 px). Groupes de champs séparés de 40 px, champs à 12 px, trois champs par ligne pour l'essentiel dès 640 px, deux pour les mesures facultatives.
- **Zone de suppression** : sous les deux colonnes, sur toute la largeur, après un filet.

Tuiles : 40 px de padding dès 640 px (48 px pour l'encart de connexion) ; en dessous, 16 × 24 px pour la lecture du mètre, 24 × 40 px pour l'encart. Cibles tactiles de 44 px au moins (liens de barre, boutons texte, bouton principal).

## Elevation & Depth

Le système est plat. La profondeur vient du contraste blanc / gris tuile et de la translucidité de la barre (flou de 24 px, saturation 1,8). Les ombres sont réservées aux objets qu'on touche et qui imitent une commande iOS physique.

### Shadow Vocabulary
- **Pouce de jauge** (`box-shadow: 0 0.5px 4px rgb(0 0 0 / 0.12), 0 6px 13px rgb(0 0 0 / 0.12)`) : le pouce blanc de 24 px du curseur.
- **Segment actif** (`box-shadow: 0 3px 8px rgb(0 0 0 / 0.12), 0 1px 1px rgb(0 0 0 / 0.04)`) : le segment blanc du contrôle segmenté.
- **Halo de focus** (`box-shadow: 0 0 0 4px rgb(0 113 227 / 0.25)`) : champ actif, avec bordure bleue.
- **Bordure doublée** (`box-shadow: 0 0 0 1px #0071e3`) : tuile de choix retenue (2 px de bleu au total) ; en version intérieure, pastille de taille voisine.

### Named Rules
**The Plat Sauf Commande Rule.** Tuiles, alertes et boutons n'ont pas d'ombre. Seuls le pouce et le segment actif en portent.

## Shapes

Des coins doux partout, jamais d'angle vif. Trois familles : la pilule pour tout bouton et toute pastille, 12 px pour ce qui se saisit ou se choisit (champs, tuiles de choix, alertes), 28 px pour les grandes tuiles de contenu (18 px pour un message de confirmation ou d'erreur de page). Le contrôle segmenté a un rail à 10 px et des segments à 8 px. Les bordures sont fines (1 px), en gris commande au repos, bleues au focus ou à la sélection, rouges en erreur.

**The Pilule Rule.** Tout bouton est une pilule, du bouton principal au bouton de suppression.

## Components

### Buttons
- **Shape :** pilule (9999px).
- **Principal :** bleu Apple, texte blanc en 17 px 400, 44 px de haut, 22 px de padding latéral ; 48 px pleine largeur en bas d'un formulaire de connexion.
- **Survol / pression :** fond bleu survolé, 150 ms ; pression à 97 % d'échelle ; désactivé à 60 % d'opacité. Pendant l'envoi, un indicateur d'activité iOS à 12 branches précède le libellé (« Un instant… », « Enregistrement… »).
- **Suppression :** 40 px, 14 px de texte ; d'abord en contour rouge (fond rose au survol), puis plein rouge pour confirmer, à côté d'un bouton texte « Annuler ».
- **Texte :** bleu lien, souligné au survol, 44 px de cible.

### Inputs / Fields
- **Style :** 56 px de haut, bordure 1 px gris commande, fond blanc, 12 px de rayon, saisie en 17 px. Le libellé gris est au centre au repos et monte à 70 % quand le champ a le focus ou une valeur (150 ms). L'unité est posée à droite, en gris secondaire.
- **Focus :** bordure bleue et halo bleu de 4 px à 25 %, curseur bleu.
- **Erreur :** bordure rouge, fond rose, message rouge en 12 px sous le champ avec une icône cercle-point d'exclamation en SVG. Aide en 12 px gris sous le champ.

### Tuiles de choix
- **Style :** grille de deux, 56 px de haut au moins, bordure gris commande, fond blanc, 12 px de rayon, texte 15 px 500 centré.
- **États :** survol, bordure gris secondaire ; pressé, fond gris tuile ; retenu, bordure bleue doublée ; focus clavier, contour bleu de 2 px décalé de 2 px.

### Contrôle segmenté
- **Style :** rail gris remplissage à 10 px de rayon, 3 px de padding ; segments de 36 px, 14 px de texte gris secondaire.
- **Actif :** segment blanc à 8 px de rayon, texte encre 500, ombre de segment. Sert à basculer entre pages sœurs (connexion / inscription).

### Cards / Containers
- **Corner Style :** 28 px (tuiles de contenu), 18 px (message de confirmation, erreur de configuration).
- **Background :** gris tuile ; rose erreur pour une alerte de page.
- **Shadow Strategy :** aucune (voir Elevation & Depth).
- **Border :** aucune ; les blocs internes sont séparés par un filet.
- **Internal Padding :** voir Layout (40 px dès 640 px, 48 px pour l'encart de connexion).

### Navigation
- **Style :** barre de 48 px, verre clair translucide, collante, sans filet (filet et fond blanc en contraste renforcé). Mot Galaad en 20 px 600 à -0,03em ; liens en 12 px, encre à 80 %, encre pleine au survol, 44 px de cible.

### Jauge du mètre (composant signature)
Curseur iOS horizontal de 80 à 140 cm. Piste gris remplissage de 6 px, partie remplie bleue jusqu'au tour de poitrine, pouce blanc de 24 px ombré. Au-dessus, la rangée des tailles de chemise ; au-dessous, les graduations tous les 10 cm (90 à 130 cm) puis la rangée des tailles de costume. Chaque pastille occupe la plage de tour de poitrine de sa taille : retenue, pastille bleue pleine à texte blanc ; voisine, texte bleu et liseré bleu sur fond blanc dès 640 px ; sinon texte gris. Le pouce et le remplissage suivent un ressort à amortissement critique (réponse 0,4 s) qui repart de sa position et de sa vitesse à chaque saisie ; position immédiate si le mouvement est réduit. Hors de la plage, le pouce disparaît et une pastille bleue avec la valeur et une flèche se pose au bord dépassé.

### Lecture
Liste en deux colonnes sous un filet : libellé en 14 px gris, valeur en chiffres de lecture, puis « estimé » ou « mesuré » en 12 px. La taille recommandée s'affiche en display, la taille voisine en 17 px gris (« ou L »), puis « Taille estimée, confiance … ».

### Boutique
- **Illustrations de vêtements :** aucune photo produit n'existe. Chaque costume et chaque chemise est dessiné en SVG, en aplat de la couleur de l'article (motif rayé, carreaux ou vichy compris), manches légèrement ombrées, ombre portée douce au sol. Jamais présentés comme des photos.
- **Tuile produit :** gris tuile, 28 px de rayon dès 640 px (20 px en dessous), vêtement centré, nom en 19 px 600 (15 px sur téléphone), couleur et matière en gris, prix en chiffres tabulaires ; pastille bleue pleine avec la taille calculée, barrée sur fond gris remplissage si elle est épuisée. Deux colonnes sur téléphone, trois dès 1024 px.
- **Page de catégorie :** titre de 56 px « Costumes. » suivi d'une phrase grise ; ligne « Votre taille estimée » et contrôle segmenté Pour moi / Tout voir, sous un filet. Sans mensurations, une tuile invite à créer un compte.
- **Fiche produit :** vêtement dans une grande tuile collante à gauche ; à droite nom, prix, description, encart « Votre taille » (18 px de rayon, taille en display), pastilles de disponibilité par taille, caractéristiques sous un filet.
- **Accueil :** grand titre centré de 80 px, deux pilules d'action, vitrine de trois costumes qui montent en fondu (600 ms, décalage de 80 ms, fondu seul si le mouvement est réduit), puis deux grandes tuiles Costumes / Chemises.

## Do's and Don'ts

### Do:
- **Do** garder un seul bleu d'action (#0071e3) et le bleu lien (#0066cc) pour les liens.
- **Do** poser le contenu secondaire dans des tuiles gris tuile à 28 px de rayon, sans ombre ni bordure.
- **Do** faire de chaque bouton une pilule et de chaque champ un champ à libellé flottant de 56 px.
- **Do** marquer chaque valeur estimée d'un soulignement pointillé et du mot « estimé ».
- **Do** afficher les chiffres lus en 600, tabulaires, avec leur unité.
- **Do** garder les transitions à 150 ms et le ressort critique pour tout repère qui se déplace ; respecter la réduction du mouvement et de la transparence.

### Don't:
- **Don't** reprendre quoi que ce soit du monde « atelier » rejeté : pas de marine, pas de mètre jaune, pas d'angles carrés.
- **Don't** ajouter un deuxième accent ou colorer une surface en bleu à titre décoratif.
- **Don't** mettre d'ombre sur une tuile, une alerte ou un bouton.
- **Don't** écrire du texte en gris commande (#86868b) : 3,3:1 sur gris tuile, trop faible pour du petit texte.
- **Don't** présenter une taille comme certaine : elle reste « estimée », avec son niveau de confiance.
