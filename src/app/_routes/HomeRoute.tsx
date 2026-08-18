import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import LandingVideo from "@/components/sections/LandingVideo";
import WhyRogo from "@/components/sections/WhyRogo";
import ByTheNumbers from "@/components/sections/ByTheNumbers";
import Security from "@/components/sections/Security";
import Footer from "@/components/sections/Footer";
import { fetchModels } from "@/lib/models";
import type { Locale } from "@/lib/i18n/config";
import { seedLocale, getDict } from "@/lib/i18n/server";
import { PageDictProvider } from "@/lib/i18n/LocaleProvider";

export default async function HomeRoute({ locale }: { locale: Locale }) {
  /* Seeded here as well as in the root layout: this body is the direct parent of
     every section, so a server component below it can never read the locale before
     it is set, regardless of layout ordering. */
  seedLocale(locale);

  /* Awaited here rather than fetched inside Nav so the ticker is in the server-rendered HTML.
     A strip that appeared after hydration would push the fixed header down 45px in front of
     the visitor. (The stock version had a second, harder reason — Yahoo sent no CORS header
     so the browser could not call it at all. OpenRouter does; this one is layout.) */
  const models = await fetchModels();

  return (
    /* Client components below this point read their strings with
       usePageDict("home"). Server components use getDict().home directly and do not
       need the provider at all — it is here for the client half only. */
    <PageDictProvider name="home" value={getDict().home}>
      <>
        {/* Nav is `position:fixed` in the original and sits OUTSIDE <main> — it overlays the
            hero rather than displacing it, which is why the hero carries pt-156/120 to clear
            the banner + header rather than the page carrying a top offset. */}
        <Nav models={models} />
        <main>
          <Hero />
          <Testimonials />
          {/* Added 2026-08-18 — /clix's video treatment, on the home page's rhythm.
              Sits between the testimonials and the services list, so it carries the small
              half of each gap; see the padding note in LandingVideo.tsx. */}
          <LandingVideo />
          <WhyRogo />
          <ByTheNumbers />
          <Security />
        </main>
        {/* Outside <main>, as in the original — `footer` is a landmark sibling, not page
            content. The closing CTA lives inside it rather than as its own section. */}
        <Footer />
      </>
    </PageDictProvider>
  );
}
