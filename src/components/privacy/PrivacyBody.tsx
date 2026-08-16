/**
 * The ten numbered sections of /privacy, plus the closing line.
 *
 * ⚠️ THE ONE THING TO UNDERSTAND BEFORE EDITING THIS FILE: the contact details are NOT in the
 * dictionary. The captured policy prints `info@clixsolution.com` and `055-9483457`; the
 * unhyphenated address is stale (src/lib/contact.ts records the user's 2026-08-13 correction),
 * and on this page in particular a dead address is not a broken link — it is the channel a
 * person uses to exercise a statutory right to see, correct or delete their data. So the
 * dictionary strings carry `{email}` / `{phone}` placeholders and `renderRuns` below
 * substitutes `CONTACT_EMAIL` / `CONTACT_PHONE`, as real `mailto:` and `tel:` links. There is
 * exactly one source of truth for those two values in the whole repo and this page uses it.
 *
 * `interpolate()` is deliberately NOT used for them: it returns a string, and these need to be
 * ANCHORS. Hence the split-and-map below, which is the same "element stays in the component"
 * rule the dictionaries already state.
 *
 * ⚠️ RENDER ORDER IS `items` THEN `paras`. Section 06 is the only section that carries both —
 * two statutory rights (the enumeration) followed by a procedural note about submitting in
 * writing — and that is the order it needs. Every other section is purely one or the other.
 *
 * Enumerations render as a real `<ul>`. The source markup uses `<p>` for all thirty-odd runs
 * with no list anywhere, so this is an accessibility improvement over the original rather than
 * a reproduction of it: "the information we collect" is a list, and a screen reader should
 * announce it as one with a count.
 */

import { getDict } from "@/lib/i18n/server";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact";

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

/* ⚠️ THERE WAS AN ENGLISH-ONLY "this is a translation, the Hebrew version is binding" CALLOUT
   HERE UNTIL 2026-08-16, and it was removed at the user's explicit request after seeing it on
   the page. It is recorded here because its absence is a decision, not an oversight, and
   because the reasoning that put it there still applies: `en/privacy.ts` is an unreviewed
   machine translation of a legal instrument, so with no note the two routes now read as two
   equally authoritative versions of the same document and nothing on the page says which wins
   if they disagree. The concern was stated and the user's call stands. The strings came out of
   both dictionaries with it rather than lingering unread; git holds them. */

export default function PrivacyBody() {
  const t = getDict().privacy;

  return (
    <section
      data-nav-theme="light"
      className="relative flex w-full items-start justify-center bg-paper px-4 py-16 tablet:px-10 desktop:py-24"
    >
      <div className="relative flex w-px max-w-[var(--container-max)] flex-[1_0_0] flex-col items-start gap-14">
        <div className="flex w-full flex-col gap-12">
          {t.sections.map((section) => (
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

              {section.items.length > 0 && (
                <ul className="flex max-w-[var(--measure)] list-disc flex-col gap-2 ps-5 font-sans text-[16px] text-ink tablet:text-[18px]">
                  {section.items.map((item, i) => (
                    <li key={i} style={{ lineHeight: "1.6em" }}>
                      {renderRuns(item)}
                    </li>
                  ))}
                </ul>
              )}

              {section.paras.map((para, i) => (
                <p
                  key={i}
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
          {t.closingLead}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
            {CONTACT_EMAIL}
          </a>
          {t.closingTail}
        </p>
      </div>
    </section>
  );
}
