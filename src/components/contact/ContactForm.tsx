"use client";

/**
 * ContactForm — the form on /contact, and the only real form on this site.
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
 * gradient pill button. This design system has `--radius-none: 0px` as its default, no
 * shadows, no gradients and no blue — so the form is rebuilt in the site's own vocabulary and
 * introduces ZERO new tokens. Requested explicitly by the user on 2026-08-13 ("our own design,
 * also our own layout").
 *
 * THE LAYOUT: four hairline-ruled groups, each numbered, controls full width beneath the
 * legend. Not a card. Rules rather than boxes is what the rest of this site does with a list of
 * things (Footer's divider, /product's row rules), and stacking the legend above the controls
 * rather than beside them keeps the inputs wide — the page already spends 300px on the aside
 * at desktop.
 *
 * ⚠️ MONO IS ON THE NUMERALS ONLY. `--font-mono` (Fragment Mono) has no Hebrew coverage — its
 * @font-face unicode-ranges in src/app/fonts.css are Latin, Greek and Cyrillic, not
 * U+0590–05FF — so anything Hebrew set in it falls back to the OS monospace mid-line. `01`
 * through `04` are Latin digits in both locales, so they are safe and they are the whole of
 * mono's use here. Legends, labels and errors are `font-sans`. Same note in ContactAside.tsx.
 *
 * ⚠️ ERRORS ARE MONOCHROME, DELIBERATELY. There is no red in this design system; the only two
 * semantic colours it ever had (`quote-up` / `quote-down`) were deleted on 2026-08-08 for
 * being dead tokens that "invite a decorative use they were never measured for". So an invalid
 * field states itself three ways, none of which is colour: its underline goes from `hairline`
 * (a 20% warm grey) to full `ink`, a message appears beneath it, and it carries `aria-invalid`
 * plus `aria-describedby`. WCAG 1.4.1 is satisfied by the message, not by the rule — the rule
 * is the fast visual scan.
 *
 * ⚠️ VALIDATION IS DUPLICATED, AND MUST BE. The same rules live here and in
 * src/app/api/contact/route.ts. The client copy exists so a typo does not cost a round trip;
 * the server copy exists because the client copy is unenforceable. If a bound changes, change
 * both — the API is the one that counts.
 *
 * ⚠️ THE OPTION IDS ARE THE WIRE FORMAT. `NEED_ORDER` / `BUDGET_ORDER` below are display order;
 * the ids inside them are what gets POSTed and what the API's allow-list checks, so the email
 * reads identically whichever language filled the form in. Labels are looked up by id, never by
 * index — an inserted option would otherwise silently re-pair every label after it.
 */

import { useId, useRef, useState } from "react";
import { usePageDict, useDirSign } from "@/lib/i18n/LocaleProvider";
import type { BudgetId, NeedId } from "@/lib/i18n/en/contact";

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

/* ── shared control classes ───────────────────────────────────────────────────────────────
   The underline is `border-b-2` in BOTH states and only its colour changes. A 1px rule that
   thickens to 2px on focus moves the text inside a fixed-height box, which is visible as a
   jitter on every focus; holding the width and swapping `hairline` for `ink` costs nothing and
   reads stronger. */
/* ⚠️ `placeholder:text-muted`, NOT `text-mark`, AND THAT WAS MEASURED. `mark` #8b8b8b is the
   logotype grey and is 3.41:1 on `paper` — it fails AA for normal text, and its own token
   comment says "NEVER for prose". A placeholder is text a sighted user reads to know what the
   field wants, so it is prose. `muted` #737373 is 4.74:1 and passes. Checked with
   `node docs/reference/contrast-check.js --check "#8b8b8b" "#ffffff"`. */
const FIELD_BASE =
  "h-11 w-full rounded-none border-0 border-b-2 bg-transparent px-0 font-sans text-[16px] " +
  "text-ink placeholder:text-muted transition-[border-color] duration-300 focus:outline-none";

function fieldClass(invalid: boolean) {
  return `${FIELD_BASE} ${invalid ? "border-ink" : "border-hairline focus:border-ink"}`;
}

/* Every pill on this page. Copied from the /news filter row (NewsBoard.tsx) rather than
   re-invented: 40px tall, 10x20 padding, 28px radius, active is ink-on-paper inverted, and the
   inactive border is the literal `rgba(24,24,24,0.1)` that row inlines — NOT the `hairline`
   token, which is a warm grey and visibly different beside it. The hover is ours; /news ships
   none because none was observable in its fetch, but a control that changes state on click
   needs to say it is a control. */
