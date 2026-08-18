"use client";

/**
 * Shrinks the AccessiYes panel, by injecting a stylesheet INTO ITS SHADOW ROOT.
 *
 * Added 2026-08-17: *"can you make this button little smaller, also the when its clicked"*. The
 * button half of that is a config value (`iconSize`, set in `AccessiYesWidget.tsx`). The panel
 * half is this file, and it needs its own file because of one fact:
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 * ⚠️ ACCESSIYES RENDERS INSIDE A SHADOW DOM. `globals.css` CANNOT TOUCH IT.
 *
 * It creates `#cya11y-container` and immediately calls `attachShadow({ mode: "open" })`. A
 * shadow boundary blocks external stylesheets by design — the `.asw-*` approach used for Sienna,
 * where plain rules in globals.css restyle the widget, does not work here AT ALL. Anything
 * written in globals.css for `.cya11y-*` would be silently inert.
 *
 * Two things do cross the boundary, and both are used:
 *   · CSS CUSTOM PROPERTIES inherit through it — which is why `iconSize` works, since the widget
 *     turns it into `--cya11y-size` on the host element.
 *   · A `<style>` appended to the shadow root itself, which is what this does. `mode: "open"`
 *     makes `.shadowRoot` reachable from JS; had they used `"closed"`, the panel would not be
 *     restyleable at all and the only options would be a different vendor or their paid tier.
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 *
 * WHAT IT OVERRIDES. Sienna shipped a 500px full-height drawer; AccessiYes ships a 462px one
 * (`top:30px; width:462px; height:calc(100% - 30px)`). Same complaint, same fix: a compact
 * popover anchored above the button.
 *
 * ⚠️ SAFE TO REPOSITION, but for a DIFFERENT reason than Sienna. Sienna's closed state is
 * `display:none`. This one keys off a `data-position` attribute for its side and is mounted or
 * unmounted rather than slid out — so no rule here is load-bearing for hiding it. Both
 * `bottom-left` and `bottom-right` are handled below even though this site pins bottom-left,
 * because the value is a config option and a future change to it should not silently produce a
 * full-height drawer again.
 *
 * ⚠️ `bottom: 72px` IS ARITHMETIC: the 40px button plus its 20px bottom margin (AccessiYes's
 * default) plus a 12px gap. If `iconSize` or `margins` change in AccessiYesWidget.tsx, this
 * moves with them.
 *
 * ⚠️ EVERY SELECTOR IS A THIRD-PARTY CLASS NAME on a CDN script with no pinned version. An
 * upstream rename makes the panel a full-height drawer again — it degrades, it does not break.
 */

import { useEffect } from "react";

/** Marked with an id so a re-run cannot append a second copy. */
const STYLE_ID = "clix-a11y-panel-overrides";

const PANEL_CSS = `
  .cya11y-menu[data-position="bottom-left"],
  .cya11y-menu[data-position="bottom-right"] {
    top: auto !important;
    bottom: 72px !important;
    width: min(340px, calc(100vw - 2rem)) !important;
    height: auto !important;
    /* The panel already carries \`overflow: auto\`, so capping the height scrolls its contents
       rather than clipping them. Nothing new has to be added for that. */
    max-height: min(540px, calc(100vh - 8rem)) !important;
    border-radius: 12px !important;
    font-size: 15px !important;
  }
  .cya11y-menu[data-position="bottom-left"] {
    left: 20px !important;
    right: auto !important;
  }
  .cya11y-menu[data-position="bottom-right"] {
    right: 20px !important;
    left: auto !important;
  }
`;

export default function AccessiYesCustomize() {
  useEffect(() => {
    const inject = () => {
      const host = document.getElementById("cya11y-container");
      const root = host?.shadowRoot;
      if (!root) return false;
      if (root.getElementById(STYLE_ID)) return true;

      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = PANEL_CSS;
      /* Appended LAST so it comes after the widget's own stylesheet in the shadow root's
         cascade. The `!important`s would win regardless, but ordering costs nothing and keeps
         the intent readable if any of them are ever dropped. */
      root.appendChild(style);
      return true;
    };

    /* The container is created asynchronously, after the CDN script loads. Watching `body` for
       it is cheaper and more reliable than polling, and it disconnects the moment it lands. */
    if (inject()) return;

    const observer = new MutationObserver(() => {
      if (inject()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
