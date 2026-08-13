"use client";

/**
 * QuoteCarousel — the draggable client-quote slideshow. Cloned from rogo.com/product's
 * `Testimonials` block, Block 6; capture offset 401160, live class `.framer-h211wl`.
 *
 * Capture: docs/reference/target/rogo-product-2026-08-11.html (+ .css).
 * Spec: features/product-page/FEATURE.md · memory: features/product-page/CONTEXT.md
 *
 * ⚠️ THIS WAS `product/ProductTestimonials.tsx` UNTIL 2026-08-13. On the user's call it left
 * /product for the LANDING page, where it replaces the six-card video accordion under the
 * existing "In our clients' own words" heading. Three things changed in the move and nothing
 * else did:
 *   1. it reads `usePageDict("home")`, and its copy moved to `src/lib/i18n/{en,he}/home.ts`
 *   2. it no longer renders its own `<section>` — `sections/Testimonials.tsx` owns the section
 *      wrapper, the `id`, the `data-nav-theme` and the `<h2>`, and calls this for the body
 *   3. the `order-1`/`desktop:order-none` classes went with the wrapper; they existed only to
 *      reorder this against /product's security block, which was deleted the same day
 * The slideshow itself — the triple loop, the drag physics, the snap, both tiers — is
 * untouched. Geometry below is still measured against the /product capture.
 *
 * ✅ THE QUOTES ARE REAL AS OF 2026-08-13. THIS BLOCK IS THE RECORD OF HOW THEY GOT HERE.
 *
 * The history matters because this component has now carried THREE generations of copy, two of
 * which had to be thrown away:
 *
 *   1. rogo's own, verbatim from the capture — Patrice Maffre (Nomura), Pieter Taselaar
 *      (Lucerne Capital), Sean Warneke (Schonfeld), with their headshots and Nomura's mark.
 *      Removed 2026-08-12: real endorsements of a different company, under a clix wordmark.
 *   2. `[PLACEHOLDER QUOTE, NOT SOMETHING X SAID]` scaffolding under clix's OWN clients — real
 *      people, real photographs, invented words. Safer, never safe. Held the /product route at
 *      `noindex` for a day.
 *   3. what ships now: one sentence from each of the six, supplied by the user on 2026-08-13.
 *
 * ⚠️ THE CLIENTS SPOKE HEBREW. THAT IS THE ONE THING LEFT TO REVIEW.
 * `he/home.ts` carries each quote VERBATIM as given — including `קליקס` spelled in Hebrew
 * letters where the rest of the repo writes `clix` in Latin, and including the `...` in two of
 * them. A testimonial is quoted, not normalised; do not tidy either.
 * `en/home.ts` carries TRANSLATIONS, and they are the only strings on this page that are
 * neither the client's words nor sourced from anywhere — they are a faithful rendering written
 * here. Flagged for the user. If a client would rather be quoted in Hebrew on the English page,
 * or has their own English wording, that wording wins.
 *
 * ⚠️ WHAT STILL GUARDS THIS. The switch in sections/Testimonials.tsx is DERIVED from whether
 * these six strings are non-empty — it is not a flag, and a flag would not have worked. Read
 * the block above `CLIP_IDS` there before changing it: `PageDictProvider` serialises the whole
 * `home` namespace into the RSC payload, so emptying a string is the only thing that keeps it
 * off the page. Blanking a quote here silently reverts the landing page to the video accordion,
 * which is the intended failure mode.
 *
 * Two open items inherited from generation 2, neither introduced here:
 *   · `noam-tovi.jpg` carries a burned-in caption reading a DIFFERENT name (נווה דוידי).
 *   · `אחיטוב`/`ותחזנה` is an unverified transliteration in both directions.
 * Both need the client, not a code change.
 *
 * NO CLIENT LOGOS, AND NOT BY OMISSION. The original ran Nomura's mark above its first
 * quote. clix has no client logos and the user's boss has ruled them out, so the `logo`
 * field, the `CompanyMark` component and the flex row that held it are deleted rather than
 * left empty. Nothing was substituted in. Do not reintroduce the slot without that decision
 * changing.
 *
 * THE ORIGINAL SHIPS THREE SUBTREES; THIS SHIPS TWO, AND THE COLLAPSE IS DELIBERATE.
 *
 * | tier      | original                                  | here |
 * |-----------|-------------------------------------------|------|
 * | ≥1200     | `Desktop` slideshow: 3 slides WITH photos  | the slideshow, photo column visible |
 * | 810–1199  | `Mobile` slideshow: same 3 slides, NO photos | the same slideshow, photo column `hidden` |
 * | ≤809      | `Testimonials (Mobile)`: a static stack of **two** cards, no arrows, different copy | its own markup |
 *
 * The first two are one component with one hidden column and two quote sizes — verified
 * identical, so duplicating the subtree would only duplicate the DOM. The third is NOT a
 * responsive variant of the other two and cannot be collapsed into them:
 *   · two testimonials, not three. The third slot (Sean Warneke there, Nevo Yahaloman here)
 *     is absent below 810.
 *   · slot 1's quote was **different copy** at this width in the original — not a truncation
 *     but a different sentence ("Rogo is going to transform" there versus "Rogo transforms"
 *     above 810). ⚠️ **WE NO LONGER REPRODUCE THAT.** The quirk was carried through the
 *     placeholder generation as `phoneLeadQuote` so it would survive the real copy landing; when
 *     the real copy landed on 2026-08-13 it was one sentence per client, and there is no second
 *     thing Asaf Peretz said. Inventing a phone-only variant of a real endorsement is precisely
 *     what the placeholders existed to prevent, so the key was deleted from both locale files
 *     and every card at every width now reads its own slide.
 *   · slot 1 is FIRST on phones (`order:0`) and second in the DOM everywhere else
 *   · no photos, no arrows, and its own paddings (24 / `32 24 24 24`) and gaps (20 / 80)
 *
 * MOTION IS MEASURED, NOT GUESSED — AND THE CAPTURE WOULD HAVE LIED ABOUT ALL OF IT.
 * Framer drives the slideshow in JS, so the frozen HTML shows three slides, `gap:8px`, and
 * both arrows `disabled` with `opacity:0`. Sampling the LIVE page's track transform every
 * 250ms for 23s says otherwise:
 *
 *   · it AUTOPLAYS — the track advances one step every **6.0s** (starts at t = 4.70, 10.70,
 *     16.64, 22.63s), with no click involved. ⚠️ **We deliberately do NOT** — removed on
 *     the user's call, 2026-08-11. The measurement stands; the behaviour is a documented
 *     divergence, not a gap. See the note above `STEP_MS`.
 *   · it LOOPS — the real DOM holds **12** slides, 3 originals plus clones, and at
 *     t = 17.68s the track jumped −7725.6 → −3864.0 in a single frame with no intermediate
 *     sample. That instant jump is the clone snap.
 *   · therefore **neither arrow is ever disabled** — both read `disabled=false, opacity:1`
 *     at every sample. The `disabled` in the capture is the pre-hydration state only.
 *   · a step is **1288px** = the 1280 container + the 8px gap, over **~1.1s**, strongly
 *     ease-out: 46% of the distance inside the first 250ms, 92% by ~520ms, then a long
 *     settle. That is a spring; `cubic-bezier(.25,1,.5,1)` is a FITTED stand-in for it, the
 *     one number here that is an approximation rather than a reading.
 *
 * **A method note worth keeping:** the first probe clicked "Previous" and read the track 1.8s
 * later, and concluded a click moves *two* slides. It had not — autoplay fired during the
 * 1.8s wait. Check for autoplay BEFORE measuring any click.
 *
 * IT IS ALSO DRAGGABLE, and the drag does NOT behave like a normal snapping carousel.
 * Reported by the user, then measured with synthesised pointer drags on the live page:
 *
 *   · the track carries `cursor: grab`, `touch-action: pan-y`, `user-select: none`
 *   · it follows the pointer **1:1** — a 150px drag moves the track exactly 150px, no
 *     rubber-banding, no damping
 *   · **there is no snap-back.** Release after a slow drag and the track STAYS where you
 *     left it, mid-slide. Held-still releases at 40 / 100 / 160 / 220 / 280 / 340px all
 *     settled at exactly the dragged distance and none of them changed slide.
 *   · **a flick commits one slide.** The same 160px, dragged fast and released while still
 *     moving, settled at exactly 1288px — one clean step. So the commit is driven by
 *     velocity at release, not by distance: 340px released stationary does nothing, 160px
 *     flicked advances.
 *   · **the grid is restored by the next index change, not by the release.** After every
 *     off-grid drag the following autoplay tick moved an odd distance (1288−60, 1288−340)
 *     that landed the track back on an exact multiple. Autoplay and the arrows target an
 *     INDEX; whatever drag offset is outstanding is absorbed when they do. ⚠️ With autoplay
 *     removed, **the arrows and a committed flick are the only things left that re-align**,
 *     so a slow drag can rest off-grid until one of those happens — which is what the
 *     original does too, between ticks.
 *
 * The commit rule below (`|dx + v × 0.15| > 30% of a slide`) is **fitted to those three
 * observations**, not read off the page — it is the only way to reproduce all of
 * "340 held → nothing", "160 flicked → one slide", "60 flicked → nothing" with one formula.
 *
 * ──────────────────────────────────────────────────────────────────────────────────────────
 * RTL: EXACTLY THREE THINGS TAKE A SIGN, AND THE LIST IS SHORT ON PURPOSE.
 *
 * The direction primitive `useDirSign()` is +1 in English, so every expression it appears in is
 * byte-identical in the LTR build. It multiplies PHYSICAL-AXIS DELTAS and nothing else:
 *
 *   ✓ the track's `translateX` target. Under rtl a `flex-row` track lays slide 0 against the
 *     container's RIGHT edge and overflows leftward, so bringing slide `pos` into view means
 *     translating `+pos × step`, not `−pos × step`. Hence `sign * -pos`.
 *   ✓ the drag-commit COMPARISON, `sign * projected < 0`. Dragging left advances in ltr and
 *     retreats in rtl, so only the test flips.
 *   ✓ nothing else.
 *
 * AND THESE, WHICH LOOK LIKE THEY SHOULD AND MUST NOT:
 *
 *   ✗ `setDrag(e.clientX - g.startX)`. `clientX` is a PHYSICAL viewport coordinate and the
 *     measured behaviour is "the track follows the pointer 1:1" — physically. Flip this and the
 *     Hebrew track runs away from the finger. This is the single most tempting wrong move in
 *     the whole pass.
 *   ✗ `dx`, `v`, `span`, `projected`. Physical px and px/s throughout. `v` is a velocity, and a
 *     velocity has no direction in the sense this sign means.
 *   ✗ `go(-1)` / `go(1)` and the arrow handlers. They target an INDEX: "previous slide" is
 *     index − 1 in every language.
 *   ✗ `FLICK_PROJECTION_S`, `COMMIT_FRACTION`, `IDLE_MS`, `VELOCITY_WINDOW_MS`, `STEP_MS`. The
 *     commit rule is SIGN-BLIND — `Math.abs(projected) > width * COMMIT_FRACTION` compares
 *     magnitudes — so no fitted constant here changes. A sign may flip; a constant may not.
 *   ✗ `viewport.current.clientWidth`. A physical width.
 *
 * ⚠️ ONE DEVIATION FROM THE PLAN, STATED. The plan asked for the handler's sign to come from
 * `getComputedStyle(el).direction` rather than a hook, to avoid hydration surface. It is read
 * from `useDirSign()` here instead, because the RENDER already needs the same value for the
 * transform above — direction that affects render output cannot come from a DOM read, since
 * there is no `document` on the server and the Hebrew page would server-render the LTR branch
 * and visibly flip on hydration. So the hook is unavoidable, and once it is present a second
 * source for the same fact is strictly worse: it can disagree, and it forces a style flush on
 * every `pointerup`. Same value, one source, zero added hydration surface.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useChrome, useDirSign, useDirection, usePageDict } from "@/lib/i18n/LocaleProvider";
import { interpolate } from "@/lib/i18n/format";

/* ---- Content ----------------------------------------------------------------------------
 * The PEOPLE, their roles and their photo ids are clix's own, taken from the `CLIPS` array in
 * src/components/sections/Testimonials.tsx so that a client reads identically on both pages.
 * Change one, change the other.
 *
 * THE QUOTES ARE PLACEHOLDERS. Read the warning at the top of this file before touching them.
 *
 * WHICH THREE OF THE SIX, AND WHY. The desktop tier renders a 360px PORTRAIT beside each
 * quote and derives its `alt` from `${name}, ${role}`, so a slide needs both a person and a
 * sourced role. That rules out two of the six on facts already recorded in that file:
 * `elyashiv-engineering` is a COMPANY, not a person, carries no role at all, and its speaker
 * is unidentified even to us; `achituv`'s role was read off an uploaded filename and is
 * flagged there as unsourced. Putting either behind a face and a job title on a marketing
 * page would be inventing the very thing this file exists to stop inventing. So the three
 * slides are the three best sourced people, in the order the section already lists them.
 *
 * LENGTHS ARE MATCHED ON PURPOSE, AND THE COUNTS ARE MEASURED, NOT ESTIMATED. `quoteDesktop`
 * is fitted per slide to that quote's character count, so a placeholder of the wrong length
 * would make the fitted size look wrong and send someone chasing a bug that is not there.
 * Counted with the surrounding quote marks the original carried, new versus original:
 *
 *   slide 1  288 / 288      slide 2  157 / 150      slide 3  156 / 163
 *   phone 1  284 / 299      phone 2  reuses slide 2
 *
 * Every one is within 7 characters except phone card 1 at 15 short, and that card is a fixed
 * `h-[505px]` box, so nothing reflows. No `quoteDesktop` value needed changing.
 */

