# Context: Footer + closing CTA

Memory for this section. **Newest entry on top.** Append after every task — never rewrite
past entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold,
with no code scanning.

---
## Current state

Built and building clean. Closing CTA, divider, four link columns, a **map panel** and a
centred copyright, all on `ink`. Every cloned value extracted from the capture and verified
by CDP at all four tiers. No new tokens. The link hover is one of only two **measured**
transitions on the site.

The map is the one element here with no counterpart in the target — added 2026-08-11 at the
user's request, ported from clix's own live site. Full spec in `FEATURE.md`.

**Two things need the user's call**, both inherited: the "Legal" link ships on the ≥1200
variant only, and "Press" points at two different destinations by tier. Plus the same
`muted`-on-`ink` contrast failure as `security`, and now a third: the Google embed sets
third-party cookies with no consent gate anywhere on the site.

**Link destinations were decided 2026-08-16** in two passes — see the log entries. Overview's
three are now two working links; Company's three are three working links. **Two links here
still 404** (`terms`, `accessibility`) — `privacy` became a real page on 2026-08-16, see
[features/privacy-page/](../privacy-page/CONTEXT.md). The remaining two are what could not be
repointed, because no page here is a terms-of-use document and pointing at one that is not would
be worse than the 404. They land on a styled, localised 404
rather than Next's bare one, which downgrades this from a defect to a backlog item.

⚠️ **All eight originally-dead links named REAL pages on the real clix site, and all eight are
captured** in `docs/reference/clixsolutions/pages/`. So the Legal column is a PORT of clix's own
Hebrew copy, not authorship — three routes × two locales, scheduled at the user's call.

**Status:** `review`
**Next action:** get the two inherited calls (Legal tier-gating, Press-by-tier) and the
`muted`-on-`ink` contrast call; write the three legal pages, or drop their links; decide
whether the map embed needs a consent gate before production.

---

## Log

### 2026-08-16 — Company column repointed, `Playground` swapped for `Security`

**Trigger:** user, on a screenshot of the Company column — *"now lets move to this section in
the footer, you can change other links to relevant ones"*.

**The finding that reframed the whole backlog.** Before proposing targets, read what these
labels MEAN on the real clix site. `docs/reference/clixsolutions/pages/` contains
`services.html`, `industries.html`, `work.html`, `insights.html`, `playground.html`,
`terms.html`, `privacy.html`, `accessibility.html` — **every one of the eight dead links names
a real, captured page.** None of them was ever a broken link on clix's site; they are pages
this repo has not built. That turns the Legal column from "copy someone has to write" into "a
port of clix's own Hebrew", which is a materially different job and was reported as such.

| Link | Was | Now | Why |
|---|---|---|---|
| `About` | `/company` | unchanged | already worked |
| `Insights` | `/insights` 404 | `/news` | `תובנות` is clix's article hub ("what we learned from the workbench"). `/news` is this repo's article page. |
| `Playground` | `/playground` 404 | **`Security` → `/security`** | see below |

**`Playground` is the footer's only LABEL swap, and the reason is that repointing it would have
lied.** The real `פלייגראונד` is an interactive drag-and-drop node canvas, versioned "v0.1" and
desktop-only, where you wire up a system in the browser. Nothing on this site resembles it, and
the nearest candidate (`/clix`) is a brand showcase — it would have answered a different
question than the one clicked, which is the exact test that got `industries` deleted. Offered to
the user as delete-vs-swap; they took the swap.

`Security` was the replacement because it is a real route, it is a trust page a business footer
wants, and **`/clix`, `/security` and `/news` were all linked from this footer nowhere at all** —
so the slot buys a missing page rather than a synonym for one already present. Two of those
three are now covered.

**On `Insights` → `/news`, the honest caveat:** the KIND of page matches, the contents do not.
Clix's `תובנות` is clix's own writing; our `/news` aggregates external AI stories and its cards
link out. Kept the label "Insights" while the nav calls the same route "News" — the identical
divergence `about`/`Company` already carries, and tolerated for the same reason.

