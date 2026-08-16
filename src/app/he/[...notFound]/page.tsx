/**
 * THE HEBREW CATCH-ALL. Matches any path under `/he` that no real route claimed, and hands
 * off to `he/not-found.tsx` — which renders below src/app/he/layout.tsx and therefore in
 * Hebrew, right-to-left, with the Hebrew chrome.
 *
 * Read the English twin's header for WHY a catch-all is needed at all beside a not-found
 * file; the reasoning is identical and is not repeated here. In short: a not-found.tsx is a
 * boundary, only a ROOT not-found catches unmatched URLs, this app cannot have a root one,
 * so `notFound()` has to be called by something.
 *
 * This half is the one that actually pays for the arrangement. Without it, `/he/services`
 * fell through to the same built-in English 404 as the bare paths, answering a Hebrew reader
 * in a language and a direction the rest of their session was not in.
 *
 * The param is deliberately not read — see the twin.
 */

import { notFound } from "next/navigation";

export default function CatchAll(): never {
  notFound();
}
