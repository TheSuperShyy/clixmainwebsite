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

import { getDict } from "@/lib/i18n/server";
import type { HomeDict } from "@/lib/i18n/en/home";

type BadgeId = keyof HomeDict["security"]["badges"];

type Badge = {
  id: BadgeId;
  file: string;
  /* Label box width — 137px for four of them, 188px for "EU AI Act", which is the only
     string long enough to need it. Absolutely placed 16px off the cell's bottom edge.
     ⚠️ THAT COMMENT IS NOW HISTORY, NOT A DESCRIPTION, and the mismatch is the capture's
     geometry outliving its content: the 188px went with cell FIVE, and after the 2026-08-05
     replacement cell five holds the SHORTEST label ("You own the code", 86.8px) while the
     longest ("Encrypted in transit and at rest", which wraps to two lines) sits in a 137px box.
     The widths are POSITION-bound, not content-fitted, and they are unchanged on purpose. */
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
  /* Per-cell, per-tier border matrix. Mobile-first: phone, then >=810, then >=1200.
     ⚠️ RAGGED BY DESIGN. It is the target's hand-authoring, not a rule with holes in it: at 5
     columns it lays down one closed outline, and at 2 and 1 columns the overrides do NOT
     re-close the shape (see the header note and the open question in FEATURE.md). Reproduce it
     exactly. Do NOT regularise it, and do not derive it from a formula — the formula does not
     exist.
     ⚠️ `border-r-0` BECAME `border-e-0` (2026-08-12) and that is the whole RTL change here.
     The dropped edge is the one facing the NEXT cell, so it has to follow the grid's flow
     direction: at 5 columns RTL puts cell 1 rightmost, and the internal vertical between it and
     cell 2 is its inline-END. In LTR `border-e-0` still resolves to `border-right-width:0`, so
     the matrix's computed values are untouched. `border-t-0`/`border-b-0` are block-axis and
     stay physical, correctly. */
  border: string;
};

/* ⚠️ REPLACED 2026-08-05, AND THE REASON MATTERS. These five cells used to show SOC2, CCPA,
   ISO 27001, GDPR and EU AI Act. SOC 2 and ISO 27001 are AUDITED CERTIFICATIONS — showing
   the seal without holding the report is misrepresentation, not marketing, and clix holds
   none of the five. So the cells now state practices clix actually follows.

   Do not put certification seals back here unless clix has been audited and can produce the
   report on request. Enterprise buyers do ask.

   The grid, the cell geometry, the 104px graphic frame, the label position and the entire
   per-tier border matrix are UNCHANGED — only the artwork and the labels moved.

   `art` is now uniform across all five. It varied before only because the vendored seals
   had three different intrinsic aspect ratios (square, 1.00833, and a flat 102x102); the
   replacements are all drawn on one 102x102 viewBox, so per-badge offsets would describe a
   difference that no longer exists. */
const BADGES: Badge[] = [
  {
    id: "your-cloud",
    file: "practice-cloud.svg",
    labelWidth: "w-[137px]",
    labelWeight: "font-normal",
    art: "absolute top-[1px] left-[1px] h-[102px] w-[102px]",
    border: "border tablet:border-e-0",
  },
  {
    id: "your-data",
    file: "practice-shield.svg",
    labelWidth: "w-[137px]",
    labelWeight: "font-normal",
    art: "absolute top-[1px] left-[1px] h-[102px] w-[102px]",
    border: "border border-t-0 tablet:border-t desktop:border-e-0",
  },
  {
    id: "least-privilege",
    file: "practice-key.svg",
    labelWidth: "w-[137px]",
    labelWeight: "font-normal",
    art: "absolute top-[1px] left-[1px] h-[102px] w-[102px]",
    border:
      "border border-t-0 border-b-0 tablet:border-b tablet:border-e-0 desktop:border-t",
  },
  {
    id: "encrypted",
    file: "practice-lock.svg",
    labelWidth: "w-[137px]",
    labelWeight: "font-medium",
    art: "absolute top-[1px] left-[1px] h-[102px] w-[102px]",
    border: "border border-e-0 tablet:border-t-0 desktop:border-t",
  },
  {
    id: "ownership",
    file: "practice-code.svg",
    labelWidth: "w-[188px]",
    labelWeight: "font-medium",
    art: "absolute top-[1px] left-[1px] h-[102px] w-[102px]",
    border: "border tablet:border-t-0 desktop:border-t",
  },
];

function BadgeCell({ item, label }: { item: Badge; label: string }) {
  return (
    <div
      className={`relative flex w-full items-center justify-center self-start
                  justify-self-start overflow-hidden border-hairline-light
                  aspect-[1.40909] h-auto min-h-[220px]
                  tablet:aspect-auto tablet:h-60 tablet:min-h-0
                  ${item.border}`}
    >
      {/* Graphic frame — 104px square, clipping the artwork box inside it.
          ⚠️ `art`'s `left-[1px]` IS NOT A DIRECTION UTILITY — DO NOT MIGRATE IT to `start-[1px]`.
          A 102px mark inside a 104px frame with a 1px inset on each side is a symmetric CENTRING
          inset, so `left` and `start` compute to the same 1px in both directions: the migration
          would be a no-op that only made the intent less clear. The marks are also NOT mirrored
          for RTL — they are abstract practice icons, not navigational affordances. */}
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

      {/* ⚠️ `left-1/2` + `-translate-x-1/2` IS A CENTRING IDIOM AND MUST NOT BE MIGRATED to
          `start-1/2`. On /he `start-1/2` resolves to `right:50%` while the translate keeps
          moving the box LEFT, so a 137px label would land 137px off-centre. The pair is already
          direction-neutral; leaving it is the correct action, not an oversight. */}
      <p
        className={`absolute bottom-4 left-1/2 z-[1] -translate-x-1/2 text-center
                    text-[12px] leading-[1.3em] tracking-[-0.02em] text-muted
                    ${item.labelWidth} ${item.labelWeight}`}
      >
        {label}
      </p>
    </div>
  );
}

export default function Security() {
  const t = getDict().home.security;

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
              at every tier — there is no <br> in the original.
              ⚠️ ON /he IT BREAKS ACROSS THREE at the 1200+ tier (48px), measured, and that is
              recorded rather than tuned away (contract §10): the Hebrew keeps the English's
              triple "yours … yours … yours" shape, which is the line, and the band simply grows
              ~50px at that one tier. 2 lines at 36px and 44px, matching English. Nothing clips —
              this is a centred flex column with a 64px gap below it. */}
          <div className="relative flex w-full flex-col items-center gap-4 overflow-visible">
            {/* h3 in the original — demoted to h2 so the outline runs h1 (hero) → h2.
                Purely semantic. */}
            <h2
              className="w-full max-w-[400px] text-center font-display text-[36px]
                         leading-[105%] tracking-[-0.05em] text-paper
                         tablet:text-[44px] desktop:text-[48px]"
            >
              {t.heading}
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
                <BadgeCell key={item.id} item={item} label={t.badges[item.id]} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
