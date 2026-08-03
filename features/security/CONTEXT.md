# Context: Built for enterprise, secure by design

Memory for this section. **Newest entry on top.** Append after every task — never rewrite
past entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold,
with no code scanning.

---

## Current state

Built and building clean. Centred headline over a five-badge bordered grid on `ink`; five
badge SVGs vendored to `public/badges/` and validated by rasterising. Every value extracted
from the capture and verified by CDP at all four tiers, including the full per-cell border
matrix. No new tokens.

**Two things need the user's call**, both inherited from the target rather than introduced:
the grid outline is left open below 1200px, and the 12px labels are `3.85:1` against `ink`.

**Status:** `review`
**Next action:** get those two calls, then diff against the live site.

---

## Log

### 2026-08-03 — built

**Trigger:** user — a rogo.ai screenshot of the section, *"this one too"*.

**Done**
- Extracted the section (`.framer-1nzz2sb` / `#security`, HTML offsets 471562–503618 —
  32 KB, almost all of it badge artwork) and every CSS rule touching its 27 framer classes.
- Vendored the five badges to `public/badges/`; documented them in `public/README.md`.
- Built `Security.tsx`; wired into `page.tsx` after `ByTheNumbers`.
- No new tokens — `ink`, `paper`, `muted` and `hairline-light` already covered it.

**Measurements worth keeping**

- **Framer paints `data-border` on an `::after` overlay**, not through the box model:
  `content:""; position:absolute; top:0; left:0; width:100%; height:100%;
  box-sizing:border-box; border-width: var(--border-top-width,0) …; pointer-events:none`.
  Two consequences. First, a cell's declared `height:240px` is its *full* height, borders
  included — no reflow when a border is added or removed. Second, that is precisely how the
  original can leave the grid outline ragged at two tiers without anything shifting, so
  nobody noticed. **Expect this pattern on every Framer `data-border` element.**
- **The border matrix is hand-authored per cell per tier, and it is only correct at ≥1200.**
  Full TRBL table in `FEATURE.md`. At five columns the pattern is exactly right — every cell
  left/top/bottom, only the last with right — but the 2-column and 1-column overrides were
  written without re-deriving it, and both leave the shape open. Verified by render at 1024
  and 390, not inferred from CSS.
- **The headline has no `<br>`.** Both its lines come from the `400px` measure, at all four
  tiers. Adding a break would be a deviation, not a convenience.
- **Two delivery mechanisms in one row of five.** SOC2/CCPA/ISO are `<use href="#…">`
  references into the defs block; GDPR and EU AI Act are
  `background-image: url('data:image/svg+xml,…')`. **The label weights split the same way** —
  GDPR and EU AI Act declare `--framer-font-weight:500`, the other three declare none (400).
  Two authoring sessions, almost certainly. Copied as found rather than unified.
- **The three `<use>`-sourced SVGs carried NO `xmlns`** — they inherit it from the page's
  root `<svg>` inside the defs block. This is the mirror image of the 2026-08-02 logo bug,
  where extraction produced *two*. Same rule catches both: **exactly one `xmlns` on the
  root.** One added to each here.
- `soc2.svg` is 46 KB because it is the genuine AICPA seal with all the curved outlined
  text. Not a redraw; do not simplify it.
- `#6D6D6D` is the mark colour on all five. It lives **inside the SVG files**, not in any
  CSS rule, so it is deliberately not tokenized — same treatment as the customer logos.
- The `Width Container`'s gap and the `Logos` row's `24px` gap are both **inert** (one child
  each). Kept so the shared classes stay recognisable — `.framer-150wkki` is the same class
  as `by-the-numbers`' container.
- Label box is `137px` for four badges, `188px` for "EU AI Act" — the only string that needs
  the extra width.

**Decisions**

- **Real CSS borders instead of the `::after` overlay.** The rendered geometry is identical
  here — the probe confirms 256×240 tracks and matching frame coordinates at every tier —
  because only *left* borders repeat, so no two ever double up on the same pixel. Real
  borders are simpler and consistent with the other sections. The overlay mechanism is
  documented anyway because it explains the ragged tiers.
- **The ragged borders are reproduced, not fixed.** A 1:1 clone reproduces by default, and
  quietly closing the outline would be a design change made on my own authority. Raised as
  the section's first open question with the fix described.
- **`alt=""` on the badges**, matching the capture's `aria-hidden="true"`. This is the
  correct choice independently: the visible 12px label directly below names each
  certification, so an `alt` would make a screen reader say every name twice.
- **One `<img>` per badge** rather than reproducing both delivery mechanisms. Path data is
  verbatim.
- **Heading demoted h3→h2**, consistent with the three sections before it.
- **`gap-0` and explicit `minmax(50px,1fr)` tracks** rather than Tailwind's `grid-cols-5`,
  which expands to `minmax(0,1fr)`. Only differs below a 250px container, but the capture
  says 50px and there is no reason to round it.

**Verified**
- CDP probe at 1600 / 1440 / 1024 / 390 — section padding, container, grid template
  (5×256 → 2×472 → 1×358), cell heights (240 → 254 via `aspect-ratio:1.40909`), graphic
  frames, all three artwork-box treatments, both label weights, label box widths, and the
  **full 5×4 border matrix at every tier**. Every value matches the capture. All five images
  report `complete: true`. No horizontal overflow at any width.
- All five badge SVGs rasterised through `sharp` at density 300 and checked on a contact
  sheet — per the standing rule that structural checks are not sufficient. All five render
  the correct artwork: AICPA seal, California outline, ISO globe, EU star ring, chip-in-stars.
- Contrast: headline `18.26:1`. **Labels `3.85:1` — fails AA**, see open questions. Badge
  marks `3.53:1`, which clears the 3:1 graphics floor and is moot since each is labelled.
- `npm run build` and `eslint src` clean.
- Rendered and looked at, 1440 / 1024 / 390. The 1440 render was compared against the user's
  live-site screenshot and matches.

**Open / deferred**
- The two calls above (ragged borders, label contrast).
- Nothing interactive, though compliance badges often link to a trust centre.
- Whether the nav's `Security` link should target this section's `id`.
