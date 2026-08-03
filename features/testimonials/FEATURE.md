# Feature: Testimonials

| | |
|---|---|
| Slug | `testimonials` |
| Page(s) | Home |
| Order on page | 4 (after `hero`; the logo carousel is inside the hero, not between them) |
| Status | `review` |
| Reference | `assets/render-1600.png` · `render-1440.png` · `render-1024.png` · `render-390.png` · `render-1440-open-nomura.png` — these are **our renders**, not the target. No reference capture of the target exists at these widths yet; verification so far is against the capture's computed values plus the user's two browser screenshots at ~1536 CSS px. |
| Original Framer name | `Testimonials` — `<section id="testimonials" class="framer-1119het">`, byte 394851 of the capture |
| Component | [src/components/sections/Testimonials.tsx](../../src/components/sections/Testimonials.tsx) · marks in [src/components/ui/TestimonialLogos.tsx](../../src/components/ui/TestimonialLogos.tsx) |

## Purpose

Social proof from three named customers — Truist, Nomura, Baird — presented as a
one-at-a-time accordion. At `≥1200px` it is a three-column row where the open card takes
the space the two closed ones give up; below that it is a vertical stack.

---

## Measured spec

> Extracted from `docs/reference/target/rogo-home-2026-08-02.{html,css}`. Every number
> below has a rule behind it; nothing is sampled from a screenshot.

### Layout

| Property | XL 1600 | Desktop 1440 | Tablet 1024 | Phone 390 |
|---|---|---|---|---|
| Container max-width | 1280 | 1280 | 1280 | `unset` (full width) |
| Horizontal padding | 40 | 40 | 40 | 16 |
| Section padding-top | 196 | 196 | 164 | 128 |
| Section padding-bottom | 80 | 80 | 128 | 128 |
| Columns | 3 (row) | 3 (row) | 1 (stack) | 1 (stack) |
| Column gap | 12 | 12 | — | — |
| Row gap | — | — | 16 | 16 |
| Heading → cards gap | 80 | 80 | 80 | 80 |
| Cards row height | 600 | 600 | `auto` | `auto` |
| Alignment | centre | centre | centre | centre |

**Card widths on the row** — `.framer-b8r25b-container` is `flex:1 0 0`, the other two are
`width:17%`. On a 1280 container with two 12px gaps that resolves to **217.6 / 820.8 /
217.6**. Verified in the browser at 1440 and 1600: `[821, 218, 218]`.

**Card box**

| Property | ≥1200 | ≤1199.98 |
|---|---|---|
| padding | `32px 56px 32px 32px` | `32px` |
| height | `600px` (fixed) | `min-content` |
| vertical distribution | `space-between` | `center`, gap `96px` |
| Quote block internal gap | 56 | 32 |
| Bottom block internal gap | 32 | 32 |
| radius | 6 | 6 |

**Collapsed quote.** The capture does not set the closed quote to zero — it sets
`.framer-yqvu02 { height: 1px }` on desktop and `height: 3px` on mobile, with
`overflow: clip` on the wrapper. Those are Framer's minimums and are reproduced as the
closed-state `min-height`.

### Typography

| Element | Family | Size | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|---|
| Heading | ABC Arizona Mix Regular | **48 / 48 / 44 / 36** | regular | 105% | -0.05em | `ink` |
| Quote | ABC Arizona Mix Regular | **28** (≥1200) · **20** (≤1199.98) | regular | 125% | -0.03em | `ink` |
| Provider name | Inter | 16 | 500 | 1.5em | -0.02em | `ink` |
| Provider role | Inter | 16 | 500 | 1.5em | -0.02em | `ink` @ **opacity 0.4** |

Heading measure is `max-width: 600px` at ≥810, full width below — that 600px is what makes
it break as *"Helping finance teams build / smarter organizations"* rather than one line.

**The quote drops 28 → 20px below 1200.** Easy to miss: the collapsed mobile cards in the
capture still carry `28px`, and only the *open* mobile card carries `20px`. The open one is
the only one that renders, so 20px is the real phone/tablet value.

**The phone heading carries a hard `<br>`** after "Helping finance". Wider tiers do not.

Name and role are both `-webkit-line-clamp: 1` at ≥1200 — that is why the closed cards read
*"International…"* and *"Chief Operatin…"* in the reference. Below 1200 the **role** clamp
is lifted (`line-clamp: unset; white-space: pre-wrap`) and it wraps; the name stays clamped.

### Color & surface

| Element | Property | Value |
|---|---|---|
| Section | background | `#f7f7f7` → token `canvas` |
| Card | background | `rgb(238,237,236)` = `#eeedec` → token `card` |
| Card | radius | `6px` (all four corners) |
| Card | border / shadow | none |
| Plus button | background | `rgba(21,21,21,0.05)` → token `ink-wash` |
| Plus button | radius | `6px` |
| Plus icon | color | `#383838` → token `ink-soft` |
| Logo wrapper | opacity | `0.3` — on the wrapper, not the mark; identical open and closed |
| Provider role | opacity | `0.4` |

