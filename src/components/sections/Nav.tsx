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
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import RogoWordmark from "@/components/ui/RogoWordmark";

const LINKS = [
  { label: "Felix", href: "/felix" },
  { label: "Product", href: "/product" },
  { label: "Security", href: "/security" },
  { label: "Company", href: "/company" },
  { label: "Customers", href: "/customers" },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
] as const;

const BANNER_TEXT = "Announcing our $160M Series D led by Kleiner Perkins";
const BANNER_HREF = "/news/series-d";
const LOGIN_HREF = "https://tryrogo.com";

/* Button — padding 8/16, inner row 20px tall with a 1px top nudge, radius 6.
   The border is 1px and transparent in both variants; it exists so the box does not
   resize if a later state colors it in, exactly as the original does via its `:after`. */
function NavButton({
  variant,
  children,
  href,
  external,
}: {
  variant: "ghost" | "inverse";
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
        "transition-opacity duration-300 hover:opacity-90",
        "focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2",
        "focus-visible:ring-offset-ink focus-visible:outline-none",
        variant === "inverse"
          ? "border-transparent bg-paper"
          : "border-transparent bg-transparent",
      ].join(" ")}
      style={{ transitionTimingFunction: "var(--ease-rogo)" }}
    >
      <span className="flex h-5 items-center justify-center gap-[10px] pt-px">
        <span
          className={[
            "font-sans text-[14px] font-medium",
            variant === "inverse" ? "text-ink" : "text-paper",
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

export default function Nav() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

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
    <header className="fixed inset-x-0 top-0 z-[3] flex flex-col items-center overflow-hidden">
      {/* ---------------------------------------------------------------- Banner
          >=810: centred row, padding 12/40, gap 10 between the dot group and "Learn more".
          <810 : padding 12/16, left-aligned, headline truncates to one line so the
                 "Learn more" link is never pushed off the edge. */}
      <div className="w-full bg-banner">
        <div
          className="flex w-full items-center gap-6
                     px-4 py-3 tablet:justify-center tablet:px-10"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 tablet:justify-center">
            <div className="flex min-w-0 flex-1 items-center gap-[10px] tablet:w-min tablet:flex-none">
              <div className="flex min-w-0 flex-1 items-center gap-2 tablet:w-min tablet:flex-none tablet:gap-[10px]">
                {/* Container — the 8px dot is present in the original but has no fill
                    declared, so it renders as pure spacing. Kept because removing it
                    would close up 18px (8 + the 10px gap) on every tier. */}
                <div className="flex min-w-0 flex-1 items-center gap-[10px] tablet:w-min tablet:flex-none">
                  <div className="h-2 w-2 flex-none rounded-full" aria-hidden="true" />
                  <a
                    href={BANNER_HREF}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 truncate font-sans text-[14px] text-paper no-underline
                               transition-colors duration-300 hover:text-surface
                               focus-visible:ring-2 focus-visible:ring-paper
                               focus-visible:outline-none tablet:overflow-visible
                               tablet:whitespace-pre"
                    style={{
                      lineHeight: "1.5em",
                      letterSpacing: "-0.02em",
                      transitionTimingFunction: "var(--ease-rogo)",
                    }}
                  >
                    {BANNER_TEXT}
                  </a>
                </div>
                <a
                  href={BANNER_HREF}
                  className="flex-none font-sans text-[14px] whitespace-pre text-paper underline
                             transition-colors duration-300 hover:text-surface
                             focus-visible:ring-2 focus-visible:ring-paper
                             focus-visible:outline-none"
                  style={{
                    lineHeight: "1.5em",
                    letterSpacing: "-0.02em",
                    transitionTimingFunction: "var(--ease-rogo)",
                  }}
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------- Header, <1200: logo + burger
          Two coincident bottom borders in the original — white@15% on the outer block and
          hairline on the inner row. Both reproduced; they overlay rather than stack
          because the padding lives on the inner element. */}
      <div
        className="hero-nav-blur relative flex w-full flex-col items-center overflow-hidden
                   border-b border-b-hairline-light desktop:hidden"
        style={{ backgroundColor: "rgba(21, 21, 21, 0.01)" }}
      >
        <div className="flex w-full items-center justify-between border-b border-b-hairline p-4">
          <div className="flex w-min items-center gap-10">
            <Link
              href="/"
              className="relative block h-6 w-[60px] flex-none no-underline
                         focus-visible:ring-2 focus-visible:ring-paper focus-visible:outline-none"
              aria-label="rogo — home"
            >
              <RogoWordmark className="absolute inset-x-0 -bottom-px h-6 text-paper" />
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
              className="flex h-10 w-10 flex-none cursor-pointer items-center justify-center
                         gap-[10px] text-paper
                         focus-visible:ring-2 focus-visible:ring-paper focus-visible:outline-none"
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
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex h-9 items-center font-sans text-[14px] font-medium text-paper
                           no-underline transition-opacity duration-300 hover:opacity-70
                           focus-visible:ring-2 focus-visible:ring-paper focus-visible:outline-none"
                style={{
                  lineHeight: "1.5em",
                  letterSpacing: "-0.01em",
                  transitionTimingFunction: "var(--ease-rogo)",
                }}
              >
                {l.label}
              </a>
            ))}
            <div className="mt-4 flex items-center gap-2">
              <NavButton variant="ghost" href={LOGIN_HREF} external>
                Log in
              </NavButton>
              <NavButton variant="inverse" href="#request-demo">
                Request Demo
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
        className="hero-nav-blur hidden w-full flex-col items-center overflow-visible
                   px-10 py-4 desktop:flex"
        style={{ backgroundColor: "rgba(21, 21, 21, 0)" }}
      >
        <div className="relative flex w-full max-w-[var(--container-max)] items-center justify-between">
          <Link
            href="/"
            className="relative block h-7 w-[60px] flex-none cursor-pointer no-underline
                       focus-visible:ring-2 focus-visible:ring-paper focus-visible:outline-none"
            aria-label="rogo — home"
          >
            <RogoWordmark className="absolute bottom-0 left-1/2 h-6 w-[60px] -translate-x-1/2 text-paper" />
          </Link>

          <nav
            className="absolute top-0 bottom-0 left-1/2 z-[1] flex w-min -translate-x-1/2
                       items-center justify-center gap-3 overflow-hidden"
            aria-label="Main"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="flex h-9 w-min cursor-pointer flex-col items-center justify-center
                           overflow-hidden px-3 py-2 whitespace-pre no-underline
                           transition-opacity duration-300 hover:opacity-70
                           focus-visible:ring-2 focus-visible:ring-paper focus-visible:outline-none"
                style={{ transitionTimingFunction: "var(--ease-rogo)" }}
              >
                <span
                  className="font-sans text-[14px] font-medium text-paper"
                  style={{ lineHeight: "1.5em", letterSpacing: "-0.01em" }}
                >
                  {l.label}
                </span>
              </a>
            ))}
          </nav>

          <div className="flex w-min items-center gap-2 overflow-hidden">
            <NavButton variant="ghost" href={LOGIN_HREF} external>
              Log in
            </NavButton>
            <NavButton variant="inverse" href="#request-demo">
              Request Demo
            </NavButton>
          </div>
        </div>
      </div>
    </header>
  );
}
