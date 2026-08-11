"use client";

/**
 * NewsBoard — clone of rogo.com/news's tabs + article grid (`.framer-10awqyd`).
 * Measured from the 2026-08-11 live fetch. Spec: features/news-page/FEATURE.md.
 *
 * Client component for ONE reason: the filter pills are state. There is no animation —
 * nothing observable animates on rogo's filter switch (static HTML shows none, and the
 * live behaviour is a CMS re-filter), so the swap is instant. Do not add a transition
 * without observing one.
 *
 * GAP IS 32, NOT 64. The section separates Title from this board with 64px, but INSIDE
 * the board, tabs to grid is `gap: 32px` (`.framer-XwkTp.framer-10awqyd`). Easy to
 * conflate; they are different boxes.
 */

import { useState } from "react";
import { CATEGORIES, NEWS_ITEMS } from "./newsItems";

/* Tile grounds rotate through token colours — the visual language of rogo's own
   partnership tiles ("rogo x Entropia" is a flat forest card with wordmarks). Their
   article art is theirs; these are built from things we own. Rotation is by GRID INDEX
   so a filtered view still alternates instead of clumping one colour. */
const TILE = [
  { bg: "bg-canvas", text: "text-ink" },
  { bg: "bg-forest", text: "text-paper" },
  { bg: "bg-canvas", text: "text-ink" },
  { bg: "bg-forest-deep", text: "text-paper" },
] as const;

/* The target's own date format: <time datetime="2026-08-06...">8/6/26</time>. */
function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${m}/${d}/${String(y).slice(2)}`;
}

export default function NewsBoard() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");

  const items =
    active === "All"
      ? NEWS_ITEMS
      : NEWS_ITEMS.filter((n) => n.category === active);

  return (
    <div className="flex w-full max-w-[var(--container-max)] flex-col items-center gap-8">
      {/* Tabs — wrap, centred, gap 10 (`.framer-1jqmcbo`). Pills are 40px tall with
          10x20 padding and a 28px radius. Active: ink on paper inverted. Inactive: paper
          with a 1px rgba(24,24,24,0.1) border — NOT the token hairline, the original
          inlines this exact rgba. No hover state is shipped because none is observable
          from the fetch; see FEATURE.md open questions. */}
      <div
        role="tablist"
        aria-label="Filter news by category"
        className="flex w-full flex-wrap items-center justify-center gap-[10px]"
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(cat)}
              className={`flex h-10 cursor-pointer items-center justify-center
                          rounded-[28px] px-5 py-[10px]
                          focus-visible:ring-2 focus-visible:ring-forest
                          focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                          focus-visible:outline-none
                          ${
                            isActive
                              ? "bg-ink text-paper"
                              : "border border-[rgba(24,24,24,0.1)] bg-paper text-muted"
                          }`}
            >
              <span
                className="font-sans text-[16px] whitespace-pre"
                style={{ letterSpacing: "-0.01em", lineHeight: "130%" }}
              >
                {cat}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid — 3 / 2 / 1 columns, gap 32 (`.framer-plwnat` + its 730/390 variants). */}
      <div className="grid w-full grid-cols-1 gap-8 tablet:grid-cols-2 desktop:grid-cols-3">
        {items.map((item, i) => {
          const tile = TILE[i % TILE.length];
          return (
            /* Card anatomy (`.framer-m8c64b` > `.framer-obwizs`): column, gap 16,
               padding-bottom 24, NO radius anywhere. Links OUT in a new tab — ours is a
               digest of third-party reporting, not internal posts (documented deviation). */
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex cursor-pointer flex-col items-start gap-4 pb-6 no-underline
                         focus-visible:ring-2 focus-visible:ring-forest
                         focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                         focus-visible:outline-none"
            >
              {/* Image slot — aspect 1.90476 (the original's 2400x1260 art). Source-name
                  tile in the display face stands in for art we cannot vendor. */}
              <div
                className={`flex aspect-[1.90476] w-full items-center justify-center
                            overflow-hidden ${tile.bg}`}
              >
                <span
                  className={`px-4 text-center font-display text-[24px] ${tile.text}`}
                  style={{ letterSpacing: "-0.03em", lineHeight: "110%" }}
                >
                  {item.source}
                </span>
              </div>

              {/* Post: date over title, gap 4 (`.framer-1lr2yw2`). */}
              <div className="flex w-full flex-col items-start gap-1">
                <p
                  className="font-sans text-[12px] text-muted"
                  style={{ letterSpacing: "-0.01em", lineHeight: "130%" }}
                >
                  <time dateTime={`${item.date}T00:00:00.000Z`}>
                    {shortDate(item.date)}
                  </time>
                </p>
                {/* h6 at 20px is the ORIGINAL's own choice of tag and size — kept. */}
                <h6
                  className="font-display text-[20px] text-ink"
                  style={{ letterSpacing: "-0.03em", lineHeight: "1.2em" }}
                >
                  {item.title}
                </h6>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
