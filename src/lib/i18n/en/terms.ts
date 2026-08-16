/**
 * English copy for /terms. **THIS FILE IS THE TRANSLATION; `he/terms.ts` is the SOURCE.**
 *
 * The namespace's SHAPE is defined here because `dictionary.ts` derives every page type from the
 * English file — a statement about types, not about which text came first.
 *
 * ⚠️ MACHINE TRANSLATION OF A LEGAL DOCUMENT, UNREVIEWED BY A LAWYER OR A NATIVE SPEAKER, AND
 * THE PAGE DOES NOT SAY SO. The "Hebrew version is binding" note that shipped with /privacy was
 * removed at the user's request on 2026-08-16, before these two pages existed, so they never
 * carried one. `he/terms.ts` is the source and is right by construction if the two diverge; that
 * fact lives in this comment rather than on the page.
 *
 * Faithful rather than fluent. `{email}` is a placeholder, not copy — see `he/privacy.ts`.
 *
 * ⚠️ Three clauses do not describe this build (a cookie consent dialog that does not exist, ad
 * cookies with no ad pixels behind them, and a self-contradiction about where the date sits).
 * Listed in `he/terms.ts` and in features/legal-pages/FEATURE.md; not corrected here.
 */

import type { LegalDoc } from "../legal";

export const terms = {
  eyebrow: "Legal · Terms",
  title: "Terms of Use",
  updatedLabel: "Last updated",
  updatedDate: "16 May 2026",

  sections: [
    {
      n: "01",
      title: "Fair use of the site",
      items: [
        "No material or information from the site may be copied, distributed, reproduced, published or passed to a third party without prior written permission.",
        "No technical action may be taken that could harm Clix’s computer systems or servers.",
      ],
    },
    {
      n: "02",
      title: "Limitation of liability",
      items: [
        "Use of Clix’s services and of the information on the site is at users’ sole responsibility.",
        "Clix bears no direct, indirect, tortious or financial liability arising from use of the information presented on the site.",
      ],
    },
    {
      n: "03",
      title: "Links to external sites",
      lead: [
        "The site may include links to external sites. Clix is not responsible for the content on those sites.",
      ],
    },
    {
      n: "04",
      title: "Updating these terms",
      lead: [
        "Clix may update, change or replace these terms of use at any time. The date of the most recent update appears at the bottom of the document.",
      ],
    },
    {
      n: "05",
      title: "Types of cookies",
      items: [
        "Essential cookies, for operating the site.",
        "Analytics cookies, for measuring the number of visits and pages.",
        "Marketing cookies, for showing tailored advertising on Facebook and Google.",
      ],
    },
    {
      n: "06",
      title: "Managing cookies",
      lead: [
        "On your first visit to the site you will be asked to approve the use of cookies. You may choose to accept all cookies or to set your preferences individually.",
      ],
    },
  ],

  closingLead: "Questions? Write to us at",
  closingTail: ".",
} as const satisfies LegalDoc;

/** The namespace's shape. `he/terms.ts` implements `Translated<TermsDict>`. */
export type TermsDict = typeof terms;
