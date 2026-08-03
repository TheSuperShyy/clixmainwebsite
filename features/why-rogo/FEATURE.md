# Feature: Why financial institutions choose Rogo

| | |
|---|---|
| Slug | `why-rogo` |
| Page(s) | home |
| Order on page | 5 — after `testimonials`, before `by-the-numbers` |
| Status | `review` |
| Reference | the 2026-08-02 capture, `docs/reference/target/` |
| Original Framer name | `Series C Tenants` (`.framer-1lovf32`) |
| Component | `src/components/sections/WhyRogo.tsx` · `src/components/ui/WhyRogoIcons.tsx` |

## Purpose

A two-column editorial block: a headline that **pins while you scroll** on the left, and a
list of five differentiators on the right, each an icon tile over a heading and a paragraph,
separated by hairline rules.

**The Framer name is stale.** "Series C Tenants" dates from before the Series D announcement
that the nav banner carries; and "Tenants" is the author's spelling of *tenets*. Neither
appears in any user-visible string. Slug is descriptive instead.

**The section has no `id`** in the original — unlike `#hero`, `#testimonials` and
`#security`. Ours has none either; nothing links to it.

---

## Measured spec

> Extracted from the frozen capture, not estimated. Every heading and paragraph is emitted
> **three times** as Framer `ssr-variant`s. The gating classes map to media queries as:
> `hidden-1eq4joi` = ≥1600 · `hidden-l1t773` = 1200–1599.98 · `hidden-11hyp1n` = 810–1199.98
> · `hidden-9nhpe8` = ≤809.98. Each is `display:none!important`, so a variant is shown at
> exactly the tiers **not** in its class list.

### Layout

| Property | XL 1600 | Desktop 1440 | Tablet 1024 | Phone 390 |
|---|---|---|---|---|
| Section padding | `96px 40px 164px` | `96px 40px 164px` | `96px 40px 128px` | `80px 16px 40px` |
| Section background | `canvas` `#f7f7f7` | same | same | same |
| Width Container | `max-width:1280px`, row, gap `24px`, align `flex-start` | same | same | **column**, gap `24px` |
| Headline column | `flex:1 0 0; width:1px`, `position:sticky; top:96px`, padding `72px 0 96px` | same | same | `position:relative`, **fixed `width:299px`**, padding `0` |
| Tenants column | `flex:1 0 0; width:1px`, gap **`88px`** | same | same | `width:100%`, gap `72px` |
| Rendered column widths | 628 / 628 | 628 / 628 | 460 / 460 | full-bleed stack |
| Item text inset | `padding-right:32px` (text only — never the icon tile) | same | same | same |

### The five items — they are **not** uniform

| # | Heading | Item gap | Item padding | Bottom rule |
|---|---|---|---|---|
| 1 | By finance, for finance | `28px` | **`72px 0`** | yes |
| 2 | Agents that understand, and act | `28px` | `0 0 72px` | yes |
| 3 | Integrated into your firm & the financial data universe | `28px` | `0 0 72px` | yes |
| 4 | Institutional-grade outputs | **`32px`** | `0 0 72px` | yes |
| 5 | Custom deployed + partnership-minded | **`32px`** | `0 0 72px` | **no** |

Item 1 is the only one with top padding, and it is exactly the headline column's own
`padding-top:72px` — that is what optically aligns the h2's cap-height with the first icon
tile. Item 5 drops the rule because there is nothing below it in the section.

### Icons

| | Icon Container (tile) | Icon Frame | SVG box | viewBox |
|---|---|---|---|---|
| all | `64×64`, `tile` `#0000000d`, radius `6px`, `overflow:clip` | `40×40`, `aspect-ratio:1`, absolutely centred | — | — |
| 1 | | opacity `.6` | `30×30` @ `(5,5)` | `0 0 30 30` |
| 2 | | opacity `.7` | `29×29` @ `(6,6)` | `0 0 28.334 28.334` |
| 3 | | opacity `.7` | `27×27` @ `(7,7)` | `0 0 26.668 26.668` |
| 4 | | opacity **`1`** — the `.7` is on the SVG path instead | `30×29` @ `(7,5)` | `0 0 30 29.167` |
| 5 | | opacity `.7` | `30×30` @ `(5,5)` | `0 0 30.002 30` |

Stroke is `ink` at `stroke-width:2.5`, `fill:transparent`, `stroke-miterlimit:10`.
`stroke-linecap:square` on items 1, 4 and 5 only; 2 and 3 have none.

**Item 4's icon is the one that isn't vertically centred** in its frame: `7 + 29 = 36` of
`40`, so it sits 3px high. Verbatim from the capture — do not "fix" it.

### Typography

| Element | Family | Size | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|---|
| Headline (h3 in original) | ABC Arizona Mix Regular | **44px** ≥810 · **36px** ≤809.98 | 400 | `105%` | `-0.05em` | `ink` |
| Item heading (h4) | Inter | **24px** ≥1200 · **28px** 810–1199.98 · **24px** ≤809.98 | 500 | **`1.1em` ≥1200**, else Framer's `1.2em` default | `-0.02em` | `ink` |
| Item body | Inter | **18px** ≥1200 · **16px** ≤1199.98 | 400 | `1.5em` | see below | `ink` at **opacity `.7`** |

