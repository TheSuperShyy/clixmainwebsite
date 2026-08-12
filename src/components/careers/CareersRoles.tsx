/**
 * CareersRoles — clone of rogo.com/careers block `Careers` (`#roles`), the dark band at the
 * foot of the page.
 *
 * Capture: docs/reference/target/rogo-careers-2026-08-12.{html,css} (Framer classes
 * `.framer-f0zhtu` section · `.framer-1362bnx` container · `.framer-ktsgd9` head ·
 * `.framer-63ulsd` eyebrow · `.framer-15zu9cq` groups · `.framer-xnhf00` group ·
 * `.framer-1bs4u3v` divider · `.framer-1ee0k8c` row wrapper · `.framer-1atb60z` h4 column ·
 * `.framer-139w9u0` posts column · `.framer-1d1p4wo` row anchor), re-read from the LIVE page
 * over CDP at 1600 / 1440 / 1024 / 390 on 2026-08-12. Both agree; the values below are the
 * live computed ones.
 * Spec: features/careers-page/FEATURE.md ("Roles band — row anatomy" + the typography table).
 * Content + the three invented roles: ./careersOpenings.ts, which carries its own warnings —
 * including why it is NOT named `careersRoles.ts`: that differs from this file's name only in
 * case, so on Windows and macOS the import `@/components/careers/CareersRoles` resolves to the
 * data module instead of this component. Two `tsc` errors, no build. See that file's header.
 * Harness: `node docs/reference/block-diff.js docs/reference/careers-roles-diff.js`.
 *
 * SERVER COMPONENT, no props. There is nothing interactive here beyond three links: no state,
 * no gesture, no scroll trigger, no `data-framer-appear-id` in the subtree. The original's one
 * stateful child — the 11-pill category filter — is deliberately not shipped (see
 * careersOpenings.ts), which is what removes the last reason for `"use client"`. Do not add it.
 *
 * THE ONLY `data-nav-theme="dark"` SECTION ON THIS PAGE. Nav.tsx picks the `[data-nav-theme]`
 * element spanning the nav's bottom edge and falls back to "light" on a gap, so this section
 * must stay vertically contiguous with `#about` above and `<Footer>` (dark, declares its own)
 * below. Any margin introduced between them paints a white nav bar over the ink band.
 *
 * ─── TRAP 1 · THE ROW RULE IS AN `::after` OVERLAY, NOT A BORDER ──────────────────────────
 * The target's row `<a>` carries
 *   --border-bottom-width:1px; --border-style:dashed; --border-color:rgba(168,162,158,0.2)
 * plus `data-border="true"`, which reads like a border declaration and is not: computed
 * `border-bottom` ON the element is `0px none`. Framer paints it with a global rule,
 *   [data-border=true]:after { content:""; position:absolute; top:0; left:0;
 *     width:100%; height:100%; border-width: … ; border-style: … ; pointer-events:none }
 * An overlay takes no layout space. A real `border-bottom` would make the row 73px, not the
 * measured 72. Same mechanism as /product Blocks 3 and 5.
 *
 * We reproduce it as a genuine `::after` (the Tailwind `after:` variant chain) rather than as
 * an absolutely-positioned `<span aria-hidden>` — ProductDataPartners.tsx took the span route,
 * and this file deliberately differs. Two reasons, both about verifiability:
 *   · the diff harness can then read `getComputedStyle(row, '::after')` on BOTH sides with one
 *     shared expression, instead of measuring a pseudo-element on the target and a real
 *     element on ours and hoping the two are equivalent;
 *   · it keeps our row's child list identical to the target's, so every structural finder in
 *     careers-roles-diff.js addresses child 0/1/2 the same way on both sides. The span route
 *     is what forced that config's `artIdx` asymmetry.
 * `after:border-b` sets only the BOTTOM width; `after:border-dashed` sets the style on all
 * four sides, which is inert on the three with width 0. Tailwind's preflight zeroes borders on
 * `::after`, so nothing leaks in.
 *
 * EVERY ROW GETS THE RULE, INCLUDING THE LAST. Verified against the capture rather than
 * assumed: 72 `data-framer-name="Post"` nodes and exactly 72 `--border-style:dashed`
 * declarations, across 11 groups. If the target dropped it on `:last-child` the second count
 * would be 61. There is no `:last-child` rule anywhere in the 149 KB of captured CSS.
 *
 * ─── TRAP 2 · THE DIVIDER IS SIZED BY ASPECT RATIO, NOT BY HEIGHT ────────────────────────
 * `.framer-1bs4u3v { aspect-ratio: 1120; width: 100%; height: auto }`. Not a typo: a full-bleed
 * hairline whose height is width/1120, so it renders **1.143px** at 1280 wide and 0.843px at
 * 944. `h-px` is NOT a substitute — it differs at every width, and by more than a rounding
 * error below 1120. Reproduced as `aspect-[1120] h-auto w-full`.
 *
 * Where the 1120 comes from, since the number looks arbitrary: it is the DESIGN width of the
 * Framer component that owns the list (`.framer-1ld2hhj { width: 1120px }`, overridden inline
 * to `width:100%`). Somebody drew a 1120×1 hairline and Framer encoded it as a ratio. So the
 * divider is 1px at exactly one width and slightly more everywhere the container is wider.
 *
 * ─── THE PILL ROW'S ABSENCE MOVES ONE GAP, AND ONLY ONE ──────────────────────────────────
 * That same component is what held the 11 category pills. On the target the chain is
 * Container > (ssr-variant) > -container > Tabs root > groups, and the Tabs root has its own
 * `gap: 32px` between the pills and the groups. Dropping the pills flattens all of that: our
 * groups wrapper is a direct child of the Container. Net effect on geometry — the distance
 * from the h2 to the first divider is 40 here and 40 + pillRowHeight + 32 there. Every other
 * measurement in the band is unaffected, which is why careers-roles-diff.js compares the
 * Container's gap but not that distance.
 *
 * ─── TRAP 3 · THE `width:1px; flex:1 0 0` COLUMN IDIOM ───────────────────────────────────
 * Both columns of the row wrapper declare `flex: 1 0 0` AND `width: 1px`, so neither column's
 * content can contribute to the distribution. With `gap:40`, `h4` clamped to `max-width:400px`
 * and the posts column free, 1280 splits 400 / 40 / 840 — which is exactly the measured pair
 * at 1440. `flex-1` is NOT a substitute: Tailwind's `flex-1` is `flex: 1 1 0%` (shrink 1), the
 * original is `1 0 0` (shrink 0). Same idiom as CareersAbout / ProductHero / ProductSecurity.
 * `flex-wrap` on the wrapper is load-bearing at 390, where 240 + 40 + 300 > 358 and the two
 * columns must stack.
 *
 * ─── TIER MAP — three sizes, not four ────────────────────────────────────────────────────
 * No XL-specific value exists anywhere on this page, so `desktop:` (≥1200) covers 1440 and
 * 1600 alike. Base = phone (≤809.98), then `tablet:` (≥810), then `desktop:` (≥1200).
 *
 * |                  | ≥1200              | 810–1199.98    | ≤809.98        |
 * |------------------|--------------------|----------------|----------------|
 * | section padding  | `80px 40px 160px`  | `80px 40px`    | `64px 16px`    |
 * | section gap      | 72                 | 72             | 72             |
 * | container gap    | 40                 | 40             | **32**         |
 * | h2               | 56                 | 48             | 40             |
 * | group h4         | 36 / **110%**      | 28 / **1.2em** | 24 / **1.2em** |
 * | role title       | 18                 | 16             | 16             |
 * | row height       | 72                 | 72             | 90 (2 lines)   |
 *
 * The h4's line-height genuinely changes UNIT across the 1200 breakpoint — 110% above,
 * `1.2em` below — which is why it is two Tailwind classes and not one inline style. Every
 * other type value in this file is expressed the same way (arbitrary `leading-[…]` /
 * `tracking-[…]`) so one file does not mix two mechanisms; CareersAbout.tsx uses the inline
 * `style` form because nothing in it needs a responsive line-height.
 *
 * DIVERGENCES / JUDGEMENT CALLS
 * - Display face is Discovery (`--font-display`), not ABC Arizona Mix — sitewide licensing
 *   decision, 2026-08-08. `fontFamily` is therefore excluded from every diff key.
 * - The eyebrow count is Rooftop Mono Regular 14px on the target and `font-sans` (Discovery)
 *   here — the one-face decision, same call as ProductTestimonials.tsx. No mono face is added.
 *   The count and the label stay TWO elements even though both are now the same face: the
 *   original sets them at two different line-heights (1em vs 130%) and two different trackings
 *   (0 vs −0.01em), and collapsing them into one string would also collapse the measured 8px
 *   gap into a word space.
 * - The arrow is an inline `<svg>` taking `currentColor`; the target ships it as a 24×24
 *   `background-image` data-URI with `image-rendering: pixelated` and the colour baked in as
 *   `rgb(175,175,175)`. Path data is byte-for-byte the original's. The two chevron paths are
 *   given `fill="none"` where the original wrote `fill="rgb(175,175,175)"` — that is not a
 *   change: both are single two-point line segments (`M 4.5 4.5 L 0 9`), which enclose zero
 *   area, so no fill can ever paint. Only the 1.5px stroke renders, on the target too.
 * - The target wraps each row in two inert divs (`Post`, gap 10 with a single child, then a
 *   `-container` at `width:100%`). Ours collapses both into the `<li>`. Neither contributes a
 *   pixel; keeping them would only give the diff harness two more levels to walk.
 * - `<ul>/<li>` where the target uses divs. A list of openings is a list; it costs nothing
 *   visually (preflight strips markers, `list-none` is belt-and-braces) and it is what
 *   ProductDataPartners already does for its tile grid.
 * - a11y improvement 1: a `focus-visible` ring on every row. The original has NONE — its rows
 *   are keyboard-reachable but give no visible focus. It is `ring-inset`, which is where this
 *   file departs from the repo's usual `ring-2` + `ring-offset-2`: the Container's measured
 *   `overflow: hidden` sits exactly on the posts column's right edge, so an OUTSET ring is
 *   clipped along that edge at every tier. An inset ring is drawn inside the row's own box and
 *   cannot be clipped by anything. Verified by rendering the row in its focused state.
 * - a11y improvement 2: the row index is `aria-hidden`. It is decorative ordinal numbering,
 *   and without this every link announces as "AI Automation Engineer Tel Aviv-Yafo 01".
 * - The target puts `id="dark"` on the h2's rich-text container — an authoring artefact, and a
 *   fragment target nobody wants. Not shipped, same class of call as `id="about™"`.
 *
 * ⚠️ KNOWN INHERITED AA FAILURE, SHIPPED AS MEASURED. The row index is `muted`
 * (rgb(115,115,115)) on `ink` = **3.85:1**, below the 4.5:1 required for 14px text. It is the
 * original's value and it is already logged in FEATURE.md's open questions awaiting the user's
 * call. Promoting it to `mark` would give 5.36:1 and is a one-token fix — but do it as a
 * decision, not as a silent tidy-up while passing through.
 * (3.85 / 5.36 are `contrast-check.js` output. Earlier drafts of this comment carried 3.91 /
 * 5.44, which were planning estimates that never went through the tool. Corrected 2026-08-12.)
 *
 * NOT SHIPPED, MEASURED ANYWAY: the 11-pill `Tabs` filter row. Its values live in FEATURE.md.
 */

