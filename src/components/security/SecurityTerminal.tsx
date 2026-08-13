"use client";

/**
 * SecurityTerminal — the terminal-window mock in the `/security` hero (`#first`).
 *
 * ⚠️ THIS IS NOT A CLONE. Everything else under `src/components/security/` is measured off
 * `docs/reference/target/rogo-security-2026-08-12.{html,css}`; this file has no counterpart on
 * the target and every number in it is OURS. Added 2026-08-13 on the user's instruction, after
 * their boss pointed at kiro.dev's hero composite and asked for "coding effects, since it is the
 * security section". Spec: features/security-page/FEATURE.md → "Block 1b — Terminal". Do not
 * treat the values here as measured evidence; they are design decisions and may be tuned freely.
 *
 * ⚠️ SECOND PASS, SAME DAY, AND THE REASON IS THE WHOLE DESIGN. The first version typed one log
 * out and then froze. The user compared it to kiro and said: "ours after the animation it's
 * static but in kiro it's continuously coding and stuff". So the body is now kiro's AGENT FEED —
 * a task list that keeps arriving, one row at a time, forever — with kiro's tool calls replaced
 * by security checks, which is the user's own framing: "like the kiro literal agent feed, but
 * connect it to security". Do not revert it to a fixed log; being endless IS the requirement.
 *
 * ─── ⚠️ IT BREAKS THIS PAGE'S "NO MOTION" FINDING, DELIBERATELY ──────────────────────────
 * SecurityHero, SecurityBenefits, SecurityCompliance and SecurityCore all state that the
 * target's `data-framer-appear-id` count is 0 and that nothing on the page animates, and
 * FEATURE.md ticks that as verified. That finding is still TRUE OF THE TARGET. This component
 * is an addition on top of it, recorded in the deviations table rather than quietly folded in.
 * Those four files stay motionless; do not read this one as a licence to animate them.
 *
 * ─── ⚠️ NOTHING OF KIRO'S PALETTE COMES OVER ────────────────────────────────────────────
 * kiro.dev is lavender-purple, and its feed colour-codes status — green dots, cyan verbs,
 * magenta labels. This site is monochrome by rule (docs/DESIGN-SYSTEM.md): `--color-forest`
 * belongs to /clix and `--color-price-low/high` are semantic-only and may never be used as
 * accents. So status here is carried by FILL AND OPACITY instead of by hue — a hollow ring is
 * queued, a soft disc is done, a pulsing disc is running — and the window is built from tokens
 * that already existed. NO new token and NO new colour.
 *
 * ─── ⚠️ `muted` IS KEPT OFF EVERY READABLE STRING, AND THAT IS THE POINT ─────────────────
 * `muted` #737373 on `ink` #151515 is 3.85:1 and already fails AA in five inherited places on
 * this site (home, the footer, /product, /careers, and this page's own 14px cell labels). Those
 * are the target's pairing; THIS component is ours, so it must not add a sixth. `muted` carries
 * only the traffic dots, the dot-matrix art and the status rings — non-text decoration, which
 * answers to WCAG 1.4.11's 3:1 floor and clears it at 3.53:1. Every string a person reads is
 * `paper-soft` (11.84:1) or `paper` (18.26:1). Do not "tidy" a verb or a target onto `muted`.
 *
 * ─── ⚠️ ENGLISH AND LTR IN BOTH LOCALES, ON PURPOSE (user's call, 2026-08-13) ────────────
 * The root carries `dir="ltr"` so /he/security renders it unmirrored, and NOTHING here comes
 * from the dictionary. CLI output is a code artifact, not prose: mirroring a monospace window
 * reads as broken, and a Hebrew verb followed by a latin target cannot hold a column. That is
 * why this file never reaches for `usePageDict` even though it is a client component and could.
 *
 * ─── ⚠️ THE WHOLE WINDOW IS `aria-hidden`, WHICH IS ALSO WHAT LICENSES THE DOM CHURN ────
 * Every claim printed here appears verbatim as real prose in the Compliance band further down
 * this same page, so a screen-reader user loses nothing — while a monospace pseudo-terminal read
 * aloud is worse than silence, and an endless feed announced politely every 1.3s would make the
 * page unusable. Same reasoning the five badge marks already use (`alt="" aria-hidden="true"`).
 * It is ALSO the reason `paint()` below is allowed to rewrite `textContent` on a loop: the
 * a11y objection to mutating text does not apply to a subtree the a11y tree cannot see, and the
 * rows are fixed-height so nothing reflows. Nothing here is focusable, so the page's focus order
 * is unchanged: one control in <main>.
 */

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MockWindow from "@/components/security/MockWindow";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─── Copy ────────────────────────────────────────────────────────────────────────────────
   ⚠️ THESE ARE CHECKS BEING RUN, NOT RESULTS BEING CLAIMED, and the distinction is the whole
   reason the list reads the way it does. This repo has stripped unbacked claims twice — the
   SOC 2 / ISO 27001 / CCPA / GDPR / EU AI Act seals came off the home page on 2026-08-05 and off
   /product on 2026-08-12, because showing a seal without holding the report is misrepresentation.
   A terminal that prints an endless stream of PASSES would be the same move in a new costume.
   So every row names a thing being inspected, and every subject maps onto one of the five
   practice cells this page already states in prose:

     iam / token scope / least privilege  → the `least-privilege` cell
     tls / encryption at rest             → the `encrypted` cell
     region / egress / inbound            → the `your-cloud` cell
     retention                            → the `your-data` cell
     source integrity                     → the `ownership` cell

   Two open questions in FEATURE.md bear on this and are still unanswered (Benefit 3 assumes
   per-run logs exist; Benefit 5 names TLS and a managed secret store). If either is answered
   "no", the matching rows here come out with it.

   NO DASHES IN CLIX COPY (standing user request). `eu-west-1`, `tls 1.3` and `--watch` are
   identifiers and a CLI flag, not punctuation, so they keep their hyphens.

   ⚠️ THE COLUMN BUDGET IS 2ch + 8ch + target. The longest target below is "egress destinations"
   at 19 characters, i.e. 29ch overall — 215px at the phone tier's 12px against 324px of inner
   width. A longer verb than 8 characters or a target past ~30 characters will collide with the
   window edge at 390 before it does anywhere else. Measure before adding one. */
