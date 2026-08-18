"use client";

/**
 * The cookie notice — a bottom-anchored bar shown once per browser.
 *
 * Added 2026-08-17 at the user's request ("my boss wants that"), ported from the live
 * https://www.clix-solution.com, which is the source of truth for this site's legal surface.
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 * ⚠️ THIS BANNER IS COSMETIC, AND THAT IS A DECIDED THING — NOT AN OVERSIGHT.
 *
 * The user was asked directly whether it should gate anything and chose "cosmetic — matches the
 * live site". So both buttons do exactly one thing: write a value to `localStorage` and
 * disappear. NOTHING in this app reads that value.
 *
 * What that means concretely, so nobody has to rediscover it:
 *
 *   · `FooterMap.tsx` embeds a keyless Google Maps iframe. It sits in the FOOTER, so it loads
 *     on every route, and it sets Google's third-party cookies BEFORE the visitor has clicked
 *     anything and REGARDLESS of which button they click. It is the only third-party cookie
 *     source in the build — there is no gtag, no GTM and no Meta pixel anywhere in `src/`.
 *   · terms §07 (`ניהול העוגיות`) promises both a prompt AND the ability to "להגדיר העדפות".
 *     This delivers the prompt. It does not deliver preferences — there are two buttons and no
 *     settings panel, which is also all the live site has.
 *
 * So §07 moves from unkept to half-kept. Recorded in `features/legal-pages/FEATURE.md`.
 *
 * TO MAKE IT REAL LATER: read `readConsent()` from `FooterMap` and render the reserved
 * `bg-ink-soft` box instead of the iframe until it returns `"all"`. That is the whole change —
 * the storage key and its two values were chosen so this stays a small follow-up.
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 *
 * WHY IT LIVES IN `chrome` AND NOT ITS OWN NAMESPACE: `I18nProvider` passes exactly one
 * dictionary to the client, `chrome`. Page namespaces are seeded per route body, and this
 * mounts in the LAYOUT, above every route. A `cookies` namespace would be unreachable here.
 */

import { useSyncExternalStore } from "react";
import AppLink from "@/components/ui/AppLink";
import { useChrome } from "@/lib/i18n/LocaleProvider";

/** Namespaced so it cannot collide with anything else this origin ever stores. */
const STORAGE_KEY = "clix-cookie-consent";

/** The two values the buttons write. Exported for the follow-up described above. */
export type CookieConsent = "all" | "essential";

/**
 * What `useSyncExternalStore` reports.
 *
 * THREE states, not two, and the third is the one that matters: `"unknown"` is what the SERVER
 * render and the hydration pass both see, because `localStorage` does not exist there. Only
 * `"none"` — an answered "we asked, they have not chosen" — renders the bar. So the markup is
 * identical on both sides of hydration (nothing), and a returning visitor never sees a flash of
 * a banner that is about to remove itself.
 */
type Snapshot = CookieConsent | "none" | "unknown";

/**
 * `localStorage` THROWS, it does not return null, when the browser refuses it — Safari's
 * private mode historically, and any context where storage is partitioned or blocked. An
 * uncaught throw here would take down the whole layout, so both accessors swallow.
 */
export function readConsent(): CookieConsent | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

/* ── the store ────────────────────────────────────────────────────────────────────────────
   A four-line external store rather than `useState` + `useEffect`, because this project's
   lint runs the React Compiler rules and `react-hooks/set-state-in-effect` rejects the
   read-storage-on-mount idiom outright. `useSyncExternalStore` is the sanctioned way to read
   a browser API into render, and it hands us the SSR/hydration split for free via its third
   argument. Module scope, so `subscribe` and the getters are referentially stable. */

let listeners: Array<() => void> = [];

function subscribe(onChange: () => void) {
  listeners = [...listeners, onChange];
  return () => {
    listeners = listeners.filter((l) => l !== onChange);
  };
}

/* Returns a primitive, so React's identity check is a value comparison and there is nothing to
   memoise. Reading `localStorage` per render is a cheap synchronous map lookup — caching it
   here would only buy a stale-invalidation bug. */
