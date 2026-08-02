# Context: Logo Carousel

Memory for this section. **Newest entry on top.** Append after every task — never rewrite
past entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold,
with no code scanning.

---

## Current state

Built and building clean. 14 logos at measured sizes, doubled track, GSAP infinite loop with
a measured cycle width, 8-layer progressive blur, edge-fade mask, reduced-motion fallback.

Rendered **inside** `Hero.tsx`, not as a sibling section — that is what the original does.

Not yet visually verified at any tier, and the **marquee speed is a guess** (50 px/s) because
a static capture cannot encode a rate.

**Status:** `review`
**Next action:** compare against the reference at all four tiers; confirm speed, direction
and pause-on-hover against the live site.

---

## Log

### 2026-08-02 (latest) — five broken logo SVGs re-extracted

**Trigger:** user — *"fill the broken image"*.

Audited all 14 vendored SVGs. **Five were broken, and they are exactly the five the original
expresses as `<use href="#id">` references** into its hidden defs block rather than as inline
SVG — Lazard, Tiger Global, Moelis, Nomura, Raymond James. Two different faults:

| Files | Fault | Symptom |
|---|---|---|
| lazard, tigerglobal, moelis | def copied, **`viewBox` dropped** | An SVG with no `viewBox` **does not scale** — the art keeps its own coordinates and is clipped by the `<img>` box. Moelis is 218 units wide in a 103px box, so most of it vanished. This was the visibly broken one. |
| nomura, raymond-james | **wrong artwork** | The `<use>` was resolved to the next *inline* `<svg>` in document order instead of to the def. `nomura` held Rothschild's mark (viewBox `182 30`, 18KB); `raymond-james` held Truist's (`133 31`). |

The size change is the tell for the second fault: nomura went **17995b → 1583b** once it held
its own artwork instead of Rothschild's.

**Fixed** by resolving each `href="#id"` against the real defs block and authoring a wrapper
with `xmlns`, the correct `viewBox`, and intrinsic `width`/`height`. Path data still verbatim.

**Then a third fault, in the other nine files — duplicate `xmlns`.** My first validation pass
checked viewBox, balanced tags, white fill and aspect, concluded "all 14 valid", and was
wrong: those are structural checks and none of them parses the file. The user came back with
the carousel still broken. Rasterising each file through sharp — the actual test — showed
**all nine inline-sourced logos failing** with `glib: XML parse error … code 42`.

Cause: the capture's inline `<svg>` already carried `xmlns`, and extraction prepended another,
so the root had it twice. **A duplicate attribute is a fatal XML well-formedness error**, and
SVG loaded through `<img>` is parsed as strict XML. Fixed by dropping every root `xmlns` after
the first. Only two of the fourteen were visible in the screenshot; the other seven were
scrolled off, which is why it read as "one broken image".

**Verified by eye, not just by exit code** — rendered a contact sheet of all 14 and confirmed
each shows the right mark. Nomura is Nomura and Raymond James is Raymond James, which is the
check that actually proves the earlier wrong-artwork fix.

**Rules worth keeping for `public/logos/`:**
1. Every logo SVG must have a `viewBox` — without one it cannot scale, and it is clipped.
2. Exactly one `xmlns` on the root — a second one is fatal.
3. **Validate by rasterising** (`sharp(buf).png().toBuffer()` throws on malformed input), and
   check the output isn't blank. Structural greps are not enough — that is the mistake made
   the first time round.

All three failure modes are **silent**: nothing throws, `npm run build` passes, `eslint`
passes, and the asset is simply wrong or missing on screen.

Aspect drift after the fix: worst is Baird 2.4%, then BNP Paribas 1.6%, rest under 1% — those
two are the original's own artwork-vs-box mismatches, not extraction errors.

---

### 2026-08-02 — built

**Done**
- Extracted `.framer-cdaiag` from the capture by depth-matching its `<div>`, then pulled the
  per-logo box sizes and the structural rules for all 8 nested wrappers.
- Built `LogoCarousel.tsx` with GSAP; wired it into `Hero.tsx`.
- Installed `gsap@^3.15.0` + `@gsap/react@^2.1.2`.

**Decisions**
- **`xPercent: -50` — the skill's stock marquee recipe — is wrong here, and this is the one
  thing worth remembering.** It assumes half the doubled track equals one cycle. With a
  `gap`, it doesn't: 28 items have only **27** gaps, so half the width is short by half a
  gap (28px) and the loop drifts 28px every pass. Fixed by measuring
  `items[14].offsetLeft - items[0].offsetLeft`, which is exactly 14 items + 14 gaps, and
  animating `x: -cycle`. Measurement is safe before image load because every `<img>` carries
  explicit inline `width`/`height`.
- **Track is `w-max flex-none`.** Without it the `<ul>` can be shrunk by its flex parent,
  which would corrupt the measured cycle and tear the loop.
- **Exposed the first pass to assistive tech.** The original marks all 28 `<li>`
  `aria-hidden="true"`, which hides the customer list entirely. Ours labels the first 14 and
  hides only the duplicates — same class of deliberate a11y floor as the hero's
  reduced-motion handling, and logged as a deviation rather than done silently.
- **Reduced motion builds no tween at all** (`gsap.matchMedia`), rather than building one and
  pausing it. A static logo row is the honest fallback for a decorative ticker.
- Kept the marquee's initial `opacity:0` → fade-in, mirroring the original, which also
  conveniently hides the pre-measurement frame.

**Measurements worth keeping**
- **The carousel lives INSIDE `<section id="hero">`**, absolute `bottom:0 height:248px`.
  `docs/SECTIONS.md` had it as a separate section #3 — an inventory guess from the visual.
  Corrected there.
- One cycle = 1878px of logos + 14×56px gaps = **2662px**. At 50 px/s that is ~53s.
- Progressive blur is **8 bands with the radius doubling**: `0.1171875 × 2ⁱ` px, i = 0..7,
  ending at 15px. Each is masked to a sliding 3-band window starting at `i × 12.5%`, stops
  past 100% dropped — which is why the last two layers have 3 and 2 stops. A single blurred
  div would show a hard edge; this is why Framer stacks eight.
- **HCW's box is 104×52 inside a 36px row with `overflow:hidden`** — it really is clipped in
  the original. Don't shrink it to "fix" the overflow.
- The 1200px / 390px / 3009px widths in the carousel CSS are Framer **canvas** defaults,
  overridden to `width:100%` inline. Not breakpoints.

**Skills invoked**
- `gsap` — trigger "marquee" in `docs/SKILLS.md`. Used `useGSAP({ scope })` and
  `gsap.matchMedia()` per the skill. Departed from its stock `xPercent: -50` marquee recipe
  for the gap reason above; the departure is deliberate and explained.
- `framer-motion` not invoked — no mount/exit or gesture behaviour here; the GSAP/Motion
  precedence rule in SKILLS.md gives marquees to GSAP.

**Open / deferred**
- Speed (50 px/s), direction, and pause-on-hover all unverified — need the live site.
- Fade-in duration/easing of the marquee is ours, not measured.
- Not yet compared against the reference screenshots at any tier.
