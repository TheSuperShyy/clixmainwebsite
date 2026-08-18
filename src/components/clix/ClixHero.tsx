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
 * and every swap reflows the line.
 *
 * ⚠️ THE ORDER OF THOSE TWO BOXES IS LOCALE-DEPENDENT (2026-08-16), driven by
 * `hero.rotorLeads`. English modifies before the noun ("your new" + "[AI agent]"); Hebrew puts
 * the definite noun first and its modifier after ("[המומחה]" + "החדש שלכם"). Under rtl a
 * `flex-row` reverses visually, so DOM order is reading order in BOTH locales, which makes a
 * DOM-order swap the only correct fix — not a `flex-row-reverse`, which would reverse the
 * visual order in ltr too. The rotor box's `justify` flips with it, for the reason spelled
 * out on that element.
 *
 * ⚠️ THE WIDTH IS A DICTIONARY VALUE BECAUSE IT IS LOCALE-SPECIFIC (2026-08-12), AND BOTH
 * LOCALES' NUMBERS ARE NOW OURS (2026-08-18). English is 338px at >=810 and 206px on phone;
 * Hebrew is 370px / 225px. Both pairs are max(advance of every rotating word) at the largest
 * size each tier renders — the `tablet` value serves the 92px tier too — rounded up. English
 * no longer carries the original's 270/306: those were Latin advances for a serif face we do
 * not serve, for two words we no longer show. It arrives as `--rotor-w` / `--rotor-w-tablet`
 * rather than as a class, so the per-locale number never shares a line with a direction
 * utility. See `hero.rotorWidth` in src/lib/i18n/{en,he}/clix.ts, where the per-word tables
 * and the measurement method live.
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

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { usePageDict } from "@/lib/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";

/* ⚠️ THE ROTATING WORDS MOVED TO src/lib/i18n/{en,he}/clix.ts ON 2026-08-12, as
   `clix.hero.words`. The list is read through `usePageDict` below, and everything the old
   const's comment recorded is recorded beside the strings there. The short version:

   ⚠️ THE LIST IS NOT ROGO'S ANY MORE, as of 2026-08-18. Both locales cycle "AI agent /
   specialist / 24/7 team", which are THE USER'S OWN WORDS, given verbatim after they rejected
   an agent's proposal of four service roles the same day. The route's standing "clone now,
   rewrite after" decision is what allowed the change; the words themselves were not ours to
   choose and should not be "improved".

   THE INVESTIGATION BEHIND THE OLD LIST IS KEPT, because it is the reason this array is not a
   tuple. rogo's list is not recoverable from a static capture — the word lives in a Framer
   code component whose chunk is fetched lazily, so the served HTML carries only the SSR word.
   The main JS bundle (146 KB) contains none of the strings, and six cache-busted fetches of
   the live page returned "investor" all six times; "analyst" came from the user's screenshot.
   Nothing was ever invented to pad that cycle. It was two entries, known-incomplete; it is now
   three that are complete because they describe us instead of them.

   `words` is still typed `readonly string[]` and not a tuple: the count has moved twice, so it
   is content and not layout. The rotor cycles whatever length it is handed and nothing else
   here depends on it. ⚠️ Entries may now contain a SPACE and a SLASH — see the
   `whitespace-nowrap` note on the rotating span. */

/* ESTIMATED, both of them — a static capture cannot encode a rate, and this is the only
   thing on the section that is not a measured value. The capture DOES pin the enter state
   exactly: the SSR word ships as `filter:blur(8px); opacity:0; transform:translateY(-24px)`,
   i.e. it arrives from 24px ABOVE, blurred and transparent. Exit is the same motion
   continued downward, which is the natural reading of a downward entrance, not an observed
   fact. Flagged in FEATURE.md. */
const HOLD_MS = 2600;
const SWAP_MS = 500;

