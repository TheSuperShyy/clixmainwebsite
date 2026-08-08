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
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ModelPrice } from "@/lib/models";

gsap.registerPlugin(useGSAP);

const GAP = 40; // px between ticker items
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
 * far. Items are 13px text, which lands at 19.5px and shrinks the strip to 44 — so the line
 * box is pinned back to 21px. Not cosmetic pedantry: `bannerH` is what the transform uses, and
 * it is the number recorded in the nav's spec.
 *
 * This mattered more in the stock version, where a 14px sparkline was the tallest child. It is
 * kept because the arithmetic above is unchanged, not out of inheritance.
 */
const ROW_H = 21;

function Item({ m }: { m: ModelPrice }) {
  const ctx = formatContext(m.context);
  return (
    <li
      className="flex flex-none items-center gap-2 whitespace-nowrap"
      style={{ height: ROW_H }}
    >
      {/* Lab and model share ONE span, separated by a plain space rather than by the flex
          `gap`. The gap is 8px and sits between every other field, so putting the lab in its
          own flex child would space "Anthropic" as far from "Claude Opus 5" as the price is
          from the context — three loose fields instead of a named thing and its maker. A
          space is ~4px, which reads as one unit. (2026-08-08, user asked for the lab to show:
          "i want it to be LLM not stocks of the company like anthropic, GEMINI, OPENAI".) */}
      <span
        className="font-sans text-[13px] font-medium text-paper"
        style={{ letterSpacing: "0.02em" }}
      >
        {m.lab && <span className="font-normal text-paper/70">{m.lab} </span>}
        {m.name}
      </span>
      {/* `in`/`out` are spelled out rather than shown as "$5 / $25". The two prices differ by
          5x on some models and by nothing on others, so an unlabelled pair is genuinely
          ambiguous — and the input price alone is the one people misread as the whole cost. */}
      <span className="font-sans text-[13px] text-paper/70">
        in {formatUsd(m.inputPerM)} · out {formatUsd(m.outputPerM)} /M
      </span>
      {/* 50% and not lower: white at 45% over the banner's #211e1e computes to 4.40:1, which
          misses AA for 13px body text. 50% is 5.10:1 and still reads as the third tier. */}
      {ctx && <span className="font-sans text-[13px] text-paper/50">{ctx} ctx</span>}
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
        const cycle =
          (items[models.length] as HTMLElement).offsetLeft -
          (items[0] as HTMLElement).offsetLeft;
        if (!cycle) return;

        /* Widen the track if this viewport is wider than the copies behind the start point.
           Bails out by returning: the state change re-runs this effect with the new count,
           and the tween is built on that pass instead of on a track about to change width. */
        const needed = Math.max(BASE_PASSES, Math.ceil(window.innerWidth / cycle) + 1);
        if (needed !== passes) {
          setPasses(needed);
          return;
        }

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.set(ul, { x: 0 });
          gsap.to(ul, {
            x: -cycle,
            duration: cycle / SPEED_PX_PER_SEC,
            ease: "none",
            repeat: -1,
          });
        });
      };

      /* Same font-load gate as the logo marquee, and load-bearing for the same reason: these
         items are text, and text measured before the webfont swap gives a cycle that is wrong
         by the reflow delta — which the loop then repeats forever. */
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
      const cycle =
        (items[models.length] as HTMLElement).offsetLeft -
        (items[0] as HTMLElement).offsetLeft;
      if (!cycle) return;
      setPasses(Math.max(BASE_PASSES, Math.ceil(window.innerWidth / cycle) + 1));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [models]);

  if (!models.length) return null;

  return (
    <div ref={root} className="relative flex w-full items-center overflow-hidden">
      {/* The readable copy, for assistive tech only — the marquee below is decoration by the
          time you cannot see it move. */}
      <p className="sr-only">
        Frontier model pricing, US dollars per million tokens:{" "}
        {models
          .map(
            (m) =>
              `${m.lab ? `${m.lab} ` : ""}${m.name}, ` +
              `${formatUsd(m.inputPerM)} input and ${formatUsd(m.outputPerM)} output` +
              (m.context ? `, ${formatContext(m.context)} context` : ""),
          )
          .join("; ")}
      </p>

      <div
        aria-hidden="true"
        className="relative w-full overflow-hidden"
        style={{
          /* Fade both ends so items enter and leave instead of being chopped by the edge.
             Same stops as the logo row, so the two strips behave identically. */
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
