/**
 * ClixFelixFooter — clone of rogo.com/felix `Felix Footer` (`.framer-17a2nid`).
 * Measured from the 2026-08-09 capture. Spec: features/felix-page/FEATURE.md.
 *
 * Not the site footer — this page ends with its own slim block: an oversized wordmark with
 * a small "by Rogo" tucked under its right edge. The layout is one row containing a single
 * `flex:1 0 0; width:1px` column aligned to `flex-end`, which is the same width-collapse
 * trick `why-rogo` uses on the home page: `width:1px` plus `flex-grow` makes the column
 * take its size from the row rather than from its content.
 *
 * ⚠️ THE WORDMARK IS A DEVIATION. The original ships it as a 2008x859 PNG
 * (aspect 2.3376) on framerusercontent.com. That is rogo's artwork, and this repo already
 * deleted rogo's hero video for exactly this reason once it went public — so it is SET IN
 * TYPE here instead of being downloaded.
 *
 * ⚠️ AND THE BLOCK IS ~130px SHORTER THAN THE TARGET'S, ON PURPOSE (2026-08-11, user:
 * "make the clix look very much alike 100% but make clix all capital like CLIX").
 *
 * The 2.3376 aspect used to be hard-coded here to keep the target's block height. That was
 * the wrong thing to preserve. The target's PNG is cropped tight to its glyphs, and 2.3376
 * is simply what "Felix" measures with an `l` ascender over an x-height. "CLIX" is four
 * capitals: measured off Discovery Bold's outlines it is 1.9264em of ink over 0.6287em,
 * i.e. an aspect of 3.06. Forcing it into a 2.34 box left ~130px of dead space that the
 * flex centring split above and below the word, which pushed "by Clix Solutions" about 90px
 * clear of the letters instead of the target's 24px.
 *
 * So the box hugs the ink instead — the SVG's viewBox IS the measured ink box. Being tight
 * around the wordmark is the faithful behaviour; the specific ratio is just a function of
 * which letters the word happens to have.
 */

