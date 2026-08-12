/**
 * English copy for /news. OWNED BY ONE AGENT — see features/i18n-rtl/FEATURE.md.
 *
 * THE NAMESPACE'S SHAPE IS DEFINED HERE, in the English file, and `dictionary.ts` only imports
 * it. That is what keeps this a single-owner file: growing the namespace never means editing a
 * file another agent also touches.
 *
 * ⚠️ EXTRACT VERBATIM. Every string moved here must be byte-identical to what the component
 * said before, including curly apostrophes (’ U+2019) and any em dash. The English render is
 * verified as a no-op, so a "tidied" string is a regression.
 *
 * ⚠️ NO JSX, NO HTML, NO MARKUP. Where a `<br>` or an inner `<span>` IS a colour boundary, the
 * element stays in the component and the two runs come here as separately-named keys.
 *
 * ARRAY TYPING, and it matters: use a fixed-length TUPLE where the count is layout (a grid's
 * cells, a nav's slots), and `readonly string[]` where the count is how the language happens to
 * WRAP. Pinning the second kind forbids the divergence Hebrew needs; leaving the first kind
 * loose lets a layout break through.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * ⚠️ THIS NAMESPACE HAS NO ARRAYS AT ALL, AND THAT IS THE POINT. Everything per-card is a
 * RECORD keyed by the story's own `id`, because `newsItems.ts` says in its own header that its
 * order is "DELIBERATE, NOT CHRONOLOGICAL, AND NOT A REPEATING PATTERN" and that "adding or
 * removing a story shifts every card after it". An index-keyed translation table would
 * silently re-pair every headline after an insertion; an id-keyed one cannot.
 *
 * ⚠️ AND THE ENGLISH HEADLINES ARE NOT WRITTEN HERE — THEY ARE PROJECTED OUT OF `newsItems.ts`.
 * That file's stated property is that "refreshing the news means editing this array and nothing
 * else", and copying the headlines into this file would end that property permanently. So this
 * module reads them; only `he/news.ts` is authored by hand. Two consequences worth knowing:
 *
 *   · the English render is verbatim BY CONSTRUCTION — there is no second copy to drift from
 *   · the dependency points from lib → components, which is backwards for this repo but is the
 *     price of keeping the pipeline. It is type-only in the client: NewsBoard already imports
 *     `newsItems.ts` directly, so nothing new reaches the browser bundle.
 * ────────────────────────────────────────────────────────────────────────────────────────────
 */

import {
  NEWS_ITEMS,
  type FilterKey,
  type NewsItemId,
} from "@/components/news/newsItems";

/* ── the per-card join ─────────────────────────────────────────────────────────────────── */

type Item = (typeof NEWS_ITEMS)[number];

/**
 * A card's translatable copy, SHAPED BY WHICH TILE TEMPLATE THE STORY GOT.
 *
 * Every card has a headline. Beyond that the three templates carry different prose, and the
 * shape follows the template rather than being a bag of optionals — an optional field would
 * let Hebrew omit a caption and fall back to English, which is exactly the silent failure this
 * whole scheme exists to prevent:
 *
 *   lockup · nothing else. Its two halves are ENTITY NAMES ("Anthropic", "Apple Silicon",
 *            "Sonnet 5") and stay Latin in every locale, same rule as `Clix` and `WhatsApp`
 *            in chrome. See the report's note on the one exception, "AI overhaul".
 *   stat   · `figure` + `caption`. Prose, and visible.
 *   photo  · `alt`. Prose, and read aloud, so an English alt on a Hebrew page is an a11y
 *            defect rather than a cosmetic one.
 */
type ItemCopy<Art> = Art extends { kind: "stat" }
  ? { readonly title: string; readonly figure: string; readonly caption: string }
  : Art extends { kind: "photo" }
    ? { readonly title: string; readonly alt: string }
    : { readonly title: string };

/**
 * Per-story copy, keyed by `NewsItem["id"]`.
 *
 * `NewsItemId` is derived from `NEWS_ITEMS` itself, so adding a story widens this key set and a
 * `he/news.ts` that has not caught up is a `tsc` error. Adding a STAT story additionally
 * requires a Hebrew `figure` and `caption`; adding a PHOTO story requires an `alt`. That is the
 * conditional type above doing the work.
 */
export type NewsItemsCopy = {
  readonly [K in NewsItemId]: ItemCopy<Extract<Item, { id: K }>["art"]>;
};

/** The union of all three card-copy shapes — what a caller gets from an un-narrowed lookup. */
export type NewsItemCopy = NewsItemsCopy[NewsItemId];

/* The return annotation is not decoration: it is what makes a missing field in `ItemCopy`
   above a compile error here, rather than a card that renders `undefined` in English. */
function copyOf(item: Item): NewsItemCopy {
  switch (item.art.kind) {
    case "stat":
      return {
        title: item.title,
        figure: item.art.figure,
        caption: item.art.caption,
      };
    case "photo":
      return { title: item.title, alt: item.art.alt };
    case "lockup":
      return { title: item.title };
  }
}

const draft: Record<string, NewsItemCopy> = {};
for (const item of NEWS_ITEMS) draft[item.id] = copyOf(item);

/**
 * THE ONE CAST IN THIS FILE, and it is the inexpressible part rather than a shortcut.
 *
 * `NewsItemsCopy` correlates each KEY with the shape its own story's art implies. Building that
 * correlation by iteration is beyond what TypeScript can check: the loop only knows it is
 * writing `NewsItemCopy` (the union) at a `string` key. The loop above is total over
 * `NEWS_ITEMS`, and `copyOf` is total over `art.kind`, so every key is present and every shape
 * is the one its `case` produced.
 *
 * If this is ever wrong, the symptom is `undefined` in an English card — which is why the
 * verification for this route greps `.next/server/app/news.html` for the headlines rather than
 * trusting the types alone.
 */
const items = draft as NewsItemsCopy;

/* ── the pill bar ──────────────────────────────────────────────────────────────────────── */

/**
 * Keyed by category, NOT a five-slot tuple, even though the count is layout (rogo's bar is
 * five pills and `CATEGORIES` pins that). The reason is that the pill's label and the FILTER
 * STATE are two different things: `NewsBoard` keeps the English category as its state value and
 * looks the label up, so the key has to be the category. `FilterKey` is derived from
 * `CATEGORIES`, so a sixth category is still a build failure in both locales.
 */
const filters: Record<FilterKey, string> = {
  All: "All",
  Models: "Models",
  Business: "Business",
  Security: "Security",
  Policy: "Policy",
};

export const news = {
  /**
   * The hero block. RENDERED BY `src/app/_routes/NewsRoute.tsx`, which this agent does not own
   * — the keys are declared here and ready; the route still has the strings inlined until the
   * orchestrator wires `getDict().news.hero` through.
   */
  hero: {
    title: "Updates",
    /* One line in the dictionary. The component's source breaks it across two lines of JSX,
       which JSX collapses to a single space — so this is the rendered string, not the source. */
    subtitle:
      "Daily signals on everything you need to know about AI: the models, the money, the risks and the rules.",
    cta: "Contact Media Team",
  },

  filters,

  a11y: {
    /** The pill bar's `role="tablist"` name. */
    filterTablist: "Filter news by category",
  },

  items,
} as const;

export type NewsDict = typeof news;
