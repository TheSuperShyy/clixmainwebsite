/**
 * contactGlyphs — the two marks /contact's form needs: a check and an alert.
 *
 * DRAWN ON `company/serviceGlyphs.tsx`'s GRID, and that is the whole point of the file. These
 * are the first icons on this page, and a check pulled from a generic set beside eight marks
 * built to a documented system would read as borrowed. So they inherit that system exactly:
 *
 *   · 32×32 viewBox, artwork inside 3.5 → 28.5 for a shared optical margin
 *   · stroke `currentColor`, width 1.5, round cap + round join, `fill: none`
 *   · colour comes from the parent — never set here
 *
 * ⚠️ THESE ARE SVG PATHS, NOT GLYPH CHARACTERS, AND THAT IS LOAD-BEARING. The obvious way to
 * draw a check is `✓` and an alert is `!`. Both would be text, and text on this page is set in
 * one of two faces: Discovery, or Fragment Mono — whose @font-face unicode-ranges (src/app/
 * fonts.css) cover Latin, Greek and Cyrillic. A `✓` is in neither face's subset, so it would
 * fall back to whatever the OS offers, at whatever weight, beside Discovery. Drawing them
 * sidesteps the question in both locales. Same reasoning as the mono note in ContactForm.tsx.
 *
 * ⚠️ NEITHER IS MIRRORED UNDER RTL. `ui/WhyRogoIcons.tsx`'s rule: mirror only a glyph whose
 * MEANING is a direction. A check mark is a tick, not an arrow — it points nowhere, and every
 * Hebrew interface renders it exactly as an English one does. The alert is symmetric about the
 * vertical axis, so mirroring it would be a no-op anyway.
 *
 * Both are `aria-hidden`: the check is decorative beside a numeral the group already names, and
 * the alert sits immediately before its own error message as real text.
 */

type GlyphProps = { className?: string };

/* Shared with serviceGlyphs.tsx by value rather than by import — that file keeps its `line`
   const module-private, and two lines of duplication is cheaper than widening its API for a
   different page's icons. If the house stroke ever changes, both move. */
const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * The completion check.
 *
 * ⚠️ `pathLength={1}` IS WHAT MAKES THE DRAW ANIMATION WORK, and it is not decorative. The
 * `contact-draw` keyframe (globals.css) animates `stroke-dashoffset` from 1 to 0. Without
 * `pathLength`, those numbers would be in USER UNITS and would depend on the path's real
 * measured length — which changes the moment anyone nudges a coordinate, silently breaking the
 * animation into either a partial draw or no draw at all. Normalising the path to a length of 1
 * makes the keyframe geometry-independent. The dash array is set here rather than in CSS so the
 * two values can never drift apart.
 *
 * The dash is declared unconditionally, so under `prefers-reduced-motion` — where the keyframe
 * is never built (see globals.css) — `strokeDashoffset: 0` leaves the check fully drawn. The
 * static state is the finished state, which is the invariant every loop in this repo follows.
 */
export function CheckGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        {...line}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={0}
        d="M7 16.5 L13.5 23 L25 9.5"
      />
    </svg>
  );
}

/**
 * The alert mark — a stroked triangle with a bar and a dot.
 *
 * ⚠️ THIS EXISTS SO COLOUR IS NEVER THE ONLY SIGNAL. `--color-alert` is new on this page and it
 * is tempting to let red alone mean "wrong". WCAG 1.4.1 forbids that, and this repo's own note
 * in ContactForm.tsx already argued the point when the page was monochrome. The error state now
 * says "wrong" four ways: this glyph, the message text, `aria-invalid`, and the step chip.
 *
 * Symmetric about x=16, so RTL is a no-op. The dot is the one solid fill, which is the single
 * fill serviceGlyphs.tsx's grid allows per mark.
 */
export function AlertGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Corner radius 2 — inside the 1.5–3 band the grid allows for a square corner. */}
      <path
        {...line}
        d="M16 4.5 L28.2 25.5 A2 2 0 0 1 26.4 28.5 L5.6 28.5 A2 2 0 0 1 3.8 25.5 Z"
      />
      <path {...line} d="M16 12.5 L16 19.5" />
      <circle cx={16} cy={23.6} r={1.15} fill="currentColor" stroke="none" />
    </svg>
  );
}
