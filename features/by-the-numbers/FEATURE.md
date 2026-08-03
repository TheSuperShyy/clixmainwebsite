# Feature: By the numbers

| | |
|---|---|
| Slug | `by-the-numbers` |
| Page(s) | home |
| Order on page | 6 — after `why-rogo`, before `security` |
| Status | `review` |
| Reference | the 2026-08-02 capture, `docs/reference/target/` |
| Original Framer name | `By the Numbers` (`.framer-1mzivz3`) |
| Component | `src/components/sections/ByTheNumbers.tsx` |

## Purpose

Three stats on a `card` `#eeedec` panel: a small headline, then three rows of a very large
display number with a right-hand caption, separated by hairline rules.

No `id` in the original; ours has none either.

---

## Measured spec

> Extracted from the frozen capture. Numbers and captions are emitted as Framer
> `ssr-variant`s; gating classes map as `hidden-1eq4joi` = ≥1600 · `hidden-l1t773` =
> 1200–1599.98 · `hidden-11hyp1n` = 810–1199.98 · `hidden-9nhpe8` = ≤809.98, each a bare
> `display:none!important`.

### The row is a designed pair of caps

At ≥1200 the number cell is `flex:1 0 0; max-width:844px` and the caption cell
`flex:1 0 0; max-width:436px`. **844 + 436 = 1280 = `--container-max`.** Both caps bind
simultaneously, which is why the caption column holds its position instead of drifting as
the viewport grows past 1280. Neither number is arbitrary.

### Layout

| Property | XL 1600 | Desktop 1440 | Tablet 1024 | Phone 390 |
|---|---|---|---|---|
| Section padding | `96px 40px` | `96px 40px` | `96px 40px` | `96px 16px` |
| Section background | `card` `#eeedec` | same | same | same |
| Width Container | `max-width:1280px`, column, gap `164px` | same | gap `128px` | gap `80px` |
| Number Container gap | `48px` | `48px` | `48px` | `44px` |
| Headline block | `width:min-content` over a `400px` rich text | same | same | `width:100%` |
| Row | flex **row**, gap `0`, padding `0` | same | same | flex **column**, gap `4px`, padding `24px 0` |
| Row rule | `border-top: 1px` `hairline` | same | same | same |
| Number cell | `flex:1 0 0`, `max-width:844px`, padding `16px 0` | same | same | `width:100%`, padding `0` |
| Caption cell | `flex:1 0 0`, `max-width:436px`, `align-self:stretch`, padding `0 48px 36px 32px` | same | `flex:none`, `width:253px`, padding `0 32px 36px 24px` | `width:100%`, `align-self:unset`, padding `0` |
| Rendered cells | 844 / 436 | 844 / 436 | 691 / 253 | stacked |
| Row height | 161px | 161px | 161px | 136px |

**The Width Container's gap never applies here** — it has exactly one child. The rule is
shared with `security`'s container (`.framer-150wkki`), where it does bite. Reproduced
anyway so the shared value stays visible.

### The caption is bottom-aligned, not centred

`align-self:stretch` makes the caption cell as tall as the 160px number cell;
`place-content: flex-start flex-end` on a column resolves to `justify-content:flex-end`,
which pushes the caption to the bottom; then `padding-bottom:36px` lifts it back. Net
effect: the caption sits on the number's **baseline**, not its optical centre. Verified —
caption bottom is exactly 20px above the number's bottom at 1600, on all three rows.

### Typography

| Element | Family | Size | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|---|
| Headline "By the numbers" | Inter | **28px at every tier** | 500 | `1.1em` | `-0.03em` | `ink` @ opacity `.7` |
| Number | ABC Arizona Mix Regular | **108px** ≥1600 · **96px** 810–1599.98 · **48px** ≤809.98 | 400 | **`128px` absolute** ≥810 · Framer's `1.2em` default ≤809.98 | `-0.04em` | `ink` |
| Caption | Inter | **20px** ≥810 · **18px** ≤809.98 | 400 | `1.4em` | `-0.02em` | `ink` @ opacity `.7` |

**The number's line-height is an absolute `128px`, not a ratio.** That is why the 96px and
the 108px number occupy the same box and the rules stay 161px apart at every tier above
phone. The phone variant declares no line-height at all, which in Framer means its `1.2em`
default — **not** the browser's `normal`, which is 1.5em for this face and silently adds
14px to every row. That mistake was made and caught here; see `CONTEXT.md`.

**The headline is the only element in the section whose size does not change across tiers.**

### Caption line breaks

