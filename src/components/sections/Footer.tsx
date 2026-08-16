/**
 * Footer + closing CTA — clone of rogo.ai's `Footer` component
 * (`.framer-8dt5bh-container` → `<footer class="framer-fo8jf5">`).
 *
 * Spec, provenance and open questions: features/footer/FEATURE.md.
 * Do not "tidy" a number here without changing that file first.
 *
 * The closing CTA is INSIDE the footer in the original, not a separate section — hence one
 * component, not two.
 *
 * This is a nested Framer component, so it ships its own three variants with their own
 * gating hashes: `hidden-d23fwj` = >=1600 · `hidden-1roolzl` = 1200-1599.98 ·
 * `hidden-1leoyz4` = 810-1199.98 · `hidden-16n7npo` = <=809.98. Same four tiers as the page,
 * different names. The rendered variants are `Dark/Desktop` (>=1200), `Dark/Tablet`
 * (810-1199.98) and `Dark/Mobile` (<=809.98).
 *
 * WATCH OUT: the stylesheet also carries rules for `framer-v-1cxbn18` and
 * `framer-v-18cp4bv`, which are UNRENDERED variants of the same component — including a
 * tempting `grid-template-columns: repeat(2, …)` on the link row. None of it applies. Only
 * the three variants above are authoritative; see the standing rule in README.md.
 *
 * No animation beyond the link hover, which IS measured: the capture's link preset carries
 * `transition: color .3s cubic-bezier(.44,0,.56,1)` and a hover colour. That makes this the
 * second place on the site with a real authored transition rather than an estimate.
 */

import { Fragment } from "react";
import AppLink from "@/components/ui/AppLink";
import { getChrome } from "@/lib/i18n/server";
import type { ChromeDict } from "@/lib/i18n/dictionary";
import { CONTACT } from "@/lib/contact";
import FooterMap from "./FooterMap";

type FooterLink = {
  /* Was `label`. The visible text now comes from `chrome.footer.links[key]`, so this is a
     stable identifier that does not change with the locale — which also keeps it usable as a
     React key. */
  key: keyof ChromeDict["footer"]["links"];
  href: string;
  external?: boolean;
  /* Per-tier visibility, for the two links the original does not ship at every tier.
     See the open questions in FEATURE.md — reproduced, not corrected. */
  only?: "desktop" | "below-desktop";
};

/* `titleIndex` indexes `chrome.footer.groupTitles`, a fixed-length 4-tuple — four columns is
   layout, so the count is pinned by the type rather than by a comment. */
type LinkGroup = { titleIndex: 0 | 1 | 2 | 3; links: FooterLink[] };

/* Remapped 2026-08-05 onto clix's real IA and real accounts. Structure was the target's and
   was unchanged until 2026-08-16 — four columns, three links each plus a four-link Contact
   column, with the same per-tier gating. Overview now carries TWO links, not three: the
   target's shape lost to a working link, because the third had no honest destination. Every
   other column still matches, and the four-column grid is untouched. */

/* ✅ EVERY LINK IN THIS FOOTER RESOLVES, as of 2026-08-16. It began that day with EIGHT of its
   twelve internal links 404ing.

   How the eight closed, because the split matters more than the count:
     · repointed at pages that already existed — Services → /product, Work → /#testimonials,
       Insights → /news
     · deleted or relabelled where no honest target existed — `industries` removed outright,
       `playground` became `security`
     · BUILT — /privacy, /terms and /accessibility, ported from the company's own published
       documents in docs/reference/clixsolutions/pages/

   All eight named real pages on the real clix site, which is why the last three were a port
   rather than authorship. See features/legal-pages/ for what they say and, more importantly,
   for the four promises the accessibility statement makes that this build does not yet keep. */
