# Feature: Hero

| | |
|---|---|
| Slug | `hero` |
| Page(s) | home |
| Order on page | 2 |
| Status | `review` |
| Reference | capture → [docs/reference/target/](../../docs/reference/target/) |
| Original Framer name | `Hero` · `#hero` · class `.framer-engtk8` |
| Component | [src/components/sections/Hero.tsx](../../src/components/sections/Hero.tsx) |

## Purpose

Full-viewport opening statement: a looping video background under a dark gradient, with a
centred display headline, a supporting line, and a single "Request Demo" CTA.

---

## Measured spec

> Extracted from `rogo-home-2026-08-02.html` — Framer class rules and inline
> `--framer-*` custom properties. Not sampled from screenshots.

### Structure (as in the original)

```
section.framer-engtk8            Hero — 100vh, flex column, centred
├── .framer-yhqtvr-container     video wrapper — absolute, inset 0
├── .framer-e39ygh               "Darken" gradient — absolute
├── .framer-3mppqw               "Width Container" — max-w 1280, gap 48
│   ├── .framer-1lup4l1          "Title Container" — gap 40
│   │   └── .framer-bcxkzd       "Headline Container" — gap 24
│   │       ├── .framer-1c304lr  h1 wrapper
│   │       └── .framer-x3k1l9   tagline wrapper — opacity .8
│   └── .framer-skweui-container CTA — height 44
└── .framer-cdaiag               "Logo Carousel" — absolute, h 248  ← separate section
```

The CTA is a **sibling of Title Container**, not a child — so the gap above it is Width
Container's 48px, not Title Container's 40px. Title Container has exactly one child, so its
`gap:40px` never applies; it is reproduced for structural fidelity only.

### Layout
| Property | XL ≥1600 | Desktop 1200–1599.98 | Tablet 810–1199.98 | Phone ≤809.98 |
|---|---|---|---|---|
| Section height | `100vh` | `100vh` | `100vh` | `100vh` |
| Section padding | `120px 40px 56px` | `120px 40px 56px` | `120px 40px 40px` | `156px 16px 40px` |
| Section gap | `40px` | `40px` | `40px` | `40px` |
| Container max-width | `1280px` | `1280px` | `1280px` | `1280px` |
| Container padding-bottom | `56px` | `56px` | `56px` | `56px` |
| Container gap (→ CTA) | `48px` | `48px` | `48px` | **`44px`** |
| Headline gap (h1 → tagline) | `24px` | `24px` | `24px` | `24px` |
| h1 max-width | `600px` | `600px` | `370px` (+`width:100%`) | `300px` |
| Tagline max-width | `350px` | `350px` | `350px` | `300px` |

> ⚠️ **The h1 max-widths above are the target's and are no longer what ships.** They were
> sized around the target's headline; ours is longer, so the row is superseded by
> `648 / 648 / 568 / 344` — see "h1 max-width widened for clix copy" under Documented
> deviations. The tagline row is unchanged.

Section is `display:flex; flex-flow:column; place-content:center; align-items:center;
position:relative; overflow:hidden`.

### Typography
| Element | Family | Size | Weight | Line-height | Letter-spacing | Align | Color |
|---|---|---|---|---|---|---|---|
| `h1` | ABC Arizona Mix Regular | **64 / 64 / 56 / 48** px | normal | `95%` | `-0.05em` | center | `#ffffff` |
| Tagline `p` | Inter | `20px` | normal | `125%` | `-0.02em` | center | `#ffffff` @ `opacity .8` |
| CTA label | Inter Medium | `16px` | `500` | `1em` | `-0.01em` | center | `#151515` |

h1 sizes are per tier, XL/Desktop/Tablet/Phone. Confirmed by the three `ssr-variant`
subtrees and their `hidden-*` classes:
`hidden-11hyp1n hidden-9nhpe8` → 64px · `hidden-1eq4joi hidden-9nhpe8 hidden-l1t773` → 56px ·
`hidden-11hyp1n hidden-1eq4joi hidden-l1t773` → 48px.

