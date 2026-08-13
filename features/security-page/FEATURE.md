# Feature: Security page (`/security`, clone of `rogo.com/security`)

| | |
|---|---|
| **Route** | `/security` |
| **Status** | `review` |
| **Reference** | `docs/reference/target/rogo-security-2026-08-12.{html,css}` (374 KB HTML, **five** inline `<style>` blocks, 150 KB CSS) + a live CDP probe the same day |
| **Screenshots** | `features/security-page/assets/rogo-security-<tier>-NN.png` (4/4/4/6 strips) |
| **Original Framer names** | `Hero` (`#first`) · `Benefits` (`#features`) · `Compliance` (`#features-1`) · `Reiteration` (inside `Footer`) |
| **Components** | `src/components/security/{SecurityHero,SecurityBenefits,SecurityCompliance,SecurityCore}.tsx` |

## Purpose

The security page. Design 1:1 with the target; **every string is clix's own from the first
commit** — the `/company` model. No borrowed asset, no third-party trademark, no certification
clix does not hold ever enters the repo, so there is nothing to strip later and **no `robots`
guard is needed**.

---

## ⚠️ Read first — six traps this page sets

**1. `#features-1` is ONE band holding TWO rows.** "Security At Our Core" has no
`data-framer-name` of its own and looks like a fourth sibling. It is not: `#features-1`'s two
direct children are `Container .framer-rswx4m` (heading + badge grid, column, gap 64) and
`Container .framer-1bz2s3e` (the two-column core row, **row**, gap 64), separated by the band's
own `gap: 120px`. Probed on the live page, not inferred. Same trap `/product` hit twice —
**byte offsets give document order, never nesting.**

**2. The hero's height is `70vh`, not a content sum.** `.framer-16jfo2a` declares
`height: 70vh` at ≥810 and `height: min-content` at ≤809.98. At a 900px viewport that is
630px, and 198 + 302 + 80 = 580 does **not** close it. Any harness must fix the viewport
height at 900 on both sides or this value is meaningless.

**3. The grid rules are a dashed `::after` overlay, not borders.** Every cell computes
`border-width: 0px` / `border-style: none` and carries `data-border="true"`; the visible rule is
`::after { inset: 0; border: 1px dashed rgba(255,255,255,0.15) }` with a **per-cell, per-tier
width matrix**. A real `border` would take layout space and move the 104px mark — the same
fault `/product` Block 3 hit.

**4. The outline is deliberately ragged below 1200 and the matrix is not derivable.** At 390,
cell 3 draws `0/1/0/1` — no top *and* no bottom — while cell 4 draws all four. Reproduced
verbatim; see the border matrix below. Same phenomenon home's `Security` documents.

**5. Both corner brackets are the SAME 21×33 SVG.** `TL Corner` and `BR Corner` both
`<use href="#svg-940700596_480">`; the BR one is `transform: matrix(-1,0,0,-1,0,0)`, i.e.
`rotate(180deg)`. Unlike the CTA's 14×20 pair, which really are two different paths.

**6. The core paragraph is ONE `<p>` with two `<br/>` inside it, not two `<p>`s.** The blank
line between the two paragraphs is exactly one line-height because it *is* a line. Two elements
with a margin would be a different measurement.

---

## Tier map — three sizes, not four

**XL and desktop are identical on every value on this page.** Base = phone (≤809.98) →
`tablet:` (≥810) → `desktop:` (≥1200). No `xl:` rule anywhere.

| Property | ≥1200 (1600 + 1440) | 1024 | 390 |
|---|---|---|---|
| `#first` padding | `198px 40px 80px` | same | `198px 16px 80px` |
| `#first` height | **`70vh`** (630 @ vh900) | same | `min-content` (521.19) |
| `#first` gap | 96 | 96 | 96 |
| `#features` padding | `80px 40px` | **`56px 40px`** | **`40px 16px`** |
| `#features` height | 570 | 739.17 | 1142.34 |
| `#features-1` padding | `96px 40px` | same | **`80px 16px`** |
| `#features-1` height | 964.06 | 1435.17 | 2099.08 |
| document height | 2716 | 3359 | 4872 |

All three bands: `flex-direction: column`, `align-items: center`, `width: 100%`,
`overflow: hidden`, `position: relative`. `#first` is `place-content: center`; the other two are
`justify-content: flex-start`. **Ground is `ink` for the whole page** — on the target only
`#first` paints it and the rest inherit from the page wrapper; ours paints it per section so
each band is its own `data-nav-theme` region.

---

## Block 1 — `Hero` (`#first`)

