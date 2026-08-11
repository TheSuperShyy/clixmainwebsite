"use client";

/**
 * ClixBackdrop — the /clix page's ground, and the layer that crossfades on scroll.
 *
 * This is a sibling of every section, which is where the original puts it: `position:fixed`,
 * `110vh`, so the sections scroll OVER a held colour rather than dragging it with them.
 * 110 rather than 100 covers mobile URL-bar collapse. Every section carries `z-[1]` to paint
 * above it; the nav is `z-[3]` and opaque, so it covers this layer entirely.
 *
 * WHAT IT DOES, AND WHY IT IS THIS LAYER. rogo darkens the WHOLE VIEWPORT around the
 * Manifesto — confirmed 2026-08-09 from a live screenshot, which settled a question a static
 * capture could not. In that frame the ground below the nav is fully dark green while the
 * last two rows of the logo grid are still on screen, sitting *in* the dark and nearly
 * invisible. So the target does not protect the block above; it lets it dissolve.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────
 * ONE TRIGGER, ONE TWEEN, ONE SCALAR. READ THIS BEFORE ADDING A SECOND OF ANY OF THEM.
 *
 * Three things move together here — the ground's colour, the integrations grid's opacity,
 * and the manifesto text's opacity — and every one of them is a pure function of a single
 * number `p` (0 = light page, no green, text hidden; 1 = green page, no grid, text shown).
 * `p` is driven by exactly one tween, fired by exactly one ScrollTrigger.
 *
 * That is the design, requested in as many words on 2026-08-10 ("i want the text and the
 * green bg to be having the same trigger and everything for the animation so we dont need to
 * adjust both to match"), and it is also what two earlier rounds of bugs were all caused by
 * violating:
 *
 *   · TWO TWEENS ON ONE PROPERTY. A darken tween and a separate lighten tween. The lighten
 *     one recorded its START value on first render — page load, ground still light — so it
 *     was a light -> light tween that could never lighten anything, AND being scrubbed it
 *     re-rendered every frame writing light over whatever the darken tween had just written.
 *   · TWO TRIGGERS FOR ONE GESTURE. The ground and the text had separate ScrollTriggers on
 *     separate lines, and their sequencing had to be reconstructed at runtime by stamping
 *     `gsap.ticker.time` when each fade started and delaying the other against it. That
 *     bookkeeping existed only because the two could disagree. It is gone: with one tween
 *     they cannot.
 *
 * THE BEAT IS NOW A KEYFRAME RANGE, NOT A DELAY. Both phases live inside the same tween:
 *
 *     p:  0 ────────────────── 0.45 ───── 0.6 ───────────────── 1
 *         │      ground darkens, grid goes      │                │
 *         └──────────────────────────┘          │                │
 *                            │   text fades in  └────────────────┘
 *                            └───────────────────────────────────┘
 *
 * Ground lands at p=0.6; text starts at p=0.45. The 0.15 overlap is what stops it reading as
 * two separate events. Reversal is free and always correct — running `p` backwards undoes the
 * words before the ground, which is the invariant: WHITE TYPE MUST NEVER SIT ON A LIGHT
 * GROUND. There is no scroll speed, direction, or mid-fade reversal that can break it,
 * because there is nothing to get out of step with.
 * ─────────────────────────────────────────────────────────────────────────────────────────
 *
 * TRIGGERED, NOT SCRUBBED (2026-08-09, user: "when hitting a certain pixel, it would
 * activate and slowly fade in ... the green section should have the toggle"). An earlier
 * version tied the colour to scroll POSITION — stop scrolling halfway through the band and
 * the ground froze mid-colour. Crossing a line now fires a timed tween that runs to
 * completion on its own clock, however the page got there.
 *
 * THRESHOLDS — the one pair of lines, for all three properties:
 *   · ENTER  the Manifesto's top edge reaching 75% up the viewport → play to dark. Chosen so
 *     the duration lands the ground dark around the 60% mark the live screenshot showed, at
 *     an ordinary scroll pace.
 *   · LEAVE  the bottom edge reaching 30% up the viewport → play back to light.
 *     ⚠️ The exit was never observed on the target (its own runs through the 256px of
 *     `Product Visuals` padding we do not build). Revisit when block 5 lands.
 *   Crossing back reverses.
 *
 * ONE BEHAVIOUR CHANGED when the triggers merged, and it is a fix rather than a regression.
 * The text used to keep its own `end: "bottom top"` so it would "scroll off like content"
 * instead of hiding on the way down — which meant that between `bottom 30%` and `bottom top`
 * the ground was lightening while the text was still on screen. White on near-white. It now
 * leaves with the ground.
 *
 * THE TEXT ARRIVES AFTER THE GROUND (2026-08-10, user watching rogo mid-scroll: "theres no
 * text and i can see the text becoming visible when i scroll down ... a separate page on top
 * of a blank section"). Observational evidence a static capture could not give: the target's
 * manifesto enters BLANK — dark ground first, words later.
 *
 * BOTH NEIGHBOURS LEAVE WITH THE GROUND. `#integrations` above (2026-08-09, user: "i dont
 * want to make the icons or the words any of the tools visible when the green is active") and
 * `#clix-testimonials` below (2026-08-10, user: "I don't want any transparency animation or
 * transparency design on the bottom part just like on the top"). Both ride the ground's own
 * sub-progress on the same expression, so the top and bottom edges of the dark stretch behave
 * identically.
 *
 * They need it because every block on this page is transparent — that is measured, all eight
 * of the target's paint nothing. So the moment the ground goes dark, a neighbour's content is
 * sitting on dark green: coloured tool glyphs above, ink-dark quotes below. The quotes are the
 * worse of the two, being invisible rather than merely wrong, which reads as a rendering fault
 * rather than a design.
 *
 * FALLBACK. This renders `bg-paper` and the Manifesto ships its own dark background, so with
 * JS off, before hydration, or under `prefers-reduced-motion` the page is the static
 * light-page-with-a-dark-block it was. The Manifesto is only made transparent from inside
 * `matchMedia`, at `useLayoutEffect` timing, so the swap is never painted.
 */

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* The two ends of the crossfade. Real values, not `var(--color-…)`: GSAP interpolates
   colours, and a custom property would tween as an opaque string. Keep in step with
   globals.css.

   ⚠️ THE LIGHT END IS PLAIN WHITE, AND THAT IS A DELIBERATE DEVIATION FROM THE TARGET
   (2026-08-10, user: "make the background plain white match the overall body background of
   the website"). The target's backdrop sits at `rgb(247,247,247)` — our `canvas` — and so did
   this. It was wrong for OUR page: `body` is `paper` `#ffffff`, and every section from the
   Testimonial down paints an opaque `bg-paper`. The page therefore ran grey above the green
   block and white below it, and the green section's exit landed on the grey — a visible step
   in exactly the place the crossfade exists to remove. Matching our own body is worth more
   here than matching the target's near-white. */
const GROUND_LIGHT = "#ffffff"; /* --color-paper */
const GROUND_DARK = "#0f2822"; /* --color-forest-deep */

/* THE SPEED DIAL — the whole gesture, all three properties, both directions.
   Walked down on 2026-08-10 across two passes: 1.2 → 0.85 ("a bit faster") → 0.6 ("a bit
   more faster"). Half its original length, and about the floor: much under 0.5 and a colour
   wash starts reading as a switch rather than a fade, which is what "slowly fade in" was
   asking to avoid. */
const FADE_S = 0.6;

/* Where each phase sits inside that one tween, as a fraction of `p`. These are the beat —
   there is no second duration and no delay anywhere in this file. Ground lands at 0.6, text
   starts at 0.45, so they overlap by 0.15: enough that it reads as one gesture in two beats
   rather than two events, and enough that the words are still only ~25% in when the ground
   arrives. Widen the gap for a longer blank beat; close it for simultaneous. */
const GROUND_UNTIL = 0.6;
const TEXT_FROM = 0.45;

/* Applied to each phase separately rather than to the tween: `p` runs linear so the two
   ranges keep their proportions, and each property still eases in and out on its own. */
const PHASE_EASE = gsap.parseEase("power2.inOut");

export default function ClixBackdrop() {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ground = el.current;
    const dark = document.querySelector<HTMLElement>("#manifesto");
    /* Optional on purpose: the fade must not depend on these existing, only use them. */
    const grid = document.querySelector<HTMLElement>("#integrations");
    const below = document.querySelector<HTMLElement>("#clix-testimonials");
    const content = document.querySelector<HTMLElement>("#manifesto-content");
    if (!ground || !dark) return;

    /* matchMedia so the reduced-motion branch is never BUILT — which also means the
       Manifesto keeps its server-rendered background instead of being made transparent
       over a ground that never darkens. Reverts itself if the preference changes. */
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* The section's own background exists only as the no-JS fallback. With the animation
         live it has to go, or it paints a hard-edged rectangle on top of the very ground
         that is doing the work. */
      gsap.set(dark, { backgroundColor: "transparent" });

      const mix = gsap.utils.interpolate(GROUND_LIGHT, GROUND_DARK);
      const clamp = gsap.utils.clamp(0, 1);
      const state = { p: 0 };
      let fade: gsap.core.Tween | null = null;

      /* The ONLY place any of the three properties is written. Everything is derived from
         `state.p`, so they cannot drift apart — that is the entire point of this file. */
      const write = () => {
        const g = PHASE_EASE(clamp(state.p / GROUND_UNTIL));
        const t = PHASE_EASE(clamp((state.p - TEXT_FROM) / (1 - TEXT_FROM)));

        ground.style.backgroundColor = mix(g);
        /* The blocks on EITHER SIDE of the green are the ground's inverse: gone exactly when
           the green is up, back when it is not. Same expression for both, so the top and
           bottom edges of the dark stretch behave identically — which is the ask
           (2026-08-10: "I don't want any transparency ... on the bottom part just like on
           the top").

           Why they need it at all: every block on this page is transparent, so once the
           ground goes dark the neighbours' own content is sitting on dark green. The grid
           above would show coloured tool glyphs; the testimonials below would show ink-dark
           quotes on dark green — invisible text, which reads as a rendering fault rather
           than as a design. Fading them removes the problem at both ends. */
        const hidden = String(1 - g);
        if (grid) grid.style.opacity = hidden;
        if (below) below.style.opacity = hidden;
        if (content) content.style.opacity = String(t);
      };

      /* One writer for `p`. Starts from wherever `p` currently is, so reversing direction
         mid-fade turns around from what is on screen rather than snapping — and because
         both phases read the same `p`, they turn around together. */
      const play = (to: number, instant = false) => {
        fade?.kill();
        if (instant) {
          state.p = to;
          write();
          return;
        }
        fade = gsap.to(state, {
          p: to,
          duration: FADE_S,
          /* Linear here; the shaping lives in PHASE_EASE, per phase. */
          ease: "none",
          onUpdate: write,
        });
      };

      ScrollTrigger.create({
        trigger: dark,
        /* The one pair of lines the user's "certain pixel" crosses. Percent-based, so they
           move with a resize instead of freezing at mount-time pixel values. While the
           trigger is active the page is green with text; outside it, light with neither —
           all four callbacks say that same one thing, which is what makes a fast flick
           through the whole section land in a consistent state. */
        start: "top 75%",
        end: "bottom 30%",
        onEnter: () => play(1),
        onEnterBack: () => play(1),
        onLeave: () => play(0),
        onLeaveBack: () => play(0),
        /* Jump rather than fade on first paint and after resize — a reload landing mid-page
           must not play a wash the visitor never scrolled for. */
        onRefresh: (self) => play(self.isActive ? 1 : 0, true),
      });

      /* Raw-DOM styles, which matchMedia cannot revert on its own — if the preference flips
         to reduce mid-session, a half-dark ground, hidden grid or hidden text would
         otherwise be left behind. */
      return () => {
        fade?.kill();
        ground.style.backgroundColor = "";
        if (grid) grid.style.opacity = "";
        if (below) below.style.opacity = "";
        if (content) content.style.opacity = "";
      };
    });
  });

  return (
    <div
      ref={el}
      /* `bg-paper`, matching GROUND_LIGHT — this is the pre-hydration and reduced-motion
         state, so it has to be the same white the tween resolves to or the page shifts
         colour the moment JS lands. */
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[110vh] bg-paper"
      aria-hidden="true"
    />
  );
}
