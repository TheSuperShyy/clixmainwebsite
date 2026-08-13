/**
 * Hebrew copy for /. OWNED BY ONE AGENT.
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
 * Five of those appear below (`ב-WhatsApp`, `ל-CRM`, `ה-AI`, `ו-middleware`, `רב-סוכני`) and
 * every one is copied off the live site.
 *
 * ─── THIS PAGE IS THE ONE WHERE "TRANSLATION" IS MOST CLEARLY THE WRONG WORD ──────────────
 * 36 of the 48 strings here are RESTORATIONS, not translations. The hero headline is the real
 * site's own closing CTA, which Hero.tsx:13-17 already says the English was rendered *out of*;
 * that comment also warned that "a Hebrew variant is NOT served by translating these strings in
 * place", and it was right — the Hebrew below is the original wording, not a round trip through
 * the English. The five `whyRogo` tenants are the real site's services 01/02/03/04/08. The
 * testimonials heading and four of the six attributions are on the live home page verbatim.
 *
 * ─── WHAT HEBREW DOES TO THE BOXES ON THIS PAGE ───────────────────────────────────────────
 * Every string below was fitted by RENDERED LINE COUNT against `discovery-var.woff2`
 * (advances + GPOS kerning + CSS letter-spacing, greedy break on spaces), never by character
 * count. Hebrew runs SHORTER here almost everywhere. The five places it does not match English
 * line-for-line are marked ⚠️ BOX at their key. Nothing was trimmed to make a box fit — see
 * contract §10.
 */

import type { Translated } from "../shape";
import type { HomeDict } from "../en/home";

