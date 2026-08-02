# Section Cloning Workflow

The procedure for taking one section from nothing to `done`. Follow it in order — the
measuring step exists specifically so the building step isn't guesswork.

---

## 0 · Load context (2 min, no scanning)

Read, in this order:
1. Tail of `docs/CONTEXT.md` (latest day only)
2. `docs/SECTIONS.md` row for this section
3. `docs/DESIGN-SYSTEM.md`
4. `features/<slug>/FEATURE.md` and `CONTEXT.md` if the folder exists
5. `docs/SKILLS.md` — note every skill whose trigger matches this section

Do not read the rest of the tree.

## 1 · Scaffold the feature folder

```
features/<slug>/
├── FEATURE.md      ← copy docs/templates/FEATURE.template.md
├── CONTEXT.md      ← copy docs/templates/CONTEXT.template.md
└── assets/
```

Set status to `measuring` in `docs/SECTIONS.md`.

## 2 · Measure the original

This is the step that determines whether the clone is faithful. Capture into `FEATURE.md`.

> **Extract, don't estimate.** The target is a Framer build and the whole stylesheet is
> frozen in [reference/target/](reference/target/), with per-node `--framer-*` custom
> properties. Read values out of the capture; use screenshots to *verify*, not to measure.
> Framer ships one DOM subtree per breakpoint tier — confirm which tier a match belongs to
> before recording it.

- Reference screenshots at **1600 / 1440 / 1024 / 390** (one per Framer tier) → `assets/`
- **Layout:** container width, gutters, column count, gap, alignment
- **Spacing:** every padding/margin/gap as a real number, from computed styles
- **Typography:** family, size, weight, line-height, letter-spacing, transform — per element
- **Color:** exact values including opacity, gradients (stops + angle), overlays
- **Borders / radius / shadows:** full computed values
- **Assets:** images (dimensions, format, `object-fit`), icons, video
- **States:** hover, focus, active, disabled — and what transitions between them
- **Motion:** what animates, trigger, duration, easing, stagger, scroll offsets.
  **Observe this on the live site** — Framer animates in JS, so the capture holds no
  timings beyond one `color .3s` transition.
- **Responsive:** what actually changes at each breakpoint — reflow, hide, resize, reorder

Anything you cannot observe goes in **Open questions**, not into a guess.

## 3 · Reconcile with the design system

New tokens → `docs/DESIGN-SYSTEM.md` → the `@theme` block in `src/app/globals.css`
(Tailwind v4 is CSS-first; there is no `tailwind.config.ts`). One-offs → documented
deviation in `FEATURE.md`. Then set status `building`.

## 4 · Invoke skills, then build

Run the skills matched in step 0 **before** writing code, not after:

- Scroll-driven, pinned, scrubbed, or long timeline → `gsap`
- Component state, gesture, mount/exit, layout animation → `framer-motion`
- Layout/type/spacing/a11y decisions → `ui-ux-pro-max`
- Cross-breakpoint behavior, fluid type, container queries → `responsive-design`
- Component craft and polish → `frontend-design` (**execution quality only — never to
  deviate creatively from the target; see the fidelity guard in `docs/SKILLS.md`**)
- Any other skill whose trigger matches → per `docs/SKILLS.md`

Build order within a section: semantic markup → desktop layout → responsive → states →
motion → a11y polish.

## 5 · Verify against the reference

Side by side at all four widths. Then:

- `npm run build` — clean, no type errors
- Keyboard tab through; focus visible and in order
- `prefers-reduced-motion` respected
- No horizontal overflow at any width
- `node docs/reference/contrast-check.js` — contrast ratios pass AA
- Run the `web-design-guidelines` skill over the new component (Vercel Web Interface
  Guidelines review), and `verification-before-completion` before claiming done

Fix diffs before moving on. A section that is "95% there" is `review`, not `done`.

## 6 · Write context, then close out

1. `features/<slug>/CONTEXT.md` — dated entry: what was built, measured values worth
   keeping, decisions + reasons, anything still open.
2. `docs/CONTEXT.md` — one line under today's date, linking to the above.
3. `docs/SECTIONS.md` — status → `done`.
4. Tick the acceptance checklist in `FEATURE.md`.
5. Report to the user: what's done, what deviated and why, what's still open.

Only then start the next section.
