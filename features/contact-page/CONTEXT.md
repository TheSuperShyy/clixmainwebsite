# Context: Contact page

Memory for this section. **Newest entry on top.** Append after every task — never rewrite past
entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold, with
no code scanning.

---

## Current state

`/contact` and `/he/contact` exist and are statically prerendered. **Redesigned 2026-08-17** —
a sparse dark hero, a `bone` band holding a sticky brief-rail and one white elevated form panel,
and a footer whose closing CTA is replaced by the four contact channels whose four groups read as numbered steps that visibly complete.
`--color-signal` teal for on-track, `--color-alert` red for wrong. The form POSTs to
`/api/contact`, which validates, drops honeypot hits, rate-limits, and then **delivers over two
independent channels (2026-08-18)**: the Gmail notification to `info@clix-solution.com`, and a
POST to the n8n workflow that will file the lead in the CRM and WhatsApp them. The form collects
a **required phone number** for that second channel. All eleven CTAs across the site point here.
Build, lint and typecheck are clean; the API's failure paths and success path were exercised over
HTTP, including two real end-to-end deliveries into n8n.

**Both channels are ON.** `CONTACT_GMAIL=off` was set for the afternoon of 2026-08-18 while the
webhook was tested, and **removed the same day** — mail to `info@clix-solution.com` is flowing
again and the SMTP credential was re-verified with an auth-only handshake. The switch still
exists for the next time it is wanted; setting it to `"off"` silences mail without touching
credentials or code.

**A consent checkbox gates the Send button as of 2026-08-18.** The form's legal sentence is no
longer static text: it is a checkbox label carrying live `/privacy` and `/terms` links, and Send
is `aria-disabled` (not `disabled` — see the newest log entry for why) until every required field
validates *and* the box is ticked. The API enforces it again.

**And the form is drafted to `sessionStorage` as it is typed**, because those two links are a way
out of a half-filled form. Restored through `useSyncExternalStore` — not an effect, which this
project's lint forbids and which would have broken hydration — and deleted the moment a send
succeeds.

**What is not done: nobody has looked at the page.** Still true after the redesign. Both routes
return 200 and the rendered HTML was inspected for the two known landmines — the 1px-wide form
(clean) and the Hebrew RTL markup (clean) — but there has been **no visual check at any width in
either language**, no browser keyboard walk-through. Handed to the user for exactly that.

**Status:** `review`
**Next action:** user opens `/contact` and `/he/contact` at 1600 / 1440 / 1024 / 390 and says
whether the redesign lands; then set the two env vars in the Vercel project settings so the
deployed form can send.
then set the two env vars in the Vercel project settings so the deployed form can send.

---

## Log

### 2026-08-18 — the form survives a trip to /privacy (sessionStorage draft)

**Trigger:** user, on reading the consent change — *"does the form get save to localstorage?
becase what if they put data then they click privacy and terms of use, then they go back"*.

**They were right, and the hole was one the consent checkbox had just opened.** The form was
plain `useState` with no persistence anywhere (the only storage in the codebase belongs to
`AccessibilityWidget` and `CookieBanner`). `AppLink` routes client-side, so clicking either new
consent link unmounted the form and lost every field. Before those links existed there was no
reason to leave this page half-filled; afterwards there were two, next to the one control a
visitor is *required* to touch.

**`sessionStorage`, chosen by the user over new-tab links.** Key `clix-contact-draft.v1`. It
holds a name, an email and a phone number on the page whose subject is a privacy policy, so:
per-tab, dies with the tab, unreadable by another tab, and **deleted outright the moment a
submission succeeds** (`writeDraft(null)` on the `res.ok` path — the only place it is cleared;
every other exit is the case it exists for). Not gated on the cookie banner: a draft of a form
the visitor is actively typing into is functional storage they initiated themselves — the
shopping-cart case — not analytics.

