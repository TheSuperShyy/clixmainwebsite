"use client";

/**
 * stepperPanels — the four animation panels inside /product's `Restart Point` stepper.
 *
 * ⚠️ PROVENANCE. These could NOT be measured from the capture or from a live probe: only the
 * ACTIVE step's panel is mounted, so a single page load shows one of four. The other three
 * were built blind on the first pass and were wrong. They are now rebuilt from four reference
 * screenshots the user supplied on 2026-08-11, one per step.
 *
 * They remain REBUILDS, not copies: the original's panels are `all_your_data_01.riv` and
 * three more Rive scenes of rogo's real product UI. Everything here is drawn from this site's
 * tokens, at the reference's proportions and content. No Rive runtime, no borrowed art.
 *
 * The panel box itself (510x280, `surface`, radius 1px, centred) lives in ProductStepper.
 */

import { useEffect, useState } from "react";
import { useDirection, usePageDict } from "@/lib/i18n/LocaleProvider";

/**
 * ⚠️ MIRRORING POLICY FOR THESE PANELS — the rule, and where it comes from.
 *
 * TRANSLATE the chrome, KEEP the machine tokens Latin, MIRROR the page but not the diagram.
 * That is not a principle picked off a shelf; it is what the user's own Hebrew site does
 * (docs/reference/clixsolutions/): its home dashboard mock is Hebrew chrome carrying Latin
 * tokens (`p50`, `842ms`, `+18%`), and its /playground — a genuinely RTL page — lays a node
 * graph out LEFT TO RIGHT, its own tip reading "גררו מהנקודה הימנית של צומת אחד לנקודה
 * השמאלית של צומת אחר", i.e. output right, input left.
 *
 * So here: row labels, status prose, buttons and the cited date translate. The record id
 * `4182`, the system abbreviation `CRM`, the quarter `Q2 2026` and the citation numeral do not.
 * The icon-before-label inset and the card's own edges DO mirror, because their direction
 * carries reading order.
 *
 * MECHANICALLY, mirroring is `insetInlineStart` in place of `left` and `start-*`/`end-*` in
 * place of `left-*`/`right-*`. Both resolve to the physical property in ltr, so the English
 * computed values are untouched. Nothing here needs `922 − x − w` arithmetic: CSS resolves a
 * logical inset against the actual containing block, which is exactly the mirror.
 */

/* ---- Icons. Simple 20/24px glyphs at the reference's weight; not rogo's marks. ---- */

function IconDocs() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <rect x="8" y="3" width="13" height="15" rx="2" />
      <path d="M16 21H5a2 2 0 0 1-2-2V7" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
    </svg>
  );
}
function IconTable() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 10v10" />
    </svg>
  );
}
function IconLink() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
}
function IconDeck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M12 16v4M8 20h8" />
    </svg>
  );
}
function IconFolder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
  );
}

/* ---- Panel 01 — "All your content in one place" -------------------------------------
 * ⚠️ THIS TOOK THREE ATTEMPTS. Recording all three, because the wrong ones were each plausible:
 *   1. A discrete swap of three fixed rows. Wrong — there IS movement.
 *   2. A continuous marquee with the focused card travelling with the strip. Also wrong — I
 *      read two reference frames as showing the card at different heights, but those were two
 *      differently-cropped screenshots, so the "evidence" was an artefact of the crop.
 *   3. Correct, from the user's close-ups: **the white card is STATIONARY** and the list of
 *      labels STEPS UP THROUGH IT, one row at a time, about once a second, each step animated.
 *      The label arriving in the middle slot becomes the card's; its icon animates on change.
 *
 * The lesson worth keeping: do not infer motion from two still frames at different crops.
 *
 * Structure: a 3-row viewport; a 4-row group that animates up exactly one row per tick (the
 * 4th row is what keeps the bottom slot filled for the whole move) carrying MUTED labels; and
 * a fixed card overlay on the middle slot. The middle label sits behind the opaque card.
 */

