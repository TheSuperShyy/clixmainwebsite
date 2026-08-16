/**
 * /he/privacy — thin route shell.
 *
 * The page BODY lives in src/app/_routes/PrivacyRoute.tsx and is shared with /privacy.
 *
 * ⚠️ THIS ROUTE SERVES THE AUTHORITATIVE TEXT. `he/privacy.ts` is the source the policy was
 * published in; the English route carries an on-page note saying so. If the two ever disagree,
 * this one is right.
 *
 * ⚠️ No `robots` guard, and never `getLocale()` in `metadata` — same two rules as the English
 * shell; read its header for why.
 */

import type { Metadata } from "next";
import PrivacyRoute from "@/app/_routes/PrivacyRoute";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  description:
    "כיצד Clix אוספת, משתמשת, שומרת ומעבירה מידע אישי, וכיצד ניתן לממש את הזכויות שלכם לגביו.",
};

export const revalidate = 300;

export default function Page() {
  return <PrivacyRoute locale="he" />;
}
