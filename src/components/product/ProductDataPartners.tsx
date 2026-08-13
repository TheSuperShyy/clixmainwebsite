/**
 * ProductDataPartners — the "tools we build with" block on /product, Block 3.
 *
 * THE BOX IS ROGO'S, THE CONTENT IS CLIX'S. Every geometry value below is still measured from
 * rogo.com/product's `Data Partners` block (capture offset 336814, live class
 * `.framer-1itlwii`, in docs/reference/target/rogo-product-2026-08-11.html + .css). What
 * changed on 2026-08-12 is what sits in the thirteen tiles.
 *
 * WHAT WAS HERE AND WHY IT IS GONE. The target's version carried eight third-party financial
 * data vendors' trademarks, as image files vendored into the public tree, beneath copy that
 * asserted data provider PARTNERSHIPS and named Rogo outright. clix has none of those
 * relationships, and the user's boss has ruled out client logos entirely, so the whole wall
 * is replaced with the tools clix actually builds on. That is nominative use of each tool's
 * name, not endorsement, and it is the same true claim /clix already makes in ClixLogoProof
 * ("The tools we build with and integrate"). Nothing in this file may drift back toward "our
 * partners" or "our customers". The eight names, and the image files they pointed at, are
 * recorded in features/product-page/CONTEXT.md; deliberately, they are not repeated here.
 *
 * The file name and the default export keep the `DataPartners` spelling because /product's
 * page module imports them by that name, and this component does not own that file.
 *
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md
 *
 * ⚠️ NOT A SECTION. It is a child of `#features`, a sibling of `[Product]` — see the
 * correction note at the top of ProductFeatures.tsx.
 *
 * TIER MAP — measured on the live page at 1600/1440/1024/390:
 *
 * |            | ≥1200      | 810–1199   | ≤809            |
 * |------------|------------|------------|-----------------|
 * | block pad  | `48px 0`   | `48px 0`   | `0`             |
 * | grid       | 3 × 416px  | 2 × 464px  | **2** × 171px   |
 * | tile       | 416×80     | 464×80     | 171×48          |
 * | tile pad   | 16         | 16         | `8 16 8 8`      |
 * | tile gap   | 16         | 16         | 12              |
 * | graphic    | 48         | 48         | 32              |
 * | label      | 20 / 1.5em | 18 / 1.5em | 14 / 1.1em      |
 *
 * The columns go **3 → 2 → 2**, not 3 → 2 → 1. The phone tier keeps two columns and shrinks
 * the tile instead; a plain "one column on phones" rule gets it wrong.
 */

import { TOOL_GLYPHS } from "@/components/ui/ToolGlyphs";
import { getDict } from "@/lib/i18n/server";

/* ---- The thirteen tiles, in grid order -------------------------------------------------
 * A discriminated union, the same shape as the one it replaces: `slug` keys into
 * TOOL_GLYPHS (CC0 simple-icons paths, already vendored in this repo for the home page logo
 * row), `mono` is the fallback for the two tools simple-icons has no mark for.
 *
 * SIMPLE-ICONS CARRIES NO MARK FOR VAPI OR MONDAY.COM. Both 404 upstream, which is why
 * LogoCarousel renders those two as text alone. A bare name works in a scrolling strip; it
 * does not work here, because every tile has a graphic square and two empty squares would
 * read as broken images. So those two get a single letter set in the site's own display
 * face. That is our type, not a redrawn trademark: guessing at a logo from memory is how you
 * ship a subtly wrong one.
 *
 * Casing is each vendor's own. `n8n` and `monday.com` really are lowercase and `OpenAI`
 * really is camel cased; do not sentence case these.
 *
 * The order is LogoCarousel's, so both rows of the site name the stack in the same sequence.
 * Thirteen entries is load bearing: the grid's last row holds one tile at 3 columns and one
 * at 2, and that ragged edge is the original's.
 */
/* ⚠️ THESE THIRTEEN LABELS ARE **NOT** IN THE DICTIONARY, AND THAT IS THE DECISION, NOT AN
 * OVERSIGHT. Every one is a vendor's own mark rendered as text — `n8n`, `monday.com`, `OpenAI`,
 * `Google Sheets` — and §7 of the wave contract keeps vendor marks unmirrored and untranslated.
 * The real site agrees: its own Hebrew stack section (home.bodyText, `02 · הסטאק`) lists these
 * same twelve tools in Latin.
 *
 * The positive reason to leave them here rather than duplicate them into both locale files:
 * each `label` is bound 1:1 to a `slug` that keys a glyph path. Splitting the pair across two
 * files would let a reordered locale put the wrong logo beside a name, which is a worse failure
 * than an untranslated word that should not be translated. Reported as a deliberate
 * non-extraction. */
type Tool = { label: string; slug: string } | { label: string; mono: string };

