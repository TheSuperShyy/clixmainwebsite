# Context: Careers page (`/careers`)

Memory for this page. **Newest entry on top.** Append after every task — never rewrite past
entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work cold, with no code scanning.

## Current state

**Status:** `review` — built, measured, verified, and committed to `dev` on 2026-08-12
(page + copy pass in one commit).
**Branch:** `dev` (user's explicit instruction 2026-08-12: *"dont create a career branch just stay
in dev"*).

**The page is Hero → Gallery → About → Footer.** Three sections, not four: the `#roles` band
and the hero's "See Careers" CTA were removed on 2026-08-12 at the user's request. All the
copy is clix's own, rewritten from rogo's verbatim the same day. See the log for both passes.

**Verified, not asserted (re-run AFTER the removals):**
- **Carousel block-diff ALL MATCH at 1600 / 1440 / 1024 / 390**, 18 keys.
  `node docs/reference/block-diff.js docs/reference/careers-carousel-diff.js 1600 1440 1024 390`
  ⚠️ The roles diff passed the same day with 38 keys and **no longer runs** — its `ours`
  expression throws on a null `#roles`. Kept anyway; see the log.
- `npm run build` clean (12 static routes, `/careers` prerendered), `tsc --noEmit` clean,
  `eslint` clean.
- `data-nav-theme` chain re-probed at all four tiers: `hero > gallery > about > contact` /
  `light > light > light > dark`, **every gap 0**. Removing `#roles` removed the page's only
  dark section, so the handover now happens at the Footer.
- No dangling in-page anchors: every `href="#…"` on the page resolves. Probed, not grepped.
- Zero horizontal overflow at all four tiers.
- Focus order: carousel track → Previous → Next, all with a visible ring. **The carousel is
  the only interactive thing left on the page.**
- Contrast run through `contrast-check.js`, not estimated. **Nothing on the page fails AA now**
  — the one failure was the role-row index and it went with the band.
- Rendered and eyeballed at all four tiers.

**Awaiting the user — two items, neither blocking:**
1. **`noindex` is now unjustified and still in place. The one real open decision.** Both reasons
   are gone: the copy is clix's own, and the invented job rows left with the band. The
   photographs were never part of the guard. **Kept deliberately** — lifting it makes the route
   publicly indexable, which is the user's call and not a side effect of deleting a section.
   One line in `src/app/careers/page.tsx`.
2. **The hero h1 breaks mid-hyphen** ("next-" / "generation"). Dropping the hyphen is the only
   fix that survives the phone tier. It is the user's sentence, so it is their call.

**Resolved by the removal, recorded so they are not re-raised:** the row index's 3.85:1 AA
failure (still true of the target and of `/product` Blocks 4/5/6), the invented role titles, the
generic `Open Roles` / `open positions` labels, and the `mailto:`-styled-as-a-job-row question.
`Footer.tsx`'s "Company" column still has no Careers link — deliberately not added; it is a
contended file and a 4th link where the others have 3 is a visible change.

⚠️ **A SECOND CLAUDE BUILT `/company` IN THIS SAME WORKING TREE** (user, 2026-08-12). Not a git
conflict — a literal same-file race. Handled by namespacing everything under `careers/` and
touching shared files only with surgical single-line edits, re-read immediately beforehand. That
caught `Nav.tsx` mid-flight: `Company` had already been given its href and the `/product` noindex
comment rewritten. Their in-progress page also 500'd every route for a while, because Turbopack
surfaces any route's compile error on all of them — expect that, it is not your bug.

---

## Log

### 2026-08-12 — `#roles` band and hero CTA removed (later still)

**Done**
- Deleted `src/components/careers/CareersRoles.tsx` and `careersOpenings.ts`; unmounted the
  section from `page.tsx`. User: *"remove this section we dont need job offering for now also
  remove the see career button"*.
- Removed the hero's 220×40 "See Careers" CTA and, with it, `BracketLeft` / `BracketRight`.
  This file was their only user; identical copies remain in `ProductHero.tsx`.

**Decisions**
- **The CTA had to go with the band, not just because the user asked.** Its whole job was
  `href="#roles"`. Left in place it would have been the page's only call to action, pointing at
  a fragment that no longer resolves.
- **`careers-roles-diff.js` was KEPT, not deleted**, with a warning header. Its `ours` half now
  throws, but its `ref` half is still a working description of the target's band, and
  re-deriving it means re-probing a live site. Same reasoning kept the band's full measured
  spec in FEATURE.md.
- **`signal-green` and `glyph` were KEPT in `@theme`** though nothing uses them now. Both are
  the target's own measured values; an idle token emits one custom property and no utilities.
  Documented as idle in DESIGN-SYSTEM.md, with an explicit "do not introduce them elsewhere to
  justify keeping them" — that is how a palette drifts.
- **`noindex` was NOT lifted, even though both of its reasons are now gone.** Making a route
  publicly indexable is outward-facing and reversible only in the sense that the crawl already
  happened. It is the user's call, flagged, not taken.

**Measured (all after the removal, all four tiers)**
- `#hero` **529 / 529 / 415 / 643**. ⚠️ **The 529 is a coincidence and it is the most
  misleading number on this page.** The target is 529 with a 2-line headline plus a 44px gap
  and a 40px button; we are 529 with a 3-line headline and no button. The extra line (+83.6)
  and the removed CTA (−84) cancel to within a pixel. Two unrelated changes summing to zero.
  Never cite it as fidelity: re-add the CTA and it is 613, shorten the headline and it is 445.
- `<main>` 1494 / 1494 / 1394 / 1708. `#gallery` 636 and `#about` 329/343/430, both unchanged.
- **Nav-theme chain `hero > gallery > about > contact`, `light > light > light > dark`, every
  gap 0.** This was the risk worth probing: `#roles` was the ONLY dark section, so its removal
  moves the light → dark handover to the Footer. It holds. **If the band ever returns it must
  go back between `#about` and `<Footer>`**, or the dark run is discontiguous and the nav
  paints a white bar over it.
- Zero dangling `href="#…"`; zero horizontal overflow; carousel diff still ALL MATCH.

---

### 2026-08-12 — copy pass (later the same day)

**Done**
- Rewrote every editorial string on the page in clix's voice. User: *"in the career section,
  lets personalize it now, with the headers and subheaders, for the jobs i will follow up
  later"*. Four strings:

  | | Rogo | Clix |
  |---|---|---|
  | Hero h1 | Join the Team Creating the Future of Finance | Join us in engineering the core of next-generation software. |
  | About h3 | Building The Smartest / *Analyst On Wall Street* | Automating The Work / *Nobody Should Be Doing* |
  | About body | 244 + 201 chars | 244 + 189 chars |
  | Roles h2 | Find Your Role | Where You Come In |

- Retired the FIRST of the two noindex reasons in `src/app/careers/page.tsx`. **The guard
  stays**, on the second: the jobs are invented and the user has said they are the follow-up.

**Decisions**
- **Sourced, not invented.** "Quiet mechanisms" is `ClixManifesto.tsx`'s own opening line, which
  in turn comes from `docs/reference/clixsolutions/` ("we build the quiet mechanisms that drive
  modern businesses"). The About paragraph names the four services clix actually sells, and
  "the afternoon you just gave back" is the manifesto's image, reused so the careers page and
  the product page sound like one company rather than two writers.
- **No dashes**, per the user's standing 2026-08-10 request. Asserted afterwards rather than
  trusted: read the rendered `textContent` of all four blocks at all four tiers and regexed for
  `[–—-]`. Zero hits.
- **Line counts were a constraint on the writing, not a check after it.** The hero h1 is 43
  characters against rogo's 44 precisely so it still wraps 2/2/2/4; that is what keeps `#hero`
  at 529/529/479/585, identical to the target. The roles h2 was capped at 17 characters because
  40px type inside 358 less 32px of padding is about what fits on one line at 390.
- **Left the group heading `Open Roles` and the label `open positions` alone.** Both are labels
  *for the list*, and the list is the part the user deferred. Changing them now would be
  writing headers for content that does not exist yet.

**Measured**
- ⚠️ **`#hero` 613 / 613 / 479 / 707 against the target's 529 / 529 / 479 / 585.** The user
  chose their own 60-character sentence over four measured 33-to-42-character alternatives,
  with the ceiling and its cost stated first. It sets 3 lines at ≥1200 and 6 at 390 where
  rogo's 44-character one set 2 and 4. A decision, not a defect; do not trim it back.
  **1024 did not move** — 72px against a 944px measure still fits in 2 lines. I predicted 542
  there and the probe said 479. **Predict nothing about wrapping; render it.**
- The 44-character ceiling itself is measured, not assumed: eight candidates rendered through
  `Range.getClientRects()` at 1440 and 390. Everything ≤ 44 chars gave 2 lines / 4 lines;
  45 chars gave 5 at 390. That is the number any future headline gets judged against.
- ⚠️ The h1 **breaks mid-hyphen** ("next-" / "generation"). No clean fix at 390:
  `white-space: nowrap` on the compound is a 15-character unbreakable run, ~480px at 64px
  type, wider than the 358px viewport, and the section's `overflow-hidden` would clip it.
  Dropping the hyphen fixes it and keeps the line count. Flagged; left as written. Open.
- `#roles` h2 one line at every tier including 390. `#about` h3 two lines at every tier (the
  `<br>` guarantees it).
- ⚠️ **`#about` is 329 at ≥1200 and 430 at 390, against the target's 352 and 471.** 1024 lands
  on 343 either way. Cause, arithmetic not guesswork: our p1 sets in 3 lines at ≥1200 where
  rogo's set in 4, and 18px × 130% = 23.4px ≈ the 23px delta. Nothing CSS controls moved. This
  is the expected price of the rewrite and it is recorded rather than tuned away — padding
  sentences out to hit a height the target got from different sentences would make the measured
  spec a fiction.
- Both block-diffs re-run at 1600/1440/1024/390: **still ALL MATCH** (18 carousel keys, 38 roles
  keys). They compare computed styles and box geometry, not text, which is exactly why the
  `#about` height change is invisible to them and had to be probed separately.
- `npm run build` clean (12 static routes), `tsc --noEmit` clean, `eslint` clean, zero
  horizontal overflow, five `data-nav-theme` sections still contiguous (all gaps 0).

**Corrected**
- The AA figures in `CareersRoles.tsx` and in FEATURE.md's open questions still read 3.91 / 5.44
  — planning estimates that never went through `contrast-check.js`. The tool's numbers are
  **3.85 / 5.36 / 8.33** and were already right in the acceptance checklist and in
  DESIGN-SYSTEM.md. Now consistent everywhere.

---

### 2026-08-12

**Done**
- Froze the capture: `docs/reference/target/rogo-careers-2026-08-12.{html,css}` — 577,355 B HTML,
  **six** inline `<style>` blocks → 149,428 B CSS, 581 `data-framer-name` nodes / 83 unique.
  Plain Node `fetch`, the established method.
- Extracted the full measured spec per tier into `FEATURE.md`, then re-read **every** value from
  the live page over CDP at 1600/1440/1024/390. Capture and live agree on all of it.
- Reference screenshots → `assets/ref-{1600,1440,1024,390}-{top,about,roles}.png`. Three shots per
  tier because `captureBeyondViewport` does not paint far-below-fold content — the roles band had
  to be scrolled into view and shot separately.
- Added three tokens: `signal-green` `#19a26c`, `glyph` `#afafaf`, `control-scrim` `#00000033`.
- Launched the five-agent wave by file ownership per `multi-agent.md`.

**Decisions**
- **Branch: none.** Work happens directly on `dev`, per the user.
- **Hero photos: neutral stock, not rogo's team.** The carousel's 8 images are photographs of
  rogo's identifiable staff. Geometry and motion stay 1:1; only the pictures change. This is the
  liability `/product` Block 6 still carries and the one place worth not repeating.
- **Job list: 3 roles, flat, no filter pills.** The original has 77 roles in 11 categories behind
  an 11-pill filter. The pills' measured values are recorded in `FEATURE.md` under "measured but
  deliberately not shipped" so the work is not lost if they are ever wanted.
- **Copy: rogo's verbatim** for hero + mission ("clone now, rewrite after"), so the route ships
  `robots: { index:false, follow:false }` — same posture as `/product`.
- **Role `href` is a real `mailto:`, never an invented ATS URL.** rogo's rows point at real
  `jobs.ashbyhq.com` postings. A fabricated equivalent would be a fabrication, not a clone — and
  a job listing invites an application in a way a placeholder testimonial does not.
- **Eyebrow count is `{ROLES.length}`, not a literal.** The one number two parts of the same file
  must agree on; deriving it removes the drift risk entirely.
- **`gsap` DECLINED and `framer-motion` DECLINED.** Both triggers were checked. The carousel is a
  native scroll-snap container — drag, momentum and snap are the browser's — so there is no
  timeline to scrub and no mount/exit to orchestrate. `framer-motion` is also not installed.

**Measurements worth keeping — the three traps**

1. **The role-row rule is an `::after` OVERLAY, not a `border`.** The `<a>` carries
   `--border-bottom-width:1px; --border-style:dashed; --border-color:rgba(168,162,158,0.2)`,
   which reads exactly like a border declaration. Computed `border-bottom` on the element is
   `0px none`; Framer paints it on `::after { inset:0; border-bottom:1px dashed }`, which takes
   no layout space. A real border makes the row 73px instead of 72. Third time this repo has hit
   the same trick (`/product` Blocks 3 and 5).

2. **The hero CTA's SSR variant class is stale — again.** Declared
   `framer-5Atru framer-velzew framer-v-velzew` / `"Primary – Start"`; hydrates to
   `framer-v-q741vz` / `"Primary – End"`. The live-probed bracket offsets are **−28 / −12**,
   *identical* to the numbers `/product` recorded, so `ProductHero.tsx`'s `BracketLeft`/
   `BracketRight` and their hover targets port across with no change. The lesson generalises:
   on this Framer project, treat every `framer-v-*` in a capture as a hypothesis.

3. **The carousel's motion is the opposite of `/product`'s testimonials, and only a live probe
   could say so.** Sampling `scrollLeft` every 250 ms for 30 s untouched returned **one distinct
   value** — no autoplay. It does not loop (8 Next clicks stop at 3109 = 4469 − 1360). Prev is
   edge-disabled at `scrollLeft === 0`; **Next is never disabled**, and at max scroll it simply
   does nothing. Autoplay was checked FIRST, before any click, per the method note `/product`
   Block 6 left behind — there, a click probe misread a "Previous" as two slides because autoplay
   had fired during the wait.

4. **The arrow step: two wrong rules, then measurement picked the right one.** Worth keeping in
   full because the *process* is the lesson, not the answer.

   I read six steps at 1440 and inferred a rule ("accumulate `w+16` while ≤ `clientWidth`"). The
   GALLERY agent refused it and **disproved it in algebra before writing code**: `0→1543` needs
   the run `{0,1,2}` = 1543 accepted while `1543→2569` needs `{3,4,5}` = 1431 rejected, and
   1431 < 1543. I re-probed at three tiers with settle-to-rest to test whether the odd first
   step was a measurement artefact — it is not, it reproduces exactly. Data right, rule wrong.

   The agent shipped its own near-miss rule, then **rescored it honestly against the fuller
   three-tier dataset and reported 10/26 rather than the 5/6 it had claimed under 1440-only
   data.** That number is what triggered the re-decision. I then brute-forced five candidates
   over all 13 transitions at the two snapping tiers:

   ```
   9/13  scrollBy(±clientWidth) + native CSS snap     <- shipped
   7/13  first-not-fully-visible +1
   6/13  first-not-fully-visible
   6/13  the agent's fitted rule
   5/13  my original accumulate rule
   2/13  scrollBy with snapping off
   ```

   **The winner needs no arithmetic at all** — a programmatic scroll on a mandatory-snap
   container is re-snapped to the nearest snap point by the browser, so the native call *is* the
   rule. All the step-computation code was deleted. It also removed the 390 special case.

   Three lessons: **hand agents the observations, not just the derived rule** (a brief with only
   the rule would have shipped it silently); **make them rescore when the dataset grows** (the
   10/26 was the whole re-decision); and **prefer the mechanism to a fit** — the same instinct
   that made drag/momentum/snap exact here made the step exact-ish for free.

   ⚠️ Prev is **not** the mirror of next in the original: one forward click from 0 lands on 1543,
   but returning takes two (`1543→1138→0`, observed at 1024). Theirs, not ours.

   ⚠️ **At 390 nothing snaps, in the target or here.** Track 358px, slides 385–791px; CSS
   scroll-snap lets an oversized snap area rest anywhere in the snapport, so mandatory snapping
   is suppressed. That is why the 390 landings are not snap points. Same cause both sides.

5. **Slide widths are fixed pixels at EVERY tier** — 385/721/389/605/389/389/688/791 × 516.
   Two independent confirmations: the `sizes` attribute lists the same width for all four tiers,
   and the live sweep returns identical arrays at 1600/1440/1024/390. `scrollWidth` is 4469 at
   every width. Consequence for asset sourcing: since each slide is a fixed box with
   `object-fit: cover`, **a substitute photo's intrinsic aspect is irrelevant — only orientation
   matters.** That is what let the photo agent run in parallel with the carousel agent.

6. **The mission heading's colour boundary is not where it looks.** One `<h3>`:
   `Building The Smartest` `<br>` `<span muted>Analyst On Wall Street</span>`. The break IS the
   boundary. Reading it as "…Smartest Analyst / On Wall Street" is the natural misreading.

7. **`id="about™"`** — a trademark glyph in a DOM id, straight from Framer's layer name. Shipped
   as `about`.

8. **The About text container's `data-framer-name` is stale copy from the security page** (a full
   paragraph about zero-trust and end-to-end encryption sits in the attribute). An authoring
   artefact; the rendered text is the careers copy. Ignore layer names on this project.

9. Divider is `width:100%; aspect-ratio:1120` — a hairline sized by ratio, so **1.141px** at 1280
   and scaling with the container. `h-px` is a different thing at every width.

10. The two eyebrow strings are two elements because the original sets them in two faces at two
    line-heights (`Rooftop Mono` 14/1em and Inter 14/130%). Collapsing them to one string would
    lose the measured 8px gap.

**Skills invoked**
`responsive-design`, `ui-ux-pro-max`, `frontend-design` (execution quality only — the fidelity
guard applies), and `verification-before-completion` at the close. `gsap` and `framer-motion`
both checked and declined; see Decisions.

**Open / deferred**
- ✅ *Superseded by the copy pass above:* "the hero and mission copy are rogo's verbatim" is no
  longer true as of 2026-08-12.
- Row index is `muted` on `ink` = **3.85:1, fails AA** (`contrast-check.js`, not estimated). Inherited, not introduced — same class as
  `/product` Blocks 4/5/6. Shipped as measured and flagged; `mark` would be 5.36:1. User's call.
- The three role titles are invented. Does the user actually want to be contacted about them?
- Row hover and carousel-button hover were not observed. Nothing invented beyond focus rings.
- The arrow step rule is verified at 1440 only.
- `Footer.tsx`'s "Company" column has no Careers link. Deliberately not added yet — it is a
  contended file and the change would make it a 4-link column where the other three are 3.
