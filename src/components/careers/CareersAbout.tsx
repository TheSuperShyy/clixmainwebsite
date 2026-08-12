/**
 * CareersAbout — clone of rogo.com/careers block `About` (`id="about™"` in the original).
 *
 * Capture: docs/reference/target/rogo-careers-2026-08-12.{html,css}, re-read from the LIVE
 * page over CDP at 1600 / 1440 / 1024 / 390 on 2026-08-12. Both agree; the values below are
 * the live computed ones.
 * Spec: features/careers-page/FEATURE.md ("Measured spec" → sections + typography tables).
 *
 * SERVER COMPONENT, no props. Nothing in this block is interactive — no state, no gesture, no
 * scroll trigger, no `data-framer-appear-id` anywhere in the subtree. Do not add "use client".
 *
 * ⚠️ COPY IS CLIX'S OWN as of 2026-08-12 (user: "lets personalize it now, with the headers
 * and subheaders"). It was rogo's verbatim until then. Both paragraphs are drawn from company
 * material already in this repo — `docs/reference/clixsolutions/` and the five paragraphs of
 * ClixManifesto.tsx — rather than invented for this page: the services named in the first
 * (AI agents, WhatsApp assistants, CRM, integrations) are the ones clix actually sells, and
 * "the afternoon you just gave back" is the manifesto's own image, reused on purpose so the
 * careers page and the product page sound like one company.
 *
 * NO DASHES — no em dash, no en dash, no hyphen standing in for one (user's standing request,
 * 2026-08-10). Apostrophes are now the CURLY ’ used everywhere else in this repo; the straight
 * ones that used to be here were the target's, and there is no longer a reason to carry them.
 * The strings stay in consts rather than JSX text so `react/no-unescaped-entities` can never
 * apply — that rule only inspects JSX text nodes.
 *
 * LENGTHS WERE HELD CLOSE TO THE ORIGINAL'S ON PURPOSE (244/189 characters against rogo's
 * 244/201). This column is measured and paragraph copy is what fills it, so a rewrite half
 * again as long would change the block's height at every tier and silently invalidate the
 * tier table below. The copy is free to change; the geometry it was measured against is not.
 *
 * ⚠️ REWRITING THESE DID NOT LIFT THE NOINDEX. The other reason stands: the three job rows
 * are invented. See the route header in src/app/careers/page.tsx.
 *
 * ─── TRAP 1 · WHERE THE COLOUR BOUNDARY ACTUALLY FALLS ───────────────────────────────────
 * The heading reads "Building The Smartest / Analyst On Wall Street" over two lines, and it
 * looks like the split is "…Smartest Analyst" (ink) / "On Wall Street" (muted). IT IS NOT.
 * Measured: line 1 `Building The Smartest` is rgb(21,21,21) `ink`, line 2
 * `Analyst On Wall Street` is rgb(115,115,115) `muted`. The <br> IS the colour boundary.
 *
 * TRAP 1b — it is ONE <h3>, not two blocks. Same rule as ProductFeatures.tsx's intro heading:
 * splitting the halves into sibling elements lets them wrap independently, which breaks the
 * sentence across the colour boundary at any width where the text reflows. The <br> is
 * explicit in the original and it is load-bearing at every tier.
 *
 * ─── TRAP 2 · THE `width:1px; flex:1 0 0` COLUMN IDIOM ───────────────────────────────────
 * Both desktop columns declare `flex: 1 0 0` AND `width: 1px`. That is Framer's way of making
 * two columns split a row purely by flex-grow: with `flex-basis: 0` and a 1px width, neither
 * column's *content* can contribute to the distribution, so a long paragraph cannot push the
 * title column narrower. Reproduced verbatim — `desktop:w-px desktop:flex-[1_0_0]`.
 * Note `flex-1` is NOT a substitute: Tailwind's `flex-1` is `flex: 1 1 0%` (shrink 1), the
 * original is `1 0 0` (shrink 0). Same idiom already in ProductHero / ProductSecurity /
 * ByTheNumbers; keep it consistent.
 *
 * ─── TIER MAP — three sizes, not four ────────────────────────────────────────────────────
 * There is no XL-specific value anywhere on this page, so `desktop:` (≥1200) covers 1440 and
 * 1600 alike. Base = phone (≤809.98), then `tablet:` (≥810), then `desktop:` (≥1200).
 * Tablet and phone share EVERY value here except section padding-x and the h3 size.
 *
 * |                 | ≥1200 (XL + desktop)           | 810–1199.98         | ≤809.98            |
 * |-----------------|--------------------------------|---------------------|--------------------|
 * | section padding | `96px 40px`                    | `64px 40px`         | `64px 16px`        |
 * | section height  | 329 (target 352)               | 343                 | 430 (target 471)   |
 * | container       | row, gap 64, max-w 1280        | column, gap 24      | column, gap 24     |
 * | title column    | `flex:1 0 0; w:1px; max-w 490` | `flex:none; w:100%` | + `max-w:unset`    |
 * | h3              | 44                             | 40                  | 32                 |
 * | body <p>        | 18                             | 16                  | 16                 |
 *
 * ⚠️ THE SECTION HEIGHT ROW IS THE ONE PLACE THIS BLOCK NO LONGER EQUALS THE TARGET, and it
 * is a consequence of the copy rewrite, not a layout defect. Every value that CSS controls —
 * padding, gap, column widths, type — is unchanged and both block-diffs still report ALL
 * MATCH. Height is not one of those: it is `max(titleCol, textCol)` plus padding, and textCol
 * is however many lines the paragraphs wrap to. Measured 2026-08-12 at 1440: our p1 sets in 3
 * lines where rogo's set in 4 (18px x 130% = 23.4px), which is the whole of the 23px
 * difference. 1024 lands on 343 either way. Do not "fix" this by padding the copy out to hit
 * 352 — tuning sentences to match a number the target got from different sentences is how a
 * clone starts lying about what it measured.
 *
 * Section: gap 96, `flex-direction:column`, `align-items:center`, `place-content:center`,
 * width 100%, `overflow:hidden`, ground `paper`. `data-nav-theme="light"` — and this section
 * must stay vertically contiguous with #gallery above and #roles below, or Nav.tsx's theme
 * scanner falls through the gap and defaults to "light" over the ink roles band.
 *
 * DIVERGENCES / JUDGEMENT CALLS
 * - `id="about"`, not the original's `id="about™"`. A trademark glyph in a DOM id is a Framer
 *   authoring artefact; it is also a hostile fragment target. Recorded in FEATURE.md.
 * - Display face is Discovery (`--font-display`), not ABC Arizona Mix — sitewide licensing
 *   decision, 2026-08-08.
 * - The desktop container's computed shorthand is `place-content: flex-start center`
 *   (align-content flex-start, justify-content CENTER), while the prose spec reads
 *   justify-content flex-start. Shipped as `items-start justify-start`: the row never wraps
 *   and both children are `flex-grow:1` with a zero basis, so they consume the full 1280 and
 *   neither align-content nor justify-content can produce an observable difference. Noted so
 *   the next reader does not re-derive it.
 * - Body colour: the Framer text preset says `#383838` (`ink-soft`) and the element overrides
 *   it inline to rgb(21,21,21). Ours states `text-ink` directly rather than reproducing the
 *   override dance — same call as ProductFeatures.tsx's heading.
 * - Paragraph spacing is `margin-top: 20px` on the second <p>, NOT a flex gap: the container's
 *   gap is measured at 0 and Framer emits paragraph spacing as a margin on `:not(:first-child)`.
 *   Encoded as `[&>p+p]:mt-5` on the container so the rule stays where the original put it
 *   (on the flow, not on a hand-tagged element) and a third paragraph would inherit it.
 */