/**
 * PER-SLIDE LAYOUT. The copy — quote, name, role — lives in the dictionary
 * (`testimonials.slides`); what stays here is everything that is not language:
 *
 *   · `id`     the React key and the photo's stem, kept together so they cannot drift
 *   · `photo`  the portrait file
 *   · `cream`  `bone` or `surface`. The original ALTERNATES; it is not derived from position,
 *              which is why it is authored rather than computed from the index
 *   · `quoteDesktop` the per-slide quote size at ≥1200 — 32px on the first card and 36px on the
 *              other five, the original's own values, fitted to each quote's length. It is
 *              step 3 of the launch checklist above: real copy will not be this length.
 *
 * SIX ENTRIES, AND THE DICTIONARY'S `slides` TUPLE IS ALSO SIX, so the two are zipped by index
 * and a locale cannot desynchronise them. rogo's slideshow carried three; clix has six and
 * `sections/Testimonials.tsx` already shows all of them, so showing three here read as a bug.
 * Order matches that file's `CLIPS` exactly, so the two pages never disagree.
 *
 * WHICH SIX, AND THE TWO CAVEATS THAT TRAVEL WITH THEM:
 *   · `noam-tovi` — ⚠️ THIS PHOTOGRAPH MAY NOT BE THIS PERSON, AND THAT IS UNRESOLVED. The file
 *     is a still from the client's video, whose burned-in caption reads "אני נווה דוידי",
 *     transliterating to Nave Davidi, while this repo labels it "Noam Tovi, Owner, investments"
 *     (sections/Testimonials.tsx:63). Two different names; nothing here can say which is right.
 *     The pairing is NOT introduced by this page — it already ships on the home page — so
 *     excluding it here would hide the problem rather than fix it. Kept, flagged, gated behind
 *     noindex. RESOLVE THE LABEL WITH THE CLIENT before either page is indexed.
 *   · `achituv` — its ROLE is recorded in sections/Testimonials.tsx as READ OFF AN UPLOADED
 *     FILENAME, not given by the user, and flagged there as unsourced. Carried verbatim rather
 *     than improved, so the uncertainty stays visible in one place. The Hebrew file adds a
 *     second flag: both its name and its role are unverified transliterations.
 *   · `elyashiv-engineering` is a COMPANY, not a person, which is why its dictionary `role` is
 *     EMPTY rather than an invented job title. `CardBody` holds the role line open with a
 *     non-breaking space so the card matches the others' height.
 */
