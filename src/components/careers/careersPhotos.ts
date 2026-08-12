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
 */

export type CareersPhoto = {
  src: string;
  alt: string;
  /** MEASURED slide-box width in px. Fixed at every tier. Never derived from the image. */
  slide: number;
  /** `object-position`. Omitted = the CSS initial `center`. */
  fit?: string;
};

/** MEASURED: every slide box is 516px tall at 1600 / 1440 / 1024 / 390. */
export const SLIDE_H = 516;

export const PHOTOS: CareersPhoto[] = [
  { src: "/careers/team-01.jpg", alt: "A team member working at a desk.", slide: 385 },
  { src: "/careers/team-02.jpg", alt: "Team members playing a sport together.", slide: 721 },
  { src: "/careers/team-03.jpg", alt: "Hands typing on a laptop.", slide: 389 },
  { src: "/careers/team-04.jpg", alt: "An open-plan office.", slide: 605 },
  { src: "/careers/team-05.jpg", alt: "A small group at a whiteboard.", slide: 389 },
  { src: "/careers/team-06.jpg", alt: "A team member on a video call.", slide: 389 },
  { src: "/careers/team-07.jpg", alt: "A shared coffee break.", slide: 688 },
  { src: "/careers/team-08.jpg", alt: "A team social event outdoors.", slide: 791, fit: "right bottom" },
];
