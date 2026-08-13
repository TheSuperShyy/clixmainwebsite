# Context: i18n-rtl

Append-only. Newest day at the top. Decisions and measurements, not narration.

---

## 2026-08-13

### The 8-agent wave landed; all 7 routes translated and the direction pass is done

**400 English / 433 Hebrew strings**, provenance marked on every one: **82 SOURCED** from the
clixsolutions capture, **141 AUTHORED**. Build clean from a wiped `.next` at 20 static routes,
`tsc` clean, `eslint` at the single pre-existing `ClixHero.tsx` error which neither grew nor was
touched. Every internal anchor on every Hebrew page is locale-prefixed; zero third-party URL is.
The toggle resolves correctly in both directions on all 14 pages.

### The zero-regression claim was PROVEN, not asserted

Home's English `<main>` went **75055 -> 75056 bytes, one byte** -- and that byte is exactly
`text-left`->`text-start`, the single non-identity predicted in advance. `/company`'s `<main>` is
byte-identical but for 20 border-class tokens, and identical after neutralising just those two
token names. Cascade order was verified in the *emitted* CSS rather than assumed: the logical
longhands land after the `p-*`/`border` shorthands exactly where the physical ones did
(`.p-8`@61137 < `.ps-6`@63636 < `.ps-8`@63770 < `.pe-8`@64156), so every tier override still wins.

### The agents corrected me eight times, and every correction was right

This is the part worth keeping. `Multi-agent.md` section 4 says to tell agents to push back rather
than comply; that instruction earned its keep:

1. **Three of my client/server labels were wrong** -- `CareersHero`, `CareersAbout` and
   `CompanyMission` are server components I called client. Each file says so in its own header.
   Complying would have shipped static bands as client JS and bundled both locales.
2. **`[dir="rtl"] .clix-marquee` is specificity (0,2,0), not (0,1,1)** -- an attribute selector
   scores in the class column. Conclusion unaffected; the true value went into the file.
3. **GSAP's `x: -cycle` was ALREADY correct in both directions.** `cycle` is a signed `offsetLeft`
   delta and `offsetLeft` does not flip, so it goes negative in RTL and the sign already encodes
   travel. Applying `dirSign` would have **cancelled** it. Only the three places treating `cycle`
   as a *length* needed `Math.abs()`.
4. **`mr-3`/`mr-5` are NOT load-bearing for the -50% loop** (the files' own comments overstate it
   too): a margin contributes the same width on either side, so half the doubled track is one
   cycle either way. `me-*` is right because it mirrors the gap, not because the loop needs it.
5. **`ProductSecurity.tsx` does not ship SOC2/CCPA/ISO 27001/GDPR** -- those were replaced with
   practice statements on 2026-08-12, which my brief had missed.
6. **My "8 service labels are the highest-risk fit" prediction cleared entirely** -- all eight set
   on one line in Hebrew with *more* slack than English.
7. **My "/company's h1 needs no divergence" prediction was wrong** -- the sourced Hebrew sets 1
   line where English takes 2. The agent kept the sourced string and recorded the shrinkage rather
   than inventing copy to fill a box, which is what the fidelity rule asks for.
8. **`SecurityHero.tsx:62-64`'s claim that its CTA brackets "really are two DIFFERENT paths" is
   false** -- rotating one 180 degrees reproduces the other to within 0.008 user units across all
   16 coordinate pairs. Comment corrected in two files; artwork untouched.

### Two conflicts only the reconciliation pass could settle

WARNING: **Two agents disagreed about the same string's width and BOTH were right.** One measured
הנתונים שלכם נשארים שלכם at 131.6/137px and one at 156.9/137px. The boxes genuinely differ: home's badge label is
**`text-[12px] tracking-[-0.02em]`** (`Security.tsx:150`) where `/security`'s compliance label is
**`text-[14px]`**. Independently confirmed: 130.5px at 12px, 152.3px at 14px. So the canonical
string legitimately sets one line on home and two on `/security`, and accepting two lines there --
after measuring 15.59px of clearance to the mark above -- was correct, not a fit failure.
**A width is meaningless without the type spec beside it.**

