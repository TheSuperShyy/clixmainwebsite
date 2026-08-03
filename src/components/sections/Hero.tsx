/**
 * Hero — clone of rogo.ai `#hero` (`.framer-engtk8`).
 *
 * Every value here is measured; the spec and its provenance live in
 * features/hero/FEATURE.md. Do not "tidy" a number without changing that file first.
 *
 * Structure mirrors the original's container nesting so the gaps land in the right
 * places: the CTA is a sibling of Title Container (gap 48/44), not a child (gap 40).
 */

import LogoCarousel from "@/components/sections/LogoCarousel";

const HEADLINE = "For the most ambitious firms in finance";
const TAGLINE =
  "Rogo is the trusted AI partner to the world’s leading financial institutions.";

export default function Hero() {
  return (
    <section
      data-nav-theme="hero"
      id="hero"
      /* 100vh · flex column · centred · overflow hidden.
         padding: 156/16/40 phone → 120/40/40 tablet → 120/40/56 desktop+ */
      className="relative flex h-screen w-full flex-col items-center justify-center gap-10
                 overflow-hidden bg-muted
                 px-4 pt-[156px] pb-10
                 tablet:px-10 tablet:pt-[120px]
                 desktop:pb-14"
    >
      {/* Background media — absolute, inset 0, cover. The poster is also painted on the
          wrapper so that under prefers-reduced-motion (where we drop the video, which the
          original does not do) a still frame remains rather than bare #737373. */}
      <div
        className="hero-media absolute inset-0 bg-cover"
        style={{ backgroundImage: "url(/video/hero-tel-aviv-poster.jpg)" }}
      >
        {/* Original attributes: loop muted playsinline preload="none".
            autoPlay added because the original starts playback via JS on mount. */}
        <video
          className="hero-video h-full w-full object-cover"
          style={{ borderRadius: 0 }}
          src="/video/hero-tel-aviv.mp4"
          poster="/video/hero-tel-aviv-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* Copy scrim — ours, not the target's. Gives the headline/tagline/CTA their own
          ground so white type never sits straight on bright sky. Kept separate from
          "Darken" below so that layer stays faithful. See the deviation in FEATURE.md. */}
      <div className="hero-scrim pointer-events-none absolute inset-0" />

      {/* "Darken" — gradient stop is 85% at every tier except 810–1199.98, which is 80%. */}
      <div className="hero-darken pointer-events-none absolute inset-x-0 bottom-0 h-full" />

      {/* Logo Carousel lives INSIDE the hero in the original — absolute, 248px tall,
          pinned to the bottom edge. It paints above the scrim and Darken (so the logos
          are not dimmed by them) but below the copy. */}
      <LogoCarousel />

      {/* Width Container — max-w 1280, gap 48 (44 phone), pb 56 */}
      <div
        className="relative z-[1] flex w-full max-w-[var(--container-max)] flex-col
                   items-center justify-center gap-[44px] pb-14 tablet:gap-12"
      >
        {/* Title Container — single child in the original; gap 40 never applies */}
        <div className="flex w-full flex-col items-start gap-10">
          {/* Headline Container — gap 24 between h1 and tagline */}
          <div className="flex w-full flex-col items-center gap-6">
            {/* h1 wrapper — max-w 300 / 370 / 600 by tier */}
            <div className="relative w-full max-w-[300px] tablet:max-w-[370px] desktop:max-w-[600px]">
              <h1
                className="text-center font-display text-paper
                           text-[48px] tablet:text-[56px] desktop:text-[64px]"
                style={{ lineHeight: "95%", letterSpacing: "-0.05em" }}
              >
                {HEADLINE}
              </h1>
            </div>

            {/* Tagline wrapper — opacity .8 sits on the wrapper in the original */}
            <div className="relative max-w-[300px] opacity-80 tablet:max-w-[350px]">
              <p
                className="text-center font-sans text-[20px] text-paper"
                style={{ lineHeight: "125%", letterSpacing: "-0.02em" }}
              >
                {TAGLINE}
              </p>
            </div>
          </div>
        </div>

        {/* CTA — container is height 44; the anchor fills it */}
        <div className="relative h-11">
          <a
            href="#request-demo"
            className="group flex h-full w-min cursor-pointer items-center justify-center gap-2
                       overflow-hidden rounded-[6px] border border-transparent bg-paper
                       px-4 py-2 whitespace-nowrap no-underline
                       transition-opacity duration-300 hover:opacity-90
                       focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2
                       focus-visible:ring-offset-ink focus-visible:outline-none"
            style={{ transitionTimingFunction: "var(--ease-rogo)" }}
          >
            <span className="flex h-5 items-center justify-center gap-[10px] pt-px">
              <span
                className="font-sans text-[16px] font-medium text-ink"
                style={{ lineHeight: "1em", letterSpacing: "-0.01em" }}
              >
                Request Demo
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
