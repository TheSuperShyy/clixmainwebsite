/**
 * Hebrew copy for /terms. **THIS FILE IS THE SOURCE, and en/terms.ts is the translation.**
 *
 * Added 2026-08-16 at the user's request (*"copy this https://www.clixsolutions.info/terms"*).
 * Same inversion as `privacy` and `contact`: the page exists only in Hebrew on the real site.
 *
 * PROVENANCE — SOURCED in full. Every sentence is lifted VERBATIM from
 * `docs/reference/clixsolutions/pages/terms.html`, re-checked against the live page the same
 * day: six sections, same order, eyebrow `משפטי · תנאים`, `עדכון אחרון · 16 במאי 2026`.
 *
 * ⚠️ THE CONTACT DETAILS ARE `{email}` PLACEHOLDERS, NOT LITERALS — the published address is
 * stale. Read the header of `he/privacy.ts`; the reasoning is identical and is not repeated.
 *
 * ⚠️ THE NO-DASHES RULE DOES NOT APPLY HERE. Quoted legal text keeps its own punctuation.
 *
 * ⚠️ TWO CLAUSES DESCRIBE THINGS THIS SITE DOES NOT DO, and both are left exactly as published
 * because rewriting a legal document is not a developer's call:
 *
 *   · §06 says a visitor is asked to approve cookies on first entry and can set preferences.
 *     **THIS SITE HAS NO COOKIE BANNER AND NO CONSENT UI OF ANY KIND** — while `FooterMap.tsx`
 *     embeds a Google Map that sets third-party cookies on every page. So the one clause that
 *     promises a consent gate sits on a site whose only third-party cookie has none.
 *   · §05 lists marketing cookies for Facebook and Google ads. There are no ad pixels in this
 *     repo — no gtag, no GTM, no Facebook Pixel. Grepped 2026-08-16.
 *
 *   · §04 says the last-updated date appears at the BOTTOM of the document. On the live page,
 *     and therefore here, it is at the TOP. The source contradicts itself; kept as published.
 *
 * All three are recorded in features/legal-pages/FEATURE.md for the user and their lawyer.
 */

import type { Translated } from "../shape";
import type { TermsDict } from "../en/terms";

export const terms: Translated<TermsDict> = {
  eyebrow: "משפטי · תנאים",
  title: "תנאי שימוש",
  updatedLabel: "עדכון אחרון",
  updatedDate: "16 במאי 2026",

  sections: [
    {
      n: "01",
      /* ADDED 2026-08-17. Present on the live https://www.clix-solution.com/terms as its first
         heading and absent from this port entirely — this is the clause that makes the rest of
         the document binding, so its absence was the sharpest content gap on the page. */
      title: "כללי",
      lead: [
        "השימוש באתר ובדף הנחיתה של קליקס מהווה הסכמה מלאה לתנאי שימוש אלו. אם אינך מסכים לתנאים, אנא הימנע משימוש באתר.",
      ],
    },
    {
      n: "02",
      title: "שימוש הוגן באתר",
      items: [
        "אין להעתיק, להפיץ, לשכפל, לפרסם או למסור כל חומר או מידע מהאתר לצד שלישי, ללא אישור מראש ובכתב.",
        "אין לבצע פעולות טכניות שעלולות לפגוע במערכות המחשוב או בשרתי Clix.",
      ],
    },
    {
      n: "03",
      title: "הגבלת אחריות",
      items: [
        "השימוש בשירותי Clix ובמידע באתר הוא באחריותם הבלעדית של המשתמשים.",
        "Clix לא תישא בכל אחריות ישירה, עקיפה, נזיקית או כספית בגין השימוש במידע המוצג באתר.",
      ],
    },
    {
      n: "04",
      title: "קישורים לאתרים חיצוניים",
      lead: [
        "האתר עשוי לכלול קישורים לאתרים חיצוניים. Clix אינה אחראית לתוכן באתרים אלה.",
      ],
    },
    {
      n: "05",
      title: "עדכון התנאים",
      /* ⚠️ "בתחתית המסמך" — the live page puts the date at the TOP. Kept as published. */
      lead: [
        "Clix רשאית לעדכן, לשנות או להחליף תנאי שימוש אלה בכל עת. תאריך העדכון האחרון יופיע בתחתית המסמך.",
      ],
    },
    {
      n: "06",
      title: "סוגי עוגיות",
      /* ⚠️ The third line names Facebook and Google advertising cookies. This repo has no ad
         pixel of any kind. Kept as published; flagged in FEATURE.md. */
      items: [
        "עוגיות חיוניות לתפעול האתר.",
        "עוגיות ניתוח למדידת מספר ביקורים ועמודים.",
        "עוגיות שיווק להצגת פרסומות מותאמות בפייסבוק ובגוגל.",
      ],
    },
    {
      n: "07",
      title: "ניהול העוגיות",
      /* ⚠️ THE SHARPEST MISMATCH ON THIS PAGE — this promises a consent dialog that does not
         exist anywhere in this build. Kept as published; flagged in FEATURE.md. */
      lead: [
        "בכניסה הראשונה לאתר תתבקשו לאשר את השימוש בעוגיות. ניתן לבחור באישור כל העוגיות או להגדיר את ההעדפות באופן אישי.",
      ],
      /* ADDED 2026-08-17. The live page's closing line. It has no heading of its own there, so
         it rides the last section's `tail` rather than becoming a phantom §08. */
      tail: [
        "© כל הזכויות שמורות לקליקס | השימוש באתר כפוף למדיניות פרטיות, תנאי שימוש ומדיניות עוגיות",
      ],
    },
  ],

  closingLead: "יש שאלות? כתבו לנו אל",
  closingTail: ".",
};
