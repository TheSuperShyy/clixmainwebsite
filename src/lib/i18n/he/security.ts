/**
 * Hebrew copy for /security. OWNED BY ONE AGENT.
 *
 * PROVENANCE IS MANDATORY. Mark every string in a comment beside it as either:
 *   · SOURCED  — lifted from docs/reference/clixsolutions/ (the capture of the real company
 *                site, which is `lang="he" dir="rtl"` and has no English version). Give the
 *                path: `home.headings[1]`, `services.bodyText`, `pages/about.html`, …
 *   · AUTHORED — written in that captured voice because no counterpart exists. These are the
 *                ONLY strings the user has to review, which is the whole point of marking.
 *
 * ⚠️ ON THIS ROUTE EVERYTHING EXCEPT THE CTA IS AUTHORED, because the real company site has no
 * security page. Its nearest material is a handful of bullets, and those are the vocabulary this
 * file is built OUT OF rather than invented around. The wells drawn on, all from
 * `docs/reference/clixsolutions/content.json`:
 *   · services 08 · אסטרטגיית AI וייעוץ — סקירת מוכנות והזדמנויות AI · תיעדוף תרחישי שימוש
 *     והצדקה עסקית · ארכיטקטורה ובחירת ספקים ומודלים · סקירת סיכונים, אבטחה ועמידה ברגולציה ·
 *     מפת דרכים והעצמת הצוות
 *   · services 07 · תוכנה מותאמת אישית — אימות, חיוב, רב-דיירות ו-RBAC · ענן, CI/CD ונראות
 *     מערכתית
 *   · industries · פיננסים וביטוח — אינטגרציות מאובטחות · "אפס מקום לטעות בנתונים"
 *   · methodology 04 · הפעלה — "שליטה מלאה, ללא תלות חיצונית."
 *   · home, web section — "והכל בבעלותכם המלאה" · "ללא תבניות גנריות, ללא קוד נטוש"
 *   · services 01 · סוכני AI — "בשפת המותג שלכם, על הנתונים שלכם"
 * A phrase that is a near-verbatim lift of one of those is marked SOURCED-VOCAB with its bullet
 * named; where only the register carries over, it is plain AUTHORED. The register itself is the
 * site's: first person plural ("אנחנו בונים", "אנחנו מנטרים", "אנחנו עורכים סקירה"), second
 * person plural possessive ("שלכם"), short declaratives, no hedging.
 *
 * ⚠️ NO CERTIFICATION SEALS, AND THE CAPTURE IS NOT A LICENCE TO ADD THEM. The real site's
 * services 08 mock paints a badge row reading `SOC 2 · GDPR`. This route deliberately ships
 * neither: SOC 2 and ISO 27001 are AUDITED certifications clix does not hold, and this repo
 * removed that exact set from the home page on 2026-08-05. The five cells carry PRACTICE
 * STATEMENTS, and the heading moved with them ("Compliant With / Industry Standards" became
 * "Built On / Practices We Keep") precisely because nobody certifies a practice. Lifting the
 * mock's badge row in here would quietly undo that decision.
 *
 * ⚠️ TYPED AGAINST THE ENGLISH SHAPE, so a missing key, an extra key, or a wrong TUPLE LENGTH is
 * a build failure rather than an English word on a Hebrew page. `labelWidth` is a number and
 * `Translated` passes numbers through unwidened, so each locale carries its own fitted measure.
 *
 * ⚠️ THE NO-DASHES RULE HAS ONE CARVE-OUT: the Hebrew prefix hyphen stays, because `בWhatsApp`
 * is misspelled. The real site writes `ב-WhatsApp`, `ה-AI`, `רב-לשוני`. Orthography, not style.
 * Used below in `ב-TLS` and `ה-CRM`, and nowhere else. There are no em or en dashes in the copy.
 *
 * ═══ HOW THESE STRINGS WERE FITTED, AND WHY THAT MATTERS MORE HERE THAN ELSEWHERE ═══════════
 * Measured over CDP against the real face (Discovery, confirmed loaded and confirmed to carry
 * Hebrew glyphs: the same Hebrew string measures 558.3px in Discovery, 553.6 in Arial and 486.5
 * in serif at 100px, so these are not fallback metrics). Fitted by RENDERED LINE COUNT, never by
 * character count — `docs/CONTEXT.md` records that guess going wrong three times, the sharpest
 * being a title 62 characters against a 63-character original that wrapped to three lines and
 * pushed 645 elements down the page.
 *
 * Two boxes on this route constrain the copy, and they constrain it in opposite directions:
 *
 *  1. `benefits.items` — SIX UNIFORM GRID ROWS. Each title must set exactly 1 line and each body
 *     exactly 2, at column widths 400 (≥1200) / 452 (1024) / 358 (390). The row height is a SUM
 *     (36 + 64 + 23.41 + 4 + 41.59 + 16 = 185 at ≥1200), so a ONE-line body breaks the grid
 *     exactly as a three-line one does. And since Hebrew here runs shorter than English,
 *     UNDERSHOOT IS THE LIKELY FAILURE: a first pass of these six bodies, translated
 *     phrase-for-phrase, measured 391–485px natural and fell back to a single line in three of
 *     the six columns. Every body below therefore has a natural width in the window
 *     (452, ~700): above 452 so it wraps even in the widest column, below ~700 so it still fits
 *     two lines in the narrowest. Measured naturals are recorded per string.
 *  2. `hero.title` — the hero is `70vh` with `place-content: center` AND `overflow: hidden`, so
 *     it does NOT grow: 630px of box against 580px of content at a 900px viewport. A third h1
 *     line costs 83.6px and would be CLIPPED, not absorbed. See its own note for what that cost
 *     the copy.
 */

