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
| 4 | `Team` | `CompanyServices` | `bone` `#f5f2eb` | ~~793.03~~ **rebuilt, see Block 3** |
| ~~5~~ | ~~`Investors`~~ | ~~`CompanyTools`~~ | ~~`surface`~~ | **DELETED 2026-08-16** |
| 5 | `Reiteration` | `CompanyCareers` | transparent / `paper` | 912.81 |

⚠️ **FIVE BANDS AS OF 2026-08-16, NOT SIX.** The `Investors` band shipped here as clix's
twelve tools and was deleted on the user's call — it was a second logo-wall grid sitting
directly under the first, the same shape saying less. `TOOL_MARKS` survives; /clix's
`ClixLogoProof` still renders all twelve.

~~Document height: **5050 @1600 and @1440 · 5036 @1024 · 7561 @390.**~~ **STALE** — both a
band removal and a Block 3 rebuild land in that number. Re-measure before quoting it.

### Band padding and gap

| Band | ≥1200 | 810–1199 | ≤809 |
|---|---|---|---|
| `Hero` | `198px 40px 64px`, gap 96 | `198px 40px 64px`, gap 96 | `198px 16px 64px`, gap 96 |
| `Video` | `0 40px` | `0 40px` | `0 16px` |
| `Mission` | `96px 40px` | `64px 40px` | `64px 16px` |
| `Team` | `96px 40px` | `64px 40px` | `64px 16px` |
| `Reiteration` / `Top` | `96px 40px`, gap 96 | `64px 40px`, gap 96 | `64px 16px`, gap 96 |

So the gutter is `px-4 tablet:px-10` and the vertical rhythm is `py-16 desktop:py-24`
(`64px` → `96px` at 1200), with the Hero a fixed one-off.

### Type presets, measured

**h3 (Mission, Team and Reiteration share it; `Investors` did too, until it was deleted):**
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

## Block 3 — `Team` → clix's eight services, as eight animated cards

⚠️ **REBUILT 2026-08-16, AND THIS IS THE ONE BAND ON THE ROUTE WHOSE BOX IS NO LONGER ROGO'S.**

### What it was, and why it changed

It shipped as rogo's `Team` grid with clix's content in it — eight 164px tiles, **4 → 4 → 1**,
each a 32px mark over a label, hairline-ruled top + inline-end, every value measured off
`docs/reference/target/rogo-company-2026-08-12.{html,css}` and reproduced exactly. The band
below it (`Investors` → `CompanyTools`) was that same shape a second time.

The user's brief was a "huge ui update": delete the tools band, and make this one **present**
each service instead of naming it. The named reference was the `#services` band on
`clix-main-page.vercel.app` ("פתרון מותאם לכל עסק.") — a sticky heading beside a column of cards,
each carrying a piece of product UI that shows what the service produces.

### What survives from the measured build

- `bone` ground, `96/64px` block padding, `40/16px` gutter, `--container-max` — untouched.
- The h3 preset (`44 / 40 / 32`, 400, 110%, −0.05em) and the body preset (`18 / 16`, 130%,
  −0.02em) — untouched, and still byte-identical to /product's.
