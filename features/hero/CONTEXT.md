# Context: Hero

Memory for this section. **Newest entry on top.** Append after every task — never rewrite
past entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold,
with no code scanning.

---

## Current state

> **The headline and tagline are clix's own as of 2026-08-04, not the target's.** The h1
> max-widths in `FEATURE.md`'s layout table are consequently superseded — see the log entry
> below and the deviations section.

Built and rendering at all four tiers. Every measured value was verified against the
capture via Chrome DevTools Protocol at exact viewports — evidence in
`assets/measurements.json` and `assets/render-*.png`. No horizontal overflow at any width;
`npm run build` clean.

Background is a **four-clip Israeli sunset montage** — Tel Aviv skyline silhouette, Jaffa
port, aerial sun, residential towers — crossfaded and loop-sealed to 15.015s. Sources were
chosen by the user. It replaced the Tel-Aviv-skyline-plus-flag composite on 2026-08-02;
**there is no flag any more**, so `object-position` is back to the target's own `50% 50%`
at every tier and the hero carries no crop-anchor deviation. See the latest log entry.

> **Assets referenced in older log entries below are now local-only.** As of 2026-08-02 the
> raw source clips (`assets/*.mp4`), our render screenshots (`assets/render-*.png`) and the
> target's own `public/video/hero-original.*` are `.gitignore`d — they still exist on disk
> but are not in the repo, because the running site never loads them and they were 19.4 MB
> of a 29 MB tree. `assets/measurements.json` **is** tracked. Log entries below still name
> those files; that is history, left intact deliberately.

**Status:** `review` — *not* `done`. Two acceptance rows are unticked because the values
cannot be observed from the capture: CTA hover/active styling, and any hero entrance
animation. Both need a look at the live site.
**Next action:** observe CTA hover + entrance motion on rogo.ai, then close out.

---

## Log

### 2026-08-04 — headline + tagline replaced with clix's own copy

**Trigger:** user — *"ok now lets start editing the tagline"*, then, from five candidate
pairs, *"i want the 3 but all should be english first"*.

**Shipped**

```
HEADLINE_A  You bring the business.
HEADLINE_B  We bring the intelligence.
TAGLINE     AI agents, automations and custom software, built around how your
            team already works.
```

Both lines are English renderings of what the real company site already says in Hebrew —
the headline is its closing CTA, *אתם מביאים את העסק. אנחנו מביאים את הבינה.* Source:
`docs/reference/clixsolutions/`, captured 2026-08-04.

**"English first" is a decision, not a default.** The real site is Hebrew-only, `dir="rtl"`.
The user chose English as the primary language for this build. A Hebrew variant is a separate
job and **is not served by translating these two strings in place** — it needs `dir="rtl"`,
logical properties throughout, and a sign flip on the carousel's `xPercent` (positive `x`
still moves right under RTL; GSAP does not auto-flip).

**Measurements — why the h1 box grew**

The copy is two sentences, and left to the shaper it broke badly at both ends: at 1440 the
second sentence split between article and noun ("We bring the / intelligence."), and at 390
the sentence boundary landed *mid-line* ("business. We"). Fixed with an authored `<br>` plus
wider caps. Measured unwrapped in-browser at the real face and `-0.05em`:

| Tier | size | "We bring the intelligence." | old cap | new cap | result |
|---|---|---|---|---|---|
| Desktop/XL | 64px | **637px** | 600 | **648** | 3 lines → **2** |
| Tablet | 56px | **558px** | 370 | **568** | one sentence per line |
| Phone | 48px | **478px** | 300 | **344** | 4 lines, but 2 per sentence |

**Phone cannot fit a sentence per line at any cap** — 390 viewport − 32px side padding =
358px usable against a 478px sentence. Its 344 buys better ragging only; recording this so
nobody later "fixes" the phone tier by widening the box further and wonders why nothing
changes. Tagline caps (`350/350/350/300`) untouched.

**Verified:** rendered at 1440 and 390 and looked at both; line counts read from Range rects,
not estimated from character counts. `tsc --noEmit` clean, `eslint` clean on `Hero.tsx`.
`npm run build` **not** run — the dev server holds `.next`; nothing structural changed.

**Open:** the tagline is 84 chars and sets to 3 lines in the 350px box at every tier. It fits
and it reads, but it is a denser block than the target's two-liner. Worth a look if the user
wants the hero lighter.

### 2026-08-02 (latest) — Darken tier bug fixed; Logo Carousel wired in

**Trigger:** extracting the Logo Carousel's CSS surfaced `.framer-e39ygh` — the hero's own
`Darken` layer — and its tier mapping did not match what we had shipped.

