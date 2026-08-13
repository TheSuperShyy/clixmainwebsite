/**
 * ContactBody — the light band that holds the aside and the form on /contact.
 *
 * Spec: features/contact-page/FEATURE.md
 *
 * A server component that renders one client child. That split is the point: ContactForm is the
 * only thing on this page that needs JavaScript, so it is the only thing that ships any. The
 * band, the container, the aside and all four of its rows are static HTML.
 *
 * ⚠️ THE ORDER IS ASIDE THEN FORM IN THE DOM, AT EVERY TIER, AND THAT IS DELIBERATE.
 * Below 1200 the two stack and the aside reads first, which puts the direct email and phone
 * number above a form a visitor may not want to fill in. At 1200 and up they are columns and
 * the aside is the inline-start one. No `order-*` classes anywhere, so DOM order and reading
 * order never disagree — which is what keeps the tab sequence correct without a single
 * `tabindex` above -1.
 */

import ContactAside from "./ContactAside";
import ContactForm from "./ContactForm";

export default function ContactBody() {
  return (
    /* `data-nav-theme="light"` — with ContactHero's dark band above it, these two cover the
       whole of <main>, so Nav's theme scan never falls through a gap. */
    <section
      data-nav-theme="light"
      className="relative flex w-full items-start justify-center bg-paper px-4 py-16 tablet:px-10 desktop:py-24"
    >
      <div
        className="relative flex w-px max-w-[var(--container-max)] flex-[1_0_0] flex-col
                   items-start gap-12 desktop:flex-row desktop:gap-16"
      >
        <ContactAside />
        <ContactForm />
      </div>
    </section>
  );
}
