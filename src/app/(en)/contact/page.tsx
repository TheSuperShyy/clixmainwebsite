/**
 * /contact — thin route shell.
 *
 * The page BODY lives in src/app/_routes/ContactRoute.tsx and is shared with /he/contact.
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
 * ⚠️ NO `robots` BLOCK, unlike /clix, /product, /company and /security. Every string on this
 * page is the company's own and there is nothing here awaiting review; the reasoning is in the
 * route body's header. Do not add one as part of unrelated work.
 *
 * The page is still statically prerendered — the form's only dynamic part is the POST it makes
 * at runtime, and that lives in src/app/api/contact/route.ts.
 */

import type { Metadata } from "next";
import ContactRoute from "@/app/_routes/ContactRoute";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you are planning to build. AI agents, WhatsApp automation, CRM, integrations and custom software.",
};

export const revalidate = 300;

export default function Page() {
  return <ContactRoute locale="en" />;
}
