# Feature: <Section Name>

| | |
|---|---|
| Slug | `<slug>` |
| Page(s) | |
| Order on page | |
| Status | `measuring` |
| Reference | `assets/ref-1600.png` · `ref-1440.png` · `ref-1024.png` · `ref-390.png` |
| Original Framer name | `<data-framer-name>` — how to find it in the capture |
| Component | `src/components/sections/<Name>.tsx` |

## Purpose

What this section does on the original site, in two sentences.

---

## Measured spec

> Real values extracted from `docs/reference/target/` — the frozen capture, not a screenshot
> and not a live fetch. No guesses. If a value is estimated, mark it `(est.)` and add it to
> Open questions.
>
> Columns below are the four **Framer breakpoint tiers**, not arbitrary widths:
> `≥1600` · `1200–1599.98` · `810–1199.98` · `≤809.98`.

### Layout
| Property | XL 1600 | Desktop 1440 | Tablet 1024 | Phone 390 |
|---|---|---|---|---|
| Container max-width | | | | |
| Horizontal padding | | | | |
| Section padding-top | | | | |
| Section padding-bottom | | | | |
| Columns | | | | |
| Column gap | | | | |
| Row gap | | | | |
| Alignment | | | | |

### Typography
| Element | Family | Size | Weight | Line-height | Letter-spacing | Transform | Color |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Color & surface
| Element | Property | Value |
|---|---|---|
| | background | |
| | border | |
| | radius | |
| | shadow | |

Gradients (stops, angle, color space):

### Assets
| Asset | Type | Intrinsic size | Rendered size | `object-fit` | Source |
|---|---|---|---|---|---|
| | | | | | |

### Interactive states
| Element | Hover | Focus-visible | Active | Disabled | Transition |
|---|---|---|---|---|---|
| | | | | | |

### Motion
| What animates | Trigger | Duration | Easing | Delay / stagger | Scroll start → end |
|---|---|---|---|---|---|
| | | | | | |

Library: `gsap` / `framer-motion` / CSS — and why:
Reduced-motion fallback:

> Motion values must be **observed on the live site**. The capture is a Framer build that
> animates in JS — it contains no timings beyond one `color .3s cubic-bezier(.44,0,.56,1)`.

### Responsive behavior
What actually changes at each tier (reflow, hide, resize, reorder):

- **≥1600 (XL):**
- **1200–1599.98 (Desktop):**
- **810–1199.98 (Tablet):**
- **≤809.98 (Phone):**

---

## Tokens used

From `docs/DESIGN-SYSTEM.md`:

## Documented deviations

Values that intentionally differ from the token scale, with the measured original value
and the reason. Anything here must be justified — an undocumented deviation is a defect.

| Property | Token would give | Original actually is | Why |
|---|---|---|---|

---

## Acceptance checklist

- [ ] Matches reference at 1600
- [ ] Matches reference at 1440
- [ ] Matches reference at 1024
- [ ] Matches reference at 390
- [ ] Spacing/type/color from tokens, or deviation documented above
- [ ] All interactive states implemented
- [ ] Motion timing + easing match the original
- [ ] `prefers-reduced-motion` respected
- [ ] Keyboard reachable, focus visible, tab order correct
- [ ] Images have meaningful `alt`; contrast ≥ AA
- [ ] No horizontal overflow at any width
- [ ] `npm run build` clean
- [ ] `CONTEXT.md` (feature + global) updated, `SECTIONS.md` status set

## Open questions

- [ ]
