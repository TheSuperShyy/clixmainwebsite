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

/* Copy is clix's own as of 2026-08-04, no longer the target's. Both lines are English
   renderings of what the real company site (docs/reference/clixsolutions/) already says in
   Hebrew — the headline is its closing CTA, "אתם מביאים את העסק. אנחנו מביאים את הבינה."
   English is the primary language by decision, not by default; a Hebrew/RTL variant is a
   separate job and is NOT served by translating these strings in place. */
/* Two sentences, so the break between them is authored rather than left to the shaper.
   Measured at 1440 with the real face and -0.05em tracking: allowed to wrap freely, the
   second sentence splits between article and noun ("We bring the / intelligence."), and at
   390 the sentence boundary lands mid-line ("business. We") — the worst break available. */
const HEADLINE_A = "You bring the business.";
const HEADLINE_B = "We bring the intelligence.";
/* Names the services, not the company — the brand is already the wordmark two rows up, and
   naming it again here spent one of only three lines saying nothing. (The prose-capitalised
   "Clix" convention this comment used to document still holds; it lives on in WhyRogo.tsx
   and ByTheNumbers.tsx, which do say the name.) */
const TAGLINE =
  "AI agents, automations and custom software, built around how your team already works.";

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
        style={{ backgroundImage: "url(/video/hero-israel-poster.jpg)" }}
      >
        {/* Original attributes: loop muted playsinline preload="none".
            autoPlay added because the original starts playback via JS on mount.

            FOUR CLIPS, ONE FILE (2026-08-09). Tel Aviv at dusk with the flag → Tel Aviv
            beachfront from the air → Jerusalem at sunset → Jerusalem at dusk, then sealed
            back to the start so `loop` never cuts. Each dissolve is a 2s cross-fade; there
            is no dip to black, because 2s of black behind the headline is a dead hero, not
            a dramatic one.

            THE ORDER IS TWO CITIES, NOT A CLOCK. Tel Aviv's two shots run together and then
            Jerusalem's two, which is also what keeps the Jerusalem pair adjacent — same
            landmark at two distances, so that dissolve reads as a match dissolve.

            THE FLAG CLIP LEADS, AND THAT IS LOAD-BEARING (user's call, and it earns it): the
            POSTER is frame 0, and it is what carries the white 64px headline until the video
            streams in. A dark silhouette holds that type; a lit skyline does not. It also
            puts the gentlest luma step on the loop wrap, the one seam that repeats forever.

            THE SPEED IS BAKED INTO THE FILE, not applied with `playbackRate` — the sources
            are 24fps, and slowing them in the browser would drop the effective rate below
            15fps and judder. Encoded to 30fps at 0.6x instead, so it is smooth without any
            JS touching the element. Recipe and the loop-seal are in
            features/hero/CONTEXT.md. */}
        <video
          className="hero-video h-full w-full object-cover"
          style={{ borderRadius: 0 }}
          src="/video/hero-israel.mp4"
          poster="/video/hero-israel-poster.jpg"
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
            {/* h1 wrapper. The target's caps were 300 / 370 / 600, sized around ITS headline;
                ours is longer, so they are widened to the measured width of the longest
                sentence + a rounding margin. Measured unwrapped at the real face and
                tracking: "We bring the intelligence." is 478px @48 · 558px @56 · 637px @64.
                · desktop 600 -> 648  — 637 fits, so each sentence gets its own line
                · tablet  370 -> 568  — 558 fits, same
                · phone   300 -> 344  — 478 does NOT fit and cannot: a 390 viewport less the
                  32px of side padding leaves 358px, so phone wraps to two lines per
                  sentence no matter how wide this box is. 344 just buys better ragging.
                Deviation logged in features/hero/FEATURE.md. */}
            <div className="relative w-full max-w-[344px] tablet:max-w-[568px] desktop:max-w-[648px]">
              <h1
                className="text-center font-display text-paper
                           text-[48px] tablet:text-[56px] desktop:text-[64px]"
                style={{ lineHeight: "95%", letterSpacing: "-0.05em" }}
              >
                {HEADLINE_A}
                <br />
                {HEADLINE_B}
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
            href="#contact"
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
                Let&rsquo;s start
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
