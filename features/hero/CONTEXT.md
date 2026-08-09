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

Background is **four clips in one file** as of 2026-08-09 — Tel Aviv at dusk with the
Israeli flag → Tel Aviv beachfront from the air → Jerusalem at sunset → Jerusalem at dusk,
then sealed back to the start. 0.6x, 28.7s, 6.0 MB, `public/video/hero-israel.mp4`. All four
sources were supplied by the user. The clip count went 4 (montage, 08-02) → 1 (08-05) → 2 → 3 → 4 over 2026-08-09 alone;
only the last of those is live.

**The flag is back**, so the crop-anchor question is open again: `object-position` is still
the target's own `50% 50%` at every tier, and at 390 the flag is cropped out entirely. See
the 2026-08-05 entry, which measured it. Unresolved, and the user's call.

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

### 2026-08-09 (later still) — a fourth clip; Tel Aviv pair, then Jerusalem pair

**Trigger:** user — *"add the new one i send and push live"*, after *"make the 1st clip the
main one is the one with the flag"* (which needed no change: the flag clip was already first,
verified on frame 0 rather than assumed).

**New source:** `hf_20260809_163705_….mp4` → `features/hero/assets/hero-telaviv-aerial-source.mp4`
(gitignored). Tel Aviv beachfront from the air at dusk — Opera Tower, the coast road, traffic
light trails. 1928×**1076**, 24fps, 8.041667s, 21.3 Mbps. Mean luma **107 → 83**.
`crop=1912:1076:8:0` before the scale: 1928/1076 = 1.792, not 1.778.

**Shipped:** same filename, `public/video/hero-israel.mp4` — still accurate with four clips,
so no rename. 1920×1080, 30fps, **28.7s, 6.0 MB**.

**Order: `flag → TA aerial → Jer sunset → Jer dusk`.** Two cities, two clips each, not a
clock. It satisfies every constraint at once: the flag leads (the user's call, and the poster
argument that already justified it), the Jerusalem pair stays adjacent for the match
dissolve, and the two Tel Aviv shots now sit together too.

The luma curve is the best of the four cuts so far — measured, per second:
`72 71 72 72 71 70 | 84 97 98 97 95 94 92 | 93 95 96 95 94 94 93 | 88 81 78 78 79 80 81 80 | 74`
Junctions: **+27** (flag → aerial), **+3** (aerial → sunset, near-seamless), **−12**
(sunset → dusk), **−8** at the wrap. One notable step, at the first dissolve, and it is the
city lighting up.

**Decisions**

- **The new clip is NOT graded.** It falls 107 → 83 on its own, which lands it right on the
  graded sunset's 95 — hence the +3 junction. Grading it down would have flattened that and
  pushed the step somewhere else. The one big lift is better left in one place.
- **Windows trimmed 6.5s → 5.5s** (`trim=1.0:6.5`). Four clips at the old window is 35.3s;
  this holds the file to 28.7s while still giving each clip 9.2s on screen.
- **crf 27, up from 25.** The aerial is the most expensive clip in the set — traffic light
  trails, surf and window detail — and at 25 the file was **7.8 MB**. 27 gives 6.0 MB.
  Checked for the failure mode that matters rather than assumed: a 1:1 crop of the dusk sky
  at t=9 shows no banding, which is what a dusk gradient at a high crf would show first.
- **Sky banding is now the ceiling on crf, not blockiness.** Worth knowing before a fifth
  clip pushes this further.

**Verified:** loop seal 2.91/255 between frame 0 and frame 860 — better than the three-clip
cut's 3.70, because the shorter window puts a calmer stretch of flag at the seam. Frame 0
confirmed to be the flag clip by eye, not by arithmetic. Build clean; served at 5,987,676
bytes. **Not verified:** still not looked at across the four tiers, and the flag's phone-tier
crop is still unaddressed.


### 2026-08-09 (later) — the flag clip joins; three clips in one file

**Trigger:** user — *"I want all the videos including the clip that has a Israeli flag on it
on the hero section as well. So it's three videos in total."*

