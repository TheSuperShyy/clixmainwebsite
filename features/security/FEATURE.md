# Feature: Built for enterprise, secure by design

| | |
|---|---|
| Slug | `security` |
| Page(s) | home |
| Order on page | 7 — after `by-the-numbers`, before `footer` |
| Status | `review` |
| Reference | the 2026-08-02 capture, `docs/reference/target/` |
| Original Framer name | `Security` (`.framer-1nzz2sb`, `id="security"`) |
| Component | `src/components/sections/Security.tsx` · `public/badges/` (5 SVGs) |

## Purpose

The one dark section below the hero: a centred headline over a row of five compliance
badges in a bordered grid — SOC 2, CCPA, ISO 27001, GDPR, EU AI Act.

Carries `id="security"`, which the nav's `Security` link presumably targets.

---

## Measured spec

> Extracted from the frozen capture. Gating classes: `hidden-1eq4joi` = ≥1600 ·
> `hidden-l1t773` = 1200–1599.98 · `hidden-11hyp1n` = 810–1199.98 · `hidden-9nhpe8` =
> ≤809.98, each a bare `display:none!important`.

### Layout

| Property | XL 1600 | Desktop 1440 | Tablet 1024 | Phone 390 |
|---|---|---|---|---|
| Section padding | `164px 40px` | `164px 40px` | `164px 40px` | `96px 16px` |
| Section background | `ink` `#151515` | same | same | same |
| Width Container | `max-width:1280px`, gap `164px` | same | gap `128px` | gap `80px` |
| Container gap (title ↔ grid) | `64px` | `64px` | `64px` | `64px` |
| Headline measure | `max-width:400px`, centred | same | same | same |
| Grid columns | `repeat(5, minmax(50px,1fr))` | same | `repeat(2, …)` | `repeat(1, …)` |
| Grid gap | `0` | `0` | `0` | `0` |
| Rendered track width | 256px | 256px | 472px | 358px |
| Cell height | `240px` | `240px` | `240px` | `aspect-ratio:1.40909`, `min-height:220px` → 254px |
| Graphic frame | `104×104`, `overflow:hidden` | same | same | same |
| Label | `position:absolute; bottom:16px; left:50%; translateX(-50%)` | same | same | same |

`grid-template-rows: repeat(2, min-content)` with `grid-auto-rows: min-content`. At five
columns all five badges land in row 1 and the second declared row collapses to `0px`.

The Width Container's gap and the Logos row's `24px` gap are both **inert** — one child each.
Reproduced so the shared classes stay recognisable.

### The border matrix — hand-authored per cell, per tier

Cells carry `--border-*-width` custom properties. Framer paints them on an
`::after` overlay (`position:absolute; inset:0; width:100%; height:100%;
box-sizing:border-box; pointer-events:none`), **not** through the box model — which is why
the original can leave the shape open without anything reflowing.

TRBL widths as measured, verified against the render at each tier:

| Cell | ≥1200 | 810–1199.98 | ≤809.98 |
|---|---|---|---|
| SOC2 | `1 0 1 1` | `1 0 1 1` | `1 1 1 1` |
| CCPA | `1 0 1 1` | `1 1 1 1` | `0 1 1 1` |
| ISO 27001 | `1 0 1 1` | `0 0 1 1` | `0 1 0 1` |
| GDPR | `1 0 1 1` | `0 0 1 1` | `1 0 1 1` |
| EU AI Act | `1 1 1 1` | `0 1 1 1` | `1 1 1 1` |

**At ≥1200 this is exactly right**: every cell draws left/top/bottom, only the last draws
right, giving one continuous outline with four internal verticals. That is the layout in the
reference screenshot.

**At 810–1199.98 and ≤809.98 it is not.** See the open question below — the shape is left
open in both, and it is reproduced rather than corrected.

Border colour is `hairline-light` `#ffffff26` at every tier.

### Typography

| Element | Family | Size | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|---|
| Headline | ABC Arizona Mix Regular | **48px** ≥1200 · **44px** 810–1199.98 · **36px** ≤809.98 | 400 | `105%` | `-0.05em` | `paper` |
| Badge label | Inter | **12px at every tier** | **500 for GDPR and EU AI Act · 400 for the other three** | `1.3em` | `-0.02em` | `muted` `#737373` |

**There is no `<br>` in the headline.** The two-line break in the reference is produced
entirely by the `400px` measure, at all four tiers. Do not add one.

The label box is `137px` wide for four badges and **`188px` for "EU AI Act"** — the only
string long enough to need it.

### Badge artwork

Five files in `public/badges/`, all `#6D6D6D` line art. Full provenance and the extraction
notes are in [public/README.md](../../public/README.md).

| Badge | Delivery in the capture | Art box inside the 104px frame |
|---|---|---|
| SOC2 | `<use href="#svg785812565_46827">` | `inset: 0 0 auto 0`, `aspect-ratio:1` → `104×104` |
| CCPA | `<use href="#svg-1130630889_6001">` | `aspect-ratio:1.00833` → `104×103.14` |
| ISO 27001 | `<use href="#svg-229124054_6985">` | `aspect-ratio:1.00833` → `104×103.14` |
| GDPR | data-URI CSS background | flat `102×102` at `top:1 left:1` |
| EU AI Act | data-URI CSS background | flat `102×102` at `top:0 left:1` |

