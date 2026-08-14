"use client";

/**
 * SecurityTerminal — the terminal-window mock in the `/security` hero (`#first`).
 *
 * ⚠️ THIS IS NOT A CLONE. Everything else under `src/components/security/` is measured off
 * `docs/reference/target/rogo-security-2026-08-12.{html,css}`; this file has no counterpart on
 * the target and every number in it is OURS. Added 2026-08-13 on the user's instruction, after
 * their boss pointed at kiro.dev's hero composite and asked for "coding effects, since it is the
 * security section". Spec: features/security-page/FEATURE.md → "Block 1b — Terminal". Do not
 * treat the values here as measured evidence; they are design decisions and may be tuned freely.
 *
 * ⚠️ THIRD PASS, 2026-08-14, AND THE SHAPE CHANGED — READ THIS BEFORE EDITING.
 * Pass 1 typed one log and froze. Pass 2 became an endless feed of security checks, because the
 * user said "ours after the animation it's static but in kiro it's continuously coding and stuff".
 * Pass 3 is this: the user asked to "make it look like claude code in terminal that its prompting
 * some security features, and claude actually response". So a one-way feed became a TWO-WAY
 * EXCHANGE — a prompt types itself into a prompt box, lands in the transcript, and the agent
 * answers with a tool call, a result and a sentence, forever. Being endless is still the
 * requirement; do not revert it to a fixed transcript.
 *
 * ⚠️ FOURTH PASS, SAME DAY: "increase the height of the terminal, and make the typing random
 * speed to make it look more natural". Two changes and they are unrelated to each other:
 *   · The window went 320 -> 400 (tablet+) and 288 -> 360 (phone), which is six visible rows to
 *     TEN. That number is NOT free — see the `bodyClassName` note, and the three sibling files
 *     listed there that had to move with it.
 *   · Every duration in this file became a RANGE sampled per cycle, and the prompt's typing
 *     stopped being a `steps()` tween. It now schedules one glyph at a time with think-pauses
 *     after spaces and roughly two prompts in five fumbling a key and backspacing over it. Do
 *     not "simplify" that back to a single eased tween: an ease is uniform by construction, and
 *     uniformity is the exact thing the user was objecting to.
 *   · SECOND ROUND, same day: *"still fast, it should be random speed, sometimes lowkey fast
 *     something slow"*. The first attempt randomised PER GLYPH, which averages out over thirty
 *     of them and reads as one speed. Tempo now varies per PROMPT and per RUN of characters —
 *     see the `MODES` / `TEMPO` block. Randomness below the character is invisible; keep it
 *     above.
 *   · THIRD ROUND, same day: *"the response of the terminal claude, can you make it like typing
 *     but also but fast, cuz right now it just spawns and also add more coding terms"*. Two
 *     changes. The agent's rows no longer arrive complete — they STREAM, in 1-4 character chunks
 *     rather than keystrokes, because a model emits tokens and a hand presses keys, and the two
 *     motions should not look alike (`streamInto`). And each answer now makes TWO tool calls
 *     instead of one, so an exchange is SIX rows rather than four: `Read(infra/deploy.tf)`,
 *     `Bash(git remote show origin)`, `Grep(retention, config/run.yml)`. ⚠️ The extra rows are
 *     code artifacts, never new claims — the five `say` lines are untouched and still map 1:1
 *     onto the Compliance band's five cells.
 *
 * ─── ⚠️ THE AGENT IS `clix`, AND ANTHROPIC IS NEVER NAMED (user's call, 2026-08-14) ──────
 * The LAYOUT is Claude Code's — the welcome panel, the pinned prompt box, the `⏺` bullets, the
 * `⎿` result elbows. The NAME is not, and no string here mentions Claude or Anthropic. Two
 * reasons, and both are this repo's standing rules rather than caution for its own sake:
 *   1. Naming a third party's product on clix's own security hero implies a partnership or an
 *      endorsement clix has not stated anywhere. That is the same class of unbacked claim that
 *      took the SOC 2 / ISO 27001 / CCPA / GDPR / EU AI Act seals off the home page on
 *      2026-08-05 and off /product on 2026-08-12.
 *   2. Every sentence the agent "says" below is an assertion about clix's OWN security posture.
 *      Those must be in clix's voice, not attributed to someone else's model.
 *
 * ─── ⚠️⚠️ FRAGMENT MONO CANNOT RENDER A SINGLE ONE OF CLAUDE CODE'S GLYPHS ───────────────
 * THIS IS THE CONSTRAINT THE WHOLE FILE IS BUILT AROUND. `src/app/fonts.css` declares the face's
 * Latin subset as:
 *
 *     U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308,
 *     U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD
 *
 * Every character that CLI's interface is drawn from falls OUTSIDE it:
 *
 *     U+23FA  the agent bullet          not in range
 *     U+23BF  the result elbow          not in range
 *     U+273B  the spinner / logo mark   not in range
 *     U+2500-257F  box drawing          not in range
 *     U+2610 / U+2612  todo boxes       not in range
 *     U+2713  the check mark            not in range
 *     U+2192  the right arrow           NOT IN RANGE — only U+2191 and U+2193 are
 *
 * A character outside the range falls back to the SYSTEM monospace at a DIFFERENT ADVANCE WIDTH,
 * which shears every column beside it. So all of them are DRAWN IN CSS here, never typed:
 * the bullet is a disc, the elbow is a bordered box, the panels are real borders, the caret is a
 * filled box. That is not a compromise — an elbow drawn with `border-b` + `border-l` IS the shape
 * U+23BF names, and a real `rounded-[6px]` border beats four corner glyphs. Same reasoning that
 * already made the dot-matrix a grid of spans rather than block characters.
 *
 * ⚠️ THE ONLY SAFE CHARACTERS IN THIS FILE'S COPY ARE ASCII. Before adding a glyph anywhere in
 * `EXCHANGES` or the markup, check it against the range above. There is a CDP assertion for this
 * in the verification list; it exists because the failure is silent and looks like bad kerning.
 *
 * ─── ⚠️ IT BREAKS THIS PAGE'S "NO MOTION" FINDING, DELIBERATELY ──────────────────────────
 * SecurityHero, SecurityBenefits, SecurityCompliance and SecurityCore all state that the
 * target's `data-framer-appear-id` count is 0 and that nothing on the page animates, and
 * FEATURE.md ticks that as verified. That finding is still TRUE OF THE TARGET. This component
 * is an addition on top of it, recorded in the deviations table rather than quietly folded in.
 * Those four files stay motionless; do not read this one as a licence to animate them.
 *
 * ─── ⚠️ NOTHING OF KIRO'S PALETTE COMES OVER ────────────────────────────────────────────
 * kiro.dev is lavender-purple and colour-codes status; the CLI this borrows its layout from is
 * likewise coloured. This site is monochrome by rule (docs/DESIGN-SYSTEM.md): `--color-forest`
 * belongs to /clix and `--color-price-low/high` are semantic-only and may never be used as
 * accents. So hierarchy here is carried by FILL AND OPACITY instead of by hue, and the window is
 * built from tokens that already existed. NO new token, NO new colour, NO new keyframe.
 *
 * ─── ⚠️ `muted` IS KEPT OFF EVERY READABLE STRING, AND THAT IS THE POINT ─────────────────
 * `muted` #737373 on `ink` #151515 is 3.85:1 and already fails AA in five inherited places on
 * this site (home, the footer, /product, /careers, and this page's own 14px cell labels). Those
 * are the target's pairing; THIS component is ours, so it must not add a sixth. `muted` carries
 * only the traffic dots, the dot-matrix and the elbow rules — non-text decoration, which answers
 * to WCAG 1.4.11's 3:1 floor and clears it at 3.53:1. Every string a person reads is
 * `paper-soft` (11.84:1) or `paper` (18.26:1). Do not "tidy" a transcript row onto `muted`.
 *
 * ─── ⚠️ ENGLISH AND LTR IN BOTH LOCALES, ON PURPOSE (user's call, 2026-08-13) ────────────
 * `MockWindow` carries `dir="ltr"` so /he/security renders this unmirrored, and NOTHING here
 * comes from the dictionary. CLI output is a code artifact, not prose: mirroring a monospace
 * window reads as broken, and a Hebrew sentence followed by a latin identifier cannot hold a
 * column. That is why this file never reaches for `usePageDict` even though it could.
 *
 * ─── ⚠️ THE WHOLE WINDOW IS `aria-hidden`, WHICH IS ALSO WHAT LICENSES THE DOM CHURN ────
 * Every claim printed here appears verbatim as real prose in the Compliance band further down
 * this same page, so a screen-reader user loses nothing — while a monospace pseudo-terminal read
 * aloud is worse than silence, and an endless exchange announced politely every 5s would make the
 * page unusable. Same reasoning the five badge marks already use (`alt="" aria-hidden="true"`).
 * It is ALSO the reason `paint()` and the typing below are allowed to rewrite `textContent` on a
 * loop: the a11y objection to mutating text does not apply to a subtree the a11y tree cannot see,
 * and the rows are fixed-height so nothing reflows. Nothing here is focusable, so the page's
 * focus order is unchanged: one control in <main>, the hero CTA.
 */

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MockWindow from "@/components/security/MockWindow";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─── Copy ────────────────────────────────────────────────────────────────────────────────
   ⚠️ EVERY ANSWER MAPS 1:1 ONTO A PRACTICE THIS PAGE ALREADY STATES IN PROSE, and that rule
   binds HARDER here than it did on the feed it replaces. A terminal that answers a question is
   far more persuasive than one tailing a log, and a product screenshot is already the most
   convincing thing on a marketing page. This repo has stripped unbacked claims twice — the
   SOC 2 / ISO 27001 / CCPA / GDPR / EU AI Act seals came off the home page on 2026-08-05 and off
   /product on 2026-08-12 — and an agent confidently answering security questions is exactly how
   one walks back in wearing a new costume.

   So the five exchanges are the five practice cells of the Compliance band, in its order:

     region     -> the `your-cloud` cell
     retention  -> the `your-data` cell
     scope      -> the `least-privilege` cell
     secrets    -> the `encrypted` cell
     source     -> the `ownership` cell

   ⚠️ There is deliberately NO pass/fail verdict, NO "0 vulnerabilities" and NO compliance score.
   Those would be results this repo cannot produce a report for. Two FEATURE.md open questions
   still bear on exchanges 3 and 4 (Benefit 3 assumes per-run logs exist; Benefit 5 names TLS and
   a managed secret store). If either is answered "no", those two come out with it.

   NO DASHES IN CLIX COPY (standing user request) — hence `read only`, not `read-only`.
   `eu-west-1` is an identifier, not punctuation, so it keeps its hyphens.

   ⚠️ THE COLUMN BUDGET IS 43 CHARACTERS AND IT BINDS AT THE PHONE TIER. Inner width there is
   358 - 2 (border) - 32 (padding) = 324px; Fragment Mono's advance is 0.6em, so at 12px that is
   45 characters, less the 2ch marker column = 43. The longest string below is the exchange 3
   answer at 39 + 2 = 41. MEASURE a new string against 43 rather than eyeballing it — a longer
   one is silently truncated at 390 and nowhere else. */
