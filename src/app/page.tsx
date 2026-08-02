import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      {/* Nav is `position:fixed` in the original and sits OUTSIDE <main> — it overlays the
          hero rather than displacing it, which is why the hero carries pt-156/120 to clear
          the banner + header rather than the page carrying a top offset. */}
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  );
}
