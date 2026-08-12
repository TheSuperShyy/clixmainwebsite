/**
 * careers-carousel-diff — computed-value diff for `/careers`'s `#gallery` carousel.
 *
 *   node docs/reference/block-diff.js docs/reference/careers-carousel-diff.js
 *   node docs/reference/block-diff.js docs/reference/careers-carousel-diff.js 1440
 *
 * Spec of record: `features/careers-page/FEATURE.md` -> "Layout — carousel (`#gallery`)".
 * Component under test: `src/components/careers/CareersGallery.tsx`.
 *
 * WHAT THIS CATCHES that a screenshot cannot. The carousel's whole identity is in numbers no
 * eye can check: eight FIXED slide widths that must be identical at all four tiers, a
 * `scrollWidth` of exactly 4469, and a `scroll-snap-type` that decides whether drag/momentum
 * behave natively or not at all. A slide 2px wide of true, or `scroll-snap-type` silently
 * dropped by a class-name typo, both look perfect and are both wrong.
 *
 * ── THE THREE RULES FROM block-diff.js, AND HOW THIS FILE OBEYS THEM ─────────────────────────
 *  1. FILTER EVERY QUERY ON `getBoundingClientRect().width > 0`. Framer ships one DOM subtree
 *     per breakpoint tier and hides the rest with `display:none`; query without the filter and
 *     you measure the hidden tier and get plausible, WRONG numbers. `vis()` below is applied to
 *     the section, the track, every slide, the fieldset and the buttons. Non-negotiable.
 *     NOTE the one thing `vis()` is safe about here: Prev at rest is `opacity:0`, not
 *     `display:none`, so it still has width > 0 and survives the filter. That is deliberate —
 *     its resting opacity is one of the values being diffed.
 *  2. NEVER SLEEP EXACTLY ONE ANIMATION TICK. Irrelevant by construction here, because
 *     `reduceMotion: true` is set and the carousel's resting state is fully deterministic:
 *     there is NO autoplay (live-probed — `scrollLeft` sampled every 250ms for 30s untouched
 *     returned one distinct value), so both sides are read at `scrollLeft === 0` and stay there.
 *     `settleMs: 6000` is for the eight JPEGs to decode and lay out, not for any animation.
 *  3. `captureBeyondViewport` DOES NOT PAINT far-below-fold content. Not applicable — this
 *     harness measures, it does not screenshot.
 *
 * ── ONE SHARED BODY ─────────────────────────────────────────────────────────────────────────
 * Both sides run the SAME `BODY`, so they cannot drift into measuring different properties.
 * The only asymmetry is the finder argument:
 *   · `trackSel` — the target's track carries Framer's `ul.framer--carousel`; ours is the only
 *     `<ul>` in the section, so a bare `'ul'` is both correct and honest about the difference.
 * Everything else (section by `#gallery`, controls by `fieldset`, arrows by `button`) is
 * addressed identically on both sides, because both sides genuinely use those elements.
 *
 * ── TRAPS ENCODED IN THE KEY CHOICES ────────────────────────────────────────────────────────
 *   · `galGap` reads `rowGap` and `trkGap` reads `columnGap`, NOT the `gap` shorthand. A
 *     computed `gap` serialises as `"normal 16px"` when only one axis is authored and as
 *     `"16px"` when both are — so two elements that behave identically can print differently.
 *     The longhands compare what the layout actually uses.
 *   · `galGap` is expected to be 96px on both sides and to have NO visible effect: `#gallery`
 *     has exactly one child. It is diffed anyway because it is what the target declares, and a
 *     silent drop here would be a real divergence hiding behind an accident of child count.
 *   · `galBox` height 636 = 40 (pad-top) + 516 (slide) + 80 (pad-bottom). If the scrollbar ever
 *     stops being hidden, this is the key that moves — the bar is laid out INSIDE the track's
 *     516 box only while `scrollbar-width:none` holds.
 *   · `slideW` must be the SAME EIGHT NUMBERS at 1600 / 1440 / 1024 / 390. Run all four tiers
 *     before believing a pass; a responsive slide width is exactly the defect this key exists
 *     to catch, and it is invisible at any single width.
 *   · `trk`'s `scroll-snap-type` and `snap` BELOW ARE NOW LOAD-BEARING FOR THE ARROWS TOO, not
 *     just for drag. As of the 2026-08-12 rewrite the arrow buttons are a bare
 *     `scrollBy(±clientWidth)` and the landing position is resolved entirely by CSS mandatory
 *     snap. Lose `scroll-snap-type` to a typo and the arrows do not throw or visibly break —
 *     they just stop landing on slide starts. These two keys are the only thing that catches it.
 *   · `snap` reports the DECLARED `scroll-snap-align` / `scroll-snap-stop`, which is all a
 *     computed-style read can ever give. It is NOT proof that snapping happens. At 390 the
 *     track is 358px while every slide is 385–791px, and per CSS scroll-snap a snap area larger
 *     than the snapport lets the snapport rest anywhere inside it — so snapping is SUPPRESSED
 *     ENTIRELY at that tier on both sides while these two values still match perfectly. If you
 *     are here because phone scrolling "does not snap", that is correct behaviour, and this key
 *     passing is not evidence against it.
 *   · `nextRest` is diffed alongside `prevRest` on purpose. The observed behaviour is that Next
 *     NEVER disables — it stays `1 / auto` even at max scroll, where clicking it does nothing.
 *     "Improving" that would show up here as a mismatch, which is the point.
 */

