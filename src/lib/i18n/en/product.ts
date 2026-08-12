/**
 * English copy for /product. OWNED BY ONE AGENT — see features/i18n-rtl/FEATURE.md.
 *
 * THE NAMESPACE'S SHAPE IS DEFINED HERE, in the English file, and `dictionary.ts` only imports
 * it. That is what keeps this a single-owner file: growing the namespace never means editing a
 * file another agent also touches.
 *
 * ⚠️ EXTRACT VERBATIM. Every string moved here is byte-identical to what the component said
 * before, including the curly apostrophes (’ U+2019) in the hero CTA and in phone card 1, the
 * literal `&` in three headings, and the `...` ellipses in the mock status lines. The English
 * render is verified as a no-op, so a "tidied" string is a regression. Verified mechanically:
 * `scripts`-free check in the report, every literal diffed against the pre-change component
 * source rather than eyeballed.
 *
 * ⚠️ NO JSX, NO HTML, NO MARKUP. Where a `<br>` or an inner `<span>` IS a colour boundary, the
 * element stays in the component and the two runs come here as separately-named keys. There
 * are three on this route: `intro.muted`/`intro.ink`, `benefits.headingInk`/`headingMuted`,
 * `security.headingMuted`/`headingPaper`.
 *
 * ⚠️ WHY AN EXPLICIT INTERFACE AND NOT `as const`, and this is not a style choice — `as const`
 * DOES NOT BUILD. With `as const`, `typeof product` is a tree of string LITERALS. `dictionary.ts`
 * declares `readonly product: typeof enProduct` and then assigns `he/product.ts`, which is
 * `Translated<ProductDict>` and therefore has `string` leaves. `string` is not assignable to
 * `"Eight Services, One Platform"`, so the Hebrew half of `DICTIONARIES` fails to type-check the
 * moment the namespace holds one non-empty string. Declaring the shape as an interface and
 * annotating the value widens every leaf up front, `typeof product` becomes that interface, and
 * `dictionary.ts` needs no edit. Proven with a standalone tsc probe; reported to the wave.
 *
 * It also buys the thing `as const` actively prevents: a `number` leaf that Hebrew may CHANGE.
 * `Translated<T>` passes numbers through unwidened, so a numeric literal under `as const` would
 * pin Hebrew to English's value. `workflows.pillWidths` is exactly that case.
 *
 * ARRAY TYPING, and it matters:
 *   · fixed-length TUPLE where the count is LAYOUT — a grid's cells, a stepper's four rows, the
 *     two `Line`s of mock 2's answer whose y coordinates are measured off the source bitmap.
 *     A locale supplying the wrong number must fail the build.
 *   · `readonly string[]` where the count is how the language happens to WRAP.
 * Every array on this route is the first kind. There is no hard-wrapped headline here: the two
 * `<br>` headings are two NAMED keys rather than an array, which is stronger — it forbids a
 * locale from inventing a third colour run.
 */

/* ── the shape ──────────────────────────────────────────────────────────────────────────── */

/** A `<h4>`/`<h6>` + body pair. Used by the workflow cards and the benefit cards. */
export interface TitledBody {
  readonly title: string;
  readonly body: string;
}

export interface ProductDict {
  readonly hero: {
    readonly headline: string;
    readonly subhead: string;
    readonly cta: string;
    /**
     * The typed phrases, FOUR of them. Tuple, because four is the spec: one per capability
     * family (agent follow-up, WhatsApp intake, call summaries, invoice chasing), and the
     * block reads as a survey of what clix does. The cycle itself is `% length`, so the
     * runtime would take any count — the tuple is what stops a locale quietly shipping three.
     *
     * ⚠️ THE TYPING LOOP IS PER CHARACTER, so these lengths set the PACE, not just the size.
     * See `TYPE_SPEED_MS` in ProductHero.tsx: the rate is derived from this array's mean
     * length so the phrase DURATION holds across locales.
     */
    readonly prompts: readonly [string, string, string, string];
    readonly a11y: {
      readonly attach: string;
      readonly submit: string;
    };
  };

