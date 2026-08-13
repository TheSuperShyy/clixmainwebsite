/**
 * CompanyCareers — Block 5 of /company, the band Framer names `Reiteration`.
 *
 * THE BOX IS ROGO'S, THE CONTENT IS CLIX'S. Every geometry value below is measured from
 * rogo.com/company's `Reiteration` band (docs/reference/target/rogo-company-2026-08-12.html
 * + .css) and reproduced exactly. The headline, the paragraph and the CTA label are clix's.
 *
 * Spec: features/company-page/FEATURE.md ("Block 5 — Reiteration")
 * Memory: features/company-page/CONTEXT.md
 *
 * TIER MAP — measured at 1600/1440/1024/390. 1600 and 1440 are identical on this page, so
 * there is no `xl:` variant anywhere in the file.
 *
 * |                | ≥1200            | 810–1199         | ≤809             |
 * |----------------|------------------|------------------|------------------|
 * | `Top` padding  | `96px 40px`      | `64px 40px`      | `64px 16px`      |
 * | Container      | row, gap 64      | column, gap 24   | column, gap 24   |
 * | h3 box         | `490 × 96.8` 2ln | `944 × 88` 2ln   | `358 × 70.4` 2ln |
 * | p box          | `726 × 46.8` 2ln | `944 × 20.8` 1ln | `358 × 62.4` 3ln |
 * | image          | `1440 × 596`     | `1024 × 596`     | `390 × 300`      |
 * | `Top` height   | 316.8            | 288.8            | 312.8            |
 *
 * The heights reconcile exactly, which is the check that the empty slot below is real rather
 * than a probe artefact. The `+ 24 + 36` term each line USED to carry was the CTA's gap and
 * button; it went with the button on 2026-08-13, which is why two of the three shrank by 60
 * and the widest did not move at all:
 *   ≥1200   192 + max(20 + 8 + 96.8, 46.8)   = 192 + 124.8 = 316.8 ✓ (was 316.8 — see below)
 *   tablet  128 + (20 + 8 + 88) + 24 + 20.8  = 128 + 160.8 = 288.8 ✓ (was 348.8)
 *   phone   128 + (20 + 8 + 70.4) + 24 + 62.4 = 128 + 184.8 = 312.8 ✓ (was 372.8)
 *
 * ⚠️ THE EMPTY 20px EYEBROW SLOT IS REAL AND STAYS. The capture has `.framer-bzskua`
 * (`min-height:20px`) above the h3, wrapped in `.framer-ye5kjr`, and it renders nothing at
 * all — no text, no icon, no rule. It is the eyebrow slot of the shared Framer component,
 * left unfilled on this band. Deleting it looks like tidying dead markup, but it takes 28px
 * (the 20 plus the 8px `Title` gap) out of every one of the three heights above and unsettles
 * the whole band. `ye5kjr`'s own `gap:20px` is inert — it has exactly one child — so the two
 * nested divs collapse into the single one below with no layout difference.
 *
 * ⚠️ `/careers` NO LONGER EXISTS, AND THIS BAND HAS NO CTA. The route was built on
 * 2026-08-12 and deleted on 2026-08-13 at the user's call; the "See Careers" button that
 * pointed at it came out with it rather than being repointed. See the note where it used to
 * sit for the reasoning and for what that did to the heights below.
 *
 * ⚠️ SO THE NAME OF THIS FILE NOW OVERSTATES IT. `CompanyCareers` is Block 5 of /company and
 * it is still a recruiting band — headline, paragraph, photograph — but it is no longer the
 * entrance to a careers PAGE, because there isn't one. It was left named after its Framer
 * origin rather than renamed, since `Reiteration` is what the capture calls it and every
 * reference in FEATURE.md and CONTEXT.md uses the current name.
 *
 * ⚠️ THE PHOTOGRAPH IS STOCK, NOT CLIX'S TEAM. Supplied by the user on 2026-08-12, replacing
 * the Old Jaffa placeholder that shipped in 7cd0e05 (both stock sources had refused an
 * automated fetch, Pexels 403 and Unsplash 401, so per CLAUDE.md §7's two-candidate ceiling
 * the search stopped and the user was asked).
 *
 * It is the right SUBJECT now, people at work rather than a landmark, which the previous one
 * was not. But it is still not clix's team, and it sits under a heading about joining that
 * team. That is ordinary practice for a careers block and is a far weaker claim than a quote
 * put in a named person's mouth, which is what got three photographs deleted from /product.
 * It is recorded here rather than waved through because the gap it fills is real.
 *
 * Provenance is UNVERIFIED in this repo: the file arrived as `company bg.jpg` with no licence
 * recorded. Confirm the licence permits commercial use before this route is indexed.
 *
 * ⚠️ FEATURE.md's "The CTA" section says both of this page's CTAs carry /product's animated
 * corner brackets. That holds for the Hero's, not for this one: `.framer-kh28y4` in the
 * capture has exactly one child (`.framer-4x6ppo`, the 20px label row) and no bracket SVGs
 * anywhere inside it. Read off the markup rather than inherited from the sibling block, so
 * there are no brackets here.
 */

