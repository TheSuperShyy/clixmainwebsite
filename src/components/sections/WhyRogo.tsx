/**
 * Why financial institutions choose Rogo — clone of the rogo.ai section Framer names
 * `Series C Tenants` (`.framer-1lovf32`). The internal name is stale (the site is on a
 * Series D banner); our slug is descriptive. No `id` in the original, so none here.
 *
 * Spec, provenance and open questions: features/why-rogo/FEATURE.md.
 * Do not "tidy" a number here without changing that file first.
 *
 * Two things about this section are load-bearing and look like mistakes if you skim them:
 *
 * 1. `w-px` on both columns. The capture sets `flex:1 0 0; width:1px` on the headline and
 *    the item list. The width never applies — flex-basis is 0 — but it is what makes the
 *    columns actually equal: a flex item's automatic minimum size is capped by its
 *    *specified* size, so `width:1px` defeats `min-width:auto` and stops long content from
 *    widening its own column. Drop it and the split drifts off 50/50.
 *
 * 2. `overflow-clip`, never `overflow-hidden`. The headline is `position:sticky`, and
 *    `overflow:hidden` on any ancestor makes that ancestor a scroll container, which kills
 *    the stick. `clip` does not. The capture uses `clip` throughout for exactly this
 *    reason.
 *
 * No animation library. The one scroll behaviour here is native CSS `position:sticky` on
 * the headline — the capture emits zero `data-framer-appear-id` in this subtree, so there
 * is no entrance motion to reproduce. A GSAP ScrollTrigger pin would be *less* faithful:
 * it wraps the element in a pin-spacer and changes the layout the original doesn't change.
 */

import {
  AgentTreeIcon,
  ChartBoardIcon,
  DeploymentIcon,
  DollarCircleIcon,
  IntegrationIcon,
} from "@/components/ui/WhyRogoIcons";

type Tenant = {
  id: string;
  Icon: (props: { className?: string }) => React.ReactElement;
  /* Each icon sits at its own px offset inside the 40px Icon Frame — the capture gives
     every one a hand-placed absolute box rather than stretching it to fill. Verbatim:
     30x30@(5,5) · 29x29@(6,6) · 27x27@(7,7) · 30x29@(7,5) · 30x30@(5,5). Note #4 is the
     only one not vertically centred (7 + 29 = 36 of 40); that is the capture's, not ours. */
  iconBox: string;
  /* Icon Frame opacity. Four of five are .7; item 1 alone is .6, and item 4 carries its
     .7 on the SVG path instead of the frame. Reproduced where each one actually lives. */
  frameOpacity: string;
  title: string;
  /* Framer caps each heading at a hand-set width to control where it wraps — 844 / 500 /
     300 / 844 / 844. The 300 on item 3 is not a typo: that headline is meant to break
     across three lines. */
  titleMax: string;
  body: string;
  /* Items 1, 2 and 4 track at `-0.1px`; items 3 and 5 at `-0.01em`. Same author, same
     paragraph style, two different values — the capture's inconsistency, copied rather
     than normalised. At 18px they differ by 0.08px per character. */
  bodyTracking: string;
  /* Item 1 is the only one with top padding, and item 5 the only one without a rule. */
  containerClass: string;
};

const TENANTS: Tenant[] = [
  {
    id: "by-finance",
    Icon: DollarCircleIcon,
    iconBox: "absolute top-[5px] left-[5px] h-[30px] w-[30px]",
    frameOpacity: "opacity-60",
    title: "By finance, for finance",
    titleMax: "max-w-[844px]",
    body: "Domain expertise is in Rogo’s DNA. Our team of former bankers and investors understands the nuance and complexity of high-finance workflows — and why generic AI chatbots break down. That’s why our platform and model are built explicitly for finance.",
    bodyTracking: "-0.1px",
    containerClass: "gap-7 py-[72px] border-b border-hairline-dark",
  },
  {
    id: "agents",
    Icon: AgentTreeIcon,
    iconBox: "absolute top-[6px] left-[6px] h-[29px] w-[29px]",
    frameOpacity: "opacity-70",
    title: "Agents that understand, and act",
    titleMax: "max-w-[500px]",
    body: "Rogo agents don’t just answer questions. They understand financial workflows and execute end-to-end work across deals and investments — the same way your team does.",
    bodyTracking: "-0.1px",
    containerClass: "gap-7 pb-[72px] border-b border-hairline-dark",
  },
  {
    id: "integrated",
    Icon: IntegrationIcon,
    iconBox: "absolute top-[7px] left-[7px] h-[27px] w-[27px]",
    frameOpacity: "opacity-70",
    title: "Integrated into your firm & the financial data universe",
    titleMax: "max-w-[300px]",
    /* En dash before "market data", not the em dash the other items use. The capture's. */
    body: "Rogo is embedded directly into your firm’s systems and data, from SharePoint and CRM to the financial data platforms your team relies on – market data, filings, research, and proprietary sources.",
    bodyTracking: "-0.01em",
    containerClass: "gap-7 pb-[72px] border-b border-hairline-dark",
  },
  {
    id: "outputs",
    Icon: ChartBoardIcon,
    iconBox: "absolute top-[7px] left-[5px] h-[29px] w-[30px]",
    frameOpacity: "opacity-100",
    title: "Institutional-grade outputs",
    titleMax: "max-w-[844px]",
    body: "Rogo produces real institutional outputs: auditable Excel models, investment memos, diligence materials, and slide decks — built to the same standards your best people hold themselves to.",
    bodyTracking: "-0.1px",
    containerClass: "gap-8 pb-[72px] border-b border-hairline-dark",
  },
  {
    id: "deployment",
    Icon: DeploymentIcon,
    iconBox: "absolute top-[5px] left-[5px] h-[30px] w-[30px]",
    frameOpacity: "opacity-70",
    title: "Custom deployed + partnership-minded",
    titleMax: "max-w-[844px]",
    body: "Every firm is different. That’s why every Rogo deployment is bespoke. Our operating model pairs enterprise-grade security with white-glove partnership, led by ex-finance professionals who act as true change-management partners.",
    bodyTracking: "-0.01em",
    containerClass: "gap-8 pb-[72px]",
  },
];

