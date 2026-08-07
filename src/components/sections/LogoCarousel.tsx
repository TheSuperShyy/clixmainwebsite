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
import { ToolGlyph } from "@/components/ui/ToolGlyphs";

gsap.registerPlugin(useGSAP);

/**
 * THE TOOLS CLIX BUILDS WITH — replaced 2026-08-07 (user: "change the logo to the tools clix
 * use like vapi, elevenlabs, n8n, etc.").
 *
 * Was the target's fourteen investment banks (Jefferies, Lazard, Rothschild, …), which is a
 * *customer* row — the one thing on the page clix could least honestly inherit. This is a
 * *stack* row instead, which is what the real company site already publishes.
 *
 * PROVENANCE: twelve of these are clix's own list, lifted verbatim from the live site's
 * section 02 (`הסטאק` / "the stack" — "Every tool you use feeds one brain"), recorded in
 * docs/reference/clixsolutions/README.md. **ElevenLabs is the thirteenth and is the user's
 * addition** — it is not on the live site's list, so if that list is the source of truth,
 * this is the entry to check.
 *
 * `slug` keys into TOOL_GLYPHS; `null` means simple-icons has no mark for it and the item
 * renders as a wordmark alone. See the note in ToolGlyphs.tsx — that is a deliberate choice,
 * not a gap to fill later with a redrawn logo.
 *
 * Labels are each vendor's own casing: `n8n` and `monday.com` really are lowercase, `OpenAI`
 * really is camel-cased. Do not sentence-case these.
 */
const LOGOS: { name: string; slug: string | null }[] = [
  { name: "Vapi", slug: null },
  { name: "ElevenLabs", slug: "elevenlabs" },
  { name: "n8n", slug: "n8n" },
  { name: "OpenAI", slug: "openai" },
  { name: "Claude", slug: "claude" },
  { name: "Gemini", slug: "gemini" },
  { name: "Make", slug: "make" },
  { name: "WhatsApp", slug: "whatsapp" },
  { name: "monday.com", slug: null },
  { name: "Google Sheets", slug: "googlesheets" },
  { name: "Google Docs", slug: "googledocs" },
  { name: "Google Calendar", slug: "googlecalendar" },
  { name: "Hostinger", slug: "hostinger" },
];

/* Lockup geometry. The target's row is wordmarks 45-226px wide and 20-36px tall; a
   glyph-plus-name pair lands at roughly 70-190 x 24, i.e. inside that band, which is why the
   row reads the same even though every item was replaced. A row of bare 24px square glyphs
   would not — it reads as an icon tray, and the strip's whole visual job is a run of marks
   wide enough to sit under a headline. */
const GLYPH = 24; // px
const LOCKUP_GAP = 10; // px, glyph -> name

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

      const mm = gsap.matchMedia();
      let cancelled = false;

      const start = () => {
        if (cancelled) return;

        /* One cycle is the distance from item 0 to item N — i.e. all N logos PLUS the N
           gaps between and after them. Measuring it beats the usual `xPercent: -50` trick,
           which is subtly wrong here: the doubled track has 2N items but only 2N-1 gaps, so
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
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.set(ul, { x: 0 });
          gsap.to(ul, {
            x: -cycle,
            duration: cycle / SPEED_PX_PER_SEC,
            ease: "none",
            repeat: -1,
          });
        });
      };

      /* WAIT FOR THE WEBFONT. New in the 2026-08-07 rewrite and load-bearing: the items used
         to be <img> with intrinsic `width`/`height`, so the cycle was measurable on the first
         frame. They are now glyph + TEXT, and text laid out in the fallback sans is a
         different width from the same text in Inter. Measuring before the swap bakes in a
         wrong `cycle`, and the loop tears by exactly the reflow delta on every repeat.
         `document.fonts.ready` resolves immediately when the font is already cached, so this
         costs nothing on a warm load. */
      document.fonts.ready.then(start);

      return () => {
        cancelled = true;
        mm.revert();
      };
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
                aria-label="Tools we build with"
              >
                <ul
                  ref={track}
                  /* w-max + flex-none: the track must lay out at its full doubled width and
                     overflow the clip, never shrink to fit. If it shrank, the measured
                     cycle would be wrong and the loop would tear. */
                  className="relative flex h-full w-max flex-none list-none items-center"
                  style={{ gap: `${GAP}px`, margin: 0, padding: 0 }}
                >
                  {/* Two passes. The original marks BOTH aria-hidden, which leaves the list
                      entirely unreadable to AT; we expose the first pass and hide only the
                      duplicate. Documented as a deviation in FEATURE.md.

                      Each item is a lockup: the brand glyph, then the tool's name as REAL
                      TEXT — not baked into an image. That is why the first pass needs no
                      `alt` handling any more; the accessible name is the text itself, and
                      the glyph beside it is `aria-hidden` inside ToolGlyph. */}
                  {[0, 1].map((pass) =>
                    LOGOS.map((l) => (
                      <li
                        key={`${pass}-${l.name}`}
                        className="flex flex-none items-center text-paper"
                        style={{ gap: `${LOCKUP_GAP}px` }}
                        {...(pass === 1 ? { "aria-hidden": true } : null)}
                      >
                        {l.slug ? (
                          <ToolGlyph slug={l.slug} size={GLYPH} />
                        ) : null}
                        {/* `whitespace-nowrap` is not optional: the track is `w-max`, but a
                            two-word name is still free to break inside its own <li>, which
                            would make the item taller than the 36px row and change the
                            measured cycle. */}
                        <span
                          className="font-sans font-medium whitespace-nowrap"
                          style={{
                            fontSize: 20,
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {l.name}
                        </span>
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
