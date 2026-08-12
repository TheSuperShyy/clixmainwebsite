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
 *
 * ─────────────────────────────────────────────────────────────────────────────────────
 * WHERE THE COPY COMES FROM (2026-08-12, Hebrew pass). Two sources, not one, and the
 * split is deliberate:
 *
 *   · STRUCTURE and IDENTITY stay in `newsItems.ts` — the story's id, date, `source`,
 *     `url`, category, and which of the three art templates it gets. That file is the
 *     content pipeline and stays the one place a digest refresh is edited.
 *   · PROSE comes from `usePageDict("news")`, joined to the item BY ID. In English the
 *     dictionary projects those strings straight back out of `newsItems.ts`, so the
 *     English render is byte-identical by construction rather than by discipline.
 *
 * ⚠️ `source` AND `url` ARE NEVER TRANSLATED AND NEVER LOCALE-PREFIXED. They are
 * attributions and identifiers for reporting clix did not write. The card link is a raw
 * `<a target="_blank">` rather than `AppLink`, which is exactly what keeps `localeHref`
 * away from it — a `/he`-prefixed publisher URL would be a broken citation. See the
 * assertion note above the anchor.
 * ─────────────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import {
  CATEGORIES,
  NEWS_ITEMS,
  type CardArt,
  type FilterKey,
  type Ground,
} from "./newsItems";
import { NewsGlyph } from "./newsGlyphs";
import { usePageDict } from "@/lib/i18n/LocaleProvider";
import type { Dict } from "@/lib/i18n/dictionary";

/**
 * One card's localised prose, as an un-narrowed union of the three tile shapes.
 *
 * `import type` only — a client component that imported a dictionary MODULE would bundle
 * both locales into the browser chunk. Footer.tsx pulls `ChromeDict` the same way.
 */
type ItemCopy = Dict["news"]["items"][keyof Dict["news"]["items"]];

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
 *
 * ⚠️ THE LOCKUP DOES NOT MIRROR IN RTL, AND THE TWO `rtl:flex-row-reverse` BELOW ARE WHAT
 * STOP IT. Both rows are flex, so under `dir="rtl"` the main axis would run right-to-left
 * and `Anthropic × Riot Platforms` would render as `Riot Platforms × Anthropic` — a
 * different claim, and with `Meta / Muse Glimmer` a vendor/product pair read backwards.
 * Contract §7: a lockup of Latin entity names is a MARK, and marks do not mirror. The
 * variant is RTL-only, so the LTR computed `flex-direction` stays `row`.
 *
 * Neither half's TEXT needs bidi isolation: every leaf here is a flex item, so it is
 * blockified into its own bidi paragraph and cannot reorder against a sibling. Stated so
 * that a future refactor which un-flexes this knows it is removing a guarantee.
 */
function LockupTile({ art }: { art: Extract<CardArt, { kind: "lockup" }> }) {
  const g = GROUND[art.ground];
  return (
    <div
      aria-hidden="true"
      className={`${SLOT} ${g.bg} ${g.fg} flex flex-wrap items-center
                  justify-center gap-x-3 gap-y-2 px-6 rtl:flex-row-reverse`}
    >
      {art.parts.map((part, i) => (
        <span key={part.text} className="flex items-center gap-2 rtl:flex-row-reverse">
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
            /* LOGICAL, per contract §6: `insetInlineStart` resolves to `left` in LTR, so
               the English render is untouched, and the scatter simply mirrors in RTL.
               Mirroring is harmless here and not a DO-NOT-MIGRATE case — this is a
               full-width random field, not an optical nudge on un-mirrored artwork, and
               the punched-out centre is symmetric about x = 50. */
            insetInlineStart: `${sq.x}%`,
            top: `${sq.y}%`,
            /* Width drives both axes so the squares stay square in a 1.9:1 box. */
            width: `${sq.size}%`,
            aspectRatio: "1",
            opacity: sq.opacity,
          }}
        />
      ))}

      <span className="relative flex flex-col items-center gap-1 px-6 text-center">
        {/* NOT `rtl:flex-row-reverse`, unlike the lockup's rows, and the difference is
            principled rather than an oversight: this row is a bare set of marks with no
            joiner between them and no asserted relation, so it has no reading order to
            preserve. Verified, then left. */}
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
 *
 * ⚠️ THE CHIP IS THE PUBLISHER'S NAME — the one place a `source` string renders. It stays
 * Latin in every locale (an attribution is not translated) and carries an RTL-only
 * `unicode-bidi: isolate` so it can never reorder against Hebrew around it. As written
 * that is belt-and-braces: the span is a flex item, so it is already its own bidi
 * paragraph. It is declared anyway because the guarantee is about the ATTRIBUTION, and
 * something that must not silently break should not depend on a layout mode staying flex.
 *
 * `left-1/2` + `-translate-x-1/2` is left PHYSICAL on purpose (contract §6's
 * DO-NOT-MIGRATE list): `start-1/2` in RTL becomes `right: 50%` while the translate still
 * moves left, landing the chip off-centre by its own width.
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
          className="font-sans text-[14px] whitespace-pre text-ink
                     rtl:[unicode-bidi:isolate]"
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

