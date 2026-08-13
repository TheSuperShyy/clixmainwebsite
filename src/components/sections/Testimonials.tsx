"use client";

/**
 * Testimonials — clix's own client videos, in the target's card.
 *
 * ⚠️ THE CONTENT IS NOT A CLONE AND THAT IS DELIBERATE. This section used to reproduce
 * rogo.ai's written quotes from named executives at Truist, Nomura and Baird. Under a clix
 * wordmark that implied three institutions endorse clix, which none of them do. Replaced
 * 2026-08-05 with clix's five real client videos. See features/testimonials/CONTEXT.md.
 *
 * THE CARD AND ITS ANIMATION ARE THE TARGET'S, restored 2026-08-05. Every timing and easing
 * is the clone's own value read back out of git, not a fresh estimate:
 *   · width          500ms  var(--ease-rogo)
 *   · collapse       500ms  var(--ease-rogo)
 *   · plus opacity   300ms  var(--ease-rogo)
 *
 * WHAT SWAPPED, AND WHAT DID NOT. The target's card is a flat `card` panel: a mark at the
 * top, a quote that collapses in the middle, a plus button and the attribution at the
 * bottom. Ours keeps that skeleton exactly and changes only what sits in the three slots —
 * the NAME takes the mark's place at the top, the VIDEO takes the quote's place in the
 * collapsing middle, and the TITLE sits alone at the bottom. No poster is used as card
 * artwork: a closed card is a plain panel with a name and a title, as the target's is.
 *
 * Geometry, since the percentages look arbitrary. The target ran THREE cards as
 * 17 / 17 / calc(66% - 24px) — the 24px being its two 12px gaps, so the row sums to exactly
 * 100%. Five cards need the same trick with four gaps: four closed at 16% is 64%, leaving
 * 36% for the open one, and the 48px it gives back is exactly 4 × 12px.
 *   1280 container → closed 204.8 each, open 412.8, gaps 48. Sum: 1280.
 *
 * Playback: `preload="none"` so none of the ~21MB is fetched until a card is played, audio
 * kept, never autoplays, and closing a card stops it.
 */

import { Fragment, useEffect, useRef, useState } from "react";
import QuoteCarousel from "@/components/sections/QuoteCarousel";
import { usePageDict, useChrome } from "@/lib/i18n/LocaleProvider";
import { interpolate } from "@/lib/i18n/format";
import type { HomeDict } from "@/lib/i18n/en/home";
import type { Translated } from "@/lib/i18n/shape";

/* `import type` only — a VALUE import of a dictionary module from a `"use client"` file would
   bundle both locales into the client chunk. Types are erased, so these two cost nothing and
   buy the guarantee below. `Translated<>` widens the English file's string LITERAL types back
   to `string`; without it `ClipCopy` is a union of six literal object types and `t.clips[id]`,
   itself a union, will not narrow against it. */
type ClipId = keyof HomeDict["testimonials"]["clips"];
type ClipCopy = Translated<HomeDict["testimonials"]["clips"][ClipId]>;

/* Names and roles moved to the dictionary on 2026-08-12 (`home.testimonials.clips`, keyed by
   these same ids). What stays here is the ORDER — which is layout — and the provenance, which
   is not translatable and belongs next to the files it describes. Deriving `ClipId` from the
   dictionary type means an id typo'd in either place fails the build.

   Names and roles are as published on clixsolutions.info; English is the RENDERING of them,
   and he/home.ts carries the originals.

   ⚠️ ONE OF THE SIX IS STILL UNSOURCED:

   · `achituv` — came from the uploaded filename ("Achituv-Vtechezena.MOV") and is NOT on the
     live site, so the role is a reading of that filename, not a sourced fact. The Hebrew is
     therefore a transliteration back out of a transliteration; flagged again in he/home.ts.

   `elyashiv-engineering` was the other and is now resolved. It arrived 2026-08-07 as
   "WhatsApp Video 2026-08-07 at 18.00.03.mp4" with nothing to identify the speaker from —
   no burned-in caption, no name card, no title overlay across ten frames of its 19.9s, and
   container metadata holding only `major_brand`/`language=und`. The user supplied the
   attribution on 2026-08-08 as **אלישיב הנדסה**, rendered in English as "Elyashiv Engineering"
   to match the treatment of the other five (הנדסה is the word *engineering*). On /he the
   user's own string is what ships.

   ⚠️ That is a COMPANY, not a person, which is why it is the one entry with an empty
   `role` — the card drops its second line rather than invent a job title for a firm. The
   speaker's own name is still unknown; the user gave the company and nothing more.

   ⚠️ AND ONE ATTRIBUTION IS CONTRADICTED BY ITS OWN ARTWORK. `public/testimonials/noam-tovi.jpg`
   carries a burned-in caption reading "אני נווה דוידי" (Nave Davidi), not Noam Tovi. Already
   flagged for /product at product/ProductTestimonials.tsx:220-226. It is invisible to most
   readers in English and becomes reader-visible on /he, where the card's own name sits inches
   from a subtitle giving a different one. Unresolved on purpose — see he/home.ts. */
