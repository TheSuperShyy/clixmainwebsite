/**
 * The body of every legal page — /privacy, /terms, /accessibility — in both locales. Six route
 * shells, one file. Was `PrivacyRoute` until 2026-08-16, when the other two documents landed.
 *
 * ⚠️ THE COPY IS A PORT, NOT A CLONE AND NOT AUTHORSHIP. Every sentence on all three pages comes
 * from the company's own published documents (`docs/reference/clixsolutions/pages/`, each
 * re-checked against the live page the same day). Read the `he/*.ts` headers before touching any
 * string: these are legal instruments, their punctuation is exempt from the house no-dashes
 * rule, and the English files are unreviewed machine translations.
 *
 * ⚠️ SEVERAL STATEMENTS ACROSS THESE DOCUMENTS DO NOT DESCRIBE THIS BUILD, flagged for the user
 * and their lawyer in features/legal-pages/FEATURE.md rather than silently "fixed" here. The
 * accessibility statement is the serious one: it promises a skip-to-content link this site does
 * not have, AA contrast this repo's own docs record as failing in at least six places, and
 * screen-reader testing this build has never had — and it names a real person as responsible for
 * those promises. Rewriting a published legal document is not a developer's call, so none of it
 * was touched.
 *
 * NO `robots` GUARD on any of the three, unlike /product and /company. Those carry one because
 * their CONTENT is borrowed; this content belongs to the company it is about, and legal pages
 * are meant to be findable. Same reasoning /news and /contact ship indexable on.
 *
 * `namespace` rather than a `LegalDoc` prop, deliberately: the page shells must NOT call
 * `getDict()` themselves, because the locale is not seeded until this body runs. The shell names
 * the document; this file resolves it after `seedLocale`.
 */

import Nav from "@/components/sections/Nav";
import LegalHero from "@/components/legal/LegalHero";
import LegalBody from "@/components/legal/LegalBody";
import Footer from "@/components/sections/Footer";
import { fetchModels } from "@/lib/models";
import type { Locale } from "@/lib/i18n/config";
import type { LegalNamespace } from "@/lib/i18n/legal";
import { seedLocale, getDict } from "@/lib/i18n/server";

export default async function LegalRoute({
  locale,
  namespace,
}: {
  locale: Locale;
  namespace: LegalNamespace;
}) {
  /* Seeded here as well as in the root layout, per the standing double-seed rule. */
  seedLocale(locale);

  const models = await fetchModels();
  const doc = getDict()[namespace];

  return (
    <>
      <Nav models={models} />
      <main>
        <LegalHero doc={doc} />
        <LegalBody doc={doc} />
      </main>
      <Footer />
    </>
  );
}
