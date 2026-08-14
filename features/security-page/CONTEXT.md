# Context: Security page (`/security`)

Newest entry on top. Append, never rewrite. Written so a cold session can resume without
re-deriving anything: the spec is `FEATURE.md`, this file is what happened and why.

## 2026-08-14 (fourth pass) — a taller window, and typing that is not a metronome

**Why.** *"increase the height of the terminal, and make the typing random speed to make it look
more natural, add more creativeness to it"*. Two unrelated asks in one sentence, done as two
changes.

### The height, and what it dragged with it

| | before | after |
|---|---|---|
| window, tablet+ | 1 + 36 + **282** + 1 = **320** | 1 + 36 + **362** + 1 = **400** |
| window, phone | 1 + 32 + **254** + 1 = **288** | 1 + 32 + **326** + 1 = **360** |
| visible rows | 6 | **10** |
| composite `BOX.h` | 580 | **660** (terminal bottom = 260 + 400) |
| `#first` >=1200 / 1024 / 390 | 1256 / 952.41 / 905.19 | **1336 / 1032.41 / 977.19** |

**Ten is derived, not picked.** The tablet+ tier binds because its rows are 22.4px against the
phone's 19.2: `41 (panel) + 12 + 224 (ten rows) + 12 + 40.4 (box) = 329.4` inside 362, leaving
32.6 of deliberate empty terminal. Phone is `37 + 10 + 192 + 10 + 33.2 = 282.2` inside 326.
An eleventh row would need 351.8 of 362 at tablet+ — inside the box, but with no slack left for
a copy edit, so **ten is the honest ceiling**.

⚠️ **The third pass could say "this rewrite touches no other file"; this one cannot.** Three
siblings carry the geometry and were edited with it: `SecurityCanvas.tsx` (`BOX.h`),
`SecurityHero.tsx` (tier map + the three sums), `SecurityConsole.tsx` (the composite it quotes).
`heroH` is excluded from `docs/reference/security-diff.js` by design, so **no harness asserts on
any of this** — which is exactly why all four files carry the arithmetic in prose.

⚠️ **All three tiers moved, which is new.** When the console arrived on 2026-08-13 only `>=1200`
changed, because the console is gated to one breakpoint. The *terminal* is the one window every
tier renders, so a change to it reaches all three. Each sum grew by exactly its window's delta
(80 / 80 / 72) and by nothing else.

⚠️ **`HEAD_0` is why the row count could move without touching a line of copy.** The invariant is
`(head + RENDERED_ROWS - 1) % 4 === 0` — the hidden last row must always be the next PROMPT, and
`head` advances by 4 forever, so it has to hold every cycle. `head = LINES.length - VISIBLE_ROWS`
makes that sum `LINES.length` = 20 exactly, a multiple of 4, so it holds for **any** row count.
A literal `14` would have broken the moment six became ten.

### The typing

⚠️ **`steps(n)` had to go, and not because it was tuned wrong.** An ease is baked in when the
tween is built and is uniform by construction: one `steps(n)` tween can only ever produce one
interval for every keystroke of every prompt. There is no ease that varies per character. The
reveal is now **one zero-duration `set` per glyph at an accumulating jittered time** — ~35 sets
per cycle, which costs nothing, and the mechanism is otherwise untouched (still a width clip over
text that is already present, so SSR, reduced motion and the trailing caret all behave as before).

What was added on top of plain jitter, because uniform jitter alone just reads as lag:

- **burst runs** — 24% of glyphs land at 16-36ms against the ordinary 45-115ms. The *contrast* is
  what sells it.
- **think-pauses** — 90-300ms after a space, 32% of the time. At every space it reads as dictation.
- **the fumble** — ~2 prompts in 5 hit a **QWERTY left-hand neighbour** (`e`→`w`, `k`→`j`,
  `r`→`e`), sit on it 130-340ms, backspace, and carry on. Never in the first two or last two
  characters: nothing is typed yet for the correction to read against, and a slip at the end
  lands on the submit beat and reads as a stutter. The span holds the typo'd string only for
  that beat — the backspace clips the width back, which is what makes swapping the correct
  string in again invisible rather than a flicker.