import { getDict } from "@/lib/i18n/server";

export default function CompanyCareers() {
  /* Every string here was fitted by rendered line count, not by character count. Both
     heading fragments sit on one line at every tier and the paragraph reproduces the
     target's measured box heights (46.8 / 20.8 / 62.4). /product's regression was a
     62-character string against the capture's 63 — well inside the 10% rule, and it
     still wrapped to three lines where the capture takes two and pushed 645 elements
     down the page. Re-measure before re-wording, in either locale. */
  const t = getDict().company.careers;

  return (
    /* `Reiteration` — column, gap 0, NO padding of its own, overflow hidden. The absent
       padding is what lets the photograph run edge to edge while `Top` keeps the gutter.

       The theme marker is `light`, which is right for `Top` (a `paper` ground) and is what the
       band-level spec calls for. The photograph inherits it. That WAS a defect while the dusk
       placeholder was in place — the nav painted dark glyphs over a dark image — and the
       2026-08-12 photograph fixed it by being bright: a white wall and a lit display under the
       bar. So it is now correct rather than merely specified.

       If a dark image is ever used here, marking it `dark` from inside this file will NOT
       work: Nav.tsx:322-330 walks `[data-nav-theme]` in document order and breaks on the first
       box spanning the bar, so this ancestor always shadows a nested marker. The fix would be
       splitting the band into two sibling sections. */
    <section
      id="reiteration"
      data-nav-theme="light"
      className="relative flex w-full flex-col items-center justify-center overflow-hidden"
    >
      {/* `Top` — `paper`, column, centred, gap 96, padding 96/40 → 64/40 → 64/16. The gap is
          inert here (one child) but it is the measured value, so it is written. */}
      <div
        className="flex w-full flex-col items-center justify-center gap-24 overflow-hidden
                   bg-paper px-4 py-16 tablet:px-10 desktop:py-24"
      >
        {/* `Container` — max-w 1280. ROW gap 64 from 1200 up, COLUMN gap 24 below.
            `items-end` is the measured cross-axis rule and it is load-bearing at ≥1200: the
            title column is 124.8 tall against the CTA column's 106.8, and flex-end is what
            sits the button on the headline's last line. Same device as Footer.tsx:146. It is
            unconditional because the capture keeps it at every tier — below 1200 both children
            are `w-full`, so it has nothing left to pull. */}
        <div
          className="mx-auto flex w-full max-w-[var(--container-max)] flex-col items-end
                     justify-center gap-6 desktop:flex-row desktop:gap-16"
        >
          {/* `Title` — gap 8. From 1200 up it is `flex:1 0 0` off a 1px basis, capped at 490;
              that cap is what hands the rest to the column beside it
              (1280 − 64 gap − 490 = 726, the paragraph's measured width). Below 1200 the cap
              lifts and it goes full width. */}
          <div className="flex w-full flex-col justify-center gap-2 desktop:w-px desktop:max-w-[490px] desktop:flex-[1_0_0]">
            {/* THE EMPTY EYEBROW SLOT. Renders nothing, occupies 20px. Read the file header
                before removing it. */}
            <div
              aria-hidden="true"
              className="flex min-h-5 w-full flex-row items-center gap-[10px]"
            />
            {/* The h3 preset shared by Mission, Team, Investors and Reiteration:
                44 / 40 / 32, weight 400, 110%, −0.05em. Byte-identical to /product's.

                ⚠️ ONE element with an inner <span>, never two sibling blocks. The break is
                HARD in the original — its captured text concatenates without a space
                ("Join a World-Class Team" + "Rethinking Finance") — so the line count is fixed
                by the markup and each line has to fit on its own. Two sibling blocks would let
                the halves wrap independently and break the sentence.
                Line 1 is `ink`; `muted` applies to the span only, exactly as in the capture. */}
            <h2
              className="w-full font-display text-[32px] font-normal text-ink tablet:text-[40px] desktop:text-[44px]"
              style={{ lineHeight: "110%", letterSpacing: "-0.05em" }}
            >
              {t.titleInk}
              <br />
              <span className="text-muted">{t.titleMuted}</span>
            </h2>
          </div>

          {/* The paragraph column — gap 24, left-aligned, `flex:1 0 0` from 1200 up. It was
              the paragraph-AND-CTA column until 2026-08-13; the gap is kept because it is the
              measured value and the column can hold a second child again without re-deriving
              it. `items-start` is measured; it was load-bearing for the CTA (whose width was
              intrinsic and would otherwise have stretched to the column) and is now inert on a
              `w-full` paragraph — kept for the same reason as the gap. */}
          <div className="flex w-full flex-col items-start justify-center gap-6 overflow-hidden desktop:w-px desktop:flex-[1_0_0]">
            {/* Body preset: 18px from 1200, 16 below; 130%, −0.02em. Unlike this page's other
                intros this one is `ink`, not `muted` — the capture sets
                `--framer-text-color: rgb(21,21,21)` on the element itself.
                `text-wrap: balance` is a TABLET-ONLY rule in the capture (the 810–1199.98
                block, nowhere else), hence the explicit reset above it. It is a no-op at that
                tier, where the line already fits on one line, but it is what the original
                declares. */}
            <p
              className="w-full font-sans text-[16px] font-normal text-ink
                         tablet:text-balance desktop:text-[18px] desktop:text-wrap"
              style={{ lineHeight: "130%", letterSpacing: "-0.02em" }}
            >
              {t.body}
            </p>

            {/* ⚠️ THE CTA WAS HERE AND IS GONE (2026-08-13, user: "also remove the whole
                careers route and page"). It read "See Careers" and pointed at `/careers`,
                which was this band's whole funnel and the LAST link into that route from
                anywhere on the site.

                It was REMOVED rather than REPOINTED, and that is this repo's own rule, not a
                shortcut: Nav.tsx:79-84 says an unresolved slug aimed at some other
                destination is "a wrong destination dressed up as a working link", which is
                worse than a 404. There is no page this button could honestly go to now — the
                paragraph already ends "come talk to us", and the nav CTA is the site's one
                real contact path.

                ⚠️ THE MEASURED HEIGHTS ABOVE MOVED, AND ONLY AT TWO TIERS. Losing the 36px
                button plus the column's 24px gap takes 60px out of this column:
                  · ≥1200  UNCHANGED at 316.8 — the row is `items-end` and the TITLE column
                           (124.8) was already the taller of the two, so the shorter column
                           beside it never set the height. 46.8 replaces 106.8; 124.8 still
                           wins.
                  · tablet 348.8 → 288.8
                  · phone  372.8 → 312.8
                `items-end` is therefore still load-bearing at ≥1200 and now sits the
                paragraph's last line on the headline's, which is the same device doing the
                same job with a shorter partner. If a CTA ever comes back here, restore it
                from git history — the measured `124 × 36` box, the `min-w` reasoning and the
                no-border reading are all in the version of this file before 2026-08-13. */}
          </div>
        </div>
      </div>

      {/* `image` — FULL BLEED. It is a sibling of `Top`, not a child, so it sees none of the
          gutter: 100% of the viewport at every tier. 596 tall from 810 up, 300 below. */}
      <div className="relative h-[300px] w-full shrink-0 tablet:h-[596px]">
        {/* Plain <img> with the same inline disable ProductStepper.tsx and Security.tsx use —
            a static asset already sized to its box gains nothing from next/image's loader.
            `object-position: 50% 50%` is the capture's value. The source is cropped to 2:1
            deliberately, not to the band's own ratio: the band is 2.69 at 1600 and 1.30 at 390,
            so 2:1 is the midpoint that survives `cover` at both ends. Cropping it to either
            extreme would gut the other. THE ASSET IS STOCK — see the file header. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/company/company-bg.jpg"
          alt={t.photoAlt}
          width={2400}
          height={1200}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 block h-full w-full object-cover object-center"
        />
      </div>
    </section>
  );
}
