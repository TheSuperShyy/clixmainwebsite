/**
 * /terms — thin route shell. The page BODY lives in src/app/_routes/LegalRoute.tsx and is
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
  title: "Terms of Use",
  description: "The terms governing use of the Clix website, its content and its cookies.",
};

export const revalidate = 300;

export default function Page() {
  return <LegalRoute locale="en" namespace="terms" />;
}
