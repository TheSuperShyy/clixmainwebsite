/**
 * i18n config — the locale type, the direction primitive, and the path helpers.
 *
 * NO React in this file, deliberately: it is imported from server components, client
 * components, and the route shells alike. Anything that needs a hook lives in
 * LocaleProvider.tsx; anything that needs the request store lives in server.ts.
 *
 * WHY THERE IS NO MIDDLEWARE (2026-08-12). English keeps its bare paths and Hebrew lives
 * under `/he`, served by two route groups — `src/app/(en)/**` and `src/app/he/**` — not by a
 * `[lang]` segment behind a rewrite. A rewrite was the first design and was rejected on
 * evidence: Next sets `x-nextjs-rewritten-path`, so under a rewrite `usePathname()` can return
 * the INTERNAL path (`/en/product`) rather than the public one. Both `LocaleToggle` (which
 * builds the counterpart path) and `ViewTransitions.tsx` (whose commit resolver compares
 * pathnames) sit on `usePathname()`, so a rewrite aims a hazard at the two files this repo
 * stabilised on 2026-08-12. Route groups contribute nothing to the URL, so the bare English
 * paths survive by construction, with no middleware in front of a site that is otherwise a
 * CDN plus one function.
 *
 * The optional catch-all `[[...locale]]` was not a judgement call — it does not build.
 * `validate-app-paths.js` throws E913 ("Optional catch-all must be the last part of the URL")
 * for any segment after it, which `product/page.tsx` is.
 */

export const LOCALES = ["en", "he"] as const;
export type Locale = (typeof LOCALES)[number];

/** English is the default, and the default locale is the one with UNPREFIXED urls. */
export const DEFAULT_LOCALE: Locale = "en";

export type Direction = "ltr" | "rtl";

export const DIRECTION: Record<Locale, Direction> = { en: "ltr", he: "rtl" };

/** `<html lang>`. Separate from `Locale` so a regional tag (`he-IL`) can land here later
    without changing every url in the app. */
export const HTML_LANG: Record<Locale, string> = { en: "en", he: "he" };

/** What the toggle prints. Each label is written IN its own language on purpose — see
    LocaleToggle.tsx for why that is the accessibility win and not a styling choice. */
export const LOCALE_LABEL: Record<Locale, string> = { en: "English", he: "עברית" };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function direction(locale: Locale): Direction {
  return DIRECTION[locale];
}

export function isRtl(locale: Locale): boolean {
  return DIRECTION[locale] === "rtl";
}

/**
 * THE DIRECTION PRIMITIVE. `+1` in ltr, `-1` in rtl.
 *
 * It multiplies PHYSICAL-AXIS DELTAS and nothing else — a `translateX` target, a
 * `scrollBy({left})` delta, the sign of a drag-commit comparison. It never multiplies an
 * index, a magnitude, a velocity, or a threshold: "previous slide" is index − 1 in every
 * language, and a fitted velocity constant has no direction.
 *
 * Because it is `+1` in English, every expression it appears in is byte-identical in the LTR
 * build — which is what lets the whole RTL pass be verified as a no-op against the existing
 * block-diff baseline.
 */
export function dirSign(locale: Locale): 1 | -1 {
  return DIRECTION[locale] === "rtl" ? -1 : 1;
}

/* ────────────────────────────────────────────────────────────────────────────────────────
   PATH HELPERS

   Pure string functions, no React, so they are unit-testable and usable from the route
   shells. The assertions in the block comment above each one are the spec — they are
   covered by src/lib/i18n/config.test.ts, because one of them is load-bearing enough that a
   comment is not sufficient (see localeHref).
   ──────────────────────────────────────────────────────────────────────────────────────── */

const PREFIX_RE = new RegExp(`^/(${LOCALES.filter((l) => l !== DEFAULT_LOCALE).join("|")})(?=$|[/#?])`);

/**
 * Prefix an app-internal href for `locale`. Identity for the default locale, always.
 *
 *   localeHref("/",              "he") === "/he"                 <- NOT "/he/"
 *   localeHref("/#testimonials", "he") === "/he#testimonials"    <- NOT "/he/#testimonials"
 *   localeHref("/product",       "he") === "/he/product"
 *   localeHref("/product#x",     "he") === "/he/product#x"
 *   localeHref("#contact",       "he") === "#contact"            <- bare hash, untouched
 *   localeHref("mailto:a@b.c",   "he") === "mailto:a@b.c"
 *   localeHref("https://x.y",    "he") === "https://x.y"
 *   localeHref("//cdn.x/y",      "he") === "//cdn.x/y"           <- protocol-relative
 *   localeHref("/he/product",    "he") === "/he/product"         <- idempotent
 *
 * ⚠️ THE TRAILING-SLASH COLLAPSE IS LOAD-BEARING, and it is the highest-risk line in the
 * whole locale change. `AppLink` decides "is this hash pointing at the route I am already
 * on?" by comparing `href.split("#")[0]` against `usePathname()`. On `/he`, `usePathname()`
 * is `"/he"`. If this function returned `"/he/#testimonials"` the comparison would be
 * `"/he/" !== "/he"`, the same-page-scroll guard would MISS, and every "Customers" click on a
 * Hebrew page would crossfade the whole document over what is only a scroll — precisely the
 * failure AppLink's own header comment was written to prevent. Hence `path === "/" ? ""`.
 */
export function localeHref(href: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return href;
  /* Not an app-internal path: bare `#hash`, `mailto:`, `https:`, and protocol-relative
     `//cdn` all leave untouched. The `//` test must come first — it starts with `/`. */
  if (!href.startsWith("/") || href.startsWith("//")) return href;

  const prefix = `/${locale}`;
  if (PREFIX_RE.test(href)) return href; // already prefixed; idempotent

  const hash = href.indexOf("#");
  const query = href.indexOf("?");
  const cut = [hash, query].filter((i) => i !== -1).sort((a, b) => a - b)[0] ?? -1;
  const path = cut === -1 ? href : href.slice(0, cut);
  const rest = cut === -1 ? "" : href.slice(cut);

  return `${prefix}${path === "/" ? "" : path}${rest}`;
}

/**
 * Drop a locale prefix, yielding the default-locale path.
 *
 *   stripLocale("/he/product") === "/product"
 *   stripLocale("/he")         === "/"
 *   stripLocale("/product")    === "/product"
 */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(PREFIX_RE, "");
  return stripped === "" ? "/" : stripped;
}

/** Which locale a public pathname belongs to. */
export function localeFromPathname(pathname: string): Locale {
  const match = PREFIX_RE.exec(pathname);
  return match && isLocale(match[1]) ? match[1] : DEFAULT_LOCALE;
}

/**
 * The same page in another locale — what the nav toggle links to.
 *
 *   switchLocalePath("/product",    "he") === "/he/product"
 *   switchLocalePath("/he/product", "en") === "/product"
 *   switchLocalePath("/",           "he") === "/he"
 *   switchLocalePath("/he",         "en") === "/"
 */
export function switchLocalePath(pathname: string, to: Locale): string {
  return localeHref(stripLocale(pathname), to);
}
