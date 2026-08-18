/**
 * English copy for /contact. OWNED BY ONE AGENT — see features/i18n-rtl/FEATURE.md.
 *
 * THE NAMESPACE'S SHAPE IS DEFINED HERE and `dictionary.ts` only imports it.
 *
 * ⚠️ THIS NAMESPACE IS THE OTHER WAY ROUND FROM EVERY OTHER ONE. Elsewhere the English was
 * authored first and the Hebrew is a restoration of it. Here the HEBREW is the source: every
 * label, placeholder and option on this page is lifted verbatim from
 * docs/reference/clixsolutions/pages/contact.html, the real company site's own contact form,
 * which is `lang="he"` and has no English version. So this file is the TRANSLATION and
 * he/contact.ts is the original. Provenance is marked in the Hebrew file as usual; what is
 * marked here is anywhere the English had to make a choice the Hebrew did not.
 *
 * ⚠️ NO JSX, NO HTML, NO MARKUP. The headline's three runs are three keys because the middle
 * one is a COLOUR boundary (paper-soft / paper); the `<span>` stays in ContactHero.tsx.
 *
 * ⚠️ OPTION LABELS ARE KEYED BY A STABLE ID, NOT BY INDEX, and the ids are the wire format.
 * `ContactForm` posts `["ai-agents","crm"]` and `"25-75k"` to the API, so the email that
 * reaches the inbox reads the same whichever language filled the form in. An index-keyed
 * table would also silently re-pair every label the moment an option is inserted. Display
 * ORDER is the component's business and lives in ContactForm.tsx — the same split
 * `newsItems.ts` draws.
 *
 * ⚠️ THE BUDGET FIGURES ARE NOT TRANSLATED AND THEIR EN DASHES ARE NOT OURS. `₪15k – ₪25k`
 * is the reference's own string. The standing no-dashes rule (2026-08-10) governs clix PROSE;
 * a numeric range is not prose, and rewriting the real site's price bands as "to" would
 * change what the business advertises. Same carve-out shape as the Hebrew prefix hyphen.
 *
 * ⚠️ THE FOUR ASIDE VALUES ARE NOT HERE. The email, the phone number and their `mailto:` /
 * `wa.me` forms live in src/lib/contact.ts, because an address is an identifier, not copy.
 * Only the LABELS above them are in this file.
 */

/* ── the two option sets ───────────────────────────────────────────────────────────────────
   Records, not arrays, for the id-keyed reason above. Their key sets ARE the closed
   vocabularies the API validates against — `src/app/api/contact/route.ts` re-declares the
   same ids as a const array and a locale dictionary cannot be the source of truth for a
   server-side allow-list. If you add an option, both files change. */

export type NeedId =
  | "ai-agents"
  | "whatsapp"
  | "crm"
  | "integrations"
  | "custom-software"
  | "consulting";

export type BudgetId = "upto-10k" | "15-25k" | "25-75k" | "75k-plus";

