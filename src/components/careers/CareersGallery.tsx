"use client";

/**
 * CareersGallery — clone of `rogo.com/careers`'s `Gallery` block (`#gallery`).
 *
 * Spec of record: `features/careers-page/FEATURE.md` -> "Layout — carousel (`#gallery`)" and
 * "Motion — carousel (LIVE-PROBED …)". Every number here was read off the live target over CDP
 * at 1600 / 1440 / 1024 / 390 on 2026-08-12; the frozen HTML capture is silent on all motion.
 *
 * ── WHAT THIS IS ────────────────────────────────────────────────────────────────────────────
 * A NATIVE scroll-snap list. Not a transform track, not a JS animation. The `<ul>` is
 * `overflow-x:auto` + `scroll-snap-type:x mandatory`, each `<li>` is `scroll-snap-align:start;
 * scroll-snap-stop:always`. Drag, momentum, snap, keyboard arrow scrolling AND the arrow
 * buttons' landing positions are therefore all the BROWSER's — there is deliberately no code
 * for any of them. The only JS here is (a) a one-line `scrollBy` of exactly one viewport per
 * arrow click and (b) a passive scroll listener that drives Prev's enabled state. Unlike
 * `/product` Block 6 there is no spring-to-fit, and unlike this file's own first draft there is
 * no step arithmetic. See the next section for why that arithmetic was deleted.
 *
 * ── MEASURED ────────────────────────────────────────────────────────────────────────────────
 *   · `#gallery`: flex column, centred, gap 96, `overflow-hidden`, bg `paper`,
 *     padding `40px 40px 80px` at >=810 and `40px 16px 80px` at <=809.98, height 636 at every
 *     tier. (636 = 40 + 516 + 80. The gap-96 never fires — one child — but it is what the
 *     target declares, so it is declared here too.)
 *   · Track gap 16, `scroll-behavior:auto` (the smoothness comes from `scrollBy`, not CSS).
 *   · Slide boxes: FIXED PIXELS AT EVERY TIER — 385/721/389/605/389/389/688/791 x 516.
 *     See `careersPhotos.ts`. `scrollWidth` 4469; track `clientWidth` 1520/1360/944/358.
 *   · Controls `<fieldset>`: `absolute inset-0`, padding 16, space-between, centred,
 *     `pointer-events:none`, `border:0`. Buttons 40x40, radius 40, bg `control-scrim`.
 *   · Controls opacity is 1 AT REST and still 1 after a real `mousemove` — they are NOT
 *     hover-gated, despite the target's `data-show-mouse-controls="true"`. No fade logic.
 *   · NO AUTOPLAY: `scrollLeft` sampled every 250ms for 30s untouched returned ONE distinct
 *     value. There is no timer in this file and there must not be one.
 *   · It does not loop. Prev is edge-disabled at `scrollLeft === 0`; Next NEVER disables, even
 *     at max scroll where clicking it does nothing. Reproduced as observed — do not "fix" Next.
 *
 * ── THE ARROW STEP: NATIVE MECHANISM, APPROXIMATE LANDINGS ──────────────────────────────────
 * The MECHANISM is exact and native: `scrollBy(±clientWidth)` on a mandatory-snap container,
 * with CSS resolving the landing. Only the exact landing positions diverge, on 4 of the 13
 * transitions observed at the two SNAPPING tiers. This is the page's one documented
 * approximation, the same status as `/product` Block 6's fitted spring; FEATURE.md carries the
 * write-up, this is the engineering note.
 *
 * HOW WE GOT HERE. FEATURE.md first derived a bespoke rule from six steps observed at 1440
 * (C = 1360): forward `0 -> 1543 -> 2569 -> 3109`, back `3109 -> 2164 -> 1138 -> 0`. With
 * starts = [0, 401, 1138, 1543, 2164, 2569, 2974, 3678] and MAX = 4469 − 1360 = 3109, those six
 * CANNOT all come from one threshold rule of that shape. Proof, on the "accumulate w[j]+16
 * while the running total stays <= C" runs the observations imply:
 *     0 -> 1543    needs the run {0,1,2} = 1543 ACCEPTED   (threshold >= 1543)
 *     1543 -> 2569 needs the run {3,4,5} = 1431 REJECTED   (threshold  < 1431)
 * 1431 < 1543, so no threshold satisfies both.
 *
 * THE DATA IS SOUND; THE RULE WAS NOT. `0 -> 1543` was initially suspected of being a probe
 * artefact — it is a jump of 1543 > one full viewport, where every other step is under one. A
 * second, independent probe on 2026-08-12 settled it: images forced eager, each reading settled
 * to rest (four consecutive identical 120ms samples) rather than after a fixed sleep. It
 * reproduced identically. So the observation stands and the bespoke rule was what was wrong.
 *
 * CHOSEN BY MEASUREMENT, NOT DERIVED. Five candidate rules were scored against all 13 observed
 * transitions at 1440 and 1024. (390 is excluded: snapping is suppressed there — see below — so
 * no snap-based rule can reproduce it, and scoring against it would be meaningless.)
 *
 *     9/13   scrollBy(±clientWidth) then NATIVE snap        <- IMPLEMENTED
 *     7/13   "first slide not fully visible, +1"
 *     6/13   "first slide not fully visible"
 *     6/13   this file's first draft (bespoke accumulate rule)
 *     5/13   FEATURE.md's original accumulate rule
 *     2/13   scrollBy with snapping disabled
 *
 * Independently re-scored here before switching; the total and all four misses reproduced:
 *     1440  next 2/3  (misses 0 -> 1543: predicts 2974, page does 2569 ... at 1543)
 *     1440  prev 2/3  (misses 3109 -> 2164: predicts 1543)
 *     1024  next 2/3  (misses 2164 -> 3525: predicts 2974)
 *     1024  prev 3/4  (misses 1543 -> 1138: predicts 401)
 *
 * WHY THIS SHAPE BEYOND THE SCORE — and these matter more than the 9/13:
 *   1. It is what the browser does natively. A programmatic scroll on a mandatory-snap
 *      container is re-snapped to the nearest snap point; that IS the rule. So we stop
 *      SIMULATING the mechanism and just use it — the same argument that makes every other part
 *      of this carousel exact rather than approximate.
 *   2. It deletes arithmetic we now know is unfittable. No invented rule to maintain, explain,
 *      or re-tune the next time someone re-probes.
 *   3. `scrollBy` always moves, snapped or not, so the dead-control failure at 390 disappears
 *      along with the progress guard that used to special-case it.
 *   4. It is honest about what is known. "We scroll by a viewport and let the browser snap,
 *      which is what the target appears to do" beats a fitted rule agreeing on 6 of 13.
 *
 * The residual 4/13 is unrecoverable by black-box probing: the Framer component carries
 * internal index state. Two probe rounds is the ceiling for a decorative control. It stops here.
 *
 * SNAP SUPPRESSION AT 390 — same cause on both sides, different landings. Per CSS scroll-snap,
 * a snap area LARGER than the snapport lets the snapport rest anywhere inside it. At 390 every
 * slide is 385–791px against a 358px track, so snapping is SUPPRESSED ENTIRELY — for us and for
 * the target alike. That is why the re-probed 390 landings (764, 2584, 3759, 2195, 1762, 1169,
 * 587) are not slide starts at all: the target's arrows scroll freely there and work fine.
 * Ours scroll one unsnapped viewport per click (0, 358, 716, …). Same mechanism, same cause,
 * different numbers — because the target's step size comes from state we cannot see. Nothing
 * here is worth chasing: it is one decorative control at one tier, and the browser gives free
 * scrolling either way.
 *
 * ── DELIBERATE A11Y DIVERGENCES (all three recorded in FEATURE.md's deviations table) ────────
 * Fidelity on this project means layout, type, colour and motion. It does not extend to
 * reproducing the original's accessibility defects.
 *  1. The `<ul>` gets `tabIndex={0}` and a visible `focus-visible` ring. The original leaves a
 *     scroll container keyboard-unreachable, which is a WCAG 2.1.1 failure; with focus on the
 *     track the browser's own arrow-key scrolling does the rest.
 *  2. In Prev's edge-disabled state the original keeps the button TABBABLE while invisible and
 *     inert, so focus lands on nothing. We keep `opacity:0; pointer-events:none;
 *     cursor:default` exactly as measured (the computed-value diff still passes) and add
 *     `tabIndex={-1}` + `aria-hidden` in that state only. Neither is a computed style, so
 *     nothing measurable moves. `disabled` was deliberately NOT used: it changes UA styling and
 *     pointer behaviour and would drift the diff.
 *  3. `aria-live="polite"` IS on the target's track and is deliberately NOT carried across.
 *     It is an anti-pattern here: the subtree never changes — only the scroll offset does — so
 *     it announces nothing while forcing assistive tech to monitor an 8-item subtree for
 *     mutations that never come. Dropped on purpose; do not "restore" it for fidelity.
 *
 * TRAP: the reduced-motion neutraliser in `globals.css` zeroes `animation-duration` and
 * `transition-duration`. It does NOT reach `Element.scrollBy({behavior:"smooth"})` — that is
 * script, not CSS. The preference is therefore read here, at click time, per C11.
 *
 * ── RTL: THIS FILE IS THE SHARPEST DIRECTION BUG ON THE SITE, AND IT FAILS SILENTLY ─────────
 * No crash, no console warning, no type error. In RTL Chromium a scroll container's `scrollLeft`
 * is 0 at the INLINE-START — which is the visual RIGHT edge — and runs NEGATIVE to `−maxScroll`.
 * Untreated, that produces two wrong behaviours and no diagnostic for either:
 *
 *   1. `scrollLeft <= SNAP_EPS` is true across the ENTIRE range, because every value is ≤ 0.
 *      Prev would be permanently edge-disabled on `/he/careers`. Fixed with `Math.abs`, which
 *      is a PROVABLE NO-OP in LTR: `scrollLeft` is never negative at rest there, so
 *      `Math.abs(x) === x` for every value the handler can observe. It needs no direction read
 *      at all, which is why `Math.abs` is the right shape rather than a sign multiply — this
 *      runs on every rAF and must not touch a hook or a context.
 *   2. `scrollBy({left: +C})` walks `scrollLeft` back TOWARD 0, i.e. toward the inline-START,
 *      so a positive delta means "previous" in RTL. Fixed by multiplying by the element's own
 *      direction sign, read from `getComputedStyle(ul).direction` AT CLICK TIME. Not a hook and
 *      not a render input, so it adds no hydration surface — and it returns `"ltr"` in English,
 *      making the expression byte-identical in the LTR build.
 *
 * DELIBERATELY LEFT ALONE, each verified rather than overlooked:
 *   · `scrollSnapAlign: "start"` is ALREADY LOGICAL — `start` means inline-start, so it needs
 *     no rtl variant. `scroll-snap-type: x mandatory` is the correct axis in both directions:
 *     the inline axis IS x in a horizontal writing mode.
 *   · THE ARROW-STEP RULE ITSELF. `scrollBy(±clientWidth)` + native snap was chosen by scoring
 *     five candidates against 13 measured transitions (9/13; the hand-derived alternative was
 *     proved arithmetically impossible above). ONLY THE SIGN CHANGES. Do not re-derive the step.
 *   · The controls `<fieldset>` uses `justify-between`, a flex main-axis keyword that already
 *     follows `direction`. Prev therefore lands on the visual RIGHT in RTL with no code — which
 *     is correct, because Prev means "toward the inline-start" and that is the right edge there.
 *   · `careersPhotos.ts`'s `fit: "right bottom"` stays PHYSICAL. It names where the subject sits
 *     inside one JPEG, not a reading direction. See that file's header.
 *   · At 390 NOTHING SNAPS IN EITHER DIRECTION, because every slide is wider than the 358px
 *     snapport. Measured and expected; not a direction bug and not to be "fixed".
 *
 * THE GLYPHS ARE MIRRORED BY SWAPPING WHICH COMPONENT RENDERS, not with `scaleX(-1)`. See the
 * arithmetic proof above `PrevGlyph`. This is the one thing here that changes RENDER OUTPUT, so
 * it is the one thing that reads `useDirection()` rather than the DOM.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useChrome, useDirection, usePageDict } from "@/lib/i18n/LocaleProvider";
import { interpolate } from "@/lib/i18n/format";
import { PHOTOS, SLIDE_H } from "./careersPhotos";

/* Verbatim from the target, refetched 2026-08-12. These are the original's own assets: an
   OPAQUE WHITE CIRCLE with an ink chevron + shaft — which is why the `control-scrim` behind
   them only ever shows if the SVG fails to render. The literal `#fff` / `#151515` stay literal
   on purpose: they are the artwork, not theme colours, so no token and no `currentColor`. The
   button's own background IS a token.

   ⚠️ THESE TWO ARE EXACT MIRRORS OF EACH OTHER ABOUT x = 20, AND IT IS CHECKABLE RATHER THAN
   ASSERTED — every corresponding x-coordinate pair sums to 40:

       chevron apex   12.5   + 27.5   = 40
       chevron ends   18.215 + 21.785 = 40   (both endpoints, y 14.098 and 25.528)
       shaft inner    19.274 + 20.726 = 40
       shaft outer    28.409 + 11.59  = 39.999   <- the source artwork's own rounding, 0.001 off

   Every non-geometry attribute is already identical (`strokeWidth` 1.5, `strokeLinecap` square,
   `strokeLinejoin` bevel on the chevron and round on the shaft). So RTL mirrors these by
   SWAPPING WHICH COMPONENT RENDERS — no `scaleX(-1)`, no new artwork, no risk. The path data
   below is byte-for-byte the target's and must stay that way.

   VERIFIED, NOT OVERLOOKED: `PrevGlyph`'s `transform="matrix(-1 0 0 1 40 0)"` on its <rect> is
   cosmetically inert. That matrix maps x -> 40 − x, so the 40×40 box maps onto itself, and an
   `rx=20` rounding on a 40×40 box is a circle either way. It is a Framer export artefact; it is
   kept only so this file stays byte-identical to the fetched asset. */
