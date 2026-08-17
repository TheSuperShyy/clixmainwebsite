"use client";

/**
 * AccessiYes — the third-party accessibility widget this site ships.
 *
 * Added 2026-08-17 from the snippet the user generated at accessiyes.com → "Get installation
 * code". That generator is the NON-WORDPRESS path: the product is sold as a WordPress plugin
 * ("upload to /wp-content/plugins/, activate on the Plugins screen"), which is not a thing that
 * exists in a Next app, and the embed snippet on their marketing page is a placeholder pointing
 * at `cdn.example.com`. The generated one is the only real published embed.
 *
 * What actually loads: `WebYes Accessibility Widget v2.0.0` from `cdn-cookieyes.com` — AccessiYes
 * is the brand, CookieYes builds it. 370 KB. Its only outbound host in that whole bundle is
 * `cdn-cookieyes.com/widgets/fonts/`; there is no analytics endpoint, which does support the
 * "zero data collected" claim. (Their MARKETING site runs GTM. The widget does not.)
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 * ⚠️ THE CONFIG MUST EXIST BEFORE THE SCRIPT RUNS, WHICH IS WHY THIS IS ONE INLINE SCRIPT.
 *
 * The widget reads `window._cyA11yConfig` at startup — the same global the WordPress plugin sets
 * via `wp_localize_script`. Split across two `<Script>` tags this becomes a race: `next/script`
 * does not guarantee ordering between an inline tag and a `src` tag in the same strategy, and
 * losing that race means the widget boots with ITS defaults — bottom-RIGHT, and the statement
 * link pointing at the vendor instead of this site. So the assignment and the injection live in
 * one script, exactly as the vendor's own snippet does it.
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ `bottom-left` ON BOTH BREAKPOINTS IS NOT A PREFERENCE. /accessibility §04 declares
 * "בצד שמאל של המסך" — left side of the screen — under תקנה 35. The generator defaults to
 * bottom-right. Changing this makes a published declaration false.
 *
 * ⚠️ THE STATEMENT URL IS BUILT FROM `location.origin`, NOT HARDCODED. The generator emitted
 * `https://clix-solution.com/accessibility`, which would send every localhost and preview visitor
 * to production — and, worse, would send Hebrew visitors to the English statement. Computing it
 * at runtime keeps the link on whatever host is serving the page, and `localeHref` keeps it on
 * the right locale tree. This replaces the DOM patch Sienna needed, because unlike Sienna's dead
 * `statement` option, this one is real and wired.
 */

import Script from "next/script";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { localeHref } from "@/lib/i18n/config";

/**
 * The site ID from the user's generated snippet, overridable without a code change.
 *
 * Not a secret — it ships in the page source of every site using it. Grepped the 370 KB bundle:
 * the `id` parameter is never parsed and there is no settings fetch, so it is a CDN tenant marker
 * rather than a licence check. It is committed anyway because it was generated FOR THIS DOMAIN,
 * and the alternative — an empty env var everyone forgets to fill — ships no widget at all on a
 * site whose accessibility statement declares one.
 */
const SITE_ID =
  process.env.NEXT_PUBLIC_ACCESSIYES_SITE_ID ??
  "e01984af-04d2-4a54-8246-bdda4c578fe6";

const SRC = `https://cdn-cookieyes.com/widgets/accessibility.js?id=${SITE_ID}`;

export default function AccessiYesWidget() {
  const locale = useLocale();

  /* `selected: []` means "offer no language switcher" — the page's own locale decides, which is
     right on a site that already has two locale trees and a `<html lang>` per tree. Hebrew is
     supported: the plugin ships he.json and the bundle carries a "he" pack. Checked. */
  const config = {
    iconId: "default",
    position: { mobile: "bottom-left", desktop: "bottom-left" },
    language: { default: locale, selected: [] as string[] },
    modules: { statement: { enabled: true } },
  };

  const statementPath = localeHref("/accessibility", locale);

  /* `JSON.stringify` on every interpolated value — this is a `<script>` body, and a raw path or
     URL concatenated into one is how an injection gets in. Nothing here is user input today; the
     escaping is so that stays true if `localeHref` ever takes something dynamic. */
  const body = `window._cyA11yConfig=${JSON.stringify(config)};
window._cyA11yConfig.modules.statement.url=location.origin+${JSON.stringify(statementPath)};
(function(w,d,s,u){var js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];js.src=u;js.async=true;fjs.parentNode.insertBefore(js,fjs);})(window,document,"script",${JSON.stringify(SRC)});`;

  return (
    <Script
      /* Keyed by locale so a locale change re-runs it rather than leaving the previous
         statement URL in place. The two locale trees are separate document loads today, so this
         is belt and braces — but it costs nothing and stops a soft navigation from silently
         pointing Hebrew visitors at the English statement. */
      key={locale}
      id="accessiyes-widget"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
