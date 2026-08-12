/**
 * String interpolation, and the reason it is six lines rather than a dependency.
 *
 * The ENTIRE repo contains two interpolated user-facing strings:
 *
 *   sections/Testimonials.tsx   `Play ${clip.name}’s testimonial`
 *   careers/CareersGallery.tsx  `${index + 1} of ${PHOTOS.length}`
 *
 * Neither pluralises, neither selects on gender, neither formats a number or a date (there is
 * not one `Intl.*` call anywhere in `src/` — the only numeric formatting is a `toFixed` in
 * ModelTicker). So ICU message format would be a runtime dependency serving two strings, in a
 * five-dependency project whose CONTEXT.md records rejecting `experimental.viewTransition`
 * twice on stability grounds.
 *
 * If a third string ever needs real plural rules, `Intl.PluralRules` is in the platform and
 * this function is the place to grow.
 *
 * Unknown placeholders are left verbatim rather than replaced with "undefined" — a visible
 * `{name}` in the UI is a bug that reports itself, where the string "undefined" reads as
 * content.
 */
export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}
