# Context: Navigation + Banner

Memory for this section. **Newest entry on top.** Append after every task — never rewrite
past entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold,
with no code scanning.

---

## Current state

Built and building clean. Banner + both header layouts (full nav ≥1200, logo + hamburger
below) + a mobile panel + a three-way scroll state. All structural values are measured from
the capture; hover opacity values are estimated and flagged.

**Not yet visually verified against the reference at any tier** — this is the main gap.
The mobile menu panel is invented, because the original never renders it in the capture.
The banner is direction-aware (off on the way down, back on the way up) and independent of
the colour swap — both user-confirmed against the live site.

The banner slot is a **live frontier-LLM price ticker** as of 2026-08-08 (it was an AI-stock
ticker for a few hours earlier the same day) — nine models, per-million-token list prices from
OpenRouter, no sparkline. See the newest log entry.

The bar's palette **tracks the section behind it** (`hero` / `light` / `dark`), driven by a
`data-nav-theme` attribute each section carries. The `light` palette is observed on the live
site; the `dark` one is a user request and **has not been observed** — see the newest log
entry. The colour *trigger point* and all timings are still ours.

The **link labels went back to the target's own set on 2026-08-09** — `Clix` · `Product` ·
`Security` · `Company` · `Customers` · `News` · `Careers`, i.e. rogo's seven with `Felix`
replaced by the brand. Labels only: the lockup is still clix, the banner is still the ticker,
and the type is still 18px. See the newest log entry before changing any of those.

The component takes **two per-route props** as of 2026-08-09 — `banner` and `spacer`. Both
are off on `/` and both are on-ish on `/clix` (`banner={false} spacer`), because that page's
target has no strip above its bar and keeps the bar in flow. Neither changes the home page.

**Status:** `review`
**Next action:** compare against the reference at 1600 / 1440 / 1024 / 390; then observe the
live site for the mobile menu, the scroll flip point, and the `Indicator` element.

---

## Log

### 2026-08-19 — model ticker slowed, 40 → 24 px/s

**Trigger:** user — the moving strips *"kinda make us dizzy maybe slow them down?"* — one pass
covering both marquees. `SPEED_PX_PER_SEC` in `ModelTicker.tsx` 40 → 24; the hero's logo
carousel went 50 → 30 in the same pass. The ticker keeps its standing rule of being the slower
strip, because its content is read, not just recognised. Duration derives from the measured
cycle at tween-build time, so no other code changed.

### 2026-08-13 — a decorative candlestick chart in the ticker's signal slot

User: *"add a small graph beside the token price if they are up or down, green if up red if
down"*, with a stock chart attached. Six iterations later it is a generated candlestick chart.
**The whole point of this entry is the boundary that ended up around it**, so read to the end.

**THE CONSTRAINT, WHICH IS PERMANENT.** `/api/v1/models` returns what a model costs right now
and nothing else. No history endpoint, no database, and a list price has no time series in any
case — it is a constant until the lab changes it. So "up or down" has no number behind it, and
a candlestick is worse: it asserts four observations (open/high/low/close) per period across
fifty periods, none of which exist. This is why the old stock sparkline came off on 2026-08-08.

**IT WAS PUT TO THE USER THREE TIMES BEFORE ANYTHING FABRICATED SHIPPED.** (1) Before the first
build, as a choice of three options — field position, delta vs. a dated baseline, or a
decorative sparkline — with the trade stated; user chose field position and chose CHEAPER =
GREEN. (2) Again when the zigzag went in, where the wobble was isolated to the middle of the
line and the endpoints kept real. (3) Again on the candlestick reference, answered with what
was and was not buildable. The user's answer: ***"you can just invent graph, no need to be
faithful to the data"***. That is theirs to make, and it is made.

**WHAT SHIPPED.** `PriceRank` — a seeded 20-candle random walk, wicks and bodies, 59x20px,
green up / red down (stock convention, since that is what the shape quotes). Normalised to its
own range after the walk so every chart fills the box.

**TWO THINGS ARE STILL TIED TO THE DATA and they cost nothing:**
- **The seed is the model's own prices**, so each row draws its own chart and the same one on
  every reload (user: *"why all has the same design or graph, add some randomness"*). ⚠️ **It
  must stay a pure function** — `Math.random()` would desync server and client and throw a
  hydration mismatch on every visit.
- **The drift follows the row's verdict** — at or below the strip's median trends up, dearer
  trends down. So a green-heavy chart still means "cheap for this field", which is the signal
  the user originally asked for.

**⚠️ THE RULE, WRITTEN INTO THE FILE IN CAPITALS: NOTHING MAY BE ANNOTATED ONTO THESE CANDLES.**
No axis, tick, gridline, tooltip, hover readout, percentage, date, legend or caption. Shape is
ornament; a NUMBER is a claim, and `$5 → $30 /M` sits four pixels away and is live vendor
pricing. The prices stay real and `src/lib/models.ts`'s standing note still governs them.

**FIVE MARKS WERE BUILT AND DISCARDED BEFORE THIS ONE.** Recorded because each was rejected for
a reason worth not rediscovering, and because four of the five were fully honest — the loss of
that is the cost of the decision above, not an accident:

| # | Mark | Rejected because |
|---|---|---|
| 1 | 9-bar field column chart, log scale, one lit | user wanted a line chart |
| 2 | Line through the sorted field | *"add some zigzag curves"* — sorted data is monotonic, it cannot zigzag |
| 3 | 3-octave sine wobble on a real trend | *"the curves are too small"* → widened to 112px, which was the wrong axis |
| 4 | Triangle-wave /\/ legs, full-height ramp | *"i dont like them, maybe just change them to bar chart"* |
| 5 | Per-row relative bars (each model vs. this one) | *"tell me if you can make them look like [candlesticks]"* |

**Measurements from those passes that survive and would cost real work to redo:**
- **The field spans $0.90 → $35.00, a 39.1x spread** (2026-08-13 poll), which is why anything
  plotting these prices must use a LOG scale. Computed both: linearly the six cheapest models
  occupy **2.4px of twelve**, i.e. seven stubs beside two tall bars.
- **The median is $8.00 with a TIE sitting on it** (Grok 4.5 and Qwen3.8 Max). `total <= median`
  rather than `<` is therefore load-bearing — 5 green / 4 red, where `<` calls the median dear.
- ⚠️ **Seed multipliers must be mutually irrational.** At 0.7/1.9/3.1, DeepSeek and Grok drew
  visually identical curves: their seeds differ by 62.88 and, because 7/19/31 share a
  denominator, that one delta put every term within a rounding error of a whole cycle.
- ⚠️ **`ROW_H` (21px) is the hard ceiling on chart height.** The banner measures 45px and the
  header's hide-on-scroll transform travels exactly that far, so a taller chart moves the
  header. 20px is the most that fits.
- ⚠️ **The walk builder lives outside the component.** Each candle opens where the last closed,
  and carrying that in a `let` inside the component body trips
  `react-hooks/immutability` — a fair catch, since the compiler cannot see that it never escapes.

