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
 * ⚠️ THE ±% AND THE TREND LINE ARE STILL GONE, and it is still not an oversight. Both need a
 * time series per row, and there is no such thing for a list price: a model costs what it
 * costs until the lab changes it. Drawing a trend line under a flat number, or a "+1.2%"
 * against a baseline that was never recorded, would be exactly the invented-figure failure
 * the data layer exists to prevent.
 *
 * WHAT CAME BACK INTO THAT SLOT (2026-08-13, user: *"add a small graph beside the token price
 * if they are up or down, green if up red if down"*). The request was for the stock-ticker
 * signal; the honest half of it is buildable and the other half is not, so this is the half —
 * taken back to the user before it was built rather than after, with the constraint stated.
 * `PriceRank` plots the strip's OWN nine prices, sorted cheap-to-dear, and lights this row's
 * column. Every pixel of it is a live figure already on the page; there is no second data
 * source, no baseline, and nothing retained between polls. It answers "where does this one sit
 * in the field", which is a real question with a real answer, instead of "which way did it
 * move", which has neither.
 *
 * ⚠️ GREEN IS THE CHEAP END, WHICH IS THE OPPOSITE OF A STOCK TICKER (2026-08-13, user's call
 * when asked). On an equity green means the number went up; on a price sheet a number going up
 * is bad news for whoever is reading it. The tokens carry the inversion in their names —
 * `--color-price-low` / `--color-price-high`, not `up` / `down` — precisely so a later call
 * site cannot pick the wrong one by reaching for the familiar word.
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

import { useEffect, useMemo, useRef, useState } from "react";
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
/* 24, down from 40 (2026-08-19, user: the moving strips "make us dizzy"). Still slower than
   the logo row's 30, because this one has to be readable, not just recognisable. */
const SPEED_PX_PER_SEC = 24;
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
 * WHERE EACH MODEL SITS IN THE FIELD — the whole of the chart's data layer.
 *
 * THE SCALAR IS `input + output`, i.e. what a million tokens in plus a million out costs. Both
 * prices are already on the row and this adds them; it is the only summary of the pair that
 * carries NO invented weighting. The obvious alternative — a blend weighted to some assumed
 * input:output ratio — would be us asserting a usage pattern we have not measured, on a strip
 * whose entire premise is that it asserts nothing.
 *
 * ⚠️ THE SCALE IS LOGARITHMIC, AND IT WAS MEASURED, NOT PREFERRED. The 2026-08-13 poll came
 * back $0.90 (Llama 4 Maverick) to $35.00 (GPT-5.6 Sol) — a 39.1x spread — and the two scales
 * were computed side by side against it before this one was picked:
 *
 *     $0.90  $2.00  $3.50  $8.00  $8.00  $9.00  $18.00  $30.00  $35.00
 *  log  2.0    4.2    5.7    8.0    8.0    8.3    10.2    11.6    12.0  px
 *  lin  2.0    2.3    2.8    4.1    4.1    4.4     7.0    10.5    12.0  px
 *
 * Linearly the six cheapest models span 2.4px of the twelve available and the chart reads as
 * two tall bars beside seven identical stubs — it would say only that GPT and Opus are
 * expensive, which the price beside it already says. Log spacing is what makes $0.90 against
 * $3.50 a visible difference at this size.
 *
 * The median came back $8.00 with a tie ON it, so `<=` rather than `<` is load-bearing: five
 * columns read green and four red, where `<` would have called the median itself dear.
 *
 * `total <= 0` is a FREE model, which OpenRouter does list (`:free` variants). It is excluded
 * from the min/max so one of them cannot drag `Math.log` to -Infinity and flatten every other
 * column, and it plots at the floor, which is where a free model belongs.
 */
type Field = {
  /** This model's rank in the set, cheapest first, zero-based. Carried for the sr-only text. */
  rank: number;
  /** At or below the set's median. Sets the walk's drift — see `PriceRank`. */
  low: boolean;
  /** Seeds the candle walk, derived from this model's own prices. See `PriceRank`. */
  seed: number;
};

function buildField(models: ModelPrice[]): Map<string, Field> {
  const out = new Map<string, Field>();
  /* One model is not a field — there is nothing to be cheap relative to, and a lone column is
     a chart of itself. The caller renders no chart at all in that case. */
  if (models.length < 2) return out;

  const totals = models.map((m) => ({
    id: m.id,
    total: m.inputPerM + m.outputPerM,
    /* Seeded from the model's OWN figures rather than from a counter, so a chart is a property
       of the model and not of its position in the list: reorder `MODEL_IDS` and every row keeps
       the shape it had.

       ⚠️ IT MUST STAY A PURE FUNCTION OF THE DATA. `Math.random()` here would give the server
       and the client different candles and React would report a hydration mismatch on every
       visit — and a chart that reshuffled on refresh would advertise itself as noise. */
    seed:
      Math.round(m.inputPerM * 1000) * 7919 +
      Math.round(m.outputPerM * 1000) * 104729 +
      m.context,
  }));
  const paid = totals.filter((t) => t.total > 0).map((t) => t.total);
  if (!paid.length) return out;

  const sorted = [...totals].sort((a, b) => a.total - b.total);
  const mid = sorted.length / 2;
  const median =
    sorted.length % 2
      ? sorted[Math.floor(mid)].total
      : (sorted[mid - 1].total + sorted[mid].total) / 2;

  sorted.forEach((t, rank) => {
    out.set(t.id, { rank, low: t.total <= median, seed: t.seed });
  });
  return out;
}

/* 20 candles on a 3px pitch — 2px body, 1px gutter, 0.75px wick — so the row measures 59px
   and stands 20px tall. The height is the ceiling rather than a choice: `ROW_H` is 21px and it
   is PINNED, because the banner measures 45px (21px line box + 12px padding each side) and the
   header's hide-on-scroll transform travels exactly that far. A taller chart grows the banner
   and moves the header with it. 20 takes all of it bar the 1px that stops the svg becoming the
   line box. */
const CANDLES = 20;
const PITCH = 3;
const BODY_W = 2;
const WICK_W = 0.75;
const CHART_H = 20;
const CHART_W = CANDLES * PITCH - (PITCH - BODY_W);
/* Shortest a body may draw. A doji — open equal to close — is a zero-height rect and vanishes;
   real candle charts draw it as a rule, so this does too. */
const MIN_BODY = 0.75;

/**
 * ⚠️⚠️ THESE CANDLES ARE DECORATION. THE NUMBERS BESIDE THEM ARE NOT. ⚠️⚠️
 *
 * READ THIS BEFORE TOUCHING ANYTHING IN THIS FUNCTION.
 *
 * There is no price history behind this chart and there cannot be. `/api/v1/models` returns
 * what a model costs right now and nothing else; there is no history endpoint, this site has
 * no database, and a list price has no time series in any case — it is a constant until the lab
 * changes it. A candlestick asserts four observations per period (open, high, low, close) over
 * some fifty periods. None of those observations exist. **Every candle here is generated.**
 *
 * IT SHIPPED THAT WAY ON AN EXPLICIT DECISION, NOT BY DRIFT. The constraint was put to the user
 * three times across 2026-08-13 — first as a choice of three options before anything was built,
 * again when the zigzag line went in, and again when the candlestick reference arrived — and
 * the answer was *"you can just invent graph, no need to be faithful to the data"*. That is
 * theirs to make and it is made. What follows is the boundary that keeps it from spreading.
 *
 * ⚠️ THE RULE, AND IT IS NOT NEGOTIABLE: NOTHING MAY EVER BE ANNOTATED ONTO THIS CHART. No axis,
 * no tick, no gridline, no tooltip, no hover readout, no "+2.4%", no date, no legend, no
 * caption. The instant a NUMBER is attached to one of these candles it stops being ornament and
 * becomes a fabricated figure sitting beside real vendor pricing — which is the exact failure
 * the standing note at the top of `src/lib/models.ts` exists to prevent, and which took the old
 * stock sparkline off this strip on 2026-08-08. Shape is decoration. A number is a claim.
 *
 * ⚠️ AND THE PRICES STAY REAL. `$5 → $30 /M` beside this chart is live vendor list pricing and
 * the whole data layer is built to keep it that way. Do not "simplify" by generating those too,
 * and do not read this function as permission to.
 *
 * ---------------------------------------------------------------------------------------
 *
 * WHAT IT ACTUALLY DRAWS. A seeded random walk, 20 candles, wicks and bodies, green when the
 * candle closed up and red when it closed down — the stock convention, because that is what the
 * shape is quoting.
 *
 * TWO THINGS ARE STILL TIED TO THE DATA, and they are worth keeping because they cost nothing:
 *
 *   · THE SEED is the model's own prices, so each row draws its own distinctive chart, the same
 *     one on every render and every reload (2026-08-13, user: *"why all has the same design or
 *     graph, add some randomness"*). It must stay a pure function — see `buildField`.
 *   · THE DRIFT follows the row's verdict. A model at or below the strip's median trends UP
 *     across the twenty candles and a dearer one trends DOWN, so a green-heavy chart still
 *     means "cheap for this field" the way the very first version of this slot did. It is a
 *     tendency rather than a reading, which is all a decorative chart can carry.
 *
 * NORMALISED TO ITS OWN RANGE after the walk, so every chart fills the 20px box regardless of
 * how far that particular walk wandered. Without it a low-volatility seed draws a flat line in
 * the middle of an empty rectangle.
 *
 * NOT MIRRORED IN RTL. A generated shape has no reading direction to mirror, and the price
 * expression beside it is already pinned to an LTR isolate (see `Item`), so the pair stays a
 * single unit in both locales.
 *
 * `aria-hidden`, and unlike every previous version of this slot that is now the ONLY correct
 * value — there is nothing here to describe. The sr-only sentence carries the model's real
 * rank in the field, which comes from `buildField` and not from anything drawn here.
 */

/* Deterministic 32-bit LCG (glibc's constants). `Math.random()` cannot be used — see the seed
   note in `buildField` — and this needs no statistical quality, only repeatability. */
function walker(seed: number) {
  let s = Math.abs(Math.trunc(seed)) % 2147483647 || 1;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

/* The walk lives OUTSIDE the component on purpose. Each candle opens where the last one closed,
   so the loop has to carry a running value — and doing that with a `let` in the component body
   trips `react-hooks/immutability` ("cannot reassign after render completes"), which is a fair
   catch even though this particular variable never escapes the render. In its own function the
   carry is an ordinary local and the component stays a pure function of `field`. */
function buildWalk(seed: number, low: boolean) {
  const rand = walker(seed);
  /* Per-candle move and wick length, as a fraction of the walk's own units. Tuned against the
     reference: bodies that mostly overlap their neighbours, wicks about half a body again, and
     enough drift that twenty candles clearly go somewhere. */
  const drift = (low ? 1 : -1) * 0.055;
  const out = [];
  let last = 0;
  for (let i = 0; i < CANDLES; i++) {
    const open = last;
    const close = open + drift + (rand() - 0.5) * 0.28;
    out.push({
      open,
      close,
      high: Math.max(open, close) + rand() * 0.11,
      low: Math.min(open, close) - rand() * 0.11,
    });
    last = close;
  }
  return out;
}

function PriceRank({ field }: { field: Field }) {
  const candles = buildWalk(field.seed, field.low);

  /* Fit the whole walk to the box. Extremes come off the wicks, not the bodies, or the tips
     clip. */
  const top = Math.max(...candles.map((c) => c.high));
  const bottom = Math.min(...candles.map((c) => c.low));
  const range = top - bottom || 1;
  const y = (v: number) => ((top - v) / range) * CHART_H;

  return (
    <svg
      width={CHART_W}
      height={CHART_H}
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      className="flex-none"
      aria-hidden="true"
    >
      {candles.map((c, i) => {
        const x = i * PITCH;
        const up = c.close >= c.open;
        const tone = up ? "fill-price-low" : "fill-price-high";
        const bodyTop = y(Math.max(c.open, c.close));
        const bodyH = Math.max(MIN_BODY, y(Math.min(c.open, c.close)) - bodyTop);
        return (
          <g key={i} className={tone}>
            {/* Wick behind the body, so the body's corners stay square over it. */}
            <rect
              x={x + (BODY_W - WICK_W) / 2}
              y={y(c.high)}
              width={WICK_W}
              height={Math.max(MIN_BODY, y(c.low) - y(c.high))}
            />
            <rect x={x} y={bodyTop} width={BODY_W} height={bodyH} />
          </g>
        );
      })}
    </svg>
  );
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
function Item({ m, field }: { m: ModelPrice; field?: Field }) {
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
      {/* Absent rather than empty when there is no field to plot — a one-model strip, or a
          shape change upstream that leaves every price at zero. See `buildField`. */}
      {field && <PriceRank field={field} />}
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
  /* Memoised because the track renders `passes x models.length` items — three to five copies
     of the same nine rows — and every one of them would otherwise rebuild the identical map.
     The field is a property of the SET, so it is computed once here rather than inside `Item`;
     a row cannot know where it sits without seeing the other eight. */
  const fields = useMemo(() => buildField(models), [models]);
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
                : "") +
              /* The chart is `aria-hidden`, so this clause IS the chart for anyone not looking
                 at it. `rank + 1` because `Field.rank` is a zero-based column index and "the
                 0th cheapest" is not a thing anyone says. */
              (fields.has(m.id)
                ? interpolate(a11y.tickerRank, {
                    rank: String((fields.get(m.id)?.rank ?? 0) + 1),
                    total: String(models.length),
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
            models.map((m) => (
              <Item key={`${pass}-${m.id}`} m={m} field={fields.get(m.id)} />
            )),
          )}
        </ul>
      </div>
    </div>
  );
}