**⚠️ `useSyncExternalStore`, NOT `useState` + a read-on-mount effect, for two reasons, and the
second is the one that would have bitten.** `CookieBanner.tsx` records the first: this project's
lint runs the React Compiler rules and **`react-hooks/set-state-in-effect` rejects the
read-storage-into-state-on-mount idiom outright**. The second is hydration — `/contact` is
statically prerendered with EMPTY inputs, so `getServerSnapshot` returns null and the hydration
render sees an empty form that matches the markup exactly; React re-renders with the real
snapshot immediately afterwards and the draft appears. A lazy `useState` initialiser reading
storage would have filled every input during hydration and mismatched every one of them.

**⚠️ The snapshot is the RAW STRING, never a parsed object.** `getSnapshot` runs on every render
and must return something comparable by identity; a fresh object per call is the classic
infinite loop. Parsing happens once in a `useMemo` keyed on the string.

**Four `useState`s became one shadowed value**, which reads oddly and is not taste:
`restored` (from the store) is shadowed by `edited` (null until the visitor touches anything), so
a stored value can never overwrite something being typed and there is **no effect anywhere in the
restore path**. Every write goes through one `commit(patch)` that sets and stores together — a
field cannot be changed without being saved. Call sites updated: `setField`, the needs pills, the
budget radiogroup's click *and* arrow-key writers, and the consent checkbox.

**⚠️ A stored draft is UNTRUSTED INPUT.** `sessionStorage` is writable by anything on this origin,
including the visitor with devtools open, so `parseDraft` re-validates on the way out: strings
only, clamped to the same `LIMITS` the form validates against, `needs` filtered through
`NEED_ORDER` and `budget` through `BUDGET_ORDER` — the same closed vocabularies the API
allow-lists. A `needs` that is not an array would otherwise reach React state and break rendering
rather than be rejected at a boundary. Both accessors swallow throws: storage **throws** rather
than returning null when the browser refuses it (Safari private mode, partitioned storage), and
failing to remember a draft must never take the form down.

**Two deliberate exclusions.** The honeypot is not persisted — always empty for a human, and a
restored value would either do nothing or resurrect a false positive. `consentError` is not
persisted — a restored draft has not been submitted yet. **The consent tick IS persisted**, which
is the one judgement call: the likeliest reason to leave this page mid-form is to go and *read*
the two documents the tick is about, so making someone re-tick on the way back punishes exactly
the behaviour the links exist to encourage. Same tab, same session, their own action minutes
earlier — and the server still requires `consent === true` on every submission.

**One consequence worth knowing:** the key is not locale-scoped, so a draft started on `/contact`
restores on `/he/contact`. Judged desirable — it is the same person and the same enquiry — but
it is a decision, not an accident.

**Verified by the user** in the browser: fills, follows a consent link, comes back, everything
restored.

**Status:** `review`
**Next action:** unchanged — the visual pass at 1600 / 1440 / 1024 / 390 in both languages.

### 2026-08-18 — the consent line became a checkbox, and Send is gated on it

**Trigger:** user — *"in the contact form there should be a checkbox that they check before they
can submit the form, the button should be disabled"*, with the reference's Hebrew consent row as
the screenshot.

**This closes an open question and reverses the reason behind it.** `en/contact.ts` carried a ⚠️
saying the sentence was one unlinked string because "/privacy and /terms are two of the eight
footer links this build does not have a route for, and two known 404s inside a legal sentence is
worse than no link at all". Both routes were built on 2026-08-16. The reference's two links are
therefore reproduced, and that comment is rewritten rather than left to mislead.

**⚠️ THE SENTENCE IS ONE TEMPLATE PER LOCALE, NOT FIVE RUNS, AND THE PLACEHOLDER ORDER IS THE
LOCALE'S OWN.** English names the privacy policy first; the reference's Hebrew names תנאי השימוש
first, and its whole sentence is a different one — a first-person acknowledgement ("אני מאשר/ת")
with a clause about keeping the details on file, not a statement about what sending does. A
lead/middle/tail split would have hard-coded English's word order into both files. So each locale
holds one string with `{privacy}` and `{terms}` tokens and places them where its own grammar
wants them. New keys: `consent` (rewritten), `consentPrivacy`, `consentTerms`,
`errors.consentRequired`.

