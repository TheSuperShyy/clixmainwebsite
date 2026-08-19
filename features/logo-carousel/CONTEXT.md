# Context: Logo Carousel

Memory for this section. **Newest entry on top.** Append after every task — never rewrite
past entries. Record decisions, measurements, and reasons; skip narration.

Reading this file plus `FEATURE.md` should be enough to resume work on this section cold,
with no code scanning.

---

## Current state

Built and building clean. **13 tool lockups** (glyph + name), doubled track, GSAP infinite
loop with a measured cycle width, 8-layer progressive blur, edge-fade mask, reduced-motion
fallback.

**The content is no longer the target's.** This was rogo's row of 14 investment banks — a
*customer* row. It is now clix's *stack* row: the tools clix builds with. Every mechanism
(blur, mask, cycle maths, speed, geometry) is unchanged and still the target's; only the
items inside the `<ul>` were replaced. See the 2026-08-07 entry.

Rendered **inside** `Hero.tsx`, not as a sibling section — that is what the original does.

The **marquee speed is still a guess** (50 px/s) because a static capture cannot encode a
rate. The strip has now been rendered and eyeballed at 1600 / 1440 / 1024 / 390, but *not*
diffed against the reference — and a like-for-like diff is no longer meaningful here, since
the row deliberately holds different content.

**Status:** `review`
**Next action:** confirm speed, direction and pause-on-hover against the live site. Confirm
the tool list with the user (ElevenLabs in particular — see below).

---

## Log

### 2026-08-19 — marquee slowed, 50 → 30 px/s

**Trigger:** user — the moving strips *"kinda make us dizzy maybe slow them down?"* — one pass
covering both marquees. `SPEED_PX_PER_SEC` 50 → 30 here; the model ticker went 40 → 24 in the
same pass and deliberately stays the slower of the two (it carries prices that have to be read,
this row only has to be recognised). Speed was never a measured value — FEATURE.md records it as
unmeasurable from a static capture — so this is tuning a guess, not deviating from spec. Nothing
else changed: cycle measurement, font-load gate and reduced-motion behaviour are speed-agnostic.

### 2026-08-07 — banks out, clix's own stack in

**Trigger:** user — *"change the logo to the tools clix use like vapi, elevenlabs, n8n,
etc."*. This closes the item that had been **BLOCKED** since 2026-08-05 for want of a
decision on treatment.

**Why this row had to change and could not just be re-skinned.** The target's fourteen items
are Jefferies, Lazard, Rothschild, BNP Paribas, Raymond James, Truist and friends — i.e.
*rogo's customers*. Under a clix wordmark that is not a stylistic mismatch, it is a false
claim, and it was the last one left on the page after the 08-05 pass took out the Series D
banner, the compliance seals and the executive quotes.

**The replacement is not invented.** The live company site already runs structurally the same
block — section 02, `הסטאק` / "the stack", *"Every tool you use feeds one brain"* — with a
12-item marquee. Those twelve are used verbatim: Vapi, n8n, Make, OpenAI, Gemini, monday.com,
WhatsApp, Claude, Google Docs, Google Sheets, Google Calendar, Hostinger. Recorded in
`docs/reference/clixsolutions/README.md` lines 148-151.

**ElevenLabs is the thirteenth and is the user's addition, not the site's.** Flagged rather
than silently absorbed: if the live site's list is the source of truth, this is the one entry
with no published backing. Same class of open question as Achituv's name in `testimonials`.

#### The treatment decision (the thing that was blocked)

simple-icons publishes brand marks under **CC0**, and carries 11 of the 13. But they are
**glyphs** — square, 24x24 — and this row was built for **wordmarks 45-226px wide**. Three
options were on the table; the choice was *glyph + name lockup*:

| option | why not / why |
|---|---|
| bare glyphs | 13 squares at 56px gaps reads as an icon tray, not a logo row. The strip's visual job is a run of *wide* marks under a headline; squares leave it looking sparse and unrelated to the design it sits in. |
| official wordmark SVGs | not freely redistributable for most of these vendors, and would mean scraping 13 separate brand pages — well past the effort ceiling in CLAUDE.md §7. |
| **glyph + name in Inter 500** ✅ | lands each item at 40-188px wide × 24px tall, i.e. inside the target's own 45-226 × 20-36 band, so the row keeps its proportions. One source, CC0, no scraping. |

Measured after the change (13 items, identical at all four tiers because the track is
`w-max` and viewport-independent):

```
count 13 · cycle 2243px · item widths 40-188 · max item height 24 · font Inter (loaded)
Vapi 40 · ElevenLabs 139 · n8n 69 · OpenAI 103 · Claude 99 · Gemini 98 · Make 85
WhatsApp 131 · monday.com 119 · Google Sheets 168 · Google Docs 152 · Google Calendar 188
Hostinger 124
```

Only **Vapi (40px)** falls below the target's 45px minimum, and only because it is four
characters with no glyph. `cycle 2243 >= viewport` at 1600, so the doubled track still covers
the widest tier with no gap — the condition the loop depends on.

#### Two tools have no mark, and that is deliberate

simple-icons 404s on **Vapi** and **monday.com**. Both render as **text alone**. Redrawing a
trademark from memory is how you ship a subtly wrong logo, so it was not done. This is not a
degraded fallback: the row this replaces was wordmarks end to end, so a name set in type is
the *native* form of the strip. Two among thirteen reads as brand variety, not as breakage.

Labels use each vendor's own casing — `n8n` and `monday.com` really are lowercase, `OpenAI`
really is camel-cased. Do not sentence-case them.

#### One real bug this introduced, and the fix

The old items were `<img width height>`, so the cycle was measurable on the first frame. The
new ones are **text**, and text in the fallback sans is a different width from the same text
in Inter. Measuring before the font swap bakes in a wrong `cycle`, and the loop then tears by
exactly the reflow delta on *every* repeat. Fixed by gating the measurement on
`document.fonts.ready`, which resolves immediately on a warm load and so costs nothing.

#### Smaller consequences

- Accessible name of the `<section>`: `"Our customers"` → `"Tools we build with"`. The old
  one would have been an outright lie about the new contents.
- Per-item `alt` handling is gone — the name is now real text, and the glyph beside it is
  `aria-hidden` inside `ToolGlyph`. The first-pass/duplicate-pass split is unchanged.
- New file `src/components/ui/ToolGlyphs.tsx` holds the 11 paths. Inlined rather than shipped
  to `public/logos/` because they must take colour from the row (`currentColor`, which an
  `<img>` cannot do) and because each is half of a lockup, not a standalone asset.
- **The 14 bank SVGs in `public/logos/` are now orphaned** (~114 KB). Left in place, not
  deleted: this is a clone repo and they are the target's own extracted assets, i.e.
  reference material. Delete them only on a deliberate call.

**Licensing note.** simple-icons files are CC0; the trademarks remain each vendor's property.
Naming tools you actually use is nominative use, not endorsement. If a vendor objects, drop
that entry — the row already tolerates missing marks by design.

---

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
