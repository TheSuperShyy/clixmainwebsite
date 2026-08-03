/**
 * Footer + closing CTA — clone of rogo.ai's `Footer` component
 * (`.framer-8dt5bh-container` → `<footer class="framer-fo8jf5">`).
 *
 * Spec, provenance and open questions: features/footer/FEATURE.md.
 * Do not "tidy" a number here without changing that file first.
 *
 * The closing CTA is INSIDE the footer in the original, not a separate section — hence one
 * component, not two.
 *
 * This is a nested Framer component, so it ships its own three variants with their own
 * gating hashes: `hidden-d23fwj` = >=1600 · `hidden-1roolzl` = 1200-1599.98 ·
 * `hidden-1leoyz4` = 810-1199.98 · `hidden-16n7npo` = <=809.98. Same four tiers as the page,
 * different names. The rendered variants are `Dark/Desktop` (>=1200), `Dark/Tablet`
 * (810-1199.98) and `Dark/Mobile` (<=809.98).
 *
 * WATCH OUT: the stylesheet also carries rules for `framer-v-1cxbn18` and
 * `framer-v-18cp4bv`, which are UNRENDERED variants of the same component — including a
 * tempting `grid-template-columns: repeat(2, …)` on the link row. None of it applies. Only
 * the three variants above are authoritative; see the standing rule in README.md.
 *
 * No animation beyond the link hover, which IS measured: the capture's link preset carries
 * `transition: color .3s cubic-bezier(.44,0,.56,1)` and a hover colour. That makes this the
 * second place on the site with a real authored transition rather than an estimate.
 */

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  /* Per-tier visibility, for the two links the original does not ship at every tier.
     See the open questions in FEATURE.md — reproduced, not corrected. */
  only?: "desktop" | "below-desktop";
};

type LinkGroup = { title: string; links: FooterLink[] };

