/**
 * English copy for /privacy. **THIS FILE IS THE TRANSLATION; `he/privacy.ts` is the SOURCE.**
 *
 * Same inversion as the `contact` namespace — the page exists on the real company site, is
 * `lang="he"`, and has no English version. The namespace's SHAPE is nevertheless defined here,
 * because `dictionary.ts` derives every page type from the English file; that is a statement
 * about types, not about which text came first.
 *
 * ⚠️ THIS IS A MACHINE TRANSLATION OF A LEGAL DOCUMENT AND HAS NOT BEEN REVIEWED BY A LAWYER
 * OR BY A NATIVE SPEAKER, AND THE PAGE NO LONGER SAYS SO.
 *
 * It shipped on 2026-08-16 under an `authoritativeNote` stating that the Hebrew text governs.
 * The user saw that callout on the page the same day and asked for it to be removed; the
 * concern was stated once and the call is theirs. The key is gone from both dictionaries.
 *
 * What that changes: `/privacy` and `/he/privacy` now read as two equally authoritative
 * versions of one legal document, and nothing on either page resolves a conflict between them.
 * `he/privacy.ts` is still the source and is still right by construction if they diverge — that
 * fact simply lives in this comment now instead of on the page. Getting this file reviewed is
 * the other way to close the gap.
 *
 * Translated to be FAITHFUL, not fluent. Where the Hebrew names an Israeli statute it is named
 * here too, with the Hebrew term in parentheses, rather than swapped for a nearest-equivalent
 * foreign concept — "the Protection of Privacy Law" is a specific instrument and GDPR
 * vocabulary would misdescribe it. Section 08's `סעיף 30א` is likewise kept as its own
 * citation.
 *
 * ⚠️ `{email}` / `{phone}` are placeholders, NOT copy — PrivacyBody substitutes the canonical
 * values from src/lib/contact.ts. Read the header of `he/privacy.ts` for why the addresses are
 * not literals here; it matters more than it looks.
 *
 * ⚠️ NO DASHES does not apply to this namespace either. It is a translation of a quoted legal
 * instrument, and the rule governs prose this project authors. Curly apostrophes are still used
 * where English needs one.
 */

export const privacy = {
  eyebrow: "Legal · Privacy",
  title: "Privacy Policy",
  updatedLabel: "Last updated",
  /* The DATE is translated, the date itself is not moved. "16 במאי 2026" is 16 May 2026. */
  updatedDate: "16 May 2026",

  sections: [
    {
      n: "01",
      title: "The company and contact details",
      lead: [
        "CLIX — automation solutions for businesses",
        "For privacy enquiries: by email at {email} or by phone at {phone}.",
      ],
    },
    {
      n: "02",
      /* ADDED 2026-08-17 — see he/privacy.ts. */
      title: "Introduction",
      lead: [
        "This document sets out how Clix collects, uses, stores and protects information provided in the course of using the landing page and the company’s services.",
      ],
    },
    {
      n: "03",
      title: "The information we collect",
      lead: [],
      items: [
        "Full name.",
        "Phone number.",
        "Email address.",
        "Business name.",
        "A record of the enquiries you have made to us.",
        "Statistical usage data on the site, including cookies.",
      ],
      tail: [],
    },
    {
      n: "04",
      title: "Purposes for which the information is used",
      lead: [],
      items: [
        "Contacting users who asked to receive details.",
        "Sending marketing information about our automation services and commercial offers.",
        "Scheduling consultation calls and demonstration meetings.",
        "Improving the site and analysing behaviour using statistical tools.",
      ],
      tail: [],
    },
    {
      n: "05",
      title: "Disclosure of information to third parties",
      lead: [
        "Clix does not sell information to third parties.",
        "Clix may pass information to technical service providers in order to operate the system (WhatsApp, Facebook, Mundi and n8n connections, and further CRM tools). Information is transferred solely for the purpose of operating the service, and every provider is bound to maintain confidentiality.",
      ],
    },
    {
      n: "06",
      title: "Storage of the information",
      lead: [
        "The information is held in the Clix database. Access is restricted to authorised staff only. Clix applies technological and organisational security measures to prevent unauthorised access.",
      ],
    },
    {
      n: "07",
      title: "User rights under the Protection of Privacy Law",
      lead: [],
      items: [
        "Every user is entitled to contact us with a request to review the information held about them.",
        "Every user is entitled to request that the information held be corrected, updated or deleted.",
      ],
      tail: [
        "Requests must be submitted in writing to {email}, or by phone at {phone}.",
      ],
    },
    {
      n: "08",
      title: "Retention period",
      lead: [
        "Information is retained for as long as a business and operational need exists. Full deletion may be requested at any time.",
      ],
    },
    {
      n: "09",
      title: "Direct marketing and consent to receive messages",
      lead: [],
      items: [
        "Submitting your details through the form constitutes consent to receive marketing messages, in accordance with the Communications Law (section 30a, the Spam Law).",
        "You may ask to be removed from the mailing list by sending a removal request by email, or a WhatsApp message with the word “removal”.",
      ],
      tail: [],
    },
    {
      n: "10",
      title: "Use of cookies",
      lead: [],
      items: [
        "The site uses cookies in order to operate the site, for statistical measurement and to improve the user experience.",
        "Cookies can be deleted in your browser settings. Use of the site constitutes consent to the use of cookies.",
      ],
      tail: [],
    },
    {
      n: "11",
      title: "Deleting your details and privacy enquiries",
      lead: ["You can contact us at {email} or by phone at {phone}."],
    },
  ],

  closingLead: "Questions? Write to us at",
  closingTail: ".",

} as const;

/** The namespace's shape. `he/privacy.ts` implements `Translated<PrivacyDict>`. */
export type PrivacyDict = typeof privacy;