/* Line 1 is `ink`, line 2 is `muted`, and the <br /> between them is the boundary.
   NOT "…Smartest Analyst" / "On Wall Street" — see TRAP 1 above. */
const TITLE_INK = "Automating The Work";
const TITLE_MUTED = "Nobody Should Be Doing";

/* Clix's own. Curly apostrophes, no dashes. See the copy note in the file header. */
const BODY = [
  "Clix builds the quiet mechanisms that run modern businesses: AI agents that answer and qualify in your customers’ own language, WhatsApp assistants that sell where people already are, CRM work, and the integrations that hold all of it together.",
  "We are a small team in Tel Aviv, and small is the point. There is no queue to get your work in front of a client, and no layer between you and the person whose afternoon you just gave back.",
];

/* 18px ≥1200, 16px below. Weight 400 / `ink` / 130% / -0.02em at every tier. */
const BODY_CLASS = "font-sans text-[16px] font-normal text-ink desktop:text-[18px]";

export default function CareersAbout() {
  return (
    <section
      id="about"
      data-nav-theme="light"
      /* Measured: column, items centred, place-content centred, gap 96, w 100%,
         overflow hidden, bg `paper`; padding 64/16 → 64/40 → 96/40. */
      className="relative flex w-full flex-col place-content-center items-center gap-24
                 overflow-hidden bg-paper px-4 py-16
                 tablet:px-10
                 desktop:py-24"
    >
      {/* `Container` — max-w 1280 (= --container-max). Column + gap 24 at BOTH tablet and
          phone; row + gap 64 only from 1200 up. */}
      <div className="relative flex w-full max-w-[var(--container-max)] flex-col gap-6 desktop:flex-row desktop:items-start desktop:justify-start desktop:gap-16">
        {/* `Title` — full width below 1200 (no max-width at either sub-tier);
            `flex:1 0 0; width:1px; max-width:490px` from 1200 up. See TRAP 2. */}
        <div className="relative flex w-full flex-none flex-col desktop:w-px desktop:max-w-[490px] desktop:flex-[1_0_0]">
          <h3
            className="w-full text-left text-balance font-display text-[32px] font-normal
                       text-ink tablet:text-[40px] desktop:text-[44px]"
            style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
          >
            {TITLE_INK}
            <br />
            <span className="text-muted">{TITLE_MUTED}</span>
          </h3>
        </div>

        {/* `Text Container` — its own gap is 0; the 20px between paragraphs is the
            `[&>p+p]:mt-5` margin rule, exactly as the original applies it. */}
        <div className="relative flex w-full flex-none flex-col items-start gap-0 [&>p+p]:mt-5 desktop:w-px desktop:flex-[1_0_0]">
          {BODY.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className={BODY_CLASS}
              style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
