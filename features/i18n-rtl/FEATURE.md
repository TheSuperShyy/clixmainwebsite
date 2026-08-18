# Feature: Hebrew locale + RTL

**Status:** `review` (all 7 routes translated; direction pass complete; **not visually reviewed by a Hebrew reader**)
**Started:** 2026-08-12
**Slug:** `i18n-rtl` · registry row: [docs/SECTIONS.md](../../docs/SECTIONS.md)
**Agent contract for the build wave:** [docs/i18n-agent-contract.md](../../docs/i18n-agent-contract.md)

---

## What this is

A second locale — Hebrew, `dir="rtl"` — reachable from a toggle in the nav, alongside the
existing English site. English keeps its exact URLs and its measured pixel fidelity; Hebrew is a
genuine RTL locale served from the same components.

**It is not a translation project.** The real Clix Solutions site
([docs/reference/clixsolutions/](../../docs/reference/clixsolutions/)) is `lang="he" dir="rtl"`
throughout and **has no English version**, and several English strings in `src/` are documented
as renderings *out of* that Hebrew — `Hero.tsx:13-23` and `Footer.tsx:164-173` both say so. For
much of the site the Hebrew is therefore a **restoration of the original wording**, sourced from
a 20,169-character capture, not a translation of the English.

---

## Measured values

### Font — the question at `fonts-discovery.css:47` is now answered

`public/fonts/discovery/discovery-var.woff2`, read with fontTools:

| | |
|---|---|
| Hebrew codepoints | **51** — all 27 base + final letters, full niqqud, maqaf, geresh, gershayim, sof pasuq |
| Shekel sign U+20AA | present |
| Axes | `wght 100–800`, `XPRN 0–2000` |
| Missing from the base alphabet | **none** |

**No font is vendored for this locale.** The sitewide face already renders Hebrew.

