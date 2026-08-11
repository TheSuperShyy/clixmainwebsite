/**
 * ProductBenefits — clone of rogo.com/product's `Benefits` block, "AI That Learns How Your
 * Firm Thinks and Works". Block 4, capture offset 371914, live class `.framer-ly0q7s`.
 *
 * Capture: docs/reference/target/rogo-product-2026-08-11.html (+ .css).
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md
 *
 * ⚠️ NOT A SECTION. Like `Data Partners`, it is a child of `#features` and the last one — see
 * the correction note at the top of ProductFeatures.tsx.
 *
 * ⚠️ SIX benefits, not four. Slicing the capture from this block's offset to the next
 * section's marker reads as four; a live probe finds six. `Governance & Permissions` and
 * `Single Tenant Deployment` are the two a byte-slice misses — the same class of mistake as
 * the section inventory itself. Count against the render, not the file.
 *
 * ⚠️ Copy is rogo's verbatim. The route is noindex.
 *
 * TIER MAP — probed live at 1440 / 1024 / 390:
 *
 * |               | ≥1200      | 810–1199   | ≤809       |
 * |---------------|------------|------------|------------|
 * | block gap     | 40         | 40         | 40         |
 * | h3            | 44         | 40         | 32         |
 * | grid          | 3 × 416    | 2 × 464    | 1 × 358    |
 * | grid gap      | 16         | 16         | 16         |
 * | card padding  | `24 16 16` | `24 16 16` | `16`       |
 *
 * The card's height is **not authored per tier** — every card is `aspect-ratio: 0.788044`,
 * exactly the ratio 2d's art boxes use. That is why 416→528, 464→589 and 358→454 all agree;
 * they are one rule, not three numbers.
 */

import {
  ArtIntegrations,
  ArtPrompts,
  ArtGuided,
  ArtCustomModels,
  ArtGovernance,
  ArtTenant,
} from "@/components/product/benefitArt";

/* Verbatim from the capture, in the original's order. */
const BENEFITS = [
  {
    title: "Integrations",
    body:
      "Connect seamlessly with your existing providers and file systems. Enhance your " +
      "workflows by interacting with internal & external data sources.",
    Art: ArtIntegrations,
  },
  {
    title: "Prompt Library",
    body:
      "Choose from our library of professionally written prompts aimed at automating your " +
      "common workflows end-to-end.",
    Art: ArtPrompts,
  },
  {
    title: "Guided Implementation",
    body:
      "White-glove engagement and implementation with our team of ex-bankers and private " +
      "equity investors.",
    Art: ArtGuided,
  },
  {
    title: "Custom-Trained Models",
    body:
      "Custom-trained LLMs built for finance, using professionally labeled data tailored to " +
      "the workflows and precision standards of investment banking.",
    Art: ArtCustomModels,
  },
  {
    title: "Governance & Permissions",
    body:
      "Granular permission controls, role-based access management, comprehensive audit " +
      "trails, and customizable governance policies to streamline compliance and safeguard " +
      "your data.",
    Art: ArtGovernance,
  },
  {
    title: "Single Tenant Deployment",
    body: "Flexible deployment options to meet your security and infrastructure needs.",
    Art: ArtTenant,
  },
] as const;

export default function ProductBenefits() {
  return (
    /* `.framer-ly0q7s` — column, items start, gap 40, max-w 1280, no padding of its own. */
    <div className="flex w-full max-w-[var(--container-max)] flex-col items-start justify-start gap-10">
      {/* Same h3 preset as 2a, 2d and Block 3: 44 / 40 / 32, 400, 110%, −0.05em.
          The line break is the original's own `<br>`, not a wrap: the first line is `ink` and
          the second is `muted`, so where it breaks IS the colour boundary and cannot be left
          to the browser. */}
      <h3
        className="w-full font-display text-[32px] font-normal text-ink tablet:text-[40px] desktop:text-[44px]"
        style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
      >
        AI That Learns How Your
        <br />
        <span className="text-muted">Firm Thinks and Works</span>
      </h3>

      {/* `.framer-3qeold` — grid, gap 16, 1 → 2 → 3 columns. */}
      <ul className="grid w-full list-none grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {BENEFITS.map(({ title, body, Art }) => (
          <li
            key={title}
            /* `Benefit` — `surface` fill, radius 0, column. The aspect-ratio is what fixes the
               height at every tier; see the tier note above. */
            className="flex aspect-[0.788044] w-full flex-col overflow-hidden bg-surface p-4 tablet:pt-6"
          >
            {/* h6 28 / 110% / −0.04em / 500. The original sets this one in Inter, not its
                display face — both resolve to Discovery here, so it is a note, not a choice. */}
            <h6
              className="w-full font-sans text-[28px] font-medium text-ink"
              style={{ lineHeight: "110%", letterSpacing: "-0.04em" }}
            >
              {title}
            </h6>

            {/* The art well: `flex: 1 0 0`, centred, clipped. Every graphic inside renders at
                a fixed pixel size, so this box only ever positions it. */}
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
              <Art />
            </div>

            {/* Description well: a fixed 84px box with the text pinned to its BOTTOM
                (`justify-content: flex-end`). That is what keeps the six bodies — 1 line to 4
                — sitting on one baseline across the row. */}
            <div className="flex h-[84px] shrink-0 flex-col justify-end">
              <p
                className="w-full font-sans text-[14px] font-normal text-muted"
                style={{ lineHeight: "130%", letterSpacing: "-0.01em" }}
              >
                {body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
