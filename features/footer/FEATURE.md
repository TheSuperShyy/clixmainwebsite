# Feature: Footer + closing CTA

| | |
|---|---|
| Slug | `footer` |
| Page(s) | all (site shell) |
| Order on page | 8 — last; outside `<main>` |
| Status | `review` |
| Reference | the 2026-08-02 capture, `docs/reference/target/` |
| Original Framer name | `Footer` (`.framer-8dt5bh-container` → `<footer class="framer-fo8jf5">`) |
| Component | `src/components/sections/Footer.tsx` |

## Purpose

The closing CTA — "Unlock financial AI for your firm" plus a Request Demo button — a rule,
four link columns, and a centred copyright line. All on `ink`, continuous with the
`security` section above it, which is why the two read as one dark block.

**The CTA is inside the footer in the original**, not a separate section. One component.

---

## Measured spec

> This is a **nested Framer component**, so it ships its own variants with their own gating
> hashes: `hidden-d23fwj` = ≥1600 · `hidden-1roolzl` = 1200–1599.98 · `hidden-1leoyz4` =
> 810–1199.98 · `hidden-16n7npo` = ≤809.98. Same four tiers as the page, different names —
> they had to be re-derived from scratch rather than reused.
>
> Rendered variants: `Dark/Desktop` (`framer-v-1hizjvd`, ≥1200) · `Dark/Tablet`
> (`framer-v-25d1j7`, 810–1199.98) · `Dark/Mobile` (`framer-v-3r98zd`, ≤809.98).

### ⚠️ Two variants in the stylesheet are never rendered

The CSS also carries rules for **`framer-v-1cxbn18`** and **`framer-v-18cp4bv`**, which are
other variants of the same component that this page never mounts. They are not empty
either — `1cxbn18` declares a `grid-template-columns: repeat(2, minmax(50px,1fr))` on the
link row, and `18cp4bv` declares a column-direction copyright and a `padding: 16px 24px`.

**None of it applies here.** Every rule was checked for whether it names one of the three
rendered variants before any value was recorded. The tablet tier in particular does *not*
get a 2-up link grid, however much the stylesheet looks like it should.

### Layout

| Property | XL 1600 | Desktop 1440 | Tablet 1024 | Phone 390 |
|---|---|---|---|---|
| Footer padding | `0 40px` | `0 40px` | `0 40px` | `0 16px` |
| Footer background | `ink` `#151515` | same | same | same |
| Container | `flex:1 0 0; width:1px; max-width:1280px`, column, gap `56px` | same | same | same |
| Reiteration | row, `align-items:flex-end`, gap `40px`, padding `56px 0 0` | same | same | **column**, gap `32px` |
| Headline column | `flex:1 0 0; width:1px`, gap `40px` | same | same | `flex:none; width:100%` |
| CTA container | `height:44px`, width auto | same | **`height:42px`** | `height:44px`, **`width:100%`** |
| Divider | `width:100%; height:1px` | same | same | same |
| Bottom | column, gap `72px` | same | same | same |
| Link row | row, `align-items:flex-start`, gap `16px` | same | same | **column**, gap `32px` |
| Link group | `flex:1 0 0; width:1px`, gap `20px` | same | same | `flex:none; width:100%` |
| Links list gap | `12px` | `12px` | `12px` | `12px` |
| Copyright | row, centred, gap `16px`, padding `16px 48px` | same | same | same |
| Rendered group width | 308px | 308px | 224px | 358px |

**There is no vertical padding on the footer itself.** The Reiteration block's own
`padding-top: 56px` is the entire top inset, and the Copyright's `16px` is the bottom.

### Typography

| Element | Family | Size | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|---|
| CTA headline | ABC Arizona Mix Regular | **48px** ≥810 · **44px** ≤809.98 | 400 | `1.1em` | `-0.05em` | `paper` |
| CTA button label | Inter | **16px** | 500 | `1em` | `-0.01em` | `ink` |
| Group title | Inter | **14px at every tier** | 500 | `1.3em` | `-0.02em` | `muted` |
| Link | Inter | **14px at every tier** | 400 | `1.5em` | `-0.02em` | `paper` |
| Copyright | Inter | **12px** ≥1200 · **14px** ≤1199.98 | **500** ≥810 · **400** ≤809.98 | `1.3em` | `-0.02em` | `muted`, `text-transform: uppercase` |

The copyright is the odd one: three different size/weight combinations across the three
variants (12/500, 14/500, 14/400). Not derivable from a pattern; read off each variant.

**The button label is 16px here and 14px in the nav** — same button construction otherwise
(`8px 16px` padding around a `20px` row with a `1px` optical top nudge, `6px` radius,
`1px solid rgba(168,162,158,0)` border), but a different type size. The CTA container's
explicit `44px` height, not the padding, is what sets the button's size.

### The headline's line breaks

| | Text |
|---|---|
| ≥810 | `Unlock financial AI` ⏎ `for your firm` — two lines |
| ≤809.98 | `Unlock` ⏎ `financial AI` ⏎ `for your firm` — three lines |

