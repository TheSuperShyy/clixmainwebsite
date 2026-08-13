/**
 * SecurityCompliance — `/security` Block 3, the `Compliance` band (`#features-1`).
 *
 * Capture: docs/reference/target/rogo-security-2026-08-12.{html,css} + a live CDP probe
 *          the same day.
 * Spec:    features/security-page/FEATURE.md → "Block 3 — Compliance row 1".
 * Memory:  features/security-page/CONTEXT.md.
 *
 * ⚠️ THIS BAND HOLDS TWO ROWS, NOT ONE. `#features-1`'s two direct children are the
 * heading + badge grid built here and the "Security At Our Core" row, which lives in its own
 * file (`SecurityCore.tsx`) and is rendered below as a bare sibling — it carries its own row
 * classes, so it must NOT be wrapped. The band's own `gap: 120px` is what separates them.
 * "Security At Our Core" has no `data-framer-name` and reads like a fourth top-level section
 * in the capture; it is not one. Probed live, not inferred from byte order.
 *
 * TIER MAP — three tiers. 1600 and 1440 are identical on every value on this page, so there
 * is no `xl:` rule here. Base = phone (≤809.98) → `tablet:` (≥810) → `desktop:` (≥1200).
 *
 * |                  | ≥1200 (1600 = 1440)     | 1024 (`tablet:`)  | 390 (base)            |
 * |------------------|-------------------------|-------------------|-----------------------|
 * | section padding  | `96px 40px`             | `96px 40px`       | `80px 16px`           |
 * | section gap      | 120                     | 120               | 120                   |
 * | row 1 gap        | 64                      | 64                | 64                    |
 * | `Title` gap      | 16                      | 16                | 16                    |
 * | h3               | 44px                    | 40px              | 32px                  |
 * | grid columns     | 5                       | 2                 | 1                     |
 * | cell             | 256 × 240               | 472 × 240         | 358 × 254.06 (aspect) |
 * | `Graphic` frame  | 104 × 104               | same              | same                  |
 * | label            | 14px, 137px measure     | same              | same                  |
 *
 * Height note: the target's band measures 964.06 / 1435.17 / 2099.08. Ours is exactly 64px
 * shorter at every tier (900.06 / 1371.17 / 2035.08) because `SecurityCore` drops the
 * target's "Explore security portal" link — 32px link + 32px gap. Recorded in FEATURE.md as
 * a deviation, not a defect.
 *
 * ⚠️ NO CERTIFICATION SEALS. The target's five cells are SOC2, CCPA, ISO 27001, GDPR and the
 * EU AI Act. SOC 2 and ISO 27001 are AUDITED certifications and clix holds none of the five —
 * showing the seal without holding the report is misrepresentation, not marketing. This repo
 * removed that exact set from the home page on 2026-08-05 and from `/product` on 2026-08-12
 * for the same reason. The cells here carry the five practice statements and the five
 * `public/badges/practice-*.svg` marks those two pages already ship, so one story runs across
 * three pages. Do not put certification seals here unless clix has been audited and can
 * produce the report on request. Enterprise buyers do ask.
 *
 * Motion: none. `data-framer-appear-id` count on the whole page is 0, and there is no
 * transition or `:hover` rule anywhere in this subtree.
 *
 * ─── COPY LIVES IN THE DICTIONARY; LAYOUT LIVES HERE ─────────────────────────────────────
 * `src/lib/i18n/{en,he}/security.ts` → `compliance`. Read with `getDict()`, NOT with
 * `usePageDict()`: this is a server component and the client hook would force `"use client"`
 * onto a band that ships zero JS. What stays in this file is the per-cell LAYOUT — the slot id,
 * the badge file and the border matrix. The label's MEASURE had to move the other way, INTO the
 * dictionary, because it is the one layout number on this band that is per-locale; see `SLOTS`.
 *
 * ─── DIRECTION (contract §5, §6, §7) ─────────────────────────────────────────────────────
 * Migrated to logical properties: the cells' `border-r-0` → `border-e-0` (three cells), and
 * the label's `left-4` → `start-4`. Both resolve to the identical physical value in LTR, so
 * the English render is byte-identical.
 *
 * ⚠️ TWO THINGS HERE ARE DELIBERATELY *NOT* MIGRATED, and each is recorded where it sits so the
 * next reader does not re-open it: the badge's `left-[1px]` centring inset (a 102px mark in a
 * 104px frame — symmetric, a no-op either way) and the `CornerBracket` pair (a rotationally
 * symmetric ornament — verified, see its own note).
 */

