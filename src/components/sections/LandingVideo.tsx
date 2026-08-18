"use client";

/**
 * LandingVideo — the 16:9 clip that sits under the testimonials on /.
 *
 * ⚠️ THIS IS A DELIBERATE COPY OF ClixVideo's TREATMENT, not a shared component. The user's
 * ask (2026-08-18) was "make it just like the hero video from clix section", so the frame is
 * /clix's measured one: aspect-ratio 1.77778, radius 6px, filled with `object-cover`.
 *
 * ⚠️ IT NO LONGER HAS /clix's MUTE TOGGLE (user's call, same day: "remove this", against a
 * screenshot of the button). THAT MAKES THE CLIP PERMANENTLY SILENT AND THAT IS THE POINT —
 * a muted <video> with no control is decoration, while an unmuted one with no control would be
 * audio the reader cannot stop, which is what the toggle existed to prevent. So `muted` is now
 * a hard attribute rather than state, and this section has no affordance at all. If the clip's
 * audio is ever wanted, the toggle comes back WITH it — do not "restore" sound by dropping
 * `muted` on its own. /clix keeps its own toggle; only this section lost one.
 *
 * It is a SEPARATE FILE rather than an import of ClixVideo because the two differ in the
 * things a section owns: the source, the surrounding padding (this one sits between two
 * `bg-canvas` home sections, /clix's floats over ClixBackdrop), and now the controls. Sharing
 * would have meant a prop for each — more coupling than the ~40 lines it saves.
 *
 * PADDING is the home page's rhythm, not /clix's: Testimonials closes on pb-32 / pb-20
 * (desktop) and WhyRogo opens on pt-20 / pt-24, so this section carries the SMALL half of
 * each gap — py-10 phone, py-20 from 810 — and the two neighbours supply the rest. Copying
 * /clix's pt-32 here would have stacked 196px of air under the testimonial heading.
 *
 * `landing-vid-poster.jpg` is frame 0 of the mp4 (ffmpeg `select=eq(n,0)`), so the poster and
 * the first painted frame are the same image and there is no visible swap when the clip
 * starts. Same trick as clix-demo-poster.jpg.
 *
 * ⚠️ IT ONLY PLAYS WHILE IT IS ON SCREEN (user's call, 2026-08-18), AND THAT IS WHY THERE IS NO
 * `autoPlay` ATTRIBUTE. An IntersectionObserver owns playback end to end: `autoPlay` would have
 * started the clip during hydration — this section sits below the fold on every tier — and the
 * observer would then have had to stop something that should never have started, wasting a
 * 3.5MB fetch on visitors who never scroll this far. The observer's first callback fires on
 * observe(), so "visible on load" takes the same code path as every later case; there is no
 * separate initial-state branch.
 *
 * THE 25% THRESHOLD IS A DECISION, not a measurement — a sliver of a 16:9 box at the very
 * bottom of the viewport is not "on screen" in the sense the ask meant. Playing starts when a
 * quarter of the frame is in view and stops when it is not; one number, both directions, so
 * there is no hysteresis band to reason about.
 *
 * The clip is 1920×1080, 25.5s, 3.5MB.
 */

import { useEffect, useRef } from "react";

export default function LandingVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  /* Playback is gated on visibility — see the header note for why there is no `autoPlay`.
     Empty dependency array on purpose: the observer is built exactly once, and nothing inside
     it reads React state. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Older Safari and any engine with the API disabled: fall back to playing on mount, which
       is the behaviour this section had before the gate. Degrading to "never plays" would be
       the worse failure — the reader would see a poster frame and nothing else. */
    if (typeof IntersectionObserver === "undefined") {
      void el.play().catch(() => {});
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          /* `.catch()` is not optional: play() returns a promise that REJECTS when the engine
             declines, and an unhandled rejection surfaces in the console on every scroll past. */
          void el.play().catch(() => {});
        } else {
          /* pause(), never load() or a `currentTime` reset: the clip resumes where it left off,
             which is what "only play when it's on screen" means and what a restart would not be. */
          el.pause();
        }
      },
      { threshold: 0.25 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      data-nav-theme="light"
      className="relative z-[1] flex w-full flex-col items-center justify-center
                 overflow-clip bg-canvas px-4 py-10
                 tablet:px-10 tablet:py-20"
    >
      {/* Width Container — the home page's 1280 measure, same token every other section uses. */}
      <div className="relative flex w-full max-w-[var(--container-max)] flex-col items-center justify-center">
        {/* aspect-ratio 1.77778 verbatim from /clix — the container is 16:9 and the video
            fills it. The source is 1920×1080, so `object-cover` never actually crops. */}
        <div
          className="relative w-full flex-none overflow-clip rounded-[6px]"
          style={{ aspectRatio: "1.77778" }}
        >
          <video
            ref={ref}
            className="h-full w-full object-cover"
            src="/video/landing-vid.mp4"
            poster="/video/landing-vid-poster.jpg"
            /* `none` is the pairing the visibility gate earns: this section is below the fold
               at every tier, so a visitor who never scrolls to it costs 12KB of poster instead
               of 3.5MB of mp4. The poster IS frame 0, so the fetch that starts when the
               observer fires is invisible — the first painted frame matches what was already
               on screen. Same call Testimonials makes for its six client clips. */
            preload="none"
            /* ⚠️ NO `autoPlay` — the IntersectionObserver above starts and stops this element,
               and the two together would race. See the header note. */
            loop
            /* A hard attribute, not state: the toggle is gone, so nothing can ever unmute this.
               Read the header note before changing it — silent-with-no-control is the decision;
               audible-with-no-control is what it protects against. */
            muted
            playsInline
            /* No `controls`, as on /clix. With the toggle removed this section has NO
               interactive element at all, which is why there is nothing here to tab to and no
               focus ring to style — the clip is decoration, and decoration is not a control. */
          />
        </div>
      </div>
    </section>
  );
}