const POOL: ReadonlyArray<{ verb: string; target: string }> = [
  { verb: "scan", target: "iam role bindings" },
  { verb: "verify", target: "tls 1.3 handshake" },
  { verb: "check", target: "encryption at rest" },
  { verb: "read", target: "key rotation age" },
  { verb: "audit", target: "token scope" },
  { verb: "trace", target: "egress destinations" },
  { verb: "verify", target: "data retention" },
  { verb: "check", target: "secret store access" },
  { verb: "scan", target: "inbound rules" },
  { verb: "read", target: "workload identity" },
  { verb: "verify", target: "source integrity" },
  { verb: "check", target: "least privilege" },
];

/* `--watch` is doing real work in this string: it is the one word that explains to a reader why
   the feed never ends. A one-shot verb over an endless list would just look broken. */
const COMMAND = "clix audit --watch";

/* ⚠️ SIX VISIBLE, SEVEN RENDERED. The seventh sits below the clip and is what slides INTO view
   on each tick — without it the incoming row would pop in at the bottom edge instead of
   arriving. The viewport height is expressed as `6 * 1.6em` rather than in pixels so it stays
   exactly six rows tall at BOTH type sizes (14px → 134.4, 12px → 115.2) with no second value to
   keep in sync. This is the same shape as ProductStepper's `rows-up`, whose comment warns that
   a hardcoded travel silently desyncs from its row height — here the travel is MEASURED off a
   live row instead of hardcoded, which removes that failure mode rather than documenting it. */
const VISIBLE_ROWS = 6;
const RENDERED_ROWS = VISIBLE_ROWS + 1;

/* Estimates, both — there is no target to measure a rate against. 350ms of travel with ~950ms
   of dwell reads as work arriving rather than as a list being scrolled. */
const SLIDE_S = 0.35;
const DWELL_S = 0.95;

