"use client";

/**
 * ViewTransitions — drives a real crossfade between routes.
 *
 * WHY THIS REPLACED THE FADE (2026-08-12). The first attempt was an opacity keyframe on
 * `template.tsx`: the incoming page animated `opacity: 0 -> 1`. **That is a white flash by
 * construction, and the user saw it immediately.** At `opacity: 0` there is no previous page
 * left to see — App Router has already unmounted it — so what shows through is `body`'s own
 * `--color-paper`. The page did not fade *from the last page*, it faded *up from white*. It
 * was worse than no animation at all, which at least swapped instantly.
 *
 * A fade cannot fix this. Nothing rendered by React can, because the thing that has to stay
 * on screen — the outgoing page — no longer exists in the tree by the time the new one paints.
 * The old frame has to be held by something outside React. That is exactly what the View
 * Transitions API does: the browser snapshots the current document, lets the DOM change, then
 * crossfades snapshot to live. Both frames are on screen at once, so no background is ever
 * exposed and there is no flash.
 *
 * ⚠️ WHY NOT `experimental.viewTransition`. Next 16.2.12 does carry the flag, but it routes
 * through React's `ViewTransition` component, and React 19.2.4 stable does not export one —
 * it ships on the experimental channel. Rather than move the app to a React canary for this,
 * this calls `document.startViewTransition` directly. The browser API is stable and typed in
 * the DOM lib already; only React's binding to it is not.
 *
 * THE AWKWARD PART, and why the promise dance below exists. `startViewTransition(cb)` snapshots,
 * runs `cb`, and crossfades once the DOM has updated — it assumes `cb` updates the DOM
 * synchronously. `router.push()` does not; it kicks off an async render. So `cb` returns a
 * promise that is resolved by a `usePathname()` effect once the new route has actually
 * committed. Resolving early would end the snapshot before the new page paints and reintroduce
 * the flash this whole file exists to remove.
 *
 * SAFETY VALVE: if the navigation never commits (a failed route, an aborted push), the promise
 * would never resolve and the browser would sit on a frozen snapshot until its own ~4s timeout.
 * The 1500ms fallback resolves it first. It is deliberately far longer than the 300ms
 * animation, so it can only ever fire on a genuine failure, never on a slow-but-working nav.
 *
 * FALLBACK: browsers without the API, and anyone on `prefers-reduced-motion: reduce`, get a
 * plain `router.push`. That is an instant swap with no flash — the correct degradation, since
 * the flash was the bug and the crossfade is the enhancement.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type NavigateFn = (href: string) => void;

const ViewTransitionContext = createContext<NavigateFn | null>(null);

/* Long enough that it can only fire on a broken navigation, never on a working one. */
const COMMIT_TIMEOUT_MS = 1500;

export function ViewTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  /* The resolver for the in-flight transition, if any. A ref rather than state on purpose:
     writing it must not itself trigger a render, or the effect below would race the push. */
  const pendingCommit = useRef<(() => void) | null>(null);

  /* Fires on every committed pathname change, including the initial mount — hence the null
     guard, which is what makes "no transition in flight" the safe default. */
  useEffect(() => {
    if (pendingCommit.current) {
      pendingCommit.current();
      pendingCommit.current = null;
    }
  }, [pathname]);

  const navigate = useCallback<NavigateFn>(
    (href) => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced || !document.startViewTransition) {
        router.push(href);
        return;
      }

      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            pendingCommit.current = resolve;
            router.push(href);

            window.setTimeout(() => {
              /* Identity check, not a bare null check: a second navigation may have started
                 and installed its own resolver, and this timer must not end that one. */
              if (pendingCommit.current === resolve) {
                pendingCommit.current = null;
                resolve();
              }
            }, COMMIT_TIMEOUT_MS);
          }),
      );
    },
    [router],
  );

  return (
    <ViewTransitionContext.Provider value={navigate}>
      {children}
    </ViewTransitionContext.Provider>
  );
}

/* Null when a link renders outside the provider — AppLink treats that as "let the browser do
   it normally" rather than throwing, so a stray link can never break a page. */
export function useViewTransitionNavigate() {
  return useContext(ViewTransitionContext);
}
