# Feature: /privacy — Privacy Policy

| | |
|---|---|
| Slug | `privacy-page` |
| Page(s) | `/privacy` · `/he/privacy` |
| Status | `review` |
| Reference | **not the clone target** — `docs/reference/clixsolutions/pages/privacy.html`, plus the live <https://www.clixsolutions.info/privacy> |
| Original Framer name | **none** — not a rogo route |
| Component | `src/app/_routes/PrivacyRoute.tsx` → `components/privacy/PrivacyHero.tsx` + `PrivacyBody.tsx` |

## Purpose

The company's published privacy policy, ported onto this site. Built 2026-08-16 at the user's
request (*"we have to create a privacy page, you can copy the data from
https://www.clixsolutions.info/privacy"*). First of the footer's three Legal links to get a real
page.

---

## ⚠️ THIS PAGE IS A LEGAL INSTRUMENT. READ BEFORE EDITING ANY STRING.

Every sentence is **lifted verbatim** from the company's own published policy. The capture was
re-checked against the live page on 2026-08-16: same ten sections, same order, same
`עדכון אחרון · 16 במאי 2026`.

Nothing here was written by an agent and nothing should be. Tightening a clause, modernising a
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

## ⚠️ THREE THINGS THE POLICY SAYS THAT DO NOT DESCRIBE THIS BUILD

Found while porting, **not corrected**, because rewriting a published policy is not a
developer's call. Flagged here for the user and their lawyer:

| The policy says | What this site actually does |
|---|---|
| Collects a **phone number** (§02) | The contact form has no phone field. It takes name, email, company, message, plus need and budget options. |
| Uses cookies for **statistical measurement** (§03, §09) | **There is no analytics on this site at all** — no gtag, no GTM, no Pixel, no Hotjar. Grepped 2026-08-16. |
| Names WhatsApp, Facebook, Mundi, n8n, CRM as processors (§04) | Those are the *company's* tools. This *site's* actual third parties are **Google** (Gmail SMTP via nodemailer for the form, and the footer's Google Maps iframe) — and Google is not named. |

The third is the sharpest. `FooterMap.tsx` embeds a keyless Google Map that **sets third-party
cookies with no consent gate anywhere on the site** — an open risk this repo already carried
before this page existed, and one a cookies clause would normally have to cover.

Over-declaring (§02's phone) is safer than under-declaring. §09 vs the Google embed is the
opposite case.

---

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

- [x] `/privacy` and `/he/privacy` both 200
- [x] All ten sections render, numbered 01–10
- [x] Zero occurrences of the stale `info@clixsolution.com`; zero unreplaced `{email}`/`{phone}`
- [x] Email renders as `mailto:`, phone as `tel:+972559483457` with bidi isolation
- [x] Translation note removed from both routes at the user's request (verified: zero hits)
- [x] Section 06 renders items before its trailing paragraph
- [x] Indexable — no `robots` guard, deliberately
- [x] `npm run build` passes with no type errors
- [x] No new design tokens
- [ ] **Never looked at in a browser at any tier** — verified by status code and rendered HTML only
- [ ] Hebrew page read by a native speaker
- [ ] **English translation reviewed by a lawyer or a native speaker**
- [ ] Contrast checked (the `muted` eyebrow on `ink` is the inherited 3.85:1 pairing)

## Open questions

1. **The three mismatches above** — do they get corrected in the policy, or does the site change
   to match the policy? Either is a real answer; silently doing neither is not.
2. **The Google Maps consent gate.** Pre-existing, but this page makes it explicit: the site sets
   third-party cookies and now has a published cookies clause that does not name the party.
3. **`terms` and `accessibility`** are still 404. Both are captured in the same folder and this
   page proved the shape, so they are now a repeat of a known job rather than an unknown one.
4. Should the policy carry a version history, given `updatedDate` is a single string?
