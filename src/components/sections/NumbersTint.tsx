"use client";

/**
 * NumbersTint — the By the numbers section's shell, and the colour it fades between.
 *
 * Added 2026-08-18 (user: "in the by the numbers section, it has to have the background color
 * transition to green like in the clix section, that same color"). It owns the `<section>`
 * element so that ByTheNumbers.tsx stays a server component: only the element and the effect
 * need to be client, and every heading, number and label below still renders on the server.
 *
 * SAME COLOUR, SAME GESTURE, DIFFERENT MECHANISM to /clix. `ClixBackdrop.tsx` darkens the WHOLE
 * VIEWPORT — a fixed 110vh ground layer behind eight transparent sections, because the target
 * lets the blocks above and below dissolve into the dark. Nothing of the sort is wanted here:
 * the ask was this one section, so the colour lives on this one element and its neighbours
 * (WhyRogo above, the `bg-ink` footer below) are untouched. Read ClixBackdrop before changing
 * anything here anyway — its header is where the reasoning behind the shared parts is written
 * down, and the two should not drift apart.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────
 * ONE TRIGGER, ONE TWEEN, ONE SCALAR. This is ClixBackdrop's rule and it is inherited whole.
 * Four things move together — the ground, the type colour, the row rules and the nav theme —
 * and all four are a pure function of a single number `p` (0 = the light `card` section this
 * has always been; 1 = `forest-deep`). `p` is driven by exactly one tween fired by exactly one
 * ScrollTrigger. ClixBackdrop's header records the two classes of bug that came from splitting
 * either; they would come back here identically.
 * ─────────────────────────────────────────────────────────────────────────────────────────
 *
 * ⚠️ THE TYPE COLOUR IS A HARD SWAP AT THE MIDPOINT, NOT AN INTERPOLATION, AND THE CONTENT
 * DIPS THROUGH THAT MOMENT. This is the one real design problem the section has that /clix's
 * manifesto does not, so it is worth stating why rather than leaving it to be rediscovered.
 *
 * Interpolating `ink → paper` alongside `card → forest-deep` puts both endpoints through their
 * own middle at the same instant: at the halfway frame the ground is #7e8a87 and the type is
 * #8a8a8a. Measured, not guessed — that is a contrast ratio of **1.0**. The section would go
 * blank for ~100ms every time it is scrolled into, and the eased curve is at its fastest there,
 * so it reads as a flicker rather than as a fade.
 *
 * So the type never takes an intermediate value at all. It is `ink` below the midpoint and
 * `paper` above it, and the content's opacity dips to 0.08 as `p` crosses that line — the swap
 * happens at the bottom of the dip, where there is nothing on screen to see it happen. The dip
 * is `|2g − 1|`, so it is 1 at both ends by construction and cannot leave the section faded.
 *
 * That is also the closest thing here to /clix's actual behaviour, where the manifesto's words
 * fade in over ground that has already gone dark. Same idea: never show type mid-transition.
 *
 * TRIGGERED, NOT SCRUBBED, and the thresholds are ClixBackdrop's own — enter at the section's
 * top edge reaching 75% up the viewport, leave at its bottom edge reaching 30%. Crossing back
 * reverses. Stopping mid-scroll cannot freeze a half-colour: crossing the line fires a timed
 * tween that runs to completion on its own clock.
 *
 * ⚠️ `data-nav-theme` IS MUTATED HERE, and it has to be. Nav.tsx re-reads
 * `el.dataset.navTheme` off every `[data-nav-theme]` section on every scroll frame
 * (Nav.tsx:374-380), so writing the attribute is the whole of the wiring — but without it the
 * white nav bar keeps its light palette and sits unreadably on the green once this section
 * reaches the header. It ships as `light`, which is correct for the light state and for the
 * no-JS page.
 *
 * REDUCED MOTION GETS THE COLOUR, INSTANTLY — it does not get an opt-out. ClixBackdrop skips
 * its animation and leaves a statically green section behind; the equivalent here would be a
 * section that is never green at all, which is a different design rather than a calmer one. A
 * colour change with no travel and no dip is not motion, so the trigger is built either way and
 * only the duration changes. It also means the dip is never seen under `reduce`: at duration 0
 * there are no intermediate frames to dip through.
 *
 * FALLBACK. Every custom property below is read with its token as the CSS fallback
 * (`var(--n-fg, var(--color-ink))`), so with JS off, before hydration, or if this effect ever
 * throws, the section renders exactly the light `card` block it was before this file existed.
 * Nothing is seeded from React, which is deliberate — a seeded inline value could not be
 * cleared back to the token.
 */

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* The two ends of the ground. Literals rather than `var()` because GSAP cannot interpolate a
   custom property — the same call, and the same comment, as ClixBackdrop's pair. `DEEP` is
   `--color-forest-deep`, /clix's dark state, which is the "same color" the request asked for
   and emphatically not `--color-forest`; docs/DESIGN-SYSTEM.md keeps the two apart. */
