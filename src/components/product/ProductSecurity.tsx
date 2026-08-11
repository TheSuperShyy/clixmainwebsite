/**
 * ProductSecurity — clone of rogo.com/product's `Security` block, Block 5.
 * Capture offset 391292, live class `.framer-12x6y61`.
 *
 * Capture: docs/reference/target/rogo-product-2026-08-11.html (+ .css).
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md
 *
 * ⚠️ THIS IS NOT THE HOME PAGE'S SECURITY SECTION, AND THE PLAN SAID IT WAS.
 * The plan's step 3 said "Block 5 imports src/components/sections/Security.tsx unchanged".
 * Diffed, and they share nothing but a name:
 *
 * |             | /product (this file)                    | home (sections/Security.tsx)      |
 * |-------------|-----------------------------------------|-----------------------------------|
 * | ground      | white section, `ink` CARD inside it      | `ink` section, edge to edge       |
 * | heading     | left, 44/40/32, two-tone (muted → white) | centred, 48/44/36, one colour     |
 * | grid        | 2 × 2, dashed `#ffffff26` rules          | 5 → 2 → 1, solid rules            |
 * | cell        | label bottom-left, 104px mark centred    | mark centred, label centred below |
 * | extra       | icon+label, 4-item list, "Find out more" | none                              |
 *
 * A prop on the home component could not have bridged that. Built fresh, as its own file.
 *
 * ⚠️ THE FOUR BADGES ARE ROGO'S: SOC2, CCPA, ISO 27001, GDPR — and this repo REMOVED that
 * exact set from the home page on 2026-08-05 because SOC 2 and ISO 27001 are audited
 * certifications that clix does not hold. They are back here only because /product is a
 * verbatim clone behind `robots: { index: false, follow: false }`, on the user's explicit
 * "copy everything 100%" call, and they sit beside thirteen borrowed vendor trademarks in
 * Block 3 under the same gate. **They are a false claim the moment this route is indexed.**
 * Replace them (sections/Security.tsx's practice statements are the drop-in) before that
 * happens, and do not copy this block to any indexed page. See FEATURE.md → "Documented
 * deviations".
 *
 * TIER MAP — from the capture, three tiers (no separate ≥1600):
 *
 * |            | ≥1200                  | 810–1199        | ≤809            |
 * |------------|------------------------|-----------------|-----------------|
 * | section pad| `0 40px`               | `0 40px`        | `0 16px`        |
 * | card       | row, 618px tall, pad 48| column, gap 32, pad 28 | column, gap 32, pad 24 |
 * | h3         | 44px                   | 40px            | 32px            |
 * | badge grid | 2 cols × 2 rows, fills card height | 2 cols, 480px tall | 1 col, cells aspect 1.40909 / min 220 |
 *
 * No animation anywhere in the subtree — no `data-framer-appear-id`, transition or `:hover`
 * beyond the link's own.
 */

import type { ReactNode } from "react";
import Link from "next/link";

/* ---- Icons ---------------------------------------------------------------------------
 * Path data verbatim from the capture's defs (`#svg-827916723_1121`, `#svg611686122_1164`,
 * `#svg730820763_790`, `#svg-107333650_587`, `#svg-527454356_321`, `#svg1300837547_442`).
 * Inlined rather than vendored as files: each is under 1 KB, and they need to sit on the
 * dark card at the original's exact opacities, which a background-image cannot do.
 */

/** The 32px block-header mark — a padlock knocked out of a white tile. */
function IconLockTile() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8 flex-none">
      <rect width="32" height="32" fill="white" />
      <path d="M7 15.625C7 14.7966 7.67157 14.125 8.5 14.125V23.875C7.67157 23.875 7 23.2034 7 22.375V15.625Z" fill="#181818" />
      <path d="M10 25.375C9.17157 25.375 8.5 24.7034 8.5 23.875L23.5 23.875C23.5 24.7034 22.8284 25.375 22 25.375L10 25.375Z" fill="#181818" />
      <path d="M10 12.625C9.17157 12.625 8.5 13.2966 8.5 14.125L23.5 14.125C23.5 13.2966 22.8284 12.625 22 12.625L10 12.625Z" fill="#181818" />
      <path d="M25 15.625C25 14.7966 24.3284 14.125 23.5 14.125V23.875C24.3284 23.875 25 23.2034 25 22.375V15.625Z" fill="#181818" />
      <rect width="2.25" height="2.25" rx="1.125" transform="matrix(-1 0 0 1 17.125 17.875)" fill="#181818" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.625 10.5278V11.5H20.125V10.5278C20.125 8.16523 18.2782 6.25 16 6.25C13.7218 6.25 11.875 8.16523 11.875 10.5278V11.5H13.375V10.5278C13.375 9.02434 14.5503 7.80556 16 7.80556C17.4497 7.80556 18.625 9.02434 18.625 10.5278Z"
        fill="#181818"
      />
    </svg>
  );
}