**Shipped:** `public/video/hero-israel.mp4` + `hero-israel-poster.jpg`. 1920×1080, 30fps,
**26.5s, 5.2 MB**. Renamed from `hero-jerusalem.*` because the name stopped being true —
those files were minutes old and never committed, so they were deleted rather than left as
a second stale asset. `hero-clix.mp4` is untouched and still serves `/clix`.

**The third clip is the 2026-08-05 master, re-encoded from source** —
`features/hero/assets/hero-clix-source.mp4`, 1920×1076, 24fps, mean luma **70–75**. NOT the
shipped `hero-clix.mp4`, which is already slowed to 0.7× and loop-sealed; running that
through a second slowdown and seal would have compounded both.

**Order is `flag → Jerusalem sunset → Jerusalem dusk`, and it is deliberately NOT
chronological** (that would be sunset → dusk → night). Two concrete reasons beat the
chronology:
1. **The poster is frame 0.** It is what holds the white 64px headline until the video
   streams in, and a dark Tel Aviv silhouette carries that type; clip A's bright sunset sky
   does not.
2. **It puts the gentlest luma step at the wrap** — the one seam that repeats forever.
   Measured final curve, per second:
   `71 72 75 71 73 73 71 72 | 87 97 96 95 94 94 93 92 | 88 81 77 78 78 79 80 81 81 79 74`
   The wrap is 81 → 74 → 71. The one big lift (72 → 97) is mid-file, inside a 2s dissolve,
   where it reads as the light coming up rather than as a jump.

Chronological order was the alternative and loses on both counts: a bright poster, and a
night → sunset wrap.

**The Jerusalem-to-Jerusalem dissolve is still the best thing in the cut** — same landmark at
two distances, so the domes overlap and it plays as a match dissolve. Keeping those two
adjacent was a constraint on the ordering, not an accident.

**Recipe** (two passes, plain ffmpeg — no analysis scripts). Sources trimmed to a 6.5s window
`trim=0.6:7.1` each; then per clip:

| clip | pre-scale | grade |
|---|---|---|
| flag | `crop=1912:1076:4:0` | — |
| Jer. sunset | — | `eq=brightness=-0.08:contrast=1.05:saturation=1.08` |
| Jer. dusk | `crop=1904:1071:0:8` | — |

then all three `scale=1920:1080:lanczos, setpts=1.6666667*PTS, fps=30`, two
`xfade=fade:duration=2` at offsets `8.8333` and `17.6667` → 28.5s at crf 16; then the loop
seal (`trim` 2:28.5 and 0:2, `xfade=fade:duration=2:offset=24.5`) → **26.5s**, crf 25,
`-preset slow`, `-movflags +faststart`, `-an`.

**Decisions**

- **Sources trimmed to 6.5s of 8.04s.** Three full clips at 0.6× is 34s and ~8.5 MB, which
  is too much for a background. The windows drop only near-static drift; nothing in the
  content is lost.
- **crf 25, up from 23.** 23 gave 7.1 MB. 25 gives **5.2 MB / 1.58 Mbps** — lighter than the
  two-clip cut it replaces (5.6 MB) despite being 4s longer and carrying a third clip, and
  the hero paints a scrim and a darken gradient over all of it. The flag is why the bitrate
  matters at all: waving fabric is the only fast motion in the file and it is what the
  encoder spends on.
- **Grade on clip 2 pushed from -0.06 to -0.08.** With the flag clip (luma ~72) now leading
  into it, the ungraded sunset opened a 45-point step. This is the second and final grade
  iteration on this asset.

**Verified:** loop seal measured — frame 0 against frame 794 differ by a mean luma of
**3.70/255**. Higher than the two-clip cut's 1.44, and the reason is knowable rather than
mysterious: the sealed frames now contain a *waving flag*, which cannot align across a
crossfade the way a static skyline does. Still ~1.5% of range and inside a 2s blend, so it
does not read as a cut. Build clean; the served home page carries `hero-israel.mp4` and no
longer references `hero-jerusalem.*` or `hero-clix.mp4`; the file serves 200 at 5,229,103
bytes. **Not verified:** not looked at across the four tiers, and the flag's phone-tier crop
is unaddressed.


