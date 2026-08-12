/**
 * Hebrew copy for /clix. OWNED BY ONE AGENT.
 *
 * PROVENANCE IS MANDATORY, and every string below carries a marker:
 *   · SOURCED  — lifted from docs/reference/clixsolutions/, the capture of the real company
 *                site (`lang="he" dir="rtl"`, no English version). The path is given, and every
 *                SOURCED claim in this file was checked against pages/*.html rather than
 *                against content.json.
 *   · AUTHORED — written in that captured voice because no counterpart exists. THESE ARE THE
 *                ONLY STRINGS THE USER HAS TO REVIEW, which is the whole point of marking.
 *
 * ⚠️ THIS ROUTE IS NOT A TRANSLATION, AND THAT IS THE POINT.
 *
 * /clix's ENGLISH is rogo.com/felix's copy, kept verbatim under a "clone now, rewrite after"
 * decision. Translating it literally would put rogo's sentences, in Hebrew, under a clix
 * wordmark. So wherever the real company already published a counterpart, THAT is what is here
 * — a restoration, not a translation. The two locales therefore say different things on this
 * route, deliberately. The manifesto is the clearest case: all five of its paragraphs are
 * rebuilt out of the real services page and the real methodology block.
 *
 * ⚠️ ONE BLOCK IS THE OPPOSITE OF A RESTORATION. `testimonial.quotes` is fabrication, in
 * Hebrew, and translating it made it worse rather than better. Read the warning above it before
 * touching this route's `robots` metadata.
 *
 * ⚠️ H1 STRINGS ARE NEVER LIFTED FROM content.json — its extractor walked per-word spans and
 * concatenated without separators, so every H1 there has lost its spaces. The one H1 this file
 * uses (the services page's) was recovered from pages/services.html by stripping tags and
 * collapsing whitespace, which yields
 * "אנחנו בונים את המנגנונים השקטים שמניעים עסקים מודרניים." — verified, not assumed.
 *
 * ⚠️ NO DASHES, WITH THE ONE CARVE-OUT. No em dashes, no en dashes, no hyphen standing in for
 * one. The Hebrew PREFIX hyphen stays, because `בWhatsApp` is misspelled: the live site writes
 * `ה-AI`, `ב-WhatsApp`, `ל-CRM`, `ו-Clix`. That is orthography, not punctuation style.
 * Quotation uses `״` (gershayim U+05F4) and `׳` (geresh U+05F3), never ASCII.
 *
 * ⚠️ TYPED AGAINST THE ENGLISH SHAPE, so a missing key, an extra key, or a wrong TUPLE LENGTH
 * is a build failure rather than an English word on a Hebrew page. `hero.words` is the one
 * array that is NOT a tuple, which is why this file may carry four where English carries two.
 *
 * EVERY MEASUREMENT QUOTED BELOW was taken in headless Chrome against the real Discovery
 * variable font at the real size, tracking and measure. Line counts, never character counts.
 */

import type { Translated } from "../shape";
import type { ClixDict } from "../en/clix";

