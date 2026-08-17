/**
 * Hebrew shared chrome.
 *
 * PROVENANCE. Every string is marked in the comment beside it as one of:
 *   · SOURCED  — lifted verbatim from docs/reference/clixsolutions/, the capture of the real
 *                company site (which is `lang="he" dir="rtl"` and has no English version).
 *                The path into content.json / pages/*.html is given.
 *   · AUTHORED — written in that captured voice because no counterpart exists. These are the
 *                only strings that need the user's review.
 *
 * For several of these, "translation" is the wrong word — the English was rendered OUT OF this
 * Hebrew in the first place (Footer.tsx and Hero.tsx both say so in their own comments), so
 * the Hebrew here is a RESTORATION of the original wording.
 *
 * ⚠️ H1 STRINGS MUST NEVER BE LIFTED FROM content.json. Its extractor walked per-word spans
 * and concatenated without separators, so every H1 in it has lost its spaces
 * ("מערכותAIמהונדסותלעסקשלכם."). H2/H3 and bodyText are fine. Recover H1s from
 * docs/reference/clixsolutions/pages/*.html instead — strip tags, collapse whitespace.
 *
 * ⚠️ THE NO-DASHES RULE HAS A CARVE-OUT HERE. The standing instruction (2026-08-10) forbids
 * dashes in clix copy, and the real site's Hebrew prose indeed contains zero em dashes. But it
 * cannot forbid the Hebrew PREFIX HYPHEN, because `בWhatsApp` is simply misspelled. The live
 * site writes `ב-WhatsApp`, `ה-AI`, `רב-לשוני`. That hyphen is orthography, not punctuation
 * style, and it stays.
 */

import type { ChromeDict } from "../dictionary";

