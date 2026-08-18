/**
 * CompanyServices — Block 3 of /company, the band Framer names `Team`.
 *
 * ⚠️ REBUILT THREE TIMES. Read all three notes before reaching for the capture.
 *
 * ─── 2026-08-16 · THE BOX STOPPED BEING ROGO'S ───────────────────────────────────────────────
 *
 * This band shipped as rogo's `Team` grid with clix's content in it: eight 164px tiles, 4 → 4 →
 * 1, each holding a 32px mark and a label, hairline-ruled top + inline-end. Every one of those
 * numbers was measured off `docs/reference/target/rogo-company-2026-08-12.{html,css}`.
 *
 * The user's brief was "huge ui update": delete the tools band, and make this one *present*
 * each service rather than name it — pointing at the `#services` band on
 * `clix-main-page.vercel.app` ("פתרון מותאם לכל עסק."). It became eight cards in a 2-column
 * grid, each carrying a scene that shows what the service produces. THE MEASURED TILE GRID IS
 * GONE, not mislaid. Recorded as a deviation in features/company-page/FEATURE.md.
 *
 * ─── 2026-08-17 · THE GRID BECAME A STICKY STACK ─────────────────────────────────────────────
 *
 * The user's brief: *"make it like scroll animation, only 1 service per scroll, give it like
 * modern and better looking UI and animation"*. The 2-column grid put all eight services on the
 * screen at once, each ~304px wide, and none of them got read — eight cards competing is eight
 * cards ignored. Each card STUCK and the next scrolled up over it, so the band became eight
 * beats instead of one wall.
 *
 * ─── 2026-08-17 · THE STACK BECAME A REEL ────────────────────────────────────────────────────
 *
 * The user brought a reference layout — a scroll-driven list of titles beside a media track
 * that slides in step with it — and asked: *"i think this one is better for the 8 services
 * section, we can use this layout but keep the current cards"*. So the CONTAINER changed and
 * NOTHING ELSE DID. All eight scenes, all eight step maps and the whole process player came
 * across unaltered; `serviceArt.tsx` was not touched by this rebuild at all.
 *
 * ⚠️ THE ONE MEASUREMENT THAT MADE THIS CHEAP, RECORDED SO IT IS NOT RE-DERIVED. `Stage` in
 * serviceArt.tsx caps a scene at 560px, and the sticky card's art well ALREADY hit that cap —
 * so a ~52% art column in a 1280 frame renders every scene at exactly the size it had before.
 * The layout change cost the scenes nothing. Had that not been true this would have been a
 * redraw of eight mocks, not a rewrite of one container, and the answer would have been no.
 *
 * The band is now ONE STICKY FRAME inside a tall scroller, holding three tracks that slide
 * together on a shared index:
 *
 *   · the NAME LIST      — translated by `--reel-item-h`, live row in `ink` + its accent
 *   · the DETAIL BLOCK   — translated by `--reel-detail-h`, the promise and the stack chips
 *   · the ART TRACK      — translated by `--reel-panel-h`, the live scene sharp between two
 *                          blurred neighbours, which is what makes it read as a reel
 *
 * Geometry is `--reel-*` in globals.css; behaviour is ServiceReel.tsx; every visual state is
 * an attribute selector, so this file stays a server component and keeps owning the markup.
 *
 * WHAT SURVIVES ALL THREE REBUILDS:
 *   · The band's outer geometry — `bone` ground, `96/64px` block padding, `40/16px` gutter,
 *     `--container-max`. Untouched throughout; shared with three other bands.
 *   · The h2 preset (44 / 40 / 32, 400, 110%, −0.05em) and the intro preset (18 / 16, 130%,
 *     −0.02em), still byte-identical to /product's.
 *   · The POSITIONALLY-PAIRED 8-slot tuples. See the note on SERVICE_ACCENTS below.
 *     `serviceGlyphs.tsx` IS STILL UNREFERENCED BY THIS BAND — the file is left in place
 *     because it is the only copy of those eight marks, but nothing renders it.
 *
 * WHAT WENT WITH THE STACK:
 *   · `.service-stack` and its four `--stack-*` numbers, the sticky `<li>` deck, the recede
 *     tween, the 3px accent-then-ink top rule, and `flowTop()` — the hand-rolled document-space
 *     measurement that existed only because ScrollTrigger cannot measure a stuck element. The
 *     reel's scroller is NOT sticky, so a plain `top top` / `bottom bottom` trigger is honest
 *     and roughly 180 lines of the band's hardest code deleted with it.
 *   · `--nav-peak-h` AS A REST OFFSET. It is padding on the sticky wrapper now, doing the same
 *     job for the same reason: the nav's banner returns on upward scroll, so anything pinned
 *     beneath it must clear the banner and not just the row.
 *
 * WHAT CAME BACK:
 *   · `kicker`. It was cut on 2026-08-17 with the templated icon-tile row and has sat unrendered
 *     in both dictionaries since. This layout has a caption slot over the live scene — the
 *     reference puts a location there — and a sourced one-line reason for the service is a
 *     better tenant than an invented one. It is no longer part of an `01 · KICKER` eyebrow.
 *   · A POSITION INDICATOR — and it lasted about a minute. See the ⚠️ where the rail used to
 *     be: the user removed this one too, so the band is back to having none.
 *
 * ─── TIER MAP ────────────────────────────────────────────────────────────────────────────────
 *
 * |                | ≥1200                    | 810–1199          | ≤809            |
 * |----------------|--------------------------|-------------------|-----------------|
 * | band padding   | `96px 40px`              | `64px 40px`       | `64px 16px`     |
 * | heading        | h2 BESIDE intro          | stacked           | stacked         |
 * | frame          | names · art              | names · art       | names ABOVE art |
 * | art column     | 52%                      | 52%               | 100%            |
 * | name type      | 34px                     | 24px              | 18px            |
 * | scroll/service | `56svh`                  | `52svh`           | `46svh`         |
 *
 * The `--reel-*` numbers are in globals.css, not here: most are per-tier and a custom property
 * cannot be set responsively from an inline `style`.
 *
 * Spec: features/company-page/FEATURE.md ("Block 3") · memory: features/company-page/CONTEXT.md
 */

