/**
 * English copy for the 404 page. THE NAMESPACE'S SHAPE IS DEFINED HERE and `dictionary.ts`
 * only imports it.
 *
 * Added 2026-08-16 with src/app/_routes/NotFoundRoute.tsx. Until then this site had no
 * `not-found` file at all, so every unknown path — and the eight dead footer links that
 * pointed at one — rendered Next's built-in 404: unstyled, no nav, no footer, no way back,
 * and no locale, so `/he/services` answered a Hebrew reader in English.
 *
 * ⚠️ AUTHORED, NOT SOURCED. Neither the target nor the real clix site has a 404 page in any
 * capture, so there is nothing to clone and nothing to lift. Every string in this namespace
 * and its Hebrew twin is this repo's own invention — which is why the Hebrew carries the
 * unread-by-a-native-speaker flag rather than a provenance marker.
 *
 * ⚠️ NO JSX, NO HTML, NO MARKUP — the standing dictionary rule. `code` and `title` are two
 * keys rather than one string because they are two elements at two sizes, not a line break.
 *
 * ⚠️ NO DASHES, per the user's standing 2026-08-10 rule: no em dash, no en dash, no hyphen
 * standing in for one. The title was drafted as "doesn't exist — or doesn't exist yet" and
 * the dash became a comma. Curly apostrophe (’ U+2019), as everywhere else in this dictionary.
 *
 * The copy deliberately says "or doesn't exist yet". Five links in this site's own footer
 * still point at routes that have not been written, so for a real share of this page's
 * traffic the honest answer is "not yet" rather than "you mistyped it". If those pages ever
 * land, this line is the one to revisit.
 */

export const notFound = {
  code: "404",
  title: "This page doesn’t exist, or doesn’t exist yet.",
  /* The button. Same string as `chrome.a11y.home`'s destination but not the same key: that
     one names the LOGO's link for a screen reader ("clix home") and this one is visible
     button text. Sharing them would couple a label to an aria-label. */
  back: "Back home",
} as const;

/** The namespace's shape. `he/notFound.ts` implements `Translated<NotFoundDict>`, which
    widens these string literals so the Hebrew may differ while the key set may not. */
export type NotFoundDict = typeof notFound;
