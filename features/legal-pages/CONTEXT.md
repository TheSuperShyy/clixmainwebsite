# Context: the legal pages (/privacy, /terms, /accessibility)

Memory for this section. **Newest entry on top.** Append after every task — never rewrite past
entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold, with
no code scanning.

---
## 2026-08-17 — AccessiYes is the shipped widget

The user generated the embed at accessiyes.com → "Get installation code" (the non-WordPress
path; the WordPress install steps they were shown do not apply to a Next app) and pasted it.
AccessiYes is now the DEFAULT branch of `AccessibilityGate`; Sienna and the built-in widget stay
reachable by env var.

### The snippet, and the three things changed about it

The generator emits `window._cyA11yConfig = {...}` followed by an injected
`cdn-cookieyes.com/widgets/accessibility.js?id=<uuid>`. As shipped here:

1. **Config and injection stay in ONE inline script.** The widget reads `_cyA11yConfig` at
   startup — the same global the WordPress plugin sets via `wp_localize_script`. Split across two
   `<Script>` tags it becomes a race, because `next/script` does not order an inline tag against
   a `src` tag in the same strategy. Losing it means the widget boots on ITS defaults: bottom
   RIGHT, statement link pointing at the vendor.
2. **`position` is `bottom-left` on BOTH breakpoints.** The generator defaults to bottom-right.
   §04 declares "בצד שמאל של המסך" under תקנה 35 — right-hand placement makes a published
   declaration false.
3. **The statement URL is built from `location.origin` + `localeHref`, not hardcoded.** The
   generator emitted the literal `https://clix-solution.com/accessibility`, which would send
   every localhost and preview visitor to production, and every HEBREW visitor to the English
   statement. This is also what makes Sienna's `SiennaCustomize` DOM patch unnecessary here —
   unlike Sienna's dead `statement` option, AccessiYes's is real and wired.

### §04 rewritten a second time in one day

It described Sienna's controls. AccessiYes's are different, read from its own bundle: profiles
(epilepsy safe, low vision, ADHD), text (size, font weight, line height, letter spacing, text
align, dyslexia font, highlight titles/links), colour (high/dark/light contrast, high/low
saturation, monochrome), aids (big cursor, reading guide, pause animations, page read, mute
sounds). **Fewer profiles than Sienna, but it adds read-aloud and mute.**

⚠️ The lesson worth keeping: **swapping the widget is never just the gate.** §04 enumerates the
shipped controls, and both `AccessibilityGate.tsx` and the dictionary files now say so at the
point of use.

### Findings from the WordPress plugin, which is worth knowing exists

Downloaded and unpacked it to read the real embed. It does NOT use the CDN — it ships
`widget.min.js` (370 KB) inside the plugin and enqueues it locally, under **GPLv3**. So
self-hosting that exact file is a legitimate third option: same widget, no third-party CDN,
nothing that can change underneath, at the cost of manual updates. Offered to the user; not built.

Sienna's `.asw-*` skin and `SiennaCustomize.tsx` are left in place — they match nothing while
AccessiYes ships, which is harmless, and they are the skin for a branch still reachable.

Not built, not typechecked, not looked at. **The widget's actual appearance is unverified** —
it ships unskinned, at whatever size and colour AccessiYes chose.


## 2026-08-17 — AccessiYes wired, inert, pending a site ID

*"can you try to use this one instead https://www.accessiyes.com/"*. Wired as a third branch of
`AccessibilityGate`; it renders only once `NEXT_PUBLIC_ACCESSIYES_SITE_ID` is set, and until then
the gate falls through to Sienna so a button always exists (§04 declares one does).

### What it actually is — checked, not taken from the page

- **A WordPress plugin first.** 57 mentions of WordPress on the homepage, 20,000+ active installs.
  A generic `<script>` embed does exist — accessiyes.com uses it on its own site — but is NOT
  published: the snippet in their docs section is a placeholder pointing at
  `cdn.example.com/widget.js` with `data-id="YOUR_SITE_ID"`. The real one is behind
  "Get installation code".
