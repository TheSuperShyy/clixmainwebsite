/**
 * English copy for /careers. OWNED BY ONE AGENT — see features/i18n-rtl/FEATURE.md.
 *
 * THE NAMESPACE'S SHAPE IS DEFINED HERE, in the English file, and `dictionary.ts` only imports
 * it. That is what keeps this a single-owner file: growing the namespace never means editing a
 * file another agent also touches.
 *
 * ⚠️ EXTRACT VERBATIM. Every string moved here is byte-identical to what the component said
 * before, including the curly apostrophe (’ U+2019) in `about.body[0]` — the only non-ASCII
 * byte in this namespace. The English render is verified as a no-op, so a "tidied" string is a
 * regression. All sixteen were pulled out of the components with a script and re-asserted
 * against the pre-move sources afterwards rather than retyped.
 *
 * ⚠️ NO JSX, NO HTML, NO MARKUP. Where a `<br>` or an inner `<span>` IS a colour boundary, the
 * element stays in the component and the two runs come here as separately-named keys. That is
 * exactly the case for `about.titleInk` / `about.titleMuted` — see CareersAbout.tsx's TRAP 1.
 *
 * ⚠️ THE SHAPE IS AN EXPLICIT `interface`, NOT `typeof careers` OVER AN `as const` OBJECT, and
 * that is a CORRECTNESS FIX rather than a style preference. `dictionary.ts` declares
 * `careers: typeof enCareers`. Under `as const`, `Dict["careers"]` becomes a tree of string
 * LITERALS, while `he/careers.ts` is `Translated<CareersDict>`, whose leaves shape.ts widens to
 * `string`. `string` is not assignable to `"Join us in …"`, so `DICTIONARIES` stops satisfying
 * `Record<Locale, Dict>` and the build fails with TS2322 the moment either file holds a real
 * string. The stubs type-check today only because they are empty. Probed under this repo's own
 * tsc, not reasoned: the `as const` form errors, this one does not.
 *
 * Annotating the const with an interface widens the leaves while KEEPING tuple arity, so all
 * three guarantees shape.ts advertises still bite. Also probed: wrong tuple length → TS2322,
 * missing key → TS2741, extra key → TS2353. It is the same shape `ChromeDict` already uses; the
 * only difference is that this interface lives here instead of in `dictionary.ts`, which is
 * what keeps the file single-owner.
 *
 * ARRAY TYPING. A fixed-length TUPLE where the count is layout, `readonly string[]` where the
 * count is how the language happens to WRAP. This namespace has NO array of the second kind:
 * the `<h1>` is one string with `text-wrap: balance` making every break, and the photo alts are
 * an 8-key RECORD rather than an array, so their count is enforced by the key set instead.
 *
 * WHERE EACH STRING CAME FROM (line numbers as of the pre-move files):
 *   CareersHero.tsx:129           -> hero.headline
 *   CareersAbout.tsx:105,106      -> about.titleInk, about.titleMuted
 *   CareersAbout.tsx:110,111      -> about.body[0], about.body[1]
 *   CareersGallery.tsx:214,215    -> gallery.roleDescription, gallery.label
 *   CareersGallery.tsx:266        -> gallery.controlsLabel
 *   careersPhotos.ts (8 x `alt`)  -> gallery.alt[<photo id>]
 *
 * AND WHAT IS DELIBERATELY *NOT* HERE. Three of CareersGallery's strings are shared chrome and
 * already exist in both locales, so restating them would create a second source of truth for
 * the same words:
 *   `aria-label="Previous"` / `"Next"` -> chrome.a11y.previous / chrome.a11y.next
 *   `${index + 1} of ${PHOTOS.length}` -> chrome.a11y.slideOfTotal, through `interpolate()`.
 *      format.ts's own header already names careers/CareersGallery.tsx as one of exactly two
 *      interpolated strings in the repo, so that template was written FOR this call site.
 */

import type { CareersPhotoId } from "@/components/careers/careersPhotos";

export interface CareersDict {
  readonly hero: {
    /**
     * The whole `<h1>`, as ONE string and deliberately not as hard lines.
     * `text-wrap: balance` applies at EVERY tier in this block (CareersHero.tsx), so every
     * break is the UA's and there is nothing here for a locale to re-split. The English
     * sentence is the user's own, chosen verbatim on 2026-08-12 over four measured
     * alternatives — read that file's header before touching it.
     */
    readonly headline: string;
  };

  readonly about: {
    /** `<h3>` line 1, rendered `ink`. */
    readonly titleInk: string;
    /**
     * `<h3>` line 2, rendered `muted`. The `<br>` between the two IS the colour boundary, and
     * the split falls after the WHOLE first line, not where it visually looks. Both runs live
     * in ONE `<h3>`: as sibling elements they would wrap independently and break the sentence
     * across the colour change. Neither fragment may wrap on its own, in any locale.
     */
    readonly titleMuted: string;
    /**
     * The two body paragraphs. TUPLE, not `readonly string[]`: the count is the block's
     * structure, not line fitting. Two `<p>`s are what the `[&>p+p]:mt-5` paragraph-spacing
     * rule was measured against, and a locale supplying one or three would change the column's
     * height silently. How many LINES each paragraph wraps to is free to differ per locale, and
     * does — see CareersAbout.tsx's note on the section-height row.
     */
    readonly body: readonly [string, string];
  };

  readonly gallery: {
    /** `aria-label` on the carousel group. */
    readonly label: string;
    /** `aria-roledescription`. A localisable word, not the ARIA `role` token. */
    readonly roleDescription: string;
    /** `aria-label` on the controls `<fieldset>`. */
    readonly controlsLabel: string;
    /**
     * The eight photo `alt` texts, KEYED BY PHOTO ID rather than by array index, so reordering
     * or reshuffling `PHOTOS` can never silently pair a description with the wrong photograph.
     * The id union lives with the photo table in `careersPhotos.ts`, because the ids identify
     * ASSETS; adding a ninth photograph is therefore a build error HERE, in the file that owes
     * it a description, which is where that error belongs.
     */
    readonly alt: { readonly [K in CareersPhotoId]: string };
  };
}

export const careers: CareersDict = {
  hero: {
    headline: "Join us in engineering the core of next-generation software.",
  },

  about: {
    titleInk: "Automating The Work",
    titleMuted: "Nobody Should Be Doing",
    body: [
      "Clix builds the quiet mechanisms that run modern businesses: AI agents that answer and qualify in your customers’ own language, WhatsApp assistants that sell where people already are, CRM work, and the integrations that hold all of it together.",
      "We are a small team in Tel Aviv, and small is the point. There is no queue to get your work in front of a client, and no layer between you and the person whose afternoon you just gave back.",
    ],
  },

  gallery: {
    label: "Life at clix",
    roleDescription: "carousel",
    controlsLabel: "Carousel pagination controls",
    alt: {
      team01: "A team member working at a desk.",
      team02: "Team members playing a sport together.",
      team03: "Hands typing on a laptop.",
      team04: "An open-plan office.",
      team05: "A small group at a whiteboard.",
      team06: "A team member on a video call.",
      team07: "A shared coffee break.",
      team08: "A team social event outdoors.",
    },
  },
};
