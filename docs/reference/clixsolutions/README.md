# Capture: clixsolutions.info — the real Clix Solutions site

**Reference material only. Nothing here is wired into `src/`, and nothing here should be
until the user says so.** Captured 2026-08-04 from `https://www.clixsolutions.info/`.

This is **not** a clone target. It is the user's own company site, captured so its real brand
voice, service list, contact details and design tokens are on hand — the rogo clone in `src/`
still carries rogo's borrowed marketing copy, and this is the material that would eventually
replace it.

```
README.md        this digest
content.json     structured extraction — headings, links, images, full innerText per page
pages/*.html     the 11 raw server-rendered captures (the evidence; re-derive from these)
```

Regenerating: `fetch` each route with Node, then walk the DOM from `file://` in headless
Chrome. Headless Chrome in this environment has **no network egress** and Node does, which is
why it is fetch-to-disk then parse — not a direct navigation. Same constraint documented in
`docs/CONTEXT.md` under 2026-08-03.

---

## What the company is

**Clix Solutions** — an Israeli AI-engineering studio. Tel Aviv, serving globally.

> בינה מהונדסת לעסק שלכם. — *Engineered intelligence for your business.*

They build **AI agents, WhatsApp automations, CRM implementations, integrations, web and
mobile apps, and custom software**, plus AI strategy consulting and corporate training.
Positioning is deliberately anti-hype: *"AI that works, not AI you talk about."*

The site is **Hebrew, `lang="he"`, `dir="rtl"`** throughout. There is no English version.

### Contact details as published

| | |
|---|---|
| Email | `info@clixsolution.com` |
| WhatsApp | `+972 55-948-3457` |
| Hours | Sun–Thu · 09:00–18:00 |
| Location | תל אביב · שירות גלובלי (Tel Aviv · global service) |
| Instagram | `https://www.instagram.com/clix_solution/` |
| Map | `https://maps.app.goo.gl/W3P4cqXgveANBH9p8` |
| Copyright | © 2026 Clix Solutions. כל הזכויות שמורות. |

**Note the three different domain strings in play:** the site is served from
`clixsolutions.info`, the email is at `clixsolution.com`, and `og:image` points at
`clix-solution.com`. See the defects section — one of those does not resolve.

---

## Information architecture

Ten routes, all returning 200. Nav order is RTL, so it reads right-to-left on screen.

| Route | Title | Purpose |
|---|---|---|
| `/` | Clix — בינה מהונדסת לעסק שלכם. | Home |
| `/services` | שירותים | 8 numbered service blocks — the densest page (5,570 chars) |
| `/industries` | תעשיות | 6 sector plays |
| `/work` | עבודות | 4 case-study cards |
| `/insights` | תובנות | 4 articles, one featured |
| `/playground` | פלייגראונד | Interactive drag-and-drop workflow canvas, **desktop only** |
| `/about` | אודותינו | Team — 7 photos + roles |
| `/contact` | צרו קשר | Form + contact details |
| `/privacy` · `/terms` · `/accessibility` | | Legal |

Every page ends with the same closing CTA and footer — the same structural pattern the rogo
clone uses, where the CTA lives inside the footer rather than beside it.

---

## Brand tokens

Pulled from the compiled CSS (`_next/static/chunks/*.css`). These are declared custom
properties, not inferred from screenshots.

### Colour

| Token | Value | Role |
|---|---|---|
| `--bg` | `#f7f9fc` | page background, cool off-white |
| `--bg-warm` | `#eaf0f8` | warm alternate background |
| `--paper` | `#fff` | cards |
| `--fg` | `#1a2238` | body text |
| `--ink` | `#0b1326` | darkest — near-black navy |
| `--ink-warm` | `#0f1a2e` | warm dark |
| `--fg-muted` | `#6e7990` | secondary text |
| `--fg-on-dark` | `#eaf0f8` | text on dark sections |
| `--line` | `#dde4ee` | hairline |
| `--line-strong` | `#bfc9da` | emphasised hairline |
| `--accent` | `#3b7bf5` | primary blue |
| `--accent-2` | `#7fa9f7` | light blue |
| `--accent-deep` | `#1e4db8` | deep blue |
| `--accent-soft` | `#dde9fe` | tinted blue fill |

**The whole system is blue-on-cool-white.** That is a different palette from the clone in
`src/`, which is rogo's warm neutral (`#f7f7f7` canvas, `#eeedec` card). Adopting the real
Clix identity would mean re-tokenising `docs/DESIGN-SYSTEM.md`, not just swapping a wordmark.

Literal hexes outside the token set are all **illustration** colours — WhatsApp greens
(`#25d366`, `#075e54`, `#128c7e`, `#dcf8c6`, `#ece5dd`), macOS traffic-light dots
(`#ff5f57`, `#febc2e`, `#28c840`), and status greens/ambers/reds in the mock dashboards.
They belong to the fake UI screenshots, not the brand.

