/**
 * ProductFeatures — clone of rogo.com/product block `Features` (#features).
 *
 * Capture: docs/reference/target/rogo-product-2026-08-11.html (+ .css).
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md
 *
 * ⚠️ Copy is rogo's verbatim by decision ("clone now, rewrite after"). The route is noindex.
 *
 * TIER MAP — three sizes, not four. XL (>=1600) and desktop (1200-1599.98) share every value
 * in this block; the only `min-width:1600px` rules in the whole page belong to the tier-gating
 * `hidden-*` classes, not to any box here. Base = phone, then `tablet:`, then `desktop:`.
 *
 * ⚠️ CORRECTION TO THE ORIGINAL SECTION INVENTORY (2026-08-11). The page map derived from the
 * capture's byte offsets treated `Data Partners` ("Trusted Data") and `Benefits` as top-level
 * sections. THEY ARE NOT. Probing the live render shows `#features` is a single 4024px band
 * (at 1440) whose direct children are:
 *     [Product]        intro headline (2a) + the stepper (2b) + the workflow cards (2d)
 *     [Data Partners]  "Trusted Data"                                       <- Block 3
 *     [Feature]        "AI That Learns How Your Firm Thinks and Works"      <- Block 4
 * Only `Security`, `Testimonials` and `Footer` are genuine siblings of this section.
 * Byte offsets tell you document order, not nesting — read the rendered tree for nesting.
 *
 * SCOPE: this file holds 2a (shell + intro) and composes 2b, 2d, Block 3 and Block 4 — all
 * five as children of the one section. `#features` is complete; `Security` (Block 5) and
 * `Testimonials` (Block 6) are its siblings and belong in the route, not here.
 *
 * ⚠️ 2b SHIPS TWO FULL DOM VARIANTS, not one responsive tree — see ProductStepper.tsx.
 */

/* Left-aligned, `text-wrap: balance`, and split mid-sentence: the first clause is `muted` and
   the rest is `ink`. One <h3> with an inner <span>, exactly as the original does it — two
   sibling blocks would let the halves wrap independently and break the sentence. */
import ProductStepper from "@/components/product/ProductStepper";
import ProductWorkflows from "@/components/product/ProductWorkflows";
import ProductDataPartners from "@/components/product/ProductDataPartners";
import ProductBenefits from "@/components/product/ProductBenefits";

const INTRO_MUTED = "Just as Bloomberg digitized financial data in the 1980s,";
const INTRO_INK = " Rogo is now transforming financial workflows.";

export default function ProductFeatures() {
  return (
    <section
      id="features"
      data-nav-theme="light"
      /* Measured: bg `paper`, column, items centred, gap 120, padding 96/40
         (tablet 80/40, phone 80/16), overflow hidden. */
      className="relative flex w-full flex-col items-center justify-start gap-[120px]
                 overflow-hidden bg-paper px-4 py-20
                 tablet:px-10
                 desktop:py-24"
    >
      {/* `Product` — max-w 1280 (= --container-max), gap 96. */}
      <div className="relative flex h-min w-full max-w-[var(--container-max)] flex-col items-center justify-center gap-24 overflow-hidden">
        {/* `.framer-132yhjx` — gap 96 between the intro and the 01-04 stepper that follows. */}
        <div className="relative flex h-min w-full flex-col items-center justify-center gap-24 overflow-hidden">
          {/* h3 44/44/40/32, weight 400, -0.05em, 110%, balanced, LEFT aligned.
              The preset's own colour is `ink`; the element overrides the whole heading to
              `muted` and the inner span puts the second clause back to `ink`. Ours states
              both directly rather than reproducing the override dance. */}
          <h3
            className="w-full text-left text-balance font-display text-[32px] font-normal
                       text-muted tablet:text-[40px] desktop:text-[44px]"
            style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
          >
            {INTRO_MUTED}
            <span className="text-ink">{INTRO_INK}</span>
          </h3>

          {/* 2b — the stepper (>=1200) / stacked features (<1200). Sibling of the intro
              inside `.132yhjx`, so the 96px gap above is the original's. */}
          <ProductStepper />
        </div>

        {/* 2d — "Streamline & Automate Your Workflows". A sibling of `.132yhjx` inside
            `Product`, so it is the 96px `gap-24` on the parent that separates it, not a
            margin of its own. */}
        <ProductWorkflows />
      </div>

      {/* Block 3 — "Trusted Data". A SIBLING of `Product` inside this section, so the 120px
          `gap-[120px]` above separates it; it carries only its own `48px 0` padding. */}
      <ProductDataPartners />

      {/* Block 4 — "AI That Learns How Your Firm Thinks and Works". The section's last child,
          separated by the same 120px gap. */}
      <ProductBenefits />
    </section>
  );
}
