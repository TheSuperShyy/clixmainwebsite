# Feature: Contact page

| | |
|---|---|
| Slug | `contact-page` |
| Page(s) | `/contact` · `/he/contact` |
| Order on page | `ContactHero` (eyebrow + headline) → `ContactBody` (rail + form) → `Footer`, whose closing CTA is replaced by `ContactChannels` on this route |
| Status | `review` |
| Reference | **none of the usual kind** — see below |
| Original Framer name | **n/a. There is no rogo original.** |
| Component | `src/components/contact/{ContactHero,ContactBody,ContactChannels,ContactForm,contactGlyphs}.tsx`. ⚠️ `ContactChannels` renders in the **footer** via `Footer`'s `closing` prop, not in this page's own tree. |
| Route | `src/app/_routes/ContactRoute.tsx` + two shells |
| API | `src/app/api/contact/route.ts` |
| Dictionary | `src/lib/i18n/{en,he}/contact.ts` |

## Purpose

The site's one CTA destination. Before 2026-08-13 all eleven "Let's start" buttons pointed at
`#contact`, the `id` on `<footer>` — so clicking the primary CTA scrolled you to a footer whose
own button pointed back at itself, and a visitor had no way to say anything to the business.
This page takes an enquiry and mails it to `info@clix-solution.com`.

---

## ⚠️ READ THIS BEFORE TREATING THIS FILE LIKE THE OTHERS

**This is the first route in the repo that is not a clone**, and the template below does not
apply the way it does everywhere else.

- **rogo has no contact page.** There is no `docs/reference/target/` capture, no
  `data-framer-name`, no measured original, and no reference screenshot to diff against.
- **The reference that does exist is a different kind of thing.**
  `docs/reference/clixsolutions/pages/contact.html` is the user's OWN live site. It supplied
  the **field list, the field order, the five placeholders, which three fields are `required`,
  both pill vocabularies and both pill groups' ARIA semantics** — all read off the saved HTML,
  so those are facts. It supplied **no pixels**: it is a rounded card with grey filled inputs
  and a violet gradient pill button, and this design system has `--radius-none: 0px` as its
  default, no shadows, no gradients and no blue.
- **The visual design is ours, at the user's explicit instruction** (2026-08-13: "our own
  design, also our own layout think of something better that match our system").

So the repo's standing **"measure, don't eyeball"** rule has nothing to measure here. What
replaces it: **no value on this page is invented that the site already has an answer for.**
Every number in the spec below is either an existing site value reused — with the file it came
from — or a decision recorded as a decision. Acceptance is therefore a **consistency** test,
not a fidelity one.

---

## Spec

### Layout

Three tiers, not four: nothing on this page distinguishes ≥1600 from 1200–1599.

| Property | Desktop ≥1200 | Tablet 810–1199 | Phone ≤809 |
|---|---|---|---|
| Container max-width | 1280 (`--container-max`) | 1280 | 1280 |
| Horizontal padding | 40 (`tablet:px-10`) | 40 | 16 (`px-4`) |
| Hero padding-top | **198** | 198 | 198 |
| Hero padding-bottom | 96 (`desktop:py-24`) | 64 | 64 |
| Body padding | 96 top/bottom | 64 | 64 |
| Body columns | 2 — aside 300 + form `w-px flex-[1_0_0]`, cap 720 | 1 | 1 |
| Body column gap | 64 (`desktop:gap-16`) | 48 (`gap-12`) | 48 |
| Field grid | 2 columns, gap-x 32 / gap-y 24 | 2 columns | 1 column |
| Group gap | 32 between groups, 24 inside | same | same |
| Aside | `sticky`, `top-198` | static block above form | static |

**Where 198 comes from:** `CompanyHero.tsx`'s own `pt-[198px]`, which its header records as
"the FIXED nav's clearance, identical at every tier". Same nav, same `<Nav models={models} />`
with no `spacer` prop, so the same number. Not re-derived. The aside's `top-[198px]` parks it
under the same bar.

### Typography

