/**
 * Hebrew copy for the 404 page. Added 2026-08-16 with src/app/_routes/NotFoundRoute.tsx.
 *
 * ⚠️ AUTHORED ×3, AND UNREAD BY A NATIVE SPEAKER. Every other namespace in this folder can
 * mark at least some strings SOURCED, because the real company site
 * (docs/reference/clixsolutions/) supplied them. This one cannot: neither that site nor the
 * clone target has a 404 page in any capture, so there is no captured voice to restore and
 * nothing to lift. These three strings are written in that voice, not taken from it.
 *
 * Same flag the /clix namespace and the testimonials keys already carry. It is the reason
 * this file is worth a human read before the page is ever linked to from outside.
 *
 * ⚠️ NO DASHES (2026-08-10), with the folder's usual carve-out for the Hebrew PREFIX HYPHEN
 * (`ב-WhatsApp`, `ה-AI`). Neither applies here: none of these three strings needs a prefix
 * hyphen, so this file contains no dash of any kind. The English title's dash became a comma
 * for the same rule and the Hebrew follows the same shape.
 *
 * Geresh `׳` / gershayim `״` over ASCII quotes is the standing orthography rule; no string
 * here needs either.
 */

import type { Translated } from "../shape";
import type { NotFoundDict } from "../en/notFound";

export const notFound: Translated<NotFoundDict> = {
  /* Latin digits in every locale. Hebrew uses Arabic numerals like English, and "404" is the
     status code besides — a name for a thing, not a quantity being read aloud. */
  code: "404",
  /* AUTHORED. "The page you were looking for does not exist, or does not exist yet."
     The second clause is the point, as in English: five of this site's own footer links
     still have no page behind them, so "yet" is the honest half of the sentence. */
  title: "העמוד שחיפשתם לא קיים, או שעדיין לא נוצר.",
  /* AUTHORED. "Back to the home page." Plural-you (שחיפשתם above, and the imperative here is
     neutral), matching the register the real site uses throughout — it addresses visitors as
     plural, never singular. */
  back: "חזרה לדף הבית",
};
