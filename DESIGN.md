---
name: Contrebande
description: Le kit pour faire chez soi le matcha du coffee shop, présenté comme une marchandise saisie.
colors:
  ink: "#0b0c0d"
  ink-2: "#17191c"
  steel: "#d5dbe2"
  steel-2: "#c4ccd5"
  steel-3: "#aab4be"
  paper: "#f4f6f8"
  matcha: "#a3e048"
  matcha-hover: "#b6ee63"
  matcha-ink: "#33590f"
  fog: "#4a545f"
  fog-dark: "#9aa4ae"
  line: "rgb(11 12 13 / 0.16)"
  line-dark: "rgb(255 255 255 / 0.14)"
  danger: "#9f1d14"
  danger-dark: "#ff8a7a"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(56px, 8.6vw, 128px)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "56px"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Barlow, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Fragment Mono, ui-monospace, Menlo, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0"
    fontFeature: "tnum"
  button:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    letterSpacing: "0.02em"
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
    textColor: "{colors.ink}"
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
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
  button-ghost-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
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
    textColor: "{colors.ink}"
  tag-dark:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.paper}"
  header:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
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

# Design System: Contrebande

## Overview

**Creative North Star: "La pièce à conviction"**

Le matcha et ses ustensiles sont présentés comme une marchandise saisie : posés sous un projecteur sur un fond d'acier, étiquetés, numérotés, consignés. Le noir porte la marque (en-tête, pied de page, sections de démonstration), l'acier bleuté porte la boutique, et un seul vert matcha acide désigne l'action, la sélection et le progrès.

La densité est celle d'une planche technique : grands titres condensés en capitales, petites mentions en mono pour les doses, prix, numéros et indications de défilement, filets de 1 px, angles droits partout. La profondeur vient des objets en 3D, jamais des surfaces. L'accueil se lit au défilement : sections épinglées, titres qui montent ligne à ligne, scènes 3D pilotées par le scroll, et tout reste lisible et complet sans mouvement.

**Key Characteristics:**
- Noir, acier bleuté, un seul vert matcha.
- Titres en Barlow Condensed 800, capitales, interlignage serré (0.82 à 0.95).
- Mentions techniques en Fragment Mono 13 px, chiffres tabulaires.
- Angles droits, filets de 1 px, aucune ombre de surface.
- Objets modélisés en 3D sur fond acier éclairé, rendu fixe en repli.

## Colors

Une palette froide et quasi monochrome, percée d'un vert acide unique.

### Primary
- **Vert matcha acide** (matcha): l'action principale (bouton primaire), la sélection (`::selection`, choix cochés), l'anneau de focus, le progrès (rail de sections, étapes du protocole), le badge du panier, les bandeaux d'appel au profil de goût. Survol en **vert matcha éclairci** (matcha-hover).
- **Vert matcha profond** (matcha-ink): le vert lisible sur acier ou papier, pour un message de succès en texte et le caret des champs (5,1:1 sur steel).

### Neutral
- **Encre** (ink): fond des zones sombres (en-tête, pied de page, hero, protocole), texte courant sur fond clair, bouton secondaire au survol.
- **Encre relevée** (ink-2): cartes et étiquettes posées sur l'encre.
- **Acier** (steel): fond de page par défaut.
- **Acier moyen** (steel-2) et **acier sombre** (steel-3): bords du dégradé de projecteur, barre de défilement, pastilles neutres.
- **Papier** (paper): champs, vignettes produit (à 55 %, 90 % au survol), texte sur fond noir, étiquettes claires.
- **Brume** (fog): texte secondaire et placeholders sur fond clair (5,5:1 sur steel).
- **Brume claire** (fog-dark): texte secondaire sur l'encre (8:1).
- **Filet** (line) et **filet clair** (line-dark): toutes les séparations de 1 px, respectivement sur fond clair et sur fond noir.
- **Alerte** (danger) sur fond clair, **alerte claire** (danger-dark) sur fond noir.

### Named Rules
**The One Green Rule.** Le vert matcha est la seule couleur d'accent. Il marque l'action, la sélection ou le progrès, jamais la décoration d'un texte courant sur fond clair : là, on prend matcha-ink.

**The Two Grounds Rule.** Chaque zone est soit acier/papier avec texte encre, soit encre avec texte papier (marquée `data-theme="dark"`). Les gris secondaires changent avec le fond : fog sur clair, fog-dark sur noir.

## Typography

**Display Font:** Barlow Condensed 600/700/800 (repli Arial Narrow)
**Body Font:** Barlow 400/500/600 (repli Helvetica Neue, Arial)
**Label/Mono Font:** Fragment Mono 400 (repli ui-monospace, Menlo)

**Character:** Un titre condensé en capitales qui parle fort comme un tampon, un texte courant neutre et lisible, et une mono de fiche technique pour tout ce qui se compte.

