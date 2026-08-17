"use client";

/**
 * ServiceReel — the scroll behaviour of /company Block 3, and the band's only client JS.
 *
 * ⚠️ THIS REPLACED `ServiceStack.tsx` ON 2026-08-17. Read the note in CompanyServices.tsx on
 * the third rebuild before assuming anything here is incidental.
 *
 * ─── WHAT IT DOES ────────────────────────────────────────────────────────────────────────
 *
 * The band is one TALL container with a STICKY frame inside it. The frame never moves; three
 * synchronised tracks slide inside it — the service names, the detail block under them, and
 * the eight scenes — each translated by `-i × <its own item height>`. Scroll position picks
 * `i`; everything else is CSS reading `--reel-i`.
 *
 * This file therefore does only four things:
 *
 *   1. THE INDEX — `i = round(progress × 7)`, written as `--reel-i` on the frame plus
 *      `data-state` on every item, detail and panel. Every visual state in globals.css hangs
 *      off those two; there is no style written from JS anywhere below.
 *   2. THE PROCESS — each scene assembles itself in the order its service actually works,
 *      and keeps doing it while that scene is the live one. §2 below.
 *   3. THE JUMP — clicking or Entering a service name scrolls to its position in the band.
 *   4. `data-idle`, which is the CSS animation gate in globals.css. Written from the same
 *      index, so the ambient loops only run on the scene you are looking at.
 *
 * ⚠️ IT WRITES NO TEXT AND NO STYLE. It briefly also set a `01`/`08` counter in the frame's
 * rail; the rail was removed on sight (see CompanyServices.tsx). Everything below is one
 * custom property and a set of attributes — which is what keeps the band's markup, and its
 * dictionary, on the server.
 *
 * ─── WHY THE MEASUREMENT PROBLEM IS GONE ─────────────────────────────────────────────────
 *
 * The sticky-stack version of this band could not use a card as a ScrollTrigger `trigger` at
 * all: ScrollTrigger resolves start/end from `getBoundingClientRect()`, which for a STUCK
 * element reports where it is painted rather than where it sits in the document, so every
 * trigger had to be rebuilt from a hand-rolled `flowTop()` walking `offsetTop` up the
 * `offsetParent` chain. That whole apparatus — and the class of "correct on load, wrong after
 * any mid-band refresh" bugs it existed to prevent — is deleted here, because the element
 * being measured (`[data-reel-scroller]`) is NOT sticky. Its child is. A plain
 * `start: "top top" / end: "bottom bottom"` is honest.
 *
 * ⚠️ SO DO NOT PUT `position: sticky` ON THE SCROLLER. The sticky belongs to the frame
 * wrapper one level in. Moving it up would silently reintroduce the entire problem above.
 *
 * ─── 1. WHAT IS AND IS NOT INSIDE matchMedia ─────────────────────────────────────────────
 *
 * The repo idiom is ClixBackdrop.tsx:216 — `useGSAP` → `gsap.matchMedia` →
 * `(prefers-reduced-motion: no-preference)`. Followed here, with one split:
 *
 *   · THE SCENE PLAYERS are inside the gate. A reduced-motion visitor gets no timeline BUILT
 *     AT ALL — which matters more than it looks, because a built timeline's `from()` tweens
 *     render immediately and would zero out a scene the visitor is meant to see whole.
 *   · THE INDEX is OUTSIDE it. Which service is showing is STATE, not motion: the tracks have
 *     to keep tracking under reduced motion or the band shows service 1 forever. The
 *     TRANSITIONS on those tracks are CSS, and globals.css clamps their duration under the
 *     same query — so a reduced-motion visitor gets the same reel, cutting instead of gliding.
 *
 * `onIndex` is the seam: the gate publishes it, `paint()` calls it if it is there.
 *
 * ─── 2. THE PROCESS PLAYER ───────────────────────────────────────────────────────────────
 *
 * Added 2026-08-17 (user: *"i want some movements per cards, for example like the process for
 * the service, its like the presentation"*), and carried across from `ServiceStack.tsx`
 * unchanged apart from what drives it — per-card ScrollTriggers then, one index change now.
 *
 * ⚠️ THE CHOREOGRAPHY IS NOT IN THIS FILE — IT IS DATA IN THE SCENES. `serviceArt.tsx` marks
 * elements with `data-step="n"`, and this file turns step ORDER into TIME. There is no
 * per-scene JavaScript anywhere and there must not be: eight bespoke timelines is eight things
 * to retune every time a scene is redrawn, and the step map lives where the drawing lives.
 * Three beats cover all eight scenes:
 *
 *   · `data-step="n"` — reveal. Opacity and a 6px lift. The default; a scene is mostly this.
 *   · `data-fill`     — a bar grows to its scored length (`Track`).
 *   · `data-count`    — a number counts up to the value already in the HTML.
 *
 * `data-fill` and `data-count` carry no step of their own: they take the step of their nearest
 * marked ancestor, so a bar grows and a stat counts on the same beat the row they belong to
 * lands. Anything with no marker at all is CHROME and is simply there from the first frame —
 * a browser window that faded in around its own page, or a handset that faded in around its
 * own screen, would be describing the wrong thing.
 *
 * ⚠️ THE PROCESS LOOPS; THE COPY DOES NOT. The user asked for the whole process to repeat
 * while the service is live, so nothing is missed regardless of when you look — hence
 * `repeat: -1`. The name, promise and chips are NOT in that timeline: they cross-fade once
 * per index change, in CSS. Re-animating a heading and a paragraph every seven seconds beside
 * copy someone is trying to read is the failure mode this band has already been caught on
 * once. Motion loops on the picture, never on the prose.
 *
 * ⚠️ NEVER PUT A `data-step` ON A NODE THAT CARRIES A CSS ANIMATION. A CSS animation beats an
 * inline style in the cascade, so the reveal's transform and opacity would be swallowed and
 * the element would appear to ignore its beat. Mark the container instead — which is why
 * scene 6's push card sits inside a bare wrapper, recorded at that call site.
 *
 * ⚠️ THE BAND'S "NO X-AXIS MOTION" RULE IS AMENDED HERE, AND ONLY HERE. `serviceArt.tsx` and
 * globals.css forbid X motion and `transform-origin` because a CSS KEYFRAME cannot know the
 * document's direction, so anything asymmetric would owe /he a `[dir="rtl"]` companion rule.
 * A GSAP tween can read `documentElement.dir` in one line, which is exactly what `FILL_ORIGIN`
 * below does — so a bar grows from the reading edge in both locales with no second rule. The
 * CSS-side prohibition stands unchanged; this file is the one place with the information to
 * be exempt from it. (The reel's own tracks are Y-only and mirror for free.)
 *
 * ─── 3. THE INVARIANT THIS FILE INHERITS ─────────────────────────────────────────────────
 *
 * ⚠️ THE RESTING CSS IS THE FINISHED STATE — the same rule the eight scenes are drawn under
 * (globals.css, "every keyframe's base state is the shipped static design"). Hence
 * `gsap.from()` for every beat of the process: they animate TOWARDS the server-rendered
 * picture, so SSR first paint, the JS-off render and the reduced-motion render are all already
 * correct and nothing is ever hidden waiting for a trigger that may not fire. `gsap.to()` from
 * a hidden start would put eight blank scenes one bad breakpoint away.
 *
 * The same rule governs the reel's own CSS: `--reel-i` defaults to 0 and the UNDIMMED panel is
 * the BASE state, so with JS off the frame shows service 1 whole and the other seven sit below
 * it, clipped by their window. Never invert those defaults.
 *
 * The count beat obeys it the long way round: the real value is what ships in the HTML, it is
 * zeroed only once the tween actually starts, and `onComplete` lands back on the authored
 * string rather than on a reconstruction of it — the idiom `ui/CountUp.tsx` uses, for the same
 * reasons. Its regex is not reused because it only handles a leading integer, and these values
 * include `$1.2m`, `0.9s` and `0.01`.
 *
 * Spec: features/company-page/FEATURE.md ("Block 3") · memory: features/company-page/CONTEXT.md
 */

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---- The process player's timing. These four are the knobs. ----------------------------- */

