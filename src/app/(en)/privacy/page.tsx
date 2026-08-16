/**
 * /privacy — thin route shell.
 *
 * The page BODY lives in src/app/_routes/PrivacyRoute.tsx and is shared with /he/privacy. Only
 * the locale literal, `metadata` and `revalidate` belong here.
 *
 * ⚠️ NO `robots` GUARD, deliberately — see the route body's header. The content is the
 * company's own published policy, and a privacy policy is meant to be found.
 *
 * ⚠️ `revalidate` must be a literal; Next rejects an imported binding. Keep it in step with
 * src/lib/models.ts by hand, as every other shell does.
 *
 * ⚠️ Do NOT call getLocale() from `metadata`. This file knows its locale as a literal.
 */

import type { Metadata } from "next";
import PrivacyRoute from "@/app/_routes/PrivacyRoute";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Clix collects, uses, stores and shares personal information, and how to exercise your rights over it.",
};

export const revalidate = 300;

export default function Page() {
  return <PrivacyRoute locale="en" />;
}
