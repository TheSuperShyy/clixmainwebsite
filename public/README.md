# Vendored assets

Real assets taken from the target, per the **1:1 fidelity policy** in
[docs/PROJECT.md](../docs/PROJECT.md). Nothing here is a substitute, a trace, or a redraw.

## `fonts/` — 57 files, 1.0 MB

Pulled from the original's `@font-face` sources (`framerusercontent.com` and
`fonts.gstatic.com`). Every file was verified to start with the `wOF2` magic bytes.

The declarations live in [src/app/fonts.css](../src/app/fonts.css) (imported by
`globals.css`, so the bundler fingerprints them); the `.woff2` files stay here and are
referenced by absolute `/fonts/…` URLs.

`src/app/fonts.css` reproduces all 57 declarations **verbatim** from the capture — `font-weight`,
`font-style`, `font-display` and `unicode-range` preserved exactly; only `url()` was
rewritten to `/fonts/…`. Regenerate it from
[docs/reference/target/](../docs/reference/target/) rather than editing it by hand.

Only two families actually render on the home page — **ABC Arizona Mix Regular** (display)
and **Inter** (body/UI, 14px). The rest are declared by the Framer project for other pages.
Do not apply them to home-page sections.

> Serve these self-hosted. Do **not** swap Inter for `next/font/google` — the Google build
> is not byte-identical to the subset Framer ships, and substituting it breaks 1:1.

## `video/` — hero background

| File | What it is |
|---|---|
| `hero-tel-aviv.mp4` | **In use.** 1920×1080 · h264 · yuv420p · 24000/1001 fps · 15.015s · 360 frames · 6.52 MB |
| `hero-tel-aviv-poster.jpg` | Poster frame — frame 0 of the montage (`preload="none"` shows this first) |
| `hero-original.mp4` | **Local only — not in the repo.** The target's actual hero video (US flag over the NYC skyline), kept on disk as the fidelity baseline and grading reference. 6.55 MB |
| `hero-poster-original.jpg` | **Local only — not in the repo.** The target's actual poster frame |

> The two `*-original.*` files are `.gitignore`d. The running site never loads them — they
> exist only to grade against — and they are the target's own copyrighted media, so they are
> kept out of a public repo. Re-download from the live site if you need to re-grade.

**This is the one deliberate content deviation from 1:1**, requested on 2026-08-02: Israeli
sunset footage in place of the original's NYC skyline. Everything else in the hero — layout,
type, overlay, video attributes, crop anchor — matches the capture exactly.

Current build is a **four-clip sunset montage** (2026-08-02, sources chosen by the user).
It replaced an earlier Tel-Aviv-skyline-plus-Israeli-flag composite; the flag layer is gone,
so there is no longer an edge-anchored subject and `object-position` is back to the target's
own `50% 50%` at every tier.

All four sources are Pexels, free for commercial use, no attribution required
(Pexels Licence):

