# Company page — context

Memory for `/company`. Newest day at the top. Decisions and measurements, not narration.

## Current state

**Status:** `review`. All six bands built, geometry verified, docs written. Build and lint
clean; `npx tsc --noEmit` clean across the project.

**Next action:** the two user answers that hold `noindex` — the Unit 8200 credential and Block
5's placeholder photograph. Then the contrast decision below.

**Route:** `/company`, nav `Company` wired to it, footer `About` repointed at it.

**Branch:** none. Built directly on `dev`, at the user's instruction, after
`product-content` was fast-forward merged in.

> ⚠️ **A second Claude session is building `/careers` in this same working tree.**
> `git status` during prep showed its `rogo-careers-2026-08-12.{html,css}` capture sitting
> untracked beside ours. Consequences that outlived prep:
> - **Never `git add -A` here.** Stage only this page's paths, or you commit their
>   in-progress work.
> - `Nav.tsx` is shared: `:107` is Company (ours), `:111` is Careers (theirs). Touch it last
>   and re-read immediately before editing.
> - Block 5's CTA points at `/careers`, which is their route. If it 404s, that is the
>   integration point to check, not a bug in this block.

---

## 2026-08-12 — Block 1's video autoplays, and the obvious implementation was wrong

User: *"make the video auto play in company remove the play button"*. A deliberate departure
from the target on this one point: the capture's variant is literally named `Paused` and waits
for a press.

`muted` is **required**, not decoration. Browsers block unmuted autoplay outright, so without
it the promise rejects and nothing ever plays. It costs nothing because the clip has no audio
track. `preload` moved `none` → `metadata`: `none` fights autoplay, `auto` would pull the whole
1.3 MB on every page load whether or not anyone scrolls to the band.

### ⚠️ `autoPlay={!reduced}` DOES NOT HONOUR THE PREFERENCE. The first version shipped that bug.

Autoplay is exactly the motion a reduced-motion visitor has asked not to see, and
`globals.css`'s rule cannot help — it targets `.hero-video` only. So the preference was wired
through the existing `usePrefersReducedMotion` hook … and it did not work.

**Caught by measuring rather than reasoning.** With reduce emulated over CDP, the attribute read
`autoplay false` and `controls true`, exactly as intended, **and the clip was playing anyway**,
`currentTime` advancing 4.05 → 6.05.

The cause is hydration order. The hook's server snapshot is `false`, so SSR emits the
autoplaying markup and the browser starts the clip while parsing. React then hydrates and drops
the attribute, but **`autoplay` is only consulted when playback BEGINS** — removing it never
pauses an element that is already running.

Fixed with an imperative `useEffect` that pauses on `reduced`. That also covers a case the
attribute never could: someone toggling the OS setting with the page already open.

Verified after the fix, both modes:

| | paused | muted | autoplay | controls | currentTime |
|---|---|---|---|---|---|
| no-preference | false | true | true | false | 4.20 → 6.21, advancing |
| reduce | **true** | true | false | **true** | 0.06 → 0.06, frozen |

It **degrades rather than removes**: a reduced-motion visitor gets the poster plus native
controls, so the clip is still theirs to watch on purpose. Hiding it outright, which is what
`globals.css` does to the home hero, would be wrong here — that one is decorative background,
this one is content.

**Rule worth carrying: a media attribute driven by a client-only hook is not a preference
guarantee.** SSR renders the default, the browser acts on it before hydration, and only an
imperative call undoes it. `PlayGlyph` and the click-to-play latch were removed as dead code.

---

## 2026-08-12 — Both media slots replaced with the user's own assets

### Block 5: stock photograph in, Old Jaffa placeholder out

Right subject at last, people at work rather than a landmark. It also **fixed a real defect**:
the band is `data-nav-theme="light"` per the measured spec, and the dusk placeholder had the nav
painting dark glyphs over a dark image. The new photograph is bright, so the marker is now
correct rather than merely specified.

Preparation, none of it cosmetic: renamed off `company bg.jpg` (a space means percent encoding
in every URL), **2.3 MB at 5917x3950 down to 164 KB at 2400x1200**, and cropped to **2:1 on
purpose** — neither of the band's own ratios. The band is 2.69 at 1600 and 1.30 at 390, so 2:1
is the midpoint that survives `cover` at both ends; cropping to either extreme guts the other.
The uncropped original is preserved **outside the web root** at `assets/company-bg-source.jpg`,
because everything under `public/` is served and shipped whether or not code references it.

