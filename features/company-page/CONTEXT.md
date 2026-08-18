# Company page — context

Memory for `/company`. Newest day at the top. Decisions and measurements, not narration.

## Current state

**Status:** `review`. **FOUR bands, down from six** — `Investors`/`CompanyTools` and
`Reiteration`/`CompanyCareers` were both deleted on 2026-08-16, and Block 3 has now been rebuilt
**three times**: from a measured tile grid into eight animated cards (2026-08-16), from that grid
into a **sticky card stack** (2026-08-17), and from the stack into a **reel** (2026-08-17, same
day). Types and lint clean.

The reel is one sticky FRAME holding three tracks — the service names, the detail block, the
eight scenes — that slide together on a shared index written as `--reel-i`. **The scenes,
their step maps and the whole process player crossed both rebuilds unaltered:** each scene still
assembles itself in the order its service works, holds, dissolves and repeats while it is live.
Declared as `step={n}` markers in `serviceArt.tsx`, played by one generic timeline in
`ServiceReel.tsx`.

⚠️ **NOT YET LOOKED AT IN A BROWSER, AND THE REEL RAISES THE STAKES ON THAT.** Everything on
2026-08-17 was verified by types, lint and reading only. The numbers most likely to need a human
eye, in order: **`--reel-step`** (56/52/46svh — how much scroll one service costs, the whole
band's pace), **`--reel-detail-h`** (a fixed window that CLIPS a long Hebrew promise), `BEAT`
(0.22s — the pace inside a scene), the 700ms track glide, scene 2's bubble heights (positioned by
calculation, not measurement), **scene 6 on the dark ground** (the one scene with no `Surface`),
and the whole frame at 390px, where it is tallest relative to the viewport. `HOLD` was 4.5s and
is **3s** on the user's call — see the end of the third-pass entry.

⚠️ **ONE OPEN QUESTION, FLAGGED TO THE USER AND UNANSWERED:** scene 2's four chat messages are
the only real prose in `serviceArt.tsx` and they are English in both locales. On /he a Hebrew
customer would have typed Hebrew. If the answer is "translate", they move to
`company.services` in both dictionaries — four keys, and the `Bubble` note goes with them.

✅ **CLOSED 2026-08-17 — the sticky heading hiding under the nav.** The nav's banner returns on
upward scroll, taking the fixed header 70px → 115px, while the heading pinned at `top-24` (96px),
so it cleared the header in one scroll direction only. Fixed by the drafted `--nav-peak-h` token
(`--nav-row-h + 45px`). **The heading no longer pins at all** — it is full-width above the reel
now — but the token outlived it twice: it was `--stack-top` under the stack, and it is
`padding-top` on the reel's sticky wrapper now. Same number, same reason, third home.

⚠️ **Block 3 is no longer a clone of anything and cannot be diffed against the capture.** It is
the one block on this route judged on taste rather than fidelity. Everything else on the page
still holds its measured geometry.

**Next action:** the user looks at Block 3 at 1600 / 1440 / 1024 / 390 in both locales. Then
the two answers that hold `noindex` — the Unit 8200 credential and Block 5's placeholder
photograph. Then the contrast decision below.

**Route:** `/company`, nav `Company` wired to it, footer `About` repointed at it.

**Branch:** none. Built directly on `dev`, at the user's instruction, after
`product-content` was fast-forward merged in.

> ⚠️ **A second Claude session is building `/careers` in this same working tree.**
> `git status` during prep showed its `rogo-careers-2026-08-12.{html,css}` capture sitting
> untracked beside ours. Consequences that outlived prep:
> - **Never `git add -A` here.** Stage only this page's paths, or you commit their
>   in-progress work.
> - `Nav.tsx` is shared: `:107` is Company (ours), `:111` is Careers (theirs). Touch it last
>   and re-read immediately before editing.
> - Block 5's CTA points at `/careers`, which is their route. If it 404s, that is the
>   integration point to check, not a bug in this block.

---

## 2026-08-17 (sixth pass) — the reel, trimmed on sight

Three corrections in a row, all from the user looking at it. Recorded together because they
share a shape: **everything removed here was chrome I added, and everything kept was content.**

**1 · The rail.** *"remove the border and the number from left side"*. A 56px `bone` column
holding `01` over `08` — the reference layout's furniture, and the reel's answer to the
eight-tick rail deleted hours earlier. ⚠️ **THIS BAND HAS NOW REJECTED A POSITION INDICATOR
TWICE, IN TWO FORMS.** It has none, deliberately. **Do not propose a third.**

**2 · The mask was eating the ground.** `reel-window--fade` sat on the art COLUMN, and a mask
applies to its element's own **background** — so `ink` bled to white over ~90px top and bottom
against `bone`, reading as two grey gradient bands rather than as scenes going out of focus.
Split in two: the outer element paints and clips, an inner `absolute inset-0` layer masks and
holds the track. **Generalised: never put a mask on an element that also paints a background.**
The names window was unaffected because it has none of its own — which is why the bug appeared
on one of two identical-looking windows.

**3 · The live name is weight 700.** *"make the title of the card bold when its active"*. The
only bold type on the site, so a deliberate exception rather than drift: in a list of eight
where seven are dimmed, weight is the difference that survives the dimming. A **real instance**
— Discovery is variable with `font-weight: 100 800` declared — so check this if the face is ever
swapped for a static one.

**7 · The caption was sitting on the scene, and the mask was dissolving it.** User:
*"the subheader is behind the card"*, plus *"enhance the ui in the mobile view"*. **Two separate
faults with one shape — both were things I sized as a fraction of a box instead of against the
thing they had to clear.**

- **The caption was an OVERLAY on a panel whose scene fills the whole box.** `absolute start-4
  top-3` over a centred scene sized to the panel's full content area, so it landed on the scene
  at every size — it was never going to work at *any* breakpoint, it was just least visible at
  the widest one. Fixed with a reserved band: `--reel-caption-h` (22/22/24px) is added to the
  panel's block-start padding **and subtracted inside `--reel-scene-max`**, so the scene simply
  starts lower. Costs ~36px of scene width at desktop, nothing at the clamp ceiling.
- **The mask fade was 14% of the window.** At desktop that is ~87px and the live panel's top
  edge sits 90px in, so it looked correct. On a phone the same 14% is ~38px against an overhang
  of only ~21px — **the fade reached past the overhang and started dissolving the live panel's
  own caption**, which is exactly what the screenshot showed. Now
  `--reel-overhang: (art-h − panel-h) / 2`, which is the overhang *by definition*, so the fade
  covers the neighbours and stops where the live panel begins at every viewport height.
  ⚠️ **A percentage looked right at one breakpoint because the two quantities happened to
  coincide there. The correct fade was always a computed length.**

**Mobile also got three fixes of its own:**

- The detail block's `flex-1` spacer is now `tablet:` only. At tablet and up it stops the chips
  floating mid-box; on a phone it opened a **~90px void** between the promise and the chips
  inside a box only 146px tall, so the chips read as belonging to nothing. There the two follow
  each other with a `gap-4`, and `--reel-detail-h` came down 146 → **128**.
- Name rows 40 → **44px**, type 18 → **20px**, `--reel-list-h` 104 → **112**. At 18px the list
  was the quietest thing on a screen it is supposed to lead.
- Re-checked the totals: worst-case promise is 2 lines (48 chars ≈ 45/line at 15px in 318px)
  plus 2 chip rows = 112px in a 128px box. **16px of headroom, and /he is the case to re-check.**

**5 · The live row's dash is `ink`, not the accent** (*"make the dash black"*). ⚠️ **THE SAME
DECISION, MADE TWICE ON THIS BAND.** The stack's 3px card-top rule shipped as the per-card accent
on the argument that eight colours turn the deck edge into an INDEX; the user reversed it to
`ink` the same way. This dash is that rule's descendant and it inherited the mistake. **The
argument that loses both times: the band's claim is that eight services are ONE system, and a
marker that changes colour per service says the opposite in the one place the eye returns to on
every transition.** The accent stays in the scenes and on the focus ring.

**6 · The heading sits closer to the reel** — `mt` 40/48/64 → **16/24/32**. Worth recording *why
that is all it can give*: the frame does not begin where the margin ends. It is centred in a
`min-h-svh` sticky wrapper that also clears `--nav-peak-h`, which is another ~180px at desktop
before any scrolling. The margin was the only part free to move — the centring is what holds the
frame mid-screen for the whole band, and the nav clearance has a hard floor. If it still reads
long, the sticky wrapper's `pt` is next and it cannot go below the nav's peak height.

**4 · The eight pulsing accent dots are gone.** *"remove these colored dots per card, we have to
make the cards simple but looks good"*. `Dot` and the `service-pulse` keyframe deleted.

⚠️ **THE DIAGNOSIS IS THE ONE THAT KILLED `service-step` A DAY EARLIER, AND THAT IS THE POINT
OF WRITING IT DOWN AGAIN: it was decoration wearing the costume of information.** A pulsing dot
promises something is happening *right now*. Nothing was — it pulsed identically on a finished
report, a draft, and a browser window. Every scene already claims liveness in a way that is
actually true (a status chip, a latency figure, a counter that counts); the dot said it a ninth
time and said it falsely. **The band's standing rule, now earned twice: a loop that decorates
chrome will be read as a claim about state. If it is not describing something genuinely
happening to the element it sits on, it does not belong.**

Not a pure deletion — every dot had a label positioned to clear it, so eight labels and three
secondary labels moved back by **8–12 source units** each. The `Typing` indicator SURVIVES but
is now `mock-line` grey rather than `ACCENT`: it was the last coloured dot left once `Dot` went,
and no chat client draws its typing indicator in the brand colour. It stays because, unlike the
live dot, it describes a real state and appears in two scenes rather than all eight. **Scene 5's
three grey browser traffic lights also stay** — they are `mock-line`, they are the window rather
than a claim about it, and they were never coloured.

---

## 2026-08-17 (fifth pass) — the stack becomes a reel

User, with a reference layout (a scroll-driven list of titles beside a media track that slides in
step with it): *"i think this one is better for the 8 services section, we can use this layout
but keep the current cards"*. Second container rebuild of the same day.

