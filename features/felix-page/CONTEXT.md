# Context: `/clix` page (clone of `rogo.com/felix`)

Memory for this page. **Newest entry on top.** Append after every task — never rewrite past
entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume cold, with no code scanning.

---

## Current state

**7 of 8 blocks built.** Hero, Video, Logo Proof, Manifesto, Testimonial, CTA and Felix Footer
all render at `/clix` from measured values; build is clean and all seven are in the served
HTML. **`Product Visuals` (block 5) is the only one missing** — it needs three 4000×2667
photos that are rogo's, and there is no substitute source yet.

**The copy pass ran on 2026-08-10. No "Felix" or "Rogo" is left in visible copy** (0 of each
in the served HTML). The Manifesto is clix's own words about clix's own services; hero, CTA
and footer are renamed.

**⚠️ ONE BLOCK IS NOW WORSE THAN UNFINISHED.** The ten testimonials were renamed rather than
rewritten, at the user's direction. They are real quotes from real people about rogo's
product, now pointed at clix and attributed to plausible-sounding firms: **fabricated
endorsements**. Before the rename they read as obvious placeholder text and were safe; they
no longer do. This is the single reason `robots: { index: false }` must stay on the route.
The fix is real references or deleting the block, not another rename.

**It is live and deliberately `noindex`.** Pushed to `main` on 2026-08-09, which auto-deploys;
the route carries `robots: { index: false, follow: false }`. Originally that was because the
whole page carried the target's words. After the 2026-08-10 copy pass the reason narrowed to
one block, the testimonials above. **Remove the `robots` block only when those are replaced or
deleted** — a `noindex` left behind afterwards is a live page nobody can find.

**Two things block specific blocks and cannot be measured from the capture:**
1. the fixed backdrop's **scroll-driven colour** — the Manifesto is white-on-dark and the only
   dark thing available is that layer. Blocks 4, probably 6.
2. **assets** — 3 photos and 24 logos, still rogo's property. Blocks 3, 5. **Block 2's video
   is closed as of 2026-08-13** — it plays clix's own `clix-demo.mp4`, not a borrowed clip.

**Status:** `review`
**Next action:** look at it at all four tiers — nothing here has been pixel-diffed. Then the
three outstanding calls: `Product Visuals`' photos, the live backdrop animation, and the copy
pass.

---

## Log

### 2026-08-13 — the integrations lockup scales; the tile it sits in does not

User: "make these tools text and logo bigger and little bolder." **The grid is rogo's and
stays frozen** — 4/3/2 columns, 436/600px height, 8px gap, `#15151508` tiles, 6px radius all
untouched. Only the glyph+name lockup inside each tile changed, to **24/16 phone, 28/18
tablet, 32/20 desktop, weight 500 → 600 throughout**.

**⚠️ THE PHONE TIER COULD NOT GROW, AND THAT IS MEASURED, NOT CAUTION.** `whitespace-pre` +
`overflow-clip` means an over-wide name is cut silently, never wrapped. Binding case is
`Google Calendar`, the longest of the twelve, in a 2-column tile — **175px at 390**. Widths
taken from `discovery-var.woff2` instanced at wght 600 with `-0.01em` applied per char:

| tier | tile | px + glyph + gap + text | total |
|---|---|---|---|
| phone 390 | 175 | 16 + 24 + 8 + 114.6 | **162.6** |
| tablet 810 (narrowest 3-col) | 238 | 24 + 28 + 12 + 128.9 | **192.9** |
| desktop 1200 (narrowest 4-col) | 274 | 24 + 32 + 12 + 143.2 | **211.2** |

So phone keeps 16px and buys its slack back from padding and gap instead
(`px-3`→`px-2`, `gap-[10px]`→`gap-2`, tablet restores both).

**This FIXED a pre-existing clip rather than causing one.** The old medium/`px-3`/`gap-10`
lockup measured **170.4 of 175** — inside spec at 390 by 4.6px, but cut outright below ~382px
viewport, i.e. on every 375px and 360px phone. It is now 162.6, which clears 372px.

Measuring needed one workaround worth keeping: `instantiateVariableFont` **throws
`KeyError: 'vhea'`** on this font because MVAR references a vertical-metrics table it doesn't
ship. `del ft['MVAR']` before instancing; horizontal advances are unaffected.

`/company` imports the same `TOOL_MARKS` but has its own component and is **not** affected.

Verified: `npm run build` clean, 20 static routes. Not visually diffed at the four tiers —
the user took the render check (see the working-preference note in the global log).

### 2026-08-13 — Block 2 plays clix's own demo; the last borrowed asset on this page is gone

**`ClixVideo` now sources `public/video/clix-demo.mp4`**, the user's product demo, replacing
`hero-clix.mp4` — which was never this block's footage, only the home hero's clip reused
because the target's mp4 is rogo's. One path swap, exactly as the file's header said it would
be. Nothing about the box moved: 16:9 container, 80px gap, section padding and the mute
toggle's geometry are still the measured originals.