**Colour.** Two tokens, `--color-price-low` (#4ade80) / `--color-price-high` (#f87171) — the
hexes that were `--color-quote-up`/`--color-quote-down` until 2026-08-08, reinstated at the
values the removal note preserved. Both cleared **AA on `--color-banner`** (10.6:1 and 6.4:1)
and that background is unchanged. ⚠️ **The names say low/high, not up/down**, because the
project-wide meaning is inverted — green is the CHEAP end, a price rising being bad news for
the reader. On the candles themselves green is the stock sense (closed up); the drift is what
reconciles the two. See `docs/DESIGN-SYSTEM.md`.

**A11y.** Chart is `aria-hidden`, which is now the only correct value — there is nothing here
to describe. New `chrome.a11y.tickerRank` carries the model's REAL rank in the field, which
comes from `buildField` and not from anything drawn. ⚠️ **The Hebrew is authored and unread by a
native speaker.**

Build + `tsc` + eslint clean. **Not viewed in a browser by me** — the user checked each pass.

### 2026-08-13 — `Customers` reached the home page but not the section

**Symptom.** From any route other than `/`, clicking `Customers` (`/#testimonials`) landed at
the TOP of the home page. `#security` had the same defect; it was never noticed because that
slot became a route on 2026-08-12.

**Root cause, and it is not a missing anchor.** `#testimonials` exists (`Testimonials.tsx`),
`AppLink` classifies the href correctly, and Next's `ScrollAndFocusHandler` does find the node
and call `scrollIntoView()` on it. The scroll fires — it is just **SMOOTH**, because
`globals.css` sets `html { scroll-behavior: smooth }` and Next only neutralises that when
`<html>` carries `data-scroll-behavior="smooth"`, which this app never set. So the browser
begins a one-to-two-second animated scroll from the OLD route's offset, and roughly one frame
later `ViewTransitions.tsx` resolves its commit promise, at which point the browser captures
the post-update snapshot for the crossfade. **The snapshot is frame one — the top of the page**
— and the crossfade then paints it over the live document for 300ms. What looked like "no
scroll" was a slow scroll that got photographed at its start.

Reading `node_modules/next/dist/client/components/layout-router.js` also shows the attribute
alone would not have been enough: in the `hashFragment` branch Next `return`s straight after
`scrollIntoView()`, and it passes `dontForceLayout: true`, so the reflow Chrome needs to pick up
a just-changed `scroll-behavior` never happens. The hash has to be landed by us.

**Fix, two parts.**
1. `ViewTransitions.tsx` records the fragment of the href it is navigating to, and in the
   `usePathname` effect — after the route commits, before `resolve()` — calls
   `scrollIntoView({ behavior: "instant" })` on it. `"instant"` overrides the CSS rule
   per-call, so no reflow dance. Ordering matters twice: child effects run before parent ones,
   so Next's own attempt has already happened and ours supersedes it; and scrolling before
   `resolve()` is what makes the browser photograph the page **already at the section**.
   The fragment is also cleared by the 1500ms safety valve, so a navigation that never commits
   cannot leave a stale target for the next one.
2. `data-scroll-behavior="smooth"` on `<html>` in **both** layouts. This is what Next asks for
   (it warns about the exact omission in dev) and it fixes the same defect for plain route
   changes, which were animating their scroll-to-top instead of arriving.

**In-page anchors are untouched.** `AppLink` returns early for a hash on the current route, so
those never reach `ViewTransitions`; and Next's helper short-circuits on `onlyHashChange`. The
smooth rule still does the job it was added for on 2026-08-05.

**Not visually verified** — build + eslint clean, handed over.


### 2026-08-12 (third pass) - the fade WAS the white flash; replaced with a real crossfade

**Trigger:** user, with a screenshot of `/company` washed out to near-white mid-navigation -
*"everytime i change page it flashes me with a white screen, its not smooth at all, it should
just smoothly fade and show the next page."* They were right, and the screenshot is the proof:
that is the page at roughly 15% opacity with `body`'s `--color-paper` showing through it.

WARNING: **THE PREVIOUS ENTRY'S FADE WAS A WHITE FLASH BY CONSTRUCTION, NOT A MIS-TUNED ONE.**
This is the lesson worth keeping. Animating the incoming page `opacity: 0 -> 1` assumes there is
something behind it to fade *from*. There is not - **App Router unmounts the outgoing page
before the incoming one paints**, so the only thing behind it is the body background. The
animation therefore faded up from white on every navigation, which is strictly **worse than no
animation**, since an instant swap at least never showed the background. No duration, easing or
starting-opacity value fixes this; the failure is structural. **Do not reintroduce a page-level
opacity animation.**

Nothing rendered by React can fix it either, because the frame that must stay on screen no
longer exists in the tree. **The old frame has to be held outside React**, which is precisely
what the View Transitions API does: snapshot the document, let the DOM change, crossfade
snapshot to live. Both frames are on screen together, so no background is ever exposed.

**Built:** `src/components/ui/ViewTransitions.tsx` (provider + `useViewTransitionNavigate`),
mounted in `layout.tsx`; `AppLink` is now a client component that hands internal navigations to
it; `template.tsx` and the `page-fade-in` keyframe are **deleted**; globals.css now sets only
duration and easing on `::view-transition-old(root)` / `::view-transition-new(root)`, since the
default crossfade is already the wanted animation.

WARNING: **`startViewTransition(cb)` assumes `cb` updates the DOM synchronously, and
`router.push()` does not.** So `cb` returns a promise resolved by a `usePathname()` effect once
the new route has actually committed. **Resolving early would end the snapshot before the new
page paints and bring the flash straight back.** A 1500ms fallback resolve guards against a
navigation that never commits (otherwise the browser sits on a frozen snapshot until its own
~4s timeout); it is deliberately 5x the animation, so it can only fire on a genuine failure.
The timer does an **identity check on the resolver, not a null check** - a second navigation
may have installed its own, and this timer must not end that one.

**Four cases deliberately NOT intercepted**, each a bug if it were: modified clicks
(cmd/ctrl/shift/alt/middle - the user is asking for a new tab); a hash on the *current* route
(that is a scroll, and crossfading the document over it would look broken and fight
`scroll-behavior`); anything a caller already `preventDefault()`ed; and any link rendered
outside the provider, which falls through to ordinary `<Link>` behaviour rather than throwing.

WARNING: **`experimental.viewTransition` still rejected, same evidence as the previous entry** -
the Next flag exists but binds through React's `ViewTransition`, which React 19.2.4 stable does
not export. Calling `document.startViewTransition` directly sidesteps that entirely: **the
browser API is stable and already typed in TypeScript's own `lib.dom.d.ts`** (verified, line
10378) - only React's binding to it is experimental.

**The fixed-element constraint from the previous entry no longer applies.** A view transition
snapshots at the compositor, so unlike a `transform` on a wrapper it never establishes a
containing block and cannot make Nav's fixed header or ClixBackdrop jump. The reason the fade
had to be opacity-only has been designed away rather than worked around.

**Fallback is correct-by-default:** no API support, or `prefers-reduced-motion: reduce`, gets a
plain `router.push` - an instant swap with no flash. The flash was the bug; the crossfade is
the enhancement.

**Verified:** build clean, 13 routes prerendered; eslint's 7 errors are unchanged, pre-existing
and all in `ClixHero.tsx`. Confirmed **live on the user's own dev server** (port 3001, still
held by their process): `class="page-transition"` now returns **0** matches, `page-fade-in` is
gone from the served CSS, and both `::view-transition-old(root)` and `-new(root)` are present.
WARNING: **The crossfade itself has still not been watched by a human or a driver** -
correctness of the *animation* rests on the API's default behaviour, not on an observation.
The user is looking at it next.

### 2026-08-12 (later still) — the transition itself, and why it is opacity-only

**Trigger:** user, after the `<Link>` fix — *"i dont see the smooth transition."* Correct: that
change removed the *reload*, it added no *animation*. This adds one.

**`src/app/template.tsx`.** Next remounts `template.tsx` on every navigation (`layout.tsx`
persists, `template.tsx` does not), so the enter animation costs no router subscription and no
client component.

⚠️ **OPACITY ONLY, AND THIS IS A CONSTRAINT RATHER THAN A TASTE CALL.** The obvious page
transition is "fade + slide up 24px". **It would break this site.** Two elements here are
`position: fixed` — the header (`Nav.tsx:408`) and `ClixBackdrop.tsx:249`. A fixed element
resolves against the viewport only while no ancestor establishes a containing block for it, and
`transform`, `filter`, `perspective`, `will-change` and `contain` **all do**. Put a `translateY`
on the template wrapper and the fixed header and backdrop start resolving against that div, and
visibly jump for the length of every navigation. **`opacity` is not in that list** — it creates
a stacking context only, which is harmless. So the fade is safe and the slide is not. If motion
beyond a fade is ever wanted it has to live on the page's own content, below the fixed elements.

**300ms / `--ease-rogo` are the site's own values, reused deliberately** — the capture's link
preset declares `.3s cubic-bezier(.44,0,.56,1)` and Nav and Footer already run every colour and
opacity change on it. The page fade and the nav's theme swap therefore share one curve and one
duration instead of beating against each other. ⚠️ **This is NOT a measurement of rogo's page
transition.** That number is still unknown (see the previous entry) — this is an internally
consistent choice, not a cloned one, and should be replaced if rogo's real timing is ever
observed.

**ENTER ONLY.** App Router unmounts the outgoing page before the incoming one renders, so an
exit animation needs a freeze-frame of the old tree. Not built: prefetch is on, so the next
route is usually already in memory and the loading gap an exit fade would cover does not exist.

**Two approaches were rejected before this one, both on evidence:**

1. ⚠️ **Next's `experimental.viewTransition` — the flag EXISTS in this version**
   (`config-schema.js:315`, `config-shared.d.ts:699`) **but React 19.2.4 stable exports no
   `ViewTransition`** (`Object.keys(require('react'))` filtered for it returns `[]`; it ships on
   the experimental channel). Using it would mean moving the app to a React canary. Rejected as
   not worth destabilising a clean build for a crossfade.
2. **Framer Motion / `AnimatePresence`** — not installed (deps are gsap + `@gsap/react` only),
   and it does not dodge the containing-block problem anyway, since its transforms would sit on
   the same wrapper.

**Reduced motion needed no new code** — globals.css already clamps every animation to 0.01ms
under `prefers-reduced-motion: reduce`, and `both` fill leaves opacity at 1, so the page is
never left invisible.

**Verified:** build clean, 13 routes prerendered. Then confirmed **live**, which was possible
only by accident: `npm run dev` failed `EADDRINUSE` on 3001 because the user's own dev server
was already running, so the probes hit **their** server — `class="page-transition"` present in
the served HTML, `@keyframes page-fade-in` and `.page-transition` present in the served CSS
chunk, and Nav's `fixed inset-x-0 top-0 z-[3]` still intact in the same document. ⚠️ **Still
not watched with human eyes in a browser** — no driver in this repo. The fixed-element argument
above is reasoned from the CSS containing-block rules, not observed.

⚠️ **`Nav` remains per-page with per-route props, so it remounts and fades WITH the body on
every navigation.** That is the visible consequence to judge first: the whole page including the
bar crossfades, rather than the bar holding still while content changes. Holding it still is the
Nav-into-layout job logged in the previous entry, and it is the larger piece of work.

### 2026-08-12 (later) — the site was never actually navigating as a SPA

**Trigger:** user — *"every time i change section or click in the nav, the page refresh, its
now spa yeah? rogo has this smooth animation in between changing page."*

**The cause was not a missing feature, it was a bug that had been shipping since the nav was
built.** Every link in this file was a raw `<a href>`. A raw anchor pointing at an internal
route does not go through Next's client router at all — the browser discards the document and
starts over. So every nav click cost a white flash, a refetch of CSS and fonts, a scroll
reset, and a **full re-initialisation of this component's own scroll-theme scanner**, which is
why the bar was re-deciding `hero`/`light`/`dark` from scratch on every navigation.

Only the two logo links (`Link`, lines ~467 and ~585) were ever routed. That asymmetry was
observable the whole time: clicking the logo felt different from clicking `Product`, and
nobody had named why.

**Fix:** one shared primitive, `src/components/ui/AppLink.tsx`, so the internal/external
decision lives in one place instead of at each call site. Its rule:

```
external === true   ->  <a target="_blank">
href starts with /  ->  <Link>          (client-side)
anything else       ->  <a>             (#hash, mailto:, https:)
```

⚠️ **The third branch is the one that matters and a naive `external ? a : Link` test gets it
wrong.** Footer's `Email` entry is a `mailto:` that carries **no** `external` flag — it does
not want a new tab — so a flag-only test would have handed a `mailto:` to the router. The
test is on the **href shape**, not the flag.

⚠️ **`#contact` and `/#contact` are not the same case.** Bare `#contact` is a same-page scroll
the browser already does natively without a reload, so it stays a plain `<a>` and Footer's CTA
was deliberately left untouched. Rooted `/#contact` from `/company` is a real cross-route
navigation and correctly takes the `<Link>` branch. (Note this cuts against the 2026-08-12
`/security` note that bare `#contact` is preferred because the rooted form trips a lint rule —
both are true, they just apply to different call sites: same-page CTA vs cross-route CTA.)

