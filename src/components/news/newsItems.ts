/**
 * The /news digest — REAL AI news, gathered 2026-08-11 (web search; aiweekly.co index
 * cross-read). Every headline, source and URL is genuine third-party reporting; nothing
 * here is invented, which is why /news ships without the robots block /clix carries.
 *
 * This file IS the content pipeline: refreshing the news means editing this array and
 * nothing else. Keep entries in the digest's shape — headline as the card title, the
 * source's own name as the card's attribution, the ARTICLE as the link (cards link out,
 * in a new tab, because ours is a digest rather than a blog — see FEATURE.md deviations).
 *
 * ⚠️ AND THE ENGLISH STILL LIVES HERE, AFTER THE 2026-08-12 HEBREW PASS. The obvious way to
 * translate a headline is to move it into src/lib/i18n/en/news.ts, and that was rejected: it
 * would end the property above, permanently. So `en/news.ts` PROJECTS its copy out of this
 * array instead, and only the HEBREW is authored by hand, joined on `id`. Adding a story is
 * therefore still one edit here — plus one `tsc` error telling you the Hebrew is missing,
 * which is the point.
 *
 * ⚠️ A NEW ENTRY NEEDS AN `id`, and the array is `as const satisfies readonly NewsItem[]` so
 * that every id has a literal type. Do not loosen that annotation: it is what `NewsItemId`
 * (bottom of this file) is derived from, and it is the only thing standing between a missing
 * translation and a silently-English Hebrew card.
 *
 * Categories mirror rogo's five-pill bar in COUNT only (All + 4); the labels are how AI
 * news actually clusters, not rogo's PR taxonomy.
 *
 * ---------------------------------------------------------------------------------
 * CARD ART LIVES HERE TOO, beside the story it belongs to (2026-08-12). rogo's grid is
 * not one template — it runs flat wordmark lockups, a photograph with a floating chip,
 * and light panels carrying figures, all within the same six cards. `art` says which of
 * the three a story gets and what goes in it; NewsBoard only draws.
 *
 * ⚠️ ORDER IS DELIBERATE, IS NOT CHRONOLOGICAL, AND IS NOT A REPEATING PATTERN.
 *
 * It was never chronological (the first array ran 8/11, 8/10, 8/10, 8/11…). The first
 * attempt at sequencing it went too far the other way: strictly alternating the three
 * kinds put lockups in column 1, photos in column 2 and stat tiles in column 3 on every
 * single row, which reads as a template rather than an editorial grid — user, 2026-08-12,
 * "i like more with randomness". rogo's own grid has no column-to-kind mapping at all.
 *
 * What the current sequence holds, at 3 columns:
 *   L P S   · no row is all one kind
 *   P L L   · no column is all one kind
 *   S L P   · the three dark grounds zig-zag (R1C1, R2C3, R3C2) instead of lining up
 *   L S P
 * Adding or removing a story shifts every card after it, so re-check those four rows
 * rather than appending blindly.
 * ---------------------------------------------------------------------------------
 */

export type NewsCategory = "Models" | "Business" | "Security" | "Policy";

/** Token grounds a built tile may sit on. Nothing outside DESIGN-SYSTEM.md. */
export type Ground = "canvas" | "surface" | "forest" | "forest-deep";

/**
 * Half of a lockup: a verified mark, a name, or both.
 *
 * `glyph` is a key into NEWS_GLYPHS. A missing or unverified mark is simply left off and
 * the part renders as type alone — see the wrong-company warning in newsGlyphs.tsx.
 */
export type LockupPart = { glyph?: string; text: string };

export type CardArt =
  /** rogo's "rogo × Entropia" — flat token ground, centred wordmark lockup. */
  | { kind: "lockup"; ground: Ground; parts: readonly LockupPart[]; joiner: "×" | "/" }
  /** rogo's "Deal Room" — light ground, faint panel texture, a figure over it. */
  | {
      kind: "stat";
      ground: Ground;
      glyphs?: readonly string[];
      figure: string;
      caption: string;
      /** Which scatter from `PANELS` in NewsBoard. Give each stat tile a different one. */
      panels: "a" | "b" | "c";
    }
  /** rogo's "Claude Opus 5 with Rogo" — full-bleed photo, floating white chip. */
  | {
      kind: "photo";
      src: string;
      alt: string;
      chip: string;
      /**
       * Vertical framing. Every source is taller than the 1.90476 slot, so `cover` locks
       * to width and only the SECOND value does anything here — the same trap recorded in
       * features/careers-page/CONTEXT.md, arriving from the opposite direction.
       */
      objectPosition?: string;
    };

