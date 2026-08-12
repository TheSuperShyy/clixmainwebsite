# Hebrew/RTL wave — the shared contract

Every agent in this wave reads this file first. It exists because `Multi-agent.md` §3 requires
cross-file couplings to be **pre-resolved and handed to every agent identically** — agents cannot
see each other, so anything not settled here will not converge.

**Other agents are editing sibling files right now.** Touch only the files your prompt assigns
you. If an instruction here contradicts what a file actually says, **report it with `file:line`
rather than complying** — three of the numbers in the plan that produced this wave were wrong and
were caught exactly that way.

---

## 1. What already exists (do not rebuild it)

The i18n spine is done and the build is green at 20 static routes. You are filling it in.

| | |
|---|---|
| Locale type, direction primitive, path helpers | `src/lib/i18n/config.ts` |
| `Translated<T>` — the completeness type | `src/lib/i18n/shape.ts` |
| `interpolate(template, vars)` | `src/lib/i18n/format.ts` |
| **Server** seam: `getLocale/getDict/getChrome/getDirection/getDirSign` | `src/lib/i18n/server.ts` |
| **Client** seam: `useLocale/useDirection/useDirSign/useChrome/usePageDict` | `src/lib/i18n/LocaleProvider.tsx` |
| Namespace registry | `src/lib/i18n/dictionary.ts` |
| Shared chrome, both locales, **done** | `src/lib/i18n/{en,he}/chrome.ts` |
| Route shells + shared bodies | `src/app/(en)/**`, `src/app/he/**`, `src/app/_routes/**` |
| The toggle | `src/components/ui/LocaleToggle.tsx` |

English is at the bare paths (`/`, `/product`); Hebrew is at `/he`, `/he/product`. Route groups,
no middleware.

## 2. Reading strings — exactly two forms, never a third

```ts
// server component (no "use client")
import { getDict } from "@/lib/i18n/server";
const t = getDict().product.hero;

// client component ("use client")
import { usePageDict, useChrome } from "@/lib/i18n/LocaleProvider";
const t = usePageDict("product").hero;
const c = useChrome().a11y;
```

- **A client component must NEVER `import` a dictionary module.** A static import from a client
  component bundles *both* locales into the client chunk. `import type` is fine — types are erased.
- **Never call `getLocale()`/`getDict()` from `metadata` or `generateMetadata`.** Metadata
  resolution is a separate pass with no guarantee of sharing the render's cache scope.
- `PageDictProvider` is already mounted in every `src/app/_routes/*Route.tsx`. Do not add one.

## 3. Your two dictionary files

You own `src/lib/i18n/en/<ns>.ts` and `src/lib/i18n/he/<ns>.ts` exclusively. **The namespace's
shape is declared in the English file** and `dictionary.ts` imports it, which is what keeps this a
single-owner file — growing your namespace never edits a file anyone else touches.

**English is extracted VERBATIM.** Byte-identical, including curly apostrophes (`’` U+2019) and
any em dash already in the string. The English render is verified as a no-op against the
block-diff baseline, so a "tidied" string is a regression. If you think a string is wrong,
report it; do not fix it.

**Array typing — get this right, it is the one thing `tsc` cannot infer for you:**

| the count is… | type it | because |
|---|---|---|
| **layout** (grid cells, nav slots, a fixed set of badges) | fixed-length tuple | a locale supplying the wrong number must fail the build |
| **how the language wraps** (hard lines of a headline) | `readonly string[]` | Hebrew wraps differently; pinning it forbids the divergence |

Worked example of the second kind: the footer tagline sets **three** runs in English and **two**
in Hebrew. See `en/chrome.ts` / `he/chrome.ts` and `Footer.tsx`'s render.

## 4. Hebrew copy — provenance is mandatory

Mark **every** Hebrew string in a comment beside it:

- **SOURCED** — lifted from `docs/reference/clixsolutions/`, the capture of the user's own company
  site, which is `lang="he" dir="rtl"` and **has no English version**. Give the path:
  `home.headings[1]`, `services.bodyText`, `pages/about.html`.
- **AUTHORED** — written in that captured voice because no counterpart exists. **These are the
  only strings the user reviews**, which is the entire point of marking.

For much of this site "translation" is the wrong word. The English was rendered *out of* this
Hebrew in the first place — `Hero.tsx:13-23` and `Footer.tsx` both say so — so the Hebrew is
often a **restoration**. `content.json` holds 46 headings and ~13,500 characters of `bodyText`
across the 6 pages that matter. Read it before authoring anything.

⚠️ **NEVER LIFT AN `H1` FROM `content.json`.** Its extractor walked per-word spans and
concatenated without separators, so every H1 in it has lost its spaces —
`"מערכותAIמהונדסותלעסקשלכם."`. H2/H3 and `bodyText` are fine. Recover H1s from
`docs/reference/clixsolutions/pages/*.html`: strip tags, collapse whitespace. Proven:
`'מערכות AI מהונדסות לעסק שלכם.'`