**The bug.** We had:

| tier | ours (wrong) | capture |
|---|---|---|
| ≤809.98 | 80% | **85%** |
| 810–1199.98 | 85% | **80%** |
| ≥1200 | 85% | 85% |

i.e. **backwards on both tiers it touched**. The capture declares `85%` as the *base* rule
and overrides it to `80%` inside `@media (min-width:810px) and (max-width:1199.98px)` only —
it is not a phone-vs-desktop split, which is how it had been read. Fixed in `globals.css`.

Worth noting how it survived a CDP verification pass: the earlier check confirmed *layout*
values at each viewport, and a gradient stop inside a `.4`-opacity overlay is not a layout
value. Colour-ish properties need reading off the stylesheet, not measuring off the render.

**Logo Carousel wired in.** It belongs *inside* this section — `absolute bottom:0;
height:248px` within `<section id="hero">`, not a sibling. Placed after `.hero-darken` and
before the copy so the logos paint above both the scrim and Darken (undimmed) but below the
headline. See [features/logo-carousel/CONTEXT.md](../logo-carousel/CONTEXT.md).

`npm run build` clean.

---

### 2026-08-02 — copy scrim added over the montage

**Trigger:** user — *"add a bit of bg color so its not text directly above image"*.

Added `.hero-scrim` as a **new element** between the media and `.hero-darken`, rather than
strengthening `.hero-darken`. Deliberate: `.hero-darken` reproduces the target's own overlay
exactly (`linear-gradient(180deg,#15151500 85%,#151515 100%)` @ `.4`), and folding our
correction into it would destroy a faithful value and make the deviation invisible to anyone
diffing against the capture. Two layers can be tuned independently; one cannot.

```css
.hero-scrim {
  background:
    radial-gradient(ellipse 78% 58% at 50% 44%, #15151573 0%, #15151500 70%),
    linear-gradient(180deg, #15151538 0%, #1515151f 50%, #15151538 100%);
}
```

- **Elliptical pool at `50% 44%`** — centred slightly *above* middle because the copy stack
  (headline + tagline + CTA) sits above centre once the section's `pt-[156px]` is accounted
  for. Gives the type its own ground wherever the footage is bright.
- **Light full-bleed dim weighted to the edges** — without it the pool reads as a visible
  blob against bright corners. Edge 0.22 / centre 0.12 is enough to hide the seam.
- Ink at zero alpha (`#15151500`), never `transparent` — same interpolation trap as
  `.hero-darken`; `transparent` would fade through rgba(0,0,0,0) and grey the gradient.

**Why the original doesn't need this.** Its NYC footage is dark through the band the copy
occupies, so a bottom-only gradient is sufficient. Our montage is not — the aerial-flare
segment puts near-white sky directly behind white 64px display type. This is a consequence
of the content deviation, not an independent design change.

First values (radial `0.55`, linear `0.30/0.18`) were walked back to `0.45 / 0.22/0.12`:
the user said "**a bit**", and the first pass read as a dark panel rather than a scrim.
Not yet seen by the user — expect a further nudge in one direction.

Logged as a deviation row in FEATURE.md. `npm run build` clean.

---

### 2026-08-02 — flag dropped; background is now a four-clip sunset montage

**Trigger:** user supplied four Pexels URLs — *"i want this to be in the hero section like a
smooth montage or compilation of it"*. This supersedes the flag composite entirely.

**Sources are the user's choice, so no sourcing work was done.** All four are Pexels,
free for commercial use, no attribution: `854738` (Tel Aviv skyline silhouette),
`18809616` (Jaffa port + St Peter's clock tower), `7259536` (aerial, sun on horizon),
`6618225` (drone over residential towers). Two are 4K, all 16:9 — scaled to 1920×1080,
no cropping needed except clip 1.

**Assembly.** 4 segments × 4.95s, 1.2s crossfades. Output duration is `4·(d−x)` = 15.015s /
360 frames at 24000/1001 — which matches the target's own container spec (15.098s / 362
frames) closely enough to be a non-issue.

**Ordering is tonal, not chronological:** dark silhouette → warm port → bright flare →
golden towers → wraps to dark. Adjacent segments were paired on luminance so each crossfade
blends rather than jumps.

**Two fixes, both visible in frames rather than measured:**
- Clip 1 has a **foreground obstruction riding the left edge** (pole or building corner,
  ~50px at 1920, drifting). `crop=1810:1018:110:31` then rescale — a 6% zoom, invisible.
