"use client";

/**
 * The accessibility widget — the seven controls that `/accessibility` §03 and §04 describe.
 *
 * Added 2026-08-17. Ported from the live https://www.clix-solution.com, which ships exactly
 * this. Unlike the cookie banner, THIS ONE IS REAL — every control does what its label says.
 *
 * ⚠️ PLACEMENT WENT LEFT-EDGE -> FOOTER -> BOTTOM-LEFT, ALL ON 2026-08-17. It shipped pinned to
 * the middle of the left edge; the user moved it into the footer's Legal column; then, on seeing
 * it there, asked for a floating icon in the BOTTOM-LEFT corner instead. That last shape is the
 * one that agrees with §04's "בצד שמאל של המסך" AND restores it to every route — the footer stop
 * had silently dropped it from /news, which renders no footer.
 *
 * WHY IT EXISTS: the accessibility statement was synced to the live site on 2026-08-17 and
 * brought §04 `כפתור נגישות` with it — "בצד שמאל של המסך תמצאו כפתור נגישות" — plus two §03
 * bullets promising text resize and high contrast. Those were false the moment they landed, and
 * they were flagged as such. This makes them true. That statement is a declaration under תקנה 35
 * and ת״י 5568, so "the page says we have it" is not a small thing to leave unbacked.
 *
 * ⚠️ TEXT SIZE USES `zoom`, NOT ROOT `font-size`, AND THAT IS NOT A STYLE CHOICE.
 * The live site sets `documentElement.style.fontSize = "120%"`. That would do almost NOTHING
 * here: this codebase sets type in absolute pixels throughout (`text-[14px]`, `text-[32px]`,
 * `text-[16px]` …), and a px value does not inherit from the root font size. `zoom` scales
 * everything — px type, spacing, images — and is supported in every current browser. The cost
 * is that it scales the widget's own chrome too, which is the expected behaviour for a page
 * zoom and is what a user asking for bigger text actually wants.
 *
 * ⚠️ NO CSS `filter` ON `html` OR `body`, EVER — for high contrast or anything else. A filter
 * on an ancestor makes it the containing block for `position: fixed` descendants, which would
 * unpin the nav, the cookie banner and this widget itself. High contrast therefore REDEFINES
 * DESIGN TOKENS (`--color-muted`, `--color-hairline` …) in globals.css instead. Filters are
 * applied only to `img` and `video`, which contain nothing fixed.
 *
 * ⚠️ `left`, NOT `start`, AND THAT IS LOAD-BEARING. §04 says "בצד שמאל" — physically left — and
 * it says it in HEBREW, where the logical start edge is the RIGHT one. `start-4` would put the
 * button on the opposite side of the very page that describes its position.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useChrome } from "@/lib/i18n/LocaleProvider";

/* ── settings ─────────────────────────────────────────────────────────────────────────── */

export interface A11ySettings {
  /** Page zoom, as a percentage. Clamped to [MIN_ZOOM, MAX_ZOOM] in 10-point steps. */
  readonly zoom: number;
  readonly highContrast: boolean;
  readonly bigCursor: boolean;
  readonly highlightLinks: boolean;
  readonly readableFont: boolean;
  readonly focusMode: boolean;
}

const STORAGE_KEY = "clix-a11y-settings";
const MIN_ZOOM = 80;
const MAX_ZOOM = 150;
const STEP = 10;

/* Module-level and frozen: `getServerSnapshot` must return a STABLE REFERENCE or React will
   re-render forever. A fresh object literal per call is the classic useSyncExternalStore trap. */
const DEFAULTS: A11ySettings = Object.freeze({
  zoom: 100,
  highContrast: false,
  bigCursor: false,
  highlightLinks: false,
  readableFont: false,
  focusMode: false,
});

/** Every boolean flag paired with the class it puts on `<html>`. Drives both apply and reset. */
const FLAG_CLASSES = [
  ["highContrast", "a11y-high-contrast"],
  ["bigCursor", "a11y-big-cursor"],
  ["highlightLinks", "a11y-highlight-links"],
  ["readableFont", "a11y-readable-font"],
  ["focusMode", "a11y-focus-mode"],
] as const satisfies ReadonlyArray<readonly [keyof A11ySettings, string]>;

/* ── the store ────────────────────────────────────────────────────────────────────────────
   Same shape as CookieBanner's, and for the same reason: this project's lint runs the React
   Compiler rules, and `react-hooks/set-state-in-effect` rejects reading storage into state on
   mount. `useSyncExternalStore` is the sanctioned route and hands us the SSR split for free.

   The snapshot is CACHED here, unlike the cookie banner's — that one returns a string, where
   React's identity check is a value comparison, but this returns an OBJECT and a fresh one per
   call would never compare equal. */

