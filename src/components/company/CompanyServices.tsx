/**
 * CompanyServices — Block 3 of /company, the band Framer names `Team`.
 *
 * ⚠️ REBUILT 2026-08-16 ON THE USER'S CALL. Read this note before reaching for the capture.
 *
 * This band shipped as rogo's `Team` grid with clix's content in it: eight 164px tiles, 4 → 4 →
 * 1, each holding a 32px mark and a label, hairline-ruled top + inline-end. Every one of those
 * numbers was measured off `docs/reference/target/rogo-company-2026-08-12.{html,css}` and
 * reproduced exactly, and the band directly below it (`CompanyTools`, the `Investors` grid) was
 * the same shape again.
 *
 * The user's brief was "huge ui update": delete the tools band, and make this one *present*
 * each service rather than name it — pointing at the `#services` band on
 * `clix-main-page.vercel.app` ("פתרון מותאם לכל עסק."), where a sticky heading sits beside a
 * column of cards and each card carries a small piece of product UI.
 *
 * ⚠️ SO THE BOX IS NO LONGER ROGO'S. Everything below the section chrome is a deliberate
 * departure from the capture, and the measured tile grid is GONE, not mislaid. What survives
 * verbatim is the band's outer geometry — background, padding, gutter, container width — and
 * the two type presets, because those are shared with three other bands on this page and moving
 * them would desynchronise the route. Recorded as a deviation in features/company-page/FEATURE.md.
 *
 * WHAT SURVIVES FROM THE MEASURED BUILD, and it is not nothing:
 *   · `bone` ground, `96/64px` block padding, `40/16px` gutter, `--container-max` — untouched.
 *   · The h3 preset (44 / 40 / 32, 400, 110%, −0.05em) and the body preset (18 / 16, 130%,
 *     −0.02em) — untouched, and still byte-identical to /product's.
 *   · The eight service names, in the same order, from the same source.
 *   · `serviceGlyphs.tsx` — all eight marks, now at 20px in each card's header rather than 32px
 *     above its label. They were kept rather than dropped because the eight scenes look wildly
 *     different from one another and the marks are the one constant that holds the set together.
 *
 * ─── TIER MAP ────────────────────────────────────────────────────────────────────────────────
 *
 * |                | ≥1200                    | 810–1199        | ≤809          |
 * |----------------|--------------------------|-----------------|---------------|
 * | band padding   | `96px 40px`              | `64px 40px`     | `64px 16px`   |
 * | layout         | heading BESIDE cards     | stacked         | stacked       |
 * | container gap  | 80                       | 40              | 32            |
 * | heading col    | sticky, 45% (576 cap)    | static, 540 cap | static, full  |
 * | grid columns   | 2                        | 2               | 1             |
 * | card           | ~304 wide                | ~464 wide       | 358 wide      |
 * | grid gap       | 16                       | 16              | 16            |
 *
 * `1280 − 576 − 80 = 624`, and `(624 − 16) / 2 = 304` — four pixels off the 308px tile this
 * band used to render, so the card column inherits a width the page has already proved.
 *
 * ⚠️ THE STICKY OFFSET IS `--nav-peak-h + 16px` (131px at desktop), NOT `why-rogo`'s 96.
 * It was 96 — that band's inherited value — until the user reported the heading hiding under
 * the nav on upward scrolls. The nav's banner returns whenever you scroll up, taking the fixed
 * header from 70px to 115px, so 96 clears it in one scroll direction only. See globals.css's
 * `--nav-peak-h` for the derivation; do not swap it back for a round number.
 *
 * ⚠️ CARDS GROW, THEY DO NOT CLIP. `min-h-*` plus the grid's default `align-items: stretch`,
 * so a row is as tall as its tallest card and a longer Hebrew promise pushes the row instead of
 * being cut off. This is a DELIBERATE DIVERGENCE from /product's benefit cards, which are
 * `aspect-ratio`-fixed and whose bodies genuinely clip: that grid is three columns of six, this
 * one is two columns of eight, and a taller row costs nothing here. It also means these eight
 * cards need no per-locale line-count audit to be safe — only to look right.
 *
 * ─── ADDED 2026-08-16, SECOND PASS ───────────────────────────────────────────────────────────
 *
 * Three things, all the user's, all on top of the band above rather than instead of it:
 * *"add some colors and make the header floats when floating, and when hovering to a card,
 * make it bigger add a hover animation that is good"*.
 *
 * 1. **ONE ACCENT PER CARD.** `SERVICE_ACCENTS` below sets `--accent` on each `<li>`, and every
 *    scene reads it as `var(--accent)` without knowing which colour it got. The eight
 *    `--color-svc-*` tokens are declared and justified in globals.css; the short version is
 *    that they are a SET (6.07–6.81:1 on white, all AA on all three grounds they touch) and
 *    that they paint only a scene's live dot, its one outcome element, its primary bar fill and
 *    the travelling highlight. Card chrome, headings and body copy stay `ink` / `muted`.
 *
 * 2. **THE HEADING PINS — AND NOTHING ELSE.** It briefly gained a white panel while stuck
 *    ("make the header float when floating"); the user asked for that removed after seeing it,
 *    so `StickyLift.tsx` is deleted and this band has no client JS again. The two-box heading
 *    column stays: the wrapper must STRETCH to give the sticky child its travel, which is why
 *    `self-start` and `items-start` are both gone and must not come back.
 *
 * 3. **CARDS LIFT, SCALE AND TAKE THEIR ACCENT ON HOVER.** See the card's own note below.
 *
 * Spec: features/company-page/FEATURE.md ("Block 3") · memory: features/company-page/CONTEXT.md
 */

