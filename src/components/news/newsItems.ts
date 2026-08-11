/**
 * The /news digest — REAL AI news, gathered 2026-08-11 (web search; aiweekly.co index
 * cross-read). Every headline, source and URL is genuine third-party reporting; nothing
 * here is invented, which is why /news ships without the robots block /clix carries.
 *
 * This file IS the content pipeline: refreshing the news means editing this array and
 * nothing else. Keep entries in the digest's shape — headline as the card title, the
 * source's own domain as the tile lockup, the ARTICLE as the link (cards link out, in a
 * new tab, because ours is a digest rather than a blog — see FEATURE.md deviations).
 *
 * Categories mirror rogo's five-pill bar in COUNT only (All + 4); the labels are how AI
 * news actually clusters, not rogo's PR taxonomy.
 */

export type NewsCategory = "Models" | "Business" | "Security" | "Policy";

export type NewsItem = {
  /** ISO date for <time dateTime>; rendered in the target's own M/D/YY format. */
  date: string;
  title: string;
  /** Short source name — the tile lockup text. */
  source: string;
  url: string;
  category: NewsCategory;
};

export const CATEGORIES: readonly ["All", ...NewsCategory[]] = [
  "All",
  "Models",
  "Business",
  "Security",
  "Policy",
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    date: "2026-08-11",
    title: "Anthropic locks 20-year, 191 MW compute deal with Riot for $9.1B",
    source: "The Block",
    url: "https://www.theblock.co/news/business/2026-08-10-riot-platforms-ai-deal-anthropic-411358",
    category: "Business",
  },
  {
    date: "2026-08-10",
    title: "Meta releases Muse Glimmer, a 30B agent model that runs on a laptop",
    source: "Meta AI",
    url: "https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model",
    category: "Models",
  },
  {
    date: "2026-08-10",
    title: "OpenAI's new GPT-5.6-Cyber found two Chrome zero-days",
    source: "The Decoder",
    url: "https://the-decoder.com/openai-launches-gpt-5-6-cyber-to-help-defenders-find-vulnerabilities-before-attackers-do/",
    category: "Security",
  },
  {
    date: "2026-08-11",
    title: "Fed's Warsh puts Andreessen and Chetty in charge of AI overhaul",
    source: "Axios",
    url: "https://www.axios.com/2026/08/10/kevin-warsh-fed-economy-rates-ai",
    category: "Policy",
  },
  {
    date: "2026-08-10",
    title: "Claude improves a Riemann-zeta bound with 60 subagents and 31M tokens",
    source: "Anthropic",
    url: "https://www.anthropic.com/research/riemann-zeta",
    category: "Models",
  },
  {
    date: "2026-08-10",
    title: "AI notetaker tl;dv leaked 181K meetings, sat on the fix for six months",
    source: "bobdahacker",
    url: "https://bobdahacker.com/blog/tldv-hack",
    category: "Security",
  },
  {
    date: "2026-08-11",
    title: "Anthropic freezes Sonnet 5 at intro pricing, cancels Sept 1 hike",
    source: "Claude on X",
    url: "https://x.com/claudeai/status/2086891169217122586",
    category: "Business",
  },
  {
    date: "2026-08-11",
    title: "Redis creator ships native MiniMax H3 runtime for Apple Silicon",
    source: "GitHub",
    url: "https://github.com/antirez/h3.c",
    category: "Models",
  },
  {
    date: "2026-08-11",
    title: "Unitree Shanghai IPO draws 2,700x retail oversubscription",
    source: "Crypto Briefing",
    url: "https://cryptobriefing.com/unitree-robotics-ipo-shanghai-demand/",
    category: "Business",
  },
  {
    date: "2026-08-11",
    title: "OpenAI's ethics chief Bakalar leaves after under a year",
    source: "Financial Times",
    url: "https://www.ft.com/content/e49dfb75-f841-4466-a577-f7aaff8779a0",
    category: "Policy",
  },
  {
    date: "2026-08-11",
    title: "Singapore doubles 2026 GDP forecast, credits AI capex surge",
    source: "Xinhua",
    url: "https://english.news.cn/20260811/b132baebc0a545b6ade16557eed91fdd/c.html",
    category: "Business",
  },
  {
    date: "2026-08-11",
    title: "South Australia unveils Australia's first AI royal commission",
    source: "SBS News",
    url: "https://www.sbs.com.au/news/article/australia-is-getting-its-first-major-inquiry-into-ai-its-starting-in-south-australia/xmpt3koiy",
    category: "Policy",
  },
];
