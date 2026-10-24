---
name: Carrure
description: Chemises et costumes pour homme, avec une taille calculée pour chaque article.
colors:
  canvas: "#ffffff"
  tile: "#f1f0ed"
  fill: "#e9e8e4"
  field: "#ffffff"
  separator: "#e3e2de"
  control: "#8c8b86"
  label: "#121212"
  label-2: "#5c5b57"
  accent: "#121212"
  accent-hover: "#3a3a38"
  on-accent: "#ffffff"
  link: "#121212"
  brass: "#85642c"
  danger: "#b42318"
  danger-tint: "#fdeeec"
  ok: "#1d6b3a"
typography:
  display:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, Georgia, serif"
    fontSize: "clamp(40px, 5vw, 64px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, Georgia, serif"
    fontSize: "clamp(28px, 3vw, 48px)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, Georgia, serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.005em"
  meta:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.12em"
  wordmark:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, Georgia, serif"
    fontSize: "30px"
    fontWeight: 400
    letterSpacing: "0.24em"
  figures:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "lnum, tnum"
rounded:
  none: "0px"
  full: "9999px"
spacing:
  gutter-sm: "16px"
  gutter: "32px"
  grid-gap-sm: "12px"
  grid-gap: "20px"
  stack-sm: "12px"
  stack-md: "32px"
  stack-lg: "40px"
  section-sm: "96px"
  section: "128px"
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
  button-secondary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
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
    padding: "6px 10px"
  size-panel:
    backgroundColor: "{colors.tile}"
    rounded: "{rounded.none}"
    padding: "24px"
  announcement-strip:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    padding: "8px 16px"
  nav-tab:
    textColor: "{colors.label-2}"
    typography: "{typography.label}"
    height: "44px"
  nav-tab-current:
    textColor: "{colors.label}"
  footer:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
---

# Design System: Carrure

## Overview

**Creative North Star: "The Department Store Floor"**

Carrure reads like the menswear floor of a large online luxury department store: a white page, black type, and the merchandise laid out on one studio grey, the way a store shoots everything against the same backdrop. The layout follows the general grammar of Mr Porter (black announcement strip, centered spaced wordmark over a row of departments, centered titles, dense product grids with tracked-caps names), taken as layout only: never its name, logo, copy or photographs. What is Carrure's own is the visitor's size, set in dark brass on every photo and on every product page.

The system is quiet, square and editorial. Bodoni Moda at text weight carries the wordmark and every title; Jost carries everything else, with 12px tracked capitals for navigation, buttons, product names and data labels. Structure comes from white space, 1px rules and the grey tile under photos and panels, never from shadows or rounded containers. Black frames the page top and bottom (announcement strip, footer) and fills the one primary button.

Photography is Pexels imagery of worn garments, cut out and composited onto the studio grey with uniform framing, 4:5 throughout. The world replaced two rejected looks: a bright Apple Store tile system ("cheap") and a dark Italian tailoring house. Neither returns.

**Key Characteristics:**
- White page, near-black text, studio grey under every photo and size panel.
- One chromatic accent, dark brass, reserved for the visitor's size.
- Bodoni Moda at weight 400 for wordmark and h1 to h3; Jost for everything else; 12px tracked caps for controls and product names.
- Black announcement strip, black footer, black filled primary button.
- Square corners, 1px rules, no elevation.
- Cut-out garment photos on one grey, 4:5, same framing.

## Colors

A neutral warm-white palette with black ink and a single dark brass.

### Primary
- **Dark Brass** (brass): the visitor's size and nothing else. The size on the badge of every product photo, the size on the product page and the category size line, the ring around the computed size chip, the filled band and knob of the size tape, the input caret, the selection tint (22%).

### Neutral
- **Gallery White** (canvas, field): page ground, the size badge ground, the ground of boxed inputs, the ring around the tape knob.
- **Studio Grey** (tile): the backdrop composited under every product photo, the hero band, the "how it works" band, size panels, loading placeholders.
- **Deep Studio Grey** (fill): empty image fallback.
- **Rule Grey** (separator): every 1px rule (header base, section heads, disclosures, size line), resting size-chip outline, tape track.
- **Thread Grey** (control): resting underline of fields, borders of boxed inputs and choice tiles, chip hover outline, dotted underline of estimated values.
- **Ink** (label, accent, link): body text, titles, the announcement strip, the footer, the primary button, the checked size chip, the focus outline.
- **Graphite** (accent-hover): primary button hover only.
- **Stone** (label-2): secondary text, meta lines, breadcrumbs, captions, inactive tabs, placeholders.
- **White on Ink** (on-accent): text on the strip, footer (at 70% for running text), primary button and filled chips.

### Status
- **Signal Red** (danger, danger-tint): error text, error underline, destructive buttons; the tint as an error panel ground and destructive hover.
- **Ledger Green** (ok): in-stock and added-to-cart confirmations only.

