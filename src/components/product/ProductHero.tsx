"use client";

/**
 * ProductHero — clone of rogo.com/product blocks `Hero` (#first) + `Product Preview` (#second).
 *
 * Capture: docs/reference/target/rogo-product-2026-08-11.html (+ .css).
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md
 *
 * Copy in THIS block is clix's own as of 2026-08-12 (headline, subhead, CTA, typed prompts);
 * the geometry around it is still rogo's, measured. Sibling product blocks may still be
 * running rogo's strings, which is why the route stays noindex.
 *
 * TIER MAP — three sizes, not four. XL (>=1600) and desktop (1200-1599.98) share every value
 * in this block; the capture has no `min-width:1600px` rule for any class here. Only tablet
 * (810-1199.98) and phone (<=809.98) diverge. Written as base = phone, `tablet:`, `desktop:`.
 *
 * `Hero` and `Product Preview` are SIBLINGS in the original, not nested — both are children of
 * the page wrapper `.framer-xvvc24` (column, centred, no padding). They are wrapped in one
 * <section> here so the nav's theme scanner sees a single contiguous block: Nav.tsx picks the
 * element spanning the nav's bottom edge and falls back to "light" on a gap.
 */

import { useEffect, useState, useSyncExternalStore } from "react";

/* The hero prompt's typed phrases. CLIX'S OWN (2026-08-12). Four things an owner actually
   asks for, one per capability family: agent follow-up, WhatsApp intake, call summaries,
   invoice chasing. Held to rogo's character lengths (37/48/44/34 vs 36/50/43/35) because the
   typing loop is time-driven, not length-driven: a longer phrase just sits on screen longer,
   and above ~50 chars it wraps to a third line in the phone field, whose box is a fixed h-11.

   The original's list ("benchmark revenue estimates for AAPL" and three siblings) was
   recovered from the lazily-loaded code component in bundle
   ZcAf3VKJXH9VIfxmp-FSCoIZYOjifs-KtG_IUJebwsE.Cbu-MJq3.mjs (2026-08-11), which is also where
   `typeSpeed: 30` and `showCursor: true` came from; the SSR HTML renders an EMPTY span plus
   the cursor, so none of it is in the capture. Kept on record because the timings below are
   still the original's measured values. */
const PROMPTS = [
  "follow up with every lead from friday",
  "route every whatsapp inquiry to the right person",
  "turn every sales call into a written summary",
  "send and chase invoices without me",
];
const TYPE_SPEED_MS = 30; /* measured: typeSpeed 30 */
/* Not in the bundle payload: the hold at the end of a phrase and the delete rate. Both are
   ESTIMATED. Flagged in FEATURE.md; a live observation can tighten them. */
const HOLD_MS = 1800;
const DELETE_SPEED_MS = 18;

/* Subscribed rather than read once, so a mid-session change to the OS setting is honoured.
   The server snapshot is `false` — matchMedia does not exist during SSR, and false matches
   what the markup renders, so hydration stays quiet. */
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

/** The typed prompt + blinking caret. Reduced-motion renders the first phrase, static. */
function TypedPrompt() {
  const reduced = usePrefersReducedMotion();
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (reduced) return;
    let phrase = 0;
    let chars = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const full = PROMPTS[phrase];
      chars += deleting ? -1 : 1;
      setTyped(full.slice(0, chars));
      let next: number = deleting ? DELETE_SPEED_MS : TYPE_SPEED_MS;
      if (!deleting && chars === full.length) {
        deleting = true;
        next = HOLD_MS;
      } else if (deleting && chars === 0) {
        deleting = false;
        phrase = (phrase + 1) % PROMPTS.length;
      }
      timer = setTimeout(tick, next);
    };
    timer = setTimeout(tick, TYPE_SPEED_MS);
    return () => clearTimeout(timer);
  }, [reduced]);

  /* DERIVED, not set in the effect: writing PROMPTS[0] into state from the effect body is
     both a lint error (react-hooks/set-state-in-effect) and a wasted second render. */
  const text = reduced ? PROMPTS[0] : typed;

  return (
    /* Measured: 16px/1em desktop+, 15px/1.4em phone, 15px/1em tablet; letter-spacing 0;
       colour rgb(23,23,23) — a one-off that is NOT `ink` #151515, so it stays literal.
       Desktop centres the line (align-items:center); tablet/phone top-align it. */
    <span
      className="relative flex h-full w-full items-start justify-start
                 text-[15px] leading-[1.4em]
                 tablet:leading-[1em]
                 desktop:items-center desktop:text-[16px]"
      style={{ color: "rgb(23, 23, 23)", letterSpacing: "0em" }}
      aria-hidden="true"
    >
      <span>{text}</span>
      {!reduced && <span className="ml-px animate-[blink_1s_step-end_infinite] text-muted">|</span>}
      {reduced && <span className="ml-px text-muted">|</span>}
    </span>
  );
}

