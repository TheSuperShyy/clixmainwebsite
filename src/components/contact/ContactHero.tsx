/**
 * ContactHero — the dark band at the top of /contact.
 *
 * Spec: features/contact-page/FEATURE.md · memory: features/contact-page/CONTEXT.md
 *
 * ⚠️ THIS PAGE IS NOT A CLONE. It is the first route in this repo with no counterpart in the
 * rogo capture, so there is no measured original to diff against and nothing here is
 * "extracted". Every number below is either an EXISTING site value reused, or a decision.
 * The distinction matters because the repo's standing rule is "measure, don't eyeball" — that
 * rule governs clone work, and there is nothing to measure. What replaces it here is
 * consistency: no value is invented that the site already has an answer for.
 *
 * VALUES REUSED RATHER THAN CHOSEN
 * - `pt-[198px]` is CompanyHero's own top padding, identical at every tier, and it is the
 *   FIXED nav's clearance (banner + nav row). Copied because it is the same nav, on a route
 *   with the same `<Nav models={models} />` and no `spacer` prop. Not re-derived.
 * - 44/48px display type at `-0.05em` / `1.1em` is the footer's closing headline, which is the
 *   nearest thing on the site to this one: a short address to the reader, dark ground, white
 *   type. Reused verbatim so the two read as the same voice.
 * - `paper` over `paper-soft` for the emphasis is /security's pairing (white heading, 80% body)
 *   inverted onto one line — 11.84:1 and 21:1 on `ink`, both AAA.
 *
 * ONE FACE, AND WHY THE EYEBROW IS NOT MONO. `--font-mono` (Fragment Mono) is loaded but its
 * @font-face unicode-ranges cover Latin, Greek and Cyrillic and NOT U+0590–05FF, so any
 * Hebrew set in it silently falls back to the OS monospace beside Discovery. The eyebrow says
 * "צרו קשר" in Hebrew, so it is `font-sans`. Mono is used on this page only where the glyphs
 * are Latin or numeric in BOTH locales — the group numerals and the aside's email and phone.
 * See ContactAside.tsx and ContactForm.tsx, which carry the same note.
 */

import { getDict } from "@/lib/i18n/server";

export default function ContactHero() {
  const t = getDict().contact.hero;

  return (
    /* `data-nav-theme="dark"` — Nav.tsx walks these in document order and picks the element
       spanning its bottom edge; a gap falls back to "light". This band and ContactBody's cover
       the whole of <main> between them, so the scan never gaps. */
    <section
      data-nav-theme="dark"
      className="relative flex w-full items-center justify-center overflow-hidden bg-ink px-4 pt-[198px] pb-16 tablet:px-10 desktop:pb-24"
    >
      <div className="relative flex w-px max-w-[var(--container-max)] flex-[1_0_0] flex-col items-start gap-4">
        {/* Eyebrow. `text-muted` on `ink` is 3.85:1 — below AA for body text, and the same
            open item four other routes already carry (docs/DESIGN-SYSTEM.md). It is used here
            for a five-character label that duplicates the <h1> beneath it, which is the one
            shape where the failure carries no information loss. Not a new deviation; not a
            reason to introduce a token either. */}
        <p
          className="font-sans text-[14px] font-medium text-muted"
          style={{ lineHeight: "1.3em", letterSpacing: "-0.02em" }}
        >
          {t.eyebrow}
        </p>

        {/* The headline. Three runs, one colour boundary, `<span>` in the component and never
            in the dictionary. `max-w-[--measure]` (844px) is the site's narrow measure and is
            what keeps the line breaking on its own rather than at a hard-coded <br> — this
            page has no capture to line-fit against, so the copy is allowed to wrap where the
            language wants to. That is also why there is no runs-array here as the footer has:
            nothing is pinned, so nothing needs the escape hatch. */}
        <h1
          className="max-w-[var(--measure)] font-display text-[44px] text-paper-soft tablet:text-[48px]"
          style={{ lineHeight: "1.1em", letterSpacing: "-0.05em" }}
        >
          {t.headlineA} <span className="text-paper">{t.headlineB}</span>{" "}
          {t.headlineC}
        </h1>
      </div>
    </section>
  );
}