const GROUPS: LinkGroup[] = [
  {
    titleIndex: 0,
    links: [
      /* Repointed 2026-08-16, the same move made for `about` below on 2026-08-12 and for the
         same reason: all three of this column's hrefs 404'd, and a footer link that lands on
         Next's bare not-found is worse than no link.

         `/product` is the page "Services" means — it is the route describing what clix
         builds. `/#testimonials` is the home page's client-work band, which the nav already
         calls "Customers"; it is the only client work on the site, so "Work" resolves there.
         Note the LEADING SLASH: `#testimonials` alone would be a same-page scroll, correct
         only in this footer's copy on `/`. `/#testimonials` is a real cross-route navigation
         from the other five routes and AppLink's own same-route guard collapses it back to a
         scroll on the home page — see the `/#contact` note in AppLink.tsx.

         `industries` is GONE rather than repointed. Nothing on this site — no page, no
         section, not a paragraph — is about industries, so every candidate target answered a
         different question than the one clicked. Its EN and HE strings came out of the
         dictionaries with it; git has them if the page is ever built. */
      { key: "services", href: "/product" },
      { key: "work", href: "/#testimonials" },
    ],
  },
  {
    titleIndex: 1,
    links: [
      /* Repointed 2026-08-12: was `/about`, which never existed and 404'd. `/company` is the
         clone of rogo.com/company and is the page this label means. The nav calls the same
         route "Company"; the labels differ because each list keeps its own capture's wording.
         The first of the three repointings; Overview's followed on 2026-08-16. */
      { key: "about", href: "/company" },
      /* Repointed 2026-08-16. `/insights` 404'd. The real clix site's own `תובנות` is its
         article hub ("what we learned from the workbench" — strategy and development pieces),
         and `/news` is this repo's article page, so the KIND of page matches even though the
         contents do not: ours aggregates external AI stories, theirs is clix's own writing.
         The label stays "Insights" while the nav calls the same route "News" — the identical
         divergence `about`/`Company` already carries two lines up, and for the same reason. */
      { key: "insights", href: "/news" },
      /* WAS `playground`, 2026-08-16 — a LABEL swap, not just a repoint, and the only one in
         this footer. The real site's `פלייגראונד` is an interactive drag-and-drop node canvas
         ("v0.1", desktop-only) where you wire up a system in the browser. Nothing here
         resembles it and no existing page could answer that click, so the slot carries
         `Security` instead: a real route, a trust page a business footer wants, and one of
         three real pages (`/clix`, `/security`, `/news`) this footer linked to nowhere at all.
         User's call, offered against deleting the slot the way `industries` was deleted. */
      { key: "security", href: "/security" },
    ],
  },
  {
    titleIndex: 2,
    links: [
      /* The original gates ONE link in this column to >=1200, so the column is 3 links on
         desktop and 2 below. That behaviour is reproduced, but the gate was moved off the
         accessibility statement and onto Terms: an accessibility statement is exactly the
         page a user on assistive tech may be looking for, and hiding it on phones would
         turn an inherited layout quirk into a real barrier. Terms carries the gate instead.
         Flagged in FEATURE.md. */
      { key: "terms", href: "/terms", only: "desktop" },
      { key: "privacy", href: "/privacy" },
      { key: "accessibility", href: "/accessibility" },
    ],
  },
  {
    titleIndex: 3,
    links: [
      /* Was `#contact`, a same-page scroll to THIS footer — i.e. a "Let's start" link whose
         destination was the block containing it. /contact exists as of 2026-08-13, so this
         and the closing CTA below both point at it. AppLink prefixes the locale, so the
         Hebrew footer sends you to /he/contact. */
      { key: "letsStart", href: "/contact" },
      { key: "email", href: CONTACT.email },
      { key: "instagram", href: CONTACT.instagram, external: true },
      /* The original splits "Press" by tier — a mailto at >=1200, an x.com profile below —
         which is why this column renders four links at every tier from five entries. clix
         has one WhatsApp number and no tier-specific alternative, so this is a single
         ungated entry. The visible count per tier is unchanged at four. */
      { key: "whatsapp", href: CONTACT.whatsapp, external: true },
    ],
  },
];

const tierClass = (only?: FooterLink["only"]) =>
  only === "desktop"
    ? "hidden desktop:block"
    : only === "below-desktop"
      ? "block desktop:hidden"
      : "";