**What was checked BEFORE agreeing, and what it decided.** The reference's card is 256 × 384
portrait; the scenes are 440 × 288 landscape product UI with 9px labels, and they cannot survive
at that size. But `Stage` caps a scene at **560px**, and the sticky card's art well **already hit
that cap** — so a 52% art column in a 1280 frame renders every scene at *exactly* the size it had
before. **That single measurement is what made this a container rewrite rather than a redraw of
eight mocks**, and it is why the answer was yes. An earlier suggestion the same day (a fanned
portrait carousel) was declined for the opposite reason.

**What the reel is.** One tall scroller, one sticky frame, three tracks sliding on one index:

| Track | Translates by | Holds |
|---|---|---|
| names | `--reel-item-h` | 8 rows, live one `ink` + a growing accent bar |
| detail | `--reel-detail-h` | the promise and the stack chips |
| art | `--reel-panel-h` | the 8 scenes, live one sharp between two blurred |

`--reel-i` is written on the frame; each track multiplies it by **its own** item height. That is
how three different distances read as one gesture.

**Decisions worth keeping:**

- **`round(progress × 7)`, not `floor`.** With `floor`, service 8 is reachable only in the single
  frame where progress is exactly 1, and the other seven change over on arrival rather than at
  the midpoint. `round` puts the changeover halfway between two services.
- **`--reel-art-h` > `--reel-panel-h` is the entire effect.** The difference is what lets the
  neighbours peek in behind the mask. Equalise them and it becomes a cross-fade.
- **`--reel-scene-max = (--reel-panel-h − 2 × pad) × 1.528`.** `Stage` is *width*-driven, so a
  short viewport shrinks the panel and not the scene, and the scene overflows. Converting the
  panel's height back into a width makes the fit hold **by construction** instead of by four
  hand-checked breakpoints. 1.528 is 440/288 and belongs to `serviceArt.tsx`.
- **`min-height` on the art column, not `height`.** The frame is `items-stretch` and a flex item
  with an explicit height does not stretch, so on a short viewport the art column would stop
  short of the names column and leave a band of white under it.
- **The detail is a THIRD TRACK, not eight absolutely-stacked blocks.** Stacked, all eight
  promises print on top of each other before any `data-state` exists — i.e. with JS off. As a
  track it inherits the same `var(--reel-i, 0)` fallback as everything else. **Generalised: on
  this band, every "only one of these is visible" mechanism has to survive having no JS at all,
  and a track does that for free where a stack of absolutes cannot.**
- **Base state = live, every dimmed state opt-in.** Same reason. With JS off the band renders as
  service 1 at full strength with seven clipped below it.
- **Real `<button>`s, and passed items at 0.15 opacity rather than 0.** The reference hangs
  `onClick` on the `<li>` and marks passed items `pointer-events: none`, so its list is
  keyboard-unreachable and one-way. A control you can still focus is one you must still see.
- **The reel keeps tracking under `prefers-reduced-motion`, cutting instead of gliding.**
  Freezing it would show service 1 forever, which is not a calmer feature, it is a broken one.
  The blur is what goes. The scene timelines are a *separate* decision and are not built at all.

**`flowTop()` IS GONE AND THAT IS THE BIGGEST DELETION.** The stack could not use a card as a
ScrollTrigger `trigger` — `getBoundingClientRect()` on a *stuck* element reports where it is
painted, not where it sits in the document — so every trigger was rebuilt from a hand-rolled
`offsetTop` walk, re-read on `refreshInit`. The reel's scroller is **not** sticky, so
`start: "top top" / end: "bottom bottom"` is honest. ≈180 lines of the band's hardest code went
with it, along with the recede tween and the band's only `scrub:`.

⚠️ **THE LESSON THAT GENERALISES.** Both times this band got harder to reason about, the cause
was the same: *the thing being measured was also the thing being moved.* The fix both times was
to measure something that holds still. Prefer a layout where the trigger and the transform are
different elements.

**`kicker` came back**, as the caption over the live scene — the slot the reference fills with a
location. It had been cut with the templated eyebrow row hours earlier and left unrendered in
both dictionaries. What was wrong with it was the `01 · KICKER` arrangement, not the sentence,
and a **sourced** Hebrew line is a better tenant for that slot than an invented one.

**A position indicator came back and then went again inside a minute.** The frame opened with a
56px `bone` rail down its inline start holding `01` over `08` — the reference layout's furniture,
and the reel's answer to the eight-tick rail deleted hours earlier. User, on first sight:
*"remove the border and the number from left side"*. ⚠️ **THIS BAND HAS NOW REJECTED A POSITION
INDICATOR TWICE, IN TWO DIFFERENT FORMS**, so the pattern is the point rather than the execution:
eight coloured ticks and two digits in a rule both read as chrome to this user, and the band is
back to saying nothing about which of eight you are on. Accepted knowingly — the name list
carries a rough sense of position on its own. **Do not propose a third form.**

⚠️ **AND THE FIRST SCREENSHOT CAUGHT A REAL BUG: THE MASK WAS EATING THE GROUND.**
`reel-window--fade` sat on the art COLUMN, and a mask applies to the element it is set on
**including that element's own background** — so the `ink` ground bled to white over ~90px top
and bottom against `bone`, reading as two grey gradient bands rather than as scenes going out of
focus. Fixed by splitting the column in two: the outer element paints and clips, an inner
`absolute inset-0` layer carries the mask and holds the track. **Generalised: never put a mask
on an element that also paints a background.** The names window was unaffected because it has no
background of its own — which is exactly why the bug only showed on one of the two.

**Deleted:** `ServiceStack.tsx`, `.service-stack` and its four `--stack-*` numbers, the sticky
`<li>` deck, `isolate` on the list, the recede, the 3px top rule, the one-shot text entrance
(the copy changes on every index now, so there is nothing for a once-only stagger to attach to).

**Untouched:** `serviceArt.tsx`, all eight scenes, all eight step maps, the accent tuple, the
stack chips, `SERVICE_STACKS`, both dictionaries. `data-service-card` is kept on the panels as a
**fossil** — it is what `globals.css`'s `[data-service-card][data-idle] *` gate selects on.

**Still open from before, unchanged:** scene 2's English chat prose on /he; seven of eight
`SERVICE_STACKS` rows are invented; `serviceGlyphs.tsx` is unreferenced;
`src/components/clix/ClixHero.tsx:190` still fails `react-hooks/refs` (pre-existing, not this
band — `eslint src/` will not pass until it is dealt with).

---

## 2026-08-17 — Block 3 becomes a sticky stack, and the scenes stop being skeletons

User: *"make it like scroll animation, only 1 service per scroll, give it like modern and better
looking UI and animation"*, then mid-build: *"can you add more to it, rather than just some
skeleton UI?"* Two distinct changes; the second reversed a rule the first only exposed.

### The mechanic — sticky stack, not a pin

Each `<li>` is `position: sticky` at `--stack-top + i × --stack-peek`; a later sibling paints
over an earlier one, so the next card simply covers the last. **The stacking is CSS and survives
the client component being removed** — that is the JS-off floor.

Rejected, with reasons, before building: a **pinned stage + scrubbed cross-fade** (the most
literal "one per scroll", but it is scroll-jacking — locks the viewport, has to be disabled on
touch) and a **pinned horizontal track** (the track direction has to flip on /he).

**Measurements that were decided rather than found:**

- `--stack-travel` = `24 / 18 / 14 svh`. The card's own height already supplies most of the
  travel; total per card ≈ `card height + travel − peek` ≈ **836px at desktop**, about one
  deliberate trackpad flick. **This is the knob to turn if the band feels long.**
- `--stack-card-h` = `clamp(440, 100svh − stack-top − 7×peek − 24, 620)`. Viewport-bounded
  because a stuck card taller than the viewport can never be seen whole; the `7 × peek` term
  reserves the deck so card 8 fits as well as card 1. `svh`, not `vh` — the mobile URL bar.
- `--stack-peek` = 8 / 6px. Small enough to read as a deck edge, not as a fan.

### Three things that cost real thought

1. ⚠️ **ScrollTrigger CANNOT measure a sticky element.** It resolves start/end from
   `getBoundingClientRect()`, which for a stuck card reports where it is *painted* — pinned at
   `--stack-top` — not where it sits in the document. Every trigger therefore uses the wrapper
   plus numeric start/end built from a `flowTop()` that walks `offsetTop`, which is a **layout**
   position and immune to sticky. Re-read on `refreshInit`, **not** `onRefresh`: the latter
   fires after start/end are evaluated, which is too late. This is the repo's first `scrub:`;
   `pin:` still appears nowhere and should stay that way.
2. ⚠️ **`gap` + `padding-bottom` on the `<ol>`, never `margin-bottom` on the `<li>`.** A block
   container's last child collapses its bottom margin out through the parent, so card 8 would
   have had no dwell. Flex gap does not collapse.
3. ⚠️ **The animation gate is opt-OUT.** `[data-idle]` pauses; the attribute is written by JS,
   so with JS off or pre-hydration every scene animates as it did before. Opt-in would have
   frozen all eight for a no-JS visitor. Live window is **two** cards — the arriving one is
   visibly sliding up and freezing it mid-entry looks broken. ~35 of ~40 loops now idle.

### The scenes — the grey-bar rule, reversed

The original rule (everything sentence-shaped → a grey `Bar`, so the scenes need no Hebrew) held
at 304px, where a bar read as *a sentence, deliberately blurred*. At ~680px it reads as **a page
still loading**. The goal was never wrong; the assumption under it was — **a real product UI is
mostly not prose.** It is names, statuses, counts, IDs, filenames and code: machine content,
Latin in every locale, redacted for no benefit.

All eight redrawn against a **440 × 288** source box (was 280 × 168). Highlights: scene 7 now
carries **real TypeScript, and it is scene 4's workflow written out** — the same webhook, parse,
CRM upsert and Slack post, so the two scenes are one system seen from both ends, which is the
band's own argument. Scene 1 gained a stat strip; scene 3's four bar-lengths became four named
pipeline stages; scene 8's five scores got their area names back.