WARNING: **אלישיב הנדסה was flagged as an unverified transliteration and it is not.**
`sections/Testimonials.tsx:62-68` records the user supplying that exact string on 2026-08-08 for an
unlabelled WhatsApp clip, with the English "Elyashiv Engineering" rendered *out of* it. So on `/he`
the user's own words ship and there is nothing to confirm -- a **third provenance kind**:
user-supplied, neither capture-sourced nor authored here. Achituv's remains genuinely unverified.

### Cross-file coherence the wave forced

Five security-badge labels are restated across **three** pages -- `sections/Security.tsx`,
`security/SecurityCompliance.tsx` (all five) and `security/SecurityBenefits.tsx` +
`product/ProductSecurity.tsx` (four each). No individual agent could see that. One canonical Hebrew
set was fitted by rendered line count and handed to the other two mid-flight; both adopted it
verbatim, and one replaced three of its own drafts to do so. WARNING: one item correctly did **not**
reconcile: `/product`'s `security.list[2]` translates `End to end encryption`, a different and
stronger claim than the canonical הצפנה בתעבורה ובאחסון -- flagged rather than silently merged.

### Method notes

- **Equal grid-row heights do NOT prove uniform content.** Items are `align-self: stretch`, so at
  3x2 and 2x3 a short body is absorbed by its row-mate and all six still report equal heights.
  Only the 1-column tier sees it. The real assertion is the pair: equal heights **and** per-card
  `round(height / lineHeight)`. A first Hebrew pass collapsed 3 of 6 bodies to one line and the
  height test would have passed it.
- **A `getClientRects()` probe on a block box is tautological** -- it returns the box, so it can
  never show slack. To decide whether a `text-align` is live, range-measure the text against
  `clientWidth`. That produced one confident wrong answer before it was caught.
- **`documentElement.scrollWidth` is ~23000px on `/clix` in BOTH locales** -- the marquee's
  duplicate track behind `overflow-hidden`; `maxScrollX` is 0. An overflow check reading
  `scrollWidth` alone false-positives there.
- **The 4th glyph coordinate pair sums to 39.999, not 40** -- the source artwork's own rounding.
  The mirror still holds; worth knowing the numbers are not exact.
- WARNING: **A stale `next dev` on port 3001 both fails to hydrate and DELETES prerendered HTML out
  from under a concurrent `next build`.** It cost two agents their verification runs. Next 16
  refuses a second dev server for the same directory, so the workaround was `next start` on an
  isolated snapshot -- but the fix is restarting it.
- WARNING: **The scratchpad root is shared between concurrent agents** -- one overwrote another's
  `measure.js` mid-session. It failed loudly rather than silently, which is the only reason it was
  caught. Use per-agent subdirectories.
- **Pre-existing defects surfaced, none introduced** -- see FEATURE.md's list. The sharpest: all
  nine `/product` pills carry 13-24 units of trailing dead space because their widths were
  regressed on **Helvetica** while the site renders Discovery; and `mocks.table.colClosed` is
  **clipped in English today**, needing 295.5 units in a 274-unit box. Both left alone -- fixing
  them would move the English render.

**Still open:** the 9 questions in FEATURE.md. The two that need a human before anything ships are
`/he/news`'s indexability and the `noam-tovi` caption conflict.

---

## 2026-08-12

### Spine built and verified; 8-agent wave launched for the rest

**User's ask:** a Hebrew/English toggle in the nav, and the system turned RTL for Hebrew, built
as a parallel multi-agent job per `Multi-agent.md`.

**Four decisions taken by the user before any code:**
1. **URL-prefixed Hebrew only** — English keeps its bare paths, Hebrew lives at `/he/*`.
2. **All 7 routes** in scope (~400 strings).
3. **Hebrew written here, sourced** from `docs/reference/clixsolutions/` where a counterpart
   exists, authored in that voice where none does, every string marked so the user reviews only
   the authored ones.
4. **`/product`'s mock-UI micro-labels are translated and their boxes re-fitted** — chosen over
   keeping them English after the cost was stated.

