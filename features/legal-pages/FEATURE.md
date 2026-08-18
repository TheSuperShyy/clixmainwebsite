# Feature: the legal pages — /privacy, /terms, /accessibility

| | |
|---|---|
| Slug | `legal-pages` |
| Page(s) | `/privacy` · `/terms` · `/accessibility`, each in both locales — six routes |
| Status | `review` |
| Reference | **not the clone target** — `docs/reference/clixsolutions/pages/{privacy,terms,accessibility}.html`, each re-checked against the live <https://www.clixsolutions.info/> page |
| Original Framer name | **none** — not rogo routes |
| Component | `src/app/_routes/LegalRoute.tsx` → `components/legal/LegalHero.tsx` + `LegalBody.tsx`, shape in `src/lib/i18n/legal.ts` |

## Purpose

The company's three published legal documents, ported onto this site. All built 2026-08-16 at the
user's request. Between them they closed the last three of the footer's eight dead links — **the
footer now has none**.

**One component pair serves all six routes.** `/privacy` shipped first with its own
`PrivacyHero`/`PrivacyBody`; when the other two landed an hour later they proved to be the same
document type — eyebrow, title, last-updated line, numbered sections, closing line — so the
components were renamed into `components/legal/` rather than copied twice. Three copies would
have meant three places to fix the next contrast or bidi bug.

### The three documents

| Route | Sections | Source |
|---|---|---|
| `/privacy` | 10 | `privacy.html` — data collected, purposes, third parties, rights, retention, marketing, cookies |
| `/terms` | 6 | `terms.html` — fair use, liability, external links, updates, cookie types, cookie management |
| `/accessibility` | 7 | `accessibility.html` — intent, standards, features, assistive tech, work in progress, coordinator, changes |

---

## ⚠️ THESE ARE LEGAL INSTRUMENTS. READ BEFORE EDITING ANY STRING.

Every sentence on all three pages is **lifted verbatim** from the company's own published
documents. Each capture was re-checked against its live page on 2026-08-16: same sections, same
order, each carrying `עדכון אחרון · 16 במאי 2026`.

Nothing on any of the three was written by an agent and nothing should be. Tightening a clause, modernising a
term, or "fixing" the punctuation changes a document the company is legally bound by. ONE edit
was made to the text and it is described below; anything beyond it is a decision for the user and
their lawyer, not for whoever is next in this file.

(There were two until the translation note was removed on 2026-08-16 — see the next section.)

### The one deliberate deviation from verbatim

**The contact details are placeholders, not literals.** The source prints
`info@clixsolution.com` (no hyphen) and `055-9483457`. **The unhyphenated address is stale** —
`src/lib/contact.ts` records that the user confirmed on 2026-08-13 that the live inbox is the
hyphenated `info@clix-solution.com`.

On any other page a stale address is a broken link. On this one it is the channel through which
a person exercises a statutory right to see, correct or delete their data, so it cannot be
allowed to drift. The dictionary strings therefore carry `{email}` and `{phone}`, and
`PrivacyBody` substitutes `CONTACT_EMAIL` / `CONTACT_PHONE` and renders them as real `mailto:`
and `tel:` links. **Verified: the rendered page contains zero occurrences of the stale address
and zero unreplaced placeholders.**

---

## The English page is an unreviewed machine translation

`he/privacy.ts` is the **source**; `en/privacy.ts` is the **translation**. Same inversion as the
`contact` namespace, and for the same reason: the page exists only in Hebrew on the real site.

The user chose on 2026-08-16 to publish an English translation with an on-page note that the
Hebrew version is binding, over the alternative of serving Hebrew on both routes. **They then saw
that note rendered and asked for it to be removed, the same day.** It is gone, along with its key
in both dictionaries and the `locale` prop on `PrivacyBody` that existed only to gate it.