**Still zero new dictionary keys.** Two exceptions, both deliberate:

- Scene 2's four chat messages are genuine prose, English in both locales — **open question,
  flagged to the user.**
- Scene 5's headline is still two bars, and there it is *correct*: a headline in a page
  thumbnail, surrounded by real labels. Bars are fine as the minority; they were never fine as
  the default.

New primitives: `Surface` (shadowed, replacing the flat `Panel`, deleted), `Chip`, `Metric`,
`Avatar`, `Rule`, `ColLabel`, `Bubble`. The migration briefly ran both source boxes with
`Stage`/`Header` defaulting to the old one; that scaffolding is gone.

⚠️ **One bug this cost:** every primitive is absolute against its *nearest positioned ancestor*,
so a `Metric` written beside a strip instead of inside it resolved against the `Surface` and
landed in the header. Nest.

### One elevation cue per card (correction, same day)

User on sight: *"why is there hover stage for each card? its redundant"*. There was no hover
state — `CARD_HOVER` had already gone — but the instinct was right about something real:
**two elevation cues were nested inside each other.** The card carries `--shadow-float`
(`0 16px 40px −12px / 0.16`) and `Surface` shipped with the same two-part shape at the same
alpha, so every card was a floating white bordered box holding another floating white bordered
box. Three separators from the ground where one does the job.

Resolved by asking which shadow does WORK: **the card's does** — in a stack it is what separates
the live card from the receded one behind it. `Surface` is content *inside* that card with
nothing to float above, so it is back to a hairline plus a 1px contact shadow, which is how it
read at 304px for a day without anyone calling it a wireframe. Same correction applied in scene
6, which has no `Surface`: the handset keeps a softened shadow (it is a physical object), and
the push card dropped to a contact shadow — it sits *beside* the handset, and `RISE` is what
says "just arrived", not elevation.

⚠️ **THE RULE, FOR THE NEXT SCENE: one elevation cue per card, and the card owns it.** Anything
inside separates by hairline and value.

### The travelling row highlight deleted, and the cards given something to say

User, after seeing it: *"for each presentation card, they have this hover animation in their
illustration"* → *"remove it and improve all the cards, give more life to it, right now its
still looking ai slop"*.

**`service-step` is gone — 31 instances, the band's workhorse loop.** It painted a soft accent
wash across one row at a time to mean "the system is working through a list". It meant
"your mouse is here": ⚠️ **a tinted band across a table row is the universal signifier for hover
or selection**, so all eight scenes looked like they had a cursor in them that nobody was moving.

⚠️ **THE RULE THIS BOUGHT: a loop that paints a row CONTAINER borrows a UI state and will always
be misread as one.** Motion that reads as "live" has to happen to the CONTENT and has to be
something the depicted product genuinely does. Replacements, both behaviour-specific:

- `service-typing` — the three dots of a typing indicator. Scene 1's composing agent, and a
  bubble at the foot of scene 2's thread. (Scene 2's messages were retimed to free the ~11px:
  message 3 lost its timestamp, which is also what a real client does on a quick follow-up.)
- `service-caret` — a blinking cursor at end-of-file in scene 7's editor. `step-end`: a caret
  does not fade.
- A live `Dot` added to scenes 4, 5, 6 and 8, which were left with only their `RISE` after the
  deletion. Every scene now has at least two moving parts; loop count is down ~40 → ~12.

This **costs the "one shared keyframe across all eight" argument** the band was designed around
(recorded in globals.css) — the scenes no longer share one motion vocabulary. Worth it.

### "Still looking ai slop" — what was actually wrong with the card

Icon → eyebrow → big title → one line → picture is the most templated shape a SaaS card can
take, and in a 620px-tall box roughly a fifth of it was type. Four changes, in order of effect:

1. **`SERVICE_STACKS`, the fifth positional tuple.** 3–4 chips per card naming what the service
   is built on (`HubSpot · Salesforce · Pipedrive`, `TypeScript · Postgres · AWS · CI/CD`),
   pinned to the foot of the text column by a spacer that only expands at ≥810. Fills the dead
   space with the one thing a reader actually wants — what they would be buying. Tokens, not
   sentences, so still **zero dictionary keys**; `dir="ltr"` on the row for /he.
   ⚠️ **I INVENTED THESE FROM THE SERVICE DESCRIPTIONS — nobody has confirmed clix ships
   Pipedrive or Postgres. Flagged to the user; placeholder until they say otherwise.**
2. **The art column got a ground** — a 5% accent tint over `bone`, hairline, padded. A white
   `Surface` centred on a white card was a picture floating in nothing, and that was half of
   why the right side read as unfinished. It also makes the mock read as a screen.
3. **A 3px accent rule along the card's top edge**, replacing a bottom radial wash that cost the
   same and said nothing. ⚠️ **This is the deck**: cards rest `--stack-peek` apart, so the top
   6–8px of every card under the live one stays visible, and the stack's edge becomes a colour
   index of where you are and how much is left.
4. **The mark sits in a 40px square accent tile.** A bare stroke icon beside 12px type gave the
   column no weight to start from. Square, because `--radius-none` is this site's default and a
   rounded tile would be the one rounded thing on the band.

### Reversals to log

- **`CARD_HOVER` deleted.** `hover:z-10` fights a stack whose whole mechanism is source order.
- **"Cards grow, they do not clip" reversed.** A stuck card must fit the viewport, so it is
  fixed-height; the give moved to the text column's width (`basis-[42%]` / `[38%]`). **This is
  where /he can bite** — check a long `promise` when copy changes.
- **The sticky heading column deleted**, but `--nav-peak-h` outlived it as `--stack-top`.

**Verified:** `npm run build` clean, `eslint` clean on all three changed components, all eight
scenes' new strings present in the prerendered `/company` HTML and the card/tick counts correct
on `/he` too. **Not** verified in a browser — see Current state.

### The scenes stop being stills — each one now plays its process

User: *"i want some movements per cards, for example like the process for the service, its like
the presentation, i want it to look good and modern and smooth"*. Two choices taken with them
before building, both by AskUserQuestion:

| | Chosen | Rejected, and why |
|---|---|---|
| Playback | **plays itself on arrival**, ~2.5s | *scrubbed to scroll* — a strong "presentation" read, but the pace becomes whatever the visitor's wheel does and a fast flick skips it entirely |
| While live | **the whole process loops** (~7s cycle) | *settle after one play* — the user asked for the loop explicitly ("loop all") after being shown the nagging risk |

**The architecture, and the decision underneath it:** the choreography is declared **as data in
the scenes** (`step={n}` on a primitive) and played by **one generic timeline** in
`ServiceStack.tsx`. Three beats — reveal, `count`, `Track` fill — cover all eight scenes, and
there is no per-scene JavaScript anywhere. The alternative, eight hand-written timelines, would
have been eight things to retune every time a scene is redrawn, and would have put the order of
a service's steps in a different file from the drawing of them.

**Measured/decided values** (all in `ServiceStack.tsx`, all knobs):

- `LEAD 0.3s` · `BEAT 0.22s` · `HOLD 4.5s` · reveal `0.5s` / fill `0.7s` / count `0.9s`.
- Cycle length **7.3s (scene 5, six beats) → 8.1s (scene 7, ten beats)**. Step *numbers* are
  ranked, not used as raw multipliers, so a scene that skips a number does not open with dead
  air and an eleven-beat scene runs at the same pace as a seven-beat one.
- Marker counts in the prerendered HTML: **70 `data-step`, 9 `data-fill`, 15 `data-count`**,
  identical on `/company` and `/he`.

**Three things that were not obvious:**

1. ⚠️ **The loop had to end with a dissolve.** A repeating timeline jumps from its last frame
   straight to time 0, where every `from()` renders its start — so the finished scene vanishes
   in one frame and rebuilds. A 0.45s fade of the *marked* elements only (the chrome never
   leaves) puts the cut where nothing is happening. Reads as a window whose contents reload.
2. ⚠️ **A parked card must be seeked to `rest`, not to `progress(1)`.** Because the cycle ends
   faded out, parking at the end would leave every off-screen card blank — and a covered card
   is still visible as a `--stack-peek` sliver and comes back whole on the way up.
3. ⚠️ **The loop point is settled from `onRepeat`, not left to render order.** Two tweens write
   `opacity` on the same elements (the reveal's `from` at the head, the fade's `to` at the
   tail). It resolves correctly on today's GSAP — a repeat wrap is a backward render, children
   go in reverse, so the reveal's start state lands last — but that is a detail of the engine
   rather than a promise. `onRepeat` fires after the wrap and cannot be reordered.

