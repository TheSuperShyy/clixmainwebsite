/**
 * Hebrew copy for /accessibility. **THIS FILE IS THE SOURCE, and en/accessibility.ts is the
 * translation.**
 *
 * Added 2026-08-16 at the user's request. SOURCED in full from
 * `docs/reference/clixsolutions/pages/accessibility.html`, re-checked against the live page:
 * seven sections, eyebrow `משפטי · נגישות`, `עדכון אחרון · 16 במאי 2026`.
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 * ⚠️ READ THIS BEFORE YOU CHANGE ANYTHING ON THIS SITE'S MARKUP OR PALETTE.
 *
 * This is not a description. It is a DECLARATION under Israeli regulation 35 of the Equal
 * Rights for Persons with Disabilities Regulations and standard ת״י 5568, it promises specific
 * verifiable behaviour, and §06 NAMES A REAL PERSON as the accessibility coordinator
 * responsible for it.
 *
 * FOUR OF ITS PROMISES WERE FALSE ABOUT THIS BUILD WHEN IT WAS PORTED. Checked against the
 * codebase on 2026-08-16, not assumed:
 *
 *   · §03 promises a "דילוג לתוכן" (skip to content) link at the top of every page, revealed on
 *     the first Tab. **There is none.** No skip link and no `id="main"` target anywhere in
 *     `src/` — grepped.
 *   · §03 promises WCAG AA contrast on body text and interactive elements, and says the brand
 *     palette "נמדדה ולא רק הונחה" (was measured, not merely assumed). **This repo's own
 *     docs/DESIGN-SYSTEM.md and docs/SECTIONS.md record at least six open AA failures** —
 *     3.85:1 on security/footer/careers, 4.35:1 and 4.24:1 on /product, 2.50:1 and 1.92:1 on
 *     the testimonials. The eyebrow on THIS VERY PAGE is one of them.
 *   · §04 says the site was tested with VoiceOver on macOS and iOS, NVDA on Windows, and
 *     keyboard-only across the last two stable versions of four browsers. **This build has had
 *     none of that testing.**
 *   · §03 promises ARIA live regions for status messages including "עדכוני צ׳אט" (chat
 *     updates). The form has them (`ContactForm.tsx`); **there is no chat on this site.**
 *
 * §05 additionally describes remediation work on the playground node editor and background 3D
 * scenes. **Neither exists on this site** — the playground is the real company site's feature,
 * and it is the same page whose footer link was deleted on 2026-08-16 for having no analogue.
 *
 * ONE PROMISE VERIFIED TRUE: `prefers-reduced-motion` is genuinely honoured, in globals.css and
 * in five components.
 *
 * Every one of these was reported to the user before the port, in plain terms, and the
 * instruction was to copy the page. So it is copied verbatim — but the mismatches are recorded
 * here, in `features/legal-pages/FEATURE.md`, and in `docs/CONTEXT.md`, because the cheapest
 * two are cheap to make TRUE rather than to amend: a skip link is a small addition, and
 * DESIGN-SYSTEM.md already notes the 3.85:1 failures need ONE token change to close them all.
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ `{email}` / `{phone}` are placeholders — the published address is stale. See
 * `he/privacy.ts`. The COORDINATOR'S NAME is kept verbatim: it is published on the live site
 * and naming a responsible person is the point of §06.
 *
 * ⚠️ NO-DASHES DOES NOT APPLY. Quoted legal text keeps its punctuation, including the prefix
 * hyphens (`ב-Clix`, `ה-W3C`, `ל-WCAG`, `בלתי-נפרד`) and the gershayim in `ת״י` and `התשע״ג`.
 */

import type { Translated } from "../shape";
import type { AccessibilityDict } from "../en/accessibility";

