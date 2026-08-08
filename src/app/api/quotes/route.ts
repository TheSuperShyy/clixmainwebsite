/**
 * GET /api/quotes — the same payload `page.tsx` renders with, re-served so the client
 * ticker can refresh without a full page load.
 *
 * WHY THIS EXISTS AT ALL. Yahoo sends no `access-control-allow-origin`, so the browser
 * cannot call it directly; the fetch has to happen on our origin. This route is that hop and
 * nothing more — it adds no logic the server render does not already do.
 *
 * ⚠️ DEPLOYMENT NOTE. This is the first route handler in the project. The site was fully
 * prerendered before it; it now needs a Node runtime for this one path (every page stays
 * static). That rules out a pure `output: "export"` static export, which the project does
 * not use. On Vercel this is a serverless function and needs no configuration.
 *
 * The upstream fetch inside `fetchQuotes` carries `next: { revalidate: 300 }`, so the cache
 * is shared across visitors: a thousand people hitting the page in five minutes produce one
 * set of upstream calls, not a thousand. `s-maxage` mirrors that at the CDN edge.
 */

import { NextResponse } from "next/server";
import { fetchQuotes, REVALIDATE_SECONDS } from "@/lib/quotes";

/* Literal, not `REVALIDATE_SECONDS` — Next statically analyses segment configs at build
   time and rejects an imported binding. Kept in step with src/lib/quotes.ts by hand. */
export const revalidate = 300;

export async function GET() {
  const quotes = await fetchQuotes();

  return NextResponse.json(
    { quotes },
    {
      headers: {
        /* `stale-while-revalidate` so a refresh that lands just past the window gets the
           previous payload immediately rather than waiting on Yahoo. */
        "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 2}`,
      },
    },
  );
}