⚠️ **The standing no-dashes rule has one carve-out.** The rule (2026-08-10) forbids dashes in clix
copy, and the real site's Hebrew prose indeed has zero em dashes. It cannot forbid the **Hebrew
prefix hyphen**, because `בWhatsApp` is misspelled. The live site writes `ב-WhatsApp`, `ה-AI`,
`רב-לשוני`. That is orthography, not punctuation style.

Use `׳` (geresh U+05F3) and `״` (gershayim U+05F4), never ASCII `'`/`"` — the capture uses 33 and
13 of them respectively.

## 5. Direction — the primitive and the sign convention

```ts
useDirSign(): 1 | -1     // client       getDirSign(): 1 | -1     // server
```

`+1` in English, `−1` in Hebrew. **Because it is `+1` in English, every expression it appears in
is byte-identical in the LTR build** — which is what makes this whole pass verifiable as a no-op.

It multiplies **physical-axis deltas only**: a `translateX` target, a `scrollBy({left})` delta,
the sign of a drag-commit comparison. **Never** an index, a magnitude, a velocity, or a threshold
— "previous slide" is index − 1 in every language, and a fitted velocity constant has no
direction.

`useDirSign()` is **stable for the lifetime of the mount**, because switching locale is a hard
document navigation across two root layouts. So it may be read once, outside a `useGSAP`
dependency array, with **no `revert()`/rebuild path**. That guarantee deletes a whole class of work
— rely on it.

`<html dir>` is set in the two root layouts and **nowhere else**. Do not set `dir` on another
element, and never sniff `document.dir` / `document.documentElement.lang`: a DOM read has no
server snapshot, so it would render the LTR branch on the server and visibly flip on hydration.

## 6. The logical-utility migration

Tailwind here is **4.3.3**, verified to ship all of these plus the `rtl:`/`ltr:` variants.

| physical | → logical | LTR computed value | identity? |
|---|---|---|---|
| `ml-*` | `ms-*` | resolves to `margin-left` | ✅ |
| `mr-*` | `me-*` | resolves to `margin-right` | ✅ |
| `pl-*` | `ps-*` | resolves to `padding-left` | ✅ |
| `pr-*` | `pe-*` | resolves to `padding-right` | ✅ |
| `left-*` | `start-*` | resolves to `left` | ✅ |
| `right-*` | `end-*` | resolves to `right` | ✅ |
| `border-l*` | `border-s*` | resolves to `border-left-*` | ✅ |
| `border-r*` | `border-e*` | resolves to `border-right-*` | ✅ |
| `text-left` | `text-start` | **`getComputedStyle().textAlign === "start"`** | ❌ see below |
| `text-right` | `text-end` | **returns `"end"`** | ❌ see below |
| JS `style.left` | `insetInlineStart` | resolves to `left` | ✅ |
| JS `style.paddingLeft` | `paddingInlineStart` | resolves to `padding-left` | ✅ |

Use `start-*`/`end-*`, **not** the `inset-s-*`/`inset-e-*` aliases.

⚠️ **`text-align` is the one non-identity.** It renders pixel-identically in LTR but the computed
*keyword* changes, so a computed-style diff will print a mismatch that is **not** a regression.
Migrate it anyway and say so in your report; the harness normalises it.

⚠️ **THE ONE RULE THAT MAKES THE IDENTITY HOLD: never mix physical and logical on the same axis of
the same element.** `border-e-0 border-r` breaks; `pl-0 pe-2` breaks. There are zero such pairs
today. Do not create one.

### DO NOT MIGRATE — these are not direction utilities

Getting this list wrong is how a clean pass becomes 40 subtle regressions.

- **`left-1/2` paired with `-translate-x-1/2`** — a centring idiom. Migrating it is an **active
  bug**: in RTL `start-1/2` becomes `right:50%` while the translate still moves left, so the
  element lands off-centre by its own width.
- **`inset-x-*`, and symmetric pairs** like `left-3 right-3`, `left-0 right-0`, `pl-6 pr-6` —
  direction-neutral by construction.
- **`left-0 w-full`** — a full-bleed idiom.
- **Small pixel insets that centre artwork inside a frame**, e.g. `left-[1px]` on a 102px mark in
  a 104px box. Symmetric; a no-op either way.
- **Per-icon optical nudges** measured off the target's artwork (`left-[5px]`, `left-[6px]`,
  `left-[7px]` on icons in a 40px tile). The glyph is not mirrored, so its nudge must not be.
- **`justify-start` / `justify-end` / `items-start`** — already logical; flex main-axis keywords
  follow `direction`.
- **An optical nudge tied to an un-mirrored glyph's visual mass** (e.g. `ml-[2px]` on a play
  triangle). Physical is correct there.

## 7. Glyphs — mirror only what changes meaning

