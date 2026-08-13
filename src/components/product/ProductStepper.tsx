"use client";

/**
 * ProductStepper — clone of rogo.com/product's `Restart Point` block, i.e. sub-block 2b,
 * "An Integrated, Secure Platform Built to Drive Your Firm Forward".
 *
 * Capture: docs/reference/target/rogo-product-2026-08-11.html.
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md
 *
 * ⚠️ TWO GENUINELY DIFFERENT LAYOUTS, NOT ONE RESPONSIVE TREE. Measured on the live page:
 *   - **>=1200**: `Restart Point` — a 768x541 image beside a 472x541 text column, with a
 *     FOUR-STEP stepper that auto-advances. One panel visible at a time.
 *   - **<1200**: no `Restart Point` in the DOM at all. The four features STACK, each as its
 *     own 36px header row + its own panel below, all visible at once, `gap: 48`.
 * The section is 4024px tall at 1440 and 8138px at 1024 for exactly that reason. Do not try
 * to unify them; `hidden` and `desktop:block` is what the original itself does.
 *
 * TIER MAP: XL and desktop share every value here. Base = phone, `tablet:`, `desktop:`.
 */

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import WorkflowsScroller from "@/components/product/WorkflowsScroller";
import { PanelSources, PanelCitations, PanelDocuments } from "@/components/product/stepperPanels";
import { usePageDict } from "@/lib/i18n/LocaleProvider";

/* COPY IS OURS AND LIVES IN THE DICTIONARY (`stepper.title`, `stepper.steps`); GEOMETRY IS THE
   CAPTURE’S. The capture’s title runs 63 characters and its four step labels 23 to 34. The
   stepper column is a hand-measured 472x541 with 60px rows, so a longer line wraps and breaks
   the measured height. Counts are in features/product-page/FEATURE.md. */
/* Deliberately NOT the hero's h1, which sits a few hundred px up the same page. The hero
   states the thesis, this elaborates it.
   ⚠️ FITTED BY MEASUREMENT, NOT BY CHARACTER COUNT, and the difference bit once already.
   An earlier English draft ("One Secure Platform Built to Run the Work Behind Your Business")
   was 62 chars against the capture's 63, comfortably inside the 10% rule, and it still wrapped
   to THREE lines at 390 where the capture takes two: +30px on the h3, which pushed all 645
   elements below it down the page. Character count does not decide wrapping, word boundaries
   do. Rendered line counts, measured in the real face at each tier:
        390px   2 lines / 62px    (capture: 2 / 62)
       1024px   1 line  / 31px    (capture: 1 / 31)
       1440px   2 lines / 62px    (capture: 2 / 62)
   Re-measure, do not re-count, if this string ever changes — in EITHER locale. The Hebrew
   restoration (he/product.ts `stepper.title`) was fitted the same way and lands on the same
   2 / 1 / 2. */

/* ⚠️ THESE ARE KEYS AND A COUNT, NOT DISPLAY TEXT — as of 2026-08-13 the badge shows an ICON,
   not a numeral (see `STEP_ICONS` below). The strings survive the change because they carry
   two loads that have nothing to do with rendering:
     · `.length` is the auto-advance modulo, and
     · they build the React `key` that REMOUNTS a row to restart its `step-fill` sweep.
   A stable, unique string per step is all either needs, and "01".."04" already were both.
   NOT in the dictionary, for the same reason the numerals never were: they are identical in
   every locale, and pairing them with a translated label across two files invites drift. */
const STEP_KEYS = ["01", "02", "03", "04"] as const;

/* The badge glyphs, POSITIONAL — each was drawn for the label already in its slot, so they stay
   in the component and zip with `stepper.steps` by index, which the tuple typing keeps at four.
   Same idiom as `PROMPT_GLYPHS` in benefitArt.tsx.

   ⚠️ DRAWN FOR 16px, WHICH IS WHY THEY ARE THIS PLAIN. They render at 16 inside the badge's
   36px circular cutout, so a 1.6 stroke on a 24 viewBox lands near 1.07 device px. Anything
   with interior detail — a "?" inside a page, a magnifier over text — silts up at that size.
   Each glyph is therefore two or three primitives and no more.

   Kept local rather than imported from benefitArt.tsx: those glyphs are positional to the six
   benefit cards, these are positional to the four steps, and a shared module would tempt the
   two sets to be reconciled into one list that serves neither. */