import type { CSSProperties } from "react";

import { getDict } from "@/lib/i18n/server";

import { EYEBROW_CLASS, EYEBROW_STYLE } from "./CompanyMission";
import { SERVICE_ART } from "./serviceArt";
import { SERVICE_GLYPHS } from "./serviceGlyphs";

/**
 * The eight accents, in the dictionary's order — the fourth positional tuple on this band,
 * after `cards`, `SERVICE_GLYPHS` and `SERVICE_ART`.
 *
 * ⚠️ TOKEN NAMES, NOT HEX. The values live in globals.css under `@theme`, where every other
 * colour on this site lives, and the rule "no raw hex in components" holds here too.
 *
 * ⚠️ WRITTEN OUT RATHER THAN BUILT AS `var(--color-svc-${i + 1})`. Tailwind and this repo both
 * assume a token is greppable: an interpolated name appears nowhere in a search for
 * `--color-svc-3`, and the next person deleting a "unused" token would be right to.
 */
const SERVICE_ACCENTS: readonly [
  string, string, string, string, string, string, string, string,
] = [
  "var(--color-svc-1)", // AI Agents          — teal
  "var(--color-svc-2)", // WhatsApp           — green
  "var(--color-svc-3)", // CRM                — blue
  "var(--color-svc-4)", // Integrations       — indigo
  "var(--color-svc-5)", // Web Development    — violet
  "var(--color-svc-6)", // Mobile Development — plum
  "var(--color-svc-7)", // Custom Software    — bronze
  "var(--color-svc-8)", // AI Strategy        — rust
];

