# Cyber — Brand Assets

Official brand package for the Cyber storefront. All files are plain SVG (except the
favicon raster set) and can be used on the web, in print, or in design tools.

Open `preview.html` in a browser (or serve this folder) to review every asset on
light, dark, vintage, and retro backgrounds.

## The mark: "Nova"

The primary symbol is an **octagonal letter "C"** — geometric, futuristic, drawn with
45° corners — with a four-point **spark** floating in its opening. It reads as both the
first letter of the brand and a "gateway / spark of discovery" for the shopping
experience. It pairs with the existing custom lowercase **cyber** wordmark.

## Concepts in this package

| # | Concept | Idea | Files |
|---|---|---|---|
| 1 | **Nova** (primary) | Octagonal C + spark — abstract monogram | `concept-1-nova/` |
| 2 | **Portal** | Hexagonal gate with a forward chevron — "dive into the future" | `concept-2-portal/` |
| 3 | **Cart** | Angular shopping cart with circuit node — commerce + tech | `concept-3-cart/` |

Concept 1 is the official brand mark and is what the application uses (header lockup,
footer mark, favicon).

## File organization

```
branding/
├── README.md                          ← this file
├── preview.html                       ← visual review sheet for all assets
├── concept-1-nova/
│   ├── cyber-logo-concept1-icon.svg                 (gradient, 64×64)
│   ├── cyber-logo-concept1-icon-mono-dark.svg       (#0F1115 — light backgrounds)
│   ├── cyber-logo-concept1-icon-mono-light.svg      (#FFFFFF — dark backgrounds)
│   ├── cyber-logo-concept1-icon-gold.svg            (vintage/light theme accent)
│   ├── cyber-logo-concept1-horizontal.svg           (mark + wordmark, 48 tall)
│   ├── cyber-logo-concept1-horizontal-compact.svg   (matches the site header, 24 tall)
│   ├── cyber-logo-concept1-horizontal-mono-*.svg    (mono lockups)
│   ├── cyber-logo-concept1-vertical.svg             (stacked lockup)
│   ├── cyber-logo-concept1-wordmark.svg             (text only)
│   └── cyber-logo-concept1-wordmark-mono-light.svg
├── concept-2-portal/                  (icon + lockup + mono variants)
└── concept-3-cart/                    (icon + lockup + mono variants)
```

The application consumes the brand through React components in
`src/shared/ui/brand/` (`CyberMark`, `CyberWordmark`, `CyberLogo`) which render in
`currentColor`, so the logo automatically adapts to all four app themes
(light / dark / vintage / retro).

## Color specifications

| Role | Hex |
|---|---|
| Primary gradient start (blue) | `#3B82F6` |
| Primary gradient end (cyan) | `#22D3EE` |
| Monochrome dark (for light bg) | `#0F1115` |
| Monochrome light (for dark bg) | `#FFFFFF` |
| Gold variant (light/vintage themes) | `#C6A75E` → `#B8964F` |

Use the gradient version wherever color is available. Use monochrome versions for
one-color print, embossing, favicons at tiny sizes if the gradient ever muddies, or
UI chrome that must inherit the current text color.

## Clear space and minimum sizes

- **Clear space:** keep at least half the mark's height free of text and other
  elements on all sides.
- **Digital minimums:** icon 16 px (favicon), lockup 88 px wide.
- **Print minimums:** icon 6 mm, lockup 25 mm wide.

## Usage by context

- **Site header:** `CyberLogo` (compact lockup, equal-height mark + wordmark) in the
  home pill — already integrated.
- **Footer:** `CyberMark` next to the store name — already integrated.
- **Favicon / app icon:** `public/brand/cyber-icon.svg` (+ PNG sizes and
  `public/favicon.ico`) wired through the layout `metadata.icons`.
- **Social/OG, print, merch:** use files from `concept-1-nova/` as needed.

## Incorrect usage

- Don't stretch, distort, rotate, or skew any asset.
- Don't recolor outside the palette above.
- Don't add shadows, glows, outlines, or other effects.
- Don't place the gradient version on busy photography without clear space.

## Web implementation

```jsx
import { CyberMark, CyberWordmark, CyberLogo } from "@/shared/ui/brand";

<CyberMark className="h-6 w-auto" />          {/* color inherits via currentColor */}
<CyberWordmark className="h-6 w-auto" />
<CyberLogo className="h-6 w-auto text-text" /> {/* compact lockup */}
```

Plain HTML:

```html
<img src="/brand/cyber-icon.svg" alt="Cyber" height="24" />
```

## Exporting to PNG

Any SVG here can be rasterized with browser tooling (canvas), Inkscape
(`inkscape logo.svg --export-png=logo.png --export-width=1000`), or ImageMagick
(`convert -background none logo.svg logo.png`). The favicon PNGs in
`public/brand/` were produced this way; `public/favicon.ico` packs 16/32/48 px.

## Provenance

The wordmark was the original Cyber storefront logotype; the Nova mark, lockups,
color system, favicon set, and this documentation were added as the unified brand
pass. License: same as the repository (MIT).
