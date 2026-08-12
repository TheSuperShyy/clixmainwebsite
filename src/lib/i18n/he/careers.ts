/**
 * Hebrew copy for /careers. OWNED BY ONE AGENT.
 *
 * PROVENANCE IS MANDATORY. Mark every string in a comment beside it as either:
 *   · SOURCED  — lifted from docs/reference/clixsolutions/ (the capture of the real company
 *                site, which is `lang="he" dir="rtl"` and has no English version). Give the
 *                path: `home.headings[1]`, `services.bodyText`, `pages/about.html`, …
 *   · AUTHORED — written in that captured voice because no counterpart exists. These are the
 *                ONLY strings the user has to review, which is the whole point of marking.
 *
 * MOST OF THIS ROUTE IS A RESTORATION, NOT A TRANSLATION. The English copy on /careers is not
 * the clone target's — it was rewritten on 2026-08-12 out of `ClixManifesto.tsx` and this very
 * capture (CareersHero.tsx and CareersAbout.tsx both say so in their headers). So the Hebrew
 * below is largely the wording the English was rendered OUT OF, put back.
 *
 * ⚠️ NEVER LIFT AN H1 FROM content.json. Its extractor walked per-word spans and concatenated
 * without separators, so every H1 in that file has lost its spaces
 * ("מערכותAIמהונדסותלעסקשלכם."). H2/H3 and bodyText are fine. Recover H1s from
 * docs/reference/clixsolutions/pages/*.html — strip tags, collapse whitespace. Done here for
 * `hero.headline`: `pages/services.html`'s `<h1>` is eight `<span class="inline-block">`s of
 * exactly one word each, so replacing tags with a single space reconstructs it EXACTLY, with no
 * risk of a spurious space inside a word. content.json's copy of the same H1 reads
 * "אנחנובוניםאתהמנגנוניםהשקטיםשמניעיםעסקיםמודרניים." and was not used.
 *
 * ⚠️ TYPED AGAINST THE ENGLISH SHAPE, so a missing key, an extra key, or a wrong TUPLE LENGTH
 * is a build failure rather than an English word on a Hebrew page.
 *
 * ⚠️ THE NO-DASHES RULE HAS ONE CARVE-OUT: the Hebrew prefix hyphen stays, because `בWhatsApp`
 * is misspelled. The real site writes `ב-WhatsApp`, `ה-AI`, `רב-לשוני`. Orthography, not style.
 * Two of those appear below (`ב-WhatsApp`, `ב-clix`). There is no em dash and no en dash
 * anywhere in this file.
 *
 * ─── THE ONE EDITORIAL COLLISION, AND HOW IT WAS RESOLVED ─────────────────────────────────
 * `pages/services.html`'s H1 is the source of BOTH English strings that mention what clix
 * builds: it is the hero headline's Hebrew counterpart, and it is also the literal source of
 * `about.body[0]`'s opening clause ("Clix builds the quiet mechanisms that run modern
 * businesses"). Restoring both from the same sentence would print it twice inside one screen,
 * which English does not do. So the H1 goes to the hero, where the handout places it, and
 * `about.body[0]`'s lead-in is instead restored from `pages/home.html`'s H1 — a different
 * sentence about the same thing, and just as sourced. Recorded because it is a divergence in
 * the mapping, not in the meaning.
 *
 * ─── WHAT HEBREW DOES TO THIS PAGE'S GEOMETRY ─────────────────────────────────────────────
 * Measured on the production build over CDP at 1600 / 1440 / 1024 / 390, never predicted, and
 * never counted off the strings. Hebrew runs SHORT here, as §9 of the wave contract expects:
 *   `#hero`   529 / 529 / 415 / 582   against English's 529 / 529 / 415 / 643
 *   `#about`  329 / 329 / 322 / 409   against English's 329 / 329 / 343 / 430
 *   `#gallery` 636 at every tier in both locales — it is a fixed-height band.
 * Every difference is a whole number of text lines and nothing else; the arithmetic is in
 * CareersHero.tsx and CareersAbout.tsx beside the values. No horizontal overflow at any tier.
 * ⚠️ Where a number DID stay the same, that is a coincidence of line count, not evidence of
 * fidelity — the trap the 529px note in CareersHero.tsx exists to warn about.
 *
 * ⚠️ AND ONE DEFECT SIMPLY DOES NOT EXIST HERE. CareersHero.tsx records an open question: the
 * English headline BREAKS MID-HYPHEN at 1440 and 390 ("next-" / "generation") and there is no
 * clean fix at the phone tier. Hebrew has no hyphenated compound in this sentence — no hyphen
 * at all — so the break cannot occur. That open question is closed for this locale rather than
 * carried into it.
 */

import type { Translated } from "../shape";
import type { CareersDict } from "../en/careers";