import type { Translated } from "../shape";
import type { SecurityDict } from "../en/security";

export const security: Translated<SecurityDict> = {
  hero: {
    /**
     * AUTHORED. ⚠️ A RECORDED DIVERGENCE FROM THE ENGLISH'S SHAPE (contract §10).
     *
     * English sets two parallel nominal sentences, "Your Keys. Your Data.", and they set two
     * lines of 88px inside the 540px measure. The word-for-word Hebrew,
     * `המפתחות שלכם. הנתונים שלכם.`, measures 983.9 / 805.0 / 715.6px at 88 / 72 / 64px and sets
     * 2 / 2 / THREE lines — the phone tier gains a line because `שלכם.` will not share a line
     * with `הנתונים` at 64px in 358px. The phone hero is `min-content` so that would not clip,
     * but it would put the two locales' heroes 60.8px apart for no gain.
     *
     * So the two sentences become one coordinated phrase, which keeps both nouns and both
     * possessives: 782.9 / 640.6 / 569.4px natural, 2 / 2 / 2 lines — the same count as English
     * at every tier, hence the same 167.19 / 136.81 / phone h1 box and the same band height.
     * The possessive is the real site's own; services 01 says "על הנתונים שלכם".
     */
    title: "המפתחות והנתונים שלכם.",
    /**
     * AUTHORED, in the site's first-person-plural voice. Natural 740.3px at 18px and 658.1px at
     * 16px, so it sets 2 lines at 540 and 2 at 358 — the same as English at all three tiers.
     * "ההרשאות המצומצמות ביותר" is the phrasing the whole route uses for least privilege and it
     * recurs in `benefits.items[3]` and `core.body1`, exactly as English repeats "narrowest …
     * that does the job" in the hero and in card 4.
     */
    subtitle:
      "אנחנו מריצים את האוטומציות שלכם בתוך החשבונות שלכם, עם ההרשאות המצומצמות ביותר שהעבודה דורשת.",
    /**
     * SOURCED verbatim — `about.links[9].text`, the CTA on every page of the real site, and the
     * same string `chrome.nav.cta` and `chrome.footer.cta` already carry. 220 × 40 frame
     * unchanged; the label is inside a `whitespace-pre` span and clears it easily.
     *
     * ⚠️ A RECORDED COLLAPSE, FLAGGED FOR THE USER. English distinguishes this button ("Request
     * Demo") from the nav's and the footer's ("Let’s start"); Hebrew does not, because the real
     * site has exactly one call to action and this is it. Inventing a second Hebrew CTA to
     * preserve an English distinction would be authoring where a source exists — but if the two
     * should read differently in Hebrew, this is the one string to change.
     */
    cta: "בואו נתחיל",
  },

  /**
   * ⚠️ SIX TITLES AT 1 LINE, SIX BODIES AT 2, AT EVERY TIER. Verified rendered, not estimated.
   * Titles measure 96.3–175.7px at 16px and 108.4–197.6px at 18px against column widths of 358 /
   * 452 / 400, so they have well over twice the room they need and are not the risk — which is
   * also why the four CANONICAL titles could be adopted verbatim without a refit. The bodies are
   * the risk: each natural width is given beside it, and each sits inside (452, 700).
   */
  benefits: {
    items: [
      {
        /* AUTHORED. */
        title: "לא מאמנים על הנתונים שלכם",
        /* AUTHORED. 561.5px natural. The active first-person form is the site's own register and
           it is also what carries this string past 452 — the passive
           "הנתונים שלכם לא משמשים לאימון…" measures 485.7 and is 2/2/2 too, but with a third of
           the margin. */
        body: "אנחנו לא משתמשים בנתונים שלכם כדי לאמן או לשפר שום מודל, לא שלנו ולא של ספק חיצוני.",
      },
      {
        /* AUTHORED · CANONICAL (see the shared-label note under `compliance.practices`). Same
           string as `compliance.practices[1].label`, as in English. */
        title: "הנתונים שלכם נשארים שלכם",
        /* AUTHORED. 519.2px natural. "האוטומציות רצות בתוך החשבונות שלכם, ואנחנו לא מחזיקים
           עותק שני." was the first draft and measured 424.8 — one line in the 452px column. */
        body: "תהליכי העבודה רצים בתוך החשבונות שלכם, ואנחנו לא מחזיקים עותק שני של הנתונים.",
      },
      {
        /* AUTHORED. SOURCED-VOCAB: "נראות" is services 07's own word
           ("ענן, CI/CD ונראות מערכתית"). */
        title: "נראות מלאה על כל הרצה",
        /* AUTHORED. 515.7px natural. ⚠️ OPEN QUESTION 1 — assumes per-run logs exist AND are
           visible to the client, not merely retained internally. Changes together with the
           English and with `core.body1`. */
        body: "כל הרצה מתעדת מה נקרא, מה נכתב ומתי בדיוק, כך ששום דבר לא נשאר מוסתר מכם.",
      },
      {
        /* AUTHORED · CANONICAL. Same string as `compliance.practices[2].label`. */
        title: "גישה בהרשאות מינימום",
        /* AUTHORED. 585.8px natural, the widest of the six and still two lines at 358. */
        body: "כל אינטגרציה מקבלת את ההיקף המצומצם ביותר שהעבודה דורשת, ולא הרשאה אחת רחבה יותר.",
      },
      {
        /* AUTHORED · CANONICAL. Same string as `compliance.practices[3].label`. */
        title: "הצפנה בתעבורה ובאחסון",
        /**
         * AUTHORED. 509.4px natural. ⚠️ OPEN QUESTION 2 — names TLS and a MANAGED secret store,
         * both specific enough to be wrong. `ב-TLS` carries the prefix hyphen by the carve-out.
         *
         * This is the string the 452px column bit hardest: the direct rendering
         * "הנתונים עוברים ב-TLS ופרטי הגישה נשמרים במאגר סודות מנוהל." measures 391.5px and set
         * ONE line in the 400px column as well as the 452px one. "בכל שלב" and "ולא בקוד" are
         * what carry it to two — and both are statements of the same practice rather than
         * padding, which is the only acceptable way to lengthen a string to fit a box. A variant
         * ending "מנוהל ומוצפן" was rejected: it would assert encryption of the store itself,
         * which is a second unverified specific on a card that already carries one.
         */
        body: "הנתונים עוברים ב-TLS בכל שלב, ופרטי הגישה נשמרים במאגר סודות מנוהל ולא בקוד.",
      },
      {
        /* AUTHORED · CANONICAL. Same string as `compliance.practices[4].label`.
           SOURCED-VOCAB: "בבעלותכם" is home's own ("והכל בבעלותכם המלאה"). */
        title: "הקוד בבעלותכם",
        /* AUTHORED. 525.7px natural. SOURCED-VOCAB: methodology 04 closes on "שליטה מלאה, ללא
           תלות חיצונית", which is precisely this card's claim. */
        body: "האוטומציות הן שלכם. אפשר להעביר אותן לצוות אחר, או להמשיך להפעיל אותן בלעדינו.",
      },
    ],
  },

  compliance: {
    /**
     * AUTHORED ×2 — ONE element, two runs, and the `<br>` between them IS the colour boundary.
     *
     * ⚠️ NEITHER RUN MAY WRAP ON ITS OWN, or the sentence breaks across the colour change at a
     * point neither locale chose. Measured at one line each at every tier: run 1 is 72.8 / 91.0
     * px at 32 / 40px, run 2 is 267.0 / 333.8 / 367.1px at 32 / 40 / 44px, against measures of
     * 358 (phone) / 944 (tablet) / 1280 (desktop).
     *
     * Same shape as the English pair and the same refusal to name a certification: "בנוי על"
     * takes an object that is a practice, not a standard.
     */
    headingPaper: "בנוי על",
    headingMuted: "עקרונות שאנחנו שומרים",
    /**
     * ⚠️ THE FIVE `labelWidth` VALUES WERE RE-DERIVED FOR HEBREW, NOT INHERITED (contract §10).
     * Every one of the target's numbers was fitted to an English label, so each was re-measured
     * against its Hebrew label rather than assumed. Naturals at 14px, in cell order:
     * 154.2 / 156.9 / 125.7 / 133.4 / 86.1px.
     *
     * ⚠️ ONE OF THOSE DISAGREES WITH THE FIGURE THE RECONCILIATION QUOTED, and it is reported
     * rather than reconciled: the canonical set was described as fitting home's 137px box with
     * "הנתונים שלכם נשארים שלכם at 131.6 of 137px", but in THIS route's label style — 14px,
     * line-height 130%, letter-spacing -0.01em, Discovery — the same string measures 156.9px and
     * sets TWO lines in 137px, which the real render confirms. Something about the two boxes
     * differs (type size or tracking); the string is NOT changed to close the gap, because it is
     * canonical and because two lines is inside this cell's real constraint.
     *
     * The constraint is not "match English's line count" — there is no such invariant — it is
     * ≤ 2 LINES AND NO OVERFLOW, and it comes from the geometry: the box is anchored to the
     * cell's bottom inline-start corner and grows UPWARD, its baseline row starting at y 224 of
     * a 240px cell, while the 104px mark occupies y 68→172. Two lines of 14px/130% reach y 187.6
     * and clear the mark; three reach 169.4 and collide with it.
     *
     * ⚠️ ALL FIVE LABELS ARE CANONICAL CROSS-FILE STRINGS AND ARE NOT THIS AGENT'S TO REWORD.
     * The same five practice statements are restated on three pages by four call sites — home's
     * `sections/Security.tsx` grid, this band's five cells, four of `benefits.items`' card
     * titles, and four cells of `product/ProductSecurity.tsx` — deliberately, so the three pages
     * sound like one company. The Hebrew below is the wording reconciled across all four on
     * 2026-08-12 and fitted against home's fixed 137/188px boxes (tightest:
     * "הנתונים שלכם נשארים שלכם" at 131.6 of 137px). Three of the five replaced this agent's
     * first draft: `מינימליות`→`מינימום`, `מוצפן במעבר`→`הצפנה בתעבורה`, `הקוד נשאר בבעלותכם`→
     * `הקוד בבעלותכם`. If one of them ever fails to fit a box on this route, WIDEN THE BOX and
     * report it; do not shorten the string here, because three files would then disagree.
     *
     * Outcome: the target's own measures hold in Hebrew, so they are kept — 137 for the first
     * four and the widened 188 for the fifth, which is the only one the target widened and in
     * which the Hebrew label sets one line exactly as the English does. Rendered line counts are
     * [2, 2, 1, 1, 1] against English's [2, 1, 1, 2, 1]; cell 2 gains a line and cell 4 loses
     * one, purely because the Hebrew phrases are shorter, and both are free because the box
     * grows into 52px of dead space. Recorded rather than tuned: widening cell 2 to 160px would
     * make it one line, at the cost of an asymmetry the target does not have.
     *
     * Measured clearance from the label box's top edge to the 104px mark's bottom, which is the
     * value that actually decides this: 15.59px for a two-line label and 33.80px for a one-line
     * one at ≥1200, 22.63 / 40.83 at 390. Both positive in both locales at all four tiers. A
     * third line costs 18.2px and would put the two-line figure at −2.6, i.e. overlapping the
     * mark — which is the real reason the rule is "at most two".
     */
    practices: [
      {
        /* AUTHORED. SOURCED-VOCAB: "ענן" from services 07's "ענן, CI/CD ונראות מערכתית"; the
           "החשבונות שלכם" possessive is the site's throughout. */
        label: "הענן שלכם, החשבונות שלכם",
        labelWidth: 137,
      },
      /* The four below repeat `benefits.items` 2, 4, 5 and 6 verbatim, exactly as English repeats
         its own four — the two bands are meant to say one thing twice, not two things. */
      { label: "הנתונים שלכם נשארים שלכם", labelWidth: 137 },
      { label: "גישה בהרשאות מינימום", labelWidth: 137 },
      { label: "הצפנה בתעבורה ובאחסון", labelWidth: 137 },
      { label: "הקוד בבעלותכם", labelWidth: 188 },
    ],
  },

  core: {
    /* AUTHORED. 273.9 / 249.0 / 199.2px natural at 44 / 40 / 32px, so one line at every tier —
       the same count the English sets. Echoes `compliance.headingPaper`'s "בנוי" deliberately,
       as English echoes "Built On" with "Built To Be Trusted". */
    title: "בנוי כדי להיות אמין",
    /**
     * AUTHORED, assembled out of the real site's own vocabulary:
     *   · security as a design input rather than a bolt-on — services 08's "סקירת סיכונים,
     *     אבטחה ועמידה ברגולציה" and methodology 02's "בחירה שמתבססת על ROI, אבטחה ועמידות"
     *   · "ה-CRM שלכם" / "הענן שלכם" — services 03 and 07
     *   · "ההיקף המצומצם ביותר" — the phrasing `hero.subtitle` and `items[3]` also use
     *   · "שליטה מלאה, ללא תלות חיצונית" — methodology 04, which is what the closing clause says
     *
     * ⚠️ OPEN QUESTION 1 again: "מתעדים כל קריאה וכל כתיבה" is the same unverified claim as
     * `items[2]`. Both change together.
     *
     * ⚠️ ONE ELEMENT, TWO KEYS. `body1` and `body2` are the two runs of a single `<p>` separated
     * by TWO `<br/>`, and the blank line between them is a real line. Never join them here.
     */
    body1:
      "אבטחה היא לא שכבה שאנחנו מוסיפים בסוף. כל אוטומציה שאנחנו בונים רצה בתוך הענן שלכם, ה-CRM שלכם ותיבות הדואר שלכם, תחת הרשאות שאתם מנפיקים ויכולים לבטל בתוך דקה. אנחנו מבקשים את ההיקף המצומצם ביותר שתהליך העבודה צריך, מתעדים כל קריאה וכל כתיבה, ומוסרים לכם את הקוד כדי ששום דבר לא יהיה תלוי בנו.",
    /**
     * AUTHORED. The closing "והיא ניתנת לבדיקה" is the point of the whole band: the site's own
     * anti-hype register, "AI שעובד, לא AI שמדברים עליו", turned onto security.
     *
     * ⚠️ A RECORDED BOX DIVERGENCE (contract §10), NOT PADDED AWAY. The two runs together set
     * SIX lines in the 766px column where English sets eight, so this row measures 140.44px
     * against English's 187.25 and the band 853.25 against 900.06. Nothing is clipped and
     * nothing overflows; the Hebrew simply says the same six things more compactly, and every
     * clause of the English is present. Two more lines could only be bought with filler, which
     * §10 explicitly forbids: record the divergence, do not tune it away.
     */
    body2:
      "אנחנו לא מאמנים מודלים על הנתונים שלכם, ולא שומרים עותק שני שלהם. כשתהליך עבודה נוגע במשהו רגיש, אתם יכולים לראות בדיוק במה הוא נגע ומתי. זו כל ההבטחה, והיא ניתנת לבדיקה.",
  },
};
