# Feature: Security page (`/security`, clone of `rogo.com/security`)

| | |
|---|---|
| **Route** | `/security` |
| **Status** | `review` |
| **Reference** | `docs/reference/target/rogo-security-2026-08-12.{html,css}` (374 KB HTML, **five** inline `<style>` blocks, 150 KB CSS) + a live CDP probe the same day |
| **Screenshots** | `features/security-page/assets/rogo-security-<tier>-NN.png` (4/4/4/6 strips) |
| **Original Framer names** | `Hero` (`#first`) · `Benefits` (`#features`) · `Compliance` (`#features-1`) · `Reiteration` (inside `Footer`) |
| **Components** | `src/components/security/{SecurityHero,SecurityBenefits,SecurityCompliance,SecurityCore}.tsx` |

## Purpose

The security page. Design 1:1 with the target; **every string is clix's own from the first
commit** — the `/company` model. No borrowed asset, no third-party trademark, no certification
clix does not hold ever enters the repo, so there is nothing to strip later and **no `robots`
guard is needed**.

---

## ⚠️ Read first — six traps this page sets

**1. `#features-1` is ONE band holding TWO rows.** "Security At Our Core" has no
`data-framer-name` of its own and looks like a fourth sibling. It is not: `#features-1`'s two
direct children are `Container .framer-rswx4m` (heading + badge grid, column, gap 64) and
`Container .framer-1bz2s3e` (the two-column core row, **row**, gap 64), separated by the band's
own `gap: 120px`. Probed on the live page, not inferred. Same trap `/product` hit twice —
**byte offsets give document order, never nesting.**

**2. The hero's height is `70vh`, not a content sum.** `.framer-16jfo2a` declares
`height: 70vh` at ≥810 and `height: min-content` at ≤809.98. At a 900px viewport that is
630px, and 198 + 302 + 80 = 580 does **not** close it. Any harness must fix the viewport
height at 900 on both sides or this value is meaningless.

**3. The grid rules are a dashed `::after` overlay, not borders.** Every cell computes
`border-width: 0px` / `border-style: none` and carries `data-border="true"`; the visible rule is
`::after { inset: 0; border: 1px dashed rgba(255,255,255,0.15) }` with a **per-cell, per-tier
width matrix**. A real `border` would take layout space and move the 104px mark — the same
fault `/product` Block 3 hit.

**4. The outline is deliberately ragged below 1200 and the matrix is not derivable.** At 390,
cell 3 draws `0/1/0/1` — no top *and* no bottom — while cell 4 draws all four. Reproduced
verbatim; see the border matrix below. Same phenomenon home's `Security` documents.

**5. Both corner brackets are the SAME 21×33 SVG.** `TL Corner` and `BR Corner` both
`<use href="#svg-940700596_480">`; the BR one is `transform: matrix(-1,0,0,-1,0,0)`, i.e.
`rotate(180deg)`. Unlike the CTA's 14×20 pair, which really are two different paths.

**6. The core paragraph is ONE `<p>` with two `<br/>` inside it, not two `<p>`s.** The blank
line between the two paragraphs is exactly one line-height because it *is* a line. Two elements
with a margin would be a different measurement.

---

## Tier map — three sizes, not four

**XL and desktop are identical on every value on this page.** Base = phone (≤809.98) →
`tablet:` (≥810) → `desktop:` (≥1200). No `xl:` rule anywhere.

| Property | ≥1200 (1600 + 1440) | 1024 | 390 |
|---|---|---|---|
| `#first` padding | `198px 40px 80px` | same | `198px 16px 80px` |
| `#first` height | **`70vh`** (630 @ vh900) | same | `min-content` (521.19) |
| `#first` gap | 96 | 96 | 96 |
| `#features` padding | `80px 40px` | **`56px 40px`** | **`40px 16px`** |
| `#features` height | 570 | 739.17 | 1142.34 |
| `#features-1` padding | `96px 40px` | same | **`80px 16px`** |
| `#features-1` height | 964.06 | 1435.17 | 2099.08 |
| document height | 2716 | 3359 | 4872 |

All three bands: `flex-direction: column`, `align-items: center`, `width: 100%`,
`overflow: hidden`, `position: relative`. `#first` is `place-content: center`; the other two are
`justify-content: flex-start`. **Ground is `ink` for the whole page** — on the target only
`#first` paints it and the rest inherit from the page wrapper; ours paints it per section so
each band is its own `data-nav-theme` region.

