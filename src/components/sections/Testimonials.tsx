"use client";

/**
 * Testimonials — clone of rogo.ai `#testimonials` (`.framer-1119het`).
 *
 * Spec, provenance and open questions: features/testimonials/FEATURE.md.
 * Do not "tidy" a number here without changing that file first.
 *
 * The original ships two DOM subtrees (Framer's `ssr-variant` trick): a three-column
 * desktop row at >=1200px and a stacked accordion at <=1199.98px. We render ONE tree and
 * switch with the `desktop:` variant, because duplicating three quotes into the DOM to
 * hide one copy costs the a11y tree more than it saves us. The two exceptions are the
 * plus button — which changes PARENT between tiers, so CSS alone cannot move it — and the
 * phone headline's hard line break. Both are rendered twice and hidden per tier.
 *
 * Geometry of the desktop row, since the percentages look arbitrary:
 *   container 100% - 2 gaps of 12px; closed cards are 17% each (Framer's own number),
 *   so the open card is `calc(66% - 24px)`. 17 + 17 + 66 = 100, and the 24px it gives
 *   back is exactly the two gaps. Widths are explicit rather than `flex:1 0 0` (what the
 *   capture uses) precisely so the open/close transition has two numbers to interpolate.
 */

import { useState } from "react";
import { BairdMark, NomuraMark, TruistMark } from "@/components/ui/TestimonialLogos";

type Testimonial = {
  id: string;
  /* Logo box, measured: `.framer-16l79rw-container` is 40px tall and each mark sets its
     own height as a percentage of that, with the width falling out of an aspect-ratio.
     Truist 67% -> 26.8px @ 4.125 · Nomura 42% -> 16.8px @ 5.70833 · Baird 46% -> 18.4px
     @ 3.60526. Written as px because the 40px parent never changes across tiers. */
  mark: (props: { className?: string }) => React.ReactElement;
  markClass: string;
  quote: string;
  name: string;
  role: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "truist",
    mark: TruistMark,
    markClass: "h-[26.8px] aspect-[4.125]",
    quote:
      "“We continue to look for ways to leverage best-in-class Artificial Intelligence platforms to create more efficiencies for our teammates and deliver results for our clients. We’ve had a very successful integration with Rogo, and the relationship and strategic investment have helped boost productivity, reduce risk, and create more capacity for our bankers to focus on building relationships and driving growth.”",
    name: "Tom Hackett",
    role: "Chief Executive Officer, Truist Securities",
  },
  {
    id: "nomura",
    mark: NomuraMark,
    markClass: "h-[16.8px] aspect-[5.70833]",
    /* Straight quotes here, curly on the other two — that inconsistency is the
       original's, copied verbatim rather than normalised. */
    quote:
      '"Our strategic integration of Rogo transforms how we deliver value to clients. Rogo enables our teams to analyze market data and identify opportunities with unprecedented speed and precision, while allowing our bankers to focus more deeply on client relationships and strategic advisory."',
    name: "Patrice Maffre",
    role: "International Head of Investment Banking, Nomura",
  },
  {
    id: "baird",
    mark: BairdMark,
    markClass: "h-[18.4px] aspect-[3.60526]",
    quote:
      "“Rogo saves our team’s time, results in increased consistency in deliverables, and enables senior bankers to more autonomously get the information needed to engage with clients. Additionally, it is valued by our junior bankers and contributes to enhanced work-life balance, which supports talent retention.”",
    name: "Ross Williams",
    role: "Chief Operating Officer, Baird Global Investment Banking",
  },
];

/* The capture draws this as a CSS mask on a 20px box; the path is an 18px plus glyph
   translated (3,3) inside a 24-unit viewBox. Inlined as an SVG instead so it inherits
   `currentColor` and needs no mask-mode fallbacks. */
function PlusGlyph() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M 8 10 L 0 10 L 0 8 L 8 8 L 8 0 L 10 0 L 10 8 L 18 8 L 18 10 L 10 10 L 10 18 L 8 18 Z"
        transform="translate(3 3)"
        fill="currentColor"
      />
    </svg>
  );
}

function PlusButton({ open, className = "" }: { open: boolean; className?: string }) {
  return (
    /* opacity 0 when the card is open — NOT `display:none`. It keeps its 44px box so the
       desktop card's `justify-between` column keeps the same rhythm either way. */
    <div
      className={`flex w-min items-center justify-center rounded-[6px] bg-ink-wash p-3
                  text-ink-soft transition-opacity duration-300
                  ${open ? "opacity-0" : "opacity-100"} ${className}`}
      style={{ transitionTimingFunction: "var(--ease-rogo)" }}
      aria-hidden="true"
    >
      <PlusGlyph />
    </div>
  );
}

