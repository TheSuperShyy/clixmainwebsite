"use client";

/* `"use client"` because this row is only ever mounted by ProductStepper, which is
   already a client component, and it now reads its labels through `usePageDict`. No
   client JS is added by the directive: the module was already in the client graph. */

/**
 * WorkflowsScroller — clone of rogo.com/product's `Workflows Scroller` (capture offset 257853).
 *
 * ⚠️ THIS IS NOT A TOP-LEVEL BLOCK. The section inventory derived from byte offsets read it as
 * one, and that was wrong: it is the animation panel for feature **03 "Automate your
 * workflows"** inside the stepper, and it only renders while that step is active.
 *
 * Two opposed ticker rows carrying ten `Shortcut Card` labels.
 *
 * ⚠️ THE TEN LABELS LIVE IN THE DICTIONARY (`workflows.labels`) AND ARE SHARED WITH
 * benefitArt.tsx, whose prompt stack renders the first NINE as pills. They used to be two
 * arrays in two files with a comment asking the reader to keep them in step; one tuple in one
 * place makes that structural.
 *
 * Reuses `.clix-marquee` from globals.css. THE CARDS MUST USE A MARGIN, NOT `gap` — that
 * keyframe translates the doubled track by exactly -50%, which is only a whole cycle if every
 * item carries its own trailing space. A `gap` leaves the doubled track one gap short and the
 * loop visibly tears. That lesson is already written down for /clix's Testimonial rows; it
 * applies unchanged here.
 *
 * ⚠️ DO NOT RENAME `.clix-marquee` OR MOVE IT OFF THE ANIMATED TRACK. globals.css carries a
 * `[dir="rtl"] .clix-marquee` rule that swaps `animation-name` to a `+50%` keyframe; if the
 * selector stops matching, the Hebrew strip runs the wrong way with no error. The inline
 * `animationDuration` / `animationDirection` below keep winning, and `reverse` mirrors on its
 * own, so there is nothing else to do here.
 */

import { usePageDict } from "@/lib/i18n/LocaleProvider";
import { interpolate } from "@/lib/i18n/format";

/* Speed is NOT in the capture — Framer drives this in JS. Estimated, and slower than the home
   page's logo row (50 px/s) because these are read as words, not scanned as marks.
   Fitted values, unchanged by the rtl pass: a duration has no direction. */
const ROW_ONE_SECONDS = 38;
const ROW_TWO_SECONDS = 46;
/* Five per row. The split is layout, so it is an index into the ten rather than a second list. */
const PER_ROW = 5;

/* Card shape corrected 2026-08-11 from the user's step-03 reference screenshot. The first
   pass built these as small pills with a leading dot; the original's are TALLER TILES with a
   green glyph on its own line above a two-line label. Roughly 200x86 at desktop. */
function Card({ label }: { label: string }) {
  return (
    /* `me-3` rather than `mr-3`. The loop arithmetic is INDIFFERENT to which side the margin
       sits on — a margin contributes the same width either way, so half the doubled track is
       exactly one cycle and adjacent gaps stay uniform in both directions. `me-*` is chosen
       because it puts the trailing space, and therefore the seam gap, on the mirrored side.
       It resolves to `margin-right` in ltr, so the English computed value is unchanged. */
    <li
      className="me-3 flex h-[86px] w-[186px] shrink-0 flex-col justify-between rounded-[4px]
                 bg-paper p-3 shadow-[0_0_0_1px_var(--color-hairline)]"
    >
      {/* A neutral document glyph rather than rogo's per-workflow marks — the row reads as a
          shelf of saved workflows either way, and redrawing a trademark is out of scope. */}
      <span className="h-5 w-5 shrink-0 text-brand-green" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      </span>
      <span
        className="font-sans text-[14px] font-normal text-ink"
        style={{ lineHeight: "1.25em", letterSpacing: "-0.01em" }}
      >
        {label}
      </span>
    </li>
  );
}

function Row({ items, seconds, reverse }: { items: readonly string[]; seconds: number; reverse?: boolean }) {
  return (
    <div className="relative w-full overflow-hidden" aria-hidden="true">
      <ul
        className="clix-marquee flex w-max list-none items-center"
        style={{
          animationDuration: `${seconds}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {/* Doubled track — the second copy is what makes -50% land on a seam. */}
        {[...items, ...items].map((label, i) => (
          <Card key={`${label}-${i}`} label={label} />
        ))}
      </ul>
    </div>
  );
}

export default function WorkflowsScroller() {
  const t = usePageDict("product").workflows;
  return (
    <div className="flex w-full flex-col items-stretch justify-center gap-3 overflow-hidden">
      <Row items={t.labels.slice(0, PER_ROW)} seconds={ROW_ONE_SECONDS} />
      <Row items={t.labels.slice(PER_ROW, PER_ROW * 2)} seconds={ROW_TWO_SECONDS} reverse />
      {/* The ten labels are decorative motion above; this is what a screen reader gets. The
          join is `interpolate`d into the sentence rather than concatenated, so the punctuation
          around the list is the translator's to choose. */}
      <span className="sr-only">
        {interpolate(t.srShortcuts, { list: t.labels.join(", ") })}
      </span>
    </div>
  );
}