- Clip 3 reads **cooler and hazier** than the other three; in a montage it was the obvious
  odd one out. Warmed with `colorbalance=rs=0.03:rm=0.05:bm=-0.05:bs=-0.04` plus
  `eq=brightness=-0.045:saturation=1.12`.

**The loop seal is the reusable bit.** A plain A→B→C→D montage hard-cuts at the wrap. Split
the assembled montage, crossfade its first 1.2s over its last 1.2s, then trim that head off.
The final frame then lands on what the first frame already is, so `loop` is invisible:

```
split -> [ma]trim=1.2:16.2  [mb]trim=0:1.2
[ma][mb]xfade=transition=fade:duration=1.2:offset=13.8
```

**`object-position` deviation removed.** The phone-tier `78% 50%` existed only to keep the
old right-edge flag in shot below 810px. No flag, no edge-anchored subject — reverted to
`50% 50%` at every tier in `globals.css`, so the hero now tracks the target exactly here.
This closes a documented divergence rather than opening one.

**Why the flag is gone.** Two sources were tried and both fail structurally, recorded so
nobody retries them: the CG flag on a pole (pixabay 310215) has a free edge that swings
588px in source space, so no fixed crop holds the frame edge — measured coverage of the
right strip ranged 0–100% across the clip; and the frame-filling close-up (mixkit 18072)
has no fabric edge of its own, so any crop reads as a pasted rectangle. The user resolved
it by changing the brief to sunset footage.

**Process note.** The preceding flag/dusk work badly overran — eight stock sites scraped and
several bespoke measurement harnesses written for what is a *background asset*. The user
called it out (*"you are overstepping and overcomplicating yourself"*) and CLAUDE.md §7 now
carries a hard ceiling for decorative assets: 2 sources, 2 iterations, no analysis scripts,
show early. This montage was built inside that ceiling — one contact sheet to pick segments,
two encodes, done.

`npm run build` clean. **Open:** the user has not yet seen it running; grade is one pass and
may want to go warmer/darker.

---

### 2026-08-02 — background replaced with Tel Aviv; flag composited *(superseded above)*

**Trigger:** user — *"the background is not even a city i want it tel aviv"*. Correct.
The reference is a **city skyline**; the clouds-and-flag clip matched its tone but not
its subject. Reframing a sky clip was never going to fix that.

**Sourcing.** Pexels and Pixabay now return **HTTP 403** to scripted page fetches, so the
route used earlier in the project is dead — the previously downloaded `videos.pexels.com`
CDN files still resolve, but search does not. Coverr and Mixkit still serve. Coverr's
entire Tel Aviv catalogue is **4 clips**; Mixkit adds a few (720p only — their 1080p
returns 403). Chose **Coverr `tel-aviv-drone-view-7113`** (1920×1080, 16.3s): the only
candidate that is a *level horizon skyline* rather than a top-down aerial, and the tower
cluster is unmistakably Tel Aviv.

**Framing.** `crop=1420:799:500:120` onto the Azrieli/Sarona cluster with the
Mediterranean behind, upscaled to 1920×1080 (1.35×). Its natural structure — bright sky
band on top, dense dark city through the middle — maps onto the reference's own profile,
which the clouds clip could not do at all.

**Grade — same band metric as before** (y 33–58%, x 28–72%):

| | band mean | contrast vs white | global lum |
|---|---|---|---|
| reference | 55.5 | 11.77:1 | 67.7 |
| first attempt (too dark) | 35.1 | 15.63:1 | 37.0 |
| second (too bright) | 96.7 | 6.19:1 | 96.9 |
| **shipped** | **60.3** | **10.93:1** | **71.3** |

Took three sweeps. The band and the global figure pull in opposite directions under a
plain curve, so the gaussian dip at y=0.46 had to go to depth **0.40** — it darkens the
copy's band without flattening the whole frame.

**The flag composite finally worked — and here is why.** The three rejected attempts
logged earlier all tried to key a *real* flag out of a *real* sky, which needs a matte
free stock does not ship. The CG clip `flag-310215` is on a **pure black** field:
measured max 0–1 across the background, while the darkest flag pixel is 44. So
`a = clip((max(r,g,b) - 2) * 12, 0, 255)` is a clean matte with no keying artefacts at
all. **This does not reopen the real-flag route** — that still needs a real matte.

Composite decisions:
- **`hflip` the flag layer.** The pole sits on the hoist side; mirroring throws it
  off-frame right and puts the wavy free edge inward, which is exactly how the
  reference's flag reads. The first composite left a bright white pole mid-frame and
  looked instantly CG.
