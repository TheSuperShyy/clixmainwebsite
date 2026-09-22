/**
 * Hebrew copy for /contact. OWNED BY ONE AGENT.
 *
 * ⚠️ THIS FILE IS THE ORIGINAL, NOT THE TRANSLATION, AND IT IS THE ONLY NAMESPACE ON THE SITE
 * WHERE THAT IS TRUE. Every other Hebrew file restores an English string that was rendered out
 * of Hebrew in the first place. This one is lifted straight off the company's real contact
 * form — docs/reference/clixsolutions/pages/contact.html — so nearly every string below is
 * SOURCED, and en/contact.ts is what had to be written.
 *
 * PROVENANCE IS MANDATORY, as everywhere:
 *   · SOURCED  — lifted from docs/reference/clixsolutions/. Path given.
 *   · AUTHORED — written in that captured voice because no counterpart exists.
 *
 * The extraction that produced these strings: `pages/contact.html`, tags stripped, whitespace
 * collapsed. The five `placeholder=` values and the three `required=""` flags came off the
 * `<input>`/`<textarea>` attributes in the same file.
 *
 * ⚠️ THE REFERENCE'S TWO PILL GROUPS ARE NOT HERE (removed 2026-09-22, user's call). "מה
 * רלוונטי עבורכם?" and "טווח תקציב" were SOURCED strings; they left this file, the English
 * one, ContactForm.tsx and the API route together.
 *
 * ⚠️ TYPED AGAINST THE ENGLISH SHAPE, so a missing key, an extra key or a wrong tuple length
 * is a build failure rather than an English word on a Hebrew page.
 *
 * ⚠️ THE NO-DASHES RULE'S SECOND CARVE-OUT. The rule (2026-08-10) forbids dashes in clix copy.
 * `א׳–ה׳` keeps its own, because it is the real site's own string and a RANGE rather than
 * prose — the same shape of exception as the Hebrew prefix hyphen in `ב-WhatsApp`. Nothing
 * authored below contains a dash.
 *
 * Geresh `׳` (U+05F3) and gershayim `״` (U+05F4), never ASCII quotes — `א׳–ה׳`, `סמנכ״ל`.
 */

import type { Translated } from "../shape";
import type { ContactDict } from "../en/contact";

