"use client";

/**
 * Count-up for a stat value — 0 → N once, when the number scrolls into view.
 *
 * Added 2026-08-08 (user: "add counting animations in this one", on By the numbers).
 *
 * ⚠️ THIS IS INVENTED MOTION, NOT CLONED MOTION, AND THAT IS A REVERSAL. The capture has no
 * count-up: the numbers are static text with no `data-framer-appear-id` and no transition in
 * the subtree, and ByTheNumbers.tsx used to say so and decline to build one. The user asked
 * for it explicitly, so the section now diverges from the target here on purpose. Anyone
 * checking fidelity against rogo.ai will find this and should not "correct" it.
 *
 * WHY A SEPARATE CLIENT COMPONENT rather than making the section one: only the number needs
 * a ref and an effect. Keeping this leaf `"use client"` leaves the whole of ByTheNumbers —
 * headings, labels, layout — server-rendered.
 *
 * WHY IT WRITES `textContent` DIRECTLY instead of holding React state: the value changes
 * every frame, and a `setState` per frame would re-render the subtree ~60x/second for a
 * string. GSAP's own idiom is to mutate the node. Safe here because nothing else re-renders
 * this component — it takes one prop and holds no state, so React never reclaims the text.
 */

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Leading integer + whatever trails it. The three live values are not plain numbers, which
   is the whole reason this is a regex and not `Number(value)`:
     "200+"  -> 200, "+"
     "2×"    -> 2,   "×"
     "24/6"  -> 24,  "/6"
   A value with no leading digits never animates — it just renders as given. */
const PARTS = /^(\d+)(.*)$/;

/* Uniform across the three, so they read as one gesture rather than three unrelated ones.
   The cost is that a target of 2 spends most of this duration already arrived; that is
   preferable to three different speeds in one list. */
const DURATION = 1.4;

export default function CountUp({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const el = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const node = el.current;
      if (!node) return;

      const parsed = PARTS.exec(value);
      if (!parsed) return; /* nothing numeric to count — leave the SSR text alone */
      const target = Number(parsed[1]);
      const suffix = parsed[2];

      /* matchMedia, so under reduced motion the tween is never built AND the text is never
         zeroed — the number just stays as server-rendered. It also reverts itself if the
         preference changes mid-session, with no listener of ours. */
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Zeroed here rather than in JSX so the real value is what ships in the HTML: correct
           with JS off, correct for a crawler, and correct under reduced motion. `useGSAP`
           runs at `useLayoutEffect` timing, i.e. before paint, so this swap is never seen. */
        node.textContent = `0${suffix}`;

        const counter = { v: 0 };
        const tween = gsap.to(counter, {
          v: target,
          duration: DURATION,
          /* Ease-OUT, deliberately not the site's `--ease-rogo`. That curve is an in-out
             (cubic-bezier(.44,0,.56,1)) and a counter that starts slow reads as lag rather
             than as motion. This animation is ours, not the target's, so there is no
             fidelity argument for reusing the authored curve here. */
          ease: "power2.out",
          scrollTrigger: {
            trigger: node,
            /* Each number carries its own trigger instead of one shared timeline. The rows
               sit 161px apart, so scrolling produces a natural cascade for free; a shared
               stagger would fire all three together on a tall viewport. */
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            node.textContent = `${Math.round(counter.v)}${suffix}`;
          },
          /* Land on the authored string rather than on a reconstruction of it. */
          onComplete: () => {
            node.textContent = value;
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          node.textContent = value;
        };
      });

      /* The trigger position is computed from layout, and layout moves when Discovery swaps
         in (`font-display: swap`). Without this the start line is measured against fallback
         metrics and the count can fire early. Resolves immediately on a warm cache. */
      let cancelled = false;
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      return () => {
        cancelled = true;
        mm.revert();
      };
    },
    { scope: el, dependencies: [value] },
  );

  return (
    <span ref={el} className={className}>
      {value}
    </span>
  );
}
