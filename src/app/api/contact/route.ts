/**
 * POST /api/contact — takes the /contact form and delivers it, over one or two channels.
 *
 * Spec: features/contact-page/FEATURE.md
 *
 * ⚠️ THERE ARE TWO CHANNELS NOW, AND THEY ARE INDEPENDENT (2026-08-18).
 *
 *   gmail   the notification mail to the business. What this file did originally.
 *   n8n     an HTTP POST to an n8n webhook, which puts the lead in the CRM and opens a
 *           WhatsApp thread with them. That workflow — "Clix Main Website - Form Submit" —
 *           is what needs the `phone` field this form did not used to collect.
 *
 * Each is switched on by its own environment, each gets the same validated submission, and they
 * run CONCURRENTLY rather than in sequence: they share no state, and serialising them would put
 * an SMTP round trip in front of the webhook for no reason.
 *
 * ⚠️ A FAILURE IN EITHER ENABLED CHANNEL FAILS THE REQUEST. Deliberate, and chosen by the user
 * over the more forgiving "succeed if anything got through" (2026-08-18). The cost is real and
 * should be stated: once both channels are live, a flaky webhook will show the visitor an error
 * for a submission whose email did arrive, and they may well send it twice. The reason it is
 * still right is that the alternative — a green tick when the CRM never heard about the lead —
 * is a lost enquiry that nobody ever finds out about. Loud beats lossy. If this proves annoying
 * in practice, the change is one condition in `deliver()` below, not a redesign.
 *
 * ⚠️ IF NO CHANNEL IS ENABLED THIS ROUTE 500s RATHER THAN QUIETLY ACCEPTING THE FORM. A route
 * that validates a submission, answers `{ok:true}` and does nothing with it is the exact
 * failure this file's original header called out. Turning both switches off is a misconfigured
 * deploy, and it should be as loud as a missing password.
 *
 * THE SECOND ROUTE HANDLER IN THIS PROJECT. src/app/api/models/route.ts says in its own header
 * that it is "the only route handler in the project" and that "every page stays static; this one
 * path needs a Node runtime". That is now two paths, for the same reason: sending mail needs a
 * socket, so it cannot happen during a static render.
 *
 * ⚠️ WHY nodemailer IS THE FIRST RUNTIME DEPENDENCY THIS PROJECT HAS ADDED. It went from five
 * to six. src/lib/i18n/format.ts records the standing posture — a runtime dependency serving
 * two strings was rejected in "a five-dependency project whose CONTEXT.md records rejecting
 * `experimental.viewTransition` twice on stability grounds". The bar is cleared here because
 * the user chose Gmail SMTP as the channel (2026-08-13, over an n8n webhook and over a
 * transactional provider) and Node cannot speak SMTP without a client. It is server-only and
 * reaches no browser bundle.
 *
 * ⚠️ GMAIL NEEDS AN APP PASSWORD, NOT THE ACCOUNT PASSWORD. Google has not accepted the account
 * password over SMTP since 2022. The sending account must have 2-Step Verification on, and the
 * 16-character value from Google Account -> Security -> App passwords is what goes in
 * GMAIL_PASSWORD. Spaces in it are stripped below, because Google displays it in four groups of
 * four and it gets pasted that way.
 *
 * ENVIRONMENT (Vercel project settings, and .env for development — .gitignore already covers
 * `.env*`, so none of this is ever committed):
 *
 *   GMAIL_EMAIL         the sending mailbox, e.g. clixteam579@gmail.com
 *   GMAIL_PASSWORD      the 16-character app password
 *   CONTACT_TO          optional. Defaults to CONTACT_EMAIL from src/lib/contact.ts, which is
 *                       info@clix-solution.com.
 *   CONTACT_GMAIL       optional. Set to "off" to STOP SENDING MAIL while leaving every
 *                       credential in place. See the note below — this is a temporary switch.
 *   N8N_WEBHOOK_URL     the workflow's production URL. Unset = the n8n channel is off, which is
 *                       what every deploy looked like before 2026-08-18.
 *   N8N_WEBHOOK_SECRET  optional but strongly wanted. Sent as the `x-clix-token` header, which
 *                       the webhook node checks with a Header Auth credential. Without it the
 *                       URL is the only secret, and anyone who ever sees it can post fake leads
 *                       straight into the CRM.
 *
 * ⚠️ `CONTACT_GMAIL=off` IS A TEMPORARY TESTING SWITCH, NOT AN ARCHITECTURE. It exists because
 * the user asked for email silenced while the n8n path was being tested (2026-08-18), and the
 * honest way to do that is one env line rather than commented-out code that someone later
 * un-comments wrong. THE INTENDED STEADY STATE IS BOTH CHANNELS ON. Deleting the line from the
 * environment is the whole of turning mail back on; nothing here needs editing. Any value other
 * than "off" (case-insensitive) leaves Gmail enabled, so a typo fails towards sending.
 *
 * ⚠️ TWO NAMES ARE ACCEPTED FOR EACH, AND THAT IS NOT INDECISION. `GMAIL_EMAIL` /
 * `GMAIL_PASSWORD` are the names already present in this repo's `.env` when the form was built
 * (2026-08-13) — the user had provisioned the mailbox before there was anything to send from
 * it. `GMAIL_USER` / `GMAIL_APP_PASSWORD` are nodemailer's and Google's own vocabulary and are
 * what almost every deployment guide writes. Reading both means the existing .env works
 * untouched AND a future deploy configured from documentation also works. The pairs are read
 * in that order.
 *
 * If a mailbox or a password is missing, this route answers 500 and logs which one — a
 * misconfigured deploy should be loud, not a form that silently swallows enquiries.
 *
 * ⚠️ THE VALIDATION HERE IS THE ONE THAT COUNTS. ContactForm.tsx runs the same rules so a typo
 * does not cost a round trip, but a client check is a courtesy and this one is the boundary.
 * Both must move together; the bounds are listed in one block below for that reason.
 *
 * WHAT IS DELIBERATELY NOT HERE: no captcha (a honeypot and a rate limit are proportionate to a
 * contact form on a small site, and a captcha is a tax on every real visitor), no database (the
 * inbox IS the record), and no autoresponder to the submitter (that is a second deliverability
 * problem and nobody asked for one).
 */

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { CONTACT_EMAIL } from "@/lib/contact";