⚠️ **WHAT THE PAGE NO LONGER TELLS THE READER.** `/privacy` and `/he/privacy` now read as two
equally authoritative versions of one legal document, and nothing on either page resolves a
conflict between them. `he/privacy.ts` remains the source and remains correct by construction if
the two diverge — that fact now lives only in code comments and in this file. The concern was
stated once and the call is the user's; it is recorded here so the next person does not read the
absence as an oversight and does not re-add the note without asking.

**Getting the English reviewed by a lawyer or a native speaker is the other way to close the same
gap**, and is the open item below.

Translated to be faithful rather than fluent. Israeli statutes are named as themselves — "the
Protection of Privacy Law", "the Communications Law (section 30a, the Spam Law)" — never swapped
for a nearest foreign equivalent, because GDPR vocabulary would misdescribe them.

---

## ⚠️⚠️ THE ACCESSIBILITY STATEMENT PROMISES FOUR THINGS THIS BUILD DOES NOT DO

**This is the most important section in this file.**

`/accessibility` is not a description. It is a DECLARATION under Israeli regulation 35 of the
Equal Rights for Persons with Disabilities Regulations and standard ת״י 5568, and its §06 **names
a real person** — Almaliach Ido — as the accessibility coordinator responsible for it.

Checked against this codebase on 2026-08-16, by grep, not by assumption:

| The statement promises | This build |
|---|---|
| §03: a "skip to content" link at the top of every page, revealed on first Tab | ❌ **Does not exist.** No skip link and no `id="main"` target anywhere in `src/` |
| §03: WCAG AA contrast on body text and interactive elements, palette "measured, not assumed" | ❌ **At least six open AA failures**, recorded in this repo's own `docs/DESIGN-SYSTEM.md` and `docs/SECTIONS.md`: 3.85:1 on security/footer/careers, 4.35:1 and 4.24:1 on /product, 2.50:1 and 1.92:1 on testimonials. **The eyebrow on the accessibility page itself is one of them.** |
| §04: tested with VoiceOver (macOS/iOS), NVDA (Windows), keyboard-only, last two stable versions of four browsers | ❌ **This build has had none of that testing** |
| §03: ARIA live regions for status messages including chat updates | ⚠️ Form ✓ (`ContactForm.tsx`); **there is no chat on this site** |
| §03: `prefers-reduced-motion` honoured throughout | ✅ **True** — `globals.css` plus five components |

§05 additionally describes remediation work on the playground node editor and background 3D
scenes. **Neither exists on this site** — the playground is the real company site's feature, and
it is the same page whose footer link was deleted the same day for having no analogue here.

### What was done about it

Every one of these was reported to the user in plain terms **before** the port. The instruction
was to copy the page, so it is copied verbatim and the mismatches are recorded — here, in the
header of `he/accessibility.ts`, and in `docs/CONTEXT.md`.

⚠️ **Two of the four are cheaper to make TRUE than to amend**, and that is the recommended path:

1. **The skip link** is a small, self-contained addition — one anchor, one `id="main"`, one
   `sr-only` + `focus:not-sr-only` pair. It would also be a genuine improvement regardless of
   what the statement says.
2. **The contrast failures** already have a documented one-line fix: `docs/DESIGN-SYSTEM.md`
   records that `#7f7f7f` reaches 4.56:1 and that **one token change closes all the 3.85:1
   instances at once**.

The other two (screen-reader testing, the playground/3D paragraphs) can only be resolved by
doing the testing or by amending the text — both decisions for the user.

---

## ⚠️ THINGS /privacy AND /terms SAY THAT DO NOT DESCRIBE THIS BUILD

Found while porting, **not corrected**, because rewriting a published policy is not a
developer's call. Flagged here for the user and their lawyer:

