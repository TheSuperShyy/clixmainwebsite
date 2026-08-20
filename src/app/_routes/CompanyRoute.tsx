/**
 * /company — clone of rogo.com/company.
 * Capture: docs/reference/target/rogo-company-2026-08-12.{html,css} (381 KB + 146 KB).
 * Spec: features/company-page/FEATURE.md · memory: features/company-page/CONTEXT.md.
 *
 * NAV IS FIXED HERE, like /, /news and /product, and unlike /clix. Measured, not assumed:
 * the Hero band carries 198px of top padding at every tier, which is exactly the banner +
 * nav row clearance. So no `spacer` prop; the hero pays for it itself.
 *
 * FOUR BANDS AS OF 2026-08-16, DOWN FROM SIX. `Video` is a SIBLING of `Hero` in the original,
 * not a child, the same shape as /product's Block 1. CompanyHero owns both and wraps them in
 * one <section> so the nav theme scanner sees contiguous coverage. Two of the original's six
 * were deleted the same day, both on the user's call:
 *
 *   · `Investors` → `CompanyTools` ("Built On Tools Your Team Already Uses") — a second
 *     logo-wall grid directly under the services grid, the same shape saying less. Its twelve
 *     marks live on in `clix/toolMarks.tsx`, which /clix's ClixLogoProof still renders.
 *   · `Reiteration` → `CompanyCareers` ("Join The Team Building / What Comes Next") — the
 *     recruiting band. Removed WHOLE, headline, paragraph and full-bleed photograph together:
 *     the user pointed at the copy, and a headless photograph under no heading is not a
 *     smaller version of that block, it is a different and worse one.
 *
 * The page now closes on the services band. `public/company/company-bg.jpg` is kept on disk
 * but is referenced by nothing — see the noindex note below, which it used to gate.
 *
 * NO REORDER BELOW 1200. The original's stage does set explicit `order` values 0..5 at
 * <=1199, but they match document order, so nothing actually moves. That is why <main> here
 * is a plain container and no block carries `order-*` classes — unlike /product, where the
 * reorder is real and `flex flex-col` is load-bearing.
 *
 * ⚠️ NOINDEX ON FIRST SHIP, and unlike /product the reason is thin rather than structural.
 *
 * This page was never built with rogo's content in it. There is no third-party trademark,
 * no certification badge clix does not hold, no real person quoted, and every string is
 * clix's own — the same four-item gate that holds /product is already clear here.
 *
 * ⚠️ IT SHIPPED GUARDED FOR TWO REASONS AND ONLY ONE IS LEFT (2026-08-16).
 *
 *   1. STILL OPEN — the "Unit 8200 and Technion alumni" line in CompanyMission is this
 *      page's only credential, and docs/reference/clixsolutions/README.md:319-321 records
 *      that it carries no substantiation in this repo. A company page is where such a claim
 *      is read most literally.
 *   2. CLEARED, as a side effect rather than by decision — Block 5's full-bleed slot held a
 *      stock photograph standing in for a picture of clix's team that does not exist. That
 *      band was deleted, so the stand-in went with it. **This was not the reason for the
 *      deletion and nobody has been asked whether the guard should now lift.**
 *
 * Lifting the guard is this one line, once item 1 is settled. /news is the precedent for a
 * route shipping without it. Do not remove the robots block as part of unrelated work.
 */

import Nav from "@/components/sections/Nav";
import CompanyHero from "@/components/company/CompanyHero";
import CompanyMission from "@/components/company/CompanyMission";
import CompanyServices from "@/components/company/CompanyServices";
import ClixFelixFooter from "@/components/clix/ClixFelixFooter";
import Footer from "@/components/sections/Footer";
import { fetchModels } from "@/lib/models";
import type { Locale } from "@/lib/i18n/config";
import { seedLocale, getDict } from "@/lib/i18n/server";
import { PageDictProvider } from "@/lib/i18n/LocaleProvider";

export default async function CompanyRoute({ locale }: { locale: Locale }) {
  /* Seeded here as well as in the root layout: this body is the direct parent of
     every section, so a server component below it can never read the locale before
     it is set, regardless of layout ordering. */
  seedLocale(locale);

  const models = await fetchModels();

  return (
    /* Client components below this point read their strings with
       usePageDict("company"). Server components use getDict().company directly and do not
       need the provider at all — it is here for the client half only. */
    <PageDictProvider name="company" value={getDict().company}>
      <>
        <Nav models={models} />
        <main>
          <CompanyHero />
          <CompanyMission />
          <CompanyServices />
          {/* Added 2026-08-20 at the user's request — the oversized-wordmark closer, same
              placement as the home page: last thing in <main>, before the site footer. A
              server component reading getDict().clix directly, so the "company" provider
              above is irrelevant to it. The page no longer closes on the services band. */}
          <ClixFelixFooter />
        </main>
        {/* The shared footer. Its tier-gating hashes in the capture (d23fwj / 1roolzl /
            1leoyz4 / 16n7npo) are byte-identical to /product's, which is the proof that this
            is the same Framer component and not a per-page variant. Reused unchanged. */}
        <Footer />
      </>
    </PageDictProvider>
  );
}
