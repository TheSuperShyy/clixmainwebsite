# Context: /privacy

Memory for this section. **Newest entry on top.** Append after every task — never rewrite past
entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold, with
no code scanning.

---
## Current state

Built 2026-08-16 and building clean. Two bands (dark hero, light body) carrying the company's
own ten-section privacy policy, ported verbatim, in both locales. Hebrew is the source; English
is an unreviewed translation, and **the page no longer says so** — the "Hebrew version is binding"
note was removed at the user's request the same day. No new tokens.

The footer's `privacy` link now resolves. `terms` and `accessibility` still 404.

⚠️ **Three statements in the policy do not describe this build** (phone collection, analytics,
and Google as an unnamed processor behind the footer map). Listed in `FEATURE.md`, deliberately
not corrected.

**Status:** `review`
**Next action:** the user has never seen the page. Show it. Then decide the three mismatches, and
whether to port `terms` and `accessibility` the same way.

---

## Log

### 2026-08-16 — the "Hebrew is binding" note removed at the user's request

**Trigger:** user, on a screenshot of the callout — *"remove this part"*.

Removed in full: the rendered block, the `authoritativeNote` key in BOTH dictionaries, and the
`locale` prop on `PrivacyBody`, which existed for no other purpose. Verified zero hits for the
English string, the Hebrew string and the key name across both routes; the ten sections, the
substituted contact details and the section-06 ordering are unchanged.

**The concern was stated once before doing it, and is recorded rather than re-argued.** With the
note gone, `/privacy` and `/he/privacy` present as two equally authoritative versions of one legal
document and nothing on either page resolves a conflict. `he/privacy.ts` is still the source and
still right by construction — that now lives in a comment instead of on the page. Getting the
English reviewed is the other way to close the same gap.

⚠️ **Do not re-add it without asking.** Its absence is a decision. The reasoning that originally
put it there is preserved in the header of `en/privacy.ts` so the next reader has both halves.

---

### 2026-08-16 — page created, ported from the company's own published policy

**Trigger:** user — *"lets move to this section, we have to create a privacy page, you can copy
the data from https://www.clixsolutions.info/privacy and then for the other links im not sure
about them"*.

**Source.** The live URL was fetched AND the repo's own capture
(`docs/reference/clixsolutions/pages/privacy.html`) was extracted; they agree — ten sections,
same order, same `עדכון אחרון · 16 במאי 2026`. Ported from the capture because it is complete and
verbatim where the fetch returns a summary.

**Two decisions taken by the user, offered with their costs:**

1. **English is a translation published with a "Hebrew prevails" note**, over serving Hebrew on
   both routes. ⚠️ The note is what makes an unreviewed machine translation of a legal document
   publishable; it is not decoration and must not be dropped without a new decision.
2. **Privacy only this pass.** `terms` and `accessibility` are captured in the same folder and
   were left alone.

**The stale-address trap, and why the contact details are not literals.** The published policy
prints `info@clixsolution.com` — no hyphen — in three separate sections plus the closing line.
`src/lib/contact.ts` records that the user confirmed on 2026-08-13 that the hyphenated
`info@clix-solution.com` is the live inbox and the capture is stale. Copying the policy verbatim
would therefore have published, four times, a dead address **as the channel for exercising a
statutory data right**. So the strings carry `{email}` / `{phone}` and `PrivacyBody` substitutes
from `contact.ts`. `interpolate()` was deliberately NOT used: it returns a string and these have
to be anchors.

**Three mismatches found and NOT fixed.** The policy claims a phone number is collected (the form
has no phone field), claims statistical measurement (there is no analytics on this site at all —
grepped for gtag/GTM/Pixel/Hotjar, zero hits), and names WhatsApp/Facebook/Mundi/n8n/CRM as
processors without naming **Google**, while `FooterMap.tsx` embeds a Google Map setting
third-party cookies with no consent gate. Rewriting a published legal document is not a
developer's call, so all three were reported rather than patched.

**Editorial call worth knowing about: `items` vs `paras`.** The source markup is `<p>` for all
thirty-odd runs, with no `<ul>` anywhere. Splitting the enumerations out into `items` changes no
word but lets them render as real lists a screen reader announces with a count. Recorded because
it looks like a divergence from the source and is one — a deliberate accessibility improvement,
not a porting error.

⚠️ **Render order is `items` then `paras`, and section 06 is the only section that depends on
it** (two rights, then the "submit in writing" note). Verified in the rendered HTML rather than
assumed.

**Verified** on `next start`: both routes 200; ten section numbers present; zero occurrences of
the stale address; zero unreplaced placeholders; `tel:+972559483457` rendered; the translation
note present on `/privacy` and absent on `/he/privacy`; section 06 in the right order; build
clean.

**Not verified:** never opened in a browser at any tier. The Hebrew has not been read by a native
speaker and **the English translation has not been reviewed by a lawyer**.
