/**
 * MockWindow — the shared chrome for the two mock app windows in the `/security` hero.
 *
 * ⚠️ NOT A CLONE OF ANYTHING. Like `SecurityTerminal` and `SecurityConsole`, this has no
 * counterpart on rogo.com/security. Extracted 2026-08-13 when the second window landed and the
 * title bar would otherwise have been written twice. Spec: features/security-page/FEATURE.md →
 * "Block 1b — Terminal + Console".
 *
 * Presentational and stateless — no `"use client"`, no hooks, no effects. It is imported BY
 * client components, which is why it needs no directive of its own: a module only becomes part
 * of the client bundle through its importer.
 *
 * ─── ⚠️ NO SHADOW, AND THAT IS A CHECKED DECISION RATHER THAN AN OVERSIGHT ───────────────
 * The reference implementation this was modelled against reaches for `shadow-2xl` to lift the
 * front window off the back one. **This site ships ZERO shadows** — grepping `shadow-` across
 * `src/components/` returns nothing, and `globals.css` mentions `box-shadow` only inside two
 * unrelated notes. A drop shadow here would be the first on the whole build and would need a
 * token, an elevation scale, and a decision about every other card on the site.
 * The overlap reads perfectly well without one: the front window is opaque `ink` and simply
 * OCCLUDES the back one, and the `hairline-light` border draws the seam. Occlusion is the
 * depth cue. Do not add a shadow to this file without adding it to `DESIGN-SYSTEM.md` first.
 *
 * ─── ⚠️ MONOCHROME TRAFFIC LIGHTS ───────────────────────────────────────────────────────
 * Every macOS-window mock in the wild paints these red / amber / green, and the reference spec
 * asks for exactly that. This site has no palette to spend on decoration: `--color-forest`
 * belongs to /clix and `--color-price-low/high` are semantic-only and may never be used as
 * accents (DESIGN-SYSTEM.md). So the three dots are one `muted` disc at three opacities, which
 * reads as the same familiar affordance without inventing three colours. Decoration, so
 * `muted`'s 3.53:1 answers WCAG 1.4.11's 3:1 floor rather than the 4.5:1 text floor.
 */

import type { ReactNode, Ref } from "react";

export default function MockWindow({
  title,
  children,
  className = "",
  bodyClassName = "",
  rootRef,
  ...rest
}: {
  /** The shell prompt shown in the title bar. A prompt string, not a sentence. */
  title: string;
  children: ReactNode;
  /** Sizing and positioning — owned by the caller, never by this component. */
  className?: string;
  bodyClassName?: string;
  /* An explicit prop rather than `forwardRef`. React 19 would let `ref` ride in as a plain
     prop, but naming it keeps the call sites readable and survives a downgrade. */
  rootRef?: Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    /* ⚠️ `dir="ltr"` IS LOAD-BEARING on both consumers. On /he the document is RTL, and without
       it the chrome mirrors: the traffic lights jump to the right, and the monospace columns
       inside flip away from their labels. CLI output is a code artifact, not prose.
       ⚠️ `aria-hidden` is on the ROOT, so nothing inside either window needs its own. Every
       claim these windows print appears verbatim as real prose in the Compliance band further
       down the page, so a screen-reader user loses nothing — and a monospace pseudo-terminal
       read aloud is worse than silence. Nothing inside is focusable, so focus order is
       unchanged: one control in <main>, the hero CTA. */
    <div
      ref={rootRef}
      dir="ltr"
      aria-hidden="true"
      className={`select-none overflow-hidden rounded-[6px] border border-hairline-light
                  bg-ink font-mono ${className}`}
      {...rest}
    >
      {/* Title bar — 32 phone / 36 from tablet. `ink-soft` #383838 is the site's "softened dark"
          and is the one existing token that reads as chrome against `ink` without inventing a
          panel colour. */}
      <div
        className="flex h-8 shrink-0 items-center gap-2 border-b border-hairline-light
                   bg-ink-soft px-3 tablet:h-9 tablet:px-4"
      >
        <span className="flex shrink-0 items-center gap-[6px]">
          <span className="block h-[9px] w-[9px] rounded-full bg-muted" />
          <span className="block h-[9px] w-[9px] rounded-full bg-muted opacity-70" />
          <span className="block h-[9px] w-[9px] rounded-full bg-muted opacity-50" />
        </span>
        <span
          className="truncate text-[11px] text-paper-soft tablet:text-[12px]"
          style={{ letterSpacing: "-0.01em" }}
        >
          {title}
        </span>
      </div>

      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
