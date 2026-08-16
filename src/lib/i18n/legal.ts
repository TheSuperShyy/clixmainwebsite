/**
 * The shape shared by every legal page — /privacy, /terms and /accessibility.
 *
 * WHY THIS EXISTS (2026-08-16). /privacy was built first and shipped with its own
 * `PrivacyHero` + `PrivacyBody`. When `terms` and `accessibility` followed the next hour it was
 * clear all three are the SAME DOCUMENT TYPE: an eyebrow, a title, a last-updated line, a run of
 * numbered sections, and a closing "questions?" line. Copying 150 lines of component three times
 * would have meant three places to fix the next contrast or bidi bug. So the components moved to
 * `src/components/legal/` and this file states the contract they render.
 *
 * All three real pages share it exactly — verified against the live site, not assumed: each has
 * the `משפטי · X` eyebrow, each carries `עדכון אחרון · 16 במאי 2026` at the top, and each closes
 * on the same sentence.
 *
 * ⚠️ THREE FIELDS PER SECTION, IN RENDER ORDER: `lead` → `items` → `tail`.
 *
 * The first draft had only `items` and `paras`, which could not express the accessibility
 * statement's section 06: an intro paragraph, then the coordinator's name/email/phone as a list,
 * then a paragraph about response times. Paragraphs appear on BOTH sides of a list in the real
 * documents, so the shape needs both slots. Most sections use exactly one of the three.
 *
 * ⚠️ The source markup for all three pages is `<p>` throughout, with no `<ul>` anywhere. Sorting
 * runs into `items` is an editorial judgement about which are enumerations — it changes no word,
 * and it exists so a screen reader announces them as lists with a count.
 */

export interface LegalSection {
  /** "01".."10". A string, not a number — it is a label, and its leading zero is part of it. */
  readonly n: string;
  readonly title: string;
  /* All three are OPTIONAL, and an omitted slot means "this section has none". Most sections
     use exactly one of them, so requiring all three would fill the documents with `items: []`
     noise — and in a file where every line is quoted legal text, noise is a hazard. LegalBody
     defaults each to an empty array. */
  /** Paragraphs BEFORE the list. */
  readonly lead?: readonly string[];
  /** The enumeration, rendered as a real `<ul>`. */
  readonly items?: readonly string[];
  /** Paragraphs AFTER the list. */
  readonly tail?: readonly string[];
}

export interface LegalDoc {
  /** "משפטי · פרטיות" / "Legal · Privacy". */
  readonly eyebrow: string;
  readonly title: string;
  readonly updatedLabel: string;
  readonly updatedDate: string;
  readonly sections: readonly LegalSection[];
  /**
   * The closing line, split because the email sits INSIDE the sentence as a link. Standing rule:
   * the element stays in the component, only the text runs live in a dictionary.
   */
  readonly closingLead: string;
  readonly closingTail: string;
}

/**
 * Which dictionary namespace a legal route renders. Keeps `LegalRoute` from having to accept an
 * arbitrary `LegalDoc` from a page shell — the shells must not call `getDict()` themselves,
 * because the locale is not seeded until the route body runs.
 */
export type LegalNamespace = "privacy" | "terms" | "accessibility";
