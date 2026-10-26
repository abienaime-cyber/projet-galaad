---
name: USUCHA
description: Le kit pour faire chez soi le matcha du coffee shop, dans une maison claire couleur céramique.
colors:
  ink: "#233128"
  ink-2: "#2f3f34"
  steel: "#f7f5f0"
  steel-2: "#efebe2"
  steel-3: "#ddd8cb"
  celadon: "#dfe8d0"
  celadon-2: "#d3dfc1"
  iron: "#6b7563"
  gunmetal: "#a3ab98"
  paper: "#fdfcf8"
  matcha: "#4a7627"
  matcha-hover: "#3f6620"
  on-matcha: "#fdfcf8"
  powder: "#79a83d"
  moss: "#5c7e2a"
  matcha-ink: "#3d6420"
  fog: "#566150"
  line: "rgb(35 49 40 / 0.16)"
  danger: "#9f1d14"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(40px, 7vw, 118px)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "SOFT 60"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "56px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "0.02em"
    fontFeature: "tnum"
  button:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    letterSpacing: "0.01em"
rounded:
  none: "0px"
spacing:
  gutter: "16px"
  gutter-sm: "24px"
  panel: "20px"
  panel-sm: "24px"
  container: "1440px"
components:
  button-primary:
    backgroundColor: "{colors.matcha}"
    textColor: "{colors.on-matcha}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.matcha-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.celadon}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
    height: "48px"
  tag:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  tag-matcha:
    backgroundColor: "{colors.matcha}"
    textColor: "{colors.on-matcha}"
  tag-dark:
    backgroundColor: "{colors.celadon-2}"
    textColor: "{colors.ink}"
  header:
    backgroundColor: "{colors.celadon}"
    textColor: "{colors.ink}"
    height: "56px"
  product-tile:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px"
  segmented-nav:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  segmented-nav-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
---

# Design System: USUCHA

## Overview

**Creative North Star: "La pièce à conviction, dans une maison de thé claire"**

Le matcha et ses ustensiles restent présentés comme des pièces étiquetées, numérotées, consignées. Mais tout se passe à la lumière du jour : fond porcelaine, zones fortes en céladon pâle, texte vert-de-gris, et un seul vert matcha foncé pour l'action. Aucun noir : l'utilisateur l'a refusé le 26/10/2026 et a choisi cette palette « céramique ».

Les titres sont en Fraunces, une serif douce, en bas de casse. Le texte, les prix et les doses sont en Instrument Sans. La densité reste celle d'une planche : filets de 1 px, angles droits, petites mentions pour les doses et les numéros. Les images sont de vraies photos. L'accueil se vit au doigt : la poudre qu'on écarte, la boîte qu'on tapote, les photos qui s'enchaînent au défilement. Tout reste lisible et complet sans mouvement.

**Key Characteristics:**
- Porcelaine #f7f5f0, céladon #dfe8d0, texte vert-de-gris #233128, un seul vert d'action #4a7627.
- Titres en Fraunces 600, axe SOFT à 60, bas de casse, interlignage 1.
- Texte, prix et mentions en Instrument Sans, chiffres tabulaires.
- Angles droits, filets de 1 px, aucune ombre de surface.
- Vraies photos (Pexels, voir CREDITS.md), cadrées nettes sur le céladon pour la préparation.
- Logo : tampon carré vert portant 薄茶 en porcelaine, et « usucha » en Fraunces 600 bas de casse. Tracés vectoriels dans `components/logo.tsx`.

## Colors

Une palette claire, couleur céramique : porcelaine, céladon, vert-de-gris, et un vert matcha foncé unique pour agir.

