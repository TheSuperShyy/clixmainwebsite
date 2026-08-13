# Context: Security page (`/security`)

Newest entry on top. Append, never rewrite. Written so a cold session can resume without
re-deriving anything: the spec is `FEATURE.md`, this file is what happened and why.

## 2026-08-13 (third pass) — a second window, and both are draggable

**Why.** *"can you add also something like this? in kiro both are dragable in the canva"* — the
user wanted kiro's full hero composite, not just its terminal. They chose **run history +
changed files** for the second window's content and **desktop-only dragging that snaps back**.

**What landed.** Four files where there was one: `MockWindow.tsx` (chrome extracted, because the
title bar would otherwise have been written twice), `SecurityConsole.tsx` (three panes),
`SecurityCanvas.tsx` (layout + entry + drag), and `SecurityTerminal.tsx` refactored onto the
shared chrome. `SecurityHero` now renders `<SecurityCanvas />`.

**The user also pasted a third-party spec for how kiro's own component is built.** Three of its
instructions were rejected on this repo's own rules, and it is worth recording why so nobody
re-adopts them from the same source later:

- `bg-purple-300` / `#bca5ff` and the amber/red status accents — the monochrome rule. Status is
  carried by fill and opacity here, as the feed already does.
- **framer-motion** — not installed (only `gsap` + `@gsap/react`), and `docs/SKILLS.md` gives
  GSAP the scroll-driven work. A second animation library for a mount fade is not justified.
- **Braille characters for the dot-matrix** — the banner is a grid of 3px spans precisely
  because Fragment Mono's glyph coverage is not guaranteed and a fallback shears the art.

Its one good structural idea — a reusable window-chrome component — was taken, and it is what
`MockWindow` is.

**Geometry.** console 900 × 440 at (0,0), terminal 720 × 320 at (280,260), composite 1000 × 580,
`#first` = 198 + 302 + 96 + 580 + 80 = **1256**. 1000 is chosen against 1200, the narrowest tier
that shows it, where the content row is 1120 — 60px of air per side, measured.

⚠️ **Only the `>=1200` tier moved.** 1199 / 1024 / 390 measure 952.41 / 952.41 / 905.19, the
same numbers as the previous pass, because the console and the dragging are gated to one
breakpoint on purpose. Verified at 1199 that the console is `display:none` and the cursor is
`auto`.

**One bug, and it was a bad one.** `bounds: "#first"` — a selector STRING — threw and took the
entire client tree down. `useGSAP({ scope: root })` scopes every GSAP selector to the component's
own subtree, and `#first` is an ANCESTOR, so it matched nothing and Draggable read
`undefined.nodeType` inside `_getBounds`. **SSR still served `#first`, so the symptom looked like
a hydration failure rather than a selector one** — `curl` showed the id present while the live
DOM had no `#first` at all. Fixed with `root.current?.closest("#first")`, which resolves the node
outside GSAP's scoped lookup. Three "Invalid scope" warnings went away with it. **Do not pass an
ancestor selector to a scoped GSAP call.**

**No shadow.** The reference spec lifts the front window with `shadow-2xl`. Grepping `shadow-`
across `src/components/` returns nothing — this site has no shadows at all — so one here would
be the first on the build and would need a token and an elevation scale. Occlusion plus the
existing `hairline-light` border does the job.

**Measured, not asserted** (headless CDP, viewport 900, `/security` and `/he/security`):

| | 1600 | 1440 | 1200 | 1199 | 1024 | 390 |
|---|---|---|---|---|---|---|
| `#first` height | 1256 | 1256 | 1256 | 952.41 | 952.41 | 905.19 |
| console rendered | yes | yes | yes | **no** | no | no |
| air per side | 260 | 180 | **60** | — | — | — |
| page overflow-x | 0 | 0 | 0 | 0 | 0 | 0 |

