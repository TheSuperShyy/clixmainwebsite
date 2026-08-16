# Feature: 404 / Not found

| | |
|---|---|
| Slug | `not-found` |
| Page(s) | every unmatched path, both locales |
| Order on page | the whole page |
| Status | `review` |
| Reference | **none — see below** |
| Original Framer name | **none** |
| Component | `src/app/_routes/NotFoundRoute.tsx` |

## Purpose

Answers any URL no route claimed, in the visitor's own locale, with the site's chrome and a
way back. Added 2026-08-16, when eight of the footer's own links pointed at routes this repo
does not have and all of them landed on Next's bare built-in 404.

---

## ⚠️ THIS SECTION HAS NO REFERENCE AND CANNOT HAVE ONE

Every other entry in `features/` is measured against `docs/reference/target/` or against the
real clix site. **Neither has a 404 page in any capture**, and you cannot capture one that was
never authored. So the normal rule — *measure, don't eyeball* — has nothing to measure here.

What that rule is replaced by: every value on this page is **borrowed from a section that WAS
measured**, so nothing is invented even though nothing is cloned. The borrowings are listed
below, each with its source. A new value that cannot name a source does not belong here.

| Property | Value | Borrowed from |
|---|---|---|
| Band background | `ink` | `security`, `footer` — the site's two dark bands |
| `data-nav-theme` | `dark` | `footer`; the valid set is `hero \| light \| dark`, declared in `Nav.tsx` |
| Band top padding | `pt-[198px]` | `ContactHero`, which took it from `CompanyHero`; identical at every tier |
| Band min height | `min-h-svh` | **this page's own**, and `svh` not `vh` so a mobile URL bar cannot shift the footer over the fold |
| Container | `max-w-[var(--container-max)]`, `w-px flex-[1_0_0]` | the standard container idiom, every section |
| Eyebrow ("404") | 14px `font-sans` `font-medium` `text-muted` | `ContactHero`'s own eyebrow |
| `<h1>` | 44px, 48px ≥810, `leading-[1.1em]`, `tracking-[-0.05em]`, `text-paper` | the footer tagline `<h2>`, same face and tier split |
| Button | h-44/42/44, radius 6, `bg-paper`, 16px `text-ink` label, `pt-px` optical nudge | the footer's closing CTA, copied verbatim |
| Stack gap | `gap-6` | this page's own |

**No new tokens.** Nothing here was added to `docs/DESIGN-SYSTEM.md`, because nothing needed to
be.

---

## Copy

`src/lib/i18n/{en,he}/notFound.ts`.

| Key | English | Hebrew |
|---|---|---|
| `code` | `404` | `404` (Latin digits in both — a status code is a name, not a quantity) |
| `title` | This page doesn't exist, or doesn't exist yet. | העמוד שחיפשתם לא קיים, או שעדיין לא נוצר. |
| `back` | Back home | חזרה לדף הבית |

**AUTHORED in both locales.** Not SOURCED — there is no captured voice to restore. This is the
only namespace in `src/lib/i18n/` where that is true of every string.

The title's second clause is deliberate. Five of this site's own footer links still have no
page behind them, so for a real share of this page's traffic "not yet" is the honest half of
the sentence. If those pages land, revisit the line.

⚠️ **The English title originally read "doesn't exist — or doesn't exist yet" and the em dash
was removed** to obey the standing 2026-08-10 no-dashes rule. Neither locale contains a dash of
any kind; the Hebrew prefix-hyphen carve-out does not apply, since no string here needs one.

---

## Routing — the part that is not obvious

Four files, and **each of the four is load-bearing**. Deleting any one silently restores a
different bug.

```
src/app/(en)/not-found.tsx          shell: locale literal + metadata
src/app/(en)/[...notFound]/page.tsx catch-all: calls notFound()
src/app/he/not-found.tsx            shell
src/app/he/[...notFound]/page.tsx   catch-all
        └─ all four render src/app/_routes/NotFoundRoute.tsx
```

