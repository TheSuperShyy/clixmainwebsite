/**
 * SecurityBenefits — clone of rogo.com/security block `Benefits` (`id="features"`).
 *
 * Capture: docs/reference/target/rogo-security-2026-08-12.{html,css}, re-read from the LIVE
 * page over CDP at 1600 / 1440 / 1024 / 390 on 2026-08-12. The values below are the live
 * computed ones; the capture agrees.
 * Spec: features/security-page/FEATURE.md → "Block 2 — Benefits".
 *
 * SERVER COMPONENT, no props. Nothing in this block is interactive and the whole page's
 * `data-framer-appear-id` count is ZERO — there is no motion here, in either direction. Do
 * not add "use client", a variant, or an entrance.
 *
 * ─── TIER MAP — three sizes, not four ────────────────────────────────────────────────────
 * XL and desktop are identical on every value on this page, so `desktop:` (≥1200) covers 1440
 * and 1600 alike and NO `xl:` rule exists. Base = phone (≤809.98) → `tablet:` (≥810) →
 * `desktop:` (≥1200). 1024 sits in the `tablet:` tier and differs from phone on almost
 * everything: padding, grid columns, grid gap and the icon→text gap all move at 810.
 *
 * |                    | ≥1200 (XL + desktop)  | 810–1199.98 (probed 1024) | ≤809.98 (probed 390) |
 * |--------------------|-----------------------|---------------------------|----------------------|
 * | section padding    | `80px 40px`           | `56px 40px`               | `40px 16px`          |
 * | section height     | 570                   | 739.17                    | 1142.34              |
 * | grid box           | 1280 × 410            | 944 × 627.17              | 358 × 1062.34        |
 * | grid columns       | `repeat(3, …)`        | `repeat(2, …)`            | `repeat(1, …)`       |
 * | grid gap           | 40                    | 40                        | 32                   |
 * | column width       | 400                   | 452                       | 358                  |
 * | row height         | 185                   | 182.39                    | 150.39               |
 * | item gap icon→text | 64                    | 64                        | 32                   |
 * | item padding       | `0 0 16px`            | same                      | same                 |
 * | icon               | 36 × 36               | same                      | same                 |
 * | text container gap | 4                     | 4                         | 4                    |
 * | title `p`          | 18px / 130% / -0.02em | 16px                      | 16px                 |
 * | body `p`           | 16px / 130% / -0.01em | same                      | same                 |
 *
 * The row heights are a sum, not a magic number, and they are the reason the copy below is
 * fixed (see the TRAP). Icon 36 + gap + text + padding-bottom 16:
 *   ≥1200  36 + 64 + (23.41 + 4 + 41.59) + 16 = 185
 *   1024   36 + 64 + (20.80 + 4 + 41.59) + 16 = 182.39
 *   390    36 + 32 + (20.80 + 4 + 41.59) + 16 = 150.39
 * and the grid box follows from the rows: 2 × 185 + 40 = 410, 3 × 182.39 + 2 × 40 = 627.17,
 * 6 × 150.39 + 5 × 32 = 1062.34. Section height is that plus twice the vertical padding:
 * 570 / 739.17 / 1142.34. Column width follows from the same arithmetic: (1280 − 80) / 3 =
 * 400, (944 − 40) / 2 = 452, 390 − 32 = 358. Every number in the table closes. If a later
 * edit breaks one of these sums, a gap or the copy moved — re-measure before editing the
 * table to match.
 *
 * ─── ⚠️ TRAP · THE ROWS ARE UNIFORM, SO THE COPY IS PART OF THE LAYOUT ───────────────────
 * Every title sets in exactly 1 line and every body in exactly 2 lines, AT EVERY TIER. The
 * grid is `grid-template-rows: repeat(2, min-content)` with `grid-auto-rows: min-content`, so
 * one body wrapping to a third line raises the row that holds it, moves the two items beside
 * it, and changes the band height at that tier. These twelve strings were fitted by RENDERED
 * LINE COUNT, not by character budget. Do not reword them, and do not "improve" one with a
 * longer phrase — the geometry is measured, and the sentences are what fill it.
 *
 * ─── COPY — CLIX'S OWN, NOT THE TARGET'S ─────────────────────────────────────────────────
 * The `/company` model: every string is clix's from the first commit, so there is nothing to
 * strip later. Five of the six restate the practice statements home's
 * src/components/sections/Security.tsx already ships, deliberately, so the two pages sound
 * like one company. The sixth slot is new, because the target's sixth card ("Audited &
 * tested: regular audits and tests for vulnerabilities by third-party specialists") is a claim
 * clix cannot make — it names a third-party audit clix has not had. Same call this repo made
 * on 2026-08-05 when it took SOC 2 and ISO 27001 off the home page, and the same call the
 * compliance band below makes with practices in place of seals.
 *
 * Curly apostrophes. No em dash, no en dash, no hyphen standing in for one in the COPY
 * (standing user request, 2026-08-10); `least-privilege` is a genuine compound modifier and
 * stays. The strings live in module-level consts rather than JSX text nodes so
 * `react/no-unescaped-entities` can never apply — that rule only inspects JSX text.
 *
 * ─── ICONS ───────────────────────────────────────────────────────────────────────────────
 * Six 36 × 36 glyphs lifted verbatim from the capture's `svg-templates` defs, inlined HERE
 * rather than added to a shared icon module: this repo keeps Framer-derived SVG next to the
 * page that uses it, so a page can be deleted without leaving orphaned marks behind. The defs
 * ship `fill="white"` / `stroke="white"`; those are converted to `currentColor` and the colour
 * comes from a token class on the root `<svg>` (`text-paper`), because a raw hex — even inside
 * an SVG — is out of bounds here. Geometry, stroke widths, caps, joins, fill/clip rules and
 * the one `<rect transform="matrix(…)">` are untouched. The root `<svg>` attributes are
 * identical across all six, so they live in one `Glyph` wrapper instead of six copies. The
 * defs' `id` attributes are dropped: they were Framer `<use href>` targets, nothing references
 * them here, and an unreferenced id is a collision waiting to happen. Every glyph is
 * `aria-hidden` — it is decorative, and the title beside it carries the meaning, so nothing is
 * announced twice.
 *
 * DIVERGENCES / JUDGEMENT CALLS
 * - The section paints `bg-ink` ITSELF. On the target the ground comes from a page wrapper and
 *   only `#first` paints; here every band is its own `data-nav-theme` region over a white
 *   `<body>`, so each one must carry its own ground or Nav's theme scanner reads white.
 * - `id="features"` is the original's, kept verbatim — it is a fragment target and a Framer
 *   name at once, and renaming it would break any inbound link already pointing at it.
 * - The section's `gap: 80px` is inert: it has one child. Kept anyway, because it is what the
 *   target computes and a second child would need it.
 * - Title weight is the ONE value not in the measured table. The page's only non-400 text is
 *   the hero CTA label (Medium); everything else, headings included, is 400, so these are
 *   `font-normal`. Recorded rather than silently assumed.
 */