/* Sending mail needs a TCP socket, which the edge runtime does not have. */
export const runtime = "nodejs";
/* Nothing here is cacheable and every request must actually run. Without this, a POST handler
   in an otherwise fully-static app is the kind of thing a build-time optimiser reasons about. */
export const dynamic = "force-dynamic";

/* ── the closed vocabularies ──────────────────────────────────────────────────────────────
   Re-declared here rather than imported from src/lib/i18n/en/contact.ts on purpose. A locale
   dictionary is copy; this is an allow-list at a trust boundary, and the two should not be able
   to widen each other. They are checked against each other by hand — if you add an option,
   both files change. */
const NEED_IDS = [
  "ai-agents",
  "whatsapp",
  "crm",
  "integrations",
  "custom-software",
  "consulting",
] as const;

const BUDGET_IDS = ["upto-10k", "15-25k", "25-75k", "75k-plus"] as const;

/* Human-readable, English-only, for the notification body. This is an internal mail to the
   business, not site UI, so it is deliberately not a dictionary concern — and it means one
   inbox reads the same whichever language the visitor filled the form in. */
const NEED_LABELS: Record<(typeof NEED_IDS)[number], string> = {
  "ai-agents": "AI agents",
  whatsapp: "WhatsApp",
  crm: "CRM",
  integrations: "Integrations",
  "custom-software": "Custom software",
  consulting: "Consulting",
};

const BUDGET_LABELS: Record<(typeof BUDGET_IDS)[number], string> = {
  "upto-10k": "Up to ₪10k",
  "15-25k": "₪15k – ₪25k",
  "25-75k": "₪25k – ₪75k",
  "75k-plus": "₪75k+",
};

/* ── bounds · MIRRORED IN ContactForm.tsx ─────────────────────────────────────────────── */
const LIMITS = {
  nameMax: 120,
  emailMax: 200,
  phoneMax: 40,
  /* Counted in DIGITS. 40 characters so "+972 (50) 000-0000" fits; 7–20 digits because that is
     what makes a number a number once the formatting is stripped. */
  phoneDigitsMin: 7,
  phoneDigitsMax: 20,
  shortMax: 120,
  messageMin: 10,
  messageMax: 4000,
} as const;

/* Permissive by design: one @, something either side, a dot in the domain, no whitespace. A
   stricter pattern rejects real addresses, and the only test that settles whether an address
   exists is sending to it. Same regex client-side. */
const EMAIL_RE = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;

