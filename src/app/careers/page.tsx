/**
 * /careers — clone of rogo.com/careers.
 * Capture: docs/reference/target/rogo-careers-2026-08-12.{html,css} (577 KB HTML + 149 KB CSS
 * across six inline <style> blocks) + a live CDP probe the same day.
 * Spec: features/careers-page/FEATURE.md · memory: features/careers-page/CONTEXT.md.
 *
 * NAV IS FIXED HERE, like /, /news and /product, and unlike /clix. So no `spacer` prop —
 * `#hero`'s own 198px top padding is what clears the banner + nav row. Passing a spacer as
 * well would double the clearance.
 *
 * SECTION ORDER IS LOAD-BEARING AND SO IS THE ABSENCE OF GAPS. Nav.tsx's theme scanner picks
 * the `[data-nav-theme]` element spanning the nav's bottom edge and falls back to "light" on a
 * gap, so the sections must be vertically contiguous. That is why <main> is a PLAIN <main> —
 * no `flex flex-col` (unlike /product, which needs the flex container for its `order-*`
 * reordering below 1200; nothing on this page reorders), no padding, no gap.
 *   #hero light · #gallery light · #about light · Footer declares its own dark.
 *
 * ⚠️ THE `#roles` BAND WAS REMOVED 2026-08-12 (user: "remove this section we dont need job
 * offering for now also remove the see career button"). It was the page's ONLY dark section,
 * so the light → dark handover now happens at the Footer instead of one section earlier.
 * Re-verified after the removal: three `[data-nav-theme]` sections plus the Footer, every gap
 * 0 at all four tiers, so the scanner never falls through. **If you re-add the band, put it
 * back BETWEEN `#about` and `<Footer>`** — anywhere else and the dark run is discontiguous.
 * Everything needed to restore it is in commit bbf10b1: `CareersRoles.tsx`,
 * `careersOpenings.ts`, and the measured spec in features/careers-page/FEATURE.md.
 *
 * ⚠️ NOINDEX — AND AS OF 2026-08-12 NOTHING ON THE PAGE STILL REQUIRES IT. Read this
 * before you either lift it or leave it, because both are now decisions rather than defaults.
 *
 * It was put here for two content reasons, and both are gone:
 *   1. The hero headline and the About mission copy were rogo's VERBATIM. Retired the same day
 *      (user: "in the career section, lets personalize it now, with the headers and
 *      subheaders"). Every editorial string is now clix's own, written from ClixManifesto.tsx
 *      and docs/reference/clixsolutions/.
 *   2. The three job rows were INVENTED. Retired when the whole `#roles` band was removed
 *      (user: "remove this section we dont need job offering for now"). There is no longer a
 *      listing on this page, so nothing here solicits an application for a role that does not
 *      exist.
 * The carousel photographs were never part of the guard — they are neutral stock, chosen on a
 * "no clear frontal face" rule, which is licence compliance and not just hygiene.
 *
 * IT IS KEPT ANYWAY, DELIBERATELY, because lifting it makes the route publicly indexable and
 * that is the user's call to make, not a side effect of deleting a section. Removing the
 * robots block below is a one-line change once they say so.
 *
 * The carousel photographs are already clix-safe: the original's eight identifiable staff
 * photos were replaced with neutral stock (user's call, 2026-08-12), so they are NOT part of
 * the guard. See the deviations table in FEATURE.md.
 */

import type { Metadata } from "next";
import Nav from "@/components/sections/Nav";
import CareersHero from "@/components/careers/CareersHero";
import CareersGallery from "@/components/careers/CareersGallery";
import CareersAbout from "@/components/careers/CareersAbout";
import Footer from "@/components/sections/Footer";
import { fetchModels } from "@/lib/models";

export const metadata: Metadata = {
  title: "Careers",
  robots: { index: false, follow: false },
};

/* Literal, not an imported binding — Next rejects the latter. Source of truth for the value
   is REVALIDATE_SECONDS in src/lib/models.ts; keep them in step by hand. */
export const revalidate = 300;

export default async function CareersPage() {
  const models = await fetchModels();

  return (
    <>
      <Nav models={models} />
      <main>
        <CareersHero />
        <CareersGallery />
        <CareersAbout />
      </main>
      {/* Byte-identical to the home page's footer in this capture too — same
          `.framer-8dt5bh-container`, same link rows. Reused unchanged. It declares its own
          `data-nav-theme="dark"`, and since the `#roles` band was removed it is now the ONLY
          dark section on the route — the sole thing that turns the nav over. */}
      <Footer />
    </>
  );
}
