# Company page

| | |
|---|---|
| **Slug** | `company-page` |
| **Route** | `/company` |
| **Status** | `building` |
| **Reference** | `docs/reference/target/rogo-company-2026-08-12.{html,css}` (381 KB / 146 KB, 5 inline `<style>` blocks, 272 `data-framer-name` values) |
| **Original URL** | <https://rogo.com/company> |
| **Screenshots** | `features/company-page/assets/rogo-company-{1600,1440,1024,390}-NN.jpg`, 27 frames |
| **Components** | `src/components/company/*` |

---

## ⚠️ Read first

**The design is rogo's, measured. The content is clix's, from the first commit.** Unlike
`/product`, this page was never built with the target's copy in it. rogo fills `/company` with
20 third-party logos, three named real founders and a photograph of its own staff; none of that
ever entered this repo, so there is nothing here to delete later.

Three content rules that decided the build:

1. **No client or investor logos.** clix has no investors, and the boss's standing call is no
   client logos. The two logo grids keep their exact geometry and are filled with clix's own
   eight services and twelve tools.
2. **No team names.** The seven names in `docs/reference/clixsolutions/content.json` are
   machine-translated `alt` text: `team-yarin.jpeg` is labelled "Shahar Apote" and
   `team-shahar.jpeg` "Yarin Yitzhak" (swapped), and one reads `giving` (מתן). The
   `FOUNDED BY` column became a `TEAM` column of verifiable facts instead.
3. **No team photograph exists in this repo.** Block 5's full-bleed slot takes a stock photo.

### ⚠️ `noindex` on first ship

`robots: { index: false, follow: false }` in `src/app/company/page.tsx`, consistent with
`/product` and `/clix`. The four-item gate that holds `/product` is clear here, but two things
are outstanding and both are the user's call:

- The **Unit 8200 and Technion claim** is the page's only credential and
  `docs/reference/clixsolutions/README.md:319-321` records that it carries no substantiation
  in this repo. It already ships in `ProductBenefits.tsx:67-71`, also behind `noindex`.
- The stock photo occupies a slot the original fills with the company's actual staff.

Lifting the guard is a one-line change once those are settled. `/news` is the precedent for
shipping without it.

---

## Page-level mechanics

### The tier map

Four Framer tiers, the same as every other route here. **The gating hashes are this page's own
and do not transfer from `/product`:**

| Media query | Page's hides-at class | Footer's |
|---|---|---|
| `min-width: 1600px` | `hidden-1clucma` | `hidden-d23fwj` |
| `min-width: 1200px` and `max-width: 1599.98px` | `hidden-1z9lgv` | `hidden-1roolzl` |
| `min-width: 810px` and `max-width: 1199.98px` | `hidden-usbdey` | `hidden-1leoyz4` |
| `max-width: 809.98px` | `hidden-14own1e` | `hidden-16n7npo` |

The Footer's set is byte-identical to `/product`'s, confirming the same shared component.

**1600 and 1440 are identical in every measured value on this page**, so write mobile-first
base → `tablet:` → `desktop:` and use no `xl:` variant.

### The nav is FIXED on this page

Hero top padding is `198px` at every tier, which is the fixed nav's clearance. Render
`<Nav models={models} />` with **no `spacer` prop**, exactly as `/product` does.

### No reorder below 1200

The stage sets explicit `order` values 0..5 at ≤1199, but they match document order, so nothing
moves. `<main>` needs no `order-*` classes.

### Six bands, not five

`Video` is a **sibling** of `Hero`, not a child, the same shape as `/product`'s Block 1.

| # | Framer name | Component | bg | Height @1440 |
|---|---|---|---|---|
| 1 | `Hero` | `CompanyHero` | transparent | 548.59 |
| 2 | `Video` | `CompanyHero` (same file) | `paper` | 717.70 |
| 3 | `Mission` | `CompanyMission` | `paper` | 404.20 |
| 4 | `Team` | `CompanyServices` | `bone` `#f5f2eb` | 793.03 |
| 5 | `Investors` | `CompanyTools` | `surface` `#f5f5f5` | 1120.81 |
| 6 | `Reiteration` | `CompanyCareers` | transparent / `paper` | 912.81 |

