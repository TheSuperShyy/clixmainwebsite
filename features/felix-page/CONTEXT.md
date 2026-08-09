# Context: `/clix` page (clone of `rogo.com/felix`)

Memory for this page. **Newest entry on top.** Append after every task — never rewrite past
entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume cold, with no code scanning.

---

## Current state

**7 of 8 blocks built.** Hero, Video, Logo Proof, Manifesto, Testimonial, CTA and Felix Footer
all render at `/clix` from measured values; build is clean and all seven are in the served
HTML. **`Product Visuals` (block 5) is the only one missing** — it needs three 4000×2667
photos that are rogo's, and there is no substitute source yet.

**⚠️ The copy is rogo's, on purpose.** "Clone verbatim now, rewrite after" was the user's call.
The page says "Felix" and sells an investment-banking product.

**It is now live and deliberately `noindex`.** Pushed to `main` on 2026-08-09, which
auto-deploys; the route carries `robots: { index: false, follow: false }` so the target's
words — including ten real testimonials naming Felix and Rogo — are reachable for review but
not indexable under a clix wordmark. **Delete that block the moment the copy pass lands.** A
`noindex` left behind after a rewrite is a live page nobody can find.

**Two things block specific blocks and cannot be measured from the capture:**
1. the fixed backdrop's **scroll-driven colour** — the Manifesto is white-on-dark and the only
   dark thing available is that layer. Blocks 4, probably 6.
2. **assets** — video, 3 photos, 24 logos, all rogo's property. Blocks 2, 3, 5.

**Status:** `review`
**Next action:** look at it at all four tiers — nothing here has been pixel-diffed. Then the
three outstanding calls: `Product Visuals`' photos, the live backdrop animation, and the copy
pass.

---

## Log

### 2026-08-09 (push) — shipped to `main`, `noindex` on this route only

Pushed with the copy still rogo's, at the user's request. The mitigation they chose over
holding the push or excluding the route: `robots: { index: false, follow: false }` in the
route's `metadata`. Reachable, reviewable, not indexable — the indexing is the part that
does the damage, not the existence of the URL.

The **capture files** went up with it (`docs/reference/target/rogo-felix-2026-08-09.*`,
533 KB of rogo's own source) into a **public** GitHub repo. Not a new decision:
`rogo-home-2026-08-02.*` has been committed there since the project started, and `docs/` is
in `.vercelignore`, so the captures are in the repo but never served.

**Tied to the copy pass:** the `robots` block, and the standing warning above it.


### 2026-08-09 (later still) — top spacing fixed; ticker removed on this route

**Trigger:** user, with our `/clix` and `rogo.com/felix` screenshotted side by side —
*"match the spacing … on top on the clix Felix page. Also remove the black banner on top,
only on this page."*

**The spacing gap had one cause, and it was structural, not a padding value.** Block 1's
`128px 40px 0` was already correct and unchanged. What was wrong is that our header is
`position: fixed` and the target's, **on this page only**, is not:

```css
.framer-cv20u .framer-1jwqerv-container { position:sticky; top:0; height:auto }
```

Sticky means in flow, so the target's 128px is measured from the nav's bottom edge. Ours was
measured from the top of the document, which put the whole page ~70px high. rogo.ai's home
nav overlays a video and IS fixed — two pages, two templates, and the home page is right as
it stands.

**Fixed with a spacer, not by making the header sticky.** Sticky was the obvious move and is
the wrong one: the mobile panel lives inside the header, so in flow it would shove the page
down ~400px on every menu tap — a regression the fixed header does not have. A zero-content
spacer buys the same layout with none of that. `Nav` grew two props: `banner` and `spacer`.

**Height lives in one place, `--nav-row-h` in globals.css** — `74px` below 1200, `70px`
above. **Derived, not eyeballed**, and it holds because every box in the row is a
fixed height (`p-4` + `h-10` burger + two coincident 1px borders; `py-4` + the 38px
NavButton). No font metric is involved, so it cannot drift with the typeface — but it will
drift if a row's padding changes, which is why the derivation is written out beside the
value. Not in `@theme`: a Tailwind v4 theme block cannot carry a media query.

**`banner={false}` is deliberately NOT the same as passing no models.** Empty `models` is the
outage path and must keep reading as a fault on the home page; this is a template decision.
Same rendering, opposite meaning.

**Also closed a loose end:** the hero's `Request Access` was pointing at `/#contact` — the
*home* page's contact block — because `ClixCTA` did not exist when the hero was built. It
does now, so it points at `#clix-contact` on this page.

**Verified:** build clean, `/clix` still prerenders (and no longer carries a `revalidate`,
since the ticker was the only thing on the route that needed fresh data). Served HTML: no
`bg-banner` and the spacer present on `/clix`; banner present and no spacer on `/`.
**Not verified:** still nothing pixel-diffed at any tier.

### 2026-08-09 (later) — six more blocks built; page is 7/8

**Trigger:** user — *"building the clicks. Felix Page."* Read as: proceed, and make the
asset calls rather than waiting on them (CLAUDE.md's ceiling for decorative content — one
reasonable source, no hunting, show it and ask).

**Built:** `ClixVideo`, `ClixLogoProof`, `ClixManifesto`, `ClixTestimonial`, `ClixCTA`,
`ClixFelixFooter`. All box values measured; the per-block table of what was non-obvious is in
`FEATURE.md` and not repeated here.

**Three asset calls, all made the same way — reuse what the repo already owns, never
download rogo's:**
- **Video** → `public/video/hero-clix.mp4`, the clip the home hero already ships. Every box
  value is still the original's.
- **Logos** → all 12 institutions the target names were **already vendored** from the home
  page's carousel, so nothing was fetched or redrawn. They are white-fill (cut for the dark
  hero) and this page is light, so they render as **CSS masks with an `ink/70` fill** — one
  asset, either polarity, rather than a second recoloured copy of all twelve.
