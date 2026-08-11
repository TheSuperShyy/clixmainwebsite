# Context: `/product` page

Newest entry on top. Append after every task — never rewrite past entries.

---

## Current state

**Status:** every block of `/product` is built. Blocks 1, 2a, 2b, 2c, 2d, 3, 4, 5, 6 in
`review`; Block 7 is the shared `<Footer/>`, reused unchanged. The route renders
`<Nav/> <main>hero · features · security · testimonials</main> <Footer/>`, is `noindex`, and
is reachable from the nav. `npm run build`, `eslint src/components/product/`, the contrast
sweep and the 4-tier overflow sweep (1600/1440/1024/390) are all clean as of 2026-08-11.

⚠️ `eslint src/` is **not** clean, and it is nothing to do with this page: two pre-existing
errors in `src/components/clix/` — an `<a href="/">` that should be a `<Link>` in `ClixCTA`,
and `reduced.current` read during render in `ClixHero`. The second is a real React fault
(a ref read during render will not re-render when it changes), worth fixing when `/clix` is
next opened.

**Next action:** the **copy + content pass**. Nothing structural is outstanding. What is
outstanding is the gate: this route cannot be indexed until the borrowed content is replaced.

### ⚠️ What blocks indexing, in order of severity

1. **Three named real people with photographs** (Block 6) — Patrice Maffre / Nomura, Pieter
   Taselaar / Lucerne Capital, Sean Warneke / Schonfeld, with quotes and headshots, plus
   Nomura's mark. An endorsement attributed to an identifiable person. The repo's own
   testimonial people are already in `public/testimonials/`.
2. **Four certification badges** (Block 5) — SOC2, CCPA, ISO 27001, GDPR. Two of them are
   audited certifications clix does not hold. `sections/Security.tsx` already holds the
   practice-statement replacements written for exactly this reason on 2026-08-05.
3. **Eight vendor trademarks with logos** (Block 3) and five product logos (Block 4).
4. Every string on the page is rogo's.

`robots: { index: false, follow: false }` in `src/app/product/page.tsx` is the guard. Do not
remove it as a side effect of unrelated work.
---
## 2026-08-11 — Blocks 5, 6 and 7: the page is structurally complete

### Block 5 — `Security`

**The plan said to reuse `sections/Security.tsx`. Measured first; they are different
sections.** /product is a white section wrapping an `ink` **card**, left-aligned two-tone
44/40/32 heading, a 4-item list, a "Find out more" link and a **2 × 2 dashed** badge grid.
Home's is a full-bleed `ink` section, centred 48px, five solid-bordered cells, and none of
the left column. No prop bridges that. New component.

**The one structural error, and it was invisible on screen.** The "Find out more" link is
**inside** the title/list container, not a third sibling of it. Built as a sibling, the
left column's `space-between` distributes three items instead of two and the heading lands
**64px too high** at 1440 — a render that looked entirely plausible. The computed-value diff
caught it; a screenshot would not have.

Two more that only numbers give you:

- `align-items` on the list rows is **centre at ≥1200 AND ≤809, flex-start only at
  810–1199**. Mobile-first instinct writes `items-start tablet:items-center` and gets the
  desktop tier wrong.
- the link is `width: min-content` everywhere **except** ≤809, where it is 100% — so
  `tablet:w-min`, not `desktop:w-min`.

Result: 36 values × 3 tiers, every geometry value identical. The only survivors are the two
text widths that follow from Discovery replacing Inter (`98→91`, `134→124`) and
`gap: normal` vs `gap: 0px`, which compute the same.

Icons inlined from the capture's defs. GDPR needed its own file — `public/badges/gdpr.svg`
is home's 102×102 data-URI version, /product's is a 121×120 `<use>` def, so it landed as
`gdpr-product.svg`. SOC2 / CCPA / ISO reuse home's, whose ids match the capture's byte for
byte.

### Block 6 — `Testimonials`: the capture is wrong about every moving part

Sampling the **live** track transform every 250ms for 23s contradicted the frozen HTML four
separate ways:

| | capture | live |
|---|---|---|
| slides | 3 | **12** (3 + clones) |
| autoplay | — | **every 6.0s** |
| loop | — | **yes** — −7725.6 → −3864.0 in one frame at t=17.68s: the clone snap |
| arrows | both `disabled`, `opacity:0` | **never disabled**, opacity 1 |
| portrait | `object-position: left center` | **`50% 50%`** — and it is visibly a different crop |

The `disabled`/`opacity:0` in the capture is the pre-hydration state, nothing more. Step is
1288px = 1280 container + 8px gap, over ~1.1s, 46% of the distance in the first 250ms and
92% by 520ms — a JS spring, for which `cubic-bezier(.25,1,.5,1)` @1100ms is a fitted
stand-in. **That easing curve is the only approximation in the block.**

