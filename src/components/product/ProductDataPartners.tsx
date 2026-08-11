/**
 * ProductDataPartners — clone of rogo.com/product's `Data Partners` block ("Trusted Data"),
 * Block 3. Capture offset 336814, live class `.framer-1itlwii`.
 *
 * Capture: docs/reference/target/rogo-product-2026-08-11.html (+ .css).
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md
 *
 * ⚠️ NOT A SECTION. It is a child of `#features`, a sibling of `[Product]` — see the
 * correction note at the top of ProductFeatures.tsx.
 *
 * ⚠️ THIS BLOCK CARRIES EIGHT THIRD-PARTY TRADEMARKS (LSEG, Dow Jones, FactSet, S&P Capital
 * IQ, PitchBook, Preqin, Quartr, Daloopa), logos included. They ship verbatim with the rest
 * of the clone, on the user's explicit call, and they assert partnerships that do not exist.
 * The route's `robots: { index: false, follow: false }` is what makes that acceptable —
 * **do not remove it, and replace these before this page is ever indexed.**
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

import type { ReactNode } from "react";

/* Verbatim from the capture. */
const TITLE = "Trusted Data";
const INTRO =
  "We partner with trusted data providers to bring the highest‑quality financial " +
  "information to our platform. Their expertise, combined with Rogo’s technology, gives " +
  "customers the clarity and confidence they need to move fast.";

/* ---- The five line glyphs -------------------------------------------------------------
 * Path data verbatim from the capture's defs block (`#svg66653610_713`, `#svg637455021_240`,
 * `#svg1766875017_478`, `#svg-209490878_991`) and, for the globe, from the inline data-URI
 * that Framer emits instead of a def. Stroke is `currentColor` rather than the original's
 * literal `#44403C`, so the colour comes from a token — see the deviation note in FEATURE.md.
 */

function Glyph({ children, viewBox = "0 0 25 24", width = 1.25 }: { children: ReactNode; viewBox?: string; width?: number }) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Your Firm's Data — a database cylinder. */
function IconDatabase() {
  return (
    <Glyph>
      <path d="M12.666 8c4.971 0 9-1.343 9-3s-4.029-3-9-3c-4.97 0-9 1.343-9 3s4.03 3 9 3Z" />
      <path d="M3.667 5v14c0 .796.948 1.559 2.636 2.121 1.687.563 3.977.879 6.363.879 2.387 0 4.677-.316 6.364-.879 1.688-.562 2.636-1.325 2.636-2.121V5" />
      <path d="M3.667 12c0 .796.948 1.559 2.636 2.121 1.687.563 3.977.879 6.363.879 2.387 0 4.677-.316 6.364-.879 1.688-.562 2.636-1.325 2.636-2.121" />
    </Glyph>
  );
}

/** Real-time Web & News — a meridian globe. */
function IconGlobe() {
  return (
    <Glyph>
      <path d="M 12.334 22 C 17.856 22 22.334 17.523 22.334 12 C 22.334 6.477 17.856 2 12.334 2 C 6.811 2 2.334 6.477 2.334 12 C 2.334 17.523 6.811 22 12.334 22 Z" />
      <path d="M 12.334 2 C 7.001 7.6 7.001 16.4 12.334 22 C 17.667 16.4 17.667 7.6 12.334 2 Z" />
      <path d="M 2.333 12 L 22.333 12" />
    </Glyph>
  );
}

/** SEC Filings — a columned building. The one glyph at stroke 1.5, not 1.25. */
function IconBank() {
  return (
    <Glyph width={1.5}>
      <path d="M3.333 22h18m-15-4v-7m4.001 7v-7m4 7v-7m4 7v-7m-6-9 8 5h-16l8-5Z" />
    </Glyph>
  );
}

/** Transcripts — a handset. */
function IconPhone() {
  return (
    <Glyph>
      <path d="M22.666 16.92v3a1.998 1.998 0 0 1-2.18 2 19.791 19.791 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.776 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.908.339 1.85.574 2.81.7a2 2 0 0 1 1.72 2.03Z" />
    </Glyph>
  );
}

/** International Filings — a networked globe. Its own viewBox, 20 × 20.11. */
function IconNetwork() {
  return (
    <Glyph viewBox="0 0 20 20.11" width={1.2}>
      <path d="M 19.49 13.16 L 14.95 13.16 C 13.845 13.16 12.95 14.055 12.95 15.16 L 12.95 19.7 M 4.95 1.5 L 4.95 3.16 C 4.95 4.817 6.293 6.16 7.95 6.16 C 9.055 6.16 9.95 7.055 9.95 8.16 C 9.95 9.26 10.85 10.16 11.95 10.16 C 13.055 10.16 13.95 9.265 13.95 8.16 C 13.95 7.06 14.85 6.16 15.95 6.16 L 19.12 6.16 M 8.95 20.11 L 8.95 16.16 C 8.95 15.055 8.055 14.16 6.95 14.16 C 5.845 14.16 4.95 13.265 4.95 12.16 L 4.95 11.16 C 4.95 10.055 4.055 9.16 2.95 9.16 L 0 9.16" />
      <path d="M 10 20 C 15.523 20 20 15.523 20 10 C 20 4.477 15.523 0 10 0 C 4.477 0 0 4.477 0 10 C 0 15.523 4.477 20 10 20 Z" />
    </Glyph>
  );
}