`ContactForm.tsx` splits on `/(\{privacy\}|\{terms\})/` — a **capturing** group, so the
tokens survive into the output array — and maps them to `AppLink`, which prefixes the locale, so
`/he/contact` links to `/he/privacy`. Deliberately **not** `interpolate()`: that helper fills the
same `{…}` convention and is what the live regions use, but it returns a string and these two
runs have to be anchors.

**⚠️ THE LABEL IS NOT A `<label>`, AND MUST NOT BECOME ONE.** A `<label>` wrapping an anchor
toggles the control when the anchor is clicked, so a visitor going to read the privacy policy
would tick the consent box on their way out. The input is named by `aria-labelledby` pointing at
the sentence instead. The cost is real and is accepted: clicking the text no longer ticks the
box. Native `<input type="checkbox">` with `accent-ink` rather than a hand-built control — it
already has a correct focus ring, hit target and announcement in every assistive tech, and
repainting it would cost all three to gain a tick mark of our own drawing.

**⚠️ TWO KINDS OF DISABLED ON THE SUBMIT BUTTON, AND THE SPLIT IS THE WHOLE DESIGN.**

| | attribute | when |
|---|---|---|
| in flight | real `disabled` | genuinely inert — nothing to say until the request returns |
| incomplete | `aria-disabled` + the same styling | looks and announces disabled, still focusable, still fires |

The user chose "checkbox **and** whole form valid" over "checkbox only" when asked. A hard
`disabled` for that state would take the button out of the tab order and leave someone who
mistyped their email with a dead control, no message and no way to ask what was wrong — which is
precisely the failure the existing focus-the-first-bad-field path was built to prevent. With
`aria-disabled` the click still reaches `onSubmit`, which highlights every bad field, speaks the
summary through the always-mounted alert region, and moves focus. The checkbox is that walk's
**fallback target**, not a case of its own: it sits below all six fields, so it is the first bad
thing only when every field passed.

**The gate is `validate()` re-run at render**, not the `steps` array. `steps` is display state
for the progress chips and says so in its own comment; re-running the real rules is what
guarantees the button and the submit path cannot disagree. It costs a handful of length checks
and two regexes per render. **`needs` and `budget` stay optional** — exactly as `validate()` has
always had them — so the four required fields plus the tick are what enable Send.

**Server side.** `api/contact/route.ts` rejects `body.consent !== true` with the existing 400
shape; strictly `true`, so a string, a `0` or an absent key are all refusals. `consent` is not one
of the six `FieldKey`s, so the client's 400 handler filters it out and shows the whole-form
summary — which is right, since there is no text input to hang a message under. The flag also
rides in the n8n payload beside `submittedAt`, so the CRM row can answer "did they accept, and
when" from itself.

**Not looked at.** No browser has rendered this. Worth a specific look: the checkbox's alignment
against the first line of the sentence (`mt-0.5` against an 18px line box on a 16px control) and
the Hebrew row, where the box sits on the right and the two links are mid-sentence.

**Status:** `review`
**Next action:** user opens `/contact` and `/he/contact`, ticks and un-ticks, clicks Send while
incomplete, and confirms the links do not toggle the box.

### 2026-08-18 — n8n webhook added as a second channel; Gmail temporarily off

> ⚠️ **FOLLOW-UP, SAME DAY — the "temporarily off" in this heading lasted one afternoon.** The
> user called time on the test once the webhook was proven end to end: `CONTACT_GMAIL=off` was
> removed from `.env`, so **both channels are now live**. The SMTP credential was re-verified
> with an AUTH-only handshake (`transporter.verify()`) and **no message was sent** — the real
> send is the user's to make. Everything below stands as the record of how it was built; only
> the switch's position changed. The "Open" list at the end of this entry is superseded on that
> one point.