/* ⚠️ `quoteDesktop` IS FITTED TO THE QUOTE'S LENGTH, AND IT WAS RE-FITTED ON 2026-08-13 when
   the real copy replaced the placeholders. This is step 3 of the old warning block's checklist,
   and skipping it would have been a silent regression: the 32px size was fitted to a ~290
   character placeholder that happened to sit in SLOT 1, so leaving it there would have shrunk
   the SHORTEST real quote and let the longest overflow at 36.

   Measured character counts of the shipped English strings:
       0 asaf 207 · 1 adir 289 · 2 nevo 172 · 3 noam 189 · 4 achituv 269 · 5 elyashiv 147
   The threshold is the placeholder's own: past ~260 characters a quote needs 32px to clear the
   card at 1200+, below it 36px holds. So the two long ones (adir, achituv) take 32 and the
   other four take 36 — the count of 32s is unchanged, only which slides carry them.
   Hebrew is shorter than English in every slot, so English is the binding case at both sizes. */
const SLIDE_STYLE = [
  { id: "asaf-peretz", photo: "/testimonials/asaf-peretz.jpg", cream: true, quoteDesktop: "desktop:text-[36px]" },
  { id: "adir-peretz", photo: "/testimonials/adir-peretz.jpg", cream: false, quoteDesktop: "desktop:text-[32px]" },
  { id: "nevo-yahaloman", photo: "/testimonials/nevo-yahaloman.jpg", cream: true, quoteDesktop: "desktop:text-[36px]" },
  { id: "noam-tovi", photo: "/testimonials/noam-tovi.jpg", cream: false, quoteDesktop: "desktop:text-[36px]" },
  { id: "achituv", photo: "/testimonials/achituv.jpg", cream: true, quoteDesktop: "desktop:text-[32px]" },
  { id: "elyashiv-engineering", photo: "/testimonials/elyashiv-engineering.jpg", cream: false, quoteDesktop: "desktop:text-[36px]" },
] as const;

