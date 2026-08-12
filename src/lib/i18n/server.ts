/**
 * The SERVER seam. How a server component learns its locale without being handed a prop.
 *
 * WHY THIS EXISTS AT ALL. 34 of this repo's 57 component files are server components, and they
 * include `Footer.tsx` (rendered by all 7 routes), `Hero.tsx`, `Security.tsx`, `WhyRogo.tsx`,
 * `ByTheNumbers.tsx` and most of /product, /company and /security. A React context cannot reach
 * any of them. The two alternatives were:
 *
 *   · prop-drill `locale` — ~25 explicit `locale={locale}` props for a value that is CONSTANT
 *     per route, with `Footer` alone needing the same edit in 7 files owned by 7 different
 *     agents. A guaranteed reconciliation cost for nothing.
 *   · convert them to client components — which would ship this site's entire body as client
 *     JS to win a value the route already knows at build time.
 *
 * So: a `cache()`-scoped request store, seeded at the top of the render. This is the same
 * mechanism `next-intl`'s `setRequestLocale` uses, and it is sound here because a layout
 * function body runs to completion BEFORE React renders the `children` element it returned.
 *
 * THREE DELIBERATE SAFETY PROPERTIES:
 *
 *  1. NO DEFAULT. The store starts `null` and `getLocale()` THROWS. A read that happens before
 *     the seed is a build failure at prerender time — not a Hebrew page that quietly renders in
 *     English, which is the failure mode that would actually ship.
 *  2. DOUBLE-SEEDED. `seedLocale()` is called in the root layout AND as the first statement of
 *     every `src/app/_routes/*Route.tsx` body. The route body is the direct parent of every
 *     section, so the mechanism is order-independent with respect to layouts. One line × 8
 *     files, and it removes a whole class of ordering bug.
 *  3. NEVER CALL THIS FROM `metadata` OR `generateMetadata`. Metadata resolution is a separate
 *     pass and is not guaranteed to share the render's cache scope. Every page file knows its
 *     own locale as a compile-time literal, so this costs nothing to obey.
 */

import { cache } from "react";
import {
  DIRECTION,
  dirSign as dirSignFor,
  type Direction,
  type Locale,
} from "./config";
import { DICTIONARIES, type Dict } from "./dictionary";

/* `cache()` gives one object per request (and one per prerender), which is exactly the scope a
   locale belongs to. A module-level `let` would be shared across concurrent requests. */
const store = cache((): { locale: Locale | null } => ({ locale: null }));

export function seedLocale(locale: Locale): void {
  store().locale = locale;
}

export function getLocale(): Locale {
  const locale = store().locale;
  if (!locale) {
    throw new Error(
      "i18n: getLocale() ran before the locale was seeded. A server component that reads the " +
        "dictionary must render below a locale root layout (src/app/(en)/layout.tsx or " +
        "src/app/he/layout.tsx) and below a src/app/_routes/*Route.tsx body, both of which " +
        "call seedLocale(). If you hit this from `metadata` or `generateMetadata`, that is the " +
        "documented restriction — use the page file's own literal locale instead.",
    );
  }
  return locale;
}

export function getDirection(): Direction {
  return DIRECTION[getLocale()];
}

/** `+1` in en, `-1` in he. See `dirSign` in config.ts for what it may and may not multiply. */
export function getDirSign(): 1 | -1 {
  return dirSignFor(getLocale());
}

export function getDict(): Dict {
  return DICTIONARIES[getLocale()];
}

/** Shorthand for the namespace every route renders. */
export function getChrome() {
  return getDict().chrome;
}
