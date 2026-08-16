/**
 * serviceArt — the eight animated presentations inside `CompanyServices`, one per service.
 *
 * WHAT THIS IS. The band used to be eight 164px tiles holding a label and a 32px mark. On the
 * user's call (2026-08-16) it became eight cards, each carrying a scene that shows what the
 * service actually produces. The brief named its own reference: the `#services` band on
 * `clix-main-page.vercel.app` ("פתרון מותאם לכל עסק."), where every card holds a small piece of
 * product UI instead of an icon.
 *
 * ⚠️ THE SCENES ARE SOURCED, NOT INVENTED. clix's own services page already ships a distinct UI
 * mock per service, and the capture in `docs/reference/clixsolutions/content.json`
 * (`services.bodyText`) records what each one contains. Seven of the eight below are rebuilds
 * of those:
 *
 *   | # | Service            | Source mock, as the capture records it                        |
 *   |---|--------------------|---------------------------------------------------------------|
 *   | 1 | AI Agents          | `Agent OS · AI workforce`, roster of 4 with latency + status  |
 *   | 2 | WhatsApp           | chat thread, delivery ticks, catalog row                       |
 *   | 3 | CRM                | `CRM · Q3`, `+38%`, `Deals 63`, `Pipeline $1.2m`, `Won $480k` |
 *   | 4 | Integrations       | `new-lead.workflow · v1.4`, `5 nodes 4 links`, the node chain  |
 *   | 5 | Web Development    | browser at `clixsolution.com`, `98 PSI`, `+24% conversion`     |
 *   | 6 | Mobile Development | ⚠️ **NONE — the capture describes no artwork for this one.**   |
 *   | 7 | Custom Software    | editor: `dashboard.tsx`, file tree, `main · TypeScript`, `build ok` |
 *   | 8 | AI Strategy        | `78 ai ready`, 5 scores 82/64/91/58/73, `SOC 2 · GDPR`         |
 *
 * #6 is the band's one designed scene, built from that service's own bullet list (React Native,
 * push notifications, deep links, offline sync). Flagged in features/company-page/FEATURE.md.
 *
 * ─── THE SCENES CARRY ALMOST NO PROSE, AND THAT IS THE DESIGN ────────────────────────────────
 *
 * Everything sentence-shaped renders as a grey bar; only MACHINE TOKENS are set as type
 * (`POST /lead`, `dashboard.tsx`, `$1.2m`, `98`, `1.2s`). Three reasons, and the first is the
 * one that decided it:
 *
 *   1. These eight scenes are LOCALE-FREE. Machine tokens stay Latin in every locale — the rule
 *      `workflowMocks.tsx` already states and /clix's tool row already follows — so there is not
 *      one new dictionary key here, and no Hebrew line-fitting risk across eight new boxes.
 *   2. The real site's chat mock is a stock template in someone else's business ("2 kurtas",
 *      "Rs.1200"). Porting its words would be borrowing copy; porting its SHAPE is the rebuild.
 *   3. The reference band does the same — three of its four arts are grey bars and window
 *      chrome, with no readable sentence anywhere.
 *
 * ─── COORDINATES: 280 × 168, SCALED BY CONTAINER QUERY ───────────────────────────────────────
 *
 * Every scene is drawn in one 280 × 168 source box and every dimension is written `u(n)`, the
 * same idiom as `product/benefitArt.tsx` and `product/workflowMocks.tsx`. `Stage` makes itself a
 * query container and hands its children `--u = 1cqw / 2.8`, so the art SCALES with the card
 * rather than reflowing inside it — which it has to, because the card is ~304 / 464 / 358 px
 * wide across the three tiers. The stage caps at 280px so it never outgrows the art well.
 *
 * ⚠️ RADII INSIDE A SCENE ARE DEPICTION, NOT STYLE. This site is square-cornered
 * (`--radius-none` is the default and the card itself is square). The small radii below are
 * drawing OTHER software's chrome — a chat bubble, a browser pill, a handset — the same licence
 * `workflowMocks.tsx` takes when it reproduces a card corner read off a screenshot.
 *
 * ─── RTL ─────────────────────────────────────────────────────────────────────────────────────
 *
 * `Box` and `Line` take source-LTR `x` and resolve it with `inset-inline-start`, so every scene
 * mirrors for free with no `280 - x - w` arithmetic anywhere. `end` flips a child to
 * `inset-inline-end` for the things that hang off the trailing edge. All eight scenes mirror:
 * the horizontal axis carries reading order in every one of them, and none depicts a foreign
 * product's fixed chrome.
 *
 * ─── MOTION: THREE KEYFRAMES, SHARED BY ALL EIGHT ────────────────────────────────────────────
 *
 * Declared in `src/app/globals.css` — read that block before retuning anything here. No GSAP, no
 * framer-motion (not installed), no IntersectionObserver, and NO `"use client"`: this file is
 * server-rendered like `benefitArt.tsx`, for the same reason.
 *
 *   · `service-step`  — an OVERLAY's opacity 0 → 1 → 0. The workhorse. Staggered by
 *                       `animationDelay` it reads as a sequence advancing: roster rows, chat
 *                       bubbles, flow nodes, code lines, score rows.
 *   · `service-pulse` — a live dot, opacity 1 → 0.3 → 1.
 *   · `service-rise`  — `translateY(0 → -2 → 0)`, on the one "result" element per scene.
 *
 * ⚠️ THE INVARIANT, INHERITED VERBATIM FROM /product's SIX BENEFIT LOOPS: **every keyframe's
 * base state is the shipped static design.** The step overlays sit at `opacity: 0`, so the
 * unanimated picture is the clean, complete scene — never a half-drawn one. That is what makes
 * the global reduced-motion clamp (globals.css) an exact no-op rather than a degradation, and
 * what makes SSR first paint the finished picture.
 *
 * ⚠️ OPACITY AND translateY ONLY — Y because it is the one axis that does not flip under RTL,
 * and both because ~40 loops run at once when this band is on screen. Nothing here animates a
 * width, a colour or a box-shadow.
 *
 * Spec: features/company-page/FEATURE.md ("Block 3") · memory: features/company-page/CONTEXT.md
 */

