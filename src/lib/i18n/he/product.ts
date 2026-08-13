/**
 * Hebrew copy for /product. OWNED BY ONE AGENT.
 *
 * PROVENANCE IS MANDATORY. Every string below is marked in the comment beside it as either:
 *   · SOURCED  — lifted from docs/reference/clixsolutions/ (the capture of the real company
 *                site, which is `lang="he" dir="rtl"` and has no English version). The path is
 *                given: `home.headings[1]`, `services.bodyText`, `pages/services.html`, …
 *   · AUTHORED — written in that captured voice because no counterpart exists. These are the
 *                ONLY strings the user has to review, which is the whole point of marking.
 *
 * ⚠️ H1s ARE RECOVERED FROM pages/*.html, NEVER FROM content.json. Its extractor walked
 * per-word spans and concatenated without separators, so every H1 in that file has lost its
 * spaces ("אנחנובוניםאתהמנגנוניםהשקטים…"). `hero.headline` below is the services H1 read out of
 * pages/services.html with tags stripped and whitespace collapsed. H2/H3 and bodyText are fine.
 *
 * ⚠️ TYPED AGAINST THE ENGLISH SHAPE, so a missing key, an extra key, or a wrong TUPLE LENGTH
 * is a build failure rather than an English word on a Hebrew page. `workflows.pillWidths` is
 * the one place a NUMBER legitimately differs between locales; see en/product.ts on why the
 * English file declares an interface instead of using `as const`.
 *
 * ⚠️ THE NO-DASHES RULE HAS ONE CARVE-OUT: the Hebrew prefix hyphen stays, because `בWhatsApp`
 * is misspelled. The real site writes `ב-WhatsApp`, `ה-AI`, `רב-לשוני`. Orthography, not style.
 * It appears here in `ב-WhatsApp`, `ל-CRM`, `ב-CRM`, `מ-WhatsApp`, `ל-clix`. There is no em
 * dash anywhere in this file, matching the real site's own prose.
 *
 * ⚠️ GERESH AND GERSHAYIM, not ASCII quotes: `צ׳אט` uses ׳ (U+05F3), as the capture does.
 *
 * ── WHAT HEBREW DOES TO THIS ROUTE'S BOXES, measured (Discovery advances, fontTools) ────────
 *
 * Everything holds except one heading, and it holds in the direction §9 of the contract did not
 * predict:
 *
 *   · `hero.headline` sets 4 / 2 / 2 lines at 390 / 1024 / 1440 against English's 2 / 1 / 1.
 *     The hero band grows ~96px on a phone and ~64px at desktop. RECORDED, NOT TUNED AWAY: it
 *     is the real site's own services H1 and trimming it to fit a box measured against a
 *     28-character English line would make the measured spec a fiction. The report carries a
 *     one-line alternative (the industries H1, which lands exactly 2 / 1 / 1) if the user
 *     prefers the band height to the sentence.
 *   · `stepper.title` sets 2 / 1 / 2 — EXACTLY English's counts, which the file's own comment
 *     records as the invariant that matters.
 *   · every other length-sensitive string sets the same number of lines as English or FEWER.
 *     `panels.sources` peaks at 128px against English's 169 in a 176px measure;
 *     `benefits.cards[*].body` peaks at 3 lines in the fixed 84px well against English's 4;
 *     `dataPartners.intro` runs 4 / 2 / 3 against 5 / 3 / 3.
 *   · `panels.citations.prose` is the one string that had to be made LONGER. See its note.
 */

import type { Translated } from "../shape";
import type { ProductDict } from "../en/product";