/** One tool call and what it returned. */
type Step = {
  /** Shaped like a real call: `Verb(subject)`. */
  tool: string;
  /** Rendered under the elbow. */
  result: string;
};

type Exchange = {
  /** What the visitor is asking. Types itself into the prompt box, then enters the transcript. */
  prompt: string;
  /* ⚠️ A FIXED-LENGTH TUPLE, NOT AN ARRAY, AND THE TYPE IS DOING REAL WORK. The whole animation
     is one integer walking a flat list, and that only stays coherent if EVERY exchange is the
     same number of rows — see the note on `LINES`. A `Step[]` would let someone add a third call
     to one exchange, which type-checks, renders, and then desynchronises the prompt box from the
     transcript on the third cycle. `[Step, Step]` makes that a compile error. */
  steps: readonly [Step, Step];
  /** The agent's answer in prose. THIS IS THE CLAIM — see the note above. */
  say: string;
};

/* ⚠️ TWO CALLS PER ANSWER SINCE 2026-08-14 (user: "add more coding terms, or tech stuff to make
   it more like coding"). One lookup answering a question read like a lookup; two, where the
   first establishes the ground and the second reads the actual value, reads like an agent
   working. The SECOND result is the one the sentence rests on — the first is context.

   ⚠️ THE EXTRA ROWS ADD TEXTURE, NEVER A CLAIM. Everything new below is a code artifact — a
   file path, a CLI invocation, a field name — and the page already establishes that vocabulary:
   the console window beside this one lists `sync.ts`, `auth.ts`, `schema.sql` with diff counts.
   What did NOT change is the rule above: the five `say` lines are still the five practice cells,
   still verbatim, and no result asserts an outcome this repo cannot produce a report for.
   ⚠️ Note `transit  tls` carries NO version number, deliberately. Benefit 5 (TLS + a managed
   secret store) is still an open question in FEATURE.md; naming a version would be inventing
   precision on top of a claim that is not yet signed off. */
const EXCHANGES: readonly Exchange[] = [
  {
    prompt: "where does my data get processed",
    steps: [
      { tool: "Read(infra/deploy.tf)", result: "provider  aws" },
      { tool: "Bash(clix env show)", result: "region  eu-west-1 (yours)" },
    ],
    say: "It runs in your cloud account, not ours.",
  },
  {
    prompt: "what do you keep after a run",
    steps: [
      { tool: "Grep(retention, config/run.yml)", result: "retention  none" },
      { tool: "Bash(clix runs artifacts 1482)", result: "artifacts  0 files" },
    ],
    say: "Nothing is stored once a run finishes.",
  },
  {
    prompt: "check the access this needs",
    steps: [
      { tool: "Audit(iam policy)", result: "actions  get, list" },
      { tool: "Read(tokens/github.json)", result: "scope  read only" },
    ],
    say: "Every credential is scoped to one task.",
  },
  {
    prompt: "verify how secrets are held",
    steps: [
      { tool: "Read(vault/kv/clix)", result: "backend  your vault" },
      { tool: "Audit(transport layer)", result: "transit  tls" },
    ],
    say: "Keys stay in your own vault.",
  },
  {
    prompt: "who owns the automation you write",
    steps: [
      { tool: "Read(.github/workflows/clix.yml)", result: "runner  yours" },
      { tool: "Bash(git remote show origin)", result: "source  your repo" },
    ],
    say: "The code lands in your repository.",
  },
];

/** The greeting in the welcome panel. Names clix, never the CLI it borrows its layout from. */
const GREETING = "Welcome to clix code";

/* ─── The boot sequence ───────────────────────────────────────────────────────────────────
   Added 2026-08-14 on a screenshot the user sent of the real CLI's slash menu: *"at first it
   selects agent you can put claude models there then it selects fable or something then it
   starts the operation it has now"*. So the window now OPENS EMPTY and fills itself: `/agent`
   types into the box, a roster prints, one is picked; `/model` types, a model list prints, one
   is picked; then the endless exchange begins and never replays this.

   ⚠️⚠️ THIS REVERSES THE NO-ANTHROPIC RULE IN THE HEADER, AND ONLY FOR THESE THREE STRINGS.
   The rule stands everywhere else in this file and the header keeps both its reasons. The user
   was asked directly on 2026-08-14, was shown the neutral alternative, and chose real model
   names. Two things make that coherent rather than a contradiction:
     1. The home page's live ticker already names GPT, Gemini, Grok and DeepSeek in public. A
        model picker is the same register as that ticker — a list of what the platform can run —
        and is NOT the endorsement badge the rule was written against.
     2. The rule's second reason survives intact: the agent's SENTENCES are still clix's, spoken
        by `clix audit`, and no security claim below is attributed to a model. A model is named
        as a runtime, in a picker, once, during boot.
   Do not read this as licence to name a model anywhere else in the file.

   ⚠️ THE IDS ARE REAL AND CURRENT, taken from the model reference on 2026-08-14 — NOT from the
   user's screenshot, which showed `claude-opus-4.6`, a version string that does not exist. If
   these ever need updating, check the reference rather than editing them by eye; a wrong ID on a
   security page is exactly the kind of small false detail this repo strips elsewhere.
   Hyphens are fine here for the same reason `eu-west-1` keeps its: an identifier, not
   punctuation. See the no-dashes note above. */
/* ⚠️ A `pick` ROW CARRIES THE VALUE, NOT A SENTENCE, and its printed text is DERIVED from it.
   The selection has two consumers — the transcript row and the prompt box's status strip — and
   the user's follow-up ("the model selected should be shown in the reply box also") is exactly
   the bug two hand-written copies would produce: change the picked model here and the strip
   still advertises the old one. `field` + `value` is the single source; `pickText` renders it. */
type BootRow =
  | { kind: "menu"; text: string }
  | { kind: "pick"; field: "agent" | "model"; value: string };
type BootStep = { typed: string; rows: readonly BootRow[] };

const BOOT: readonly BootStep[] = [
  {
    typed: "/agent",
    rows: [
      { kind: "menu", text: "clix audit    security review" },
      { kind: "menu", text: "clix build    automation authoring" },
      { kind: "menu", text: "clix watch    run monitoring" },
      { kind: "pick", field: "agent", value: "clix audit" },
    ],
  },
  {
    typed: "/model",
    rows: [
      { kind: "menu", text: "claude-opus-5    agentic coding" },
      { kind: "menu", text: "claude-fable-5   long horizon work" },
      { kind: "menu", text: "claude-sonnet-5  speed and cost" },
      { kind: "pick", field: "model", value: "claude-fable-5" },
    ],
  },
];

/** How a selection prints in the transcript: the field, two spaces, the value. */
const pickText = (r: Extract<BootRow, { kind: "pick" }>) =>
  `${r.field}  ${r.value}`;

/** What the boot settles on, read back out of it — the strip's resting state and SSR's. */
const picked = (field: "agent" | "model") => {
  for (const step of BOOT)
    for (const r of step.rows)
      if (r.kind === "pick" && r.field === field) return r.value;
  return "";
};
const AGENT_0 = picked("agent");
const MODEL_0 = picked("model");

/* ─── The transcript's line model ─────────────────────────────────────────────────────────
   The kinds of row. A row's appearance is a function of WHAT IT IS, not of where it sits — the
   one exception being the bottom slot's brightness, which is handled separately below.
   `cmd`, `menu` and `pick` arrived with the boot sequence on 2026-08-14; `blank` is the empty
   row the window opens on, and exists so "nothing has printed yet" is a LINE rather than a
   special case threaded through `paint()`. */
type Kind =
  "blank" | "prompt" | "cmd" | "menu" | "pick" | "tool" | "result" | "say";
type Line = {
  kind: Kind;
  text: string;
  /* Set only on a boot `pick`: which status-strip field this row commits, and to what. The
     runner applies it as the row finishes streaming, so the strip updates in step with the
     transcript rather than ahead of it. */
  sets?: { field: "agent" | "model"; value: string };
};

const BLANK: Line = { kind: "blank", text: "" };

