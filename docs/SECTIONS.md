# Sections Registry

Master list of every section to clone, in page order. This is the plan and the status board.

**Status values:** `todo` · `measuring` · `building` · `review` · `done` · `blocked`

Inventory taken from the 2026-08-02 capture of <https://rogo.ai/>
([docs/reference/target/](reference/target/)). Section order and the *Original name* column
come from the target's own `data-framer-name` attributes — not from guessing at the visual.

## Home page

| # | Slug | Section | Original name | Status | Notes |
|---|---|---|---|---|---|
| 1 | `nav` | Navigation + announcement banner | `Navigation + Banner` | **`review`** | **Built** → [features/nav/](../features/nav/). `position:fixed`, overlays the hero. **Two different breakpoints:** banner switches layout at **810px**, header switches full-nav→hamburger at **1200px** — the 810–1199.98 tier has a centred banner over a hamburger header. **Scrolled state added 2026-08-03** from live screenshots. **Two independent behaviours, not one:** the banner is direction-aware (`shift = (down && scrollY > 0) ? 45 : 0`, eased 300ms both ways — out on the way down, back on the way up at any depth), while the bar's palette **tracks the section behind it** — a three-way `hero`/`light`/`dark` state driven by a `data-nav-theme` attribute each section carries, not a boolean. Over `security` and `footer` (both `ink`) the bar goes solid `ink` with the hero's own white content palette; over the light sections it goes solid `paper` with `ink` logo/links and an inverted `Request Demo`. The **`dark` state is a user request and has NOT been observed on the live site** — possibly a deliberate divergence. Proven independent by a live frame showing a light bar *with* the banner — impossible from a single state flag. The capture could never have supplied this — it declares the sibling variant `.framer-v-yxrzsa` but every colour in it is applied inline from JS. Unticked: not yet compared to the reference at any tier; the mobile menu panel is **invented** (never rendered in the capture); the scroll **flip point** is ours (hero bottom ↔ nav bottom, not measured); the `Indicator` element unresolved. |
| 2 | `hero` | Hero | `Hero` (`#hero`) | **`review`** | **Built** → [features/hero/](../features/hero/). All four tiers verified via CDP at exact viewports; no overflow; build clean. h1 `64/64/56/48px`. Unticked: CTA hover/active and entrance motion — **not observable in the capture**, need a look at the live site. |
| 3 | `logo-carousel` | Customer logo wall | `Logo Carousel` | **`review`** | **Built** → [features/logo-carousel/](../features/logo-carousel/). ⚠️ **Not a sibling section — it renders INSIDE `<section id="hero">`**, `absolute bottom:0 height:248px`. The "#3, after the hero" placement in this table was an inventory guess from the visual and was wrong; verified against the capture's tag offsets. 14 logos at measured boxes, doubled track, `gap:56px`, 8-layer progressive blur. → `gsap`. Unticked: not compared to the reference at any tier; **marquee speed is estimated** (50 px/s) since a static capture can't encode a rate. |
| 4 | `testimonials` | Testimonials | `Testimonials` (`#testimonials`) | **`review`** | **Built** → [features/testimonials/](../features/testimonials/). One-open accordion: 600px three-column row at ≥1200 (open `calc(66% - 24px)`, closed `17%`, gap 12), stack below. Quote type drops **28 → 20px** under 1200 — the capture hides this in the *open* mobile variant only. Built with **CSS transitions, no animation library** — neither the `gsap` nor the `framer-motion` trigger matches a two-state toggle; the "`framer-motion`" note in the original inventory row was a guess from the visual. Unticked: motion timings are **estimated**; **two inherited contrast failures** (role text 2.50:1, logo marks 1.92:1) await the user's call; hover state unobserved. |
| 5 | `why-rogo` | Why financial institutions choose Rogo | `Series C Tenants` | **`review`** | **Built** → [features/why-rogo/](../features/why-rogo/). Two equal columns (`flex:1 0 0; width:1px`) with a **CSS-sticky headline** at `top:96px`; 5 items, each an icon tile + heading + body over a hairline rule. **The items are deliberately not uniform:** item 1 alone has `padding-top:72px` (what aligns the h2 with the first tile), items 4–5 gap 32 where 1–3 gap 28, item 5 alone has no rule, item 4's icon is 3px high in its frame. **Tablet headings are *bigger* than desktop's** — 28px vs 24px, on all five. Built with **no animation library** — the pin is native `position:sticky` and the capture emits zero `data-framer-appear-id` here, so a GSAP pin would add a pin-spacer the original doesn't have. **Framer's internal name is stale** ("Series C" vs. the Series D banner; "Tenants" is the author's spelling of *tenets*) — ignore it, slug is descriptive. Unticked: not diffed against the live site; hover states unobserved (the capture has no `:hover` anywhere in the subtree). |
| 6 | `by-the-numbers` | By the numbers | `By the Numbers` | **`review`** | **Built** → [features/by-the-numbers/](../features/by-the-numbers/). 3 rows on a `card` `#eeedec` panel — 40,000+ users, 50,000+ daily queries, 300+ institutions — each a display number beside a bottom-aligned caption, over a `hairline` `border-top`. **`844 + 436 = 1280`**: the number cell's cap and the caption cell's cap sum to `--container-max`, so both bind at once and the caption column never drifts. Number leading is an **absolute `128px`**, so 96px (1200–1599.98) and 108px (≥1600) give identical 161px rows. **The count-up guess in this row was wrong** — the capture has zero `data-framer-appear-id`, zero transitions and no `:hover` in the subtree, so it was built static and `gsap` was declined; a JS code component could still do it, and that is the section's top open question. Unticked: not diffed against the live site. |
| 7 | `security` | Built for enterprise, secure by design | `Security` (`#security`) | **`review`** | **Built** → [features/security/](../features/security/). The one dark section below the hero. Centred headline (**no `<br>`** — both lines come from a `400px` measure) over a 5-badge grid that drops 5 → 2 → 1 columns. 5 badge SVGs vendored to [public/badges/](../public/badges/), validated by rasterising. **Framer paints `data-border` on an `::after` overlay, not the box model** — which is how the original leaves the grid outline **ragged below 1200px** without anything reflowing: GDPR has `border-right:0` at both the 2-col and 1-col tiers, so the shape is open. Reproduced verbatim; **needs the user's call**. Also **needs a call: labels are `3.85:1` on `ink` and fail AA** (`#7f7f7f` would reach 4.56:1) — inherited, not introduced. Two delivery mechanisms and two label weights split the same way across the five badges, i.e. two authoring sessions. Unticked: only the ≥1200 tier compared to a live screenshot. |
| 8 | `footer` | Footer + closing CTA | `Footer` | **`review`** | **Built** → [features/footer/](../features/footer/). CTA "Unlock financial AI for your firm" + demo button sits **inside** the footer block, as the inventory said. A **nested Framer component with its own tier-gating hashes** (`hidden-1leoyz4`/`16n7npo`/`d23fwj`/`1roolzl`) — re-derived, not reused. ⚠️ **Two of its five variants are never rendered and their CSS is a trap** — `framer-v-1cxbn18` declares a 2-up grid on the link row that looks like the tablet rule and is not. Divider is **two colours by tier** (`ink-soft/50` below 1200, `paper/10` at and above). Link hover is the site's **second measured transition** (`.3s cubic-bezier(.44,0,.56,1)`, colour only). **Three content differences between tiers**, all flagged: "Legal" ships at ≥1200 only, "Press" points at a mailto vs x.com, and the CTA has **no `href` at ≥1200** (the one deliberate deviation — ours uses the original's own `/demo` from its sibling variants). **Needs a call: `muted` titles/copyright are `3.85:1` on `ink` and fail AA.** |

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