- The eight service names, same order, same source (`pages/services.html`'s eight H2s).
- All eight marks in `serviceGlyphs.tsx`, now at **20px** in a card header rather than 32px
  above a label. Nothing about the drawings changed — only their box.

### What replaced the grid — REBUILT TWICE MORE ON 2026-08-17: STACK, THEN REEL

⚠️ **THE 2-COLUMN GRID LASTED ONE DAY AND THE STICKY STACK LASTED HALF OF ONE.** Two briefs,
same day:

1. *"make it like scroll animation, only 1 service per scroll, give it like modern and better
   looking UI and animation"* → the grid became a **sticky card stack**. It put all eight
   services on screen at ~304px each and none of them got read; eight cards competing is eight
   cards ignored.
2. *"i think this one is better for the 8 services section, we can use this layout but keep the
   current cards"*, with a reference layout — a scroll-driven list of titles beside a media
   track that slides in step with it → the stack became a **reel**.

⚠️ **THE SECOND REBUILD CHANGED THE CONTAINER AND NOTHING ELSE.** All eight scenes, all eight
step maps and the whole process player came across unaltered. `serviceArt.tsx` was not touched
by it at all.

⚠️ **THE MEASUREMENT THAT MADE THAT POSSIBLE, RECORDED SO IT IS NOT RE-DERIVED.** `Stage` caps a
scene at **560px**, and the sticky card's art well **already hit that cap** — so a 52% art
column in a 1280 frame renders every scene at *exactly* the size it had before. Had that not
been true the answer would have been no: it would have been a redraw of eight mocks rather than
a rewrite of one container.

```
section[bone]                        ⚠️ NO overflow-hidden, ever — see below
  div[Container]   maxW 1280
    div[Heading]     full width · ROW ≥1200 (h2 cap 640 | intro cap 460) · stacked below
      h2 · p
    ServiceReel      "use client" passthrough — the band's ONLY client JS
      div.service-reel[data-reel-scroller]   minH = 100svh + 7 × --reel-step
        div            position: sticky · top 0 · minH svh · pt --nav-peak-h + 8
          div[data-reel-frame]   bg white · hairline · shadow-float · ROW ≥810
            div[names+detail]  flex-1
              .reel-window(--reel-list-h, faded)
                ol.reel-track--names      translateY(-i × --reel-item-h)
                  li × 8 [data-reel-item] · button[data-reel-go] · bar + name
              .reel-window(--reel-detail-h)
                div.reel-track--detail    translateY(-i × --reel-detail-h)
                  div × 8 [data-reel-detail] · promise + stack chips
            div[art].reel-window(minH --reel-art-h, faded)   basis 52% ≥810
              div.reel-track--art         translateY(-i × --reel-panel-h)
                div × 8 [data-service-card][data-reel-panel] · kicker + ServiceArt
```

⚠️ **ONE NUMBER DRIVES ALL THREE TRACKS.** `--reel-i` is written on the frame by
`ServiceReel.tsx`; each track multiplies it by **its own** item height. That is how the names,
the detail and the art move as one gesture while moving three different distances.

| | ≥1200 | 810–1199 | ≤809 |
|---|---|---|---|
| heading | h2 BESIDE intro | stacked | stacked |
| frame | names · art | names · art | names ABOVE art |
| art column | `basis-[52%]` | `basis-[52%]` | full width |
| name type | 34px | 24px | 20px |
| `--reel-step` | `56svh` | `52svh` | `46svh` |
| `--reel-item-h` | 64px | 54px | 44px |
| `--reel-list-h` | 258px | 218px | 112px |
| `--reel-detail-h` | 156px | 140px | 128px |
| `--reel-panel-pad` | 24px | 20px | 16px |
| `--reel-caption-h` | 24px | 22px | 22px |
| `--reel-panel-h` | `clamp(300, 46svh, 440)` | `clamp(250, 38svh, 330)` | `clamp(180, 27svh, 235)` |
| `--reel-art-h` | `clamp(430, 66svh, 620)` | `clamp(360, 56svh, 470)` | `clamp(210, 32svh, 280)` |

All of them live in **`globals.css` under `.service-reel`**, not at the call site: most are
per-tier and a custom property cannot be set responsively from inline `style`.

⚠️ **THE ART MASK FADES OVER `--reel-overhang`, A COMPUTED LENGTH, NOT A PERCENTAGE.**
`(--reel-art-h − --reel-panel-h) / 2` is the overhang by definition, so the fade covers exactly
the neighbouring panels and stops where the live one begins. It shipped as 14% of the window,
which is ~87px at desktop against a 90px overhang — correct by coincidence — and ~38px on a
phone against a 21px overhang, where it dissolved the live panel's own caption. **A fraction of
a container is not a substitute for the distance you actually need to cover.** The name list
keeps the 14% default because its rows have no overhang to measure.

⚠️ **THE ART COLUMN IS TWO ELEMENTS: ONE PAINTS AND CLIPS, THE INNER ONE MASKS.** A mask applies
to the element it is set on **including that element's own background** — with
`reel-window--fade` on the column, the `ink` ground bled to white over ~90px top and bottom
against `bone`, reading as two grey gradient bands rather than as scenes going out of focus.
**Never put a mask on an element that also paints a background.** The names window is one element
because it has no background of its own.

⚠️ **`--reel-art-h` IS DELIBERATELY TALLER THAN `--reel-panel-h`, AND THAT DIFFERENCE IS THE
WHOLE EFFECT.** It is what lets the previous and next scenes peek in, blurred, behind the mask.
Equalise them and this stops being a reel and becomes a cross-fade.

⚠️ **`--reel-scene-max` IS A DERIVED VALUE AND IT IS WHY THE SCENES NEVER OVERFLOW.**
`(--reel-panel-h − 2 × --reel-panel-pad) × 1.528` — the panel's height converted back into a
width, `1.528` being `440 / 288`. `Stage` is **width**-driven, so a short viewport shrinks the
panel without shrinking the scene; this caps the scene's width at whatever the panel's height
can actually accommodate, so the fit holds by construction rather than by four hand-checked
breakpoints. **If the source box changes, this constant changes with it.**

⚠️ **THE ART COLUMN USES `min-height`, NOT `height`.** The frame is `items-stretch`, and a flex
item with an explicit height does not stretch — so on a short viewport, where the names column's
fixed windows total more than `--reel-art-h`, the art column would stop short and leave a band
of white beneath it.

⚠️ **NO `overflow-hidden` ON THE SECTION, THE CONTAINER, THE ServiceReel WRAPPER, OR THE
SCROLLER.** An ancestor with `overflow: hidden` becomes a sticky element's scroll container, so
the frame pins to a box that scrolls away with the page — i.e. it does not appear to pin at all.
This band has already paid for that bug once. The clipping the reel needs happens **inside** the
frame, on the three track windows, which are descendants of the sticky element and harmless.

⚠️ **THE STICKY IS ON THE WRAPPER — NOT ON THE SCROLLER, NOT ON THE FRAME.** On the scroller it
would reintroduce the entire measurement problem the rewrite deleted (below). On the frame it
would collide with the frame's own `overflow-hidden`.

### What went with the stack

- **`.service-stack` and its four `--stack-*` numbers**, the sticky `<li>` deck, `isolate`, the
  recede tween, the 3px top rule, and **`flowTop()`** — the hand-rolled document-space
  measurement that existed only because ScrollTrigger cannot measure a stuck element. ≈180 lines
  of the band's hardest code, deleted.
- **The one-shot text entrance.** The name, promise and chips change on every index now, so a
  once-only stagger has nothing to attach to. They cross-fade in CSS instead.
- **`--nav-peak-h` as a rest offset** → it is `padding-top` on the sticky wrapper, doing the same
  job for the same reason: the nav's banner returns on upward scroll, so anything pinned beneath
  it must clear the banner and not just the row.

### What came back

- **`kicker`.** Cut on 2026-08-17 with the templated icon-tile row, unrendered in both
  dictionaries since. The reel has a caption slot over the live scene — the reference layout puts
  a location there — and a **sourced** one-line reason for the service is a better tenant than an
  invented one. It is no longer part of an `01 · KICKER` eyebrow, which is what was wrong with it.
- ~~**A position indicator**, as `01` over `08` in the frame's rail.~~ **REMOVED WITHIN A
  MINUTE OF THE USER SEEING IT** — *"remove the border and the number from left side"*. ⚠️ **THIS
  BAND HAS NOW REJECTED A POSITION INDICATOR TWICE, IN TWO DIFFERENT FORMS** (eight coloured
  ticks; two digits in a rule), so the pattern is the point rather than the execution. It has
  none, deliberately, and nothing here says which of eight you are on. **Do not propose a third
  form.** `ServiceReel` still writes `--reel-i` and `data-state`, so one could be re-hung on
  markup alone if the user ever asks.

### The frame

White, `1px` `hairline` border, **radius 0**, `shadow-float`, on `bone`. The art track is `ink`
(/security's ground) — the scenes are white `Surface`es, so the contrast does the work a 5%
accent tint over `bone` was straining at.

| Slot | Spec |
|---|---|
| name | **18 / 24 / 34** `font-display`, 110%, −0.02em · `muted` 400 → **`ink` 700 when live**. ⚠️ The only weight-700 type on the site, on the user's call (*"make the title of the card bold when its active"*) — a deliberate exception, and a REAL instance because Discovery is variable with `font-weight: 100 800` declared. Check this if the face is ever swapped for a static one. |
| live-row dash | `inline-size` 0 → **24 / 32px**, `block-size` 2px, **`ink`** — ⚠️ not the accent, on the user's call, and the SECOND time this band has reversed exactly that (the stack's 3px card-top rule went the same way). Eight services are one system; a marker that changes colour per service says the opposite. |
| kicker | 11px `font-sans` 400 uppercase, `white/55`, +220ms delay, `truncate`. ⚠️ **In a RESERVED BAND above the scene (`--reel-caption-h`), never over it** — it shipped as an overlay and sat on the scene at every size. The band is added to the panel's block-start padding *and* subtracted inside `--reel-scene-max`; change one without the other and the scene overflows. |
| promise | **15 / 16 / 18** `font-sans` 400, 140%, −0.01em, `muted` |
| chips | 11 / 12px, `hairline` border, `dir="ltr"` |
| scene | **440 × 288** source units, capped at `min(560px, --reel-scene-max)` |

⚠️ **NAME ROWS ARE FIXED-HEIGHT AND `whitespace-nowrap`.** The track translates by
`--reel-item-h`, so a name wrapping to two lines would overflow its row. Every string in both
dictionaries sets on one line with ~35% to spare at every tier; `nowrap` makes a future violation
obvious (a clipped name) rather than silent (a broken reel).

⚠️ **THE DETAIL WINDOW IS FIXED-HEIGHT AND IT CLIPS.** Sized for the longest Hebrew promise plus
two rows of chips. **This is the one measurement in the reel a translator can break — check /he
whenever the copy changes.**

⚠️ **THE DETAIL IS A THIRD TRACK, NOT EIGHT ABSOLUTELY-STACKED BLOCKS.** Stacked absolutely, all
eight promises would print on top of each other before any `data-state` is written — i.e. with JS
off. As a track it inherits the same `var(--reel-i, 0)` fallback as everything else.

### The motion (`ServiceReel.tsx` + `globals.css`)

⚠️ **NO STYLE IS WRITTEN FROM JS.** The controller writes `--reel-i` and `data-state`; every
visual state is an attribute selector in `globals.css`. That is what keeps `CompanyServices.tsx`
a server component.

| | What | Gated on reduced motion? |
|---|---|---|
| Index | `i = round(progress × 7)` → `--reel-i` + `data-state` + `data-idle` | **no — it is state, not motion** |
| Track glide | `transform` 700ms `--ease-rogo`, all three tracks | CSS clamps duration to 1ms |
| Panel depth | live sharp · **±1** `opacity .3 / scale .86 / blur 5px` · rest `opacity 0` | blur dropped, rest kept |
| Process | each scene assembles, holds `HOLD`, dissolves, repeats | **yes — no timeline is built at all** |
| Jump | click / Enter a name → smooth scroll to its position | `behavior: "auto"` |

⚠️ **`round`, NOT `floor`.** With `floor`, service 8 would be reachable only in the single frame
where progress is exactly 1, and the first seven would each change over on arrival rather than at
the midpoint. `round` puts the changeover halfway between two services, so each holds the frame
for a full `--reel-step`.

⚠️ **THREE PANEL STATES, NOT TWO, AND THE THIRD IS A COST DECISION.** `near` is the pair either
side of the live scene — visible through the mask, so they carry the blur. `far` is the other
five: outside the window entirely, so they are simply not drawn rather than composited blurred
every frame for nothing.

⚠️ **THE MEASUREMENT PROBLEM IS GONE, AND THE REASON MATTERS IF ANYONE MOVES THE STICKY.** The
stack could not use a card as a ScrollTrigger `trigger`: ScrollTrigger resolves start/end from
`getBoundingClientRect()`, which for a **stuck** element reports where it is *painted*, not where
it sits in the document, so every trigger had to be rebuilt from `offsetTop`. Here the element
being measured (`[data-reel-scroller]`) is **not** sticky — its child is — so a plain
`start: "top top" / end: "bottom bottom"` is honest.

⚠️ **THE NAMES ARE REAL `<button>`s.** The reference layout hangs `onClick` on the `<li>` and
marks passed items `pointer-events: none`, so its list is keyboard-unreachable and one-way by
mouse. Eight services a keyboard user cannot reach is a functional failure on a services page,
not a nitpick. Passed items sit at **0.15 opacity, not 0**, for the same reason: a control you
can still focus is a control you must still be able to see.

⚠️ **`data-service-card` IS A FOSSIL AND IS LOAD-BEARING.** It is what `globals.css`'s
`[data-service-card][data-idle] *` animation gate selects on. The panels carry both it and
`data-reel-panel`; renaming it would mean touching the gate for nothing.

⚠️ **THE REEL STILL TRACKS UNDER REDUCED MOTION — IT CUTS INSTEAD OF GLIDING.** Freezing the
tracks would leave the band showing service 1 forever, which is not a calmer version of the
feature, it is a broken one. The blur goes; the position changes stay, because they are
information. `ServiceReel.tsx` makes the *separate* decision not to build the scene timelines.

⚠️ **`pin:` STILL APPEARS NOWHERE AND SHOULD NOT.** `position: sticky` is what a pin was wanted
for, without the viewport lock. The band's one `scrub:` went with the recede — there is now no
scrubbed tween on this page at all.

---

## Block 3a — the eight scenes (`serviceArt.tsx`)

⚠️ **SEVEN OF THE EIGHT ARE SOURCED, NOT INVENTED.** clix's own services page already ships a
distinct UI mock per service and `docs/reference/clixsolutions/content.json`
(`services.bodyText`) records what each one contains:

| # | Service | Source mock, as the capture records it |
|---|---|---|
| 1 | AI Agents | `Agent OS · AI workforce`, `8 active`, roster of 4 with latency + state |
| 2 | WhatsApp | chat thread, delivery ticks, catalog row |
| 3 | CRM | `CRM · Q3`, `+38%`, `Deals 63`, `Pipeline $1.2m`, `Won $480k` |
| 4 | Integrations | `new-lead.workflow · v1.4`, `5 nodes 4 links`, Webhook→AI parse→HubSpot→Slack→Gmail |
| 5 | Web Development | browser at `clixsolution.com`, `98 PSI`, `+24% conversion` |
| 6 | Mobile Development | ⚠️ **NONE — the capture describes no artwork for this block** |
| 7 | Custom Software | editor: `dashboard.tsx`, `api.ts`/`types.ts`/`schema.sql`, `main · TypeScript`, `build ok` |
| 8 | AI Strategy | `78 ai ready`, scores 82/64/91/58/73, `SOC 2 · GDPR` |

**#6 is the band's one designed scene** — built from that service's own bullet list (React
Native, push notifications, deep links, offline-first sync). It is the only place on this band
where the picture is ours rather than the company's. Recorded in Open questions below.