function Card({
  item,
  open,
  onOpen,
}: {
  item: Testimonial;
  open: boolean;
  onOpen: () => void;
}) {
  const Mark = item.mark;
  const panelId = `testimonial-${item.id}-quote`;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      /* mobile: w-full, height min-content, padding 32, gap 96, centred
         desktop: fixed 600px, padding 32/56/32/32, space-between, width animates */
      className={`relative flex cursor-pointer flex-col items-start justify-center gap-24
                  overflow-hidden rounded-[6px] bg-card p-8
                  transition-[width] duration-500
                  focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2
                  focus-visible:ring-offset-canvas focus-visible:outline-none
                  desktop:h-full desktop:justify-between desktop:gap-0
                  desktop:py-8 desktop:pr-14 desktop:pl-8
                  ${open ? "desktop:w-[calc(66%-24px)]" : "desktop:w-[17%]"}`}
      style={{ transitionTimingFunction: "var(--ease-rogo)" }}
    >
      {/* Quote — logo row + the collapsible body. gap 32 mobile / 56 desktop. */}
      <div className="flex w-full flex-col items-start gap-8 desktop:gap-14">
        {/* Button Container: row with the plus pushed right on mobile, a lone
            centred column on desktop (the plus lives in Bottom there instead). */}
        <div
          className="flex w-full flex-row items-center justify-between
                     desktop:w-min desktop:flex-col desktop:justify-center desktop:gap-[10px]"
        >
          {/* Logo wrapper — 40px tall, 30% ink. The opacity is on the wrapper in the
              original, not on the mark, and it does not change with open/closed. */}
          <div className="flex h-10 w-min flex-col items-start justify-center opacity-30">
            <Mark className={item.markClass} />
          </div>
          <PlusButton open={open} className="desktop:hidden" />
        </div>

        {/* Collapsible quote body.
            The capture collapses this to a literal 1px (desktop) / 3px (mobile) sliver
            with `overflow:clip` rather than to zero — those are Framer's minimums, kept
            here as the closed-state min-height. The 0fr/1fr grid is ours: it is the only
            way to transition to an intrinsic height, and the original animates this in JS
            where CSS cannot follow. */}
        <div
          id={panelId}
          className={`grid w-full overflow-hidden transition-[grid-template-rows,opacity]
                      duration-500
                      ${open ? "grid-rows-[1fr] opacity-100" : "min-h-[3px] grid-rows-[0fr] opacity-0 desktop:min-h-px"}`}
          style={{ transitionTimingFunction: "var(--ease-rogo)" }}
        >
          <div className="min-h-0" aria-hidden={!open}>
            <blockquote
              className="max-w-none font-display text-[20px] text-ink
                         desktop:max-w-[840px] desktop:text-[28px]"
              style={{ lineHeight: "125%", letterSpacing: "-0.03em" }}
            >
              {item.quote}
            </blockquote>
          </div>
        </div>
      </div>

      {/* Bottom — gap 32. Holds the desktop plus button and the attribution. */}
      <div className="flex w-full flex-col items-start gap-8">
        <PlusButton open={open} className="hidden desktop:flex" />

        {/* Testimonial Provider — gap 28 (only one child in the original, so it never
            applies; kept so the structure still matches the capture). */}
        <div className="flex w-full flex-row items-center justify-center gap-7">
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
            <p
              className="line-clamp-1 w-full font-sans text-[16px] font-medium text-ink"
              style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
            >
              {item.name}
            </p>
            {/* Role truncates to one line on desktop — that is why the closed cards read
                "International…" in the reference. Mobile lets it wrap. */}
            <p
              className="w-full font-sans text-[16px] font-medium text-ink opacity-40
                         desktop:line-clamp-1"
              style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
            >
              {item.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [openId, setOpenId] = useState(TESTIMONIALS[0].id);

  return (
    <section
      data-nav-theme="light"
      id="testimonials"
      /* padding 128/16 phone → 164/40/128 tablet → 196/40/80 desktop+ */
      className="relative flex w-full flex-col items-center justify-center overflow-hidden
                 bg-canvas px-4 py-32
                 tablet:px-10 tablet:pt-[164px]
                 desktop:pt-[196px] desktop:pb-20"
    >
      {/* Width Container — max-w 1280, gap 80 */}
      <div
        className="relative flex w-full max-w-none flex-col items-center gap-20
                   tablet:max-w-[var(--container-max)]"
      >
        {/* h1 in the original. Demoted to h2 here: the page already has the hero's h1 and
            two of them is a real defect, not a design choice. Purely semantic — nothing
            about the rendering changes. Logged in FEATURE.md. */}
        <div className="relative w-full max-w-none tablet:max-w-[600px] desktop:w-auto">
          <h2
            className="text-center font-display text-[36px] text-ink
                       tablet:text-[44px] desktop:text-[48px]"
            style={{ lineHeight: "105%", letterSpacing: "-0.05em" }}
          >
            {/* The phone tier carries a hard break after "finance"; every wider tier lets
                the 600px measure do the wrapping. Two spans rather than a hideable <br>,
                which would weld "finance" to "teams" once the break is display:none. */}
            <span className="tablet:hidden">
              Helping finance
              <br />
              teams build smarter organizations
            </span>
            <span className="hidden tablet:inline">
              Helping finance teams build smarter organizations
            </span>
          </h2>
        </div>

        {/* Cards — stacked at <=1199.98 (gap 16), a 600px-tall row at >=1200 (gap 12). */}
        <div className="flex w-full flex-col gap-4 desktop:h-[600px] desktop:flex-row desktop:gap-3">
          {TESTIMONIALS.map((item) => (
            <Card
              key={item.id}
              item={item}
              open={openId === item.id}
              onOpen={() => setOpenId(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
