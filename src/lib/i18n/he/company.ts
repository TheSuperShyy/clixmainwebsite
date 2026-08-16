/**
 * Hebrew copy for /company. OWNED BY ONE AGENT.
 *
 * PROVENANCE IS MANDATORY. Mark every string in a comment beside it as either:
 *   · SOURCED  — lifted from docs/reference/clixsolutions/ (the capture of the real company
 *                site, which is `lang="he" dir="rtl"` and has no English version). Give the
 *                path: `home.headings[1]`, `services.bodyText`, `pages/about.html`, …
 *   · AUTHORED — written in that captured voice because no counterpart exists. These are the
 *                ONLY strings the user has to review, which is the whole point of marking.
 *
 * ⚠️ NEVER LIFT AN H1 FROM content.json. Its extractor walked per-word spans and concatenated
 * without separators, so every H1 in that file has lost its spaces
 * ("מערכותAIמהונדסותלעסקשלכם."). H2/H3 and bodyText are fine. Recover H1s from
 * docs/reference/clixsolutions/pages/*.html — strip tags, collapse whitespace.
 *
 * ⚠️ TYPED AGAINST THE ENGLISH SHAPE, so a missing key, an extra key, or a wrong TUPLE LENGTH
 * is a build failure rather than an English word on a Hebrew page.
 *
 * ⚠️ THE NO-DASHES RULE HAS ONE CARVE-OUT: the Hebrew prefix hyphen stays, because `בWhatsApp`
 * is misspelled. The real site writes `ב-WhatsApp`, `ה-AI`, `רב-לשוני`. Orthography, not style.
 *
 * ── THIS ROUTE IS MOSTLY RESTORATION, NOT TRANSLATION ────────────────────────────────────
 * 30 of the 39 strings below are SOURCED and 9 are AUTHORED. The sourced set includes all
 * twenty-four service-card strings, both runs of the Mission headline, the Hero's h1, the
 * Hero's subhead, the Hero's CTA and the Mission paragraph. (Was 18 of 31 until 2026-08-16,
 * when the `tools` heading went with its band and the services band grew from eight labels
 * to eight cards — sixteen NEW strings, every one of them captured. Then 34/47 → 30/39 the
 * same day, when `careers` went with its band: four AUTHORED strings out, no sourced ones.) The English on this route was written by rendering
 * that Hebrew into English in the first place, so the Hebrew is the earlier text of the two —
 * "translation" is the wrong word for most of this file.
 *
 * ── LINE COUNTS, MEASURED, NOT GUESSED ───────────────────────────────────────────────────
 * Every count below was read off real glyph advances from `discovery-var.woff2` (advances +
 * GPOS kerning + CSS letter-spacing, greedy break on spaces) and then confirmed in headless
 * Chrome at 1600 / 1440 / 1024 / 390. The harness was validated first by reproducing five
 * independently measured English values on this page exactly — the h1's 2/2/1/3, the Mission
 * paragraph's 3/3/2/5, the Services intro's 3/3/3/5, the Careers paragraph's 2/2/1/3 and the
 * Services title's 2/2/2/2 — so where a Hebrew count differs below, it differs for real.
 *
 * ⚠️ THREE RECORDED DIVERGENCES, all of them the box getting SHORTER, none of them overflow:
 * `hero.title` (one line fewer at desktop and at phone), `mission.body` (one fewer at every
 * tier, two at phone) and `services.intro` (one fewer at 390 only). Every other box on the
 * route is pixel-identical to the English one. Each is recorded beside the string itself.
 */

import type { Translated } from "../shape";
import type { CompanyDict } from "../en/company";