import type { CSSProperties, ReactNode } from "react";

/* One source pixel, as a CSS length. */
const u = (n: number) => `calc(${n} * var(--u))`;

/**
 * THE CARD'S ACCENT. Each `<li>` in CompanyServices sets `--accent` to one of the eight
 * `--color-svc-*` tokens; nothing in this file knows or cares which. The fallback is `ink`, so
 * a scene rendered outside a card degrades to the monochrome version it was built as rather
 * than to an invalid colour.
 *
 * ⚠️ WHERE AN ACCENT IS ALLOWED, and the list is deliberately short — the restraint is the
 * design. A scene's accent paints only: its live dot, its ONE outcome element, its primary bar
 * fill, and the travelling highlight. Every other bar, every label and all card chrome stay
 * `ink` / `muted`. Eight cards each shouting in their own colour would be worse than the
 * monochrome band this replaced.
 */
const ACCENT = "var(--accent, var(--color-ink))";

/** The accent at a given alpha — for washes behind a chip or under the travelling highlight. */
const wash = (pct: number) => `color-mix(in srgb, ${ACCENT} ${pct}%, transparent)`;

const SRC_W = 280;
const SRC_H = 168;

/* ---- Primitives ------------------------------------------------------------------------- */

/**
 * The 280 × 168 stage.
 *
 * `container-type: inline-size` is on the OUTER element and `--u` on the inner one, because an
 * element establishes a query container for its DESCENDANTS and not for itself — declaring
 * `1cqw` on the same node would resolve against the ancestor and silently mis-scale.
 */
