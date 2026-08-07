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

> **Superseded 2026-08-05.** This section is no longer a clone of rogo's accordion — it is
> five of clix's own client videos. The Rogo quotes, names, roles and logo marks are gone,
> which closes the warning that stood here. Everything below the 2026-08-05 log entry
> describes the accordion that used to be here and is kept as history.

---

## Log

### 2026-08-05 — rebuilt as a five-up video row; the rogo quotes are gone

**Trigger:** user — *"yes dont change the design at all just make the testimonials video"*,
then *"make the cards 5 i uploaded the video"*.

**This closes the question open since 2026-08-03.** The three Truist/Nomura/Baird quotes,
the three names, the three roles and the three logo marks are all removed. Nothing on the
site now implies an endorsement clix does not have.

**Why a rebuild and not a copy swap.** There was no honest copy swap available: the real
company site carries **no written quote text anywhere in its markup** — the endorsement
exists only in video. Writing quotes for real, named people would have been fabrication.
The user chose the rebuild knowing it breaks the "don't change the design" rule for this one
section.

**Shipped:** five 9:16 cards, poster + play button, click to start, one at a time.
`preload="none"` so none of the ~21 MB is fetched until a card is clicked. Audio kept and
playback never autoplays — these are people speaking.

**Section shell is untouched** — padding 128/16 → 164/40/128 → 196/40/80, the 1280 container,
the 80px gap, and the h2 type scale with its phone-only hard break all carry over from the
clone. Only the cards changed. Heading is now "In our clients' own words" (the live site's
*בקולם של הלקוחות שלנו*), replacing "Helping finance teams build smarter organizations".

### Amendment 2, same day — the card is the target's too, not just the animation

**Trigger:** user posted a screenshot of the *original* rogo card and said *"want this design
no video preview just name on top with title on bottom same design and shi"*.

The intermediate version used the poster frame as the card's own artwork, with the
attribution overlaid on it. That is gone. **The card is now the target's flat `card` panel**,
and only the contents of its three slots changed:

| target slot | ours |
|---|---|
| customer logo mark, top | **the person's name** |
| quote, collapsing middle | **the video** |
| plus button + name + role, bottom | **plus button + title** |

**The name is set to READ as a logo mark**, on a follow-up from the user (*"i want same
design as this on the name"*, with a crop of the TRUIST/NOMURA marks). It keeps the target's
40px "Logo wrapper" box, contents vertically centred and left-aligned, and the type is
uppercase, `0.12em` tracked, medium weight, 11px → 13px. That is as close as a typeface gets
to those marks optically without being their actual artwork.

**Colour is ink@60%, not the target's 30%, and that is a deliberate break.** 30% is right for
a decorative logo, and it is already logged in this file as a 1.92:1 contrast failure
inherited from the capture. This slot now holds a **person's name** — content a visitor has
to read, not decoration. 60% clears AA on the `card` panel and still reads as the muted grey
label the design is going for. Revert to 30% only if the visual match matters more than
legibility, and note it here if so.

A closed card is therefore a plain panel with a name and a title — no imagery at all, which
is what "no video preview" meant. `p-8`, `rounded-[6px]`, `bg-card`, the `ink-wash` plus
button and its 300ms fade are all the clone's own values, restored verbatim.

**The collapse is back on the target's own mechanism** — `grid-rows-[0fr] → [1fr]` with the
capture's literal 1px/3px closed sliver rather than zero, which is what the accordion used
for its quote. So both axes are the target's: `grid-template-rows` for the body,
`width` for the row.

**Video sizing is height-driven, not width-driven, and that is not a preference.** The clip
is 9:16 inside a 600px card, so height is the only axis that actually binds. 330px leaves the
name row, the 56px gap and the bottom block their space; 9:16 makes that 186px wide, which
fits the open card's 325px of inner width. Widening the card does **not** make the video
bigger — worth knowing before anyone tries. Steps to 300px at the tablet tier, where the open
card has only 183px inside.

**Padding drops to `p-4` between 810 and 1200.** Five closed cards are 117px wide there, and
the target's `p-8` leaves 53px — not enough to render a name. The target never hit this: it
only ever laid three cards in a row, and only above 1200.

**eslint caught a real bug in the first pass** (`react-hooks/set-state-in-effect`): the
close-a-card handler called `setPlayingId` inside the effect body, which cascades renders.
Fixed by **deriving** `playing` as `playingId === id && openId === id` instead of storing it
twice — the effect now only pauses video elements, which is what an effect is for. A stale
`playingId` on a closed card is harmless because the derivation requires it to be open.

### Amendment 1, same day — the accordion is back

**Trigger:** user — *"i want the testimonials to be the same animation the collapsable"*.

The plain 5-up grid below was replaced by **the target's accordion**, driving the videos.
Every timing and easing is the clone's own value read back out of git, not a fresh estimate:
width `500ms`, collapse `500ms`, plus-button opacity `300ms`, all on `var(--ease-rogo)`
(`cubic-bezier(.44,0,.56,1)`). Verified in-browser: computed `transition-duration` is `0.5s`
and the timing function resolves to that curve.

**Geometry — the target's trick, extended from three cards to five.** rogo ran
`17 / 17 / calc(66% - 24px)`, the 24px being its two 12px gaps, so the row sums to exactly
100%. Five cards need four gaps: four closed at **16%** is 64%, leaving **36%** for the open
one, and the 48px it gives back is exactly 4 × 12px.

| width | open | closed ×4 | sum + gaps |
|---|---|---|---|
| 1440 | 413 | 205 | 1232 + 48 = **1280** ✓ |
| 1024 | 292 | 151 | 896 + 48 = 944 ✓ |
| 810 | 215 | 117 | 682 + 48 = 730 ✓ |

**36%, not the target's 66%.** The target expanded to reveal a text quote, where a wide card
is right. This reveals a 9:16 video: at 66% the open card would be a wide letterbox with a
head in the middle. 36% lands it at 412×600 (0.69) — still portrait-leaning.

**Two axes, one per tier.** Below 810 the stack animates **height** (96px closed → 440px
open); from 810 up the row animates **width** at a fixed 600px. Both ends are explicit values
in both cases, which is the whole reason they interpolate — the same reason the target wrote
two explicit widths instead of `flex:1 0 0`.

**The 810 switch is ours, not the target's 1200.** The user asked for all five visible on
narrower screens *before* asking for the accordion back; the horizontal row is what satisfies
both. Below 810 a 390 phone would put closed cards at 57px, so the stack takes over there.

**Attribution type steps down below 1200** — `p-3` + 14px/12px instead of `p-5` + 16px/14px.
At 810 a closed card is 117px wide, and at the desktop values that left 77px of text, which
rendered "Asaf…". Truncating a person's *name* is worse than truncating their role, which is
what the target's own `line-clamp-1` does. The tighter values fit every name in this set.

**Scrim added**, and it is load-bearing rather than decorative: the attribution sits over
arbitrary video frames that range from a dark car interior to a blown-out white wall.
Bottom-half `from-ink/85 via-ink/40`, faded out while playing so it does not sit over the
native controls.

**Closing a card pauses it** — via an effect on `openId` rather than the click handler, so
keyboard activation is covered too. Otherwise a collapsed 117px sliver keeps talking.

---

**Superseded by the amendment above.** The layout described from here on was the plain grid
that briefly replaced the accordion.

**Layout:** the 5-up grid runs from **810px up**, with a snap-scrolling row below it. Not a
stacked column — five 9:16 portraits run past 3000px on a phone — and not a 2-up grid, which
leaves a hole in the last cell. The row also matches how the real site presents them.

The 810 cut-off was first set at 1200 and lowered on the user's instruction (*"fix its 5"* —
five across was only appearing on wide screens). **810 is where the arithmetic stops
working, not a preference:**

