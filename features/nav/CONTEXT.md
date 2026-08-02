# Context: Navigation + Banner

Memory for this section. **Newest entry on top.** Append after every task — never rewrite
past entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold,
with no code scanning.

---

## Current state

Built and building clean. Banner + both header layouts (full nav ≥1200, logo + hamburger
below) + a mobile panel. All structural values are measured from the capture; hover opacity
values are estimated and flagged.

**Not yet visually verified against the reference at any tier** — this is the main gap.
The mobile menu panel is invented, because the original never renders it in the capture.

**Status:** `review`
**Next action:** compare against the reference at 1600 / 1440 / 1024 / 390; then observe the
live site for the mobile menu, the scroll state, and the `Indicator` element.

---

## Log

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