/** Dead time before step 1, so the scene does not start in the same frame the panel arrives. */
const LEAD = 0.3;
/** Gap between consecutive steps. The pace of the whole thing; the number most likely to move. */
const BEAT = 0.22;
/**
 * How long the finished scene is held before it dissolves and the process replays. Built into
 * the timeline rather than set as `repeatDelay`, because the dissolve has to happen INSIDE the
 * cycle — see the note at the tail of `buildScene`.
 *
 * ⚠️ 3s AND NOT 4.5s, ON THE USER'S CALL (*"maybe after 3 seconds it should redo the
 * animation"*), AND THE ORIGINAL NUMBER WAS A MISJUDGEMENT WORTH RECORDING. At 4.5 the full
 * cycle was ~7.5s, which is a long time to sit in front of a scene waiting to find out whether
 * anything repeats — long enough that the user reported the loop as broken when it was merely
 * slow. **A loop nobody waits long enough to see is indistinguishable from no loop.** The hold
 * has to be short enough that the SECOND pass arrives while the viewer is still watching the
 * first, or the whole feature is invisible.
 */
const HOLD = 3;
/** Per-beat durations. Reveal is short; a bar and a counter are allowed to overrun into the
    next beat or two, because both read as a value settling rather than as an element landing. */
const REVEAL_D = 0.5;
const FILL_D = 0.7;
const COUNT_D = 0.9;