const getSnapshot = (): Snapshot => readConsent() ?? "none";
const getServerSnapshot = (): Snapshot => "unknown";

function writeConsent(value: CookieConsent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* Storage blocked — Safari private mode, partitioned storage, a hardened profile. The
       notify below still fires, so the bar closes for this page view and reappears on the
       next one. That is the correct failure: silently pretending to remember a consent
       decision we could not persist would be worse than asking again. */
  }
  listeners.forEach((l) => l());
}

export default function CookieBanner() {
  const { cookies } = useChrome();
  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (consent !== "none") return null;

  const choose = (value: CookieConsent) => () => writeConsent(value);

  return (
    /* `region` rather than `dialog`: this does not trap focus and does not block the page, and
       neither does the original. Calling it a dialog would tell a screen-reader user they are
       in a modal they cannot escape from, which would be a lie about a bar they can simply
       tab past. Sits last in the layout's DOM so it is announced after the page content.

       `inset-x-0` + `mx-auto` + `max-w-*` centres it at every tier without caring about `dir`,
       so RTL needs no special case here. */
    <div
      role="region"
      aria-label={cookies.label}
      /* A keyframe, not a transition: the bar mounts already in its final state, so there is
         no "before" frame for a transition to run from without a second render to force one.
         `cookie-banner-in` is defined in globals.css beside the other page animations. */
      className="fixed inset-x-0 bottom-0 z-50 mx-auto mb-4 w-[calc(100%-2rem)]
                 max-w-[720px] rounded-[6px] border border-paper/10 bg-ink
                 px-5 py-4 text-paper shadow-[0_8px_32px_rgba(0,0,0,0.28)]
                 animate-[cookie-banner-in_500ms_var(--ease-rogo)_both]
                 motion-reduce:animate-none"
    >
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:gap-6">
        <div className="flex-1">
          <p className="font-sans text-[14px] font-medium text-paper">
            {cookies.title}
          </p>
          {/* ⚠️ The three runs carry their own spacing — the Hebrew lead ENDS on the prefix
              "ב" with no space because it attaches to the link, while the English lead ends
              on "our ". Do not trim these strings. */}
          <p className="mt-1 font-sans text-[13px] leading-[1.5] text-paper/70">
            {cookies.bodyLead}
            <AppLink
              href="/privacy"
              className="text-paper underline underline-offset-2
                         transition-colors duration-300 hover:text-paper/70
                         focus-visible:outline-2 focus-visible:outline-offset-2
                         focus-visible:outline-paper"
            >
              {cookies.bodyLink}
            </AppLink>
            {cookies.bodyTail}
          </p>
        </div>

        {/* `flex-none` so the buttons never compress; the copy column absorbs the reflow.
            Stacked below 810 — the two Hebrew labels are `whitespace-nowrap` and will not fit
            side by side on a 390px screen — and side by side from `tablet`, where they sit in
            the row beside the copy. There is no `phone:` breakpoint in this project; phone is
            the unprefixed base. */}
        <div className="flex flex-none flex-col gap-2 tablet:flex-row">
          <button
            type="button"
            onClick={choose("all")}
            className="h-10 cursor-pointer rounded-[28px] bg-paper px-5
                       font-sans text-[14px] font-medium whitespace-nowrap text-ink
                       transition-opacity duration-300 hover:opacity-80
                       focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-paper motion-reduce:transition-none"
          >
            {cookies.acceptAll}
          </button>
          <button
            type="button"
            onClick={choose("essential")}
            className="h-10 cursor-pointer rounded-[28px] border border-paper/20
                       px-5 font-sans text-[14px] font-medium whitespace-nowrap
                       text-paper/70 transition-colors duration-300
                       hover:border-paper/50 hover:text-paper
                       focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-paper motion-reduce:transition-none"
          >
            {cookies.essentialOnly}
          </button>
        </div>
      </div>
    </div>
  );
}