**Converted:** this file (`NavButton`, the mobile panel row, the desktop row),
`Footer.tsx` (`FooterLinkItem`), `ClixCTA.tsx` (`/#contact`), `CompanyCareers.tsx`
(`/careers`). `ProductSecurity.tsx` already used `Link`.

**One type tightened:** `NavButton`'s `href` was `href?: string` but both call sites always
passed one, and a button with no destination is not a link. Now required, which removes an
undefined branch AppLink would otherwise have to defend against.

**Prefetch left at Next's default (on).** This is the half of the change that makes any future
page transition feel like a transition rather than a fade over a loading gap — by the time the
click lands the next route is usually already in memory.

**Verified:** `npm run build` clean, all 13 routes prerendered (so every converted component
renders on every route). eslint shows 7 pre-existing errors, **all in `ClixHero.tsx`**, none in
any file touched here. ⚠️ **NOT verified by clicking through in a browser** — no browser driver
is installed in this repo and one was not added for this. The client-side no-reload behaviour
rests on Next's `Link` contract, not on an observation.

**Still open — the actual ask.** The user asked for rogo's *transition*, and this change is
only its prerequisite. Two findings:

1. ⚠️ **Rogo's transition timing is not extractable from static assets.** `rogo.ai`'s HTML
   contains the word `transition` exactly once and no page-transition config; the 53
   `data-framer-page*` hits are all `data-framer-page-link-current` (active-link styling) plus
   one optimisation timestamp. `script_main.Bj6Ijvx7.mjs` has zero hits for
   `pageTransition`/`exitTransition`/`enterTransition`. It lives in a Framer runtime chunk.
   **Measuring it needs the live site observed in a browser, frame by frame** — a different
   kind of task, not attempted. Per CLAUDE.md's two-source ceiling, stopped here and asked.

2. ⚠️ **`Nav` is mounted per-page, not in a layout, and the pages pass different props**
   (`/clix` passes `banner={false} spacer`; the rest pass `models`). So on every client
   navigation the nav still unmounts and remounts. That is invisible today, but a page
   transition where the *body* animates and the *bar* holds still requires hoisting Nav into a
   layout — which means reconciling those per-page props first. **That is the real work in the
   transition, not the animation itself.**


### 2026-08-09 (later) — two per-route props: `banner` and `spacer`

**Trigger:** user, on `/clix` — *"match the spacing on top … also remove the black banner on
top, only on this page."* Both are properties of that page's template, so they became props
rather than a fork of the component.

**`banner={false}`** drops the ticker strip. With no strip there is no `bannerH`, so
`bannerShift` is always 0 and the header never travels — the hide-on-scroll behaviour turns
itself off without a second flag.

⚠️ **This is NOT the same as passing no `models`, and the distinction is on purpose.** An
empty `models` array is the *outage* path: the strip collapses so a fault is visible rather
than papered over with stale numbers. `banner={false}` is a *template* decision. Identical
rendering, opposite meaning — collapsing them would make a real outage on `/` indistinguishable
from a design choice.

**`spacer`** renders a `--nav-row-h`-tall block after the header, reserving the row's height
in the document flow. It exists because `rogo.com/felix` puts its nav in a
`position: sticky` container (`.framer-1jwqerv-container`), i.e. in flow, while rogo.ai's home
nav overlays a video and is fixed. Two pages, two templates.

**Why a spacer and not `position: sticky` on our header.** Sticky is the literal translation
and it breaks the mobile menu: the panel is a child of the header, so in flow it would push
the whole page down ~400px every time someone taps the burger. The fixed header does not have
that problem, and a spacer gets the same layout without inheriting it.

**`--nav-row-h` (globals.css): `74px` <1200, `70px` ≥1200.** Derived, not eyeballed —
every box in the row is a fixed height, so the sum is exact and no font metric can move it:
  - `<1200` — `p-4` 16 + `h-10` burger 40 (taller than the `h-8` logo) + 16 + the two
    coincident 1px bottom borders = 74
  - `≥1200` — `py-4` 16 + NavButton 38 (`1 + 8 + h-5 + 8 + 1`, taller than the `h-9` logo and
    link row) + 16 = 70

It **will** drift if a row's padding or a child's height changes, which is why the derivation
is written out next to the value. Not in `@theme` — a Tailwind v4 theme block cannot carry a
media query, and this genuinely differs per tier.

**Verified:** build clean; served HTML has `bg-banner` on `/` and not on `/clix`, and the
spacer on `/clix` and not on `/`. **Not verified:** no pixel diff at any tier.


### 2026-08-09 — link labels reverted to the target's, with `Felix` → `Clix`

**Trigger:** user, with two crops stacked for comparison — rogo's link row above ours —
*"I want the navigation bar of this landing page to be matched on Rogo … So only replace the
text that are on current version of ours, follow the version of Rogo, which has the Felix
product security company, customers, news, and careers. But instead of Felix, put clix."*

**What changed: the seven strings, and two of the seven hrefs. Nothing else.**

| | Before (clix IA) | After (target's) |
|---|---|---|
| 1 | Services → `#services` | **Clix** → inert |
| 2 | Industries → inert | **Product** → inert |
| 3 | Work → inert | **Security** → `#security` |
| 4 | Insights → inert | **Company** → inert |
| 5 | Playground → inert | **Customers** → `#testimonials` |
| 6 | About → inert | **News** → inert |
| 7 | Contact → `#contact` | **Careers** → inert |

Labels and order are verbatim from the capture (`./felix ./product ./security ./company
./customers ./news ./careers`, extracted by walking back from the banner's byte offset to the
nearest preceding `href`). **Slot 1 is the one deliberate departure:** `Felix` is rogo's named
AI-analyst product and a clix build cannot claim it, so the slot carries the brand instead —
the user's own instruction, not an inference.

**The hrefs were re-derived from the new labels, not carried across by slot position.**
Position-mapping would have made `Clix` scroll to `#services` and `Careers` to `#contact` —
a wrong destination wearing a working link's clothes, which is worse than an inert item.
`Security` and `Customers` are the only two labels this page has a real section for
(`#security`; `#testimonials` *is* the customer-quote block). So the live/inert split stays
2-of-7 as before, and the row's dimmed-item rhythm is unchanged. `#services` (WhyRogo) and
`#contact` (Footer) are now unreferenced from the link row — `#contact` is still the
`Let's start` button's target, `#services` currently has no nav entry at all.

**Three things were explicitly ruled out of scope**, asked and answered before touching the
file, because each would have reverted an earlier deliberate decision:

- **Logo** — stays the clix mark + wordmark, *not* rogo's 60×24 logotype. (`RogoWordmark.tsx`
  is still in `src/components/ui/` if this is ever revisited.)
- **Banner** — stays the live LLM price ticker, *not* "Announcing our $160M Series D led by
  Kleiner Perkins" + underlined `Learn more` → `./news/series-d`.
- **Type and lockup size** — stay at 18px links / 28px mark, *not* the capture's 14px / 60×24.

Recorded here because "match the nav to Rogo" reads, in isolation, like a mandate to finish
all three. It is not one. The capture values for each are in `FEATURE.md` and above.

**Row is strictly narrower than what it replaced** — 46 label characters against 52 — so the
absolutely-centred `w-min` nav cannot newly collide with the logo or the button group at the
1200px collapse point. No spacing, box or breakpoint value was touched.

**Verified:** `npm run build` clean (TS included); served HTML at `localhost:3000` carries
each of the seven exactly once, and none of the old seven. `Services` / `Industries` /
`Insights` / `Playground` still appear in the page — those are the **footer's** own link
columns (`Footer.tsx:57,65,66`), a separate IA that this request did not cover.

**Not done:** no pixel diff against the reference at any tier. The section's standing gap
(never visually verified) is unchanged by this.

### 2026-08-08 — ticker cut from five fields to two, for legibility

**Trigger:** user, with a crop of the strip — *"this is a bit hard to read at i want easy to
understand like the market graph"*.

**The diagnosis, because it is not "the font is small".** The stock ticker was scannable
because a symbol is four characters and there was one price: `NVDA 182.31 ▁▂▃ +2.4%`. The row
it became is **45 characters across five fields** —
`Anthropic Claude Opus 5 in $5 · out $25 /M 1M ctx` — and at 13px that reads as prose. The
lab names the user asked for the turn before made it worse, and correctly so; the fix had to
come from the other three fields, not from undoing that.

| | before | after |
|---|---|---|
| row | `Anthropic Claude Opus 5 in $5 · out $25 /M 1M ctx` | `Anthropic Claude Opus 5  $5 → $25 /M` |
| fields | 5 | 2 |
| characters | 48 | 35 |
| type | 13px | **14px** |
| gap between models | 40px | **56px** |
| measured cycle | 2781px | **2444px** |

**What went, and why**

- **The context window.** The least load-bearing number on the row. `formatContext` is kept
  and still used — the sr-only text announces it — so restoring the field is one line.
- **The words `in` and `out`, replaced by `→`.** Input-to-output is the near-universal
  convention in model pricing, so the arrow carries it in one glyph instead of six. U+2192,
  not `->`, and not the `·` it replaced — a middot reads as a separator between two equal
  things rather than as a direction.
- **`/M` demoted to `text-paper/55`** so the two dollar figures are what the eye lands on.

**BOTH PRICES STAY, and dropping one was the obvious further cut.** It is the wrong one: input
and output differ by 5x on some models and not at all on others, so a single figure would
misrepresent whichever it omitted. The arrow is what buys the room to keep them honest.

**13px → 14px is FREE, and that is a consequence of an earlier decision.** `ROW_H` is pinned
at 21px because the header's hide-on-scroll transform travels one banner height; 14 × 1.5 is
exactly 21, so the strip returns to the banner's own original type size **without moving the
header a pixel**. Confirmed: banner still 45px at all three tiers.

**Gap 40 → 56px.** At 40 the space *between* two models was barely wider than the space
between a model and its own price, so nine items read as one sentence. Now 12px within a row,
56px between rows.

