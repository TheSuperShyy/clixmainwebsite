# Context: Contact page

Memory for this section. **Newest entry on top.** Append after every task — never rewrite past
entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold, with
no code scanning.

---

## Current state

`/contact` and `/he/contact` exist and are statically prerendered. Dark hero band, then a light
band holding a sticky 300px contact aside and a four-group form. The form POSTs to
`/api/contact`, which validates, drops honeypot hits, rate-limits, and mails the enquiry to
`info@clix-solution.com` over Gmail SMTP via nodemailer. All eleven CTAs across the site now
point here. Build, lint and typecheck are clean; the API's five failure paths and one success
path were exercised over HTTP and behave correctly; the Gmail credential was verified.

**What is not done: nobody has looked at the page.** No visual check at any width, no Hebrew RTL
check, no browser keyboard walk-through. Handed to the user for exactly that.

**Status:** `review`
**Next action:** user opens `/contact` and `/he/contact` and says whether the layout is right;
then set the two env vars in the Vercel project settings so the deployed form can send.

---

## Log

### 2026-08-13

**Done**
- New route `/contact` + `/he/contact`: two shells, `_routes/ContactRoute.tsx`, and four
  components under `src/components/contact/` (`ContactHero`, `ContactBody`, `ContactAside`,
  `ContactForm`). Only `ContactForm` is a client component.
- New dictionary namespace `contact`, both locales, registered in `dictionary.ts`.
- New `src/app/api/contact/route.ts` — the project's second route handler.
- New `src/lib/contact.ts` — the company's email, phone, Instagram and WhatsApp, extracted out
  of `Footer.tsx`.
- Repointed **all eleven CTAs** from `#contact` / `/#contact` / a `mailto:` to `/contact`:
  `Nav` ×2, `Footer` ×2, `Hero`, `ProductHero`, `CompanyHero`, `SecurityHero`, `ClixHero`,
  `ClixCTA`, `NewsRoute`. Six of those were raw `<a>` and are now `AppLink`.
- Added `nodemailer` + `@types/nodemailer`.

**Decisions** (what was chosen, what was rejected, why)
- **The design is ours, not the reference's.** The user's own contact page
  (`docs/reference/clixsolutions/pages/contact.html`) is a rounded card with grey filled inputs
  and a violet gradient pill button. Asked whether to reproduce that or restyle, the user said
  "our own design, also our own layout think of something better that match our system". So the
  reference supplied structure and copy only, and the form was rebuilt as four hairline-ruled
  numbered groups with underline inputs. **Zero new design tokens.**
- **Gmail SMTP + app password**, chosen by the user over an n8n webhook and over a transactional
  provider. This is why `nodemailer` became the first runtime dependency this project has added
  (five deps to six) — a decision `src/lib/i18n/format.ts` records the project as ordinarily
  refusing. Justification: the channel was the user's choice and Node cannot speak SMTP without
  a client.
- **One recipient, `info@clix-solution.com`.** The user first named two addresses
  (`ido.team@clix-solution.com` and `info@`) and then narrowed it to `info@` only.
- **Two env-var names accepted per value.** `.env` already contained `GMAIL_EMAIL` /
  `GMAIL_PASSWORD`; every deployment guide writes `GMAIL_USER` / `GMAIL_APP_PASSWORD`. The route
  reads the first pair then the second, so both work.
- **Validation duplicated client and server, on purpose.** Client saves a round trip; server is
  the boundary. Rejected `zod` — five hand-written rules do not justify the project's second new
  runtime dependency in one day.
- **Both pill vocabularies re-declared in the API** rather than imported from the dictionary. A
  locale file is copy; an allow-list at a trust boundary is not, and the two should not be able
  to widen each other.
- **Option ids are the wire format** (`ai-agents`, `25-75k`, …), keyed records not indexed
  arrays. The notification email therefore reads identically whichever language filled the form
  in, and inserting an option cannot silently re-pair the labels after it.
- **Errors are monochrome.** No red exists in this system and the only two semantic colours it
  ever had were deleted 2026-08-08 as dead tokens. An invalid field says so three ways —
  `hairline` underline goes to `ink`, a message appears, `aria-invalid` is set — none of them
  colour alone.
- **Rejected: a captcha** (a tax on every real visitor), **a database** (the inbox is the
  record), **an autoresponder** (a second deliverability problem nobody asked for).
- **Consent line ships as plain text, not two links.** `/privacy` and `/terms` are two of the
  eight dead footer links in this build; two known 404s inside a legal sentence is worse than no
  link. Flagged, reversible in one edit.
- **The footer keeps `id="contact"`** although nothing now points at it. It costs nothing and is
  the kind of anchor that gets linked from a mail signature.
- **`/clix`'s hero now leaves the page** for `/contact` rather than scrolling to its own
  `#clix-contact` band. The band and its id stay; its own button also goes to `/contact`.