/**
 * ≤809 ONLY. A static stack, no arrows. Per-card MEASURED box, padding and gap.
 *
 * ⚠️ SLOT 1 USED TO CARRY DIFFERENT COPY AT THIS WIDTH — the capture's own editorial quirk,
 * a different sentence rather than a shortened one, modelled here as a `phoneLeadQuote` key.
 * DROPPED 2026-08-13 when the real quotes arrived: one sentence per client, so there is nothing
 * to put in a phone-only variant that the client actually said. Every card now reads its own
 * slide at every width. See the note at the `CardBody` call below.
 *
 * ⚠️ THE BOXES ARE FIXED HEIGHTS, SO A LONG QUOTE CLIPS RATHER THAN GROWING THE CARD. Measured
 * 505 and 334. With the fixed author block below it that leaves 12 lines for card 1 and 8 for
 * the rest at 20px/1.3em in a 310px measure. Measured: English 9 / 5 / 6 / 5 / 5 / 6, Hebrew
 * 8 / 5 / 5 / 5 / 5 / 6. Re-measure if the real quotes come back long.
 *
 * ⚠️ SIX CARDS, A DELIBERATE DEPARTURE FROM THE CAPTURE, which ships exactly TWO here against
 * three slides above. That asymmetry was reproduced faithfully until 2026-08-12 and stops making
 * sense once the page carries clix's own six: a phone reader seeing two of six, with no arrows
 * and no affordance suggesting more exist, reads it as the list. The cost is scroll length —
 * roughly 2100px. If that proves too long, cut the TAIL rather than reordering, so the two tiers
 * keep agreeing on who comes first.
 *
 * Cards 3 to 6 take card 2's measured shape (334 / p-6 / gap-5), not card 1's. Card 1 is the
 * one-off: 505px because the original's lead card carries a longer quote and its own padding and
 * gap (`--u1dxzv` / `--50mq1o`; the two cards share neither value). `cream` is read from
 * SLIDE_STYLE above so the two tiers stripe identically by construction.
 *
 * The original's phone copy sets slot 2's ROLE in capitals AND applies
 * `text-transform: uppercase`, so it renders the same as the sentence-case one. Sentence case
 * everywhere here: identical output, one less thing to keep in step.
 */
