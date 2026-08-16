/**
 * The dark band at the top of every legal page — eyebrow, title, last-updated line.
 *
 * Shared by /privacy, /terms and /accessibility. Was `PrivacyHero` until 2026-08-16, when the
 * other two documents landed and turned out to have the identical shape on the live site:
 * `משפטי · X` eyebrow, title, `עדכון אחרון · 16 במאי 2026`. Renamed rather than copied, so the
 * next contrast or bidi fix happens in one file instead of three.
 *
 * Deliberately the same shape as ContactHero: `data-nav-theme="dark"`, `bg-ink`, `pt-[198px]`,
 * the same 14px `muted` eyebrow and the same 44/48px display face. These pages have no capture
 * to line-fit against and are not clones of anything, so nothing here was measured fresh —
 * every value is borrowed from a band that WAS. See features/legal-pages/FEATURE.md.
 *
 * The `<h1>` is the document's title, not a marketing headline, so it takes no colour split and
 * no runs array: there is nothing to pin and nothing to break by hand.
 *
 * `data-nav-theme="dark"` here and `"light"` on LegalBody: between them the two bands cover the
 * whole of <main>, which is what Nav's scan needs — it picks the element spanning its bottom
 * edge and falls back to "light" on a gap.
 */

import type { LegalDoc } from "@/lib/i18n/legal";

export default function LegalHero({ doc }: { doc: LegalDoc }) {
  return (
    <section
      data-nav-theme="dark"
      className="relative flex w-full items-center justify-center overflow-hidden bg-ink px-4 pt-[198px] pb-16 tablet:px-10 desktop:pb-24"
    >
      <div className="relative flex w-px max-w-[var(--container-max)] flex-[1_0_0] flex-col items-start gap-4">
        {/* `text-muted` on `ink` is 3.85:1 and below AA — the same inherited item four other
            routes already carry, and used here for a label that duplicates the <h1> beneath it.
            Not a new deviation. ⚠️ On /accessibility this failure is louder than elsewhere:
            that page's own section 03 claims the palette meets AA. See the FEATURE.md flag. */}
        <p
          className="font-sans text-[14px] font-medium text-muted"
          style={{ lineHeight: "1.3em", letterSpacing: "-0.02em" }}
        >
          {doc.eyebrow}
        </p>

        <h1
          className="max-w-[var(--measure)] font-display text-[44px] text-paper tablet:text-[48px]"
          style={{ lineHeight: "1.1em", letterSpacing: "-0.05em" }}
        >
          {doc.title}
        </h1>

        {/* `paper-soft` (#ffffffcc, 11.84:1 over ink) rather than `muted`, because unlike the
            eyebrow this line carries information found nowhere else on the page — when the
            document last changed is the first thing a returning reader looks for. */}
        <p className="font-sans text-[14px] text-paper-soft">
          {doc.updatedLabel} · {doc.updatedDate}
        </p>
      </div>
    </section>
  );
}