- **every duration in the file became a range** sampled per cycle. The three arrival gaps still
  RISE (means 0.55 < 0.68 < 0.8) because that ordering is what makes the exchange read as a
  reply; the ranges are staggered rather than overlapping wholesale so randomising cannot
  flatten it.

#### Second round, same day: the variance was at the wrong scale

*"the typing is still fast, it should be random speed, sometimes lowkey fast something slow"* —
and they were right for a reason that is arithmetic, not taste. The first attempt sampled a delay
**per glyph**. Thirty independent samples from one range AVERAGE OUT: every prompt took about the
same total time, and no stretch inside a prompt was faster than any other. Per character, jitter
is invisible.

Tempo now varies at **two scales above the glyph**, which is where a person's does:

| scale | mechanism | effect |
|---|---|---|
| per prompt | one `TEMPO` multiplier `[0.7, 1.7]`, rolled once per cycle, applied to every key | one question is typed briskly, the next haltingly |
| per run | a `MODE` held for 2-10 characters, then re-rolled: fast `[22, 50]ms` w0.3, ordinary `[60, 130]ms` w0.5, laboured `[150, 300]ms` w0.2 | stretches of muscle memory, then words picked out one at a time |

They compose, so a slow prompt in a laboured run is genuinely slow. Think-pauses are scaled by
tempo too — someone typing slowly also thinks longer between words. The fumble's reaction beat is
NOT scaled, because noticing a typo is reaction time, not typing speed.

**Measured, 12 prompts over 2 minutes:** totals **3.04s .. 8.08s**, a **2.65x spread**;
101 .. 245 ms/char between prompts; within a prompt gaps run 20ms to 768ms. Before this round
every prompt was ~2.1s at ~65ms/char with no spread worth the name.

⚠️ **Randomness below the character is invisible — keep it above.** That is the whole lesson of
this round, and it is why `BURST_CHANCE` (a per-glyph coin flip) is gone rather than retuned.

⚠️ **A reported "rows stop updating" was HMR debris, not a bug.** The user's screenshot showed
the strip painting its first 7 rows and leaving 4 at their server-rendered text — exactly what a
stale effect closure from before the row count went 6 -> 10 would do, since React keeps the first
seven `<li>` nodes and appends the rest. On a FRESH load: 55 strips sampled over 50s, **0
non-contiguous**. Every strip was `LINES[h..h+10]` for some h. Hard-reload after changing
`VISIBLE_ROWS`; there is nothing to fix in the component.

⚠️ **The self-scheduling chain is now doubly required.** It already could not be a `repeat: -1`
timeline (one baked ease, prompts of different lengths); now a repeat would replay the same
"random" performance forever, which is the exact thing this pass exists to kill.

**Measured over CDP, 1440 x 900, dev build:**

| | |
|---|---|
| window / body / content / slack | 720 x 400 / 362 / 329.4 / 32.6, `overflow=false` |
| clip | 224.0px = **10.00 rows** at 22.4; 192.0 = 10.01 at 19.2 (phone) |
| panes | console 900 x 440 at (0,0), terminal 720 x 400 at (+280,+260) |
| `#first` | **1336** / 1032.41 / 977.19 — the three sums, confirmed, not derived |
| keystroke gaps | min 15, p25 40, med 70, p75 95, max 344 ms |
| distinct gap values | 46 of 95 samples |
| fumbles | 3 in 10 prompts over 60s, **all corrected**, 0 non-ASCII strings |

### ⚠️ A bug found while measuring: `w-max` is poisoned project-wide

The greeting **"Welcome to clix code" had never rendered**. It was in the DOM with the right
text and the right colour, at **exactly 0px wide**, since the panel landed on 2026-08-13.