export type NewsItem = {
  /**
   * STABLE JOIN KEY. Translations live in src/lib/i18n/{en,he}/news.ts and join on THIS,
   * never on the array index: the order below is deliberate, non-chronological and shifts
   * whenever a story is added, so an index join would silently mis-pair every card after
   * the insertion point.
   *
   * Slug-shaped, lowercase, and never reused or edited once shipped — renaming an id is
   * the same as deleting the story and adding a new one, and `tsc` will say so.
   */
  id: string;
  /** ISO date for <time dateTime>; rendered in the target's own M/D/YY format. */
  date: string;
  title: string;
  /** Short source name — also the photo chip's label. */
  source: string;
  url: string;
  category: NewsCategory;
  art: CardArt;
};

/** What the pill bar can be filtered to — the join key for `news.filters`. */
export type FilterKey = (typeof CATEGORIES)[number];

export const CATEGORIES: readonly ["All", ...NewsCategory[]] = [
  "All",
  "Models",
  "Business",
  "Security",
  "Policy",
];

export const NEWS_ITEMS = [
  /* ---- row 1 ---- */
  {
    id: "anthropic-riot-compute",
    date: "2026-08-11",
    title: "Anthropic locks 20-year, 191 MW compute deal with Riot for $9.1B",
    source: "The Block",
    url: "https://www.theblock.co/news/business/2026-08-10-riot-platforms-ai-deal-anthropic-411358",
    category: "Business",
    /* The one story that IS literally a partnership, so it gets rogo's literal partnership
       card. Riot Platforms has no verified mark — simple-icons' `riot` is Riot Games — so
       that half is type, which is exactly the fallback the glyph module documents. */
    art: {
      kind: "lockup",
      ground: "forest",
      joiner: "×",
      parts: [{ glyph: "anthropic", text: "Anthropic" }, { text: "Riot Platforms" }],
    },
  },
  {
    id: "south-australia-ai-commission",
    date: "2026-08-11",
    title: "South Australia unveils Australia's first AI royal commission",
    source: "SBS News",
    url: "https://www.sbs.com.au/news/article/australia-is-getting-its-first-major-inquiry-into-ai-its-starting-in-south-australia/xmpt3koiy",
    category: "Policy",
    /* Framed high: the flag mast is the subject and it sits in the top third. */
    art: {
      kind: "photo",
      src: "/news/australia-parliament.jpg",
      alt: "The flag mast of Australia's Parliament House against an open sky.",
      chip: "SBS News",
      objectPosition: "50% 25%",
    },
  },
  {
    id: "gpt56-cyber-chrome-zero-days",
    date: "2026-08-10",
    title: "OpenAI's new GPT-5.6-Cyber found two Chrome zero-days",
    source: "The Decoder",
    url: "https://the-decoder.com/openai-launches-gpt-5-6-cyber-to-help-defenders-find-vulnerabilities-before-attackers-do/",
    category: "Security",
    art: {
      kind: "stat",
      ground: "surface",
      glyphs: ["openai", "googlechrome"],
      figure: "2 zero-days",
      caption: "found in Chrome",
      panels: "b",
    },
  },

  /* ---- row 2 ---- */
  {
    id: "unitree-shanghai-ipo",
    date: "2026-08-11",
    title: "Unitree Shanghai IPO draws 2,700x retail oversubscription",
    source: "Crypto Briefing",
    url: "https://cryptobriefing.com/unitree-robotics-ipo-shanghai-demand/",
    category: "Business",
    art: {
      kind: "photo",
      src: "/news/shanghai-lujiazui.jpg",
      alt: "Towers of Shanghai's Lujiazui financial district, Shanghai Tower at right.",
      chip: "Crypto Briefing",
    },
  },
  {
    id: "meta-muse-glimmer",
    date: "2026-08-10",
    title: "Meta releases Muse Glimmer, a 30B agent model that runs on a laptop",
    source: "Meta AI",
    url: "https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model",
    category: "Models",
    art: {
      kind: "lockup",
      ground: "canvas",
      joiner: "/",
      parts: [{ glyph: "meta", text: "Meta" }, { text: "Muse Glimmer" }],
    },
  },
  {
    id: "h3c-apple-silicon",
    date: "2026-08-11",
    title: "Redis creator ships native MiniMax H3 runtime for Apple Silicon",
    source: "GitHub",
    url: "https://github.com/antirez/h3.c",
    category: "Models",
    /* Sits beside the Meta lockup on purpose: light canvas then forest-deep is the biggest
       tonal step the grid has, and putting two lockups side by side is something rogo's
       own grid does (its bottom row runs two forest cards adjacent). */
    art: {
      kind: "lockup",
      ground: "forest-deep",
      joiner: "/",
      parts: [
        { glyph: "github", text: "h3.c" },
        { glyph: "apple", text: "Apple Silicon" },
      ],
    },
  },

  /* ---- row 3 ---- */
  {
    id: "claude-riemann-zeta",
    date: "2026-08-10",
    title: "Claude improves a Riemann-zeta bound with 60 subagents and 31M tokens",
    source: "Anthropic",
    url: "https://www.anthropic.com/research/riemann-zeta",
    category: "Models",
    art: {
      kind: "stat",
      ground: "surface",
      glyphs: ["claude"],
      figure: "60 subagents",
      caption: "31M tokens",
      panels: "a",
    },
  },
  {
    id: "sonnet5-price-freeze",
    date: "2026-08-11",
    title: "Anthropic freezes Sonnet 5 at intro pricing, cancels Sept 1 hike",
    source: "Claude on X",
    url: "https://x.com/claudeai/status/2086891169217122586",
    category: "Business",
    art: {
      kind: "lockup",
      ground: "forest",
      joiner: "/",
      parts: [{ glyph: "claude", text: "Claude" }, { text: "Sonnet 5" }],
    },
  },
  {
    id: "singapore-gdp-forecast",
    date: "2026-08-11",
    title: "Singapore doubles 2026 GDP forecast, credits AI capex surge",
    source: "Xinhua",
    url: "https://english.news.cn/20260811/b132baebc0a545b6ade16557eed91fdd/c.html",
    category: "Business",
    /* Framed high to hold the skyline and drop the two walkers on the promenade. The
       Pexels licence bars using identifiable people in ways implying endorsement — the
       same rule that governed the /careers carousel, applied here by cropping. */
    art: {
      kind: "photo",
      src: "/news/singapore-marina-bay.jpg",
      alt: "Singapore's Marina Bay financial district seen across the water.",
      chip: "Xinhua",
      objectPosition: "50% 20%",
    },
  },

  /* ---- row 4 ---- */
  {
    id: "fed-warsh-ai-overhaul",
    date: "2026-08-11",
    title: "Fed's Warsh puts Andreessen and Chetty in charge of AI overhaul",
    source: "Axios",
    url: "https://www.axios.com/2026/08/10/kevin-warsh-fed-economy-rates-ai",
    category: "Policy",
    /* ⚠️ THIS ONE SHIPPED AS A PHOTOGRAPH FIRST AND WAS REJECTED — user, 2026-08-12:
       "i dont see the connection of the background and the topic". The reason generalises
       past this card, so it is worth keeping: every building photograph available either
       names the WRONG institution or names none at all.
         · the Capitol dome        -> Congress, not the Fed
         · "United States National Bank" carved facade -> a real commercial bank
         · Pexels' one "Fed building" hit (6534073) -> the TENNESSEE STATE OFFICE BUILDING,
           mislabelled upstream, with its own name carved across the entablature
         · an unnamed neoclassical facade -> connects to nothing, which is what was shipped
       A lockup states the connection in type instead of implying it through a metaphor the
       reader has to complete. No mark: the Federal Reserve has no verified artwork on
       simple-icons, so both halves are type — same as Riot Platforms on the first card. */
    art: {
      kind: "lockup",
      ground: "canvas",
      joiner: "/",
      parts: [{ text: "Federal Reserve" }, { text: "AI overhaul" }],
    },
  },
  {
    id: "tldv-meeting-leak",
    date: "2026-08-10",
    title: "AI notetaker tl;dv leaked 181K meetings, sat on the fix for six months",
    source: "bobdahacker",
    url: "https://bobdahacker.com/blog/tldv-hack",
    category: "Security",
    /* No marks: tl;dv has none on simple-icons and the source is one person's blog. The
       figure carries the card alone, which is what this template is for. */
    art: {
      kind: "stat",
      ground: "surface",
      figure: "181K meetings",
      caption: "six months unfixed",
      panels: "c",
    },
  },
  {
    id: "openai-ethics-chief-exit",
    date: "2026-08-11",
    title: "OpenAI's ethics chief Bakalar leaves after under a year",
    source: "Financial Times",
    url: "https://www.ft.com/content/e49dfb75-f841-4466-a577-f7aaff8779a0",
    category: "Policy",
    art: {
      kind: "photo",
      src: "/news/vacated-desk.jpg",
      alt: "An emptied office cubicle, its desk bare, beside a window.",
      chip: "Financial Times",
    },
  },
] as const satisfies readonly NewsItem[];

/**
 * Every story's id, as a LITERAL UNION derived from the array above — not hand-maintained.
 *
 * This is the type that makes a missing translation a build failure: `he/news.ts` is keyed by
 * `NewsItemId`, so adding a story here without adding its Hebrew is a `tsc` error rather than
 * an English headline on a Hebrew page. Adding the story is still the only edit English needs
 * — `en/news.ts` projects its copy straight out of this array.
 */
export type NewsItemId = (typeof NEWS_ITEMS)[number]["id"];