import { COUNT_LABEL, ROLE_GROUP, ROLES } from "./careersOpenings";

/* Clix's own as of 2026-08-12; rogo's was "Find Your Role". Held SHORT deliberately: at the
   phone tier this h2 is 40px inside 358px less 32px of section padding, so much past 17
   characters wraps to a second line and adds ~44px to the band's measured height. Rendered
   and checked at 390 — one line. The no-dashes rule that governs every editorial string on
   this page is written up in CareersHero.tsx. */
const HEADING = "Where You Come In";

/**
 * The corner-turn arrow (↳) that opens every row. 24×24, `flex:none`, `text-glyph`
 * (rgb(175,175,175)) — deliberately two steps lighter than `mark`, see globals.css.
 *
 * Path data is the original's, lifted verbatim from the data-URI it ships as a background
 * image. `aria-hidden` with no `<title>`: the row's accessible name is the role title, and the
 * glyph adds nothing a screen reader needs. See the fill note in the file header.
 */
function RoleArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 flex-none text-glyph"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M 4.976 4.008 L 6.476 4.008 L 6.476 12.749 L 5.476 12.749 C 5.2 12.749 4.976 12.525 4.976 12.249 Z"
        fill="currentColor"
      />
      <path
        d="M 18.921 14.251 L 18.921 12.749 L 6.477 12.749 L 6.477 13.749 C 6.477 14.027 6.7 14.251 6.977 14.251 Z"
        fill="currentColor"
      />
      <g transform="translate(14.88 9.025)">
        <path
          d="M 4.5 4.5 L 0 9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="bevel"
        />
        <path
          d="M 0 0 L 4.5 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="bevel"
        />
      </g>
    </svg>
  );
}