Root cause: `globals.css`'s `@theme` defines `--container-max: 1280px` as this site's page
container. **Tailwind v4 resolves `w-<name>` against the `--container-<name>` namespace**, so the
project token collides with the built-in utility and the generated rule is:

```css
.w-max { width: max-content; width: var(--container-max) }
```

The second declaration wins. **Every `w-max` in this repo is `width: 1280px`.** Here that made a
113px dot-matrix grid claim 1280px of a 678px flex line; `shrink-0` meant it could not give any
back, so the `truncate` greeting next to it was squeezed to zero. Nothing errored, the dots still
drew at the right size, and `overflow-hidden` on the window meant the 1280px box was clipped
away — **a screenshot could not catch it**, only measuring the span's rect could.

Fixed with an inline `width: max-content` on the grid: a class can be tidied away by someone
cleaning up the list, an inline style cannot. `max-content` rather than the computed 113px
because `MATRIX_COLS` already derives the column count.

⚠️ **`ClixCapabilities.tsx:135`'s marquee track (`clix-marquee flex w-max flex-none`) has the
same bug and is NOT fixed here** — different section, user's call. `w-min` / `h-min` / `h-max`
are unaffected: there is no `--container-min` token to collide with them.

#### Third round, same day: the reply streams, the work got technical, and the box grew a status strip

*"the response of the terminal claude, can you make it like typing but also but fast, cuz right
now it just spawns and also add more coding terms, or tech stuff to make it more like coding"*,
then a screenshot of the real CLI's prompt box with *"add something like this to ours"*.

**1. The agent's rows stream.** They arrived complete before. Now `streamInto` fills the bottom
row progressively — but in **1-4 character CHUNKS at 18-45ms**, not keystrokes. That is the point:
a hand presses one key, a model emits tokens, and the two motions in one window should not look
alike. Measured: 16 lines over 45s, 180-630ms each, chunk sizes 1-4.

⚠️ **`textContent = slice`, not the width clip the prompt box uses**, and it is not an
inconsistency. The row's text span carries `truncate`, i.e. `text-overflow: ellipsis` — clipping
it to a partial width makes the browser draw an ellipsis at the cut, so a half-arrived line would
read `Read(infra/dep…`. A substring never overflows, so no ellipsis can appear.

⚠️ **The arriving row is blanked TWICE, and both are load-bearing.** Once below the clip before
it travels (or it slides in complete, then gets wiped — a flash exactly where the eye is), and
again in the SAME synchronous callback as `paint()`, which has just written the full string back.
Splitting the second one into its own callback reintroduces the flash.

**2. Six rows per exchange, not four.** Each answer now makes TWO tool calls — the first
establishes ground, the second reads the value the sentence rests on: `Read(infra/deploy.tf)` →
`provider aws`, `Bash(clix env show)` → `region eu-west-1 (yours)`. Also `Grep(retention,
config/run.yml)`, `Audit(iam policy)`, `Read(tokens/github.json)`, `Read(vault/kv/clix)`,
`Read(.github/workflows/clix.yml)`, `Bash(git remote show origin)`.

⚠️ **The extra rows are code artifacts, never new claims.** The five `say` lines are untouched and
still map 1:1 onto the Compliance band's five cells. The page already established this vocabulary
— the console beside it lists `sync.ts`, `auth.ts`, `schema.sql` with diff counts. `transit  tls`
carries **no version number** deliberately: Benefit 5 is still an open question in FEATURE.md and
naming a version would invent precision on top of an unsigned claim.

⚠️ **`steps` is a fixed-length TUPLE `[Step, Step]`**, not `Step[]`. Uniform rows per exchange is
what keeps `head` coherent; an array would let one exchange grow a row, which type-checks, renders,
and desyncs the prompt box on the third cycle. The tuple makes it a compile error. `runCycle` walks
`ROWS_PER_EXCHANGE - 1` and treats `GAPS` as a lookup with a fallback, so the COPY drives the walk
and a gap-list mismatch degrades instead of desyncing.

