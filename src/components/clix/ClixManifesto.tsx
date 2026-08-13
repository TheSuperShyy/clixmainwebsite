/**
 * ClixManifesto — clone of rogo.com/felix `Manifesto` (`.framer-tyl85t`).
 * Measured from the 2026-08-09 capture. Spec: features/felix-page/FEATURE.md.
 *
 * THIS BLOCK NO LONGER OWNS ITS BACKGROUND. The page's fixed ground crossfades to dark
 * around it on scroll, which is what the target does — see ClixBackdrop.tsx, which holds the
 * mechanism, the timing and the live-screenshot evidence for both. `ClixBackdrop` makes this
 * section transparent as soon as that animation is live.
 *
 * The `bg-forest-deep` below is therefore a FALLBACK, not the design: it is what shows with
 * JS off, before hydration, and under `prefers-reduced-motion`. The type here is white, so
 * something has to be dark underneath it in every one of those states. Do not remove it
 * because "the backdrop handles it" — the backdrop only handles it when JS runs.
 *
 * ⚠️ THE BOTTOM PADDING IS NOT THE MEASURED VALUE. The capture says `164px 40px 64px`; this
 * ships 164px top AND bottom (2026-08-10, user: "a white space similar and equal to the space
 * on top. Now add it on the bottom as well").
 *
 * It is compensating for a block we do not build. In the target, the dark runway after the
 * last paragraph is this block's 64px PLUS the 256px top padding of `Product Visuals` —
 * 320px of empty green before anything else appears, which is the effect the user was
 * pointing at. Ours runs straight into `Testimonial` (`pt` 128px), so the measured 64px gave
 * only 192px. Matching the top instead gives 292px — near the target's 320 without touching
 * block 6's own measured padding.
 *
 * So when `Product Visuals` lands, PUT THIS BACK to `pb-16`. The runway becomes the target's
 * again on its own, and leaving 164px here would then overshoot by 100px.
 *
 * Phone was already symmetric (`py-32`, 128px both ends) and is untouched.
 */

import { getDict } from "@/lib/i18n/server";

/* THE COPY MOVED TO src/lib/i18n/{en,he}/clix.ts ON 2026-08-12. What used to be a
   `PARAGRAPHS` const here is `clix.manifesto.paragraphs`; nothing about the block changed.
   Its provenance, the five-paragraph shape and the no-dashes rule are all recorded beside the
   strings there.

   ⚠️ THE TWO LOCALES DO NOT SAY THE SAME THING HERE, ON PURPOSE. English is this repo's own
   2026-08-10 rewrite about clix's services. Hebrew is not a translation of it: it is a
   RESTORATION from docs/reference/clixsolutions/ — the services page's own paragraphs and the
   methodology line, in the words the real company already published. See he/clix.ts. */

export default function ClixManifesto() {
  const t = getDict().clix.manifesto;

  return (
    <section
      id="manifesto"
      /* `light`, NOT `dark` — corrected 2026-08-09 from a live screenshot. The target keeps
         a solid WHITE bar with dark content over this section even though the ground behind
         it is dark green. Ours flipped the bar to ink, which was our own invention. */
      data-nav-theme="light"
      className="relative z-[1] flex h-min w-full flex-col items-center justify-center gap-20
                 overflow-clip bg-forest-deep px-4 py-32
                 tablet:px-10 tablet:pt-[164px] tablet:pb-[164px]"
    >
      {/* Width Container — gap 48, phone 16.
          The id is ClixBackdrop's handle for the text fade-in (2026-08-10, user watching
          rogo: the section arrives BLANK — dark ground, no words — "i can see the text
          becoming visible when i scroll down"). The backdrop zeroes this block's opacity
          inside matchMedia only, so SSR / JS-off / reduced-motion all keep it visible; the
          fallback background above guarantees those states a dark ground to read on. */}
      <div
        id="manifesto-content"
        className="relative flex h-min w-full max-w-[var(--container-max)] flex-col
                      items-center justify-center gap-4 tablet:gap-12"
      >
        {/* The text column is 550px, NOT the container — and it is left-aligned inside a
            centred parent, which is what gives the block its off-centre feel. */}
        <div
          className="relative flex h-min w-full max-w-[550px] flex-col items-start
                        justify-center gap-6 px-6 tablet:gap-10 tablet:px-0"
        >
          <h2
            /* max-width 300px is deliberate: it forces the title to wrap to two lines at
               tablet and above, which is how the target sets it. The copy changed on
               2026-08-10 (was "The future state of finance"); the replacement was kept to a
               similar length so it still breaks to two lines rather than three.

               ⚠️ CORRECTION, 2026-08-12: this note used to claim "240px on phone does the
               same at the smaller size". It does not. Measured on the built page in
               Discovery, the ENGLISH title sets THREE lines at 40px in the 240px phone
               measure, at every viewport from 390px down. So the two-line invariant holds at
               tablet+ only, and the phone tier has always been three lines. Recorded because
               the Hebrew title was fitted against this file's claim and had to be fitted
               against the measurement instead: "המנגנונים שמאחורי העבודה" matches English
               exactly, 2 lines at 48px/300px and 3 at 40px/240px. */
            className="h-auto w-full max-w-[240px] flex-none font-display text-paper
                       text-[40px] tablet:max-w-[300px] tablet:text-[48px]"
            style={{ letterSpacing: "-0.05em", lineHeight: "110%" }}
          >
            {t.title}
          </h2>

          <div className="h-auto w-full flex-none">
            {t.paragraphs.map((p, i) => (
              <p
                key={i}
                /* `-0.2px` is an absolute letter-spacing, not an em value — the original
                   mixes the two and this block uses px. Do not convert it. */
                className="font-sans text-[20px] whitespace-pre-line text-paper/70
                           [&:not(:first-child)]:mt-[1.4em]"
                style={{ letterSpacing: "-0.2px", lineHeight: "140%" }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