### Type

Eight families are loaded via `next/font`:

| Variable | Family |
|---|---|
| `--font-rubik` | **Rubik** |
| `--font-google-sans` | **Heebo** |
| `--font-sans-body` | Geist |
| `--font-mono-tech` | Geist Mono |
| `--font-display-grotesque` | Bricolage Grotesque |
| `--font-italic-serif` | Instrument Serif |
| `--font-accent-serif` | Fraunces |
| `--font-discovery-tech` | Space Grotesk |

Resolved stacks:

```css
--default-font-family: var(--font-rubik), var(--font-sans-body), ui-sans-serif, system-ui, sans-serif;
--font-discovery:      var(--font-rubik), var(--font-discovery-tech), var(--font-display-grotesque), …;
```

**Rubik is the actual body face**, with Heebo as the second Hebrew-capable option. Both are
free Google fonts with full Hebrew coverage.

**This settles the Fontshok Discovery question from 2026-08-03.** There is a
`--font-discovery` variable, but it resolves to **Rubik → Space Grotesk → Bricolage
Grotesque** — all free. The live site does not use, and has never used, the ₪708 Fontshok
face; the variable name is aspirational. `src/app/fonts-discovery.css` can stay inert.

---

## Content by page

### `/` — home

`h1`: **מערכות AI מהונדסות לעסק שלכם** — *Engineered AI systems for your business.*

Sections in order:

1. **The stack** (`02 · הסטאק`) — *"כל הכלים שאתם משתמשים בהם מזינים מוח אחד"* / "Every tool
   you use feeds one brain." A 12-item swipeable marquee: Vapi, n8n, Make, OpenAI, Gemini,
   monday.com, WhatsApp, Claude, Google Docs, Google Sheets, Google Calendar, Hostinger.
   **Structurally the same idea as the clone's `logo-carousel`.**
2. **Voice AI** — live demo. Agent answers inbound calls, qualifies leads, books meetings,
   hands off to a human. Mock call UI with a duration timer and a `clix.studio/dashboard`
   workspace mock (`1,284` closed today, `+18%`, p50 `842ms`, `99.9` uptime).
3. **Web + mobile** — *"אפליקציות ואתרים, מהונדסים כמערכות"* / "Apps and sites, engineered as
   systems." Native iOS/Android or React Native; no generic templates, no abandoned code.
4. **Testimonials** — *בקולם של הלקוחות שלנו* / "In our clients' own voices." See below.
5. **Lectures & training** — *"מביאים את צוות המומחים אל החדר שלכם."* Video preview at
   `/lectures/lecture-preview.mp4`.
6. **Methodology** — *"מהירות של מעבדה. משמעת של מפעל."* / "The speed of a lab. The
   discipline of a factory." Four stages: **אבחון** (diagnose) → **תכנון** (design) →
   **בנייה** (build) → **הפעלה** (operate). Weekly usable output, not slide decks.
7. **Closing CTA** — *"אתם מביאים את העסק. אנחנו מביאים את הבינה."* / "You bring the
   business. We bring the intelligence." Response time: under one business day.

Footer tagline: **תוכנה שעובדת, תוצאות שמדברות.** — *Software that works, results that speak.*

### `/services` — the eight offers

Each block is numbered with a benefit-framed kicker, a headline, a paragraph, five bullets,
and an animated mock UI.

| # | Kicker | Service |
|---|---|---|
| 01 | להאיץ מכירות ותמיכה | **סוכני AI** — AI agents. GPT-based, org-data-tuned, multi-agent orchestration with memory + tool use, voice agents, RAG over your knowledge base, human-in-the-loop approval |
| 02 | למכור איפה שהלקוח נמצא | **אוטומציות WhatsApp** — Cloud API + Business templates, AI conversation flows with human handoff, in-chat catalogue/payments/checkout, broadcasts + segmentation, multilingual multi-number routing |
| 03 | לאחד את תמונת הלקוח | **הטמעת CRM** — data modelling + migration, pipeline/automation/reporting setup, email + calendar + telephony integrations, AI enrichment and lead scoring, team training |
| 04 | לחבר את כל המערכות | **אינטגרציות ואוטומציות** — end-to-end workflow design, n8n / Make / Zapier, custom webhooks and middleware, internal dashboards, monitoring + retries + error handling |
| 05 | להמיר תנועה ללקוחות | **בניית אתרים** — Next.js + TypeScript + Tailwind, CMS (Sanity/Contentful/Payload), Shopify/Stripe/headless commerce, Core Web Vitals + SEO, conversion tracking and A/B tests |
| 06 | להגיע ישר לכיס של הלקוח | **פיתוח מובייל** — React Native + Expo, native Swift/Kotlin where it matters, push + deep links + offline-first sync, store submission, crash tracking + OTA updates |
| 07 | לבנות בדיוק מה שצריך | **תוכנה מותאמת אישית** — Next/React/TS, Node/Python/serverless, Postgres + vector DBs + realtime, auth/billing/multi-tenancy/RBAC, cloud + CI/CD + observability |
| 08 | להמר על הדברים הנכונים | **אסטרטגיית AI וייעוץ** — readiness audit, use-case prioritisation, architecture + vendor/model selection, risk + security + compliance review, roadmap and enablement |

