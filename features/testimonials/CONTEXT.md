# Context: Testimonials

Memory for this section. **Newest entry on top.** Append after every task — never rewrite
past entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold,
with no code scanning.

---

## Current state

Built and building clean. Three-card accordion, one open at a time: a 600px row at ≥1200px,
a stack below. Computed values verified in-browser at 1600 / 1440 / 1024 / 390 against the
capture — padding, type sizes, card widths, radius and fills all match. No horizontal
overflow at any tier.

**Status:** `review`
**Next action:** time the open/close animation on the live site, and get the user's call on
the two inherited contrast failures (role text 2.50:1, logo marks 1.92:1).

⚠️ **This section is the one place the 2026-08-03 brand rename stopped.** The quotes still
say "Rogo" on purpose — see the log entry below before changing them.

---

## Log

### 2026-08-04 — option (b) turns out to already exist

Captured the real company site (`docs/reference/clixsolutions/`) and it **has testimonials** —
which resolves the research half of the question left open below. It does not resolve the
decision half; that is still the user's.

**They are video, not pull-quotes.** Four 9:16 portrait clips behind play buttons
(`aria-label="הפעלת עדות של <name>"`), posters at `/testimonials/<slug>.jpg`:

| Name | Attribution |
|---|---|
| אסף פרץ — Asaf Peretz | מייסד · SalesIQ |
| אדיר פרץ — Adir Peretz | בעלים · סטודיו וידאו וצילום |
| נבו יהלומן — Nevo Yahaloman | מייסד |
| נועם תובי — Noam Tovi | בעלים · השקעות |