const BODY = `(sec, trackSel) => {
  const vis = (e) => e.getBoundingClientRect().width > 0;   // rule 1 — see block-diff.js
  const px = (n) => Math.round(n);

  const b = sec.getBoundingClientRect(), s = getComputedStyle(sec);

  const ul = [...sec.querySelectorAll(trackSel)].filter(vis)[0];
  const us = getComputedStyle(ul);
  const slides = [...ul.children].filter(vis);

  const fs = [...sec.querySelectorAll('fieldset')].filter(vis)[0];
  const fss = getComputedStyle(fs);
  const btns = [...fs.querySelectorAll('button')].filter(vis);
  const prev = btns[0], next = btns[btns.length - 1];
  const pb = prev.getBoundingClientRect(), ps = getComputedStyle(prev);
  const ns = getComputedStyle(next);

  return JSON.stringify({
    galBox:   [px(b.width), px(b.height)],
    galPad:   s.padding,
    galGap:   s.rowGap,
    galBg:    s.backgroundColor,
    trk:      [us.overflowX, us.overflowY, us.scrollSnapType],
    trkGap:   us.columnGap,
    clientW:  ul.clientWidth,
    scrollW:  ul.scrollWidth,
    n:        slides.length,
    slideW:   slides.map((li) => px(li.getBoundingClientRect().width)),
    slideH:   px(slides[0].getBoundingClientRect().height),
    snap:     (() => { const c = getComputedStyle(slides[0]); return [c.scrollSnapAlign, c.scrollSnapStop]; })(),
    fsPad:    fss.padding,
    fsPos:    [fss.position, fss.justifyContent, fss.alignItems, fss.pointerEvents],
    btn:      [px(pb.width), px(pb.height), ps.borderRadius, ps.backgroundColor],
    prevRest: [ps.opacity, ps.pointerEvents],
    nextRest: [ns.opacity, ns.pointerEvents],
  });
}`;

module.exports = {
  refUrl: "https://rogo.com/careers",
  ourUrl: "http://localhost:3001/careers",
  widths: [1600, 1440, 1024, 390],
  /* Rule 2: read the deterministic resting state. There is no autoplay to alias against, and
     6s is for eight JPEGs to decode and settle, not for an animation. */
  reduceMotion: true,
  settleMs: 6000,

  ref: `(${BODY})(
    [...document.querySelectorAll('#gallery')]
      .filter((e) => e.getBoundingClientRect().width > 0)[0],
    'ul.framer--carousel'
  )`,

  ours: `(${BODY})(
    [...document.querySelectorAll('#gallery')]
      .filter((e) => e.getBoundingClientRect().width > 0)[0],
    'ul'
  )`,
};