**A method mistake worth keeping:** the first probe clicked "Previous", waited 1.8s, and
concluded a click moves *two* slides. It does not — autoplay fired during the wait. Check
for autoplay **before** measuring any click.

**⚠️ Autoplay was REMOVED on the user's call (2026-08-11), after being built and measured.**
The original does autoplay every 6.0s and that measurement stands — it is a deliberate
divergence, recorded as one, not a gap. Verified off: 90 samples over 23s show a single
distinct track position. The restore recipe is in the comment above `STEP_MS`. One knock-on
worth knowing: autoplay was what re-aligned an off-grid drag, so **the arrows and a
committed flick are now the only things that do** — a slow drag can rest off-grid until one
of them happens, which is what the original does between ticks anyway.

**It is also draggable — the user caught that, and the drag is not a snapping carousel.**
The track follows the pointer **1:1**; a release after a slow drag **stays where you dropped
it** (six held releases from 40 to 340px all settled at exactly the dragged distance, none
changed slide); a **flick** commits exactly one slide; and the grid is restored by **the next
index change, not the release** — the following autoplay tick moved 1288−60 and 1288−340,
landing back on an exact multiple. So the commit is velocity-driven, not distance-driven.
Ours now matches the reference on all three decisive trials (300px flick → commit, 340px held
→ no commit, 60px flick → no commit).

Two measurement traps here, both of which gave a confident wrong answer first:

1. **Velocity from a single event pair is wrong** — browsers coalesce pointer moves, so two
   events can share a timestamp. The divide-by-zero guard left velocity at 0 and no flick
   ever committed. Measured over a trailing 100ms window now.
2. **A multi-trial drag probe contaminates itself** — once a trial leaves the track off-grid
   every later residual is meaningless, and autoplay ticks land in the measurement window.
   The final numbers come from one drag per fresh page load.

Three subtrees in the original became two here. ≥1200 and 810–1199 differ only by the photo
column, so they are one component with one `hidden` div — verified identical. ≤809 could
**not** be collapsed and it is worth knowing why: it has **two** testimonials rather than
three, Patrice's quote is **different copy** ("is going to transform" vs "transforms"),
Patrice is first there and second everywhere else, and it has its own paddings, gaps, no
photos and no arrows.

Result: 25 values × 3 tiers, **ALL MATCH**.

One harness bug fixed rather than tolerated: the company mark's 0.7 opacity sits one level
higher on the target (Framer inserts a background-image wrapper), so reading a single node
reported `1` there and `0.7` here — a difference that did not exist. It now multiplies the
whole opacity chain up to the card.

### Block 7 — Footer

The footer subtree in the /product capture is byte-identical to the home capture's. Reused
unchanged. The one block the plan called right.

### Page order — the sections are not in DOM order below 1200

`#features` order 1, `#testimonials` order 2, `#security` order 3 under 1200; unset above it.
**Security is above testimonials on desktop and below them on tablet and phone.** `<main>` is
`flex flex-col` purely to make that work, and the two components carry the `order-*` classes.
Verified in the rendered DOM at 1600/1440/1024/390: the flip lands exactly at 1200.

### New token

`--color-bone: #f5f2eb`. DESIGN-SYSTEM.md listed it among the values "declared but never
applied anywhere we've measured" — true of home and /clix, and no longer true: /product's
testimonial cards alternate cream / `surface` / cream. Third correction of that kind, after
`brand-green` and Martina Plantijn.

### ⚠️ Contrast — three inherited AA failures, no new kind

`muted` on `bone` **4.24**, `muted` on `surface` **4.35** (testimonial roles), `muted` on
`ink` **3.85** (badge labels). All three are the original's own pairings and all three are
the same `muted`-on-a-light-or-dark-ground family already awaiting a decision in
`features/security/` and `features/footer/`. Recorded, not silently fixed: darkening `muted`
in these two blocks alone would make the token inconsistent everywhere else, which is
precisely why the earlier instances are still open.

### Page height vs the reference

Ours runs +46px at 1440, +161 at 1024, +169 at 390. **None of it is in these blocks** —
`#security` starts 2.7px late at 1440 and `#testimonials` the same 2.7px, i.e. blocks 5 and 6
add zero. The drift is earlier in the page (text wrapping under Discovery) plus ~43px in the
shared footer, both pre-existing.

---


## Log

### 2026-08-11 — Block 4 built: `Benefits` ("AI That Learns How Your Firm Thinks and Works")

`src/components/product/ProductBenefits.tsx` + `benefitArt.tsx`, the last child of `#features`.

**⚠️ Six benefits, not four.** Slicing the capture from this block's offset to the next
section's marker reads as four; a live probe finds six. `Governance & Permissions` and
`Single Tenant Deployment` are the two a byte-slice misses. This is the **third** time on this
page that reading the file instead of the render gave a wrong answer — after the section
nesting and after `Workflows Scroller`. The rule has earned its place: **count against the
render.**

