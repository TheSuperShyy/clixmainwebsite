/**
 * workflowMocks — the three product-UI illustrations inside /product's `Streamline & Automate
 * Your Workflows` block (sub-block 2d).
 *
 * ⚠️ PROVENANCE. The original ships these as three flat JPGs, 922x1040 each, on
 * framerusercontent:
 *   Firm-Specific Workflows  TwCc7NSpim3LYfS9L52C427iqU.jpg
 *   AI Table Interface       iLUrIYXexMEto7ZcsADicLSwEQ.jpg
 *   Material Creation        jsXGDPEFEziUQou4fnyFKoRKjg.jpg
 * They are screenshots of rogo's real product. Per the standing call on this page they are
 * REBUILT in DOM, not vendored — no borrowed product art under this wordmark. Everything here
 * is drawn from this site's tokens, at the reference's own measured geometry.
 *
 * The first pass at this block invented loose "token panels" instead, and the user rejected it
 * ("this is how it looks in rogo, its not the same as ours"). So the rebuild is measured, not
 * evoked: every number below is a pixel coordinate read off the source JPGs with sharp.
 *
 * ---------------------------------------------------------------------------------------
 * THE COORDINATE SYSTEM — why everything is `u(n)`.
 *
 * The original's art box is `aspect-ratio: .78913` (411x521 at desktop) and the image sits in
 * it with `object-fit: cover`. Source is 922x1040 = 0.8865, which is WIDER than the box, so
 * cover scales by HEIGHT and crops the sides. Two consequences we have to reproduce:
 *
 *   1. Uniform scale = boxHeight / 1040, i.e. boxWidth / 820.6. So one source pixel is
 *      `1cqw / 8.206` — hence `--u`, and every dimension written as `u(sourcePx)`. Container
 *      queries are what make a DOM rebuild scale like a bitmap: at 411 wide (desktop), 456
 *      (tablet half-row) or 358 (phone) the mock stays proportional instead of reflowing.
 *      `inline-size` rather than `size`: the art box's height comes from its aspect-ratio, so
 *      only the inline axis needs to be a query container.
 *   2. Only source x 0..820.6 is ever visible. The visible crop is centred (`object-position:
 *      center`) for mocks 1 and 3 and LEFT-ALIGNED (`left center`) for mock 2 — which is why
 *      mock 2's card, pill and table run off the right edge in the original too. That is the
 *      design, not a bug: `cropLeft` below carries it.
 *
 * The tier variants of `object-position` (`center` vs `center top`) collapse to nothing here:
 * the crop is horizontal only, so the vertical component never applies.
 *
 * Capture: docs/reference/target/rogo-product-2026-08-11.html
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md
 */

import type { CSSProperties, ReactNode } from "react";
import ClixMark from "@/components/ui/ClixMark";

/* One source pixel, as a CSS length. See the note above. */
const u = (n: number) => `calc(${n} * var(--u))`;

/* 922 source px wide, 820.6 visible => 50.7 cropped from each side when centred. */
const CROP_CENTRED = -50.7;

/* ---- Primitives ---------------------------------------------------------------------- */

/** An absolutely-placed box in source coordinates. */
function Box({
  x,
  y,
  w,
  h,
  radius,
  className = "",
  style,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  radius?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: u(x),
        top: u(y),
        width: w === undefined ? undefined : u(w),
        height: h === undefined ? undefined : u(h),
        borderRadius: radius === undefined ? undefined : u(radius),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * A single line of text, VERTICALLY CENTRED on `cy`. Centring on the measured optical centre
 * rather than anchoring a top edge is what keeps the rebuild aligned: the bands measured off
 * the JPGs run cap-top to descender-bottom, and their midpoint is the only stable landmark.
 */
function Line({
  x,
  cy,
  size,
  className = "",
  weight = 400,
  children,
}: {
  x: number;
  cy: number;
  size: number;
  className?: string;
  weight?: number;
  children: ReactNode;
}) {
  const lh = size * 1.4;
  return (
    <div
      className={`absolute font-sans whitespace-nowrap ${className}`}
      style={{
        left: u(x),
        top: u(cy - lh / 2),
        fontSize: u(size),
        lineHeight: u(lh),
        fontWeight: weight,
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </div>
  );
}

/** The floating card the mocks are built from: near-white, hairline, soft drop. */
function Card({
  x,
  y,
  w,
  h,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children?: ReactNode;
}) {
  return (
    <Box
      x={x}
      y={y}
      w={w}
      h={h}
      radius={8}
      className="bg-mock-panel"
      style={{
        boxShadow: `inset 0 0 0 ${u(1)} var(--color-mock-line), 0 ${u(2)} ${u(7)} rgb(0 0 0 / 0.18)`,
      }}
    >
      {children}
    </Box>
  );
}

/** The brand tile that carries the clix mark — the original's own logo chip, restated. */
function MarkTile({ x, y, size = 48 }: { x: number; y: number; size?: number }) {
  return (
    <Box
      x={x}
      y={y}
      w={size}
      h={size}
      radius={9}
      className="flex items-center justify-center bg-brand-green text-paper"
    >
      <ClixMark size={u(size * 0.46)} />
    </Box>
  );
}

/* ---- Glyphs. Drawn at the reference's weight; deliberately not anyone's logo. ---------- */

function GlyphCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="m4 12.5 5.5 5.5L20 6.5" />
    </svg>
  );
}

/* The trailing step's indicator: a three-quarter ring. Static, because the source is a still
   frame — a spinning version would be motion the original does not have. */
function GlyphSpinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className="h-full w-full">
      <path d="M21 12a9 9 0 1 1-4.2-7.6" />
    </svg>
  );
}

