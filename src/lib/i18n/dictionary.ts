/**
 * The dictionary's SHAPE. Both locales implement these interfaces, so a missing string is a
 * `tsc` error rather than an English word on a Hebrew page.
 *
 * WHY EXPLICIT INTERFACES AND NOT JUST `Translated<typeof en>`. Because two kinds of array
 * live in here and they need OPPOSITE guarantees, which one mechanism cannot give:
 *
 *   · STRUCTURAL arrays, where the count IS layout. Nav's links are a fixed slot count — the
 *     count is layout, not content; the footer has exactly four columns. These are typed as
 *     fixed-length TUPLES, so a Hebrew dictionary that supplied the wrong number of nav labels
 *     fails the build instead of silently breaking the row.
 *   · LINE-FITTING arrays, where the count is a consequence of how the language WRAPS. The
 *     footer tagline sets three runs in English and two in Hebrew — the real site closes on
 *     "תוכנה שעובדת, תוצאות שמדברות." and that phrase does not split three ways.
 *     These are typed `readonly string[]`, so each locale chooses its own count.
 *
 * Pinning the second kind would forbid the exact divergence Hebrew requires; leaving the first
 * kind loose would let a layout break through. Hence the split, stated per field.
 *
 * ⚠️ NO JSX, NO HTML, AND NO MARKUP OF ANY KIND IN A DICTIONARY FILE. Where a `<br>` or an
 * inner `<span>` IS a colour boundary — and there are six of those on this site — the element
 * stays in the component and only the text runs move here, as separately-named keys. That is
 * how the repo already stores them (`HEADLINE_A`/`HEADLINE_B`, `TITLE_INK`/`TITLE_MUTED`), so
 * this is a rename, not a restructure.
 */

import type { Locale } from "./config";
import type { Translated } from "./shape";
import { chrome as enChrome } from "./en/chrome";
import { chrome as heChrome } from "./he/chrome";
import { home as enHome } from "./en/home";
import { home as heHome } from "./he/home";
import { product as enProduct } from "./en/product";
import { product as heProduct } from "./he/product";
import { security as enSecurity } from "./en/security";
import { security as heSecurity } from "./he/security";
import { company as enCompany } from "./en/company";
import { company as heCompany } from "./he/company";
import { news as enNews } from "./en/news";
import { news as heNews } from "./he/news";
import { clix as enClix } from "./en/clix";
import { clix as heClix } from "./he/clix";

/* ── shared chrome: rendered on every one of the 6 routes ──────────────────────────────── */

/** Six slots since 2026-08-13, seven before it. The count is layout — see Nav.tsx's own note.
    Tuple, deliberately: a locale that supplies the wrong number fails the build. */
export type NavLabels = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
];

export interface ChromeDict {
  readonly nav: {
    readonly labels: NavLabels;
    readonly cta: string;
  };
  readonly footer: {
    /** Four columns. Structural — tuple. */
    readonly groupTitles: readonly [string, string, string, string];
    readonly links: {
      readonly services: string;
      readonly industries: string;
      readonly work: string;
      readonly about: string;
      readonly insights: string;
      readonly playground: string;
      readonly terms: string;
      readonly privacy: string;
      readonly accessibility: string;
      readonly letsStart: string;
      readonly email: string;
      readonly instagram: string;
      readonly whatsapp: string;
    };
    /**
     * The closing headline, as HARD LINES of PHONE-SPLIT RUNS.
     *
     * Outer array = lines separated by a `<br>` at every tier.
     * Inner array = runs separated by a `<br className="tablet:hidden">`, i.e. an extra break
     * only the phone tier draws.
     *
     * English: [["Software", "that works,"], ["results that speak."]] — 2 lines wide, 3 on
     * phone, which is the target's own {A}<br phone>{B}<br>{C} shape.
     * Hebrew:  [["תוכנה שעובדת,"], ["תוצאות שמדברות."]] — 2 lines at every tier, because the
     * real site's own footer sets it that way and there is no third run to gate.
     *
     * Both dimensions are `readonly string[]`, not tuples: this is line fitting, so the count
     * is the language's business.
     */
    readonly tagline: readonly (readonly string[])[];
    readonly cta: string;
    readonly copyrightYear: string;
    /** The holder. Stays "clix" in every locale — it is a name, not a word. */
    readonly copyrightHolder: string;
    readonly mapTitle: string;
  };
  readonly a11y: {
    readonly home: string;
    readonly openMenu: string;
    readonly closeMenu: string;
    readonly mainLandmark: string;
    /** `interpolate()` template. Placeholder: {name} */
    readonly playTestimonial: string;
    /** `interpolate()` template. Placeholders: {n} {total} */
    readonly slideOfTotal: string;
    readonly previous: string;
    readonly next: string;
    /** Names the toggle's purpose for the segmented fallback; unused by the single-link form. */
    readonly languageSwitcher: string;
    /* The banner ticker's sr-only sentence, in three parts, because it interleaves fixed
       connectives with live API numbers. Requested by the agent that owns ModelTicker, which
       deliberately did not invent them in its own file. `interpolate()` templates. */
    readonly tickerIntro: string;
    /** Placeholders: {model} {in} {out} */
    readonly tickerRow: string;
    /** Placeholder: {ctx} */
    readonly tickerContext: string;
  };
}

/* ── the whole dictionary ─────────────────────────────────────────────────────────────────
   Page namespaces mirror `src/components/` exactly, so the agent that owns
   `src/components/product/*` owns `en/product.ts` + `he/product.ts` and collides with nobody.

   They are added here as each one lands. `chrome` is first because it is the only namespace
   every route renders, and because it is what makes the toggle itself legible. */

/* ⚠️ EVERY PAGE FIELD IS `Translated<typeof en…>`, NOT `typeof en…`.
   The English namespaces are authored `as const`, so `typeof enHome` is a tree of string
   LITERALS — `"The Team Behind the Systems"`, not `string`. Declaring `Dict` with the raw
   `typeof` would make the ENGLISH dictionary the only value that can ever satisfy it, and every
   Hebrew string would be a type error reading "Type 'string' is not assignable to type
   '\"The Team Behind the Systems\"'". `Translated<T>` widens the leaves while preserving the key
   set and the tuple arity, which is exactly the contract wanted: a missing key, an extra key or
   a wrong tuple length still fails, but a different string does not. */
export interface Dict {
  readonly chrome: ChromeDict;
  readonly home: Translated<typeof enHome>;
  readonly product: Translated<typeof enProduct>;
  readonly security: Translated<typeof enSecurity>;
  readonly company: Translated<typeof enCompany>;
  readonly news: Translated<typeof enNews>;
  readonly clix: Translated<typeof enClix>;
}

/** Every namespace except `chrome` — i.e. the ones scoped to a single route. */
export type PageKey = Exclude<keyof Dict, "chrome">;

export const DICTIONARIES: Record<Locale, Dict> = {
  en: {
    chrome: enChrome,
      home: enHome,
      product: enProduct,
      security: enSecurity,
      company: enCompany,
      news: enNews,
      clix: enClix,
  },
  he: {
    chrome: heChrome,
      home: heHome,
      product: heProduct,
      security: heSecurity,
      company: heCompany,
      news: heNews,
      clix: heClix,
  },
};