### The scenes carry real content — REVERSED 2026-08-17

⚠️ **THE ORIGINAL RULE WAS "EVERYTHING SENTENCE-SHAPED RENDERS AS A GREY BAR".** It held while
the card was 304px wide, where a bar read as *a sentence, deliberately blurred*. On the stack
the mock is ~680px and the same bars read as **SKELETON UI** — a page that has not finished
loading. User: *"can you add more to it, rather than just some skeleton UI?"*, and they were
right.

**What was wrong with it** was not the locale-free goal but the assumption underneath: that a
real product UI is mostly prose. It is not. It is names, statuses, counts, IDs, filenames and
code — **machine content, Latin in every locale**, which was being redacted for no benefit.
The eight scenes now carry it:

| # | What replaced the bars |
|---|---|
| 1 | agent names + live tasks + a stat strip (`142 conversations · 1.2s avg first reply · 98% resolved`) |
| 2 | four real chat messages, timestamps, ticks, `Lead created in HubSpot · Deal #2041` |
| 3 | named pipeline stages with deal counts, values and days-in-stage |
| 4 | every node says what it does to the payload (`Extract name, company, intent`) |
| 5 | real nav, a real CTA, three real card titles, real Core Web Vitals |
| 6 | a real list screen, tab labels, a real push, `clix://orders/4023` |
| 7 | **real TypeScript** — and it is scene 4's workflow written out, the same system from the other end |
| 8 | the five areas named, each with the finding behind its score |

