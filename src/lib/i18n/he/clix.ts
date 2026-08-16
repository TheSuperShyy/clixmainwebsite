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
 * ⚠️ ONE BLOCK USED TO BE THE OPPOSITE OF A RESTORATION. `testimonial.quotes` was
 * fabrication, in Hebrew, and translating it made it worse rather than better. It was replaced
 * by `capabilities` on 2026-08-13, which describes what clix builds instead of quoting people
 * who never said it. That block is still AUTHORED rather than sourced, and its own note asks
 * the user to read it. The route's `robots: { index: false }` was deliberately left on.
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
 * array that is NOT a tuple, so this file MAY diverge in length from English. It carried four
 * against English's two until 2026-08-16, when the user asked both locales to name the same
 * roles; it now carries the same two. The widening stays, deliberately.
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
     * AUTHORED — and REWRITTEN ON 2026-08-16, at the user's direction, after a reviewer noticed
     * that the Hebrew rotor named different roles than the English one.
     *
     * WHAT IT USED TO BE: "חבר צוות חדש" plus a rotor of "למכירות / לתמיכה / למחקר / לתפעול",
     * SOURCED from services 01 ("חברי צוות שאף פעם לא נחים", pages/services.html). It was a
     * restoration rather than a translation, and it is recorded here rather than deleted: the
     * two locales named different things ON PURPOSE, and that is what the user overrode. If
     * the finance framing is ever dropped from the English side, this is the phrasing to
     * return to — its measured widths are in git.
     *
     * WHAT IT IS NOW: the direct Hebrew of "your new", split off the rotating noun. Line 2
     * reads "האנליסט החדש שלכם".
     *
     * ⚠️ THIS RUN NO LONGER LEADS THE LINE, AND THE REASON IS GRAMMAR. English modifies BEFORE
     * the noun ("your new" + "analyst"). Hebrew puts the definite noun first and the modifier
     * after, so "החדש שלכם" cannot possibly lead. Under rtl a `flex-row` reverses visually,
     * so DOM order is still READING order — which means the fix is a DOM-ORDER SWAP and not a
     * class. `hero.rotorLeads` below is `true` here and `false` in English, and ClixHero.tsx
     * renders the rotor before this run when it is set.
     *
     * Plural-formal "שלכם" matches the register the rest of the file already uses ("הכירו").
     * Measured 252.8px at 56px, inside the phone tier's 358px measure at a 390px viewport and
     * 20.6px narrower than the run it replaces, so the single-line headroom only improved.
     */
    lead: "החדש שלכם",
    /*
     * AUTHORED as of 2026-08-16 — the Hebrew of English's two, replacing the four SOURCED roles
     * described under `lead`. The user's instruction was that both locales name the same
     * things, and English is the side that was kept.
     *
     * "אנליסט" is the term Israeli finance writing actually uses; "מנתח" is the
     * general-purpose analyst and would read as a data role beside a wordmark like this one.
     *
     * ⚠️ THE DEFINITE `ה` PREFIX IS PART OF THE ROTATING WORD, not of `lead`, and it has to be:
     * "האנליסט החדש שלכם" needs the article on the noun, the noun leads the line, and a
     * bare "ה" cannot be left stranded in its own box with a 16px gap behind it. It is counted
     * in the widths below.
     *
     * `words` stays `readonly string[]` rather than becoming a tuple even though both locales
     * now carry two. English's list is known-incomplete (see ClixHero.tsx), so the arity is
     * still content and not layout, and pinning it would have to be undone the moment a third
     * English word is observed.
     */
    words: ["האנליסט", "המשקיע"],
    /*
     * TRUE HERE, FALSE IN ENGLISH — the rotating noun renders BEFORE `lead`. See the long note
     * in en/clix.ts and the ⚠️ under `lead` above: this is Hebrew word order, expressed as DOM
     * order because rtl already reverses the row visually.
     */
    rotorLeads: true,
    /*
     * MEASURED, not translated — and this is the value English's 306/270 cannot be reused for.
     * RE-MEASURED 2026-08-16 for the two new words. The old 159/260 pair was max(advance) over
     * the four SOURCED roles and is too narrow for these.
     *
     * The box is fixed-width so the row's centre never moves as the word swaps. The width has
     * to be `max(advance of every word)` at the largest size that tier renders, and it must be
     * every word, not the resting one: under `prefers-reduced-motion` the rotor freezes on
     * `words[0]`, so a single reading measures the wrong string.
     *
     * Headless Chrome, Discovery 400 at -0.06em, definite article included:
     *              92px    72px    56px
     *   האנליסט    281.9   220.6   171.6   <- widest at every size
     *   המשקיע     276.3   216.3   168.2
     *
     * `tablet` serves BOTH the 72px and 92px tiers (the class has two stops, the type has
     * three), so it is sized for 92px: 282px. `phone` is the 56px maximum: 172px. Both are
     * border-box widths and both round UP off the widest word, which is this file's rule and
     * NOT English's — rogo's 270px box is deliberately 3px narrower than "investor" at 273.0px
     * and lets the 20px `p-5` blur allowance absorb the overhang.
     *
     * ⚠️ RE-DERIVE THESE IF THE `[dir="rtl"]` LETTER-SPACING HOOK IN globals.css IS EVER FILLED.
     * At natural tracking these two run about 15% wider, so the pair would land near 324 / 197.
     */
    rotorWidth: { phone: "172px", tablet: "282px" },
    /*
     * AUTHORED, and it is ONE SENTENCE rather than a join for a reason.
     *
     * English builds this by concatenating the static run with `words.join(" or ")`. Hebrew
     * cannot: "החדש שלכם" governs BOTH nouns and belongs once, at the END of the sentence,
     * so a join in visual order would emit "האנליסט המשקיע החדש שלכם" and lose the
     * coordination entirely. So the sentence is written out. It is `sr-only`, so it costs no
     * geometry at all.
     *
     * Cost, stated, and it is the same one English pays: it does not track `words`. Add a word
     * above, add it here.
     */
    srHeading: "הכירו את Clix, האנליסט או המשקיע החדש שלכם.",
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

  /*
   * מה clix בונה. This block replaced ten FABRICATED ENDORSEMENTS on 2026-08-13, in step with
   * en/clix.ts. Read the long note over `capabilities` there for why they went; the short form
   * is that they were rogo's real quotes reattributed to invented finance firms, and Hebrew
   * made them worse rather than better, since fluent endorsements in the audience's own first
   * language read as MORE credible, not less.
   *
   * ⚠️ THIS IS STILL NOT A RESTORATION, and the reason is unchanged:
   * docs/reference/clixsolutions/README.md:283 records that the real company's endorsements are
   * four 9:16 videos and that "No quote text exists anywhere in the markup". There was nothing
   * to source before and there is nothing to source now. The difference is that these strings
   * no longer put words in anyone's mouth — they describe what clix builds, which is a claim
   * the company can stand behind or correct.
   *
   * ⚠️ AUTHORED, NOT TRANSLATED WORD FOR WORD, per this file's standing rule. The English
   * cards are the brief; the Hebrew is written to read as Hebrew.
   *
   * ⚠️ THE USER SHOULD READ THESE. They are the copy that matters most to the actual audience
   * and they were drafted, not sourced. Flagged in features/felix-page/CONTEXT.md as open.
   *
   * NO DASHES, per 2026-08-10. The one carve-out this file already has stands: the Hebrew
   * prefix hyphen in forms like ה-AI and ה-CRM is orthography, not punctuation.
   *
   * ⚠️ LINE COUNTS HERE ARE UNVERIFIED, unlike the block this replaced, whose Hebrew was
   * measured against the 372px and 272px content boxes. `label` and `stack` are still
   * `whitespace-pre` and still cannot wrap; the longest is "Webhooks ותשתית ביניים" at 22
   * characters, which has room to spare in 272px, but nobody has put a ruler on it.
   */
  capabilities: {
    /* AUTHORED. Echoes the SOURCED services H1, "אנחנו בונים את המנגנונים השקטים שמניעים עסקים
       מודרניים", without reusing its noun: the manifesto H2 immediately above already opens on
       "המנגנונים", and two headings running on the same word reads as a copy error rather than
       a motif. This one carries the "בשקט" half instead.
       ⚠️ NOT MEASURED. English sets 2 lines at 500px/48px; this is expected to as well at 33
       characters, but it has not been checked in the browser. */
    title: "מה clix מריץ עבורכם בלי שתשימו לב",
    cards: [
      {
        line: "עונה ומסנן כל ליד בוואטסאפ, בעברית, גם בשתיים בלילה.",
        label: "סוכן AI",
        /* Product name, left in Latin exactly as English has it. */
        stack: "WhatsApp Business API",
      },
      {
        line: "רודף אחרי התשובה שאף אחד לא זכר לשלוח.",
        label: "אוטומציית מעקב",
        stack: "CRM · אימייל",
      },
      {
        line: "ה-CRM, היומן והחיוב שלכם סוף סוף מספרים את אותו הסיפור.",
        label: "אינטגרציות",
        stack: "CRM · יומן · חיוב",
      },
      {
        line: "קובע את הפגישה בזמן שהלקוח עוד מקליד.",
        label: "סוכן תיאום פגישות",
        stack: "יומן · וואטסאפ",
      },
      {
        line: "הופך תיבת מייל מלאה בהזמנות לשורות שאף אחד לא הקליד.",
        label: "קליטת מסמכים",
        stack: "אימייל · גיליונות",
      },
      {
        line: "דשבורד אחד לנתונים שהיו פזורים בארבעה טאבים.",
        label: "דשבורדים פנימיים",
        stack: "פיתוח ייעודי",
      },
      {
        line: "הכלי הפנימי שאף מוצר מדף לא באמת התאים לו.",
        label: "תוכנה בהתאמה אישית",
        stack: "ווב · מובייל",
      },
      {
        /* "רב לשוניים" is deliberately unhyphenated. The maqaf here would be punctuation, which
           the no-dashes rule covers; the file's carve-out is only for the prefix hyphen before
           Latin strings. */
        line: "מדבר בשפה של הלקוח שלכם, באפליקציה שכבר פתוחה אצלו.",
        label: "סוכנים רב לשוניים",
        stack: "עברית · ערבית · אנגלית",
      },
      {
        line: "ניסיונות חוזרים והתראות, כי אוטומציה שאף אחד לא סומך עליה גרועה מכלום.",
        label: "ניטור",
        stack: "מובנה כברירת מחדל",
      },
      {
        line: "כל העברה בין המערכות שלכם, באחריות ברורה ועם תיעוד.",
        label: "Webhooks ותשתית ביניים",
        stack: "API · תורים",
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
