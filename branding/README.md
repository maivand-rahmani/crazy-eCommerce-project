# CrazyCart — Brand Identity

> **Shop Crazy. Live Happy.**

The CrazyCart brand system: a bold geometric **orange "C" that reads as a shopping
cart** — three speed bars (plus a short dash) trailing on the left, two wheels below.
The wordmark pairs a neutral "Crazy" with an accent-orange "Cart" in Poppins Bold.

## Quick facts

| | |
|---|---|
| Primary orange | `#FF6A00` |
| Accent orange (gradient light end / highlights) | `#FF8A3D` |
| Dark | `#0B0B0F` (text / backgrounds) |
| Light | `#F7F7F7` (backgrounds) |
| Wordmark | Poppins **Bold** (shipped as vector outlines — no font file needed) |
| Tagline | Poppins Medium, tracking `0.30em` |
| Clear space | `2×` the wheel height on every side of the mark |
| Favicon / app icon | rounded square (radius ≈ 23%), mark ≈ 46% of the tile |

## Files

```
branding/logos/
├── crazycart-mark.svg            # the mark alone (orange gradient, transparent bg)
├── crazycart-logo-dark.svg       # horizontal lockup: mark + wordmark + tagline — for dark backgrounds
├── crazycart-logo-light.svg      # horizontal lockup — for light backgrounds
├── crazycart-appicon-orange.svg  # app icon: orange gradient tile + white mark
├── crazycart-appicon-dark.svg    # app icon: near-black tile + orange mark
├── crazycart-appicon-light.svg   # app icon: light tile + orange mark
└── crazycart-appicon-mono.svg    # app icon: monochrome fallback
```

The site consumes copies from `public/brand/` (`crazycart-icon.svg`, raster PNGs
16–512, and `public/favicon.ico`).

React components live in `src/shared/ui/brand/`:

| Component | Use |
|---|---|
| `CrazyCartMark` | the symbol alone (gradient / solid / mono variants) |
| `CrazyCartWordmark`, `CrazyCartTagline` | exact typography as outlines |
| `CrazyCartLogo` | mark + wordmark lockup (horizontal / vertical) |
| `CrazyCartAppIcon` | rounded-square icon component (4 variants) |
| `CrazyCartBrandMark` | symbol with `mode="2d" \| "3d"` switch |
| `CrazyCartLogo3D` | the interactive three.js mark (import directly — lazy chunk) |

`geometry.js` holds the approved mark geometry (single source of truth for the 2D
paths **and** the 3D shapes); `wordmark.js` holds the outlined wordmark/tagline.

## Where 2D vs 3D branding is used

**3D (WebGL) — selective, hero moments only:**

- the homepage brand showcase (`BrandShowcase`) — the one interactive WebGL surface
- future: a dedicated branded loading screen, about/brand section, large empty
  states, login brand panel, special promo sections — *on request, one at a time*

**2D (SVG) — everything else:**

- header + footer lockups, mobile navigation, admin surfaces
- metadata/icons: favicon, app icons, link previews
- loading skeletons, empty states, documents, OG/social images

Rules of thumb:

1. Never put a WebGL canvas in the header, footer, navigation, or more than one
   section per page.
2. The 3D mark always has a static 2D SVG fallback — for no-WebGL devices, when
   `prefers-reduced-motion: reduce` is set, and while the three.js chunk loads.
3. The wordmark is never extruded "everywhere": text stays as crisp 2D outlines
   (or real text) next to the 3D symbol. A shallow 3D wordmark is reserved for
   special hero scenes if ever needed.

## 3D specifics (approved behavior)

- Real extruded geometry from the approved silhouette (no primitive remixing),
  subtle bevels, glossy/plastic-metal `MeshPhysicalMaterial` blend.
- Implemented with **three.js directly** (the brief's "preferably R3F" is not
  possible in this stack: R3F v8 conflicts with Next 15 + React 18 — see the
  note in `CrazyCartLogo3D.jsx`; the scene is identical and the bundle is smaller).
- Idle: slow float + tiny rotation (±4° Y / ±2° X). Pointer: soft parallax
  (≤ ±8°). Hover: lift + highlight intensity + a 150–250 ms speed-bar fan-out.
  Click/tap: <600 ms compress → bars back → forward → spring return.
- Controlled studio lighting (procedural lightformers — no network fetches).
- Perf: lazy-loaded chunk (`ssr: false`), animation paused outside the viewport,
  capped DPR, reduced quality on low-power presets, a single shared render loop,
  resource disposal on unmount, static SVG fallback.

## Accessibility

- The 3D canvas is `role="img"` with an `aria-label`; semantic branding never
  depends on WebGL.
- `prefers-reduced-motion` is respected (falls back to the static mark).
- Brand colors on dark/light surfaces meet contrast guidance in the app's four
  themes via `currentColor` for the wordmark and fixed brand orange for "Cart".

## Color usage

- **Orange gradient** (`#FF8A3D → #FF6A00`): the mark and "Cart" — on both light
  and dark backgrounds.
- **Neutral foreground**: "Crazy" and body copy — `currentColor` in components
  (white on dark, near-black `#0B0B0F` on light).
- **Tagline**: foreground at ~68–85% opacity.
