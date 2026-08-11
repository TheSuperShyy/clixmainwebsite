# Feature: `/clix` page (clone of `rogo.com/felix`)

| | |
|---|---|
| Slug | `felix-page` |
| Route | `/clix` |
| Order on page | n/a — this is a page, not a section |
| Status | `review` — **7 of 8 blocks built**; `Product Visuals` outstanding |
| Reference | `docs/reference/target/rogo-felix-2026-08-09.html` (404 KB) + `.css` (129 KB) |
| Original URL | <https://rogo.com/felix> — **a different host from the home-page target** (`rogo.ai`), same Framer project |
| Component | `src/app/clix/page.tsx` · `src/components/clix/` |

> **One folder for the whole page, not one per block.** CLAUDE.md §3 says one section = one
> folder; eight folders for eight blocks of a single page would bury the thing that actually
> needs to be findable — the page-level mechanics (the fixed backdrop, the tier map, the
> shared 40/16px gutter). Blocks are documented as sections *within* this file. Logged as a
> deliberate deviation from §3 rather than a slip.

## Purpose

Rogo's product page for *Felix*, its named AI-analyst agent. Cloned at the user's request on
2026-08-09 ("clone this page … it should be clix"), with the nav's `Clix` slot pointing at it.

---

## ⚠️ Read first: the copy is the target's, deliberately and temporarily

The user's call was **"clone verbatim now, rewrite after"** — prove the layout against the
real words, then do a copy pass as a separate step. So the page currently says "Felix",
describes an investment-banking product, and (once the Testimonial block lands) will carry 11
quotes praising a product that is not clix's.

**This is a staging state, not a claim.** It must not go to a public URL as-is — and the repo
now auto-deploys `main` to Vercel, so that is a live hazard, not a hypothetical. The copy pass
is the open question at the bottom of this file.

---

## Page-level mechanics

### The tier map — three sizes, not four

Framer emits the usual four tiers, but **XL and Desktop share every value on this page**.
Derived by mapping each `hidden-*` class back to the media query that hides it, not from the
visual:

| Class | Hidden in |
|---|---|
| `hidden-j35swi` | `max-width: 809.98px` (phone) |
| `hidden-1mourlc` | `810 – 1199.98px` (tablet) |
| `hidden-1ggina8` | `1200 – 1599.98px` (desktop) |
| `hidden-za60dz` | `min-width: 1600px` (XL) |

So a node carrying `hidden-j35swi hidden-1mourlc` is the **≥1200** variant, and there is no
separate ≥1600 art anywhere on the page.

### The fixed backdrop, and the thing it implies

The page opens with a **`position:fixed`, `110vh`, full-width layer** (`framer-kz6wrn-container`
→ `framer-mEC0Y`) whose SSR fill is `rgb(247,247,247)` — our `canvas` token. Fixed, not
absolute: the sections scroll over a held colour rather than dragging it with them. `110vh`
rather than `100vh` covers mobile URL-bar collapse.