/* The two corner brackets that frame the CTA. 14x20 each, ink fill, path data verbatim from
   the capture's <use> defs #svg-1980836134_494 (Left) and #svg5446185_500 (Right).
 *
 * ⚠️ THE CAPTURE'S VARIANT CLASS IS STALE — READ THIS BEFORE TRUSTING SSR MARKUP ON THIS PAGE.
 * The frozen HTML declares this button as `framer-v-velzew`, whose base rule puts the
 * brackets at top:-22/left:-48 and bottom:-22/right:-48. Built to that, they sit visibly too
 * far out. Probing the LIVE page in headless Chrome (2026-08-11) shows the hydrated class is
 * `framer-5Atru framer-velzew framer-v-q741vz` — React swaps the variant on hydration, so the
 * rules that actually apply are the `q741vz` ones: top:-12/left:-28, bottom:-12/right:-28.
 * Confirmed by computed style, not inferred: leftDelta {dx:-28, dy:-12} against a 220x40 box.
 *
 * That also means the stylesheet's ONE real hover rule is this button's, not some other
 * component's: `.framer-v-q741vz.hover` slides the brackets IN to top:-2/left:-18 and
 * bottom:-2/right:-18. Implemented below with group-hover. The DURATION AND EASING ARE NOT IN
 * THE CAPTURE (Framer animates it in JS; the sheet's only transition is `color .3s`), so
 * 300ms/--ease-rogo is ours and is flagged as estimated in FEATURE.md.
 *
 * Incidental finding worth carrying forward: headless Chrome DOES have network egress in this
 * environment, contrary to the note in docs/CONTEXT.md dated 2026-08-03. Live probing is
 * available for exactly this class of question — runtime variant selection, computed
 * geometry, motion — none of which a static capture can answer. */