/* ⚠️ SLOT 1 WAS `h-[505px]` WITH ITS OWN PADDING AND AN 80px GAP, AND IT IS NOT ANY MORE.
   That box was measured off the capture, and it was 171px taller than the rest for one reason:
   in the original, slot 1 carried a LONGER, DIFFERENT quote at this width. We dropped that
   `phoneLeadQuote` on 2026-08-13 because the real copy is one sentence per client and there is
   no second thing Asaf Peretz said — so the tall box was left holding ~250px of dead space above
   the author block, which is visible and reads as a layout bug rather than as air.
   The height, padding and gap are therefore normalised to the other five. A DOCUMENTED
   DIVERGENCE FROM THE CAPTURE, and the honest one: the measurement was correct for copy this
   page no longer has. Card 1 stays distinguishable by its `cream` fill, as it always was.
   Verified at 390 after the change: 6 lines in a 334px box, no clip, nothing else moved. */
const PHONE_STYLE = [
  { box: "h-[334px]", pad: "p-6", gap: "gap-5" },
  { box: "h-[334px]", pad: "p-6", gap: "gap-5" },
  { box: "h-[334px]", pad: "p-6", gap: "gap-5" },
  { box: "h-[334px]", pad: "p-6", gap: "gap-5" },
  { box: "h-[334px]", pad: "p-6", gap: "gap-5" },
  { box: "h-[334px]", pad: "p-6", gap: "gap-5" },
] as const;

/* ---- Card internals, shared by all three tiers ---------------------------------------- */

/* The original's `CompanyMark` (a 200 × 20 box at 70% opacity holding Nomura's 121 × 22 SVG,
   `contain`, pinned left top) lived here and was deleted 2026-08-12 with the `logo` field.
   See the "NO CLIENT LOGOS" note at the top: clix has none and they are ruled out, so the
   slot is gone rather than empty. */

function CardBody({
  quote,
  name,
  role,
  quoteSize,
}: {
  quote: string;
  name: string;
  role: string;
  quoteSize: string;
}) {
  return (
    <>
      {/* `.framer-p8w8fr` grows to fill the card. Its `gap-7` was the 28px between the company
          mark and the quote and is now inert, the quote being this box's only child. Kept
          because `flex-1` here is what holds the author block to the bottom of the card, and
          because it is where a second element would go if one is ever added. */}
      <div className="relative flex w-full flex-1 flex-col items-start justify-start gap-7">
        {/* Quote. `letter-spacing: 0` is the original's and is the reason this does not use
            any of the page's other type steps — every one of them is negative. */}
        <blockquote
          className={`w-full font-sans leading-[1.3em] tracking-normal text-ink ${quoteSize}`}
        >
          {quote}
        </blockquote>
      </div>

      {/* `.framer-51h5ng` → `.framer-1h8s99a` — gap 24 outside, gap 4 between the two lines. */}
      <div className="relative flex w-full flex-none flex-col items-start gap-6">
        <div className="relative flex w-full flex-col items-start gap-1">
          <p className="w-full font-sans text-[16px] leading-[130%] tracking-[-0.02em] text-ink desktop:text-[18px]">
            {name}
          </p>
          {/* Rooftop Mono in the original; Discovery here under the one-face decision of
              2026-08-08, same as every other borrowed face on this page. 1.4em and the
              uppercase transform are the original's.

              ALWAYS RENDERED, even with no role. `elyashiv-engineering` is a COMPANY, not a
              person, so it is the one entry with an empty role rather than an invented job
              title. The non-breaking space holds the line box open so its card stays the same
              height as a one-line role, and `aria-hidden` keeps a screen reader from
              announcing the filler. Same treatment as sections/Testimonials.tsx:299. */}
          <p
            className="w-full font-sans text-[14px] leading-[1.4em] tracking-normal text-muted uppercase"
            {...(role ? null : { "aria-hidden": true })}
          >
            {role || " "}
          </p>
        </div>
      </div>
    </>
  );
}

/* ---- Arrows ----------------------------------------------------------------------------
 * Vendored as `v6qQ5IM….svg` / `ar5BrAOD….svg` in the capture; inlined because they are two
 * paths each and need a `disabled` state the original's flat images cannot express.
 * The pill is `#F5F5F4` there and `surface` `#F5F5F5` here — one step of blue, deliberate:
 * a whole token for a 1/255 difference on two 40px circles is noise. Logged in FEATURE.md.
 */
/**
 * `back` selects which ARTWORK to draw — the glyph that points toward the inline start, plus the
 * `matrix(-1 0 0 1 40 0)` that mirrors the pill's own rounding to match. It does NOT mean
 * "previous".
 *
 * ⚠️ SO ITS MEANING IS DIRECTION-DEPENDENT AND THE CALL SITES DECIDE IT:
 *     back = (role === "prev") !== (dir === "rtl")
 * In ltr that is `true` for prev and `false` for next, i.e. exactly today's `<Arrow back />` and
 * `<Arrow back={false} />`, so the English markup is unchanged. In rtl the previous slide lies
 * toward the inline END, so the two glyphs swap — which is the "swap which component renders"
 * mechanism, no new artwork and no `scale-x` needed, because the pair is already exact mirrors.
 *
 * The BUTTON ORDER needs nothing: the row is `flex-row`, so under rtl prev lays out on the right,
 * which is the convention.
 */