**What changed.** `/api/contact` stopped being a mail route and became a delivery route with
**two independent channels**, each gated by its own environment and run concurrently with
`Promise.allSettled`:

- `gmail` — the existing notification mail. On unless `CONTACT_GMAIL="off"`.
- `n8n` — POST to the workflow that will file the lead in the CRM and open a WhatsApp thread.
  On when `N8N_WEBHOOK_URL` is set.

The form gained a **required `phone` field**, which is the reason the phone-shaped parts of this
exist at all: the workflow cannot WhatsApp a lead without a number.

**Decisions and their reasons**

- **Both channels permanently, not a migration.** The user's words: n8n is there "to put the
  lead to our crm and message them thru whatsapp" — the mail is still wanted as the human
  notification. A fan-out, not a swap.
- **Any enabled channel failing fails the request.** Chosen by the user over "succeed if either
  worked". The cost was stated at design time: a flaky webhook will error on a submission whose
  mail arrived. A partial delivery logs which channel *did* accept it, so the duplicate lead is
  findable afterwards.
- **No channel enabled → 500.** A route that validates and then drops the submission is the
  exact failure the original header set out to prevent.
- **`CONTACT_GMAIL=off` rather than commented-out code.** An env line reverts by deletion;
  commented-out code gets un-commented wrong. Any value but `off` leaves mail enabled, so a typo
  fails towards sending.
- **`phone` required, not optional.** Both were offered; the user picked required, knowing it
  costs the visitors who will not give a number.
- **`phone` is the THIRD cell of group 01, not the last.** The grid fills across, so this keeps
  the three required fields in the first three cells. Appending it would have put a required
  field below two optional ones.
- ⚠️ **`phoneE164` does not guess a country code.** Formatting stripped, a typed `+` kept, and a
  bare `050 000 0000` goes out as `0500000000`. Assuming `+972` silently mangles every
  non-Israeli lead. `phone` as-typed always travels alongside; n8n resolves it where the rule is
  visible and fixable. **Verified in a real execution.**
- **`dir="ltr"` on the phone input.** `+` is bidi-neutral, so inside the Hebrew page's RTL flow
  the browser moves it to the wrong end — rendering a number that reads as a different number.
  The side effect (left alignment among right-aligned neighbours) is the lesser problem and is
  logged as an open question rather than guessed at.
- **Validation mirrors the email posture:** an allowed character set plus a **7–20 digit** count
  taken after stripping formatting, so `+972 (50) 000-0000` passes. Not libphonenumber — the
  same reasoning that keeps `EMAIL_RE` permissive.
- **The secret travels in a header, not the URL.** `x-clix-token`, checked by a Header Auth
  credential. Without it anyone who ever sees the URL can inject leads into the CRM.
- **Both dictionaries' `panel.intro` changed 3 → 4 required fields.** A form that miscounts its
  own obligations is worse than one that says nothing.

**The n8n side (changed on the live instance, with the user's approval)**

Workflow `Clix Main Website - Form Submit` (`J1UDMNjKeiaQs7AD`) on `n8n.srv1135333.hstgr.cloud`.
⚠️ **As received it would have rejected every submission on three separate counts:** `httpMethod`
unset so it defaulted to **GET**, authentication **None**, and the workflow **inactive** — and an
inactive workflow's production URL 404s outright. Now POST + Header Auth (credential
`Clix Website Form Token`, `MrKGlGklwgxteywu`) + active. **No downstream nodes yet, by choice:**
the execution log is where the real payload shape gets read before CRM and WhatsApp are built
against a guess.

**Verification performed**

- `npx tsc --noEmit` — clean. First run failed: `payload` collided with the parsed request body
  already bound at the top of the handler; the webhook one is now `webhookPayload`.
