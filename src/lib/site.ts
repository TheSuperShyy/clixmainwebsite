/**
 * The site's own identity for search engines: its canonical origin, and the routes a crawler
 * should know about.
 *
 * Added 2026-08-18. Everything here exists because of one concrete problem — Google's result for
 * this site was serving a snapshot older than the favicon work, and the recrawl that fixes it
 * would ALSO have republished the metadata below, which was wrong.
 *
 * ⚠️ THE CANONICAL HOST IS NON-`www`, AND THAT IS MEASURED, NOT ASSUMED.
 * `https://www.clixsolutions.info/...` answers `307 Temporary Redirect` to
 * `https://clixsolutions.info/...`. Google treats the two hostnames as different sites, so
 * declaring the wrong one splits ranking signals between them and points canonicals at a URL
 * that only redirects away. Re-check with `curl -sI` before changing this.
 *
 * ⚠️ OVERRIDE IT PER DEPLOYMENT rather than editing the default. `clixsolutions.info` is where
 * this build is deployed today; the company also owns `clix-solution.com`, so a second
 * deployment is plausible and hardcoding would silently point its canonicals at the other site.
 */

/** No trailing slash — every consumer appends a path that starts with one. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://clixsolutions.info";

/**
 * Every indexable route, WITHOUT a locale prefix. The sitemap crosses these with the locale
 * list; `/` is the home page in both.
 *
 * ⚠️ THIS LIST IS HAND-MAINTAINED AND WILL DRIFT. Next has no build-time route manifest a
 * `sitemap.ts` can read, so a new page must be added here or it is simply absent from the
 * sitemap — which is a silent failure, not a build error. Checked against `npm run build`'s
 * route table on 2026-08-18.
 *
 * `/news` is present even though `NewsRoute` renders no footer; that is a layout quirk, not an
 * indexing one.
 */
export const ROUTES = [
  "/",
  "/product",
  "/company",
  "/security",
  "/clix",
  "/news",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
] as const;
