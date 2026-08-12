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
 */

import SecurityCore from "./SecurityCore";

/* ---- Corner brackets -------------------------------------------------------------------
 * ⚠️ BOTH brackets are the SAME artwork. `TL Corner` and `BR Corner` both resolve to
 * `<use href="#svg-940700596_480">` — one 21 × 33 path pair — and the BR instance carries
 * `transform: matrix(-1,0,0,-1,0,0)`, i.e. a flat 180° turn. (The hero's 14 × 20 CTA pair is
 * the opposite case: those really are two different paths.) So one component, rotated.
 *
 * `fill="white"` in the capture becomes `currentColor` here so the colour comes from the
 * `text-paper` token rather than a raw hex, per the repo's no-stray-hex rule.
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
 * The heading. ⚠️ The target's is "Compliant With / Industry Standards", which cannot
 * survive the practices decision above — nothing in this grid is a standard that anyone
 * certifies, so the old heading would reintroduce by implication the exact claim the cell
 * swap removes. Replaced with a two-tone pair of the same shape.
 *
 * Both lines are kept short on purpose: at 390 each must fit 358px at 32px on the display
 * face, which is why line 2 is 17 characters.
 */
const HEADING_LINE_1 = "Built On";
const HEADING_LINE_2 = "Practices We Keep";

type Practice = {
  id: string;
  /** File in `public/badges/`. All five already exist; none is created or edited here. */
  file: string;
  label: string;
  /**
   * The label's measure. 137px for four of them; 188px for the fifth, which is the only
   * string the target widened. Carried over unchanged from the target's own per-cell values.
   */
  labelWidth: string;
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

const PRACTICES: Practice[] = [
  {
    id: "your-cloud",
    file: "/badges/practice-cloud.svg",
    label: "Your cloud, your accounts",
    labelWidth: "w-[137px]",
    /* 1 1 1 1 → 1 0 1 1 → 1 0 1 1 : right drops from `tablet:` up. */
    border: "border tablet:border-r-0",
  },
  {
    id: "your-data",
    file: "/badges/practice-shield.svg",
    label: "Your data stays yours",
    labelWidth: "w-[137px]",
    /* 0 1 1 1 → 1 1 1 1 → 1 0 1 1 : top returns at `tablet:`, right drops at `desktop:`. */
    border: "border border-t-0 tablet:border-t desktop:border-r-0",
  },
  {
    id: "least-privilege",
    file: "/badges/practice-key.svg",
    label: "Least-privilege access",
    labelWidth: "w-[137px]",
    /* 0 1 0 1 → 0 0 1 1 → 1 0 1 1 : the open-topped, open-bottomed cell at 390. */
    border:
      "border border-t-0 border-b-0 tablet:border-r-0 tablet:border-b desktop:border-t",
  },
  {
    id: "encrypted",
    file: "/badges/practice-lock.svg",
    label: "Encrypted in transit and at rest",
    labelWidth: "w-[137px]",
    /* 1 1 1 1 → 0 1 1 1 → 1 1 1 1 : top present at both ends, absent in the middle tier. */
    border: "border tablet:border-t-0 desktop:border-t",
  },
  {
    id: "ownership",
    file: "/badges/practice-code.svg",
    label: "You own the code",
    /* The only 188px measure in the grid — the target widened its fifth label too. */
    labelWidth: "w-[188px]",
    /* 1 1 1 1 → 0 1 1 1 → 1 1 1 1 : identical to cell 4. */
    border: "border tablet:border-t-0 desktop:border-t",
  },
];

/**
 * One badge cell: 256 × 240 at ≥1200, 472 × 240 at 1024, and 358 × 254.06 at 390 where the
 * height comes from `aspect-ratio: 1.40909` instead of a fixed value (358 / 1.40909 =
 * 254.06). Transparent background, no padding, mark centred by the cell's own flexbox.
 */
function PracticeCell({ item }: { item: Practice }) {
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
        className={`pointer-events-none absolute inset-0 border-dashed border-hairline-light ${item.border}`}
      />

      {/* `Graphic` frame — 104 × 104, in normal flow, centred by the cell above. */}
      <div className="relative h-[104px] w-[104px] flex-none overflow-hidden">
        {/* Decorative: the visible label beside it names the practice, so an `alt` would say
            every statement twice — and the capture marks the mark itself `aria-hidden`.
            Plain <img>: a fixed static SVG gains nothing from next/image.

            All five marks are drawn on one 102 × 102 viewBox, hence the uniform 1px inset
            inside the 104px frame. Same treatment `sections/Security.tsx` uses. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.file}
          alt=""
          aria-hidden="true"
          className="absolute top-[1px] left-[1px] h-[102px] w-[102px]"
        />
      </div>

      {/* Label — absolutely placed 16px off the cell's bottom-left corner, above the graphic
          (`z-index: 1` in the original), LEFT-aligned rather than centred.

          ⚠️ Our labels are sentences where the target's were acronyms, so several wrap to two
          lines inside the same 137px measure the target's ran to one. The box is anchored to
          `bottom`, so it grows UPWARD into the cell's dead space and cannot reach the 104px
          mark, which occupies y 68 → 172 of a 240px cell. A content consequence of the
          practices decision, recorded here, not a layout defect. */}
      <p
        className={`absolute bottom-4 left-4 z-[1] font-sans text-[14px] text-muted ${item.labelWidth}`}
        style={{ lineHeight: "130%", letterSpacing: "-0.01em" }}
      >
        {item.label}
      </p>
    </div>
  );
}

export default function SecurityCompliance() {
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
            <span className="text-paper">{HEADING_LINE_1}</span>
            <br />
            {HEADING_LINE_2}
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

            {PRACTICES.map((item) => (
              <PracticeCell key={item.id} item={item} />
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
