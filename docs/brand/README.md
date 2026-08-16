# Brand assets

Ours, not the target's. Everything else under `docs/reference/` is rogo.ai material captured
for fidelity grading; this folder is the opposite — it is what makes the build identify as
itself. See the `<title>` note in `src/app/layout.tsx` for the same reasoning.

## `clix-logo.png`

The logo master, as uploaded 2026-08-03. 1728×2304, dark mark on an off-white field.

Tracked because **the app icons were derived from it and cannot be regenerated without it**.
It is the provenance for `clix-mark-512.png` below, and was the provenance for the app icons
until 2026-08-16 — see `public/company/clix-brand-logo.jpeg` for what replaced it there.

The recipe is recorded in `docs/CONTEXT.md` under 2026-08-03. The parts that are not obvious:

- **Transparency is keyed on luminance**, not on matching a background colour — alpha ramps
  from 246 down to 54 (measured: corners 247–255, mark mean `rgb(48,54,65)`), so antialiased
  edges survive instead of being hard-thresholded into stairsteps.
- **The ramp is overdriven ×1.3.** The upload's dark mass is not flat; it carries
  low-frequency compression mottle across luma 48–80, which a straight ramp turns into
  blotchy *alpha* — invisible on white, obvious on a dark browser tab. Saturating everything
  below luma ~98 fixes it. Safe because the histogram is empty between 96 and 208, so it
  cannot touch a real edge.
- Crop is the mark's own bbox (219,561)–(1504,1739), squared on its centre at 1389px with 8%
  padding. Tight on purpose: a transparent icon has no background plate, so margin is just
  lost pixels at 16px.

## `clix-mark-512.png`

The 512×512 **transparent** silhouette keyed off `clix-logo.png` by the ramp described above.
It was `src/app/icon.png` from 2026-08-03 to 2026-08-16; it lives here now because
`public/clix-mark.png` — the nav's CSS mask — is cropped out of it, and a mask reads only
alpha, so the plated JPEG that took over the icon slot cannot produce it. The crop is in
`src/components/ui/ClixMark.tsx`.

## `../../public/company/clix-brand-logo.jpeg`

Uploaded 2026-08-16. 1000×1000, the same dark mark on an `rgb(250,250,248)` plate, ~18%
padding on every side (ink bbox 653×616 at 177,190).

**This is now the provenance for `src/app/icon.png` (512), `apple-icon.png` (180) and
`favicon.ico` (16/32/48, PNG payloads in an ICO container).** The reason is Google: a search
result renders the favicon on the SERP's own background, and the transparent `#303641`
silhouette that shipped before vanished into dark mode. A baked plate is opaque in both
themes. Downscaled as supplied — **no re-crop, no re-pad**: the padding is the JPEG's own, and
tightening it (the mark spans 65% of the canvas, so ~10px of ink at 16px, which is mush) is a
live option that was deliberately not taken unasked.

**The plate is masked to a circle** in `icon.png` and in every `favicon.ico` entry, at the
user's request. Safe to inscribe at `r = size/2`: the mark's half-diagonal is ~449px against
a 500px radius, so the cut only ever removes empty plate. `apple-icon.png` is left SQUARE on
purpose — iOS masks a touch icon itself and flattens transparency onto black first, so a
pre-cut circle would ship with black corners.

Regenerate with the script recorded in `docs/CONTEXT.md` under 2026-08-16.

## The wordmark

Not a file — it is **Inter Bold**, set in type. Identified from the user's logo lockup by
comparing ink-width ÷ cap-height for C, L, I and X against 16 candidate faces; Inter 700 won
at err 0.0209 against 0.0275 for the runner-up. Inter is already vendored in `public/fonts/`,
so the logo needs no additional licence. Implementation and the measured tracking live in
`src/components/ui/ClixWordmark.tsx`.
