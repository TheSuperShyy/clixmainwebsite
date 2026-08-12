"use client";

/**
 * ProductTestimonials — clone of rogo.com/product's `Testimonials` block, Block 6.
 * Capture offset 401160, live class `.framer-h211wl`.
 *
 * Capture: docs/reference/target/rogo-product-2026-08-11.html (+ .css).
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md
 *
 * ⚠️⚠️  THE THREE QUOTES BELOW ARE PLACEHOLDERS ATTRIBUTED TO REAL, NAMED CLIENTS.  ⚠️⚠️
 *
 * Superseded 2026-08-12. This block used to carry Patrice Maffre (Nomura), Pieter Taselaar
 * (Lucerne Capital) and Sean Warneke (Schonfeld) verbatim from the capture, with their
 * headshots and Nomura's mark. All six of those things are gone. What stands here now is
 * clix's own clients, from public/testimonials/, and it is safer but it is NOT yet safe:
 *
 *   THE PEOPLE ARE REAL. THE PHOTOGRAPHS ARE REAL. THE WORDS ARE NOT THEIRS.
 *
 * clix holds no written testimonial from anybody. Every endorsement it has exists on video
 * only, and no quotable sentence with a name attached exists anywhere, so the strings below
 * are scaffolding written to sit at roughly the length a real quote will occupy.
 *
 * WHY THEY LOOK THE WAY THEY DO, AND WHY THAT MUST SURVIVE ANY COPY PASS. Each string opens
 * with a bracketed all caps tag naming the client it is NOT quoting, then talks about that
 * client in the THIRD PERSON. A real endorsement is first person, so the grammar alone
 * breaks the illusion before the reader reaches the second word, and the tag breaks it
 * before the first. The strings are also unquoted: the original wrapped every quote in
 * straight double quotes, and quotation marks are the visual cue that says "somebody said
 * this", which is the one thing these must never say.
 *
 * Plausible marketing prose here would be worse than obvious filler. That is not a guess, it
 * is the failure already logged in src/components/clix/ClixTestimonial.tsx: placeholder text
 * that got renamed into fabricated endorsements and stopped reading as unfinished. Lorem
 * ipsum would be worse too, in the other direction, because it reads as broken rather than
 * as awaiting a real quote.
 *
 * THE ROUTE MUST STAY `robots: { index: false, follow: false }` UNTIL THIS IS CLEARED.
 * It is set in src/app/product/page.tsx. Clearing it takes all four of these, not some:
 *
 *   1. get a written sentence from each named client, in their own words, or their written
 *      approval to transcribe one from their video
 *   2. replace every string tagged `[PLACEHOLDER QUOTE ...]` below, on the desktop SLIDES
 *      and on the PHONE_CARDS, which carry their own copy at ≤809
 *   3. recheck `quoteDesktop` per slide. It is a per quote font size fitted to that quote's
 *      character count, and real copy will not be the length of this filler
 *   4. delete this warning block. Only then may the robots block come off the route.
 *
 * Until step 4, treat this section as unlaunched. It is not merely unfinished: it puts words
 * next to a real person's face.
 *
 * NO CLIENT LOGOS, AND NOT BY OMISSION. The original ran Nomura's mark above its first
 * quote. clix has no client logos and the user's boss has ruled them out, so the `logo`
 * field, the `CompanyMark` component and the flex row that held it are deleted rather than
 * left empty. Nothing was substituted in. Do not reintroduce the slot without that decision
 * changing.
 *
 * THE ORIGINAL SHIPS THREE SUBTREES; THIS SHIPS TWO, AND THE COLLAPSE IS DELIBERATE.
 *
 * | tier      | original                                  | here |
 * |-----------|-------------------------------------------|------|
 * | ≥1200     | `Desktop` slideshow: 3 slides WITH photos  | the slideshow, photo column visible |
 * | 810–1199  | `Mobile` slideshow: same 3 slides, NO photos | the same slideshow, photo column `hidden` |
 * | ≤809      | `Testimonials (Mobile)`: a static stack of **two** cards, no arrows, different copy | its own markup |
 *
 * The first two are one component with one hidden column and two quote sizes — verified
 * identical, so duplicating the subtree would only duplicate the DOM. The third is NOT a
 * responsive variant of the other two and cannot be collapsed into them:
 *   · two testimonials, not three. The third slot (Sean Warneke there, Nevo Yahaloman here)
 *     is absent below 810.
 *   · slot 1's quote is **different copy** at this width, not a truncation but a different
 *     sentence: "Rogo is going to transform" there versus "Rogo transforms" above 810. The
 *     placeholders keep the quirk structurally, so it survives the real copy landing.
 *     PHONE_CARDS[0] carries its own string; PHONE_CARDS[1] reuses slide 2's, which is what
 *     the original does too.
 *   · slot 1 is FIRST on phones (`order:0`) and second in the DOM everywhere else
 *   · no photos, no arrows, and its own paddings (24 / `32 24 24 24`) and gaps (20 / 80)
 *
 * MOTION IS MEASURED, NOT GUESSED — AND THE CAPTURE WOULD HAVE LIED ABOUT ALL OF IT.
 * Framer drives the slideshow in JS, so the frozen HTML shows three slides, `gap:8px`, and
 * both arrows `disabled` with `opacity:0`. Sampling the LIVE page's track transform every
 * 250ms for 23s says otherwise:
 *
 *   · it AUTOPLAYS — the track advances one step every **6.0s** (starts at t = 4.70, 10.70,
 *     16.64, 22.63s), with no click involved. ⚠️ **We deliberately do NOT** — removed on
 *     the user's call, 2026-08-11. The measurement stands; the behaviour is a documented
 *     divergence, not a gap. See the note above `STEP_MS`.
 *   · it LOOPS — the real DOM holds **12** slides, 3 originals plus clones, and at
 *     t = 17.68s the track jumped −7725.6 → −3864.0 in a single frame with no intermediate
 *     sample. That instant jump is the clone snap.
 *   · therefore **neither arrow is ever disabled** — both read `disabled=false, opacity:1`
 *     at every sample. The `disabled` in the capture is the pre-hydration state only.
 *   · a step is **1288px** = the 1280 container + the 8px gap, over **~1.1s**, strongly
 *     ease-out: 46% of the distance inside the first 250ms, 92% by ~520ms, then a long
 *     settle. That is a spring; `cubic-bezier(.25,1,.5,1)` is a FITTED stand-in for it, the
 *     one number here that is an approximation rather than a reading.
 *
 * **A method note worth keeping:** the first probe clicked "Previous" and read the track 1.8s
 * later, and concluded a click moves *two* slides. It had not — autoplay fired during the
 * 1.8s wait. Check for autoplay BEFORE measuring any click.
 *
 * IT IS ALSO DRAGGABLE, and the drag does NOT behave like a normal snapping carousel.
 * Reported by the user, then measured with synthesised pointer drags on the live page:
 *
 *   · the track carries `cursor: grab`, `touch-action: pan-y`, `user-select: none`
 *   · it follows the pointer **1:1** — a 150px drag moves the track exactly 150px, no
 *     rubber-banding, no damping
 *   · **there is no snap-back.** Release after a slow drag and the track STAYS where you
 *     left it, mid-slide. Held-still releases at 40 / 100 / 160 / 220 / 280 / 340px all
 *     settled at exactly the dragged distance and none of them changed slide.
 *   · **a flick commits one slide.** The same 160px, dragged fast and released while still
 *     moving, settled at exactly 1288px — one clean step. So the commit is driven by
 *     velocity at release, not by distance: 340px released stationary does nothing, 160px
 *     flicked advances.
 *   · **the grid is restored by the next index change, not by the release.** After every
 *     off-grid drag the following autoplay tick moved an odd distance (1288−60, 1288−340)
 *     that landed the track back on an exact multiple. Autoplay and the arrows target an
 *     INDEX; whatever drag offset is outstanding is absorbed when they do. ⚠️ With autoplay
 *     removed, **the arrows and a committed flick are the only things left that re-align**,
 *     so a slow drag can rest off-grid until one of those happens — which is what the
 *     original does too, between ticks.
 *
 * The commit rule below (`|dx + v × 0.15| > 30% of a slide`) is **fitted to those three
 * observations**, not read off the page — it is the only way to reproduce all of
 * "340 held → nothing", "160 flicked → one slide", "60 flicked → nothing" with one formula.
 */