- **Scale matters more than expected.** At 2100px wide the visible slice was so
  magnified it stopped reading as a flag — just abstract stripes. 1500px shows field,
  both bands and the star.
- Softened into the plate: `gblur=sigma=7`, saturation 0.30, lifted blacks
  (`curves 0/0.08`) for atmospheric haze, and `aa=0.90` so it is not fully opaque.

**Phone anchor re-measured and changed 68% → 78%.** The flag's left edge is at **73%**
of frame width, not the 69% estimated from the previous clip — found by scanning columns
for the blue-vs-red departure, since the warm grade makes it invisible to a plain
saturation test. At 390×844 the video scales to 1501px wide; a 68% anchor left only a
49px sliver of flag. 78% puts the window at 867–1257 and leaves ~160px.

**Verified:** all four tiers via CDP, `overflow=false`, every measured layout value
unchanged. `npm run build` clean. Renders refreshed; the source clip is kept at
`assets/source-telaviv-coverr-7113.mp4` since Coverr search may not stay scriptable.

**Note on encode cost:** two `geq` passes at 1080p over 420 frames took **~3m50s**. Budget
for that before iterating on the video chain — iterate on a single extracted frame instead,
which is what the grade sweeps above did.

**Still open:** CTA hover/active and entrance motion — unchanged, still need the live site.

---

### 2026-08-02 (later) — background reframed to match the reference composition

**Trigger:** side-by-side comparison of our render against the reference showed the
section reading completely differently despite every *measured* value matching. The
markup was never the problem — the background asset was.

**Root cause, measured.** A 6×3 luminance grid over both frames (sharp; note
`.stats()` ignores `.extract()` unless the region is materialised to a buffer first —
the first pass silently reported the global mean in all 18 cells):

| | top row | middle row (text band) | bottom row |
|---|---|---|---|
| reference | 148 143 126 120 · 60 59 | 48 53 46 46 · 24 24 | 74 68 59 54 · 20 45 |
| ours (was) | 42 65 73 63 · 42 40 | 45 60 46 50 · 66 47 | 43 60 **73 88** 67 44 |

The reference is **brightest at the top and darkest exactly where the copy sits**,
with the flag a dark cropped mass at the right edge. Ours was **brightest at the
centre-bottom** — the flag was dead centre, directly behind the headline, tagline and
CTA. Inverted tonal structure.

**Fix — reframe, not recomposite.** The source (`pex-36392473`) has the flag centred
at x 560–1320, y 340–740 with the pole at its left. Chain:
`hflip` (puts the pole on the right so it crops away) → `crop=856:482:0:299` →
`scale=1920:1080` → `gblur=sigma=2`. Result: flag enters from the right edge at 70%
of frame width, no pole, empty sky across the centre-left. **No compositing was
attempted** — the 3 rejected matte experiments from earlier still stand.

**Grade — calibrated against the reference, not by eye.** Target metric was the band
the copy actually occupies (y 33–58%, x 28–72%):

| | band mean | band max | contrast vs white | global lum |
|---|---|---|---|---|
| reference | 55.5 | 244 | 11.77:1 | 67.7 |
| previous shipped | 56.9 | 162 | 11.57:1 | 56.4 |
| reframe, linear ramp 0.50 | 37.1 | 65 | 15.31:1 | 37.7 — muddy |
| **shipped (`var-f`)** | **55.1** | **86** | **11.86:1** | **67.1** |

A **linear** top→bottom ramp could not hit both numbers at once: matching the band
made the whole frame muddy. The reference's bright-top/dark-middle split is *scene
content* (sky above a dark skyline), which a clouds-only clip cannot reproduce. Used
a gaussian dip centred at y=0.46 (σ=0.26, depth 0.26) plus a light 0.10 linear ramp —
this mimics the dark skyline band directly. Warmth via `colorbalance`
(`rm=.10 bm=-.10`) since the reference is warm (R73 G66 B65) and ours was cool
(R48 G58 B60). Saturation 0.58 keeps the stripes **navy, not maroon** — the failure
mode of the very first grade.
File: 1.37 MB (was 1.63).

**Regression caught at 390 and fixed.** With the flag now at the right edge, the
cover-crop removed it entirely on phone: at 390×844 the video scales to **1501px**
wide, and the flag's left edge (70% → x 1051) lands past the 390px window. The tier
rendered as clouds only — no flag at all. Added `.hero-media` / `.hero-video` crop
anchors in `globals.css`: `68% 50%` below 810px, `50% 50%` above. Inline
`objectPosition` / `backgroundPosition` had to come **out** of `Hero.tsx` or they
would have won over the media query.

