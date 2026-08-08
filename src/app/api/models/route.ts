/**
 * GET /api/models — the same payload `page.tsx` renders with, re-served so the client ticker
 * can refresh without a full page load.
 *
 * WHY THIS STILL EXISTS. The stock version needed it: Yahoo sent no
 * `access-control-allow-origin`, so the browser could not call upstream at all and this route
 * was the only hop available. OpenRouter does send CORS headers, so that argument is gone —
 * the route is kept for the two reasons that remain. One cached server fetch serves every
 * visitor instead of every browser pulling 650 KB of catalogue JSON for nine rows, and the
 * provider stays swappable behind `src/lib/models.ts` without the client knowing.
 *
 * ⚠️ DEPLOYMENT NOTE. This is the only route handler in the project. Every page stays
 * static; this one path needs a Node runtime, which rules out a pure `output: "export"`
 * static export (the project does not use one). On Vercel it is a serverless function and
 * needs no configuration.
 *
 * The upstream fetch inside `fetchModels` carries `next: { revalidate: 300 }`, so the cache
 * is shared across visitors. `s-maxage` mirrors that at the CDN edge.
 */

import { NextResponse } from "next/server";
import { fetchModels, REVALIDATE_SECONDS } from "@/lib/models";

/* Literal, not `REVALIDATE_SECONDS` — Next statically analyses segment configs at build time
   and rejects an imported binding. Kept in step with src/lib/models.ts by hand. */
export const revalidate = 300;

export async function GET() {
  const models = await fetchModels();

  return NextResponse.json(
    { models },
    {
      headers: {
        /* `stale-while-revalidate` so a refresh that lands just past the window gets the
           previous payload immediately rather than waiting on the provider. */
        "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 2}`,
      },
    },
  );
}