function PrevGlyph() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" aria-hidden="true" focusable="false">
      <rect width="40" height="40" fill="#fff" rx="20" transform="matrix(-1 0 0 1 40 0)" />
      <path stroke="#151515" strokeLinecap="square" strokeLinejoin="bevel" strokeWidth="1.5" d="M18.215 14.098 12.5 19.813l5.715 5.715" />
      <path stroke="#151515" strokeLinecap="square" strokeLinejoin="round" strokeWidth="1.5" d="M19.274 19.813h9.135" />
    </svg>
  );
}

function NextGlyph() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" aria-hidden="true" focusable="false">
      <rect width="40" height="40" fill="#fff" rx="20" />
      <path stroke="#151515" strokeLinecap="square" strokeLinejoin="bevel" strokeWidth="1.5" d="m21.785 14.098 5.715 5.715-5.715 5.715" />
      <path stroke="#151515" strokeLinecap="square" strokeLinejoin="round" strokeWidth="1.5" d="M20.726 19.813H11.59" />
    </svg>
  );
}

/** Sub-pixel tolerance on the at-the-inline-start test that drives Prev's enabled state. */
const SNAP_EPS = 1;

export default function CareersGallery() {
  const trackRef = useRef<HTMLUListElement>(null);
  const t = usePageDict("careers").gallery;
  const a11y = useChrome().a11y;
  /* The ONLY direction read in this component, because mirroring the glyphs is the only thing
     here that changes RENDER OUTPUT. It comes from the provider rather than the DOM so the
     server and the client agree — a `document.dir` sniff has no server snapshot and would
     render the LTR arrow on the server, then visibly flip on hydration. Stable for the lifetime
     of the mount: switching locale is a hard navigation across two root layouts. */
  const rtl = useDirection() === "rtl";
  /* Prev's enabled state is the ONLY reason this component re-renders. Next never changes:
     it is never disabled. */
  const [atStart, setAtStart] = useState(true);

  /* Passive + rAF-throttled. A scroll handler doing layout reads on every event is how a
     native, compositor-driven scroll turns janky. */
  useEffect(() => {
    const ul = trackRef.current;
    if (!ul) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      /* `Math.abs` because RTL Chromium reports `scrollLeft` as 0 at the inline-start and
         NEGATIVE from there; without it the bare `<= SNAP_EPS` is true across the whole range
         and Prev is permanently disabled on `/he/careers`. It is a no-op in LTR — `scrollLeft`
         is never negative at rest — and it needs no direction input, which is what makes it
         safe on a handler that runs on every animation frame. */
      setAtStart(Math.abs(ul.scrollLeft) <= SNAP_EPS);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };
    read(); // the track can come back mid-scroll after a bfcache restore
    ul.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ul.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const step = useCallback((dir: 1 | -1) => {
    const ul = trackRef.current;
    if (!ul) return;

    /* C11: the CSS reduced-motion neutraliser cannot reach `scrollBy`. Read at click time, so a
       mid-session change of the OS preference is honoured without a subscription. */
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* `scrollBy({left})` is a PHYSICAL-axis delta and does not follow `direction`, but the
       scroll ORIGIN does: in RTL, `scrollLeft` starts at 0 and runs negative, so a positive
       `left` walks back toward the inline-START. Without this sign the arrows move the wrong way
       on `/he/careers` — silently, since `scrollBy` always succeeds.

       Read off the ELEMENT at click time rather than from `useDirSign()`: this is not a render
       input, so keeping it out of the render pass costs nothing and adds no hydration surface,
       and it reads the direction that is actually in effect on the track. `getComputedStyle`
       returns `"ltr"` under the English root layout, so `sign` is `1` and the expression below
       is byte-identical in the LTR build. */
    const sign = getComputedStyle(ul).direction === "rtl" ? -1 : 1;

    /* THE WHOLE STEP, and only its SIGN is direction-aware. One viewport in the requested
       direction; CSS mandatory snap resolves the landing to the nearest slide start, and the
       scroll range clamps the ends. There is deliberately no `starts` array, no accumulate loop
       and no progress guard — see the header for why the arithmetic that used to be here was
       deleted rather than tuned, and why the magnitude must not be touched now. */
    ul.scrollBy({
      left: sign * dir * ul.clientWidth,
      behavior: reduced ? "auto" : "smooth",
    });
  }, []);

  return (
    <section
      id="gallery"
      data-nav-theme="light"
      className="flex w-full flex-col items-center justify-center gap-24 overflow-hidden
                 bg-paper px-4 pt-10 pb-20 tablet:px-10"
    >
      {/* `aria-roledescription` needs a role to attach to. The target uses a bare `<section>`,
          which only takes the `region` role once it has an accessible name; `role="group"` on a
          div states the same thing without depending on that naming rule, and types cleanly. */}
      <div
        role="group"
        aria-roledescription={t.roleDescription}
        aria-label={t.label}
        className="relative w-full"
      >
        <ul
          ref={trackRef}
          tabIndex={0}
          className="flex w-full list-none items-start gap-4 overflow-x-auto overflow-y-hidden
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                     focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2
                     focus-visible:ring-offset-paper focus-visible:outline-none"
          /* Inline because both are one-off, non-tokenised behaviours: mandatory snap, and
             `scroll-behavior:auto` so ALL smoothness is decided by `scrollBy` — and therefore
             by the reduced-motion branch — rather than half of it hiding in CSS. */
          style={{ scrollSnapType: "x mandatory", scrollBehavior: "auto" }}
        >
          {PHOTOS.map((photo, index) => (
            <li
              key={photo.src}
              /* `index + 1` is an INDEX, not a physical delta, so it does not take a direction
                 sign: "slide 1" is the first slide in every language. Only the reading order of
                 the rendered row changes, and `direction` already does that. */
              aria-label={interpolate(a11y.slideOfTotal, {
                n: index + 1,
                total: PHOTOS.length,
              })}
              className="shrink-0"
              style={{
                width: photo.slide,
                height: SLIDE_H,
                /* ALREADY LOGICAL: `start` is the inline-start, so this needs no rtl variant.
                   `x mandatory` on the track is the correct axis in both directions. */
                scrollSnapAlign: "start",
                scrollSnapStop: "always",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                /* Keyed by the photo's stable ID, not by its position, so a reorder of `PHOTOS`
                   cannot re-pair a description with the wrong photograph. */
                alt={t.alt[photo.id]}
                width={photo.slide}
                height={SLIDE_H}
                /* C10: plain `<img>`, never `next/image`. Slide 1 is the only guaranteed
                   in-view slide at every tier (it is the sole one that fits the 358px phone
                   track), so it is the one eager load. 2–8 are `lazy`, which does NOT mean
                   "deferred": the browser still fetches any that intersect the viewport, so
                   the wide tiers get slides 2–3 immediately and the phone gets only slide 1.
                   That is the point — `lazy` here buys the narrow tier, not the wide one. */
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="block h-full w-full object-cover"
                style={{ objectPosition: photo.fit ?? "center" }}
              />
            </li>
          ))}
        </ul>

        {/* `<fieldset>` to match the target's own element. `min-w-0` because a fieldset's UA
            `min-width: min-content` would otherwise fight the absolute box.
            `inset-0` and `p-4` are symmetric by construction, and `justify-between` is a flex
            main-axis keyword that already follows `direction` — so Prev lands on the visual
            RIGHT in RTL with no code, which is correct: Prev means "toward the inline-start". */}
        <fieldset
          aria-label={t.controlsLabel}
          className="pointer-events-none absolute inset-0 m-0 flex min-w-0 items-center
                     justify-between border-0 p-4"
        >
          <button
            type="button"
            aria-label={a11y.previous}
            /* Edge-disabled EXACTLY as measured: opacity 0 + pointer-events none + cursor
               default at scrollLeft 0. `tabIndex` / `aria-hidden` are the documented a11y
               addition; neither is a computed style, so the diff is unaffected. */
            tabIndex={atStart ? -1 : 0}
            aria-hidden={atStart || undefined}
            onClick={() => step(-1)}
            className={`flex h-10 w-10 items-center justify-center overflow-hidden border-0 p-0
                        bg-control-scrim
                        focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2
                        focus-visible:ring-offset-paper focus-visible:outline-none
                        ${
                          atStart
                            ? "pointer-events-none cursor-default opacity-0"
                            : "pointer-events-auto cursor-pointer opacity-100"
                        }`}
            style={{ borderRadius: 40 }}
          >
            {/* MIRRORED BY SWAPPING THE COMPONENT, because the two glyphs are exact mirrors of
                each other — proved by the coordinate sums above `PrevGlyph`. No `scaleX(-1)` and
                no second copy of the artwork. */}
            {rtl ? <NextGlyph /> : <PrevGlyph />}
          </button>

          {/* Next is NEVER disabled — observed to stay `opacity:1; pointer-events:auto` at max
              scroll, where clicking it simply does nothing. Reproduced as observed. */}
          <button
            type="button"
            aria-label={a11y.next}
            onClick={() => step(1)}
            className="pointer-events-auto flex h-10 w-10 cursor-pointer items-center
                       justify-center overflow-hidden border-0 bg-control-scrim p-0 opacity-100
                       focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2
                       focus-visible:ring-offset-paper focus-visible:outline-none"
            style={{ borderRadius: 40 }}
          >
            {rtl ? <PrevGlyph /> : <NextGlyph />}
          </button>
        </fieldset>
      </div>
    </section>
  );
}