New opacities, all computed against `--color-banner` `#211e1e`, all clearing AA at 14px:
lab `/60` = 6.74:1, prices `/75` = 9.78:1, `/M` `/55` = 5.90:1.

**Re-verified**, 1600 / 1440 / 390: banner **45px**, row 21px, no horizontal overflow, tween
advancing, static under reduced motion, all nine prices still matching a fresh call to the
live endpoint. Cycle **shrank** 2781 → 2444px, so the loop is back to ~61s and still clears
the viewport at every tier. `npm run build`, `tsc`, `eslint` clean.

⚠️ **The probe needed updating with the component.** `tickershot.js` asserts the rendered
string, so the format change turned all nine price checks red until its expectation was
changed too. Worth knowing before reading that failure as a data problem.

**Not done, and the reason:** the user said *"like the market graph"*, which could be read as
wanting the sparkline back. It cannot come back honestly — see the entry below — so this pass
attacked legibility instead. Flagged to them.


### 2026-08-08 — ticker rows now credit the lab

**Trigger:** user — *"i want it to be LLM not stocks of the company like anthropic, GEMINI,
OPENAI, GROK, etc"*, chosen from four readings via AskUserQuestion. The strip already had no
stocks in it; what was missing was that **Anthropic and OpenAI were only visible as "Claude"
and "GPT"**, while Gemini and Grok happened to carry their brand in the model name. So the
maker is now printed in front of every model: `Anthropic Claude Opus 5`.

**Where the lab comes from, in priority order.** The provider's own `"Lab: "` prefix wins when
present, and `LAB_BY_NAMESPACE` (nine hand-typed strings, the only editorial on the ticker)
fills the gap when it is not. Both are needed because the prefix is inconsistent upstream —
`claude-sonnet-5` returns `"Anthropic: Claude Sonnet 5"` but `claude-opus-5` returns plain
`"Claude Opus 5"`. A namespace missing from the map renders with **no** lab rather than a
guessed one.

**⚠️ The strip says "SpaceXAI Grok 4.5", and it is not a typo.** That is OpenRouter's current
label for the `x-ai/*` namespace. The map holds `"xAI"` but never fires here, because the
provider's prefix wins — overriding it would mean asserting something about a company we are
not tracking. Flagged to the user; forcing `"xAI"` is a one-line change if they want it.

**⚠️ THREE ROWS STUTTERED, AND ONLY RENDERING SHOWED IT.** The data looked correct:
`DeepSeek DeepSeek V4 Pro`, `Mistral Mistral Large 3 2512`, `Qwen Qwen3.8 Max`. Some labs
brand the model after themselves and some do not, so pairing blindly doubles the word for
exactly those. A lab that already opens the model name is now dropped. **`startsWith` and not
a word-boundary test, deliberately** — `Qwen3.8 Max` carries the lab with no boundary after it
and still needs suppressing.

Lab and model share **one flex child**, separated by a space rather than by the row's 8px
`gap`. In its own child the lab would sit as far from its model as the price sits from the
context — three loose fields instead of a thing and its maker.

**Re-verified**, 1600 / 1440 / 390: banner still **45px**, row 21px, no horizontal overflow,
tween advancing, static under reduced motion, all nine prices still matching a fresh call to
the live endpoint. **Cycle grew 2471px → 2781px** (+310px, ~12%) — the loop now takes 70s
rather than 62s at 40 px/s, and `cycle >= viewport` still holds at every tier, which is the
guard that matters. `npm run build`, `tsc`, `eslint` clean.


### 2026-08-08 — banner ticker switched from stocks to LLM list prices

**Trigger:** user — *"make it LLM models not company stocks"*, hours after the stock ticker
itself went in.

**What the strip shows now:** nine frontier models and their live per-million-token list
prices — `Claude Opus 5 · in $5 · out $25 /M · 1M ctx`, and so on for GPT-5.6 Sol, Gemini 3.6
Flash, Grok 4.5, DeepSeek V4 Pro, Llama 4 Maverick, Mistral Large 3, Qwen3.8 Max, Kimi K3.

**Renamed, not rewritten** — `git mv` so history follows: `src/lib/quotes.ts` → `models.ts`,
`StockTicker.tsx` → `ModelTicker.tsx`, `api/quotes/` → `api/models/`. `Quote` → `ModelPrice`,
`Nav`'s `quotes` prop → `models`.

**Provider probed, not assumed** (four, same discipline as the stock pass):

| | | |
|---|---|---|
| OpenRouter `/api/v1/models` | **200** | no key, no signup, 400 models, live pricing — **used** |
| OpenRouter `/api/frontend/models/find` | 404 | the usage-ranking endpoint is not public |
| LMArena `/api/leaderboard` | 403 | `"Route not allowed"` |
| HuggingFace `/api/models` | 200 | download counts, but no pricing and no hosted API |

**This closes both risks the stock feed carried, which is worth recording because they were
logged as open.** Yahoo's v8 `/chart` was **undocumented** (v7 had already been closed off
mid-build), and **Yahoo's terms do not licence redistribution of market data on a commercial
site**. OpenRouter publishes this endpoint as public API surface and the content is vendor
list pricing — public by nature. No key to leak, nothing to relicense. The banner is now
contractually clean where it was not.

**⚠️ THE SPARKLINE AND THE ±% ARE GONE, DELIBERATELY.** Both need a time series per row and
none exists: a list price is a constant until the lab changes it. Drawing a trend line under
a flat number, or a `+1.2%` against a baseline never recorded, is precisely the invented-figure
failure `src/lib/models.ts` exists to prevent. So the strip is monochrome now. **Flagged to
the user** — if a signal is wanted back in that slot it has to be real (cheapest-in-set, or
price-changed-since-last-poll with stored history), not a shape.

Consequently `--color-quote-up` / `--color-quote-down` were **deleted** from `globals.css` —
their only consumer was the day change. Both cleared AA on `--color-banner` (10.6:1 and
6.4:1) and the note in the file records the values so they can be reinstated verbatim.

**Decisions worth keeping**

- **One request, not nine.** The catalogue endpoint returns everything (~650 KB); the stock
  version made one HTTP call per symbol. Cached by `next: { revalidate: 300 }`, so it is one
  upstream fetch per five minutes for all visitors regardless of traffic.
- **`/api/models` kept even though its original reason evaporated.** It existed because Yahoo
  sent no CORS header, so the browser *could not* call upstream. OpenRouter does send them.
  Kept anyway: one cached server fetch beats every browser pulling 650 KB for nine rows, and
  the provider stays swappable without touching the component.
- **Display names come from the provider, not from us.** Only the `"Lab: "` prefix is
  stripped, and inconsistently present upstream — `claude-opus-5` returns plain
  `"Claude Opus 5"` while `claude-sonnet-5` returns `"Anthropic: Claude Sonnet 5"`. The cost
  of this rule is `"Mistral Large 3 2512"` reading slightly raw; the benefit is that nothing
  on the strip is our editorial. Left as-is rather than prettified.
- **`in $5 · out $25` spelled out rather than `$5 / $25`.** The two prices differ by 5x on
  some models and not at all on others, so an unlabelled pair is genuinely ambiguous — and
  the input price alone is the one people misread as the whole cost.
- **⚠️ `MODEL_IDS` rots and that is handled, not guarded.** Labs retire slugs; `fetchModels`
  skips any id it cannot find, so a retired model quietly leaves the strip. **If the banner
  ever looks short, this list is stale — check it against the endpoint before assuming an
  outage.**

**Two formatting rules that are measurements, not taste**

- **Context unit follows the provider's own counting.** Anthropic reports 1,000,000 (decimal);
  Google reports 1,048,576 (binary) for the window both market as "1M". So an exact multiple
  of 1024 renders binary, anything else decimal. That is what turns 262,144 into **256K**
  rather than 262K, and leaves 500,000 as **500K** rather than 488K.
- **Fractions of a million truncate, never round**, so a label cannot overstate a window:
  OpenAI's 1,050,000 reads **1M**, not 1.1M.
- **`text-paper/50`, not `/45`.** White at 45% over the banner's `#211e1e` computes to
  **4.40:1** and misses AA for 13px body text; 50% is **5.10:1** and still reads as the third
  tier. Computed, not eyeballed.

**Verified** (CDP at 1600 / 1440 / 390, plus a cross-check against the live endpoint)

| | 1600 | 1440 | 390 |
|---|---|---|---|
| banner height | **45px** | 45px | 45px |
| row height | 21px | 21px | 21px |
| items / unique | 27 / 9 | 27 / 9 | 27 / 9 |
| measured cycle | 2471px | 2471px | 2471px |
| `cycle >= viewport` | ✅ | ✅ | ✅ |
| horizontal overflow | none | none | none |
| tween advancing | ✅ | ✅ | ✅ |

**45px is the number that mattered** — the header's hide-on-scroll transform travels exactly
one banner height, and the strip lost its 14px sparkline (previously the tallest child). The
21px pin on the row holds it. `cycle >= viewport` is the guard that caught the stock version's
27px hole at 1600; the wider rows clear it comfortably at every tier.

**All nine prices matched the provider field-for-field**, checked by re-fetching
`openrouter.ai/api/v1/models` inside the probe and comparing against the rendered `<li>` text
rather than against our own formatter. Server HTML carries the full sr-only list (JS-off /
crawler). Under `prefers-reduced-motion: reduce` the transform is `none` and stays `none`.
`npm run build`, `tsc`, `eslint` clean.

**Open**
- The banner has no colour at all now. User's call whether to bring a real signal back.


### 2026-08-08 — logo lockup scaled again, 24/26 → 28/30

**Trigger:** user, with a crop of the lockup — *"make this a bit more bigger"*. Third step in
the sequence: 20/22 → 24/26 (2026-08-07) → **28/30**.

Mark and wordmark moved together by the same ~1.15x, per the rule this lockup was built on:
scaling one without the other breaks the mark-to-cap-height relationship. Ratio drifts ~1%
(28/30 vs 24/26) purely from rounding to whole pixels.

