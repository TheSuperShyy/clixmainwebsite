# Context: the legal pages (/privacy, /terms, /accessibility)

Memory for this section. **Newest entry on top.** Append after every task — never rewrite past
entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold, with
no code scanning.

---
## 2026-08-17 — cookie banner shipped (cosmetic, by decision)

`src/components/legal/CookieBanner.tsx` + a `cookies` block in `chrome` + one `@keyframes` in
globals.css + a mount in each of the two layout shells. Requested as "my boss wants that";
brainstormed first, and the user chose **cosmetic — matches the live site** when asked directly
whether it should gate anything.

**So it stores a choice nothing reads.** `FooterMap`'s Google Maps iframe still loads on every
route regardless. terms §07 goes from unkept to half-kept: the prompt exists, "להגדיר העדפות"
does not. Full reasoning and the one-step path to making it real are in FEATURE.md under
"The cookie banner".

### Two things that cost time and should not cost it twice

- **`chrome`, not a new namespace.** `I18nProvider` passes exactly one dictionary to the client.
  A layout-level component cannot read a page namespace — those are seeded per route body.
- **`useSyncExternalStore` is mandatory here, not a preference.** The obvious
  `useState(false)` + `useEffect(() => setOpen(true))` fails `npm run lint`:
  `react-hooks/set-state-in-effect` (React Compiler rules) rejects it. The same rule is why the
  entrance is a keyframe rather than a transition — a transition would need a second render to
  create a "before" frame. Both dead ends were hit before the current shape.