Document height: **5050 @1600 and @1440 · 5036 @1024 · 7561 @390.**

### Band padding and gap

| Band | ≥1200 | 810–1199 | ≤809 |
|---|---|---|---|
| `Hero` | `198px 40px 64px`, gap 96 | `198px 40px 64px`, gap 96 | `198px 16px 64px`, gap 96 |
| `Video` | `0 40px` | `0 40px` | `0 16px` |
| `Mission` | `96px 40px` | `64px 40px` | `64px 16px` |
| `Team` | `96px 40px` | `64px 40px` | `64px 16px` |
| `Investors` | `96px 40px` | `64px 40px` | `64px 16px` |
| `Reiteration` / `Top` | `96px 40px`, gap 96 | `64px 40px`, gap 96 | `64px 16px`, gap 96 |

So the gutter is `px-4 tablet:px-10` and the vertical rhythm is `py-16 desktop:py-24`
(`64px` → `96px` at 1200), with the Hero a fixed one-off.

### Type presets, measured

**h3 (Mission, Team, Investors, Reiteration all share it):**
`44 / 40 / 32px`, weight 400, `lineHeight: "110%"`, `letterSpacing: "-0.05em"`, `ink`.
This is byte-identical to `/product`'s h3 preset. Reuse it.

**h1 (Hero only):** `88 / 72 / 64px`, weight 400, `lineHeight: "95%"`, `ink`.
⚠️ letter-spacing is **`-0.06em` at ≥810 but `-0.05em` at ≤809** (measured `-5.28/88`,
`-4.32/72`, `-3.2/64`).

**Body:** `18px` at ≥1200, `16px` below. `lineHeight: "130%"`, `letterSpacing: "-0.02em"`.

**Mission's name list:** `16px` at every tier, `130%`, but `letterSpacing: "-0.01em"`, `ink`.
Do not fold it into the body preset.

**Eyebrow label** (`TEAM`, `LOCATED IN`): `12px`, `lineHeight: "130%"`, weight 400, `muted`,
`text-transform: uppercase`. ⚠️ **`letter-spacing: normal`, not a negative value.** This is a
real exception to DESIGN-SYSTEM.md's "all negative, never ship 0" note. The source strings are
sentence case (`Founded By`, `Located IN`) and CSS uppercases them.

**Button label:** `16px`, `lineHeight: "100%"`, `letterSpacing: "-0.01em"`, weight **500**,
`paper`.

### The CTA button

Both CTAs are identical but for width: **`36px` tall** (the `40px` is an outer frame),
`padding: 8px 16px`, `gap: 8px`, `bg ink`, `border-radius: 6px`, label centred.

| | Hero | Reiteration |
|---|---|---|
| box | `220 x 36` | `124 x 36` |
| original label | `Request a Demo` | `See Careers` |
| original href | `./demo` | `./careers` |

⚠️ **Only the Hero's CTA carries the animated corner brackets** (`Left` / `Right`, `14x20`,
absolutely positioned). `ProductHero.tsx:217-308` already implements that exact button and is
the base to copy. **The Reiteration CTA has none:** `.framer-kh28y4` in the capture has exactly
one child, the 20px label row, and no bracket SVGs. An earlier draft of this file said both
carried them; Unit E read it off the markup and corrected it.

Neither button should carry a real `border`. The capture paints `1px rgba(168,162,158,0)` via
`[data-border]::after`, which is both invisible and free of layout cost; a real border renders
the box 38px tall instead of 36.

### Colours

Every value on this page already exists as a token except one:

| Measured | Token |
|---|---|
| `rgb(21,21,21)` | `ink` |
| `rgb(115,115,115)` | `muted` |
| `rgb(255,255,255)` | `paper` |
| `rgb(245,242,235)` | `bone` `#f5f2eb` |
| `rgb(245,245,245)` | `surface` `#f5f5f5` |
| **`#73737326`** | **NEW.** `muted` at 15%. The grid rule colour. Write it `border-muted/15`. |

