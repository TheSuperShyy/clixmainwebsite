/**
 * ROOT LAYOUT #2 — Hebrew, RTL. Serves `/he`, `/he/product`, `/he/security`, …
 *
 * `he` is a REAL path segment, not a group, so no `(he)` wrapper is needed — the URL is legible
 * straight from the folder tree. See src/app/(en)/layout.tsx for why there are two root layouts
 * and what that implies.
 *
 * ⚠️ `dir="rtl"` IS SET HERE AND NOWHERE ELSE. Do not set `dir` on any other element, and do not
 * read `document.dir` or `document.documentElement.lang` to discover it — client components take
 * direction from `useDirection()`/`useDirSign()`, server components from `getDirection()`. A DOM
 * sniff has no server snapshot, so it would render the LTR branch on the server and visibly flip
 * on hydration.
 *
 * ⚠️ THE ONE EXCEPTION, and it is a genuine bug this attribute would otherwise cause:
 * `direction` inherits into SVG, where `text-anchor: start` means INLINE-start. ClixFelixFooter
 * draws its wordmark as raw `<text x="-20">` with the default anchor, so under `dir="rtl"` the
 * anchor moves to the right edge and the 2034-unit-wide word is positioned entirely outside its
 * viewBox — it vanishes. That component pins `direction="ltr"` on the `<text>` for that reason,
 * not for styling.
 *
 * TYPE. The sitewide face `Discovery` (public/fonts/discovery/discovery-var.woff2) carries
 * COMPLETE Hebrew coverage — verified with fontTools, not assumed: all 27 base and final letters,
 * the full niqqud set, maqaf, geresh, gershayim, sof pasuq, and the shekel sign, across a
 * `wght 100–800` variable axis. So no font is vendored for this locale. ⚠️ But `--font-sans` and
 * `--font-display` fall back to `"Inter", sans-serif` and the vendored Inter subsets carry NO
 * U+0590–U+05FF, so Hebrew's only fallback is the OS `sans-serif` — a different family with
 * different metrics than anything here was measured against. Chosen rather than inherited; see
 * features/i18n-rtl/FEATURE.md.
 */

import type { Metadata } from "next";
import "../globals.css";
import { ViewTransitionProvider } from "@/components/ui/ViewTransitions";
import { I18nProvider } from "@/lib/i18n/LocaleProvider";
import CookieBanner from "@/components/legal/CookieBanner";
import AccessibilityWidget from "@/components/a11y/AccessibilityWidget";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { HTML_LANG, DIRECTION } from "@/lib/i18n/config";
import { seedLocale } from "@/lib/i18n/server";

/* The Hebrew description is SOURCED, not translated: it is the real company site's own
   positioning line (docs/reference/clixsolutions/, services H1, recovered from pages/*.html
   rather than content.json — see he/chrome.ts for why the H1s in that file lost their spaces).
   The English description here is a rogo-derived claim about "the world's leading financial
   institutions"; the Hebrew deliberately does not repeat it. */
export const metadata: Metadata = {
  title: "clix",
  description:
    "אנחנו בונים את המנגנונים השקטים שמניעים עסקים מודרניים.",
};

export default function HeRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  seedLocale("he");

  /* `data-scroll-behavior="smooth"` DECLARES the `html { scroll-behavior: smooth }` rule in
     globals.css to Next. Without it `disableSmoothScrollDuringRouteTransition` takes its
     "no smooth scrolling configured" branch, so every ROUTE change animates its scroll instead
     of arriving — and Next logs a warning about exactly this in dev. It does not affect
     in-page anchors: same-route hash changes short-circuit that helper, which is why the rule
     still does the job it was added for. */
  return (
    <html lang={HTML_LANG.he} dir={DIRECTION.he} data-scroll-behavior="smooth">
      <body>
        <I18nProvider locale="he" chrome={DICTIONARIES.he.chrome}>
          <ViewTransitionProvider>{children}</ViewTransitionProvider>
          {/* Last in the DOM so a screen reader reaches the page content first. It is
              `position: fixed`, so document order costs it nothing visually. Mounted
              inside I18nProvider because it reads `chrome.cookies`. */}
          <CookieBanner />
          {/* Fixed to the bottom-left corner on every route, which is what
              /accessibility §04 declares ("בצד שמאל של המסך"). */}
          <AccessibilityWidget />
        </I18nProvider>
      </body>
    </html>
  );
}