export const contact: Translated<ContactDict> = {
  hero: {
    /* SOURCED — pages/contact.html, the page's own eyebrow above the h1. Also the label the
       real site's nav uses for this destination. */
    eyebrow: "צרו קשר",
    /* SOURCED — pages/contact.html h1, "ספרו לנו מה אתם מתכננים לבנות.", recovered from the
       HTML rather than content.json (whose H1 extractor lost every space — see the contract).
       Split into the three runs the original itself sets: the middle word carries a different
       colour there and does here. Not a tuple, not an array: three named keys, because the
       break is a COLOUR boundary and markup never enters a dictionary. */
    headlineA: "ספרו לנו מה",
    headlineB: "אתם",
    headlineC: "מתכננים לבנות.",
  },

  aside: {
    /* SOURCED — all four labels, pages/contact.html's own contact panel, in its order. */
    emailLabel: "אימייל",
    whatsappLabel: "WhatsApp",
    hoursLabel: "שעות פעילות",
    /* SOURCED verbatim, en dash and both gereshim included. */
    hoursValue: "א׳–ה׳ · 09:00–18:00",
    locationLabel: "מיקום",
    /* SOURCED — "פעילות גלובלית". The English says "Global" because "global activity" is not
       something an English contact panel says; the meaning is that there is no one office. */
    locationValue: "פעילות גלובלית",
  },

  /* AUTHORED, all three — the reference's form is a single centred card with no heading column
     beside it, so there is nothing to source. Register follows the captured voice: plain,
     second person plural, no exclamation, no dashes. `reply` restates `successBody`'s promise
     in the shorter form the rail needs. */
  panel: {
    title: "בריף אחד, ואז תשובה אמיתית.",
    /* ⚠️ BOTH COUNTS CHANGED 2026-09-22: two steps (the needs and budget groups were removed)
       and three required fields (name, email, phone — `message` has been optional since
       2026-08-19). Same obligation as the English string it mirrors: if a field stops being
       required or a group goes, this sentence changes too. */
    intro: "שני שלבים קצרים, שלושה שדות חובה, וכל השאר רק עוזר לנו לענות טוב יותר.",
    reply: "אנחנו משיבים תוך יום עסקים אחד.",
  },

  form: {
    groups: {
      /* AUTHORED — the reference has no legend over its first four inputs, only the four field
         labels. Our layout gives every group a numeral and a legend, so this one had to be
         written; it names what the group asks for and nothing more. */
      about: "עליכם",
      /* SOURCED — pages/contact.html, the legend over the textarea. */
      brief: "ספרו לנו",
    },

    /* SOURCED — the four labels and their four `placeholder` attributes, in the reference's
       own order and pairing. */
    nameLabel: "שם מלא",
    namePlaceholder: "השם שלכם",
    emailLabel: "אימייל",
    emailPlaceholder: "you@company.com",
    /* AUTHORED — `phone` has no counterpart in the reference, which collects four fields. Added
       2026-08-18 because the n8n workflow behind the form messages the lead on WhatsApp. The
       placeholder stays in Latin digits with a `+`: a phone number is not translated, and the
       `+` is what saves the workflow a guess at the country. */
    phoneLabel: "טלפון",
    phonePlaceholder: "+972 50 000 0000",
    companyLabel: "חברה",
    companyPlaceholder: "שם החברה או הפרויקט",
    roleLabel: "תפקיד",
    rolePlaceholder: "למשל מייסד, סמנכ״ל תפעול",

    /* SOURCED — the textarea's `placeholder`, verbatim. It is the best line on the reference
       form and the reason the English one is a translation rather than a rewrite. */
    messagePlaceholder: "גם שני משפטים כנים מספיקים. מהי הבעיה? מה כבר ניסיתם?",

    /* AUTHORED — the reference marks nothing optional. */
    optional: "לא חובה",

    /* SOURCED, and now WITH the reference's two links (2026-08-18) — see the English file for
       why they were absent until /privacy and /terms existed.

       ⚠️ THE REFERENCE'S OWN WORDING AND ORDER, WHICH ARE NOT THE ENGLISH ONE'S. It is a
       first-person acknowledgement beside a checkbox ("אני מאשר/ת"), not a statement about
       what sending does, and it names תנאי השימוש BEFORE מדיניות הפרטיות. The `{terms}` and
       `{privacy}` tokens are why that costs nothing: each locale places them where its own
       sentence wants them. The clause about keeping the details on file is the reference's
       too, and it carries no full stop — also the reference's. */
    consent:
      "אני מאשר/ת את {terms} ואת {privacy}, ומסכים/ה לשמירת פרטיי ליצירת קשר",
    consentPrivacy: "מדיניות הפרטיות",
    consentTerms: "תנאי השימוש",

    /* SOURCED — the submit button's label. */
    submit: "שלחו",
    /* AUTHORED — no in-flight state is observable in a static capture. */
    submitting: "שולחים",

    /* AUTHORED, all four — the reference's confirmation is rendered by JS the capture never
       ran, so there is nothing to source. Register follows the captured voice: plain, second
       person plural, no exclamation. */
    successEyebrow: "נשלח",
    successTitle: "תודה. קיבלנו.",
    successBody: "אנחנו קוראים כל הודעה בעצמנו ומשיבים תוך יום עסקים אחד.",

    /* AUTHORED, every one — the reference's form is `noValidate` and its messages are in the
       script the capture did not include. */
    errors: {
      nameRequired: "נשמח לדעת מה שמכם.",
      nameTooLong: "זה ארוך מדי לשמירה.",
      emailRequired: "נשמח לאימייל כדי שנוכל להשיב.",
      emailInvalid: "הכתובת הזו לא נראית כמו אימייל.",
      phoneRequired: "נשמח למספר טלפון כדי שנוכל להגיע אליכם בוואטסאפ.",
      phoneInvalid: "המספר הזה לא נראה כמו מספר טלפון.",
      tooLong: "זה ארוך מדי לשמירה.",
      messageRequired: "ספרו לנו בקצרה מה אתם צריכים.",
      messageTooShort: "משפט או שניים, כדי שנדע למה להשיב.",
      messageTooLong: "זה ארוך מדי לשמירה.",
      summary: "בדקו את השדות המסומנים.",
      failed: "משהו לא עבד בשליחה. שלחו לנו אימייל ישירות ונטפל בזה.",
      rateLimited: "אלו כמה הודעות בזמן קצר. נסו שוב בעוד רגע.",
      /* AUTHORED — see the English file for when this is actually reached. */
      consentRequired: "יש לסמן את התיבה ולאשר את התנאים לפני השליחה.",
    },

    a11y: {
      /* AUTHORED — announced by an sr-only role="status", never seen. `{n}` is filled by
         interpolate(); the digits render Western in Hebrew as they do on the rest of the
         site. */
      charsLeft: "נותרו בערך {n} תווים.",
      honeypot: "השאירו את השדה הזה ריק.",
      required: "חובה",
    },
  },
};
