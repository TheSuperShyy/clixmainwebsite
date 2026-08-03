# Context: Why financial institutions choose Rogo

Memory for this section. **Newest entry on top.** Append after every task — never rewrite
past entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold,
with no code scanning.

---

## Current state

Built and building clean. Two-column layout with a sticky headline and five non-uniform
items; every value extracted from the capture and verified by CDP at all four tiers.
No animation library — the one scroll behaviour is native CSS `position:sticky`.

**Not yet visually diffed against the live site.** The capture's numbers are reproduced
exactly, but nothing here has been compared to a screenshot of rogo.ai. Hover states, if
any exist, are unobserved — the capture has no `:hover` rule or transition in the subtree.

**Status:** `review`
**Next action:** one look at the live site for hover, entrance motion, and item 3's
three-line heading break.

---

## Log

### 2026-08-03 — built

**Trigger:** user — a rogo.ai screenshot of the section, *"add this new section"*.

**Done**
- Extracted the section (`.framer-1lovf32`, HTML offsets 443077–462207) and every CSS rule
  touching its 44 framer classes, grouped by media query.
- Inlined the five icons from the capture's SVG defs into
  `src/components/ui/WhyRogoIcons.tsx` — the original references them as `<use href="#id">`.
- Built `WhyRogo.tsx`; wired into `page.tsx` after `Testimonials`.
- Added `hairline-dark` + `tile` tokens to DESIGN-SYSTEM.md and the `@theme` block.

**Measurements worth keeping**

- **`flex:1 0 0; width:1px` is load-bearing, and the `width` is the part that matters.**
  Framer puts it on both columns. Flex-basis is 0 so the width never sizes anything — but a
  flex item's automatic minimum size is capped by its *specified* size, so `width:1px`
  is what defeats `min-width:auto`. Drop it and long content widens its own column and the
  50/50 split drifts. Kept as `w-px` with a comment; it looks like dead CSS and is not.
- **`overflow:clip`, never `overflow:hidden`.** The headline is `position:sticky` and
  `overflow:hidden` on any ancestor makes that ancestor a scroll container, which kills the
  stick outright. `clip` does not create one. The capture writes
  `overflow:var(--overflow-clip-fallback,clip)` throughout, with the fallback defined only
  inside `@supports not (overflow:clip)` — i.e. `hidden` is the legacy path, not the intent.
- **The tablet tier's item headings are BIGGER than desktop's** — 28px vs 24px, on all five
  items. Verified against the `ssr-variant` gating classes rather than assumed: each
  `hidden-*` class is a bare `display:none!important` inside one media query, so a variant
  shows at exactly the tiers absent from its class list. `hidden-1eq4joi`=≥1600 ·
  `hidden-l1t773`=1200–1599.98 · `hidden-11hyp1n`=810–1199.98 · `hidden-9nhpe8`=≤809.98.
- **The five items are not uniform.** Item 1 alone has `padding-top:72px`; items 4 and 5 use
  a 32px gap where 1–3 use 28px; item 5 alone has no bottom rule. Item 1's top padding is
  exactly the headline column's own, which is what aligns the h2 with the first icon tile.
- **Item 4's icon is not vertically centred** — `30×29` at `top:7 left:5` in a 40px frame,
  so `7+29=36` of 40. And it is the only one carrying its `.7` opacity on the SVG path
  rather than on the Icon Frame. Both reproduced where the capture puts them.
- **Body letter-spacing is inconsistent between items** — `-0.1px` on 1/2/4, `-0.01em` on
  3/5. Same paragraph style, two values. Copied, not normalised.
- **Item 3's heading is capped at `300px`** where the others are 500 or 844, which forces
  its three-line break. Verified it is item 3's container (`framer-m2i7v7`) and not a
  mis-attributed rule.
- `#0000000d` (tile) and `#0000001a` (rule) are **pure black**, not `ink`. The design system
  already carried `ink-wash` = ink@5% and `hairline` = warm gray@20%; both are near-misses
  for these and collapsing either pair would be wrong. Noted in DESIGN-SYSTEM.md.

**Decisions**

- **No animation library, and the `gsap` trigger was deliberately declined.** Its trigger
  covers pinning, which this section does — but the original pins with CSS `position:sticky`
  and the capture emits **zero `data-framer-appear-id`** in the subtree, so there is no
  entrance motion either. A ScrollTrigger `pin` would wrap the headline in a pin-spacer and
  change layout the original does not change: less faithful, not more. Logged here per
  CLAUDE.md §4.
- **One DOM tree, not Framer's three.** Same call as `testimonials` — shipping three copies
  of every heading and paragraph to hide two costs the a11y tree more than it saves. All
  per-tier values are reproduced with `tablet:`/`desktop:` variants.
- **Headings demoted h3→h2 and h4→h3.** The hero owns the h1; going straight to h3 skips a
  level. Purely semantic, nothing renders differently.
- **Icons inlined rather than `<use>`d**, so each inherits `currentColor` and needs no
  shared defs block. Path data, viewBox, stroke width and caps are byte-identical.
- **`ssr-variant` mapping was derived, not guessed.** Every `hidden-*` class was looked up
  in the stylesheet and traced to its enclosing media query before any value was recorded.

**Verified**
- CDP probe at 1600 / 1440 / 1024 / 390 — section padding, container width, column split
  (628/628 at ≥1200, 460/460 at 1024, stacked 299px at 390), every item's padding, gap,
  rule, tile, frame opacity, SVG box and offset, and all three type ramps. Every value
  matches the capture. No horizontal overflow at any width.
- Sticky sweep at 1440: headline top holds at exactly `96px` while the section travels from
  `0` to `-1313`.
- Contrast: body is `ink` at 70% over `canvas` = `#595959` on `#f7f7f7` = **6.54:1**;
  headings **17.05:1**. Both pass AA. (Contrast is worth calling out here because
  `testimonials` inherited two failures from the target — this section inherits none.)
- `npm run build` and `tsc --noEmit` clean; `eslint src` clean.
- Rendered and looked at, 1440 and 390.

**Open / deferred**
- Nothing visually diffed against the live site.
- Hover states unobserved — the capture has no `:hover` rule, `cursor`, or transition in the
  subtree, so the section is built with nothing focusable or interactive.
- `top:96px` on the sticky headline is absolute in the original, not derived from the nav
  height. Whether it is meant as "nav + 36" or just a round number is unknown.