import type { ReactElement, ReactNode } from "react";

/* Shared root for all six defs — 36 × 36, `fill="none"`, decorative, and coloured by token
   rather than by the `white` the Framer defs hard-code. `shrink-0` because the item is a flex
   column: without it the icon is a stretch target for the full column width. */
function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className="h-9 w-9 shrink-0 text-paper"
    >
      {children}
    </svg>
  );
}

/* 1 · padlock over a card — Framer def `#svg-2111020249_1166`. The shackle is the evenodd
   path; the `matrix(-1 0 0 1 …)` on the keyhole rect is the def's own mirror and is
   load-bearing for its position, so it stays rather than being folded into an x/y. */
function LockGlyph() {
  return (
    <Glyph>
      <path
        d="M4.5 17.1875C4.5 16.0829 5.39543 15.1875 6.5 15.1875H6.75V29.8125H6.5C5.39543 29.8125 4.5 28.9171 4.5 27.8125V17.1875Z"
        fill="currentColor"
      />
      <path
        d="M8.75 32.0625C7.64543 32.0625 6.75 31.1671 6.75 30.0625L6.75 29.8125L29.25 29.8125L29.25 30.0625C29.25 31.1671 28.3546 32.0625 27.25 32.0625L8.75 32.0625Z"
        fill="currentColor"
      />
      <path
        d="M8.75 12.9375C7.64543 12.9375 6.75 13.8329 6.75 14.9375L6.75 15.1875L29.25 15.1875L29.25 14.9375C29.25 13.8329 28.3546 12.9375 27.25 12.9375L8.75 12.9375Z"
        fill="currentColor"
      />
      <path
        d="M31.5 17.1875C31.5 16.0829 30.6046 15.1875 29.5 15.1875H29.25V29.8125H29.5C30.6046 29.8125 31.5 28.9171 31.5 27.8125V17.1875Z"
        fill="currentColor"
      />
      <rect
        width="3.375"
        height="3.375"
        rx="1.6875"
        transform="matrix(-1 0 0 1 19.6875 20.8125)"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.9375 9.79167V11.25H24.1875V9.79167C24.1875 6.24784 21.4173 3.375 18 3.375C14.5827 3.375 11.8125 6.24784 11.8125 9.79167V11.25H14.0625V9.79167C14.0625 7.5365 15.8254 5.70833 18 5.70833C20.1746 5.70833 21.9375 7.5365 21.9375 9.79167Z"
        fill="currentColor"
      />
    </Glyph>
  );
}

