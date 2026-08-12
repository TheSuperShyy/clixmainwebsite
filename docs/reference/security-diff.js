/**
 * security-diff — computed-value diff for the whole of `/security`, all three bands.
 *
 *   node docs/reference/block-diff.js docs/reference/security-diff.js
 *   node docs/reference/block-diff.js docs/reference/security-diff.js 1600 1440 1024 390
 *
 * Spec of record: `features/security-page/FEATURE.md`.
 * Components under test: `src/components/security/{SecurityHero,SecurityBenefits,
 * SecurityCompliance,SecurityCore}.tsx`.
 *
 * WHAT THIS CATCHES that a screenshot cannot. Three things on this page are invisible by eye
 * and wrong in numbers if you get them wrong:
 *   · the compliance cell rules are a DASHED OVERLAY with a ragged per-cell, per-tier width
 *     matrix. A real `border` renders identically at a glance and moves the 104px mark and the
 *     16px label by 1px — the exact fault `/product` Block 3 shipped.
 *   · the hero's height is `70vh`, not a content sum. 198 + 302 + 80 = 580, and the band is
 *     630. Anything that "fixes" that arithmetic is a defect that looks like a correction.
 *   · the CTA's corner brackets sit at dx -28 / dy -12 OUTSIDE a 220x40 frame. Off by six
 *     pixels and it still looks deliberate.
 *
 * ── THE THREE RULES FROM block-diff.js, AND HOW THIS FILE OBEYS THEM ─────────────────────────
 *  1. FILTER EVERY QUERY ON `getBoundingClientRect().width > 0`. Framer ships one DOM subtree
 *     per tier and hides the rest with `display:none`. This page has a live instance of it: the
 *     CTA is `Button (For Desktop)` at >=1200 and `Button (For Mobile)` below, and BOTH are in
 *     the DOM at every width, each with its own `<a>`. `vis()` below is applied to every query
 *     without exception.
 *  2. NEVER SLEEP EXACTLY ONE ANIMATION TICK. Moot by construction: the page has ZERO
 *     `data-framer-appear-id` and no transition outside the CTA's bracket hover, so its resting
 *     state is fully deterministic. `reduceMotion: true` is set anyway.
 *  3. `captureBeyondViewport` DOES NOT PAINT far-below-fold content. Not applicable; this
 *     harness measures, it does not screenshot.
 *
 * ⚠️ A FOURTH RULE, SPECIFIC TO THIS PAGE: THE VIEWPORT HEIGHT IS LOAD-BEARING.
 * `#first` is `height: 70vh`. block-diff.js pins `height: 900` in
 * `Emulation.setDeviceMetricsOverride`, so both sides resolve it to 630 — but change that 900
 * and `heroH` becomes meaningless on both sides at once, which compares equal and proves
 * nothing. If this key ever needs re-deriving, re-derive it from the emulated height.
 *
 * ── ONE SHARED BODY, AND ONLY ONE SELECTOR ASYMMETRY ────────────────────────────────────────
 * Both sides run the SAME `BODY`, so they cannot drift into measuring different properties.
 * `ctaSel` is the only finder passed in: the target's CTA frame is
 * `[data-framer-name^="Button (For"]` and ours is the `group` wrapper around the single `<a>`.
 *
 * Everything else is addressed identically on both sides, by structure rather than by class:
 *   · the three bands by the target's own ids, `#first` / `#features` / `#features-1`, which
 *     our components reproduce verbatim;
 *   · the compliance cells as "the grid's visible children wider than 100px", which excludes
 *     the two 21px corner marks on both sides without naming either;
 *   · the corner marks as "the SVGs inside row 1 that measure 21 wide", SORTED BY LEFT EDGE
 *     rather than by DOM order. ⚠️ That sort is not decoration: the target emits BR **before**
 *     TL in the document and we emit TL first, so an index-based read would compare TL against
 *     BR and report two symmetric-looking failures.
 *
 * Two per-side quirks are absorbed inside helpers rather than by branching:
 *   · `heading()` takes `h1,h2,h3` because row 1's heading is an `<h3>` on the target and an
 *     `<h2>` here — demoted so the page outline runs h1 → h2 with no skipped level, the same
 *     call `sections/Security.tsx` and `ProductSecurity.tsx` both make in-file. Rendered output
 *     is identical; only the tag differs, and the tag is not what this harness is checking.
 *   · `rule()` reads the cell's `::after` and falls back to its empty absolutely-positioned
 *     child. Framer paints the dashed rule on `[data-border]::after`; we paint it on an overlay
 *     `<span>` because an `::after` cannot carry per-cell, per-tier Tailwind variants. Same
 *     pixels, different carrier, and reading only `::after` would return 0px on OUR side and
 *     compare unequal for a reason that is not a defect.
 *
 * ── WHAT IS DELIBERATELY NOT COMPARED, AND WHY ───────────────────────────────────────────────
 * These keys are absent on purpose. Adding them back would produce mismatches that are RECORDED
 * DECISIONS, not defects, and a harness that cries wolf gets ignored.
 *
 *   · `#features-1` height, and the row-2 box. The "Explore security portal" link is dropped
 *     (user's call, 2026-08-12 — clix has no trust portal). It costs exactly 64px at every
 *     tier: 32 for the link plus the right column's 32 gap. Target 964.06 / 1435.17 / 2099.08;
 *     ours 900.06 / 1371.17 / 2035.08. Measured, in FEATURE.md, not chased.
 *   · every text box height, and the `#features` band height. All copy is clix's own, so
 *     rendered line counts are ours. `h1Box` / `subBox` / `bodyBox` would diff the sentence,
 *     not the layout.
 *   · text widths anywhere. Discovery is not ABC Arizona Mix and not Inter; a width diff here
 *     reports the 2026-08-08 font decision, which is settled.
 *   · the five cell LABEL widths ARE compared — 137/137/137/137/188 is a layout value the
 *     original authored — but their heights are not: our labels are sentences where the
 *     target's were acronyms, so some wrap to two lines. The box is anchored `bottom:16px`, so
 *     it grows upward and cannot reach the mark.
 *
 * Everything structural IS compared: paddings, gaps, grid templates, column and cell boxes,
 * font sizes, line heights, letter spacings, the border matrix, and both bracket offsets.
 */