/* ─── Scenes: one typed line, then the rows it produces ───────────────────────────────────
   ⚠️ THE WHOLE WINDOW IS STILL ONE INTEGER WALKING ONE ARRAY. What changed on 2026-08-14 is
   that the array now has a PLAYED-ONCE PREFIX (the boot) followed by a LOOPING TAIL (the five
   exchanges) — see `lineAt`. A scene is the unit both halves share: the visitor types one line,
   and some number of rows follow it.

   ⚠️ THIS IS WHAT RETIRED THE `% ROWS_PER_EXCHANGE` INVARIANT, and that is a simplification
   rather than a loss. The old model required every exchange to contribute the same number of
   rows so that `head + VISIBLE_ROWS` always landed on a prompt; the boot steps contribute five
   rows where an exchange contributes six, which that rule could not express. Tracking a SCENE
   INDEX alongside `head` makes the row counts free: the box types `SCENES[scene].typed` and
   `head` advances by exactly that scene's length, so the two cannot drift no matter how many
   rows any one scene has. */
type Scene = {
  typed: string;
  rows: readonly Line[];
  /** Boot steps run on the quick clock — see the `BOOT_*` timing block. */
  fast?: boolean;
};

const BOOT_SCENES: readonly Scene[] = BOOT.map((step) => ({
  typed: step.typed,
  fast: true,
  rows: step.rows.map((r) =>
    r.kind === "pick"
      ? {
          kind: "pick" as const,
          text: pickText(r),
          sets: { field: r.field, value: r.value },
        }
      : { kind: "menu" as const, text: r.text },
  ),
}));

const LOOP_SCENES: readonly Scene[] = EXCHANGES.map((x) => ({
  typed: x.prompt,
  rows: [
    ...x.steps.flatMap((s) => [
      { kind: "tool" as const, text: s.tool },
      { kind: "result" as const, text: s.result },
    ]),
    { kind: "say" as const, text: x.say },
  ],
}));

const SCENES: readonly Scene[] = [...BOOT_SCENES, ...LOOP_SCENES];

/** A scene's typed line is a `cmd` when it starts with `/`, a `prompt` when it is a question. */
const typedLine = (s: Scene): Line => ({
  kind: s.typed.startsWith("/") ? "cmd" : "prompt",
  text: s.typed,
});

/* The flat transcript, in play order: every boot row, then every exchange row. */
const FLAT: readonly Line[] = SCENES.flatMap((s) => [typedLine(s), ...s.rows]);

const sceneLen = (s: Scene) => 1 + s.rows.length;
/** Where the looping tail starts. Everything before this index plays exactly once, at boot. */
const BOOT_LEN = BOOT_SCENES.reduce((n, s) => n + sceneLen(s), 0);
const LOOP_LEN = FLAT.length - BOOT_LEN;
/** The scene the walk returns to forever, i.e. the first exchange — never back to boot. */
const LOOP_SCENE_0 = BOOT_SCENES.length;

/* ⚠️ THE ONE PLACE THE BOOT-THEN-LOOP SHAPE LIVES. Three regions, and every reader of the
   transcript goes through here:
     n < 0            the window before anything has printed — a blank row
     n < BOOT_LEN     the boot, played once and never returned to
     otherwise        the exchanges, wrapping within their own span
   Wrapping on `LOOP_LEN` rather than on `FLAT.length` is what makes the boot unrepeatable: once
   the walk passes `BOOT_LEN` there is no arithmetic that can take it back. */
const lineAt = (n: number): Line =>
  n < 0
    ? BLANK
    : n < BOOT_LEN
      ? FLAT[n]
      : FLAT[BOOT_LEN + ((n - BOOT_LEN) % LOOP_LEN)];

/* ⚠️ TEN VISIBLE, ELEVEN RENDERED — WAS SIX AND SEVEN UNTIL 2026-08-14, when the user asked for
   a taller window. Ten is not a free number: it is the largest row count the 400px window can
   hold at the TABLET+ tier, which is the binding one because its rows are taller (22.4 vs 19.2).
   The arithmetic is in the `bodyClassName` note at the bottom of this file; if you change either
   this or those two heights, re-derive the other or the transcript overflows its body.

   Ten rows means two and a half exchanges are on screen at once instead of one and a half, so a
   visitor arriving mid-cycle sees a question, its whole answer, AND the tail of the one before —
   which is what makes it read as a session rather than as a ticker.

   The eleventh sits below the clip and is what slides INTO view on each tick — without it the
   incoming row would pop in at the bottom edge instead of arriving. It is ALSO the row the
   prompt box reads its text from; see `LINES` above.
   The viewport height is expressed as `VISIBLE_ROWS * 1.6em` rather than in pixels so it stays
   exactly ten rows tall at BOTH type sizes (14px → 224, 12px → 192) with no second value to keep
   in sync. Same shape as ProductStepper's `rows-up`, whose comment warns that a hardcoded travel
   silently desyncs from its row height — here the travel is MEASURED off a live row instead. */
const VISIBLE_ROWS = 10;
const RENDERED_ROWS = VISIBLE_ROWS + 1;

/* ⚠️ TWO STARTING POINTS, AND THEY ARE DELIBERATELY DIFFERENT.

   `HEAD_0` is the STATIC state — what SSR, JS-off and reduced-motion show. It points into the
   LOOPING tail so a visitor who never sees the animation still gets a populated window making
   clix's actual security claims, exactly as before the boot sequence existed. Derived so the
   hidden row lands on the first exchange's prompt: `head + VISIBLE_ROWS` comes to
   `BOOT_LEN + LOOP_LEN`, which `lineAt` wraps to `FLAT[BOOT_LEN]`.

   `HEAD_BOOT` is where the ANIMATED branch starts, and it is NEGATIVE on purpose: at
   `-VISIBLE_ROWS` every visible row resolves through `lineAt`'s `n < 0` arm to a blank, and the
   hidden eleventh row is `FLAT[0]` — the `/agent` command, already typed into the box. That is a
   terminal that has just been opened, which is the whole point of the sequence.

   ⚠️ THE ANIMATED BRANCH THEREFORE REWINDS `head` BEFORE IT FADES ANYTHING IN. The server sent
   the static screen; the boot has to start from an empty one. The swap happens while the rows
   are still at `opacity: 0`, so no frame shows the content changing. */
const HEAD_0 = BOOT_LEN + LOOP_LEN - VISIBLE_ROWS;
const HEAD_BOOT = -VISIBLE_ROWS;

/* ─── Timing. EVERY VALUE BELOW IS A RANGE AS OF 2026-08-14, AND THAT IS THE POINT ────────
   The user's note was "make the typing random speed to make it look more natural". A fixed
   number per beat is what made the old version read as a recording: two cycles were frame-for-
   frame identical, and a person watching for eight seconds could feel the loop. So the file no
   longer holds durations, it holds RANGES, and a cycle samples them when it is built.

   Estimates, all of them — there is no target to measure a rate against. A cycle now runs about
   5.5–8s depending on what it rolls, and the five exchanges loop in roughly 30–40s.

   The three arrival gaps still RISE (tool → result → say), because that ordering is what makes
   the exchange read as a reply rather than as three rows appearing together. Randomising them
   must not flatten that, so the ranges are staggered rather than overlapping wholesale: the
   slowest tool gap (0.7) is still below the slowest say gap (1.0), and the means stay ordered
   0.55 < 0.68 < 0.8. Widen one and check it still clears the one below it. */
type Range = readonly [number, number];
const rand = (r: Range) => gsap.utils.random(r[0], r[1]);

const SLIDE_S = 0.35;

/* ⚠️ THE VARIANCE HAS TO LIVE ABOVE THE CHARACTER, AND THE FIRST ATTEMPT PUT IT BELOW.
   2026-08-14, second round: *"the typing is still fast, it should be random speed, sometimes
   lowkey fast something slow"*. The version before this DID randomise — every glyph sampled its
   own delay, with a 24% chance of a fast one. It still read as one speed, and the reason is
   arithmetic rather than taste: thirty independent samples from one range AVERAGE OUT, so every
   prompt took about the same time and no stretch inside a prompt was faster than any other. Per
   character, the jitter was invisible.

   So tempo now varies at TWO scales above the glyph, which is where a person's does:

     1. PER PROMPT — one question gets typed briskly, the next haltingly. A single multiplier,
        rolled once per cycle, applied to every key in it.
     2. PER RUN — inside one prompt the hand moves in stretches: four to ten letters that are
        already muscle memory, then two to five picked out one at a time. A mode is chosen, held
        for a run of characters, then re-chosen.

   The two compose, so a slow-tempo prompt in a slow run is genuinely laboured and a fast one in
   a fast run rips. Weighted so ordinary is the default and neither extreme dominates. */
type Mode = {
  readonly key: Range;
  readonly run: Range;
  readonly weight: number;
};
const MODES: readonly Mode[] = [
  /* a run the fingers already know */ {
    key: [0.022, 0.05],
    run: [4, 10],
    weight: 0.3,
  },
  /* ordinary                       */ {
    key: [0.06, 0.13],
    run: [3, 8],
    weight: 0.5,
  },
  /* picking the words out          */ {
    key: [0.15, 0.3],
    run: [2, 5],
    weight: 0.2,
  },
];

/** Weighted pick. Walks the weights subtracting from one roll, so they need not be normalised. */
function pickMode() {
  let r = Math.random();
  for (const m of MODES) if ((r -= m.weight) < 0) return m;
  return MODES[MODES.length - 1];
}

/* ⚠️ THE PER-PROMPT MULTIPLIER, AND IT IS DELIBERATELY WIDE. At 0.7 a prompt of mostly-fast runs
   lands in about a second and a half; at 1.7 a prompt of slow ones takes seven. That spread IS
   the ask — a narrow range here would put the averaging problem straight back. */
const TEMPO: Range = [0.7, 1.7];

/* The beat AFTER a space, i.e. where a person stops to pick the next word. Only sometimes —
   pausing at every space reads as dictation. */
const THINK_S: Range = [0.09, 0.3];
const THINK_CHANCE = 0.32;