No gradients. No shadows.

### Assets

| Asset | Type | Intrinsic | Rendered | Source |
|---|---|---|---|---|
| Truist mark | inline SVG | viewBox `0 0 133 31` | h 26.8 (67% of 40) × aspect 4.125 | capture, inline in `#testimonials` |
| Nomura mark | inline SVG | viewBox `0 0 120 21` | h 16.8 (42%) × aspect 5.70833 | ” |
| Baird mark | inline SVG | viewBox `0 0 86 24` | h 18.4 (46%) × aspect 3.60526 | ” |
| Plus glyph | CSS mask in the original, inline SVG here | 18px path in a 24 viewBox, `translate(3 3)` | 20 × 20 in a 44 × 44 button | ” |

**These are a second, dark-fill copy of the marks** — not the white-fill files under
`public/logos/`. For Nomura the *artwork itself differs*: `120×21` here versus `122×22` in
the carousel. Do not consolidate them.

All three sit inside a `40px`-tall wrapper; each declares its own height as a percentage of
that wrapper and lets `aspect-ratio` produce the width. `preserveAspectRatio` is
`xMinYMid meet`, so a mark whose true aspect differs from the declared one letterboxes
vertically and stays flush left — Truist does exactly this (true 4.29 vs declared 4.125).

### Interactive states

| Element | Hover | Focus-visible | Active | Transition |
|---|---|---|---|---|
| Card | `cursor: pointer` only — the capture declares no hover rule | 2px `ink` ring, 2px offset (**ours** — the original has none) | opens the card | `width` 500ms `--ease-rogo` |
| Plus button | none observed | not focusable (`aria-hidden`) | — | `opacity` 300ms `--ease-rogo` |
| Logo mark | none observed | — | — | — |

The original makes both the card **and** the logo inside it `tabindex="0"` — two tab stops
that do the same thing. Ours has one (see deviations).

### Motion

| What animates | Trigger | Duration | Easing | Notes |
|---|---|---|---|---|
| Card width (≥1200) | click / Enter / Space | **500ms (est.)** | `cubic-bezier(.44,0,.56,1)` (est.) | 17% ↔ `calc(66% - 24px)` |
| Quote reveal | same | **500ms (est.)** | same | `grid-template-rows` 0fr ↔ 1fr, plus opacity |
| Plus button | same | **300ms (est.)** | same | opacity 0 ↔ 1 |

Library: **CSS transitions**. Neither `gsap` nor `framer-motion` was invoked. Per
`docs/SKILLS.md` the GSAP trigger is scroll-driven / pinned / scrubbed / timeline work —
none of which this is — and the Motion trigger is mount/exit, gesture, layout animation.
This is a two-state width-and-height toggle on three sibling elements; a transition on two
explicit widths does it without shipping an animation runtime into the section. Recorded
here so the choice is not mistaken for an oversight.

> ⚠️ **All three durations are estimates.** The capture is a Framer build: it animates in
> JS and its stylesheet holds exactly one authored transition
> (`color .3s cubic-bezier(.44,0,.56,1)`). These need to be timed on the live site.

Reduced-motion fallback: the global rule in `globals.css` collapses every transition to
0.01ms, so the accordion snaps rather than slides. Nothing becomes unreachable.

### Responsive behavior

- **≥1600 (XL):** identical to Desktop. The capture has **no** `min-width: 1600px` rule for
  this section — the base rule covers both tiers.
- **1200–1599.98 (Desktop):** three-column row, 600px tall, open card `calc(66% - 24px)`.
  Heading 48px, quote 28px. Plus button lives in the card's *Bottom* block.
- **810–1199.98 (Tablet):** stacks. Heading 44px, quote 20px, section padding
  `164/40/128`. Plus button moves **into the logo row**, pushed right by
  `justify-content: space-between`. Role text un-clamps and wraps.
- **≤809.98 (Phone):** as Tablet, plus: heading 36px with a hard break after
  "Helping finance", container `max-width: unset`, section padding `128/16`.

The two DOM subtrees switch on the `ssr-variant` classes: desktop is
`.hidden-11hyp1n .hidden-9nhpe8` (hidden at tablet + phone → visible ≥1200), mobile is
`.hidden-1eq4joi .hidden-l1t773` (hidden ≥1600 and 1200–1599.98 → visible ≤1199.98).

---

## Tokens used

From `docs/DESIGN-SYSTEM.md`: `ink`, `ink-soft`, `canvas` *(new)*, `card` *(new)*,
`ink-wash` *(new)*, `font-display`, `font-sans`, `container-max`, `ease-rogo`,
breakpoints `tablet` / `desktop`.

