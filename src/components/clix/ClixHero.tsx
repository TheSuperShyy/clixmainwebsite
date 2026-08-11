"use client";

/**
 * ClixHero — clone of rogo.com/felix `Hero` (`.framer-1mzt05a`).
 *
 * Measured from docs/reference/target/rogo-felix-2026-08-09.html. Spec and provenance in
 * features/felix-page/FEATURE.md. Do not "tidy" a number without changing that file first.
 *
 * THE HEADLINE IS THREE BOXES, NOT ONE STRING. The original sets it as:
 *
 *     [        Meet Clix         ]   <- own line, text-align:center
 *     [ your new ][ <rotating> ]     <- one row, gap 16px
 *
 * "your new" is right-aligned and the rotating word is a fixed-width box, so the row's
 * centre never moves as the word changes. That fixed width is the whole trick — remove it
 * and every swap reflows the line. Widths are the original's: 270px at >=810, 306px on phone.
 *
 * TIER MAP — read this before touching a size. Framer's four tiers collapse to THREE here,
 * because XL and Desktop share a value:
 *
 *     >=1200 (desktop + XL)   92px
 *     810-1199.98 (tablet)    72px
 *     <=809.98 (phone)        56px
 *
 * Derived by mapping each `hidden-*` class back to the media query that hides it
 * (`hidden-j35swi` <=809.98, `hidden-1mourlc` tablet, `hidden-1ggina8` desktop,
 * `hidden-za60dz` >=1600), not by reading the visual.
 *
 * TYPEFACE IS A KNOWN, DELIBERATE DIVERGENCE. The original sets this in ABC Arizona Mix
 * Regular, a serif. This build deleted that face on 2026-08-08 — it is a licensed Dinamo
 * font we had lifted from the capture and had no right to serve — and set the whole site in
 * Discovery, which the user owns. So the headline renders in Discovery. Every metric here
 * (92/72/56px, -0.06em, 100%) is still the original's. See DESIGN-SYSTEM.md.
 */

import { useEffect, useRef, useState } from "react";

/* ⚠️ INCOMPLETE, AND KNOWN TO BE. The original's list is not recoverable from a static
   capture: the word lives in a Framer code component (`data-code-component-plugin-id`
   `84d4c1`) whose chunk is fetched lazily, so the served HTML carries only the SSR word.
   Checked, and stopped there: the main JS bundle (146 KB) contains none of these strings,
   and six cache-busted fetches of the live page returned "investor" all six times.

   These two are the ones actually OBSERVED — "investor" from the capture, "analyst" from the
   user's screenshot of the live page. Nothing else is invented to pad the cycle; a made-up
   word would read as measured and it is not. Add to the array the moment the real list is
   known — nothing else has to change. */
const WORDS = ["analyst", "investor"];

/* ESTIMATED, both of them — a static capture cannot encode a rate, and this is the only
   thing on the section that is not a measured value. The capture DOES pin the enter state
   exactly: the SSR word ships as `filter:blur(8px); opacity:0; transform:translateY(-24px)`,
   i.e. it arrives from 24px ABOVE, blurred and transparent. Exit is the same motion
   continued downward, which is the natural reading of a downward entrance, not an observed
   fact. Flagged in FEATURE.md. */
const HOLD_MS = 2600;
const SWAP_MS = 500;

function RotatingWord() {
  const [i, setI] = useState(0);
  /* `out` is the brief window where the outgoing word is on its way down and the incoming
     one has not started. Two states rather than a crossfade of two DOM nodes: the box is a
     fixed width and only ever shows one word, so a second node buys nothing. */
  const [out, setOut] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    /* Respect the OS setting: a word that swaps every 2.6s is exactly the kind of
       unattended motion `prefers-reduced-motion` exists for. Freezes on WORDS[0] rather
       than swapping instantly, because an abrupt text change is the same distraction
       without the softening. */
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    if (mq.matches || WORDS.length < 2) return;

    let swap: ReturnType<typeof setTimeout>;
    const tick = setInterval(() => {
      setOut(true);
      swap = setTimeout(() => {
        setI((n) => (n + 1) % WORDS.length);
        setOut(false);
      }, SWAP_MS);
    }, HOLD_MS);

    return () => {
      clearInterval(tick);
      clearTimeout(swap);
    };
  }, []);

  return (
    /* height/width/padding/margin are the original's verbatim. The `p-5 -m-5` pair is not
       decoration: `overflow:visible` plus 20px of padding is what stops the 8px blur from
       being clipped at the box edge, and the negative margin takes the padding back out of
       the layout so the row's 16px gap stays 16px. */
    <div
      className="relative flex h-[100px] w-[306px] items-center justify-center overflow-visible
                 p-5 -m-5
                 tablet:w-[270px] tablet:justify-start"
      /* The live region is off: this is decorative repetition of the same idea, and a
         polite announcement every 2.6s would make the page unusable on a screen reader.
         The full phrase is in the visually-hidden heading below instead. */
      aria-hidden="true"
    >
      <span
        className="inline-block font-display text-forest
                   text-right text-[56px] leading-[100%]
                   tablet:text-left tablet:text-[72px]
                   desktop:text-[92px] desktop:leading-[110%]"
        style={{
          letterSpacing: "-0.06em",
          /* Enter: down from -24px, unblurring. Exit: continues down to +24px. */
          filter: out ? "blur(8px)" : "blur(0px)",
          opacity: out ? 0 : 1,
          transform: out ? "translateY(24px)" : "translateY(0)",
          transition: reduced.current
            ? "none"
            : `filter ${SWAP_MS}ms var(--ease-rogo), opacity ${SWAP_MS}ms var(--ease-rogo), transform ${SWAP_MS}ms var(--ease-rogo)`,
        }}
      >
        {WORDS[i]}
      </span>
    </div>
  );
}