**Still true, and still the rule:** not one new dictionary key. Every string above is a machine
token at `direction: ltr`, so /he needs no translation and no line-fit audit.

**Two deliberate exceptions, both recorded at their call site:**

1. ⚠️ **Scene 2's four chat messages are genuine prose.** They are English in both locales.
   On /he a Hebrew customer would have typed Hebrew — **flagged to the user 2026-08-17, open.**
   If the answer is "translate them", they move to `company.services` in both dictionaries.
2. **Scene 5's headline is still two bars, and there that is correct** — it is a headline in a
   page *thumbnail*, too small to read, surrounded by real labels. Bars are fine as the
   minority; they were never fine as the default. It also keeps that scene locale-free, since
   a headline is the one string in it that would genuinely need translating.

Unchanged: the real site's chat mock is a stock template in someone else's business ("2 kurtas",
"Rs.1200"). Porting its words would be borrowing copy; porting its **shape** is the rebuild —
so scene 2's exchange is clix's own (a lead qualifying itself and booking a demo).

### Coordinates

One **440 × 288** source box per scene — **was 280 × 168 until 2026-08-17**, widened with the
stack because the art well went from ~264px to ~680. Every dimension `u(n)`, same idiom as
`product/benefitArt.tsx` and `product/workflowMocks.tsx`. `Stage` makes itself a query container
and hands its children `--u = 1cqw / 4.4`, so a scene **scales** with the card rather than
reflowing. Capped at **560px** so it never outgrows the well.

