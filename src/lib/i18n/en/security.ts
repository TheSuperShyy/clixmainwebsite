/**
 * English copy for /security. OWNED BY ONE AGENT — see features/i18n-rtl/FEATURE.md.
 *
 * THE NAMESPACE'S SHAPE IS DEFINED HERE, in the English file, and `dictionary.ts` only imports
 * it. That is what keeps this a single-owner file: growing the namespace never means editing a
 * file another agent also touches.
 *
 * ⚠️ EXTRACTED VERBATIM from the four components' module-level consts on 2026-08-12:
 * `SecurityHero.tsx` (TITLE / SUBTITLE / CTA), `SecurityBenefits.tsx` (BENEFITS[].title/.body),
 * `SecurityCompliance.tsx` (HEADING_LINE_1 / HEADING_LINE_2 / PRACTICES[].label) and
 * `SecurityCore.tsx` (TITLE / P1 / P2). Byte-identical, curly apostrophes (’ U+2019) included.
 * The English render is verified as a no-op, so a "tidied" string here is a regression.
 *
 * ⚠️ NO JSX, NO HTML, NO MARKUP. Two elements on this route are ONE element with an internal
 * break, and both keep the element in the component and take their runs from here as separate
 * keys:
 *   · `compliance.headingPaper` / `.headingMuted` — SecurityCompliance's h2, where the `<br>`
 *     IS the colour boundary (run 1 is a `paper` span, run 2 is the h2's own `muted`).
 *   · `core.body1` / `.body2` — SecurityCore's single `<p>` with TWO `<br/>` in it. The blank
 *     line between them is a REAL LINE and its 187.25px box is measured; two `<p>`s with a
 *     margin is a different measurement.
 *
 * ⚠️ WHY THIS FILE DECLARES AN EXPLICIT INTERFACE INSTEAD OF `as const`. Two reasons, and both
 * would be silent bugs otherwise:
 *   1. `labelWidth` is a NUMBER, and under `as const` its type would be the literal `137`.
 *      `Translated<T>` passes non-string leaves through UNWIDENED (shape.ts), so Hebrew would
 *      be forced to supply exactly 137 — the opposite of what that field is for.
 *   2. `benefits.items` (6) and `compliance.practices` (5) are LAYOUT counts, so they are
 *      fixed-length tuples: a locale supplying five benefits must fail the build, not reflow
 *      the grid. Nothing on this route is a line-fitting array — this page has no headline
 *      split into hard lines — so there is no `readonly string[]` here at all.
 */

/** One cell of the Benefits grid. Six of them, and the six rows are uniform — see below. */
export interface BenefitCopy {
  /** ⚠️ EXACTLY 1 RENDERED LINE at 400 / 452 / 358px, in every locale. */
  readonly title: string;
  /** ⚠️ EXACTLY 2 RENDERED LINES at 400 / 452 / 358px, in every locale. */
  readonly body: string;
}

/** One cell of the Compliance grid. Five of them. */
export interface PracticeCopy {
  readonly label: string;
  /**
   * The label box's measure, in px, applied as an inline `width`.
   *
   * ⚠️ PER-LOCALE, DELIBERATELY. The target hand-authored one width per cell (137 ×4, 188 for
   * the fifth — the only one it widened) and every one of those numbers was fitted to an
   * ENGLISH label. They are void in Hebrew, so the field lives in the dictionary rather than
   * in the component and each locale carries its own fitted set. Contract §10: where a Hebrew
   * string cannot hold a box measured against English, the BOX changes and the change is
   * recorded — the string is not trimmed to fit.
   *
   * The box is anchored to the cell's bottom-inline-start corner and grows UPWARD, so a wider
   * or taller label costs nothing until it reaches the 104px mark at y 68→172 of a 240px cell.
   * Horizontal headroom at the narrowest tier: 256 − 16 = 240px.
   */
  readonly labelWidth: number;
}

/**
 * One exchange in the hero terminal, translatable halves ONLY.
 *
 * ⚠️ THE TOOL CALLS AND THE RESULT KEYS ARE NOT HERE, AND THAT ABSENCE IS THE SPEC.
 * `Read(infra/deploy.tf)`, `Bash(clix env show)` and the `region` / `scope` / `retention` key
 * column are CODE ARTIFACTS — they stay as literals in `SecurityTerminal.tsx`, where a locale
 * cannot reach them. The user's ask on 2026-08-14 was "translate this part also, only the
 * necessary parts", and this interface is where that line is drawn: a locale may write what a
 * person READS and nothing that a shell would print.
 */