- `npm run build` — clean, 26 routes, `/api/contact` still the one dynamic route.
- `npm run lint` — 7 errors + 1 warning, **all pre-existing at HEAD**, none in a touched file.
- Against the webhook directly: GET → 404, POST with no token → 403, wrong token → 403, correct
  token → 200.
- Over HTTP against the dev server: 415 on a non-JSON content-type; 400 listing
  `name/email/phone/message` on an empty body; 400 `phone: required` when only phone is missing;
  400 `phone: invalid` for letters, for 2 digits and for 22 digits; 200 for `+972 (50) 000-0000`;
  200-and-drop on a filled honeypot; 429 on the 4th request in the window.
- **End to end:** two submissions arrived as n8n executions `459525` and `459526`, payload intact
  — ids and labels, `locale` as an id, `phone` and `phoneE164` both present.
- **Failure paths, forced:** a deliberately wrong secret produced `403 Authorization data is
  wrong!` in the server log and `Could not send the message.` to the client; unsetting the
  webhook URL with Gmail off produced the "every channel is disabled" log and
  `Contact delivery is not configured.` `.env` was restored and re-verified with a 200 after.
- ⚠️ **NO MAIL WAS SENT AT ANY POINT.** A grep for gmail/sendMail activity across the whole dev
  log returns 0 — which is what `CONTACT_GMAIL=off` is for.
- ⚠️ **The running dev server was restarted** (PID 9048, port 3001, brought back on the same
  port). It predated the `.env` edit, and with stale env a valid submission would have sent a
  real email.

**Open**

- **Nobody has looked at the phone field in a browser**, in either language. Group 01 now holds
  five inputs in a two-column grid, which leaves one cell empty.
- **`CONTACT_GMAIL=off` is still set** — the business is receiving no notification mail, and
  every enquiry exists only as an n8n execution.
- The n8n workflow still does nothing with what it receives.



### 2026-08-17 (second pass) — the channels moved to the footer and the closing CTA went

**Why.** The footer's reiteration block ends every page with "Software that works, results that
speak." over a `Let's start` button — and that button points at `/contact`, so on `/contact` it
pointed at the page you were already reading. `FEATURE.md` had carried this as an open question
since 2026-08-13, left alone on the grounds that special-casing a component seven routes render
was worse than the redundancy. The user closed it on sight of the band:
*"move it down, remove the cta, since you are already in the cta page."*

**Done**
- `Footer` gained an optional **`closing?: ReactNode`** prop. When passed, it replaces the
  reiteration block; the divider, link row and copyright below are untouched.
- `ContactRoute` passes `<ContactChannels />`. The other six routes pass nothing and render
  byte-identically to before.
- `ContactHero` lost the channel grid it had gained hours earlier and is back to eyebrow +
  headline in a `gap-4` column.

**Decisions**
- **The prop takes a NODE, not a `variant="contact"` or a route name.** `Footer` must not learn
  what `/contact` is — that would put a page's concern inside a component shared by seven routes,
  and the next such request would add a second. The knowledge stays at the call site.
- **`pt-14` is repeated on the replacement wrapper rather than left to the caller.** That inset is
  what the container's `gap-14` measures from, so anything at a different padding would land the
  divider at a different distance than on every other route.
- ⚠️ **The hero is now deliberately sparse again** — 198px of `ink` holding two lines, which is
  precisely what the earlier redesign review called "the emptiest hero on the site". The trade was
  made knowingly and with the concern stated: the channels do more work ending a ~1400px form than
  decorating its top. **Do not "fix" this by inventing filler for the band.**
- ⚠️ **A JSDoc gotcha, recorded because it cost a build:** writing `**/contact**` for emphasis
  inside a `/** */` block terminates the comment — `*/` is `*/` wherever it appears. Use backticks.

**Not done**
- Still no visual check at any width in either language. Unchanged from the first pass.

### 2026-08-17 — full visual redesign in `/company` Block 3's language