function Arrow({ back }: { back: boolean }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className="h-10 w-10">
      <rect
        width="40"
        height="40"
        rx="20"
        className="fill-surface"
        transform={back ? "matrix(-1 0 0 1 40 0)" : undefined}
      />
      <g
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        {back ? (
          <>
            <path d="M18.215 14.098 12.5 19.813l5.715 5.715" strokeLinejoin="bevel" />
            <path d="M19.274 19.813h9.135" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <path d="m21.785 14.098 5.715 5.715-5.715 5.715" strokeLinejoin="bevel" />
            <path d="M20.726 19.813H11.59" strokeLinejoin="round" />
          </>
        )}
      </g>
    </svg>
  );
}

/* Measured on the live page — see the header note. STEP_MS is the only fitted value. */
/* ⚠️ NO AUTOPLAY — REMOVED ON THE USER'S CALL, 2026-08-11, AND THIS IS A DEVIATION.
   The original DOES autoplay, every 6.0s; that is measured, not assumed (ticks start at
   t = 4.70, 10.70, 16.64, 22.63s on the live page). It is off here because the user asked
   for it off. If it ever needs restoring, it was an interval calling `go(1)` keyed on
   `[still, go]` — deliberately not on `pos`, so the clone snap could not drift the cadence
   — and it skipped a tick while `gesture.current` was set, so it never yanked the track out
   from under a finger. Everything else about the block stays as measured. */
const STEP_MS = 1100;
/* Drag commit — fitted, see the header note. `dx` is the pointer travel, `v` the release
   velocity in px/s; a slide is the track's own width. */
const FLICK_PROJECTION_S = 0.15;
const COMMIT_FRACTION = 0.3;
/* A pointer that has not moved for this long is stationary, whatever it was doing before. */
const IDLE_MS = 80;
/* Velocity is measured over this trailing window, not over the last event pair. */
const VELOCITY_WINDOW_MS = 100;
const N = SLIDE_STYLE.length;
/* Three copies, so a step off either end of the middle copy still lands on a real slide and
   can be snapped back invisibly. The original ships four copies; three is the minimum that
   behaves identically for a ±1 step.
   An array of INDICES rather than of slides, now that the copy comes from a hook: the loop is
   layout and belongs at module scope, the strings are not. */
const LOOP = Array.from({ length: N * 3 }, (_, i) => i % N);

