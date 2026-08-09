/**
 * ClixLogoProof — clone of rogo.com/felix `Logo Proof` (`.framer-s22g2m`).
 * Measured from the 2026-08-09 capture. Spec: features/felix-page/FEATURE.md.
 *
 * A STATIC GRID, not a marquee. The home page's logo row is a scrolling track; this one is
 * a fixed 4x3 grid of tiles with a hard height. Do not "unify" them — they are different
 * components in the original and the grid is what makes the 12th tile land bottom-right.
 *
 * Tier map: 4 columns >=1200, 3 at tablet, 2 on phone — and the phone tier also grows the
 * grid from 436px to 600px, because 12 logos in 2 columns is 6 rows instead of 3.
 */

/* The target names 12 institutions. ALL TWELVE ARE ALREADY VENDORED — they came with the
   home page's 14-logo carousel, so nothing new was fetched or redrawn for this section.
   Order is the capture's, left-to-right then down. */
const LOGOS = [
  { name: "Jefferies", file: "logo-jefferies-white.svg" },
  { name: "Lazard", file: "logo-lazard-white.svg" },
  { name: "Tiger Global", file: "logo-tigerglobal-white.svg" },
  { name: "Moelis", file: "logo-moelis-white.svg" },
  { name: "Nomura", file: "logo-nomura-white.svg" },
  { name: "Rothschild & Co", file: "logo-rothschild-white.svg" },
  { name: "Raymond James", file: "logo-raymond-james-white.svg" },
  { name: "Truist", file: "logo-truist-white.svg" },
  { name: "Leerink Partners", file: "logo-leerink-white.svg" },
  { name: "Canaccord", file: "logo-canaccord-white.svg" },
  { name: "Baird", file: "logo-baird-white.svg" },
  { name: "HCW", file: "logo-hcw-white.svg" },
];

export default function ClixLogoProof() {
  return (
    <section
      data-nav-theme="light"
      className="relative flex h-min w-full flex-col items-center justify-center gap-[108px]
                 overflow-clip px-4 py-10
                 tablet:px-10 tablet:pt-10 tablet:pb-[164px]"
    >
      {/* Width Container — gap 36, phone 32 */}
      <div className="relative flex h-min w-full max-w-[var(--container-max)] flex-col
                      items-center justify-center gap-8 tablet:gap-9">
        <p
          /* The one place `#8b8b8b` appears on this page (x2 total). Deliberately NOT
             tokenized — two uses is a one-off, not a scale step. See DESIGN-SYSTEM.md. */
          className="h-auto w-auto max-w-[250px] flex-none text-center font-sans text-[14px]
                     font-medium tablet:max-w-[720px]"
          style={{
            color: "#8b8b8b",
            letterSpacing: "-0.2px",
            lineHeight: "1.5em",
          }}
        >
          Trusted by the world&rsquo;s leading financial institutions
        </p>

        {/* The grid's HEIGHT is fixed, not derived — 436px at >=810, 600px on phone. With
            `grid-auto-rows:minmax(0,1fr)` that is what gives every tile an identical box
            regardless of how tall its logo is. */}
        <ul
          className="relative grid h-[600px] w-full list-none grid-cols-2 gap-2 p-0
                     tablet:h-[436px] tablet:grid-cols-3
                     desktop:grid-cols-4"
          style={{ gridAutoRows: "minmax(0,1fr)", justifyContent: "center" }}
        >
          {LOGOS.map((l) => (
            <li
              key={l.name}
              /* `#15151508` — ink at ~3%. Inlined in the original rather than published as a
                 token, and it is the only fill in the section, so it stays a literal here
                 with the value named rather than becoming a global. */
              className="relative flex h-full w-full items-center justify-center self-start
                         overflow-clip rounded-[6px]"
              style={{ backgroundColor: "#15151508" }}
            >
              {/* The vendored SVGs are WHITE-fill — they were cut for the home page's dark
                  hero and would be invisible here. Rendered as a CSS mask with a currentColor
                  fill instead of shipping a second, recoloured copy of all twelve: one asset,
                  either polarity, and the alpha channel is identical either way. */}
              <span
                role="img"
                aria-label={l.name}
                className="block h-8 w-1/2 bg-ink/70"
                style={{
                  WebkitMaskImage: `url(/logos/${l.file})`,
                  maskImage: `url(/logos/${l.file})`,
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