/* Same posture for phone, and for the same reason: every country writes numbers differently, and
   the only thing that settles whether one reaches a person is messaging it — which is n8n's job,
   downstream of here. Two rules: the allowed character set, and a plausible digit count. */
const PHONE_ALLOWED_RE = /^[+()\-.\s\d]+$/;
const phoneDigits = (value: string) => value.replace(/\D/g, "").length;

/**
 * Best-effort E.164, sent ALONGSIDE the number as typed and never instead of it.
 *
 * ⚠️ THIS DELIBERATELY DOES NOT GUESS A COUNTRY CODE. Stripping formatting is safe; deciding
 * that a bare "050 000 0000" means +972 is not — it is a guess that turns an Israeli number into
 * an un-messageable one the moment a visitor from anywhere else fills the form, and it fails
 * silently. So: keep a leading `+` if the visitor typed one, keep the digits, and leave national
 * numbers un-prefixed for the n8n workflow to resolve, where the rule is visible and fixable by
 * whoever owns the CRM. `phone` (as typed) is always in the payload for exactly this reason.
 */
function toE164(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits) return null;
  return value.trim().startsWith("+") ? `+${digits}` : digits;
}

/* ── rate limit ───────────────────────────────────────────────────────────────────────────
   In-process, and BEST EFFORT ONLY — say so rather than imply a guarantee. On Vercel each
   serverless instance has its own module scope, so a cold start resets this and concurrent
   instances do not share it. What it reliably stops is the same client submitting the same form
   twenty times in a row, which is the realistic abuse for a contact form. Anything stronger
   means Redis or a KV store, i.e. infrastructure, and that is a decision for when there is
   evidence it is needed. */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);

  /* Keep the map from growing without bound on a long-lived instance. Cheap because it only
     runs on a successful admission, and the map only ever holds one array per client. */
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

/* ── helpers ─────────────────────────────────────────────────────────────────────────────── */

/** Trim, and collapse the runs of whitespace a paste tends to bring with it. */
function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Escape for the HTML mail body. EVERY value below goes through this.
 *
 * ⚠️ NOT OPTIONAL AND NOT PARANOIA. The body is a string this route concatenates from data a
 * stranger typed, rendered by a mail client that runs HTML. Unescaped, a `message` field
 * containing markup becomes markup in the recipient's inbox — a phishing link wearing the
 * company's own notification email as a costume. The `text` alternative below needs no
 * escaping, which is a reason to prefer reading that one.
 */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Strip CR and LF from anything that lands in a HEADER.
 *
 * ⚠️ THIS IS HEADER INJECTION DEFENCE, NOT TIDYING. `replyTo` and `subject` are headers, and a
 * header is newline-delimited: a name of "Bob\nBcc: someone@else.example" would otherwise add a
 * recipient nobody chose. nodemailer guards much of this itself; a boundary should not depend on
 * a library's internals for a two-line fix.
 */
function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").slice(0, 200);
}

/* One transport, reused across invocations on a warm instance — a fresh SMTP handshake per
   submission is a wasted round trip. Built lazily so importing this module never needs the
   environment, which is what keeps the build from caring about it. */
let transport: nodemailer.Transporter | null = null;

function getTransport(user: string, pass: string) {
  if (!transport) {
    transport = nodemailer.createTransport({
      /* `service: "gmail"` resolves to smtp.gmail.com:465 over TLS. Named rather than spelled
         out so that if Google moves a port, nodemailer's own table is what changes. */
      service: "gmail",
      auth: { user, pass },
    });
  }
  return transport;
}

/* n8n's webhook node on this workflow responds "Immediately", so it answers as soon as it has
   the request — a slow reply means something is wrong, not that something is thinking. Ten
   seconds is generous for that and still far inside any serverless execution limit. */
const WEBHOOK_TIMEOUT_MS = 10_000;

/**
 * POST the submission to the n8n webhook.
 *
 * ⚠️ THROWS ON ANYTHING BUT 2xx, AND THE THROWN MESSAGE IS THE DIAGNOSIS. n8n's own status codes
 * are unusually informative here and are worth keeping rather than flattening into "failed":
 *
 *   404  the workflow is DEACTIVATED, or the path is wrong. By far the most likely one — an
 *        inactive workflow's production URL does not exist, and deactivating is a single click.
 *   403  the `x-clix-token` header did not match the webhook's Header Auth credential.
 *   405  the webhook node is not set to POST. It defaults to GET when a node is first added.
 *
 * The response body is appended because n8n words those cases plainly. It is truncated: this is
 * an error path, and an HTML error page from a reverse proxy in front of n8n would otherwise put
 * a whole document in the log.
 */