### 2026-08-09 — background is two Jerusalem clips, dissolved and loop-sealed

**Trigger:** user — *"i uploaded 2 new videos, for the hero section i want good transition
and dramatic for it specially the speed"*.

**Sources:** `hf_20260809_154758_….mp4` and `hf_20260809_160828_….mp4`, dropped at the repo
root. Both Jerusalem Old City, both 24fps, both exactly 8.041667s, both with an AAC track:
- **A** — sunset, distant and wide, Dome of the Rock small and centre-right. 1920×1080.
  Mean luma **121 → 111** across the clip.
- **B** — dusk, closer, city lights on, Dome large and centre-left. 1904×**1088**.
  Mean luma **76 → 82**.

Moved to `features/hero/assets/hero-jerusalem-{a,b}-source.mp4` — gitignored by
`features/*/assets/*.mp4`, so the masters stay on disk and out of the repo.

**Shipped:** `public/video/hero-jerusalem.mp4` + `hero-jerusalem-poster.jpg`.
1920×1080, 30fps, **22.8s, 5.6 MB**. A NEW filename, not an overwrite of `hero-clix.mp4` —
that file is still the source for `/clix`'s Video block, and overwriting it would have
silently changed a second page. The old hero clip and poster are now referenced only there.

**Recipe** (two passes, plain ffmpeg — no analysis scripts):

1. `[A] scale=1920:1080:lanczos, eq=brightness=-0.06:contrast=1.05:saturation=1.08`
   `[B] crop=1904:1071:0:8, scale=1920:1080:lanczos`
   both `setpts=1.6666667*PTS, fps=30`, then
   `xfade=transition=fade:duration=2:offset=11.4` → 24.8s, crf 16 intermediate.
2. Loop seal — `trim` 2:24.8 and 0:2, `xfade=fade:duration=2:offset=20.8` → **22.8s**,
   crf 23, `-preset slow`, `-movflags +faststart`, `-an`.

**Decisions**

- **0.6x, slower than the 0.7x of 2026-08-05.** "Dramatic, specially the speed" on clips
  that already barely move: the drift has to be slow enough to read as deliberate rather
  than as a still that failed to load. Baked into the file at 30fps for the same reason as
  last time — 24fps × 0.6 in the browser is 14.4fps and judders.
- **A 2s cross-dissolve, and NO dip to black.** `fadeblack` is the more obviously "dramatic"
  transition and it is wrong here: two seconds of black behind the headline is a dead hero.
  The dissolve earns it a different way — the two shots are the same landmark at different
  distances, so it reads as a **match dissolve**, one Dome resolving into the other, and the
  luma falls 95 → 77 across it. Sunset becoming night IS the drama.
- **B's crop is aspect maths, not taste.** 1904/1088 = 1.750, not 1.778, so the frame is
  slightly tall; `crop=1904:1071:0:8` takes 17px off the height centred rather than
  stretching the framing by 1.6%.
- **A is graded down, B is not.** Ungraded, A sits ~40 luma above B: the dissolve would swing
  hard, and the loop wrap (B's end → A's start) would pulse brighter on every cycle. The
  grade closes the gap to ~20 and keeps white type legible through A's bright sky. Measured
  final curve, per second: `103 102 101 100 100 99 98 97 96 95 89 80 77 78 78 79 79 80 81 82
  82 84 94` — one intended fall, no jumps.
- **crf 23, not 21.** 21 gave 7.7 MB. At 23 it is 5.6 MB / 1.98 Mbps — *below* the old clip's
  2.47 Mbps despite being 2.2× longer, and the hero paints a scrim and a darken gradient over
  all of it. 5.6 MB is still the heaviest thing the site serves; that is the price of two
  clips at this speed and it is worth knowing before a third is added.
