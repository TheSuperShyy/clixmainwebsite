/**
 * /news — thin route shell.
 *
 * The page BODY lives in src/app/_routes/NewsRoute.tsx and is shared with /he/news.
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
import NewsRoute from "@/app/_routes/NewsRoute";

export const metadata: Metadata = {
  title: "Updates",
  description:
    "Daily AI news, tracked by Clix: models, business, security and policy.",
};

export const revalidate = 300;

export default function Page() {
  return <NewsRoute locale="en" />;
}
