/**
 * ClixLogoProof — the /clix integrations grid.
 *
 * THE BOX IS ROGO'S, THE CONTENT IS CLIX'S. Every geometry value below is still measured
 * from `Logo Proof` (`.framer-s22g2m`) in the 2026-08-09 capture — the 4/3/2 columns, the
 * hard 436/600px height, the 8px gap, the `#15151508` tiles, the 6px radius. What changed
 * on 2026-08-09 is what sits in them: the target proves itself with twelve investment
 * banks, which a clix build cannot claim, so ours names the twelve tools clix actually
 * works with. Spec: features/felix-page/FEATURE.md.
 *
 * A STATIC GRID, not a marquee. The home page's logo row is a scrolling track; this one is
 * a fixed grid with a hard height. Do not "unify" them — they are different components in
 * the original, and the grid is what makes the 12th tile land bottom-right.
 *
 * Tier map: 4 columns >=1200, 3 at tablet, 2 on phone — and the phone tier also grows the
 * grid from 436px to 600px, because 12 tiles in 2 columns is 6 rows instead of 3.
 *
 * THE LOCKUP INSIDE THE TILE IS OURS, AND IT SCALES; THE TILE AROUND IT DOES NOT. The grid,
 * its fixed height and its gap are rogo's measured values and stay frozen. The glyph+name
 * pair is 24/16 on phone, 28/18 at tablet, 32/20 at desktop, at weight 600 throughout
 * (2026-08-13, user: "bigger and little bolder") — see the note at the lockup for why the
 * phone tier is the one that cannot grow.
 */

import { getDict } from "@/lib/i18n/server";

import { TOOL_MARKS } from "./toolMarks";

