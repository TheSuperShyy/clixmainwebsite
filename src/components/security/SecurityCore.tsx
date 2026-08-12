/**
 * SecurityCore — clone of rogo.com/security, the SECOND row of the `Compliance` band
 * (`Container .framer-1bz2s3e`). On the target this row reads "Security At Our Core".
 *
 * Capture: docs/reference/target/rogo-security-2026-08-12.{html,css} plus a live CDP probe of
 * the same page on 2026-08-12 at 1600 / 1440 / 1024 / 390. The numbers below are the live
 * computed ones; the capture agrees.
 * Spec: features/security-page/FEATURE.md → "Block 4 — `Compliance` row 2".
 *
 * ─── ⚠️ TRAP · THIS LOOKS LIKE A SIBLING SECTION AND IS NOT ──────────────────────────────
 * Rendered, this block reads as a fourth band sitting under the badge grid, and every instinct
 * says "promote it to its own <section>". Do not. `#features-1` has exactly TWO direct
 * children: `Container .framer-rswx4m` (heading + badge grid) and `Container .framer-1bz2s3e`
 * (this row). What looks like a band boundary is only `#features-1`'s own `gap: 120px`.
 * Confirmed by probing the live DOM's direct children — NOT by reading byte offsets in the
 * capture, which gave the wrong answer about nesting twice on /product. Byte offsets are
 * document order; they are never nesting.
 *
 * ─── SIBLING CONTRACT (pre-resolved, do not renegotiate) ────────────────────────────────
 * SecurityCompliance.tsx owns the band shell and mounts this file as its second child:
 *
 *     <section id="features-1" data-nav-theme="dark" ...>
 *       <div>row 1: title + badge grid</div>
 *       <SecurityCore />
 *     </section>
 *
 * So this file renders a SINGLE root <div> carrying only its own row classes. It declares no
 * `id`, no `data-nav-theme`, no background and no section padding — the parent owns all four.
 * It also adds no margin: the 120px separating it from row 1 is the parent's gap.
 *
 * SERVER COMPONENT, no props, no exports beyond the default. Nothing here is interactive and
 * the whole page's `data-framer-appear-id` count is 0, so there is no motion in this subtree.
 * Do not add "use client".
 *
 * ─── ⚠️ TRAP · THE BODY IS ONE <p> WITH TWO <br /> IN IT, NOT TWO <p>s ───────────────────
 * The target's markup is <span>…p1…</span><br/><br/><span>…p2…</span> inside a single <p>.
 * The blank line between the paragraphs is exactly one line-height BECAUSE IT IS A LINE. Two
 * <p>s with a margin is a different measurement and would not reproduce the 187.25px box. The
 * two <br /> are load-bearing. The spans are not — both carry the same colour, so `text-paper-soft`
 * on the <p> covers them and the spans are dropped.
 *
 * That is also why the two runs arrive from the dictionary as SEPARATE KEYS (`core.body1` and
 * `core.body2`) rather than as one string with an escape in it: a dictionary holds text, and the
 * two `<br />` are markup that belongs to this file.
 *
 * ⚠️ AND IT IS WHY LINE-COUNTING THIS ELEMENT NEEDS CARE. A `Range`/`getClientRects()` walk emits
 * NO rect for the empty line, so it under-counts by one and makes a correct box look wrong.
 * Count `offsetHeight / lineHeightPx` instead: line-height here is 130% of font-size, so the
 * blank line is in the height by construction. Verified 2026-08-12 in both locales.
 *
 * ─── ⚠️ THE `Explore security portal` LINK IS DELIBERATELY DROPPED ───────────────────────
 * The target's right column ends with a link to `trust.rogo.ai`, a Vanta trust centre clix does
 * not have. The user's explicit call on 2026-08-12 was to drop it. Measured before dropping, so
 * it is on record rather than merely missing: box 190.06 × 32 at ≥810 and 358 × 32 at 390,
 * label 14px / lh 130% / ls -0.01em / `paper`, preceded by the right column's 32px gap.
 *
 * Removing it takes exactly 64px (32 link + 32 gap) off this row at EVERY tier:
 *
 * | root row box | target (with link) | ours (without) |
 * |--------------|--------------------|----------------|
 * | ≥1200        | 1280 × 251.25      | 1280 × 187.25  |
 * | 1024         | 944 × 251.17       | 944 × 187.17   |
 * | 390          | 358 × 414.36       | 358 × 350.36   |
 *
 * The parent band is therefore 64px shorter than the target's at all three tiers. THIS IS A
 * RECORDED DEVIATION, NOT A DEFECT. Do not "restore" the link to close a height gap.
 *
 * ─── TIER MAP — three sizes, not four ────────────────────────────────────────────────────
 * XL and desktop are identical on every value on this page, so `desktop:` (≥1200) covers 1440
 * and 1600 alike and NO `xl:` rule exists here. Base = phone (≤809.98) → `tablet:` (≥810) →
 * `desktop:` (≥1200).
 *
 * |               | ≥1200 (XL + desktop)  | 810–1199.98 (1024)    | ≤809.98 (390)        |
 * |---------------|-----------------------|-----------------------|----------------------|
 * | root row      | row, gap 64, max-w 1280, items-start | row, gap 64  | column, gap 24      |
 * | left column   | `flex:1 0 0`, max-w 450 | `flex:1 0 0`, max-w 280 | `flex:0 0 auto`, w 100%, max-w none |
 * | left column   | flex row, gap 10 (one child, inert) | same    | same                 |
 * | h3            | 44px / 110% / -0.05em / `paper`, LEFT | 40px  | 32px                 |
 * | h3 box        | 450 × 48.41 (1 line)  | 280 × 88 (2 lines)    | 358 × 35.2 (1 line)  |
 * | right column  | `flex:1 0 0`, 766 wide, column, gap 32, items-start | 600 wide | w 100% |
 * | body <p>      | 18px / 130% / -0.02em / `paper-soft` | 16px   | 16px                 |
 * | body box      | 766 × 187.25 (8 lines) | 600 × 187.17 (9)     | 358 × 291.16 (14)    |
 *
 * Column arithmetic closes at both row tiers: 450 + 64 + 766 = 1280 ✓ and
 * 280 + 64 + 600 = 944 ✓. Row height is max(leftCol, rightCol), which is the body at every
 * tier: max(48.41, 187.25) = 187.25 ✓, max(88, 187.17) = 187.17 ✓, and at 390 the column
 * stacks: 35.2 + 24 + 291.16 = 350.36 ✓.
 *
 * ⚠️ RE-MEASURED 2026-08-12 DURING THE i18n PASS, AND THREE OF THE NUMBERS ABOVE NO LONGER
 * RENDER. Reported rather than rewritten, because the copy driving them is BYTE-IDENTICAL to what
 * this file shipped before the extraction (verified literal by literal against git HEAD), so
 * whatever moved is not the strings:
 *
 * | value            | table says          | renders today (English)          |
 * |------------------|---------------------|----------------------------------|
 * | h3 box @1024     | 280 × 88 (2 lines)  | 280 × 44 (ONE line)              |
 * | body box @1024   | 600 × 187.17 (9)    | 600 × 166.38 (EIGHT)             |
 * | body box @390    | 358 × 291.16 (14)   | 358 × 270.36 (THIRTEEN)          |
 *
 * ≥1200 is exact on every value (450 × 48.41 and 766 × 187.25), so this is not a font
 * substitution — a wrong face would move the desktop tier too. The h3 one is a hairline: "Built
 * To Be Trusted" measures 277.6px at 40px against a 280px column, a 2.4px margin, which is
 * precisely the kind of value that flips between font revisions. The two body values are one line
 * each, and they propagate: `SecurityCompliance`'s band-height note reads 1371.17 / 2035.08 where
 * the band now measures 1350.38 / 2014.28, both exactly 20.79px = one 16px/130% line short. The
 * h3 change costs nothing, because the row height is max(left, right) and the body wins it at
 * every tier. Re-confirmed against a PRODUCTION build (`next build` + `next start`), which
 * reproduces all three figures exactly, so this is not a dev-server artefact.
 *
 * ⚠️ `flex: 1 0 0` IS FRAMER'S TWO-COLUMN IDIOM AND `flex-1` IS NOT A SUBSTITUTE. Tailwind's
 * `flex-1` is `flex: 1 1 0%` (shrink 1); the original is `1 0 0` (shrink 0). Written
 * `flex-[1_0_0]`, matching ProductHero, ProductSecurity, ByTheNumbers and CareersAbout. Note
 * this particular row does NOT also carry `width: 1px` — that variant of the idiom appears
 * elsewhere on this page, not here, so it is not reproduced. `flex-basis: 0` already stops the
 * paragraph's content from contributing to the distribution in the main axis, which is why the
 * base-tier `w-full` needs no `tablet:` reset.
 *
 * ─── COPY LIVES IN THE DICTIONARY ────────────────────────────────────────────────────────
 * `src/lib/i18n/{en,he}/security.ts` → `core` (`title`, `body1`, `body2`), read with
 * `getDict()`. NOT `usePageDict()`: this is a server component and the client hook would force
 * `"use client"` onto a subtree with no motion and no state.
 *
 * ─── DIRECTION (contract §5, §6) ─────────────────────────────────────────────────────────
 * One migration in this file: the h3's `text-left` → `text-start`. It renders pixel-identically
 * in LTR, but it is the ONE non-identity in the logical-utility table — `getComputedStyle()
 * .textAlign` returns the keyword `"start"` where it used to return `"left"`.
 *
 * ⚠️ AND IT IS PRECISELY ONE KEY OF THIS PAGE'S OWN HARNESS: `docs/reference/security-diff.js`
 * builds `out.h3bType` from `type()`, whose last field is `c.textAlign`, so that row now reads
 * `... 400 start` against the target's `... 400 left`. That is the documented non-identity, NOT
 * a regression — every pixel is unchanged. No other key moves: `out.lblType` reads a label that
 * never carried a `text-align` class and still inherits `start`, and `out.lblInset` reads
 * computed `left`, which `start-4` still resolves to 16px in LTR.
 * Nothing else here is physical: `items-start` on both the row and the right column is already a
 * logical flex keyword and follows `direction` on its own.
 *
 * DIVERGENCES / JUDGEMENT CALLS
 * - The heading is NOT the target's "Security At Our Core" — that is rogo's string, and every
 *   string on this page is clix's own from the first commit (the /company model). Ours was
 *   picked to set in ONE line inside the 450px left column at 44px, matching the target's
 *   48.41px single-line h3 box, so the block's geometry does not drift.
 *   ⚠️ The h3 is the one box on this row with real slack, in either locale: the row height is
 *   max(leftColumn, rightColumn) and the body wins it at every tier (187.25 / 187.17 / and the
 *   phone tier stacks), so an h3 that sets two lines instead of one costs nothing. The BODY is
 *   what governs this row.
 * - Copy lengths were held against the target's (349 and 211 characters) so the rendered line
 *   count stays close and the 187.25px body box holds. The copy is free to change; the geometry
 *   it was measured against is not.
 * - Display face is Discovery (`--font-display`), not ABC Arizona Mix — sitewide licensing
 *   decision, 2026-08-08.
 * - NO DASHES anywhere — no em dash, no en dash, no hyphen standing in for one (user's standing
 *   request, 2026-08-10). This matters here: the target's paragraph is full of em dashes and
 *   ours has none. Apostrophes are the curly ’ used everywhere else in this repo.
 * - Strings live in module-level consts rather than JSX text nodes so
 *   `react/no-unescaped-entities` can never apply — that rule only inspects JSX text.
 */

