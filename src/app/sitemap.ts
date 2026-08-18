import type { MetadataRoute } from "next";
import { SITE_URL, ROUTES } from "@/lib/site";
import { localeHref } from "@/lib/i18n/config";

/**
 * `/sitemap.xml`, which did not exist before 2026-08-18 — the URL returned Next's 404 page.
 *
 * WHY IT MATTERS HERE SPECIFICALLY. Google was serving a search result older than the favicon
 * work, and the site gave it no sitemap, so every route had to be found by following links.
 * `/news` in particular is linked from the footer, and `/news` is the one route that renders no
 * footer — a crawler landing there finds no way onward. A sitemap removes that dependency.
 *
 * ⚠️ BOTH LOCALES, WITH `alternates.languages` ON EACH ENTRY. Without the hreflang pairs, `/` and
 * `/he` look like two sites saying the same thing in different words, and Google picks one and
 * suppresses the other. With them it understands one site, two languages, and serves each to the
 * right reader.
 *
 * ⚠️ NO `lastModified`. The honest value is the deploy time, which would mark all twenty URLs as
 * changed on every deploy regardless of whether their content moved — a signal Google learns to
 * distrust. Omitting it is better than a field that is technically present and semantically
 * false. `priority` is omitted for the same reason: it is self-declared and Google ignores it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((route) => {
    const en = `${SITE_URL}${localeHref(route, "en")}`;
    const he = `${SITE_URL}${localeHref(route, "he")}`;
    const languages = { en, he, "x-default": en };

    return [
      { url: en, alternates: { languages } },
      { url: he, alternates: { languages } },
    ];
  });
}