export default function ClixLogoProof() {
  /* ⚠️ ONLY THE CAPTION IS A DICTIONARY STRING. The twelve names below come from
     TOOL_MARKS and stay LATIN in every locale: they are product trademarks, not words.
     /company imports the same module, so nothing there is affected either. */
  const t = getDict().clix.logoProof;

  return (
    <section
      /* The id is ClixBackdrop's handle: as the ground fades to forest-deep this whole
         section fades to opacity 0 (2026-08-09, user: "i dont want to make the icons or the
         words any of the tools visible when the green is active"). Nothing here is
         interactive, so opacity carries no focus-trap risk. The fade is written by the
         backdrop's single writer — do not add a competing opacity animation here. */
      id="integrations"
      data-nav-theme="light"
      className="relative flex h-min w-full flex-col items-center justify-center gap-[108px]
                 overflow-clip px-4 py-10
                 tablet:px-10 tablet:pt-10 tablet:pb-[164px]"
    >
      {/* Width Container — gap 36, phone 32 */}
      <div
        className="relative flex h-min w-full max-w-[var(--container-max)] flex-col
                      items-center justify-center gap-8 tablet:gap-9"
      >
        <p
          /* `mark` was #8b8b8b inlined here as a deliberate x2 one-off; the monochrome grid
             below took it to ~26 uses, which is a scale step, so it is a token now. */
          className="h-auto w-auto max-w-[250px] flex-none text-center font-sans text-[14px]
                     font-medium text-mark tablet:max-w-[720px]"
          style={{
            letterSpacing: "-0.2px",
            lineHeight: "1.5em",
          }}
        >
          {t.caption}
        </p>

        {/* The grid's HEIGHT is fixed, not derived — 436px at >=810, 600px on phone. With
            `grid-auto-rows:minmax(0,1fr)` that is what gives every tile an identical box
            regardless of how tall its logo is. */}
        <ul
          className="relative grid h-[600px] w-full list-none grid-cols-2 gap-2 p-0
                     tablet:h-[436px] tablet:grid-cols-3
                     desktop:grid-cols-4"
          style={{ gridAutoRows: "minmax(0,1fr)", justifyContent: "center" }}
        >
          {TOOL_MARKS.map((t) => (
            <li
              key={t.name}
              /* `#15151508` — ink at ~3%. Inlined in the original rather than published as a
                 token, and it is the only fill in the section, so it stays a literal here
                 with the value named rather than becoming a global. */
              className="relative flex h-full w-full items-center justify-center self-start
                         overflow-clip rounded-[6px]"
              style={{ backgroundColor: "#15151508" }}
            >
              {/* A lockup, not a bare logo. rogo can drop in a wordmark and be understood
                  because "Jefferies" IS the logo; half of these marks are abstract glyphs,
                  so the name has to travel with them or the grid says nothing. Centred as
                  one unit so the tile still reads as a single centred object.

                  MONOCHROME, 2026-08-09 (user, ours and rogo's grids side by side: "match
                  the design with rogo"). The accents came off: rogo's twelve wordmarks are
                  twelve different designs unified into one quiet block by a single grey, and
                  our per-tool brand colours were exactly what broke that. Everything —
                  glyph and name — is now the same `#8b8b8b` the caption above already uses,
                  which is also the grey rogo's own wordmarks sit at. `t.accent` still holds
                  each tool's colour in toolMarks.tsx; nothing reads it here anymore.

                  This also closes a recorded backdrop consequence for free: coloured glyphs
                  used to stay bright while the ground crossfaded dark around them. Grey
                  dissolves the way rogo's wordmarks do.

                  ⚠️ Contrast: #8b8b8b on the tile computes to ~2.97:1 — below AA for body
                  text, same as rogo's own grid. Acceptable ONLY because these are brand
                  names (logotypes are exempt); do not reuse this grey for prose. */}
              {/* ⚠️ THE LOCKUP IS WIDTH-BOUND ON PHONE, AND ONLY ON PHONE. `whitespace-pre`
                  means the name cannot wrap, and the tile is `overflow-clip`, so anything
                  wider than the tile is silently cut rather than reflowed. The binding case
                  is `Google Calendar` — the longest of the twelve — in a 2-column tile:
                  at 390px that tile is 175px wide. Measured from discovery-var at wght 600,
                  16px, -0.01em: 114.6px of text, so the padding and gap around it are the
                  whole budget. That is why the phone tier grows the WEIGHT but not the SIZE,
                  and why phone padding/gap are TIGHTER than tablet's rather than equal:
                    · phone   px-2 + 24 glyph + gap-2 + 114.6  = 162.6 of 175  ✓ 12px spare
                    · tablet  px-3 + 28 glyph + gap-3 + 128.9  = 192.9 of 238  ✓ (worst case
                                                                 is 810px, the narrowest 3-col)
                    · desktop px-3 + 32 glyph + gap-3 + 143.2  = 211.2 of 274  ✓ (worst case
                                                                 is 1200px, the narrowest 4-col)
                  This is 8px MORE phone slack than the pre-2026-08-13 medium/px-3/gap-10
                  lockup had, which is deliberate: that one sat at 170.4 of 175 and clipped
                  outright below ~382px. If a longer tool name is ever added, re-measure this
                  first — the phone tier is where it breaks, and it breaks silently. */}
              <div className="flex items-center justify-center gap-2 px-2 tablet:gap-3 tablet:px-3">
                <svg
                  viewBox="0 0 24 24"
                  /* Eleven marks are `currentColor` and follow `color`. monday.com's three
                     shapes carry their own `fill` attributes, which lose to ANY css rule —
                     `[&_*]:fill-current` greys it without touching the others (whose
                     stroke-drawn paths a blanket fill override would flood). */
                  className={`h-6 w-6 flex-none text-mark tablet:h-7 tablet:w-7 desktop:h-8 desktop:w-8 ${t.mono ? "" : "[&_*]:fill-current"}`}
                  fill={t.mono ? "currentColor" : undefined}
                  aria-hidden="true"
                >
                  {t.glyph}
                </svg>
                <span
                  className="font-sans text-[16px] font-semibold whitespace-pre text-mark
                             tablet:text-[18px] desktop:text-[20px]"
                  style={{
                    letterSpacing: "-0.01em",
                    lineHeight: "1em",
                  }}
                >
                  {t.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