**Why.** The page shipped 2026-08-13 and nobody ever looked at it. A look found: five identical
`border-t hairline pt-8` blocks stacked ~1400px tall; the `01`–`04` numerals set 12px `text-mark`
(3.41:1, doing no visual work at all); no progress or completion signal of any kind; the aside
weightless at 300px beside the form and leaving ~196px of dead gutter at desktop; and the site's
terminal CTA rendered `tablet:w-min` — the smallest element in its own column.

**The user lifted all four constraints `FEATURE.md` recorded as deliberate here** — motion, an
accent colour, elevation/a surface tone, and a red for errors — and asked for `/company` Block 3's
visual language. Two things were raised and **declined**; see Decisions.

**Done**
- Two new tokens, `--color-signal` `#0e6472` and `--color-alert` `#b42318`, with a full
  set-justification block in `globals.css` and a section in `docs/DESIGN-SYSTEM.md`.
- `ContactAside.tsx` → **renamed `ContactChannels.tsx`**, now a 1/2/4-up ruled grid on `ink`.
  It went into the hero first and then, the same day on the user's call, down into the **footer**
  — see "Second pass" below.
- `ContactForm.tsx` now owns **both columns**: a sticky brief-rail and the form panel.
- `ContactBody.tsx` → `bg-bone`; it is just the band now.
- New `contactGlyphs.tsx` — `CheckGlyph` and `AlertGlyph`, drawn on `serviceGlyphs.tsx`'s grid.
- Three keyframes + a `.contact-progress` transform-origin pair in `globals.css`.
- Four new dictionary keys in both locales (`panel.{title,intro,reply}`, `a11y.{needsCount,charsLeft}`).

**Measurements that decided the design**

| Pair | Ratio | |
|---|---|---|
| `signal` on `paper` / `bone` | 6.81 / 6.09 | AA |
| `alert` on `paper` / `bone` | 6.57 / 5.88 | AA |
| **`muted` `#737373` on `bone`** | **4.24:1** | **fails AA** |
| **`mark` `#8b8b8b` on `bone`** | **3.05:1** | fails, worse than its 3.41 on white |

The `muted` failure is what forced the layout: every label, placeholder, hint and the consent line
on this form is `muted`, so the form could not be tinted. The **band** takes the tint and the form
stays white — `/company`'s own white-cards-on-`bone` answer. **Rule: on `bone`, only `ink` and
`ink-soft`.** The rail's intro is `ink-soft` (10.49:1) for exactly this reason.

⚠️ **Pre-existing failure found and NOT fixed:** `/company` Block 3's intro is `muted` on `bone`
at 16/18px — 4.24:1 on a shipping page. Out of scope here; recorded in `DESIGN-SYSTEM.md` so it is
not re-discovered as new.

**Decisions**
- **`signal` is a teal, not a green, and that is CVD reasoning not taste.** Green-complete against
  red-invalid is the obvious pairing and the one that collapses under deuteranopia/protanopia
  (~8% of male visitors) — on a page whose whole new state language is those two colours.
- **Rejected reusing `--color-svc-1` `#0f6b63`** (6.36:1), which would have added zero new hues.
  A service accent and a form state colour are different things; coupling them means a retune of
  `/company`'s palette would silently move `/contact`'s focus rings.
- **No GSAP, and no animation library.** Every motion here is a one-shot mount reveal or a state
  transition — nothing scroll-driven, scrubbed or pinned, i.e. none of the four things GSAP is in
  this project for. `/company` Block 3, the band being matched, ships zero client JS.
- ⚠️ **The global reduced-motion clamp does not zero `animation-delay`.** Every reveal here is
  staggered and held at `opacity: 0` by `backwards` fill, so under the clamp alone a
  reduced-motion visitor would get a blank element for the length of its delay and then a snap —
  a timed flash of missing content, worse the further down the stagger. So **every `animation:`
  on this page is authored inside `@media (prefers-reduced-motion: no-preference)`** and is never
  built under reduce, the CSS equivalent of `gsap.matchMedia()`. **This is a latent gap in the
  global clamp, not a quirk of this page** — any future staggered CSS entrance in this repo hits it.
