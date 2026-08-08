"use client";

/**
 * AI-stock ticker for the announcement banner. Replaces the "Clix AI News / Coming soon"
 * text (2026-08-08, user: "put ai graph stocks here instead").
 *
 * Every number here is a real quote — see the standing note at the top of src/lib/quotes.ts.
 * There is no placeholder data path in this component on purpose: with no quotes it renders
 * `null` and the banner collapses, rather than showing a plausible-looking strip of numbers
 * that are not true.
 *
 * MARQUEE. Same technique as `LogoCarousel`, and for the same reason: eight items do not fit
 * a 390px phone, and the page already speaks this idiom. The cycle is MEASURED (item 0 to
 * item N) rather than assumed to be half the track, because the track has a `gap` — with 2N
 * items there are only 2N-1 gaps, so `xPercent: -50` is short by half a gap and the loop
 * visibly drifts. Under `prefers-reduced-motion` the tween is never built and the row simply
 * sits still, which is the honest fallback for a decorative scroll.
 *
 * REFRESH. Server-rendered from `page.tsx` so the first paint already has real numbers and
 * the banner does not pop in and shove the header down. After that it re-fetches
 * `/api/quotes` every 5 minutes, matching the server's own revalidate window.
 *
 * ACCESSIBILITY. The scrolling strip is `aria-hidden` and a visually-hidden list carries the
 * same quotes as static text, so a screen reader gets them once, in order, without the
 * duplicate pass the marquee needs. The sparklines are decoration — the number beside each
 * one says the same thing — so they are hidden too.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Quote } from "@/lib/quotes";

gsap.registerPlugin(useGSAP);

const GAP = 40; // px between ticker items
const SPEED_PX_PER_SEC = 40; // slower than the logo row's 50 — this one has to be readable
const REFRESH_MS = 5 * 60 * 1000;

/** Sparkline box. 30x14 reads as a trend at banner scale without becoming a chart. */
const SPARK_W = 30;
const SPARK_H = 14;

