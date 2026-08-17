"use client";

/**
 * ContactForm — the form on /contact, and the only real form on this site. Owns BOTH columns:
 * the sticky brief-rail and the form panel beside it.
 *
 * Spec: features/contact-page/FEATURE.md · memory: features/contact-page/CONTEXT.md
 * Reference (structure and copy only): docs/reference/clixsolutions/pages/contact.html
 *
 * WHAT IS TAKEN FROM THE REFERENCE AND WHAT IS NOT.
 * Taken: the field list and its order, the five placeholders, which three fields are
 * `required`, both pill vocabularies, and the two groups' ARIA semantics — `aria-pressed` on
 * the six "relevant" pills (multi-select) and `role="radio"` on the four budget pills
 * (single-select). Those are facts read off the saved HTML, not choices.
 * Not taken: every pixel. The reference is a rounded card with grey filled inputs and a violet
 * gradient pill button; this is the site's own vocabulary. Requested explicitly by the user on
 * 2026-08-13 ("our own design, also our own layout").
 *
 * ─── REDESIGNED 2026-08-17 ───────────────────────────────────────────────────────────────────
 *
 * The page shipped on 2026-08-13 and, as features/contact-page/CONTEXT.md records, NOBODY EVER
 * LOOKED AT IT. What a look found: five identical `border-t hairline pt-8` blocks stacked
 * ~1400px tall, numerals at 12px `mark` (3.41:1, effectively invisible), no progress or
 * completion signal of any kind, and the site's terminal CTA rendered `w-min` — the smallest
 * element in its own column.
 *
 * The user lifted all four constraints FEATURE.md recorded as deliberate for this page —
 * motion, an accent colour, elevation, and a red for errors — and asked for the visual language
 * of /company Block 3. So: a `bone` band, one white elevated panel, four groups that read as
 * numbered STEPS which visibly complete, `signal` teal for on-track and `alert` red for wrong.
 *
 * ⚠️ THE ACCENT IS A STATE CHANNEL, NOT DECORATION, and the restraint clause is in globals.css
 * beside the two tokens. Short version: `signal` paints only step chips, focus underlines, the
 * progress bar, the counters and the success mark; `alert` paints only invalid state. Headings,
 * body, labels, placeholders, consent and THE SUBMIT BUTTON stay `ink`/`muted`. The button
 * stays `bg-ink` because that is this site's primary button on a light ground (/product,
 * /company) — an accent-filled submit would be the accent doing decoration.
 *
 * ⚠️ NO GSAP, AND NO ANIMATION LIBRARY AT ALL. Every motion here is a one-shot mount reveal or
 * a state transition; nothing is scroll-driven, scrubbed or pinned. The keyframes live in
 * globals.css under a `(prefers-reduced-motion: no-preference)` block — read the long note
 * there, because the global reduced-motion clamp does NOT zero `animation-delay` and a
 * staggered entrance authored outside that block gives reduced-motion visitors a timed flash of
 * blank content.
 *
 * ⚠️ MONO IS ON THE NUMERALS AND THE COUNTERS ONLY. `--font-mono` (Fragment Mono) has no Hebrew
 * coverage — its @font-face unicode-ranges in src/app/fonts.css are Latin, Greek and Cyrillic,
 * not U+0590–05FF — so anything Hebrew set in it falls back to the OS monospace mid-line. `01`
 * through `04`, `3/6` and `120 / 4000` are Latin digits and punctuation in both locales, so
 * they are safe and they are the whole of mono's use here. Legends, labels and errors are
 * `font-sans`. The check and alert marks are SVG paths for the same reason — see
 * contactGlyphs.tsx. Same note in ContactChannels.tsx.
 *
 * ⚠️ ERRORS NOW HAVE A COLOUR, AND COLOUR IS STILL NOT THE ONLY SIGNAL. Until today this design
 * system had no red, so an invalid field stated itself by thickening its underline to `ink` —
 * which is the SAME value `focus` used, making the two states visually identical. That is the
 * defect `--color-alert` fixes. WCAG 1.4.1 was satisfied before the red and still is: an
 * invalid field carries the alert glyph, the message text, `aria-invalid`, `aria-describedby`
 * AND its step chip. The colour is added on top of those, never instead of one.
 *
 * ⚠️ VALIDATION IS DUPLICATED, AND MUST BE. The same rules live here and in
 * src/app/api/contact/route.ts. The client copy exists so a typo does not cost a round trip;
 * the server copy exists because the client copy is unenforceable. If a bound changes, change
 * both — the API is the one that counts. The step-completion rules below DERIVE from these
 * same constants and are not a third copy.
 *
 * ⚠️ THE OPTION IDS ARE THE WIRE FORMAT. `NEED_ORDER` / `BUDGET_ORDER` below are display order;
 * the ids inside them are what gets POSTed and what the API's allow-list checks, so the email
 * reads identically whichever language filled the form in. Labels are looked up by id, never by
 * index — an inserted option would otherwise silently re-pair every label after it.
 */

