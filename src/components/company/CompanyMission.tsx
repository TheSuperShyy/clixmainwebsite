/**
 * CompanyMission — clone of rogo.com/company's `Mission` band, Block 3 of six.
 * Capture offset 204100, live class `.framer-kh9jjb` (band) / `.framer-4ywrk2` (container).
 *
 * Capture: docs/reference/target/rogo-company-2026-08-12.html (+ .css).
 * Spec: features/company-page/FEATURE.md → "Block 2 — Mission" · memory:
 * features/company-page/CONTEXT.md
 *
 * THE BOX IS ROGO'S, THE CONTENT IS CLIX'S. Every geometry value below is measured from the
 * capture. Nothing rogo wrote ever entered this file.
 *
 * ⚠️ THE `FOUNDED BY` COLUMN IS DELIBERATELY NOT A LIST OF NAMES. The original names three
 * real founders. clix's seven team names live in docs/reference/clixsolutions/content.json
 * as machine-translated `alt` text: two are provably swapped between their own files and one
 * reads "giving". Publishing a person's name against the wrong face is worse than publishing
 * no name, so the column states three verifiable facts about the team instead and the label
 * changed to `TEAM` to match. Do not put names back until a human-checked roster exists.
 *
 * The Unit 8200 and Technion claim is the page's only credential and carries no
 * substantiation in this repo (docs/reference/clixsolutions/README.md:319-321). It ships
 * behind `robots: { index: false, follow: false }`, the same gate as ProductBenefits.tsx:67.
 * That gate is what makes the line shippable. See FEATURE.md → "noindex on first ship".
 *
 * TIER MAP — measured on the live page. 1600 and 1440 are identical in every value on this
 * page, so there is no `xl:` variant anywhere:
 *
 * |               | ≥1200                    | 810–1199          | ≤809              |
 * |---------------|--------------------------|-------------------|-------------------|
 * | band padding  | `96px 40px`              | `64px 40px`       | `64px 16px`       |
 * | container     | row, gap 64              | column, gap 40    | column, gap 24    |
 * | h3 box        | `490 x 96.8`, 2 lines    | `490 x 88`        | `358 x 70.4`      |
 * | grid          | `726` wide, 3 × `215.33` | `944` wide, 3 cols| `358` wide, 1 col |
 * | grid gap      | 40                       | 40                | 40                |
 * | paragraph     | `726 x 70.2`, 3 lines    | `944 x 41.6`, 2   | `358 x 104`, 5    |
 *
 * ⚠️ THE GRID KEEPS THREE COLUMNS AT 810–1199. It does NOT collapse there. The brief for
 * this file said "1 column below 1200" and that is wrong; only the OUTER container switches
 * row → column at 1200. The capture's CSS is unambiguous — the sole
 * `grid-template-columns:repeat(1,minmax(50px,1fr))` override for `.framer-knldtn`, and the
 * sole `grid-column:span 1` override for the paragraph column, both sit inside
 * `@media (max-width:809.98px)`; the `(min-width:810px) and (max-width:1199.98px)` block
 * touches only `flex`/`width`. rogo-company-1024-01.jpg confirms it: `LOCATED IN` starts at
 * x≈368 = 40 gutter + 288 track + 40 gap, i.e. column 2 of three 288px tracks in a 944px
 * grid. FEATURE.md's own table agrees — its 810–1199 cell says "944 wide" and names no
 * column count, and only its ≤809 cell says "1 col".
 *
 * MEASURED VALUES THAT WOULD LOOK ARBITRARY LATER:
 *
 * - `726` is not authored. At ≥1200 both the title and the grid are `flex: 1 0 0` and the
 *   title is capped at `max-width: 490px`, so flexbox freezes the title at its cap and hands
 *   the remainder to the grid: 1280 − 64 gap − 490 = 726. Hence `flex-1` on both rather than
 *   a literal width, so the arithmetic stays true if the container max ever moves.
 * - `215.33` = (726 − 2 × 40) / 3. Never written down; it falls out of the grid.
 * - The eyebrow labels ship `letter-spacing: normal`, NOT a negative value. The capture sets
 *   `--framer-letter-spacing:0px` on them because they are set in a mono face there. This is
 *   a real, deliberate exception to DESIGN-SYSTEM.md's "all negative, never ship 0" note —
 *   do not "fix" it to `-0.01em`. The source strings are sentence case and CSS uppercases
 *   them, exactly as the original does.
 * - The three team items are `-0.01em`, which is NOT the body preset's `-0.02em`. Two
 *   different Framer presets (`plq9r5` at 16px/−.01em for the items, `1dmgysd` at
 *   18↓16px/−.02em for the paragraph) sit 40px apart in this block. Do not fold them.
 * - Inner gaps: label → list is 16, between the three items is 4, and the paragraph column
 *   is 10 (inert here, it has one child, but kept so the column matches its siblings).
 * - The original h3 preset carries `text-wrap: balance`. Not reproduced: this h3 has a hard
 *   `<br>` and each line fits its 490px column, so balance is inert, and the repo's shared
 *   h3 preset (ProductBenefits.tsx:104) does not carry it. Adding it here would let the
 *   browser re-break lines that were fitted by measurement.
 *
 * ⚠️ THE HEADLINE BREAK IS HARD, NOT A WRAP. The capture's h3 text concatenates without a
 * space ("Building The Best AI" + "Analyst On Wall Street"), which is a `<br>`. So the line
 * count is fixed by the markup and each LINE has to fit on its own. Ours is clix's
 * methodology headline from docs/reference/clixsolutions/README.md:161.
 *
 * Copy on this page was fitted by rendered line count against OUR face (Discovery), not
 * rogo's, before any of it was written. On /product a stepper title of 62 characters against
 * the capture's 63 was well inside the 10% rule and still wrapped to three lines at 390
 * where the capture takes two, moving 645 elements down the page. Character count does not
 * decide wrapping. Re-measure before changing a string here.
 *
 * Static: no state, no motion, no `data-framer-appear-id` in the subtree, so no
 * `"use client"`.
 */

