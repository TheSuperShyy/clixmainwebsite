import type { Metadata } from "next";
import Nav from "@/components/sections/Nav";
import ClixHero from "@/components/clix/ClixHero";
import ClixVideo from "@/components/clix/ClixVideo";
import ClixLogoProof from "@/components/clix/ClixLogoProof";
import ClixManifesto from "@/components/clix/ClixManifesto";
import ClixTestimonial from "@/components/clix/ClixTestimonial";
import ClixCTA from "@/components/clix/ClixCTA";
import ClixFelixFooter from "@/components/clix/ClixFelixFooter";
import ClixBackdrop from "@/components/clix/ClixBackdrop";

/* Clone of rogo.com/felix, captured 2026-08-09 →
   docs/reference/target/rogo-felix-2026-08-09.html. Spec: features/felix-page/FEATURE.md.

   COPY IS THE TARGET'S, ON PURPOSE AND TEMPORARILY. The user's call on 2026-08-09 was
   "clone verbatim now, rewrite after" — get the layout provably right against the real
   words, then do a copy pass as a separate step. So this page currently says "Felix" and
   describes an investment-banking product. That is a staging state, not a claim — hence the
   `robots` block below. See the open question in FEATURE.md. */

export const metadata: Metadata = {
  /* The target's own is "Rogo | Meet Felix" — brand, then product. Renaming the product to
     Clix collapses that pattern, because the brand IS the word now; "clix | Meet Clix" says
     it twice. So the bar is dropped and this tracks the h1. */
  title: "Meet Clix",

  /* ⚠️ TEMPORARY, AND TIED TO THE COPY PASS — 2026-08-09, user's call when this route was
     first pushed to a deploying branch. The page is reachable so it can be reviewed, but it
     currently carries the target's verbatim words, including ten real testimonials that name
     Felix and Rogo, under a clix wordmark. Indexing that is the part that does the damage.

     DELETE THIS BLOCK the moment the copy is clix's own. It is the only thing keeping the
     page out of search results, and a `noindex` left behind after a rewrite is a live page
     nobody can find. */
  robots: { index: false, follow: false },
};

/* No `revalidate` and no `fetchModels` here, unlike the home page: the only thing on this
   route that needed fresh data was the ticker, and this route has no ticker. The page is
   fully static. */

export default function ClixPage() {
  return (
    <>
      {/* NO BANNER, AND THE NAV TAKES UP SPACE — both are this page's own template, not a
          tweak. The target has no band above its Felix nav, and it puts that nav in a
          `position: sticky` container, so the hero's 128px top padding starts BELOW the bar
          rather than behind it. Without the spacer the whole page sat ~70px too high.
          User's call, 2026-08-09: "match the spacing… remove the black banner on top, only
          on the clix page." See the `banner` and `spacer` props in Nav.tsx. */}
      <Nav banner={false} spacer />

      {/* The page's ground, and a sibling of every section — which is where the original
          puts it. It also OWNS the scroll crossfade that darkens the whole viewport around
          the Manifesto; see ClixBackdrop.tsx for the timing and the evidence behind it. */}
      <ClixBackdrop />

      <main className="relative">
        {/* Page order is the capture's: Hero, Video, Logo Proof, Manifesto,
            [Product Visuals — NOT BUILT], Testimonial, CTA, Felix Footer. */}
        <ClixHero />
        <ClixVideo />
        <ClixLogoProof />
        <ClixManifesto />
        <ClixTestimonial />
        <ClixCTA />
      </main>
      <ClixFelixFooter />
    </>
  );
}
