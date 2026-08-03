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
 * No animation library, and no count-up. `docs/SECTIONS.md` guessed at a scroll counter
 * from the visual; the capture disagrees — the numbers are static text with no
 * `data-framer-appear-id` and no transition in the subtree. Building a count-up would be
 * inventing motion, not cloning it. See FEATURE.md.
 */

type Stat = {
  id: string;
  value: string;
  /* The label carries a hard break at >=810 and none at <=809.98. Rendered as one string
     pair with a `hidden tablet:inline` <br> between them, rather than two hideable copies
     of the sentence — the trailing space on `lead` survives either way, so the phone tier
     reads "Daily queries sent by users" with no welding. `tail: null` = never breaks. */
  lead: string;
  tail: string | null;
  /* Phone-tier one-offs. The capture gives row 3 its own overrides for both the number
     cell (2px of top padding) and the label (width:100% instead of white-space:pre).
     Rows 1 and 2 share the other treatment. Reproduced per row rather than averaged. */
  numberCellPhone: string;
  labelPhone: string;
};

const STATS: Stat[] = [
  {
    id: "users",
    value: "40,000+",
    lead: "Bankers and investors using Rogo",
    tail: null,
    numberCellPhone: "",
    labelPhone: "max-w-none whitespace-pre",
  },
  {
    id: "queries",
    value: "50,000+",
    lead: "Daily queries sent ",
    tail: "by users",
    numberCellPhone: "",
    labelPhone: "max-w-none whitespace-pre",
  },
  {
    id: "institutions",
    value: "300+",
    lead: "Institutions ",
    tail: "served",
    numberCellPhone: "pt-[2px]",
    labelPhone: "w-full max-w-none",
  },
];

function StatRow({ item }: { item: Stat }) {
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
             is `normal` (1.5em for this face) and that silently adds 14px per row. */
          className="w-px max-w-[844px] flex-[1_0_0] font-display text-[48px]
                     leading-[1.2em] tracking-[-0.04em] text-ink
                     tablet:text-[96px] tablet:leading-[128px]
                     xl:text-[108px]"
        >
          {item.value}
        </h3>
      </div>

      {/* Label cell — stretched to the row's height and bottom-aligned. */}
      <div
        className="relative flex h-min w-full flex-col items-start justify-end
                   overflow-clip
                   tablet:h-auto tablet:w-[253px] tablet:max-w-[436px] tablet:flex-none
                   tablet:self-stretch tablet:pr-8 tablet:pb-9 tablet:pl-6
                   desktop:w-px desktop:flex-[1_0_0] desktop:pr-12 desktop:pl-8"
      >
        <p
          className={`text-[18px] leading-[1.4em] tracking-[-0.02em] text-ink opacity-70
                      tablet:w-auto tablet:max-w-[240px] tablet:whitespace-normal
                      tablet:text-[20px]
                      ${item.labelPhone}`}
        >
          {item.lead}
          {item.tail && (
            <>
              {/* The capture wraps row 3's <br> in a span coloured `rgb(23,23,23)`. It
                  contains no text, so it renders nothing — dropped rather than copied. */}
              <br className="hidden tablet:inline" />
              {item.tail}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function ByTheNumbers() {
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
              By the numbers
            </h2>
          </div>

          {/* Number List — gap 0; the rules come from each row's border-top. */}
          <div className="relative flex w-full flex-col items-center overflow-clip">
            {STATS.map((item) => (
              <StatRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
