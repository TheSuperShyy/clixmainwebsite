/**
 * ClixManifesto — clone of rogo.com/felix `Manifesto` (`.framer-tyl85t`).
 * Measured from the 2026-08-09 capture. Spec: features/felix-page/FEATURE.md.
 *
 * ⚠️ THE BACKGROUND IS A DOCUMENTED DEVIATION, AND THE ONLY ONE ON THIS BLOCK.
 *
 * The capture proves this block's type is WHITE (`#ffffff` title, `rgba(255,255,255,0.7)`
 * body) but carries no background of its own — nothing static on the page is dark. The only
 * candidate is the page's shared `position:fixed` 110vh backdrop, whose SSR fill is
 * `#f7f7f7`: rogo animates that ONE layer's colour from JS as you scroll, so the whole
 * viewport crossfades to dark around this section and back out again.
 *
 * That sequence — the stops, the scroll offsets, the easing — is not in a static capture and
 * has not been observed on the live site. So rather than invent a scroll timeline, this
 * section paints its OWN `forest` background. Same legibility, same colour family, honest
 * about what it is: the visible difference is a hard edge where the original crossfades.
 *
 * Replace this with the real animated backdrop once someone has watched the live page.
 * `forest` is the page's own colour and the only dark it declares, which is why it was
 * picked over `ink` — but it is a reasoned choice, not a measured one.
 */

/* Verbatim from the capture, paragraph breaks included. Rogo's words, per the user's
   "clone verbatim now, rewrite after" — this is the block the copy pass will hit hardest. */
const PARAGRAPHS = [
  "Since the release of consumer LLMs, AI in finance has been treated like a better search box.",
  "Ask a question, get an answer.\nBut the best dealmakers aren’t constrained by gathering information. They’re limited by the time it takes to turn that information into advice for a CEO or recommendation for an investment committee.",
  "Felix changes that by giving every user access to a personalized agent. You can still explore ideas quickly in the interface, but now you can also email Felix like you would a colleague. Felix simply adds the ability to delegate more involved work to a dedicated agent and iterate as the deliverables progress.",
  "With Felix, execution becomes solved and intelligence becomes abundant. What matters most is the singular combination of relationships and judgment the best dealmakers apply on top of Felix.",
  "Felix exists to give professionals leverage - so experienced bankers, investors, and analysts can spend more time mastering their craft, mentoring junior talent, and making the decisions that ultimately make markets work better for everyone.",
];

export default function ClixManifesto() {
  return (
    <section
      id="manifesto"
      /* `dark` so the fixed nav flips to its solid-ink palette over this block — without it
         the bar would sit white-on-dark-ish and the links would fight the background. */
      data-nav-theme="dark"
      className="relative z-[1] flex h-min w-full flex-col items-center justify-center gap-20
                 overflow-clip bg-forest px-4 py-32
                 tablet:px-10 tablet:pt-[164px] tablet:pb-16"
    >
      {/* Width Container — gap 48, phone 16 */}
      <div className="relative flex h-min w-full max-w-[var(--container-max)] flex-col
                      items-center justify-center gap-4 tablet:gap-12">
        {/* The text column is 550px, NOT the container — and it is left-aligned inside a
            centred parent, which is what gives the block its off-centre feel. */}
        <div className="relative flex h-min w-full max-w-[550px] flex-col items-start
                        justify-center gap-6 px-6 tablet:gap-10 tablet:px-0">
          <h2
            /* max-width 300px is deliberate: it forces "The future state of finance" to wrap
               to two lines at every tier. 240px on phone does the same at the smaller size. */
            className="h-auto w-full max-w-[240px] flex-none font-display text-paper
                       text-[40px] tablet:max-w-[300px] tablet:text-[48px]"
            style={{ letterSpacing: "-0.05em", lineHeight: "110%" }}
          >
            The future state of finance
          </h2>

          <div className="h-auto w-full flex-none">
            {PARAGRAPHS.map((p, i) => (
              <p
                key={i}
                /* `-0.2px` is an absolute letter-spacing, not an em value — the original
                   mixes the two and this block uses px. Do not convert it. */
                className="font-sans text-[20px] whitespace-pre-line text-paper/70
                           [&:not(:first-child)]:mt-[1.4em]"
                style={{ letterSpacing: "-0.2px", lineHeight: "140%" }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
