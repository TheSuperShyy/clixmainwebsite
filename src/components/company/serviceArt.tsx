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
 * ─── THE SCENES CARRY REAL CONTENT — REVERSED 2026-08-17 ─────────────────────────────────────
 *
 * ⚠️ THE RULE HERE USED TO BE "EVERYTHING SENTENCE-SHAPED RENDERS AS A GREY BAR". It held while
 * the card was 304px wide, where a bar read as *a sentence, deliberately blurred*. On the sticky
 * stack the mock is ~680px and the same bars read as SKELETON UI — a page that has not finished
 * loading. User: *"can you add more to it, rather than just some skeleton UI?"*, and correct.
 *
 * What was wrong was not the locale-free GOAL but the assumption under it: that a real product
 * UI is mostly prose. It is not. It is names, statuses, counts, IDs, filenames and code —
 * MACHINE CONTENT, Latin in every locale — which was being redacted for no benefit. So:
 *
 *   1. These eight scenes are STILL LOCALE-FREE and still add NOT ONE dictionary key. Every
 *      string is a token at `direction: ltr`, so /he needs no translation and no line-fit audit.
 *   2. The real site's chat mock is a stock template in someone else's business ("2 kurtas",
 *      "Rs.1200"). Porting its words would be borrowing copy; porting its SHAPE is the rebuild —
 *      so scene 2's exchange is clix's own.
 *   3. TWO DELIBERATE EXCEPTIONS, both recorded at their call site: scene 2's four chat messages
 *      are genuine prose and are English in both locales (OPEN QUESTION, flagged to the user),
 *      and scene 5's headline is still two bars — correct there, because it is a headline in a
 *      page THUMBNAIL, too small to read and surrounded by real labels. Bars are fine as the
 *      minority; they were never fine as the default.
 *
 * ─── COORDINATES: 440 × 288, SCALED BY CONTAINER QUERY ───────────────────────────────────────
 *
 * Every scene is drawn in one 440 × 288 source box — it was 280 × 168 until 2026-08-17, widened
 * with the stack — and every dimension is written `u(n)`, the same idiom as
 * `product/benefitArt.tsx` and `product/workflowMocks.tsx`. `Stage` makes itself a query
 * container and hands its children `--u = 1cqw / 4.4`, so the art SCALES with the card rather
 * than reflowing inside it. The stage caps at 560px so it never outgrows the art well.
 *
 * ⚠️ EVERY PRIMITIVE IS ABSOLUTE AGAINST ITS NEAREST POSITIONED ANCESTOR. A `Metric` written
 * NEXT TO a strip rather than INSIDE it resolves against the `Surface` and lands in the header.
 * Nest, and the coordinates stay local. (Cost one bug on 2026-08-17.)
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
 * ─── MOTION: FOUR KEYFRAMES, AND THE ONE THAT WAS DELETED ────────────────────────────────────
 *
 * Declared in `src/app/globals.css` — read that block before retuning anything here. This file
 * has no GSAP, no framer-motion (not installed) and NO `"use client"`: it is server-rendered
 * like `benefitArt.tsx`. The band's GSAP lives one level up in `ServiceReel.tsx` and drives
 * the CARDS; it never reaches inside a scene.
 *
 *   · ~~`service-pulse`~~ — a live dot, one per scene. ⚠️ **DELETED 2026-08-17 with the `Dot`
 *     primitive, on the user's call.** See the note where `Dot` used to be, below.
 *   · `service-rise`   — `translateY(0 → -2 → 0)`, on the one OUTCOME element per scene.
 *   · `service-typing` — the three dots of a typing indicator. Scenes 1 and 2.
 *   · `service-caret`  — a text caret, hard on/off. Scene 7.
 *
 * ⚠️ `service-step` WAS DELETED 2026-08-17 AND MUST NOT COME BACK IN THAT FORM. It was the
 * workhorse — a soft accent wash on an overlay, staggered down a scene's rows so exactly one
 * was lit at a time, 31 instances — and it was meant to read as "a sequence advancing". It read
 * as HOVER. A tinted band across a table row is the universal signifier for hover or selection,
 * so every scene looked like it had a cursor in it that nobody was moving. The user caught it
 * twice, unprompted, and asked for it gone.
 *
 * ⚠️ THE RULE THAT CAME OUT OF IT: a loop that paints a row CONTAINER borrows a UI state and
 * will always be misread as one. Motion that says "live" has to happen to the CONTENT and has
 * to be something the depicted product would genuinely do — a chat client draws a typing
 * indicator, an editor blinks a caret. Neither can be mistaken for a pointer. That is why the
 * two replacements are tied to specific real behaviours instead of being generic highlights.
 *
 * ⚠️ THE INVARIANT, INHERITED VERBATIM FROM /product's SIX BENEFIT LOOPS: **every keyframe's
 * base state is the shipped static design.** A resting typing indicator is three dim dots; a
 * resting caret is a visible cursor. The unanimated picture is always the complete scene, never
 * a half-drawn one — which is what makes the global reduced-motion clamp an exact no-op rather
 * than a degradation, and what makes SSR first paint the finished picture.
 *
 * ⚠️ OPACITY AND translateY ONLY — Y because it is the one axis that does not flip under RTL.
 * Nothing here animates a width, a colour or a box-shadow. Loop count is down from ~40 to ~12
 * with `service-step` gone, and `ServiceReel` idles all but the ONE live panel on top.
 *
 * ─── THE PROCESS: EVERY SCENE PLAYS ITSELF (2026-08-17) ──────────────────────────────────────
 *
 * The four keyframes above are the AMBIENT layer. On top of them each scene now ASSEMBLES
 * ITSELF in the order its service actually works — the roster reports in agent by agent, the
 * thread exchanges four messages and books a demo, the workflow walks its chain, the editor
 * writes its file line by line — then holds, dissolves, and does it again for as long as that
 * card holds the screen. User, 2026-08-17: *"i want some movements per cards, for example like
 * the process for the service, its like the presentation"*.
 *
 * ⚠️ THE CHOREOGRAPHY IS DECLARED HERE AND PLAYED SOMEWHERE ELSE, WHICH IS THE POINT. This
 * file says WHAT ORDER; `ServiceReel.tsx` says HOW FAST. There is no per-scene JavaScript
 * anywhere and there must not be — eight bespoke timelines would be eight things to retune
 * every time a scene is redrawn, and the order belongs next to the drawing it describes.
 *
 *   · `step={n}` on a primitive  — this element is beat n. Beats run in ascending order at a
 *                                  fixed interval; the NUMBERS are ranks, not delays, so a
 *                                  scene may start at 1 and another at 3 with no dead air.
 *   · `count` on a `Line`        — this token is a number and counts up to itself.
 *   · `Track`                    — draws a groove and a fill; the fill grows to its length.
 *   · NO MARKER AT ALL           — chrome. Present from the first frame and never leaves.
 *
 * That last one carries more weight than it looks. The browser window in scene 5 and the
 * handset in scene 6 have no `step`: a window that faded in around its own page, or a phone
 * that faded in around its own screen, would be animating the wrong noun. The frame stays and
 * the CONTENT loads, which is what both of those products actually do.
 *
 * ⚠️ NEVER PUT A `step` ON A NODE THAT CARRIES A CSS ANIMATION. A CSS animation beats an
 * inline style in the cascade, so the beat's opacity and transform would be silently swallowed
 * and the element would appear to ignore its place in the sequence. Mark its CONTAINER — which
 * is why scene 6's push card sits inside a bare wrapper and every `RISE` chip is marked
 * through the strip it lives in. `count` is exempt: it writes `textContent`, not style, so it
 * shares a node with `RISE` happily (scene 8's `78`).
 *
 * ⚠️ THE INVARIANT SURVIVES THIS UNCHANGED, and it is the reason every beat is a `from()`:
 * the scene in the HTML is the FINISHED scene. Reduced motion builds no timeline at all, JS
 * off builds no timeline at all, and both get the complete picture — the same guarantee the
 * keyframes above give, extended to the sequence.
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

/**
 * THE SOURCE BOX — 440 × 288, and it was 280 × 168 until 2026-08-17.
 *
 * The band became a sticky stack that gives one card the whole stage, so the art well went
 * from ~264px wide to ~680. Rendering the old drawing into that is the right SIZE at the wrong
 * DENSITY: every stroke and token comes out twice as chunky as it was drawn to be, and the
 * grey bars that stood in for prose stop reading as "a sentence, redacted" and start reading
 * as SKELETON UI, i.e. a page still loading. The user's word for it, and correct.
 *
 * All eight scenes were redrawn against this box over 2026-08-17. The migration briefly ran
 * both boxes at once, with `Stage` / `Header` defaulting to the old one; that scaffolding is
 * gone now, along with `Panel`, which every scene replaced with `Surface`.
 */
const SRC_W = 440;
const SRC_H = 288;

/* ---- Primitives ------------------------------------------------------------------------- */

/**
 * The 280 × 168 stage.
 *
 * `container-type: inline-size` is on the OUTER element and `--u` on the inner one, because an
 * element establishes a query container for its DESCENDANTS and not for itself — declaring
 * `1cqw` on the same node would resolve against the ancestor and silently mis-scale.
 */
function Stage({
  w = SRC_W,
  h = SRC_H,
  children,
}: {
  w?: number;
  h?: number;
  children: ReactNode;
}) {
  return (
    <div
      /* The cap went 280 → 560 on 2026-08-17 with the sticky stack — the art well is ~680px
         wide at desktop where it was ~264. A redrawn scene fills it at ~1.3× its source,
         which is the density it is drawn for; a not-yet-redrawn one fills it at 2×. */
      className="relative w-full max-w-[560px] [container-type:inline-size]"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <div className="absolute inset-0" style={{ "--u": `calc(1cqw / ${w / 100})` } as CSSProperties}>
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
  step,
  fill = false,
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
  /** Which beat of the scene's process this belongs to. See "THE PROCESS" at the head. */
  step?: number;
  /** This box is a BAR FILL — it grows from the reading edge instead of fading in. */
  fill?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      data-step={step}
      data-fill={fill ? "" : undefined}
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
  step,
  count = false,
  className = "",
  style,
  children,
}: {
  x: number;
  cy: number;
  size: number;
  end?: boolean;
  weight?: number;
  /** Which beat of the scene's process this belongs to. */
  step?: number;
  /** This token is a NUMBER and should count up to itself when the scene plays. */
  count?: boolean;
  className?: string;
  /** The accent escape hatch — `color` only. Geometry stays in the props above. */
  style?: CSSProperties;
  children: ReactNode;
}) {
  const lh = size * 1.35;
  return (
    <div
      data-step={step}
      data-count={count ? "" : undefined}
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
  step,
  tone = "line",
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  end?: boolean;
  step?: number;
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
      step={step}
      className={tone === "ink" ? "bg-ink/25" : "bg-mock-line"}
    />
  );
}

/**
 * The panel every scene that depicts an application window sits on.
 *
 * ⚠️ A HAIRLINE AND A 1px CONTACT SHADOW — NOT A SECOND `--shadow-float`, AND THAT IS A
 * CORRECTION. It shipped with the full two-part `--shadow-float` shape at 0.16 alpha, which is
 * what the CARD already carries: a floating white box holding another floating white box, both
 * bordered, both lifted, at ~the same blur. User, on sight: *"why is there hover stage for each
 * card? its redundant"*. Correct — one elevation cue per card is the budget.
 *
 * The CARD keeps the shadow because in a stack it does real work: it is what separates the live
 * card from the receded one behind it. This panel is CONTENT INSIDE that card and has nothing
 * to float above, so it separates by hairline and value instead — which is how it read before
 * the stack, at 304px, for a day, without anyone calling it a wireframe.
 *
 * The 1px contact shadow stays. It is not elevation, it is the edge that stops a white panel
 * on a white card dissolving into it.
 *
 * ⚠️ THE SHADOW IS IN SOURCE UNITS, NOT PIXELS. `u()` everywhere, so it scales with the scene
 * the way every other dimension does — a fixed 12px blur would be twice as tight at desktop as
 * on a phone, which is exactly the inconsistency the whole `u()` idiom exists to prevent.
 */
function Surface({
  w = SRC_W,
  h = SRC_H,
  children,
}: {
  w?: number;
  h?: number;
  children: ReactNode;
}) {
  return (
    <Box
      x={0}
      y={0}
      w={w}
      h={h}
      radius={10}
      className="overflow-hidden border border-mock-line bg-white"
      style={{
        boxShadow: `0 ${u(1)} ${u(2)} rgb(21 21 21 / 0.05)`,
      }}
    >
      {children}
    </Box>
  );
}

/* ⚠️ `Dot` WAS DELETED 2026-08-17 AND SHOULD NOT COME BACK. It was a 5px accent circle
 * pulsing 1 → 0.3 → 1 beside each scene's title — a "live" indicator, one per scene, eight in
 * the file. User: *"remove these colored dots per card, we have to make the cards simple but
 * looks good"*.
 *
 * They are right and the reason is the same one that killed `Step` a day earlier: **it was
 * decoration wearing the costume of information.** A pulsing dot promises that something is
 * happening right now, and nothing was — it pulsed identically on a finished report, a draft,
 * and a browser window. Every scene already says it is live in a way that is actually true: a
 * status chip, a latency figure, a counter that counts. The dot said it a ninth time and said
 * it falsely.
 *
 * Removing one is not just deleting a tag — each dot had a label positioned to clear it, so
 * the label moved back to the dot's own x and any secondary label moved with it. Deltas were
 * 8–12 source units. If a live indicator is ever wanted again, it belongs on the ONE element
 * whose state it describes, not in the corner of every header.
 *
 * ⚠️ THE THREE GREY DOTS IN SCENE 5'S BROWSER CHROME ARE NOT THESE AND DID NOT GO. They are
 * `bg-mock-line` traffic lights, they are the window rather than a claim about it, and they
 * are not coloured. */

/** The one element per scene that reads as the OUTCOME. Lifts 2 source px and settles. */
const RISE: CSSProperties = { animation: "service-rise 3.6s ease-in-out infinite" };

/* ---- Motion that belongs to the thing it moves -----------------------------------------
 *
 * ⚠️ THESE TWO REPLACED `Step`, THE TRAVELLING ROW HIGHLIGHT, DELETED 2026-08-17. It painted
 * a soft accent wash across one row at a time to say "the system is working through a list",
 * and instead said "your mouse is here" — a tinted band across a table row is the universal
 * signifier for hover or selection, so all eight scenes looked like they had a cursor in them
 * that nobody was moving. The user caught it twice unprompted.
 *
 * The rule that came out of it: **a loop that paints a row CONTAINER borrows a UI state and
 * will always be misread as one.** Motion that reads as "live" has to happen to the CONTENT,
 * and it has to be something the depicted product would genuinely do. A chat client draws a
 * typing indicator; an editor blinks a caret. Neither can be mistaken for a pointer.
 */

/** The three dots of a typing indicator, doing the wave every chat client draws. */
function Typing({ x, cy, end = false }: { x: number; cy: number; end?: boolean }) {
  return (
    <>
      {[0, 1, 2].map((n) => (
        <Box
          key={n}
          x={x + n * 7}
          y={cy - 2.5}
          w={5}
          h={5}
          radius={2.5}
          end={end}
          style={{
            /* The resting dim IS the shipped state — a typing indicator at rest is three
               grey dots, which is a complete picture, so the reduced-motion clamp is a no-op
               here exactly as it is for every other loop on this band. */
            opacity: 0.3,
            /* ⚠️ `mock-line` AND NOT `ACCENT` SINCE 2026-08-17. These were accent-tinted, so
               they were the last coloured dots left once `Dot` was deleted, and the brief was
               *"remove these colored dots"*. Grey is also simply more accurate: no chat client
               draws its typing indicator in the brand colour. The indicator itself stays —
               unlike the live dot it is a real affordance describing a real state, and it is
               in two scenes rather than all eight. */
            backgroundColor: "var(--color-mock-line)",
            animation: `service-typing 1.2s ease-in-out ${n * 0.16}s infinite`,
          }}
        />
      ))}
    </>
  );
}

/** A blinking text caret. `step-end`, because a caret does not fade — it is on or it is off. */
function Caret({ x, cy, h = 11 }: { x: number; cy: number; h?: number }) {
  return (
    <Box
      x={x}
      y={cy - h / 2}
      w={1.5}
      h={h}
      style={{
        backgroundColor: ACCENT,
        animation: "service-caret 1.1s step-end infinite",
      }}
    />
  );
}

/**
 * A scene's header strip: a hairline-separated band across the top of a Panel.
 *
 * ⚠️ THE CHILDREN NEST INSIDE THE BAND — they used to be SIBLINGS of it. Positionally that
 * changes nothing (the band is `x=0 y=0 w=SRC_W`, so a child resolves against the same origin
 * either way, and `end` still measures from the same trailing edge). It changes the one thing
 * that matters here: the strip is now a SINGLE NODE, so one `step` reveals the whole header as
 * a unit instead of the caller marking four siblings — and a header whose chip lights a beat
 * after its own title reads as a glitch rather than as a sequence.
 */
function Header({
  w = SRC_W,
  h = 26,
  step,
  children,
}: {
  w?: number;
  h?: number;
  step?: number;
  children: ReactNode;
}) {
  return (
    <Box x={0} y={0} w={w} h={h} step={step} className="border-b border-mock-line bg-white/60">
      {children}
    </Box>
  );
}

const TOKEN = "text-ink";
const TOKEN_MUTED = "text-muted";

/* ---- Primitives for the redrawn scenes --------------------------------------------------
 *
 * ⚠️ THESE EXIST TO KILL THE GREY BARS, AND THAT IS A REVERSAL. The original scenes rendered
 * everything sentence-shaped as a `Bar` — three reasons, the deciding one being that a scene
 * with no prose in it needs no Hebrew and therefore no dictionary keys. That reasoning still
 * holds and the rule survives for genuine PROSE. What it got wrong is that a real product UI
 * is mostly NOT prose: it is names, labels, statuses, counts and IDs — machine content, Latin
 * in every locale, and the thing that was being redacted into grey bars for no benefit.
 *
 * At 304px wide the bars read as "a sentence, deliberately blurred". At 680px they read as
 * SKELETON UI — a page that has not finished loading. The user's word for it, and correct.
 *
 * So: bars are now the exception, not the default. Anything that a real screen would show as
 * a short label or value is set as type below. Anything genuinely conversational stays a
 * judgement call recorded at its call site.
 */

/**
 * A pill. The workhorse of the redrawn scenes — statuses, counts, tags, system notices.
 *
 * Auto-widths to its content rather than taking a `w`, because the whole point is that it
 * holds a real string whose length is not known at the call site. Centred on `cy` like `Line`.
 */
function Chip({
  x,
  cy,
  end = false,
  tone = "accent",
  step,
  style,
  children,
}: {
  x: number;
  cy: number;
  end?: boolean;
  /** `accent` for the card's colour on a tint of itself; `mute` for neutral chrome. */
  tone?: "accent" | "mute";
  /** Which beat of the scene's process this belongs to. */
  step?: number;
  /** The escape hatch — `RISE` on a scene's one outcome chip. Spread last, so it wins. */
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      data-step={step}
      className={`absolute flex items-center whitespace-nowrap font-sans ${
        tone === "mute" ? "text-muted" : ""
      }`}
      style={{
        [end ? "insetInlineEnd" : "insetInlineStart"]: u(x),
        top: u(cy - 9),
        height: u(18),
        paddingInline: u(7),
        borderRadius: u(9),
        fontSize: u(9.5),
        lineHeight: 1,
        fontWeight: 500,
        letterSpacing: "-0.01em",
        direction: "ltr",
        color: tone === "accent" ? ACCENT : undefined,
        backgroundColor: tone === "accent" ? wash(12) : "var(--color-mock-fill)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A stat: a big machine value with its label under it. */
function Metric({
  x,
  y,
  value,
  label,
  accent = false,
  step,
  count = true,
}: {
  x: number;
  y: number;
  value: string;
  label: string;
  accent?: boolean;
  step?: number;
  /** Counts up to `value` when the scene plays. On by default — a stat IS a number. */
  count?: boolean;
}) {
  return (
    <>
      <Line
        x={x}
        cy={y + 9}
        size={17}
        weight={500}
        step={step}
        count={count}
        className={accent ? "" : TOKEN}
        style={accent ? { color: ACCENT, letterSpacing: "-0.03em" } : { letterSpacing: "-0.03em" }}
      >
        {value}
      </Line>
      {/* The label takes the SAME step as its value, deliberately: a label landing a beat after
          the number it belongs to reads as two events rather than as one stat arriving. */}
      <Line x={x} cy={y + 24} size={9} step={step} className={TOKEN_MUTED}>
        {label}
      </Line>
    </>
  );
}

/** A rounded-square avatar carrying initials — an agent, a contact, a person. */
function Avatar({
  x,
  y,
  size = 26,
  radius = 7,
  step,
  initials,
}: {
  x: number;
  y: number;
  size?: number;
  radius?: number;
  step?: number;
  initials: string;
}) {
  return (
    <Box
      x={x}
      y={y}
      w={size}
      h={size}
      radius={radius}
      step={step}
      className="flex items-center justify-center font-sans"
      style={{
        backgroundColor: wash(14),
        color: ACCENT,
        fontSize: u(size * 0.38),
        fontWeight: 500,
        letterSpacing: "0.01em",
        direction: "ltr",
      }}
    >
      {initials}
    </Box>
  );
}

/** A hairline. Horizontal by default; pass `vertical` for a column separator. */
function Rule({
  x,
  y,
  length,
  vertical = false,
  end = false,
  step,
}: {
  x: number;
  y: number;
  length: number;
  vertical?: boolean;
  end?: boolean;
  step?: number;
}) {
  return (
    <Box
      x={x}
      y={y}
      w={vertical ? 1 : length}
      h={vertical ? length : 1}
      end={end}
      step={step}
      className="bg-mock-line"
    />
  );
}

/**
 * A tiny uppercase column heading — `AGENT`, `LATENCY`, `STATUS`.
 *
 * `letterSpacing` is positive here and `Line`'s default is −0.01em; the override works because
 * `Line` spreads `style` AFTER its own geometry, which is what that escape hatch is for.
 */
function ColLabel({
  x,
  cy,
  end = false,
  step,
  children,
}: {
  x: number;
  cy: number;
  end?: boolean;
  step?: number;
  children: ReactNode;
}) {
  return (
    <Line
      x={x}
      cy={cy}
      size={7.5}
      end={end}
      step={step}
      weight={500}
      className="uppercase text-muted"
      style={{ letterSpacing: "0.07em" }}
    >
      {children}
    </Line>
  );
}

/**
 * A scored bar: the groove, and the fill sitting at its measured length.
 *
 * ⚠️ THE FILL GROWS NOW, AND THAT REVERSES A RULE THIS FILE STATED TWICE. Scenes 3 and 8 both
 * carried "every bar sits at its measured length at rest — never a bar growing", because a
 * growing bar is a `scaleX`, a `scaleX` needs a `transform-origin`, and an origin is the one
 * thing on this band that does NOT mirror for free under RTL.
 *
 * That reasoning was about CSS KEYFRAMES, which cannot know the document's direction. The grow
 * is now a GSAP tween in `ServiceReel.tsx`, and JS reads `documentElement.dir` in one line, so
 * the origin is picked per-locale and the objection is gone. The bar still RESTS at its measured
 * length — it is a `from()`, so the server-rendered picture is the finished one and reduced
 * motion sees a full bar exactly as it did before.
 */
function Track({
  x,
  y,
  w,
  h = 6,
  pct,
  accent = false,
  alpha = 55,
  step,
}: {
  x: number;
  y: number;
  /** The groove's full length. The fill is `w * pct`. */
  w: number;
  h?: number;
  pct: number;
  /** Solid accent — for the one row per scene that is the outcome. */
  accent?: boolean;
  /** Otherwise the accent at this alpha. */
  alpha?: number;
  step?: number;
}) {
  return (
    <>
      <Box x={x} y={y} w={w} h={h} radius={h / 2} className="bg-mock-fill" />
      <Box
        x={x}
        y={y}
        w={w * pct}
        h={h}
        radius={h / 2}
        fill
        step={step}
        style={{ backgroundColor: accent ? ACCENT : wash(alpha) }}
      />
    </>
  );
}

/**
 * A chat bubble that WRAPS — the one primitive here that is not single-line.
 *
 * ⚠️ `direction: "ltr"` ON THE TEXT, AND IT IS AN OPEN QUESTION ON /he. Every other string in
 * this file is a machine token and Latin in both locales by rule. A WhatsApp thread is the one
 * place that rule strains: these are sentences a customer typed, and on the Hebrew page a
 * Hebrew customer would have typed them in Hebrew. Flagged to the user 2026-08-17; if the
 * answer is "translate them", these four strings move to the dictionary and this comment goes.
 */
function Bubble({
  x,
  y,
  w,
  out = false,
  meta,
  read = false,
  step,
  children,
}: {
  x: number;
  y: number;
  w: number;
  /** Outgoing — anchors to the inline END and takes the accent tint. */
  out?: boolean;
  /** The timestamp printed in the bubble's trailing corner. */
  meta?: string;
  /** Draws the double tick, in the accent. Outgoing only. */
  read?: boolean;
  /** Which beat of the thread this message is. */
  step?: number;
  children: ReactNode;
}) {
  return (
    <div
      data-step={step}
      className="absolute font-sans"
      style={{
        [out ? "insetInlineEnd" : "insetInlineStart"]: u(x),
        top: u(y),
        width: u(w),
        padding: `${u(7)} ${u(9)} ${u(6)}`,
        borderRadius: u(10),
        /* The squared corner that makes a rounded rectangle read as a speech bubble. Logical
           corners, so incoming and outgoing both mirror correctly on /he. */
        [out ? "borderStartEndRadius" : "borderStartStartRadius"]: u(3),
        backgroundColor: out ? wash(11) : "var(--color-mock-panel)",
        border: out ? "none" : `1px solid var(--color-mock-line)`,
        fontSize: u(10),
        lineHeight: 1.45,
        letterSpacing: "-0.01em",
        color: "var(--color-ink)",
        direction: "ltr",
      }}
    >
      {children}
      {meta !== undefined && (
        <div
          className="flex items-center justify-end"
          style={{ gap: u(3), marginTop: u(3), fontSize: u(8), lineHeight: 1 }}
        >
          <span className="text-muted">{meta}</span>
          {read && <span style={{ color: ACCENT, fontSize: u(9) }}>✓✓</span>}
        </div>
      )}
    </div>
  );
}

/* ---- 1 · AI Agents — the `Agent OS` roster --------------------------------------------- */
/* Source: `services.bodyText` block 01 — "Agent OS · AI workforce", "8 active", and four
   agents each with a latency and a state. Names render as bars; the latencies and states are
   machine tokens and stay. The highlight walks the roster, one agent per 1.4s. */

/**
 * ⚠️ THE NAMES AND TASKS ARE REAL STRINGS NOW, WHERE THEY WERE BAR WIDTHS (`name: 74`).
 * `services.bodyText` records this mock as a roster of four agents each with a latency and a
 * state, and the original honoured that with the latency and the state only — the agent's
 * NAME and what it was DOING were the two most informative things on the row and both were
 * redacted to grey. At stack scale that read as skeleton UI. An agent's name is a label in a
 * console, not prose: Latin in every locale, no dictionary key, rule intact.
 *
 * The four are clix's own service lines, not the capture's — the capture records the shape of
 * the roster, not its contents, and inventing four plausible agents is the rebuild.
 */
const ROSTER: readonly {
  init: string;
  name: string;
  task: string;
  ms: string;
  state: string;
  /** The scene's one OUTCOME row — takes the accent chip and the `rise`. */
  done?: boolean;
  /** The agent currently composing — takes the typing indicator. Exactly one row. */
  typing?: boolean;
}[] = [
  { init: "SQ", name: "Sales Qualifier", task: "Qualifying inbound lead", ms: "1.2s", state: "writing", typing: true },
  { init: "ST", name: "Support Triage", task: "Routing ticket #4182", ms: "0.8s", state: "thinking" },
  { init: "MB", name: "Meeting Booker", task: "Demo booked · Thu 14:00", ms: "0.3s", state: "done", done: true },
  { init: "IC", name: "Invoice Chaser", task: "Reminder sent · 6 accounts", ms: "2.1s", state: "queued" },
];

export function ArtAgents() {
  const ROW_H = 44;
  return (
    <Stage w={SRC_W} h={SRC_H}>
      <Surface>
        <Header w={SRC_W} h={38} step={1}>
          <Line x={16} cy={19} size={11.5} weight={500} className={TOKEN}>
            Agent OS
          </Line>
          <Line x={80} cy={19} size={9.5} className={TOKEN_MUTED}>
            AI workforce
          </Line>
          <Chip x={14} cy={19} end>
            8 active
          </Chip>
        </Header>

        {/* The stat strip — what the roster ADDS UP TO. New at stack scale: at 304px the panel
            had room for the roster and nothing else, and a console with no totals in it is the
            detail a real one would show first. */}
        {/* ⚠️ THE METRICS ARE CHILDREN OF THE STRIP, NOT SIBLINGS OF IT. Every primitive here
            is absolutely positioned against its nearest positioned ancestor, so a `Metric`
            written next to the strip rather than inside it resolves against the Surface and
            lands in the header. Nest, and the coordinates stay local and readable. */}
        <Box x={0} y={38} w={SRC_W} h={54} step={2} className="border-b border-mock-line bg-mock-panel">
          <Metric x={16} y={12} value="142" label="conversations" />
          <Rule x={152} y={10} length={34} vertical />
          <Metric x={168} y={12} value="1.2s" label="avg first reply" />
          <Rule x={300} y={10} length={34} vertical />
          <Metric x={316} y={12} value="98%" label="resolved" accent />
        </Box>

        {/* Column headings. The cheapest thing that turns four rows into a TABLE. */}
        <Box x={0} y={92} w={SRC_W} h={20} step={3} className="border-b border-mock-line">
          <ColLabel x={16} cy={10}>
            Agent
          </ColLabel>
          <ColLabel x={110} cy={10} end>
            Latency
          </ColLabel>
          <ColLabel x={16} cy={10} end>
            Status
          </ColLabel>
        </Box>

        {ROSTER.map((row, i) => {
          const y = 112 + i * ROW_H;
          return (
            /* Step 4 + i — the roster reports in, one agent per beat, ending on the booking
               that is this scene's outcome. */
            <Box key={row.init} x={0} y={y} w={SRC_W} h={ROW_H} step={4 + i}>
              <Avatar x={16} y={9} initials={row.init} />
              <Line x={52} cy={17} size={11} weight={500} className={TOKEN}>
                {row.name}
              </Line>
              <Line x={52} cy={31} size={9.5} className={TOKEN_MUTED}>
                {row.task}
              </Line>
              {/* The one agent actually composing right now. Fixed x so it cannot collide
                  with a long task string, which is variable-width. */}
              {row.typing && <Typing x={146} cy={22} end />}
              <Line x={112} cy={22} size={10} end className="tabular-nums text-ink">
                {row.ms}
              </Line>
              <Chip
                x={16}
                cy={22}
                end
                tone={row.done ? "accent" : "mute"}
                style={row.done ? RISE : undefined}
              >
                {row.state}
              </Chip>
              {i < ROSTER.length - 1 && <Rule x={16} y={43} length={408} />}
            </Box>
          );
        })}
      </Surface>
    </Stage>
  );
}

/* ---- 2 · WhatsApp Automation — the thread ---------------------------------------------- */
/**
 * Source: block 02 — an inbound message, a reply, delivery ticks, and a line confirming the
 * exchange was written back to the CRM. All four survive; what changed is that the messages
 * are now MESSAGES.
 *
 * ⚠️ THE FOUR MESSAGES ARE THE ONE PLACE THIS FILE CARRIES PROSE, AND IT IS A JUDGEMENT CALL.
 * Everything else here is a machine token — a name, a status, an ID — Latin in every locale by
 * rule, needing no dictionary key. A chat thread is not that: these are sentences a customer
 * typed, and on /he a Hebrew customer would have typed them in Hebrew. They are English in
 * both locales as it stands. FLAGGED TO THE USER 2026-08-17; if the answer is "translate
 * them", these four strings move to `company.services` in both dictionaries and this note goes.
 *
 * ⚠️ THE WORDS ARE CLIX'S, NOT THE CAPTURE'S. The real site's chat mock is a stock template in
 * someone else's business ("2 kurtas", "Rs.1200"). Porting its words would be borrowing copy;
 * porting its SHAPE — inbound, reply, confirm, write back to the CRM — is the rebuild. The
 * exchange below is a lead qualifying itself and booking a demo, which is what this service
 * actually does.
 */

const THREAD: readonly {
  text: string;
  /** Omitted on a quick follow-up, which is also how a real client collapses the stamp. */
  at?: string;
  /** Outgoing — the assistant. Anchors to the inline end and takes the accent tint. */
  out?: boolean;
  y: number;
  w: number;
  /** Bubbles auto-height; this is the measured-by-eye height, used to place what follows. */
  h: number;
}[] = [
  { text: "Do you handle CRM integrations?", at: "09:41", y: 56, w: 200, h: 39 },
  {
    text: "Yes — Monday, Notion and Airtable. Want a demo?",
    at: "09:41",
    out: true,
    y: 100,
    w: 236,
    h: 53,
  },
  /* No timestamp on this one — it buys the ~11px the typing bubble needs at the foot of the
     thread, and a chat client genuinely does collapse the stamp on a quick follow-up. */
  { text: "Thursday afternoon works", y: 158, w: 152, h: 28 },
  { text: "Booked — Thu 14:00. Invite sent.", at: "09:43", out: true, y: 191, w: 202, h: 39 },
];

export function ArtWhatsApp() {
  return (
    <Stage w={SRC_W} h={SRC_H}>
      <Surface>
        {/* The contact header. New — the original had no chrome at all, which was right for a
            floating pair of bubbles and wrong for a thread that now fills half a card. */}
        <Header w={SRC_W} h={48} step={1}>
          <Avatar x={14} y={11} radius={13} initials="CA" />
          <Line x={48} cy={19} size={11.5} weight={500} className={TOKEN}>
            Clix Assistant
          </Line>
          <Line x={48} cy={33} size={9} style={{ color: ACCENT }}>
            online
          </Line>
          <Chip x={14} cy={24} end tone="mute">
            WhatsApp Business
          </Chip>
        </Header>

        {/* The thread ground. `bone` rather than white, so the bubbles have something to sit
            on the way a real chat wallpaper works. */}
        <Box x={0} y={48} w={SRC_W} h={220} className="bg-bone" />

        {/* Steps 2–5 — the exchange, in the order it happened. This is the scene where the
            step map is most literally "the process": a lead asks, the assistant answers, the
            lead picks a time, the assistant books it. */}
        {THREAD.map((m, i) => (
          <Bubble
            key={m.text}
            x={14}
            y={m.y}
            w={m.w}
            out={m.out}
            meta={m.at}
            read={m.out}
            step={2 + i}
          >
            {m.text}
          </Bubble>
        ))}

        {/* The customer is still typing. This is what replaced the travelling row highlight
            in this scene, and it is strictly better: it says "live conversation" using the
            exact device a real chat client uses to say it, and it cannot be mistaken for a
            pointer the way a tinted row could. */}
        <Box
          x={14}
          y={236}
          w={46}
          h={26}
          radius={10}
          step={6}
          className="border border-mock-line bg-mock-panel"
          style={{ borderStartStartRadius: u(3) }}
        >
          <Typing x={11} cy={13} />
        </Box>

        {/* THE OUTCOME — the exchange landed in the CRM as a real deal. The scene's `rise`. */}
        <Box x={0} y={268} w={SRC_W} h={20} step={7} className="border-t border-mock-line bg-white">
          <Line x={16} cy={10} size={9} className={TOKEN}>
            Lead created in Monday
          </Line>
          <Chip x={14} cy={10} end style={RISE}>
            Deal #2041
          </Chip>
        </Box>
      </Surface>
    </Stage>
  );
}

/* ---- 3 · CRM Implementation — the quarter board ---------------------------------------- */
/* Source: block 03 — `CRM · Q3`, `+38%`, `Deals 63`, `Pipeline $1.2m`, `Won $480k`. The four
   pipeline stages under the KPI row are the same block's "pipeline, automations and reports". */

/**
 * ⚠️ THE STAGES WERE FOUR BAR LENGTHS (`[148, 116, 84, 52]`) AND ARE NOW FOUR STAGES. The
 * capture's block 03 lists "pipeline, automations and reports" and the original read that as
 * a shape — four descending bars with a grey label stub beside each. At stack scale a pipeline
 * whose stages are unnamed is a chart of nothing. Stage names, deal counts and values are all
 * console labels: Latin in every locale, no dictionary key.
 *
 * The three KPIs (`63`, `$1.2m`, `$480k`) and the `+38%` are the capture's own numbers and
 * survive verbatim; what they MEAN was a grey bar and is now a label.
 */
const PIPELINE: readonly {
  stage: string;
  note: string;
  deals: string;
  value: string;
  /** Fraction of the track. Static widths, never a `scaleX` — see the note below. */
  pct: number;
  /** The scene's one OUTCOME row. */
  won?: boolean;
}[] = [
  { stage: "Discovery", note: "avg 12 days in stage", deals: "24", value: "$410k", pct: 1 },
  { stage: "Qualified", note: "avg 9 days in stage", deals: "18", value: "$320k", pct: 0.78 },
  { stage: "Proposal", note: "avg 6 days in stage", deals: "13", value: "$290k", pct: 0.58 },
  { stage: "Closed won", note: "this quarter", deals: "8", value: "$180k", pct: 0.34, won: true },
];

export function ArtCRM() {
  const ROW_H = 44;
  const TRACK = 140;
  return (
    <Stage w={SRC_W} h={SRC_H}>
      <Surface>
        <Header w={SRC_W} h={38} step={1}>
          <Line x={16} cy={19} size={11.5} weight={500} className={TOKEN}>
            CRM · Q3
          </Line>
          <Line x={76} cy={19} size={9.5} className={TOKEN_MUTED}>
            pipeline
          </Line>
          <Chip x={14} cy={19} end style={RISE}>
            +38%
          </Chip>
        </Header>

        <Box x={0} y={38} w={SRC_W} h={54} step={2} className="border-b border-mock-line bg-mock-panel">
          <Metric x={16} y={12} value="63" label="open deals" />
          <Rule x={152} y={10} length={34} vertical />
          <Metric x={168} y={12} value="$1.2m" label="pipeline" />
          <Rule x={300} y={10} length={34} vertical />
          <Metric x={316} y={12} value="$480k" label="won in Q3" accent />
        </Box>

        <Box x={0} y={92} w={SRC_W} h={20} step={3} className="border-b border-mock-line">
          <ColLabel x={16} cy={10}>
            Stage
          </ColLabel>
          <ColLabel x={120} cy={10} end>
            Deals
          </ColLabel>
          <ColLabel x={16} cy={10} end>
            Value
          </ColLabel>
        </Box>

        {/* Steps 4–7 — the pipeline fills stage by stage, ending on Closed won. Each row's
            bar grows as the row lands, which is the beat that makes this a pipeline rather
            than a table: see `Track` for why a growing bar is now allowed under RTL. */}
        {PIPELINE.map((row, i) => {
          const y = 112 + i * ROW_H;
          return (
            <Box key={row.stage} x={0} y={y} w={SRC_W} h={ROW_H} step={4 + i}>
              <Line x={16} cy={16} size={11} weight={500} className={TOKEN}>
                {row.stage}
              </Line>
              <Line x={16} cy={31} size={9.5} className={TOKEN_MUTED}>
                {row.note}
              </Line>
              <Track x={150} y={19} w={TRACK} pct={row.pct} accent={row.won} />
              <Line x={120} cy={22} size={10} end className="tabular-nums text-muted">
                {row.deals}
              </Line>
              <Line
                x={16}
                cy={22}
                size={11}
                weight={500}
                end
                className="tabular-nums"
                style={row.won ? { color: ACCENT } : { color: "var(--color-ink)" }}
              >
                {row.value}
              </Line>
              {i < PIPELINE.length - 1 && <Rule x={16} y={43} length={408} />}
            </Box>
          );
        })}
      </Surface>
    </Stage>
  );
}

/* ---- 4 · Integrations — the workflow chain --------------------------------------------- */
/* Source: block 04 — `new-lead.workflow · v1.4`, `5 nodes 4 links`, and the chain itself:
   Webhook `POST /lead` → AI parse → HubSpot → Slack → Gmail. Every node name is a product or a
   verb the workflow editor prints, so all five stay as tokens. The lights walk the chain,
   which is the closest RTL-safe reading of the reference band's marching-ants wire. */

/**
 * ⚠️ EVERY NODE NOW SAYS WHAT IT DOES. The five names are the capture's (`Webhook` →
 * `AI parse` → `HubSpot` → `Slack` → `Gmail`) and only `Webhook` carried a note; the other
 * four were a name floating on a wire. A workflow editor's entire job is to show what each
 * step does to the payload, so the note is the row's most useful half — and it is a node
 * label, not prose, so the locale-free rule is untouched.
 */
const NODES: readonly { label: string; note: string; badge: string; done?: boolean }[] = [
  { label: "Webhook", note: "POST /lead", badge: "trigger" },
  { label: "AI parse", note: "Extract name, company, intent", badge: "ai" },
  { label: "HubSpot", note: "Create contact + deal", badge: "crm" },
  { label: "Slack", note: "Post to #sales-inbound", badge: "notify" },
  { label: "Gmail", note: "Send welcome sequence", badge: "email", done: true },
];

export function ArtIntegrations() {
  const ROW_H = 46;
  return (
    <Stage w={SRC_W} h={SRC_H}>
      <Surface>
        <Header w={SRC_W} h={38} step={1}>
          <Line x={16} cy={19} size={11.5} weight={500} className={TOKEN}>
            new-lead.workflow
          </Line>
          <Line x={132} cy={19} size={9.5} className={TOKEN_MUTED}>
            v1.4
          </Line>
          <Chip x={14} cy={19} end tone="mute">
            5 nodes · 4 links
          </Chip>
        </Header>

        {/* The wire, behind the nodes — one run from the first node's centre to the last.
            `inset-inline-start`, so the chain hangs off the reading edge on /he too. */}
        <Box x={37} y={61} w={1} h={184} step={2} className="bg-mock-line" />

        {/* Steps 3–7 — the run walks the chain, one node per beat: the webhook fires, the
            parse extracts, the CRM takes the contact, Slack is told, the email goes. */}
        {NODES.map((n, i) => {
          const y = 38 + i * ROW_H;
          return (
            <Box key={n.label} x={0} y={y} w={SRC_W} h={ROW_H} step={3 + i}>
              <Box
                x={32}
                y={17}
                w={11}
                h={11}
                radius={5.5}
                className="border-2 bg-white"
                style={{ borderColor: ACCENT }}
              />
              <Line x={56} cy={17} size={11} weight={500} className={TOKEN}>
                {n.label}
              </Line>
              <Line x={56} cy={31} size={9.5} className={TOKEN_MUTED}>
                {n.note}
              </Line>
              <Chip x={16} cy={23} end tone={n.done ? "accent" : "mute"}>
                {n.badge}
              </Chip>
            </Box>
          );
        })}

        {/* THE OUTCOME — the run that just finished. The scene's `rise`. */}
        <Box x={0} y={268} w={SRC_W} h={20} step={8} className="border-t border-mock-line bg-mock-panel">
          <Line x={16} cy={10} size={9} className={TOKEN_MUTED}>
            Last run 2m ago · 1,284 this month
          </Line>
          <Chip x={14} cy={10} end style={RISE}>
            success
          </Chip>
        </Box>
      </Surface>
    </Stage>
  );
}

/* ---- 5 · Web Development — the browser -------------------------------------------------- */
/* Source: block 05 — a browser at `clixsolution.com`, a `98` Lighthouse score, and
   `+24% conversion`. The page inside is bars; the three blocks light in sequence, which reads
   as the paint the score is about. */

/** The three feature cards in the page preview — clix's own top services, so the mock shows
    the site it is actually a mock OF. */
const WEB_CARDS: readonly { title: string; note: string }[] = [
  { title: "AI Agents", note: "24/7 coverage" },
  { title: "WhatsApp", note: "Native channel" },
  { title: "CRM", note: "One record" },
];

export function ArtWeb() {
  return (
    <Stage w={SRC_W} h={SRC_H}>
      <Surface>
        {/* Chrome. Three dots and an address pill — the one piece of another product's
            furniture in the file, and it is generic browser chrome, not a brand's. */}
        <Box x={0} y={0} w={SRC_W} h={34} className="border-b border-mock-line bg-mock-panel" />
        {[16, 27, 38].map((x) => (
          <Box key={x} x={x} y={14} w={6} h={6} radius={3} className="bg-mock-line" />
        ))}
        <Box x={58} y={8} w={210} h={18} radius={9} className="bg-white">
          <Line x={9} cy={9} size={8.5} className={TOKEN_MUTED}>
            clixsolution.com
          </Line>
        </Box>
        <Chip x={14} cy={17} end tone="mute">
          Live
        </Chip>

        {/* ── The page ──────────────────────────────────────────────────────────────────
            ⚠️ THE HEADLINE IS THE ONE THING STILL DRAWN AS BARS, AND HERE THAT IS CORRECT
            rather than a leftover. Everything else in this scene is a real label — nav items,
            a real CTA, three real card titles, real vitals — so two dark bars read as what
            they are: a headline in a page THUMBNAIL, too small to be read. It is the minority
            and it is clearly type-shaped, which is the difference between "a preview" and
            "still loading". It also keeps the scene locale-free: a headline is the one string
            here that would genuinely have to be translated. */}
        {/* ⚠️ THE BROWSER CHROME IS NOT PART OF THE SEQUENCE — it carries no `step`, so it is
            simply there from the first frame and the PAGE loads inside it. A browser window
            that fades in around its own content would be describing the wrong thing. */}
        <Box x={0} y={34} w={SRC_W} h={198} className="bg-white">
          {/* Step 1 — the site's own nav. Wrapped so the five pieces of it land together;
              children keep their coordinates because the wrapper sits at the same origin. */}
          <Box x={0} y={0} w={SRC_W} h={29} step={1}>
            <Box x={16} y={10} w={9} h={9} radius={2} style={{ backgroundColor: ACCENT }} />
            <Line x={30} cy={14} size={10} weight={500} className={TOKEN}>
              CLIX
            </Line>
            <Line x={74} cy={14} size={8.5} className={TOKEN_MUTED}>
              Product · Security · Company · News
            </Line>
            <Box x={16} y={5} w={58} h={19} radius={9.5} end style={{ backgroundColor: ACCENT }}>
              <Line
                x={0}
                cy={9.5}
                size={8}
                weight={500}
                className="w-full text-center text-white"
              >
                Let&apos;s start
              </Line>
            </Box>
            <Rule x={0} y={28} length={SRC_W} />
          </Box>

          {/* Step 2 — the hero. The wrapper sits at y=40, so its children are offset by that
              much from the page-level coordinates they had as siblings. */}
          <Box x={0} y={40} w={SRC_W} h={72} step={2}>
            <Bar x={16} y={8} w={230} h={10} tone="ink" />
            <Bar x={16} y={26} w={168} h={10} tone="ink" />
            <Box x={16} y={46} w={70} h={22} radius={11} style={{ backgroundColor: wash(16) }}>
              <Line
                x={0}
                cy={11}
                size={8.5}
                weight={500}
                className="w-full text-center"
                style={{ color: ACCENT }}
              >
                See the work
              </Line>
            </Box>
          </Box>

          {/* Steps 3–5 — the three feature cards, painting in. */}
          {WEB_CARDS.map((c, i) => {
            const x = 16 + i * 138;
            return (
              <Box
                key={c.title}
                x={x}
                y={122}
                w={126}
                h={58}
                radius={6}
                step={3 + i}
                className="border border-mock-line"
              >
                <Box x={12} y={11} w={16} h={16} radius={4} style={{ backgroundColor: wash(22) }} />
                <Line x={12} cy={38} size={10} weight={500} className={TOKEN}>
                  {c.title}
                </Line>
                <Line x={12} cy={50} size={8.5} className={TOKEN_MUTED}>
                  {c.note}
                </Line>
              </Box>
            );
          })}
        </Box>

        {/* THE OUTCOME — what the build actually scores, and the lift it bought. */}
        <Box x={0} y={232} w={SRC_W} h={56} step={6} className="border-t border-mock-line bg-mock-panel">
          <Metric x={16} y={16} value="98" label="PSI" accent />
          <Rule x={72} y={12} length={32} vertical />
          <Metric x={88} y={16} value="0.9s" label="LCP" />
          <Rule x={156} y={12} length={32} vertical />
          <Metric x={172} y={16} value="0.01" label="CLS" />
          <Chip x={16} cy={28} end style={RISE}>
            +24% conversion
          </Chip>
        </Box>
      </Surface>
    </Stage>
  );
}

/* ---- 6 · Mobile Development — the handset ---------------------------------------------- */
/* ⚠️ THE ONE DESIGNED SCENE. The capture describes artwork for the other seven blocks and
   nothing for this one, so this is built from block 06's own bullet list instead: native apps,
   push notifications, deep links, offline-first sync. Recorded as a deviation in FEATURE.md —
   it is the only place on this band where the picture is ours rather than the company's. */

/** The three orders on the handset's list screen. Order IDs and amounts are machine tokens;
    the names are names, which are Latin in either locale. */
const ORDERS: readonly { init: string; name: string; note: string }[] = [
  { init: "AB", name: "Avi Barak", note: "#4021 · $180" },
  { init: "MR", name: "Maya Ron", note: "#4022 · $340" },
  { init: "YK", name: "Yossi Katz", note: "#4023 · $95" },
];

/** The four bullets block 06 lists, as the cards flanking the handset. Left column arrives,
    right column reports. */
const MOBILE_SIDE: readonly { title: string; note: string; end: boolean; y: number }[] = [
  { title: "Deep link", note: "clix://orders/4023", end: false, y: 116 },
  { title: "Offline sync", note: "12 queued · synced", end: false, y: 172 },
  { title: "React Native", note: "iOS + Android, one build", end: true, y: 60 },
  { title: "Push delivery", note: "98% within 2s", end: true, y: 116 },
];

export function ArtMobile() {
  return (
    <Stage w={SRC_W} h={SRC_H}>
      {/* ⚠️ NO `Surface` ON THIS SCENE. The other seven depict a window and sit on a panel;
          this one depicts a DEVICE with things happening around it, and a panel behind the
          whole composition would put a window frame around a phone. The handset carries its
          own chrome instead. */}

      {/* The handset, centred so the scene reads the same mirrored. */}
      <Box
        x={150}
        y={6}
        w={140}
        h={276}
        radius={22}
        className="overflow-hidden border-2 border-ink/20 bg-mock-panel"
        /* Softened with `Surface`'s on 2026-08-17 — same correction, same reason: the card
           already carries `--shadow-float`. A handset is a physical object, so it keeps a
           shadow where `Surface` lost its; it is just no longer competing with the card's. */
        style={{
          boxShadow: `0 ${u(8)} ${u(20)} ${u(-10)} rgb(21 21 21 / 0.1)`,
        }}
      >
        {/* Status bar and notch. */}
        <Box x={50} y={9} w={40} h={5} radius={2.5} className="bg-ink/15" />
        <Line x={13} cy={26} size={8} weight={500} className={TOKEN}>
          9:41
        </Line>
        <Line x={13} cy={26} size={8} end className={TOKEN_MUTED}>
          5G
        </Line>

        {/* ⚠️ THE HANDSET ITSELF CARRIES NO `step`. The device is the stage, not a beat: a
            phone that fades into existence around its own UI would be describing the wrong
            thing. The SCREEN fills in, the way a screen does. */}

        {/* Step 1 — app header. */}
        <Box x={0} y={38} w={136} h={30} step={1} className="border-b border-mock-line bg-white">
          <Line x={13} cy={15} size={11.5} weight={500} className={TOKEN}>
            Orders
          </Line>
          <Chip x={11} cy={15} end>
            3 new
          </Chip>
        </Box>

        {/* The list. */}
        {/* Steps 2–4 — the orders arrive. */}
        {ORDERS.map((o, i) => {
          const y = 74 + i * 44;
          return (
            <Box key={o.init} x={0} y={y} w={136} h={44} step={2 + i}>
              <Avatar x={13} y={9} size={24} radius={6} initials={o.init} />
              <Line x={45} cy={17} size={9.5} weight={500} className={TOKEN}>
                {o.name}
              </Line>
              <Line x={45} cy={29} size={8.5} className={TOKEN_MUTED}>
                {o.note}
              </Line>
              {i < ORDERS.length - 1 && <Rule x={13} y={43} length={110} />}
            </Box>
          );
        })}

        {/* Step 5 — tab bar. */}
        <Box x={0} y={228} w={136} h={44} step={5} className="border-t border-mock-line bg-white">
          {["Orders", "Chat", "More"].map((label, i) => (
            <Box key={label} x={12 + i * 40} y={10} w={32} h={24}>
              <Box
                x={12}
                y={0}
                w={8}
                h={8}
                radius={2}
                className={i === 0 ? "" : "bg-mock-line"}
                style={i === 0 ? { backgroundColor: ACCENT } : undefined}
              />
              <Line
                x={0}
                cy={17}
                size={7}
                className={`w-full text-center ${i === 0 ? "" : TOKEN_MUTED}`}
                style={i === 0 ? { color: ACCENT } : undefined}
              >
                {label}
              </Line>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Step 7 — THE OUTCOME. A push arriving beside the device, last, because it is what
          the whole scene is for.

          ⚠️ THE `step` IS ON A WRAPPER, NOT ON THE CARD, and that is not tidiness. The card
          carries `RISE`, i.e. a running CSS transform animation, and a CSS animation beats an
          inline style in the cascade — so the reveal's translateY would be swallowed and the
          card would fade in without its lift. The general rule this is an instance of: NEVER
          PUT A `step` ON A NODE THAT CARRIES A CSS ANIMATION. Mark its container. */}
      <Box x={8} y={44} w={128} h={52} step={7}>
        <Box
          x={0}
          y={0}
          w={128}
          h={52}
          radius={9}
          className="border border-mock-line bg-white"
          /* Contact shadow only. This card sits BESIDE the handset, not over it, so it has
             nothing to float above — `RISE` is what says "just arrived", not elevation. */
          style={{
            ...RISE,
            boxShadow: `0 ${u(1)} ${u(2)} rgb(21 21 21 / 0.05)`,
          }}
        >
          <Box x={11} y={11} w={20} h={20} radius={5} style={{ backgroundColor: wash(22) }} />
          <Line x={38} cy={19} size={9.5} weight={500} className={TOKEN}>
            Clix
          </Line>
          <Line x={11} cy={19} size={8} end className={TOKEN_MUTED}>
            now
          </Line>
          <Line x={11} cy={38} size={9} className={TOKEN_MUTED}>
            Order #4023 shipped
          </Line>
        </Box>
      </Box>

      {/* Step 6 — the remaining bullets, flanking the handset. One step for all four, so they
          land as a set with only the stagger between them. */}
      {MOBILE_SIDE.map((c) => (
        <Box
          key={c.title}
          x={8}
          y={c.y}
          w={128}
          h={46}
          radius={9}
          end={c.end}
          step={6}
          className="border border-mock-line bg-white"
        >
          <Line x={11} cy={16} size={9.5} weight={500} className={TOKEN}>
            {c.title}
          </Line>
          <Line x={11} cy={31} size={8.5} className={TOKEN_MUTED}>
            {c.note}
          </Line>
        </Box>
      ))}
    </Stage>
  );
}

/* ---- 7 · Custom Software — the editor --------------------------------------------------- */
/* Source: block 07 — `dashboard.tsx`, an Explorer listing `api.ts` / `types.ts` / `schema.sql`,
   seven numbered lines, and a status bar reading `main · TypeScript` / `build ok`. The code is
   bars; the filenames and the status are tokens. Four lines type themselves in turn. */

/**
 * ⚠️ THE CODE IS CODE NOW, WHERE IT WAS SEVEN BAR WIDTHS AND AN INDENT. This is the scene the
 * change matters most on: an editor is the one mock whose entire subject is text, so redacting
 * every line to a grey rectangle left a picture of an editor with nothing in it. Source code
 * is the least translatable thing on the page — it is Latin in every locale by definition, so
 * this costs no dictionary key and it is not even a judgement call.
 *
 * It is also the workflow from scene 4, written out: the same webhook, the same parse, the
 * same CRM upsert, the same Slack post. The two scenes are the same system seen from the two
 * ends, which is the band's whole argument ("eight services that work as one system").
 *
 * ⚠️ NO SYNTAX COLOURING. Two greys and the accent are the file's whole palette, and a real
 * theme's five or six hues would make this one scene louder than the other seven put together.
 * Weight and opacity carry the structure instead.
 */
const CODE: readonly { text: string; indent: number; dim?: boolean; caret?: boolean }[] = [
  { text: "export async function route(req) {", indent: 0 },
  { text: "const lead = await parse(req.body);", indent: 1 },
  { text: "if (!lead.email) return bad(400);", indent: 1, dim: true },
  { text: "await crm.contacts.upsert(lead);", indent: 1 },
  { text: "await slack.post('#sales', lead);", indent: 1 },
  { text: "return ok({ id: lead.id });", indent: 1, dim: true },
  /* The cursor rests at end of file. The editor's replacement for the deleted row wash —
     an editor blinks a caret, and nothing else in a code pane can be read as a pointer. */
  { text: "}", indent: 0, caret: true },
];

const FILES: readonly { name: string; active?: boolean }[] = [
  { name: "api.ts" },
  { name: "dashboard.tsx", active: true },
  { name: "types.ts" },
  { name: "schema.sql" },
  { name: "worker.ts" },
];

export function ArtSoftware() {
  const LINE_H = 20;
  return (
    <Stage w={SRC_W} h={SRC_H}>
      <Surface>
        {/* Tab strip. */}
        <Box x={0} y={0} w={SRC_W} h={30} className="border-b border-mock-line bg-mock-panel" />
        <Box
          x={0}
          y={0}
          w={104}
          h={30}
          className="border-b-2 bg-white"
          style={{ borderColor: ACCENT }}
        >
          <Line x={14} cy={15} size={9.5} className={TOKEN}>
            dashboard.tsx
          </Line>
        </Box>
        <Line x={118} cy={15} size={9.5} className={TOKEN_MUTED}>
          api.ts
        </Line>
        <Line x={168} cy={15} size={9.5} className={TOKEN_MUTED}>
          schema.sql
        </Line>

        {/* Explorer — new at stack scale. The capture lists the file tree and the old scene
            had no room for it, so it was compressed into one muted run of filenames. */}
        <Box x={0} y={30} w={96} h={232} step={1} className="border-e border-mock-line bg-mock-panel">
          <ColLabel x={14} cy={16}>
            Explorer
          </ColLabel>
          <Line x={14} cy={38} size={9} weight={500} className={TOKEN}>
            src /
          </Line>
          {FILES.map((f, i) => (
            <Line
              key={f.name}
              x={22}
              cy={58 + i * 18}
              size={9}
              className={f.active ? "" : TOKEN_MUTED}
              style={f.active ? { color: ACCENT } : undefined}
            >
              {f.name}
            </Line>
          ))}
        </Box>

        {/* Gutter. */}
        <Box x={96} y={30} w={26} h={232} className="border-e border-mock-line bg-mock-panel" />
        {/* The gutter number takes its LINE'S step, not one of its own — a number appearing a
            beat before the code it counts is worse than no gutter at all. */}
        {CODE.map((c, i) => (
          <Line
            key={c.text}
            x={104}
            cy={48 + i * LINE_H}
            size={8.5}
            step={2 + i}
            className={TOKEN_MUTED}
          >
            {i + 1}
          </Line>
        ))}

        {/* Steps 2–8 — the file writes itself, one line per beat. This is the scene where the
            generic reveal happens to BE the depicted behaviour: an editor filling with code
            line by line is what an editor does, and the caret is already parked at the end of
            it waiting for line 7 to arrive. */}
        {CODE.map((c, i) => {
          return (
            <Box key={c.text} x={122} y={38 + i * LINE_H} w={318} h={LINE_H} step={2 + i}>
              <Line
                x={10 + c.indent * 14}
                cy={10}
                size={9}
                className={c.dim ? TOKEN_MUTED : TOKEN}
              >
                {c.text}
              </Line>
              {c.caret && <Caret x={10 + c.indent * 14 + 9} cy={10} />}
            </Box>
          );
        })}

        {/* Terminal — the build the status bar is reporting on. */}
        <Box x={96} y={186} w={344} h={76} step={9} className="border-t border-mock-line bg-mock-panel">
          <ColLabel x={16} cy={16}>
            Terminal
          </ColLabel>
          <Line x={16} cy={36} size={9} className={TOKEN_MUTED}>
            $ npm run build
          </Line>
          <Line x={16} cy={52} size={9} className={TOKEN}>
            compiled in 4.2s · 0 errors
          </Line>
          <Line x={16} cy={66} size={9} className={TOKEN_MUTED}>
            128 tests passed
          </Line>
        </Box>

        {/* Status bar — the scene's `rise`, because a green build is the outcome. */}
        <Box x={0} y={262} w={SRC_W} h={26} step={10} className="border-t border-mock-line bg-white">
          <Line x={16} cy={13} size={9} className={TOKEN_MUTED}>
            main · TypeScript · 4 changes
          </Line>
          <Chip x={14} cy={13} end style={RISE}>
            build ok
          </Chip>
        </Box>
      </Surface>
    </Stage>
  );
}

/* ---- 8 · AI Strategy — the readiness brief ---------------------------------------------- */
/* Source: block 08 — `ai strategy · q3 brief`, `draft`, five scored areas (Data quality 82,
   Talent depth 64, Tooling 91, Process maturity 58, Governance 73), an overall `78 ai ready`
   and a `SOC 2 · GDPR` risk note. The area names are bars; every number is a token. The bars
   sit at their scored lengths at rest — the loop reads them out, one row at a time. */

/**
 * ⚠️ THE FIVE AREAS ARE NAMED NOW. The capture's block 08 lists them — Data quality 82, Talent
 * depth 64, Tooling 91, Process maturity 58, Governance 73 — and the original kept every SCORE
 * and threw away every NAME, which on a readiness brief is the half that carries the argument:
 * "91" means nothing until you know it is the tooling. The `note` under each is the finding,
 * i.e. why that number and not another, which is what makes this a brief rather than a chart.
 */
const SCORES: readonly { area: string; note: string; v: number }[] = [
  { area: "Data quality", note: "CRM + support unified", v: 82 },
  { area: "Talent depth", note: "2 engineers, no ML lead", v: 64 },
  { area: "Tooling", note: "Cloud, CI, observability", v: 91 },
  { area: "Process maturity", note: "Manual handoffs remain", v: 58 },
  { area: "Governance", note: "SOC 2 · GDPR mapped", v: 73 },
];

export function ArtStrategy() {
  const ROW_H = 38;
  const TRACK = 140;
  return (
    <Stage w={SRC_W} h={SRC_H}>
      <Surface>
        <Header w={SRC_W} h={38} step={1}>
          <Line x={16} cy={19} size={11.5} weight={500} className={TOKEN}>
            AI Readiness · Q3
          </Line>
          <Chip x={14} cy={19} end tone="mute">
            draft
          </Chip>
        </Header>

        <Box x={0} y={38} w={SRC_W} h={20} step={2} className="border-b border-mock-line">
          <ColLabel x={16} cy={10}>
            Area
          </ColLabel>
          <ColLabel x={16} cy={10} end>
            Score
          </ColLabel>
        </Box>

        {/* Steps 3–7 — the brief scores itself, one area per beat: the bar grows to the score
            while the score counts up to meet it. Same mechanism as the CRM pipeline, and the
            same RTL note — see `Track` for why a growing bar is allowed here now. */}
        {SCORES.map((s, i) => {
          const y = 58 + i * ROW_H;
          return (
            <Box key={s.area} x={0} y={y} w={SRC_W} h={ROW_H} step={3 + i}>
              <Line x={16} cy={13} size={10.5} weight={500} className={TOKEN}>
                {s.area}
              </Line>
              <Line x={16} cy={26} size={8.5} className={TOKEN_MUTED}>
                {s.note}
              </Line>
              <Track x={210} y={16} w={TRACK} pct={s.v / 100} alpha={70} />
              <Line
                x={16}
                cy={19}
                size={11}
                weight={500}
                end
                count
                className="tabular-nums text-ink"
              >
                {s.v}
              </Line>
              {i < SCORES.length - 1 && <Rule x={16} y={37} length={408} />}
            </Box>
          );
        })}

        {/* THE OUTCOME — the overall verdict and what it was reviewed against. */}
        <Box x={0} y={248} w={SRC_W} h={40} step={8} className="border-t border-mock-line bg-mock-panel">
          {/* `count` and `RISE` on the same node is fine — `count` writes `textContent`, `RISE`
              animates `transform`, and they never touch. It is a `step` that may not share a
              node with a CSS animation, which is why the step is on the strip above. */}
          <Line
            x={16}
            cy={20}
            size={22}
            weight={500}
            count
            style={{ ...RISE, color: ACCENT, letterSpacing: "-0.03em" }}
          >
            78
          </Line>
          <Line x={48} cy={13} size={9.5} weight={500} className={TOKEN}>
            AI ready
          </Line>
          <Line x={48} cy={27} size={8.5} className={TOKEN_MUTED}>
            up from 61 in Q2
          </Line>
          <Chip x={16} cy={20} end tone="mute">
            Reviewed 14 Aug
          </Chip>
        </Box>
      </Surface>
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