---

## Block 1 — `Hero` (`#first`)

| Element | ≥1200 | 1024 | 390 |
|---|---|---|---|
| `Text & Button` | gap **32**, max-w none | gap **24** | gap 24, **max-w 360** |
| `Text Container` | 540 × 230, gap 16, **max-w 540** | 540 × 194.41 | 358 × 179.19 |
| h1 | **88px** / 95% / **-0.06em** | **72px** / 95% / -0.06em | **64px** / 95% / **-0.05em** |
| h1 box | 540 × 167.19 (2 lines) | 540 × 136.81 | 358 × 121.59 |
| subtitle `p` | **18px** / 130% / -0.02em | **16px** | 16px |
| subtitle box | 540 × 46.81 (2 lines) | 540 × 41.59 | 358 × 41.59 |
| CTA frame | 220 × 40 | same | same |
| CTA `<a>` | 220 × **36**, radius **6**, padding `8px 16px` | same | same |
| CTA label | Medium **16px** / 1em / -0.01em | same | same |

- h1 `text-align: center`, `text-wrap: balance`, weight 400, colour `paper`.
- Subtitle colour is `rgba(255,255,255,0.8)` → **new token `paper-soft`**.
- CTA `<a>` background `#ffffff` (`paper`), label `#151515` (`ink`) — the **Inverted** variant,
  because the ground is dark. `/product` and `/careers` ship the mirror of this.
- ⚠️ **The `<a>` is 36px tall inside a 40px frame**, vertically centred (`translateY(-50%)` on a
  wrapper in the original). `/careers` fills its 40px frame; this one does not. Measured, not
  assumed.
- **Brackets: 14 × 20, offset `dx -28 / dy -12`, at every tier** — byte-identical to
  `/product`'s and `/careers`'. Third independent measurement of the same numbers.
  Colour here is `paper`, not `ink`. Hover slide-in to `-2 / -18` is the same estimate the other
  two pages carry (300ms / `--ease-rogo`); **not in the capture, flagged as estimated**.
- The original's `<a>` has **no `href`** (same as `/product`'s ≥1200 CTA). Ours points at
  **`#contact`** — the bare fragment, not `/#contact`. The shared `Footer` renders `id="contact"`
  on every route, so it resolves in-page; the rooted form would be a navigation to `/` and trips
  `@next/next/no-html-link-for-pages`, which is a live failing rule in this repo. `ProductHero`
  and `CompanyHero` both ship the bare form for the same reason.
- Two DOM variants in the original, `Button (For Desktop)` ≥1200 and `Button (For Mobile)` below,
  which render **identically** (220 × 40 both). Collapsed to one element here.

## Block 2 — `Benefits` (`#features`)

| Element | ≥1200 | 1024 | 390 |
|---|---|---|---|
| grid | `repeat(3, minmax(50px,1fr))` | `repeat(2, …)` | `repeat(1, …)` |
| grid box | 1280 × 410, max-w 1280 | 944 × 627.17 | 358 × 1062.34 |
| grid gap | **40** | 40 | **32** |
| column width | 400 | 452 | 358 |
| row height | 185 | 182.39 | 150.39 |
| item gap (icon → text) | **64** | 64 | **32** |
| item padding | `0 0 16px` | same | same |
| icon | 36 × 36 | same | same |
| text container gap | 4 | 4 | 4 |
| title `p` | **18px** / 130% / -0.02em / `paper` | **16px** | 16px |
| body `p` | 16px / 130% / **-0.01em** / `paper-soft` | same | same |

- Grid is `grid-template-rows: repeat(2, min-content)`, `grid-auto-rows: min-content`,
  `justify-content: center`, `overflow: hidden`.
- Item is `flex-direction: column`; the icon is its own 36px child, then a `Container` (column,
  gap 4) holding title + body.
- ⚠️ **Every title is exactly 1 line and every body exactly 2 lines at every tier.** The rows are
  uniform, so a 3-line body would move all six. Copy must be fitted by **rendered line count**.
- Six 36 × 36 icons, inlined verbatim from the capture's `svg-templates` defs (generic UI
  glyphs, no branding):

