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
 * `<input>`/`<textarea>` attributes in the same file, which is also where the two pill groups'
 * semantics were read — `aria-pressed` on the six "relevant" pills (multi-select) and
 * `role="radio"` on the four budget pills (single-select). That is a fact about the reference,
 * not a guess, and ContactForm.tsx reproduces both.
 *
 * ⚠️ TYPED AGAINST THE ENGLISH SHAPE, so a missing key, an extra key or a wrong tuple length
 * is a build failure rather than an English word on a Hebrew page.
 *
 * ⚠️ THE NO-DASHES RULE'S SECOND CARVE-OUT. The rule (2026-08-10) forbids dashes in clix copy.
 * `₪15k – ₪25k` and `א׳–ה׳` keep theirs, because both are the real site's own strings and both
 * are RANGES rather than prose — the same shape of exception as the Hebrew prefix hyphen in
 * `ב-WhatsApp`. Nothing authored below contains a dash.
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

  form: {
    groups: {
      /* AUTHORED — the reference has no legend over its first four inputs, only the four field
         labels. Our layout gives every group a numeral and a legend, so this one had to be
         written; it names what the group asks for and nothing more. */
      about: "עליכם",
      /* SOURCED — pages/contact.html, the legend over the six pills. */
      needs: "מה רלוונטי עבורכם?",
      /* SOURCED — the legend over the four budget pills. */
      budget: "טווח תקציב",
      /* SOURCED — the legend over the textarea. */
      brief: "ספרו לנו",
    },

    /* SOURCED — the four labels and their four `placeholder` attributes, in the reference's
       own order and pairing. */
    nameLabel: "שם מלא",
    namePlaceholder: "השם שלכם",
    emailLabel: "אימייל",
    emailPlaceholder: "you@company.com",
    companyLabel: "חברה",
    companyPlaceholder: "שם החברה או הפרויקט",
    roleLabel: "תפקיד",
    rolePlaceholder: "למשל מייסד, סמנכ״ל תפעול",

    /* SOURCED — all six, verbatim and in the reference's display order. "WhatsApp" and "CRM"
       stay Latin: they are product names, and the contract's rule 4 holds here as it does on
       /news. */
    needs: {
      "ai-agents": "סוכני AI",
      whatsapp: "WhatsApp",
      crm: "CRM",
      integrations: "אינטגרציות",
      "custom-software": "תוכנה מותאמת אישית",
      consulting: "ייעוץ",
    },

    /* SOURCED — all four bands verbatim, including the gap between ₪10k and ₪15k that the real
       site's own ladder leaves. Reproduced, not corrected: what the business advertises is not
       ours to tidy. */
    budget: {
      "upto-10k": "עד ₪10k",
      "15-25k": "₪15k – ₪25k",
      "25-75k": "₪25k – ₪75k",
      "75k-plus": "₪75k+",
    },

    /* SOURCED — the textarea's `placeholder`, verbatim. It is the best line on the reference
       form and the reason the English one is a translation rather than a rewrite. */
    messagePlaceholder: "גם שני משפטים כנים מספיקים. מהי הבעיה? מה כבר ניסיתם?",

    /* AUTHORED — the reference marks nothing optional. */
    optional: "לא חובה",

    /* SOURCED as prose, restructured as ONE string. The reference sets this as five runs
       because two of them are links to /privacy and /terms; this build has neither route, so
       the links are not reproduced and the sentence does not need splitting. Trailing full
       stop is the reference's own. */
    consent: "בשליחת הטופס הנכם מאשרים את מדיניות הפרטיות ואת תנאי השימוש שלנו.",

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
      tooLong: "זה ארוך מדי לשמירה.",
      messageRequired: "ספרו לנו בקצרה מה אתם צריכים.",
      messageTooShort: "משפט או שניים, כדי שנדע למה להשיב.",
      messageTooLong: "זה ארוך מדי לשמירה.",
      summary: "בדקו את השדות המסומנים.",
      failed: "משהו לא עבד בשליחה. שלחו לנו אימייל ישירות ונטפל בזה.",
      rateLimited: "אלו כמה הודעות בזמן קצר. נסו שוב בעוד רגע.",
    },

    a11y: {
      /* AUTHORED, all four. Nothing in the reference names these groups for assistive tech —
         its pills sit in bare divs — so these are ours, and they say what the interaction is
         rather than repeating the visible legend. */
      needsHint: "בחרו כל מה שרלוונטי.",
      budgetHint: "בחרו אפשרות אחת.",
      honeypot: "השאירו את השדה הזה ריק.",
      required: "חובה",
    },
  },
};
