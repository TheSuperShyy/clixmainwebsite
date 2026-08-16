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
 *   mission → CompanyMission · services → CompanyServices — both server components, both
 *   reading `getDict().company` directly.
 *
 * ⚠️ `tools` AND `careers` ARE BOTH GONE AS OF 2026-08-16, each with the band it fed.
 *   `CompanyTools` ("Built On Tools Your Team Already Uses") and `CompanyCareers` ("Join The
 *   Team Building / What Comes Next") were deleted on the user's call — see
 *   CompanyRoute.tsx's header for what went and why.
 *
 * WHICH ARRAYS ARE TUPLES HERE, and why each way:
 *   · `mission.heading` is `readonly string[]`. It is a HARD `<br>` break whose only job is
 *     line fitting — the two runs are the same colour, the same element, one sentence — so the
 *     count is the language's business. Hebrew is free to set it in one line or three.
 *   · `mission.teamItems` (3) and `services.cards` (8) are TUPLES, left implicit by `as const`.
 *     Both counts are layout: the team column's three rows sit in one of three grid cells, and
 *     the services grid is exactly eight cards paired 1:1 with the eight scenes in
 *     `serviceArt.tsx` and the eight marks in `serviceGlyphs.tsx` — both of which are typed as
 *     8-slot tuples for the same reason. A locale supplying seven must fail the build.
 *   · `mission.city` / `mission.country` are NOT an array at all: those two runs are a city
 *     and a country rather than two halves of one phrase, so they are separately-named keys
 *     and the `<br>` stays in the component. (`careers.titleInk` / `careers.titleMuted` was
 *     the other instance of this pattern — a COLOUR boundary — and went with its band.)
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
       unlike the page's other three h3s. Measured 96.8 / 88 / 70.4 = 2 / 2 / 2 lines.
       ⚠️ The heading still says EIGHT and the grid still holds eight. If a ninth service is
       ever added, this string is the second thing that has to change. */
    title: "Built From Eight Services That Work As One System",
    intro:
      "Clix builds AI agents, WhatsApp assistants, CRM implementations, integrations, " +
      "websites, mobile apps and custom software, plus the AI strategy that works out which " +
      "of them your business needs, and which it does not.",
    /* ─── THE EIGHT CARDS ──────────────────────────────────────────────────────────────────
     *
     * ⚠️ SHAPE CHANGED 2026-08-16. This was `items: [8 bare labels]` while the band was rogo's
     * `Team` logo wall reused as eight 164px tiles. The band is now eight art cards, each with
     * a kicker, a name and a one-line promise, so the tuple carries objects. `name` is the OLD
     * `items` string, unchanged in both locales — nothing was re-fitted.
     *
     * `num` is NOT here. It is `String(i + 1).padStart(2, "0")` in the component: the real
     * site prints Western digits in Hebrew too, so sixteen identical strings would be dead
     * weight in both files.
     *
     * PROVENANCE, and it splits by locale rather than by field:
     *   · `name`  ×8 — SOURCED in Hebrew (the H2s of pages/services.html), and these English
     *                  renderings of them are what this route has always shipped.
     *   · `kicker`×8 — AUTHORED here, SOURCED in Hebrew (`NN · …`, the numbered benefit line
     *                  above each H2 in `services.bodyText`). The Hebrew is the earlier text.
     *   · `promise`×8 — same split. Hebrew verbatim, English rendered from it.
     * So sixteen of the twenty-four strings below are translations of captured Hebrew, not
     * new marketing copy — which is the same relationship the rest of this file has.
     *
     * ⚠️ CSS UPPERCASES `kicker` (it renders through CompanyMission's EYEBROW_CLASS). Source
     * strings are sentence case. Do not pre-uppercase them here.
     *
     * ⚠️ `promise` GROWS ITS CARD RATHER THAN CLIPPING — a deliberate divergence from
     * /product's benefit bodies, which sit in an aspect-fixed card and genuinely clip. These
     * cards are `min-h-*` in a stretched 2-column grid, so a longer string pushes its whole
     * ROW taller and nothing is ever cut off. Line counts are therefore a look, not a risk.
     */
    cards: [
      {
        kicker: "To speed up sales and support",
        name: "AI Agents",
        promise: "Teammates that never rest.",
      },
      {
        kicker: "To sell where your customers already are",
        name: "WhatsApp Automation",
        promise: "The channel your customers are already on.",
      },
      {
        kicker: "To unify the customer picture",
        name: "CRM Implementation",
        promise: "One true customer picture, in one place.",
      },
      {
        kicker: "To connect every system",
        name: "Integrations",
        promise: "Every tool you own, talking to every other.",
      },
      {
        kicker: "To turn traffic into customers",
        name: "Web Development",
        promise: "Marketing sites that load fast and convert hard.",
      },
      {
        kicker: "To reach straight into your customer’s pocket",
        name: "Mobile Development",
        promise: "Native apps customers actually open.",
      },
      {
        kicker: "To build exactly what is needed",
        name: "Custom Software",
        promise: "For when off the shelf is not enough.",
      },
      {
        /* ⚠️ THE REAL SITE PRINTS THE SAME SENTENCE TWICE HERE — `08 · להמר על הדברים הנכונים`
           is also that service's promise line. Reproduced rather than "fixed": inventing a
           second sentence would be the only unsourced kicker on the band. Flagged in
           features/company-page/FEATURE.md as a copy question for the user. */
        kicker: "To bet on the right things",
        name: "AI Strategy",
        promise: "To bet on the right things.",
      },
    ],
  },
} as const;

export type CompanyDict = typeof company;
