"use client";

/**
 * Frontier-LLM price ticker for the announcement banner.
 *
 * 2026-08-08, user: *"make it LLM models not company stocks"*. Was `StockTicker` — eight
 * AI-adjacent equities with sparklines and a green/red day change.
 *
 * Every number here is a live vendor price — see the standing note at the top of
 * src/lib/models.ts. There is no placeholder data path in this component on purpose: with no
 * models it renders `null` and the banner collapses, rather than showing a plausible-looking
 * strip of numbers that are not true.
 *
 * ⚠️ THE SPARKLINE AND THE ±% ARE GONE, and it is not an oversight. Both need a time series
 * per row, and there is no such thing for a list price: a model costs what it costs until the
 * lab changes it. Drawing a trend line under a flat number, or a "+1.2%" against a baseline
 * that was never recorded, would be exactly the invented-figure failure the data layer exists
 * to prevent. The strip is monochrome as a result. If a signal is wanted back in that slot it
 * has to be something real — cheapest-in-set, or price-changed-since-last-poll with actual
 * history behind it — not a shape.
 *
 * MARQUEE. Same technique as `LogoCarousel`, and for the same reason: nine items do not fit a
 * 390px phone, and the page already speaks this idiom. The cycle is MEASURED (item 0 to item
 * N) rather than assumed to be half the track, because the track has a `gap` — with 2N items
 * there are only 2N-1 gaps, so `xPercent: -50` is short by half a gap and the loop visibly
 * drifts. Under `prefers-reduced-motion` the tween is never built and the row simply sits
 * still, which is the honest fallback for a decorative scroll.
 *
 * REFRESH. Server-rendered from `page.tsx` so the first paint already has real numbers and
 * the banner does not pop in and shove the header down. After that it re-fetches
 * `/api/models` every 5 minutes, matching the server's own revalidate window. That cadence is
 * now far faster than the data changes — list prices move on a scale of months — but it costs
 * one cached response and keeps the strip correct on the day a lab does cut a price.
 *
 * ACCESSIBILITY. The scrolling strip is `aria-hidden` and a visually-hidden paragraph carries
 * the same figures as static text, so a screen reader gets them once, in order, without the
 * duplicate pass the marquee needs.
 *
 * DIRECTION (2026-08-12, Hebrew/RTL pass). This component needs NO direction hook, and that is
 * a finding rather than an omission — each of its three direction-sensitive parts turns out to
 * carry direction already, or not to be direction-sensitive at all:
 *   · the tween's sign comes free from `offsetLeft`, which never flips (see `start()` below).
 *     Only the reads that treat `cycle` as a MAGNITUDE needed `Math.abs`;
 *   · the price arrow is a semantic operator, so the expression is isolated LTR rather than
 *     mirrored (see `Item`);
 *   · the edge-fade mask is symmetric, so it is direction-neutral as written (see the mask).
 * Nothing here reads `useDirSign()` and nothing needs to.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ModelPrice } from "@/lib/models";
import { useChrome } from "@/lib/i18n/LocaleProvider";
import { interpolate } from "@/lib/i18n/format";

gsap.registerPlugin(useGSAP);

/* 56px, up from 40 (2026-08-08, user: "this is a bit hard to read"). With five fields per row
   at a 40px gap, the space *between* two models was barely wider than the space between a
   model and its own price, so the strip read as one long sentence rather than nine items. */
const GAP = 56;
const SPEED_PX_PER_SEC = 40; // slower than the logo row's 50 — this one has to be readable
const REFRESH_MS = 5 * 60 * 1000;

/**
 * `$5`, `$1.50`, `$0.09`. Whole dollars drop the decimals — a strip reading "$5.00 · $25.00"
 * spends a third of its width on zeroes, and these are list prices, not trade prices.
 */
function formatUsd(n: number) {
  return `$${Number.isInteger(n) ? n.toFixed(0) : n.toFixed(2)}`;
}

/**
 * Context window, in the unit the provider actually counted in.
 *
 * Labs are split on this and the raw numbers show it: Anthropic reports 1,000,000 (decimal)
 * while Google reports 1,048,576 (binary) for the window both of them market as "1M". So the
 * divisor follows the number — an exact multiple of 1024 is rendered binary, anything else
 * decimal. That is what turns 262,144 into "256K" rather than "262K", and leaves 500,000 as
 * "500K" rather than "488K".
 *
 * Fractions of a million TRUNCATE rather than round, so the label can never overstate the
 * window: OpenAI's 1,050,000 reads "1M", not "1.1M".
 */
