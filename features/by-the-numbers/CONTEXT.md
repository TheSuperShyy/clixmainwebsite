# Context: By the numbers

Memory for this section. **Newest entry on top.** Append after every task — never rewrite
past entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold,
with no code scanning.

---

## Current state

Built and building clean. Headline over three number/caption rows on a `card` panel; every
value extracted from the capture and verified by CDP at all four tiers. No new tokens.
No animation of any kind — see the decision below about the count-up.

**Not yet visually diffed against the live site.** The most likely divergence is a scroll
count-up on the numbers, which a static capture cannot rule out.

**Status:** `review`
**Next action:** watch the live site scroll into this section once, to settle the count-up.

---

## Log

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