export const product: Translated<ProductDict> = {
  hero: {
    /* SOURCED — pages/services.html H1, tags stripped and whitespace collapsed. The real
       site's services page is the counterpart of this route, and this is its headline.
       ⚠️ 4 / 2 / 2 lines against English's 2 / 1 / 1. Documented divergence; see the header. */
    headline: "אנחנו בונים את המנגנונים השקטים שמניעים עסקים מודרניים.",
    /* SOURCED verbatim — the closing CTA band's lead line, identical on home.bodyText,
       services.bodyText, industries.bodyText and playground.bodyText. It names the same four
       capability families the English subhead does, in the site's own words. 2 / 2 / 2 lines,
       the same as English. */
    subhead:
      "סוכני AI, אוטומציות WhatsApp, מערכות CRM, אינטגרציות ותוכנה מותאמת אישית נבנים כדי לצמוח יחד איתכם.",
    /* SOURCED — the CTA on every page of the real site (about.links[9].text). Measured at
       65.9px against English's 66.2px, so the 220px button does not move. */
    cta: "בואו נתחיל",
    /*
     * AUTHORED ×4 — things an owner types into a prompt field. No counterpart exists: the real
     * site has no typed-prompt block. Vocabulary is the capture's own: `ליד`, `ניתוב`,
     * `מעקב` and `ב-WhatsApp` all come from industries.bodyText and services.bodyText, and
     * the imperative-plural register is the site's (`בנו`, `גררו`, `שאלו`, `קבעו`).
     *
     * ⚠️ SECOND-PERSON SINGULAR IMPERATIVE HERE, DELIBERATELY, against the site's plural
     * elsewhere. These are not the site addressing the reader; they are the reader addressing
     * the system, and Hebrew talks to a machine in the singular.
     *
     * FITTED BY RENDERED WIDTH: 201 / 225 / 199 / 219px at 15px, against English's
     * 230 / 307 / 274 / 227 in a 320px field. All four set ONE line at every tier, so the
     * fixed `h-11` (two lines of room) is not stressed in either locale.
     *
     * ⚠️ THESE LENGTHS DRIVE THE ANIMATION. The typing loop is per character, so a shorter set
     * types faster at a fixed rate. ProductHero.tsx derives its rate from this array's mean
     * length to hold the phrase DURATION instead: 38.5ms/char here against English's 30, which
     * puts the four phrases at 1155 / 1309 / 1155 / 1271ms against 1110 / 1440 / 1320 / 1020.
     */
    prompts: [
      "עשה מעקב אחרי כל ליד מיום שישי",
      "נתב כל פנייה ב-WhatsApp לאדם הנכון",
      "הפוך כל שיחת מכירה לסיכום כתוב",
      "שלח חשבוניות ותרדוף אחריהן במקומי",
    ],
    a11y: {
      /* AUTHORED ×2 — screen-reader labels; no counterpart in the capture. */
      attach: "צירוף קבצים",
      submit: "שליחה",
    },
  },

  intro: {
    /* AUTHORED ×2. The English is a single sentence whose colour changes mid-clause, and the
       Hebrew keeps that shape: one thought, one break, the payoff in `ink`.
       Deliberately NOT reusing `המנגנונים השקטים` from the hero H1 a few hundred px above —
       the English does not repeat itself there either.
       ⚠️ `ink` KEEPS ITS LEADING SPACE. It is the word gap across the colour boundary, and
       there is no `<br>` here: the two runs flow as one balanced sentence, so unlike the
       `benefits` and `security` headings below, either fragment MAY wrap internally. */
    muted: "כל עסק רץ על מאה העברות שאף אחד לא אחראי עליהן,",
    ink: " clix בונה את המערכות שמייתרות אותן.",
  },

  stepper: {
    /* SOURCED verbatim — home.headings[1], the H2 over the real site's own tool-stack section,
       which is the same twelve tools this route's Block 3 lists. It is the exact thought the
       English title is reaching for.
       ⚠️ Sets 2 / 1 / 2 lines at 390 / 1024 / 1440, which is EXACTLY the capture's and the
       English's count. Re-measure, do not re-count, if this ever changes. */
    title: "כל הכלים שאתם משתמשים בהם מזינים מוח אחד.",
    /* AUTHORED ×4. Each must be ONE line in BOTH layouts — a 60px row in the 472px column at
       ≥1200 (396px of label measure) and a 36px header row when stacked (306px at 390).
       Measured: 168 / 176 / 178 / 184px against English's 166 / 176 / 146 / 190. All one line. */
    steps: [
      "כל המערכות שלכם במקום אחד",
      "כל תשובה מציגה את המקור שלה",
      "אוטומציה לתהליכי העבודה שלכם",
      "לשאול שאלות על המסמכים שלכם",
    ],
  },

  panels: {
    /* AUTHORED ×7 — the seven places a clix system reads from. Each was chosen for the glyph
       already in its slot (globe for web forms, link for the connected CRM, table for
       spreadsheets, folder for the calendar store), so the order is fixed by the icons.
       `שיחות`, `טפסים`, `רשומות`, `יומנים` are the capture's own nouns.
       ⚠️ TRUNCATION IS THE RISK, not wrapping: `truncate` at an 88-unit label inset leaves
       176px at the phone tier. Measured longest 128px (`יומנים וסיכומי פגישות`) against
       English's 169px. Zero clipping in either locale, with more headroom in Hebrew. */
    sources: [
      "שיחות ב-WhatsApp",
      "טפסים באתר",
      "רשומות ב-CRM",
      "שרשורי אימייל",
      "גיליונות ודוחות",
      "יומנים וסיכומי פגישות",
      "חשבוניות וקבלות",
    ],
    citations: {
      /*
       * AUTHORED. A generic order/invoice/CRM scenario, as the English is: no real company is
       * named and no figure is presented as fact, because this is mock UI.
       *
       * ⚠️ THE ONE HEBREW STRING ON THIS ROUTE THAT HAD TO BE MADE *LONGER*. A first draft
       * translated the English closely and set FOUR lines at the 470px desktop measure against
       * English's five. Four is not a smaller version of the same panel — it is a broken one:
       * the floating source card is positioned at `top:24%` of this paragraph's own height, so
       * at four lines its bottom edge lands past the last line and covers the very date it
       * cites. One extra clause (the accounts-contact request) takes it to five lines at 470 and
       * eight at the 264px phone measure, so the highlight clears the card at both.
       * MEASURED, NOT ESTIMATED. Lengthen freely if it is ever reworded; do not trim.
       */
      prose:
        "ההזמנה אושרה בשרשור ב-WhatsApp ותואמת את החשבונית שהופקה באותו שבוע, כך שהחשבון מוסדר ואין עליו יתרה פתוחה. הלקוח ביקש להזיז את המשלוח הבא, רוצה את התאריך החדש בכתב, וביקש שהעדכון יישלח גם לאיש הקשר שלו בהנהלת החשבונות. לפי רשומת ההזמנה ב-CRM, תאריך האספקה המוסכם הוא",
      /* AUTHORED — a date in prose is prose, so it translates. Hebrew month names take the `ב`
         prefix ("14 באפריל"), which is why this is not just a reordering of the English. */
      date: "14 באפריל",
      /* Machine tokens, Latin in every locale by the keep-Latin rule: a record id, a system
         abbreviation, a quarter label and a citation numeral. Carried through unchanged, and
         listed rather than omitted so it is visible that they were considered. */
      recordId: "4182",
      system: "CRM",
      period: "Q2 2026",
      marker: "2",
    },
    documents: {
      /* AUTHORED — imperative plural, the site's own register for an instruction to the
         reader (`גררו`, `בנו`, `קבעו`). */
      prompt: "בדקו את החשבונית המצורפת",
      /* SOURCED verbatim — the chat widget's own label in the footer of every captured page. */
      cta: "שאלו את Clix",
      /* AUTHORED, in the capture's voice: playground.bodyText says `גררו אל הקנבס` and
         describes the interaction as `גרירה ושחרור`. */
      dropzone: "גררו ושחררו כדי לצרף תוכן",
      /* AUTHORED. */
      chip: "קבצי לקוח",
    },
  },

  workflows: {
    /* SOURCED verbatim — services.bodyText, the H2 of service 04 `אינטגרציות ואוטומציות`,
       which is exactly this block's subject. Sets 2 / 1 / 2 lines, the same as English. */
    title: "כל הכלים שלכם מדברים זה עם זה.",
    cards: [
      {
        /* AUTHORED. `לפי מידה` is the Hebrew idiom for bespoke, which is what "Built To Fit"
           says. Measured 288px at 28px — one line at the 358px phone measure, as English is.
           A closer literal draft (`אוטומציות שנבנות לפי התהליך שלכם`, 386px) wrapped to two. */
        title: "אוטומציות שנבנות לפי מידה",
        /* AUTHORED, adapted from services.bodyText service 04, which already carries these
           exact nouns: `תכנון תהליכי עבודה מקצה לקצה`, `Webhooks ו-middleware מותאמים אישית`,
           `ניטור, ניסיונות חוזרים וטיפול בשגיאות`. */
        body:
          "אנחנו ממפים את התהליך שהצוות שלכם כבר מריץ, ואז מבצעים לו אוטומציה מקצה לקצה על " +
          "הכלים שכבר יש לכם. Webhooks, middleware וטיפול בשגיאות מגיעים איתו, כך ששלב שנשבר " +
          "במעלה הזרם נתפס ומנוסה שוב, ולא נעלם בשקט.",
      },
      {
        /* AUTHORED. */
        title: "לשאול את הנתונים שלכם",
        /* AUTHORED, adapted from services.bodyText service 03 (`תמונת לקוח אחת ואמיתית במקום
           אחד`, `די לגיליונות שמתחזים למערכות`). */
        body:
          "ה-CRM שלכם, הגיליונות שלכם והחיוב שלכם בטבלה אחת שאפשר למיין, לסנן ולעדכן תוך כדי " +
          "היום. שאלו אותה שאלה בשפה פשוטה וקבלו תשובה שאפשר להחזיר עד לרשומה עצמה.",
      },
      {
        /* AUTHORED. */
        title: "דוחות לפי דרישה",
        /* AUTHORED. */
        body:
          "מצגות, סיכומים וגיליונות שנבנים מאותם נתונים שהצוות שלכם עובד בהם. המספרים נשארים " +
          "עקביים, התבנית נשארת שלכם, וקובץ המקור נשלח לצד כל ייצוא.",
      },
    ],
    /*
     * AUTHORED ×10 — the saved-workflow shelf, shared by the ticker and the pill stack.
     * Vocabulary is the capture's: `ליד`/`לידים`, `ניתוב`, `מעקב`, `חשבוניות`, `תמיכה`,
     * `דוחות`, `חידוש`, `מסמכים` all appear in services.bodyText or industries.bodyText.
     *
     * ⚠️ FITTED TWICE OVER, and the second fit is the interesting one:
     *   1. as ticker cards — 162px measure at 14px, two lines of room. All ten set ONE line,
     *      as all ten English labels do.
     *   2. as pill labels — see `pillWidths` below. The RAG matters more than the widths: the
     *      nine must stay visibly unequal or the stack reads as a solid block. Two labels were
     *      lengthened for exactly that reason (`קליטת לידים וניתוב אוטומטי` rather than
     *      `קליטת לידים וניתוב`, `סיכום ותיוג של שיחות מכירה` rather than `סיכום ותיוג שיחות`),
     *      which took the spread from 47.4 to 62.1 source units against English's 60.
     */
    labels: [
      "קליטת לידים וניתוב אוטומטי",
      "קביעת פגישות",
      "מעקב הצעות מחיר",
      "התאמת חשבוניות",
      "סיכום ותיוג של שיחות מכירה",
      "קליטת לקוחות חדשים",
      "מיון תמיכה ב-WhatsApp",
      "דוח תפעול שבועי",
      "תזכורות חידוש",
      "איסוף מסמכים",
    ],
    /*
     * COMPUTED, NOT AUTHORED — `w = 30 + advance + 14.6` per label, evaluated on the nine above.
     *
     * The two insets are geometry already in benefitArt.tsx (icon at x=10 w=14, label at x=30,
     * so 30 leading and 44.6 − 30 = 14.6 trailing), and `advance` is the label's rendered width
     * divided by the tier's `--prompt-u`. That quotient is tier-invariant by construction:
     * `fontSize` is `u(12)`, so advance = em × 12 at 0.6786, 1.0357 and 0.8643 alike. Verified
     * numerically at all three.
     *
     * ACCEPTANCE IS THE TWO FAILURE MODES THE SOURCE FILE NAMES, not a tolerance:
     *   1. the label must not run past the pill — satisfied by construction, every label ends
     *      14.6 units inside its pill's edge.
     *   2. the ragged right edge must survive — spread (max − min) is 62.1 units here against
     *      the English set's 60, i.e. +3.5%. The nine are all distinct; the widest is 172.5,
     *      well inside the 255 a pill at x=25 has in the 280-unit stage.
     *
     * ⚠️ A FINDING ABOUT THE ENGLISH NUMBERS, WHICH ARE LEFT ALONE: they are a least-squares
     * fit on HELVETICA advances, and this site renders Discovery, which is narrower. Evaluating
     * the same geometry on the real face gives 164 / 154 / 126 / 152 / 177 / 154 / 172 / 140 /
     * 144, so every English pill carries 13 to 24 units of trailing dead space. Not fixed here
     * — the English render must not move — but reported.
     */
    pillWidths: [169.5, 110.4, 130.2, 125.9, 172.5, 144.3, 157.8, 122.6, 111.6],
    /* AUTHORED — `sr-only`, so it costs no geometry. */
    srShortcuts: "קיצורי דרך לתהליכים שמורים: {list}.",
  },

  mocks: {
    /*
     * MIRRORING POLICY FOR THE THREE MOCKS, grounded in the user's own Hebrew site rather than
     * in principle. Evidence, all from docs/reference/clixsolutions/:
     *   · the /services mock UI is overwhelmingly ENGLISH (`Sales SDR`, `Drafting reply`,
     *     `Track Shipment`, `new-lead.workflow`), so translating chrome here is a choice, not
     *     an obligation — the user made it.
     *   · the home dashboard mock is Hebrew chrome with LATIN tokens: `p50`, `842ms`, `+18%`,
     *     `99.9`, `Webhook`, `HTTP`.
     *   · /playground is a genuinely RTL page whose node graph runs LEFT TO RIGHT: its own tip
     *     reads `גררו מהנקודה הימנית של צומת אחד לנקודה השמאלית של צומת אחר`, i.e. output on
     *     the right, input on the left.
     * So: TRANSLATE the chrome, KEEP the machine tokens Latin, MIRROR the page but not the
     * diagram. Filenames and extensions, `CRM`, `%`, numerals and `pptx`/`xlsx` stay Latin and
     * stay in the component; card titles, row labels and status prose come from here.
     */
    workflow: {
      /* AUTHORED, but the phrase is the capture's: services.bodyText's own voice-agent mock
         is captioned `שיחה נכנסת · הכשרת לידים`. Measured 486 source units against a 522-unit
         card measure; English is 502. */
      title: "הכשרת לידים נכנסים ב-WhatsApp",
      /* AUTHORED ×6 — run status and the four steps. `מנקד` for "scoring" is the capture's
         own (`ניקוד לידים` in services.bodyText service 03). Every one is shorter than its
         English counterpart in source units, so none can reach the card edge. */
      running: "מריץ את התהליך...",
      steps: [
        "קורא הודעות חדשות",
        "בודק ב-CRM",
        "מנקד לפי הכללים שלכם",
        "מנסח תשובה",
      ],
      syncing: "מסנכרן ל-CRM...",
    },
    table: {
      /* AUTHORED. 721 source units end-of-line against the 820.6 visible crop; English 791. */
      question: "אילו מקורות לידים באמת סגרו עסקאות?",
      /* AUTHORED. The `4` is a numeral and stays one. */
      checked: "נבדקו 4 מערכות",
      /*
       * AUTHORED ×2, and the LENGTH IS PART OF THE COMPOSITION. Mock 2 is the one crop that is
       * left-aligned, so its prose is meant to run out of frame; the source file's comment says
       * the second line "has to reach past the crop exactly as it does there".
       * Measured, ending at source x 946 and 925 against the 820.6 window — both still run
       * past, as English's 995 and 888 do. Do not shorten these to "fit".
       */
      answer: [
        "לידים מ-WhatsApp סגרו את מרב העסקאות ברבעון האחרון,",
        "וחיפוש ממומן הביא את המעט ביותר ובעלות הגבוהה ביותר.",
      ],
      /* AUTHORED ×2. `פייפליין` is the capture's own transliteration (services.bodyText,
         `הקמת פייפליין מכירות`; home.bodyText, `פייפליין לידים · 7 ימים`), so it is the right
         word here rather than a Hebrew coinage. The leading `%` is a symbol and stays.
         ⚠️ The column header's measure is genuinely tight — the table box is 700 units wide
         with `overflow-hidden` and this label starts at x=426, leaving 274. Hebrew is 269.2.
         ENGLISH IS 295.5 AND IS THEREFORE CLIPPED BY ~21 UNITS TODAY. Pre-existing; reported,
         not fixed, because fixing it would move the English render. */
      colChannel: "ערוץ",
      colClosed: "% מהפייפליין שנסגר",
      /* AUTHORED ×3 — acquisition channels, not company names, exactly as the English is. */
      rows: ["לידים מ-WhatsApp", "אירועים", "חיפוש ממומן"],
    },
    material: {
      /* AUTHORED. */
      assembling: "מרכיב את המצגת...",
      /* AUTHORED ×3 — three explicit lines at measured y 75.5 / 123.5 / 171.5. The break
         positions are the reference's, so this is three strings and not one paragraph.
         Measured 418 / 361 / 447 source units against a 610-unit measure. */
      prose: [
        "הנה המצגת שלכם. בניתי אותה",
        "על התבנית שלכם, וצירפתי",
        "את מקורות הנתונים לכל שקופית.",
      ],
      /* AUTHORED. The `(2)` is a numeral. */
      exportsLabel: "ייצוא (2)",
      /* AUTHORED ×2 — the STEM translates, the extension does not: `.pptx` and `.xlsx` are
         keyed to the P and X badges rendered beside them. Measured 333 / 309 source units
         against the 454 a label has before the download glyph at x=548. */
      exports: ["הטמעת אוטומציות.pptx", "גיבוי הרצות תהליך.xlsx"],
    },
  },

  dataPartners: {
    /* SOURCED verbatim — home.bodyText's section eyebrow `02 · הסטאק`, over the very same
       twelve-tool wall this block renders. The eyebrow is the real site's name for this block,
       so it is the title here. */
    title: "הסטאק",
    /* AUTHORED. `צ׳אט` with a geresh, as services.bodyText writes it (`בתוך הצ׳אט`).
       Sets 4 / 2 / 3 lines against English's 5 / 3 / 3, so the band is never taller. */
    intro:
      "אנחנו בונים על הכלים שהצוות שלכם פותח כבר היום. קול, צ׳אט, מסמכים, גיליונות ויומנים " +
      "מתחברים למערכת אחת, כך שהאוטומציה נוחתת במקום שבו אנשים כבר עובדים, ולא במקום חדש " +
      "שצריך ללמוד.",
  },

  benefits: {
    /* AUTHORED ×2. ⚠️ TWO FRAGMENTS ACROSS A `<br>`, AND THE BREAK IS THE COLOUR BOUNDARY:
       `ink` above, `muted` below. Hebrew breaks at a different word than English, which is
       expected and allowed; what is NOT allowed is either fragment wrapping on its own, since
       that would put half a colour run on a line of its own. Measured at the tightest tier
       (32px in a 358px measure): 282.5px and 241.2px, both one line, as English's 310.8 and
       268.9 are. */
    headingInk: "פלטפורמה אחת שלומדת",
    headingMuted: "איך הצוות שלכם עובד",
    /*
     * ⚠️ EVERY BODY BELOW SITS IN A FIXED 84px WELL PINNED TO `flex-end`, inside a card whose
     * height is `aspect-ratio: 0.788044`. A longer body CLIPS; it does not grow the card. At
     * 14px/130% that is FOUR lines, and the narrowest text column is 326px at the phone tier.
     * Measured per card, at 390 / 1024 / 1440:
     *     3/2/3 · 2/2/2 · 2/1/2 · 3/2/3 · 3/2/3 · 2/1/2
     * against English's 3/3/3 · 3/2/2 · 2/2/2 · 3/2/3 · 4/3/3 · 2/1/2. Nothing clips, and card
     * 5 gains a line of headroom rather than losing one.
     */
    cards: [
      {
        /* SOURCED — services.headings[4] `אינטגרציות ואוטומציות`, shortened to the noun the
           card's own title is. */
        title: "אינטגרציות",
        /* AUTHORED, from services.bodyText service 04's own list. */
        body:
          "חברו את מערכות התשלומים, הנהלת החשבונות, השיווק והתמיכה שאתם מפעילים כבר היום. " +
          "אנחנו מחברים אותן למערך אחד, עם webhooks, middleware וניטור.",
      },
      {
        /* AUTHORED. */
        title: "תהליכים מוכנים",
        /* AUTHORED. */
        body:
          "בחרו מתוך ספרייה של תהליכים בנויים שמכוונים לאוטומציה של העבודה שהצוות שלכם חוזר " +
          "עליה כל שבוע, מקצה לקצה.",
      },
      {
        /* AUTHORED. */
        title: "הטמעה בליווי צמוד",
        /* AUTHORED. ⚠️ THE FACTS ARE clix's OWN, per docs/reference/clixsolutions/README.md:
           Unit 8200 and Technion alumni in Tel Aviv. `יחידה 8200` and `הטכניון` are how they
           are named in Hebrew; the numeral stays a numeral. */
        body:
          "ליווי והטמעה צמודים עם הצוות שלנו בתל אביב, יוצאי יחידה 8200 והטכניון.",
      },
      {
        /* AUTHORED — `מותאמים אישית` is the capture's own phrase for bespoke work
           (`תוכנה מותאמת אישית`, on four pages). */
        title: "מודלים מותאמים אישית",
        /* AUTHORED. `שפת המותג שלכם` is services.bodyText's own wording for tone of voice. */
        body:
          "מודלים שמאומנים על הנתונים שלכם, על שפת המותג שלכם ועל התהליכים שלכם, כך שכל סוכן " +
          "עונה כמו האדם הטוב ביותר אצלכם, ברמה שהגדרתם.",
      },
      {
        /* AUTHORED. */
        title: "ניהול והרשאות",
        /* AUTHORED. `תהליכי אישור עם אדם בלולאה` and `סקירת סיכונים, אבטחה ועמידה ברגולציה`
           from services.bodyText set the register. */
        body:
          "בקרת הרשאות מדויקת, ניהול גישה לפי תפקידים, מסלולי ביקורת מלאים ומדיניות ניהול " +
          "שאתם מגדירים, כך שכל סוכן פועל בתוך הגבולות שקבעתם.",
      },
      {
        /* AUTHORED. `דייר יחיד` is the standard Hebrew rendering of single-tenant; the capture
           uses the plural form `רב-דיירות` in services.bodyText service 07, so this is the
           same vocabulary. */
        title: "פריסה בדייר יחיד",
        /* AUTHORED. */
        body: "הריצו בענן שלנו או בתוך הענן שלכם, בתנאי האבטחה שהעסק שלכם קובע.",
      },
    ],
    governance: {
      /* AUTHORED ×3 + ×5 — labels inside card 5's mock dashboard. `שאילתות` is the
         playground's own noun (`שאילתה / כתיבה`). The stat VALUES (122, 3.1k, +6, +135) and
         the five bar fill lengths are numerals and measured geometry: neither is localised,
         and both stay in the component.
         Measured in source units against the panel: stats 78 and 39 in a 105-unit measure,
         the heading 105 in 272, and the five rows 47 to 59 in 254. All clear. */
      statUsers: "משתמשים פעילים",
      statQueries: "שאילתות",
      topSources: "מקורות הנתונים המובילים",
      sources: ["WhatsApp", "רשומות CRM", "טפסים באתר", "חשבוניות", "ספריית קבצים"],
    },
  },

  security: {
    /* AUTHORED — the same word he/chrome.ts uses for this route's nav slot. */
    eyebrow: "אבטחה",
    /* AUTHORED ×2. ⚠️ TWO FRAGMENTS ACROSS A `<br>` AND THE BREAK IS THE COLOUR BOUNDARY:
       `muted` above, `paper` below. Neither fragment may wrap on its own. The tightest measure
       is the phone tier's 310px at 32px (this heading is inside the dark card's own padding,
       not the section's), and Hebrew sets 177.6px and 178.1px there against English's 217.8px
       and 207.8px. Both one line at all three tiers, as English's two are.
       `מהיסוד` for "by Design": a posture, not an audit claim, which is the whole reason the
       English kept that half verbatim when the other half was rewritten. */
    headingMuted: "נבנה לענן שלכם",
    headingPaper: "מאובטח מהיסוד",
    /* AUTHORED ×4 — practice statements, positional against four glyphs (padlock, cloud,
       shield, `</>`). One line each at every tier in both locales.
       ⚠️ `הצפנה מקצה לקצה` translates the English as written and inherits its flag: strictly,
       end-to-end encryption is a stronger promise than "encrypted in transit and at rest", and
       ProductSecurity.tsx says so. Translated, not corrected — the English is the thing to
       confirm, and correcting it in one locale only would hide the question. */
    list: [
      "אין אימון על הנתונים שלכם",
      "שיטות עבודה מודרניות ומאובטחות",
      "הצפנה מקצה לקצה",
      "נסקר ונבדק",
    ],
    /* AUTHORED ×4. ⚠️ PRACTICE STATEMENTS, NOT CERTIFICATIONS. The cells shipped as
       SOC2 / CCPA / ISO 27001 / GDPR until 2026-08-12 and were replaced because clix holds
       none of the audited ones. The capture DOES contain the string `SOC 2 · GDPR`
       (services.bodyText, inside the AI-strategy mock) and it is deliberately NOT lifted here:
       a seal on a security block is a claim, whatever it is in a mock.
       Measured at 137px: two lines, two lines, one, one — against English's two, one, one, one.
       Two is the ceiling; three would collide with the centred 104px mark. */
    badges: [
      "הענן שלכם, החשבונות שלכם",
      "הנתונים שלכם נשארים שלכם",
      "גישה בהרשאות מינימום",
      "הקוד בבעלותכם",
    ],
    /* AUTHORED. `whitespace-pre`, so it cannot wrap: 79.7px against English's 80.0px, which is
       as close as this pass gets to a free win. The real site's own equivalents
       (`לכל היכולות שלנו`, `לכל העבודות שלנו`) both name a destination this link does not go
       to, so neither is lifted. */
    link: "לפרטים נוספים",
  },

  testimonials: {
    /*
     * ⚠️⚠️ THE QUOTES BELOW ARE PLACEHOLDERS ATTRIBUTED TO REAL, NAMED PEOPLE, EXACTLY AS THE
     * ENGLISH ONES ARE. Read the warning block at the top of ProductTestimonials.tsx. The route
     * stays `robots: { index: false, follow: false }` in BOTH locales until real, approved
     * wording replaces every one of them.
     *
     * THE `[PLACEHOLDER QUOTE, NOT SOMETHING X SAID]` TAG IS KEPT IN ENGLISH, DELIBERATELY, and
     * this is the one place in this file where an English run is the right answer:
     *   · the tag is a warning to whoever ships this, not copy for a reader. English capitals
     *     on a Hebrew page are unmistakable — it cannot be misread as content, which is the
     *     entire function of the device.
     *   · ProductTestimonials.tsx's four-step launch checklist says "replace every string
     *     tagged `[PLACEHOLDER QUOTE ...]`". That is a grep. Translating the tag would take the
     *     Hebrew strings out of it and they would be the ones left behind.
     * The prose after the tag IS Hebrew, and it talks about the client in the THIRD PERSON with
     * no quotation marks, so the grammar breaks the illusion in Hebrew too. NO PRONOUNS: two of
     * the six are people whose pronouns nobody here has been told, and one is a company.
     *
     * NAMES AND ROLES ARE SOURCED — home.bodyText's own testimonial rail names four of these
     * six clients with their roles, using `·` as the separator, which is why the Hebrew roles
     * are not comma-joined the way the English ones are.
     *
     * MEASURED: the phone cards are FIXED-HEIGHT boxes (505px for slot 1, 334px for the rest)
     * with the text pinned above a fixed author block, so a long quote clips. Caps are 12 lines
     * and 8 lines at 20px/1.3em in a 310px measure. Hebrew sets 5 / 5 / 5 / 5 / 6 lines for
     * cards 2 to 6 and 8 for card 1, against English's 5 / 6 / 5 / 5 / 6 and 9.
     */
    slides: [
      {
        /* AUTHORED (placeholder). */
        quote:
          "[PLACEHOLDER QUOTE, NOT SOMETHING ASAF PERETZ SAID] אין ל-clix עדות בכתב מהלקוח " +
          "הזה ואף נוסח לא אושר. הפסקה הזאת היא פיגום פריסה, באורך שהציטוט האמיתי צפוי " +
          "לתפוס, והיא נמצאת כאן כדי להימחק ברגע שמשפט מאושר יחליף אותה.",
        /* SOURCED ×2 — home.bodyText, the testimonial rail: `אסף פרץ` / `מייסד · SalesIQ`. */
        name: "אסף פרץ",
        role: "מייסד · SalesIQ",
      },
      {
        /* AUTHORED (placeholder). */
        quote:
          "[PLACEHOLDER QUOTE, NOT SOMETHING ADIR PERETZ SAID] אין נוסח מאושר ללקוח הזה. " +
          "הטקסט הממלא הזה רץ בקירוב לאורך שהנוסח האמיתי אמור לתפוס.",
        /* SOURCED ×2 — home.bodyText: `אדיר פרץ` / `בעלים · סטודיו וידאו וצילום`. */
        name: "אדיר פרץ",
        role: "בעלים · סטודיו וידאו וצילום",
      },
      {
        /* AUTHORED (placeholder). */
        quote:
          "[PLACEHOLDER QUOTE, NOT SOMETHING NEVO YAHALOMAN SAID] שום דבר בכרטיס הזה לא נאמר " +
          "על ידי הלקוח הזה. המילים הן פיגום פריסה ויש להחליף אותן לפני ההשקה.",
        /* SOURCED ×2 — home.bodyText: `נבו יהלומן` / `מייסד`. */
        name: "נבו יהלומן",
        role: "מייסד",
      },
      {
        /* AUTHORED (placeholder). */
        quote:
          "[PLACEHOLDER QUOTE, NOT SOMETHING NOAM TOVI SAID] טקסט ממלא מקום במקום משפט שהלקוח " +
          "הזה מעולם לא התבקש לתת. להחליף לפני ההשקה.",
        /* SOURCED ×2 — home.bodyText: `נועם תובי` / `בעלים · השקעות`.
           ⚠️ THE PHOTOGRAPH MAY NOT BE THIS PERSON, and that is unresolved in BOTH locales: the
           video's own burned-in caption reads `אני נווה דוידי`. See the note in
           ProductTestimonials.tsx. The Hebrew name here is the repo's label, not a resolution
           of that conflict. */
        name: "נועם תובי",
        role: "בעלים · השקעות",
      },
      {
        /* AUTHORED (placeholder). */
        quote:
          "[PLACEHOLDER QUOTE, NOT SOMETHING ACHITUV SAID] טקסט ממלא מקום במקום משפט שהלקוח " +
          "הזה מעולם לא התבקש לתת. להחליף לפני ההשקה.",
        /* ⚠️ AUTHORED TRANSLITERATION, AND BOTH HALVES ARE UNVERIFIED. This client is NOT in
           the capture's testimonial rail, and sections/Testimonials.tsx already flags the ROLE
           as read off an uploaded filename rather than given. `אחיטוב` is the standard Hebrew
           spelling of the given name and is safe; `ותחזנה` is a plausible reading of
           "Vtechezena" and nothing here can confirm it. GET BOTH FROM THE CLIENT before this
           route is indexed — it is on the same list as the placeholder quotes. */
        name: "אחיטוב",
        role: "ותחזנה",
      },
      {
        /* AUTHORED (placeholder). */
        quote:
          "[PLACEHOLDER QUOTE, NOT SOMETHING ELYASHIV ENGINEERING SAID] טקסט ממלא מקום במקום " +
          "משפט שהלקוח הזה מעולם לא התבקש לתת. להחליף לפני ההשקה.",
        /* ✅ NOT A TRANSLITERATION AND NOT UNVERIFIED — corrected at reconciliation.
           This string is the USER'S OWN, supplied 2026-08-08, and the English "Elyashiv
           Engineering" is a rendering OF it rather than the other way round. See
           sections/Testimonials.tsx:62-68: the clip arrived as an unlabelled WhatsApp video with
           no burned-in caption, no name card and container metadata holding only
           `language=und`, and the user gave the attribution as אלישיב הנדסה
           (הנדסה is the word *engineering*). So on /he the user's original ships and
           there is nothing to confirm. A THIRD provenance kind: user-supplied, neither
           capture-sourced nor authored here. `אחיטוב`/`ותחזנה` above is genuinely
           unverified and does still need the client. */
        name: "אלישיב הנדסה",
        role: "",
      },
    ],
    /* AUTHORED (placeholder). Slot 1's own phone string — the original ships different copy at
       ≤809 and the placeholders keep that quirk structurally so it survives the real wording. */
    phoneLeadQuote:
      "[PLACEHOLDER QUOTE, NOT SOMETHING ASAF PERETZ SAID] זה הטקסט הנפרד של כרטיס הטלפון, " +
      "שנשמר בנפרד כי המקור מגיש כאן נוסח אחר ברוחב הזה. זו לא גרסה מקוצרת של השקופית " +
      "שלמעלה, וגם לא הנוסח של הלקוח הזה. יש להחליף את שניהם לפני שהנתיב הזה מאונדקס.",
    a11y: {
      /* AUTHORED ×2. The arrows' own labels are NOT here — they come from `chrome.a11y.previous`
         and `chrome.a11y.next`, which the spine already ships in both locales. */
      controls: "פקדי ניווט במצגת",
      /* The comma-space glue is identical in Hebrew, but it is a template rather than a
         hard-coded `${name}, ${role}` in the component so the punctuation is a translator's
         decision and not a developer's. */
      portraitAlt: "{name}, {role}",
    },
  },
};