  /** Block 2a's intro heading. ONE `<h3>`, TWO colours — the span boundary is the colour. */
  readonly intro: {
    readonly muted: string;
    /** ⚠️ LEADING SPACE IS LOAD-BEARING. It is the word gap across the colour boundary. */
    readonly ink: string;
  };

  readonly stepper: {
    readonly title: string;
    /** Four steps. The count is layout twice over: four 60px rows at ≥1200, four stacked
        panels below, and `Panel` switches on the index. */
    readonly steps: readonly [string, string, string, string];
  };

  /** The four animation panels inside the stepper. */
  readonly panels: {
    /**
     * Panel 01's source list. SEVEN, and the count is the cycle's length rather than a grid's,
     * but it is typed as a tuple anyway: the strip shows 3 of 7 and reads as a long list, so a
     * locale dropping to 5 would visibly shorten the loop.
     *
     * ⚠️ EACH IS `truncate` AT AN 88-UNIT LABEL INSET. The tightest measure is the phone tier's
     * 176px, so the LONGEST of these decides whether any of them clips. Measured, English's
     * longest sets 168.5px at 16px.
     */
    readonly sources: readonly [string, string, string, string, string, string, string];
    readonly citations: {
      /**
       * Panel 02's prose. ⚠️ IT HAS A MINIMUM LENGTH, not a maximum. The floating source card
       * is absolutely positioned at `top:24%` of this paragraph's own height, so a SHORTER
       * paragraph slides the card down over the very figure it cites. Five lines at the 470px
       * desktop measure is the floor. Lengthen freely; do not trim.
       */
      readonly prose: string;
      /** The highlighted figure. Appears TWICE — in the prose and in the card's cited cell —
          and the two must stay identical, which is why it is one key. */
      readonly date: string;
      /** Machine tokens in the card header. Latin in every locale: a record id, a system
          abbreviation and a quarter label. Listed here so a translator sees that they were
          considered and deliberately left. */
      readonly recordId: string;
      readonly system: string;
      readonly period: string;
      /** The citation chip's number. A numeral. */
      readonly marker: string;
    };
    readonly documents: {
      readonly prompt: string;
      readonly cta: string;
      readonly dropzone: string;
      readonly chip: string;
    };
  };

  readonly workflows: {
    /** Block 2d's `<h3>`. */
    readonly title: string;
    /** Three cards. The count is layout: `desktop:grid-cols-3`. */
    readonly cards: readonly [TitledBody, TitledBody, TitledBody];
    /**
     * ⚠️ TEN LABELS, SHARED BY TWO COMPONENTS, WHICH IS WHY THEY LIVE IN ONE PLACE.
     * `WorkflowsScroller` splits them 5 / 5 into its two opposed ticker rows; `benefitArt`'s
     * prompt stack renders the FIRST NINE as pills. Before this file they were two arrays in
     * two files with a comment begging the reader to keep them in step. Ten is layout on both
     * counts: 5 + 5 rows, and nine pills at measured y positions 12 + 38n.
     */
    readonly labels: readonly [
      string, string, string, string, string,
      string, string, string, string, string,
    ];
    /**
     * ⚠️ PILL WIDTHS IN benefitArt SOURCE UNITS, one per the FIRST NINE labels above, by index.
     *
     * They are here rather than in the component because they are a function of the STRING:
     * the label is `whitespace-nowrap` inside a pill that does not clip, so a width fitted to
     * one language is wrong for another. Numbers, not strings, so `Translated<>` lets Hebrew
     * differ — the reason this file declares an interface instead of using `as const`.
     *
     * THE FORMULA IS GEOMETRY, NOT A FIT. benefitArt puts the icon at x=10 w=14 and the label
     * at x=30, so the left inset is 30 source units and the right inset is 14.6; therefore
     *     w = 30 + advance + 14.6
     * where `advance` is the label's rendered width divided by the tier's `--prompt-u`, i.e.
     * tier-invariant by construction (fontSize is `u(12)`, so advance = em × 12 at every tier).
     * The English numbers below are NOT that line: they are the pre-i18n values, a
     * least-squares fit on HELVETICA advances, and they are kept byte-identical because the
     * English render must not move. See the report — they carry 13 to 24 units of slack.
     */
    readonly pillWidths: readonly [
      number, number, number, number, number,
      number, number, number, number,
    ];
    /** `sr-only` summary of the ticker. `interpolate()` template. Placeholder: {list} */
    readonly srShortcuts: string;
  };

