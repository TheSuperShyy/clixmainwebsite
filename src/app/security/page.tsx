/**
 * /security — clone of rogo.com/security.
 * Capture: docs/reference/target/rogo-security-2026-08-12.{html,css} (374 KB HTML across FIVE
 * inline <style> blocks + 150 KB CSS) + a live CDP probe the same day at 1600/1440/1024/390.
 * Spec: features/security-page/FEATURE.md · memory: features/security-page/CONTEXT.md.
 *
 * NAV IS FIXED HERE, like /, /news, /product, /company and /careers, and unlike /clix. So no
 * `spacer` prop — `#first`'s own 198px top padding is what clears the banner + nav row.
 * Passing a spacer as well would double the clearance.
 *
 * THREE BANDS, NOT FOUR — and this is the page's main structural trap. "Security At Our Core"
 * reads as a fourth section and is not one: it is the SECOND DIRECT CHILD of `#features-1`
 * (`Compliance`), separated from the badge grid only by that band's own 120px gap. Confirmed by
 * probing the live DOM's direct children, not by reading byte offsets — which gave the wrong
 * answer about nesting twice on /product. `SecurityCompliance` owns the section shell and
 * renders `SecurityCore` as its second child; `SecurityCore` is deliberately NOT a <section>.
 *
 * The fourth Framer band, `Reiteration`, is inside `Footer` on the target as it is here, so the
 * shared <Footer/> already renders it. Nothing to build.
 *
 * THE WHOLE PAGE IS `ink`, WHICH NO OTHER ROUTE HERE IS. On the target only `#first` paints the
 * ground and the rest inherit it from a page wrapper; ours paints `bg-ink` per section, because
 * <body> is `paper` and because each band has to be its own `[data-nav-theme]` region anyway.
 * All three declare "dark", and `Footer` declares its own — so the nav bar is solid `ink` with
 * white content from the first pixel to the last.
 *
 * SECTION ORDER IS LOAD-BEARING AND SO IS THE ABSENCE OF GAPS. Nav.tsx's theme scanner picks the
 * `[data-nav-theme]` element spanning the nav row's bottom edge and FALLS BACK TO "light" on a
 * gap, so the three sections must be vertically contiguous: any margin between them lets a white
 * bar paint over an ink band. That is why <main> is a PLAIN <main> — no `flex flex-col` (unlike
 * /product, which needs the flex container for its `order-*` reordering below 1200; nothing on
 * this page reorders), no padding, no gap.
 *   #first dark · #features dark · #features-1 dark · Footer declares its own dark.
 *
 * ⚠️ NO `robots` BLOCK, AND THAT IS DELIBERATE — do not add one as part of unrelated work.
 * Every gate item that guards /product, /company and /careers is clear here:
 *   1. no third-party trademark          — the five cell marks are this repo's own line glyphs
 *   2. no certification clix does not hold — the target's SOC2 / CCPA / ISO 27001 / GDPR /
 *      EU AI Act cells are NOT reproduced; see the note below
 *   3. no real person quoted             — there are no quotes on this page
 *   4. every string is clix's own        — written for clix before the first commit, the
 *      /company model rather than the /product one, so there is nothing to strip later
 * `/news` is the precedent for a cloned route shipping without the guard.
 *
 * ⚠️ PRACTICES, NOT SEALS (the user's call, 2026-08-12). The target's compliance grid ships five
 * certification marks, two of which — SOC 2 and ISO 27001 — are AUDITED CERTIFICATIONS clix does
 * not hold. This repo already removed that exact five-badge set from the home page on 2026-08-05
 * for the same reason. The cells here carry the five practice statements home's
 * `sections/Security.tsx` ships instead, and its standing instruction applies to this route too:
 * do not put certification seals here unless clix has been audited and can produce the report.
 *
 * ⚠️ ONE ELEMENT OF THE TARGET IS DELIBERATELY MISSING. The "Explore security portal" link points
 * at trust.rogo.ai, a Vanta trust centre clix has no equivalent of; the user's call was to drop
 * it rather than invent a destination. It costs exactly 64px of band height at every tier
 * (32 link + 32 gap), which is why this route's bands are 64px shorter than the target's and why
 * the block-diff excludes those three heights. Measured and recorded in FEATURE.md, not lost.
 */

import type { Metadata } from "next";
import Nav from "@/components/sections/Nav";
import SecurityHero from "@/components/security/SecurityHero";
import SecurityBenefits from "@/components/security/SecurityBenefits";
import SecurityCompliance from "@/components/security/SecurityCompliance";
import Footer from "@/components/sections/Footer";
import { fetchModels } from "@/lib/models";

export const metadata: Metadata = {
  title: "Security",
};

/* Literal, not an imported binding — Next rejects the latter. Source of truth for the value
   is REVALIDATE_SECONDS in src/lib/models.ts; keep them in step by hand. */
export const revalidate = 300;

export default async function SecurityPage() {
  const models = await fetchModels();

  return (
    <>
      <Nav models={models} />
      <main>
        <SecurityHero />
        <SecurityBenefits />
        {/* Owns `#features-1` AND renders `SecurityCore` as its second child. Not a typo:
            "Security At Our Core" is a row inside this band, not a band of its own. */}
        <SecurityCompliance />
      </main>
      {/* The target's `Reiteration` CTA lives inside its Footer, exactly as ours does. Reused
          unchanged; it already declares `data-nav-theme="dark"`, which is what keeps the nav
          dark past the end of `#features-1`. */}
      <Footer />
    </>
  );
}