export const contact = {
  hero: {
    eyebrow: "Contact",
    /* Three runs, one colour boundary. `headlineB` is the emphasised word — `paper` against
       the other two at `paper-soft`. The Hebrew emphasises "אתם" ("you"); English puts the
       weight on the same idea, which is why the split is not word-for-word. */
    headlineA: "Tell us what",
    headlineB: "you",
    headlineC: "are planning to build.",
  },

  aside: {
    /* Labels for the four rows. The VALUES come from src/lib/contact.ts. */
    emailLabel: "Email",
    whatsappLabel: "WhatsApp",
    hoursLabel: "Hours",
    hoursValue: "Sun–Thu · 09:00–18:00",
    locationLabel: "Location",
    locationValue: "Global",
  },

  /* ── the brief-rail beside the form (AUTHORED, 2026-08-17) ───────────────────────────────
     The reference has no heading column beside its form — it is a single centred card — so
     there is nothing to source here. Added when the page gained its two-column layout: the
     rail carries this heading, this intro and a live list of the four group legends, which it
     reads from `form.groups` rather than restating. */
  panel: {
    title: "One brief, then a real reply.",
    /* ⚠️ THE COUNT IS LOAD-BEARING AND WENT 3 → 4 WHEN `phone` WAS ADDED (2026-08-18). Phrased
       as "four short steps, four required fields" rather than repeating the numeral as a word
       twice in two sentences. If a field's required-ness ever changes, this string changes with
       it — a form that miscounts its own obligations is worse than one that says nothing. */
    intro:
      "Four short steps, four required fields; everything else just helps us answer better.",
    /* Sits under the intro and beside the submit button. The SAME promise `successBody` makes
       — moved to where it can still change someone's mind, because after a successful send it
       is reassurance and before one it is a reason to write. */
    reply: "We reply within one business day.",
  },

  form: {
    /* The four group legends, each with its own numeral in the component. */
    groups: {
      about: "About you",
      needs: "What's relevant for you?",
      budget: "Budget range",
      brief: "Tell us",
    },

    nameLabel: "Full name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    /* ⚠️ REQUIRED, AND ADDED FOR A REASON THAT IS NOT THE FORM'S. The n8n workflow behind this
       form opens a WhatsApp thread with the lead, and it cannot do that without a number — see
       src/app/api/contact/route.ts. The placeholder shows an international prefix because the
       workflow is what normalises the number, and a `+` costs it a guess. */
    phoneLabel: "Phone",
    phonePlaceholder: "+972 50 000 0000",
    companyLabel: "Company",
    companyPlaceholder: "Company or project name",
    roleLabel: "Role",
    rolePlaceholder: "e.g. founder, COO",

    needs: {
      "ai-agents": "AI agents",
      whatsapp: "WhatsApp",
      crm: "CRM",
      integrations: "Integrations",
      "custom-software": "Custom software",
      consulting: "Consulting",
    },

    budget: {
      "upto-10k": "Up to ₪10k",
      "15-25k": "₪15k – ₪25k",
      "25-75k": "₪25k – ₪75k",
      "75k-plus": "₪75k+",
    },

    messagePlaceholder:
      "Two honest sentences is plenty. What is the problem? What have you already tried?",

    /* Optional-field hint, shown beside the four legends that are not required. The reference
       marks nothing; it just declares `required` on three inputs and leaves the user to find
       out on submit. Saying so up front is ours. */
    optional: "Optional",

    /* ⚠️ RENDERED AS PLAIN TEXT, NOT AS TWO LINKS. The reference links "מדיניות הפרטיות" and
       "תנאי השימוש". /privacy and /terms are two of the eight footer links this build does
       not have a route for, and two known 404s inside a legal sentence is worse than no link
       at all. One string, therefore, rather than the five runs a linked version would need.
       Flagged as an open question in features/contact-page/FEATURE.md. */
    consent:
      "By sending this form you accept our privacy policy and terms of use.",

    submit: "Send",
    /* Replaces the button label while the request is in flight. */
    submitting: "Sending",

    /* The success panel that replaces the form. AUTHORED — the reference's own confirmation
       is rendered by JS the capture did not run, so there is nothing to source. */
    successEyebrow: "Sent",
    successTitle: "Thanks. We have it.",
    successBody:
      "We read every message ourselves and reply within one business day.",

    /* Validation. One message per rule, not per field — the field is named by the label the
       message sits under, so repeating it in the sentence is noise. */
    errors: {
      nameRequired: "Please tell us your name.",
      nameTooLong: "That is longer than we can store.",
      emailRequired: "Please add an email so we can reply.",
      emailInvalid: "That does not look like an email address.",
      phoneRequired: "Please add a phone number so we can reach you on WhatsApp.",
      phoneInvalid: "That does not look like a phone number.",
      tooLong: "That is longer than we can store.",
      messageRequired: "Please tell us a little about what you need.",
      messageTooShort: "A sentence or two, so we know what to reply to.",
      messageTooLong: "That is longer than we can store.",
      /* The whole-form states. `failed` is what a 500 looks like to a visitor — it names the
         fallback rather than the fault, because the fault is ours and unactionable. */
      summary: "Please check the highlighted fields.",
      failed:
        "Something went wrong sending that. Please email us directly and we will pick it up.",
      rateLimited: "That is a few messages in quick succession. Please try again shortly.",
    },

    a11y: {
      /* The pill groups are `<div role="group">` and `role="radiogroup"`, so each needs its
         own accessible name; the visible legend supplies it via aria-labelledby, and these
         two describe the INTERACTION, which the legend does not. */
      needsHint: "Choose any that apply.",
      /* Announced by an sr-only `role="status"`, never seen. The visible count badge beside the
         legend is `aria-hidden` — it duplicates what these say. `{n}`/`{total}` go through
         `interpolate()` (src/lib/i18n/format.ts), which is what `chrome.ts` already uses. */
      needsCount: "{n} of {total} selected.",
      /* Only announced once the remaining count is low, and BUCKETED to the nearest 50 by the
         component — an exact figure would fire this live region on every keystroke. */
      charsLeft: "About {n} characters left.",
      budgetHint: "Choose one.",
      /* The honeypot's label. Never seen; read aloud only if a screen reader ignores
         `aria-hidden`, which is why it says what to do rather than what it is. */
      honeypot: "Leave this field empty.",
      /* Marks the three required fields for assistive tech beyond the `required` attribute. */
      required: "required",
    },
  },
} as const;

export type ContactDict = typeof contact;
