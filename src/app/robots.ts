import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * `/robots.txt`, which did not exist before 2026-08-18 — the URL returned Next's 404 page.
 *
 * Its absence was NOT blocking anything: no robots.txt means "crawl everything", so the missing
 * file never kept Google away from the favicon or any page. It is added for the one thing it
 * does buy — a `Sitemap:` line, which is how a crawler discovers the sitemap without being told
 * about it in Search Console.
 *
 * ⚠️ `/api/` IS DISALLOWED, and that is the only rule here. `/api/contact` accepts the contact
 * form POST and `/api/models` returns pricing JSON for the ticker; neither is a page, neither
 * has anything to rank with, and a crawler spending its budget on them is pure waste. It is NOT
 * a security measure — robots.txt is a request, not an access control, and anything that must
 * not be reached needs a real check in the route.
 *
 * Everything else stays crawlable on purpose, including the legal pages: an accessibility
 * statement that a person cannot find in search is a worse outcome than a thin page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
