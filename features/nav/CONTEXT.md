# Context: Navigation + Banner

Memory for this section. **Newest entry on top.** Append after every task — never rewrite
past entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold,
with no code scanning.

---

## Current state

Built and building clean. Banner + both header layouts (full nav ≥1200, logo + hamburger
below) + a mobile panel + a three-way scroll state. All structural values are measured from
the capture; hover opacity values are estimated and flagged.

**Not yet visually verified against the reference at any tier** — this is the main gap.
The mobile menu panel is invented, because the original never renders it in the capture.
The banner is direction-aware (off on the way down, back on the way up) and independent of
the colour swap — both user-confirmed against the live site.

The bar's palette **tracks the section behind it** (`hero` / `light` / `dark`), driven by a
`data-nav-theme` attribute each section carries. The `light` palette is observed on the live
site; the `dark` one is a user request and **has not been observed** — see the newest log
entry. The colour *trigger point* and all timings are still ours.

**Status:** `review`
**Next action:** compare against the reference at 1600 / 1440 / 1024 / 390; then observe the
live site for the mobile menu, the scroll flip point, and the `Indicator` element.

---

## Log

### 2026-08-03 — bar tracks the section behind it (three-way, not boolean)

**Trigger:** user, looking at localhost scrolled to the footer — *"the navbar is color white
i want the bar to be black when black"*.

**The problem.** The colour flip was a boolean: over the hero → transparent, past the hero →
solid white. That was correct while everything below the hero was light. `security` and
`footer` are both `ink`, so the white bar ended up sitting on a black page.

**Done**
- Replaced the boolean with `NavTheme = "hero" | "light" | "dark"`.
- **Each section declares its own `data-nav-theme`** — `hero` on `#hero`, `light` on
  `testimonials`/`why-rogo`/`by-the-numbers`, `dark` on `security`/`footer`. The nav holds
  no list of section names, so adding a section can't leave it stale; untagged falls back
  to `light`.
- Dropped the `IntersectionObserver` on `#hero`. The theme is now probed inside the
  **existing** rAF scroll pass: find the `[data-nav-theme]` element whose box spans the nav
  row's bottom edge. Sections are contiguous, so exactly one matches.
- Bar background is the only three-way value: `paper` / `ink` / the capture's near-transparent
  at-rest fill (`rgba(21,21,21,0)` at ≥1200, `rgba(21,21,21,0.01)` below).

**Decisions**

- **`dark` reuses `hero`'s content palette exactly** — white logo, white links, `paper`-fill
  `Request Demo`. So one `light` boolean still drives every text, ring and border class and
  only `background-color` branches three ways. Renaming `scrolled` → `light` was a
  same-polarity swap, which kept the diff to the state machine rather than the markup.
- **Probe replaces the observer rather than joining it.** The old `rootMargin: -navH` was
  already "is the boundary above or below the nav's bottom edge"; the probe asks the same
  question of every section instead of just the hero, so **the flip point is unchanged**.
  One mechanism, not two.
- **Merged into the banner's rAF**, not a second listener: both answers need `navH` and the
  current scroll position, so splitting them would measure the same boxes twice a frame.
  The section list is cached and only re-queried on resize.
- **The nav height is re-read every frame** rather than cached with a resize handler. It is
  two `offsetHeight` reads on elements already in the layout pass; caching it was what made
  the old observer need its own `arm()`/resize plumbing.

**Verified** — CDP sweep at 1440 and 390, sampling the middle of every section plus 40px
past each boundary (12 points per tier, 24 total). Every one matches the section's declared
theme on **both** the bar's background and the logo's colour:
`hero` → `rgba(21,21,21,0)` / `rgba(21,21,21,0.01)` + white logo · `light` →
`rgb(255,255,255)` + `rgb(21,21,21)` logo · `dark` → `rgb(21,21,21)` + white logo.
`tsc --noEmit`, `npm run build` and `eslint src` all clean. Looked at over both dark
sections at 1440.