**The tablet tier's item heading is *larger* than the desktop tier's** — 28px against 24px.
That is genuinely what the capture declares, on all five items; it is not a mis-mapped
variant. The headline does the opposite thing (44px at both).

**Body letter-spacing is inconsistent in the original** and is copied rather than
normalised: items 1, 2 and 4 use `-0.1px`; items 3 and 5 use `-0.01em`. At 18px that is
`-0.10px` versus `-0.18px`. This is the "stray `-0.1px`" `docs/DESIGN-SYSTEM.md` flags.

**Heading measure is hand-set per item**, which is what controls where each one breaks:

| # | h4 `max-width` | Effect at ≥1200 |
|---|---|---|
| 1 | `844px` | one line (248px) |
| 2 | `500px` | one line (353px) |
| 3 | **`300px`** | **three lines** — the cap bites |
| 4 | `844px` | one line (292px) |
| 5 | `844px` | one line (442px) |

Body copy is capped at `720px` on every item.

### Color & surface

| Element | Property | Value |
|---|---|---|
| Section | background | `canvas` `#f7f7f7` |
| Item rule | border-bottom | `hairline-dark` `#0000001a` — **pure black @10%**, not `hairline` |
| Icon tile | background | `tile` `#0000000d` — **pure black @5%**, not `ink-wash` |
| Icon tile | border-radius | `6px` |
| All text | color | `ink` `#151515` |

### Motion

| What animates | Trigger | Duration | Easing |
|---|---|---|---|
| Headline pin | scroll | n/a — native CSS `position:sticky; top:96px` | n/a |
| nothing else | — | — | — |

Library: **none.** The capture emits **zero `data-framer-appear-id`** in this subtree, so
there is no entrance animation to reproduce — unlike most Framer sections, this one is
genuinely static. Reduced-motion: n/a, nothing moves under our control.

### Responsive behavior

- **≥1200:** two equal columns, headline sticky at `top:96px`, 18px body.
- **810–1199.98:** same two columns (narrower), 16px body, **28px** item headings.
- **≤809.98:** stacks — a fixed 299px headline block above a full-width item list; sticky
  is switched off (`position:relative; top:unset`), item gap drops 88 → 72.

---

## Tokens used

`ink` · `canvas` · `hairline-dark` (new) · `tile` (new) · `--font-display` · `--font-sans` ·
`--container-max` `1280px`.

`hairline-dark` and `tile` were added to `docs/DESIGN-SYSTEM.md` for this section. Neither
is a Framer *token* — both are literals Framer inlined on the element.

## Documented deviations

| Property | Original | Ours | Why |
|---|---|---|---|
| Heading levels | `<h3>` section head, `<h4>` items | `<h2>` and `<h3>` | The page's h1 is the hero. Jumping straight to h3 skips a level and breaks the outline for screen-reader users. Purely semantic — nothing renders differently. Same call as `testimonials`, which demoted an h1 to h2. |
| Icon delivery | `<use href="#id">` against a shared `<defs>` block | inlined `<svg>` per icon | Removes the indirection and lets each icon inherit `currentColor`. Path data, viewBox, stroke width and caps are byte-identical. |
| `ssr-variant` duplication | three DOM copies of every heading and paragraph, two hidden | one copy, switched with `tablet:`/`desktop:` variants | Same reasoning as `testimonials`: shipping 3× the text to hide 2× costs the accessibility tree more than it saves. Every per-tier value is reproduced. |

## Acceptance checklist

- [x] Structure + measured values from the capture, all four tiers
- [x] Spacing/type/color from tokens, or deviation documented above
- [x] Geometry verified by CDP at 1600 / 1440 / 1024 / 390 — every value matches the capture
- [x] Sticky headline verified pinning at `top:96px` through a scroll sweep at 1440
- [x] No horizontal overflow at any of the four widths
- [x] Contrast: body `6.54:1`, headings `17.05:1` — both pass AA
- [x] `npm run build` clean, `eslint src` clean
- [ ] Matches reference at 1600 / 1440 / 1024 / 390 — **not yet visually diffed against the
      live site**; verified against the capture's numbers only
- [ ] Hover states — see open questions

## Open questions

- [ ] **Are the items interactive?** Nothing in the capture is a link or a button, and there
      is no `cursor`, `:hover` rule or transition anywhere in the subtree. Built as static
      content with nothing focusable. If the live site reveals a hover on the tile or the
      heading, it is unobservable from here.
- [ ] **Does the headline animate in?** No `data-framer-appear-id` in the subtree, so the
      capture says no. Every other section on this page is the same, and Framer usually
      *does* emit appear IDs when a scroll reveal is configured — so this is stronger
      evidence than usual, but still not a live observation.
- [ ] **`top:96px` is absolute, not derived.** It does not track the nav height (60px row at
      1440, 74px at 390 — plus a 45px banner that comes and goes). At the desktop tier the
      pinned headline clears the scrolled nav with 36px to spare, so it reads fine; whether
      the original intends 96px as "nav + 36" or just as a round number is unknown.
- [ ] **Item 3's `300px` heading cap** forces a three-line break. Reproduced verbatim, but
      worth one look at the live site to confirm it is deliberate and not a Framer artifact
      of a resized text box.
