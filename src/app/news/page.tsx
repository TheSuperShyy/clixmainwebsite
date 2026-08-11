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

import type { Metadata } from "next";
import Nav from "@/components/sections/Nav";
import NewsBoard from "@/components/news/NewsBoard";
import { fetchModels } from "@/lib/models";

export const metadata: Metadata = {
  title: "Updates",
  description:
    "Daily AI news, tracked by Clix: models, business, security and policy.",
};

/* Same literal-not-import rule as home — see src/app/page.tsx. */
export const revalidate = 300;

export default async function NewsPage() {
  const models = await fetchModels();

  return (
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
              Updates
            </h1>

            {/* 540px measure with `text-wrap: balance` — the original's own override. */}
            <p
              className="w-full max-w-[540px] text-center font-sans text-[16px] text-muted
                         [text-wrap:balance]"
              style={{ letterSpacing: "-0.01em", lineHeight: "130%" }}
            >
              Daily signals on everything you need to know about AI: the models,
              the money, the risks and the rules.
            </p>

            {/* Same `Brand` button anatomy as everywhere: 40px here (8x16 padding, 20px
                inner line with 1px top nudge), radius 6, ink fill. mailto like the
                original's press contact. */}
            <a
              href="mailto:clixteam579@gmail.com"
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
                  Contact Media Team
                </span>
              </span>
            </a>
          </div>

          <NewsBoard />
        </section>
      </main>
    </>
  );
}