- **The file served is `WebYes Accessibility Widget v2.0.0`, from `cdn-cookieyes.com`.**
  AccessiYes is the brand; WebYes/CookieYes is what loads.
- **370 KB, against Sienna's 66 KB** — 5.6× the payload for the same class of control.
- **No telemetry.** Its only outbound host in 370 KB is `cdn-cookieyes.com/widgets/fonts/`. That
  supports the "zero data collected" claim. (Their MARKETING site runs GTM; the widget does not.)
- **The `?id=` parameter is never parsed by the bundle** — no `searchParams.get("id")`, no settings
  fetch. It is a CDN tenant marker, not a licence check, so the widget would very likely render
  under any value. **Deliberately not shipped with the vendor's own ID**: that would put this
  site's accessibility control on another company's tenant, invisibly, until it broke.

### ⚠️ What a switch costs, all recorded in FEATURE.md

1. **§04 becomes wrong.** It was rewritten that morning to name Sienna and enumerate Sienna's
   controls, precisely because the user wanted the page to describe the real widget. It must be
   rewritten in the SAME change that flips the gate — it is a תקנה 35 declaration, not a
   feature list.
2. **The skin does not transfer.** `globals.css`'s `.asw-*` block and `SiennaCustomize.tsx` are
   Sienna class names and match nothing here, so AccessiYes renders unstyled and its statement
   link still points at the vendor. Both would need redoing.
3. `privacy` §05's third-party list would name `cdn-cookieyes.com` rather than jsDelivr.

Deliberately NOT done ahead of the user seeing it render: skinning, the statement repoint, and
the §04 rewrite. Three placements in one day is enough churn to justify looking before building.


## 2026-08-17 — Sienna's panel cut down from a full-height drawer

*"its too big, and taking lots of space"*. Sienna ships the panel as `width:500px; height:100%;
top:0` — a full-height drawer, i.e. a third of a 1440 viewport for a menu of toggles. It is now
a compact popover anchored above its own button: `340px` wide (capped at `100vw - 2rem`),
`height:auto`, `max-height: min(540px, 100vh - 7rem)`, at `bottom:84px; left:16px`.

**Repositioning is safe because the closed state is `display:none`, not a transform** — checked
in the bundle first. A transform-based drawer would have needed the hidden state re-derived.

**Overflow was already handled by Sienna**: `.asw-menu-content` is `overflow-y:auto; flex-grow:1`,
so capping the height scrolls the contents rather than clipping them. Nothing new was added.

`bottom: 84px` is arithmetic, not taste: the button's 52px + its 16px `data-offset` + a 16px gap.
⚠️ **If the button size or the offset changes, that number has to move with them.**

Everything else in the block is Sienna's internal spacing re-scaled from 500px to 340px — 70px
header to 52, 30px content padding to 14, 20/25px cards to 12, 1rem grid gap to 8, 34px tile
glyphs to 24, 14px labels to 12. Padding, gaps and glyph sizes only; no behaviour touched.

⚠️ Same standing risk as the rest of the skin: every selector is a third-party class on an
`@latest` script. An upstream rename reverts the panel to its 500px drawer silently.

Not looked at — the user's standing instruction. This one especially wants an eye on it, since
it is a dozen `!important` overrides against someone else's layout.


## 2026-08-17 — Sienna skinned, repointed, and §04 rewritten to describe it

Two instructions in one message: *"cant you understand that it has to be a thirdparty?"* and
*"make sure the accebilityy is connected to the accebility page, like the content of that"*.
Third-party stands — the built-in widget was NOT swapped back in, only kept behind
`NEXT_PUBLIC_A11Y_WIDGET=builtin` as the fallback.

Everything below was read out of the **published bundle, v2.2.333**, not from docs. Sienna's
own customize page 404s and its README lists position as a TODO, so the bundle is the only
accurate source.

### What is actually configurable

