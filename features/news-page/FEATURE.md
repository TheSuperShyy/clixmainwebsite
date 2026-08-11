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

### Assets
Original cards use `framerusercontent` images (rogo's own — not vendored, same rule as
everywhere). Ours are **built tiles**: solid token grounds (canvas / forest / forest-deep
rotation) with the story's source name set in the display face — the visual language of
rogo's own partnership tiles ("rogo × Entropia").

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
| Card images | rogo's article art | token-ground source tiles | rogo's assets are not vendorable; tiles reuse their own partnership-card language |
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
