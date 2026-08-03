import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import WhyRogo from "@/components/sections/WhyRogo";
import ByTheNumbers from "@/components/sections/ByTheNumbers";
import Security from "@/components/sections/Security";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      {/* Nav is `position:fixed` in the original and sits OUTSIDE <main> — it overlays the
          hero rather than displacing it, which is why the hero carries pt-156/120 to clear
          the banner + header rather than the page carrying a top offset. */}
      <Nav />
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
