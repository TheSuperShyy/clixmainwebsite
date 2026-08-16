/**
 * Hebrew copy for /privacy. **THIS FILE IS THE SOURCE, and en/privacy.ts is the translation.**
 *
 * Same inversion as the `contact` namespace and for the same reason: the page exists on the
 * real company site, is `lang="he"`, and has no English version. Added 2026-08-16.
 *
 * PROVENANCE — SOURCED, essentially in full. Every sentence below is lifted VERBATIM from
 * `docs/reference/clixsolutions/pages/privacy.html`, which was re-checked against the live
 * https://www.clixsolutions.info/privacy on 2026-08-16: same ten sections, same order, same
 * `עדכון אחרון · 16 במאי 2026`. The only edits are the two documented below. Nothing here was
 * written by an agent, and nothing should be — this is a legal document, and "improving" its
 * wording is not a styling decision.
 *
 * ⚠️ EDIT 1 — THE CONTACT DETAILS ARE PLACEHOLDERS, NOT LITERALS. The capture prints
 * `info@clixsolution.com` (no hyphen) and `055-9483457`. The unhyphenated address is STALE:
 * src/lib/contact.ts records that the user confirmed on 2026-08-13 that the live inbox is the
 * hyphenated `info@clix-solution.com`. On any other page a stale address is a broken link; on
 * THIS page it is the channel through which a person exercises a statutory right to see,
 * correct or delete their data, so it cannot be allowed to drift. The strings therefore carry
 * `{email}` and `{phone}`, and PrivacyBody substitutes `CONTACT_EMAIL` / `CONTACT_PHONE` and
 * renders them as `mailto:` and `tel:` links. One source of truth, and a copy-paste of the old
 * address can never reappear here.
 *
 * ⚠️ A THIRD KEY, `authoritativeNote`, EXISTED HERE ON 2026-08-16 AND WAS REMOVED THE SAME DAY
 * at the user's request after they saw it rendered. It said the Hebrew text is the binding one.
 * Its absence is a decision, not an omission — see the header of `en/privacy.ts`.
 *
 * ⚠️ EDIT 2 — the closing line is split into `closingLead` / `closingTail` because the email
 * sits INSIDE the sentence as a link. Standing rule: the element stays in the component, only
 * the text runs move here. Same shape as the footer tagline's runs.
 *
 * ⚠️ THE NO-DASHES RULE DOES NOT APPLY TO THIS FILE, and forcing it would be a defect. The
 * standing 2026-08-10 instruction governs clix PROSE that this project authors. Everything
 * here is a quoted legal instrument, so it keeps its own punctuation: the `ל-{email}` prefix
 * hyphen in section 10 (the documented orthography carve-out), the phone number's hyphens, and
 * the gershayim in `״הסרה״`. Same carve-out `en/contact.ts` already makes for the budget
 * figures, and a stronger one — rewriting a published policy's punctuation changes a document
 * the company is legally bound by.
 *
 * ⚠️ RENDER ORDER IS `items` THEN `paras`. Section 06 is the only one that mixes the two, and
 * there the two statutory rights are the enumeration and the "submit in writing" line is the
 * procedural note that follows them. Every other section is purely one or the other, so the
 * order is invisible except in 06 — where it is correct.
 *
 * In the source markup all thirty-odd lines are `<p>`, with no `<ul>` anywhere. The split into
 * `items` vs `paras` below is therefore an editorial judgement about which runs are an
 * ENUMERATION (a list of collected fields, of purposes, of rights) and which are prose. It
 * changes no word; it exists so the enumerations can render as real `<ul>`s and be announced
 * as lists by a screen reader, which the original's wall of paragraphs is not.
 */

import type { Translated } from "../shape";
import type { PrivacyDict } from "../en/privacy";