let cache: A11ySettings | null = null;
let listeners: Array<() => void> = [];

function load(): A11ySettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const saved = JSON.parse(raw) as Partial<A11ySettings>;
    /* Spread over DEFAULTS rather than trusting the parse: this is user-editable storage that
       may also predate a future field. A missing key falls back; an unknown key is dropped. */
    return {
      ...DEFAULTS,
      ...saved,
      zoom: clampZoom(Number(saved.zoom) || DEFAULTS.zoom),
    };
  } catch {
    /* Blocked storage or corrupt JSON. Defaults are always a valid page. */
    return DEFAULTS;
  }
}

function clampZoom(v: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(v / STEP) * STEP));
}

function subscribe(onChange: () => void) {
  listeners = [...listeners, onChange];
  return () => {
    listeners = listeners.filter((l) => l !== onChange);
  };
}

function getSnapshot(): A11ySettings {
  if (cache === null) cache = load();
  return cache;
}

const getServerSnapshot = (): A11ySettings => DEFAULTS;

function update(patch: Partial<A11ySettings>) {
  cache = { ...getSnapshot(), ...patch };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    /* Storage blocked. The setting still applies for this page view — it simply will not
       survive a reload, which is a better failure than refusing to apply it at all. */
  }
  listeners.forEach((l) => l());
}

/* ── applying it to the document ──────────────────────────────────────────────────────── */

/**
 * Writes the settings onto `<html>`. Called from an effect, which is exactly what effects are
 * for — synchronising an external system with React state. It sets no state, so the lint rule
 * that shaped the store above does not apply here.
 */
function applyToDocument(s: A11ySettings) {
  const root = document.documentElement;
  /* `zoom` rather than `style.fontSize` — see the note at the top of this file. `""` rather
     than `"100%"` at rest so the property is absent entirely when nothing is asked for. */
  root.style.zoom = s.zoom === 100 ? "" : `${s.zoom}%`;
  for (const [key, className] of FLAG_CLASSES) {
    root.classList.toggle(className, Boolean(s[key]));
  }
}

/* ── the component ────────────────────────────────────────────────────────────────────── */

