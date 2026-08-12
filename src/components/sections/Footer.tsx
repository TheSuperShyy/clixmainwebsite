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

import FooterMap from "./FooterMap";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  /* Per-tier visibility, for the two links the original does not ship at every tier.
     See the open questions in FEATURE.md — reproduced, not corrected. */
  only?: "desktop" | "below-desktop";
};

type LinkGroup = { title: string; links: FooterLink[] };

/* Remapped 2026-08-05 onto clix's real IA and real accounts. Structure is the target's and
   is unchanged: four columns, three links each plus a four-link Contact column, and the
   same per-tier gating. Only the destinations moved.

   The four `#` placeholders left by the 2026-08-03 brand rename are gone — every link in
   the Contact column now resolves to something clix actually owns, taken from
   docs/reference/clixsolutions/. */
const CONTACT = {
  email: "mailto:info@clixsolution.com",
  instagram: "https://www.instagram.com/clix_solution/",
  /* +972 55-948-3457, in wa.me's digits-only form. */
  whatsapp: "https://wa.me/972559483457",
};

const GROUPS: LinkGroup[] = [
  {
    title: "Overview",
    links: [
      { label: "Services", href: "/services" },
      { label: "Industries", href: "/industries" },
      { label: "Work", href: "/work" },
    ],
  },
  {
    title: "Company",
    links: [
      /* Repointed 2026-08-12: was `/about`, which never existed and 404'd. `/company` is the
         clone of rogo.com/company and is the page this label means. The nav calls the same
         route "Company"; the labels differ because each list keeps its own capture's wording.
         The other eight links in this footer still point at routes this repo does not have. */
      { label: "About", href: "/company" },
      { label: "Insights", href: "/insights" },
      { label: "Playground", href: "/playground" },
    ],
  },
  {
    title: "Legal",
    links: [
      /* The original gates ONE link in this column to >=1200, so the column is 3 links on
         desktop and 2 below. That behaviour is reproduced, but the gate was moved off the
         accessibility statement and onto Terms: an accessibility statement is exactly the
         page a user on assistive tech may be looking for, and hiding it on phones would
         turn an inherited layout quirk into a real barrier. Terms carries the gate instead.
         Flagged in FEATURE.md. */
      { label: "Terms of Use", href: "/terms", only: "desktop" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Let’s start", href: "#contact" },
      { label: "Email", href: CONTACT.email },
      { label: "Instagram", href: CONTACT.instagram, external: true },
      /* The original splits "Press" by tier — a mailto at >=1200, an x.com profile below —
         which is why this column renders four links at every tier from five entries. clix
         has one WhatsApp number and no tier-specific alternative, so this is a single
         ungated entry. The visible count per tier is unchanged at four. */
      { label: "WhatsApp", href: CONTACT.whatsapp, external: true },
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
      /* Anchor for the nav's "Contact" link and for every "Let's start" button on the page
         (2026-08-05). The closing CTA lives inside this footer in the original, so this is
         genuinely where a contact click should land — not a separate section. */
      id="contact"
      className="relative flex w-full scroll-mt-24 items-center justify-center gap-[10px] overflow-hidden bg-ink px-4 tablet:px-10"
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
                {/* clix's own footer tagline, English-rendered — the live site closes on
                    "תוכנה שעובדת, תוצאות שמדברות." It happens to split three ways, so it
                    drops straight into the target's {A}<br phone>{B}<br>{C} structure with
                    no change to either break. */}
                {"Software "}
                {/* The phone variant carries an extra break here; the trailing space
                    survives `display:none`, so the wider tiers weld cleanly. */}
                <br className="tablet:hidden" />
                {"that works,"}
                {/* The capture wraps this break in a span coloured `ink`. It holds no text,
                    so it paints nothing — dropped rather than copied, same as
                    by-the-numbers. */}
                <br />
                {"results that speak."}
              </h2>
            </div>
          </div>

          {/* CTA — 44px tall, 42px at tablet, full-width on phone. Same button internals as
              the nav's (8/16 padding around a 20px row with a 1px optical top nudge) but a
              16px label instead of 14px. */}
          <div className="relative h-11 w-full flex-none tablet:h-[42px] tablet:w-auto desktop:h-11">
            <a
              href="#contact"
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
                  Let&rsquo;s start
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
          {/* Link row. The four columns are the target's; the map is ours, added
              2026-08-11 as a fifth item pinned to the right edge. It is why the columns no
              longer divide the full width — they now share it with a fixed 280/430px
              panel, which is the intended shift-left. */}
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
                  {/* Keyed on label + tier, not label + href. "Press" appears twice — once
                      per tier — and the two used to differ by href, which no longer holds
                      now both are the `#` placeholder. Tier is what actually distinguishes
                      them, so the key stays unique whatever the destinations become. */}
                  {group.links.map((item) => (
                    <FooterLinkItem
                      key={`${item.label}-${item.only ?? "all"}`}
                      item={item}
                    />
                  ))}
                </div>
              </div>
            ))}

            <FooterMap />
          </div>

          {/* Copyright — "© 2026" and the holder as two separate uppercase runs, 8px apart.
              The caps come from `text-transform`, so the accessible name stays lowercase.
              The target says "Rogo AI" here; changed with the nav logo (2026-08-03), since
              a clix mark over a "© ROGO AI" line names the wrong copyright holder. */}
          <div className="relative flex w-full flex-none flex-row items-start justify-center gap-4 overflow-hidden px-12 py-4">
            <div className="relative flex w-px flex-[1_0_0] flex-row items-center justify-center gap-2 overflow-visible">
              <p className="text-center text-[14px] leading-[1.3em] tracking-[-0.02em] whitespace-pre text-muted uppercase tablet:font-medium desktop:text-[12px]">
                © 2026
              </p>
              <p className="text-center text-[14px] leading-[1.3em] tracking-[-0.02em] whitespace-pre text-muted uppercase tablet:font-medium desktop:text-[12px]">
                clix
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