const CARD = "#eeedec"; /* --color-card, the fill this section has always had */
const DEEP = "#0f2822"; /* --color-forest-deep */

/* The type and the rules are SWAPPED, not mixed (see the header), so they can stay as token
   references and keep honouring the accessibility widget's high-contrast overrides — which
   redefine `--color-hairline` and would be lost to a literal. */
const FG_LIGHT = "var(--color-ink)";
const FG_DARK = "var(--color-paper)";
const RULE_LIGHT = "var(--color-hairline)"; /* warm gray @20% */
const RULE_DARK = "var(--color-hairline-light)"; /* white @15% */

const FADE_S = 0.6; /* the whole gesture, both directions — ClixBackdrop's own */
const DIP_FLOOR = 0.08; /* how far the content drops at the crossing; 0 would blank it */

/* Applied per phase inside `write()` while the tween itself runs `ease:"none"` — again
   ClixBackdrop's arrangement, and the reason `p` can be read as a plain 0..1 progress. */
const PHASE_EASE = gsap.parseEase("power2.inOut");

export default function NumbersTint({
  children,
}: {
  children: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = root.current;
    const content = inner.current;
    if (!section || !content) return;

    const mm = gsap.matchMedia();

    /* One builder, two durations. Splitting these into two `mm.add` bodies with different
       logic is how the two implementations would drift. */
    const build = (duration: number) => {
      const mix = gsap.utils.interpolate(CARD, DEEP);
      const clamp = gsap.utils.clamp(0, 1);
      const state = { p: 0 };
      let fade: gsap.core.Tween | null = null;

      const write = () => {
        const g = PHASE_EASE(clamp(state.p));
        const dark = g >= 0.5;

        section.style.backgroundColor = mix(g);
        /* Set on the section, read by the descendants through `var()`. One write reaches the
           heading, all three numbers, all three labels and all three rules. */
        section.style.setProperty("--n-fg", dark ? FG_DARK : FG_LIGHT);
        section.style.setProperty("--n-rule", dark ? RULE_DARK : RULE_LIGHT);
        /* |2g − 1|: 1 at g=0, 0 at g=0.5, 1 at g=1. */
        content.style.opacity = String(
          DIP_FLOOR + (1 - DIP_FLOOR) * Math.abs(2 * g - 1),
        );
        section.dataset.navTheme = dark ? "dark" : "light";
      };

      const play = (to: number, instant = false) => {
        fade?.kill();
        if (instant || duration === 0) {
          state.p = to;
          write();
          return;
        }
        fade = gsap.to(state, { p: to, duration, ease: "none", onUpdate: write });
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        end: "bottom 30%",
        onEnter: () => play(1),
        onEnterBack: () => play(1),
        onLeave: () => play(0),
        onLeaveBack: () => play(0),
        /* A refresh (resize, font swap, tab return) must not animate — it is a correction,
           not a gesture. */
        onRefresh: (self) => play(self.isActive ? 1 : 0, true),
      });

      /* matchMedia reverts GSAP's own tweens but knows nothing about raw DOM writes, so every
         one of them is undone by hand — the same cleanup, for the same reason, as
         ClixBackdrop's. Clearing to "" restores the CSS fallbacks, i.e. the light state. */
      return () => {
        fade?.kill();
        section.style.backgroundColor = "";
        section.style.removeProperty("--n-fg");
        section.style.removeProperty("--n-rule");
        content.style.opacity = "";
        section.dataset.navTheme = "light";
      };
    };

    mm.add("(prefers-reduced-motion: no-preference)", () => build(FADE_S));
    mm.add("(prefers-reduced-motion: reduce)", () => build(0));
  });

  return (
    <section
      ref={root}
      /* Ships `light` and is rewritten on every frame of the fade. See the header. */
      data-nav-theme="light"
      /* padding 96/16 phone → 96/40 from 810 up, unchanged. The background is no longer the
         `bg-card` utility — it is the same colour, read through `--n-bg`'s fallback, so that
         the inline colour GSAP writes has something to fall back TO. */
      className="relative flex w-full flex-col items-center justify-center overflow-clip
                 bg-[var(--n-bg,var(--color-card))] px-4 py-24 tablet:px-10"
    >
      {/* The dip's element. Layout-neutral by construction: the section is a centred column
          and this is a full-width centred column inside it, so the width container below sits
          exactly where it did. Opacity cannot go on the section itself — that would fade the
          ground it is dipping against. */}
      <div ref={inner} className="flex w-full flex-col items-center">
        {children}
      </div>
    </section>
  );
}
