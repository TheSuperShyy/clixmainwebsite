/**
 * ⚠️ THE `#roles` BAND WAS REMOVED FROM OUR PAGE ON 2026-08-12 (user: "remove this section
 * we dont need job offering for now"), so THIS CONFIG NO LONGER RUNS GREEN — its `ours`
 * expression will throw on a null `#roles`. It is kept, not deleted, because the `ref` half is
 * still a working description of the target's band and re-deriving it would mean re-probing a
 * live site. If the band comes back (restore from commit bbf10b1) this config comes back with
 * it, unchanged. Verified against the target at 1600/1440/1024/390 on 2026-08-12: ALL MATCH,
 * 38 keys per tier.
 *
 * Config for docs/reference/block-diff.js — verifies /careers' `#roles` band against
 * rogo.com/careers. Run it with the dev server up on 3001:
 *
 *   node docs/reference/block-diff.js docs/reference/careers-roles-diff.js
 *
 * Spec: features/careers-page/FEATURE.md ("Roles band — row anatomy").
 * Component: src/components/careers/CareersRoles.tsx · content: .../careersOpenings.ts.
 *
 * ─── ONE SHARED BODY, TWO PARAMETERS ─────────────────────────────────────────────────────
 * Both sides run the SAME measuring function, so they cannot drift into reading different
 * properties. Almost all of the tree is reached structurally (first/last visible child,
 * parentElement), which works identically on both. Only two things genuinely differ, and they
 * are the only arguments:
 *
 *   · `rowSel` — the target tags its rows `data-border="true"` (see the ::after note below);
 *     ours are `<li> > <a>`. There is no attribute both sides share, so this one is a
 *     selector on each side.
 *   · `colUp` — how many parentElement hops from a row up to the posts column. The target
 *     wraps every row in TWO inert divs (`Post`, then a Framer `-container`), so it is 3;
 *     ours collapses both into the `<li>`, so it is 2. If the harness ever reports a
 *     `postsCol` width equal to the row width, this number is what went stale — check it
 *     before anything else.
 *
 * Everything else that Framer nests and we do not is absorbed by `deep()`, which descends
 * past any chain of single-child wrappers. That is what lets `title`, `loc`, `idx`, `num`,
 * `lbl` and `h4` be read off the element that actually carries the type on BOTH sides: a
 * Framer `RichTextContainer` > `<p>` on the target, a bare `<span>` on ours.
 *
 * The eyebrow is reached from the one string both sides share — "open positions" — by
 * climbing to the first ancestor with two visible children (the [number, label] row). Its
 * parent is the eyebrow, and the eyebrow's first child is the 8x8 dot. Addressing it by
 * `data-framer-name="Indicator"` would have been a third asymmetry.
 *
 * ─── WHY `cont` IS NOT `groups.parentElement` ────────────────────────────────────────────
 * On OUR side the groups wrapper is a direct child of the Container. On the target it is FOUR
 * levels down: Container > ssr-variant > `-container` > the Tabs component root
 * (`.framer-1ld2hhj`, `data-framer-name="All"`) > groups. The Tabs root is the thing that
 * holds the 11 filter pills we do not ship, and dropping them is what flattens our tree.
 * So the Container is found by climbing until an ancestor carries a `max-width` — it is the
 * only element in the band that does (1280px) — and the head is then whichever child of the
 * Container the h2 sits under. Both walks are identical on the two sides.
 *
 * A consequence worth knowing before reading the output: the target's h2 and its first
 * divider are 40 + pillRowHeight + 32 apart (Container gap, then the Tabs root's own 32px
 * gap below the pills); ours are 40 apart, because there are no pills to gap against. That is
 * the pill row's absence, not a spacing bug, and it is why only `contGap` is compared.
 *
 * The Tabs root also explains `aspect-ratio: 1120` on the divider: 1120px is that component's
 * DESIGN width (`.framer-1ld2hhj { width: 1120px }`), overridden inline to `width:100%`. A
 * 1120x1 hairline drawn at the design width, encoded as a ratio, is 1.143px at the real 1280.
 *
 * ─── WHAT DIFFERS BY DESIGN AND IS THEREFORE NOT COMPARED ────────────────────────────────
 * The harness flags every key that differs, so a decision left in the key set reads as a
 * defect. Deliberately absent:
 *
 *   | not compared        | target            | ours                  | why                 |
 *   |---------------------|-------------------|-----------------------|---------------------|
 *   | band HEIGHT         | 77 roles          | 3 roles               | user's call, FEATURE|
 *   | row count           | 72 SSR posts      | 3                     | same                |
 *   | h4 text             | "Go to Market…"   | "Open Roles"          | one flat group      |
 *   | count text          | "77"              | "3"                   | `{ROLES.length}`    |
 *   | location text       | "New York City"   | "Tel Aviv-Yafo"       | invented roles      |
 *   | row height          | 72 / 90           | content-dependent     | see `rowChrome`     |
 *   | inner-group WIDTH   | —                 | —                     | location text width |
 *   | href / target attr  | ashbyhq, _blank   | mailto, none          | FEATURE deviations  |
 *   | any fontFamily      | ABC Arizona Mix   | Discovery             | licensing, 2026-08-08|
 *
 * Two of those are asserted INDIRECTLY instead, which is stronger than comparing them:
 *
 *   · `rowChrome` = row height − the tallest of its three children. It is 48 (= 24px padding
 *     top + bottom) on both sides at every tier no matter how the title wraps, so it survives
 *     the 3-vs-77 content difference AND it is the number the ::after trap moves: a real
 *     `border-bottom` makes it 49.
 *   · `rowsAllRuled` = every visible row's `::after` resolves to a 1px bottom border. True on
 *     both sides, which is how "the last row keeps its rule" is checked on the TARGET rather
 *     than assumed from a screenshot. (Cross-checked in the capture: 72 `Post` nodes, 72
 *     `--border-style:dashed` declarations, and no `:last-child` rule in 149 KB of CSS.)
 *
 * ─── THE ::after TRAP, WHICH IS THE POINT OF THIS CONFIG ─────────────────────────────────
 * The target's row `<a>` carries `--border-bottom-width:1px; --border-style:dashed;
 * --border-color:rgba(168,162,158,0.2)` and computes `border-bottom: 0px none`. The rule is
 * painted by `[data-border=true]:after`. `rowBorderW` reads the ELEMENT's own bottom border
 * width (must be `0px` on both) and `after` reads the pseudo-element's (must be `1px` /
 * `dashed` / `rgba(168, 162, 158, 0.2)` on both). Ours reproduces it as a genuine `::after`
 * precisely so that one expression can read both sides — see the header of CareersRoles.tsx.
 * The border STYLE at zero width is not compared: Framer leaves `none`, Tailwind's preflight
 * leaves `solid`, and neither paints. `rowChrome` is the key that would actually catch a
 * regression here — it goes 48 → 49 the moment the overlay becomes a real border.
 *
 * Rule 1 from block-diff.js is enforced in exactly one place, `vis()`, and every query and
 * child walk goes through it. Framer ships one DOM subtree per breakpoint tier and hides the
 * others with `display:none`; measure without the filter and you get plausible, wrong numbers.
 */