function Spark({ points, rising }: { points: number[]; rising: boolean }) {
  if (points.length < 2) return null;
  /* `spark` arrives normalised 0..1 from the server, so this is pure layout: x spreads
     evenly, y flips because SVG's origin is top-left while a rising price goes up. */
  const d = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * SPARK_W;
      const y = SPARK_H - v * SPARK_H;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      width={SPARK_W}
      height={SPARK_H}
      viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ flex: "none", display: "block", overflow: "visible" }}
    >
      <path
        d={d}
        stroke={rising ? "var(--color-quote-up)" : "var(--color-quote-down)"}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatPrice(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPct(n: number) {
  return `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(2)}%`;
}

/**
 * Row height. The banner measured 45px with the old text (14px on a 1.5em line box = 21px,
 * plus 12px padding each side) and the header's hide-on-scroll transform travels exactly
 * that far. Ticker items are 13px text beside a 14px sparkline, which lands at 19.5px and
 * shrinks the strip to 44 — so the line box is pinned back to 21px. Not cosmetic pedantry:
 * `bannerH` is what the transform uses, and it is the number recorded in the nav's spec.
 */
const ROW_H = 21;

function Item({ q }: { q: Quote }) {
  const rising = q.changePct >= 0;
  return (
    <li
      className="flex flex-none items-center gap-2 whitespace-nowrap"
      style={{ height: ROW_H }}
    >
      <span
        className="font-sans text-[13px] font-medium text-paper"
        style={{ letterSpacing: "0.02em" }}
      >
        {q.symbol}
      </span>
      <span className="font-sans text-[13px] text-paper/70">
        {formatPrice(q.price)}
      </span>
      <Spark points={q.spark} rising={rising} />
      <span
        className="font-sans text-[13px] font-medium"
        style={{ color: rising ? "var(--color-quote-up)" : "var(--color-quote-down)" }}
      >
        {formatPct(q.changePct)}
      </span>
    </li>
  );
}

/**
 * How many copies of the quote list the track holds.
 *
 * TWO IS NOT ENOUGH HERE, which is the difference between this and the logo marquee. The
 * tween slides the track left by exactly one cycle and then snaps back; for that to be
 * invisible, the track remaining to the right of the start point — `(passes - 1) × cycle` —
 * has to still cover the viewport at the moment it snaps. Eight quotes measure a 1573px
 * cycle, so two passes leave 1573px of cover against a 1600px viewport and the strip shows
 * a 27px hole at the right edge once per loop. Caught by measuring `cycle >= innerWidth`,
 * not by watching it.
 *
 * Three is the SSR default (covers up to 3146px), and the effect widens it further if the
 * viewport is bigger than that — a 4K panel at 1× is 3840 CSS px and would otherwise show
 * the same hole.
 */
const BASE_PASSES = 3;

export default function StockTicker({ initial }: { initial: Quote[] }) {
  const [quotes, setQuotes] = useState<Quote[]>(initial);
  const [passes, setPasses] = useState(BASE_PASSES);
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  /* Periodic refresh. Failures are swallowed deliberately: the strip keeps showing the last
     good quotes rather than blanking on one bad poll, and `asOf` in the label still says
     when they are from. */
  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const res = await fetch("/api/quotes");
        if (!res.ok) return;
        const json = await res.json();
        if (alive && Array.isArray(json.quotes) && json.quotes.length) {
          setQuotes(json.quotes);
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
      if (!ul || !quotes.length) return;

      const mm = gsap.matchMedia();
      let cancelled = false;

      const start = () => {
        if (cancelled) return;
        const items = ul.children;
        if (items.length < quotes.length + 1) return;
        const cycle =
          (items[quotes.length] as HTMLElement).offsetLeft -
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
         items are text, and text measured before the webfont swap gives a cycle that is
         wrong by the reflow delta — which the loop then repeats forever. */
      document.fonts.ready.then(start);

      return () => {
        cancelled = true;
        mm.revert();
      };
    },
    { scope: root, dependencies: [quotes, passes] },
  );

  /* Recheck on resize: dragging a window from a laptop screen to a 4K one changes how many
     copies the loop needs, and the effect above only samples the width when it runs. */
  useEffect(() => {
    const onResize = () => {
      const ul = track.current;
      if (!ul || !quotes.length) return;
      const items = ul.children;
      if (items.length < quotes.length + 1) return;
      const cycle =
        (items[quotes.length] as HTMLElement).offsetLeft -
        (items[0] as HTMLElement).offsetLeft;
      if (!cycle) return;
      setPasses(Math.max(BASE_PASSES, Math.ceil(window.innerWidth / cycle) + 1));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [quotes]);

  if (!quotes.length) return null;

  const asOf = quotes[0]?.asOf
    ? new Date(quotes[0].asOf * 1000).toISOString().slice(0, 16).replace("T", " ")
    : null;

  return (
    <div ref={root} className="relative flex w-full items-center overflow-hidden">
      {/* The readable copy, for assistive tech only — the marquee below is decoration by the
          time you cannot see it move. */}
      <p className="sr-only">
        AI market quotes{asOf ? `, as of ${asOf} UTC` : ""}:{" "}
        {quotes
          .map((q) => `${q.symbol} ${formatPrice(q.price)}, ${formatPct(q.changePct)}`)
          .join("; ")}
      </p>

      <div
        aria-hidden="true"
        className="relative w-full overflow-hidden"
        style={{
          /* Fade both ends so items enter and leave instead of being chopped by the edge.
             Same 12.5% stops as the logo row, so the two strips behave identically. */
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 6%, rgba(0,0,0,1) 94%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 6%, rgba(0,0,0,1) 94%, rgba(0,0,0,0) 100%)",
        }}
      >
        <ul
          ref={track}
          /* w-max + flex-none: the track must lay out at its full doubled width and overflow
             the clip. If it shrank to fit, the measured cycle would be wrong and the loop
             would tear. */
          className="relative flex w-max flex-none list-none items-center"
          style={{ gap: `${GAP}px`, margin: 0, padding: 0 }}
        >
          {Array.from({ length: passes }, (_, pass) =>
            quotes.map((q) => <Item key={`${pass}-${q.symbol}`} q={q} />),
          )}
        </ul>
      </div>
    </div>
  );
}