| The policy says | What this site actually does |
|---|---|
| Collects a **phone number** (§02) | The contact form has no phone field. It takes name, email, company, message, plus need and budget options. |
| Uses cookies for **statistical measurement** (§03, §09) | **There is no analytics on this site at all** — no gtag, no GTM, no Pixel, no Hotjar. Grepped 2026-08-16. |
| Names WhatsApp, Facebook, Mundi, n8n, CRM as processors (§04) | Those are the *company's* tools. This *site's* actual third parties are **Google** (Gmail SMTP via nodemailer for the form, and the footer's Google Maps iframe) — and Google is not named. |

**/terms adds three more:**

| The terms say | This site |
|---|---|
| §07: on first visit you are asked to approve cookies and may set preferences | 🟡 **HALF TRUE since 2026-08-17.** The prompt now exists — `src/components/legal/CookieBanner.tsx`. "להגדיר העדפות" still does not: there are two buttons and no settings panel, and neither button gates anything. See "The cookie banner" below. (Was §06; the section renumbered when `כללי` was added.) |
| §05: marketing cookies for tailored advertising on Facebook and Google | ❌ **No ad pixels** — no gtag, no GTM, no Facebook Pixel |
| §04: the last-updated date appears at the *bottom* of the document | ⚠️ It is at the **top**, on the live page and therefore here. The source contradicts itself; kept as published. |

The cookie ones are the sharpest, across both documents. `FooterMap.tsx` embeds a keyless Google
Map that **sets third-party cookies on every page with no consent gate** — an open risk this repo
carried before any of these pages existed. So `/terms` now *promises* a consent dialog that does
not exist, while `/privacy`'s cookie clause does not name the party actually setting them.

Over-declaring (privacy §02's phone) is safer than under-declaring. The cookie clauses are the
opposite case.

---

## ⚠️ ACCESSIYES IS WIRED BUT NOT CONFIGURED (2026-08-17)

The user asked to try AccessiYes instead of Sienna. The integration exists
(`src/components/a11y/AccessiYesWidget.tsx`) and is INERT until
`NEXT_PUBLIC_ACCESSIYES_SITE_ID` is set; until then `AccessibilityGate` falls through to Sienna,
so a button always exists.

**What it is, verified rather than taken from the marketing page:** sold as a WordPress plugin;
the generic script embed is real but unpublished (their homepage snippet is a placeholder
pointing at `cdn.example.com`); the file served is `WebYes Accessibility Widget v2.0.0` from
`cdn-cookieyes.com`; **370 KB against Sienna's 66 KB**; its only outbound host is a font path,
with no telemetry endpoint anywhere in the bundle.

**⚠️ IF ACCESSIYES BECOMES THE SHIPPED WIDGET, §04 IS WRONG.** That section was rewritten hours
earlier to name Sienna and enumerate Sienna's controls, at the user's request that the page
describe the real widget. AccessiYes has a different set. §04 is a declaration under תקנה 35 —
it has to be rewritten in the same change that flips the gate, not afterwards.

Two smaller consequences of a switch:

- The `.asw-*` skin in globals.css and `SiennaCustomize.tsx` are Sienna's class names. They match
  nothing in AccessiYes, so it renders unstyled and its statement link keeps pointing at the
  vendor's page rather than ours. Both would need redoing against its own DOM.
- `privacy` §05's third-party list would name `cdn-cookieyes.com` instead of jsDelivr.

## ⚠️ THE SIENNA PLUGIN — OPEN LEGAL-COPY ITEM (2026-08-17)

The user's boss asked for "a real plugin because it's illegal" not to have one, then the user
came back with "it's paid, we should use some free one". The site ships **Sienna**
(`src/components/a11y/SiennaWidget.tsx`, chosen by `AccessibilityGate.tsx`) — a real, externally
maintained, MIT-licensed third-party widget that is free with no account and no paywall. A
UserWay integration was written first and deleted the same hour, unused and never configured.

**What was told to the user before it landed**, and stands:

- The Israeli requirement is real — תקנה 35 and ת״י 5568. **A widget is not what satisfies it.**
  The FTC finalised a $1M order against accessiBe (April 2025) for claiming an AI widget makes a
  site WCAG compliant; UserWay drew a class action (July 2024) over similar claims; and 1,000+
  US lawsuits in 2023–24 targeted sites that HAD a widget installed. The user reaffirmed the
  instruction, which is their call to make.

**THE ITEM FOR THE LAWYER, and the reason this section exists:**

`privacy` §05 (`מסירת מידע לצד שלישי`) ENUMERATES the third-party processors by name — WhatsApp,
Facebook, monday, n8n, other CRM tools. **Sienna is a third-party script served from jsDelivr and
is not in that list.** Adding it is a change to a published legal document, so it is flagged here
rather than made. Same class of thing as the three conflicts in the 2026-08-17 sync.

Two smaller ones:

- The cookie banner gates nothing by decision, so a second cookie-setting third party widens the
  gap between terms §07 and the build rather than narrowing it.
- `/accessibility` §04 says the button is "בצד שמאל של המסך". Sienna's default corner is its
  own; if it lands anywhere but the LEFT, either its data attributes move it or §04 does.
- ⚠️ The script is loaded from `@latest`, so an upstream release reaches production with no
  commit here. Pin it once a known-good version is confirmed in the browser — pinning is also
  what makes an `integrity` hash possible, which `@latest` forbids by construction. **This is
  now load-bearing twice over:** `SiennaCustomize.tsx` patches Sienna's DOM by class and id, and
  §04 of the statement describes its control list. An upstream change breaks the skin silently
  and makes a legal declaration inaccurate.
- ⚠️ **A SECOND third party.** Sienna's "PDF Reader" control posts to `lumiopdf.pages.dev`,
  reached only if a visitor uses that one feature. If §05 is amended to name Sienna, this
  belongs in the same edit.

**The built-in widget stays as the fallback and must not be deleted as dead code.** It is one env
var away (`NEXT_PUBLIC_A11Y_WIDGET=builtin`) and it is what keeps §04 from being a lie on the day
jsDelivr is blocked, an upstream release breaks, or the project is abandoned. §04 is a
declaration under תקנה 35, not marketing copy — a tested local implementation behind it is the
point.

## The accessibility widget (2026-08-17) — §04's promise, now kept

`src/components/a11y/AccessibilityWidget.tsx`, mounted in both layout shells. Ported from the
live clix-solution.com widget. **Unlike the cookie banner, this one is real** — every control
does what its label says.

Seven controls, all Hebrew labels lifted verbatim from the live widget:

| Control | Mechanism |
|---|---|
| `גודל טקסט` ± | `documentElement.style.zoom`, 80–150% in 10-point steps |
| `ניגודיות גבוהה` | `.a11y-high-contrast` — redefines design tokens |
| `סמן גדול` | `.a11y-big-cursor` — 32px inline-SVG cursor, no asset |
| `הדגשת קישורים` | `.a11y-highlight-links` — yellow plate, black text, underline |
| `גופן קריא` | `.a11y-readable-font` — Verdana/Tahoma stack, letter-spacing normal |
| `מצב התמקדות` | `.a11y-focus-mode` — kills motion, dims `aria-hidden` decoration |
| `איפוס כל ההגדרות` | Back to defaults |

Persisted to `localStorage["clix-a11y-settings"]` as JSON, parsed defensively (spread over
frozen `DEFAULTS`, so a missing or unknown key cannot break a page).

### ⚠️ Two mechanisms that look like arbitrary choices and are not

1. **`zoom`, not root `font-size`.** The live site sets `documentElement.style.fontSize = "120%"`.
   That would do almost nothing here — this codebase sets type in absolute pixels throughout
   (`text-[14px]`, `text-[32px]`), and px does not inherit from the root size. `zoom` scales px
   type, spacing and images alike.
2. **No `filter` on `html` or `body`, for high contrast or anything else.** A filtered ancestor
   becomes the containing block for `position: fixed` descendants, which would unpin the nav,
   the cookie banner and the widget's own button. High contrast therefore redefines
   `--color-muted`, `--color-hairline` and friends; every component picks it up for free because
   they already read those tokens. `--color-muted` is the load-bearing one: #737373 (4.7:1 on
   white) becomes #1c1c1c (past 12:1). Filters appear only on `img`/`video`.

Also: the button is at `left-4`, PHYSICAL left, not `start-4`. §04 says "בצד שמאל" in Hebrew,
where the logical start edge is the right one.

### What this does to the false-promise count

Back to **four**, from the six of earlier the same day. Now TRUE: §04's button, and §03's text
resize and high-contrast bullets. Still FALSE, unchanged:

- §03's `דילוג לתוכן` skip link — there is none.
- §03's WCAG AA contrast claim — the DEFAULT palette still has the recorded AA failures. The new
  high-contrast mode is opt-in and does not make the base claim true.
- §04's VoiceOver / NVDA / four-browser keyboard testing — never done.
- §03's ARIA live regions for `עדכוני צ׳אט` — there is no chat.

Plus §05, which still describes a playground node editor and 3D scenes this site does not have.

## The cookie banner (2026-08-17)

`src/components/legal/CookieBanner.tsx`, mounted once in each layout shell. Ported from the live
clix-solution.com banner, which is the source of truth for this site's legal surface.

**⚠️ IT IS COSMETIC, AND THAT WAS DECIDED, NOT OVERLOOKED.** The user was asked outright whether
it should gate anything and chose "cosmetic — matches the live site", which is also all the live
site does (its buttons set a flag and nothing reads it). So:

- Both buttons write `localStorage["clix-cookie-consent"]` — `"all"` or `"essential"` — and
  dismiss. **Nothing in this app reads that value.**
- `FooterMap.tsx` still loads its Google Maps iframe on every route, before any click and
  regardless of which button is clicked. It remains the only third-party cookie source in the
  build.

**To make it real** — the change was kept to one step deliberately: import `readConsent()` from
the banner into `FooterMap`, and render the reserved `bg-ink-soft` box instead of the `<iframe>`
until it returns `"all"`. The storage key and its two values exist for exactly that.

### Two implementation notes worth not rediscovering

1. **The strings live in `chrome`, not a page namespace.** `I18nProvider` hands the client
   exactly one dictionary. Page namespaces are seeded per route body; the banner mounts in the
   LAYOUT, above every route, so a `cookies` namespace would be unreachable from it.
2. **`useSyncExternalStore`, not `useState` + `useEffect`.** This project's lint runs the React
   Compiler rules, and `react-hooks/set-state-in-effect` rejects the read-storage-on-mount idiom
   outright. The store's third argument (`getServerSnapshot`, returning `"unknown"`) is also what
   makes the server render and the hydration pass agree on rendering nothing — which is why a
   returning visitor never sees the bar flash before it removes itself. Verified: the banner is
   absent from the server HTML (`aria-label="הודעת עוגיות"` count 0) while the dictionary reaches
   the client in the RSC payload (count 1, both locales).

The entrance is a `@keyframes cookie-banner-in` in globals.css rather than a Tailwind transition,
for the same lint reason — an element mounted already in its resting state has no earlier frame
to transition from, and forcing one needs a second render. `motion-reduce:animate-none` on the
element.

## Structure and where the values came from

No reference to measure against — this is not a clone of a rogo route, and the real site's own
design is not this site's. So every value is **borrowed from a band that WAS measured**, the same
discipline `features/not-found/` uses.

| Property | Value | Borrowed from |
|---|---|---|
| Hero band | `bg-ink`, `data-nav-theme="dark"`, `pt-[198px]`, `pb-16`/`desktop:pb-24` | `ContactHero` |
| Eyebrow | 14px `font-sans` `font-medium` `text-muted` | `ContactHero` |
| `<h1>` | 44px → 48px ≥810, `1.1em`, `-0.05em`, `text-paper` | `ContactHero` / footer tagline |
| Last-updated line | 14px `text-paper-soft` (11.84:1 on ink) | `paper-soft` token; **not** `muted`, because this line carries information found nowhere else |
| Body band | `bg-paper`, `data-nav-theme="light"`, `py-16`/`desktop:py-24` | `ContactBody` |
| Section number | 14px `muted` `tabular-nums` | the eyebrow treatment |
| Section `<h2>` | 24px → 28px ≥810, `1.2em`, `-0.03em` | `why-rogo`'s tier split (tablet headings larger) |
| Body text | 16px → 18px, `1.6em`, `max-w-[var(--measure)]` | the site's narrow measure |
| Section gap | `gap-12`; hero-to-body `gap-14` | container idiom |

**No new tokens.** Nothing was added to `docs/DESIGN-SYSTEM.md`.

### Enumerations render as real lists

⚠️ **The source markup uses `<p>` for all thirty-odd runs and contains no `<ul>` anywhere.** The
split into `items` vs `paras` in the dictionary is an editorial judgement about which runs are an
enumeration (collected fields, purposes, rights) and which are prose. **It changes no word.** It
exists so the enumerations render as real `<ul>`s and get announced as lists with a count, which
the original's wall of paragraphs does not — an accessibility improvement over the source, stated
so nobody later "restores" it.

⚠️ **Render order is `items` then `paras`.** Section 06 is the only section carrying both: two
statutory rights, then a procedural note about submitting in writing. Verified in the rendered
HTML that 06 comes out in that order.

---

## Acceptance

- [x] All six routes 200 — `/privacy`, `/terms`, `/accessibility` in both locales
- [x] Section counts render correctly: privacy 10, terms 6, accessibility 7
- [x] Zero occurrences of the stale `info@clixsolution.com` on any of the six
- [x] Zero unreplaced `{email}`/`{phone}` on any of the six
- [x] Email renders as `mailto:`, phone as `tel:+972559483457` with bidi isolation
- [x] Accessibility §06 renders lead → items → tail in that order (intro, contact list, response note)
- [x] Hebrew pages carry their own eyebrow, title and date
- [x] Indexable — no `robots` guard on any, deliberately
- [x] `npm run build` passes with no type errors; all three dicts `satisfies LegalDoc`
- [x] No new design tokens
- [x] Every footer link now resolves — 8 dead → 0
- [ ] **None of the six has been looked at in a browser at any tier** — verified by status code,
      rendered HTML and section counts only
- [ ] Hebrew pages read by a native speaker
- [ ] **English translations reviewed by a lawyer or a native speaker**
- [ ] Contrast checked (the `muted` eyebrow on `ink` is the inherited 3.85:1 pairing — and on
      `/accessibility` that is the page contradicting its own §03)

## Open questions

1. **The accessibility statement's four false promises.** The top-priority item in this folder.
   Two are cheap to make true (skip link; the one-token contrast fix already documented in
   `docs/DESIGN-SYSTEM.md`); two need a decision (do the screen-reader testing, or amend the
   text). A declaration under regulation 35, naming a real person, should not stay wrong.
2. **The cookie situation, across both `/terms` and `/privacy`.** `/terms` §06 promises a consent
   dialog that does not exist; `/privacy` §09 does not name Google, whose map sets cookies on
   every page. Building a consent gate would resolve both at once and close the `FooterMap` risk
   this repo has carried since 2026-08-11.
3. **The three privacy mismatches** — phone collection, analytics, unnamed processor. Does the
   policy change, or does the site?
4. Should these documents carry a version history, given `updatedDate` is a single string?
5. `/terms` §04 says the date is at the bottom while it renders at the top. Trivial, but it is
   the document contradicting itself, so it is the user's call whether to fix the text.
