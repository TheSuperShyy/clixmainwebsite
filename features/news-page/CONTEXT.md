# Context: News page (`/news`, clone of `rogo.com/news`)

Memory for this page. **Newest entry on top.** Append after every task — never rewrite past
entries. Record decisions, measurements, and reasons; skip narration.

---

## Current state

Built 2026-08-11 in one pass: hero + pills + grid live at `/news`, populated with a
12-story AI-news digest dated 2026-08-10/11. **Card art replaced 2026-08-12** — the
source-name placeholder tiles are gone; every story now carries one of rogo's three real
card templates. Status: `review` — never pixel-diffed, like the rest of the site. Detail
in the log below.

---

## Log

### 2026-08-12 — real card art: rogo runs THREE templates, not one

**Trigger:** user, with a screenshot of rogo's grid — *"the news doesnt have preview image,
we have to add for each of them, the template design can be the same as how rogo do it"* —
then, when asked about automating it: *"ok this is just a static page, so dont make it
automated, we just have to put preview image for each."* Logos: *"real company logos."*

**The finding that shaped everything.** rogo's six visible cards are not one template with
different content. They are **three templates**: flat wordmark lockups (×3), a photograph
with a floating white chip (×1), and light panels carrying figures (×2). Cloning "the card
image" as a single design was the mistake the previous placeholder made in miniature.
Ours: **5 lockups · 3 stat tiles · 4 photographs**, declared per story in `newsItems.ts`.

**Decisions, with reasons:**

- **Art moved onto the ITEM, not the grid index — and that is a bug fix.** The old tile
  ground was `TILE[i % 4]`, indexed on grid *position*, so a story changed colour when you
  clicked a filter pill. It cannot now.
- **Marks are simple-icons (CC0), inlined as `currentColor`.** `ToolGlyphs.tsx` already did
  exactly this and already carried `openai` and `claude`, so `NEWS_GLYPHS` **spreads** it
  and adds five. Its `<svg>` moved to a shared `ui/Glyph.tsx` — two rosters, one element.
  A third roster (`clix/toolMarks`) exists and stays separate, as `CompanyTools` decided.
- ⚠️ **TWO simple-icons SLUGS ARE THE WRONG COMPANY, and the slug will not tell you.**
  `riot` → `<title>Riot icon</title>` = Riot Games / Riot.im, **not** Riot Platforms the
  miner. `axios` → `<title>Axios</title>` = the **JS HTTP client**, not the news outlet.
  Both were caught by reading the `<title>` out of each fetched file. `financialtimes` and
  `unitree` 404. **Read the title before using any mark**; a confidently wrong logo is
  worse than the typeset name, which is why four names ship as type.
- **Photographs: Pexels, `w=1200`, bytes verbatim.** Same route `/careers` used. Search
  page still 403s → IDs come from `WebSearch` scoped to `pexels.com` (the ID is the
  trailing number in the slug). ~1 CDN filename in 8 404s; take the next candidate.
- **`objectPosition`'s HORIZONTAL value does nothing on this page.** Every source is taller
  than the 1.90476 slot, so `cover` locks to width. `/careers` recorded the mirror image of
  this trap (box taller than source, vertical value inert). Two pages, both halves.

**Two rejections worth keeping, because both were shipped first and both were wrong:**

1. ⚠️ **A generic building is not an illustration.** The Fed card shipped as a neoclassical
   facade; user: *"i dont see the connection of the background and the topic."* Chasing a
   better photo failed on a rule, not on luck — **every candidate either names the wrong
   institution or names none**: the Capitol is Congress; a carved "United States National
   Bank" is a commercial bank; Pexels' single "Fed building" result (`6534073`) is actually
   the **Tennessee State Office Building**, mislabelled upstream, with its own name carved
   across the entablature. Fixed by changing *template*, not asset: a `Federal Reserve /
   AI overhaul` lockup states the connection instead of asking the reader to complete a
   metaphor. `institution-facade.jpg` was **deleted**, not left unreferenced — everything
   under `public/` ships whether code points at it or not.