  /** The three product-UI illustrations in block 2d. Chrome only — filenames, extensions,
      metric abbreviations and numerals stay Latin and stay in the component. */
  readonly mocks: {
    readonly workflow: {
      readonly title: string;
      readonly running: string;
      /** Four run steps on a measured 80-unit pitch. Tuple. */
      readonly steps: readonly [string, string, string, string];
      readonly syncing: string;
    };
    readonly table: {
      readonly question: string;
      readonly checked: string;
      /**
       * TWO explicit lines, not a wrapping paragraph — they are two `Line` primitives at
       * measured y 341 and 391, and the break is part of the reference. Tuple, so a locale
       * cannot add a third line the geometry has no room for.
       *
       * ⚠️ BOTH RUN PAST THE VISIBLE CROP ON PURPOSE. Mock 2 is the one crop that is
       * left-aligned, and its prose reaching out of frame is the composition. Measured:
       * English ends at source x 995 and 888 against a 820.6 window.
       */
      readonly answer: readonly [string, string];
      readonly colChannel: string;
      readonly colClosed: string;
      /** Three rows. The third is the dimmed one; the count is the measured 114-unit pitch. */
      readonly rows: readonly [string, string, string];
    };
    readonly material: {
      readonly assembling: string;
      /** Three lines at measured y 75.5 / 123.5 / 171.5 on a 48-unit pitch. Tuple. */
      readonly prose: readonly [string, string, string];
      readonly exportsLabel: string;
      /** Two export rows. ⚠️ The `.pptx` / `.xlsx` extensions stay Latin — they are keyed to
          the P and X badges beside them and stop making sense without them. Only the stem
          translates. */
      readonly exports: readonly [string, string];
    };
  };

  readonly dataPartners: {
    readonly title: string;
    readonly intro: string;
  };

  readonly benefits: {
    /** `<h3>`, two colour runs across the original's own `<br>`. Two named keys, not an
        array: the break IS the colour boundary and neither run may grow a third. */
    readonly headingInk: string;
    readonly headingMuted: string;
    /**
     * Six cards. ⚠️ EACH BODY SITS IN A FIXED 84px WELL PINNED TO `flex-end`, so a longer body
     * CLIPS rather than growing the card (every card is `aspect-ratio: 0.788044`). At
     * 14px/130% that is 4 lines, measured against the narrowest tier's 326px text column.
     */
    readonly cards: readonly [
      TitledBody, TitledBody, TitledBody,
      TitledBody, TitledBody, TitledBody,
    ];
    /** Card 5's illustration is a mock governance dashboard and carries its own labels. The
        five bar FILL lengths are measured off the source SVG and are NOT localised. */
    readonly governance: {
      readonly statUsers: string;
      readonly statQueries: string;
      readonly topSources: string;
      readonly sources: readonly [string, string, string, string, string];
    };
  };

  readonly security: {
    readonly eyebrow: string;
    /** `<h2>`, two colour runs across a `<br>`. Same contract as `benefits` above. */
    readonly headingMuted: string;
    readonly headingPaper: string;
    /** Four practice statements, one per glyph. Tuple — the glyphs are positional. */
    readonly list: readonly [string, string, string, string];
    /**
     * The 2 × 2 badge grid's labels. FOUR, and the count is hand-authored dashed-border
     * geometry: growing it would mean re-deriving every cell edge at every tier.
     *
     * ⚠️ EACH SITS IN A 137px MEASURE ABOVE A CENTRED 104px MARK. Three lines collides with the
     * mark at the phone tier's 220px cell, so two is the ceiling. Measured, both locales clear.
     */
    readonly badges: readonly [string, string, string, string];
    readonly link: string;
  };

