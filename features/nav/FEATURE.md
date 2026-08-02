# Feature: Navigation + Banner

| | |
|---|---|
| Slug | `nav` |
| Page(s) | all (site shell) |
| Order on page | 1 — `position:fixed`, sits above everything |
| Status | `review` |
| Reference | the 2026-08-02 capture, `docs/reference/target/` |
| Original Framer name | `Navigation + Banner` (`.framer-1lcee9e`) |
| Component | `src/components/sections/Nav.tsx` · `src/components/ui/RogoWordmark.tsx` |

## Purpose

Fixed site header carrying the Series D announcement banner above a transparent, backdrop-
blurred nav bar. It overlays the hero rather than displacing it — the hero's own top padding
(156/120px) is what clears it.

---

## Measured spec

> Values extracted from the frozen capture. The nav is emitted **twice** as Framer
> `ssr-variant`s gated on `hidden-*` classes; every class was mapped back to the media query
> that hides it, rather than assumed from the visual.

### The two breakpoints — read this first

The banner and the header switch at **different widths**. This is real, not an error:

| | ≤809.98 | 810–1199.98 | 1200–1599.98 | ≥1600 |
|---|---|---|---|---|
| **Banner** | stacked / truncating | centred row | centred row | centred row |
| **Header** | logo + hamburger | logo + hamburger | full nav | full nav |

`ssr-variant` A (shown ≥810) contains *both* header layouts, gated again at 1200.
`ssr-variant` B (shown ≤809.98) carries the stacked banner.

### Layout
| Property | XL 1600 | Desktop 1440 | Tablet 1024 | Phone 390 |
|---|---|---|---|---|
| Header position | `fixed`, `inset-x-0 top-0`, `z-index:3` | same | same | same |
| Banner padding | `12px 40px` | `12px 40px` | `12px 40px` | `12px 16px` |
| Banner layout | row, centred, gap `10px` | same | same | row, left-aligned, gap `8px`, headline truncates to 1 line |
| Header padding | `16px 40px` | `16px 40px` | `16px` (all sides) | `16px` (all sides) |
| Header inner max-width | `1280px` | `1280px` | n/a (full width) | n/a |
| Nav link row | `absolute left:50%` + `translateX(-50%)`, gap `12px` | same | — | — |
| Link box | `36px` tall, padding `8px 12px` | same | — | — |
| Button group gap | `8px` | `8px` | `8px` | `8px` |
| Logo | `60×24` in a `28px` box | same | `60×24` in a `24px` box | same |
| Hamburger | — | — | `40×40`, glyph `20×20` | same |

### Typography
| Element | Family | Size | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|---|
| Banner announcement | Inter | 14px | 400 | 1.5em | -0.02em | `paper`, no underline |
| Banner "Learn more" | Inter | 14px | 400 | 1.5em | -0.02em | `paper`, **underlined** |
| Nav link | Inter | 14px | 500 | 1.5em | -0.01em | `paper` |
| Button label | Inter | 14px | 500 | **1em** | -0.01em | `paper` / `ink` |

### Color & surface
| Element | Property | Value |
|---|---|---|
| Banner | background | `banner` `#211e1e` (`rgb(33,30,30)`) |
| Header ≥1200 | background | `rgba(21,21,21,0)` — fully transparent |
| Header ≥1200 | backdrop-filter | `blur(5px)` |
| Header <1200 | background | `rgba(21,21,21,0.01)` |
| Header <1200 | backdrop-filter | `blur(5px)` |
| Header <1200 | border-bottom | `hairline-light` `#ffffff26` (outer) **and** `hairline` (inner row) — two coincident 1px borders |
| Button (both) | border | `1px solid` transparent, radius `6px` |
| Button `Inverse` | background | `paper`, label `ink` |
| Button `Ghost` | background | transparent, label `paper` |

**The nav has no opaque fill at any tier.** The `blur(5px)`, not a background colour, is what
separates it from the video. Do not "simplify" it to a solid bar.

### Interactive states
| Element | Hover | Focus-visible | Transition |
|---|---|---|---|
| Banner links | colour → `surface` `#f5f5f5` | ring | `color .3s cubic-bezier(.44,0,.56,1)` — the one authored curve in the capture |
| Nav link | `opacity .7` *(est.)* | ring | `.3s` `ease-rogo` *(est.)* |
| Buttons | `opacity .9` *(est.)* | ring | `.3s` `ease-rogo` *(est.)* |

### Motion
| What animates | Trigger | Duration | Easing |
|---|---|---|---|
| Banner link colour | hover | `.3s` | `cubic-bezier(.44,0,.56,1)` — **measured** |
| everything else | — | — | not observable in the capture |

Library: none — CSS transitions only. Reduced-motion fallback: n/a (colour/opacity only).

### Responsive behavior
- **≥1600 / 1200–1599.98:** centred banner; full nav with 7 absolutely-centred links, logo left, Log in + Request Demo right.
- **810–1199.98:** centred banner; header collapses to logo + hamburger.
- **≤809.98:** banner goes left-aligned with the headline truncating to one line so "Learn more" is never pushed off; header stays logo + hamburger.

---

## Tokens used

`ink` · `paper` · `surface` · `hairline` · `banner` (new) · `hairline-light` (new) ·
`--font-sans` · `--container-max` `1280px` · `--ease-rogo`.

`banner` and `hairline-light` were added to `docs/DESIGN-SYSTEM.md` for this section.

## Documented deviations

| Property | Original | Ours | Why |
|---|---|---|---|
| Mobile menu panel | never rendered in the capture | our own dark panel: the 7 links + both buttons | The original mounts it only on interaction, so **nothing about its real appearance is observable**. Built to be functional and accessible; expect to redo it once the live site is checked. |
| Carousel `aria-hidden` | n/a | n/a | *(see logo-carousel)* |
| `Request Demo` href | **no `href` at all** | `#request-demo` | The original's nav button is an `<a>` with no href — presumably a JS modal. A link with no destination is not keyboard-operable, so ours points at the hero CTA anchor. |
| Escape / scroll-lock | unknown | implemented | Standard menu behaviour; not observable. |

---

## Acceptance checklist

- [x] Structure + measured values from the capture, all four tiers
- [x] Spacing/type/color from tokens, or deviation documented above
- [x] Keyboard reachable, focus visible, `aria-expanded`/`aria-controls` on the toggle
- [x] `npm run build` clean
- [ ] Matches reference at 1600 / 1440 / 1024 / 390 — **not yet visually verified**
- [ ] Hover/active timings — only the banner's `.3s` curve is measured; the rest is estimated
- [ ] `CONTEXT.md` (feature + global) updated, `SECTIONS.md` status set — done

## Open questions

- [ ] **Mobile menu.** Not in the capture at all. Needs a look at the live site: panel
      background, whether it's full-screen, entrance motion, whether the logo/hamburger
      swap to a close glyph.
- [ ] **Scroll state.** The header is `position:fixed` with a Framer variant named
      `Transparent Dark`, which implies a second scrolled state exists. Not observable —
      does it gain a fill or a border once the hero scrolls past?
- [ ] **The `Indicator` element** (`.framer-5nhcxz`, 1px tall, `left:128px right:195px`,
      `opacity:0`) exists in the <1200 header. It is invisible in the capture. An
      active-route underline? Currently **not implemented**.
- [ ] **`Request Demo` target** — modal or page?
