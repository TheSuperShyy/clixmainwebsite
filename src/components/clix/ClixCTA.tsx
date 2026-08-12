/**
 * ClixCTA — clone of rogo.com/felix `CTA` (`.framer-4o5umq`).
 * Measured from the 2026-08-09 capture. Spec: features/felix-page/FEATURE.md.
 *
 * The inner panel has a HARD 400px height at >=810 and collapses to `min-content` on phone.
 * That is why the block reads as a band rather than as centred text: the 400px is doing the
 * spacing, not padding.
 */

import AppLink from "@/components/ui/AppLink";

export default function ClixCTA() {
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
          {/* Was "Staff Felix today." Renamed 2026-08-10 with the rest of the page.
              LENGTH IS A CONSTRAINT HERE, not just taste: this is 80/72/56px with
              `white-space:pre` at >=810, so it can never wrap. The original is 18 characters
              and at the tablet tier (72px, 730px of usable width) that is close to the
              limit, so the replacement was held to 16. Do not lengthen it without checking
              810px. */}
          <h2
            /* `white-space:pre` at >=810 — the headline is one line and must not wrap.
               Phone releases it to `pre-wrap` with a 300px measure. */
            className="h-auto w-full max-w-[300px] flex-none text-center font-display
                       text-forest text-[56px]
                       tablet:w-auto tablet:max-w-none tablet:whitespace-pre tablet:text-[72px]
                       desktop:text-[80px]"
            style={{ letterSpacing: "-0.05em", lineHeight: "110%" }}
          >
            Build with Clix.
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
                Request Access
              </span>
            </span>
          </AppLink>
        </div>
      </div>
    </section>
  );
}