function BracketLeft({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className={className} style={style} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.79688 3.46116H9.91357H9.91659L13.4974 3.45815V0H9.79311C6.9863 0 5.28776 1.13565 4.79688 3.46116Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.89277 3.46004C1.49238 3.46004 0.875 4.03841 0.875 5.4783V20.0007H4.63347V5.02645C4.63347 4.4511 4.68768 3.93298 4.79007 3.45703H4.78405L2.89277 3.46004Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BracketRight({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className={className} style={style} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.19531 16.5388H4.07861H4.0756L0.494816 16.5419V20H4.19908C7.00588 20 8.70442 18.8644 9.19531 16.5388Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.0994 16.54C12.4998 16.54 13.1172 15.9616 13.1172 14.5217V-0.000717163H9.35872V14.9735C9.35872 15.5489 9.30451 16.067 9.20211 16.543H9.20814L11.0994 16.54Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Paperclip, 16x16, viewBox "-1 -1 16 16" (the original's own off-origin box — kept, because
   the stroke is drawn to its edges and a 0 0 16 16 box clips the cap). Stroke is `muted`. */
function AttachIcon() {
  return (
    <svg width="16" height="16" viewBox="-1 -1 16 16" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d="M13.416 6.57584L7.41349 12.5783C6.67814 13.3137 5.68079 13.7268 4.64084 13.7268C3.6009 13.7268 2.60355 13.3137 1.8682 12.5783C1.13284 11.843 0.719727 10.8456 0.719727 9.8057C0.719727 8.76575 1.13284 7.7684 1.8682 7.03305L7.46575 1.4355C7.95598 0.944397 8.62123 0.668155 9.31514 0.667543C10.009 0.66693 10.6748 0.941997 11.1659 1.43223C11.657 1.92247 11.9332 2.58771 11.9338 3.28162C11.9344 3.97553 11.6594 4.64126 11.1691 5.13236L5.55853 10.7299C5.31341 10.975 4.98096 11.1127 4.63431 11.1127C4.28766 11.1127 3.95521 10.975 3.7101 10.7299C3.46498 10.4848 3.32727 10.1523 3.32727 9.8057C3.32727 9.45905 3.46498 9.1266 3.7101 8.88148L9.25539 3.34271"
        stroke="currentColor"
        strokeWidth="1.17568"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Submit arrow, 20x21.25 with the original's `translate(0 0.625)` group offset folded in. */
function ArrowIcon() {
  return (
    <svg width="20" height="21" viewBox="0 0 20 21.25" fill="none" className="h-[21px] w-5 shrink-0" aria-hidden="true">
      <g transform="translate(0 0.625)">
        <path
          d="M 11.487 5.081 L 16.25 9.844 L 11.487 14.606"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="bevel"
        />
        <path
          d="M 10.605 9.844 L 2.993 9.844"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function ProductHero() {
  return (
    <section
      id="hero"
      data-nav-theme="light"
      className="relative flex w-full flex-col items-center justify-start overflow-hidden"
    >
      {/* ---- Block 1a: Hero -------------------------------------------------------------
          Measured: column, centred, gap 96, padding 198/40/72 (phone 198/16/72), overflow
          hidden. The 198px top is the fixed nav's clearance — this page uses the same fixed
          nav as / and /news, NOT the in-flow `spacer` nav that /clix needs. */}
      <div
        className="flex w-full flex-col items-center justify-center gap-24
                   overflow-hidden px-4 pt-[198px] pb-[72px] tablet:px-10"
      >
        {/* Text & Button — gap 32 desktop+, 24 tablet and phone; max-w 360 on phone only. */}
        <div className="flex w-full max-w-[360px] flex-col items-center justify-center gap-6 tablet:max-w-none desktop:gap-8">
          {/* Text Container — gap 16, max-w 960. */}
          <div className="flex w-full max-w-[960px] flex-col items-center justify-center gap-4 overflow-hidden">
            {/* h1 64/64/56/48, weight 400, -0.06em, line-height 100%, ink, centred.
                Face is `--font-display` (Discovery) — the site's one-face substitution for
                the original's "ABC Arizona Mix Regular", established 2026-08-08.
                `text-wrap:balance` is a TABLET-ONLY rule in the capture. */}
            <h1
              className="w-full text-center font-display text-[48px] font-normal text-ink
                         tablet:text-[56px] tablet:text-balance
                         desktop:text-[64px]"
              style={{ lineHeight: "100%", letterSpacing: "-0.06em" }}
            >
              Eight Services, One Platform
            </h1>
            {/* Subtitle 18/18/16/16, weight 400, -0.02em, 130%, max-w 540, balanced.
                The preset's colour is #383838 (ink-soft) but the element overrides it inline
                to rgb(115,115,115) = `muted`. The override wins; ours uses the token. */}
            <p
              className="w-full max-w-[540px] text-center text-balance font-sans text-[16px]
                         font-normal text-muted desktop:text-[18px]"
              style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
            >
              AI agents, automations, CRM and custom software, built as one system around
              how your team already works
            </p>
          </div>

          {/* Button block — gap 10. The CTA sits in a 220x40 frame with the two brackets
              positioned OUTSIDE it (top:-12/left:-28, bottom:-12/right:-28 — the live
              `q741vz` values, see the note above), which is why the frame is `relative` and
              the section clips rather than the frame. `group` drives the bracket hover. */}
          <div className="flex w-full flex-col items-center justify-center gap-[10px]">
            <div className="group relative h-10 w-[220px] shrink-0">
              <BracketLeft
                className="pointer-events-none absolute -top-3 -left-7 text-ink
                           transition-[top,left] duration-300
                           group-hover:-top-0.5 group-hover:-left-[18px]"
                style={{ transitionTimingFunction: "var(--ease-rogo)" }}
              />
              <BracketRight
                className="pointer-events-none absolute -right-7 -bottom-3 text-ink
                           transition-[bottom,right] duration-300
                           group-hover:-right-[18px] group-hover:-bottom-0.5"
                style={{ transitionTimingFunction: "var(--ease-rogo)" }}
              />
              {/* The original's DESKTOP button has NO href and its MOBILE twin points at
                  ./demo, the same authoring slip the site footer already carries. Ours points
                  at `#contact` at every tier, which is clix's one CTA destination sitewide
                  (Hero.tsx, Footer.tsx) and resolves IN-PAGE here: Footer carries
                  `id="contact"` and /product renders it. Deviation logged in FEATURE.md. */}
              <a
                href="#contact"
                className="flex h-10 w-full items-center justify-center gap-2 overflow-hidden
                           rounded-[6px] border border-transparent bg-ink px-4 py-2
                           transition-opacity duration-300 hover:opacity-90
                           focus-visible:ring-2 focus-visible:ring-ink
                           focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                           focus-visible:outline-none"
                style={{ transitionTimingFunction: "var(--ease-rogo)" }}
              >
                {/* h-5 + 1px top padding is the site's fixed button-label anatomy.
                    `whitespace-pre` is required: the original's <a> is width:min-content. */}
                <span className="flex h-5 items-center justify-center gap-[10px] pt-px">
                  <span
                    className="font-sans text-[16px] font-medium whitespace-pre text-paper"
                    style={{ lineHeight: "1em", letterSpacing: "-0.01em" }}
                  >
                    Let&rsquo;s start
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Block 1b: Product Preview --------------------------------------------------
          max-w 1280 (= --container-max), height 440 (phone 380), background `muted` behind
          the video, overflow hidden. Full-bleed below 1280 — it carries no gutters of its
          own, unlike the hero above it. */}
      <div className="relative flex h-[380px] w-full max-w-[var(--container-max)] flex-col items-center justify-center overflow-hidden bg-muted tablet:h-[440px]">
        {/* Preview — the row that holds the two vertical rules and the prompt field.
            flex:1 0 0 with padding 0 16px. */}
        <div className="relative flex h-full w-full flex-1 flex-row items-center justify-center px-4">
          {/* Video — absolute inset. Original: loop muted playsinline preload="none", started
              by JS on mount; autoPlay here does the same job declaratively.
              Source is the ORIGINAL's own clip: rogo hotlinks Pexels 5941931 directly, so
              this is public stock, not rogo's footage. Poster is our own frame at t=1s. */}
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            <video
              className="h-full w-full object-cover"
              style={{ objectPosition: "50% 50%" }}
              src="/video/hero-product.mp4"
              poster="/video/hero-product-poster.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
            />
            {/* Darken 1 — vignette. mix-blend overlay @ 20%. */}
            <div
              className="absolute inset-0 h-full w-full overflow-hidden opacity-20 mix-blend-overlay"
              style={{ background: "radial-gradient(45% 85%, #54545400 0%, #000 100%)" }}
            />
            {/* Darken 2 — flat ink @ 15%. */}
            <div className="absolute inset-0 h-full w-full overflow-hidden bg-ink opacity-15" />
          </div>

          {/* Left rule — 1px, white @20%, full height. */}
          <div className="relative h-full w-px shrink-0 bg-paper opacity-20" />

          {/* Horizontal rules — white @20%, inset 164px top and bottom (tablet 160, phone 127).
              The original swaps which element carries which edge at the phone tier; the
              rendered result is two symmetric rules, so ours states them directly. */}
          <div className="pointer-events-none absolute top-[127px] left-0 z-[1] h-px w-full bg-paper opacity-20 tablet:top-[160px] desktop:top-[164px]" />
          <div className="pointer-events-none absolute bottom-[127px] left-0 z-[1] h-px w-full bg-paper opacity-20 tablet:bottom-[160px] desktop:bottom-[164px]" />

          {/* Input Field — white @40%, radius 14, padding 6, max-w 550, flex:1.
              The 550px cap is what puts the two vertical rules hard against the field's
              edges; without it they slide out to the band's gutters and the whole composition
              reads wrong. `w-px flex-1` is the original's own `width:1px; flex:1 0 0` idiom —
              the 1px basis makes the cap, not the content, decide the width. */}
          <div className="relative flex h-min w-px max-w-[550px] flex-1 flex-row items-center justify-center gap-[10px] rounded-[14px] bg-paper/40 p-[6px]">
            {/* Text Field — solid white, radius 10, 1px hairline ring drawn as a shadow
                (the original uses box-shadow, not a border, so it costs no layout box). */}
            <div className="relative flex h-min w-px flex-1 flex-col items-start justify-start rounded-[10px] bg-paper shadow-[0_0_0_1px_var(--color-hairline)]">
              {/* Prompt row. Desktop: single row, padding 12/12/8/16, caret vertically
                  centred in a 26px line. Tablet/phone: the typed line is lifted OUT of flow
                  (absolute, inset 12) and the row becomes a fixed-height column — which is
                  how the original keeps the field from growing as the phrase wraps. */}
              <div
                className="relative flex h-14 w-full flex-col items-start justify-start gap-[10px]
                           overflow-hidden pt-4 pr-3 pb-2 pl-4
                           tablet:h-auto tablet:min-h-[54px] tablet:pt-3
                           desktop:h-min desktop:min-h-0 desktop:flex-row desktop:items-center
                           desktop:justify-between desktop:gap-0"
              >
                <div className="absolute top-3 right-3 left-3 z-[1] h-11 tablet:h-auto desktop:relative desktop:inset-auto desktop:h-[26px] desktop:w-px desktop:flex-1">
                  <TypedPrompt />
                </div>
              </div>
              {/* Bottom row — attach on the left, submit on the right.
                  padding 8/12/12 desktop+, a flat 12 on phone. */}
              <div className="relative flex w-full flex-row items-center justify-between overflow-hidden p-3 desktop:px-3 desktop:pt-2 desktop:pb-3">
                <div className="flex h-min w-min flex-row items-center justify-start gap-2">
                  <button
                    type="button"
                    aria-label="Attach files"
                    className="flex aspect-square w-4 items-center justify-center text-muted
                               transition-opacity duration-300 hover:opacity-70
                               focus-visible:ring-2 focus-visible:ring-ink
                               focus-visible:ring-offset-2 focus-visible:outline-none"
                    style={{ transitionTimingFunction: "var(--ease-rogo)" }}
                  >
                    <AttachIcon />
                  </button>
                </div>
                {/* Submit — 32px wide, aspect 1, radius 6, `brand-green`. See the token note
                    in globals.css: this is ROGO's green, kept verbatim with the clone. */}
                <button
                  type="button"
                  aria-label="Submit prompt"
                  className="flex aspect-square w-8 shrink-0 flex-row items-center justify-center
                             gap-1 overflow-hidden rounded-[6px] bg-brand-green px-3 py-[6px]
                             text-paper transition-opacity duration-300 hover:opacity-90
                             focus-visible:ring-2 focus-visible:ring-brand-green
                             focus-visible:ring-offset-2 focus-visible:outline-none"
                  style={{ transitionTimingFunction: "var(--ease-rogo)" }}
                >
                  <ArrowIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Right rule. */}
          <div className="relative h-full w-px shrink-0 bg-paper opacity-20" />
        </div>
      </div>
    </section>
  );
}
