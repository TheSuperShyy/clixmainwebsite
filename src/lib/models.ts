/**
 * Live frontier-LLM pricing for the announcement banner's ticker.
 *
 * 2026-08-08, user: *"make it LLM models not company stocks"*. This file previously fetched
 * AI-adjacent EQUITY quotes from Yahoo (NVDA, MSFT, GOOGL, …) with sparklines; the strip now
 * lists the models themselves and what a million tokens costs on each.
 *
 * ---------------------------------------------------------------------------------
 * THE NUMBERS ON THIS SITE ARE REAL — carried over verbatim from the stock version, because
 * it is the reason this file exists rather than a `const MODELS = [...]` with prices typed in
 * by hand. If this ever falls back to fabricated figures it stops being a ticker and becomes
 * the same category of claim as the compliance badges and the executive quotes that came off
 * this page on 2026-08-05. Do not "fix" an outage by inventing prices — render nothing
 * instead, which is what `fetchModels()` does on failure.
 * ---------------------------------------------------------------------------------
 *
 * PROVIDER — OpenRouter's public `/api/v1/models`. Probed 2026-08-08 alongside the
 * alternatives, and it is the only one that clears every bar:
 *
 *   OpenRouter /api/v1/models      200  — no key, no signup, 400 models, live pricing  <- used
 *   OpenRouter /api/frontend/…     404  — the usage-ranking endpoint is not public
 *   LMArena /api/leaderboard       403  — "Route not allowed"
 *   HuggingFace /api/models        200  — download counts, but no pricing and no hosted API
 *
 * WHY THIS IS A BETTER SOURCE THAN THE STOCK FEED IT REPLACES, and worth recording because
 * the old file carried two open risks that are now gone: Yahoo's v8 `/chart` was
 * **undocumented** (v7 had already been closed off mid-flight), and Yahoo's terms **do not
 * licence redistribution of market data on a commercial site**. OpenRouter publishes this
 * endpoint as public API surface and the content is vendor list pricing — public information
 * by nature. No key to leak, and nothing to relicense.
 *
 * Swapping providers is still one function: write another `load…` returning
 * `Promise<ModelPrice[]>` and change `loadModels` below.
 *
 * OpenRouter does send CORS headers, unlike Yahoo — so `/api/models` is no longer strictly
 * required and the client could call upstream directly. It is kept anyway: one server-side
 * fetch cached for every visitor beats one per browser, and it keeps the provider swappable
 * without touching the component.
 */

/**
 * The models the banner shows, in render order. Curated, one flagship per lab — the endpoint
 * returns 400 and most of them are variants (`:batch`, `:free`, quantisations, image models).
 *
 * ⚠️ THESE IDS ROT. Labs retire model slugs, and OpenRouter drops them from the list when
 * they do. That is handled rather than guarded: `fetchModels` skips any id it cannot find, so
 * a retired model quietly leaves the strip instead of breaking it. If the banner looks short,
 * this list is stale — check it against the endpoint rather than assuming an outage.
 *
 * Model names are NOT stored here. They come from the provider's own `name`, split from the
 * `"Lab: "` prefix it sometimes carries, so nothing on the strip is our editorial.
 */
export const MODEL_IDS = [
  "anthropic/claude-opus-5",
  "openai/gpt-5.6-sol",
  "google/gemini-3.6-flash",
  "x-ai/grok-4.5",
  "deepseek/deepseek-v4-pro",
  "meta-llama/llama-4-maverick",
  "mistralai/mistral-large-2512",
  "qwen/qwen3.8-max",
  "moonshotai/kimi-k3",
] as const;

export type ModelPrice = {
  /** OpenRouter slug — stable identity, never rendered. */
  id: string;
  /** Who makes it — `"Anthropic"`, `"OpenAI"`. Empty only if it cannot be determined. */
  lab: string;
  /** Provider's display name with any `"Lab: "` prefix split off into `lab`. */
  name: string;
  /** USD per million input tokens. */
  inputPerM: number;
  /** USD per million output tokens. */
  outputPerM: number;
  /** Context window in tokens, as the provider reports it. */
  context: number;
};

/** How long a fetched price list is reused before the next visitor triggers a refresh. */
export const REVALIDATE_SECONDS = 300;

/**
 * Fallback lab names, keyed on the id namespace.
 *
 * Only consulted when the provider's `name` carries no `"Lab: "` prefix, which it does
 * inconsistently — `claude-sonnet-5` comes back as `"Anthropic: Claude Sonnet 5"` while
 * `claude-opus-5` is plain `"Claude Opus 5"`. Without this the strip would credit some models
 * and not others.
 *
 * These few strings ARE our editorial, and the only such strings on the ticker. They are
 * facts rather than opinions (a namespace maps to exactly one company) but they are still
 * typed by hand, so: a namespace missing from this map renders with no lab rather than a
 * guessed one. Silence beats a wrong attribution.
 */
