/**
 * /he/clix — thin route shell.
 *
 * The page BODY lives in src/app/_routes/ClixRoute.tsx and is shared with /clix.
 * Only three things belong in a shell: the locale literal, `metadata`, and `revalidate`.
 *
 * ⚠️ `metadata` and `revalidate` are declared HERE and never re-exported from _routes/.
 * `revalidate` must be a literal — Next statically analyses segment configs at build time and
 * rejects an imported binding ("Invalid segment configuration export detected"), so it cannot
 * be `REVALIDATE_SECONDS` even though src/lib/models.ts is where that number is defined. Keep
 * them in step by hand.
 *
 * ⚠️ Do NOT call getLocale() from `metadata`. Metadata resolution is a separate pass with no
 * guarantee of sharing the render's cache scope. This file knows its locale as a literal.
 */

import type { Metadata } from "next";
import ClixRoute from "@/app/_routes/ClixRoute";

export const metadata: Metadata = {
  title: "להכיר את Clix",
  /* Copied verbatim from the English twin, and it MUST be. Every one of the four
     gate items on this route is a CONTENT guard, and translating the content clears
     none of them — see the route header in _routes/ClixRoute.tsx. */
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ClixRoute locale="he" />;
}
