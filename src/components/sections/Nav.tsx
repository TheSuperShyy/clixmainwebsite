"use client";

/**
 * Nav — clone of rogo.ai `Navigation + Banner` (`.framer-1lcee9e`).
 *
 * Every value here is measured from the 2026-08-02 capture; the spec and its provenance
 * live in features/nav/FEATURE.md. Do not "tidy" a number without changing that file first.
 *
 * TWO INDEPENDENT BREAKPOINTS — this is the thing to know before editing:
 *
 *   · the BANNER switches layout at 810px  (centred row  ->  left-aligned, truncating)
 *   · the HEADER switches at 1200px        (full nav     ->  logo + hamburger)
 *
 * They are genuinely different numbers in the original, not a mistake. Framer ships the
 * whole block twice as `ssr-variant`s gated on `hidden-*` classes: the >=810 variant
 * contains BOTH header layouts (gated again at 1200), and a separate <=809.98 variant
 * carries the stacked banner. Verified by mapping every `hidden-*` class back to the
 * media query that hides it.
 *
 * Structure mirrors the original's container nesting so the gaps land in the right places.
 *
 * SCROLL STATE — added 2026-08-03 from a live-site screenshot, not from the capture.
 * The capture only ever froze the at-rest state (`data-framer-name="Transparent Dark"`,
 * logo variant `Light`). Its CSS proves a *second* nav variant exists (`.framer-v-yxrzsa`
 * alongside the rendered `.framer-v-174l6nt`) but carries none of its colors — Framer
 * applies those inline from JS. So the palette below is read off the screenshot, and the
 * trigger is our own. See features/nav/FEATURE.md.
 *
 * THE BAR TRACKS THE SECTION BEHIND IT (2026-08-03, user request). It is a three-way
 * state, not a boolean:
 *
 *   hero  -> transparent + blur, paper content   (the at-rest state from the capture)
 *   light -> solid `paper` bar, ink content      (testimonials / why-rogo / by-the-numbers)
 *   dark  -> solid `ink` bar, paper content      (security / footer)
 *
 * The page is not uniformly light below the hero: `security` and `footer` are both `ink`,
 * and a white bar sat on top of them. Each section declares its own `data-nav-theme`, and
 * the nav reads whichever one spans its bottom edge — so adding a section can never leave
 * the nav out of sync with it. Content colours for `dark` are identical to `hero`; only the
 * background differs, which is why one `light` flag still drives every text colour.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ClixWordmark from "@/components/ui/ClixWordmark";
import ClixMark from "@/components/ui/ClixMark";
import StockTicker from "@/components/ui/StockTicker";
import type { Quote } from "@/lib/quotes";

/* Logo lockup geometry (2026-08-07). Scaled up 1.18x later the same day at the user's
   request ("make clix a bit bigger and the logo") — wordmark 22 -> 26px, mark 20 -> 24px.
   BOTH moved together on purpose: the mark sits at ~1.3x the wordmark's cap height, and
   growing one without the other is exactly what makes a lockup look off.

   Mark width follows the asset's 96:88 aspect, so 24px tall renders 26.2px wide. The 8px
   gap is `gap-2`, the same step the nav's own button row uses.

   The Link boxes grew with it (h-6 -> h-7 compact, h-7 -> h-8 full). Neither changes the
   nav's own height: both rows are sized by their CTA button (40px compact, ~38px full),
   which is still taller than the 32px logo. */
const MARK_SIZE = 24;

/* Seven slots, deliberately — the row's spacing and its 1200px collapse were measured
   against seven items, so the count is layout, not content. The IA is the one the real
   company site already uses (docs/reference/clixsolutions/).

   `href: null` means INERT, and that is the point (2026-08-05, user: "make the navbar do
   nothing for now or just scroll to each sections"). Only two of these seven have anything
   on this page to go to, so those two scroll and the rest render as plain text — not as
   links to routes that would 404, and not as `#` which would jump to the top and look
   broken. An inert item is also not focusable, which is correct: there is nothing to
   activate. Give a slug an `href` the moment its page or section exists. */
const LINKS: { label: string; href: string | null }[] = [
  { label: "Services", href: "#services" },
  { label: "Industries", href: null },
  { label: "Work", href: null },
  { label: "Insights", href: null },
  { label: "Playground", href: null },
  { label: "About", href: null },
  /* The closing CTA lives inside the footer in the original, so #contact IS the footer. */
  { label: "Contact", href: "#contact" },
];