export const chrome: ChromeDict = {
  nav: {
    labels: [
      /* AUTHORED — the brand, Latin in every locale. Not transliterated: the wordmark two rows
         up is Latin, and "קליקס" beside a Latin lockup reads as two different companies. */
      "Clix",
      /* AUTHORED ×5. The real site's IA is different (שירותים/תעשיות/פרויקטים/תובנות/
         פלייגראונד/אודותינו), so only its register transfers, not its labels.
         ⚠️ These have a SUM constraint, not a per-string one: they sit in an absolutely
         centred row that must clear the logo and the CTA at the 1200–1599 tier. Measured
         against the real face at seven slots, the Hebrew row was 467px against English's 552px
         — 85px of clearance. Dropping קריירה/Careers on 2026-08-13 took ~54px off the Hebrew
         row and ~65px off the English one, so both got SHORTER and the margin only grew.
         Re-measure if any label grows. */
      "מוצר",
      "אבטחה",
      "החברה",
      "לקוחות",
      "חדשות",
    ],
    /* SOURCED verbatim — about.links[9].text, and the CTA on every page of the real site.
       Measured at 70.9px against English's 70.6px, so the button does not move. */
    cta: "בואו נתחיל",
  },

  footer: {
    /* AUTHORED ×4 — column headings; the real site's footer groups differently. */
    groupTitles: ["סקירה", "החברה", "מידע משפטי", "צרו קשר"],
    links: {
      /* SOURCED — the real site's own nav labels, home.bodyText. */
      services: "שירותים",
      work: "עבודות",
      about: "אודותינו",
      insights: "תובנות",
      /* SOURCED — replaced `playground` ("פלייגראונד") on 2026-08-16. Not newly authored: this
         is the SAME STRING as `nav.labels[2]`, which was itself taken from the real site. The
         slot now points at /security, and reusing the nav's word rather than inventing a
         second one is the point — one route, one Hebrew name. */
      security: "אבטחה",
      /* SOURCED — the real site's own three legal links, home.bodyText footer run. */
      terms: "תנאי שימוש",
      privacy: "מדיניות פרטיות",
      accessibility: "הצהרת נגישות",
      /* SOURCED — same string as the nav CTA. */
      letsStart: "בואו נתחיל",
      email: "אימייל",
      /* Product names, Latin by the keep-Latin rule. The bidi isolation that keeps them from
         reordering against neighbouring Hebrew is applied in the component, not here. */
      instagram: "Instagram",
      linkedin: "LinkedIn",
      whatsapp: "WhatsApp",
    },
    /* SOURCED verbatim — home.bodyText closes on "תוכנה שעובדת, תוצאות שמדברות."
       ⚠️ TWO fragments, not three. The English splits three ways and gains a fourth line on
       phone; this phrase has one comma and one sentence boundary, so it sets two lines at every
       tier and the phone-only break has nothing to gate. That is why `tagline` is typed
       `readonly string[]` rather than a tuple — a recorded, expected divergence, not a gap. */
    tagline: [["תוכנה שעובדת,"], ["תוצאות שמדברות."]],
    cta: "בואו נתחיל",
    /* SOURCED — "© 2026 Clix Solutions. כל הזכויות שמורות." The year and the holder are two
       separate runs here, as in English; the holder stays Latin because it is a name. */
    copyrightYear: "© 2026",
    copyrightHolder: "clix",
    /* AUTHORED — corrected from an earlier "SOURCED" marker that was simply wrong. The
       English string is this repo's own invention too (the map panel has no counterpart on
       either the target or the real site), so there is nothing to lift. Provenance markers are
       only worth having if they are accurate. */
    mapTitle: "מפה של מיקום clix — תל אביב-יפו, ישראל",
  },

  /* SOURCED VERBATIM from the live https://www.clix-solution.com cookie banner, 2026-08-17.
     This is the SOURCE; en/chrome.ts carries the translation.
     ⚠️ `bodyLead` ENDS ON THE BARE PREFIX "ב" WITH NO SPACE — it attaches directly to the link
     that follows it ("...לקרוא עוד ב" + "מדיניות הפרטיות"). `bodyTail` OPENS WITH A SPACE. A
     trim on either one breaks the sentence. */
  cookies: {
    /* Authored, not sourced — the live banner has no accessible name at all. */
    label: "הודעת עוגיות",
    title: "האתר משתמש בעוגיות 🍪",
    bodyLead:
      "אנחנו משתמשים בעוגיות לצורך תפעול האתר, מדידה סטטיסטית ושיפור חווית המשתמש. ניתן לקרוא עוד ב",
    bodyLink: "מדיניות הפרטיות",
    bodyTail: " שלנו.",
    acceptAll: "קבל את כל העוגיות",
    essentialOnly: "רק עוגיות חיוניות",
  },

  a11y: {
    /* AUTHORED ×8. Screen-reader strings; no counterpart in the capture, which ships one
       relevant example: aria-label="הפעלת עדות של <name>" on its testimonial play buttons —
       which is exactly `playTestimonial` below, so that one IS sourced. */
    home: "clix — לדף הבית",
    openMenu: "פתיחת תפריט",
    closeMenu: "סגירת תפריט",
    mainLandmark: "ראשי",
    /* SOURCED — the real site's own aria-label pattern for this exact control. */
    playTestimonial: "הפעלת עדות של {name}",
    /* ⚠️ AUTHORED, NOT SOURCED — unlike `playTestimonial` directly above it. The capture has no
       pause control anywhere: its testimonial players hand off to native `controls` the moment
       they start, so there is no real-site string to lift. `השהיה` is the standard Hebrew UI
       term for pause, and the verbal-noun form `השהיית` is chosen to parallel `הפעלת`
       above rather than the imperative `השהה`, so the two labels read as one pair.
       UNREAD BY A NATIVE SPEAKER. */
    pauseTestimonial: "השהיית עדות של {name}",
    slideOfTotal: "{n} מתוך {total}",
    previous: "הקודם",
    next: "הבא",
    languageSwitcher: "שפה",
    /* AUTHORED ×3. Screen-reader-only, so they cost no geometry — which is why they are written
       as one Hebrew sentence each rather than word-for-word from the English. The prices arrive
       as $-prefixed Latin numerals in both locales; a screen reader reads them in the number's
       own direction, so no isolation is needed in text that is never painted. */
    tickerIntro: "מחירון מודלי חזית, בדולרים למיליון טוקנים:",
    tickerRow: "{model}, {in} קלט ו-{out} פלט",
    tickerContext: ", חלון הקשר {ctx}",
    tickerRank: ", המחיר ה-{rank} מבין {total} מהזול ליקר",
  },
};