| # | Framer def | Glyph |
|---|---|---|
| 1 | `#svg-2111020249_1166` | padlock over a card |
| 2 | `#svg-2023498974_793` | shield with a check |
| 3 | `#svg1512811545_1378` | viewfinder brackets around a circle |
| 4 | `#svg-2104313390_1421` | key |
| 5 | `#svg-562640884_507` | database cylinder |
| 6 | `#svg-2128099484_612` | monitor with a check |

## Block 3 — `Compliance` (`#features-1`), row 1

`Container .framer-rswx4m`: column, gap **64**, max-w 1280, `align-items: center`.

| Element | ≥1200 | 1024 | 390 |
|---|---|---|---|
| `Title` box | 1280 × 96.81, gap 16 | 944 × 88 | 358 × 70.41 |
| h3 | **44px** / 110% / -0.05em | **40px** | **32px** |
| `Logos` wrapper | flex row, gap 24, 1280 × 240 | 944 × 720 | 358 × 1270.31 |
| grid | `repeat(5, minmax(50px,1fr))`, gap **0**, `flex:1 0 0`, `width:1px` | `repeat(2, …)` | `repeat(1, …)` |
| cell | 256 × **240** | 472 × **240** | 358 × 254.06, **`aspect-ratio: 1.40909`** |
| `Graphic` frame | 104 × 104, centred | same | same |
| label | absolute `left:16 bottom:16`, w **137** (**188** for cell 5), 14px / 130% / -0.01em / `muted`, **left-aligned** | same | same |

- **h3 is ONE element and the `<br>` IS the colour boundary** — an inner `<span>` in `paper` for
  line 1, the h3's own `muted` for line 2. Two sibling blocks would let the halves wrap
  independently. `text-align: center`.
- **Cell rule matrix** — `::after`, `inset:0`, `1px dashed rgba(255,255,255,0.15)`
  (`hairline-light`), written top/right/bottom/left:

| Cell | ≥1200 (5 cols) | 1024 (2 cols) | 390 (1 col) |
|---|---|---|---|
| 1 | `1 0 1 1` | `1 0 1 1` | `1 1 1 1` |
| 2 | `1 0 1 1` | `1 1 1 1` | `0 1 1 1` |
| 3 | `1 0 1 1` | `0 0 1 1` | `0 1 0 1` |
| 4 | `1 1 1 1` | `0 1 1 1` | `1 1 1 1` |
| 5 | `1 1 1 1` | `0 1 1 1` | `1 1 1 1` |

- **Corner brackets:** one 21 × 33 SVG, `paper` fill. TL at grid-relative `top:-5 left:-5`;
  BR at `bottom:-5 right:-5`, `rotate(180deg)`. The grid must be `overflow: visible` (it is) and
  `position: relative`.
  ⚠️ **Structural simplification:** the original wraps each mark in an inert absolutely-positioned
  box (21 × 240 and 21 × gridH+5) with the mark pinned to one end. Two absolutely-positioned
  21 × 33 marks land at the identical rendered coordinates; the wrappers carry nothing else.

## Block 4 — `Compliance` row 2, "Security At Our Core"

`Container .framer-1bz2s3e`: **row** at ≥810 (gap 64, `align-items: flex-start`, max-w 1280),
**column** gap 24 at ≤809.98.

| Element | ≥1200 | 1024 | 390 |
|---|---|---|---|
| left column | `flex:1 0 0`, **max-w 450** | **max-w 280** | `flex:0 0 auto`, w 100% |
| h3 | 44px / 110% / -0.05em / `paper`, **left** | 40px | 32px |
| right column | `flex:1 0 0`, 766 wide, column, gap **32**, `align-items:flex-start` | 600 wide | w 100% |
| body `p` | 18px / 130% / -0.02em / `paper-soft` | 16px | 16px |
| body box | 766 × 187.25 (8 lines) | 600 × 187.17 (9) | 358 × 291.16 (14) |