⚠️ **Licence unverified.** The file arrived with no provenance. Confirm commercial use is
permitted before this route is indexed. And it is **stock, not clix's team**, sitting under a
heading about joining that team — ordinary for a careers block, much weaker than a quote put in
a named person's mouth, but not the real thing.

### ⚠️ Block 1: `boss-lecture.mp4` is 9:16 portrait in a 16:9 slot

`ffprobe` reports `1024x576`. The stream carries **`rotation=-90`**, so it actually presents as
**576x1024**. Reading the reported dimensions and wiring it up would have looked like a clean
16:9 match and been wrong.

Against the measured `aspect-[1.78344]` box, `object-fit: cover` locks to width and shows about
**32% of the frame**. Simulated the exact crop before touching the component rather than
swapping and eyeballing: the speaker's head and the seated listener both survive at `50% 50%`,
so the position is unchanged.

Two things that cannot be fixed in CSS, both recorded in the component:
- **No horizontal slack.** Cover locks to width, so `objectPosition`'s first value does nothing
  here. Only the vertical value reframes it.
- **576px upscales 2.2x** into the 1280px box, so it renders visibly soft. That is the source.
  A wider capture is the only fix.

The alternatives, if the crop is ever judged too tight: `object-contain` letterboxing (leaves
~877px of empty ground either side) or giving the band its own aspect ratio, which breaks the
clone and moves every band below it. Neither taken.

Still no audio track, like the clip it replaced, so unmuted stays safe.

**Geometry re-verified after both swaps: every band still matches the target to 0.00px at all
four tiers.**

⚠️ `video/hero-tel-aviv.mp4` and its poster are **unreferenced again**, 6.9 MB of dead weight.
Candidates for deletion.

---

## 2026-08-12 — The wave. Five agents, and every one of my errors was caught by an agent

Five agents, one file each, exclusive ownership, launched in one message. All five landed
compiling. **Every band height matches the target to 0.00px at 1600 / 1440 / 1024 / 390** and
`<main>` totals are identical (4497.16 at 1440, 6451.88 at 390). Zero horizontal overflow.

### ⚠️ Three numbers in my spec were wrong. Agents found all three, from the CSS.

Every one was caught the same way: by reading the capture's stylesheet rather than trusting the
brief or back-solving from a rendered box.

1. **The Mission grid collapses at 810, not 1200** (Unit B). My spec said the grid stacked below
   1200 along with its container. It does not: the base rule is
   `grid-template-columns: repeat(3, minmax(50px,1fr))`, the only `repeat(1, ...)` override sits
   in `@media (max-width:809.98px)`, and the 810–1199.98 block never restates the tracks. **The
   outer container and the inner grid change at different breakpoints.**

   The damning part: my own probe had already returned a `288px` column at 1024, and
   `(944 - 80) / 3 = 288` only resolves as three columns. I had the answer and wrote the prose
   against it.

2. **Both Hero gaps were wrong, and they compound** (Unit A). `Text & Button` is 32 at base with
   a single `≤809` override to 24, so **tablet inherits 32**, not the 24 I wrote. `Text
   Container` is the reverse: 24 at base, `16px` in the tablet block only. I had derived these
   by arithmetic from the band height — one equation, **two unknowns, one of them fixed
   arbitrarily**. With 24 and 24 the tablet Hero computes to 431.2 against a rendered 439.2,
   putting every band below it 8px high.

3. **Only the Hero CTA has corner brackets** (Unit E). I wrote that both did.
   `.framer-kh28y4` has exactly one child, the label row, and no bracket SVGs.

**The lesson is one sentence: read the CSS, do not back-solve it.** A rendered box is the sum of
several rules and cannot be decomposed by arithmetic without guessing. All three errors were
mine, all three were in the shared spec every agent read, and only the two that touched geometry
would have been caught by the height diff — the bracket one would have shipped.

### What pre-fitting bought

Zero wrapping regressions. Every headline and paragraph was measured during prep in the real
rendered face at every tier, so the wave had no copy decisions to get wrong. Contrast with
`/product`, where the equivalent bug was mine and cost 645 shifted elements.

Two strings needed *lengthening*: the services intro had to clear 5 lines at 358 while staying
at 3 at 540, a window of about 30 characters, and landed at 215.

### Reconciliation: what only the orchestrator could see

