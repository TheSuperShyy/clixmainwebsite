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

### What replaced the grid

```
section[bone]
  div[Container]   maxW 1280 · col ≤1199 · ROW ≥1200, items-start, justify-between, gap 80
    div[Heading]     ≥1200: sticky top-24, w 45% (cap 576), type capped 440
                     ≤1199: static, cap 540 at 810-1199, full below
      h2 · p
    ul[Cards]        grid · 1 col ≤809 · 2 cols ≥810 · gap 16 · min-w-0 flex-1 at ≥1200
      li[Card] × 8     mark + kicker / name / art well / promise
```

| | ≥1200 | 810–1199 | ≤809 |
|---|---|---|---|
| layout | heading BESIDE cards | stacked | stacked |
| container gap | 80 | 40 | 32 |
| heading column | sticky `top: 96px`, 45% (cap 576) | static, cap 540 | static, full |
| grid columns | **2** | **2** | **1** |
| card | ~304 wide, min-h 400 | ~464 wide, min-h 384 | 358 wide, min-h 352 |
| grid gap | 16 | 16 | 16 |

`1280 − 576 − 80 = 624` and `(624 − 16) / 2 = 304` — **four pixels off the 308px tile this band
used to render**, so the card column inherits a width the page had already proved.

⚠️ **The sticky offset `top: 96px` is not a new number** — it is what `why-rogo` already pins its
headline at, and that came off the target. Every sticky element on this site is now on one line.

⚠️ **`desktop:self-start` is load-bearing.** A stretched flex item is already as tall as its row,
so it has no travel to stick within; without it the heading simply does not pin.

### The card

White on `bone`, `1px` `hairline` border, **radius 0**. The reference's `rounded-[8px]` is
deliberately not ported: this site's radius scale is `--radius-none` / `--radius-pill` and
nothing else on it is 8px. Radii *inside* a scene are a separate question — see below.

| Slot | Spec |
|---|---|
| mark | 20px, `muted` → `ink` on card hover, 2px lift, 300ms `--ease-rogo` |
| kicker | `EYEBROW_CLASS` (12px, 400, uppercase, `muted`, 130%, tracking normal) — **exported from `CompanyMission.tsx`, not re-authored** |
| name | 28px `font-display` 400, 110%, −0.02em, `ink` |
| art well | `flex-1`, centred, clipped — every scene is 280 × 168 source units |
| promise | 14px `font-sans` 400, 130%, −0.01em, `muted` |

⚠️ **CARDS GROW, THEY DO NOT CLIP.** `min-h-*` plus the grid's default `align-items: stretch`, so
a row is as tall as its tallest card. This is a **deliberate divergence from /product's benefit
cards**, which are `aspect-ratio`-fixed and whose bodies genuinely clip — that grid is 3 × 6,
this one is 2 × 8, and a taller row costs nothing here. It also means these cards need no
per-locale line-count audit to be *safe*, only to look right.

⚠️ **`min-w-0` on the `<ul>` is load-bearing.** A flex item's default `min-width: auto` would let
the widest machine token inside a scene set the column floor and push the grid past 1280.

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

### The scenes carry almost no prose, deliberately

Everything sentence-shaped renders as a grey bar; only **machine tokens** are set as type
(`POST /lead`, `dashboard.tsx`, `$1.2m`, `98`, `1.2s`). Three reasons, the first decisive:

1. **The eight scenes are locale-free** — machine tokens stay Latin in every locale, the rule
   `workflowMocks.tsx` already states. Not one new dictionary key, and no Hebrew line-fitting
   risk across eight new boxes. Every token is `direction: ltr` so it reads correctly on /he.
2. The real site's chat mock is a stock template in someone else's business ("2 kurtas",
   "Rs.1200"). Porting its words would be borrowing copy; porting its shape is the rebuild.
3. The reference band does the same — three of its four arts are bars and window chrome.

### Coordinates

One **280 × 168** source box per scene, every dimension `u(n)`, same idiom as
`product/benefitArt.tsx` and `product/workflowMocks.tsx`. `Stage` makes itself a query container
and hands its children `--u = 1cqw / 2.8`, so a scene **scales** with the card rather than
reflowing — which it must, at ~304 / 464 / 358px. Capped at 280px so it never outgrows the well.

⚠️ **`container-type` is on the OUTER element and `--u` on the inner one.** An element
establishes a query container for its *descendants*, not itself; declaring `1cqw` on the same
node resolves against the ancestor and silently mis-scales.

⚠️ **Radii inside a scene are depiction, not style** — a chat bubble, a browser pill, a handset.
Same licence `workflowMocks.tsx` takes reproducing a card corner read off a screenshot.

### RTL

`Box` and `Line` take source-LTR `x` and resolve it with `inset-inline-start`; `end` flips a
child to `inset-inline-end`. No `280 − x − w` arithmetic anywhere. **All eight scenes mirror** —
the horizontal axis carries reading order in every one, and none depicts fixed foreign chrome.

### Motion — three keyframes, shared by all eight

In `src/app/globals.css`. No GSAP, no framer-motion (**not installed** — `package.json` has only
`gsap` + `@gsap/react`), no IntersectionObserver, no `"use client"`.

| Keyframe | What it does | Applied to |
|---|---|---|
| `service-step` | overlay opacity `0 → 1 → 0`, staggered by `animation-delay` | 31 elements: roster rows, chat bubbles, flow nodes, page blocks, app screens, code lines, pipeline stages, score rows |
| `service-pulse` | live dot, opacity `1 → .3 → 1` | 5 |
| `service-rise` | `translateY(0 → −2 → 0)` | 6 — the one OUTCOME element per scene |

⚠️ **Three shared keyframes, not eight bespoke ones.** /product's six cards each got their own
because each animated a different mechanism; these eight all animate the *same* mechanism — a
sequence advancing through a list — so one staggered `service-step` covers all of them. That is
also what makes the eight cards read as one band rather than eight separate toys.

⚠️ **THE INVARIANT, INHERITED FROM /product BLOCK 4: every keyframe's base state is the shipped
static design.** `service-step` runs on a dedicated overlay resting at `opacity: 0`, so the
unanimated scene is the finished picture — every roster row present, every bar at its scored
length. The global reduced-motion clamp is therefore an **exact no-op**, and SSR first paint is
complete. Written the other way round, a reduced-motion visitor would get eight empty panels.

⚠️ **Opacity and `translateY` only**, and the Y is not stylistic: it is the one axis that does not
flip under RTL, so these loops need no `[dir="rtl"]` companion the way `.benefit-bar` does.
~40 loops run at once when the band is on screen, so every one has to be compositor-only.

---

## Block 3b — colour, the floating heading, and the card hover (2026-08-16, second pass)

User: *"add some colors and make the header floats when floating, and when hovering to a card,
make it bigger add a hover animation that is good"*. Three additions, all on top of Block 3
rather than instead of it.

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