⚠️ **A `not-found.tsx` is an ERROR BOUNDARY, not a route.** It renders when something in its
segment calls `notFound()`. The only file that additionally catches every unmatched URL is a
ROOT `app/not-found.tsx` — **and this app cannot have one**, because there is no root layout at
`src/app/` (the two root layouts sit inside `(en)/` and `he/`; adding a root not-found exits the
build 1, as recorded in `(en)/layout.tsx`). With the two boundaries alone and no catch-alls,
`/services` matched nothing, reached nothing, and fell through to Next's built-in 404. **Observed,
not predicted** — the boundaries were written, built, shipped, and curled before this surfaced.

The catch-alls exist only to turn *"no route matched"* into *"a route matched and called
`notFound()`"*, which IS a boundary hit. Static routes still win over a catch-all, and route
handlers (`/api/*`) plus metadata routes (`/icon.png`) resolve ahead of the page tree entirely
— all three checked, not assumed.

The catch-all params are never read. The URL is already in the address bar, and echoing an
attacker-supplied path into the page is how a 404 becomes an XSS vector.

---

## Two Next.js behaviours this page compensates for

Both were measured against `next start`, not dev, and both are invisible in English.

### 1. A not-found render does not get its locale root layout

Both locales serve `<html id="__next_error__">` — no `lang`, no `dir`. Body and `<title>`
localise correctly, which is exactly why this hid: the English page looked perfect while **the
Hebrew page laid out left-to-right**, because every `[dir="rtl"]` rule and every Tailwind `rtl:`
variant on this site is an ancestor selector and there was no ancestor carrying `dir`.

Compensated by a `display:contents` wrapper inside the body carrying `lang` and `dir`. It
generates no box, so `position:fixed` Nav, normal flow and `min-h-svh` behave exactly as they do
under a real layout. Verified in the RSC payload: `dir:"rtl"` / `lang:"he"` on `/he/*`,
`dir:"ltr"` / `lang:"en"` on the bare paths.

### 2. A not-found render never reaches Next's scroll reset

Reported by the user as *"the scroll stays in the footer, so we have to scroll up just to see
the 404"*. CDP probe over four navigations at 1440×900:

| Navigation | scrollY before → after | |
|---|---|---|
| `/company` → `/contact` (normal → normal) | 4140 → 32 | fine |
| `/company` → `/privacy` (normal → **404**) | 4130 → **596** | **stuck** |
| `/services` → `/privacy` (404 → **404**) | 596 → **596** | **stuck** |
| `/services` → `/contact` (404 → normal) | 596 → 0 | fine |

**The failures are the two whose DESTINATION is a 404; the origin is irrelevant.** "Clicking in
the footer" was a red herring. Nothing scrolled the visitor to the footer — the stale offset
simply CLAMPED to the new document's maximum (4130 → 596, that page's exact scroll height), and
because this page is short, its maximum *is* the footer.

Compensated by `src/components/ui/ScrollToTopOnRoute.tsx`, rendered only here. After: normal →
404 lands at 41, 404 → 404 at 0.

---

## Acceptance

- [x] Answers every unmatched path in both locales with status **404**, not 200
- [x] Hebrew renders RTL with Hebrew chrome
- [x] Scroll lands at the top of the page, not in the footer
- [x] Keyboard reachable; the button carries the same `focus-visible` ring as the footer CTA
- [x] `npm run build` passes with no type errors
- [x] No new design tokens
- [ ] **Never looked at in a browser at any tier** — verified by status code, RSC payload and
      CDP scroll numbers only
- [ ] Hebrew read by a native speaker
- [ ] Contrast checked (the `muted` eyebrow on `ink` is the same 3.85:1 pairing already flagged
      on `security` and `footer`, and is inherited rather than introduced)

## Open questions

1. **Is the page too bare?** It is an eyebrow, a sentence and a button on a full-height dark
   band. That is a deliberate floor, not a finished opinion — the user has not seen it.
2. **Should it offer anything besides "Back home"?** A short list of real routes, or the
   contact link, would help someone who arrived from one of the five still-dead footer links.
   Not built, because it is a content decision.
3. **A ~28–41px residual scroll offset survives on some navigations**, including normal →
   normal, which predates this page entirely. Well inside the band's own `pt-[198px]`, so the
   heading is fully visible and nothing is cut off. Not chased.
