# Skills Registry

Every skill available to this project, and **when it must fire**. Claude reads this before
starting any section and invokes every skill whose trigger matches — automatically, without
being asked.

- **Global skills** live in `~/.claude/skills/` — available in every project on this machine.
- **Project skills** live in `.claude/skills/` — versioned with this repo.

Installation procedure: **CLAUDE.md §4**.

---

## Web-dev skills — installed ✅

All global (`~/.claude/skills/`), verified present on 2026-08-02.

| Skill | Purpose | Trigger — invoke when… |
|---|---|---|
| `gsap` | GSAP + ScrollTrigger: scroll & timeline animation | Section has scroll-driven reveals, pinning, scrubbing, parallax, horizontal scroll, marquee, counters, SVG draw, or any multi-step timeline |
| `framer-motion` | Motion v12+: React component animation | Section has mount/exit transitions, gesture or hover animation, layout animation, `AnimatePresence`, drag, or state-driven motion |
| `ui-ux-pro-max` | Design intelligence — 50+ styles, 161 palettes, 57 font pairings, 99 UX guidelines, shadcn/ui MCP | Making or reviewing layout, spacing, typography, color, shadow, gradient, interaction-state, or accessibility decisions |
| `dataviz` | Charts & dashboards | Section contains a chart, graph, plot, stat tile, KPI row, or sparkline |

**Precedence — GSAP vs Motion.** Both skills state this themselves: GSAP owns scroll-driven,
pinned, scrubbed, and long-timeline work; Motion owns component state, gesture, and
mount/exit. When a section needs both, split by responsibility rather than picking one, and
record the split in that section's `CONTEXT.md`.

## Superpowers — installed ✅ (15 skills)

The full [obra/superpowers](https://github.com/obra/superpowers) workflow suite is present
globally. The ones that fire on this project:

| Skill | Trigger — invoke when… |
|---|---|
| `using-superpowers` | Start of any session — establishes skill-discovery discipline |
| `brainstorming` | Before building any section whose requirements are ambiguous |
| `verification-before-completion` | **Mandatory** before marking any section `done` |
| `systematic-debugging` | Any bug, visual mismatch, or unexpected behavior — before proposing a fix |
| `writing-plans` / `executing-plans` | Multi-section work that needs a written plan first |
| `requesting-code-review` / `receiving-code-review` | After completing a section, before it ships |
| `test-driven-development` | Any logic-bearing component (not needed for static markup) |
| `writing-skills` | Authoring or editing a skill in `.claude/skills/` |

Also installed, situational: `dispatching-parallel-agents`, `subagent-driven-development`,
`using-git-worktrees`, `finishing-a-development-branch`, `prompt-architect`, `prompt-master`.

## Design skills — installed ✅ (project-scoped)

From [lotfb86/web-design-skills](https://github.com/lotfb86/web-design-skills), installed to
`.claude/skills/` so they version with this repo.

| Skill | Purpose | Trigger — invoke when… |
|---|---|---|
| `frontend-design` | Craft-level frontend quality; avoids generic "AI slop" output | Writing any component or page — **for execution quality only** (see guard below) |
| `responsive-design` | Mobile-first layout, CSS Grid/Flexbox strategy, fluid type, container queries, breakpoint systems | Implementing or reviewing a section's behavior across the 4 reference widths |
| `web-design-guidelines` | Reviews UI code against Vercel's Web Interface Guidelines | Reviewing a finished section; part of the §6 done-check |
| `design-system-generator` | Produces a structured `DESIGN.md` (VoltAgent/awesome-design-md format) | Building out `docs/DESIGN-SYSTEM.md` from the measured target |

> ⚠️ **Fidelity guard on `frontend-design`.** Its default posture is "make bold, creative
> design decisions." That is the *opposite* of this project's goal. Use it for code craft —
> markup quality, spacing precision, state handling, polish — and **never** to invent or
> improve on the target's design. The measured values in `FEATURE.md` always win.

### Shared reference library

Not skills, but read by the two skills above (paths already rewritten to match):

| Path | Contents |
|---|---|
| `docs/reference/design-references/` | `design-md-format.md` (9-section DESIGN.md spec), `design-md-index.md`, plus 10 real-site teardowns — Stripe, Apple, Linear, Vercel, Notion, Airbnb, Nike, Spotify, Shopify, Wise. Useful as worked examples of *how deep a measurement doc should go*. |
| `docs/reference/design-rules.md` | Stack-agnostic design rules |
| `docs/reference/accessibility-spec.md` | WCAG AA checklist |
| `docs/reference/contrast-check.js` | Contrast-ratio checker — run during §5 verification |

### Deliberately NOT installed

| Skill | Why skipped |
|---|---|
| `05-website-rebuild` | Hard-codes **Astro 5 + Tailwind v4 + Vercel** ("Exact. Do Not Deviate."), conflicting with our Next.js decision. Worse, it is a *redesign* agent — "$20,000+ agency build", copy optimization, conversion tuning — which is the opposite of a faithful clone. Its useful stack-agnostic parts were lifted into `docs/reference/` instead. |
| `04-theme-factory` | Applies one of 10 invented preset themes. We extract the target's theme; inventing one would damage fidelity. |
| `06-local-business-rebuild`, `07-azerbaijan-website-build` | Out of scope. |

---

## Installation log

| Date | Skill | Location | Source |
|---|---|---|---|
| pre-existing | `gsap`, `framer-motion`, `ui-ux-pro-max` | `~/.claude/skills/` | already installed |
| pre-existing | superpowers suite (15) | `~/.claude/skills/` | already installed |
| built-in | `dataviz`, `artifact-design` | Claude Code built-in | n/a |
| 2026-08-02 | `frontend-design`, `responsive-design`, `web-design-guidelines`, `design-system-generator` | `.claude/skills/` | lotfb86/web-design-skills @ depth-1 clone |
