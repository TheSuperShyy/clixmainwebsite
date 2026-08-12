/**
 * careersOpenings — the content of /careers' `#roles` band, and nothing else.
 *
 * Spec: features/careers-page/FEATURE.md ("Documented deviations" → Job list, Row href,
 * Eyebrow count). Capture: docs/reference/target/rogo-careers-2026-08-12.{html,css}.
 *
 * ⚠️ THE FILE NAME IS NOT `careersRoles.ts`, DELIBERATELY. That was the name in the build
 * brief, and it does not work: it differs from `CareersRoles.tsx` only in the case of one
 * letter, so on Windows and macOS — case-INSENSITIVE filesystems — the import specifier
 * `@/components/careers/CareersRoles` resolves to this module instead of the component
 * (TypeScript tries `.ts` before `.tsx`). Caught by `tsc --noEmit`:
 *   TS1192: Module '…/careersRoles' has no default export
 *   TS1149: File name '…/CareersRoles.ts' differs from '…/careersRoles.ts' only in casing
 * The repo already had the right convention — `newsItems.ts` beside `NewsBoard.tsx`,
 * `careersPhotos.ts` beside `CareersGallery.tsx`: a data module is named for its CONTENT, not
 * for its component. Do not rename this back.
 *
 * ─── WHAT THE ORIGINAL HAS, AND WHY OURS IS SMALLER ──────────────────────────────────────
 * rogo.com/careers lists 77 real Ashby postings across 11 CMS categories, behind an 11-pill
 * filter row. The capture's SSR payload carries 72 of them as `data-framer-name="Post"` nodes.
 * The user's call on 2026-08-12 was to "reduce the job positions part": ONE flat group, THREE
 * roles, NO filter pills. The filter's measured values are preserved in FEATURE.md so the
 * decision is reversible without re-probing the target — do not re-derive them here.
 *
 * ⚠️ THESE THREE ROLES ARE INVENTED. They are clix-plausible titles, not carried over from
 * rogo's real postings and not (yet) openings clix has confirmed. That is one of the two
 * reasons /careers ships `robots: { index: false, follow: false }` — see the header of
 * src/app/careers/page.tsx. Do not remove the noindex guard while this list is invented.
 *
 * ⚠️ `href` IS A `mailto:`, DELIBERATELY. Every row on the target points at a real
 * `jobs.ashbyhq.com/Rogo/<uuid>` posting. Minting a lookalike ATS URL would be a fabrication
 * rather than a clone — it would resolve to nothing, or worse, to somebody else's board. A
 * mailto opens in place, which is also why the anchor carries NO `target="_blank"` (the
 * original's rows do) and therefore needs no `rel="noopener"`.
 *
 * ⚠️ NOTHING HERE MAY BE A LITERAL COUNT. The eyebrow renders `{ROLES.length}`; the original
 * hardcodes `77` beside a CMS-driven list, which is exactly the drift this avoids. If you add
 * a fourth role the eyebrow follows on its own. See CareersRoles.tsx.
 *
 * Row indices are NOT stored — they are derived positionally in the component as
 * `String(i + 1).padStart(2, "0")`, matching the original's own zero-padded `01`/`02`/`03`.
 * Storing them would be a second number that can disagree with the array.
 */

export type CareerRole = {
  /** Rendered as the row's link text. Wraps to two lines at 390 — that is expected. */
  title: string;
  /** Right-aligned, `white-space: pre`. One city per row on the target; ours is one city. */
  location: string;
  /** See the mailto note above. Same address for all three, on purpose. */
  href: string;
};

/**
 * The single group heading (the target's is a CMS category name, e.g. "Go to Market (GTM)").
 * With one group the `groups` wrapper's measured 64px gap is inert — see CareersRoles.tsx for
 * why it is kept anyway.
 */
export const ROLE_GROUP = "Open Roles";

/** The eyebrow's static half. The number beside it is `ROLES.length`, never a literal. */
export const COUNT_LABEL = "open positions";

/** Where a row's mailto lands. One constant so three rows cannot drift apart. */
const APPLY_HREF = "mailto:clixteam579@gmail.com";

export const ROLES: readonly CareerRole[] = [
  { title: "AI Automation Engineer", location: "Tel Aviv-Yafo", href: APPLY_HREF },
  { title: "Solutions Consultant", location: "Tel Aviv-Yafo", href: APPLY_HREF },
  { title: "Product Designer", location: "Tel Aviv-Yafo", href: APPLY_HREF },
];
