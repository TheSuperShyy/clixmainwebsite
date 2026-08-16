/**
 * /he/404 — thin route shell. Answers every unmatched path UNDER `/he`: `/he/services`,
 * `/he/terms`, `/he/anything-at-all`.
 *
 * The page BODY lives in src/app/_routes/NotFoundRoute.tsx and is shared with the English
 * twin. Only the locale literal and `metadata` belong here.
 *
 * THIS FILE IS THE REASON THE 404 IS PER-LOCALE RATHER THAN GLOBAL. A single root not-found
 * would render `dir="ltr"` English chrome for a reader who was on a Hebrew page a click ago;
 * because this one sits inside the `he/` segment it renders below src/app/he/layout.tsx and
 * inherits `lang="he" dir="rtl"` and the Hebrew dictionary with no work of its own.
 *
 * ⚠️ NO `revalidate`, and never `getLocale()` in `metadata` — same two rules as the English
 * shell; read its header for why.
 */

import type { Metadata } from "next";
import NotFoundRoute from "@/app/_routes/NotFoundRoute";

export const metadata: Metadata = {
  /* "Page not found". Translated rather than copied — unlike the content-guarded routes,
     where the English `robots` note explains why the title must NOT diverge, there is no
     guard here and a tab title is exactly the kind of string a locale should own. */
  title: "העמוד לא נמצא",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundRoute locale="he" />;
}
