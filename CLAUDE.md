# CLAUDE.md

Operating rules for this repo. Read fully at the start of every session, then follow the
routing table below instead of scanning the codebase.

---

## 1. What this project is

A **pixel-faithful clone**, built **section by section**, of the target site recorded in
[docs/PROJECT.md](docs/PROJECT.md).

"Faithful" is the hard requirement. Every section must match the original on:
spacing (margin/padding/gap), typography (family, size, weight, line-height, letter-spacing),
color, border-radius, shadow, breakpoint behavior, hover/focus/active states, scroll behavior,
and animation timing/easing. **Approximation is a defect, not a shortcut.**

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS.
Animation libraries are chosen per-section — see the skills registry.

---

## 2. Read-this-not-that (routing table)

Do **not** grep or scan the tree to rebuild context. Read only what the task needs:

| I need to know… | Read |
|---|---|
| What's been done, ever | [docs/CONTEXT.md](docs/CONTEXT.md) |
| Target site, goals, constraints | [docs/PROJECT.md](docs/PROJECT.md) |
| Which sections exist + their status | [docs/SECTIONS.md](docs/SECTIONS.md) |
| Colors, fonts, spacing scale, tokens | [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) |
| How to clone one section, start to finish | [docs/WORKFLOW.md](docs/WORKFLOW.md) |
| Which skills exist and when they fire | [docs/SKILLS.md](docs/SKILLS.md) |
| Everything about *one* section | `features/<section>/FEATURE.md` + `features/<section>/CONTEXT.md` |

**Rule:** for a task scoped to one section, read the global `docs/CONTEXT.md` **tail only**
(latest day) plus that section's own two files. Nothing else.

---

## 3. Folder structure

```
.
├── CLAUDE.md                     ← you are here
├── docs/
│   ├── PROJECT.md                target site, goals, non-goals, constraints
│   ├── CONTEXT.md                GLOBAL memory — daily append-only log
│   ├── SECTIONS.md               master registry + status of every section
│   ├── DESIGN-SYSTEM.md          extracted tokens (single source of truth)
│   ├── WORKFLOW.md               the section-cloning procedure
│   ├── SKILLS.md                 skill registry + auto-invoke triggers
│   └── templates/
│       ├── FEATURE.template.md
│       └── CONTEXT.template.md
├── features/
│   └── <section-slug>/
│       ├── FEATURE.md            spec: what this section is, measured values, acceptance
│       ├── CONTEXT.md            memory: what was done to it, when, and why
│       └── assets/               reference screenshots, extracted images, fonts
├── .claude/
│   └── skills/<skill-name>/SKILL.md
└── src/                          the Next.js app
```

**One section = one folder in `features/`, always containing both `FEATURE.md` and
`CONTEXT.md`.** Never create a feature folder with only one of them.

---

## 4. Skill installation (standing instruction)

The user will send skills over the course of this project. When a skill arrives — as a file,
a paste, a zip, or a link — install it **without being asked again**:

1. Write it to `.claude/skills/<kebab-name>/SKILL.md`, plus any `references/`, `scripts/`,
   or `assets/` it ships with.
2. Ensure YAML frontmatter exists and is valid:
   ```yaml
   ---
   name: <kebab-name>
   description: <one line — what it does AND when to trigger it. This is the only
     text used to decide relevance, so make triggers explicit.>
   ---
   ```
3. Add a row to [docs/SKILLS.md](docs/SKILLS.md): name, purpose, **trigger condition**,
   and which section types it applies to.
4. Log the installation in `docs/CONTEXT.md` under today's date.
5. Report to the user: skill name, path, and the trigger you registered.

**Auto-invocation is mandatory.** Before starting any section, check `docs/SKILLS.md` and
invoke every skill whose trigger matches the work at hand. Do not wait to be told. If two
skills overlap, the more specific trigger wins; note the choice in the section's `CONTEXT.md`.

