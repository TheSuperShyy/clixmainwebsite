/**
 * CareersHero — clone of rogo.com/careers block `Hero` (`#hero`).
 *
 * Capture: docs/reference/target/rogo-careers-2026-08-12.{html,css}, every value re-read from
 * the LIVE page over CDP at 1600/1440/1024/390. Capture and live agree.
 * Spec: features/careers-page/FEATURE.md · memory: features/careers-page/CONTEXT.md
 *
 * SERVER COMPONENT ON PURPOSE. Nothing here is stateful: the only motion is the CTA's two
 * corner brackets sliding inward, which is pure CSS `group-hover`. So no `"use client"`, and
 * this block ships zero JS. (Contrast ProductHero.tsx, which is a client component only
 * because of its typing loop — not because of the CTA it shares with this file.)
 *
 * COPY IS CLIX'S OWN as of 2026-08-12 (user: "in the career section, lets personalize it now,
 * with the headers and subheaders, for the jobs i will follow up later"). It was rogo's
 * verbatim until then, under the standing "clone now, rewrite after" decision; this is the
 * "after".
 *
 * ⚠️ THE HEADLINE IS THE USER’S OWN SENTENCE, CHOSEN VERBATIM ON 2026-08-12 over four
 * measured alternatives, AND IT IS THE REASON THE MEASURED HEIGHTS BELOW NO LONGER HOLD.
 * It is 60 characters against rogo’s 44. The ceiling for keeping this block’s geometry was
 * 44 — probed, not estimated: every candidate at or under 44 chars set in 2 lines at
 * 1600/1440 and 4 at 390, and 45 broke the phone tier. At 60 it sets in 3 lines and 6, so
 * #hero measures 613 / 613 / **479** / 707 where the target measures 529 / 529 / 479 / 585.
 * That is a copy decision with a geometry consequence, made with the numbers on the table.
 * Do NOT trim the sentence to reclaim the height: the heights are the target’s, this page’s
 * copy is no longer the target’s, and the divergence is recorded in FEATURE.md.
 *
 * ⚠️ NOTE THE TABLET COLUMN: 1024 DID NOT MOVE. The 72px type against a 944px measure still
 * sets this sentence in 2 lines, exactly as rogo’s 44-character one did. That is measured,
 * not reasoned — I predicted 542 there and the probe said 479. Predict nothing about wrapping.
 *
 * ⚠️ IT BREAKS MID-HYPHEN at 1440 and 390 (“next-” / “generation”). Breaking after a hyphen
 * is correct UA behaviour and there is no clean fix at the phone tier: wrapping the compound
 * in `white-space: nowrap` makes an unbreakable 15-character run, which at 64px is wider
 * than the 358px viewport and would be CLIPPED by the section’s own `overflow-hidden`. Dropping
 * the hyphen (“next generation”) removes the break, keeps the line count, and is the only
 * change that would fix it. Flagged to the user 2026-08-12; left as written pending their
 * call, because it is their sentence.
 *
 * The rest of the page’s copy is the manifesto’s: /clix's green band opens "we build the
 * quiet mechanisms that drive modern businesses". See ClixManifesto.tsx and CareersAbout.tsx.
 *
 * NO DASHES ANYWHERE IN CLIX COPY — no em dash, no en dash, no hyphen standing in for one
 * (user's standing request, 2026-08-10, recorded in ClixManifesto.tsx). Commas, colons and
 * full stops only. It governs every editorial string on this page, not just this one. (It does
 * not govern these comments, which are not copy.)
 *
 * ⚠️ THIS DOES NOT LIFT THE NOINDEX. The second reason still holds: the three job rows are
 * invented. See the header of src/app/careers/page.tsx.
 *
 * TIER MAP — three sizes, not four. XL (>=1600) and desktop (1200-1599.98) share every value
 * in this block; the live sweep found no `min-width:1600px` divergence for any class here.
 * Only tablet (810-1199.98) and phone (<=809.98) differ. Written mobile-first: base = phone,
 * `tablet:` = >=810, `desktop:` = >=1200.
 *
 * WHY 198px OF TOP PADDING: the nav is `position:fixed` on this route (same header class as /,
 * /news and /product), so nothing in flow reserves its height. This padding IS the clearance
 * for the announcement banner + nav row. It is not a spacing choice and must not be tuned.
 *
 * NO BACKGROUND. The section is transparent over the page's white; `paper` comes from <body>.
 * Declaring a ground colour here would be wrong the moment that ground changes.
 *
 * MEASURED HEIGHTS, as the arithmetic check that the values below are the right ones:
 *   1600/1440  613 = 198 + (3 lines x 88 x 95% = 250.8) + 44 + 40 + 80   (target 529, 2 lines)
 *   1024       479 = 198 + (2 lines x 72 x 95% = 136.8) + 24 + 40 + 80   (target 479, unchanged)
 *   390        707 = 198 + (6 lines x 64 x 95% = 364.8) + 24 + 40 + 80   (target 585, 4 lines)
 * ONLY THE LINE COUNT CHANGED. Every other term in all three sums is the target's and is
 * untouched; the block-diffs still report ALL MATCH. See the headline note above for why.
 * The multi-line phone wrap is a consequence of the 360px cap on `Text & Button`, not of the
 * viewport — which is why that cap is a measured value and not a guard.
 */