import { useCallback, useEffect, useRef, useState } from "react";

/* ---- Content ----------------------------------------------------------------------------
 * The PEOPLE, their roles and their photo ids are clix's own, taken from the `CLIPS` array in
 * src/components/sections/Testimonials.tsx so that a client reads identically on both pages.
 * Change one, change the other.
 *
 * THE QUOTES ARE PLACEHOLDERS. Read the warning at the top of this file before touching them.
 *
 * WHICH THREE OF THE SIX, AND WHY. The desktop tier renders a 360px PORTRAIT beside each
 * quote and derives its `alt` from `${name}, ${role}`, so a slide needs both a person and a
 * sourced role. That rules out two of the six on facts already recorded in that file:
 * `elyashiv-engineering` is a COMPANY, not a person, carries no role at all, and its speaker
 * is unidentified even to us; `achituv`'s role was read off an uploaded filename and is
 * flagged there as unsourced. Putting either behind a face and a job title on a marketing
 * page would be inventing the very thing this file exists to stop inventing. So the three
 * slides are the three best sourced people, in the order the section already lists them.
 *
 * LENGTHS ARE MATCHED ON PURPOSE, AND THE COUNTS ARE MEASURED, NOT ESTIMATED. `quoteDesktop`
 * is fitted per slide to that quote's character count, so a placeholder of the wrong length
 * would make the fitted size look wrong and send someone chasing a bug that is not there.
 * Counted with the surrounding quote marks the original carried, new versus original:
 *
 *   slide 1  288 / 288      slide 2  157 / 150      slide 3  156 / 163
 *   phone 1  284 / 299      phone 2  reuses slide 2
 *
 * Every one is within 7 characters except phone card 1 at 15 short, and that card is a fixed
 * `h-[505px]` box, so nothing reflows. No `quoteDesktop` value needed changing.
 */