### Primary
- **Vert matcha** (matcha, #4a7627) : l'action principale (bouton primaire, texte porcelaine dessus, 4,6:1), la sélection, l'anneau de focus, le progrès (rail, étapes), le badge du panier. Survol plus foncé (matcha-hover). Dans les zones céladon, le jeton fonce à #3d6420 pour garder le contraste.
- **Vert matcha profond** (matcha-ink) : le vert en texte sur fond clair (6,3:1 sur porcelaine).

### Neutral
- **Porcelaine** (steel) : fond de page par défaut.
- **Céladon** (celadon) et **céladon soutenu** (celadon-2) : les zones fortes de l'accueil (en-tête, hero, préparation, kits, pied de page), le bandeau d'appel au profil de goût, le rideau du calcul.
- **Vert-de-gris** (ink) : texte courant, onglet actif, puces. **Vert-de-gris relevé** (ink-2) : survol des éléments pleins.
- **Papier** (paper) : champs, vignettes produit, texte sur le vert d'action.
- **Brume** (fog) : texte secondaire et placeholders (6:1 sur porcelaine, 5,2:1 sur céladon).
- **Fer** (iron) et **gris-vert** (gunmetal) : numéros d'étiquette, logo en filigrane. Grands textes seulement.
- **Poudre** (powder) et **mousse** (moss) : verts de la poudre réelle, grands chiffres seulement.
- **Filet** (line) : toutes les séparations de 1 px.
- **Alerte** (danger) : erreurs, sur tous les fonds.

### Named Rules
**The One Green Rule.** Le vert matcha est la seule couleur d'accent. Il marque l'action, la sélection ou le progrès.

**The Céladon Zone Rule.** Les zones marquées `data-theme="dark"` (nom historique) sont les zones céladon. Le CSS y remappe les jetons : `ink` devient le fond céladon, `paper` le texte vert-de-gris, `matcha` fonce. Les composants n'ont rien à changer.

**The No Black Rule.** Aucun noir pur ni gris neutre froid : les sombres sont des verts-de-gris.

## Typography

**Display Font:** Fraunces 600, axes opsz et SOFT (repli Georgia)
**Body Font:** Instrument Sans 400/500/600 (repli Helvetica Neue, Arial)

**Character:** Une serif douce et chaleureuse qui parle comme une maison de thé, et une sans nette pour tout ce qui se lit et se compte.

### Hierarchy
- **Display** (600, SOFT 60, interlignage 1, -0.02em) : titres de section de l'accueil et plaque de marque du pied de page.
- **Headline** (600, 40 à 88 px) : titres de page et de bloc (« La boutique », « Préparation »).
- **Title** (600, 24 à 34 px) : noms de produit, titres de panneau.
- **Body** (Instrument Sans 400, 17 px, 1.5) : texte courant ; aides et erreurs à 14 px, libellés 15 px en 500.
- **Label** (Instrument Sans 500, 13 px, +0.02em, chiffres tabulaires) : prix, doses, formats, numéros, navigation, indications. En capitales pour la navigation et les étiquettes.
- **Bouton** (Instrument Sans 600, 16 px, casse normale).

### Named Rules
**The Lowercase Rule.** Les titres Fraunces s'écrivent en casse de phrase, jamais en capitales.

**The Ledger Rule.** Tout chiffre que le client compare (prix, grammes, tasses, scores) est en chiffres tabulaires.

## Layout

Conteneur de 1440 px maximum, gouttières de 16 px puis 24 px dès 640 px. Les panneaux ont 20 px puis 24 px de marge interne. Les grilles de vignettes et d'étapes se séparent par un filet (gap de 1 px ou ombre interne de 1 px) plutôt que par de l'espace. L'en-tête collant mesure 56 px, plus une seconde ligne de rayons de 40 px sous 768 px (`--header-h` vaut 6rem puis 3.5rem) ; le contenu démarre à `100svh` moins l'en-tête pour que le pied de page ne saute pas.

L'accueil est une suite de sections pleine hauteur qui alternent céladon, porcelaine éclairée et papier, chacune déclarée au rail de navigation (`data-rail`). Les sections épinglées font exactement `100svh - --header-h` et se calent sous l'en-tête. Les grilles de repérage (filets et croix, cellules réglables) habillent les fonds techniques. Les colonnes latérales d'info (22 à 25 rem) accompagnent la photo ou la poudre à partir de 1024 px et passent dessous en mobile.

## Elevation & Depth

Système plat. Les surfaces ne portent aucune ombre portée : la séparation vient des deux fonds (céladon / porcelaine), des filets de 1 px et du dégradé doux sur porcelaine (plus clair au centre). La profondeur réelle est confiée aux photos.

### Shadow Vocabulary
- **Filet intérieur** (`box-shadow: inset 0 0 0 1px var(--color-line)`): contour des vignettes et des onglets ; 1.5 px vert-de-gris pour les boutons secondaire et fantôme.
- **Anneau de focus** (`outline: 2px solid matcha; outline-offset: 3px`) sur tous les fonds. Les champs : bord vert-de-gris plus anneau matcha de 3 px.
- **Couche flottante** (`box-shadow: 0 18px 40px rgb(0 0 0 / 0.35)`): réservée aux éléments qui flottent au-dessus de la page (bandeau cookies, aperçu d'étiquette).

### Named Rules
**The Spotlight Rule.** Le relief appartient aux objets, pas aux cartes. Une surface se distingue par son fond ou son filet.

## Shapes

Angles droits sans exception (rayon 0) : boutons, champs, vignettes, étiquettes, bandeaux, pastilles du rail. Les indicateurs sont des carrés pleins ou cerclés d'un filet (rail 10 px, étapes 12 px, puces 6 à 8 px). Les étiquettes numérotées juxtaposent deux blocs rectangulaires sans espace : le numéro sur gris foncé, le nom sur fond clair.

## Components

### Buttons
Instrument Sans demi-gras dans un rectangle net, qui s'enfonce légèrement au clic.
- **Shape:** angles droits (0), hauteur 52 px, 24 px de côté, icône ou spinner à 12 px du texte.
- **Primary:** fond matcha, texte papier (on-matcha) ; survol matcha-hover. Une seule par zone.
- **Secondary:** sur porcelaine, filet vert-de-gris de 1.5 px ; au survol il se remplit, texte papier.
- **Ghost:** sur céladon, filet de la couleur du texte ; au survol il se remplit de vert-de-gris, texte céladon.
- **Hover / Focus:** transition de 150 ms en `--ease-out`, `scale(0.98)` à l'appui, désactivé à 45 % d'opacité.
- **Text link:** Instrument Sans 500 16 px, soulignement à 35 % qui se fonce au survol, cible de 44 px.

### Chips
- **Étiquette numérotée:** mono 12 px en capitales ; index sur gris, nom sur papier, vert-de-gris ou matcha. Sert au score « Pour vous » (matcha à partir de 85), à « Épuisé » (vert-de-gris), et aux étiquettes des pièces.
- **Choix:** dans les panneaux sombres, cases mono de 44 px cerclées de blanc 50 % ; cochées, elles passent en matcha ou papier pleins.

### Cards / Containers
- **Vignette produit:** photo 4:5, nom en Title, formats en mono fog, prix en mono 15 px poussé en bas ; fond papier 55 %, filet intérieur, papier 90 % et zoom de l'image à 1.04 au survol (500 ms).
- **Panneau céladon:** céladon ou céladon soutenu, marge 20 à 24 px, séparé par des filets.
- **Bandeau d'appel:** fond céladon, titre Headline, bouton primaire vert.

### Inputs / Fields
- **Style:** papier, bord vert-de-gris 45 %, rayon 0, 48 px de haut, texte 17 px ; unité en mono fog à droite. Libellé toujours visible au-dessus.
- **Focus:** bord vert-de-gris plein et anneau matcha de 3 px (200 ms).
- **Error:** bord danger, message 14 px danger avec icône d'alerte, relié par `aria-describedby`.
- **Select:** même champ, chevron dessiné en vert-de-gris à droite.

### Navigation
- **En-tête:** une seule barre céladon collante de 56 px ; logo de 26 px de haut ; trois liens en Instrument Sans 13 px capitales (Accueil, Boutique, Panier), matcha au survol ; le compte derrière une icône Phosphor de 21 px dans une cible de 44 px ; badge du panier carré matcha. Sous 640 px, Accueil passe sur le logo et Panier devient une icône.
- **Onglets segmentés:** filet vert-de-gris de 1 px autour, items 13 px capitales de 44 px ; la page en cours passe en vert-de-gris plein, texte papier.
- **Rail de sections:** colonne fixe à droite dès 1024 px, un carré par section, matcha jusqu'à la section lue.
- **Pied de page:** céladon, trois colonnes de liens, puis le logo sur toute la largeur comme une plaque, puis une ligne de mentions 12 px fog.

### Photos et poudre interactive
- **Photos:** `public/photos/<modèle>.jpg`, une par produit, plus la série de préparation (même bol, même lumière, fond sombre d'origine). Sur le céladon, elles sont cadrées nettes, sans masque ; en vignette, elles remplissent un cadre 4:5.
- **Poudre** (`components/powder.tsx`) : WebGL nu. Chaque grain est un pixel d'une vraie photo de poudre ; la forme « tas » découpe dans la texture un tas aux bords irréguliers. La souris écarte les grains, un appui les souffle, chacun revient à sa place à son rythme. La boucle dort quand rien ne bouge et hors écran. Mouvement réduit : poudre posée, immobile.
- **Boîte** (`components/home/pot.tsx`) : chaque appui sert une tasse ; la boîte tressaute, une bouffée de grains s'échappe, le compteur tombe de 2 g.
- **Loupe produit** (`components/photo-zoom.tsx`) : zoom 2,2 sous la souris, ou au doigt par appui.

### Mouvement
- **Courbes:** `--ease-out` (cubic-bezier(0.23, 1, 0.32, 1)) pour les états d'interface, `--ease-in-out` pour les va-et-vient, `expo.out` côté GSAP.
- **Apparitions:** les blocs montent de 28 px en fondu par paquets (700 ms, décalage 70 ms) ; les titres se composent ligne à ligne derrière un masque (900 ms, décalage 80 ms).
- **Épinglage:** sections calées sous l'en-tête, scrub de 0.6 ; les photos de préparation passent de l'une à l'autre en fondu et zoom, la chaîne feuille, poudre, boîte s'ouvre et se ferme en cercle.
- Tout est conditionné à `prefers-reduced-motion: no-preference` ; l'état caché n'est posé qu'au montage, le contenu reste visible sans JavaScript.

## Do's and Don'ts

### Do:
- **Do** garder un rayon de 0 sur tout élément d'interface.
- **Do** réserver le matcha à l'action principale, à la sélection et au progrès ; matcha-ink pour du vert en texte sur fond clair.
- **Do** écrire prix, doses, formats et numéros en chiffres tabulaires (utilitaire `mono` ou `figures`).
- **Do** séparer par des filets de 1 px (line) plutôt que par des ombres.
- **Do** utiliser de vraies photos, cohérentes entre elles (même fond, même lumière), et créditer chaque photo dans CREDITS.md.
- **Do** conditionner chaque animation à `MOTION_OK` et fournir une version à plat, complète, en mouvement réduit.
- **Do** caler toute section épinglée sous l'en-tête (`PINNED_HEIGHT`, `pinStart`).

### Don't:
- **Don't** introduire une deuxième couleur d'accent ni un dégradé coloré sur les surfaces d'interface.
- **Don't** arrondir les angles ni ajouter d'ombre portée à une carte ou un bouton ; l'ombre portée est réservée aux couches flottantes.
- **Don't** composer un titre Fraunces en capitales, ni un paragraphe en Fraunces.
- **Don't** réintroduire du noir ou un gris froid : l'utilisateur les a refusés le 26/10/2026.
- **Don't** laisser tourner une boucle de rendu hors écran ou à l'arrêt.
- **Don't** revenir à des objets modélisés en 3D : l'utilisateur les a refusés le 26/10/2026.
