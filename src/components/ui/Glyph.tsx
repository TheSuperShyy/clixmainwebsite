/**
 * The 24x24 single-path brand mark every roster on this site renders.
 *
 * Three modules keep their own list of marks and they are separate rosters on purpose —
 * `ui/ToolGlyphs.tsx` (the tools clix builds with), `clix/toolMarks.tsx` (clix's own
 * artwork, lifted from the real company site), `news/newsGlyphs.tsx` (the companies the
 * /news digest reports on). This <svg> is the one thing all three share, so it lives here
 * instead of being pasted into each.
 *
 * `currentColor` is the whole point. A mark has to invert with the ground it sits on —
 * `paper` on forest, `ink` on canvas — which an <img> cannot do.
 *
 * `aria-hidden` ALWAYS. Every mark on this site is paired with the company's name as real
 * text, so labelling the glyph would make a screen reader say the name twice.
 */
export default function Glyph({ d, size }: { d: string; size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      style={{ flex: "none", display: "block" }}
    >
      <path d={d} />
    </svg>
  );
}