- **Heading outline skipped a level.** All four band headings shipped as `h3` under the hero's
  `h1`, matching the target and matching `/product`. That is a WCAG 1.3.1 defect. Promoted all
  four to `h2`, which costs **zero pixels** because the visual preset is unchanged. `/product`
  still has the same defect; not fixed here, out of scope, worth doing.
- Unit C dropped a Framer wrapper with a single `w-full` child, where row-vs-column and `gap`
  are both no-ops. Accepted: zero layout effect.
- Unit D tinted `monday.com`'s three brand fills to `ink` so the band stays monochrome, after
  checking the reference screenshot to confirm rogo's investor marks are near-black rather than
  the grey `ClixLogoProof` uses. Accepted.

### ⚠️ Contrast: this page reproduces a target failure, and that needs a decision

`CompanyServices`'s intro is `muted #737373` on `bone #f5f2eb` = **4.24:1**, and `CompanyTools`
sits on `surface #f5f5f5` = **4.35:1**. Both **fail AA for normal text** (4.5 needed). These are
the target's own colours, measured, so 1:1 fidelity and
`docs/reference/accessibility-spec.md`'s mandatory floor are in direct conflict here.

No new failing *pair* was introduced — both were already on the repo's list of three awaiting a
call — but this page adds new *uses* of them. Not resolved unilaterally, because "match the
original exactly" is the project's first requirement and darkening the text is a visible
deviation. **The user's call.**

### ⚠️ The document is 43.8px taller than the target, and none of it is this page

At 1440 our doc is 5093 against the target's 5050; at 390, 7795 against 7561. `<main>` matches
to 0.00px at both, so the entire delta is the shared `Footer` — 596.19 against 552.39, and
1343.23 against 1109.23. It is that much taller on **every** route, almost certainly
`FooterMap.tsx`'s Google Maps embed, which rogo's footer has no equivalent of. Pre-existing and
out of scope, but it means no page in this repo currently matches the target's total height.

### Smaller findings worth keeping

- **`--window-size` is not a valid phone capture on Windows** (Unit A). Chrome clamps the window
  to an OS minimum near 500px, lays the page out at that width, then crops the PNG to 390 from
  the left. The result reads as content shifted right and clipped: a convincing false positive
  for a layout bug. Use `Emulation.setDeviceMetricsOverride`.
- The `/company` video needs no reduced-motion special case because it is click-to-play. Worth
  noting that `globals.css`'s rule targets `.hero-video` only and would not have covered it.
- The clip carries **no audio track** (`webkitAudioDecodedByteCount` 0), so leaving it unmuted,
  faithful to the original, cannot surprise anyone.
- Unit E flagged that while the placeholder photograph passes under the nav bar, the bar paints
  dark glyphs on a dark image. It is `data-nav-theme="light"` per spec and the ancestor always
  shadows a nested marker (`Nav.tsx:322-330` breaks on the first box spanning the bar). Only a
  problem while the placeholder is in place; the fix is the real photo, not a DOM change.
- **The other session's `/careers` work shares this working tree.** Its `src/components/careers/`
  had a `TS1149` casing collision mid-wave (`CareersRoles.tsx` importing `./careersRoles`, which
  resolves case-insensitively back to itself) and briefly blocked a repo-wide build. It resolved
  on its own. Nothing here depends on it except Block 5's `/careers` link.

---

## 2026-08-12 — Prep: capture, measure, fit

### The capture did not exist

`docs/reference/target/` held home, felix and product only; a repo-wide grep for
`rogo.com/company` returned nothing, and `docs/SECTIONS.md:104` still listed `Company` under
"Other pages, still not scoped". So prep started one step earlier than the last three builds:
plain Node `fetch`, saved whole, five inline `<style>` blocks concatenated, dated filename
per `docs/reference/target/README.md:53`. Result: 381 KB HTML, 146 KB CSS, 272
`data-framer-name` values.

### The page is SIX bands, not the five the screenshots suggest

`Video` is a **sibling** of `Hero`, not a child, the same shape as `/product`'s Block 1. Missing
that would have nested the video inside the hero's padding and moved everything below it.

### ⚠️ Rule 1 from `block-diff.js` is not a safe tree-walk filter

The first structural probe reported the `Video` band as **having no children at all**. It has
five. Between the band and its content sits a **0×0 Framer wrapper**, and filtering every node
on `getBoundingClientRect().width > 0` discarded it *and its entire subtree*.

