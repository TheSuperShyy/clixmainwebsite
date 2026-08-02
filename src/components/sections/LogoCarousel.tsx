"use client";

/**
 * Logo Carousel — clone of rogo.ai `Logo Carousel` (`.framer-cdaiag`).
 *
 * IT IS NOT A SIBLING SECTION. In the capture this block lives *inside*
 * `<section id="hero">`, absolutely positioned `bottom:0; height:248px`, overlaying the
 * bottom of the hero video. docs/SECTIONS.md listed it as section #3 following the hero;
 * that was an inventory guess from the visual and it is wrong — verified by checking that
 * the element's offset falls between the hero's `<section>` open and close tags.
 *
 * Three stacked layers, bottom to top:
 *   z0  progressive blur   — 8 backdrop-filter bands, blur doubling 0.117 -> 15px
 *   z1  the logo row       — 36px tall, pinned 32px off the bottom
 *   (the hero's own `Darken` gradient is a separate element and sits below both)
 *
 * Spec + provenance: features/logo-carousel/FEATURE.md.
 */

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Measured from the capture — each logo's own box, in document order. */
const LOGOS = [
  { name: "Jefferies", file: "logo-jefferies-white.svg", w: 113, h: 26 },
  { name: "Lazard", file: "logo-lazard-white.svg", w: 117, h: 24 },
  { name: "Tiger Global", file: "logo-tigerglobal-white.svg", w: 186, h: 20 },
  { name: "Moelis", file: "logo-moelis-white.svg", w: 103, h: 26 },
  { name: "Nomura", file: "logo-nomura-white.svg", w: 122, h: 22 },
  { name: "Rothschild", file: "logo-rothschild-white.svg", w: 207, h: 34 },
  { name: "BNP Paribas", file: "logo-bnp-paribas-white.svg", w: 163, h: 34 },
  { name: "Raymond James", file: "logo-raymond-james-white.svg", w: 226, h: 20 },
  { name: "Truist", file: "logo-truist-white.svg", w: 137, h: 32 },
  { name: "Leerink", file: "logo-leerink-white.svg", w: 116, h: 32 },
  { name: "Canaccord", file: "logo-canaccord-white.svg", w: 45, h: 36 },
  { name: "Baird", file: "logo-baird-white.svg", w: 84, h: 24 },
  { name: "HCW", file: "logo-hcw-white.svg", w: 104, h: 52 },
  { name: "Arma Partners", file: "logo-arma-partners-white.svg", w: 155, h: 26 },
] as const;

const GAP = 56; // px — the <ul>'s own gap, verbatim from the capture

/** Marquee travel rate. NOT measurable from a static capture — see FEATURE.md. */
const SPEED_PX_PER_SEC = 50;

/**
 * Progressive blur: 8 absolutely-stacked bands. Each is a `backdrop-filter` masked to a
 * sliding 3-band window, and the blur radius doubles every layer (0.1171875 * 2^i), so the
 * effect ramps smoothly from imperceptible at the top to 15px at the very bottom instead of
 * showing the hard edge a single blurred div would give.
 *
 * Stops for layer i are at i*12.5% and then +12.5 / +25 / +37.5, clipped at 100% — which is
 * why the last two layers have three and two stops rather than four.
 */
function ProgressiveBlur() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => {
        const a = i * 12.5;
        const stops = [
          `rgba(0, 0, 0, 0) ${a}%`,
          `rgba(0, 0, 0, 1) ${a + 12.5}%`,
          `rgba(0, 0, 0, 1) ${a + 25}%`,
          `rgba(0, 0, 0, 0) ${a + 37.5}%`,
        ].filter((_, k) => a + k * 12.5 <= 100);
        const mask = `linear-gradient(to bottom, ${stops.join(", ")})`;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: i + 1,
              maskImage: mask,
              WebkitMaskImage: mask,
              backdropFilter: `blur(${0.1171875 * 2 ** i}px)`,
              WebkitBackdropFilter: `blur(${0.1171875 * 2 ** i}px)`,
              borderRadius: 0,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </div>
  );
}

export default function LogoCarousel() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      const ul = track.current;
      if (!ul) return;

      /* One cycle is the distance from item 0 to item 14 — i.e. all 14 logos PLUS the 14
         gaps between and after them. Measuring it beats the usual `xPercent: -50` trick,
         which is subtly wrong here: the doubled track has 28 items but only 27 gaps, so
         half its width is short by half a gap (28px) and the loop visibly drifts. */
      const items = ul.children;
      const cycle =
        (items[LOGOS.length] as HTMLElement).offsetLeft -
        (items[0] as HTMLElement).offsetLeft;
      if (!cycle) return;

      setReady(true);

      /* matchMedia so the tween is simply never built under reduced motion — the row then
         renders static, which is the honest fallback for a decorative ticker. It also
         reverts itself on preference change, no listener of ours. */
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(ul, { x: 0 });
        gsap.to(ul, {
          x: -cycle,
          duration: cycle / SPEED_PX_PER_SEC,
          ease: "none",
          repeat: -1,
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    /* Logo Carousel — absolute, 248px tall, pinned to the hero's bottom edge. */
    <div
      ref={root}
      className="absolute inset-x-0 bottom-0 z-[1] h-[248px] overflow-clip"
    >
      <ProgressiveBlur />

      {/* Customers — 36px row sitting 32px off the bottom. */}
      <div className="absolute inset-x-0 bottom-8 z-[1] flex h-9 flex-col items-center justify-end gap-6">
        <div className="flex w-full items-center justify-center px-4">
          <div className="relative min-w-0 flex-1 tablet:h-10 desktop:h-auto">
            {/* White Logos — 36px, clipped. HCW's box is 52px in the original and really
                does overflow this; the clip is the original's behaviour, not a bug here. */}
            <div className="relative flex h-9 w-full items-center justify-center overflow-hidden">
              <section
                className="flex h-full min-w-0 flex-1 items-center overflow-hidden px-3
                           transition-opacity duration-500"
                style={{
                  opacity: ready ? 1 : 0,
                  maskImage:
                    "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 87.5%, rgba(0,0,0,0) 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 87.5%, rgba(0,0,0,0) 100%)",
                  transitionTimingFunction: "var(--ease-rogo)",
                }}
                aria-label="Our customers"
              >
                <ul
                  ref={track}
                  /* w-max + flex-none: the track must lay out at its full doubled width and
                     overflow the clip, never shrink to fit. If it shrank, the measured
                     cycle would be wrong and the loop would tear. */
                  className="relative flex h-full w-max flex-none list-none items-center"
                  style={{ gap: `${GAP}px`, margin: 0, padding: 0 }}
                >
                  {/* Two passes. The original marks BOTH aria-hidden, which leaves the
                      customer list entirely unreadable to AT; we expose the first pass and
                      hide only the duplicate. Documented as a deviation in FEATURE.md. */}
                  {[0, 1].map((pass) =>
                    LOGOS.map((l) => (
                      <li
                        key={`${pass}-${l.name}`}
                        className="flex-none"
                        {...(pass === 1 ? { "aria-hidden": true } : null)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/logos/${l.file}`}
                          alt={pass === 0 ? l.name : ""}
                          width={l.w}
                          height={l.h}
                          style={{ width: l.w, height: l.h, maxWidth: "none" }}
                        />
                      </li>
                    ))
                  )}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