/* `Founded By` in the original. See the note above on why it is not names here. */
const TEAM_LABEL_ID = "company-mission-team";
const TEAM_ITEMS = ["Unit 8200 alumni", "Technion alumni", "Senior engineers"] as const;

/* Shared by both eyebrows. `letterSpacing: "normal"` is measured, not an oversight. */
const EYEBROW_CLASS = "w-full font-sans text-[12px] font-normal uppercase text-muted";
const EYEBROW_STYLE = { lineHeight: "130%", letterSpacing: "normal" } as const;

export default function CompanyMission() {
  return (
    /* `.framer-kh9jjb` — bg paper, column, centred, 96/64 vertical + 40/16 gutter. The
       band's own `gap: 96px` is inert: it has exactly one child. */
    <section
      data-nav-theme="light"
      className="relative flex w-full flex-col items-center justify-center overflow-hidden
                 bg-paper px-4 py-16 tablet:px-10 desktop:py-24"
    >
      {/* `.framer-4ywrk2` — max-w 1280, ROW gap 64 at ≥1200, COLUMN gap 40 / 24 below. */}
      <div
        className="relative flex w-full max-w-[var(--container-max)] flex-col items-start
                   gap-6 tablet:gap-10 desktop:flex-row desktop:gap-16"
      >
        {/* `.framer-1vuueps` [Title] — `flex: 1 0 0` capped at 490, which is what leaves the
            grid its 726 at ≥1200. Below 1200 it is `flex: none; width: 100%`, and at ≤809
            the cap is lifted, though 358 < 490 so it never bound anyway. */}
        <div className="w-full max-w-[490px] flex-none desktop:flex-1">
          {/* Shared h3 preset: 44 / 40 / 32, weight 400, 110%, −0.05em, ink. Byte-identical
              to /product's — see ProductBenefits.tsx:104. */}
          <h2
            className="w-full font-display text-[32px] font-normal text-ink
                       tablet:text-[40px] desktop:text-[44px]"
            style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
          >
            The Speed Of A Lab,
            <br />
            The Discipline Of A Factory
          </h2>
        </div>

        {/* `.framer-knldtn` — grid, gap 40, THREE columns at ≥810, one at ≤809. The capture
            writes the tracks as `minmax(50px, 1fr)`; Tailwind's `grid-cols-*` emits
            `minmax(0, 1fr)`. Identical here — the narrowest track is 215.33 — and the 0 floor
            is the safer of the two, so the shorthand stands. */}
        <div
          className="grid w-full auto-rows-min grid-cols-1 gap-10 tablet:grid-cols-3
                     desktop:min-w-0 desktop:flex-1"
        >
          {/* `.framer-14sccda` [Column] — label → list gap 16, list gap 4. */}
          <div className="flex w-full flex-col gap-4 self-start">
            <p id={TEAM_LABEL_ID} className={EYEBROW_CLASS} style={EYEBROW_STYLE}>
              Team
            </p>
            {/* Three sibling <p>s in the original. A list here instead: it is genuinely a
                list of three, and the label is only tied to it for a screen reader by
                `aria-labelledby` — without that the items read as three loose fragments.
                The id is a literal because the component is rendered once per page and
                `useId` would force this file client-side for nothing. */}
            <ul
              aria-labelledby={TEAM_LABEL_ID}
              className="flex w-full list-none flex-col gap-1"
            >
              {TEAM_ITEMS.map((item) => (
                <li
                  key={item}
                  className="w-full font-sans text-[16px] font-normal text-ink"
                  /* −0.01em, not the body preset's −0.02em. Measured. */
                  style={{ lineHeight: "130%", letterSpacing: "-0.01em" }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* `.framer-1un3y8s` [Column] — same 16px gap, but the two lines are one <p> with
              an inner <br> and two <span>s, which is the capture's own structure
              (`<span>New York, NY</span><br><span>United States</span>`). One paragraph, so
              the city and the country stay a single announced phrase. */}
          <div className="flex w-full flex-col gap-4 self-start">
            <p className={EYEBROW_CLASS} style={EYEBROW_STYLE}>
              Located In
            </p>
            <p
              className="w-full font-sans text-[16px] font-normal text-ink"
              style={{ lineHeight: "130%", letterSpacing: "-0.01em" }}
            >
              <span>Tel Aviv</span>
              <br />
              <span>Israel</span>
            </p>
          </div>

          {/* `.framer-jkugyv` [Column] — spans all three tracks at ≥810 so the paragraph is
              the full 726 / 944, and one track at ≤809. Its 10px gap has one child to act
              on; kept for parity with the two columns above. */}
          <div className="flex w-full flex-col gap-2.5 self-start tablet:col-span-3">
            <p
              className="w-full font-sans text-[16px] font-normal text-ink desktop:text-[18px]"
              style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
            >
              At Clix, the point was never the technology. It is that your team spends its
              day on the judgment, the relationships and the decisions only people can make,
              and not on the busywork in between. That is the whole brief.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
