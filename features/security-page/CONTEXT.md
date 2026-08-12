# Context: Security page (`/security`)

Newest entry on top. Append, never rewrite. Written so a cold session can resume without
re-deriving anything: the spec is `FEATURE.md`, this file is what happened and why.

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