**Mirror** — navigational affordances: carousel/slideshow Prev and Next, a submit arrow, a
"find out more" arrow, a `›` chevron. Mechanism, in order of preference:
1. If the two glyphs are already exact mirrors, **swap which component renders** — no new artwork.
2. Otherwise `rtl:-scale-x-100` on the `<svg>`. RTL-only, so LTR computed `scale` stays `none`.
3. For a literal character, render it explicitly: `dir === "rtl" ? "‹" : "›"`. Do not
   rely on Unicode bidi mirroring — `Bidi_Mirrored=Y` is a *suggestion*, not something to diff.

**Do NOT mirror:**
- **Brand and vendor marks** — `ClixMark`, `ClixWordmark`, tool/partner logos. Mirroring a
  third-party logo is a trademark problem, not a layout choice.
- **A semantic arrow.** `ModelTicker.tsx:136`'s `→` sits between an input price and an output
  price and its own comment says it *replaces the words "in"/"out"*. Mirrored, it reads
  output→input. Isolate the expression instead.
- **Media-transport glyphs.** Play/pause do not mirror in any platform convention; only
  skip-forward/back do.
- **Rotationally symmetric ornaments** — a 180°-rotated corner bracket, a circle subtracted from a
  square. Verify, then leave, and say in a comment that it was verified rather than overlooked.
- **Decorative mocks of Latin product UI** — mirroring them misrepresents the thing depicted.

## 8. Frozen values — measured or fitted, do not touch

`FLICK_PROJECTION_S 0.15` · `COMMIT_FRACTION 0.3` · `IDLE_MS 80` · `VELOCITY_WINDOW_MS 100` ·
`STEP_MS` · `SPEED_PX_PER_SEC` · `TICK_MS` · `SLIDE_MS` · `ROW_H 62` (must stay in lockstep with
the `rows-up` keyframe) · `CYCLE_S` · `ROW_ONE_SECONDS`/`ROW_TWO_SECONDS` · every CTA corner-bracket
offset · every `left-[Npx]` artwork nudge · every padding, gap, font-size, line-height and
letter-spacing in the repo.

These were measured against the live target or fitted to observed behaviour. A sign may flip; a
constant may not.

## 9. What Hebrew does to the layout, measured

From `discovery-var.woff2` with fontTools:

- Hebrew letters average **1.117×** the advance of Latin lowercase — ~12% wider per character.
- `sTypoAscender/Descender/LineGap` are **identical** to Latin, and Hebrew has no capitals,
  ascenders or descenders in the Latin sense. **So every `line-height` on this site produces the
  same box height per line in Hebrew. Nothing vertical needs re-measuring.**
- Therefore **only line COUNT changes** — and wherever `line-height` is a percentage of
  `font-size` (95%, 110%, 130%, and nearly everywhere here), **matching the rendered line count
  matches the box height to the pixel.**

And the direction of the risk is the **opposite** of the obvious one. Measured: the Hebrew nav row
is 467px against English's 552px (**−15.4%**), and every CTA label is shorter or equal
(`Request Access` 100.6 → `בקשת גישה` 71.7). Hebrew here runs **short**, so expect headlines to
set in *fewer* lines than English and shrink band heights — not to overflow.

⚠️ **`whitespace-pre` is systemic — ~25 uses across 15 files**, including every CTA label (inside
a `width: min-content` anchor) and all 7 nav links. Those cannot wrap, so a longer string
overflows rather than reflows. Measured, they all clear.

⚠️ **Character count does not decide wrapping.** `docs/CONTEXT.md` records this three times, the
sharpest being a title 62 chars against a 63-char original that wrapped to 3 lines instead of 2
and pushed 645 elements down the page. **Fit strings by rendered line count, never by counting
characters.** If you cannot measure, say the string is unverified rather than guessing.

## 10. The fidelity contract — and it is different for the two locales

- **English/LTR: zero regression, and it is provable.** Your changes must not move a single
  computed value. That is what the logical-property identity above buys.
- **Hebrew/RTL: correctness, not fidelity.** There is no Hebrew rogo.ai, so Hebrew is **not**
  diffable against the target and is not held to the §6 clone bar. Its bar is: no horizontal
  overflow at 1600/1440/1024/390, nothing clipped, uniform grid rows still uniform, colour-boundary
  headings still breaking where the colour changes, contrast AA, keyboard reachable.
- **Where a Hebrew string cannot hold an invariant, the BOX changes and the change is recorded.**
  Trimming Hebrew until it fits a box measured against English would make the measured spec a
  fiction. Record it; do not tune it away.

## 11. Report back

State: the files you changed; every string whose provenance is **AUTHORED** (the user reviews only
those); every value you were told to migrate and **did not**, with the reason; every place Hebrew
forced a box or a structure to differ from English; and anything you could not verify. A finding
you report is worth more than a change you guessed at.
