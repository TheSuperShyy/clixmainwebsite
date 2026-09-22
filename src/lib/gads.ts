/* Google Ads — the ONE place the account id, the conversion label and the `gtag` calls live.
 *
 * Installed 2026-09-22 at the user's request ("set up Google Ads conversion tracking correctly
 * on our website"). Two halves:
 *
 *   · The tag itself, on every page, in `<head>`: `components/analytics/GoogleAdsTag.tsx`,
 *     mounted by both root layouts. It reads `GADS_ID` from here.
 *   · The conversion, fired from `ContactForm.tsx` inside the `res.ok` branch of `onSubmit` and
 *     nowhere else. That placement is the whole requirement, so it is worth being explicit
 *     about what it rules out. The event does NOT fire on: visiting /contact (nothing runs on
 *     mount), clicking Send (validation runs first and returns early), client validation
 *     failing (early return), the API rejecting (non-2xx never reaches the branch), or a
 *     refresh (the call sits in an event handler, not an effect; the success panel is React
 *     state and does not survive a reload). It fires ONCE per accepted submission: `onSubmit`
 *     ignores clicks while `status === "sending"`, the branch sets `status` to `"sent"`, and the
 *     form then leaves the DOM, so there is no second click to fire from.
 *
 * THE LABEL. A Google Ads conversion is addressed as `AW-<account>/<label>`; the label is
 * minted per conversion action in the Ads UI. Supplied 2026-09-22 from the Google Ads Team's
 * "Set up a Google tag" email — conversion action "Submit lead form", event snippet
 * `send_to: 'AW-18467124282/wo7vCM3x-YAdELro5-VE', value: 1.0, currency: 'ILS'`. The value and
 * currency are sent exactly as that snippet has them. `NEXT_PUBLIC_GADS_CONTACT_LABEL` can
 * still override the label per environment; when neither is set `reportContactConversion`
 * sends nothing rather than a bare-account `send_to`, which would register on the account
 * without attaching to any conversion action — noise that looks like success.
 *
 * NOT CONSENT-GATED, AND THAT IS DELIBERATE. The cookie banner is cosmetic by a recorded user
 * decision (see CookieBanner.tsx) and the published terms already list Google advertising
 * cookies (§05), so the tag loads regardless of which banner button was pressed. If that
 * changes, wire Google Consent Mode v2 in GoogleAdsTag.tsx — a `gtag('consent','default',…)`
 * before `config`, then `gtag('consent','update',…)` from `readConsent()` — rather than
 * conditionally mounting the tag, so the cookieless conversion pings survive a refusal. */

export const GADS_ID = "AW-18467124282";

/* From Google Ads → Goals → Conversions → "Submit lead form" → "Use Google tag" → the
   `send_to` value after the slash. */
const CONTACT_CONVERSION_LABEL = "wo7vCM3x-YAdELro5-VE";
/* The two extra fields Google's event snippet for this action carries, sent verbatim. */
const CONTACT_CONVERSION_VALUE = 1.0;
const CONTACT_CONVERSION_CURRENCY = "ILS";

export const CONTACT_CONVERSION_SEND_TO: string | null = (() => {
  const label = (
    process.env.NEXT_PUBLIC_GADS_CONTACT_LABEL ?? CONTACT_CONVERSION_LABEL
  ).trim();
  return label ? `${GADS_ID}/${label}` : null;
})();

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/* Report one accepted contact-form submission to Google Ads. Returns whether anything was sent,
   so the caller can log a miss in development. Safe to call when the tag is blocked (ad
   blockers strip `gtag.js` and `window.gtag` is then undefined): the submission itself is
   unaffected and the visitor sees the same success panel. */
export function reportContactConversion(): boolean {
  if (typeof window === "undefined") return false;
  if (!CONTACT_CONVERSION_SEND_TO) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[gads] contact conversion NOT sent: no conversion label configured (see src/lib/gads.ts).",
      );
    }
    return false;
  }
  if (typeof window.gtag !== "function") return false;
  window.gtag("event", "conversion", {
    send_to: CONTACT_CONVERSION_SEND_TO,
    value: CONTACT_CONVERSION_VALUE,
    currency: CONTACT_CONVERSION_CURRENCY,
  });
  return true;
}