/* ---------------------------------------------------------------------------------------
 * The two corner brackets that frame the CTA. 14x20 each, ink fill, path data verbatim from
 * the capture's <use> defs.
 *
 * COPIED VERBATIM FROM src/components/product/ProductHero.tsx, deliberately, rather than
 * extracted to a shared module: this repo keeps per-page local copies of Framer-derived SVG so
 * that a later measurement on one page cannot silently move another. The two pages agreeing
 * today is a finding, not a contract.
 *
 * ⚠️ THE CAPTURE'S VARIANT CLASS IS STALE ON THIS PAGE TOO. The frozen HTML declares the
 * button as `framer-5Atru framer-velzew framer-v-velzew` (data-framer-name "Primary – Start"),
 * whose base rule puts the brackets at top:-22/left:-48 and bottom:-22/right:-48. React swaps
 * the variant on hydration to `framer-v-q741vz` ("Primary – End"), so the rules that actually
 * apply are top:-12/left:-28 and bottom:-12/right:-28. Confirmed by computed style on the live
 * page 2026-08-12: leftDelta {dx:-28, dy:-12} against a 220x40 box, right mirrored. Those are
 * the SAME numbers /product recorded — independently re-probed here, not assumed.
 *
 * The hover rule `.framer-v-q741vz.hover` slides them IN to top:-2/left:-18, bottom:-2/right:-18.
 * The DURATION AND EASING ARE NOT IN THE CAPTURE (Framer animates it in JS; the sheet's only
 * transition is `color .3s`), so 300ms / --ease-rogo is OURS and is flagged as estimated in
 * FEATURE.md — the same estimate /product carries, kept in step on purpose.
 * ------------------------------------------------------------------------------------- */
