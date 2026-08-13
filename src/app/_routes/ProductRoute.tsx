/**
 * /product — clone of rogo.com/product.
 * Capture: docs/reference/target/rogo-product-2026-08-11.{html,css} (612 KB + 180 KB).
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md.
 *
 * NAV IS FIXED HERE, like / and /news and unlike /clix. Measured, not assumed: the header on
 * this page is `.framer-1lcee9e` — byte-identical to the home page's class — with
 * `position:fixed; z-index:3; top/left/right:0`. So no `spacer`; the hero's own 198px top
 * padding clears the banner + nav row, exactly the job /news's 220px does.
 *
 * ⚠️ NOINDEX, AND IT MUST STAY THAT WAY. The reason CHANGED on 2026-08-12, read on.
 *
 * The content pass ran on 2026-08-12: rogo's copy is gone, replaced with clix's own. The
 * named financial-data vendors, the SOC2/ISO 27001 badges clix does not hold, and the three
 * photographed real people at real firms are all out. So the ORIGINAL reason for the guard
 * is cleared.
 *
 * It stays anyway, because the pass introduced a new one: Block 6 carries PLACEHOLDER quotes
 * attributed to clix's real, named clients. clix has no written testimonials, only video, so
 * the words in those cards are invented and the people are real. That is the same class of
 * problem the vendor logos were, and it is why ProductTestimonials.tsx carries its own
 * warning block.
 *
 * The guard lifts when all four hold, tracked in features/product-page/FEATURE.md:
 *   1. no third-party trademark in copy or assets
 *   2. no certification badge clix does not hold
 *   3. no real person quoted, INCLUDING the placeholders
 *   4. every string is clix's own
 * Items 1, 2 and 4 are done. Item 3 is not. Do not remove the robots block as part of
 * unrelated work.
 */

import Nav from "@/components/sections/Nav";
import ProductHero from "@/components/product/ProductHero";
import ProductFeatures from "@/components/product/ProductFeatures";
import ProductSecurity from "@/components/product/ProductSecurity";
import ProductTestimonials from "@/components/product/ProductTestimonials";
import Footer from "@/components/sections/Footer";
import { fetchModels } from "@/lib/models";
import type { Locale } from "@/lib/i18n/config";
import { seedLocale, getDict } from "@/lib/i18n/server";
import { PageDictProvider } from "@/lib/i18n/LocaleProvider";

export default async function ProductRoute({ locale }: { locale: Locale }) {
  /* Seeded here as well as in the root layout: this body is the direct parent of
     every section, so a server component below it can never read the locale before
     it is set, regardless of layout ordering. */
  seedLocale(locale);

  const models = await fetchModels();

  return (
    /* Client components below this point read their strings with
       usePageDict("product"). Server components use getDict().product directly and do not
       need the provider at all — it is here for the client half only. */
    <PageDictProvider name="product" value={getDict().product}>
      <>
        <Nav models={models} />
        {/* `flex flex-col` is load-bearing, not tidiness. Below 1200 the original reorders
            the page — `Features` order 1, `Testimonials` order 2, `Security` order 3 — so
            security drops BELOW the testimonials on tablet and phone. The two components
            carry the `order-*` classes; this is the flex container they need. */}
        <main className="flex flex-col">
          <ProductHero />
          <ProductFeatures />
          <ProductSecurity />
          <ProductTestimonials />
        </main>
        {/* Byte-identical to the home page's footer in both captures — same
            `.framer-8dt5bh-container`, same link rows. Reused unchanged; it was the one block
            the plan called right. Its copy is already clix's own ("Software that works, results
            that speak."), rewritten on 2026-08-05, so the content pass had nothing to do here. */}
        <Footer />
      </>
    </PageDictProvider>
  );
}