Drag driven for real over CDP at 1440: transform `matrix(1,0,0,1,0,0)` → `(-140,-90)` while held
→ back to `(0,0)` after release; left edge 500 → 360 → 500. Nav-theme regions contiguous at
every tier in both locales. `tsc`, `eslint` and `npm run build` clean; `/security` still
prerendered static.

⚠️ **Still open:** the console's and the feed's copy are both **unsigned by the user**, and
FEATURE.md open questions 1 and 2 still bear on them.

## 2026-08-13 (later) — the terminal becomes an endless agent feed

**Why.** The first pass typed one log and froze. The user put it next to kiro again: *"ours after
the animation it's static but in kiro it's continuously coding and stuff"*, and chose *"the kiro
literal agent feed, but connect it to security"*. **Endless is the requirement**, not decoration.

**What changed.** The static seven-line log became a **rolling six-row feed** over a pool of
twelve security checks, advancing one row every ~1.3s forever. Command changed from
`clix verify --env production` to **`clix audit --watch`** — `--watch` is the one word that
explains to a reader why the feed never ends. Banner, title bar, window geometry and the whole
colour story are unchanged.

**Design calls worth keeping.**

- **Status is derived from POSITION, never stored.** Rows above the last visible one are done,
  the last visible one is running, the one below the clip is queued. The feed is a pure function
  of one integer; no row has a state machine.
- **Status is carried by FILL, not hue.** kiro colour-codes its feed (green dots, cyan verbs);
  this site has no palette to spend, so a hollow `muted` ring is queued, a `paper-soft` disc is
  done, a `paper` disc that pulses is running. Still no new token and no new colour.
- **Six visible, seven rendered.** The seventh is below the clip and is what slides in. The
  viewport is `calc(6 * 1.6em)`, which is exactly six rows at BOTH type tiers with no second
  number to keep in sync — measured 6.002 at 14px and 6.003 at 12px.
- ⚠️ **The travel is measured off a live row, not hardcoded.** `ProductStepper`'s `rows-up`
  keyframe carries a warning that its 62px travel must be kept in sync by hand, because a
  keyframe cannot be parameterised. A tween can, so this one reads `rows[0].getBoundingClientRect()`
  instead — the failure mode is removed rather than documented.
- ⚠️ **`paint()` rewrites `textContent` on a loop, and the `aria-hidden` root is what makes
  that OK.** The a11y objection to mutating text does not apply to a subtree the a11y tree cannot
  see, and fixed-height rows mean nothing reflows. Node count is constant forever: seven rows,
  reused, never appended.
- ⚠️ **The loop pauses off screen** via `ScrollTrigger.onToggle`. An endless compositing loop
  running while the visitor reads the rest of the page is real battery for something invisible.
- ⚠️ **The pulse is bound to a slot, not a row**, so it rides up during the 350ms slide and
  snaps back at the repaint. Correct at rest, which is 73% of the cycle. Recorded so the next
  reader knows it was considered rather than missed.
- ⚠️ **The rows name checks being RUN, not results being CLAIMED.** An endless stream of passes
  would be the seal problem in a new costume. Every subject maps onto one of the five practice
  cells. **Still unsigned by the user**, and FEATURE.md open questions 1 and 2 still bear on it.

**Measured, not asserted** (headless CDP, 1440 and 390, motion and reduced-motion):

| | 1440 | 390 |
|---|---|---|
| rows rendered / visible | 7 / 6.002 | 7 / 6.003 |
| row height | 22.39 | 19.19 |
| feed viewport | 134.39 | 115.19 |
| feed bottom vs body inner bottom | −38.22 | −40.63 |
| longest row vs window inner edge | −427.11 | −108.95 |
| page horizontal overflow | 0 | 0 |

Feed content differed at t+0, t+4s **and t+8s** at both widths, so it is genuinely endless rather
than a one-shot that happened to look different. Under emulated `reduce`: every dot reports
`animation: none`, the list is populated and static. Hero heights, window box and nav-theme
contiguity are unchanged from the first pass. `tsc`, `eslint` and `npm run build` clean.

## 2026-08-13 — kiro-style terminal in the hero (the boss's ask)