| Element | ≥1200 | 1024 | 390 |
|---|---|---|---|
| `Text & Button` | gap **32**, max-w none | gap **24** | gap 24, **max-w 360** |
| `Text Container` | 540 × 230, gap 16, **max-w 540** | 540 × 194.41 | 358 × 179.19 |
| h1 | **88px** / 95% / **-0.06em** | **72px** / 95% / -0.06em | **64px** / 95% / **-0.05em** |
| h1 box | 540 × 167.19 (2 lines) | 540 × 136.81 | 358 × 121.59 |
| subtitle `p` | **18px** / 130% / -0.02em | **16px** | 16px |
| subtitle box | 540 × 46.81 (2 lines) | 540 × 41.59 | 358 × 41.59 |
| CTA frame | 220 × 40 | same | same |
| CTA `<a>` | 220 × **36**, radius **6**, padding `8px 16px` | same | same |
| CTA label | Medium **16px** / 1em / -0.01em | same | same |

- h1 `text-align: center`, `text-wrap: balance`, weight 400, colour `paper`.
- Subtitle colour is `rgba(255,255,255,0.8)` → **new token `paper-soft`**.
- CTA `<a>` background `#ffffff` (`paper`), label `#151515` (`ink`) — the **Inverted** variant,
  because the ground is dark. `/product` and `/careers` ship the mirror of this.
- ⚠️ **The `<a>` is 36px tall inside a 40px frame**, vertically centred (`translateY(-50%)` on a
  wrapper in the original). `/careers` fills its 40px frame; this one does not. Measured, not
  assumed.
- **Brackets: 14 × 20, offset `dx -28 / dy -12`, at every tier** — byte-identical to
  `/product`'s and `/careers`'. Third independent measurement of the same numbers.
  Colour here is `paper`, not `ink`. Hover slide-in to `-2 / -18` is the same estimate the other
  two pages carry (300ms / `--ease-rogo`); **not in the capture, flagged as estimated**.
- The original's `<a>` has **no `href`** (same as `/product`'s ≥1200 CTA). Ours points at
  **`#contact`** — the bare fragment, not `/#contact`. The shared `Footer` renders `id="contact"`
  on every route, so it resolves in-page; the rooted form would be a navigation to `/` and trips
  `@next/next/no-html-link-for-pages`, which is a live failing rule in this repo. `ProductHero`
  and `CompanyHero` both ship the bare form for the same reason.
- Two DOM variants in the original, `Button (For Desktop)` ≥1200 and `Button (For Mobile)` below,
  which render **identically** (220 × 40 both). Collapsed to one element here.

## Block 1b — Terminal (`SecurityTerminal`) — ⚠️ OURS, NOT THE TARGET'S