| # | Source | Content | Segment used |
|---|---|---|---|
| 1 | [pexels 854738](https://www.pexels.com/video/video-of-sunrise-854738/) | Tel Aviv skyline in silhouette, fiery orange horizon | t 2.00–6.95 |
| 2 | [pexels 18809616](https://www.pexels.com/download/video/18809616/) | Jaffa port + St Peter's clock tower, pink dusk over the sea | t 2.00–6.95 |
| 3 | [pexels 7259536](https://www.pexels.com/video/aerial-footage-of-a-city-in-sunset-7259536/) | Aerial, low sun on the horizon with flare | t 12.00–16.95 |
| 4 | [pexels 6618225](https://www.pexels.com/video/drone-footage-of-a-city-at-sunset-6618225/) | Drone over residential towers, sun between them | t 8.00–12.95 |

Order is tonal, not chronological — dark silhouette → warm port → bright flare → golden
towers → wraps back to dark. Adjacent segments were paired so each crossfade blends
between similar luminance.

```
# each segment: 4.95s, normalised to 1920x1080 @ 24000/1001
# clip 1 only — crop off a foreground obstruction riding the left edge
crop=1810:1018:110:31, scale=1920:1080:flags=lanczos

# clip 3 only — it reads cooler and hazier than the other three; warm it to match
colorbalance=rs=0.03:rm=0.05:bm=-0.05:bs=-0.04, eq=brightness=-0.045:saturation=1.12

# assemble: 1.2s crossfades at 3.75 / 7.5 / 11.25  ->  T = 16.2s
xfade=transition=fade:duration=1.2:offset=<above>

# seamless loop seal — crossfade the tail back onto the head, then drop the head
split -> [ma]trim=1.2:16.2  [mb]trim=0:1.2
[ma][mb]xfade=transition=fade:duration=1.2:offset=13.8     ->  15.015s, loops clean

# global unify
eq=contrast=1.04:saturation=1.06
libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart
```

> **The loop seal is the part worth keeping.** A plain A→B→C→D montage hard-cuts at the
> wrap. Crossfading the first 1.2s over the last 1.2s and then trimming that head off makes
> the last frame land on what the first frame already is, so `loop` is invisible. Output
> duration is `4·(d−x)` — four 4.95s segments with 1.2s fades give exactly 15.0s.

> **Do not revive the flag composite without reading the hero CONTEXT.** Two flag sources
> were tried and both failed structurally: a CG flag on a pole swung 588px in source space
> so no fixed crop held the frame edge, and a frame-filling close-up had no fabric edge of
> its own. The user's answer was to drop the flag and use sunset footage instead.

Play it with the original's own attributes, which are `loop muted playsinline
preload="none"` plus `object-fit:cover`, under the `Darken` overlay:
`linear-gradient(180deg,#15151500 85%,#151515 100%)` at `opacity:.4` (85% → 80% on the
phone tier).

## `logos/` — 14 files

Customer wall logos, extracted as inline SVG path data from the capture. **Five**
(`lazard`, `tigerglobal`, `moelis`, `nomura`, `raymond-james`) are `<use href="#…">`
references into the page's hidden defs block rather than inline SVG, and were resolved to
standalone files.

> **Those same five were all broken and were re-extracted on 2026-08-02.** Two separate
> faults, both worth recognising if a logo ever looks wrong again:
>
> | Files | Fault | Symptom |
> |---|---|---|
> | `lazard`, `tigerglobal`, `moelis` | def copied but its **`viewBox` was dropped** | An SVG with no `viewBox` does not scale — the art keeps its own coordinates and is simply **clipped** by the `<img>` box. Moelis is 218 units wide in a 103px box, so most of it disappeared. |
> | `nomura`, `raymond-james` | **wrong artwork entirely** | The `<use>` was resolved to the next *inline* `<svg>` in document order instead of to the def. `nomura` held Rothschild's mark (viewBox `182 30`), `raymond-james` held Truist's (`133 31`). |
>
> Re-extraction resolves each `href="#id"` against the real defs block and authors a wrapper
> carrying `xmlns`, the correct `viewBox`, and intrinsic `width`/`height`. Path data is still
> verbatim.

> **A third fault, in the other nine files: a duplicate `xmlns` attribute on the root.**
> The capture's inline `<svg>` already declared `xmlns`; extraction prepended another, so
> every inline-sourced logo carried it twice. **A duplicate attribute is a fatal XML
> well-formedness error**, and SVG loaded through `<img>` is parsed as strict XML — so all
> nine failed to render entirely. Fixed by dropping every root `xmlns` after the first.

### Validating these files

Structural checks are **not sufficient** — a file can have a `viewBox`, balanced tags and a
white fill and still be unparseable. The only real test is to rasterise it:

```js
await sharp(fs.readFileSync(file), { density: 200 }).png().toBuffer();  // throws if malformed
```

Rules that come out of the three faults above:

1. **Every logo SVG must have a `viewBox`** — without one it cannot scale; the art keeps its
   own coordinates and is clipped by the `<img>` box.
2. **Exactly one `xmlns` on the root** — a second one is fatal.
3. **Rasterise to verify**, and check the result is not blank (a `clip-path` referencing a
   def that didn't come across will parse fine and render nothing).

All three failure modes are **silent**: nothing throws, `npm run build` passes, `eslint`
passes, and the asset is simply wrong or absent on screen.

All are white-fill variants (`Logo … White` in the original), intended for the dark
carousel. `viewBox` values are preserved from the source — keep them; the carousel sizes
logos by height and relies on their intrinsic aspect ratios.

| | | | |
|---|---|---|---|
| arma-partners | baird | bnp-paribas | canaccord |
| hcw | jefferies | lazard | leerink |
| moelis | nomura | raymond-james | rothschild |
| tigerglobal | truist | | |

## `badges/` — 5 files, 83 KB

Compliance marks for `#security`, extracted 2026-08-03. All five are `#6D6D6D` /
`rgb(109,109,109)` line art on the section's `ink` background.

| File | Source in the capture | Bytes | viewBox |
|---|---|---|---|
| `soc2.svg` | `<use href="#svg785812565_46827">` | 46,926 | `0 0 120 120` |
| `ccpa.svg` | `<use href="#svg-1130630889_6001">` | 6,025 | `0 0 121 120` |
| `iso-27001.svg` | `<use href="#svg-229124054_6985">` | 7,046 | `0 0 121 120` |
| `gdpr.svg` | inline `background-image:url('data:image/svg+xml,…')` | 10,997 | `0 0 102 102` |
| `eu-ai-act.svg` | inline `background-image:url('data:image/svg+xml,…')` | 12,314 | `0 0 102 102` |

> **Two delivery mechanisms in one row of five.** The first three are `<use>` references into
> the defs block; the last two are data-URI CSS backgrounds. The same split shows up in the
> labels — GDPR and EU AI Act declare `font-weight:500`, the other three don't. Almost
> certainly two authoring sessions. Both are normalised to plain files here.

`soc2.svg` is 46 KB because it is the real AICPA seal, with every glyph of
"AICPA Service Organization Control Reports" and "Formerly SAS 70 Reports" as outlined
curved text. It is not a redraw and should not be simplified.

The three `<use>`-sourced files carried **no `xmlns`** (the defs block inherits it from the
page's root `<svg>`). One was added to each — the mirror image of the logo bug above, where
extraction produced *two*. Same rule either way: **exactly one `xmlns` on the root.**

All five were validated by rasterising through `sharp` at density 300 and eyeballing a
contact sheet, per the rules above — not by grepping.