/* ─── The dot-matrix wordmark ─────────────────────────────────────────────────────────────
   kiro's hero prints a dot-matrix banner inside its terminal; this is the clix equivalent.

   ⚠️ RENDERED AS A GRID OF <span>s, NOT AS TEXT, and that is a robustness decision rather than
   a stylistic one. Drawing it with block characters (U+2588 and friends) would put the layout
   at the mercy of Fragment Mono's glyph coverage: one missing character falls back to the
   system mono at a different advance width and the whole banner shears. A grid of fixed-size
   boxes cannot do that. The same reasoning is why the status markers below are boxes and not
   ●/○/◐, and why the caret is a box and not a block character.

   5 rows × 5 columns per letter, one blank column between letters → 23 columns. */
const GLYPHS: Record<string, readonly string[]> = {
  C: [".###.", "#...#", "#....", "#...#", ".###."],
  L: ["#....", "#....", "#....", "#....", "#####"],
  I: ["#####", "..#..", "..#..", "..#..", "#####"],
  X: ["#...#", ".#.#.", "..#..", ".#.#.", "#...#"],
};

/* Joined with a single blank column so the row strings stay the grid's source of truth and the
   column count is derived from them, never hand-counted. */
const MATRIX: readonly string[] = [0, 1, 2, 3, 4].map((row) =>
  ["C", "L", "I", "X"].map((ch) => GLYPHS[ch][row]).join("."),
);
const MATRIX_COLS = MATRIX[0].length;

/* Status is DERIVED FROM POSITION, never stored: the rows above the last visible one have
   already run, the last visible one is running, and the one below the clip is queued. That is
   what makes the feed a pure function of a single integer and removes any per-row state machine
   — a row does not "become" done, it simply moves up. */
type Status = "done" | "running" | "queued";
const statusAt = (i: number): Status =>
  i < VISIBLE_ROWS - 1 ? "done" : i === VISIBLE_ROWS - 1 ? "running" : "queued";

/* Marker geometry lives here rather than in the JSX because `paint()` has to reproduce it
   exactly on every tick, and two copies of a class string is how they drift apart. */
const DOT_BASE = "block h-[7px] w-[7px] rounded-full border";
const DOT_CLASS: Record<Status, string> = {
  /* A soft disc: run, and no longer the point of attention. */
  done: `${DOT_BASE} border-transparent bg-paper-soft`,
  /* A bright disc, and the only element in the window that pulses. */
  running: `${DOT_BASE} border-transparent bg-paper`,
  /* A hollow ring — the only marker that reads as "not yet", and it is `muted` because it is
     the one that must recede. Decoration, so 3.53:1 is the right floor. */
  queued: `${DOT_BASE} border-muted bg-transparent`,
};
const TEXT_CLASS: Record<Status, string> = {
  done: "text-paper-soft",
  running: "text-paper",
  queued: "text-paper-soft",
};