import type { CSSProperties } from "react";

import { getDict } from "@/lib/i18n/server";

import ServiceReel from "./ServiceReel";
import { SERVICE_ART } from "./serviceArt";

/**
 * The eight accents, in the dictionary's order — the third positional tuple on this band,
 * after `cards` and `SERVICE_ART`, and before `SERVICE_STACKS`.
 *
 * ⚠️ POSITIONAL, NEVER A NAME LOOKUP. `cards` holds eight DIFFERENT strings on /he, so all
 * four tuples pair by index and all four are 8-slot tuples so the type system says so.
 *
 * ⚠️ TOKEN NAMES, NOT HEX. The values live in globals.css under `@theme`, where every other
 * colour on this site lives, and the rule "no raw hex in components" holds here too.
 *
 * ⚠️ WRITTEN OUT RATHER THAN BUILT AS `var(--color-svc-${i + 1})`. Tailwind and this repo both
 * assume a token is greppable: an interpolated name appears nowhere in a search for
 * `--color-svc-3`, and the next person deleting an "unused" token would be right to.
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
 * What each service is actually built on — the fourth positional tuple, added 2026-08-17.
 *
 * ⚠️ WHY THIS EXISTS. The card had a mark, a kicker, a name and one line of promise in a
 * 620px-tall box, so roughly a fifth of it was type and the rest was air. User: *"improve all
 * the cards, give more life to it, right now its still looking ai slop"* — and the emptiness
 * was the biggest part of that. These chips carry the concrete thing a reader actually wants
 * to know: what you would be buying. They survived the reel rebuild into the detail block.
 *
 * ⚠️ TOKENS, NOT SENTENCES — so this costs no dictionary key. Every entry is a product name, a
 * protocol or a platform: Latin in every locale, exactly like the machine tokens inside the
 * scenes. `dir="ltr"` is set on the row so they read correctly on /he.
 *
 * ⚠️ THESE ARE CLAIMS ABOUT THE BUSINESS AND I INVENTED SEVEN OF THE EIGHT ROWS FROM THE
 * SERVICE DESCRIPTIONS. They are plausible and consistent with
 * `docs/reference/clixsolutions/content.json`, but nobody has confirmed clix actually ships
 * n8n or Postgres. **Row 3 (CRM) is the exception — the user named it themselves on
 * 2026-08-17.** Treat the other seven as placeholder copy until they say otherwise.
 */