**Hebrew is SOURCED, not authored.** `security: "אבטחה"` is the SAME STRING as `nav.labels[2]`,
which came off the real site. One route, one Hebrew name — the alternative was inventing a
second word for a page that already has one.

**Not done, deliberately:** the Legal column. Flagged, not started.

**Verified** on `next start`: `/news` and `/security` 200 in both locales; the rendered footer on
`/company` contains zero occurrences of `/insights`, `/playground`, `/services`, `/industries` or
`/work`; the Hebrew footer renders `אבטחה` and `תובנות` with `פלייגראונד` gone; `/terms`,
`/privacy` and `/accessibility` still 404 in both locales, as expected.

---

### 2026-08-16 — Overview column repointed, `Industries` deleted

**Trigger:** user, on a screenshot of the Overview column — *"lets start working on the footer
buttons, how can we put data to each, can we just point these to existing pages?"*

**The measurement that framed it.** Curled every internal footer href against the dev server
before proposing anything: **8 of 12 returned 404.** Only `/company` and `/contact` resolved.
The 2026-08-12 note in `Footer.tsx` had already said as much in prose ("the other eight links
still point at routes this repo does not have"); the curl turned it into a list.

**Decision, made by the user from three options.** Repoint the ones with an honest target, cut
the one without, leave the rest for a separate pass.

| Link | Was | Now | Why |
|---|---|---|---|
| `Services` | `/services` 404 | `/product` | That page IS what clix builds. Same move as `about` → `/company` on 2026-08-12. |
| `Work` | `/work` 404 | `/#testimonials` | The only client work on the site. The nav already calls that band "Customers". |
| `Industries` | `/industries` 404 | **deleted** | No page, no section, not a paragraph. Every candidate answered a different question than the one clicked. |

⚠️ **The leading slash on `/#testimonials` is load-bearing.** A bare `#testimonials` is a
same-page scroll — correct only in this footer's copy on `/`, and inert on the other five
routes. With the slash, `AppLink` takes its `<Link>` branch, `localeHref` turns it into
`/he#testimonials` on Hebrew pages, and its own same-route guard collapses it back to a scroll
when you are already home. All three behaviours are pre-existing; nothing was added to
`AppLink`.

**`industries` was removed from the TYPE, not just the data** — `ChromeDict.footer.links` in
`dictionary.ts`, plus the EN and HE strings. A dictionary key nothing reads is dead weight, and
git holds the Hebrew (`תעשיות`) if the page is ever built. Note this made `en/chrome.ts`'s
"changes no existing copy" guarantee need a caveat: the guarantee covers the strings, not the
SET of them, and a removal is the one edit the block-diff baseline cannot express. Said so in
that file's header.

**Structure now diverges from the target by one link.** Overview carries two where the capture
has three. The four-column grid, the column titles and the per-tier gating are untouched.

**Not done, deliberately:** the other five dead links. The user scoped this pass to Overview.
`terms` / `privacy` / `accessibility` are pages a business site is expected to actually have,
so they want writing rather than repointing; `insights` / `playground` have no obvious home.

**Verified** on `next start`, not dev: `/product` and `/he/product` 200, `id="testimonials"`
present on `/`, and the rendered footer on `/company` emits `/product` and `/#testimonials`
with zero occurrences of `/services`, `/industries` or `/work`.

---

### 2026-08-11 — map panel added to the link row

**Trigger:** user — a screenshot of `clix-main-page.vercel.app`'s footer map, *"we have to
add that to our system, make it look good and should be good for the theme"*. Then a second
screenshot with a red box drawn at the top-right of the link row: *"you should put it to the
red box, only the map is needed, you can move the other links a little to the left"*.

**Where the source markup came from.** The reference site is a client-rendered Vite app; its
`main-*.js` bundle contains no `iframe` and no maps URL, so static fetching found nothing.
Rendering it headless and dumping the post-JS DOM produced the element in one shot. Worth
remembering for the next port off that site — **curl the HTML, get nothing; dump the DOM,
get everything.**

**Measured off the source:**
`https://maps.google.com/maps?q=Tel+Aviv-Yafo&hl=iw&z=12&output=embed` · `h-[210px]` →
`230px` @lg · `rounded-[18px]` · `border-white/10` · `saturate(.85)` · `max-w-[430px]` ·
`loading="lazy"` · `referrerpolicy="no-referrer-when-downgrade"`.

**Four deliberate departures from it**, all in `FEATURE.md`'s table:

- `rounded-[18px]` → `rounded-[6px]`. Counted the radii actually in use across
  `src/components` first: **14 × `6px`**, one each of `4px`, `2px`, `28px`, `full`. 18px
  would have been the only one of its kind on the site.
- `saturate(.85)` → `saturate(.65) brightness(.82) contrast(1.04)`. The first build shipped
  `.85` verbatim and the screenshot settled it: on `ink` the map was **brighter than the
  headline and the CTA**. Full colour returns on hover, on the site's own
  `.3s var(--ease-rogo)`.
- `max-w-[430px]` → tiered `100% / 280px @810 / 430px @1200`. The source's map sits alone;
  ours shares a row with four link columns. At 810 the container is 730px — 430 would leave
  the columns ~59px each and wrap "Privacy Policy" (~95px at 14px). 280 leaves ~96px, which
  clears it. Verified at 810 and 1024: no label wraps.
- Fixed height → `self-stretch` + `h-full` from 810, so the panel matches the row rather
  than carrying a second hard-coded number.

**Placement.** Fifth item in the existing link row, not a new row. The four columns are
`flex-[1_0_0]`, so a fixed-width fifth item is what shifts them left — the user's ask
needed no change to any column.

**Reversed within the same task.** The first build was a full "Office" block: label, address
line, hours, and a separate `Open in Google Maps` link with a hover-nudged arrow, laid out
beside the map in its own row under the link columns. The user cut it to the map alone. The
text is gone; the embed's built-in "Open in Maps" button carries the click-through now. The
one thing lost with it is an explicit external-link affordance in our own markup — noted, not
mourned.

**No address is shown because clix has none published.**
`docs/reference/clixsolutions/content.json` gives only "תל אביב · שירות גלובלי" and
"א׳–ה׳ · 09:00–18:00". The pin is the city, at `z=12` — same as the source. Nothing invented.

**Verified:** `npm run build` clean, `tsc --noEmit` clean, `eslint` clean on both files.
Screenshotted at 1600 / 1024 / 810 / 390 with the dev server running — panel right-aligned
in the row at ≥810, full-width below it, no horizontal overflow at any tier.

**Left open:** the embed is third-party and sets Google cookies on load, with no consent
gate anywhere on this site. Flagged in `FEATURE.md`; needs a decision before production.


---

### 2026-08-03 — built

**Trigger:** user — a rogo.ai screenshot of the footer, *"this also"*.

**Done**
- Extracted the footer (`.framer-8dt5bh-container`, HTML offsets 503682–550741 — 47 KB
  across three full DOM copies) and every CSS rule touching its 47 classes.
- Built `Footer.tsx`; wired into `page.tsx` **outside `<main>`**, as in the original.
- No new tokens.

**Measurements worth keeping**

- **A nested Framer component ships its own tier-gating hashes.** The page's are
  `hidden-11hyp1n` / `hidden-9nhpe8` / `hidden-1eq4joi` / `hidden-l1t773`; the footer's are
  `hidden-1leoyz4` / `hidden-16n7npo` / `hidden-d23fwj` / `hidden-1roolzl`. Same four
  media queries, different names. They had to be re-derived from the stylesheet — reusing
  the page's mapping would have silently mis-assigned every value.
- **Two of the component's variants are never rendered, and their CSS is a trap.** The
  stylesheet carries `framer-v-1cxbn18` and `framer-v-18cp4bv` alongside the three that do
  render. `1cxbn18` declares `grid-template-columns: repeat(2, minmax(50px,1fr))` on the
  link row — exactly the kind of rule you would attribute to the tablet tier if you matched
  on class name alone. It does not apply. **Every rule was checked for whether it names one
  of `1hizjvd` / `25d1j7` / `3r98zd` before its value was recorded.** This is the README's
  "only the rendered variant is authoritative" rule biting for the third time.
- **The divider is two different colours by tier** — `rgba(56,56,56,0.5)` at ≤1199.98,
  `rgba(255,255,255,0.1)` at ≥1200. `rgb(56,56,56)` is exactly `ink-soft` `#383838`, so
  both are opacity modifiers on existing tokens rather than new values. Over `ink` they
  land on `#262626` and `#2c2c2c` — genuinely different, close enough that nobody would
  catch it by eye.
- **The copyright has three different size/weight combinations** across the three variants:
  12px/500 desktop, 14px/500 tablet, 14px/400 mobile. No pattern; read off each variant.
- **The CTA button is 16px where the nav's is 14px**, with otherwise identical internals
  (`8px 16px` around a `20px` row with the `1px` optical nudge, `6px` radius, transparent
  `1px` border). Its height comes from the *container* — 44px desktop, **42px tablet**,
  44px mobile — not from the padding.
- **The link hover is measured, not estimated.** `framer-styles-preset-1twswsp` declares
  `--framer-link-hover-text-color: #f5f5f5` and `transition: color .3s
  cubic-bezier(.44,0,.56,1)`. That makes this the **second** authored transition found in
  the whole capture, after the nav banner's. Scoped to `color` only — `transition-colors`
  would have over-reached to background, border and outline.
- **Three content differences between tiers**, all reproduced:
  1. The **"Legal" link ships on the ≥1200 variant only** (3 links there, 2 below).
  2. **"Press" points at `mailto:press@rogo.ai` at ≥1200 and `https://x.com/RogoAI` below.**
  3. The **CTA has no `href` at all on the ≥1200 variant**; the other two have `./demo`.
- Footer has **no vertical padding of its own**. The Reiteration block's `padding-top:56px`
  is the whole top inset; the Copyright's `16px` is the bottom.

**Decisions**

- **The CTA gets `/demo` at every tier — the one deliberate deviation.** An `<a>` with no
  `href` is not keyboard-operable, and the missing one is on the *desktop* variant, i.e. the
  primary one. The value is not invented: it is the original's own, from its sibling
  variants. Smaller deviation than the nav's `Request Demo` fix, where no target existed.
- **The other two tier differences are reproduced verbatim**, each link gated to the tier
  that declares it. Consistent with the call made on `security`'s ragged borders: reproduce,
  flag, offer the fix, let the user decide. Two `<a>`s labelled "Press" with one
  `display:none` is ugly, but `display:none` is skipped by assistive tech, so it costs
  nothing but source noise.
- **Root-relative hrefs** (`/product`) rather than the capture's `./product`, matching
  `Nav.tsx`. `./` would resolve relative to the current route and break from any nested page.
- **Real hrefs kept even though every destination 404s.** Replacing them with `#` would
  destroy the information architecture for no gain; the missing pages are a known open item
  in `PROJECT.md`.
- **`<footer>` outside `<main>`**, as a landmark sibling — which is also where the original
  puts it.
- **Focus rings added** on every link and the CTA. The original has none.

**Verified**
- CDP probe at 1600 / 1440 / 1024 / 390 — footer padding, container, Reiteration direction
  and padding, headline size/leading/line count (2 lines at ≥810 at 106px, 3 at ≤809.98 at
  145px), CTA box **44 / 44 / 42 / 44+full-width**, divider colour per tier, Bottom gap,
  link-row direction, group widths (308 / 308 / 224 / 358), title and link type, the
  copyright's three size/weight combinations, and **every link's rendered `href` at every
  tier** — confirming Legal ships 3 links at ≥1200 and 2 below, and Press flips destination.
  Every value matches the capture. No horizontal overflow at any width.
- Contrast: links `18.26:1`, hover `16.75:1`, CTA label `18.26:1`. **Group titles and
  copyright `3.85:1` — fails AA**, same `muted`-on-`ink` problem as `security`.
- `npm run build` and `eslint src` clean.
- Rendered and looked at, 1440. Compared against the user's live-site screenshot: matches.

**Open / deferred**
- The two tier-difference calls, and the contrast call.
- Link destinations 404 until the other pages are scoped.
- The CTA button's hover is unobserved — it is a separate Framer component with no `:hover`
  in the capture, so ours has none either.