**What landed.** `src/components/security/SecurityTerminal.tsx`, a monochrome terminal-window
mock, rendered as the SECOND child of `#first`. New file plus edits to `SecurityHero.tsx` and
`docs/reference/security-diff.js`. Spec: FEATURE.md "Block 1b".

**Why, and what it costs.** The user's boss saw kiro.dev and asked for "coding effects, since
it is the security section". Two things were spent knowingly, both now in the deviations table:

1. **The page's "no motion" finding is no longer true of ours.** It is still true of the TARGET
   (`data-framer-appear-id` count 0) and that is how it is now worded everywhere. The other
   three blocks stay motionless.
2. **`#first`'s measured `70vh` is gone.** The section is `overflow: hidden`, so a 320px window
   inside a frozen 630px box holding 580px of content would have been 270px of clipped window.
   The band is `min-content` at every tier now, and `heroH` is an intentional exclusion in
   `security-diff.js` — removed from `BODY`, because that harness walks `Object.keys(refValues)`
   and has no skip list.

**Design calls worth keeping.**

- **Nothing of kiro's palette came over.** kiro is lavender-purple with syntax-coloured terminal
  text; this site is monochrome by rule. The window is built from `ink` / `ink-soft` /
  `hairline-light` / `muted` / `paper-soft` / `paper` — **no new token, no new colour**. What was
  borrowed is the form: window chrome, monospace, dot-matrix banner, live-looking output.
- **`muted` is kept off every readable string.** It is 3.85:1 on `ink` and already fails AA in
  five INHERITED places on this site. This block is ours, so it carries `muted` only on the
  traffic dots, the dot-matrix art and the two line markers — non-text decoration at 3.53:1,
  clear of WCAG 1.4.11's 3:1 floor. No sixth failing pair was added.