export default function ClixHero() {
  return (
    <section
      id="clix-hero"
      /* `light`, not `hero`: this page has no dark video behind the bar, so the nav's
         three-way palette must resolve to the solid-paper state. See Nav.tsx. */
      data-nav-theme="light"
      className="relative flex h-min w-full flex-col items-center justify-center gap-[108px]
                 overflow-clip px-4 pt-24 pb-0
                 tablet:gap-[108px] tablet:px-10 tablet:pt-32"
    >
      {/* The fixed page backdrop used to live here. MOVED to src/app/clix/page.tsx on
          2026-08-09: in the original it is a sibling of all eight sections, not a child of
          the hero, and keeping it here meant it sat inside an `overflow-clip` ancestor for no
          reason. Behaviour is unchanged; the ownership is now correct. */}

      {/* Width Container */}
      <div
        className="relative z-[1] flex h-min w-full max-w-[var(--container-max)] flex-col
                      items-center justify-center gap-24 tablet:gap-[108px]"
      >
        {/* Headline Container — gap 40px to the button */}
        <div
          className="relative flex h-min w-full flex-col items-center justify-center gap-10
                        overflow-visible"
        >
          {/* The two headline lines. gap:0 — the 100% line-height is the whole spacing. */}
          <div
            className="relative flex h-min w-full flex-col items-center justify-center
                          overflow-visible"
          >
            {/* One accessible heading for the whole lockup. The visible pieces are three
                separate boxes with a word that changes every 2.6s; exposing that to a
                screen reader would announce a fragment at a time, forever. */}
            <h1 className="sr-only">
              Meet Clix, your new {WORDS.join(" or ")}
            </h1>

            <p
              aria-hidden="true"
              className="relative h-auto w-auto max-w-[var(--measure)] flex-none
                         font-display text-forest text-center
                         text-[56px] leading-[100%]
                         tablet:w-full tablet:max-w-none tablet:text-[72px]
                         desktop:max-w-[var(--measure)] desktop:text-[92px]"
              style={{ letterSpacing: "-0.06em" }}
            >
              Meet Clix
            </p>

            {/* Row: "your new" + the rotating word. Phone stacks it (column, gap 0). */}
            <div
              className="relative flex h-min w-full flex-col items-center justify-center
                            overflow-visible
                            tablet:flex-row tablet:gap-4"
            >
              <p
                aria-hidden="true"
                className="relative h-auto w-auto max-w-[var(--measure)] flex-none
                           font-display text-forest text-right
                           text-[56px] leading-[100%]
                           tablet:max-w-none tablet:whitespace-pre tablet:text-[72px]
                           desktop:max-w-[var(--measure)] desktop:whitespace-normal
                           desktop:text-[92px]"
                style={{ letterSpacing: "-0.06em" }}
              >
                your new
              </p>
              <RotatingWord />
            </div>
          </div>

          {/* Button. The original ships it TWICE — a 48px-tall instance for >=1200 and a
              44px one below, each gated by `hidden-*`. Reproduced as one element with a
              responsive height, since nothing else differs between them and two DOM copies
              of the same link is a duplicate tab stop for no gain. */}
          <a
            /* The original's own `Request Access` points at this page's CTA. It went to the
               home page's contact block while that section did not exist; repointed here on
               2026-08-09 now that ClixCTA ships `id="clix-contact"`. */
            href="#clix-contact"
            className="group relative flex h-11 w-min flex-none cursor-pointer items-center
                       justify-center gap-2 overflow-hidden rounded-[6px]
                       border border-transparent bg-forest px-4 py-2 no-underline
                       transition-opacity duration-300 hover:opacity-90
                       focus-visible:ring-2 focus-visible:ring-forest
                       focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                       focus-visible:outline-none
                       desktop:h-12"
            style={{ transitionTimingFunction: "var(--ease-rogo)" }}
          >
            <span className="flex h-5 items-center justify-center gap-[10px] pt-px">
              {/* `whitespace-pre` is the original's own value on this node
                  (`.framer-qcnp6y { white-space: pre }`), and it is load-bearing rather
                  than cosmetic: the anchor is `width: min-content`, so without it the label
                  breaks at the space and the button renders two lines tall. */}
              <span
                className="font-sans text-[16px] font-medium whitespace-pre text-paper"
                style={{ lineHeight: "1em", letterSpacing: "-0.01em" }}
              >
                Request Access
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
