/**
 * ContactAside — the four-row contact panel beside the form on /contact.
 *
 * Spec: features/contact-page/FEATURE.md
 *
 * IT IS NOT DECORATION AND IT IS NOT A FALLBACK FOR THE FORM. The real clix site puts the same
 * four rows — email, WhatsApp, hours, location — on its own contact page, above the form, and
 * they are the reason that page works when the form does not: if nodemailer's transport is
 * misconfigured, a visitor still has a way to reach the business. That is the argument for
 * rendering it as a SERVER component with no JavaScript of its own, and for keeping it visible
 * in the success state rather than swapping it out with the form.
 *
 * ⚠️ THE VALUES ARE NOT IN THE DICTIONARY. They come from src/lib/contact.ts, which is also
 * what the footer reads, because an address is an identifier rather than copy and two copies
 * of a phone number drift. Only the four LABELS are translated. Read that file's header for
 * why the email gained a hyphen on 2026-08-13.
 *
 * ⚠️ MONO IS USED ON EXACTLY TWO OF THE FOUR VALUES, AND THAT IS A CONSTRAINT, NOT A WHIM.
 * `--font-mono` is Fragment Mono, whose @font-face declarations (src/app/fonts.css) cover
 * Latin, Greek and Cyrillic and NOT U+0590–05FF. Hebrew set in it falls back to the OS
 * monospace mid-paragraph, next to Discovery. So mono goes on the email address and the phone
 * number, which are Latin and numeric in both locales and which are machine addresses anyway;
 * `hoursValue` is `א׳–ה׳ · 09:00–18:00` in Hebrew and stays `font-sans` for exactly that
 * reason. Do not "unify" these two by pushing mono onto the other rows.
 */

import AppLink from "@/components/ui/AppLink";
import { getDict } from "@/lib/i18n/server";
import { CONTACT, CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact";

/* The label/value pair. `href` and `mono` are per-row, which is why this is a component and
   not four hand-written blocks. */
function AsideRow({
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
  /* Reused from Footer's link row: `paper -> surface on hover` inverts to `ink -> muted` here,
     and the `.3s cubic-bezier(.44,0,.56,1)` is the capture's own curve, not an estimate. */
  const valueClass = `${mono ? "font-mono text-[15px]" : "font-sans text-[16px]"} text-ink`;

  return (
    <div className="flex w-full flex-col items-start gap-1 border-t border-hairline pt-4">
      {/* The footer's group-title idiom, which is this exact role: a small label over a short
          list. 14px / 1.3em / -0.02em / medium / muted. Not uppercase and not letter-spaced
          out: positive tracking on Hebrew is unmeasured on this site (globals.css keeps an
          empty `[dir="rtl"]` hook for it) and this label is Hebrew half the time. */}
      <p
        className="font-sans text-[14px] font-medium text-muted"
        style={{ lineHeight: "1.3em", letterSpacing: "-0.02em" }}
      >
        {label}
      </p>
      {href ? (
        <AppLink
          href={href}
          external={external}
          className={`${valueClass} no-underline transition-[color] duration-300 hover:text-muted
                      focus-visible:rounded-[2px] focus-visible:ring-2 focus-visible:ring-forest
                      focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                      focus-visible:outline-none`}
          style={{ lineHeight: "1.5em", letterSpacing: "-0.02em", transitionTimingFunction: "var(--ease-rogo)" }}
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

export default function ContactAside() {
  const t = getDict().contact.aside;

  return (
    /* Sticky only at >=1200, where the form is tall enough for the panel to leave the viewport
       and where there is a second column to be sticky IN. Below that the aside is a full-width
       block above the form and `sticky` would do nothing but cost a containing block.
       `top-[198px]` is the same nav clearance the hero pays, so the panel parks exactly under
       the fixed bar rather than behind it. */
    <div className="flex w-full flex-col items-start gap-4 desktop:sticky desktop:top-[198px] desktop:w-[300px] desktop:flex-none">
      <AsideRow label={t.emailLabel} value={CONTACT_EMAIL} href={CONTACT.email} mono />
      <AsideRow
        label={t.whatsappLabel}
        value={CONTACT_PHONE}
        href={CONTACT.whatsapp}
        external
        mono
      />
      <AsideRow label={t.hoursLabel} value={t.hoursValue} />
      <AsideRow label={t.locationLabel} value={t.locationValue} />
    </div>
  );
}
