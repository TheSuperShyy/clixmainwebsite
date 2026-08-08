/**
 * clix wordmark — the nav logo.
 *
 * Replaces `RogoWordmark` (2026-08-03, user request). That component drew the target's
 * own logotype from the capture's SVG defs; this is our brand, so there is no capture to
 * be faithful to and it is set in type instead of drawn.
 *
 * **The face is Inter Bold, and that is measured, not assumed.** The user's own logo
 * lockup was matched against 16 candidate faces on the ink-width-over-cap-height of each
 * of C, L, I and X — ratios that are scale-free, so a 29px-tall screenshot can still
 * identify a typeface. Inter 700 won outright:
 *
 *     reference     C 0.862  L 0.655  I 0.207  X 0.897
 *     Inter 700     C 0.880  L 0.633  I 0.213  X 0.927   err 0.0209  <-- match
 *     Outfit 700    C 0.878  L 0.646  I 0.224  X 0.946   err 0.0275
 *     Plus Jakarta  C 0.910  L 0.619  I 0.213  X 0.865   err 0.0341
 *
 * So the wordmark needs no new licence — Inter is already vendored for the body text.
 *
 * Sizing, measured against the site's real loaded Inter:
 *   · **22px / 700** gives a 15.0px cap height. The rogo mark it replaces occupied a
 *     60×24 box with ~16.7px of ascender, so it sits in the same optical slot and the
 *     nav's rhythm is unchanged.
 *   · **Tracking is -0.015em, i.e. essentially the face's natural fit.** The logo's own
 *     set width is 3.034 ink-widths per cap height; Inter unmodified is 3.099, so the
 *     lockup is a hair tight and nothing more. An earlier pass shipped 0.1em on the
 *     reasoning that tracking would separate the logo from the nav links beside it —
 *     that was taste, and the brand asset says otherwise. Do not re-loosen it.
 *
 * Rendered as text, not as an SVG: the letterforms are a licensed face the site already
 * loads, so outlining them would only add bytes and make the mark unsearchable. The trade
 * is that width depends on the font actually arriving — which is why nothing in the nav
 * constrains this to a fixed pixel width any more.
 *
 * Colour comes from the caller (`text-ink` / `text-paper` plus the nav's colour
 * transition), exactly as it did for the SVG.
 */

export default function ClixWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="clix"
      /* `leading-none` matters: the default line-height would pad the box past the 24px
         the nav row allots and push the mark off its baseline. */
      /* 30px as of 2026-08-08 (user: "make this a bit more bigger"), via 26 on 2026-08-07
         and 22 originally. `ClixMark` is scaled by the SAME factor in Nav.tsx each time
         (20 -> 24 -> 28), so the mark-to-cap-height ratio the lockup was built on holds —
         scaling one without the other is what makes a lockup look wrong. The ratio drifts
         by ~1% at this step (28/30 vs 24/26) purely from rounding to whole pixels. */
      className={`inline-block text-[30px] leading-none font-bold uppercase
                  ${className}`}
      /* Letter-spacing is painted after the final X too, so the box carries a trailing
         gap the glyphs do not fill. `marginRight: -letterSpacing` cancels it. Negligible
         at this tracking, kept because it is only correct with it.

         `--font-wordmark`, NOT `font-sans` — still a separate token even though both now
         resolve to Discovery, so a brand change can re-cut the logo without touching body
         copy, or vice versa.

         ⚠️ This is Discovery as of 2026-08-08 BY EXPLICIT USER CHOICE, against the
         measurement. The ink-width test that originally identified this lockup as Inter 700
         was re-run across all seven Discovery weights and none of them won — best was
         Discovery Medium at err 0.0331 vs Inter's 0.0209. So the wordmark as rendered no
         longer matches the logo in `src/app/icon.png`, which is genuinely Inter-like. The
         user was shown that table and chose one face with no exceptions anyway. Full table
         in src/app/fonts-discovery.css. */
      style={{
        fontFamily: "var(--font-wordmark)",
        letterSpacing: "-0.015em",
        marginRight: "0.015em",
      }}
    >
      clix
    </span>
  );
}
