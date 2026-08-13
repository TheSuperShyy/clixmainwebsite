/**
 * By the numbers — clone of rogo.ai `By the Numbers` (`.framer-1mzivz3`).
 *
 * Spec, provenance and open questions: features/by-the-numbers/FEATURE.md.
 * Do not "tidy" a number here without changing that file first.
 *
 * The row geometry is designed, not incidental: at >=1200 the number cell is
 * `flex:1 0 0; max-width:844px` and the label cell `flex:1 0 0; max-width:436px`, and
 * 844 + 436 = 1280 = `--container-max` exactly. Both caps bind at once, which is why the
 * label column never drifts as the viewport grows past 1280.
 *
 * The label is bottom-aligned against a 160px-tall number cell — `align-self:stretch` plus
 * `justify-content:flex-end` on a column, then 36px of bottom padding. That is what sits
 * the caption on the number's baseline rather than its cap-height.
 *
 * ⚠️ THERE IS NOW A COUNT-UP, AND IT IS A DELIBERATE DIVERGENCE (2026-08-08, user: "add
 * counting animations in this one"). This file previously argued the opposite and declined
 * to build one, on the grounds that the capture has no such motion — the numbers are static
 * text with no `data-framer-appear-id` and no transition anywhere in the subtree. That
 * finding still stands; the section simply no longer clones the target here. `docs/SECTIONS.md`
 * had guessed at a scroll counter from the visual and was wrong about the target, but has
 * accidentally ended up describing what we ship. See src/components/ui/CountUp.tsx.
 */

import CountUp from "@/components/ui/CountUp";
import { getDict } from "@/lib/i18n/server";
import type { HomeDict } from "@/lib/i18n/en/home";
import type { Translated } from "@/lib/i18n/shape";

/* Ids and copy shape derived from the dictionary rather than declared twice: a stat renamed in
   one file and not the other is a build error, not a blank label.
   `Translated<>` is what widens the English file's STRING LITERAL types back to `string`.
   Without it `StatCopy` is a union of three literal object types and `t.stats[id]` — itself a
   union — will not narrow against it (TypeScript does not correlate two indexed unions). It is
   the same widening the Hebrew dictionary is declared with, reused here for one line. */
type StatId = keyof HomeDict["byTheNumbers"]["stats"];
type StatCopy = Translated<HomeDict["byTheNumbers"]["stats"][StatId]>;

type Stat = {
  id: StatId;
  /* Phone-tier one-offs. The capture gives row 3 its own overrides for both the number
     cell (2px of top padding) and the label (width:100% instead of white-space:pre).
     Rows 1 and 2 share the other treatment. Reproduced per row rather than averaged. */
  numberCellPhone: string;
  labelPhone: string;
};

/* ⚠️ THESE ARE CLAIMS, NOT DECORATION. Replaced 2026-08-05; every one is a figure clix
   already publishes on clixsolutions.info's own /work page, not a number invented to fill
   the slot. Provenance, so a future edit can check rather than guess:
     200+  ← "200+ אוטומציות שמאחדות מערך מקוטע"
     2×    ← "Copilot מבוסס AI שהכפיל את קיבולת צוות התמיכה"
     24/6  ← "סוכן מכירות AI שמטפל בהזמנות משלוחים 24/7"  ⚠️ see below

   ⚠️ THE THIRD ONE NO LONGER MATCHES ITS SOURCE, DELIBERATELY. The live site says **24/7**;
   the user corrected it to **24/6** on 2026-08-07. Their business, their number — but note
   the divergence is now here in code and NOT on clixsolutions.info, which still publishes
   24/7. If that page is ever re-scraped, this will look like drift. It isn't.

   The tail moved with it. "that never sleeps" beside a `/6` is self-contradictory in the
   one place on the page where a reader is counting, so it became "outside office hours" —
   which is what 24/6 actually buys a customer and stays true on the day off.

   The target's three were parallel `N+` counts; these are a count, a multiple and a
   duration. That is deliberate — they say what changed for clients rather than how big the
   company is, which is the stronger claim for a studio. Do not "fix" the inconsistency by
   inventing two more counts.

   ⚠️ THE VALUES AND LABELS MOVED TO THE DICTIONARY (2026-08-12) — `home.byTheNumbers.stats`,
   keyed by these same three ids. The provenance above did NOT move, because it is about the
   claims and not about the language. The three VALUES are in the dictionary but do not
   translate: `200+`, `2×` and `24/6` stay Latin digits in every locale, the same call the repo
   already makes for `chrome.footer.copyrightYear`.

   ⚠️ ONE BIDI CONSEQUENCE, IN `2×` ONLY. Under the Unicode bidi algorithm the "×" (U+00D7,
   Other Neutral) beside a European Number takes the paragraph's RTL level, so on /he it is
   PLACED LEFT of the digit: the reading order stays "2" then "×", which is right, but the
   glyphs sit on screen as "×2". No `dir` attribute is added to force it — contract §5 puts
   `<html dir>` in the two root layouts and nowhere else, and a `dir` here would be a second
   source of truth for direction. `200+` and `24/6` are unaffected: bidi W5 folds the "+" into
   the number run and W4 folds the "/" between two digits, so both render exactly as written. */
