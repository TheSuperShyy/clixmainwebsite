/**
 * SecurityHero — clone of rogo.com/security block `Hero` (`#first`).
 *
 * Capture: docs/reference/target/rogo-security-2026-08-12.{html,css}, every value re-read from
 * the LIVE page over CDP on 2026-08-12 at 1600/1440/1024/390 with the viewport height pinned
 * to 900 (see the `70vh` note below — without that pin the height number is meaningless).
 * Spec: features/security-page/FEATURE.md, Block 1 · memory: features/security-page/CONTEXT.md
 *
 * STILL A SERVER COMPONENT — no `"use client"`, no props, no state. But it is NO LONGER TRUE
 * that this block ships zero JS: as of 2026-08-13 it renders `<SecurityTerminal />`, a client
 * component, as its second child, and that is the only client JS on this route. The rest of
 * this file is unchanged and must stay server-rendered; the copy is still read with `getDict()`
 * and not `usePageDict()` for exactly that reason.
 *
 * ⚠️ THE CLAIM THAT THIS PAGE HAS NO MOTION IS NOW A CLAIM ABOUT THE TARGET ONLY.
 * `data-framer-appear-id` count across the entire captured page really is 0, and the only
 * motion the CLONE has is this CTA's two corner brackets sliding inward on `group-hover`, in
 * pure CSS. The terminal's scroll-triggered reveal is an ADDITION on the user's instruction
 * (2026-08-13, their boss asked for "coding effects" on the security section after seeing
 * kiro.dev), recorded as a deviation in FEATURE.md rather than folded in as if it were fidelity.
 * SecurityBenefits, SecurityCompliance and SecurityCore stay motionless. Do not read the
 * terminal as a licence to animate them.
 *
 * COPY IS CLIX'S OWN FROM THE FIRST COMMIT — the `/company` model, not the `/careers` one.
 * Nothing of rogo's editorial ever lands here, so there is nothing to strip later and the route
 * needs no `robots` guard. The two English strings were length-fitted to the target's RENDERED
 * line counts (h1 two lines, subtitle two lines, at all three tiers); they are not free text.
 *
 * ⚠️ THE COPY NOW LIVES IN `src/lib/i18n/{en,he}/security.ts` AND IS READ WITH `getDict()`,
 * NOT WITH `usePageDict()`. This is a SERVER component (see above) — the client hook would
 * force `"use client"` on a block that must stay server-rendered, which is exactly what the
 * header's second paragraph forbids. `getDict()` is safe here because `SecurityRoute` seeds the
 * locale as the first statement of its body, and this component renders below it.
 *
 * ⚠️ THE H1'S LENGTH RISK IS GONE, AND THE OLD WARNING IS KEPT HERE AS HISTORY BECAUSE IT WILL
 * COME BACK IF ANYONE REINSTATES THE FIXED HEIGHT. It used to read: the section is `70vh` with
 * `place-content: center` AND `overflow: hidden`, so it does not grow — at a 900px viewport it
 * is 630px against 580px of content, and a THIRD h1 line (+83.6px at 88px/95%) would overflow
 * that budget and be CLIPPED top and bottom rather than pushing the band taller.
 * Since 2026-08-13 the band is `h-[min-content]` at every tier, so a third line now simply makes
 * the hero taller. Both locales' titles are still verified at two lines; that is now a layout
 * preference rather than a hard ceiling.
 *
 * NO DASHES IN CLIX COPY — no em dash, no en dash, no hyphen standing in for one (user's
 * standing request, 2026-08-10, first recorded in ClixManifesto.tsx). It governs the strings in
 * the dictionary, not these comments. Hebrew keeps the PREFIX hyphen (`ה-AI`, `ב-TLS`), which
 * is orthography rather than punctuation style.
 *
 * TIER MAP — three sizes, not four. XL (>=1600) and desktop (1200-1599.98) are identical on
 * every value in this block, so no `xl:` rule exists here. Written mobile-first.
 *
 * | Property            | >=1200 (1600 + 1440)  | 1024 (tablet)        | 390 (phone)          |
 * |---------------------|-----------------------|----------------------|----------------------|
 * | section padding     | `198px 40px 80px`     | same                 | `198px 16px 80px`    |
 * | section height      | `min-content` 1256    | `min-content` 952.41 | `min-content` 905.19 |
 * | section gap         | 96 (LIVE since 08-13) | 96                   | 96                   |
 * | `Text & Button`     | gap 32, max-w none    | gap 24, max-w none   | gap 24, max-w 360    |
 * | `Text Container`    | 540 x 230, gap 16     | 540 x 194.41         | 358 x 179.19         |
 * | h1                  | 88px / 95% / -0.06em  | 72px / 95% / -0.06em | 64px / 95% / -0.05em |
 * | subtitle            | 18px / 130% / -0.02em | 16px                 | 16px                 |
 * | CTA frame           | 220 x 40              | same                 | same                 |
 * | CTA `<a>`           | 220 x 36              | same                 | same                 |
 * | canvas              | **1000 x 580**        | 720 x 320            | 358 x 288            |
 * | · console (>=1200)   | 900 x 440 at (0, 0)   | — not rendered —    | — not rendered —    |
 * | · terminal           | 720 x 320 at (280,260)| 720 x 320            | 358 x 288            |
 *
 * ⚠️ THE HEIGHT WAS `70vh` ON THE TARGET AND IS A CONTENT SUM HERE (2026-08-13). Keep the
 * target's fact on record, because it is what the capture says and what a re-probe will find:
 * `.framer-16jfo2a` declares `height: 70vh` at >=810 and `height: min-content` at <=809.98, so
 * at a 900px viewport the target's band is 630px around 580px of content (198 + 302 + 80) and
 * the 50px difference is absorbed by `place-content: center`.
 *
 * OURS CANNOT BE THAT, because the section is `overflow: hidden` and the windows are inside it:
 * a 320px window added to 580px of content inside a frozen 630px box is 270px of clipped
 * window. So the `tablet:h-[70vh]` rule is gone and the band grows instead. The new sums, and
 * they close exactly:
 *   >=1200  198 + 302    + 96 + 580 + 80 = 1256   (the composite, not just the terminal)
 *   1024    198 + 258.41 + 96 + 320 + 80 = 952.41 (terminal only — the console is >=1200)
 *   390     198 + 243.19 + 96 + 288 + 80 = 905.19 (terminal only)
 *
 * ⚠️ ONLY THE >=1200 TIER MOVED when the console arrived on 2026-08-13. 952.41 and 905.19 are
 * the same numbers measured before it existed, and that is by design — the console and the
 * dragging are both gated to one breakpoint precisely so the two smaller tiers never re-open.
 * The 96 is the section's own `gap-24`, INERT until 2026-08-13 and live now that there are two
 * children. `heroH` is therefore an intentional divergence in docs/reference/security-diff.js,
 * listed beside the three heights already excluded for the dropped "Explore security portal"
 * link — not a regression, and not something to "fix" by restoring 70vh.
 *
 * WHY 198px OF TOP PADDING: the nav is `position: fixed` on this route, so nothing in flow
 * reserves its height. This padding IS the clearance for the announcement banner + nav row.
 * It is not a spacing choice and must not be tuned.
 *
 * ⚠️ THIS SECTION PAINTS ITS OWN GROUND. On the target only `#first` sets `ink` and the three
 * bands below it inherit from a page wrapper; here `<body>` is white and each band is its own
 * `data-nav-theme` region, so every band paints `bg-ink` itself. Rendered result is identical;
 * the ownership of the colour is not. `data-nav-theme="dark"` because the whole page is `ink`.
 */