⚠️ **THE MIGRATION RAN BOTH BOXES AT ONCE AND THAT SCAFFOLDING IS GONE.** `Stage` / `Header`
briefly defaulted to the old box so scenes could move over one at a time. With all eight moved,
`Panel` (the flat, shadowless predecessor of `Surface`) and the old constants were deleted.

⚠️ **`Surface` HAS DEPTH AND `Panel` DID NOT.** A hairline-outlined rectangle was right when the
mock was a 264px detail; at 680px it reads as a wireframe. Two shadows, the same two-part shape
as `--shadow-float`, **in source units** so they scale with the scene like everything else.

⚠️ **EVERY PRIMITIVE IS ABSOLUTE AGAINST ITS NEAREST POSITIONED ANCESTOR.** A `Metric` written
*next to* a strip rather than *inside* it resolves against the `Surface` and lands in the header.
Nest, and the coordinates stay local. (Cost one bug on 2026-08-17.)

⚠️ **`container-type` is on the OUTER element and `--u` on the inner one.** An element
establishes a query container for its *descendants*, not itself; declaring `1cqw` on the same
node resolves against the ancestor and silently mis-scales.

⚠️ **Radii inside a scene are depiction, not style** — a chat bubble, a browser pill, a handset.
Same licence `workflowMocks.tsx` takes reproducing a card corner read off a screenshot.

### RTL

`Box` and `Line` take source-LTR `x` and resolve it with `inset-inline-start`; `end` flips a
child to `inset-inline-end`. No `280 − x − w` arithmetic anywhere. **All eight scenes mirror** —
the horizontal axis carries reading order in every one, and none depicts fixed foreign chrome.

### Motion — two layers

`serviceArt.tsx` itself is still pure CSS and still server-rendered: no GSAP, no framer-motion
(**not installed** — `package.json` has only `gsap` + `@gsap/react`), no `"use client"`. All the
JavaScript in this band lives one level up in `ServiceReel.tsx`.

**Layer 1 — the ambient loops** (`src/app/globals.css`). Un-sequenced, run forever, say *this
thing is live*. **THREE** keyframes — `service-step` and `service-pulse` were both deleted on
2026-08-17:

| Keyframe | What it does | Applied to |
|---|---|---|
| `service-rise` | `translateY(0 → −2 → 0)` | the one OUTCOME element per scene |
| `service-typing` | the three dots of a typing indicator | scenes 1 and 2 |
| `service-caret` | a text caret, hard on/off (`step-end`) | scene 7 |

⚠️ **TWO KEYFRAMES HAVE NOW BEEN DELETED FOR THE SAME REASON AND IT IS THE BAND'S MOST
LOAD-BEARING RULE.** `service-step` painted a travelling wash across a table row and read as
*hover*. `service-pulse` faded a 5px accent dot beside each scene's title and promised something
was happening right now, when nothing was — it pulsed identically on a finished report, a draft
and a browser window. Both were **decoration wearing the costume of information**.

**A loop that decorates CHROME will be read as a claim about STATE.** If it is not describing
something genuinely happening to the element it sits on, it does not belong here. The three
survivors all pass: a chat client draws a typing indicator, an editor blinks a caret, and the
rise happens to the one element that *is* the outcome.

⚠️ **`Typing` IS `mock-line` GREY, NOT `ACCENT`, SINCE 2026-08-17.** It was the last coloured
dot in the file once `Dot` went, and the brief was *"remove these colored dots"*. Grey is also
more accurate — no chat client draws its typing indicator in the brand colour. **Scene 5's three
grey browser traffic lights are not affected and never were:** they are the window, not a claim
about it.

**Layer 2 — the process** (`ServiceReel.tsx`, added 2026-08-17). Sequenced, plays on arrival,
loops while the service is live. Its own section below.

⚠️ **`service-step` WAS DELETED AND MUST NOT COME BACK IN THAT FORM.** It was the workhorse —
a soft accent wash on an overlay, staggered down a scene's rows so exactly one was lit at a
time, 31 instances — meant to read as *a sequence advancing*. It read as **hover**: a tinted
band across a table row is the universal signifier for hover or selection, so every scene
looked like it had a cursor in it that nobody was moving. The user caught it twice unprompted.
**The rule that came out of it:** a loop that paints a row CONTAINER borrows a UI state and will
always be misread as one. Motion that says "live" must happen to the CONTENT and must be
something the depicted product genuinely does.

⚠️ **THE INVARIANT, INHERITED FROM /product BLOCK 4: every keyframe's base state is the shipped
static design.** A resting typing indicator is three dim dots; a resting caret is a visible
cursor. The unanimated scene is the finished picture — every roster row present, every bar at
its scored length. The global reduced-motion clamp is therefore an **exact no-op**, and SSR
first paint is complete. Written the other way round, a reduced-motion visitor would get eight
empty panels.

⚠️ **Opacity and `translateY` only**, and the Y is not stylistic: it is the one axis that does not
flip under RTL, so these loops need no `[dir="rtl"]` companion the way `.benefit-bar` does. This
now governs `ServiceReel.tsx` too — its tracks translate on Y only, so they
mirrors for free; the moment someone sets a `transform-origin` the band owes /he a second rule.