## Documented deviations

| Property | Original | Ours | Why |
|---|---|---|---|
| DOM | two subtrees, one hidden per tier | **one tree**, `desktop:` variants | Three quotes duplicated into the DOM to hide one copy is a real cost to the a11y tree for zero visual gain. The two things CSS genuinely cannot do — moving the plus button between parents, and the phone-only line break — *are* rendered twice and hidden per tier. |
| Card width | `flex: 1 0 0` / `width: 17%` | `calc(66% - 24px)` / `17%` | Same resolved geometry (verified 821/218/218), but two explicit widths give the open/close transition something to interpolate. `flex-basis: 1px` → `17%` does not animate cleanly. |
| Collapsed quote | `height: 1px` / `3px`, JS-animated | `grid-template-rows: 0fr → 1fr` with those values as `min-height` | CSS cannot transition to an intrinsic height any other way, and the original does it in JS where CSS cannot follow. Closed geometry is preserved exactly. |
| Section heading | `<h1>` | `<h2>` | The page already has the hero's `<h1>`. Two `<h1>`s is a defect, not a design choice. Zero visual difference. |
| Quote text | `<h5>` | `<blockquote>` | It is a quotation. Framer picked `h5` as a styling shortcut. Zero visual difference. |
| Tab stops | card **and** logo both `tabindex="0"` | card only | Two tab stops that fire the same action is a keyboard-navigation defect. |
| Focus ring | none | 2px `ink` ring, 2px offset | Accessibility floor from `docs/PROJECT.md`; the original ships nothing focus-visible. |
| Collapsed quote in the a11y tree | readable | `aria-hidden` while closed | It is visually clipped to 1px. An accordion panel that is closed should be closed for everyone. |
| Card semantics | bare `tabindex="0"` div | `role="button"` + `aria-expanded` + `aria-controls` | Same reason. |

## Known contrast failures — inherited from the target, NOT fixed

Measured with `node docs/reference/contrast-check.js`:

| Element | Effective color | On | Ratio | Verdict |
|---|---|---|---|---|
| Heading, quote | `#151515` | `#f7f7f7` / `#eeedec` | 17.05 / 15.62 | AAA |
| Plus icon | `#383838` | `#e4e3e2` | 9.15 | AAA |
| **Provider role** (ink @ 40%) | `#979797` | `#eeedec` | **2.50** | **FAIL AA** |
| **Logo marks** (ink @ 30%) | `#adadad` | `#eeedec` | **1.92** | **FAIL** (1.4.11 wants 3:1) |

These are the original's own opacity values. `docs/PROJECT.md` sets an AA floor and
`CLAUDE.md` §1 makes color a hard fidelity requirement — they conflict here, and unlike the
other a11y divergences above this one is **visible**, so it is not taken unilaterally.

Minimum fix if we decide fidelity loses: role opacity `0.4 → 0.60` gives `#6b6b6b`, exactly
4.5:1. **Open question — awaiting the user's call.**

---

## Acceptance checklist

- [x] Renders at 1600 — computed values match the capture; no reference screenshot to diff
- [x] Renders at 1440 — matches the user's browser screenshot structurally
- [x] Renders at 1024
- [x] Renders at 390
- [x] Spacing/type/color from tokens, or deviation documented above
- [x] Open/close implemented on click, Enter and Space
- [ ] Motion timing + easing match the original — **estimated, not observed**
- [x] `prefers-reduced-motion` respected (global rule)
- [x] Keyboard reachable, focus visible, tab order correct
- [x] Marks carry `role="img"` + `aria-label`
- [ ] Contrast ≥ AA — **two inherited failures above, unresolved by decision**
- [x] No horizontal overflow at any width (`scrollWidth == innerWidth` at all four)
- [x] `npm run build` clean
- [x] `CONTEXT.md` (feature + global) updated, `SECTIONS.md` status set

## Open questions

- [ ] **Motion timings.** Card-width duration, quote-reveal duration, and the easing all
      need timing on the live site. Currently 500 / 500 / 300ms on `--ease-rogo`.
- [ ] **Contrast.** Keep the target's 0.4 role opacity (fails AA at 2.50:1), or raise it to
      0.60 (passes at 4.5:1)? Same question for the 0.3 logo opacity.
- [ ] **Card hover.** The capture declares `cursor: pointer` and nothing else. Does the live
      site lighten the card or the plus button on hover?
- [ ] **Can the open card be closed?** Framer's variants only ever describe one-open, so
      clicking the open card is currently a no-op. Unverified against the live site.
- [ ] **The 96px mobile gap** (`.framer-v-sgdn6k`) is large enough to look like a bug — it
      leaves ~290px closed cards at 1024. It is what the capture says. Worth a second look
      against the live site at a real tablet width.
