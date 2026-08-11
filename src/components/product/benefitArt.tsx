/**
 * benefitArt — the six illustrations inside /product's `Benefits` block ("AI That Learns How
 * Your Firm Thinks and Works"), Block 4.
 *
 * Capture: docs/reference/target/rogo-product-2026-08-11.html (+ .css).
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md
 *
 * ⚠️ WHAT THE ORIGINALS ARE, AND WHY FIVE OF SIX ARE REBUILT.
 *
 * | # | Benefit | Source | Rendered | Ours |
 * |---|---|---|---|---|
 * | 1 | Integrations | inline def `#svg2107740873_10853`, 299×194 | 213×138 | **vendored** |
 * | 2 | Prompt Library | `Ai1MRBNzdfhFLnx4E0V2bNdUiI.svg`, 280×357 | per tier | rebuilt |
 * | 3 | Guided Implementation | `5HetZbyFL8dnsh9HFTZzwfUpRrk.png`, 416×160 | 128×49 | rebuilt |
 * | 4 | Custom-Trained Models | inline data-URI, 203.48×174 | 203×174 | rebuilt |
 * | 5 | Governance & Permissions | `owjXcQ1FEy8SiPDDgo9j1jx1Yww.svg`, 320×358 | 178×199 | rebuilt |
 * | 6 | Single Tenant Deployment | inline def `#svg-710985286_2997`, 193×253 | 156×204 | rebuilt |
 *
 * #1 is the only one vendored, and for the same reason Block 3's partner marks are: it is a
 * wall of **third-party product logos** (Word, Excel, PowerPoint, SharePoint, Google Drive)
 * that we cannot honestly redraw. It carries no rogo branding at all.
 *
 * The rest are rebuilt because each carries something that must not ship under this wordmark:
 *   · #4 and #6 contain **rogo's own logo mark** — replaced with `ClixMark`.
 *   · #3 contains a **photograph of an identifiable real person** — replaced with a generic
 *     avatar. That is the same line `FEATURE.md`'s gate draws around Block 6's headshots.
 *   · #2 and #5 are **rogo's product UI**, the same category as 2d's three mocks, which the
 *     user's call rebuilt rather than vendored.
 * Geometry throughout is read off the source SVGs, not estimated.
 *
 * SCALING. Every graphic renders at a FIXED pixel size at every tier — measured on the live
 * page — except the prompt list, which has three. So each rebuild is a fixed box carrying
 * `--u` (one source pixel as a CSS length) and children sized `u(sourcePx)`. Same idiom as
 * workflowMocks.tsx, but without container queries: there is nothing fluid to track.
 */

import type { CSSProperties, ReactNode } from "react";
import ClixMark from "@/components/ui/ClixMark";

const u = (n: number) => `calc(${n} * var(--u))`;