| Element | Family | Size | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|---|
| Hero eyebrow | sans | 14 | 500 | 1.3em | −0.02em | `muted` |
| Hero h1 | display | 48 / 48 / 44 | — | 1.1em | −0.05em | `paper-soft`, emphasis run `paper` |
| Group numeral | **mono** | 12 | — | — | — | `mark` |
| Group legend | sans | 14 | 500 | 1.3em | −0.02em | `ink` |
| "Optional" badge | sans | 12 | — | 1.3em | −0.02em | `muted` |
| Field label | sans | 14 | 500 | 1.3em | −0.02em | `muted` |
| Field value | sans | 16 | — | — | −0.02em | `ink` |
| Placeholder | sans | 16 | — | — | −0.02em | `muted` |
| Field error | sans | 12 | — | 1.4em | −0.02em | `ink` |
| Pill label | sans | 16 | — | 130% | −0.01em | `paper` on active / `muted` idle |
| Consent | sans | 12 | — | 1.5em | −0.02em | `muted` |
| Button label | sans | 16 | 500 | 1em | −0.01em | `paper` |
| Success h2 | display | 32 | — | 1.1em | −0.05em | `ink` |
| Aside label | sans | 14 | 500 | 1.3em | −0.02em | `muted` |
| Aside value | sans 16, **mono 15** for email + phone | | | 1.5em | −0.02em | `ink` |

The 48/44 display at −0.05em / 1.1em is **Footer's closing headline verbatim** — the nearest
thing on the site to this one (a short address to the reader, white on a dark ground). The
14 / 1.3em / −0.02em / medium / `muted` label is **Footer's group-title idiom**, reused for
every small label on the page.

### ⚠️ Mono has no Hebrew, and that constrains where it can appear

`--font-mono` is Fragment Mono. Its `@font-face` blocks in `src/app/fonts.css` declare
`unicode-range`s covering Latin, Greek and Cyrillic — **U+0590–05FF is not among them**. Hebrew
set in it silently falls back to the OS monospace, mid-line, next to Discovery.

So mono appears in exactly three places, all Latin-or-numeric in **both** locales:

- the group numerals `01`–`04`
- the aside's email address
- the aside's phone number

Everything else is `font-sans`, including `hoursValue`, which is `א׳–ה׳ · 09:00–18:00` in
Hebrew. **Do not unify these by pushing mono onto the other rows.** This page is also the first
use of `--font-mono` anywhere in the build; before it, the token was declared and unused.

### Color & surface

| Element | Property | Value |
|---|---|---|
| Hero band | background | `ink` |
| Body band | background | `paper` |
| Group / aside rule | border-top | `hairline` |
| Text input | border-bottom | `hairline` 2px → `ink` on focus |
| Textarea | border | `hairline` 1px, radius 6 → `ink` on focus |
| Pill idle | border | **literal `rgba(24,24,24,0.1)`** |
| Pill active | background | `ink`, label `paper` |
| Submit | background | `ink`, label `paper`, radius 6 |

No gradients. No shadows. **Zero new tokens** — nothing was added to
`docs/DESIGN-SYSTEM.md` or to the `@theme` block for this page.

The pill's idle border is the literal rgba and **not** the `hairline` token, because
`NewsBoard.tsx` inlines that exact value for the same control and `hairline` is a warm grey that
reads visibly different beside it.

### Interactive states

| Element | Hover | Focus-visible | Active | Disabled | Transition |
|---|---|---|---|---|---|
| Text input | — | underline `hairline` → `ink` | — | — | `border-color` 300ms `--ease-rogo` |
| Textarea | — | border → `ink` | — | — | same |
| Pill | border + label → `ink` | 2px `forest` ring, 2px `paper` offset | selected = filled `ink` | — | `colors` 300ms |
| Submit | `opacity-90` | 2px `ink` ring, 2px `paper` offset | `opacity-80` | `opacity-50`, `not-allowed` | `opacity` 300ms |
| Aside link | `ink` → `muted` | 2px `forest` ring | — | — | `color` 300ms |

The underline **is** the text inputs' focus affordance — no ring. It is `border-b-2` in both
states with only the colour changing: a 1px rule thickening to 2px moves the text inside a
fixed-height box, which reads as a jitter on every focus.

### Motion