**There is no counterpart to this on rogo.com/security.** Added 2026-08-13 on the user's
instruction: their boss saw [kiro.dev](https://kiro.dev/) and asked for "coding effects, since
it is the security section". What was borrowed is kiro's hero **form** — dark window chrome,
monospace, a dot-matrix banner, output that arrives live — and **none of its palette**, which is
lavender-purple with syntax-coloured text. Every value below is a design decision, not a
measurement, and may be tuned freely. Component: `src/components/security/SecurityTerminal.tsx`.

⚠️ **REVISED THE SAME DAY, AND THE REVISION IS THE DESIGN.** The first build typed one fixed
log out and then froze. The user compared it to kiro — *"ours after the animation it's static
but in kiro it's continuously coding and stuff"* — and asked for *"the kiro literal agent feed,
but connect it to security"*. So the body is now a **rolling agent feed**: a six-row task list
that advances one row every ~1.3s, forever, cycling a pool of twelve security checks.
**Being endless is the requirement**, not a side effect — do not revert it to a fixed log.

It is the **second child of `#first`**, which is what finally activates that section's `gap-24`
(96px) — inert since the block was built, and kept then on the note that "the next thing added to
this section will expect it".

| Element | ≥1200 | 1024 | 390 |
|---|---|---|---|
| Window | **720 × 320** | 720 × 320 | **358 × 288** |
| Title bar | 36 | 36 | **32** |
| Body | 282 | 282 | **254** |
| Body padding | 20 | 20 | **16** |
| Mono size / line-height | **14** / 1.6 | 14 / 1.6 | **12** / 1.6 |
| Command box | 18ch = **155.74** | 155.74 | 18ch = **133.47** |
| Feed viewport | `calc(6 * 1.6em)` = **134.39** | 134.39 | **115.19** |
| Row height (measured) | **22.39** | 22.39 | **19.19** |
| Marker / verb columns | 2ch / 8ch | same | same |

- ⚠️ **The window totals are round; the body heights are not, and that is deliberate.** The root
  has no height of its own, so `border-box` never applies to it and its 1px border sits OUTSIDE
  its children: `1 + 36 + 282 + 1 = 320` and `1 + 32 + 254 + 1 = 288`. Those totals are what the
  hero's height sum is built on — move one and the other has to move with it.
- ⚠️ **The body height is FIXED, not content-driven.** The feed never stops, so a content-sized
  box would grow without limit and push the whole page down as it ran. Content sums to 203.8
  (tablet+) inside 282 and 181.4 (phone) inside 254; the feed's own bottom edge clears the body's
  inner bottom by **38.22 / 40.63px**, measured.
- ⚠️ **Six rows visible, SEVEN rendered.** The seventh sits below the clip and is what slides
  INTO view each tick — without it the incoming row would pop in at the bottom edge rather than
  arrive. The viewport is `calc(6 * 1.6em)`, which is exactly six rows at **both** type tiers
  (134.39 at 14px, 115.19 at 12px) with no second number to keep in sync. Measured 6.002 and
  6.003 rows respectively.
- **Status is derived from POSITION, never stored**: rows above the last visible one are `done`,
  the last visible one is `running`, the one below the clip is `queued`. The feed is therefore a
  pure function of one integer and no row has a state machine — a row does not *become* done, it
  simply moves up.
- ⚠️ **Status is carried by FILL, not by hue**, because kiro colour-codes it and this site has
  no palette to spend: a hollow `muted` ring is queued, a `paper-soft` disc is done, a `paper`
  disc that pulses is running. Verified in the render as `rgba(255,255,255,0.8)` × 5,
  `rgb(255,255,255)` × 1 pulsing, and one transparent fill on a `rgb(115,115,115)` border.
- **Colours are all pre-existing tokens. No new token, no new colour.** Body `ink`, title bar
  `ink-soft`, border + title rule `hairline-light`, readable text `paper-soft` / `paper`.
- ⚠️ **`muted` carries only decoration** — the traffic dots, the dot-matrix art and the two line
  markers. That is a 3.53:1 pairing, which answers WCAG 1.4.11's 3:1 floor for non-text. It is
  deliberately kept off every readable string, because `muted` on `ink` is 3.85:1 and already
  fails AA in five inherited places on this site. **This block adds no sixth failure.**
- **English and LTR in both locales** (user's call). The root carries `dir="ltr"`; nothing here
  comes from the dictionary. Verified: `direction: ltr` inside a `dir=rtl` document on `/he`.
- ⚠️ **THE ROWS NAME CHECKS BEING RUN, NOT RESULTS BEING CLAIMED**, and that distinction is
  load-bearing. This repo has stripped unbacked claims twice (home 2026-08-05, `/product`
  2026-08-12); an endless stream of PASSES would be the same move in a new costume. Every subject
  maps onto one of the five practice cells: iam / token scope / least privilege →
  `least-privilege`; tls / encryption at rest → `encrypted`; region / egress / inbound →
  `your-cloud`; retention → `your-data`; source integrity → `ownership`.
  **Column budget is 2ch + 8ch + target**; the longest target is "egress destinations" at 19
  characters (29ch ≈ 215px against 324px of inner width at 390). Measured clearance to the window
  edge: **427.11px at ≥1200, 108.95px at 390**. Measure before adding a longer one.
- **The whole window is `aria-hidden="true"`.** Every claim it prints appears verbatim as prose
  in the Compliance band below, so nothing is lost; a monospace pseudo-terminal read aloud is
  worse than silence. Nothing in it is focusable, so focus order is unchanged.
- The dot-matrix banner is a **grid of 3px `<span>`s, not block characters** — 5 rows × 5 columns
  per letter with a blank column between, 23 columns. Glyph coverage in Fragment Mono is not
  guaranteed, and one missing character would fall back at a different advance and shear the art.

### The composite — two windows, `>=1200` only

Third pass, 2026-08-13. The user asked for kiro's second window and its drag behaviour:
*"can you add also something like this? in kiro both are dragable in the canva"*. So the hero's
second child is now a **canvas holding two overlapping mock windows**, both draggable.

| | at `>=1200` |
|---|---|
| console | 900 × 440 at (0, 0) |
| terminal | 720 × 320 at (280, 260) |
| **composite box** | **1000 × 580** |
| `#first` height | 198 + 302 + 96 + **580** + 80 = **1256** |

**1000 is chosen against the NARROWEST tier that shows it.** At exactly 1200 the hero's content
row is 1200 − 80 of padding = 1120, so the composite leaves 60px of air on each side — measured.
At 1440 it leaves 180, at 1600 it leaves 260. ⚠️ **Do not grow it past 1120 without checking
1200 first**: the section is `overflow-hidden`, so the overflow would be silently clipped rather
than scrolled.

⚠️ **THE CONSOLE AND THE DRAGGING ARE BOTH GATED TO ONE BREAKPOINT, AND THE SMALLER TIERS DID
NOT MOVE.** Below 1200 the hero renders the terminal alone, exactly as before the console
existed — **952.41 and 905.19, byte-identical to what was measured on the previous pass**.
Three panes at the 358px phone tier are unreadable at any type size that fits, and stacking them
at the tablet tier would add ~460px to a hero that is already 952 there. Verified at 1199 that
the console is `display: none` and the band is back to 952.41.

- **Files:** `MockWindow.tsx` (shared chrome), `SecurityConsole.tsx` (three panes),
  `SecurityTerminal.tsx` (the feed), `SecurityCanvas.tsx` (layout, entry, drag).
- ⚠️ **No shadow separates the two windows.** The reference implementation reaches for
  `shadow-2xl`; **this site ships ZERO shadows** — `shadow-` returns nothing across
  `src/components/`. One here would be the first on the build and would need a token, an
  elevation scale, and a decision about every other card on the site. The front window is opaque
  `ink` and simply **occludes** the back one; the `hairline-light` border draws the seam.
- ⚠️ **The console's rows are the SAME five practice claims** the cells already state in prose
  (region / scope / secrets / retention / source). There is deliberately **no pass/fail badge,
  no "0 vulnerabilities", no compliance score** — a product screenshot is the most convincing
  thing on a marketing page and is exactly how an unbacked claim walks back in.
- ⚠️ **Diff additions and deletions are not green and red**, which is the one place this window
  will look "wrong" to anyone who knows diffs. Monochrome rule; the site's only red/green pair is
  `price-low` / `price-high` and both are marked semantic-only and forbidden as accents.

### Dragging — GSAP `Draggable`, `>=1200` and pointer-capable only

`Draggable` ships in the installed gsap 3.15.0 under the standard no-charge licence — **verified
in `node_modules`, no install needed.** Armed behind
`(min-width: 1200px) and (hover: hover) and (prefers-reduced-motion: no-preference)`.

- **Bounded to `#first`**, cursor `grab` → `grabbing`, dragged window raised to `z-30` for the
  duration, and **eased home over 500ms on release** (the user's call over kiro's stay-put), so
  a visitor cannot leave the hero looking broken and there is no state to persist.
- ⚠️ **`bounds` MUST BE AN ELEMENT, NOT THE STRING `"#first"`, and getting this wrong took the
  whole page down.** `useGSAP({ scope: root })` resolves every GSAP selector inside the
  component's own subtree; `#first` is an ANCESTOR of the canvas, so it matched nothing,
  Draggable read `undefined.nodeType` in `_getBounds`, and React unmounted the client tree. SSR
  still served `#first`, so the failure looked like a hydration bug rather than a selector one.
  `root.current?.closest("#first")` resolves it outside GSAP's scoped lookup.
- **Verified by driving a real drag over CDP**: transform went `matrix(1,0,0,1,0,0)` →
  `matrix(1,0,0,1,-140,-90)` while held, and back to `matrix(1,0,0,1,0,0)` 900ms after release
  (left edge 500 → 360 → 500). Cursor reports `grab` at `>=1200` and `auto` at 1199 and below.
- Cleanup clears `transform`, `cursor` and `zIndex`: matchMedia cannot revert raw-DOM state, so a
  window dragged and then a viewport narrowed below 1200 would otherwise keep a stale offset and
  a `grab` cursor it can no longer honour.

### Motion — **estimated, and the page's only animation**

GSAP + ScrollTrigger (already a dependency, already driving five components). **Two timelines.**

**Intro, once:** banner fades in 200ms, the command reveals by an `Nch` **width tween with
`steps(18)`** at 35ms/char, then the seven rows fade and rise 4px on a 90ms stagger.

**Loop, `repeat: -1`, forever:** slide the list up by exactly one row (350ms, `power2.inOut`),
then advance the head index, repaint all seven rows in place and snap the transform back to 0.
`repeatDelay` 950ms is the dwell, so a full tick is ~1.3s. Verified advancing at t+4s **and
still advancing at t+8s**, at both 1440 and 390.

- ⚠️ **The travel is MEASURED off a live row, not hardcoded.** It has to equal the row height at
  whichever tier is live (22.39px at 14px, 19.19px at 12px), and a literal would be right at one
  tier and visibly wrong at the other — the exact failure `ProductStepper`'s `rows-up` keyframe
  documents and *cannot* avoid, because a keyframe cannot be parameterised. A tween can.
- ⚠️ **`paint()` rewrites `textContent` on a loop, and only the `aria-hidden` root makes that
  acceptable.** The a11y objection to mutating text does not apply to a subtree the a11y tree
  cannot see, and the rows are fixed-height so nothing reflows. The DOM node count is constant
  for the life of the page: seven rows, reused forever, never appended.
- ⚠️ **The loop pauses when the window scrolls off screen** (`ScrollTrigger.onToggle`). This is
  not a micro-optimisation — an endless compositing loop running for the whole time a visitor
  reads the rest of the page is measurable battery on a phone, for something nobody can see.
- ⚠️ **The pulse is bound to a SLOT, not to a row**, so during the 350ms slide it rides upward
  with the row it is on and snaps back at the repaint. At rest — 73% of every cycle — it is on
  the bottom visible row, which is correct. Chasing the handover would mean cross-fading two
  markers for a third of a second to fix something no one can see. Considered, not missed.

- ⚠️ **The typing is a width reveal, not a text mutation.** Appending characters churns the DOM,
  reflows every frame and gives a screen reader a moving target. The string is fully present in
  the markup from SSR onward and only its box is animated. The caret is the next flex item, so
  it trails the reveal for free.
- ⚠️ **The command box width is derived from `COMMAND.length`, and it must stay derived.** It was
  `w-max` first, which measured **650.06px against 242.27px of text** — the span absorbed the
  whole remaining row instead of hugging its content, stranding the caret ~400px past the end of
  the command in exactly the two states with no animation to hide it: JS off and reduced motion.
  Caught by measurement before it shipped. The inline `COMMAND.length + "ch"` is the same
  expression the tween animates to, so the resting width and the animation's end cannot drift.
- **Degradation:** SSR renders a fully populated terminal; GSAP hides and replays it only inside
  `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`. Verified under emulated `reduce`:
  caret `animation-name: none` at opacity 1, **no animation on any status dot**, all rows
  present, banner at 1. ⚠️ **An endless feed is the strongest case on this whole site for
  honouring `prefers-reduced-motion`**, which is why that path is a frozen populated list and
  not a slower version of the same motion.
- ⚠️ **The caret's blink is switched on from the effect, not declared in the markup**, and
  `@keyframes blink` is **reused** from `/product` rather than redeclared. Two reasons, both
  recorded at that keyframe in `globals.css`: the global reduced-motion clamp sets
  `animation-duration: 0.01ms`, which can freeze a caret mid-cycle and invisible (ProductHero
  drops its class outright for the same reason); and a class added at runtime is invisible to
  Tailwind's source scanner, so the utility would only exist while some other file happened to
  spell it out.

## Block 2 — `Benefits` (`#features`)

| Element | ≥1200 | 1024 | 390 |
|---|---|---|---|
| grid | `repeat(3, minmax(50px,1fr))` | `repeat(2, …)` | `repeat(1, …)` |
| grid box | 1280 × 410, max-w 1280 | 944 × 627.17 | 358 × 1062.34 |
| grid gap | **40** | 40 | **32** |
| column width | 400 | 452 | 358 |
| row height | 185 | 182.39 | 150.39 |
| item gap (icon → text) | **64** | 64 | **32** |
| item padding | `0 0 16px` | same | same |
| icon | 36 × 36 | same | same |
| text container gap | 4 | 4 | 4 |
| title `p` | **18px** / 130% / -0.02em / `paper` | **16px** | 16px |
| body `p` | 16px / 130% / **-0.01em** / `paper-soft` | same | same |

- Grid is `grid-template-rows: repeat(2, min-content)`, `grid-auto-rows: min-content`,
  `justify-content: center`, `overflow: hidden`.
- Item is `flex-direction: column`; the icon is its own 36px child, then a `Container` (column,
  gap 4) holding title + body.
- ⚠️ **Every title is exactly 1 line and every body exactly 2 lines at every tier.** The rows are
  uniform, so a 3-line body would move all six. Copy must be fitted by **rendered line count**.
- Six 36 × 36 icons, inlined verbatim from the capture's `svg-templates` defs (generic UI
  glyphs, no branding):

| # | Framer def | Glyph |
|---|---|---|
| 1 | `#svg-2111020249_1166` | padlock over a card |
| 2 | `#svg-2023498974_793` | shield with a check |
| 3 | `#svg1512811545_1378` | viewfinder brackets around a circle |
| 4 | `#svg-2104313390_1421` | key |
| 5 | `#svg-562640884_507` | database cylinder |
| 6 | `#svg-2128099484_612` | monitor with a check |

## Block 3 — `Compliance` (`#features-1`), row 1

`Container .framer-rswx4m`: column, gap **64**, max-w 1280, `align-items: center`.

| Element | ≥1200 | 1024 | 390 |
|---|---|---|---|
| `Title` box | 1280 × 96.81, gap 16 | 944 × 88 | 358 × 70.41 |
| h3 | **44px** / 110% / -0.05em | **40px** | **32px** |
| `Logos` wrapper | flex row, gap 24, 1280 × 240 | 944 × 720 | 358 × 1270.31 |
| grid | `repeat(5, minmax(50px,1fr))`, gap **0**, `flex:1 0 0`, `width:1px` | `repeat(2, …)` | `repeat(1, …)` |
| cell | 256 × **240** | 472 × **240** | 358 × 254.06, **`aspect-ratio: 1.40909`** |
| `Graphic` frame | 104 × 104, centred | same | same |
| label | absolute `left:16 bottom:16`, w **137** (**188** for cell 5), 14px / 130% / -0.01em / `muted`, **left-aligned** | same | same |

- **h3 is ONE element and the `<br>` IS the colour boundary** — an inner `<span>` in `paper` for
  line 1, the h3's own `muted` for line 2. Two sibling blocks would let the halves wrap
  independently. `text-align: center`.
- **Cell rule matrix** — `::after`, `inset:0`, `1px dashed rgba(255,255,255,0.15)`
  (`hairline-light`), written top/right/bottom/left:

| Cell | ≥1200 (5 cols) | 1024 (2 cols) | 390 (1 col) |
|---|---|---|---|
| 1 | `1 0 1 1` | `1 0 1 1` | `1 1 1 1` |
| 2 | `1 0 1 1` | `1 1 1 1` | `0 1 1 1` |
| 3 | `1 0 1 1` | `0 0 1 1` | `0 1 0 1` |
| 4 | `1 1 1 1` | `0 1 1 1` | `1 1 1 1` |
| 5 | `1 1 1 1` | `0 1 1 1` | `1 1 1 1` |

- **Corner brackets:** one 21 × 33 SVG, `paper` fill. TL at grid-relative `top:-5 left:-5`;
  BR at `bottom:-5 right:-5`, `rotate(180deg)`. The grid must be `overflow: visible` (it is) and
  `position: relative`.
  ⚠️ **Structural simplification:** the original wraps each mark in an inert absolutely-positioned
  box (21 × 240 and 21 × gridH+5) with the mark pinned to one end. Two absolutely-positioned
  21 × 33 marks land at the identical rendered coordinates; the wrappers carry nothing else.

## Block 4 — `Compliance` row 2, "Security At Our Core"

`Container .framer-1bz2s3e`: **row** at ≥810 (gap 64, `align-items: flex-start`, max-w 1280),
**column** gap 24 at ≤809.98.

| Element | ≥1200 | 1024 | 390 |
|---|---|---|---|
| left column | `flex:1 0 0`, **max-w 450** | **max-w 280** | `flex:0 0 auto`, w 100% |
| h3 | 44px / 110% / -0.05em / `paper`, **left** | 40px | 32px |
| right column | `flex:1 0 0`, 766 wide, column, gap **32**, `align-items:flex-start` | 600 wide | w 100% |
| body `p` | 18px / 130% / -0.02em / `paper-soft` | 16px | 16px |
| body box | 766 × 187.25 (8 lines) | 600 × 187.17 (9) | 358 × 291.16 (14) |

- The left column is a **flex row with gap 10** holding the single h3.
- ⚠️ **`Explore security portal` is DROPPED** (user's call, 2026-08-12): rogo's points at
  `trust.rogo.ai`, a Vanta trust centre clix does not have. Its measured box is
  **190.06 × 32 at ≥810, 358 × 32 at 390**, label 14px / 130% / -0.01em / `paper`.
  Removing it takes **exactly 64px (32 link + 32 gap)** off the band at every tier.

  ⚠️ **The measured band delta is 64px at ≥1200 and 84.79px at 1024 and 390, and the extra
  20.79 is NOT the link.** It is one line of our own paragraph: the target's body sets in 9
  lines at 1024 and 14 at 390, ours in 8 and 13, and one line at 16px/130% is 20.79px. Two
  independent terms, and conflating them would hide a copy fact behind a layout one.

  | | ≥1200 | 1024 | 390 |
  |---|---|---|---|
  | target `#features-1` | 964.06 | 1435.17 | 2099.08 |
  | ours | **900.06** | **1350.38** | **2014.28** |
  | delta | −64.00 (link) | −64.00 −20.79 | −64.00 −20.80 |

  Document totals reconcile from three terms and nothing else: this band's delta, plus the
  shared `Footer` being **+43.8px** taller than rogo's at 1440 and **+234px** at 390 — the
  pre-existing `FooterMap` difference that `/company` recorded on every route. 2716 − 64 +
  43.8 = 2695.8 ≈ our 2696 at 1440; 4872 − 84.8 + 234 = 5021.2 ≈ our 5021 at 390.

---

## Content — clix's own

### Hero
```
h1       "Your Keys. Your Data."
subtitle "Clix runs your automations inside your own accounts, with the narrowest access
          that does the job."
CTA      "Request Demo"          (the label the Nav and Footer already use sitewide)
```
Both set in **2 lines at every tier**, matching the target's own counts — and that was measured,
not estimated. ⚠️ **The first headline written for this slot did not survive the measurement.**
"Your Data Never Leaves You." is 2 lines at 1440 and 1024 and **3 at 390**, which made the hero
581.98 against the target's 521.19; the block-diff caught it on `heroH`. Seven candidates were
then measured in the live DOM at all three tiers before one was chosen. Character count does not
decide wrapping — the same lesson `/product` recorded on 2026-08-12.

### Six benefits
Drawn from `ClixManifesto.tsx`, `docs/reference/clixsolutions/` and the five practice statements
home's `Security` section already ships. Order and glyph pairing follow the target.

### Five compliance cells
⚠️ **PRACTICES, NOT SEALS** (user's call, 2026-08-12). The target's five cells are SOC2, CCPA,
ISO 27001, GDPR and EU AI Act. SOC 2 and ISO 27001 are **audited certifications clix does not
hold**, and this repo already removed that exact set from the home page on 2026-08-05 for that
reason. The cells now carry the same five practice statements and the same five
`public/badges/practice-*.svg` marks home uses — one story across two pages. **The heading moves
with them**, because "Compliant With / Industry Standards" cannot survive the change.

Do not put certification seals here unless clix has been audited and can produce the report.

---

## Tokens

New: **`paper-soft` `#ffffffcc`** — white @80%. Framer token `--token-2a466810`, listed in
`DESIGN-SYSTEM.md` as declared-but-unused; this is the page that uses it (hero subtitle, six
benefit bodies, the core paragraph). Same shape of correction as `bone`, `brand-green`,
`forest-deep` and `signal-green` before it.

Existing: `ink` (ground), `paper` (headings, CTA fill, brackets), `muted` (compliance h3 line 2
and the five labels), `hairline-light` (`#ffffff26` = the dashed rule's
`rgba(255,255,255,0.15)`), `--container-max`, `--ease-rogo`.

---

## Documented deviations

| Property | Original | Ours | Why |
|---|---|---|---|
| All copy | rogo's | clix's | The `/company` model; nothing to strip later |
| 5 compliance cells | SOC2 / CCPA / ISO 27001 / GDPR / EU AI Act | 5 practice statements | Two are audited certifications clix does not hold |
| Compliance h3 | "Compliant With / Industry Standards" | clix's own two-tone pair | Follows the cells |
| `Explore security portal` | → `trust.rogo.ai` | **removed** | clix has no trust portal; −64px per tier |
| Hero CTA `href` | none | `#contact` | A control that does nothing is a defect. Bare fragment, not `/#contact` — see Block 1 |
| Display face | ABC Arizona Mix Regular | Discovery (`--font-display`) | Sitewide licensing decision, 2026-08-08 |
| Body face | Inter | Discovery (`--font-sans`) | Same |
| Corner-bracket wrappers | inert 21 × N boxes | two absolute 21 × 33 marks | Identical rendered geometry |
| CTA hover timing | not in the capture | 300ms / `--ease-rogo` | **Estimated**, in step with `/product` and `/careers` |
| CTA `hover:opacity-90` | no `:hover` rule in the subtree | added | **Ours, not the target's.** The same "Request Demo" control in the Nav, the Footer, `/product` and `/careers` already fades. A primary CTA that behaves differently on one route is a defect in our own system, whichever way the target authored it |
| Row 1 heading tag | `<h3>` | `<h2>` | `SecurityBenefits` contributes no heading, so an `h3` here would follow the hero's `h1` with h2 skipped. Same call `sections/Security.tsx` and `ProductSecurity.tsx` make in-file. Rendered output identical |
| **Motion** | **none anywhere on the page** | **a scroll-triggered terminal reveal in the hero** | ⚠️ **The biggest deviation on this route.** The target's `data-framer-appear-id` count really is 0 and that finding still stands — this is an ADDITION on the user's instruction (2026-08-13, boss asked for "coding effects" after seeing kiro.dev), not a correction to it. `SecurityBenefits`, `SecurityCompliance` and `SecurityCore` stay motionless |
| **`#first` height** | **`70vh`** (630 at a 900px viewport) | **`min-content`** — 996 / 996 / 952.41 / 905.19 | The section is `overflow: hidden`, so keeping 70vh would have clipped 270px of a 320px window rather than shrinking it. `heroH` is therefore an intentional exclusion in `security-diff.js`, not a mismatch |
| **`/security` JS payload** | n/a | **no longer a zero-JS route** | `SecurityTerminal` is the one client component on the route. The other four blocks stay server components |
| Corner-mark parent | children of `Logos` | children of the grid | Same left edge and same width, so the −5 / +5 offsets are unchanged. Recorded because the block-diff has to search from row 1, not from the grid, to find the target's pair |

## Open questions

1. **Benefit 3** assumes per-run logs exist and are visible to the client. Needs the user.
2. **Benefit 5** names TLS and a managed secret store. Needs the user.
3. Hover states: the capture has no `:hover` rule in any of the three subtrees except the CTA's
   bracket variant. Nothing else on this page is known to respond to the pointer.
4. `paper-soft` on `ink` and `muted` on `ink` contrast — see the acceptance checklist.

## Acceptance checklist

- [x] **Block-diff `ALL MATCH` at 1600 / 1440 / 1024 / 390** — 60 keys per tier when it was run
      on 2026-08-12.
      `node docs/reference/block-diff.js docs/reference/security-diff.js 1600 1440 1024 390`
      ⚠️ **NOT RE-RUN since the terminal landed on 2026-08-13** — it needs the live target, and
      `heroH` was removed from `BODY` that day, so the set is now 59 keys. Our side of every
      remaining key was re-measured directly and is unchanged; the target side was not revisited
- [x] Values from `DESIGN-SYSTEM.md` tokens, or a documented deviation above. No raw hex in
      any of the four components, the six icon SVGs and both bracket pairs included
- [x] Interactive states: CTA hover (brackets slide `−28/−12` → `−18/−2`, plus the
      opacity fade recorded above) and `focus-visible` ring, `paper` on an `ink` offset
- [x] Motion: **none on the target** — `data-framer-appear-id` count on the whole captured page
      is **0**. ⚠️ **NO LONGER TRUE OF OURS as of 2026-08-13**: the hero carries a
      scroll-triggered terminal reveal (Block 1b), built on GSAP + ScrollTrigger, which were
      already a dependency. Recorded in the deviations table. `docs/SKILLS.md`'s `gsap` trigger
      is the one that matches (scroll-driven timeline); its `framer-motion` trigger does not.
      ⚠️ **Both of those skills are listed in `docs/SKILLS.md` as installed and neither is
      actually present in `~/.claude/skills/` any more** — the registry's "verified present on
      2026-08-02" is stale. The repo's own GSAP components were used as the pattern instead
- [x] `npm run build` clean (13 routes, `/security` prerendered static), `tsc --noEmit` clean,
      `eslint` clean on `src/components/security` and `src/app/security`.
      ⚠️ `npx eslint .` still reports **8 pre-existing errors**, all in `ClixCTA.tsx`,
      `ClixHero.tsx`, `block-diff.js` and `contrast-check.js`. None is new and none is here
- [x] Zero horizontal overflow at all four tiers (`scrollWidth === clientWidth` on each)
- [x] Four `[data-nav-theme]` regions — `#first` · `#features` · `#features-1` · `Footer` —
      **all `dark`, every gap 0.00 at every tier**, so the nav never falls back to `light`
- [x] Focus order: one control in `<main>`, the hero CTA, with a visible ring.
      Heading outline h1 → h2 → h3. All five marks load, all `alt="" aria-hidden="true"`
- [x] Contrast run: `paper` on `ink` **18.26:1** AAA · `paper-soft` on `ink` **11.84:1** AAA ·
      `ink` on `paper` (CTA label) 18.26:1 AAA. ⚠️ One failure, see below
- [x] Both `CONTEXT.md` files, `docs/SECTIONS.md`, `docs/DESIGN-SYSTEM.md` and
      `docs/reference/target/README.md` updated

### ⚠️ One AA failure, inherited and awaiting the user's call

The five 14px cell labels are `muted` `#737373` on `ink` = **3.85:1**, under the 4.5 floor for
normal text. It is the target's own pairing and it is the *same* failure already flagged on
home, the footer, `/product` and `/careers`; `mark` `#8b8b8b` reaches 5.36:1 and would close all
of them with one token change. Shipped as measured rather than silently fixed on one route.

`muted` appears in exactly one other place here — the compliance heading's second line — and
that is 44/40/32px, i.e. **large text**, where 3.85:1 passes AA. So this route adds one failing
pair, not two.

### Not ticked

- [ ] **Not compared against the reference screenshots by eye at 1600 or 1024.** The block-diff
      covers all four tiers numerically and both sides were looked at at **1440 and 390**;
      `assets/` holds rogo's strips at all four widths and ours at 1440 and 390 only.