### Hierarchy
- **Display** (800, de 15vw sur mobile à 128 px, 0.82 à 0.9): titres de section de l'accueil, plaque de marque du pied de page (18,5vw, 266 px max). Composition en `justify-between` sur toute la largeur possible.
- **Headline** (800, 40 à 80 px, 0.9): titres de page et de bloc (« La boutique », « Protocole de préparation »).
- **Title** (800, 24 à 34 px, 0.95): noms de produit dans les vignettes, titres de panneau.
- **Body** (400, 17 px, 1.5): texte courant ; aides et erreurs à 14 px, libellés de champ 15 px en 500. `text-wrap: pretty` sur les paragraphes, `balance` sur les titres.
- **Label** (mono 400, 13 px, 1.45, chiffres tabulaires): prix, doses, formats, numéros d'étape (« 01 », « Étape 02 »), navigation, indications (« (défiler) », « (faites tourner) »). En capitales pour la navigation et les étiquettes ; 11 à 12 px pour les sources et mentions de pied.
- **Bouton** (Barlow Condensed 700, 19 px, capitales, +0.02em).

### Named Rules
**The Stamp Rule.** Barlow Condensed n'apparaît qu'en capitales et en gras (700 ou 800). Jamais pour un paragraphe.

**The Ledger Rule.** Tout chiffre que le client compare (prix, grammes, tasses, scores) passe en mono tabulaire.

## Layout

Conteneur de 1440 px maximum, gouttières de 16 px puis 24 px dès 640 px. Les panneaux ont 20 px puis 24 px de marge interne. Les grilles de vignettes et d'étapes se séparent par un filet (gap de 1 px ou ombre interne de 1 px) plutôt que par de l'espace. L'en-tête collant mesure 56 px, plus une seconde ligne de rayons de 40 px sous 768 px (`--header-h` vaut 6rem puis 3.5rem) ; le contenu démarre à `100svh` moins l'en-tête pour que le pied de page ne saute pas.

L'accueil est une suite de sections pleine hauteur qui alternent encre, acier éclairé et papier, chacune déclarée au rail de navigation (`data-rail`). Les sections épinglées font exactement `100svh - --header-h` et se calent sous l'en-tête. Les grilles de repérage (filets et croix, cellules réglables) habillent les fonds techniques. Les colonnes latérales d'info (22 à 25 rem) accompagnent la scène 3D à partir de 1024 px et passent dessous en mobile.

## Elevation & Depth

Système plat. Les surfaces ne portent aucune ombre portée : la séparation vient des deux fonds (encre / acier), des filets de 1 px et du dégradé de projecteur sur acier (clair au centre, steel-3 aux bords). La profondeur réelle est confiée aux objets 3D, éclairés en studio (lumière clé, environnement, ombre douce au sol) sur fond transparent.