> **It animates, and this is no longer a guess.** The Manifesto block's type is `#ffffff`
> with body at `rgba(255,255,255,0.7)` — white text, invisible on `#f7f7f7` — so this layer
> had to be the dark one, driven from JS. That was recorded here as the page's biggest unknown
> until **2026-08-09/10, when live screenshots settled it**: the whole viewport darkens (the
> logo grid above is left to dissolve into it), the dark is `#0f2822`, the nav stays white
> over it, and the manifesto text arrives *after* the ground rather than with it.
>
> Implemented in `ClixBackdrop.tsx`, which is the single place the mechanism, the timing and
> the remaining unknowns live. **Two things are still ours, not measured:** the exit (the
> target runs it through block 5's 256px of padding, which we do not build) and the light
> end's colour — we use `paper` `#ffffff`, not the target's `canvas`, so it matches our own
> body. Both are in the deviations table.

### The nav is IN FLOW on this page, and it is not on the home page

Measured, 2026-08-09, and it is the reason the whole page sat ~70px too high on first build:

```css
.framer-cv20u .framer-1jwqerv-container { z-index:2; width:100%; height:auto;
                                          position:sticky; top:0 }
```

`sticky`, not `fixed` — so the header **occupies layout space**, and block 1's `128px`
top padding is measured from the *nav's bottom edge*, not from the top of the document.
rogo.ai's home nav overlays a video and does not do this. Two pages, two templates.

Reproduced with a spacer rather than by making our header sticky: see the `spacer` prop in
`Nav.tsx` for why (an open mobile panel in flow would shove the page down on every tap).

**There is also no banner above the nav here.** The target has none, and the user asked for
ours off on this route only (2026-08-09) — `<Nav banner={false} spacer />`.

### Section inventory — all eight, with measured box values

Order, Framer name, class, and the padding/gap actually extracted. Every one is
`display:flex; flex-flow:column; align-items:center; place-content:center; width:100%;
height:min-content; overflow:clip`, so only the differences are listed.

| # | Framer name | Class | gap | padding ≥810 | padding phone | Built |
|---|---|---|---|---|---|---|
| 1 | `Hero` | `framer-1mzt05a` | 108 | `128px 40px 0` | `96px 16px 0` | ✅ `ClixHero` |
| 2 | `Video` | `framer-2uaicm` | 80 | `128px 40px 80px` | `80px 16px 40px` | ✅ `ClixVideo` |
| 3 | `Logo Proof` | `framer-s22g2m` | 108 | `40px 40px 164px` | `40px 16px` | ✅ `ClixLogoProof` |
| 4 | `Manifesto` | `framer-tyl85t` | 80 | `164px 40px 64px` → **ships `164px 40px 164px`** | `128px 16px` | ✅ `ClixManifesto` |
| 5 | `Product Visuals` | `framer-19mhri2` | 80 | `256px 40px 96px` | `128px 16px 0` | ❌ **not built** |
| 6 | `Testimonial` | `framer-h1knkl` | 80 | `128px 40px 96px` | `80px 16px` | ✅ `ClixTestimonial` |
| 7 | `CTA` | `framer-4o5umq` | 80 | `96px 40px` | `80px 16px` | ✅ `ClixCTA` |
| 8 | `Felix Footer` | `framer-17a2nid` | 108 | `96px 40px 80px` (tablet `64px 40px`) | `128px 16px 40px` | ✅ `ClixFelixFooter` |

### Blocks 2–8 — the values that were not obvious

**`Video`** — container is `aspect-ratio:1.77778` at `width:100%`. Width Container gap is
three-way: `80 / 48 / 40`. Mute toggle box: row, gap 8, padding `10px 16px 10px 10px`
(asymmetric — the extra space is on the label side of the 20px glyph), 20px icon.

**`Logo Proof`** — a **static 4×3 grid**, not a marquee: `height:436px`, `gap:8px`,
`grid-auto-rows:minmax(0,1fr)`. Columns `4 / 3 / 2`, and the phone tier also grows the grid
to `600px` because 12 logos in 2 columns is 6 rows. Tiles are `#15151508` (ink ~3%),
radius 6, `place-self:start`. Heading is Inter Medium `-0.2px` / `1.5em` / centred /
**`#8b8b8b`** — the one-off colour — at `max-width:720px`, `250px` on phone.

**`Manifesto`** — text column `max-width:550px`, left-aligned inside a centred parent, gap
`40 / 24`. Title `48 / 40px`, `-0.05em`, `110%`, capped at `300px` (`240px` phone) so it
always wraps to two lines. Body `20px`, **`-0.2px` absolute** (not em), `140%`,
`rgba(255,255,255,0.7)`.

**`Testimonial`** — two rows moving in **opposite** directions (`Ticker` / `Ticker Opposite`),
row gap 20, each masked `linear-gradient(90deg,#0000 0%,#000 5% 95%,#0000 100%)` — a 5%
proportional fade, not a pixel ramp. Title `56 / 48 / 36px` at `max-width:500px` (`350px`
phone). Quote `24px`, `-0.03em`, `130%`, left. Attribution is a `gap:6px` column.

**`CTA`** — inner panel has a **hard `400px` height** at ≥810 (`min-content` on phone); that
is what makes the block read as a band. Radius 6, gap 32. Title `80 / 72 / 56px`, `-0.05em`,
`110%`, `forest`, `white-space:pre` at ≥810 so it never wraps.

**`Felix Footer`** — one row containing a single `flex:1 0 0; width:1px` column aligned
`flex-end`, gap 24 — the same width-collapse trick `why-rogo` uses. Wordmark box is
`aspect-ratio:2.337601862630966`. "by Rogo" is Inter Display Medium `28px`, `0px`, `100%`,
`rgba(115,115,115,0.3)`.

Gutter is **40px at ≥810 and 16px on phone**, without exception. Container max-width is
`1280px` — the same `--container-max` the home page uses, so no new layout token.

### Palette

**The page adds exactly one colour: `forest` `#1a2a25`, ×19.** Counted from the capture, not
assumed. Everything else resolves to tokens that already exist — `ink` ×194, `muted` ×48,
`hairline` ×19, `paper` ×17, plus `canvas` inlined on the backdrop. The other greens the
Framer project declares (`#135b45` `#19a26c` `#0f2822` `#f5f2eb`) have **zero** uses here.

`#8b8b8b` appears ×2 and is **not** tokenized — two uses is a one-off, not a scale step.

### Typeface — a standing, deliberate divergence

The original sets all display type in **ABC Arizona Mix Regular**, a serif. This build deleted
that face on 2026-08-08 (a licensed Dinamo font lifted from the capture, which we had no right
to serve) and set the whole site in **Discovery**, which the user owns. Every display heading
on this page therefore renders in Discovery. **All metrics are still the original's** — only
the face differs. Do not treat this as a bug to fix; see `docs/DESIGN-SYSTEM.md`.

---

## Block 1 — `Hero` ✅ built

`src/components/clix/ClixHero.tsx`

### Structure

The headline is **three boxes, not one string**:

```
[            Meet Felix            ]   text-align:center, own line
[ your new ][   <rotating word>    ]   one row, gap 16px
```

`your new` is right-aligned and the rotating word sits in a **fixed-width** box, so the row's
optical centre never moves as the word changes. Removing that fixed width would reflow the
line on every swap — it is the mechanism, not a detail.

Nesting (gaps land where the original puts them):
`section` (gap 108) → `Width Container` max-w 1280 (gap 108, phone 96) → `Headline Container`
(gap 40) → [ the two-line block (gap **0** — the 100% line-height *is* the spacing), button ].

### Measured values

| Property | ≥1200 | tablet | phone |
|---|---|---|---|
| Headline size | `92px` | `72px` | `56px` |
| Letter-spacing | `-0.06em` | same | same |
| Line-height | `100%` | same | same |
| Colour | `forest` `#1a2a25` | same | same |
| h1 box max-width | `844px` (`--measure`) | `max-width:unset; width:100%` | `844px` |
| `your new` row | row, gap `16px` | same | **column, gap 0** |
| Rotating box | `270px × 100px`, justify-start, text-left, lh **110%** | `270px × 100px`, justify-start, text-left, lh 100% | `306px × 100px`, justify-center, text-right, lh 100% |
| Button height | `48px` | `44px` | `44px` |

Button: `bg forest`, radius `6px`, padding `8px 16px`, inner row `20px` tall with `1px` top
nudge, label Inter Medium **`16px`** / `1em` / `-0.01em` / `paper`. Border `1px solid
rgba(168,162,158,0)` — transparent, present so the box cannot resize if a state colours it in.

The rotating box's `padding:20px; margin:-20px` is **not decoration**: `overflow:visible` plus
20px of padding is what stops the 8px blur being clipped, and the negative margin takes it back
out of the layout so the row's 16px gap stays 16px.

### Motion

**Enter state is measured exactly** — the SSR word ships as
`filter:blur(8px); opacity:0; transform:translateY(-24px)`, i.e. it arrives from 24px above,
blurred and transparent.

**Everything else is estimated:** hold `2600ms`, swap `500ms`, and exit continuing *downward*
to `+24px`. The downward exit is the natural reading of a downward entrance, not an observed
fact. `prefers-reduced-motion` freezes on the first word.

---

## Documented deviations

| Property | Original | Ours | Why |
|---|---|---|---|
| Display face | ABC Arizona Mix Regular (serif) | Discovery | Standing sitewide decision, 2026-08-08. Licensing — see above. |
| Rotating word list | unknown length | **2 words** (`analyst`, `investor`) | Not recoverable from a static capture; see open questions. Only observed words used — nothing invented to pad the cycle. |
| Button count | ships **twice**, gated `hidden-*` (48px ≥1200, 44px below) | one element, responsive height | Nothing but the height differs, and two DOM copies of one link is a duplicate tab stop for no gain. |
| `Request Access` href | this page's `CTA` section | `#clix-contact` | Was `/#contact` while the CTA did not exist; repointed 2026-08-09 now that `ClixCTA` ships the id. |
| Page title | `Rogo | Meet Felix` | `clix | Meet Felix` | Same call already recorded for the root layout — the `<title>` names the build, not the clone target. |
| Nav / footer shell | the target's own light nav + a `by Rogo` footer | this build's shared `Nav`, **banner off**, height reserved in flow | One site, one shell — but the *placement* is now the target's. Amended 2026-08-09: the ticker strip is gone on this route only, and the nav no longer overlays the hero. See "The nav is IN FLOW on this page" above. |
| Nav row height in flow | the target's own bar | `--nav-row-h` — `74px` <1200, `70px` ≥1200 | Ours is the clix nav, so the reserved height is ours too. Derived from fixed-height boxes, not measured off the target; the *mechanism* is the target's. |
| Nav hash links | n/a | `#security` → `/#security`, `#testimonials` → `/#testimonials`, CTA `#contact` → `/#contact` | The nav became shared the moment a second route existed; a bare hash on `/clix` points at nothing. `/#x` still scrolls rather than reloads when already on `/`. |
| **Manifesto background** | shared fixed backdrop, colour **animated on scroll** from JS | same — the shared backdrop animates | *Row rewritten 2026-08-10.* It briefly painted its own `forest` ground while the sequence was unobserved; a live screenshot settled it and the mechanism now matches. `ClixBackdrop.tsx` holds the timing, the evidence, and what is still ours (the exit, which the target runs through block 5's padding). |
| **Manifesto bottom padding** | `64px` at ≥810 | `164px`, matching its own top | **Deliberate, 2026-08-10, user's call** — *"a white space similar and equal to the space on top … add it on the bottom as well"*. Compensating for block 5: the target's dark runway after the last paragraph is this block's 64px **plus** `Product Visuals`' 256px top padding = 320px. Ours runs straight into `Testimonial` (`pt` 128), so 64px gave only 192px. 164px gives 292px without touching block 6's measured padding. **Revert to `pb-16` when block 5 lands** or it overshoots by 100px. Phone was already symmetric at 128px and is untouched. |
| **Backdrop's LIGHT state** | `rgb(247,247,247)` — `canvas` | `paper` `#ffffff` | **Deliberate, 2026-08-10, user's call.** Our `body` is `paper` and every section from the Testimonial down paints an opaque `bg-paper`, so a `canvas` backdrop left the page grey above the green block and white below it — a visible step exactly where the crossfade should remove one. Matching our own body beats matching the target's near-white when they disagree. |
| **Video clip** | rogo's Framer-hosted mp4 | `public/video/hero-clix.mp4` | Rogo's asset. This repo already deleted rogo's `hero-original.mp4` for copyright once it went public. Every box value is still the original's. |
| **Logo fill** | 12 dark logo SVGs | the 14 vendored **white** SVGs, rendered as CSS masks with an `ink/70` fill | The vendored set was cut for the home page's dark hero. A mask reuses one asset at either polarity rather than shipping a second recoloured copy of all twelve. All 12 names the target lists were already vendored — nothing new was fetched or redrawn. |
| **Footer wordmark** | a 2008×859 PNG on framerusercontent.com | set in type at the same `2.3376` aspect | Rogo's artwork. Box shape preserved so the block's height is the original's; only the glyphs are ours. |
| Testimonial card box | a Framer component | `320/420px` wide, `24px` padding, `#15151508` fill | **Estimated** — the card's own width/padding/fill did not survive extraction. Quote type, attribution gap and row gap ARE measured. |
| Marquee cycle | unknown | `90s`, both rows | **Estimated.** A static capture cannot encode a rate. |
| Hero button count | ships twice (48px ≥1200 / 44px below) | one element, responsive height | See above. The CTA's button is 48px at every tier — the 44px variant is hero-specific. |

---

## Acceptance checklist

- [x] Capture taken and dated; CSS extracted alongside it
- [x] Tier map derived from the media queries, not the visual
- [x] Palette counted from the capture; one new token added to DESIGN-SYSTEM + `@theme`
- [x] All 8 blocks inventoried with real padding/gap values
- [x] Blocks 1–4 and 6–8 built from measured values
- [x] `npm run build` clean, `/clix` prerendered, all seven blocks present in served HTML
- [ ] Block 5 (`Product Visuals`) built — blocked on three 4000×2667 photos we don't have
- [ ] Matches reference at 1600 / 1440 / 1024 / 390 — **not visually verified at any tier**
- [ ] Keyboard / focus / contrast pass
- [ ] Copy pass (see below)

---

## Open questions

- [ ] **The backdrop's scroll-driven colour.** Sequence, offsets and easing are all JS-side.
      Blocks the Manifesto (white text) and probably the Testimonial. **Needs live observation.**
- [ ] **The rotating word list.** Two words observed. The chunk is lazy-loaded; the main JS
      bundle (146 KB) has none of the strings and six cache-busted fetches all returned
      `investor`. Ten seconds on the live page would settle it.
- [ ] **Rotation timing.** Hold and swap durations are estimates.
- [ ] **Assets, and who owns them.** Block 2 needs a 16:9 video, block 5 needs three 4000×2667
      photos, block 3 needs 24 logos. All are rogo's. This repo already deleted rogo's
      `hero-original.mp4` for copyright once it went public — the same reasoning applies. We
      have `public/video/hero-clix.mp4` and 14 vendored logo SVGs to reuse; the other 10 logos
      and the 3 photos have no source yet. **Needs the user's call.**
- [ ] **The copy pass.** See the warning at the top. Non-optional before this page is public.
- [ ] **Should `/clix` be in `sitemap`/indexable?** Not addressed; there is no sitemap yet.