Nothing animates on entry, on scroll or on mount. Every transition is a 300ms
`var(--ease-rogo)` colour or opacity change on a state the user caused. **`prefers-reduced-motion`
therefore needs no special handling** — `globals.css:645-654` clamps all durations to zero and
the base state of every element here IS the shipped design, so the clamp is an exact no-op. No
`gsap`, no `framer-motion`.

### Responsive behavior

- **≥1200** — two columns; aside 300px and sticky at `top-198`; form capped at 720; fields in a
  2-up grid; submit is content-width.
- **810–1199** — one column, aside above the form; fields still 2-up; submit content-width.
- **≤809** — one column; fields 1-up; submit full width; gutters 16.

---

## Tokens used

`ink` · `paper` · `paper-soft` · `muted` · `mark` · `hairline` · `forest` (focus rings only) ·
`--container-max` · `--measure` · `--font-sans` · `--font-display` · `--font-mono` ·
`--ease-rogo` · `tablet:` / `desktop:` breakpoints.

## Documented deviations

| Property | System / reference would give | This page does | Why |
|---|---|---|---|
| Submit button | reference: violet gradient, pill radius, 56px | `bg-ink`, radius 6, h-11 | No blue exists in this build and the home page is stated monochrome. This is /product's and /company's own primary button. |
| Inputs | reference: filled grey, radius 12 | transparent, 2px bottom rule, square | `--radius-none: 0px` is this system's default and there are no filled input surfaces anywhere in it. |
| Form container | reference: bordered card, radius 16, padding 40 | no card; four hairline-ruled groups | Rules rather than boxes is what this site does with a list of things (Footer's divider, /product's row rules). |
| Error state | a red | `ink` underline + message + `aria-invalid` | There is no red token. The two semantic colours the system ever had (`quote-up`/`quote-down`) were deleted 2026-08-08 for being dead tokens. WCAG 1.4.1 is met by the message, not the rule. |
| Consent line | reference links Privacy + Terms | plain text, no links | `/privacy` and `/terms` are two of the eight dead footer links in this build. Two known 404s inside a legal sentence is worse than no link. **Open question.** |
| `mark` on numerals | fails AA (3.41:1 on paper) | kept | `aria-hidden`, names nothing, restates the visible order of four groups. Same logotype-grey exemption /clix's logo grid takes. Every *informational* small grey on the page is `muted` (4.74:1). |
| Hero `text-muted` on `ink` | fails AA (3.85:1) | kept | Pre-existing open item on four other routes. Used for a 6-character eyebrow that duplicates the h1 below it. Not a new deviation. |

---

## The delivery pipeline

⚠️ **Called "the email pipeline" until 2026-08-18, when it stopped being only email.**

`POST /api/contact` — the project's **second** route handler (`api/models` says in its own
header that it is the only one; that is now out of date).

### Two channels (2026-08-18)

| Channel | Switched on by | What it does |
|---|---|---|
| `gmail` | `CONTACT_GMAIL` **not** `"off"` | The notification mail to `info@clix-solution.com`. |
| `n8n` | `N8N_WEBHOOK_URL` set | POST to the n8n workflow that files the lead in the CRM and opens a WhatsApp thread with them. |

- **They run concurrently** (`Promise.allSettled`) and share no state. Serialising them would
  put an SMTP round trip in front of the webhook for nothing.
- **A failure in ANY enabled channel fails the whole request** — 500, and the visitor sees
  `errors.failed`. Chosen by the user 2026-08-18 over the more forgiving "succeed if anything
  got through". ⚠️ **The known cost, stated rather than discovered later:** with both channels
  live, a flaky webhook shows an error for a submission whose email *did* arrive, and the
  visitor may send it twice. Accepted because the alternative — a green tick when the CRM never
  heard about the lead — loses the enquiry silently. A partial delivery is logged as such,
  naming which channel accepted it, so it is findable afterwards.
- **No channel enabled = 500**, not a quiet `{ok:true}`. Validating a submission and dropping it
  is the exact failure this route was written to prevent.
- **`CONTACT_GMAIL=off` is a switch, not a state.** Set on 2026-08-18 so the n8n path could be
  tested without mailing the business, and **removed the same day — both channels are on.** Any
  value other than `off` leaves Gmail enabled, so a typo fails towards sending. It must never be
  set in Vercel.
