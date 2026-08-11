# Target capture

Frozen copy of the target site. **This is the measurement source of record.**

| File | What it is |
|---|---|
| `rogo-home-2026-08-02.html` | Full served HTML of <https://rogo.ai/>, 652 KB |
| `rogo-home-2026-08-02.css` | The five inline `<style>` blocks, concatenated — 162 KB |
| `rogo-felix-2026-08-09.html` | Full served HTML of <https://rogo.com/felix>, 405 KB |
| `rogo-felix-2026-08-09.css` | The five inline `<style>` blocks, concatenated — 129 KB |
| `rogo-product-2026-08-11.html` | Full served HTML of <https://rogo.com/product>, 612 KB |
| `rogo-product-2026-08-11.css` | The five inline `<style>` blocks, concatenated — 180 KB |

**One host, not two.** `rogo.ai/product` 301s to `rogo.com/product` and serves a
byte-identical document (612,563 bytes, 129 `data-framer-name` values, both hosts checked
2026-08-11). The `.ai`/`.com` split in the filenames above is historical, not a real fork —
the home page was captured before the redirect was in place.

## Why this exists

rogo.ai is a **Framer** site: all CSS is inline and every text node carries its own custom
properties (`--framer-font-size`, `--framer-letter-spacing`, …). So exact values are
*extracted*, never estimated — which is the difference between a faithful clone and a
close-looking one.

Measure against **this capture**, not a live fetch. The live site can change under us; a
section measured on one day and built the next must come from the same source.

## How to measure a section

Find the section by its Framer name, then read the values out:

```bash
node -e "
const h=require('fs').readFileSync('docs/reference/target/rogo-home-2026-08-02.html','utf8');
const i=h.indexOf('data-framer-name=\"Hero\"');
console.log(h.slice(i, i+4000));
"
```

Framer ships a **separate DOM subtree per breakpoint tier**, so the same heading appears
three or four times with different values. Confirm which tier a match belongs to before
recording it — the wrapper's media query is what tells you.

## What this capture does *not* contain

- **Motion.** Framer animates in JS; the CSS holds a single `color .3s` transition.
  Timing, easing, stagger and scroll offsets must be observed on the live site.
- **Rendered geometry.** Computed box sizes after flex/grid resolution aren't in the HTML.
- **Fonts.** Referenced from `framerusercontent.com`; four of the six are commercial and
  are not vendored here. See the licensing blocker in [PROJECT.md](../../PROJECT.md).

Re-capture with a dated filename; never overwrite an existing one.