  readonly testimonials: {
    /**
     * Six clients. The count is content, but it is a tuple because the two tiers must agree on
     * WHO and in WHAT ORDER — the phone stack reuses these strings by index.
     *
     * ⚠️⚠️ EVERY `quote` IS A PLACEHOLDER ATTRIBUTED TO A REAL, NAMED PERSON. Read the warning
     * block at the top of ProductTestimonials.tsx before touching one. The
     * `[PLACEHOLDER QUOTE, NOT SOMETHING X SAID]` tag is the mechanism that keeps the route's
     * `noindex` justified, and it is preserved in BOTH locales.
     */
    readonly slides: readonly [
      TestimonialCopy, TestimonialCopy, TestimonialCopy,
      TestimonialCopy, TestimonialCopy, TestimonialCopy,
    ];
    /**
     * ⚠️ THE PHONE TIER CARRIES DIFFERENT COPY FOR SLOT 1, and that is the capture's own quirk,
     * not a truncation: the original ships a different sentence at ≤809. Only slot 1 differs;
     * cards 2 to 6 reuse their slide's string, which is what the original does too. Hence one
     * key rather than a parallel six.
     */
    readonly phoneLeadQuote: string;
    readonly a11y: {
      readonly controls: string;
      /** `interpolate()` template. Placeholders: {name} {role} */
      readonly portraitAlt: string;
    };
  };
}

export interface TestimonialCopy {
  readonly quote: string;
  readonly name: string;
  /** May be empty: `elyashiv-engineering` is a COMPANY, not a person, so it has no job title
      rather than an invented one. The component holds the line box open with an `aria-hidden`
      non-breaking space. */
  readonly role: string;
}

/* ── the English copy ───────────────────────────────────────────────────────────────────── */