import { useId, useRef, useState } from "react";
import { usePageDict, useDirSign } from "@/lib/i18n/LocaleProvider";
import { interpolate } from "@/lib/i18n/format";
import AppLink from "@/components/ui/AppLink";
import { CONTACT, CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact";
import type { BudgetId, NeedId } from "@/lib/i18n/en/contact";

import { AlertGlyph, CheckGlyph } from "./contactGlyphs";

/* Display order. The reference's own, top to bottom. */
const NEED_ORDER: readonly NeedId[] = [
  "ai-agents",
  "whatsapp",
  "crm",
  "integrations",
  "custom-software",
  "consulting",
];

const BUDGET_ORDER: readonly BudgetId[] = [
  "upto-10k",
  "15-25k",
  "25-75k",
  "75k-plus",
];

/* Kept in step with src/app/api/contact/route.ts by hand. See the note above. */
const LIMITS = {
  nameMax: 120,
  emailMax: 200,
  shortMax: 120,
  messageMin: 10,
  messageMax: 4000,
} as const;

/* The character counter turns `alert` here. 90% of the maximum — far enough in that it is a
   genuine warning rather than ambient noise, early enough that 400 characters remain to finish
   a sentence in. */
const MESSAGE_WARN_AT = Math.floor(LIMITS.messageMax * 0.9);

/* Below this many characters remaining, and only then, the textarea's live region starts
   speaking. Announcing from character one would make a screen reader recite the whole tail. */
const CHARS_ANNOUNCE_UNDER = 200;

/* Deliberately permissive: one @, something either side, a dot in the domain, no whitespace.
   A stricter regex rejects real addresses, and the only test that actually settles whether an
   address exists is sending to it — which is what the form does. Same pattern server-side. */
const EMAIL_RE = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;

type FieldKey = "name" | "email" | "company" | "role" | "message";
type Errors = Partial<Record<FieldKey, string>>;

const FIELD_ORDER: readonly FieldKey[] = [
  "name",
  "email",
  "company",
  "role",
  "message",
];

/* Which group each field belongs to, so a field error can colour its step chip. Groups 02 and
   03 hold no text fields and can never be invalid — they are optional, and a pill cannot hold
   a bad value. */
const FIELD_GROUP: Record<FieldKey, number> = {
  name: 0,
  email: 0,
  company: 0,
  role: 0,
  message: 3,
};

/* Four states, one attribute. `active` is derived in JS rather than from a `focus-within`
   variant SO THAT PRECEDENCE IS EXPLICIT: invalid > complete > active > pending. Written as CSS
   variants those four would be four independent rules whose winner depends on the order
   Tailwind happens to emit them in, and the failure mode — a group that is BOTH focused and
   invalid showing the wrong one — is exactly the case that matters most. */
type StepState = "pending" | "active" | "complete" | "invalid";

/* ── shared control classes ───────────────────────────────────────────────────────────────
   The underline is `border-b-2` in BOTH states and only its colour changes. A 1px rule that
   thickens to 2px on focus moves the text inside a fixed-height box, which is visible as a
   jitter on every focus; holding the width and swapping colours costs nothing and reads
   stronger.

   ⚠️ VALIDITY OWNS THE UNDERLINE OUTRIGHT — an invalid field stays `alert` even while focused,
   rather than reverting to the focus colour. That is safe only because focus is signalled three
   OTHER ways at the same time: the caret, the label darkening to `ink`, and the step chip. It
   is also the point of the redesign: `focus` and `invalid` were the same `ink` underline
   before, and telling them apart is the whole reason `alert` exists. */
/* ⚠️ `placeholder:text-muted`, NOT `text-mark`, AND THAT WAS MEASURED. `mark` #8b8b8b is the
   logotype grey and is 3.41:1 on `paper` — it fails AA for normal text, and its own token
   comment says "NEVER for prose". A placeholder is text a sighted user reads to know what the
   field wants, so it is prose. `muted` #737373 is 4.74:1 and passes — ON WHITE. It would be
   4.24:1 and FAIL on the `bone` band outside this panel, which is why the panel is white; see
   ContactBody.tsx. Checked with `node docs/reference/contrast-check.js`. */
const FIELD_BASE =
  "h-11 w-full rounded-none border-0 border-b-2 bg-transparent px-0 font-sans text-[16px] " +
  "text-ink placeholder:text-muted transition-[border-color] duration-300 " +
  "[transition-timing-function:var(--ease-rogo)] focus:outline-none";

function fieldClass(invalid: boolean) {
  return `${FIELD_BASE} ${invalid ? "border-alert" : "border-hairline focus:border-signal"}`;
}

/* Every pill on this page. Geometry copied from the /news filter row (NewsBoard.tsx) rather
   than re-invented: 40px tall, 10x20 padding, 28px radius, active is ink-on-paper inverted, and
   the inactive border is the literal `rgba(24,24,24,0.1)` that row inlines — NOT the `hairline`
   token, which is a warm grey and visibly different beside it.

   ⚠️ SELECTED STAYS `bg-ink`, NOT `bg-signal`. Six accent-filled pills would be the accent
   doing decoration, which the restraint clause forbids; the inverted-ink pill is also the
   site's own selected state and is already proven on /news. `signal` appears on a pill in
   exactly one place: the focus ring. That ring was `ring-forest`, which was a stand-in chosen
   when this page had no accent at all.

   The hover LIFT is ours and is new — /news ships no hover because none was observable in its
   fetch, but a control that changes state on click needs to say it is a control. */
function pillClass(active: boolean) {
  return `flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[28px] px-5 py-[10px]
          transition-[background-color,border-color,color,transform] duration-300
          [transition-timing-function:var(--ease-rogo)]
          hover:-translate-y-0.5 focus-visible:-translate-y-0.5
          active:scale-[0.97] motion-reduce:active:scale-100
          motion-reduce:transition-none motion-reduce:hover:translate-y-0
          motion-reduce:focus-visible:translate-y-0
          focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2
          focus-visible:ring-offset-paper focus-visible:outline-none
          ${
            active
              ? "bg-ink text-paper"
              : "border border-[rgba(24,24,24,0.1)] bg-paper text-muted hover:border-ink hover:text-ink"
          }`;
}

/* ── the step chip ────────────────────────────────────────────────────────────────────────
   28x28, `rounded-[6px]` — the button and textarea radius, already this page's control radius.
   Replaces a 12px `text-mark` numeral that was 3.41:1 and did no visual work whatsoever.

   ⚠️ THE NUMERAL AND THE CHECK ARE BOTH ABSOLUTELY POSITIONED AND CROSSFADE. Swapping one for
   the other in the flow would resize the chip by a hair as a group completes, and the whole
   group head would shift with it — a layout jump triggered by typing, which is the worst
   possible moment for one. Stacking them makes completion a pure opacity change. */
const CHIP_STATE: Record<StepState, string> = {
  pending: "border-hairline text-muted",
  active:
    "border-signal text-signal bg-[color-mix(in_srgb,var(--color-signal)_8%,white)]",
  complete: "border-signal bg-signal text-paper",
  invalid:
    "border-alert text-alert bg-[color-mix(in_srgb,var(--color-alert)_8%,white)]",
};

function StepChip({ index, state }: { index: string; state: StepState }) {
  const complete = state === "complete";
  return (
    <span
      aria-hidden="true"
      className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border
                  transition-[background-color,border-color,color] duration-300
                  [transition-timing-function:var(--ease-rogo)] ${CHIP_STATE[state]}`}
    >
      <span
        className={`absolute font-mono text-[12px] tabular-nums transition-opacity duration-200
                    [transition-timing-function:var(--ease-rogo)]
                    ${complete ? "opacity-0" : "opacity-100"}`}
      >
        {index}
      </span>
      <CheckGlyph
        className={`absolute h-3.5 w-3.5 transition-opacity duration-200
                    [transition-timing-function:var(--ease-rogo)]
                    ${complete ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  );
}

/* ── one group: rule, chip, legend, state slot, controls ──────────────────────────────────
   `legendId` is the legend's id, so a `role="group"` / `role="radiogroup"` inside can name
   itself from the visible text instead of repeating it in an aria-label.

   ⚠️ THE FIRST GROUP DROPS ITS RULE. `first:border-t-0 first:pt-0` — the panel already has a
   2px progress bar across its top edge, and a hairline 40px below it read as a double line. */
function Group({
  index,
  legend,
  legendId,
  state,
  slot,
  onFocus,
  onBlur,
  children,
}: {
  index: string;
  legend: string;
  legendId?: string;
  state: StepState;
  slot?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      /* React's onFocus/onBlur map to focusin/focusout, which bubble — so these fire for any
         control inside the group and drive the `active` chip state. */
      onFocus={onFocus}
      onBlur={onBlur}
      data-state={state}
      className="flex w-full flex-col items-start gap-6 border-t border-hairline pt-8 first:border-t-0 first:pt-0"
    >
      <div className="flex w-full flex-row items-center gap-3">
        <StepChip index={index} state={state} />
        {/* 16px, not the 14 it was. The reason five identical blocks READ as five identical
            blocks is that a group head weighed exactly what a field label weighs. 16/medium/ink
            against 14/medium/muted is a real step in the hierarchy, and it costs nothing. */}
        <p
          id={legendId}
          className="font-sans text-[16px] font-medium text-ink"
          style={{ lineHeight: "1.3em", letterSpacing: "-0.02em" }}
        >
          {legend}
        </p>
        {slot ? (
          /* `ms-auto`, not `ml-auto`: this sits at the inline END of the row, which is the right
             edge in English and the left edge in Hebrew. */
          <span className="ms-auto flex shrink-0 items-center">{slot}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/* The count badge in a pill group's state slot. Mono is safe: digits and `/` are Latin in both
   locales. `aria-hidden` — an sr-only live region carries the same number in a full sentence,
   and a screen reader reading "3/6" out of a badge beside it would be duplicate noise. */
function CountBadge({ n, total }: { n: number; total: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-5 items-center rounded-[6px] bg-[color-mix(in_srgb,var(--color-signal)_10%,white)]
                 px-2 font-mono text-[12px] tabular-nums text-signal"
      style={{ lineHeight: "1em" }}
    >
      {n}/{total}
    </span>
  );
}

/* The small grey word in a state slot — "Optional", "Choose one". `muted` #737373 is 4.74:1 on
   the white panel and passes; it would fail on the `bone` band outside it. */
function SlotHint({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-sans text-[12px] text-muted"
      style={{ lineHeight: "1.3em", letterSpacing: "-0.02em" }}
    >
      {children}
    </span>
  );
}

export default function ContactForm() {
  const dict = usePageDict("contact");
  const t = dict.form;
  /* +1 in LTR, -1 in RTL. The radiogroup's arrow keys have to follow the VISUAL order, and in
     Hebrew ArrowRight moves to the previous pill. This is the primitive the repo already has
     for exactly this (src/lib/i18n/config.ts:66). */
  const sign = useDirSign();

  /* `useId` rather than hand-written ids: this component is mounted once today, but a
     duplicated id silently breaks every label and aria-describedby association, and that is
     not a failure mode worth leaving open to a future second mount. */
  const uid = useId();
  const id = (suffix: string) => `${uid}-${suffix}`;

  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    message: "",
  });
  const [needs, setNeeds] = useState<readonly NeedId[]>([]);
  const [budget, setBudget] = useState<BudgetId | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  /* One value rather than three booleans, so an impossible pair (sending AND sent) cannot be
     represented at all. */
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  /* Which group currently holds focus, or null. Drives the `active` chip state. */
  const [focusedStep, setFocusedStep] = useState<number | null>(null);

  /* The honeypot. A real browser never types into a field it cannot see; a bot that fills every
     input by name does. Not a captcha and not claimed to be one. */
  const [trap, setTrap] = useState("");

  const successRef = useRef<HTMLDivElement>(null);
  const budgetRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const setField = (key: FieldKey, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    /* Clear that field's error the moment it is touched. Re-validating on every keystroke would
       shout at someone halfway through typing an address. */
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      /* The summary banner is only true while at least one field error stands. Clearing the
         last one has to clear the banner too, or it contradicts the form beneath it. */
      if (Object.keys(next).length === 0) setFormError(null);
      return next;
    });
  };

  function validate(): Errors {
    const next: Errors = {};
    const name = values.name.trim();
    const email = values.email.trim();
    const message = values.message.trim();

    if (!name) next.name = t.errors.nameRequired;
    else if (name.length > LIMITS.nameMax) next.name = t.errors.nameTooLong;

    if (!email) next.email = t.errors.emailRequired;
    else if (email.length > LIMITS.emailMax || !EMAIL_RE.test(email))
      next.email = t.errors.emailInvalid;

    if (values.company.trim().length > LIMITS.shortMax)
      next.company = t.errors.tooLong;
    if (values.role.trim().length > LIMITS.shortMax) next.role = t.errors.tooLong;

    if (!message) next.message = t.errors.messageRequired;
    else if (message.length < LIMITS.messageMin)
      next.message = t.errors.messageTooShort;
    else if (message.length > LIMITS.messageMax)
      next.message = t.errors.messageTooLong;

    return next;
  }

  /* ── step completion ────────────────────────────────────────────────────────────────────
     ⚠️ DERIVED FROM `LIMITS` AND `EMAIL_RE`, NOT A SECOND SET OF RULES. `validate()` above is
     untouched and remains the only thing that decides whether the form may be submitted; this
     is a read of the same constants for display. If the two ever disagree, this is the one that
     is wrong. Company and Role are optional and are deliberately not part of step 01's test. */
  const steps: readonly boolean[] = [
    values.name.trim().length > 0 && EMAIL_RE.test(values.email.trim()),
    needs.length > 0,
    budget !== null,
    values.message.trim().length >= LIMITS.messageMin,
  ];
  const doneCount = steps.filter(Boolean).length;

  /* Precedence, stated once: invalid > complete > active > pending. */
  const stepState = (i: number): StepState => {
    const hasError = FIELD_ORDER.some((k) => errors[k] && FIELD_GROUP[k] === i);
    if (hasError) return "invalid";
    if (steps[i]) return "complete";
    if (focusedStep === i) return "active";
    return "pending";
  };

  /* `relatedTarget` is where focus is GOING. Without this check, tabbing between two fields in
     the same group fires blur-then-focus and the chip flickers out of `active` for a frame. */
  const groupBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setFocusedStep(null);
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    setFormError(null);
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      /* ⚠️ THE ALWAYS-MOUNTED ALERT REGION NOW SPEAKS ON THIS PATH TOO. It used to stay silent
         on client-side failure — the most common failure there is — so a screen reader user got
         a form that simply refused to submit with no spoken reason, and only the per-field
         messages, which are below and behind them. */
      setFormError(t.errors.summary);
      /* Move focus to the first bad field. Without this a keyboard user is left standing on the
         submit button with the errors above and behind them. */
      const first = FIELD_ORDER.find((k) => found[k]);
      if (first) {
        const el = document.getElementById(id(first));
        el?.focus();
        /* ⚠️ THE GLOBAL `scroll-behavior: auto !important` DOES NOT REACH THIS. That rule
           governs CSS-driven scrolling; a JS `behavior` option is a separate channel and wins.
           So reduced motion has to be read here explicitly, or this smooth-scrolls a visitor
           who asked the whole site not to. */
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        el?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "center",
        });
      }
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          needs,
          budget,
          /* The honeypot travels under an innocuous name. */
          website: trap,
          /* Which language the visitor filled the form in, for the notification email. Read off
             the document rather than `useLocale()` so it is the served page's own `lang`. */
          locale: document.documentElement.lang,
        }),
      });

      if (res.ok) {
        setStatus("sent");
        /* The form leaves the DOM on the next render, so focus has to be placed deliberately or
           it falls to <body> and the confirmation is never announced. The panel is also
           `role="status"`, which covers the case where focus lands elsewhere.
           ⚠️ UNCONDITIONAL — focus management is not motion and has no reduced-motion variant. */
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }

      const body = (await res.json().catch(() => null)) as {
        fields?: Partial<Record<FieldKey, string>>;
      } | null;

      setStatus("idle");
      if (res.status === 429) {
        setFormError(t.errors.rateLimited);
      } else if (res.status === 400 && body?.fields) {
        /* The server disagreed with the client's own pass — a bound drifted, or the request was
           tampered with. Its verdict wins, but its messages are English-only strings meant for
           a log, so the visitor sees this locale's message for the same rule. */
        const mapped: Errors = {};
        for (const key of Object.keys(body.fields) as FieldKey[]) {
          if (!FIELD_ORDER.includes(key)) continue;
          mapped[key] = key === "email" ? t.errors.emailInvalid : t.errors.tooLong;
        }
        setErrors(mapped);
        setFormError(t.errors.summary);
      } else {
        setFormError(t.errors.failed);
      }
    } catch {
      /* Offline, DNS, an aborted navigation. Indistinguishable from a 500 to the visitor, and
         the advice is the same either way: mail us directly. */
      setStatus("idle");
      setFormError(t.errors.failed);
    }
  }

  const messageInvalid = Boolean(errors.message);
  const messageLen = values.message.length;
  const messageRemaining = LIMITS.messageMax - messageLen;

  /* ── the brief-rail ─────────────────────────────────────────────────────────────────────
     /company Block 3's sticky heading column, in behaviour and in structure.

     ⚠️ TWO BOXES, NOT ONE, AND THE OUTER ONE IS WHY THE PIN WORKS: it is the flex item and it
     STRETCHES to the row height, which is the travel the sticky child moves within. An
     `items-start` or `self-start` anywhere on the row container collapses it to content height
     and the heading never pins at all. Both are absent from ROOT below and must stay absent.

     ⚠️ THE STICKY OFFSET CLEARS THE HEADER AT ITS TALLEST, NOT ITS SHORTEST. The nav's banner
     eases out on the way down and back IN on the way up, so the fixed header is 70px scrolling
     down and 115px the instant you scroll up. This page previously used `top-[198px]`, which was
     the HERO's padding borrowed — it clears the banner, but parks the rail 67px lower than it
     needs to. `--nav-peak-h` is derived in globals.css; +16 is the gutter step. Set inline and
     ungated on purpose: below 1200 the element is `static`, so `top` is inert there. */
  const rail = (
    <div className="w-full desktop:w-[380px] desktop:shrink-0">
      <div
        className="contact-rise flex w-full flex-col items-start gap-4 desktop:sticky"
        style={{ top: "calc(var(--nav-peak-h) + 16px)" }}
      >
        <h2
          className="w-full font-display text-[32px] font-normal text-ink tablet:text-[40px] desktop:text-[44px]"
          style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
        >
          {dict.panel.title}
        </h2>
        {/* ⚠️ `ink-soft`, NOT `muted`, AND THIS IS THE MEASURED ONE. This paragraph sits on the
            `bone` band, where `muted` #737373 is 4.24:1 and FAILS AA. `ink-soft` #383838 is
            10.49:1. Every `muted` on this page is inside the white panel for this reason; see
            ContactBody.tsx's header. Do not "unify" this back. */}
        <p
          className="w-full font-sans text-[16px] font-normal text-ink-soft desktop:text-[18px]"
          style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
        >
          {dict.panel.intro}
        </p>

        {/* The live step list. `hidden desktop:flex` — below 1200 the rail's heading stacks
            above the panel and a horizontal step strip under it would be clutter, while the
            panel's own chips and progress bar already carry completion at every width.
            `aria-hidden`: it duplicates the four legends inside the form, which are real
            headings with real controls under them; announcing them twice helps nobody. */}
        <ol
          aria-hidden="true"
          className="mt-4 hidden w-full list-none flex-col p-0 desktop:flex"
        >
          {[t.groups.about, t.groups.needs, t.groups.budget, t.groups.brief].map(
            (legend, i) => {
              const state = stepState(i);
              return (
                <li
                  key={legend}
                  /* `border-s-2`, not `border-l-2`: the marker sits at the inline START, which
                     is the left edge in English and the right edge in Hebrew. */
                  className={`contact-rise flex flex-row items-center gap-3 border-s-2 py-2 ps-4
                              transition-[border-color,color] duration-300
                              [transition-timing-function:var(--ease-rogo)]
                              ${
                                state === "invalid"
                                  ? "border-alert text-alert"
                                  : state === "complete" || state === "active"
                                    ? "border-signal text-ink"
                                    : "border-hairline text-ink-soft"
                              }`}
                  style={{ animationDelay: `${250 + i * 60}ms` }}
                >
                  <StepChip index={String(i + 1).padStart(2, "0")} state={state} />
                  <span
                    className="font-sans text-[14px] font-medium"
                    style={{ lineHeight: "1.3em", letterSpacing: "-0.02em" }}
                  >
                    {legend}
                  </span>
                </li>
              );
            },
          )}
        </ol>

        {/* ⚠️ THE REPLY PROMISE MOVED FORWARD. This is the same sentence `successBody` makes,
            and until today it was ONLY visible after a successful send — i.e. the single most
            reassuring line on the page was shown exclusively to people who had already been
            reassured enough to submit. It appears here and again beside the button. */}
        <p
          className="mt-2 font-sans text-[14px] text-ink-soft"
          style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
        >
          {dict.panel.reply}
        </p>
      </div>
    </div>
  );

  /* The panel shell, shared by the form and by the success state so the two cannot drift.

     ⚠️ `w-full` IS UNGATED; `flex-1` AND `min-w-0` ARE `desktop:`-GATED. This replaces the
     `w-px flex-[1_0_0]` idiom that shipped a bug on 2026-08-13: a 1px flex basis is only
     meaningful in a ROW container, and below 1200 this is a COLUMN child — so the 1px was the
     cross-axis size, nothing stretched it, and the form rendered ONE PIXEL WIDE on every phone
     and tablet. The idiom is now RETIRED rather than re-gated, because its only purpose was to
     let a `max-w-[720px]` cap decide the column, and there is no cap any more: the panel is
     simply the space left over, which is ~820px at 1280 and closes the ~196px dead gutter the
     old fixed pair left. `min-w-0` because a flex item's default `min-width: auto` would let a
     long unbroken string inside set the column's floor. */
  const PANEL =
    "relative w-full border border-hairline bg-paper shadow-float " +
    "p-4 tablet:p-8 desktop:min-w-0 desktop:flex-1 desktop:p-10";

  /* No `items-start` and no `self-start` — see the rail's note. */
  const ROOT = "flex w-full flex-col gap-12 desktop:flex-row desktop:gap-20";

  /* ── the success panel ──────────────────────────────────────────────────────────────────
     Replaces the FORM rather than the whole component: leaving a filled-in form on screen after
     a successful send invites a second identical submission, but the rail is a sibling and
     stays, with all four steps showing complete. The hero's channel grid is a different
     component entirely and never unmounts, so the direct email and WhatsApp are still one
     glance away — and they are repeated here as well, because this is the moment someone
     decides whether to also reach out another way. */
  if (status === "sent") {
    return (
      <div className={ROOT}>
        {rail}
        <div className={PANEL}>
          <span
            aria-hidden="true"
            className="contact-progress absolute inset-x-0 top-0 h-0.5 bg-signal"
          />
          <div
            ref={successRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="flex w-full flex-col items-start gap-4 focus:outline-none"
          >
            <span className="contact-rise flex h-12 w-12 items-center justify-center rounded-[6px] bg-signal">
              <CheckGlyph className="contact-draw h-6 w-6 text-paper" />
            </span>
            <p
              className="contact-rise font-sans text-[14px] font-medium text-muted"
              style={{
                lineHeight: "1.3em",
                letterSpacing: "-0.02em",
                animationDelay: "70ms",
              }}
            >
              {t.successEyebrow}
            </p>
            <h2
              className="contact-rise font-display text-[32px] text-ink"
              style={{
                lineHeight: "1.1em",
                letterSpacing: "-0.05em",
                animationDelay: "140ms",
              }}
            >
              {t.successTitle}
            </h2>
            <p
              className="contact-rise max-w-[var(--measure)] font-sans text-[16px] text-muted"
              style={{
                lineHeight: "1.5em",
                letterSpacing: "-0.02em",
                animationDelay: "210ms",
              }}
            >
              {t.successBody}
            </p>

            {/* Zero new dictionary keys: the two labels are the channel grid's own, and the
                values come from src/lib/contact.ts as they do everywhere else. That file exports
                plain string constants with no `server-only` guard, so it is safe here. */}
            <div
              className="contact-rise mt-2 flex w-full flex-col gap-3 border-t border-hairline pt-6 tablet:flex-row tablet:gap-8"
              style={{ animationDelay: "280ms" }}
            >
              {[
                {
                  label: dict.aside.emailLabel,
                  value: CONTACT_EMAIL,
                  href: CONTACT.email,
                  external: false,
                },
                {
                  label: dict.aside.whatsappLabel,
                  value: CONTACT_PHONE,
                  href: CONTACT.whatsapp,
                  external: true,
                },
              ].map((row) => (
                <div key={row.label} className="flex flex-col items-start gap-1">
                  <p
                    className="font-sans text-[12px] font-medium text-muted"
                    style={{ lineHeight: "1.3em", letterSpacing: "-0.02em" }}
                  >
                    {row.label}
                  </p>
                  <AppLink
                    href={row.href}
                    external={row.external}
                    className="font-mono text-[15px] text-ink no-underline transition-[color] duration-300
                               hover:text-muted focus-visible:rounded-[2px] focus-visible:ring-2
                               focus-visible:ring-signal focus-visible:ring-offset-2
                               focus-visible:ring-offset-paper focus-visible:outline-none"
                    style={{
                      lineHeight: "1.5em",
                      letterSpacing: "-0.02em",
                      transitionTimingFunction: "var(--ease-rogo)",
                    }}
                  >
                    {row.value}
                  </AppLink>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* One text field: label, control, error. `type` is only ever "text" or "email" — `email` gets
     the right mobile keyboard, which is the whole reason to distinguish them.

     ⚠️ NOT A NESTED COMPONENT. It is a render helper called as a function, `textField(...)`,
     not `<Field ... />`. A component declared inside another component gets a fresh identity on
     every parent render, so React unmounts and remounts its subtree — which would blur the
     input on the first keystroke of every field on this form. That is the whole bug, and it is
     why this reads slightly awkwardly. Do not "clean it up" into JSX. This file grew by ~40% in
     the 2026-08-17 redesign, which is exactly the kind of pass during which someone tidies an
     awkward-looking helper; the fast test is to type two characters into Full name. */
  const textField = ({
    name,
    label,
    placeholder,
    required,
    type = "text",
    autoComplete,
  }: {
    name: FieldKey;
    label: string;
    placeholder: string;
    required?: boolean;
    type?: "text" | "email";
    autoComplete?: string;
  }) => {
    const invalid = Boolean(errors[name]);
    return (
      <div className="group/field flex w-full flex-col items-start gap-2">
        <label
          htmlFor={id(name)}
          /* Darkens to `ink` while the field has focus. One of the three non-underline signals
             that let validity own the underline colour outright — see the note on FIELD_BASE. */
          className="font-sans text-[14px] font-medium text-muted transition-colors duration-300
                     [transition-timing-function:var(--ease-rogo)] group-focus-within/field:text-ink"
          style={{ lineHeight: "1.3em", letterSpacing: "-0.02em" }}
        >
          {label}
          {required ? (
            /* The asterisk is decorative — `required` on the input is what assistive tech
               reads, and the visually-hidden word covers readers that announce neither. */
            <>
              <span aria-hidden="true"> *</span>
              <span className="sr-only"> ({t.a11y.required})</span>
            </>
          ) : null}
        </label>
        <input
          id={id(name)}
          name={name}
          type={type}
          value={values[name]}
          onChange={(e) => setField(name, e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? id(`${name}-error`) : undefined}
          className={fieldClass(invalid)}
          style={{ letterSpacing: "-0.02em" }}
        />
        {invalid ? (
          <p
            id={id(`${name}-error`)}
            className="contact-rise-fast flex flex-row items-start gap-1.5 font-sans text-[12px] text-alert"
            style={{ lineHeight: "1.4em", letterSpacing: "-0.02em" }}
          >
            <AlertGlyph className="mt-px h-3 w-3 shrink-0" />
            {errors[name]}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <div className={ROOT}>
      {rail}

      <form
        onSubmit={onSubmit}
        noValidate
        className={`${PANEL} contact-rise flex flex-col items-start gap-8`}
        style={{ animationDelay: "100ms" }}
      >
        {/* The completion bar — the one progress signal that survives at 390px, where the rail's
            step list is hidden. `aria-hidden`: the four groups already announce themselves, and
            a percentage read aloud on every keystroke would be noise. `.contact-progress` sets
            the transform-origin and flips it under RTL; `transform-origin` has no logical
            keyword, so the class is the only way to get this right in both directions. */}
        <span
          aria-hidden="true"
          className="contact-progress absolute inset-x-0 top-0 h-0.5 bg-signal transition-transform duration-300
                     [transition-timing-function:var(--ease-rogo)]"
          style={{ transform: `scaleX(${doneCount / steps.length})` }}
        />

        {/* ── 01 · about you ── */}
        <Group
          index="01"
          legend={t.groups.about}
          legendId={id("about")}
          state={stepState(0)}
          onFocus={() => setFocusedStep(0)}
          onBlur={groupBlur}
        >
          <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 tablet:grid-cols-2">
            {textField({
              name: "name",
              label: t.nameLabel,
              placeholder: t.namePlaceholder,
              required: true,
              autoComplete: "name",
            })}
            {textField({
              name: "email",
              label: t.emailLabel,
              placeholder: t.emailPlaceholder,
              required: true,
              type: "email",
              autoComplete: "email",
            })}
            {textField({
              name: "company",
              label: t.companyLabel,
              placeholder: t.companyPlaceholder,
              autoComplete: "organization",
            })}
            {textField({
              name: "role",
              label: t.roleLabel,
              placeholder: t.rolePlaceholder,
              autoComplete: "organization-title",
            })}
          </div>
        </Group>

        {/* ── 02 · what is relevant · multi-select, `aria-pressed` ── */}
        <Group
          index="02"
          legend={t.groups.needs}
          legendId={id("needs")}
          state={stepState(1)}
          onFocus={() => setFocusedStep(1)}
          onBlur={groupBlur}
          slot={
            needs.length > 0 ? (
              <CountBadge n={needs.length} total={NEED_ORDER.length} />
            ) : (
              <SlotHint>{t.optional}</SlotHint>
            )
          }
        >
          <div
            role="group"
            aria-labelledby={id("needs")}
            aria-describedby={id("needs-hint")}
            className="flex w-full flex-wrap items-center gap-[10px]"
          >
            {NEED_ORDER.map((need) => {
              const active = needs.includes(need);
              return (
                <button
                  key={need}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setNeeds((prev) =>
                      prev.includes(need)
                        ? prev.filter((n) => n !== need)
                        : [...prev, need],
                    )
                  }
                  className={pillClass(active)}
                >
                  {/* ⚠️ THE CHECK IS WHAT TELLS THE TWO PILL GROUPS APART. Group 02 is
                      multi-select and group 03 is single-select, and until today they were
                      pixel-identical — so someone who had just picked three needs would try the
                      same on budget and watch their first choice silently clear. A check inside
                      an active pill is the shape that says "toggle"; the budget group says
                      "Choose one" in its state slot instead. `aria-pressed` already carries this
                      for assistive tech, which is why the glyph is decorative. */}
                  {active ? <CheckGlyph className="h-3.5 w-3.5 shrink-0" /> : null}
                  {/* `whitespace-pre` cannot wrap, so a label has to fit its pill outright. Every
                      Hebrew label here is shorter than its English counterpart, so the row only
                      narrows — the same argument NewsBoard's filter row makes. */}
                  <span
                    className="font-sans text-[16px] whitespace-pre"
                    style={{ letterSpacing: "-0.01em", lineHeight: "130%" }}
                  >
                    {t.needs[need]}
                  </span>
                </button>
              );
            })}
          </div>
          <p id={id("needs-hint")} className="sr-only">
            {t.a11y.needsHint}
          </p>
          {/* A pill press is a discrete user action, so announcing the resulting count is
              expected rather than chatty. The visible badge is `aria-hidden` so this is the only
              thing that speaks. */}
          <p role="status" aria-live="polite" className="sr-only">
            {needs.length > 0
              ? interpolate(t.a11y.needsCount, {
                  n: needs.length,
                  total: NEED_ORDER.length,
                })
              : ""}
          </p>
        </Group>

        {/* ── 03 · budget · single-select, a real radiogroup ── */}
        <Group
          index="03"
          legend={t.groups.budget}
          legendId={id("budget")}
          state={stepState(2)}
          onFocus={() => setFocusedStep(2)}
          onBlur={groupBlur}
          /* The "choose one" rule was `sr-only` until today, so a sighted visitor had to infer
             the interaction model by trying it. It stays sr-only AS WELL — that copy is wired
             through `aria-describedby`, which visible text beside a legend is not. */
          slot={
            budget === null ? (
              <SlotHint>{t.a11y.budgetHint}</SlotHint>
            ) : (
              <CountBadge n={1} total={BUDGET_ORDER.length} />
            )
          }
        >
          <div
            role="radiogroup"
            aria-labelledby={id("budget")}
            aria-describedby={id("budget-hint")}
            className="flex w-full flex-wrap items-center gap-[10px]"
          >
            {BUDGET_ORDER.map((band, i) => {
              const active = budget === band;
              return (
                <button
                  key={band}
                  ref={(el) => {
                    budgetRefs.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  /* ROVING TABINDEX. A radiogroup is ONE tab stop: Tab reaches the checked option
                     (or the first, while nothing is checked) and the arrow keys move within.
                     Leaving all four tabbable would make a keyboard user press Tab four times to
                     cross a single question. */
                  tabIndex={active || (budget === null && i === 0) ? 0 : -1}
                  onClick={() => setBudget(band)}
                  onKeyDown={(e) => {
                    const step =
                      e.key === "ArrowRight" || e.key === "ArrowDown"
                        ? 1
                        : e.key === "ArrowLeft" || e.key === "ArrowUp"
                          ? -1
                          : 0;
                    if (step === 0) return;
                    e.preventDefault();
                    /* Vertical arrows are direction-agnostic; horizontal ones are not. `sign` is
                       -1 in Hebrew, so ArrowRight walks backwards through the array, which is
                       forwards on screen. */
                    const horizontal =
                      e.key === "ArrowRight" || e.key === "ArrowLeft";
                    const delta = horizontal ? step * sign : step;
                    const next =
                      (i + delta + BUDGET_ORDER.length) % BUDGET_ORDER.length;
                    /* In a radiogroup, arrowing SELECTS as well as focuses — that is the
                       pattern's contract, not a shortcut. */
                    setBudget(BUDGET_ORDER[next]);
                    budgetRefs.current[next]?.focus();
                  }}
                  className={pillClass(active)}
                >
                  <span
                    className="font-sans text-[16px] whitespace-pre"
                    style={{ letterSpacing: "-0.01em", lineHeight: "130%" }}
                  >
                    {t.budget[band]}
                  </span>
                </button>
              );
            })}
          </div>
          <p id={id("budget-hint")} className="sr-only">
            {t.a11y.budgetHint}
          </p>
          {/* ⚠️ NO LIVE REGION HERE, DELIBERATELY. A `role="radiogroup"` already announces the
              newly checked radio on selection; a second announcement saying "1 of 4 selected"
              would be duplicate noise, and the count itself is meaningless for a single-select. */}
        </Group>

        {/* ── 04 · the brief ── */}
        <Group
          index="04"
          legend={t.groups.brief}
          legendId={id("brief")}
          state={stepState(3)}
          onFocus={() => setFocusedStep(3)}
          onBlur={groupBlur}
        >
          {/* The one BOXED control on the page. A bare underline cannot contain rows of text —
              the rule would float unattached below the paragraph — so this borrows the shape of
              /product's hero prompt field: a 1px hairline and a 6px radius, which is the button
              radius and therefore already in the system. `resize-none` matches the reference,
              which also fixes its textarea. The visible legend is the group's, so the label here
              is `sr-only` rather than a second heading.

              ⚠️ 120px AND `rows={4}`, DOWN FROM 160 AND 6. The box was the tallest control on the
              page and it asks for the LEAST text: `messagePlaceholder` says "two honest sentences
              is plenty" and `messageMin` is ten characters. A tall box contradicts its own copy
              and inflates the form's perceived cost for no gain. It still scrolls. */}
          <div className="flex w-full flex-col items-start gap-2">
            <label htmlFor={id("message")} className="sr-only">
              {t.groups.brief}
            </label>
            <textarea
              id={id("message")}
              name="message"
              rows={4}
              value={values.message}
              onChange={(e) => setField("message", e.target.value)}
              placeholder={t.messagePlaceholder}
              required
              maxLength={LIMITS.messageMax}
              aria-invalid={messageInvalid || undefined}
              aria-describedby={`${messageInvalid ? `${id("message-error")} ` : ""}${id("message-chars")}`}
              className={`min-h-[120px] w-full resize-none rounded-[6px] border bg-transparent p-4
                          font-sans text-[16px] text-ink placeholder:text-muted
                          transition-[border-color] duration-300
                          [transition-timing-function:var(--ease-rogo)] focus:outline-none
                          ${messageInvalid ? "border-alert" : "border-hairline focus:border-signal"}`}
              style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
            />

            {/* Error at the inline start, counter at the inline end. `justify-between` on a flex
                row is direction-agnostic, so this needs no RTL companion. */}
            <div className="flex w-full flex-row items-start justify-between gap-4">
              {messageInvalid ? (
                <p
                  id={id("message-error")}
                  className="contact-rise-fast flex flex-row items-start gap-1.5 font-sans text-[12px] text-alert"
                  style={{ lineHeight: "1.4em", letterSpacing: "-0.02em" }}
                >
                  <AlertGlyph className="mt-px h-3 w-3 shrink-0" />
                  {errors.message}
                </p>
              ) : (
                <span />
              )}
              {/* ⚠️ `aria-hidden` — the live region below carries this in a sentence, and a
                  screen reader reciting "120 / 4000" on every keystroke is unusable. The colour
                  doubles as the "this is now long enough" affordance: `muted` under the minimum,
                  `signal` once the field would pass validation, `alert` near the ceiling. */}
              <span
                aria-hidden="true"
                className={`shrink-0 font-mono text-[12px] tabular-nums transition-colors duration-300
                            [transition-timing-function:var(--ease-rogo)]
                            ${
                              messageLen >= MESSAGE_WARN_AT
                                ? "text-alert"
                                : messageLen >= LIMITS.messageMin
                                  ? "text-signal"
                                  : "text-muted"
                            }`}
                style={{ lineHeight: "1.4em" }}
              >
                {messageLen} / {LIMITS.messageMax}
              </span>
            </div>

            {/* ⚠️ SILENT UNTIL THE TAIL, AND BUCKETED WHEN IT SPEAKS. Empty above 200 characters
                remaining; below that it reports the remainder rounded UP to the nearest 50, so
                the whole tail costs at most four announcements instead of one per keystroke. */}
            <p
              id={id("message-chars")}
              role="status"
              aria-live="polite"
              className="sr-only"
            >
              {messageRemaining <= CHARS_ANNOUNCE_UNDER
                ? interpolate(t.a11y.charsLeft, {
                    n: Math.ceil(messageRemaining / 50) * 50,
                  })
                : ""}
            </p>
          </div>
        </Group>

        {/* The honeypot. `sr-only` rather than `display:none`: a bot that skips hidden inputs is
            exactly the bot worth catching, and `aria-hidden` plus `tabIndex={-1}` keep it away
            from both screen readers and the tab order. `autoComplete="off"` stops a browser
            helpfully filling it in and locking a real visitor out of their own form. */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor={id("website")}>{t.a11y.honeypot}</label>
          <input
            id={id("website")}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
          />
        </div>

        {/* Consent, then the whole-form status, then the button — the order a submitting reader
            meets them in.

            ⚠️ NO STEP CHIP AND NO NUMERAL HERE. This block used to be styled exactly like the
            four groups above it, so it read as a fifth step that could never be completed. It is
            the panel's footer. */}
        <div className="flex w-full flex-col items-start gap-6 border-t border-hairline pt-8">
          <p
            className="max-w-[var(--measure)] font-sans text-[12px] text-muted"
            style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
          >
            {t.consent}
          </p>

          {/* `role="alert"`, not `role="status"`: this is the failure path and it should interrupt.
              ⚠️ THE NODE IS ALWAYS RENDERED so the live region exists in the DOM before it has
              anything to say — a region inserted at the same moment as its text is not reliably
              announced. The styled banner renders INSIDE it; do not collapse the two into one
              conditional element. */}
          <div role="alert" aria-live="assertive" className="w-full">
            {formError ? (
              <div
                className="contact-rise-fast flex w-full flex-row items-start gap-3 rounded-[6px]
                           border border-[color-mix(in_srgb,var(--color-alert)_30%,transparent)]
                           bg-[color-mix(in_srgb,var(--color-alert)_8%,white)] p-4"
              >
                <AlertGlyph className="mt-0.5 h-4 w-4 shrink-0 text-alert" />
                <p
                  className="font-sans text-[14px] text-alert"
                  style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
                >
                  {formError}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex w-full flex-col items-start gap-4 tablet:flex-row tablet:items-center tablet:gap-6">
            {/* ⚠️ `w-auto min-w-[220px]` FROM 810 UP, REPLACING `tablet:w-min`. The old value
                shrank the site's terminal CTA to its label — the smallest element in a ~1400px
                column, and the one thing on the page every other route exists to deliver someone
                to. `bg-ink` is unchanged and is deliberate: `ink` is this site's primary button
                on a light ground, and an accent-filled submit would be the accent doing
                decoration rather than state.

                Hover is a LIFT rather than `opacity-90` — dimming a black button is the weakest
                hover on the site. NO TRAILING ARROW: it would need `rtl:-scale-x-100` mirroring
                and buys nothing here, so leaving it out removes a whole class of RTL bug. */}
            <button
              type="submit"
              disabled={status === "sending"}
              aria-busy={status === "sending"}
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-2
                         overflow-hidden rounded-[6px] border border-transparent bg-ink px-8 py-2
                         transition-[transform,box-shadow,opacity] duration-300
                         [transition-timing-function:var(--ease-rogo)]
                         hover:-translate-y-0.5 hover:shadow-float active:translate-y-0
                         disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0
                         disabled:hover:shadow-none
                         motion-reduce:transition-none motion-reduce:hover:translate-y-0
                         focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2
                         focus-visible:ring-offset-paper focus-visible:outline-none
                         tablet:w-auto tablet:min-w-[220px]"
            >
              <span className="flex h-5 items-center justify-center gap-[10px] pt-px">
                <span
                  className="font-sans text-[16px] font-medium whitespace-pre text-paper"
                  style={{ lineHeight: "1em", letterSpacing: "-0.01em" }}
                >
                  {status === "sending" ? t.submitting : t.submit}
                </span>
                {/* Three dots, staggered. The base keyframe is 0.55 opacity on all three, so
                    under the reduced-motion clamp — which forces one iteration at ~0ms — the
                    frozen state is an evenly-lit indicator rather than one lit dot and two
                    blanks. See globals.css. */}
                {status === "sending" ? (
                  <span aria-hidden="true" className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="contact-dot h-1 w-1 rounded-full bg-paper opacity-[0.55]"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </span>
                ) : null}
              </span>
            </button>

            {/* The reply promise again, where the decision is actually made. */}
            <p
              className="font-sans text-[14px] text-muted"
              style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
            >
              {dict.panel.reply}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
