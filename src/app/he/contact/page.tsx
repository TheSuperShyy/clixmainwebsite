/**
 * /he/contact — thin route shell.
 *
 * The page BODY lives in src/app/_routes/ContactRoute.tsx and is shared with /contact.
 * Only three things belong in a shell: the locale literal, `metadata`, and `revalidate`.
 *
 * ⚠️ `metadata` and `revalidate` are declared HERE and never re-exported from _routes/.
 * `revalidate` must be a literal — Next statically analyses segment configs at build time and
 * rejects an imported binding ("Invalid segment configuration export detected"), so it cannot
 * be `REVALIDATE_SECONDS` even though src/lib/models.ts is where that number is defined. Keep
 * them in step by hand.
 *
 * ⚠️ Do NOT call getLocale() from `metadata`. Metadata resolution is a separate pass with no
 * guarantee of sharing the render's cache scope. This file knows its locale as a literal.
 *
 * ⚠️ NO `robots` BLOCK — see the English twin and the route body's header.
 *
 * The title and the description are SOURCED from docs/reference/clixsolutions/pages/contact.html
 * rather than translated: "צרו קשר" is that page's own title stem and eyebrow, and the
 * description follows its subhead. This is the one route where the Hebrew metadata is the
 * original and the English is the rendering of it.
 */

import type { Metadata } from "next";
import ContactRoute from "@/app/_routes/ContactRoute";

export const metadata: Metadata = {
  title: "צרו קשר",
  description:
    "ספרו לנו מה אתם מתכננים לבנות. סוכני AI, אוטומציות WhatsApp, מערכות CRM, אינטגרציות ותוכנה מותאמת אישית.",
};

export const revalidate = 300;

export default function Page() {
  return <ContactRoute locale="he" />;
}