export const product: ProductDict = {
  hero: {
    headline: "Eight Services, One Platform",
    subhead:
      "AI agents, automations, CRM and custom software, built as one system around how your team already works",
    /* Curly apostrophe, U+2019. The component said `Let&rsquo;s start`; this is the same
       codepoint, and `whitespace-pre` in a `min-content` anchor means it cannot wrap. */
    cta: "Let’s start",
    prompts: [
      "follow up with every lead from friday",
      "route every whatsapp inquiry to the right person",
      "turn every sales call into a written summary",
      "send and chase invoices without me",
    ],
    a11y: {
      attach: "Attach files",
      submit: "Submit prompt",
    },
  },

  intro: {
    muted: "Every business runs on a hundred handoffs nobody owns,",
    ink: " Clix builds the quiet systems that remove them.",
  },

  stepper: {
    title: "One Integrated Platform Built to Run Your Whole Business",
    steps: [
      "All your systems in one place",
      "Every answer shows its source",
      "Automate your workflows",
      "Ask questions of your documents",
    ],
  },

  panels: {
    sources: [
      "WhatsApp conversations",
      "Website forms",
      "Connected CRM records",
      "Email threads",
      "Spreadsheets, reports",
      "Calendars, meeting notes",
      "Invoices and receipts",
    ],
    citations: {
      prose:
        "The order was confirmed in the WhatsApp thread and matches the invoice raised in the same week, so the account is settled and nothing on it is outstanding. The customer has now asked to move the next shipment and wants the new date in writing. According to the order record in the CRM, the agreed delivery date is",
      date: "14 April",
      recordId: "4182",
      system: "CRM",
      period: "Q2 2026",
      marker: "2",
    },
    documents: {
      prompt: "Check the attached invoice",
      cta: "Ask Clix",
      /* The component said `Drag &amp; drop`; the entity resolves to a literal ampersand. */
      dropzone: "Drag & drop to attach content",
      chip: "Client files",
    },
  },

  workflows: {
    /* `Connect Your Stack &amp; Automate The Work` in the component — one literal `&`. */
    title: "Connect Your Stack & Automate The Work",
    cards: [
      {
        title: "Automations Built To Fit",
        body:
          "We map the process your team already runs, then automate it end to end across the " +
          "tools you already own. Webhooks, middleware and error handling come with it, so a " +
          "step that breaks upstream is caught and retried, never silently lost.",
      },
      {
        title: "Ask Your Own Data",
        body:
          "Your CRM, your spreadsheets and your billing in one table you can sort, filter and " +
          "update as the day moves. Ask it a question in plain language and get an answer you " +
          "can trace back to the record.",
      },
      {
        title: "Reports On Demand",
        body:
          "Decks, summaries and spreadsheets built from the same data your team works in. The " +
          "numbers stay consistent, the template stays yours, and the source file ships " +
          "alongside every export.",
      },
    ],
    labels: [
      /* Rows 1 and 2 of the ticker, five each, in the capture's own order. */
      "Lead Intake and Routing",
      "Appointment Booking",
      "Quote Follow Up",
      "Invoice Reconciliation",
      "Call Summary and Tagging",
      "Customer Onboarding",
      "WhatsApp Support Triage",
      "Weekly Ops Report",
      "Renewal Reminders",
      /* The tenth is the ticker's only extra: the pill stack renders the first nine. */
      "Document Collection",
    ],
    pillWidths: [185, 167, 140, 169, 200, 171, 193, 156, 160],
    srShortcuts: "Saved workflow shortcuts: {list}.",
  },

  mocks: {
    workflow: {
      title: "Qualify Inbound WhatsApp Leads",
      running: "Running workflow...",
      steps: [
        "Reading new messages",
        "Checking the CRM",
        "Scoring against your rules",
        "Drafting reply",
      ],
      syncing: "Syncing to the CRM...",
    },
    table: {
      question: "Which lead sources actually closed deals?",
      checked: "Checked 4 systems",
      answer: [
        "WhatsApp inbound closed the most deals last quarter, and",
        "paid search brought the fewest at the highest cost.",
      ],
      colChannel: "Channel",
      colClosed: "% of Pipeline Closed",
      rows: ["WhatsApp inbound", "Events", "Paid search"],
    },
    material: {
      assembling: "Assembling the deck...",
      prose: [
        "Here is your deck. I built it",
        "on your own template, and attached",
        "the source numbers behind every slide.",
      ],
      exportsLabel: "Exports (2)",
      exports: ["Automation Rollout.pptx", "Workflow Run Backup.xlsx"],
    },
  },

  dataPartners: {
    title: "Tools We Build With",
    intro:
      "We build on the tools your team already opens every day. Voice, chat, documents, " +
      "spreadsheets and calendars connect into one system, so the automation lands where " +
      "people already work, not in a new place they have to learn.",
  },

  benefits: {
    headingInk: "One Platform That Learns",
    headingMuted: "How Your Team Works",
    cards: [
      {
        title: "Integrations",
        body:
          "Connect the payments, accounting, marketing and support tools you already run. We " +
          "wire them into one stack, with webhooks, middleware and monitoring.",
      },
      {
        title: "Ready Workflows",
        body:
          "Choose from a library of built workflows aimed at automating the jobs your team " +
          "repeats every week, end to end.",
      },
      {
        title: "Guided Implementation",
        body:
          "White-glove engagement and implementation with our Tel Aviv team of Unit 8200 and " +
          "Technion alumni.",
      },
      {
        title: "Custom-Trained Models",
        body:
          "Models trained on your own data, your tone of voice and your processes, so every " +
          "agent answers the way your best person would, at your standard.",
      },
      {
        title: "Governance & Permissions",
        body:
          "Granular permission controls, role-based access management, comprehensive audit " +
          "trails, and customizable governance policies, so every agent acts inside the limits " +
          "you set.",
      },
      {
        title: "Single Tenant Deployment",
        body: "Run it in our cloud or inside yours, on the security terms your business sets.",
      },
    ],
    governance: {
      statUsers: "Active Users",
      statQueries: "Queries",
      topSources: "Top data sources",
      sources: ["WhatsApp", "CRM Records", "Web Forms", "Invoices", "File Library"],
    },
  },

  security: {
    eyebrow: "Security",
    headingMuted: "Built for your cloud",
    headingPaper: "Secure by Design",
    list: [
      "No training on your data",
      "Modern & secure data practices",
      "End to end encryption",
      "Reviewed & tested",
    ],
    /* ⚠️ THESE FOUR ARE PRACTICE STATEMENTS, NOT CERTIFICATIONS, AND THE DIFFERENCE IS THE
       POINT. The cells shipped as SOC2 / CCPA / ISO 27001 / GDPR until 2026-08-12 and were
       replaced because clix holds none of the audited ones — see the header of
       ProductSecurity.tsx. Do not put a seal back in either locale. */
    badges: [
      "Your cloud, your accounts",
      "Your data stays yours",
      "Least-privilege access",
      "You own the code",
    ],
    link: "Find out more",
  },

  testimonials: {
    slides: [
      {
        quote:
          "[PLACEHOLDER QUOTE, NOT SOMETHING ASAF PERETZ SAID] clix holds no written testimonial " +
          "from this client and no wording has been approved. This paragraph is scaffolding, set " +
          "at roughly the length a real quote will run, and it is here to be deleted the moment " +
          "an approved sentence replaces it.",
        name: "Asaf Peretz",
        role: "Founder, SalesIQ",
      },
      {
        quote:
          "[PLACEHOLDER QUOTE, NOT SOMETHING ADIR PERETZ SAID] No approved wording exists for this " +
          "client yet. This filler runs to about the length the real one should.",
        name: "Adir Peretz",
        role: "Owner, video and photography studio",
      },
      {
        quote:
          "[PLACEHOLDER QUOTE, NOT SOMETHING NEVO YAHALOMAN SAID] Nothing on this card was said " +
          "by this client. The words are layout scaffolding and must be replaced before launch.",
        name: "Nevo Yahaloman",
        role: "Founder",
      },
      {
        quote:
          "[PLACEHOLDER QUOTE, NOT SOMETHING NOAM TOVI SAID] Placeholder text standing in for a " +
          "sentence this client has never been asked for. Replace before launch.",
        name: "Noam Tovi",
        role: "Owner, investments",
      },
      {
        quote:
          "[PLACEHOLDER QUOTE, NOT SOMETHING ACHITUV SAID] Placeholder text standing in for a " +
          "sentence this client has never been asked for. Replace before launch.",
        name: "Achituv",
        role: "Vtechezena",
      },
      {
        quote:
          "[PLACEHOLDER QUOTE, NOT SOMETHING ELYASHIV ENGINEERING SAID] Placeholder text standing " +
          "in for a sentence this client has never been asked for. Replace before launch.",
        name: "Elyashiv Engineering",
        role: "",
      },
    ],
    /* ⚠️ STRAIGHT apostrophes in `card's` and `client's`, where `hero.cta` above has a CURLY
       one. That inconsistency is the component's own and it is the verbatim value — a
       mechanical check against the pre-change source caught a "tidied" curly pair here. Do not
       harmonise them. */
    phoneLeadQuote:
      "[PLACEHOLDER QUOTE, NOT SOMETHING ASAF PERETZ SAID] This is the phone card's own " +
      "string, kept separate because the original ships different copy at this width. It is " +
      "not a shortened version of the slide above, and it is not this client's wording " +
      "either. Replace both before this route is indexed.",
    a11y: {
      controls: "Slideshow pagination controls",
      portraitAlt: "{name}, {role}",
    },
  },
};
