# Context: 404 / Not found

Memory for this section. **Newest entry on top.** Append after every task — never rewrite past
entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold, with
no code scanning.

---
## Current state

Built 2026-08-16 and building clean. One `ink` band with an eyebrow, an `<h1>` and a back-home
button, between the shared Nav and Footer, in both locales. Every value borrowed from a section
that was measured; no new tokens.

Four routing files, all four load-bearing — two boundaries and two catch-alls. See `FEATURE.md`
for why the catch-alls are not redundant.

Compensates for two Next.js behaviours that only bite a not-found render: no locale root layout
(which broke Hebrew RTL) and no scroll reset (which left visitors in the footer). Both were found
by measuring, both after the page was already believed finished.

**Status:** `review`
**Next action:** the user has never seen this page in a browser. Show it, get a call on whether
it is too bare, and get the Hebrew read by a native speaker.

---

## Log

### 2026-08-16 — scroll landed in the footer; root cause was the destination, not the click

**Trigger:** user — *"in the 404, when i click in the footer, it goes there but the scroll stays
in the footer, so we have to scroll up just to see the 404"*.

**The report pointed at the wrong thing, and taking it literally would have produced the wrong
fix.** "When I click in the footer" reads as *the footer link is the problem*. A CDP probe over
four navigations at 1440×900 against `next start` said otherwise:

| Navigation | scrollY before → after | |
|---|---|---|
| `/company` → `/contact` (normal → normal) | 4140 → 32 | fine |
| `/company` → `/privacy` (normal → **404**) | 4130 → **596** | **stuck** |
| `/services` → `/privacy` (404 → **404**) | 596 → **596** | **stuck** |
| `/services` → `/contact` (404 → normal) | 596 → 0 | fine |

Both failures land ON a 404; both successes land on a real page. **The origin is irrelevant and
the footer is irrelevant** — the same break happens clicking a dead link from the nav, or from
anywhere else on a scrolled page.

**Root cause.** Next runs its route-change scroll reset (`ScrollAndFocusHandler`) on a normal
segment render. A render that terminates in a `notFound()` boundary never reaches it. The old
offset is then simply CLAMPED to the new document's maximum — 4130 → 596, which is that page's
exact scroll height. **Nothing scrolled the visitor to the footer; they were never moved,** and
this page is short enough that its maximum offset *is* the footer. That also explains the 404 →
404 row, where the numbers are identical before and after.

**Fix:** `src/components/ui/ScrollToTopOnRoute.tsx`, rendered by this route and no other.

Three details in it are load-bearing, and each was chosen against a specific failure:

- **Keyed on `pathname`, not on mount.** The 404 → 404 row is why: clicking `Privacy` from
  `/services` re-renders the same component at the same tree position, React reuses it, and a
  `[]`-dep effect would never fire again. Every dead footer link would have worked exactly once.
- **`behavior: "instant"`.** `globals.css` sets `html { scroll-behavior: smooth }`, so a bare
  `scrollTo(0, 0)` becomes a one-to-two second animation — and this runs inside
  `startViewTransition`, so the browser would photograph frame one and crossfade the old offset
  back over the live page. That is the identical failure `ViewTransitions.tsx` documents for its
  hash landing.
- **Placed as a child, not in the provider.** Child effects run before parent effects, so it
  fires before `ViewTransitionProvider`'s `pathname` effect calls `resolve()` and ends the
  snapshot. Same ordering guarantee the hash landing already relies on.

**Rejected: fixing it in `ViewTransitions.tsx`** by treating "no hash" as "scroll to top". It
would have applied to every route on the site, fighting the handler that already works there,
and its `pathname` effect also fires on popstate — so it would have broken browser back/forward
scroll restoration everywhere to fix one page.

**After:** normal → 404 lands at 41, 404 → 404 at 0, and the two working cases are unchanged.
A ~28–41px residual survives on some navigations *including normal → normal*, so it predates
this page; it is well inside the band's `pt-[198px]` and was not chased.

---

### 2026-08-16 — page created

**Trigger:** user, during the footer-links pass — chose "add a styled 404 while we're in here"
over leaving Next's default.

**Why it did not exist.** No capture has one. The clone target has no 404 and neither does the
real clix site, so there was nothing to clone and no reference to measure — the first section in
this repo built without one. Handled by borrowing every value from an already-measured section
rather than inventing any; the table is in `FEATURE.md`.

**Two findings, each of which cost a rebuild, and both of which were only visible because the
work was checked rather than assumed done.**

**1. The boundaries alone did nothing.** `(en)/not-found.tsx` and `he/not-found.tsx` were
written, built and shipped — and `/services` still served Next's bare 404. A `not-found.tsx` is
an ERROR BOUNDARY for its own segment; only a ROOT `app/not-found.tsx` catches unmatched URLs,
and this app cannot have one (no root layout at `src/app/`). Fixed with `(en)/[...notFound]/` and
`he/[...notFound]/`, catch-alls whose only job is to call `notFound()`. **The design presented to
the user said per-locale boundaries would be sufficient. They were not.**

**2. A not-found render does not get its locale root layout.** Both locales serve
`<html id="__next_error__">` — no `lang`, no `dir`. The body and `<title>` localise correctly,
which is precisely why this hid: English looked perfect while **the Hebrew page laid out
left-to-right**, since every `[dir="rtl"]` rule and `rtl:` variant here is an ancestor selector.
Fixed with a `display:contents` wrapper carrying `lang`/`dir` — no box generated, so fixed-position
Nav and `min-h-svh` are unaffected.

Both were found on `next start`, not `next dev`. The first was caught only because the
verification curl grepped for page CONTENT rather than trusting the 404 status code, which was
already correct while the page was still wrong.

**Copy:** authored in both locales, the only namespace here where no string can be marked
SOURCED. The English title's em dash was removed to obey the standing 2026-08-10 no-dashes rule.
⚠️ **The Hebrew is unread by a native speaker.**

**Not verified:** never opened in a browser at any tier. Status codes, RSC payload and CDP scroll
numbers only.