async function postToWebhook(url: string, payload: unknown): Promise<void> {
  /* Read here rather than passed in: it is a credential, and it has no business being carried
     through the request handler alongside the visitor's data. Absent = no header, which the
     webhook accepts only while its Header Auth is off. */
  const secret = (process.env.N8N_WEBHOOK_SECRET ?? "").trim();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret ? { "x-clix-token": secret } : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `n8n webhook responded ${response.status}. ${detail.slice(0, 300)}`.trim(),
    );
  }
}

type FieldErrors = Record<string, string>;

export async function POST(request: Request) {
  /* 1 · shape. A form post that is not JSON is not this form. */
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "Expected application/json." },
      { status: 415 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed JSON." }, { status: 400 });
  }
  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json({ ok: false, error: "Malformed body." }, { status: 400 });
  }
  const body = payload as Record<string, unknown>;

  /* 2 · the honeypot. Answer 200, not 400: a bot that learns which requests are rejected
     learns how to pass. From its side this looks exactly like a successful send, and no mail
     goes anywhere. */
  if (clean(body.website)) {
    console.warn("[contact] honeypot tripped; dropping submission");
    return NextResponse.json({ ok: true });
  }

  /* 3 · rate limit. `x-forwarded-for` is a list; the client is the first entry. It is
     spoofable in general and is not spoofable past Vercel's proxy, which appends. */
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Try again shortly." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  /* 4 · validate. The messages here are for a log and for the client's mapping table, never for
     display — ContactForm.tsx renders this locale's wording for the same rule. */
  const name = clean(body.name);
  const email = clean(body.email);
  const phone = clean(body.phone);
  const company = clean(body.company);
  const role = clean(body.role);
  const message = clean(body.message);

  const fields: FieldErrors = {};
  if (!name) fields.name = "required";
  else if (name.length > LIMITS.nameMax) fields.name = "too long";

  if (!email) fields.email = "required";
  else if (email.length > LIMITS.emailMax || !EMAIL_RE.test(email))
    fields.email = "invalid";

  /* Required as of 2026-08-18. A submission with no phone cannot be WhatsApped, which is half
     of what the n8n workflow exists to do — so it is a blocking rule here, not a hint. */
  if (!phone) fields.phone = "required";
  else if (
    phone.length > LIMITS.phoneMax ||
    !PHONE_ALLOWED_RE.test(phone) ||
    phoneDigits(phone) < LIMITS.phoneDigitsMin ||
    phoneDigits(phone) > LIMITS.phoneDigitsMax
  )
    fields.phone = "invalid";

  if (company.length > LIMITS.shortMax) fields.company = "too long";
  if (role.length > LIMITS.shortMax) fields.role = "too long";

  /* Optional as of 2026-08-19 (user's call) — mirrored in ContactForm.tsx. Only the ceiling
     blocks; `messageMin` stays in LIMITS because the client's counter colour still reads it. */
  if (message.length > LIMITS.messageMax) fields.message = "too long";

  /* Consent, added 2026-08-18 with the checkbox on the form. STRICTLY `true` — a string
     "false", a 0 or an absent key are all refusals, and only a client that actually collected
     the tick sends the boolean. The form disables its own button until the box is ticked, so
     reaching this is either a tampered request or a client that has drifted; both are exactly
     what this route exists to catch.

     ⚠️ `consent` IS NOT ONE OF THE SIX FIELD KEYS THE CLIENT MAPS. ContactForm.tsx's 400
     handler filters the `fields` object against its own `FIELD_ORDER` and drops anything it
     does not recognise, so this key surfaces as the whole-form summary rather than as a message
     under a text input — which is right, because there is no text input to put it under. */
  if (body.consent !== true) fields.consent = "required";

  /* The two pill groups. Unknown ids are DROPPED rather than rejected: they are optional
     metadata, and a stale client that posts a retired id should still get its enquiry through.
     A bad `name` blocks the send; a bad `budget` does not. */
  const needs = Array.isArray(body.needs)
    ? (body.needs.filter(
        (n): n is (typeof NEED_IDS)[number] =>
          typeof n === "string" && (NEED_IDS as readonly string[]).includes(n),
      ) as (typeof NEED_IDS)[number][])
    : [];
  const budget =
    typeof body.budget === "string" &&
    (BUDGET_IDS as readonly string[]).includes(body.budget)
      ? (body.budget as (typeof BUDGET_IDS)[number])
      : null;

  if (Object.keys(fields).length > 0) {
    return NextResponse.json({ ok: false, error: "Validation failed.", fields }, { status: 400 });
  }

  /* 5 · channels and configuration. Checked after validation so a misconfigured deploy does not
     mask a bad request, and logged specifically so the fix is obvious from the log line alone. */

  /* ANY value but "off" leaves mail enabled. A typo in this variable should fail towards
     sending rather than towards a form that silently stops mailing anyone. */
  const gmailOn =
    (process.env.CONTACT_GMAIL ?? "").trim().toLowerCase() !== "off";
  const webhookUrl = (process.env.N8N_WEBHOOK_URL ?? "").trim();
  const n8nOn = webhookUrl.length > 0;

  /* Either name, this order — see the header. */
  const user = process.env.GMAIL_EMAIL || process.env.GMAIL_USER;
  /* Google prints the app password in four groups of four and it gets pasted that way. */
  const pass = (
    process.env.GMAIL_PASSWORD ||
    process.env.GMAIL_APP_PASSWORD ||
    ""
  ).replace(/\s+/g, "");
  const to = process.env.CONTACT_TO || CONTACT_EMAIL;

  /* One object rather than three loose values, because it is also the narrowing: everything
     below reads `gmail` and TypeScript knows the credentials are present wherever it is not
     null. The alternative is a non-null assertion at the send site, which is a claim rather
     than a check. */
  const gmail = gmailOn && user && pass ? { user, pass, to } : null;

  /* Both switches off — nothing downstream would ever see this submission, so it must not be
     accepted. See the header. */
  if (!gmailOn && !n8nOn) {
    console.error(
      '[contact] cannot deliver: every channel is disabled. CONTACT_GMAIL is "off" AND ' +
        "N8N_WEBHOOK_URL is unset, so this submission would be validated and then dropped. " +
        "Remove CONTACT_GMAIL to send mail again, or set N8N_WEBHOOK_URL.",
    );
    return NextResponse.json(
      { ok: false, error: "Contact delivery is not configured." },
      { status: 500 },
    );
  }

  /* Only when Gmail is actually going to run. With CONTACT_GMAIL=off, a deploy holding no SMTP
     credentials at all is a valid configuration rather than a broken one. */
  if (gmailOn && !gmail) {
    console.error(
      "[contact] cannot send: missing " +
        [
          !user && "GMAIL_EMAIL (or GMAIL_USER)",
          !pass && "GMAIL_PASSWORD (or GMAIL_APP_PASSWORD)",
        ]
          .filter(Boolean)
          .join(" and ") +
        ". Set them in .env for development and in the Vercel project settings for deploys.",
    );
    return NextResponse.json(
      { ok: false, error: "Mail is not configured." },
      { status: 500 },
    );
  }

  /* 6 · compose. `locale` is whatever the page's <html lang> was; it is a hint for whoever
     replies, so an unexpected value is reported rather than trusted. */
  const locale = clean(body.locale) === "he" ? "Hebrew" : "English";
  const submittedAt = new Date().toISOString();
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Company", company || "—"],
    ["Role", role || "—"],
    ["Relevant", needs.length ? needs.map((n) => NEED_LABELS[n]).join(", ") : "—"],
    ["Budget", budget ? BUDGET_LABELS[budget] : "—"],
  ];

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    message || "—",
    "",
    "—",
    `Filled in: ${locale}`,
    `Submitted: ${submittedAt}`,
    `IP: ${ip}`,
    `User agent: ${userAgent}`,
  ].join("\n");

  /* Plain, deliberately. This lands in a working inbox and is read for its content; a designed
     HTML mail would be one more thing to keep in step with the site for no gain. Every
     interpolation is escaped — see esc(). */
  const html = [
    '<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#151515">',
    "<table cellpadding='0' cellspacing='0' style='border-collapse:collapse'>",
    ...rows.map(
      ([label, value]) =>
        `<tr><td style="padding:2px 16px 2px 0;color:#737373">${esc(label)}</td>` +
        `<td style="padding:2px 0"><strong>${esc(value)}</strong></td></tr>`,
    ),
    "</table>",
    "<p style='margin:16px 0 4px;color:#737373'>Message</p>",
    /* The one multi-line value, so it is the one that needs its newlines turned into breaks. */
    `<p style="margin:0;white-space:pre-wrap">${esc(message || "—")}</p>`,
    "<hr style='border:none;border-top:1px solid #e5e5e5;margin:20px 0'>",
    `<p style="margin:0;color:#737373;font-size:12px">Filled in: ${esc(locale)}<br>` +
      `Submitted: ${esc(submittedAt)}<br>IP: ${esc(ip)}<br>User agent: ${esc(userAgent)}</p>`,
    "</div>",
  ].join("");

  /* ── the webhook payload ────────────────────────────────────────────────────────────────
     Structured, and pointedly NOT the composed mail: n8n needs fields it can map onto CRM
     columns, not prose it would have to take apart again. IDS AND LABELS BOTH — the ids are the
     stable contract a workflow should branch on, the labels save it from restating this file's
     vocabulary and drifting from it. Optional text fields are `null` rather than "", so an
     empty company is absent in the CRM rather than being an empty string in it. */
  const webhookPayload = {
    source: "clix-website",
    form: "contact",
    submittedAt,
    /* The id here, not the English word the mail uses — a workflow branches on "he", not on
       "Hebrew". */
    locale: clean(body.locale) === "he" ? "he" : "en",
    name,
    email,
    phone,
    phoneE164: toE164(phone),
    company: company || null,
    role: role || null,
    needs,
    needLabels: needs.map((n) => NEED_LABELS[n]),
    budget,
    budgetLabel: budget ? BUDGET_LABELS[budget] : null,
    /* `null` rather than "" when empty, matching `company` and `role` above: an absent brief
       should be absent in the CRM. Optional since 2026-08-19. */
    message: message || null,
    /* Always `true` — validation above rejects anything else — and sent anyway, because the
       useful thing about a consent flag is having it recorded beside the record it applies to.
       The CRM should be able to answer "did they accept the terms, and when" from the row
       itself; `submittedAt` above is the "when". */
    consent: true,
    meta: { ip, userAgent },
  };

  /* 7 · deliver, over every enabled channel at once. */
  const tasks: { channel: string; run: () => Promise<void> }[] = [];

  if (gmail) {
    tasks.push({
      channel: "gmail",
      run: async () => {
        await getTransport(gmail.user, gmail.pass).sendMail({
          /* The display name is ours and the address MUST be the authenticated mailbox — Gmail
             rewrites or rejects a From it does not own, so putting the visitor's address here
             would either fail or arrive as a forgery. Their address goes in Reply-To, which is
             what makes hitting reply work. */
          from: `"Clix website" <${gmail.user}>`,
          to: gmail.to,
          replyTo: `"${headerSafe(name).replace(/"/g, "")}" <${headerSafe(email)}>`,
          subject: headerSafe(
            `New enquiry — ${name}${company ? `, ${company}` : ""}`,
          ),
          text,
          html,
        });
      },
    });
  }

  if (n8nOn) {
    tasks.push({
      channel: "n8n",
      run: () => postToWebhook(webhookUrl, webhookPayload),
    });
  }

  /* `allSettled`, not `all`: with `all` a fast webhook rejection would abandon the mail result
     unobserved, and an unobserved rejection is both a lost log line and, in Node, a warning. */
  const settled = await Promise.allSettled(tasks.map((task) => task.run()));
  const failures = settled.flatMap((result, i) =>
    result.status === "rejected"
      ? [{ channel: tasks[i].channel, reason: result.reason }]
      : [],
  );

  if (failures.length > 0) {
    /* Every error stays server-side. An SMTP dialogue carries the account name and sometimes
       the credential state; a webhook error carries the URL. Neither belongs in a fetch
       response. The visitor gets one sentence and the direct email address, which is already on
       the page. */
    for (const failure of failures) {
      console.error(`[contact] ${failure.channel} delivery failed:`, failure.reason);
    }

    /* ⚠️ THE CASE WORTH FINDING IN A LOG LATER. Some channel DID accept this submission and the
       visitor was still told it failed — so the lead exists somewhere, and a duplicate is
       likely when they try again. Named explicitly rather than left to be inferred from which
       error lines are absent. */
    if (failures.length < tasks.length) {
      const ok = tasks
        .map((task) => task.channel)
        .filter((channel) => !failures.some((f) => f.channel === channel));
      console.error(
        `[contact] ⚠️ partial delivery: ${ok.join(", ")} accepted this submission, but the ` +
          "visitor was shown an error and may submit it again.",
      );
    }

    return NextResponse.json(
      { ok: false, error: "Could not send the message." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