import SecurityCore from "./SecurityCore";
import { getDict } from "@/lib/i18n/server";
/* `import type` only — a type import is erased, so this adds nothing to any bundle. */
import type { SecurityDict } from "@/lib/i18n/en/security";

/* ---- Corner brackets -------------------------------------------------------------------
 * ⚠️ BOTH brackets are the SAME artwork. `TL Corner` and `BR Corner` both resolve to
 * `<use href="#svg-940700596_480">` — one 21 × 33 path pair — and the BR instance carries
 * `transform: matrix(-1,0,0,-1,0,0)`, i.e. a flat 180° turn. So one component, rotated.
 *
 * ⚠️ CORRECTION, 2026-08-12: this note used to add "(the hero's 14 × 20 CTA pair is the opposite
 * case: those really are two different paths)". That is WRONG, and `SecurityHero.tsx` now says
 * so at length — rotating its `BracketLeft` 180° about (6.996, 10) reproduces `BracketRight` to
 * within 0.008 user units on every coordinate. The hero keeps two verbatim path pairs because
 * that is what the capture ships, not because they differ.
 *
 * `fill="white"` in the capture becomes `currentColor` here so the colour comes from the
 * `text-paper` token rather than a raw hex, per the repo's no-stray-hex rule.
 *
 * ⚠️ NOT MIRRORED IN RTL, AND THAT WAS VERIFIED RATHER THAN OVERLOOKED (contract §7).
 * `/he/security` ships this pair at the same physical corners, with the same `rotate-180` on
 * the second, for two independent reasons:
 *   1. It is an ORNAMENT, not a pointer. It marks the diagonal extent of the grid frame and
 *      indicates no direction, so there is no meaning for a mirror to preserve.
 *   2. A 180° rotation is direction-symmetric — rotate(180°) ≡ scaleX(−1) · scaleY(−1) —
 *      so the TL/BR pair maps onto ITSELF under a mirror plus that rotation, which is why one
 *      artwork can serve both corners in the first place.
 * Consequently `top-[-5px] left-[-5px]` and `bottom-[-5px] right-[-5px]` stay PHYSICAL. The
 * corners they name do not swap when the text direction does, and `start-*`/`end-*` there would
 * move the two marks to TR/BL in Hebrew and break the frame's diagonal. Same call the hero's
 * 14 × 20 CTA brackets make.
 *
 * ⚠️ STRUCTURAL SIMPLIFICATION: the original wraps each mark in an inert absolutely
 * positioned box — 21 × 240 for TL, 21 × (gridHeight + 5) for BR — with the mark pinned to
 * one end of it. Those wrappers carry no border, no background and no other child, and two
 * absolutely positioned 21 × 33 marks land at byte-identical rendered coordinates, so they
 * are not reproduced. Recorded in FEATURE.md → "Documented deviations".
 */
