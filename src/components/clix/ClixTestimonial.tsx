/**
 * ClixTestimonial — clone of rogo.com/felix `Testimonial` (`.framer-h1knkl`).
 * Measured from the 2026-08-09 capture. Spec: features/felix-page/FEATURE.md.
 *
 * TWO ROWS, MOVING IN OPPOSITE DIRECTIONS. The original names them `Ticker` and
 * `Ticker Opposite` — that is the whole design, and a single row would read as a different
 * section. Both carry the same edge mask, measured verbatim:
 *
 *     mask: linear-gradient(90deg, #0000 0%, #000 5% 95%, #0000 100%)
 *
 * i.e. the fade is 5% of the row's width at each end, not a fixed pixel ramp.
 *
 * THE DRIFT BUG THIS AVOIDS — same trap the home page's logo-carousel hit. Duplicating a
 * `gap`-spaced track and animating to -50% does NOT loop cleanly: 2n items have only 2n-1
 * gaps, so half the track is one gap short and the seam creeps every cycle. Fix here is to
 * drop `gap` entirely and give every card its own TRAILING MARGIN. Then n items measure
 * exactly n x (card + 20), the doubled track is exactly twice that, and -50% is precisely
 * one cycle — no measuring pass needed, unlike the carousel which had to compute its own.
 *
 * ⚠️ WHICH SIDE THAT MARGIN SITS ON IS IRRELEVANT TO THE ARITHMETIC — corrected 2026-08-12,
 * because the sentence above used to say `margin-right` and read as though the loop depended
 * on it. It does not: a margin contributes the same width to the track whichever edge of the
 * box it is on, so half the doubled track is exactly one cycle either way and adjacent card
 * gaps stay uniform. `me-5` is used below because it puts the seam gap on the MIRRORED side
 * under rtl, which is a layout choice, not a loop requirement.
 *
 * ⚠️ AND THE ANIMATION ITSELF IS NOT LOCAL. The track carries `.clix-marquee`, and
 * globals.css pairs it with `[dir="rtl"] .clix-marquee { animation-name: clix-marquee-rtl }`
 * (0 -> +50%, the correct mirror). So: do NOT rename that class, do NOT move it off the
 * animated element, and do NOT add a competing `animation-name` or keyframe here. The inline
 * `animationDuration` / `animationDirection` below still win, and `animation-direction:
 * reverse` mirrors on its own — the counter-rotating row needs nothing.
 */

import { getDict } from "@/lib/i18n/server";

/* ⚠️⚠️  THESE ARE FABRICATED ENDORSEMENTS, IN BOTH LOCALES. READ BEFORE LAUNCH.  ⚠️⚠️
 *
 * The text moved to src/lib/i18n/{en,he}/clix.ts on 2026-08-12 as `clix.testimonial.quotes`.
 * Moving it changed nothing about what it is, so the warning stays here, where a reader of the
 * component lands, as well as beside the strings.
 *
 * The names were changed to Clix on 2026-08-10 with the rest of the page ("change all of
 * Clix into clix"). The WORDS are still rogo's: ten real quotes from real people about a
 * real product that is not this one, now attributed to plausible-sounding firms and pointed
 * at clix. Before the rename they read as obvious placeholder text, which was safe. They no
 * longer do.
 *
 * ⚠️ AND HEBREW MAKES IT WORSE, NOT BETTER. There was nothing to source: the real company's
 * endorsements are four 9:16 VIDEOS and docs/reference/clixsolutions/README.md:283 records
 * that "No quote text exists anywhere in the markup". So /he/clix is not a restoration of
 * anything — it is the same fabrication delivered in the audience's own first language, where
 * it reads as MORE credible, not less. Translating it cleared no part of the problem.
 *
 * ⚠️ THIS BLOCK IS THE SINGLE REASON `robots: { index: false, follow: false }` MUST STAY ON
 * BOTH /clix AND /he/clix. It is the only content on the page that is not merely unfinished
 * but actively misleading.
 *
 * THE FIX IS NOT ANOTHER RENAME OR ANOTHER TRANSLATION. It is real clix references, with
 * permission, or deleting the block. Flagged to the user at the time of the change and left in
 * place at their direction, on a staging URL that is not indexed and has not launched. */

/* Structural, so no dictionary import is needed — the shape is checked at the call sites. */
type Quote = {
  readonly q: string;
  readonly role: string;
  readonly firm: string;
};

/* ESTIMATED. A static capture cannot encode a rate. 90s for a full cycle of ten cards reads
   at roughly the same pace as the home page's 50px/s marquee; both rows share it so the
   counter-motion stays symmetrical. */
const CYCLE_S = 90;

