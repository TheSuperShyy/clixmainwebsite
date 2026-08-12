"use client";

/**
 * CompanyHero — clone of rogo.com/company blocks `Hero` (#first) + `Video` (#second).
 *
 * Capture: docs/reference/target/rogo-company-2026-08-12.html (+ .css).
 * Spec: features/company-page/FEATURE.md · memory: features/company-page/CONTEXT.md
 *
 * The geometry is rogo's, measured. The copy is clix's own and was line-fitted against
 * OUR face (Discovery) before this file was written, so it reproduces the target's
 * measured box heights exactly: h1 167.2 / 68.4 / 182.4 and subhead 23.4 / 20.8 / 41.6
 * at desktop / tablet / phone. Do not reword without re-fitting.
 *
 * TIER MAP — three sizes, not four. 1600 and 1200 share every value on this page (the
 * capture has no `min-width:1600px` rule for any class in this block), so there is no
 * `xl:` variant. Written mobile-first: base = phone (<=809.98), `tablet:` (810–1199.98),
 * `desktop:` (>=1200).
 *
 * `Hero` and `Video` are SIBLINGS in the original — both children of the page wrapper,
 * neither nested in the other. They are wrapped in one <section> here so the nav's theme
 * scanner sees a single contiguous block; Nav.tsx picks the element spanning the nav's
 * bottom edge and falls back to "light" on a gap. Same shape as ProductHero.tsx.
 *
 * VALUES THAT WOULD LOOK ARBITRARY LATER
 * - `pt-[198px]` is the FIXED nav's clearance, identical at every tier. There is no
 *   `spacer` nav on this route — the padding IS the clearance.
 * - `aspect-[1.78344]` is the capture's literal `aspect-ratio` on the video box. It is
 *   what produces 1280x717.70 @1440, 1024x529.31 @1024 and 358x200.73 @390; no tier
 *   hardcodes a height.
 * - The CTA is 36px tall inside a 220x40 frame. The frame exists only to anchor the two
 *   corner brackets, which sit OUTSIDE the button box (top:-12/left:-28).
 * - `rounded-full` on the play button stands in for the capture's literal 43.2px radius
 *   on a 56px box — anything over 28px is already a circle, so the render is identical.
 *
 * ⚠️ DEVIATION FROM FEATURE.md, resolved against the capture.
 * FEATURE.md:182 tabulates the `Text & Button` gap as 32 / 24 / 24. The stylesheet has
 * exactly two rules for that element (`.framer-a2av74`): a base `gap:32px` and a single
 * `max-width:809.98px` override to `gap:24px; max-width:360px`. There is NO rule for it
 * in the 810–1199.98 block, so the tablet tier inherits 32. Confirmed against the 1024
 * screenshot: the subhead box ends at y=304 and the button's 40px frame starts at y=336.
 * What the table almost certainly caught is the sibling `Text Container` gap, which IS
 * tier-dependent — 24 base, 16 at tablet only. Both are implemented as the CSS states.
 *
 * ⚠️ NO WORDMARK OVERLAY. The "rogo" seen over the skyline in the reference screenshots
 * is baked into rogo's own video frame, not a DOM element. Nothing to reproduce.
 */

import { useEffect, useRef, useSyncExternalStore } from "react";

/* The two corner brackets that frame the CTA. 14x20 each, ink fill, path data verbatim
   from the capture's <use> defs #svg-1980836134_494 (Left) and #svg5446185_500 (Right).
   Byte-identical to /product's — the same Framer component, so the geometry transfers:
   this page's `.framer-5Atru.framer-v-q741vz` rules put them at top:-12/left:-28 and
   bottom:-12/right:-28, sliding in to top:-2/left:-18 and bottom:-2/right:-18 on hover.

   The 300ms / --ease-rogo timing is OURS and is estimated. Framer animates this in JS and
   the stylesheet's only transition is `color .3s`, so the capture cannot answer it.
   Flagged as estimated in /product's FEATURE.md; the same estimate is reused here rather
   than a second, different guess. */