export const clix: Translated<ClixDict> = {
  hero: {
    /* AUTHORED. The imperative-plural "meet" is the natural Hebrew headline form; the route
       shell's own `metadata.title` already says "להכיר את Clix", so this is the same thought in
       the register a headline wants. `Clix` stays LATIN — it is the name, and the wordmark two
       rows up is Latin, so "קליקס" beside it would read as two different companies.
       Measured: 412.3px at 92px, one line inside the 844px measure. */
    headline: "הכירו את Clix",
    /*
     * AUTHORED, on a SOURCED register: services 01 calls clix's agents
     * "חברי צוות שאף פעם לא נחים" (pages/services.html), so the Hebrew hero introduces Clix as
     * a new team member rather than translating rogo's "your new [analyst]".
     *
     * ⚠️ IT HAD TO BE RESTRUCTURED, NOT TRANSLATED, AND THE REASON IS GRAMMAR. English puts the
     * possessive modifier BEFORE the rotating noun ("your new" + "analyst"). Hebrew puts the
     * noun first and the modifier after, so a literal "החדש שלכם" could never lead. Under rtl a
     * `flex-row` reverses visually, which means DOM order is still READING order — so this run
     * must be the part of the sentence that PRECEDES the rotating word. It is: the rotor
     * supplies "למכירות" and the line reads "חבר צוות חדש למכירות".
     *
     * Indefinite ("חבר צוות חדש") rather than definite ("חבר הצוות החדש") for phone headroom:
     * 273.4px against 333.7px at 56px. The phone tier has 358px at a 390px viewport, so the
     * definite form would have had 24px of slack and would wrap below a 360px viewport; this
     * one holds a single line down to about 305px.
     */
    lead: "חבר צוות חדש",
    /*
     * SOURCED — services 01 names clix's autonomous agents
     * "למכירות, תמיכה, מחקר ותפעול" (pages/services.html). This is that list, with the `ל`
     * written out on each item so every one completes `lead` on its own; the source carries it
     * once and lets it govern the rest, which a rotating box cannot do.
     *
     * ⚠️ FOUR WORDS AGAINST ENGLISH'S TWO, AND THAT IS WHY `words` IS NOT A TUPLE. English is
     * rogo's two observed finance roles and is known-incomplete. Hebrew is clix's own complete
     * list, so pinning the arity would have forbidden exactly the divergence a restoration
     * needs. Nothing in the rotor depends on the count.
     */
    words: ["למכירות", "לתמיכה", "למחקר", "לתפעול"],
    /*
     * MEASURED, not translated — and this is the value English's 306/270 cannot be reused for.
     *
     * The box is fixed-width so the row's centre never moves as the word swaps. The width has
     * to be `max(advance of every word)` at the largest size that tier renders, and it must be
     * every word, not the resting one: under `prefers-reduced-motion` the rotor freezes on
     * `words[0]`, so a single reading measures the wrong string.
     *
     * Measured at -0.06em, all four words:
     *              92px    72px    56px
     *   למכירות    259.9   203.4   158.2   <- widest at every size
     *   לתמיכה     253.2   198.2   154.1
     *   לתפעול     245.8   192.4   149.6
     *   למחקר      228.2   178.6   138.9
     *
     * `tablet` serves BOTH the 72px and 92px tiers (the class has two stops, the type has
     * three), so it is sized for 92px: 260px. `phone` is the 56px maximum: 159px. Both are
     * border-box widths, so the 20px `p-5` blur allowance sits outside the ink on the overflow
     * side — which is exactly the relationship English already has at its 92px tier, where the
     * 270px box is 3px narrower than "investor" at 273.0px.
     *
     * ⚠️ RE-DERIVE THESE IF THE `[dir="rtl"]` LETTER-SPACING HOOK IN globals.css IS EVER FILLED.
     * At natural tracking the same four words measure 298.6 / 285.3 / 279.0 / 255.8 at 92px and
     * up to 181.7 at 56px, i.e. about 15% wider, so the pair would become roughly 299 / 182.
     */
    rotorWidth: { phone: "159px", tablet: "260px" },
    /*
     * AUTHORED, and it is ONE SENTENCE rather than a join for a reason.
     *
     * English builds this by concatenating the static run with `words.join(" or ")`. In Hebrew
     * that produces "חבר צוות חדש למכירות או לתמיכה או..." style output only if the join
     * happens to fit the grammar, and with a four-item list it does not: Hebrew coordinates a
     * list with commas and a single "או" before the last item. So the sentence is written out.
     * It is `sr-only`, so it costs no geometry at all.
     */
    srHeading: "הכירו את Clix, חבר צוות חדש למכירות, לתמיכה, למחקר או לתפעול.",
    /* AUTHORED. Not "בואו נתחיל" (the real site's own CTA, and already the chrome nav's label)
       because this button is a gated-access request, not an open invitation, and reusing the
       nav's string would make two different actions read identically two rows apart.
       Measured 73.9px against English's 105.3px, so the `min-content` anchor shrinks. */
    cta: "בקשת גישה",
  },

  video: {
    /* AUTHORED — the negated form of `mute`; the capture has no unmute control to lift. 76.0px
       at 14px, against English's 47.3px. The button is `w-min`, so it simply grows. */
    unmute: "ביטול השתקה",
    /* SOURCED — home.bodyText's live voice-agent mock ships exactly this label on its own mute
       control (pages/home.html). 44.0px. */
    mute: "השתקה",
  },

  logoProof: {
    /* AUTHORED. The real site's nearest line is the stack section's
       "כל הכלים שאתם משתמשים בהם מזינים מוח אחד." — a different claim (what the tools feed)
       from this caption's (which tools we work in), so it is written rather than lifted.
       184.0px at 14px, one line at both the 250px and 720px measures, same as English's 208.6.
       ⚠️ The twelve tool names below the caption are trademarks and stay Latin. */
    caption: "הכלים שאנחנו בונים איתם ומחברים",
  },

  manifesto: {
    /* AUTHORED, echoing the SOURCED "המנגנונים השקטים" of the services H1.
       ⚠️ LINE COUNT WAS THE SELECTION CRITERION. Measured against English at both tiers:
       this sets 2 lines at 48px/300px and 3 at 40px/240px, which is what English's
       "The systems behind the work" does in Discovery (2 and 3). The candidate
       "המנגנונים השקטים שמניעים עסקים" was rejected for setting 3 lines at the tablet tier.
       ⚠️ AND IT IS SENSITIVE TO THE TRACKING: at natural spacing it goes to 3 lines at
       48px/300px. See the letter-spacing note in globals.css. */
    title: "המנגנונים שמאחורי העבודה",
    /*
     * THE RESTORATION, AND THE LARGEST ONE IN THIS FILE. English is this repo's own 2026-08-10
     * rewrite; Hebrew is rebuilt from what the real company already published, so these five
     * paragraphs are not a translation of the five above them.
     *
     * ⚠️ TOTAL RENDERED HEIGHT IS IDENTICAL TO ENGLISH AT THE TABLET+ TIER: 18 line boxes and
     * 504.0px in both locales, in the 550px column at 20px/140%. The per-paragraph counts
     * differ (en 2/3/5/5/3, he 2/4/5/4/3) but the block does not move. On phone (310px column)
     * Hebrew is SHORTER: 29 lines / 812px against English's 32 / 896px.
     */
    paragraphs: [
      /* SOURCED ×2. Sentence 1 and 2 are services 08's tagline verbatim, the most quotable line
         on the real site. Sentence 3 is the services H1, recovered from pages/services.html
         (never from content.json, whose H1s have lost their spaces). Together they carry the
         same "the problem is not the one you think" turn that English's opening does. */
      "לא כל בעיה דורשת AI. אלה שכן צריכות את ה-AI הנכון. אנחנו בונים את המנגנונים השקטים שמניעים עסקים מודרניים.",
      /* SOURCED — services 04. The short line before the `\n` is that block's own tagline
         ("כל הכלים שלכם מדברים זה עם זה."), the long line after it is its paragraph, including
         its own gershayim in ה״משעממת״. The `\n` is the same hard break English's second
         paragraph carries, and it is the reason this shape is a tuple of five.
         ⚠️ COMMAS ADDED AROUND THE LIST. The capture's extractor dropped the dashes that set
         "תשלומים, הנהלת חשבונות, שיווק ותמיכה" off as an aside, and the no-dashes rule forbids
         restoring them, so commas do the job. Wording is otherwise untouched. */
      "כל הכלים שלכם מדברים זה עם זה.\nאנחנו מחברים את כל המערך הארגוני שלכם, תשלומים, הנהלת חשבונות, שיווק ותמיכה, באמצעות n8n, Make וקוד מותאם אישית. כל העבודה ה״משעממת״ שמצטברת.",
      /* SOURCED ×2 — services 01's tagline and paragraph, then services 02's paragraph, joined.
         This is the paragraph English devotes to agents plus WhatsApp plus integrations, so the
         two real service blocks that cover the same ground are what stand in for it. */
      "חברי צוות שאף פעם לא נחים. סוכני AI אוטונומיים למכירות, תמיכה, מחקר ותפעול בשפת המותג שלכם, על הנתונים שלכם, ובהתאם להליכי העבודה שלכם. עוזרים חכמים ב-WhatsApp Business שמזמינים, מוכרים, תומכים ומבצעים מעקב, מחוברים ל-CRM, למערכת התשלומים, ליומן ולקטלוג שלכם.",
      /* SOURCED, then AUTHORED for the last clause. Services 07's tagline and paragraph, plus
         services 04's fifth bullet ("ניטור, ניסיונות חוזרים וטיפול בשגיאות") — all three
         published. The closing "כי אוטומציה שאף אחד לא סומך עליה..." has no counterpart in the
         capture and carries over the argument English's fourth paragraph closes on, so that
         clause alone is AUTHORED. */
      "כשפתרון מדף פשוט לא מספיק, אנחנו בונים יישומי Web מותאמים אישית, כלים פנימיים, דשבורדים ואפליקציות מובייל מקצה לקצה. ניטור, ניסיונות חוזרים וטיפול בשגיאות נכנסים כברירת מחדל, כי אוטומציה שאף אחד לא סומך עליה גרועה יותר מאין אוטומציה בכלל.",
      /* SOURCED, then AUTHORED for the last sentence. The opening pair is the methodology
         block's H2 ("מהירות של מעבדה. משמעת של מפעל.") and the third sentence is its paragraph's
         own promise. The closing "הצוות שלכם משקיע את היום..." is AUTHORED: it is the thought
         English's fifth paragraph ends on, and the real site states it nowhere. */
      "מהירות של מעבדה. משמעת של מפעל. כל שבוע יוצא תוצר שאפשר להשתמש בו, לא עוד מצגת. הצוות שלכם משקיע את היום בשיקול הדעת, בקשרים ובהחלטות שרק אנשים יכולים לקבל.",
    ],
  },

  testimonial: {
    /* AUTHORED, recombined from two SOURCED phrases rather than lifted from either:
       "שמעו את זה ישירות" opens home.headings[4] and "הלקוחות שלנו" closes the same section's
       kicker "בקולם של הלקוחות שלנו". Neither survives alone at this size — the full sourced
       headline sets 3 lines at every tier and the bare kicker sets 1. This recombination is the
       only candidate measured at 2 lines at all three of the h2's states (36px/350px,
       48px/500px, 56px/500px), which is what English does. */
    title: "שמעו את זה ישירות מהלקוחות שלנו.",
    /*
     * ⚠️⚠️  FABRICATED ENDORSEMENTS, AND HEBREW MAKES THEM WORSE.  ⚠️⚠️
     *
     * These are ten REAL quotes from REAL people about rogo, reattributed to invented firms and
     * pointed at clix, now also translated. Nothing here was sourced and nothing here COULD be:
     * docs/reference/clixsolutions/README.md:283 records that the real company's endorsements
     * are four 9:16 videos and that "No quote text exists anywhere in the markup".
     *
     * SO THIS IS NOT A RESTORATION. It is fabrication delivered in the audience's own first
     * language, where it reads as MORE credible, not less. Before the 2026-08-10 rename these
     * read as obvious placeholder text, which was safe; in fluent Hebrew under a clix wordmark
     * they do not. The user asked for the translation with that stated.
     *
     * ⚠️ /he/clix MUST KEEP `robots: { index: false, follow: false }`, exactly as /clix does.
     * Translating this block cleared no part of the reason it is there. The fix is real clix
     * references with permission, or deleting the block — not another rename and not another
     * language.
     *
     * Every string below is AUTHORED. Measured: at the 420px card (372px content box) the
     * Hebrew quotes set 1 to 3 lines against English's 1 to 4, so the tablet+ marquee row is
     * one 31.2px line SHORTER than English's; at the 320px card both peak at 4 lines and the
     * rows match. Card heights are equalised by `items-stretch` on the track, so the loop is
     * unaffected either way. Every role and firm line was checked against the 272px content box
     * as well, because both are `whitespace-pre` and cannot wrap: the widest is
     * "בנק השקעות אמריקאי מחמשת הגדולים" at 215.5px, 56.5px clear.
     */
    quotes: [
      {
        q: "נראה שב-Clix בנו את סוכן ה-AI הטוב ביותר שיש. פשוט מדהים.",
        role: "מנהל בכיר",
        firm: "בנק בוטיק, אסיה פסיפיק",
      },
      {
        q: "Clix עקף את הציפיות שלי לגמרי, והחזיר תוצר חזק במשימה שהנחתי שלא יסתדר איתה.",
        role: "מנהל בכיר",
        firm: "בנק בוטיק, אסיה פסיפיק",
      },
      {
        q: "אחד הכלים הבודדים שבאמת מתאים לאופן שבו בנקאים חושבים ובונים תוצרים",
        role: "סגן נשיא",
        firm: "בנק השקעות אמריקאי מחמשת הגדולים",
      },
      {
        /* English has " - " here, which the no-dashes rule forbids reproducing; a full stop
           carries the same beat. */
        q: "זה כלי ה-AI המועיל ביותר שניסיתי. הוא מבין איך אנחנו עובדים",
        role: "מנהל בכיר",
        firm: "בנק השקעות אמריקאי מחמשת הגדולים",
      },
      {
        q: "Clix מצוין. מרשים ברצינות",
        role: "עמית",
        firm: "בנק השקעות אמריקאי מחמשת הגדולים",
      },
      {
        q: "Clix מביא עבודה אמיתית 90 אחוז מהדרך",
        role: "סגן נשיא",
        firm: "בית מחקר אמריקאי מעשרת הגדולים",
      },
      {
        q: "Clix שילש את התפוקה של הצוות שלי בלי להוסיף אף תקן",
        role: "ראש חטיבה",
        firm: "בנק השקעות בוטיק בתחום TMT",
      },
      {
        q: "ניסיתי את כל כלי ה-AI שיש בשוק, ו-Clix הוא ללא ספק הסוכן המתקדם ביותר שעבדתי איתו",
        role: "מנהל השקעות",
        firm: "קרן פרייבט אקוויטי גדולה",
      },
      {
        q: "Clix עשה יותר מכל דבר אחר שהטמענו",
        role: "ראש תחום AI",
        firm: "קרן PE גלובלית מחמש הגדולות",
      },
      {
        /* English closes on "Mind-blowing." — a Latin compound, not a dash used as punctuation.
           Hebrew has no equivalent compound, so it is one word. */
        q: "פרומפט של עשר מילים? וזה מה שיצא? מדהים.",
        role: "שותף",
        firm: "קרן צמיחה אירופית",
      },
    ],
  },

  cta: {
    /*
     * SOURCED — the kicker above the closing CTA on every page of the real site
     * ("בואו נבנה משהו", pages/home.html and pages/services.html). No full stop: the source has
     * none, and this is verbatim.
     *
     * ⚠️ THE >=810 CONSTRAINT CLEARS EASILY; THE PHONE ONE DOES NOT, AND THAT IS RECORDED
     * RATHER THAN TUNED AWAY.
     *   · `whitespace-pre` at >=810, tightest at exactly 810px viewport: 386.0px of ink at 72px
     *     inside 730px of measure, 344px clear. English is 372.4px. Both trivially fit, so the
     *     old "16 characters" ceiling was never the real constraint.
     *   · On phone the headline is `pre-wrap` in a 300px measure at 56px. This sets TWO lines
     *     (300.2px of ink against the 300px measure, over by 0.2px) where the current English
     *     sets ONE. Confirmed on the built page at a 390px viewport: the h2 grows 61.6px and
     *     the `clix-contact` section with it, 301.6px -> 363.2px. Phone tier only; at 1024,
     *     1440 and 1600 both locales set one line and the section is 592px in both.
     *
     * That divergence is kept on evidence: rogo's own string, "Staff Felix today.", also sets
     * TWO lines in that measure (measured). The 300px cap exists precisely to make this
     * headline wrap, so two lines is the target's behaviour and it is the current English
     * replacement that is the outlier at one.
     */
    title: "בואו נבנה משהו",
    /* AUTHORED — the same string as the hero's button, for the same reason, and deliberately
       the same in both places: it is one action offered twice on one page. */
    button: "בקשת גישה",
  },

  felixFooter: {
    /*
     * AUTHORED, on a SOURCED pattern. The real site's footer keeps the company name in Latin
     * inside a Hebrew sentence — "© 2026 Clix Solutions. כל הזכויות שמורות." — so this line does
     * the same: "מבית" plus the registered name, untranslated and untransliterated.
     *
     * No explicit bidi isolation is needed or wanted here. The paragraph resolves to rtl, the
     * Latin name is one strong-LTR run with no trailing neutral character after it, and the
     * single space between them takes the paragraph direction. So the name renders left to
     * right, at the line's left end, with nothing to reorder. Measured 223.3px at 28px against
     * English's 195.6px, `whitespace-pre` on a `w-auto` box, so there is no constraint to meet.
     *
     * ⚠️ THE WORDMARK ABOVE THIS LINE IS NOT A STRING AND IS NOT TRANSLATED. It stays the four
     * Latin capitals CLIX: `--font-emboss` is a four-glyph subset and the SVG viewBox is that
     * font's ink box for exactly that word. See ClixFelixFooter.tsx, which also carries the
     * `direction="ltr"` fix that stops the whole wordmark vanishing under rtl.
     */
    byline: "מבית Clix Solutions",
  },
};