/**
 * ⚠️ THE SWITCH BETWEEN THE TWO TESTIMONIAL TREATMENTS (2026-08-13), AND IT IS DERIVED FROM
 * THE COPY RATHER THAN HAND-SET. See `hasQuotes` in the component below.
 *
 *   quotes empty  — the six-card VIDEO ACCORDION here. Real clients, real footage, real words.
 *   quotes filled — `QuoteCarousel`, the written-quote slideshow moved here from /product.
 *
 * WHY IT IS DERIVED AND NOT A `const SHOW_QUOTES = false`, and this is the second design: a
 * hand-set flag was written first and was WRONG, for a reason worth recording.
 *
 * ⚠️ A FLAG CANNOT GUARD THIS, BECAUSE NOT RENDERING A STRING DOES NOT KEEP IT OFF THE PAGE.
 * The carousel's copy travels to the browser inside `PageDictProvider`, which serialises the
 * WHOLE `home` namespace into the RSC payload. With the flag off and the accordion rendering,
 * `curl localhost:3001/ | grep "PLACEHOLDER QUOTE"` still returned SEVEN hits — six slides and
 * a `phoneLeadQuote` — sitting in the public source of the indexed landing page, under real
 * clients' real names. Measured, not theorised. A `noindex` would not have helped either; it
 * hides a page from a crawler, not from a reader, and on the home page it is a bad trade.
 *
 * So the only real guard is that THE FABRICATED TEXT DOES NOT EXIST. The placeholders were
 * emptied to `""`, and the switch reads THAT. The two states cannot get out of step: no quotes
 * means no carousel, by construction, and supplying the quotes IS the act of turning it on.
 *
 * ✅ THE REAL QUOTES LANDED THE SAME DAY, so the carousel is what renders now and the accordion
 * below is the fallback. The guard stays exactly as it is — it is not scaffolding to be removed
 * now that it has passed. Blanking any of the six silently reverts to the accordion, which is
 * the intended failure mode, and it is what makes a future half-finished copy pass safe.
 *
 * CLEANUP STILL OWED, deliberately not done in the same pass: the accordion branch, `Card`,
 * `CLIP_IDS`, `t.clips` and the six now-unused public/testimonials/*.mp4 are all still here.
 * Deleting them would throw away the fallback this design depends on AND ~22MB of the user's
 * real client footage in a pass they asked to be about something else. Raise it with them.
 *
 * ⚠️ THE HEADING AND THE SECTION CHROME ARE SHARED AND STAY PUT either way — "In our clients'
 * own words" reads true of both treatments, which is the whole reason the swap is this small.
 */

/* ⚠️ SHARED ORDER, TWO CONSUMERS. These six ids and their sequence are mirrored by
   `SLIDE_STYLE` in QuoteCarousel.tsx, which pairs each with a photo and a per-slide quote
   size. Change one, change the other — and note the ids also name the files in
   public/testimonials/ (`<id>.mp4` for the accordion, `<id>.jpg` for BOTH, since the
   carousel's portraits are the accordion's poster frames). */
const CLIP_IDS: readonly ClipId[] = [
  "nevo-yahaloman",
  "asaf-peretz",
  "adir-peretz",
  "noam-tovi",
  "achituv",
  "elyashiv-engineering",
];

