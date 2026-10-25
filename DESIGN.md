---
name: Carrure
description: Chemises et costumes pour homme, avec une taille calculée pour chaque article.
source: design-system/carrure/MASTER.md (UI UX Pro Max 2.15.0, requête « luxury fashion ecommerce », variance 3, densité 3)
colors:
  primary: "#18181b"
  on-primary: "#ffffff"
  accent: "#18181b"
  accent-hover: "#3f3f46"
  on-accent: "#ffffff"
  background: "#fafafa"
  foreground: "#09090b"
  card: "#ffffff"
  muted: "#e8ecf0"
  muted-foreground: "#475569"
  border: "#e4e4e7"
  input: "#71717a"
  ring: "#18181b"
  destructive: "#b91c1c"
  destructive-tint: "#fef2f2"
  success: "#15803d"
typography:
  heading: "Cormorant 600, interligne 1,1, approche -0,01em"
  body: "Montserrat 400, 16 px, interligne 1,5"
  eyebrow: "Montserrat 600, 12 px, capitales, approche 0,08em"
radius:
  button: 8px
  card: 12px
  panel: 16px
---

# Carrure : système de design

Refonte du 24 octobre 2026, faite uniquement avec le skill **UI UX Pro Max** (dépôt `nextlevelbuilder/ui-ux-pro-max-skill`, version 2.15.0, installé dans `.claude/skills/ui-ux-pro-max`). La source de vérité est `design-system/carrure/MASTER.md`, généré par :

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "luxury fashion ecommerce" \
  --design-system --persist -p "Carrure" --variance 3 --density 3 --output-dir .
```

Ce fichier résume ce qui est réellement en ligne dans le code (`app/globals.css`, `components/field.tsx`).

## Direction

- Catégorie retenue par le skill : *E-commerce Luxury*. Style : *Minimalism & Swiss Style* (clair, aéré, grille, contraste fort).
- La première requête (« luxury menswear ecommerce tailoring ») proposait le style *Liquid Glass*, pensé pour les interfaces Apple. Hors sujet pour une boutique : requête resserrée une fois, comme le prévoit le skill.
- Structure d'accueil du MASTER, *Feature-Rich Showcase* : promesse, grille d'arguments, cas d'usage, appel à l'action répété en haut, au milieu et en bas. La section « preuve sociale » est volontairement absente : le site n'a aucun avis ni client réel, et n'en invente pas.

## Couleurs

Révision du 25 octobre 2026 : la palette pierre + or a été refusée. Elle est remplacée par la palette n° 76 « Museum/Gallery » de la base du skill (`data/colors.csv`) : noir galerie sur blanc, aucun accent coloré. Seul le vêtement porte la couleur. Les actions principales sont noires ; sur un fond noir, le bouton passe en blanc (`invertedButton`).

Deux écarts à la palette, pour l'accessibilité (priorité 1 du skill) :

| Jeton | Palette | En ligne | Pourquoi |
| --- | --- | --- | --- |
| `input` | `#E4E4E7` | `#71717A` | Le contour d'un champ doit atteindre 3:1 ; `#E4E4E7` fait 1,2:1 sur blanc. |
| `destructive` | `#DC2626` | `#B91C1C` | 4,4:1 seulement sur le fond d'erreur rosé ; il faut 4,5:1. |

`success` (`#15803D`) s'ajoute pour « En stock ».

`muted` (`#E8ECF0`) est aussi le fond des photos produit : vignette et image se fondent.

## Mouvement

Motion (ex-Framer Motion), preset « Stagger List (Standard) » du skill : fondu et montée de 16 px, 400 à 450 ms, 60 ms entre deux éléments, courbe `cubic-bezier(0.23, 1, 0.32, 1)`, sans rebond. Une seule fois par bloc, à l'entrée dans l'écran. Mouvement réduit : fondu seul. Composants : `components/motion.tsx`.

## Typographie

Cormorant pour les titres (`h1` à `h3`), Montserrat pour tout le reste, chargées par `next/font` (consigne Next.js du skill). Les noms d'articles dans les cartes sont en Montserrat (`font-sans`), plus lisibles en petit.

## Composants (spécifications du MASTER)

- **Bouton principal** : fond noir, texte blanc, rayon 8 px, 600, hauteur 48 px, soulèvement de 1 px au survol.
- **Bouton secondaire** : filet de 2 px quasi noir, se remplit au survol.
- **Champ** : libellé toujours visible au-dessus, bordure 1 px, rayon 8 px, 16 px, anneau de 3 px au focus, erreur juste sous le champ.
- **Carte** : blanc, filet gris, rayon 12 px, ombre légère ; ombre large et soulèvement de 2 px au survol pour les cartes cliquables.
- **Contrôle segmenté** : piste grise, segment actif en carte blanche.
- **Icônes** : Phosphor (`@phosphor-icons/react` 2.1.10, import `/ssr`), recommandé par le domaine `icons` du skill. Aucun emoji.

## Photos

Aucune personne : chaque article est montré seul, sur cintre, sur le fond `muted`. Méthode et crédits dans le README (« Crédits photos »).

## Vérifications faites (checklist pré-livraison du MASTER)

- Pas de défilement horizontal à 375, 768, 1024 et 1440 px, sur toutes les pages (client et admin).
- Cibles tactiles de 44 px au minimum, `cursor: pointer` sur tout élément cliquable.
- Transitions de 200 ms, `prefers-reduced-motion` respecté.
- Focus clavier visible (contour de 2 px).