export default function CareersRoles() {
  return (
    <section
      id="roles"
      data-nav-theme="dark"
      /* `.framer-f0zhtu` — column, items centred, `place-content:center flex-start`
         (= align-content centre, justify-content start), gap 72, w 100%, overflow hidden,
         ground `ink`. Padding 64/16 → 80/40 → 80/40/160. */
      /* SCROLL ANCHOR — a deliberate deviation, and the ONE place this page knowingly behaves
         better than the target. The hero CTA's whole job is href="#roles", and the nav is
         position:fixed. Probed on rogo.com/careers 2026-08-12: it has NO scroll-padding-top
         and NO scroll-margin anywhere, so its own jump lands #roles at top 0 with 113px of the
         band — the eyebrow and part of "Find Your Role" — buried under its nav. Reproducing
         that would mean shipping a CTA whose destination is hidden by the act of using it.
         Our fixed nav measures 115px at >=1200 and 119px below, hence the two values.
         scroll-margin affects only where the browser lands, never rendered layout, so this
         does not move any measured value and both block-diffs still pass. */
      className="relative flex w-full flex-col content-center items-center justify-start gap-18
                 scroll-mt-[119px] overflow-hidden bg-ink px-4 py-16
                 tablet:px-10 tablet:py-20
                 desktop:scroll-mt-[115px] desktop:pb-40"
    >
      {/* `.framer-1362bnx` Container — max-w 1280 (= --container-max), gap 40, and 32 on
          phones. It is a flex CHILD of the section, so `w-full` + `max-w` is what centres it,
          not `mx-auto`. */}
      <div className="relative flex w-full max-w-[var(--container-max)] flex-col place-content-center items-center gap-8 overflow-hidden tablet:gap-10">
        {/* `.framer-ktsgd9` head — column, items START (the rest of the band is centred), gap 16. */}
        <div className="relative flex w-full flex-col items-start justify-start gap-4 overflow-hidden">
          {/* `.framer-63ulsd` eyebrow — row, gap 10, `width: min-content`. */}
          <div className="relative flex w-min flex-row content-center items-center justify-start gap-2.5 overflow-hidden">
            {/* `.framer-s6m48t` Indicator — 8×8, radius 20 (i.e. a pill that is a circle at
                this size; the original really does write 20px on all four corners).
                Decorative: the count beside it carries the meaning. */}
            <span
              aria-hidden="true"
              className="block h-2 w-2 flex-none rounded-[20px] bg-signal-green"
            />
            {/* `.framer-1uimjbn` Count — row, gap 8, `width: min-content`. */}
            <div className="relative flex w-min flex-none flex-row content-center items-center justify-start gap-2 overflow-hidden">
              {/* Mono on the target, Discovery here. 14 / 1em / tracking 0 / `mark`,
                  `white-space: nowrap`. THE NUMBER IS DERIVED — never a literal. */}
              <span className="font-sans text-[14px] leading-[1em] font-normal tracking-[0] whitespace-nowrap text-mark">
                {ROLES.length}
              </span>
              {/* 14 / 130% / −0.01em / `mark`. Its container is `white-space: pre` on the
                  target, which is why this is `whitespace-pre` and not `nowrap`. */}
              <span className="font-sans text-[14px] leading-[130%] font-normal tracking-[-0.01em] whitespace-pre text-mark">
                {COUNT_LABEL}
              </span>
            </div>
          </div>

          {/* Preset `njqvjd` — 40 / 48 / 56, weight 400, 100%, −0.05em, `surface`. No
              `text-wrap: balance` on this one (the h4's preset has it, this one does not). */}
          <h2 className="w-full font-display text-[40px] leading-[100%] font-normal tracking-[-0.05em] text-surface tablet:text-[48px] desktop:text-[56px]">
            {HEADING}
          </h2>
        </div>

        {/* `.framer-15zu9cq` groups — column, gap 64. With one group that gap is currently
            inert. Kept because it is the measured value and a second group is one array away;
            deleting it would mean re-probing the target to get it back. */}
        <div className="relative flex w-full flex-col place-content-center items-center gap-16">
          {/* `.framer-xnhf00` group — column, gap 40. */}
          <div className="relative flex w-full flex-none flex-col place-content-center items-center gap-10">
            {/* `.framer-1bs4u3v` Divider — see TRAP 2. `aspect-[1120]` is the whole point;
                do not "simplify" it to `h-px`. */}
            <div
              aria-hidden="true"
              className="relative aspect-[1120] h-auto w-full flex-none overflow-hidden bg-hairline"
            />

            {/* `.framer-1ee0k8c` row wrapper — flex-WRAP, align start, gap 40. See TRAP 3. */}
            <div className="relative flex w-full flex-none flex-wrap content-start items-start justify-start gap-10">
              {/* `.framer-1atb60z` h4 column — `flex:1 0 0; width:1px; min-w 240; max-w 400`,
                  so it measures 400 at 1440 and 1600, 400 at 1024, and wraps to full width at
                  390. `pre-wrap` + `break-words` reproduce the original's text container. */}
              <div className="relative w-px max-w-[400px] min-w-[240px] flex-[1_0_0] break-words whitespace-pre-wrap">
                {/* Preset `ynqukt` — 24 / 28 / 36, weight 400, −0.04em, `mark`, and the
                    line-height unit switch at 1200 (1.2em below, 110% above). `text-balance`
                    is the preset's own `--framer-text-wrap: balance`. */}
                <h4 className="text-left text-balance font-display text-[24px] leading-[1.2em] font-normal tracking-[-0.04em] text-mark tablet:text-[28px] desktop:text-[36px] desktop:leading-[110%]">
                  {ROLE_GROUP}
                </h4>
              </div>

              {/* `.framer-139w9u0` posts column — `flex:1 0 0; width:1px; min-w 300`, column,
                  gap 24. Measures 840 at 1440. */}
              <ul className="relative flex w-px min-w-[300px] flex-[1_0_0] list-none flex-col place-content-center items-center gap-6">
                {ROLES.map((role, i) => (
                  <li key={role.title} className="w-full flex-none">
                    {/* `.framer-1d1p4wo` — row, gap 16, padding `24px 0`, w 100%,
                        overflow hidden, no underline. Height 72 (90 at 390, where the title
                        wraps to two lines — that is wrapping, not a different padding).
                        `relative` is what the `::after` overlay of TRAP 1 anchors to.
                        No `target="_blank"`: the href is a mailto and opens in place. */}
                    <a
                      href={role.href}
                      className="relative flex w-full cursor-pointer flex-row items-center justify-center gap-4
                                 overflow-hidden py-6 no-underline
                                 after:pointer-events-none after:absolute after:inset-0 after:border-b
                                 after:border-dashed after:border-hairline after:content-['']
                                 focus-visible:ring-2 focus-visible:ring-inset
                                 focus-visible:ring-surface focus-visible:outline-none"
                    >
                      {/* `.framer-1l50r8p` inner group — `flex:1 0 0; width:1px`, row, gap 16,
                          overflow VISIBLE (the row above it is the one that clips). */}
                      <span className="relative flex w-px flex-[1_0_0] flex-row items-center justify-center gap-4">
                        <RoleArrow />
                        {/* `.framer-tm6isv` + preset `1dmgysd` — `flex:1 0 0; width:1px`,
                            16 / 18, weight 400, 130%, −0.02em, `surface`. */}
                        <span className="w-px flex-[1_0_0] font-sans text-[16px] leading-[130%] font-normal tracking-[-0.02em] break-words whitespace-pre-wrap text-surface desktop:text-[18px]">
                          {role.title}
                        </span>
                      </span>

                      {/* `.framer-1rvtyvn` + preset `pqix6l` — `flex:none; width:auto;
                          white-space:pre`, right-aligned, 14 / 130% / −0.01em / `mark`. */}
                      <span className="relative w-auto flex-none text-right font-sans text-[14px] leading-[130%] font-normal tracking-[-0.01em] whitespace-pre text-mark">
                        {role.location}
                      </span>

                      {/* `.framer-yc55kh` — same type as the location but `muted`. Zero-padded
                          two digits over the flat list, matching the original's own numbering.
                          `aria-hidden`: decorative ordinal, see the header.
                          ⚠️ `muted` on `ink` = 3.85:1 and FAILS AA — inherited and flagged. */}
                      <span
                        aria-hidden="true"
                        className="relative w-auto flex-none font-sans text-[14px] leading-[130%] font-normal tracking-[-0.01em] whitespace-pre text-muted"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