/* The capture draws this as a CSS mask on a 20px box; the path is an 18px plus glyph
   translated (3,3) inside a 24-unit viewBox. Inlined as an SVG instead so it inherits
   `currentColor` and needs no mask-mode fallbacks. Verbatim from the clone. */
function PlusGlyph() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M 8 10 L 0 10 L 0 8 L 8 8 L 8 0 L 10 0 L 10 8 L 18 8 L 18 10 L 10 10 L 10 18 L 8 18 Z"
        transform="translate(3 3)"
        fill="currentColor"
      />
    </svg>
  );
}

function PlusButton({ open, className = "" }: { open: boolean; className?: string }) {
  return (
    /* opacity 0 when the card is open — NOT `display:none`. It keeps its box so the
       desktop card's `justify-between` column keeps the same rhythm either way. The
       target's own treatment, including the 300ms. */
    <div
      className={`flex w-min items-center justify-center rounded-[6px] bg-ink-wash p-3
                  text-ink-soft transition-opacity duration-300
                  ${open ? "opacity-0" : "opacity-100"} ${className}`}
      style={{ transitionTimingFunction: "var(--ease-rogo)" }}
      aria-hidden="true"
    >
      <PlusGlyph />
    </div>
  );
}

function Card({
  id,
  copy,
  playLabel,
  open,
  playing,
  onOpen,
  onPlay,
  videoRef,
}: {
  id: ClipId;
  copy: ClipCopy;
  /** `chrome.a11y.playTestimonial` already interpolated with this clip's name. */
  playLabel: string;
  open: boolean;
  playing: boolean;
  onOpen: () => void;
  onPlay: () => void;
  videoRef: (el: HTMLVideoElement | null) => void;
}) {
  const panelId = `testimonial-${id}-video`;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      /* Padding is the target's `p-8` / `py-8 pr-14 pl-8`, EXCEPT between 810 and 1200
         where it drops to `p-4`. (The target's values are quoted PHYSICALLY here because that
         is what its capture says; the live classes below are the logical equivalents,
         `pe-14 ps-8`, so the 56px of slack sits on the inline END in both directions. `p-8` and
         `p-4` are symmetric and stay as they are.) Five closed cards at that tier are 117px wide, and 32px of
         padding each side leaves 53px — not enough to render a name. The target never hit
         this because it only ever laid three cards in a row, and only above 1200.

         SIX cards as of 2026-08-07, was five. The row must still sum to exactly 100% plus
         the gaps it swallows: 5 closed x 14% + (30% - 60px) + 5 gaps x 12px = 70% + 30% =
         100%. The -60px is what cancels the five gaps, the same trick the five-card version
         used with -48px for four.

         The OPEN card gave up the 6 points (36 -> 30), not the closed ones, because it has
         slack they do not: it holds a 9:16 video that is HEIGHT-bound by the 600px row, so
         it paints ~186px wide inside a 324px card either way. Taking the width off the
         closed cards instead would have cost name legibility, which is the one job a closed
         card has. */
      className={`relative flex cursor-pointer flex-col items-start justify-center gap-6
                  overflow-hidden rounded-[6px] bg-card p-8
                  transition-[width] duration-500
                  focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2
                  focus-visible:ring-offset-canvas focus-visible:outline-none
                  tablet:h-full tablet:justify-between tablet:gap-0 tablet:p-4
                  desktop:py-8 desktop:pe-14 desktop:ps-8
                  ${open ? "tablet:w-[calc(30%-60px)]" : "tablet:w-[14%]"}`}
      style={{ transitionTimingFunction: "var(--ease-rogo)" }}
    >
      {/* Top block — the name, where the target put the customer's logo mark. */}
      <div className="flex w-full flex-col items-start gap-6 desktop:gap-14">
        {/* The target's "Logo wrapper" — a 40px-tall box, contents vertically centred, the
            mark left-aligned inside it. Kept as the box so the card's vertical rhythm is
            unchanged; the person's name now sits in it where the customer's logo did. */}
        <div className="flex w-full flex-row items-center justify-between gap-2">
          {/* `min-h-10`, not the target's fixed `h-10`: at bold 17px a two-word name is
              wider than a closed card's 141px of inner width, so it needs room to wrap to a
              second line. The box still reserves 40px, so single-line names sit exactly
              where the target's marks did. */}
          <div className="flex min-h-10 min-w-0 flex-col items-start justify-center">
            <p
              /* Set to READ as a logo mark rather than as a sentence: uppercase, tracked
                 out, BOLD, muted. That is what the Truist and Nomura marks do optically,
                 and it is the closest a typeface gets to them without being their actual
                 artwork. Weight and size are what carry it — an earlier pass at 11/13px
                 medium had the right shape but read far lighter than the reference marks,
                 which sit around 17px at bold. Tracking eased 0.12 → 0.10em to compensate:
                 bold letterforms need less air between them than medium ones to read as
                 evenly spaced.

                 Colour is ink@60%, NOT the target's 30%. The 30% is right for a decorative
                 logo and was already logged here as a 1.92:1 contrast failure inherited
                 from the capture — but this slot now holds a person's NAME, which is
                 content a visitor has to be able to read. 60% clears AA on `card` and still
                 reads as the muted grey label the design wants. */
              /* `break-words` added 2026-08-07 with the sixth card, and it is load-bearing
                 rather than defensive. Six closed cards are 179px at >=1200 and 102px at
                 810, leaving the name 91px and 70px of box. "Yahaloman" is a NINE-LETTER
                 SINGLE WORD — 113px at 17px, 87px at 13px — and a single word does not
                 wrap, so it was being clipped mid-name by the card's `overflow-hidden`.
                 Measured, not guessed: the sweep reported *** CLIPPED *** on that row at
                 1600, 1440 and 810.

                 Breaking a name across lines is not pretty under a logo-mark treatment. It
                 is still strictly better than truncating one: the reader gets the whole
                 name. Shrinking the type instead does not actually solve it — at the 810
                 tier even 11px still overruns the 70px box — and it would undo the
                 sizing the user asked for. There is vertical room: the card is 600px tall
                 and this block sits at the top of it. */
              className="w-full font-sans text-[13px] font-bold break-words text-ink/60
                         uppercase desktop:text-[17px]"
              style={{ lineHeight: "1.3em", letterSpacing: "0.1em" }}
            >
              {copy.name}
            </p>
          </div>
          <PlusButton open={open} className="flex-none tablet:hidden" />
        </div>

        {/* Collapsible body — the video, where the target put the quote.
            `grid-rows-[0fr] → [1fr]` is the clone's own mechanism and the only way to
            transition to an intrinsic height in CSS. The closed state keeps the capture's
            literal 1px/3px sliver rather than collapsing to zero — Framer's minimums. */}
        <div
          id={panelId}
          className={`grid w-full overflow-hidden transition-[grid-template-rows,opacity]
                      duration-500
                      ${open ? "grid-rows-[1fr] opacity-100" : "min-h-[3px] grid-rows-[0fr] opacity-0 tablet:min-h-px"}`}
          style={{ transitionTimingFunction: "var(--ease-rogo)" }}
        >
          <div className="min-h-0" aria-hidden={!open}>
            {/* Height-driven, not width-driven: the clip is 9:16, so height is the axis
                that actually constrains it inside a 600px card. 330px leaves the name row,
                the 56px gap and the bottom block their space; the 9:16 makes that 186 wide,
                which fits the open card's 325px of inner width. At the tablet tier the open
                card is only 183px inside, hence the smaller step. */}
            <div
              className="relative mx-auto aspect-[9/16] h-[280px] overflow-hidden
                         rounded-[4px] bg-ink-wash tablet:h-[300px] desktop:h-[330px]"
            >
              <video
                ref={videoRef}
                src={`/testimonials/${id}.mp4`}
                poster={`/testimonials/${id}.jpg`}
                preload="none"
                playsInline
                controls={playing}
                tabIndex={open ? 0 : -1}
                className="h-full w-full object-cover"
              />
              {!playing && (
                <button
                  type="button"
                  onClick={(e) => {
                    /* Without this the click bubbles to the card and closes it again. */
                    e.stopPropagation();
                    onPlay();
                  }}
                  tabIndex={open ? 0 : -1}
                  /* The accessible name carries the person, not just "play" — a
                     screen-reader user moving through five of these needs to know which.
                     Interpolated from `chrome.a11y.playTestimonial` rather than assembled from
                     a template literal here: the Hebrew word order is not "Play X's Y", and a
                     concatenation in this file would have hard-coded the English one. The
                     capture of the real site ships this exact aria-label pattern, so the
                     Hebrew string is sourced rather than invented. */
                  aria-label={playLabel}
                  className="group absolute inset-0 flex cursor-pointer items-center
                             justify-center bg-ink/10 transition-colors duration-300
                             hover:bg-ink/20 focus-visible:ring-2 focus-visible:ring-paper
                             focus-visible:outline-none"
                  style={{ transitionTimingFunction: "var(--ease-rogo)" }}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center rounded-full
                               bg-paper/90 backdrop-blur-sm transition-transform duration-300
                               group-hover:scale-110 group-focus-visible:scale-110"
                    style={{ transitionTimingFunction: "var(--ease-rogo)" }}
                  >
                    {/* Nudged 2px right: a triangle centred on its bounding box reads as
                        sitting left of centre in a circle, because its visual mass is
                        toward the flat edge.

                        ⚠️ `ml-[2px]` IS PHYSICAL ON PURPOSE — DO NOT MIGRATE IT TO `ms-`, and do
                        not add `rtl:-scale-x-100` to the glyph. Two separate reasons, both
                        pointing the same way. (1) Play/pause are MEDIA-TRANSPORT glyphs and no
                        platform mirrors them; only skip-forward/back mirror, because only those
                        two mean "the direction reading goes". A left-pointing play button on
                        /he would read as rewind. (2) The nudge is an optical correction tied to
                        the un-mirrored artwork's visual mass, so it has to stay on the same
                        physical side the mass is on. `ms-` would flip it away in RTL and put the
                        triangle 2px further off-centre than doing nothing at all. */}
                    <svg viewBox="0 0 24 24" className="ml-[2px] h-4 w-4 fill-ink">
                      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
                    </svg>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom block — the title alone, and the desktop plus button above it. */}
      <div className="flex w-full flex-col items-start gap-6 desktop:gap-8">
        <PlusButton open={open} className="hidden tablet:flex" />
        {/* ink@60%, not the 40% the cloned card used. That 40% measured 2.50:1 on this
            panel and was carried over from the target as a known inherited failure. This
            content is ours, so there is nothing to be faithful to — 60% clears AA.

            ALWAYS RENDERED, even when there is no role — `elyashiv-engineering` is a
            company rather than a person and carries none. Two wrong ways to handle that,
            both measured rather than reasoned about:

              · omit the <p> — the block is bottom-anchored, so losing a child pulls the
                plus button DOWN ~48px (its own line box plus the gap-6) and it visibly
                sits lower than the other five.
              · render it empty — a zero-height <p> still leaves the gap, so the button is
                ~19px low instead. Better, still wrong.

            So the slot is held open with a non-breaking space, which occupies exactly one
            line box and makes the geometry identical to a one-line role. `aria-hidden` in
            that case so a screen reader is not handed a blank paragraph. */}
        <p
          className="w-full font-sans text-[12px] text-ink/60 tablet:line-clamp-1
                     desktop:text-[16px]"
          style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
          {...(copy.role ? null : { "aria-hidden": true })}
        >
          {copy.role || " "}
        </p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const t = usePageDict("home").testimonials;
  /* `chrome`, not `home` — the play button's accessible-name template is shared with
     /product's testimonial rail, so it lives in the namespace both routes render. */
  const a11y = useChrome().a11y;
  /* THE SWITCH — see the block above `CLIP_IDS`. The carousel appears only once every one of
     its seven strings is non-empty, so a half-finished copy pass can never put a blank quote
     card, or a fabricated one, on the landing page. `.trim()` because a lone space is the
     classic way an empty translation slot gets filled. */
  const hasQuotes = t.slides.every((s) => s.quote.trim() !== "");
  const [openId, setOpenId] = useState<ClipId>(CLIP_IDS[0]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLVideoElement | null>>({});

  /* Closing a card must stop its audio, or a collapsed sliver keeps talking. Runs on openId
     rather than in the click handler so keyboard activation is covered too.
     This effect ONLY touches the video elements — an external system, which is what an
     effect is for. It deliberately does not reset `playingId`: doing so was a setState in an
     effect body, which cascades renders (eslint react-hooks/set-state-in-effect caught it).
     A stale `playingId` pointing at a card that is now closed is harmless, because `playing`
     is DERIVED below and requires the card to be open as well. */
  useEffect(() => {
    for (const [id, el] of Object.entries(refs.current)) {
      if (id !== openId && el && !el.paused) el.pause();
    }
  }, [openId]);

  const play = (id: string) => {
    const el = refs.current[id];
    if (!el) return;
    /* play() rejects on an untrusted gesture or a missing file. Reset rather than leave the
       overlay hidden over a frozen poster. */
    void el
      .play()
      .then(() => setPlayingId(id))
      .catch(() => setPlayingId(null));
  };

  return (
    <section
      data-nav-theme="light"
      id="testimonials"
      /* padding 128/16 phone → 164/40/128 tablet → 196/40/80 desktop+. Unchanged. */
      className="relative flex w-full flex-col items-center justify-center overflow-hidden
                 bg-canvas px-4 py-32
                 tablet:px-10 tablet:pt-[164px]
                 desktop:pt-[196px] desktop:pb-20"
    >
      {/* Width Container — max-w 1280, gap 80. Unchanged. */}
      <div
        className="relative flex w-full max-w-none flex-col items-center gap-20
                   tablet:max-w-[var(--container-max)]"
      >
        <div className="relative w-full max-w-none tablet:max-w-[600px] desktop:w-auto">
          <h2
            className="text-center font-display text-[36px] text-ink
                       tablet:text-[44px] desktop:text-[48px]"
            style={{ lineHeight: "105%", letterSpacing: "-0.05em" }}
          >
            {/* Two spans rather than a hideable <br>, which would weld the words together
                once the break is display:none. The target's own treatment.

                ⚠️ THE SENTENCE IS RENDERED TWICE AND THE TWO COPIES USED TO BE AUTHORED
                SEPARATELY, which is a standing invitation to edit one and forget the other.
                They now come off ONE array (`home.testimonials.heading`): the phone span draws
                a `<br>` between runs, the wide span joins them with a single space. The runs
                carry NO trailing space — the phone tier's break is hard, so a space before it
                would show up in the joined copy as a double. (WhyRogo's headline is the
                opposite case and does carry one; see the note in en/home.ts.)

                THE COUNT IS PER LOCALE, not fixed. English sets two runs. Hebrew sets ONE —
                "בקולם של הלקוחות שלנו" measures 304.8px at 36px against the phone tier's 358px
                measure, so it needs no break at all and this heading is one line shorter than
                English below 810. `heading` is typed `readonly string[]` precisely so that is
                expressible; a tuple would have forced Hebrew to invent a second run. */}
            <span className="tablet:hidden">
              {t.heading.map((run, i) => (
                <Fragment key={i}>
                  {i > 0 && <br />}
                  {run}
                </Fragment>
              ))}
            </span>
            <span className="hidden tablet:inline">{t.heading.join(" ")}</span>
          </h2>
        </div>

        {hasQuotes ? (
          <QuoteCarousel />
        ) : (
          /* The target switched these two layouts at 1200. Ours switches at 810, because the
             user asked for all five visible on narrower screens before asking for the
             accordion back — the horizontal row is what satisfies both. Below 810 a 390 phone
             would put closed cards at 57px, so the stack takes over there.
             Gaps are the target's own: 16 stacked, 12 in the row. */
          <div className="flex w-full flex-col gap-4 tablet:h-[600px] tablet:flex-row tablet:gap-3">
            {CLIP_IDS.map((id) => (
              <Card
                key={id}
                id={id}
                copy={t.clips[id]}
                playLabel={interpolate(a11y.playTestimonial, {
                  name: t.clips[id].name,
                })}
                open={openId === id}
                /* Derived, not stored: a card counts as playing only while it is also the
                   open one. That is what lets the pause effect above skip setState. */
                playing={playingId === id && openId === id}
                onOpen={() => setOpenId(id)}
                onPlay={() => play(id)}
                videoRef={(el) => {
                  refs.current[id] = el;
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