export default function ClixFelixFooter() {
  return (
    /* NO BACKGROUND, and that is measured: every block on the target is transparent —
         the shared fixed backdrop is the only thing on the page that paints a colour.
         `bg-paper` was here until 2026-08-10 and it was mine, not the capture's. It broke
         the bottom of the green section: an opaque white block slides up OVER the dark
         ground, so the dark runway the target shows after the manifesto could not exist.
         See ClixBackdrop.tsx. */
    <section
      data-nav-theme="light"
      className="relative z-[1] flex h-min w-full flex-col items-center justify-center
                 gap-[108px] overflow-clip px-4 pt-32 pb-10
                 tablet:px-10 tablet:py-16
                 desktop:pt-24 desktop:pb-20"
    >
      {/* Width Container — row, centred, gap 0 */}
      <div
        className="relative flex h-min w-full max-w-[var(--container-max)] flex-row
                      items-center justify-center overflow-visible"
      >
        {/* `flex:1 0 0; width:1px` — see the header note. gap 24, content to the right. */}
        <div
          className="relative flex h-min flex-col items-end justify-center gap-6 overflow-visible"
          style={{ flex: "1 0 0", width: "1px" }}
        >
          {/* THE EMBOSS IS AN SVG INNER SHADOW, AND EVERY NUMBER IN IT IS SAMPLED — on
              2026-08-11 the target's actual artwork (framerusercontent LyryUPb…, 2008x859)
              was fetched to the scratchpad and profiled with PIL. Measurement only; the
              file itself is rogo's and stays out of the repo. What it says:

                  face       FLAT #ececec (236) — not a gradient
                  top rims   #dedede (222) easing to face over ~18px of 847px ink height
                  side rims  227..231 over ~8px — the same shadow at half strength
                  bottom     nothing dark inside; a 253-white outer glow (invisible on
                             the white page, so not reproduced)
                  outside    NO dark halo anywhere

              That pattern — darkest inside the TOP of every stroke, softer down the sides,
              absent at the bottom, following each glyph's own edge — is an inner shadow
              cast from above. Two earlier CSS attempts failed for structural reasons:
              text-shadow paints OUTSIDE the glyph (and its white lip vanished on the white
              page), and a gradient face shades the WORD top-to-bottom when the PNG shades
              each STROKE. Only a filter compositing on the text's own alpha can put the
              rim where the artwork has it, so the word is SVG text now.

              How the filter reads: the glyph alpha is shifted down and blurred; `out`
              keeps the sliver of glyph the shifted copy no longer covers (the top rim,
              soft-edged by the blur); the flood tints that sliver and it merges over the
              flat face. All in userSpace units where 1000 = 1em, so it scales with the
              word by construction. */}
          <div className="pointer-events-none w-full select-none" aria-hidden="true">
            <svg
              viewBox="0 0 2034 696"
              className="block w-full"
              role="presentation"
              focusable="false"
            >
              <defs>
                <filter
                  id="clix-deboss"
                  x="-2%"
                  y="-2%"
                  width="104%"
                  height="104%"
                  filterUnits="objectBoundingBox"
                  primitiveUnits="userSpaceOnUse"
                >
                  {/* dy 10 / blur 3: the PNG's rim runs full-dark to ~10px then eases to
                      face by ~18px, at 847px ink height — scaled to our units that lands
                      near 10/3, and 10/3 is also exactly what the approved artifact
                      specimen rendered with (2026-08-11), so these are pinned. The blur's
                      sideways spread is also what makes the half-strength side rims —
                      they are not a separate shadow in the PNG either. */}
                  <feOffset in="SourceAlpha" dy="10" result="off" />
                  <feGaussianBlur in="off" stdDeviation="3" result="soft" />
                  <feComposite in="SourceAlpha" in2="soft" operator="out" result="rim" />
                  {/* 0.06, derived not chosen: rim peak 222 over face 236 is a darkening
                      of 14/236 = 5.9%. Flood is `ink` so the tint stays neutral. */}
                  <feFlood floodColor="#151515" floodOpacity="0.06" result="tint" />
                  <feComposite in="tint" in2="rim" operator="in" result="shadow" />
                  <feMerge>
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode in="shadow" />
                  </feMerge>
                </filter>
              </defs>
              {/* THE FACE IS DM SERIF DISPLAY, NOT DISCOVERY — the one sanctioned
                  exception to "one face sitewide" (2026-08-11, user picked it from a
                  six-face artifact trial). The target's wordmark is a SERIF artwork
                  (ABC Arizona Mix, deleted 2026-08-08 for licensing); DM's thin flat
                  didone serifs are the nearest open-licence cut. Ships as a four-glyph
                  2.9 KB subset — see fonts.css. Natural tracking and weight 400: the
                  nav lockup's -0.015em belonged to Discovery, and DM only ships 400.

                  GEOMETRY, from DM Serif Display's own outlines (fontTools, at
                  font-size 1000, zero tracking):

                      ink box   2034 wide x 696 tall
                      pen walk  ink left = -20 + C.lsb 20 = 0 ... X ink right = 2034
                      vertical  cap 678 above baseline, overshoot 18 below -> 696

                  So the viewBox IS the ink box: x -20 cancels C's left bearing, y 678
                  puts the baseline where the cap tops land on the box top. The box
                  hugging the word tight is what the target's PNG does (2008x859 cropped
                  to its glyphs); the ratio, 2.92 vs Felix's 2.34, is just what four
                  capitals measure vs an ascender over an x-height. */}
              <text
                x="-20"
                y="678"
                fontSize="1000"
                fontWeight={400}
                fill="var(--color-emboss-face)"
                style={{ fontFamily: "var(--font-emboss)" }}
                filter="url(#clix-deboss)"
              >
                CLIX
              </text>
            </svg>
          </div>

          {/* Was "by Rogo": the target's footer is PRODUCT by COMPANY. Renaming the
              wordmark to Clix collapsed that, since our product and company are the same
              word and "Clix by Clix" is nonsense. The company's real registered name is the
              one the reference capture is filed under (docs/reference/clixsolutions/), so
              the line keeps its job and its box. */}
          <p
            className="h-auto w-auto flex-none whitespace-pre font-sans text-[28px] font-medium"
            style={{
              /* muted at 30% — inlined in the original as `rgba(115,115,115,0.3)`. */
              color: "rgba(115, 115, 115, 0.3)",
              letterSpacing: "0px",
              lineHeight: "100%",
            }}
          >
            by Clix Solutions
          </p>
        </div>
      </div>
    </section>
  );
}
