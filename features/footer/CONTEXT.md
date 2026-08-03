# Context: Footer + closing CTA

Memory for this section. **Newest entry on top.** Append after every task — never rewrite
past entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold,
with no code scanning.

---

## Current state

Built and building clean. Closing CTA, divider, four link columns and a centred copyright,
all on `ink`. Every value extracted from the capture and verified by CDP at all four tiers.
No new tokens. The link hover is one of only two **measured** transitions on the site.

**Two things need the user's call**, both inherited: the "Legal" link ships on the ≥1200
variant only, and "Press" points at two different destinations by tier. Plus the same
`muted`-on-`ink` contrast failure as `security`.

**Status:** `review`
**Next action:** get those calls; decide what to do about link destinations that 404.

---

## Log

### 2026-08-03 — built

**Trigger:** user — a rogo.ai screenshot of the footer, *"this also"*.

**Done**
- Extracted the footer (`.framer-8dt5bh-container`, HTML offsets 503682–550741 — 47 KB
  across three full DOM copies) and every CSS rule touching its 47 classes.
- Built `Footer.tsx`; wired into `page.tsx` **outside `<main>`**, as in the original.
- No new tokens.

**Measurements worth keeping**

- **A nested Framer component ships its own tier-gating hashes.** The page's are
  `hidden-11hyp1n` / `hidden-9nhpe8` / `hidden-1eq4joi` / `hidden-l1t773`; the footer's are
  `hidden-1leoyz4` / `hidden-16n7npo` / `hidden-d23fwj` / `hidden-1roolzl`. Same four
  media queries, different names. They had to be re-derived from the stylesheet — reusing
  the page's mapping would have silently mis-assigned every value.
- **Two of the component's variants are never rendered, and their CSS is a trap.** The
  stylesheet carries `framer-v-1cxbn18` and `framer-v-18cp4bv` alongside the three that do
  render. `1cxbn18` declares `grid-template-columns: repeat(2, minmax(50px,1fr))` on the
  link row — exactly the kind of rule you would attribute to the tablet tier if you matched
  on class name alone. It does not apply. **Every rule was checked for whether it names one
  of `1hizjvd` / `25d1j7` / `3r98zd` before its value was recorded.** This is the README's
  "only the rendered variant is authoritative" rule biting for the third time.
- **The divider is two different colours by tier** — `rgba(56,56,56,0.5)` at ≤1199.98,
  `rgba(255,255,255,0.1)` at ≥1200. `rgb(56,56,56)` is exactly `ink-soft` `#383838`, so
  both are opacity modifiers on existing tokens rather than new values. Over `ink` they
  land on `#262626` and `#2c2c2c` — genuinely different, close enough that nobody would
  catch it by eye.
- **The copyright has three different size/weight combinations** across the three variants:
  12px/500 desktop, 14px/500 tablet, 14px/400 mobile. No pattern; read off each variant.
- **The CTA button is 16px where the nav's is 14px**, with otherwise identical internals
  (`8px 16px` around a `20px` row with the `1px` optical nudge, `6px` radius, transparent
  `1px` border). Its height comes from the *container* — 44px desktop, **42px tablet**,
  44px mobile — not from the padding.
- **The link hover is measured, not estimated.** `framer-styles-preset-1twswsp` declares
  `--framer-link-hover-text-color: #f5f5f5` and `transition: color .3s
  cubic-bezier(.44,0,.56,1)`. That makes this the **second** authored transition found in
  the whole capture, after the nav banner's. Scoped to `color` only — `transition-colors`
  would have over-reached to background, border and outline.
- **Three content differences between tiers**, all reproduced:
  1. The **"Legal" link ships on the ≥1200 variant only** (3 links there, 2 below).
  2. **"Press" points at `mailto:press@rogo.ai` at ≥1200 and `https://x.com/RogoAI` below.**
  3. The **CTA has no `href` at all on the ≥1200 variant**; the other two have `./demo`.
- Footer has **no vertical padding of its own**. The Reiteration block's `padding-top:56px`
  is the whole top inset; the Copyright's `16px` is the bottom.

**Decisions**

- **The CTA gets `/demo` at every tier — the one deliberate deviation.** An `<a>` with no
  `href` is not keyboard-operable, and the missing one is on the *desktop* variant, i.e. the
  primary one. The value is not invented: it is the original's own, from its sibling
  variants. Smaller deviation than the nav's `Request Demo` fix, where no target existed.
- **The other two tier differences are reproduced verbatim**, each link gated to the tier
  that declares it. Consistent with the call made on `security`'s ragged borders: reproduce,
  flag, offer the fix, let the user decide. Two `<a>`s labelled "Press" with one
  `display:none` is ugly, but `display:none` is skipped by assistive tech, so it costs
  nothing but source noise.
- **Root-relative hrefs** (`/product`) rather than the capture's `./product`, matching
  `Nav.tsx`. `./` would resolve relative to the current route and break from any nested page.
- **Real hrefs kept even though every destination 404s.** Replacing them with `#` would
  destroy the information architecture for no gain; the missing pages are a known open item
  in `PROJECT.md`.
- **`<footer>` outside `<main>`**, as a landmark sibling — which is also where the original
  puts it.
- **Focus rings added** on every link and the CTA. The original has none.

**Verified**
- CDP probe at 1600 / 1440 / 1024 / 390 — footer padding, container, Reiteration direction
  and padding, headline size/leading/line count (2 lines at ≥810 at 106px, 3 at ≤809.98 at
  145px), CTA box **44 / 44 / 42 / 44+full-width**, divider colour per tier, Bottom gap,
  link-row direction, group widths (308 / 308 / 224 / 358), title and link type, the
  copyright's three size/weight combinations, and **every link's rendered `href` at every
  tier** — confirming Legal ships 3 links at ≥1200 and 2 below, and Press flips destination.
  Every value matches the capture. No horizontal overflow at any width.
- Contrast: links `18.26:1`, hover `16.75:1`, CTA label `18.26:1`. **Group titles and
  copyright `3.85:1` — fails AA**, same `muted`-on-`ink` problem as `security`.
- `npm run build` and `eslint src` clean.
- Rendered and looked at, 1440. Compared against the user's live-site screenshot: matches.

**Open / deferred**
- The two tier-difference calls, and the contrast call.
- Link destinations 404 until the other pages are scoped.
- The CTA button's hover is unobserved — it is a separate Framer component with no `:hover`
  in the capture, so ours has none either.