Block 08's tagline is the most quotable line on the site: *"לא כל בעיה דורשת AI. אלה שכן
צריכות את ה-AI הנכון."* — **"Not every problem needs AI. The ones that do need the right AI."**

### `/industries` — six sectors

Each: pain → three capabilities → one-line promise.

| Sector | Pain | Promise |
|---|---|---|
| נדל״ן — real estate | Leads fall through cracks; first responder wins | Reply in seconds, not hours |
| פיננסים וביטוח — finance & insurance | Manual processes, heavy regulation, zero margin for data error | Full onboarding without entering a value twice |
| בריאות וקליניקות — healthcare | Reception drowning in scheduling, reminders, callbacks | Less time on the phone, more with the patient |
| קמעונאות ו-eCommerce — retail | Abandoned carts; questions wait hours | A sales channel that works at 2 a.m. |
| לוגיסטיקה ותפעול — logistics | Five tools that don't talk; updates always late | One real-time operational picture |
| חינוך והדרכה — education | Enquiries pile up; personal follow-up doesn't scale | Every enquiry answered immediately |

Closer: *"לא רואים את התחום שלכם? הכאב התפעולי דומה בכל מגזר — בואו נדבר."*

### `/work` — four cases

Titles only; no detail pages, no client names, no metrics beyond what the title claims.

1. **סוכן מכירות AI שמטפל בהזמנות משלוחים 24/7** — AI sales agent handling delivery orders
   round the clock · AI agents · WhatsApp · integrations · 2025
2. **פורטל תפעולי ייעודי לרצפת ייצור עם 200 עובדים** — custom operations portal for a
   200-worker factory floor · custom software · dashboards · 2024
3. **Copilot מבוסס AI שהכפיל את קיבולת צוות התמיכה** — AI copilot that doubled support
   capacity · AI agents · consulting · 2025
4. **200+ אוטומציות שמאחדות מערך מקוטע** — 200+ automations unifying a fragmented stack ·
   integrations · consulting · 2024

### `/insights` — four articles

Cards only in the capture; the article bodies live behind `קראו את המאמר` and were not
followed.

- **אסטרטגיה** *(featured)* — מתי סוכן AI באמת משתלם לעסק ומתי לא · when an AI agent actually
  pays off, and when it doesn't · image `/aipic.jpg`
- **פיתוח** — לבנות לעתיד: תוכנה שלא תצטרכו לזרוק בעוד שנה · building software you won't throw
  away in a year · `/development.jpg`
- **אוטומציה** — האוטומציה ששווה הכי הרבה היא המשעממת ביותר · the most valuable automation is
  the most boring one · `/automations.jpg`
- **אסטרטגיה** — חמש שאלות שכל מנהל צריך לשאול לפני פרויקט AI · five questions before an AI
  project · `/picsai.jpg`

### `/about` — the team

Positioning: *"צוות מקצועי של מומחי אוטומציה ופיתוח — בוגרי יחידה 8200 והטכניון"* — automation
and development specialists, **Unit 8200 and Technion alumni**, building systems for
organisations that take their technology seriously.

Seven photos and seven roles, in DOM order:

| # | `alt` | File | Role |
|---|---|---|---|
| 1 | Elmaliach Ido | `founder.jpeg` | מייסד ומנכ״ל — founder & CEO |
| 2 | Shahar Apote | `team-yarin.jpeg` | מייסד שותף — co-founder |
| 3 | Yarin Yitzhak | `team-shahar.jpeg` | ארכיטקט מערכות — systems architect |
| 4 | Luzon Spring | `team-maayan.jpeg` | מהנדס תוכנה — software engineer |
| 5 | giving | `team-matan.jpeg` | מהנדס תוכנה — software engineer |
| 6 | Ron Ben Harush | `team-new.jpeg` | אסטרטג שיווקי — marketing strategist |
| 7 | Lotan Sabag | `team-lotan.jpeg` | ראש תפעול — head of operations |

The `alt` values and the filenames disagree — see defects.

### `/playground`

