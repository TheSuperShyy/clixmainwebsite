#!/usr/bin/env node
/**
 * block-diff — diff a block's COMPUTED values between the live target and our local build,
 * element for element, at several tiers in one headless session.
 *
 * WHY THIS EXISTS. Screenshots prove a block looks close; they do not prove it matches. On
 * /product this harness caught faults no screenshot would have shown:
 *   · a real `border` where Framer paints an `::after` overlay — 1px on the label, and a
 *     48px tile rendering 50px, because border-box adds the border to a min-height
 *   · an illustration 1px tall at every tier, because its source does NOT preserve its own
 *     aspect ratio and one scale factor cannot hit both axes
 * Both were invisible by eye and obvious in a column of numbers.
 *
 * USAGE
 *
 *   node docs/reference/block-diff.js <config.js> [width ...]
 *
 * The config module exports:
 *
 *   module.exports = {
 *     refUrl:  "https://rogo.com/product",
 *     ourUrl:  "http://localhost:3001/product",
 *     widths:  [1440, 1024, 390],          // optional, overridden by argv
 *     reduceMotion: true,                  // optional; see the note below
 *     // Two expressions returning a JSON string of the SAME shape. Keys are compared by
 *     // name, so give them identical key sets.
 *     ref:  `(() => { ... return JSON.stringify({...}); })()`,
 *     ours: `(() => { ... return JSON.stringify({...}); })()`,
 *   };
 *
 * Output is one aligned line per key with `<<<` on any mismatch.
 *
 * THREE RULES LEARNED THE HARD WAY, all of which will bite silently:
 *
 *  1. **Filter every query on `getBoundingClientRect().width > 0`.** Framer ships one DOM
 *     subtree per breakpoint tier and hides the others with `display:none`. Query without
 *     the filter and you will measure the hidden variant and get plausible, wrong numbers.
 *  2. **Never sleep exactly one animation tick between reads.** It aliases: you land a fixed
 *     offset into the animation every time. For anything timed, set `reduceMotion` and read
 *     the deterministic resting state instead.
 *  3. **`captureBeyondViewport` does not paint far-below-fold content.** If you screenshot
 *     rather than measure, a tall clip can come back with whole blocks blank. That is the
 *     capture, not the page. Scroll and shoot the viewport.
 *
 * No dependencies — Node’s built-in global WebSocket (22+) and Chrome on the standard
 * Windows path. Node 24 is what this repo runs.
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  process.env.LOCALAPPDATA + "/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => p && fs.existsSync(p));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const configPath = process.argv[2];
  if (!configPath) {
    console.error("usage: node docs/reference/block-diff.js <config.js> [width ...]");
    process.exit(2);
  }
  const cfg = require(path.resolve(configPath));
  const widths = process.argv.slice(3).map(Number).filter(Boolean);
  const tiers = widths.length ? widths : cfg.widths || [1440, 1024, 390];

  const port = 9400 + (process.pid % 80);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "block-diff-"));
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--remote-debugging-port=" + port,
      "--user-data-dir=" + profile,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let wsUrl = null;
  for (let i = 0; i < 80 && !wsUrl; i++) {
    try {
      wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl;
    } catch {
      /* not up yet */
    }
    if (!wsUrl) await sleep(250);
  }
  if (!wsUrl) throw new Error("Chrome did not expose a debugging socket");

  /* Node's own global WebSocket (22+), so this script adds no dependency. The `ws` package is
     NOT in this repo — earlier scratch versions of this harness only found it because a stray
     copy sits in the system temp dir. Don't reintroduce that assumption. */
  const sock = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    sock.onopen = res;
    sock.onerror = rej;
  });

  let seq = 0;
  const pending = new Map();
  sock.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  };
  const send = (method, params = {}, sessionId) =>
    new Promise((r) => {
      const id = ++seq;
      pending.set(id, r);
      sock.send(JSON.stringify({ id, method, params, sessionId }));
    });

  const { result: target } = await send("Target.createTarget", { url: "about:blank" });
  const { result: attached } = await send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
  const S = attached.sessionId;
  await send("Page.enable", {}, S);
  await send("Runtime.enable", {}, S);

  let mismatches = 0;

  for (const width of tiers) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: false }, S);
    if (cfg.reduceMotion) {
      await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] }, S);
    }

    const read = async (url, expr) => {
      await send("Page.navigate", { url }, S);
      await sleep(cfg.settleMs || 6000);
      const { result } = await send("Runtime.evaluate", { expression: expr, returnByValue: true }, S);
      /* Two `result`s deep, and it is a real trap: the CDP message is `{result: {result:
         {type, value}}}`, so a single unwrap silently yields `undefined` on both sides. */
      const raw = result && result.result && result.result.value;
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        /* Loud, not a row. A thrown selector returns `undefined` on BOTH sides, which would
           otherwise compare equal and print a triumphant ALL MATCH for a harness that
           measured nothing. */
        throw new Error(`expression failed on ${url} at ${width}px — returned: ${String(raw)}`);
      }
      return parsed;
    };

    const refValues = await read(cfg.refUrl, cfg.ref);
    const ourValues = await read(cfg.ourUrl, cfg.ours);

    console.log(`\n===== ${width} =====`);
    for (const key of Object.keys(refValues)) {
      const a = JSON.stringify(refValues[key]);
      const b = JSON.stringify(ourValues[key]);
      const same = a === b;
      if (!same) mismatches++;
      console.log(` ${key.padEnd(14)} ref ${String(a).padEnd(36)} ours ${b}${same ? "" : "   <<<"}`);
    }
  }

  console.log(`\n${mismatches === 0 ? "ALL MATCH" : mismatches + " mismatch(es)"}`);
  sock.close();
  chrome.kill();
  process.exit(mismatches === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