**Deviation logged.** The target uses `50% 50%` at every tier. The per-tier anchor
exists only because our substitute clip is edge-weighted; it is a consequence of the
approved flag departure, not an independent choice.

**Unchanged and re-verified:** all four tiers, `overflow=false`, every measured value
identical to the previous pass (padding, gaps, h1 64/64/56/48, max-widths, CTA).
`npm run build` clean. Renders in `assets/` refreshed.

**Still open:** CTA hover/active and entrance motion — unchanged, still need the live
site.

---

### 2026-08-02

**Done**
- Measured the hero end to end from `docs/reference/target/`; wrote FEATURE.md.
- Built [Hero.tsx](../../src/components/sections/Hero.tsx); wired into `src/app/page.tsx`
  (replacing the temporary scaffold page).
- Added `.hero-darken` to `globals.css` — the gradient needs a media query so it can't be a
  Tailwind utility — plus a `prefers-reduced-motion` rule that drops the video.
- Re-graded the background video for legibility (see Decisions).
- Captured renders at 1600/1440/1024/390 → `assets/render-*.png`.

**Decisions** (what was chosen, what was rejected, why)
- **CTA is a sibling of Title Container, not a child.** Confirmed by walking the close-tag
  sequence after the tagline: `</p></div></div>` then `</div></div>` closes Headline *and*
  Title Container before the CTA opens. So the gap above the CTA is Width Container's
  **48px** (44px phone), not Title Container's 40px. Title Container has a single child so
  its `gap:40px` never applies — reproduced anyway for structural fidelity.
- **Re-graded the video darker after the first build.** The original's footage is a dark
  dusk skyline, so its `Darken` overlay — a *bottom fade only*, transparent until 85% — is
  sufficient there. Our flag footage is bright sky, so white text over the pale flag was
  low contrast. Rather than alter the measured overlay (which would break 1:1), the footage
  was graded to behave like the reference's, pulling highlights down with an ffmpeg
  `curves` pass:

  | | headline-band mean | max | contrast vs white text |
  |---|---|---|---|
  | reference (rogo.ai) | 63.2 | 255 | 3.81:1 |
  | first grade | 71.6 | 216 | 3.39:1 |
  | **shipped** | **51.3** | **157** | **4.62:1** |

  The shipped grade is more legible than the reference itself. File shrank 1.95 → 1.63 MB.
- Poster is painted as a `background-image` on the video wrapper *as well as* the `poster`
  attribute, so the reduced-motion path (video dropped) still shows a frame rather than
  bare `#737373`.
- `#15151500` kept literal rather than `transparent` — `transparent` interpolates through
  `rgba(0,0,0,0)` and would grey the fade.

**Measurements worth keeping** (values that were hard to get, gotchas in the original)
- Section padding is the only property differing across all three tiers:
  `120px 40px 56px` (desktop+) → `120px 40px 40px` (tablet) → `156px 16px 40px` (phone).
  Note the **top** padding *increases* on phone (156 vs 120).
- h1 is `64 / 64 / 56 / 48px`. XL and Desktop share a value — there is no XL-specific hero
  rule at all.
- Wrapper max-widths shrink faster than the type does: `600 → 370 → 300`.
- Darken overlay's first gradient stop is `85%`, but **`80%` on phone**.
- CTA is `44px` tall via its container; the anchor's own padding (`8px 16px`) would give
  only ~36px — the anchor is `height:100%`.

**Verification method** — worth reusing
Chrome's `--window-size` is unusable for breakpoint work: it floors at ~500px and deducts
frame width, so `--window-size=390` produced a **504px** viewport and `1600` produced
**1582**. An early screenshot pass therefore silently never tested the XL tier, and the
"390" shot was really 504 — which also produced a false "content is clipped" reading.
Switched to CDP `Emulation.setDeviceMetricsOverride` for exact viewports.
**Do not trust `--window-size` for breakpoint verification.**

**Skills invoked**
- None auto-fired. `gsap` / `framer-motion` triggers did not match: no scroll-driven or
  state-driven motion exists in this section beyond the looping video.

**Open / deferred**
- CTA hover + active: Framer applies these in JS; no static rule in the capture. A
  placeholder (`opacity .9`, 300ms, site easing) is in place and is *not* claimed to match.
- Hero entrance animation: not determinable from the capture; none implemented.
- Tagline font-size below 1200px: only the desktop/XL variant declares `20px`; the
  tablet/phone variant inherits a preset absent from the capture. Using 20px throughout.
- `Logo Carousel` (`.framer-cdaiag`, absolute, `height:248px`) sits inside the hero in the
  DOM but is registered as its own section — **not built here**.
