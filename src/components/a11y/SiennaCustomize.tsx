"use client";

/**
 * Repoints and recolours the Sienna widget after it mounts.
 *
 * Added 2026-08-17: *"make sure the accessibility is connected to the accessibility page, like
 * the content of that"*. Sienna's panel footer ships a link labelled "Accessibility Statement"
 * that points at **Sienna's own** statement page, not this site's. So the widget was advertising
 * somebody else's declaration on a site that has its own, published under תקנה 35.
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 * WHY THIS IS A DOM PATCH AND NOT A CONFIG OPTION — read before "fixing" it.
 *
 * Sienna's internal defaults DO include a `statement` key, and a `primaryColor` one. Neither is
 * reachable. Read from the published bundle (v2.2.333), not guessed:
 *
 *   · The auto-init builds its options object from exactly THREE data attributes —
 *     `lang`, `position` and `offset`. Everything else in the defaults object is unreachable
 *     from the script tag.
 *   · `statement` has NO CONSUMER anywhere in the bundle. The footer link's href is a hardcoded
 *     literal. Setting the option, even if it could be set, would do nothing.
 *   · `window.SiennaPlugin` exposes `{ changeLanguage }` and nothing else.
 *
 * So the only way to point that link at our own page is to rewrite it once it exists.
 *
 * ⚠️ THAT MAKES THIS FRAGILE BY CONSTRUCTION, and the script loads from `@latest`. If an
 * upstream release renames `#asw-statement-link`, this silently stops applying — every lookup
 * is optional-chained, so it degrades to "the link points at Sienna again" rather than throwing.
 * Pinning the version (see SiennaWidget.tsx) is what turns this from a silent risk into a
 * deliberate upgrade step.
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ THE PANEL ACCENT NEEDS THE SAME TREATMENT, FOR A CSS-CASCADE REASON. Sienna declares
 * `--asw-primary: #0848ca` on `.asw-widget, .asw-menu` in its stylesheet, and then ALSO sets it
 * INLINE with `!important` on `.asw-menu` when it builds the panel. An inline `!important` beats
 * a stylesheet `!important` from the same origin, so no rule in globals.css can touch the
 * panel's accent. The button is different — `.asw-widget` gets no inline value, so THAT one is
 * overridden in globals.css like any normal token. Hence the split: CSS for the button, JS for
 * the panel, and both land on the same colour.
 */

import { useEffect } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { localeHref } from "@/lib/i18n/config";

/** Must match `--asw-primary` on `.asw-widget` in globals.css, or button and panel disagree. */
const ACCENT = "#1b3a5f";

export default function SiennaCustomize() {
  const locale = useLocale();

  useEffect(() => {
    /* The site's own statement, locale-prefixed — `/accessibility` in English, `/he/accessibility`
       on the Hebrew tree. Computed inside the effect so it is never stale against `locale`. */
    const href = localeHref("/accessibility", locale);

    const apply = () => {
      const link = document.querySelector<HTMLAnchorElement>(
        "#asw-statement-link",
      );
      if (link) {
        link.href = href;
        /* Sienna opens it in a new tab because it was pointing off-site. It is our own page now,
           so it should behave like every other internal link — and an unexpected new tab is a
           usability problem in its own right, which matters more than usual on this widget. */
        link.removeAttribute("target");
        link.removeAttribute("rel");
      }

      const menu = document.querySelector<HTMLElement>(".asw-menu");
      /* `important` as the third argument — see the cascade note above. Without it Sienna's own
         inline declaration wins and the panel stays its default blue. */
      menu?.style.setProperty("--asw-primary", ACCENT, "important");

      return Boolean(link) && Boolean(menu);
    };

    /* The widget mounts asynchronously and the PANEL is built later still — not with the button,
       but when the menu is first constructed. So one pass after load is not enough; this watches
       until both have been seen, then stops. `apply` is idempotent, so a duplicate run is free. */
    if (apply()) return;

    const observer = new MutationObserver(() => {
      if (apply()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  return null;
}
