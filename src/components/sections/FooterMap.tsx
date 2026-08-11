/**
 * Footer map — an embedded Google map of Tel Aviv-Yafo, rendered as the fifth item in the
 * footer's link row.
 *
 * NOT part of the rogo.ai clone. Added 2026-08-11 at the user's request, ported from
 * clix's own live site (clix-main-page.vercel.app), whose footer carries the same embed.
 * The deviation is recorded in features/footer/FEATURE.md.
 *
 * What was taken from the source and what was re-decided:
 *   - iframe URL, zoom (z=12) and the `output=embed` keyless form  → taken verbatim,
 *     except `hl=iw` → `hl=en`, since this build renders in English.
 *   - `border-white/10`                                            → kept, as `paper/10`:
 *     the same value expressed as a token.
 *   - `rounded-[18px]`                                             → NOT kept. This site's
 *     radius language is 6px (14 uses); 18px would be the only one of its kind.
 *   - `saturate(.85)`                                              → NOT kept, taken
 *     further. At .85 the map was the brightest object in the footer, out-ranking the
 *     headline and the CTA. Dimmed at rest, full colour on hover.
 *
 * The pin is the city, not a building: clix publishes no street address anywhere in
 * docs/reference/clixsolutions/ — only "תל אביב · שירות גלובלי" — so none is invented
 * here. z=12 frames the city, which is exactly what the source does.
 *
 * 2026-08-11, second pass: the first build paired this with an "Office" text column
 * (address, hours, an explicit Maps link) sitting under the link row. Dropped at the
 * user's direction — the map alone, up in the row, right-aligned. The embed ships its own
 * "Open in Maps" button, which is what now carries the click-through.
 */

/* Keyless embed: `output=embed` needs no Maps JS API key and no billing account. */
const MAP_EMBED =
  "https://maps.google.com/maps?q=Tel+Aviv-Yafo&hl=en&z=12&output=embed";

export default function FooterMap() {
  return (
    /* Width is tiered because this shares a row with four link columns and they have to
       keep their labels on one line. At 810 the container is only 730px, so 430 would
       crush them to ~59px each; 280 leaves ~96px, which clears the longest label
       ("Privacy Policy", ~95px at 14px). Desktop gets the source's full 430.

       `bg-ink-soft` is the reserved space — it paints while the lazy iframe is still
       unloaded, so the row never reflows when the map arrives. */
    <div
      className="group relative w-full flex-none self-stretch overflow-hidden
                 rounded-[6px] border border-paper/10 bg-ink-soft
                 focus-within:ring-2 focus-within:ring-paper focus-within:ring-offset-2
                 focus-within:ring-offset-ink
                 tablet:w-[280px] desktop:w-[430px]"
    >
      <iframe
        src={MAP_EMBED}
        title="Map showing clix’s location — Tel Aviv-Yafo, Israel"
        /* Below the fold at every tier, so it must not compete with the page load. */
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        /* Desaturated and dimmed at rest so it sits inside the dark footer instead of
           glaring out of it; full colour on hover as the "this is live" cue. */
        className="block h-[200px] w-full border-0
                   [filter:saturate(0.65)_brightness(0.82)_contrast(1.04)]
                   transition-[filter] duration-300
                   group-hover:[filter:saturate(1)_brightness(1)_contrast(1)]
                   motion-reduce:transition-none
                   tablet:h-full tablet:min-h-[200px]"
        style={{ transitionTimingFunction: "var(--ease-rogo)" }}
      />
    </div>
  );
}
