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
 * | `Top` height   | 316.8            | 348.8            | 372.8            |
 *
 * The three `Top` heights reconcile exactly, which is the check that the empty slot below is
 * real rather than a probe artefact:
 *   ≥1200   192 + max(20 + 8 + 96.8, 46.8 + 24 + 36)   = 192 + 124.8 = 316.8 ✓
 *   tablet  128 + (20 + 8 + 88) + 24 + (20.8 + 24 + 36) = 128 + 220.8 = 348.8 ✓
 *   phone   128 + (20 + 8 + 70.4) + 24 + (62.4 + 24 + 36) = 128 + 244.8 = 372.8 ✓
 *
 * ⚠️ THE EMPTY 20px EYEBROW SLOT IS REAL AND STAYS. The capture has `.framer-bzskua`
 * (`min-height:20px`) above the h3, wrapped in `.framer-ye5kjr`, and it renders nothing at
 * all — no text, no icon, no rule. It is the eyebrow slot of the shared Framer component,
 * left unfilled on this band. Deleting it looks like tidying dead markup, but it takes 28px
 * (the 20 plus the 8px `Title` gap) out of every one of the three heights above and unsettles
 * the whole band. `ye5kjr`'s own `gap:20px` is inert — it has exactly one child — so the two
 * nested divs collapse into the single one below with no layout difference.
 *
 * ⚠️ `/careers` MAY NOT EXIST YET. It is being built concurrently by a separate session in
 * this same working tree (see the warning at the top of CONTEXT.md). The CTA points at
 * `/careers` regardless. If it 404s, that is the integration point, not a bug in this file —
 * and per the house rule recorded at Nav.tsx:79-84, repointing an unresolved slug at some
 * other destination would be "a wrong destination dressed up as a working link", which is
 * worse than a 404. Leave it.
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

/* Fitted by rendered line count during prep, not by character count. Both h3 lines fit on one
   line at every tier and the paragraph reproduces the target's measured box heights
   (46.8 / 20.8 / 62.4) exactly. /product's regression was a 62-character string against the
   capture's 63 — well inside the 10% rule, and it still wrapped to three lines where the
   capture takes two and pushed 645 elements down the page. Character count does not decide
   wrapping. Do not re-word these without re-measuring. */
const TITLE_LINE_1 = "Join The Team Building";
const TITLE_LINE_2 = "What Comes Next";

const BODY =
  "We are looking for engineers who want to ship systems real businesses depend on. " +
  "If that is you, come talk to us.";

export default function CompanyCareers() {
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
              {TITLE_LINE_1}
              <br />
              <span className="text-muted">{TITLE_LINE_2}</span>
            </h2>
          </div>

          {/* The paragraph-and-CTA column — gap 24, left-aligned, `flex:1 0 0` from 1200 up.
              `items-start` is measured and load-bearing: the CTA's width is intrinsic, so
              without it the button would stretch to the column. */}
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
              {BODY}
            </p>

            {/* The CTA. Measured `124 × 36` — the 40px the outer frame suggests is the Framer
                container, not the button. Height is pinned with `h-9` so it lands on 36
                exactly; `py-2` around the 20px label row would give the same 36 on its own,
                and both are written because both are measured.

                WIDTH IS `min-w`, NOT `w`. The capture's rule is literally `width: min-content`
                and 124 is what min-content produced in rogo's Inter Medium; "See Careers" in
                Discovery measures 113.13, so the rule alone lands 11px short of the reference
                box. A hard `w-[124px]` would close that but is the wrong instrument on a
                button that is `overflow:hidden` — any future label wider than 124 would be
                silently clipped rather than show the mismatch. `min-w-[124px]` hits the
                measured 124 today (the label has 5.4px of slack each side) and grows instead
                of clipping if the label or the face ever changes.

                NO `border`. Framer paints this button's 1px `rgba(168,162,158,0)` edge with
                `[data-border]::after`, so it costs no layout space and, being fully
                transparent, paints nothing. A real border here would render the box 38 tall.
                Same reading as the grid rules in CompanyServices.tsx.

                An inert `width:auto; height:auto` Framer wrapper between the column and this
                <a> is dropped rather than copied. */}
            <a
              href="/careers"
              className="flex h-9 w-fit min-w-[124px] shrink-0 cursor-pointer items-center justify-center
                         gap-2 overflow-hidden rounded-[6px] bg-ink px-4 py-2 no-underline
                         transition-opacity duration-300 hover:opacity-90 active:opacity-80
                         focus-visible:ring-2 focus-visible:ring-ink
                         focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                         focus-visible:outline-none"
              /* `active:opacity-80` is the one state neither Footer.tsx nor ProductHero.tsx
                 declares. It is the same property and the same easing as the hover they do
                 declare, one stop further along, rather than a new mechanism. */
              style={{ transitionTimingFunction: "var(--ease-rogo)" }}
            >
              {/* The site's fixed button-label anatomy: a 20px row with a 1px optical top
                  nudge. `whitespace-pre` is required — the <a> is width:min-content. */}
              <span className="flex h-5 items-center justify-center gap-[10px] pt-px">
                <span
                  className="font-sans text-[16px] font-medium whitespace-pre text-paper"
                  style={{ lineHeight: "100%", letterSpacing: "-0.01em" }}
                >
                  See Careers
                </span>
              </span>
            </a>
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
          alt="Three colleagues working in an office, two seated at a wide monitor showing code while a third writes on a wall mounted display."
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
