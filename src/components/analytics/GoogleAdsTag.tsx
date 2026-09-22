import { GADS_ID } from "@/lib/gads";

/* The Google tag (gtag.js) for the Ads account, on every page, in `<head>`.
 *
 * Installed 2026-09-22 from the snippet the user supplied, byte-for-byte: the async loader
 * for `gtag/js?id=AW-…` followed by the four-line bootstrap (`dataLayer`, `gtag()`, `js`,
 * `config`). Mounted once in EACH root layout — `(en)/layout.tsx` and `he/layout.tsx` — inside
 * an explicit `<head>`, because the two trees share no ancestor; forgetting one would leave
 * that locale untagged.
 *
 * ⚠️ RAW `<script>` ELEMENTS, NOT `next/script`, AND THAT WAS MEASURED. The first cut used
 * `<Script strategy="beforeInteractive">`. Served HTML (curl, 2026-09-22): the loader did land
 * in `<head>`, but Next rendered the INLINE bootstrap as a `self.__next_s.push(...)` entry at
 * the top of `<body>` — it runs before hydration, so gtag still worked, but it is not "the
 * snippet immediately after the opening <head> tag" the user asked for, and Google's tag
 * checker reads the markup literally. Plain elements inside the layout's `<head>` are what the
 * App Router actually emits verbatim. `dangerouslySetInnerHTML` carries no visitor input: the
 * only interpolation is `GADS_ID`, a constant.
 *
 * Nothing else about the tag lives here: the id and the conversion call are in `lib/gads.ts`.
 * No client state and no consent logic — see the note there. */
export default function GoogleAdsTag() {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${GADS_ID}');
`,
        }}
      />
    </>
  );
}