const BODY = `(sec, rowSel, colUp) => {
  const vis = (e) => e.getBoundingClientRect().width > 0;   // rule 1 — see block-diff.js
  const kids = (e) => [...e.children].filter(vis);
  /* Descend past any chain of single-child wrappers: Framer's RichTextContainer / -container
     divs on the target, nothing at all on ours. Lands on the element carrying the type. */
  const deep = (e) => { let n = e, k = kids(n); while (k.length === 1) { n = k[0]; k = kids(n); } return n; };
  const up = (e, n) => { let x = e; while (n-- > 0) x = x.parentElement; return x; };
  const R = (e) => e.getBoundingClientRect();
  const S = (e, p) => getComputedStyle(e, p || null);
  const w = (e) => Math.round(R(e).width);
  const type = (e) => { const s = S(e); return [s.fontSize, s.lineHeight, s.letterSpacing, s.color]; };

  const secS = S(sec);

  /* ---- eyebrow: entered through the one string both sides share ------------------------ */
  const lbl = [...sec.querySelectorAll('*')].filter(
    (e) => vis(e) && kids(e).length === 0 && e.textContent.trim() === 'open positions')[0];
  let count = lbl.parentElement;
  while (kids(count).length < 2) count = count.parentElement;   // the [number, label] row
  const eyebrow = count.parentElement;
  const dot = kids(eyebrow)[0];
  const num = deep(kids(count)[0]);
  const h2 = [...sec.querySelectorAll('h2')].filter(vis)[0];

  /* ---- rows, then the whole column tree walked back UP from the first one -------------- */
  const rows = [...sec.querySelectorAll(rowSel)].filter(vis);
  const row = rows[0], rowS = S(row), after = S(row, '::after');
  const postsCol = up(row, colUp);
  const rowWrap = postsCol.parentElement;
  const h4col = kids(rowWrap)[0], h4 = deep(h4col);
  const group = rowWrap.parentElement, divider = kids(group)[0];
  const groups = group.parentElement;
  /* NOT groups.parentElement — see the Container note in the header. Climb to the one element
     that carries a max-width, which is the Container on both sides. */
  let cont = groups.parentElement;
  while (cont !== sec && S(cont).maxWidth === 'none') cont = cont.parentElement;
  /* And the head is whichever child of the Container the h2 sits under. */
  let head = h2; while (head.parentElement !== cont) head = head.parentElement;

  /* ─── THE ROW IS ADDRESSED BY ROLE, NOT BY POSITION, AND THAT IS LOAD-BEARING ───────────
     The two sides have genuinely DIFFERENT row trees that render identically:

       capture / ours   <a> [ inner[icon, title], location, index ]     3 children
       target hydrated  <a> [ one div [icon, title, location, index] ]  1 child, then 4

     Both produce the same picture — 16px between every pair — because the nesting only moves
     which element's "gap" supplies which space. But any positional walk ("rk[1]", "rk[2]",
     "kids(inner)[1]") reads one shape and throws on the other, which is exactly how this
     harness failed twice before landing here.

     So: find the four items by what they ARE. The three text leaves in document order are
     title / location / index; the icon is the 24x24 graphic. Then measure the gaps as RENDERED
     PIXEL DISTANCES rather than reading a declared "gap" off whichever element happens to own
     it. That is both shape-independent and a better test — it checks the outcome instead of
     the declaration, and it cannot be fooled by the nesting moving one level.

     This is the fourth SSR-vs-hydrated divergence found on this page, after the CTA's
     framer-v-* variant, the ::after border, and the row's extra wrapper. Treat any structural
     assumption taken from this capture as a hypothesis. */
  const rowRoot = deep(row);
  const leaves = [...rowRoot.querySelectorAll('*')].filter(
    (e) => vis(e) && e.children.length === 0 && e.textContent.trim(),
  );
  const title = leaves[0], loc = leaves[1], idx = leaves[2];
  const icon = [...rowRoot.querySelectorAll('*')].filter(vis).find(
    (e) => Math.round(R(e).width) === 24 && Math.round(R(e).height) === 24,
  );

  /* Rendered gaps: icon->title, title->location, location->index. All three are 16 on both
     sides. Reading S(inner).gap instead would ask two different elements on the two trees. */
  const gapPx = (a, b) => Math.round(R(b).left - R(a).right);

  /* Row height minus its tallest ITEM (not its tallest child — the child differs by tree).
     48 = 24px padding top + bottom, on both sides at every tier regardless of how the title
     wraps, and 49 the moment the dashed rule becomes a real border. See the header. */
  const chrome = Math.round(
    R(row).height - Math.max(...[icon, title, loc, idx].map((e) => R(e).height)),
  );

  return JSON.stringify({
    bandW: w(sec),
    bandPad: secS.padding,
    bandGap: secS.gap,
    bandBg: secS.backgroundColor,
    bandOverflow: secS.overflow,

    contMaxW: S(cont).maxWidth,
    contGap: S(cont).gap,
    headGap: S(head).gap,

    eyebrowGap: S(eyebrow).gap,
    countGap: S(count).gap,
    dot: [w(dot), Math.round(R(dot).height), S(dot).borderRadius, S(dot).backgroundColor],
    num: [...type(num), S(num).whiteSpace],
    lbl: type(lbl),
    lblTxt: lbl.textContent.trim(),

    h2: type(h2),

    groupsGap: S(groups).gap,
    groupGap: S(group).gap,
    /* aspect-ratio 1120, height auto — 1.143px at 1280 wide, 0.843 at 944. Three decimals
       because rounding to an integer would hide the whole point. */
    divider: [w(divider), Math.round(R(divider).height * 1000) / 1000,
              S(divider).aspectRatio, S(divider).backgroundColor],

    rowWrapGap: S(rowWrap).gap,
    rowWrapWrap: S(rowWrap).flexWrap,
    h4colW: w(h4col),
    h4: type(h4),
    postsCol: [w(postsCol), S(postsCol).gap],

    rowPad: rowS.padding,
    gapIconTitle: gapPx(icon, title),
    gapTitleLoc: gapPx(title, loc),
    gapLocIdx: gapPx(loc, idx),
    rowOverflow: rowS.overflow,
    rowDecoration: rowS.textDecorationLine,
    rowChrome: chrome,
    /* THE TRAP, both halves. The element's own bottom border must be 0 — that is the whole
       claim — and the pseudo-element must carry the rule.
       WIDTH ONLY, deliberately: at zero width Framer leaves border-bottom-style "none" and
       Tailwind's preflight leaves "solid". Both paint nothing and neither can move the row,
       so comparing the style would flag a non-difference. Measured, not assumed.
       (No backticks in here: this comment lives inside the BODY template literal.) */
    rowBorderW: rowS.borderBottomWidth,
    after: [after.borderBottomWidth, after.borderBottomStyle, after.borderBottomColor,
            after.position, after.pointerEvents],
    rowsAllRuled: rows.every((r) => S(r, '::after').borderBottomWidth === '1px'),

    icon: [w(icon), Math.round(R(icon).height)],
    title: type(title),
    loc: [...type(loc), S(loc).textAlign, S(loc).whiteSpace],
    idx: [...type(idx), S(idx).whiteSpace],
    idxTxt: idx.textContent.trim(),
  });
}`;

/* `#roles` is the id on both sides — the target's own, kept verbatim (unlike `id="about™"`,
   which we do not ship). Still filtered on width > 0, per rule 1. */
const SECTION = `[...document.querySelectorAll('#roles')].filter((e) => e.getBoundingClientRect().width > 0)[0]`;

module.exports = {
  refUrl: "https://rogo.com/careers",
  ourUrl: "http://localhost:3001/careers",
  widths: [1600, 1440, 1024, 390],
  reduceMotion: true,
  settleMs: 6000,
  ref: `(${BODY})(${SECTION}, 'a[data-border]', 3)`,
  ours: `(${BODY})(${SECTION}, 'li a', 2)`,
};