/** A fixed-size stage in the source graphic's own coordinate space. */
function Stage({
  w,
  h,
  scale,
  sizeClassName = "",
  className = "",
  style,
  children,
}: {
  /** Source width/height, i.e. the SVG's own viewBox. */
  w: number;
  h: number;
  /** Rendered pixels per source pixel. A string lets a caller vary it per tier. */
  scale: number | string;
  /**
   * Utility classes fixing the box instead of deriving it from `w`/`h` × `scale`. Needed
   * where the original does NOT preserve the source's aspect ratio — the prompt list is
   * 280×357 but renders 290×369, so one scale factor cannot hit both axes.
   */
  sizeClassName?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const unit = typeof scale === "number" ? `${scale}px` : scale;
  return (
    <div
      className={`relative ${sizeClassName} ${className}`}
      style={
        {
          "--u": unit,
          ...(sizeClassName ? {} : { width: u(w), height: u(h) }),
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

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

/** A line of text centred vertically on `cy`, in source coordinates. */
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
  const lh = size * 1.35;
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

/* ---- Small glyphs ---------------------------------------------------------------------- */

function Stroke({ children, viewBox = "0 0 24 24", width = 1.7 }: { children: ReactNode; viewBox?: string; width?: number }) {
  return (
    <svg viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full" aria-hidden="true">
      {children}
    </svg>
  );
}

const GlyphPerson = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full" aria-hidden="true">
    <circle cx="12" cy="8.5" r="4" />
    <path d="M3.6 20.5a8.4 8.4 0 0 1 16.8 0Z" />
  </svg>
);
const GlyphGlobe = () => (
  <Stroke width={1.6}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
  </Stroke>
);
const GlyphBank = () => (
  <Stroke width={1.6}>
    <path d="M3 21h18M6 17v-7m4 7v-7m4 7v-7m4 7v-7m-6-8 8 5H4l8-5Z" />
  </Stroke>
);
const GlyphChart = () => (
  <Stroke width={1.6}>
    <path d="M3 20h18M6 20v-6m5 6V7m5 13v-9" />
  </Stroke>
);
const GlyphPhone = () => (
  <Stroke width={1.6}>
    <path d="M21 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 4.2 2 2 0 0 1 3.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </Stroke>
);
const GlyphFolder = () => (
  <Stroke width={1.6}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  </Stroke>
);
const GlyphDoc = () => (
  <Stroke width={1.6}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5" />
  </Stroke>
);
const GlyphPen = () => (
  <Stroke width={1.6}>
    <path d="M17 3.5a2.1 2.1 0 0 1 3 3L8.5 18 4 20l2-4.5Z" />
  </Stroke>
);
const GlyphCoin = () => (
  <Stroke width={1.6}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10m2.5-7.5H10.8a1.8 1.8 0 0 0 0 3.5h2.4a1.8 1.8 0 0 1 0 3.5H9.5" />
  </Stroke>
);

/* ---- 1 · Integrations ------------------------------------------------------------------
 * Vendored verbatim. Six 92.4px tiles, rx 2.4, in a 3×2 grid inside a 299×194 frame.
 */
export function ArtIntegrations() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/product/benefit-integrations.svg"
      alt=""
      aria-hidden="true"
      width={213}
      height={138}
      className="block h-[138px] w-[213px]"
    />
  );
}

/* ---- 2 · Prompt Library ----------------------------------------------------------------
 * Measured from the source SVG: nine pills at x25, y 12 + 38n, height 32, rx 2, `paper` fill,
 * a 0.5px `#0C0A09`@10% rule. Widths are the source's own, so the stack keeps its ragged
 * right edge even though our labels set narrower than the original's outlined type.
 * The top and bottom fade is the source's alpha mask, restated as a CSS mask.
 */
const PROMPTS: readonly [string, number, () => ReactNode][] = [
  ["Earnings Comp Analysis", 183, GlyphPhone],
  ["Public Company Strip Profile", 211, GlyphBank],
  ["Meeting Prep", 122, GlyphDoc],
  ["Private Company Profile", 183, GlyphBank],
  ["Personal Bio", 117, GlyphPerson],
  ["Financial Sponsor Overview", 204, GlyphCoin],
  ["News Run", 104, GlyphGlobe],
  ["Secondaries Buyer Overview", 210, GlyphCoin],
  ["Proofread My Deck", 155, GlyphPen],
];

export function ArtPrompts() {
  return (
    <Stage
      w={280}
      h={357}
      /* Three measured render sizes: 190×243 phone, 290×369 tablet, 242×308 from 1200 up. */
      scale="var(--prompt-u)"
      /* Measured render boxes, and they are NOT one scale: 190×243 phone, 290×369 tablet,
         242×308 from 1200 up. The source is 280×357, so tablet is 1.036× wide but 1.034×
         tall — Framer sized the two axes independently. Fixing the box in classes and
         scaling the contents separately is the only way to land both. */
      sizeClassName="h-[243px] w-[190px] tablet:h-[369px] tablet:w-[290px] desktop:h-[308px] desktop:w-[242px]"
      className="[--prompt-u:0.6786px] tablet:[--prompt-u:1.0357px] desktop:[--prompt-u:0.8643px] overflow-hidden"
      style={{
        maskImage: "linear-gradient(180deg, transparent 0%, #000 14%, #000 84%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 14%, #000 84%, transparent 100%)",
      }}
    >
      {PROMPTS.map(([label, w, Icon], i) => (
        <Box
          key={label}
          x={25}
          y={12 + 38 * i}
          w={w}
          h={32}
          radius={2}
          className="bg-paper"
          style={{ boxShadow: `inset 0 0 0 ${u(0.5)} var(--color-mock-line)` }}
        >
          <Box x={10} y={9} w={14} h={14} className="text-muted">
            <Icon />
          </Box>
          <Line x={30} cy={16} size={12} className="text-ink">
            {label}
          </Line>
        </Box>
      ))}
    </Stage>
  );
}

/* ---- 3 · Guided Implementation ----------------------------------------------------------
 * Measured off the source PNG: three overlapping circles on the card ground, centres at
 * x 72 / 204 / 336 of a 416×160 frame, diameters 128 / 136 / 144, all centred on y80, each
 * separated by an 8px gap in the ground colour.
 *
 * ⚠️ SUBSTITUTED. The middle circle in the original is a PHOTOGRAPH OF AN IDENTIFIABLE REAL
 * PERSON, and the outer two are its blues. Ours are three token tones with generic avatars —
 * the same line FEATURE.md's gate draws around Block 6's headshots. This is the one graphic
 * in the block that does not attempt to match the original's colour.
 */
const AVATARS = [
  { cx: 72, d: 128, fill: "bg-mark/45" },
  { cx: 204, d: 136, fill: "bg-brand-green" },
  { cx: 336, d: 144, fill: "bg-ink-soft" },
] as const;

export function ArtGuided() {
  return (
    <Stage w={416} h={160} scale={0.3077}>
      {AVATARS.map((a) => (
        <Box
          key={a.cx}
          x={a.cx - a.d / 2}
          y={80 - a.d / 2}
          w={a.d}
          h={a.d}
          className={`flex items-center justify-center rounded-full text-paper ${a.fill}`}
          /* The ring is the card ground showing through, exactly as the source's 8px gaps. */
          style={{ boxShadow: `0 0 0 ${u(8)} var(--color-surface)` }}
        >
          <span className="block" style={{ width: u(a.d * 0.52), height: u(a.d * 0.52) }}>
            <GlyphPerson />
          </span>
        </Box>
      ))}
    </Stage>
  );
}

/* ---- 4 · Custom-Trained Models -----------------------------------------------------------
 * Measured from the source: a 7×3 grid of 22.295px squares on a 28.713 pitch from (4.451,
 * 0.357), stroke 0.71 — some `brand-green`, the rest `#e7e5e4`. Then a scattered dot trail,
 * then the mark tile at (84.843, 138.769), 34.234 square.
 * `GREEN` is the source's own pattern, read off the stroke of each of the 21 paths in order.
 */
const GREEN: readonly (readonly number[])[] = [
  [0, 1, 4, 6],
  [0, 2, 3, 5],
  [1, 3, 6],
];
/* The trail, relative to (97.066, 90.955) — the source's own translate. */
const TRAIL: readonly (readonly [number, number, number])[] = [
  [8.628, 0, 2.876],
  [4.314, 0.719, 1.438],
  [0, 7.909, 2.876],
  [7.19, 10.066, 1.438],
  [4.314, 12.942, 2.157],
  [7.19, 20.132, 1.438],
  [1.438, 20.851, 1.438],
  [5.033, 25.884, 2.876],
  [0.719, 28.76, 2.157],
  [7.909, 32.355, 1.438],
  [4.314, 36.669, 2.157],
];

export function ArtCustomModels() {
  return (
    <Stage w={203.48} h={174} scale={0.9976}>
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4, 5, 6].map((c) => (
          <Box
            key={`${r}-${c}`}
            x={4.451 + 28.713 * c}
            y={0.357 + 28.714 * r}
            w={22.295}
            h={22.295}
            radius={0.36}
            style={{
              boxShadow: `inset 0 0 0 ${u(0.71)} ${
                GREEN[r].includes(c) ? "var(--color-brand-green)" : "var(--color-mock-line)"
              }`,
            }}
          />
        )),
      )}
      {TRAIL.map(([x, y, s]) => (
        <Box
          key={`${x}-${y}`}
          x={97.066 + x}
          y={90.955 + y}
          w={s}
          h={s}
          className="bg-brand-green"
        />
      ))}
      <Box
        x={84.843}
        y={138.769}
        w={34.234}
        h={34.234}
        radius={0.713}
        className="flex items-center justify-center bg-brand-green text-paper"
      >
        <ClixMark size={u(16)} />
      </Box>
    </Stage>
  );
}