export default function AccessibilityWidget() {
  const { a11yWidget: t } = useChrome();
  const settings = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyToDocument(settings);
  }, [settings]);

  /* Escape closes and returns focus to the trigger. Registered only while open, so it never
     competes with anything else on the page. The panel is deliberately NOT a focus trap — it
     is a small non-blocking popover and trapping focus in it would be the more hostile choice.
     `setOpen` here runs inside an event handler, not in the effect body. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* Click outside closes. `pointerdown` rather than `click` so it fires before a link's own
     activation — a tap that lands on the page behind the panel should dismiss it and still do
     what it was aimed at, not spend one tap dismissing.

     Registering this only WHILE OPEN is also what stops it eating its own opening event: that
     event's `pointerdown` has already been dispatched by the time this effect runs, so there is
     no open-then-immediately-close race and no need for a timeout to dodge one.

     Focus is NOT pulled back to the trigger here, unlike the Escape path. Escape is a keyboard
     dismissal and the keyboard user needs somewhere to be; a pointer dismissal has already put
     the user wherever they clicked, and yanking focus away from it would be the rude thing. */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapperRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const toggle = (key: keyof A11ySettings) => () =>
    update({ [key]: !settings[key] } as Partial<A11ySettings>);

  const reset = () => {
    update(DEFAULTS);
  };

  const canGrow = settings.zoom < MAX_ZOOM;
  const canShrink = settings.zoom > MIN_ZOOM;

  return (
    /* One fixed stack in the bottom-left corner. `flex-col-reverse` puts the FIRST child at the
       bottom, so the trigger sits in the corner and the panel stacks above it — no absolute
       positioning, no measuring, and the panel grows upward into free space rather than off the
       bottom of the screen.

       `z-[60]` clears the cookie banner's z-50 for the one page view that shows both. */
    <div
      ref={wrapperRef}
      className="fixed bottom-4 left-4 z-[60] flex flex-col-reverse items-start gap-2"
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="a11y-panel"
        /* Icon-only, so it needs an explicit name — unlike the footer version, where the visible
           label was the name. It states the ACTION rather than the state, because `aria-expanded`
           already carries the state and repeating it in the name makes screen readers say it
           twice. */
        aria-label={open ? t.close : t.open}
        className="flex h-12 w-12 flex-none cursor-pointer items-center justify-center
                   rounded-full bg-[#1b3a5f] text-paper shadow-[0_4px_16px_rgba(0,0,0,0.28)]
                   transition-transform duration-300 hover:scale-105
                   focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-[#1b3a5f] motion-reduce:transition-none"
        style={{ transitionTimingFunction: "var(--ease-rogo)" }}
      >
        <AccessibilityMark />
      </button>

      {open && (
        <div
          id="a11y-panel"
          role="group"
          aria-label={t.title}
          /* Capped against the viewport, not just given a width: at 390px the corner inset plus
             a fixed 300 would overflow, and an accessibility panel that needs a horizontal
             scroll to reach its own controls would be its own joke. */
          className="max-h-[70vh] w-[min(300px,calc(100vw-2rem))] overflow-y-auto
                     rounded-[10px] border border-hairline bg-paper p-4
                     shadow-[0_8px_32px_rgba(0,0,0,0.22)]"
        >
          <p className="font-sans text-[14px] font-medium text-ink">{t.title}</p>

          {/* Text size — a stepper, not a toggle, so it gets its own block. */}
          <div className="mt-4">
            <p className="font-sans text-[12px] text-muted">{t.textSize}</p>
            <div className="mt-2 flex items-center gap-2">
              <StepButton
                onClick={() => update({ zoom: settings.zoom - STEP })}
                disabled={!canShrink}
                label={t.decrease}
              >
                −
              </StepButton>
              {/* `tabular-nums` so the row does not jitter as the number changes width.
                  `dir="ltr"` because a percentage is a number and reads the same either way. */}
              <span
                dir="ltr"
                className="min-w-[52px] text-center font-sans text-[13px]
                           tabular-nums text-ink"
              >
                {settings.zoom}%
              </span>
              <StepButton
                onClick={() => update({ zoom: settings.zoom + STEP })}
                disabled={!canGrow}
                label={t.increase}
              >
                +
              </StepButton>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <Toggle
              on={settings.highContrast}
              onClick={toggle("highContrast")}
              label={t.highContrast}
            />
            <Toggle
              on={settings.bigCursor}
              onClick={toggle("bigCursor")}
              label={t.bigCursor}
            />
            <Toggle
              on={settings.highlightLinks}
              onClick={toggle("highlightLinks")}
              label={t.highlightLinks}
            />
            <Toggle
              on={settings.readableFont}
              onClick={toggle("readableFont")}
              label={t.readableFont}
            />
            <Toggle
              on={settings.focusMode}
              onClick={toggle("focusMode")}
              label={t.focusMode}
            />
          </div>

          <button
            type="button"
            onClick={reset}
            className="mt-4 w-full cursor-pointer rounded-[6px] border border-hairline
                       px-3 py-2 font-sans text-[13px] text-muted
                       transition-colors duration-300 hover:border-ink hover:text-ink
                       focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-ink motion-reduce:transition-none"
          >
            {t.reset}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── pieces ───────────────────────────────────────────────────────────────────────────── */

function StepButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 flex-none cursor-pointer items-center justify-center
                 rounded-[6px] border border-hairline font-sans text-[16px] text-ink
                 transition-colors duration-300 hover:border-ink
                 focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-ink disabled:cursor-not-allowed
                 disabled:opacity-40 disabled:hover:border-hairline
                 motion-reduce:transition-none"
    >
      {children}
    </button>
  );
}

/**
 * `role="switch"` with `aria-checked`, not a checkbox and not a plain button — a screen reader
 * then announces both the label and the on/off state, which a button alone would not. The tick
 * is `aria-hidden`: it is a duplicate of `aria-checked` for sighted users only.
 */
function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-[6px]
                  px-3 py-2 text-start font-sans text-[13px]
                  transition-colors duration-300 hover:bg-ink-wash
                  focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-ink motion-reduce:transition-none
                  ${on ? "bg-ink-wash text-ink" : "text-muted"}`}
    >
      <span>{label}</span>
      <span
        aria-hidden="true"
        className={`flex h-4 w-4 flex-none items-center justify-center rounded-[4px]
                    border text-[10px] leading-none
                    ${on ? "border-ink bg-ink text-paper" : "border-hairline"}`}
      >
        {on ? "✓" : ""}
      </span>
    </button>
  );
}

/** The international accessibility symbol: a ring around a figure with its arms out. */
function AccessibilityMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10.2" />
      <circle cx="12" cy="6.4" r="1.7" fill="currentColor" stroke="none" />
      <path d="M4.9 9.6c2.4.9 4.7 1.3 7.1 1.3s4.7-.4 7.1-1.3" />
      <path d="M12 10.9v3.4M12 14.3 9.4 20.2M12 14.3l2.6 5.9" />
    </svg>
  );
}