export default function SecurityTerminal() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const list = q("[data-tm-list]")[0] as HTMLElement | undefined;
      const rows = q("[data-tm-row]") as HTMLElement[];
      const banner = q("[data-tm-banner]");
      const cmd = q("[data-tm-cmd]");
      const caret = q("[data-tm-caret]");
      if (!list || rows.length !== RENDERED_ROWS) return;

      /* ⚠️ MEASURED off a live row, not hardcoded. The travel has to equal the row height at
         whichever type tier is live (22.4px at 14px, 19.2px at 12px), and a literal would be
         right at one tier and visibly wrong at the other — the exact failure ProductStepper's
         `rows-up` keyframe documents and cannot avoid, because a keyframe cannot be
         parameterised. A tween can, so this one is. */
      const rowH = () => rows[0].getBoundingClientRect().height;

      /* The single integer the whole feed is a function of. */
      let head = 0;

      const paint = () => {
        for (let i = 0; i < RENDERED_ROWS; i++) {
          const task = POOL[(head + i) % POOL.length];
          const status = statusAt(i);
          const row = rows[i];
          const dot = row.querySelector("[data-tm-dot]");
          const verb = row.querySelector("[data-tm-verb]");
          const target = row.querySelector("[data-tm-target]");
          if (dot) dot.className = DOT_CLASS[status];
          if (verb) verb.textContent = task.verb;
          if (target) target.textContent = task.target;
          row.className = `flex items-center ${TEXT_CLASS[status]}`;
        }
      };

      /* matchMedia so the reduced-motion branch is never BUILT. Everything below is rendered in
         its FINAL state by the server, so JS-off, pre-hydration and reduced-motion all show a
         populated terminal rather than an empty box — the animation only ever hides what is
         already there and then keeps it moving. Same shape as ClixBackdrop and ClixManifesto.
         Reverts itself if the preference flips mid-session.

         ⚠️ AN ENDLESS ANIMATION IS EXACTLY WHAT `prefers-reduced-motion` EXISTS FOR. A feed that
         never stops is the strongest case on this whole site for honouring it, which is why the
         reduced-motion path is a frozen, fully-populated list and not a slower version. */
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Set the hidden state IMMEDIATELY rather than letting a `from()` tween set it when the
           trigger fires. This window sits in the hero, i.e. above the fold, so the trigger fires
           within a frame of mount — and a `from()` would paint one frame of the complete window
           before hiding it. Setting up front costs nothing and removes the flash. */
        gsap.set(banner, { opacity: 0 });
        gsap.set(cmd, { width: 0 });
        gsap.set(rows, { opacity: 0, y: 4 });

        /* ⚠️ THE CARET'S BLINK AND THE RUNNING ROW'S PULSE ARE TURNED ON HERE, NOT IN THE MARKUP,
           and the reason is written down at `@keyframes blink` in globals.css: the global
           reduced-motion clamp sets `animation-duration: 0.01ms`, which can freeze an animated
           element MID-CYCLE AND INVISIBLE. /product's ProductHero drops its caret's animation
           class outright rather than trusting the clamp, and this does the same thing by never
           adding it — inside this branch, reduced-motion never reaches these lines.

           Written as inline styles rather than as Tailwind's `animate-[blink_…]` utility ON
           PURPOSE. A class added at runtime is invisible to Tailwind's source scanner, so the
           utility would only exist while some OTHER file happened to spell it out — ProductHero
           does today, which would make this depend on an unrelated component keeping a class it
           might drop. `@keyframes blink` is real CSS in globals.css and is always there. Reused
           rather than redeclared. */
        caret.forEach((el) => {
          (el as HTMLElement).style.animation = "blink 1s step-end infinite";
        });
        /* ⚠️ THE PULSE IS BOUND TO A SLOT, NOT TO A ROW, and it stays on slot `VISIBLE_ROWS - 1`
           for the component's whole life. During the 350ms slide it therefore rides upward with
           the row it is on, and snaps back when `paint()` runs. At rest — which is 73% of every
           cycle — it sits on the bottom visible row, which is correct. Chasing the handover
           would mean cross-fading two markers for a third of a second to fix something no one
           can see; recorded so the next reader knows it was considered, not missed. */
        const pulse = rows[VISIBLE_ROWS - 1].querySelector("[data-tm-dot]");
        if (pulse) {
          (pulse as HTMLElement).style.animation = "blink 1.6s ease-in-out infinite";
        }

        const intro = gsap.timeline();
        intro
          .to(banner, { opacity: 1, duration: 0.2, ease: "none" })
          /* ⚠️ THE TYPING IS A WIDTH REVEAL, NOT A TEXT MUTATION. Animating the width of an
             `overflow-hidden` `whitespace-pre` span over a string that is FULLY PRESENT IN THE
             MARKUP looks identical to typing and never touches the DOM. `steps(n)` with n = the
             character count is what makes it land one glyph at a time instead of sliding, and
             `ch` is exact because the face is monospace. It also means the caret, which is the
             next flex item, trails the reveal for free. */
          .to(
            cmd,
            {
              width: `${COMMAND.length}ch`,
              duration: COMMAND.length * 0.035,
              ease: `steps(${COMMAND.length})`,
            },
            ">0.15",
          )
          .to(rows, { opacity: 1, y: 0, duration: 0.18, stagger: 0.09, ease: "power2.out" }, ">0.2");

        /* The endless part. One tick = slide up exactly one row, then advance `head` and snap
           back, so the list stays six rows tall and never grows. `repeatDelay` is the dwell. */
        const loop = gsap.timeline({ repeat: -1, repeatDelay: DWELL_S, paused: true });
        loop
          .to(list, { y: () => -rowH(), duration: SLIDE_S, ease: "power2.inOut" })
          .add(() => {
            head++;
            paint();
            gsap.set(list, { y: 0 });
          });

        intro.eventCallback("onComplete", () => loop.play());

        /* ⚠️ PAUSED WHEN OFF SCREEN, AND THAT IS NOT AN OPTIMISATION DETAIL. This loop never
           ends, so without this it would keep compositing for the entire time a visitor reads
           the rest of the page — on a phone that is measurable battery for something nobody can
           see. `once` is deliberately NOT set here, unlike the intro: the whole point is that it
           resumes. */
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) {
              if (intro.progress() === 1) loop.play();
            } else {
              loop.pause();
            }
          },
        });

        /* Raw-DOM styles and a live ScrollTrigger, neither of which matchMedia can revert on its
           own — if the preference flips to `reduce` mid-session a blinking caret, a pulsing dot
           and a running loop would all otherwise be left behind. Same reasoning as
           ClixBackdrop's cleanup. */
        return () => {
          loop.kill();
          intro.kill();
          st.kill();
          gsap.set(list, { y: 0 });
          caret.forEach((el) => {
            (el as HTMLElement).style.animation = "";
          });
          if (pulse) (pulse as HTMLElement).style.animation = "";
          head = 0;
          paint();
        };
      });
    },
    { scope: root },
  );

  return (
    /* ⚠️ `dir="ltr"` IS LOAD-BEARING — see the header. On /he the page is RTL and without this
       the window chrome mirrors, the verb column flips to the right and the latin targets sit
       backwards against their markers.
       ⚠️ `aria-hidden` is on the ROOT, so nothing inside needs its own. See the header for why
       this is the correct treatment and not a shortcut.
       Width: fills the row up to 720. It is a SIBLING of the hero's `Text & Button` wrapper,
       never a child of it — that wrapper is `max-w-[360px]` at the phone tier and would cap
       this at 360, so the 720 measure would never apply. */
    /* ⚠️ THE CHROME LIVES IN `MockWindow` AS OF 2026-08-13 — the border, radius, `bg-ink`,
       `font-mono`, `dir="ltr"`, `aria-hidden` and the whole title bar. It was inline here until
       `SecurityConsole` arrived and would have duplicated every one of them. The sizing stays
       here, because sizing is the caller's business and this window is 720 wide where the
       console is 900.
       ⚠️ `max-w-[720px]` IS OVERRIDDEN AT >=1200 by the canvas, which positions this absolutely
       at a fixed 720. Below 1200 this is the only window on the page and it fills the row. */
    <MockWindow
      rootRef={root}
      title="clix@production: ~/audit"
      className="w-full max-w-[720px]"
      /* ⚠️ THE BODY HEIGHT IS FIXED, NOT CONTENT-DRIVEN. The feed never stops, so a
         content-sized box would grow without limit and push the whole page down as it ran.

         ⚠️ THESE TWO NUMBERS ARE CHOSEN SO THE WHOLE WINDOW LANDS ON A ROUND 320 / 288, and the
         root's border is why they are not round themselves. `MockWindow`'s root has no height of
         its own, so `border-box` never applies to it and its 1px border sits OUTSIDE the
         children:
           tablet+  1 + 36 (title) + 282 (body) + 1 = 320
           phone    1 + 32 (title) + 254 (body) + 1 = 288
         Those totals are what the hero's height sum in SecurityHero.tsx's tier map is built on,
         and what the canvas's 1000 x 580 composite box is built on. Change one and the rest have
         to move with it.

         Content sums to 39 (banner) + 22.4 (command) + 8 + 134.4 (six rows) = 203.8 inside 282
         at tablet+, and 39 + 19.2 + 8 + 115.2 = 181.4 inside 254 at phone. The slack at the
         bottom is deliberate empty terminal, and it is also the margin that lets a copy edit add
         a row without re-deriving the box. */
      bodyClassName="h-[254px] px-4 py-4 text-[12px] leading-[1.6]
                     tablet:h-[282px] tablet:px-5 tablet:py-5 tablet:text-[14px]"
    >
        {/* Dot-matrix CLIX. Rows are `#` for an on-dot and `.` for off; only the on-dots get a
            fill, so the off-dots cost nothing at render. Column count is derived from the row
            strings rather than hand-written, so editing a glyph cannot desync the grid. */}
        <div
          data-tm-banner
          className="mb-4 grid w-max gap-[2px]"
          style={
            {
              gridTemplateColumns: `repeat(${MATRIX_COLS}, 3px)`,
            } as CSSProperties
          }
        >
          {MATRIX.map((row, y) =>
            row
              .split("")
              .map((cell, x) => (
                <span
                  key={`${y}-${x}`}
                  className={`block h-[3px] w-[3px] ${cell === "#" ? "bg-muted" : ""}`}
                />
              )),
          )}
        </div>

        {/* The command. `$` sits in its own fixed 2ch column so the caret and the reveal cannot
            be pushed around by it. */}
        <div className="flex items-center text-paper">
          <span className="w-[2ch] shrink-0">$</span>
          {/* ⚠️ `overflow-hidden` + `whitespace-pre` + AN EXPLICIT `Nch` WIDTH is the typing
              mechanism, not styling. The inline width is the SSR / reduced-motion state, so with
              JS off the line simply reads complete.

              ⚠️ THIS WAS `w-max` AND THAT WAS A BUG, measured 2026-08-13 before it shipped. As a
              flex item the span came out 650.06px wide against 242.27px of text — it absorbed the
              whole remaining row instead of hugging its content — which left the caret stranded
              ~400px past the end of the command in exactly the two states that have no animation
              to hide it: JS off and reduced motion. Do not put `w-max` back.

              Deriving it from `COMMAND.length` rather than hardcoding a `ch` count is the point:
              this is the SAME expression the tween animates to, so the resting width and the end
              of the animation cannot drift apart, and editing the command keeps them in step. */}
          <span
            data-tm-cmd
            className="overflow-hidden whitespace-pre"
            style={{ width: `${COMMAND.length}ch` }}
          >
            {COMMAND}
          </span>
          {/* Caret. A filled box rather than a block character, for the same glyph-coverage
              reason the banner is a grid — and a block is the terminal idiom, where /product's
              `|` is the text-field one. It renders STEADY here and is set blinking from the
              effect above; see the long note there for why the animation is not in the markup. */}
          <span
            data-tm-caret
            className="ms-[2px] inline-block h-[1.05em] w-[1ch] shrink-0 bg-paper"
          />
        </div>

        {/* ⚠️ THE FEED'S VIEWPORT. `6 * 1.6em` is exactly six rows at BOTH type tiers because the
            row height IS 1.6em — 134.4px at 14px and 115.2px at 12px — so there is no second
            number to keep in sync with the line-height. `overflow-hidden` is what clips the
            seventh row, which is the one that slides into view on each tick. */}
        <div className="mt-2 overflow-hidden" style={{ height: "calc(6 * 1.6em)" }}>
          {/* The strip that moves. Seven rows rendered, six visible; `paint()` rewrites their
              text in place on every tick, so this list never grows and the DOM node count is
              constant for the life of the page. */}
          <ul data-tm-list>
            {Array.from({ length: RENDERED_ROWS }, (_, i) => {
              const task = POOL[i % POOL.length];
              const status = statusAt(i);
              return (
                <li data-tm-row key={i} className={`flex items-center ${TEXT_CLASS[status]}`}>
                  {/* The marker column. A box, not a ●/○/◐ glyph — Fragment Mono's coverage of
                      those is not guaranteed and a fallback at a different advance would shear
                      the two columns beside it. */}
                  <span className="flex w-[2ch] shrink-0 items-center">
                    <span data-tm-dot className={DOT_CLASS[status]} />
                  </span>
                  {/* Fixed 8ch so the targets line up into a column regardless of verb length —
                      the same reason the marker column is fixed. */}
                  <span data-tm-verb className="w-[8ch] shrink-0">
                    {task.verb}
                  </span>
                  <span data-tm-target className="truncate">
                    {task.target}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
    </MockWindow>
  );
}