function RotatingWord() {
  /* A hook, NOT an import: a static `import` of a dictionary module from a "use client" file
     bundles BOTH locales into the client chunk. */
  const t = usePageDict("clix").hero;
  const words = t.words;
  const [i, setI] = useState(0);
  /* `out` is the brief window where the outgoing word is on its way down and the incoming
     one has not started. Two states rather than a crossfade of two DOM nodes: the box is a
     fixed width and only ever shows one word, so a second node buys nothing. */
  const [out, setOut] = useState(false);
  const reduced = useRef(false);
  const wordCount = words.length;

  useEffect(() => {
    /* Respect the OS setting: a word that swaps every 2.6s is exactly the kind of
       unattended motion `prefers-reduced-motion` exists for. Freezes on `words[0]` rather
       than swapping instantly, because an abrupt text change is the same distraction
       without the softening. */
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    if (mq.matches || wordCount < 2) return;

    let swap: ReturnType<typeof setTimeout>;
    const tick = setInterval(() => {
      setOut(true);
      swap = setTimeout(() => {
        setI((n) => (n + 1) % wordCount);
        setOut(false);
      }, SWAP_MS);
    }, HOLD_MS);

    return () => {
      clearInterval(tick);
      clearTimeout(swap);
    };
    /* `wordCount` is in the array for exhaustive-deps, not because the effect can re-run: the
       dictionary is a module constant reached through a context that mounts once per document
       (switching locale is a hard navigation across two root layouts), so the length is stable
       for the lifetime of the mount and this list is effectively empty. */
  }, [wordCount]);

  return (
    /* height/width/padding/margin are the original's verbatim. The `p-5 -m-5` pair is not
       decoration: `overflow:visible` plus 20px of padding is what stops the 8px blur from
       being clipped at the box edge, and the negative margin takes the padding back out of
       the layout so the row's 16px gap stays 16px. */
    <div
      /* ⚠️ THE WIDTH IS FIXED AND LOCALE-SPECIFIC, and both halves of that matter.
             FIXED, because the row's centre must not move as the word swaps — drop the width
         and every swap reflows the line. LOCALE-SPECIFIC, because 306/270 are rogo's Latin
         advances for a serif face and say nothing about the Hebrew words.

         Delivered as CSS custom properties rather than by editing the class string, so the
         per-locale number never shares a line with a direction utility. The two tiers need two
         properties because an inline style cannot carry a media query.

         `w-[var(--rotor-w)]` computes to exactly the 306px it computed to before in English —
         the token is set on this same element, one line down.

         ⚠️ THE JUSTIFICATION FLIPS WITH `rotorLeads`, and `start`/`end` alone do not cover it.
         A fixed box wider than its word has slack, and this is what decides where the slack
         goes. The rotor is the OUTER element of the row in BOTH arrangements — last in ltr,
         first (so rightmost) in rtl — and its ink must hug the INNER edge so the slack falls
         on the outside of the lockup instead of opening a gap that changes width in the
         middle of the sentence. With the lead leading, inner is the logical start; with the
         rotor leading, inner is the logical end. Hence the swap, not a shared logical class.
         The row itself is a fixed total width either way, so the line's centre never moves. */
      className={`relative flex h-[100px] w-[var(--rotor-w)] items-center justify-center
                 overflow-visible p-5 -m-5 tablet:w-[var(--rotor-w-tablet)] ${
                   t.rotorLeads ? "tablet:justify-end" : "tablet:justify-start"
                 }`}
      style={
        {
          "--rotor-w": t.rotorWidth.phone,
          "--rotor-w-tablet": t.rotorWidth.tablet,
        } as CSSProperties
      }
      /* The live region is off: this is decorative repetition of the same idea, and a
         polite announcement every 2.6s would make the page unusable on a screen reader.
         The full phrase is in the visually-hidden heading below instead. */
      aria-hidden="true"
    >
      <span
        /* ⚠️ `whitespace-nowrap` IS NEW (2026-08-18) AND IT IS LOAD-BEARING, not tidying.
           Until that date every rotating word in both locales was a single unbroken run, and
           the rest of this comment used to lean on exactly that. The list now holds "AI agent"
           and "24/7 team" (and "צוות ה-24/7" in Hebrew) — a SPACE and a SLASH, both break
           opportunities — inside a FIXED-WIDTH box. Without this class the string breaks the
           moment the box is a pixel narrow and the whole lockup renders a line deeper. The box
           is measured to fit; "measured to fit" is not a guarantee worth betting the headline
           on when one class removes the failure mode outright.

           `text-end` / `tablet:text-start` were `text-right` / `tablet:text-left`. MEASURED
           INERT AT EVERY TIER, and converted for intent rather than for effect: this span is
           `inline-block` inside a flex container, so it blockifies to a flex item with
           `flex-basis: auto` and — now by way of `nowrap` rather than by way of being one word
           — a min-content size equal to its max-content size. It therefore cannot shrink and
           its box is exactly as wide as its text. `text-align` on a box with no slack does
           nothing. Probed in headless Chrome at 1600/1440/1024/390: `clientWidth ===
           getClientRects()[0].width` at all four. The alignment that actually happens is the
           parent's `justify-center` / `tablet:justify-start|end`, which is already logical —
           and which is why the `rotorLeads` flip lives up there on the box and not here. This
           pair is left as-is precisely because it is inert; flipping a no-op would only imply
           it does something. */
        className="inline-block font-display whitespace-nowrap text-forest
                   text-end text-[56px] leading-[100%]
                   tablet:text-start tablet:text-[72px]
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
        {words[i]}
      </span>
    </div>
  );
}