function BracketLeft({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className={className} style={style} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.79688 3.46116H9.91357H9.91659L13.4974 3.45815V0H9.79311C6.9863 0 5.28776 1.13565 4.79688 3.46116Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.89277 3.46004C1.49238 3.46004 0.875 4.03841 0.875 5.4783V20.0007H4.63347V5.02645C4.63347 4.4511 4.68768 3.93298 4.79007 3.45703H4.78405L2.89277 3.46004Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BracketRight({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className={className} style={style} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.19531 16.5388H4.07861H4.0756L0.494816 16.5419V20H4.19908C7.00588 20 8.70442 18.8644 9.19531 16.5388Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.0994 16.54C12.4998 16.54 13.1172 15.9616 13.1172 14.5217V-0.000717163H9.35872V14.9735C9.35872 15.5489 9.30451 16.067 9.20211 16.543H9.20814L11.0994 16.54Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Duplicated verbatim from ProductHero.tsx / ProductStepper.tsx / ProductTestimonials.tsx
   rather than extracted. The repo has no shared hooks module and four copies of this already
   exist; adding a fifth keeps the file self contained, which is the established pattern here.
   The server snapshot is `false`, so SSR renders the autoplaying markup and a reduced-motion
   client corrects it on hydration. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export default function CompanyHero() {
  /* AUTOPLAY, AND THAT MAKES THIS HOOK LOAD BEARING (2026-08-12, user: "make the video auto
     play in company remove the play button").

     The previous build was click to play, and its comment argued that reduced motion needed
     no special case BECAUSE nothing moved until someone asked. That reasoning died with the
     play button. An autoplaying looping clip is exactly the motion a reduced-motion user has
     asked not to be shown, and globals.css's rule cannot help: it targets `.hero-video` only.

     So the preference is honoured in JS instead, and it DEGRADES rather than removes: a
     reduced-motion visitor gets the poster plus native controls, so the clip is still theirs
     to watch on purpose. Hiding it outright, which is what globals.css does to the home
     hero, would be wrong here — that one is decorative background, this one is content. */
  const reduced = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ⚠️ THE `autoPlay` PROP ALONE DOES NOT HONOUR THE PREFERENCE, and the first version of
     this shipped that bug. Measured, not theorised: with reduce emulated, the attribute
     correctly read false and `controls` true, and the clip was playing anyway, currentTime
     advancing 4.05 -> 6.05.

     The cause is hydration order. `usePrefersReducedMotion`'s server snapshot is `false`, so
     SSR emits the autoplaying markup and the browser starts the clip while parsing. React
     then hydrates and drops the attribute, but `autoplay` is only consulted when playback
     BEGINS: removing it never pauses an element that is already running.

     So the pause has to be imperative. This also covers the live case, someone toggling the
     OS setting with the page open, which the attribute would not handle either. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduced) {
      video.pause();
      return;
    }
    /* play() rejects on a revoked gesture or an unsupported codec. Nothing to roll back to,
       and an unhandled rejection would still reach the console. */
    void video.play().catch(() => {});
  }, [reduced]);

  return (
    <section
      id="hero"
      data-nav-theme="light"
      className="relative flex w-full flex-col items-center justify-start overflow-hidden"
    >
      {/* ---- Block 1: Hero --------------------------------------------------------------
          Measured: column, centred, gap 96, padding 198/40/64 (phone 198/16/64), overflow
          hidden. The gap never fires — the band has exactly one child — but it is the
          capture's value and is kept so a later sibling lands where the original puts it. */}
      <div className="flex w-full flex-col items-center justify-center gap-24 overflow-hidden px-4 pt-[198px] pb-16 tablet:px-10">
        {/* Text & Button — gap 32 from 810 up, 24 on phone, where it also caps at 360.
            At 390 the cap does not bind (390 minus 32 of gutter = 358), which is why the
            measured h1 box there is 358 and not 360. */}
        <div className="flex w-full max-w-[360px] flex-col items-center justify-center gap-6 tablet:max-w-none tablet:gap-8">
          {/* Text Container — max-w 960, gap 24 / 16 / 24. The 16 is TABLET ONLY. */}
          <div className="flex w-full max-w-[960px] flex-col items-center justify-center gap-6 overflow-hidden tablet:gap-4 desktop:gap-6">
            {/* h1 88/72/64, weight 400, line-height 95%, ink, centred, balanced.
                ⚠️ letter-spacing is NOT constant: -0.06em from 810 up, -0.05em below
                (measured -5.28/88, -4.32/72, -3.2/64). It has to move per tier, so it is
                an arbitrary property rather than the inline style the house style prefers.
                `text-wrap: balance` is on at EVERY tier here, unlike /product where the
                capture scopes it to tablet. It evens the ragged edge without changing the
                line count, so the fitted heights above still hold.
                Face is `--font-display` (Discovery), the site's one-face substitution for
                the original's "ABC Arizona Mix Regular". */}
            <h1
              className="w-full text-center font-display text-[64px] font-normal text-balance text-ink
                         [letter-spacing:-0.05em]
                         tablet:text-[72px] tablet:[letter-spacing:-0.06em]
                         desktop:text-[88px]"
              style={{ lineHeight: "95%" }}
            >
              The Team Behind the Systems
            </h1>
            {/* Subhead 18/16/16, weight 400, 130%, -0.02em, max-w 540, balanced. The
                preset's own colour is #383838 (ink-soft); the element overrides it inline
                to rgb(115,115,115), so the override wins and ours uses the `muted` token. */}
            <p
              className="w-full max-w-[540px] text-center font-sans text-[16px] font-normal text-balance text-muted desktop:text-[18px]"
              style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
            >
              Clix builds the automation that modern businesses run on.
            </p>
          </div>

          {/* Button block — column, gap 10. */}
          <div className="flex w-full flex-col items-center justify-center gap-[10px]">
            {/* The 220x40 bracket frame. The anchor inside it is only 36 tall and is
                centred with top-1/2 plus -translate-y-1/2, exactly as the capture does
                (`.framer-c7gubc-container` is absolute top:50% with translateY(-50%)).
                `group` drives the bracket hover; the frame is `relative` and the BAND
                clips, not the frame, because the brackets live outside its box. */}
            <div className="group relative h-10 w-[220px] shrink-0">
              <BracketLeft
                className="pointer-events-none absolute -top-3 -left-7 text-ink
                           transition-[top,left] duration-300
                           group-hover:-top-0.5 group-hover:-left-[18px]"
                style={{ transitionTimingFunction: "var(--ease-rogo)" }}
              />
              <BracketRight
                className="pointer-events-none absolute -right-7 -bottom-3 text-ink
                           transition-[bottom,right] duration-300
                           group-hover:-right-[18px] group-hover:-bottom-0.5"
                style={{ transitionTimingFunction: "var(--ease-rogo)" }}
              />
              {/* The original points at ./demo and reads "Request a Demo". Ours is clix's
                  one CTA destination sitewide: `#contact`, the anchor Footer.tsx owns, so
                  it resolves in page on this route. Deviation logged in FEATURE.md.
                  No border: the capture declares a 1px border at rgba(168,162,158,0) and
                  paints it with [data-border]::after, so it is both invisible AND costs no
                  layout box. Reproducing it as a real border would push the box past 36. */}
              <a
                href="#contact"
                className="absolute top-1/2 left-0 flex w-full -translate-y-1/2 items-center
                           justify-center gap-2 overflow-hidden rounded-[6px] bg-ink px-4 py-2
                           transition-opacity duration-300 hover:opacity-90 active:opacity-80
                           focus-visible:ring-2 focus-visible:ring-ink
                           focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                           focus-visible:outline-none"
                style={{ transitionTimingFunction: "var(--ease-rogo)" }}
              >
                {/* 20px box plus 1px top padding is the site's fixed button-label anatomy;
                    with the 8px vertical padding that is the measured 36px total.
                    `whitespace-pre` is required — the original's <a> is width:min-content. */}
                <span className="flex h-5 items-center justify-center gap-[10px] pt-px">
                  <span
                    className="font-sans text-[16px] font-medium whitespace-pre text-paper"
                    style={{ lineHeight: "1em", letterSpacing: "-0.01em" }}
                  >
                    Let&rsquo;s start
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Block 2: Video -------------------------------------------------------------
          bg paper, padding 0 40 (phone 0 16), no vertical padding of its own — the Hero's
          64px bottom is the whole gap between them. The capture puts a `display:contents`
          SSR wrapper between the band and the aspect box; it has no box, so it is dropped
          here rather than reproduced. */}
      <div className="flex w-full flex-col items-center justify-center gap-24 overflow-hidden bg-paper px-4 tablet:px-10">
        <div className="relative aspect-[1.78344] w-full max-w-[var(--container-max)] overflow-hidden">
          {/* ⚠️ OURS, NOT THE CAPTURE'S: the original is `loop preload="none" playsinline`,
              NOT autoplay and NOT muted. Its variant is literally named "Paused" and it waits
              for a press. We autoplay, at the user's request. Everything else about this band,
              including `aspect-[1.78344]`, is the measured clone and must stay.

              THE CLIP FILLS THE BAND, edge to edge, exactly as the target's does. An earlier
              pass showed it as a centred portrait player instead; that was reverted on
              2026-08-12 (user: "it should be like rogo not portrait").

              ⚠️ THE SOURCE IS PORTRAIT AND SIDEWAYS, so `boss-talk.mp4` is a derived file and
              not something to regenerate casually. The master is
              features/company-page/assets/boss-vid-source-4k.mp4: 3840x2160 with the content
              lying on its side and NO rotation flag, so a browser plays it sideways. The
              pipeline that produced what ships here is one command:

                transpose=1, crop=2160:1210:0:1314, scale=1920:1076

              rotate upright, take a 16:9 window, size it for the box. The crop offset 1314 is
              the vertical CENTRE and was chosen by comparing three candidates: higher lost the
              seated listener entirely, lower pushed the speaker's head against the top edge.

              Two consequences of pre-cropping rather than letting CSS do it:
                · `objectPosition` is inert now. The file already IS 16:9, so there is nothing
                  for cover to crop. Reframing means re-encoding with a different offset.
                · it ships 1.9 MB instead of 3.7 MB, because no pixel is carried that is never
                  drawn. The portrait original wasted 68% of every byte.

              1920 source width DOWNSCALES into the 1280px box, so this is sharp. Its
              predecessor `boss-lecture.mp4` was 576 wide and upscaled 2.2x, which is why that
              one looked soft.

              `muted` is REQUIRED, not decoration. Browsers block unmuted autoplay outright, so
              without it the promise rejects and nothing ever plays. It costs nothing here
              because the clip carries no audio track at all (verified with ffprobe).

              `preload` is `metadata`: `none` fights autoplay, since the browser has to fetch
              before it can start, and `auto` would pull the whole file on every page load
              whether or not the band is ever scrolled to. */}
          <video
            ref={videoRef}
            src="/company/boss-talk.mp4"
            poster="/company/boss-talk-poster.jpg"
            aria-label="Footage of a Clix talk, a speaker addressing a seated audience in a studio space"
            preload="metadata"
            autoPlay={!reduced}
            muted
            loop
            playsInline
            controls={reduced}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
