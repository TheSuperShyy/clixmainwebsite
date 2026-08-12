# Feature: News page (`/news`, clone of `rogo.com/news`)

| | |
|---|---|
| Slug | `news-page` |
| Page(s) | `/news` |
| Order on page | whole page: Nav (fixed) → Articles (hero + tabs + grid) |
| Status | `building` |
| Reference | live fetch of `rogo.com/news` 2026-08-11 (scratchpad `news/news.html`, 371 KB) — no frozen capture exists for this page |
| Original Framer name | `Articles` (`id="articles"`), Title (`framer-oci17d`), Tabs (`framer-1jqmcbo`), grid (`framer-plwnat`), card (`framer-m8c64b`) |
| Component | `src/app/news/page.tsx` + `src/components/news/` |

## Purpose

Rogo's press/updates index: an oversized serif "Updates" hero with a media-contact button,
category filter pills, and a 3-column grid of article cards (image, date, title). Ours keeps
the design 1:1 and swaps the content for a **daily AI-news digest** (2026-08-11, user:
"extract ai news strictly like this but make sure the design follows rogo 100%") — cards
link OUT to the source articles instead of to internal posts.

---

## Measured spec

> Extracted from the live-fetched HTML (all Framer CSS inline). The page's own tiers are the
> standard four; **desktop and XL share every value** here, as on `/clix`.

### Layout
| Property | XL 1600 | Desktop 1440 | Tablet 1024 | Phone 390 |
|---|---|---|---|---|
| Section (`#articles`) padding | `220px 40px 120px` | same | same | `220px 16px 120px` |
| Section gap (Title ↔ board) | 64 | 64 | 64 | 64 |
| Title block max-width / gap | 960 / 20 | same | same | same |
| Subtitle max-width | 540 (`text-wrap: balance`) | same | same | same |
| Board (tabs+grid) max-width / gap | 1280 / **32** | same | same | same |
| Tabs: wrap, centered, gap | 10 | 10 | 10 | 10 |
| Grid columns / gap | 3 / 32 | 3 / 32 | **2** / 32 | **1** / 32 |
| Card: column, gap / padding-bottom | 16 / 24 | same | same | same |
| Card image aspect | 1.90476 (2400×1260) | same | same | same |
| Card meta ↔ title gap | 4 | same | same | same |

### Typography
| Element | Family | Size | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|---|
| h1 `Updates` | display (orig. Arizona Mix) | **88 / 88 / 72 / 64** | 400 | 95% | −0.06em (phone −0.05em) | ink |
| Subtitle | Inter 16 (preset `plq9r5`) | 16 | 400 | 130% | −0.01em | muted |
| Button label | Inter | 16 | 500 | 1em | −0.01em | paper |
| Pill label | Inter (same preset as subtitle) | 16 | 400 | 130% | −0.01em | paper (active) / muted (inactive) |
| Card date | Inter (preset `195y48i`) | 12 | 400 | 130% | −0.01em | muted |
| Card title (h6 in original) | display | 20 | 400 | (unset → 1.2em) | −0.03em | ink |

### Color & surface
| Element | Property | Value |
|---|---|---|
| Page | background | `#ffffff` (paper) |
| Button | bg / radius / padding / inner | ink / 6px / `8px 16px` / h-20 + 1px top pad (same anatomy as `Request Access`) |
| Pill active | bg / text / border | ink / paper / none |
| Pill inactive | bg / text / border | paper / muted / **1px `rgba(24,24,24,0.1)`** |
| Pill shape | height / padding / radius | 40 / `10px 20px` / 28px |
| Card image | radius | **0** — square corners, no radius anywhere on the card |

### Card art — three templates (2026-08-12)

Original cards use `framerusercontent` images (rogo's own — not vendored, same rule as
everywhere). **rogo's grid is not one template**, which is the fact this section is built
on: its six visible cards run flat wordmark lockups (`rogo × Entropia`, `rogo + Rivanna`,
`rogo × DOW JONES`), one photograph with a floating white chip (`Claude Opus 5 with Rogo`),
and light panels carrying figures (`Deal Room`, `✳ Intelligence`). Ours runs the same three
over 12 stories — **5 lockups · 3 stat tiles · 4 photographs** — declared per item in
`newsItems.ts` and drawn by `NewsBoard.tsx`.

| Template | Ground | Contents | rogo's original |
|---|---|---|---|
| `lockup` | `forest` ×2 · `canvas` ×2 · `forest-deep` ×1 | centred `[mark] Name  ×|/  Name [mark]`, display 20px/−0.03em | `rogo × Entropia` |
| `stat` | `surface` ×3 | square-field texture + centred figure (display 28) over caption (sans 14 `muted`) | `Deal Room` / `✳ Intelligence` |
| `photo` | — | full-bleed `object-cover` + centred white chip (radius 10, `8px 12px`, sans 14) | `Claude Opus 5 with Rogo` |

Slot is unchanged at every tier: `aspect-[1.90476]`, `overflow-hidden`, **radius 0**.

**Order is composed, not chronological** (it never was). Strict alternation was tried first
and rejected — it put one kind per grid column on every row, which reads as a template.
The shipped sequence gives `L P S / P L L / S L P / L S P` at 3 columns: no row or column
is one kind, and the three dark grounds zig-zag rather than lining up.