- **Footer wordmark** → the original's is a 2008×859 PNG of rogo's artwork. **Set in type**
  instead, at the same `2.3376` aspect so the block's height is unchanged.

The precedent for all three is the same one: this repo deleted rogo's `hero-original.mp4`
for copyright when it went public, and the deploy now publishes whatever `main` holds.

**⚠️ The Manifesto background is the one real fidelity compromise.** The original crossfades
the shared fixed backdrop to dark as you scroll in, which is unobservable in a static
capture. Ours paints the section `forest` instead. Same legibility, honest about what it is —
**the visible difference is a hard edge where the original has a crossfade**. `forest` was
chosen over `ink` because it is the page's own colour and the only dark it declares; that is
reasoning, not measurement.

**The marquee avoids the drift bug the logo-carousel had to solve in JS.** That row spaces
with `gap`, so a doubled track of 2n items has 2n-1 gaps and half its width is one gap short
of a cycle. Here each card carries its own `margin-right` instead, so n items measure exactly
n × (card + 20) and `-50%` is precisely one cycle — no measured cycle needed. Worth keeping in
mind for any future marquee: it is a cheaper fix than measuring.

**Also moved:** the fixed `canvas` backdrop went from inside `ClixHero` to `page.tsx`. In the
original it is a sibling of all eight sections, and keeping it in the hero put it inside an
`overflow-clip` ancestor for no reason. Every section now carries `z-[1]` to paint above it.

**Estimated, not measured** — flagged so nobody reads them as extracted: the testimonial
card's own width/padding/fill (the quote type and gaps ARE measured), and the 90s marquee
cycle.

**Verified:** `npm run build` clean; `/clix` prerendered; served HTML contains all seven
blocks' marker strings plus the video path and the marquee class. **Not verified:** nothing
on this page has been pixel-diffed against the reference at any tier, and there has been no
keyboard or contrast pass.

### 2026-08-09 — page captured and measured end to end; `Hero` built

**Trigger:** user pasted a screenshot of `rogo.com/felix` — *"So clone this page, um, it's…
should be clicks."* Two scoping answers followed: **copy = "clone verbatim now, rewrite
after"**, **route = `/clix`, and wire the nav**.

**Capture.** `docs/reference/target/rogo-felix-2026-08-09.html` (404 KB) + the five inline
`<style>` blocks concatenated to `.css` (129 KB). Dated filename, existing capture untouched,
per the reference README. **Note the host: `rogo.com`, not the `rogo.ai` the home page came
from** — same Framer project, different site.

