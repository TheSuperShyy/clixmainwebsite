/**
 * Built for enterprise, secure by design — clone of rogo.ai `#security`
 * (`.framer-1nzz2sb`). The one dark section below the hero.
 *
 * Spec, provenance and open questions: features/security/FEATURE.md.
 * Do not "tidy" a number here without changing that file first.
 *
 * The badge grid is a CSS grid whose column count drops 5 → 2 → 1, and the cell borders
 * are hand-authored per cell per tier rather than derived. That is why BORDERS below is a
 * matrix and not a formula: at 5 columns every cell draws left + top + bottom and only the
 * last draws right, which lays down one continuous outline with four internal verticals.
 * At 2 and 1 columns the original's overrides do NOT re-close the shape — see the open
 * question in FEATURE.md. Reproduced as measured, not corrected.
 *
 * No animation. Zero `data-framer-appear-id`, transition or `:hover` in the subtree.
 */

type Badge = {
  id: string;
  file: string;
  label: string;
  /* Label box width — 137px for four of them, 188px for "EU AI Act", which is the only
     string long enough to need it. Absolutely placed 16px off the cell's bottom edge. */
  labelWidth: string;
  /* SOC2/CCPA/ISO ship as `<use>` references at weight 400; GDPR and EU AI Act are
     data-URI backgrounds AND declare `--framer-font-weight:500` on the label. Two
     delivery mechanisms and two label weights, split the same way — almost certainly two
     authoring sessions. Copied rather than unified. */
  labelWeight: string;
  /* The artwork box inside the 104px Graphic frame. Three different treatments:
     SOC2 is square and inset-0; CCPA/ISO are `aspect-ratio:1.00833` pinned top/left/right
     (so 104 x 103.14); GDPR and EU AI Act are a flat 102x102 at their own offsets. */
  art: string;
  /* Per-cell, per-tier border matrix. Mobile-first: phone, then >=810, then >=1200. */
  border: string;
};

const BADGES: Badge[] = [
  {
    id: "soc2",
    file: "soc2.svg",
    label: "SOC2",
    labelWidth: "w-[137px]",
    labelWeight: "font-normal",
    art: "absolute top-0 right-0 left-0 aspect-square h-auto",
    border: "border tablet:border-r-0",
  },
  {
    id: "ccpa",
    file: "ccpa.svg",
    label: "CCPA",
    labelWidth: "w-[137px]",
    labelWeight: "font-normal",
    art: "absolute top-0 right-0 left-0 aspect-[1.00833] h-auto",
    border: "border border-t-0 tablet:border-t desktop:border-r-0",
  },
  {
    id: "iso",
    file: "iso-27001.svg",
    label: "ISO 27001",
    labelWidth: "w-[137px]",
    labelWeight: "font-normal",
    art: "absolute top-0 right-0 left-0 aspect-[1.00833] h-auto",
    border:
      "border border-t-0 border-b-0 tablet:border-b tablet:border-r-0 desktop:border-t",
  },
  {
    id: "gdpr",
    file: "gdpr.svg",
    label: "GDPR",
    labelWidth: "w-[137px]",
    labelWeight: "font-medium",
    art: "absolute top-[1px] left-[1px] h-[102px] w-[102px]",
    border: "border border-r-0 tablet:border-t-0 desktop:border-t",
  },
  {
    id: "eu-ai-act",
    file: "eu-ai-act.svg",
    label: "EU AI Act",
    labelWidth: "w-[188px]",
    labelWeight: "font-medium",
    art: "absolute top-0 left-[1px] h-[102px] w-[102px]",
    border: "border tablet:border-t-0 desktop:border-t",
  },
];

function BadgeCell({ item }: { item: Badge }) {
  return (
    <div
      className={`relative flex w-full items-center justify-center self-start
                  justify-self-start overflow-hidden border-hairline-light
                  aspect-[1.40909] h-auto min-h-[220px]
                  tablet:aspect-auto tablet:h-60 tablet:min-h-0
                  ${item.border}`}
    >
      {/* Graphic frame — 104px square, clipping the artwork box inside it. */}
      <div className="relative h-[104px] w-[104px] flex-none overflow-hidden">
        {/* Decorative: the visible label below names the certification, and the capture
            marks the mark itself aria-hidden. An alt here would double every name. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/badges/${item.file}`}
          alt=""
          aria-hidden="true"
          className={item.art}
        />
      </div>

      <p
        className={`absolute bottom-4 left-1/2 z-[1] -translate-x-1/2 text-center
                    text-[12px] leading-[1.3em] tracking-[-0.02em] text-muted
                    ${item.labelWidth} ${item.labelWeight}`}
      >
        {item.label}
      </p>
    </div>
  );
}

export default function Security() {
  return (
    <section
      data-nav-theme="dark"
      id="security"
      /* padding 96/16 phone → 164/40 from 810 up. `ink` background — the only dark
         section below the hero. */
      className="relative flex w-full flex-col items-center justify-center overflow-clip
                 bg-ink px-4 py-24 tablet:px-10 tablet:py-[164px]"
    >
      {/* Width Container — max-w 1280. Its gap (80/128/164) is inert here, one child;
          same shared class as `by-the-numbers`. */}
      <div
        className="relative flex w-full max-w-[var(--container-max)] flex-col items-start
                   gap-20 overflow-clip tablet:gap-32 desktop:gap-[164px]"
      >
        {/* Container — title over grid, gap 64. */}
        <div className="relative flex w-full flex-col items-center gap-16 overflow-visible">
          {/* Title block. The 400px measure is what breaks the headline across two lines
              at every tier — there is no <br> in the original. */}
          <div className="relative flex w-full flex-col items-center gap-4 overflow-visible">
            {/* h3 in the original — demoted to h2 so the outline runs h1 (hero) → h2.
                Purely semantic. */}
            <h2
              className="w-full max-w-[400px] text-center font-display text-[36px]
                         leading-[105%] tracking-[-0.05em] text-paper
                         tablet:text-[44px] desktop:text-[48px]"
            >
              Built for enterprise, secure by design
            </h2>
          </div>

          {/* Logos row — a flex wrapper whose 24px gap is inert (one child), around the
              grid itself. Kept so the nesting matches the capture. */}
          <div className="relative flex w-full items-center justify-center gap-6 overflow-visible">
            <div
              className="relative w-px flex-[1_0_0] justify-center gap-0 overflow-visible
                         grid grid-rows-[repeat(2,min-content)] auto-rows-min
                         grid-cols-[repeat(1,minmax(50px,1fr))]
                         tablet:grid-cols-[repeat(2,minmax(50px,1fr))]
                         desktop:grid-cols-[repeat(5,minmax(50px,1fr))]"
            >
              {BADGES.map((item) => (
                <BadgeCell key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
