/**
 * CompanyTools — /company Block 4, the band the original calls `Investors`.
 *
 * THE BOX IS ROGO'S, THE CONTENT IS CLIX'S. Every geometry value below is measured from
 * rogo.com/company's `Investors` block in the 2026-08-12 capture: the 3/2/1 columns, the
 * 180px tile, the 24px gap, the `#73737326` rule, the 490px title column. What changed is
 * what sits in the tiles. rogo fills them with twelve venture funds; clix has no investors,
 * so that block has no honest equivalent here. It holds the twelve tools clix builds with
 * instead — and the tile count happens to match exactly, so not one measured value moved.
 *
 * Spec: features/company-page/FEATURE.md "Block 4" · memory: features/company-page/CONTEXT.md
 *
 * TIER MAP — 1600 and 1440 are identical in every measured value on this page, so this is
 * mobile-first base → `tablet:` (810) → `desktop:` (1200), with no `xl:` variant:
 *
 * |              | ≥1200            | 810–1199   | ≤809           |
 * |--------------|------------------|------------|----------------|
 * | band pad     | `96px 40px`      | `64px 40px`| `64px 16px`    |
 * | container gap| 40               | 40         | 32             |
 * | columns      | **3**            | **2**      | **1**          |
 * | tile         | 410.67 × 180     | 460 × 180  | 358 × 180      |
 * | grid gap     | 24               | 24         | 24             |
 * | grid box     | 1280 × 792       | 944 × 1200 | 358 × 2424     |
 *
 * `4 rows × 180 + 3 × 24 = 792` · `6 × 180 + 5 × 24 = 1200` · `12 × 180 + 11 × 24 = 2424`.
 *
 * ⚠️ HEADING ONLY, NO INTRO PARAGRAPH. The `Team` band directly above (CompanyServices) has
 * a heading AND an intro; this one does not. The asymmetry is the original's.
 *
 * ⚠️ THE BORDER IS TOP + **LEFT** HERE — CompanyServices above is top + **RIGHT**. Both
 * matrices are uniform (every tile, every tier, `#73737326` = `muted` at 15%), which was
 * checked rather than assumed; only the pair of edges differs between the two grids. Painted
 * as an absolutely positioned overlay because the original uses `[data-border]::after`, which
 * costs no layout space — a real border would push the content in and grow the tile by 1px.
 *
 * WHY `TOOL_MARKS` AND NOT `ToolGlyphs`. `src/components/ui/ToolGlyphs.tsx` carries only
 * eleven marks: simple-icons 404s on Vapi and monday.com, and /product's grid substitutes a
 * monogram for both rather than redraw a trademark from memory. This grid needs exactly
 * twelve, and `src/components/clix/toolMarks.tsx` has all twelve as clix's OWN artwork,
 * lifted from the real company site. Same data module /clix's ClixLogoProof renders.
 */

import { TOOL_MARKS } from "../clix/toolMarks";

export default function CompanyTools() {
  return (
    /* `Investors` — bg `surface` #f5f5f5, pad `96/64px` + gutter. Light band, so the nav
       theme scanner reads it as light. */
    <section
      data-nav-theme="light"
      className="w-full bg-surface px-4 py-16 tablet:px-10 desktop:py-24"
    >
      {/* Container — max-w 1280, column, gap 32 on phone and 40 from 810. */}
      <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-8 tablet:gap-10">
        {/* Title — a 490px column at every tier. */}
        <div className="w-full max-w-[490px]">
          {/* Same h3 preset the whole page shares: 44/40/32, weight 400, 110%, −0.05em.
              The break is HARD, not a natural wrap — the original's captured text
              concatenates without a space, so the two lines are fixed by the markup and
              each line was fitted to sit on one line at every tier. */}
          <h2
            className="w-full font-display text-[32px] font-normal text-ink tablet:text-[40px] desktop:text-[44px]"
            style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
          >
            Built On Tools
            <br />
            Your Team Already Uses
          </h2>
        </div>

        {/* The grid — 1 → 2 → 3 columns, gap 24 at every tier. */}
        <ul className="grid w-full list-none grid-cols-1 gap-6 p-0 tablet:grid-cols-2 desktop:grid-cols-3">
          {TOOL_MARKS.map((tool) => (
            <li
              key={tool.name}
              /* Tile: min-height 180, padding 0, flex column, centred, gap 10.
                 `relative` is what the border overlay below anchors to. */
              className="relative flex min-h-[180px] w-full flex-col items-center justify-center gap-[10px] p-0"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 border-t border-l border-muted/15"
              />
              <svg
                viewBox="0 0 24 24"
                /* Eleven marks are `currentColor` and follow `color`. monday.com's three
                   shapes carry their own `fill` attributes, which lose to ANY css rule —
                   `[&_*]:fill-current` tints it without touching the others, whose
                   stroke-drawn paths a blanket fill override would flood. Everything sits at
                   `ink`, matching the label, because rogo's own twelve wordmarks here are
                   near-black and one coloured tile among twelve would break the block.
                   Mark size (32px, 40px from 1200) is OURS, not measured: rogo's tiles hold
                   logo artwork of varying size and no text at all. */
                className={`h-8 w-8 flex-none text-ink desktop:h-10 desktop:w-10 ${
                  tool.mono ? "" : "[&_*]:fill-current"
                }`}
                fill={tool.mono ? "currentColor" : undefined}
                /* Decorative: the tool's name sits directly below as real text, so labelling
                   the glyph too would double-announce every tile. */
                aria-hidden="true"
                focusable="false"
              >
                {tool.glyph}
              </svg>
              {/* Label typography is OURS, not measured — the original's tiles hold artwork
                  and carry no text to measure. 16px, 20px from 1200, weight 400, 110%,
                  −0.02em, matching the page's display face. */}
              <span
                className="text-center font-display text-[16px] font-normal text-ink desktop:text-[20px]"
                style={{ lineHeight: "110%", letterSpacing: "-0.02em" }}
              >
                {tool.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
