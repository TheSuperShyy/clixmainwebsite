/**
 * careersPhotos — the eight slides of `/careers`'s `#gallery` carousel.
 *
 * Provenance (see `features/careers-page/FEATURE.md` → "Layout — carousel (`#gallery`)"):
 *
 * MEASURED, live over CDP at 1600 / 1440 / 1024 / 390 on 2026-08-12:
 *   · Every `slide` width below is the SLIDE BOX, read off the live `<li>`, and it is the SAME
 *     at all four tiers. The target's `sizes` attribute lists one width for all four tiers and
 *     the live sweep returned identical arrays. **These are not responsive. Do not derive them
 *     from a breakpoint and do not derive them from the image.**
 *   · `SLIDE_H` = 516 at every tier, every slide.
 *   · Sum check: 385+721+389+605+389+389+688+791 = 4357; +7×16 gap = 4469 = the measured
 *     `scrollWidth`. If you edit this table, that identity is the thing that must still hold.
 *   · Slide 8 (`pool`) is the only one with a non-default `object-position`: `right bottom`.
 *
 * DELIBERATE DIVERGENCE: the original's eight photographs are of rogo's identifiable staff.
 * Ours are eight neutral stock photos with no clear frontal face (user's call 2026-08-12) —
 * recorded in FEATURE.md's deviations table. Only ORIENTATION carries over from the original,
 * because every slide is a fixed box with `object-fit: cover`; the source's intrinsic aspect
 * ratio is not load-bearing and must not be used to size anything.
 *
 * TRAP: the `width`/`height` attributes the component puts on each `<img>` are `slide` ×
 * `SLIDE_H` — the BOX, not the file's intrinsic size. That is correct here: it gives the
 * browser the right layout aspect ratio to reserve, and `object-fit: cover` handles the rest.
 * Writing the file's true pixel dimensions there would reserve the wrong box before paint.
 *
 * ⚠️ THE `alt` TEXTS ARE NO LONGER IN THIS FILE (2026-08-12, i18n pass). They are copy, so they
 * live in the dictionary — `src/lib/i18n/{en,he}/careers.ts` → `gallery.alt` — keyed by the `id`
 * below rather than by position in this array. Everything that is NOT copy stays here, because
 * `src`, `slide` and `fit` are asset identity and measurement, not language.
 *
 * WHY KEYED BY ID AND NOT BY INDEX. The id binds a description to a PHOTOGRAPH. Reordering this
 * table, or dropping a slide, can therefore no longer silently re-pair the two — and adding a
 * ninth entry is a build error in the English dictionary until it has a description, which is
 * where that error belongs.
 *
 * ⚠️ `fit: "right bottom"` ON SLIDE 8 IS A PHYSICAL CROP ANCHOR AND IS DELIBERATELY NOT
 * MIRRORED FOR RTL. It is not a direction utility: it names where the subject sits inside that
 * one JPEG, the same reason the RTL pass leaves per-icon optical nudges physical. Flipping it to
 * `left bottom` on `/he/careers` would crop a different part of the same photograph, which is a
 * content change dressed as a layout fix. Left as measured; flagged to the user rather than
 * decided here, since it is the only physical value on the route that a reader might expect to
 * flip.
 */

/**
 * The stable identity of one photograph, and the key its `alt` text is stored under in the
 * dictionary's `gallery.alt`. Derived from the FILE NAME, never from the position in `PHOTOS` —
 * which is the whole point: these survive a reorder.
 */
export type CareersPhotoId =
  | "team01"
  | "team02"
  | "team03"
  | "team04"
  | "team05"
  | "team06"
  | "team07"
  | "team08";

export type CareersPhoto = {
  id: CareersPhotoId;
  src: string;
  /** MEASURED slide-box width in px. Fixed at every tier. Never derived from the image. */
  slide: number;
  /**
   * `object-position`. Omitted = the CSS initial `center`.
   * PHYSICAL ON PURPOSE — see the RTL note in this file's header.
   */
  fit?: string;
};

/** MEASURED: every slide box is 516px tall at 1600 / 1440 / 1024 / 390. */
export const SLIDE_H = 516;

export const PHOTOS: CareersPhoto[] = [
  { id: "team01", src: "/careers/team-01.jpg", slide: 385 },
  { id: "team02", src: "/careers/team-02.jpg", slide: 721 },
  { id: "team03", src: "/careers/team-03.jpg", slide: 389 },
  { id: "team04", src: "/careers/team-04.jpg", slide: 605 },
  { id: "team05", src: "/careers/team-05.jpg", slide: 389 },
  { id: "team06", src: "/careers/team-06.jpg", slide: 389 },
  { id: "team07", src: "/careers/team-07.jpg", slide: 688 },
  { id: "team08", src: "/careers/team-08.jpg", slide: 791, fit: "right bottom" },
];
