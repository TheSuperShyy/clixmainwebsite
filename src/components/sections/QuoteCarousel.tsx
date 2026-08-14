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
 * ✅ THE PHOTO COLUMN PLAYS SINCE 2026-08-13. Those six "portraits" were always poster frames
 * cut from the clients' own testimonial videos, and the videos have been sitting unused in
 * `public/testimonials/<id>.mp4` since the accordion was retired. At ≥1200 the column is a
 * play target: click it and it widens 360 → 480px over 400ms while the clip plays with SOUND;
 * pause, end, Escape, an arrow, a committed flick, or a resize across 1200 all collapse it back
 * to the poster.
 *
 * ✅ AND IT PLAYS BELOW 1200 SINCE 2026-08-14, WHERE IT IS NOT A COLUMN. On the user's ask —
 * "make this part show the video in mobile view, but I prefer that it also shows the quote AND
 * the video" — a phone and a tablet now get a BYLINE TILE: the same player at 72 × 96 (96 × 128
 * at 810–1199), sitting in the author row beside the name, growing to 168 × 224 (216 × 288) when
 * tapped. Quote and clip are visible at once; the quote text does not move while it grows,
 * because the `flex-1` quote block absorbs the height and only the card's bottom edge travels.
 * A flip was considered and rejected by the user for exactly that reason — a flip hides one side.
 *
 * FIVE THINGS ABOUT IT ARE LOAD-BEARING, each argued where it is written:
 *   1. exactly TWO `<video>` elements exist — one per media box — and both only at `pos`,
 *      `preload="none"`. `LOOP` renders 18 `<li>` and a video per slide would be ~68MB of clips
 *      fetched three times over. Two boxes cannot share one element because they are different
 *      DOM POSITIONS; each box's own button plays the element beside it, so no `matchMedia` and
 *      no tier state is needed, and an unplayed `preload="none"` element costs nothing
 *   2. `play()` is called INSIDE the click handler, which is why the element is mounted rather
 *      than created on click — Safari does not forgive a deferred gesture
 *   3. `go()` stops the clip SYNCHRONOUSLY before `setPos`, not in an effect — an effect runs
 *      after React has remounted the video into the incoming `<li>`, leaving the OLD detached
 *      element playing audio with nothing holding a reference to it
 *   4. `stopPropagation` on the button's `pointerdown` — the viewport's pointer CAPTURE
 *      retargets `pointerup` and the click would fire on the viewport, never on the button.
 *      The cost: the player is not a drag surface at any tier
 *   5. the resize guard stops on ANY crossing of 1200, both directions. Each tier now has its
 *      own box, so either can be `display:none`d out from under a running clip
 *
 * THE QUOTE GETS 120px NARROWER WHILE A CLIP RUNS, AND THAT WAS MEASURED, NOT ASSUMED. The card
 * is `flex-1 w-px` beside a `flex-none` column, so it absorbs the whole 120px; nothing else on
 * the page moves. Vertical budget inside the card: 694 − 96 (`p-12`) − 80 (`gap-20`) − 47
 * (author block) = 471px for the blockquote, i.e. 10 lines at 36px or 11 at 32px. The binding
 * cell is `adir-peretz` — 289 English characters at 32px — at exactly 1200px viewport, where
 * the section's `tablet:px-10` puts the container at 1120 and the measure at 528px. It runs ~10
 * lines with ~1.3 lines to spare. ⚠️ IF COPY EVER GROWS, RE-MEASURE THAT CELL: the quote block
 * has `min-height:auto` so it pushes the author block down and `overflow-hidden` clips from the
 * BOTTOM — the role line vanishes first, then the name, and the quote itself never clips, so
 * the regression is invisible unless you look for it.
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
 * THE ORIGINAL SHIPS THREE SUBTREES; THIS SHIPS **ONE** SINCE 2026-08-14.
 *
 * | tier      | original                                  | here |
 * |-----------|-------------------------------------------|------|
 * | ≥1200     | `Desktop` slideshow: 3 slides WITH photos  | the slideshow, player as a 360→480px COLUMN |
 * | 810–1199  | `Mobile` slideshow: same 3 slides, NO photos | the same slideshow, player as a 96×128 BYLINE TILE |
 * | ≤809      | `Testimonials (Mobile)`: a static stack of **two** cards, no arrows, different copy | the same slideshow again — 72×96 tile, dots instead of arrows, card height 400→528 while playing |
 *
 * ⚠️ THE ≤809 STATIC STACK IS GONE, AND WITH IT `PHONE_STYLE`. Until 2026-08-14 the phone tier
 * was its own markup — six fixed-height cards, no arrows, no photos, ~2100px of scroll — because
 * the original's own phone tier is not a responsive variant of its slideshow. That reasoning
 * stopped applying the moment phones had to play video: the slideshow was ALREADY a swiper (1:1
 * pointer tracking, velocity-projected commit, the triple loop) and it was gated off below 810
 * by a single `hidden tablet:block`. Rendering it at every width bought swipe, the loop and
 * "one clip at a time" for free — only the slide at `pos` mounts a video — and deleted ~40 lines
 * of parallel markup that had to be kept in step by hand. The user chose the swiper explicitly.
 *
 * WHAT THAT DELIBERATELY GIVES UP, STATED: the phone reader no longer sees all six quotes by
 * scrolling. Five are behind a swipe. The dots exist to say the other five are there.
 *
 * The capture's own phone quirks were already dead before this and are NOT resurrected:
 *   · it shipped two testimonials, not three; clix ships all six at every tier
 *   · slot 1's quote was **different copy** at that width in the original — not a truncation
 *     but a different sentence ("Rogo is going to transform" there versus "Rogo transforms"
 *     above 810). ⚠️ **WE NO LONGER REPRODUCE THAT.** The quirk was carried through the
 *     placeholder generation as `phoneLeadQuote` so it would survive the real copy landing; when
 *     the real copy landed on 2026-08-13 it was one sentence per client, and there is no second
 *     thing Asaf Peretz said. Inventing a phone-only variant of a real endorsement is precisely
 *     what the placeholders existed to prevent, so the key was deleted from both locale files
 *     and every card at every width now reads its own slide.
 * Its measured phone paddings and gaps (p-6, gap-5, 20px quote) DID survive — they are now
 * responsive steps on the one card, and they preserve the 310px measure at 390px wide, so the
 * line counts recorded in features/testimonials/CONTEXT.md still hold.
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
  { id: "nevo-yahaloman", photo: "/testimonials/nevo-yahaloman.jpg", cream: true, quoteDesktop: "desktop:text-[36px]" },
  { id: "asaf-peretz", photo: "/testimonials/asaf-peretz.jpg", cream: false, quoteDesktop: "desktop:text-[36px]" },
  { id: "adir-peretz", photo: "/testimonials/adir-peretz.jpg", cream: true, quoteDesktop: "desktop:text-[32px]" },
  { id: "noam-tovi", photo: "/testimonials/noam-tovi.jpg", cream: false, quoteDesktop: "desktop:text-[36px]" },
  { id: "achituv", photo: "/testimonials/achituv.jpg", cream: true, quoteDesktop: "desktop:text-[32px]" },
  { id: "elyashiv-engineering", photo: "/testimonials/elyashiv-engineering.jpg", cream: false, quoteDesktop: "desktop:text-[36px]" },
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
  media,
}: {
  quote: string;
  name: string;
  role: string;
  quoteSize: string;
  /* The byline tile, below 1200 only — see `MediaBox`. A SLOT rather than props, because at
     ≥1200 there is nothing here at all: the media is a sibling column, not part of the byline.
     Passing `undefined` renders the author block exactly as it shipped before. */
  media?: React.ReactNode;
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

      {/* `.framer-51h5ng` → `.framer-1h8s99a` — gap 24 outside, gap 4 between the two lines.
          ⚠️ A ROW BELOW 1200 SINCE 2026-08-14, holding the byline tile beside the name; the
          original's column layout is restored at `desktop:` where the media is a sibling
          column instead. `flex-row` + a logical `gap` puts the tile at the INLINE START in
          both directions, so this needs no `useDirSign()` — see the RTL list in the header. */}
      <div className="relative flex w-full flex-none flex-row items-start gap-4 desktop:block">
        {media}
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

/* ---- The player, shared by the byline tile and the ≥1200 column -------------------------
 * ONE COMPONENT, TWO CALL SITES, because the two are the same thing at two sizes: a poster,
 * a <video> crossfading over it, and a single inset-0 button that is the entire transport.
 * Only the box geometry and the badge scale differ, so those are props and nothing else is.
 *
 * ⚠️ IT IS RENDERED ON ALL EIGHTEEN <li>, LIVE ON ONE. Rendering only at `pos` would pop the
 * badge in and out mid-transition — neighbours are visibly on screen for the whole 1100ms step,
 * and permanently after a slow drag rests the track off-grid. So it is drawn everywhere, the
 * handler is gated on `active`, and `tabIndex` follows the <li>'s own `aria-hidden` so the 17
 * clones stay out of the tab order.
 *
 * ⚠️ THE <video> IS MOUNTED ONLY WHEN `active`, AND `preload="none"` IS WHAT MAKES THAT FREE.
 * An unplayed `preload="none"` video fetches no media at all; `poster` is the same URL as the
 * <img> above it, so that is a cache hit rather than a second download. It is set even though
 * the element is invisible until it plays: without it the element paints transparent-to-black
 * between `play()` returning and the first frame decoding, and the crossfade shows that flash.
 *
 * NOT muted — AUDIO IS THE POINT. NO `controls` — the button is the whole transport, by
 * decision. `playsInline` is what keeps iOS from taking the clip fullscreen.
 */
function MediaBox({
  photo,
  clipId,
  alt,
  name,
  active,
  expanded,
  playing,
  still,
  videoRef,
  onToggle,
  onPlaying,
  box,
  badge,
  icon,
  labels,
}: {
  photo: string;
  clipId: string;
  alt: string;
  name: string;
  active: boolean;
  expanded: boolean;
  playing: boolean;
  still: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onToggle: () => void;
  onPlaying: (v: boolean) => void;
  /* Visibility + width/height, at every tier. Carries the tier gate itself (`desktop:hidden`
     on the tile, `hidden desktop:block` on the column) so this component never knows the tier. */
  box: string;
  badge: string;
  icon: string;
  labels: { play: string; pause: string };
}) {
  return (
    <div
      className={`relative flex-none ${box}`}
      /* Inline rather than `transition-[width,height]` classes for one reason: `still` has to
         make it INSTANT, and this is the same shorthand the track already reads by.
         NO `overflow-hidden` — both children are `w-full h-full` so there is nothing to clip,
         and it would eat the button's focus ring. */
      style={{
        transition: still
          ? "none"
          : `width ${EXPAND_MS}ms var(--ease-rogo), height ${EXPAND_MS}ms var(--ease-rogo)`,
      }}
    >
      {/* No `width`/`height` attributes, deliberately. The six files do not share an intrinsic
          size (720 × 1014 through 720 × 1280), so a single pair would be false for most of
          them. Nothing is lost: the box above fixes BOTH axes in CSS, so the intrinsic ratio
          can cause no layout shift and the attributes would only be wrong metadata.
          `object-position` is CENTRE, not left — these are poster frames pulled from the
          clients' own 9:16 phone clips, and centre is what the live page shows. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo}
        alt={alt}
        /* Without this the browser's own image-drag ghost hijacks the gesture and the carousel
           never sees the pointer move. */
        draggable={false}
        className="block h-full w-full object-cover object-center"
      />

      {active && (
        <video
          ref={videoRef}
          src={`/testimonials/${clipId}.mp4`}
          poster={photo}
          preload="none"
          playsInline
          /* STATE MIRRORS THE ELEMENT, IT DOES NOT PREDICT IT. `play` fires the instant `paused`
             flips to false — before any data — so the box starts growing on the tap rather than
             on the first buffer. `pause` catches every stop we did not initiate as well: an OS
             media key, a headphone button, another tab taking audio focus. */
          onPlay={() => onPlaying(true)}
          onPause={() => onPlaying(false)}
          /* ⚠️ `ended` DOES NOT FIRE `pause`. Per spec the ended playback algorithm fires
             `timeupdate` + `ended` and leaves `paused` FALSE, so `onPause` will not run and this
             has to collapse on its own. (Some older WebKit builds fire both; both handlers are
             idempotent, so a double fire is one render.) `currentTime = 0` so the next tap
             restarts the clip rather than re-ending instantly. A PAUSE keeps its position by
             contrast — collapsing is not the same as giving up. */
          onEnded={(e) => {
            e.currentTarget.currentTime = 0;
            onPlaying(false);
          }}
          className={`absolute inset-0 block h-full w-full object-cover object-center ${
            playing ? "opacity-100" : "opacity-0"
          }`}
          style={{ transition: still ? "none" : "opacity 300ms var(--ease-rogo)" }}
        />
      )}

      {/* ONE BUTTON, INSET-0, LABEL AND GLYPH SWAPPING. Not two elements: the pause target IS
          the whole box, so a separate pause control would be this same absolute box written
          twice — and swapping the two would unmount the focused element, drop focus to <body>,
          and leave a keyboard user who pressed Space to play unable to press Space to pause.

          ⚠️ `stopPropagation` ON POINTERDOWN, AND IT IS LOAD-BEARING TWICE OVER. The viewport
          owns onPointerDown/Move/Up and calls `setPointerCapture` on itself. Capture RETARGETS
          the pointerup — and the compatibility mouseup with it — to the viewport, so the browser
          computes `click` at the common ancestor and fires it on the VIEWPORT: onClick here
          would simply never run. Left unstopped it would also start a drag under every tap.
          THE COST, STATED: these pixels are not a drag surface. At ≥1200 that is 360 of 1280px;
          below 1200 the tile is ~20% of the card's width and the rest of the card is the
          natural place to grab. */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => {
          if (active) onToggle();
        }}
        tabIndex={active ? 0 : -1}
        /* The accessible name carries the person, not just "play" — a screen reader user moving
           through the carousel needs to know whose. Both are `interpolate()` templates from
           `chrome.a11y` rather than assembled here, because the Hebrew word order is not
           "Play X's Y". */
        aria-label={interpolate(expanded ? labels.pause : labels.play, { name })}
        /* `bg-transparent` at rest, NOT a permanent scrim: the resting box has to look exactly
           like the photograph. The scrim is hover-only. */
        className="group absolute inset-0 flex cursor-pointer items-center justify-center bg-transparent transition-colors duration-300 hover:bg-ink/10 focus-visible:ring-2 focus-visible:ring-paper focus-visible:outline-none"
        style={{ transitionTimingFunction: "var(--ease-rogo)" }}
      >
        {/* Fades out while playing so a running clip is clean, and comes back on hover or
            keyboard focus so the pause stays discoverable. */}
        <span
          aria-hidden="true"
          className={`flex items-center justify-center rounded-full bg-paper/90 backdrop-blur-sm transition-[transform,opacity] duration-300 group-hover:scale-110 group-hover:opacity-100 group-focus-visible:scale-110 group-focus-visible:opacity-100 ${badge} ${
            expanded ? "opacity-0" : "opacity-100"
          }`}
          style={{ transitionTimingFunction: "var(--ease-rogo)" }}
        >
          {expanded ? (
            /* NO `ml-[2px]` HERE, AND THAT IS NOT AN OVERSIGHT. The nudge on the play triangle
               is an optical correction for a shape whose visual mass sits toward its flat edge;
               the pause bars are symmetric about their own centre, so the same nudge would push
               them 2px OFF centre. */
            <svg viewBox="0 0 24 24" className={`fill-ink ${icon}`}>
              <path d="M7 4.5h3.5v15H7zM13.5 4.5H17v15h-3.5z" />
            </svg>
          ) : (
            /* ⚠️ `ml-[2px]` IS PHYSICAL ON PURPOSE — DO NOT MIGRATE IT TO `ms-`, and do not add
               `rtl:-scale-x-100` to the glyph. Two reasons pointing the same way. (1) Play/pause
               are MEDIA-TRANSPORT glyphs and no platform mirrors them; only skip-forward/back
               mirror, because only those mean "the direction reading goes" — a left-pointing
               play button on /he would read as rewind. (2) The nudge is an optical correction
               tied to the un-mirrored artwork's visual mass, so it has to stay on the physical
               side that mass is on. */
            <svg viewBox="0 0 24 24" className={`ml-[2px] fill-ink ${icon}`}>
              <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
            </svg>
          )}
        </span>
      </button>
    </div>
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
/* ⚠️ AUTHORED, NOT MEASURED — AND THERE IS NOTHING TO MEASURE. The capture's slideshow has no
   video column at all; the thing beside the quote there is a static headshot. So this is the
   one duration on this component that was written rather than read off the live page, and it
   is sized against the two that were read: the site's 300ms link preset (Nav, Footer,
   globals.css) and this track's own 1100ms step. 400ms sits between them on purpose — fast
   enough that widening the portrait does not read as a page change, slow enough that the quote
   reflowing underneath it reads as one movement instead of a jump.
   `--ease-rogo` and NOT the track's `cubic-bezier(.25,1,.5,1)`: that curve is a fitted stand-in
   for a measured SPRING on the track, and it means nothing outside that one job. */
const EXPAND_MS = 400;
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
  /* ⚠️ TWO `<video>` ELEMENTS, ONE PER MEDIA BOX, AND BOTH ONLY ON THE SLIDE AT `pos`.
     Until 2026-08-14 there was exactly one, because there was exactly one media box. The byline
     tile and the ≥1200 column are different DOM POSITIONS, so one element cannot serve both.
     The rejected alternative was a `matchMedia` tier state deciding which to mount: that adds
     hydration surface — the server has no `window`, so it would render one branch and possibly
     flip on hydration — for no gain.
     THE INVARIANT THAT ACTUALLY MATTERED SURVIVES INTACT: `LOOP` renders 18 `<li>`, and a video
     per slide would be 18 (now 36) elements and, on anything above `preload="none"`, the six
     clips fetched three times over — ~68MB. Mounting is gated on `active` exactly as before, and
     an unplayed `preload="none"` video fetches no media at all, so the second element costs
     nothing. Both are REMOUNTED on every index change (different parent — React cannot move a
     DOM node across parents), which is why `go()` must stop them synchronously; see below.
     NOTHING HAS TO KNOW THE TIER: each box's own button plays the element beside it, and the
     hidden box's button is `display:none` and therefore unclickable. */
  const columnVideo = useRef<HTMLVideoElement>(null);
  const tileVideo = useRef<HTMLVideoElement>(null);
  /* ⚠️ A BOOLEAN, NOT AN INDEX. The video only ever exists at `pos`, and every path that
     changes `pos` stops it first (see `go`), so "which slide is playing" is not an independent
     fact — it is always `pos`. Storing an index would make `playingIndex !== pos` representable,
     and there is no behaviour for that state. Per-slide the flag is DERIVED in the map below,
     the same move `sections/Testimonials.tsx` makes with its `playing`. */
  const [playing, setPlaying] = useState(false);

  /* Pause AND collapse. Only ever called from an event handler or a listener — never from an
     effect body, which is what `react-hooks/set-state-in-effect` forbids and what bit
     sections/Testimonials.tsx (see its note above `play`).
     Idempotent by construction: `pause()` on an already-paused element fires no event, and
     `setPlaying(false)` when it is already false is a React bail-out. */
  /* Pauses BOTH boxes' elements without asking which one is visible. `pause()` on an
     already-paused element fires no event, so hitting the hidden one is free and the whole
     thing stays idempotent — which is the property every caller below relies on. */
  const stop = useCallback(() => {
    columnVideo.current?.pause();
    tileVideo.current?.pause();
    setPlaying(false);
  }, []);

  /* ⚠️ `play()` IS CALLED HERE, INSIDE THE CLICK HANDLER, and that is the entire reason the
     element is MOUNTED rather than created on click. Deferring it behind a mount + effect puts
     it one macrotask past the gesture; Chrome forgives that, Safari does not, and the failure is
     silent — a rejected promise over a frozen poster.
     `playing` is deliberately NOT set here. The element's own `play` event sets it, and that
     fires the moment `paused` flips to false, BEFORE a single byte arrives. Setting it off the
     promise instead (which is what Testimonials.tsx does, safely, because native `controls` back
     it up) would leave the button dead for as long as the first buffer takes — and with
     `preload="none"` the fetch only starts on this call. */
  /* Takes the ref of the box that was CLICKED, which is how the tier stays out of the JS: the
     button that ran this handler is, by construction, the visible one. */
  const toggle = useCallback((ref: React.RefObject<HTMLVideoElement | null>) => {
    const el = ref.current;
    if (!el) return;
    if (!el.paused) {
      el.pause();
      return;
    }
    /* Rejects on an untrusted gesture, a missing file, or — routinely — an AbortError when an
       arrow is hit before the first frame lands and `go()` pauses the pending play. All three
       want the same thing: stay collapsed, stay on the poster. */
    void el.play().catch(() => setPlaying(false));
  }, []);

  /* Every index change clears the drag offset — arrows, autoplay and a committed flick all
     go through here, which is exactly how the original re-aligns.

     ⚠️ AND IT STOPS THE VIDEO, SYNCHRONOUSLY, BEFORE `setPos`. Not in an effect keyed on
     `pos`, which is what sections/Testimonials.tsx does and what does NOT work here: by the time
     such an effect ran, React would already have unmounted the video from the old `<li>` and
     mounted a fresh one in the new, so both refs would point at the new SILENT elements
     while the old, DETACHED one carried on playing audio with nothing left holding a reference
     to it. Pausing here, still inside the click/pointer handler, catches the element while it is
     mounted and the ref is valid. It also has to set `playing` itself rather than wait for the
     `pause` event, which is queued as a task and would land after React had torn the element's
     listeners down — leaving the incoming column stuck at 480px over a poster.
     Setting state in an EVENT HANDLER is fine; it is an effect BODY the lint rule forbids.

     This is also what makes `playing` safe as a bare boolean: it establishes the invariant
     "playing ⇒ `pos` has not changed since play began". The clone-snap effect's own `setPos` is
     exempt — it only runs when `pos` is outside the middle copy, which only happens after a
     `go()`, which already stopped. */
  const go = useCallback((delta: number) => {
    stop();
    setPos((p) => p + delta);
    setDrag(0);
  }, [stop]);

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

  /* Escape stops the clip, from anywhere on the page. The button is usually focused — it was
     just clicked or Entered — but it need not be, and a `window` listener is the only thing
     that covers a mouse user who has since clicked elsewhere. Nothing else on this page claims
     Escape while a video runs: Nav's own handler requires its menu to be open.
     `stop()` runs inside the LISTENER, not in the effect body, so the setState lint rule holds. */
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, stop]);

  /* ⚠️ `display:none` DOES NOT STOP PLAYBACK, AND NOW IT CUTS BOTH WAYS. Before 2026-08-14 only
     the column existed and only shrinking under 1200 could hide a playing element. Now each
     tier has its own box, so crossing 1200 in EITHER direction hides whichever one is running
     and leaves audio playing from something nobody can see or click.
     So the guard is no longer "pause if below" but "stop on any change of the query" — which is
     also strictly simpler, and preserves today's observable behaviour: a resize across the
     boundary stops the clip and collapses the box rather than trying to hand off. A hand-off
     would have to call `play()` outside a user gesture, which Safari rejects silently.
     `pause()` only, on both elements; the resulting `pause` event flips `playing` through the
     handler on the <video>, so there is no setState in this effect body.
     1200 is `--breakpoint-desktop`, and a media-query string cannot read a custom property — if
     that tier ever moves, move both. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1200px)");
    const sync = () => {
      columnVideo.current?.pause();
      tileVideo.current?.pause();
    };
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
        {/* ---- THE SLIDESHOW, AT EVERY WIDTH SINCE 2026-08-14. 694px tall at ≥810 exactly as
             measured; below that the height is state-driven and grows while a clip plays. ---- */}
        <div
          /* ⚠️ THE HEIGHT COMES FROM AN INLINE CUSTOM PROPERTY, NOT AN INLINE `height`, and that
             is the whole trick: an inline `height` cannot be media-queried, so `tablet:h-[694px]`
             could never win over it. A custom property CAN be shadowed by a class, so ≥810 keeps
             its measured 694px box at rest AND while playing, and the var is simply inert there.
             Phone numbers are measured: 24 (p-6) + 234 (9 lines × 26px, the longest English
             quote in a 310px measure) + 20 (gap-5) + 96 (tile) + 24 = 398 → 400. Playing swaps
             the 96px tile for 224px → 528. All six slides now share ONE height, so it is fitted
             to the longest quote rather than per-card. */
          style={
            {
              "--card-h": playing ? "528px" : "400px",
              /* Harmless at ≥810: the computed height there is a constant 694px, so there is
                 never anything to interpolate. `still` kills it, like everywhere else. */
              transition: still ? "none" : `height ${EXPAND_MS}ms var(--ease-rogo)`,
            } as React.CSSProperties
          }
          className="relative h-[var(--card-h)] w-full tablet:h-[694px]"
        >
          {/* The arrows live 40px ABOVE the box, flush to its right edge — the original
              pins them `top:-80px; right:0` inside a box whose own overflow is visible, so
              they sit in the section's 124px top padding. */}
          {/* `end-0`, not `right-0`: the controls sit against the container's inline END, so
              under rtl they move to the left edge. Resolves to `right:0` in ltr. */}
          {/* ⚠️ `hidden tablet:flex` SINCE 2026-08-14. Below 810 the dots below the carousel are
              the pagination control instead — the arrows are pinned into the section's 80px
              heading gap, which is not a place a thumb goes on a phone. */}
          <fieldset
            aria-label={t.a11y.controls}
            className="absolute -top-20 end-0 m-0 hidden flex-row items-center gap-3 border-0 p-0 tablet:flex"
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
                /* The one live slide. 17 of the 18 <li> are clones; only this one owns the
                   video, and only its play button does anything. */
                const active = i === pos;
                /* DERIVED, not stored — see the note on `playing`. */
                const expanded = active && playing;
                return (
                <li
                  key={`${style.id}-${i}`}
                  aria-hidden={i !== pos}
                  className="flex h-full w-full flex-none flex-row items-center gap-4"
                >
                  {/* The card. `justify-center` with a `flex-1` body is what holds the
                      author block to the bottom without a spacer.
                      The phone steps (p-6, gap-5, 20px quote) are the MEASURED values the
                      deleted static stack used, carried over unchanged — same 310px measure at
                      390, so its recorded line counts still hold. */}
                  <div
                    className={`relative flex h-full w-px flex-1 flex-col items-start justify-center gap-5 overflow-hidden p-6 tablet:gap-20 tablet:p-12 ${
                      style.cream ? "bg-bone" : "bg-surface"
                    }`}
                  >
                    <CardBody
                      quote={copy.quote}
                      name={copy.name}
                      role={copy.role}
                      quoteSize={`text-[20px] tablet:text-[28px] ${style.quoteDesktop}`}
                      /* ⚠️ THE BYLINE TILE — BELOW 1200 ONLY. It is the same player as the
                         column, at a smaller size, sitting in the author row so the quote and
                         the video are visible AT ONCE. Tapping grows it in place while the clip
                         crossfades in: the same gesture the column already makes at ≥1200
                         (360 → 480px), turned onto the vertical axis.

                         ⚠️ THE QUOTE TEXT DOES NOT MOVE WHEN IT GROWS, and that is structural
                         rather than lucky. The quote block is `flex-1` and starts its content at
                         the top, so the extra height the card gains is absorbed there; the tile
                         and the byline extend DOWNWARD and only the card's bottom edge travels.

                         ONE ASPECT RATIO (3:4) AT BOTH SIZES AND BOTH TIERS, so the growth is a
                         pure scale — an aspect change mid-animation reads as a glitch. The
                         sources are 9:16, so `object-cover` crops the sides; faces are centred.

                         ⚠️ TABLET DOES NOT GROW THE CARD, AND THAT IS MEASURED SLACK. 694 − 48
                         − 48 − 80 = 518px for quote + tile; a 288px tile leaves 230px, and the
                         longest English quote at 28px in an 848px measure runs ~5 lines ≈ 182px.
                         ~48px spare. IF QUOTE COPY GROWS, RE-CHECK THAT CELL FIRST: the quote
                         block has `min-height:auto`, so it refuses to shrink and pushes the
                         author block out through `overflow-hidden`, clipping the role line and
                         then the name — invisibly, unless you look for it. */
                      media={
                        <MediaBox
                          photo={style.photo}
                          clipId={style.id}
                          alt={interpolate(t.a11y.portraitAlt, { name: copy.name, role: copy.role })}
                          name={copy.name}
                          active={active}
                          expanded={expanded}
                          playing={playing}
                          still={still}
                          videoRef={tileVideo}
                          onToggle={() => toggle(tileVideo)}
                          onPlaying={setPlaying}
                          box={
                            expanded
                              ? "h-[224px] w-[168px] desktop:hidden tablet:h-[288px] tablet:w-[216px]"
                              : "h-24 w-[72px] desktop:hidden tablet:h-32 tablet:w-24"
                          }
                          badge="h-8 w-8 tablet:h-11 tablet:w-11"
                          icon="h-3.5 w-3.5 tablet:h-5 tablet:w-5"
                          labels={{ play: a11y.playTestimonial, pause: a11y.pauseTestimonial }}
                        />
                      }
                    />
                  </div>

                  {/* ⚠️ THE ≥1200 COLUMN — UNCHANGED IN EVERY VISIBLE RESPECT. 360px wide at
                      rest, full card height, widening to 480 over 400ms while the clip runs.
                      What changed on 2026-08-14 is only that its markup now comes from the
                      shared `MediaBox` instead of being written out here, and that it is one of
                      TWO players rather than the only one. The tier gate is still a class and
                      still the entire mechanism.

                      ⚠️ THE WIDTH IS THE ONLY THING THAT ANIMATES HERE, AND THE CARD ABSORBS IT.
                      The <li> is `w-full flex-none` and the card beside this is `flex-1 w-px`,
                      so 360 → 480 takes 120px out of the card and NOTHING out of the track: the
                      ul's transform is a percentage of its own width, which does not change, and
                      the box two levels up is a constant 694px at this tier. No page reflow, no
                      track shift. The quote reflows narrower and taller — measured, see the
                      vertical budget in the header note.

                      ⚠️ 480 IS FIXED FOR ALL SIX, not derived from each clip's aspect ratio. The
                      files run 720 × 1014 through 720 × 1280, so a per-clip width would move the
                      column a different distance on every slide and reflow the quote by a
                      different amount — inconsistent motion for no gain, since `object-cover`
                      crops either way. */}
                  <MediaBox
                    photo={style.photo}
                    clipId={style.id}
                    alt={interpolate(t.a11y.portraitAlt, { name: copy.name, role: copy.role })}
                    name={copy.name}
                    active={active}
                    expanded={expanded}
                    playing={playing}
                    still={still}
                    videoRef={columnVideo}
                    onToggle={() => toggle(columnVideo)}
                    onPlaying={setPlaying}
                    box={`hidden h-full desktop:block ${expanded ? "w-[480px]" : "w-[360px]"}`}
                    /* 56px rather than the tile's 32: this badge sits on a 360–480px column. */
                    badge="h-14 w-14"
                    icon="h-5 w-5"
                    labels={{ play: a11y.playTestimonial, pause: a11y.pauseTestimonial }}
                  />
                </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ---- ≤809: dots. The phone's pagination, and its "there are six of these" signal.
             The wrapper's `gap-10` — inert until 2026-08-14, because only one of its two
             children ever laid out — is what puts 40px between these and the carousel.

             `go()` TAKES A DELTA, so a dot targets its own slide by subtracting the current
             modulo index. A multi-step jump animates across in one STEP_MS and can land outside
             the middle copy; the clone-snap effect already handles exactly that, silently. ---- */}
        <div
          role="group"
          aria-label={t.a11y.controls}
          className="flex flex-row items-center gap-2 tablet:hidden"
        >
          {SLIDE_STYLE.map((s, i) => {
            const current = ((pos % N) + N) % N;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i - current)}
                /* `aria-current` rather than `aria-selected`: these are not tabs, and
                   `aria-pressed` would claim a toggle that does not untoggle. */
                aria-current={i === current}
                aria-label={interpolate(a11y.slideOfTotal, { n: String(i + 1), total: String(N) })}
                /* The hit area is 24px square while the ink is 8px — a 8px tap target fails
                   WCAG 2.5.8 and misses under a thumb. Padding, not margin, so the gap-2 above
                   still describes the visible spacing between dots. */
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-ink focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className={`block h-2 w-2 rounded-full transition-colors duration-300 ease-[var(--ease-rogo)] ${
                    i === current ? "bg-ink" : "bg-ink/25"
                  }`}
                />
              </button>
            );
          })}
        </div>
    </div>
  );
}