const GROUPS: LinkGroup[] = [
  {
    title: "Overview",
    links: [
      { label: "Product", href: "/product" },
      { label: "Features", href: "/#features" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Careers", href: "/careers" },
      { label: "Security Advisory Board", href: "/security-council" },
    ],
  },
  {
    title: "Legal",
    links: [
      /* The original ships this link on the >=1200 variant ONLY. Reproduced verbatim, which
         means a phone or tablet user cannot reach it. Flagged in FEATURE.md. */
      { label: "Legal", href: "/legal", only: "desktop" },
      { label: "Terms of Use", href: "/terms-of-use" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Request Demo", href: "/demo" },
      { label: "Sales", href: "mailto:sales@rogo.ai" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/rogoai/",
        external: true,
      },
      /* "Press" has two different destinations in the original, split by tier: a mailto on
         the >=1200 variant, an x.com profile below it. Both shipped, each gated to the tier
         that declares it. Flagged in FEATURE.md. */
      {
        label: "Press",
        href: "mailto:press@rogo.ai",
        external: true,
        only: "desktop",
      },
      { label: "Press", href: "https://x.com/RogoAI", only: "below-desktop" },
    ],
  },
];

const tierClass = (only?: FooterLink["only"]) =>
  only === "desktop"
    ? "hidden desktop:block"
    : only === "below-desktop"
      ? "block desktop:hidden"
      : "";

function FooterLinkItem({ item }: { item: FooterLink }) {
  return (
    <div
      className={`relative h-auto w-auto max-w-[1024px] ${tierClass(item.only)}`}
    >
      <p className="text-[14px] leading-[1.5em] tracking-[-0.02em]">
        <a
          href={item.href}
          {...(item.external ? { target: "_blank", rel: "noreferrer" } : null)}
          /* paper -> surface on hover. The `.3s cubic-bezier(.44,0,.56,1)` is the
             capture's own, not an estimate — it is declared on the link style preset. */
          className="text-paper no-underline transition-[color] duration-300
                     hover:text-surface
                     focus-visible:rounded-[2px] focus-visible:ring-2
                     focus-visible:ring-paper focus-visible:outline-none"
          style={{ transitionTimingFunction: "var(--ease-rogo)" }}
        >
          {item.label}
        </a>
      </p>
    </div>
  );
}

export default function Footer() {
  return (
    /* padding `0 16px` phone -> `0 40px` from 810 up. No vertical padding at all: the
       Reiteration block's own `padding-top:56px` is the footer's entire top inset, and the
       Copyright's `16px` is the bottom. */
    <footer
      data-nav-theme="dark"
      className="relative flex w-full items-center justify-center gap-[10px] overflow-hidden bg-ink px-4 tablet:px-10"
    >
      {/* Container — max-w 1280, gap 56. */}
      <div className="relative flex w-px max-w-[var(--container-max)] flex-[1_0_0] flex-col items-center gap-14 overflow-hidden">
        {/* Reiteration — headline and CTA on one baseline at >=810 (`align-items:flex-end`
            is what sits the button on the headline's last line), stacked below. */}
        <div
          className="relative flex w-full flex-col items-end gap-8 overflow-hidden pt-14
                     tablet:flex-row tablet:justify-start tablet:gap-10"
        >
          <div className="relative flex w-full flex-none flex-col items-start gap-10 overflow-visible tablet:w-px tablet:flex-[1_0_0]">
            <div className="relative h-auto w-full">
              <h2 className="font-display text-[44px] leading-[1.1em] tracking-[-0.05em] text-paper tablet:text-[48px]">
                {"Unlock "}
                {/* The phone variant carries an extra break after "Unlock"; the trailing
                    space survives `display:none`, so the wider tiers read "Unlock financial
                    AI" with no welding. */}
                <br className="tablet:hidden" />
                {"financial AI"}
                {/* The capture wraps this break in a span coloured `ink`. It holds no text,
                    so it paints nothing — dropped rather than copied, same as
                    by-the-numbers. */}
                <br />
                {"for your firm"}
              </h2>
            </div>
          </div>

          {/* CTA — 44px tall, 42px at tablet, full-width on phone. Same button internals as
              the nav's (8/16 padding around a 20px row with a 1px optical top nudge) but a
              16px label instead of 14px. */}
          <div className="relative h-11 w-full flex-none tablet:h-[42px] tablet:w-auto desktop:h-11">
            <a
              href="/demo"
              className="relative flex h-full w-full cursor-pointer flex-row items-center
                         justify-center gap-2 overflow-hidden rounded-[6px] border
                         border-[rgba(168,162,158,0)] bg-paper px-4 py-2 no-underline
                         focus-visible:ring-2 focus-visible:ring-paper
                         focus-visible:ring-offset-2 focus-visible:ring-offset-ink
                         focus-visible:outline-none
                         tablet:w-min"
            >
              <div className="relative flex h-5 w-min flex-row items-center justify-center gap-[10px] pt-px">
                <p className="text-center text-[16px] leading-[1em] font-medium tracking-[-0.01em] whitespace-pre text-ink">
                  Request Demo
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Divider. TWO different colours: `ink-soft` @50% below 1200, white @10% at and
            above it. Both are opacity modifiers on existing tokens, so neither is a new
            design-system value. */}
        <div className="relative h-px w-full flex-none bg-ink-soft/50 desktop:bg-paper/10" />

        {/* Bottom — link row over the copyright, gap 72. */}
        <div className="relative flex w-full flex-none flex-col items-center gap-[72px] overflow-hidden">
          <div
            className="relative flex w-full flex-none flex-col items-start gap-8
                       overflow-hidden tablet:flex-row tablet:gap-4"
          >
            {GROUPS.map((group) => (
              <div
                key={group.title}
                className="relative flex w-full flex-none flex-col items-start gap-5
                           overflow-hidden tablet:w-px tablet:flex-[1_0_0]"
              >
                <div className="relative h-auto w-full max-w-[1024px]">
                  <p className="text-[14px] leading-[1.3em] font-medium tracking-[-0.02em] text-muted">
                    {group.title}
                  </p>
                </div>
                <div className="relative flex w-full flex-none flex-col items-start gap-3 overflow-visible">
                  {group.links.map((item) => (
                    <FooterLinkItem
                      key={`${item.label}-${item.href}`}
                      item={item}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Copyright — "© 2026" and "ROGO AI" as two separate uppercase runs, 8px apart.
              The second is the literal string "Rogo AI"; the caps come from
              `text-transform`, so the accessible name stays "Rogo AI". */}
          <div className="relative flex w-full flex-none flex-row items-start justify-center gap-4 overflow-hidden px-12 py-4">
            <div className="relative flex w-px flex-[1_0_0] flex-row items-center justify-center gap-2 overflow-visible">
              <p className="text-center text-[14px] leading-[1.3em] tracking-[-0.02em] whitespace-pre text-muted uppercase tablet:font-medium desktop:text-[12px]">
                © 2026
              </p>
              <p className="text-center text-[14px] leading-[1.3em] tracking-[-0.02em] whitespace-pre text-muted uppercase tablet:font-medium desktop:text-[12px]">
                Rogo AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