**Eight blocks**, in order, with every padding/gap extracted → table in `FEATURE.md`.
Gutter is 40px at ≥810 and 16px on phone throughout; container is the same `1280px` the home
page uses, so no new layout token.

**The tier map collapses to three.** `hidden-j35swi` = phone, `hidden-1mourlc` = tablet,
`hidden-1ggina8` = desktop, `hidden-za60dz` = XL — derived by brace-matching each class back
to its enclosing media query. **XL and Desktop share every value on this page**, so the
headline has three sizes (92/72/56), not four, and there is no ≥1600 art anywhere.

**The palette costs exactly one token.** Counted rather than eyeballed: `forest` `#1a2a25`
×19 is the only colour the page introduces, and it does two jobs — display type and the
primary button. `ink` ×194, `muted` ×48, `hairline` ×19, `paper` ×17 already exist. The four
other greens the Framer project declares have **zero** uses, so DESIGN-SYSTEM's "defined but
unused" list was right to hold them and they stay there. `#8b8b8b` ×2 deliberately not
tokenized — two uses is a one-off.

**⚠️ The biggest finding is a thing the capture cannot answer.** The Manifesto's type is
`#ffffff` over body at `rgba(255,255,255,0.7)` — white, therefore on a dark ground. The only
candidate is the page's **fixed 110vh backdrop** (`framer-mEC0Y`), whose SSR fill is
`rgb(247,247,247)`. So that layer's colour is animated from JS on scroll, and the sequence,
offsets and easing are all unobservable in a static capture. Recorded before building
anything that sits on it, because building the Manifesto on a guessed background would
produce a section that looks finished and is wrong.

**Hero, built.** The headline is three boxes — centred `Meet Felix`, then a row of
right-aligned `your new` + a **fixed-width** rotating word (270px at ≥810, 306px on phone).
The fixed width is the mechanism: it holds the row's optical centre still while the word
changes. Full value table in `FEATURE.md`.

**The rotating word's motion is half measured, half estimated, and the split matters.**
Measured exactly, from the SSR node: it enters `blur(8px)`, `opacity:0`,
`translateY(-24px)` — from above. Estimated: hold 2600ms, swap 500ms, and a *downward* exit,
which is the natural continuation of a downward entrance but was never observed.

**⚠️ The word list is 2 words and the original's is longer.** Not recoverable: the word lives
in a Framer code component (`data-code-component-plugin-id="84d4c1"`) fetched lazily. Checked
two ways and then stopped, per the effort ceiling — the main 146 KB bundle contains none of
the strings, and six cache-busted fetches of the live page returned `investor` six times.
`analyst` came from the user's screenshot. **Nothing was invented to pad the cycle**; a made-up
word would read as measured. Extending the array is the only change needed when the real list
is known.

**Built with CSS transitions, no animation library.** `framer-motion` is not even installed,
and neither trigger fits: this is a timed two-state toggle, the same reasoning already
recorded for `testimonials`. `prefers-reduced-motion` freezes on the first word rather than
hard-swapping — an abrupt text change is the same distraction without the softening.

**One accessible heading for the whole lockup** (`sr-only`), with the three visible boxes
`aria-hidden`. Exposing them would announce a fragment at a time, and a live region would
announce a new word every 2.6s forever.

**The nav became a shared component today, which broke its own links.** `Clix` got
`href="/clix"` per the standing rule in `Nav.tsx` (an inert slot gets its href the moment its
page exists). But `#security` / `#testimonials` / `#contact` were bare hashes from the
one-page era and point at nothing on `/clix`, so all four are now root-relative (`/#security`
…). `/#x` still scrolls rather than reloads when you are already on `/`, so home is unchanged.

**Deviation from CLAUDE.md §3, deliberately:** one feature folder for the whole page rather
than eight. Eight folders for eight blocks of one page would bury the page-level mechanics
(the backdrop, the tier map, the shared gutter), which are the things that actually need to be
findable. Blocks are documented as sections inside `FEATURE.md`.

**Verified:** `npm run build` clean including TypeScript; `/clix` prerendered as static;
`localhost:3000/clix` returns 200 with the headline, button and rotating word in the served
HTML. **Not verified:** no pixel comparison against the reference at any tier, no keyboard or
contrast pass. The hero has not been diffed against a screenshot — only rendered.