- The left column is a **flex row with gap 10** holding the single h3.
- ⚠️ **`Explore security portal` is DROPPED** (user's call, 2026-08-12): rogo's points at
  `trust.rogo.ai`, a Vanta trust centre clix does not have. Its measured box is
  **190.06 × 32 at ≥810, 358 × 32 at 390**, label 14px / 130% / -0.01em / `paper`.
  Removing it takes **exactly 64px (32 link + 32 gap)** off the band at every tier.

  ⚠️ **The measured band delta is 64px at ≥1200 and 84.79px at 1024 and 390, and the extra
  20.79 is NOT the link.** It is one line of our own paragraph: the target's body sets in 9
  lines at 1024 and 14 at 390, ours in 8 and 13, and one line at 16px/130% is 20.79px. Two
  independent terms, and conflating them would hide a copy fact behind a layout one.

  | | ≥1200 | 1024 | 390 |
  |---|---|---|---|
  | target `#features-1` | 964.06 | 1435.17 | 2099.08 |
  | ours | **900.06** | **1350.38** | **2014.28** |
  | delta | −64.00 (link) | −64.00 −20.79 | −64.00 −20.80 |

  Document totals reconcile from three terms and nothing else: this band's delta, plus the
  shared `Footer` being **+43.8px** taller than rogo's at 1440 and **+234px** at 390 — the
  pre-existing `FooterMap` difference that `/company` recorded on every route. 2716 − 64 +
  43.8 = 2695.8 ≈ our 2696 at 1440; 4872 − 84.8 + 234 = 5021.2 ≈ our 5021 at 390.

---

## Content — clix's own

### Hero
```
h1       "Your Keys. Your Data."
subtitle "Clix runs your automations inside your own accounts, with the narrowest access
          that does the job."
CTA      "Request Demo"          (the label the Nav and Footer already use sitewide)
```
Both set in **2 lines at every tier**, matching the target's own counts — and that was measured,
not estimated. ⚠️ **The first headline written for this slot did not survive the measurement.**
"Your Data Never Leaves You." is 2 lines at 1440 and 1024 and **3 at 390**, which made the hero
581.98 against the target's 521.19; the block-diff caught it on `heroH`. Seven candidates were
then measured in the live DOM at all three tiers before one was chosen. Character count does not
decide wrapping — the same lesson `/product` recorded on 2026-08-12.

### Six benefits
Drawn from `ClixManifesto.tsx`, `docs/reference/clixsolutions/` and the five practice statements
home's `Security` section already ships. Order and glyph pairing follow the target.

### Five compliance cells
⚠️ **PRACTICES, NOT SEALS** (user's call, 2026-08-12). The target's five cells are SOC2, CCPA,
ISO 27001, GDPR and EU AI Act. SOC 2 and ISO 27001 are **audited certifications clix does not
hold**, and this repo already removed that exact set from the home page on 2026-08-05 for that
reason. The cells now carry the same five practice statements and the same five
`public/badges/practice-*.svg` marks home uses — one story across two pages. **The heading moves
with them**, because "Compliant With / Industry Standards" cannot survive the change.

Do not put certification seals here unless clix has been audited and can produce the report.

---

## Tokens

New: **`paper-soft` `#ffffffcc`** — white @80%. Framer token `--token-2a466810`, listed in
`DESIGN-SYSTEM.md` as declared-but-unused; this is the page that uses it (hero subtitle, six
benefit bodies, the core paragraph). Same shape of correction as `bone`, `brand-green`,
`forest-deep` and `signal-green` before it.

Existing: `ink` (ground), `paper` (headings, CTA fill, brackets), `muted` (compliance h3 line 2
and the five labels), `hairline-light` (`#ffffff26` = the dashed rule's
`rgba(255,255,255,0.15)`), `--container-max`, `--ease-rogo`.

---

## Documented deviations

| Property | Original | Ours | Why |
|---|---|---|---|
| All copy | rogo's | clix's | The `/company` model; nothing to strip later |
| 5 compliance cells | SOC2 / CCPA / ISO 27001 / GDPR / EU AI Act | 5 practice statements | Two are audited certifications clix does not hold |
| Compliance h3 | "Compliant With / Industry Standards" | clix's own two-tone pair | Follows the cells |
| `Explore security portal` | → `trust.rogo.ai` | **removed** | clix has no trust portal; −64px per tier |
| Hero CTA `href` | none | `#contact` | A control that does nothing is a defect. Bare fragment, not `/#contact` — see Block 1 |
| Display face | ABC Arizona Mix Regular | Discovery (`--font-display`) | Sitewide licensing decision, 2026-08-08 |
| Body face | Inter | Discovery (`--font-sans`) | Same |
| Corner-bracket wrappers | inert 21 × N boxes | two absolute 21 × 33 marks | Identical rendered geometry |
| CTA hover timing | not in the capture | 300ms / `--ease-rogo` | **Estimated**, in step with `/product` and `/careers` |
| CTA `hover:opacity-90` | no `:hover` rule in the subtree | added | **Ours, not the target's.** The same "Request Demo" control in the Nav, the Footer, `/product` and `/careers` already fades. A primary CTA that behaves differently on one route is a defect in our own system, whichever way the target authored it |
| Row 1 heading tag | `<h3>` | `<h2>` | `SecurityBenefits` contributes no heading, so an `h3` here would follow the hero's `h1` with h2 skipped. Same call `sections/Security.tsx` and `ProductSecurity.tsx` make in-file. Rendered output identical |
| Corner-mark parent | children of `Logos` | children of the grid | Same left edge and same width, so the −5 / +5 offsets are unchanged. Recorded because the block-diff has to search from row 1, not from the grid, to find the target's pair |

## Open questions

1. **Benefit 3** assumes per-run logs exist and are visible to the client. Needs the user.
2. **Benefit 5** names TLS and a managed secret store. Needs the user.
3. Hover states: the capture has no `:hover` rule in any of the three subtrees except the CTA's
   bracket variant. Nothing else on this page is known to respond to the pointer.
4. `paper-soft` on `ink` and `muted` on `ink` contrast — see the acceptance checklist.

## Acceptance checklist

- [x] **Block-diff `ALL MATCH` at 1600 / 1440 / 1024 / 390** — 60 keys per tier.
      `node docs/reference/block-diff.js docs/reference/security-diff.js 1600 1440 1024 390`
- [x] Values from `DESIGN-SYSTEM.md` tokens, or a documented deviation above. No raw hex in
      any of the four components, the six icon SVGs and both bracket pairs included
- [x] Interactive states: CTA hover (brackets slide `−28/−12` → `−18/−2`, plus the
      opacity fade recorded above) and `focus-visible` ring, `paper` on an `ink` offset
- [x] Motion: **none.** `data-framer-appear-id` count on the whole target page is **0**, and no
      animation library was pulled in. Both `docs/SKILLS.md` triggers checked and declined
- [x] `npm run build` clean (13 routes, `/security` prerendered static), `tsc --noEmit` clean,
      `eslint` clean on `src/components/security` and `src/app/security`.
      ⚠️ `npx eslint .` still reports **8 pre-existing errors**, all in `ClixCTA.tsx`,
      `ClixHero.tsx`, `block-diff.js` and `contrast-check.js`. None is new and none is here
- [x] Zero horizontal overflow at all four tiers (`scrollWidth === clientWidth` on each)
- [x] Four `[data-nav-theme]` regions — `#first` · `#features` · `#features-1` · `Footer` —
      **all `dark`, every gap 0.00 at every tier**, so the nav never falls back to `light`
- [x] Focus order: one control in `<main>`, the hero CTA, with a visible ring.
      Heading outline h1 → h2 → h3. All five marks load, all `alt="" aria-hidden="true"`
- [x] Contrast run: `paper` on `ink` **18.26:1** AAA · `paper-soft` on `ink` **11.84:1** AAA ·
      `ink` on `paper` (CTA label) 18.26:1 AAA. ⚠️ One failure, see below
- [x] Both `CONTEXT.md` files, `docs/SECTIONS.md`, `docs/DESIGN-SYSTEM.md` and
      `docs/reference/target/README.md` updated

### ⚠️ One AA failure, inherited and awaiting the user's call

The five 14px cell labels are `muted` `#737373` on `ink` = **3.85:1**, under the 4.5 floor for
normal text. It is the target's own pairing and it is the *same* failure already flagged on
home, the footer, `/product` and `/careers`; `mark` `#8b8b8b` reaches 5.36:1 and would close all
of them with one token change. Shipped as measured rather than silently fixed on one route.

`muted` appears in exactly one other place here — the compliance heading's second line — and
that is 44/40/32px, i.e. **large text**, where 3.85:1 passes AA. So this route adds one failing
pair, not two.

### Not ticked

- [ ] **Not compared against the reference screenshots by eye at 1600 or 1024.** The block-diff
      covers all four tiers numerically and both sides were looked at at **1440 and 390**;
      `assets/` holds rogo's strips at all four widths and ours at 1440 and 390 only.
