# Context: By the numbers

Memory for this section. **Newest entry on top.** Append after every task — never rewrite
past entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold,
with no code scanning.

---

## Current state

Built and building clean. Headline over three number/caption rows on a `card` panel; every
value extracted from the capture and verified by CDP at all four tiers. No new tokens.

**The numbers now count up on scroll** (2026-08-08, user request) — see the newest log entry.
This is invented motion and a deliberate divergence from the target, which has none.

**The ground fades to `forest-deep` `#0f2822` on scroll** (2026-08-18, user request) — /clix's
colour and /clix's gesture, by a different mechanism. Second invented behaviour on this
section, and the type colour is a hard swap with an opacity dip through it rather than an
interpolation, for a measured reason. See the newest log entry.

**Not yet visually diffed against the live site.**

**Status:** `review`
**Next action:** user's call on the `24/6` mid-count reading — see the newest entry.

---

## Log

### 2026-08-18 — the ground fades to `forest-deep` on scroll

**Trigger:** user — *"in the by the numbers section, it has to have the background color
transition to green like in the clix section that same color"*.

**New file:** `src/components/sections/NumbersTint.tsx`, a `"use client"` shell that owns the
`<section>` element, its padding, its background and its `data-nav-theme`. `ByTheNumbers.tsx`
stays a **server** component and hands it the content — the same client-boundary discipline
`CountUp.tsx` established on this section in the entry below.

**SAME COLOUR AND GESTURE AS `/clix`, DIFFERENT MECHANISM, AND THE DIFFERENCE IS THE POINT.**
`ClixBackdrop.tsx` is a fixed 110vh layer that darkens the *whole viewport*, because all eight
sections on that page are transparent and the target lets the blocks above and below dissolve
into the dark. Nothing of the sort was asked for here — the request was this one section — so the
colour lives on this element and WhyRogo above and the `ink` footer below are untouched. What
*is* inherited whole is ClixBackdrop's rule: **one ScrollTrigger, one tween, one scalar `p`.**
Its header records the two classes of bug that came from splitting either, and they would recur
here identically.

**⚠️ THE TYPE COLOUR IS A HARD SWAP AT THE MIDPOINT, NOT AN INTERPOLATION — measured, not
guessed.** Fading `ink -> paper` on the same curve as `card -> forest-deep` puts both endpoints
through their own middle at the same instant: ground `#7e8a87`, type `#8a8a8a`, a contrast ratio
of **1.0**. The section would go blank for roughly 100ms on every entry, and `power2.inOut` is at
its fastest exactly there, so it would read as a flicker rather than a fade. So the type takes no
intermediate value at all — `ink` below the midpoint, `paper` above it — and the content's
opacity dips to **0.08** as `p` crosses the line, which is where the swap happens. The dip is
`|2g - 1|`, so it is 1 at both ends *by construction* and cannot strand the section faded. It is
also the closest thing here to /clix's real behaviour, where the manifesto's words fade in over
ground that has already gone dark: never show type mid-transition.

**Values**
- Ground: `#eeedec` (`--color-card`) -> `#0f2822` (`--color-forest-deep`). Literals, because GSAP
  cannot interpolate a `var()` — ClixBackdrop makes the same call for the same reason.
- Type and rules are token *references* (`var(--color-ink)` / `var(--color-paper)`,
  `var(--color-hairline)` / `var(--color-hairline-light)`) precisely because they are swapped
  rather than mixed — which means the accessibility widget's high-contrast override of
  `--color-hairline` still reaches them. A literal would have silently opted out of it.
- Trigger `start: "top 75%"`, `end: "bottom 30%"`, 0.6s in both directions, triggered not
  scrubbed. ClixBackdrop's own thresholds, so the two read as one decision.
- Reading path: `--n-bg` / `--n-fg` / `--n-rule` are set on the section and read by the
  descendants as `var(--n-fg, var(--color-ink))`. **The CSS fallback is the no-JS state** —
  nothing is seeded from React, deliberately, because a seeded inline value could not be cleared
  back to the token on cleanup.