### Named Rules
**The Size-Only Brass Rule.** Brass marks the visitor's size and nothing else: no brass buttons, links, borders, icons or decoration. If brass appears on something that is not the size, remove it.

**The Black Frame Rule.** Black is a frame and an action: the announcement strip, the footer, the primary button, the checked chip. It never fills a content panel; panels sit on studio grey.

**The One Grey Rule.** Every product photo sits on the same studio grey. A photo on another ground, or a raw unprocessed photo, breaks the floor.

## Typography

**Display Font:** Bodoni Moda (with Bodoni 72, Didot, Georgia)
**Body Font:** Jost (with Futura, Century Gothic)

**Character:** the Didone and the geometric sans of fashion retail. Bodoni signs the house and names the sections; Jost does all the work, including figures.

### Hierarchy
- **Wordmark** (Bodoni 400, uppercase, 0.24em tracking; 24px mobile, 30px desktop header, 28px footer): CARRURE, centered in the header and set left in the footer.
- **Display** (Bodoni 400, line-height 1.04): one h1 per page. 44 to 64px on home, 40 to 56px on category pages, 36 to 48px on account, cart and checkout, 36 to 44px on auth, 30 to 36px on the product page.
- **Headline** (Bodoni 400, line-height 1.15): section titles. 28 to 36px for home rows and prompts, 28 to 34px under collection tiles, 34 to 48px for the grey "how it works" band.
- **Title** (Bodoni 400, 21 to 26px): fieldset legends, outfit cards, review prompt, auth reassurance points.
- **Body** (Jost 400, 15px, line-height 1.6, 0.005em tracking): running text, secondary text in Stone; intros at 17px; measure held to 36 to 40rem.
- **Meta** (Jost 400, 13px): breadcrumbs, product color and material, footer text, the category size line.
- **Label** (Jost 500, 12px, 0.12em tracking, uppercase): header navigation, buttons, text links, product names under photos, tabs, disclosure summaries, legends and the "Votre taille" panel label, footer links.
- **Figures** (Jost, lining tabular numerals): prices (14px in grids, 18px on the product page), the size on photos (14px semibold brass), the size on the product page (44px medium brass), measurement readings (28 to 32px) and computed sizes (56px) in ink.

### Named Rules
**The Text-Weight Rule.** Every h1 to h3 in Bodoni is weight 400 with -0.005em tracking and balanced wrap. Hierarchy comes from size and space, never from bold.

**The Caps-Label Rule.** Tracked caps name controls, products and data. They are never placed above a title as decoration.

**The Estimated Underline Rule.** An estimated value carries a 1px dotted Thread Grey underline; a measured value does not. It is the honesty signal; never remove it to tidy a page.

## Layout

A centered container of max 1440px with 16px gutters on mobile and 32px from 640px; account and auth pages narrow to 1180px, forms to 460px. The header stack is a black announcement strip (12px centered line), then a sticky white header: a 64px (72px from 640px) three-column row with "Trouver ma taille" left, the wordmark centered, account and cart right, and a 44px centered row of departments below, closed by a 1px rule.

Home opens on a studio-grey band of three cut-out photos side by side (one, the center look, on mobile), then a centered Bodoni title, intro and actions below the photos, never over them. Product rows follow: a headline and "Tout voir" link over a 1px rule, then four tiles (2 columns on mobile). Category pages open on a breadcrumb, a centered title and tagline, then the size line and underlined tabs held between two rules, then the grid: 2 columns, 3 from 768px, 4 from 1280px, with 12px / 20px column gaps and 40px / 56px row gaps. Product pages split about 1.35fr / 1fr from 1024px, the photo sticky under the header, details capped at 30rem.

Sections are separated by vertical rhythm (96px mobile, 128px desktop) and full-width grey bands rather than containers. Every photo is 4:5 (collection tiles go square from 768px).

## Elevation & Depth

Flat. Depth comes only from the studio grey under photos and panels, 1px rules, and the black strip and footer that bracket the page. The sticky header is white at 95% with a medium backdrop blur, falling back to solid white under reduced transparency. Inset 1px box-shadows serve as borders (secondary button, size chips, focus on boxed inputs), never as lift.

### Named Rules
**The Rule-Not-Shadow Rule.** Separate with a 1px rule, a grey band or white space. If you reach for a drop shadow, use a rule instead.

## Shapes

Square corners (0px) on every surface, photo, button, field, chip, badge and panel. Full rounding is reserved for small markers: the cart count, the size-tape knob, the spinner bars. Lines are 1px everywhere: rules, field underlines, outlines, the focus outline (1px ink, 3px offset). Icons are outline SVG at a 1.2 to 1.3px stroke; chevrons and the disclosure plus are drawn, not typed.

## Components