/* ⚠️ THE TYPO, WHICH IS THE ONE BEAT HERE THAT IS NOT DECORATION. Roughly two prompts in five
   fumble a letter, sit on it, backspace and carry on. It is the single strongest "a person is
   at this keyboard" signal available, and it costs one extra glyph of width for ~0.2s. */
const TYPO_CHANCE = 0.4;
const TYPO_NOTICE_S: Range = [0.13, 0.34];
const TYPO_RECOVER_S: Range = [0.07, 0.16];

const SUBMIT_HOLD_S: Range = [0.28, 0.7];
const DWELL_S: Range = [1.2, 2.3];

/* ⚠️ ONE GAP PER AGENT ROW. `runScene` uses this as a LOOKUP, not as its loop bound — the
   scene's own row count drives the walk, so a scene with more rows than this has entries simply
   reuses the last gap rather than desyncing the transcript from the prompt box. The boot steps
   contribute four rows and the exchanges five, which is exactly why the list cannot be the bound.
   The ranges RISE, and that ordering survives the randomising because they are staggered rather
   than overlapped wholesale: the answer lands last and slowest, which is what makes the whole
   thing read as a reply rather than as five rows appearing together. The two mid gaps are the
   tightest because a tool call and its own result belong together. */
const GAPS: readonly Range[] = [
  [0.3, 0.5], // the first call
  [0.28, 0.45], // ...and its result, close behind it
  [0.42, 0.68], // the second call
  [0.3, 0.5], // ...and its result
  [0.55, 0.95], // the sentence
];

/* ─── The agent's rows STREAM, where the visitor's prompt is TYPED ────────────────────────
   2026-08-14: *"the response of the terminal claude, can you make it like typing but also but
   fast, cuz right now it just spawns"*. It did just spawn — a row slid in fully formed.

   ⚠️ CHUNKS, NOT CHARACTERS, AND THE DIFFERENCE IS THE WHOLE POINT. The prompt box types one
   key at a time because a person presses one key at a time. A model does not; it emits tokens,
   so its text arrives a few characters at once and at a rate no hand could hold. Revealing the
   agent's rows in 1-4 character chunks at 18-45ms makes the two motions read as DIFFERENT KINDS
   OF THING sharing one window, which is exactly what the real CLI looks like. Same-mechanism
   typing for both would have flattened that back out.

   A 30-character row lands in roughly 0.35s. Fast, as asked. */
const STREAM_CHUNK: Range = [1, 4];
const STREAM_S: Range = [0.018, 0.045];

/* ─── The boot runs on its own clock, and it is much faster ───────────────────────────────
   2026-08-14: *"make this stage of the bot reply faster"*. The boot was borrowing the exchange
   pace, and every one of those numbers is tuned for something the boot is not:

     · the typing model is HUMAN — tempo, think-pauses, the occasional fumble. But `/agent` is a
       six-character command someone types daily; there is no word to think about and no reason
       to mistype it. Boot commands get an even, quick stroke and never fumble.
     · the arrival gaps are a CONVERSATION's rhythm, spacing a tool call from its result so the
       exchange reads as a reply. A menu is not a reply — a real CLI prints one all at once. The
       three options land almost together, and only the SELECTION gets a beat, because that is
       the one moment where something is being decided.
     · the slide is 0.35s at reading pace, and ten of those is 3.5s of pure scrolling before the
       security content starts. Boot rows travel in less than half that.

   Net effect: the sequence went from roughly fourteen seconds of play to under six. It is setup,
   not content — the exchanges are what a visitor is meant to read, and the boot should get out
   of their way. */
const BOOT_SLIDE_S = 0.16;
const BOOT_KEY_S: Range = [0.03, 0.06];
const BOOT_SUBMIT_HOLD_S: Range = [0.12, 0.26];
const BOOT_STREAM_S: Range = [0.006, 0.016];
const BOOT_CHUNK: Range = [2, 6];
const BOOT_DWELL_S: Range = [0.45, 0.8];
/* Three menu rows arriving almost together, then a real beat before the pick. */
const BOOT_GAPS: readonly Range[] = [
  [0.05, 0.12],
  [0.05, 0.12],
  [0.05, 0.12],
  [0.22, 0.4],
];

/* ⚠️ QWERTY NEIGHBOURS, AND ALL 26 ARE ASCII LOWERCASE — check the glyph-coverage block in the
   header before adding a key. A typo has to look like a FINGER landing one key early, not like a
   random character: `secrets` slipping to `sercets` is a person, `sec$ets` is a glitch. Each
   letter maps to the key to its left on the row, which is the miss a right-to-left reach makes. */
const NEIGHBOUR: Record<string, string> = {
  q: "w",
  w: "e",
  e: "w",
  r: "e",
  t: "r",
  y: "t",
  u: "y",
  i: "u",
  o: "i",
  p: "o",
  a: "s",
  s: "a",
  d: "s",
  f: "d",
  g: "f",
  h: "g",
  j: "h",
  k: "j",
  l: "k",
  z: "x",
  x: "z",
  c: "x",
  v: "c",
  b: "v",
  n: "b",
  m: "n",
};

/* An index worth fumbling: a letter that HAS a neighbour, and away from both ends of the string.
   Not the first two — there is nothing typed yet for the correction to read against. Not the
   last two — the backspace would land on the submit beat and read as a stutter rather than as a
   fix. Returns -1 when a prompt offers nowhere sensible, which the caller treats as "no typo". */
function slipIndex(text: string) {
  const spots: number[] = [];
  for (let i = 2; i < text.length - 2; i++)
    if (NEIGHBOUR[text[i]]) spots.push(i);
  return spots.length ? spots[Math.floor(Math.random() * spots.length)] : -1;
}

/* ─── The dot-matrix wordmark ─────────────────────────────────────────────────────────────
   kiro's hero prints a dot-matrix banner inside its terminal, and it is the element the user's
   boss picked out of the screenshot. As of 2026-08-14 it lives INSIDE the welcome panel rather
   than floating loose above the prompt, which is both what the real CLI does with its own logo
   and what keeps the window's height budget intact.

   ⚠️ RENDERED AS A GRID OF <span>s, NOT AS TEXT — see the glyph-coverage block in the header.
   Drawing it with block characters would put the layout at the mercy of the face's coverage:
   one missing character falls back to the system mono at a different advance and the banner
   shears. A grid of fixed-size boxes cannot do that.

   5 rows x 5 columns per letter, one blank column between letters → 23 columns, and 23px tall
   at BOTH type tiers because the dots are fixed pixels (5 x 3px + 4 x 2px gaps). That is why
   the welcome panel differs between tiers only by its padding. */
const GLYPHS: Record<string, readonly string[]> = {
  C: [".###.", "#...#", "#....", "#...#", ".###."],
  L: ["#....", "#....", "#....", "#....", "#####"],
  I: ["#####", "..#..", "..#..", "..#..", "#####"],
  X: ["#...#", ".#.#.", "..#..", ".#.#.", "#...#"],
};

/* Joined with a single blank column so the row strings stay the grid's source of truth and the
   column count is derived from them, never hand-counted. */
const MATRIX: readonly string[] = [0, 1, 2, 3, 4].map((row) =>
  ["C", "L", "I", "X"].map((ch) => GLYPHS[ch][row]).join("."),
);
const MATRIX_COLS = MATRIX[0].length;

/* ─── Row appearance, in ONE place ────────────────────────────────────────────────────────
   ⚠️ BOTH THE JSX AND `paint()` READ THIS, and that is the whole reason it exists. The server
   renders seven rows from it, and the loop rewrites those same seven rows from it on every tick;
   two copies of the rules is exactly how the animated state drifts from the static one. The old
   feed learned this with its `DOT_CLASS` constant — same lesson, wider scope.

   `bright` is the bottom visible slot, i.e. the row that just arrived. It is the only positional
   input left: everything else is a function of the row's KIND. */
const DOT_BASE = "block h-[7px] w-[7px] shrink-0 rounded-full";

/* ⚠️⚠️ `h-[1.6em]` IS LOAD-BEARING AND IT IS WHY THE BOOT LOOKED BROKEN. Measured 2026-08-14:
   a row whose text is `""` has NO CONTENT, so its `<li>` collapsed to ZERO HEIGHT — every blank
   row in the boot's opening screen was 0px tall. Three visible consequences, all one bug:
     1. `rowH()` measures `rows[0]`, which during boot is blank, so the slide travelled 0px.
     2. The remaining rows bunched at the TOP of the clip instead of sitting at the bottom of a
        ten-row column, so content grew downward from the panel rather than scrolling up into it.
     3. THE ELEVENTH ROW STOPPED BEING HIDDEN. With ten zero-height rows above it, the row that
        is supposed to sit below the clip sat inside it — which is exactly what the user saw:
        `/model` already printed in the transcript while the box was still typing it.
   Pinning the height makes a blank row occupy a line, which is what the clip's own
   `calc(VISIBLE_ROWS * 1.6em)` has always assumed. It also makes `rowH()` content-independent.

   ⚠️ SHARED WITH `paint()` ON PURPOSE. `paint()` rebuilds `row.className` on every tick, so a
   height class written only in the JSX would be wiped on the first advance — the same class of
   drift `rowLook` exists to prevent. Both read this constant. */
const ROW_CLASS = "flex h-[1.6em] items-center";

/** The working directory, shown in the title bar and beside the prompt. One source, two uses. */
const CWD = "~/audit";

