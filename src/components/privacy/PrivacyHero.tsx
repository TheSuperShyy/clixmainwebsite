/**
 * The dark band at the top of /privacy — eyebrow, title, last-updated date.
 *
 * Deliberately the same shape as ContactHero: `data-nav-theme="dark"`, `bg-ink`,
 * `pt-[198px]`, the same 14px `muted` eyebrow and the same 44/48px display face. This page has
 * no capture to line-fit against and is not a clone of anything, so nothing here was measured
 * fresh — every value is borrowed from a band that WAS. See features/privacy-page/FEATURE.md.
 *
 * The `<h1>` is the document's title, not a marketing headline, so it takes no colour split
 * and no runs array: there is nothing to pin and nothing to break by hand.
 *
 * `data-nav-theme="dark"` here and `"light"` on PrivacyBody: between them the two bands cover
 * the whole of <main>, which is what Nav's scan needs — it picks the element spanning its
 * bottom edge and falls back to "light" on a gap.
 */

import { getDict } from "@/lib/i18n/server";

export default function PrivacyHero() {
  const t = getDict().privacy;

  return (
    <section
      data-nav-theme="dark"
      className="relative flex w-full items-center justify-center overflow-hidden bg-ink px-4 pt-[198px] pb-16 tablet:px-10 desktop:pb-24"
    >
      <div className="relative flex w-px max-w-[var(--container-max)] flex-[1_0_0] flex-col items-start gap-4">
        {/* `text-muted` on `ink` is 3.85:1 and below AA — the same inherited item four other
            routes already carry, and used here for a label that duplicates the <h1> beneath
            it. Not a new deviation. */}
        <p
          className="font-sans text-[14px] font-medium text-muted"
          style={{ lineHeight: "1.3em", letterSpacing: "-0.02em" }}
        >
          {t.eyebrow}
        </p>

        <h1
          className="max-w-[var(--measure)] font-display text-[44px] text-paper tablet:text-[48px]"
          style={{ lineHeight: "1.1em", letterSpacing: "-0.05em" }}
        >
          {t.title}
        </h1>

        {/* `paper-soft` (#ffffffcc, 11.84:1 over ink) rather than `muted`, because unlike the
            eyebrow this line carries information found nowhere else on the page — when the
            policy last changed is the first thing a returning reader looks for. */}
        <p className="font-sans text-[14px] text-paper-soft">
          {t.updatedLabel} · {t.updatedDate}
        </p>
      </div>
    </section>
  );
}