/* 2 · shield with a check — Framer def `#svg-2023498974_793`. Stroked, not filled;
   `stroke-width` is the def's own 1.61647 and is NOT rounded to 1.5 or 2. */
function ShieldGlyph() {
  return (
    <Glyph>
      <path
        d="M30.5276 19.7819C30.5276 27.8643 24.8699 31.9054 18.1454 34.2493C17.7933 34.3686 17.4108 34.3629 17.0624 34.2331C10.3217 31.9054 4.66406 27.8643 4.66406 19.7819V8.46661C4.66406 8.03789 4.83437 7.62674 5.13752 7.32359C5.44066 7.02044 5.85182 6.85014 6.28053 6.85014C9.51347 6.85014 13.5546 4.91037 16.3673 2.45334C16.7098 2.16076 17.1454 2 17.5958 2C18.0463 2 18.4819 2.16076 18.8243 2.45334C21.6532 4.92654 25.6782 6.85014 28.9111 6.85014C29.3398 6.85014 29.751 7.02044 30.0541 7.32359C30.3573 7.62674 30.5276 8.03789 30.5276 8.46661V19.7819Z"
        stroke="currentColor"
        strokeWidth="1.61647"
      />
      <path
        d="M12.75 18.1646L15.9829 21.3975L22.4488 14.9316"
        stroke="currentColor"
        strokeWidth="1.61647"
      />
    </Glyph>
  );
}

/* 3 · viewfinder brackets around a circle — Framer def `#svg1512811545_1378`. The four
   brackets are one filled compound path; only the circle is stroked. */
function ViewfinderGlyph() {
  return (
    <Glyph>
      <path
        d="M5.26167 6.25C5.26167 6.05109 5.34068 5.86032 5.48134 5.71967C5.62199 5.57902 5.81275 5.5 6.01167 5.5H11.2617V7H5.26167V6.25ZM3.75 13V7.75C3.75 7.55109 3.82902 7.36032 3.96967 7.21967C4.11032 7.07902 4.30109 7 4.5 7H5.25V13H3.75ZM30.74 6.25C30.74 6.05109 30.661 5.86032 30.5203 5.71967C30.3797 5.57902 30.1889 5.5 29.99 5.5H24.74V7H30.74V6.25ZM32.2517 13V7.75C32.2517 7.55109 32.1726 7.36032 32.032 7.21967C31.8913 7.07902 31.7006 7 31.5017 7H30.7517V13H32.2517ZM5.26167 28.7567C5.26167 28.9556 5.34068 29.1463 5.48134 29.287C5.62199 29.4276 5.81275 29.5067 6.01167 29.5067H11.2617V28.0067H5.26167V28.7567ZM3.75 22.0067V27.2567C3.75 27.4556 3.82902 27.6463 3.96967 27.787C4.11032 27.9276 4.30109 28.0067 4.5 28.0067H5.25V22.0067H3.75ZM30.74 28.7567C30.74 28.9556 30.661 29.1463 30.5203 29.287C30.3797 29.4276 30.1889 29.5067 29.99 29.5067H24.74V28.0067H30.74V28.7567ZM32.2517 22.0067V27.2567C32.2517 27.4556 32.1726 27.6463 32.032 27.787C31.8913 27.9276 31.7006 28.0067 31.5017 28.0067H30.7517V22.0067H32.2517Z"
        fill="currentColor"
      />
      <path
        d="M18 22.5C20.4853 22.5 22.5 20.4853 22.5 18C22.5 15.5147 20.4853 13.5 18 13.5C15.5147 13.5 13.5 15.5147 13.5 18C13.5 20.4853 15.5147 22.5 18 22.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Glyph>
  );
}