#### Brand marks
simple-icons, **CC0 1.0**, single-path 24×24, inlined as `currentColor` — the same source
and contract as [`ui/ToolGlyphs.tsx`](../../src/components/ui/ToolGlyphs.tsx), whose `<svg>`
was lifted into a shared `ui/Glyph.tsx` for this. `NEWS_GLYPHS` spreads `TOOL_GLYPHS`
(`openai` and `claude` were already there) and adds **`anthropic`, `meta`, `github`,
`googlechrome`, `apple`**.

> ⚠️ **Two slugs are the wrong company.** Verified by reading each file's `<title>` rather
> than trusting the slug: simple-icons' **`riot` is Riot Games / Riot.im**, not Riot
> Platforms the miner; its **`axios` is the JS HTTP client**, not the news outlet.
> `financialtimes` and `unitree` 404. All four render as type — the fallback ToolGlyphs
> already documents, and the reason `Riot Platforms` and `Federal Reserve` are typeset.

#### Photographs
All Pexels (`images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg?auto=compress&cs=tinysrgb&w=1200`),
royalty-free commercial, no attribution. Response bytes verbatim — **no local re-encode**
(there is no `sharp` in this repo and none was added). `w=1200` is a 2× source for a card
that is ~405px at desktop.

| File | Pexels ID | Delivered | Bytes | Subject | Framing |
|---|---|---|---|---|---|
| `australia-parliament.jpg` | 12532604 | 1200×800 | 38 KB | flag mast, Australian Parliament House | `50% 25%` — mast is in the top third |
| `shanghai-lujiazui.jpg` | 31772144 | 1200×800 | 174 KB | Lujiazui towers, Shanghai Tower at right | default |
| `singapore-marina-bay.jpg` | 33847224 | 1200×800 | 269 KB | Marina Bay skyline across the water | `50% 20%` — crops two walkers out |
| `vacated-desk.jpg` | 19165510 | 1200×803 | 87 KB | emptied cubicle, bare desk by a window | default |

⚠️ **`objectPosition`'s first value does nothing here.** Every source is *taller* than the
1.90476 slot, so `cover` locks to width and only the vertical value reframes. Same trap as
`/careers`, arriving from the opposite direction (there the box was taller than the source).

⚠️ **Licensing, one level past "royalty-free".** The Pexels licence bars photos of
identifiable people in ways implying endorsement. Applied here by subject and by crop: no
frontal face appears in any of the four.

⚠️ **Pexels' search page still 403s** to a plain fetch (as `company-page/CONTEXT.md`
records). IDs came from `WebSearch` scoped to `pexels.com` — the ID is the trailing number
in the result slug. The CDN filename pattern above 404s for roughly 1 ID in 8; take the
next candidate.

**A fifth photo was sourced and deleted** — see the Fed card note under *Documented
deviations*.

### Interactive states
| Element | Hover | Focus-visible | Notes |
|---|---|---|---|
| Button | opacity .90, 300ms `--ease-rogo` | ring | same as site buttons |
| Pill | ⚠️ unobserved (open question) | ring | no hover invented |
| Card | ⚠️ unobserved (open question) | ring on link | no hover invented |

### Motion
Filter switching: no transition observable from static HTML — instant swap shipped.
Library: none (plain React state). Reduced-motion: nothing animates.

### Responsive behavior
- **≥1200:** 3-col grid, h1 88.
- **810–1199.98:** 2-col grid, h1 72.
- **≤809.98:** 1-col grid, h1 64 with −0.05em, section x-padding 16.

---

## Tokens used

`paper`, `ink`, `muted`, `canvas`, `forest`, `forest-deep`, `--container-max` (board is 1280
— same value), `--ease-rogo`, `--font-display`, `--font-sans`.

## Documented deviations

| Property | Original | Ours | Why |
|---|---|---|---|
| h1/card-title face | ABC Arizona Mix | Discovery (`--font-display`) | licensing, sitewide decision 2026-08-08 |
| Card images | rogo's article art | 5 lockups / 3 stat tiles / 4 Pexels photographs | rogo's assets are not vendorable; the three templates are rebuilt from their own grid's language, and the marks are CC0 |
| Fed card art | — | **typeset lockup, not a photograph** | user 2026-08-12: *"i dont see the connection of the background and the topic"*. Every candidate building either names the **wrong** institution (the Capitol = Congress; a carved "United States National Bank" = a commercial bank; Pexels' one "Fed building" hit, 6534073, is the **Tennessee State Office Building**, mislabelled upstream) or names none and connects to nothing. `Federal Reserve / AI overhaul` states the link instead of implying it. `institution-facade.jpg` (7078251) was deleted rather than left in `public/`, which ships whether or not code references it |
| Card link target | internal `/news/<slug>` | external source article, new tab | ours is a digest of third-party reporting |
| Pill categories | Media/Product/Partnerships/Meet the team | Models/Business/Security/Policy | content is AI news, not rogo PR |
| Button `mailto:` | press@rogo.ai | clixteam579@gmail.com | our media contact |

## Acceptance checklist

- [ ] Matches reference at 1600 / 1440 / 1024 / 390
- [x] Spacing/type/color from tokens, or deviation documented above
- [ ] All interactive states implemented (two are unobservable — see open questions)
- [x] Motion: none to match
- [x] Keyboard reachable, focus visible
- [x] Meaningful text alternatives; contrast ≥ AA
- [x] `npm run build` clean
- [x] `CONTEXT.md` (feature + global) updated, `SECTIONS.md` row added

## Open questions

- [ ] Pill hover state — not observable from static HTML; nothing shipped.
- [ ] Card hover state — same.
- [ ] Whether rogo animates the grid on filter change — unobservable statically; instant swap shipped.
