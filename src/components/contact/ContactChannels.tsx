/**
 * ContactChannels — the four contact routes, on the dark hero band of /contact.
 *
 * Spec: features/contact-page/FEATURE.md
 *
 * ⚠️ THIS WAS `ContactAside.tsx` UNTIL 2026-08-17, AND IT WAS A 300px SIDEBAR. Read this before
 * moving it back. As a sidebar it was four small label/value rows standing beside a ~1400px
 * form, and it lost twice over: it looked weightless next to the form, and at desktop
 * `300 + 64 gutter + 720 form = 1084` inside a 1280 container left ~196px of dead gutter at the
 * end of the row. Below 1200 it was worse — `ContactBody` stacks, and it rendered as four
 * FULL-WIDTH rows sitting between the hero and the form, so every phone and tablet visitor
 * scrolled past email/WhatsApp/hours/location before reaching the thing the page is for.
 *
 * Moving it into the hero fixes all three at once, and costs nothing this component was for:
 *
 * ⚠️ ITS ORIGINAL ARGUMENT IS STRENGTHENED, NOT WEAKENED. The header this file carried said the
 * four rows "are the reason that page works when the form does not" — if nodemailer's transport
 * is misconfigured, a visitor still has a way to reach the business. That argument wanted them
 * ABOVE the form, not beside it, and it wanted them on a band that never unmounts. Both are now
 * true: the hero stays put through the success state, so the direct routes are still one glance
 * away after a send. Still a SERVER component with no JavaScript of its own.
 *
 * ⚠️ THE VALUES ARE NOT IN THE DICTIONARY. They come from src/lib/contact.ts, which is also what
 * the footer reads, because an address is an identifier rather than copy and two copies of a
 * phone number drift. Only the four LABELS are translated, and they still live under the
 * `aside` key — renaming it would churn both locale files for zero behaviour, in a namespace
 * whose header says "OWNED BY ONE AGENT". Read src/lib/contact.ts for why the email gained a
 * hyphen on 2026-08-13.
 *
 * ⚠️ MONO IS USED ON EXACTLY TWO OF THE FOUR VALUES, AND THAT IS A CONSTRAINT, NOT A WHIM.
 * `--font-mono` is Fragment Mono, whose @font-face declarations (src/app/fonts.css) cover
 * Latin, Greek and Cyrillic and NOT U+0590–05FF. Hebrew set in it falls back to the OS
 * monospace mid-paragraph, next to Discovery. So mono goes on the email address and the phone
 * number, which are Latin and numeric in both locales and which are machine addresses anyway;
 * `hoursValue` is `א׳–ה׳ · 09:00–18:00` in Hebrew and stays `font-sans` for exactly that
 * reason. Do not "unify" these two by pushing mono onto the other rows.
 *
 * ⚠️ EVERY COLOUR HERE FLIPPED WHEN THE GROUND DID, INCLUDING THE FOCUS RING. On `paper` the
 * ring was `ring-forest` with `ring-offset-paper`; both are near-invisible on `ink`. The whole
 * point of a focus ring is that it is seen, so on this band it is `ring-paper` on
 * `ring-offset-ink`. The two new state colours (`signal` / `alert`) are NOT options here —
 * they are 2.68:1 and 2.78:1 on `ink` and both fail. See the token note in globals.css.
 */

import AppLink from "@/components/ui/AppLink";
import { getDict } from "@/lib/i18n/server";
import { CONTACT, CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact";

/* The label/value pair. `href` and `mono` are per-row, which is why this is a component and
   not four hand-written blocks. */
function ChannelRow({
  label,
  value,
  href,
  external,
  mono,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  mono?: boolean;
}) {
  const valueClass = `${mono ? "font-mono text-[15px]" : "font-sans text-[16px]"} text-paper`;

  return (
    <div className="flex w-full flex-col items-start gap-1 border-t border-hairline-light pt-4">
      {/* The footer's group-title idiom, which is this exact role: a small label over a short
          value. 14px / 1.3em / -0.02em / medium. `paper-soft` (white at 80%) rather than
          `muted`: `muted` on `ink` is 3.85:1 and fails AA, an open item four other routes
          already carry — but this label names the value beneath it, so it carries information
          and does not qualify for that exemption. `paper-soft` flattens to 11.84:1, AAA.
          Not uppercase and not letter-spaced out: positive tracking on Hebrew is unmeasured on
          this site (globals.css keeps an empty `[dir="rtl"]` hook for it) and this label is
          Hebrew half the time. */}
      <p
        className="font-sans text-[14px] font-medium text-paper-soft"
        style={{ lineHeight: "1.3em", letterSpacing: "-0.02em" }}
      >
        {label}
      </p>
      {href ? (
        <AppLink
          href={href}
          external={external}
          /* Hover inverts what it was on the light ground: `ink -> muted` becomes
             `paper -> paper-soft`. The `.3s cubic-bezier(.44,0,.56,1)` is the capture's own
             curve, not an estimate. */
          className={`${valueClass} no-underline transition-[color] duration-300 hover:text-paper-soft
                      focus-visible:rounded-[2px] focus-visible:ring-2 focus-visible:ring-paper
                      focus-visible:ring-offset-2 focus-visible:ring-offset-ink
                      focus-visible:outline-none`}
          style={{
            lineHeight: "1.5em",
            letterSpacing: "-0.02em",
            transitionTimingFunction: "var(--ease-rogo)",
          }}
        >
          {value}
        </AppLink>
      ) : (
        <p
          className={valueClass}
          style={{ lineHeight: "1.5em", letterSpacing: "-0.02em" }}
        >
          {value}
        </p>
      )}
    </div>
  );
}

export default function ContactChannels() {
  const t = getDict().contact.aside;

  return (
    /* 1 / 2 / 4 up. A grid rather than a flex row so the four rules align across the band at
       every tier regardless of how a Hebrew label wraps — with flex, one two-line label would
       drag its neighbours' rules out of level. `gap-x-10` matches the hero's own tablet gutter. */
    <div className="grid w-full grid-cols-1 gap-x-10 gap-y-6 tablet:grid-cols-2 desktop:grid-cols-4">
      <ChannelRow label={t.emailLabel} value={CONTACT_EMAIL} href={CONTACT.email} mono />
      <ChannelRow
        label={t.whatsappLabel}
        value={CONTACT_PHONE}
        href={CONTACT.whatsapp}
        external
        mono
      />
      <ChannelRow label={t.hoursLabel} value={t.hoursValue} />
      <ChannelRow label={t.locationLabel} value={t.locationValue} />
    </div>
  );
}