function formatContext(n: number) {
  if (n <= 0) return "";
  const binary = n % 1024 === 0;
  const mega = binary ? 1048576 : 1e6;
  if (n >= mega) {
    const m = Math.floor((n / mega) * 10) / 10;
    return `${m}M`.replace(".0M", "M");
  }
  return `${Math.round(n / (binary ? 1024 : 1000))}K`;
}

/**
 * Row height. The banner measured 45px with the old text (14px on a 1.5em line box = 21px,
 * plus 12px padding each side) and the header's hide-on-scroll transform travels exactly that
 * far. `bannerH` is what the transform uses and it is the number recorded in the nav's spec,
 * so the line box is pinned rather than left to the type.
 *
 * The pin is what makes the 13px -> 14px bump below FREE: 14 x 1.5 is exactly 21, so the
 * strip goes back to the banner's own original type size without moving the header a pixel.
 */
const ROW_H = 21;

/**
 * TWO FIELDS, NOT FOUR (2026-08-08, user: "this is a bit hard to read... i want easy to
 * understand like the market graph").
 *
 * The stock ticker was scannable because a symbol is four characters and there was one price.
 * `Anthropic Claude Opus 5 in $5 · out $25 /M 1M ctx` is 45 characters across five fields, and
 * at 13px it reads as prose. What went, and why:
 *
 *   · the CONTEXT WINDOW — the least load-bearing number on the row. `formatContext` is kept
 *     because the sr-only text still announces it and restoring the field is one line;
 *   · the words `in` and `out` — replaced by an arrow. Input-to-output is the near-universal
 *     convention in model pricing, so the arrow carries it in one glyph instead of six;
 *   · 13px -> 14px, the banner's own original size, free because of the ROW_H pin above.
 *
 * BOTH PRICES STAY. Dropping one was the obvious further cut and it is the wrong one: the two
 * differ by 5x on some models and not at all on others, so a single figure would misrepresent
 * whichever it omitted. The arrow is what buys the room to keep them.
 */
function Item({ m }: { m: ModelPrice }) {
  return (
    <li
      className="flex flex-none items-center gap-3 whitespace-nowrap"
      style={{ height: ROW_H }}
    >
      {/* Lab and model share ONE span, separated by a plain space rather than by the flex
          `gap`. The gap sits between every other field, so putting the lab in its own flex
          child would space "Anthropic" as far from "Claude Opus 5" as the price is — loose
          fields instead of a named thing and its maker. A space is ~4px, which reads as one
          unit. (2026-08-08, user asked for the lab to show: "i want it to be LLM not stocks
          of the company like anthropic, GEMINI, OPENAI".) */}
      <span
        className="font-sans text-[14px] font-medium text-paper"
        style={{ letterSpacing: "0.02em" }}
      >
        {m.lab && <span className="font-normal text-paper/60">{m.lab} </span>}
        {m.name}
      </span>
      {/* U+2192, not "->" — and not the "·" it replaced, which read as a separator between two
          equal things rather than as a direction.

          RTL: THE ARROW IS NEITHER MIRRORED NOR SWAPPED FOR U+2190. Per the note above it
          stands in for the words `in`/`out`, which makes it a semantic operator inside a
          numeric expression rather than prose — and `$5 ← $25` reads output-to-input, i.e.
          backwards. Swapping the glyph and letting the bidi algorithm reorder the run does
          land on a correct read, but it costs more than it buys: one glyph would then mean two
          different things depending on ambient direction, and the trailing ` /M` sits exactly
          on a bidi boundary (`/` is CS, `M` is strong L) where the reordering is not something
          you can predict from the source. Forcing the whole expression to an LTR isolate keeps
          one glyph meaning one thing sitewide, and is how Hebrew financial copy actually sets
          a currency expression.

          ⚠️ VIA THE `rtl:` VARIANT, NEVER A BARE `dir="ltr"` ATTRIBUTE. HTML's suggested
          rendering includes `[dir] { unicode-bidi: isolate }`, so the attribute would flip
          this span's computed `unicode-bidi` from `normal` to `isolate` on the ENGLISH page
          too — not a no-op, and the LTR side of this pass has to be one. The variant compiles
          to a `[dir="rtl"]`-scoped rule that cannot match there at all. */}
      <span className="font-sans text-[14px] text-paper/75 rtl:[direction:ltr] rtl:[unicode-bidi:isolate]">
        {formatUsd(m.inputPerM)} → {formatUsd(m.outputPerM)}
        <span className="text-paper/55"> /M</span>
      </span>
    </li>
  );
}