- **Audio stripped** (`-an`) — the element is `muted`, so the AAC tracks were pure weight.
- **No motion interpolation.** Not tried, and deliberately: `minterpolate` was already
  abandoned once here (2026-08-05), and slow cloud drift is exactly the content plain
  `setpts` handles well.

**Verified:** loop seal measured, not assumed — frame 0 against frame 683 differences to a
mean luma of **1.44/255**, i.e. compression noise, so `loop` does not jump. Build clean; the
served home page carries `hero-jerusalem.mp4` and no longer references `hero-clix.mp4`; the
file serves 200 at 5,633,747 bytes. **Not verified:** not yet looked at across the four
tiers, and the crop keeps the full frame width only at 1600 — the phone tier will crop hard,
same as every previous clip.


### 2026-08-05 — background replaced with a single user-supplied clip, slowed

**Trigger:** user — *"i added the replacement video for the bg make the speed of it a bit
dramatic but use only that clip"*.

**Source:** `hf_20260805_142105_…mp4`, dropped at the repo root. Tel Aviv skyline at dusk
from the water, Israeli flag in the right foreground. 1920×**1076**, 24fps, 8.04s, 12.2 MB
at 12.2 Mbps, **with an AAC audio track**. Moved to `features/hero/assets/hero-clix-source.mp4`
— gitignored by `features/*/assets/*.mp4`, so the master stays on disk and out of the repo.

**Shipped:** `public/video/hero-clix.mp4` + `hero-clix-poster.jpg`.
1920×1080, 30fps, **10.47s, 3.2 MB** — less than half the 6.8 MB montage it replaces.

**Recipe** (two passes, both plain ffmpeg — no analysis scripts):

1. `crop=1912:1076:4:0, scale=1920:1080:lanczos, setpts=1.428571*PTS`, `-r 30`, `-an`, crf 21.
   The crop is aspect maths, not taste: 1076 × 16/9 = 1913, so trimming 8px of width and
   scaling to 1080 preserves the framing instead of stretching it 0.37%.
2. Loop seal — `trim` into head/mid/tail, `blend=all_expr='A*(1-T)+B*T'` the 1s tail over the
   1s head, `concat` mid+blend. Output is `D − t`. Verified by tiling frame 0 against frame
   313: identical flag position, so the loop does not jump.

**Decisions**

- **The slowdown is baked into the file, not `playbackRate`.** Source is 24fps; playing it
  at 0.7× in the browser drops the effective rate to ~17fps and judders. Re-encoding to
  30fps makes it smooth and keeps JS out of the element entirely. 0.7× → 8.04s becomes
  11.47s before the seal.
- **Audio stripped** (`-an`). The element is `muted` anyway, so the AAC track was pure weight.
- **No motion interpolation.** `minterpolate=mci` was tried first and abandoned: it is slow,
  and the fast complex motion of a waving flag is exactly what motion compensation artifacts
  on. The content is otherwise gentle (water, distant skyline), so plain `setpts` at 30fps
  holds up.

**⚠️ The flag is back, and it reopens the crop anchor.** The montage had none, which is why
`object-position` went back to the target's `50% 50%` at every tier on 2026-08-02. Measured
in-browser, `object-fit:cover` now keeps **100% / 90% / 75% / 26%** of the frame width at
1600 / 1440 / 1024 / 390 — so the flag is **cropped out entirely on phone** and partly cut at
1024. Not a bug; `50% 50%` doing as told. Whether to push `object-position` right on the
narrow tiers depends on whether the flag is load-bearing or scenery — **the user's call**,
logged as open in `FEATURE.md`.

**Superseded:** `public/video/hero-tel-aviv.mp4` + poster are now unreferenced (6.9 MB still
tracked). Left in place deliberately — removing them is a separate call.

**Verified:** rendered and inspected at 1600 / 1440 / 1024 / 390; video reports
`paused:false`, `dur:10.47`, `currentSrc: hero-clix.mp4` at every tier.

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