/* 4 · key — Framer def `#svg-2104313390_1421`. `stroke-linejoin="bevel"` is deliberate and is
   what squares off the bit of the key; `round` would visibly soften it. The tooth dot is both
   filled AND stroked in the def, which is how it reads solid at 36px. */
function KeyGlyph() {
  return (
    <Glyph>
      <path
        d="M3.879 26.1198C3.31635 26.6823 3.00017 27.4452 3 28.2408V31.4988C3 31.8966 3.15804 32.2781 3.43934 32.5594C3.72064 32.8407 4.10218 32.9988 4.5 32.9988H9C9.39782 32.9988 9.77936 32.8407 10.0607 32.5594C10.342 32.2781 10.5 31.8966 10.5 31.4988V29.9988C10.5 29.601 10.658 29.2194 10.9393 28.9381C11.2206 28.6568 11.6022 28.4988 12 28.4988H13.5C13.8978 28.4988 14.2794 28.3407 14.5607 28.0594C14.842 27.7781 15 27.3966 15 26.9988V25.4988C15 25.101 15.158 24.7194 15.4393 24.4381C15.7206 24.1568 16.1022 23.9988 16.5 23.9988H16.758C17.5536 23.9986 18.3165 23.6824 18.879 23.1198L20.1 21.8988C22.1848 22.625 24.4543 22.6222 26.5372 21.8909C28.6202 21.1596 30.3933 19.743 31.5665 17.873C32.7398 16.0029 33.2436 13.79 32.9957 11.5964C32.7477 9.40273 31.7627 7.35815 30.2016 5.79713C28.6406 4.23611 26.596 3.25105 24.4024 3.00311C22.2087 2.75517 19.9959 3.25902 18.1258 4.43224C16.2557 5.60546 14.8392 7.37858 14.1079 9.46156C13.3766 11.5445 13.3738 13.814 14.1 15.8988L3.879 26.1198Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="bevel"
      />
      <path
        d="M24.75 12C25.1642 12 25.5 11.6642 25.5 11.25C25.5 10.8358 25.1642 10.5 24.75 10.5C24.3358 10.5 24 10.8358 24 11.25C24 11.6642 24.3358 12 24.75 12Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="bevel"
      />
    </Glyph>
  );
}

/* 5 · database cylinder — Framer def `#svg-562640884_507`. One stroked path: the top ellipse,
   both bands and the two sides are a single `d`. */
function DatabaseGlyph() {
  return (
    <Glyph>
      <path
        d="M31.5 10.5C31.5 13.815 25.455 16.5 18 16.5C10.545 16.5 4.5 13.815 4.5 10.5M31.5 10.5C31.5 7.185 25.455 4.5 18 4.5C10.545 4.5 4.5 7.185 4.5 10.5M31.5 10.5V18M4.5 10.5V18M31.5 18C31.5 21.315 25.455 24 18 24C10.545 24 4.5 21.315 4.5 18M31.5 18V25.5C31.5 28.815 25.455 31.5 18 31.5C10.545 31.5 4.5 28.815 4.5 25.5V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="bevel"
      />
    </Glyph>
  );
}

/* 6 · monitor with a check — Framer def `#svg-2128099484_612`. The screen's top-right corner
   is deliberately open: the check overlaps it, and the def cuts the frame rather than drawing
   under the tick. */
function MonitorGlyph() {
  return (
    <Glyph>
      <path
        d="M31.5 18V24.75H4.5V6.75H18V4.5H4.5C3.90326 4.5 3.33097 4.73705 2.90901 5.15901C2.48705 5.58097 2.25 6.15326 2.25 6.75V24.75C2.25 25.3467 2.48705 25.919 2.90901 26.341C3.33097 26.7629 3.90326 27 4.5 27H13.5V31.5H9V33.75H27V31.5H22.5V27H31.5C32.0967 27 32.669 26.7629 33.091 26.341C33.5129 25.919 33.75 25.3467 33.75 24.75V18H31.5ZM20.25 31.5H15.75V27H20.25V31.5Z"
        fill="currentColor"
      />
      <path
        d="M23.625 16.875L18 11.295L19.7888 9.52875L23.625 13.3313L31.9613 5.0625L33.75 6.84L23.625 16.875Z"
        fill="currentColor"
      />
    </Glyph>
  );
}

type Benefit = {
  readonly title: string;
  readonly body: string;
  readonly Icon: () => ReactElement;
};