⚠️ **VIEWPORT-GATED SINCE 2026-08-17, AND THIS SECTION USED TO SAY THE OPPOSITE.** It read *"not
viewport-gated — gating decoration would cost more than the decoration does"*, which was true of
the GRID: every card was on screen together and a gate bought nothing. In a stack, seven of the
eight scenes are behind another card at any moment, so ~35 of the ~40 loops were animating things
nobody could see. `ServiceReel` marks every non-live panel `data-idle` and globals.css pauses
them — one live scene now rather than the stack's two.

⚠️ **THE GATE IS OPT-OUT (`[data-idle]` pauses), NOT OPT-IN.** The attribute is written by client
JS: with JS off, or before hydration, no attribute exists and every scene animates exactly as it
did before the stack shipped. Written the other way round, a no-JS visitor would get eight frozen
scenes. The frozen state is the finished picture either way — see the invariant above — so the
opt-out form costs nothing and removes a whole failure mode. The live window is **two** cards
wide (active + arriving), because the arriving one is visibly sliding up and freezing it would
show a scene stop dead on its way in.

### The process — each scene plays itself (2026-08-17)

User: *"i want some movements per cards, for example like the process for the service, its like
the presentation, i want it to look good and modern and smooth"*. Two choices taken with them:
**plays itself on arrival** (not scrubbed to scroll — the pace must not be whatever the
visitor's wheel does), and **the whole process loops** while that card is the live one, so
nothing is missed regardless of when you look.

⚠️ **THE CHOREOGRAPHY IS DATA IN THE SCENES; THE TIMING IS CODE IN THE PLAYER.**
`serviceArt.tsx` marks elements, `ServiceReel.tsx` turns step ORDER into TIME. There is no
per-scene JavaScript and there must not be: eight bespoke timelines would be eight things to
retune every time a scene is redrawn.

| Marker | Beat |
|---|---|
| `step={n}` on a primitive | reveal — opacity, and a 6px lift. The default. |
| `count` on a `Line` | the number counts up to the value already in the HTML |
| `Track` | groove + fill; the fill grows to its scored length |
| *no marker* | **chrome** — present from the first frame, never leaves |

`count` and the `Track` fill carry no step of their own: they take the step of their nearest
marked ancestor, so a bar grows and a stat counts on the same beat as the row they belong to.

#### The eight step maps — the order *is* the process

| # | Scene | Beats |
|---|---|---|
| 1 | AI Agents | 1 header · 2 stat strip (`142`, `1.2s`, `98%` count) · 3 column headings · 4–7 the four agents in roster order, ending on the booking |
| 2 | WhatsApp | 1 contact header · 2 the question · 3 the reply · 4 the follow-up · 5 `Booked — Thu 14:00` · 6 typing · 7 `Lead created in HubSpot` |
| 3 | CRM | 1 header · 2 KPIs (`63`, `$1.2m`, `$480k` count) · 3 column headings · 4–7 the four stages, each bar growing as its row lands |
| 4 | Integrations | 1 header · 2 the wire · 3–7 the five nodes down the chain · 8 `success` |
| 5 | Web | 1 site nav · 2 hero + CTA · 3–5 the three feature cards · 6 vitals (`98`, `0.9s`, `0.01` count) + `+24% conversion` |
| 6 | Mobile | 1 app header · 2–4 the three orders · 5 tab bar · 6 the four side cards · 7 the push arriving |
| 7 | Custom Software | 1 explorer · 2–8 the seven code lines, one per beat — the file writes itself · 9 terminal · 10 `build ok` |
| 8 | AI Strategy | 1 header · 2 column headings · 3–7 the five areas, bar growing while the score counts · 8 the verdict (`78` counts) |

**Scenes 5 and 6 deliberately start at their content, not their frame.** The browser window and
the handset carry no step: a window that faded in around its own page would be animating the
wrong noun. The frame stays and the content loads — which is what both products actually do.

#### Timing — the four knobs, all in `ServiceReel.tsx`

| Constant | Value | What it is |
|---|---|---|
| `LEAD` | `0.3s` | dead time before beat 1 |
| `BEAT` | `0.22s` | gap between beats. **The pace of the whole thing** — the number most likely to move. |
| `HOLD` | `4.5s` | how long the finished scene is held before it dissolves and replays |
| `REVEAL_D` / `FILL_D` / `COUNT_D` | `0.5` / `0.7` / `0.9s` | per-beat durations |

Cycle length is therefore **7.3s (scene 5, six beats) to 8.1s (scene 7, ten beats)**.

⚠️ **THE PROCESS LOOPS; THE COPY DOES NOT.** The card's text (`[data-card-rise]`) plays its
entrance exactly once and is deliberately not in the repeating timeline. Re-animating a heading
and a paragraph every seven seconds beside copy someone is reading is the failure mode this band
has already been caught on. **Motion loops on the picture, never on the prose.**

⚠️ **THE CYCLE ENDS WITH A 0.45s DISSOLVE, AND WITHOUT IT THE LOOP IS UNWATCHABLE.** A repeating
timeline jumps from its last frame to time 0, where every `from()` renders its start — so the
finished scene would vanish in one frame and rebuild. Only the *marked* elements fade; the
chrome never leaves, so what the eye sees is a window whose contents reload.

⚠️ **A PARKED CARD SITS ON THE FINISHED SCENE, NOT AT `progress(1)`.** Because the cycle ends
faded out, seeking a paused timeline to its end would park every off-screen card blank. It is
seeked to `rest` — the moment the scene is complete and still.

⚠️ **NEVER PUT A `step` ON A NODE THAT CARRIES A CSS ANIMATION.** A CSS animation beats an
inline style in the cascade, so the beat's opacity and transform are silently swallowed. Mark
the container — which is why scene 6's push card sits inside a bare wrapper. `count` is exempt:
it writes `textContent`, not style, so it shares a node with `RISE` happily (scene 8's `78`).

⚠️ **THE "NO X-AXIS MOTION" RULE IS AMENDED, AND ONLY FOR THE PLAYER.** Scenes 3 and 8 used to
carry *"every bar sits at its measured length at rest — never a bar growing"*, because a growing
bar needs a `transform-origin` and an origin is the one thing on this band that does not mirror
for free. That reasoning was about **CSS keyframes, which cannot know which way the document
reads**. A GSAP tween can: `documentElement.dir` is one line, and `FILL_ORIGIN` picks the origin
per locale. The CSS-side prohibition stands unchanged; `ServiceReel.tsx` is the one place with
the information to be exempt from it. The bars still **rest** at their measured length — every
beat is a `from()`, so reduced motion and JS-off see full bars exactly as before.

---

## Block 3b — colour, the floating heading, and the card hover (2026-08-16, second pass)

User: *"add some colors and make the header floats when floating, and when hovering to a card,
make it bigger add a hover animation that is good"*. Three additions, all on top of Block 3
rather than instead of it.

> ⚠️ **TWO OF THESE THREE NO LONGER EXIST (2026-08-17, the sticky-stack rebuild).** Kept for the
> reasoning, not as a spec — read Block 3 above for what ships.
>
> | | Status after 2026-08-17 |
> |---|---|
> | **One accent per card** | **LIVE, and doing more work than before.** Still the fourth positional tuple; the wash is now always-on rather than hover-gated, and `Chip` / `Avatar` / `Surface` all read it. |
> | **The heading pins** | **GONE.** The heading is full-width above the reel. Its `--nav-peak-h` reasoning did not go with it — it is now `padding-top` on the reel's sticky wrapper, which is what the *frame* rests at, for exactly the reason recorded below. |
> | **The card hover** | **GONE.** `CARD_HOVER` deleted; a card that owns the stage does not need to grow 4% to be noticed, and `hover:z-10` would fight the stack, whose whole mechanism is source order. |
>
> The `overflow-hidden` warning below is the one thing that got **more** load-bearing, not less:
> it broke one heading in 2026-08-16 and would break the entire section now.

### One accent per card

Eight `--color-svc-*` tokens, full table and contrast figures in
[docs/DESIGN-SYSTEM.md](../../docs/DESIGN-SYSTEM.md). The short version:

- **A set, not eight picks** — every one lands between **6.07 and 6.81:1 on white**, a 0.74
  spread, so no card reads louder than its neighbours. Tuned: the first pass ran 5.35–7.58 and
  the indigo card dominated the grid.
- **All eight clear AA on all three grounds they touch** (white, `bone`, `mock-panel`; worst
  5.43:1). Not decorative headroom — `+38%`, `98`, `build ok` and `78` are real type.
- **Assigned positionally**, the fourth tuple on this band after `cards`, `SERVICE_GLYPHS` and
  `SERVICE_ART`. `CompanyServices` sets `--accent` on each `<li>`; `serviceArt.tsx` reads
  `var(--accent, var(--color-ink))` and never knows which colour it got.

⚠️ **WHERE AN ACCENT IS ALLOWED, and the list is short by design.** A scene's live dot, its ONE
outcome element, its primary bar fill, the travelling highlight, and the card's mark and number
on hover. Everything else stays `ink` / `muted`. This is enforced by convention, not by code.

### The heading pins — and the lifted panel was reverted

The heading column is `desktop:sticky desktop:top-24` (96px, `why-rogo`'s existing value). Two
boxes, not one:

```
<div wrapper>          the flex item. STRETCHES to the row height — that height IS the travel
  <div sticky>…</div>  the thing that pins
</div>
```

⚠️ **`items-start` ON THE CONTAINER, OR `self-start` ON THE WRAPPER, BREAKS THE PIN ENTIRELY.**
A content-height wrapper gives its sticky child no containing block to travel in. The band
carried `desktop:items-start` from the first pass — where the sticky element *was* the flex item
and needed `self-start`, the exact opposite requirement — and both are now gone.

⚠️ **`overflow-hidden` ON THE `<section>` ALSO BREAKS IT, AND SILENTLY.** An ancestor with
`overflow: hidden` becomes the sticky element's scroll container, so the heading pins to a box
that scrolls away with the page. The band inherited that clip from the capture; it is removed,
and nothing needs it back — a hovered card's 2.5% scale overhangs ~4px into a 40px gutter.

**Measured over CDP at 1440**, not reasoned about: `position: sticky`, panel top locked at
**96px** across scrollY 1771 → 2611 while card 1's top runs **−4 → −844**. At the band's start
the heading and card 1 are level, both at 531.

⚠️ **THE LIFTED PANEL IS GONE (second correction, same day).** While pinned it briefly gained a
white fill, a `hairline` border and `shadow-float` — the user's "make the header float when
floating" — and the user asked for that removed after seeing it. Removed with it:

- **`StickyLift.tsx`, deleted.** CSS has no `:stuck`, so it detected the pinned state with a
  sentinel and an `IntersectionObserver`. With nothing left to toggle it bought nothing, and
  **the band is a pure server component again with no client JS at all.**
- **`desktop:p-6` and its compensating `-mt-6 -ms-6`.** Both existed only to give the panel
  breathing room; with no panel they cancel out and are noise.

`shadow-float` stays in `globals.css` — the card hover still uses it.

### The card hover

`scale(1.025)` + `-translate-y-1` + `shadow-float` + an accent radial wash, 400ms on
`--ease-rogo`. The mark and the number tint to the card's accent; the scene leans in 1.5%.

| ⚠️ | Why |
|---|---|
| `hover:z-10` is not optional | the card scales past its grid cell, and grid items paint in source order — without it only the last card in a row would grow over its neighbours instead of under them |
| **`isolate` on the `<ul>` is equally not optional** | an un-scoped `z-10` also beats the nav's `z-[3]` (Nav.tsx:438) in the root stacking context, and a hovered card in the band's top row paints straight across the header — **user-reported, then reproduced over CDP**. `isolation: isolate` gives the list its own stacking context, so the z-order still works between cards while the whole list sits at `z-auto` below the nav. Verified with `elementsFromPoint`: hovered, the stack reads `hero-nav-blur → HEADER → LI`. The two go together; neither works alone |
| `transform` is the only geometry that moves | scaling rather than growing keeps the hover off the layout path: no reflow, no neighbour shift, and the scenes are never re-measured — which matters, because each is a **container query**, and a real width change would re-resolve `--u` on every frame |
| 400ms, not the site's 300ms | a judgement, not a measurement: 300ms on a 400px card reads snatched where it reads crisp on a text link. The curve is still `--ease-rogo` |
| every hover has a `focus-within` twin | the card is not focusable itself, but this keeps the treatment reachable if anything inside it ever becomes so |

`motion-reduce` cancels the transform outright, not just its transition — a scaled card with no
transition is a jump, which is what the setting exists to prevent.

---

## Block 5 — `Reiteration` → DELETED 2026-08-16

⚠️ **THE BAND IS GONE. This section is the record of it, not a spec.**

User: *"remove this part in company"*, pointing at the "Join The Team Building / What Comes
Next" heading and its paragraph. Removed **whole** — headline, paragraph and the full-bleed
photograph together — because the copy was what identified the band, and a headless photograph
under no heading is not a smaller version of that block, it is a different and worse one.

What went with it:

- `src/components/company/CompanyCareers.tsx` — deleted.
- `company.careers` in both locale dictionaries: 4 keys each (`titleInk`, `titleMuted`, `body`,
  `photoAlt`). All 4 Hebrew ones were AUTHORED, so the Hebrew SOURCED tally moved **34/47 →
  30/39** — no captured string was lost.
- The `<CompanyCareers />` render and its import in `CompanyRoute.tsx`.

⚠️ **`public/company/company-bg.jpg` IS STILL ON DISK AND IS NOW REFERENCED BY NOTHING** (167 KB).
Left in place deliberately rather than swept up with an unrelated edit — deleting a user-supplied
asset is its own decision. The uncropped original is still outside the web root at
`assets/company-bg-source.jpg`.

⚠️ **THIS CLEARED ONE OF THE TWO `noindex` GATE ITEMS, AS A SIDE EFFECT RATHER THAN BY
DECISION.** The photograph was stock standing in for a picture of clix's team that does not
exist, and that was gate item 2. It is gone, so only item 1 remains — the unsubstantiated
"Unit 8200 and Technion alumni" line in CompanyMission. **Nobody has been asked whether the
guard should now lift, and it has not been lifted.** See `CompanyRoute.tsx`'s header.

The band was a faithful rebuild of rogo's `Reiteration` block and its measurements are in this
file's history. **The `Reiteration` h3 preset is still shared with Mission and Team**, so the
type table earlier in this document is unaffected.

⚠️ **The page now closes on Block 3 (the services cards) and then the footer.** Nothing was
re-measured to account for that — the bands were never coupled, each carries its own padding,
and the sequence is a plain `<main>` with no `order-*` anywhere.

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
4. **Block 3, card 08 prints the same sentence twice** — `להמר על הדברים הנכונים` is both
   its kicker and its promise on the real site, and both are reproduced rather than
   "fixed". Inventing a second sentence would make it the band's only unsourced kicker.
5. **Card 06's scene is designed, not sourced** — the capture describes artwork for the
   other seven services and nothing for Mobile Development.
6. **The eight English kickers and promises are authored translations** of sourced Hebrew.
   Sixteen new English strings the user has not read.
7. **Nothing in Block 3 has been compared to a reference**, because there no longer is one:
   the band is a deliberate departure from the capture. It is judged on taste now, not on
   fidelity — which makes the user's eye the acceptance test for this block.
8. **The eight accents are the first non-inherited colour on this site.** They are scoped to
   this band and documented in DESIGN-SYSTEM.md, but they set a precedent: the next page
   that wants colour will point at them. Whether that is wanted is the user's call.
9. **`shadow-float` is the first shadow on this site**, against a capture that has none.
   Same question, same answer: scoped here, recorded, precedent noted.

---

## Acceptance checklist

- [ ] Matches the reference at 1600 / 1440 / 1024 / 390
- [ ] Spacing, type and colour from tokens, or the deviation is recorded above
- [ ] All interactive states (hover, focus-visible, active)
- [ ] Motion timing and easing match, or reduced-motion is honoured
- [ ] Keyboard reachable, meaningful `alt`, contrast checked
- [ ] `npm run build` passes with no type errors
- [ ] Both `CONTEXT.md` files and `docs/SECTIONS.md` updated