const LAB_BY_NAMESPACE: Record<string, string> = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  google: "Google",
  "x-ai": "xAI",
  deepseek: "DeepSeek",
  "meta-llama": "Meta",
  mistralai: "Mistral",
  qwen: "Qwen",
  moonshotai: "Moonshot",
};

/**
 * `"Anthropic: Claude Sonnet 5"` -> `{ lab: "Anthropic", name: "Claude Sonnet 5" }`.
 *
 * The provider's own prefix WINS over the map above when it is present, because it is the
 * more current of the two: OpenRouter currently labels `x-ai/*` as `"SpaceXAI"`, and a
 * hand-typed `"xAI"` overriding that would be us asserting something about a company we are
 * not tracking. The map only fills the gap where the provider says nothing.
 *
 * Split on the FIRST `": "` only, since a model name may legitimately contain a later colon.
 *
 * ⚠️ A LAB THAT ALREADY OPENS THE MODEL NAME IS DROPPED. Some labs brand the model after
 * themselves and some do not, so pairing them blindly stutters: "DeepSeek DeepSeek V4 Pro",
 * "Mistral Mistral Large 3", "Qwen Qwen3.8 Max" — against "Anthropic Claude Opus 5" and
 * "Moonshot Kimi K3", which read correctly. Only visible once rendered; the data looks fine.
 * A plain `startsWith` is deliberate rather than a word-boundary test, because "Qwen3.8 Max"
 * carries the lab with no boundary after it and still needs suppressing.
 */
function splitLab(id: string, name: string): { lab: string; name: string } {
  const i = name.indexOf(": ");
  const lab = i !== -1 ? name.slice(0, i) : (LAB_BY_NAMESPACE[id.split("/")[0]] ?? "");
  const model = i !== -1 ? name.slice(i + 2) : name;
  const redundant =
    lab !== "" && model.toLowerCase().startsWith(lab.toLowerCase());
  return { lab: redundant ? "" : lab, name: model };
}

async function loadFromOpenRouter(): Promise<ModelPrice[]> {
  /* One request for the whole catalogue, not one per model. It is ~650 KB of JSON, which is
     why it must not happen per visitor — `next.revalidate` makes it once per 5 minutes for
     everyone. The stock version made eight requests here; this makes one. */
  const res = await fetch("https://openrouter.ai/api/v1/models", {
    signal: AbortSignal.timeout(10000),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return [];

  const json = await res.json();
  const rows: unknown[] = Array.isArray(json?.data) ? json.data : [];
  if (!rows.length) return [];

  /* Everything off the wire is `unknown` and narrowed at the point of use. The endpoint is
     third-party and unversioned; a shape change should drop rows, not throw. */
  type Row = {
    name?: string;
    context_length?: number;
    pricing?: { prompt?: string; completion?: string };
  };

  const byId = new Map<string, Row>();
  for (const row of rows) {
    const r = row as Row & { id?: unknown };
    if (typeof r.id === "string") byId.set(r.id, r);
  }

  const out: ModelPrice[] = [];
  for (const id of MODEL_IDS) {
    const m = byId.get(id);
    if (!m) continue; /* retired upstream — see the note on MODEL_IDS */

    /* Pricing arrives as decimal strings PER TOKEN ("0.00001"), so the ×1e6 is what turns it
       into the per-million figure every lab quotes on its own pricing page. */
    const inputPerM = Number(m.pricing?.prompt) * 1e6;
    const outputPerM = Number(m.pricing?.completion) * 1e6;
    if (!isFinite(inputPerM) || !isFinite(outputPerM)) continue;

    out.push({
      id,
      ...splitLab(id, m.name ?? id),
      inputPerM,
      outputPerM,
      context: typeof m.context_length === "number" ? m.context_length : 0,
    });
  }
  return out;
}

/** The single seam a different provider plugs into. */
const loadModels = loadFromOpenRouter;

/**
 * Every model in `MODEL_IDS` order, skipping any the provider no longer lists.
 *
 * Returns `[]` rather than throwing when the endpoint is down or has changed shape. The
 * banner treats an empty array as "render no strip at all", so an outage costs the page a
 * 45px band and nothing else — it never shows a stale-looking or invented number.
 */
export async function fetchModels(): Promise<ModelPrice[]> {
  try {
    return await loadModels();
  } catch {
    return [];
  }
}