/* Mock 1's lead chip: the "benchmark" glyph — a ring with a pin through it. */
function GlyphBenchmark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <circle cx="9.5" cy="9" r="5.5" />
      <circle cx="9.5" cy="9" r="1.8" />
      <path d="M14.5 13.5 21 20M21 20h-4.2M21 20v-4.2" />
    </svg>
  );
}

function GlyphDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M12 3v13M6.5 10.5 12 16l5.5-5.5M4 20h16" />
    </svg>
  );
}

/**
 * File-type badges. The original shows the actual PowerPoint and Excel product icons; these
 * are generic lettered badges in the same two colours. At 48px they read identically, and
 * redrawing Microsoft's marks is not something this clone needs to do.
 */
function GlyphFile({ letter, fill }: { letter: string; fill: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect x="2" y="2" width="20" height="20" rx="3" fill={fill} />
      <text
        x="12"
        y="16.8"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="13"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        {letter}
      </text>
    </svg>
  );
}

/* ---- The frame every mock is drawn into ----------------------------------------------- */

function MockFrame({ cropLeft, children }: { cropLeft: number; children: ReactNode }) {
  return (
    /* The art box: the original's own aspect, the dark ground, and the query container that
       `--u` resolves against. */
    <div
      className="relative aspect-[411/521] w-full overflow-hidden bg-forest-deep"
      style={{ containerType: "inline-size" }}
    >
      <div
        className="absolute top-0"
        style={
          {
            "--u": "calc(1cqw / 8.206)",
            left: `calc(${cropLeft} * 1cqw / 8.206)`,
            width: "calc(922cqw / 8.206)",
            height: "calc(1040cqw / 8.206)",
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}

/* ---- Mock 1 — Automations Built To Fit ------------------------------------------------
 * Measured: chip 138,148 650x112 · connector x473 · panel 138,298 650x560 · six rows on an
 * 80px pitch, first centred at y374 · 48px tile at x190, labels at x261.
 */
const RUN_STEPS = [
  "Reading new messages",
  "Checking the CRM",
  "Scoring against your rules",
  "Drafting reply",
] as const;

export function MockWorkflow() {
  return (
    <MockFrame cropLeft={CROP_CENTRED}>
      {/* The workflow being launched. */}
      <Card x={138} y={148} w={650} h={112}>
        <Box x={38} y={40} w={32} h={32} className="text-brand-green">
          <GlyphBenchmark />
        </Box>
        <Line x={90} cy={56} size={36} weight={500} className="text-ink">
          Qualify Inbound WhatsApp Leads
        </Line>
      </Card>

      {/* The tie-line down to the run panel. Off-centre in the original (x473 against a card
          centre of 462.5) — kept, because that asymmetry is visible. */}
      <Box x={473} y={259} w={2} h={40} className="bg-paper" style={{ opacity: 0.94 }} />

      {/* The run itself. */}
      <Card x={138} y={298} w={650} h={560}>
        <MarkTile x={52} y={52} />
        <Line x={123} cy={76} size={36} className="text-muted">
          Running workflow...
        </Line>
        {RUN_STEPS.map((label, i) => (
          <div key={label}>
            <Box x={62.5} y={143 + 80 * i} w={26} h={26} className="text-muted">
              <GlyphCheck />
            </Box>
            <Line x={123} cy={156 + 80 * i} size={36} className="text-muted">
              {label}
            </Line>
          </div>
        ))}
        <Box x={62.5} y={463} w={26} h={26} className="text-brand-green">
          <GlyphSpinner />
        </Box>
        <Line x={123} cy={476} size={36} className="text-muted">
          Syncing to the CRM...
        </Line>
      </Card>
    </MockFrame>
  );
}

/* ---- Mock 2 — Ask Your Own Data --------------------------------------------------------
 * Measured: card 74,140 running off both the right and bottom edges · pill 128,210 767x96 ·
 * tile at 140,361 · prose lines centred at y481/531 · table from 140,597 with a 93px header
 * and 114px rows. The overflow IS the composition — this is the only one of the three cropped
 * from the left, so the table deliberately runs out of frame.
 */
/* Acquisition channels, not companies: the reference named four real manufacturers, and no
   third-party name belongs under this wordmark. Lengths held to the measured ones (16/6/11)
   so the rows keep their optical rhythm and the third still reads as the dimmed one. */
const TABLE_ROWS = [
  { name: "WhatsApp inbound", dim: false },
  { name: "Events", dim: false },
  { name: "Paid search", dim: true },
] as const;

function Checkbox({ x, cy }: { x: number; cy: number }) {
  return (
    <Box
      x={x}
      y={cy - 18}
      w={36}
      h={36}
      radius={7}
      className="bg-paper"
      style={{ boxShadow: `inset 0 0 0 ${u(2)} #d2d2d2` }}
    />
  );
}

export function MockTable() {
  return (
    <MockFrame cropLeft={0}>
      <Card x={74} y={140} w={900} h={1000}>
        {/* The question, as a chat bubble. */}
        <Box x={54} y={70} w={767} h={96} radius={48} className="bg-mock-fill" />
        <Line x={106} cy={118} size={36} className="text-ink">
          Which lead sources actually closed deals?
        </Line>

        <MarkTile x={66} y={221} />
        <Line x={142} cy={245} size={36} className="text-muted">
          Checked 4 systems
        </Line>

        {/* Two explicit lines, not a wrapping paragraph: the break is part of the reference,
            and the second line has to reach past the crop exactly as it does there. */}
        <Line x={63} cy={341} size={36} className="text-ink">
          WhatsApp inbound closed the most deals last quarter, and
        </Line>
        <Line x={63} cy={391} size={36} className="text-ink">
          paid search brought the fewest at the highest cost.
        </Line>

        {/* The table. Its own box, so the header fill and row rules clip to the radius. */}
        <Box
          x={66}
          y={457}
          w={700}
          h={550}
          radius={8}
          className="overflow-hidden bg-mock-panel"
          style={{ boxShadow: `inset 0 0 0 ${u(1)} var(--color-mock-line)` }}
        >
          <Box x={0} y={0} w={700} h={93} className="bg-surface" />
          <Checkbox x={34} cy={46} />
          <Line x={108} cy={46} size={36} className="text-muted">
            Channel
          </Line>
          <Line x={426} cy={46} size={36} className="text-muted">
            % of Pipeline Closed
          </Line>
          {TABLE_ROWS.map((r, i) => (
            <div key={r.name}>
              <Box x={0} y={93 + 114 * i} w={700} h={1} className="bg-mock-line" />
              <Checkbox x={34} cy={150 + 114 * i} />
              <Line
                x={108}
                cy={150 + 114 * i}
                size={36}
                className={r.dim ? "text-muted" : "text-ink"}
              >
                {r.name}
              </Line>
              {/* The figures are blurred out in the reference — a soft bar says "redacted"
                  without inventing numbers we would then have to stand behind. */}
              <Box
                x={426}
                y={137 + 114 * i}
                w={222}
                h={26}
                radius={7}
                className="bg-mock-fill"
                style={{ filter: `blur(${u(3)})` }}
              />
            </div>
          ))}
          <Box x={0} y={435} w={700} h={1} className="bg-mock-line" />
        </Box>
      </Card>
    </MockFrame>
  );
}

/* ---- Mock 3 — Reports On Demand --------------------------------------------------------
 * Measured: chip 102,150 716x130 · panel 102,338 716x564 · prose on a 48px pitch centred at
 * y413.5 · caption at y586 · two 612x106 export rows at y622 and y744, 48px badge at x178,
 * label at x248, download glyph at x702.
 */
/* Extensions kept: the P/X badges above are keyed to .pptx/.xlsx and stop making sense
   without them. Only the names changed, at the measured lengths (24/26 -> 23/24). */
const EXPORTS = [
  { name: "Automation Rollout.pptx", letter: "P", fill: "#c03b1c" },
  { name: "Workflow Run Backup.xlsx", letter: "X", fill: "#10743e" },
] as const;

export function MockMaterial() {
  return (
    <MockFrame cropLeft={CROP_CENTRED}>
      <Card x={102} y={150} w={716} h={130}>
        <MarkTile x={52} y={40} />
        <Line x={126} cy={64} size={36} className="text-muted">
          Assembling the deck...
        </Line>
      </Card>

      <Card x={102} y={338} w={716} h={564}>
        <Line x={53} cy={75.5} size={36} className="text-ink">
          Here is your deck. I built it
        </Line>
        <Line x={53} cy={123.5} size={36} className="text-ink">
          on your own template, and attached
        </Line>
        <Line x={53} cy={171.5} size={36} className="text-ink">
          the source numbers behind every slide.
        </Line>
        <Line x={53} cy={248} size={31} className="text-muted">
          Exports (2)
        </Line>

        {EXPORTS.map((f, i) => (
          <Box
            key={f.name}
            x={52}
            y={284 + 122 * i}
            w={612}
            h={106}
            radius={9}
            className="bg-paper"
            style={{ boxShadow: `inset 0 0 0 ${u(1)} var(--color-mock-line)` }}
          >
            <Box x={24} y={29} w={48} h={48}>
              <GlyphFile letter={f.letter} fill={f.fill} />
            </Box>
            <Line x={94} cy={53} size={36} className="text-ink">
              {f.name}
            </Line>
            <Box x={548} y={40} w={26} h={26} className="text-muted">
              <GlyphDownload />
            </Box>
          </Box>
        ))}
      </Card>
    </MockFrame>
  );
}
