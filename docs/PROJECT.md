# Project

## Target

| Field | Value |
|---|---|
| Target URL | <https://rogo.ai/> |
| Reference captured on | 2026-08-02 |
| Local capture | [docs/reference/target/](reference/target/) — full HTML + extracted CSS |
| Locale / language | en-US, single locale |
| Built with | **Framer** (all CSS inline, no external stylesheets) |
| Reference viewport widths | 1600 · 1440 · 1024 · 390 — see *Breakpoints* below |

Rogo is a financial-AI product site. One long landing page plus secondary pages
(Product, Security, Company, Customers, News, Careers). **Scope for now: the home page.**

## Goal

Reproduce the target site section by section at a fidelity where a side-by-side comparison
shows no visible difference in layout, spacing, typography, color, or motion.

## Non-goals

- Backend, CMS, auth, or real data — static content matching the original unless stated.
- Redesign or "improvement" of the original. Deviations are defects unless explicitly
  approved and recorded in the relevant `FEATURE.md`.
- ~~Placeholdering licensed assets.~~ **Superseded 2026-08-02 — see *Fidelity policy*.**

## What the target is built with

The site is a **Framer** export. Three consequences, all in our favor:

1. **All CSS is inline** in five `<style>` blocks — 162 KB, captured locally. There is no
   external stylesheet to fetch and no build step hiding values.
2. **Every text node carries its own CSS custom properties.** A heading arrives as
   `--framer-font-size:64px; --framer-letter-spacing:-0.05em; --framer-line-height:95%`.
   Measurement is therefore **mechanical extraction, not eyeballing** — read the value out
   of the capture rather than sampling a screenshot.
3. **The design tokens are published as CSS variables** (`--token-<uuid>: #f5f2eb`). The
   original's palette is known exactly, not approximated. Transcribed into
   [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

Screenshots are still required for visual diffing in WORKFLOW step 5 — but they are the
*check*, not the *source*. The capture is the source.

## Breakpoints — target vs. our reference widths

Framer emits four tiers:

| Tier | Range | Our capture width |
|---|---|---|
| Desktop XL | `≥ 1600px` | **1600** |
| Desktop | `1200 – 1599.98px` | **1440** |
| Tablet | `810 – 1199.98px` | **1024** |
| Phone | `≤ 809.98px` | **390** |

The original scaffold assumed 1440 / 1024 / 768 / 390. That mapping is wrong against this
target: **768 and 390 land in the same Framer tier** (so 768 tests nothing 390 doesn't),
while the `≥1600px` tier would have gone entirely uncovered.

**Decision:** capture widths are now **1600 · 1440 · 1024 · 390** — one per tier.
768 is retained as a *spot-check only*, to confirm fluid behavior in the middle of the
phone tier, and is not a required reference screenshot.

Note the tier boundaries are `.98` values, and Framer's own media queries are inconsistent
about it (`max-width:1199.98px` in one block, `max-width:1199px` in another). Match the
`.98` form; it is what governs the layout rules.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Scroll / timeline animation | GSAP + ScrollTrigger (via the `gsap` skill) |
| Component / gesture animation | Motion (Framer Motion) (via the `framer-motion` skill) |
| Fonts | `next/font` — sources recorded in DESIGN-SYSTEM.md |
| Package manager | npm |

The target being a Framer site means its motion is **Framer Motion** under the hood. Our
`framer-motion` skill is therefore the primary animation tool here, with `gsap` reserved
for the scroll-driven pieces (logo carousel, scroll reveals) where ScrollTrigger is the
better instrument. Precedence rule: [SKILLS.md](SKILLS.md).

## Fidelity policy — 1:1

**Set by the user on 2026-08-02: the clone is 1:1 with the reference.** No substituted
fonts, no placeholder logos, no "close enough" approximations. Where a value can be taken
from the original, it is taken — not re-derived.

Consequences, now in force:

- **Real fonts are vendored.** 57 `.woff2` files pulled from the original and verified
  (woff2 magic bytes on every one) → [public/fonts/](../public/fonts/), 1.0 MB.
  [src/app/fonts.css](../src/app/fonts.css) reproduces all 57 `@font-face` declarations
  **verbatim** —
  weights, styles, `font-display`, and `unicode-range` copied from the capture, with only
  `url()` rewritten to local paths. Regenerate it from the capture; don't hand-edit.
- **Real logos are vendored.** All 14 customer logos → [public/logos/](../public/logos/),
  extracted as inline SVG path data from the capture. Nothing was traced or redrawn.
- **No `FEATURE.md` deviation rows for assets.** That column now exists only for genuine
  one-off values in the original, not for our substitutions — there are none.

### Which fonts actually render here

The Framer project *declares* 14 families, but only **two are applied to text on the home
page**. The other twelve belong to other pages in the same project.

| Family | Applied to | Uses | License |
|---|---|---|---|
| **ABC Arizona Mix Regular** | all display type / headings | ×33 | Commercial — ABC Dinamo |
| **Inter** (incl. Inter Medium) | body and UI, 14px default | rest of page | OFL — free |

Body copy resolves via Framer's `--font-selector` (`SW50ZXItTWVkaXVt` → `Inter-Medium`) at
`14px / -0.02em / 1.5em`.

**BR Sonoma, Martina Plantijn, Rooftop, ABC Arizona Flare, Fragment Mono are declared but
never applied on this page** — do not treat their presence in the stylesheet as a design
decision. Fragment Mono is vendored anyway since it is free and may appear on a later page.

One factual note, recorded once and not re-litigated: ABC Arizona Mix is commercially
licensed, so a public deployment of this clone would need a license from ABC Dinamo. That
is a deployment question, not a build question — the build is 1:1 as specified.

Framer's `… Placeholder` families are metric-matched loading shims, not real faces. Ignore.

## Constraints

- Browser support: last 2 versions of Chrome/Edge/Safari/Firefox.
- Must be responsive across all four reference widths — no horizontal scroll at any width.
- Accessibility floor: keyboard operable, visible focus, WCAG AA contrast.

## Open questions

- [x] ~~Fonts — substitute or license?~~ → **1:1, real fonts vendored.** 2026-08-02
- [x] ~~Logos — reproduce or placeholder?~~ → **1:1, real SVGs vendored.** 2026-08-02
- [ ] **Scope** — home page only, or the secondary pages (Product, Security, Company,
      Customers, News, Careers) too?
- [ ] Is any section gated behind the "Log in" flow? Nothing observed so far.
