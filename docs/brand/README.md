# Brand assets

Ours, not the target's. Everything else under `docs/reference/` is rogo.ai material captured
for fidelity grading; this folder is the opposite — it is what makes the build identify as
itself. See the `<title>` note in `src/app/layout.tsx` for the same reasoning.

## `clix-logo.png`

The logo master, as uploaded 2026-08-03. 1728×2304, dark mark on an off-white field.

Tracked because **the app icons are derived from it and cannot be regenerated without it**.
It is the provenance for `src/app/icon.png`, `apple-icon.png` and `favicon.ico`.

To regenerate those, the recipe is recorded in `docs/CONTEXT.md` under 2026-08-03. The parts
that are not obvious:

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

## The wordmark

Not a file — it is **Inter Bold**, set in type. Identified from the user's logo lockup by
comparing ink-width ÷ cap-height for C, L, I and X against 16 candidate faces; Inter 700 won
at err 0.0209 against 0.0275 for the runner-up. Inter is already vendored in `public/fonts/`,
so the logo needs no additional licence. Implementation and the measured tracking live in
`src/components/ui/ClixWordmark.tsx`.
