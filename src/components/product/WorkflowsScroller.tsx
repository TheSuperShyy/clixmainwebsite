/**
 * WorkflowsScroller — clone of rogo.com/product's `Workflows Scroller` (capture offset 257853).
 *
 * ⚠️ THIS IS NOT A TOP-LEVEL BLOCK. The section inventory derived from byte offsets read it as
 * one, and that was wrong: it is the animation panel for feature **03 "Automate your
 * workflows"** inside the stepper, and it only renders while that step is active.
 *
 * Two opposed ticker rows carrying the original's ten `Shortcut Card` labels, verbatim.
 *
 * Reuses `.clix-marquee` from globals.css. THE CARDS MUST USE `margin-right`, NOT `gap` —
 * that keyframe translates the doubled track by exactly -50%, which is only a whole cycle if
 * every item carries its own trailing space. A `gap` leaves the doubled track one gap short
 * and the loop visibly tears. That lesson is already written down for /clix's Testimonial
 * rows; it applies unchanged here.
 */

/* Verbatim from the capture — `Shortcut Card 01`..`10`, in the original's own order. */
const ROW_ONE = [
  "Lead Intake and Routing",
  "Appointment Booking",
  "Quote Follow Up",
  "Invoice Reconciliation",
  "Call Summary and Tagging",
];
const ROW_TWO = [
  "Customer Onboarding",
  "WhatsApp Support Triage",
  "Weekly Ops Report",
  "Renewal Reminders",
  "Document Collection",
];

/* Speed is NOT in the capture — Framer drives this in JS. Estimated, and slower than the home
   page's logo row (50 px/s) because these are read as words, not scanned as marks. */
const ROW_ONE_SECONDS = 38;
const ROW_TWO_SECONDS = 46;

/* Card shape corrected 2026-08-11 from the user's step-03 reference screenshot. The first
   pass built these as small pills with a leading dot; the original's are TALLER TILES with a
   green glyph on its own line above a two-line label. Roughly 200x86 at desktop. */
function Card({ label }: { label: string }) {
  return (
    <li
      className="mr-3 flex h-[86px] w-[186px] shrink-0 flex-col justify-between rounded-[4px]
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

function Row({ items, seconds, reverse }: { items: string[]; seconds: number; reverse?: boolean }) {
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
  return (
    <div className="flex w-full flex-col items-stretch justify-center gap-3 overflow-hidden">
      <Row items={ROW_ONE} seconds={ROW_ONE_SECONDS} />
      <Row items={ROW_TWO} seconds={ROW_TWO_SECONDS} reverse />
      {/* The ten labels are decorative motion above; this is what a screen reader gets. */}
      <span className="sr-only">
        Saved workflow shortcuts: {[...ROW_ONE, ...ROW_TWO].join(", ")}.
      </span>
    </div>
  );
}
