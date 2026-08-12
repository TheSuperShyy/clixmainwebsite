# Feature: `/product` page

|  |  |
|---|---|
| Slug | `product-page` |
| Route | `/product` |
| Order on page | 7 blocks between the shared `Nav` and the shared `Footer` |
| Status | `building` — Blocks 1, 2a, 2b, 2c, 2d, 3, 4 in `review`; Blocks 5–6 `todo` |
| Reference | `docs/reference/target/rogo-product-2026-08-11.html` (612 KB) + `.css` (180 KB) |
| Original URL | <https://rogo.com/product> — `rogo.ai/product` 301s here and serves a byte-identical document |
| Original Framer name | page root `.framer-OjTyT`, content wrapper `.framer-xvvc24` |
| Component | `src/components/product/*` + route `src/app/product/page.tsx` |

**Deviation from `CLAUDE.md` §3, deliberate and identical to `felix-page`:** one `features/`
folder for the whole page rather than one per block. Seven blocks that share a tier map, a
palette and a single capture would otherwise duplicate the same page-level mechanics seven
times, and the per-block detail is not large enough to need its own file.

## Purpose

A pixel-faithful clone of rogo's product page, built block by block. It is the largest of the
remaining unscoped routes and the first to introduce a green accent, a typed-input control and
a runtime-variant problem the earlier pages never hit.

---

## ⚠️ Read first — the copy is now clix's, and the route is STILL not indexable

**Superseded 2026-08-12.** This section used to say every string was rogo's verbatim. That
stopped being true when the content pass ran. What follows is the current state.

### Cleared by the content pass

| What | Where | Replaced with |
|---|---|---|
| LSEG, FactSet, S&P Capital IQ, PitchBook, Preqin, Dow Jones, Daloopa, Quartr, names **and logos** | Block 3 | clix's own 13-tool stack, glyphs from `ui/ToolGlyphs.tsx` (CC0 simple-icons). Files deleted from `public/logos/product/` |
| Patrice Maffre (Nomura), Pieter Taselaar (Lucerne Capital), Sean Warneke (Schonfeld), headshots, quotes, Nomura's mark | Block 6 | clix's own clients. Photographs deleted from `public/testimonials/product/` |
| **SOC2, CCPA, ISO 27001, GDPR** badges | Block 5 | Four of the five practice statements from `sections/Security.tsx`. SVGs deleted from `public/badges/` |
| Word, Excel, PowerPoint, SharePoint, Google Drive marks | Block 4 `benefit-integrations.svg` | A 3x2 grid rebuilt from `TOOL_GLYPHS` at the same 213x138 box. File deleted |
| Bloomberg, Rogo, NVIDIA, Apple, Microsoft, Caterpillar, Boeing, Ford, General Electric | Blocks 2a, 1, 2b, 2d | Generic or clix-appropriate scenarios. No third-party name renders anywhere on the page |

17 borrowed asset files were deleted. `git grep` confirms no code path references any of them.

### ⚠️ Why `noindex` STAYS anyway

The pass introduced one new problem while clearing four old ones. **Block 6 carries placeholder
quotes attributed to clix's real, named clients.** clix has no written testimonials, only video,
so the words are invented and the people are real. The placeholders are written to be
unmistakable (bracketed all-caps tag naming the person, third-person grammar, no quotation
marks) precisely so they cannot be mistaken for endorsements, but an invented sentence under a
real face is still the same class of problem the vendor logos were.

`robots: { index: false, follow: false }` in `src/app/product/page.tsx` lifts when all four hold:

1. ✅ no third-party trademark in copy or assets
2. ✅ no certification badge clix does not hold
3. ❌ **no real person quoted, INCLUDING the placeholders**
4. ✅ every string is clix's own

Three of four are done. Item 3 needs real quotes, or a restructure onto the video accordion
that `sections/Testimonials.tsx` already implements.

### Block 6 carries all six clients

`SLIDES` and `PHONE_CARDS` are six, in `sections/Testimonials.tsx` `CLIPS` order. rogo's three
was rogo's number. The carousel took it without modification (`N` is `SLIDES.length`). The phone
tier deliberately shows six where the capture shows two; see the component and CONTEXT.md.

### ⚠️ Unresolved: `noam-tovi.jpg` may not be Noam Tovi

`public/testimonials/noam-tovi.jpg` is a still from that client's video, and the video's own
burned-in caption reads `אני נווה דוידי`, transliterating to **Nave Davidi**. `sections/Testimonials.tsx:63`
labels the same file **Noam Tovi, Owner, investments**. Those are different names and nothing in
this repo can say which is right. Block 6 slot 3 was moved to `nevo-yahaloman` on 2026-08-12 for
that reason. **Resolve the label with the client before using that photograph anywhere.**

### Known cosmetic defect, not fixed

`asaf-peretz.jpg` and `adir-peretz.jpg` are 9:16 video stills with **burned-in Hebrew subtitle
captions**, and the 360x694 portrait slot crops one of them mid-word. They read fine as video
thumbnails on the home page, which is what they were vendored for; they read as a defect beside
a written quote. Left alone deliberately: the files are shared with `sections/Testimonials.tsx`,
so cropping them changes the home page too. That is the user's call, not a unilateral one.

---

## Page-level mechanics

### The tier map — three sizes, not four

The capture declares all four Framer tiers, and the tier→hash map is:

| Media query | Hides-at class |
|---|---|
| `min-width: 1600px` | `hidden-bdpt8v` |
| `min-width: 1200px` and `max-width: 1599.98px` | `hidden-1pos691` |
| `min-width: 810px` and `max-width: 1199.98px` | `hidden-1qegk91` |
| `max-width: 809.98px` | `hidden-11nm4ms` |

(The nested footer component ships its own second set — `d23fwj` / `1roolzl` / `1leoyz4` /
`16n7npo` — exactly as `features/footer/` already records.)

**But XL and desktop share every value measured so far**: no class in Block 1 has a
`min-width:1600px` rule. Written in components as base = phone → `tablet:` → `desktop:`, with a
tier-map comment at the top of each file. Re-check per block rather than assuming.

### The nav is FIXED on this page

Measured, not assumed: the header is `.framer-1lcee9e` — **the same class as the home page's** —
with `position: fixed; z-index: 3; top/left/right: 0`. So `/product` uses the home and `/news`
pattern: `<Nav models={models} />`, no `spacer`, and the hero's own `198px` top padding does
the clearing. This is *not* `/clix`, whose nav is in flow.

Every block carries `data-nav-theme="light"`. Blocks must stay **contiguous** — `Nav.tsx` picks
the element spanning the nav's bottom edge and falls back to `"light"` on a gap.

### ⚠️ The SSR capture's variant classes are STALE — the biggest lesson on this page

The frozen HTML declares the hero CTA as `framer-v-velzew`. Built to that variant's rules, the
CTA's corner brackets sit at `top:-22/left:-48` — visibly too far out against the reference.

Probing the **live** page in headless Chrome shows the hydrated class is
`framer-5Atru framer-velzew framer-v-q741vz`. **React swaps the variant on hydration.** The
rules that actually apply are `q741vz`'s: `top:-12/left:-28`, `bottom:-12/right:-28`, confirmed
by computed style (`leftDelta {dx:-28, dy:-12}` against a 220×40 box), not inferred.

Two consequences:

1. **A `data-framer-name` / `framer-v-*` pair in the capture is a hypothesis, not a fact.**
   Where a rendered position looks wrong, probe the live DOM before adjusting a value by eye.
2. It relocated the stylesheet's only real hover rule. `.framer-v-q741vz.hover` slides the
   brackets **in** to `top:-2/left:-18` and `bottom:-2/right:-18` — so that hover belongs to
   the hero CTA, and was implemented rather than left unobserved.

### Headless Chrome has network egress (correction to a recorded fact)

`docs/CONTEXT.md` records, from 2026-08-03/04, that "Node has network egress here and headless
Chrome does not". **That is no longer true as of 2026-08-11**: headless Chrome loaded
`https://rogo.com/product` in full (title, `h1`, 336 `data-framer-name` nodes, 293 KB body).
Live probing is therefore available for the whole class of questions a static capture cannot
answer — runtime variant selection, computed post-flex geometry, motion, hover.

