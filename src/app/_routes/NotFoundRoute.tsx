/**
 * THE 404 BODY — shared by src/app/(en)/not-found.tsx and src/app/he/not-found.tsx.
 *
 * Added 2026-08-16. Until then this repo had NO not-found file anywhere, so every unmatched
 * path fell to Next's built-in 404: unstyled, no nav, no footer, no way back, and crucially
 * NO LOCALE — `/he/anything` answered a Hebrew reader with an English sentence on a white
 * page. That was reachable from the site's own footer, which had eight dead links at the time
 * (five now; see Footer.tsx's own note).
 *
 * ⚠️ THIS FILE MUST NOT BE PROMOTED TO `src/app/not-found.tsx`. There is no root layout at
 * `src/app/` — the two root layouts live at `(en)/` and `he/` — and Next only injects its own
 * layout for `/_not-found` while that file is the BUILT-IN one. Adding a custom root
 * not-found stops the injection and the build exits 1 with "doesn't have a root layout". The
 * warning is recorded in (en)/layout.tsx and is why this is per-locale. Per-locale is also
 * what you want on its own merits: it is the only arrangement in which the Hebrew 404 is
 * Hebrew, right-to-left, with the Hebrew chrome around it.
 *
 * WHAT NEXT WILL AND WILL NOT ROUTE HERE. `(en)/not-found.tsx` catches unmatched paths at the
 * root — `/services`, `/terms` — and `he/not-found.tsx` catches them under `/he`. Both also
 * answer an explicit `notFound()` call from a page in their segment, though no page makes one
 * today.
 *
 * ONE BAND, `data-nav-theme="dark"`. Nav walks `[data-nav-theme]` in document order and picks
 * whichever element spans its bottom edge; a page whose <main> declares nothing leaves the
 * bar reading a stale theme from the route before it. One full-height dark band is the
 * cheapest way to be unambiguous, and it matches what a visitor arriving from the dark footer
 * has just been looking at. `min-h-svh` (not `vh`) so the mobile URL bar cannot push the
 * footer into view over the fold and then yank it away.
 */

import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import AppLink from "@/components/ui/AppLink";
import ScrollToTopOnRoute from "@/components/ui/ScrollToTopOnRoute";
import { fetchModels } from "@/lib/models";
import { HTML_LANG, DIRECTION, type Locale } from "@/lib/i18n/config";
import { seedLocale, getDict } from "@/lib/i18n/server";

export default async function NotFoundRoute({ locale }: { locale: Locale }) {
  /* Seeded here as well as in the root layout, per the standing double-seed rule — this body
     is the direct parent of Nav and Footer, both of which read the dictionary off the request
     store, so the order of layout execution can never matter. */
  seedLocale(locale);

  /* Fetched exactly as every other route fetches it, so the banner ticker renders here too
     and the page reads as part of the site rather than as an error screen. `fetchModels`
     swallows its own failures and returns `[]`, and Nav collapses the strip to zero height on
     an empty list — so a dead upstream degrades this page to a plain nav, never to a throw.
     That matters more here than elsewhere: this is the page that has to work when something
     else did not. */
  const models = await fetchModels();

  const t = getDict().notFound;

  return (
    /* ⚠️ THIS WRAPPER CARRIES `lang` AND `dir`, AND IT IS NOT REDUNDANT WITH THE ROOT LAYOUT.
       Measured 2026-08-16 against `next start`, not assumed: a not-found render does NOT get
       its locale root layout. Both locales serve `<html id="__next_error__">` — no `lang`, no
       `dir` — which is Next's bare error document, and it is what you get in an app whose only
       root layouts sit inside route groups. The page BODY and the `<title>` are correctly
       localised (metadata resolves normally), so the bug is invisible in English and wrecks
       only the Hebrew: every `[dir="rtl"]` rule and every Tailwind `rtl:` variant on this site
       is an ANCESTOR selector, so with no `dir` anywhere above them, the Hebrew 404 laid out
       left-to-right.

       Putting both attributes on an element inside `<body>` fixes it completely, because
       ancestor selectors do not care that the ancestor is a div rather than the root, and
       `dir` inherits through the DOM either way. `display:contents` means the element itself
       generates NO box, so Nav's `position:fixed`, the footer's flow and `min-h-svh` all
       behave exactly as they do under a real layout.

       No PageDictProvider, separately: that exists so CLIENT components can reach a page
       namespace, and everything below is a server component — AppLink is the one "use client"
       file here, and its label arrives as pre-rendered children rather than as a dict read. */
    <div className="contents" lang={HTML_LANG[locale]} dir={DIRECTION[locale]}>
      {/* Renders nothing. Present because a `notFound()` render never reaches Next's own
          scroll reset, so arriving here from a scrolled page left you looking at this page's
          footer. Read that component's header for the measurements. */}
      <ScrollToTopOnRoute />
      <Nav models={models} />
      <main
        data-nav-theme="dark"
        className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-ink px-4 pt-[198px] pb-24 tablet:px-10"
      >
        <div className="relative flex w-px max-w-[var(--container-max)] flex-[1_0_0] flex-col items-start gap-6">
          {/* The code, as a label rather than a headline: the <h1> is the sentence, because
              that is what tells a screen reader what happened. "404" alone is a number. */}
          <p className="font-sans text-[14px] font-medium text-muted">{t.code}</p>

          <h1 className="max-w-[var(--measure)] font-display text-[44px] leading-[1.1em] tracking-[-0.05em] text-paper tablet:text-[48px]">
            {t.title}
          </h1>

          {/* Same button internals as the footer's closing CTA — 44px tall, 42px at tablet,
              full-width on phone, 16px label, and the same focus ring against `ink`. Copied
              rather than extracted: two call sites do not justify a primitive, and the day a
              third appears is the day to make one. */}
          <div className="relative mt-2 h-11 w-full flex-none tablet:h-[42px] tablet:w-auto desktop:h-11">
            <AppLink
              href="/"
              className="relative flex h-full w-full cursor-pointer flex-row items-center
                         justify-center gap-2 overflow-hidden rounded-[6px] border
                         border-[rgba(168,162,158,0)] bg-paper px-4 py-2 no-underline
                         focus-visible:ring-2 focus-visible:ring-paper
                         focus-visible:ring-offset-2 focus-visible:ring-offset-ink
                         focus-visible:outline-none
                         tablet:w-min"
            >
              <div className="relative flex h-5 w-min flex-row items-center justify-center gap-[10px] pt-px">
                <p className="text-center text-[16px] leading-[1em] font-medium tracking-[-0.01em] whitespace-pre text-ink">
                  {t.back}
                </p>
              </div>
            </AppLink>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
