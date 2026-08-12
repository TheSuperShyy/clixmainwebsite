"use client";

/**
 * LocaleToggle — the English/Hebrew switch in the nav.
 *
 * IT IS A SINGLE LINK TO THE OTHER LANGUAGE, not a segmented `EN | עב` pair. Three reasons,
 * in descending order of how much they'd hurt to get wrong:
 *
 *  1. WIDTH, at the tier that has none to spare. At 1200px the content box is 1120px; the logo
 *     takes ~140, the seven centred links ~723, the CTA ~122. A segmented control is ~86px wide
 *     and would push the right group's left edge INSIDE the centred row's right edge. A single
 *     ~62px link clears it. (And the desktop link row is ABSOLUTELY centred — `left-1/2
 *     -translate-x-1/2`, Nav.tsx:598 — which its own comment says is deliberate "so it keeps the
 *     links optically centred regardless of how wide the button group gets". That is the
 *     non-obvious property that lets a control be added on the right without re-measuring the
 *     nav. Widening the right group does not move the links.)
 *  2. ACCESSIBILITY IS BETTER, not worse. The accessible name IS `עברית`, carried on a `lang="he"`
 *     element, so a screen reader switches voice and pronounces it correctly — WCAG technique
 *     G81, "identify the language of a link's destination", reinforced by `hrefLang`.
 *     ⚠️ DO NOT ADD AN ENGLISH `aria-label`. It would override the Hebrew text and destroy
 *     exactly that benefit. No `aria-current` either — no state is displayed.
 *  3. In a TWO-locale site the current state is already obvious from the page's own language. A
 *     segmented pair renders half an inert control to say what the page already says.
 *
 * IT IS A PLAIN `<a>` — no `onClick`, no `AppLink`, no view transition. That is a hard
 * requirement, not a simplification:
 *   · `/he/*` and `/*` sit under DIFFERENT root layouts, so Next does a full document load
 *     across that boundary by design. `startViewTransition` would snapshot, the document would
 *     be torn down, and the promise ViewTransitions.tsx creates would never be resolved by its
 *     `usePathname()` effect — so its 1500ms failsafe would fire on a WORKING navigation, when
 *     that file's own comment says it "can only ever fire on a genuine failure".
 *   · `<html dir>` flips. A crossfade between an LTR snapshot and an RTL live frame is a
 *     full-width horizontal jump of every line of text on the page.
 *   · A hard load rebuilds every GSAP timeline from zero, which is precisely what lets
 *     `useDirSign()` be treated as stable for a mount's lifetime with no `revert()` path.
 * No prefetch either, correctly: prefetching the other locale's whole page tree on hover is waste.
 *
 * ⚠️ NO DROPDOWN IS POSSIBLE HERE, so do not "improve" this into a popover menu. Four ancestors
 * are `overflow-hidden`: the `<header>` (Nav.tsx:408), the compact block (:444), the centred
 * `<nav>` (:599) and the desktop CTA wrapper (:650). A floating panel is clipped by all four.
 *
 * ⚠️ HEIGHT IS BUDGETED. `h-9` (36px) sits under the 40px hamburger in the compact row and the
 * 38px NavButton in the full row, so `--nav-row-h` (globals.css:233-238, a hand-derived
 * 74/70px that /clix's `spacer` reads) does not change. Anything taller shifts /clix.
 */

import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import {
  LOCALES,
  LOCALE_LABEL,
  HTML_LANG,
  switchLocalePath,
} from "@/lib/i18n/config";

export default function LocaleToggle({
  light,
  className = "",
}: {
  /** Exactly NavButton's semantics (Nav.tsx:157-174): `true` only over a light section. Over
      the hero AND over a dark section the content palette is the same. */
  light: boolean;
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  /* Two locales, so "the other one" is unambiguous. If a third is ever added this becomes a
     list and the segmented/dropdown question genuinely reopens. */
  const other = LOCALES.find((l) => l !== locale) ?? locale;

  return (
    <a
      href={switchLocalePath(pathname, other)}
      lang={HTML_LANG[other]}
      hrefLang={HTML_LANG[other]}
      className={[
        /* Same control anatomy as NavButton — radius 6, 8/16 padding, an h-5 inner row with the
           1px optical top nudge — but transparent, so it reads as a control rather than as a
           second CTA competing with "Let's start". */
        "flex h-9 w-min flex-none items-center justify-center rounded-[6px]",
        "border border-transparent bg-transparent px-3 py-2",
        "cursor-pointer whitespace-nowrap no-underline",
        "opacity-70 transition-[opacity,color] duration-300 hover:opacity-100",
        "focus-visible:ring-2 focus-visible:outline-none",
        /* No `ring-offset`, matching the link row (Nav.tsx:619) rather than NavButton — the
           offset exists there only because that button sits on a filled background. */
        light
          ? "text-ink focus-visible:ring-ink"
          : "text-paper focus-visible:ring-paper",
        className,
      ].join(" ")}
      style={{ transitionTimingFunction: "var(--ease-rogo)" }}
    >
      <span
        className="flex h-5 items-center justify-center pt-px font-sans text-[18px] font-medium"
        style={{ lineHeight: "1em", letterSpacing: "-0.01em" }}
      >
        {LOCALE_LABEL[other]}
      </span>
    </a>
  );
}