---

## Block 1 — `Hero` + `Video`

One `<section>` wrapping both bands, so the nav theme scanner sees a contiguous block
(the `/product` precedent).

### Hero structure

```
div[Hero]           flex col, gap 96
  div[Text & Button]  flex col, gap 32 (≥810) / 24 (≤809), maxW 360 at ≤809
    div[Text Container] flex col, gap 24 / 16 / 24, maxW 960   <-- 16 at TABLET only
      div > h1
      div > p          maxW 540
    div[Button]         the 220x36 CTA
```

| | ≥1200 | 810–1199 | ≤809 |
|---|---|---|---|
| h1 box | `960 x 167.2` **2 lines** | `944 x 68.4` **1 line** | `358 x 182.4` **3 lines** |
| h1 size / lh | 88 / 83.6 | 72 / 68.4 | 64 / 60.8 |
| subhead box | `540 x 23.4` **1 line** | `540 x 20.8` **1 line** | `358 x 41.6` **2 lines** |
| subhead size | 18 | 16 | 16 |
| `Text & Button` gap | 32 | **32** | 24 |
| `Text Container` gap | 24 | **16** | 24 |

> ⚠️ **Both tablet gaps above were wrong in the first draft of this file, and they compound.**
> The capture has a base `gap:32px` on `Text & Button` with a single `max-width:809.98px`
> override to `24px`, and **no rule in the 810–1199.98 block**, so tablet inherits 32. The
> `Text Container` is the reverse: it is 24 at base and drops to `16px` in the tablet block only.
>
> The draft said 32 / 24 / 24 and a flat 24 because it was derived by arithmetic from the band
> height, and that derivation had **two unknowns solved as one**. With 24 and 24 the tablet Hero
> band computes to 431.2 against a rendered 439.2, putting every band below it 8px high. Unit A
> read both rules out of the stylesheet instead. Read the CSS, do not back-solve it.

### Video structure

```
div[Video]   bg paper, pad 0 40/16
  div        0x0 wrapper            <-- see the warning below
    div      maxW 1280, aspect-ratio 1.78344
      div[Paused]
        div > video  object-fit cover
        div[Play Button] / div[Pause Button]  56x56, radius 43.2px, bg paper, centred
          svg 29x29
```

- Box is `w-full max-w-[1280px] aspect-[1.78344]`. Renders `1280 x 717.7` at 1440,
  `944 x 529.31` at 1024 (the BOX is 944, not the 1024 viewport: the band has a 40px
  gutter, and 944 / 1.78344 = 529.31), `358 x 200.73` at 390.
- Play and Pause are both in the DOM at the same 56×56 centred position; the variant swaps them.
- **There is no wordmark overlay.** The "rogo" seen over the skyline is baked into the video
  frame itself, not a DOM element.

> ⚠️ **A 0×0 wrapper sits between the band and its content.** The first structural probe
> reported `Video` as having no children at all, because `block-diff.js`'s rule 1 (filter every
> query on `width > 0`) discarded a legitimate zero-size parent and its whole subtree with it.
> The rule guards against measuring hidden tier variants; it is not a safe tree-walk filter.
> Walk without it, then check visibility per node.

### clix's content

- Video source `/video/hero-tel-aviv.mp4`, poster `/video/hero-tel-aviv-poster.jpg`. Both are
  already in the repo, Pexels-licensed, and were **unreferenced dead weight** (6.9 MB) before
  this page used them. A city skyline, the same register as rogo's NYC clip.
- CTA → `#contact` (the anchor `Footer.tsx` owns), label `Let's start`, as on `/product`.

---

## Block 2 — `Mission`

```
div[Mission]  bg paper
  div[Container]  maxW 1280, ROW gap 64 (≥1200) / COL gap 40 (810-1199) / COL gap 24 (≤809)
    div[Title]      maxW 490   > h3
    div[Title]      GRID gap 40, 3 equal columns at ≥1200
      div[Column]   label + 3 names        (col 1)
      div[Column]   label + 2 spans        (col 2)
      div[Column]   the mission paragraph  (spans all 3)
```