export default function ClixHero() {
  const t = usePageDict("clix").hero;

  /* Line 2's STATIC run, lifted out of the JSX below so it can be placed on either side of
     the rotor without duplicating the class list. See `hero.rotorLeads`.

     `text-end` was `text-right`, and it is INERT at every tier for the same reason as the
     rotating span: `flex-none` means the box cannot grow or shrink, so it is exactly
     max-content wide and there is no slack for `text-align` to distribute.
     `tablet:whitespace-pre` removes even the theoretical wrap. Probed at 1600/1440/1024/390.
     Note this one has no `tablet:` override, so it never needed an `ltr:`/`rtl:` pair. */
  const leadRun = (
    <p
      aria-hidden="true"
      className="relative h-auto w-auto max-w-[var(--measure)] flex-none
                 font-display text-forest text-end
                 text-[56px] leading-[100%]
                 tablet:max-w-none tablet:whitespace-pre tablet:text-[72px]
                 desktop:max-w-[var(--measure)] desktop:whitespace-normal
                 desktop:text-[92px]"
      style={{ letterSpacing: "-0.06em" }}
    >
      {t.lead}
    </p>
  );

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
            {/* ⚠️ ONE AUTHORED SENTENCE, NOT A TEMPLATE. This used to be
                `"Meet Clix, your new " + WORDS.join(" or ")` — a sentence assembled from the
                separately-styled visual fragments. Hebrew grammar does not survive that join:
                the noun leads and its modifier follows, so a machine join yields a phrase no
                Hebrew reader would write. This is `sr-only`, so a hand-written sentence costs
                zero geometry. The English string renders identically to what the join
                produced. Cost, stated: it no longer tracks `words` automatically. */}
            <h1 className="sr-only">{t.srHeading}</h1>

            <p
              aria-hidden="true"
              className="relative h-auto w-auto max-w-[var(--measure)] flex-none
                         font-display text-forest text-center
                         text-[56px] leading-[100%]
                         tablet:w-full tablet:max-w-none tablet:text-[72px]
                         desktop:max-w-[var(--measure)] desktop:text-[92px]"
              style={{ letterSpacing: "-0.06em" }}
            >
              {t.headline}
            </p>

            {/* Row: the static run + the rotating word. Phone stacks it (column, gap 0).

                ORDER IS THE DICTIONARY'S CALL, not this file's. Under rtl a `flex-row`
                already reverses the row visually, so DOM order is reading order in both
                locales and this swap is what puts the Hebrew noun ahead of its modifier.
                Stacked on phone the same swap gives the two lines the right vertical order,
                which `flex-row-reverse` could not have done at all. */}
            <div
              className="relative flex h-min w-full flex-col items-center justify-center
                            overflow-visible
                            tablet:flex-row tablet:gap-4"
            >
              {t.rotorLeads ? (
                <>
                  <RotatingWord />
                  {leadRun}
                </>
              ) : (
                <>
                  {leadRun}
                  <RotatingWord />
                </>
              )}
            </div>
          </div>

          {/* Button. The original ships it TWICE — a 48px-tall instance for >=1200 and a
              44px one below, each gated by `hidden-*`. Reproduced as one element with a
              responsive height, since nothing else differs between them and two DOM copies
              of the same link is a duplicate tab stop for no gain. */}
          <AppLink
            /* THIS HAS MOVED TWICE, so the history is worth keeping. The original's own
               `Request Access` points at this page's own CTA band. It went to the home page's
               contact block while that band did not exist, was repointed to `#clix-contact` on
               2026-08-09 once ClixCTA shipped that id, and on 2026-08-13 it goes to /contact —
               the real form — because that is now the site's one CTA destination and the user
               asked for every CTA to reach it. The band and its `id` stay exactly where they
               are: its own button also goes to /contact, so the page still closes on the same
               ask, and nothing that linked to `#clix-contact` breaks. */
            href="/contact"
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
                {t.cta}
              </span>
            </span>
          </AppLink>
        </div>
      </div>
    </section>
  );
}