export const home: Translated<HomeDict> = {
  hero: {
    /* SOURCED, and this is a RESTORATION rather than a translation. The real site closes four
       of its pages on this H2 — home.headings[11], services.headings[14], about.headings[3],
       work.headings[5] — and it arrives ALREADY BROKEN across two lines at the sentence
       boundary ("…העסק.\nאנחנו…"), which is exactly the two-const shape Hero.tsx wants. So the
       author's line break is the original's, not one we chose.
       Measured: 462.2px / 528.2px against English's 480.3 / 548.9 at the 56px and 64px tiers,
       so both sentences still set on ONE line each and the 344/568/648 boxes are untouched. */
    headlineA: "אתם מביאים את העסק.",
    headlineB: "אנחנו מביאים את הבינה.",
    /* SOURCED — the site's standing service blurb, in the pre-footer block of ALL 11 captured
       pages' bodyText ("סוכני AI, אוטומציות WhatsApp, … נבנים כדי לצמוח יחד איתכם" is the same
       sentence on every one of them). Note it says "built to grow with you" where the English
       says "built around how your team already works": the English is a later rewrite of this
       line, so the Hebrew is restored rather than back-translated.
       Measured: 3 lines in both the 300px and 350px boxes, exactly as English — widest run
       294.7 of 300 and 339.9 of 350. No box change. */
    tagline:
      "סוכני AI, אוטומציות WhatsApp, מערכות CRM, אינטגרציות ותוכנה מותאמת אישית נבנים כדי לצמוח יחד איתכם.",
    /* SOURCED — the CTA on every page of the real site; the same string chrome.nav.cta and
       chrome.footer.cta already use. Measured at 70.9px against English's 70.6, so the `w-min`
       button does not move. */
    cta: "בואו נתחיל",
  },

  logoCarousel: {
    /* AUTHORED. The real site does label this row, but with a VISIBLE heading ("02 · הסטאק" /
       "The stack · 12 tools"), not an accessible name, so there is nothing to lift for a
       `aria-label`. The thirteen tool names stay Latin in the component — they are trademarks. */
    ariaLabel: "הכלים שאנחנו בונים איתם",
  },

  testimonials: {
    /* SOURCED verbatim — home.bodyText, the kicker directly above
       "שמעו את זה ישירות מהאנשים שהעבודה שלהם השתנתה."
       ⚠️ BOX: ONE run where English has two. Measured 304.8px at 36px in the phone tier's 358px
       box, so it needs no break at all — where English hard-breaks into "In our clients’" /
       "own words". The heading therefore sets 1 line below 810 instead of 2 and that block is
       ~37.8px shorter on phone. This is the divergence the `readonly string[]` typing exists
       for: the component renders `heading.length - 1` breaks, so ONE run draws no `<br>`, and
       the wide-tier copy is the same array joined by a space. */
    heading: ["בקולם של הלקוחות שלנו"],
    clips: {
      /* SOURCED ×4 — home.bodyText's testimonial block names these four exactly like this,
         with the middot as the separator (the English renders it as a comma). The Latin
         "SalesIQ" needs no bidi isolation: a neutral between an L run and an R run resolves to
         the paragraph direction, so the middot lands on the correct side of it. */
      "asaf-peretz": { name: "אסף פרץ", role: "מייסד · SalesIQ" },
      "adir-peretz": { name: "אדיר פרץ", role: "בעלים · סטודיו וידאו וצילום" },
      "nevo-yahaloman": { name: "נבו יהלומן", role: "מייסד" },
      /* SOURCED — home.bodyText.
         ⚠️⚠️ UNRESOLVED IDENTITY CONFLICT, AND HEBREW IS WHERE IT BECOMES VISIBLE.
         `public/testimonials/noam-tovi.jpg` is a still from this client's own video and it
         carries a BURNED-IN CAPTION reading "אני נווה דוידי" — "I am Nave Davidi". The live
         site, and therefore this card, calls the same clip נועם תובי. In English the caption is
         Hebrew text a reader skims past; on /he the card says one name six lines above a video
         whose own subtitle says another. Already flagged for /product at
         product/ProductTestimonials.tsx:220-226 ("RESOLVE THE LABEL WITH THE CLIENT before
         either page is indexed"). NOT resolved here — nothing in the repo can say which name is
         right, and guessing would launder the uncertainty. */
      "noam-tovi": { name: "נועם תובי", role: "בעלים · השקעות" },
      /* AUTHORED ×2, and the weakest provenance on the page — flagged rather than smoothed
         over. Testimonials.tsx:44-48 records that this entry came from an uploaded FILENAME
         ("Achituv-Vtechezena.MOV") and is not on the live site at all, so both halves here are
         a transliteration BACK into Hebrew of a transliteration out of it. "ותחזינה" is the
         common spelling of the phrase the filename's "Vtechezena" points at; "ותחזנה" is the
         other. Neither is verifiable from anything in this repo. */
      achituv: { name: "אחיטוב", role: "ותחזינה" },
      /* SOURCED — but from the USER, not the site capture, and that is a third kind of
         provenance worth naming: Testimonials.tsx:49-58 records the user supplying this
         attribution on 2026-08-08 as "אלישיב הנדסה", which the English then rendered as
         "Elyashiv Engineering". So the Hebrew here is the original the user gave.
         `role: ""` for the same reason English carries it: this is a COMPANY, not a person, and
         the card holds the slot open with a non-breaking space rather than invent a job title
         for a firm. The speaker's own name is still unknown. */
      "elyashiv-engineering": { name: "אלישיב הנדסה", role: "" },
    },
  },

  whyRogo: {
    /* SOURCED (condensation) — pages/services.html's H1, recovered from the HTML rather than
       content.json because content.json's H1s have lost their spaces:
       "אנחנו בונים את המנגנונים השקטים שמניעים עסקים מודרניים." The English is a noun phrase,
       so the sourced sentence drops its "אנחנו בונים את" and keeps the phrase, split at the
       same relative-clause boundary the English breaks at.
       ⚠️ BOX: 2 lines above 810 where English sets 3 (measured 286.0 and 378.4 of the 400px
       measure at 44px, both single lines; English's second run wraps). One line shorter on
       phone too, 3 against 4. The headline column is `position:sticky` and the section's height
       comes from the tenants column beside it, so nothing else moves. */
    heading: ["המנגנונים השקטים", "שמניעים עסקים מודרניים"],
    tenants: {
      agents: {
        /* SOURCED — services.bodyText §01's lead line, "חברי צוות שאף פעם לא נחים." */
        title: "חברי צוות שאף פעם לא נחים.",
        /* SOURCED (condensation) — services.bodyText §01: the paragraph
           ("סוכני AI אוטונומיים למכירות, תמיכה, מחקר ותפעול בשפת המותג שלכם, על הנתונים
           שלכם, ובהתאם להליכי העבודה שלכם.") plus bullets 2, 3 and 5 of its five
           ("תזמור רב-סוכני עם זיכרון ושימוש בכלים", "סוכני קול לשיחות נכנסות ויוצאות",
           "תהליכי אישור עם אדם בלולאה"). Same three-sentence shape as the English, which was
           condensed from the same source. */
        body: "סוכני AI אוטונומיים למכירות, תמיכה, מחקר ותפעול. בשפת המותג שלכם, על הנתונים שלכם, ובהתאם להליכי העבודה שלכם. תזמור רב-סוכני עם זיכרון ושימוש בכלים, סוכני קול לשיחות נכנסות ויוצאות, ותהליכי אישור עם אדם בלולאה בכל מקום שבו זה משנה.",
      },
      whatsapp: {
        /* SOURCED — services.bodyText §02's lead line. A near-exact counterpart of the
           English "The channel they already use". */
        title: "הערוץ שבו הלקוחות שלכם כבר נמצאים.",
        /* SOURCED (condensation) — services.bodyText §02: the paragraph plus bullet 2
           ("תהליכי שיחה מבוססי AI עם העברה חלקה לאדם"). */
        body: "עוזרים חכמים ב-WhatsApp Business שמזמינים, מוכרים, תומכים ומבצעים מעקב. מחוברים ל-CRM, למערכת התשלומים, ליומן ולקטלוג שלכם, ועוברים לאדם ברגע שצריך.",
      },
      crm: {
        /* SOURCED — services.bodyText §03's lead line, "תמונת לקוח אחת ואמיתית במקום אחד." */
        title: "תמונת לקוח אחת ואמיתית במקום אחד.",
        /* SOURCED (condensation) — services.bodyText §03: the paragraph plus bullets 1, 2, 4
           and 5 ("אפיון, מידול נתונים והעברתם למערכת", "הקמת פייפליין מכירות, אוטומציות
           ודוחות", "העשרת נתונים וניקוד לידים מבוססי AI", "הדרכת צוות וליווי שוטף"). */
        body: "מערכות CRM מודרניות, מותקנות, מותאמות ומחוברות לכלים שהצוות שלכם באמת משתמש בהם. מידול נתונים והעברתם, הקמת פייפליין ודוחות, העשרת נתונים וניקוד לידים מבוססי AI, והדרכת הצוות שגורמת למערכת להחזיק מעמד.",
      },
      integrations: {
        /* SOURCED verbatim — home.headings[1], a real H2 on the live home page and the exact
           sentence the English "Every tool you use, feeding one brain" was rendered from.
           Preferred over services.bodyText §04's shorter lead ("כל הכלים שלכם מדברים זה עם
           זה.") precisely because it is the original of this English line.
           ⚠️ BOX: 2 lines at the 810–1199 tier where English sets 1 (measured in that tier's
           428px column at 28px). The tenant items are a flex column with a 72/88px gap and no
           uniform-row constraint, so the item grows 30.8px and the ones below it shift down;
           nothing clips and nothing else changes. The shorter §04 lead would have fitted in one
           line — not used, because trimming to the box would make the sourced string a
           paraphrase (contract §10). */
        title: "כל הכלים שאתם משתמשים בהם מזינים מוח אחד.",
        /* SOURCED (condensation) — services.bodyText §04: the paragraph plus bullets 1, 3, 4
           and 5 ("תכנון תהליכי עבודה מקצה לקצה", "Webhooks ו-middleware מותאמים אישית",
           "דשבורדים פנימיים ופורטלי תפעול", "ניטור, ניסיונות חוזרים וטיפול בשגיאות"). */
        body: "אנחנו מחברים תשלומים, הנהלת חשבונות, שיווק ותמיכה למערך אחד, באמצעות n8n, Make וקוד מותאם אישית. תכנון תהליכי עבודה מקצה לקצה, Webhooks ו-middleware, דשבורדים פנימיים, וניטור וניסיונות חוזרים לרגע שבו משהו במעלה הזרם נשבר.",
      },
      strategy: {
        /* SOURCED — services.bodyText §08's paragraph opens on exactly this sentence,
           "לא כל בעיה דורשת AI.", which is the English title word for word. */
        title: "לא כל בעיה דורשת AI.",
        /* SOURCED (condensation) — two places. The rest of services.bodyText §08's paragraph
           ("אלה שכן צריכות את ה-AI הנכון. אנחנו עורכים סקירה, מתעדפים, ומגדירים מה לבנות, מה
           לרכוש ועל מה לוותר.") plus the methodology step 02 that the English's closing clause
           came from ("בחירה שמתבססת על ROI, אבטחה ועמידות לאורך זמן", in both
           home.bodyText and services.bodyText). */
        body: "אלה שכן צריכות את ה-AI הנכון. אנחנו עורכים סקירה, מתעדפים, ומגדירים מה לבנות, מה לרכוש ועל מה לוותר, מתוך שקלול של ROI, אבטחה ועמידות לאורך זמן.",
      },
    },
  },

  byTheNumbers: {
    /* AUTHORED — the standard Hebrew for this heading. The real site has no "by the numbers"
       band, so there is nothing to lift. */
    heading: "במספרים",
    stats: {
      automations: {
        /* Latin digits, unchanged in every locale — see the note in en/home.ts. The FIGURE's
           provenance is work.headings[4], "200+ אוטומציות שמאחדות מערך מקוטע". */
        value: "200+",
        /* AUTHORED. Measured 162.4px at 18px against the phone tier's 358px, which matters
           here more than anywhere else on the page: this row is `whitespace-pre` below 810, so
           it CANNOT wrap and a long string would overflow instead of reflowing.
           ⚠️ BOX: 1 line at the 810+ tier where English wraps to 2 in the 240px measure. It
           costs nothing — the row's height is set by the number cell's `leading-[128px]`, not
           by the label. */
        lead: "אוטומציות פעילות בייצור",
        /* `null`, as in English: this label never breaks. */
        tail: null,
      },
      capacity: {
        /* Latin digits. FIGURE: work.headings[3], "Copilot מבוסס AI שהכפיל את קיבולת צוות
           התמיכה".
           ⚠️ BIDI, AND IT IS THE ONE PLACE ON THIS PAGE THE GLYPH ORDER CHANGES. "2" is a
           European Number and "×" (U+00D7) is Other Neutral, so under the Unicode bidi
           algorithm's N1/N2 the "×" takes the paragraph's RTL level and is placed to the LEFT
           of the digit: an RTL reader reads "2" then "×" (correct), but the glyphs SIT on
           screen as "×2". No `dir` override is added to fix it — contract §5 puts `<html dir>`
           in the two root layouts and nowhere else. Reported for the user's call. `200+` and
           `24/6` are unaffected: bidi rules W4/W5 fold the "+" and the "/" into the number run,
           so both render exactly as written. */
        value: "2×",
        /* AUTHORED. Trailing space is load-bearing — below 810 the `<br>` between lead and tail
           is `display:none` and this space is the only thing separating the two halves.
           Measured joined: 255px at 18px against the 358px `whitespace-pre` phone box. */
        lead: "קיבולת תמיכה, ",
        /* AUTHORED. 166.6px at 20px in the 240px tablet measure — 1 line, as English. */
        tail: "בלי גיוס עובדים חדשים",
      },
      coverage: {
        /* Latin digits. ⚠️ THE FIGURE DELIBERATELY NO LONGER MATCHES ITS SOURCE: work.headings[1]
           publishes 24/7 ("סוכן מכירות AI שמטפל בהזמנות משלוחים 24/7") and the user corrected
           it to 24/6 on 2026-08-07. See ByTheNumbers.tsx:50-57 — that divergence lives in this
           repo only, and it is not drift. */
        value: "24/6",
        /* AUTHORED, with the same load-bearing trailing space. */
        lead: "כיסוי מכירות ",
        /* AUTHORED. The English tail moved off "that never sleeps" for the same reason this one
           does not claim round-the-clock cover: a /6 with "24/7 language" beside it contradicts
           itself in the one place a reader is counting. 185.4px at 20px in 240px — 1 line. */
        tail: "גם מחוץ לשעות הפעילות",
      },
    },
  },

  security: {
    /* AUTHORED — the English triple's rhetorical shape kept, because that is the line.
       ⚠️ BOX: 3 lines at the 1200+ tier (48px) where English sets 2, inside the same centred
       400px measure; 2 lines at 36px and 44px, matching. The title block is a centred flex
       column with a 64px gap below it, so the section grows ~50px at that tier and nothing
       clips. Not trimmed to fit — contract §10. */
    heading: "המערכות שלכם, הנתונים שלכם, השליטה שלכם",
    /* AUTHORED ×5, and THESE FIVE NEED CROSS-FILE RECONCILIATION. The same five statements are
       restated verbatim by security/SecurityCompliance.tsx (all five),
       security/SecurityBenefits.tsx (four, as card titles) and product/ProductSecurity.tsx
       (four) — three files owned by other agents, in other namespaces. Whatever Hebrew those
       three land on must be THESE strings, or the site says the same thing three different ways
       in one language.
       ⚠️ SecurityBenefits' titles carry a HARD one-line constraint at every tier (its own
       header calls the rows "part of the layout"); these boxes are only 137/188px wide but the
       label is absolutely positioned at `bottom-4`, so extra lines here move nothing.
       All five measured at 12px in their own box: 129.3 / 131.6 / 105.3 / 112.9 / 73.0 — every
       one sets a SINGLE line, where English's "Encrypted in transit and at rest" needs two.
       `your-data` at 131.6 of 137 is the tight one (96%); if real shaping pushes it to two
       lines that is harmless for the reason above. */
    badges: {
      "your-cloud": "הענן שלכם, החשבונות שלכם",
      "your-data": "הנתונים שלכם נשארים שלכם",
      "least-privilege": "גישה בהרשאות מינימום",
      encrypted: "הצפנה בתעבורה ובאחסון",
      ownership: "הקוד בבעלותכם",
    },
  },
};