/* ---- 5 · Governance & Permissions --------------------------------------------------------
 * Measured from the source SVG: a 320×358 `#FAFAF9` panel; two 129×72 `#F5F5F4` stat boxes at
 * (24,24) and (165,24); five progress rows on a 42px pitch with the bar at y 162+42n, track
 * x24 w271 h4 rx2, filled to 270 / 248 / 213 / 187 / 157.
 * The source's bar green is `#15803D`, a brighter green than anything else on this page; it
 * ships as `brand-green` so the block does not introduce a second accent. Flagged in
 * FEATURE.md.
 */
const SOURCES: readonly [string, number, () => ReactNode][] = [
  ["Web", 270, GlyphGlobe],
  ["SEC Filings", 248, GlyphBank],
  ["Market Data", 213, GlyphChart],
  ["Earnings Transcripts", 187, GlyphPhone],
  ["File Library", 157, GlyphFolder],
];

function Stat({ x, label, value, delta }: { x: number; label: string; value: string; delta: string }) {
  return (
    <Box x={x} y={24} w={129} h={72} radius={2} className="bg-surface">
      <Line x={16} cy={21} size={11} className="text-muted">
        {label}
      </Line>
      {/* Baseline-aligned pair, so the delta sits on the number's baseline whatever its
          width — the source has them optically aligned and a computed x would be a guess. */}
      <div
        className="absolute flex items-baseline font-sans"
        style={{ left: u(16), top: u(34), gap: u(6) }}
      >
        <span className="text-ink" style={{ fontSize: u(26), lineHeight: u(30), letterSpacing: "-0.02em" }}>
          {value}
        </span>
        <span className="text-brand-green" style={{ fontSize: u(11), lineHeight: u(14) }}>
          {delta}
        </span>
      </div>
    </Box>
  );
}