type Slide = {
  id: string;
  quote: string;
  name: string;
  role: string;
  photo: string;
  /** Cream `bone` or `surface`. The original alternates; it is not derived from position. */
  cream: boolean;
  /** Quote size at ≥1200. The original's first card is 32px and the other two are 36px; all
      three are 28px from 810 to 1199. A per-slide value in the original, so a per-slide value
      here. It is sized to the quote's length, so it is step 3 of the checklist above. */
  quoteDesktop: string;
};

/* ALL SIX CLIENTS, 2026-08-12, on the user's call. rogo's slideshow carried three; clix has
   six and `sections/Testimonials.tsx` already shows all of them, so showing three here read as
   a bug. Order matches that file's `CLIPS` exactly, so the two pages never disagree.

   The carousel took this without changes: `N` is `SLIDES.length`, `LOOP` is three copies of
   `SLIDES`, and the normalisation snap is modulo `N`, so slide count was already a variable.
   Only the alternation and the sizes below are hand-set.

   NO PRONOUNS in any placeholder. Two of the six are people whose pronouns nobody here has
   been told, and one is a company. Naming the client and writing around the pronoun costs
   nothing and cannot misgender anyone. */
const ADIR_PLACEHOLDER =
  "[PLACEHOLDER QUOTE, NOT SOMETHING ADIR PERETZ SAID] No approved wording exists for this " +
  "client yet. This filler runs to about the length the real one should.";

