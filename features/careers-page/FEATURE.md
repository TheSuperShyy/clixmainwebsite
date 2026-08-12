# Feature: Careers page (`/careers`, clone of `rogo.com/careers`)

| | |
|---|---|
| Slug | `careers-page` |
| Route | `/careers` |
| Order on page | Nav (fixed) → Hero → Gallery → About → Footer — ⚠️ **`Roles` removed 2026-08-12** |
| Status | `review` |
| Reference | `docs/reference/target/rogo-careers-2026-08-12.{html,css}` (577,355 B HTML · **six** inline `<style>` blocks → 149,428 B CSS · 581 `data-framer-name` nodes, 83 unique) + live CDP probe 2026-08-12 |
| Screenshots | `assets/ref-{1600,1440,1024,390}-{top,about,roles}.png` |
| Original Framer names | `Hero` (`#hero`) · `Gallery` (`#gallery`) · `About` (`id="about™"`) · `Careers` (`#roles`) · `Footer` |
| Component | `src/app/careers/page.tsx` + `src/components/careers/` |

## Purpose

Rogo's recruiting page: an oversized centred hero over a full-bleed horizontal photo carousel,
a two-column mission statement, and a dark band listing every open role. Ours keeps the design
1:1 and departs on content in four recorded places: **editorial copy** (rewritten in clix's
voice 2026-08-12), photos, role list, indexability.