function rowLook(kind: Kind, bright: boolean) {
  /* `paper` is for the lines that are the POINT — what the visitor asked, what the agent chose,
     what it concluded. `paper-soft` is for the MACHINERY around them: the tool calls, their
     results, and the menu options nobody picked. That alternation is what gives the transcript
     its rhythm, and it is why a menu row and a `pick` row differ in weight rather than in colour
     (this window has no palette to spend — see the header). */
  const bright_ =
    kind === "prompt" || kind === "cmd" || kind === "pick" || kind === "say";
  return {
    text: bright_ ? "text-paper" : "text-paper-soft",
    /* `>` marks a line the visitor typed — a question or a slash command, both are theirs. */
    chevron: kind === "prompt" || kind === "cmd",
    /* The agent bullet: on a tool call, on a boot selection, and on the answer. */
    dot: kind === "tool" || kind === "pick" || kind === "say",
    dotClass: `${DOT_BASE} ${bright ? "bg-paper" : "bg-paper-soft"}`,
    /* The elbow hangs only under a tool call, on its result. */
    elbow: kind === "result",
    /* ⚠️ A MENU ROW CARRIES NO MARKER AT ALL, and the empty 2ch column is what indents it —
       there is no padding rule anywhere for this. That is the same trick the real CLI's option
       lists use, and it means an option and a typed line share one grid instead of two. */
  };
}

/** `display` values, since `paint()` toggles the three markers rather than re-creating them. */
const show = (on: boolean) => (on ? "" : "none");