/**
 * The item's art with its PROSE replaced by the active locale's, leaving everything else
 * exactly as `newsItems.ts` wrote it.
 *
 * Only two of the three templates carry prose: a stat tile's `figure`/`caption` and a
 * photograph's `alt`. A lockup's halves are Latin entity names and are returned untouched.
 * `src`, `objectPosition`, `chip`, `ground`, `panels`, `glyphs` and `joiner` are art, not
 * copy, and pass straight through the spread.
 *
 * ⚠️ THE `in` TESTS ARE A NARROWING, NOT A FALLBACK. `items[id]` returns the union of the
 * three copy shapes because TypeScript cannot correlate a runtime `item`'s `art.kind` with
 * the shape its own id maps to — the correlation is real (both sides are built from the
 * same array in `en/news.ts`) but inexpressible. The `: art` arms are therefore
 * unreachable, not a graceful degradation to English: if one ever ran it would mean the
 * dictionary and the array had diverged, which `tsc` is set up to catch first.
 */
function localisedArt(art: CardArt, copy: ItemCopy): CardArt {
  switch (art.kind) {
    case "stat":
      return "figure" in copy
        ? { ...art, figure: copy.figure, caption: copy.caption }
        : art;
    case "photo":
      return "alt" in copy ? { ...art, alt: copy.alt } : art;
    case "lockup":
      return art;
  }
}

/* The target's own date format: <time datetime="2026-08-06...">8/6/26</time>. */
function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${m}/${d}/${String(y).slice(2)}`;
}

export default function NewsBoard() {
  const t = usePageDict("news");

  /* STATE IS THE ENGLISH CATEGORY, NOT ITS LABEL. `item.category` is the datum the filter
     compares against, so translating the pill's caption must not touch what the pill
     means — the label is a lookup (`t.filters[cat]`), the state is the key. */
  const [active, setActive] = useState<FilterKey>("All");

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
        aria-label={t.a11y.filterTablist}
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
              {/* `whitespace-pre` cannot wrap, so the label has to fit the pill outright.
                  The pill is `h-10 px-5` and sizes to its content, and every Hebrew label
                  is shorter than its English counterpart, so the bar only narrows. */}
              <span
                className="font-sans text-[16px] whitespace-pre"
                style={{ letterSpacing: "-0.01em", lineHeight: "130%" }}
              >
                {t.filters[cat]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid — 3 / 2 / 1 columns, gap 32 (`.framer-plwnat` + its 730/390 variants). */}
      <div className="grid w-full grid-cols-1 gap-8 tablet:grid-cols-2 desktop:grid-cols-3">
        {items.map((item) => {
          /* JOINED BY ID, NEVER BY INDEX. This array's order is deliberate and
             non-chronological (see newsItems.ts), and it changes shape the moment a filter
             pill is clicked, so an index into a translation table would be meaningless. */
          const copy = t.items[item.id];

          return (
            /* Card anatomy (`.framer-m8c64b` > `.framer-obwizs`): column, gap 16,
               padding-bottom 24, NO radius anywhere. Links OUT in a new tab — ours is a
               digest of third-party reporting, not internal posts (documented deviation).

               ART COMES FROM THE ITEM, NOT FROM ITS GRID POSITION. Until 2026-08-12 the
               tile ground was `TILE[i % 4]`, so a story changed colour when you clicked a
               filter pill. Moving it onto the item is what stops that.

               ⚠️ A RAW ANCHOR, NOT `AppLink`, AND THAT IS NOW LOAD-BEARING. `AppLink`
               locale-prefixes any href beginning with `/`; these hrefs are absolute
               `https://` publisher URLs, so even routed through it they would fall to its
               `external` branch and `localeHref` would return them unchanged. Going
               straight to `<a target="_blank">` removes the question entirely: no source
               URL can ever acquire a `/he` prefix and turn a citation into a 404.
               `items-start` is already logical — flex cross-axis start follows
               `direction`, so the date and headline hug the right edge in Hebrew with no
               change here. */
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex cursor-pointer flex-col items-start gap-4 pb-6 no-underline
                         focus-visible:ring-2 focus-visible:ring-forest
                         focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                         focus-visible:outline-none"
            >
              <CardArtwork art={localisedArt(item.art, copy)} />

              {/* Post: date over title, gap 4 (`.framer-1lr2yw2`). */}
              <div className="flex w-full flex-col items-start gap-1">
                <p
                  className="font-sans text-[12px] text-muted"
                  style={{ letterSpacing: "-0.01em", lineHeight: "130%" }}
                >
                  {/* `8/11/26` needs no isolation: the slashes are Common Separators
                      between European Numbers, so the bidi algorithm resolves the whole
                      token as one left-to-right run inside the RTL paragraph. */}
                  <time dateTime={`${item.date}T00:00:00.000Z`}>
                    {shortDate(item.date)}
                  </time>
                </p>
                {/* h6 at 20px is the ORIGINAL's own choice of tag and size — kept.
                    No `whitespace-pre` here, so a Hebrew headline wraps freely, and the
                    grid is auto-height at 3/2/1 columns — there is no uniform-row
                    invariant for a longer or shorter headline to break. */}
                <h6
                  className="font-display text-[20px] text-ink"
                  style={{ letterSpacing: "-0.03em", lineHeight: "1.2em" }}
                >
                  {copy.title}
                </h6>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