- **English + `dir="ltr"` in both locales** (user's call). Nothing here reads the dictionary, so
  the component never needed `usePageDict`. Verified `direction: ltr` inside `dir=rtl` on `/he`.
- **Copy is gated to what the page already claims in prose.** Each of the six log rows maps 1:1
  onto one of the five practice cells. This repo has stripped unbacked claims twice (home
  2026-08-05, `/product` 2026-08-12) and a terminal that prints audit results is exactly the
  shape of thing that can smuggle one back in. ⚠️ **Still unsigned off by the user**, and two
  FEATURE.md open questions bear on it (Benefit 3's per-run logs, Benefit 5's TLS + secret store).

**One bug, found by measuring rather than by looking.** The typed command span was `w-max`. It
rendered **650.06px wide against 242.27px of text** — as a flex item it absorbed the whole
remaining row instead of hugging its content, which stranded the caret ~400px past the end of the
command in the two states that have no animation to hide it: JS off and reduced motion. Fixed by
deriving the width from `COMMAND.length` inline, which is the same expression the tween animates
to, so the resting width and the animation's end cannot drift apart. **Do not put `w-max` back.**
A screenshot would not have caught this; the span is `overflow-hidden`, so the excess is
invisible empty space.

**Two reuse decisions.**

- `@keyframes blink` is reused from `/product` rather than redeclared. Its own comment in
  `globals.css` warns that the global reduced-motion clamp (`animation-duration: 0.01ms`) can
  freeze a caret mid-cycle and INVISIBLE, which is why ProductHero drops its class outright. This
  component does the same by never adding it: the blink is switched on from inside the
  `no-preference` matchMedia branch, as an inline style. Inline and not a Tailwind class because
  a class added at runtime is invisible to Tailwind's source scanner — the utility would only
  exist while some other file happened to spell it out.
- GSAP's house pattern (`useGSAP` + `gsap.matchMedia` + a raw-DOM cleanup) is copied from
  `ClixBackdrop.tsx`. ⚠️ **`docs/SKILLS.md` lists `gsap` and `framer-motion` as installed and
  NEITHER IS PRESENT in `~/.claude/skills/` any more** — the registry's "verified present on
  2026-08-02" is stale. The repo's own components were the pattern instead. Worth a registry fix.

**Measured, not asserted** (headless CDP, viewport pinned to 900, 1600 / 1440 / 1024 / 390, on
both `/security` and `/he/security`):

| | 1600 | 1440 | 1024 | 390 |
|---|---|---|---|---|
| `#first` height | 996 | 996 | 952.41 | 905.19 |
| window box | 720 × 320 | 720 × 320 | 720 × 320 | 358 × 288 |
| longest row vs body inner edge | −357.88 | −357.88 | −357.88 | **−49.61** |
| horizontal overflow | 0 | 0 | 0 | 0 |

All three height sums close exactly against the arithmetic in `SecurityHero.tsx`'s tier map. The
hero's `gap-24` is live (`row-gap: 96px`, two children). Four `[data-nav-theme]` regions still
contiguous with 0.00 gaps at every tier and in both locales. `tsc --noEmit`, `eslint` on
`src/components/security` and `docs/reference/security-diff.js`, and `npm run build` all clean;
`/security` is still prerendered static.

⚠️ **The block-diff was NOT re-run** — it needs the live target and `heroH` left `BODY` that day,
so the set is 59 keys now. Our side of every remaining key was re-measured directly and is
unchanged; the target side was not revisited.

⚠️ **Still open for the user:** the six log lines are unsigned; the hero grew from 630 to 996 at
>=1200, so the fold now sits just past the bottom of the window; and the dot-matrix banner reads
FAINT on desktop at `muted` — a one-token change if they want it brighter.

⚠️ **A `git stash` / `git stash pop` was run mid-session** to test whether a lint error
pre-existed, and it swept up and restored an UNRELATED uncommitted edit to
`src/components/contact/ContactForm.tsx` (the user's own, fixing a form that rendered 1px wide
below 1200). Verified intact afterwards. Do not stash in this tree while the user is editing.

## Current state

**Status:** `review` · **Branch:** `dev` (no feature branch, matching `/company` and
`/careers`) · **Not committed.**

**Verified, not asserted:**

- **Block-diff `ALL MATCH` at 1600 / 1440 / 1024 / 390**, 60 keys per tier.
  `node docs/reference/block-diff.js docs/reference/security-diff.js 1600 1440 1024 390` → exit 0.
- `npm run build` clean — 13 routes, `/security` prerendered static. `tsc --noEmit` clean.
  `eslint` clean on `src/components/security` and `src/app/security`.
  ⚠️ `npx eslint .` reports 8 errors project-wide; all 8 are pre-existing (`ClixCTA.tsx`,
  `ClixHero.tsx`, `block-diff.js`, `contrast-check.js`) and none is on this route.
- Four `[data-nav-theme]` regions, **all `dark`, every gap 0.00 at every tier** — measured, not
  assumed. Zero horizontal overflow (`scrollWidth === clientWidth`) at all four widths.
- One focusable control in `<main>` (the hero CTA) with a visible ring; heading outline
  h1 → h2 → h3; five marks all load, all `alt="" aria-hidden="true"`.
- Contrast: `paper` on `ink` 18.26:1, `paper-soft` on `ink` **11.84:1**, `ink` on `paper` 18.26:1.

**Awaiting the user — none of it blocks a commit:**

1. **Benefit 3** ("Every run records what it read, what it wrote and when") assumes per-run logs
   exist and are visible to the client. If they do not, this card needs **replacing**, not
   softening — and the same clause appears in `SecurityCore`'s first paragraph, so both move
   together. Cross-referenced in a comment in each file.
2. **Benefit 5** names TLS and a managed secret store. Confirm or correct.
3. **The five 14px cell labels are `muted` on `ink` = 3.85:1 and fail AA.** Inherited, and the
   same failure already open on home, the footer, `/product` and `/careers`. `mark` `#8b8b8b`
   is 5.36:1 and would close all five routes at once. Not fixed on this one alone.
4. The page is **not `noindex`** — deliberately, see below. Say so if you would rather it were.

---

## Log

### 2026-08-12

**Done**

`/security` built end to end and cloned 1:1: three bands (`Hero` `#first`, `Benefits`
`#features`, `Compliance` `#features-1`) plus the shared `Footer`, which already renders the
target's fourth Framer band `Reiteration`. Four components, one per agent, built concurrently
with strict file ownership per `multi-agent.md`. Capture at
`docs/reference/target/rogo-security-2026-08-12.{html,css}` (374 KB, five inline `<style>`
blocks), plus a live CDP probe at all four tiers the same day.

Wiring: `Nav.tsx:108` `Security` moved from `/#security` to `/security`, and
`ProductSecurity.tsx`'s "Find out more" retargeted from `/#security` to `/security` — a
follow-up that file had pre-registered in its own comment since 2026-08-11. Home's `#security`
band is untouched and keeps its anchor.

**Decisions**

- **No `robots` guard, and that is the first cloned route to ship without one.** All four gate
  items that hold `/product`, `/company` and `/careers` are clear: no third-party trademark, no
  certification clix does not hold, no real person quoted, every string clix's own from the
  first commit. `/news` is the precedent.
- **Practices, not seals** (the user's call). The target's five cells are SOC2 / CCPA /
  ISO 27001 / GDPR / EU AI Act; SOC 2 and ISO 27001 are audited certifications clix does not
  hold, and this repo already stripped that exact set from home on 2026-08-05. The cells reuse
  home's five practice statements and its five `public/badges/practice-*.svg` marks — one story
  across two pages rather than two. **The heading had to move with them**: "Compliant With /
  Industry Standards" cannot survive the change, because none of these is a standard anyone
  certifies. It is now "Built On / Practices We Keep".
- **The `Explore security portal` link is dropped** (the user's call) rather than pointed
  somewhere invented. rogo's goes to `trust.rogo.ai`, a Vanta trust centre clix has no
  equivalent of. Measured first so it is on record, not merely absent: 190.06 × 32 at ≥810,
  358 × 32 at 390.
- **`hover:opacity-90` on the CTA is ours, not the target's** — a consistency call over a
  fidelity one. The capture has no `:hover` rule in any of the three subtrees except the
  bracket variant, so the agent that built the hero left it off and said why. Added back
  because the Nav, the Footer, `/product` and `/careers` all fade the same "Request Demo"
  control, and a primary CTA that behaves differently on one route is a defect in our own
  system whichever way the target authored it.
- New token **`paper-soft` `#ffffffcc`** (white @80%): the hero subtitle, all six benefit bodies
  and the core paragraph. Framer's `--token-2a466810`, carried in `DESIGN-SYSTEM.md` as
  declared-but-unused since 2026-08-02 — the fifth time a zero-use count has turned out to be a
  fact about the pages counted rather than a verdict, after `forest-deep`, `brand-green`, `bone`
  and `signal-green`. It is the light-on-dark counterpart of `ink-soft` and stays its own token
  because white headings and 80% bodies appear **together** in all three bands.
- **Row 1's heading is `<h2>`, not the target's `<h3>`** — the agent pushed back on the brief
  and was right: `SecurityBenefits` contributes no heading, so an `h3` there would follow the
  hero's `h1` with h2 skipped. Same call `sections/Security.tsx` and `ProductSecurity.tsx` both
  make in-file.
- **`#contact`, not `/#contact`, on the CTA** — also an agent pushback, also right. The rooted
  form is a navigation to `/` and trips `@next/next/no-html-link-for-pages`, which is a *live*
  failing rule in this repo (`ClixCTA.tsx:54`). `ProductHero` and `CompanyHero` already ship the
  bare form for that reason. `FEATURE.md` was corrected, not the code.

**Measurements worth keeping — five traps**

1. **`#features-1` is ONE band holding TWO rows.** "Security At Our Core" reads as a fourth
   section and is not one: it is the second direct child of the Compliance band, separated from
   the badge grid by that band's own 120px gap. Settled by probing the live DOM's direct
   children *before* any component was written — the same class of mistake `/product` made twice
   by reading byte offsets as nesting. It is why `SecurityCore` is deliberately not a
   `<section>` and why `SecurityCompliance` imports it: pre-resolving that contract in both
   agent prompts is the only reason two concurrent agents converged on it.

2. **The hero's height is `70vh`, not a content sum.** `198 + 302 + 80 = 580` and the band is
   630 at a 900px viewport. Below 810 it is `height: min-content` and the sum does close
   (521.19). Anything that "fixes" that arithmetic is a defect that looks like a correction —
   and the viewport height is now load-bearing for the harness, which pins 900 on both sides.

3. **The cell rules are a dashed `::after` overlay with a ragged, non-derivable matrix.** Every
   cell computes `border-width: 0`; the rule is `[data-border]::after`. At 390 cell 3 draws
   `0/1/0/1` — no top *and* no bottom — while cell 4 draws all four, so the outline below 1200
   does not close. Reproduced verbatim as a per-cell overlay `<span>`, because a real `border`
   takes layout space and would move the 104px mark 1px, which is the exact bug `/product`
   Block 3 shipped. ⚠️ The agent flagged that cell 4's phone row disagrees with home's grid,
   which encodes `1/0/1/1` — genuine divergence between two different pages, both probed
   directly, not a transcription slip.

4. **Both corner brackets are the same 21 × 33 SVG**, the BR one at `rotate(180deg)`. Unlike the
   CTA's 14 × 20 pair, which really are two different paths. ⚠️ And the marks are **children of
   `Logos` on the target and of the grid here** — same left edge, same width, so the −5 / +5
   offsets are identical, but a harness scoped to the grid finds nothing on the target side and
   prints `null` against a valid pair. That was the first diff run's only failure.
   ⚠️ Second harness trap in the same key: **the target emits BR before TL in the document.**
   The corner pair has to be sorted by left edge, or an index read compares TL against BR and
   reports two symmetric-looking failures.

5. **The CTA brackets are `dx −28 / dy −12` — the same numbers `/product` and `/careers`
   measured.** Third independent measurement, three different pages. But the `<a>` here is
   **220 × 36 inside a 220 × 40 frame**, where `/careers`' fills its frame; the 4px it leaves is
   real and is what the vertical bracket travel is measured against.

**Two content facts the diff caught that no screenshot would have**

- **The first headline did not survive measurement.** "Your Data Never Leaves You." sets in 2
  lines at 1440 and 1024 and **3 at 390**, making the hero 581.98 against the target's 521.19.
  Seven candidates were then measured in the live DOM at all three tiers and
  "Your Keys. Your Data." was the one that is 2 lines everywhere. Character count does not
  decide wrapping — the same lesson `/product` recorded on 2026-08-12, and the reason all six
  benefit strings were pre-fitted before the agents ever saw them (every title 1 line, every
  body exactly 2, at every tier — which the uniform grid rows require).
- **The band delta is two terms, not one.** −64px at every tier is the dropped portal link
  (32 link + 32 gap). The further −20.79 at 1024 and −20.80 at 390 is **one line of our own
  paragraph** (8 lines where the target takes 9, 13 where it takes 14) at 16px/130%. Conflating
  them would hide a copy fact behind a layout one. Document totals then reconcile from exactly
  three terms: this band, that line, and the shared `Footer` being +43.8px taller than rogo's at
  1440 and +234px at 390 — the pre-existing `FooterMap` difference `/company` already recorded
  on every route. Nothing in the diff is unexplained.

**Two real bugs the diff caught at 390 only**

Both invisible on screen, because at 390 nothing competes for the row:
`align-items` was scoped to `tablet:` when the target computes `flex-start` at every tier, and
the core row's right column had no explicit `flex` base, so it inherited the CSS default
`0 1 auto` where the target computes `0 0 auto`. The left column already carried its
`flex-none`; only its sibling was wrong.
