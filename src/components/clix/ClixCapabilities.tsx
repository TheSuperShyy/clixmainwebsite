/**
 * ClixCapabilities — the marquee cloned from rogo.com/felix `Testimonial` (`.framer-h1knkl`),
 * carrying clix's own content. Measured from the 2026-08-09 capture; spec:
 * features/felix-page/FEATURE.md.
 *
 * ⚠️ THE NAME CHANGED ON 2026-08-13, THE GEOMETRY DID NOT. This was ClixTestimonial and it
 * rendered ten fabricated endorsements; it now renders ten capability cards from
 * `clix.capabilities`. Every measurement, mask, margin and loop note below is unchanged and
 * still describes the target's `Testimonial` block, because the box is the target's box. The
 * dictionary keys carry the history of the content swap.
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

/* WHAT THIS SECTION SAYS NOW, AND WHAT IT USED TO SAY.
 *
 * Until 2026-08-13 this rendered ten FABRICATED ENDORSEMENTS in both locales: rogo's real
 * quotes from real people, reattributed to invented finance firms and pointed at clix. It was
 * the only content on the page that was not merely unfinished but actively misleading, and it
 * was the stated reason /clix and /he/clix carry `robots: { index: false, follow: false }`.
 *
 * It was replaced, at the user's direction, with cards describing what clix actually builds.
 * Nothing here now puts words in anyone's mouth. Two things did NOT change with it, and both
 * are deliberate:
 *
 *   1. `robots: { index: false }` STAYS until the user lifts it. Removing the misleading block
 *      removes the reason it went on; it does not make the page launched.
 *   2. The Hebrew is AUTHORED, not sourced, and has not been read by a native speaker. See the
 *      note over `capabilities` in src/lib/i18n/he/clix.ts.
 *
 * The full history of the swap lives beside the strings in src/lib/i18n/{en,he}/clix.ts. */

/* Structural, so no dictionary import is needed — the shape is checked at the call sites.
   `line` is the 24px slot the quote used to occupy, `label` the 14px ink caption (was the
   role), `stack` the 14px muted one (was the firm). The three-part shape is why the swap
   needed no CSS. */
type Capability = {
  readonly line: string;
  readonly label: string;
  readonly stack: string;
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
function Card({ line, label, stack }: Capability) {
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
        {line}
      </blockquote>
      <figcaption className="flex h-min w-min flex-none flex-col items-start justify-center gap-[6px]">
        <span className="h-auto w-auto flex-none whitespace-pre font-sans text-[14px] text-ink">
          {label}
        </span>
        <span className="h-auto w-auto flex-none whitespace-pre font-sans text-[14px] text-muted">
          {stack}
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse }: { items: readonly Capability[]; reverse?: boolean }) {
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
        {/* Duplicated track. `aria-hidden` on the copy so a screen reader hears ten cards,
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

export default function ClixCapabilities() {
  const t = getDict().clix.capabilities;

  return (
    /* NO BACKGROUND, and that is measured: every block on the target is transparent —
         the shared fixed backdrop is the only thing on the page that paints a colour.
         `bg-paper` was here until 2026-08-10 and it was mine, not the capture's. It broke
         the bottom of the green section: an opaque white block slides up OVER the dark
         ground, so the dark runway the target shows after the manifesto could not exist.
         See ClixBackdrop.tsx. */
    <section
      id="clix-capabilities"
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
          <Row items={t.cards} />
          <Row items={t.cards.slice().reverse()} reverse />
        </div>
      </div>
    </section>
  );
}
