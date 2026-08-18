/**
 * English copy for /clix. OWNED BY ONE AGENT.
 *
 * THE NAMESPACE'S SHAPE IS DEFINED HERE, in the English file, and `dictionary.ts` only imports
 * it. That is what keeps this a single-owner file: growing the namespace never means editing a
 * file another agent also touches.
 *
 * EXTRACTED VERBATIM, and mechanically: every long string here was sliced out of its component
 * by a script rather than retyped, so byte-identity is not a matter of care. The curly
 * apostrophes (U+2019) in the manifesto and in four quotes, the STRAIGHT apostrophes in two
 * others ("my team's", "we've"), and the " - " in quote 4 are all the components' own, and they
 * are inconsistent with each other. That inconsistency IS the verbatim value. Do not tidy it.
 *
 * THIS ROUTE'S ENGLISH IS ROGO'S, AND KNOWINGLY SO. /clix clones rogo.com/felix and its copy
 * was kept under an explicit "clone now, rewrite after" decision. Two consequences the HEBREW
 * file acts on and this one does not:
 *   - he/clix.ts prefers the REAL clix counterpart over translating rogo's sentence wherever
 *     one exists in docs/reference/clixsolutions/. So the two locales deliberately do not say
 *     the same thing on this route. That is the restoration working, not drift.
 *   - `testimonial.quotes` are FABRICATED ENDORSEMENTS in BOTH locales. See the warning above
 *     them. They are why `robots: { index: false }` is on /clix and /he/clix alike.
 *
 * NO JSX, NO HTML, NO MARKUP. `manifesto.paragraphs[1]` carries a literal newline escape, which
 * the component renders through `whitespace-pre-line`. That is text, not markup, and it is how
 * the original sets a short line above a long one.
 *
 * ARRAY TYPING, the one thing tsc cannot infer here:
 *   - `as const` makes every array a TUPLE, so arity is checked. That is what we want for
 *     `manifesto.paragraphs` (five, the shape the block's layout was measured against) and
 *     `testimonial.quotes` (ten cards per marquee row).
 *   - `hero.words` is widened to `readonly string[]` ON PURPOSE. Its count is content, not
 *     layout, and it has already moved: English carried rogo's two observed roles while Hebrew
 *     carried four of its own, both locales were pinned to the same two on 2026-08-16, and on
 *     2026-08-18 both became the same THREE — the user's own words. The rotor cycles whatever
 *     length it is handed. The widening stays.
 */