const SLIDES: Slide[] = [
  {
    id: "asaf-peretz",
    quote:
      "[PLACEHOLDER QUOTE, NOT SOMETHING ASAF PERETZ SAID] clix holds no written testimonial " +
      "from this client and no wording has been approved. This paragraph is scaffolding, set " +
      "at roughly the length a real quote will run, and it is here to be deleted the moment " +
      "an approved sentence replaces it.",
    name: "Asaf Peretz",
    role: "Founder, SalesIQ",
    photo: "/testimonials/asaf-peretz.jpg",
    cream: true,
    quoteDesktop: "desktop:text-[32px]",
  },
  {
    id: "adir-peretz",
    quote: ADIR_PLACEHOLDER,
    name: "Adir Peretz",
    role: "Owner, video and photography studio",
    photo: "/testimonials/adir-peretz.jpg",
    cream: false,
    quoteDesktop: "desktop:text-[36px]",
  },
  {
    id: "nevo-yahaloman",
    quote:
      "[PLACEHOLDER QUOTE, NOT SOMETHING NEVO YAHALOMAN SAID] Nothing on this card was said " +
      "by this client. The words are layout scaffolding and must be replaced before launch.",
    name: "Nevo Yahaloman",
    role: "Founder",
    photo: "/testimonials/nevo-yahaloman.jpg",
    cream: true,
    quoteDesktop: "desktop:text-[36px]",
  },
  /* ⚠️ THIS PHOTOGRAPH MAY NOT BE THIS PERSON, AND THAT IS UNRESOLVED.
     `public/testimonials/noam-tovi.jpg` is a still from the client's video, and the video's
     own burned-in caption reads "אני נווה דוידי", transliterating to Nave Davidi, while this
     repo labels the same file "Noam Tovi, Owner, investments" (sections/Testimonials.tsx:63).
     Two different names; nothing here can say which is right. The pairing is NOT introduced by
     this page, it already ships on the home page, so excluding it here would hide the problem
     rather than fix it. Kept, flagged, and gated behind noindex.
     RESOLVE THE LABEL WITH THE CLIENT before either page is indexed. */
  {
    id: "noam-tovi",
    quote:
      "[PLACEHOLDER QUOTE, NOT SOMETHING NOAM TOVI SAID] Placeholder text standing in for a " +
      "sentence this client has never been asked for. Replace before launch.",
    name: "Noam Tovi",
    role: "Owner, investments",
    photo: "/testimonials/noam-tovi.jpg",
    cream: false,
    quoteDesktop: "desktop:text-[36px]",
  },
  /* `achituv`'s role is recorded in sections/Testimonials.tsx as READ OFF AN UPLOADED
     FILENAME, not given by the user, and flagged there as unsourced. Carried verbatim rather
     than improved, so the uncertainty stays visible in one place instead of being laundered
     into a second file that looks authoritative. */
  {
    id: "achituv",
    quote:
      "[PLACEHOLDER QUOTE, NOT SOMETHING ACHITUV SAID] Placeholder text standing in for a " +
      "sentence this client has never been asked for. Replace before launch.",
    name: "Achituv",
    role: "Vtechezena",
    photo: "/testimonials/achituv.jpg",
    cream: true,
    quoteDesktop: "desktop:text-[36px]",
  },
  /* A COMPANY, not a person, which is why `role` is empty rather than an invented job title.
     The speaker in the video is not identified anywhere in this repo. `CardBody` holds the
     role line open with a non-breaking space so this card matches the others' height. */
  {
    id: "elyashiv-engineering",
    quote:
      "[PLACEHOLDER QUOTE, NOT SOMETHING ELYASHIV ENGINEERING SAID] Placeholder text standing " +
      "in for a sentence this client has never been asked for. Replace before launch.",
    name: "Elyashiv Engineering",
    role: "",
    photo: "/testimonials/elyashiv-engineering.jpg",
    cream: false,
    quoteDesktop: "desktop:text-[36px]",
  },
];

/** ≤809 only. A static stack, no arrows, and slot 1's quote is not the one above.
 *
 *  ⚠️ SIX CARDS NOW, AND THAT IS A DELIBERATE DEPARTURE FROM THE CAPTURE. The original ships
 *  exactly TWO here against three slides above, an editorial cut rather than a truncation, and
 *  that asymmetry was reproduced faithfully until 2026-08-12. It stops making sense once the
 *  page carries clix's own six: a phone reader seeing two of six, with no arrows and no
 *  affordance suggesting more exist, reads it as the list. Desktop and phone now show the same
 *  clients in the same order.
 *
 *  The cost is scroll length: six stacked cards run roughly 2100px on a phone. If that proves
 *  too long, cut the TAIL of this array rather than reordering, so the two tiers keep agreeing
 *  on who comes first.
 *
 *  Card 1 keeps its own longer string, and card 2 still shares slide 2's, both as the original
 *  does. Cards 3 to 6 reuse their slides' strings for the same reason: one string to replace
 *  per client when the real wording lands. */
