/**
 * ClixCTA — clone of rogo.com/felix `CTA` (`.framer-4o5umq`).
 * Measured from the 2026-08-09 capture. Spec: features/felix-page/FEATURE.md.
 *
 * The inner panel has a HARD 400px height at >=810 and collapses to `min-content` on phone.
 * That is why the block reads as a band rather than as centred text: the 400px is doing the
 * spacing, not padding.
 */

import AppLink from "@/components/ui/AppLink";
import { getDict } from "@/lib/i18n/server";

export default function ClixCTA() {
  const t = getDict().clix.cta;

  return (
    /* NO BACKGROUND, and that is measured: every block on the target is transparent —
         the shared fixed backdrop is the only thing on the page that paints a colour.
         `bg-paper` was here until 2026-08-10 and it was mine, not the capture's. It broke
         the bottom of the green section: an opaque white block slides up OVER the dark
         ground, so the dark runway the target shows after the manifesto could not exist.
         See ClixBackdrop.tsx. */
    <section
      id="clix-contact"
      data-nav-theme="light"
      className="relative z-[1] flex h-min w-full flex-col items-center justify-center gap-20
                 overflow-clip px-4 py-20 tablet:px-10 tablet:py-24"
    >
      {/* Width Container — gap 72 */}
      <div
        className="relative flex h-min w-full max-w-[var(--container-max)] flex-col
                      items-center justify-center gap-[72px]"
      >
        {/* CTA Container — 400px tall, radius 6, gap 32 */}
        <div
          className="relative flex h-min w-full flex-col items-center justify-center gap-8
                        overflow-clip rounded-[6px] tablet:h-[400px]"
        >
          {/* Was "Staff Felix today." Renamed 2026-08-10, then moved to
              src/lib/i18n/{en,he}/clix.ts on 2026-08-12 as `clix.cta.title`.

              LENGTH IS A CONSTRAINT HERE, not just taste: this is 80/72/56px with
              `white-space:pre` at >=810, so it can never wrap.

              ⚠️ AND THE CONSTRAINT IS INK WIDTH, NOT CHARACTER COUNT. The note that used to
              live here pinned it at "16 characters", which is a Latin advance-width proxy and
              does not transfer to another script. The real ceiling is the rendered width at
              the tightest tier, which is exactly 810px viewport: 72px type inside 730px of
              usable measure (1280 container, `tablet:px-10`). Measured in Discovery at 72px
              with -0.05em:

                  en  "Build with Clix."   372.4px ink   357.6px spare
                  he  "בואו נבנה משהו"     386.0px ink   344.0px spare

              Both clear by a wide margin, so the 16-character ceiling was never the binding
              constraint — and Hebrew is 13.6px WIDER here, not shorter, which is the opposite
              of the site-wide pattern and the reason it was measured rather than assumed.

              ⚠️ THE PHONE TIER IS WHERE THE TWO LOCALES DIVERGE, and it is recorded rather
              than tuned away. On phone the headline is `pre-wrap` in a 300px measure at 56px.
              English sets ONE line (289.6px of ink in 300px). Hebrew sets TWO: its ink is
              300.2px, over the measure by 0.2px. That grows this block by 61.6px on the phone
              tier only (`clix-contact` 301.6px -> 363.2px, measured on the built page).

              Kept, on evidence: rogo's own string, "Staff Felix today.", ALSO sets two lines
              in this measure. The 300px cap exists precisely to make this headline wrap, so
              two lines is the target's behaviour and it is the current English replacement
              that is the outlier at one. */}
          <h2
            /* `white-space:pre` at >=810 — the headline is one line and must not wrap.
               Phone releases it to `pre-wrap` with a 300px measure. */
            className="h-auto w-full max-w-[300px] flex-none text-center font-display
                       text-forest text-[56px]
                       tablet:w-auto tablet:max-w-none tablet:whitespace-pre tablet:text-[72px]
                       desktop:text-[80px]"
            style={{ letterSpacing: "-0.05em", lineHeight: "110%" }}
          >
            {t.title}
          </h2>

          {/* Same `Brand` button as the hero — 48px tall here at every tier, since the
              original's mobile-only 44px variant is a hero-specific instance. */}
          <AppLink
            href="/#contact"
            className="relative flex h-12 w-min flex-none cursor-pointer items-center
                       justify-center gap-2 overflow-hidden rounded-[6px] border
                       border-transparent bg-forest px-4 py-2 no-underline
                       transition-opacity duration-300 hover:opacity-90
                       focus-visible:ring-2 focus-visible:ring-forest
                       focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                       focus-visible:outline-none"
            style={{ transitionTimingFunction: "var(--ease-rogo)" }}
          >
            <span className="flex h-5 items-center justify-center gap-[10px] pt-px">
              {/* `whitespace-pre` — the original's own value on this node, and required:
                  the anchor is `width: min-content`, so without it the label wraps at the
                  space. Same fix as the hero's button. */}
              <span
                className="font-sans text-[16px] font-medium whitespace-pre text-paper"
                style={{ lineHeight: "1em", letterSpacing: "-0.01em" }}
              >
                {t.button}
              </span>
            </span>
          </AppLink>
        </div>
      </div>
    </section>
  );
}
