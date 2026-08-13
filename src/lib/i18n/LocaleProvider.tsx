"use client";

/**
 * The CLIENT seam. How a `"use client"` component learns its locale and its direction.
 *
 * WHY A CONTEXT AND NOT A DOM READ. The obvious shortcut is to sniff
 * `document.documentElement.dir`. It is wrong here, and the reason is worth stating because it
 * is invisible until it ships: a `useSyncExternalStore` over the DOM needs a SERVER snapshot,
 * and on the server there is no `document`. Whatever that snapshot returns is what the Hebrew
 * page renders on the server — so if it returns `"ltr"`, `/he/careers` server-renders a
 * left-pointing "next" arrow and visibly flips it on hydration. Direction that affects RENDER
 * OUTPUT must come from the same source that set `<html dir>`, which is the route.
 *
 * WHY THE PAYLOAD IS SPLIT. `chrome` is route-invariant and small (~40 strings). The page
 * namespaces are not: the whole dictionary is ~22 KB in English and ~30 KB in Hebrew (Hebrew is
 * ~1.8 bytes/char in UTF-8). Putting all of it in one context would add that to EVERY route's
 * RSC flight payload, when a route's client components only ever need `chrome` plus their own
 * page's slice. So the root layout provides `chrome`, and each route body provides exactly one
 * page namespace.
 *
 * ⚠️ A CLIENT COMPONENT MUST NEVER `import` A DICTIONARY MODULE. A static import from a client
 * component bundles BOTH locales into the client chunk. Use the hooks below. `import type` is
 * fine — types are erased.
 */

import { createContext, useContext } from "react";
import {
  DIRECTION,
  dirSign as dirSignFor,
  type Direction,
  type Locale,
} from "./config";
import type { ChromeDict, Dict, PageKey } from "./dictionary";

type LocaleValue = {
  locale: Locale;
  chrome: ChromeDict;
};

const LocaleContext = createContext<LocaleValue | null>(null);

/* Keyed by namespace so a route that mounts the wrong slice fails loudly rather than serving
   another page's strings. */
type PageValue = { name: PageKey; value: Dict[PageKey] };
const PageDictContext = createContext<PageValue | null>(null);

export function I18nProvider({
  locale,
  chrome,
  children,
}: {
  locale: Locale;
  chrome: ChromeDict;
  children: React.ReactNode;
}) {
  /* No `useMemo`: `locale` is a literal and `chrome` is a module constant, so the object is
     stable in practice and a memo would only add a hook. The provider mounts once per document
     — locale changes are hard navigations (see LocaleToggle). */
  return (
    <LocaleContext.Provider value={{ locale, chrome }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function PageDictProvider<K extends PageKey>({
  name,
  value,
  children,
}: {
  name: K;
  value: Dict[K];
  children: React.ReactNode;
}) {
  return (
    <PageDictContext.Provider value={{ name, value }}>
      {children}
    </PageDictContext.Provider>
  );
}

function useLocaleValue(): LocaleValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error(
      "i18n: a client component read the locale outside <I18nProvider>. The provider is " +
        "mounted in both root layouts (src/app/(en)/layout.tsx and src/app/he/layout.tsx); a " +
        "component that renders outside them cannot know its locale.",
    );
  }
  return value;
}

export function useLocale(): Locale {
  return useLocaleValue().locale;
}

export function useDirection(): Direction {
  return DIRECTION[useLocaleValue().locale];
}

/**
 * THE RTL PRIMITIVE. `+1` in en, `-1` in he.
 *
 * Multiply every horizontal `translateX` target, every `scrollBy({left})` delta, and the sign
 * of every drag-commit comparison by it. Never an index, a magnitude, a velocity, or a
 * threshold.
 *
 * IT IS STABLE FOR THE LIFETIME OF THE MOUNT, because switching locale is a hard navigation
 * across two different root layouts. That guarantee is load-bearing for the GSAP work: no
 * timeline ever has to survive a direction flip, so this may be read once, outside a
 * `useGSAP` dependency array, with no `revert()`/rebuild path.
 */
export function useDirSign(): 1 | -1 {
  return dirSignFor(useLocaleValue().locale);
}

export function useChrome(): ChromeDict {
  return useLocaleValue().chrome;
}

export function usePageDict<K extends PageKey>(name: K): Dict[K] {
  const entry = useContext(PageDictContext);
  if (!entry) {
    throw new Error(
      `i18n: usePageDict("${String(name)}") found no <PageDictProvider>. Each route body in ` +
        "src/app/_routes/ mounts exactly one.",
    );
  }
  if (entry.name !== name) {
    throw new Error(
      `i18n: usePageDict("${String(name)}") was called under the "${String(entry.name)}" ` +
        "namespace. A component is rendering on a route that does not own its strings.",
    );
  }
  return entry.value as Dict[K];
}
