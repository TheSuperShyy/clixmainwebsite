"use client";

/**
 * ScrollToTopOnRoute — puts the window at the top when this component's route commits.
 *
 * ⚠️ USED BY EXACTLY ONE ROUTE, AND IT IS NOT A GENERAL UTILITY. Every ordinary route on this
 * site already resets its own scroll, because Next's `ScrollAndFocusHandler` does it on a
 * normal segment render. Dropping this into a page that does not need it would fight that
 * handler and break browser back/forward scroll restoration. The 404 is the one route Next
 * leaves unhandled.
 *
 * WHY THE 404 NEEDS IT. Measured 2026-08-16 with a CDP probe over four navigations against
 * `next start`, at 1440×900 — the numbers are the whole argument:
 *
 *   /company  -> /contact   (normal -> normal)   scrollY 4140 -> 32     fine
 *   /company  -> /privacy   (normal -> 404)      scrollY 4130 -> 596    STUCK
 *   /services -> /privacy   (404    -> 404)      scrollY  596 -> 596    STUCK
 *   /services -> /contact   (404    -> normal)   scrollY  596 -> 0      fine
 *
 * The two failures are exactly the two navigations whose DESTINATION is a 404, and the two
 * that work are the ones whose destination is a real page — so the origin is irrelevant and
 * the user's "clicking in the footer" was a red herring. A render that terminates in a
 * `notFound()` boundary never reaches the scroll reset. The stale offset then simply CLAMPS to
 * the new document's maximum (4130 -> 596, which is that page's exact scroll height), and
 * because the 404 is short, its maximum lands you in the footer. Nothing scrolled you there;
 * you were never moved.
 *
 * ⚠️ KEYED ON `pathname`, NOT ON MOUNT. The 404 -> 404 row above is why. Clicking `Privacy`
 * from `/services` re-renders the SAME component at the same position in the tree, so React
 * reuses it and a `[]`-dep effect would never fire again. Every dead footer link would work
 * once and then stop.
 *
 * ⚠️ `behavior: "instant"`, NOT a plain `scrollTo(0, 0)`. `globals.css` sets
 * `html { scroll-behavior: smooth }`, which turns a bare call into a one-to-two second
 * ANIMATION — and this runs inside `document.startViewTransition`, so the browser would
 * photograph frame one of that animation and crossfade the old offset back over the live page.
 * That is the identical failure ViewTransitions.tsx documents for its hash landing; `instant`
 * overrides the CSS per call with no reflow dance.
 *
 * ORDERING IS LOAD-BEARING AND IT IS ALREADY CORRECT. Child effects run before parent effects,
 * so this fires before ViewTransitionProvider's own `pathname` effect — which is what calls
 * `resolve()` and ends the snapshot. The page is therefore already at the top when the
 * crossfade is captured. Same guarantee, and the same reasoning, as the hash landing.
 *
 * Renders nothing.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTopOnRoute() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