| | ≥1200 | 810–1199 | ≤809 |
|---|---|---|---|
| Container | row, gap 64 | column, gap 40 | column, gap 24 |
| h3 box | `490 x 96.8` 2 lines | `490 x 88` 2 lines | `358 x 70.4` 2 lines |
| grid box | `726` wide, **3 cols** `215.33` | `944` wide, **3 cols** `288` | `358` wide, **1 col** |
| grid gap | 40 | 40 | 40 |
| column gap | 16 (label→list), 4 (between names) | same | same |
| paragraph | `726 x 70.2` **3 lines**, 18px | `944 x 41.6` **2 lines**, 16px | `358 x 104` **5 lines**, 16px |

⚠️ **The outer container and the inner grid change at DIFFERENT breakpoints.** The container
switches row → column at **1200**; the grid keeps **three columns down to 810** and collapses to
one only at **≤809**. So: `grid-cols-1 tablet:grid-cols-3`, paragraph `tablet:col-span-3`.

Proof from the capture's CSS rather than from rendered boxes: the base rule for
`.framer-knldtn` is `grid-template-columns: repeat(3, minmax(50px,1fr))`; the only override to
`repeat(1, ...)`, and the paragraph's `grid-column: span 1`, sit inside
`@media (max-width: 809.98px)`; and the `810–1199.98` block touches the element only to set
`flex:none; width:100%`, never restating the tracks. The rendered boxes agree, since
`(944 - 80) / 3 = 288` is exactly the column width measured at 1024.

> This row originally read "1 col" at 810–1199 and the prose said "below 1200 they stack".
> That was an over-read of the measurement, not a measurement: the probe had already returned
> `288`, which only resolves as three columns. Unit B refused the instruction and was right.

`726` is not authored anywhere. At ≥1200 both the title and the grid are `flex: 1 0 0` and the
title is capped at `max-width: 490px`, so flexbox freezes the title and hands the remainder to
the grid: `1280 - 64 - 490 = 726`, and `215.33` falls out as `(726 - 80) / 3`. Use `flex-1`
rather than hardcoding either number.

---

## Block 3 — `Team` → clix's eight services

```
div[Team]  bg bone
  div[Container]      maxW 1280, col, gap 80 (≥1200) / 40 (810-1199) / 32 (≤809)
    div[Text Container]  col, gap 10, maxW 640 (≥1200) / 540 (810-1199) / none (≤809)
      h3
      p
    div[Container]     ROW gap 64 (≥1200) / COL gap 40 / COL gap 24
      ul[Investors]    the grid
```

| | ≥1200 | 810–1199 | ≤809 |
|---|---|---|---|
| grid columns | **4** | **4** | **1** |
| tile | `308 x 164` | `224 x 164` | `358 x 164` |
| grid gap | 16 | 16 | 16 |
| grid box | `1280 x 344` | `944 x 344` | `358 x 1424` |
| h3 box | `640 x 96.8` 2 lines | `540 x 88` 2 lines | `358 x 70.4` 2 lines |
| intro p | `640 x 70.2` 3 lines, 18px | `540 x 62.4` 3 lines, 16px | `358 x 104` 5 lines, 16px |

`2 rows x 164 + 16 = 344` ✓ · `8 x 164 + 7 x 16 = 1424` ✓

**⚠️ It goes 4 → 4 → 1 columns. There is no 2-column tier.**

### The border matrix is UNIFORM

Not a hand-authored per-cell matrix like `sections/Security.tsx`. **Every** tile is
`border-top: 1px` + `border-right: 1px`, colour `#73737326`, style solid, on all three tiers.
Painted with `[data-border]::after`, so it costs no layout space:

```jsx
<span aria-hidden="true" className="pointer-events-none absolute inset-0 border-t border-r border-muted/15" />
```