**3. The status strip**, from the user's screenshot: `[audit] clix code · read only` left,
`~/audit` pushed right, inside the prompt box above the input. 11px so it costs 17.6px at both
tiers and matches `MockWindow`'s title bar register. ⚠️ The reference named a model
(`claude-opus-4.6`); ours does not, per the no-Anthropic rule. ⚠️ `·` is **U+00B7, inside the
Latin-1 block the font covers** — the reference's `↵` (U+21B5) is not, so there is no return
arrow and no `⇥` tab hint. Verified: the only non-ASCII character anywhere in the window is `·`.

### ⚠️ The body budget had never subtracted its own padding

Adding the strip made the prompt box clip **5px past the window's border**, and the cause was
older than the strip. Every revision of the `bodyClassName` note compared the children's sum
against the body's HEIGHT (`362`), but the body is `border-box` with `py-5`, so what children
actually get is `362 - 40 = 322`:

| | needed | available | |
|---|---|---|---|
| six rows (2026-08-13) | 329.4 | 322 | **7.4 over**, absorbed invisibly by the bottom padding |
| ten rows | 347 | 322 | **25 over**, `scrollHeight` 367 vs `clientHeight` 362 |

A screenshot showed a box that merely looked tight; only `scrollHeight > clientHeight` caught it.
Fixed by growing the window rather than dropping a row, since the user had asked for taller:

| | before | after |
|---|---|---|
| window | 400 / 360 | **440 / 380** |
| body | 362 / 326 | **402 / 346** |
| available (padding subtracted) | 322 / 294 | **362 / 314** |
| needed | 347 / 299.8 | unchanged |
| slack | **-25 / -5.8** | **+15 / +14.2** |
| `BOX.h` | 660 | **700** |
| `#first` | 1336 / 1032.41 / 977.19 | **1376 / 1072.41 / 997.19** |

⚠️ **Compare against `available`, never against `h-[]`.** That is the whole lesson, and the note
in the component now says so.

#### Fourth round, same day: a boot sequence, and real model names

The user sent a screenshot of the real CLI's slash menu: *"at first it selects agent you can put
claude models there then it selects fable or something then it starts the operation it has now"*.

**The window now opens EMPTY and fills itself.** `/agent` types into the box, a roster prints, one
is picked; `/model` types, three models print, `claude-fable-5` is picked; then the endless
exchange begins and the boot never replays.

⚠️ **This reverses the no-Anthropic rule, for exactly three strings, on the user's explicit call.**
They were asked directly, shown a neutral-tier alternative, and chose real model names. The
reversal is coherent rather than a contradiction because (a) the home page's live ticker already
names GPT, Gemini, Grok and DeepSeek in public — a model picker is that same register, not the
endorsement badge the rule was written against — and (b) the rule's *second* reason survives
intact: the agent's sentences are still clix's, spoken by `clix audit`, and no security claim is
attributed to a model. The header keeps both reasons and says so.

⚠️ **The IDs are real and current** — `claude-opus-5`, `claude-fable-5`, `claude-sonnet-5`, taken
from the model reference, NOT from the user's screenshot, which showed `claude-opus-4.6`, a
version string that does not exist. A wrong ID on a security page is the same class of small
false detail this repo strips elsewhere.

**The architecture change: scenes, and a played-once prefix.**

| | before | after |
|---|---|---|
| model | one integer walking one array | a `head` **and** a `scene` index, advancing together |
| invariant | `(head + VISIBLE_ROWS) % ROWS_PER_EXCHANGE === 0` | **retired** — no longer needed |
| array | `LINES`, wrapped on its whole length | `FLAT`, wrapped only within `LOOP_LEN` |

⚠️ **Retiring the modular invariant is a simplification, not a loss.** It required every exchange
to contribute the same row count so `head + VISIBLE_ROWS` always landed on a prompt — which the
boot steps (four rows) and the exchanges (five) cannot both satisfy. Tracking a scene index makes
row counts free: the box types `SCENES[scene].typed` and `head` advances by exactly that scene's
length, so they cannot drift however many rows a scene has.