Skills already available in this environment that matter here: `ui-ux-pro-max`,
`gsap` (scroll-driven, pinned, scrubbed, long timelines), `framer-motion` (component
state / gesture / mount-exit), `brainstorming`, `verification-before-completion`.

---

## 5. Context discipline (the memory rule)

**After every completed task, append to context before saying you are done.** This is not
optional and is not a summary of the chat — it is the state of the repo.

Two levels, both required:

- **`features/<section>/CONTEXT.md`** — what changed in that section, measured values that
  were hard to get, decisions and their reasons, what's still open.
- **`docs/CONTEXT.md`** — one line per task under today's `## YYYY-MM-DD` heading, linking
  to the feature context for detail.

Format rules:
- Newest day at the **top**. Append within a day, never rewrite history.
- Absolute dates (`2026-08-02`), never "today" or "last week".
- Record **decisions and measurements**, not narration. `"Hero gap is 88px, not the 80px the
  8pt scale suggests — original uses a one-off"` is useful. `"Worked on hero"` is not.
- If a task is abandoned or reversed, log that too, with the reason.

A session that ends without a context write is an incomplete session.

---

## 6. Definition of done for a section

A section is done only when all of these hold — verify, then claim:

- [ ] Rendered output matches the reference screenshot at 1600 / 1440 / 1024 / 390 px wide
      (one per Framer breakpoint tier — see `docs/PROJECT.md`).
- [ ] Spacing, type, and color come from `docs/DESIGN-SYSTEM.md` tokens, or the deviation
      is documented in `FEATURE.md` with the measured value and why.
- [ ] All interactive states implemented (hover, focus-visible, active, disabled).
- [ ] Animation timing and easing match the original, not "feels close".
- [ ] Keyboard reachable; images have meaningful `alt`; contrast checked.
- [ ] `npm run build` passes with no type errors.
- [ ] `FEATURE.md` acceptance checklist ticked, both `CONTEXT.md` files updated,
      `docs/SECTIONS.md` status changed.

Never report a section complete on the strength of "it should work." Run it, look at it, then
say so. If something is partially done, say exactly which part is not.

---

## 7. Working rules

- **Section isolation.** Build one section at a time, fully, before starting the next.
  Don't scaffold five half-sections.
- **Tokens before pixels.** New color/size/font goes into `docs/DESIGN-SYSTEM.md` and the
  Tailwind config first, then gets used. No stray hex values in components.
- **Measure, don't eyeball.** Pull real values from the target (devtools, computed styles,
  screenshots) and record them in `FEATURE.md`. A guessed value is a bug waiting to be found.
  This rule governs **layout, type and color** — the things the clone is judged on. It is
  **not** a licence to run forensics on decorative assets; see the next rule.
- **Match effort to the ask. Stop at "good enough" for anything decorative.**
  Photos, video, and other stock content are *dressing*, not spec. For those: pick a
  reasonable source, apply a reasonable grade, show it, and ask. Do **not** build measurement
  harnesses, scrape multiple stock sites, or iterate on numeric targets for them.

  Concrete ceiling for a decorative asset — if you exceed any of these, stop and show the user
  what you have:
  - **2 candidate sources.** If neither works, say so and ask; don't try a third site.
  - **2 grade/crop iterations.** Then show it.
  - **No new analysis scripts.** No luma profiling, bbox tracking, or coverage maps.

  When something *is* worth measuring (a spacing value, a font size, a breakpoint), measure it
  once and move on. Rigor is for the spec; taste is for the dressing.
- **Show early, iterate with the user — don't converge alone.** On anything subjective, get
  it in front of the user at the first presentable state. A quick "here's where it landed,
  want it warmer/darker/tighter?" beats another self-directed round. The user can judge in
  five seconds what costs many steps to chase.
- **Reuse.** Check `src/components/` before writing a new primitive.
- **Ask when the target is ambiguous** (e.g. a state you can't observe). Assume nothing about
  behavior you haven't seen; flag it in `FEATURE.md` as an open question.