2. ⚠️ **A regular grid reads as a template; four big empty panels read as a skeleton.**
   The first sequencing put one kind per column on every row — user: *"i like the layout
   more earlier, did yo change it? i like more with randomness."* Replaced with a composed
   order (`L P S / P L L / S L P / L S P`: no row or column one kind, dark grounds
   zig-zag). Separately, the stat tiles' texture began as four large blank rounded rects,
   which is the exact shape of a **loading skeleton**. rogo's own wordless card is the
   opposite — many small marks. Now a deterministic square field: an LCG seeded per tile,
   **computed once at module scope** so server and client agree and a filter click cannot
   reshuffle it, with a centre ellipse punched out so type never sits on texture.

**Accessibility contract:** photographs carry real `alt`; **lockup and stat tiles are
`aria-hidden`** — every string in them is restated in the `<h6>` directly beneath, so
announcing them would read the story's subject twice. Same contract `ToolGlyphs` and
`ProductDataPartners` already hold.

**Verified:** `npm run build` clean, 13 routes, no type errors. Rendered and eyeballed at
1600 and 390 via headless Chrome against the running dev server. **Not** pixel-diffed
against the reference — unchanged from the rest of the site.

---

## Log (earlier)

### 2026-08-11 — page built from a live fetch, content is a real AI-news digest

**Trigger:** user, with rogo.com/news and a Telegram AI-digest side by side — *"add this
page for clix as well the news i want you to extract ai news strictly like this but make
sure the design follows rogo 100%"*.

**Measurement source is a LIVE FETCH, not a frozen capture** — no capture of `/news` exists.
Fetched 2026-08-11 to the scratchpad (371 KB, all Framer CSS inline) and extracted the spec
in `FEATURE.md` from the stylesheet, not from screenshots. If the page is ever re-verified,
re-fetch: rogo may have shipped changes since.

**Decisions, with reasons:**

- **Nav is FIXED on this page (`<Nav models={models} />`, no `spacer`)** — measured:
  `/news`'s header is `position:fixed` like home's, NOT in-flow like `/felix`'s. The
  section's own `220px` top padding is what clears it. Three pages, two nav treatments,
  both measured.
- **The ticker banner stays.** Rogo shows their Series D banner on `/news`; the ticker is
  our equivalent of "the site banner", so the page passes `models` exactly like home.
  `revalidate = 300` for the same reason as home.
- **Categories are ours, count is theirs.** Five pills (All + 4), matching rogo's five.
  Media/Product/Partnerships/Meet-the-team make no sense over AI headlines;
  Models/Business/Security/Policy is how the 12 stories actually cluster (3/4/2/3).
- **Cards link OUT (new tab).** Rogo's cards go to internal posts; ours are third-party
  reporting, so the honest link is the source article. `rel="noreferrer"` on all.
- **Tiles instead of images.** Rogo's card art is theirs. Ours: token grounds rotating
  canvas → forest → canvas → forest-deep with the source name in the display face — the
  language of rogo's own "rogo × Entropia" partnership tile, built from things we own.
- **The digest is REAL and DATED.** 12 stories from 2026-08-10/11, gathered via web search
  at build time (aiweekly.co index cross-read). Every headline, source and URL is genuine —
  no fabricated content on this page, so `/news` ships WITHOUT a robots block, unlike
  `/clix` (whose noindex is the testimonials' fault, not a site policy).
- **Dates**: rendered `8/11/26` via `<time dateTime>` — the target's own format
  (`<time datetime="2026-08-06...">8/6/26</time>`).
- **Filter is plain `useState`** — no library. Nothing observable animates on rogo's
  filter; instant swap. The three unobservable states are logged as open questions in
  `FEATURE.md`, not guessed at.

**Hard-won values** (all in FEATURE.md's tables): section `220/40/120` (phone x-16);
board gap **32** between tabs and grid (`framer-10awqyd`), not the section's 64; pills
h-40 / pad `10px 20px` / radius 28 / border `rgba(24,24,24,0.1)`; card image aspect
**1.90476**; card title is an **h6** at 20px/−0.03em in the original — kept.

**Content maintenance:** the digest is a static file, `src/components/news/newsItems.ts`.
Refreshing the news = editing that one file (or asking for a re-extract); layout never
changes with it.

**Skills:** `frontend-design` + `responsive-design` invoked per SKILLS.md; fidelity guard
applied — measured values used verbatim, skills' generic breakpoints/aesthetics ignored
where they conflicted (all real tiers are Framer's 810/1200/1600).