export default function SecurityTerminal() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const panel = q("[data-tm-panel]");
      const list = q("[data-tm-list]")[0] as HTMLElement | undefined;
      const rows = q("[data-tm-row]") as HTMLElement[];
      /* Resolved ONCE. `paint()` only ever rewrites these nodes' text — it never replaces them —
         and the streaming below has to reach the same node from a timeline callback, so a cached
         array beats re-querying eleven rows on every tick and again on every chunk. */
      const texts = rows.map(
        (r) => r.querySelector("[data-tm-text]") as HTMLElement | null,
      );
      const box = q("[data-tm-box]");
      /* The status strip's two live fields plus its separator. Optional chaining everywhere they
         are used, so a markup edit that drops one degrades to "the strip does not update"
         rather than throwing inside a timeline callback. */
      const agentEl = q("[data-tm-agent]")[0] as HTMLElement | undefined;
      const modelEl = q("[data-tm-model]")[0] as HTMLElement | undefined;
      const sepEl = q("[data-tm-sep]")[0] as HTMLElement | undefined;
      const cmd = q("[data-tm-cmd]")[0] as HTMLElement | undefined;
      const caret = q("[data-tm-caret]");
      if (!list || !cmd || rows.length !== RENDERED_ROWS) return;

      /* ⚠️ MEASURED off a live row, not hardcoded. The travel has to equal the row height at
         whichever type tier is live (22.4px at 14px, 19.2px at 12px), and a literal would be
         right at one tier and visibly wrong at the other — the exact failure ProductStepper's
         `rows-up` keyframe documents and cannot avoid, because a keyframe cannot be
         parameterised. A tween can, so this one is. */
      const rowH = () => rows[0].getBoundingClientRect().height;

      /* ⚠️ TWO PIECES OF STATE NOW, NOT ONE, and they advance together by construction.
         `head` is where the transcript window sits in the flat line list; `scene` is which
         scene the box is typing. Every scene advances `head` by exactly `sceneLen`, so the two
         cannot drift — see the note on `Scene`. */
      let head = HEAD_0;
      let scene = LOOP_SCENE_0;

      /** What the box types next: the scene's own line, not a lookup. */
      const nextTyped = () => SCENES[scene].typed;

      /** The strip's two fields, written in one place so the rewind, the boot and the teardown
          cannot disagree about what "empty" and "settled" look like. */
      const setStrip = (agent: string, model: string) => {
        if (agentEl) agentEl.textContent = agent;
        if (modelEl) modelEl.textContent = model;
        /* The separator only earns its place once there is something on both sides of it. */
        if (sepEl) sepEl.style.display = model ? "" : "none";
      };

      const paint = () => {
        for (let i = 0; i < RENDERED_ROWS; i++) {
          const line = lineAt(head + i);
          const look = rowLook(line.kind, i === VISIBLE_ROWS - 1);
          const row = rows[i];
          const chevron = row.querySelector(
            "[data-tm-chevron]",
          ) as HTMLElement | null;
          const dot = row.querySelector("[data-tm-dot]") as HTMLElement | null;
          const elbow = row.querySelector(
            "[data-tm-elbow]",
          ) as HTMLElement | null;
          const text = texts[i];
          if (chevron) chevron.style.display = show(look.chevron);
          if (dot) {
            dot.style.display = show(look.dot);
            dot.className = look.dotClass;
          }
          if (elbow) elbow.style.display = show(look.elbow);
          if (text) text.textContent = line.text;
          row.className = `${ROW_CLASS} ${look.text}`;
        }
      };

      /* matchMedia so the reduced-motion branch is never BUILT. Everything below is rendered in
         its FINAL state by the server, so JS-off, pre-hydration and reduced-motion all show a
         populated window — a welcome panel, a full transcript and a typed prompt — rather than an
         empty box. The animation only ever hides what is already there and then keeps it moving.
         Same shape as ClixBackdrop and ClixManifesto. Reverts itself if the preference flips.

         ⚠️ AN ENDLESS ANIMATION IS EXACTLY WHAT `prefers-reduced-motion` EXISTS FOR. A window
         that never stops is the strongest case on this whole site for honouring it, which is why
         the reduced-motion path is a frozen, fully-populated window and not a slower version. */
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Set the hidden state IMMEDIATELY rather than letting a `from()` tween set it when the
           trigger fires. This window sits in the hero, i.e. above the fold, so the trigger fires
           within a frame of mount — and a `from()` would paint one frame of the complete window
           before hiding it. Setting up front costs nothing and removes the flash. */
        gsap.set(panel, { opacity: 0 });
        gsap.set(box, { opacity: 0 });
        gsap.set(rows, { opacity: 0, y: 4 });
        gsap.set(cmd, { width: 0 });

        /* ⚠️ THE CARET'S BLINK IS TURNED ON HERE, NOT IN THE MARKUP, and the reason is written
           down at `@keyframes blink` in globals.css: the global reduced-motion clamp sets
           `animation-duration: 0.01ms`, which can freeze an animated element MID-CYCLE AND
           INVISIBLE. /product's ProductHero drops its caret's animation class outright rather
           than trusting the clamp, and this does the same thing by never adding it — inside this
           branch, reduced-motion never reaches these lines.

           Written as inline styles rather than as Tailwind's `animate-[blink_…]` utility ON
           PURPOSE. A class added at runtime is invisible to Tailwind's source scanner, so the
           utility would only exist while some OTHER file happened to spell it out — ProductHero
           does today, which would make this depend on an unrelated component keeping a class it
           might drop. `@keyframes blink` is real CSS in globals.css and is always there. Reused
           rather than redeclared, which is also why this pass adds no keyframe of its own. */
        caret.forEach((el) => {
          (el as HTMLElement).style.animation = "blink 1s step-end infinite";
        });

        /* ── The endless exchange ──────────────────────────────────────────────────────────
           ⚠️ A SELF-SCHEDULING CHAIN, NOT A `repeat: -1` TIMELINE, and the reason is the typing.
           A repeating timeline replays ONE recording: its durations, positions and easing are
           fixed the moment it is built. That was already fatal when the reveal was a `steps(n)`
           ease keyed to a 27-to-33-character prompt, and it is doubly so now that every duration
           in this file is a range sampled per cycle and the keystroke schedule is rolled glyph by
           glyph. Repeating it would just replay the same "random" performance forever, which is
           the thing the 2026-08-14 pass exists to kill. Each cycle builds its own timeline and
           hands off to the next on completion.

           ⚠️ THAT MEANS `useGSAP` CANNOT CLEAN THESE UP FOR US. Its context only captures
           animations created while the effect body is running; a timeline built later, inside an
           `onComplete`, is invisible to it and would keep running after unmount. Hence the
           `stopped` flag and the explicit `kill()` in the teardown below. This is the one piece
           of this file that does not follow the usual useGSAP contract, and it is deliberate. */
        let cycle: gsap.core.Timeline | null = null;
        let stopped = false;

        /** One tick: slide the strip up exactly one row, then advance `head` and snap back.
            `stream` blanks the arriving row so `streamInto` can fill it; the visitor's own prompt
            arrives complete, because it was already typed in the box below. */
        const appendAdvance = (
          tl: gsap.core.Timeline,
          stream = false,
          slide = SLIDE_S,
        ) => {
          /* ⚠️ BLANKED BELOW THE CLIP, BEFORE IT TRAVELS. The row that slides into view is the
             hidden eleventh, and `paint()` filled it on the previous tick. Wiping it only after
             it arrives would show one frame of the complete line, then wipe it, then retype it —
             a flash exactly where the eye is. Blanking it while it is still out of sight costs
             nothing and the line slides in empty, which is what "streaming" has to look like. */
          if (stream) {
            tl.add(() => {
              const el = texts[RENDERED_ROWS - 1];
              if (el) el.textContent = "";
            });
          }
          tl.to(list, {
            y: () => -rowH(),
            duration: slide,
            ease: "power2.inOut",
          }).add(() => {
            head++;
            paint();
            /* ⚠️ AND BLANKED AGAIN IN THE SAME CALLBACK, because `paint()` has just written the
               full string back into this row. Same synchronous block, so no frame is drawn
               between the two and the wipe is unobservable. Splitting these into two callbacks
               would reintroduce the flash the blank above exists to avoid. */
            if (stream) {
              const el = texts[VISIBLE_ROWS - 1];
              if (el) el.textContent = "";
            }
            gsap.set(list, { y: 0 });
          });
        };

        /* ── The agent's rows, arriving in chunks rather than keystrokes ───────────────────
           Fills the bottom visible row — the one `appendAdvance` just blanked. Scheduled at
           build time from the line it KNOWS will land there, because `head` has not moved yet
           when the timeline is constructed; every mutation below happens in a callback at
           playback time, so reading `LINES` up front is what keeps the two in step.

           ⚠️ `textContent = slice` RATHER THAN THE WIDTH CLIP THE PROMPT BOX USES, and it is not
           an inconsistency. The row's text span carries `truncate`, i.e. `text-overflow:
           ellipsis` — clip it to a partial width and the browser draws an ELLIPSIS at the cut,
           so a half-arrived line would read `Read(infra/dep…`. A substring never overflows, so
           no ellipsis can appear. The prompt box has no ellipsis to worry about, which is why it
           can keep the cheaper mechanism. */
        const streamInto = (
          tl: gsap.core.Timeline,
          text: string,
          fast = false,
        ) => {
          let t = tl.duration();
          /* Bigger chunks at a shorter interval: a menu is printed, not generated. */
          const chunk = fast ? BOOT_CHUNK : STREAM_CHUNK;
          const step = fast ? BOOT_STREAM_S : STREAM_S;
          for (let n = 0; n < text.length;) {
            n = Math.min(text.length, n + Math.round(rand(chunk)));
            const upto = n;
            t += rand(step);
            tl.call(
              () => {
                const el = texts[VISIBLE_ROWS - 1];
                if (el) el.textContent = text.slice(0, upto);
              },
              undefined,
              t,
            );
          }
        };

        /* ── Typing, one glyph at a time, at a rate nobody can set a metronome to ──────────
           ⚠️ THE MECHANISM IS STILL A WIDTH CLIP over text that is already present — the span is
           `overflow-hidden whitespace-pre` and `ch` is exact because the face is monospace, so
           the caret, SSR and the reduced-motion resting state all behave exactly as they did.
           WHAT CHANGED is the schedule: a single `steps(n)` tween is a UNIFORM ease, baked in
           when the tween is built, so it could only ever produce one interval for every
           keystroke of every prompt. There is no ease that varies per character. So the reveal is
           now one zero-duration `set` per glyph, placed at an accumulating jittered time.

           ⚠️ THAT IS ~35 SETS PER CYCLE AND IT IS FINE. They are zero-duration and the timeline
           is rebuilt each cycle anyway; the thing the old comment was guarding against was a DOM
           WRITE per glyph, which an append-the-character approach would have cost and this still
           does not — the text is written once, up front, and only a width moves. */
        const typeInto = (
          tl: gsap.core.Timeline,
          text: string,
          fast = false,
        ) => {
          let t = tl.duration();

          /* ⚠️ THE BOOT SKIPS THE WHOLE HUMAN MODEL, and that is the point rather than a
             shortcut. Tempo, think-pauses and the fumble all exist to make a QUESTION look typed
             by a person weighing their words; a slash command is muscle memory. Running `/agent`
             through the human model produced a hesitant six-character crawl, which is what the
             user was reacting to. Even strokes, no pauses, no slips. */
          if (fast) {
            for (let i = 0; i < text.length; i++) {
              t += rand(BOOT_KEY_S);
              tl.set(cmd, { width: `${i + 1}ch` }, t);
            }
            return;
          }

          /* One slip per prompt, sometimes; -1 means this one comes out clean. */
          const slip = Math.random() < TYPO_CHANCE ? slipIndex(text) : -1;
          /* Rolled ONCE, and it scales every key below — this is what makes one whole question
             brisk and the next one halting. See the note on TEMPO. */
          const tempo = rand(TEMPO);
          let mode = pickMode();
          let left = Math.round(rand(mode.run));

          for (let i = 0; i < text.length; i++) {
            /* The pause BEFORE this glyph, because a space is where a person stops to think.
               Scaled by tempo too: someone typing slowly also thinks longer between words. */
            if (i > 0 && text[i - 1] === " " && Math.random() < THINK_CHANCE) {
              t += rand(THINK_S) * tempo;
            }

            if (i === slip) {
              /* The wrong key goes in, sits there long enough to be seen, and is deleted. The
                 span holds the typo'd string only for that beat; the backspace clips the width
                 back to `i`, which is what makes swapping the correct string back in invisible
                 rather than a flicker. */
              const wrong = text.slice(0, i) + NEIGHBOUR[text[i]];
              tl.call(() => (cmd.textContent = wrong), undefined, t);
              tl.set(cmd, { width: `${i + 1}ch` }, t);
              t += rand(TYPO_NOTICE_S);
              tl.set(cmd, { width: `${i}ch` }, t);
              tl.call(() => (cmd.textContent = text), undefined, t);
              t += rand(TYPO_RECOVER_S);
            }

            /* The run this glyph belongs to, re-rolled when the last one is used up. The mode
               holds ACROSS characters — that is the whole difference from the version this
               replaced, where every glyph rolled independently and the stretches averaged away. */
            if (left <= 0) {
              mode = pickMode();
              left = Math.round(rand(mode.run));
            }
            left--;

            t += rand(mode.key) * tempo;
            tl.set(cmd, { width: `${i + 1}ch` }, t);
          }
        };

        /* ⚠️ ONE FUNCTION DRIVES BOTH HALVES. A boot step and an exchange are the same shape —
           a line the visitor types, then rows the agent produces — so `/agent` printing a roster
           and "where does my data get processed" printing a tool trace run through identical
           code. The only difference between them is the data. That is what made the boot
           sequence a copy change plus a scene index rather than a second animation. */
        const runScene = () => {
          if (stopped) return;
          const current = SCENES[scene];
          const text = current.typed;
          /* One flag picks the whole clock: typing model, slide, gaps, stream and dwell. Every
             boot-vs-exchange timing difference reads off this line and nowhere else. */
          const fast = current.fast === true;
          const slide = fast ? BOOT_SLIDE_S : SLIDE_S;
          const gaps = fast ? BOOT_GAPS : GAPS;
          /* The box has to hold the string BEFORE the reveal starts — the animation is a width
             clip over text that is already present, never an append. See the note on the span. */
          cmd.textContent = text;

          const tl = gsap.timeline({
            onComplete: () => {
              /* ⚠️ WRAPS TO `LOOP_SCENE_0`, NOT TO ZERO — this is the line that makes the boot
                 play exactly once. `head` cannot go back either (`lineAt` wraps only within the
                 looping span), so the two agree without either one checking the other. */
              scene = scene + 1 >= SCENES.length ? LOOP_SCENE_0 : scene + 1;
              runScene();
            },
          });
          cycle = tl;

          tl.set(cmd, { width: 0 });
          typeInto(tl, text, fast);
          /* The beat before Enter. Without it the line vanishes the instant it finishes typing
             and the scene reads as one continuous stream rather than a submission. */
          tl.to(
            {},
            { duration: rand(fast ? BOOT_SUBMIT_HOLD_S : SUBMIT_HOLD_S) },
          );
          /* Submit: the box empties and the same line arrives in the transcript. */
          tl.add(() => {
            cmd.textContent = "";
            gsap.set(cmd, { width: 0 });
          });
          /* The typed line lands complete — it is what the box just finished typing, so
             streaming it again in the row above would be the same keystrokes twice. */
          appendAdvance(tl, false, slide);

          /* ⚠️ THE ROWS ARE READ FROM THE SCENE AT BUILD TIME, which is both simpler and safer
             than deriving them from `head`: `head` does not move until the callbacks inside
             `appendAdvance` run at playback time, so reading it inside those callbacks would
             race with the increment they perform. The scene already holds exactly these rows in
             exactly this order. */
          current.rows.forEach((line, k) => {
            /* GAPS is a lookup, not the loop bound — the scene's own length drives the walk, so
               a scene with more rows than GAPS has entries simply reuses the last gap rather
               than advancing the transcript a different number of rows than `head` expects. */
            tl.to({}, { duration: rand(gaps[k] ?? gaps[gaps.length - 1]) });
            appendAdvance(tl, true, slide);
            streamInto(tl, line.text, fast);
            /* ⚠️ APPENDED AFTER `streamInto`, so the strip commits as the row FINISHES rather
               than as it starts — the transcript says `model  claude-fable-5` and the box's
               status line picks it up in the same beat, which is the causality the sequence is
               selling. Firing it earlier would show the strip knowing before the pick printed. */
            if (line.sets) {
              const { field, value } = line.sets;
              tl.call(() => {
                if (field === "agent")
                  setStrip(value, modelEl?.textContent ?? "");
                else setStrip(agentEl?.textContent ?? "", value);
              });
            }
          });

          tl.to({}, { duration: rand(fast ? BOOT_DWELL_S : DWELL_S) });
        };

        /* ⚠️ THE REWIND. The server rendered the STATIC screen — a populated mid-exchange
           transcript — and the boot has to begin from an empty terminal. Rewinding here, while
           the rows are still at `opacity: 0` from the `gsap.set` above, means no frame is ever
           drawn showing the content swap. Do not move this below the fade-in. */
        head = HEAD_BOOT;
        scene = 0;
        paint();
        /* Nothing has been chosen yet, so the strip is just `[audit]` and the path. */
        setStrip("", "");
        cmd.textContent = nextTyped();

        /* ⚠️ THE ROWS NO LONGER STAGGER IN, and that is a consequence of the rewind rather than
           a style change: every row is blank at this point, so a staggered reveal of ten empty
           lines is 0.7s of nothing. The panel and the box fade; the transcript simply becomes
           present and then fills itself, which is what opening a terminal looks like. */
        const intro = gsap.timeline();
        intro
          .to(panel, { opacity: 1, duration: 0.2, ease: "none" })
          .set(rows, { opacity: 1, y: 0 })
          .to(box, { opacity: 1, duration: 0.2, ease: "none" }, ">0.05");

        intro.eventCallback("onComplete", runScene);

        /* ⚠️ PAUSED WHEN OFF SCREEN, AND THAT IS NOT AN OPTIMISATION DETAIL. This chain never
           ends, so without this it would keep compositing for the entire time a visitor reads the
           rest of the page — on a phone that is measurable battery for something nobody can see.
           Pausing the live cycle also halts the chain itself, because the next one is only built
           from the current one's `onComplete`. `once` is deliberately NOT set, unlike the intro:
           the whole point is that it resumes. */
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) {
              if (intro.progress() === 1) cycle?.play();
            } else {
              cycle?.pause();
            }
          },
        });

        /* Raw-DOM styles, a live ScrollTrigger and a timeline chain outside useGSAP's context —
           none of which matchMedia can revert on its own. If the preference flips to `reduce`
           mid-session, a blinking caret and a running chain would otherwise be left behind. */
        return () => {
          stopped = true;
          cycle?.kill();
          intro.kill();
          st.kill();
          gsap.set(list, { y: 0 });
          caret.forEach((el) => {
            (el as HTMLElement).style.animation = "";
          });
          /* ⚠️ RESTORES THE STATIC STATE, NOT THE BOOT STATE. Reverting to `HEAD_BOOT` would
             leave a reduced-motion visitor staring at an empty window forever — the boot only
             makes sense as something that plays. `LOOP_SCENE_0` is the scene `HEAD_0` is derived
             against, so the box and the transcript agree after the revert exactly as they do in
             the server's markup. */
          head = HEAD_0;
          scene = LOOP_SCENE_0;
          paint();
          setStrip(AGENT_0, MODEL_0);
          /* ⚠️ AN EXPLICIT WIDTH, NOT `clearProps: "width"`. clearProps strips the inline
             style outright -- INCLUDING the `${n}ch` React itself rendered -- which would leave
             this span to absorb the whole flex row and strand the caret. That is the exact bug
             recorded on the span below. Restore the resting state instead of erasing it. */
          const seed = nextTyped();
          cmd.textContent = seed;
          gsap.set(cmd, { width: `${seed.length}ch` });
        };
      });
    },
    { scope: root },
  );

  /* What the server renders in the box: the first EXCHANGE's question, matching `HEAD_0`'s
     static transcript. Deliberately not the boot's `/agent` — the static screen is the state a
     JS-off or reduced-motion visitor is left in, and a slash command frozen in a box they can
     never see execute reads as broken. Read from the scene rather than written out, so the
     static screen cannot disagree with what the animation would type there. */
  const seedPrompt = SCENES[LOOP_SCENE_0].typed;

  return (
    /* ⚠️ THE CHROME LIVES IN `MockWindow` — the border, radius, `bg-ink`, `font-mono`,
       `dir="ltr"`, `aria-hidden` and the title bar. The sizing stays here, because sizing is the
       caller's business and this window is 720 wide where the console is 900.
       ⚠️ `max-w-[720px]` IS OVERRIDDEN AT >=1200 by the canvas, which positions this absolutely
       at a fixed 720. Below 1200 this is the only window on the page and it fills the row.
       It is a SIBLING of the hero's `Text & Button` wrapper, never a child of it — that wrapper
       is `max-w-[360px]` at the phone tier and would cap this at 360. */
    <MockWindow
      rootRef={root}
      title={`clix@production: ${CWD}`}
      className="w-full max-w-[720px]"
      /* ⚠️ THE BODY HEIGHT IS FIXED, NOT CONTENT-DRIVEN. The exchange never stops, so a
         content-sized box would grow without limit.

         ⚠️ THESE TWO NUMBERS GREW ON 2026-08-14 (user: "increase the height of the terminal")
         AND THEY DO NOT TRAVEL ALONE. They were 254 / 282, giving a 288 / 320 window; they are
         now 346 / 402, giving a 380 / 440 window. Chosen so the WHOLE window lands on a round
         380 / 440 — the root's border is why the body numbers are not round themselves.
         `MockWindow`'s root has no height of its own, so `border-box` never applies to it and its
         1px border sits OUTSIDE the children:
           tablet+  1 + 36 (title) + 402 (body) + 1 = 440
           phone    1 + 32 (title) + 346 (body) + 1 = 380

         ⚠️⚠️ THE BUDGET BELOW SUBTRACTS THIS BOX'S OWN PADDING, AND THE VERSION BEFORE IT DID
         NOT — that omission was a live overflow, measured 2026-08-14. Every earlier revision of
         this comment compared the children's sum against the BODY HEIGHT (`362`), but the body is
         `border-box` with `py-5`, so the space children actually get is `362 - 40 = 322`. The
         sums looked comfortable and were not: at six rows the content needed 329.4 of 322 and
         was already 7.4 over, absorbed invisibly by the bottom padding; adding the status strip
         took it to 347 of 322 and the prompt box began clipping 5px PAST the window's border.
         `scrollHeight` (367) exceeding `clientHeight` (362) is what caught it — a screenshot
         showed a box that merely looked tight. ALWAYS compare against `available`, never `h-[]`.

         ⚠️ THREE OTHER FILES WERE EDITED WITH THIS AND MUST STAY IN STEP — the previous pass
         could say "this rewrite touches no other file" precisely because it kept these numbers,
         and this one cannot:
           · SecurityCanvas.tsx  `BOX.h` 580 -> 660 (terminal bottom edge = 260 + 400)
           · SecurityHero.tsx    tier map + the three height sums
           · SecurityConsole.tsx the composite dimensions quoted in its header
         `heroH` is excluded from docs/reference/security-diff.js by design, so the block-diff
         harness does not assert on any of this — which is exactly why the prose has to.

         The content budget, which is what `flex-col` distributes. TABLET+ IS THE BINDING TIER,
         because its rows are 22.4 against the phone's 19.2 — derive ten rows there first. The
         box is 58 / 50.8 since the status strip landed inside it (was 40.4 / 33.2):
           tablet+  41 (panel) + 12 + 224 (ten rows) + 12 + 58 (box) = 347 of 402 - 40 = 362
           phone    37         + 10 + 192            + 10 + 50.8     = 299.8 of 346 - 32 = 314
         Slack 15 and 14.2 — deliberate empty terminal, and the margin that lets a copy edit add
         a row without re-deriving the box. An eleventh row needs 369.4 of 362 at tablet+ and
         does NOT fit, so ten is the ceiling until the window grows again. */
      bodyClassName="flex h-[346px] flex-col gap-[10px] px-4 py-4 text-[12px] leading-[1.6]
                     tablet:h-[402px] tablet:gap-3 tablet:px-5 tablet:py-5 tablet:text-[14px]"
    >
      {/* ── The welcome panel ───────────────────────────────────────────────────────────────
          ⚠️ A REAL CSS BORDER, NOT FOUR BOX-DRAWING GLYPHS — see the header. `rounded-[6px]`
          matches the window's own radius and the hero CTA's.
          The dot-matrix and the greeting sit on ONE row, which is both what the real CLI does
          with its logo and what holds the panel to 23px of content at both type tiers. */}
      <div
        data-tm-panel
        className="flex shrink-0 items-center gap-3 rounded-[6px] border border-hairline-light
                   px-3 py-[6px] tablet:gap-4 tablet:py-2"
      >
        {/* Dot-matrix CLIX. Rows are `#` for an on-dot and `.` for off; only the on-dots get a
            fill, so the off-dots cost nothing at render. Column count is derived from the row
            strings rather than hand-written, so editing a glyph cannot desync the grid.

            ⚠️⚠️ `width: max-content` IS AN INLINE STYLE BECAUSE THE `w-max` UTILITY IS POISONED
            IN THIS PROJECT, AND IT IS POISONED EVERYWHERE — measured 2026-08-14, and it had
            silently eaten the greeting beside this grid since the panel landed the day before.
            Tailwind v4 resolves `w-<name>` against the `--container-<name>` theme namespace, and
            `globals.css`'s `@theme` block defines `--container-max: 1280px` as this site's page
            container. That name collides with the BUILT-IN `w-max`, so the generated rule is:

                .w-max { width: max-content; width: var(--container-max) }

            The second declaration wins. Every `w-max` in this codebase is `width: 1280px`, not
            `width: max-content`. Here that made a 113px grid claim 1280px of a 678px flex line;
            `shrink-0` meant it could not give any back, so the `truncate` greeting next to it was
            squeezed to EXACTLY 0px wide and vanished. Nothing errored and the dots still drew at
            the right size, which is why a screenshot never caught it.

            An inline style is the fix rather than a renamed utility because it cannot be
            reintroduced by someone tidying the class list, and `max-content` rather than the
            computed 113px because the column count is already derived — see `MATRIX_COLS`.
            ⚠️ THE OTHER `w-max` IN THE REPO (ClixCapabilities' marquee track) HAS THE SAME BUG
            and is NOT fixed here; it belongs to another section. */}
        <div
          className="grid shrink-0 gap-[2px]"
          style={
            {
              width: "max-content",
              gridTemplateColumns: `repeat(${MATRIX_COLS}, 3px)`,
            } as CSSProperties
          }
        >
          {MATRIX.map((row, y) =>
            row
              .split("")
              .map((cell, x) => (
                <span
                  key={`${y}-${x}`}
                  className={`block h-[3px] w-[3px] ${cell === "#" ? "bg-muted" : ""}`}
                />
              )),
          )}
        </div>
        <span className="truncate text-paper-soft">{GREETING}</span>
      </div>

      {/* ── The transcript ──────────────────────────────────────────────────────────────────
          `VISIBLE_ROWS * 1.6em` is exactly ten rows at BOTH type tiers because the row height IS
          1.6em — 224px at 14px and 192px at 12px — so there is no second number to keep in sync
          with the line-height. INTERPOLATED FROM THE CONSTANT rather than written as `10`, so the
          row count lives in exactly one place; the literal `6` that used to sit here is precisely
          the kind of second copy that survives a resize and silently clips a row.
          `overflow-hidden` is what clips the eleventh row, which is the one that slides into view
          on each tick AND the one the prompt box is typing. */}
      <div
        className="shrink-0 overflow-hidden"
        style={{ height: `calc(${VISIBLE_ROWS} * 1.6em)` }}
      >
        {/* The strip that moves. Seven rows rendered, six visible; `paint()` rewrites their text
            and markers in place on every tick, so this list never grows and the DOM node count is
            constant for the life of the page. */}
        <ul data-tm-list>
          {Array.from({ length: RENDERED_ROWS }, (_, i) => {
            const line = lineAt(HEAD_0 + i);
            const look = rowLook(line.kind, i === VISIBLE_ROWS - 1);
            return (
              <li data-tm-row key={i} className={`${ROW_CLASS} ${look.text}`}>
                {/* The marker column, 2ch, holding whichever of the two markers this kind uses.
                    Both are always in the DOM and toggled with `display`, because `paint()` has
                    to swap them on a loop and creating nodes per tick would churn the tree. */}
                <span className="flex w-[2ch] shrink-0 items-center">
                  <span data-tm-chevron style={{ display: show(look.chevron) }}>
                    &gt;
                  </span>
                  {/* The agent bullet. A CSS disc, not U+23FA — see the header. */}
                  <span
                    data-tm-dot
                    className={look.dotClass}
                    style={{ display: show(look.dot) }}
                  />
                </span>
                <span className="flex min-w-0 items-center">
                  {/* ⚠️ THE RESULT ELBOW, AND IT IS A REPRODUCTION RATHER THAN A SUBSTITUTE.
                      U+23BF is not in Fragment Mono's range (header), and the character it names
                      IS an elbow: a stroke down the inline-start edge turning along the bottom.
                      `border-b` + `border-l` + a 2px corner radius draws exactly that.
                      PHYSICAL `border-l` and `rounded-bl` rather than the logical `border-s` /
                      `rounded-es` on purpose: `MockWindow` pins this window to `dir="ltr"` in
                      both locales, so there is no RTL case for a logical property to serve and
                      the physical spelling says what is actually drawn. */}
                  <span
                    data-tm-elbow
                    className="me-[0.6ch] block h-[0.5em] w-[0.9ch] shrink-0 -translate-y-[0.12em]
                               rounded-bl-[2px] border-b border-l border-muted"
                    style={{ display: show(look.elbow) }}
                  />
                  {/* ⚠️ `whitespace-pre`, NOT `truncate`, AND THE RUNS OF SPACES ARE THE
                      REASON. `truncate` expands to `overflow-hidden text-ellipsis
                      whitespace-nowrap`, and `nowrap` COLLAPSES a run of spaces to one — so
                      `clix audit    security review` rendered as `clix audit security review`
                      and the boot menus came out ragged instead of in two columns. It hit the
                      result rows too (`region  eu-west-1` lost its gap). `pre` preserves the
                      runs and still refuses to wrap, so the clipping behaviour is unchanged;
                      the other two utilities are spelled out because `truncate` would re-assert
                      `nowrap` from whichever rule the scanner emits last.
                      ⚠️ THE COLUMNS ARE PADDED WITH REAL SPACES in the copy above — `clix audit`
                      + 4 spaces, `claude-sonnet-5` + 2 — all landing on one column per list. Keep
                      that alignment when editing a label, or the list shears. */}
                  <span
                    data-tm-text
                    className="overflow-hidden text-ellipsis whitespace-pre"
                  >
                    {line.text}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── The prompt box ──────────────────────────────────────────────────────────────────
          ⚠️ PINNED BELOW THE TRANSCRIPT, which is where the real CLI puts it — the next question
          types itself here while the last answer is still on screen above. `mt-auto` pushes it to
          the bottom of the body's flex column so the deliberate slack sits above it, not below.
          Again a real border, not `╭──╮`. */}
      <div
        data-tm-box
        className="mt-auto flex shrink-0 flex-col rounded-[6px] border border-hairline-light
                   px-2 py-[6px] tablet:py-2"
      >
        {/* ── The status strip ────────────────────────────────────────────────────────────
            Added 2026-08-14 on a reference the user sent: the real CLI's prompt box carries a
            line of session state above the input — a mode tag, who is answering, and the working
            directory pushed to the right. Ours says the same three things in clix's own terms.

            ⚠️ THE REFERENCE NAMED A MODEL (`claude-opus-4.6`) AND THIS DOES NOT, for the reason
            in the header: nothing in this window may attribute clix's security posture to
            someone else's product. `clix code` is the same name the welcome panel already uses.

            ⚠️ 11px, NOT THE BODY'S 14/12, AND THE TYPE SIZE IS A HEIGHT DECISION. At 1.6 line
            height this row costs 17.6px at BOTH tiers, which is what let it land inside the
            existing slack without moving the window, the canvas or the hero again — see the
            `bodyClassName` note. It also matches `MockWindow`'s title bar, so the two pieces of
            chrome in this window read as the same register.

            ⚠️ `·` IS U+00B7 AND IS THE ONE SEPARATOR GLYPH THIS FONT CAN DRAW. It sits inside
            the Latin-1 block the header quotes as covered. The reference's `↵` (U+21B5) does
            NOT — only U+2191 and U+2193 are in range — so no return arrow, and no `⇥` for the
            tab hint either. Check any new glyph against that range before adding it.

            `text-paper-soft` at 11.84:1, never `muted`: this is a string a person reads. */}
        <div className="flex items-center gap-[1ch] text-[11px] leading-[1.6] text-paper-soft">
          <span className="shrink-0">[audit]</span>
          {/* ⚠️ THE AGENT AND THE MODEL ARE THE BOOT'S SELECTIONS, not labels — this is the
              user's ask ("the model selected should be shown in the reply box also"), and it is
              what the reference does with `kiro_planner · claude-opus-4.6`. The server renders
              the SETTLED values because the static screen is the post-boot state; the animated
              branch blanks all three at its rewind and the boot fills them back in as each
              `pick` row lands. Both read `AGENT_0` / `MODEL_0`, which are read back out of
              `BOOT` — so the strip cannot advertise a model the picker never chose.
              The old `read only` sat here and is gone: the model earns the slot, and that line
              already appears in the transcript as a `scope` result. */}
          <span data-tm-agent className="truncate">
            {AGENT_0}
          </span>
          {/* Hidden until the model is chosen, or the separator floats alone during boot. */}
          <span data-tm-sep className="shrink-0">
            ·
          </span>
          <span data-tm-model className="shrink-0">
            {MODEL_0}
          </span>
          {/* ⚠️ THE PATH USED TO SIT HERE AND HAS MOVED TO THE PROMPT LINE BELOW, where a
              real shell puts it — see the note there. Keeping a copy on this row as well would
              print `~/audit` twice inside one box. */}
        </div>

        {/* ── The input line ──────────────────────────────────────────────────────────── */}
        <div className="flex items-center">
          {/* ⚠️ THE SHELL PROMPT, AND THE PATH IS THE POINT (user, 2026-08-14: "add some
              directory maybe beside the >, you can see how cmd actually looks in real"). A bare
              `>` reads as an empty box; `~/audit >` reads as a shell waiting for input, which is
              what `C:\Users\miko>` does in the reference they sent.

              ⚠️ THE PATH IS TABLET+ ONLY, and the phone tier keeps the bare `>`. The budget is
              hard there: box inner width is 306px at 12px, i.e. ~42 columns, and `~/audit >`
              (10 with its gap) plus the longest prompt (33) plus the caret comes to 44. The path
              is the part that can go, because `MockWindow`'s title bar directly above already
              reads `clix@production: ~/audit`.

              ⚠️ TWO SPANS WITH THEIR OWN MARGINS rather than one string containing spaces —
              this line is NOT `whitespace-pre`, so a trailing space inside a span is not
              reliable. The `w-[2ch]` that used to be here did the same job for a lone chevron;
              `me-[1ch]` on a natural-width `>` reproduces it. */}
          <span className="me-[1ch] hidden shrink-0 text-paper-soft tablet:inline">
            {CWD}
          </span>
          <span className="me-[1ch] shrink-0 text-paper-soft">&gt;</span>
          {/* ⚠️ `overflow-hidden` + `whitespace-pre` + AN EXPLICIT `Nch` WIDTH is the typing
            mechanism, not styling. The inline width is the SSR / reduced-motion state, so with JS
            off the line simply reads complete.

            ⚠️ THE WIDTH IS DERIVED FROM THE STRING, AND `w-max` HERE WAS A REAL BUG — measured
            2026-08-13 on the version this replaced. As a flex item the span came out 650.06px
            wide against 242.27px of text (it absorbed the whole remaining row instead of hugging
            its content), which stranded the caret ~400px past the end of the text in exactly the
            two states that have no animation to hide it: JS off and reduced motion. A screenshot
            could not catch it, because `overflow-hidden` makes the excess invisible.
            Deriving the width from `.length` is also what keeps the resting width and the end of
            the tween identical — they are literally the same expression. Do not put `w-max` back. */}
          <span
            data-tm-cmd
            className="overflow-hidden whitespace-pre text-paper"
            style={{ width: `${seedPrompt.length}ch` }}
          >
            {seedPrompt}
          </span>
          {/* Caret. A filled box rather than a block character, for the same glyph-coverage reason
            everything else here is CSS — and a block is the terminal idiom, where /product's `|`
            is the text-field one. It renders STEADY here and is set blinking from the effect
            above; see the long note there for why the animation is not in the markup. */}
          <span
            data-tm-caret
            className="ms-[2px] inline-block h-[1.05em] w-[1ch] shrink-0 bg-paper"
          />
        </div>
      </div>
    </MockWindow>
  );
}
