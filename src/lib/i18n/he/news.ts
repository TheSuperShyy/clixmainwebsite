/**
 * Hebrew copy for /news. OWNED BY ONE AGENT.
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
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 * ⚠️ READ THIS BEFORE EDITING `items`. EVERY HEADLINE BELOW IS A TRANSLATION OF REPORTING THIS
 * COMPANY DID NOT WRITE, AND THE ATTRIBUTION BESIDE IT IS UNCHANGED.
 *
 * `newsItems.ts` opens by saying that "every headline, source and URL is genuine third-party
 * reporting; nothing here is invented, which is why /news ships without the robots block /clix
 * carries". Translating a headline while keeping "Financial Times" beside it therefore publishes
 * OUR words under THEIR name, on a page that is deliberately indexable. The user took that
 * decision on 2026-08-12; these are the mitigations that keep it honest, and none is optional:
 *
 *   1. SOURCE NAMES AND URLS ARE NEVER TRANSLATED. They are attributions and identifiers.
 *      They live in `newsItems.ts` and no key for them exists in this file, by design.
 *   2. TRANSLATE THE HEADLINE, NEVER THE STORY. Every string below must be recoverable from
 *      the English headline alone. Do not add a fact, a figure, a name or a judgement the
 *      headline does not already carry — the articles were not read and cannot be vouched for.
 *   3. WHERE HEBREW FORCES A CHOICE ENGLISH DID NOT MAKE, AVOID IT RATHER THAN GUESS.
 *      Hebrew verbs carry gender; English headlines often do not name it. The live case is
 *      `openai-ethics-chief-exit`: the English says only that Bakalar leaves, so the Hebrew is
 *      a VERBLESS noun phrase rather than a guessed inflection. Inventing an inflection would
 *      be inventing a fact and attributing it to the FT.
 *   4. PROPER NAMES STAY LATIN — companies, products, models and people alike. Transliterating
 *      "Andreessen" is a spelling decision this file has no source for, and a mis-spelled
 *      person's name beside a real publisher's name is worse than a Latin one.
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 */

import type { Translated } from "../shape";
import type { NewsDict } from "../en/news";