export const company: Translated<CompanyDict> = {
  hero: {
    /* SOURCED — pages/about.html, the `הצוות שלנו` section's H2 (`about.headings[0]`).
       ⚠️ THE CAPTURE'S DOM SAYS `האנשים ש<!-- --> <span>בנו את זה.</span>`, i.e. it renders a
       literal space between the prefix `ש` and `בנו`, because the JSX behind it emitted a
       `{" "}` before the accent span. That space is a bug in the source, not orthography — a
       prefixed `ש` cannot stand as its own word — so it is closed here. Everything else is
       byte-for-byte the capture's.

       ⚠️ RECORDED DIVERGENCE — THE BOX SHRINKS. One of only three places on the route where
       the measured English geometry is not reproduced, and the largest. Chrome, at
       1600 / 1440 / 1024 / 390: English sets 2 / 2 / 1 / 3 lines for h1 boxes of
       167.19 / 167.19 / 68.41 / 182.39, which is the capture's 167.2 / 68.4 / 182.4 to the
       pixel. This phrase sets 1 / 1 / 1 / 2, for 83.59 / 83.59 / 68.41 / 121.59 — one line
       short at desktop, exact at tablet, one short at phone. The Hero band therefore measures
       1182.70 against English's 1266.30 at 1600 and 1440 (−83.60), 968.52 against 968.52 at
       1024 (identical), and 693.13 against 774.72 at 390 (−81.59, of which −60.80 is this h1
       and −20.79 the subhead below). Nothing overflows and nothing clips — this is the
       direction §9's measurements predict for Hebrew.
       It is NOT tuned away: `האנשים שבנו את המנגנונים השקטים.` measures 2 / 2 / 1 / 3 and
       would reproduce the boxes to the pixel, but it is copy invented to fill a box, and it
       would repeat `המנגנונים השקטים` from the subhead 20px below it. Shrinking the band is
       the smaller price. If the box matters more than the wording, that string is the swap. */
    title: "האנשים שבנו את זה.",
    /* SOURCED — pages/services.html's H1, recovered from the HTML and NOT from
       `content.json`, whose copy of it reads `אנחנובוניםאתהמנגנוניםהשקטים…` with every space
       lost. Same string the /he root layout uses as its meta description.
       Sets 1 / 1 / 1 / 1 line against English's 1 / 1 / 1 / 2 — measured 23.41 / 23.41 /
       20.80 / 20.80 against English's 23.41 / 23.41 / 20.80 / 41.59. One line short at 390
       only, and THE TIGHTEST FIT ON THE ROUTE: the advance lands within a couple of pixels of
       the 358px box there, which is why it was read in Chrome rather than inferred. The failure
       mode if it ever tips over is benign — it becomes two lines, which is exactly the box
       English already measures. */
    subhead: "אנחנו בונים את המנגנונים השקטים שמניעים עסקים מודרניים.",
    /* SOURCED — `about.links[9].text`, the CTA on every page of the real site. Same string as
       `chrome.nav.cta`. 65.9px against English's 66.2px, so the 220px bracket frame it sits in
       does not move; `whitespace-pre` cannot wrap and does not have to. */
    ctaLabel: "בואו נתחיל",
    /* AUTHORED — the clip is this repo's own asset, so there is nothing to lift. */
    videoLabel:
      "צילום מהרצאה של Clix, דובר הנושא דברים לפני קהל יושב בחלל סטודיו.",
  },

  mission: {
    /* SOURCED, both runs, verbatim — `services.headings[9]`, the real site's own methodology
       headline. The BREAK is sourced too, not only the words: pages/services.html sets it as
       `<h2>מהירות של <span>מעבדה.</span><br/>משמעת של <span>מפעל.</span></h2>`, so the real site
       divides this headline at exactly the point our own `<br>` does. (Its two accent spans
       italicise the second half of each line — its design, not ours, and not copied.)
       TWO runs here as in English, and each sets on ONE line at every tier
       (299 / 299 / 272 / 217px against a 490 / 490 / 490 / 358px column), so the measured h3
       boxes 96.8 / 88 / 70.4 hold exactly. */
    heading: ["מהירות של מעבדה.", "משמעת של מפעל."],
    /* SOURCED — `about.bodyText`, the eyebrow directly above this exact section.
       ⚠️ The element carries `text-transform: uppercase`, which is INERT in Hebrew — the script
       is unicase — so this renders as written while the English renders shouted. That is a
       property of the language, not a divergence to fix. */
    teamLabel: "הצוות שלנו",
    /* [0] and [1] SOURCED — both are fragments of `about.bodyText`'s team sentence, which
       names `בוגרי יחידה 8200 והטכניון` (see `body` below, where the whole sentence appears).
       [2] AUTHORED — compressed. The sourced clause is `מפתחים, מהנדסים ואנשי מקצוע מוכשרים`,
       which measures 251px against this cell's 215.33px at 1600/1440 and so wraps to two
       lines, growing the grid's first row by 20.8px. The full clause is used instead where the
       box is wide enough to hold it, in `careers.body`. All three items sit on one line at
       every tier as written (102 / 43 / 158px).
       ⚠️ `8200` inside an RTL run needs no markup: the bidi algorithm resolves European digits
       LTR inside a Hebrew paragraph on its own. */
    teamItems: ["בוגרי יחידה 8200", "הטכניון", "מפתחים ומהנדסים בכירים"],
    /* AUTHORED — a field label. `ממוקמים ב` reads as a broken sentence on its own line, so the
       noun is used. Also unaffected by the element's `uppercase`. */
    locatedInLabel: "מיקום",
    /* SOURCED — `about.links[14].text` is `תל אביב · שירות גלובלי`; the city is taken from it.
       The `-יפו` of `chrome.footer.mapTitle` is deliberately not added: the English run beside
       it says `Tel Aviv`, and this is one paragraph split by a `<br>`, not two labels. */
    city: "תל אביב",
    /* AUTHORED — the capture's own line pairs the city with `שירות גלובלי` rather than a
       country, so the country name has no source. It is the counterpart of `Israel` and
       nothing more. */
    country: "ישראל",
    /* SOURCED, verbatim — `about.bodyText`, the paragraph beside the team grid.
       ⚠️ RECORDED DIVERGENCE. Sets 2 / 2 / 1 / 3 lines against English's 3 / 3 / 2 / 5, so the
       paragraph box measures 46.81 / 46.81 / 20.80 / 62.39 rather than 70.22 / 70.22 / 41.59 /
       103.98, and the Mission band measures 380.80 / 380.80 / 418.78 / 539.97 against
       English's 404.20 / 404.20 / 439.58 / 581.56 — one line shorter at every tier, two at 390.
       Recorded, not trimmed: this is the sentence the company writes about itself.
       ⚠️ IT REPEATS `בוגרי יחידה 8200 והטכניון` FROM `teamItems` two columns to its right,
       because on the real site this sentence carries the credential alone and there is no
       adjacent list. If the user would rather not say it twice, this paragraph is the copy to
       change, not the list — the list is what the column's label promises.
       ⚠️ CONTENT FLAG, NOT MINE TO RESOLVE: this is the Unit 8200 / Technion credential, and
       in Hebrew it is stated to the audience most able to check it. It is the company's own
       claim, lifted from its own site, not an invention here. The route is `noindex`
       (CompanyRoute.tsx:19-35) and that guard is what makes the line shippable in either
       language. */
    body:
      "צוות מקצועי של מומחי אוטומציה ופיתוח בוגרי יחידה 8200 והטכניון שבונים מערכות " +
      "ייעודיות לארגונים שלוקחים את הטכנולוגיה שלהם ברצינות.",
  },

  services: {
    /* AUTHORED — the English is this repo's own headline for a band whose original held
       employer logos, so there is no counterpart to lift. Sets 2 / 2 / 2 / 2 lines, the same
       count as English, so the measured h3 boxes 96.8 / 88 / 70.4 hold. A `בנוי מ…` opening
       was tried first and dropped: with no subject in the sentence it reads as a fragment in
       Hebrew where it reads as a headline in English.
       ⚠️ THE BOX MOVED. This heading now sets in a 440px sticky column, not the old 640px
       full-width one, so the 2/2/2/2 count above is STALE and must be re-measured. */
    title: "שמונה שירותים שעובדים יחד כמערכת אחת",
    /* AUTHORED, but the list inside it is SOURCED — `services.desc` and `home.bodyText` both
       run the same enumeration (`סוכני AI, אוטומציות WhatsApp, מערכות CRM, אינטגרציות ותוכנה
       מותאמת אישית`), and the eight names are the section headings of pages/services.html.
       ⚠️ ITS RECORDED DIVERGENCE IS ALSO STALE. It read 3 / 3 / 3 / 4 against English's
       3 / 3 / 3 / 5 — one line short at 390 only — but that was measured against the old
       max-w 640 / none text column. Re-measure against the sticky column.
       `ה-AI` carries the prefix hyphen the real site uses (`ה-AI הנכון`, services.bodyText). */
    intro:
      "Clix בונה סוכני AI, אוטומציות WhatsApp, הטמעת CRM, אינטגרציות, אתרים, אפליקציות " +
      "מובייל ותוכנה מותאמת אישית, ולצידם את אסטרטגיית ה-AI שקובעת מה מכל אלה העסק שלכם " +
      "צריך, ומה לא.",
    /* ─── THE EIGHT CARDS ──────────────────────────────────────────────────────────────────
     *
     * ⚠️ SHAPE CHANGED 2026-08-16, and this side of it is almost pure RESTORATION. The band
     * was eight bare labels; it is now eight cards carrying a kicker and a promise as well.
     * ALL TWENTY-FOUR HEBREW STRINGS BELOW ARE SOURCED VERBATIM from `services.bodyText`,
     * which sets each service as `NN · <kicker>` / `<name>` / `<promise>`. Nothing here is
     * authored, and the eight `name` values are byte-identical to the `items` tuple they
     * replace — so the one-line fit measured for them still holds.
     *
     * ⚠️ THE EIGHT BENEFIT KICKERS WERE DELIBERATELY LEFT OUT UNTIL NOW, and the reason is
     * recorded in this file's own history: the tiles rendered a label and nothing else,
     * English included, so adding them would have meant adding English copy to a route whose
     * English render had to stay still. The card layout is what changed that — the slot now
     * exists in both locales, so the captured text can finally land where it belongs.
     *
     * ⚠️ LINE COUNTS FOR `kicker` AND `promise` ARE NOT MEASURED. Every other count in this
     * file was read off real glyph advances and confirmed in Chrome; these sixteen strings are
     * new to the route and their cards are new geometry. Nothing CLIPS, though — the cards are
     * `min-h-*` in a stretched grid, so a long Hebrew promise pushes its row taller instead of
     * being cut off. An unmeasured count here is a look to check, not a silent failure.
     *
     * ⚠️ UNREAD BY A NATIVE SPEAKER — but sourced, so the risk here is placement, not wording.
     */
    cards: [
      {
        /* SOURCED ×3 — `services.bodyText`, block `01`. */
        kicker: "להאיץ מכירות ותמיכה",
        name: "סוכני AI",
        promise: "חברי צוות שאף פעם לא נחים.",
      },
      {
        /* SOURCED ×3 — block `02`. */
        kicker: "למכור איפה שהלקוח נמצא",
        name: "אוטומציות WhatsApp",
        promise: "הערוץ שבו הלקוחות שלכם כבר נמצאים.",
      },
      {
        /* SOURCED ×3 — block `03`. */
        kicker: "לאחד את תמונת הלקוח",
        name: "הטמעת CRM",
        promise: "תמונת לקוח אחת ואמיתית במקום אחד.",
      },
      {
        /* SOURCED ×3 — block `04`. The name is LONGER than English's `Integrations` and was
           already the widest label on the old grid at 168px; the card column is no narrower
           than the tile it replaces, so it still sets on one line. */
        kicker: "לחבר את כל המערכות",
        name: "אינטגרציות ואוטומציות",
        promise: "כל הכלים שלכם מדברים זה עם זה.",
      },
      {
        /* SOURCED ×3 — block `05`. */
        kicker: "להמיר תנועה ללקוחות",
        name: "בניית אתרים",
        promise: "אתרי שיווק שטוענים מהר וממירים חזק.",
      },
      {
        /* SOURCED ×3 — block `06`. This is the one service whose MOCK had to be designed
           rather than rebuilt — the capture describes no artwork for it — but its three
           strings are captured like all the others. */
        kicker: "להגיע ישר לכיס של הלקוח",
        name: "פיתוח מובייל",
        promise: "אפליקציות נייטיב שלקוחות באמת פותחים.",
      },
      {
        /* SOURCED ×3 — block `07`. */
        kicker: "לבנות בדיוק מה שצריך",
        name: "תוכנה מותאמת אישית",
        promise: "כשפתרון מדף פשוט לא מספיק.",
      },
      {
        /* SOURCED ×3 — block `08`. ⚠️ THE KICKER AND THE PROMISE ARE THE SAME SENTENCE ON THE
           REAL SITE, and both are reproduced rather than "fixed". English carries the same
           repetition for the same reason — see en/company.ts. The band's one open copy
           question, flagged in features/company-page/FEATURE.md. */
        kicker: "להמר על הדברים הנכונים",
        name: "אסטרטגיית AI וייעוץ",
        promise: "להמר על הדברים הנכונים.",
      },
    ],
  },
};