### Palette

Every colour resolves to an existing token except one.

| Original | Token | Note |
|---|---|---|
| `rgb(21,21,21)` / `#151515` | `ink` | h1, CTA fill, brackets, `Darken` 2 |
| `rgb(115,115,115)` / `#737373` | `muted` | subtitle, `Product Preview` ground, attach icon, caret |
| `#ffffff` | `paper` | button label, text field, rules |
| `#a8a29e33` | `hairline` | the text field's `box-shadow` ring |
| `#135b45` | **`brand-green` — NEW** | the prompt submit arrow, and the only use of it |
| `rgb(23,23,23)` | *none — kept literal* | the typed prompt's colour. A one-off that is **not** `ink`; tokenising a single near-duplicate would invite mistaken reuse |

`brand-green` was on `docs/DESIGN-SYSTEM.md`'s "defined but unused" list. That count was taken
across the home and `/clix` captures and is still correct for them — `/product` is simply the
page that uses it. Same shape of evidence as `forest-deep`. **It is rogo's green, not clix's**,
and is a candidate for a clix accent in the copy pass; `forest` `#1a2a25` is not a drop-in
substitute, being a near-black reserved for display type.

### Typeface

The original sets display type in `ABC Arizona Mix Regular` and body in `Inter`. Both map to
the site's single face (Discovery) via `--font-display` / `--font-sans`, per the one-face
decision of 2026-08-08. Not a per-page choice; not re-litigated here.

### Section inventory

⚠️ **This table lists DOCUMENT ORDER, not structure.** It was originally read as a list of
sibling sections and that was wrong twice over — see "Two corrections" under Blocks 2b–2d.
`#features` is a single band containing rows 2a–2d **plus** `Data Partners` and `Benefits`;
only `Security`, `Testimonials` and `Footer` are its siblings. And "Streamline & Automate Your
Workflows" sits *inside* `Features`, not between it and `Data Partners`.

