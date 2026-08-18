"use client";

/**
 * Sienna — the third-party accessibility plugin this site actually ships.
 *
 * Added 2026-08-17, replacing a UserWay integration written an hour earlier and deleted unused:
 * the boss asked for a bought plugin, then the user came back with "it's paid, we should use
 * some free one". Sienna is the option that satisfies BOTH halves of that — it is a real,
 * externally maintained, third-party widget (which is what the boss asked for), and it is free
 * with no trial, no registration and no paywall on the core widget.
 *
 * WHY THIS ONE, out of the free options:
 *   · MIT-licensed and open source — github.com/bennyluk/Sienna-Accessibility-Widget. If it is
 *     ever abandoned, the code can be vendored into this repo. A closed CDN script cannot be.
 *   · No account, no dashboard, no email. Nothing to expire, nothing to forget to renew, and no
 *     vendor login that leaves with whoever created it.
 *   · It makes no compliance CLAIM. That matters more than it sounds: the paid overlays in this
 *     category are in trouble precisely for claiming to deliver WCAG conformance — the FTC's
 *     $1M order against accessiBe (April 2025), UserWay's July 2024 class action. A widget that
 *     only claims to be a widget cannot mis-sell you anything.
 *
 * ⚠️ IT IS STILL AN OVERLAY, AND AN OVERLAY IS NOT COMPLIANCE. Told to the user twice and
 * recorded here so the next reader does not have to be told a third time: תקנה 35 and ת״י 5568
 * are real obligations, and no widget — free or paid — discharges them. What discharges them is
 * fixing the four things /accessibility still promises falsely (the skip link, the AA contrast
 * failures on the default palette, the untested screen-reader claim, the chat live region).
 *
 * ⚠️ `@latest` IS A SUPPLY-CHAIN DECISION, NOT A DEFAULT. It is the URL Sienna documents, and it
 * means a new upstream release reaches production with no commit here — good for security fixes,
 * bad on the day a release breaks. Pin it (`sienna-accessibility@X.Y.Z`) once a known-good
 * version is confirmed in the browser; pinning also makes an `integrity` hash possible, which
 * `@latest` forbids by construction.
 *
 * ⚠️ IT IS A THIRD-PARTY SCRIPT. `privacy` §05 enumerates this site's third-party processors and
 * Sienna is not among them — flagged in features/legal-pages/FEATURE.md, not silently added,
 * because that is published legal text.
 */

import Script from "next/script";
import SiennaCustomize from "./SiennaCustomize";

/**
 * The URL Sienna's own install instructions give. `defer` is unnecessary under `next/script` —
 * `afterInteractive` already loads it after hydration, which is the right tier for an overlay
 * that attaches to an already-rendered page. `beforeInteractive` would block first paint on a
 * CDN this site does not control, for a control nobody needs in the first 200ms.
 */
const SIENNA_SRC =
  "https://cdn.jsdelivr.net/npm/sienna-accessibility@latest/dist/sienna-accessibility.umd.js";

export default function SiennaWidget() {
  return (
    <>
      <Script
        id="sienna-accessibility"
        src={SIENNA_SRC}
        strategy="afterInteractive"
        /* ⚠️ THESE THREE ARE THE ONLY OPTIONS THE AUTO-INIT READS. Verified against the
           published bundle (v2.2.333): it builds its options object from `lang`, `position` and
           `offset` and ignores every other key in its own defaults. Colour, size, the statement
           link and the branding are NOT settable here — see SiennaCustomize.tsx.

           `position` is stated rather than left to the default even though the default happens
           to match, because /accessibility §04 DECLARES the button is "בצד שמאל של המסך". A
           declared position should not depend on a third party not changing its mind.

           `offset` is 16,16 to match the corner inset the built-in widget used (`bottom-4
           left-4`), so the two are interchangeable without the button jumping.

           NO `lang`: omitting it makes Sienna read `document.documentElement.lang`, which this
           site already sets per locale — so /he gets its Hebrew pack and / gets English, with
           no third place to keep in sync. Both packs ship with the widget; checked. */
        data-position="bottom-left"
        data-offset="16,16"
      />
      <SiennaCustomize />
    </>
  );
}