export const accessibility: Translated<AccessibilityDict> = {
  eyebrow: "משפטי · נגישות",
  title: "הצהרת נגישות",
  updatedLabel: "עדכון אחרון",
  updatedDate: "16 במאי 2026",

  sections: [
    {
      n: "01",
      title: "הצהרת כוונות",
      lead: [
        "Clix רואה בנגישות זכות בסיסית של כל משתמש. אנחנו משקיעים מאמץ מתמשך כדי להבטיח שהאתר, המוצרים והשירותים שלנו יהיו נגישים לקהל הרחב ביותר האפשרי כולל אנשים עם מוגבלויות מוטוריות, ראייתיות, שמיעתיות וקוגניטיביות.",
        "ב-Clix אנחנו מתייחסים לעבודת הנגישות כחלק בלתי-נפרד מהאיכות ולא כתיבת סימון שמתווספת בסוף הפרויקט. אנחנו בודקים, מתקנים, ובודקים שוב.",
      ],
    },
    {
      n: "02",
      title: "התקנים שלפיהם אנו פועלים",
      lead: [
        "האתר נבנה לתאימות לתקן WCAG 2.1 ברמה AA, שפורסם על ידי ה-W3C ומהווה את התקן הבינלאומי לנגישות אתרים, וכן לתקן הישראלי ת״י 5568, המופיע בתקנה 35 לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013.",
        "בכל מקום שבו האתר אינו עומד עדיין ברמת AA בעמוד מסוים או רכיב מסוים, הפער מתועד כליקוי ולא כמגבלה קבועה ומועלה לתעדוף בהתאם.",
      ],
    },
    {
      n: "03",
      title: "תכונות נגישות מובנות באתר",
      /* ⚠️ Items 4, 5 and 10 are the false ones — the skip link, the AA contrast claim and the
         chat live region. See the block at the top of this file. */
      items: [
        "HTML סמנטי הכולל אזורי ציון (header, nav, main, footer), כך שקוראי מסך יכולים לנווט במבנה העמוד.",
        "תפעול מלא באמצעות מקלדת כל קישור, כפתור, שדה טופס וכל רכיב אינטראקטיבי נגישים וניתנים לשימוש ללא עכבר.",
        "מחווני פוקוס ויזואליים בכל אלמנט אינטראקטיבי.",
        "קישור ״דילוג לתוכן״ בראש כל עמוד, נחשף בלחיצת Tab ראשונה.",
        "ניגודיות צבע מותאמת ל-WCAG AA על טקסט גוף ועל אלמנטים אינטראקטיביים; פלטת המותג נמדדה ולא רק הונחה.",
        "כיבוד שאילתת המדיה prefers-reduced-motion כל אנימציה, סצנת 3D, אפקט פרלקס ולולאה מתמשכת מתכווצים למסגרת סטטית כאשר מערכת ההפעלה מבקשת תנועה מופחתת.",
        "טקסט אלטרנטיבי תיאורי בתמונות בעלות משמעות; גרפיקה דקורטיבית בלבד מסומנת ב-aria-hidden כדי שלא תפריע לקוראי מסך.",
        "שדות טופס עם תוויות מפורשות, הודעות שגיאה המקושרות לשדה הרלוונטי, ובקרות מקובצות לפי הצורך.",
        "פריסה רספונסיבית הנפרשת באופן נקי עד 320 פיקסלים ללא גלילה אופקית, ותומכת בהגדלת טקסט של עד 200% ללא אובדן תוכן.",
        "אזורי ARIA Live להודעות סטטוס (שליחת טופס, עדכוני צ׳אט) כך שכל שינוי מוכרז לטכנולוגיה המסייעת.",
        /* ADDED 2026-08-17 from the live page’s `תכונות נגישות באתר` list. ⚠️ BOTH DESCRIBE
           THE WIDGET IN §04 AND ARE FALSE OF THIS BUILD — there is no text-resize control and
           no high-contrast mode in `src/`. Added because the live site is the source of
           truth; see the ⚠️ block at the top of this file. */
        "אפשרות להגדלת והקטנת גודל הטקסט.",
        "מצב ניגודיות גבוהה לקריאה נוחה יותר.",
      ],
    },
    {
      n: "04",
      /* ADDED 2026-08-17 from the live https://www.clix-solution.com/accessibility.
         ⚠️ THE LIVE SITE SHIPS THIS WIDGET AND THIS BUILD DOES NOT. The clause names a
         concrete control at a concrete screen position, so until that button exists here it
         is the most checkable false promise on the page. Flagged in FEATURE.md. */
      title: "כפתור נגישות",
      lead: [
        "בצד שמאל של המסך תמצאו כפתור נגישות המאפשר התאמות מהירות כגון שינוי גודל טקסט והפעלת מצב ניגודיות גבוהה.",
      ],
    },
    {
      n: "05",
      title: "טכנולוגיה מסייעת תואמת",
      /* ⚠️ The first line asserts testing this build has never had. */
      lead: [
        "האתר נבדק עם VoiceOver במערכות macOS ו-iOS, עם NVDA ב-Windows, ובניווט מקלדת בלבד בשתי הגרסאות היציבות האחרונות של Chrome, Safari, Firefox ו-Edge.",
        "אנחנו ממליצים לעדכן את הדפדפן ואת קורא המסך לגרסה היציבה האחרונה לקבלת חוויית הגלישה המיטבית.",
      ],
    },
    {
      n: "06",
      title: "עמודים ורכיבים בתהליך נגשה",
      /* ⚠️ Describes a playground node editor and 3D scenes that do not exist on this site. */
      items: [
        "עורך הצמתים בפלייגראונד מתופעל כיום באמצעות עכבר ומגע בלבד; יכולת גרירה ושחרור בקנבס במקלדת בלבד נמצאת במפת הדרכים שלנו.",
        "חלק מסצנות ה-3D ברקע הן דקורטיביות הן מתכווצות לחלופה סטטית במצב תנועה מופחתת, אך ה-3D עצמו לא מתואר לקוראי מסך (התוכן הסובב נושא את כל המשמעות).",
        "תוכן מוטמע מצד שלישי (למשל YouTube, הטמעות יומן) כפוף לרמת הנגישות של אותם ספקים, ועשוי שלא להתאים במלואו לשאר האתר.",
      ],
    },
    {
      n: "07",
      title: "רכז הנגישות",
      /* The only section using all three slots: intro, contact list, response-time note. The
         NAME is published on the live site and is kept verbatim. */
      lead: [
        "אם נתקלתם במכשול נגישות באתר, או שיש לכם משוב או שאלות בנושאי נגישות ב-Clix, נשמח שתפנו אל רכז הנגישות שלנו.",
      ],
      items: [
        "שם: אלמליח עידו מייסד ורכז נגישות.",
        "אימייל: {email} (בנושא: נגישות).",
        "טלפון: {phone}.",
      ],
      tail: [
        "אנחנו מתייחסים לדיווחי נגישות בעדיפות עליונה, שואפים לאשר את קבלתם תוך יום עסקים אחד, ולפתור או לספק מענה זמני בטווח זמן סביר בהתאם למורכבות.",
      ],
    },
    {
      n: "08",
      title: "שינויים בהצהרה זו",
      /* The source repeats the date inside this section as well as at the top. Kept. */
      lead: [
        "הצהרה זו נסקרת ומתעדכנת בכל שינוי מהותי באתר ובכל מהדורת שיפורי נגישות שאנו משחררים. תאריך העדכון האחרון בתחתית העמוד משקף את הגרסה הנוכחית.",
        "עדכון אחרון: 16 במאי 2026.",
      ],
    },
    {
      n: "09",
      /* ADDED 2026-08-17 — the live page’s closing section, which this port lacked. */
      title: "שיפור מתמיד",
      lead: [
        "אנו עובדים באופן שוטף לשפר את נגישות האתר ולהתאימו לתקנים העדכניים ביותר. המחויבות שלנו לנגישות היא חלק בלתי נפרד מהשירות שאנו מספקים.",
      ],
    },
  ],

  closingLead: "יש שאלות? כתבו לנו אל",
  closingTail: ".",
};
