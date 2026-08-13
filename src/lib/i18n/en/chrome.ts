/**
 * English shared chrome — Nav + Footer, rendered on all 6 routes (7 until /careers was
 * removed on 2026-08-13).
 *
 * Every string here is EXTRACTED VERBATIM from the component it used to live in. This file
 * introduces no new copy and changes no existing copy: the English render must stay
 * byte-identical, because the whole LTR pass is verified as a no-op against the block-diff
 * baseline. If a string here differs from what the component said, that is a bug in this file.
 */

import type { ChromeDict } from "../dictionary";

export const chrome: ChromeDict = {
  nav: {
    /* Six slots, in Nav.tsx's own order. `Clix` is the brand and is Latin in every locale.
       `Careers` was the seventh and came out with its route on 2026-08-13. */
    labels: [
      "Clix",
      "Product",
      "Security",
      "Company",
      "Customers",
      "News",
    ],
    cta: "Let’s start",
  },

  footer: {
    groupTitles: ["Overview", "Company", "Legal", "Contact"],
    links: {
      services: "Services",
      industries: "Industries",
      work: "Work",
      /* Labelled "About" here and "Company" in the nav, both pointing at /company. The lists
         differ because each kept its own capture's wording; preserved deliberately. */
      about: "About",
      insights: "Insights",
      playground: "Playground",
      terms: "Terms of Use",
      privacy: "Privacy Policy",
      accessibility: "Accessibility",
      letsStart: "Let’s start",
      email: "Email",
      instagram: "Instagram",
      whatsapp: "WhatsApp",
    },
    /* [["Software", "that works,"], ["results that speak."]] — the phone tier draws a break
       between "Software" and "that works,"; the wider tiers weld them. Trailing space handling
       stays in the component, where `display:none` on the break preserves it. */
    tagline: [["Software", "that works,"], ["results that speak."]],
    cta: "Let’s start",
    copyrightYear: "© 2026",
    copyrightHolder: "clix",
    mapTitle: "Map showing clix’s location — Tel Aviv-Yafo, Israel",
  },

  a11y: {
    home: "clix home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainLandmark: "Main",
    playTestimonial: "Play {name}’s testimonial",
    slideOfTotal: "{n} of {total}",
    previous: "Previous",
    next: "Next",
    languageSwitcher: "Language",
    tickerIntro: "Frontier model pricing, US dollars per million tokens:",
    tickerRow: "{model}, {in} input and {out} output",
    tickerContext: ", {ctx} context",
  },
};
