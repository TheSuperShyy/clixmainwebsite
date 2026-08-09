/**
 * ClixFelixFooter — clone of rogo.com/felix `Felix Footer` (`.framer-17a2nid`).
 * Measured from the 2026-08-09 capture. Spec: features/felix-page/FEATURE.md.
 *
 * Not the site footer — this page ends with its own slim block: an oversized wordmark with
 * a small "by Rogo" tucked under its right edge. The layout is one row containing a single
 * `flex:1 0 0; width:1px` column aligned to `flex-end`, which is the same width-collapse
 * trick `why-rogo` uses on the home page: `width:1px` plus `flex-grow` makes the column
 * take its size from the row rather than from its content.
 *
 * ⚠️ THE WORDMARK IS A DEVIATION. The original ships it as a 2008x859 PNG
 * (aspect 2.3376) on framerusercontent.com. That is rogo's artwork, and this repo already
 * deleted rogo's hero video for exactly this reason once it went public — so it is SET IN
 * TYPE here instead of being downloaded. The 2.3376 aspect is preserved as the box's shape
 * so the block's height is the original's; only the glyphs are ours.
 */

export default function ClixFelixFooter() {
  return (
    <section
      data-nav-theme="light"
      className="relative z-[1] flex h-min w-full flex-col items-center justify-center
                 gap-[108px] overflow-clip bg-paper px-4 pt-32 pb-10
                 tablet:px-10 tablet:py-16
                 desktop:pt-24 desktop:pb-20"
    >
      {/* Width Container — row, centred, gap 0 */}
      <div className="relative flex h-min w-full max-w-[var(--container-max)] flex-row
                      items-center justify-center overflow-visible">
        {/* `flex:1 0 0; width:1px` — see the header note. gap 24, content to the right. */}
        <div
          className="relative flex h-min flex-col items-end justify-center gap-6 overflow-visible"
          style={{ flex: "1 0 0", width: "1px" }}
        >
          <div
            className="pointer-events-none w-full select-none overflow-clip"
            style={{ aspectRatio: "2.337601862630966" }}
            aria-hidden="true"
          >
            <span
              className="flex h-full w-full items-center justify-center font-display
                         leading-none text-ink/[0.08]"
              style={{
                /* Fluid so the wordmark fills the 2.3376 box at every tier, the way a
                   scaled bitmap would. */
                fontSize: "clamp(72px, 30vw, 420px)",
                letterSpacing: "-0.05em",
              }}
            >
              Felix
            </span>
          </div>

          <p
            className="h-auto w-auto flex-none whitespace-pre font-sans text-[28px] font-medium"
            style={{
              /* muted at 30% — inlined in the original as `rgba(115,115,115,0.3)`. */
              color: "rgba(115, 115, 115, 0.3)",
              letterSpacing: "0px",
              lineHeight: "100%",
            }}
          >
            by Rogo
          </p>
        </div>
      </div>
    </section>
  );
}