function pillClass(active: boolean) {
  return `flex h-10 cursor-pointer items-center justify-center rounded-[28px] px-5 py-[10px]
          transition-colors duration-300
          focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2
          focus-visible:ring-offset-paper focus-visible:outline-none
          ${
            active
              ? "bg-ink text-paper"
              : "border border-[rgba(24,24,24,0.1)] bg-paper text-muted hover:border-ink hover:text-ink"
          }`;
}

/* ── one group: rule, numeral, legend, controls ───────────────────────────────────────────
   `legendId` is the legend's id, so a `role="group"` / `role="radiogroup"` inside can name
   itself from the visible text instead of repeating it in an aria-label. */
function Group({
  index,
  legend,
  legendId,
  optional,
  children,
}: {
  index: string;
  legend: string;
  legendId?: string;
  optional?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-6 border-t border-hairline pt-8">
      <div className="flex w-full flex-row items-baseline gap-3">
        {/* Latin digits — the one safe use of mono on this page.
            ⚠️ THE ONLY `text-mark` LEFT ON THIS PAGE, and it is the only element that qualifies.
            `mark` #8b8b8b is 3.41:1 on `paper`, which fails AA for normal text; its token
            comment in globals.css says "NEVER for prose". This is not prose: it is
            `aria-hidden`, it names nothing, and it restates the visual order of four groups the
            reader can already see. Nothing is lost if it is never read — which is precisely the
            test the /clix logo grid applies to the same token. Every other small grey on this
            page (placeholders, the "Optional" badge) is `muted` #737373 at 4.74:1 because those
            DO carry information. */}
        <span className="font-mono text-[12px] text-mark" aria-hidden="true">
          {index}
        </span>
        <p
          id={legendId}
          className="font-sans text-[14px] font-medium text-ink"
          style={{ lineHeight: "1.3em", letterSpacing: "-0.02em" }}
        >
          {legend}
        </p>
        {optional ? (
          /* `ms-auto`, not `ml-auto`: this badge sits at the inline END of the row, which is
             the right edge in English and the left edge in Hebrew. */
          <span
            /* `muted`, not `mark`: this word tells a visitor they may skip the group, which is
               information, and `mark` fails AA on paper (3.41:1). Same call as the
               placeholders. */
            className="ms-auto font-sans text-[12px] text-muted"
            style={{ lineHeight: "1.3em", letterSpacing: "-0.02em" }}
          >
            {optional}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default function ContactForm() {
  const t = usePageDict("contact").form;
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    setFormError(null);
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      /* Move focus to the first bad field. Without this a keyboard user is left standing on the
         submit button with the errors above and behind them. */
      const first = FIELD_ORDER.find((k) => found[k]);
      if (first) document.getElementById(id(first))?.focus();
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
           `role="status"`, which covers the case where focus lands elsewhere. */
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

  /* ── the success panel ──────────────────────────────────────────────────────────────────
     Replaces the form rather than sitting above it: leaving a filled-in form on screen after a
     successful send invites a second identical submission. The aside is a sibling and stays
     put, so the direct email and WhatsApp are still one glance away. */
  if (status === "sent") {
    return (
      <div className="w-px flex-[1_0_0] desktop:max-w-[720px]">
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="flex w-full flex-col items-start gap-4 border-t border-hairline pt-8 focus:outline-none"
        >
          <p
            className="font-sans text-[14px] font-medium text-muted"
            style={{ lineHeight: "1.3em", letterSpacing: "-0.02em" }}
          >
            {t.successEyebrow}
          </p>
          <h2
            className="font-display text-[32px] text-ink"
            style={{ lineHeight: "1.1em", letterSpacing: "-0.05em" }}
          >
            {t.successTitle}
          </h2>
          <p
            className="max-w-[var(--measure)] font-sans text-[16px] text-muted"
            style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
          >
            {t.successBody}
          </p>
        </div>
      </div>
    );
  }

  const messageInvalid = Boolean(errors.message);

  /* One text field: label, control, error. `type` is only ever "text" or "email" — `email` gets
     the right mobile keyboard, which is the whole reason to distinguish them.

     ⚠️ NOT A NESTED COMPONENT. It is a render helper called as a function, `textField(...)`,
     not `<Field ... />`. A component declared inside another component gets a fresh identity on
     every parent render, so React unmounts and remounts its subtree — which would blur the
     input on the first keystroke of every field on this form. That is the whole bug, and it is
     why this reads slightly awkwardly. Do not "clean it up" into JSX. */
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
      <div className="flex w-full flex-col items-start gap-2">
        <label
          htmlFor={id(name)}
          className="font-sans text-[14px] font-medium text-muted"
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
            className="font-sans text-[12px] text-ink"
            style={{ lineHeight: "1.4em", letterSpacing: "-0.02em" }}
          >
            {errors[name]}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    /* `w-px flex-[1_0_0]` is Framer's own idiom, reproduced across this repo: the 1px basis
       makes the max-width cap decide the column, not the content. */
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex w-px flex-[1_0_0] flex-col items-start gap-8 desktop:max-w-[720px]"
    >
      {/* ── 01 · about you ── */}
      <Group index="01" legend={t.groups.about} legendId={id("about")}>
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
        optional={t.optional}
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
      </Group>

      {/* ── 03 · budget · single-select, a real radiogroup ── */}
      <Group
        index="03"
        legend={t.groups.budget}
        legendId={id("budget")}
        optional={t.optional}
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
      </Group>

      {/* ── 04 · the brief ── */}
      <Group index="04" legend={t.groups.brief} legendId={id("brief")}>
        {/* The one BOXED control on the page. A bare underline cannot contain six rows of text —
            the rule would float unattached below the paragraph — so this borrows the shape of
            /product's hero prompt field: a 1px hairline and a 6px radius, which is the button
            radius and therefore already in the system. `resize-none` matches the reference,
            which also fixes its textarea. The visible legend is the group's, so the label here
            is `sr-only` rather than a second heading. */}
        <div className="flex w-full flex-col items-start gap-2">
          <label htmlFor={id("message")} className="sr-only">
            {t.groups.brief}
          </label>
          <textarea
            id={id("message")}
            name="message"
            rows={6}
            value={values.message}
            onChange={(e) => setField("message", e.target.value)}
            placeholder={t.messagePlaceholder}
            required
            maxLength={LIMITS.messageMax}
            aria-invalid={messageInvalid || undefined}
            aria-describedby={messageInvalid ? id("message-error") : undefined}
            className={`min-h-[160px] w-full resize-none rounded-[6px] border bg-transparent p-4
                        font-sans text-[16px] text-ink placeholder:text-muted
                        transition-[border-color] duration-300 focus:outline-none
                        ${messageInvalid ? "border-ink" : "border-hairline focus:border-ink"}`}
            style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
          />
          {messageInvalid ? (
            <p
              id={id("message-error")}
              className="font-sans text-[12px] text-ink"
              style={{ lineHeight: "1.4em", letterSpacing: "-0.02em" }}
            >
              {errors.message}
            </p>
          ) : null}
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
          meets them in. */}
      <div className="flex w-full flex-col items-start gap-6 border-t border-hairline pt-8">
        <p
          className="max-w-[var(--measure)] font-sans text-[12px] text-muted"
          style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
        >
          {t.consent}
        </p>

        {/* `role="alert"`, not `role="status"`: this is the failure path and it should interrupt.
            The node is always rendered so the live region exists in the DOM before it has
            anything to say — a region inserted at the same moment as its text is not reliably
            announced. */}
        <div role="alert" aria-live="assertive" className="w-full">
          {formError ? (
            <p
              className="font-sans text-[14px] text-ink"
              style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
            >
              {formError}
            </p>
          ) : null}
        </div>

        {/* The site's fixed button anatomy, unchanged: a 20px label row with a 1px optical top
            nudge inside 8/16 padding, 16px medium at -0.01em, 6px radius, 300ms --ease-rogo.
            Filled `ink` on `paper`, which is what /product and /company use on a light ground.
            Full width on phone, content width from 810 up — Footer's own rule for the same
            button. */}
        <button
          type="submit"
          disabled={status === "sending"}
          aria-busy={status === "sending"}
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2
                     overflow-hidden rounded-[6px] border border-transparent bg-ink px-4 py-2
                     transition-opacity duration-300 hover:opacity-90 active:opacity-80
                     disabled:cursor-not-allowed disabled:opacity-50
                     focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2
                     focus-visible:ring-offset-paper focus-visible:outline-none
                     tablet:w-min"
          style={{ transitionTimingFunction: "var(--ease-rogo)" }}
        >
          <span className="flex h-5 items-center justify-center gap-[10px] pt-px">
            <span
              className="font-sans text-[16px] font-medium whitespace-pre text-paper"
              style={{ lineHeight: "1em", letterSpacing: "-0.01em" }}
            >
              {status === "sending" ? t.submitting : t.submit}
            </span>
          </span>
        </button>
      </div>
    </form>
  );
}