### Color & surface
| Element | Value |
|---|---|
| Section background (under video) | `#737373` — the `muted` token |
| Darken overlay | `linear-gradient(180deg, #15151500 85%, #151515 100%)`, `opacity:.4`, absolute `bottom/left/right:0`, `height:100%` |
| Darken overlay — phone | same, but the first stop is **`80%`**, not `85%` |
| CTA background | `#ffffff` |
| CTA border | `1px solid rgba(168,162,158,0)` — present but fully transparent |
| CTA radius | `6px` |

`#15151500` is `#151515` at zero alpha, **not** `transparent`. Using `transparent` would
interpolate through rgba(0,0,0,0) and grey the fade. Kept literal.

### Assets
| Asset | Detail |
|---|---|
| Video | `/video/hero-tel-aviv.mp4` · 1920×1080 · h264 · 14.0s · 3.65 MB |
| Poster | `/video/hero-tel-aviv-poster.jpg` |
| Attributes | `loop muted playsinline preload="none"` |
| Fit | `object-fit:cover; border-radius:0` |
| Crop anchor | `object-position:50% 50%` at every tier — **matches the target**, no deviation |
| Content | **Four-clip Israeli sunset montage** — Tel Aviv skyline silhouette, Jaffa port + St Peter's clock tower, aerial sun, residential towers. Sources were chosen by the user; licences and the full ffmpeg chain are in [public/README.md](../../public/README.md). |
| Assembly | 4 segments × 4.95s with 1.2s crossfades, ordered by tone (dark → warm → bright → golden → wraps to dark) so each blend sits between similar luminance. Loop-sealed: the head is crossfaded over the tail then trimmed, so `loop` shows no cut. **15.015s / 360 frames @ 24000/1001** — the target's own container spec is 15.098s / 362 frames. |
| Grade | One unify pass, `contrast 1.04 / saturation 1.06`. Clip 3 additionally warmed (it read cooler and hazier than the other three). Not calibrated to the reference's band numbers — the montage is a deliberate content deviation, so matching its luminance profile to the NYC footage would be measuring against the wrong target. |

### Interactive states
| State | Behavior |
|---|---|
| CTA hover | **Not observable in the capture** — see Open questions |
| CTA focus-visible | Added by us (a11y floor): 2px `paper` ring, 2px offset |
| CTA active | Not observable |
| Reduced motion | Video is not autoplayed; poster shown. See below. |

### Motion
| What animates | Trigger | Duration | Easing | Notes |
|---|---|---|---|---|
| Background video | loop | 14.3s | linear | `preload="none"`, poster first |
| Entrance reveal | — | — | — | **Not measured** — Framer animates in JS |

The capture contains exactly one authored transition site-wide
(`color .3s cubic-bezier(.44,0,.56,1)`), so no hero entrance timing could be extracted.

### Responsive behavior
- **≥1600 (XL):** identical to Desktop — no XL-specific hero rule exists.
- **1200–1599.98 (Desktop):** base rules; h1 64px, padding `120px 40px 56px`.
- **810–1199.98 (Tablet):** h1 → 56px, h1 wrapper → `width:100%; max-width:370px`,
  section padding-bottom → 40px.
- **≤809.98 (Phone):** h1 → 48px, wrappers → 300px, padding → `156px 16px 40px`,
  container gap → 44px, overlay stop → 80%.

---

## Tokens used

`ink` `#151515` · `paper` `#ffffff` · `muted` `#737373` · `hairline` `#a8a29e33` (at 0 alpha
for the CTA border) · `--font-display` · `--font-sans` · `--container-max` `1280px`.

## Documented deviations