function CornerBracket({ className }: { className: string }) {
  return (
    <svg
      width="21"
      height="33"
      viewBox="0 0 21 33"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none absolute text-paper ${className}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.46094 5.71051H14.9049H14.9099L20.8192 5.70554V0H14.7061C10.0741 0 7.27105 1.87369 6.46094 5.71051Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.32989 5.7081C1.01885 5.7081 0 6.66233 0 9.03799V32.9983H6.20254V8.29249C6.20254 7.34322 6.292 6.48838 6.46098 5.70312H6.45104L3.32989 5.7081Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ---- Content ---------------------------------------------------------------------------
 * The heading is `compliance.headingPaper` + `.headingMuted` in the dictionary — two keys for
 * ONE element, because the `<br>` between them IS the colour boundary.
 *
 * ⚠️ The target's heading is "Compliant With / Industry Standards", which cannot survive the
 * practices decision above — nothing in this grid is a standard that anyone certifies, so the
 * old heading would reintroduce by implication the exact claim the cell swap removes. It was
 * replaced with a two-tone pair of the same shape, and BOTH HALVES MOVED TOGETHER. Do not
 * restore either half from any capture — including the real company site's services 08 mock,
 * whose badge row reads `SOC 2 · GDPR`.
 *
 * Both runs are kept short on purpose, in BOTH locales: at 390 each has to fit 358px at 32px on
 * the display face WITHOUT WRAPPING ON ITS OWN, or the sentence breaks across the colour change
 * at a point neither locale chose. English line 2 is 17 characters for that reason.
 *
 * Measured 2026-08-12, one line per run at every tier in both locales. Natural widths, run 1 /
 * run 2: English 91.9 / 220.5px at 32px and 114.9 / 275.6 at 40px; Hebrew ("בנוי על" /
 * "עקרונות שאנחנו שומרים", 7 and 21 characters) 72.8 / 267.0 at 32px and 91.0 / 333.8 at 40px.
 * The binding measure is the phone tier's 358px, and the tightest run clears it by 91px.
 */

/** The layout half of a cell. The label and its measure are per-locale and live in the dict. */
type PracticeSlot = {
  id: string;
  /** File in `public/badges/`. All five already exist; none is created or edited here. */
  file: string;
  /**
   * ⚠️ A MATRIX, NOT A FORMULA — and it is deliberately ragged below 1200.
   *
   * The target hand-authors every edge of every cell at every tier rather than deriving
   * them, so there is no rule to compute. Written mobile-first: phone (1 column) first, then
   * `tablet:` (2 columns), then `desktop:` (5 columns). Source values, top/right/bottom/left:
   *
   * | Cell | ≥1200     | 1024      | 390       |
   * |------|-----------|-----------|-----------|
   * | 1    | `1 0 1 1` | `1 0 1 1` | `1 1 1 1` |
   * | 2    | `1 0 1 1` | `1 1 1 1` | `0 1 1 1` |
   * | 3    | `1 0 1 1` | `0 0 1 1` | `0 1 0 1` |
   * | 4    | `1 1 1 1` | `0 1 1 1` | `1 1 1 1` |
   * | 5    | `1 1 1 1` | `0 1 1 1` | `1 1 1 1` |
   *
   * At 5 columns that lays down one closed outline with four internal verticals. At 2 and 1
   * columns it does NOT re-close: cell 3 at 390 draws no top AND no bottom while cell 4 above
   * it draws a top, leaving a visible break in the stack. That is the target's own authoring,
   * the same phenomenon home's `sections/Security.tsx` documents in its own grid.
   * Reproduced verbatim. Do not "fix" it — changing it here would silently diverge from the
   * reference screenshots in `features/security-page/assets/`.
   */
  border: string;
};

/* FIVE SLOTS, AS A TUPLE, zipped index-for-index with `compliance.practices` in the dictionary.
   Five is layout: at 1200 and up they are ONE closed outline of five columns, so a locale
   supplying four must fail the build rather than leave the frame open.

   ⚠️ `border-e-0` REPLACES `border-r-0` on three cells (contract §6). Identical in LTR. In RTL
   the edge that drops is the one facing the next cell in READING order, which is what keeps the
   outline closed once the grid's own column order reverses with the direction — a physical
   `border-r-0` would open the outline's outer edge instead. */
const SLOTS: readonly [
  PracticeSlot,
  PracticeSlot,
  PracticeSlot,
  PracticeSlot,
  PracticeSlot,
] = [
  {
    id: "your-cloud",
    file: "/badges/practice-cloud.svg",
    /* 1 1 1 1 → 1 0 1 1 → 1 0 1 1 : inline-end drops from `tablet:` up. */
    border: "border tablet:border-e-0",
  },
  {
    id: "your-data",
    file: "/badges/practice-shield.svg",
    /* 0 1 1 1 → 1 1 1 1 → 1 0 1 1 : top returns at `tablet:`, end drops at `desktop:`. */
    border: "border border-t-0 tablet:border-t desktop:border-e-0",
  },
  {
    id: "least-privilege",
    file: "/badges/practice-key.svg",
    /* 0 1 0 1 → 0 0 1 1 → 1 0 1 1 : the open-topped, open-bottomed cell at 390. */
    border:
      "border border-t-0 border-b-0 tablet:border-e-0 tablet:border-b desktop:border-t",
  },
  {
    id: "encrypted",
    file: "/badges/practice-lock.svg",
    /* 1 1 1 1 → 0 1 1 1 → 1 1 1 1 : top present at both ends, absent in the middle tier. */
    border: "border tablet:border-t-0 desktop:border-t",
  },
  {
    id: "ownership",
    file: "/badges/practice-code.svg",
    /* 1 1 1 1 → 0 1 1 1 → 1 1 1 1 : identical to cell 4. */
    border: "border tablet:border-t-0 desktop:border-t",
  },
];

/**
 * One badge cell: 256 × 240 at ≥1200, 472 × 240 at 1024, and 358 × 254.06 at 390 where the
 * height comes from `aspect-ratio: 1.40909` instead of a fixed value (358 / 1.40909 =
 * 254.06). Transparent background, no padding, mark centred by the cell's own flexbox.
 */
function PracticeCell({
  slot,
  copy,
}: {
  slot: PracticeSlot;
  copy: SecurityDict["compliance"]["practices"][number];
}) {
  return (
    <div
      /* `self-start` matters: the grid's rows are `min-content`, and a stretched item would
         resolve its own height from the row instead of from `aspect-ratio` at 390. Same
         guard `sections/Security.tsx` carries. */
      className={`relative flex aspect-[1.40909] h-auto w-full items-center justify-center
                  self-start overflow-hidden p-0
                  tablet:aspect-auto tablet:h-[240px]`}
    >
      {/* ⚠️ THE RULE IS AN OVERLAY, NOT A BORDER. Every cell computes `border-width: 0px` /
          `border-style: none` and carries `data-border="true"`; Framer paints the visible
          rule with `[data-border] ::after { inset: 0; border: 1px dashed
          rgba(255,255,255,0.15) }` — which is exactly the `hairline-light` token `#ffffff26`.

          A real CSS `border` takes layout space: it would push the 104px mark and the label
          1px off true and, at 390, make the cell 2px taller than its aspect ratio says.
          `/product` Block 3 shipped that bug and the value diff caught it, so the same
          absolutely-positioned span is used here. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 border-dashed border-hairline-light ${slot.border}`}
      />

      {/* `Graphic` frame — 104 × 104, in normal flow, centred by the cell above. */}
      <div className="relative h-[104px] w-[104px] flex-none overflow-hidden">
        {/* Decorative: the visible label beside it names the practice, so an `alt` would say
            every statement twice — and the capture marks the mark itself `aria-hidden`.
            Plain <img>: a fixed static SVG gains nothing from next/image.

            All five marks are drawn on one 102 × 102 viewBox, hence the uniform 1px inset
            inside the 104px frame. Same treatment `sections/Security.tsx` uses. */}
        {/* ⚠️ `left-[1px]` IS NOT MIGRATED TO `start-[1px]` (contract §6's do-not-migrate list).
            It is the symmetric centring inset of a 102px mark inside a 104px frame — the same
            1px sits on the right — so the two spellings compute the same box in both
            directions. Migrating it would only make a no-op look like a direction decision.
            Verified, not overlooked. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slot.file}
          alt=""
          aria-hidden="true"
          className="absolute top-[1px] left-[1px] h-[102px] w-[102px]"
        />
      </div>

      {/* Label — absolutely placed 16px off the cell's bottom INLINE-START corner, above the
          graphic (`z-index: 1` in the original), start-aligned rather than centred.

          `left-4` → `start-4` (contract §6): `left: 16px` in LTR, `right: 16px` in RTL, which is
          the corner the eye starts from in each. `text-align` is deliberately absent — the
          element inherits the document's `start`, so the copy hugs the same corner as the box.

          ⚠️ Our labels are sentences where the target's were acronyms, so several wrap to two
          lines inside a measure the target's ran to one. The box is anchored to `bottom`, so it
          grows UPWARD into the cell's dead space and cannot reach the 104px mark, which occupies
          y 68 → 172 of a 240px cell. A content consequence of the practices decision, recorded
          here, not a layout defect.

          ⚠️ THE MEASURE IS AN INLINE `width` FROM THE DICTIONARY, NOT A `w-[Npx]` CLASS, because
          it is PER-LOCALE and Tailwind cannot generate a class from a runtime value. Same
          computed width; English still resolves 137/137/137/137/188. */}
      <p
        className="absolute bottom-4 start-4 z-[1] font-sans text-[14px] text-muted"
        style={{
          width: `${copy.labelWidth}px`,
          lineHeight: "130%",
          letterSpacing: "-0.01em",
        }}
      >
        {copy.label}
      </p>
    </div>
  );
}

export default function SecurityCompliance() {
  /* Server read — see the header for why this is not `usePageDict()`. */
  const t = getDict().security.compliance;

  return (
    <section
      id="features-1"
      /* `data-nav-theme="dark"` — each band on this page is its own nav-theme region. */
      data-nav-theme="dark"
      /* ⚠️ The section paints `bg-ink` itself. On the target the ground comes from a page
         wrapper and only `#first` declares it; here `<body>` is white, so every band has to
         carry its own ground or this one renders dark text on white.

         padding `80px 16px` on phones → `96px 40px` from 810 up (1024 and ≥1200 identical).
         gap 120 between the two rows at every tier. */
      className="relative flex w-full flex-col items-center justify-start gap-[120px]
                 overflow-hidden bg-ink px-4 py-20 tablet:px-10 tablet:py-24"
    >
      {/* ---- Row 1 — `Container .framer-rswx4m`: heading over badge grid, gap 64. ------- */}
      <div className="relative flex w-full max-w-[var(--container-max)] flex-col items-center gap-16">
        {/* `Title` — column, gap 16. The gap is inert with one child; kept so the nesting
            matches the capture. */}
        <div className="relative flex w-full flex-col items-center gap-4">
          {/* ⚠️ ONE ELEMENT, AND THE `<br />` IS THE COLOUR BOUNDARY. Line 1 is an inner
              <span> in `paper`; line 2 is the element's own `muted`. Splitting the halves
              into sibling blocks would let them wrap independently and break the sentence
              across the colour change at any width where the text reflows — the same rule
              `CareersAbout.tsx` and `ProductFeatures.tsx` both state.

              `<h3>` in the original, demoted to `<h2>` so the page outline runs h1 (hero) →
              h2 without a skipped level: `SecurityBenefits` contributes no heading, so an h3
              here would follow the hero's h1 directly. Purely semantic, no rendered
              difference. `sections/Security.tsx` and `ProductSecurity.tsx` make the same
              call for the same reason. */}
          <h2
            className="w-full text-center font-display text-[32px] font-normal text-muted
                       tablet:text-[40px] desktop:text-[44px]"
            style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
          >
            <span className="text-paper">{t.headingPaper}</span>
            <br />
            {t.headingMuted}
          </h2>
        </div>

        {/* `Logos` — a flex ROW wrapper whose 24px gap is inert (one child), around the grid
            itself. Kept so the nesting matches the capture. */}
        <div className="relative flex w-full flex-row items-center justify-center gap-6">
          {/* The grid. ⚠️ `flex: 1 0 0` AND `width: 1px` together are Framer's fill-the-row
              idiom: the 1px base width plus zero shrink makes the track resolve purely from
              the free space, so the five columns are exactly equal at any container width.
              Tailwind's `flex-1` is NOT a substitute — it expands to `flex: 1 1 0%`, and the
              shrink factor of 1 lets the widest cell's content pull the track off true. The
              same pair already ships in `ProductHero`, `ProductSecurity`, `ByTheNumbers` and
              `CareersAbout`; kept consistent.

              `overflow: visible` and `position: relative` are what let the corner brackets
              hang 5px outside this box. */}
          <div
            className="relative grid w-px flex-[1_0_0] auto-rows-min
                       grid-rows-[repeat(2,min-content)] justify-center gap-0 overflow-visible
                       grid-cols-[repeat(1,minmax(50px,1fr))]
                       tablet:grid-cols-[repeat(2,minmax(50px,1fr))]
                       desktop:grid-cols-[repeat(5,minmax(50px,1fr))]"
          >
            {/* TL at grid-relative `top: -5px; left: -5px`. */}
            <CornerBracket className="top-[-5px] left-[-5px]" />

            {SLOTS.map((slot, i) => (
              <PracticeCell key={slot.id} slot={slot} copy={t.practices[i]} />
            ))}

            {/* BR: the same artwork at `bottom: -5px; right: -5px`, turned 180°. */}
            <CornerBracket className="bottom-[-5px] right-[-5px] rotate-180" />
          </div>
        </div>
      </div>

      {/* ---- Row 2 — "Security At Our Core". ------------------------------------------
          Rendered bare on purpose: `SecurityCore` returns the row container itself, with its
          own max-width, direction and gaps. Wrapping it would insert a second flex level and
          break the band's 120px gap. */}
      <SecurityCore />
    </section>
  );
}
