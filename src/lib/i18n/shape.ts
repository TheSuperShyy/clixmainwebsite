/**
 * `Translated<T>` — the type that makes a missing Hebrew string a build failure.
 *
 * English is authored `as const`, so its type is a tree of string LITERALS with readonly
 * tuples. This homomorphic mapped type widens every string leaf to `string` while PRESERVING
 * the key set and the tuple arity. Hebrew is then declared as `Translated<typeof en>`, which
 * gives three compile-time guarantees for twelve lines of code:
 *
 *   · a missing key            -> error, because the mapped type requires it
 *   · a key that is not in en  -> excess-property error
 *   · a tuple of the wrong LENGTH -> error
 *
 * That last one is why this is hand-rolled rather than `next-intl`, which checks keys but not
 * arity. Arity is load-bearing all over this repo: Nav's LINKS is "seven slots, deliberately —
 * the count is layout, not content", the footer has exactly four link columns, the compliance
 * grid has exactly five cells, and the careers gallery has exactly eight photos. A Hebrew
 * dictionary that supplied six nav labels would type-check under a key-only scheme and break
 * the layout at runtime.
 *
 * Non-string leaves (numbers, booleans, null) pass through unwidened, so a dictionary may
 * carry a tier flag or a count beside its strings without loosening the type.
 */
export type Translated<T> = T extends string
  ? string
  : T extends number | boolean | null | undefined
    ? T
    : { readonly [K in keyof T]: Translated<T[K]> };
