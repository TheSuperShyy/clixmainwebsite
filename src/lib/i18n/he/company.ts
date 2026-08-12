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
 * 18 of the 31 strings below are SOURCED and 13 are AUTHORED. The sourced set includes all
 * eight service names, both runs of the Mission headline, the Hero's h1, the Hero's subhead,
 * the Hero's CTA and the Mission paragraph. The English on this route was written by rendering
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
       was tried first, to echo `tools.heading`, and dropped: with no subject in the sentence it
       reads as a fragment in Hebrew where it reads as a headline in English. */
    title: "שמונה שירותים שעובדים יחד כמערכת אחת",
    /* AUTHORED, but the list inside it is SOURCED — `services.desc` and `home.bodyText` both
       run the same enumeration (`סוכני AI, אוטומציות WhatsApp, מערכות CRM, אינטגרציות ותוכנה
       מותאמת אישית`), and the eight names are the section headings of pages/services.html.
       ⚠️ RECORDED DIVERGENCE, AT ONE TIER ONLY. Sets 3 / 3 / 3 / 4 against English's
       3 / 3 / 3 / 5, so only the 390 box shrinks, by one line: 83.19 against 103.98, taking
       that band to 1747.59 from 1768.39. At 1600, 1440 and 1024 the band is identical to
       English (793.03 / 793.03 / 672.39).
       `ה-AI` carries the prefix hyphen the real site uses (`ה-AI הנכון`, services.bodyText). */
    intro:
      "Clix בונה סוכני AI, אוטומציות WhatsApp, הטמעת CRM, אינטגרציות, אתרים, אפליקציות " +
      "מובייל ותוכנה מותאמת אישית, ולצידם את אסטרטגיית ה-AI שקובעת מה מכל אלה העסק שלכם " +
      "צריך, ומה לא.",
    /* SOURCED ×8, VERBATIM — the eight H2s of pages/services.html, in the order that page
       lists them (`services.headings[1..8]`). These are the company's own product names, so
       none of them may be paraphrased to fit a box.
       ⚠️ THE FIT WAS THE OPEN RISK ON THIS ROUTE AND IT CLEARS. Three of the eight are longer
       in Hebrew than in English by character count (`Integrations` → `אינטגרציות ואוטומציות`),
       which is the opposite of the contract's §9 expectation, and the tiles were fitted to
       exactly one rendered line at every tier. Measured, all eight still set on ONE line
       everywhere, with room: the widest Hebrew label is `אינטגרציות ואוטומציות` at 168px in
       the 308px desktop tile and 134px in the 224px tablet tile, against English's widest
       (`WhatsApp Automation`) at 181px / 145px. So the Hebrew grid is in fact SLACKER than the
       English one and no box was widened. Chrome agrees on all eight in both locales: every
       label's box is 22.00px at 1600/1440 and 17.59px at 1024/390, i.e. exactly one line, and
       the whole band is pixel-identical to English at every tier (793.03 / 793.03 / 672.39 /
       1747.59, the last differing only by the intro above it).
       ⚠️ The eight benefit kickers the real site pairs with these names
       (`להאיץ מכירות ותמיכה`, `למכור איפה שהלקוח נמצא`, …) are deliberately NOT here: this
       band's tiles render a label and nothing else, English included, so adding them would mean
       adding English copy to a route whose English render must not move. Reported instead. */
    items: [
      "סוכני AI",
      "אוטומציות WhatsApp",
      "הטמעת CRM",
      "אינטגרציות ואוטומציות",
      "בניית אתרים",
      "פיתוח מובייל",
      "תוכנה מותאמת אישית",
      "אסטרטגיית AI וייעוץ",
    ],
  },

  tools: {
    /* AUTHORED, both runs — the original band held venture-fund logos and the real site has no
       equivalent heading. Two runs as in English, each on ONE line at every tier. The second
       run is the tight one: 462px in the 490px column at 1600/1440 and 336px in the 358px
       column at 390, which is why it was read in Chrome rather than trusted from the static
       number. It holds: the h2 measures 96.81 / 96.81 / 88 / 70.41, identical to English, so
       each run sets one line at every tier. `שהצוות שלכם כבר מכיר` (270px at 390) is the
       fallback if the face is ever swapped and this starts to wrap. */
    heading: ["בנוי על הכלים", "שהצוות שלכם כבר עובד איתם"],
  },

  careers: {
    /* AUTHORED, both runs — THE COLOUR BOUNDARY. Run 1 is `ink`, run 2 is the `muted` span, so
       the break must fall exactly here and neither run may wrap on its own. Measured 317 / 317
       / 288 / 231px and 222 / 222 / 202 / 161px against a 490 / 490 / 944 / 358px column: one
       line each at every tier, so the measured h3 box (96.8 / 88 / 70.4, two lines) holds.
       `ועוד צוות שלם` from `about.bodyText` was considered for run 1 and rejected: on the real
       site it labels the unnamed remainder of a roster shown directly above it, and `ועוד`
       has nothing to continue from on this band. */
    titleInk: "הצטרפו לצוות שבונה",
    titleMuted: "את הדבר הבא",
    /* AUTHORED, built on a SOURCED clause — `about.bodyText`'s
       `מפתחים, מהנדסים ואנשי מקצוע מוכשרים שמאחורי כל מערכת.` This is the box wide enough to
       carry that clause whole, which is why `mission.teamItems[2]` gives up its compressed
       form to it rather than the other way round. Sets 2 / 2 / 1 / 3 lines — the SAME count as
       English, measured 46.81 / 46.81 / 20.80 / 62.39, so the target's 46.8 / 20.8 / 62.4 are
       reproduced to the pixel and this whole band is identical in both locales
       (912.81 / 912.81 / 944.80 / 672.80). */
    body:
      "אנחנו מחפשים מפתחים, מהנדסים ואנשי מקצוע מוכשרים שרוצים לבנות מערכות שעסקים " +
      "אמיתיים סומכים עליהן. אם זה אתם, בואו נדבר.",
    /* AUTHORED — the real site has no careers page, so no label to lift. 51.6px against
       English's 81.9px: `whitespace-pre` inside a `min-w-[124px]` anchor cannot wrap, and this
       is 30px shorter than the string the 124px was measured against, so the button holds its
       measured width and nothing overflows. */
    ctaLabel: "למשרות",
    /* AUTHORED — describes a stock photograph (CompanyCareers.tsx:44-56), and like the English
       it claims nothing about who the people in it are. */
    photoAlt:
      "שלושה עובדים במשרד, שניים יושבים מול מסך רחב שמוצג בו קוד ושלישי כותב על מסך התלוי על הקיר.",
  },
};
