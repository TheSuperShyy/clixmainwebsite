/**
 * /accessibility — thin route shell. The page BODY lives in src/app/_routes/LegalRoute.tsx and is
 * shared by all six legal routes; this file only names the locale and the document.
 *
 * ⚠️ NO `robots` GUARD, deliberately — the content is the company's own published document and
 * a legal page is meant to be found. See the route body's header.
 *
 * ⚠️ `revalidate` must be a literal; Next rejects an imported binding.
 * ⚠️ Do NOT call getLocale() or getDict() here — the locale is not seeded until the body runs,
 *    which is why this passes a namespace NAME rather than a resolved document.
 */

import type { Metadata } from "next";
import LegalRoute from "@/app/_routes/LegalRoute";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "How Clix works to make this site accessible, the standards it follows, and how to reach the accessibility coordinator.",
};

export const revalidate = 300;

export default function Page() {
  return <LegalRoute locale="en" namespace="accessibility" />;
}
