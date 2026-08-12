import Nav from "@/components/sections/Nav";
import ClixHero from "@/components/clix/ClixHero";
import ClixVideo from "@/components/clix/ClixVideo";
import ClixLogoProof from "@/components/clix/ClixLogoProof";
import ClixManifesto from "@/components/clix/ClixManifesto";
import ClixTestimonial from "@/components/clix/ClixTestimonial";
import ClixCTA from "@/components/clix/ClixCTA";
import ClixFelixFooter from "@/components/clix/ClixFelixFooter";
import ClixBackdrop from "@/components/clix/ClixBackdrop";
import type { Locale } from "@/lib/i18n/config";
import { seedLocale, getDict } from "@/lib/i18n/server";
import { PageDictProvider } from "@/lib/i18n/LocaleProvider";

export default function ClixRoute({ locale }: { locale: Locale }) {
  /* Seeded here as well as in the root layout: this body is the direct parent of
     every section, so a server component below it can never read the locale before
     it is set, regardless of layout ordering. */
  seedLocale(locale);

  return (
    /* Client components below this point read their strings with
       usePageDict("clix"). Server components use getDict().clix directly and do not
       need the provider at all — it is here for the client half only. */
    <PageDictProvider name="clix" value={getDict().clix}>
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
    </PageDictProvider>
  );
}