/**
 * How many copies of the model list the track holds.
 *
 * TWO IS NOT ENOUGH HERE, which is the difference between this and the logo marquee. The
 * tween slides the track left by exactly one cycle and then snaps back; for that to be
 * invisible, the track remaining to the right of the start point — `(passes - 1) × cycle` —
 * has to still cover the viewport at the moment it snaps. The stock version's eight quotes
 * measured a 1573px cycle, so two passes left 1573px of cover against a 1600px viewport and
 * the strip showed a 27px hole at the right edge once per loop. Caught by measuring
 * `cycle >= innerWidth`, not by watching it.
 *
 * These rows are wider, so the hole is less likely — but the guard stays, because the cycle
 * depends on model names that come from an API and can change length without warning. Three
 * is the SSR default, and the effect widens it further if the viewport is bigger than that.
 */
const BASE_PASSES = 3;

export default function ModelTicker({ initial }: { initial: ModelPrice[] }) {
  /* Only the sr-only sentence needs strings here — every painted field on the row (lab, model
     name, both prices, the context window) is Latin or numeric in both locales. */
  const a11y = useChrome().a11y;
  const [models, setModels] = useState<ModelPrice[]>(initial);
  const [passes, setPasses] = useState(BASE_PASSES);
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  /* Periodic refresh. Failures are swallowed deliberately: the strip keeps showing the last
     good prices rather than blanking on one bad poll. */
  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const res = await fetch("/api/models");
        if (!res.ok) return;
        const json = await res.json();
        if (alive && Array.isArray(json.models) && json.models.length) {
          setModels(json.models);
        }
      } catch {
        /* offline or upstream down — keep what is on screen */
      }
    };
    const id = setInterval(tick, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  useGSAP(
    () => {
      const ul = track.current;
      if (!ul || !models.length) return;

      const mm = gsap.matchMedia();
      let cancelled = false;

      const start = () => {
        if (cancelled) return;
        const items = ul.children;
        if (items.length < models.length + 1) return;
        /* ⚠️ `cycle` IS A SIGNED DELTA, NOT A LENGTH — AND IN RTL IT IS NEGATIVE. `offsetLeft`
           is measured from the offset parent's LEFT edge in every direction; it does not flip.
           An RTL `flex-row w-max` track lays item N to the LEFT of item 0, so this subtraction
           comes out negative there. That sign is precisely what makes `x: -cycle` below correct
           in BOTH directions with no direction factor applied: in LTR it slides the track left
           by one cycle, in RTL it slides it right by one, which is the mirror. DO NOT multiply
           this by a direction sign — that would cancel the flip and drive the RTL track the
           wrong way, into the hole behind the start point.

           What must not inherit the sign is anything reading `cycle` as a magnitude — a
           duration, or a count of copies. Those get `Math.abs` (here and in the tween). In LTR
           `cycle > 0`: item N sits that far to the right of item 0, and 0 is filtered on the
           next line. So `Math.abs` is a provable no-op in LTR — `Math.abs(x) === x` holds for
           every positive double — and the English render does not move. */
        const cycle =
          (items[models.length] as HTMLElement).offsetLeft -
          (items[0] as HTMLElement).offsetLeft;
        /* Truthiness test on purpose, and it stays one: it rejects 0 (unmeasured or collapsed
           track) and NaN. A negative cycle is truthy, and is the ordinary RTL case. */
        if (!cycle) return;

        /* Widen the track if this viewport is wider than the copies behind the start point.
           Bails out by returning: the state change re-runs this effect with the new count,
           and the tween is built on that pass instead of on a track about to change width.

           `Math.abs` is load-bearing here: a negative cycle makes the quotient negative, and
           `Math.max(BASE_PASSES, <negative>)` collapses to BASE_PASSES — silently disabling
           the anti-hole guard documented at BASE_PASSES above, i.e. reinstating the 27px gap
           at the right edge on wide viewports. */
        const needed = Math.max(
          BASE_PASSES,
          Math.ceil(window.innerWidth / Math.abs(cycle)) + 1,
        );
        if (needed !== passes) {
          setPasses(needed);
          return;
        }

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.set(ul, { x: 0 });
          gsap.to(ul, {
            /* Signed on purpose — see above. This one line is correct in both directions. */
            x: -cycle,
            /* Distance over speed, so a MAGNITUDE. A negative duration is undefined behaviour
               in GSAP; in LTR `Math.abs` is a no-op on an already-positive cycle. */
            duration: Math.abs(cycle) / SPEED_PX_PER_SEC,
            ease: "none",
            repeat: -1,
          });
        });
      };

      /* Same font-load gate as the logo marquee, and load-bearing for the same reason: these
         items are text, and text measured before the webfont swap gives a cycle that is wrong
         by the reflow delta — which the loop then repeats forever.

         DO NOT DROP THIS IN THE RTL PASS; it only gets more load-bearing. Every field on the
         row is Latin or digits today (lab, model name, prices), so the Hebrew page measures
         the same glyphs as the English one — but the moment any of them localises, the
         pre-swap measurement error grows with the text: Hebrew advances average 1.117x Latin
         lowercase in discovery-var.woff2, and a cycle measured before the swap bakes that
         error into every repeat, so the seam tears once per loop forever rather than once. */
      document.fonts.ready.then(start);

      return () => {
        cancelled = true;
        mm.revert();
      };
    },
    { scope: root, dependencies: [models, passes] },
  );

  /* Recheck on resize: dragging a window from a laptop screen to a 4K one changes how many
     copies the loop needs, and the effect above only samples the width when it runs. */
  useEffect(() => {
    const onResize = () => {
      const ul = track.current;
      if (!ul || !models.length) return;
      const items = ul.children;
      if (items.length < models.length + 1) return;
      /* Signed, and negative in RTL — the full explanation is on the tween above. `Math.abs`
         for the same reason it is there: this is a count of copies, not a direction. */
      const cycle =
        (items[models.length] as HTMLElement).offsetLeft -
        (items[0] as HTMLElement).offsetLeft;
      if (!cycle) return;
      setPasses(
        Math.max(BASE_PASSES, Math.ceil(window.innerWidth / Math.abs(cycle)) + 1),
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [models]);

  if (!models.length) return null;

  return (
    <div ref={root} className="relative flex w-full items-center overflow-hidden">
      {/* The readable copy, for assistive tech only — the marquee below is decoration by the
          time you cannot see it move.

          ⚠️ STILL ENGLISH ON THE HEBREW PAGE, KNOWINGLY. The sentence is assembled from live
          API data plus fixed connectives, and those connectives belong in `chrome.a11y` rather
          than here. The three keys were requested rather than invented in this file, and are now
          filled in both locales. Rows join with "; "; both prices come from `formatUsd`, i.e. a
          $-prefixed Latin numeral in either language. Nothing here is painted, so the Hebrew
          needs no bidi isolation — a screen reader reads a number in the number's own
          direction. */}
      <p className="sr-only">
        {a11y.tickerIntro}{" "}
        {models
          .map(
            (m) =>
              interpolate(a11y.tickerRow, {
                model: `${m.lab ? `${m.lab} ` : ""}${m.name}`,
                in: formatUsd(m.inputPerM),
                out: formatUsd(m.outputPerM),
              }) +
              (m.context
                ? interpolate(a11y.tickerContext, {
                    ctx: formatContext(m.context),
                  })
                : ""),
          )
          .join("; ")}
      </p>

      <div
        aria-hidden="true"
        className="relative w-full overflow-hidden"
        style={{
          /* Fade both ends so items enter and leave instead of being chopped by the edge.
             Same stops as the logo row, so the two strips behave identically.

             `to right` IS CORRECT IN RTL TOO, verified rather than overlooked: the stops are
             0/6/94/100 with alphas 0/1/1/0, i.e. mirror-symmetric about 50%, so `to left`
             would paint a byte-identical mask. THAT SYMMETRY IS LOAD-BEARING — there is no
             logical-direction keyword for a gradient, so if either inner stop is ever moved
             off its mirror this needs an `rtl:` override. */
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 6%, rgba(0,0,0,1) 94%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 6%, rgba(0,0,0,1) 94%, rgba(0,0,0,0) 100%)",
        }}
      >
        <ul
          ref={track}
          /* w-max + flex-none: the track must lay out at its full multiplied width and
             overflow the clip. If it shrank to fit, the measured cycle would be wrong and the
             loop would tear. */
          className="relative flex w-max flex-none list-none items-center"
          style={{ gap: `${GAP}px`, margin: 0, padding: 0 }}
        >
          {Array.from({ length: passes }, (_, pass) =>
            models.map((m) => <Item key={`${pass}-${m.id}`} m={m} />),
          )}
        </ul>
      </div>
    </div>
  );
}