function TenantItem({ item }: { item: Tenant }) {
  const { Icon } = item;

  return (
    <div
      className={`relative flex w-full flex-col items-start overflow-clip
                  ${item.containerClass}`}
    >
      {/* Icon Container — 64px tile, black @5%, radius 6. */}
      <div className="relative h-16 w-16 flex-none overflow-clip rounded-[6px] bg-tile">
        {/* Icon Frame — 40px square, absolutely centred in the tile. */}
        <div
          className={`absolute top-1/2 left-1/2 aspect-square w-10
                      -translate-x-1/2 -translate-y-1/2 overflow-clip text-ink
                      ${item.frameOpacity}`}
        >
          <Icon className={item.iconBox} />
        </div>
      </div>

      {/* Text column — gap 16, and a 32px right inset the original applies to the text
          only, never to the icon tile. */}
      <div className="flex w-full flex-col items-start gap-4 pr-8">
        {/* h4 in the original. Demoted to h3 here so the outline runs h1 (hero) → h2
            (section) → h3 (item) without a skipped level. Purely semantic. */}
        <h3
          className={`w-auto font-sans text-[24px] leading-[1.2em] font-medium
                      tracking-[-0.02em] text-ink
                      tablet:text-[28px]
                      desktop:text-[24px] desktop:leading-[1.1em]
                      ${item.titleMax}`}
        >
          {item.title}
        </h3>

        <p
          className="w-auto max-w-[720px] text-[16px] leading-[1.5em] text-ink opacity-70
                     desktop:text-[18px]"
          style={{ letterSpacing: item.bodyTracking }}
        >
          {item.body}
        </p>
      </div>
    </div>
  );
}

export default function WhyRogo() {
  return (
    <section
      data-nav-theme="light"
      /* padding 80/16/40 phone → 96/40/128 tablet → 96/40/164 desktop+ */
      className="relative flex w-full flex-col items-center justify-center overflow-clip
                 bg-canvas px-4 pt-20 pb-10
                 tablet:px-10 tablet:pt-24 tablet:pb-32
                 desktop:pb-[164px]"
    >
      {/* Width Container — max-w 1280, gap 24. Stacks below 810. */}
      <div
        className="relative flex w-full max-w-[var(--container-max)] flex-col
                   items-start gap-6 overflow-clip tablet:flex-row"
      >
        {/* Headline — a fixed 299px block on phone, a sticky equal column from 810 up.
            `top-24` is the capture's 96px; it is measured from the viewport, so at the
            desktop tier the pinned headline clears the 60px nav row with 36px to spare. */}
        <div
          className="relative z-[1] flex w-[299px] flex-none flex-col items-start
                     overflow-visible
                     tablet:sticky tablet:top-24 tablet:w-px tablet:flex-[1_0_0]
                     tablet:pt-[72px] tablet:pb-24"
        >
          {/* h3 in the original — see the note on TenantItem's heading. */}
          <h2
            className="w-full max-w-[400px] text-left font-display text-[36px]
                       leading-[105%] tracking-[-0.05em] text-ink tablet:text-[44px]"
          >
            {/* The hard break is in the capture at every tier, and it survives the 400px
                measure at all of them — it is the author's line break, not a fallback. */}
            Why financial institutions <br />
            choose Rogo
          </h2>
        </div>

        {/* Tenants — gap 72 stacked, 88 once the columns split. */}
        <div
          className="relative flex w-full flex-none flex-col items-center gap-[72px]
                     overflow-clip
                     tablet:w-px tablet:flex-[1_0_0] tablet:gap-[88px]"
        >
          {TENANTS.map((item) => (
            <TenantItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