- **Webhook auth:** the secret travels as `x-clix-token` and is checked by the
  `Clix Website Form Token` Header Auth credential on the node. Without `N8N_WEBHOOK_SECRET` the
  URL is the only secret and anyone who ever sees it can inject leads into the CRM.
- **10s timeout** (`AbortSignal.timeout`). The node responds "Immediately", so slow means broken.
- **The n8n payload is structured, not the composed mail.** Ids **and** labels: ids are the
  stable contract a workflow branches on, labels save it restating the route's vocabulary.
  Optional text fields are `null`, not `""`, so an empty company is absent in the CRM.
- ⚠️ **`phoneE164` NEVER GUESSES A COUNTRY CODE.** Formatting is stripped and a typed `+` is
  kept; a bare `050 000 0000` is sent as `0500000000`, un-prefixed. Deciding that means `+972`
  would silently mangle every non-Israeli lead. `phone` as-typed is always in the payload
  alongside it, and resolving national numbers is n8n's job, where the rule is visible.

### The n8n side

Workflow **`Clix Main Website - Form Submit`** (`J1UDMNjKeiaQs7AD`), tag `clixsolutions`, on
`n8n.srv1135333.hstgr.cloud`. As received it was **GET, unauthenticated and inactive** — all
three of which reject a POST from this route. Set to **POST + Header Auth + active** on
2026-08-18. It has **no downstream nodes yet**: it receives, and the execution log is where the
real payload shape gets read before CRM and WhatsApp are built against it.

⚠️ **An inactive workflow's production URL 404s.** If every submission starts failing with
`n8n webhook responded 404`, that is the first thing to check.

- **Recipient: `info@clix-solution.com`, one address.** The user first named two
  (`ido.team@` and `info@`) then narrowed it to `info@` only, 2026-08-13. Overridable with
  `CONTACT_TO`.
- **Channel: Gmail SMTP via nodemailer**, chosen by the user over an n8n webhook and over a
  transactional provider. `nodemailer` is **the first runtime dependency this project has ever
  added** — five to six. Justified: the user picked SMTP and Node cannot speak SMTP without a
  client. Server-only; reaches no browser bundle.
- **Sending mailbox: `office@clix-solution.com`** — a Google Workspace account, already
  provisioned in this repo's `.env` before the form existed. Not the `clixteam579@gmail.com`
  originally assumed.
- **Env, two accepted names per value.** `GMAIL_EMAIL` / `GMAIL_PASSWORD` (what `.env` already
  had) are read first, then `GMAIL_USER` / `GMAIL_APP_PASSWORD` (nodemailer's and Google's own
  vocabulary, what any deployment guide writes). Reading both means the existing `.env` works
  untouched and a from-documentation deploy also works.
- **`From` is the authenticated mailbox, always.** Gmail rewrites or rejects a `From` it does
  not own, so the visitor's address goes in **`Reply-To`** — which is what makes hitting reply
  work.
- **Validation is duplicated** in `ContactForm.tsx` and in the route, deliberately: the client
  copy saves a round trip, the server copy is the boundary. Bounds live in one `LIMITS` block in
  each file. **Required: name, email, phone, message.** ⚠️ **`phone` was added 2026-08-18 and
  DEPARTS FROM THE REFERENCE, which collects four fields and requires three.** It is not a
  design decision — the n8n workflow cannot open a WhatsApp thread without a number. The user
  chose required over optional knowing it costs the visitors who will not give one.
  Validation mirrors the email posture: an allowed character set (`+()-.` , space, digits) and a
  **digit count of 7–20**, counted after stripping formatting, so `+972 (50) 000-0000` passes.
  Nothing stricter — every country writes numbers differently and only messaging one settles it.
- **Both option vocabularies are re-declared in the route** rather than imported from the
  dictionary. A locale file is copy; this is an allow-list at a trust boundary, and the two
  should not be able to widen each other. **Adding an option means editing both.**