const PHONE_CARDS = [
  {
    id: "asaf-peretz",
    quote:
      "[PLACEHOLDER QUOTE, NOT SOMETHING ASAF PERETZ SAID] This is the phone card's own " +
      "string, kept separate because the original ships different copy at this width. It is " +
      "not a shortened version of the slide above, and it is not this client's wording " +
      "either. Replace both before this route is indexed.",
    name: "Asaf Peretz",
    role: "Founder, SalesIQ",
    cream: true,
    /* Measured heights, not derived: 505 and 334. */
    box: "h-[505px]",
    /* `--u1dxzv` / `--50mq1o`. The two cards do not share either value. */
    pad: "pt-8 pr-6 pb-6 pl-6",
    gap: "gap-20",
  },
  {
    id: "adir-peretz",
    /* The original repeats slide 2's quote here character for character. Referenced rather
       than retyped so the two cannot drift apart when the real sentence lands: whoever
       replaces it replaces one string and both tiers move together. If the real copy ever
       needs to differ at this width, inline it here, the way card 1 above already does. */
    quote: ADIR_PLACEHOLDER,
    name: "Adir Peretz",
    /* The original's phone copy sets this string in capitals AND applies
       `text-transform:uppercase`, so it renders the same as the sentence-case one above.
       Kept sentence-case here: identical output, one less thing to keep in step. */
    role: "Owner, video and photography studio",
    cream: false,
    box: "h-[334px]",
    pad: "p-6",
    gap: "gap-5",
  },
  /* Cards 3 to 6 take card 2's measured shape (334 / p-6 / gap-5), not card 1's. Card 1 is the
     one-off: it is 505px because the original's lead card carries a longer quote and its own
     padding and gap. These four carry short placeholders, so the shorter box is the right
     parent. Re-measure if the real quotes come back long. `cream` continues the alternation
     from the slides above so the two tiers stripe identically. */
  {
    id: "nevo-yahaloman",
    quote: SLIDES[2].quote,
    name: "Nevo Yahaloman",
    role: "Founder",
    cream: true,
    box: "h-[334px]",
    pad: "p-6",
    gap: "gap-5",
  },
  {
    id: "noam-tovi",
    quote: SLIDES[3].quote,
    name: "Noam Tovi",
    role: "Owner, investments",
    cream: false,
    box: "h-[334px]",
    pad: "p-6",
    gap: "gap-5",
  },
  {
    id: "achituv",
    quote: SLIDES[4].quote,
    name: "Achituv",
    role: "Vtechezena",
    cream: true,
    box: "h-[334px]",
    pad: "p-6",
    gap: "gap-5",
  },
  {
    id: "elyashiv-engineering",
    quote: SLIDES[5].quote,
    name: "Elyashiv Engineering",
    role: "",
    cream: false,
    box: "h-[334px]",
    pad: "p-6",
    gap: "gap-5",
  },
];

/* ---- Card internals, shared by all three tiers ---------------------------------------- */

/* The original's `CompanyMark` (a 200 × 20 box at 70% opacity holding Nomura's 121 × 22 SVG,
   `contain`, pinned left top) lived here and was deleted 2026-08-12 with the `logo` field.
   See the "NO CLIENT LOGOS" note at the top: clix has none and they are ruled out, so the
   slot is gone rather than empty. */

function CardBody({
  quote,
  name,
  role,
  quoteSize,
}: {
  quote: string;
  name: string;
  role: string;
  quoteSize: string;
}) {
  return (
    <>
      {/* `.framer-p8w8fr` grows to fill the card. Its `gap-7` was the 28px between the company
          mark and the quote and is now inert, the quote being this box's only child. Kept
          because `flex-1` here is what holds the author block to the bottom of the card, and
          because it is where a second element would go if one is ever added. */}
      <div className="relative flex w-full flex-1 flex-col items-start justify-start gap-7">
        {/* Quote. `letter-spacing: 0` is the original's and is the reason this does not use
            any of the page's other type steps — every one of them is negative. */}
        <blockquote
          className={`w-full font-sans leading-[1.3em] tracking-normal text-ink ${quoteSize}`}
        >
          {quote}
        </blockquote>
      </div>

      {/* `.framer-51h5ng` → `.framer-1h8s99a` — gap 24 outside, gap 4 between the two lines. */}
      <div className="relative flex w-full flex-none flex-col items-start gap-6">
        <div className="relative flex w-full flex-col items-start gap-1">
          <p className="w-full font-sans text-[16px] leading-[130%] tracking-[-0.02em] text-ink desktop:text-[18px]">
            {name}
          </p>
          {/* Rooftop Mono in the original; Discovery here under the one-face decision of
              2026-08-08, same as every other borrowed face on this page. 1.4em and the
              uppercase transform are the original's.

              ALWAYS RENDERED, even with no role. `elyashiv-engineering` is a COMPANY, not a
              person, so it is the one entry with an empty role rather than an invented job
              title. The non-breaking space holds the line box open so its card stays the same
              height as a one-line role, and `aria-hidden` keeps a screen reader from
              announcing the filler. Same treatment as sections/Testimonials.tsx:299. */}
          <p
            className="w-full font-sans text-[14px] leading-[1.4em] tracking-normal text-muted uppercase"
            {...(role ? null : { "aria-hidden": true })}
          >
            {role || " "}
          </p>
        </div>
      </div>
    </>
  );
}

