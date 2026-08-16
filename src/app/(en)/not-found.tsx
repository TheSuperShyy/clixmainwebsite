/**
 * /404 (English) — thin route shell. Answers every unmatched BARE path: `/services`,
 * `/terms`, `/anything-at-all`.
 *
 * The page BODY lives in src/app/_routes/NotFoundRoute.tsx and is shared with /he. Only the
 * locale literal and `metadata` belong here, exactly as in every page.tsx shell.
 *
 * ⚠️ NO `revalidate` EXPORT, unlike the page shells beside it. A not-found file is not a route
 * segment with its own config; the number would be inert. `NotFoundRoute` still calls
 * `fetchModels()`, whose own caching lives in src/lib/models.ts.
 *
 * ⚠️ NEVER MOVE THIS TO `src/app/not-found.tsx`. With no root layout at `src/app/`, Next stops
 * injecting its built-in layout for `/_not-found` the moment a custom one exists there, and
 * the build exits 1 with "doesn't have a root layout". See the note in (en)/layout.tsx.
 *
 * ⚠️ Do NOT call getLocale() from `metadata` — the standing rule. This file knows it is English.
 */

import type { Metadata } from "next";
import NotFoundRoute from "@/app/_routes/NotFoundRoute";

export const metadata: Metadata = {
  title: "Page not found",
  /* A 404 already carries `noindex` semantics through its status code, so this is belt and
     braces rather than a content guard like the ones on /product and /company. It costs
     nothing and it makes the intent explicit to anything reading the tag instead of the
     status. */
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundRoute locale="en" />;
}
