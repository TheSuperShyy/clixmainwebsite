"use client";

/**
 * SecurityCanvas — the composite of two mock windows in the `/security` hero (`#first`).
 *
 * ⚠️ NOT A CLONE. No counterpart on rogo.com/security. Built over 2026-08-13 in three passes,
 * and the history matters because each pass was the user's correction of the last:
 *   1. A terminal that typed one log and froze.
 *   2. "ours after the animation it's static but in kiro it's continuously coding and stuff"
 *      → the terminal became an endless agent feed.
 *   3. "can you add also something like this? in kiro both are dragable in the canva"
 *      → this file: a second window behind the terminal, and both draggable.
 * Spec: features/security-page/FEATURE.md → "Block 1b". Every number here is a design decision,
 * not a measurement of anything, and may be tuned freely.
 *
 * This file owns THREE things and nothing else: where the two windows sit, how they arrive, and
 * the dragging. The chrome is `MockWindow`, the console's panes are `SecurityConsole`, and the
 * terminal's endless feed is `SecurityTerminal`'s own business.
 *
 * ─── THE COMPOSITE BOX, AND WHY EVERY NUMBER IS WHAT IT IS ──────────────────────────────
 * At >=1200 the two windows overlap like kiro's, console behind and up-left, terminal in front
 * and down-right:
 *
 *     console   at (  0,   0)  900 x 440   ->  right edge  900, bottom edge 440
 *     terminal  at (280, 260)  720 x 440   ->  right edge 1000, bottom edge 700
 *     composite                1000 x 700
 *
 * ⚠️ THE TERMINAL WENT 320 -> 440 ON 2026-08-14 (user: "increase the height of the terminal",
 * then a status strip inside its prompt box), so the box grew 580 -> 700. Only the HEIGHT moved: the terminal's origin, its 720 width and
 * therefore the 1000 right edge are all untouched, and the 180px of vertical overlap with the
 * console (260..440) is unchanged too — the extra 120px all hangs BELOW the console's bottom
 * edge. That is why the composite still reads as an overlap rather than as two stacked windows.
 *
 * 1000 is the binding constraint and it is chosen against the NARROWEST tier that shows it: at
 * exactly 1200px the hero's content row is 1200 − 80 of padding = 1120, so 1000 leaves 120px of
 * air. At 1440 it leaves 360. Do not grow the composite past 1120 without checking 1200 first —
 * the section is `overflow-hidden` and the overflow would be silently clipped, not scrolled.
 *
 * The hero's height sum at >=1200 becomes 198 + 302 + 96 + 700 + 80 = 1376.
 *
 * ─── ⚠️ THE CONSOLE IS >=1200 ONLY, AND THE OTHER TIERS ARE UNCHANGED ───────────────────
 * Below 1200 this renders the terminal alone, exactly as the hero did before the console
 * existed — so those two tiers track the terminal alone and nothing the CONSOLE does moves them.
 * (They are 1072.41 and 997.19 since the terminal grew on 2026-08-14; they were 952.41 and
 * 905.19 before it, and the delta is the window's 120 / 92, nothing else.) Three panes at the
 * 358px phone tier are unreadable at any type size that fits, and stacking them at the tablet
 * tier would add ~460px to a hero that is already over a thousand there. It is decoration; every
 * claim it makes is repeated as real prose in the Compliance band, so a small screen loses
 * nothing but the picture.
 *
 * ─── ⚠️ DRAGGING IS >=1200 ONLY TOO, AND THAT IS A CORRECTNESS RULE, NOT A PREFERENCE ───
 * A drag surface sitting in the hero competes with touch scrolling, and at 390 the terminal is
 * 358px of a 390px viewport — very nearly the whole width of the scroll gesture's target. There
 * is no safe way to have both. Since the composite is desktop-only anyway, one breakpoint
 * governs the console, the overlap and the dragging together.
 *
 * ─── ⚠️ NO SHADOW SEPARATES THE TWO WINDOWS ─────────────────────────────────────────────
 * The reference implementation lifts the front window with `shadow-2xl`. This site ships ZERO
 * shadows — see the note in MockWindow.tsx. The front window is opaque `ink` and simply
 * occludes the back one; the `hairline-light` border draws the seam. Occlusion is the depth cue.
 */

import { useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import SecurityConsole from "@/components/security/SecurityConsole";
import SecurityTerminal from "@/components/security/SecurityTerminal";

/* ⚠️ `Draggable` SHIPS IN THE FREE PACKAGE and needed no install — verified against
   node_modules/gsap 3.15.0, whose `package.json` declares the standard no-charge licence and
   which contains `Draggable.js`. It is NOT one of the plugins that used to be Club-only. */
gsap.registerPlugin(Draggable, useGSAP);

/* The composite's geometry, in one place, because four files depend on it agreeing:
   this file's box, the console's own `h-[440px] w-[900px]`, the terminal's 440px total, and the
   hero tier map's 1376 sum. `h` is DERIVED in prose rather than in code — 260 + 440 — because
   the terminal's height lives in its own `bodyClassName`, where the tier split makes it two
   numbers rather than one. If that file's window total changes, this is the line that follows. */
const BOX = { w: 1000, h: 700 };
const TERMINAL_AT = { x: 280, y: 260 };

export default function SecurityCanvas() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const panes = q("[data-canvas-pane]") as HTMLElement[];

      const mm = gsap.matchMedia();

      /* ── Entry, at every tier ──────────────────────────────────────────────────────────
         Server-rendered visible, hidden and replayed only under `no-preference`, so JS-off,
         pre-hydration and reduced-motion all show a settled composite rather than a blank hero.
         Same shape as ClixBackdrop and ClixManifesto. */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline();
        /* Each pane declares its own arrival offset, so the console drifts in from up-left and
           the terminal from down-right — the direction each one sits in. `x`/`y` here are the
           SAME transform channel Draggable writes to below, which is fine because this timeline
           has finished long before a pointer can reach the window, and Draggable reads the live
           transform when it starts. */
        tl.from(panes, {
          opacity: 0,
          y: (i) => (i === 0 ? -12 : 20),
          x: (i) => (i === 0 ? -16 : 16),
          duration: 0.5,
          stagger: 0.12,
          ease: "power2.out",
        });
        return () => {
          tl.kill();
          gsap.set(panes, { clearProps: "opacity,x,y" });
        };
      });

      /* ── Dragging, >=1200 only ─────────────────────────────────────────────────────────
         Two conditions, deliberately ANDed into one query: the pointer must be capable of
         hovering (so a touch device never arms this even on a wide viewport), and the viewport
         must be at the desktop tier where the composite actually exists. */
      mm.add(
        "(min-width: 1200px) and (hover: hover) and (prefers-reduced-motion: no-preference)",
        () => {
          /* ⚠️ AN ELEMENT, NOT THE SELECTOR STRING `"#first"`, AND THIS IS NOT A STYLE CHOICE —
             the string version threw and took the whole client tree down with it.
             `useGSAP({ scope: root })` puts every selector GSAP resolves inside this component's
             own subtree. `#first` is the hero SECTION, i.e. an ANCESTOR of the canvas, so it
             resolved to nothing, Draggable read `undefined.nodeType` inside `_getBounds`, and
             React unmounted the page — SSR still served `#first`, so the failure looked like a
             hydration problem rather than a selector one. Resolving the node here, outside
             GSAP's scoped lookup, is what makes an ancestor addressable at all. */
          const boundsEl = root.current?.closest("#first") ?? undefined;

          const instances = panes.map((pane) =>
            Draggable.create(pane, {
              type: "x,y",
              /* Bounded to the hero rather than to the canvas: the canvas IS the composite box,
                 so bounding to it would mean the windows could not move at all. The section is
                 `overflow-hidden`, so this is also what stops a window being dragged into a
                 region that would simply be clipped away. */
              bounds: boundsEl,
              /* The affordance. `cursor` is set by Draggable itself; `activeCursor` is what it
                 swaps to while the pointer is down. */
              cursor: "grab",
              activeCursor: "grabbing",
              /* Bring the dragged window to the front for the duration. Without this, dragging
                 the console UP from behind the terminal looks like it is stuck underneath. */
              onPressInit() {
                gsap.set(this.target, { zIndex: 30 });
              },
              /* ⚠️ SNAP BACK ON RELEASE — the user's call over kiro's stay-put behaviour. A
                 visitor cannot leave the hero looking broken, and there is no state to persist
                 or reset. The z-index is restored only AFTER the window has travelled home,
                 or the two would swap stacking order mid-flight. */
              onRelease() {
                const target = this.target as HTMLElement;
                gsap.to(target, {
                  x: 0,
                  y: 0,
                  duration: 0.5,
                  ease: "power3.out",
                  onComplete: () => gsap.set(target, { zIndex: "" }),
                });
              },
            }),
          );

          return () => {
            instances.flat().forEach((d) => d.kill());
            /* Draggable leaves its transform and its cursor on the element; matchMedia can
               revert neither on its own, so a viewport dragged below 1200 mid-session would
               otherwise keep a stale offset and a `grab` cursor on a window nobody can move. */
            gsap.set(panes, { clearProps: "transform,cursor,zIndex" });
          };
        },
      );
    },
    { scope: root },
  );

  return (
    /* Below 1200 this is a plain centred column holding one window, and every utility that
       builds the composite is `desktop:`-gated. That is what keeps the tablet and phone heights
       byte-identical to what was measured before the console existed. */
    /* ⚠️ `isolate` IS A BUG FIX (2026-08-20): the panes' z-10/z-20 — and the z-30 Draggable
       sets mid-drag — used to land in the ROOT stacking context, because neither this div
       (z-auto) nor any ancestor up to <body> creates one. The fixed Nav is z-[3], so on
       scroll the windows painted OVER the nav bar. `isolation: isolate` traps all three
       values in here, where they only order the two panes against each other, while the
       canvas as a whole stays z-auto — beneath the nav like every other section. Do not
       "fix" this again by raising the nav's z-index; 3 is the measured value from the
       capture and every page shares it. */
    <div
      ref={root}
      className="isolate relative flex w-full justify-center desktop:block"
      style={
        {
          /* Applied as custom properties so the two magic numbers appear exactly once in the
             markup and come from the same object the comments above reason about. */
          "--canvas-w": `${BOX.w}px`,
          "--canvas-h": `${BOX.h}px`,
          "--terminal-x": `${TERMINAL_AT.x}px`,
          "--terminal-y": `${TERMINAL_AT.y}px`,
        } as React.CSSProperties
      }
    >
      <div className="relative w-full max-w-[720px] desktop:mx-auto desktop:h-[var(--canvas-h)] desktop:w-[var(--canvas-w)] desktop:max-w-none">
        {/* ── Back window: the run console. >=1200 only — see the header. ─────────────── */}
        <div
          data-canvas-pane
          className="absolute top-0 left-0 z-10 hidden desktop:block"
        >
          <SecurityConsole />
        </div>

        {/* ── Front window: the terminal. The ONLY window below 1200, where it is a plain
               centred block; absolutely placed over the console's bottom-right from 1200 up. ── */}
        <div
          data-canvas-pane
          className="relative z-20 w-full desktop:absolute
                     desktop:top-[var(--terminal-y)] desktop:left-[var(--terminal-x)]
                     desktop:w-[720px]"
        >
          <SecurityTerminal />
        </div>
      </div>
    </div>
  );
}
