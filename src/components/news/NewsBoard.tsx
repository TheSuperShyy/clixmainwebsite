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
import { CATEGORIES, NEWS_ITEMS, type CardArt, type Ground } from "./newsItems";
import { NewsGlyph } from "./newsGlyphs";

/**
 * Ground token -> the two classes it implies. A literal map, not a template string:
 * Tailwind v4 scans source text, so `bg-${g}` would generate no CSS at all.
 */
const GROUND: Record<Ground, { bg: string; fg: string }> = {
  canvas: { bg: "bg-canvas", fg: "text-ink" },
  surface: { bg: "bg-surface", fg: "text-ink" },
  forest: { bg: "bg-forest", fg: "text-paper" },
  "forest-deep": { bg: "bg-forest-deep", fg: "text-paper" },
};

/** The card image slot: rogo's 2400x1260 art, square corners, at every tier. */
const SLOT = "aspect-[1.90476] w-full overflow-hidden";

/**
 * rogo's `rogo × Entropia` card: flat ground, centred wordmark lockup.
 *
 * `aria-hidden` — every string in here is restated in the <h6> directly beneath, and the
 * marks are decoration, so announcing this would read the story's subject twice. Same
 * contract `ToolGlyphs`/`ProductDataPartners` already hold.
 */
function LockupTile({ art }: { art: Extract<CardArt, { kind: "lockup" }> }) {
  const g = GROUND[art.ground];
  return (
    <div
      aria-hidden="true"
      className={`${SLOT} ${g.bg} ${g.fg} flex flex-wrap items-center
                  justify-center gap-x-3 gap-y-2 px-6`}
    >
      {art.parts.map((part, i) => (
        <span key={part.text} className="flex items-center gap-2">
          {/* Joiner sits BEFORE every part but the first, so it never trails. Lighter
              than the names it separates, as on the original's partnership tiles. */}
          {i > 0 && (
            <span
              className="font-display text-[20px] opacity-50"
              style={{ letterSpacing: "-0.03em", lineHeight: "110%" }}
            >
              {art.joiner}
            </span>
          )}
          {part.glyph && <NewsGlyph slug={part.glyph} size={20} />}
          <span
            className="font-display text-[20px] whitespace-pre"
            style={{ letterSpacing: "-0.03em", lineHeight: "110%" }}
          >
            {part.text}
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * The stat tile's ground texture: a field of small squares, after rogo's `✳ Intelligence`
 * card.
 *
 * ⚠️ IT WAS FOUR BIG EMPTY PANELS FIRST, AND THAT WAS WRONG. A handful of large blank
 * rounded rectangles is the exact shape of a loading skeleton, so the card read as
 * unfinished rather than textured. rogo's own wordless card is the opposite: many small
 * marks, none of which invites you to read it. Size is the whole difference.
 *
 * DETERMINISTIC, AND COMPUTED ONCE AT MODULE LOAD. A linear congruential generator with a
 * fixed seed, not `Math.random` — the field has to be byte-identical between the server
 * render and the client hydration, and it has to survive a filter click without
 * reshuffling. Three seeds so no two stat tiles carry the same field.
 *
 * The centre is punched out (an ellipse a little larger than the type) so the figure never
 * sits on top of the texture.
 */
function squareField(seed: number, count: number) {
  let s = seed * 2654435761;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

  const out: { x: number; y: number; size: number; opacity: number }[] = [];
  for (let i = 0; i < count; i++) {
    const x = rnd() * 100;
    const y = rnd() * 100;
    const size = 1.1 + rnd() * 1.4;
    const opacity = 0.3 + rnd() * 0.7;
    /* Keep clear of the centred figure. Normalised ellipse test, x half-axis wider than y
       because the slot is 1.9:1 and the type is a single wide line. */
    const dx = (x - 50) / 34;
    const dy = (y - 50) / 30;
    if (dx * dx + dy * dy < 1) continue;
    out.push({ x, y, size, opacity });
  }
  return out;
}

const FIELDS: Record<string, ReturnType<typeof squareField>> = {
  a: squareField(1, 90),
  b: squareField(2, 70),
  c: squareField(3, 115),
};

/**
 * rogo's `Deal Room` card: a light ground scattered with faint panels, a figure centred
 * over them.
 *
 * THE TEXTURE CARRIES NO TEXT, deliberately. rogo's `Deal Room` version shows real deal
 * figures; ours would have to be invented, and this page's whole claim is that nothing on
 * it is. `✳ Intelligence` is the precedent that needs no numbers.
 *
 * ⚠️ `mock-line` was sampled off light JPGs and only reads on a light ground. Every stat
 * tile in the digest is `surface` for that reason; a dark one would need a different
 * square colour, not a different `ground` value.
 */
function StatTile({ art }: { art: Extract<CardArt, { kind: "stat" }> }) {
  const g = GROUND[art.ground];
  return (
    <div
      aria-hidden="true"
      className={`${SLOT} ${g.bg} ${g.fg} relative flex items-center justify-center`}
    >
      {(FIELDS[art.panels] ?? FIELDS.a).map((sq, i) => (
        <span
          key={i}
          className="absolute rounded-[1px] bg-mock-line"
          style={{
            left: `${sq.x}%`,
            top: `${sq.y}%`,
            /* Width drives both axes so the squares stay square in a 1.9:1 box. */
            width: `${sq.size}%`,
            aspectRatio: "1",
            opacity: sq.opacity,
          }}
        />
      ))}

      <span className="relative flex flex-col items-center gap-1 px-6 text-center">
        {art.glyphs && art.glyphs.length > 0 && (
          <span className="mb-1 flex items-center gap-2">
            {art.glyphs.map((slug) => (
              <NewsGlyph key={slug} slug={slug} size={20} />
            ))}
          </span>
        )}
        <span
          className="font-display text-[28px]"
          style={{ letterSpacing: "-0.03em", lineHeight: "110%" }}
        >
          {art.figure}
        </span>
        <span
          className="font-sans text-[14px] text-muted"
          style={{ letterSpacing: "-0.01em", lineHeight: "130%" }}
        >
          {art.caption}
        </span>
      </span>
    </div>
  );
}

/**
 * rogo's `Claude Opus 5 with Rogo` card: full-bleed photograph, white chip floating over
 * it. The chip is centred both ways — measured off the original, where the chip's centre
 * and the image's centre are the same x (515.5 in a 312–719 box), which only looked
 * left-aligned because that label is long.
 *
 * No chip mark: not one of these six outlets has verified artwork on simple-icons
 * (`axios` there is the HTTP client; `financialtimes` 404s), so every chip is type. See
 * newsGlyphs.tsx.
 */
function PhotoTile({ art }: { art: Extract<CardArt, { kind: "photo" }> }) {
  return (
    <div className={`${SLOT} relative`}>
      {/* Plain <img>, same call the rest of the repo makes: the slot already fixes the
          box's ratio, so next/image's loader would add a request path and no layout
          benefit. Intrinsic width/height are omitted for the same reason — the aspect
          container, not the element, is what reserves the space. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={art.src}
        alt={art.alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        style={{ objectPosition: art.objectPosition ?? "50% 50%" }}
      />
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2
                   items-center rounded-[10px] bg-paper px-3 py-2"
      >
        <span
          className="font-sans text-[14px] whitespace-pre text-ink"
          style={{ letterSpacing: "-0.01em", lineHeight: "1em" }}
        >
          {art.chip}
        </span>
      </span>
    </div>
  );
}

/** The slot's three templates. rogo runs all three within one six-card screen. */
function CardArtwork({ art }: { art: CardArt }) {
  switch (art.kind) {
    case "lockup":
      return <LockupTile art={art} />;
    case "stat":
      return <StatTile art={art} />;
    case "photo":
      return <PhotoTile art={art} />;
  }
}

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
        {items.map((item) => (
          /* Card anatomy (`.framer-m8c64b` > `.framer-obwizs`): column, gap 16,
             padding-bottom 24, NO radius anywhere. Links OUT in a new tab — ours is a
             digest of third-party reporting, not internal posts (documented deviation).

             ART COMES FROM THE ITEM, NOT FROM ITS GRID POSITION. Until 2026-08-12 the
             tile ground was `TILE[i % 4]`, so a story changed colour when you clicked a
             filter pill. Moving it onto the item is what stops that. */
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
            <CardArtwork art={item.art} />

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
        ))}
      </div>
    </div>
  );
}