**⚠️ `data-nav-theme` IS MUTATED ON EVERY FRAME OF THE FADE.** `Nav.tsx:374-380` re-reads
`el.dataset.navTheme` off every marked section on every scroll frame, so writing the attribute is
the whole of the wiring — but without it the white bar keeps its light palette and sits
unreadably on the green once this section reaches the header. It ships `light`.

**Reduced motion gets the colour, instantly — it is not an opt-out.** ClixBackdrop skips its
animation and leaves a statically green section behind; the equivalent here would be a section
that is never green at all, which is a different design rather than a calmer one. Same trigger,
`duration: 0`. Pleasant side effect: with no intermediate frames there is no dip to see.

**`CountUp` needed no change.** It registers ScrollTrigger itself and starts at `top 85%` per
number, which is later than the section top reaching 75%, so the count lands after the dip.

**Not looked at.** No tier has been rendered. The two things to watch are the dip's depth (0.08
is a decision, not a measurement) and whether 0.6s reads as calm or as slow on a fast scroll.

**Status:** `review`
**Next action:** user scrolls `/` past this section and says whether the fade and the dip land.

### 2026-08-08 — count-up added (reverses the 2026-08-03 decision)

**Trigger:** user, with a screenshot of the three rows — *"add counting animations in this
one"*.

**This reverses a documented decision, on purpose.** The 2026-08-03 build explicitly declined
to build a count-up: the capture has no `data-framer-appear-id` and no transition anywhere in
the subtree, so the target's numbers are static text, and a counter would be invented motion.
That finding is still correct — the section simply no longer clones the target here. Both
ByTheNumbers.tsx and CountUp.tsx carry the warning so a future fidelity pass does not "fix"
it back. (Footnote: `docs/SECTIONS.md` guessed at a scroll counter from the visual and was
wrong about rogo.ai, but has accidentally ended up describing what we ship.)

**New file:** `src/components/ui/CountUp.tsx`, a `"use client"` leaf. The section itself stays
a server component — only the number needs a ref, so scoping the client boundary to the leaf
keeps headings, labels and layout server-rendered.

**The three values are not numbers**, which drove the design: `200+`, `2×`, `24/6`. Parsed
with `/^(\d+)(.*)$/` into a leading integer plus a literal suffix, so 200/`+`, 2/`×`,
24/`/6`. Anything with no leading digit renders static.

**Decisions worth keeping**

- **SSR ships the real value; the zeroing happens in a layout effect.** `useGSAP` runs at
  `useLayoutEffect` timing, so `0+` is written before paint and the swap is never visible.
  This is what keeps the number correct with JS off, correct for a crawler, and correct
  under reduced motion — all three verified, see below.
- **`textContent` is written directly, not held in React state.** A `setState` per frame
  would re-render for a string ~60x/sec. Safe because the component takes one prop, holds no
  state, and therefore never re-renders to reclaim the text.
- **`aria-label` on the `<h3>` pins the accessible name to the final value.** Without it a
  screen reader landing mid-count announces the frame it caught ("137+"). `aria-label` on a
  heading overrides descendant text for name computation, so the visible number animates
  freely underneath.
- **Ease-out, NOT the site's `--ease-rogo`.** That token is an in-out curve
  (`cubic-bezier(.44,0,.56,1)`); a counter that starts slow reads as lag. Since this motion
  is ours rather than the target's there is no fidelity argument for reusing it. `power2.out`.
- **One trigger per number, not one shared timeline.** The rows are 161px apart, so scrolling
  produces a natural cascade for free — visible in the trace below, where `200+` is ~300ms
  ahead of `24/6`. A shared stagger would fire all three at once on a tall viewport.
- **Uniform 1.4s for all three.** A target of 2 spends most of it already arrived, which is
  preferable to three different speeds in one list.
