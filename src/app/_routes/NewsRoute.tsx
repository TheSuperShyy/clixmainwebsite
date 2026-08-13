/**
 * /news — clone of rogo.com/news, carrying clix's AI-news digest.
 * Measured from a 2026-08-11 live fetch (no frozen capture exists for this page).
 * Spec: features/news-page/FEATURE.md · memory: features/news-page/CONTEXT.md.
 *
 * NAV IS FIXED HERE, unlike /clix. Measured: rogo.com/news's header is `position:fixed`
 * exactly like home's (`.framer-1lcee9e`), NOT in-flow like /felix's — so this page uses
 * the home pattern (no `spacer`; the section's own 220px top padding clears the header)
 * and keeps the ticker banner, which is our equivalent of the banner rogo shows here.
 *
 * No robots block: every headline, source and URL below is genuine third-party reporting
 * (see newsItems.ts). /clix's noindex is about its fabricated testimonials, not policy.
 */

import Nav from "@/components/sections/Nav";
import NewsBoard from "@/components/news/NewsBoard";
import AppLink from "@/components/ui/AppLink";
import { fetchModels } from "@/lib/models";
import type { Locale } from "@/lib/i18n/config";
import { seedLocale, getDict } from "@/lib/i18n/server";
import { PageDictProvider } from "@/lib/i18n/LocaleProvider";

export default async function NewsRoute({ locale }: { locale: Locale }) {
  /* Seeded here as well as in the root layout: this body is the direct parent of
     every section, so a server component below it can never read the locale before
     it is set, regardless of layout ordering. */
  seedLocale(locale);

  /* The hero's three strings. They live in the `news` namespace rather than here because the
     agent that owned that namespace could not edit this file — it is the shared route body.
     ⚠️ `subtitle` is stored as ONE line even though the JSX below used to break it across two:
     JSX collapses that to a single space, so the dictionary holds the RENDERED string. Each of
     the three is the sole child of its element, so swapping a text node for an expression adds
     no comment marker and the English HTML stays byte-identical. */
  const t = getDict().news.hero;

  const models = await fetchModels();

  return (
    /* Client components below this point read their strings with
       usePageDict("news"). Server components use getDict().news directly and do not
       need the provider at all — it is here for the client half only. */
    <PageDictProvider name="news" value={getDict().news}>
      <>
        <Nav models={models} />
        <main>
          {/* `Articles` (`#articles`): 220px top clears the FIXED banner+nav (that is why it
              dwarfs /clix's spacing — it is doing two jobs), 120 bottom, gap 64 to the board.
              Phone drops x-padding to 16. */}
          <section
            id="articles"
            data-nav-theme="light"
            className="flex w-full flex-col items-center gap-16 px-4 pt-[220px] pb-[120px]
                       tablet:px-10"
          >
            {/* Title block — max 960, gap 20, everything centred. */}
            <div className="flex w-full max-w-[960px] flex-col items-center gap-5">
              <h1
                /* 88/72/64 at desktop/tablet/phone; phone alone relaxes tracking to
                   -0.05em — the preset's own tiering, not taste. */
                className="w-full text-center font-display text-ink
                           text-[64px] tracking-[-0.05em]
                           tablet:text-[72px] tablet:tracking-[-0.06em]
                           desktop:text-[88px]"
                style={{ lineHeight: "95%" }}
              >
                {t.title}
              </h1>

              {/* 540px measure with `text-wrap: balance` — the original's own override. */}
              <p
                className="w-full max-w-[540px] text-center font-sans text-[16px] text-muted
                           [text-wrap:balance]"
                style={{ letterSpacing: "-0.01em", lineHeight: "130%" }}
              >
                {t.subtitle}
              </p>

              {/* Same `Brand` button anatomy as everywhere: 40px here (8x16 padding, 20px
                  inner line with 1px top nudge), radius 6, ink fill.
                  ⚠️ WAS A `mailto:`, AND THE LABEL STILL SAYS "Contact Media Team".
                  The original's press contact is a mailto and this reproduced it, pointing at
                  clixteam579@gmail.com — a personal address, and not the one the rest of the
                  site publishes. On 2026-08-13 the user asked for every CTA on the site to reach
                  the new /contact form, this one included, so it now does; the form's "tell us"
                  field is where a press enquiry says it is a press enquiry.
                  OPEN QUESTION, logged in features/contact-page/FEATURE.md: if press should have
                  its own inbox rather than the general one, this single href reverts to a mailto
                  and nothing else on the route changes. */}
              <AppLink
                href="/contact"
                className="relative flex h-10 w-min flex-none cursor-pointer items-center
                           justify-center gap-2 overflow-hidden rounded-[6px] bg-ink px-4
                           py-2 no-underline transition-opacity duration-300 hover:opacity-90
                           focus-visible:ring-2 focus-visible:ring-forest
                           focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                           focus-visible:outline-none"
                style={{ transitionTimingFunction: "var(--ease-rogo)" }}
              >
                <span className="flex h-5 items-center justify-center gap-[10px] pt-px">
                  {/* `whitespace-pre` under `width: min-content` — same fix as every other
                      button label on the site. */}
                  <span
                    className="font-sans text-[16px] font-medium whitespace-pre text-paper"
                    style={{ lineHeight: "1em", letterSpacing: "-0.01em" }}
                  >
                    {t.cta}
                  </span>
                </span>
              </AppLink>
            </div>

            <NewsBoard />
          </section>
        </main>
      </>
    </PageDictProvider>
  );
}
