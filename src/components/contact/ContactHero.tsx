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
 * ⚠️ THE FOUR CONTACT CHANNELS PASSED THROUGH THIS BAND AND DO NOT LIVE HERE. On 2026-08-17
 * they moved out of the 300px sidebar (`ContactAside.tsx`) into this hero, and then — the same
 * day, on the user's call — down into the FOOTER, where they now replace the closing CTA on
 * this route only. See `ContactChannels.tsx` and `Footer.tsx`'s `closing` prop.
 *
 * The reason they did not stay: the footer's closing CTA is "Software that works, results that
 * speak. [Let's start]", and on /contact that button points at the page you are already on.
 * Putting the channels there deletes a redundant CTA and ends the page on something useful,
 * which is worth more than filling this band was. The user's words: "move it down, remove the
 * cta, since you are already in the cta page."
 *
 * ⚠️ SO THIS HERO IS DELIBERATELY SPARSE AGAIN — 198px of `ink` holding an eyebrow and one
 * headline. That was called out as the emptiest hero on the site during the redesign review and
 * the trade was made knowingly: the channels do more work at the end of a ~1400px form than they
 * did decorating the top. Do not "fix" this by inventing filler for the band.
 *
 * ⚠️ THE EYEBROW IS `paper-soft`, NOT `muted`, AND THAT IS A FIX. It was `text-muted`, which is
 * 3.85:1 on `ink` and fails AA — carried as a known open item on four routes, justified here on
 * the grounds that the word duplicates the <h1> beneath it. That justification was always thin
 * and it is now free to drop: nothing else on this band uses `muted`, so raising this one
 * element to `paper-soft` (11.84:1, AAA) closes the failure at zero design cost. The open item
 * on the OTHER four routes is untouched — they are clones and this is not.
 *
 * ONE FACE, AND WHY THE EYEBROW IS NOT MONO. `--font-mono` (Fragment Mono) is loaded but its
 * @font-face unicode-ranges cover Latin, Greek and Cyrillic and NOT U+0590–05FF, so any
 * Hebrew set in it silently falls back to the OS monospace beside Discovery. The eyebrow says
 * "צרו קשר" in Hebrew, so it is `font-sans`. Mono is used on this page only where the glyphs
 * are Latin or numeric in BOTH locales — the group numerals, the counters, and the channel
 * grid's email and phone. See ContactChannels.tsx and ContactForm.tsx, which carry the same note.
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
        {/* Eyebrow. `paper-soft` — see the note above; this was `muted` and failed AA. */}
        <p
          className="font-sans text-[14px] font-medium text-paper-soft"
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
