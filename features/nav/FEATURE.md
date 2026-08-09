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

**At rest the nav has no opaque fill at any tier.** The `blur(5px)`, not a background colour,
is what separates it from the video. Do not "simplify" the *rest* state to a solid bar.

#### Scrolled state — from the live site, not the capture

Added 2026-08-03. The capture froze only the rest state, so none of this came out of it;
it is read off a screenshot of rogo.ai scrolled into the testimonials block. What the
capture *does* prove is that a second state exists: the nav component renders as
`.framer-v-174l6nt` (`data-framer-name="Transparent Dark"`) and its CSS declares a sibling
variant `.framer-v-yxrzsa`, whose only stylesheet delta is `overflow:visible` — every colour
difference is applied inline from JS and is therefore absent from a static capture.

**The banner and the colour swap are two independent behaviours, not one state.** Proven by
a live screenshot of rogo.ai showing the header already light *with the banner still on
screen* — a frame a single boolean cannot produce.

**Banner — direction-aware, animated both ways.** Confirmed on the live site: scroll up
anywhere in the page and the black bar comes back. The rule is one line, applied as
`translateY` on the fixed header:

```
shift = (scrollingDown && scrollY > 0) ? bannerH : 0
```

- **Down** — it eases out of view.
- **Up** — it eases back in, at any scroll depth.
- **At the very top** — always in place, so a fresh load never starts collapsed.

It is a **two-position animation, not scroll-tracking**: both directions run the same
`300ms` `--ease-rogo` on the transform. An earlier pass had the hide follow the scrollbar
1:1 (`min(scrollY, bannerH)`), which is the more literal reading of "a banner that isn't
really fixed" but reads as a jerk at the top of the page.

4px deadzone on the direction test so inertial jitter cannot flip it mid-scroll.
Banner height measured: **45px** at every tier.

`aria-hidden` + `inert` from the moment it starts leaving.

**Colour swap — three-way, not a boolean.** Extended 2026-08-03 at the user's request, once
`security` and `footer` landed: both are `ink`, and the white bar was sitting on top of them.

| Element | `hero` | `light` | `dark` |
|---|---|---|---|
| Header background ≥1200 | `rgba(21,21,21,0)` | `paper` `#ffffff` | `ink` `#151515` |
| Header background <1200 | `rgba(21,21,21,0.01)` | `paper` | `ink` |
| Header <1200 outer border-bottom | `hairline-light` `#ffffff26` | `hairline` `#a8a29e33` | `hairline-light` |
| Logo · nav link · `Ghost` label | `paper` | `ink` | `paper` |
| Button `Inverse` | `paper` fill, `ink` label | `ink` fill, `paper` label | `paper` fill, `ink` label |
| Focus ring | `paper` | `ink` | `paper` |

**`dark` and `hero` share every content colour** and differ only in the bar's fill — which is
why a single `light` boolean still drives all the text, ring and border classes, and only the
`background-color` is a three-way. The transparency is the point of `hero`: the capture's
at-rest bar has no opaque fill at any tier, and the `blur(5px)` is what separates it from
the video.

**Which sections are which**

| `data-nav-theme` | Sections |
|---|---|
| `hero` | `hero` (dark video, transparent bar) |
| `light` | `testimonials` · `why-rogo` (`canvas`) · `by-the-numbers` (`card`) |
| `dark` | `security` · `footer` (both `ink`) |

Each section carries the attribute itself, so the nav has no list of section names to keep
in sync. Add a section, tag it, done — and an untagged one falls back to `light`.

**Colour trigger — ours, not measured.** The nav reads whichever `[data-nav-theme]` element
spans **the bottom edge of the nav row**, probed on the existing rAF-throttled scroll pass.
That boundary is unchanged from the earlier implementation, which expressed the same line as
`rootMargin: -<navHeight>px 0 0 0` on an `IntersectionObserver` watching `#hero`; this only
generalises it from "is the hero still there" to "what is there". It remains the functional
reason the original flips at all — white-on-dark is unreadable — and it reproduces both
states we have actually observed on the live site. A plain `scrollY > n` threshold fits those
two data points equally well but would put a white bar over the dark hero on the way down.
Unverified against the live flip point — see open questions.

Transition: `300ms` on `--ease-rogo` for the colour crossfade, by analogy with the capture's
one authored curve. Estimated.

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
| Link slot 1 | `Felix` → `./felix` | `Clix`, inert | 2026-08-09, user. Slots 2–7 (`Product` `Security` `Company` `Customers` `News` `Careers`) are the target's verbatim and in order; `Felix` is rogo's named AI-analyst product, which a clix build cannot claim, so slot 1 carries the brand. |
| Link hrefs | seven real routes | `Security` → `#security`, `Customers` → `#testimonials`, the other five inert | Only two of the seven labels have a section on this one-page build. An inert item renders as dimmed text and is not focusable — preferred over a 404 or a `#` that jumps to the top. |
| Logo | rogo logotype, `60×24` | clix mark + wordmark, `28px` mark | Brand. Confirmed to stay when the labels were swapped on 2026-08-09 — do not revert it as part of "matching the nav to rogo". |
| Banner content | "Announcing our $160M Series D led by Kleiner Perkins" + underlined `Learn more` → `./news/series-d` | live LLM price ticker | 2026-08-08. The target's box (`45px`, `12px 40px`) is unchanged; only the contents differ. Also confirmed to stay on 2026-08-09. |
| Link / button type | `14px` | `18px` | 2026-08-05 user request (commit `311dce5`). Confirmed to stay on 2026-08-09. |
| Mobile menu panel | never rendered in the capture | our own dark panel: the 7 links + one button | The original mounts it only on interaction, so **nothing about its real appearance is observable**. Built to be functional and accessible; expect to redo it once the live site is checked. |
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
- [ ] **Does the original's bar go dark over its dark sections?** Ours does, at the user's
      request (2026-08-03). Not observed on the live site — the screenshot that produced the
      light scrolled state was taken over `testimonials`, which is light. If rogo.ai keeps a
      white bar over its own `security` and `footer`, this is a **deliberate divergence**
      rather than a clone, and is recorded as one here.
- [x] **Scroll state — resolved 2026-08-03 from a live screenshot.** It goes solid `paper`
      with `ink` content and the banner slides away. Table above. Two things about it are
      still **not** verified:
  - [ ] **Where the colour flips.** We use "hero bottom reaches the nav's bottom edge".
        Could be a fixed scroll offset instead. Needs a slow scroll on the live site.
  - [x] **Does the banner come back on scroll UP?** Yes — user-confirmed on the live site,
        implemented. What is still unmeasured is the *reveal timing* (ours: 300ms
        `--ease-rogo`) and whether the original needs a minimum up-distance before it fires
        (ours: a 4px deadzone, chosen to kill jitter, not measured).
  - [ ] **Whether the scrolled header keeps a bottom border at ≥1200.** Ours has none
        (matching the rest state, which has none). The screenshot is inconclusive.
- [ ] **The `Indicator` element** (`.framer-5nhcxz`, 1px tall, `left:128px right:195px`,
      `opacity:0`) exists in the <1200 header. It is invisible in the capture. An
      active-route underline? Currently **not implemented**.
- [ ] **`Request Demo` target** — modal or page?