function FooterLinkItem({ item, label }: { item: FooterLink; label: string }) {
  return (
    <div
      className={`relative h-auto w-auto max-w-[1024px] ${tierClass(item.only)}`}
    >
      <p className="text-[14px] leading-[1.5em] tracking-[-0.02em]">
        <AppLink
          href={item.href}
          external={item.external}
          /* paper -> surface on hover. The `.3s cubic-bezier(.44,0,.56,1)` is the
             capture's own, not an estimate — it is declared on the link style preset. */
          className="text-paper no-underline transition-[color] duration-300
                     hover:text-surface
                     focus-visible:rounded-[2px] focus-visible:ring-2
                     focus-visible:ring-paper focus-visible:outline-none"
          style={{ transitionTimingFunction: "var(--ease-rogo)" }}
        >
          {label}
        </AppLink>
      </p>
    </div>
  );
}

export default function Footer() {
  /* Server component, so the dictionary comes from the request store rather than a context.
     No prop had to be threaded here — which matters because this component is rendered by all
     6 routes (7 until /careers came out on 2026-08-13) and prop-drilling `locale` would have
     meant the same edit in every one of them. */
  const t = getChrome().footer;

  return (
    /* padding `0 16px` phone -> `0 40px` from 810 up. No vertical padding at all: the
       Reiteration block's own `padding-top:56px` is the footer's entire top inset, and the
       Copyright's `16px` is the bottom. */
    <footer
      data-nav-theme="dark"
      /* Was the destination of every "Let's start" button on the site (2026-08-05 to
         2026-08-13). It no longer is: /contact is a real page with a real form, and all
         eleven CTAs now point there instead — including the one inside this footer.
         The id STAYS. It costs nothing, `scroll-mt-24` still holds, and it is the kind of
         thing that gets linked from outside the codebase (a mail signature, an old post).
         Removing it would 404-in-place every one of those. */
      id="contact"
      className="relative flex w-full scroll-mt-24 items-center justify-center gap-[10px] overflow-hidden bg-ink px-4 tablet:px-10"
    >
      {/* Container — max-w 1280, gap 56. */}
      <div className="relative flex w-px max-w-[var(--container-max)] flex-[1_0_0] flex-col items-center gap-14 overflow-hidden">
        {/* Reiteration — headline and CTA on one baseline at >=810 (`align-items:flex-end`
            is what sits the button on the headline's last line), stacked below. */}
        <div
          className="relative flex w-full flex-col items-end gap-8 overflow-hidden pt-14
                     tablet:flex-row tablet:justify-start tablet:gap-10"
        >
          <div className="relative flex w-full flex-none flex-col items-start gap-10 overflow-visible tablet:w-px tablet:flex-[1_0_0]">
            <div className="relative h-auto w-full">
              <h2 className="font-display text-[44px] leading-[1.1em] tracking-[-0.05em] text-paper tablet:text-[48px]">
                {/* THE TAGLINE, AND THE ONE PLACE ON THIS SITE WHERE THE TWO LOCALES GENUINELY
                    DISAGREE ABOUT STRUCTURE.

                    English is a rendering of the live site's Hebrew close, "תוכנה שעובדת,
                    תוצאות שמדברות." — and it happens to split three ways, so it dropped
                    straight into the target's {A}<br phone>{B}<br>{C} shape. The Hebrew
                    original does not: one comma, one sentence boundary, two runs. So the
                    count cannot be hard-coded here.

                    Outer array = hard lines, broken at every tier.
                    Inner array = runs broken only on phone (`tablet:hidden`).

                    English: [["Software", "that works,"], ["results that speak."]]
                             -> 2 lines wide, 3 on phone. Byte-identical to what this
                                component rendered before the dictionary existed.
                    Hebrew:  [["תוכנה שעובדת,"], ["תוצאות שמדברות."]]
                             -> 2 lines at every tier; nothing to gate on phone.

                    The trailing space that used to be written into "Software " is added here
                    instead, and only between phone-split runs — it survives `display:none` on
                    the break, which is what welds the wider tiers cleanly. A locale whose
                    inner array has one entry never gets one. */}
                {/* `Fragment`, not `span`: a keyed fragment renders NO element, so the h2's
                    children stay exactly what they were — text nodes and `<br>`s, nothing
                    nested. An inline span would be transparent to layout, but it would still
                    add nodes the original does not have, and this block is diffed
                    element-for-element against the target. */}
                {t.tagline.map((line, li) => (
                  <Fragment key={li}>
                    {li > 0 && <br />}
                    {line.map((run, ri) => (
                      <Fragment key={ri}>
                        {ri > 0 && <br className="tablet:hidden" />}
                        {ri > 0 ? run : run + (line.length > 1 ? " " : "")}
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
              </h2>
            </div>
          </div>

          {/* CTA — 44px tall, 42px at tablet, full-width on phone. Same button internals as
              the nav's (8/16 padding around a 20px row with a 1px optical top nudge) but a
              16px label instead of 14px. */}
          <div className="relative h-11 w-full flex-none tablet:h-[42px] tablet:w-auto desktop:h-11">
            {/* `AppLink`, not a raw `<a>`: this is an internal route now, so a bare anchor
                would throw the document away on click (white flash, refetched fonts, Nav's
                theme scanner re-initialising) AND trip
                `@next/next/no-html-link-for-pages`. AppLink also applies `localeHref`, which
                is what turns `/contact` into `/he/contact` on the Hebrew footer without this
                component knowing the locale. */}
            <AppLink
              href="/contact"
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
                  {t.cta}
                </p>
              </div>
            </AppLink>
          </div>
        </div>

        {/* Divider. TWO different colours: `ink-soft` @50% below 1200, white @10% at and
            above it. Both are opacity modifiers on existing tokens, so neither is a new
            design-system value. */}
        <div className="relative h-px w-full flex-none bg-ink-soft/50 desktop:bg-paper/10" />

        {/* Bottom — link row over the copyright, gap 72. */}
        <div className="relative flex w-full flex-none flex-col items-center gap-[72px] overflow-hidden">
          {/* Link row. The four columns are the target's; the map is ours, added
              2026-08-11 as a fifth item pinned to the right edge. It is why the columns no
              longer divide the full width — they now share it with a fixed 280/430px
              panel, which is the intended shift-left. */}
          <div
            className="relative flex w-full flex-none flex-col items-start gap-8
                       overflow-hidden tablet:flex-row tablet:gap-4"
          >
            {GROUPS.map((group) => (
              <div
                key={group.titleIndex}
                className="relative flex w-full flex-none flex-col items-start gap-5
                           overflow-hidden tablet:w-px tablet:flex-[1_0_0]"
              >
                <div className="relative h-auto w-full max-w-[1024px]">
                  <p className="text-[14px] leading-[1.3em] font-medium tracking-[-0.02em] text-muted">
                    {t.groupTitles[group.titleIndex]}
                  </p>
                </div>
                <div className="relative flex w-full flex-none flex-col items-start gap-3 overflow-visible">
                  {/* Keyed on label + tier, not label + href. "Press" appears twice — once
                      per tier — and the two used to differ by href, which no longer holds
                      now both are the `#` placeholder. Tier is what actually distinguishes
                      them, so the key stays unique whatever the destinations become. */}
                  {group.links.map((item) => (
                    <FooterLinkItem
                      key={`${item.key}-${item.only ?? "all"}`}
                      item={item}
                      label={t.links[item.key]}
                    />
                  ))}
                </div>
              </div>
            ))}

            <FooterMap />
          </div>

          {/* Copyright — "© 2026" and the holder as two separate uppercase runs, 8px apart.
              The caps come from `text-transform`, so the accessible name stays lowercase.
              The target says "Rogo AI" here; changed with the nav logo (2026-08-03), since
              a clix mark over a "© ROGO AI" line names the wrong copyright holder. */}
          <div className="relative flex w-full flex-none flex-row items-start justify-center gap-4 overflow-hidden px-12 py-4">
            <div className="relative flex w-px flex-[1_0_0] flex-row items-center justify-center gap-2 overflow-visible">
              <p className="text-center text-[14px] leading-[1.3em] tracking-[-0.02em] whitespace-pre text-muted uppercase tablet:font-medium desktop:text-[12px]">
                {t.copyrightYear}
              </p>
              <p className="text-center text-[14px] leading-[1.3em] tracking-[-0.02em] whitespace-pre text-muted uppercase tablet:font-medium desktop:text-[12px]">
                {t.copyrightHolder}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
