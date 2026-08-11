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
 * drop `gap` entirely and give every card its own `margin-right`. Then n items measure
 * exactly n x (card + 20), the doubled track is exactly twice that, and -50% is precisely
 * one cycle — no measuring pass needed, unlike the carousel which had to compute its own.
 */

/* ⚠️⚠️  THESE ARE NOW FABRICATED ENDORSEMENTS. READ BEFORE LAUNCH.  ⚠️⚠️
 *
 * The names were changed to Clix on 2026-08-10 with the rest of the page ("change all of
 * Clix into clix"). The WORDS are still rogo's: ten real quotes from real people about a
 * real product that is not this one, now attributed to plausible-sounding firms and pointed
 * at clix.
 *
 * Before the rename they read as obvious placeholder text, which was safe. They no longer
 * do. This block is the single reason `robots: { index: false }` must stay on the route: it
 * is the only content on the page that is not merely unfinished but actively misleading.
 *
 * THE FIX IS NOT ANOTHER RENAME. It is real clix references, with permission, or deleting
 * the block. Flagged to the user at the time of the change and left in place at their
 * direction, on a staging URL that is not indexed and has not launched. */
const QUOTES = [
  {
    q: "Clix may have just created the greatest AI Agent ever. It is incredible.",
    role: "Managing Director",
    firm: "APAC Boutique Bank",
  },
  {
    q: "Clix completely blew past my expectations, delivering a strong output on a task I assumed it wouldn’t handle.",
    role: "Managing Director",
    firm: "APAC Boutique Bank",
  },
  {
    q: "One of the few tools that actually fits how bankers think and structure outputs",
    role: "Vice President",
    firm: "Top 5 U.S. BB Investment Bank",
  },
  {
    q: "This is the most helpful AI tool I’ve tried - it gets how we work",
    role: "Managing Director",
    firm: "Top 5 U.S. BB Investment Bank",
  },
  {
    q: "Clix is stellar. Seriously impressive",
    role: "Associate",
    firm: "Top 5 U.S. BB Investment Bank",
  },
  {
    q: "Clix can get real work 90% of the way there",
    role: "Vice President",
    firm: "Top 10 U.S. Equity Research Firm",
  },
  {
    q: "Clix tripled my team's output with no headcount additions",
    role: "Group Head",
    firm: "Boutique TMT Investment Bank",
  },
  {
    q: "I’ve tried all the AI tools available out there and Clix is by far the most advanced model / agent I’ve used",
    role: "Principal",
    firm: "Mega Fund Private Equity",
  },
  {
    q: "Clix has done more than anything else we've deployed",
    role: "Head of AI",
    firm: "Top 5 Global PE Firm",
  },
  {
    q: "10 word prompt? And it did all of that? Mind-blowing.",
    role: "Partner",
    firm: "European Growth Equity Firm",
  },
];

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
function Card({ q, role, firm }: (typeof QUOTES)[number]) {
  return (
    <figure
      className="mr-5 flex w-[320px] flex-none flex-col justify-between gap-6 rounded-[6px]
                 p-6 tablet:w-[420px]"
      style={{ backgroundColor: "#15151508" }}
    >
      <blockquote
        className="h-auto w-full flex-none text-left font-sans text-[24px] text-ink"
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

function Row({ items, reverse }: { items: typeof QUOTES; reverse?: boolean }) {
  return (
    <div
      className="relative flex h-min w-full flex-row items-start justify-start overflow-hidden"
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
          What leading finance teams have to say
        </h2>

        {/* Ticker wrapper — column, gap 20, full width */}
        <div className="relative flex h-min w-full flex-col items-center justify-center gap-5">
          <Row items={QUOTES} />
          <Row items={QUOTES.slice().reverse()} reverse />
        </div>
      </div>
    </section>
  );
}
