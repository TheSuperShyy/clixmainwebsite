# Context: News page (`/news`, clone of `rogo.com/news`)

Memory for this page. **Newest entry on top.** Append after every task — never rewrite past
entries. Record decisions, measurements, and reasons; skip narration.

---

## Current state

Built 2026-08-11 in one pass: hero + pills + grid live at `/news`, populated with a
12-story AI-news digest dated 2026-08-10/11. Status: `review` — never pixel-diffed,
like the rest of the site. Detail in the log below.

---

## Log

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
