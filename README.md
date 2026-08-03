# clixmainwebsite

A **pixel-faithful, section-by-section clone** of [rogo.ai](https://rogo.ai), built as a
fidelity exercise. Every spacing, type and colour value is measured from a frozen capture of
the target rather than eyeballed, and each one's provenance is recorded.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4
(CSS-first `@theme`, no config file) · GSAP · Turbopack.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Status

| # | Section | Status | Notes |
|---|---|---|---|
| 1 | `nav` | `review` | Banner + both header layouts + mobile panel + section-aware bar |
| 2 | `hero` | `review` | Headline / tagline / CTA over a looping background montage |
| 3 | `logo-carousel` | `review` | 14-logo GSAP marquee — renders *inside* the hero |
| 4 | `testimonials` | `review` | One-open accordion — 3-column row at ≥1200, stack below |
| 5 | `why-rogo` | `review` | Sticky headline beside 5 differentiator items — CSS only |
| 6 | `by-the-numbers` | `review` | 3 stat rows on a `card` panel — static, no count-up |
| 7 | `security` | `review` | 5 compliance badges in a 5→2→1 column bordered grid |
| 8 | `footer` | `review` | Closing CTA + 4 link columns + copyright, all inside `<footer>` |

**All eight home-page sections are built.** None is `done` — see the status note below.

`review` means built and building clean, but **not yet visually diffed against the reference
at all four breakpoints**. Nothing here is claimed as `done`. Per-section acceptance
checklists and open questions live in `features/<slug>/FEATURE.md`.

## Layout

```
docs/         PROJECT · CONTEXT (daily log) · SECTIONS (registry) · DESIGN-SYSTEM
              WORKFLOW · SKILLS · reference/target (the frozen capture)
features/     one folder per section: FEATURE.md (spec) + CONTEXT.md (memory)
src/          the Next.js app
public/       fonts, customer logos, hero video — see public/README.md
CLAUDE.md     operating rules for this repo
```

Start at [CLAUDE.md](CLAUDE.md); it has a routing table so you read only what a task needs.

## Things worth knowing

Findings that are easy to get wrong and are documented in full under `features/`:

- **The banner and the header switch at different breakpoints** — 810px and 1200px. So
  810–1199.98 is a *centred* banner over a *hamburger* header.
- **The logo carousel is not a sibling section.** It is absolutely positioned inside
  `<section id="hero">`, 248px tall against the bottom edge.
- **The hero `Darken` gradient stop is 85% at every tier except 810–1199.98**, which is 80% —
  a single override, not a phone-vs-desktop split.
- **On a Framer multi-variant component, only the variant that actually renders is
  authoritative.** The testimonial quote is 20px below 1200px — but the collapsed mobile
  cards in the capture still say 28px, and only the *open* one says 20px. The footer makes
  this worse: it ships five variants and mounts three, and one of the dead two declares a
  2-up grid on the link row that reads exactly like the tablet rule. **Check which variant a
  rule names before recording its value.**
- **A nested Framer component gets its own tier-gating hashes.** The footer's are
  `hidden-1leoyz4`/`16n7npo`/`d23fwj`/`1roolzl` against the page's
  `hidden-11hyp1n`/`9nhpe8`/`1eq4joi`/`l1t773` — same four media queries, different names.
  Re-derive them per component; reusing the page's map fails silently.
- **The capture has exactly two authored transitions, and one of them is in a style
  preset.** The nav banner's `color .3s cubic-bezier(.44,0,.56,1)` is the only one in page
  CSS; the footer link preset carries the same curve plus a hover colour. Grep the presets
  before calling a timing unmeasurable.
- **A capture can prove a state exists and still withhold every value in it.** The nav's
  scrolled variant is in the stylesheet; its only declared difference from the at-rest one
  is `overflow:visible`, because Framer applies variant colours inline from JS. Structure
  comes from the capture, state comes from the live site.
- **`width:1px` next to `flex:1 0 0` is not dead CSS.** Framer writes it on every equal
  column. Flex-basis is 0 so the width never sizes anything — but it caps the item's
  automatic minimum size, which is the only thing stopping long content from widening its
  own column. Delete it and the split drifts. → `features/why-rogo/FEATURE.md`
- **`overflow:clip` is not a synonym for `overflow:hidden`** when a descendant is
  `position:sticky`. `hidden` makes the ancestor a scroll container and the stick dies;
  `clip` doesn't. The capture uses `clip` throughout for exactly this reason.
- **Framer's per-tier type is not monotonic.** `why-rogo`'s item headings are 28px at
  810–1199.98 and 24px at ≥1200 — the *tablet* tier is the large one. Trace each `hidden-*`
  gating class to its media query; never assume a phone→desktop ramp.
- **A Framer variant that declares no line-height means `1.2em`, not the browser's
  `normal`.** For ABC Arizona Mix that is a 0.3em difference and it fails silently. Give
  every font-size an explicit `leading-*`. → `features/by-the-numbers/CONTEXT.md`
- **Numbers that look arbitrary are often a decomposition of the container.** A stat row's
  two cell caps are `844px` and `436px` — which sum to `--container-max` `1280px`, so both
  bind at once and the caption column never drifts. Check the sum before calling one a
  one-off.
- **Framer paints `data-border` on an `::after` overlay, not the box model.** A declared
  height is the full height, borders included, and adding or removing one reflows nothing —
  which is how `security`'s grid outline ends up ragged below 1200px in the original without
  anyone noticing. → `features/security/FEATURE.md`

## Deviations from 1:1

Intentional, and each documented where it applies:

- **The brand is clix, not rogo** (2026-08-03) — logo, favicon, `<title>`, footer copyright,
  and the product name throughout the copy. Layout, type and spacing are still graded
  against the capture; only the identity moved. **The three testimonial quotes are the one
  exception and still say "Rogo" on purpose** — they are real statements by named executives
  at real firms, and renaming the product inside one fabricates an endorsement. That whole
  section is rogo's customer material and needs replacing, not renaming.
  → `features/testimonials/CONTEXT.md`
- **Outbound links are `#` placeholders.** The originals pointed at rogo's real mailboxes,
  LinkedIn, X and product login — under a clix brand those send a prospect to another
  company, which is worse than a dead link. They need clix's own destinations.
- **Hero background** — an Israeli sunset montage (Pexels, commercial-use) in place of the
  original's NYC skyline, plus a copy scrim the original does not have.
  → `features/hero/FEATURE.md`
- **The nav bar goes dark over the dark sections** (`security`, `footer`) rather than
  staying white. Requested 2026-08-03; **not observed on the live site**, so it may be a
  divergence rather than a clone. Each section declares its own `data-nav-theme`, so the nav
  never holds a list of section names. → `features/nav/FEATURE.md`
- **Accessibility floors** the original lacks — `prefers-reduced-motion` handling, and the
  first pass of carousel logos exposed to assistive tech rather than all of them
  `aria-hidden`. → `features/logo-carousel/FEATURE.md`

## Note on assets

`public/fonts/` and `public/logos/` are the target's own webfonts and its customers'
trademarks, vendored to keep the clone honest. They belong to their respective owners and
are here for this study only — not for reuse.

The target's own hero video and poster are **deliberately not in this repo** (`.gitignore`d);
they are kept locally as a grading reference only.

The favicon and app icons (`src/app/icon.png`, `apple-icon.png`, `favicon.ico`) are the **clix
mark**, not the target's — the same reasoning as the `<title>`. They are keyed to a transparent
background from an uploaded raster; the luminance ramp and why it is overdriven are recorded in
[docs/CONTEXT.md](docs/CONTEXT.md) under 2026-08-03.