/**
 * `prefix · number · suffix`, which is what makes this a regex and not `Number(el.textContent)`.
 * The live values are `142`, `1.2s`, `98%`, `63`, `$1.2m`, `$480k`, `98`, `0.9s`, `0.01` and
 * five bare scores. A token with no digits in it never counts — it just renders as authored.
 */
const NUMBER = /^(\D*)(\d+(?:\.\d+)?)(.*)$/;

export default function ServiceReel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const scroller = el.querySelector<HTMLElement>("[data-reel-scroller]");
      const frame = el.querySelector<HTMLElement>("[data-reel-frame]");
      const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-reel-panel]"));
      const items = Array.from(el.querySelectorAll<HTMLElement>("[data-reel-item]"));
      const details = Array.from(el.querySelectorAll<HTMLElement>("[data-reel-detail]"));
      if (!scroller || !frame || panels.length === 0) return;

      const last = panels.length - 1;

      /* ---- The index — outside matchMedia, because it is state and not motion ---------- */

      /**
       * Published by the motion gate below and called on every index change. Null under
       * `prefers-reduced-motion: reduce`, which is the whole mechanism for "the reel still
       * tracks, the scenes never assemble".
       */
      let onIndex: ((i: number) => void) | null = null;

      let current = -1;
      const paint = (i: number) => {
        if (i === current) return;
        current = i;

        /* One number, inherited by all three tracks. Each multiplies it by its OWN item
           height, which is why the names, the detail and the art can move together while
           moving by three different distances. */
        frame.style.setProperty("--reel-i", String(i));

        panels.forEach((panel, n) => {
          /* `near` earns the blur; `far` is simply not drawn. Blurring seven scenes that are
             outside the window anyway is the one thing here expensive enough to notice. */
          panel.dataset.state = n === i ? "active" : Math.abs(n - i) === 1 ? "near" : "far";
          panel.toggleAttribute("data-idle", n !== i);
        });
        items.forEach((item, n) => {
          item.dataset.state = n === i ? "active" : n < i ? "past" : "future";
        });
        details.forEach((detail, n) => {
          detail.dataset.state = n === i ? "active" : "idle";
        });
        onIndex?.(i);
      };

      /* ⚠️ `round`, NOT `floor`. With `floor`, service 8 would be reachable only in the single
         frame where progress is exactly 1, and the first seven would each change over on
         arrival rather than at the midpoint. `round` puts the changeover halfway between two
         services, so each one holds the frame for a full `--reel-step` of scroll. */
      const readIndex = (progress: number) =>
        paint(Math.min(last, Math.max(0, Math.round(progress * last))));

      ScrollTrigger.create({
        trigger: scroller,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => readIndex(self.progress),
        /* Covers a load that lands mid-band, where no scroll crossing ever happens. */
        onRefresh: (self) => readIndex(self.progress),
      });

      /* ---- The jump — what makes eight services keyboard-reachable --------------------- */

      /**
       * ⚠️ THE NAMES ARE REAL `<button>`s AND THIS IS DELIBERATE. The reference this layout
       * came from hangs `onClick` on the `<li>` and marks every already-passed item
       * `pointer-events: none`, so its list is unreachable by keyboard and one-way by mouse.
       * Eight services a keyboard user cannot get to is not a nitpick on a services page.
       * Past items here stay at 0.15 opacity rather than 0, precisely so that a control you
       * can still focus is a control you can still see.
       */
      const jump = (i: number) => {
        const top = scroller.getBoundingClientRect().top + window.scrollY;
        const span = scroller.offsetHeight - window.innerHeight;
        if (span <= 0) return;
        window.scrollTo({
          top: top + (i / last) * span,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        });
      };

      /* Delegated, so eight listeners do not need eight removals. */
      const onClick = (event: Event) => {
        const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-reel-go]");
        if (!target) return;
        const i = Number(target.dataset.reelGo);
        if (Number.isFinite(i)) jump(i);
      };
      el.addEventListener("click", onClick);

      /* ---- The motion — gated ---------------------------------------------------------- */

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* The one X-axis exemption in the band, and the reason it is allowed: this is JS, so
           it can ask which way the document reads. Resolved once — `dir` does not change
           without a navigation, and /he is a separate route with its own layout. */
        const FILL_ORIGIN =
          document.documentElement.dir === "rtl" ? "right center" : "left center";

        /**
         * Build one scene's process timeline.
         *
         * ⚠️ BUILT LAZILY, ON FIRST ACTIVATION, AND THAT IS LOAD-BEARING. A `from()` tween
         * renders immediately, so building all eight up front would blank all eight scenes at
         * mount — including whichever one the visitor is already looking at.
         */
        const buildScene = (panel: HTMLElement) => {
          const tl = gsap.timeline({
            paused: true,
            repeat: -1,
            defaults: { ease: "power2.out" },
          });
          /* Every counted node with the string it shipped with, so the cleanup can put the
             text back. `clearProps` cannot: a count writes `textContent`, not style, so a
             timeline killed mid-cycle would otherwise leave a stat frozen at "0.4". */
          const counts: { node: HTMLElement; authored: string }[] = [];
          const bail = () => ({ tl, rest: 0, counts });

          /* Group the marked elements by step. A step is a BEAT, not an element: four agent
             rows on step 4 land together with only the stagger between them. */
          const groups = new Map<number, HTMLElement[]>();
          panel.querySelectorAll<HTMLElement>("[data-step]").forEach((node) => {
            const k = Number(node.dataset.step);
            if (!Number.isFinite(k)) return;
            const bucket = groups.get(k);
            if (bucket) bucket.push(node);
            else groups.set(k, [node]);
          });
          if (groups.size === 0) return bail();

          const steps = Array.from(groups.keys()).sort((a, b) => a - b);
          /* Steps are RANKED, not used as raw multipliers: a scene that starts at 3 or skips
             a number must not open with dead air, and scene 7's ten beats must not run at a
             different pace from scene 2's seven. */
          const at = new Map(steps.map((k, rank) => [k, LEAD + rank * BEAT]));

          steps.forEach((k) => {
            const beat = groups.get(k);
            if (!beat) return;
            tl.from(
              beat,
              { opacity: 0, y: 6, duration: REVEAL_D, stagger: 0.05 },
              at.get(k),
            );
          });

          /* A bar and a counter take the step of the row they belong to — `closest` includes
             the node itself, so an explicitly-marked one still works. */
          const beatOf = (node: HTMLElement) => {
            const owner = node.closest<HTMLElement>("[data-step]");
            const k = owner ? Number(owner.dataset.step) : Number.NaN;
            return at.get(k) ?? LEAD;
          };

          panel.querySelectorAll<HTMLElement>("[data-fill]").forEach((bar) => {
            /* Offset a touch past its row: the row lands, THEN the bar runs out to its
               length. Simultaneous reads as one blurred event rather than as a consequence. */
            tl.from(
              bar,
              { scaleX: 0, transformOrigin: FILL_ORIGIN, duration: FILL_D },
              beatOf(bar) + 0.08,
            );
          });

          /* ⚠️ THE CYCLE ENDS WITH A FADE, AND WITHOUT IT THE LOOP IS UNWATCHABLE. A repeating
             timeline jumps from its last frame straight back to time 0, where every `from()`
             renders its start — so the finished scene would VANISH in a single frame and then
             rebuild. Dissolving the content first means the loop point is the one moment
             nothing is happening, which is where a cut belongs.

             Only the MARKED elements fade. The chrome has no step and never leaves, so what
             the eye sees is a window whose contents reload — not a window that blinks. */
          const marked = panel.querySelectorAll<HTMLElement>("[data-step]");
          const rest = LEAD + (steps.length - 1) * BEAT + Math.max(REVEAL_D, FILL_D, COUNT_D);
          tl.to(
            marked,
            { opacity: 0, duration: 0.45, stagger: 0.02, ease: "power1.in" },
            rest + HOLD,
          );
          /* ⚠️ AND THIS IS WHAT MAKES THE LOOP POINT DETERMINISTIC. Two tweens now write
             `opacity` on the same elements — the reveal's `from()` at the head and the fade's
             `to()` at the tail — so which of them owns the value at the top of a cycle depends
             on the order GSAP renders children across a repeat wrap. It resolves correctly on
             today's GSAP (a wrap is a BACKWARD render, children go in reverse, so the reveal's
             start state lands after the fade's) and that is a detail of the engine, not a
             promise it makes. `onRepeat` fires after the wrap has been rendered, so writing the
             hidden state there settles it from outside the timeline and cannot be reordered. */
          tl.eventCallback("onRepeat", () => {
            gsap.set(marked, { opacity: 0 });
          });

          panel.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
            const authored = node.textContent ?? "";
            const parsed = NUMBER.exec(authored);
            if (!parsed) return; /* nothing numeric — leave the SSR text alone */
            const [, prefix, digits, suffix] = parsed;
            const target = Number(digits);
            const dp = (digits.split(".")[1] ?? "").length;
            counts.push({ node, authored });
            const value = { v: 0 };

            tl.to(
              value,
              {
                v: target,
                duration: COUNT_D,
                onUpdate: () => {
                  node.textContent = `${prefix}${value.v.toFixed(dp)}${suffix}`;
                },
                /* Land on the authored string rather than on a reconstruction of it. */
                onComplete: () => {
                  node.textContent = authored;
                },
              },
              beatOf(node),
            );
          });

          return { tl, rest, counts };
        };

        /* `rest` travels with the timeline because it is where a PARKED scene has to sit, and
           it is NOT `progress(1)` — the cycle ends faded out, so seeking to the end would park
           every off-screen scene blank. It is the moment the scene is finished and still, which
           matters here because the two neighbouring panels are visible through the mask. */
        const scenes = new Map<
          HTMLElement,
          { tl: gsap.core.Timeline; rest: number; counts: { node: HTMLElement; authored: string }[] }
        >();

        onIndex = (i) => {
          panels.forEach((panel, n) => {
            if (n === i) {
              let scene = scenes.get(panel);
              if (!scene) {
                scene = buildScene(panel);
                scenes.set(panel, scene);
              }
              scene.tl.restart();
            } else {
              /* Nothing is built for a scene that has never been live, so this is a no-op for
                 most of them — which is the point of building lazily. */
              const scene = scenes.get(panel);
              if (scene) scene.tl.pause().time(scene.rest);
            }
          });
        };

        /* `paint()` has already run by the time the gate is added, so the scene the visitor is
           actually looking at would otherwise wait for the next index change to start. */
        if (current >= 0) onIndex(current);

        return () => {
          onIndex = null;
          /* `mm.revert()` reverses the tweens; this clears what GSAP left inline on the
             elements it touched, so a reduced-motion switch mid-session lands on the resting
             CSS rather than on a half-assembled scene. */
          scenes.forEach((scene) => {
            scene.tl.kill();
            scene.counts.forEach(({ node, authored }) => {
              node.textContent = authored;
            });
          });
          scenes.clear();
          panels.forEach((panel) => {
            gsap.set(panel.querySelectorAll("[data-step],[data-fill]"), {
              clearProps: "transform,opacity",
            });
          });
        };
      });

      /* `font-display: swap` moves the scroller's own height the moment the display face
         lands — the same reason CountUp.tsx:75 does this. */
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        el.removeEventListener("click", onClick);
        mm.revert();
      };
    },
    { scope: root },
  );

  /* ⚠️ NO `overflow` OF ANY KIND ON THIS WRAPPER OR ON `[data-reel-scroller]`, EVER. An
     ancestor with `overflow: hidden` becomes the sticky frame's scroll container and the frame
     silently stops sticking — the bug this band already paid for twice. The clipping this
     layout needs happens INSIDE the frame, on the three track windows, which are descendants
     of the sticky element and therefore harmless. */
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