Later, and **against the recommendation given**, the user also chose to translate all four
borrowed/fabricated content blocks: `/news`'s third-party headlines, `/clix`'s 10 fabricated
testimonial quotes, `/product`'s 6 placeholder quotes, and `/clix`'s rogo-derived page copy. The
concern was stated once and the decision is theirs; the consequences are recorded as open
questions 4–5 in FEATURE.md rather than re-argued. **`metadataBase`/hreflang deferred** — the
production origin is not recorded anywhere in this repo.

### The two facts that made this smaller than it looked

**The font already covers Hebrew — measured, not assumed.** fontTools on
`discovery-var.woff2`: 51 Hebrew codepoints, **all 27 base + final letters**, full niqqud, maqaf,
geresh, gershayim, sof pasuq, shekel sign, `wght 100–800`. **No font vendored.** This closes the
question parked at `fonts-discovery.css:47` ("If a Hebrew page happens, revisit") since
2026-08-03. ⚠️ But Inter — the fallback — has **zero** Hebrew, so a Discovery 404 drops Hebrew to
the OS sans. The existing fallback rationale does not hold for this locale.

**Most of the Hebrew is a restoration, not a translation.** `content.json` holds **20,169 Hebrew
characters** across 11 pages of the user's own site, which is `lang="he" dir="rtl"` with no
English version. `Hero.tsx:15`'s claim checked out exactly: **"אתם מביאים את העסק. / אנחנו
מביאים את הבינה."** is a real H2 on both `/about` and `/work`, and it **already arrives broken at
the sentence boundary** — precisely the shape `HEADLINE_A`/`HEADLINE_B` want. Drop-in.

⚠️ **TRAP IN THE CAPTURE: every `H1` in `content.json` has lost its spaces.** The extractor
walked per-word spans and concatenated without separators —
`"מערכותAIמהונדסותלעסקשלכם."`. H2/H3 and `bodyText` are fine. **Recover H1s from
`pages/*.html`** (strip tags, collapse whitespace): proven to give
`'מערכות AI מהונדסות לעסק שלכם.'` An agent trusting the headings array would ship a headline
with no word breaks, and it would look like a font bug rather than a data bug.

### The route shape changed after the plan was approved, on evidence

Approved as `[lang]` + middleware rewrite; **built as route groups instead.** The rewrite loses
on a specific, checkable fault: Next sets `x-nextjs-rewritten-path`, so `usePathname()` can
return the **internal** path — and both `LocaleToggle` (which builds the counterpart URL) and
`ViewTransitions.tsx` (whose commit resolver compares pathnames) sit on `usePathname()`. That
aims a hazard at the two files stabilised on 2026-08-12. Route groups contribute nothing to the
URL, so bare English paths survive **by construction**, with no middleware, no redirect and no
`next.config.ts` change.

The objection to route groups — "duplicates the whole tree, forever divergent" — turned out
**void**: the 14 page files are ~10-line shells delegating to shared bodies in `src/app/_routes/`,
so page content still lives exactly once.

`[[...locale]]` was never a judgement call: `validate-app-paths.js` throws **E913** for any
segment after an optional catch-all, which `product/page.tsx` is. **It does not build.**

⚠️ **`src/app/layout.tsx` is deleted and must stay deleted**, and **`src/app/not-found.tsx` must
never be added** — with no root layout, Next injects its builtin one for `/_not-found`; a custom
file stops that injection and the build **exits 1**.

### Measured: what Hebrew does to this layout

- Hebrew letters average **1.117×** Latin lowercase advance (~12% wider per character).
- **Vertical metrics are identical** (`sTypoAscender/Descender/LineGap` 859/−299/10) and Hebrew
  has no capitals or Latin-style ascenders. **So every `line-height` here yields the same box
  height per line**, and wherever `line-height` is a percentage of `font-size` — nearly
  everywhere — **matching line count matches box height to the pixel.** Only
  `ByTheNumbers.tsx:116`'s absolute `leading-[128px]` escapes that, and only digits sit in it.
- **Therefore only line COUNT changes**, and unpredictably: wider glyphs but shorter words.

⚠️ **AND THE RISK RUNS THE OPPOSITE WAY TO THE OBVIOUS ONE.** `whitespace-pre` is **systemic —
~25 uses across 15 files**, covering every CTA label (in a `width:min-content` anchor) and all 7
nav links; none can wrap. But measured, Hebrew is **narrower**: the nav row is **467px against
552px (−15.4%)**, and every CTA label is shorter or equal. So nothing overflows and the centred
link row *gains* 85px of clearance. **The real risk is undershoot** — Hebrew setting in *fewer*
lines and shrinking band heights, which is exactly the failure already on record for `/careers`
`#about`, where a green block-diff hid a moved page.