export default function QuoteCarousel() {
  const t = usePageDict("home").testimonials;
  const a11y = useChrome().a11y;
  /* +1 in ltr, -1 in rtl. Stable for the lifetime of the mount — switching locale is a hard
     document navigation across two root layouts — so it needs no revert/rebuild path. */
  const sign = useDirSign();
  const dir = useDirection();
  /* Which glyph each control draws. See the note on `Arrow`. */
  const drawBack = (role: "prev" | "next") => (role === "prev") !== (dir === "rtl");
  /* Start on the middle copy, so the first "Previous" has somewhere to go.
     Explicitly `<number>`: `N` is now `SLIDE_STYLE.length` on an `as const` tuple, so its type is
     the literal 6 and inference would pin the state to it. */
  const [pos, setPos] = useState<number>(N);
  const [animate, setAnimate] = useState(true);
  const [still, setStill] = useState(false);
  /* Outstanding drag offset in px, carried ON TOP of the index transform. It survives the
     release — the original does not snap back — and is cleared by the next index change,
     which is what re-aligns the track to the grid. */
  const [drag, setDrag] = useState(0);
  const [grabbing, setGrabbing] = useState(false);
  /* `samples` is a short trailing window of pointer positions, not just the last pair.
     Velocity from a single pair is wrong twice over: browsers coalesce moves (so two events
     can share a timestamp and divide by zero), and one 8ms sample is far too noisy to
     decide a gesture on. */
  const gesture = useRef<{ startX: number; lastT: number; samples: { x: number; t: number }[] } | null>(null);
  const viewport = useRef<HTMLDivElement>(null);

  /* Every index change clears the drag offset — arrows, autoplay and a committed flick all
     go through here, which is exactly how the original re-aligns. */
  const go = useCallback((delta: number) => {
    setPos((p) => p + delta);
    setDrag(0);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { startX: e.clientX, lastT: e.timeStamp, samples: [{ x: e.clientX, t: e.timeStamp }] };
    setGrabbing(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g) return;
    g.samples.push({ x: e.clientX, t: e.timeStamp });
    while (g.samples.length > 2 && e.timeStamp - g.samples[0].t > VELOCITY_WINDOW_MS) g.samples.shift();
    g.lastT = e.timeStamp;
    setDrag(e.clientX - g.startX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g) return;
    gesture.current = null;
    setGrabbing(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    const dx = e.clientX - g.startX;
    const width = viewport.current?.clientWidth ?? 0;
    /* Velocity goes STALE the moment the pointer stops. Without this, a drag that is held
       still for half a second before release still carries the last move's velocity and
       commits like a flick — which is exactly the behaviour the original does NOT have
       (340px held changes nothing there; 160px flicked advances). */
    const idle = e.timeStamp - g.lastT;
    const first = g.samples[0], lastS = g.samples[g.samples.length - 1];
    const span = lastS.t - first.t;
    const v = idle > IDLE_MS || span <= 0 ? 0 : ((lastS.x - first.x) / span) * 1000;
    const projected = dx + v * FLICK_PROJECTION_S;
    /* ⚠️ THE MAGNITUDE TEST IS SIGN-BLIND and stays exactly as fitted; only the DIRECTION test
       takes the sign. Dragging left advances in ltr and retreats in rtl, so `sign * projected`
       is what decides which index to target. `go()` itself still takes ±1 as an index step. */
    if (width && Math.abs(projected) > width * COMMIT_FRACTION) go(sign * projected < 0 ? 1 : -1);
    /* Otherwise leave `drag` exactly where the pointer left it — no snap-back. */
  };

  /* `prefers-reduced-motion` kills both the autoplay and the slide transition; the arrows
     keep working and jump straight to the next quote. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* The snap. Once a step has carried the track outside the middle copy, wait for the
     transition to finish, then re-enter the middle copy with animation OFF — same slide on
     screen, different index, no visible movement. */
  useEffect(() => {
    if (pos >= N && pos < 2 * N) return;
    const t = setTimeout(
      () => {
        setAnimate(false);
        setPos((p) => (((p % N) + N) % N) + N);
      },
      still ? 0 : STEP_MS,
    );
    return () => clearTimeout(t);
  }, [pos, still]);

  /* Re-arm the transition one frame after the snap, never in the same frame — same frame
     and the browser coalesces both style changes and animates the snap. */
  useEffect(() => {
    if (animate) return;
    const r = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(r);
  }, [animate]);

  return (
    /* ⚠️ NO `<section>`, NO `id`, NO `data-nav-theme` — sections/Testimonials.tsx owns all
       three, plus the `<h2>` and the section padding. This returns the BODY only, so the two
       testimonial treatments can be swapped under one heading without either of them owning
       the landmark. On /product this element was the inner child of its own section; the
       original's nesting is what sets the slideshow's width, so it survives the move intact.

       ⚠️ THE ARROWS DEPEND ON WHAT IS ABOVE THIS ELEMENT. They are pinned `-top-20` (-80px)
       and sit OUTSIDE this box, in whatever space the parent leaves. That worked on /product
       because the section carried `tablet:pt-[124px]`; it works on the landing page because
       the width container there is `gap-20` — 80px between the `<h2>` and this — which the
       arrows land in exactly. Change that gap and the arrows collide with the heading.

       `.framer-zrtsd2` — max-w 1280, gap 40. Only one of its two children is ever laid out,
       so the gap is inert; kept because the original's nesting is load-bearing for width. */
    <div className="relative flex w-full max-w-[var(--container-max)] flex-col items-center gap-10">
        {/* ---- ≥810: the slideshow. 694px tall at both tiers, full container width. ---- */}
        <div className="relative hidden h-[694px] w-full tablet:block">
          {/* The arrows live 40px ABOVE the box, flush to its right edge — the original
              pins them `top:-80px; right:0` inside a box whose own overflow is visible, so
              they sit in the section's 124px top padding. */}
          {/* `end-0`, not `right-0`: the controls sit against the container's inline END, so
              under rtl they move to the left edge. Resolves to `right:0` in ltr. */}
          <fieldset
            aria-label={t.a11y.controls}
            className="absolute -top-20 end-0 m-0 flex flex-row items-center gap-3 border-0 p-0"
          >
            {/* Never disabled — it loops. Measured, not assumed: both arrows report
                `disabled=false, opacity:1` at every sample of the live page. */}
            <button
              type="button"
              aria-label={a11y.previous}
              /* NO SIGN. `-1` is an index step: "previous" is one earlier in every language. */
              onClick={() => go(-1)}
              className="block cursor-pointer overflow-hidden rounded-full text-ink transition-opacity duration-300 ease-[var(--ease-rogo)] hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ink focus-visible:outline-none"
            >
              <Arrow back={drawBack("prev")} />
            </button>
            <button
              type="button"
              aria-label={a11y.next}
              onClick={() => go(1)}
              className="block cursor-pointer overflow-hidden rounded-full text-ink transition-opacity duration-300 ease-[var(--ease-rogo)] hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ink focus-visible:outline-none"
            >
              <Arrow back={drawBack("next")} />
            </button>
          </fieldset>

          {/* The viewport. Only this clips — the arrows above are outside it. It is also the
              drag surface: `touch-action: pan-y` so a vertical swipe still scrolls the page,
              and `select-none` because the original sets `user-select: none` on its track. */}
          <div
            ref={viewport}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={`absolute inset-0 touch-pan-y overflow-hidden select-none ${
              grabbing ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {/* The track. 8px between slides, so a step is `100% + 8px` = 1288px at 1440 —
                which is exactly the step the live page moves. */}
            <ul
              className="m-0 flex h-full w-full list-none flex-row items-center gap-2 p-0"
              style={{
                /* ⚠️ `sign * -pos`. Under rtl a `flex-row` track lays slide 0 against the
                   container's RIGHT edge and overflows leftward, so slide `pos` is brought into
                   view by translating `+pos × step`. `drag` is NOT signed — it is a physical
                   pointer delta and `translateX` is a physical axis, so the two already agree. */
                transform: `translateX(calc(${sign * -pos} * (100% + 8px) + ${drag}px))`,
                /* No transition while a finger is down — the track tracks the pointer 1:1. */
                transition:
                  animate && !still && !grabbing
                    ? `transform ${STEP_MS}ms cubic-bezier(.25,1,.5,1)`
                    : "none",
              }}
            >
              {LOOP.map((slide, i) => {
                const copy = t.slides[slide];
                const style = SLIDE_STYLE[slide];
                return (
                <li
                  key={`${style.id}-${i}`}
                  aria-hidden={i !== pos}
                  className="flex h-full w-full flex-none flex-row items-center gap-4"
                >
                  {/* The card. `justify-center` with a `flex-1` body is what holds the
                      author block to the bottom without a spacer. */}
                  <div
                    className={`relative flex h-full w-px flex-1 flex-col items-start justify-center gap-20 overflow-hidden p-12 ${
                      style.cream ? "bg-bone" : "bg-surface"
                    }`}
                  >
                    <CardBody
                      quote={copy.quote}
                      name={copy.name}
                      role={copy.role}
                      quoteSize={`text-[28px] ${style.quoteDesktop}`}
                    />
                  </div>
                  {/* The portrait: 360px wide, full height. Hidden below 1200 — that is the
                      whole difference between the original's `Desktop` and `Mobile`
                      slideshow variants.

                      ⚠️ `object-position` is CENTRE, not left. The capture's inline style
                      says `object-position:left center`; the hydrated component computes
                      `50% 50%`, and centre is what the live page shows. Reading the capture
                      alone gets this wrong, and it is visible — the crop lands on a
                      different part of the frame. That matters more here than it did with the
                      capture's studio headshots: these three files are POSTER FRAMES pulled
                      from the clients' testimonial videos, framed for a 9:16 phone clip, not
                      portraits shot for a 360 × 694 slot. */}
                  <div className="relative hidden h-full w-[360px] flex-none desktop:block">
                    {/* No `width`/`height` attributes, deliberately. The capture's three
                        headshots shared one intrinsic size (781 × 1024) and could state it;
                        ours do not (720 × 1014 for asaf, 720 × 1272 for the other two), so a
                        single pair would be false for at least one of them. Nothing is lost:
                        the box above fixes BOTH axes in CSS, so the intrinsic ratio can cause
                        no layout shift and the attributes would only be wrong metadata. */}
                    {/* ⚠️ THE ALT IS A TEMPLATE, `"{name}, {role}"`, so the glue between the two
                        is a translator's decision and not a hard-coded English comma. It is the
                        same comma in Hebrew, so the rendered string is unchanged in both — but
                        the punctuation is now stated in the dictionary rather than in JSX.
                        PRE-EXISTING WART, CARRIED: `elyashiv-engineering` has an empty role, so
                        its alt has always ended in a trailing ", ". Not fixed here, because
                        fixing it would move the English render. Reported. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={style.photo}
                      alt={interpolate(t.a11y.portraitAlt, { name: copy.name, role: copy.role })}
                      /* Without this the browser's own image-drag ghost hijacks the
                         gesture and the carousel never sees the pointer move. */
                      draggable={false}
                      className="block h-full w-full object-cover object-center"
                    />
                  </div>
                </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ---- ≤809: six static cards, slot 1 first, no arrows. ---- */}
        <div className="relative flex w-full flex-col items-center gap-6 overflow-hidden tablet:hidden">
          {PHONE_STYLE.map((box, i) => (
            /* `pt-8 pr-6 pb-6 pl-6` on card 1 is a SYMMETRIC HORIZONTAL PAIR — `pr-6 pl-6` is
               `px-6` written long, and only the vertical values differ. Direction-neutral by
               construction, so it stays physical: migrating it would swap two identical numbers.
               Verified, not overlooked. */
            <div
              key={SLIDE_STYLE[i].id}
              className={`relative flex w-full flex-col items-start justify-center overflow-hidden ${box.box} ${box.pad} ${box.gap} ${
                SLIDE_STYLE[i].cream ? "bg-bone" : "bg-surface"
              }`}
            >
              <CardBody
                /* ⚠️ SLOT 1 USED TO HAVE ITS OWN STRING HERE (`phoneLeadQuote`), REPRODUCING THE
                   TARGET'S EDITORIAL QUIRK: the original ships a genuinely different sentence in
                   this slot at ≤809, not a shortened one, and the placeholders kept the quirk
                   structurally so it would survive the real copy landing.

                   It did not survive, and it should not have. The real quotes arrived 2026-08-13
                   as one sentence per client — there is no second thing Asaf Peretz said, and
                   inventing a phone-only variant of a real endorsement is the exact failure the
                   placeholders existed to prevent. Duplicating his one quote into a second key
                   would have been worse still: two strings to keep in step, for nothing.
                   So `phoneLeadQuote` is deleted from both locale files and every card at every
                   width now reads its own slide. */
                quote={t.slides[i].quote}
                name={t.slides[i].name}
                role={t.slides[i].role}
                quoteSize="text-[20px]"
              />
            </div>
          ))}
      </div>
    </div>
  );
}