- **Honeypot** — an `sr-only`, `aria-hidden`, `tabIndex={-1}` input named `website`. A filled
  one answers **200 and sends nothing**: a bot that learns which requests get rejected learns
  how to pass.
- **Rate limit** — 3 per 10 min per IP, in-process, **best effort and documented as such**. Each
  serverless instance has its own module scope, so a cold start resets it. Anything stronger
  means Redis, i.e. infrastructure.
- **HTML escaping on every interpolated value.** The body is concatenated from what a stranger
  typed and rendered by a client that runs HTML; unescaped, a `message` full of markup becomes a
  phishing link wearing the company's own notification email as a costume.
- **CRLF stripped from `subject` and `replyTo`.** Headers are newline-delimited, so a name of
  `Bob\nBcc: …` would otherwise add a recipient nobody chose.
- **Transport errors never reach the browser** — they can carry the SMTP dialogue and the
  credential state. `console.error` server-side, one generic sentence to the visitor.
- **Not built, on purpose:** no captcha (a tax on every real visitor), no database (the inbox is
  the record), no autoresponder (a second deliverability problem nobody asked for).

---

## Accessibility

- Real `<label htmlFor>` on all five text controls; the textarea's is `sr-only` because the
  group legend is its visible name.
- Required fields: `required` + a decorative `*` + an `sr-only` "(required)".
- Errors: `aria-invalid`, `aria-describedby` to the message, focus moved to the first bad field
  on submit.
