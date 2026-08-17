/**
 * ContactBody — the light band that holds /contact's form.
 *
 * Spec: features/contact-page/FEATURE.md
 *
 * ⚠️ `bone`, NOT `paper`, AS OF 2026-08-17 — AND THE FORM ON IT IS STILL WHITE. That pairing is
 * measured, not stylistic. Every small grey on this form is `muted` #737373: the field labels,
 * the placeholders, the group hints and the consent line. `muted` on `bone` is **4.24:1**,
 * which FAILS AA for normal text (it is 4.74:1 on white, which passes). So the form could not
 * simply be tinted — the BAND takes the tint and the form stays on `paper` inside it, which is
 * exactly what /company Block 3 does with its white cards on `bone`.
 *
 * ⚠️ THE RULE THAT FOLLOWS, AND IT IS THE EASY ONE TO BREAK LATER: on this band, only `ink`
 * and `ink-soft`. `muted` is 4.24:1 here and `mark` is 3.05:1 — worse than its already-failing
 * 3.41:1 on white. Any small grey that migrates OUT of the white panel onto this ground fails
 * silently, because nothing about it looks wrong. The rail beside the form sets its intro in
 * `ink-soft` (10.49:1) for precisely this reason and must not be "tidied" back to `muted`.
 * Checked with `node docs/reference/contrast-check.js`.
 *
 * ⚠️ THIS SECTION MUST NEVER GAIN `overflow-hidden`, AND THE REASON IS EXPENSIVE. The form's
 * rail is `position: sticky`, and an ancestor with `overflow: hidden` becomes the sticky
 * element's scroll container — so the rail would pin to a box that scrolls away with the page,
 * i.e. it would not appear to pin at all. This is not hypothetical: it is exactly what broke
 * /company Block 3's sticky heading on 2026-08-16 (see CompanyServices.tsx's own note), and the
 * symptom there was deceptive enough to cost real time. It would ALSO clip the form panel's
 * `shadow-float` at the band edge. Nothing here needs a clip.
 *
 * ⚠️ THE TWO-COLUMN ROW IS NOT HERE ANY MORE. It used to live in this file, with `ContactAside`
 * and `ContactForm` as siblings. The rail is now a sibling of the FORM inside ContactForm.tsx,
 * because the success state has to swap out the form while leaving the rail standing — and a
 * component cannot replace only itself from a parent that owns its sibling. This file is just
 * the band now.
 */

import ContactForm from "./ContactForm";

export default function ContactBody() {
  return (
    <section
      data-nav-theme="light"
      className="relative flex w-full items-start justify-center bg-bone px-4 py-16 tablet:px-10 desktop:py-24"
    >
      {/* `w-px flex-[1_0_0]` is Framer's idiom, reproduced across this repo: a 1px basis so the
          max-width cap decides the container rather than its content. Safe HERE at every tier —
          unlike inside the form — because this is a ROW flex container (`justify-center`) at
          every width, so the 1px is a real flex basis and grows. See ContactForm.tsx's own
          note for the version of this that shipped a bug. */}
      <div className="relative flex w-px max-w-[var(--container-max)] flex-[1_0_0] flex-col items-start">
        <ContactForm />
      </div>
    </section>
  );
}
