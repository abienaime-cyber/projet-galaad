---
name: Carrure
description: Chemises et costumes pour homme, avec une taille calculée pour chaque article.
colors:
  canvas: "#0c0b0a"
  tile: "#151412"
  fill: "#201e1b"
  field: "#11100e"
  separator: "#2e2b27"
  control: "#6e6961"
  label: "#eeeae3"
  label-2: "#a8a197"
  accent: "#eeeae3"
  accent-hover: "#ffffff"
  on-accent: "#0c0b0a"
  brass: "#cdb184"
  danger: "#f0776c"
  danger-tint: "#2a1513"
  ok: "#8fc8a0"
typography:
  display:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, Georgia, serif"
    fontSize: "clamp(52px, 8vw, 96px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, Georgia, serif"
    fontSize: "clamp(40px, 5vw, 64px)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, Georgia, serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.01em"
  label:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.2em"
  figures:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, Georgia, serif"
    fontSize: "64px"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "lnum, tnum"
rounded:
  none: "0px"
  full: "9999px"
spacing:
  gutter-sm: "16px"
  gutter: "32px"
  stack-sm: "12px"
  stack-md: "32px"
  stack-lg: "48px"
  section: "112px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 32px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    textColor: "{colors.label}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "48px"
  text-link:
    textColor: "{colors.label}"
    typography: "{typography.label}"
    height: "44px"
  field-underlined:
    textColor: "{colors.label}"
    rounded: "{rounded.none}"
    height: "56px"
  field-boxed:
    backgroundColor: "{colors.field}"
    textColor: "{colors.label}"
    rounded: "{rounded.none}"
    padding: "12px"
  size-chip:
    textColor: "{colors.label}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "48px"
  size-chip-checked:
    backgroundColor: "{colors.label}"
    textColor: "{colors.on-accent}"
  size-badge:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.brass}"
    typography: "{typography.figures}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  nav-tab:
    textColor: "{colors.label-2}"
    typography: "{typography.label}"
    height: "44px"
  nav-tab-current:
    textColor: "{colors.label}"
---

# Design System: Carrure

## Overview

**Creative North Star: "La Maison du soir"**

Carrure reads like an Italian tailoring house after closing time: a warm black room, ivory type, and one brass fitting that catches the light. The garment is photographed like a campaign, worn and cropped below the chin on a dark ground, and the computed size is set beside it the way a price tag is set in a shop window, in brass Bodoni numerals. Everything else steps back.