⚠️ **`lineAt(n)` is the one place the boot-then-loop shape lives** — `n < 0` → blank, `n <
BOOT_LEN` → the boot, otherwise wrap within the exchanges. Wrapping on `LOOP_LEN` rather than
`FLAT.length` is what makes the boot **unrepeatable**: past `BOOT_LEN` no arithmetic reaches back.
`runScene`'s scene wrap goes to `LOOP_SCENE_0`, never 0, for the same reason — the two agree
without either checking the other.

⚠️ **`HEAD_0` and `HEAD_BOOT` are deliberately different starting points.** `HEAD_0` is the STATIC
state (SSR, JS-off, reduced motion) and points into the looping tail, so a visitor who never sees
the animation still gets a populated window making clix's real claims. `HEAD_BOOT` is
`-VISIBLE_ROWS` — every visible row resolves through `lineAt`'s negative arm to a blank, with
`FLAT[0]` waiting below the clip. **The animated branch therefore rewinds `head` before it fades
anything in**, while rows are still at `opacity: 0`, so no frame shows the swap.

⚠️ **The row stagger is gone**, as a consequence of the rewind rather than a style change: every
row is blank at intro time, so staggering ten empty lines was 0.7s of nothing.

**Verified over CDP** (recorder installed pre-navigation, so the opening frames are caught):

| t | filled rows | box |
|---|---|---|
| 365ms | 11 (SSR, populated) | `where does my data get processed` |
| 962ms | **1** — the hidden row only; all ten visible rows blank | `/agent` |
| 3.5s+ | climbs as the boot prints | — |

Boot visibility over 117s: **one contiguous run, then never again** — `1111…1110000…` — confirming
it plays exactly once. Final strip is a clean exchange trace with correct markers.

#### Follow-up: the strip shows what the boot picked

*"the model selected should be shown in the reply box also, look how kiro has it"* — the reference
strip reads `[plan] kiro_planner · claude-opus-4.6`, i.e. mode, agent, **model**. Ours read
`[audit] clix code · read only`, which named neither selection.

Now `[audit] clix audit · claude-fable-5`, and both fields are **live**: blanked at the rewind
(the strip is just `[audit]` and the path while nothing is chosen), then filled as each `pick` row
finishes streaming — appended *after* `streamInto`, so the strip commits in the same beat the
transcript prints the choice rather than knowing before the pick appears. The separator hides
until the model exists, or it floats alone through the whole `/agent` step.

⚠️ **A `pick` row now carries `field` + `value`, and its printed text is derived** via
`pickText`. The selection has two consumers (the transcript row and the strip) and hand-writing
both is exactly the bug this ask describes: change the picked model and the strip still advertises
the old one. `AGENT_0` / `MODEL_0` are read back out of `BOOT`, so SSR, the teardown and the boot
all agree by construction.

`read only` left the strip — the model earns the slot, and that line already appears in the
transcript as a `scope` result. `~/audit` is now `hidden tablet:block`: the left group grew to 35
columns against the phone strip's ~46, and `MockWindow`'s title bar already reads
`clix@production: ~/audit` directly above it.

#### Follow-up: the boot runs on its own clock, and the columns were collapsing

*"make this stage of the bot reply faster"*. The boot was borrowing the exchange pace, and every
one of those numbers is tuned for something the boot is not:

| | exchange pace | why it was wrong for boot | boot pace |
|---|---|---|---|
| typing | human model: tempo, think-pauses, ~2-in-5 fumble | `/agent` is six characters of muscle memory, not a question being weighed — the human model made it a hesitant crawl | even strokes 30-60ms, **no pauses, no slips** |
| arrival gaps | 0.3-0.95s, rising | a menu is not a reply; a real CLI prints one at once | 50-120ms for the three options, **0.22-0.4s only before the pick** |
| slide | 0.35s | ten of those is 3.5s of pure scrolling before the security content | **0.16s** |
| stream | 1-4 chars @ 18-45ms | a menu is printed, not generated | 2-6 chars @ 6-16ms |