### Buttons
Rectangular, tracked caps, one decisive black.
- **Shape:** square (0px), 48px tall.
- **Primary:** ink fill, white label, 32px side padding; hover to Graphite; press scales to 0.98 over 150ms; disabled at 50% opacity. Full width in the add-to-cart form, with a spinner while pending. One per view.
- **Secondary:** transparent with a 1px inset ink outline, 28px side padding; hover fills ink with white text.
- **Text link:** tracked caps in ink, 44px minimum hit area, underlined with ink at 40% and a 6px offset, full ink on hover. Inline links in running text use the same underline at body size.
- **Destructive:** a 1px red outline with red caps, hover to the red tint; the confirm step fills red.

### Inputs / Fields
- **Underlined field (primary):** 56px tall, no box, a 1px Thread Grey bottom rule, 17px text. The Stone label floats: it sits on the line at rest and rises and shrinks to 70% on focus or once filled. Units (cm, kg, ans) sit right on the baseline.
- **Focus:** the rule turns ink and thickens to 2px; caret is brass.
- **Error:** the rule turns red; a 12px red message with an outlined-circle icon below. Hints are 12px Stone.
- **Boxed field and choice tile:** selects, textareas and fit choices use a 1px Thread Grey border on white, square; focus or selection turns the border ink with a 1px ink halo.

### Size Chips
Square 48px chips (min 56px wide) with a 1px Rule Grey inset outline and tabular numerals, Thread Grey on hover. Checked: ink fill, white text. The computed size carries a 1px brass ring offset 3px from the chip; sold-out sizes are Stone, struck through, outline removed. A 12px caption below explains the code.

### Navigation
- **Announcement strip:** full-width ink band, one centered 12px white line.
- **Header:** described in Layout. Links are tracked caps in ink, lightening to Stone on hover, 44px targets; account collapses to its icon on mobile.
- **Breadcrumb:** 13px Stone with "/" separators, current page in ink.
- **Underlined tabs:** tracked caps in Stone; the current page turns ink with a 1px ink bottom rule.
- **Footer:** ink band, the wordmark at 28px, 13px white text at 70%, tracked-caps legal links brightening to full white.

### Product Tile (signature)
A 4:5 cut-out photo on studio grey, then the product name in tracked caps, a 13px Stone color and material line, and the price in figures. Photos ease to 1.03 scale over 700ms on hover, only on hover-capable devices and never under reduced motion.

### Size Badge (signature)
A white rectangle pinned to the top-left corner of every product photo when the visitor's measurements are known: an 11px Stone "Votre taille" label (screen-reader only on mobile) and the size in 14px semibold brass figures. Out of stock: "Épuisé en" and the size in Stone, struck through. The size reads before the product name.

### Size Panel
A studio-grey block on the product page: a tracked-caps "Votre taille" label, the size in 44px brass figures with the estimated underline, the confidence line in Stone, and a text link to edit measurements. Without measurements it holds a short prompt and a secondary button.

### Size Tape
A tailor's tape gauge on studio grey: a 2px Rule Grey track filled in brass up to the chest measurement (brass at 45% when estimated), a 16px round brass knob ringed in white, shirt and suit size bands above and below. The chosen band is filled brass with white text; the neighbouring size is outlined in brass. The knob moves on a critically damped spring and jumps directly under reduced motion.

### Disclosure
Native details rows between 1px rules: a 56px tracked-caps summary with a drawn plus whose vertical stroke fades on open.

## Do's and Don'ts

### Do:
- **Do** keep the page white (canvas), text ink (label), secondary text Stone (label-2), and every photo on studio grey (tile).
- **Do** reserve brass for the visitor's size: badge, panel, size line, chip ring, size tape.
- **Do** set the wordmark and every h1 to h3 in Bodoni Moda at weight 400; set prices and sizes in Jost lining tabular figures.
- **Do** set navigation, buttons, product names and data labels in 12px Jost 500, 0.12em tracking, uppercase.
- **Do** bracket the page with the black announcement strip and the black footer; fill only the primary action in black.
- **Do** keep every corner square and every line 1px; round only the cart count, the tape knob and the spinner.
- **Do** cut out photos and composite them on the studio grey with the same framing, 4:5.
- **Do** mark estimated values with the dotted underline and keep 44px minimum hit areas on links.

### Don't:
- **Don't** return to the Apple Store look: no pill or rounded buttons, no rounded cards, no system blue.
- **Don't** return to the dark house: no black page ground, no ivory text, no photo veils.
- **Don't** fill a button, link or border in brass, or add a second accent color.
- **Don't** use bold Bodoni or set body text in Bodoni.
- **Don't** add drop shadows for elevation.
- **Don't** use text glyphs as icons; draw icons as 1.2 to 1.3px-stroke outline SVG.
- **Don't** place a tracked-caps label above a title as decoration.
- **Don't** use Mr Porter's name, logo, copy or photographs.
