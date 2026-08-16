/**
 * /privacy — the page body, shared by the English and Hebrew shells.
 *
 * Added 2026-08-16. The first of the footer's three Legal links to get a real page; `terms` and
 * `accessibility` still 404 by the user's decision to look at this one first.
 *
 * ⚠️ THE COPY IS A PORT, NOT A CLONE AND NOT AUTHORSHIP. Every sentence comes from the real
 * company site's own published policy (`docs/reference/clixsolutions/pages/privacy.html`,
 * re-checked against the live page the same day). Read `he/privacy.ts`'s header before touching
 * any string: it is a legal instrument, its punctuation is exempt from the house no-dashes rule,
 * and the English is an unreviewed machine translation published under an on-page note that the
 * Hebrew governs.
 *
 * ⚠️ THREE THINGS IN THE POLICY DO NOT DESCRIBE THIS BUILD, flagged for the user and their
 * lawyer in features/privacy-page/FEATURE.md rather than silently "fixed" here:
 *   · it lists a phone number among the data collected; this site's form has no phone field
 *   · it says the site measures statistics; there is no analytics on this site at all
 *   · it names WhatsApp, Facebook, Mundi, n8n and CRM as processors but not GOOGLE, while the
 *     footer embeds a Google Map that sets third-party cookies with no consent gate
 * Rewriting a published policy is not a developer's call, so none of that was touched.
 *
 * NO `robots` GUARD, unlike /product and /company. Those carry one because their CONTENT is
 * borrowed; this page's content belongs to the company it is about, and a privacy policy is
 * meant to be findable. Same reasoning /news and /contact ship indexable on.
 *
 * PrivacyBody takes NO `locale` prop. It briefly did, on 2026-08-16, for a single English-only
 * rendering decision — the "the Hebrew version is binding" note — and the user had that note
 * removed the same day, so the prop went with it. Both bands now differ by locale only in their
 * TEXT, which `getDict()` already handles off the request store.
 */

import Nav from "@/components/sections/Nav";
import PrivacyHero from "@/components/privacy/PrivacyHero";
import PrivacyBody from "@/components/privacy/PrivacyBody";
import Footer from "@/components/sections/Footer";
import { fetchModels } from "@/lib/models";
import type { Locale } from "@/lib/i18n/config";
import { seedLocale } from "@/lib/i18n/server";

export default async function PrivacyRoute({ locale }: { locale: Locale }) {
  /* Seeded here as well as in the root layout, per the standing double-seed rule. */
  seedLocale(locale);

  const models = await fetchModels();

  return (
    <>
      <Nav models={models} />
      <main>
        <PrivacyHero />
        <PrivacyBody />
      </main>
      <Footer />
    </>
  );
}
