"use client";

/**
 * ProductTestimonials — clone of rogo.com/product's `Testimonials` block, Block 6.
 * Capture offset 401160, live class `.framer-h211wl`.
 *
 * Capture: docs/reference/target/rogo-product-2026-08-11.html (+ .css).
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md
 *
 * ⚠️ THREE NAMED, PHOTOGRAPHED REAL PEOPLE AT REAL FIRMS — Patrice Maffre (Nomura), Pieter
 * Taselaar (Lucerne Capital), Sean Warneke (Schonfeld) — with their quotes and headshots,
 * plus Nomura's mark. This is the strongest claim on the page: it is not a borrowed
 * trademark, it is an endorsement attributed to an identifiable person who has never heard
 * of clix. It ships verbatim only as a build-time scaffold behind the route's
 * `robots: { index: false, follow: false }`, on the user's explicit call.
 * **Replace all three before this route is indexed — the repo's own testimonial people are
 * in public/testimonials/.** See FEATURE.md → "Documented deviations".
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
 *   · two testimonials, not three (Sean Warneke is absent below 810)
 *   · Patrice's quote is **different copy** — "Rogo is going to transform" here versus
 *     "Rogo transforms" above 810. Not a truncation; a different sentence.
 *   · Patrice is FIRST on phones (`order:0`) and second in the DOM everywhere else
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

/* ---- Content, verbatim from the capture ------------------------------------------------
 * Straight double quotes (U+0022) around each quote and curly apostrophes (U+2019) inside
 * are both the original's, character for character.
 */

type Slide = {
  id: string;
  quote: string;
  name: string;
  role: string;
  photo: string;
  /** Cream `bone` or `surface` — the original alternates, it is not derived from position. */
  cream: boolean;
  /** Quote size at ≥1200. Patrice's is 32px, the other two are 36px; all three are 28px at
      810–1199. A per-slide value in the original, so a per-slide value here. */
  quoteDesktop: string;
  /** Only Patrice's card carries a company mark. */
  logo?: string;
};

const SLIDES: Slide[] = [
  {
    id: "patrice",
    quote:
      '"Our strategic integration of Rogo transforms how we deliver value to clients. Rogo ' +
      "enables our teams to analyze market data and identify opportunities with unprecedented " +
      "speed and precision, while allowing our bankers to focus more deeply on client " +
      'relationships and strategic advisory."',
    name: "Patrice Maffre",
    role: "International Head of Investment Banking, Nomura",
    photo: "/testimonials/product/patrice-maffre.jpg",
    cream: true,
    quoteDesktop: "desktop:text-[32px]",
    logo: "/logos/product/nomura.svg",
  },
  {
    id: "pieter",
    quote:
      '"The Rogo platform is by far the most advanced AI tool in this space. It is improving ' +
      'the way we do research and making our team far more productive."',
    name: "Pieter Taselaar",
    role: "Founding partner & Portfolio manager at Lucerne Capital",
    photo: "/testimonials/product/pieter-taselaar.jpg",
    cream: false,
    quoteDesktop: "desktop:text-[36px]",
  },
  {
    id: "sean",
    quote:
      '"Rogo helped me find relevant precedent data from a number of filings that I wouldn’t ' +
      'have found otherwise. It completely changed how I evaluated the opportunity."',
    name: "Sean Warneke",
    role: "Senior Analyst at Schonfeld",
    photo: "/testimonials/product/sean-warneke.jpg",
    cream: true,
    quoteDesktop: "desktop:text-[36px]",
  },
];

/** ≤809 only. Two cards, Patrice first, and Patrice's quote is not the one above. */
const PHONE_CARDS = [
  {
    id: "patrice",
    quote:
      '"Our strategic integration of Rogo is going to transform how we deliver value to ' +
      "clients. Rogo enables our teams to analyze market data and identify opportunities with " +
      "unprecedented speed and precision, while allowing our bankers to focus more deeply on " +
      'client relationships and strategic advisory."',
    name: "Patrice Maffre",
    role: "International Head of Investment Banking, Nomura",
    cream: true,
    logo: "/logos/product/nomura.svg",
    /* Measured heights, not derived: 505 and 334. */
    box: "h-[505px]",
    /* `--u1dxzv` / `--50mq1o` — the two cards do not share either value. */
    pad: "pt-8 pr-6 pb-6 pl-6",
    gap: "gap-20",
  },
  {
    id: "pieter",
    quote:
      '"The Rogo platform is by far the most advanced AI tool in this space. It is improving ' +
      'the way we do research and making our team far more productive."',
    name: "Pieter Taselaar",
    /* The original's phone copy sets this string in capitals AND applies
       `text-transform:uppercase`, so it renders the same as the sentence-case one above.
       Kept sentence-case here: identical output, one less thing to keep in step. */
    role: "Founding partner & Portfolio manager at Lucerne Capital",
    cream: false,
    box: "h-[334px]",
    pad: "p-6",
    gap: "gap-5",
  },
];

/* ---- Card internals, shared by all three tiers ---------------------------------------- */

function CompanyMark({ src }: { src: string }) {
  return (
    /* 200 × 20 box at 70% opacity; the 121 × 22 mark is `contain`, pinned left top, so it
       lands 110 × 20 in the left of that box. */
    <div className="relative h-5 w-[200px] flex-none opacity-70">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        width={121}
        height={22}
        className="block h-full w-full object-contain object-left-top"
      />
    </div>
  );
}

function CardBody({
  quote,
  name,
  role,
  logo,
  quoteSize,
}: {
  quote: string;
  name: string;
  role: string;
  logo?: string;
  quoteSize: string;
}) {
  return (
    <>
      {/* `.framer-p8w8fr` — grows to fill the card, gap 28 between mark and quote. */}
      <div className="relative flex w-full flex-1 flex-col items-start justify-start gap-7">
        {logo ? (
          <div className="relative flex w-full flex-row items-center gap-[10px]">
            <CompanyMark src={logo} />
          </div>
        ) : null}
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
              uppercase transform are the original's. */}
          <p className="w-full font-sans text-[14px] leading-[1.4em] tracking-normal text-muted uppercase">
            {role}
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
                      logo={s.logo}
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
                      different part of the frame. */}
                  <div className="relative hidden h-full w-[360px] flex-none desktop:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.photo}
                      alt={`${s.name}, ${s.role}`}
                      width={781}
                      height={1024}
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
                logo={c.logo}
                quoteSize="text-[20px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