| Row | ≥810 | ≤809.98 |
|---|---|---|
| 1 | "Bankers and investors using Rogo" — wraps naturally at `max-width:240px` | same string, `white-space:pre` |
| 2 | "Daily queries sent **⏎** by users" | "Daily queries sent by users" |
| 3 | "Institutions **⏎** served" | "Institutions served" |

At ≤809.98 the caption drops its 240px cap. Rows 1 and 2 get `white-space:pre`; **row 3
instead gets `width:100%`** and keeps normal wrapping — a per-row override in the capture,
not a pattern. Row 3's number cell also picks up a lone `padding-top:2px` at that tier.
All three reproduced per row.

Measured at 390: row 1's `pre` caption renders 277px inside a 358px cell, so it does not
overflow. It is close, and it is the original's construction, not ours.

### Color & surface

| Element | Property | Value |
|---|---|---|
| Section | background | `card` `#eeedec` — the same fill as a testimonial card |
| Row rule | border-top | `hairline` `#a8a29e33` |
| Number | color | `ink`, full opacity |
| Headline, caption | color | `ink` at opacity `.7` |

The row rule is the capture's **own token reference** here
(`--border-color: var(--token-8ac923d6-…, #a8a29e33)`), not a look-alike literal — unlike
`why-rogo`, whose dividers are a pure-black one-off. Reuse `hairline`.

### Motion

**None.** No `data-framer-appear-id`, no `transition`, no `will-change` anywhere in the
subtree, and no `:hover` or `cursor` rule on any of its classes.

`docs/SECTIONS.md` originally noted "check for count-up animation on scroll → `gsap`". The
capture says no: the numbers are static text. A count-up would be **inventing** motion, not
cloning it, so it was not built. The `gsap` skill was checked and declined on that basis —
if the live site does count up, this is the one thing here worth revisiting.

### Responsive behavior

- **≥1600:** 108px numbers; 844/436 cells.
- **1200–1599.98:** 96px numbers; 844/436 cells; identical row height (the 128px leading).
- **810–1199.98:** 96px numbers; caption cell goes fixed 253px with tighter padding.
- **≤809.98:** rows stack — 48px number above an 18px caption, gap 4px, `24px 0` padding.

---

## Tokens used

`ink` · `card` · `hairline` · `--font-display` · `--font-sans` · `--container-max` `1280px`.

**No new tokens.** Every colour in this section already existed.

## Documented deviations

| Property | Original | Ours | Why |
|---|---|---|---|
| Heading levels | `<h3>` headline, `<h4>` numbers | `<h2>` and `<h3>` | The hero owns the h1; jumping to h3 skips a level. Same call as `why-rogo` and `testimonials`. Purely semantic. |
| Row 3's `<br>` wrapper | `<span style="--framer-text-color:rgb(23,23,23)">` around the `<br>` alone | dropped, plain `<br>` | The span contains no text, so it colours nothing. `rgb(23,23,23)` is a stray near-`ink` that appears nowhere else on the page; copying it would put a dead value in the tree. |
| `ssr-variant` duplication | three DOM copies of every number, two of every caption | one copy, switched with `tablet:`/`xl:` variants | Same reasoning as the previous two sections. Every per-tier value is reproduced. |

## Acceptance checklist

- [x] Structure + measured values from the capture, all four tiers
- [x] Spacing/type/color from tokens, or deviation documented above
- [x] Geometry verified by CDP at 1600 / 1440 / 1024 / 390 — every value matches the capture
- [x] Caption bottom-alignment verified numerically, not by eye
- [x] No horizontal overflow at any of the four widths (incl. the `white-space:pre` caption)
- [x] Contrast: numbers `15.62:1`, headline and captions `6.28:1` — both pass AA
- [x] `npm run build` clean, `eslint src` clean
- [ ] Matches reference at 1600 / 1440 / 1024 / 390 — **not yet visually diffed against the
      live site**; verified against the capture's numbers only

## Open questions

- [ ] **Do the numbers count up on scroll?** The capture says no — static text, zero
      `data-framer-appear-id`. But a count-up is exactly the kind of thing Framer would run
      from JS, and a static capture cannot rule out a code component. **This is the single
      most likely divergence in this section**; one look at the live site settles it.
- [ ] **Nothing is interactive.** No `cursor`, `:hover` or transition on any class in the
      subtree, so it is built as static content with nothing focusable.
- [ ] **Row 1's phone caption uses `white-space:pre`** at 277px inside a 358px cell. It fits
      at 390, but at 320px it would clip. The original has the same exposure; not worked
      around, since doing so would be a deviation.