/* ---- Arrows ----------------------------------------------------------------------------
 * Vendored as `v6qQ5IM….svg` / `ar5BrAOD….svg` in the capture; inlined because they are two
 * paths each and need a `disabled` state the original's flat images cannot express.
 * The pill is `#F5F5F4` there and `surface` `#F5F5F5` here — one step of blue, deliberate:
 * a whole token for a 1/255 difference on two 40px circles is noise. Logged in FEATURE.md.
 */
function Arrow({ back }: { back: boolean }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className="h-10 w-10">
      <rect
        width="40"
        height="40"
        rx="20"
        className="fill-surface"
        transform={back ? "matrix(-1 0 0 1 40 0)" : undefined}
      />
      <g
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        {back ? (
          <>
            <path d="M18.215 14.098 12.5 19.813l5.715 5.715" strokeLinejoin="bevel" />
            <path d="M19.274 19.813h9.135" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <path d="m21.785 14.098 5.715 5.715-5.715 5.715" strokeLinejoin="bevel" />
            <path d="M20.726 19.813H11.59" strokeLinejoin="round" />
          </>
        )}
      </g>
    </svg>
  );
}

/* Measured on the live page — see the header note. STEP_MS is the only fitted value. */
/* ⚠️ NO AUTOPLAY — REMOVED ON THE USER'S CALL, 2026-08-11, AND THIS IS A DEVIATION.
   The original DOES autoplay, every 6.0s; that is measured, not assumed (ticks start at
   t = 4.70, 10.70, 16.64, 22.63s on the live page). It is off here because the user asked
   for it off. If it ever needs restoring, it was an interval calling `go(1)` keyed on
   `[still, go]` — deliberately not on `pos`, so the clone snap could not drift the cadence
   — and it skipped a tick while `gesture.current` was set, so it never yanked the track out
   from under a finger. Everything else about the block stays as measured. */
const STEP_MS = 1100;
/* Drag commit — fitted, see the header note. `dx` is the pointer travel, `v` the release
   velocity in px/s; a slide is the track's own width. */
const FLICK_PROJECTION_S = 0.15;
const COMMIT_FRACTION = 0.3;
/* A pointer that has not moved for this long is stationary, whatever it was doing before. */
const IDLE_MS = 80;
/* Velocity is measured over this trailing window, not over the last event pair. */
const VELOCITY_WINDOW_MS = 100;
const N = SLIDES.length;
/* Three copies, so a step off either end of the middle copy still lands on a real slide and
   can be snapped back invisibly. The original ships four copies; three is the minimum that
   behaves identically for a ±1 step. */
const LOOP = [...SLIDES, ...SLIDES, ...SLIDES];