/**
 * The card's hover state.
 *
 * ⚠️ `hover:z-10` IS NOT OPTIONAL, AND NEITHER IS `isolate` ON THE `<ul>`. The card scales
 * past its grid cell, so without the z-index it grows UNDER its neighbours on two of its four
 * edges — grid items paint in source order, so only the last card in a row would look right.
 * But an un-scoped 10 also beats the nav's `z-[3]` (Nav.tsx:438) in the root stacking context,
 * and a hovered card in the band's top row paints straight across the header. The `<ul>`'s
 * `isolation: isolate` is what contains it. The two go together; neither works alone.
 *
 * ⚠️ 4% AND 6px, RAISED FROM 2.5% AND 4px ON 2026-08-16 after the user reported the first pass
 * as not reading as "bigger". At 316px wide that is ~13px of growth, ~6px per side, against a
 * 40px gutter at the narrowest tier that renders two columns — so it still cannot cause a
 * horizontal page scroll. Verified over CDP, not reasoned about.
 *
 * ⚠️ `transform` IS THE ONLY GEOMETRY THAT MOVES. Scaling rather than growing keeps the hover
 * off the layout path entirely: no reflow, no neighbour shift, and the eight scenes inside are
 * never re-measured — which matters, because each one is a container query and a real width
 * change would re-resolve `--u` on every frame of the transition.
 *
 * ⚠️ 400ms, NOT the site's 300ms link preset. Measured against nothing — a judgement: 300ms on
 * a 400px card reads snatched where it reads crisp on a text link. The CURVE is still the
 * site's own `--ease-rogo`.
 *
 * `motion-reduce` cancels the transform outright rather than just the transition, because a
 * scaled card with no transition is a jump, which is the thing the setting exists to prevent.
 */
const CARD_HOVER =
  "transition-[transform,box-shadow,border-color] duration-400 " +
  "[transition-timing-function:var(--ease-rogo)] " +
  "hover:z-10 hover:-translate-y-1.5 hover:scale-[1.04] hover:shadow-float " +
  "focus-within:z-10 focus-within:-translate-y-1.5 focus-within:scale-[1.04] focus-within:shadow-float " +
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 " +
  "motion-reduce:focus-within:translate-y-0 motion-reduce:focus-within:scale-100";