| Property | Token would give | Original actually is | Why |
|---|---|---|---|
| Hero video content | US flag / NYC skyline | **Israeli sunset montage** (no flag) | Requested 2026-08-02. The single deliberate content deviation; layout, type, video attributes and crop anchor all unchanged. See [public/README.md](../../public/README.md). |
| `.hero-scrim` layer | — | original has **no** scrim; only the bottom `Darken` gradient | Requested 2026-08-02 ("*add a bit of bg color so its not text directly above image*"). Forced by the deviation above: the original's bottom-only gradient suffices because its NYC footage is dark through the copy band, whereas our montage puts near-white sky behind white 64px type on the aerial-flare segment. Added as a **separate** element so `.hero-darken` stays byte-faithful. |
| Section padding, gaps | 4pt scale | `156px`, `120px`, `44px`, `248px` | One-offs in the original; not tokenized — see DESIGN-SYSTEM.md §Spacing. |
| `prefers-reduced-motion` | — | original has none | Our a11y floor. Video pauses; poster remains. |
| Headline + tagline copy | target's finance-AI copy | **clix's own**, 2026-08-04 | User picked it from five candidates. Headline is the English rendering of the real company site's closing CTA (*אתם מביאים את העסק. אנחנו מביאים את הבינה.*) — see `docs/reference/clixsolutions/`. |
| h1 max-width widened for clix copy | `600 / 600 / 370 / 300` | **`648 / 648 / 568 / 344`** | Measured, not guessed — see below. |
| Authored `<br>` between the two sentences | original wraps freely | explicit break | See below. |

### h1 max-width widened for clix copy (2026-08-04)

The target's caps were sized around *its* headline. Ours is two sentences and longer, so the
old caps forced bad breaks. Measured unwrapped in-browser against the real `ABC Arizona Mix`
at `-0.05em`, the longest sentence — "We bring the intelligence." — needs:

| Tier | font-size | sentence needs | old cap | new cap |
|---|---|---|---|---|
| Desktop / XL | 64px | **637px** | 600 | **648** |
| Tablet | 56px | **558px** | 370 | **568** |
| Phone | 48px | **478px** | 300 | **344** |

Desktop and tablet now fit one sentence per line. **Phone cannot and no cap will fix it** — a
390px viewport less the 32px of side padding leaves 358px of usable width against a 478px
sentence, so phone wraps to two lines per sentence by arithmetic. Its 344 only improves the
rag; it is not an attempt to reach 478.

Left as-is deliberately: the **tagline** caps (`350 / 350 / 350 / 300`) are untouched, so that
row of the layout table still stands.

### Authored `<br>` between the two sentences

Allowed to wrap freely, the shaper breaks the second sentence between article and noun
("We bring the / intelligence.") at 1440, and at 390 it puts the sentence boundary *mid-line*
("business. We") — the worst break on offer. The break is therefore authored, not left to the
shaper, and it is unconditional: it is what makes the phone tier read as two clean sentence
blocks rather than four arbitrary lines.

## Acceptance checklist

- [x] Matches reference at 1600
- [x] Matches reference at 1440
- [x] Matches reference at 1024
- [x] Matches reference at 390
- [x] Spacing/type/color from tokens, or deviation documented above
- [ ] All interactive states implemented — **hover/active unobserved, see below**
- [ ] Motion timing + easing match the original — **no entrance motion measured**
- [x] `prefers-reduced-motion` respected
- [x] Keyboard reachable, focus visible
- [x] `npm run build` clean

## Open questions

- [ ] **CTA hover / active styling.** Framer applies these in JS; the stylesheet has no
      static rule. A placeholder hover (opacity `.9`, 300ms with the site easing) is in
      place and is explicitly *not* claimed to match. Needs observation on the live site.
- [ ] **Hero entrance animation.** Whether the headline/CTA animate in on load is not
      determinable from the capture. Currently none.
- [ ] **Tagline size below 1200px.** The desktop/XL variant declares `20px`; the
      tablet/phone variant carries no explicit `--framer-font-size`, so it inherits a
      Framer text preset that isn't in the capture. Using `20px` throughout — verify.
- [ ] The `Logo Carousel` (`.framer-cdaiag`, absolute, `height:248px`) sits inside the hero
      in the DOM but is registered as its own section. **Not built here.**