**The card height is one rule, not three numbers.** 416→528, 464→589 and 358→454 all agree
because every card is `aspect-ratio: 0.788044` — and that is the *same* ratio 2d's art boxes
carry. Worth knowing before anyone "fixes" it with per-tier heights.

**The description well is a fixed 84px box with `justify-content: flex-end`.** The six bodies
run from one line to four; pinning them to the bottom of a fixed well is what keeps them on a
single baseline across a row. Not obvious from a screenshot, and it would have been very easy
to build as a natural-height paragraph and never notice.

**Six illustrations: one vendored, five rebuilt.** The split is by what each one carries, and
the reasoning is the part worth keeping:

- **Integrations → vendored** (`public/product/benefit-integrations.svg`). It is a wall of
  third-party product logos — Word, Excel, PowerPoint, SharePoint, Google Drive — which we
  cannot honestly redraw, and it carries no rogo branding at all. Same call as Block 3's
  partner marks.
- **Custom-Trained Models and Single Tenant Deployment → rebuilt**, because both contain
  **rogo's own logo mark**. Now `ClixMark` on the same `brand-green` tile.
- **Guided Implementation → rebuilt and deliberately off-palette**, because the middle of its
  three circles is a **photograph of an identifiable real person**. That is exactly what this
  page's gate refuses for Block 6's headshots, and no stock substitute would be "faithful"
  either — so it is three token tones with generic avatars and the colour match is abandoned
  on purpose.
- **Prompt Library and Governance & Permissions → rebuilt**, being rogo's product UI — the
  same category as 2d's three mocks.

Geometry came off the source SVGs rather than being estimated: pill widths, the 7×3 model grid
on its 28.713 pitch (with the green/grey pattern read from the stroke of each of the 21 paths
in order), the tenant grid's 55.548 pitch and its one 15.871 dot among 14.879s, the governance
bars' 270 / 248 / 213 / 187 / 157 fills of a 271 track.

**One graphic does not preserve its own aspect ratio and that cost a round.** Every
illustration renders at a fixed pixel size at every tier — except the prompt list, which has
three, and whose 280×357 source renders 290×369 at tablet. One scale factor cannot hit both
axes, so the first attempt was 1px tall everywhere. Fixed by pinning the box in classes and
scaling the contents separately.

**Verification:** the Block 3 pattern, widened to twenty computed values including all six art
sizes. Identical at 1440 / 1024 / 390 except the block's own height at 390 — 2916 vs 2915. Six
rows of a 454.281px card accumulate to 2916.09, so Framer's grid is pixel-snapping its rows.
Left alone.

**Colour deviation worth flagging:** the governance bars are `#15803D` in the source, a
brighter green than anything else on this page. They ship as `brand-green` rather than
introduce a second accent for one illustration.

**⚠️ This block introduces an AA failure and it needs the user's call.** The six 14px
descriptions are `muted` `#737373` on full-strength `surface` `#f5f5f5` = **4.35:1**, under the
4.5 AA floor. Inherited — it is the original's own pairing — and the same shape as the
failures already flagged in `features/security/` and `features/footer/`. `#717171` would reach
4.50 and is visually indistinguishable, but changing it here makes `muted`-on-`surface`
inconsistent everywhere else, so it is a site-wide decision. Worth noting **Block 3 passes on
the same pair at 4.74**, only because its tiles are `surface` at 40% over paper rather than
full strength.

### 2026-08-11 — Block 3 built: `Data Partners` ("Trusted Data")

`src/components/product/ProductDataPartners.tsx`, added inside `ProductFeatures.tsx` as a
sibling of `[Product]` — not a new section, per the correction already logged below.

**One structural surprise: the columns go 3 → 2 → 2, not 3 → 2 → 1.** The phone tier keeps two
columns and shrinks the tile from 416×80 to 171×48 (padding `8 16 8 8`, gap 12, graphic 32,
label 14/1.1em). The plan file said 3/2/1; a live probe said otherwise. Everything else in the
block is a straight read of the measured values.

**The border had to stop being a border.** Framer paints the tile rule with
`[data-border] ::after`, which takes no layout space. Ours started as a real
`border border-mark/10` and the diff caught two consequences immediately: the label sat at
x81 instead of x80, and the phone tile was 50px instead of 48 (border-box adds 2px to a 48px
min-height whose content is already 48). Replaced with an absolutely-positioned overlay span —
both deltas gone. Worth remembering as a class of bug: **a decorative rule that changes layout
is a different rule.**

**Verification is the strongest on this page so far.** A single headless session loads
rogo.com/product and localhost side by side at each tier and diffs twelve computed values
element for element. At 1440 / 1024 / 390 every one is identical, including the block's own
height (721 / 900 / 613). `cmpdp.js` in the scratchpad is the script; the pattern is worth
reusing for the remaining blocks.