const BODY = `
(({ ctaSel }) => {
  const vis  = (el) => el && el.getBoundingClientRect().width > 0;
  const V    = (sel, root) => [...(root || document).querySelectorAll(sel)].filter(vis);
  const one  = (sel, root) => V(sel, root)[0] || null;
  const kids = (el) => (el ? [...el.children].filter(vis) : []);
  const r    = (el) => el.getBoundingClientRect();

  const box = (el) => { if (!el) return null; const b = r(el);
    return [+b.width.toFixed(2), +b.height.toFixed(2)]; };

  /* Offset of \`el\` from \`ref\`, top-left to top-left. Used for both bracket pairs, which are
     positioned OUTSIDE their reference box: an absolute page coordinate would move with every
     band above them and prove nothing, while a delta is tier-independent. */
  const dTL = (el, ref) => { if (!el || !ref) return null; const a = r(el), b = r(ref);
    return [+(a.left - b.left).toFixed(2), +(a.top - b.top).toFixed(2)]; };
  const dBR = (el, ref) => { if (!el || !ref) return null; const a = r(el), b = r(ref);
    return [+(a.right - b.right).toFixed(2), +(a.bottom - b.bottom).toFixed(2)]; };

  const type = (el) => { if (!el) return null; const c = getComputedStyle(el);
    return [c.fontSize, c.lineHeight, c.letterSpacing, c.fontWeight, c.textAlign].join(" "); };

  /* rowGap + columnGap as LONGHANDS, never the \`gap\` shorthand: a computed \`gap\` serialises
     as "normal 16px" when only one axis is authored and "16px" when both are, so two elements
     that behave identically can print differently. The /careers diff learned this one. */
  const gap = (el) => { if (!el) return null; const c = getComputedStyle(el);
    return c.rowGap + "/" + c.columnGap; };
  const pad = (el) => (el ? getComputedStyle(el).padding : null);

  /* Row 1's heading is <h3> on the target and <h2> here (demoted so the outline runs h1 -> h2
     with no skipped level). Rendered output is identical; take whichever tag is present. */
  const heading = (root) => one("h1,h2,h3", root);

  /* THE DASHED RULE. The target paints it on \`[data-border]::after\`; we paint it on an
     absolutely-positioned empty <span>, because an ::after cannot carry per-cell, per-tier
     Tailwind variants. Read ::after first, fall back to the empty absolute child. Reading only
     ::after would return 0px on our side for a reason that is not a defect. */
  const rule = (el) => {
    if (!el) return null;
    const w = (c) => [c.borderTopWidth, c.borderRightWidth, c.borderBottomWidth, c.borderLeftWidth];
    let c = getComputedStyle(el, "::after");
    if (!w(c).some((v) => parseFloat(v) > 0)) {
      const ov = kids(el).find((k) => getComputedStyle(k).position === "absolute" && !k.textContent.trim());
      if (ov) c = getComputedStyle(ov);
    }
    return w(c).map((v) => (parseFloat(v) > 0 ? 1 : 0)).join("") + " " + c.borderTopStyle;
  };

  const out = {};

  /* ── #first ─────────────────────────────────────────────────────────────────────── */
  const hero  = document.getElementById("first");
  const textB = kids(hero)[0];
  const textC = kids(textB)[0];
  const cta   = one(ctaSel, hero);
  const a     = one("a", hero);
  const brs   = V("svg", cta);

  out.heroPad  = pad(hero);
  out.heroH    = box(hero)[1];             /* 70vh against the emulated 900 -> 630 */
  out.heroGap  = gap(hero);
  out.tbGap    = gap(textB);
  out.tbMaxW   = getComputedStyle(textB).maxWidth;
  out.tcGap    = gap(textC);
  out.tcMaxW   = getComputedStyle(textC).maxWidth;
  out.h1Type   = type(one("h1", hero));
  out.h1Wrap   = getComputedStyle(one("h1", hero)).textWrap;
  out.subType  = type(one("p", hero));
  out.ctaBox   = box(cta);                 /* 220 x 40 at every tier */
  out.aBox     = box(a);                   /* 220 x 36 — NOT 40; the pill is inset in the frame */
  out.aRadius  = getComputedStyle(a).borderRadius;
  out.aPad     = pad(a);
  out.brBox    = box(brs[0]);              /* 14 x 20 */
  out.brL      = dTL(brs[0], cta);         /* [-28, -12] at every tier */
  out.brR      = dBR(brs[1], cta);         /* [ 28,  12] — mirrored */

  /* ── #features ──────────────────────────────────────────────────────────────────── */
  const feat  = document.getElementById("features");
  const bgrid = V("*", feat).find((e) => getComputedStyle(e).display === "grid");
  const items = kids(bgrid);
  const it0   = items[0];
  const itPs  = V("p", it0);

  out.featPad   = pad(feat);
  out.featGap   = gap(feat);
  out.bgridCols = getComputedStyle(bgrid).gridTemplateColumns;
  out.bgridGap  = gap(bgrid);
  out.bgridMaxW = getComputedStyle(bgrid).maxWidth;
  out.bgridW    = box(bgrid)[0];           /* width only; height follows our own line counts */
  out.itemCount = items.length;            /* 6 */
  out.itemBox   = box(it0);                /* 400x185 / 452x182.39 / 358x150.39 */
  out.itemGap   = gap(it0);                /* 64 from 810 up, 32 at phone */
  out.itemPad   = pad(it0);                /* 0 0 16px */
  out.iconBox   = box(one("svg", it0));    /* 36 x 36 */
  out.itTCGap   = gap(kids(it0)[1]);       /* 4 */
  out.itTitle   = type(itPs[0]);
  out.itBody    = type(itPs[1]);

  /* ── #features-1, row 1 ─────────────────────────────────────────────────────────── */
  const comp  = document.getElementById("features-1");
  const row1  = kids(comp)[0];
  const row2  = kids(comp)[1];
  const cgrid = V("*", row1).find((e) => getComputedStyle(e).display === "grid");
  const cells = kids(cgrid).filter((e) => r(e).width > 100);
  const c0    = cells[0];
  const gfx   = kids(c0).find((k) => Math.round(r(k).width) === 104);
  const lbls  = cells.map((c) => kids(c).find((k) => k !== gfx && k.textContent.trim() &&
                                                     getComputedStyle(k).position === "absolute"));
  /* ⚠️ SEARCHED FROM row1, NOT FROM THE GRID — and that is a real structural difference, not a
     convenience. On the target the two marks are NOT inside the grid: they are children of the
     Logos flex row that wraps it, each in its own inert 21 x N box. Ours are children of the
     grid itself. Both containers are the same width and share a left edge, so the -5 / +5
     offsets measured against the grid hold on both sides; scoping the query to the grid simply
     found nothing on the target and printed null against a valid pair.
     SORTED BY LEFT EDGE, not DOM order — the target emits BR before TL. */
  const corns = V("svg", row1).filter((s) => Math.round(r(s).width) === 21)
                              .sort((x, y) => r(x).left - r(y).left);

  out.compPad   = pad(comp);
  out.compGap   = gap(comp);               /* 120 */
  out.row1Gap   = gap(row1);               /* 64 */
  out.row1MaxW  = getComputedStyle(row1).maxWidth;
  out.titleGap  = gap(kids(row1)[0]);      /* 16 */
  out.h3aType   = type(heading(row1));     /* 44/40/32, 110%, -0.05em, centre */
  out.logosGap  = gap(kids(row1)[1]);      /* 24 */
  out.cgridCols = getComputedStyle(cgrid).gridTemplateColumns;
  out.cgridGap  = gap(cgrid);              /* 0 */
  out.cgridFlex = getComputedStyle(cgrid).flex + " w:" + getComputedStyle(cgrid).width;
  out.cgridOv   = getComputedStyle(cgrid).overflow;   /* visible, or the brackets are clipped */
  out.cellCount = cells.length;            /* 5 */
  out.cellBox   = box(c0);                 /* 256x240 / 472x240 / 358x254.06 */
  out.cellAR    = getComputedStyle(c0).aspectRatio;
  /* THE MATRIX. top/right/bottom/left as 1s and 0s, one group per cell. Ragged below 1200 on
     purpose: at 390 cell 3 is "0101" — no top AND no bottom — while cell 4 is "1111". */
  out.rules     = cells.map(rule).join(" | ");
  out.gfxBox    = box(gfx);                /* 104 x 104 */
  out.lblW      = lbls.map((l) => (l ? Math.round(r(l).width) : null)).join(",");
  out.lblInset  = lbls[0] ? getComputedStyle(lbls[0]).bottom + " " + getComputedStyle(lbls[0]).left : null;
  out.lblType   = type(one("p", lbls[0]) || lbls[0]);
  out.cornBox   = box(corns[0]);           /* 21 x 33 */
  out.cornTL    = dTL(corns[0], cgrid);    /* [-5, -5] */
  out.cornBR    = dBR(corns[1], cgrid);    /* [ 5,  5] */

  /* ── #features-1, row 2 ─────────────────────────────────────────────────────────── */
  const left  = kids(row2)[0];
  const right = kids(row2)[1];
  const body  = one("p", right);

  out.row2Dir   = getComputedStyle(row2).flexDirection;   /* row >=810, column below */
  out.row2Gap   = gap(row2);                              /* 64 / 64 / 24 */
  out.row2Align = getComputedStyle(row2).alignItems;      /* flex-start */
  out.row2MaxW  = getComputedStyle(row2).maxWidth;
  out.leftFlex  = getComputedStyle(left).flex;            /* 1 0 0px, NOT 1 1 0% */
  out.leftMaxW  = getComputedStyle(left).maxWidth;        /* 450 / 280 / none */
  out.leftGap   = gap(left);                              /* 10, inert, one child */
  out.leftW     = box(left)[0];                           /* 450 / 280 / 358 */
  out.h3bType   = type(heading(row2));                    /* left-aligned, unlike row 1's */
  out.rightFlex = getComputedStyle(right).flex;
  out.rightGap  = gap(right);                             /* 32 */
  out.rightW    = box(right)[0];                          /* 766 / 600 / 358 */
  out.bodyType  = type(body);
  /* Two <br> inside ONE <p>. If someone "tidies" this into two <p>s the blank line becomes a
     margin and this count goes to 0 while the page still looks right at a glance. */
  out.bodyBrs   = body ? body.querySelectorAll("br").length : null;   /* 2 */

  return JSON.stringify(out);
})
`;

module.exports = {
  refUrl: "https://rogo.com/security",
  ourUrl: "http://localhost:3001/security",
  widths: [1600, 1440, 1024, 390],
  reduceMotion: true,
  settleMs: 6000,

  ref: `${BODY}({ ctaSel: '[data-framer-name^="Button (For"]' })`,
  ours: `${BODY}({ ctaSel: '.group' })`,
};