const SERVICE_STACKS: readonly [
  readonly string[], readonly string[], readonly string[], readonly string[],
  readonly string[], readonly string[], readonly string[], readonly string[],
] = [
  ["Sales", "Support", "Scheduling", "Ops"], //             1 · AI Agents
  ["Cloud API", "Templates", "Catalog", "Broadcast"], //    2 · WhatsApp
  /* ✅ THE ONLY ROW THE USER HAS CONFIRMED. It was `HubSpot · Salesforce · Pipedrive`, invented
     like the other seven; on 2026-08-17 they replaced it themselves. The rest are still
     placeholder — see the ⚠️ above. */
  ["Monday", "Notion", "Airtable"], //                      3 · CRM
  ["REST", "Webhooks", "n8n", "Zapier"], //                 4 · Integrations
  ["Next.js", "Headless CMS", "SEO", "Core Web Vitals"], // 5 · Web
  ["React Native", "iOS", "Android", "Push"], //            6 · Mobile
  ["TypeScript", "Postgres", "AWS", "CI/CD"], //            7 · Custom Software
  ["Audit", "Roadmap", "Governance", "Training"], //        8 · AI Strategy
];

export default function CompanyServices() {
  /* Eight cards, each `{ kicker, name, promise }`. Every Hebrew string is SOURCED verbatim
     from the real company site — see he/company.ts, where provenance is recorded per field. */
  const t = getDict().company.services;

  return (
    <section
      /* Still a light ground, so the nav theme scanner still reads it as light. */
      data-nav-theme="light"
      /* ⚠️ NO `overflow-hidden` HERE, AND IT MUST NOT COME BACK. An ancestor with
         `overflow: hidden` becomes a sticky element's scroll container, so the frame would pin
         to a box that scrolls away with the page — i.e. it would not appear to pin at all.
         This band already paid for that bug once with the sticky heading column. Nothing needs
         the clip; the reel does all of its clipping INSIDE the frame, on the track windows,
         which are descendants of the sticky element and therefore harmless. If a clip is ever
         genuinely required here, `overflow-clip`. */
      className="relative w-full bg-bone px-4 py-16 tablet:px-10 desktop:py-24"
    >
      <div className="mx-auto w-full max-w-[var(--container-max)]">
        {/* ── The heading ──────────────────────────────────────────────────────────────────
            Full width above the reel, where it used to be a sticky column beside a narrow card
            grid. It reads as a masthead for eight beats rather than a label pinned next to
            them, and it gives the frame the whole 1280 to split across.

            Row at desktop, stacked below: the h2 is capped at 640 and the intro at 460, which
            leaves them naturally balanced across the container without a fractional grid. */}
        <div className="flex flex-col gap-4 desktop:flex-row desktop:items-end desktop:justify-between desktop:gap-20">
          {/* The h2 preset shared by Mission, Team and Reiteration: 44 / 40 / 32, weight 400,
              110%, −0.05em, `ink`. Byte-identical to /product's. */}
          <h2
            className="w-full font-display text-[32px] font-normal text-ink
                       tablet:text-[40px] desktop:max-w-[640px] desktop:text-[44px]"
            style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
          >
            {t.title}
          </h2>
          {/* Body preset: 18px from 1200, 16 below; 130%, −0.02em, `muted`. */}
          <p
            className="w-full font-sans text-[16px] font-normal text-muted
                       desktop:max-w-[460px] desktop:text-[18px]"
            style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
          >
            {t.intro}
          </p>
        </div>

        {/* Everything the client controller touches lives inside this wrapper. It is a bare
            passthrough div with no `overflow`; see the ⚠️ at the foot of ServiceReel.tsx. */}
        {/* ⚠️ 16 / 24 / 32 AND NOT THE BAND'S USUAL 40 / 48 / 64, ON THE USER'S CALL. The reel
            does not begin where this margin ends: the frame is CENTRED in a `min-h-svh` sticky
            wrapper that also clears `--nav-peak-h`, so roughly another 180px of air sits between
            the heading and the frame's top edge before you have scrolled at all. The margin is
            the only part of that gap that is free to give — the centring is what keeps the frame
            in the middle of the screen for the whole band, and the nav clearance is not
            negotiable — so it gives all of it. If this still reads as too much, the next thing
            to take is the sticky wrapper's `pt`, and that one has a floor. */}
        <ServiceReel className="mt-4 tablet:mt-6 desktop:mt-8">
          {/* ── The scroller ───────────────────────────────────────────────────────────────
              The band's whole scroll budget, and the ONLY thing ScrollTrigger measures. One
              viewport of dwell plus `--reel-step` per transition, so `progress` maps linearly
              onto the eight services and `round(progress × 7)` puts each changeover halfway
              between two of them.

              ⚠️ `7` IS `cards.length - 1` AND IS WRITTEN AS A LITERAL BECAUSE IT IS IN A CSS
              `calc`. If a ninth service is ever added, this number and nothing else in the CSS
              has to move — ServiceReel.tsx derives its own count from the DOM. */}
          <div
            data-reel-scroller
            className="service-reel relative w-full"
            style={{ minHeight: "calc(100svh + 7 * var(--reel-step))" }}
          >
            {/* ⚠️ THE STICKY IS HERE, ON THE WRAPPER, AND NOT ON THE FRAME OR THE SCROLLER.
                On the scroller it would break the measurement the whole rewrite bought (see
                ServiceReel.tsx §"why the measurement problem is gone"); on the frame it would
                collide with the frame's own `overflow-hidden`.

                `pt-[--nav-peak-h]` and not a round number, for the reason recorded at
                globals.css:324 — the nav's banner returns on upward scroll, so a value that
                clears the row but not the banner is a bug you only see scrolling the wrong
                way. `min-h-svh` rather than `h-svh`: on a short viewport the frame is allowed
                to make the sticky area taller than the screen rather than be clipped by it. */}
            <div
              className="sticky top-0 flex w-full items-center justify-center pb-6
                         min-h-svh pt-[calc(var(--nav-peak-h)+8px)] desktop:pb-8"
            >
              {/* The frame. `overflow-hidden` is SAFE here and is not the forbidden one: the
                  rule is about ANCESTORS of a sticky element, and this is its child. */}
              <div
                data-reel-frame
                className="relative flex w-full flex-col overflow-hidden border border-hairline
                           bg-white shadow-float tablet:flex-row tablet:items-stretch"
              >
                {/* ⚠️ THERE IS NO RAIL, AND THE BAND HAS NO POSITION INDICATOR AT ALL AGAIN.
                    A 56px `bone` column ran down the frame's inline start holding `01` over
                    `08` — the reference layout's furniture, and the reel's answer to the
                    eight-tick rail deleted hours earlier. Removed on the user's call the moment
                    they saw it: *"remove the border and the number from left side"*.

                    ⚠️ WORTH KNOWING BEFORE ADDING ONE BACK. This is the SECOND position
                    indicator this band has lost, and the two removals together mean nothing
                    here says *which of eight you are on, or how many are left*. That is a real
                    cost, accepted twice knowingly: the name list itself carries a rough sense
                    of position (what is above you is done, what is below is coming), and the
                    user has now judged the chrome worse than the ambiguity in both of its
                    forms — as eight coloured ticks, and as two digits in a rule.

                    If it ever returns, it does NOT need this file: `ServiceReel` still computes
                    the index and still writes `--reel-i` and `data-state` on every row, so any
                    indicator keyed to "which service is live" can be hung on markup alone. */}

                {/* ── Names + detail ─────────────────────────────────────────────────────
                    `min-w-0` because a flex item's `auto` minimum would let the longest
                    service name set the column's floor and squeeze the art. */}
                <div
                  className="flex w-full min-w-0 flex-col justify-center gap-4 p-5
                             tablet:flex-1 tablet:gap-6 tablet:p-8 desktop:p-10"
                >
                  {/* The list slides through a masked window. Rows are FIXED height — that is
                      what the track translates by — so a name that wrapped to two lines would
                      overflow its row. Every string in both dictionaries sets on one line with
                      ~35% to spare at every tier, and `whitespace-nowrap` makes a future
                      violation obvious (a clipped name) rather than silent (a broken reel). */}
                  <div
                    className="reel-window reel-window--fade w-full"
                    style={{ height: "var(--reel-list-h)" }}
                  >
                    <ol className="reel-track reel-track--names m-0 list-none p-0">
                      {t.cards.map((card, i) => (
                        <li
                          key={card.name}
                          data-reel-item
                          style={
                            {
                              "--accent": SERVICE_ACCENTS[i],
                              height: "var(--reel-item-h)",
                            } as CSSProperties
                          }
                          className="flex items-center"
                        >
                          {/* ⚠️ A REAL BUTTON, NOT AN `onClick` ON THE `<li>`. The reference
                              layout this came from hangs its handler on the list item, so its
                              services are unreachable by keyboard — on a services page that is
                              a functional failure, not a nitpick. See the matching note in
                              ServiceReel.tsx about why passed items stay visible. */}
                          <button
                            type="button"
                            data-reel-go={i}
                            className="flex w-full min-w-0 items-center gap-3 text-start
                                       focus-visible:outline focus-visible:outline-2
                                       focus-visible:outline-offset-4
                                       focus-visible:outline-[var(--accent)]"
                          >
                            {/* Where the card's 3px top rule went. Grows from zero on the live
                                row; `inline-size` so it mirrors on /he without a second rule. */}
                            <span aria-hidden="true" data-reel-bar />
                            <span
                              data-reel-name
                              className="min-w-0 whitespace-nowrap font-display text-[20px]
                                         font-normal tablet:text-[24px] desktop:text-[34px]"
                              style={{ lineHeight: "110%", letterSpacing: "-0.02em" }}
                            >
                              {card.name}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* ⚠️ THE DETAIL IS A THIRD TRACK AND NOT EIGHT ABSOLUTELY-STACKED BLOCKS,
                      FOR A REASON THAT ONLY SHOWS UP WITH JS OFF. Stacked absolutely, all
                      eight promises would print on top of each other before any `data-state`
                      is written. As a track it inherits the same `--reel-i` fallback as
                      everything else: promise 1 in the window, the other seven clipped below.

                      Its window is a FIXED `--reel-detail-h` and it clips. Sized for the
                      longest Hebrew promise plus two rows of chips — check /he when the copy
                      changes; this is the one measurement here a translator can break. */}
                  <div className="w-full border-t border-hairline pt-4 tablet:pt-5">
                    <div
                      className="reel-window w-full"
                      style={{ height: "var(--reel-detail-h)" }}
                    >
                      <div className="reel-track reel-track--detail">
                        {t.cards.map((card, i) => (
                          <div
                            key={card.name}
                            data-reel-detail
                            style={
                              {
                                "--accent": SERVICE_ACCENTS[i],
                                height: "var(--reel-detail-h)",
                              } as CSSProperties
                            }
                            className="flex flex-col gap-4 tablet:gap-0"
                          >
                            <p
                              className="w-full font-sans text-[15px] font-normal text-muted
                                         tablet:text-[16px] desktop:text-[18px]"
                              style={{ lineHeight: "140%", letterSpacing: "-0.01em" }}
                            >
                              {card.promise}
                            </p>

                            {/* ⚠️ HIDDEN BELOW 810. At tablet and up the detail box is much
                                taller than one promise, so pinning the chips to its foot is
                                what stops them floating mid-air. On a phone the same spacer
                                opened a ~90px void between the promise and the chips inside a
                                box only 128px tall — the chips read as belonging to nothing.
                                There the two simply follow each other. */}
                            <div
                              aria-hidden="true"
                              className="hidden tablet:block tablet:flex-1"
                            />

                            {/* ⚠️ WHAT THE SERVICE IS BUILT ON. `dir="ltr"` because these are
                                product names and must read left-to-right on /he like every
                                other machine token on this band. See SERVICE_STACKS for the
                                ⚠️ about their accuracy. */}
                            <div dir="ltr" className="flex flex-wrap items-center gap-1.5">
                              {SERVICE_STACKS[i].map((tool) => (
                                <span
                                  key={tool}
                                  className="border border-hairline px-2 py-1 font-sans
                                             text-[11px] font-normal text-muted tablet:text-[12px]"
                                  style={{ lineHeight: "130%", letterSpacing: "normal" }}
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── The art track ──────────────────────────────────────────────────────
                    ⚠️ THE GROUND IS `ink` — /security's ground, and the second thing on this
                    band to be reversed. It shipped as a 5% accent tint over `bone`, which
                    fixed the original problem (a white panel centred on a white card is a
                    picture floating in nothing) but only just: bone against white is a value
                    step of a few percent, so the mock still had to work to read as a screen.

                    User, on sight: *"try putting black or the same bg from security to the
                    border of each card"*. `--color-ink` (#151515) is both — the exact ground
                    /security's bands paint, so this borrows a value the site already owns
                    rather than inventing a dark. The scenes are white `Surface`es, so the
                    contrast now does the work the tint was straining at.

                    ⚠️ THE WINDOW IS TALLER THAN ONE PANEL AND THAT IS THE WHOLE EFFECT. The
                    difference between `--reel-art-h` and `--reel-panel-h` is what lets the
                    previous and next scenes peek in, blurred, behind the mask. Equalise them
                    and this stops being a reel and becomes a cross-fade. */}
                {/* ⚠️ `minHeight` AND NOT `height`, WHICH IS NOT A STYLE PREFERENCE. The
                    frame is `items-stretch`, and a flex item with an explicit `height` does
                    not stretch — so on a short viewport, where the names column's fixed
                    windows add up to more than `--reel-art-h`, the art column would stop
                    short and leave a band of white under it. As a MINIMUM it still floors the
                    column at mobile (where the track is absolute and contributes no height)
                    and still stretches to the frame at tablet and up. The peek then grows with
                    the frame instead of the layout breaking. */}
                <div
                  className="reel-window w-full shrink-0 bg-ink tablet:basis-[52%]"
                  style={{ minHeight: "var(--reel-art-h)" }}
                >
                  {/* ⚠️ THE MASK IS ON THIS INNER LAYER AND NOT ON THE COLUMN, AND MOVING IT
                      BACK UP IS A VISIBLE BUG. A mask applies to the element it is set on —
                      INCLUDING that element's own background. On the column it faded the `ink`
                      ground itself, so the frame's dark half bled to white over ~90px at the
                      top and bottom, against `bone`, reading as two grey gradient bands rather
                      than as scenes going out of focus. User caught it on the first look.

                      The ground belongs to the column and must stay solid; only the TRACK
                      fades. Hence two elements: the column paints and clips, this layer masks. */}
                  <div className="reel-window--fade reel-window--fade-art absolute inset-0">
                    <div className="reel-track reel-track--art">
                    {t.cards.map((card, i) => {
                      /* Positional pairing, not a name lookup — see SERVICE_ACCENTS. */
                      const ServiceArt = SERVICE_ART[i];

                      return (
                        <div
                          key={card.name}
                          /* ⚠️ BOTH ATTRIBUTES ARE LOAD-BEARING AND THEY ARE NOT THE SAME
                             THING. `data-service-card` is what globals.css's
                             `[data-service-card][data-idle] *` animation gate selects on — the
                             name is a fossil of the card era and is kept because renaming it
                             means touching the gate for nothing. `data-reel-panel` is the
                             reel's own three-state selector. */
                          data-service-card
                          data-reel-panel
                          style={
                            {
                              "--accent": SERVICE_ACCENTS[i],
                              height: "var(--reel-panel-h)",
                              /* Block-start carries the caption band on top of the padding;
                                 `--reel-scene-max` subtracts the same amount. */
                              paddingBlock:
                                "calc(var(--reel-panel-pad) + var(--reel-caption-h)) var(--reel-panel-pad)",
                              paddingInline: "var(--reel-panel-pad)",
                            } as CSSProperties
                          }
                          className="relative flex w-full items-center justify-center"
                        >
                          {/* The caption — where the reference layout prints a location.
                              `kicker` is SOURCED Hebrew copy that had been sitting unrendered
                              since the templated eyebrow row was cut; this is a better use of
                              it than an `01 · KICKER` strip was. `text-white/55` is a value on
                              a dark ground rather than a palette colour, which is why it is
                              not a token.

                              ⚠️ IT IS POSITIONED FROM globals.css, NOT HERE, AND IT SITS IN
                              RESERVED SPACE RATHER THAN OVER THE SCENE. It shipped as
                              `absolute start-4 top-3` layered on a panel whose scene filled the
                              whole box, so the caption landed on top of the scene at every
                              size — user: *"the subheader is behind the card"*. `truncate`
                              because the band is one line by construction and the longest
                              Hebrew kicker is long. */}
                          <span
                            data-reel-kicker
                            className="pointer-events-none truncate font-sans text-[11px]
                                       font-normal uppercase text-white/55"
                            style={{ lineHeight: "130%", letterSpacing: "normal" }}
                          >
                            {card.kicker}
                          </span>

                          {/* ⚠️ THE WIDTH CAP IS WHAT KEEPS A 440 × 288 SCENE INSIDE A PANEL
                              WHOSE HEIGHT IS A `clamp()` OF `svh`. `Stage` derives its height
                              from its width, so on a short viewport the panel shrinks and the
                              scene would not. `--reel-scene-max` in globals.css is that panel
                              height converted back into a width. */}
                          <div
                            className="flex w-full items-center justify-center"
                            style={{ maxWidth: "var(--reel-scene-max)" }}
                          >
                            <ServiceArt />
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ServiceReel>
      </div>
    </section>
  );
}