function Stroke({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/* 01 · "All your systems in one place" — a 2x2 grid: four panes, one frame. */
const IconGrid = () => (
  <Stroke>
    <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.4" />
    <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.4" />
    <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.4" />
    <rect x="13" y="13" width="7.5" height="7.5" rx="1.4" />
  </Stroke>
);

/* 02 · "Every answer shows its source" — a link. The citation IS the chain back to the
   document, and two arcs read at 16px where a page-with-a-footnote does not. */
const IconLink = () => (
  <Stroke>
    <path d="M9.6 13.4a4.2 4.2 0 0 0 6.1.4l2.6-2.6a4.2 4.2 0 0 0-5.9-5.9l-1.5 1.5" />
    <path d="M14.4 10.6a4.2 4.2 0 0 0-6.1-.4l-2.6 2.6a4.2 4.2 0 0 0 5.9 5.9l1.5-1.5" />
  </Stroke>
);

/* 03 · "Automate your workflows" — one node fanning into two. The same node-and-connector
   vocabulary ArtTenant and ArtCustomModels use a few hundred px down the page. */
const IconFlow = () => (
  <Stroke>
    <circle cx="5.5" cy="12" r="2.6" />
    <circle cx="18.5" cy="6" r="2.6" />
    <circle cx="18.5" cy="18" r="2.6" />
    <path d="M8.1 12h3.4a1.6 1.6 0 0 0 1.4-.8L15.9 7M8.1 12h3.4a1.6 1.6 0 0 1 1.4.8l2.9 4.2" />
  </Stroke>
);

/* 04 · "Ask questions of your documents" — a speech bubble. The "of your documents" half is
   carried by the label sitting 16px to its side; putting it in the glyph too costs legibility
   and says nothing new. */
const IconAsk = () => (
  <Stroke>
    <path d="M20.5 12.4a7.3 7.3 0 0 1-7.8 7.3 8.2 8.2 0 0 1-2.4-.4L4.5 21l1.7-5.4a7.1 7.1 0 0 1-1-3.6 7.3 7.3 0 0 1 7.5-7.3 7.3 7.3 0 0 1 7.8 7.3Z" />
    <path d="M12.4 14v-.6a2 2 0 0 1 1.2-1.8 2 2 0 1 0-2.8-1.9" />
  </Stroke>
);

const STEP_ICONS = [IconGrid, IconLink, IconFlow, IconAsk] as const;

/* NOT in the capture — Framer runs the advance in JS and the stylesheet carries no timing at
   all beyond the site's one `color .3s`. ESTIMATED, and flagged as such in FEATURE.md. The
   `Fill` bar sweeps 0 -> 100% across exactly this interval, which is what makes it legible as
   a progress indicator rather than a hover artefact. */
const STEP_MS = 5200;

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/* The badge. The ring is the capture's own artwork (`#svg15075237_193`): a 36x36 square with a
   circle SUBTRACTED from it, painted in `ink`. It is not a stroked circle — what reads as a
   ring is the four corner slivers left behind, and redrawing it as a `border-radius: 50%`
   outline would be a different shape. Path verbatim, and UNCHANGED by the 2026-08-13 icon
   swap: only the thing sitting in the cutout changed, so the row geometry is untouched. */
function Badge({ Icon }: { Icon: () => ReactNode }) {
  return (
    <span className="relative block h-9 w-9 shrink-0" aria-hidden="true">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="absolute inset-0">
        <path
          d="M36 36H18c9.941 0 18-8.059 18-18S27.941 0 18 0 0 8.059 0 18s8.059 18 18 18H0V0h36v36Z"
          fill="currentColor"
        />
      </svg>
      {/* `left-1/2` + `-translate-x-1/2` is a CENTRING IDIOM and stays physical. Migrating it
          would be an active bug: under rtl `start-1/2` resolves to `right:50%` while the
          translate still moves left, landing the glyph off-centre by its own width. This held
          for the numeral it replaced and holds for the icon: the box is 16px wide either way.
          ⚠️ THE ICON IS 16px IN A 36px BADGE, i.e. it sits inside the SUBTRACTED circle rather
          than on the painted corners. The numeral was 14px and optically centred by its own
          line-box; a square icon needs the box sized explicitly or it fills the badge and
          overruns the slivers. */}
      <span className="absolute top-1/2 left-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-ink">
        <Icon />
      </span>
    </span>
  );
}

/* ---- Panel content -------------------------------------------------------------------
 * The original's four panels are `all_your_data_01.riv` and three more Rive scenes of rogo's
 * real product UI. Per the user's call they are REBUILT, not vendored: no Rive runtime, no
 * borrowed product art. Everything is drawn from this site's tokens.
 *
 * ⚠️ THESE COULD NOT BE MEASURED. Only the ACTIVE step's panel is ever mounted, so both the
 * capture and a live probe only ever showed step 01. The first pass invented the other three
 * and got them wrong; they were rebuilt on 2026-08-11 from four reference screenshots the
 * user supplied, one per step. See stepperPanels.tsx.
 */

function Panel({ step, animate }: { step: number; animate: boolean }) {
  if (step === 1) return <PanelSources animate={animate} />;
  if (step === 2) return <PanelCitations />;
  if (step === 3) return <WorkflowsScroller />;
  return <PanelDocuments />;
}

/* ---- Desktop: the auto-advancing stepper --------------------------------------------- */

function StepRow({
  Icon,
  label,
  active,
  progress,
  onSelect,
}: {
  Icon: () => ReactNode;
  label: string;
  active: boolean;
  progress: boolean;
  onSelect: () => void;
}) {
  return (
    /* Measured: 472x60, row, gap 16, padding 12, items centred. Inactive rows are opacity .5
       — the ONLY thing that distinguishes them; there is no colour change.
       A <button> rather than the original's plain <div>: the step is selectable, so it should
       be reachable and operable from the keyboard. Our accessibility floor, as elsewhere. */
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={`relative flex h-[60px] w-full flex-row items-center gap-4 overflow-hidden p-3
                  text-start transition-opacity duration-300
                  focus-visible:ring-2 focus-visible:ring-ink focus-visible:outline-none
                  ${active ? "opacity-100" : "opacity-50 hover:opacity-75"}`}
      style={{ transitionTimingFunction: "var(--ease-rogo)" }}
    >
      {/* `Fill` — absolute, behind the content, `surface`. Sweeps 0 -> 100% across the step's
          life. Width, not transform: the original animates width, and a scaleX would drag the
          right edge's easing with it.
          A CSS ANIMATION rather than a transition, and the caller remounts it via `key` on
          each step change. A transition would need a "have we hydrated yet" flag to start
          from a real 0; an animation always begins at its `from`. */}
      {/* `start-0`, not `left-0`, so the bar is anchored to the inline START.
          ⚠️ THE `step-fill` KEYFRAME NEEDS NO RTL COUNTERPART. It animates `width` 0% -> 100%,
          and width is direction-neutral: with `inset-inline-start: 0` the box grows toward the
          inline END in both directions, which is the sweep. A mirrored keyframe would be a
          second name to keep in step for nothing. */}
      {active && progress && (
        <span
          className="absolute inset-y-0 start-0 -z-px bg-surface"
          style={{ animation: `step-fill ${STEP_MS}ms linear forwards` }}
          aria-hidden="true"
        />
      )}
      <span className="relative z-[1] flex items-center gap-4">
        <Badge Icon={Icon} />
        <span
          className="font-sans text-[14px] font-normal text-ink"
          style={{ lineHeight: "130%", letterSpacing: "-0.01em" }}
        >
          {label}
        </span>
      </span>
    </button>
  );
}

/* ---- Tablet / phone: the stacked variant ---------------------------------------------- */

function StackedFeature({
  Icon,
  label,
  step,
}: {
  Icon: () => ReactNode;
  label: string;
  step: number;
}) {
  return (
    /* Measured at 1024: 944x655, column, centred, gap 24 — a 36px header row over the panel.
       All four are shown at once and all are full-opacity; there is no active state here,
       because there is no stepper to be active in. */
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="relative flex h-9 w-full flex-row items-center gap-4">
        <Badge Icon={Icon} />
        <span
          className="font-sans text-[14px] font-normal text-ink"
          style={{ lineHeight: "130%", letterSpacing: "-0.01em" }}
        >
          {label}
        </span>
      </div>
      <ImagePanel step={step} />
    </div>
  );
}

/* ---- The image + floating panel, shared by both variants ------------------------------ */

function ImagePanel({ step, animate = false }: { step: number; animate?: boolean }) {
  return (
    /* THE ASPECT DIFFERS BY TIER, measured: 768x541 (1.419) at desktop, but 944x595 (1.586)
       at 1024 — the stacked variant's panel is proportionally wider and shorter, not the same
       box reflowed. Taken from the live `.9vv6u7` block: 655 total minus the 36px header and
       the 24px gap leaves 595.
       The floating panel is CENTRED in it — measured dx 129 = (768-510)/2, dy 131 = (541-280)/2. */
    <div className="relative flex aspect-[944/595] w-full items-center justify-center overflow-hidden desktop:aspect-[768/541]">
      {/* ⚠️ SUBSTITUTE ASSET, AND IT IS NOW THE USER'S OWN (2026-08-13). The original is rogo's
          photograph (`1UrYDcqTSd3WVXNwcrjT2YSNu0.png`); ours was a graded frame from a clip
          already vendored here, and is now `product-section-2.jpg`, supplied by the user.
          Decorative dressing, held to the two-candidate ceiling in CLAUDE.md §7.
          ⚠️ THE MASTER IS 3573×5359 PORTRAIT and this box is landscape, so `object-cover` throws
          most of it away. Shipped downscaled to 1100px wide / 122KB — the full 1.0MB master would
          have been ~8× the bytes for a decorative backdrop rendered at most 768px wide. Master
          kept at features/product-page/assets/product-section-2-master.jpg; re-crop from that. */}
      {/* Plain <img> with the same inline disable Security.tsx uses — a static decorative
          asset already sized to its box gains nothing from next/image's loader. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/product/product-section-2.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* `RIV DATA` — 510x280 at desktop, `surface`, radius 1px (yes, 1px, not 0 and not 6). */}
      <div
        className="relative flex max-h-[85%] w-[85%] max-w-[510px] flex-col items-center
                   justify-center gap-[10px] overflow-hidden rounded-[1px] bg-surface
                   p-5 desktop:h-[280px]"
      >
        <Panel step={step} animate={animate} />
      </div>
    </div>
  );
}

export default function ProductStepper() {
  const t = usePageDict("product").stepper;
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  /* A timeout keyed on `active`, NOT a free-running interval. With an interval, picking a step
     by hand does not reset the clock, so a click landing late in a cycle gets ~0.2s before the
     stepper moves on by itself — the one thing a manual selection must not do. */
  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % STEP_KEYS.length), STEP_MS);
    return () => clearTimeout(id);
  }, [reduced, active]);

  return (
    <>
      {/* ---- >=1200: the stepper ---- */}
      <div className="hidden w-full flex-row items-start gap-10 desktop:flex">
        {/* Image 768 : text 472 of a 1280 row, with the 40px gap — expressed as the measured
            ratio so it holds at 1440 and 1600 without a second set of numbers. */}
        <div className="w-[768px] shrink-0">
          <ImagePanel step={active + 1} animate={!reduced} />
        </div>
        {/* 472x541, column, SPACE-BETWEEN — measured. That is what pins the title to the top
            and the stepper to the bottom against the image's full height. */}
        <div className="flex h-[541px] w-[472px] shrink-0 flex-col items-start justify-between">
          <div className="flex w-full flex-row items-center gap-[10px] ps-3">
            <h3
              className="w-full font-display text-[28px] font-normal text-ink"
              style={{ lineHeight: "110%", letterSpacing: "-0.02em" }}
            >
              {t.title}
            </h3>
          </div>
          <div className="flex w-full flex-col">
            {STEP_KEYS.map((k, i) => (
              <StepRow
                /* `key` carries the active index so the row REMOUNTS when the step changes,
                   restarting the Fill animation from 0. Without it the sweep would only ever
                   play once. `k` is "01".."04" — a stable unique string, no longer rendered. */
                key={`${k}-${i === active ? active : "idle"}`}
                Icon={STEP_ICONS[i]}
                label={t.steps[i]}
                active={i === active}
                progress={!reduced}
                onSelect={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ---- <1200: the stacked variant ---- */}
      <div className="flex w-full flex-col items-center justify-center gap-12 desktop:hidden">
        <h3
          className="w-full font-display text-[28px] font-normal text-ink"
          style={{ lineHeight: "110%", letterSpacing: "-0.02em" }}
        >
          {t.title}
        </h3>
        {STEP_KEYS.map((k, i) => (
          <StackedFeature key={k} Icon={STEP_ICONS[i]} label={t.steps[i]} step={i + 1} />
        ))}
      </div>
    </>
  );
}
