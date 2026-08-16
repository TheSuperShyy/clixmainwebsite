/**
 * clix logo mark — the hexagon-C with the star and cursor, shown left of the wordmark in
 * the nav. Added 2026-08-07 (user: "add clix logo in the left of the clix word on the
 * navbar").
 *
 * SOURCE. The real company site ships this as `/clix-logo.png` and **nothing else** — every
 * `rel="icon"`, the apple-touch-icon and `og:image` all point at that one PNG, and there is
 * no SVG of the mark anywhere in the site's markup. So the raster IS the brand asset; this
 * is not a case of picking the lazy format.
 *
 * WHY IT IS A CSS MASK AND NOT AN <img>. The nav's palette is three-way — paper content over
 * the hero and over dark sections, ink content over light ones — and the wordmark beside this
 * transitions between them. A PNG cannot do that: it is a fixed `#303641` silhouette and
 * would go invisible against the dark sections. The alternative was tracing the bitmap to
 * SVG, which means redrawing a logo by eye.
 *
 * Measured instead (decoded to a canvas, all 262,144 pixels):
 *   · background fully transparent — 160,060 px at alpha 0, all four corners 0,0,0,0
 *   · the mark is ONE flat colour — 89,197 of ~89,310 opaque px are `#303641`
 *   · 12,774 partial-alpha px, i.e. edge antialiasing and nothing else
 *   · ink bounding box 480x440 inside the 512 square (16px side / 36px top-bottom padding)
 *
 * A flat single-colour silhouette on transparent is exactly the case a mask handles
 * perfectly: `mask-image` uses only the alpha channel, so `background-color: currentColor`
 * paints the true shape in whatever colour the nav is currently in, antialiasing included.
 * Zero redraw, zero fidelity loss, and it inherits the colour transition for free.
 *
 * THE ASSET. `public/clix-mark.png` is cropped to that 480x440 ink box (so the element's box
 * IS the mark, with no baked-in padding to align around) and downscaled to 96x88 — 4x the
 * 24px it renders at, which covers 3x DPR. RGB is flattened to white by `geq` since a mask
 * reads only alpha; that drops it from 9.8 KB to 4.6 KB. Regenerate with:
 *
 *   ffmpeg -i docs/brand/clix-mark-512.png -vf "crop=480:440:16:36,scale=96:88:flags=lanczos,\
 *     format=rgba,geq=r=255:g=255:b=255:a='alpha(X,Y)'" -pix_fmt rgba public/clix-mark.png
 *
 * ⚠️ The source above is `docs/brand/clix-mark-512.png`, NOT `src/app/icon.png` — it was the
 * latter until 2026-08-16, when the app icons were rebuilt from the plated brand JPEG so the
 * Google-results favicon would stop being a transparent silhouette. `icon.png` now has no
 * alpha channel and different padding, so the crop numbers above only hold for the 512
 * transparent master, which was moved to `docs/brand/` for exactly this reason.
 *
 * `aria-hidden` always: the <Link> wrapping this already carries `aria-label="clix home"`,
 * and the wordmark beside it is the visible name. A third label would just be noise.
 */

/** The cropped asset's own aspect — 96 x 88. Width is derived so `size` means HEIGHT. */
const ASPECT = 96 / 88;

export default function ClixMark({
  size = 20,
  className = "",
}: {
  /**
   * Rendered height. A number is px; a CSS length string is passed through, which is what
   * /product's workflow mocks need — they scale with a container query, so their mark's
   * height is `calc(...)` and cannot be resolved to a number at render time.
   */
  size?: number | string;
  className?: string;
}) {
  const url = "url(/clix-mark.png)";
  const width = typeof size === "number" ? size * ASPECT : `calc(${size} * ${ASPECT})`;
  return (
    <span
      aria-hidden="true"
      className={`inline-block flex-none ${className}`}
      style={{
        width,
        height: size,
        /* The paint. Everything below is the stencil. */
        backgroundColor: "currentColor",
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