### The migration is an identity transform in LTR — with one exception

Verified against the installed `tailwindcss@4.3.3` itself: `ms/me/ps/pe`, `start/end`,
`border-s/border-e`, `rounded-s/rounded-e`, `text-start/text-end`, `inset-inline-start/end` and
the `rtl:`/`ltr:` variants all ship.

`ml-4`→`ms-4`, `left-[1px]`→`start-[1px]`, `border-r-0`→`border-e-0` all **resolve to the
identical physical computed value under `dir=ltr`**. ⚠️ **`text-left`→`text-start` does NOT**:
`getComputedStyle().textAlign` returns the keyword `"start"`, not `"left"`. It renders
identically, so a computed-style diff prints a mismatch that is **not** a regression — and left
unhandled, someone reverts a correct change and RTL alignment silently breaks.

Re-counted the real surface: **~80–90 declarations in ~24 files**, not the ~140 first estimated.
The gap is `justify-start`/`justify-end` (27 uses, already logical), `inset-x-*`, and the
`left-1/2 + -translate-x-1/2` centring idiom — ⚠️ **migrating that last one is an ACTIVE BUG**:
in RTL `start-1/2` becomes `right:50%` while the translate still moves left, landing the element
off-centre by its own width. Also excluded: `Security.tsx`'s five `left-[1px]` (a 102px mark in a
104px frame — symmetric centring) and `WhyRogo`'s five `left-[5..7px]` (per-icon optical nudges
measured off the target's artwork, deliberately ~1px off-centre).

### Two real bugs found before they shipped

1. **`AppLink`'s same-route-hash test would have gone locale-blind.** `:92-94` compares
   `href.split("#")[0]` against `usePathname()`. On `/he`, an href of `/#contact` would no longer
   match, turning a same-page **scroll** into a full navigation with a crossfade over it — the
   exact failure that file's own header comment was written to prevent. Fixed by comparing the
   **prefixed** form on both sides, which is also why `localeHref` collapses the slash:
   `"/he#contact"` splits to `"/he"` and matches; `"/he/#contact"` splits to `"/he/"` and does
   not. **Unit-tested, 24 assertions**, because a comment is not sufficient for that one.
2. **`ClixFelixFooter.tsx:138` would have made the wordmark vanish in RTL**, and it is not a font
   problem. `<text x="-20">` uses the default `text-anchor: start`; `direction` **inherits into
   SVG**, where `start` means *inline*-start — so under `dir="rtl"` the anchor moves to the right
   edge and the 2034-unit word lands entirely outside its viewBox. Fails even with the word
   "CLIX". One presentation attribute (`direction="ltr"`) fixes it.

### Verified so far

`npm run build` clean. **20 routes, every one statically prerendered** (13 before; the 7 new are
the Hebrew twins). `/api/models`, `/favicon.ico`, `/icon.png`, `/apple-icon.png` and
`/_not-found` all survive the root-layout split. `tsc` clean. `eslint` at its pre-existing
baseline — the one error in `ClixHero.tsx:116` is untouched and must not grow.

In the prerendered HTML: `/` and `/product` are `<html lang="en" dir="ltr">`, `/he` and
`/he/product` are `<html lang="he" dir="rtl">`. English chrome strings byte-identical; Hebrew
chrome live with no English leaks; the toggle resolves `/` ⇄ `/he` correctly in both directions.

### Method note worth keeping

⚠️ **The user was committing to `dev` while the wave ran** (`a8d7cdf`, `cda4201` landed
mid-session, touching `/news` card art and `/company` Block 1). Two agents own files in those
areas. `Multi-agent.md` step 1 wants a frozen baseline for a reason — check for concurrent
commits during reconciliation, not just for agent-vs-agent conflicts.

**Still open:** the 8-agent wave (page copy + the direction pass), then reconciliation and serial
verify. Open questions 1–7 in FEATURE.md.
