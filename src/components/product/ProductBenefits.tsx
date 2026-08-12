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
 * ⚠️ COPY IS CLIX'S. Rewritten 2026-08-12 from the target's six finance differentiators to
 * clix's own, in the same register and within ±10% of each original's character count so the
 * measured layout below still holds (the 84px description well fits 1–4 lines and no more).
 * Layout, tiers and the `Art` references are untouched. The route is noindex.
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

/* clix's six, in the capture's order and in its slots. Titles 1 and 3–6 are generic enough to
   stand as written; only #2 moved, because its art now lists workflows rather than prompts.
   Bodies 1–4 are adapted from `WhyRogo.tsx`'s `TENANTS`, which already carries these services
   in the right register — the same words, cut to this card's shorter measure. */
const BENEFITS = [
  {
    title: "Integrations",
    body:
      "Connect the payments, accounting, marketing and support tools you already run. We " +
      "wire them into one stack, with webhooks, middleware and monitoring.",
    Art: ArtIntegrations,
  },
  {
    title: "Ready Workflows",
    body:
      "Choose from a library of built workflows aimed at automating the jobs your team " +
      "repeats every week, end to end.",
    Art: ArtPrompts,
  },
  {
    /* ⚠️ The original credentialled this card with "ex-bankers and private equity investors",
       which is the target's own team, not ours. clix's real equivalent, per
       docs/reference/clixsolutions/README.md, is Unit 8200 and Technion alumni. */
    title: "Guided Implementation",
    body:
      "White-glove engagement and implementation with our Tel Aviv team of Unit 8200 and " +
      "Technion alumni.",
    Art: ArtGuided,
  },
  {
    title: "Custom-Trained Models",
    body:
      "Models trained on your own data, your tone of voice and your processes, so every " +
      "agent answers the way your best person would, at your standard.",
    Art: ArtCustomModels,
  },
  {
    title: "Governance & Permissions",
    body:
      "Granular permission controls, role-based access management, comprehensive audit " +
      "trails, and customizable governance policies, so every agent acts inside the limits " +
      "you set.",
    Art: ArtGovernance,
  },
  {
    title: "Single Tenant Deployment",
    body: "Run it in our cloud or inside yours, on the security terms your business sets.",
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
        One Platform That Learns
        <br />
        <span className="text-muted">How Your Team Works</span>
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