const TOOLS: readonly Tool[] = [
  { label: "Vapi", mono: "V" },
  { label: "ElevenLabs", slug: "elevenlabs" },
  { label: "n8n", slug: "n8n" },
  { label: "OpenAI", slug: "openai" },
  { label: "Claude", slug: "claude" },
  { label: "Gemini", slug: "gemini" },
  { label: "Make", slug: "make" },
  { label: "WhatsApp", slug: "whatsapp" },
  { label: "monday.com", mono: "m" },
  { label: "Google Sheets", slug: "googlesheets" },
  { label: "Google Docs", slug: "googledocs" },
  { label: "Google Calendar", slug: "googlecalendar" },
  { label: "Hostinger", slug: "hostinger" },
];

/**
 * One brand mark, filling whatever box it is given and taking its colour from it.
 *
 * `aria-hidden` always, and no `<title>`: every mark in this grid sits beside the tool's name
 * as real text, so the graphic is decoration. That is the same contract the vendor `<img>`
 * tiles used to hold with `alt=""`; the accessible name comes from the label, once.
 *
 * Returns null on an unknown slug rather than throwing, so a future typo degrades to an
 * empty square instead of taking the route down.
 */
function ToolMark({ slug }: { slug: string }) {
  const d = TOOL_GLYPHS[slug];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}

export default function ProductDataPartners() {
  const t = getDict().product.dataPartners;
  return (
    /* `.framer-1itlwii` — column, items start, gap 32, max-w 1280, padding `48px 0` and
       `0` on phones. */
    <div className="flex w-full max-w-[var(--container-max)] flex-col items-start justify-start gap-8 overflow-hidden tablet:py-12">
      {/* `.framer-sfjhcu` — 640 wide, gap 10. Start-aligned inside a start-aligned parent:
          `items-start` on the wrapper above is already a logical keyword, so it follows
          `direction` with nothing to migrate. */}
      <div className="flex w-full max-w-[640px] flex-col justify-center gap-[10px]">
        {/* Same h3 preset as 2a and 2d: 44/40/32, 400, 110%, −0.05em. */}
        <h3
          className="w-full font-display text-[32px] font-normal text-ink tablet:text-[40px] desktop:text-[44px]"
          style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
        >
          {t.title}
        </h3>
        {/* 18px at desktop, 16 below; 130%, −0.02em, `muted`. */}
        <p
          className="w-full font-sans text-[16px] font-normal text-muted desktop:text-[18px]"
          style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
        >
          {t.intro}
        </p>
      </div>

      {/* `.framer-18lgsti` — grid, gap 16 at every tier. 2 columns until 1200, then 3. */}
      <ul className="grid w-full list-none grid-cols-2 justify-center gap-4 overflow-hidden desktop:grid-cols-3">
        {TOOLS.map((t) => (
          <li
            key={t.label}
            /* Tile: `#f5f5f566` = `surface` @40%, radius 0. `self-start` is the original's
               `place-self:start` — tiles do not stretch to fill a taller grid row. */
            /* `pe-4` against a flat `p-2`: the extra inset is on the TRAILING side, past the
               label, so it follows the text direction. Resolves to `padding-right` in ltr. */
            className="relative flex min-h-12 w-full flex-row items-center gap-3 self-start overflow-hidden
                       bg-surface/40 p-2 pe-4
                       tablet:h-20 tablet:min-h-0 tablet:gap-4 tablet:p-4"
          >
            {/* The 1px `#8b8b8b1a` = `mark` @10% rule, as an OVERLAY rather than a real
                border. The original paints it with `[data-border] ::after`, which takes no
                space; a real border pushes the content in by 1px and, on phones, makes the
                tile 50px instead of 48. Measured: both deltas disappear with this. */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 border border-mark/10" />
            {/* The graphic square: `mark/20`, 32 on phones and 48 from tablet. Every tile now
                gets one. The old file had two treatments, a line glyph on this square and a
                full bleed vendor image with no square at all, and that split only existed
                because the vendor art was itself a coloured tile. One monochrome mark set on
                one square is both fewer branches and a quieter block. */}
            <span className="flex h-8 w-8 flex-none items-center justify-center bg-mark/20 tablet:h-12 tablet:w-12">
              {"slug" in t ? (
                /* The mark is ~52% of the square in the original (25 of 48, 17 of 32),
                   centred. Kept exactly, so the tile geometry is untouched. */
                <span className="block h-[52%] w-[52%] text-ink-soft">
                  <ToolMark slug={t.slug} />
                </span>
              ) : (
                /* Monogram fallback, `aria-hidden` for the same reason as the marks: the name
                   is already beside it. Sized to sit on the marks' optical line rather than
                   to fill the 52% box, which a letterform would overpower. */
                <span
                  aria-hidden="true"
                  className="font-display text-[15px] leading-none font-normal text-ink-soft tablet:text-[22px]"
                >
                  {t.mono}
                </span>
              )}
            </span>
            {/* 14 / 1.1em on phones, 18 / 1.5em at tablet, 20 / 1.5em from 1200.
                `min-w-0` so a long label wraps inside the tile instead of widening it — the
                original does the same thing with `flex: 1 0 0; width: 1px`. */}
            <span className="min-w-0 flex-1 font-display text-[14px] leading-[1.1em] font-normal text-ink tablet:text-[18px] tablet:leading-[1.5em] desktop:text-[20px]">
              {t.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