import { getDict } from "@/lib/i18n/server";
import AppLink from "@/components/ui/AppLink";
import SecurityCanvas from "@/components/security/SecurityCanvas";

/* ---------------------------------------------------------------------------------------
 * The two corner brackets that frame the CTA. 14x20 each, path data verbatim from the
 * capture's <use> defs.
 *
 * ⚠️ THEY ARE NOT MIRRORED IN RTL, AND THAT IS A DECISION, NOT AN OVERSIGHT (contract §7).
 * The pair is a ROTATIONAL ORNAMENT, not a navigational affordance: it points at nothing, and
 * a 180° turn is direction-symmetric, so `/he/security` ships the identical artwork at the
 * identical measured offsets. Same call `/product` and `/careers` make on the same pair.
 *
 * ⚠️ CORRECTION, 2026-08-12. An earlier version of this comment claimed these "really are two
 * DIFFERENT paths — unlike the 21x33 marks on Block 3". That claim is WRONG. Rotating
 * `BracketLeft` 180° about (6.996, 10) reproduces `BracketRight` to within 0.008 user units on
 * every coordinate of both paths — e.g. left `M4.79688 3.46116` maps to (9.20312, 16.53884)
 * against right's `M9.19531 16.5388`, and the same 0.0078 x-offset holds for all 16 pairs. So
 * these are the SAME artwork rotated, exactly like Block 3's 21x33 marks. The ARTWORK IS LEFT
 * ALONE — two verbatim path pairs from the capture's own defs are what the capture ships, and
 * collapsing them into one rotated component would be a rewrite justified by a comment. Only
 * the false claim is fixed.
 *
 * COPIED VERBATIM FROM src/components/careers/CareersHero.tsx (which took them from
 * ProductHero.tsx), deliberately, rather than extracted to a shared module: this repo keeps
 * per-page local copies of Framer-derived SVG so that a later measurement on one page cannot
 * silently move another. Three pages agreeing today is a finding, not a contract.
 *
 * ⚠️ THAT SOURCE FILE NO LONGER EXISTS — `/careers` was deleted on 2026-08-13. Every
 * "/careers" in this header is a HISTORICAL comparison, kept because the agreement between
 * three independent measurements is the finding; it is not a live cross-reference, and the
 * local copy below is now one of two rather than one of three. The deleted file is in the
 * commit before the removal if a fourth measurement ever needs checking against it.
 *
 * OFFSETS RE-MEASURED ON THIS PAGE, NOT ASSUMED: dx -28 / dy -12 against the 220x40 frame at
 * EVERY tier — i.e. `-top-3 -left-7` and `-right-7 -bottom-3`. At 1440 the LEFT rect sits at
 * (582, 473) against a frame at (610, 485); the same delta holds at 1600 / 1024 / 390. That is
 * the third independent measurement of the numbers /product and /careers already carry.
 *
 * ⚠️ COLOUR IS `paper` HERE, NOT `ink`. Dark ground. /product and /careers ship the mirror.
 *
 * The hover rule slides them IN to top:-2/left:-18, bottom:-2/right:-18. THE DURATION AND
 * EASING ARE NOT IN THE CAPTURE — Framer animates this in JS, and the sheet's only transition
 * is `color .3s`. So 300ms / --ease-rogo is OURS, flagged as estimated in FEATURE.md, and kept
 * deliberately in step with /product and /careers so the three CTAs cannot drift apart.
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

export default function SecurityHero() {
  /* Server read of the route's namespace. Byte-identical to the consts this block used to
     carry — see src/lib/i18n/en/security.ts, which is where they now live. */
  const t = getDict().security.hero;

  return (
    /* Measured: column, place-content:center, align-items:center, gap 96, width 100%,
       overflow hidden, position relative, padding 198/40/80 (phone 198/16/80).
       `gap-24` (=96) is INERT with a single child — kept because it is what the original
       computes to, and because the next thing added to this section will expect it. Dropping it
       would be a silent divergence, not a cleanup. CareersHero.tsx makes the same call.
       `place-content-center` is NOT inert here: it is what centres the 580px of content inside
       the 630px that `70vh` buys at a 900px viewport. See the header.
       `overflow-hidden` IS load-bearing at the phone tier: the left bracket sits 28px outside
       the 220px CTA frame, and it is the section, not the frame, that clips it. */
    <section
      id="first"
      data-nav-theme="dark"
      /* ⚠️ `tablet:h-[70vh]` WAS HERE AND IS GONE (2026-08-13). The band is a content sum at
         every tier now. See the header for the full reasoning; the short version is that the
         section is `overflow-hidden`, so a terminal added inside a fixed 630px box that already
         held 580px of content would simply have been clipped away. `heroH` is now an
         intentional divergence in docs/reference/security-diff.js rather than a matching key.
         `place-content-center` is kept and is now INERT — the file's convention is to keep and
         document a value the original computes rather than silently drop it, and it becomes
         load-bearing again the moment anyone reinstates a fixed height. */
      className="relative flex h-[min-content] w-full flex-col place-content-center items-center
                 gap-24 overflow-hidden bg-ink px-4 pt-[198px] pb-20
                 tablet:px-10"
    >
      {/* Text & Button — gap 32 at >=1200, 24 below. The 360px cap is a PHONE-ONLY rule; from
          tablet up the measure is the 540px Text Container's job and this box just fills the
          row (1360 wide at >=1200, 944 at 1024). */}
      <div
        className="flex w-full max-w-[360px] flex-col items-center justify-center gap-6
                   tablet:max-w-none desktop:gap-8"
      >
        {/* Text Container — max-w 540, gap 16, at every tier. Unlike the section's, this gap is
            real: 167.19 (h1) + 16 + 46.81 (subtitle) = 230, the measured box height at >=1200.
            The 540 cap is why the h1 sets in two lines on a 1360px row rather than one. */}
        <div className="flex w-full max-w-[540px] flex-col items-center justify-center gap-4">
          {/* h1 88/72/64, line-height 95%, tracking -0.06em except phone -0.05em — the preset's
              own tiering, byte-identical to /careers' and /news' h1, so it is a site preset and
              not a per-page choice. Weight 400, colour `paper` on the dark ground.
              Face is `--font-display` (Discovery), the site's one-face substitution for the
              original's "ABC Arizona Mix Regular" (licensing, sitewide decision 2026-08-08).
              `text-wrap: balance` applies at EVERY tier here, as on /careers. */}
          <h1
            className="w-full text-center text-balance font-display font-normal text-paper
                       text-[64px] tracking-[-0.05em]
                       tablet:text-[72px] tablet:tracking-[-0.06em]
                       desktop:text-[88px]"
            style={{ lineHeight: "95%" }}
          >
            {t.title}
          </h1>

          {/* Subtitle 18px at >=1200, 16px below; line-height 130% and tracking -0.02em at every
              tier. Colour is `paper-soft` (#ffffffcc, white @80%) — Framer token
              --token-2a466810, carried in DESIGN-SYSTEM.md as declared-but-unused until this
              page. Face is `--font-sans`, NOT the display face the h1 uses.
              Tracking is inline here and a CLASS on the h1 above. That is not an inconsistency:
              house rule puts letterSpacing in `style`, and only the h1 is forced out of it by
              having to change value at the phone breakpoint, which inline styles cannot do. */}
          <p
            className="w-full text-center font-sans font-normal text-paper-soft
                       text-[16px] desktop:text-[18px]"
            style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
          >
            {t.subtitle}
          </p>
        </div>

        {/* CTA — a 220x40 frame with the brackets positioned OUTSIDE it, which is why the frame
            is `relative` and the clipping is left to the section. `group` drives the bracket
            hover; `shrink-0` stops the 40px height collapsing in the flex column.

            ⚠️ THE <a> IS 220x36, NOT 40, AND IS CENTRED IN THE 40px FRAME. The original wraps it
            in a `translateY(-50%)` container; `items-center` on the frame reproduces the
            rendered result without carrying the wrapper. /careers' <a> fills its 40px frame —
            this one does not, and that is measured, not assumed. The 4px the pill leaves unused
            is real: it is what the brackets' -12 / -2 vertical travel is measured against.

            The original ships TWO DOM variants, `Button (For Desktop)` >=1200 and
            `Button (For Mobile)` below, which render IDENTICALLY (220x40 both, same label, same
            bracket offsets). Collapsed to one element here; there is nothing to branch on.

            HREF — A RECORDED DEVIATION. The target's <a> has no `href` attribute at all, the
            same fault /product's >=1200 CTA has. Ours points at the site's one CTA destination:
            a control that does nothing is a defect, and reproducing a defect is not fidelity.
            Logged in FEATURE.md.
            ⚠️ REWRITTEN 2026-08-13, AND THE OLD NOTE HERE IS WORTH KNOWING. This used to be the
            bare fragment `#contact` — deliberately not `/#contact`, because the shared Footer
            renders `id="contact"` on this route too, so the bare form reached the same place
            without a page navigation AND dodged `@next/next/no-html-link-for-pages`, which a
            raw `<a>` to an internal path trips. /contact is now a real page with a real form, so
            there is no in-page destination left to scroll to and the element is `AppLink`: it
            routes client-side, applies `localeHref` (/he/contact on the Hebrew route), and is
            not an `<a>`, so the lint rule never comes up. /product and /company moved the same
            way and for the same reason. */}
        <div className="group relative flex h-10 w-[220px] shrink-0 items-center">
          <BracketLeft
            className="pointer-events-none absolute -top-3 -left-7 text-paper
                       transition-[top,left] duration-300
                       group-hover:-top-0.5 group-hover:-left-[18px]"
            style={{ transitionTimingFunction: "var(--ease-rogo)" }}
          />
          <BracketRight
            className="pointer-events-none absolute -right-7 -bottom-3 text-paper
                       transition-[bottom,right] duration-300
                       group-hover:-right-[18px] group-hover:-bottom-0.5"
            style={{ transitionTimingFunction: "var(--ease-rogo)" }}
          />
          {/* ⚠️ INVERTED VARIANT: white fill, ink label, because the ground is dark. /product and
              /careers ship the mirror of this (ink fill, paper label) on white. Do not copy
              their colours across.
              `border-width: 0` is measured — /careers' `border border-transparent` is NOT the
              rule here, so there is no border utility at all on this element.
              `hover:opacity-90` IS OURS, NOT THE TARGET'S. The capture has no `:hover` rule
              anywhere in this subtree except the bracket variant, so on fidelity grounds the
              brackets alone would be the hover affordance. It is here anyway, on consistency
              grounds: this is the same "Request Demo" control the Nav, the Footer, /product and
              /careers all ship, and those four already fade. A primary CTA that behaves
              differently on one route is a defect in our own system, whichever way the target
              authored it. Recorded in FEATURE.md rather than left to look like fidelity.
              py-2 (8px) + the 20px label box + py-2 = 36, so the measured padding and the
              measured height agree rather than fight; both are kept.
              Focus ring is the dark-ground inverse of /careers': paper ring, ink offset. */}
          <AppLink
            href="/contact"
            className="flex h-9 w-full items-center justify-center overflow-hidden
                       rounded-[6px] bg-paper px-4 py-2
                       transition-opacity duration-300 hover:opacity-90
                       focus-visible:ring-2 focus-visible:ring-paper
                       focus-visible:ring-offset-2 focus-visible:ring-offset-ink
                       focus-visible:outline-none"
            style={{ transitionTimingFunction: "var(--ease-rogo)" }}
          >
            {/* h-5 + 1px top padding is the site's fixed button-label anatomy (Hero, Nav, /news,
                /product and /careers all carry it verbatim). `whitespace-pre` is required: the
                original's label is width:min-content and must never wrap "Request Demo".
                That label is the one the Nav and Footer already use sitewide. */}
            <span className="flex h-5 items-center justify-center gap-[10px] pt-px">
              <span
                className="font-sans text-[16px] font-medium whitespace-pre text-ink"
                style={{ lineHeight: "1em", letterSpacing: "-0.01em" }}
              >
                {t.cta}
              </span>
            </span>
          </AppLink>
        </div>
      </div>

      {/* The mock-window composite — the section's SECOND child, which is what finally
          activates the `gap-24` (96px) above. That gap had been sitting here inert since this
          block was built, kept on the grounds that "the next thing added to this section will
          expect it"; this is that thing, and the note has been proved rather than inherited.

          ⚠️ IT IS A SIBLING OF `Text & Button`, NOT A CHILD OF IT. That wrapper is
          `max-w-[360px]` at the phone tier, so nesting the windows inside would cap them at 360
          and neither the terminal's 720 nor the composite's 1000 would ever apply.

          ⚠️ WHAT IT CONTAINS DEPENDS ON THE TIER, and that is why this block's height does:
          at >=1200 it is a 1000 x 580 composite of a 900 x 440 console with a 720 x 320 terminal
          overlapping its bottom-right, both draggable; below 1200 it is the terminal alone, in
          normal flow, exactly as it was before the console existed. See SecurityCanvas.tsx.

          Client component, and the only client subtree on this route — see the header. */}
      <SecurityCanvas />
    </section>
  );
}