export interface TerminalExchangeCopy {
  /** The question that types itself into the prompt box. */
  readonly prompt: string;
  /** The VALUE half of the two result rows, in order. The key half is Latin, in the component. */
  readonly results: readonly [string, string];
  /** The agent's answer. ⚠️ THIS IS THE CLAIM — one per `compliance.practices` cell, in order. */
  readonly say: string;
}

export interface TerminalCopy {
  /** The welcome panel's greeting, beside the dot-matrix wordmark. */
  readonly greeting: string;
  /** Right-hand column of `/agent`'s roster. THREE — the count is the menu, so a tuple. */
  readonly agents: readonly [string, string, string];
  /** Right-hand column of `/model`'s roster. THREE. ⚠️ The model IDS are not here; see above. */
  readonly models: readonly [string, string, string];
  /** FIVE, in the Compliance band's order, same as `compliance.practices`. */
  readonly exchanges: readonly [
    TerminalExchangeCopy,
    TerminalExchangeCopy,
    TerminalExchangeCopy,
    TerminalExchangeCopy,
    TerminalExchangeCopy,
  ];
}

/** The back window. Same rule as `TerminalCopy`: run names, file names and diffs are absent. */
export interface ConsoleCopy {
  /** The three pane headings, in rail order. */
  readonly headings: readonly [string, string, string];
  /** SIX run ages, in rail order. Short — the rail gives them ~37px beside a truncating name. */
  readonly ages: readonly [string, string, string, string, string, string];
  /** The VALUE half of the five detail rows. Keys are Latin, in the component. */
  readonly details: readonly [string, string, string, string, string];
  /** A progress statement, never a verdict — see the note in SecurityConsole.tsx. */
  readonly progress: string;
}

export interface SecurityDict {
  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
    readonly cta: string;
  };
  readonly benefits: {
    /** SIX cells. The count is layout — the grid is 3 × 2 / 2 × 3 / 1 × 6. Tuple. */
    readonly items: readonly [
      BenefitCopy,
      BenefitCopy,
      BenefitCopy,
      BenefitCopy,
      BenefitCopy,
      BenefitCopy,
    ];
  };
  readonly compliance: {
    /** h2 run 1 — the inner `<span className="text-paper">`. One line, never wrapping. */
    readonly headingPaper: string;
    /** h2 run 2 — the h2's own `muted`, after the `<br>`. One line, never wrapping. */
    readonly headingMuted: string;
    /** FIVE cells. The count is layout — 5 / 2 / 1 columns over one closed outline. Tuple. */
    readonly practices: readonly [
      PracticeCopy,
      PracticeCopy,
      PracticeCopy,
      PracticeCopy,
      PracticeCopy,
    ];
  };
  readonly core: {
    readonly title: string;
    /** Run 1 of the single `<p>`. */
    readonly body1: string;
    /** Run 2, after the two `<br/>`. */
    readonly body2: string;
  };
  readonly terminal: TerminalCopy;
  readonly console: ConsoleCopy;
}

