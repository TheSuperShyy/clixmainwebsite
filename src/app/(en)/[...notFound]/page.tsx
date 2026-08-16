/**
 * THE ENGLISH CATCH-ALL. Matches any bare path no real route claimed, and immediately hands
 * off to `(en)/not-found.tsx`.
 *
 * ⚠️ WHY THIS FILE HAS TO EXIST, because it looks redundant beside a not-found.tsx and is not.
 * Added 2026-08-16, after the not-found files alone were built, shipped, and observed NOT to
 * work.
 *
 * A `not-found.tsx` is an ERROR BOUNDARY for its own segment, not a route. It renders when
 * something below it calls `notFound()`. The one file that additionally catches every
 * unmatched URL in the application is the ROOT `app/not-found.tsx` — and this app cannot have
 * one, because there is no root layout at `src/app/` for it to render inside (see the note in
 * (en)/layout.tsx: adding it exits the build 1). So with the boundaries alone, `/services`
 * matched no route, reached no boundary, and fell all the way through to Next's built-in 404 —
 * unstyled, unlocalised, and exactly what we were replacing. Verified by curl, not assumed.
 *
 * A catch-all page turns "no route matched" into "a route matched and called `notFound()`",
 * which IS a boundary hit. That is the whole trick, and it is what makes a per-locale 404
 * possible in an app with two root layouts and no root one.
 *
 * ⚠️ THIS DOES NOT SHADOW THE REAL ROUTES. Next resolves static segments before dynamic ones,
 * so `/product` still reaches (en)/product/page.tsx and only genuinely unclaimed paths land
 * here. `/he/*` is likewise claimed by `he/[...notFound]`, whose static `he` prefix is more
 * specific than this catch-all's first slug. Route handlers (`/api/contact`) and metadata
 * routes (`/icon.png`) are resolved ahead of the page tree entirely. All three were checked.
 *
 * The param is never read — the URL is already in the address bar, and echoing an
 * attacker-supplied path back into the page is how a 404 becomes an XSS vector.
 */

import { notFound } from "next/navigation";

export default function CatchAll(): never {
  notFound();
}