/* Each page section declares which of these it is, via `data-nav-theme`. Anything the nav
   cannot classify falls back to `light`, which is the majority of the page. */
type NavTheme = "hero" | "light" | "dark";

/* THE BANNER IS NOW A LIVE MARKET TICKER (2026-08-08, user: "put ai graph stocks here
   instead", then picking "Live ticker, real quotes" over a decorative graph).

   Its history, because the slot has turned over three times and each change had a reason:
     · target's original — "Announcing our $160M Series D led by Kleiner Perkins", removed
       2026-08-05 because under a clix wordmark it read as a first-person claim clix cannot
       make;
     · "Clix AI — launching soon", then split 2026-08-07 into "Clix AI News" + an underlined
       "Coming soon" to restore the target's headline + trailing-CTA shape;
     · now eight real AI-stock quotes with sparklines.

   The strings are gone rather than kept as a fallback ON PURPOSE. A ticker that silently
   degrades to marketing copy would hide an outage; with no quotes the strip renders nothing
   and collapses to zero height, which is visible and honest. See src/lib/quotes.ts. */

/* Button — padding 8/16, inner row 20px tall with a 1px top nudge, radius 6.
   The border is 1px and transparent in both variants; it exists so the box does not
   resize if a later state colors it in, exactly as the original does via its `:after`. */
function NavButton({
  variant,
  light,
  children,
  href,
  external,
}: {
  variant: "ghost" | "inverse";
  /* `true` only over a light section. Over the hero AND over a dark section the content
     palette is the same — see the header comment. */
  light: boolean;
  children: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : null)}
      className={[
        "flex w-min items-center justify-center gap-2 rounded-[6px] border px-4 py-2",
        "cursor-pointer whitespace-nowrap no-underline",
        "transition-[opacity,background-color] duration-300 hover:opacity-90",
        "border-transparent focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:outline-none",
        light
          ? "focus-visible:ring-ink focus-visible:ring-offset-paper"
          : "focus-visible:ring-paper focus-visible:ring-offset-ink",
        variant === "inverse"
          ? light
            ? "bg-ink"
            : "bg-paper"
          : "bg-transparent",
      ].join(" ")}
      style={{ transitionTimingFunction: "var(--ease-rogo)" }}
    >
      <span className="flex h-5 items-center justify-center gap-[10px] pt-px">
        <span
          className={[
            "font-sans text-[18px] font-medium transition-colors duration-300",
            variant === "inverse"
              ? light
                ? "text-paper"
                : "text-ink"
              : light
                ? "text-ink"
                : "text-paper",
          ].join(" ")}
          style={{ lineHeight: "1em", letterSpacing: "-0.01em" }}
        >
          {children}
        </span>
      </span>
    </a>
  );
}

/* Menu glyph — path verbatim from the capture's inline background-image SVG.
   Note it is a *split* two-bar mark (four subpaths, a gap in each bar), not the usual
   three even lines; drawing it as three rules would be a redraw. */
function MenuGlyph({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
        <path
          d="M4 4 L16 16 M16 4 L4 16"
          stroke="currentColor"
          strokeWidth="1.667"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M 0 5.833 C 0 5.373 0.373 5 0.833 5 L 5.833 5 L 5.833 6.667 L 0 6.667 Z M 20 5.833 C 20 5.373 19.627 5 19.167 5 L 7.5 5 L 7.5 6.667 L 20 6.667 Z M 0 14.167 C 0 13.706 0.373 13.333 0.833 13.333 L 13.333 13.333 L 13.333 15 L 0 15 Z M 20 14.167 C 20 13.706 19.627 13.333 19.167 13.333 L 15 13.333 L 15 15 L 20 15 Z"
      />
    </svg>
  );
}

/* `quotes` is fetched in page.tsx (a server component) and passed down rather than fetched
   here. Two reasons: Yahoo sends no CORS header so the browser cannot call it at all, and
   server-rendering the strip means the first paint already has real numbers — a ticker that
   appeared after hydration would shove the whole fixed header down 45px in front of the
   visitor. Defaults to `[]` so a caller that has no data still type-checks and simply gets
   no banner. */