/* Order and glyph pairing are the target's own, kept: lock, shield, viewfinder, key, database,
   monitor. Reordering would pair a claim with a mark that does not illustrate it, and below
   1200 the grid reflows to 2 and then 1 column, so source order IS reading order.
   ⚠️ Each title is 1 line and each body 2 lines at every tier — see the TRAP in the header. */
const BENEFITS: readonly Benefit[] = [
  {
    title: "No training on your data",
    body: "We never use your data to train or improve any model, ours or a vendor’s.",
    Icon: LockGlyph,
  },
  {
    title: "Your data stays yours",
    body: "Workflows run in your own accounts. Clix never holds a second copy.",
    Icon: ShieldGlyph,
  },
  {
    /* ⚠️ OPEN QUESTION 1 (FEATURE.md): this assumes per-run logs exist AND are visible to the
       client, not merely retained internally. Awaiting the user's confirmation. */
    title: "Full visibility on every run",
    body: "Every run records what it read, what it wrote and when, so nothing is hidden.",
    Icon: ViewfinderGlyph,
  },
  {
    title: "Least-privilege access",
    body: "Each integration gets the narrowest scope that does the job, and nothing wider.",
    Icon: KeyGlyph,
  },
  {
    /* ⚠️ OPEN QUESTION 2 (FEATURE.md): this names TLS in transit and a MANAGED secret store,
       both specific enough to be wrong. Awaiting the user's confirmation. */
    title: "Encrypted in transit and at rest",
    body: "Data moves over TLS and credentials are held in a managed secret store.",
    Icon: DatabaseGlyph,
  },
  {
    /* Replaces the target's "Audited & tested" card, which clix cannot claim. See the copy
       note in the file header. */
    title: "You own the code",
    body: "The automations are yours. Hand them to another team, or run them without us.",
    Icon: MonitorGlyph,
  },
];

export default function SecurityBenefits() {
  return (
    <section
      id="features"
      data-nav-theme="dark"
      /* Measured: column, items centred, justify flex-start, gap 80, w 100%, overflow hidden,
         position relative; padding 40/16 → 56/40 → 80/40. The gap is inert with one child and
         is kept because it is what the target computes. `bg-ink` is ours, not the target's —
         see the divergence note in the header. */
      className="relative flex w-full flex-col items-center justify-start gap-20
                 overflow-hidden bg-ink px-4 py-10
                 tablet:px-10 tablet:py-14
                 desktop:py-20"
    >
      {/* `.framer-bg0iqo` — the grid, verbatim: `repeat(n, minmax(50px, 1fr))` columns,
          `repeat(2, min-content)` template rows over `min-content` auto rows, content centred,
          `height: min-content`, no padding, `flex: none`, overflow hidden, position relative.
          The `minmax(50px, …)` floor is the target's; it never binds at these widths (the
          narrowest column is 358) but it is what the capture declares. Gap 32 → 40 at 810. */}
      <div
        className="relative grid h-min w-full max-w-[var(--container-max)] flex-none
                   auto-rows-min grid-cols-[repeat(1,minmax(50px,1fr))]
                   grid-rows-[repeat(2,min-content)] justify-center gap-8 overflow-hidden
                   tablet:grid-cols-[repeat(2,minmax(50px,1fr))] tablet:gap-10
                   desktop:grid-cols-[repeat(3,minmax(50px,1fr))]"
      >
        {BENEFITS.map(({ title, body, Icon }) => (
          /* Item — column, `padding: 0 0 16px`, and the gap between the icon and the text
             container is 32 on phone but 64 from 810 up. That 32px step is most of why the
             phone row measures 150.39 against the tablet 182.39. */
          <div key={title} className="flex flex-col gap-8 pb-4 tablet:gap-16">
            <Icon />

            {/* `Container` — column, gap 4 at every tier. The only value in this block that
                never moves. */}
            <div className="flex flex-col gap-1">
              {/* Title: 16px, stepping to 18 only at 1200. Weight is the one value the
                  measured table does not carry — see the header. */}
              <p
                className="font-sans text-[16px] font-normal text-paper desktop:text-[18px]"
                style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
              >
                {title}
              </p>
              {/* Body: 16px at every tier, and -0.01em where the title is -0.02em. The two
                  tracking values differ on purpose; it is not a transcription slip. */}
              <p
                className="font-sans text-[16px] font-normal text-paper-soft"
                style={{ lineHeight: "130%", letterSpacing: "-0.01em" }}
              >
                {body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