export const careers: Translated<CareersDict> = {
  hero: {
    /* SOURCED verbatim — pages/services.html `<h1>`, reconstructed from its eight one-word
       spans. The accent-italic run in the original is "המנגנונים השקטים", i.e. the site's own
       emphasis falls on "the quiet mechanisms" — which is exactly the phrase the English page
       borrowed for CareersAbout's first paragraph.
       ⚠️ THE ENGLISH 44-CHARACTER CEILING DOES NOT APPLY AND WAS NOT APPLIED. That number is a
       LATIN advance-width proxy, probed through `Range.getClientRects()` over eight Latin
       candidates; it says nothing about a Hebrew string, whose letters average 1.117x Latin
       lowercase and which has no capitals. The real constraint is the rendered LINE COUNT in
       the 960px title box (360px on phone), and it was measured, not counted. */
    headline: "אנחנו בונים את המנגנונים השקטים שמניעים עסקים מודרניים.",
  },

  about: {
    /* AUTHORED, both runs. The English pair is a gerund headline with no counterpart on the
       real site; its nearest sourced relative is services 04's "כל העבודה ה״משעממת״ שמצטברת"
       ("all the boring work that piles up"), which is the idea but not a heading.
       ⚠️ ONE ELEMENT, TWO KEYS, AND THE COLOUR BOUNDARY IS THE `<br>` BETWEEN THEM. The split
       is after the WHOLE first line. Each run must stand as its own clause so that neither can
       wrap alone and split a phrase across the ink/muted change — these two do: "automation for
       all the work" / "that nobody should be doing". */
    titleInk: "אוטומציה לכל העבודה",
    titleMuted: "שאף אחד לא אמור לעשות.",
    body: [
      /* SOURCED, clause by clause, from the pages the English was written out of:
         · "מערכות AI מהונדסות לעסק שלכם"      pages/home.html `<h1>` (see the collision note
                                               in this file's header for why the lead-in comes
                                               from home rather than from services)
         · "סוכני AI"                          services.headings[1]
         · "בשפה של הלקוחות שלכם"              services.bodyText 01, "בשפת המותג שלכם"
         · "עוזרים חכמים ב-WhatsApp"           services.bodyText 02, verbatim
         · "בערוץ שבו הלקוחות כבר נמצאים"      services.bodyText 02 headline, "הערוץ שבו
                                               הלקוחות שלכם כבר נמצאים." — which is also the
                                               source of the English's "where people already are"
         · "הטמעות CRM"                        services.headings[3], "הטמעת CRM"
         · "כל הכלים ... לדבר זה עם זה"        services.bodyText 04 headline, "כל הכלים שלכם
                                               מדברים זה עם זה."
         AUTHORED within it: "שעונים ומסננים פניות" — the English's "answer and qualify" has no
         single sourced phrase; the capture splits the idea across "Support Triage" and 01's
         list of autonomous sales/support/research agents.
         The Latin brand and product names are Latin by the keep-Latin rule, as in chrome. */
      "Clix בונה מערכות AI מהונדסות לעסק שלכם: סוכני AI שעונים ומסננים פניות בשפה של הלקוחות שלכם, עוזרים חכמים ב-WhatsApp שמוכרים בערוץ שבו הלקוחות כבר נמצאים, הטמעות CRM, והאינטגרציות שגורמות לכל הכלים לדבר זה עם זה.",
      /* "תל אביב" is SOURCED — about.links[14].text, "תל אביב · שירות גלובלי", the location as
         the real site publishes it. The REST IS AUTHORED: "small team" and "small is the point"
         are the English page's own claim, and the real site's /about says the opposite kind of
         thing ("צוות מקצועי של מומחי אוטומציה ופיתוח בוגרי יחידה 8200 והטכניון"), so there is
         nothing to lift for it. The closing image — the afternoon someone just got back — is
         ClixManifesto.tsx's, reused here exactly as the English reuses it. */
      "אנחנו צוות קטן בתל אביב, וזה בדיוק העניין. אין תור בדרך מהעבודה שלכם אל הלקוח, ואין שכבה בינכם לבין האדם שקיבל בחזרה את אחר הצהריים שלו.",
    ],
  },

  gallery: {
    /* AUTHORED ×3. Screen-reader strings with no counterpart in the capture, so they cost no
       geometry and are written as natural Hebrew rather than word for word.
       `ב-clix` takes the prefix hyphen — see the carve-out at the top of this file. */
    label: "החיים ב-clix",
    roleDescription: "קרוסלה",
    controlsLabel: "פקדי ניווט של הקרוסלה",
    alt: {
      /* AUTHORED ×8. The photographs are this repo's own neutral Pexels stock, not the clone
         target's staff and not the real site's team page, so there is nothing anywhere to
         source these from. Keyed by photo ID, so these stay bound to their photograph rather
         than to a slide position.
         "אדם מהצוות" rather than "חבר צוות" where English says "a team member": Hebrew has no
         neutral gender and these are unidentified stock subjects, so the generic masculine
         would be asserting something the photograph does not show. */
      team01: "אדם מהצוות עובד ליד שולחן.",
      team02: "חברי צוות משחקים ספורט יחד.",
      team03: "ידיים מקלידות על מחשב נייד.",
      team04: "משרד בחלל פתוח.",
      team05: "קבוצה קטנה מול לוח מחיק.",
      team06: "אדם מהצוות בשיחת וידאו.",
      team07: "הפסקת קפה משותפת.",
      team08: "אירוע חברתי של הצוות בחוץ.",
    },
  },
};