**Assets — eight provider marks vendored** to `public/logos/product/`. Three different source
forms, which is why the extraction is worth recording: five are rasters on framerusercontent
(kept at the original's own sizes, 225–400px square), two are SVGs on framerusercontent
(fetched, then given the `viewBox` both omit — `public/README.md` rule 1, the fault that broke
five home-page logos in August), and PitchBook has no file at all: Framer inlines it as a
`data:image/svg+xml` background, so it was URL-decoded out of the capture. All eight rasterise
non-blank.

The five line glyphs are NOT files — path data inlined verbatim from the capture's defs block
(`#svg66653610_713` database, `#svg637455021_240` bank, `#svg1766875017_478` phone,
`#svg-209490878_991` networked globe) plus the meridian globe from its data-URI. Drawn with
`currentColor` so the colour comes from a token.

**Three colour deviations, all sub-perceptual and all deliberate**: label `rgb(23,23,23)` →
`ink` `#151515`; glyph stroke `#44403C` → `ink-soft` `#383838`; label face Martina Plantijn
(a serif) → Discovery, per the sitewide one-face decision. ⚠️ That last one **corrects
`DESIGN-SYSTEM.md`**, which listed Martina Plantijn as "declared but never applied anywhere
we've measured" — this block is where the original applies it.

⚠️ **This block is the reason the route is noindex.** LSEG, Dow Jones, FactSet, S&P Capital
IQ, PitchBook, Preqin, Quartr and Daloopa ship with names AND logos, asserting partnerships
that do not exist. The user's explicit call; the gate must hold.

### 2026-08-11 — 2d's three card mocks rebuilt from the source bitmaps

**Trigger:** user, with a screenshot of rogo's block — *"this is how it looks in the rogo, its
not the same as ours"*. Correct: the first pass built loose "token panels" carrying a few
labels, on the theory that the art was dressing. It is not — it is the block.

**What the originals actually are.** Three flat JPGs on framerusercontent, `922×1040` each,
fetched to scratchpad for measurement only (never vendored):
`TwCc7NSpim3LYfS9L52C427iqU` · `iLUrIYXexMEto7ZcsADicLSwEQ` · `jsXGDPEFEziUQou4fnyFKoRKjg`.
Because they are bitmaps there is no markup to read, so every number came out of `sharp`:
luma-threshold band scans for card edges and text rows, single-row/column colour-transition
scans for borders and dividers, point samples for fills.

**The scaling problem, and the fix worth reusing.** A bitmap in `object-fit: cover` scales
uniformly; a DOM rebuild reflows. Reproducing the former needs a **container query**: the art
box is `container-type: inline-size`, `--u: calc(1cqw / 8.206)` is one source pixel, and every
dimension is `u(sourcePx)`. 8.206 is not arbitrary — the source is 0.8865 in a 0.789 box, so
cover scales by height and only source x `0..820.6` survives the crop. `inline-size` and not
`size`: the box's height already comes from its aspect-ratio.

That crop is also **why mock 2 looks cut off**: it alone is `object-position: left center`, so
its card, pill and table genuinely run off the right edge in the original. Reproduced, not
worked around. The tier variants of `object-position` (`center` vs `center top`) turn out to
be no-ops — the crop is horizontal only.

**Type size was wrong by a uniform 1.2×.** Set at 30 source px by estimate; the side-by-side
diff showed our sans landing at 0.83× the reference's ink width *and* 0.84× its
cap-to-descender height. One number, not a font-metrics mismatch — 30 → **36** (caption 31)
fixed both. Lesson: check width **and** height before blaming the typeface.

**Three fixes that came out of the same diff**, all in the block rather than the mocks:
section gap is **64**, not 40; the title's `max-width: 512px` applies from 1200 up only; and
cards need `place-self: start` or card 1's four-line body drops the other two arts ~10px.

**New tokens:** `mock-panel` `#fafafa`, `mock-line` `#e5e5e5`, `mock-fill` `#e7e6e4` —
sampled from the bitmaps, so they have no Framer variable to quote. `mock-panel` is
deliberately **not** `surface` `#f5f5f5`: both appear inside mock 2, panel body against table
header. `#c03b1c` / `#10743e` stay raw inside the file-badge SVG — third-party product
colours, same category as the vendor logos, not part of this palette.

**`ClixMark` now takes a CSS-length `size`** as well as a number, because the mocks' mark
scales with a container query and cannot be resolved to px at render time.

**Substitutions, all flagged in FEATURE.md:** rogo's logo chip → `brand-green` tile with
`ClixMark`; the PowerPoint/Excel icons → lettered badges in the same two colours; the
"Finalizing citations" spinner is a **static** arc, because the source is a still frame.

**Verification:** each mock screenshotted at its own box and composited beside the source JPG
cropped to the same visible window (`cmp1/2/3`). Geometry, type and crop all land. Build,
eslint and the 4-tier overflow sweep clean. ⚠️ One false alarm: a `captureBeyondViewport`
clip of the whole 5000px block at 1024 rendered the mocks as empty dark rectangles — a paint
artefact of the tall capture, not a bug. A normal viewport screenshot at the same width shows
them correctly. Don't trust a tall beyond-viewport clip for far-below-fold content.

### 2026-08-11 — Stepper panels rebuilt from reference; step 01 took four passes

**Trigger:** user — *"the 2nd section is not copied 100%"*, with four screenshots, one per
step. Then, after the first rebuild: *"the All your content in one place part in rogo it
scrolls the illustration, cant you see it?"*

**The root cause is worth recording.** Only the **active** step's panel is ever mounted, so
both the frozen capture and the live CDP probe only ever showed step 01. Three of the four
panels had been **invented**, and the fourth was the wrong mechanism. Live probing does not
help when the thing you want to see is behind a state you did not enter — a probe that clicks
through each state would have caught this, and is the technique to reach for next time.

**Done:** new `stepperPanels.tsx` with all four panels rebuilt from the reference; the
scroller's tile shape corrected — it had been small pills with a leading dot, where the
original ships **86px tiles with a glyph on its own line above the label**. New `rows-up` and
`icon-pop` keyframes in globals.css. (An intermediate `.source-scroll` marquee was added and
then removed — see attempt 2 below.)

**Step 01 took THREE attempts. All three are worth recording.**

1. A discrete swap of three fixed rows. Wrong — there is real movement.
2. A continuous marquee with the focused card travelling. **Also wrong, and the reasoning was
   the problem**: I read two reference frames as showing the card at different heights (37% vs
   46%) and treated that as proof. They were two differently-cropped screenshots, so the
   difference was an artefact of the crop. *Do not infer motion from two stills at different
   crops.*
3. Correct, from the user's close-ups: **the white card is STATIONARY** and the labels step up
   through it one row per second, each step animated, the icon replaying an entrance on change.
   A four-row group slides up exactly one row behind a fixed card frame; the row landing in
   the middle carries the icon and ink text. Each label exists exactly once — having it in
   both the card and the strip showed it twice for the length of every slide.

A sixth source, **"Data rooms, meeting notes"**, came off the user's close-up and was missing
from every earlier pass.

**Two traps worth never hitting again**

- **A keyframe cannot be parameterised with a custom property without a fallback.** The row
  travel was first `calc(var(--row-h) * -1)` with the variable set inline by the component. An
  unresolvable value in a keyframe's `to` invalidates the declaration, so the animation ran
  and moved the strip precisely nowhere — a wrong-but-rendering layout, which is worse than a
  crash. Now hardcoded `-62px`, coupled by comment to `ROW_H`.
- **Sleeping exactly one tick between screenshots aliases against the animation.** Two full
  rounds of "the animation is not working" were really "the screenshot is 20ms into a 420ms
  move". The implementation had been correct for two rounds. To verify a timed panel, emulate
  `prefers-reduced-motion: reduce` via CDP `Emulation.setEmulatedMedia` and shoot the
  deterministic resting state. Also: a `find()` over `#features` can match the HIDDEN tier
  variant — filter on `getBoundingClientRect().width > 0` first.

**Other fixes found while doing this**

- **The advance was a free-running `setInterval`.** Clicking a step therefore did not reset
  the clock, so a click landing late in a cycle got a fraction of a second before the stepper
  moved on by itself. Now a `setTimeout` keyed on `active`. A real defect, not just a capture
  nuisance.
- Panel 02's prose had to be **lengthened to run past the floating card**. The card overlaps
  the middle of the paragraph and the cited figure has to survive on a line below it —
  otherwise the card hides the very number it is citing, which is the panel's entire point.

**Two deviations taken on the user's call, after seeing it run**

- **Step-01 tick slowed 1000ms → 1800ms** (slide 420 → 500). *"make it a little slower, its
  moving fast."* The 1000ms came from the user's own description of the original, so this is
  now OURS, not the target's — recorded so it is not later re-read as a measurement.
- **Centring the card's label: tried, then REVERTED — it was treating a symptom.** The user
  asked for it (*"it looks weird when they change and they suddenly go to the left side"*),
  and centring did stop the lurch. But their next message, with two more reference frames,
  gave the actual design: *"the text are justified start, and the logo is fixed in left, the
  logo changes icon inside when a new text comes in, and its smooth change it shrinks then
  large the new icon."*

  The real bug was that **the icon tile lived inside the sliding row**, so it mounted and
  unmounted with it and dragged the label sideways. The tile is now a fixed, absolutely
  positioned part of the CARD layer — it cannot move by construction — and only the glyph
  inside swaps, via a `key` on an inner wrapper running `icon-swap` (scale 0.4 → 1.06 → 1).
  With that fixed, `justify-start` is correct and matches the original. Geometry is derived
  once as `TILE_LEFT = 40` / `LABEL_LEFT = 88` from the card's `left-6` + 16px pad + 36px tile
  + 12px gap, because the tile is placed absolutely and the label by padding — two mechanisms
  that have to agree.

  **Then a third correction, and this one finally closed it.** User: *"the previous and next
  text should also be the same level as the current active one … its not a smooth transition
  having from next item into the center?"* Re-measuring the reference frames settled it: the
  muted labels are **not centred**. "Models & spreadsheets", "Data rooms, meeting notes" and
  "Filings and earnings" all begin at the same x (~170px in those crops). They only *looked*
  centred because the short ones sit balanced in a wide panel. Every row now shares one left
  edge at `LABEL_LEFT`, so the travel is purely vertical.

  Worth keeping as two general lessons: **a request to change how something looks can be a
  report of a bug elsewhere** (centring would have shipped a permanent deviation to hide a
  moving tile); and **"looks centred" is not a measurement** — three labels of different
  lengths sharing a left edge read as centred at a glance, and that misreading survived two
  rounds of rebuilding this panel.

- **The icon tile is now always `brand-green`** (user: *"stay the icon color to the green
  one"*). The original tints it per source — its "Real-time Web" glyph is on blue, which is
  where the second colour in this panel came from. The per-source `tone` field is deleted
  rather than left set to one value, so there is nothing to accidentally re-diverge.
  ⚠️ One blue survives elsewhere on purpose: the `Project ACME` folder chip in panel 04, which
  the reference also shows in blue. Say the word if that should go green too.

- Two more sources recovered from these frames: **"Filings and earnings"**, and the confirmation
  of "Data rooms, meeting notes". The list is now seven and still not known to be complete.

**Open / deferred**

- All four panels remain REBUILDS, not copies — the originals are Rive scenes of rogo's
  product UI. Timings estimated throughout.
- The step-01 source list is **seven items and not known to be complete**; the original's full
  set lives in the Rive file. Recovered so far: Investor presentations · Real-time Web ·
  External connections · Decks, memos · Models & spreadsheets · Data rooms, meeting notes ·
  Filings and earnings.
- **Block 3 copy, already extracted** (verbatim, for when it is built): heading "Trusted Data";
  intro "We partner with trusted data providers to bring the highest‑quality financial
  information to our platform. Their expertise, combined with Rogo's technology, gives
  customers the clarity and confidence they need to move fast." The 13 tile labels, in grid
  order: Your Firm's Data · LSEG · Dow Jones · FactSet · Capital IQ · PitchBook · Preqin ·
  Real-time Web & News · SEC Filings · Transcripts · Quartr · International Filings · Daloopa.
- ⚠️ **Two PRE-EXISTING lint errors exist in `/clix`, not introduced here** — found while
  running `eslint src`: `ClixCTA.tsx:54` uses an `<a>` to navigate to `/` where it wants
  `next/link`, and `ClixHero.tsx:116` accesses a ref during render. `eslint src` therefore
  exits non-zero; `eslint src/components/product src/app/product` is clean. Left alone as
  out of scope, recorded so the next session does not attribute them to /product.

### 2026-08-11 — Blocks 2b, 2c and 2d built; the section inventory corrected twice

**Trigger:** user — *"okay continue untill block 2c 2d"*.

**Done:** `ProductStepper.tsx` (2b, both tier variants), `WorkflowsScroller.tsx` (2c),
`ProductWorkflows.tsx` (2d), composed by `ProductFeatures.tsx`. New asset
`public/product/features-backdrop.jpg`. New keyframe `step-fill` in globals.css. Verified at
all four tiers plus dedicated tablet/phone captures of the stacked variant. Build, lint and
contrast clean.

**Decisions**

- **Probed the LIVE render instead of reasoning from the capture's `hidden-*` classes.** That
  is what caught both inventory errors below. The capture answers "what values"; only the
  render answers "what nests inside what, and what actually mounts".
- **Both stepper variants built separately**, `hidden`/`desktop:flex`, because the original
  itself ships two subtrees. Unifying them would have been a guess dressed as a refactor.
- **`Fill` is a CSS animation, not a transition**, with the row remounted via `key`. A
  transition needs a "have we hydrated" flag to start from a real 0; an animation always
  begins at its `from`. This also removed the `setState`-in-effect lint error the same
  pattern caused in ProductHero.
- **Step rows are `<button>`s** with `aria-current`; the original uses plain `<div>`s. The
  stepper is selectable, so it should be operable from the keyboard.
- **Product-UI art rebuilt from tokens, not vendored.** We have no clix product to photograph
  and shipping rogo's screens under this wordmark presents their software as ours. Precedent
  is `/news`'s token tiles. The scroller cards use a neutral dot rather than redrawing rogo's
  glyph.

**Measurements worth keeping**

- ⚠️ **`Data Partners` and `Benefits` are INSIDE `#features`.** The byte-offset inventory read
  them as top-level sections; they are not. `#features` is one band — 4024px at 1440, 8138px
  at 1024 — containing `[Product]` (2a+2b+2d), `[Data Partners]` and `[Feature]` "AI That
  Learns…". Only `Security`, `Testimonials` and `Footer` are true siblings. **Byte offsets
  give document order, never nesting.**
- ⚠️ **`Workflows Scroller` is not a block.** It is feature 03's animation panel inside the
  stepper. The inventory listed it as sub-block 2c because its offset sat between two others.
- **The stepper's image aspect changes by tier**: 768×541 (1.419) at desktop but 944×595
  (1.586) below 1200 — proportionally wider *and* shorter, not one box reflowed. Derived from
  the live `.9vv6u7` 655px block minus its 36px header and 24px gap.
- **The text column is `space-between`** — that, not a margin, is what pins the title to the
  top and the stepper to the bottom of the image's height.
- **The badge is a square with a circle SUBTRACTED**, painted `ink` — the "ring" is four
  corner slivers. A `border-radius: 50%` outline is a different shape.
- **2d's card direction is column → ROW at tablet → column again.** A plain "stack below
  desktop" rule gets the middle tier wrong.
- The `Fill` colour is `rgb(245,245,245)` at desktop and `rgb(245,245,244)` below — a
  one-unit difference, almost certainly authoring noise. Both mapped to `surface`.
- Panel radius is **1px**. Not 0, not 6. Reproduced as measured.

**Open / deferred**

- Backdrop and the three card panels are **substitutes** and need the user's call.
- Step advance (5200ms) and scroller speeds (38s/46s) are **estimated**.
- Not diffed against a reference at 1024 or 390.

### 2026-08-11 — Block 2a built (`Features` intro)

**Trigger:** user — *"okay it looks good"* on Block 1.

**Done:** `src/components/product/ProductFeatures.tsx` — the `Features` **section shell**
(bg `paper`, gap 120, padding 96/40 → 80/40 → 80/16) plus the two-tone intro headline. Wired
into the route. Verified at all four tiers, no overflow, lint and build clean.

**Decisions**

- **One `<h3>` with an inner `<span>`, not two blocks.** The colour changes mid-sentence; two
  sibling blocks would let the halves wrap independently and break the sentence across the
  colour boundary. Matches how the original does it.
- **Colours stated directly rather than reproducing Framer's override dance.** The preset is
  `ink`, the element overrides the whole heading to `muted`, the inner span puts it back to
  `ink`. Same rendered result, one less indirection to misread later.
- **The section shell lives in this file, not a wrapper.** 2b/2c/2d are the same `Features`
  section in the original and will land here as siblings, spaced by the 96px gap on
  `.framer-132yhjx`.

**Measurements worth keeping**

- Intro h3 is **44 / 44 / 40 / 32**, `-0.05em`, `110%`, `text-wrap: balance`, and **left**
  aligned — the only left-aligned heading on the page so far.
- Section padding drops **96 → 80** at tablet, and the gutter **40 → 16** only at phone. The
  vertical and horizontal steps happen at *different* breakpoints.
- ⚠️ **2b ships two full DOM variants, not one responsive tree.** `.framer-1fqb8kn` is gated
  `hidden-1pos691 hidden-bdpt8v` — hidden at desktop *and* XL — so it is the tablet/phone
  stacked layout, with a separate subtree for the desktop stepper. Do not attempt to unify
  them from the markup.
- Feature labels, verbatim: `01 All your content in one place` · `02 Transparent, auditable
  sources` · `03 Automate your workflows` · `04 Proprietary document interrogation`.
- The 10 `Shortcut Card` labels for 2c: Earnings Comp Analysis · Public Company Strip Profile ·
  Meeting Prep · Private Company Profile · Personal Bio · Financial Sponsor Overview · Public
  Company Profile · News Run · Secondaries Buyer Overview · Proofread My Deck.

**Open / deferred:** not diffed at 1024 or 390 against a reference.

### 2026-08-11 — Capture frozen, page-level mechanics settled, Block 1 built

**Trigger:** user — *"lets start developing the product section now, we have to be 100%
accurate with copying the https://rogo.com/product … tell me what you need."* The answer
turned out to be **nothing**: Node fetched the page directly, the same route `/news` took.

**Done**

- Froze `docs/reference/target/rogo-product-2026-08-11.html` (612,563 B) + `.css` (180,257 B,
  the five inline `<style>` blocks concatenated). Added rows to that folder's README,
  including the two felix rows that had never been recorded there.
- Established the page-level mechanics: tier→hash map, fixed nav, palette, section inventory.
- Built `src/components/product/ProductHero.tsx` and `src/app/product/page.tsx`.
- Added `--color-brand-green: #135b45` and `@keyframes blink` to `globals.css`; updated
  `docs/DESIGN-SYSTEM.md`.
- Vendored `public/video/hero-product.mp4` (4.86 MB) + our own poster frame.
- Flipped `Nav.tsx`'s `{ label: "Product", href: null }` → `href: "/product"`.

**Decisions**

- **Copy is rogo's verbatim, route is `noindex`** — user's call, offered against two
  alternatives. Extends to the named data vendors and the named testimonial people, which the
  user reaffirmed after the risk was put to them. Recorded as a hard gate in `FEATURE.md`
  rather than as a quiet TODO, because the cost of it shipping unnoticed is high.
- **The hero video is the original's own clip.** rogo hotlinks
  `videos.pexels.com/video-files/5941931/5941931-hd_1920_1080_30fps.mp4` — public stock, not
  rogo footage. So this is one of the very few assets on this project that can be taken
  verbatim with no licensing question at all. Downloaded rather than hotlinked.
- **Rive rebuild deferred to Block 2b**, per the user's choice of rebuilding in CSS/Framer
  Motion over vendoring `all_your_data_01.riv` and a ~200 KB runtime.
- **`brand-green` added rather than substituting `forest`.** `forest` `#1a2a25` is a near-black
  reserved for display type; swapping it in kills the green read the submit control is built
  around. Flagged as rogo's green, to revisit in the copy pass.
- **`rgb(23,23,23)` left untokenised.** It is the typed prompt's colour and sits 2 points off
  `ink` `#151515`. A token for a single near-duplicate would invite a mistaken reuse; a literal
  with a comment does not.
- **No animation library.** Neither the `gsap` nor the `framer-motion` trigger matches a
  four-phrase typewriter and a CSS keyframe.

**Measurements worth keeping**

- ⚠️ **The SSR capture's `framer-v-*` variant classes are STALE.** The hero CTA is declared
  `framer-v-velzew`, whose rules put the corner brackets at `top:-22/left:-48`. Built to that,
  they sat visibly too far out. The live hydrated class is
  `framer-5Atru framer-velzew framer-v-q741vz` — React swaps the variant on hydration — so the
  live values are `top:-12/left:-28`, `bottom:-12/right:-28`, confirmed by computed style
  (`leftDelta {dx:-28, dy:-12}` on a 220×40 box). **Treat a variant class in the capture as a
  hypothesis.** This is the single most useful thing learned on this page.
- ⚠️ **Headless Chrome now HAS network egress**, contradicting the 2026-08-03/04 note in
  `docs/CONTEXT.md`. It loaded the live page in full — title, `h1`, 336 `data-framer-name`
  nodes, 293 KB body. That is what made the variant question answerable at all. Live probing
  is now available for runtime variants, computed geometry, motion and hover.
- The variant correction **relocated the stylesheet's only real hover rule.** Of 19 `:hover`
  rules, 17 are Framer's link boilerplate; the 2 real ones are `.framer-v-q741vz.hover`, which
  slides the brackets in to `top:-2/left:-18`. They belong to the hero CTA, so that hover is
  measured rather than invented.
- **The typed prompt's phrase list was recovered in full** by grepping the 33 site modules:
  `benchmark revenue estimates for AAPL` / `analyze impact of rising rates on financial sector`
  / `expected ebitda figures for NVDA in q3 2024` / `compare valuation multiples of MSFT`,
  with `typeSpeed: 30`, `showCursor: true`. Bundle
  `ZcAf3VKJXH9VIfxmp-FSCoIZYOjifs-KtG_IUJebwsE.Cbu-MJq3.mjs`. Notable because the equivalent
  list on `/clix` was never found — the technique is worth retrying there.
- **The whole page's CSS holds exactly one transition:** `color .3s cubic-bezier(.44,0,.56,1)`
  = `--ease-rogo`, already tokenised. Every other timing on this page is estimated.
- The nav header is `.framer-1lcee9e` — **byte-identical to home's** — `position:fixed; z-index:3`.
  So `/product` is the home/`news` pattern, not `/clix`'s in-flow nav.
- `Hero` and `Product Preview` are **siblings**, not nested. Offsets 230251 / 236916.
- **Section order is not the heading order.** "Streamline & Automate Your Workflows" (327886)
  sits *inside* `Features` (241524–336814), not between it and `Data Partners` (336814). Read
  offsets, not the heading sequence.
- `Input Field` `max-width: 550px` is load-bearing: it is what puts the two vertical rules hard
  against the field's edges. Dropped it on the first pass and the whole composition read wrong.
- `rogo.ai/product` 301s to `rogo.com/product` and serves a byte-identical document. One target.

**Skills invoked**

`superpowers:brainstorming` (before planning, per its own gate). `gsap` and `framer-motion`
were checked against their triggers and **both declined** — reason recorded above.

**Open / deferred**

- Block 1 has not been diffed against the reference at **1024 or 390**; only 1600 and 1440 were
  compared against the user's screenshots.
- Hold, delete and caret-blink timings are estimated.
- Contrast not yet run for `rgb(23,23,23)` on `paper` or `muted` on the video band.
- The prompt field is decorative — looks like an input, is not one. Flagged as an open question
  rather than silently accepted.
- Whether the remaining blocks also collapse XL into desktop is verified only for Block 1.
