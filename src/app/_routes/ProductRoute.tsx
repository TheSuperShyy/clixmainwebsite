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
 * ⚠️ NOINDEX. The reason CHANGED TWICE — on 2026-08-12, and again on 2026-08-13. Read on.
 *
 * The content pass ran on 2026-08-12: rogo's copy is gone, replaced with clix's own. The
 * named financial-data vendors, the SOC2/ISO 27001 badges clix does not hold, and the three
 * photographed real people at real firms are all out. So the ORIGINAL reason for the guard
 * is cleared.
 *
 * It stayed anyway, because that pass introduced a new one: Block 6 carried PLACEHOLDER quotes
 * attributed to clix's real, named clients — invented words in real people's mouths.
 *
 * ⚠️ ON 2026-08-13 BLOCK 6 LEFT THIS ROUTE. The quote carousel moved to the landing page (see
 * sections/Testimonials.tsx), taking the placeholder quotes with it. So the four-item gate
 * tracked in features/product-page/FEATURE.md now reads:
 *   1. no third-party trademark in copy or assets      — done
 *   2. no certification badge clix does not hold       — done
 *   3. no real person quoted, INCLUDING the placeholders — DONE, as of the Block 6 move
 *   4. every string is clix's own                      — done
 *
 * All four hold. THE GUARD IS NOW LIFTABLE, and it is left in place only because lifting it
 * is the user's call to make, not a side effect of moving a section. Raise it with them; do
 * not remove the robots block as part of unrelated work.
 *
 * ⚠️ AND NOTE WHERE THE PROBLEM WENT. The placeholder quotes are now on the LANDING page,
 * which is indexed. They are held behind the `SHOW_QUOTES` switch in sections/Testimonials.tsx
 * precisely so nothing fabricated ships; that switch, not this comment, is the live guard.
 */

import Nav from "@/components/sections/Nav";
import ProductHero from "@/components/product/ProductHero";
import ProductFeatures from "@/components/product/ProductFeatures";
import ClixFelixFooter from "@/components/clix/ClixFelixFooter";
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
        {/* ⚠️ `flex flex-col` USED TO BE LOAD-BEARING AND NO LONGER IS. Below 1200 the original
            reordered the page — `Features` 1, `Testimonials` 2, `Security` 3 — so security
            dropped BELOW the testimonials on tablet and phone, which is what the `order-*`
            classes on those two components did and what this flex container existed to serve.
            Both sections were removed on 2026-08-13, so there is nothing left to reorder. The
            container is kept as a plain block: `<main>` is already `display:block` and the two
            remaining children are full-width sections, so flex vs block renders identically —
            but keeping the class would be a false signal that ordering still matters here. */}
        <main>
          <ProductHero />
          <ProductFeatures />
          {/* Added 2026-08-20 at the user's request — the oversized-wordmark closer, same
              placement as the home page: last thing in <main>, before the site footer. A
              server component reading getDict().clix directly, so the "product" provider
              above is irrelevant to it. It paints no background (see its header), so it
              sits on the page's paper ground. */}
          <ClixFelixFooter />
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
