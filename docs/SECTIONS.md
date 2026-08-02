# Sections Registry

Master list of every section to clone, in page order. This is the plan and the status board.

**Status values:** `todo` · `measuring` · `building` · `review` · `done` · `blocked`

Inventory taken from the 2026-08-02 capture of <https://rogo.ai/>
([docs/reference/target/](reference/target/)). Section order and the *Original name* column
come from the target's own `data-framer-name` attributes — not from guessing at the visual.

## Home page

| # | Slug | Section | Original name | Status | Notes |
|---|---|---|---|---|---|
| 1 | `nav` | Navigation + announcement banner | `Navigation + Banner` | **`review`** | **Built** → [features/nav/](../features/nav/). `position:fixed`, overlays the hero. **Two different breakpoints:** banner switches layout at **810px**, header switches full-nav→hamburger at **1200px** — the 810–1199.98 tier has a centred banner over a hamburger header. Unticked: not yet compared to the reference at any tier; the mobile menu panel is **invented** (never rendered in the capture); scroll state and the `Indicator` element unresolved. |
| 2 | `hero` | Hero | `Hero` (`#hero`) | **`review`** | **Built** → [features/hero/](../features/hero/). All four tiers verified via CDP at exact viewports; no overflow; build clean. h1 `64/64/56/48px`. Unticked: CTA hover/active and entrance motion — **not observable in the capture**, need a look at the live site. |
| 3 | `logo-carousel` | Customer logo wall | `Logo Carousel` | **`review`** | **Built** → [features/logo-carousel/](../features/logo-carousel/). ⚠️ **Not a sibling section — it renders INSIDE `<section id="hero">`**, `absolute bottom:0 height:248px`. The "#3, after the hero" placement in this table was an inventory guess from the visual and was wrong; verified against the capture's tag offsets. 14 logos at measured boxes, doubled track, `gap:56px`, 8-layer progressive blur. → `gsap`. Unticked: not compared to the reference at any tier; **marquee speed is estimated** (50 px/s) since a static capture can't encode a rate. |
| 4 | `testimonials` | Testimonials | `Testimonials` (`#testimonials`) | `todo` | "Helping finance teams build smarter organizations". Interactive: per-provider cards (Truist, Nomura, Baird) with `Open`/`Closed` and `… Selected` states, plus-button toggles, and separate `Desktop`/`Mobile` layouts. The most stateful section on the page — `framer-motion`. |
| 5 | `why-rogo` | Why financial institutions choose Rogo | `Series C Tenants` | `todo` | 5 feature cards: domain expertise, AI agents, system integration, output quality, deployment. **Framer's internal name is stale** ("Series C" vs. the Series D banner) — ignore it, slug is descriptive. |
| 6 | `by-the-numbers` | By the numbers | `By the Numbers` | `todo` | 3 stat cards — 40,000+ users, 50,000+ daily queries, 300+ institutions. Check for count-up animation on scroll → `gsap`. |
| 7 | `security` | Built for enterprise, secure by design | `Security` (`#security`) | `todo` | Compliance badges: SOC 2, CCPA, ISO 27001, GDPR, EU AI Act. |
| 8 | `footer` | Footer + closing CTA | `Footer` | `todo` | CTA "Unlock financial AI for your firm" + demo button sits **inside** the footer block, not as a separate section — build them together. Link groups: Overview (Product, Features, Security), Company (About, Careers, Security Advisory Board), Legal (Terms, Privacy), Contact (demo, sales email, LinkedIn, press). |

## Other pages

Linked from the nav, **not yet scoped** — see the open question in [PROJECT.md](PROJECT.md).

`Felix` (product) · `Product` · `Security` · `Company` · `Customers` · `News` · `Careers` · `Log in`

## Order of work

1. **Design system first** — [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) is seeded with the
   target's real tokens, and they are wired into the `@theme` block of
   `src/app/globals.css`. ✅ done 2026-08-02
2. **Shell** — `nav` + `footer` + page container, so every later section lands in real context.
3. **Sections top to bottom**, one at a time, each fully done before the next.
4. **Global pass** — cross-section spacing rhythm, scroll behavior, responsive sweep.

## Blocked / open

| Slug | Blocker | Needed from |
|---|---|---|
| all | Next.js app not yet initialized | Next task |

**Resolved 2026-08-02 — fidelity policy is 1:1.** Fonts and logos are no longer blockers:
the real `.woff2` files (57) and the real customer logo SVGs (14) are vendored under
[public/](../public/). Nothing on this page gets substituted or redrawn.