Tile itself: `min-height: 164px`, `padding: 0`, `display: flex`, `flex-direction: column`,
`align-items: center`, `justify-content: center`, `gap: 10px`.

---

## Block 4 — `Investors` → clix's twelve tools

```
div[Investors]  bg surface
  div[Container]  maxW 1280, col, gap 40 (≥810) / 32 (≤809)
    div[Title]    maxW 490 > h3        (heading only, NO intro paragraph)
    ul            the grid
```

| | ≥1200 | 810–1199 | ≤809 |
|---|---|---|---|
| grid columns | **3** | **2** | **1** |
| tile | `410.67 x 180` | `460 x 180` | `358 x 180` |
| grid gap | 24 | 24 | 24 |
| grid box | `1280 x 792` | `944 x 1200` | `358 x 2424` |
| h3 box | `490 x 96.8` 2 lines | `490 x 88` 2 lines | `358 x 70.4` 2 lines |

`4 rows x 180 + 3 x 24 = 792` ✓ · `6 x 180 + 5 x 24 = 1200` ✓ · `12 x 180 + 11 x 24 = 2424` ✓

### Border matrix, also uniform

**Every** tile is `border-top: 1px` + `border-left: 1px`, same `#73737326`. Note this differs
from Block 3, which is top + **right**.

```jsx
<span aria-hidden="true" className="pointer-events-none absolute inset-0 border-t border-l border-muted/15" />
```

Tile: `min-height: 180px`, `padding: 0`, flex column, centred, `gap: 10px`.

---

## Block 5 — `Reiteration`

```
div[Reiteration]  col, no padding
  div[Top]        bg paper, pad 96/64 + gutter, gap 96
    div[Container]  maxW 1280, ROW gap 64 (≥1200) / COL gap 24 (≤1199)
      div[Title]      maxW 490, gap 8
        div             an EMPTY 20px eyebrow slot
        h3              line 1 ink + <span> line 2 muted
      div[Container]  gap 24
        p
        the 124x36 CTA
  div[image]      FULL BLEED, height 596 (≥810) / 300 (≤809), object-cover, position 50% 50%
```

| | ≥1200 | 810–1199 | ≤809 |
|---|---|---|---|
| Container | row, gap 64 | column, gap 24 | column, gap 24 |
| h3 box | `490 x 96.8` 2 lines | `944 x 88` 2 lines | `358 x 70.4` 2 lines |
| p | `726 x 46.8` 2 lines, 18px | `944 x 20.8` 1 line, 16px | `358 x 62.4` 3 lines, 16px |
| image | `1440 x 596` | `1024 x 596` | `390 x 300` |
| Top height | 316.8 | 348.8 | 372.8 |

**The two-tone h3 is ONE element with an inner `<span>`**, never two sibling blocks, or the
halves wrap independently and the sentence breaks.

There is a **20px-tall empty eyebrow slot** above the h3 in the original. It renders nothing.
Reproduce it, since removing it changes `Title`'s height by 28px (20 + the 8 gap).

CTA → `/careers`, which another session is building concurrently.

---

## Tokens used

`ink` · `paper` · `muted` · `bone` · `surface` · `--container-max` (1280) · `--ease-rogo`.

New: **`#73737326`** = `muted` at 15%, the grid rule. Expressed as `border-muted/15`, no new
token needed.

---

## Open questions

1. Is the **Unit 8200 and Technion** line substantiable? It gates `noindex`.
2. Should the stock photo be replaced with a real team photograph when one exists?
3. `/careers` must exist before Block 5's CTA resolves. Being built concurrently.

---

## Acceptance checklist

- [ ] Matches the reference at 1600 / 1440 / 1024 / 390
- [ ] Spacing, type and colour from tokens, or the deviation is recorded above
- [ ] All interactive states (hover, focus-visible, active)
- [ ] Motion timing and easing match, or reduced-motion is honoured
- [ ] Keyboard reachable, meaningful `alt`, contrast checked
- [ ] `npm run build` passes with no type errors
- [ ] Both `CONTEXT.md` files and `docs/SECTIONS.md` updated
