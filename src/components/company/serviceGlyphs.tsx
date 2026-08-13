/**
 * serviceGlyphs — the eight marks that sit above the labels in `CompanyServices`.
 *
 * DRAWN HERE, NOT MEASURED. rogo's `Team` band holds employer logos and no icons at all, so
 * there is nothing in the capture to copy: the box is the target's, this artwork is ours.
 * That means the geometry below is a design decision and is documented as one, rather than
 * being recorded in FEATURE.md as a measured value.
 *
 * ─── THE CONSTRUCTION GRID ────────────────────────────────────────────────────────────────
 * All eight share one drawing system, which is what makes them read as a set rather than
 * eight clip-art picks:
 *
 *   · 32×32 viewBox, artwork kept inside 3.5 → 28.5 so every mark has the same optical margin
 *   · stroke `currentColor`, width 1.5, round cap + round join, `fill: none` by default
 *   · solid fill used ONCE per mark at most, and only for a dot or a counter-shape
 *   · square corners get radius 1.5–3 — the site is square-cornered (`--radius-none` is the
 *     default), so these are the softest curve the design system tolerates
 *
 * MONOCHROME, deliberately. `forest` was the obvious accent and was rejected: it is the /clix
 * page's colour (globals.css:35 — "the one brand colour anywhere in this build"), and eight
 * green dots on /company would spend it somewhere it was never measured. The marks take their
 * colour from the parent, which is `muted` at rest and `ink` on hover.
 *
 * ─── RTL: ALL EIGHT ARE PHYSICAL, BY CONSTRUCTION ─────────────────────────────────────────
 * Same rule as `ui/WhyRogoIcons.tsx`: mirror only glyphs whose meaning IS a direction. None
 * of these is one — and rather than argue that case eight times, seven of the eight are drawn
 * SYMMETRICAL about the vertical axis, so mirroring them would be a no-op anyway. The single
 * exception is `ChatBoltGlyph`, whose bubble tail and lightning bolt are both asymmetric; a
 * bubble tail is a picture of a bubble, not a reading direction, so it stays put on /he.
 *
 * Every `<svg>` is `aria-hidden` — the service name renders beside it as real text.
 */

import type { ReactNode } from "react";

type GlyphProps = { className?: string };

/* The shared stroke. Spread onto every drawn element; anything that needs a fill overrides
   `fill` locally and drops `stroke` by passing `stroke="none"`. */
const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Frame({ className, children }: GlyphProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", flex: "none" }}
    >
      {children}
    </svg>
  );
}

/* 1 — AI Agents. A chip wired on all four sides with a spark in the die: something that
   thinks (the spark) and is plugged into the rest of the stack (the pins). Symmetrical. */
export function AgentChipGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <rect x="9.5" y="9.5" width="13" height="13" rx="2.5" {...line} />
      <path
        d="M13 9.5V5.5M19 9.5V5.5M13 22.5V26.5M19 22.5V26.5M9.5 13H5.5M9.5 19H5.5M22.5 13H26.5M22.5 19H26.5"
        {...line}
      />
      {/* The spark is filled, not stroked — at 32px a stroked four-point star closes up. */}
      <path
        d="M16 11.8c.45 2.7 1.5 3.75 4.2 4.2-2.7.45-3.75 1.5-4.2 4.2-.45-2.7-1.5-3.75-4.2-4.2 2.7-.45 3.75-1.5 4.2-4.2Z"
        fill="currentColor"
        stroke="none"
      />
    </Frame>
  );
}

/* 2 — WhatsApp Automation. A message bubble with a bolt in it: a conversation that answers
   by itself. THE ONE ASYMMETRIC MARK — see the RTL note in the file header. */
export function ChatBoltGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <path
        d="M7 5.5h18a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H14l-5 4.5V21.5H7a3 3 0 0 1-3-3v-10a3 3 0 0 1 3-3Z"
        {...line}
      />
      <path d="M17.6 8.6 12.9 14.4h3.1l-1.2 4.6 4.7-5.8h-3.1l1.2-4.6Z" {...line} />
    </Frame>
  );
}

/* 3 — CRM Implementation. A record list: header bar, then two contact rows, each a person
   dot against its line of detail. The thing a CRM actually is, rather than a generic card. */