| # | Framer name | `id` | Offset | Heading | Status |
|---|---|---|---|---|---|
| 1 | `Hero` + `Product Preview` | `first`, `second` | 230251 / 236916 | Built for Real Financial Work | **`review`** |
| 2a | `Features` intro | `features` | 241746 | Just as Bloomberg digitized financial data in the 1980s… | **`review`** |
| 2b | `Features` | — | 247346 | An Integrated, Secure Platform Built to Drive Your Firm Forward | **`review`** |
| 2c | `Workflows Scroller` | — | 257853 | *(not a block — feature 03's panel)* — 2 tickers × 10 `Shortcut Card`s | **`review`** |
| 2d | — | — | 327886 | Streamline & Automate Your Workflows | **`review`** |
| 3 | `Data Partners` | — | 336814 | Trusted Data — **inside `#features`** | **`review`** |
| 4 | `Benefits` | — | 371914 | AI That Learns How Your Firm Thinks and Works — **inside `#features`**, **6 items not 4** | **`review`** |
| 5 | `Security` | `security` | 391320 | Built for Enterprise, Secure by Design | `todo` — reuse home's |
| 6 | `Testimonials` | `testimonials` | 401187 | *(quotes)* — desktop slideshow + separate mobile variant | `todo` |
| 7 | `Footer` | — | 435161 | Unlock financial AI for your firm | `todo` — reuse site `Footer` |

---

## Block 1 — Hero + Product Preview ✅ built

`src/components/product/ProductHero.tsx`. `Hero` (`#first`) and `Product Preview` (`#second`)
are **siblings** in the original — both children of `.framer-xvvc24` — wrapped in one
`<section id="hero">` here so the nav's theme scanner sees one contiguous block.

### Layout

| Property | XL 1600 | Desktop 1440 | Tablet 1024 | Phone 390 |
|---|---|---|---|---|
| `Hero` padding | `198 / 40 / 72` | `198 / 40 / 72` | `198 / 40 / 72` | `198 / 16 / 72` |
| `Hero` gap | 96 | 96 | 96 | 96 |
| `Text & Button` gap | 32 | 32 | 24 | 24 |
| `Text & Button` max-w | — | — | — | 360 |
| `Text Container` gap / max-w | 16 / 960 | 16 / 960 | 16 / 960 | 16 / 960 |
| Subtitle max-w | 540 | 540 | 540 | 540 |
| CTA frame | 220 × 40 | 220 × 40 | 220 × 40 | 220 × 40 |
| `Product Preview` max-w / height | 1280 / 440 | 1280 / 440 | 1280 / 440 | 1280 / **380** |
| `Preview` x-padding | 16 | 16 | 16 | 16 |
| Horizontal rule inset | 164 | 164 | 160 | 127 |
| `Input Field` max-w / radius / padding | 550 / 14 / 6 | ← | ← | ← |
| `Text Field` radius | 10 | ← | ← | ← |
| Prompt row padding | `12 / 12 / 8 / 16` | ← | `16 / 12 / 8 / 16`, column | `16 / 12 / 8 / 16`, column, h 56 |
| Bottom row padding | `8 / 12 / 12` | ← | `8 / 12 / 12` | `12` |
| Submit button | 32 × 32, radius 6 | ← | ← | ← |

`Product Preview` carries **no gutters of its own** and is full-bleed below 1280px, unlike the
hero above it.

### Typography

| Element | Family | Size (XL/desk/tab/phone) | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|---|
| h1 | `--font-display` | 64 / 64 / 56 / 48 | 400 | 100% | −0.06em | `ink` |
| Subtitle | `--font-sans` | 18 / 18 / 16 / 16 | 400 | 130% | −0.02em | `muted` |
| CTA label | `--font-sans` | 16 | 500 | 1em | −0.01em | `paper` |
| Typed prompt | `--font-sans` | 16 / 16 / 15 / 15 | 400 | 1em / 1em / 1em / 1.4em | 0 | `rgb(23,23,23)` |

Both text blocks are centred by an **inline override** on the element, not by the preset —
the presets say `text-align: start`. The subtitle's preset colour is `#383838` (`ink-soft`) and
is likewise overridden inline to `muted`; the override wins, and ours uses the token.
`text-wrap: balance` is a **tablet-only** rule on the h1 and an **all-tier** rule on the
subtitle.

### Color & surface

| Element | Property | Value |
|---|---|---|
| `Product Preview` | background | `muted` `#737373` (behind the video) |
| `Darken` 1 | background | `radial-gradient(45% 85%, #54545400 0%, #000 100%)`, `mix-blend-mode: overlay`, opacity `.2` |
| `Darken` 2 | background | `ink`, opacity `.15` |
| Rules (2 vertical, 2 horizontal) | background | `paper`, opacity `.2`, 1px |
| `Input Field` | background / radius | `#ffffff66` (paper @ 40%) / 14px |
| `Text Field` | background / ring | `paper` / `box-shadow: 0 0 0 1px var(--color-hairline)` — a shadow, not a border, so it costs no layout box |
| Submit | background | `brand-green` |

### Assets

| Asset | Type | Intrinsic | Rendered | Source |
|---|---|---|---|---|
| `/video/hero-product.mp4` | mp4 | 1920×1080, 4.86 MB | cover | **The original's own clip** — rogo hotlinks `videos.pexels.com/video-files/5941931/…`, i.e. public stock, not rogo footage |
| `/video/hero-product-poster.jpg` | jpg | 1280×720, 72 KB | cover | Ours, `ffmpeg` frame at t=1s |
| Brackets ×2 | inline SVG | 14×20 | 14×20 | Capture `<use>` defs `#svg-1980836134_494`, `#svg5446185_500` |
| Paperclip | inline SVG | 16×16, viewBox `-1 -1 16 16` | 16×16 | Capture `#svg-776486359_852`. The off-origin viewBox is the original's and is kept — a `0 0 16 16` box clips the cap |
| Submit arrow | inline SVG | 20×21.25 | 20×21 | Capture, from a `data:` background-image |

### Interactive states

| Element | Hover | Focus-visible | Transition |
|---|---|---|---|
| CTA brackets | slide in to `top:-2/left:-18`, `bottom:-2/right:-18` — **measured** (`.framer-v-q741vz.hover`) | — | 300ms `--ease-rogo` — **estimated** |
| CTA | `opacity: .9` — **ours**, the site's button convention | 2px `ink` ring, 2px `paper` offset — **ours** | 300ms `--ease-rogo` |
| Attach | `opacity: .7` — **ours** | 2px `ink` ring — **ours** | 300ms `--ease-rogo` |
| Submit | `opacity: .9` — **ours** | 2px `brand-green` ring — **ours** | 300ms `--ease-rogo` |

The original has **no** focus-visible treatment anywhere; all four are our accessibility floor.

### Motion

| What | Trigger | Duration | Easing | Source |
|---|---|---|---|---|
| Prompt types in | mount, loops | `typeSpeed: 30` ms/char | linear | **Measured** — from the code-component payload |
| Prompt holds / deletes | — | 1800 / 18 ms | linear | **Estimated** |
| Caret blink | always | 1s `step-end` | — | **Estimated** — the original's rate is in a code component |
| Brackets on hover | hover | 300ms | `--ease-rogo` | **Estimated** |

**Library: none.** A four-phrase typewriter and a CSS keyframe do not meet either the `gsap`
(scroll-driven / pinned / scrubbed) or `framer-motion` (mount-exit / gesture) trigger.

**The phrase list is complete and verbatim**, recovered by grepping the 33 site modules to
`ZcAf3VKJXH9VIfxmp-FSCoIZYOjifs-KtG_IUJebwsE.Cbu-MJq3.mjs`. Worth noting against `/clix`, whose
equivalent rotating-word list was never recovered and is still "2 of an unknown number".

**Reduced-motion fallback:** the caret animation class is dropped entirely and the first phrase
renders static. It deliberately does *not* lean on the global `animation-duration: 0.01ms`
neutraliser, which can freeze a caret mid-cycle and leave it invisible.

### Responsive behavior

- **≥1200** — one row for the prompt: typed line and submit share a line, caret vertically
  centred in a 26px box.
- **810–1199.98** — the typed line lifts **out of flow** (`position:absolute`, inset 12) and the
  row becomes a fixed-height column. This is how the original stops the field growing as a
  phrase wraps; reproduced rather than re-solved.
- **≤809.98** — same as tablet plus a 56px row height, 380px band, 16px hero gutters, h1 wraps
  to two lines.

---

---

## Block 2a — `Features` intro ✅ built

`src/components/product/ProductFeatures.tsx`. This file owns the whole `Features` **section**
shell; 2b, 2c and 2d land in it as siblings of the intro.

### Layout

| Property | XL 1600 | Desktop 1440 | Tablet 1024 | Phone 390 |
|---|---|---|---|---|
| Section padding | `96 / 40` | `96 / 40` | `80 / 40` | `80 / 16` |
| Section gap | 120 | 120 | 120 | 120 |
| Section background | `paper` | ← | ← | ← |
| `Product` max-w / gap | 1280 / 96 | ← | ← | ← |
| `.132yhjx` gap | 96 | ← | ← | ← |

### Typography

| Element | Family | Size | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|---|
| Intro h3 | `--font-display` | 44 / 44 / 40 / 32 | 400 | 110% | −0.05em | `muted`, second clause `ink` |

**Left**-aligned (the only left-aligned heading so far on this page) and `text-wrap: balance`
at every tier. The two-tone split is **one `<h3>` with an inner `<span>`**, not two blocks —
splitting it would let the halves wrap independently and break the sentence. The preset's own
colour is `ink` and the element overrides the whole heading to `muted`; ours states both
colours directly rather than reproducing the override dance.

### Motion

None. No `data-framer-appear-id` in this subtree, no transition, no hover.

---

## Blocks 2b + 2c + 2d ✅ built

`ProductStepper.tsx` (2b), `WorkflowsScroller.tsx` (2c), `ProductWorkflows.tsx` (2d), all
composed by `ProductFeatures.tsx`.

### ⚠️ Two corrections to this document's own earlier section inventory

**1. `Data Partners` and `Benefits` are INSIDE `#features`, not siblings of it.** The inventory
above was derived from the capture's byte offsets, which give document order but say nothing
about nesting. The live render shows `#features` is a single band — 4024px at 1440, 8138px at
1024 — whose direct children are `[Product]` (2a + 2b + 2d), `[Data Partners]` (Block 3) and
`[Feature]` "AI That Learns…" (Block 4). Only `Security`, `Testimonials` and `Footer` are real
siblings. **Read the rendered tree for nesting; read offsets only for order.**

**2. `Workflows Scroller` is not a block at all.** It is the animation panel for feature **03**
inside the stepper, visible only while that step is active.

### 2b — the stepper. Two genuinely different layouts

| | ≥1200 | <1200 |
|---|---|---|
| Shape | `Restart Point`: 768×541 image **beside** a 472×541 text column, gap 40 | No `Restart Point` in the DOM. Four features **stacked**, gap 48 |
| Steps | One panel at a time, auto-advancing; inactive rows at **opacity .5** | All four expanded at once, all full opacity |
| Per feature | — | 36px header row (badge + label) + gap 24 + panel |
| Image aspect | **768/541** (1.419) | **944/595** (1.586) — proportionally wider *and* shorter, not the same box reflowed |

The text column is `justify-content: space-between` — that is what pins the title to the top
and the stepper to the bottom of the image's full height.

| Element | Value |
|---|---|
| Title | 28px / 400 / 110% / −0.02em / `ink`, in a row with `padding-left: 12` |
| Step row | 472×60, row, gap 16, padding 12 |
| Step label | Inter 14px / 400 / 130% / −0.01em / `ink` |
| Badge | 36×36 |
| `Fill` | absolute, `surface`, sweeps width 0→100% across the step |
| Panel (`RIV DATA`) | 510×280, `surface`, radius **1px**, centred (dx 129, dy 131) |

**The badge is not a stroked circle.** The capture's artwork (`#svg15075237_193`) is a 36×36
square with a circle *subtracted*, painted in `ink`; what reads as a ring is the four corner
slivers left behind. A `border-radius: 50%` outline would be a different shape. Path verbatim.

### 2d — Streamline & Automate. Three shapes, and the middle one is the surprise

| Tier | Grid | Card direction |
|---|---|---|
| ≥1200 | 3 × 411px, gap 24 | **column** (art over text) |
| 810–1199.98 | 1 column, gap 32 | **row** (art beside text) — measured 944×579 at 1024 |
| ≤809.98 | 1 column | **column** again — measured 358×625 at 390 |

A single "stack below desktop" rule gets the tablet tier wrong.

Title 44/44/40/32 (same preset as the 2a intro), capped at `max-width: 512px` from 1200 up and
**uncapped below** (`-tdcbil{max-width:unset}` at two tiers). Section gap **64**, not 40.
Card title 28px/110%/−0.02em `ink`; body 16px/130%/−0.01em `muted`; card gap 32.

Cards carry `place-self: start`. Without it card 1's four-line body makes its grid row taller
and the other two centre inside it, dropping their art ~10px out of alignment.

The art box is `aspect-ratio: .78913` (411×521) at **every** tier — the original's image has no
per-tier override, so at tablet it takes half the row at the same proportion (456×578 of the
measured 944×579 card) rather than stretching.

### 2d art — three product-UI mocks, rebuilt from the bitmaps

The originals are three flat JPGs on framerusercontent, `922×1040` each:
`TwCc7NSpim3LYfS9L52C427iqU` (Firm-Specific Workflows) · `iLUrIYXexMEto7ZcsADicLSwEQ`
(AI Table Interface) · `jsXGDPEFEziUQou4fnyFKoRKjg` (Material Creation). They are screenshots
of rogo's real product, so they are **rebuilt in DOM** (`workflowMocks.tsx`), not vendored.

**The first pass evoked them instead of measuring them and the user rejected it** ("this is
how it looks in rogo, its not the same as ours"). The rebuild reads every coordinate off the
source bitmaps with `sharp`.

**The coordinate system is the load-bearing part.** `object-fit: cover` on a 0.8865 image in a
0.789 box scales by **height** and crops the sides, so:

- uniform scale = `boxHeight / 1040` = `boxWidth / 820.6`, i.e. one source pixel is
  `1cqw / 8.206` — hence `--u`, and every dimension written as `u(sourcePx)`. Container
  queries are what let a DOM rebuild scale like a bitmap across 411 / 456 / 358px wide boxes.
  `container-type: inline-size`, not `size`: the box's height already comes from its aspect.
- only source x `0..820.6` is ever visible. The crop is **centred** for mocks 1 and 3 and
  **left-aligned** for mock 2 (`object-position: left center`) — which is why mock 2's card,
  pill and table run off the right edge in the original too. That is the composition, not a
  bug; `cropLeft` carries it.

The tier variants of `object-position` (`center` vs `center top`) collapse to nothing here:
the crop is horizontal only, so the vertical component never applies.

Measured geometry, in source pixels:

| Mock | Structure |
|---|---|
| 1 | chip `138,148 650×112` · connector at **x473**, not the card centre 462.5 · panel `138,298 650×560` · six rows on an **80px pitch**, first centred at y374 · 48px tile at x190, labels at x261 |
| 2 | card `74,140` running off both the right and bottom edges · pill `128,210 767×96` r48 · tile `140,361` · prose lines centred at y481/531 · table from `140,597`, **93px header** then **114px rows**, checkbox 36 at x174, labels at x248, redacted bars at x566 w222 |
| 3 | chip `102,150 716×130` · panel `102,338 716×564` · prose on a **48px pitch** from y413.5 · caption y586 · two `612×106` export rows at y622 and y744, 48px badge at x178, label at x248, download glyph at x702 |

Body text is **36 source px**, caption 31. Found by rendering at 30 and measuring the miss:
our sans came out at 0.83× the reference's ink width *and* 0.84× its cap-to-descender height —
a uniform scale error, so one multiplier fixed both. Do not port the 30 from the first pass.

### ⚠️ The four step panels could not be measured, and were wrong on the first pass

**Only the ACTIVE step's panel is ever mounted.** The capture and a live probe therefore both
only ever showed step 01; the other three were invented and did not resemble the original.
They were rebuilt on 2026-08-11 from four reference screenshots the user supplied, one per
step, after the user flagged the block. What they actually contain:

| Step | Panel |
|---|---|
| 01 | A **continuously scrolling** vertical strip of content types. The focused one is a white card with a coloured icon tile and a chevron to its left; the rest are muted centred labels |
| 02 | Generated prose with a figure highlighted and carrying a numbered citation chip, and the cited source card (`NVDA` · `10-K` · `FY 2024`, skeleton rows, the cited cell) floating over the **middle** of it — the cited figure must stay visible on a line **below** the card, which is the whole point of the panel |
| 03 | The `Workflows Scroller` — two opposed rows of shortcut tiles |
| 04 | A prompt row with a send button over a drop zone, with a folder chip being dragged in |

**Step 01: the box is STATIONARY and the words step up through it, once a second.** This took
three attempts and all three are worth recording, because the wrong ones were each plausible:

1. A discrete swap of three fixed rows. Wrong — there is real movement.
2. A continuous marquee with the focused card travelling with the strip. Also wrong. The
   "evidence" was two reference frames appearing to show the card at different heights — but
   those were two differently-cropped screenshots, so the difference was an artefact of the
   crop. **Do not infer motion from two stills at different crops.**
3. Correct: a stationary white card frame over the middle slot, with a four-row group sliding
   up exactly one row per tick behind it. **The icon tile is part of the fixed card layer, not
   of the row** — putting it in the row made it mount and unmount on every change and drag the
   label sideways. Only the glyph inside swaps (`icon-swap`, scale 0.4 → 1.06 → 1).
   **Every row shares one left edge**, muted and active alike, so the travel is purely
   vertical. The muted labels are *not* centred — they only look it, because short labels sit
   balanced in a wide panel. Three labels of different lengths in the reference all begin at
   the same x.

Each label exists **exactly once**, in the sliding group. Putting the label in the card as
well produced a visible duplicate for the length of every slide — the arriving row and the
card both showed it.

⚠️ Two traps hit while getting this right, both worth knowing:

- **A keyframe cannot be parameterised with a custom property without a fallback.** The travel
  was first written `translate3d(0, calc(var(--row-h) * -1), 0)` with the variable set inline
  by the component. An unresolvable value in a keyframe's `to` invalidates the declaration, so
  the animation ran and moved the strip precisely nowhere. It is now hardcoded at `-62px` and
  **must match `ROW_H` in stepperPanels.tsx**. A wrong-but-rendering layout is a worse failure
  than a crash.
- **Sleeping exactly one tick between screenshots aliases against the animation.** Two rounds
  of "the animation is not working" were really "the screenshot is 20ms into a 420ms move".
  To verify a timed panel, emulate `prefers-reduced-motion: reduce` via CDP
  `Emulation.setEmulatedMedia` and shoot the deterministic resting state.

A sixth source, **"Data rooms, meeting notes"**, came off the user's close-up; it was missing
from every earlier pass.

The scroller tiles were also wrong on the first pass — built as small pills with a leading
dot, where the original's are **86px tiles with a glyph on its own line above the label**.

### Motion

| What | Duration | Source |
|---|---|---|
| Step auto-advance + `Fill` sweep | 5200ms | **Estimated** — Framer runs it in JS |
| Step-01 source strip | 7500ms per cycle of 5 | **Estimated** — the original is Rive |
| Scroller rows | 38s / 46s, opposed | **Estimated** |

The advance is a **timeout keyed on the active step, not a free-running interval**. With an
interval, picking a step by hand does not reset the clock, so a click landing late in a cycle
gets a fraction of a second before the stepper moves on by itself.

**Library: none.** A `setInterval` and two CSS keyframes meet neither the `gsap` nor the
`framer-motion` trigger. `Fill` is a CSS **animation**, not a transition, with the row
remounted via `key` on each step — an animation always starts at its `from`, so no
"have we hydrated" flag is needed.

**Reduced motion:** the stepper does not auto-advance (step 01 stays, still selectable); the
marquee rows are neutralised by the existing global block.

**Keyboard:** step rows are `<button>`s with `aria-current`, so the stepper is operable — the
original ships plain `<div>`s. Our accessibility floor, as elsewhere.

### Assets — both substitutes

| Original | Ours | Why |
|---|---|---|
| `1UrYDcqTSd3WVXNwcrjT2YSNu0.png`, rogo's photo behind the panel | `public/product/features-backdrop.jpg`, a graded frame from `hero-clix.mp4` already in the repo | Decorative dressing. Held to `CLAUDE.md` §7: 2 candidates (a Jaffa sunset — wrong tone, and a landmark reads oddly here; then this skyline), 2 crop iterations (crop out a dominant flag, then tighten onto the buildings and darken to luma 48) |
| 3 screenshots of rogo's product UI (the 2d JPGs) | **DOM rebuilds** at the reference's own measured geometry — `workflowMocks.tsx` | We have no clix product to photograph, and shipping rogo's screens under this wordmark presents their software as ours. Rebuilt rather than evoked: same content, same layout, our tokens and our mark |
| rogo's logo chip inside each mock | the same 48px `brand-green` tile carrying `ClixMark` | The chip is a brand mark, so it becomes ours |
| PowerPoint / Excel product icons | lettered badges in the same two colours (`#c03b1c`, `#10743e`) | At 48px they read identically, and redrawing Microsoft's marks is not something this clone needs to do |
| `all_your_data_01.riv` | Rebuilt token panels, one per step | User's choice: no Rive runtime, no borrowed product art |

The scroller cards use a neutral token dot rather than redrawing rogo's product glyph.

### Acceptance checklist — 2b / 2c / 2d

- [x] Renders at 1600 / 1440 / 1024 / 390, no horizontal overflow at any tier
- [x] Both stepper variants verified rendered (desktop stepper; stacked at 1024 and 390)
- [x] Contrast: `ink` on `surface` **16.75:1**, `paper` on `forest-deep` **15.59:1** — both AAA
- [x] Keyboard-operable steps, reduced-motion path, `npm run build` and `eslint` clean
- [x] **2d's three mocks diffed side-by-side against the source JPGs at 1440** — geometry,
      type size and crop all land; remaining differences are the substituted mark and badges
- [ ] The stepper backdrop (`features-backdrop.jpg`) is still a substitute awaiting the user's call
- [ ] Step timing, scroller speeds estimated
- [ ] 2b / 2c not diffed against a reference at 1024 or 390

### ⚠️ Note for 2b — two full DOM variants, not one responsive tree

`.framer-1fqb8kn` is gated `hidden-1pos691 hidden-bdpt8v` (hidden at desktop **and** XL), so it
is the **tablet/phone stacked** layout; a separate subtree carries the **desktop stepper**.
They are not the same tree at two sizes. Measure each; do not try to unify them from markup.

The four feature labels, verbatim: `01 All your content in one place` · `02 Transparent,
auditable sources` · `03 Automate your workflows` · `04 Proprietary document interrogation`.
Feature 01's panel is the `all_your_data_01.riv` Rive animation being rebuilt in CSS.

### Acceptance checklist — Block 2a

- [x] Renders at 1600 / 1440 / 1024 / 390, no horizontal overflow
- [x] Matches the reference at 1440 — same line break after "in the", same colour split at "Rogo"
- [x] Tokens only; `npx eslint` and `npm run build` clean
- [ ] Not diffed at 1024 or 390 against a reference

---

## Block 3 — `Data Partners` ("Trusted Data") ✅ built

`src/components/product/ProductDataPartners.tsx`. ⚠️ **Not a section** — a child of
`#features` and a sibling of `[Product]`, so the section's own `gap-[120px]` separates it and
it carries only its `48px 0` padding.

### Structure

`.framer-1itlwii` column, gap 32, max-width 1280 → a 640-wide title block (h3 + intro, gap 10)
→ `.framer-18lgsti`, a 13-tile grid at gap 16. Each tile is a graphic and a label.

Five tiles carry a **line glyph on a `mark`@20% square** (Your Firm's Data · Real-time Web &
News · SEC Filings · Transcripts · International Filings); the other eight carry the
**provider's own mark**, which is a full-bleed coloured square in every case — hence no tile
fill and no padding under those.

### Measured values — probed live at 1600 / 1440 / 1024 / 390

|            | ≥1200      | 810–1199   | ≤809            |
|------------|------------|------------|-----------------|
| block padding | `48px 0` | `48px 0`  | `0`             |
| grid       | 3 × 416px  | 2 × 464px  | **2** × 171px   |
| tile       | 416×80     | 464×80     | 171×48          |
| tile padding | 16       | 16         | `8 16 8 8`      |
| tile gap   | 16         | 16         | 12              |
| graphic    | 48         | 48         | 32              |
| label      | 20 / 1.5em | 18 / 1.5em | 14 / 1.1em      |
| intro      | 18 / 130% / −0.02em | 16 / 130% / −0.02em | 16 / 130% / −0.02em |

**Columns go 3 → 2 → 2, not 3 → 2 → 1.** The phone tier keeps two columns and shrinks the
tile. A plain "one column on phones" rule gets it wrong; this was the one structural surprise
in the block.

h3 is the same preset as 2a and 2d: 44 / 40 / 32, weight 400, 110%, −0.05em, `ink`.
Tile fill `#f5f5f566` = `surface`@40%; rule `#8b8b8b1a` = `mark`@10%; glyph square
`#8b8b8b33` = `mark`@20%. Radius **0** everywhere. The glyph is ~52% of its square
(25 of 48, 17 of 32), centred.

**The border is an overlay, not a `border`.** The original paints it with
`[data-border] ::after`, which takes no layout space. A real border pushed the label 1px right
and made the phone tile 50px instead of 48 — both measured, both gone once it became an
absolutely-positioned overlay span.

### Verification

Every value above was diffed against the live page, element for element, at 1440 / 1024 / 390:
block box, padding, gap, grid columns, grid gap, tile box, tile padding, tile gap, graphic box,
label offset, label size and line-height, intro size/line-height/tracking. **All identical**,
including the block's own height (721 / 900 / 613 px).

Contrast: `ink` on the tile fill over paper **17.65:1**, `muted` on `paper` **4.74:1** (AA),
`ink-soft` glyph on `mark`@20% **9.31:1**.

### Assets — vendored, and this is the exposure

Eight provider marks under `public/logos/product/`: `lseg.png` `dow-jones.png` `factset.png`
`capital-iq.png` `preqin.png` (rasters, from framerusercontent at the original's own sizes),
`quartr.svg` `daloopa.svg` (fetched SVGs, each given the `viewBox` the source omits), and
`pitchbook.svg` (decoded out of the inline data-URI Framer emits instead of a def). All eight
rasterise non-blank — the only real validation, per `public/README.md`.

The five line glyphs are **not** files: their path data is inlined verbatim from the capture's
defs block and the one data-URI, drawn with `currentColor`.

⚠️ **This block is the reason the route is `noindex`.** Eight third-party trademarks, logos
included, asserting partnerships that do not exist. Shipped verbatim on the user's explicit
call; they must be replaced before this page is indexed.

### Acceptance checklist — Block 3

- [x] Renders at 1600 / 1440 / 1024 / 390, no horizontal overflow at any tier
- [x] **Every measured value matches the live reference at 1440 / 1024 / 390**, block height included
- [x] Tokens only; contrast checked; `npm run build` and `eslint` clean
- [x] All eight vendored logos rasterise non-blank
- [ ] ⚠️ Eight vendor trademarks ship verbatim — must be replaced before this route is indexed
- [ ] No interactive states: the tiles are not links in the original, so there is nothing to hover, focus or activate

---

## Block 4 — `Benefits` ("AI That Learns How Your Firm Thinks and Works") ✅ built

`src/components/product/ProductBenefits.tsx` + `benefitArt.tsx`. ⚠️ **Not a section** — the
last child of `#features`.

### ⚠️ Six benefits, not four

Slicing the capture from this block's offset to the next section's marker reads as **four**
items. A live probe finds **six**: `Governance & Permissions` and `Single Tenant Deployment`
are the two a byte-slice misses. Same class of mistake as the section inventory itself —
**count against the render, not the file.**

### Structure

`.framer-ly0q7s` column, gap 40, max-width 1280, no padding → an h3 → `.framer-3qeold`, a
6-card grid at gap 16. Each card is a title, an art well and a description well.

The h3's line break is the original's own `<br>`, not a wrap: line 1 is `ink`, line 2 is
`muted`, so where it breaks **is** the colour boundary and cannot be left to the browser.

### Measured values — probed live at 1440 / 1024 / 390

|               | ≥1200      | 810–1199   | ≤809       |
|---------------|------------|------------|------------|
| block gap     | 40         | 40         | 40         |
| h3            | 44         | 40         | 32         |
| grid          | 3 × 416    | 2 × 464    | 1 × 358    |
| grid gap      | 16         | 16         | 16         |
| card          | 416×528    | 464×589    | 358×454    |
| card padding  | `24 16 16` | `24 16 16` | `16`       |
| art well      | 384×373    | 432×434    | 326×307    |
| desc well     | 384×84     | 432×84     | 326×84     |

**The card height is not authored per tier.** Every card is `aspect-ratio: 0.788044` — the
same ratio 2d's art boxes carry — which is why 416→528, 464→589 and 358→454 all agree. One
rule, not three numbers.

Card fill `#f5f5f5` = `surface`, radius 0. h6 28 / 110% / −0.04em / **500**, in the original's
*body* face (Inter), not its display face — a note rather than a choice, since both resolve to
Discovery here. Description 14 / 130% / −0.01em `muted`, in a fixed 84px well with
`justify-content: flex-end`: the six bodies run 1 to 4 lines and that is what keeps them on
one baseline across a row.

### The six illustrations — one vendored, five rebuilt

| # | Benefit | Source | Rendered | Ours |
|---|---|---|---|---|
| 1 | Integrations | inline def `#svg2107740873_10853`, 299×194 | 213×138 | **vendored** |
| 2 | Prompt Library | `Ai1MRBNzdfhFLnx4E0V2bNdUiI.svg`, 280×357 | per tier | rebuilt |
| 3 | Guided Implementation | `5HetZbyFL8dnsh9HFTZzwfUpRrk.png`, 416×160 | 128×49 | rebuilt |
| 4 | Custom-Trained Models | inline data-URI, 203.48×174 | 203×174 | rebuilt |
| 5 | Governance & Permissions | `owjXcQ1FEy8SiPDDgo9j1jx1Yww.svg`, 320×358 | 178×199 | rebuilt |
| 6 | Single Tenant Deployment | inline def `#svg-710985286_2997`, 193×253 | 156×204 | rebuilt |

**#1 is the only one vendored**, for the same reason Block 3's partner marks are: it is a wall
of third-party product logos (Word, Excel, PowerPoint, SharePoint, Google Drive) that we
cannot honestly redraw, and it carries no rogo branding at all →
`public/product/benefit-integrations.svg`.

The other five each carry something that must not ship under this wordmark:

- **#4 and #6 contain rogo's own logo mark** → `ClixMark` on the same `brand-green` tile.
- **#3 contains a photograph of an identifiable real person** → three generic avatars. The
  same line this document's gate draws around Block 6's headshots. It is the one graphic here
  that does not attempt to match the original's colour.
- **#2 and #5 are rogo's product UI** — the same category as 2d's three mocks, which the
  user's call rebuilt rather than vendored.

Geometry is read off the source SVGs, not estimated: the prompt list's nine pills at x25,
y 12 + 38n, h32, r2, with the source's own widths (183 / 211 / 122 / 183 / 117 / 204 / 104 /
210 / 155); the model grid's 7×3 of 22.295px squares on a 28.713 pitch from (4.451, 0.357),
with the green/grey pattern read from the stroke of each of the 21 paths in order; the tenant
grid's 3×3 of 46.621 cells on a 55.548 pitch from (17.641, 87.496), the selected cell's dot
15.871 rather than 14.879; the governance panel's two 129×72 stat boxes and five bars on a
42px pitch filled to 270 / 248 / 213 / 187 / 157 of a 271 track.

**Every graphic renders at a fixed pixel size at every tier — except the prompt list, which
has three, and does NOT preserve its own aspect ratio** (280×357 source rendering 290×369 at
tablet, so one scale factor cannot hit both axes). That box is fixed in classes and its
contents scaled separately; everything else is one `--u` per graphic.

### Verification

Twenty computed values diffed against the live page at 1440 / 1024 / 390 — block box, gap,
padding, h3 metrics and height, grid columns and gap, item count, card box/padding/fill, h6
metrics and offset, art well box and offset, description well box, offset and justification,
paragraph metrics, and all six art sizes. **All identical**, with one exception:

- the block's own height at 390 is 2916 vs the original's 2915. Six rows of a 454.281px card
  accumulate to 2916.09; Framer's grid appears to pixel-snap its rows. 1px on a 2915px block,
  left alone.

### ⚠️ Contrast — this block introduces an AA failure, and it is inherited

| Pair | Where | Ratio | |
|---|---|---|---|
| `ink` `#151515` on `surface` `#f5f5f5` | card titles | **16.75** | AAA |
| `paper` on `brand-green` | the mark tiles | **8.05** | AAA |
| `brand-green` on `surface` | governance bars, model grid | **7.38** | AAA (non-text anyway) |
| **`muted` `#737373` on `surface` `#f5f5f5`** | **the six 14px descriptions** | **4.35** | **FAILS AA** (needs 4.5) |

**Not introduced by us — it is the original's own pairing**, and it is the same shape as the
failures already flagged in `features/security/` (labels 3.85:1 on `ink`) and
`features/footer/`. It is close: `#717171` reaches 4.50 and is visually indistinguishable.
**Needs the user's call** — fix it here and the same `muted`-on-`surface` pair elsewhere
becomes inconsistent, so this is a site-wide decision, not a one-card one.

Note the block *next door* passes: Block 3's tiles are `surface` at **40%** over `paper`, i.e.
`#fbfbfb`, where the same `muted` reaches 4.74. The failure comes from the full-strength fill.

### Acceptance checklist — Block 4

- [x] Renders at 1600 / 1440 / 1024 / 390, no horizontal overflow at any tier
- [x] **Twenty measured values match the live reference at 1440 / 1024 / 390**, six art sizes included
- [x] Tokens only; `npm run build` and `eslint` clean
- [x] The vendored integrations SVG rasterises non-blank
- [ ] ⚠️ **`muted` on `surface` is 4.35:1 and fails AA** for the six descriptions — inherited from the original, needs the user's call (see above)
- [ ] Block height at 390 differs by 1px — grid row snapping, accepted
- [ ] ⚠️ `benefit-integrations.svg` carries five third-party product logos — same gate as Block 3
- [ ] The avatar cluster does not match the original's colour, by choice — it replaces a photograph of a real person
- [ ] No interactive states: the cards are not links in the original

---

## Block 5 — `Security` ("Built for Enterprise / Secure by Design") ✅ built

`src/components/product/ProductSecurity.tsx` · capture offset 391292 · `.framer-12x6y61`.

### ⚠️ The plan was wrong about this block, and the error was structural

The plan said *"Block 5 imports `src/components/sections/Security.tsx` unchanged"*. Diffed
against the capture before writing a line, they share nothing but a name:

|             | /product | home |
|-------------|----------|------|
| ground      | **white** section wrapping an `ink` **card** | `ink` section, edge to edge |
| heading     | left, 44/40/32, two-tone `muted` → `paper` mid-heading | centred, 48/44/36, one colour |
| grid        | 2 × 2, **dashed** `#ffffff26` | 5 → 2 → 1, solid |
| cell        | label bottom-left, 104px mark centred | mark centred, label centred below |
| also has    | icon + "Security" label, a 4-item list, a "Find out more" link | none of it |

No prop bridges that. Built as its own component.

### Structure

Section (white, `0 40px` / `0 16px`) → card (`ink`, max-w 1280, **618px tall** and a row at
≥1200; a column with gap 32 and its own padding below that) → Left / Right.

Left is `justify-content: space-between` with **two** children — the icon+label, and a
container holding title + list + link. **The link is inside that container, not a third
sibling.** Getting that wrong put the heading 64px too high at 1440 and looked entirely
plausible on screen; the numbers caught it.

### Measured values

| | ≥1200 | 810–1199 | ≤809 |
|---|---|---|---|
| section pad | `0 40px` | `0 40px` | `0 16px` |
| card | row, 618px, pad 48, `space-between` | column, gap 32, pad 28, `center` | column, gap 32, pad 24, `flex-start` |
| left / right | 592 × 522 each | 888 wide, right 480 tall | 310 wide |
| h3 | 44px | 40px | 32px — all 110%, −0.05em, `muted` with a `paper` span |
| list | gap 10, item gap 16, 16px/130%/`surface`, 24px glyphs | same | same |
|  align-items | **center** | **flex-start** | **center** |
| link | `width: min-content` | `min-content` | **100%** |
| grid | 2 cols × 2 rows, 296 × 261 | 2 × 2, 444 × 240 | **1 col**, 310 × 220, `aspect-ratio 1.40909` |
| cell rule | dashed `#ffffff26`, per-cell matrix `1001 1101 1011 1111` | same | `1101 1101 1101 1111` |
| badge label | 14px/130%, `muted`, absolute 16px off bottom-left, 137px measure | same | same |
| graphic | 104 × 104 frame; SOC2 square, the other three `aspect-ratio 1.00833` | same | same |

`align-items` is the trap: it is **centre at both ends and flex-start only in the middle
tier**, so a plain mobile-first `items-start tablet:items-center` gets 1200+ wrong.

### Verification

`docs/reference/block-diff.js` with `sec-diff.js`, 36 values × 3 tiers. **Every geometry
value matches**, including the two that were wrong first time round (1024 height 942, phone
height 1300). What remains:

- `labelBox` 98 → 91 and `linkBox` 134 → 124 — text width under Discovery. The one-face
  deviation, visible nowhere else.
- `gap: normal` vs `0px` — identical layout; Tailwind cannot express "no gap declared", only
  `gap: 0`, and the two compute the same.

---

## Block 6 — `Testimonials` ✅ built

`src/components/product/ProductTestimonials.tsx` · capture offset 401160 · `.framer-h211wl`.

### ⚠️ The capture lies about every moving part of this block

The frozen HTML shows three slides, both arrows `disabled`, `opacity: 0`, and
`object-position: left center` on the portraits. Sampling the **live** track transform every
250ms for 23s says all four are wrong:

| | capture says | live page does |
|---|---|---|
| slides in the DOM | 3 | **12** — 3 originals + clones |
| autoplay | — | **advances every 6.0s** (t = 4.70, 10.70, 16.64, 22.63s) |
| looping | — | **yes** — at t = 17.68s the track jumped −7725.6 → −3864.0 in one frame, no intermediate sample. That instant jump is the clone snap |
| arrows | both `disabled` | **never disabled**, `opacity: 1` at every sample |
| portrait crop | `left center` | **`50% 50%`** — the hydrated component's computed value, and visibly a different part of the frame |

A step is **1288px** = the 1280 container + the 8px gap, over **~1.1s**, strongly ease-out:
46% of the distance inside the first 250ms, 92% by ~520ms, then a long settle. That is a JS
spring; `cubic-bezier(.25,1,.5,1)` at 1100ms is a **fitted stand-in** — the only
approximation in this block.

**A method note worth keeping:** the first probe clicked "Previous" and read the track 1.8s
later, and concluded a click moves *two* slides. It does not — autoplay fired during the
wait. **Check for autoplay before measuring any click.**

### ⚠️ It is also DRAGGABLE, and it is not a snapping carousel

Reported by the user, then measured with synthesised pointer drags. The track carries
`cursor: grab`, `touch-action: pan-y`, `user-select: none`, and:

| | behaviour |
|---|---|
| while dragging | follows the pointer **1:1** — 150px of travel moves the track exactly 150px. No rubber-banding, no damping |
| release after a **slow** drag | **stays where you dropped it**, mid-slide. Held-still releases at 40 / 100 / 160 / 220 / 280 / 340px each settled at exactly the dragged distance and none changed slide. **There is no snap-back** |
| release after a **flick** | commits exactly one slide (1288px) |
| what restores the grid | **the next index change, not the release.** After an off-grid drag the following autoplay tick moved an odd distance — 1288−60, 1288−340 — landing the track back on an exact multiple. Autoplay and the arrows target an INDEX and absorb whatever offset is outstanding |

So the commit is driven by **velocity at release, not distance**: 340px released stationary
does nothing, 300px flicked advances. The rule here — commit when
`|dx + v × 0.15| > 30%` of the slide width, with velocity forced to 0 if the pointer has
been still for 80ms — is **fitted to those observations**, not read off the page. It is the
one formula that reproduces all three of "340 held → nothing", "300 flicked → one slide",
"60 flicked → nothing".

**Verified against the live page, one drag per fresh page load:**

| trial | rogo.com | ours |
|---|---|---|
| 300px flick | committed one slide (1288px) | **committed one slide (1288px)** |
| 340px held 400ms | stayed where dropped | **stayed where dropped** |
| 60px flick | stayed where dropped | **stayed where dropped** |

**Two measurement traps, both of which produced confident wrong answers first:**

1. **Velocity from a single event pair is wrong.** Browsers coalesce pointer moves, so two
   events can share a timestamp — divide by zero, and the guard against it left velocity at
   0, so no flick ever committed. It now measures over a trailing **100ms window**.
2. **A multi-trial probe contaminates itself.** Once one trial leaves the track off-grid,
   every later "residual" reading is meaningless, and autoplay ticks land inside the
   measurement window. The numbers above come from **one drag per fresh page load**.

### Three subtrees in the original, two here

| tier | original | ours |
|---|---|---|
| ≥1200 | `Desktop` slideshow, 3 slides **with** 360px portraits | the slideshow, photo column visible |
| 810–1199 | `Mobile` slideshow, same 3 slides, **no** portraits | the same slideshow, photo column `hidden` |
| ≤809 | `Testimonials (Mobile)`: a static stack of **two** cards | its own markup |

The first two are one component with one hidden column — verified identical, so a second
subtree would only duplicate DOM. The third genuinely cannot be collapsed:

- **two** testimonials, not three (Sean Warneke is absent below 810)
- **Patrice's quote is different copy** — "Rogo **is going to transform**" below 810 versus
  "Rogo **transforms**" above it. Not a truncation
- Patrice is **first** on phones (`order: 0`) and second in the DOM everywhere else
- its own paddings (`24` / `32 24 24 24`) and gaps (`20` / `80`), no photos, no arrows

### Measured values

| | ≥1200 | 810–1199 | ≤809 |
|---|---|---|---|
| section | 914 tall, pad `124 40 96`, gap 40 | same | 959 tall, pad `0 16 96`, gap 24 between cards |
| slideshow box | 1280 × 694 | 944 × 694 | — |
| card | 904 × 694, pad 48, gap 80 | 944 × 694, pad 48, gap 80 | 358 × **505** and 358 × **334** |
| quote | **32px** Patrice, **36px** the other two | **28px** all three | **20px** — all at 1.3em, letter-spacing **0** |
| name | 18px | 16px | 16px — 130%, −0.02em, `ink` |
| role | 14px, 1.4em, ls 0, **uppercase**, `muted` | same | same |
| company mark | 200 × 20 frame at **0.7** opacity, `contain`, left top | same | same |
| portrait | 360 × 694, `cover`, **centre** | hidden | hidden |
| arrows | 40 × 40, gap 12, 44px below the section top, 80px in from its right edge | same, 40px in | none |

Card fills alternate cream / `surface` / cream — authored per card, not derived from index.

### Verification

`tst-diff.js`, 25 values × 3 tiers — **ALL MATCH**, including all three phone-only values.

One harness bug found and fixed rather than papered over: the mark's 0.7 opacity sits one
level higher on the target (Framer inserts a background-image wrapper), so reading a single
node showed `1` on the target and `0.7` here — a diff that was not real. It now multiplies
the whole opacity chain up to the card.

---

## Block 7 — `Footer`

Not a new component. The footer subtree in the `/product` capture is **byte-identical** to
the home capture's — same `.framer-8dt5bh-container`, same `.framer-qd34j7` link class, same
"Unlock financial AI / for your firm", same four link columns. `<Footer />` reused unchanged,
which makes it the one block the plan called correctly.

---

## Page order — the blocks are not in DOM order below 1200

`#features` order 1, `#testimonials` order 2, `#security` order 3 at both tiers under 1200;
unset (source order) at 1200 and up. So **security sits above testimonials on desktop and
below them on tablet and phone.** `<main>` is `flex flex-col` for that reason alone, and the
two components carry the `order-*` classes. Verified at 1600/1440/1024/390: the rendered
order flips exactly at 1200.

---

## Tokens used

`ink` · `paper` · `muted` · `surface` · `hairline` · `forest-deep` · `brand-green` (new) ·
`mock-panel` / `mock-line` / `mock-fill` (new, 2d's mocks) · `mark` (Block 3 tiles) ·
`ink-soft` (Block 3 glyphs, Block 4 avatars) · `hairline-light` (Block 5 rules) ·
`bone` (new, Block 6 cards) · `--container-max` ·
`--font-display` · `--font-sans` · `--ease-rogo` · breakpoints `tablet` / `desktop`.

## Documented deviations

| Property | Original | Ours | Why |
|---|---|---|---|
| CTA `href` | none at desktop/XL; `./demo` at tablet/phone | `/demo` at every tier | The same authoring slip the site footer already carries. A CTA that does nothing at the widest tier is a bug, not a design |
| Display / body face | ABC Arizona Mix Regular, Inter | Discovery | Site-wide one-face decision, 2026-08-08 |
| Submit green | `#135b45` | `#135b45` (`brand-green`) | Kept verbatim. ⚠️ It is rogo's green — flagged for the copy pass |
| Focus-visible | none | rings on all four controls | Accessibility floor; a deliberate divergence recorded in `DESIGN-SYSTEM.md` |
| Reduced motion | none | caret static, first phrase shown | Same |
| Step-01 icon tile colour | tinted per source — the "Real-time Web" glyph sits on **blue** | always **`brand-green`** | User's call. One accent stops the panel reading as a colour-coded legend it never was |
| Step-01 tick | ~1000ms (the user's own description of the original) | **1800ms**, slide 500ms | User's call — "its moving fast". No longer a measurement; recorded here so it is not later mistaken for one. This is the block's ONLY remaining deviation — the centring tried on 2026-08-11 was reverted once the real cause was found |
| Named vendors + testimonial people | rogo's | rogo's, verbatim | **User decision 2026-08-11.** Gated behind `noindex`; must be replaced before this route is indexed |
| Data-partner label face | Test Martina Plantijn Regular (a **serif**) | Discovery | Site-wide one-face decision. ⚠️ `DESIGN-SYSTEM.md` said Martina Plantijn was "declared but never applied anywhere we've measured" — this block is where it IS applied; corrected there |
| Data-partner label colour | `rgb(23,23,23)` | `ink` `#151515` | A 2-unit difference, invisible at any size. Not worth a near-duplicate token beside `ink` |
| Data-partner glyph stroke | `#44403C` | `ink-soft` `#383838` | Same reasoning. The glyph paths themselves are verbatim; only the stroke colour is tokenized |
| Data-partner tile border | `[data-border] ::after` overlay | an absolutely-positioned overlay span | Same mechanism for the same reason: a real `border` takes layout space, which pushed the label 1px right and made the phone tile 50px instead of 48. Measured — both deltas vanish with the overlay |
| Benefit graphic — bar green | `#15803D` | `brand-green` `#135b45` | The source's governance bars are a brighter green than anything else on the page. Shipping it would introduce a second accent for one illustration |
| Benefit graphic — avatars | two blues + a **photograph of a real person** | three token tones + generic avatars | A photograph of an identifiable person is the same thing this document's gate refuses for Block 6. There is no faithful substitute, so this graphic deliberately does not match the original's colour |
| Benefit graphic — rogo's mark | in graphics #4 and #6 | `ClixMark` on the same tile | The mark is the brand; it becomes ours |
| Security badges | SOC2, CCPA, ISO 27001, GDPR | **the same four, verbatim** | User's "copy everything 100%" call, under the `noindex` gate. ⚠️ This repo REMOVED this exact set from the home page on 2026-08-05 because SOC 2 and ISO 27001 are audited certifications clix does not hold. `sections/Security.tsx`'s practice statements are the drop-in replacement |
| "Find out more" target | `./security` — a page rogo has | `/security` | ~~This site has no `/security` route~~ **RESOLVED 2026-08-12: it does now** (clone of rogo.com/security), so the link goes where the original's does. Was `/#security`, home's own band, for as long as there was no page |
| Security cell rules | `[data-border] ::after` | overlay span | Same as Block 3's tiles, same reason: a real border takes layout space |
| Testimonial role face | Rooftop Mono Regular (a **mono**) | Discovery | One-face decision. The block's uppercase + 1.4em + zero tracking are kept, so the treatment survives the face swap |
| Slideshow arrows | flat SVGs, pill `#F5F5F4` | inlined SVG, pill `surface` `#F5F5F5` | One step of blue. A token for a 1/255 difference on two 40px circles is noise — and inlining is what lets them carry a real focus ring |
| **Autoplay** | advances every **6.0s** | **none — removed** | ⚠️ **User's call, 2026-08-11.** The 6.0s cadence is measured and stays on the record; the behaviour is a deliberate divergence, not a gap. Arrows and drag are now the only way to change slide, and therefore the only things that re-align an off-grid drag |
| Slideshow easing | a JS spring | `cubic-bezier(.25,1,.5,1)` @ 1100ms | Fitted to the sampled curve, not read from it. The 6.0s cadence, the 1288px step and the loop ARE measured |
| Drag commit rule | a JS gesture recogniser | `|dx + v × 0.15| > 30%` of the slide, velocity zeroed after 80ms idle | Fitted — the one formula reproducing all three measured cases. The 1:1 tracking, the absence of snap-back and the index-change re-align ARE measured, and ours matches the reference on all three trials |
| Phone testimonial order | DOM order Pieter → Patrice, reversed with CSS `order` | authored Patrice → Pieter directly | Identical pixels, and screen readers get the visual order instead of the reversed one |
| Phone role string | set in CAPITALS **and** `text-transform: uppercase` | sentence case + the transform | Identical output; one less string to keep in step |
| Horizontal rules at phone | the two elements swap which edge they anchor to | stated directly as symmetric insets | Framer authoring noise; the rendered result is identical |

## Acceptance checklist — Blocks 5, 6 and 7

- [x] Render at 1600 / 1440 / 1024 / 390 — **zero horizontal overflow at all four**
- [x] Block 5: 36 measured values × 3 tiers match, except two text widths that follow from the face swap
- [x] Block 6: **25 measured values × 3 tiers, ALL MATCH**
- [x] Block 6 drag: 1:1 tracking, no snap-back, flick-to-commit and index re-align all match the live page on a one-drag-per-fresh-load comparison
- [x] Autoplay removed on request — verified: 90 samples over 23s show **1 distinct track position** (it never moves on its own), and all three drag trials still match the reference afterwards
- [x] Block order flips at exactly 1200, verified in the rendered DOM at all four tiers
- [x] `data-nav-theme` is contiguous across the whole page — no gaps, so the nav never falls back
- [x] Every control keyboard-reachable with a visible `focus-visible` ring (3 at ≥810, 1 at ≤809)
- [x] Reduced motion: autoplay off and the slide transition removed
- [x] `npm run build` clean, `/product` still prerendered static; `eslint src/components/product/` clean
- [ ] `eslint src/` reports **2 errors, both pre-existing in `src/components/clix/`** (an `<a href="/">` that should be a `<Link>`, and a ref read during render in `ClixHero.tsx`). Untouched by this work and not fixed here — they belong to `/clix`
- [ ] ⚠️ **Contrast — three inherited AA failures, all the original's own pairings.** `muted` on `bone` **4.24**, `muted` on `surface` **4.35** (the testimonial roles), `muted` on `ink` **3.85** (the four badge labels). Same family as the ones already awaiting a decision; no new *kind* of failure, and fixing `muted` here alone makes it inconsistent site-wide
- [ ] ⚠️ **Three named real people, their photographs and their quotes ship verbatim** — the hardest item on the page's gate
- [ ] ⚠️ **Four certification badges ship verbatim**, including two audited certifications clix does not hold

## Acceptance checklist — Block 1

- [x] Renders at 1600 / 1440 / 1024 / 390 with no horizontal overflow (`scrollWidth == clientWidth` at all four)
- [x] Spacing, type and colour come from tokens or are documented above
- [x] Hover implemented on all four controls; bracket hover is measured, not guessed
- [x] Focus-visible on every interactive element
- [x] Reduced-motion fallback
- [x] `npm run build` clean — `/product` prerendered static, no type errors
- [x] Contrast checked — typed prompt `#171717` on `paper` **17.93:1 AAA**; arrow `paper` on `brand-green` **8.05:1 AAA**; subtitle `muted` on `paper` **4.74:1 AA**. No new failures introduced
- [ ] Compared side-by-side against the reference at **1024 and 390** — only 1600/1440 have been diffed against a user screenshot; the 1024/390 renders were inspected for layout and overflow but there is no reference to diff them against
- [ ] `alt` / labelling reviewed by someone other than the author — the typed prompt is `aria-hidden` and the two icon buttons carry `aria-label`s, but the field is decorative and non-functional, which may want a different treatment
- [ ] **Named vendors and testimonial people replaced; `robots` block removed only then**

## Open questions

1. **Is the decorative prompt field the right call?** It looks like a text input and is not one
   — no `<input>`, not focusable, `aria-hidden` on the typed text. The original is the same. A
   real input that goes nowhere would be worse; a `<figure>`-like treatment might be better.
2. **Hold and delete timings** are estimated. One live observation would settle both.
3. **Caret blink rate** is estimated for the same reason.
4. Whether the remaining blocks also collapse XL into desktop — verified only for Block 1.
5. ~~Whether `/product`'s `Security` block is value-identical to the home page's~~ — **answered
   2026-08-11: it is a different section entirely.** See Block 5 above.
6. Does the original's slideshow restart its 6s timer on a click? Not observable without a
   long scripted session; ours keeps a constant cadence.
7. Does it pause on hover? Same — unobserved, and ours does not.