/* ---- The thirteen tiles, in grid order -------------------------------------------------
 * Five carry a line glyph on a `mark/20` square; eight carry the provider's own mark, which
 * is a full-bleed coloured square in every case — hence no padding and no background under
 * them. `logo` files are vendored under public/logos/product/ (see public/README.md).
 */
const PARTNERS = [
  { label: "Your Firm’s Data", Icon: IconDatabase },
  { label: "LSEG", logo: "/logos/product/lseg.png" },
  { label: "Dow Jones", logo: "/logos/product/dow-jones.png" },
  { label: "FactSet", logo: "/logos/product/factset.png" },
  { label: "Capital IQ", logo: "/logos/product/capital-iq.png" },
  { label: "PitchBook", logo: "/logos/product/pitchbook.svg" },
  { label: "Preqin", logo: "/logos/product/preqin.png" },
  { label: "Real-time Web & News", Icon: IconGlobe },
  { label: "SEC Filings", Icon: IconBank },
  { label: "Transcripts", Icon: IconPhone },
  { label: "Quartr", logo: "/logos/product/quartr.svg" },
  { label: "International Filings", Icon: IconNetwork },
  { label: "Daloopa", logo: "/logos/product/daloopa.svg" },
] as const;

export default function ProductDataPartners() {
  return (
    /* `.framer-1itlwii` — column, items start, gap 32, max-w 1280, padding `48px 0` and
       `0` on phones. */
    <div className="flex w-full max-w-[var(--container-max)] flex-col items-start justify-start gap-8 overflow-hidden tablet:py-12">
      {/* `.framer-sfjhcu` — 640 wide, gap 10. Left-aligned inside a left-aligned parent. */}
      <div className="flex w-full max-w-[640px] flex-col justify-center gap-[10px]">
        {/* Same h3 preset as 2a and 2d: 44/40/32, 400, 110%, −0.05em. */}
        <h3
          className="w-full font-display text-[32px] font-normal text-ink tablet:text-[40px] desktop:text-[44px]"
          style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
        >
          {TITLE}
        </h3>
        {/* 18px at desktop, 16 below; 130%, −0.02em, `muted`. */}
        <p
          className="w-full font-sans text-[16px] font-normal text-muted desktop:text-[18px]"
          style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
        >
          {INTRO}
        </p>
      </div>

      {/* `.framer-18lgsti` — grid, gap 16 at every tier. 2 columns until 1200, then 3. */}
      <ul className="grid w-full list-none grid-cols-2 justify-center gap-4 overflow-hidden desktop:grid-cols-3">
        {PARTNERS.map((p) => (
          <li
            key={p.label}
            /* Tile: `#f5f5f566` = `surface` @40%, radius 0. `self-start` is the original's
               `place-self:start` — tiles do not stretch to fill a taller grid row. */
            className="relative flex min-h-12 w-full flex-row items-center gap-3 self-start overflow-hidden
                       bg-surface/40 p-2 pr-4
                       tablet:h-20 tablet:min-h-0 tablet:gap-4 tablet:p-4"
          >
            {/* The 1px `#8b8b8b1a` = `mark` @10% rule, as an OVERLAY rather than a real
                border. The original paints it with `[data-border] ::after`, which takes no
                space; a real border pushes the content in by 1px and, on phones, makes the
                tile 50px instead of 48. Measured: both deltas disappear with this. */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 border border-mark/10" />
            {"logo" in p ? (
              /* A provider mark. Full-bleed square, so it gets no tile fill of its own.
                 `alt=""`: the provider's name is the text beside it, and a second
                 announcement of the same name is noise. Plain <img> for the same reason as
                 elsewhere in this build — a fixed-size static asset gains nothing from
                 next/image's loader. */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={p.logo}
                alt=""
                width={48}
                height={48}
                className="h-8 w-8 flex-none object-cover tablet:h-12 tablet:w-12"
              />
            ) : (
              /* A line glyph on a `mark/20` square. The glyph is ~52% of the square in the
                 original (25 of 48, 17 of 32), centred. */
              <span className="flex h-8 w-8 flex-none items-center justify-center bg-mark/20 tablet:h-12 tablet:w-12">
                <span className="block h-[52%] w-[52%] text-ink-soft">
                  <p.Icon />
                </span>
              </span>
            )}
            {/* 14 / 1.1em on phones, 18 / 1.5em at tablet, 20 / 1.5em from 1200.
                `min-w-0` so a long label wraps inside the tile instead of widening it — the
                original does the same thing with `flex: 1 0 0; width: 1px`. */}
            <span className="min-w-0 flex-1 font-display text-[14px] leading-[1.1em] font-normal text-ink tablet:text-[18px] tablet:leading-[1.5em] desktop:text-[20px]">
              {p.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