export const privacy: Translated<PrivacyDict> = {
  /* SOURCED — the page's own eyebrow, "משפטי · פרטיות". */
  eyebrow: "משפטי · פרטיות",
  title: "מדיניות פרטיות",
  updatedLabel: "עדכון אחרון",
  updatedDate: "16 במאי 2026",

  sections: [
    {
      n: "01",
      title: "החברה ופרטי קשר",
      items: [],
      paras: [
        "Clix — חברת פתרונות אוטומציה עסקית.",
        "לפניות בנושאי פרטיות: באימייל {email} או בטלפון {phone}.",
      ],
    },
    {
      n: "02",
      title: "המידע שאנו אוספים",
      items: [
        "שם מלא.",
        "מספר טלפון.",
        "כתובת אימייל.",
        "שם העסק.",
        "תיעוד הפניות שביצעתם אלינו.",
        "נתוני שימוש סטטיסטיים באתר, לרבות עוגיות (Cookies).",
      ],
      paras: [],
    },
    {
      n: "03",
      title: "מטרות השימוש במידע",
      items: [
        "יצירת קשר עם משתמשים שביקשו לקבל פרטים.",
        "שליחת מידע שיווקי על שירותי האוטומציה והצעות מסחריות.",
        "תיאום שיחות ייעוץ ופגישות הדגמה.",
        "שיפור האתר וניתוח התנהגות באמצעות כלים סטטיסטיים.",
      ],
      paras: [],
    },
    {
      n: "04",
      title: "מסירת מידע לצד שלישי",
      items: [],
      paras: [
        "Clix אינה מוכרת מידע לצדדים שלישיים.",
        "Clix עשויה להעביר מידע לספקי שירות טכניים לצורך הפעלת המערכת (חיבור WhatsApp, Facebook, Mundi, n8n וכלי CRM נוספים). העברת המידע מתבצעת אך ורק לצורך הפעלת השירות, וכל ספק מחויב בשמירה על סודיות.",
      ],
    },
    {
      n: "05",
      title: "שמירת המידע",
      items: [],
      paras: [
        "המידע נשמר במאגר הנתונים של Clix. הגישה מוגבלת לצוות מורשה בלבד. Clix נוקטת באמצעי אבטחה טכנולוגיים וארגוניים למניעת גישה בלתי מורשית.",
      ],
    },
    {
      n: "06",
      title: "זכויות המשתמש על פי חוק הגנת הפרטיות",
      /* The only mixed section — see the render-order note in this file's header. */
      items: [
        "כל משתמש רשאי לפנות אלינו בבקשה לעיין במידע השמור אודותיו.",
        "כל משתמש רשאי לבקש לתקן, לעדכן או למחוק את המידע השמור.",
      ],
      paras: ["יש להגיש פניות בכתב לכתובת {email} או בטלפון {phone}."],
    },
    {
      n: "07",
      title: "תקופת שמירת המידע",
      items: [],
      paras: [
        "המידע נשמר כל עוד קיים צורך עסקי ותפעולי. ניתן לבקש מחיקה מלאה בכל עת.",
      ],
    },
    {
      n: "08",
      title: "שיווק ישיר ואישור משלוח הודעות",
      items: [
        "מסירת הפרטים בטופס מהווה אישור לקבלת הודעות שיווקיות, בהתאם לחוק התקשורת (סעיף 30א חוק הספאם).",
        "ניתן לבקש הסרה מרשימת התפוצה באמצעות הודעת הסרה באימייל, או הודעת WhatsApp עם המילה ״הסרה״.",
      ],
      paras: [],
    },
    {
      n: "09",
      title: "שימוש בעוגיות (Cookies)",
      items: [
        "האתר עושה שימוש בעוגיות לצורך תפעול האתר, מדידה סטטיסטית ושיפור חוויית המשתמש.",
        "ניתן למחוק עוגיות בהגדרות הדפדפן. השימוש באתר מהווה הסכמה לשימוש בעוגיות.",
      ],
      paras: [],
    },
    {
      n: "10",
      title: "מחיקת פרטים ופניות בנושא פרטיות",
      items: [],
      /* `ל-{email}` — the Hebrew prefix hyphen, kept. See the header. */
      paras: ["ניתן לפנות אלינו ל-{email} או בטלפון {phone}."],
    },
  ],

  closingLead: "יש שאלות? כתבו לנו אל",
  closingTail: ".",

};