**It needs no crop.** The clip is **1920×1080** — the container's `aspectRatio: 1.77778`
verbatim — so `object-cover` has nothing to cut. 40.2s, 30fps (the house cadence, unlike
`/product`'s 25fps master), 4.7MB, which is 0.1MB *under* the clip it replaces despite being
longer.

**The poster is frame 0 of the same file**, generated with
`ffmpeg -vf select=eq(n\,0) -frames:v 1 -q:v 3` → `public/video/clix-demo-poster.jpg`
(18KB). Poster and first painted frame are therefore the same image and the start of playback
is invisible. Carrying `hero-clix-poster.jpg` forward would have flashed the Tel Aviv skyline
before cutting to the demo — the one thing a poster exists to prevent.

`public/video/hero-clix.mp4` and its poster are **left in place**: nothing in `src/` references
them now (`grep -rn hero-clix src/` → 0 hits), but they are the home hero's ancestry and
deleting an unreferenced asset is a separate call.

**Not a `noindex` unblocker.** The route's `robots` block is held by the fabricated
testimonials, not by assets; this changes nothing there.

Verified: `npm run build` clean, 20 static routes.


### 2026-08-11 — DM Serif Display picked and shipped as the wordmark's face

**Trigger:** user, from the artifact trial — *"i want this one implemented in the web"*, on
the DM Serif Display row.

**What shipped:**
- `public/fonts/dmserif/dm-serif-clix.woff2` — the four-glyph pyftsubset (2.9 KB), with the
  SIL OFL 1.1 licence vendored beside it. The full face is NOT vendored; nothing else will
  ever be set in it.
- `@font-face "DM Serif CLIX"` in `fonts.css` with `unicode-range: U+0043,U+0049,U+004C,
  U+0058` — any text other than those four capitals falls through to the fallback instead of
  silently fetching a font that lacks the glyphs.
- Token `--font-emboss: "DM Serif CLIX", Georgia, serif` (globals `@theme` + DESIGN-SYSTEM).
  Georgia as fallback is deliberate: if the subset 404s the word stays a didone-ish SERIF
  rather than collapsing to Discovery.
- Footer SVG re-cut to DM's own outlines: `viewBox="0 0 2034 696"`, `x=-20`, `y=678`,
  weight 400 (the face's only weight), **zero tracking** — the −0.015em belonged to the
  Discovery/nav-lockup reading of the word and does not transfer. Aspect is now 2.92.
- Filter dy 10 / σ 3 pinned: it is both the PNG measurement rescaled and exactly what the
  approved artifact specimen rendered with.

**This is the one sanctioned exception to "one face sitewide" (2026-08-08), and it is scoped
by construction:** the unicode-range plus the four-glyph file make it physically unable to
leak. The nav wordmark, ClixWordmark, is untouched and still Discovery.

**Verified:** build + tsc clean; served HTML carries `font-emboss` and the 2034×696 box; the
woff2 serves 200 at 2980 bytes. **Not verified:** pixels at the four tiers, as ever.

### 2026-08-11 — type trial for the footer wordmark (artifact, awaiting a pick)

**Trigger:** user — the wordmark's lettering should match rogo's, and ours is a different
font. Rogo's Felix is ABC Arizona Mix (serif); Discovery is a sans, and Arizona itself was
deleted 2026-08-08 for licensing. So the candidates are **five OFL serifs in Arizona's
territory**: DM Serif Display (flagged closest — thin flat didone serifs), Instrument Serif,
Playfair Display 600, Marcellus, Young Serif, plus Discovery Bold as the ships-today row.

Published as an artifact: https://claude.ai/code/artifact/f0615cb2-e57e-4677-91fe-42456d49995c
Every specimen carries the identical measured deboss (face `#ececec`, rim ink@6%, dy 10 /
σ 3 per 1000 units) so only the letterforms differ. Fonts fetched from google/fonts,
subset to the four glyphs with pyftsubset (1–3 KB each), inlined as data URIs.

**Standing decision if one is picked:** it wires into the **footer wordmark only** —
Discovery remains the sitewide face per 2026-08-08. Subsets live in the scratchpad
(`serifs/*.woff2`); regenerate from google/fonts if the scratchpad is gone.

### 2026-08-11 — the emboss is now MEASURED from rogo's own PNG, and it is an SVG inner shadow

**Trigger:** user, third round on this block — *"look at the difference i want it to be 100%
clone on design"*. The gradient-face version still did not read as carved.

**The guessing stopped: the actual artwork was profiled.** The target's wordmark PNG
(`framerusercontent.com/images/LyryUPbueZ6V1qHuLOY7AV8uDXI.png`, 2008×859) was fetched to the
scratchpad and sampled with PIL. Measurement only — it is rogo's file and stays out of the
repo. What it contains:

```
face       FLAT #ececec (236)  — NOT a gradient
top rims   #dedede (222) easing to face over ~18px (of 847px ink height)
side rims  227..231 over ~8px — the same shadow at half strength
bottom     nothing dark inside; a 253-white outer glow, alpha ≤161
outside    NO dark halo anywhere
```

**Both prior CSS attempts were the wrong model, for structural reasons.** The pattern above —
darkest inside the TOP of each stroke, softer down the sides, absent at the bottom, following
every glyph's own edge — is an **inner shadow cast from above**. `text-shadow` cannot make it
(paints outside the glyph; its white lip is invisible on the white page). A gradient face
cannot make it (shades the WORD top-to-bottom where the PNG shades each STROKE's edge). The
only primitive that composites on the text's own alpha is an SVG filter, so the wordmark is
now SVG `<text>`:

- `feOffset dy=10` + `feGaussianBlur σ=3` + `feComposite out` cuts the top-rim sliver from
  the glyph alpha; `feFlood #151515 @ 0.06` tints it; merged over the flat face.
- **0.06 is derived, not chosen:** rim peak 222 over face 236 = 14/236 = 5.9% darkening.
- **dy/σ are the PNG's numbers rescaled:** transition centred ~13px, ~8px wide, at 847px ink
  height; ours is 628.7 units, ×0.743 → 10 / 3. The side rims fall out of the blur's sideways
  spread — they are not a separate shadow in the PNG either.
- The 253-white bottom glow is **not** reproduced: the page is `#ffffff`, so it contributes
  nothing there (it exists so the PNG works anywhere; ours doesn't need to).
- Units are userSpace with 1000 = 1em, so the whole effect scales with the word by
  construction — no `em` conversion games.

**Geometry moved into the viewBox.** Same Discovery Bold outline numbers as the previous
entry, now as SVG coordinates: `viewBox="0 0 1926.4 628.7"`, text at `x=-32` (cancels C's
left bearing) `y=619.2` (baseline so C's cap lands on the box top), font-size 1000, tracking
−15. The `cqw`/margin-trim machinery is deleted — the viewBox IS the ink box, and the
intrinsic ratio (3.06) keeps the box hugging the word at every tier.

**New token:** `--color-emboss-face: #ececec` (globals `@theme` + DESIGN-SYSTEM.md). It is
numerically `ink` at 8% over white, but ships flattened because the filter cuts the rim from
the text's **alpha channel** — a semi-transparent fill would collapse the shadow to
0.06 × 0.08 ≈ nothing. That near-miss is logged in the token's comment.

**Verified:** build clean; served HTML carries the filter, the viewBox and the token.
**Not verified:** pixels. The rim depth vs the PNG at equal rendered size has not been
diffed; and the PNG's face is Arizona Mix while ours is Discovery (standing licensing
decision, 2026-08-08), so 100% is bounded by the typeface itself.

### 2026-08-11 — the footer wordmark is `CLIX`, and the emboss finally renders

**Trigger:** user, with the same two screenshots again — *"make the clix look very much alike
100% but make clix all capital like CLIX"*. The deboss shipped earlier the same day had not
landed; ours still read as a flat grey slab beside the target's carved one.

**Why the first attempt was invisible, and it is arithmetic, not taste.** The recipe was
`text-shadow: 0 -0.008em 0.016em rgba(21,21,21,0.14), 0 0.014em 0 #ffffff` — the textbook
letterpress pairing, a dark edge above and a white lip below. But **a text-shadow paints
outside the glyph, and the page is `#ffffff`.** A white lip on white is exactly zero pixels
of contrast, so half the effect never existed; what remained was one faint dark edge, which
reads as blur, not depth. On a white ground **the light edge has to be inside the letterform,
and no shadow of any kind can go there.**

**The fix: the face is a gradient, not a fill.** `background-clip: text` over
`linear-gradient(180deg, #e0e0e0 0%, #ededed 45%, #f7f7f7 100%)` — dark at the top of the
stroke, bright at the bottom, which is the form shading of a groove lit from above. That is
inside the glyph by construction. The old flat colour was `#ebebeb` (`ink/0.08`), so the
gradient sits either side of it and the block's overall value is unchanged.

**Second trap, same family:** `text-shadow` paints *above* the element's background, and with
`background-clip: text` the face **is** the background — so the surviving dark edge would have
painted on top of the gradient. Moved to `filter: drop-shadow(...)`, which shadows the
composited result. Its `em` still resolves against the element's font-size, so depth keeps
scaling with the glyph.

**Depth values are taste and cannot be anything else.** The target's artwork is on
framerusercontent.com and was never vendored, so there is no PNG to sample.

**The sizing is now measured, and the old aspect ratio was wrong to keep.** From Discovery
Bold's own outlines (fontTools, `assets/fonts/discovery/Discovery_Fs-Bold.ttf`, upm 1158,
hhea asc 857 / desc −311):

```
CLIX   ink 1.9715em wide x 0.6287em tall   cap 0.6097em
       advances  C .5561  L .5216  I .2910  X .6494
       with -0.015em tracking x3 -> 1.9264em of ink
```

- **`font-size: 51cqw`** — 1/1.9264 = 51.9cqw fills the column exactly; 51 leaves ~1.7%
  (11px at a 1280 column) of headroom for the Inter fallback, which sets wider. Replaces the
  earlier `56cqw`, which was a taste value read off screenshots.
- **`aspect-ratio: 2.3376` deleted.** That was the target PNG's ratio, and it is simply what
  "Felix" measures with an `l` ascender over an x-height. Four capitals measure 3.06. Forcing
  them into a 2.34 box left ~130px of dead space that the flex centring split above and below
  the word, pushing "by Clix Solutions" ~90px clear of the letters where the target has 24px.
  **The faithful property is that the box hugs the wordmark, not that it is 2.3376.**
- **Cap trim** — `leading-none` gives a 1em line box but the ink only occupies
  0.1166em..0.7453em of it (baseline 0.7358em, C overshoots 0.0095em below). `margin-top
  -0.1166em` / `margin-bottom -0.2548em` pull the box onto the ink. **Consequence: the block
  is ~130px shorter than the target's.** Deliberate, and the byline gap is the reason.
- **`margin-right: 0.0323em`** — letter-spacing is painted after the final X too, so the ink
  sits 0.0162em right of the line box's centre; halving that out of the width re-centres the
  ink rather than the box. Same correction `ClixWordmark` makes, doubled because centring
  splits it.

**Tracking is `-0.015em`, not the old `-0.05em`, and weight is 700.** Both come from
`ClixWordmark` (the nav lockup). This word is the brand mark at scale; two differently-set
CLIXs on one page is the thing to avoid. 700 also puts the stroke density nearer the target's
Arizona Mix, which is heavier than Discovery Regular.

**Not reproducible, and standing:** the typeface. The target is ABC Arizona Mix; that face was
deleted on 2026-08-08 for licensing and the site is Discovery everywhere.

**Not verified:** how any of it looks. Build and `tsc` are clean; the depth of the gradient and
the `51` are the two dials if it reads too soft or too tight.

### 2026-08-11 — the footer wordmark is debossed, and now fills its box

**Trigger:** user, with our footer and the target's side by side — *"want the design of the
bottom part of the clix to be exactly like the logo one. It's like a embedded"*.

**Two differences, only one of which was named.**

**1. The emboss (the ask).** The target ships a 2008×859 PNG whose letterforms are pressed
INTO the page: light grey face, a white rim along the bottom of each stroke, a soft dark edge
above. Ours was a flat fill. Reproduced with two `text-shadow`s rather than a bitmap, because
this is set in type.

**The offsets are in `em`, and that is the whole trick.** The word scales across a wide range,
so pixel offsets would be a heavy bevel at the small end and invisible at the large one. In
`em` the emboss scales with the glyph: the white rim lands ~5.9px below at 420px and ~1px at
72px, and reads identically at both. Order matters too — the white rim is second so it paints
under the dark edge where they overlap, keeping the top of each stroke crisp.

**2. The size, which I changed without being asked and should be checked.** Ours was
`clamp(72px, 30vw, 420px)`; at a 1920 viewport that pinned the word to 420px inside a ~1280px
box, so it filled about half and floated. The target's is a bitmap and fills its box by
definition, which is why theirs reads as a slab and ours read as a caption.

Fixed by sizing against the BOX instead of the viewport: `container-type: inline-size` on the
wrapper, `font-size: 56cqw` on the span. One number, no clamp to re-tune per tier, and it
tracks the box automatically.

**⚠️ `56` is a taste value, not a measurement** — derived by comparing the two screenshots,
which is exactly the kind of eyeballing that is banned for layout and fine for dressing
(CLAUDE.md). It is the dial to nudge if the word sits too tight or too loose; `overflow-clip`
on the box is the backstop if it ever overshoots.

**Typeface is still Discovery, not the target's ABC Arizona Mix.** "Exactly like" cannot cover
that: the face was deleted on 2026-08-08 for licensing and is a standing sitewide decision.

**Verified:** build + `tsc` clean; the served HTML carries the `cqw` size, the container type
and both shadows. **Not verified:** how it actually looks — I cannot see the page, so the
`56` in particular is a first guess.


### 2026-08-10 (copy) — Felix renamed out; the Manifesto is clix's own words

**Trigger:** user — *"change all of Felix into clix and change the statement on the green
section without adding any m dashes ... very related to clix on the services and the service
that they provide"*.

**The Manifesto was rewritten, not renamed.** Sourced from the real company site rather than
invented: `docs/reference/clixsolutions/` lists eight services (AI agents, WhatsApp
automations, CRM implementation, integrations and automations, websites, mobile, custom
software, AI strategy) under the line *"we build the quiet mechanisms that drive modern
businesses"*. Paragraphs 3 and 4 name those services; paragraph 3's spine is that line in
English. Title: "The future state of finance" → **"The systems behind the work"**, held to a
similar length so it still breaks to two lines inside the measured 300px cap.

**No dashes at all**, per the explicit ask: no em dash, no en dash, no hyphen standing in for
one. Verified against the served HTML. Note the source paragraph had a `" - "` in it, so this
is a deliberate departure rather than an accident of style.

Shape kept to the original's, because the layout was measured against it: five paragraphs,
the second carrying an internal line break.

**Renamed elsewhere:** CTA "Staff Felix today." → **"Build with Clix."** — held to 16
characters because that headline is `white-space:pre` at ≥810 and the 72px tablet tier has
only ~730px of usable width; the original was 18. Footer wordmark "Felix" → "Clix", and
"by Rogo" → **"by Clix Solutions"**, because the target's footer is PRODUCT by COMPANY and
renaming the product collapsed that ("Clix by Clix" is nonsense).

**NOT renamed, deliberately:** the component name `ClixFelixFooter`, the Framer block name
"Felix Footer", and every `rogo.com` / capture reference in comments. Those point at the
target and renaming them would break provenance.

**⚠️ The testimonials are now fabricated endorsements, and that is a step backwards in one
specific way.** Renamed at the user's direction after the risk was put to them. The words are
still rogo's, from real people about a real product, now aimed at clix under firm labels like
"Top 5 U.S. BB Investment Bank". **Before the rename they read as obvious placeholder text,
which was safe. They no longer do.** The block header now says so in the strongest terms
available. `robots: { index: false }` stays until they are replaced or deleted.

**Two build breaks along the way, same cause both times:** JSX comments inserted with `{/*`
but closed with `*/` and no `}`. Also a backslash-n in a generated string that reached the
file as a real newline, breaking the literal. Both caught by the build; worth remembering that
script-generated JSX needs a compile before it is trusted.

**Verified:** build + `tsc` clean; served HTML contains **0** occurrences of "Felix" and
**0** of "Rogo" outside script payloads, no em/en dash anywhere in the manifesto, and the new
title, CTA and footer strings all present.


### 2026-08-10 (symmetry) — the block BELOW the green fades out too, like the one above

**Trigger:** user — *"I don't want any transparency animation or transparency design on the
bottom part just like on the top"*.

**The two edges of the dark stretch were not behaving the same way.** Above it,
`#integrations` fades to 0 as the green arrives (asked for on 2026-08-09). Below it,
`#clix-testimonials` did not — so as the ground darkened, the testimonial block's own content
sat on dark green. Its quotes are `text-ink`, so they went **invisible rather than merely
wrong**, which reads as a rendering fault. That is the transparency artefact the user was
pointing at.

**Fix: one shared expression.** Both neighbours now take `opacity: 1 - g`, where `g` is the
ground's own sub-progress — the same scalar, so top and bottom edges cannot drift apart, and
a mid-fade reversal turns all three around together.

**This is a consequence of the page being correctly transparent, not a regression from it.**
All eight of the target's blocks paint nothing (measured 2026-08-10) — the shared backdrop is
the only colour. Once that is true, anything adjacent to the dark stretch is by definition
sitting on it, and has to be dealt with. Putting opaque backgrounds back would "fix" it by
reintroducing the bug that hid the dark runway in the first place.

**Verified:** build + `tsc` clean; both ids present in the served HTML with no inline opacity,
so SSR / JS-off / reduced-motion all render both blocks fully visible.


### 2026-08-10 (runway) — the manifesto's bottom padding now matches its top

**Trigger:** user — *"a white space similar and equal to the space on top. Now add it on the
bottom as well"*, following the entry below about the short dark runway.

**`tablet:pb-16` → `tablet:pb-[164px]`**, matching the block's own measured `pt`. Phone was
already symmetric (`py-32`, 128px both ends) and is untouched.

**This is a deliberate departure from a measured value**, and the reason it is defensible is
that it stands in for a block we do not build:

| | dark runway after the last paragraph |
|---|---|
| target | Manifesto `pb 64` + `Product Visuals` `pt 256` = **320px** |
| ours, before | Manifesto `pb 64` + `Testimonial` `pt 128` = **192px** |
| ours, now | Manifesto `pb 164` + `Testimonial` `pt 128` = **292px** |

Padding block 4 rather than block 6 was the choice: block 6's `pt 128` is measured and used
whether or not the green ever appears, so inflating it would corrupt a value that has nothing
to do with this. Block 4's padding is the one already implicated.

**⚠️ REVERT THIS WHEN BLOCK 5 LANDS.** With `Product Visuals` in place the runway becomes the
target's own again, and 164px here would overshoot by 100px. Noted in the file header, in the
deviations table, and here.


### 2026-08-10 (bottom) — every block is transparent; the opaque sections were mine

**Trigger:** user, with a live frame of the target scrolled past the manifesto text —
*"it should look like this for the bottom part"*. The frame shows the manifesto's words
ending, then a long **empty dark-green runway**, then block 5's "Built for Banking / Private
Markets / Public Markets" heading emerging *dark-on-dark* before the ground lightens.

**The cause was not a timing value. It was three `bg-paper` classes I had added.** Checked
the capture rather than guessing this time — **every block on the target is transparent**:

| block | background in the capture |
|---|---|
| `Hero` `framer-1mzt05a` | none |
| `Video` `framer-2uaicm` | none |
| `Logo Proof` `framer-s22g2m` | none |
| `Manifesto` `framer-tyl85t` | none |
| `Product Visuals` `framer-19mhri2` | none |
| `Testimonial` `framer-h1knkl` | none |
| `CTA` `framer-4o5umq` | none |
| `Felix Footer` `framer-17a2nid` | none |

The shared fixed backdrop is the **only** thing on that page that paints a colour. Ours had
`bg-paper` on Testimonial, CTA and Felix Footer — my invention, never measured. An opaque
white block slides up *over* the dark ground, so the runway in the user's frame could not
exist no matter where the exit threshold sat. Removed from all three.

**This also explains why the previous two exit-timing guesses never looked right.** I was
tuning when the ground lightens while an opaque section was hiding the ground regardless.
Worth remembering: when an animation on a shared layer looks wrong, check what is painted
*over* it before touching the animation.

**⚠️ Our runway is shorter than the target's, and by exactly the missing block.** After the
manifesto's text: ours is `pb 64 + Testimonial pt 128 = 192px`; the target's is
`pb 64 + Product Visuals pt 256 = 320px`. Both measured — the 128px shortfall is block 5,
which we do not build. Not compensated with invented padding, because that would corrupt
block 6's measured `pt`. It closes on its own when block 5 lands.

**The exit threshold was left alone and now has evidence behind it.** The frame shows the
ground still fully dark with the manifesto's bottom edge at ~46% of the viewport; our fade
does not start until `bottom 30%`, which is later still. Consistent, so nothing to change.

**Verified:** build + `tsc` clean; served HTML has 7 sections, 6 transparent and 1 carrying
only the manifesto's `bg-forest-deep` no-JS fallback.


### 2026-08-10 (ground) — the light end of the crossfade is plain white, not `canvas`

**Trigger:** user, on the bottom edge of the green section — *"make the background plain white
match the overall body background of the website"*.

**They were right, and the page was inconsistent in a way I had not noticed.** Three facts
that only add up when put side by side:

| | colour |
|---|---|
| `body` (globals.css) | `paper` `#ffffff` |
| Testimonial / CTA / Felix Footer | opaque `bg-paper` `#ffffff` |
| the fixed backdrop's light state | `canvas` `#f7f7f7` |

Hero, Video and Logo Proof are transparent, so they showed the backdrop. The page therefore
ran **grey above the green block and white below it**, and the green section's exit crossfaded
back to the grey — putting a visible step in exactly the place the crossfade exists to remove.

**`GROUND_LIGHT` `#f7f7f7` → `#ffffff`**, and the element's own class `bg-canvas` →
`bg-paper` so the pre-hydration and reduced-motion states match the value the tween resolves
to. Those two must always move together or the page changes colour the moment JS lands.

**⚠️ This is a deliberate deviation from the target**, now recorded in FEATURE.md: rogo's
backdrop really is `rgb(247,247,247)`. Matching our own body beats matching the target's
near-white when the two disagree — the alternative was repainting four sections to `canvas`
and changing the site's body colour to suit one page.

**Also corrected while in there:** the hero button's `focus-visible:ring-offset-canvas` was
offsetting against the old ground colour, which would have drawn a grey halo on a white page.
Now `ring-offset-paper`.

**Verified:** build + `tsc` clean; served HTML has the backdrop at `bg-paper` and **no
`bg-canvas` anywhere on the route**.


### 2026-08-10 (unify) — one trigger, one tween, one scalar for ground + grid + text

**Trigger:** user — *"i want the text and the green bg to be having the same trigger and
everything for the animation so we dont need to adjust both to match"*.

**Done, and it deleted more than it added.** All three moving things — ground colour,
`#integrations` opacity, `#manifesto-content` opacity — are now pure functions of one scalar
`p`, driven by one tween, fired by one ScrollTrigger on one pair of lines (`top 75%` /
`bottom 30%`).

**The beat is a keyframe range now, not a delay.** Both phases live inside the same tween:
ground runs `p` 0 → `GROUND_UNTIL` (0.6), text runs `TEXT_FROM` (0.45) → 1. The 0.15 overlap
is what keeps it reading as one gesture in two beats instead of two events.

**What this removed.** The whole runtime-sequencing apparatus: `darkStartedAt` /
`hideStartedAt` stamped off `gsap.ticker.time`, the `Math.max(0, … - now())` delay maths on
both fades, the second `ScrollTrigger`, the separate `contentTo` writer, and `STAGGER_S`.
That code existed *only* because two independent triggers could disagree about order. With
one tween they cannot — the invariant is now structural rather than defended.

**⚠️ One behaviour changed, and it is a fix.** The text previously kept its own
`end: "bottom top"` so it would "scroll off like content" rather than hide on the way down.
That meant between `bottom 30%` and `bottom top` the ground was lightening while the text was
still on screen — **white on near-white**, the exact thing the sequencing exists to prevent.
It now leaves with the ground.

**Verified numerically rather than by eye** (standing limitation: I cannot watch the page).
Sampling `p` through the tween:

| `p` | ground | grid | text | colour |
|---|---|---|---|---|
| 0.30 | 0.500 | 0.500 | **0.000** | `rgb(131,144,141)` |
| 0.45 | 0.938 | 0.062 | **0.000** | `rgb(30,53,47)` |
| 0.60 | 1.000 | 0.000 | 0.081 | `#0f2822` |
| 1.00 | 1.000 | 0.000 | 1.000 | `#0f2822` |

Text is still at exactly 0 when the ground is 94% dark, and only reaches 0.08 once it is
fully dark; reversed, the words hit 0 while the ground is still 94% dark. The grid is gone
precisely when the green lands. Build + `tsc` clean.

**The dials, now that there are only three:** `FADE_S` (speed of everything),
`GROUND_UNTIL` / `TEXT_FROM` (the beat — widen the gap for a longer blank, close it for
simultaneous), and the ScrollTrigger's two lines (when it fires).


### 2026-08-10 (tune 2) — `FADE_S` down again, 0.85 → 0.6

**Trigger:** user — *"a bit more faster"*. Second step of the same walk; nothing structural
changed, and `STAGGER_S` followed on its own because it is now a ratio (0.3s).

**0.6s is half the original 1.2s and about the floor for this effect.** Much under ~0.5 and a
colour wash stops reading as a fade and starts reading as a switch — which is the exact thing
the "slowly fade in" ask was about. Worth knowing before the next nudge down: the next
complaint about pace is more likely to be about the THRESHOLDS (where the fade fires, 75%/30%)
than about the duration.

### 2026-08-10 — backdrop fades sped up; the stagger became a ratio

**Trigger:** user — *"ok now fix but make the animation of both a bit faster"*, confirming the
sequencing itself was right and only the speed was off.

**`FADE_S` 1.2s → 0.85s.** That one constant governs every fade in the block — the ground's
colour, the integrations grid's opacity (both ride the same scalar `p`) and the text's
reveal — so "both" is covered whichever pair was meant: the two fades, the two directions, or
the ground and the grid. Still slow enough to read as a wash rather than a switch, which was
the original *"slowly fade in"* ask.

**`STAGGER_S` is now `FADE_S / 2` rather than a literal `0.6`.** This is the part worth
keeping: the beat was tuned as *half a fade*, not as 600ms. Leaving it literal while the fade
shrank would have made the beat proportionally longer — 70% of a fade instead of 50% — and
quietly changed the choreography instead of just its speed. Tie any future speed change to
`FADE_S` alone and the ground-then-words order holds at any duration.

**Verified:** build clean, `/clix` serves 200. **Not verified:** the new pace has not been
watched by me — same standing limitation, I cannot see the page.


### 2026-08-10 (tune) — the beat is a 0.6s stagger, not end-to-start chaining

**Trigger:** user, on the entry below — *"the text animatiion is super delay"*.

**Both complaints were about the same dial, from opposite ends** — "no delay" (concurrent)
and now "super delay" (chained: 1.2s wait + 1.2s fade = words complete at 2.4s). The beat is
now a **stagger between fade STARTS**: the reveal begins `STAGGER_S = 0.6s` after the
darkening begins (bookkeeping switched from `…LandsAt` to `…StartedAt`, same
same-tick-stamping mechanism). Symmetric on the way up — the lightening trails the hide's
start by the same 0.6s.

**Why the order still holds at half the wait:** at 0.6s the ground is ~50% dark but the text
is only *beginning* from opacity 0 — by the time the words are meaningfully visible (0.26 at
1.0s), the ground has landed (`17,42,36`). Measured at flick speed: words readable only ever
on dark; text fully in at **1.6s** (was 2.4s); upward the text is at 0.11 before the ground
reaches mid-light. Build + `tsc` clean.

**The dial, for next time:** `STAGGER_S` in ClixBackdrop.tsx. 0 = simultaneous, `FADE_S` =
the chained version the user rejected.


### 2026-08-10 (fix) — the blank beat is now sequenced in TIME, not scroll distance

**Trigger:** user, immediately after the entry below shipped — *"the text and the green bg
shows at the same time no delay"*.

**They were right and the verification below was misleading.** The 75%/45% line gap is ~270px
at 900px viewport — one flick. Both toggles fired within ~100ms and the two 1.2s fades ran
concurrently. The blank beat only existed at slow scroll, which is exactly how the probe
below sampled it (it stopped BETWEEN the lines — a state a real scroll passes through in
0.1s). **Lesson: verify a sequencing claim at realistic crossing speed, not at probe speed.**

**Fix: each fade queues behind the other's landing time.** Reveal starts no earlier than the
darkening lands; lightening starts no earlier than the hide lands. Order guaranteed at any
scroll speed, in both directions.

**The first fix attempt did not work, and the reason is worth keeping:** it asked the running
tween for its remaining time via `isActive()`. Both thresholds fire in the SAME ScrollTrigger
tick, and a tween created moments ago reports `isActive() === false` (the ticker hasn't
advanced it), so "remaining" read 0 and nothing waited. Replaced with explicit bookkeeping —
`darkLandsAt` / `hideLandsAt` stamped from `gsap.ticker.time` when each fade starts, delays
computed against those. Instant paths zero them.

**Verified at flick speed this time** — one instant jump crossing BOTH lines, 300ms samples:
down = ground runs `247→15,40,34` over 0–1.2s with text pinned at `0.00`, then text runs
`0→1` over 1.5–2.4s with the ground unchanged. Up = text `1→0` over 0–1.2s with the ground
still dark, then ground lightens 1.5–2.4s. Two clean beats, both directions. Build + `tsc`
clean.


### 2026-08-10 — the manifesto text arrives AFTER the ground; the section enters blank

**Trigger:** user, watching rogo live mid-scroll — *"i think its a separate page that is on
top of a blank section it seems since when i scroll on rogo theres no text and i can see the
text becoming visible when i scroll down"*.

**This is observational evidence reinstating a dropped feature.** A content fade existed in
the 2026-08-09 (content + motion) pass and was removed by the correction that followed it,
explicitly for lack of evidence — "no evidence of one in the target". The user has now
watched the target do it: the section arrives as a blank dark stretch, and the words fade in
on further scroll. Layer-wise their "separate page on top of a blank section" reading is
right in spirit — the target's manifesto sits over the fixed backdrop and its content is
revealed independently of the ground.

**Mechanism.** `#manifesto-content` (new id on the width container) gets its own threshold
toggle inside ClixBackdrop, on a line **30% deeper than the ground's** — top at **45%** vs
the ground's 75%:

- ENTER (down) or ENTER-BACK (up from below) → text fades in, same `FADE_S`/1.2s
  `power2.inOut`, so the two fades read as one gesture in two beats;
- LEAVE-BACK (up, above the line) → text hides again — and the ground is still dark at that
  point, so the reverse order also holds;
- the text never hides on the way DOWN (`end: "bottom top"`) — it scrolls off like content;
- `onRefresh` sets it instantly (`isActive || progress === 1`), so a mid-page reload shows
  dark-with-text with no replay.

**The two orderings are the invariant:** down = dark first, then words; up = words gone
first, then light. White type can never sit on a light ground. A SEPARATE scalar/tween from
the ground's `p` — different element, different property, so no writer conflict; the shared
cleanup now also clears `content.style.opacity`.

**SSR/fallback:** no inline opacity in the HTML — the zeroing happens only inside
`matchMedia` at layout timing, so JS-off / reduced-motion keep visible text on the section's
own `bg-forest-deep` fallback.

**Verified** (CDP, stationary between thresholds): between the lines ground is fully
`15,40,34` with text at `0` — the blank beat exists; past the text line the opacity runs
`0 → 0.06 → 0.54 → 0.95 → 1` with the ground unchanged; back between the lines text returns
to `0` while the ground STAYS dark; above both, light ground and hidden text. Build + `tsc`
clean.

**Still ours, not measured:** both line positions (75/45) and the shared 1.2s. The
*sequence* is now observed; the *numbers* are constructed.


### 2026-08-10 — the integrations grid disappears while the green is active

**Trigger:** user, with a screenshot of the last tile row sitting readable on the dark
ground — *"i dont want to make the icons or the words any of the tools visible when the
green is actie"*.

**Why grey wasn't enough.** The monochrome pass matched rogo's tint, but `#8b8b8b` on
`forest-deep` computes to ~4.7:1 — the marks are *more* legible on the dark ground than on
the light tiles. rogo's wordmarks dissolve because of their own timing; ours needed it made
explicit.

**Mechanism: the grid's opacity rides the backdrop's existing scalar.** `#integrations` (new
id on the ClixLogoProof section) runs `opacity = 1 - p` inside the same `write()` that sets
the ground colour — one value, one writer, so colour and visibility can never disagree and a
mid-fade reversal turns both around together. No second tween, no second trigger. The
supersession chain on the old "coloured glyphs stay bright" consequence is now: accents →
grey ("match the design with rogo") → gone entirely (this).

**Also fixed while here:** `write()` uses the raw DOM, which `matchMedia` cannot revert — a
preference flip to `reduce` mid-session would have stranded a half-dark ground / half-hidden
grid. The `mm.add` callback now returns a cleanup that clears both inline styles.

**Safe because nothing in the grid is interactive** — spans only, so opacity 0 leaves no
focusable ghost. (Screen readers still see the list; acceptable, the content is a claim, not
navigation.) With JS off / reduced motion the grid simply stays visible on the light page,
which is the static layout it always had.

**Verified** (CDP, stationary scroll): grid opacity tracks the colour sample-for-sample —
`1 / 0.93 / 0.46 / 0.05 / 0` as the ground runs `247,247,247 → 15,40,34`, and both return
exactly (`1`, light) on scroll-back. Build + `tsc` clean; the two pre-existing eslint errors
below still stand.


### 2026-08-09 — the integrations grid went monochrome, matching rogo's

**Trigger:** user, with both grids screenshotted side by side — *"match the design with
rogo"*.

**The diagnosis.** rogo's twelve wordmarks are twelve different designs unified into one
quiet block by a single grey. Ours kept each tool's brand accent (teal Vapi, pink n8n, purple
Make…), which is exactly what broke that — the grid read as a candy row next to theirs. The
accents were the target's own values lifted from the clix site, so they were *correct data*
making the *wrong design*.

**Change:** every glyph and every name now renders `#8b8b8b` — the same grey as the caption
above the grid, and the grey rogo's own wordmarks sit at. The lockup structure (glyph +
name) stays; the 2026-08-09 reasoning that abstract glyphs need their names still holds.

**Mechanics worth keeping:**
- Eleven marks are `currentColor` and just follow `color`. **monday.com's three shapes carry
  their own `fill` attributes** — greyed with `[&_*]:fill-current`, which works because SVG
  presentation attributes lose to ANY css rule. A blanket fill override was NOT used: Vapi's
  stroke-drawn `fill="none"` paths would flood solid.
- **`#8b8b8b` was promoted to `--color-mark`.** It was a deliberately-untokenized x2 one-off;
  this change took it to ~26 uses, which is a scale step and crosses CLAUDE.md's
  tokens-before-pixels line. Noted in globals.css: ~2.97:1 on the tiles, logotype-exempt,
  never for prose (`muted` #737373 remains the darkest legible grey).
- `toolMarks.tsx` keeps each `accent` as data with a ⚠️ note that nothing renders it — it is
  provenance from the clix site, and what any future coloured use would need.

**Free consequence:** the recorded backdrop cost — coloured glyphs staying bright while the
ground crossfades dark — is gone. Grey marks dissolve into `forest-deep` the way rogo's
wordmarks do.

**Verified** (CDP at 1440): all 12 tiles compute label `rgb(139,139,139)`, svg colour
`rgb(139,139,139)`, and zero non-grey non-`none` fills — monday.com included. Screenshot
taken and inspected; `npm run build` + `tsc` clean. eslint still carries the two pre-existing
`/clix` errors noted in the entry below.


### 2026-08-09 — the ground fade is now a TOGGLE, not a scrub

**Trigger:** user (voice) — *"a scroll to play animation ... when hitting a certain pixel, it
would activate and slowly fade in for the effects. The green section should have the toggle."*

**The mechanism changed, and it is a user choice over the observed target.** The previous
pass coupled the colour to scroll POSITION (a `quickTo` gliding toward a geometry-derived
target): stop scrolling mid-band and the ground froze mid-colour. Now crossing a line fires a
**timed tween that runs to completion on its own clock** — the "toggle". Scroll speed no
longer affects fade speed. Whatever rogo's exact coupling is, this is what the user asked
for, in plain terms, twice in one sentence.

**Thresholds and duration:**
- ENTER — Manifesto top at **75%** of the viewport → fade to `forest-deep`, **1.2s
  `power2.inOut`**. 75% chosen so an ordinary scroll pace lands fully-dark near the 60% mark
  the live screenshot showed; with a toggle that correspondence inherently varies with
  scroll speed.
- LEAVE — bottom at **30%** → fade back. Exit still unobserved on the target (runs through
  block 5's padding, which we don't build).
- Both lines reverse when re-crossed. In-out ease, unlike CountUp's ease-out — a counter
  starting slow reads as lag, a colour wash starting and ending soft is the point.

**What survived from the scrub version, because the constraint didn't change:** the
single-writer rule. One scalar `p`, one `fadeTo` that kills the running tween before starting
the next — so a fast flick crossing both lines inside one fade still has exactly one writer.
`onRefresh` **jumps** rather than fades (`instant`), so a reload landing mid-section paints
dark immediately instead of playing a 1.2s wash nobody scrolled for.

**Verified** (CDP, 1440×900, scroll STATIONARY during sampling — so any movement is the
tween's clock, which is the entire claim):

| | |
|---|---|
| 120px short of the line, 1.6s wait | still `#f7f7f7` |
| crossed by 40px, then stopped | `247,247,247` → `239,240,239` → `180,187,185` → `59,79,74` → `15,40,34` over ~1.25s |
| scrolled back above the line | returns to `#f7f7f7` |
| reload landing inside the section | dark immediately, no fade |
| `prefers-reduced-motion: reduce` | ground never animates; Manifesto keeps its own `bg-forest-deep` |

`npm run build`, `tsc` clean.

**⚠️ `eslint src` is NOT clean, and the two errors are pre-existing, not from this change:**
`ClixCTA.tsx:38` (`<a href="/">` should be `next/link`) and `ClixHero.tsx:116`
(`reduced.current` read during render). Both live in the same uncommitted /clix batch this
file's earlier entries describe. Left alone here — this task was the backdrop — but they
block any "lint clean" claim for the page until fixed.


### 2026-08-09 (correction) — the backdrop animation, corrected against a live screenshot

**Trigger:** user, with two frames of the live rogo.com/felix mid-scroll — *"animation is not
as smooth as rogo also the color of this is far and the fade on the green section is
different"*. Three separate faults, and the screenshot settles all three. **This supersedes
the entry below it**, written hours earlier without that evidence.

#### 1. Wrong layer

The live frame shows the ground below the nav fully dark **while the last two rows of the
logo grid are still on screen**, sitting in the dark and nearly invisible. So the target
darkens the WHOLE VIEWPORT and simply lets the block above dissolve.

The previous pass animated the Manifesto's own box specifically to protect that block. That
reasoning was sound and the conclusion was wrong: it produced a coloured rectangle sliding up
a light page instead of a page whose ground changes. Reverted — the fixed backdrop animates,
and the Manifesto is made transparent as soon as the animation is live.

New `ClixBackdrop.tsx` owns both the layer and the ScrollTrigger; `page.tsx` renders it in
place of the inline div, and `ClixManifesto` is a plain server component again.

**⚠️ One consequence is ours.** rogo's tiles hold grey wordmarks that vanish cleanly into the
dark. Ours hold coloured tool glyphs, which stay bright while their labels darken — so our
grid degrades differently mid-crossfade. Matching the mechanism was the ask; this is the
price, recorded rather than designed around.

#### 2. Wrong colour — and the palette already knew

`#0f2822`. It is declared as a Framer token on the target and referenced **nowhere** in the
static HTML or CSS. On 2026-08-09 that zero-use count was logged as "defined but unused"; it
is in fact the *fingerprint* of a JS-applied colour — a value that only reaches the DOM from
the scroll handler cannot appear in a capture. The one dark green in the palette with no
static consumer is the one the scroll handler uses.

Ours was `forest` `#1a2a25`, which is the display-**type** colour (×19 real uses). Two greens,
two jobs. New token `--color-forest-deep`; DESIGN-SYSTEM.md amended, including the note that
the counting method needs this exception.

#### 3. Not smooth — `scrub: true` was the bug

A raw scrub tracks the scrollbar exactly, so a trackpad's discrete deltas come through as
steps. `scrub: 1` gives the tween a 1s catch-up, which is what makes a colour ramp read as a
fade instead of a slider. This is the whole of "not as smooth".

#### 4. A fourth thing the screenshot caught, unprompted

**The target keeps a solid WHITE nav over this section**, dark content and all, even though
the ground behind it is dark green. Ours flipped the bar to ink via `data-nav-theme="dark"` —
our own invention from before the page existed. Now `light`.

#### Timing

- **Enter** — `canvas` → `forest-deep`, Manifesto top from the viewport bottom to 60% up.
  The 60% is read off the screenshot: fully dark with the top at ~61%.
- **Leave** — ⚠️ **not observed and not copyable.** The target runs its exit through the
  256px of `Product Visuals` top padding that follows this block, and **we do not build block
  5**. Ours is compressed into the gap we actually have. Revisit when block 5 lands.

Also dropped: the content opacity fade from the previous pass. With the ground now dark well
before the Manifesto's text is on screen, it was solving a problem that no longer exists, and
there is no evidence of one in the target.

**Verified:** build clean; served HTML has the manifesto at `data-nav-theme="light"` with its
`bg-forest-deep` fallback intact and the backdrop present. **Not verified:** the exit timing,
and nothing on this page is pixel-diffed.


### 2026-08-09 (content + motion) — integrations grid, and the green ground now arrives by scroll

**Trigger:** user — *"instead of trusted, what tools we integrate or some shi"* and *"the
green part should have the rogo animation"*.

#### Block 3 is now an integrations grid, and the tools are not invented

`docs/reference/clixsolutions/content.json` — the REAL company site — already carries a
`Tool · 01` strip. Twelve unique names, doubled into a marquee track there:

    Vapi · n8n · Make · OpenAI · Gemini · monday.com · WhatsApp · Claude ·
    Google Docs · Google Sheets · Google Calendar · Hostinger

**Twelve, which is exactly the number of tiles this grid has.** No padding, no guessing, and
no third-party asset fetched: the marks and their accent colours came out of clix's own
`pages/home.html` into `src/components/clix/toolMarks.tsx`. That site does not use real brand
logos for every tool either — some marks are the vendor's glyph, some a simplified stand-in —
and ours reproduces what is there rather than "improving" it, so the two sites stay in step.

**The box is unchanged and still rogo's**: 4/3/2 columns, the hard 436/600px height, 8px gap,
`#15151508` tiles, 6px radius. Only the contents differ.

**One structural difference from the target's tile, and it is forced.** rogo drops in a bare
wordmark because "Jefferies" IS the logo. Half of these marks are abstract glyphs, so the
name has to travel with them — each tile is a centred `[24px glyph] [name]` lockup, tinted
with the tool's own accent (monday.com carries its own three fills and ignores the tint).

Heading is now "The tools we build with and integrate". Copy, so cheap to change.

#### The Manifesto's ground is scroll-driven

Two scrubbed phases, in this order, and **the order is a correctness requirement**:
1. ground `canvas` → `forest`, from the section's top edge entering the viewport to 70% up;
2. content `opacity 0 → 1`, from 70% to 40%.

The type is white. A single frame of it over `canvas` is invisible text, so the dark has to
land before the content does. Overlapping the two phases reintroduces exactly that. A third
tween returns the ground to `canvas` as the bottom edge clears, so the block does not hand a
dark screen to the light section below.

**⚠️ Ours animates THIS SECTION'S BOX, not the shared fixed backdrop, and that is a reasoned
choice rather than a shortcut.** Driving the shared layer — which is what rogo does — only
works if the neighbours are transparent, and ours are. `Logo Proof` sits directly above with
`#8b8b8b` text on `#15151508` tiles; darkening the shared ground while any of it is still on
screen makes that block unreadable mid-scroll. rogo can afford it because its transition
timing is tuned against the live page, which is the one thing a static capture does not
record. Animating this box is **pixel-identical wherever the neighbours are opaque** and
cannot break them.

**Still ours, not measured:** the offsets and the content fade. They are constructed from one
fixed fact (white type ⇒ dark first), not observed. The earlier note in this file calling the
hard edge "the page's one real fidelity compromise" is now superseded — the edge is gone, but
the timing is still unverified.

**Fallbacks are the old behaviour, deliberately.** The section ships `bg-forest` with visible
content, so with JS off, before hydration, or under `prefers-reduced-motion` it is the static
block it was. GSAP only overrides that inside `gsap.matchMedia("(prefers-reduced-motion:
no-preference)")`, at `useLayoutEffect` timing, so the swap is never painted. Same pattern
`CountUp` already uses.

**Verified:** build clean; served HTML has the new heading, all twelve tool names, and the
manifesto still SSR-ing `bg-forest`. **Not verified:** the scroll timing has not been watched
at any tier, and nothing on this page is still pixel-diffed.


### 2026-08-09 (copy) — the hero headline is "Meet Clix"; the rest is still rogo's

**Trigger:** user — *"make it meet clix"*. First piece of the copy pass, done on its own.

**Changed:** the hero's visible line, the `sr-only` h1 that voices the whole lockup, and the
route's `<title>`. Nothing else.

**The title lost its bar.** The target's pattern is `Rogo | Meet Felix` — brand, then
product. Renaming the product to Clix collapses it, because the brand IS the word now, and
`clix | Meet Clix` says it twice. So it is just `Meet Clix`, tracking the h1.

**⚠️ Still rogo's, and NOT to be fixed with find-and-replace:**

| Where | Count | Note |
|---|---|---|
| `ClixCTA` | 1 | "Staff Felix today." — the closing headline. Safe to rename; just not asked for. |
| `ClixFelixFooter` | 1 | The wordmark itself, set in type. Renaming it changes the block's whole look — its box is `aspectRatio: 2.3376`, sized for a five-letter word. |
| `ClixManifesto` | 5 | Prose about what the product is. Needs writing, not renaming. |
| `ClixTestimonial` | 7 | **Do not rename these.** They are real quotes from real people about rogo's product. As-is they read as obvious placeholder text; with "Clix" substituted they become *fabricated third-party endorsements of clix*, which is worse than what is there now. These have to be replaced with clix's own — or removed. |

That last row is the reason `robots: { index: false }` stays on this route until the copy
pass is finished, not just until the headlines read right.


### 2026-08-09 (fix) — the Brand button was wrapping to two lines

**Trigger:** user, comparing screenshots — *"the request access button is different i want it
to be the same as the rogo"*.

**Cause, and it was one missing declaration.** The original's label node carries
`white-space: pre`:

```css
.framer-xYyYE .framer-qcnp6y { white-space:pre; flex:none; width:auto; height:auto }
```

That is **load-bearing, not cosmetic**. The anchor is `width: min-content`
(`.framer-xYyYE.framer-kh28y4`), so min-content resolves to the longest *word* and
"Request Access" breaks at the space — the button rendered ~112px wide and two lines tall
instead of one line at the original's width. Every other value on the button was already
right: `padding:8px 16px`, `gap:8px`, inner box `height:20px; padding:1px 0 0; gap:10px`,
16px/500/-0.01em/1em, radius 6, and the 48px container.

**Fixed in both instances** — `ClixHero` and `ClixCTA`. They are the same `Brand` component
in the original, so they had the same omission.

**Checked the rest of the same pattern rather than just the reported one:** every other
`w-min` box on the page. `ClixTestimonial`'s figcaption spans already had `whitespace-pre`;
`ClixVideo`'s mute toggle holds a single word, so min-content cannot break it. No other
instances.

**Lesson for the remaining blocks:** `width: min-content` in a Framer capture almost always
travels with a `white-space` declaration on the text inside it. Porting the box without the
text node's own rule is how this got through.


### 2026-08-09 (push) — shipped to `main`, `noindex` on this route only

Pushed with the copy still rogo's, at the user's request. The mitigation they chose over
holding the push or excluding the route: `robots: { index: false, follow: false }` in the
route's `metadata`. Reachable, reviewable, not indexable — the indexing is the part that
does the damage, not the existence of the URL.

The **capture files** went up with it (`docs/reference/target/rogo-felix-2026-08-09.*`,
533 KB of rogo's own source) into a **public** GitHub repo. Not a new decision:
`rogo-home-2026-08-02.*` has been committed there since the project started, and `docs/` is
in `.vercelignore`, so the captures are in the repo but never served.

**Tied to the copy pass:** the `robots` block, and the standing warning above it.


### 2026-08-09 (later still) — top spacing fixed; ticker removed on this route

**Trigger:** user, with our `/clix` and `rogo.com/felix` screenshotted side by side —
*"match the spacing … on top on the clix Felix page. Also remove the black banner on top,
only on this page."*

**The spacing gap had one cause, and it was structural, not a padding value.** Block 1's
`128px 40px 0` was already correct and unchanged. What was wrong is that our header is
`position: fixed` and the target's, **on this page only**, is not:

```css
.framer-cv20u .framer-1jwqerv-container { position:sticky; top:0; height:auto }
```

Sticky means in flow, so the target's 128px is measured from the nav's bottom edge. Ours was
measured from the top of the document, which put the whole page ~70px high. rogo.ai's home
nav overlays a video and IS fixed — two pages, two templates, and the home page is right as
it stands.

**Fixed with a spacer, not by making the header sticky.** Sticky was the obvious move and is
the wrong one: the mobile panel lives inside the header, so in flow it would shove the page
down ~400px on every menu tap — a regression the fixed header does not have. A zero-content
spacer buys the same layout with none of that. `Nav` grew two props: `banner` and `spacer`.

**Height lives in one place, `--nav-row-h` in globals.css** — `74px` below 1200, `70px`
above. **Derived, not eyeballed**, and it holds because every box in the row is a
fixed height (`p-4` + `h-10` burger + two coincident 1px borders; `py-4` + the 38px
NavButton). No font metric is involved, so it cannot drift with the typeface — but it will
drift if a row's padding changes, which is why the derivation is written out beside the
value. Not in `@theme`: a Tailwind v4 theme block cannot carry a media query.

**`banner={false}` is deliberately NOT the same as passing no models.** Empty `models` is the
outage path and must keep reading as a fault on the home page; this is a template decision.
Same rendering, opposite meaning.

**Also closed a loose end:** the hero's `Request Access` was pointing at `/#contact` — the
*home* page's contact block — because `ClixCTA` did not exist when the hero was built. It
does now, so it points at `#clix-contact` on this page.

**Verified:** build clean, `/clix` still prerenders (and no longer carries a `revalidate`,
since the ticker was the only thing on the route that needed fresh data). Served HTML: no
`bg-banner` and the spacer present on `/clix`; banner present and no spacer on `/`.
**Not verified:** still nothing pixel-diffed at any tier.

### 2026-08-09 (later) — six more blocks built; page is 7/8

**Trigger:** user — *"building the clicks. Felix Page."* Read as: proceed, and make the
asset calls rather than waiting on them (CLAUDE.md's ceiling for decorative content — one
reasonable source, no hunting, show it and ask).

**Built:** `ClixVideo`, `ClixLogoProof`, `ClixManifesto`, `ClixTestimonial`, `ClixCTA`,
`ClixFelixFooter`. All box values measured; the per-block table of what was non-obvious is in
`FEATURE.md` and not repeated here.

**Three asset calls, all made the same way — reuse what the repo already owns, never
download rogo's:**
- **Video** → `public/video/hero-clix.mp4`, the clip the home hero already ships. Every box
  value is still the original's.
- **Logos** → all 12 institutions the target names were **already vendored** from the home
  page's carousel, so nothing was fetched or redrawn. They are white-fill (cut for the dark
  hero) and this page is light, so they render as **CSS masks with an `ink/70` fill** — one
  asset, either polarity, rather than a second recoloured copy of all twelve.
- **Footer wordmark** → the original's is a 2008×859 PNG of rogo's artwork. **Set in type**
  instead, at the same `2.3376` aspect so the block's height is unchanged.

The precedent for all three is the same one: this repo deleted rogo's `hero-original.mp4`
for copyright when it went public, and the deploy now publishes whatever `main` holds.

**⚠️ The Manifesto background is the one real fidelity compromise.** The original crossfades
the shared fixed backdrop to dark as you scroll in, which is unobservable in a static
capture. Ours paints the section `forest` instead. Same legibility, honest about what it is —
**the visible difference is a hard edge where the original has a crossfade**. `forest` was
chosen over `ink` because it is the page's own colour and the only dark it declares; that is
reasoning, not measurement.

**The marquee avoids the drift bug the logo-carousel had to solve in JS.** That row spaces
with `gap`, so a doubled track of 2n items has 2n-1 gaps and half its width is one gap short
of a cycle. Here each card carries its own `margin-right` instead, so n items measure exactly
n × (card + 20) and `-50%` is precisely one cycle — no measured cycle needed. Worth keeping in
mind for any future marquee: it is a cheaper fix than measuring.

**Also moved:** the fixed `canvas` backdrop went from inside `ClixHero` to `page.tsx`. In the
original it is a sibling of all eight sections, and keeping it in the hero put it inside an
`overflow-clip` ancestor for no reason. Every section now carries `z-[1]` to paint above it.

**Estimated, not measured** — flagged so nobody reads them as extracted: the testimonial
card's own width/padding/fill (the quote type and gaps ARE measured), and the 90s marquee
cycle.

**Verified:** `npm run build` clean; `/clix` prerendered; served HTML contains all seven
blocks' marker strings plus the video path and the marquee class. **Not verified:** nothing
on this page has been pixel-diffed against the reference at any tier, and there has been no
keyboard or contrast pass.

### 2026-08-09 — page captured and measured end to end; `Hero` built

**Trigger:** user pasted a screenshot of `rogo.com/felix` — *"So clone this page, um, it's…
should be clicks."* Two scoping answers followed: **copy = "clone verbatim now, rewrite
after"**, **route = `/clix`, and wire the nav**.

**Capture.** `docs/reference/target/rogo-felix-2026-08-09.html` (404 KB) + the five inline
`<style>` blocks concatenated to `.css` (129 KB). Dated filename, existing capture untouched,
per the reference README. **Note the host: `rogo.com`, not the `rogo.ai` the home page came
from** — same Framer project, different site.

**Eight blocks**, in order, with every padding/gap extracted → table in `FEATURE.md`.
Gutter is 40px at ≥810 and 16px on phone throughout; container is the same `1280px` the home
page uses, so no new layout token.

**The tier map collapses to three.** `hidden-j35swi` = phone, `hidden-1mourlc` = tablet,
`hidden-1ggina8` = desktop, `hidden-za60dz` = XL — derived by brace-matching each class back
to its enclosing media query. **XL and Desktop share every value on this page**, so the
headline has three sizes (92/72/56), not four, and there is no ≥1600 art anywhere.

**The palette costs exactly one token.** Counted rather than eyeballed: `forest` `#1a2a25`
×19 is the only colour the page introduces, and it does two jobs — display type and the
primary button. `ink` ×194, `muted` ×48, `hairline` ×19, `paper` ×17 already exist. The four
other greens the Framer project declares have **zero** uses, so DESIGN-SYSTEM's "defined but
unused" list was right to hold them and they stay there. `#8b8b8b` ×2 deliberately not
tokenized — two uses is a one-off.

**⚠️ The biggest finding is a thing the capture cannot answer.** The Manifesto's type is
`#ffffff` over body at `rgba(255,255,255,0.7)` — white, therefore on a dark ground. The only
candidate is the page's **fixed 110vh backdrop** (`framer-mEC0Y`), whose SSR fill is
`rgb(247,247,247)`. So that layer's colour is animated from JS on scroll, and the sequence,
offsets and easing are all unobservable in a static capture. Recorded before building
anything that sits on it, because building the Manifesto on a guessed background would
produce a section that looks finished and is wrong.

**Hero, built.** The headline is three boxes — centred `Meet Felix`, then a row of
right-aligned `your new` + a **fixed-width** rotating word (270px at ≥810, 306px on phone).
The fixed width is the mechanism: it holds the row's optical centre still while the word
changes. Full value table in `FEATURE.md`.

**The rotating word's motion is half measured, half estimated, and the split matters.**
Measured exactly, from the SSR node: it enters `blur(8px)`, `opacity:0`,
`translateY(-24px)` — from above. Estimated: hold 2600ms, swap 500ms, and a *downward* exit,
which is the natural continuation of a downward entrance but was never observed.

**⚠️ The word list is 2 words and the original's is longer.** Not recoverable: the word lives
in a Framer code component (`data-code-component-plugin-id="84d4c1"`) fetched lazily. Checked
two ways and then stopped, per the effort ceiling — the main 146 KB bundle contains none of
the strings, and six cache-busted fetches of the live page returned `investor` six times.
`analyst` came from the user's screenshot. **Nothing was invented to pad the cycle**; a made-up
word would read as measured. Extending the array is the only change needed when the real list
is known.

**Built with CSS transitions, no animation library.** `framer-motion` is not even installed,
and neither trigger fits: this is a timed two-state toggle, the same reasoning already
recorded for `testimonials`. `prefers-reduced-motion` freezes on the first word rather than
hard-swapping — an abrupt text change is the same distraction without the softening.

**One accessible heading for the whole lockup** (`sr-only`), with the three visible boxes
`aria-hidden`. Exposing them would announce a fragment at a time, and a live region would
announce a new word every 2.6s forever.

**The nav became a shared component today, which broke its own links.** `Clix` got
`href="/clix"` per the standing rule in `Nav.tsx` (an inert slot gets its href the moment its
page exists). But `#security` / `#testimonials` / `#contact` were bare hashes from the
one-page era and point at nothing on `/clix`, so all four are now root-relative (`/#security`
…). `/#x` still scrolls rather than reloads when you are already on `/`, so home is unchanged.

**Deviation from CLAUDE.md §3, deliberately:** one feature folder for the whole page rather
than eight. Eight folders for eight blocks of one page would bury the page-level mechanics
(the backdrop, the tier map, the shared gutter), which are the things that actually need to be
findable. Blocks are documented as sections inside `FEATURE.md`.

**Verified:** `npm run build` clean including TypeScript; `/clix` prerendered as static;
`localhost:3000/clix` returns 200 with the headline, button and rotating word in the served
HTML. **Not verified:** no pixel comparison against the reference at any tier, no keyboard or
contrast pass. The hero has not been diffed against a screenshot — only rendered.