The system is quiet and rectangular. Didone titles at text weight carry the voice; Jost in tracked small capitals carries every instruction (navigation, buttons, field labels, spec terms). Structure comes from hairlines (#2e2b27) and tonal steps of the warm black, never from cards, shadows or rounded containers. Density is low: generous section breaks, centered titles, and photography given the full width of the grid.

The world replaced a bright Apple Store tile look, rejected by the user as cheap. That rejection is a confirmed anti-reference: no light grey tiles, no pill buttons, no rounded cards, no saturated system blue.

**Key Characteristics:**
- Warm black ground, ivory text, a single brass accent reserved for the size and for focus.
- Bodoni Moda titles at weight 400, never bold; Jost body; tracked small caps for every control.
- Square corners on every surface and control; round only for small markers (badge count, gauge knob, spinner).
- Hairline separators and tonal layering instead of elevation.
- Worn-garment photography on dark backgrounds with one shared grade, 4:5 frames.

## Colors

A near-monochrome warm palette: blacks with a brown undertone, ivory and its muted greige, and one brass.

### Primary
- **Atelier Brass** (brass): the only chromatic accent. The computed size on product photos and on the product page, the size-chosen state in the size gauge and size chips, the focus outline, the caret, link underlines (at 60% then full on hover), the cart count badge, the Roman step numerals, the selection tint (35%).

### Neutral
- **Evening Black** (canvas): page ground, header (at 85% under blur), photo veils, ink on ivory and brass fills.
- **Tile Black** (tile): image placeholders, loading skeletons, collection tile ground.
- **Raised Black** (fill): empty image fallback, the lightest tonal step.
- **Well Black** (field): background of boxed inputs, a step below canvas tone.
- **Hairline** (separator): every rule, table border, size-chip outline, gauge track.
- **Thread Grey** (control): underline of resting fields, borders of boxed inputs, hover outline on chips, dotted underline of estimated values.
- **Ivory** (label / accent): body text, titles, and the fill of the one primary button. Pure white (accent-hover) appears only as the primary button hover.
- **Greige** (label-2): secondary text, captions, field labels, tracked labels, inactive tabs.

### Status
- **Coral** (danger, danger-tint): error text and error underline; the tint as an error panel ground.
- **Sage** (ok): in-stock and added-to-cart confirmations only.

### Named Rules
**The One Brass Rule.** Brass marks the visitor's size, focus and links, nothing decorative. If a screen has brass on something that is not the size, a link underline, focus or a step numeral, remove it.

**The Ivory Button Rule.** The filled primary button is ivory on black, not brass. One filled button per view; everything else is an outline or a text link.

## Typography

**Display Font:** Bodoni Moda (with Bodoni 72, Didot, Georgia)
**Body Font:** Jost (with Futura, Century Gothic)

**Character:** the Didone and the geometric sans, the classic pairing of fashion houses. Bodoni speaks in titles and numerals; Jost does the work.

### Hierarchy
- **Display** (400, 52px mobile to 96px desktop on home, 56 to 88px on category, 44 to 56px on product, line-height 1.04): one h1 per page, centered on home and category.
- **Headline** (400, 40 to 64px; 48 to 64px on collection tiles; 32 to 40px in prompts, line-height 1.15): section titles, balanced wrap.
- **Title** (400, 17 to 28px): product names in the grid (17 / 21px), step titles (24px), review heading (28px).
- **Body** (Jost 400, 16px, line-height 1.6, 0.01em tracking): running text in greige, intros at 17 to 21px; measure held to about 34 to 44rem.
- **Label** (Jost 500, 11px, 0.2em tracking, uppercase): navigation, buttons, text links, field and spec labels, tabs. Tightens to 0.12em in the mobile header.
- **Figures** (Bodoni Moda, lining tabular numerals): prices (24px), the size on photos (17px), the size on the product page (64px), the catalog reference size (22px).

### Named Rules
**The Text-Weight Rule.** Every h1 to h3 is Bodoni at weight 400 with -0.005em tracking. Hierarchy comes from size and space, never from bold.

**The Estimated Underline Rule.** An estimated value carries a 1px dotted Thread Grey underline; a measured value does not. Never remove it to tidy the page: it is the honesty signal.

## Layout

A centered column of max 1440px with 16px gutters on mobile and 32px from 640px. Home opens on a full-height triptych (`min(100svh - 4rem, 56rem)`, min 34rem): three 1/3 photos from 768px, only the center photo on mobile, with a bottom veil (canvas to transparent by 48%) and a centered display title. Category pages open on a centered title, then a size line and underlined tabs held between two hairlines, then the product grid: 2 columns (12px / 24px gaps) to 3 columns from 1024px, with 48 to 64px vertical gaps. Product pages split 1.3fr / 1fr from 1024px with the photo sticky under the header. Sections are separated by large vertical rhythm (56 to 160px) rather than containers. Images are 4:5 throughout.

## Elevation & Depth

Flat. There is no elevation shadow anywhere. Depth comes from tonal steps of the warm black (field, canvas, tile, fill), from hairlines, and from photography under gradient veils. Two translucent layers exist: the sticky header (canvas 85% with strong blur) and the size badge on photos (canvas 80% with medium blur); both fall back to solid canvas under reduced transparency. Inset 1px box-shadows are used as borders (secondary button, size chips), never as lift.

### Named Rules
**The Hairline Rule.** Separate with a 1px Hairline rule or a tonal step. If you reach for a drop shadow, use a rule instead.

## Shapes

Square corners on every surface, image, button, field, chip and panel (0px). Full rounding is reserved for small markers: the cart count badge, the size-gauge knob and the spinner bars. Lines are 1px: field underlines, outlines, rules, focus outline (1px brass, 3px offset).

## Components

### Buttons
Rectangular, tracked small caps, confident and sparse.
- **Shape:** square (0px), 48px tall.
- **Primary:** ivory fill, black label, 32px side padding; hover to pure white; press scales to 0.98 over 150ms; disabled at 60% opacity. Full width in the add-to-cart form, with a spinner while pending.
- **Secondary:** transparent with a 1px inset ivory outline at 45%, full ivory on hover; 28px side padding.
- **Text link:** tracked caps in ivory, 44px minimum hit area, underlined in brass at 60% with a 6px offset, full brass on hover. Inline links in running text use the same brass underline at body size.

### Inputs / Fields
- **Underlined field (primary):** 56px tall, no box, a 1px Thread Grey bottom rule, 17px text. The greige label floats: it sits on the line at rest and rises and shrinks to 70% on focus or once filled. Units (cm, kg) sit at the right on the baseline.
- **Focus:** the rule turns brass and thickens to 2px; caret is brass.
- **Error:** the rule turns coral; a coral 12px message with an inline outlined-circle icon sits below. Hints are 12px greige.
- **Boxed field:** textareas, review and admin inputs, and measurement choice tiles use a 1px Thread Grey border on Well Black, square, turning brass with a 1px brass halo on focus or selection.

### Size Chips
Square 48px chips (min 56px wide) with a 1px Hairline inset outline, tabular numerals. Checked: ivory fill, black text. The computed size carries a 1px brass ring offset 3px from the chip; sold-out sizes are greige and struck through. A caption below explains the code.

### Navigation
- **Header:** sticky, 64px, three columns: category links left, the spaced Bodoni wordmark CARRURE center (22px, 0.28em; a single "C" on mobile), account and cart right. Links are tracked caps at 75% ivory, full on hover, 44px targets. Icons are 1.2px-stroke outline SVG.
- **Underlined tabs:** tracked caps in greige; the current page turns ivory with a 1px brass bottom rule.
- **Footer:** a top hairline, the wordmark at 28px, greige 12px text and tracked-caps legal links.

### Size Badge (signature)
A rectangle pinned to the bottom-left corner of every product photo: translucent canvas with blur, a 10px tracked "Votre taille" label (hidden on mobile) and the size in 17px brass figures. Out of stock: greige and struck through. The size reads before the product name.

### Size Tape (signature)
A tailor's tape gauge: a 2px Hairline track filled in brass up to the chest measurement (brass at 45% when estimated), a 16px round brass knob ringed in canvas, shirt and suit size bands above and below. The chosen band is brass with black text; the neighbouring size is outlined in brass.

### Collection Tile
Full-bleed 4:5 photo with a bottom veil, centered headline and a tracked-caps "Découvrir" link with a brass underline. Photos ease to 1.03 scale over 900 to 1200ms on hover, only on hover-capable devices and never under reduced motion.

## Do's and Don'ts

### Do:
- **Do** keep the ground warm black (canvas) and text ivory (label); secondary text greige (label-2).
- **Do** reserve brass for the visitor's size, focus, link underlines and step numerals.
- **Do** set every h1 to h3 in Bodoni Moda at weight 400; set every price and size in lining tabular Bodoni figures.
- **Do** set navigation, buttons, field and spec labels in 11px Jost 500, 0.2em tracking, uppercase.
- **Do** keep every corner square; round only badge counts, the gauge knob and the spinner.
- **Do** separate content with 1px hairlines and tonal steps; keep photos 4:5, worn, dark-ground, cropped below the chin, in the shared grade.
- **Do** mark estimated values with the dotted underline and keep 44px minimum hit areas on links.

### Don't:
- **Don't** return to the Apple Store look: no light grey tiles, no pill or rounded buttons, no rounded cards, no system blue.
- **Don't** use bold Bodoni or a second accent color.
- **Don't** add drop shadows for elevation.
- **Don't** fill a button in brass or use more than one filled button per view.
- **Don't** use text glyphs as icons; draw icons as 1.2px-stroke outline SVG.
- **Don't** place a tracked-caps label above a title as decoration; tracked caps label controls and data.
