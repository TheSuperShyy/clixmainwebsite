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

import { useEffect, useRef, useState } from "react";

type Clip = {
  id: string;
  name: string;
  role: string;
};

/* Names and roles are as published on clixsolutions.info, English-rendered.
   ⚠️ `achituv` is the exception — it came from the uploaded filename
   ("Achituv-Vtechezena.MOV") and is NOT on the live site, so the role below is a reading of
   that filename, not a sourced fact. Confirm before this ships. */
const CLIPS: Clip[] = [
  { id: "asaf-peretz", name: "Asaf Peretz", role: "Founder, SalesIQ" },
  { id: "adir-peretz", name: "Adir Peretz", role: "Owner, video & photography studio" },
  { id: "nevo-yahaloman", name: "Nevo Yahaloman", role: "Founder" },
  { id: "noam-tovi", name: "Noam Tovi", role: "Owner, investments" },
  { id: "achituv", name: "Achituv", role: "Vtechezena" },
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
  clip,
  open,
  playing,
  onOpen,
  onPlay,
  videoRef,
}: {
  clip: Clip;
  open: boolean;
  playing: boolean;
  onOpen: () => void;
  onPlay: () => void;
  videoRef: (el: HTMLVideoElement | null) => void;
}) {
  const panelId = `testimonial-${clip.id}-video`;

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
         where it drops to `p-4`. Five closed cards at that tier are 117px wide, and 32px of
         padding each side leaves 53px — not enough to render a name. The target never hit
         this because it only ever laid three cards in a row, and only above 1200. */
      className={`relative flex cursor-pointer flex-col items-start justify-center gap-6
                  overflow-hidden rounded-[6px] bg-card p-8
                  transition-[width] duration-500
                  focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2
                  focus-visible:ring-offset-canvas focus-visible:outline-none
                  tablet:h-full tablet:justify-between tablet:gap-0 tablet:p-4
                  desktop:py-8 desktop:pr-14 desktop:pl-8
                  ${open ? "tablet:w-[calc(36%-48px)]" : "tablet:w-[16%]"}`}
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
              className="w-full font-sans text-[13px] font-bold text-ink/60 uppercase
                         desktop:text-[17px]"
              style={{ lineHeight: "1.3em", letterSpacing: "0.1em" }}
            >
              {clip.name}
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
                src={`/testimonials/${clip.id}.mp4`}
                poster={`/testimonials/${clip.id}.jpg`}
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
                     screen-reader user moving through five of these needs to know which. */
                  aria-label={`Play ${clip.name}’s testimonial`}
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
                        toward the flat edge. */}
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
            content is ours, so there is nothing to be faithful to — 60% clears AA. */}
        <p
          className="w-full font-sans text-[12px] text-ink/60 tablet:line-clamp-1
                     desktop:text-[16px]"
          style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
        >
          {clip.role}
        </p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [openId, setOpenId] = useState(CLIPS[0].id);
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
                once the break is display:none. The target's own treatment. */}
            <span className="tablet:hidden">
              In our clients&rsquo;
              <br />
              own words
            </span>
            <span className="hidden tablet:inline">In our clients&rsquo; own words</span>
          </h2>
        </div>

        {/* The target switched these two layouts at 1200. Ours switches at 810, because the
            user asked for all five visible on narrower screens before asking for the
            accordion back — the horizontal row is what satisfies both. Below 810 a 390 phone
            would put closed cards at 57px, so the stack takes over there.
            Gaps are the target's own: 16 stacked, 12 in the row. */}
        <div className="flex w-full flex-col gap-4 tablet:h-[600px] tablet:flex-row tablet:gap-3">
          {CLIPS.map((clip) => (
            <Card
              key={clip.id}
              clip={clip}
              open={openId === clip.id}
              /* Derived, not stored: a card counts as playing only while it is also the
                 open one. That is what lets the pause effect above skip setState. */
              playing={playingId === clip.id && openId === clip.id}
              onOpen={() => setOpenId(clip.id)}
              onPlay={() => play(clip.id)}
              videoRef={(el) => {
                refs.current[clip.id] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
