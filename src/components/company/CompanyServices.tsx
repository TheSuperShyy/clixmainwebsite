/**
 * CompanyServices — Block 3 of /company, the band Framer names `Team`.
 *
 * THE BOX IS ROGO'S, THE CONTENT IS CLIX'S. Every geometry value below is measured from
 * rogo.com/company's `Team` band (docs/reference/target/rogo-company-2026-08-12.html + .css)
 * and is reproduced exactly. What changed is what sits inside the eight tiles.
 *
 * The original fills this grid with the employer logos of the firms its staff came from,
 * under the headline "Built By Former Bankers, Investors and AI Experts". clix has no such
 * wall to show, and the standing rule on this project is no third-party marks, so the tiles
 * carry clix's own eight services instead. Source of that list:
 * docs/reference/clixsolutions/README.md:173-182. The band is otherwise untouched: same
 * padding, same gaps, same 4 → 4 → 1 grid, same 164px tile, same rule colour.
 *
 * Spec: features/company-page/FEATURE.md ("Block 3 — Team")
 * Memory: features/company-page/CONTEXT.md
 *
 * TIER MAP — measured at 1600/1440/1024/390. 1600 and 1440 are identical on this page, so
 * there is no `xl:` variant anywhere in the file.
 *
 * |                 | ≥1200        | 810–1199     | ≤809          |
 * |-----------------|--------------|--------------|---------------|
 * | band padding    | `96px 40px`  | `64px 40px`  | `64px 16px`   |
 * | container gap   | 80           | 40           | 32            |
 * | text max-width  | 640          | 540          | none          |
 * | grid columns    | **4**        | **4**        | **1**         |
 * | tile            | 308 × 164    | 224 × 164    | 358 × 164     |
 * | grid gap        | 16           | 16           | 16            |
 * | grid box        | 1280 × 344   | 944 × 344    | 358 × 1424    |
 *
 * ⚠️ It goes **4 → 4 → 1**. There is no 2-column tier, so the obvious
 * `grid-cols-1 → 2 → 4` ladder is wrong here. Checks: `2 rows × 164 + 16 = 344` ✓ and
 * `8 × 164 + 7 × 16 = 1424` ✓.
 *
 * ⚠️ The border matrix is UNIFORM — one class string, no per-cell variants. This is the
 * opposite of `src/components/sections/Security.tsx`, which needs a hand-authored per-cell,
 * per-tier matrix. Here **every** tile is top + inline-end, at **every** tier, colour
 * `#73737326` (= `muted` at 15%). It was worth reading rather than assuming, and it was read
 * off the `--border-*-width` custom properties: Framer paints these with
 * `[data-border]::after`, so a plain `borderWidth` read returns `0px` and tells you nothing.
 *
 * The edge is written LOGICALLY (`border-e`). Verified in Chrome: at `direction: ltr` the tile
 * computes `border-right-width: 1px` / `border-left-width: 0px`, which is exactly what
 * `border-r` computed before, so the measured English value did not move; at `dir=rtl` it
 * mirrors to the left edge, along with the grid's own column order.
 *
 * The rule is painted as an absolutely positioned overlay span rather than a real `border`,
 * because a real border is laid out — it would render the 164px tile at 166px and push the
 * 344px grid to 348. Same technique, same reason, as ProductDataPartners.tsx:152.
 */

import { getDict } from "@/lib/i18n/server";
import { SERVICE_GLYPHS } from "./serviceGlyphs";

export default function CompanyServices() {
  /* The eight labels, the heading and the intro all live in the dictionary now. Every
     label was fitted to ONE rendered line at every tier by measurement, not by character
     count — see en/company.ts and he/company.ts, where three of the eight Hebrew names
     are LONGER than their English counterparts and the fit is recorded. */
  const t = getDict().company.services;

  return (
    <section
      /* The nav crosses a `bone` ground here, so it reads as a light block. */
      data-nav-theme="light"
      className="relative flex w-full flex-col items-center justify-start overflow-hidden bg-bone px-4 py-16 tablet:px-10 desktop:py-24"
    >
      {/* Container — max-w 1280, column, gap 32 → 40 → 80. */}
      <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-8 tablet:gap-10 desktop:gap-20">
        {/* Text Container — gap 10, and a max-width that only exists from 810 up.
            Measured boxes: h3 96.8 / 88 / 70.4, intro 70.2 / 62.4 / 104. */}
        <div className="flex w-full flex-col justify-center gap-[10px] tablet:max-w-[540px] desktop:max-w-[640px]">
          {/* The h3 preset shared by Mission, Team, Investors and Reiteration:
              44 / 40 / 32, weight 400, 110%, −0.05em, `ink`. Byte-identical to /product's.
              Unlike this page's other three h3s, this one wraps NATURALLY into two lines at
              every tier — no hard break, so no `<br />` and no split spans. */}
          <h2
            className="w-full font-display text-[32px] font-normal text-ink tablet:text-[40px] desktop:text-[44px]"
            style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
          >
            {t.title}
          </h2>
          {/* Body preset: 18px from 1200, 16 below; 130%, −0.02em, `muted`. */}
          <p
            className="w-full font-sans text-[16px] font-normal text-muted desktop:text-[18px]"
            style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
          >
            {t.intro}
          </p>
        </div>

        {/* The grid. Semantic list, marker suppressed. 4 columns from 810 up, 1 below. */}
        <ul className="grid w-full list-none grid-cols-1 gap-4 tablet:grid-cols-4">
          {t.items.map((service, i) => {
            /* Positional pairing, not a name lookup — the Hebrew tuple is eight different
               strings. See the roster note in serviceGlyphs.tsx. */
            const ServiceGlyph = SERVICE_GLYPHS[i];
            return (
              <li
                key={service}
                /* Tile: min-height 164, padding 0, centred column, gap 10. `relative` so the
                   rule overlay below has something to anchor to. `group` so the mark can
                   answer a hover on the whole tile rather than only on itself. */
                className="group relative flex min-h-[164px] w-full flex-col items-center justify-center gap-[10px] p-0"
              >
                {/* Uniform top + inline-end rule, `#73737326`. Overlay, not a real border — see
                    the file header for why. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 border-t border-e border-muted/15"
                />
                {/* THE MARK. Also ours, also not measured — rogo's tiles hold a logo and
                    nothing else, so there is no icon slot in the capture to copy. Drawn to
                    sit where those logos sat: 32px square, `muted` at rest so the label stays
                    the loudest thing in the tile, `ink` on hover with a 2px lift. Both
                    transitions run on the site's own 300ms / `--ease-rogo` link preset.
                    `aria-hidden` lives on the <svg> — the label below says the same thing. */}
                <ServiceGlyph className="relative h-8 w-8 text-muted transition-[color,transform] duration-300 [transition-timing-function:var(--ease-rogo)] group-hover:-translate-y-0.5 group-hover:text-ink motion-reduce:transition-none motion-reduce:group-hover:translate-y-0" />
                {/* ⚠️ THIS TYPE IS OURS, NOT MEASURED. rogo's tiles hold logo artwork and no
                    text at all, so there is no computed style to copy for a label. Sized to
                    sit where those logos sat: display face, weight 400, `ink`, centred, and
                    the page's standard −0.02em tracking. */}
                <span
                  className="relative text-center font-display text-[16px] font-normal text-ink desktop:text-[20px]"
                  style={{ lineHeight: "110%", letterSpacing: "-0.02em" }}
                >
                  {service}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