| width | card | media box |
|---|---|---|
| 1600 / 1440 | 246 | 246×438 |
| 1200 | 214 | 214×381 |
| 1024 | 179 | 179×319 |
| 900 | 154 | 154×274 |
| **810** | **136** | **136×242** |
| 390 | 240 | scroll row |

At 810 the section's 40px insets leave 730px; less four 12px gaps, 682px over five cards is
136 each. One tier lower a 390 phone leaves 358px — 62px per card, where a face is not
legible — so the scroll row takes over. Measured at all seven widths: five cards, **one row,
no wrap, no horizontal page overflow** at any of them.

**The play disc is 44px below 1200 and 56px above.** A fixed 56 ate 41% of the 136px card at
the tablet floor and sat over the speaker's face. 44px is the floor — the minimum comfortable
touch target.

**Encode — 312 MB of masters → 21 MB.** 720px wide, h264 crf 26, AAC 96k mono, faststart,
poster pulled at 1.5s rather than frame 0.

**The crop numbers, because they were not obvious and cost a second pass.** Three of the five
masters are story-style exports with the speaker inset inside a LIGHT GREY frame. First pass
scaled the whole 1080×1920 and the row rendered visibly letterboxed on cards 1, 2 and 4 while
3 and 5 filled. `cropdetect` reported `1080:1920:0:0` for all of them — **it only detects
dark borders**, and these are light. Running `negate,cropdetect` instead found the real
boxes:

| Clip | content box | note |
|---|---|---|
| `asaf-peretz` | `864:1216:108:518` | 0.71 aspect — squarer than the rest |
| `adir-peretz` | `864:1526:108:198` | ≈9:16 already |
| `noam-tovi` | `864:1526:108:198` | ≈9:16 already |
| `nevo-yahaloman` | full frame | no padding |
| `achituv` | full frame | 4K HEVC master, 222 MB → 9.2 MB |

Encoded at native content aspect rather than forced to 9:16, letting the card's
`object-cover` do the final crop. Masters are `.gitignore`d (`Client testimonials/`); these
crop values are what makes them reproducible.

**Open**
- **`achituv` is unverified.** Name and role come from the uploaded filename
  ("Achituv-Vtechezena.MOV"), not from any published source — the live site shows only four
  testimonials. Role currently reads "Vtechezena". **Confirm before this ships.**
- **Asaf's burned-in caption clips at the sides.** His content box is 0.71 where the others
  are 0.5625, so `object-cover` crops width to fill a 9:16 card. Fixable only by letterboxing
  his card or re-cutting with the caption in mind.
- **All five have Hebrew burned-in captions** on an English-first site. Not a defect, but a
  mismatch the user should decide about.
- 21 MB of tracked video is heavy for a git repo. Fine for now; a CDN is the eventual answer.
- `src/components/ui/TestimonialLogos.tsx` and the three mark SVGs are now **orphaned** —
  nothing imports them. Left in place rather than deleted as part of this change.

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
