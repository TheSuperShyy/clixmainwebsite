"use client";

/**
 * SecurityConsole — the back window of the `/security` hero composite.
 *
 * ⚠️ NOT A CLONE. No counterpart on rogo.com/security. Added 2026-08-13, after the user asked
 * for the second window in kiro.dev's hero ("can you add also something like this?"). kiro's is
 * a real screenshot of their own product: a sessions sidebar, a chat, and a GitHub PR diff.
 * Ours is a **run history**, which is the shape the user chose, and every value in it is a
 * design decision rather than a measurement. Spec: features/security-page/FEATURE.md → Block 1b.
 *
 * Presentational and stateless — no state, no effects, no motion of its own. The entry
 * animation and the dragging both live in `SecurityCanvas`, and the chrome lives in
 * `MockWindow`. This file is only the three panes.
 *
 * ⚠️ `"use client"` SINCE 2026-08-14, AND IT COSTS NOTHING. The one hook here is
 * `usePageDict("security")`, which is a context read. The directive is not what puts this file
 * in the client bundle either — `SecurityCanvas` is a client component and imports it, so it
 * has always shipped to the browser; the directive only makes that legible at the top of the
 * file instead of two files away. `usePageDict` rather than `getDict()` for the same reason:
 * a client module must never `import` a dictionary, or BOTH locales land in the chunk.
 *
 * ─── ⚠️ DESKTOP ONLY (>=1200), AND THAT IS DELIBERATE ────────────────────────────────────
 * `SecurityCanvas` renders this behind a `hidden desktop:block`. A three-pane console at the
 * 358px phone tier is unreadable at any type size that fits, and stacking it above the terminal
 * at the tablet tier would add ~460px to a hero that is already over a thousand there. So below
 * 1200 the hero is EXACTLY what it was before this window existed — the terminal alone — and
 * nothing THIS file does reaches those tiers. (Their sums are 1072.41 and 997.19 since the
 * terminal grew on 2026-08-14; they were 952.41 and 905.19 before it.) It is decoration; losing it on small screens costs nothing,
 * and every claim it makes is repeated as real prose in the Compliance band regardless.
 *
 * ─── ⚠️ EVERY ROW IS A CLAIM THIS PAGE ALREADY MAKES IN PROSE ───────────────────────────
 * This is the third place the same discipline applies, and it matters most here because a
 * product screenshot is the most convincing thing on a marketing page. This repo has stripped
 * unbacked claims twice — SOC 2 / ISO 27001 / CCPA / GDPR / EU AI Act came off the home page on
 * 2026-08-05 and off /product on 2026-08-12 — and a fabricated console is exactly how one walks
 * back in. The detail rows are therefore the SAME five practices the five cells state:
 *
 *     region     -> the `your-cloud` cell
 *     scope      -> the `least-privilege` cell
 *     secrets    -> the `encrypted` cell
 *     retention  -> the `your-data` cell
 *     source     -> the `ownership` cell
 *
 * Nothing here asserts a capability that is not already on the page. ⚠️ There is deliberately
 * NO pass/fail badge, NO "0 vulnerabilities", and NO compliance score: those would be results
 * this repo cannot produce a report for. Two FEATURE.md open questions still bear on the copy
 * (Benefit 3 assumes per-run logs exist; Benefit 5 names TLS and a managed secret store).
 *
 * NO DASHES IN CLIX COPY (standing user request). `eu-west-1` and `nightly-sync` are
 * identifiers, not punctuation, so they keep their hyphens.
 *
 * ─── ⚠️ WHAT IS TRANSLATED HERE AND WHAT IS NOT (2026-08-14) ────────────────────────────
 * The user asked for the hero windows to speak Hebrew on /he, "only the necessary parts". The
 * line is CODE VS PROSE, and it is drawn by the dictionary's shape rather than by judgement at
 * each call site: `security.console` carries the pane headings, the six ages, the five detail
 * VALUES and the progress line, and it carries nothing else. The run ids, the run names, the
 * `#1482`, the detail KEY column, the file names and the diff counts are literals in this file
 * and a locale cannot reach them. `MockWindow`'s `dir="ltr"` still stands: the window is not
 * mirrored in either locale, and the only bidi accommodation is `dir="auto"` on the two spans
 * that can hold a Hebrew run — see them below.
 */

import MockWindow from "@/components/security/MockWindow";
import { usePageDict } from "@/lib/i18n/LocaleProvider";

/* The runs rail. `active` drives the marker fill and the row's text colour; there is exactly
   one, and it is the row the middle pane is showing.
   ⚠️ THE AGE MOVED OUT ON 2026-08-14 and is now `console.ages[i]`, positionally — it is the one
   field on this row that is a WORD rather than an identifier. Ages are relative and deliberately
   vague; a wall-clock timestamp in a static mock is a lie with a specific number attached. */
const RUNS: ReadonlyArray<{ id: string; name: string; active?: boolean }> = [
  { id: "1482", name: "nightly-sync", active: true },
  { id: "1481", name: "invoice-pull" },
  { id: "1480", name: "crm-export" },
  { id: "1479", name: "log-archive" },
  { id: "1478", name: "nightly-sync" },
  { id: "1477", name: "invoice-pull" },
];

/* The five practice claims, in the order the Compliance band states them. KEYS ONLY — these are
   a shell's field names and stay Latin in every locale; the values are `console.details[i]`. */
const DETAIL_KEYS: readonly string[] = [
  "region",
  "scope",
  "secrets",
  "retention",
  "source",
];