**The rule that came out of the CSS-animation conflict:** *never put a `step` on a node that
carries a CSS animation.* A CSS animation beats an inline style in the cascade, so the beat's
opacity and transform are silently swallowed and the element appears to ignore its place in the
sequence. Mark the container instead — which is why scene 6's push card gained a bare wrapper.
`count` is exempt because it writes `textContent` and not style, so it shares a node with
`RISE` happily (scene 8's `78`).

**Reversal, and it is a real one: bars grow now.** Scenes 3 and 8 both carried *"every bar sits
at its measured length at rest — never a bar growing"*, because a growing bar is a `scaleX`, a
`scaleX` needs a `transform-origin`, and an origin is the one thing on this band that does not
mirror for free under RTL. **That reasoning was about CSS keyframes, which cannot know which way
the document reads.** A GSAP tween can — `documentElement.dir` is one line — so `FILL_ORIGIN`
picks the origin per locale and the objection disappears. The CSS-side prohibition in
`globals.css` and `serviceArt.tsx` **stands unchanged**; `ServiceStack.tsx` is the one place
with the information to be exempt from it, and it says so at the top.

**Two scenes deliberately start at their content, not their frame.** The browser window (5) and
the handset (6) carry no `step` at all: a window that faded in around its own page would be
animating the wrong noun. The frame stays and the content loads — which is what both of those
products actually do.

**Also decided: the process loops, the copy does not.** `[data-card-rise]` — the card's heading,
promise and capability chips — keeps its one-shot entrance and is deliberately not in the
repeating timeline. Re-animating prose every seven seconds beside copy someone is reading is
the failure mode this band has already been caught on once.

**Structural side-effects, both small and both deliberate:** `Header`'s children now NEST inside
its band rather than being siblings of it (positionally identical — same origin, same trailing
edge — but it makes the strip one node, so one `step` reveals a header as a unit); and `Track`
replaces the groove+fill `Box` pair that scenes 3 and 8 each drew by hand.

#### Same day: the white flash on card entry — a regression the dark ground exposed

User: *"why is there a white flash whenever a card enters?"* **The art column carried
`data-card-rise`**, so the whole art well faded up from `opacity: 0` alongside the card's text.

⚠️ **NOTHING ABOUT THAT TWEEN CHANGED — THE GROUND DID.** While the well was a 5% accent tint
over `bone`, fading it in was fading white into near-white and cost nothing. The moment it
became `ink`, the identical tween became a 0.6s white flash on every entry, because **an element
at `opacity: 0` shows whatever is behind it, and behind it is the card's `bg-white`.**

**The lesson worth keeping: a fade-in is only invisible at its start if the element's rest state
is close to what it sits on.** Change a background and every `opacity: 0` tween on top of it
becomes a different animation. Nothing flagged this — build, lint and SSR grep all pass a white
flash without comment; it is only visible.

Fixed by removing `data-card-rise` from the column, which is also the correct design and the
rule the scenes already follow: **the column is the ROOM the scene sits in — chrome, not
content.** The browser window in scene 5 and the handset in scene 6 carry no `step` for exactly
the same reason. The frame arrives with the card; the scene assembles inside it. `data-card-rise`
now marks only the name, the promise and the chips row.

#### Same day: the progress rail removed too — the band now has no position indicator

User, minutes after the eyebrow row went: *"remove this"*, pointing at the eight-tick rail above
the stack.

⚠️ **THE TWO REMOVALS INTERACT, AND THE COST IS REAL.** The rail was the ARGUMENT for deleting
the card's printed `01` — a rail *tracks*, a static number on card one does not. With both gone,
**nothing on this band says which of eight you are on or how many are left.** The deck edge
(`--stack-peek` slivers under the live card) carries a rough sense of depth and that is all.
Accepted knowingly: the user has now seen both and judged the chrome worse than the ambiguity,
on a band whose whole claim is "one system" rather than "a stepper".

**Kept on purpose: `ServiceStack` still computes the index and still writes `data-active` on
each card.** It is free — `data-idle` needs the same index for the animation gate — and it means
a rail, a counter, or anything keyed to "which card is live" can be re-hung with MARKUP ALONE.
Noted in the file so nobody deletes it as dead code.

If a rail ever returns: colour and opacity only, never a `scaleX` fill — a growing bar needs a
`transform-origin`, the one thing on this band that does not mirror for free under RTL.

#### Same day: the eyebrow row deleted — "ai slop", second time of asking

User, pointing at the icon tile + `01 · TO SPEED UP SALES AND SUPPORT`: *"remove these part of
the cards, it looks ai slop"*. Removed whole — mark, number and kicker.

⚠️ **This is the SECOND time this row has been caught, and the first fix treated the symptom.**
Hours earlier the complaint was the same words, and the answer was to mount the bare stroke icon
in a tinted square tile so the column had something to start from. **The problem was never how
the mark was mounted.** A mark in a tinted square, beside a number, beside an all-caps eyebrow,
above a big title, above one line of copy, beside a picture is not *a* templated SaaS card — it
is THE templated SaaS card. The row had to go, not get better furniture.

**Nothing was lost with it, which is why it went cleanly:** the NUMBER is what the tick rail
above the stack is for, and the rail actually *tracks* — a static `01` printed on card one never
told anyone where they were. The KICKER restated the promise two lines below itself. The MARK
was a generic glyph beside a 680px picture of the real thing.

**Consequences:**

- ⚠️ **`serviceGlyphs.tsx` is now unreferenced by this band** — nothing renders it. Left on disk
  because it is the only copy of those eight marks; `SERVICE_GLYPHS` and the
  `EYEBROW_CLASS`/`EYEBROW_STYLE` imports from `CompanyMission` are gone from this file.
- ⚠️ **`company.services.cards[i].kicker` is now unrendered on this route but still in both
  dictionaries.** Deliberately not deleted: the Hebrew ones are SOURCED verbatim from the real
  company site, so they are evidence, and a key nothing reads costs nothing. Anyone auditing
  dictionary coverage will find eight orphans — this is why.
- The positional tuples are still four, by coincidence: `SERVICE_GLYPHS` left the same day
  `SERVICE_STACKS` arrived.

#### Same day, two small corrections from the user

- **The CRM card's capability chips are the ONLY confirmed row.** `HubSpot · Salesforce ·
  Pipedrive` → **`Monday · Notion · Airtable`**, named by the user. The other seven rows of
  `SERVICE_STACKS` are still the placeholders invented from the service descriptions.
  Flagged as contradicting scene 2, then fixed on the user's follow-up (*"change also this part
  in the crm card"*): the assistant's reply became *"Yes — Monday, Notion and Airtable. Want a
  demo?"*, **and its footer went with it** — `Lead created in HubSpot` → `in Monday`. The footer
  was not named in the ask, but it is the OUTCOME OF THAT SAME CONVERSATION two rows below the
  bubble, so leaving it would have shipped a card that contradicts itself in one glance.
  ⚠️ **One mention deliberately left: the Integrations card's `HubSpot` node** (scene 4,
  `Create contact + deal`). Different card, and it DEPICTS a workflow talking to a CRM rather
  than claiming a product line — the distinction that made the chat reply wrong and this not
  automatically so. Raise it with the user if the band is ever audited for consistency.
  Bubble geometry unchanged: the new string is 46 chars against 51, still two lines at `w=236`,
  so the hand-measured `h: 53` and everything positioned below it still hold.
- **The card's 3px top rule went `accent` → `ink`.** User: *"only put black to the top of each
  card, right now it has different color"*. It was the accent on the argument that eight colours
  turn the deck edge into an INDEX — where you are, how much is left. Real argument, and it lost
  to a simpler one: **eight coloured slivers stacked at the top of the viewport read as eight
  unrelated cards, and the band's whole claim is that they are one system.** One black edge reads
  as one deck seen side-on. The accent stays on the glyph tile, the chips and every scene.

#### Same day, on sight: the hold was too long and the ground too pale

User: *"why arent they looping after the animation? maybe after 3 seconds it should redo the
animation"* — **and the loop was not broken, it was slow.** `HOLD` shipped at 4.5s, which put
the full cycle at ~7.5s: long enough that nobody sits through it to find out whether a second
pass arrives. ⚠️ **A loop nobody waits long enough to see is indistinguishable from no loop.**
`HOLD` is now **3s** (cycle ~6s), which is the number the user named.

Hardened at the same time, because the report was impossible to tell apart from a real bug: the
scene trigger moved from one `onToggle` to **`onEnter`/`onEnterBack`/`onLeave`/`onLeaveBack`
plus an `onRefresh` kick.** `onToggle` fires on any `isActive` change *including one produced
by a refresh*, and this band refreshes on every load when `document.fonts.ready` resolves. A
refresh landing while a card was live could call the inactive branch and PARK a timeline that
should be looping — presenting as "it played once and stopped". The four direction callbacks
fire only on a real scroll crossing; `onRefresh` covers the one case they cannot (a page that
loads with a card already in range), guarded on the scene not existing yet.

**The art column's ground went dark.** User: *"try putting black or the same bg from security to
the border of each card"*. It is now `--color-ink` (#151515) — **/security's own ground**, so
this borrows a value the site already owns rather than inventing a dark. It replaces the 5%
accent tint over `bone` that shipped hours earlier: that fixed the original defect (a white
panel on a white card is a picture floating in nothing) but only just, because bone against
white is a value step of a few percent. The white `Surface` inside now reads as a lit screen in
a dark room. The card's accent is untouched — the 3px top rule, the glyph tile, the chips and
everything inside the scene still carry it; the colour simply stopped having to also be the
thing that separates art from card.

⚠️ **Scene 6 (Mobile) is the one to look at hardest under this.** It is the only scene with no
`Surface` — the handset and its four side cards sit directly on the ground — so it is the only
one where the change is not "white panel on dark" but "objects floating on dark". Its handset
shadow (`rgb(21 21 21 / .1)`) and its `border-ink/20` handset edge are both now invisible.

**Verified:** `tsc --noEmit` clean, `eslint` clean on `src/components/company/`,
`npm run build` clean, marker counts confirmed identical in both locales' prerendered HTML.
**Not** verified in a browser — see Current state. `BEAT` and `HOLD` are the two numbers most
likely to want turning once it has been watched.

---

## 2026-08-16 (fourth pass) — the careers band deleted, and the nav's locale switch

### Block 5 removed whole

User: *"remove this part in company"* over the "Join The Team Building / What Comes Next"
heading and paragraph. Taken as the **whole band**, not just the text: the copy is what
identified the block, and the full-bleed photograph beneath it under no heading would be a
different block rather than a smaller one. `CompanyCareers.tsx` deleted; `company.careers` (4
keys) out of both dictionaries; import and render out of `CompanyRoute`.

Hebrew SOURCED tally **34/47 → 30/39** — all four Hebrew careers strings were AUTHORED, so no
captured text was lost.

⚠️ **`public/company/company-bg.jpg` IS STILL ON DISK, REFERENCED BY NOTHING** (167 KB). Left
deliberately: it was supplied by the user on 2026-08-12 after both stock sources refused an
automated fetch, and deleting a user-supplied asset is its own decision, not a tidy-up.

⚠️ **ONE OF THE TWO `noindex` GATE ITEMS CLEARED AS A SIDE EFFECT, NOT BY DECISION.** That
photograph was stock standing in for a picture of clix's team that does not exist — gate item 2
in `CompanyRoute.tsx`'s header. It is gone, so only the unsubstantiated "Unit 8200 and Technion
alumni" line remains. **The guard is untouched and nobody has been asked whether it should
lift.** The route header now says so explicitly, so the next reader does not mistake a side
effect for a resolved question.

### The nav's locale switch removed — SITEWIDE, not just here

User: *"remove this translate button"*. `LocaleToggle` was rendered at three call sites in
`Nav.tsx` (the compact header beside the burger, the mobile panel, and the ≥1200 header); all
three and the import are gone, and `src/components/ui/LocaleToggle.tsx` is deleted.

⚠️ **THIS IS NOT A /company CHANGE. `Nav.tsx` is shared by every route**, so `/he/*` still
builds and still serves but now has **no link to it from anywhere in the UI**. The Hebrew
dictionaries, the `he/` route group, `HTML_LANG`, `LOCALE_LABEL` and every RTL mechanism are all
untouched — only the entry point went. Reaching Hebrew now means typing the URL.

Two prose comments cited the deleted file for reasoning that is still true, so the reasoning was
**restated in place rather than left pointing at nothing**:
- `src/app/(en)/layout.tsx` — why crossing the root-layout boundary must be a hard document
  load (`<html dir>` flips; a crossfade would be a full-width horizontal jump, and a hard load
  rebuilds every GSAP timeline, which is what lets `useDirSign()` be stable for a mount).
- `src/lib/i18n/config.ts` — why there is no middleware. That argument was written in the plural
  because `LocaleToggle` was the second `usePathname()` consumer; it now names
  `ViewTransitions.tsx` alone and records that a re-added switch would hit the same hazard.
- `LOCALE_LABEL`'s comment now carries the G81 accessibility argument itself (labels written in
  their own language, never an English `aria-label` over them) and flags that nothing renders it.

### Not done in this pass

- ⚠️ **The sticky-heading-under-the-nav bug is still open** (see Current state above). A
  `--nav-peak-h` fix was drafted and not applied.
- The hover-scale bump 2.5% → 4% was rejected earlier and stays rejected.
- Tailwind scanning `docs/reference/clixsolutions/pages/*.html` — still open, still deliberate.

---

## 2026-08-16 (third pass) — two bugs the user caught, and the panel reverted

Three round trips on the same band, all of them corrections to the second pass.

### 1 — "the header doesnt moves while scrolling"

⚠️ **`overflow-hidden` ON THE `<section>` WAS KILLING `position: sticky`, AND IT HAD BEEN THERE
ALL ALONG** — inherited from the capture, kept verbatim through the rebuild. An ancestor with
`overflow: hidden` becomes the sticky element's scroll container, so the heading pinned to a box
that scrolls away with the page.

⚠️ **THE SYMPTOM WAS ACTIVELY MISLEADING.** `StickyLift`'s observer watched the sentinel, not the
element, so it still fired on cue and the white panel still appeared — it just slid up under the
nav with everything else. The band looked like it had a working lift and a broken pin; it had
neither.

Fixed by removing the clip. Nothing needed it: a hovered card's 2.5% scale overhangs ~4px into
a 40px gutter, so no horizontal page scroll is possible either way, and removing it also stopped
`shadow-float` being cut off at the band edge.

**Verified over CDP** (headless Chrome, raw WebSocket — node 24 has one built in, so no
puppeteer): `position: sticky`, panel top locked at **96px** across scrollY 1771 → 2611 while
card 1's top ran **−4 → −844**.

### 2 — "hover is not good yet it overlaps"

A hovered card in the band's top row painted straight across the fixed nav. Cause:
`hover:z-10` on the card vs the nav's `z-[3]` (Nav.tsx:438), both in the ROOT stacking context.
`z-10` on a grid item was meant to solve a purely local problem — grid items paint in source
order, so a scaling card grows *under* its neighbours without it — but it was competing site-wide.

Fixed with **`isolation: isolate` on the `<ul>`**: the z-order still works between cards, and the
whole list sits at `z-auto` in the root context, below the nav. The two go together; neither
works alone.

⚠️ **THE FIRST TWO ATTEMPTS TO VERIFY THIS BOTH GAVE FALSE READINGS, and both traps are this
site's own behaviour:**

1. **`scroll-behavior: smooth` is set globally**, so `window.scrollTo` ANIMATES. Every rect read
   after it was sampled mid-flight, and the synthetic mouse event landed on empty space. Fix:
   force `scroll-behavior: auto` for the probe and spin on `requestAnimationFrame` until
   `scrollY` is stable for three frames.
2. **The nav's banner is direction-aware and retracts ~300ms after a downward scroll**, so the
   header's height changes *after* the scroll settles — 115px → 70px. A probe point computed
   from the pre-retraction rect fell BELOW the header, and `elementsFromPoint` then reported the
   card on top when the header simply was not there. This produced a confident "❌ CARD PAINTS
   OVER THE NAV" against a build that was already fixed. Fix: wait 1200ms for the banner, then
   measure the header rect, then probe its vertical centre.

**Rule worth keeping: on this site, never measure immediately after a programmatic scroll.**
Two independent animations have to settle first, and neither is yours.

Final reading, hovered: `hero-nav-blur → HEADER → LI` — the nav is above the card.

### 3 — "remove this effect when scrolling down"

The pinned white panel, reverted on sight. The PIN stays; only the treatment went.

- **`StickyLift.tsx` deleted.** With nothing to toggle, its sentinel and IntersectionObserver
  bought nothing — and **the band is a pure server component again, with no client JS at all**,
  which is where it started.
- **`desktop:p-6` and the `-mt-6 -ms-6` that compensated for it, both removed.** They existed
  only to give the panel breathing room. Their removal also restored the alignment they were
  designed to fake: measured, the heading and card 1 now sit level at exactly 531.
- `shadow-float` stays in `globals.css`; the card hover still uses it. The `--color-svc-*`
  accents are untouched.

⚠️ **A hover-scale bump from 2.5% to 4% was proposed and the user rejected it mid-edit.** The
scale stays at **1.025**. Do not "finish" that change.

### Left as-is

The mangled triple-apostrophe sequences that an earlier shell-escaped edit wrote into two comments were
cleaned up in this pass. The Tailwind-scanning-the-captures finding from the second pass is
still open and still deliberately untouched.

---

## 2026-08-16 (second pass) — colour, a floating heading, a card hover

User, after seeing the band: *"okay i like it, add some colors and make the header floats when
floating, and when hovering to a card, make it bigger add a hover animation that is good"*.

Asked before building, because two of the three are decisions the user owns: how much colour
(one accent per card vs four families vs one band-wide accent — **per card** chosen), and which
header "floats" (the section heading when pinned vs always vs the site nav — **when pinned**
chosen).

### Colour — eight accents, and the argument for them

⚠️ **THIS IS THE FIRST COLOUR ON THIS SITE THAT WAS CHOSEN RATHER THAN MEASURED**, and it
breaks — narrowly, and on purpose — two rules DESIGN-SYSTEM.md states: the monochrome rule, and
`forest` being the one brand colour and belonging to /clix. Both still hold everywhere else;
nothing here is used off this band. `serviceGlyphs.tsx`'s own header records `forest` being
rejected for this band in August on the grounds that it would "spend it somewhere it was never
measured" — that objection died with the clone.

The values, the contrast table and the usage rule are in DESIGN-SYSTEM.md. Two things worth
repeating here because they are what took the time:

- **They are a SET.** All eight sit between 6.07 and 6.81:1 on white — a 0.74 spread. The first
  pass ran 5.35 (green) to 7.58 (indigo) and the indigo card visibly dominated the grid; the
  fix was to darken the green and lighten the indigo and violet until the band closed.
- **Checked against three grounds, not one** — white (the card), `bone` (the band) and
  `mock-panel` (a scene's interior). Worst case 5.43:1. That matters because the accents carry
  real type inside the scenes, not just dots.

Mechanism: `CompanyServices` sets `--accent` on each `<li>`; `serviceArt.tsx` reads
`var(--accent, var(--color-ink))`. **No scene knows which colour it got**, and one rendered
outside a card falls back to the monochrome version it was built as.

### The floating heading — three things that were wrong first

`StickyLift.tsx`, a client component that wraps server-rendered `children`. Only the observer
ships; no dictionary string crosses the boundary.

1. ⚠️ **THE SENTINEL CANNOT BE A SIBLING OF THE STICKY ELEMENT.** First cut rendered it as a
   preceding sibling — inside a `flex-row` that makes it a third flex item taking a share of the
   row. It has to live inside a wrapper, which is why the heading column is now two boxes.
2. ⚠️ **`desktop:items-start` ON THE CONTAINER MADE THE HEADING NEVER PIN.** Caught in the build
   check, not by eye. A stretched wrapper is what gives the sticky child its travel;
   `items-start` collapses it to content height and sticky has nowhere to go. The band had
   carried `items-start` since the first pass, where the sticky element WAS the flex item and
   needed `self-start` — the exact opposite requirement. Both are now gone.
3. ⚠️ **PADDING CANNOT BE PART OF THE PINNED STATE.** First cut went `p-0` → `p-8` on pin, which
   (a) shifted the headline 32px sideways every time it pinned and (b) animated a LAYOUT
   property, reflowing the sticky box on every frame of the transition. Now the padding is
   constant at 24px and the wrapper is pulled back `-mt-6 -ms-6`, so the h2 sits exactly where
   it always did and only colour and shadow change. 24px rather than 32 so the panel still
   clears the viewport edge at exactly 1200px wide.

### The card hover

`scale(1.025)` + 4px lift + `shadow-float` + an accent radial wash from the bottom edge; mark
and number tint to the accent; the scene leans in 1.5%. 400ms on `--ease-rogo`.

- ⚠️ **`hover:z-10` is not optional** — grid items paint in source order, so a scaling card
  without it grows *under* its neighbours on two edges. Only the last card in a row looked right.
- ⚠️ **Everything moves by `transform`, nothing by layout.** Not just for smoothness: each scene
  is a **container query**, so a real width change would re-resolve `--u` on every frame of the
  transition and the artwork would visibly re-flow inside the card.
- 400ms is a judgement against the site's 300ms link preset — 300 reads snatched on a 400px
  card. The curve is unchanged.
- Every `hover:` has a `focus-within:` twin, and `motion-reduce` cancels the transform itself
  rather than only its transition (a scaled card with no transition is a jump).

### Found while verifying, NOT fixed

⚠️ **Tailwind is scanning `docs/reference/clixsolutions/pages/*.html` and generating utilities
for classes that appear only there.** The captured pages are a Tailwind site, so the production
bundle carries rules for class names no component uses — `hover:shadow-[0_34px_66px_-30px_
color-mix(in_srgb,var(--accent)_30%,transparent)]` and friends, which is also where the name
`--accent` collides (harmlessly — those rules only match elements carrying those exact class
names, and nothing in `src/` does). Pre-existing since the captures landed 2026-08-11, sitewide,
and the fix is a `@source not` line in globals.css. **Left alone deliberately**: it is a
build-config change affecting every route, and it belongs in its own task with its own check.

### Verified

Build clean (TypeScript included), lint clean in every touched file, both routes served from a
production build and parsed: all eight `--color-svc-*` assigned, `items-start` absent, wrapper
pull and constant panel padding present, sentinel mounted, 8 card hovers × (scale + shadow +
2 accent tints), 31/5/6 loops, 86 accent washes — identical on `/company` and `/he/company`.

**Still nobody has looked at it.** The pin/un-pin transition, the hover at each tier, and the
eight accents next to each other are all things only an eye can judge.

---

## 2026-08-16 — Block 4 deleted; Block 3 rebuilt as eight animated cards

User: *"in the company section we have to do change and huge ui update — 1. remove the Built On
Tools Your Team Already Uses section 2. enhance the Built From Eight Services That Work As One
System, we have to take inspiration from [clix-main-page.vercel.app] the פתרון מותאם לכל עסק.
section, it has per feature an animation that presents what it means"*.

### 1 — `CompanyTools` deleted

The `Investors` band. Gone in five places: the component file, `CompanyRoute`'s import and
render, and the `tools` key in both locale dictionaries. **`clix/toolMarks.tsx` was NOT
touched** — `ClixLogoProof` on /clix still renders all twelve marks; only this consumer went.

The reason it went, recorded because it is a judgement and not a bug: it was a second logo-wall
grid sitting directly under the first, the same shape saying less.

### 2 — the reference band was read, not guessed

`clix-main-page.vercel.app` is a Vite SPA; its `#services` component was pulled out of
`assets/main-jce_OKWt.js` (component `ss()`) and its copy out of
`assets/AccessibilityWidget-ZW5hrED9.js` (that chunk is misnamed — it is the shared app bundle).
What that band actually does:

- `md:sticky md:top-[120px] md:w-[45%]` heading beside a `md:w-1/2` card stack, `gap-6`
- per-index fixed card heights (`h-[300px] md:h-[400px]`, one 450, one 300)
- art is an `aria-hidden` `absolute inset-0` layer **behind** the copy, bleeding off the edge
- **two of its four arts are static.** Only the node flow and the chat thread animate.
- it uses framer-motion — **which is not installed here** (`package.json`: `gsap` +
  `@gsap/react` only). Not added; see Motion below.

### 3 — the eight scenes are SOURCED, and that was the find

`docs/reference/clixsolutions/content.json` → `services.bodyText` already describes a distinct
UI mock for **seven of the eight** services, plus a numbered benefit kicker and a one-line
promise for all eight. So the band's new copy and its new artwork are clix's own, recovered —
not marketing written in-repo. The one exception is **Mobile Development, for which the capture
describes no artwork**; that scene is designed from the service's own bullet list and is the
only invented picture on the band.

Knock-on for `he/company.ts`: **sixteen new Hebrew strings, every one verbatim.** The file's
own history recorded these kickers as *deliberately* omitted — "this band's tiles render a
label and nothing else, English included, so adding them would mean adding English copy to a
route whose English render must not move". The card layout is exactly what lifted that
constraint. Hebrew SOURCED count 18/31 → 34/47.

### 4 — decisions worth keeping

- **The card column is ~304px wide at desktop** (`1280 − 576 − 80 = 624`, `(624 − 16) / 2`),
  four pixels off the 308px tile the band used to render. Not a coincidence that was designed
  for, but it is why the new grid needed no new width measurement.
- **Sticky offset is `top: 96px`** — `why-rogo`'s existing value, off the target. Not a new
  number. `desktop:self-start` is load-bearing: a stretched flex item has no travel to stick in.
- **Cards grow, they do not clip** — `min-h-*` in a stretched grid. A deliberate divergence
  from /product's aspect-fixed benefit cards, whose bodies genuinely clip. 2 × 8 can absorb a
  taller row where 3 × 6 could not, and it removes the per-locale clipping risk entirely.
- **The scenes carry no prose.** Everything sentence-shaped is a grey bar; only machine tokens
  (`POST /lead`, `dashboard.tsx`, `98`, `1.2s`) are set as type, each `direction: ltr`. That
  makes all eight **locale-free — not one new dictionary key** — and it also avoids porting the
  real site's chat mock, which is a stock template in someone else's business ("2 kurtas",
  "Rs.1200"). The reference band does the same for three of its four arts.
- **`serviceGlyphs.tsx` was kept, not deleted.** The eight marks moved to 20px in the card
  header. The eight scenes look nothing like one another; the marks are the constant that
  holds the set together. Reversible in one line.
- **Radius 0 on the card**, against the reference's 8px — this site's scale is
  `--radius-none` / `--radius-pill` and nothing else on it is 8px. Radii *inside* a scene are
  depiction (a chat bubble, a handset) and stay.
- **`EYEBROW_CLASS` is now exported from `CompanyMission.tsx`** rather than a second preset
  being authored. `w-full` came out of the constant and went to its two original call sites,
  because Services sets the eyebrow beside a 20px mark in a flex row.

### 5 — motion: three keyframes, not eight

`service-step` (31 elements), `service-pulse` (5), `service-rise` (6), in `globals.css`.

⚠️ **Three SHARED keyframes was the call, and it is the opposite of /product Block 4's six
bespoke ones.** Those six each animated a different mechanism. These eight all animate the
same one — a sequence advancing through a list — so one `service-step` staggered by
`animation-delay` covers roster rows, chat bubbles, flow nodes, page blocks, app screens, code
lines, pipeline stages and score rows alike. It is also what makes eight very different
pictures read as one band.

⚠️ **The base-state invariant is inherited verbatim and is load-bearing.** `service-step` runs
on a dedicated overlay resting at `opacity: 0`, so the unanimated scene is the *finished*
picture. The global reduced-motion clamp is an exact no-op; SSR first paint is complete.
Written the other way round — elements starting hidden and animating in — a reduced-motion
visitor would get eight empty panels.

⚠️ **Opacity and `translateY` only.** The Y is not stylistic: it is the one axis that does not
flip under RTL, so unlike `.benefit-bar` these need no `[dir="rtl"]` companion rule. ~40 loops
run at once when the band is on screen, so every one is compositor-only.

### 6 — verified, and what is not

Verified: `npm run build` clean (TypeScript included); `npm run lint` clean in every touched
file (the 8 remaining problems are pre-existing, in `ClixHero.tsx` and `docs/reference/*.js`);
both routes served from a production build and parsed — 31 step overlays, 5 pulses, 6 rises and
all eight scene token sets present on `/company`, the same counts plus all sixteen sourced
Hebrew strings and 38 `direction: ltr` tokens on `/he/company`; `Built On Tools` absent from
both.

**NOT verified: nobody has looked at it.** No render at 1600 / 1440 / 1024 / 390, no sticky
behaviour check against the fixed nav, no RTL eyeball, no reduced-motion pass in a browser.
Line counts for the sixteen new kickers and promises are unmeasured in both locales — they
cannot clip, but they can look wrong. Handed to the user at this point deliberately, per
CLAUDE.md §7: the band is a taste call now, and converging alone on it would be the wrong move.

---

## 2026-08-13 — Block 3's eight tiles got marks

User: *"in the company section, you have to add icons in this section, be creative with it"*.

**What changed.** New file `src/components/company/serviceGlyphs.tsx` — eight hand-drawn SVG
marks — plus a 32px icon slot above the label in each `CompanyServices` tile. Nothing measured
moved: same 164px tile, same 4 → 4 → 1 grid, same 16px gaps, same `#73737326` rule overlay,
same band padding. The tile was already a centred column with `gap: 10px`, so the mark drops
into the slot the label was already using and the 344px / 1424px grid boxes still check out.

**The artwork is a design decision, not a measurement, and is documented as one.** rogo's
`Team` band holds employer logos and no icons at all, so there is nothing in the capture to
copy for this. Recorded here rather than in FEATURE.md's measured tables for that reason.

**One construction grid across all eight**, which is what makes them a set rather than eight
clip-art picks: 32×32 viewBox, artwork inside 3.5 → 28.5, stroke `currentColor` at **1.5**,
round cap + join, `fill: none`, and at most one solid fill per mark (a dot or counter-shape).
Corner radii 1.5–3 — the softest curve a square-cornered design system tolerates.

- 1 AI Agents — chip wired on four sides, spark in the die
- 2 WhatsApp Automation — message bubble with a bolt
- 3 CRM Implementation — record list: header bar, two contact rows
- 4 Integrations — two half-links closed by a shared bar
- 5 Web Development — browser frame with `< / >`
- 6 Mobile Development — handset with centred app content
- 7 Custom Software — three identical modules and one circle
- 8 AI Strategy — target with N/E/S/W ticks

**MONOCHROME, and `forest` was considered and rejected.** A green accent dot per mark was the
obvious creative move. `forest` is /clix's colour — globals.css:35 calls it "the one brand
colour anywhere in this build" — and spending it on eight dots in a /company band would put it
somewhere it was never measured. The marks are `muted` at rest so the label stays the loudest
thing in the tile, `ink` on hover.

**Hover is new behaviour on a tile that has none in the capture.** The tiles are not links and
the original's logos are inert, so this is additive: colour `muted` → `ink` plus a 2px lift,
300ms on `var(--ease-rogo)`, the site's own link preset. `motion-reduce` kills both.

⚠️ **RTL: all eight are PHYSICAL, and seven of them by construction.** Same rule as
`ui/WhyRogoIcons.tsx` — mirror only glyphs whose meaning *is* a direction. Rather than argue
that case eight times, seven are drawn **symmetrical about the vertical axis**, so mirroring
would be a no-op anyway. Two marks were redrawn to get there: the browser lost its three
traffic-light dots for a centred address pill, and the handset's content rules are centred
rather than left-set. The one exception is the chat bubble, whose tail and bolt are both
asymmetric; a bubble tail is a picture of a bubble, not a reading direction.

⚠️ **The roster is INDEXED, not keyed by label.** `company.services.items` is eight *different*
strings on /he, so a `Record<string, Glyph>` lookup would have rendered nothing in Hebrew and
failed silently. `SERVICE_GLYPHS` is positional, and its type is a literal **eight-slot tuple**
rather than `Glyph[]` — same reasoning as the dictionary's own tuple, the count is the grid, so
a ninth service fails the build instead of the eye.

**Verified:** `npx tsc --noEmit` clean. **Not looked at in a browser at any tier** — the user
asked to skip headless verification and is checking the render themselves.

---

## 2026-08-12 — Block 1's clip: 4K master in, and a reversal on how it is framed

User supplied `boss-vid.mp4`, *"its more hd, right now its horizontal make it vertical"*.

**The file is `3840x2160` with the content lying on its side and no rotation flag**, which is
what "horizontal" meant. Not a portrait file with a rotation tag like `boss-lecture.mp4`: this
one has the rotation **baked into the pixels**, so a browser plays it sideways and no metadata
fixes it. Rotation direction was settled by rendering both `transpose=1` and `transpose=2` side
by side rather than reasoning about it: clockwise is upright.

### The reversal, and why the first answer was reasonable but wrong

Asked whether the upright portrait clip should be shown at its natural shape or keep filling the
16:9 band. Answer was the portrait player; built it, measured it (403.7 / 297.7 / 112.9 wide,
aspect 0.5625, centred at every tier, band height untouched). Then, seeing it beside rogo's own
page: *"why is it like this? it should be like rogo not portrait"*. Reverted.

Worth recording because the second answer is obviously right once seen and was not obviously
right when asked. **A side by side against the target settles a framing question faster than a
description of one.** The ASCII sketches in the question were accurate and still misled.

### What ships

Pre-cropped to 16:9 in one command rather than letting CSS crop:

```
transpose=1, crop=2160:1210:0:1314, scale=1920:1076
```

Offset **1314 is the vertical centre**, chosen by comparing three candidates: higher lost the
seated listener, lower pushed the speaker's head against the top edge. Centre also means plain
`50% 50%`, which is the capture's own value.

Two consequences of pre-cropping:
- **`objectPosition` is inert.** The file already is 16:9, so cover has nothing to crop.
  Reframing means re-encoding with a different offset, not editing CSS.
- **1.9 MB instead of 3.7 MB.** The portrait original carried 68% of its bytes as pixels the
  band never draws.

**The softness is gone.** 1920 source width downscales into the 1280px box; `boss-lecture.mp4`
was 576 wide and upscaled 2.2x. That file and its poster are deleted.

The 8.8 MB master is kept **outside the web root** at `assets/boss-vid-source-4k.mp4`, because
everything under `public/` is served whether or not anything references it.

### ⚠️ A harness default that reads as a bug

`vidbox.js` reported the video paused at every tier and it looked like autoplay had regressed.
It had not. `cdp.js`'s `connect()` **always emulates `prefers-reduced-motion: reduce`**, which is
deliberate — it is how the geometry probes get a deterministic resting state — and the pause was
the reduced-motion handling working correctly.

Two things follow. **Every screenshot in this feature's `assets/` shows the reduced-motion
path**, so a paused poster there is not evidence of a fault. And any future check of autoplay
must override the emulation explicitly, as `scratchpad/shot-normal.js` does.

---

## 2026-08-12 — Block 1's video autoplays, and the obvious implementation was wrong

User: *"make the video auto play in company remove the play button"*. A deliberate departure
from the target on this one point: the capture's variant is literally named `Paused` and waits
for a press.

`muted` is **required**, not decoration. Browsers block unmuted autoplay outright, so without
it the promise rejects and nothing ever plays. It costs nothing because the clip has no audio
track. `preload` moved `none` → `metadata`: `none` fights autoplay, `auto` would pull the whole
1.3 MB on every page load whether or not anyone scrolls to the band.

### ⚠️ `autoPlay={!reduced}` DOES NOT HONOUR THE PREFERENCE. The first version shipped that bug.

Autoplay is exactly the motion a reduced-motion visitor has asked not to see, and
`globals.css`'s rule cannot help — it targets `.hero-video` only. So the preference was wired
through the existing `usePrefersReducedMotion` hook … and it did not work.

**Caught by measuring rather than reasoning.** With reduce emulated over CDP, the attribute read
`autoplay false` and `controls true`, exactly as intended, **and the clip was playing anyway**,
`currentTime` advancing 4.05 → 6.05.

The cause is hydration order. The hook's server snapshot is `false`, so SSR emits the
autoplaying markup and the browser starts the clip while parsing. React then hydrates and drops
the attribute, but **`autoplay` is only consulted when playback BEGINS** — removing it never
pauses an element that is already running.

Fixed with an imperative `useEffect` that pauses on `reduced`. That also covers a case the
attribute never could: someone toggling the OS setting with the page already open.

Verified after the fix, both modes:

| | paused | muted | autoplay | controls | currentTime |
|---|---|---|---|---|---|
| no-preference | false | true | true | false | 4.20 → 6.21, advancing |
| reduce | **true** | true | false | **true** | 0.06 → 0.06, frozen |

It **degrades rather than removes**: a reduced-motion visitor gets the poster plus native
controls, so the clip is still theirs to watch on purpose. Hiding it outright, which is what
`globals.css` does to the home hero, would be wrong here — that one is decorative background,
this one is content.

**Rule worth carrying: a media attribute driven by a client-only hook is not a preference
guarantee.** SSR renders the default, the browser acts on it before hydration, and only an
imperative call undoes it. `PlayGlyph` and the click-to-play latch were removed as dead code.

---

## 2026-08-12 — Both media slots replaced with the user's own assets

### Block 5: stock photograph in, Old Jaffa placeholder out

Right subject at last, people at work rather than a landmark. It also **fixed a real defect**:
the band is `data-nav-theme="light"` per the measured spec, and the dusk placeholder had the nav
painting dark glyphs over a dark image. The new photograph is bright, so the marker is now
correct rather than merely specified.

Preparation, none of it cosmetic: renamed off `company bg.jpg` (a space means percent encoding
in every URL), **2.3 MB at 5917x3950 down to 164 KB at 2400x1200**, and cropped to **2:1 on
purpose** — neither of the band's own ratios. The band is 2.69 at 1600 and 1.30 at 390, so 2:1
is the midpoint that survives `cover` at both ends; cropping to either extreme guts the other.
The uncropped original is preserved **outside the web root** at `assets/company-bg-source.jpg`,
because everything under `public/` is served and shipped whether or not code references it.

⚠️ **Licence unverified.** The file arrived with no provenance. Confirm commercial use is
permitted before this route is indexed. And it is **stock, not clix's team**, sitting under a
heading about joining that team — ordinary for a careers block, much weaker than a quote put in
a named person's mouth, but not the real thing.

### ⚠️ Block 1: `boss-lecture.mp4` is 9:16 portrait in a 16:9 slot

`ffprobe` reports `1024x576`. The stream carries **`rotation=-90`**, so it actually presents as
**576x1024**. Reading the reported dimensions and wiring it up would have looked like a clean
16:9 match and been wrong.

Against the measured `aspect-[1.78344]` box, `object-fit: cover` locks to width and shows about
**32% of the frame**. Simulated the exact crop before touching the component rather than
swapping and eyeballing: the speaker's head and the seated listener both survive at `50% 50%`,
so the position is unchanged.

Two things that cannot be fixed in CSS, both recorded in the component:
- **No horizontal slack.** Cover locks to width, so `objectPosition`'s first value does nothing
  here. Only the vertical value reframes it.
- **576px upscales 2.2x** into the 1280px box, so it renders visibly soft. That is the source.
  A wider capture is the only fix.

The alternatives, if the crop is ever judged too tight: `object-contain` letterboxing (leaves
~877px of empty ground either side) or giving the band its own aspect ratio, which breaks the
clone and moves every band below it. Neither taken.

Still no audio track, like the clip it replaced, so unmuted stays safe.

**Geometry re-verified after both swaps: every band still matches the target to 0.00px at all
four tiers.**

⚠️ `video/hero-tel-aviv.mp4` and its poster are **unreferenced again**, 6.9 MB of dead weight.
Candidates for deletion.

---

## 2026-08-12 — The wave. Five agents, and every one of my errors was caught by an agent

Five agents, one file each, exclusive ownership, launched in one message. All five landed
compiling. **Every band height matches the target to 0.00px at 1600 / 1440 / 1024 / 390** and
`<main>` totals are identical (4497.16 at 1440, 6451.88 at 390). Zero horizontal overflow.

### ⚠️ Three numbers in my spec were wrong. Agents found all three, from the CSS.

Every one was caught the same way: by reading the capture's stylesheet rather than trusting the
brief or back-solving from a rendered box.

1. **The Mission grid collapses at 810, not 1200** (Unit B). My spec said the grid stacked below
   1200 along with its container. It does not: the base rule is
   `grid-template-columns: repeat(3, minmax(50px,1fr))`, the only `repeat(1, ...)` override sits
   in `@media (max-width:809.98px)`, and the 810–1199.98 block never restates the tracks. **The
   outer container and the inner grid change at different breakpoints.**

   The damning part: my own probe had already returned a `288px` column at 1024, and
   `(944 - 80) / 3 = 288` only resolves as three columns. I had the answer and wrote the prose
   against it.

2. **Both Hero gaps were wrong, and they compound** (Unit A). `Text & Button` is 32 at base with
   a single `≤809` override to 24, so **tablet inherits 32**, not the 24 I wrote. `Text
   Container` is the reverse: 24 at base, `16px` in the tablet block only. I had derived these
   by arithmetic from the band height — one equation, **two unknowns, one of them fixed
   arbitrarily**. With 24 and 24 the tablet Hero computes to 431.2 against a rendered 439.2,
   putting every band below it 8px high.

3. **Only the Hero CTA has corner brackets** (Unit E). I wrote that both did.
   `.framer-kh28y4` has exactly one child, the label row, and no bracket SVGs.

**The lesson is one sentence: read the CSS, do not back-solve it.** A rendered box is the sum of
several rules and cannot be decomposed by arithmetic without guessing. All three errors were
mine, all three were in the shared spec every agent read, and only the two that touched geometry
would have been caught by the height diff — the bracket one would have shipped.

### What pre-fitting bought

Zero wrapping regressions. Every headline and paragraph was measured during prep in the real
rendered face at every tier, so the wave had no copy decisions to get wrong. Contrast with
`/product`, where the equivalent bug was mine and cost 645 shifted elements.

Two strings needed *lengthening*: the services intro had to clear 5 lines at 358 while staying
at 3 at 540, a window of about 30 characters, and landed at 215.

### Reconciliation: what only the orchestrator could see

- **Heading outline skipped a level.** All four band headings shipped as `h3` under the hero's
  `h1`, matching the target and matching `/product`. That is a WCAG 1.3.1 defect. Promoted all
  four to `h2`, which costs **zero pixels** because the visual preset is unchanged. `/product`
  still has the same defect; not fixed here, out of scope, worth doing.
- Unit C dropped a Framer wrapper with a single `w-full` child, where row-vs-column and `gap`
  are both no-ops. Accepted: zero layout effect.
- Unit D tinted `monday.com`'s three brand fills to `ink` so the band stays monochrome, after
  checking the reference screenshot to confirm rogo's investor marks are near-black rather than
  the grey `ClixLogoProof` uses. Accepted.

### ⚠️ Contrast: this page reproduces a target failure, and that needs a decision

`CompanyServices`'s intro is `muted #737373` on `bone #f5f2eb` = **4.24:1**, and `CompanyTools`
sits on `surface #f5f5f5` = **4.35:1**. Both **fail AA for normal text** (4.5 needed). These are
the target's own colours, measured, so 1:1 fidelity and
`docs/reference/accessibility-spec.md`'s mandatory floor are in direct conflict here.

No new failing *pair* was introduced — both were already on the repo's list of three awaiting a
call — but this page adds new *uses* of them. Not resolved unilaterally, because "match the
original exactly" is the project's first requirement and darkening the text is a visible
deviation. **The user's call.**

### ⚠️ The document is 43.8px taller than the target, and none of it is this page

At 1440 our doc is 5093 against the target's 5050; at 390, 7795 against 7561. `<main>` matches
to 0.00px at both, so the entire delta is the shared `Footer` — 596.19 against 552.39, and
1343.23 against 1109.23. It is that much taller on **every** route, almost certainly
`FooterMap.tsx`'s Google Maps embed, which rogo's footer has no equivalent of. Pre-existing and
out of scope, but it means no page in this repo currently matches the target's total height.

### Smaller findings worth keeping

- **`--window-size` is not a valid phone capture on Windows** (Unit A). Chrome clamps the window
  to an OS minimum near 500px, lays the page out at that width, then crops the PNG to 390 from
  the left. The result reads as content shifted right and clipped: a convincing false positive
  for a layout bug. Use `Emulation.setDeviceMetricsOverride`.
- The `/company` video needs no reduced-motion special case because it is click-to-play. Worth
  noting that `globals.css`'s rule targets `.hero-video` only and would not have covered it.
- The clip carries **no audio track** (`webkitAudioDecodedByteCount` 0), so leaving it unmuted,
  faithful to the original, cannot surprise anyone.
- Unit E flagged that while the placeholder photograph passes under the nav bar, the bar paints
  dark glyphs on a dark image. It is `data-nav-theme="light"` per spec and the ancestor always
  shadows a nested marker (`Nav.tsx:322-330` breaks on the first box spanning the bar). Only a
  problem while the placeholder is in place; the fix is the real photo, not a DOM change.
- **The other session's `/careers` work shares this working tree.** Its `src/components/careers/`
  had a `TS1149` casing collision mid-wave (`CareersRoles.tsx` importing `./careersRoles`, which
  resolves case-insensitively back to itself) and briefly blocked a repo-wide build. It resolved
  on its own. Nothing here depends on it except Block 5's `/careers` link.

---

## 2026-08-12 — Prep: capture, measure, fit

### The capture did not exist

`docs/reference/target/` held home, felix and product only; a repo-wide grep for
`rogo.com/company` returned nothing, and `docs/SECTIONS.md:104` still listed `Company` under
"Other pages, still not scoped". So prep started one step earlier than the last three builds:
plain Node `fetch`, saved whole, five inline `<style>` blocks concatenated, dated filename
per `docs/reference/target/README.md:53`. Result: 381 KB HTML, 146 KB CSS, 272
`data-framer-name` values.

### The page is SIX bands, not the five the screenshots suggest

`Video` is a **sibling** of `Hero`, not a child, the same shape as `/product`'s Block 1. Missing
that would have nested the video inside the hero's padding and moved everything below it.

### ⚠️ Rule 1 from `block-diff.js` is not a safe tree-walk filter

The first structural probe reported the `Video` band as **having no children at all**. It has
five. Between the band and its content sits a **0×0 Framer wrapper**, and filtering every node
on `getBoundingClientRect().width > 0` discarded it *and its entire subtree*.

That filter exists to stop you measuring Framer's hidden tier variants, and it is right for
**queries**. It is wrong for **walks**: a zero-size parent can hold visible children. Walk
unfiltered, then test visibility per node. Same lesson shape as `/product`'s "byte offsets give
document order, never nesting".

### The border matrix is uniform, which was worth checking rather than assuming

`sections/Security.tsx` needed a hand-authored per-cell, per-tier border string, so the
expectation was more of the same. It is not: **every** `Team` tile is `border-top + border-right`
and **every** `Investors` tile is `border-top + border-left`, at all three tiers, colour
`#73737326` throughout. One class string per grid, no matrix.

Read via the `--border-*-width` custom properties, not `borderWidth`. Framer paints these with
`[data-border]::after`, so a normal computed-style read returns `0px` and tells you nothing.

### Headlines use HARD breaks, not natural wrapping

The captured text of three h3s concatenates without a space: `"Building The Best AI"` +
`"Analyst On Wall Street"`, `"Supported By"` + `"World-Class Investors"`, `"Join a World-Class
Team"` + `"Rethinking Finance"`. That is a forced break, so the line count is fixed by the
markup and each **line** has to fit, rather than the string hitting a wrap count. `Team`'s h3 is
the exception and wraps naturally into 2.

### Copy was fitted by rendered line count before any agent ran

The `/product` regression was mine: a stepper title 62 characters against the capture's 63, well
inside the 10% rule, wrapped to three lines at 390 where the capture takes two and pushed 645
elements down the page. So this time the orchestrator fitted every string during prep and handed
the agents final text, removing the failure mode from the parallel wave entirely.

Fitted against **our** face, not the target's: rogo sets headlines in ABC Arizona Mix, we map
`--font-display` to Discovery, and different faces break differently. The harness **creates its
own probe element** rather than querying one, which is what stops it repeating `/product`'s
second mistake, where `section h3` matched the full-width intro instead of the 472px column.

Every fitted string reproduces the target's measured height exactly, e.g. h1 `167.2 / 68.4 /
182.4`, services intro `70.2 / 62.4 / 104`.

Two strings needed lengthening, not shortening. The services intro is the interesting one: it had
to be long enough for 5 lines at 358 while still 3 at 540, a window of roughly 30 characters.
Landed at 215.

### Stock photo: both sources refused, so the slot ships a documented placeholder

CLAUDE.md §7 caps decorative-asset work at two candidate sources. Pexels returned **403** and
Unsplash **401** to a plain fetch. Per the rule, stopped rather than trying a third, and asked
the user.

Meanwhile the slot is filled from an asset already in the repo: a frame at t=4.5s from
`public/video/hero-tel-aviv.mp4`, cropped `1920x758` and graded once
(`saturation 0.55, contrast 1.04, brightness 0.02`) because the ungraded sunset was far too
saturated for a page that is otherwise white, bone and grey. Written to
`public/company/tel-aviv-band.jpg`, 199 KB.

It is **Old Jaffa, a landmark, not a team photograph**, and it reads oddly under a heading about
joining the team. Named for what it is rather than what it stands in for. Replace it when a real
photo exists.

### Two assets brought back from the dead

`public/video/hero-tel-aviv.mp4` and its poster were **6.9 MB of unreferenced dead weight**
(`public/README.md` still claimed the mp4 was "in use"; `Hero.tsx` moved to `hero-israel.mp4` on
2026-08-09). This page's Block 1 video and Block 5 band now both come from that file.

### Measured facts that shaped the build

- Hero top padding is `198px` at every tier, so the nav is **fixed** and takes no `spacer`, as
  on `/product`.
- The stage sets explicit `order` 0..5 below 1200, but the values match document order, so
  **nothing reorders** and `<main>` needs no `order-*` classes.
- **1600 and 1440 are identical in every measured value**, so no `xl:` variant is used.
- Row → column switch is at **1200** for `Mission`, `Team`'s inner container and `Reiteration`.
- Both CTAs are **36px tall**, not the 40 the outer frame suggests.
- `Team` goes **4 → 4 → 1** columns. There is no 2-column tier.
- The eyebrow labels ship `letter-spacing: normal`, a real exception to DESIGN-SYSTEM.md's
  "all negative, never ship 0".
- There is **no wordmark overlay** on the video; the "rogo" over the skyline is baked into the
  video frame itself.

---
