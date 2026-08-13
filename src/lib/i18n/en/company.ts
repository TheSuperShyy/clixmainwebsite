/**
 * English copy for /company. OWNED BY ONE AGENT — see features/i18n-rtl/FEATURE.md.
 *
 * THE NAMESPACE'S SHAPE IS DEFINED HERE, in the English file, and `dictionary.ts` only imports
 * it. That is what keeps this a single-owner file: growing the namespace never means editing a
 * file another agent also touches.
 *
 * ⚠️ EXTRACT VERBATIM. Every string moved here must be byte-identical to what the component
 * said before, including curly apostrophes (’ U+2019) and any em dash. The English render is
 * verified as a no-op, so a "tidied" string is a regression.
 *
 * ⚠️ NO JSX, NO HTML, NO MARKUP. Where a `<br>` or an inner `<span>` IS a colour boundary, the
 * element stays in the component and the two runs come here as separately-named keys.
 *
 * ARRAY TYPING, and it matters: use a fixed-length TUPLE where the count is layout (a grid's
 * cells, a nav's slots), and `readonly string[]` where the count is how the language happens to
 * WRAP. Pinning the second kind forbids the divergence Hebrew needs; leaving the first kind
 * loose lets a layout break through.
 *
 * THE FIVE BLOCKS, in render order (CompanyRoute.tsx:66-70), one key each:
 *   hero → CompanyHero (the only `"use client"` file on the route, so the only one reading
 *          these through `usePageDict("company")`)
 *   mission → CompanyMission · services → CompanyServices · tools → CompanyTools ·
 *   careers → CompanyCareers — all four are server components and read `getDict().company`.
 *
 * WHICH ARRAYS ARE TUPLES HERE, and why each way:
 *   · `mission.heading` and `tools.heading` are `readonly string[]`. Both are HARD `<br>`
 *     breaks whose only job is line fitting — the two runs are the same colour, the same
 *     element, one sentence — so the count is the language's business. Hebrew is free to set
 *     either heading in one line or three.
 *   · `mission.teamItems` (3) and `services.items` (8) are TUPLES, left implicit by `as const`.
 *     Both counts are layout: the team column's three rows sit in one of three grid cells and
 *     the services grid is 4 → 4 → 1 over exactly eight tiles, which is what makes
 *     CompanyServices.tsx:33's `8 × 164 + 7 × 16 = 1424` true. A locale supplying seven must
 *     fail the build.
 *   · `careers.titleInk` / `careers.titleMuted` are NOT an array at all. That break is a
 *     COLOUR boundary (CompanyCareers.tsx:136-143: line 1 `ink`, line 2 inside a `muted`
 *     span), so the two runs are separately-named keys and the element stays in the component.
 *     Same for `mission.city` / `mission.country`, where the two runs are a city and a country
 *     rather than two halves of one phrase.
 */

export const company = {
  hero: {
    /* h1. Line-fitted, not authored freely: the measured boxes are 167.2 / 68.4 / 182.4 px at
       desktop / tablet / phone, which at `line-height: 95%` of 88 / 72 / 64 is exactly 2 / 1 / 3
       rendered lines. Re-fit by RENDERED LINE COUNT if this ever changes — never by counting
       characters (CompanyHero.tsx:9-12). */
    title: "The Team Behind the Systems",
    /* Subhead. Measured 23.4 / 20.8 / 41.6 = 1 / 1 / 2 lines at `line-height: 130%`. */
    subhead: "Clix builds the automation that modern businesses run on.",
    /* CTA label. `whitespace-pre` inside a `width: min-content` anchor, so it cannot wrap — a
       longer string overflows rather than reflows. The apostrophe is U+2019, which is what
       `Let&rsquo;s start` rendered to. */
    ctaLabel: "Let’s start",
    /* The `aria-label` on the autoplaying clip. Not decoration: the video carries no track and
       no caption, so this is the only description a screen reader gets. */
    videoLabel:
      "Footage of a Clix talk, a speaker addressing a seated audience in a studio space",
  },

  mission: {
    /* Hard `<br>`, both runs `ink`, both runs the same element. Line fitting only — hence
       `readonly string[]` and not a 2-tuple. Each LINE has to fit its own 490px column. */
    heading: ["The Speed Of A Lab,", "The Discipline Of A Factory"] as readonly string[],
    /* Eyebrow. CSS uppercases it; the source string is sentence case, exactly as the original
       does it (CompanyMission.tsx:54-58). Do not pre-uppercase it here. */
    teamLabel: "Team",
    /* Three verifiable facts about the team, NOT names — see CompanyMission.tsx:12-17 for why
       the column is deliberately not a roster. Tuple: three rows of one grid cell. */
    teamItems: ["Unit 8200 alumni", "Technion alumni", "Senior engineers"],
    locatedInLabel: "Located In",
    /* Two runs of ONE paragraph, split by a `<br>`, so the city and the country are announced
       as a single phrase. The break is semantic (city / country), not line fitting, so these
       are two keys rather than an array. */
    city: "Tel Aviv",
    country: "Israel",
    body:
      "At Clix, the point was never the technology. It is that your team spends its " +
      "day on the judgment, the relationships and the decisions only people can make, " +
      "and not on the busywork in between. That is the whole brief.",
  },

  services: {
    /* Wraps NATURALLY into two lines at every tier — no hard break anywhere in this heading,
       unlike the page's other three h3s. Measured 96.8 / 88 / 70.4 = 2 / 2 / 2 lines. */
    title: "Built From Eight Services That Work As One System",
    intro:
      "Clix builds AI agents, WhatsApp assistants, CRM implementations, integrations, " +
      "websites, mobile apps and custom software, plus the AI strategy that works out which " +
      "of them your business needs, and which it does not.",
    /* The eight services, in the order the site lists them
       (docs/reference/clixsolutions/README.md:173-182). Every label was fitted to ONE rendered
       line at every tier during prep. TUPLE — the count is the grid. */
    items: [
      "AI Agents",
      "WhatsApp Automation",
      "CRM Implementation",
      "Integrations",
      "Web Development",
      "Mobile Development",
      "Custom Software",
      "AI Strategy",
    ],
  },

  tools: {
    /* Hard `<br>`, one colour, one element — line fitting, so `readonly string[]`. Each line
       has to fit a 490px column on its own at every tier. */
    heading: ["Built On Tools", "Your Team Already Uses"] as readonly string[],
  },

  careers: {
    /* THE COLOUR BOUNDARY. One `<h2>`; line 1 is `ink`, line 2 is a `muted` `<span>`. Two keys,
       and NEITHER fragment may wrap on its own — the measured h3 box is 2 lines at every tier
       (96.8 / 88 / 70.4). */
    titleInk: "Join The Team Building",
    titleMuted: "What Comes Next",
    body:
      "We are looking for engineers who want to ship systems real businesses depend on. " +
      "If that is you, come talk to us.",
    /* `whitespace-pre` inside a `min-w-[124px]` anchor that is also `overflow-hidden`: it grows
       rather than clips, but it cannot wrap. */
    ctaLabel: "See Careers",
    /* The full-bleed photograph. STOCK, not clix's team — see CompanyCareers.tsx:44-56. The
       `alt` describes what is depicted and claims nothing about who is in it. */
    photoAlt:
      "Three colleagues working in an office, two seated at a wide monitor showing code while a third writes on a wall mounted display.",
  },
} as const;

export type CompanyDict = typeof company;