/** List glyph 1 — the same padlock at 24px, drawn in white @50% instead of on a tile. */
function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 flex-none">
      <g fill="white" fillOpacity="0.5">
        <path d="M3 11.625C3 10.7966 3.67157 10.125 4.5 10.125V19.875C3.67157 19.875 3 19.2034 3 18.375V11.625Z" />
        <path d="M6 21.375C5.17157 21.375 4.5 20.7034 4.5 19.875L19.5 19.875C19.5 20.7034 18.8284 21.375 18 21.375L6 21.375Z" />
        <path d="M6 8.625C5.17157 8.625 4.5 9.29657 4.5 10.125L19.5 10.125C19.5 9.29657 18.8284 8.625 18 8.625L6 8.625Z" />
        <path d="M21 11.625C21 10.7966 20.3284 10.125 19.5 10.125V19.875C20.3284 19.875 21 19.2034 21 18.375V11.625Z" />
        <rect width="2.25" height="2.25" rx="1.125" transform="matrix(-1 0 0 1 13.125 13.875)" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.625 6.52778V7.5H16.125V6.52778C16.125 4.16523 14.2782 2.25 12 2.25C9.72183 2.25 7.875 4.16523 7.875 6.52778V7.5H9.375V6.52778C9.375 5.02434 10.5503 3.80556 12 3.80556C13.4497 3.80556 14.625 5.02434 14.625 6.52778Z"
        />
      </g>
    </svg>
  );
}

/* The other three are strokes, not fills: white @60%, 1.25 wide, square caps, bevel joins —
   all three, so the wrapper carries it and each glyph is just its path. */
function StrokeGlyph({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeOpacity="0.6"
      strokeWidth="1.25"
      strokeLinecap="square"
      strokeLinejoin="bevel"
      aria-hidden="true"
      className="h-6 w-6 flex-none"
    >
      <path d={d} />
    </svg>
  );
}

const D_CLOUD =
  "M17.4982 19H8.99821C7.70007 18.9997 6.4276 18.6384 5.32298 17.9565C4.21837 17.2746 3.32513 16.2989 2.74308 15.1386C2.16103 13.9783 1.9131 12.679 2.027 11.3858C2.1409 10.0927 2.61214 8.85671 3.38805 7.81598C4.16397 6.77526 5.214 5.97079 6.42081 5.49249C7.62761 5.01418 8.94365 4.88087 10.2219 5.10747C11.5001 5.33406 12.6901 5.91162 13.6589 6.77561C14.6278 7.6396 15.3373 8.75598 15.7082 10H17.4982C18.6917 10 19.8363 10.4741 20.6802 11.318C21.5241 12.1619 21.9982 13.3065 21.9982 14.5C21.9982 15.6935 21.5241 16.8381 20.6802 17.682C19.8363 18.5259 18.6917 19 17.4982 19Z";
const D_SHIELD =
  "M11.9011 20.982C11.965 21.006 12.035 21.006 12.0989 20.982V20.9829C12.9485 20.6841 19 18.3153 19 11.3267V5.07338C19.0002 4.99295 18.9742 4.91477 18.9261 4.85131C18.8781 4.78786 18.8107 4.74278 18.7349 4.72328L12 3L5.26513 4.72328C5.18926 4.74278 5.12193 4.78786 5.07388 4.85131C5.02583 4.91477 4.99982 4.99295 5 5.07338V11.3267C5 18.246 11.0524 20.676 11.9011 20.982Z";
const D_CODE =
  "M13.6799 5L9.75992 19M5.83992 7.8L1.91992 11.72L5.83992 15.64M18.1599 7.8L22.0799 11.72L18.1599 15.64";