**Open** — **not observed on the live site.** The screenshot that gave us the light scrolled
state was taken over `testimonials`, which is light; rogo.ai's behaviour over its own dark
`security`/`footer` is unknown. If it keeps a white bar there, this is a deliberate
divergence rather than a clone. Recorded as one in `FEATURE.md`.

### 2026-08-03 — banner hide eased too

**Trigger:** user — *"when the black section is collapsing or hiding add the smooth
animation to it as well"*.

**Done**
- Dropped the scroll-tracked hide. Rule is now `shift = (down && scrollY > 0) ? bannerH : 0`
  with `transition-transform 300ms var(--ease-rogo)` applied unconditionally, so both
  directions animate identically.
- The `scrollY > 0` guard matters: `down` initialises to `true`, so without it a fresh load
  at the top would render with the banner already collapsed.
- Dropped the `revealing` state that gated the transition — no longer needed.

**Decision — two-position animation, not scroll-tracking.** The previous
`min(scrollY, bannerH)` hide was the more literal model (a banner behaving as though it
weren't in the fixed box) but it ties the motion to scroll velocity, which reads as a jerk
at the top of the page. Symmetry with the reveal wins.

**Verified** — sweep at 1536 sampling at t+120ms and settled:
- hide, +120ms: `-4.32`. A 300ms `cubic-bezier(.44,0,.56,1)` at t=0.4 gives 0.096 →
  45 × 0.096 = 4.3. So the curve is the one we think it is, not a linear fallback.
- reveal from depth (y=900, scrolling up): `-45` at +120ms, settled `none`.
- y=0 on load: `none` — never starts collapsed.
- `npm run build` clean; `eslint` clean in `src/`.

**Open** — 300ms is still an estimate, now for both directions.

### 2026-08-03 — banner reveals on scroll up

**Trigger:** user — *"when i scroll up the black section in the navbar appears again"*,
confirming the direction-aware behaviour flagged as open in the previous entry.

**Done**
- `shift = down ? min(scrollY, bannerH) : 0`. One expression covers both halves: going down
  it still scrolls off naturally near the top and stays off; going up it returns to 0 at any
  depth. 4px deadzone on the direction test so inertial jitter cannot flip it.
- Transition applied **only while revealing** (300ms `--ease-rogo`). Down, `shift` follows
  the scrollbar and an ease would lag it; up, `shift` jumps 45 → 0 in one frame and needs it.

**Verified** — CDP sweep at 1536, down then up then down:
| | y | transform | banner bottom |
|---|---|---|---|
| down | 200 → 1057 | `-45` | 0 (off) |
| up | 900 | `none` | 45 (back, deep in the page) |
| up | 200 → 0 | `none` | 45 |
| down | 30 | `-30` | 15 (mid scroll-off) |
| down | 300 | `-45` | 0 |

The y=1000 sample also caught the colour crossfade in flight — `rgba(255,255,255,0.9)`,
logo `rgb(28,28,28)` — which is the 300ms transition being sampled, not a wrong value.

`npm run build` clean; `eslint` clean in `src/`.

**Open** — reveal timing is still an estimate, and whether the original requires a minimum
up-distance before firing is unknown (our 4px deadzone is an anti-jitter choice, not a
measurement).

### 2026-08-03 — banner decoupled from the colour swap

**Trigger:** user — a rogo.ai screenshot showing the header **already light with the banner
still on screen**, *"the black section should be hidden when i scroll"*.

**The finding.** That frame is impossible in our build, which is how we know it is the live
site and not ours: banner-away and colours-light were welded to one boolean, so no scroll
position could produce one without the other. Swept 0→1057 at 1536 and 1920 to confirm —
transform and background flip on the same row of the sweep, every time. **The two are
independent behaviours on the original.**

**Done**
- Banner now tracks scroll on its own: `translateY(-min(scrollY, bannerH))` on the fixed
  header, driven by a rAF-throttled passive scroll listener. It is gone by 45px of scroll
  and returns only as you come back to the top — i.e. exactly as if it were not inside the
  fixed box. No threshold, nothing to tune.
- **Not transitioned.** It follows the scrollbar; an eased transform would just lag it. The
  colour swap keeps its 300ms crossfade.
- `aria-hidden` + `inert` moved from the colour flag to `bannerGone`.
- Colour swap still fires on the hero boundary, unchanged.

**Verified**
- Re-swept at 1536: banner off from y=200 onward, bar still `rgba(21,21,21,0)` and logo
  still white through y=900, both flipping at y=1000 as the hero's bottom reaches the nav.
- `tsc --noEmit` and `npm run build` clean.

**Open**
- The live frame had the banner *present* at testimonials depth, where scrolling down had
  already removed it — that points at a **direction-aware header** (scroll up → banner
  returns). Not implemented; ours only restores it near the top. Worth one look on the
  live site before deciding.

### 2026-08-03 — scrolled state

**Trigger:** user — a screenshot of localhost beside one of rogo.ai, both scrolled into the
testimonials block, *"look at the difference"*.

**The difference.** The section itself matched (card edges within ~4px, identical quote line
breaks, identical type). The header did not: ours stayed in its at-rest state — banner still
pinned, white text on a transparent bar — so over `canvas` `#f7f7f7` the whole nav was
effectively invisible. The real site had no banner and a solid white bar with dark content.

**Done**
- Added a `scrolled` flag to `Nav.tsx` and the full palette swap in `FEATURE.md`'s new
  "Scrolled state" table. Banner slides away with the header; colours crossfade.

**Measurements worth keeping**

- **The capture proves a second nav variant exists and withholds every value in it.** The
  rendered nav is `.framer-2f1yb.framer-v-174l6nt` (`data-framer-name="Transparent Dark"`);
  the stylesheet also carries `.framer-2f1yb.framer-v-yxrzsa`, and the *entire* delta
  between them is `overflow:visible`. Framer applies variant colours inline from JS, so a
  static capture can never yield them. Same story for the logo — it renders variant
  `data-framer-name="Light"`, implying a dark sibling we cannot see.
- **The banner is part of the fixed block.** `.framer-1lcee9e` is one
  `position:fixed; top:0; overflow:hidden` box holding banner + header, with
  `will-change:transform` on it. So "banner disappears on scroll" is a transform on the
  whole header, not a separate collapsing element. Measured heights: banner 45px,
  nav row 74px (390) / 60px (1440).

**Decisions**

- **One trigger drives both effects** — banner-away and colours-light happen together, off
  an `IntersectionObserver` on `#hero`. Two independent triggers would have been two
  inventions; this is one, and it reproduces both observed states exactly.
- **Flip point = hero bottom reaching the nav's bottom edge**, via
  `rootMargin: -<navHeight>px 0 0 0`. Chosen over a `scrollY > n` threshold because a
  threshold would put a white bar over the dark hero mid-scroll. Not verified.
- **The two header rows are measured separately**, not off the `<header>` box — the open
  mobile panel lives inside that box and would inflate the reading. Exactly one row is
  displayed per tier so the other measures 0.
- **The mobile panel's buttons keep the dark-surface palette** regardless of `scrolled`;
  the panel is `bg-ink` in every state.
- Focus rings flip with the state too — `ring-paper` on the dark bar would vanish on white.

**Verified**
- CDP at 1440 and 390, at rest and scrolled into `#testimonials`. Rest state unchanged:
  `transform:none`, banner visible, bar `rgba(21,21,21,0.01)`, logo `rgb(255,255,255)`.
  Scrolled: `matrix(1,0,0,1,0,-45)`, banner off-screen, bar `rgb(255,255,255)`, logo and
  links `rgb(21,21,21)`, `<1200` border `rgba(168,162,158,0.2)`.
- `tsc --noEmit` and `npm run build` clean.

**Open / deferred**
- Flip point unverified; 300ms/`--ease-rogo` timings are estimates, as everywhere else.
- Whether the scrolled ≥1200 header carries a bottom border — screenshot inconclusive,
  ours has none.

### 2026-08-02 — built

**Done**
- Extracted both `ssr-variant`s of `Navigation + Banner` from the capture and pulled every
  CSS rule touching the 71 framer classes in the block, grouped by media query.
- Vendored the rogo wordmark from the capture's SVG defs (`#svg-124366052_1499`) as
  `src/components/ui/RogoWordmark.tsx`.
- Built `Nav.tsx`: banner (2 layouts), header (2 layouts), mobile panel, both buttons.
- Added `banner` + `hairline-light` tokens to DESIGN-SYSTEM.md and the `@theme` block.

**Decisions**
- **The banner and the header switch at different widths** — banner at 810px, header at
  1200px. Found by mapping every `hidden-*` class back to the media query that hides it
  rather than reading it off the visual. Anyone who assumes a single breakpoint will get
  the 810–1199.98 tier wrong: it has a *centred* banner over a *hamburger* header.
- **Nav links are absolutely centred** (`left:50%` + `translateX(-50%)`), not laid out by
  `space-between`. Deliberate in the original — it keeps the links optically centred on the
  page no matter how wide the button group gets. Reproducing it with `justify-between`
  would drift the links left as the buttons grow.
- **Kept the invisible 8px dot** in the banner (`.framer-pjucs6-container`). It has
  `border-radius:10000px` but no declared fill, so it renders nothing — but removing it
  would close up 18px (8px box + its 10px gap) on every tier.
- **Two coincident bottom borders** on the <1200 header — `#ffffff26` on the outer block and
  `hairline` on the inner row. Both reproduced; they overlay rather than stack because the
  padding lives on the inner element. Looks redundant, is what the capture says.
- **Menu glyph is a *split* two-bar mark**, four subpaths with a gap in each bar — not three
  even lines. Path taken verbatim; drawing three rules would have been a redraw.
- Did **not** extract a shared `Button` primitive yet. The nav button (36px tall) and the
  hero CTA (44px, `h-11`) are genuinely different variants, and retrofitting the hero would
  put its CDP-verified measurements at risk for no gain. Extract at the third use — the
  footer CTA.

**Measurements worth keeping**
- Header inner is `max-width:1280px` = the existing `--container-max`; the 1200px/390px
  widths in the CSS are Framer *canvas* defaults, overridden to `width:100%` inline. Don't
  mistake them for breakpoints.
- Button internals: outer padding `8px 16px`, inner row `height:20px` with `padding:1px 0 0`
  → 36px total. The 1px top pad is an optical nudge for Inter's baseline; keep it.
- Border on both buttons is `1px solid rgba(168,162,158,0)` — present but fully transparent.
  It exists so the box doesn't resize if a state colours it in.
- `hairline` `#a8a29e33` **is exactly** `rgba(168,162,158,0.2)` (0x33 = 51/255 = 0.2). The
  capture writes it the long way in this block; it's the same token, reuse it.
- The banner link's `color .3s cubic-bezier(.44,0,.56,1)` is the **only authored transition
  in the whole capture**. Everything else is Framer Motion in JS and must be observed live.

**Skills invoked**
- None. `gsap` and `framer-motion` triggers do not match: the nav has no scroll-driven or
  mount/exit motion in anything observable. The mobile panel is a plain conditional render;
  if the live site turns out to animate it, `framer-motion` becomes the right tool.

**Open / deferred**
- Mobile menu panel is **invented** — not in the capture. Biggest known divergence.
- Scroll state unknown; the `Transparent Dark` variant name hints at a second state.
- `Indicator` (1px, `left:128px right:195px`, `opacity:0`) not implemented — purpose unclear.
- `Request Demo` has no `href` in the original; ours points at `#request-demo`.
- Not yet compared against the reference screenshots at any tier.