export default function ProductTestimonials() {
  /* Start on the middle copy, so the first "Previous" has somewhere to go. */
  const [pos, setPos] = useState(N);
  const [animate, setAnimate] = useState(true);
  const [still, setStill] = useState(false);
  /* Outstanding drag offset in px, carried ON TOP of the index transform. It survives the
     release — the original does not snap back — and is cleared by the next index change,
     which is what re-aligns the track to the grid. */
  const [drag, setDrag] = useState(0);
  const [grabbing, setGrabbing] = useState(false);
  /* `samples` is a short trailing window of pointer positions, not just the last pair.
     Velocity from a single pair is wrong twice over: browsers coalesce moves (so two events
     can share a timestamp and divide by zero), and one 8ms sample is far too noisy to
     decide a gesture on. */
  const gesture = useRef<{ startX: number; lastT: number; samples: { x: number; t: number }[] } | null>(null);
  const viewport = useRef<HTMLDivElement>(null);

  /* Every index change clears the drag offset — arrows, autoplay and a committed flick all
     go through here, which is exactly how the original re-aligns. */
  const go = useCallback((delta: number) => {
    setPos((p) => p + delta);
    setDrag(0);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { startX: e.clientX, lastT: e.timeStamp, samples: [{ x: e.clientX, t: e.timeStamp }] };
    setGrabbing(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g) return;
    g.samples.push({ x: e.clientX, t: e.timeStamp });
    while (g.samples.length > 2 && e.timeStamp - g.samples[0].t > VELOCITY_WINDOW_MS) g.samples.shift();
    g.lastT = e.timeStamp;
    setDrag(e.clientX - g.startX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g) return;
    gesture.current = null;
    setGrabbing(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    const dx = e.clientX - g.startX;
    const width = viewport.current?.clientWidth ?? 0;
    /* Velocity goes STALE the moment the pointer stops. Without this, a drag that is held
       still for half a second before release still carries the last move's velocity and
       commits like a flick — which is exactly the behaviour the original does NOT have
       (340px held changes nothing there; 160px flicked advances). */
    const idle = e.timeStamp - g.lastT;
    const first = g.samples[0], lastS = g.samples[g.samples.length - 1];
    const span = lastS.t - first.t;
    const v = idle > IDLE_MS || span <= 0 ? 0 : ((lastS.x - first.x) / span) * 1000;
    const projected = dx + v * FLICK_PROJECTION_S;
    if (width && Math.abs(projected) > width * COMMIT_FRACTION) go(projected < 0 ? 1 : -1);
    /* Otherwise leave `drag` exactly where the pointer left it — no snap-back. */
  };

  /* `prefers-reduced-motion` kills both the autoplay and the slide transition; the arrows
     keep working and jump straight to the next quote. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* The snap. Once a step has carried the track outside the middle copy, wait for the
     transition to finish, then re-enter the middle copy with animation OFF — same slide on
     screen, different index, no visible movement. */
  useEffect(() => {
    if (pos >= N && pos < 2 * N) return;
    const t = setTimeout(
      () => {
        setAnimate(false);
        setPos((p) => (((p % N) + N) % N) + N);
      },
      still ? 0 : STEP_MS,
    );
    return () => clearTimeout(t);
  }, [pos, still]);

  /* Re-arm the transition one frame after the snap, never in the same frame — same frame
     and the browser coalesces both style changes and animates the snap. */
  useEffect(() => {
    if (animate) return;
    const r = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(r);
  }, [animate]);

  return (
    <section
      id="testimonials"
      data-nav-theme="light"
      /* `order-1` — see the note in ProductSecurity.tsx: below 1200 this block sits ABOVE
         security, above 1200 below it. */
      className="order-1 relative flex w-full flex-col items-center justify-start gap-10 overflow-hidden bg-paper px-4 pb-24 tablet:px-10 tablet:pt-[124px] desktop:order-none"
    >
      {/* `.framer-zrtsd2` — max-w 1280, gap 40. Only one of its two children is ever laid
          out, so the gap is inert; kept because the original's nesting is what sets the
          slideshow's width. */}
      <div className="relative flex w-full max-w-[var(--container-max)] flex-col items-center gap-10">
        {/* ---- ≥810: the slideshow. 694px tall at both tiers, full container width. ---- */}
        <div className="relative hidden h-[694px] w-full tablet:block">
          {/* The arrows live 40px ABOVE the box, flush to its right edge — the original
              pins them `top:-80px; right:0` inside a box whose own overflow is visible, so
              they sit in the section's 124px top padding. */}
          <fieldset
            aria-label="Slideshow pagination controls"
            className="absolute -top-20 right-0 m-0 flex flex-row items-center gap-3 border-0 p-0"
          >
            {/* Never disabled — it loops. Measured, not assumed: both arrows report
                `disabled=false, opacity:1` at every sample of the live page. */}
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(-1)}
              className="block cursor-pointer overflow-hidden rounded-full text-ink transition-opacity duration-300 ease-[var(--ease-rogo)] hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ink focus-visible:outline-none"
            >
              <Arrow back />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(1)}
              className="block cursor-pointer overflow-hidden rounded-full text-ink transition-opacity duration-300 ease-[var(--ease-rogo)] hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ink focus-visible:outline-none"
            >
              <Arrow back={false} />
            </button>
          </fieldset>

          {/* The viewport. Only this clips — the arrows above are outside it. It is also the
              drag surface: `touch-action: pan-y` so a vertical swipe still scrolls the page,
              and `select-none` because the original sets `user-select: none` on its track. */}
          <div
            ref={viewport}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={`absolute inset-0 touch-pan-y overflow-hidden select-none ${
              grabbing ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {/* The track. 8px between slides, so a step is `100% + 8px` = 1288px at 1440 —
                which is exactly the step the live page moves. */}
            <ul
              className="m-0 flex h-full w-full list-none flex-row items-center gap-2 p-0"
              style={{
                transform: `translateX(calc(${-pos} * (100% + 8px) + ${drag}px))`,
                /* No transition while a finger is down — the track tracks the pointer 1:1. */
                transition:
                  animate && !still && !grabbing
                    ? `transform ${STEP_MS}ms cubic-bezier(.25,1,.5,1)`
                    : "none",
              }}
            >
              {LOOP.map((s, i) => (
                <li
                  key={`${s.id}-${i}`}
                  aria-hidden={i !== pos}
                  className="flex h-full w-full flex-none flex-row items-center gap-4"
                >
                  {/* The card. `justify-center` with a `flex-1` body is what holds the
                      author block to the bottom without a spacer. */}
                  <div
                    className={`relative flex h-full w-px flex-1 flex-col items-start justify-center gap-20 overflow-hidden p-12 ${
                      s.cream ? "bg-bone" : "bg-surface"
                    }`}
                  >
                    <CardBody
                      quote={s.quote}
                      name={s.name}
                      role={s.role}
                      quoteSize={`text-[28px] ${s.quoteDesktop}`}
                    />
                  </div>
                  {/* The portrait: 360px wide, full height. Hidden below 1200 — that is the
                      whole difference between the original's `Desktop` and `Mobile`
                      slideshow variants.

                      ⚠️ `object-position` is CENTRE, not left. The capture's inline style
                      says `object-position:left center`; the hydrated component computes
                      `50% 50%`, and centre is what the live page shows. Reading the capture
                      alone gets this wrong, and it is visible — the crop lands on a
                      different part of the frame. That matters more here than it did with the
                      capture's studio headshots: these three files are POSTER FRAMES pulled
                      from the clients' testimonial videos, framed for a 9:16 phone clip, not
                      portraits shot for a 360 × 694 slot. */}
                  <div className="relative hidden h-full w-[360px] flex-none desktop:block">
                    {/* No `width`/`height` attributes, deliberately. The capture's three
                        headshots shared one intrinsic size (781 × 1024) and could state it;
                        ours do not (720 × 1014 for asaf, 720 × 1272 for the other two), so a
                        single pair would be false for at least one of them. Nothing is lost:
                        the box above fixes BOTH axes in CSS, so the intrinsic ratio can cause
                        no layout shift and the attributes would only be wrong metadata. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.photo}
                      alt={`${s.name}, ${s.role}`}
                      /* Without this the browser's own image-drag ghost hijacks the
                         gesture and the carousel never sees the pointer move. */
                      draggable={false}
                      className="block h-full w-full object-cover object-center"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---- ≤809: two static cards, Patrice first, no arrows. ---- */}
        <div className="relative flex w-full flex-col items-center gap-6 overflow-hidden tablet:hidden">
          {PHONE_CARDS.map((c) => (
            <div
              key={c.id}
              className={`relative flex w-full flex-col items-start justify-center overflow-hidden ${c.box} ${c.pad} ${c.gap} ${
                c.cream ? "bg-bone" : "bg-surface"
              }`}
            >
              <CardBody
                quote={c.quote}
                name={c.name}
                role={c.role}
                quoteSize="text-[20px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