The two Link boxes grew with it — `h-7 → h-8` compact, `h-8 → h-9` full — because they clip
their contents otherwise.

**The bar's own height did NOT change, which is the thing worth checking here:**

| width | lockup | row | header |
|---|---|---|---|
| 1600 / 1440 / 1200 | 98×36 | 38px | **115px** |
| 810 / 390 | 98×32 | 32px | **119px** |

Both rows are still sized by their CTA button (~38px full, 40px compact), which is taller
than the 36px the lockup now occupies. **That gap is the whole remaining budget: past ~38px
the button stops being the tallest thing and the bar itself starts growing.** One more step
of this size is the last one that is free.

Clearance from the lockup to the centred nav row is 207px at 1600/1440 and **127px at 1200**
— the lockup grew rightward by 11px, so it costs the link row about as much as a 0.5px type
step would. Not the binding constraint; the CTA still is.

Mark renders 31×28 (the asset's 96:88 aspect), wordmark 59×30. No doc overflow at any tier.


### 2026-08-08 — sitewide: Discovery everywhere, Arizona Mix deleted

**Trigger:** user — *"verified that all of the font in the whole website is the font i want
which is the one i purchase"*. A verification request, and it **failed**.

**Method matters here.** `getComputedStyle().fontFamily` returns the declared *stack*, so it
reports `Discovery, Inter, sans-serif` whether Discovery loaded or silently fell back. The
only answer worth anything is CDP **`CSS.getPlatformFontsForNode`**, which reports the faces
the renderer actually used plus a glyph count per face. Tagged every element owning its own
visible text, at 1440 and 390, after a full scroll pass.

**Result before: 9 of 169 elements were not Discovery.**

| face | count | where |
|---|---|---|
| Discovery | 160 | everything else |
| **ABC Arizona Mix** | **8** | hero h1, 4 section h2s, 3 stat h3s — i.e. the most prominent type on the site |
| **Inter** | **1** | the `clix` wordmark |

Both were known and deliberate; neither was what the user wanted. They chose Discovery for
both after being shown the trade-offs.

**The fix was two token flips, not nine edits** — `--font-display` and `--font-wordmark` in
globals.css. Every call site already read the tokens rather than naming a family, which is
exactly why that indirection was there. The three type tokens stay separate even though all
three now resolve to Discovery: they answer three different questions (body / display / logo)
and can diverge again.

⚠️ **Arizona Mix's `@font-face` and its woff2 are both DELETED**, not merely unreferenced.
It is a commercial Dinamo face that only ever entered this repo because it was in the
target's capture, and `public/fonts/ZF7ZgjonljJPpiLVhd1HLFeHnQ.woff2` was serving it from a
public URL. Left in place it would have been the only unlicensed font on the site now that
Discovery's own licence is settled. `fonts.css` is normally a verbatim re-dumpable copy of
the capture's rules; a comment in it marks this as the one deliberate deviation so a re-dump
does not resurrect the file.

⚠️ **The wordmark change is against the measurement, by explicit user choice.** The ink-width
test still says Inter 700 fits the real logo better than any Discovery weight (err 0.021 vs
0.033), so the rendered wordmark no longer matches `src/app/icon.png`. Recorded in
ClixWordmark.tsx at the call site as well, since that is where someone would question it.

**Verified after:** 169/169 Discovery at 1440, 160/160 at 390. Separately confirmed the
`wght` axis is genuinely live — the same 64px string measures 8 distinct advance widths
across weights 100→800 (401.75 → 450.55px), monotonic. So "Discovery_Fs Thin" in the CDP
output is just the VF's default instance name and not evidence of everything painting Thin.

**Open:** the headline sizes and `-0.05em` / `-0.04em` tracking were tuned for a serif and
are so far unchanged. They render acceptably, but they have not been re-tuned for a sans.


### 2026-08-08 — nav link type raised 14px → 16px → 18px

**Trigger:** user, with a screenshot of the link row — *"make the font of this bigger"*, then
*"a bit bigger"* on seeing 16px. **18px is the shipped value**; 16px was one round.

Raised in all three places the nav sets its label size, so the three rows do not drift apart:
the desktop link row, the `NavButton` label ("Let's start"), and the mobile panel's links.
Everything else is untouched — weight stays 500, `line-height` 1.5em, `letter-spacing`
-0.01em, and the item box stays `h-9 px-3 py-2` with `gap-3` between items.

⚠️ **This is a deliberate divergence from the target.** rogo.ai sets this row at 14px and
that value was measured, not guessed. Recorded here so a later reference pass does not
"correct" it back. Same class of divergence as the 24/6 stat.

**Measured after, because the row is `absolute left-1/2 -translate-x-1/2 w-min`** — it grows
from its own centre, so a size bump eats the clearance on *both* sides at once, and the CTA
is the side that runs out first:

| width | row w @16 | row w @18 | clearance to "Let's start" @18 | clipped | doc overflow |
|---|---|---|---|---|---|
| 1600 | 622px | 670px | 196px | none | no |
| 1440 | 622px | 670px | 196px | none | no |
| 1200 | 622px | 670px | **116px** | none | no |
| 1024 / 390 | — | — | compact row, nav not rendered | — | — |

1200 is the binding tier (the full row's lower bound). Each 2px step costs **48px of row
width, so 24px of clearance per side**; at 18px the tightest gap is 116px, which is still
comfortable but is the number to watch. Extrapolating that slope, ~24px is where the row
would touch the CTA at 1200 — so 20px is safe and anything past that needs the row's `gap-3`
or the item `px-3` to come down with it.

No item overflows its own `overflow:hidden` box — checked with `scrollWidth > clientWidth` on
every label, not by eye, since the boxes are `whitespace-pre` and would clip silently rather
than wrap.

Also confirmed in the same probe that **Discovery is the face actually painting these
links** — `font-family` resolves to `Discovery, Inter, sans-serif` and
`document.fonts.check('500 16px Discovery')` is `true` at all five widths, i.e. the webfont
loaded and is not silently falling through to Inter. The user asked for that verification
explicitly, and in the same breath **closed the licence question: they bought the font**
(*"the font is verified i bought it"*). The warning block in `fonts-discovery.css` is
replaced with that fact; the `.ttf` originals still stay out of the web root regardless.


### 2026-08-08 — the banner became a live AI-stock ticker

**Trigger:** user, with a screenshot of the banner — *"put ai graph stocks here instead"*.
Asked which of three readings they meant; they chose **"Live ticker, real quotes"** over a
decorative graph and over hard-coded sample numbers.

The slot has now turned over three times, each for a reason: the target's *"$160M Series D
led by Kleiner Perkins"* (removed 08-05, a first-person claim clix cannot make) → *"Clix AI
News"* + underlined *"Coming soon"* (08-07) → eight real quotes with sparklines.

#### Provider — probed, not chosen from a docs page

| source | result |
|---|---|
| Stooq CSV | **404** — the documented CSV path no longer resolves |
| Yahoo v7 `/quote` | **401** — now gated, *"User is unable to access this feature"* |
| **Yahoo v8 `/chart`** | **200** — no key, and returns an intraday series ✅ |
| Finnhub | 401 — needs a key |
| Twelve Data | 401 — needs a key |

So this needs **no API key and no signup**, which is better than what the user accepted. Two
real caveats, both told to them: v8 is **undocumented** (Yahoo has already closed v7 and can
close this without notice), and **Yahoo's terms do not licence redistribution** of their data
on a commercial site — the contractually clean answer is a free-tier key from a provider that
does licence it. Swapping is one function (`loadQuotes` in `src/lib/quotes.ts`); only the
Yahoo path is implemented, because it is the only one verifiable from here.

#### Shape

- `src/lib/quotes.ts` — fetch + normalise. Returns `[]` on failure; **never invented numbers**.
- `src/app/api/quotes/route.ts` — re-serves the same payload for the client's 5-min refresh.
  Needed because **Yahoo sends no CORS header**, so the browser cannot call it directly.
- `src/components/ui/StockTicker.tsx` — marquee + sparklines.
- Quotes are fetched in `page.tsx` (a server component) and passed to `Nav` as a prop, so the
  **first paint already has real numbers**. Fetching client-side would have popped the strip
  in after hydration and shoved the fixed header down 45px in front of the visitor.

⚠️ **First route handler in the project.** Every page stays prerendered, but this one path
needs a Node runtime — that rules out a pure `output: "export"` static export (which this
project does not use). On Vercel it is a serverless function, no configuration.

⚠️ `export const revalidate` **must be a literal.** Next statically analyses segment configs
and rejects an imported binding with *"Invalid segment configuration export detected"* — so
it is `300` in both files, kept in step with `REVALIDATE_SECONDS` by hand. Build failure, not
a warning.

#### Two bugs found by measuring, not by looking

**1. The strip lost a pixel: 45 → 44.** The old text was 14px on a 1.5em line box = 21px;
ticker items are 13px beside a 14px sparkline = 19.5px. That matters because `bannerH` is
what the header's hide-on-scroll transform travels. Pinned the row to 21px; the header's
transform is back to exactly `-45`.

**2. The marquee would have shown a hole at 1600.** Eight quotes measure a **1573px cycle**.
The tween slides one cycle then snaps, so the copies *behind* the start point —
`(passes - 1) × cycle` — must still cover the viewport at that instant. Two passes leave
1573px against a 1600px viewport: a **27px gap at the right edge, once per loop**. This is
the same class of error as the half-gap drift in `LogoCarousel` and equally invisible until
measured. Fixed by making the pass count dynamic: 3 by default (covers 3146px), widened by
the effect and on resize if the viewport is bigger — a 4K panel at 1× is 3840 CSS px and
would otherwise show the same hole.

#### Sparkline scale — a correction

Per-series normalisation initially looked wrong: MSFT at **+0.03%** drew as violent a line as
PLTR at **+10.32%**. It is not wrong. Measured the real ranges: MSFT swung **498.95–504.66
intraday, a genuine 1.14% range**, and closed flat. The sparkline shows the day's *path*; the
percentage shows the *close-to-close change*. Two different facts that can legitimately
disagree.

A 1%-of-price floor on the band was kept anyway, for the case per-series scaling really does
misrepresent — a series that barely moved would otherwise stretch 0.1% of drift into a crash.
On live data the ranges ran 1.08% (GOOGL) to 5.20% (PLTR), so **the floor does not bind on a
normal trading day**; it guards thin trading, holidays and halted names.

#### Verified

`stripH 45` · `passes 3` · `cycle 1573` · `coverAfterSnap 3146 ≥ viewport` at 1600 / 1440 /
1024 / 810 / 390. Header transform `-45` on scroll-down, `none` on scroll-up — the
direction-aware banner behaviour is intact. No horizontal overflow at any tier; the ≥1200
link row is unmoved at `w=574`. A 213-character `sr-only` list carries the quotes as static
text, so a screen reader gets them once, in order, without the marquee's duplicate passes.

**Colours:** `--color-quote-up` `#4ade80` and `--color-quote-down` `#f87171`, both new tokens
in `globals.css` — the first two colours on the site that carry meaning rather than style.
Contrast on `--color-banner` (#211e1e): **10.6:1 up, 6.4:1 down**.

---

### 2026-08-07 (later) — logo lockup scaled up 1.18x

**Trigger:** user, with a screenshot of the live nav — *"make clix a bit bigger and the
logo"*.

Wordmark **22 → 26px**, mark **20 → 24px**. **Both moved, by the same factor.** The mark sits
at ~1.3x the wordmark's cap height and that ratio is what makes the pair read as one lockup;
growing either alone is precisely what makes a logo look off. Lockup width 80 → **93.4px**.

The two `<Link>` boxes grew with it — `h-6 → h-7` compact, `h-7 → h-8` full. **Neither changes
the nav's own height**, because both rows are sized by their CTA button (40px compact, ~38px
full), which is still taller than the 32px logo box. Confirmed rather than assumed: the >=1200
link row is unmoved at `w=574`, and `gapLinksToCta` is 261 at 1440 and 181 at 1200 — identical
to before the change. No horizontal overflow at any of 1600/1440/1200/1024/810/390, and the
banner is untouched (45px, one line, unclipped, 10px gap).

Colour tracking re-verified at the new size across all three themes:

```
1440 hero   mark 26.2x24 fill rgb(255,255,255)   word 58.9x26   gap 8   centreDelta 0
1440 light  mark 26.2x24 fill rgb(21,21,21)      word 58.9x26   gap 8   centreDelta 0
1440 dark   mark 26.2x24 fill rgb(255,255,255)   word 58.9x26   gap 8   centreDelta 0
```

Identical at 810 and 390. `centreDelta 0` still holds — mark and wordmark share a vertical
centre exactly.

---

### 2026-08-07 — logo mark added left of the wordmark

**Trigger:** user — *"add clix logo in the left of the clix word on the navbar"*.

Both nav rows (the `<1200` compact header and the `>=1200` full header) now render
`<ClixMark>` + `<ClixWordmark>` inside the existing home `<Link>`, `gap-2`.

**There is no vector of this logo — anywhere.** Checked the reference capture before
assuming: the live company site declares `rel="shortcut icon"`, `rel="icon"`,
`apple-touch-icon` and `og:image` and **all four point at the same `/clix-logo.png`**. No
inline SVG of the mark exists in any of the 11 captured pages. So the raster is the brand
asset; the repo already had it at `src/app/icon.png` (512x512) from the 08-03 favicon work.

#### Why a CSS mask rather than an `<img>` or a trace

The nav's palette is three-way — paper content over `hero` and over `dark` sections, ink over
`light` ones. A PNG is a fixed `#303641` silhouette and would go **invisible against the two
dark sections**, which is most of the page's lower half. The alternative, tracing the bitmap
to SVG, means redrawing a logo by eye.

Decoded the PNG to a canvas first (all 262,144 px) rather than guessing:

| measurement | value |
|---|---|
| background | fully transparent — 160,060 px at alpha 0; all four corners `0,0,0,0` |
| ink colour | **one flat colour** — 89,197 of ~89,310 opaque px are `#303641` |
| partial alpha | 12,774 px, i.e. edge antialiasing and nothing else |
| ink bounding box | 480 x 440 inside the 512 square (16px sides, 36px top/bottom) |

A flat single-colour silhouette on transparent is precisely the case `mask-image` handles
losslessly: the mask reads **only the alpha channel**, so `background-color: currentColor`
paints the true shape — antialiasing included — in whatever colour the nav currently is. No
redraw, no fidelity loss, and it inherits the colour transition for free.

#### The asset

`public/clix-mark.png`, 96x88, **4.6 KB**. Cropped to the 480x440 ink box so the element's box
*is* the mark with no baked-in padding to align around, then downscaled 4x over the 24px it
renders at (covers 3x DPR). RGB flattened to white via `geq` since only alpha is read —
that alone took it from 9.8 KB to 4.6 KB. Regenerate with:

```
ffmpeg -i src/app/icon.png -vf "crop=480:440:16:36,scale=96:88:flags=lanczos,\
  format=rgba,geq=r=255:g=255:b=255:a='alpha(X,Y)'" -pix_fmt rgba public/clix-mark.png
```

#### Lockup geometry

Mark is **20px tall**, width 21.8 from the asset's 96:88 aspect. That is ~1.33x the
wordmark's 15.0px cap height (22px Inter Bold) — the usual range for a mark beside a
wordmark, and it still fits the 24px box the compact row allots. Gap **8px** (`gap-2`), the
same step the nav's button row uses.

**Colour and `transition-colors` moved from each child onto the `<a>`.** Both children read
`currentColor` — the wordmark as text, the mark as a mask fill — so they cannot drift out of
step mid-flip. Verified that the mask fill really does follow the flip rather than latching:

```
1440 hero   mark fill rgb(255,255,255)  word rgb(255,255,255)  gap 8  centreDelta 0
1440 light  mark fill rgb(21,21,21)     word rgb(21,21,21)     gap 8  centreDelta 0
1440 dark   mark fill rgb(255,255,255)  word rgb(255,255,255)  gap 8  centreDelta 0
```

Identical at 810 and 390. **`centreDelta 0`** — mark and wordmark share a vertical centre
exactly, which is the real alignment test. Anchor box grows to 80px wide (was ~50).

`aria-hidden` on the mark: the `<Link>` already carries `aria-label="clix — home"` and the
wordmark is the visible name, so a third label would only be noise.

Rendered and inspected in all three themes at 1440 / 810 / 390.

---

### 2026-08-07 — banner split into headline + underlined trailing run

**Trigger:** user — *"instead of clix ai make it clix ai news then coming soon with underline
so its like a link"*.

`BANNER_TEXT` went from the single string `"Clix AI — launching soon"` to two constants:
`BANNER_TEXT = "Clix AI News"` and `BANNER_CTA = "Coming soon"`.

**This restores the target's structure rather than departing from it.** The original banner
is a headline plus a trailing "Learn more" in a separate element at a 10px gap; the 08-05
copy rewrite had dropped the second element and folded everything into the headline run. It
is now back in its measured slot, with different words in it.

**Why it is a `<span>` and not an `<a>`, despite looking like one.** There is no Clix AI News
page. `href="#"` would scroll to the top of the page and read as broken; a link to a 404 is
worse. The underline is the affordance the user asked for and it will be honest the moment
the page exists — at that point this becomes an `<a>` and the styling already fits.
Accessibility note: nothing here is announced as a link or lands in the tab order, so the
underline is a *visual* promise only. If the page does not ship soon, this is the copy to
revisit.

**Why two elements rather than one longer string.** The phone banner truncates. The headline
carries `min-w-0 flex-1 truncate`; the new run is `flex-none whitespace-nowrap`. That
combination is what makes the *headline* ellipsise while "Coming soon" survives — the same
reason the original kept "Learn more" out of its headline run. One string would have
ellipsised the announcement itself away.

**Measured after the change** (headless Chrome, `.bg-banner` box + both runs' client rects):

| width | strip height | headline x/w | CTA x/w | gap | headline clipped? |
|---|---|---|---|---|---|
| 1600 | 45 | 722 / 80 | 812 / 84 | 10 | no |
| 1440 | 45 | 642 / 80 | 732 / 84 | 10 | no |
| 1024 | 45 | 434 / 80 | 524 / 84 | 10 | no |
| 810 | 45 | 327 / 80 | 417 / 84 | 10 | no |
| 390 | 45 | 34 / 80 | 290 / 84 | 176 | no |

The **10px gap at 810+ is the original's own** dot-group↔"Learn more" gap, unchanged. At 390
the two runs push to opposite edges (the row is left-aligned there, headline `flex-1`), which
is the target's phone behaviour. **Strip stays 45px — one line — at every tier**, so the
`bannerH` measurement the hide-on-scroll transform depends on is unaffected.

Underline computed as `underline / 3px offset / 1px thickness`. The 3px offset is ours, not
measured — the target's "Learn more" is not in the capture in a state that exposes its
decoration. Chosen so the rule clears the descender on the "g" of "Coming".

**Still open:** the announcement has no page behind it (see above).

---

### 2026-08-05 — nav links scroll in-page or go inert; no more 404 routes

**Trigger:** user — *"ok make the navbar do nothing for now or just scroll to each
sections"*.

**The seven labels stay; only their destinations changed.** Two of the seven have something
on this page to reach, so those scroll. The other five render as **plain text, not links**:

| label | href | why |
|---|---|---|
| Services | `#services` | the services block (`WhyRogo`) — id added |
| Industries · Work · Insights · Playground · About | `null` | no section and no page exists |
| Contact | `#contact` | the footer — the closing CTA lives inside it in the original |

**Why inert rather than `#` or a dead route.** `/services`-style hrefs 404. A bare `#` jumps
to the top, which reads as a broken link. An element with no href is also **not focusable**,
which is the correct answer for something that cannot be activated — a keyboard user should
not land on it at all. Rendered as `<span aria-disabled="true">` at 50% opacity, so an item
that does nothing does not look identical to one that works. Give a slug an `href` the moment
its target exists.

**The inert items keep the link's exact box** (`h-9 px-3 py-2`). The ≥1200 row is absolutely
centred on the header (`left:50% + translateX(-50%)`), so it is sized by its contents —
swapping one item for a narrower element would shift the whole row off centre.

**Anchors added:** `id="services"` on the `WhyRogo` section, `id="contact"` on the `footer`.
Both carry `scroll-mt-24` (96px) to clear the sticky 72px header — without it the target's
heading lands underneath the bar. Verified: clicking Services leaves the section top at
**exactly 96px**.

**Every CTA moved from `/contact` to `#contact`** — hero, both nav buttons, the footer button
and the footer's "Let's start" link. Five buttons that used to 404 now land on the closing
CTA.

**`scroll-behavior: smooth` added to `html`** in `globals.css`. Safe to declare
unconditionally: the existing `prefers-reduced-motion` block already forces
`scroll-behavior: auto !important`, so it never overrides a user asking for less movement.

**Measurement note for whoever tests this next.** Clicking Contact lands at scrollY **5286**,
not at a position that puts the footer top at 96px. That is correct, not a bug: 5286 IS the
document maximum (`scrollHeight 6186 − innerHeight 900`), and the footer is the last element,
so the page cannot scroll further. A first test run also showed Contact "not scrolling" —
that was a test artifact, not the site: the harness called `scrollTo(0, 0)` between clicks,
and with smooth scrolling now on `html` that reset was still animating when the click fired.
Reload between anchor tests rather than scrolling to top.

### 2026-08-03 — the logo's face identified as Inter Bold; tracking corrected

**Trigger:** user sent their CLIX lockup — *"i want this font"*.

**Answer: it is Inter Bold, which this repo already vendors.** No new licence.

**Method — proportion, not eye.** Ink-width ÷ ink-height for C, L, I, X is scale-free, so a
29px-tall screenshot still identifies a face. 16 candidates, RMS error on those four ratios:

| | C | L | I | X | err |
|---|---|---|---|---|---|
| reference | 0.862 | 0.655 | 0.207 | 0.897 | — |
| **Inter 700** | 0.880 | 0.633 | 0.213 | 0.927 | **0.0209** |
| Outfit 700 | 0.878 | 0.646 | 0.224 | 0.946 | 0.0275 |
| Plus Jakarta Sans 800 | 0.910 | 0.619 | 0.213 | 0.865 | 0.0341 |
| DM Sans 700 | 0.897 | 0.616 | 0.199 | 0.849 | 0.0358 |

Tracking is excluded from scoring on purpose — it is a setting, not part of the face.

**Corrected:** tracking `0.1em` → `-0.015em`. The logo's set width is 3.034 ink-widths per
cap height against Inter's natural 3.099, so it is a hair tight and nothing more. The 0.1em
was my reasoning that tracking separates a logo from adjacent nav links; the brand asset
says otherwise and wins. `marginRight` still cancels the trailing gap — negligible now, but
only correct with it.

**Method traps, each of which yields a confident wrong answer:**
- **Google Fonts CSS2 returns one `@font-face` per subset and Latin is LAST.** Taking the
  first `url()` gives a file with no A–Z. It loads clean and renders as the fallback; all 16
  candidates then score *identically*, which is the only symptom.
- **`document.fonts.check()` verifies the family loaded, not glyph coverage** — `true` for
  all 16 Cyrillic-only files. Test coverage by measuring against a family that cannot exist
  and requiring a width difference.
- **A `@font-face` is inert until requested**, so `document.fonts.ready` resolves instantly
  and everything measures the fallback. `document.fonts.load()` each face first.

**Not done:** the lockup pairs the mark with the wordmark; the nav still shows the wordmark
alone. Adding the mark needs a call on the gap and the mark's height — not asked for.

### 2026-08-03 — logo is the clix wordmark, not rogo's

**Trigger:** user, on a hero screenshot — *"make it CLIX instead of rogo"*.

**Done**
- New `src/components/ui/ClixWordmark.tsx`; `RogoWordmark` is unmounted but **kept**, since
  it is the target's own logotype captured verbatim and is what the clone is graded against.
- Set in type rather than drawn. There is no capture to be faithful to for our own brand, and
  the face is one the site already loads — outlining it would add bytes and make the mark
  unsearchable for nothing.

**Measured, against the real loaded Inter (not guessed) — `wordmeasure.js`:**

| | width of "CLIX" | cap height |
|---|---|---|
| Inter 700 / 22px / 0.1em | 61.6px | 15.0px |
| the rogo SVG it replaces | 60px box | ~16.7px ascender |

So it drops into the same optical slot and the nav's rhythm is unchanged.

**Two details that are load-bearing:**
- **Tracking is what makes it read as a mark.** The nav links beside it are also Inter, so
  weight alone does not separate the logo from them.
- **CSS paints letter-spacing *after* the final glyph**, so the run sits 2.2px left of centre
  in its own box and the mark reads as misaligned against the nav's left edge. `margin-right:
  -0.1em` cancels it.

**Both logo boxes lost their fixed `w-[60px]`** and now size to the text. Safe at both tiers:
the compact row's logo is the lone child of a `justify-between` group, and the ≥1200 row's
centred nav is absolutely positioned, so neither moves when the logo's width changes.

**Also changed, one step beyond the ask:** the footer copyright, `Rogo AI` → `clix`. A clix
mark above a `© ROGO AI` line names the wrong copyright holder.

**Deliberately NOT changed: body copy.** "Rogo" still appears in the hero tagline, the
`why-rogo` headline and five item bodies, one `by-the-numbers` caption, and all three
testimonial quotes. Needs the user — and **the quotes are a hard no by default**: they are
real statements attributed to named executives at Truist, Nomura and Baird, so swapping the
product name inside them would fabricate a quote from a real person.

**Open:** `LOGIN_HREF` still points at `https://tryrogo.com`, along with every other link
destination — already flagged, unchanged here.

### 2026-08-03 — bar tracks the section behind it (three-way, not boolean)

**Trigger:** user, looking at localhost scrolled to the footer — *"the navbar is color white
i want the bar to be black when black"*.

**The problem.** The colour flip was a boolean: over the hero → transparent, past the hero →
solid white. That was correct while everything below the hero was light. `security` and
`footer` are both `ink`, so the white bar ended up sitting on a black page.

**Done**
- Replaced the boolean with `NavTheme = "hero" | "light" | "dark"`.
- **Each section declares its own `data-nav-theme`** — `hero` on `#hero`, `light` on
  `testimonials`/`why-rogo`/`by-the-numbers`, `dark` on `security`/`footer`. The nav holds
  no list of section names, so adding a section can't leave it stale; untagged falls back
  to `light`.
- Dropped the `IntersectionObserver` on `#hero`. The theme is now probed inside the
  **existing** rAF scroll pass: find the `[data-nav-theme]` element whose box spans the nav
  row's bottom edge. Sections are contiguous, so exactly one matches.
- Bar background is the only three-way value: `paper` / `ink` / the capture's near-transparent
  at-rest fill (`rgba(21,21,21,0)` at ≥1200, `rgba(21,21,21,0.01)` below).

**Decisions**

- **`dark` reuses `hero`'s content palette exactly** — white logo, white links, `paper`-fill
  `Request Demo`. So one `light` boolean still drives every text, ring and border class and
  only `background-color` branches three ways. Renaming `scrolled` → `light` was a
  same-polarity swap, which kept the diff to the state machine rather than the markup.
- **Probe replaces the observer rather than joining it.** The old `rootMargin: -navH` was
  already "is the boundary above or below the nav's bottom edge"; the probe asks the same
  question of every section instead of just the hero, so **the flip point is unchanged**.
  One mechanism, not two.
- **Merged into the banner's rAF**, not a second listener: both answers need `navH` and the
  current scroll position, so splitting them would measure the same boxes twice a frame.
  The section list is cached and only re-queried on resize.
- **The nav height is re-read every frame** rather than cached with a resize handler. It is
  two `offsetHeight` reads on elements already in the layout pass; caching it was what made
  the old observer need its own `arm()`/resize plumbing.

**Verified** — CDP sweep at 1440 and 390, sampling the middle of every section plus 40px
past each boundary (12 points per tier, 24 total). Every one matches the section's declared
theme on **both** the bar's background and the logo's colour:
`hero` → `rgba(21,21,21,0)` / `rgba(21,21,21,0.01)` + white logo · `light` →
`rgb(255,255,255)` + `rgb(21,21,21)` logo · `dark` → `rgb(21,21,21)` + white logo.
`tsc --noEmit`, `npm run build` and `eslint src` all clean. Looked at over both dark
sections at 1440.

**Open** — **not observed on the live site.** The screenshot that gave us the light scrolled
state was taken over `testimonials`, which is light; rogo.ai's behaviour over its own dark
`security`/`footer` is unknown. If it keeps a white bar there, this is a deliberate
divergence rather than a clone. Recorded as one in `FEATURE.md`.

### 2026-08-03 — banner hide eased too

**Trigger:** user — *"when the black section is collapsing or hiding add the smooth
animation to it as well"*.

**Done**
- Dropped the scroll-tracked hide. Rule is now `shift = (down && scrollY > 0) ? bannerH : 0`
  with `transition-transform 300ms var(--ease-rogo)` applied unconditionally, so both
  directions animate identically.
- The `scrollY > 0` guard matters: `down` initialises to `true`, so without it a fresh load
  at the top would render with the banner already collapsed.
- Dropped the `revealing` state that gated the transition — no longer needed.

**Decision — two-position animation, not scroll-tracking.** The previous
`min(scrollY, bannerH)` hide was the more literal model (a banner behaving as though it
weren't in the fixed box) but it ties the motion to scroll velocity, which reads as a jerk
at the top of the page. Symmetry with the reveal wins.

**Verified** — sweep at 1536 sampling at t+120ms and settled:
- hide, +120ms: `-4.32`. A 300ms `cubic-bezier(.44,0,.56,1)` at t=0.4 gives 0.096 →
  45 × 0.096 = 4.3. So the curve is the one we think it is, not a linear fallback.
- reveal from depth (y=900, scrolling up): `-45` at +120ms, settled `none`.
- y=0 on load: `none` — never starts collapsed.
- `npm run build` clean; `eslint` clean in `src/`.

**Open** — 300ms is still an estimate, now for both directions.

### 2026-08-03 — banner reveals on scroll up

**Trigger:** user — *"when i scroll up the black section in the navbar appears again"*,
confirming the direction-aware behaviour flagged as open in the previous entry.

**Done**
- `shift = down ? min(scrollY, bannerH) : 0`. One expression covers both halves: going down
  it still scrolls off naturally near the top and stays off; going up it returns to 0 at any
  depth. 4px deadzone on the direction test so inertial jitter cannot flip it.
- Transition applied **only while revealing** (300ms `--ease-rogo`). Down, `shift` follows
  the scrollbar and an ease would lag it; up, `shift` jumps 45 → 0 in one frame and needs it.

**Verified** — CDP sweep at 1536, down then up then down:
| | y | transform | banner bottom |
|---|---|---|---|
| down | 200 → 1057 | `-45` | 0 (off) |
| up | 900 | `none` | 45 (back, deep in the page) |
| up | 200 → 0 | `none` | 45 |
| down | 30 | `-30` | 15 (mid scroll-off) |
| down | 300 | `-45` | 0 |

The y=1000 sample also caught the colour crossfade in flight — `rgba(255,255,255,0.9)`,
logo `rgb(28,28,28)` — which is the 300ms transition being sampled, not a wrong value.

`npm run build` clean; `eslint` clean in `src/`.

**Open** — reveal timing is still an estimate, and whether the original requires a minimum
up-distance before firing is unknown (our 4px deadzone is an anti-jitter choice, not a
measurement).

### 2026-08-03 — banner decoupled from the colour swap

**Trigger:** user — a rogo.ai screenshot showing the header **already light with the banner
still on screen**, *"the black section should be hidden when i scroll"*.

**The finding.** That frame is impossible in our build, which is how we know it is the live
site and not ours: banner-away and colours-light were welded to one boolean, so no scroll
position could produce one without the other. Swept 0→1057 at 1536 and 1920 to confirm —
transform and background flip on the same row of the sweep, every time. **The two are
independent behaviours on the original.**

**Done**
- Banner now tracks scroll on its own: `translateY(-min(scrollY, bannerH))` on the fixed
  header, driven by a rAF-throttled passive scroll listener. It is gone by 45px of scroll
  and returns only as you come back to the top — i.e. exactly as if it were not inside the
  fixed box. No threshold, nothing to tune.
- **Not transitioned.** It follows the scrollbar; an eased transform would just lag it. The
  colour swap keeps its 300ms crossfade.
- `aria-hidden` + `inert` moved from the colour flag to `bannerGone`.
- Colour swap still fires on the hero boundary, unchanged.

**Verified**
- Re-swept at 1536: banner off from y=200 onward, bar still `rgba(21,21,21,0)` and logo
  still white through y=900, both flipping at y=1000 as the hero's bottom reaches the nav.
- `tsc --noEmit` and `npm run build` clean.

**Open**
- The live frame had the banner *present* at testimonials depth, where scrolling down had
  already removed it — that points at a **direction-aware header** (scroll up → banner
  returns). Not implemented; ours only restores it near the top. Worth one look on the
  live site before deciding.

### 2026-08-03 — scrolled state

**Trigger:** user — a screenshot of localhost beside one of rogo.ai, both scrolled into the
testimonials block, *"look at the difference"*.

**The difference.** The section itself matched (card edges within ~4px, identical quote line
breaks, identical type). The header did not: ours stayed in its at-rest state — banner still
pinned, white text on a transparent bar — so over `canvas` `#f7f7f7` the whole nav was
effectively invisible. The real site had no banner and a solid white bar with dark content.

**Done**
- Added a `scrolled` flag to `Nav.tsx` and the full palette swap in `FEATURE.md`'s new
  "Scrolled state" table. Banner slides away with the header; colours crossfade.

**Measurements worth keeping**

- **The capture proves a second nav variant exists and withholds every value in it.** The
  rendered nav is `.framer-2f1yb.framer-v-174l6nt` (`data-framer-name="Transparent Dark"`);
  the stylesheet also carries `.framer-2f1yb.framer-v-yxrzsa`, and the *entire* delta
  between them is `overflow:visible`. Framer applies variant colours inline from JS, so a
  static capture can never yield them. Same story for the logo — it renders variant
  `data-framer-name="Light"`, implying a dark sibling we cannot see.
- **The banner is part of the fixed block.** `.framer-1lcee9e` is one
  `position:fixed; top:0; overflow:hidden` box holding banner + header, with
  `will-change:transform` on it. So "banner disappears on scroll" is a transform on the
  whole header, not a separate collapsing element. Measured heights: banner 45px,
  nav row 74px (390) / 60px (1440).

**Decisions**

- **One trigger drives both effects** — banner-away and colours-light happen together, off
  an `IntersectionObserver` on `#hero`. Two independent triggers would have been two
  inventions; this is one, and it reproduces both observed states exactly.
- **Flip point = hero bottom reaching the nav's bottom edge**, via
  `rootMargin: -<navHeight>px 0 0 0`. Chosen over a `scrollY > n` threshold because a
  threshold would put a white bar over the dark hero mid-scroll. Not verified.
- **The two header rows are measured separately**, not off the `<header>` box — the open
  mobile panel lives inside that box and would inflate the reading. Exactly one row is
  displayed per tier so the other measures 0.
- **The mobile panel's buttons keep the dark-surface palette** regardless of `scrolled`;
  the panel is `bg-ink` in every state.
- Focus rings flip with the state too — `ring-paper` on the dark bar would vanish on white.

**Verified**
- CDP at 1440 and 390, at rest and scrolled into `#testimonials`. Rest state unchanged:
  `transform:none`, banner visible, bar `rgba(21,21,21,0.01)`, logo `rgb(255,255,255)`.
  Scrolled: `matrix(1,0,0,1,0,-45)`, banner off-screen, bar `rgb(255,255,255)`, logo and
  links `rgb(21,21,21)`, `<1200` border `rgba(168,162,158,0.2)`.
- `tsc --noEmit` and `npm run build` clean.

**Open / deferred**
- Flip point unverified; 300ms/`--ease-rogo` timings are estimates, as everywhere else.
- Whether the scrolled ≥1200 header carries a bottom border — screenshot inconclusive,
  ours has none.

### 2026-08-02 — built

**Done**
- Extracted both `ssr-variant`s of `Navigation + Banner` from the capture and pulled every
  CSS rule touching the 71 framer classes in the block, grouped by media query.
- Vendored the rogo wordmark from the capture's SVG defs (`#svg-124366052_1499`) as
  `src/components/ui/RogoWordmark.tsx`.
- Built `Nav.tsx`: banner (2 layouts), header (2 layouts), mobile panel, both buttons.
- Added `banner` + `hairline-light` tokens to DESIGN-SYSTEM.md and the `@theme` block.

**Decisions**
- **The banner and the header switch at different widths** — banner at 810px, header at
  1200px. Found by mapping every `hidden-*` class back to the media query that hides it
  rather than reading it off the visual. Anyone who assumes a single breakpoint will get
  the 810–1199.98 tier wrong: it has a *centred* banner over a *hamburger* header.
- **Nav links are absolutely centred** (`left:50%` + `translateX(-50%)`), not laid out by
  `space-between`. Deliberate in the original — it keeps the links optically centred on the
  page no matter how wide the button group gets. Reproducing it with `justify-between`
  would drift the links left as the buttons grow.
- **Kept the invisible 8px dot** in the banner (`.framer-pjucs6-container`). It has
  `border-radius:10000px` but no declared fill, so it renders nothing — but removing it
  would close up 18px (8px box + its 10px gap) on every tier.
- **Two coincident bottom borders** on the <1200 header — `#ffffff26` on the outer block and
  `hairline` on the inner row. Both reproduced; they overlay rather than stack because the
  padding lives on the inner element. Looks redundant, is what the capture says.
- **Menu glyph is a *split* two-bar mark**, four subpaths with a gap in each bar — not three
  even lines. Path taken verbatim; drawing three rules would have been a redraw.
- Did **not** extract a shared `Button` primitive yet. The nav button (36px tall) and the
  hero CTA (44px, `h-11`) are genuinely different variants, and retrofitting the hero would
  put its CDP-verified measurements at risk for no gain. Extract at the third use — the
  footer CTA.

**Measurements worth keeping**
- Header inner is `max-width:1280px` = the existing `--container-max`; the 1200px/390px
  widths in the CSS are Framer *canvas* defaults, overridden to `width:100%` inline. Don't
  mistake them for breakpoints.
- Button internals: outer padding `8px 16px`, inner row `height:20px` with `padding:1px 0 0`
  → 36px total. The 1px top pad is an optical nudge for Inter's baseline; keep it.
- Border on both buttons is `1px solid rgba(168,162,158,0)` — present but fully transparent.
  It exists so the box doesn't resize if a state colours it in.
- `hairline` `#a8a29e33` **is exactly** `rgba(168,162,158,0.2)` (0x33 = 51/255 = 0.2). The
  capture writes it the long way in this block; it's the same token, reuse it.
- The banner link's `color .3s cubic-bezier(.44,0,.56,1)` is the **only authored transition
  in the whole capture**. Everything else is Framer Motion in JS and must be observed live.

**Skills invoked**
- None. `gsap` and `framer-motion` triggers do not match: the nav has no scroll-driven or
  mount/exit motion in anything observable. The mobile panel is a plain conditional render;
  if the live site turns out to animate it, `framer-motion` becomes the right tool.

**Open / deferred**
- Mobile menu panel is **invented** — not in the capture. Biggest known divergence.
- Scroll state unknown; the `Transparent Dark` variant name hints at a second state.
- `Indicator` (1px, `left:128px right:195px`, `opacity:0`) not implemented — purpose unclear.
- `Request Demo` has no `href` in the original; ours points at `#request-demo`.
- Not yet compared against the reference screenshots at any tier.