export default function Nav({ quotes = [] }: { quotes?: Quote[] }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* Scroll state. Trigger: whichever section spans the BOTTOM EDGE OF THE NAV ROW — i.e.
     the last thing the header is actually sitting on top of. That boundary is the same one
     an earlier pass used as `rootMargin: -navH` on an IntersectionObserver watching `#hero`;
     this generalises it from "is the hero still there" to "what is there", which is what the
     page needs now that `security` and `footer` are dark too.

     It is also the *functional* reason the original flips at all — white-on-dark becomes
     unreadable — so the flip point is unchanged from the observed behaviour. Still
     unverified against the live site; open question in FEATURE.md. */
  const bannerRef = useRef<HTMLDivElement>(null);
  const compactRowRef = useRef<HTMLDivElement>(null);
  const fullRowRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<NavTheme>("hero");
  const [bannerH, setBannerH] = useState(0);
  const [bannerShift, setBannerShift] = useState(0);

  /* One flag drives every text, ring and border colour: `dark` and `hero` share a palette
     and differ only in the bar's fill. */
  const light = theme === "light";

  /* The banner leaves on its own, NOT with the colour flip. Live-site evidence: rogo.ai can
     be caught with the header already light AND the banner still on screen, so the two are
     not one state. It is direction-aware — confirmed on the live site: scroll up anywhere
     in the page and the black bar comes back.

     The whole rule is one line: shift = (down && scrolled at all) ? bannerH : 0.
       · scrolling DOWN — it eases out of view;
       · scrolling UP   — it eases back in, wherever you are in the page.
       · at the very top — always in place, so a fresh load never starts collapsed.

     It is a two-position animation, NOT scroll-tracking: both directions run the same
     300ms `--ease-rogo` on the header's transform. An earlier pass had the hide follow the
     scrollbar 1:1, which is more literal but reads as a jerk at the top of the page.
     4px deadzone so inertial jitter can't flip the direction mid-scroll.

     The section-theme probe rides the same rAF: both answers come from one scroll pass and
     one layout read, and both need the live nav height, so splitting them would mean
     measuring the same boxes twice a frame. */
  useEffect(() => {
    let frame = 0;
    let lastY = Math.max(0, window.scrollY);
    let down = true;
    /* Cached because it only changes when sections mount/unmount, not on scroll. */
    let sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-theme]"),
    );

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = Math.max(0, window.scrollY);
        const h = bannerRef.current?.offsetHeight ?? 0;
        /* Rows are measured separately rather than off the <header> box: the open mobile
           panel lives inside that box and would inflate it. Exactly one row is ever
           displayed per tier, so the other measures 0. Re-read every frame so a resize
           (the banner wraps to two lines below 810) needs no separate handler. */
        const navH =
          (compactRowRef.current?.offsetHeight ?? 0) +
          (fullRowRef.current?.offsetHeight ?? 0);

        if (Math.abs(y - lastY) > 4) {
          down = y > lastY;
          lastY = y;
        }
        setBannerH(h);
        setBannerShift(down && y > 0 ? h : 0);

        /* Which section is under the bar's bottom edge? Sections are contiguous, so
           exactly one matches; `light` is the fallback if the page ever has a gap. */
        let next: NavTheme = "light";
        for (const el of sections) {
          const r = el.getBoundingClientRect();
          if (r.top <= navH && r.bottom > navH) {
            next = (el.dataset.navTheme as NavTheme) ?? "light";
            break;
          }
        }
        setTheme(next);
      });
    };

    const onResize = () => {
      sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-nav-theme]"),
      );
      onScroll();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const bannerGone = bannerH > 0 && bannerShift >= bannerH;

  /* Close on Escape and lock body scroll while the panel is up. Neither behavior is
     observable in the capture (the menu is never rendered open) — both are our own
     baseline, flagged as an open question in FEATURE.md. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* The header switches at 1200px but the panel is only reachable below it; if the
     viewport crosses that line while open, the toggle disappears and the panel would
     be orphaned. Close it. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1200px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[3] flex flex-col items-center overflow-hidden
                 transition-transform duration-300"
      style={{
        transform: bannerShift ? `translateY(-${bannerShift}px)` : "none",
        transitionTimingFunction: "var(--ease-rogo)",
      }}
    >
      {/* ---------------------------------------------------------------- Banner
          The strip keeps the target's own box — `padding: 12px 16px` on phone, `12px 40px`
          from 810 up — so its height is unchanged at 45px and the `bannerShift` transform
          below still travels the same distance. Only the CONTENTS changed: the centred text
          pair became a full-width scrolling ticker, so the inner wrappers that existed to
          centre a short headline are gone with it.

          Eases out on the way down and back in on the way up, even though it sits in the
          fixed block — see the `bannerShift` effect above. `aria-hidden` + `inert` whenever
          it is on its way out, so it never sits in the tab order invisibly.

          Renders NOTHING when `quotes` is empty, collapsing the strip to zero height. That
          is the outage story: no band rather than a band of stale or invented numbers. */}
      <div
        ref={bannerRef}
        className={quotes.length ? "w-full bg-banner" : "hidden"}
        aria-hidden={bannerGone}
        {...(bannerGone ? { inert: true } : null)}
      >
        <div className="flex w-full items-center px-4 py-3 tablet:px-10">
          <StockTicker initial={quotes} />
        </div>
      </div>

      {/* ------------------------------------------------- Header, <1200: logo + burger
          Two coincident bottom borders in the original — white@15% on the outer block and
          hairline on the inner row. Both reproduced; they overlay rather than stack
          because the padding lives on the inner element. */}
      <div
        className={`hero-nav-blur relative flex w-full flex-col items-center overflow-hidden
                    border-b transition-[background-color,border-color] duration-300
                    desktop:hidden
                    ${light ? "border-b-hairline" : "border-b-hairline-light"}`}
        style={{
          /* `rgba(21,21,21,0.01)` is the capture's at-rest fill below 1200 — effectively
             transparent; the `blur(5px)` is what separates the bar from the video. Over a
             dark section it goes fully opaque `ink` instead. */
          backgroundColor:
            theme === "light"
              ? "var(--color-paper)"
              : theme === "dark"
                ? "var(--color-ink)"
                : "rgba(21, 21, 21, 0.01)",
          transitionTimingFunction: "var(--ease-rogo)",
        }}
      >
        <div
          ref={compactRowRef}
          className="flex w-full items-center justify-between border-b border-b-hairline p-4"
        >
          <div className="flex w-min items-center gap-10">
            <Link
              href="/"
              /* Width was a fixed 60px while this box held the target's SVG logotype. The
                 clix mark is set in type, so it sizes itself and the box follows it.

                 Colour and its transition live HERE rather than on each child, so the mark
                 and the wordmark can never drift out of step mid-flip. Both read
                 `currentColor` — the wordmark as text, the mark as a mask fill. */
              className={`flex h-7 flex-none items-center gap-2 no-underline
                          transition-colors duration-300
                          focus-visible:ring-2 focus-visible:outline-none
                          ${light ? "text-ink focus-visible:ring-ink" : "text-paper focus-visible:ring-paper"}`}
              aria-label="clix home"
            >
              <ClixMark size={MARK_SIZE} />
              <ClixWordmark />
            </Link>
          </div>
          <div className="flex w-min items-center gap-2">
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-mobile-panel"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`flex h-10 w-10 flex-none cursor-pointer items-center justify-center
                          gap-[10px] transition-colors duration-300
                          focus-visible:ring-2 focus-visible:outline-none
                          ${
                            light
                              ? "text-ink focus-visible:ring-ink"
                              : "text-paper focus-visible:ring-paper"
                          }`}
            >
              <MenuGlyph open={open} />
            </button>
          </div>
        </div>

        {/* Panel. NOT in the capture — the original renders it only on interaction, so
            nothing about its real appearance is observable. This is our own baseline,
            built from the link set the header already declares. See FEATURE.md. */}
        {open && (
          <nav
            id="nav-mobile-panel"
            className="flex w-full flex-col gap-1 bg-ink px-4 pt-2 pb-6"
            aria-label="Main"
          >
            {/* Keyed on label, not href — five of the seven now share a null href. */}
            {LINKS.map((l) => {
              const style = {
                lineHeight: "1.5em",
                letterSpacing: "-0.01em",
                transitionTimingFunction: "var(--ease-rogo)",
              };
              const base =
                "flex h-9 items-center font-sans text-[18px] font-medium text-paper";
              return l.href ? (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`${base} no-underline transition-opacity duration-300
                              hover:opacity-70 focus-visible:ring-2 focus-visible:ring-paper
                              focus-visible:outline-none`}
                  style={style}
                >
                  {l.label}
                </a>
              ) : (
                /* Dimmed to 50% rather than rendered at full strength: an item that cannot
                   be activated should not look identical to one that can. */
                <span
                  key={l.label}
                  aria-disabled="true"
                  className={`${base} cursor-default opacity-50`}
                  style={style}
                >
                  {l.label}
                </span>
              );
            })}
            {/* The panel is `bg-ink` in every state, so its buttons keep the dark-surface
                palette even when the header above them has gone light. */}
            {/* "Log in" removed 2026-08-05: clix sells engagements, not a product with
                accounts, so there was nothing to log into. The ghost variant is now unused
                here but kept in NavButton — the >=1200 header still has no second button
                either, and re-adding one should not mean re-deriving the variant. */}
            <div className="mt-4 flex items-center gap-2">
              <NavButton variant="inverse" light={false} href="#contact">
                Let&rsquo;s start
              </NavButton>
            </div>
          </nav>
        )}
      </div>

      {/* ------------------------------------------------- Header, >=1200: full nav
          The link row is absolutely centred on the header box (left:50% + translateX(-50%)),
          NOT laid out between logo and buttons. That is deliberate in the original: it keeps
          the links optically centred on the page regardless of how wide the button group
          gets, which a plain space-between would not do. */}
      <div
        ref={fullRowRef}
        className="hero-nav-blur hidden w-full flex-col items-center overflow-visible
                   px-10 py-4 transition-[background-color] duration-300 desktop:flex"
        style={{
          backgroundColor:
            theme === "light"
              ? "var(--color-paper)"
              : theme === "dark"
                ? "var(--color-ink)"
                : "rgba(21, 21, 21, 0)",
          transitionTimingFunction: "var(--ease-rogo)",
        }}
      >
        <div className="relative flex w-full max-w-[var(--container-max)] items-center justify-between">
          <Link
            href="/"
            /* Colour + transition on the anchor, not per child — see the compact row. */
            className={`flex h-8 flex-none cursor-pointer items-center gap-2 no-underline
                        transition-colors duration-300
                        focus-visible:ring-2 focus-visible:outline-none
                        ${light ? "text-ink focus-visible:ring-ink" : "text-paper focus-visible:ring-paper"}`}
            aria-label="clix home"
          >
            <ClixMark size={MARK_SIZE} />
            <ClixWordmark />
          </Link>

          <nav
            className="absolute top-0 bottom-0 left-1/2 z-[1] flex w-min -translate-x-1/2
                       items-center justify-center gap-3 overflow-hidden"
            aria-label="Main"
          >
            {/* Keyed on label, not href — five of the seven now share a null href.
                The inert ones render the SAME box (`h-9 px-3 py-2`) as the links, because
                the row's spacing was measured against seven equal items; swapping one for a
                narrower element would shift the whole centred row. */}
            {LINKS.map((l) => {
              const box =
                "flex h-9 w-min flex-col items-center justify-center overflow-hidden px-3 py-2 whitespace-pre";
              const text = `font-sans text-[18px] font-medium transition-colors duration-300 ${
                light ? "text-ink" : "text-paper"
              }`;
              return l.href ? (
                <a
                  key={l.label}
                  href={l.href}
                  className={`${box} cursor-pointer no-underline transition-opacity
                              duration-300 hover:opacity-70 focus-visible:ring-2
                              focus-visible:outline-none
                              ${light ? "focus-visible:ring-ink" : "focus-visible:ring-paper"}`}
                  style={{ transitionTimingFunction: "var(--ease-rogo)" }}
                >
                  <span
                    className={text}
                    style={{ lineHeight: "1.5em", letterSpacing: "-0.01em" }}
                  >
                    {l.label}
                  </span>
                </a>
              ) : (
                /* Dimmed to 50% rather than rendered at full strength: an item that cannot
                   be activated should not look identical to one that can. */
                <span
                  key={l.label}
                  aria-disabled="true"
                  className={`${box} cursor-default opacity-50`}
                >
                  <span
                    className={text}
                    style={{ lineHeight: "1.5em", letterSpacing: "-0.01em" }}
                  >
                    {l.label}
                  </span>
                </span>
              );
            })}
          </nav>

          {/* One button, not two — see the note on the mobile panel. The wrapper keeps its
              `gap-2` so re-adding a second button needs no layout work. */}
          <div className="flex w-min items-center gap-2 overflow-hidden">
            <NavButton variant="inverse" light={light} href="#contact">
              Let&rsquo;s start
            </NavButton>
          </div>
        </div>
      </div>
    </header>
  );
}