Copy is verbatim from the live banner; Hebrew is the source, English the translation.
⚠️ `bodyLead` / `bodyTail` carry their own edge spacing (Hebrew's lead ends on the bare prefix
`ב` with NO space; English's ends on `our ` WITH one). A trim breaks both.

`npm run build` passes. Verified by curl, not by eye: banner absent from server HTML, dictionary
present in the client payload in both locales. **The visual pass at 1600/1440/1024/390 is the
user's** — not yet done.


## 2026-08-17 — re-sourced against clix-solution.com (content only)

The user pointed at `https://www.clix-solution.com/` and said it **is the source of truth**. It
is a client-rendered Vite SPA — the HTML shell is 1.8 KB and empty — so the three pages were read
out of `/assets/index-BUEpsVI-.js` (865 KB). Offsets, for anyone re-checking: privacy
~826400–830700, terms ~830950–833500, accessibility ~833850–836200, footer link array 792799.

**The 2026-08-16 port came from a different site.** Those file headers cite `clixsolutions.info`
/ `docs/reference/clixsolutions/`. The two document sets share hrefs and topic order and
essentially nothing else: the live pages carry no section numbers, no eyebrow, no `עדכון אחרון`
(except accessibility's `עודכן לאחרונה: דצמבר 2024`), a `חזרה לדף הבית` link at the top, and say
`קליקס` in prose where ours says `Clix`.

**DECISION (user's, explicit): copy the DATA, not the structure.** Our shell stays; only copy
that exists live and was missing here was added. Nothing was deleted.

### Added

| Page | Added | Was |
|---|---|---|
| terms | §01 `כללי` — "השימוש באתר … מהווה הסכמה מלאה" | absent entirely |
| terms | © line, as `tail` on the last section | absent |
| privacy | §02 `מבוא` | absent entirely |
| privacy | `CLIX, קליקס פתרונות אוטומציה לעסקים` | paraphrased as "Clix — חברת …" |
| accessibility | §04 `כפתור נגישות` | absent entirely |
| accessibility | §09 `שיפור מתמיד` | absent entirely |
| accessibility | §03 bullets: text resize, high-contrast mode | absent |

Sections renumbered (terms 6→7, privacy 10→11, accessibility 7→9) and `en/` mirrored in the same
edit — `Translated<T>` type-checks TUPLE ARITY, so a one-sided addition is a build error.
`npm run build` passes.

### ⚠️ Three conflicts left UNCHANGED — these are NOT omissions

1. **Spam-law citation.** Live privacy says `חוק הספאם סעיף 13`; ours says
   `חוק התקשורת (סעיף 30א חוק הספאם)`. §30א is the correct provision. A conflicting value is not
   a missing one, and downgrading a statute reference to a wrong one on the user's behalf is not
   a developer's call. Ours kept; user's decision pending.
2. **Email.** Live prints `info@clixsolution.com` (no hyphen). `src/lib/contact.ts` records the
   user confirming `info@clix-solution.com` on 2026-08-13, and the pages still render `{email}`
   → `CONTACT_EMAIL`. Kept hyphenated. This is the channel for statutory data requests, so it
   must not drift.
3. **`מונדי`.** Live privacy's third-party clause lists `ווטסאפ, פייסבוק, מונדי, n8n`. This port
   transliterated `מונדי` as **"Mundi"**; in a CRM list it is almost certainly **monday.com**.
   Not touched — same reason as (1).

### ⚠️ The accessibility statement now makes TWO MORE promises this build does not keep

`כפתור נגישות` names a control at a named screen position ("בצד שמאל של המסך"), and the two new
§03 bullets promise text resize and a high-contrast mode. **The live site ships that widget; this
build has none of it** — there is no such component in `src/`. That takes the page's
false-promise count from four to six. Reported to the user at the time of the edit. Same shape as
the cookie-banner clause in terms §07: the live site has a real consent banner
(`האתר משתמש בעוגיות` / `קבל את כל העוגיות` / `רק עוגיות חיוניות`), and this build does not.

### Not touched (outside the "data only" scope the user set)

The live footer renders the three links as `נגישות · פרטיות · תנאי שימוש`, in that order, at
every width. Ours renders `תנאי שימוש · מדיניות פרטיות · הצהרת נגישות` with terms gated to
desktop (`Footer.tsx:136`). Labels, order and the gate all differ. Left alone deliberately.


## Current state

All three documents built 2026-08-16 and building clean — six routes, two bands each (dark hero,
light body), **one shared component pair** (`components/legal/`) driven by the `LegalDoc` shape in
`src/lib/i18n/legal.ts`. Hebrew is the source for all three; English are unreviewed translations
and the pages do not say so. No new tokens.

**Every link in the footer now resolves.** It began the day with eight dead.

⚠️ **The accessibility statement promises four things this build does not do** — a skip-to-content
link, AA contrast, screen-reader testing, and a chat that does not exist — and it names a real
person as responsible. Two of the four are cheaper to make true than to amend. This is the top
item in `FEATURE.md` and the most important thing in this folder.

⚠️ `/terms` promises a cookie-consent dialog that does not exist, while the footer's Google Map
sets third-party cookies on every page.

**Status:** `review`
**Next action:** decide the accessibility gaps (recommend: add the skip link and make the
one-token contrast change, which closes two of the four). Then show all three pages — none has
been looked at in a browser.

---

## Log

### 2026-08-16 — /terms and /accessibility ported; components generalised

**Trigger:** user — *"now how abot the 2 other links"*, then, after an explanation they found
unclear, *"copy this https://www.clixsolutions.info/terms"* and *"and also this is for accesibility
https://www.clixsolutions.info/accessibility"*.

**Both fetched live and cross-checked against the captures — they agree.** Each has the same shape
as /privacy: `משפטי · X` eyebrow, title, `עדכון אחרון · 16 במאי 2026` at the top, numbered
sections, the same closing line.

**The components were generalised rather than copied.** `PrivacyHero`/`PrivacyBody` →
`components/legal/LegalHero`/`LegalBody`, `PrivacyRoute` → `LegalRoute` taking a namespace name,
and a shared `LegalDoc` type. Three copies of 150 lines would have meant three places to fix the
next contrast or bidi bug. `LegalRoute` takes a NAMESPACE, not a resolved document, because page
shells must not call `getDict()` — the locale is not seeded until the body runs.

**The section shape changed while doing it, and the reason is worth keeping.** The first draft had
`items` + `paras`. The accessibility statement's §06 is an intro paragraph, THEN the coordinator's
name/email/phone as a list, THEN a paragraph about response times — paragraphs on both sides of a
list, which two slots cannot express. So it is now `lead` → `items` → `tail`, all optional. Privacy
was migrated to it.

**⚠️ THE ACCESSIBILITY STATEMENT WAS PORTED KNOWING IT IS PARTLY UNTRUE OF THIS BUILD**, and that
is the single most important fact in this folder. It promises a skip-to-content link that does not
exist, AA contrast this repo's own docs contradict in at least six places, screen-reader testing
that never happened, and live regions for a chat there is none of. It is a declaration under
Israeli regulation 35 and it **names a real person** as responsible.

Each of those was verified by grep, not assumed, and reported to the user in plain terms before
the port. The instruction was to copy the page. So it is verbatim, and the mismatches are recorded
in three places. **Two of the four are cheaper to make true than to amend** — a skip link is small,
and `docs/DESIGN-SYSTEM.md` already records that one token change closes every 3.85:1 instance.

**/terms carries its own three**, all left as published: a cookie-consent dialog that does not
exist, ad cookies with no ad pixels behind them, and a clause saying the date is at the bottom
when it renders at the top.

**Verified** on `next start`: all six routes 200; section counts 10/6/7; zero stale addresses and
zero unreplaced placeholders across all six; accessibility §06 renders lead → items → tail in
order; Hebrew eyebrows, titles and dates present; every footer link resolves.

**Not verified:** none of the six has been opened in a browser.

---


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