- **`ContactForm`'s `textField` is a render helper called as a function, not a nested
  `<Field/>` component.** A component declared inside another gets a fresh identity every parent
  render, so React would remount the subtree and blur the input on the first keystroke of every
  field. It reads slightly awkwardly for that reason. Do not "clean it up" into JSX.

**Measurements worth keeping** (values that were hard to get, gotchas in the original)
- **`pt-[198px]` is the fixed nav's clearance at every tier**, reused from `CompanyHero.tsx`
  rather than re-derived. The aside's `desktop:top-[198px]` is the same number, so the sticky
  panel parks under the bar rather than behind it.
- **⚠️ Fragment Mono has no Hebrew.** `--font-mono` is declared and, until this page, unused. Its
  `@font-face` blocks in `src/app/fonts.css` carry `unicode-range`s for Latin, Greek and
  Cyrillic — **U+0590–05FF is absent**. Hebrew set in it falls back to the OS monospace mid-line
  next to Discovery. Mono is therefore used in exactly three places, all Latin-or-numeric in both
  locales: the group numerals, the aside's email, the aside's phone. `hoursValue` is
  `א׳–ה׳ · 09:00–18:00` in Hebrew and stays `font-sans` for this reason.
- **`mark` #8b8b8b is 3.41:1 on `paper` — it fails AA for normal text.** Measured with
  `node docs/reference/contrast-check.js --check "#8b8b8b" "#ffffff"`. It was initially used for
  the input placeholders and the "Optional" badge; both moved to `muted` #737373 (4.74:1, AA).
  The group numerals keep `mark` because they are `aria-hidden`, name nothing, and restate the
  visible order of four groups — the same exemption /clix's logo grid takes.
- **The reference's pill semantics, read off its HTML rather than guessed:** the six "relevant"
  pills carry `aria-pressed` (multi-select), the four budget pills carry `role="radio"`
  (single-select). Its form is `noValidate` and its three `required` inputs are name, email and
  message.
- **The reference's budget ladder has a gap** — `עד ₪10k`, then `₪15k – ₪25k`. Reproduced
  verbatim; what the business advertises is not ours to tidy.
- **The reference's email is stale.** It prints `info@clixsolution.com`, no hyphen, which is what
  `Footer.tsx` carried. The user confirmed the live inbox is the hyphenated
  `info@clix-solution.com`, so the footer's mailto changed as a side effect of the extraction to
  `src/lib/contact.ts`.
- **The sending mailbox is `office@clix-solution.com`**, a Google Workspace account already in
  `.env` — not the `clixteam579@gmail.com` the plan assumed. Its stored password is 16
  characters, i.e. a real app password, and Gmail accepted it.
- **`next start` does not pick up a mid-session rebuild, and `TaskStop` does not free its port.**
  Two consecutive test runs hit a stale server on :3011 and reported a fixed bug as still
  present. The node process had to be killed by PID. Worth knowing before trusting a local
  end-to-end result.

**Verification performed**
- `npm run build` — clean. 20 static routes (18 + the two contact pages) plus `/api/contact` as
  the one dynamic route.
- `npm run lint` — 7 errors + 1 warning, **all pre-existing at HEAD** and none in a new file:
  `require()` imports in `docs/reference/*.js`, and `ClixHero`'s ref-access-during-render, which
  `git show HEAD:` confirms is byte-identical.
- `npx tsc --noEmit` — clean. The Hebrew dictionary satisfies the English shape.
- Over HTTP against the dev server: `/contact` 200, `/he/contact` 200; API 415 on a non-JSON
  content-type, 400 on malformed JSON, 400 with `{name,email,message: required}` on an empty
  body, 400 with `{email: invalid, message: too short}` on a bad one, 200-and-silently-drop on a
  filled honeypot, and 429 with `Retry-After: 600` on the fourth request in the window.
- Gmail credential verified with an `AUTH`-only SMTP handshake (`transporter.verify()`), no mail
  sent.
- One real end-to-end send returned `{"ok":true}`, addressed to `office@clix-solution.com` —
  the sending mailbox itself, deliberately not `info@`, to keep a test message out of the shared
  inbox. **The user then asked for no further email testing, so none was done.** The delivered
  message itself was never opened or confirmed by eye.

**Skills invoked**
- None matched. `docs/SKILLS.md` registers no form, email or route skill, and the two candidates
  (`gsap`, `framer-motion`) both fire on motion this page has none of.

**Open / deferred**
- **Nobody has looked at the page.** No visual check at 1600 / 1440 / 1024 / 390, no Hebrew RTL
  check, no browser keyboard walk-through. This is the whole of what is left before `done`.
- The two env vars still need setting in the Vercel project settings; `.env` covers local only.
- `/news`'s CTA still reads "Contact Media Team" while pointing at the general form.
- Whether the sending mailbox should be a dedicated no-reply rather than `office@`.