export function RecordsGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <rect x="4.5" y="5.5" width="23" height="21" rx="2.5" {...line} />
      <path d="M4.5 11.5h23" {...line} />
      <circle cx="10.5" cy="16.5" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="22" r="1.7" fill="currentColor" stroke="none" />
      <path d="M15 16.5h7.5M15 22h7.5" {...line} />
    </Frame>
  );
}

/* 4 — Integrations. Two half-links closed by a shared bar: two systems that only work
   because of the join between them. Perfectly symmetrical, so RTL is a no-op. */
export function LinkGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <path d="M13.5 10h-3a6 6 0 0 0 0 12h3" {...line} />
      <path d="M18.5 10h3a6 6 0 0 1 0 12h-3" {...line} />
      <path d="M11.5 16h9" {...line} />
    </Frame>
  );
}

/* 5 — Web Development. A browser frame with `< / >` in it. The chrome is one centred pill,
   not the usual three traffic dots — the dots sit on one side and would have to mirror. */
export function BrowserCodeGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <rect x="4.5" y="5.5" width="23" height="21" rx="2.5" {...line} />
      <path d="M4.5 11.5h23M11.5 8.5h9" {...line} />
      <path d="M12.5 15.5 9 19l3.5 3.5M19.5 15.5 23 19l-3.5 3.5M17.4 14.8l-2.8 8.4" {...line} />
    </Frame>
  );
}

/* 6 — Mobile Development. A handset with app content in it. The two content rules are
   centred rather than left-set, so the mark is symmetrical and needs no RTL variant. */
export function HandsetGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <rect x="9" y="3.5" width="14" height="25" rx="3" {...line} />
      <path d="M14 7h4" {...line} />
      <path d="M12.5 14h7M13.75 18h4.5" {...line} />
      <path d="M14 25h4" {...line} />
    </Frame>
  );
}

/* 7 — Custom Software. Three identical modules and one that is not: the off-the-shelf parts
   plus the piece that had to be cut for you. The circle is the whole idea of the mark. */
export function ModulesGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <rect x="4.5" y="4.5" width="10" height="10" rx="1.5" {...line} />
      <rect x="17.5" y="4.5" width="10" height="10" rx="1.5" {...line} />
      <rect x="4.5" y="17.5" width="10" height="10" rx="1.5" {...line} />
      <circle cx="22.5" cy="22.5" r="5" {...line} />
    </Frame>
  );
}

/* 8 — AI Strategy. A target with its ticks: the band's own promise is working out which
   services a business needs "and which it does not", i.e. aim before build. */
export function TargetGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <circle cx="16" cy="16" r="10" {...line} />
      <circle cx="16" cy="16" r="5" {...line} />
      <circle cx="16" cy="16" r="1.7" fill="currentColor" stroke="none" />
      <path d="M16 3.5v3M16 25.5v3M3.5 16h3M25.5 16h3" {...line} />
    </Frame>
  );
}

/**
 * The roster, in the dictionary's order.
 *
 * ⚠️ INDEXED, NOT KEYED BY LABEL. `company.services.items` is a different eight strings on
 * /he, so a `Record<string, …>` lookup would silently render nothing in Hebrew. This array
 * and that tuple are the same eight things in the same order.
 *
 * The type is written as an eight-slot TUPLE, not `Glyph[]`, for the same reason the
 * dictionary's `items` is one: the count is the grid (2 rows × 4 = 344px, the measured box).
 * Adding a ninth service has to be a deliberate edit in three places — both dictionaries and
 * here — and this type is what makes the third one fail the build instead of the eye.
 */
type ServiceGlyph = (props: GlyphProps) => ReactNode;

export const SERVICE_GLYPHS: readonly [
  ServiceGlyph,
  ServiceGlyph,
  ServiceGlyph,
  ServiceGlyph,
  ServiceGlyph,
  ServiceGlyph,
  ServiceGlyph,
  ServiceGlyph,
] = [
  AgentChipGlyph, // AI Agents
  ChatBoltGlyph, // WhatsApp Automation
  RecordsGlyph, // CRM Implementation
  LinkGlyph, // Integrations
  BrowserCodeGlyph, // Web Development
  HandsetGlyph, // Mobile Development
  ModulesGlyph, // Custom Software
  TargetGlyph, // AI Strategy
];