export function ArtGovernance() {
  return (
    <Stage w={320} h={358} scale={0.5563} className="bg-mock-panel" style={{ borderRadius: "2px" }}>
      <Stat x={24} label="Active Users" value="122" delta="+6" />
      <Stat x={165} label="Queries" value="3.1k" delta="+135" />
      <Line x={24} cy={119} size={11} className="text-muted">
        Top data sources
      </Line>
      {SOURCES.map(([label, fill, Icon], i) => (
        <div key={label}>
          <Box x={24} y={162 + 42 * i - 20} w={12} h={12} className="text-muted">
            <Icon />
          </Box>
          <Line x={42} cy={162 + 42 * i - 14} size={11} className="text-ink">
            {label}
          </Line>
          <Box x={24} y={162 + 42 * i} w={271} h={4} radius={2} className="bg-surface" />
          <Box x={24} y={162 + 42 * i} w={fill} h={4} radius={2} className="bg-brand-green" />
        </div>
      ))}
    </Stage>
  );
}

/* ---- 6 · Single Tenant Deployment --------------------------------------------------------
 * Measured from the source: mark tile 47.613 square at (73,19); a 3×3 grid of 46.621 cells on
 * a 55.548 pitch from (17.641, 87.496), stroke 0.992 `#A8A29E`@25% — which is exactly the
 * `hairline` token; a 14.879 ring centred in each. The centre cell is the selected one: its
 * border is `brand-green` and its dot is FILLED, at 15.871 rather than 14.879.
 */
export function ArtTenant() {
  return (
    <Stage w={193} h={253} scale={0.8083}>
      <Box
        x={73}
        y={19}
        w={47.613}
        h={47.613}
        radius={0.992}
        className="flex items-center justify-center bg-brand-green text-paper"
      >
        <ClixMark size={u(22)} />
      </Box>
      {/* The tie-line from the tile down to the selected cell. */}
      <Box x={96.3} y={66.6} w={0.992} h={20.9} className="bg-brand-green" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => {
          const on = r === 0 && c === 1;
          const x = 17.641 + 55.548 * c;
          const y = 87.496 + 55.548 * r;
          const d = on ? 15.871 : 14.879;
          return (
            <Box
              key={`${r}-${c}`}
              x={x}
              y={y}
              w={46.621}
              h={46.621}
              radius={0.496}
              className="flex items-center justify-center"
              style={{
                boxShadow: `inset 0 0 0 ${u(0.992)} ${
                  on ? "var(--color-brand-green)" : "var(--color-hairline)"
                }`,
              }}
            >
              <div
                className={`rounded-full ${on ? "bg-brand-green" : ""}`}
                style={{
                  width: u(d),
                  height: u(d),
                  boxShadow: on ? undefined : `inset 0 0 0 ${u(0.992)} var(--color-hairline)`,
                }}
              />
            </Box>
          );
        }),
      )}
    </Stage>
  );
}
