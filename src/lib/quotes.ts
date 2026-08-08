/**
 * Live market quotes for the announcement banner's AI-stock ticker.
 *
 * Added 2026-08-08 (user: "put ai graph stocks here instead", then chose "Live ticker, real
 * quotes" over a decorative graph and over hard-coded numbers).
 *
 * ---------------------------------------------------------------------------------
 * THE NUMBERS ON THIS SITE ARE REAL. That was the whole point of the choice, and it is the
 * reason this file exists rather than a `const QUOTES = [...]` in the component. If this
 * ever falls back to fabricated figures, it stops being a ticker and becomes the same
 * category of claim as the compliance badges and the executive quotes that came off this
 * page on 2026-08-05. Do not "fix" an outage by inventing prices — render nothing instead,
 * which is what `fetchQuotes()` does on failure.
 * ---------------------------------------------------------------------------------
 *
 * PROVIDER. Probed five sources before picking (2026-08-08):
 *
 *   Stooq CSV                404  — the documented CSV path no longer resolves
 *   Yahoo v7 /quote          401  — now gated, "User is unable to access this feature"
 *   Yahoo v8 /chart          200  — works, no key, and returns an intraday series   <- used
 *   Finnhub                  401  — needs a key
 *   Twelve Data              401  — needs a key
 *
 * So this needs NO API KEY and NO signup, which is better than the option the user accepted.
 * Two caveats they were told about, both real:
 *
 *   1. v8 /chart is UNDOCUMENTED. Yahoo has already closed v7; it can close this one without
 *      notice, and when it does the banner goes empty rather than wrong (see below).
 *   2. Yahoo's terms do not licence redistribution of their market data on a commercial site.
 *      For a business page the contractually clean answer is a paid-tier or free-tier key
 *      from a provider that licences it — Twelve Data and Finnhub both do.
 *
 * Swapping providers is deliberately one function: write another `load…` with the same
 * `Promise<Quote[]>` shape and change `loadQuotes` below. Only the Yahoo path is implemented,
 * because it is the only one that can be verified from here — shipping an untested keyed
 * path would be worse than documenting where it goes.
 *
 * No CORS header comes back from Yahoo, so this must run server-side. It does: `page.tsx`
 * awaits it at render, and `/api/quotes` re-serves it for the client's periodic refresh.
 */

/** AI-exposed names. Order is render order. */
export const SYMBOLS = [
  "NVDA",
  "MSFT",
  "GOOGL",
  "AMZN",
  "META",
  "AVGO",
  "AMD",
  "PLTR",
] as const;

export type Quote = {
  symbol: string;
  price: number;
  /** Percent change against the previous session's close. Signed. */
  changePct: number;
  currency: string;
  /** Intraday closes, downsampled and normalised to 0..1 for the sparkline. */
  spark: number[];
  /** Epoch seconds of the last trade the provider reported. */
  asOf: number;
};

/** How long a fetched quote is reused before the next visitor triggers a refresh. */
export const REVALIDATE_SECONDS = 300;

/** Points kept per sparkline. 79 come back for a 5m/1d series; 32 is plenty at 30px wide. */
const SPARK_POINTS = 32;

/**
 * The minimum price band a sparkline is drawn against, as a fraction of the previous close.
 * See `toSpark` — this is the number that stops a flat stock from looking dramatic.
 */
const SPARK_MIN_BAND = 0.01; // 1% of price

/**
 * Downsample to at most `SPARK_POINTS`, then normalise to 0..1 for the SVG. Doing it
 * server-side keeps the payload small and lets the sparkline be a dumb polyline.
 *
 * Scale is per-series (each line uses its own range), which is the ticker convention: the
 * sparkline shows the day's PATH, the percentage beside it shows the close-to-close CHANGE.
 * Two different facts, and they can disagree — MSFT on 2026-08-07 closed +0.03% having
 * swung 498.95–504.66, a real 1.14% intraday range. A tall line there is not exaggeration.
 *
 * The one case per-series scaling does misrepresent is a series that barely moved at all:
 * stretched to fill the box, 0.1% of drift would draw like a crash. Hence the floor — the
 * band is `max(actual range, 1% of price)`, centred on the series midpoint, so a genuinely
 * flat stock draws a nearly flat line while a real mover still fills the box.
 *
 * Measured on live data before keeping this: intraday ranges ran 1.08% (GOOGL) to 5.20%
 * (PLTR), so **the floor does not bind on a normal trading day** and changes nothing. It is
 * a guard for thin trading, holidays and halted names, not an everyday correction. Clamped
 * 0..1 so an outlier cannot escape the 14px box.
 */
function toSpark(closes: number[], prevClose: number): number[] {
  const clean = closes.filter((v): v is number => typeof v === "number" && isFinite(v));
  if (clean.length < 2) return [];
  const step = Math.max(1, Math.floor(clean.length / SPARK_POINTS));
  const sampled = clean.filter((_, i) => i % step === 0);
  if (sampled.at(-1) !== clean.at(-1)) sampled.push(clean.at(-1)!);

  const lo = Math.min(...sampled);
  const hi = Math.max(...sampled);
  const mid = (hi + lo) / 2;
  const floor = Math.abs(prevClose) * SPARK_MIN_BAND;
  const span = Math.max(hi - lo, floor);
  if (span === 0) return sampled.map(() => 0.5);

  return sampled.map((v) => {
    const t = 0.5 + (v - mid) / span;
    return Math.min(1, Math.max(0, t));
  });
}

async function loadFromYahoo(symbol: string): Promise<Quote | null> {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?range=1d&interval=5m`;
  const res = await fetch(url, {
    headers: {
      /* Yahoo 404s a bare fetch with no UA. Not evasion — it is the same request a browser
         on the chart page makes. */
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
    },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;

  const json = await res.json();
  const result = json?.chart?.result?.[0];
  const meta = result?.meta;
  if (!meta) return null;

  const price = meta.regularMarketPrice;
  const prev = meta.chartPreviousClose ?? meta.previousClose;
  if (typeof price !== "number" || typeof prev !== "number" || prev === 0) return null;

  return {
    symbol,
    price,
    changePct: ((price - prev) / prev) * 100,
    currency: meta.currency ?? "USD",
    spark: toSpark(result?.indicators?.quote?.[0]?.close ?? [], prev),
    asOf: meta.regularMarketTime ?? 0,
  };
}

/** The single seam a different provider plugs into. */
const loadQuotes = loadFromYahoo;

/**
 * Every symbol, in `SYMBOLS` order, skipping any that failed.
 *
 * Returns `[]` rather than throwing when the provider is down or has changed shape. The
 * banner treats an empty array as "render no strip at all", so an outage costs the page a
 * 45px band and nothing else — it never shows a stale-looking or invented number.
 */
export async function fetchQuotes(): Promise<Quote[]> {
  const settled = await Promise.allSettled(SYMBOLS.map((s) => loadQuotes(s)));
  return settled
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter((q): q is Quote => q !== null);
}
