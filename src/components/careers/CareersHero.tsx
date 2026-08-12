/**
 * CareersHero — clone of rogo.com/careers block `Hero` (`#hero`).
 *
 * Capture: docs/reference/target/rogo-careers-2026-08-12.{html,css}, every value re-read from
 * the LIVE page over CDP at 1600/1440/1024/390. Capture and live agree.
 * Spec: features/careers-page/FEATURE.md · memory: features/careers-page/CONTEXT.md
 *
 * SERVER COMPONENT, and since 2026-08-12 it is a single heading and nothing else.
 *
 * ⚠️ THE CTA WAS REMOVED (user: "remove this section we dont need job offering for now also
 * remove the see career button"). It was a 220×40 "See Careers" button pointing at `#roles`,
 * framed by two 14×20 corner brackets that slid inward on `group-hover`. It went with the
 * band it pointed at — keeping it would have left the page's only call to action aimed at a
 * fragment that no longer exists. `BracketLeft` / `BracketRight` went with it; this file was
 * their only user, and identical copies still live in ProductHero.tsx if they are ever wanted
 * back. Full restore: commit bbf10b1.
 *
 * Consequence: NOTHING IN THIS BLOCK MOVES OR IS INTERACTIVE ANY MORE. No hover, no focus
 * target, zero JS. Do not add `"use client"`.
 *
 * COPY IS CLIX'S OWN as of 2026-08-12 (user: "in the career section, lets personalize it now,
 * with the headers and subheaders, for the jobs i will follow up later"). It was rogo's
 * verbatim until then, under the standing "clone now, rewrite after" decision; this is the
 * "after".
 *
 * ⚠️ THE HEADLINE IS THE USER’S OWN SENTENCE, CHOSEN VERBATIM ON 2026-08-12 over four
 * measured alternatives. It is 60 characters against rogo’s 44. The ceiling for keeping this
 * block’s original geometry was 44 — probed, not estimated: every candidate at or under 44
 * chars set in 2 lines at 1600/1440 and 4 at 390, and 45 broke the phone tier. At 60 it sets
 * in 3 lines and 6. Do NOT trim the sentence to reclaim height: the target’s heights were
 * measured against the target’s copy, and this page’s copy is no longer the target’s.
 *
 * ⚠️ 529 AT ≥1200 IS A COINCIDENCE, NOT A MATCH — the single most misleading number in this
 * file. The target is 529 with a 2-line headline PLUS a 44px gap and a 40px CTA. We are 529
 * with a 3-line headline and NO CTA, because the extra line (+83.6) and the removed button
 * (−84) cancel to within a pixel. Two independent changes happening to sum to zero. Nothing
 * about the block is faithful here; if you re-add the CTA it becomes 613, and if you shorten
 * the headline to 2 lines it becomes 445. Treat the agreement as arithmetic, never as proof.
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
 * ⚠️ BOTH OF THE NOINDEX REASONS ARE NOW GONE — this copy pass retired one, and removing
 * the `#roles` band retired the other — but the guard is still in place, deliberately.
 * Lifting it is the user's call, not a side effect. See the header of src/app/careers/page.tsx.
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
 * MEASURED HEIGHTS, as the arithmetic check that the values below are the right ones. The
 * CTA's `+ gap + 40` term is struck from all three sums because the CTA is gone:
 *   1600/1440  529 = 198 + (3 lines x 88 x 95% = 250.8) + 80      (target 529 — see above)
 *   1024       415 = 198 + (2 lines x 72 x 95% = 136.8) + 80      (target 479)
 *   390        643 = 198 + (6 lines x 64 x 95% = 364.8) + 80      (target 585)
 * Every PADDING term is still the target's and untouched; only the line count and the CTA
 * changed. Probed at all four tiers 2026-08-12, not derived from these sums.
 * The multi-line phone wrap is a consequence of the 360px cap on `Text & Button`, not of the
 * viewport — which is why that cap is a measured value and not a guard.
 */

export default function CareersHero() {
  return (
    /* Measured: column, place-content:center, align-items:center, gap 96, width 100%,
       overflow hidden, padding 198/40/80 (phone 198/16/80).
       `gap-24` (=96) and `place-content-center` are INERT with a single child — kept because
       they are what the original computes to, and because the next thing added to this section
       will expect them. Dropping them would be a silent divergence, not a cleanup.
       `overflow-hidden` USED TO BE LOAD-BEARING at the phone tier, clipping the left bracket
       that sat 28px outside the 220px CTA box. With the CTA gone nothing overflows here any
       more, so it is now inert too — and kept on the same grounds as the other two. */
    <section
      id="hero"
      data-nav-theme="light"
      className="relative flex w-full flex-col place-content-center items-center gap-24
                 overflow-hidden px-4 pt-[198px] pb-20 tablet:px-10"
    >
      {/* Text & Button — gap 44 at >=1200, 24 below, both INERT since the button was removed
          and this became a single-child column. Kept as measured values, same reasoning as the
          section's own inert gap above. THE 360px CAP IS NOT INERT: it is a phone-only rule and
          it is what forces the headline to six lines at 390. From tablet up the measure is the
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

      </div>
    </section>
  );
}
