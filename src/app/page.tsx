import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import WhyRogo from "@/components/sections/WhyRogo";
import ByTheNumbers from "@/components/sections/ByTheNumbers";
import Security from "@/components/sections/Security";
import Footer from "@/components/sections/Footer";
import { fetchModels } from "@/lib/models";

/* The page stays prerendered; this just says how often the prerender is refreshed, so the
   banner's prices are never older than the ticker's own poll interval. Everything else on
   the page is static and unaffected.

   ⚠️ Must be a LITERAL. Next statically analyses segment configs at build time and rejects
   an imported binding with "Invalid segment configuration export detected" — so this cannot
   be `REVALIDATE_SECONDS` even though that is where the number is defined. Keep the two in
   step by hand; src/lib/models.ts is the source of truth. */
export const revalidate = 300;

export default async function Home() {
  /* Awaited here rather than fetched inside Nav so the ticker is in the server-rendered HTML.
     A strip that appeared after hydration would push the fixed header down 45px in front of
     the visitor. (The stock version had a second, harder reason — Yahoo sent no CORS header
     so the browser could not call it at all. OpenRouter does; this one is layout.) */
  const models = await fetchModels();

  return (
    <>
      {/* Nav is `position:fixed` in the original and sits OUTSIDE <main> — it overlays the
          hero rather than displacing it, which is why the hero carries pt-156/120 to clear
          the banner + header rather than the page carrying a top offset. */}
      <Nav models={models} />
      <main>
        <Hero />
        <Testimonials />
        <WhyRogo />
        <ByTheNumbers />
        <Security />
      </main>
      {/* Outside <main>, as in the original — `footer` is a landmark sibling, not page
          content. The closing CTA lives inside it rather than as its own section. */}
      <Footer />
    </>
  );
}
