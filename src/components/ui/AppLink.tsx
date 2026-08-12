"use client";

/**
 * AppLink — the one place that decides whether a link goes through Next's client router
 * or through the browser, and the one place that starts a view transition.
 *
 * WHY THIS EXISTS (2026-08-12). Every link in Nav and Footer was a raw `<a href>`. That is
 * not a styling detail: a raw anchor to an internal route makes the browser throw the
 * document away and start over — white flash, refetched CSS and fonts, scroll reset, and
 * Nav's scroll-theme scanner re-initialising from zero on every click. The app was a SPA
 * that never once navigated like one. Only the two logo links used `<Link>`, which is why
 * clicking the logo already felt different from clicking "Product".
 *
 * THE ROUTING RULE, and why it is drawn here rather than at each call site:
 *
 *   external === true   ->  <a target="_blank">   opens away from the site entirely
 *   href starts with /  ->  <Link>                a route this app owns; client-side
 *   anything else       ->  <a>                   #hash, mailto:, https:
 *
 * The third branch is the one worth stating out loud. `#contact` (bare hash) is a same-page
 * scroll — the browser does that natively without a reload, so routing it through `<Link>`
 * would buy nothing. `mailto:` is the trap: Footer's Email entry carries no `external` flag
 * (it does not want a new tab), so a naive `external ? a : Link` test would hand a mailto
 * to the router. Hence the test is on the href shape, not on the flag alone.
 *
 * Note `/#contact` — with a leading slash — is NOT the same case as `#contact`. From
 * /company it is a real cross-route navigation, so it correctly takes the `<Link>` branch.
 *
 * Prefetch is left at Next's default: on. It is what makes the crossfade a crossfade rather
 * than a hold on a stale snapshot — by the time the click lands, the next route is usually
 * already in memory, so it commits inside the animation's own 300ms.
 *
 * THE TRANSITION (2026-08-12, second pass). Internal navigations are handed to
 * ViewTransitions.tsx, which crossfades the outgoing frame into the incoming one. Read that
 * file for why a plain opacity fade could not work. Four cases are deliberately NOT
 * intercepted, and each would be a bug if it were:
 *
 *   · modified clicks (⌘/ctrl/shift/alt, middle button) — the user is asking for a new tab
 *     or window, and preventDefault would silently break that
 *   · a hash on the CURRENT route — that is a scroll, not a navigation; crossfading the
 *     document over a scroll would look broken and would fight `scroll-behavior`
 *   · anything a caller already called `preventDefault()` on
 *   · no provider in the tree — falls through to ordinary `<Link>` behaviour
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useViewTransitionNavigate } from "./ViewTransitions";

type AppLinkProps = {
  href: string;
  /* Opens in a new tab. Orthogonal to the internal/external routing decision above —
     see the mailto note. */
  external?: boolean;
} & Omit<React.ComponentPropsWithoutRef<"a">, "href">;

export default function AppLink({
  href,
  external,
  children,
  onClick,
  ...rest
}: AppLinkProps) {
  const navigate = useViewTransitionNavigate();
  const pathname = usePathname();

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  if (href.startsWith("/")) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);

      if (!navigate || e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      /* A hash pointing at the route we are already on is a scroll. `/#contact` from `/`
         must fall through to Link; the same href from `/company` is a real navigation. */
      const [path] = href.split("#");
      const target = path === "" ? "/" : path;
      if (href.includes("#") && target === pathname) return;

      e.preventDefault();
      navigate(href);
    };

    return (
      <Link href={href} onClick={handleClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
