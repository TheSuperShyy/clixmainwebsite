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
| 1 | `nav` | `review` | Banner + both header layouts + mobile panel |
| 2 | `hero` | `review` | Headline / tagline / CTA over a looping background montage |
| 3 | `logo-carousel` | `review` | 14-logo GSAP marquee — renders *inside* the hero |
| 4–8 | testimonials · why-rogo · by-the-numbers · security · footer | `todo` | |

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

Three findings that are easy to get wrong and are documented in full under `features/`:

- **The banner and the header switch at different breakpoints** — 810px and 1200px. So
  810–1199.98 is a *centred* banner over a *hamburger* header.
- **The logo carousel is not a sibling section.** It is absolutely positioned inside
  `<section id="hero">`, 248px tall against the bottom edge.
- **The hero `Darken` gradient stop is 85% at every tier except 810–1199.98**, which is 80% —
  a single override, not a phone-vs-desktop split.

## Deviations from 1:1

Intentional, and each documented where it applies:

- **Hero background** — an Israeli sunset montage (Pexels, commercial-use) in place of the
  original's NYC skyline, plus a copy scrim the original does not have.
  → `features/hero/FEATURE.md`
- **Accessibility floors** the original lacks — `prefers-reduced-motion` handling, and the
  first pass of carousel logos exposed to assistive tech rather than all of them
  `aria-hidden`. → `features/logo-carousel/FEATURE.md`

## Note on assets

`public/fonts/` and `public/logos/` are the target's own webfonts and its customers'
trademarks, vendored to keep the clone honest. They belong to their respective owners and
are here for this study only — not for reuse.

The target's own hero video and poster are **deliberately not in this repo** (`.gitignore`d);
they are kept locally as a grading reference only.
