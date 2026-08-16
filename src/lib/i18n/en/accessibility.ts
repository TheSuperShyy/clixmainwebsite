/**
 * English copy for /accessibility. **THIS FILE IS THE TRANSLATION; `he/accessibility.ts` is the
 * SOURCE.** The namespace's SHAPE is defined here because `dictionary.ts` derives page types
 * from the English file.
 *
 * ⚠️ READ THE BLOCK AT THE TOP OF `he/accessibility.ts` BEFORE EDITING EITHER FILE. It records,
 * item by item, which of this declaration's promises are false about this build — the skip-to-
 * content link that does not exist, the WCAG AA contrast claim this repo's own docs contradict
 * in at least six places, the screen-reader testing that never happened, and a chat that is not
 * on the site. That is not commentary; it is the difference between a statement and a promise
 * nobody kept, on a page that names a real person as responsible for it.
 *
 * ⚠️ MACHINE TRANSLATION OF A LEGAL DECLARATION, UNREVIEWED, and the page does not say so — the
 * "Hebrew version is binding" note was removed at the user's request before this page existed.
 * `he/accessibility.ts` is the source and is right by construction if the two diverge.
 *
 * Israeli instruments are named as themselves: standard SI 5568, regulation 35 of the Equal
 * Rights for Persons with Disabilities (Accessibility Adjustments to Service) Regulations,
 * 5773-2013. Not swapped for ADA or EN 301 549, which are different instruments.
 *
 * `{email}` / `{phone}` are placeholders. The coordinator's NAME is kept verbatim.
 */

import type { LegalDoc } from "../legal";

export const accessibility = {
  eyebrow: "Legal · Accessibility",
  title: "Accessibility Statement",
  updatedLabel: "Last updated",
  updatedDate: "16 May 2026",

  sections: [
    {
      n: "01",
      title: "Statement of intent",
      lead: [
        "Clix regards accessibility as a basic right of every user. We invest continuous effort to ensure that our site, products and services are accessible to the widest possible audience, including people with motor, visual, hearing and cognitive disabilities.",
        "At Clix we treat accessibility work as an inseparable part of quality, and not as a bit of markup added at the end of a project. We test, we fix, and we test again.",
      ],
    },
    {
      n: "02",
      title: "The standards we work to",
      lead: [
        "The site is built for conformance with WCAG 2.1 level AA, published by the W3C as the international standard for web accessibility, and with the Israeli standard SI 5568, which appears in regulation 35 of the Equal Rights for Persons with Disabilities (Accessibility Adjustments to Service) Regulations, 5773-2013.",
        "Wherever the site does not yet meet level AA on a particular page or component, the gap is recorded as a defect rather than a permanent limitation, and is prioritised accordingly.",
      ],
    },
    {
      n: "03",
      title: "Accessibility features built into the site",
      items: [
        "Semantic HTML including landmark regions (header, nav, main, footer), so that screen readers can navigate the structure of the page.",
        "Full keyboard operation. Every link, button, form field and interactive component is reachable and usable without a mouse.",
        "Visible focus indicators on every interactive element.",
        "A “skip to content” link at the top of every page, revealed on the first press of Tab.",
        "Colour contrast conforming to WCAG AA on body text and on interactive elements; the brand palette was measured, not merely assumed.",
        "Respect for the prefers-reduced-motion media query. Every animation, 3D scene, parallax effect and continuous loop collapses to a static frame when the operating system asks for reduced motion.",
        "Descriptive alternative text on meaningful images; purely decorative graphics are marked aria-hidden so they do not interrupt screen readers.",
        "Form fields with explicit labels, error messages tied to the relevant field, and controls grouped where appropriate.",
        "A responsive layout that reflows cleanly down to 320 pixels with no horizontal scrolling, and supports text enlargement of up to 200% without loss of content.",
        "ARIA live regions for status messages (form submission, chat updates) so that every change is announced to assistive technology.",
      ],
    },
    {
      n: "04",
      title: "Compatible assistive technology",
      lead: [
        "The site has been tested with VoiceOver on macOS and iOS, with NVDA on Windows, and with keyboard-only navigation on the last two stable versions of Chrome, Safari, Firefox and Edge.",
        "We recommend updating your browser and your screen reader to the latest stable version for the best experience.",
      ],
    },
    {
      n: "05",
      title: "Pages and components still being made accessible",
      items: [
        "The node editor in the playground is currently operated by mouse and touch only; keyboard-only drag and drop on the canvas is on our roadmap.",
        "Some of the background 3D scenes are decorative. They collapse to a static alternative under reduced motion, but the 3D itself is not described to screen readers (the surrounding content carries all of the meaning).",
        "Third-party embedded content (YouTube, calendar embeds and the like) is subject to those providers’ own level of accessibility, and may not fully match the rest of the site.",
      ],
    },
    {
      n: "06",
      title: "Accessibility coordinator",
      lead: [
        "If you have encountered an accessibility barrier on the site, or you have feedback or questions about accessibility at Clix, we would be glad to hear from our accessibility coordinator.",
      ],
      items: [
        "Name: Almaliach Ido, founder and accessibility coordinator.",
        "Email: {email} (subject: accessibility).",
        "Phone: {phone}.",
      ],
      tail: [
        "We treat accessibility reports as our highest priority, aim to acknowledge them within one business day, and to resolve them or provide an interim response within a reasonable time according to complexity.",
      ],
    },
    {
      n: "07",
      title: "Changes to this statement",
      lead: [
        "This statement is reviewed and updated on every material change to the site and with every accessibility improvement release we ship. The last-updated date at the bottom of the page reflects the current version.",
        "Last updated: 16 May 2026.",
      ],
    },
  ],

  closingLead: "Questions? Write to us at",
  closingTail: ".",
} as const satisfies LegalDoc;

/** The namespace's shape. `he/accessibility.ts` implements `Translated<AccessibilityDict>`. */
export type AccessibilityDict = typeof accessibility;
