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
 * gap, so the four sections must be vertically contiguous: any margin between them lets a
 * white bar paint over the ink `#roles` band. That is why <main> is a PLAIN <main> — no
 * `flex flex-col` (unlike /product, which needs the flex container for its `order-*`
 * reordering below 1200; nothing on this page reorders), no padding, no gap.
 *   #hero light · #gallery light · #about light · #roles dark · Footer declares its own dark.
 *
 * ⚠️ NOINDEX — ONE REASON LEFT, DOWN FROM TWO. The three job rows are INVENTED:
 * clix-plausible titles, not openings clix has confirmed, pointing at
 * mailto:clixteam579@gmail.com rather than a fabricated ATS URL. A job listing solicits an
 * application, which makes an invented one worse than an invented testimonial, not better.
 *
 * The FIRST reason was retired on 2026-08-12 (user: "in the career section, lets personalize
 * it now, with the headers and subheaders, for the jobs i will follow up later"). Every
 * editorial string on this page — the hero h1, the About heading and its two paragraphs, the
 * roles h2 — is now clix's own, written from ClixManifesto.tsx and docs/reference/
 * clixsolutions/. The user's own sentence is also why the guard stays: the jobs are the
 * follow-up, and until they are real this page still solicits applications for roles that
 * do not exist.
 *
 * The guard lifts when the roles listed are roles clix is actually hiring for, and not before.
 * Do not remove the robots block as part of unrelated work.
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
import CareersRoles from "@/components/careers/CareersRoles";
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
        <CareersRoles />
      </main>
      {/* Byte-identical to the home page's footer in this capture too — same
          `.framer-8dt5bh-container`, same link rows. Reused unchanged. It already declares
          `data-nav-theme="dark"`, which is what keeps the nav dark past the end of #roles. */}
      <Footer />
    </>
  );
}
