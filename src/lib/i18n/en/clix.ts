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
 *     layout: English is two words and known-incomplete (see ClixHero.tsx), Hebrew is four
 *     restored from clix's own service page, and the rotor cycles whatever length it is given.
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
     * The English pair is the two ACTUALLY OBSERVED on rogo's live page, and the list is
     * known-incomplete; ClixHero.tsx explains why it cannot be recovered from a static capture
     * and why nothing was invented to pad it.
     */
    words: ["analyst", "investor"] as readonly string[],
    /*
     * THE ROTOR BOX'S WIDTH, AND IT IS LOCALE-SPECIFIC, which is why it is a dictionary value
     * and not a class.
     *
     * The box is fixed-width so the row's centre never moves as the word swaps; remove the
     * width and every swap reflows the line. English's 306/270 are rogo's own numbers, and
     * Hebrew cannot reuse them: they are Latin advances for a serif face, measured for
     * different words in a different script.
     *
     * Consumed as CSS custom properties (--rotor-w, --rotor-w-tablet) so the per-locale value
     * never lands on the same class string as a direction utility. STRINGS, not numbers: a
     * numeric literal would survive `Translated<>` unwidened and pin Hebrew to English's
     * value, which is the exact opposite of the point.
     */
    rotorWidth: { phone: "306px", tablet: "270px" },
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
     * here. The rendered English text is identical to what the template produced.
     */
    srHeading: "Meet Clix, your new analyst or investor",
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

  testimonial: {
    /* `max-w` 350px on phone, 500px at tablet+, at 36/48/56px. `h-auto`, so a longer string
       grows the box rather than overflowing: the constraint is line count, not fit. */
    title: "What leading finance teams have to say",
    /*
     * FABRICATED ENDORSEMENTS. IN BOTH LOCALES. READ BEFORE LAUNCH.
     *
     * These are ten REAL quotes from REAL people about rogo, a real product that is not this
     * one, reattributed to invented firms and pointed at clix. ClixTestimonial.tsx carries the
     * full history; this is the short form.
     *
     * THERE IS NOTHING TO SOURCE, and that is settled rather than assumed:
     * docs/reference/clixsolutions/README.md:283 records that the real company's endorsements
     * are four 9:16 VIDEOS and that "No quote text exists anywhere in the markup". So the
     * Hebrew here is not a restoration and cannot be one. It is fabrication delivered in the
     * audience's own language, where it reads as MORE credible, not less.
     *
     * THIS BLOCK IS THE SINGLE REASON `robots: { index: false, follow: false }` MUST STAY ON
     * BOTH /clix AND /he/clix. Translating it clears nothing. The fix is real clix references
     * with permission, or deleting the block. Not another rename.
     *
     * Ten cards, a tuple: each marquee row renders this list and then a duplicate of it, and
     * the counter-rotating row renders it reversed.
     */
    quotes: [
      {
        q: "Clix may have just created the greatest AI Agent ever. It is incredible.",
        role: "Managing Director",
        firm: "APAC Boutique Bank",
      },
      {
        q: "Clix completely blew past my expectations, delivering a strong output on a task I assumed it wouldn’t handle.",
        role: "Managing Director",
        firm: "APAC Boutique Bank",
      },
      {
        q: "One of the few tools that actually fits how bankers think and structure outputs",
        role: "Vice President",
        firm: "Top 5 U.S. BB Investment Bank",
      },
      {
        q: "This is the most helpful AI tool I’ve tried - it gets how we work",
        role: "Managing Director",
        firm: "Top 5 U.S. BB Investment Bank",
      },
      {
        q: "Clix is stellar. Seriously impressive",
        role: "Associate",
        firm: "Top 5 U.S. BB Investment Bank",
      },
      {
        q: "Clix can get real work 90% of the way there",
        role: "Vice President",
        firm: "Top 10 U.S. Equity Research Firm",
      },
      {
        q: "Clix tripled my team's output with no headcount additions",
        role: "Group Head",
        firm: "Boutique TMT Investment Bank",
      },
      {
        q: "I’ve tried all the AI tools available out there and Clix is by far the most advanced model / agent I’ve used",
        role: "Principal",
        firm: "Mega Fund Private Equity",
      },
      {
        q: "Clix has done more than anything else we've deployed",
        role: "Head of AI",
        firm: "Top 5 Global PE Firm",
      },
      {
        q: "10 word prompt? And it did all of that? Mind-blowing.",
        role: "Partner",
        firm: "European Growth Equity Firm",
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
