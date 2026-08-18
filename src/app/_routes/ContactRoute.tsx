/**
 * /contact — the shared body for /contact and /he/contact.
 *
 * Spec: features/contact-page/FEATURE.md · memory: features/contact-page/CONTEXT.md
 *
 * ⚠️ THE FIRST ROUTE IN THIS REPO THAT IS NOT A CLONE. Every other page under _routes/ has a
 * rogo.com capture behind it and a measured original to diff against. This one has neither:
 * rogo has no contact page, and the reference used here — docs/reference/clixsolutions/pages/
 * contact.html — is the user's OWN site, which supplied the field list and the Hebrew copy but
 * not a single pixel. So the acceptance criteria in FEATURE.md are consistency criteria, not
 * fidelity ones. Read that file before adjusting a number here on the grounds that it "should"
 * match something.
 *
 * NAV IS FIXED HERE, as on /, /news, /product and /company, and unlike /clix. ContactHero pays
 * the clearance itself with `pt-[198px]` — CompanyHero's own value for the same nav — so there
 * is no `spacer` prop.
 *
 * TWO BANDS. Dark hero, light body. Between them they cover the whole of <main>, which is what
 * Nav's `[data-nav-theme]` scan needs: it picks the element spanning the nav's bottom edge and
 * falls back to "light" on a gap.
 *
 * NO ROBOTS BLOCK, AND THAT IS A DECISION. /clix, /product, /company and /security all ship
 * `noindex` because each carries content that has not cleared review — a fabricated quote, an
 * unsubstantiated credential, a placeholder photograph. This page carries none of that: every
 * string on it is either the company's own copy, lifted from its own live site, or a form
 * label. /news is the precedent for a route shipping indexable. A contact page is also the one
 * page a business actively wants found.
 */

import Nav from "@/components/sections/Nav";
import ContactHero from "@/components/contact/ContactHero";
import ContactChannels from "@/components/contact/ContactChannels";
import ContactBody from "@/components/contact/ContactBody";
import Footer from "@/components/sections/Footer";
import { fetchModels } from "@/lib/models";
import type { Locale } from "@/lib/i18n/config";
import { seedLocale, getDict } from "@/lib/i18n/server";
import { PageDictProvider } from "@/lib/i18n/LocaleProvider";

export default async function ContactRoute({ locale }: { locale: Locale }) {
  /* Seeded here as well as in the root layout: this body is the direct parent of every section,
     so a server component below it can never read the locale before it is set, regardless of
     layout ordering. */
  seedLocale(locale);

  const models = await fetchModels();

  return (
    /* ContactForm is a client component and reads its strings with usePageDict("contact") —
       this provider is what makes that work. ContactHero and ContactAside are server components
       and use getDict().contact directly. */
    <PageDictProvider name="contact" value={getDict().contact}>
      <>
        <Nav models={models} />
        <main>
          <ContactHero />
          <ContactBody />
        </main>
        {/* The shared footer, unchanged. Its own closing CTA now points at THIS page, so on
            /contact it is a link to the page you are already on. That is the same shape as the
            nav's current-page link and is left as is: the alternative is a per-route special
            case in a component rendered by every route. */}
        {/* ⚠️ THE CLOSING CTA IS REPLACED ON THIS ROUTE ONLY. The footer's reiteration block ends
            every other page with "Software that works, results that speak." over a `Let's start`
            button — and that button points at /contact, so on /contact it pointed at the page you
            were already reading. features/contact-page/FEATURE.md carried that as an open question
            from 2026-08-13; the user closed it on 2026-08-17: "move it down, remove the cta, since
            you are already in the cta page."

            So the four contact channels end the page instead. They are the right thing to land on
            after a long form — a visitor who does not want to fill it in gets email and WhatsApp
            as the last thing they see — and it is the same argument ContactChannels.tsx's header
            has always made, just applied at the bottom of the page rather than the top. */}
        <Footer closing={<ContactChannels />} />
      </>
    </PageDictProvider>
  );
}