const STATS: Stat[] = [
  {
    id: "automations",
    numberCellPhone: "",
    labelPhone: "max-w-none whitespace-pre",
  },
  {
    id: "capacity",
    numberCellPhone: "",
    labelPhone: "max-w-none whitespace-pre",
  },
  {
    id: "coverage",
    numberCellPhone: "pt-[2px]",
    labelPhone: "w-full max-w-none",
  },
];

function StatRow({ item, copy }: { item: Stat; copy: StatCopy }) {
  return (
    /* Rule is a border-TOP on each of the three rows — so there is a line above the first
       number and none below the last. `hairline` is the capture's own token reference here
       (`--token-8ac923d6-…, #a8a29e33`), not a look-alike literal. */
    <div
      className="flex w-full flex-col items-start gap-1 overflow-clip border-t
                 border-hairline py-6
                 tablet:flex-row tablet:gap-0 tablet:py-0"
    >
      {/* Number cell — 16px of vertical padding around a 128px line box at >=810. */}
      <div
        className={`relative flex w-full items-center justify-center overflow-clip
                    tablet:w-px tablet:max-w-[844px] tablet:flex-[1_0_0] tablet:py-4
                    ${item.numberCellPhone}`}
      >
        {/* h4 in the original — demoted one level so the outline runs h1 (hero) → h2
            (section) → h3 (item) without a skip. Purely semantic. */}
        <h3
          /* 128px is an absolute line-height at >=810, not a ratio — so the 96px and the
             108px number sit in the same 128px box and the rules stay 161px apart at every
             tier above phone. The phone variant declares no line-height at all, which in
             Framer means its `1.2em` default; spelling it out because the browser default
             is `normal` (1.5em for this face) and that silently adds 14px per row.

             ⚠️ THIS IS THE ONE PLACE ON THE SITE WHERE LINE COUNT DOES NOT DETERMINE HEIGHT,
             AND IT IS SAFE — stated here so the next reader does not have to re-derive it.
             Everywhere else, `line-height` is a percentage of `font-size`, so Hebrew (which has
             identical vertical metrics to Latin in Discovery: same ascender, descender and line
             gap, and no capitals or descenders in the Latin sense) gets the same box height per
             line and MATCHING THE LINE COUNT MATCHES THE HEIGHT TO THE PIXEL. An ABSOLUTE
             `128px` breaks that reasoning in general: a second line would add 128px, not a
             proportional amount. It cannot bite here because the only thing that ever sits in
             this box is DIGITS — `200+`, `2×`, `24/6` — which are Latin in every locale and
             never wrap. If a word ever lands in this heading, this line-height is the first
             thing to re-measure. */
          className="w-px max-w-[844px] flex-[1_0_0] font-display text-[48px]
                     leading-[1.2em] tracking-[-0.04em] text-ink
                     tablet:text-[96px] tablet:leading-[128px]
                     xl:text-[108px]"
          /* Pins the accessible name to the FINAL value. Without it a screen reader landing
             on the heading mid-count would announce whatever frame it caught ("137+"), and
             `aria-label` on a heading overrides its descendant text for name computation.
             The visible number is free to animate underneath. */
          aria-label={copy.value}
        >
          <CountUp value={copy.value} />
        </h3>
      </div>

      {/* Label cell — stretched to the row's height and bottom-aligned. The horizontal insets
          are ASYMMETRIC (32/24 at tablet, 48/32 at desktop) and directional: the smaller one
          faces the number cell across the row. Migrated to logical (`pe-*`/`ps-*`) so the pair
          swaps with the row when the flex main axis reverses on /he; in LTR both still compute
          to `padding-right`/`padding-left` unchanged. `pb-9` is on the block axis and untouched. */}
      <div
        className="relative flex h-min w-full flex-col items-start justify-end
                   overflow-clip
                   tablet:h-auto tablet:w-[253px] tablet:max-w-[436px] tablet:flex-none
                   tablet:self-stretch tablet:pe-8 tablet:pb-9 tablet:ps-6
                   desktop:w-px desktop:flex-[1_0_0] desktop:pe-12 desktop:ps-8"
      >
        <p
          className={`text-[18px] leading-[1.4em] tracking-[-0.02em] text-ink opacity-70
                      tablet:w-auto tablet:max-w-[240px] tablet:whitespace-normal
                      tablet:text-[20px]
                      ${item.labelPhone}`}
        >
          {/* ONE STRING PAIR WITH A TIER-GATED BREAK BETWEEN THEM, not two hideable copies of
              the sentence: the label carries a hard break at >=810 and none at <=809.98, and
              `lead`'s trailing space survives `display:none` on the break, so the phone tier
              reads as one sentence with no welding. `tail: null` means the label never breaks.

              ⚠️ WHICH ROWS HAVE A `tail` IS THE LOCALE'S CHOICE, not the layout's. English
              breaks rows 2 and 3 and leaves row 1 whole; Hebrew is free to break a different
              set, which is why `tail` is typed `string | null` in the dictionary rather than
              being inferred as the literal `null` from row 1. Hebrew keeps the same three splits
              here, and one label sets a line SHORTER than English at the tablet tier — which
              costs nothing, because the row's height comes from the number cell's absolute
              128px line box, not from this label. */}
          {copy.lead}
          {copy.tail && (
            <>
              {/* The capture wraps row 3's <br> in a span coloured `rgb(23,23,23)`. It
                  contains no text, so it renders nothing — dropped rather than copied. */}
              <br className="hidden tablet:inline" />
              {copy.tail}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function ByTheNumbers() {
  const t = getDict().home.byTheNumbers;

  return (
    <section
      data-nav-theme="light"
      /* padding 96/16 phone → 96/40 from 810 up. Background is `card` #eeedec — the same
         fill as a testimonial card, one shade off `canvas` and two off `surface`. */
      className="relative flex w-full flex-col items-center justify-center overflow-clip
                 bg-card px-4 py-24 tablet:px-10"
    >
      {/* Width Container — max-w 1280. Its gap (80/128/164 by tier) never applies: the
          container has exactly one child here. Reproduced anyway; the same class is shared
          with the section below, where it does bite. */}
      <div
        className="relative flex w-full max-w-[var(--container-max)] flex-col items-start
                   gap-20 overflow-clip tablet:gap-32 desktop:gap-[164px]"
      >
        {/* Number Container — headline over the list, gap 44 phone / 48 from 810 up. */}
        <div className="relative flex w-full flex-col items-start gap-11 overflow-clip tablet:gap-12">
          {/* h3 in the original — see the note on StatRow's heading. Sizes do NOT change
              across tiers: 28px everywhere, the only element in the section that doesn't. */}
          <div className="relative z-[1] flex w-full flex-col items-start overflow-visible tablet:w-min">
            <h2
              className="w-full max-w-[400px] font-sans text-[28px] leading-[1.1em]
                         font-medium tracking-[-0.03em] text-ink opacity-70
                         tablet:w-[400px]"
            >
              {t.heading}
            </h2>
          </div>

          {/* Number List — gap 0; the rules come from each row's border-top. */}
          <div className="relative flex w-full flex-col items-center overflow-clip">
            {STATS.map((item) => (
              <StatRow key={item.id} item={item} copy={t.stats[item.id]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