function BracketLeft({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className={className} style={style} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.79688 3.46116H9.91357H9.91659L13.4974 3.45815V0H9.79311C6.9863 0 5.28776 1.13565 4.79688 3.46116Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.89277 3.46004C1.49238 3.46004 0.875 4.03841 0.875 5.4783V20.0007H4.63347V5.02645C4.63347 4.4511 4.68768 3.93298 4.79007 3.45703H4.78405L2.89277 3.46004Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BracketRight({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className={className} style={style} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.19531 16.5388H4.07861H4.0756L0.494816 16.5419V20H4.19908C7.00588 20 8.70442 18.8644 9.19531 16.5388Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.0994 16.54C12.4998 16.54 13.1172 15.9616 13.1172 14.5217V-0.000717163H9.35872V14.9735C9.35872 15.5489 9.30451 16.067 9.20211 16.543H9.20814L11.0994 16.54Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function CareersHero() {
  return (
    /* Measured: column, place-content:center, align-items:center, gap 96, width 100%,
       overflow hidden, padding 198/40/80 (phone 198/16/80).
       `gap-24` (=96) and `place-content-center` are INERT with a single child — kept because
       they are what the original computes to, and because the next thing added to this section
       will expect them. Dropping them would be a silent divergence, not a cleanup.
       `overflow-hidden` IS load-bearing at the phone tier: the left bracket sits 28px outside
       the 220px CTA box, and it is the section, not the CTA frame, that clips it. */
    <section
      id="hero"
      data-nav-theme="light"
      className="relative flex w-full flex-col place-content-center items-center gap-24
                 overflow-hidden px-4 pt-[198px] pb-20 tablet:px-10"
    >
      {/* Text & Button — gap 44 at >=1200, 24 below. The 360px cap is a PHONE-ONLY rule and is
          what forces the headline to four lines at 390; from tablet up the measure is the
          960px Text Container's job. */}
      <div
        className="flex w-full max-w-[360px] flex-col items-center justify-center gap-6
                   tablet:max-w-none desktop:gap-11"
      >
        {/* Text Container — max-w 960, gap 16. The gap is inert (one child, in the original's
            rendered output as in ours) but is the measured value; same reasoning as above. */}
        <div className="flex w-full max-w-[960px] flex-col items-center justify-center gap-4">
          {/* h1 88/88/72/64, line-height 95%, tracking -0.06em except phone -0.05em — the
              preset's own tiering, byte-identical to /news's `Updates` h1, so it is a site
              preset and not a per-page choice.
              Face is `--font-display` (Discovery), the site's one-face substitution for the
              original's "ABC Arizona Mix Regular" (licensing, sitewide decision 2026-08-08).
              `text-wrap: balance` applies at EVERY tier here — unlike /product's h1, where the
              capture scopes it to tablet only. */}
          <h1
            className="w-full text-center text-balance font-display font-normal text-ink
                       text-[64px] tracking-[-0.05em]
                       tablet:text-[72px] tablet:tracking-[-0.06em]
                       desktop:text-[88px]"
            style={{ lineHeight: "95%" }}
          >
            Join us in engineering the core of next-generation software.
          </h1>
        </div>

        {/* CTA — a 220x40 frame with the brackets positioned OUTSIDE it, which is why the frame
            is `relative` and the clipping is left to the section. `group` drives the bracket
            hover; `shrink-0` stops the 40px height collapsing in the flex column.

            HREF: the original's own CTA points at `./careers#roles` — same page, written in
            absolute form. Ours is the bare fragment `#roles`, which resolves to CareersRoles'
            section id. Same destination, no navigation. */}
        <div className="group relative h-10 w-[220px] shrink-0">
          <BracketLeft
            className="pointer-events-none absolute -top-3 -left-7 text-ink
                       transition-[top,left] duration-300
                       group-hover:-top-0.5 group-hover:-left-[18px]"
            style={{ transitionTimingFunction: "var(--ease-rogo)" }}
          />
          <BracketRight
            className="pointer-events-none absolute -right-7 -bottom-3 text-ink
                       transition-[bottom,right] duration-300
                       group-hover:-right-[18px] group-hover:-bottom-0.5"
            style={{ transitionTimingFunction: "var(--ease-rogo)" }}
          />
          <a
            href="#roles"
            className="flex h-10 w-full items-center justify-center gap-2 overflow-hidden
                       rounded-[6px] border border-transparent bg-ink px-4 py-2
                       transition-opacity duration-300 hover:opacity-90
                       focus-visible:ring-2 focus-visible:ring-ink
                       focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                       focus-visible:outline-none"
            style={{ transitionTimingFunction: "var(--ease-rogo)" }}
          >
            {/* h-5 + 1px top padding is the site's fixed button-label anatomy (Hero, Nav,
                /news and /product all carry it). `whitespace-pre` is required: the original's
                <a> is width:min-content and must not wrap "See Careers". */}
            <span className="flex h-5 items-center justify-center gap-[10px] pt-px">
              <span
                className="font-sans text-[16px] font-medium whitespace-pre text-paper"
                style={{ lineHeight: "1em", letterSpacing: "-0.01em" }}
              >
                See Careers
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