⚠️ But `--font-sans`/`--font-display` fall back to `"Inter", sans-serif`, and **every vendored
Inter subset carries Latin/Cyrillic/Greek/Vietnamese ranges and no U+0590–U+05FF.** So Hebrew's
only fallback is the OS `sans-serif` — a different family with different metrics than anything
here was measured against. The existing rationale ("if a Discovery file 404s, the layout falls
back to the metrics it was built on") **does not hold for Hebrew.** Open question below.

⚠️ `fvar`'s `wght` default is **100 (Thin)**. Any element that omits a weight renders Thin, and
Hebrew loses more to that than Latin does — it has no ascender/descender differentiation to
carry the shape.

### What Hebrew does to the metrics

| | |
|---|---|
| Latin lowercase mean advance | 0.4581 em |
| Hebrew letter mean advance | 0.5117 em |
| ratio | **1.117** — ~12% wider per character |
| `sTypoAscender / Descender / LineGap` | 859 / −299 / 10 — **identical to Latin** |

Two consequences that govern the whole copy-fitting job:

1. **Vertical metrics are shared and Hebrew has no capitals or Latin-style ascenders**, so every
   `line-height` on this site yields the **same box height per line** in Hebrew. Nothing vertical
   needs re-measuring. And wherever `line-height` is a *percentage* of `font-size` — 95%, 110%,
   130%, nearly everywhere here — **matching the rendered line count matches the box height to
   the pixel.** The exception is `ByTheNumbers.tsx:116`'s absolute `leading-[128px]`.
2. **Only line COUNT changes, and unpredictably**: characters are 12% wider but Hebrew words run
   shorter, so the two effects fight. Fit by rendered line count; never by counting characters.

### The direction of the risk is the inverse of the obvious one

`whitespace-pre` is **systemic — ~25 uses across 15 files**, covering every CTA label (inside a
`width: min-content` anchor) and all 7 nav links. Nothing can wrap, so a *wider* Hebrew string
would overflow rather than reflow. Measured against the real face:

| | EN | HE | Δ |
|---|---|---|---|
| Nav row, 7 labels + pads | 552.3 px | **467.1 px** | **−85.1 (−15.4%)** |
| "Let's start" → בואו נתחיל | 70.6 | 70.9 | +0.2 |
| "Request Access" → בקשת גישה | 100.6 | 71.7 | −28.9 |
| "Contact Media Team" → לפניות תקשורת | 132.1 | 93.2 | −38.9 |

So the `min-content` surface resolves **in our favour**, and the absolutely-centred desktop link
row *gains* 85px of clearance. **The real risk is undershoot** — Hebrew setting in *fewer* lines
than English and shrinking band heights. That is the failure already on record for `/careers`
`#about`, where a green block-diff hid it.

*(Advances are relative: the font's `fvar` default is `wght:100`, so these are Thin-weight
numbers. Both languages scale together, so the comparison holds; absolutes come from the DOM.)*

---

## Architecture

### Routing — route groups, no middleware

```
src/app/
  layout.tsx          ❌ deleted — there are now TWO root layouts
  api/models/         never localized; the only route handler
  _routes/*Route.tsx  the page bodies, shared by both locales
  (en)/layout.tsx     <html lang="en" dir="ltr">   → /, /product, …
  he/layout.tsx       <html lang="he" dir="rtl">   → /he, /he/product, …
```

`(en)` is a route **group**: parentheses contribute nothing to the URL, so every English path is
byte-identical to what it was. 20 routes, all statically prerendered.

**Rejected, with reasons:**
- `[[...locale]]` optional catch-all — **does not build.** `validate-app-paths.js` throws E913
  for any segment after a catch-all, which `product/page.tsx` is.
- `[lang]` + middleware **rewrite** — works, but Next sets `x-nextjs-rewritten-path`, so
  `usePathname()` can return the *internal* path. Both `LocaleToggle` (which builds the
  counterpart URL) and `ViewTransitions.tsx` (whose commit resolver compares pathnames) sit on
  `usePathname()`. It also puts a runtime in front of a site that is otherwise a CDN plus one
  function, and needs a second redirect branch to stop `/en/*` being duplicate content.

⚠️ **Never add `src/app/not-found.tsx`.** With no root layout at `src/app/`, Next injects its own
builtin layout for `/_not-found`; a custom file stops that injection and the build **exits 1**
with "doesn't have a root layout". A per-locale `not-found.tsx` inside `(en)/` or `he/` is fine.

### The two access seams

| runtime | API | why |
|---|---|---|
| server (34 of 57 components) | `getDict()` / `getChrome()` / `getDirection()` / `getDirSign()` | a `cache()`-scoped request store seeded in the root layout **and** in every route body. **No default — it throws.** A read before the seed is a build failure, not a Hebrew page that quietly renders English. |
| client (23 components) | `usePageDict()` / `useChrome()` / `useDirection()` / `useDirSign()` | React context, mounted in both root layouts. Payload split `chrome` (route-invariant, ~40 strings) from one page namespace, so a route never ships another route's copy. |

**No server component was converted to a client component**, and no `locale` prop is drilled —
`Footer.tsx` alone is rendered by all 7 routes and would have needed the same edit in 7 files
owned by 7 different agents.

### The direction primitive

`dirSign(locale)` → `+1` in English, `−1` in Hebrew. It multiplies **physical-axis deltas only**:
a `translateX` target, a `scrollBy({left})` delta, a drag-commit sign. Never an index, a
magnitude, a velocity, or a threshold.

**Because it is `+1` in English, every expression containing it is byte-identical in the LTR
build** — which is what makes the whole pass verifiable as a no-op.

It is **stable for a mount's lifetime**, because a locale switch is a hard document navigation
across two root layouts. So it can be read once, outside a `useGSAP` dependency array, with no
`revert()`/rebuild path.

### The toggle

`src/components/ui/LocaleToggle.tsx` — a **single link to the other language**, mounted in all
three Nav layouts (mobile panel, compact `<1200` row, full `≥1200` row).

- **A dropdown is impossible here**, not merely undesirable: four ancestors are `overflow-hidden`.
- **`h-9` (36px)** sits under the 40px hamburger and the 38px CTA, so `--nav-row-h` (74/70px,
  which `/clix`'s `spacer` reads) does not move.
- Its accessible name **is** `עברית`, on a `lang="he"` element, so a screen reader switches voice
  — WCAG G81. ⚠️ **Do not add an English `aria-label`**; it would override that.
- It is a **plain `<a>`, deliberately not routed through `AppLink`**. A view transition across a
  root-layout boundary would leave `ViewTransitions.tsx`'s promise unresolved, so its 1500ms
  failsafe would fire on a *working* navigation — falsifying that file's own stated invariant.
  And a crossfade between an LTR snapshot and an RTL live frame is a full-width horizontal jump
  of every line on the page.

---

## Deviations from English, recorded

Every one of these is a measured consequence of Hebrew, kept rather than tuned away. Trimming
Hebrew until it fits a box measured against English would make the measured spec a fiction
(§10) — so the box moves and the movement is written down.

| # | Where | English → Hebrew | Why |
|---|---|---|---|
| 1 | Footer tagline | **3 runs → 2** (4 lines → 2 on phone) | The real site closes on "תוכנה שעובדת, תוצאות שמדברות." — one comma, one sentence boundary. It does not split three ways. `tagline` is typed `readonly string[]` for exactly this. |
| 2 | Nav's 7 labels | authored, not sourced | The real site's IA is שירותים/תעשיות/פרויקטים/תובנות/פלייגראונד/אודותינו — a different information architecture. Only the register transfers. |
| 3 | `/company` hero h1 | 2/2/1/3 lines → **1/1/1/2**; band 1266.30 → 1182.70 at ≥1440 | `"האנשים שבנו את זה."` is sourced exact. A longer invented line *would* have hit the box to the pixel, and was rejected: it repeats the subhead 20px below. |
| 4 | `/company` mission body | band 404.20 → 380.80 (≥1440) | Sourced paragraph sets one line shorter. |
| 5 | home Testimonials heading | **2 runs → 1** below 810 (−~37.8px) | בקולם של הלקוחות שלנו measures 304.8px in a 358px box, so needs no break. The double render is now sync-proof: one array, the phone span draws `length−1` breaks. |
| 6 | home WhyRogo headline | 3 → 2 lines above 810 | Column is `sticky`; section height comes from the tenants beside it. |
| 7 | home WhyRogo tenants ×2 | 1 → 2 lines (tablet / phone) | Both are sourced verbatim. A shorter sourced lead existed and was **not** used — trimming would turn a sourced string into a paraphrase. Items are a flex column with no uniform-row constraint, so they just grow ~30.8px. |
| 8 | home Security heading | 2 → 3 lines at ≥1200 (~+50px) | 48px into a 400px measure. Nothing clips. |
| 9 | `/clix` rotor box | **306/270 → 159/260px** | A fixed-width box exists so the line never reflows mid-swap, so its width is inherently locale-specific. Derived from `max(advance)` over **all four** Hebrew words, not the resting one. |
| 10 | `/clix` `hero.words` | **2 entries → 4** | Hebrew restores clix's complete sourced list; the English list was known-incomplete. `words` is `readonly string[]`. **Superseded 2026-08-18: both locales carry the same three**, so this row is no longer a divergence. |
| 11 | `/clix` phone CTA | 1 → 2 lines at 390 (+61.6px) | Hebrew ink is 300.2px against a `max-w-[300px]` measure — over by **0.2px**. Kept on evidence: **rogo's own headline also sets 2 lines in that measure**, so English at one line is the outlier and the 300px cap exists to make it wrap. |
| 12 | `/clix` testimonials | −62.4px at ≥1024 | Hebrew quotes one 24px/130% line shorter. All 20 cards checked, `items-stretch` equalises them, and `halfA === halfB` so the marquee loop stays exact. |
| 13 | `/clix` manifesto | −56px at 390 | Lands on English's height **to the pixel** at ≥1024 (18 line boxes, 504.0px in both locales). |
| 14 | `/news` one card | 2 → 3 lines at 390 | One headline only, in a 1-column grid, so it just makes that card taller. |
| 15 | `/news` stat tiles + photo alts | translated beyond the brief | The captions are *visible* prose, and an English `alt` on a Hebrew page is an a11y defect, not a cosmetic one. |

**Where Hebrew ran WIDER, against the site-wide pattern** — worth recording because it contradicts
the −15.4% headline figure: `/clix`'s CTA is **386.0px vs 372.4px** at 810/72px, and three of
`/company`'s eight service names are longer than their English counterparts. The site-wide average
does not predict any individual string.

## Pre-existing defects surfaced by this work (none introduced here)

1. ~~**`/clix`'s English rotor box does not fit its own content.**~~ **FIXED 2026-08-18.** rogo's
   270px box was 3px narrower than "investor" at 273.0px, so English `allFit` was `false` at
   92px while Hebrew fit at every tier. The hero rotor was rewritten to the user's own three
   roles that day and both boxes were re-measured off the widest word — EN 206/338, HE 225/370.
   See features/felix-page/CONTEXT.md, 2026-08-18.
2. **`sections/Security.tsx` and `security/SecurityCompliance.tsx` disagree about cell 4** of the
   same cloned grid — home drops the inline-end border at every tier, `/security` documents it as
   present at ≥1200. Two files claiming to clone one grid, from two separate probes.
3. **`ClixManifesto.tsx`'s h2 comment was wrong.** It claimed 240px on phone gives two lines; the
   **English** title sets **three** there. The two-line invariant is tablet-and-up only. Comment
   corrected; the Hebrew was fitted to the measured English (2 and 3), not to the claim.
4. **`sections/Security.tsx`'s `labelWidth` comment is stale** — the 188px slot is position-bound
   and now holds the *shortest* label (86.8px) while the longest sits in a 137px box. Geometry
   outliving its content since the 2026-08-05 replacement. Left unchanged, as the file instructs.
5. **`newsItems.ts`'s `source` field is never rendered anywhere.** The only publisher name on
   screen is the photo tile's separate `chip`.

## Decisions taken during reconciliation

1. **`careersPhotos.ts`'s `fit: "right bottom"` on slide 8 stays PHYSICAL.** Escalated rather than
   guessed at, and the escalation was right. That value names where the subject sits inside one
   specific JPEG; it is not a reading direction. Flipping it to `left bottom` in RTL would crop a
   different part of the photograph — a content change dressed as a layout fix. Same reasoning that
   keeps the per-icon optical nudges physical.
2. **`2×` renders glyph-order `×2` in Hebrew, and that is accepted.** `×` is bidi Other Neutral, so
   beside a European Number it takes the paragraph's RTL level and sits left of the digit. *Reading*
   order stays 2-then-×, and `×2` is a normal multiplier form in Hebrew. No `dir` override was
   added: `<html dir>` lives in the two root layouts and nowhere else, and that invariant is worth
   more than the glyph order of one stat.
3. **The two Nav logo links and `ProductSecurity`'s "Find out more" stay raw `next/link`.** They are
   locale-prefixed via `localeHref` but deliberately not converted to `AppLink` — the logo has been
   an instant swap rather than a crossfade since 2026-08-12, and routing it through the view
   transition would be an unrelated behaviour change inside an already-large diff.
4. **The five shared security-badge labels have one canonical Hebrew set**, fitted by rendered line
   count in home's 137px/188px boxes, and `/security` and `/product` adopt it verbatim rather than
   re-translating. Three pages restate these strings; three wordings would be incoherence no
   individual agent could see.

## Method notes worth keeping

- **A `getClientRects()` probe on a block box is tautological** — it returns the box, so it can
  never show slack. To decide whether a `text-align` is live, range-measure the *text* and compare
  against `clientWidth`. That mistake produced one confident wrong answer before it was caught.
- **`documentElement.scrollWidth` is ~23000px on `/clix` in BOTH locales** — the marquee's
  duplicate track behind `overflow-hidden`. `maxScrollX` is **0** at every width. An overflow check
  that reads `scrollWidth` alone will false-positive there.
- **Converting a CRLF component file to LF silently changes how multi-line `className` attributes
  collapse in the emitted HTML.** Cosmetic, zero computed-style impact — and it produced ~40
  phantom diff hunks and cost real time. Component files keep their existing endings;
  `src/lib/i18n/**` is LF.
- **`×` beside a digit takes the paragraph's RTL level**, so `2×` renders glyph-order `×2` while
  reading order stays correct. `200+` and `24/6` are unaffected (bidi folds `+` and `/`).
- **A stale `next dev` on port 3001 (PID 17544) both fails to hydrate and DELETES prerendered HTML
  out from under a concurrent `next build`.** It cost two agents their verification runs before
  either diagnosed it. Next 16 refuses a second dev server for the same directory, so the
  workaround is `next start` against an isolated snapshot — but the real fix is restarting it.
- **Three of my own client/server labels were wrong** (`CareersHero`, `CareersAbout`,
  `CompanyMission` are server components). Every agent that hit one checked line 1 of the file and
  reported instead of complying, which is the only reason none of them shipped a static band as a
  client bundle. **Read the file; do not trust a handout's runtime list.**
- **Tailwind 4's `rtl:` compiles to `:where(:is(:lang(…),…),[dir=rtl],[dir=rtl] *)`** — broader
  than `[dir=rtl]`, zero specificity, and it cannot match `lang="en" dir="ltr"`. That is what
  preserves LTR byte-for-byte.

## The Hebrew fidelity contract

`CLAUDE.md` §6 requires a section to match the reference at four widths. **That cannot extend to
Hebrew**, and pretending it does would make the measured spec a fiction. So:

- **English/LTR — zero regression, provable.** The logical-property migration is a computed-style
  identity transform (`ms-4` resolves to `margin-left`), with exactly one exception:
  `text-align: start` computes to the keyword `"start"`, not `"left"`. It renders identically;
  the harness normalises it.
- **Hebrew/RTL — correctness, not fidelity.** Checkable instead: no horizontal overflow at
  1600/1440/1024/390 · nothing clipped or overflowing a `whitespace-pre` box · uniform grid rows
  still uniform within 0.5px (assertable **without any English reference** — the strongest check
  available here) · colour-boundary headings still breaking where the colour changes · contrast
  AA · keyboard reachable · every Hebrew node actually resolving to Discovery.
- **Where a Hebrew string cannot hold an invariant, the BOX changes and the change is recorded.**
  Trimming Hebrew to fit a box measured against English is how a measured spec becomes fiction.

---

## Acceptance checklist

- [x] `<html lang>` / `dir` correct per locale — verified on all **14** prerendered pages
- [x] English URLs unchanged; **20 routes, all statically prerendered** (13 before)
- [x] `/api/models`, `/favicon.ico`, `/icon.png`, `/apple-icon.png`, `/_not-found` survive the split
- [x] Locale path helpers unit-tested — 24 assertions incl. the `/he#testimonials` slash collapse
- [x] Toggle in all three Nav layouts, correct in **both** directions on all 14 pages
- [x] **Every internal anchor on every Hebrew page is locale-prefixed** (the three raw `next/link`
      sites were the last holdouts and are fixed)
- [x] **Zero third-party URL locale-prefixed** — all 12 publisher links intact
- [x] Page copy for all 7 routes — **400 English / 433 Hebrew strings**, provenance on every one
- [x] Logical-utility migration — done per route, with each agent's skipped-migration list recorded
- [x] The direction-sensitive JS call sites — `scrollLeft` sign, `scrollBy` sign, drag-commit sign,
      GSAP magnitudes, the marquee keyframe
- [x] `npm run build` clean from a wiped `.next`; `tsc` clean; `eslint` at the one pre-existing
      `ClixHero.tsx` error, which neither grew nor was touched
- [x] English render proven a no-op: home's `<main>` **75055 → 75056 bytes**, the +1 being exactly
      `text-left`→`text-start`; `/company`'s `<main>` byte-identical but for 20 border-class tokens
- [x] Zero horizontal overflow at 1600/1440/1024/390, both locales — measured per route
- [x] `SecurityBenefits`' six rows uniform to **0.000px** in both locales at all four tiers
- [x] Colour-boundary headings still break where the colour changes — measured per run
- [ ] **A Hebrew reader has not looked at it.** Five routes were screenshotted by their agents;
      `/product` was measured with fontTools only, because no browser was available in that tree.
- [ ] `block-diff.js` against a saved pre-change baseline — **not run.** The baseline mode was
      planned and never built; identity was instead proven per route by byte-diffing the
      prerendered English HTML, which is a stronger check for copy but does not cover computed
      style. `text-align` is the one key that would print a mismatch.

## Open questions

Ordered by what needs a human, not by size.

1. ⚠️ **`/he/news` is publicly indexable and its 12 headlines are now Hebrew paraphrases still
   credited to the FT, Xinhua and SBS.** `/news` ships without a `robots` block *because* those
   headlines were verbatim. One headline could not be translated faithfully at all — Hebrew verbs
   carry gender, so a natural rendering of the OpenAI-ethics-chief story would have had to invent a
   fact and attribute it to the FT; it ships as a verbless noun phrase instead, and three others
   needed similar avoidance. Sources and URLs are untranslated and Latin. **Options: `noindex` on
   `/he/news` alone, or revert those cards to English titles.**
2. ⚠️ **`/he/clix` must keep its `noindex`, and Hebrew makes its reason worse.** All 10 testimonial
   quotes are rogo's real quotes from real people reattributed to invented firms. In Hebrew they
   read as *more* credible to the audience best placed to check them. There is no rendered
   fabrication marker in either locale — that was already true in English and no locale-only marker
   was introduced. The `noindex` is the only guard.
3. ⚠️ **Two identity questions that become reader-visible in Hebrew.**
   · `noam-tovi.jpg` carries a **burned-in caption reading אני נווה דודי** ("I am Nave
   Davidi") while the card says נועם תובי. An agent confirmed it by reading the image. In English
   that is a Hebrew caption a reader skims past; on `/he` it sits inches from a card giving a
   different name. **Needs the client.**
   · Achituv's `אחיטוב` / `ותחזנה` is a transliteration back out of a transliteration and
   cannot be confirmed from anything in this repo. (`אלישיב הנדסה` was flagged alongside it and
   is **resolved** — it is the user's own string from 2026-08-08, and the English is a rendering of
   *it*.)
4. **`/he/product`'s hero band grows ~96px on phone, ~64px at desktop.** The sourced services H1
   sets 4/2/2 lines against English's 2/1/1. **A one-line swap is available if you want the band
   height instead:** the industries H1 `AI שמדבר את השפה של התעשיה שלכם.` is equally
   sourced and lands exactly 2/1/1.
5. **Negative letter-spacing on Hebrew.** The site's tracking runs −0.01em to −0.06em; at 92px that
   is −5.52px per gap and strips ~13–15% of Hebrew's natural advance. Hebrew has no ascenders or
   descenders to create optical separation, so tightness costs more legibility than in Latin. An
   **empty** `[dir="rtl"]` hook exists in `globals.css`. Recommendation on file: set
   `letter-spacing: normal` **scoped to the display elements only**, never as a root rule — it
   inherits, and a root value would retune every 14px caption. Two measured consequences if you do:
   `/clix`'s rotor box must go 260→~299 and 159→~182, and its manifesto title goes 2→3 lines.
6. **The Hebrew fallback face.** Inter has zero Hebrew, so a Discovery 404 drops Hebrew to the OS
   sans — different metrics from anything measured here. Add an explicit Hebrew tail under
   `[dir="rtl"]` so the failure mode is chosen rather than inherited?
7. **`metadataBase` / `hreflang` deferred** — the production origin is recorded nowhere in this
   repo. No `alternates.languages` ships. 4 of 7 routes are `noindex` anyway.
8. **`/he/security` collapses an English distinction:** Hebrew uses one CTA (`בואו נתחיל`) where
   English distinguishes "Request Demo" from the nav's "Let's start". One string if you want them
   different.
9. **`/he/company` says the Unit 8200 / Technion credential in Hebrew**, to the audience best placed
   to check it. Lifted verbatim from the company's own about page, so it is their claim — but it is
   one of the two reasons that route is `noindex`. Also: that sentence repeats the credential which
   `mission.teamItems` lists two columns away; on the real site the sentence carries it alone.