export const news: Translated<NewsDict> = {
  hero: {
    /* AUTHORED — the English h1 is "Updates", not "News", and the nav slot already says
       "חדשות" (he/chrome.ts), so the page heading keeps the distinction English draws. */
    title: "עדכונים",
    /* AUTHORED — the real site has no news page to source from. Register follows
       insights.bodyText, which is plain and unhyped; the prefix hyphen in "ה-AI" is that
       page's own orthography ("כולם רוצים את ה-AI הנוצץ"), not a choice made here.
       ⚠️ ONE INTERPRETIVE WORD: English closes on "the rules", which in a list of models,
       money and risks reads as regulation, so "והרגולציה" rather than a flat "והכללים". */
    subtitle:
      "עדכון יומי על כל מה שצריך לדעת על ה-AI: המודלים, הכסף, הסיכונים והרגולציה.",
    /* "צרו קשר" is SOURCED — contact.bodyText, and the footer heading on every page of the
       real site. The qualifier "עם צוות התקשורת" is AUTHORED; there is no real press desk.
       ⚠️ THE ONE TIGHT STRING ON THIS ROUTE. It renders inside `whitespace-pre` in a
       `width: min-content` anchor, so it CANNOT WRAP: it has to stay under 358 − 32 = 326px
       at the 390 tier. Measured, it clears. Do not lengthen it without re-measuring. */
    cta: "צרו קשר עם צוות התקשורת",
  },

  /* AUTHORED ×5. These are FILTER LABELS, not the categories themselves — NewsBoard keeps the
     English category as its state value and looks the label up here, so editing one of these
     changes nothing structural. "אבטחה" matches the nav's Security slot in he/chrome.ts on
     purpose. "מדיניות" rather than "רגולציה": the bucket holds a royal commission, a
     central-bank appointment and an ethics-chief departure, which is policy in the broad sense
     rather than regulation specifically. */
  filters: {
    All: "הכל",
    Models: "מודלים",
    Business: "עסקים",
    Security: "אבטחה",
    Policy: "מדיניות",
  },

  a11y: {
    /* AUTHORED — names the pill bar for a screen reader. */
    filterTablist: "סינון חדשות לפי קטגוריה",
  },

  /**
   * KEYED BY STORY ID, never by index. `newsItems.ts` states that its order is deliberate and
   * that adding a story "shifts every card after it", so an index join would re-pair every
   * headline below the insertion point without a single type error.
   *
   * Every string in here is AUTHORED in the strict §4 sense: it is a Hebrew rendering of an
   * English headline clix did not write, so it is precisely the class of string the user
   * reviews. `figure`/`caption` belong to a stat tile and `alt` to a photograph; a lockup card
   * has neither, because its two halves are Latin entity names that are not translated at all.
   */
  items: {
    /* ---- row 1 ---- */
    "anthropic-riot-compute": {
      /* "191 MW" stays a Latin unit symbol. Units are not translated, and "191 מגה-וואט" would
         introduce a compound hyphen the copy rule has no carve-out for. */
      title:
        "Anthropic סוגרת עם Riot עסקת מחשוב ל-20 שנה בהספק 191 MW בשווי 9.1 מיליארד דולר",
    },
    "south-australia-ai-commission": {
      title:
        "דרום אוסטרליה מכריזה על ועדת החקירה הממלכתית הראשונה באוסטרליה בנושא AI",
      alt: "תורן הדגל של בית הפרלמנט של אוסטרליה על רקע שמיים פתוחים.",
    },
    "gpt56-cyber-chrome-zero-days": {
      title: "GPT-5.6-Cyber החדש של OpenAI איתר שתי חולשות יום אפס ב-Chrome",
      figure: "2 חולשות יום אפס",
      caption: "נמצאו ב-Chrome",
    },

    /* ---- row 2 ---- */
    "unitree-shanghai-ipo": {
      title: "ההנפקה של Unitree בשנחאי משכה ביקושי יתר פי 2,700 מהציבור",
      /* "מימין" is PHYSICALLY right and stays that way: the photograph is not mirrored in RTL
         (§7 — artwork does not flip), so the tower really is at the right of the frame. */
      alt: "מגדלי הרובע הפיננסי לוג׳יאזוי בשנחאי, מגדל שנחאי מימין.",
    },
    "meta-muse-glimmer": {
      title:
        "Meta משחררת את Muse Glimmer, מודל סוכן של 30 מיליארד פרמטרים שרץ על מחשב נייד",
    },
    "h3c-apple-silicon": {
      title: "יוצר Redis משיק סביבת ריצה נייטיבית ל-MiniMax H3 על Apple Silicon",
    },

    /* ---- row 3 ---- */
    "claude-riemann-zeta": {
      /* "תת-סוכנים" carries the same prefix hyphen the real site writes in "רב-לשוני". */
      title:
        "Claude משפר חסם בפונקציית זטא של רימן בעזרת 60 תת-סוכנים ו-31 מיליון טוקנים",
      figure: "60 תת-סוכנים",
      caption: "31 מיליון טוקנים",
    },
    "sonnet5-price-freeze": {
      title:
        "Anthropic מקפיאה את מחיר ההשקה של Sonnet 5 ומבטלת את ההעלאה שתוכננה ל-1 בספטמבר",
    },
    "singapore-gdp-forecast": {
      /* "תמ״ג" uses gershayim (״ U+05F4), never an ASCII double quote. */
      title: "סינגפור מכפילה את תחזית התמ״ג ל-2026 ותולה זאת בגל ההשקעות ב-AI",
      alt: "הרובע הפיננסי מרינה ביי בסינגפור, במבט מעבר למים.",
    },

    /* ---- row 4 ---- */
    "fed-warsh-ai-overhaul": {
      /* "הפד" is how Hebrew business press names the Federal Reserve. Both people stay Latin
         per mitigation 4 in the header. */
      title: "Warsh מהפד מפקיד את מהלך ה-AI בידי Andreessen ו-Chetty",
    },
    "tldv-meeting-leak": {
      /* "tl;dv" is a product name and stays exactly as written. Its semicolon sits between two
         Latin letters, so the bidi algorithm keeps the whole token left-to-right unaided. */
      title: "שירות התמלול tl;dv הדליף 181 אלף פגישות והשהה את התיקון בחצי שנה",
      figure: "181 אלף פגישות",
      caption: "חצי שנה ללא תיקון",
    },
    "openai-ethics-chief-exit": {
      /* ⚠️ VERBLESS BY DESIGN — mitigation 3 in the header. The English gives no gender for
         Bakalar and this file will not invent one, so the headline is a noun phrase. */
      title: "עזיבת Bakalar, ראש תחום האתיקה ב-OpenAI, אחרי פחות משנה",
      alt: "תא משרדי שהתרוקן, שולחנו ריק, ליד חלון.",
    },
  },
};