/* The seven sources a clix system actually reads from. Labels live in the dictionary
   (`panels.sources`); the ICONS ARE HERE and are POSITIONAL — each label was chosen for the
   glyph already in its slot (globe for inbound web forms, link for the connected CRM, table for
   spreadsheets, folder for the calendar and notes store), so the two arrays are zipped by index
   and the tuple typing holds both at seven.
   ⚠️ A longer label TRUNCATES rather than wrapping: the row is `truncate` against the 88px
   label inset below, and the tightest measure is the phone tier's 176px. Measured, English
   peaks at 169px and Hebrew at 128px, so neither clips. */
const SOURCE_ICONS = [
  IconDeck,
  IconGlobe,
  IconLink,
  IconDocs,
  IconTable,
  IconFolder,
  IconDocs,
] as const;

/* ⚠️ MUST MATCH the -62px travel in the `rows-up` keyframe in globals.css. Parameterising the
   keyframe with a custom property was tried and silently failed — see the note there.
   ⚠️ AND IT NEEDS NO RTL COUNTERPART. `rows-up` translates on Y only, and the vertical axis is
   direction-neutral, so unlike `clix-marquee` there is nothing to mirror. Value unchanged. */
const ROW_H = 62;
/* Card frame starts at `start-6` (24px) and pads 16px, so the 36px tile sits 40px in from the
   inline START and the label clears it at 40 + 36 + 12 = 88. Derived once here rather than as
   magic classes, because the tile is positioned absolutely and the label with padding — two
   different mechanisms that have to agree.
   NAMED `_INSET`, not `_LEFT`: they are consumed as `insetInlineStart` and
   `paddingInlineStart`, so under rtl they measure from the right. Both resolve to the physical
   left in ltr, so the English computed values are unchanged. */
const TILE_INSET = 40;
const LABEL_INSET = 88;
/* The user described the original as moving "every second", and 1000ms was built to that.
   Slowed to 1800ms on their call — "its moving fast" — so this is now OURS, not the target's.
   Logged as a deviation in FEATURE.md rather than left looking like a measurement. The slide
   itself was never observable and is estimated. */
const TICK_MS = 1800;
const SLIDE_MS = 500;