One `fast` flag on the Scene picks the whole clock — typing model, slide, gaps, stream and dwell
all read off that single line in `runScene`, nowhere else.

**Measured: boot play time 4.94s**, down from roughly fourteen. It is setup, not content; the
exchanges are what a visitor is meant to read.

#### ⚠️ `truncate` was collapsing every run of spaces in the transcript

Visible in the user's screenshot: `clix audit    security review` rendered as `clix audit security
review`, so the two-column menus came out ragged. `truncate` expands to `overflow-hidden
text-ellipsis whitespace-nowrap`, and **`nowrap` collapses a run of spaces to one**. It had been
quietly eating the result rows' gaps too (`region  eu-west-1` → `region eu-west-1`) since those
rows were written.

Fixed by spelling the utilities out with **`whitespace-pre`** — preserves the runs, still refuses
to wrap, clipping behaviour unchanged. Spelled out rather than `truncate whitespace-pre` because
`truncate` would re-assert `nowrap` from whichever rule the scanner emits last. Verified: both
menu label columns now measure identically across all three rows (121.14px and 147.09px).

#### ⚠️ A blank row had zero height, and that one fact caused everything that looked broken

The user's screenshots showed `/model` already printed in the transcript while the box was still
typing it, and the boot's content growing DOWNWARD from the welcome panel instead of scrolling up
into it. Both are one bug, measured 2026-08-14: **a row whose text is `""` has no content, so its
`<li>` collapsed to 0px.** Ten of them in the boot's opening screen:

| consequence | why |
|---|---|
| the slide travelled 0px | `rowH()` measures `rows[0]`, which during boot is blank |
| content bunched at the top of the clip | nine zero-height rows above it took no space |
| **the eleventh row stopped being hidden** | with ten collapsed rows above it, the row that sits BELOW the clip sat inside it - so the next command was visible before it was typed |

Fixed by pinning `h-[1.6em]` on every row, which is what the clip's own
`calc(VISIBLE_ROWS * 1.6em)` has always assumed; it also makes `rowH()` content-independent.
⚠️ **The class lives in a shared `ROW_CLASS` constant because `paint()` rebuilds
`row.className` every tick** - a height written only in the JSX would be wiped on the first
advance, the same drift `rowLook` exists to prevent.

**Verified:** every row 22.4px, zero zero-height rows, row 10 at top=223.9 against a 224px clip
(i.e. exactly below the fold), and content now enters at the bottom and scrolls up.

#### The prompt line got its working directory

*"add some directory maybe beside the >, you can see how cmd actually looks in real"* - with a
`C:\Users\miko>` screenshot. A bare `>` reads as an empty box; `~/audit >` reads as a shell waiting for
input. `CWD` is one constant feeding both the prompt and `MockWindow`'s title.

⚠️ **Tablet+ only.** The phone box is 306px inner at 12px = ~42 columns, and `~/audit >`
(10 with its gap) + the longest prompt (33) + the caret is 44. The path is the part that can go,
since the title bar directly above already reads `clix@production: ~/audit`. For the same reason
the path was **removed from the status strip** - keeping it would print `~/audit` twice in one
box at tablet+.

### Still open

- The **drag regression the previous session was chasing was never confirmed** — its probe ran
  against a dev server that was serving 500s (Turbopack's PostCSS worker could not spawn, because
  a stale `next start -p 3008` was reading the same `.next` that `next dev -p 3001` was writing).
  Cleared and restarted; **the drag has not been re-probed since**. Do not treat "the terminal
  pane only drags from its title bar" as a finding — it has no evidence behind it.
- Console and terminal copy **still unsigned by the user**, as of the third pass.

---

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