That filter exists to stop you measuring Framer's hidden tier variants, and it is right for
**queries**. It is wrong for **walks**: a zero-size parent can hold visible children. Walk
unfiltered, then test visibility per node. Same lesson shape as `/product`'s "byte offsets give
document order, never nesting".

### The border matrix is uniform, which was worth checking rather than assuming

`sections/Security.tsx` needed a hand-authored per-cell, per-tier border string, so the
expectation was more of the same. It is not: **every** `Team` tile is `border-top + border-right`
and **every** `Investors` tile is `border-top + border-left`, at all three tiers, colour
`#73737326` throughout. One class string per grid, no matrix.

Read via the `--border-*-width` custom properties, not `borderWidth`. Framer paints these with
`[data-border]::after`, so a normal computed-style read returns `0px` and tells you nothing.

### Headlines use HARD breaks, not natural wrapping

The captured text of three h3s concatenates without a space: `"Building The Best AI"` +
`"Analyst On Wall Street"`, `"Supported By"` + `"World-Class Investors"`, `"Join a World-Class
Team"` + `"Rethinking Finance"`. That is a forced break, so the line count is fixed by the
markup and each **line** has to fit, rather than the string hitting a wrap count. `Team`'s h3 is
the exception and wraps naturally into 2.

### Copy was fitted by rendered line count before any agent ran

The `/product` regression was mine: a stepper title 62 characters against the capture's 63, well
inside the 10% rule, wrapped to three lines at 390 where the capture takes two and pushed 645
elements down the page. So this time the orchestrator fitted every string during prep and handed
the agents final text, removing the failure mode from the parallel wave entirely.

Fitted against **our** face, not the target's: rogo sets headlines in ABC Arizona Mix, we map
`--font-display` to Discovery, and different faces break differently. The harness **creates its
own probe element** rather than querying one, which is what stops it repeating `/product`'s
second mistake, where `section h3` matched the full-width intro instead of the 472px column.

Every fitted string reproduces the target's measured height exactly, e.g. h1 `167.2 / 68.4 /
182.4`, services intro `70.2 / 62.4 / 104`.

Two strings needed lengthening, not shortening. The services intro is the interesting one: it had
to be long enough for 5 lines at 358 while still 3 at 540, a window of roughly 30 characters.
Landed at 215.

### Stock photo: both sources refused, so the slot ships a documented placeholder

CLAUDE.md §7 caps decorative-asset work at two candidate sources. Pexels returned **403** and
Unsplash **401** to a plain fetch. Per the rule, stopped rather than trying a third, and asked
the user.

Meanwhile the slot is filled from an asset already in the repo: a frame at t=4.5s from
`public/video/hero-tel-aviv.mp4`, cropped `1920x758` and graded once
(`saturation 0.55, contrast 1.04, brightness 0.02`) because the ungraded sunset was far too
saturated for a page that is otherwise white, bone and grey. Written to
`public/company/tel-aviv-band.jpg`, 199 KB.

It is **Old Jaffa, a landmark, not a team photograph**, and it reads oddly under a heading about
joining the team. Named for what it is rather than what it stands in for. Replace it when a real
photo exists.

### Two assets brought back from the dead

`public/video/hero-tel-aviv.mp4` and its poster were **6.9 MB of unreferenced dead weight**
(`public/README.md` still claimed the mp4 was "in use"; `Hero.tsx` moved to `hero-israel.mp4` on
2026-08-09). This page's Block 1 video and Block 5 band now both come from that file.

### Measured facts that shaped the build

- Hero top padding is `198px` at every tier, so the nav is **fixed** and takes no `spacer`, as
  on `/product`.
- The stage sets explicit `order` 0..5 below 1200, but the values match document order, so
  **nothing reorders** and `<main>` needs no `order-*` classes.
- **1600 and 1440 are identical in every measured value**, so no `xl:` variant is used.
- Row → column switch is at **1200** for `Mission`, `Team`'s inner container and `Reiteration`.
- Both CTAs are **36px tall**, not the 40 the outer frame suggests.
- `Team` goes **4 → 4 → 1** columns. There is no 2-column tier.
- The eyebrow labels ship `letter-spacing: normal`, a real exception to DESIGN-SYSTEM.md's
  "all negative, never ship 0".
- There is **no wordmark overlay** on the video; the "rogo" over the skyline is baked into the
  video frame itself.

---