import { getDict } from "@/lib/i18n/server";

export default function SecurityCore() {
  /* Server read of `core`. ⚠️ `body1`'s "we log every read and every write" is the SAME
     UNVERIFIED CLAIM as benefit 3 in SecurityBenefits.tsx — both assume per-run logs exist AND
     are visible to the client. Open question 1 in features/security-page/FEATURE.md, awaiting
     the user; if the answer comes back no, both places change together, in both locales. */
  const t = getDict().security.core;

  return (
    /* `Container .framer-1bz2s3e` — the band's SECOND child, not a section. Column + gap 24
       on phone; row + gap 64 from 810 up. max-w 1280 = --container-max.
       No background, no padding, no margin: the parent band owns all three.

       ⚠️ `items-start` IS UNTIERED, and that is measured, not tidiness. The target computes
       `align-items: flex-start` at 390 as well as above 810 — where it is inert, because a
       column of two full-width children has nothing to align. Scoping it to `tablet:` left our
       phone tier at `normal` and the block-diff caught it. */
    <div
      className="relative flex w-full max-w-[var(--container-max)] flex-col items-start gap-6
                 tablet:flex-row tablet:gap-16"
    >
      {/* Left column. `flex: 0 0 auto` + w 100% + no max-width on phone; `flex: 1 0 0` with a
          max-width from 810 up (280 at tablet, widening to 450 at desktop). It is itself a
          flex ROW with gap 10 in the original — one child, so the gap is inert, but it is
          reproduced rather than flattened so the box matches the capture. */}
      <div
        className="relative flex w-full flex-none flex-row gap-[10px]
                   tablet:max-w-[280px] tablet:flex-[1_0_0]
                   desktop:max-w-[450px]"
      >
        {/* Left-aligned here, unlike row 1's centred h3. 110% / -0.05em at every tier. */}
        <h3
          className="w-full text-start font-display text-[32px] font-normal text-paper
                     tablet:text-[40px] desktop:text-[44px]"
          style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
        >
          {t.title}
        </h3>
      </div>

      {/* Right column — column, gap 32, items flex-start. Its measured widths (766 at ≥1200,
          600 at 1024) fall out of `flex: 1 0 0` against the left column's max-width; they are
          not declared. With the portal link dropped the gap-8 now has nothing to separate, but
          it is kept because a second child returning would need it and it costs no layout.

          ⚠️ `flex-none` IS LOAD-BEARING AT THE PHONE TIER and is not a duplicate of the
          `tablet:flex-[1_0_0]` beside it. The target computes `flex: 0 0 auto` here at 390;
          without an explicit base this element inherits the CSS default `0 1 auto`, which is a
          different shrink factor. The left column already carried its `flex-none`, so only this
          one was wrong — invisible on screen at 390, where nothing competes for the row, and
          caught by the block-diff. */}
      <div className="relative flex w-full flex-none flex-col items-start gap-8 tablet:flex-[1_0_0]">
        {/* ONE <p>, TWO <br /> — see the trap in the file header. The blank line between the
            paragraphs is a real line, which is why this measures 187.25px and two <p>s with a
            margin would not. 18px only from 1200 up; 16px at tablet and phone. */}
        <p
          className="font-sans text-[16px] font-normal text-paper-soft desktop:text-[18px]"
          style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
        >
          {t.body1}
          <br />
          <br />
          {t.body2}
        </p>
      </div>
    </div>
  );
}
