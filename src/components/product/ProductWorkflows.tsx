/**
 * ProductWorkflows — clone of rogo.com/product sub-block 2d, "Streamline & Automate Your
 * Workflows" (capture offset 327886, live class `.framer-c3kt2q` > `.framer-mxhjbj`).
 *
 * Capture: docs/reference/target/rogo-product-2026-08-11.html.
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md
 *
 * ⚠️ Copy is rogo's verbatim. The route is noindex.
 *
 * TIER MAP — three shapes, and the middle one is the surprise:
 *   >=1200  3 columns, gap 24; card is a COLUMN (art over text)
 *   810-1199 1 column, gap 32; card becomes a ROW (art beside text) — measured 944x579 at 1024
 *   <810    1 column; card is a COLUMN again — measured 358x625 at 390
 * A single "stack below desktop" rule would get the tablet tier wrong.
 *
 * The art keeps its 411/521 aspect at EVERY tier — the original's image is
 * `aspect-ratio:.78913; width:100%; height:auto` with no per-tier override, so at tablet it
 * takes half the row at the same proportion (456x578 of the measured 944x579 card) rather
 * than stretching. The three mocks live in workflowMocks.tsx.
 */

import { MockWorkflow, MockTable, MockMaterial } from "@/components/product/workflowMocks";

/* Verbatim from the capture, including the body copy. */
const CARDS = [
  {
    title: "Firm-Specific Workflows",
    body:
      "Create and automate workflows tailored to your needs, reducing manual tasks and " +
      "integrating seamlessly with your existing tools. Optimize processes for research, " +
      "analysis, and reporting to improve efficiency and accuracy.",
    Art: MockWorkflow,
  },
  {
    title: "AI Table Interface",
    body:
      "Organize and manage data effortlessly with an interactive table interface. Sort, " +
      "filter, and update information in real time, enabling structured analysis and " +
      "seamless decision-making.",
    Art: MockTable,
  },
  {
    title: "Material Creation",
    body:
      "Generate reports, summaries, and presentations with AI-powered automation. Transform " +
      "raw data into polished, professional materials while ensuring clarity and consistency.",
    Art: MockMaterial,
  },
] as const;

export default function ProductWorkflows() {
  return (
    /* `Feature` — column, items start, gap 64, overflow hidden. */
    <div className="flex w-full flex-col items-start justify-center gap-16 overflow-hidden">
      {/* Title container — capped at 512 from 1200 up, uncapped below (the original drops the
          max-width at the two smaller tiers, which is what puts the heading on two lines at
          desktop and lets it run wider on a phone). */}
      <div className="flex w-full flex-col items-start justify-center gap-6 desktop:max-w-[512px]">
        {/* h3 44/44/40/32, 400, 110%, -0.05em, ink. Same preset as the 2a intro. */}
        <h3
          className="w-full font-display text-[32px] font-normal text-ink
                     tablet:text-[40px] desktop:text-[44px]"
          style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
        >
          Streamline &amp; Automate Your Workflows
        </h3>
      </div>

      {/* Grid — 3 cols at desktop, 1 col below. Gap 24, except 32 at the tablet tier. */}
      <div className="grid w-full grid-cols-1 justify-center gap-6 overflow-hidden tablet:gap-8 desktop:grid-cols-3 desktop:gap-6">
        {CARDS.map(({ title, body, Art }) => (
          <article
            key={title}
            /* Card: column at phone and desktop, ROW at tablet. Gap 32 throughout.
               `self-start` is the original's `place-self:start` — without it a 4-line body
               (card 1) makes its grid row taller and the other two centre inside it, so their
               art drops ~10px and the three panels stop aligning along the top. */
            className="flex w-full flex-col items-center justify-start gap-8 self-start overflow-hidden
                       tablet:flex-row tablet:items-center
                       desktop:flex-col desktop:items-center"
          >
            {/* `min-w-0` on both halves: without it the flex row at tablet refuses to shrink
                below the mock's intrinsic width and the card overflows. */}
            <div className="w-full tablet:min-w-0 tablet:flex-1 desktop:w-full desktop:flex-none">
              <Art />
            </div>
            <div className="flex w-full flex-col items-start justify-center gap-2 tablet:min-w-0 tablet:flex-1 desktop:w-full desktop:flex-none">
              {/* 28px, 400, 110%, -0.02em, ink. */}
              <h4
                className="w-full font-display text-[28px] font-normal text-ink"
                style={{ lineHeight: "110%", letterSpacing: "-0.02em" }}
              >
                {title}
              </h4>
              {/* 16px, 400, 130%, -0.01em, muted. */}
              <p
                className="w-full font-sans text-[16px] font-normal text-muted"
                style={{ lineHeight: "130%", letterSpacing: "-0.01em" }}
              >
                {body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