- **Step chip state is derived in JS, not from a `focus-within` variant.** Precedence is
  `invalid > complete > active > pending`; as CSS variants those are four independent rules whose
  winner depends on Tailwind's emission order, and the case that matters most is a group that is
  both focused and invalid.
- **The submit button stays `bg-ink`.** The restraint clause makes the accent a *state* channel;
  `ink` is this site's primary button on a light ground. Hover became a lift + `shadow-float`
  rather than `opacity-90` — dimming a black button is the weakest hover on the site. **No
  trailing arrow**, which avoids `rtl:-scale-x-100` mirroring entirely.
- **The `w-px flex-[1_0_0]` idiom is RETIRED here, not re-gated.** Its only purpose was to let a
  `max-w-[720px]` cap decide the column; there is no cap now — the panel is the space left over
  (~820px at 1280), which is what closes the 196px gutter. `w-full` ungated, `flex-1`/`min-w-0`
  gated to `desktop:`.
- **Sticky offset is now `calc(var(--nav-peak-h) + 16px)`** (131px), not the borrowed
  `top-[198px]`. 198 was the *hero's* padding; it cleared the banner but parked the rail 67px low.
- **Client-side validation failure now also sets `formError`.** The always-mounted alert region
  used to stay silent on the most common failure path, so a screen-reader user got a form that
  refused to submit with no spoken reason.
- **Counter a11y:** both visual counters are `aria-hidden`; the needs group gets one `sr-only`
  live region; **budget gets none** (a `radiogroup` already announces its checked radio, and
  "1 of 4" is meaningless for single-select); the textarea's region is silent until 200 characters
  remain and then reports the remainder **bucketed to the nearest 50** — at most four
  announcements over the whole tail instead of one per keystroke.
- **The needs pills gained a check glyph.** The two pill groups were pixel-identical despite one
  being multi-select and one single-select, so someone who had just picked three needs would try
  the same on budget and watch their first choice silently clear. Budget says "Choose one" in its
  state slot instead — promoting copy that was `sr-only` only.
- **Textarea 160px/`rows=6` → 120px/`rows=4`.** It was the tallest control on the page and asks
  for the least text: its own placeholder says "two honest sentences is plenty" and `messageMin`
  is ten characters.
- **The reply promise moved forward.** "We reply within one business day" existed only in
  `successBody` — i.e. the most reassuring line on the page was shown exclusively to people who
  had already been reassured enough to submit. Now in the rail and beside the button.
- **Hero eyebrow `muted` → `paper-soft`**, closing a documented AA failure (3.85 → 11.84). The
  same open item on the other four routes is untouched — they are clones and this is not.

**Raised with the user and DECLINED — decisions, not outstanding defects**
- **Group order stays `about → needs → budget → brief`.** Review argued budget-before-brief
  extracts a money commitment before the visitor has invested anything and recommended moving the
  brief up. The user chose to keep the reference's own order (`SOURCED`, `he/contact.ts`).
- **The ₪10k → ₪15k budget gap stays open.** A visitor with ₪12k has no truthful band and, budget
  being optional, will likely skip the question. The user chose to keep the ladder as the business
  advertises it — the reasoning already recorded in `he/contact.ts`.

**Not done**
- **Nobody has looked at the redesigned page either.** Build, lint, typecheck clean; both routes
  200; the rendered HTML was inspected for the 1px-form landmine (clean: `w-full` ungated) and for
  the Hebrew RTL markup (`dir="rtl"`, `ms-auto`, `border-s-2` all present). **No visual check at
  any width in either language.** Handed to the user.
- Consent-line links — still plain text, though `/privacy` and `/terms` now exist, so the blocker
  recorded in `en/contact.ts` is gone whenever it is wanted.
- Trust signals (logos, a named person, a "book 15 minutes" alternative beside a ten-decision
  form). Probably the highest-value future addition to this page; needs content that doesn't exist.


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
