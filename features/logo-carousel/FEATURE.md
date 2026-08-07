# Feature: Logo Carousel

| | |
|---|---|
| Slug | `logo-carousel` |
| Page(s) | home |
| Order on page | **inside the hero**, not after it — see below |
| Status | `review` |
| Reference | the 2026-08-02 capture, `docs/reference/target/` |
| Original Framer name | `Logo Carousel` (`.framer-cdaiag`) |
| Component | `src/components/sections/LogoCarousel.tsx`, rendered by `Hero.tsx` |

## Purpose

An infinite marquee of 14 customer logos across the bottom of the hero, over a progressive
blur that lifts them off the video.

---

## Measured spec

### It is not a sibling section

`.framer-cdaiag` is `position:absolute; bottom:0; left:0; right:0; height:248px; z-index:1`
**inside `<section id="hero">`**. `docs/SECTIONS.md` listed it as section #3 following the
hero; that was an inventory guess from the visual and is wrong. Verified by checking the
element's byte offset falls between the hero `<section>`'s open and close tags.

### Layout
| Property | XL 1600 | Desktop 1440 | Tablet 1024 | Phone 390 |
|---|---|---|---|---|
| Carousel block | `absolute bottom:0`, `height:248px`, `z-index:1`, `overflow:clip` | same | same | same |
| Progressive blur | `absolute inset:0`, `z-index:0` | same | same | `z-index:1` |
| Logo row (`Customers`) | `absolute bottom:32px`, `height:36px`, `z-index:1` | same | same | same |
| Row outer padding | `0 16px` | `0 16px` | `0 16px` | `0 16px` |
| Marquee padding | `0 12px` | same | same | same |
| Track height | `36px` | `36px` | **`40px`** container | `36px` |
| Item gap | `56px` | `56px` | `56px` | `56px` |

### Assets — 14 logos, measured box per logo

> ## ⚠️ THE CONTENT OF THIS ROW IS A DELIBERATE DEPARTURE (2026-08-07)
>
> **The table below is the TARGET's spec, kept as the record of what rogo does. It is no
> longer what this repo renders.** Every *mechanism* in this file — geometry, gap, blur,
> mask, cycle maths, speed, tier behaviour — still applies verbatim and is still measured
> from the capture. Only the items inside the `<ul>` changed.
>
> rogo's fourteen are **customers** (Jefferies, Lazard, Rothschild, Raymond James, Truist…).
> Under a clix wordmark that is a false claim, not a style choice, so it went the same way as
> the Series D banner and the compliance seals. The row now carries **clix's own stack** —
> 13 tool lockups (glyph + name), 12 of them lifted verbatim from the live company site's
> own stack marquee. Rationale, the three treatments considered, the licensing position and
> the two tools with no available mark are all in
> [CONTEXT.md](CONTEXT.md) under 2026-08-07.
>
> Measured after the swap: **13 items, cycle 2243px, item boxes 40–188 × 24px** — inside the
> target's own 45–226 × 20–36 band, which is why the strip still reads as the same design.

Document order, which is also render order:

| # | Logo | w × h | | # | Logo | w × h |
|---|---|---|---|---|---|---|
| 1 | Jefferies | 113 × 26 | | 8 | Raymond James | 226 × 20 |
| 2 | Lazard | 117 × 24 | | 9 | Truist | 137 × 32 |
| 3 | Tiger Global | 186 × 20 | | 10 | Leerink | 116 × 32 |
| 4 | Moelis | 103 × 26 | | 11 | Canaccord | 45 × 36 |
| 5 | Nomura | 122 × 22 | | 12 | Baird | 84 × 24 |
| 6 | Rothschild | 207 × 34 | | 13 | HCW | 104 × 52 |
| 7 | BNP Paribas | 163 × 34 | | 14 | Arma Partners | 155 × 26 |

One cycle = Σ widths (1878px) + 14 × 56px gap = **2662px**.

All 14 are vendored white-fill SVGs in `public/logos/`, extracted from the capture.

> **HCW is 52px tall in a 36px row that has `overflow:hidden`.** It genuinely overflows and
> is clipped in the original too. Not a bug here — do not "fix" it by shrinking the logo.

### Color & surface
| Element | Property | Value |
|---|---|---|
| Marquee | mask-image | `linear-gradient(to right, transparent 0%, black 12.5%, black 87.5%, transparent 100%)` — edge fade |
| Progressive blur | 8 layers | `backdrop-filter` `0.1171875 × 2ⁱ` px for i = 0..7 → `0.117, 0.234, 0.469, 0.938, 1.875, 3.75, 7.5, 15` |
| Progressive blur | layer i mask | `linear-gradient(to bottom, transparent i·12.5%, black (i+1)·12.5%, black (i+2)·12.5%, transparent (i+3)·12.5%)`, stops >100% dropped |

The last two layers therefore have three and two stops rather than four.

### Motion
| What animates | Trigger | Duration | Easing |
|---|---|---|---|
| Track `x` | autoplay, infinite | `cycle / speed` | `none` (linear) |
| Marquee opacity | after measurement | `.5s` | `ease-rogo` |

Library: **`gsap`** — matches the registry's marquee trigger. Reduced-motion fallback: the
tween is never built (`gsap.matchMedia`), so the row renders static.

### Responsive behavior
- **≥1200:** row container `height:auto`.
- **810–1199.98:** row container `height:40px`.
- **≤809.98:** progressive blur moves to `z-index:1`.

---

## Tokens used

`--ease-rogo`. No colour tokens — the logos are white SVGs and every layer is a blur or a
mask. Gap `56px` and the `12px`/`16px` paddings are one-offs, not on the 4pt scale.

## Documented deviations

| Property | Original | Ours | Why |
|---|---|---|---|
| `aria-hidden` on items | **all 28** `<li>` are `aria-hidden="true"` | only the duplicate 14 | The original leaves the customer list completely unreadable to assistive tech. Exposing the first pass with real `alt` costs nothing visually and is the same class of a11y floor as the hero's reduced-motion handling. |
| Marquee speed | not observable | `50 px/s` (~53s per cycle) | A static capture cannot encode a rate. **Estimated — needs checking against the live site.** |
| Loop technique | Framer Ticker, JS `translateX` | GSAP `x: -cycle`, measured | See CONTEXT — `xPercent: -50` is subtly wrong when the track has a `gap`. |

---

## Acceptance checklist

- [x] Structure + measured values from the capture, all four tiers
- [x] Item boxes sit inside the target's measured band (40–188 × 24 vs 45–226 × 20–36)
- [x] `prefers-reduced-motion` respected — tween never built
- [x] Cycle measured only after `document.fonts.ready` — text items are font-width dependent
- [x] Each item's name is real text; glyph beside it `aria-hidden`; duplicate pass hidden
- [x] `npm run build` clean
- [x] Rendered and inspected at 1600 / 1440 / 1024 / 390
- [ ] Motion timing matches the original — **speed is estimated**
- [ ] **Tool list confirmed with the user** — ElevenLabs is not on the live site's own list
- [ ] ~~Matches reference at every tier~~ — **no longer applicable**, the row deliberately
      carries different content (see the departure note above)
- [x] `CONTEXT.md` (feature + global) updated, `SECTIONS.md` status set

## Open questions

- [ ] **Marquee speed and direction.** Currently 50 px/s leftward. Both need confirming
      against the live site; direction is inferred from `translateX(-0px)` in the capture.
- [ ] Does the original **pause on hover**? Not observable.
- [ ] The marquee `<section>` ships `opacity:0` inline and is faded in by JS. Ours does the
      same after measuring, but the original's fade duration/easing is unknown.