### Shadow Vocabulary
- **Filet intérieur** (`box-shadow: inset 0 0 0 1px var(--color-line)`): contour des vignettes et des onglets ; 1.5 px encre ou blanc 70 % pour les boutons secondaire et fantôme.
- **Anneau de focus** (`outline: 2px solid ink; outline-offset: 2px; box-shadow: 0 0 0 5px matcha`): sur fond sombre, contour matcha seul. Les champs : bord encre plus anneau matcha de 3 px.
- **Couche flottante** (`box-shadow: 0 18px 40px rgb(0 0 0 / 0.35)`): réservée aux éléments qui flottent au-dessus de la page (bandeau cookies, aperçu d'étiquette).

### Named Rules
**The Spotlight Rule.** Le relief appartient aux objets, pas aux cartes. Une surface se distingue par son fond ou son filet.

## Shapes

Angles droits sans exception (rayon 0) : boutons, champs, vignettes, étiquettes, bandeaux, pastilles du rail. Les indicateurs sont des carrés pleins ou cerclés d'un filet (rail 10 px, étapes 12 px, puces 6 à 8 px). Les étiquettes numérotées juxtaposent deux blocs rectangulaires sans espace : le numéro sur gris foncé, le nom sur fond clair.

## Components

### Buttons
Des capitales condensées dans un rectangle net, qui s'enfoncent légèrement au clic.
- **Shape:** angles droits (0), hauteur 52 px, 24 px de côté, icône ou spinner à 12 px du texte.
- **Primary:** fond matcha, texte encre ; survol matcha-hover. Une seule par zone. Sur un bandeau matcha, il s'inverse en encre et texte papier.
- **Secondary:** sur fond clair, filet encre de 1.5 px ; au survol il se remplit d'encre, texte papier.
- **Ghost:** sur fond noir, filet blanc 70 % ; au survol il se remplit de papier, texte encre.
- **Hover / Focus:** transition de 150 ms en `--ease-out`, `scale(0.98)` à l'appui, désactivé à 45 % d'opacité.
- **Text link:** Barlow 500 16 px, soulignement à 35 % qui se fonce au survol, cible de 44 px.

### Chips
- **Étiquette numérotée:** mono 12 px en capitales ; index sur gris, nom sur papier, encre ou matcha. Sert au score « Pour vous » (matcha à partir de 85), à « Épuisé » (encre), et aux étiquettes accrochées aux objets 3D.
- **Choix:** dans les panneaux sombres, cases mono de 44 px cerclées de blanc 50 % ; cochées, elles passent en matcha ou papier pleins.

### Cards / Containers
- **Vignette produit:** rendu 3D carré sur acier éclairé, nom en Title, formats en mono fog, prix en mono 15 px poussé en bas ; fond papier 55 %, filet intérieur, papier 90 % et zoom de l'image à 1.04 au survol (500 ms).
- **Panneau sombre:** encre ou encre relevée, marge 20 à 24 px, séparé par des filets line-dark.
- **Bandeau d'appel:** fond matcha plein, titre Headline, bouton encre.

### Inputs / Fields
- **Style:** papier, bord encre 45 %, rayon 0, 48 px de haut, texte 17 px ; unité en mono fog à droite. Libellé toujours visible au-dessus.
- **Focus:** bord encre plein et anneau matcha de 3 px (200 ms).
- **Error:** bord danger, message 14 px danger avec icône d'alerte, relié par `aria-describedby`.
- **Select:** même champ, chevron dessiné en encre à droite.

### Navigation
- **En-tête:** barre encre collante de 56 px ; marque en Barlow Condensed 27 px, rayons en mono 13 px capitales papier 80 %, matcha au survol ; icônes Phosphor de 20 à 21 px dans des cibles de 44 px ; badge du panier carré matcha en chiffres mono. Sous 768 px, les rayons passent sur une seconde ligne de 40 px.
- **Onglets segmentés:** filet encre de 1 px autour, items mono 13 px capitales de 44 px ; la page en cours passe en encre pleine, texte papier.
- **Rail de sections:** colonne fixe à droite dès 1024 px, un carré par section, matcha jusqu'à la section lue.
- **Pied de page:** encre, trois colonnes de liens, puis le nom de la marque en Display sur toute la largeur comme une plaque, puis une ligne de mentions mono 12 px fog-dark.

### Scènes 3D
Les objets sont modélisés en code (Three.js) et rendus dans un canvas transparent posé sur le fond CSS. Three n'est chargé qu'à 600 px de l'écran, la boucle ne tourne que si le canvas est visible et s'arrête quand plus rien ne bouge (rendu à la demande). Sans WebGL, le rendu PNG du même modèle (`public/renders`) reste affiché ; il sert aussi de vignette boutique et d'image d'attente. En mouvement réduit : pas d'inertie ni de rotation au repos, pas de flottement, et les scènes pilotées par le défilement deviennent des étapes à plat avec leur image fixe.

### Mouvement
- **Courbes:** `--ease-out` (cubic-bezier(0.23, 1, 0.32, 1)) pour les états d'interface, `--ease-in-out` pour les va-et-vient, `expo.out` côté GSAP.
- **Apparitions:** les blocs montent de 28 px en fondu par paquets (700 ms, décalage 70 ms) ; les titres se composent ligne à ligne derrière un masque (900 ms, décalage 80 ms).
- **Épinglage:** sections calées sous l'en-tête, scrub de 0.6, progression reportée sur la scène 3D et sur des carrés d'étape.
- Tout est conditionné à `prefers-reduced-motion: no-preference` ; l'état caché n'est posé qu'au montage, le contenu reste visible sans JavaScript.

## Do's and Don'ts

### Do:
- **Do** garder un rayon de 0 sur tout élément d'interface.
- **Do** réserver le matcha à l'action principale, à la sélection et au progrès ; matcha-ink pour du vert en texte sur fond clair.
- **Do** écrire prix, doses, formats et numéros en Fragment Mono tabulaire.
- **Do** séparer par des filets de 1 px (line sur clair, line-dark sur noir) plutôt que par des ombres.
- **Do** poser les objets sur l'acier éclairé et prévoir leur rendu PNG en repli.
- **Do** conditionner chaque animation à `MOTION_OK` et fournir une version à plat, complète, en mouvement réduit.
- **Do** caler toute section épinglée sous l'en-tête (`PINNED_HEIGHT`, `pinStart`).

### Don't:
- **Don't** introduire une deuxième couleur d'accent ni un dégradé coloré sur les surfaces d'interface.
- **Don't** arrondir les angles ni ajouter d'ombre portée à une carte ou un bouton ; l'ombre portée est réservée aux couches flottantes.
- **Don't** composer un paragraphe en Barlow Condensed ou un titre en bas de casse.
- **Don't** utiliser fog sur fond noir ni fog-dark sur fond clair.
- **Don't** laisser tourner une boucle de rendu 3D hors écran ou à l'arrêt.
