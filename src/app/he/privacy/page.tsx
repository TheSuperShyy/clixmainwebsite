/**
 * /he/privacy — thin route shell.
 *
 * The page BODY lives in src/app/_routes/LegalRoute.tsx and is shared by all six legal routes.
 *
 * ⚠️ THIS ROUTE SERVES THE AUTHORITATIVE TEXT. `he/privacy.ts` is the source the policy was
 * published in. If the two ever disagree this one is right — though the page no longer SAYS so:
 * the "Hebrew version is binding" note was removed at the user's request on 2026-08-16.
 *
 * ⚠️ No `robots` guard, and never `getLocale()` in `metadata` — same two rules as the English
 * shell; read its header for why.
 */

import type { Metadata } from "next";
import LegalRoute from "@/app/_routes/LegalRoute";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  description:
    "כיצד Clix אוספת, משתמשת, שומרת ומעבירה מידע אישי, וכיצד ניתן לממש את הזכויות שלכם לגביו.",
};

export const revalidate = 300;

export default function Page() {
  return <LegalRoute locale="he" namespace="privacy" />;
}