export function PanelSources({ animate }: { animate: boolean }) {
  const labels = usePageDict("product").panels.sources;
  const dir = useDirection();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => setStep((v) => v + 1), TICK_MS);
    return () => clearInterval(id);
  }, [animate]);

  const N = labels.length;
  const at = (o: number) => {
    const i = (((step + o) % N) + N) % N;
    return { label: labels[i], Icon: SOURCE_ICONS[i] };
  };
  const cur = at(0);
  const { Icon } = cur;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: ROW_H * 3 }}
      aria-hidden="true"
    >
      {/* ---- The STATIONARY card layer ------------------------------------------------
          Frame, chevron and icon TILE are all fixed. The tile in particular: it belongs to
          the card, not to the row, and it neither moves nor remounts. Having it inside the
          sliding row was the bug that made the whole card lurch on every change — which is
          what the "centre the text" request was really reacting to. Only the GLYPH swaps. */}
      <div
        className="absolute end-0 start-6 rounded-[4px] bg-paper shadow-[0_0_0_1px_var(--color-hairline)]"
        style={{ top: ROW_H, height: ROW_H }}
      />
      {/* The row marker, in the 24px gutter on the inline-START side of the card.
          ⚠️ RENDERED EXPLICITLY PER DIRECTION rather than left to Unicode. `Bidi_Mirrored=Y` on
          U+203A is a SUGGESTION to the renderer, not a guarantee, so diffing it would be
          diffing the font and the shaper. A chevron is a navigational affordance and does
          mirror, so the glyph is chosen here: › in ltr, ‹ in rtl. */}
      <span
        className="absolute start-0 z-[1] flex items-center font-sans text-[15px] leading-none text-ink"
        style={{ top: ROW_H, height: ROW_H }}
      >
        {dir === "rtl" ? "‹" : "›"}
      </span>
      {/* ⚠️ ALWAYS `brand-green`, on the user's call. The original tints the tile per source —
          its "Real-time Web" glyph sits on blue — but a single accent was asked for and it
          keeps the panel from reading as a colour-coded legend it is not. Deviation, logged. */}
      <span
        className="absolute z-[2] flex h-9 w-9 items-center justify-center rounded-[6px] bg-brand-green p-2 text-paper"
        style={{ top: ROW_H + (ROW_H - 36) / 2, insetInlineStart: TILE_INSET }}
      >
        {/* `key` on the glyph wrapper is what replays the swap; the tile around it persists. */}
        <span
          key={cur.label}
          className="block h-full w-full"
          style={animate ? { animation: `icon-swap ${SLIDE_MS}ms cubic-bezier(0.44, 0, 0.56, 1)` } : undefined}
        >
          <Icon />
        </span>
      </span>

      {/* ---- The sliding label strip -------------------------------------------------- */}
      <div
        key={step}
        className="relative z-[1] flex flex-col"
        style={
          animate
            ? { animation: `rows-up ${SLIDE_MS}ms cubic-bezier(0.44, 0, 0.56, 1) forwards` }
            : { transform: `translate3d(0, -${ROW_H}px, 0)` }
        }
      >
        {[at(-2), at(-1), at(0), at(1)].map((s, k) => {
          /* Index 2 lands in the middle slot, i.e. under the card frame. */
          const isActive = k === 2;
          return (
            <div
              key={`${s.label}-${k}`}
              /* ⚠️ EVERY row shares the SAME leading edge — muted and active alike. The muted
                 labels were first built centred, because in the reference the short ones look
                 balanced. Re-measuring the frames killed that: "Models & spreadsheets",
                 "Data rooms, meeting notes" and "Filings and earnings" all start at the same
                 x. Centring them is what made a label shift sideways as it entered the card,
                 so the move read as a jump instead of a lift. With one shared leading edge the
                 motion is purely vertical, which is the whole point of the effect.
                 `justify-start` is already logical — flex main-axis keywords follow
                 `direction` — and `paddingInlineStart` resolves to `padding-left` in ltr. */
              className="flex shrink-0 items-center justify-start"
              style={{ height: ROW_H, paddingInlineStart: LABEL_INSET }}
            >
              <span
                className={`truncate font-sans ${isActive ? "text-[16px] text-ink" : "text-[15px] text-mark"}`}
                style={{ letterSpacing: "-0.01em" }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Panel 02 — "Transparent, auditable sources" ------------------------------------
 * Reference: a paragraph of generated prose in which a figure is highlighted and carries a
 * numbered citation chip, with the cited source card floating over it — the point being that
 * every answer traces back to the record it came from.
 *
 * The scenario is deliberately generic: an order, an invoice, a CRM record. No real company
 * is named and no figure is presented as fact, because this is mock UI.
 */

export function PanelCitations() {
  const t = usePageDict("product").panels.citations;
  return (
    <div className="relative w-full">
      {/* ⚠️ THE PROSE HAS A MINIMUM LENGTH, NOT A MAXIMUM, and the reason is the card below it.
          The card is `absolute top-[24%]` of THIS paragraph's own height, so shortening the
          paragraph slides the card down over the very figure it cites. Five lines at the 470px
          desktop measure is the floor. Measured: English 5, Hebrew 5 — Hebrew's first draft set
          4 and buried the highlight, which is recorded in he/product.ts. Lengthen freely if it
          is ever reworded; do not trim. */}
      <p
        className="font-sans text-[15px] text-mark"
        style={{ lineHeight: "1.55em", letterSpacing: "-0.01em" }}
      >
        {t.prose}{" "}
        <span className="rounded-[2px] bg-brand-green/15 px-1 font-medium text-ink">{t.date}</span>
        {/* `ms-1`: the chip follows the date in reading order, so its gap is on the inline
            start. Resolves to `margin-left` in ltr. */}
        <span className="ms-1 inline-flex h-[18px] w-[18px] translate-y-[3px] items-center justify-center rounded-[3px] bg-brand-green text-[11px] font-medium text-paper">
          {t.marker}
        </span>
      </p>
      {/* The floating source card. Overlaps the middle of the prose, as in the reference.
          `start-[20%]` so it stays on the leading side of the measure in both directions; 20/56
          is not a symmetric pair, so this is a real migration rather than a no-op. */}
      <div className="absolute top-[24%] start-[20%] w-[56%] rounded-[4px] bg-paper p-3 shadow-[0_2px_10px_rgba(0,0,0,0.10),0_0_0_1px_var(--color-hairline)]">
        {/* Record id, system abbreviation and quarter label stay LATIN in every locale: they are
            machine tokens, and the real site's own dashboard mock keeps its equivalents (`p50`,
            `842ms`) Latin inside Hebrew chrome. */}
        <div className="mb-2 flex items-center gap-2">
          <span className="font-sans text-[13px] font-medium text-ink">{t.recordId}</span>
          <span className="rounded-[3px] bg-surface px-1.5 py-0.5 font-sans text-[11px] text-ink">{t.system}</span>
          <span className="font-sans text-[13px] text-mark">{t.period}</span>
        </div>
        {/* Skeleton rows — the reference greys the table out and shows only the cited cell. */}
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1.5">
            <span className="block h-2 flex-1 rounded-[2px] bg-surface" />
            <span className="block h-2 flex-1 rounded-[2px] bg-surface" />
            <span className="block h-2 flex-1 rounded-[2px] bg-surface" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="block h-2 flex-1 rounded-[2px] bg-surface" />
            {/* The cited cell. Same key as the highlight above, so the two cannot disagree. */}
            <span className="rounded-[2px] bg-brand-green/15 px-1.5 font-sans text-[11px] font-medium text-ink">
              {t.date}
            </span>
            <span className="block h-2 flex-1 rounded-[2px] bg-surface" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Panel 04 — "Proprietary document interrogation" --------------------------------
 * Reference: a prompt row with a send button over a drop zone, with a folder chip being
 * dragged into it.
 */

export function PanelDocuments() {
  const t = usePageDict("product").panels.documents;
  return (
    <div className="flex w-full flex-col gap-3">
      {/* `ps-3` against a flat `p-1.5`: the text sits on the leading side and the button on the
          trailing side, so the extra inset belongs to the inline start. */}
      <div className="flex items-center gap-2 rounded-[4px] bg-paper p-1.5 ps-3 shadow-[0_0_0_1px_var(--color-hairline)]">
        <span className="min-w-0 flex-1 truncate font-sans text-[14px] text-mark" style={{ letterSpacing: "-0.01em" }}>
          {t.prompt}
        </span>
        <span className="shrink-0 rounded-[4px] bg-brand-green/70 px-3 py-1.5 font-sans text-[13px] font-medium text-paper">
          {t.cta}
        </span>
      </div>
      <div className="relative flex h-[92px] items-center justify-center rounded-[4px] border border-brand-green/45">
        <span className="font-sans text-[14px] text-brand-green" style={{ letterSpacing: "-0.01em" }}>
          {t.dropzone}
        </span>
        {/* The dragged folder chip, sitting on the drop zone's lower edge as in the reference.
            `left-1/2` + `-translate-x-1/2` is a CENTRING IDIOM and stays physical: `start-1/2`
            under rtl resolves to `right:50%` while the translate still moves left, which lands
            the chip off-centre by its own width. */}
        <span className="absolute bottom-[-14px] left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-[4px] bg-paper px-3 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.12),0_0_0_1px_var(--color-hairline)]">
          <span className="h-4 w-4 shrink-0 text-[#1b64d8]">
            <IconFolder />
          </span>
          <span className="font-sans text-[14px] text-ink" style={{ letterSpacing: "-0.01em" }}>
            {t.chip}
          </span>
        </span>
      </div>
    </div>
  );
}