⚠️ **THE `#roles` BAND AND THE HERO CTA WERE REMOVED ON 2026-08-12**, later the same day
(user: *"remove this section we dont need job offering for now also remove the see career
button"*). The page is now Hero → Gallery → About → Footer. **Every measured value for the
band is deliberately left in this file below** — it is the record of the target, not of our
build, and it is what makes the band restorable without re-probing a live site. The components
themselves (`CareersRoles.tsx`, `careersOpenings.ts`) are in commit `bbf10b1`.

Four consequences, all verified rather than reasoned:
- **`#roles` was the page's only `data-nav-theme="dark"` section.** The light → dark handover
  now happens at the Footer. Re-probed at all four tiers: `hero > gallery > about > contact`,
  `light > light > light > dark`, **every gap 0**. If the band ever returns it must go back
  *between* `#about` and `<Footer>` or the dark run is discontiguous.
- **The CTA went with it** — it existed to point at `#roles`. Nothing on the page now links to
  a fragment, and a probe for dangling `href="#..."` returns none. `BracketLeft`/`BracketRight`
  went too; this file was their only user and identical copies remain in `ProductHero.tsx`.
- **`#hero` is now 529 / 529 / 415 / 643.** ⚠️ The 529 is a **coincidence, not a match**: the
  target is 529 with a 2-line headline plus a 44px gap and a 40px button, we are 529 with a
  3-line headline and no button, and the extra line (+83.6) and the removed button (−84)
  cancel to within a pixel. Never cite it as evidence of fidelity.
- **Two tokens went idle**, `signal-green` and `glyph`. Kept, and documented as idle in
  `docs/DESIGN-SYSTEM.md`.

**THE COPY IS CLIX'S OWN AS OF 2026-08-12** (user: *"in the career section, lets personalize it
now, with the headers and subheaders, for the jobs i will follow up later"*). It was rogo's
verbatim until then, under the standing "clone now, rewrite after" decision — this is the
"after". Four strings changed, sourced from `ClixManifesto.tsx` and
`docs/reference/clixsolutions/` rather than invented:

| | Rogo | Clix |
|---|---|---|
| Hero h1 | Join the Team Creating the Future of Finance | **Join us in engineering the core of next-generation software.** |
| About h3 | Building The Smartest / *Analyst On Wall Street* | **Automating The Work** / ***Nobody Should Be Doing*** |
| About body | 2 paragraphs, 244 + 201 chars | 2 paragraphs, **244 + 189** chars |
| Roles h2 | Find Your Role | **Where You Come In** |

⚠️ **THE HERO H1 IS THE USER'S OWN SENTENCE, chosen verbatim on 2026-08-12** over four
measured alternatives after the character ceiling and its consequence were put in front of
them. It is 60 characters against rogo's 44, so it sets in 3 lines at ≥1200 and 6 at 390 where
the original set 2 and 4. `#hero` therefore measures **613 / 613 / 479 / 707** against the
target's 529 / 529 / 479 / 585. A copy decision with a geometry consequence, taken with the
numbers on the table — not a defect, and **not to be trimmed back to reclaim the height.**

Two things about it are worth keeping:
- **1024 did not move.** 72px type against a 944px measure still sets this sentence in 2 lines,
  the same as rogo's shorter one. I predicted 542 there; the probe said 479. Predict nothing
  about wrapping.
- **It breaks mid-hyphen** at 1440 and 390 ("next-" / "generation"). Breaking after a hyphen is
  correct UA behaviour and there is **no clean fix at the phone tier**: `white-space: nowrap` on
  the compound makes an unbreakable 15-character run, which at 64px is wider than the 358px
  viewport and would be clipped by the section's own `overflow-hidden`. Dropping the hyphen
  ("next generation") removes the break and keeps the line count, and is the only change that
  would. Flagged to the user; left as written because it is their sentence. **Open question.**

The remaining three strings were written under constraints that were geometry, not taste:
1. **No dashes** — no em dash, no en dash, no hyphen standing in for one. The user's standing
   request from 2026-08-10, recorded in `ClixManifesto.tsx`. Asserted after the fact by reading
   the rendered text of all four blocks and regexing for `[–—-]`: none, at all four tiers.
2. **Line counts held where the copy was mine to size.** The roles h2 is 17 characters, which
   is the most that fits on one line at 390 (40px inside 358 less 32 of padding); verified
   rendered, not estimated. The h1 ceiling was **44 characters**, probed across eight
   candidates: every one at or under 44 set 2 lines at 1600/1440 and 4 at 390, and 45 broke the
   phone tier. That ceiling is what the user's 60-character sentence was chosen against.
3. **`#about` moved, and that is expected.** See the deviations table.

⚠️ **The noindex guard did NOT lift.** It had two reasons; this retires one. The three job rows
are still invented, which is the user's own follow-up ("for the jobs i will follow up later").

---

## ⚠️ Read first — three traps this page sets

**1. The row rule is an `::after` OVERLAY, not a `border`.** The `<a>` carries
`--border-bottom-width:1px; --border-style:dashed; --border-color:rgba(168,162,158,0.2)`,
which *looks* like a border declaration and is not: computed `border-bottom` on the element is
`0px none`. Framer paints it on `::after { position:absolute; inset:0; border-bottom:1px dashed }`,
which takes no layout space. A real `border-bottom` adds 1px to the 72px row. Same mechanism as
`/product` Blocks 3 and 5.

**2. The hero CTA's SSR variant class is STALE — again.** The capture declares
`framer-5Atru framer-velzew framer-v-velzew`, `data-framer-name="Primary – Start"`. It hydrates
to `framer-v-q741vz`, `data-framer-name="Primary – End"`. Measured on the live page, the two
14×20 corner brackets sit at **dx −28 / dy −12** from the 220×40 box (left bracket) and the
mirror on the right. Those are the *same* numbers `/product` recorded, so
`ProductHero.tsx`'s `BracketLeft`/`BracketRight` and their offsets port across unchanged.

**3. `id="about™"` is an authoring artefact.** A trademark glyph in a DOM id. Ship `id="about"`.

**4. ~~Straight apostrophes, against repo convention.~~ RESOLVED 2026-08-12 by the copy
rewrite.** The target's About copy uses straight `'` in `We're` / `we're`, and while the page
carried that copy verbatim it shipped straight quotes too. It no longer carries that copy, so
the apostrophes are now the curly `’` used everywhere else in `src/`. What survives from this
trap is the *mechanism*: both paragraphs still live in module-level consts, not JSX text, so
the `react/no-unescaped-entities` rule (which only inspects JSX *text nodes*) can never fire on
them whatever punctuation the copy uses next.

**5. Framer layer names on this page are stale and must be ignored.** The About text container's
`data-framer-name` is a full paragraph of *security* copy about zero-trust and end-to-end
encryption. The rendered text is the careers copy. Same class of artefact as `about™`.

---

## Measured spec

> Extracted from the frozen capture, then every value re-read from the LIVE page over CDP at
> all four tiers. Both agree. Values below are the live computed ones.

### Layout — sections

| Property | XL 1600 | Desktop 1440 | Tablet 1024 | Phone 390 |
|---|---|---|---|---|
| `#hero` padding | `198px 40px 80px` | same | same | `198px 16px 80px` |
| `#hero` gap / height | 96 / **529** (target 529, coincidence) | 96 / **529** (same) | 96 / **415** (target 479) | 96 / **643** (target 585) |
| `Text & Button` gap | **44** | **44** | **24** | **24** (max-w 360) |
| `Text Container` max-w / gap | 960 / 16 | same | same | same |
| `#gallery` padding / height | `40px 40px 80px` / 636 | same | same | `40px 16px 80px` / 636 |
| `#gallery` bg | `paper` | same | same | same |
| `#about` padding / height | `96px 40px` / **329** (target 352) | same | `64px 40px` / 343 | `64px 16px` / **430** (target 471) |
| `#about` container | **row**, max-w 1280, gap **64** | same | **column**, gap 24 | **column**, gap 24 |
| `#about` container alignment | `place-content: flex-start center` → `align-content:flex-start`, **`justify-content:center`** | same | same | same |
| `#about` title column | `flex:1 0 0; width:1px; max-w 490` | same | `flex:none; w:100%` | `max-w:unset; w:100%` |
| `#roles` padding | `80px 40px 160px` | same | `80px 40px` | `64px 16px` |
| `#roles` gap / container gap | 72 / 40 | 72 / 40 | 72 / 40 | 72 / **32** |
| `#roles` bg | `ink` `rgb(21,21,21)` | same | same | same |
| `#roles` container max-w | 1280 | same | same | same |

Nav is **fixed** on this route (no spacer) — the `198px` hero top padding is what clears the
banner + nav row. `#hero` has **no background of its own** (transparent over the page's white).

### Layout — carousel (`#gallery`)

Native scroll-snap list. `<ul>` is `display:flex; gap:16px; overflow-x:auto; overflow-y:hidden;
scroll-snap-type:x mandatory; scroll-behavior:auto`, each `<li>` `scroll-snap-align:start;
scroll-snap-stop:always; flex-shrink:0`, and `data-show-scrollbar="false"` hides the bar.

**Slide widths are fixed pixels at EVERY tier** — the `sizes` attribute lists the same width for
all four, and the live sweep confirms identical arrays at 1600/1440/1024/390:

| # | Framer name | Slide box | Source intrinsic | Orientation | `object-position` |
|---|---|---|---|---|---|
| 1 | `eric` | **385 × 516** | 1142×1714 | portrait | center |
| 2 | `padel` | **721 × 516** | 5200×3581 | landscape | center |
| 3 | `josephk` | **389 × 516** | 2000×3000 | portrait | center |
| 4 | `julia matt` | **605 × 516** | 2526×1714 | landscape | center |
| 5 | `rachel` | **389 × 516** | 2572×1714 | landscape | center |
| 6 | `billy alyana` | **389 × 516** | 3024×4032 | portrait | center |
| 7 | `play` | **688 × 516** | 4032×3024 | landscape | center |
| 8 | `pool` | **791 × 516** | 4006×3016 | landscape | **right bottom** |

`scrollWidth` 4469 at every tier = 4357 (slides) + 112 (7 × 16 gap). Track `clientWidth` =
viewport − gutters: 1520 / 1360 / 944 / 358.

**Photo intrinsic aspect is NOT load-bearing** — every slide is a fixed box with
`object-fit:cover`, so only orientation matters for a substitute image.

⚠️ **Slot 5 is not a typo.** `rachel` is a **2572×1714 landscape** source in a **389×516**
portrait-shaped box — the original crops it to roughly its centre 50%. Slots 3 and 6 carry the
same box with portrait sources. Consequence when sourcing a substitute: when a landscape image
covers a box taller than it is wide, the scale is driven by **height, not width**, so a `w=`
request sized off the box's *width* delivers about 1×, not 2×.

### Assets — the eight substitute photos

All Pexels (`images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg?auto=compress&cs=tinysrgb&w=<n>`),
royalty-free commercial, no attribution. Response bytes written verbatim — **no local re-encode**
(there is no `sharp` in this repo and none was added). `public/careers/team-0N.jpg`:

| Slot | Pexels ID | Delivered | Bytes | Subject |
|---|---|---|---|---|
| 1 | 4050216 | 800×1200 | 80 KB | over-the-shoulder onto a laptop |
| 2 | 1546017 | 1500×1000 | **531 KB** | wide park ballcourt, four distant figures |
| 3 | 6696840 | 800×1200 | 75 KB | hands on a laptop, cropped at the chin |
| 4 | 6794967 | 1300×868 | 170 KB | empty open-plan room, desks and glass |
| 5 | 3862370 | 1500×1001 | 96 KB | four people at a wall-board, all from behind |
| 6 | 4792723 | 800×1198 | 100 KB | back three-quarter at a screen-lit dual-monitor desk |
| 7 | 3184192 | 1400×934 | 241 KB | overhead shared meal, arms and hands |
| 8 | 25358052 | 1600×1066 | 238 KB | rooftop terrace at dusk, group small in frame |

**Non-identifiable rule applied: no clear frontal face.** 1/3/4/6 contain no face at all; 2/8
have figures under ~5% of frame height and turned; 7 is hands only; 5 is three back views plus
one near-profile that the centred crop excludes entirely.

⚠️ **Slot 6's brief had to be overridden, and the reason generalises.** "A person on a video
call" is close to unfillable safely — essentially every video-call stock photo puts three to six
**clear frontal faces on the monitor**, which is the exact exposure this swap exists to remove,
just relocated from the foreground to a screen, and arguably worse because a grid of faces reads
as a roster. Substituted a screen-lit back-three-quarter with headphones, same read, no face.

⚠️ **Licensing, one level past "royalty-free".** The Pexels licence also bars using photos of
identifiable people in ways implying endorsement — and a careers carousel implicitly captioned
*our team* implies exactly that. So "no frontal faces" here is licence compliance, not only
liability hygiene. **The same reasoning applies unchanged to `/product` Block 6**, which still
ships three photographs of identifiable real people; that is a licence question there, not just
a taste one. Recorded for whoever picks that thread up.

Non-blocking: `team-02.jpg` at 531 KB is 2–6× every other slot, and the page renders bare
`<img>` (no `next/image` anywhere in this repo), so nothing will shrink it at serve time. A
smaller `w=` would fix it if the page's weight ever matters.

Controls: `<fieldset class="framer--carousel-controls">` `position:absolute; inset:0;
padding:16px; display:flex; justify-content:space-between; align-items:center;
pointer-events:none; border:0`. Two 40×40 `<button>`s, `border-radius:40px`,
`background-color:rgba(0,0,0,0.2)`, each holding a 40×40 SVG that is **an opaque white circle
with an ink chevron + shaft** — so the scrim only shows if the SVG fails to load. Reproduced
anyway for fidelity.

### Motion — carousel (LIVE-PROBED, the capture cannot show any of it)

- **No autoplay.** `scrollLeft` sampled every 250 ms for 30 s, untouched: one distinct value (0).
  This is the opposite of `/product`'s testimonials and had to be checked *first*, before any
  click, per that block's recorded method note.
- **Prev is edge-disabled, Next never is.** Prev sits at `opacity:0; pointer-events:none;
  cursor:default` at `scrollLeft === 0` and flips to `1/auto` otherwise. Next stays `1/auto`
  even at max scroll, where it does nothing. Reproduce as observed.
- **It does not loop.** Eight Next clicks reach 3109 (= 4469 − 1360) and stop.
- **The arrow step is NATIVE, and that was settled by measurement, not derivation.**
  Re-probed at three tiers with a settle-to-rest loop (4 consecutive identical 120 ms samples)
  rather than a fixed sleep, images forced eager first:

  | tier | `C` | `MAX` | next | prev |
  |---|---|---|---|---|
  | 1440 | 1360 | 3109 | `0→1543→2569→3109` | `3109→2164→1138→0` |
  | 1024 | 944 | 3525 | `0→1138→2164→3525` | `3525→2569→1543→1138→0` |
  | 390 | 358 | 4111 | `0→764→1543→2164→2584→3759→4111` | `4111→3678→2974→2195→1762→1169→587→0` |

  `starts = 0,401,1138,1543,2164,2569,2974,3678` — identical at all three tiers, since slide
  widths are fixed.

  Five candidate rules were scored against all **13** transitions at the two *snapping* tiers
  (390 excluded — see below, snapping is suppressed there, so no snap-based rule can reproduce
  it):

  | rule | score |
  |---|---|
  | **`scrollBy(±clientWidth)` + native CSS snap** | **9/13** |
  | "first slide not fully visible, +1" | 7/13 |
  | "first slide not fully visible" | 6/13 |
  | a fitted per-slide accumulate rule (first draft) | 5/13 |
  | `scrollBy` with snapping disabled | 2/13 |

  **What ships is the native one**: `ul.scrollBy({ left: ±ul.clientWidth })` and let mandatory
  snap resolve the landing. There is no step arithmetic in the component at all. A programmatic
  scroll on a mandatory-snap container *is* re-snapped to the nearest snap point by the browser,
  so this stops simulating the mechanism and uses it — the same reason the rest of this carousel
  is exact rather than fitted. It diverges from the target on 4 of the 13 transitions.

  ⚠️ **Two dead ends, recorded so they are not re-derived.** (1) The first rule tried —
  "accumulate `w+16` while ≤ `C`" — is arithmetically impossible: `0→1543` needs the run
  `{0,1,2}` = 1543 *accepted* while `1543→2569` needs `{3,4,5}` = 1431 *rejected*, and
  1431 < 1543. (2) `0→1543` is **not** a probe artefact; it reproduced across two independent
  runs, the second settling to rest. The data was right and the rule was wrong. Black-box
  probing cannot recover the Framer component's internal index state, and two probe rounds is
  the ceiling for a decorative control (`CLAUDE.md` §7).

  ⚠️ **Prev is not the mirror of next in the original.** One forward click from 0 lands on 1543,
  but returning takes two (`1543→1138→0`, observed at 1024). The asymmetry is the target's.

- ⚠️ **At 390 nothing snaps — in the target or here.** The track is 358px and every slide is
  385–791px wide; per CSS scroll-snap an oversized snap area lets the snapport rest anywhere
  within it, so mandatory snapping is **suppressed entirely** at that tier. That is why the 390
  landings above are not snap points. Ours scrolls one viewport per click and likewise does not
  snap — same cause as the target, different landings, and no special-casing in the code.
- Drag / momentum / snap are the **browser's** — native `overflow-x:auto` + mandatory snap. No
  spring to fit, unlike `/product` Block 6.
- Controls opacity is `1` at rest and `1` after a real `mousemove` over the gallery — **not**
  hover-gated, despite `data-show-mouse-controls="true"`.

### Typography

| Element | Family | 1600 | 1440 | 1024 | 390 | LH | Tracking | Color |
|---|---|---|---|---|---|---|---|---|
| h1 `Join us in engineering…` | display | **88** | 88 | 72 | 64 | 95% | −0.06em (phone −0.05em) | `ink` |
| CTA label | sans 500 | 16 | 16 | 16 | 16 | 1em | −0.01em | `paper` |
| h3 `Automating The Work…` | display | **44** | 44 | 40 | 32 | 110% | −0.05em | line 1 `ink`, line 2 `muted` |
| About body `<p>` | sans | **18** | 18 | 16 | 16 | 130% | −0.02em | `ink` |
| Eyebrow count `77` | Rooftop Mono → **sans** | 14 | 14 | 14 | 14 | 1em | 0 | `mark` |
| Eyebrow label `open positions` | sans | 14 | 14 | 14 | 14 | 130% | −0.01em | `mark` |
| h2 `Where You Come In` | display | **56** | 56 | 48 | 40 | 100% | −0.05em | `surface` |
| Group h4 | display | **36** | 36 | 28 | 24 | 110% (1.2em below 1200) | −0.04em | `mark` |
| Role title | sans | **18** | 18 | 16 | 16 | 130% | −0.02em | `surface` |
| Location · index | sans | 14 | 14 | 14 | 14 | 130% | −0.01em | `mark` · `muted` |

h1 is **centred** and `text-wrap: balance`; h3 is **left** and `text-wrap: balance`. The two
About paragraphs are separated by `margin-top: 20px` on the second (Framer's paragraph-spacing
lands on `:not(:first-child)`).

### Roles band — row anatomy

⚠️ **NOT SHIPPED as of 2026-08-12** — everything from here to the end of this subsection
describes the TARGET's band and our removed implementation of it. Kept verbatim so the band can
be restored from commit `bbf10b1` without re-probing rogo.com. `docs/reference/careers-roles-diff.js`
survives for the same reason and carries the same warning.

```
#roles  (ink, gap 72)
└ Container  max-w 1280, gap 40 (32 phone)
  ├ head        column, align start, gap 16
  │ ├ eyebrow   row, gap 10 · dot 8×8 r20 #19a26c · Count row gap 8 · "77" + "open positions"
  │ └ h2        Where You Come In
  └ groups      column, gap 64
    └ group     column, gap 40
      ├ Divider width 100%, aspect-ratio 1120 → 1.141px tall @1280, bg rgba(168,162,158,0.2)
      └ row     flex-WRAP, gap 40, align start
        ├ h4    flex:1 0 0; width:1px; min-w 240; max-w 400   (400 wide @1440)
        └ posts flex:1 0 0; width:1px; min-w 300; gap 24      (840 wide @1440)
          └ <a> row, gap 16, padding 24px 0, w 100%, h 72 (90 @390 — title wraps)
             ::after inset 0, border-bottom 1px dashed rgba(168,162,158,0.2)
             ├ [icon 24×24 ↳ glyph #afafaf] gap 16 [title] — inner flex:1 0 0; width:1px; gap 16
             ├ location  white-space:pre; width:auto; text-align:right
             └ index     white-space:pre; width:auto; zero-padded 2-digit
```

### Color & surface

| Element | Measured | Token |
|---|---|---|
| Page / gallery / about ground | `#ffffff` | `paper` |
| h1, h3 line 1, About body | `rgb(21,21,21)` | `ink` |
| h3 line 2 | `rgb(115,115,115)` | `muted` |
| Roles band | `rgb(21,21,21)` | `ink` |
| h2, role title | `rgb(245,245,245)` | `surface` |
| Count, `open positions`, group h4, location | `rgb(139,139,139)` | `mark` |
| Row index | `rgb(115,115,115)` | `muted` |
| Divider + dashed row rule | `rgba(168,162,158,0.2)` | `hairline` |
| Eyebrow dot | `#19a26c` | **NEW `signal-green`** |
| Row arrow glyph | `rgb(175,175,175)` | **NEW `glyph`** |
| Carousel button scrim | `rgba(0,0,0,0.2)` | **NEW `control-scrim`** |
| CTA | `ink` bg, radius 6, padding `8px 16px`, inner line **20px tall** (`h-5`) + 1px top pad | — |

`#19a26c` was already recorded in `docs/DESIGN-SYSTEM.md` as a declared-but-unused green. This
is the page that uses it — same shape of correction as `brand-green`, `forest-deep` and `bone`.

---

## Tokens used

`ink` · `paper` · `muted` · `surface` · `mark` · `hairline` · `signal-green` (new) ·
`glyph` (new) · `control-scrim` (new) · `--container-max` · `--ease-rogo` · `--font-display` ·
`--font-sans`.

## Documented deviations

| Property | Original | Ours | Why |
|---|---|---|---|
| Editorial copy | rogo's, verbatim | **clix's own** — hero h1, About h3 + both paragraphs, roles h2 | user's call 2026-08-12; written from `ClixManifesto.tsx` + `docs/reference/clixsolutions/`. See Purpose for the before/after and the three constraints. |
| Roles band (`#roles`) | a dark band listing 77 roles | **not shipped** | user's call 2026-08-12, "we dont need job offering for now". Measured spec retained below; components in commit `bbf10b1`. Removing it also removed the page's only dark section — nav-theme contiguity re-verified. |
| Hero CTA | 220×40 "See Careers" + two corner brackets, → `./careers#roles` | **not shipped** | same call. It pointed at the band that was removed; keeping it would leave the page's only CTA aimed at a dead fragment. |
| `#hero` height | 529 / 529 / 479 / 585 | **529 / 529 / 415 / 643** | two changes, not one: the user's 60-character h1 sets 3 lines at ≥1200 and 6 at 390 (+83.6 / +121.6), and the CTA's gap+button came out (−84 / −64). ⚠️ **At ≥1200 they cancel and the number happens to land back on 529. Coincidence, not fidelity.** |
| `#about` height | 352 / 343 / 471 | **329** / 343 / **430** | a direct consequence of the row above and nothing else: our first paragraph sets in 3 lines at ≥1200 where rogo's set in 4 (18px × 130% = 23.4px ≈ the 23px delta). Every CSS-controlled value in the block is unchanged and both block-diffs still report ALL MATCH. **Not to be "fixed" by padding the copy to hit 352.** |
| Display face | ABC Arizona Mix | Discovery (`--font-display`) | licensing, sitewide decision 2026-08-08 |
| Eyebrow count face | Rooftop Mono Regular 14 | Discovery (`--font-sans`) | one-face decision; same call as `ProductTestimonials.tsx` |
| Carousel photos | 8 photographs of rogo's identifiable staff | 8 neutral stock photos, no clear frontal face | user's call 2026-08-12 — avoids the real-person liability `/product` Block 6 still carries |
| Job list | 77 roles in 11 categories, with an 11-pill filter row | **3 roles, one flat list, no filter pills** | user's call 2026-08-12 ("reduce the job positions part") |
| Row `href` | real `jobs.ashbyhq.com/Rogo/<uuid>` postings | `mailto:clixteam579@gmail.com` | inventing an ATS URL would be a fabrication, not a clone |
| Eyebrow count | literal `77` | `{ROLES.length}` | derived, so the number cannot drift from the list |
| `id="about™"` | trademark glyph in a DOM id | `id="about"` | authoring artefact |
| Carousel track focus | not focusable | `tabIndex={0}` + visible ring | deliberate a11y improvement; the original leaves a scroll container unreachable |
| Edge-disabled Prev | `opacity:0; pointer-events:none` but still **tabbable** | same computed styles + `tabIndex={-1}` `aria-hidden` in that state | focus landing on an invisible inert control is a defect; `disabled` was rejected because it alters UA styling and would drift the block-diff |
| `aria-live="polite"` on the track | present | **removed** | the subtree never changes — only the scroll offset does — so it announces nothing while forcing SRs to monitor 8 items. Fidelity here means layout/type/colour/motion, not the original's a11y defects |
| Arrow step landings | a Framer code component with unrecoverable internal index state | `scrollBy(±clientWidth)` + native snap | best of five candidates against 13 measured transitions (9/13); agrees on mechanism, diverges on 4 landings. See the motion section. |

**Measured but deliberately NOT shipped** (so the values are not lost): the `Tabs` filter row —
11 pills, `border-radius:28px`, active fill `#fff` with ink label, inactive `1px
rgba(255,255,255,0.1)` with `mark` label, each carrying a `CMS Item Counter`.

## Acceptance checklist

- [x] Matches reference at 1600 / 1440 / 1024 / 390 — carousel block-diff ALL MATCH (18 keys × 4 tiers). ⚠️ The roles diff (38 keys) passed on 2026-08-12 and **no longer runs**, because the band it compares was removed
- [x] Spacing/type/color from tokens, or deviation documented above
- [x] Interactive states — focus-visible everywhere; Prev edge-disable reproduced. ⚠️ Carousel-button hover was NOT observable and nothing was invented. Since the CTA and the role rows were removed, **the carousel is the only interactive thing left on the page**
- [x] Motion — no autoplay, no loop, native snap, edge-disable all exact. ⚠️ Arrow LANDINGS approximate: 9 of 13 measured transitions
- [x] `prefers-reduced-motion` respected — arrow scroll drops to `behavior:"auto"`; nothing else on the page animates
- [x] Keyboard reachable, focus visible, tab order correct — re-probed after the removals: track → Previous → Next, plus nav and footer. No dangling `href="#…"` anywhere on the page
- [x] Meaningful `alt`; contrast checked — ✅ **the one AA failure (row index, `muted` on `ink` = 3.85:1) is gone**, resolved by deleting the band rather than by fixing it. Nothing on the page now fails AA
- [x] No horizontal overflow at any tier
- [x] `npm run build` clean
- [x] `CONTEXT.md` (feature + global) updated, `SECTIONS.md` row added

## ~~Known defect — scroll anchoring~~ (moot since 2026-08-12)

The hero CTA pointed at `#roles` and the nav is `position:fixed`. With no `scroll-padding-top`
anywhere in `globals.css` / `layout.tsx` / `Nav.tsx` (grepped: zero hits), the jump put
`#roles`' top edge *under* the bar and buried its eyebrow and part of its h2 — **113px of it,
probed on rogo.com itself, so the target has the same defect**. We fixed ours with `scroll-mt`
on the band (115px at ≥1200, 119 below), the pattern `Footer.tsx` already uses on `#contact`.

**Both the CTA and the band are now removed, so this cannot occur on this page.** Kept because
the finding is not local to it: **`/product`'s `#contact` CTA has the identical defect today**,
and any future in-page anchor here will need the same `scroll-mt` treatment.

## Open questions

- [ ] **`noindex` IS NOW UNJUSTIFIED AND STILL IN PLACE. The single open decision on this
      page.** Both original reasons are gone: the copy is clix's own (rewritten 2026-08-12) and
      the invented job rows went with the `#roles` band the same day. The photographs were never
      part of the guard — neutral stock on a "no clear frontal face" rule, which is licence
      compliance. **Kept anyway, deliberately**, because lifting it makes the route publicly
      indexable and that is the user's call, not a side effect of deleting a section. Removing
      the `robots` block in `src/app/careers/page.tsx` is a one-line change.
- [x] ~~Row index is `muted` on `ink` = 3.85:1 and FAILS AA.~~ **Resolved 2026-08-12 by
      deletion, not by a fix.** Still true of the target, and still shipping on `/product`
      Blocks 4/5/6. (3.85 / 5.36 / 8.33 are `contrast-check.js` output; the 3.91 / 5.44 / 8.25
      in earlier drafts were planning estimates that never went through the tool.)
- [x] ~~The three role titles are invented.~~ **Moot** — the band was removed 2026-08-12.
- [x] ~~The roles group heading and eyebrow label are still generic.~~ **Moot**, same removal.
- [ ] **The hero h1 breaks mid-hyphen** ("next-" / "generation") at 1440 and 390. Dropping the
      hyphen from "next-generation" is the only fix that survives the phone tier. **Needs the
      user's call — it is their sentence.**
- [x] ~~Row hover state — not observed.~~ **Moot** — the rows were removed 2026-08-12.
- [ ] Carousel button hover state — not observed.
- [ ] Whether the arrow step rule holds at the tablet/phone `clientWidth`s. Derived and verified
      at 1440 only; the rule is width-driven so it should, but it is untested there.