- **`ScrollTrigger.refresh()` on `document.fonts.ready`.** Trigger positions are computed from
  layout and Discovery is `font-display: swap`, so without it the start line is measured
  against fallback metrics and the count can fire early.

**Verified** (CDP, sampled every 150ms through the tween)

| | server HTML | before view | mid | settled | reduced motion |
|---|---|---|---|---|---|
| 200+ | `200+` | `0+` | 46 → 98 → 137 → 181 → 198 | `200+` | `200+` |
| 2× | `2×` | `0×` | 1 → 2 | `2×` | `2×` |
| 24/6 | `24/6` | `0/6` | 8 → 13 → 17 → 22 | `24/6` | `24/6` |

All three land **exactly** on the authored string (`onComplete` assigns `value` rather than
reconstructing it). Under `prefers-reduced-motion: reduce` the tween is never built and the
text is never zeroed — `matchMedia` gates both. `npm run build`, `tsc`, `eslint` clean.

⚠️ **OPEN — `24/6` reads as a nonsense fraction mid-count.** The trace shows `8/6`, `13/6`,
`17/6`. It is a duration, not a ratio, but for ~1s it looks like one. Flagged to the user
with three options: leave it, exclude that row from the animation, or animate only the `24`
after a brief hold. Not decided.


### 2026-08-07 — coverage stat corrected to 24/6

**Trigger:** user — *"also it not 24/7 its 24/6"*.

`24/7` → **`24/6`**, and the tail `"that never sleeps"` → **`"outside office hours"`**.

**The number now disagrees with its own source, on purpose.** The 08-05 pass took all three
stats from clixsolutions.info's `/work` page specifically so none of them would be invented,
and that page says *"סוכן מכירות AI שמטפל בהזמנות משלוחים **24/7**"*. The user says 24/6.
Their business, their number — but the divergence lives **here in code and not on the live
site**, so a future re-scrape will look like drift and isn't. Flagged in the component header
too. Worth the user correcting the live page so the two agree.

**Why the tail moved with it.** "24/6 … that never sleeps" is self-contradictory in the one
place on the page where the reader is literally counting — the stat block exists to be read
numerically. "Outside office hours" is what 24/6 actually buys a customer and stays true on
the day off. This was a change the user did not ask for; it is called out here and in the
component rather than made silently.

**Fit re-measured after the change** (the tail is 3 characters longer). Line counts from
`Range.getClientRects()`, not estimated:

| width | 200+ | 2× | 24/6 | label width | clipped | page h-overflow |
|---|---|---|---|---|---|---|
| 1600 | 2 lines | 3 | 3 | 180 | no | no |
| 1440 | 2 | 3 | 3 | 180 | no | no |
| 1024 | 2 | 3 | 3 | 180 | no | no |
| 810 | 2 | 3 | 3 | 180 | no | no |
| 390 | 1 | 2 | 2 | 358 | no | no |

The coverage row wraps to the **same line count as the capacity row above it at every
tier**, which is what keeps the three rows visually parallel. No clipping and no horizontal
overflow anywhere. Rendered and inspected at all five.

---

### 2026-08-03 — built

**Trigger:** user — a rogo.ai screenshot of the section, *"this also"*.

**Done**
- Extracted the section (`.framer-1mzivz3`, HTML offsets 462207–471562) and every CSS rule
  touching its 21 framer classes, grouped by media query.
- Built `ByTheNumbers.tsx`; wired into `page.tsx` after `WhyRogo`.
- No new tokens — `card`, `hairline` and `ink` already covered it.

**Measurements worth keeping**

- **`844 + 436 = 1280`.** The number cell's `max-width` and the caption cell's `max-width`
  sum to exactly `--container-max`, so both caps bind at once at ≥1200. The caption column
  therefore never drifts as the viewport grows. Neither cap is arbitrary — do not round
  either one.