export const clix = {
  hero: {
    /* Line 1 of the headline lockup, in its own centred box. */
    headline: "Meet Clix",
    /* Line 2's STATIC run. Line 2 is two boxes, this one then the fixed-width rotor, so the
       two runs are separate keys rather than one string with a placeholder.
       In Hebrew this run must be the part of the sentence that PRECEDES the rotating noun:
       flex-row reverses visually under rtl, so DOM order is still reading order. */
    lead: "your new",
    /*
     * The rotating words. `readonly string[]`, not a tuple. See the header.
     *
     * ⚠️ NOT ROGO'S ANY MORE, AS OF 2026-08-18 — the first hero string on /clix where the
     * route's standing "clone now, rewrite after" decision was actually cashed in. It used to
     * be `["analyst", "investor"]`: the two roles ACTUALLY OBSERVED on rogo's live page, a
     * known-incomplete list kept incomplete because nothing was invented to pad a cycle a
     * static capture cannot recover. ClixHero.tsx still carries that whole investigation, and
     * it stays there — it is why this array is not a tuple. rogo's two are finance roles clix
     * does not staff, and the user asked for a headline that connects with this company.
     *
     * ⚠️ THESE THREE ARE THE USER'S OWN WORDS, given verbatim, and that is their provenance.
     * They were not derived from a capture and not proposed by an agent. An earlier pass the
     * same day put four service roles here — sales rep / support agent / researcher / operator,
     * lifted from `home.whatWeDo`'s own service copy — and the user rejected them on sight,
     * before anything was rendered. Do not reintroduce that set as an "improvement".
     *
     * WHY THEY WORK IN THIS SLOT: each completes `lead` on its own — "your new AI agent",
     * "your new specialist", "your new 24/7 team" — and across the cycle they climb from the
     * mechanism to the promise, which is the only thing a rotating word can sell that a static
     * one cannot.
     *
     * ⚠️ TWO OF THE THREE CONTAIN A SPACE, which nothing on this row ever did before. The
     * rotor span therefore carries `whitespace-nowrap` — see ClixHero.tsx, where the comment
     * claiming the span holds "a single unbreakable word" had to be corrected. Without it a
     * two-word entry breaks at the space inside a fixed-width box and the lockup renders a
     * line deeper. "24/7" also carries a SLASH, which is a break opportunity in its own right;
     * the same class covers it.
     */
    words: ["AI agent", "specialist", "24/7 team"] as readonly string[],
    /*
     * WHICH RUN LEADS LINE 2. IT IS A GRAMMAR FACT, NOT A STYLE CHOICE, which is the reason it
     * is a dictionary value at all.
     *
     * English modifies BEFORE the noun ("your new" + "[AI agent]"), so the static run leads and
     * the rotor follows. Hebrew is the other way round: the noun carries the definite article
     * and its modifier trails it ("[האנליסט]" + "החדש שלכם"), so there the rotor must come
     * FIRST in the DOM. Under rtl a `flex-row` reverses visually, which means DOM order is
     * reading order in both locales, and flipping that order is the only way to flip the
     * sentence.
     *
     * `as boolean` and not a bare `false`, for the same reason `words` is widened one key up:
     * `Translated<>` passes booleans through UNWIDENED (see shape.ts), so a literal `false`
     * would pin Hebrew to `false` as well — the exact opposite of the point.
     *
     * ClixHero.tsx swaps the rotor box's justification off this flag too. The rotor is the
     * OUTER element of the row in either arrangement, and its ink has to hug the INNER edge so
     * the fixed box's slack falls on the outside instead of opening a gap that changes width
     * in the middle of the sentence.
     */
    rotorLeads: false as boolean,
    /*
     * THE ROTOR BOX'S WIDTH, AND IT IS LOCALE-SPECIFIC, which is why it is a dictionary value
     * and not a class.
     *
     * The box is fixed-width so the row's centre never moves as the word swaps; remove the
     * width and every swap reflows the line.
     *
     * ⚠️ RE-MEASURED 2026-08-18, and these are OUR numbers now. The 306/270 pair they replace
     * was rogo's own — Latin advances for a serif face we do not serve, for two words we no
     * longer show. Hebrew still cannot reuse them, which is why this is a dictionary value and
     * not a class.
     *
     * Discovery variable font at wght 400, letter-spacing -0.06em, GPOS kerning applied,
     * measured off the shipped public/fonts/discovery/discovery-var.woff2:
     *
     *                  92px    72px    56px
     *   24/7 team     334.8   262.1   203.8   <- widest at every size
     *   specialist    310.3   242.9   188.9
     *   AI agent      280.6   219.6   170.8
     *
     * `tablet` serves BOTH the 72px and the 92px tier (the class has two stops, the type has
     * three), so it is sized for 92px. Both values are max(advance of EVERY word) — every one,
     * not the resting one: under `prefers-reduced-motion` the rotor freezes on `words[0]`, so a
     * single reading measures the wrong string. Then rounded UP, plus the 0.7% by which real
     * Chrome ran WIDER than this method on the one string both have measured ("investor",
     * 273.0 in Chrome against 271.2 here). 334.8 -> 338, 203.8 -> 206.
     *
     * ⚠️ METHOD NOTE, because the rest of this route's numbers came from headless Chrome and
     * these did not: Chrome is not available in this environment, so these were computed from
     * the font's own hmtx plus GPOS kern pairs at the instanced weight. It was validated before
     * it was trusted — it reproduces he/clix.ts's Chrome-measured "האנליסט" (281.9 / 220.6 /
     * 171.6) exactly and its "החדש שלכם" (415.3, computed 415.2) to the tenth, and lands
     * within 0.7% on "investor". Hence the correction above.
     *
     * IT FITS, stated rather than assumed: line 2 at 92px is `lead` 311.5 + the 16px gap + 338
     * = 665.5px inside the 844px `--measure`, 146px roomier than the pair it replaces. This
     * also RETIRES the pre-existing defect logged in features/i18n-rtl/FEATURE.md — rogo's
     * 270px box was 3px NARROWER than its own widest word and leaned on the p-5 blur allowance
     * to hide the overhang. Ours is measured to contain its widest word.
     *
     * Consumed as CSS custom properties (--rotor-w, --rotor-w-tablet) so the per-locale value
     * never lands on the same class string as a direction utility. STRINGS, not numbers: a
     * numeric literal would survive `Translated<>` unwidened and pin Hebrew to English's
     * value, which is the exact opposite of the point.
     */
    rotorWidth: { phone: "206px", tablet: "338px" },
    /*
     * The one accessible heading for the whole lockup, `sr-only`.
     *
     * IT IS A WHOLE SENTENCE, NOT A TEMPLATE, AND THAT IS DELIBERATE. It used to be built as
     * `"Meet Clix, your new " + WORDS.join(" or ")`. Hebrew grammar does not survive that join:
     * the noun leads and the modifier follows, so a machine join produces a phrase no Hebrew
     * reader would write. It is `sr-only`, so a hand-written sentence costs zero geometry and
     * strictly beats a joined one.
     *
     * THE COST, stated: it no longer tracks `words` automatically. Add a word above, add it
     * here. Re-written 2026-08-18 for the three that replaced rogo's two.
     */
    srHeading: "Meet Clix, your new AI agent, specialist or 24/7 team",
    /* Button label. `whitespace-pre` inside a `width: min-content` anchor, so it cannot wrap;
       a longer string overflows rather than reflowing. */
    cta: "Request Access",
  },

  video: {
    /* The mute toggle's two states. Both translate. The button also carries `aria-pressed`, so
       the label is the only thing a sighted user reads and the state is exposed twice over. */
    unmute: "Unmute",
    mute: "Mute",
  },

  logoProof: {
    /* Caption over the 12-tile grid. THE TWELVE TOOL NAMES ARE NOT HERE and never will be:
       they are product trademarks and stay Latin in every locale. See toolMarks.tsx, which
       /company also imports. */
    caption: "The tools we build with and integrate",
  },

  manifesto: {
    /* LENGTH IS A LAYOUT CONSTRAINT, and the measured invariant is NOT what the component
       used to claim. `max-w` is 240px on phone and 300px at tablet+, at 40/48px. Measured on
       the built page: this string sets TWO lines at 48px/300px (tablet and desktop) and THREE
       at 40px/240px (phone). The two-line rule is a tablet+ rule only; the phone tier has
       always been three. The Hebrew title is fitted to match both, not to match the claim. */
    title: "The systems behind the work",
    /*
     * FIVE paragraphs, a tuple, because the block's layout was measured against that shape:
     * the second carries an internal newline (a short line, then a long one) and the rest are
     * separated by `margin-top: 1.4em`.
     *
     * NO DASHES, at the user's explicit request (2026-08-10): no em dashes, no en dashes, no
     * hyphen standing in for one. The Hebrew file has ONE carve-out, the Hebrew prefix hyphen
     * in forms like the definite article before AI, which is orthography and not punctuation.
     */
    paragraphs: [
      "Most teams do not have a software problem. They have a hundred small handoffs that nobody owns.",
      "Copy this into that. Chase the reply. Update the sheet.\nNone of it is difficult. All of it takes someone’s afternoon, every day, and none of it ever shows up as work that anyone gets credit for.",
      "Clix builds the quiet mechanisms that take those hours back. AI agents that answer, qualify and follow up in your own language and on your own data. WhatsApp assistants that sell and support where your customers already are. Integrations that keep your CRM, your calendar and your billing telling the same story.",
      "Where nothing off the shelf fits, we build it: custom software, internal dashboards, mobile apps, and the webhooks and middleware that hold them together. Monitoring, retries and error handling come as standard, because an automation nobody trusts is worse than no automation at all.",
      "The point was never the technology. It is that your team spends its day on the judgment, the relationships and the decisions only people can make, and not on the busywork in between.",
    ],
  },

  /*
   * WHAT CLIX BUILDS. This block replaced ten FABRICATED ENDORSEMENTS on 2026-08-13, at the
   * user's direction ("what do you think we can put here? we dont have that much details for
   * that kindof stuff").
   *
   * What was here: ten real quotes from real people about rogo, a real product that is not
   * this one, reattributed to invented finance firms and pointed at clix. It was the one
   * block on the page that was not merely unfinished but actively misleading, and the stated
   * reason /clix and /he/clix carry `robots: { index: false }`. The old warning is gone
   * because it is no longer true of this key. THE `robots` FLAG WAS DELIBERATELY LEFT ON:
   * lifting it is a launch decision for the user, not a side effect of a copy change.
   *
   * The finance framing went with it. "What leading finance teams have to say" was inherited
   * from the clone target, whose product is banking research; the manifesto directly above
   * this section sells WhatsApp assistants, CRM/calendar/billing integrations and custom
   * internal tools. The heading now picks up that paragraph's own phrase, "the quiet
   * mechanisms".
   *
   * ⚠️ TEN CARDS IS STRUCTURAL, not editorial. ClixCapabilities renders this list, then a
   * duplicate of it, and the counter-rotating second row renders it reversed. Fewer items and
   * the same card comes back around inside one screen width; the loop arithmetic itself does
   * not care, but the eye does.
   *
   * ⚠️ `label` AND `stack` ARE `whitespace-pre` AND CANNOT WRAP. The binding measure is the
   * PHONE card, not the tablet one: 320px less 2x24px padding = a 272px content box (tablet is
   * 420 - 48 = 372). Nothing here is close — the longest is "Hebrew · Arabic · English" at 25
   * characters, on the order of 170px at Inter 14. Estimated rather than measured in the
   * browser, unlike the Hebrew block in he/clix.ts, because the margin is that wide. A longer
   * string added later must be measured.
   *
   * NO DASHES, per the user's 2026-08-10 rule: no em dash, no en dash, no hyphen standing in
   * for one. "off the shelf" and "built in" are unhyphenated here for that reason.
   *
   * ⚠️ VENDOR NAMES ARE DELIBERATELY GENERIC. `CRM · Calendar · Billing`, not
   * `HubSpot · Google Calendar · Stripe`. Clix's actual stack was not known when this was
   * written and inventing one repeats the mistake this block exists to undo. Naming the real
   * integrations reads stronger and should replace these once the user confirms them.
   */
  capabilities: {
    /* Same box as the heading it replaced: `max-w` 350px on phone, 500px at tablet+, at
       36/48/56px, `h-auto`. Sets 2 lines at 500px/48px, which is what the old string did. */
    title: "What clix quietly runs for you",
    /*
     * The card keeps the three-part shape the testimonial had, so no CSS moved: `line` is the
     * 24px quote slot, `label` the 14px ink caption, `stack` the 14px muted one. Read as
     * "the job / the surface it runs on / the systems it touches".
     */
    cards: [
      {
        line: "Answers and qualifies every lead on WhatsApp, in Hebrew, at 2am.",
        label: "AI agent",
        stack: "WhatsApp Business API",
      },
      {
        line: "Chases the reply nobody remembered to send.",
        label: "Follow up automation",
        stack: "CRM · Email",
      },
      {
        line: "Your CRM, your calendar and your billing finally tell the same story.",
        label: "Integrations",
        stack: "CRM · Calendar · Billing",
      },
      {
        line: "Books the meeting while the customer is still typing.",
        label: "Scheduling agent",
        stack: "Calendar · WhatsApp",
      },
      {
        line: "Turns an inbox of orders into rows nobody had to type.",
        label: "Document intake",
        stack: "Email · Spreadsheets",
      },
      {
        line: "One dashboard for the numbers that were living in four browser tabs.",
        label: "Internal dashboards",
        stack: "Custom build",
      },
      {
        line: "The internal tool no off the shelf product was ever going to fit.",
        label: "Custom software",
        stack: "Web · Mobile",
      },
      {
        line: "Speaks your customer’s language, on the app they already have open.",
        label: "Multilingual agents",
        stack: "Hebrew · Arabic · English",
      },
      {
        line: "Retries and alerts, because an automation nobody trusts is worse than none.",
        label: "Monitoring",
        stack: "Built in as standard",
      },
      {
        line: "Every handoff between your systems, owned and logged.",
        label: "Webhooks and middleware",
        stack: "API · Queues",
      },
    ],
  },

  cta: {
    /*
     * LENGTH IS A HARD CONSTRAINT HERE, AND THE OLD 16-CHARACTER CEILING WAS A LATIN
     * ADVANCE-WIDTH PROXY. Do not port a character count to another script.
     *
     * The real constraint is RENDERED INK WIDTH: `whitespace-pre` at >=810 means this can never
     * wrap, and the tightest tier is exactly 810px viewport, where 72px type sits in 730px of
     * usable measure (1280 container, `tablet:px-10`). Measured at 72px/-0.05em, this string is
     * 372.4px of ink, 357.6px clear — so the old 16-character ceiling was never binding.
     *
     * Phone releases it to `pre-wrap` in a 300px measure at 56px, where the constraint becomes
     * line count. This string sets ONE line there at 289.6px, which is 10px off wrapping; the
     * Hebrew string sets TWO. See he/clix.ts for why that divergence is kept.
     */
    title: "Build with Clix.",
    /* Same `whitespace-pre` / `min-content` anchor as the hero's button. */
    button: "Request Access",
  },

  felixFooter: {
    /*
     * The line tucked under the wordmark. `whitespace-pre` at 28px, so it cannot wrap.
     *
     * THE WORDMARK ITSELF IS NOT A STRING AND IS NOT HERE. It stays the four Latin capitals
     * CLIX, hard-coded in ClixFelixFooter.tsx, because `--font-emboss` is a four-glyph subset
     * (`unicode-range: U+0043, U+0049, U+004C, U+0058`) and the SVG viewBox is that font's
     * measured ink box for exactly that string. Only this byline translates.
     */
    byline: "by Clix Solutions",
  },
} as const;

export type ClixDict = typeof clix;