The auto-init reads exactly THREE data attributes — `lang`, `position`, `offset` — and ignores
every other key in its own defaults object. Set on the script tag: `data-position="bottom-left"`
(stated rather than inherited, because §04 DECLARES the position) and `data-offset="16,16"` (the
inset the built-in widget used, so the two are interchangeable). `lang` is deliberately OMITTED:
Sienna falls back to `document.documentElement.lang`, which this site already sets per locale,
and both `en` and `he` packs ship with the widget. Checked — 43 languages, Hebrew among them.

### What needed a DOM patch, and the cascade reason

`SiennaCustomize.tsx` rewrites two things after mount:

1. **The statement link.** Sienna's panel footer links to **its own** accessibility statement —
   a hardcoded literal. Its defaults contain a `statement` key with **no consumer anywhere in the
   bundle**, so the option is dead. The link now points at this site's `/accessibility`,
   locale-prefixed, with `target="_blank"` stripped since it is an internal page now. This is the
   "connected to the accessibility page" half of the instruction.
2. **The panel accent.** Sienna declares `--asw-primary` in its stylesheet AND re-sets it INLINE
   with `!important` when it builds the panel. Inline `!important` beats stylesheet `!important`
   from the same origin, so no rule in globals.css can reach it — only
   `style.setProperty(..., "important")` can. The BUTTON is different: `.asw-widget` gets no
   inline value, so it is skinned from globals.css normally. **Hence the split — CSS for the
   button, JS for the panel, same colour (#1b3a5f) in both. Change one, change the other.**

A `MutationObserver` drives it, because the panel is built lazily on first open rather than with
the button. It disconnects once both are patched; every lookup is optional-chained, so an
upstream rename degrades to "the link points back at Sienna" instead of throwing.

### §04 is no longer the live site's text

It was ported verbatim that morning and was false. It now describes the widget that actually
ships: profiles (seizure safe, blind, visually impaired, ADHD, cognitive/learning, motor),
content adjustments (size, letter spacing, line height, font weight, dyslexia font, highlight
titles/links), colour adjustments (high/dark/light contrast, high/low saturation, monochrome),
reading and navigation aids (big cursor, reading guide, stop animations, focus mode, hide images,
image tooltips, page structure, screen reader), one-click reset, and the statement link.
Persistence is claimed because it is real — `localStorage`, verified in the bundle.

⚠️ **§04 is now the first thing that goes stale if the widget is ever swapped or removed**, and
so are the two §03 bullets, which Sienna delivers rather than the site's markup. Both files say
so at the point of use. This is a declaration under תקנה 35, not a feature list.

### Findings worth keeping

- **No telemetry endpoint in the bundle.** The defaults carry `analyticsEnabled: true`, but no
  analytics URL exists in the code — it looks as dead as `statement`. Outbound requests are to
  jsDelivr for locale packs and a font.
- **The PDF Reader control posts to `lumiopdf.pages.dev`** — a SECOND third party, reached only
  if a visitor uses that one feature. Belongs in the privacy §05 note.
- The trigger is an `<a href="https://accessibility-widget.pages.dev" target="_blank">` with the
  click intercepted, so a middle-click leaves the site. Left alone; noted.

Not built, not typechecked, not looked at — standing instruction. **The skin in particular is
unverified against a rendered widget.**


## 2026-08-17 (final) — the plugin is Sienna, and it is free

"its paid, we should use some free one". UserWay's free tier no longer covers it, so the
integration written an hour earlier was deleted unused and replaced with **Sienna**
(github.com/bennyluk/Sienna-Accessibility-Widget) — one `<script>` from jsDelivr, MIT-licensed,
no account, no trial, no paywall on the core widget.

It satisfies both halves of the ask: it IS a real third-party plugin, which is what the boss
wanted, and it costs nothing. Two further reasons it is the right free one rather than merely a
free one:

- **Open source, so it can be vendored** into this repo if it is ever abandoned. A closed CDN
  script cannot be.
- **It makes no compliance CLAIM.** The paid overlays in this category are in trouble precisely
  for claiming WCAG conformance — accessiBe's $1M FTC order, UserWay's class action. A widget
  that only claims to be a widget cannot mis-sell anything.

`AccessibilityGate` now reads `NEXT_PUBLIC_A11Y_WIDGET`: unset (default) renders Sienna,
`builtin` renders ours. Exactly one, always.

⚠️ **Two things to close later, both in FEATURE.md:** the script is on `@latest`, so an upstream
release ships to production with no commit here — pin it once a version is confirmed good, which
also makes an SRI hash possible. And `privacy` §05 names the third-party processors; Sienna is
not among them and should be.

⚠️ Said to the user twice and recorded so it need not be said a third time: **an overlay is not
compliance.** תקנה 35 and ת״י 5568 are real; no widget discharges them. What would is fixing the
four things /accessibility still promises falsely.

Not built, not typechecked, and the widget's actual rendering is UNVERIFIED — the script URL is
Sienna's own documented one, but nobody here has watched it load.


## 2026-08-17 (latest) — UserWay integration added behind an env gate

The boss wants a bought plugin; the user relayed it and said to follow it. Researched the
category first and reported the finding plainly: the Israeli legal requirement is real, but a
widget is not what meets it, and this exact product category is under FTC/class-action pressure
(accessiBe $1M final order April 2025; UserWay class action July 2024; 1,000+ US suits in
2023–24 against sites that HAD a widget). The user reaffirmed. Built.

`UserWayWidget.tsx` injects the CDN script via `next/script` at `afterInteractive`.
`AccessibilityGate.tsx` picks it OR the built-in widget — never both.

**Why a gate and not a swap.** Two accessibility buttons on one page is worse than none, and
deleting the built-in one now would leave §04 declaring a button that does not exist for however
long it takes someone to paste an account ID into `.env`. The gate keeps a working button at
every point in the switchover. ⚠️ **The built-in widget is therefore NOT dead code.**

**It is inert until `NEXT_PUBLIC_USERWAY_ACCOUNT_ID` is set.** The key was appended to `.env`
(gitignored) with an empty value and a comment. An account ID can only come from a UserWay
signup — that part is the user's.

Open item for the lawyer, in FEATURE.md: `privacy` §05 names the third-party processors and
UserWay is not among them. Not edited — published legal text.

Not built, not typechecked — standing instruction.


## 2026-08-17 (later still) — floating bottom-left, closes on outside click

The footer placement lasted one look. The user asked for a floating icon in the BOTTOM-LEFT
corner that dismisses on an outside click, so the widget is out of `Footer.tsx` and back in both
layout shells.

Shape: one fixed stack at `bottom-4 left-4`, `flex-col-reverse` so the FIRST child sits in the
corner and the panel stacks ABOVE it — no absolute positioning, no measuring, and the panel grows
upward into free space instead of off the bottom of the screen. Icon-only trigger, so the
`aria-label` is back (the footer version dropped it because the visible text was the name).

**This placement is the one that agrees with the declaration.** §04 says "בצד שמאל של המסך" and
this is the left edge of the screen. It also silently fixed the /news gap the footer stop had
opened — the widget is layout-mounted again, so it is on every route.

⚠️ `left-4`, NOT `start-4`, and that stays load-bearing: §04 is written in Hebrew, where the
logical start edge is the RIGHT one, so a logical property would put the button on the opposite
side of the page describing its position.

### Outside-click: three decisions inside four lines

- **`pointerdown`, not `click`** — it fires before a link's own activation, so a tap on the page
  behind the panel dismisses AND does what it was aimed at, rather than spending one tap on
  dismissal.
- **Registered only while open** — which is also what stops it eating its own opening event. That
  event's `pointerdown` has already dispatched by the time the effect runs, so there is no
  open-then-immediately-close race and no `setTimeout` needed to dodge one.
- **Focus is NOT pulled back to the trigger**, unlike the Escape path. Escape is a keyboard
  dismissal and that user needs somewhere to land; a pointer dismissal has already put the user
  where they clicked.

Placement history for this control, all on one day: left edge (middle) -> footer Legal column ->
bottom-left corner. Only the last agrees with §04, so the statement needs no edit after all.

Not built, not typechecked, not looked at — the user's standing instruction.

## 2026-08-17 (earlier) — the widget moved into the footer

User: "put the accessibility button to the footer". Done. The trigger is now an inline item in
the footer's **Legal column**, styled like the links beside it (paper -> surface on the
capture's own .3s curve); only the PANEL stays `position: fixed`, centred with
`inset-x-0` + `mx-auto`.

**The panel HAS to stay fixed.** The footer's column div sets `overflow-hidden`, so an
absolutely-positioned popover would be clipped out of existence. Fixed elements escape overflow
clipping, and this footer has no transform/filter ancestor to turn into a containing block —
checked, not assumed.

Unmounted from both layout shells; mounted at `Footer.tsx` behind `group.titleIndex === 2`.

### ⚠️ Two regressions this move creates. Both reported to the user; neither is a mistake.

1. **/accessibility §04 now disagrees with the build again, in the opposite direction.** It says
   "בצד שמאל של המסך תמצאו כפתור נגישות" — left edge of the SCREEN. The button is at the bottom
   of the page instead. The widget was built that morning specifically to make that sentence
   true; it is now false on its position while true on its function. Either the sentence moves
   or the button does.
2. **/news has NO FOOTER** (`src/app/_routes/NewsRoute.tsx` is the one route file that does not
   import it), so the widget is absent from `/news` and `/he/news`. It was on every route while
   it lived in the layout. An assistive control that vanishes on one route is a real defect
   against a statement that describes it as always present.

The one-line fix for (2) was never needed — the move back to a layout mount later the same day
closed it. Both regressions in this entry are RESOLVED; the entry stays because the reasoning
about `overflow-hidden` clipping is still the reason a footer placement needs a fixed panel.

Not built, not typechecked, not looked at — the user's standing instruction.


## 2026-08-17 — accessibility widget built (real, unlike the cookie banner)

The user's boss sent them the international accessibility icon; they asked what it was for and
whether it related to cookies. It does not — it is the widget the live site ships and that
§04 `כפתור נגישות` had been promising since that morning's sync. Scope was presented and
approved with "build it fast".

`src/components/a11y/AccessibilityWidget.tsx` + five mode classes in globals.css + an
`a11yWidget` block in `chrome` + a mount in each layout shell. Seven controls, Hebrew verbatim
from the live widget (extracted from the bundle at offsets ~461770–465845). Full table and the
false-promise accounting are in FEATURE.md.

### The two decisions that took the thinking

- **Text size is `zoom`, not root `font-size`.** The live site uses `font-size` and it would be
  near-inert here: this codebase sets type in absolute px, which does not inherit from the root.
  Checked before choosing, not assumed.
- **High contrast redefines TOKENS; it must never be a `filter`.** A `filter` on `html`/`body`
  makes it the containing block for `position: fixed` children — it would unpin the nav, the
  cookie banner and the widget's own button. Redefining `--color-muted` et al. costs nothing and
  cannot break layout, and every component already reads them.

Third, smaller: the button sits at PHYSICAL `left-4`. §04 says "בצד שמאל", in Hebrew, where the
logical start edge is the right one — `start-4` would put it on the wrong side of the page that
describes it.

Store is `useSyncExternalStore` again, and here the snapshot MUST be cached: it returns an
object, and a fresh literal per call never compares equal, so an uncached `getSnapshot` renders
forever. The cookie banner's could skip the cache because it returns a string.

⚠️ **NOT BUILT, NOT TYPECHECKED, NOT LOOKED AT.** The user asked mid-session to stop running
`npm run build` and `tsc` as self-verification. So this ships unverified by me — the render, the
seven toggles and both locales are the user's pass.


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