export const security: SecurityDict = {
  hero: {
    title: "Your Keys. Your Data.",
    subtitle:
      "Clix runs your automations inside your own accounts, with the narrowest access that does the job.",
    cta: "Request Demo",
  },

  /**
   * ⚠️ THE TRAP, restated where the strings actually live. Every title sets in exactly ONE
   * line and every body in exactly TWO, at every tier. The grid rows are `min-content` and
   * uniform, so one body wrapping to a third line raises the row that holds it and moves the
   * two items beside it. The row height is a SUM — 36 + 64 + (23.41 + 4 + 41.59) + 16 = 185 at
   * ≥1200 — which is why an UNDERSHOOT fails identically: a 1-line body shortens the row just
   * as a 3-line one lengthens it. Fitted by RENDERED LINE COUNT, never by character budget.
   */
  benefits: {
    items: [
      {
        title: "No training on your data",
        body: "We never use your data to train or improve any model, ours or a vendor’s.",
      },
      {
        title: "Your data stays yours",
        body: "Workflows run in your own accounts. Clix never holds a second copy.",
      },
      {
        title: "Full visibility on every run",
        body: "Every run records what it read, what it wrote and when, so nothing is hidden.",
      },
      {
        title: "Least-privilege access",
        body: "Each integration gets the narrowest scope that does the job, and nothing wider.",
      },
      {
        title: "Encrypted in transit and at rest",
        body: "Data moves over TLS and credentials are held in a managed secret store.",
      },
      {
        title: "You own the code",
        body: "The automations are yours. Hand them to another team, or run them without us.",
      },
    ],
  },

  /**
   * ⚠️ PRACTICE STATEMENTS, NOT CERTIFICATION SEALS. The target's five cells are SOC 2, CCPA,
   * ISO 27001, GDPR and the EU AI Act; clix holds none of them, and SOC 2 and ISO 27001 are
   * AUDITED certifications. This repo removed that exact set from the home page on 2026-08-05
   * and from /product on 2026-08-12. The heading moved WITH the cells — "Compliant With /
   * Industry Standards" became "Built On / Practices We Keep" — precisely because nobody
   * certifies a practice, so the old heading would reintroduce by implication the claim the
   * cell swap removes. Do not restore either half from any capture.
   */
  compliance: {
    headingPaper: "Built On",
    headingMuted: "Practices We Keep",
    practices: [
      { label: "Your cloud, your accounts", labelWidth: 137 },
      { label: "Your data stays yours", labelWidth: 137 },
      { label: "Least-privilege access", labelWidth: 137 },
      { label: "Encrypted in transit and at rest", labelWidth: 137 },
      /* The only widened measure in the grid — the target widened its fifth label too. */
      { label: "You own the code", labelWidth: 188 },
    ],
  },

  core: {
    title: "Built To Be Trusted",
    body1:
      "Security is not a layer clix adds at the end. Every automation we build runs inside your own cloud, your own CRM and your own inboxes, under credentials you issue and can revoke in a minute. We ask for the narrowest scope a workflow needs, we log every read and every write, and we hand you the code so nothing depends on us staying in the room.",
    body2:
      "We do not train models on your data, and we do not keep a second copy of it. When a workflow touches something sensitive, you can see exactly what it touched and when. That is the whole of the promise, and it is checkable.",
  },

  /**
   * ⚠️ EXTRACTED VERBATIM from `SecurityTerminal.tsx`'s module consts on 2026-08-14, when the
   * user asked for the hero windows to speak Hebrew on /he ("can we translate this part also?
   * only the necessary parts"). Byte-identical to what those consts held, because the English
   * render of that window is signed off and a "tidied" string here is a regression.
   *
   * ⚠️ THIS REVERSES A DECISION THE TERMINAL'S HEADER STILL RECORDS. From 2026-08-13 that file
   * said "ENGLISH AND LTR IN BOTH LOCALES, ON PURPOSE" and never reached for the dictionary. The
   * LTR half of that finding STANDS — `MockWindow` still pins `dir="ltr"` and the chrome, the
   * marker column and the shell prompt are unmirrored. Only the ENGLISH half was reversed, and
   * only for prose. See the terminal's header for what that split cost mechanically.
   *
   * ⚠️ THE FIVE `say` LINES ARE THE FIVE `compliance.practices` CELLS, IN ORDER, and that
   * mapping is the reason the window is allowed to make claims at all: every sentence it prints
   * is restated as real prose further down the same page. A sixth exchange, or a `say` that
   * asserts something the band does not, walks an unbacked claim back onto this route — which is
   * the exact thing the SOC 2 / ISO 27001 removals of 2026-08-05 and 2026-08-12 were about.
   *
   * ⚠️ THE COLUMN BUDGET IS 43 CHARACTERS AND IT BINDS AT THE 390px TIER. A `menu` row is the id
   * column (14 for agents, 17 for models — the component pads) plus the string below; a `result`
   * row is its key plus two spaces plus the value. Longer silently clips at the phone tier and
   * nowhere else.
   */
  terminal: {
    greeting: "Welcome to clix code",
    agents: ["security review", "automation authoring", "run monitoring"],
    models: ["agentic coding", "long horizon work", "speed and cost"],
    exchanges: [
      {
        prompt: "where does my data get processed",
        results: ["aws", "eu-west-1 (yours)"],
        say: "It runs in your cloud account, not ours.",
      },
      {
        prompt: "what do you keep after a run",
        results: ["none", "0 files"],
        say: "Nothing is stored once a run finishes.",
      },
      {
        prompt: "check the access this needs",
        results: ["get, list", "read only"],
        say: "Every credential is scoped to one task.",
      },
      {
        prompt: "verify how secrets are held",
        /* ⚠️ `tls` CARRIES NO VERSION NUMBER, deliberately — Benefit 5 is still an open question
           in FEATURE.md and naming a version invents precision on an unsigned claim. */
        results: ["your vault", "tls"],
        say: "Keys stay in your own vault.",
      },
      {
        prompt: "who owns the automation you write",
        results: ["yours", "your repo"],
        say: "The code lands in your repository.",
      },
    ],
  },

  /** Extracted from `SecurityConsole.tsx` in the same pass, under the same rule: run ids, run
      names, file names and diff counts stayed behind as literals; only prose moved. */
  console: {
    headings: ["RUNS", "RUN", "FILES"],
    ages: ["now", "2h", "5h", "9h", "1d", "1d"],
    details: [
      "eu-west-1 (yours)",
      "read only",
      "your vault",
      "none",
      "your repo",
    ],
    progress: "6 of 6 steps complete",
  },
};