function Stage({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative w-full max-w-[280px] [container-type:inline-size]"
      style={{ aspectRatio: `${SRC_W} / ${SRC_H}` }}
    >
      <div
        className="absolute inset-0"
        style={{ "--u": `calc(1cqw / ${SRC_W / 100})` } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

/** An absolutely-placed box in source coordinates, measured from the INLINE START (or end). */
function Box({
  x,
  y,
  w,
  h,
  radius,
  end = false,
  className = "",
  style,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  radius?: number;
  /** Anchor to the inline END instead — for the things that hang off the trailing edge. */
  end?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        [end ? "insetInlineEnd" : "insetInlineStart"]: u(x),
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

/** A machine token, vertically centred on `cy`. `whitespace-nowrap`, so it cannot gain a line. */
function Line({
  x,
  cy,
  size,
  end = false,
  weight = 400,
  className = "",
  style,
  children,
}: {
  x: number;
  cy: number;
  size: number;
  end?: boolean;
  weight?: number;
  className?: string;
  /** The accent escape hatch — `color` only. Geometry stays in the props above. */
  style?: CSSProperties;
  children: ReactNode;
}) {
  const lh = size * 1.35;
  return (
    <div
      className={`absolute whitespace-nowrap font-sans ${className}`}
      style={{
        [end ? "insetInlineEnd" : "insetInlineStart"]: u(x),
        top: u(cy - lh / 2),
        fontSize: u(size),
        lineHeight: u(lh),
        fontWeight: weight,
        letterSpacing: "-0.01em",
        /* Machine tokens are Latin in every locale, so they must read LTR even on /he. */
        direction: "ltr",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A grey bar — anything that would otherwise be a sentence. */
function Bar({
  x,
  y,
  w,
  h = 5,
  end = false,
  tone = "line",
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  end?: boolean;
  /** `ink` for the primary run of a block, `line` for its supporting runs. */
  tone?: "ink" | "line";
}) {
  return (
    <Box
      x={x}
      y={y}
      w={w}
      h={h}
      radius={h / 2}
      end={end}
      className={tone === "ink" ? "bg-ink/25" : "bg-mock-line"}
    />
  );
}

/** The panel every scene that depicts an application window sits on. */
function Panel({ children }: { children: ReactNode }) {
  return (
    <Box
      x={0}
      y={0}
      w={SRC_W}
      h={SRC_H}
      radius={6}
      className="overflow-hidden border border-mock-line bg-mock-panel"
    >
      {children}
    </Box>
  );
}

/**
 * The travelling highlight. `opacity: 0` at rest — so the scene WITHOUT it is the finished
 * picture — and `service-step` takes it to 1 and back on its own slot of the cycle.
 */
function Step({
  x,
  y,
  w,
  h,
  radius = 4,
  delay,
  cycle,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  radius?: number;
  /** Seconds into the cycle at which this element takes its turn. */
  delay: number;
  /** Total loop length in seconds. Every Step in one scene must share it. */
  cycle: number;
}) {
  return (
    <Box
      x={x}
      y={y}
      w={w}
      h={h}
      radius={radius}
      className="pointer-events-none"
      style={{
        opacity: 0,
        backgroundColor: wash(13),
        animation: `service-step ${cycle}s linear ${delay}s infinite`,
      }}
    />
  );
}

/** A live indicator. Base state is fully lit, so reduced motion leaves it simply "on". */
function Dot({ x, cy, r = 2.5, end = false }: { x: number; cy: number; r?: number; end?: boolean }) {
  return (
    <Box
      x={x}
      y={cy - r}
      w={r * 2}
      h={r * 2}
      radius={r}
      end={end}
      style={{
        backgroundColor: ACCENT,
        animation: "service-pulse 2.4s ease-in-out infinite",
      }}
    />
  );
}

/** The one element per scene that reads as the OUTCOME. Lifts 2 source px and settles. */
const RISE: CSSProperties = { animation: "service-rise 3.6s ease-in-out infinite" };

/** A scene's header strip: a hairline-separated 26px band across the top of a Panel. */
function Header({ children }: { children: ReactNode }) {
  return (
    <>
      <Box x={0} y={0} w={SRC_W} h={26} className="border-b border-mock-line bg-white/60" />
      {children}
    </>
  );
}

const TOKEN = "text-ink";
const TOKEN_MUTED = "text-muted";

/* ---- 1 · AI Agents — the `Agent OS` roster --------------------------------------------- */
/* Source: `services.bodyText` block 01 — "Agent OS · AI workforce", "8 active", and four
   agents each with a latency and a state. Names render as bars; the latencies and states are
   machine tokens and stay. The highlight walks the roster, one agent per 1.4s. */

const ROSTER: readonly { state: string; ms: string; name: number; sub: number }[] = [
  { state: "writing", ms: "1.2s", name: 74, sub: 46 },
  { state: "thinking", ms: "0.8s", name: 90, sub: 38 },
  { state: "routed", ms: "0.3s", name: 62, sub: 52 },
  { state: "booked", ms: "2.1s", name: 82, sub: 44 },
];

export function ArtAgents() {
  const CYCLE = 5.6;
  return (
    <Stage>
      <Panel>
        <Header>
          <Dot x={12} cy={13} />
          <Line x={22} cy={13} size={9} weight={500} className={TOKEN}>
            Agent OS
          </Line>
          <Line x={12} cy={13} size={8} end style={{ color: ACCENT }}>
            8 active
          </Line>
        </Header>

        {ROSTER.map((row, i) => {
          const y = 34 + i * 32;
          return (
            <Box key={row.state} x={0} y={y} w={SRC_W} h={32}>
              <Step x={8} y={2} w={264} h={28} delay={i * (5.6 / 4)} cycle={CYCLE} />
              {/* Avatar tile — the agent, as a shape rather than a face. */}
              <Box x={14} y={7} w={18} h={18} radius={4} className="bg-mock-line" />
              <Bar x={40} y={11} w={row.name} tone="ink" />
              <Bar x={40} y={21} w={row.sub} h={4} />
              <Line x={44} cy={16} size={8} end className={TOKEN}>
                {row.ms}
              </Line>
              <Line x={12} cy={16} size={8} end className={TOKEN_MUTED}>
                {row.state}
              </Line>
              {i < ROSTER.length - 1 && (
                <Box x={14} y={31} w={252} h={1} className="bg-mock-line" />
              )}
            </Box>
          );
        })}
      </Panel>
    </Stage>
  );
}

/* ---- 2 · WhatsApp Automation — the thread ---------------------------------------------- */
/* Source: block 02 — an inbound message, a reply, delivery ticks, and a line confirming the
   exchange was written back to the CRM. The words are the template's, not clix's, so they are
   bars; the ticks and `CRM` carry the meaning. No panel: a thread has no window chrome. */

export function ArtWhatsApp() {
  const CYCLE = 4.5;
  return (
    <Stage>
      {/* Inbound — start-aligned, square corner on the leading top edge. */}
      <Box
        x={0}
        y={4}
        w={148}
        h={40}
        radius={10}
        className="border border-mock-line bg-mock-fill"
        style={{ borderStartStartRadius: u(3) }}
      >
        <Bar x={12} y={13} w={112} tone="ink" />
        <Bar x={12} y={25} w={72} h={4} />
      </Box>
      <Step x={0} y={4} w={148} h={40} radius={10} delay={0} cycle={CYCLE} />

      {/* Reply — end-aligned, with the delivery pair. */}
      <Box
        x={0}
        y={52}
        w={162}
        h={40}
        radius={10}
        end
        className="border border-mock-line bg-white"
        style={{ borderEndEndRadius: u(3) }}
      >
        <Bar x={12} y={13} w={126} tone="ink" />
        <Bar x={12} y={25} w={64} h={4} />
        {/* ✓✓ — drawn, not typed, so it needs no font that carries the glyph. */}
        <Box x={10} y={24} w={14} h={8} end>
          <svg viewBox="0 0 14 8" className="h-full w-full" aria-hidden="true" focusable="false">
            <path
              d="M0.8 4.2 3.4 6.8 8.4 1.2M5.6 4.2 8.2 6.8 13.2 1.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: ACCENT }}
            />
          </svg>
        </Box>
      </Box>
      <Step x={0} y={52} w={162} h={40} radius={10} delay={1.15} cycle={CYCLE} />

      {/* A short follow-up, so the thread reads as a conversation and not a pair. */}
      <Box
        x={0}
        y={100}
        w={112}
        h={28}
        radius={10}
        className="border border-mock-line bg-mock-fill"
        style={{ borderStartStartRadius: u(3) }}
      >
        <Bar x={12} y={12} w={78} tone="ink" />
      </Box>
      <Step x={0} y={100} w={112} h={28} radius={10} delay={2.3} cycle={CYCLE} />

      {/* THE OUTCOME — the exchange landed in the CRM. This is the scene's `rise`. */}
      <Box x={0} y={140} w={SRC_W} h={16} style={RISE}>
        <Dot x={2} cy={8} r={2} />
        <Bar x={12} y={6} w={96} h={4} />
        <Line x={0} cy={8} size={8} end style={{ color: ACCENT }}>
          CRM
        </Line>
      </Box>
    </Stage>
  );
}

/* ---- 3 · CRM Implementation — the quarter board ---------------------------------------- */
/* Source: block 03 — `CRM · Q3`, `+38%`, `Deals 63`, `Pipeline $1.2m`, `Won $480k`. The four
   pipeline stages under the KPI row are the same block's "pipeline, automations and reports". */

const STAGES: readonly number[] = [148, 116, 84, 52];

export function ArtCRM() {
  const CYCLE = 5.2;
  return (
    <Stage>
      <Panel>
        <Header>
          <Dot x={12} cy={13} />
          <Line x={22} cy={13} size={9} weight={500} className={TOKEN}>
            CRM · Q3
          </Line>
          <Box
            x={10}
            y={5}
            w={34}
            h={16}
            radius={8}
            end
            style={{ ...RISE, backgroundColor: wash(14) }}
          >
            <Line
              x={0}
              cy={8}
              size={8}
              weight={500}
              className="w-full text-center"
              style={{ color: ACCENT }}
            >
              +38%
            </Line>
          </Box>
        </Header>

        {/* Three KPI tiles — label as a bar, value as a machine token. */}
        {[
          { x: 12, v: "63" },
          { x: 100, v: "$1.2m" },
          { x: 188, v: "$480k" },
        ].map((k) => (
          <Box
            key={k.v}
            x={k.x}
            y={36}
            w={80}
            h={38}
            radius={4}
            className="border border-mock-line bg-white"
          >
            <Bar x={10} y={10} w={34} h={4} />
            <Line x={10} cy={26} size={12} weight={500} className={TOKEN}>
              {k.v}
            </Line>
          </Box>
        ))}

        {/* The pipeline. Every bar sits at its measured length at rest — the loop is a
            highlight travelling down them, never a bar growing, so nothing depends on a
            transform origin that would have to flip under RTL. */}
        {STAGES.map((w, i) => {
          const y = 86 + i * 19;
          return (
            <Box key={w} x={0} y={y} w={SRC_W} h={19}>
              <Step x={8} y={0} w={264} h={18} radius={3} delay={i * 1.3} cycle={CYCLE} />
              <Bar x={14} y={7} w={38} h={4} />
              <Box x={62} y={5} w={168} h={8} radius={4} className="bg-mock-line" />
              <Box x={62} y={5} w={w} h={8} radius={4} style={{ backgroundColor: ACCENT }} />
            </Box>
          );
        })}
      </Panel>
    </Stage>
  );
}

/* ---- 4 · Integrations — the workflow chain --------------------------------------------- */
/* Source: block 04 — `new-lead.workflow · v1.4`, `5 nodes 4 links`, and the chain itself:
   Webhook `POST /lead` → AI parse → HubSpot → Slack → Gmail. Every node name is a product or a
   verb the workflow editor prints, so all five stay as tokens. The lights walk the chain,
   which is the closest RTL-safe reading of the reference band's marching-ants wire. */

const NODES: readonly { label: string; note?: string }[] = [
  { label: "Webhook", note: "POST /lead" },
  { label: "AI parse" },
  { label: "HubSpot" },
  { label: "Slack" },
  { label: "Gmail" },
];

export function ArtIntegrations() {
  const CYCLE = 4.5;
  return (
    <Stage>
      <Panel>
        <Header>
          <Line x={12} cy={13} size={9} weight={500} className={TOKEN}>
            new-lead.workflow
          </Line>
          <Line x={12} cy={13} size={8} end className={TOKEN_MUTED}>
            5 nodes · 4 links
          </Line>
        </Header>

        {/* The wire, behind the nodes — one run from the first node's centre to the last. */}
        <Box x={40} y={44} w={1} h={104} className="bg-mock-line" />

        {NODES.map((n, i) => {
          const y = 34 + i * 26;
          return (
            <Box key={n.label} x={0} y={y} w={SRC_W} h={26}>
              <Step x={22} y={1} w={216} h={20} radius={3} delay={i * 0.9} cycle={CYCLE} />
              <Box
                x={36}
                y={5}
                w={9}
                h={9}
                radius={4.5}
                className="border-2 bg-white"
                style={{ borderColor: ACCENT }}
              />
              <Line x={54} cy={10} size={9} className={TOKEN}>
                {n.label}
              </Line>
              {n.note && (
                <Line x={36} cy={10} size={8} end className={TOKEN_MUTED}>
                  {n.note}
                </Line>
              )}
            </Box>
          );
        })}
      </Panel>
    </Stage>
  );
}

/* ---- 5 · Web Development — the browser -------------------------------------------------- */
/* Source: block 05 — a browser at `clixsolution.com`, a `98` Lighthouse score, and
   `+24% conversion`. The page inside is bars; the three blocks light in sequence, which reads
   as the paint the score is about. */

export function ArtWeb() {
  const CYCLE = 3.9;
  return (
    <Stage>
      <Panel>
        {/* Chrome. Three dots and an address pill — the one piece of another product's
            furniture in the file, and it is generic browser chrome, not a brand's. */}
        <Box x={0} y={0} w={SRC_W} h={22} className="border-b border-mock-line bg-white/60" />
        {[10, 19, 28].map((x) => (
          <Box key={x} x={x} y={9} w={5} h={5} radius={2.5} className="bg-mock-line" />
        ))}
        <Box x={44} y={5} w={150} h={13} radius={6.5} className="bg-surface">
          <Line x={8} cy={6.5} size={7} className={TOKEN_MUTED}>
            clixsolution.com
          </Line>
        </Box>

        {/* The page. */}
        <Box x={0} y={22} w={SRC_W} h={146} className="bg-white" />
        <Step x={12} y={32} w={166} h={26} radius={3} delay={0} cycle={CYCLE} />
        <Bar x={14} y={34} w={150} h={7} tone="ink" />
        <Bar x={14} y={48} w={104} h={5} />

        <Step x={12} y={66} w={128} h={50} radius={3} delay={1.3} cycle={CYCLE} />
        <Box x={14} y={68} w={124} h={46} radius={3} className="bg-surface" />

        <Step x={148} y={66} w={120} h={50} radius={3} delay={2.6} cycle={CYCLE} />
        {[150, 210].map((x) => (
          <Box key={x} x={x} y={68} w={56} h={46} radius={3} className="border border-mock-line">
            <Bar x={8} y={10} w={30} h={4} tone="ink" />
            <Bar x={8} y={20} w={20} h={4} />
          </Box>
        ))}

        <Bar x={14} y={126} w={172} h={5} />
        <Bar x={14} y={138} w={132} h={5} />

        {/* THE OUTCOME — the score dial and the lift it bought. */}
        <Box
          x={14}
          y={120}
          w={40}
          h={40}
          radius={20}
          end
          className="border-2 bg-white"
          style={{ ...RISE, borderColor: ACCENT }}
        >
          <Line
            x={0}
            cy={16}
            size={14}
            weight={500}
            className="w-full text-center"
            style={{ color: ACCENT }}
          >
            98
          </Line>
          <Line x={0} cy={29} size={6} className={`w-full text-center ${TOKEN_MUTED}`}>
            PSI
          </Line>
        </Box>
        <Line x={14} cy={150} size={8} style={{ color: ACCENT }}>
          +24% conversion
        </Line>
      </Panel>
    </Stage>
  );
}

/* ---- 6 · Mobile Development — the handset ---------------------------------------------- */
/* ⚠️ THE ONE DESIGNED SCENE. The capture describes artwork for the other seven blocks and
   nothing for this one, so this is built from block 06's own bullet list instead: native apps,
   push notifications, deep links, offline-first sync. Recorded as a deviation in FEATURE.md —
   it is the only place on this band where the picture is ours rather than the company's. */

export function ArtMobile() {
  const CYCLE = 5.1;
  return (
    <Stage>
      {/* The handset, centred so the scene reads the same mirrored. */}
      <Box
        x={104}
        y={6}
        w={72}
        h={156}
        radius={11}
        className="border-2 border-ink/25 bg-mock-panel"
      >
        <Box x={26} y={8} w={20} h={3} radius={1.5} className="bg-ink/20" />
        {/* Screen content — a header block and two rows, each taking its turn. */}
        <Step x={8} y={18} w={52} h={30} radius={3} delay={0} cycle={CYCLE} />
        <Box x={10} y={20} w={48} h={26} radius={3} className="bg-white" />
        <Bar x={14} y={26} w={30} h={4} tone="ink" />
        <Bar x={14} y={35} w={20} h={3} />

        <Step x={8} y={54} w={52} h={22} radius={3} delay={1.7} cycle={CYCLE} />
        <Bar x={14} y={60} w={40} h={4} tone="ink" />
        <Bar x={14} y={68} w={26} h={3} />

        <Step x={8} y={82} w={52} h={22} radius={3} delay={3.4} cycle={CYCLE} />
        <Bar x={14} y={88} w={36} h={4} tone="ink" />
        <Bar x={14} y={96} w={30} h={3} />

        {/* Tab bar. */}
        <Box x={4} y={126} w={60} h={22} radius={4} className="bg-white" />
        {[12, 30, 48].map((x, i) => (
          <Box
            key={x}
            x={x}
            y={133}
            w={8}
            h={8}
            radius={2}
            className={i === 0 ? "" : "bg-mock-line"}
            style={i === 0 ? { backgroundColor: ACCENT } : undefined}
          />
        ))}
      </Box>

      {/* A push notification, arriving beside the device — the scene's `rise`. */}
      <Box
        x={0}
        y={26}
        w={92}
        h={34}
        radius={6}
        className="border border-mock-line bg-white"
        style={RISE}
      >
        <Box x={9} y={9} w={16} h={16} radius={4} style={{ backgroundColor: wash(30) }} />
        <Bar x={32} y={11} w={44} h={4} tone="ink" />
        <Bar x={32} y={20} w={30} h={4} />
      </Box>

      {/* A deep link and an offline-sync marker, so the three bullets are all present. */}
      <Box x={0} y={74} w={78} h={26} radius={6} className="border border-mock-line bg-white">
        <Bar x={10} y={8} w={40} h={4} tone="ink" />
        <Bar x={10} y={16} w={24} h={3} />
      </Box>
      <Box x={0} y={112} w={64} h={26} radius={6} className="border border-mock-line bg-white">
        <Dot x={10} cy={13} r={2.5} />
        <Bar x={20} y={11} w={32} h={4} />
      </Box>
    </Stage>
  );
}

/* ---- 7 · Custom Software — the editor --------------------------------------------------- */
/* Source: block 07 — `dashboard.tsx`, an Explorer listing `api.ts` / `types.ts` / `schema.sql`,
   seven numbered lines, and a status bar reading `main · TypeScript` / `build ok`. The code is
   bars; the filenames and the status are tokens. Four lines type themselves in turn. */

const CODE: readonly { w: number; indent: number; tone: "ink" | "line" }[] = [
  { w: 104, indent: 0, tone: "ink" },
  { w: 72, indent: 10, tone: "line" },
  { w: 132, indent: 10, tone: "ink" },
  { w: 56, indent: 20, tone: "line" },
  { w: 96, indent: 20, tone: "ink" },
  { w: 120, indent: 10, tone: "line" },
  { w: 64, indent: 0, tone: "ink" },
];

export function ArtSoftware() {
  const CYCLE = 4.8;
  /* Lines 2, 4, 5 and 7 take a turn; a tab that lit every line would read as a scan, not a
     hand typing. Indices into CODE. */
  const TYPED = [1, 3, 4, 6];
  return (
    <Stage>
      <Panel>
        {/* Tab strip. */}
        <Box x={0} y={0} w={SRC_W} h={20} className="border-b border-mock-line bg-surface" />
        <Box
          x={8}
          y={0}
          w={78}
          h={20}
          className="border-b-2 bg-mock-panel"
          style={{ borderColor: ACCENT }}
        >
          <Line x={9} cy={10} size={8} className={TOKEN}>
            dashboard.tsx
          </Line>
        </Box>
        <Line x={12} cy={10} size={7} end className={TOKEN_MUTED}>
          api.ts · types.ts · schema.sql
        </Line>

        {/* Gutter. */}
        <Box x={0} y={20} w={22} h={126} className="border-e border-mock-line bg-surface" />
        {CODE.map((_, i) => (
          <Line key={i} x={9} cy={32 + i * 16} size={7} className={TOKEN_MUTED}>
            {i + 1}
          </Line>
        ))}

        {/* Code. */}
        {CODE.map((c, i) => {
          const slot = TYPED.indexOf(i);
          return (
            <Box key={i} x={0} y={24 + i * 16} w={SRC_W} h={16}>
              {slot > -1 && (
                <Step
                  x={26}
                  y={1}
                  w={240}
                  h={13}
                  radius={2}
                  delay={slot * (4.8 / 4)}
                  cycle={CYCLE}
                />
              )}
              <Bar x={30 + c.indent} y={6} w={c.w} h={5} tone={c.tone} />
            </Box>
          );
        })}

        {/* Status bar — the scene's `rise`, because a green build is the outcome. */}
        <Box x={0} y={146} w={SRC_W} h={22} className="border-t border-mock-line bg-white/70">
          <Line x={12} cy={11} size={7} className={TOKEN_MUTED}>
            main · TypeScript
          </Line>
          <Box
            x={12}
            y={3}
            w={48}
            h={16}
            radius={8}
            end
            style={{ ...RISE, backgroundColor: wash(14) }}
          >
            <Dot x={7} cy={8} r={2} />
            <Line x={14} cy={8} size={7} style={{ color: ACCENT }}>
              build ok
            </Line>
          </Box>
        </Box>
      </Panel>
    </Stage>
  );
}

/* ---- 8 · AI Strategy — the readiness brief ---------------------------------------------- */
/* Source: block 08 — `ai strategy · q3 brief`, `draft`, five scored areas (Data quality 82,
   Talent depth 64, Tooling 91, Process maturity 58, Governance 73), an overall `78 ai ready`
   and a `SOC 2 · GDPR` risk note. The area names are bars; every number is a token. The bars
   sit at their scored lengths at rest — the loop reads them out, one row at a time. */

const SCORES: readonly { v: number; label: number }[] = [
  { v: 82, label: 46 },
  { v: 64, label: 38 },
  { v: 91, label: 30 },
  { v: 58, label: 52 },
  { v: 73, label: 42 },
];

export function ArtStrategy() {
  const CYCLE = 6;
  /* 132 source px is the full-score track, so a value maps to `v / 100 * 132`. */
  const track = 132;
  return (
    <Stage>
      <Panel>
        <Header>
          <Line x={12} cy={13} size={9} weight={500} className={TOKEN}>
            ai strategy · q3
          </Line>
          <Box x={10} y={6} w={32} h={14} radius={7} end className="bg-mock-line">
            <Line x={0} cy={7} size={7} className={`w-full text-center ${TOKEN_MUTED}`}>
              draft
            </Line>
          </Box>
        </Header>

        {SCORES.map((s, i) => {
          const y = 32 + i * 20;
          return (
            <Box key={s.v} x={0} y={y} w={SRC_W} h={20}>
              <Step x={8} y={1} w={264} h={18} radius={3} delay={i * 1.2} cycle={CYCLE} />
              <Bar x={14} y={8} w={s.label} h={4} />
              <Box x={82} y={6} w={track} h={7} radius={3.5} className="bg-mock-line" />
              <Box
                x={82}
                y={6}
                w={(s.v / 100) * track}
                h={7}
                radius={3.5}
                style={{ backgroundColor: ACCENT }}
              />
              <Line x={12} cy={10} size={8} end className={TOKEN}>
                {s.v}
              </Line>
            </Box>
          );
        })}

        {/* THE OUTCOME — the overall verdict and what it was reviewed against. */}
        <Box x={0} y={136} w={SRC_W} h={32} className="border-t border-mock-line bg-white/70">
          <Box
            x={12}
            y={5}
            w={62}
            h={22}
            radius={4}
            style={{ ...RISE, backgroundColor: wash(14) }}
          >
            <Line x={8} cy={11} size={13} weight={500} style={{ color: ACCENT }}>
              78
            </Line>
            <Line x={12} cy={11} size={7} end className={TOKEN_MUTED}>
              ai ready
            </Line>
          </Box>
          <Line x={12} cy={16} size={8} end className={TOKEN_MUTED}>
            SOC 2 · GDPR
          </Line>
        </Box>
      </Panel>
    </Stage>
  );
}

/**
 * The roster, in the dictionary's order.
 *
 * ⚠️ INDEXED, NOT KEYED BY LABEL — `company.services.cards` is a different eight names on /he,
 * so a `Record<string, …>` lookup would silently render nothing in Hebrew. Same reasoning, and
 * the same 8-slot TUPLE type, as `SERVICE_GLYPHS` in serviceGlyphs.tsx: the count is the grid,
 * so adding a ninth service has to fail the build in three places rather than pass the eye.
 */
type ServiceArt = () => ReactNode;

export const SERVICE_ART: readonly [
  ServiceArt,
  ServiceArt,
  ServiceArt,
  ServiceArt,
  ServiceArt,
  ServiceArt,
  ServiceArt,
  ServiceArt,
] = [
  ArtAgents, // AI Agents
  ArtWhatsApp, // WhatsApp Automation
  ArtCRM, // CRM Implementation
  ArtIntegrations, // Integrations
  ArtWeb, // Web Development
  ArtMobile, // Mobile Development
  ArtSoftware, // Custom Software
  ArtStrategy, // AI Strategy
];