**There is no quote text anywhere in the markup** — the endorsement lives entirely in the
video. So there is nothing to lift as a written quote, and this section's three-card
accordion has no direct content equivalent. Using these means either pulling written quotes
from the clips (needs the people's sign-off on the wording) or rebuilding the section as a
video row.

What this changes: option (b) — *real clix testimonials with permission* — is no longer
hypothetical. Four named people have already gone on camera for Clix. The blocker was never
"do endorsements exist"; it is which of the three options the user wants.

**Unchanged:** the three Rogo quotes stay exactly as they are until the user picks. Nothing
in `src/` was touched.

### 2026-08-03 — excluded from the brand rename, and why

Every other "Rogo" on the site became "Clix" when the user asked to change the brand name.
These three quotes did not, and the exclusion is deliberate rather than an oversight.

**The distinction.** Everywhere else, "Rogo" sat in *product copy* — rogo's own claims about
their own software, which this clone reuses wholesale. Renaming that is just rebranding
borrowed marketing. These are **statements by real, named, identifiable people**: Tom
Hackett (CEO, Truist Securities), Patrice Maffre (International Head of IB, Nomura), Ross
Williams (COO, Baird Global IB). Substituting the product name inside a quote manufactures
an endorsement of clix from someone who never gave one — a different act from rebranding
copy, and not one to perform silently.

**The real problem is bigger than the word.** The section reproduces rogo's customer
material entire — quote, name, title, firm, and the three logo marks. On a clix site that
already implies three real institutions endorse clix, whichever product name the sentences
carry. So the fix is to **replace the section**, not to rename inside it; renaming makes the
implication worse because it removes the only signal that the statements were about
something else.

**Options when the user wants this closed:** (a) fictional attributions + reworded quotes,
which needs the logo marks pulled too or the firms still show; (b) real clix testimonials
with permission; (c) drop the section until (b) exists. All three need the user.

**Guard in place:** a comment above `TESTIMONIALS` in `Testimonials.tsx` states this, so the
rename is not "finished" later by find-and-replace.

### 2026-08-03 — built

**Trigger:** user — two screenshots of rogo.ai's testimonials block, *"this is the 2nd
page"*.

**Done**
- Extracted the `#testimonials` subtree (48,226 bytes, capture offset 394851–443077) and
  every CSS rule touching its 30-odd `framer-*` classes.
- Built `Testimonials.tsx` + `TestimonialLogos.tsx`; wired into `page.tsx`.
- Three new tokens → `docs/DESIGN-SYSTEM.md` + `@theme`: `canvas` `#f7f7f7`,
  `card` `#eeedec`, `ink-wash` `rgb(21 21 21 / .05)`.

**Measurements worth keeping**

- **The quote font size drops 28 → 20px below 1200 — and the capture hides this.** The
  *collapsed* mobile cards still carry `28px`; only the **open** mobile card carries `20px`.
  Since exactly one card is ever open, 20px is the real value for that tier. Reading only
  the first mobile card in document order would have got this wrong.
- **The desktop row geometry is 17 / 17 / rest.** Closed cards are `width:17%`, the open one
  is `flex:1 0 0`. On a 1280 container with two 12px gaps: **217.6 / 820.8 / 217.6**.
  Reimplemented as `17%` and `calc(66% - 24px)` — same numbers (browser reports 218/821/218)
  but two explicit widths, which is what makes the transition interpolable.
- **The collapsed quote is 1px, not 0** — `height:1px` desktop, `height:3px` mobile, under
  `overflow:clip`. Framer's minimums. Kept as the closed-state `min-height`.
- **The plus button changes parent between tiers.** ≥1200 it sits in the card's `Bottom`
  block above the attribution; ≤1199.98 it moves into the logo row and is pushed right by
  `justify-content:space-between`. CSS cannot move a node between parents, so this is the
  one thing rendered twice and hidden per tier.
- **The logo marks are a second set of assets, not the carousel's.** `#testimonials` inlines
  dark-fill copies, and **Nomura's artwork actually differs** — `120×21` here versus
  `122×22` in `public/logos/logo-nomura-white.svg`. Do not consolidate the two sets.
- Mark sizing is `aspect-ratio` + a height percentage of a fixed 40px wrapper:
  Truist 67% → 26.8 @ 4.125 · Nomura 42% → 16.8 @ 5.70833 · Baird 46% → 18.4 @ 3.60526.
  Truist's *true* aspect is 4.29, so with `preserveAspectRatio="xMinYMid meet"` it
  letterboxes ~0.5px top and bottom and stays flush left. That is the original's behaviour,
  not a rounding error.
- `.ssr-variant { display: contents }` — the wrapper divs contribute no box, so the h1
  wrapper and the card row are direct flex children of Width Container and the 80px gap
  lands between them.
- **No `min-width:1600px` rule exists for this section.** XL and Desktop are byte-identical;
  the base rule serves both.
- Provider **name and role are both `line-clamp:1` at ≥1200**; below 1200 the clamp is
  lifted from the **role only**. That asymmetry is what produces "International…" on the
  closed desktop cards and full wrapped text on mobile.
- Section padding: `196/40/80` (≥1200) · `164/40/128` (tablet) · `128/16` (phone).
  Heading→cards gap 80 at every tier. Card gap 12 (row) / 16 (stack).

**Decisions**

- **One DOM, not Framer's two subtrees.** Duplicating three quotes into the page to hide one
  copy costs the a11y tree for no visual gain. The two genuinely un-CSS-able differences —
  the plus button's parent, and the phone-only `<br>` — are rendered twice and hidden per
  tier. Everything else is a `desktop:` variant.
- **CSS transitions, no animation library.** Neither `gsap` nor `framer-motion` triggers
  fired: per `docs/SKILLS.md`, GSAP owns scroll-driven / pinned / scrubbed / timeline work
  and Motion owns mount-exit / gesture / layout animation. This is a two-state toggle on
  three siblings. Logged so the absence reads as a decision, not an oversight.
- **`grid-template-rows: 0fr → 1fr`** for the quote reveal — the only way to transition to an
  intrinsic height in CSS. The original does it in JS. Closed geometry (1px / 3px) is kept as
  `min-height` so the measured value survives.
- **`<h2>` not `<h1>`, `<blockquote>` not `<h5>`.** Both purely semantic, both zero visual
  difference, both fixing something Framer got wrong. The page already has the hero's `h1`.
- **One tab stop per card.** The original makes the card *and* the logo inside it
  `tabindex="0"` — two stops firing the same action. Ours is `role="button"` +
  `aria-expanded` + `aria-controls` on the card, with the logo inert.

**Verified**
- In-browser computed values at all four tiers (CDP): section padding, background,
  heading/quote/name sizes, card widths + heights + padding + radius + fill, `tabIndex`,
  and `scrollWidth == innerWidth` (no overflow) — all match the table in `FEATURE.md`.
- Click on the Nomura card: `aria-expanded` flips and widths become `218 / 821 / 218`.
- `npm run build` clean; `eslint` reports nothing in `src/` (the two pre-existing findings
  are in `docs/reference/contrast-check.js`).

**Open / deferred**
- **Motion timings are estimates** (500 / 500 / 300ms on `--ease-rogo`). Framer animates in
  JS; the capture holds one authored transition and it is not this one. Needs the live site.
- **Two contrast failures inherited from the target and deliberately NOT fixed:** provider
  role (ink @ 0.4 → `#979797` on `#eeedec`) is **2.50:1**, and the logo marks (ink @ 0.3 →
  `#adadad`) are **1.92:1**. `PROJECT.md` sets an AA floor; `CLAUDE.md` §1 makes colour a
  hard fidelity requirement. Unlike the other a11y divergences this one is *visible*, so it
  is the user's call. Minimum fix: role opacity `0.4 → 0.60` = exactly 4.5:1.
- Card hover state unobserved — the capture declares `cursor:pointer` and nothing else.
- Whether clicking the *open* card closes it is unverified; currently a no-op, which is what
  Framer's variant set implies.
- The mobile card gap is `96px` (`.framer-v-sgdn6k`), which leaves ~290px-tall closed cards
  at 1024. Verbatim from the capture, but worth a look at a real tablet width.