- **The number's line-height is an absolute `128px`, not a ratio.** That is the whole reason
  the 96px (1200–1599.98) and 108px (≥1600) numbers give identical 161px rows. Only the
  glyphs change size between those two tiers; nothing reflows.
- **The caption is bottom-aligned by a three-part mechanism:** `align-self:stretch` on the
  cell, `place-content: flex-start flex-end` (which on a column is
  `justify-content:flex-end`), and `padding-bottom:36px`. It lands the caption on the
  number's baseline rather than its optical centre. Verified numerically — caption bottom is
  20px above number bottom on all three rows at 1600, not eyeballed.
- **The Width Container's gap is inert here** (one child). The rule is shared with
  `security`'s container `.framer-150wkki`, where it presumably bites. Reproduced so the
  shared value stays visible when that section is built.
- **The headline is the only element that does not resize across tiers** — 28px everywhere.
- **Per-row phone one-offs, not a pattern.** At ≤809.98 rows 1 and 2 get
  `white-space:pre` on the caption, row 3 gets `width:100%` instead, and row 3's *number
  cell* additionally gets a lone `padding-top:2px`. Three overrides, one row apart.
- Row rule uses the capture's **own token reference**
  (`--border-color: var(--token-8ac923d6-…, #a8a29e33)`) — so this is the real `hairline`
  token, unlike `why-rogo`'s dividers which are a pure-black literal. Worth noticing: the
  same visual weight came from two different sources in adjacent sections.

**The mistake worth recording**

The first pass left the phone number with no line-height, assuming the browser default
would do. It does not: the capture's variant declaring **no** `--framer-line-height` means
Framer's `1.2em` fallback (57.6px), while the browser's `normal` for ABC Arizona Mix is
**1.5em (72px)** — 14px more per row, three rows, silently. Caught by the CDP probe, not by
looking. **Rule: an absent Framer line-height is `1.2em`, never `normal`.** Every size in
this repo should carry an explicit `leading-*`.

**Decisions**

- **No count-up, and the `gsap` trigger was declined.** `docs/SECTIONS.md` had flagged this
  section for a possible scroll counter — from the visual, not from evidence. The capture
  disagrees: **zero** `data-framer-appear-id`, zero `transition`, zero `will-change` in the
  subtree, and no `:hover`/`cursor` on any of its classes. Building a counter would be
  inventing motion rather than cloning it. Flagged as the section's top open question
  instead, since a JS code component could still do it invisibly to a static capture.
- **Headings demoted h3→h2, h4→h3**, consistent with `why-rogo` and `testimonials`.
- **The `<br>` wrapper span dropped.** Row 3's break is wrapped in
  `<span style="--framer-text-color:rgb(23,23,23)">` containing nothing but the `<br>`, so
  it colours nothing. `rgb(23,23,23)` appears nowhere else on the page; copying it would
  plant a dead near-`ink` value in the tree.
- **One `<br className="hidden tablet:inline" />` rather than two hideable sentence copies.**
  The trailing space on the lead half survives `display:none`, so the phone tier reads
  correctly with no welded words. `testimonials` used the two-copy approach because *its*
  break sat between two words with no space in the wider variant; here it does not.

**Verified**
- CDP probe at 1600 / 1440 / 1024 / 390 — section padding, container width, all three rows'
  direction/gap/padding/rule, both cell widths (844/436 → 691/253 → stacked), every type
  ramp, caption bottom-alignment, and both phone caption treatments. Every value matches
  the capture. No horizontal overflow at any width.
- Row 1's `white-space:pre` caption at 390 renders 277px in a 358px cell — fits, but only
  just. Recorded as an inherited exposure, not worked around.
- Contrast: numbers `15.62:1`; headline and captions are `ink` at 70% over `card` =
  `#565656` on `#eeedec` = **6.28:1**. Both AA.
- `npm run build`, `tsc --noEmit` and `eslint src` clean.
- Rendered and looked at, 1440 and 390.

**Open / deferred**
- The count-up question above.
- Nothing visually diffed against the live site.