**Two delivery mechanisms and two label weights, split the same way** (SOC2/CCPA/ISO one
way, GDPR/EU AI Act the other). Almost certainly two authoring sessions. Both normalised to
plain files here; the label weights are copied as found.

`#6D6D6D` lives **inside the vendored SVGs**, not in any CSS rule, so it is not tokenized —
same treatment as the customer logos' white fill.

### Motion

**None.** No `data-framer-appear-id`, no transition, no `will-change`, no `:hover` or
`cursor` on any class in the subtree.

### Responsive behavior

- **≥1200:** one row of five, 256px tracks, 240px tall.
- **810–1199.98:** two columns → 3 rows (5th badge alone in row 3), 472px tracks.
- **≤809.98:** single column, cells become `aspect-ratio:1.40909` with a `220px` floor
  (254px at 390), section padding drops to `96px 16px`.

---

## Tokens used

`ink` · `paper` · `muted` · `hairline-light` · `--font-display` · `--font-sans` ·
`--container-max` `1280px`.

**No new tokens.** `hairline-light` `#ffffff26` was added for the nav in 2026-08-02 and is
exactly the border colour here.

## Documented deviations

| Property | Original | Ours | Why |
|---|---|---|---|
| Border rendering | `::after` overlay with `box-sizing:border-box` | real CSS borders | Rendered geometry is identical — the probe confirms 256×240 tracks and matching frame coordinates at every tier — because only *left* borders repeat and never double up. Real borders are simpler and match the other sections. The overlay mechanism is documented above because it explains how the original's ragged tiers survive without reflowing. |
| Heading level | `<h3>` | `<h2>` | The hero owns the h1. Purely semantic. |
| Badge delivery | 3 × `<use href>` + 2 × data-URI background | 5 × `<img src="/badges/…">` | One mechanism instead of two. Path data verbatim; the three `<use>` sources needed an `xmlns` added, which the defs block had inherited from the page root. |
| Badge `alt` | SVG marked `aria-hidden="true"`, no text alternative | `alt=""` + `aria-hidden` | Same outcome as the original, and correct: the visible 12px label directly below already names each certification, so an `alt` would double every name for a screen-reader user. |
| `ssr-variant` duplication | three DOM copies of the headline | one copy, `tablet:`/`desktop:` variants | Same reasoning as the previous three sections. |

## Acceptance checklist

- [x] Structure + measured values from the capture, all four tiers
- [x] Spacing/type/color from tokens, or deviation documented above
- [x] Geometry verified by CDP at 1600 / 1440 / 1024 / 390 — including the full 5×4 border
      matrix at every tier, all five images loading, and both label weights
- [x] All five badge SVGs validated by **rasterising** through `sharp`, not by grepping,
      per the standing rule in `public/README.md`
- [x] No horizontal overflow at any of the four widths
- [x] `npm run build` clean, `eslint src` clean
- [ ] **Contrast: the 12px labels are `3.85:1` and fail AA** — see below
- [ ] Matches reference at 1600 / 1440 / 1024 / 390 — the ≥1200 tier was compared to the
      user's screenshot of the live site and matches; the other three are verified against
      the capture's numbers only

## Open questions

- [ ] **The grid outline is left open below 1200px — reproduce or fix?** At 810–1199.98,
      GDPR (row 2, column 2) has `border-right: 0`, so row 2's right edge is missing; and
      EU AI Act (row 3, column 1) *does* have a right border, leaving a stub vertical beside
      an empty cell. At ≤809.98, GDPR again has `border-right: 0`, so that one cell's right
      edge is open in a single-column stack. Confirmed by render, not inferred.
      **This is the original's own oversight** — the overrides were written for the
      five-column case and never revisited. Reproduced verbatim, because that is the default
      for a 1:1 clone and the alternative is a silent design change. **The fix is one line
      per cell if wanted; needs the user's call.**
- [ ] **Label contrast fails AA.** `muted` `#737373` on `ink` `#151515` = **3.85:1**, and at
      12px these are unambiguously normal-size text (4.5:1 required). Inherited from the
      target, not introduced. **`#7f7f7f` — twelve steps lighter, visually near-identical —
      reaches `4.56:1`.** Third inherited contrast issue on the site; see
      `features/testimonials/FEATURE.md` for the other two. Awaiting the user's call.
      The badge marks themselves are `3.53:1`, which clears the `3:1` floor for graphics
      (WCAG 1.4.11) and is moot anyway since each is labelled in text.
- [ ] **Nothing is interactive.** No `cursor`, `:hover` or transition on any class in the
      subtree, so it is built as static content with nothing focusable — even though these
      badges are the kind of thing that often links to a trust-centre page.
- [ ] **Does the nav's `Security` link point here?** The section carries `id="security"` and
      the nav has a `Security` item; the nav's hrefs were not resolved when it was built.
      Worth wiring once the nav's link targets are settled.
