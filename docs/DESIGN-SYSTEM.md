# Design System

Single source of truth for tokens, extracted **by measurement** from the target site.
Every value here must also exist in the `@theme` block of
[src/app/globals.css](../src/app/globals.css). Components use tokens, never raw hex or
one-off pixel values.

> **Tailwind v4** — there is no `tailwind.config.ts`. Tokens are declared CSS-first in
> `@theme`, and Tailwind generates the utilities and variants from them (`--color-ink` →
> `bg-ink`/`text-ink`, `--breakpoint-tablet` → the `tablet:` variant).

If a section needs a value that isn't here: add it here first, then to `@theme`,
then use it. If it's genuinely a one-off in the original, record it in that section's
`FEATURE.md` as a documented deviation instead of polluting the scale.

> **Source:** <https://rogo.ai/> home page, captured 2026-08-02 →
> [docs/reference/target/](reference/target/). Values below were extracted from the
> capture's CSS and inline custom properties, **not sampled from screenshots**.
> Frequency counts (`×N`) are occurrences in the capture — they indicate what is a real
> scale value versus what is a one-off.

---

## Color

Framer publishes its palette as CSS variables. The home page defines **18 tokens but only
uses 6** — the rest belong to other pages in the same Framer project.

### In use on the home page

| Token | Value | Uses | Role |
|---|---|---|---|
| `ink` | `#151515` | ×148 | primary text, dark section backgrounds |
| `paper` | `#ffffff` | ×130 | white text on dark, light backgrounds |
| `muted` | `#737373` | ×49 | secondary / supporting text |
| `ink-soft` | `#383838` | ×6 | softened dark — borders, secondary surfaces |
| `surface` | `#f5f5f5` | ×2 | light surface fill |
| `hairline` | `#a8a29e33` | ×2 | warm gray @ 20% — dividers, card borders |
| `banner` | `#211e1e` | ×1 | announcement banner background (`rgb(33,30,30)`) |
| `hairline-light` | `#ffffff26` | ×1 | white @ 15% — header bottom border below 1200px |
| `canvas` | `#f7f7f7` | ×1 | testimonials section background |
| `card` | `#eeedec` | ×3 | testimonial card fill (`rgb(238,237,236)`) |
| `ink-wash` | `rgb(21 21 21 / .05)` | ×6 | ink @ 5% — plus-button fill |

**The home page is monochrome.** No brand color appears on it. Do not introduce one.

`banner` and `hairline-light` were added 2026-08-02 while building `nav`; `canvas`, `card`
and `ink-wash` on 2026-08-03 while building `testimonials`. **None of the five is a Framer
*token*** — all are literal values Framer inlined on the element rather than publishing as
variables. They are tokenized here anyway because each recurs across a section's tiers and
§7 forbids stray hex in components.

`canvas` `#f7f7f7` is **not** `surface` `#f5f5f5`. Two different near-whites, two
different uses; do not collapse them.

> **`hairline` is exactly `rgba(168,162,158,0.2)`.** The nav's inner header border is
> written that way in the capture; `0x33` = 51/255 = 0.2, so it is the same value and
> **must reuse the token** rather than being re-inlined.

### Defined but unused here

Present in the Framer project, zero uses on the home page. Recorded so a later page
doesn't cause them to be re-derived — **do not use them on home-page sections**.

`#f5f2eb` bone · `#135b45` deep green · `#19a26c` green · `#0f2822` near-black green ·
`#1a2a25` green-gray · `#0071c1` blue · `#d94636` terracotta · `#1c1c1c` · `#8b8b8b` ·
`#ffffff00` transparent · `#ffffffcc` white 80% · `#737373` (duplicate token, same value)

Dark mode: **no** `prefers-color-scheme` support in the original. Sections are individually
light or dark by design, not theme-switched.

## Typography

**Type scale observed** (px): 108 · 96 · 64 · 56 · 48 · 44 · 40 · 36 · 32 · 28 · 24 · 20 ·
18 · 16 · **14** · 13 · 12.

`14px` dominates at ×70 — it is the UI/body default. `13px` appears once and is a one-off,
not a scale step. The large end (108/96/64) is display type; which size lands at which
breakpoint is **per-section measurement**, since Framer ships a separate DOM per tier.

| Property | Values observed | Notes |
|---|---|---|
| Line-height | `1.5em` ×77 · `1.3em` ×23 · `1.1em` ×12 · `105%` ×9 · `1em` ×8 · `125%` ×8 · `1.4em` ×6 · `95%` ×3 | `1.5em` = body. Display type uses sub-1 unitless/percent values. |
| Letter-spacing | `-0.02em` ×97 · `-0.01em` ×26 · `-0.05em` ×15 · `-0.04em` ×9 · `-0.03em` ×7 | **All negative.** Tight tracking is a defining trait of this design — never ship `0`. |

The capture contains inconsistent authoring (`-.04em` vs `-0.04em`, a stray `-0.1px`).
Normalize to the `-0.0Nem` form; the computed result is identical.