Both breaks are explicit `<br>` in the capture; neither comes from a measure. The second
`<br>` is wrapped in a `<span>` coloured `ink` that holds no text, so it paints nothing —
dropped rather than copied, same as `by-the-numbers` row 3.

### Color & surface

| Element | Property | Value |
|---|---|---|
| Footer | background | `ink` `#151515` |
| Divider | background | **`rgba(56,56,56,0.5)` ≤1199.98 · `rgba(255,255,255,0.1)` ≥1200** |
| CTA button | background | `paper`, radius `6px`, border `1px solid rgba(168,162,158,0)` |
| Group title, copyright | color | `muted` `#737373` |
| Link | color | `paper`, hover `surface` `#f5f5f5` |

**The divider is two different colours by tier.** `rgb(56,56,56)` is exactly `ink-soft`
`#383838`, so both values are opacity modifiers on existing tokens (`ink-soft/50` and
`paper/10`) — neither is a new design-system colour.

### Motion

| What animates | Trigger | Duration | Easing |
|---|---|---|---|
| Link colour, `paper` → `surface` | hover | `.3s` | `cubic-bezier(.44,0,.56,1)` — **measured** |

**This is the second measured transition on the whole site**, after the nav banner's. It is
declared on the capture's link style preset (`framer-styles-preset-1twswsp`), not estimated.
Nothing else in the footer animates — no `data-framer-appear-id` in the subtree.

---

## Tokens used

`ink` · `paper` · `muted` · `surface` · `ink-soft` (via `/50`) · `--font-display` ·
`--font-sans` · `--container-max` `1280px` · `--ease-rogo`.

**No new tokens.**

## Documented deviations

| Property | Original | Ours | Why |
|---|---|---|---|
| **CTA `href`** | **none at ≥1200**; `./demo` at the other two tiers | `/demo` at every tier | An `<a>` with no `href` is not keyboard-operable. The value is not invented — it is the original's own, taken from its sibling variants. Same class of fix as the nav's `Request Demo`, and a smaller one, since here the target is known. |
| Link paths | `./product`, `./careers`, … | `/product`, `/careers`, … | Root-relative, matching what `Nav.tsx` already ships. `./` would resolve differently from a nested route. Every destination is a page this repo does not have — see the open question. |
| `<span>` wrapper on the second `<br>` | `<span style="--framer-text-color: ink">` around a bare `<br>` | dropped | Holds no text, paints nothing. |
| `ssr-variant` duplication | three DOM copies of the whole footer | one tree, `tablet:`/`desktop:` variants — except the two links that genuinely differ, which ship twice and are gated | Consistent with the four sections before it. |
| Focus rings | none observable | `focus-visible:ring-2` on every link and the CTA | The project's accessibility floor; the original ships nothing. |

## Acceptance checklist

- [x] Structure + measured values from the capture, all four tiers
- [x] Spacing/type/color from tokens, or deviation documented above
- [x] Geometry verified by CDP at 1600 / 1440 / 1024 / 390 — including the CTA's 44/42/44
      heights, the divider's two colours, the copyright's three size/weight combinations,
      and every link's rendered `href` per tier
- [x] Keyboard reachable; focus visible on every link and the CTA
- [x] Hover transition is the **measured** `.3s cubic-bezier(.44,0,.56,1)`, scoped to
      `color` only — not `transition-colors`, which would over-reach
- [x] No horizontal overflow at any of the four widths
- [x] `npm run build` clean, `eslint src` clean
- [ ] **Contrast: group titles and the copyright are `3.85:1`** — see below
- [ ] Matches reference at 1600 / 1440 / 1024 / 390 — the ≥1200 tier was compared to the
      user's screenshot of the live site and matches; the others against the capture only

## Open questions

- [ ] **Two links differ by tier in the original, and both are reproduced.** Flagged because
      neither looks deliberate:
  - **"Legal" (→ `/legal`) ships on the ≥1200 variant only.** A phone or tablet user cannot
    reach it at all. On a page whose other legal links are Terms and Privacy, that reads
    like variant drift rather than a decision.
  - **"Press" has two destinations** — `mailto:press@rogo.ai` at ≥1200,
    `https://x.com/RogoAI` below it. Ours ships both, each gated to the tier that declares
    it, which is faithful and slightly absurd.

  Both are one-line fixes if you want them unified. **Needs your call**, same as the
  `security` border question.
- [ ] **Contrast fails on `muted` over `ink` again** — group titles and the copyright are
      **`3.85:1`** (4.5:1 required). Identical to the `security` labels and fixable the same
      way: `#7f7f7f` reaches `4.56:1`. Links themselves are `18.26:1` and fine.
- [ ] **Every link destination is a page this repo does not have** (`/product`, `/careers`,
      `/legal`, …). They will 404 until those pages are scoped — see the open question in
      `docs/PROJECT.md`. Left as real hrefs rather than `#`, so the information architecture
      is preserved.
- [ ] **The CTA button's hover state is unobserved.** The link preset gives us the *link*
      hover; the button is a separate Framer component with no `:hover` rule in the capture.
      Ours has none either.