/** The link's 32px arrow — a `mark` @10% tile with a north-east arrow at `mark`. */
function IconArrowTile() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8 flex-none">
      <rect width="32" height="32" className="fill-mark/10" />
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M13.5781 11.4688L20.3133 11.4687L20.3133 18.2039" strokeLinejoin="bevel" />
        <path d="M16.3204 15.4648L10.9375 20.8477" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/* ---- Content, verbatim from the capture ---------------------------------------------- */

const LIST: { text: string; icon: ReactNode }[] = [
  { text: "No training on your data", icon: <IconLock /> },
  { text: "Modern & secure data practices", icon: <StrokeGlyph d={D_CLOUD} /> },
  { text: "End to end encryption", icon: <StrokeGlyph d={D_SHIELD} /> },
  { text: "Audited & tested", icon: <StrokeGlyph d={D_CODE} /> },
];

/* The 2 × 2 badge grid, in grid order. `border` is the per-cell dashed matrix — the
   original hand-authors each edge rather than deriving it, so this is a table and not a
   formula. Read it as: at 2 columns every cell draws top + left, the right column adds
   right, the bottom row adds bottom — one closed outline with a cross inside.
   At 1 column (≤809) the first three switch to drawing their own right edge and the third
   drops its bottom, which turns the same values into one continuous vertical stack.

   Painted as an OVERLAY span, never as a real `border`: Framer draws it with
   `[data-border] ::after`, which takes no layout space. A real border would push the 104px
   graphic off-centre and, on phones, make the 220px min-height cell 222px. Measured on
   Block 3 — same trap, same fix. */
const BADGES = [
  {
    id: "soc2",
    label: "SOC2",
    file: "/badges/soc2.svg",
    /* SOC2's artwork is the one that is square (viewBox 120×120); the other three are
       121×120, i.e. aspect 1.00833, so they sit 104 × 103.14 in the same 104px frame. */
    square: true,
    border: "border-t border-r border-l tablet:border-r-0",
  },
  { id: "ccpa", label: "CCPA", file: "/badges/ccpa.svg", square: false, border: "border-t border-l border-r" },
  {
    id: "iso",
    label: "ISO 27001",
    file: "/badges/iso-27001.svg",
    square: false,
    border: "border-t border-l border-r tablet:border-r-0 tablet:border-b",
  },
  { id: "gdpr", label: "GDPR", file: "/badges/gdpr-product.svg", square: false, border: "border" },
] as const;