### Measured — hero H1

Verbatim from the capture, as an example of the required precision:

```
font-family:    "ABC Arizona Mix Regular"
font-size:      64px
letter-spacing: -0.05em
line-height:    95%
text-align:     center
color:          #ffffff
```

### Fonts — vendored 1:1, no substitutions

Only **two families are actually applied to text on the home page**. The Framer project
declares fourteen; the rest belong to other pages and must not be used here.

| Family | Role | Uses | Source |
|---|---|---|---|
| **ABC Arizona Mix Regular** | all display type / headings | ×33 | vendored `.woff2` |
| **Inter** / Inter Medium | body + UI, 14px default | rest of page | vendored `.woff2` |

`.woff2` files live in [public/fonts/](../public/fonts/); the declarations are in
[src/app/fonts.css](../src/app/fonts.css) (imported by `globals.css`), which
reproduces all 57 `@font-face` declarations verbatim from the capture (weight, style,
`font-display`, `unicode-range` preserved; only `url()` rewritten).

**Do not route these through `next/font/google`.** Inter from Google is not byte-identical
to the subset Framer serves, and swapping it would break 1:1. Self-host the vendored files.

Also vendored but **not applied on this page** — available for later pages, not for home:
Fragment Mono, Inter Display Medium/SemiBold. Declared in the original but never applied
anywhere we've measured: BR Sonoma, Martina Plantijn, Rooftop, ABC Arizona Flare.

Ignore any family ending in `Placeholder` — Framer's metric-matched loading shims.

## Spacing

**The original is not on a clean 8pt grid.** Gap values in the capture:

`0` ×18 · `10px` ×10 · `8px` ×6 · `24px` ×5 · `4px` ×5 · `40px` ×5 · `16px` ×5 · `32px` ×5 ·
`12px` ×4 · `108px` ×4 · `56px` ×4 · `28px` ×3 · `48px` ×2 · `80px` ×2 · `72px` ×2 ·
`88px` ×1 · `164px` ×1

The small end is a 4pt scale (4/8/12/16/24/32/40/48). `10px` (×10) breaks it and is real,
not noise. The large end (56/72/80/88/108/164) is **section-specific rhythm**, not a scale
— take those per section from `FEATURE.md`, don't tokenize them.

| Token | Value | Used for |
|---|---|---|
| `container-max` | **1280px** ×9 | main content container |
| `measure-wide` | `1100px` | wide text block |
| `measure` | `844px` | headline / paragraph measure |
| `gutter` | `16px` (`padding: 0 16px`) | horizontal page padding — **verify per breakpoint** |
| `section-y` | per section | e.g. `padding: 0 0 72px` observed; not uniform |

## Radius · Shadow · Border

| Token | Value | Notes |
|---|---|---|
| `radius-none` | `0px` ×9 | **the default — this is a sharp-cornered design** |
| `radius-pill` | `10000px` ×2 | buttons / badges |
| `radius-sm` | `6px` ×1 | single one-off |
| `border` | `#a8a29e33` hairline | |
| Shadows | none found in the capture | flat design; confirm visually per section |

## Breakpoints

Framer's real tiers — **not Tailwind defaults**, and not the widths this repo originally
assumed. Full rationale in [PROJECT.md](PROJECT.md).

| Name | Media query | Capture width |
|---|---|---|
| `xl` | `≥ 1600px` | 1600 |
| `desktop` | `1200 – 1599.98px` | 1440 |
| `tablet` | `810 – 1199.98px` | 1024 |
| `phone` | `≤ 809.98px` | 390 |

Tailwind is min-width based, so these become `sm`-style min-width breakpoints at
**810 / 1200 / 1600**. Keep the `.98` upper bounds where a max-width query is needed.

## Motion

⚠️ **Motion cannot be extracted from the CSS on this target.** The site is Framer, so
animation runs through Framer Motion in JS — the stylesheet contains exactly **one**
transition:

```
color .3s cubic-bezier(.44, 0, .56, 1)
```

That easing — `cubic-bezier(.44, 0, .56, 1)`, a symmetric ease-in-out — is the only
authored curve visible, and is the best available default for hover/color transitions.

Everything else (scroll reveals, the logo carousel, testimonial open/close, any stat
count-up) must be measured **by observation** — record trigger, duration, easing, stagger
and scroll offsets in each section's `FEATURE.md`. Do not copy timings from this file for
those; there is nothing here to copy.

| Token | Duration | Easing | Used for |
|---|---|---|---|
| `hover` | `0.3s` | `cubic-bezier(.44,0,.56,1)` | color/hover transitions — **extracted** |
| `reveal` | `TBD` | `TBD` | scroll reveals — observe |
| `scrub` | `TBD` | `TBD` | carousel / scrubbed sequences — observe |

Reduced-motion: **the original ships no `prefers-reduced-motion` handling.** We add it
regardless — it is an accessibility floor in [PROJECT.md](PROJECT.md), and is the one
place we knowingly diverge from the target. Recorded here so it is never mistaken for a
fidelity defect.