An interactive node canvas, gated to desktop (*"הפלייגראונד זמין במחשב בלבד"* — drag-and-drop
doesn't suit a small touchscreen). 12 nodes across four groups:

- **טריגרים** — WhatsApp נכנס · Webhook · תזמון
- **AI** — סוכן AI · מסווג
- **פעולות** — CRM · שליחת WhatsApp · אימייל · Slack
- **נתונים** — בסיס נתונים · HTTP · התפצלות

Ships with an 8-node / 8-connection demo graph pre-loaded.

### `/contact`

Fields: שם מלא · אימייל · חברה · תפקיד · interest multi-select (סוכני AI / WhatsApp / CRM /
אינטגרציות / תוכנה מותאמת אישית / ייעוץ) · **budget band** · free text.

Budget bands: **עד ₪10k · ₪15k–₪25k · ₪25k–₪75k · ₪75k+**

---

## Testimonials — directly relevant to the clone's open question

The real site's testimonials are **video**, not pull-quotes. Four 9:16 portrait clips behind
play buttons (`aria-label="הפעלת עדות של <name>"`), each with a poster at
`/testimonials/<slug>.jpg`:

| Name | Attribution | Poster |
|---|---|---|
| אסף פרץ — Asaf Peretz | מייסד · SalesIQ | `asaf-peretz.jpg` |
| אדיר פרץ — Adir Peretz | בעלים · סטודיו וידאו וצילום | `adir-peretz.jpg` |
| נבו יהלומן — Nevo Yahaloman | מייסד | `nevo-yahaloman.jpg` |
| נועם תובי — Noam Tovi | בעלים · השקעות | `noam-tovi.jpg` |

**No quote text exists anywhere in the markup** — the endorsement is entirely in the video, so
there is nothing here to lift as a written quote. The `.mp4` sources load from a JS chunk on
click and were not followed.

This is a real answer to the question left open in
[features/testimonials/CONTEXT.md](../../../features/testimonials/CONTEXT.md): the clone
currently reproduces rogo's customers (Truist, Nomura, Baird) verbatim, and option (b) —
*real Clix testimonials with permission* — turns out to already exist, with four named people
who have already gone on camera. Swapping them in is a content decision, not a research one.
**Not done, and not to be done without the user asking.**

---

## Defects observed on the live site

Recording these because they were found while reading the markup, not because anyone asked
for an audit. None is acted on here.

1. **`og:image` and `twitter:image` point at a domain that does not resolve.** Both declare
   `https://clix-solution.com/clix-logo.png`; `clix-solution.com` fails DNS. The file is
   fine at `https://www.clixsolutions.info/clix-logo.png` (200, `image/png`). Effect: **every
   link preview — WhatsApp, LinkedIn, X, Slack — renders with no image.** For a company whose
   own pitch is WhatsApp-first, that is the highest-value one-line fix on the list.

2. **Three inconsistent brand domains** — site on `clixsolutions.info`, email at
   `clixsolution.com`, og tags at `clix-solution.com`. At least one is wrong; possibly two.

3. **Team `alt` text is machine-translated and mis-paired.** `team-yarin.jpeg` carries
   `alt="Shahar Apote"` while `team-shahar.jpeg` carries `alt="Yarin Yitzhak"` — swapped.
   Worse, two alts are translated common nouns rather than names: `alt="giving"` on
   `team-matan.jpeg` (מתן → "giving") and `alt="Luzon Spring"` on `team-maayan.jpeg`
   (אביב → "Spring"). A screen-reader user hears "giving" where a person's name belongs.

4. **`/insights` article images have empty `alt`** — acceptable if decorative, but they sit
   inside article cards where they read as content.

5. **`/work` has no detail pages.** Four cards, no links out. Positive claims
   ("doubled support capacity") carry no substantiation.

---

## If this becomes the site

Not a plan, just the honest gap list between what `src/` is now and what this capture shows:

- **RTL.** The clone is LTR English end to end. Hebrew `dir="rtl"` is not a CSS toggle — it
  changes logical properties, icon direction, carousel direction, and every `x`/`xPercent` in
  the GSAP marquee (per the RTL note in the `gsap` skill, positive `x` still moves right and
  does not auto-flip).
- **Palette.** Blue-on-cool-white replaces rogo's warm neutral. `docs/DESIGN-SYSTEM.md` would
  be re-tokenised, not patched.
- **Type.** Rubik + Heebo, both free, both with Hebrew coverage — replacing the vendored ABC
  Arizona Mix and Inter, and removing the Fontshok licence question entirely.
- **IA.** Ten routes against the clone's single page. The clone's dead `/product`-style links
  map onto real destinations here.
- **Sections that already correspond:** stack marquee ↔ `logo-carousel`; four-stage
  methodology ↔ `why-rogo`; dashboard stats ↔ `by-the-numbers`; CTA-inside-footer ↔ `footer`.
  Testimonials correspond structurally but the real ones are video.
