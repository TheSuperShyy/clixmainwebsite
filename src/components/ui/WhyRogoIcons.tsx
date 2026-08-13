/**
 * The five `why-rogo` item icons, lifted verbatim from the capture's SVG defs
 * (`docs/reference/target/rogo-home-2026-08-02.html`). The original references them as
 * `<use href="#svg99268749_839">` etc. against a `<defs>` block; inlining them instead
 * drops the indirection and lets each one inherit `currentColor`.
 *
 * Everything else is the capture's own geometry: non-integer viewBoxes, `stroke-width:2.5`,
 * `stroke-linecap` present on three of five and absent on two, `fill:transparent`. Do not
 * round the viewBoxes — each icon is placed at a hand-tuned px offset inside its 40px
 * frame (see ICONS in WhyRogo.tsx), and those offsets were computed against these numbers.
 *
 * The stroke is `var(--token-…, rgb(21,21,21))` in the capture, i.e. `ink`. Rendered here
 * as `currentColor` so the parent sets it once.
 *
 * ─── RTL: CHECKED, DELIBERATELY UNCHANGED (2026-08-12) ────────────────────────────────────
 * All five were reviewed against the mirror-or-not rule and NONE of them is mirrored on /he.
 * Stated here so a later reader knows this was decided rather than missed:
 *
 *   · None is a navigational affordance. Mirroring is for glyphs whose meaning IS a direction
 *     — a carousel Prev/Next, a submit arrow, a `›` chevron — because those mean "the way
 *     reading goes". These are abstract diagrams: a dollar in a circle, a node tree, two
 *     interlocking rectangles, a bar chart, a circle with a rightward glyph inside it.
 *   · `DeploymentIcon` is the one that looks arguable, because it contains a `>`-shaped
 *     chevron. It is not a Next button: it is an arrow entering a broken ring, i.e. "deploy
 *     into", and the ring's gap is what carries that. Mirrored, the arrow would point out of
 *     the ring instead of into it, which is a different picture, not a translated one.
 *   · Each icon is placed at a hand-tuned px offset inside its 40px frame (`iconBox` in
 *     WhyRogo.tsx), and those offsets are PHYSICAL for the same reason: an un-mirrored glyph's
 *     optical nudge must not flip. See the note on `iconBox`.
 *
 * There is also no copy in this file. Every `<svg>` is `aria-hidden`, and the heading beside it
 * carries the meaning — so nothing here goes into the dictionary.
 */

type IconProps = { className?: string };

const stroke = {
  fill: "transparent",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeMiterlimit: 10,
} as const;

/* 1 — By finance, for finance. `#svg99268749_839` */
export function DollarCircleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 30 30" overflow="visible" aria-hidden="true">
      <path
        d="M 15 7.5 L 15 5.833 M 15 22.5 L 15 24.167 M 18.61 10 C 17.889 9.004 16.542 8.333 15 8.333 L 14.537 8.333 C 12.491 8.333 10.833 9.66 10.833 11.296 L 10.833 11.424 C 10.833 12.594 11.66 13.664 12.969 14.188 L 17.031 15.813 C 18.34 16.336 19.167 17.406 19.167 18.577 C 19.167 20.283 17.437 21.667 15.304 21.667 L 15 21.667 C 13.458 21.667 12.111 20.997 11.39 20 M 30 15 C 30 23.284 23.284 30 15 30 C 6.716 30 0 23.284 0 15 C 0 6.716 6.716 0 15 0 C 23.284 0 30 6.716 30 15 Z"
        strokeLinecap="square"
        {...stroke}
      />
    </svg>
  );
}

/* 2 — Agents that understand, and act. `#svg-1649671525_1308` */
export function AgentTreeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 28.334 28.334"
      overflow="visible"
      aria-hidden="true"
    >
      <g>
        <path
          d="M 14.102 8.334 C 15.606 8.357 17.006 7.568 17.765 6.269 C 18.524 4.97 18.524 3.364 17.765 2.065 C 17.006 0.766 15.606 -0.023 14.102 0.001 C 11.827 0.036 10 1.891 10 4.167 C 10 6.443 11.827 8.298 14.102 8.334 Z M 4.102 28.334 C 5.606 28.357 7.006 27.568 7.765 26.269 C 8.524 24.97 8.524 23.364 7.765 22.065 C 7.006 20.766 5.606 19.977 4.102 20.001 C 1.827 20.036 0 21.891 0 24.167 C 0 26.443 1.827 28.298 4.102 28.334 Z M 24.102 28.334 C 25.606 28.357 27.006 27.568 27.765 26.269 C 28.524 24.97 28.524 23.364 27.765 22.065 C 27.006 20.766 25.606 19.977 24.102 20.001 C 21.827 20.036 20 21.891 20 24.167 C 20 26.443 21.827 28.298 24.102 28.334 Z"
          {...stroke}
        />
        <path
          d="M 14 8 L 14 13.833 M 14 13.833 L 4 13.833 L 4 19.667 M 14 13.833 L 24 13.833 L 24 19.667"
          {...stroke}
        />
      </g>
    </svg>
  );
}

/* 3 — Integrated into your firm. `#svg296476154_492` */
export function IntegrationIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 26.668 26.668"
      overflow="visible"
      aria-hidden="true"
    >
      <path
        d="M 26.668 0 L 16.668 0 L 16.668 10 L 26.668 10 Z M 10 26.668 L 10 6.668 L 0 6.668 L 0 16.668 M 0 16.668 L 20 16.668 L 20 26.668 L 0 26.668 Z"
        {...stroke}
      />
    </svg>
  );
}

/* 4 — Institutional-grade outputs. `#svg-685953242_566`.
   NOTE: this one carries `opacity="0.7"` on the PATH, and its Icon Frame is the only one
   of the five with no opacity of its own. Net effect matches the others; the capture just
   applies it a layer lower. Kept where the capture puts it. */
export function ChartBoardIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 30 29.167"
      overflow="visible"
      aria-hidden="true"
    >
      <path
        d="M 8.333 15 L 8.333 16.667 M 15 6.667 L 15 16.667 M 21.667 11.667 L 21.667 16.667 M 20.241 24.167 L 21.67 29.167 M 9.762 24.167 L 8.333 29.167 M 30 23.333 L 30 0 L 0 0 L 0 23.333 Z"
        strokeLinecap="square"
        opacity="0.7"
        {...stroke}
      />
    </svg>
  );
}

/* 5 — Custom deployed + partnership-minded. `#svg-663106442_645` */
export function DeploymentIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 30.002 30"
      overflow="visible"
      aria-hidden="true"
    >
      <path
        d="M 15 30 C 6.716 30 0 23.284 0 15 C 0 6.716 6.716 0 15 0 M 26.18 25 C 25.119 26.186 23.877 27.196 22.5 27.993 M 22.5 2.008 C 23.877 2.805 25.119 3.815 26.18 5 M 29.717 12.082 C 30.097 14.009 30.097 15.991 29.717 17.918 M 16.666 10 L 21.666 15 L 16.666 20 M 20 15 L 8.335 15"
        strokeLinecap="square"
        {...stroke}
      />
    </svg>
  );
}