/* ⚠️ CARD GEOMETRY IS PARTLY ESTIMATED and flagged in FEATURE.md. Measured: the quote is
   24px / -0.03em / 130% / left, the attribution is a 6px-gap column, and the row gap is 20.
   NOT measured: the card's own width, padding and fill — the capture wraps each block in a
   Framer component whose box did not survive extraction. 420px / 24px / ink@3% matches the
   logo tiles' fill and keeps two-and-a-bit cards visible at 1440, which is what the
   reference screenshot shows. */
function Card({ q, role, firm }: Quote) {
  return (
    <figure
      /* `me-5` was `mr-5`. It resolves to `margin-right` in LTR, so English is unchanged; it
         is the logical form because the 20px belongs on the card's inline-END, which is the
         side the next card arrives from in either direction. See the header note: this is NOT
         what makes the -50% loop exact, and the value is not pinned to the loop. */
      className="me-5 flex w-[320px] flex-none flex-col justify-between gap-6 rounded-[6px]
                 p-6 tablet:w-[420px]"
      style={{ backgroundColor: "#15151508" }}
    >
      <blockquote
        /* `text-start` was `text-left`. Unlike the two in ClixHero this one is LIVE, and has to
           be: the card is a fixed 320/420px and the quote wraps inside it, so there is real
           slack for `text-align` to distribute on every line but the longest. Computed value
           becomes the keyword `start` rather than `left` — pixel-identical in LTR, and the one
           entry in the logical-utility table that is not a computed-value identity. */
        className="h-auto w-full flex-none text-start font-sans text-[24px] text-ink"
        style={{ letterSpacing: "-0.03em", lineHeight: "130%" }}
      >
        {q}
      </blockquote>
      <figcaption className="flex h-min w-min flex-none flex-col items-start justify-center gap-[6px]">
        <span className="h-auto w-auto flex-none whitespace-pre font-sans text-[14px] text-ink">
          {role}
        </span>
        <span className="h-auto w-auto flex-none whitespace-pre font-sans text-[14px] text-muted">
          {firm}
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse }: { items: readonly Quote[]; reverse?: boolean }) {
  return (
    <div
      className="relative flex h-min w-full flex-row items-start justify-start overflow-hidden"
      /* ⚠️ THE MASK'S SYMMETRY IS LOAD-BEARING, AND IT IS WHY THERE IS NO `rtl:` VARIANT
         HERE. `linear-gradient` has no logical-direction keyword — `90deg` is a physical
         angle — so a lopsided ramp would need mirroring by hand. This one does not: the stops
         are 0/5/95/100, identical at both ends, so mirroring it maps it onto itself. Verified
         rather than overlooked (2026-08-12); if anyone ever makes the two ends differ, this
         becomes a direction bug and needs an `rtl:` pair. */
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg,#0000 0%,#000 5%,#000 95%,#0000 100%)",
        maskImage:
          "linear-gradient(90deg,#0000 0%,#000 5%,#000 95%,#0000 100%)",
      }}
    >
      <div
        className="clix-marquee flex w-max flex-none flex-row items-stretch"
        style={{
          animationDuration: `${CYCLE_S}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {/* Duplicated track. `aria-hidden` on the copy so a screen reader hears ten quotes,
            not twenty. */}
        {items.map((t, i) => (
          <Card key={`a${i}`} {...t} />
        ))}
        <div className="flex flex-row items-stretch" aria-hidden="true">
          {items.map((t, i) => (
            <Card key={`b${i}`} {...t} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ClixTestimonial() {
  const t = getDict().clix.testimonial;

  return (
    /* NO BACKGROUND, and that is measured: every block on the target is transparent —
         the shared fixed backdrop is the only thing on the page that paints a colour.
         `bg-paper` was here until 2026-08-10 and it was mine, not the capture's. It broke
         the bottom of the green section: an opaque white block slides up OVER the dark
         ground, so the dark runway the target shows after the manifesto could not exist.
         See ClixBackdrop.tsx. */
    <section
      id="clix-testimonials"
      data-nav-theme="light"
      className="relative z-[1] flex h-min w-full flex-col items-center justify-center gap-20
                 overflow-clip px-4 py-20
                 tablet:px-10 tablet:pt-32 tablet:pb-24"
    >
      <div
        className="relative flex h-min w-full max-w-[var(--container-max)] flex-col
                      items-center justify-center gap-20"
      >
        <h2
          className="h-auto w-full max-w-[350px] flex-none text-center font-display text-ink
                     text-[36px] tablet:max-w-[500px] tablet:text-[48px] desktop:text-[56px]"
          style={{ letterSpacing: "-0.05em", lineHeight: "110%" }}
        >
          {t.title}
        </h2>

        {/* Ticker wrapper — column, gap 20, full width */}
        <div className="relative flex h-min w-full flex-col items-center justify-center gap-5">
          <Row items={t.quotes} />
          <Row items={t.quotes.slice().reverse()} reverse />
        </div>
      </div>
    </section>
  );
}
