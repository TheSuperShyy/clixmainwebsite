/**
 * /company — clone of rogo.com/company.
 * Capture: docs/reference/target/rogo-company-2026-08-12.{html,css} (381 KB + 146 KB).
 * Spec: features/company-page/FEATURE.md · memory: features/company-page/CONTEXT.md.
 *
 * NAV IS FIXED HERE, like /, /news and /product, and unlike /clix. Measured, not assumed:
 * the Hero band carries 198px of top padding at every tier, which is exactly the banner +
 * nav row clearance. So no `spacer` prop; the hero pays for it itself.
 *
 * SIX BANDS, NOT FIVE. `Video` is a SIBLING of `Hero` in the original, not a child, the same
 * shape as /product's Block 1. CompanyHero owns both and wraps them in one <section> so the
 * nav theme scanner sees contiguous coverage.
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
 * It ships guarded anyway, for two reasons that are the user's to settle:
 *   1. The "Unit 8200 and Technion alumni" line in CompanyMission is this page's only
 *      credential, and docs/reference/clixsolutions/README.md:319-321 records that it
 *      carries no substantiation in this repo. A company page is where such a claim is
 *      read most literally.
 *   2. Block 5's full-bleed slot holds a PLACEHOLDER: the original puts a photograph of its
 *      own staff there, no photograph of clix's team exists anywhere in this repo, and both
 *      stock sources refused automated download. What ships is a graded frame of Old Jaffa.
 *
 * Lifting the guard is this one line, once those are settled. /news is the precedent for a
 * route shipping without it. Do not remove the robots block as part of unrelated work.
 */

import type { Metadata } from "next";
import Nav from "@/components/sections/Nav";
import CompanyHero from "@/components/company/CompanyHero";
import CompanyMission from "@/components/company/CompanyMission";
import CompanyServices from "@/components/company/CompanyServices";
import CompanyTools from "@/components/company/CompanyTools";
import CompanyCareers from "@/components/company/CompanyCareers";
import Footer from "@/components/sections/Footer";
import { fetchModels } from "@/lib/models";

export const metadata: Metadata = {
  title: "Company",
  robots: { index: false, follow: false },
};

/* Literal, not an imported binding — Next rejects the latter. Source of truth for the value
   is REVALIDATE_SECONDS in src/lib/models.ts; keep them in step by hand. */
export const revalidate = 300;

export default async function CompanyPage() {
  const models = await fetchModels();

  return (
    <>
      <Nav models={models} />
      <main>
        <CompanyHero />
        <CompanyMission />
        <CompanyServices />
        <CompanyTools />
        <CompanyCareers />
      </main>
      {/* The shared footer. Its tier-gating hashes in the capture (d23fwj / 1roolzl /
          1leoyz4 / 16n7npo) are byte-identical to /product's, which is the proof that this
          is the same Framer component and not a per-page variant. Reused unchanged. */}
      <Footer />
    </>
  );
}