export default function CompanyServices() {
  /* Eight cards, each `{ kicker, name, promise }`. The heading and intro sit beside them.
     Every Hebrew string in `cards` is SOURCED verbatim from the real company site — see
     he/company.ts, where the provenance is recorded per field. */
  const t = getDict().company.services;

  return (
    <section
      /* Still a light ground, so the nav theme scanner still reads it as light. */
      data-nav-theme="light"
      /* ⚠️ NO `overflow-hidden` HERE, AND IT MUST NOT COME BACK. This band carried it from the
         capture until 2026-08-16, and it is what broke the sticky heading: an ancestor with
         `overflow: hidden` becomes the sticky element's scroll container, so the heading pinned
         to a box that scrolls away with the page instead of to the viewport — i.e. it did not
         appear to pin at all. The symptom was deceptive at the time, because the lifted white
         panel still appeared on cue; it just slid up under the nav with everything else. That
         panel is gone now, so the only symptom left would be a heading that simply does not
         stick.

         Nothing needs the clip: a hovered card's 2.5% scale overhangs by ~4px into a 40px
         gutter, so no horizontal page scroll is possible either way. Removing it also stops
         the card's `shadow-float` being cut off at the band edge. */
      className="relative w-full bg-bone px-4 py-16 tablet:px-10 desktop:py-24"
    >
      {/* Container — max-w 1280. Column below 1200, two columns at and above it. */}
      <div
        /* ⚠️ NO `items-start` HERE, AND THAT IS LOAD-BEARING. The heading wrapper has to
           STRETCH to the row height, because that height is the travel its sticky child moves
           within — `items-start` collapses it to content height and the heading never pins at
           all. The default `stretch` is the whole mechanism. */
        className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-8
                   tablet:gap-10 desktop:flex-row desktop:justify-between desktop:gap-20"
      >
        {/* ── The heading column ──────────────────────────────────────────────────────────
            TWO boxes, not one, and the outer one is why the pin works: it is the flex item and
            it STRETCHES to the row height, which is the travel the sticky child moves within.
            `self-start` or `items-start` on the container would collapse it to content height
            and the heading would never pin at all.

            ⚠️ THE PINNED PANEL IS GONE (2026-08-16, second correction). It briefly gained a
            white fill, a `hairline` border and `shadow-float` while stuck — the user's
            "make the header float when floating" — and then asked for that removed after
            seeing it. The PIN stays; only the treatment went. What went with it:
              · `StickyLift.tsx`, deleted — with nothing to toggle, its sentinel and
                IntersectionObserver bought nothing, and the band is a pure server component
                again with no client JS at all.
              · `desktop:p-6` and the `-mt-6 -ms-6` that compensated for it. Both existed only
                to give the panel breathing room; with no panel they cancel out to nothing and
                are noise.
            `shadow-float` survives in globals.css — the card hover still uses it. */}
        <div className="w-full tablet:max-w-[540px] desktop:w-[45%] desktop:max-w-[576px] desktop:shrink-0">
          {/* ⚠️ THE STICKY OFFSET CLEARS THE HEADER AT ITS TALLEST, NOT ITS SHORTEST. The nav's
              banner eases OUT on the way down and BACK IN on the way up, so the fixed header is
              70px while scrolling down and 115px the instant you scroll up. This was `top-24`
              (96px, borrowed from `why-rogo`) and the heading tucked 19px under the returning
              banner every time — a bug visible only when scrolling the wrong way.
              `--nav-peak-h` is derived in globals.css; +16 is the gutter step.

              `top` is set INLINE and ungated on purpose: below 1200 the element is `static`, so
              `top` is inert there and needs no `desktop:` prefix. A Tailwind arbitrary value
              would have to be `top-[calc(var(--nav-peak-h)_+_16px)]`, which is the same thing
              spelled worse. */}
          <div
            className="flex w-full flex-col justify-center gap-[10px] desktop:sticky"
            style={{ top: "calc(var(--nav-peak-h) + 16px)" }}
          >
            {/* The h3 preset shared by Mission, Team and Reiteration: 44 / 40 / 32, weight 400,
                110%, −0.05em, `ink`. Byte-identical to /product's. It sets in a 440px measure
                at desktop now rather than 640 — the column is 576 wide but the type is capped
                tighter, the same way the reference band caps its own h2 at 400. */}
            <h2
              className="w-full font-display text-[32px] font-normal text-ink desktop:max-w-[440px]
                         tablet:text-[40px] desktop:text-[44px]"
              style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
            >
              {t.title}
            </h2>
            {/* Body preset: 18px from 1200, 16 below; 130%, −0.02em, `muted`. */}
            <p
              className="w-full font-sans text-[16px] font-normal text-muted desktop:max-w-[440px]
                         desktop:text-[18px]"
              style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
            >
            {t.intro}
            </p>
          </div>
        </div>

        {/* ── The cards ───────────────────────────────────────────────────────────────────
            `min-w-0` because a flex item's default `min-width: auto` would let the widest
            machine token inside a scene set the column's floor and push the grid past 1280. */}
        {/* ⚠️ `isolate` IS WHAT KEEPS A HOVERED CARD UNDER THE NAV. The card raises itself with
            `hover:z-10` so it scales OVER its neighbours rather than under them — but the nav
            is `position: fixed z-[3]` (Nav.tsx:438) in the same root stacking context, so an
            un-scoped 10 beats it and the card paints across the header. `isolation: isolate`
            gives this list its own stacking context: the z-order still works between cards,
            and the whole list sits at `z-auto` in the root context, below the nav.
            Do not "simplify" this away — the symptom only shows on the band's top row. */}
        <ul
          className="isolate grid w-full list-none grid-cols-1 gap-4 p-0 tablet:grid-cols-2
                     desktop:min-w-0 desktop:flex-1"
        >
          {t.cards.map((card, i) => {
            /* Positional pairing three ways, not a name lookup — `cards` is eight different
               strings on /he. All three arrays are 8-slot tuples for that reason; see the
               roster notes in serviceGlyphs.tsx and serviceArt.tsx. */
            const ServiceGlyph = SERVICE_GLYPHS[i];
            const ServiceArt = SERVICE_ART[i];
            const accent = SERVICE_ACCENTS[i];
            /* Not a dictionary string. The real site prints Western digits in Hebrew too, so
               sixteen identical entries would be dead weight in both locale files. */
            const num = String(i + 1).padStart(2, "0");

            return (
              <li
                key={card.name}
                /* White on `bone`, square-cornered (`--radius-none` is this site's default and
                   the reference's 8px radius is deliberately not ported — see serviceArt.tsx
                   for why the radii INSIDE a scene are a different question). `group` so the
                   mark, the number and the wash all answer a hover on the whole card.

                   `--accent` is set HERE and read by everything below, including all of
                   serviceArt.tsx. It is the only place the eight colours are assigned. */
                style={{ "--accent": accent } as CSSProperties}
                className={`group relative flex min-h-[352px] w-full flex-col overflow-hidden
                           border border-hairline bg-white p-4 tablet:min-h-[384px] tablet:p-5
                           desktop:min-h-[400px] ${CARD_HOVER}`}
              >
                {/* The accent wash — a soft bloom behind the scene, invisible at rest. Opacity
                    only, so it costs nothing when it is not showing and cannot shift anything
                    when it is. `-z-0` keeps it under the card's own content without needing a
                    stacking context on every sibling. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity
                             duration-400 [transition-timing-function:var(--ease-rogo)]
                             group-hover:opacity-100 group-focus-within:opacity-100"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 50% 100%, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 70%)",
                  }}
                />
                {/* Header row — the mark and the sourced benefit kicker. */}
                <div className="flex items-center gap-2">
                  {/* 20px, `muted` at rest so the name stays the loudest thing in the card,
                      `ink` on hover with a 2px lift. Both transitions run on the site's own
                      300ms / `--ease-rogo` link preset — carried over unchanged from the tile
                      this card replaces. `aria-hidden` lives on the <svg>. */}
                  <ServiceGlyph
                    /* `text-[var(--accent)]` on hover rather than `ink` — the mark is where a
                       card first says which colour it is. Same 300ms / `--ease-rogo` link
                       preset it carried as a tile; only the destination colour changed. */
                    className="relative h-5 w-5 shrink-0 text-muted transition-[color,transform]
                               duration-300 [transition-timing-function:var(--ease-rogo)]
                               group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]
                               group-focus-within:text-[var(--accent)]
                               motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                  />
                  <p
                    className={`relative min-w-0 flex-1 ${EYEBROW_CLASS}`}
                    style={EYEBROW_STYLE}
                  >
                    <span
                      className="tabular-nums transition-colors duration-300
                                 [transition-timing-function:var(--ease-rogo)]
                                 group-hover:text-[var(--accent)]
                                 group-focus-within:text-[var(--accent)]"
                    >
                      {num}
                    </span>
                    <span aria-hidden="true"> · </span>
                    {card.kicker}
                  </p>
                </div>

                {/* The service name. 28px at every tier, matching /product's benefit-card
                    title — the card is 304px at its narrowest, which is wider than the 272px
                    that preset was fitted against. */}
                <h3
                  className="relative mt-3 w-full font-display text-[28px] font-normal text-ink"
                  style={{ lineHeight: "110%", letterSpacing: "-0.02em" }}
                >
                  {card.name}
                </h3>

                {/* The art well. Every scene renders at 280 × 168 source units and scales
                    itself by container query, so this box only ever positions it. The 1.5%
                    lean on hover is a `transform`, so the container query is untouched and the
                    scene is never re-measured mid-transition. */}
                <div
                  className="relative mt-5 flex min-h-0 flex-1 items-center justify-center
                             overflow-hidden transition-transform duration-400
                             [transition-timing-function:var(--ease-rogo)]
                             group-hover:scale-[1.015] group-focus-within:scale-[1.015]
                             motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                >
                  <ServiceArt />
                </div>

                {/* The promise, pinned to the bottom by the art well's `flex-1` above it. */}
                <p
                  className="relative mt-5 w-full font-sans text-[14px] font-normal text-muted"
                  style={{ lineHeight: "130%", letterSpacing: "-0.01em" }}
                >
                  {card.promise}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