export default function ProductSecurity() {
  return (
    <section
      id="security"
      /* The nav crosses the WHITE section, not the dark card inside it — so this is a light
         block for the nav's purposes even though most of its ink is dark. */
      data-nav-theme="light"
      /* ⚠️ `order-2` is not decoration. Below 1200 the original reorders the page:
         `Features` order 1, `Testimonials` order 2, `Security` order 3 — so this block
         moves BELOW the testimonials on tablet and phone, and sits above them at ≥1200.
         `<main>` is the flex container that makes it work. */
      className="order-2 relative flex w-full flex-col items-center justify-start gap-20 overflow-hidden bg-paper px-4 tablet:px-10 desktop:order-none"
    >
      {/* `.framer-opa938` — the dark card. 618px tall and a row at ≥1200; a stacked column
          with its own padding at both smaller tiers. `max-h-[648px]` is the original's and
          is inert at every width we render. */}
      <div className="relative flex w-full max-w-[var(--container-max)] flex-col justify-start gap-8 overflow-hidden bg-ink p-6 tablet:justify-center tablet:p-7 desktop:h-[618px] desktop:max-h-[648px] desktop:flex-row desktop:items-start desktop:justify-between desktop:gap-0 desktop:p-12">
        {/* `.framer-wansd6` — the left column. `justify-between` at ≥1200 is what pins the
            "Find out more" link to the bottom of the 618px card; below that it collapses to
            a centred stack with a 32px gap. */}
        <div className="relative flex w-full flex-col items-start justify-center gap-8 overflow-hidden desktop:h-full desktop:w-px desktop:flex-1 desktop:justify-between desktop:gap-0">
          {/* ⚠️ TWO children, not three. The "Find out more" link is INSIDE the container
              below, not a sibling of it — so `justify-between` pins the whole
              title + list + link group to the BOTTOM of the 618px card rather than
              centring the middle of three items. Getting this wrong put the heading 64px
              too high at 1440 and looked plausible. */}
          {/* Icon + Label */}
          <div className="relative flex w-min flex-row items-center gap-3">
            <IconLockTile />
            <p className="font-sans text-[14px] leading-[130%] tracking-[-0.01em] whitespace-pre text-paper">
              Security
            </p>
          </div>

          {/* `.framer-1l2khsl` — gap 40, 24 on phones. */}
          <div className="relative flex w-full flex-col items-start justify-center gap-6 overflow-hidden tablet:gap-10">
            {/* `.framer-sa3scy` — title over list, gap 24. */}
            <div className="relative flex w-full flex-col items-start gap-6 overflow-hidden">
              {/* h3 in the original. Demoted to h2 so the page outline runs h1 → h2; the
                  <br> is the original's, there is no width that breaks it there. */}
              <h2 className="w-full font-display text-[32px] leading-[110%] font-normal tracking-[-0.05em] text-muted tablet:text-[40px] desktop:text-[44px]">
                Built for Enterprise
                <br />
                <span className="text-paper">Secure by Design</span>
              </h2>

              {/* `.framer-14oo7rg` — gap 10. Marked up as a list; the original is divs. */}
              <ul className="relative flex w-full list-none flex-col items-start gap-[10px]">
                {LIST.map(({ text, icon }) => (
                  <li
                    key={text}
                    /* `align-items` is centre at BOTH ends and flex-start only in the
                       middle tier — the original's override lands on 810–1199 alone. */
                    className="relative flex w-full flex-row items-center gap-4 tablet:items-start desktop:items-center"
                  >
                    {icon}
                    <p className="min-w-0 flex-1 font-sans text-[16px] leading-[130%] tracking-[-0.01em] text-surface">
                      {text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* ⚠️ DEVIATION: the original points at `./security`, a page rogo has and this
                site does not. Pointed at the home page's own security section instead of
                shipping a 404. Logged in FEATURE.md — retarget it if /security is built. */}
            <Link
              href="/#security"
              className="relative flex w-full flex-row items-center gap-3 text-mark no-underline transition-opacity duration-300 ease-[var(--ease-rogo)] hover:opacity-70 focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none tablet:w-min"
            >
              <p className="font-sans text-[14px] leading-[130%] tracking-[-0.01em] whitespace-pre text-paper">
                Find out more
              </p>
              <IconArrowTile />
            </Link>
          </div>
        </div>

        {/* `.framer-oovzdt` — the right column. 600px cap and an equal flex share at ≥1200
            (so 592 at 1440, i.e. 296px cells); a full-width 480px band at tablet; and
            content-height on phones, where the cells set their own aspect instead. */}
        <div className="relative flex w-full flex-row items-center justify-end gap-[10px] overflow-hidden tablet:h-[480px] tablet:min-h-[480px] desktop:h-full desktop:w-px desktop:max-w-[600px] desktop:flex-1 desktop:min-h-0">
          {/* `.framer-186oark` — 1 column on phones, 2 from 810 up. Rows are `1fr` where the
              parent has a height and `min-content` where it does not. */}
          <div className="relative grid h-full w-full auto-rows-min grid-cols-1 grid-rows-[repeat(2,min-content)] justify-center gap-0 tablet:auto-rows-[minmax(0,1fr)] tablet:grid-cols-2 tablet:grid-rows-[repeat(2,minmax(0,1fr))]">
            {BADGES.map((b) => (
              <div
                key={b.id}
                className="relative flex aspect-[1.40909] h-auto min-h-[220px] w-full flex-row items-center justify-center gap-1 self-start overflow-hidden tablet:aspect-auto tablet:h-full tablet:min-h-0"
              >
                {/* The dashed `#ffffff26` rules, as an overlay — see the note on BADGES. */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 border-dashed border-hairline-light ${b.border}`}
                />
                {/* Label: absolute, 16px off the bottom-left, 137px measure, above the
                    graphic (`z-index:1` in the original). */}
                <p className="absolute bottom-4 left-4 z-[1] w-[137px] font-sans text-[14px] leading-[130%] tracking-[-0.01em] text-muted">
                  {b.label}
                </p>
                {/* Graphic frame — 104px square, clipping the mark inside it. */}
                <div className="relative h-[104px] w-[104px] flex-none overflow-hidden">
                  {/* Decorative: the label beside it already names the certification, and
                      the capture marks the mark itself aria-hidden. Plain <img> — a fixed
                      static SVG gains nothing from next/image. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.file}
                    alt=""
                    aria-hidden="true"
                    className={`absolute top-0 right-0 left-0 h-auto ${b.square ? "aspect-square" : "aspect-[1.00833]"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
