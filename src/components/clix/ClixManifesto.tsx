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

/* CLIX'S OWN WORDS as of 2026-08-10 (user: "change the statement on the green section ...
   very related to clix on the services and the service that they provide"). This block was
   rogo's five verbatim paragraphs about Felix; it is the first part of the page to be
   properly rewritten rather than renamed.

   Sourced from the real company site, not invented: `docs/reference/clixsolutions/` lists
   eight services (AI agents, WhatsApp automations, CRM implementation, integrations and
   automations, websites, mobile, custom software, AI strategy) under the line "we build the
   quiet mechanisms that drive modern businesses". Paragraphs 3 and 4 name those services;
   the spine of paragraph 3 is that line, in English.

   ⚠️ NO DASHES, at the user's explicit request. No em dashes, no en dashes, and no hyphen
   standing in for one. Commas, colons and full stops only. The original had a " - " in its
   last paragraph, so this is a change from the source rather than a coincidence of style.

   Shape is deliberately the original's, because the layout was measured against it: five
   paragraphs, the second carrying an internal line break (a short line, then a long one). */
const PARAGRAPHS = [
  "Most teams do not have a software problem. They have a hundred small handoffs that nobody owns.",
  "Copy this into that. Chase the reply. Update the sheet.\nNone of it is difficult. All of it takes someone’s afternoon, every day, and none of it ever shows up as work that anyone gets credit for.",
  "Clix builds the quiet mechanisms that take those hours back. AI agents that answer, qualify and follow up in your own language and on your own data. WhatsApp assistants that sell and support where your customers already are. Integrations that keep your CRM, your calendar and your billing telling the same story.",
  "Where nothing off the shelf fits, we build it: custom software, internal dashboards, mobile apps, and the webhooks and middleware that hold them together. Monitoring, retries and error handling come as standard, because an automation nobody trusts is worse than no automation at all.",
  "The point was never the technology. It is that your team spends its day on the judgment, the relationships and the decisions only people can make, and not on the busywork in between.",
];

export default function ClixManifesto() {
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
               every tier, which is how the target sets it. 240px on phone does the same at
               the smaller size. The copy changed on 2026-08-10 (was "The future state of
               finance"); the replacement was kept to a similar length so it still breaks
               to two lines rather than three. */
            className="h-auto w-full max-w-[240px] flex-none font-display text-paper
                       text-[40px] tablet:max-w-[300px] tablet:text-[48px]"
            style={{ letterSpacing: "-0.05em", lineHeight: "110%" }}
          >
            The systems behind the work
          </h2>

          <div className="h-auto w-full flex-none">
            {PARAGRAPHS.map((p, i) => (
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
