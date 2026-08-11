/**
 * Example config for docs/reference/block-diff.js — this is the one that verified
 * /product Block 3 (`Data Partners`). Run it with the dev server up:
 *
 *   node docs/reference/block-diff.js docs/reference/block-diff.example.js
 *
 * The two sides share one measuring body and differ only in how they FIND things: the target
 * is addressed by `data-framer-name`, ours by heading text and tag. Keeping one body means the
 * two sides cannot drift into measuring different properties.
 *
 * The finder arguments are where the asymmetry lives, and it is worth understanding rather
 * than papering over:
 *   · `artIdx` — our tile carries its border as an overlay span (the target paints it with
 *     `[data-border] ::after`, which takes no layout space), so our graphic is child 1 where
 *     the target's is child 0.
 *   · `lblSel` — Framer wraps each label in one `ssr-variant` div per tier, so on the target
 *     the label must be reached by tag, not by child index. Ours is a plain span.
 */

const BODY = `(sec, itemSel, artIdx, lblSel) => {
  const vis = (e) => e.getBoundingClientRect().width > 0;   // rule 1 — see block-diff.js
  const b = sec.getBoundingClientRect(), s = getComputedStyle(sec);
  const grid = [...sec.querySelectorAll('div,ul')].find((e) => getComputedStyle(e).display === 'grid');
  const gs = getComputedStyle(grid);
  const items = [...sec.querySelectorAll(itemSel)].filter(vis);
  const t = items[0], tb = t.getBoundingClientRect(), ts = getComputedStyle(t);
  const gb = [...t.children].filter(vis)[artIdx].getBoundingClientRect();
  const lbl = [...t.querySelectorAll(lblSel)].filter(vis)[0];
  const ls = getComputedStyle(lbl), lb = lbl.getBoundingClientRect();
  const intro = [...sec.querySelectorAll('p')].filter(vis)[0], ps = getComputedStyle(intro);
  return JSON.stringify({
    blk: [Math.round(b.width), Math.round(b.height)],
    pad: s.padding, gap: s.gap,
    n: items.length,
    cols: gs.gridTemplateColumns, gridGap: gs.gap,
    tile: [Math.round(tb.width), Math.round(tb.height)],
    tilePad: ts.padding, tileGap: ts.gap,
    gfx: [Math.round(gb.width), Math.round(gb.height)],
    lblX: Math.round(lb.x - tb.x),
    lbl: [ls.fontSize, ls.lineHeight],
    intro: [ps.fontSize, ps.lineHeight, ps.letterSpacing],
  });
}`;

module.exports = {
  refUrl: "https://rogo.com/product",
  ourUrl: "http://localhost:3001/product",
  widths: [1440, 1024, 390],
  ref: `(${BODY})(
    [...document.querySelectorAll('[data-framer-name="Data Partners"]')]
      .filter((e) => e.getBoundingClientRect().width > 0)[0],
    '[data-framer-name="Data Partner"]',
    0,
    'p'
  )`,
  ours: `(${BODY})(
    [...document.querySelectorAll('h3')]
      .filter((e) => e.textContent.includes('Trusted Data') && e.getBoundingClientRect().width > 0)[0]
      .parentElement.parentElement,
    'li',
    1,
    'span:last-child'
  )`,
};
