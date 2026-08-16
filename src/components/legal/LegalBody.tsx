/**
 * The numbered sections of a legal page, plus the closing line. Shared by /privacy, /terms and
 * /accessibility; was `PrivacyBody` until 2026-08-16.
 *
 * ⚠️ THE ONE THING TO UNDERSTAND BEFORE EDITING THIS FILE: the contact details are NOT in the
 * dictionaries. All three captured documents print `info@clixsolution.com` and `055-9483457`,
 * and the unhyphenated address is STALE — src/lib/contact.ts records the user's 2026-08-13
 * correction. On these pages a dead address is not a broken link: it is the channel a person
 * uses to exercise a statutory data right (privacy) or to report an accessibility barrier to a
 * named coordinator (accessibility). So the dictionary strings carry `{email}` / `{phone}`
 * placeholders and `renderRuns` substitutes `CONTACT_EMAIL` / `CONTACT_PHONE` as real `mailto:`
 * and `tel:` links. One source of truth for both values across the whole repo.
 *
 * `interpolate()` is deliberately NOT used for them: it returns a string, and these need to be
 * ANCHORS. Hence the split-and-map below, which is the same "element stays in the component"
 * rule the dictionaries already state.
 *
 * ⚠️ RENDER ORDER IS `lead` → `items` → `tail`. Paragraphs appear on BOTH sides of a list in
 * the real documents — the accessibility statement's section 06 is an intro paragraph, then the
 * coordinator's name/email/phone as a list, then a paragraph about response times — so a single
 * `paras` slot could not express them. Most sections use exactly one of the three.
 *
 * Enumerations render as a real `<ul>`. The source markup is `<p>` throughout with no list
 * anywhere, so this is an accessibility improvement over the originals rather than a
 * reproduction of them, and it is stated here so nobody later "restores" the wall of paragraphs.
 *
 * ⚠️ THERE WAS AN ENGLISH-ONLY "this is a translation, the Hebrew version is binding" CALLOUT
 * HERE UNTIL 2026-08-16, removed at the user's request after they saw it rendered. Its absence
 * is a decision, not an oversight — the reasoning that put it there is preserved in the header
 * of `en/privacy.ts`, and it now applies to three documents rather than one.
 */

import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact";
import type { LegalDoc } from "@/lib/i18n/legal";

/* `tel:` wants no spaces or punctuation; CONTACT_PHONE is the human-readable form. */
const TEL_HREF = `tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`;

const LINK_CLASS =
  "underline underline-offset-2 transition-colors duration-300 hover:text-muted focus-visible:ring-2 focus-visible:ring-ink focus-visible:outline-none";

/**
 * Splits a dictionary string on `{email}` / `{phone}` and returns text runs with the two
 * placeholders replaced by anchors. Unknown placeholders are left verbatim, matching
 * `interpolate()`'s own rule — a visible `{foo}` reports itself as a bug where the string
 * "undefined" would read as content.
 */
function renderRuns(text: string) {
  return text.split(/(\{email\}|\{phone\})/g).map((run, i) => {
    if (run === "{email}") {
      return (
        <a key={i} href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
          {CONTACT_EMAIL}
        </a>
      );
    }
    if (run === "{phone}") {
      /* `dir="ltr"` and bidi isolation: a phone number is LTR digits inside an RTL sentence,
         and without isolation the surrounding Hebrew reorders its `+` and hyphens. Same
         treatment the news board gives Latin product names. */
      return (
        <a
          key={i}
          href={TEL_HREF}
          dir="ltr"
          className={`${LINK_CLASS} [unicode-bidi:isolate]`}
        >
          {CONTACT_PHONE}
        </a>
      );
    }
    return run;
  });
}

export default function LegalBody({ doc }: { doc: LegalDoc }) {
  return (
    <section
      data-nav-theme="light"
      className="relative flex w-full items-start justify-center bg-paper px-4 py-16 tablet:px-10 desktop:py-24"
    >
      <div className="relative flex w-px max-w-[var(--container-max)] flex-[1_0_0] flex-col items-start gap-14">
        <div className="flex w-full flex-col gap-12">
          {doc.sections.map((section) => (
            <section
              key={section.n}
              className="flex w-full flex-col items-start gap-3"
            >
              <p className="font-sans text-[14px] font-medium text-muted tabular-nums">
                {section.n}
              </p>

              <h2
                className="max-w-[var(--measure)] font-display text-[24px] text-ink tablet:text-[28px]"
                style={{ lineHeight: "1.2em", letterSpacing: "-0.03em" }}
              >
                {section.title}
              </h2>

              {(section.lead ?? []).map((para, i) => (
                <p
                  key={`lead-${i}`}
                  className="max-w-[var(--measure)] font-sans text-[16px] text-ink tablet:text-[18px]"
                  style={{ lineHeight: "1.6em" }}
                >
                  {renderRuns(para)}
                </p>
              ))}

              {(section.items?.length ?? 0) > 0 && (
                <ul className="flex max-w-[var(--measure)] list-disc flex-col gap-2 ps-5 font-sans text-[16px] text-ink tablet:text-[18px]">
                  {section.items!.map((item, i) => (
                    <li key={i} style={{ lineHeight: "1.6em" }}>
                      {renderRuns(item)}
                    </li>
                  ))}
                </ul>
              )}

              {(section.tail ?? []).map((para, i) => (
                <p
                  key={`tail-${i}`}
                  className="max-w-[var(--measure)] font-sans text-[16px] text-ink tablet:text-[18px]"
                  style={{ lineHeight: "1.6em" }}
                >
                  {renderRuns(para)}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="max-w-[var(--measure)] font-sans text-[16px] text-ink tablet:text-[18px]">
          {doc.closingLead}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
            {CONTACT_EMAIL}
          </a>
          {doc.closingTail}
        </p>
      </div>
    </section>
  );
}