- Needs group: `role="group"` + `aria-labelledby` the visible legend + an `sr-only` hint;
  `aria-pressed` per pill (multi-select — the reference's own semantics).
- Budget group: `role="radiogroup"` + `role="radio"` + `aria-checked`, **one tab stop** via
  roving `tabIndex`, arrow keys move and select. **Horizontal arrows respect direction** via
  `useDirSign()` — in Hebrew ArrowRight walks backwards through the array, which is forwards on
  screen.
- Whole-form failure is `role="alert" aria-live="assertive"`, always mounted so the region
  exists before it has anything to say.
- Success panel is `role="status" aria-live="polite"` with `tabIndex={-1}` and focus placed on
  it — the form leaves the DOM, so focus would otherwise fall to `<body>`.
- Contrast measured with `node docs/reference/contrast-check.js`: `muted` on `paper` 4.74:1
  (AA), `ink` on `paper` 18.26:1 (AAA), `mark` on `paper` **3.41:1 (fails)** — which is why
  placeholders and the "Optional" badge were moved off `mark` onto `muted`.

---

## Acceptance checklist

- [x] `npm run build` clean — 20 static routes + `/api/contact` dynamic
- [x] `npm run lint` — no new findings (7 errors + 1 warning are all pre-existing at HEAD:
      `docs/reference/*.js` `require()` imports and `ClixHero`'s ref-during-render)
- [x] `tsc --noEmit` clean; Hebrew dictionary satisfies the English shape
- [x] Both routes return 200
- [x] API: 415 on wrong content-type, 400 on malformed JSON, 400 + per-field map on invalid,
      200-and-drop on honeypot, 429 + `Retry-After` past the rate limit
- [x] Gmail SMTP credential verified by an `AUTH`-only handshake (no mail sent)
- [x] One real end-to-end send confirmed `{"ok":true}`, addressed to `office@clix-solution.com`
- [x] Spacing / type / colour from tokens, or the deviation is in the table above
- [x] All interactive states implemented
- [x] `prefers-reduced-motion` respected — **no longer vacuously.** The page now has motion, and
      every `animation:` is authored inside `@media (prefers-reduced-motion: no-preference)`
      rather than authored and then clamped. ⚠️ The global clamp does NOT zero `animation-delay`,
      so a staggered entrance outside that block would hold an element blank for its delay and
      then snap. Transform hovers carry their own `motion-reduce:` escapes, and the JS
      `scrollIntoView` reads the media query directly because the global `scroll-behavior`
      override does not reach a JS `behavior` option. **Not yet confirmed in a browser.**
- [x] **Two new design tokens** — `--color-signal` `#0e6472`, `--color-alert` `#b42318`. Declared
      in `globals.css` with a full set justification and documented in `docs/DESIGN-SYSTEM.md`.
      (This line read "Zero new design tokens" until 2026-08-17; the user lifted that constraint.)
- [x] `shadow-float` reused — third use on the site, and the first RESTING one
- [x] Contrast re-checked on every new pairing with `docs/reference/contrast-check.js`
- [ ] **Visual check at 1600 / 1440 / 1024 / 390 — STILL NOT DONE after the 2026-08-17 redesign.**
      Rendered HTML was inspected for the 1px-form landmine (clean) but nothing has been *seen*.
- [ ] **Hebrew RTL mirroring not visually checked** — logical properties throughout (`ms-auto`,
      `border-s-2`, `justify-between`), `dir="rtl"` and all new strings confirmed present in the
      served HTML, and `.contact-progress` flips its `transform-origin`. Still unseen.
- [ ] **Keyboard walk-through not performed in a browser** — semantics are in place, unverified
- [ ] Deployed send to the real recipient not attempted (needs the Vercel env vars)

## Open questions

- [ ] **Consent line links.** Ships as plain text. Linking Privacy and Terms means either
      creating those two routes or accepting two 404s in a legal sentence.
- [ ] **`/news` CTA.** Its label still reads "Contact Media Team" and it was a `mailto:` to
      `clixteam579@gmail.com`. The user asked for every CTA to reach `/contact`, so it does. If
      press wants its own inbox, that one href reverts and nothing else changes.
- [ ] **`/clix` hero** now leaves the page for `/contact` instead of scrolling to its own
      `#clix-contact` band. The band stays and its button also goes to `/contact`.
- [x] **The footer's closing CTA on `/contact` links to the page you are already on.** ⚠️ **CLOSED
      2026-08-17 — this is resolved, not outstanding.** It was left alone on the grounds that
      special-casing a component every route renders was worse than the redundancy. The user
      disagreed: *"move it down, remove the cta, since you are already in the cta page."* `Footer`
      gained an optional `closing` node prop; `ContactRoute` passes `<ContactChannels />`, so on
      this route the reiteration block is the four contact channels and the self-linking button is
      gone. Six other routes are untouched and pass nothing.
- [ ] **`id="contact"` on `<footer>` is now unreferenced.** Kept — it costs nothing and is the
      kind of thing linked from outside the codebase.
- [x] **The budget ladder has a gap** (`up to ₪10k`, then `₪15k–₪25k`). ⚠️ **RAISED WITH THE USER
      2026-08-17 AND DECLINED — this is closed, not open.** A visitor whose real budget is ₪12k has
      no truthful band and, budget being optional, will likely skip the question. The user chose to
      keep the ladder as the business advertises it.
- [x] **Group order.** ⚠️ **RAISED 2026-08-17 AND DECLINED.** Review argued that asking budget
      BEFORE the brief extracts a money commitment before the visitor has invested anything, and
      recommended moving the brief up. The user chose to keep the reference's own order.
- [ ] Whether the sending mailbox should be `office@clix-solution.com` or a dedicated
      no-reply. Currently whatever `.env` holds.
- [x] **`CONTACT_GMAIL=off`.** ⚠️ **SET AND THEN REMOVED ON 2026-08-18 — this is closed.** It
      silenced mail for the afternoon while the webhook was tested; the user called time on the
      test the same day. Mail to `info@clix-solution.com` is on, SMTP auth re-verified without
      sending. Both channels now run. The switch remains available and **must never be set in
      Vercel**.
- [ ] **The phone field's alignment in Hebrew.** It carries `dir="ltr"`, which is necessary —
      `+` is bidi-neutral and RTL reordering moves it to the wrong end, turning the number into a
      different number. The side effect is that it left-aligns where its RTL neighbours are
      right-aligned. Unresolved by eye; needs the `/he/contact` visual pass.
- [ ] **Nobody has looked at the phone field in a browser.** Its grid placement (third cell, so
      the three required fields lead) is reasoned, not seen. Group 01 now holds five inputs in a
      two-column grid, which leaves one cell empty on the tablet/desktop tiers.
- [ ] **The n8n workflow has no downstream nodes.** CRM and WhatsApp are not built. Until they
      are, a submission's only destination is an execution record.