/* The changed-files rail. This is the `ownership` claim made visible: the automation clix wrote
   lands in the customer's repository as reviewable code, which is what "you own the code" on
   the home page has meant since 2026-08-05. ASCII `+`/`-` rather than typographic signs, for
   the same glyph-coverage reason the terminal's markers are boxes and its banner is a grid. */
const FILES: ReadonlyArray<[string, string, string]> = [
  ["sync.ts", "+42", "-11"],
  ["auth.ts", "+8", "-0"],
  ["schema.sql", "+3", "-0"],
  ["README.md", "+1", "-0"],
];

/* Pane headings. `muted` is correct on these and ONLY these: they are 10px labels that recede,
   and at that size `muted` on `ink` is 3.85:1, which fails AA for text.
   ⚠️ SO THEY ARE NOT `muted`. Same rule the terminal follows and for the same reason — this
   component is OURS, not inherited, so it must not add a sixth failing pair to the five already
   open on this site. `paper-soft` is 11.84:1 and reads as a quiet label at 60% opacity anyway. */
function PaneHeading({ children }: { children: string }) {
  return (
    <p
      className="mb-2 text-[10px] tracking-[0.08em] text-paper-soft opacity-60"
      style={{ lineHeight: "1.6" }}
    >
      {children}
    </p>
  );
}

export default function SecurityConsole() {
  const { console: copy } = usePageDict("security");

  return (
    <MockWindow
      title="clix@production: ~/runs"
      /* Sizing is fixed because the canvas that positions it is fixed: 900 x 440 sits inside the
         1000 x 700 composite bounding box with the terminal overlapping its bottom-right.
         See SecurityCanvas for the arithmetic. */
      className="h-[440px] w-[900px]"
      bodyClassName="flex h-[402px] text-[12px]"
    >
      {/* ── Runs rail ────────────────────────────────────────────────────────────────── */}
      <div className="w-[220px] shrink-0 overflow-hidden border-e border-hairline-light p-4">
        <PaneHeading>{copy.headings[0]}</PaneHeading>
        <ul>
          {RUNS.map((run, i) => (
            <li
              key={run.id}
              className={`flex items-center py-[3px] ${
                run.active ? "text-paper" : "text-paper-soft"
              }`}
            >
              {/* Same three-state marker vocabulary as the terminal feed: a filled `paper` disc
                  is the live one, a hollow `muted` ring is idle. Status by FILL, never by hue —
                  the reference design colour-codes this and we have no palette to spend. */}
              <span className="flex w-[2ch] shrink-0 items-center">
                <span
                  className={`block h-[7px] w-[7px] rounded-full border ${
                    run.active
                      ? "border-transparent bg-paper"
                      : "border-muted bg-transparent"
                  }`}
                />
              </span>
              <span className="w-[6ch] shrink-0">{run.id}</span>
              <span className="truncate">{run.name}</span>
              {/* ⚠️ `dir="auto"` — the age is the one field on this row that can be Hebrew, and
                  without it a Hebrew run inside this LTR window takes the paragraph's direction
                  for its neutrals (the `'` in `5 ש'`) and lands them at the wrong end. `auto`
                  reads the first strong character, so it is a NO-OP on every English age. */}
              <span dir="auto" className="ms-auto ps-2 opacity-60">
                {copy.ages[i]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Run detail ───────────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden border-e border-hairline-light p-4">
        <PaneHeading>{copy.headings[1]}</PaneHeading>
        <p className="mb-3 text-paper">
          nightly-sync <span className="text-paper-soft opacity-60">#1482</span>
        </p>
        <ul className="mb-3">
          {DETAIL_KEYS.map((key, i) => (
            <li key={key} className="flex py-[3px]">
              {/* 11ch so the values line up into a column regardless of key length — the same
                  fixed-column reasoning the terminal feed uses. */}
              <span className="w-[11ch] shrink-0 text-paper-soft">{key}</span>
              {/* ⚠️ `dir="auto"` for the same reason as the age above, and it matters most on
                  `eu-west-1 (שלכם)`: that value is Latin-first, so `auto` resolves it LTR and the
                  parentheses stay around the Hebrew word rather than migrating to the far end.
                  A value that is Hebrew-first resolves RTL and its full stop lands correctly. */}
              <span dir="auto" className="truncate text-paper">
                {copy.details[i]}
              </span>
            </li>
          ))}
        </ul>
        {/* A progress statement, not a verdict. "6 of 6 steps" is a fact about a depicted run;
            "0 vulnerabilities" would be a claim about the product. */}
        <p dir="auto" className="text-paper-soft">
          {copy.progress}
        </p>
      </div>

      {/* ── Changed files ────────────────────────────────────────────────────────────── */}
      <div className="w-[240px] shrink-0 overflow-hidden p-4">
        <PaneHeading>{copy.headings[2]}</PaneHeading>
        <ul>
          {FILES.map(([name, added, removed]) => (
            <li key={name} className="flex items-center py-[3px]">
              <span className="truncate text-paper-soft">{name}</span>
              {/* ⚠️ ADDITIONS AND DELETIONS ARE NOT GREEN AND RED HERE, which is the one place
                  this window will look "wrong" to anyone who knows diffs. It is the monochrome
                  rule again, and the site's only red/green pair — `price-low` / `price-high` —
                  is explicitly marked semantic-only and forbidden as an accent. Weight and
                  opacity carry the distinction instead. */}
              <span className="ms-auto ps-2 shrink-0 text-paper">{added}</span>
              <span className="w-[5ch] shrink-0 text-end text-paper-soft opacity-60">
                {removed}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </MockWindow>
  );
}
