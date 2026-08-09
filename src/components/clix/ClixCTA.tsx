/**
 * ClixCTA — clone of rogo.com/felix `CTA` (`.framer-4o5umq`).
 * Measured from the 2026-08-09 capture. Spec: features/felix-page/FEATURE.md.
 *
 * The inner panel has a HARD 400px height at >=810 and collapses to `min-content` on phone.
 * That is why the block reads as a band rather than as centred text: the 400px is doing the
 * spacing, not padding.
 */

export default function ClixCTA() {
  return (
    <section
      id="clix-contact"
      data-nav-theme="light"
      className="relative z-[1] flex h-min w-full flex-col items-center justify-center gap-20
                 overflow-clip bg-paper px-4 py-20 tablet:px-10 tablet:py-24"
    >
      {/* Width Container — gap 72 */}
      <div className="relative flex h-min w-full max-w-[var(--container-max)] flex-col
                      items-center justify-center gap-[72px]">
        {/* CTA Container — 400px tall, radius 6, gap 32 */}
        <div className="relative flex h-min w-full flex-col items-center justify-center gap-8
                        overflow-clip rounded-[6px] tablet:h-[400px]">
          <h2
            /* `white-space:pre` at >=810 — the headline is one line and must not wrap.
               Phone releases it to `pre-wrap` with a 300px measure. */
            className="h-auto w-full max-w-[300px] flex-none text-center font-display
                       text-forest text-[56px]
                       tablet:w-auto tablet:max-w-none tablet:whitespace-pre tablet:text-[72px]
                       desktop:text-[80px]"
            style={{ letterSpacing: "-0.05em", lineHeight: "110%" }}
          >
            Staff Felix today.
          </h2>

          {/* Same `Brand` button as the hero — 48px tall here at every tier, since the
              original's mobile-only 44px variant is a hero-specific instance. */}
          <a
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
              <span
                className="font-sans text-[16px] font-medium text-paper"
                style={{ lineHeight: "1em", letterSpacing: "-0.01em" }}
              >
                Request Access
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
